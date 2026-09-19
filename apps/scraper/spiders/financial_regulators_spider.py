# ============================================================
# spiders/financial_regulators_spider.py
# ExamUdaan | Financial Sector & Regulatory Bodies Recruitment
# Run: scrapy crawl financial_regulators
#
# Covers:
#   - RBI (opportunities.rbi.org.in) — Grade B, Assistant
#   - SEBI (sebi.gov.in/careers)
#   - NHB (nhb.org.in) — National Housing Bank
#   - SIDBI (sidbi.in/careers) — Small Industries Dev Bank
#   - NABARD (nabard.org) — Rural Development Bank
#   - EXIM Bank (eximbankindia.in/careers)
#   - IIFCL (iifcl.org/careers) — Infrastructure Finance
#   - NSDL (nsdl.co.in/careers)
#   - CDSL (cdslindia.com/careers)
#   - NPCI (npci.org.in/careers)
#   - IRDAI (irdai.gov.in/careers) — Insurance regulator
#   - PFRDA (pfrda.org.in/careers) — Pension Fund regulator
#   - FCI (fci.gov.in) — Food Corporation of India (also PSU)
# ============================================================

import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


FR_SOURCES = [
    # RBI — premium exam, very high interest
    ("rbi",          "Reserve Bank of India",              "RBI",     "Central",
     "https://opportunities.rbi.org.in/Scripts/BS_ViewNotifications.aspx", [
         "https://www.rbi.org.in/careers/",
     ]),

    # SEBI — Securities regulator
    ("sebi",         "Securities and Exchange Board of India", "SEBI", "Central",
     "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=5&ssid=18&smid=0", [
         "https://www.sebi.gov.in/careers/",
     ]),

    # NHB — National Housing Bank
    ("nhb",          "National Housing Bank",              "NHB",     "Central",
     "https://nhb.org.in/about-us/recruitment/", []),

    # SIDBI — Small Industries Development Bank
    ("sidbi",        "Small Industries Development Bank of India", "SIDBI", "Central",
     "https://www.sidbi.in/en/career", []),

    # NABARD — already has stub, add proper URL
    ("nabard",       "National Bank for Agriculture and Rural Development", "NABARD", "Central",
     "https://www.nabard.org/content.aspx?id=584&catid=15&mid=24", [
         "https://www.nabard.org/careers.aspx",
     ]),

    # EXIM Bank
    ("exim_bank",    "Export-Import Bank of India",        "EXIMBANK", "Central",
     "https://www.eximbankindia.in/career", []),

    # FCI — Food Corporation of India
    ("fci",          "Food Corporation of India",          "FCI",     "Central",
     "https://fci.gov.in/recruitments.php", []),

    # IRDAI — Insurance regulator
    ("irdai",        "Insurance Regulatory and Development Authority", "IRDAI", "Central",
     "https://irdai.gov.in/career", []),

    # PFRDA — Pension Fund
    ("pfrda",        "Pension Fund Regulatory and Development Authority", "PFRDA", "Central",
     "https://www.pfrda.org.in/myauth/admin/showimg.cshtml?ID=644", []),

    # IIFCL
    ("iifcl",        "India Infrastructure Finance Company Ltd", "IIFCL", "Central",
     "https://www.iifcl.org/careers/", []),

    # NPCI — National Payments Corporation
    ("npci",         "National Payments Corporation of India", "NPCI", "Central",
     "https://www.npci.org.in/who-we-are/careers", []),
]

FR_KEYWORDS = [
    "recruitment", "vacancy", "notification", "advertisement", "advt",
    "apply", "career", "grade b", "officer", "assistant", "manager",
    "result", "admit", "answer key", "syllabus", "selection",
    "interview", "phase", "mains", "preliminary", "exam",
]


class FinancialRegulatorsSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Covers RBI, SEBI, NHB, NABARD, SIDBI, EXIM Bank, FCI, IRDAI, PFRDA, NPCI.
    These are premium financial sector jobs — very popular among graduates.
    """

    name = "financial_regulators"
    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "RANDOMIZE_DOWNLOAD_DELAY": True,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
    }

    allowed_domains = list({
        url.split("//")[-1].split("/")[0].replace("www.", "")
        for _, _, _, _, url, _ in FR_SOURCES
    } | {
        extra.split("//")[-1].split("/")[0].replace("www.", "")
        for _, _, _, _, _, extras in FR_SOURCES
        for extra in extras
    })

    def start_requests(self):
        for board_slug, org_name, acronym, state, url, extras in FR_SOURCES:
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
        self.logger.info(f"[{self.name}] {meta['org_acronym']}: {response.url}")
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
            elif any(kw in t_low for kw in FR_KEYWORDS):
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

        # Extract PDF notification link
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        # Extract vacancies
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
        self.logger.warning(f"[{self.name}] Error: {failure.request.url} — {failure.value}")
