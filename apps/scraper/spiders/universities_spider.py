# ============================================================
# spiders/universities_spider.py
# ExamUdaan | University Recruitment (Teaching + Non-Teaching)
# Run: scrapy crawl universities
#
# Major universities and autonomous institutes:
#   - Savitribai Phule Pune University (SPPU)
#   - University of Mumbai
#   - RTM Nagpur University
#   - Dr. Babasaheb Ambedkar Marathwada University, Aurangabad
#   - SNDT Women's University, Mumbai
#   - Shivaji University, Kolhapur
#   - North Maharashtra University, Jalgaon
#   - SGB Amravati University
#   - Swami Ramanand Teertha Marathwada University (SRTMU)
#   - IIT Bombay (non-teaching)
#   - IIT Pune (non-teaching)
#   - University of Delhi
#   - Jawaharlal Nehru University (JNU)
#   - Banaras Hindu University (BHU)
#   - Aligarh Muslim University (AMU)
#   - Hyderabad University
#   - Jadavpur University, Kolkata
#   - Calcutta University
#   - Panjab University, Chandigarh
# ============================================================

import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


UNI_SOURCES = [
    # Maharashtra universities
    ("sppu",          "Savitribai Phule Pune University",         "SPPU",   "Maharashtra",
     "http://www.unipune.ac.in/university_files/notifications.aspx", []),

    ("mumbai_uni",    "University of Mumbai",                     "UMUMB",  "Maharashtra",
     "https://mu.ac.in/recruitment", []),

    ("rtm_nagpur",    "Rashtrasant Tukadoji Maharaj Nagpur University", "RTMNU", "Maharashtra",
     "https://www.nagpuruniversity.ac.in/recruitment-details.aspx", []),

    ("bamu",          "Dr. Babasaheb Ambedkar Marathwada University", "BAMU", "Maharashtra",
     "https://www.bamu.ac.in/en/page/recruitment", []),

    ("sndt",          "SNDT Women's University",                  "SNDT",   "Maharashtra",
     "https://www.sndt.ac.in/recruitment", []),

    ("shivaji_uni",   "Shivaji University Kolhapur",              "SUK",    "Maharashtra",
     "https://www.unishivaji.ac.in/home/RecruitmentDetails", []),

    ("north_maha_uni","North Maharashtra University Jalgaon",     "NMU",    "Maharashtra",
     "https://www.nmu.ac.in/Pages/Advertisement.aspx", []),

    ("sgb_amravati",  "Sant Gadge Baba Amravati University",      "SGBAU",  "Maharashtra",
     "https://www.sgbau.ac.in/en/page/recruitment", []),

    ("srtmu",         "Swami Ramanand Teertha Marathwada University", "SRTMU", "Maharashtra",
     "https://srtmun.ac.in/en/page/recruitment", []),

    # IITs — non-teaching posts
    ("iit_bombay",    "IIT Bombay",                               "IITB",   "Maharashtra",
     "https://www.iitb.ac.in/en/career/non-teaching", []),

    # Delhi area
    ("du",            "University of Delhi",                      "DU",     "Delhi",
     "https://recruitment.uod.ac.in/", []),

    ("jnu",           "Jawaharlal Nehru University",              "JNU",    "Delhi",
     "https://www.jnu.ac.in/Faculty&StaffRecruitment", []),

    # North India
    ("bhu",           "Banaras Hindu University",                 "BHU",    "Uttar Pradesh",
     "https://bhu.ac.in/site/recruitment", []),

    ("amu",           "Aligarh Muslim University",                "AMU",    "Uttar Pradesh",
     "https://www.amu.ac.in/recruitments", []),

    ("panjab_uni",    "Panjab University Chandigarh",             "PU",     "Punjab",
     "https://puchd.ac.in/subindex.php?page=jobs", []),

    # South India
    ("hcu",           "University of Hyderabad",                  "HCU",    "Telangana",
     "https://uohyd.ac.in/index.php/recruitment", []),

    # East India
    ("jadavpur",      "Jadavpur University",                      "JU",     "West Bengal",
     "https://jadavpuruniversity.in/recruitment", []),

    ("calcutta_uni",  "University of Calcutta",                   "CALUNI", "West Bengal",
     "https://www.caluniv.ac.in/academic/Emp-Ads.html", []),
]

UNI_KEYWORDS = [
    "recruitment", "vacancy", "advertisement", "notification", "apply",
    "professor", "assistant professor", "associate professor", "lecturer",
    "registrar", "librarian", "engineer", "assistant", "clerk",
    "superintendent", "junior assistant", "officer", "section officer",
    "result", "admit", "interview", "walk-in", "teaching", "non-teaching",
    "deputation", "appointment", "selection",
]


class UniversitiesSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Covers 18 major universities across India — both teaching and
    non-teaching recruitment. University jobs are highly sought after
    for job security and central/state pay scales.
    """

    name = "universities"
    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "RANDOMIZE_DOWNLOAD_DELAY": True,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
    }

    allowed_domains = list({
        url.split("//")[-1].split("/")[0].replace("www.", "")
        for _, _, _, _, url, _ in UNI_SOURCES
    })

    def start_requests(self):
        for board_slug, org_name, acronym, state, url, extras in UNI_SOURCES:
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
        self.logger.info(f"[universities] {meta['org_acronym']}: {response.url}")
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
            elif any(kw in t_low for kw in UNI_KEYWORDS):
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
        m = re.search(r"(\d[\d,]+)\s*(posts?|vacancies|vacancy|seats?|position)", text, re.IGNORECASE)
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
        self.logger.warning(f"[universities] Error: {failure.request.url} — {failure.value}")
