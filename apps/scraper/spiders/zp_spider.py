# ============================================================
# spiders/zp_spider.py — Zilla Parishad Multi-District Spider
# ExamUdaan | Various ZP portals across Maharashtra's 36 districts
# Run: scrapy crawl zp
#
# Zilla Parishads (District Councils) are among Maharashtra's biggest
# district-level employers. They recruit for:
# - Zilla Parishad Teacher (Primary / Upper Primary)
# - Junior Engineer (Civil / Electrical)
# - Health Worker / ANM (Auxiliary Nurse Midwife)
# - Sub-Engineer, Clerk, Accountant
# - Group C & D posts
#
# Each district has its own ZP website + some use MahaRojgar / MahaSwayam.
# This spider covers the 10 largest ZPs and the Maharashtra Rural
# Development Department aggregate portal.
# ============================================================

import scrapy
import re
import hashlib
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


# All major ZP district websites in Maharashtra
ZP_SOURCES = [
    {
        "name": "Pune Zilla Parishad",
        "acronym": "ZP-PUNE",
        "urls": [
            "https://www.punezp.in/recruitment.html",
            "https://www.punezp.in/",
        ],
    },
    {
        "name": "Mumbai Suburban Zilla Parishad",
        "acronym": "ZP-MUMBAI-SUBURBAN",
        "urls": [
            "https://mumbaisuburban.gov.in/en/category/recruitment/",
            "https://mumbaisuburban.gov.in",
        ],
    },
    {
        "name": "Thane Zilla Parishad",
        "acronym": "ZP-THANE",
        "urls": [
            "https://zpthanecivil.maharashtra.gov.in/Recruitment.aspx",
            "https://zpthanecivil.maharashtra.gov.in",
        ],
    },
    {
        "name": "Nashik Zilla Parishad",
        "acronym": "ZP-NASHIK",
        "urls": [
            "https://zpnashik.maharashtra.gov.in/Recruitment.aspx",
        ],
    },
    {
        "name": "Nagpur Zilla Parishad",
        "acronym": "ZP-NAGPUR",
        "urls": [
            "https://zpnagpur.gov.in/Recruitment.aspx",
        ],
    },
    {
        "name": "Aurangabad (Chhatrapati Sambhajinagar) Zilla Parishad",
        "acronym": "ZP-CSN",
        "urls": [
            "https://zpaurangabad.gov.in/Recruitment.aspx",
        ],
    },
    {
        "name": "Kolhapur Zilla Parishad",
        "acronym": "ZP-KOLHAPUR",
        "urls": [
            "https://zpkolhapur.maharashtra.gov.in/Recruitment.aspx",
        ],
    },
    {
        "name": "Solapur Zilla Parishad",
        "acronym": "ZP-SOLAPUR",
        "urls": [
            "https://zpsolapur.maharashtra.gov.in/Recruitment.aspx",
        ],
    },
    {
        "name": "Ahmednagar Zilla Parishad",
        "acronym": "ZP-AHMEDNAGAR",
        "urls": [
            "https://zpahmednagar.gov.in/Recruitment.aspx",
        ],
    },
    {
        "name": "Nanded Zilla Parishad",
        "acronym": "ZP-NANDED",
        "urls": [
            "https://zpnanded.maharashtra.gov.in/Recruitment.aspx",
        ],
    },
    # Maharashtra Rural Development (aggregate portal covering all ZPs)
    {
        "name": "Maharashtra Rural Development Department — ZP Recruitment",
        "acronym": "ZP-MAHARASHTRA",
        "urls": [
            "https://rdd.maharashtra.gov.in/en/recruitment",
            "https://rdd.maharashtra.gov.in",
        ],
    },
    # MahaRojgar — aggregates ZP vacancies across districts
    {
        "name": "MahaRojgar — District Recruitment",
        "acronym": "ZP-MAHARASHTRA",
        "urls": [
            "https://mahaswayam.gov.in/JobseekerUI/GovernmentJobs",
        ],
    },
]


class ZillaParishadSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Multi-district Zilla Parishad spider for Maharashtra.
    Covers 10 major districts + Maharashtra RDD aggregate portal.
    Each ZP website uses slightly different structure — spider handles
    both table-based and list-based layouts.
    """

    name = "zp"

    # Collect all allowed domains dynamically from ZP_SOURCES
    allowed_domains = list({
        u.replace("https://", "").replace("http://", "").split("/")[0]
        for src in ZP_SOURCES for u in src["urls"]
    })

    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "ROBOTSTXT_OBEY": False,   # Some ZP sites block crawlers incorrectly
        "DEFAULT_REQUEST_HEADERS": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-IN,en;q=0.9,mr;q=0.8",
        },
    }

    def start_requests(self):
        """Generate requests with ZP metadata in meta dict."""
        for src in ZP_SOURCES:
            for url in src["urls"]:
                yield scrapy.Request(
                    url,
                    callback=self.parse,
                    errback=self.on_error,
                    meta={
                        "zp_name": src["name"],
                        "zp_acronym": src["acronym"],
                    },
                )

    def parse(self, response):
        """Parse a ZP recruitment/home page and extract notification links."""
        zp_name    = response.meta["zp_name"]
        zp_acronym = response.meta["zp_acronym"]

        self.logger.info(f"[zp] Parsing {zp_name}: {response.url}")

        seen = set()

        selectors = [
            "table a",
            "ul.list a",
            "ol li a",
            ".recruitment a",
            ".notification a",
            ".marquee a",
            "a[href*='.pdf']",
            "a[href*='recruitment']",
            "a[href*='notification']",
            "a[href*='result']",
            "a[href*='admitcard']",
            ".panel a",
            "div.content a",
            "td a",
        ]

        for sel in selectors:
            for link in response.css(sel):
                title = link.css("::text").get("").strip()
                href  = link.attrib.get("href", "")
                url   = response.urljoin(href)

                if not title or len(title) < 8:
                    continue
                if not any(kw in title.lower() for kw in [
                    "recruitment", "vacancy", "notification", "apply",
                    "result", "merit", "admit", "interview", "walk",
                    "teacher", "shikshak", "junior engineer", "health worker",
                    "भरती", "जाहिरात", "शिक्षक", "कनिष्ठ",
                ]):
                    continue
                if self.should_skip_link(title, url):
                    continue
                if url in seen:
                    continue

                seen.add(url)

                if url.lower().endswith(".pdf"):
                    item = self._make_item(title, url, zp_name, zp_acronym)
                    item["notification_pdf_url"] = url
                    yield item
                else:
                    yield response.follow(
                        url,
                        callback=self.parse_detail,
                        meta={
                            "title": title,
                            "zp_name": zp_name,
                            "zp_acronym": zp_acronym,
                        },
                        errback=self.on_error,
                    )

    def parse_detail(self, response):
        """Extract structured data from a ZP notification detail page."""
        zp_name    = response.meta["zp_name"]
        zp_acronym = response.meta["zp_acronym"]

        title = (
            response.meta.get("title")
            or response.css("h1::text, h2::text, .heading::text").get("")
        ).strip()

        if not title or len(title) < 5:
            return

        dedup_hash = hashlib.sha256(f"{zp_acronym}_{response.url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[response.url]):
            return

        item = self._make_item(title, response.url, zp_name, zp_acronym, dedup_hash)
        page_text = " ".join(response.css("*::text").getall())

        # PDF
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        # Vacancy count
        item["total_vacancies"] = self._extract_number(page_text)

        # Dates
        item["apply_end_date"] = self._extract_date(page_text)

        # Walk-in check
        if any(kw in title.lower() for kw in ["walk-in", "walk in"]):
            item["is_walk_in"] = True

        yield item

    def _make_item(self, title, url, zp_name, zp_acronym, dedup_hash=None):
        item = ExamPost()
        item["title"]             = title
        item["board_slug"]        = "zp"
        item["org_name"]          = zp_name
        item["org_acronym"]       = zp_acronym
        item["source_url"]        = url
        item["official_website"]  = url  # ZP doesn't have one central website
        item["state"]             = ["Maharashtra"]
        item["notification_type"] = self._infer_type(title)
        if dedup_hash:
            item["dedup_hash"] = dedup_hash
        return item

    def _infer_type(self, title):
        t = title.lower()
        if any(k in t for k in ["result", "merit list", "निकाल", "selected"]):
            return "result"
        if any(k in t for k in ["admit card", "call letter", "hall ticket"]):
            return "admit_card"
        if "answer key" in t:
            return "answer_key"
        if "syllabus" in t:
            return "syllabus"
        return "recruitment"

    def _extract_number(self, text):
        for kw in ["vacancies", "posts", "vacancy", "जागा", "पदे"]:
            m = re.search(rf"(\d[\d,]+)\s*{kw}|{kw}[:\s]+(\d[\d,]+)", text, re.IGNORECASE)
            if m:
                return int((m.group(1) or m.group(2)).replace(",", ""))
        return None

    def _extract_date(self, text):
        months = {
            "january": 1, "february": 2, "march": 3, "april": 4,
            "may": 5, "june": 6, "july": 7, "august": 8,
            "september": 9, "october": 10, "november": 11, "december": 12,
        }
        for kw in ["last date", "closing date", "apply before", "last day"]:
            idx = text.lower().find(kw)
            if idx == -1:
                continue
            window = text[idx: idx + 200]
            m = re.search(
                r"(\d{1,2})\s+(January|February|March|April|May|June|July|"
                r"August|September|October|November|December)\s+(\d{4})",
                window, re.IGNORECASE
            )
            if m:
                mon = months.get(m.group(2).lower(), 0)
                if mon:
                    return f"{m.group(3)}-{mon:02d}-{int(m.group(1)):02d}"
            m2 = re.search(r"(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})", window)
            if m2:
                return f"{m2.group(3)}-{int(m2.group(2)):02d}-{int(m2.group(1)):02d}"
        return None

    def on_error(self, failure):
        self.logger.warning(f"[zp] Request failed: {failure.request.url}")
