# ============================================================
# spiders/mahaswayam_spider.py — Maharashtra Sewayojan / MahaSwayam Employment Exchange
# ExamUdaan | https://mahaswayam.gov.in
# Run: scrapy crawl mahaswayam
# ============================================================

import scrapy
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class MahaSwayamSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes MahaSwayam (Maharashtra Sewayojan) — Maharashtra government's
    official employment exchange and job portal (mahaswayam.gov.in).

    This covers district-level government job vacancies from Maharashtra's
    Employment Guarantee Scheme and Sewayojan portal. These jobs are NOT
    covered by MPSC or BMC spiders, filling a critical gap for rural/taluka
    level positions.

    Targets:
      - /JobseekerUI/Jobs (job listing page)
      - /JobseekerUI/GovernmentJobs (state/central govt jobs section)
    """
    name            = "mahaswayam"
    org_name        = "MahaSwayam — Maharashtra Sewayojan Portal"
    org_acronym     = "MahaSwayam"
    state_name      = "Maharashtra"
    allowed_domains = ["mahaswayam.gov.in"]

    # MahaSwayam is a React SPA — we scrape the static pre-rendered pages
    start_urls = [
        "https://mahaswayam.gov.in/JobseekerUI/Jobs",
        "https://mahaswayam.gov.in/JobseekerUI/GovernmentJobs",
    ]

    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "state_slug": "maharashtra",
        "ROBOTSTXT_OBEY": False,  # SPA — robots.txt may block crawlers
        # MahaSwayam sometimes needs a browser-like user agent
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
        Discover job listing links.
        MahaSwayam uses <a> tags with job titles visible in the listing.
        """
        self.logger.info(f"[mahaswayam] Parsing: {response.url}")

        # Look for job/vacancy links across multiple possible CSS patterns
        link_selectors = [
            "a[href*='JobDetail']",
            "a[href*='vacancy']",
            "a[href*='job']",
            "table.table a",
            "div.job-title a",
            "h3 a, h4 a",
            "a[href$='.pdf']",
        ]

        seen = set()
        for sel in link_selectors:
            for link in response.css(sel):
                title = link.css("::text").get("").strip()
                href  = link.attrib.get("href", "")
                url   = response.urljoin(href)

                if not title or len(title) < 5 or url in seen:
                    continue
                if self.should_skip_link(title, url):
                    continue

                seen.add(url)

                if url.lower().endswith(".pdf"):
                    # PDF notification — yield directly
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

        # Try pagination: look for 'Next' or numbered page links
        next_page = response.css("a[rel='next']::attr(href), a.next::attr(href)").get()
        if next_page:
            yield response.follow(next_page, callback=self.parse)

    def parse_detail(self, response):
        """Extract structured data from an individual job detail page."""
        title = (
            response.meta.get("title")
            or response.css("h1::text, h2::text, .job-title::text").get("")
        ).strip()

        if not title or len(title) < 5:
            return

        import hashlib
        dedup_hash = hashlib.sha256(f"MahaSwayam_{response.url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[response.url]):
            return

        item = self._make_item(title, response.url, dedup_hash=dedup_hash)

        # Extract first PDF link if present
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        # Extract vacancy count
        page_text = " ".join(response.css("*::text").getall())
        item["total_vacancies"] = self._extract_number(page_text)
        item["apply_end_date"]  = self._extract_date(page_text)

        yield item

    def _make_item(self, title, url, dedup_hash=None):
        """Build a standardized ExamPost item."""
        item = ExamPost()
        item["title"]             = title
        item["board_slug"]        = "mahaswayam"
        item["org_name"]          = self.org_name
        item["org_acronym"]       = self.org_acronym
        item["source_url"]        = url
        item["official_website"]  = "https://mahaswayam.gov.in/"
        item["state"]             = [self.state_name]
        item["notification_type"] = self._infer_type(title)
        if dedup_hash:
            item["dedup_hash"] = dedup_hash
        return item

    def _infer_type(self, title):
        """Map title keywords to notification_type DB values."""
        t = title.lower()
        if any(k in t for k in ["result", "merit list"]):
            return "result"
        if any(k in t for k in ["admit card", "call letter", "hall ticket"]):
            return "admit_card"
        if "answer key" in t:
            return "answer_key"
        if "syllabus" in t:
            return "syllabus"
        return "recruitment"

    def _extract_number(self, text):
        """Extract vacancy count from page text."""
        for kw in ["vacancies", "posts", "vacancy", "jaga", "जागा", "पदे"]:
            m = re.search(
                rf"(\d[\d,]+)\s*{kw}|{kw}[:\s]+(\d[\d,]+)",
                text, re.IGNORECASE
            )
            if m:
                return int((m.group(1) or m.group(2)).replace(",", ""))
        return None

    def _extract_date(self, text):
        """Extract closing/last date from page text."""
        months = {
            "january":1,"february":2,"march":3,"april":4,"may":5,"june":6,
            "july":7,"august":8,"september":9,"october":10,"november":11,"december":12,
        }
        for kw in ["last date", "closing date", "apply before"]:
            idx = text.lower().find(kw)
            if idx == -1:
                continue
            window = text[idx:idx + 200]
            m = re.search(
                r"(\d{1,2})\s+(January|February|March|April|May|June|July|"
                r"August|September|October|November|December)\s+(\d{4})",
                window, re.IGNORECASE
            )
            if m:
                mon = months.get(m.group(2).lower(), 0)
                if mon:
                    return f"{m.group(3)}-{mon:02d}-{int(m.group(1)):02d}"
            # Numeric format: DD/MM/YYYY
            m2 = re.search(r"(\d{1,2})[/-](\d{1,2})[/-](\d{4})", window)
            if m2:
                return f"{m2.group(3)}-{int(m2.group(2)):02d}-{int(m2.group(1)):02d}"
        return None

    def on_error(self, failure):
        self.logger.warning(f"[mahaswayam] Request failed: {failure.request.url}")
