# ============================================================
# spiders/nhm_spider.py
# ExamUdaan | National Health Mission — State-Level Recruitment
# Run: scrapy crawl nhm
#
# NHM is the LARGEST employer in the health sector in India.
# Each state has its own NHM portal with thousands of vacancies:
#   ANM, Staff Nurse, ASHA, Block Programme Manager, Data Entry Operator,
#   Lab Technician, Medical Officer, Community Health Officer (CHO), etc.
#
# Covers all major states:
#   Maharashtra, UP, Bihar, MP, Rajasthan, Gujarat, Karnataka,
#   Tamil Nadu, West Bengal, Odisha, Jharkhand, Chhattisgarh,
#   Assam, Punjab, Haryana, Himachal Pradesh, Telangana, Andhra Pradesh
# ============================================================

import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


# (board_slug, org_name, acronym, state, url)
NHM_SOURCES = [
    ("nhm_maharashtra", "National Health Mission Maharashtra",
     "NHMMAHARASHTRA", "Maharashtra",
     "https://arogya.maharashtra.gov.in/Site/Recruitment/Listing/1"),

    ("nhm_up",          "National Health Mission Uttar Pradesh",
     "NHMUP",           "Uttar Pradesh",
     "https://upnrhm.gov.in/site/recruitment"),

    ("nhm_bihar",       "National Health Mission Bihar",
     "NHMBIHAR",        "Bihar",
     "https://statehealthsocietybihar.org/recruitment"),

    ("nhm_mp",          "National Health Mission Madhya Pradesh",
     "NHMMP",           "Madhya Pradesh",
     "https://www.nhmmp.gov.in/Vacancy.aspx"),

    ("nhm_rajasthan",   "National Health Mission Rajasthan",
     "NHMRAJ",          "Rajasthan",
     "https://rajswasthya.nic.in/recruitment.htm"),

    ("nhm_gujarat",     "National Health Mission Gujarat",
     "NHMGUJ",          "Gujarat",
     "https://www.gwssb.org/"),   # Gujarat Water / Health missions share portal

    ("nhm_karnataka",   "National Health Mission Karnataka",
     "NHMKAR",          "Karnataka",
     "https://www.dhfwk.gov.in/Recruitment"),

    ("nhm_tamilnadu",   "National Health Mission Tamil Nadu",
     "NHMTN",           "Tamil Nadu",
     "https://www.tnhealth.tn.gov.in/dme/recruitment.jsp"),

    ("nhm_west_bengal", "National Health Mission West Bengal",
     "NHMWB",           "West Bengal",
     "https://www.wbhealth.gov.in/pages/recruitment"),

    ("nhm_odisha",      "National Health Mission Odisha",
     "NHMODISHA",       "Odisha",
     "https://www.nrhmorissa.gov.in/recruitment"),

    ("nhm_jharkhand",   "National Health Mission Jharkhand",
     "NHMJHK",          "Jharkhand",
     "https://www.jharkhand.gov.in/nrhm"),

    ("nhm_chhattisgarh","National Health Mission Chhattisgarh",
     "NHMCG",           "Chhattisgarh",
     "https://cghealth.nic.in/cghealth17/vacancy.htm"),

    ("nhm_assam",       "National Health Mission Assam",
     "NHMASSAM",        "Assam",
     "https://nhm.assam.gov.in/frontimpotentdata/recruitment"),

    ("nhm_punjab",      "National Health Mission Punjab",
     "NHMPB",           "Punjab",
     "https://pbhealth.gov.in/recruitment/"),

    ("nhm_haryana",     "National Health Mission Haryana",
     "NHMHR",           "Haryana",
     "https://nhmharyana.gov.in/recruitment"),

    ("nhm_telangana",   "National Health Mission Telangana",
     "NHMTS",           "Telangana",
     "https://hmfw.telangana.gov.in/Recruitment.aspx"),

    ("nhm_andhra",      "National Health Mission Andhra Pradesh",
     "NHMAP",           "Andhra Pradesh",
     "https://hmfw.ap.gov.in/Recruitment.aspx"),

    ("nhm_himachal",    "National Health Mission Himachal Pradesh",
     "NHMHP",           "Himachal Pradesh",
     "https://nhm.hp.gov.in/index.php/recruitment"),

    ("nhm_uttarakhand", "National Health Mission Uttarakhand",
     "NHMUK",           "Uttarakhand",
     "https://ukhfws.org/recruitment"),

    ("nhm_kerala",      "National Health Mission Kerala",
     "NHMKL",           "Kerala",
     "https://arogyakerala.org/recruitment/"),
]

NHM_KEYWORDS = [
    "recruitment", "vacancy", "notification", "apply", "advertisement",
    "nurse", "doctor", "medical officer", "anm", "gnm", "asha",
    "community health", "data entry", "lab technician", "block",
    "pharmacist", "programme manager", "result", "admit", "interview",
    "walk-in", "walkin", "cho", "mphw", "counsellor",
]


class NHMSpider(DuplicateStopMixin, scrapy.Spider):
    """
    National Health Mission recruitment across 20 major states.
    NHM hires ANM, Staff Nurse, Lab Technician, Block PM, CHO etc.
    Tens of thousands of posts annually — huge coverage gain.
    """

    name = "nhm"
    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "RANDOMIZE_DOWNLOAD_DELAY": True,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
    }

    allowed_domains = list({
        url.split("//")[-1].split("/")[0].replace("www.", "")
        for _, _, _, _, url in NHM_SOURCES
    })

    def start_requests(self):
        for board_slug, org_name, acronym, state, url in NHM_SOURCES:
            meta = {
                "board_slug":  board_slug,
                "org_name":    org_name,
                "org_acronym": acronym,
                "state":       state,
            }
            yield scrapy.Request(
                url,
                callback=self.parse,
                meta=meta,
                errback=self.on_error,
            )

    def parse(self, response):
        meta = response.meta
        self.logger.info(f"[nhm] {meta['org_acronym']}: {response.url}")
        seen = set()

        for link in response.css("a"):
            href  = link.attrib.get("href", "")
            title = (link.xpath("string(.)").get() or "").strip()
            url   = response.urljoin(href)

            if not title or len(title) < 6 or url in seen:
                continue
            if href.endswith((".jpg", ".png", ".gif", ".ico", ".js", ".css")):
                continue

            seen.add(url)
            t_low = title.lower()

            if url.lower().endswith(".pdf"):
                item = self._make(title, url, meta)
                if item:
                    item["notification_pdf_url"] = url
                    yield item
            elif any(kw in t_low for kw in NHM_KEYWORDS):
                yield response.follow(
                    url,
                    callback=self.parse_detail,
                    meta=dict(meta, title=title),
                    errback=self.on_error,
                )

    def parse_detail(self, response):
        meta  = response.meta
        title = (
            meta.get("title")
            or response.css("h1::text, h2::text").get("")
        ).strip()
        if not title or len(title) < 6:
            return

        item = self._make(title, response.url, meta)
        if not item:
            return

        # PDF link
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        # Extract vacancies
        text = " ".join(response.css("*::text").getall())
        m = re.search(r"(\d[\d,]+)\s*(posts?|vacancies|vacancy|seats?)", text, re.IGNORECASE)
        if m:
            item["total_vacancies"] = int(m.group(1).replace(",", ""))

        # Detect walk-in interviews — common in NHM hiring
        if "walk-in" in text.lower() or "walkin" in text.lower():
            item["employment_type"] = "contractual"

        yield item

    def _make(self, title, url, meta):
        acronym = meta["org_acronym"]
        dedup_hash = hashlib.sha256(f"{acronym}_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = meta["board_slug"]
        item["org_name"]         = meta["org_name"]
        item["org_acronym"]      = acronym
        item["source_url"]       = url
        item["official_website"] = url
        item["state"]            = [meta["state"]]
        item["dedup_hash"]       = dedup_hash

        t = title.lower()
        if any(k in t for k in ["result", "merit list", "selected", "final list"]):
            item["notification_type"] = "result"
        elif any(k in t for k in ["admit card", "call letter", "hall ticket"]):
            item["notification_type"] = "admit_card"
        elif any(k in t for k in ["answer key", "answer-key"]):
            item["notification_type"] = "answer_key"
        elif any(k in t for k in ["syllabus", "exam pattern"]):
            item["notification_type"] = "syllabus"
        else:
            item["notification_type"] = "recruitment"

        return item

    def on_error(self, failure):
        self.logger.warning(f"[nhm] Error: {failure.request.url} — {failure.value}")
