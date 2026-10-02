# ============================================================
# spiders/msedcl_spider.py — Maharashtra State Electricity Distribution Company Ltd
# ExamUdaan | https://mahadiscom.in / https://msedcl.com
# Run: scrapy crawl msedcl
#
# MSEDCL (also known as Mahadiscom) is the state electricity PSU with
# thousands of posts: Junior Engineer, Lineman, Sub-Engineer, Accounts
# Clerk, Meter Reader, Technical Assistants.
# Exams conducted via MahaPariksha (mahapariksha.gov.in).
# ============================================================

import scrapy
import re
import hashlib
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class MSEDCLSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes MSEDCL (Maharashtra State Electricity Distribution Co. Ltd.)
    — career page at mahadiscom.in / msedcl.com for recruitment notifications.

    Typical vacancies:
    - Junior Engineer (JE) — Electrical / Civil
    - Sub-Engineer
    - Technical Assistant (Computer Operator Grade)
    - Meter Reader
    - Lineman / Helper (direct recruitment)
    - Accounts Clerk / Cashier

    MSEDCL often uses MahaPariksha portal for written tests.
    """

    name            = "msedcl"
    org_name        = "Maharashtra State Electricity Distribution Company Ltd"
    org_acronym     = "MSEDCL"
    allowed_domains = ["mahadiscom.in", "msedcl.com", "mahapariksha.gov.in"]

    start_urls = [
        "https://www.mahadiscom.in/career/",
        "https://www.mahadiscom.in/recruitment/",
        "https://mahadiscom.in",
    ]

    custom_settings = {
        "DOWNLOAD_DELAY": 2.5,
        "ROBOTSTXT_OBEY": True,
        "DEFAULT_REQUEST_HEADERS": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-IN,en;q=0.9,mr;q=0.8",
        },
    }

    def parse(self, response):
        """
        Parse MSEDCL careers / recruitment pages.
        MSEDCL uses a table-based listing with notification PDFs.
        """
        self.logger.info(f"[msedcl] Parsing: {response.url}")

        seen = set()

        # Try multiple CSS patterns for their site structure
        selectors = [
            "table.table a",
            ".career-list a",
            ".recruitment-notice a",
            "a[href*='.pdf']",
            "a[href*='recruitment']",
            "a[href*='notification']",
            ".panel-body a",
            ".news-item a",
            "li a",
        ]

        for sel in selectors:
            for link in response.css(sel):
                title = link.css("::text").get("").strip()
                href  = link.attrib.get("href", "")
                url   = response.urljoin(href)

                if not title or len(title) < 8:
                    continue
                # Filter: only recruitment/exam related links
                if not any(kw in title.lower() for kw in [
                    "recruitment", "vacancy", "bharti", "apply", "notification",
                    "engineer", "technician", "lineman", "meter", "clerk",
                    "result", "admit", "answer key", "interview",
                    "जाहिरात", "भरती", "नोकरी",
                ]):
                    continue
                if self.should_skip_link(title, url):
                    continue
                if url in seen:
                    continue

                seen.add(url)

                if url.lower().endswith(".pdf"):
                    item = self._make_item(title, url)
                    item["notification_pdf_url"] = url
                    yield item
                else:
                    yield response.follow(
                        url,
                        callback=self.parse_detail,
                        meta={"title": title},
                        errback=self.on_error,
                    )

    def parse_detail(self, response):
        """Extract structured data from a single MSEDCL notification page."""
        title = (
            response.meta.get("title")
            or response.css("h1::text, h2::text, .page-heading::text").get("")
        ).strip()

        if not title or len(title) < 5:
            return

        dedup_hash = hashlib.sha256(f"MSEDCL_{response.url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[response.url]):
            return

        item = self._make_item(title, response.url, dedup_hash=dedup_hash)
        page_text = " ".join(response.css("*::text").getall())

        # PDF link
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        # Vacancy count
        item["total_vacancies"] = self._extract_number(page_text)

        # Dates
        item["apply_end_date"] = self._extract_date(page_text)

        # Walk-in check
        if any(kw in title.lower() for kw in ["walk-in", "walk in", "walkin"]):
            item["is_walk_in"] = True

        # Advt no
        m = re.search(r"advt\.?\s*no\.?\s*[:\-]?\s*([\w/\-]+)", page_text, re.IGNORECASE)
        if m:
            item["advt_no"] = m.group(1).strip()

        yield item

    def _make_item(self, title, url, dedup_hash=None):
        item = ExamPost()
        item["title"]             = title
        item["board_slug"]        = "msedcl"
        item["org_name"]          = self.org_name
        item["org_acronym"]       = self.org_acronym
        item["source_url"]        = url
        item["official_website"]  = "https://www.mahadiscom.in/"
        item["state"]             = ["Maharashtra"]
        item["notification_type"] = self._infer_type(title)
        item["is_psu"]            = True  # MSEDCL is a PSU
        if dedup_hash:
            item["dedup_hash"] = dedup_hash
        return item

    def _infer_type(self, title):
        t = title.lower()
        if any(k in t for k in ["result", "merit list", "selected", "निकाल"]):
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
        for kw in ["last date", "closing date", "apply before"]:
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
        self.logger.warning(f"[msedcl] Request failed: {failure.request.url}")
