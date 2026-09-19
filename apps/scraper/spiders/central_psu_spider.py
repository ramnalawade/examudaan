# ============================================================
# spiders/central_psu_spider.py
# ExamUdaan | Central PSU — Energy, Infrastructure, Defence
# Run: scrapy crawl central_psu
#
# Covers major PSUs NOT already in psu_mega_spider:
#   - NTPC (careers.ntpc.co.in)
#   - BHEL (careers.bhel.in)
#   - SAIL (sail.co.in/careers)
#   - GAIL (gail.nic.in/careers)
#   - PGCIL/Powergrid (powergridindia.com/careers)
#   - ONGC (ongcindia.com/careers) — also in stub ongc_spider
#   - Oil India (oil-india.com/recruitment)
#   - HPCL (hindustanpetroleum.com/careers)
#   - BPCL (bharatpetroleum.in/careers)
#   - IOCL (indianoil.in/careers)
#   - CPCL (cpcl.co.in/careers) — Chennai Petroleum
#   - MRPL (mrpl.co.in/careers)
#   - HAL (hal-india.co.in/careers)
#   - BEL (bel-india.in/careers)
#   - DRDO (drdo.gov.in/careers)
#   - BARC (barc.gov.in/careers)
#   - NLC (nlcindia.in/careers) — Neyveli Lignite
#   - NMDC (nmdc.co.in/careers)
#   - MOIL (moil.nic.in/careers) — already in moil spider
#   - MECL (mecl.co.in/careers) — already in mecl spider
#   - AAI (aai.aero/en/careers)
#   - PNGRB (pngrb.gov.in/careers)
# ============================================================

import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


PSU_SOURCES = [
    # Power Sector
    ("ntpc",          "NTPC Limited",                              "NTPC",   "Central",
     "https://careers.ntpc.co.in/", []),

    ("pgcil",         "Power Grid Corporation of India",           "PGCIL",  "Central",
     "https://www.powergridindia.com/careers", []),

    ("nhpc",          "National Hydroelectric Power Corporation",  "NHPC",   "Central",
     "https://www.nhpcindia.com/Default.aspx?id=261&lid=2&tid=1", []),

    ("sjvn",          "SJVN Limited",                              "SJVN",   "Himachal Pradesh",
     "https://www.sjvn.nic.in/careers-opportunities.htm", []),

    # Steel & Mining
    ("sail",          "Steel Authority of India Limited",          "SAIL",   "Central",
     "https://www.sail.co.in/en/careers/recruitment", []),

    ("nmdc",          "NMDC Limited",                              "NMDC",   "Chhattisgarh",
     "https://www.nmdc.co.in/careers", []),

    ("nlc",           "NLC India Limited",                         "NLC",    "Tamil Nadu",
     "https://www.nlcindia.in/careers/index.htm", []),

    ("rinl",          "RINL Vizag Steel",                          "RINL",   "Andhra Pradesh",
     "https://rinl.in/career/", []),

    # Oil & Gas
    ("oil_india",     "Oil India Limited",                         "OIL",    "Assam",
     "https://www.oil-india.com/Recruitment.aspx", []),

    ("hpcl",          "Hindustan Petroleum Corporation Limited",   "HPCL",   "Central",
     "https://hindustanpetroleum.com/careers", []),

    ("bpcl",          "Bharat Petroleum Corporation Limited",      "BPCL",   "Central",
     "https://bharatpetroleum.in/careers/career-opportunities.aspx", []),

    ("iocl",          "Indian Oil Corporation Limited",            "IOCL",   "Central",
     "https://www.iocl.com/careers/recruitment-advertisement", []),

    ("cpcl",          "Chennai Petroleum Corporation Limited",     "CPCL",   "Tamil Nadu",
     "https://www.cpcl.co.in/careers", []),

    ("mrpl",          "Mangalore Refinery and Petrochemicals",     "MRPL",   "Karnataka",
     "https://www.mrpl.co.in/careers", []),

    ("gail",          "GAIL India Limited",                        "GAIL",   "Central",
     "https://www.gail.nic.in/writereaddata/careers.htm", []),

    # Defence & Aerospace
    ("hal",           "Hindustan Aeronautics Limited",             "HAL",    "Karnataka",
     "https://www.hal-india.co.in/Careers/AvailableCareerOpp", []),

    ("bel",           "Bharat Electronics Limited",                "BEL",    "Central",
     "https://www.bel-india.in/Careers", []),

    ("drdo",          "Defence Research and Development Organisation", "DRDO", "Central",
     "https://www.drdo.gov.in/careers", []),

    ("barc",          "Bhabha Atomic Research Centre",             "BARC",   "Maharashtra",
     "https://www.barc.gov.in/recruitment/", []),

    ("bel",           "Bharat Earth Movers Limited",               "BEML",   "Karnataka",
     "https://www.bemlindia.in/WriteReadData/CMS/Content/JobsatBEML.aspx", []),

    # Heavy Engineering
    ("bhel",          "Bharat Heavy Electricals Limited",          "BHEL",   "Central",
     "https://careers.bhel.in/", []),

    ("hcl_tech",      "Hindustan Copper Limited",                  "HCL",    "Rajasthan",
     "https://hindustancopper.com/Recruitment.aspx", []),

    # Transport / Infrastructure
    ("aai",           "Airports Authority of India",               "AAI",    "Central",
     "https://www.aai.aero/en/careers/recruitment-notifications", []),

    ("concor",        "Container Corporation of India",            "CONCOR", "Central",
     "https://www.concorindia.com/careers.asp", []),

    ("ircon",         "IRCON International Limited",               "IRCON",  "Central",
     "https://www.ircon.org/index.php/careers", []),

    ("rites",         "RITES Limited",                             "RITES",  "Central",
     "https://www.rites.com/web/index.php/careers", []),

    ("nbcc",          "National Buildings Construction Corporation", "NBCC", "Central",
     "https://nbccindia.com/nbccindia/nroot/njsp/Recruitments.jsp", []),

    ("wapcos",        "WAPCOS Limited",                            "WAPCOS", "Central",
     "https://www.wapcos.gov.in/career.html", []),

    # Atomic Energy / Space
    ("npcil",         "Nuclear Power Corporation of India",        "NPCIL",  "Central",
     "https://www.npcilcareers.co.in/", []),

    ("isro_sac",      "ISRO / Space Applications Centre",          "ISROSAC","Gujarat",
     "https://www.sac.gov.in/Vyom/ui/Vacancy.jsp", []),
]

PSU_KEYWORDS = [
    "recruitment", "vacancy", "notification", "advertisement", "apply",
    "career", "trainee", "apprentice", "engineer", "officer", "manager",
    "executive", "technician", "operator", "supervisor", "assistant",
    "result", "admit", "answer key", "syllabus", "selection",
    "walk-in", "interview", "gate", "written test",
]


class CentralPSUSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Covers 30 major Central PSUs across energy, steel, oil, defence,
    aerospace and infrastructure sectors.
    These are high-quality, high-paying permanent government jobs.
    """

    name = "central_psu"
    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "RANDOMIZE_DOWNLOAD_DELAY": True,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
    }

    # Build allowed_domains from source URLs
    allowed_domains = list({
        url.split("//")[-1].split("/")[0].replace("www.", "")
        for _, _, _, _, url, _ in PSU_SOURCES
    })

    def start_requests(self):
        for board_slug, org_name, acronym, state, url, extras in PSU_SOURCES:
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
        self.logger.info(f"[central_psu] {meta['org_acronym']}: {response.url}")
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
            elif any(kw in t_low for kw in PSU_KEYWORDS):
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
        m = re.search(r"(\d[\d,]+)\s*(posts?|vacancies|vacancy|seats?|trainees?)", text, re.IGNORECASE)
        if m:
            item["total_vacancies"] = int(m.group(1).replace(",", ""))

        apply = response.css("a:contains('Apply')::attr(href)").get()
        if apply:
            item["apply_link"] = response.urljoin(apply)

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
        self.logger.warning(f"[central_psu] Error: {failure.request.url} — {failure.value}")
