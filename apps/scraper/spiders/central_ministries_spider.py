# ============================================================
# spiders/central_ministries_spider.py
# ExamUdaan | Central Government Ministries & Departments
# Run: scrapy crawl central_ministries
#
# Covers direct recruitment by central ministries — these bypass
# SSC/UPSC and recruit directly via department websites:
#   - Ministry of External Affairs (mea.gov.in)
#   - Ministry of Defence (mod.gov.in)
#   - Ministry of Home Affairs (mha.gov.in)
#   - Ministry of Finance (finmin.nic.in)
#   - Ministry of Railways (indianrailways.gov.in)
#   - Ministry of Law & Justice (doj.gov.in)
#   - Ministry of Health (mohfw.gov.in)
#   - Ministry of Agriculture (agricoop.nic.in)
#   - Directorate General of Health Services (dghs.gov.in)
#   - DPIIT (dipp.gov.in) — Department for Promotion of Industry
#   - Income Tax Department (incometaxindia.gov.in)
#   - Customs & Central Excise (cbic.gov.in)
#   - Comptroller & Auditor General (cag.gov.in)
#   - Election Commission of India (eci.gov.in)
#   - NHRC (nhrc.nic.in)
#   - Lok Sabha Secretariat (loksabha.nic.in)
#   - Rajya Sabha Secretariat (rajyasabha.gov.in)
#   - Supreme Court of India (sci.gov.in)
#   - Press Information Bureau (pib.gov.in)
#   - Doordarshan / AIR (prasarbharati.gov.in)
# ============================================================

import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


MINISTRY_SOURCES = [
    # Judiciary / Legislature
    ("supreme_court",    "Supreme Court of India",                   "SCI",     "Central",
     "https://sci.gov.in/recruitment/", []),

    ("lok_sabha",        "Lok Sabha Secretariat",                    "LOKSABHA","Central",
     "https://loksabha.nic.in/writereaddata/Portal/Jobs/", []),

    ("rajya_sabha",      "Rajya Sabha Secretariat",                  "RAJYASABHA","Central",
     "https://rajyasabha.gov.in/rsnew/recruitment/recruitment.aspx", []),

    # Constitutional Bodies
    ("eci",              "Election Commission of India",             "ECI",     "Central",
     "https://eci.gov.in/jobs-announcements/", []),

    ("cag",              "Comptroller and Auditor General",          "CAG",     "Central",
     "https://cag.gov.in/vacancies/current-vacancies", []),

    ("upsc_iit_admin",   "UPSC (Other Exams)",                       "UPSCOTHER","Central",
     "https://upsconline.nic.in/", []),

    # Tax / Finance
    ("cbic",             "Central Board of Indirect Taxes & Customs","CBIC",    "Central",
     "https://www.cbic.gov.in/htdocs-cbec/jobs", []),

    ("income_tax",       "Income Tax Department",                    "ITD",     "Central",
     "https://www.incometax.gov.in/iec/foportal/help/recruitment", []),

    # Health & Family Welfare
    ("mohfw",            "Ministry of Health & Family Welfare",      "MOHFW",   "Central",
     "https://main.mohfw.gov.in/recruitments", []),

    ("dghs",             "Directorate General of Health Services",   "DGHS",    "Central",
     "https://dghs.gov.in/content/1350_3_Recruitment.aspx", []),

    # NHRC
    ("nhrc",             "National Human Rights Commission",         "NHRC",    "Central",
     "https://nhrc.nic.in/about-us/recruitment", []),

    # Media
    ("prasar_bharati",   "Prasar Bharati (Doordarshan / AIR)",       "PBDD",    "Central",
     "https://prasarbharati.gov.in/recruitment/", []),

    # Agriculture
    ("agriculture",      "Ministry of Agriculture & Farmers Welfare","MOAFW",   "Central",
     "https://agriwelfare.gov.in/en/recruitment", []),

    # Law & Justice
    ("doj",              "Department of Justice",                    "DOJ",     "Central",
     "https://doj.gov.in/node/1089", []),

    # Commerce & Industry
    ("dpiit",            "Department for Promotion of Industry & Internal Trade", "DPIIT", "Central",
     "https://dpiit.gov.in/recruitment", []),

    # Postal
    ("dop",              "Department of Posts India",                "DOP",     "Central",
     "https://www.indiapost.gov.in/VAS/Pages/Content/Recruitment.aspx", []),

    # Ministry of Defence (civilian posts)
    ("mod_civilian",     "Ministry of Defence (Civilian)",           "MOD",     "Central",
     "https://mod.gov.in/Recruitment.aspx", []),

    # Ministry of Railways (directly — besides RRB)
    ("railways_direct",  "Ministry of Railways (Direct Recruitment)","RAILWAYSDIRECT","Central",
     "https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,553", []),

    # Ministry of External Affairs
    ("mea",              "Ministry of External Affairs",             "MEA",     "Central",
     "https://www.mea.gov.in/jobs.htm", []),

    # MHA — direct recruitment (besides CRPF/BSF already in other spider)
    ("mha_direct",       "Ministry of Home Affairs (Direct)",        "MHADIRECT","Central",
     "https://mha.gov.in/en/recruitment", []),
]

MINISTRY_KEYWORDS = [
    "recruitment", "vacancy", "notification", "advertisement", "advt",
    "apply", "career", "post", "clerk", "officer", "assistant",
    "stenographer", "chsl", "cgle", "deputation", "interview",
    "result", "admit", "answer key", "syllabus", "selection",
    "direct recruit", "walk-in",
]


class CentralMinistriesSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes 20 Central Government ministry and constitutional body
    websites for direct recruitment notifications.
    These include Supreme Court, Lok Sabha, CAG, ECI, CBIC, Income Tax,
    DGHS, Prasar Bharati, India Post and several ministries.
    """

    name = "central_ministries"
    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "RANDOMIZE_DOWNLOAD_DELAY": True,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
    }

    allowed_domains = list({
        url.split("//")[-1].split("/")[0].replace("www.", "")
        for _, _, _, _, url, _ in MINISTRY_SOURCES
    })

    def start_requests(self):
        for board_slug, org_name, acronym, state, url, extras in MINISTRY_SOURCES:
            meta = {
                "board_slug":  board_slug,
                "org_name":    org_name,
                "org_acronym": acronym,
                "state":       state,
            }
            yield scrapy.Request(url, callback=self.parse, meta=meta, errback=self.on_error)
            for extra in extras:
                yield scrapy.Request(extra, callback=self.parse, meta=meta, errback=self.on_error)

    def parse(self, response):
        meta = response.meta
        self.logger.info(f"[central_ministries] {meta['org_acronym']}: {response.url}")
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
            elif any(kw in t_low for kw in MINISTRY_KEYWORDS):
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

        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        text = " ".join(response.css("*::text").getall())
        m = re.search(r"(\d[\d,]+)\s*(posts?|vacancies|vacancy|seats?)", text, re.IGNORECASE)
        if m:
            item["total_vacancies"] = int(m.group(1).replace(",", ""))

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
        if any(k in t for k in ["result", "merit list", "selected"]):
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
        self.logger.warning(f"[central_ministries] Error: {failure.request.url} — {failure.value}")
