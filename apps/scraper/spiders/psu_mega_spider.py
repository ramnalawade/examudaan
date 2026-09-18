# ============================================================
# spiders/psu_mega_spider.py — Multi-org PSU / Insurance / Infrastructure
# ExamUdaan | Covers 20+ central PSU & autonomous body career pages
# Run: scrapy crawl psu_mega
#
# From user's Excel (image 2):
#   Insurance PSU: UIIC, NIACL, OIC, LIC
#   Banking: RBI (RSS already), NABARD, NTPC, ONGC, IOCL, BPCL, HPCL
#   Energy PSU: PGCIL (Power Grid)
#   Defense R&D: DRDO/CEPTAM, BARC, HAL, BEL
#   Infrastructure: AAI, DMRC, NCRTC, RITES
#   Autonomous: NIC, FCI, ESIC/EPFO
#
# URL filtering:
#   - Only follows links whose URL path contains a career/recruitment keyword
#     OR whose link title contains a recruitment keyword.
#   - Noise PDFs (creditor lists, MSME docs, annual reports) are rejected.
#   - DuplicateStopMixin.is_valid_career_url() centralises this logic.
# ============================================================

import scrapy
import hashlib
import re
from datetime import datetime
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


# ---------------------------------------------------------------
# Source registry
# Format: (board_slug, org_name, acronym, state_slug, career_url)
# ---------------------------------------------------------------
PSU_SOURCES = [
    # ---- Insurance PSU ----
    ("uiic",    "United India Insurance Company",          "UIIC",    "all-india", "https://www.uiic.co.in/careers"),
    ("niacl",   "New India Assurance Company",             "NIACL",   "all-india", "https://newindia.co.in/career"),
    ("oicl",    "Oriental Insurance Company",              "OICL",    "all-india", "https://orientalinsurance.org.in/career"),
    ("lic",     "Life Insurance Corporation of India",     "LIC",     "all-india", "https://licindia.in/careers"),

    # ---- Banking / Finance PSU ----
    ("nabard",  "National Bank for Agriculture",           "NABARD",  "all-india", "https://www.nabard.org/careers.aspx"),
    ("sidbi",   "Small Industries Development Bank",       "SIDBI",   "all-india", "https://www.sidbi.in/en/careers"),

    # ---- Energy PSU ----
    ("ntpc",    "NTPC Limited",                            "NTPC",    "all-india", "https://careers.ntpc.co.in/"),
    ("ongc",    "Oil and Natural Gas Corporation",         "ONGC",    "all-india", "https://www.ongcindia.com/wps/wcm/connect/en/career/"),
    ("iocl",    "Indian Oil Corporation Limited",          "IOCL",    "all-india", "https://iocl.com/pages/Jobs"),
    ("bpcl",    "Bharat Petroleum Corporation",            "BPCL",    "all-india", "https://www.bharatpetroleum.in/bpcl-careers"),
    ("hpcl",    "Hindustan Petroleum Corporation",         "HPCL",    "all-india", "https://www.hindustanpetroleum.com/career"),
    ("pgcil",   "Power Grid Corporation of India",         "PGCIL",   "all-india", "https://www.powergrid.in/career"),
    ("gail",    "Gas Authority of India Limited",          "GAIL",    "all-india", "https://gailonline.com/Career.html"),

    # ---- Metals / Manufacturing PSU ----
    ("nalco",   "National Aluminium Company",              "NALCO",   "all-india", "https://nalcoindia.com/career/"),
    ("sail",    "Steel Authority of India Limited",        "SAIL",    "all-india", "https://www.sail.co.in/career"),

    # ---- Defense R&D ----
    ("drdo",    "Defence Research and Development Org",    "DRDO",    "all-india", "https://rac.gov.in/"),
    ("barc",    "Bhabha Atomic Research Centre",           "BARC",    "all-india", "https://www.barc.gov.in/recruit/"),
    ("hal",     "Hindustan Aeronautics Limited",           "HAL",     "all-india", "https://hal-india.co.in/careers"),
    ("bel",     "Bharat Electronics Limited",              "BEL",     "all-india", "https://bel-india.in/careers"),

    # ---- Infrastructure ----
    ("aai",     "Airports Authority of India",             "AAI",     "all-india", "https://www.aai.aero/en/careers/recruitment"),
    ("dmrc",    "Delhi Metro Rail Corporation",            "DMRC",    "delhi",     "https://delhimetrorail.com/career"),
    ("ncrtc",   "National Capital Region Transport Corp",  "NCRTC",   "all-india", "https://ncrtc.in/careers/"),
    ("rites",   "RITES Limited",                           "RITES",   "all-india", "https://rites.com/web/index.php/careers"),
    ("concor",  "Container Corporation of India",         "CONCOR",  "all-india", "https://concorindia.co.in/career.asp"),

    # ---- Autonomous Bodies ----
    ("nic",     "National Informatics Centre",             "NIC",     "all-india", "https://www.nic.in/careers/"),
    ("fci",     "Food Corporation of India",               "FCI",     "all-india", "https://fci.gov.in/recruitment.php"),
    ("esic",    "Employees State Insurance Corporation",   "ESIC",    "all-india", "https://www.esic.nic.in/recruitment"),
    ("epfo",    "Employees Provident Fund Organisation",   "EPFO",    "all-india", "https://www.epfindia.gov.in/site_en/Job_Opportunities.php"),

    # ---- Education / Tribal ----
    ("nests",   "Eklavya Model Residential Schools (NESTS)","NESTS",  "all-india", "https://nests.gov.in/vacancies"),
    ("naps",    "National Apprenticeship Promotion Scheme","NAPS",   "all-india", "https://www.apprenticeshipindia.org/"),

    # ---- Research Institutes ----
    ("csir_ngri","CSIR-NGRI Geophysical Research",        "CSIRNGRI","all-india", "https://www.ngri.res.in/Recruitment/"),

    # ---- Tax / Revenue ----
    ("itax_mp", "Income Tax Dept (MP & CG Region)",       "ITAXMPG", "madhya-pradesh", "https://www.incometaxmpg.gov.in/"),

    # ---- State Cooperative ----
    ("upcisb",  "UP Cooperative Institutional Service",   "UPCISB",  "uttar-pradesh",  "https://upcisb.org/"),

]


EXAM_KWS = [
    "recruitment", "vacancy", "post", "result", "admit", "answer key",
    "syllabus", "notification", "advt", "advertisement", "apply",
    "career", "job", "opening", "trainee", "engineer", "officer",
    "walk-in", "walk in",
]


def _parse_date(date_str: str) -> str | None:
    """
    Convert Indian date strings to ISO 8601 (YYYY-MM-DD).
    Handles: DD/MM/YYYY, D-M-YYYY, D Month YYYY, etc.
    Returns None if parsing fails — safe to pass to DB as NULL.
    """
    if not date_str:
        return None
    try:
        from dateutil import parser as dp
        parsed = dp.parse(date_str.strip(), dayfirst=True)
        return parsed.strftime("%Y-%m-%d")
    except Exception:
        return None


class PSUMegaSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Covers 20+ PSU / insurance / infrastructure career pages in one spider.
    Each source is scraped independently for its careers/recruitment section.
    """

    name = "psu_mega"
    default_notification_type = "recruitment"

    # Flatten all allowed domains from PSU_SOURCES
    allowed_domains = list({
        u.split("//")[-1].split("/")[0].replace("www.", "").replace("careers.", "")
        for _, _, _, _, u in PSU_SOURCES
    })

    async def start(self):
        for req in self.start_requests():
            yield req

    def start_requests(self):
        for board_slug, org_name, acronym, state_slug, url in PSU_SOURCES:
            yield scrapy.Request(
                url,
                callback=self.parse,
                meta={
                    "board_slug": board_slug,
                    "org_name":   org_name,
                    "org_acronym": acronym,
                    "state_slug": state_slug,
                    "base_url":   url,
                },
                errback=self.on_error,
            )

    def parse(self, response):
        meta = response.meta
        self.logger.info(f"[psu_mega] Parsing {meta['org_acronym']}: {response.url}")
        seen = set()

        for link in response.css("a"):
            href  = link.attrib.get("href", "")
            title = (link.xpath("string(.)").get() or "").strip()
            url   = response.urljoin(href)

            # Skip empty/short titles and already-seen URLs
            if not title or len(title) < 5 or url in seen:
                continue

            # Skip image/script/style assets
            if href.endswith((".jpg", ".png", ".gif", ".ico", ".js", ".css")):
                continue

            seen.add(url)
            t_low = title.lower()

            # --------------------------------------------------------
            # VALIDATE URL — reject noise PDFs (creditor lists, tenders,
            # MSME docs, annual reports) and non-career pages.
            # is_valid_career_url() checks:
            #   1. Noise PDF path patterns → reject
            #   2. Career keywords in URL path → accept
            #   3. Career keywords in title → accept
            # --------------------------------------------------------
            if not self.is_valid_career_url(url, title):
                self.logger.debug(
                    f"[psu_mega] SKIP (not a career URL): {title[:50]} | {url[:80]}"
                )
                continue

            # Also skip already-known (scraped) URLs early
            from pipelines import DeduplicationPipeline
            if DeduplicationPipeline.is_known(url):
                continue

            if url.lower().endswith(".pdf"):
                # Only keep PDFs that have recruitment keywords in title
                if any(kw in t_low for kw in EXAM_KWS):
                    item = self._make(title, url, meta)
                    if item:
                        yield item
            elif any(kw in t_low for kw in EXAM_KWS):
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
        if not title or len(title) < 5:
            return
        item = self._make(title, response.url, meta)
        if not item:
            return

        # Collect all page text for regex extraction
        text = " ".join(response.css("*::text").getall())

        # ---- Notification PDF ----
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf"] = response.urljoin(pdf)

        # ---- Total Vacancies ----
        m = re.search(
            r"(\d[\d,]+)\s*(post[s]?|vacanc(?:y|ies)|seat[s]?|opening[s]?)",
            text, re.IGNORECASE
        )
        if m:
            item["total_vacancies"] = int(m.group(1).replace(",", ""))

        # ---- Apply Dates ----
        # Matches: "Application Begin : 01/09/2026" or "Start Date: 1 Sep 2026"
        start_m = re.search(
            r"(?:application\s+begin|start\s+date|apply\s+from)[\s:\-]+"
            r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+\w+\s+\d{4})",
            text, re.IGNORECASE
        )
        if start_m:
            item["apply_start_date"] = _parse_date(start_m.group(1))

        end_m = re.search(
            r"(?:last\s+date|apply\s+(?:end|before|by|till)|application\s+end|closing\s+date)[\s:\-]+"
            r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+\w+\s+\d{4})",
            text, re.IGNORECASE
        )
        if end_m:
            item["apply_end_date"] = _parse_date(end_m.group(1))

        # ---- Application Fee ----
        fee = {}
        for category, pattern in [
            ("general",  r"(?:general|open|unreserved)[\s/\w]*?[:\-]\s*(?:Rs\.?|INR)?\s*([\d,]+)"),
            ("sc_st",    r"(?:sc[/\s]st|scheduled\s+(?:caste|tribe))[\s/\w]*?[:\-]\s*(?:Rs\.?|INR)?\s*([\d,]+)"),
            ("obc",      r"obc[\s/\w]*?[:\-]\s*(?:Rs\.?|INR)?\s*([\d,]+)"),
            ("women",    r"women[\s/\w]*?[:\-]\s*(?:Rs\.?|INR)?\s*([\d,]+)"),
        ]:
            fm = re.search(pattern, text, re.IGNORECASE)
            if fm:
                try:
                    fee[category] = int(fm.group(1).replace(",", ""))
                except ValueError:
                    pass
        if fee:
            item["application_fee"] = fee

        # ---- Age Limit ----
        age = {}
        age_m = re.search(
            r"(?:maximum|max|upper)\s+age[\s:\-]+?(\d+)\s*(?:years?|yrs?)",
            text, re.IGNORECASE
        )
        if age_m:
            age["max"] = int(age_m.group(1))
            item["max_age_limit"] = age["max"]
        age_min_m = re.search(
            r"(?:minimum|min|lower)\s+age[\s:\-]+?(\d+)\s*(?:years?|yrs?)",
            text, re.IGNORECASE
        )
        if age_min_m:
            age["min"] = int(age_min_m.group(1))
        if age:
            item["age_limit"] = age

        # ---- Apply Online link ----
        apply_links = [
            response.urljoin(a.attrib["href"])
            for a in response.css("a")
            if any(kw in (a.attrib.get("href", "") + a.xpath("string(.)").get("")).lower()
                   for kw in ("apply", "application", "online"))
            and a.attrib.get("href", "")
        ]
        if apply_links:
            item.setdefault("application_links", {})
            item["application_links"]["apply_online"] = apply_links[0]

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
        item["official_website"] = meta.get("base_url", url)
        item["state_slug"]       = meta["state_slug"]
        item["state"]            = ["All India" if meta["state_slug"] == "all-india" else meta["state_slug"].replace("-", " ").title()]
        item["dedup_hash"]       = dedup_hash
        t = title.lower()
        if "result" in t or "merit" in t:
            item["notification_type"] = "result"
        elif "admit" in t or "call letter" in t or "hall ticket" in t:
            item["notification_type"] = "admit_card"
        elif "answer key" in t:
            item["notification_type"] = "answer_key"
        elif "syllabus" in t:
            item["notification_type"] = "syllabus"
        else:
            item["notification_type"] = "recruitment"
        return item

    def on_error(self, failure):
        self.logger.warning(f"[psu_mega] Error: {failure.request.url}")
