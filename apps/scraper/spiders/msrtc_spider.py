# ============================================================
# spiders/msrtc_spider.py — Maharashtra State Road Transport Corporation
# ExamUdaan | https://msrtc.gov.in
# Run: scrapy crawl msrtc
#
# MSRTC is Maharashtra's largest state employer with thousands of
# vacancies for: Conductor, Driver, Technician, Clerk, and Officer posts.
# Walk-in interviews are very common for contractual positions.
# ============================================================

import scrapy
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class MSRTCSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes MSRTC (Maharashtra State Road Transport Corporation)
    recruitment, results, and admit card notifications.

    MSRTC frequently posts:
    - Direct recruitment for Conductor / Driver / Loco Pilot
    - Technician (fitter, electrician, welder) vacancies
    - Clerical and administrative staff
    - Walk-in interviews for contractual positions

    Target pages:
    - https://msrtc.gov.in/app/webroot/recruitment (main recruitment page)
    - https://msrtc.gov.in (homepage — latest notifications)
    """

    name            = "msrtc"
    org_name        = "Maharashtra State Road Transport Corporation"
    org_acronym     = "MSRTC"
    allowed_domains = ["msrtc.gov.in", "mahapariksha.gov.in"]

    start_urls = [
        "https://msrtc.gov.in/app/webroot/recruitment",
        "https://msrtc.gov.in/app/webroot/result",
        "https://msrtc.gov.in",
    ]

    custom_settings = {
        "DOWNLOAD_DELAY": 2,
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
        Parse MSRTC homepage / recruitment page.
        Looks for:
        - Notification PDFs (recruitment advts)
        - Detail page links (for structured extraction)
        - Ticker/marquee links (latest notifications)
        """
        self.logger.info(f"[msrtc] Parsing: {response.url}")

        seen = set()

        # Common link selectors on MSRTC site
        selectors = [
            "table.table a",           # Tabular listing
            ".recruitment-list a",
            ".notification-list a",
            "a[href*='recruitment']",
            "a[href*='result']",
            "a[href*='admit']",
            "a[href*='.pdf']",
            "marquee a",               # Ticker links
            ".latest-news a",
            ".news-list a",
            "ul.list-unstyled li a",
            "div.panel a",
        ]

        for sel in selectors:
            for link in response.css(sel):
                title = link.css("::text").get("").strip()
                href  = link.attrib.get("href", "")
                url   = response.urljoin(href)

                if not title or len(title) < 8:
                    continue
                if not any(kw in title.lower() for kw in [
                    "recruitment", "vacancy", "bharti", "apply", "notification",
                    "result", "admit", "answer", "interview", "walk",
                    "conductor", "driver", "technician", "clerk",
                    "जाहिरात", "भरती", "निकाल", "परिणाम",
                ]):
                    continue
                if self.should_skip_link(title, url):
                    continue
                if url in seen:
                    continue

                seen.add(url)

                if url.lower().endswith(".pdf"):
                    # PDF — yield directly
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

        # Pagination
        for next_url in response.css("a[rel='next']::attr(href), a.next::attr(href), .pagination a::attr(href)").getall():
            yield response.follow(next_url, callback=self.parse)

    def parse_detail(self, response):
        """
        Extract details from a single MSRTC notification page.
        Handles both HTML detail pages and PDF redirects.
        """
        title = (
            response.meta.get("title")
            or response.css("h1::text, h2::text, .page-title::text").get("")
        ).strip()

        if not title or len(title) < 5:
            return

        # Dedup
        import hashlib
        dedup_hash = hashlib.sha256(f"MSRTC_{response.url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[response.url]):
            return

        item = self._make_item(title, response.url, dedup_hash=dedup_hash)

        # Page full text for extraction
        page_text = " ".join(response.css("*::text").getall())

        # Extract notification PDF link
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        # Extract vacancy count
        item["total_vacancies"] = self._extract_number(page_text)

        # Extract dates
        item["apply_end_date"] = self._extract_date(page_text)

        # Check for walk-in interview keywords
        if any(kw in title.lower() for kw in ["walk-in", "walk in", "walkin"]):
            item["is_walk_in"] = True
            # For walk-ins, the interview date is more useful than apply_end_date
            item["exam_date"] = item.get("apply_end_date")

        # Extract advt number
        advt_match = re.search(r"advt\.?\s*no\.?\s*[:\-]?\s*([\w/\-]+)", page_text, re.IGNORECASE)
        if advt_match:
            item["advt_no"] = advt_match.group(1).strip()

        yield item

    def _make_item(self, title, url, dedup_hash=None):
        """Build a standardized ExamPost item for MSRTC."""
        item = ExamPost()
        item["title"]             = title
        item["board_slug"]        = "msrtc"
        item["org_name"]          = self.org_name
        item["org_acronym"]       = self.org_acronym
        item["source_url"]        = url
        item["official_website"]  = "https://msrtc.gov.in/"
        item["state"]             = ["Maharashtra"]
        item["notification_type"] = self._infer_type(title)
        if dedup_hash:
            item["dedup_hash"] = dedup_hash
        return item

    def _infer_type(self, title):
        """Infer notification type from title keywords."""
        t = title.lower()
        if any(k in t for k in ["result", "merit list", "final list", "निकाल"]):
            return "result"
        if any(k in t for k in ["admit card", "call letter", "hall ticket", "प्रवेश"]):
            return "admit_card"
        if "answer key" in t or "उत्तर" in t:
            return "answer_key"
        if "syllabus" in t:
            return "syllabus"
        return "recruitment"

    def _extract_number(self, text):
        """Extract vacancy count from text."""
        for kw in ["vacancies", "posts", "vacancy", "jaga", "जागा", "पदे", "पद"]:
            m = re.search(
                rf"(\d[\d,]+)\s*{kw}|{kw}[:\s]+(\d[\d,]+)",
                text, re.IGNORECASE
            )
            if m:
                return int((m.group(1) or m.group(2)).replace(",", ""))
        return None

    def _extract_date(self, text):
        """Extract last date from text."""
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
            # DD/MM/YYYY
            m2 = re.search(r"(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})", window)
            if m2:
                return f"{m2.group(3)}-{int(m2.group(2)):02d}-{int(m2.group(1)):02d}"
        return None

    def on_error(self, failure):
        self.logger.warning(f"[msrtc] Request failed: {failure.request.url}")
