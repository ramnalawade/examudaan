# ============================================================
# spiders/state_education_spider.py
# ExamUdaan | State Education Boards & Teacher Recruitment
# Run: scrapy crawl state_education
#
# Covers:
#   - MAHA TET / Shikshak Bharti (mahapariksha.gov.in)
#   - Zilla Parishad Teacher Recruitment (various ZP portals)
#   - KVS (Kendriya Vidyalaya Sangathan) — central school teachers
#   - NVS (Navodaya Vidyalaya Samiti)
#   - DSSSB (Delhi Subordinate Services Selection Board)
#   - Sainik Schools (sainikschooladmission.in)
#   - AISSEE (All India Sainik Schools Entrance Exam)
#   - State School Education Boards (Rajasthan, UP, Bihar, MP)
#   - Eklavya Model Residential Schools (EMRS)
#   - HTET, REET, TN TRB, AP TET, Telangana TET
# ============================================================

import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


EDU_SOURCES = [
    # Maharashtra
    ("maha_pariksha",    "Maharashtra Pariksha Parishad",            "MAHAP",   "Maharashtra",
     "https://mahapariksha.gov.in/", []),

    ("maha_shikshan",    "Maharashtra State Council of Examination", "MSCE",    "Maharashtra",
     "https://www.mscepune.in/", []),

    # Central Schools
    ("kvs",              "Kendriya Vidyalaya Sangathan",              "KVS",     "Central",
     "https://kvsangathan.nic.in/Recruitment", [
         "https://kvsroahmedabad.kvs.gov.in/",
     ]),

    ("nvs",              "Navodaya Vidyalaya Samiti",                "NVS",     "Central",
     "https://navodaya.gov.in/nvs/nvs-section/Recruitment/en/Home/", []),

    # Sainik Schools
    ("sainik_schools",   "Sainik Schools Society",                   "SAINIK",  "Central",
     "https://sainikschooladmission.in/pages/noticeboard", []),

    # Eklavya Model Residential Schools
    ("emrs",             "Eklavya Model Residential Schools",        "EMRS",    "Central",
     "https://emrs.tribal.gov.in/recruitment.html", []),

    # Delhi
    ("dsssb",            "Delhi Subordinate Services Selection Board","DSSSB",   "Delhi",
     "https://dsssb.delhi.gov.in/page/notice-board", [
         "https://dsssb.delhi.gov.in/page/recruitment",
     ]),

    # Rajasthan — REET + RSMSSB
    ("reet",             "Rajasthan Eligibility Exam for Teacher",   "REET",    "Rajasthan",
     "https://rajeduboard.rajasthan.gov.in/", []),

    # Haryana — HTET
    ("htet",             "Haryana Teacher Eligibility Test Board",   "HTET",    "Haryana",
     "https://bseh.org.in/home", []),

    # Tamil Nadu — TRB
    ("tn_trb",           "Teachers Recruitment Board Tamil Nadu",    "TNTRB",   "Tamil Nadu",
     "https://trb.tn.nic.in/", []),

    # Telangana — DSE
    ("ts_dse",           "Directorate of School Education Telangana","TSDSE",   "Telangana",
     "https://schooleducation.telangana.gov.in/", []),

    # UP — UP Basic Education Board
    ("up_beb",           "UP Basic Education Board",                 "UPBEB",   "Uttar Pradesh",
     "https://updeled.gov.in/", [
         "https://upbasiceduboard.gov.in/",
     ]),

    # Bihar — BPSC Teacher
    ("bihar_teacher",    "Bihar Public Service Commission (Teacher)", "BPSCTEACHER", "Bihar",
     "https://bpsc.bih.nic.in/Advt.aspx", []),

    # MP — MPTET
    ("mptet",            "Madhya Pradesh Professional Examination Board", "MPPEB", "Madhya Pradesh",
     "https://peb.mp.gov.in/", []),

    # Karnataka — KARTET
    ("kartet",           "Karnataka School Examination Board",       "KSEAB",   "Karnataka",
     "https://kseab.karnataka.gov.in/frontpage", []),

    # Andhra Pradesh — AP TET
    ("ap_tet",           "Andhra Pradesh Teacher Eligibility Test",  "APTET",   "Andhra Pradesh",
     "https://aptet.apcfss.in/", []),

    # West Bengal — WB TET
    ("wb_tet",           "West Bengal Board of Primary Education",   "WBBPE",   "West Bengal",
     "https://wbbpe.org/recruitment/", []),
]

EDU_KEYWORDS = [
    "recruitment", "vacancy", "notification", "advt", "advertisement",
    "teacher", "shikshak", "tet", "tat", "trb", "ctet",
    "apply", "admit", "result", "merit list", "selection list",
    "primary teacher", "secondary teacher", "trained graduate teacher",
    "post graduate teacher", "tgt", "pgt", "kvs", "nvs",
    "junior teacher", "assistant teacher", "special educator",
]


class StateEducationSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Covers state education boards and teaching recruitment bodies:
    KVS, NVS, DSSSB, REET, HTET, TN TRB, Telangana DSE,
    Maharashtra Pariksha Parishad, UP Basic Education Board, etc.
    Teacher jobs are massive in volume and highly sought by graduates.
    """

    name = "state_education"
    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "RANDOMIZE_DOWNLOAD_DELAY": True,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
    }

    allowed_domains = list({
        url.split("//")[-1].split("/")[0].replace("www.", "")
        for _, _, _, _, url, _ in EDU_SOURCES
    })

    def start_requests(self):
        for board_slug, org_name, acronym, state, url, extras in EDU_SOURCES:
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
        self.logger.info(f"[state_education] {meta['org_acronym']}: {response.url}")
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
            elif any(kw in t_low for kw in EDU_KEYWORDS):
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
        m = re.search(r"(\d[\d,]+)\s*(posts?|vacancies|vacancy|seats?|teachers?)", text, re.IGNORECASE)
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
        if any(k in t for k in ["result", "merit list", "selected", "final list", "score card"]):
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
        self.logger.warning(f"[state_education] Error: {failure.request.url} — {failure.value}")
