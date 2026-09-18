# ============================================================
# spiders/upsc_spider.py — UPSC.gov.in scraper
# Agent: Scraper Agent
# Scrapes: https://upsc.gov.in — latest exam notifications
# Referenced in GitHub Actions workflow (was missing!)
# ============================================================

import scrapy
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin
from pipelines import DeduplicationPipeline


class UPSCSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes the UPSC website for new exam notifications.
    UPSC lists notifications on their homepage under 'What's New'
    and under specific exam sections.
    """

    name = "upsc"                             # run with: scrapy crawl upsc
    default_notification_type = 'recruitment' # fallback for items with generic titles
    allowed_domains = ["upsc.gov.in"]
    start_urls = [
        "https://upsc.gov.in/",              # homepage
        "https://upsc.gov.in/examinations",  # exam listings page
    ]

    def parse(self, response):
        """
        Step 1: Parse UPSC homepage / examinations page.
        Find links to individual exam notification pages.
        Only follow links that are recent (within MAX_ITEM_AGE_DAYS).
        """
        self.logger.info(f"Parsing UPSC page: {response.url}")

        # UPSC homepage has a "What's New" section and exam-specific links
        # Try multiple CSS selectors since website structure may vary
        link_selectors = [
            "div.whats-new a",
            "div.exam-list a",
            "ul.notifications a",
            "div.content-area a",
            "table.exam-table a",
            "a[href*='examination']",
            "a[href*='recruitment']",
        ]

        seen_urls = set()

        for selector in link_selectors:
            for link in response.css(selector):
                url   = response.urljoin(link.attrib.get("href", ""))
                title = link.css("::text").get("").strip()

                # Skip empty or already seen
                if not url or url in seen_urls:
                    continue

                # Skip PDFs at this stage (handle them in parse_notification)
                if url.endswith(".pdf"):
                    continue

                # Skip irrelevant links (tenders, press releases, etc.) and known URLs
                if self.should_skip_link(title, url):
                    continue

                # Only follow exam-related links
                keywords = [
                    "notification", "recruitment", "examination", "result",
                    "admit", "answer", "syllabus", "calendar", "vacancy"
                ]
                title_lower = title.lower()
                url_lower   = url.lower()

                if any(kw in title_lower or kw in url_lower for kw in keywords):
                    seen_urls.add(url)
                    yield response.follow(
                        url,
                        callback=self.parse_notification,
                        meta={"title": title, "source_url": url}
                    )


    def parse_notification(self, response):
        """
        Step 2: Parse an individual UPSC notification page.
        Extract details and return an ExamNotificationItem.
        Skips items older than MAX_ITEM_AGE_DAYS (3 weeks).
        """
        title = response.meta.get("title") or response.css("h1::text, h2::text").get("").strip()
        source_url = response.meta.get("source_url", response.url)

        # Skip if no meaningful title
        if not title or len(title) < 5:
            return

        # Build the item using correct ExamNotificationItem field names
        item = ExamPost()
        item["title"]          = title
        item["board_slug"]     = "upsc"
        item["source_url"]     = source_url
        item["official_website"] = "https://upsc.gov.in"

        # Dedup check
        import hashlib
        _dedup_hash = hashlib.sha256(f"UPSC_{source_url}".encode()).hexdigest()
        if self.track_duplicate(_dedup_hash, label=title, urls=[source_url]):
            return

        # All UPSC exams are All India
        item["state"] = ["All India"]

        # UPSC qualification is almost always Graduate
        item["qualification"] = ["Graduate"]

        # Look for PDF notification links
        pdf_links = response.css("a[href$='.pdf']::attr(href)").getall()
        if pdf_links:
            item["notification_pdf_url"] = response.urljoin(pdf_links[0])

        # Try to extract vacancies from page text
        page_text = " ".join(response.css("*::text").getall())
        item["vacancies"] = self.extract_number(page_text, ["vacancies", "posts", "vacancy"])

        # Try to find application dates in text
        apply_end = self.extract_date(page_text, [
            "last date", "closing date", "apply before", "apply by"
        ])
        item["application_end"] = apply_end

        # Skip item if the closing date is older than 3 weeks
        # (saves Gemini quota — no point extracting from a 2-year-old notification)
        if apply_end and self.is_stale_date(apply_end):
            self.logger.debug(f"UPSC: Skipping stale item (closing={apply_end}): {title[:60]}")
            return

        # Online application link
        apply_link = response.css(
            "a:contains('Apply'), a:contains('Online Application')::attr(href)"
        ).get()
        if apply_link:
            item["apply_url"] = response.urljoin(apply_link)

        yield item


    def get_type(self, title):
        """
        Determine content type from title keywords.
        UPSC has: civil services, engineering services, CDS, NDA etc.
        """
        title_lower = title.lower()
        if "result" in title_lower or "final result" in title_lower:
            return "result"
        elif "admit" in title_lower or "call letter" in title_lower or "e-admit" in title_lower:
            return "admit-card"
        elif "answer key" in title_lower or "answer-key" in title_lower:
            return "answer-key"
        elif "syllabus" in title_lower:
            return "syllabus"
        else:
            return "job"

    def extract_number(self, text, keywords):
        """
        Try to find a vacancy number near a keyword.
        Example: "Total Posts: 1,129" → 1129
        """
        import re
        for keyword in keywords:
            pattern = rf'(\d[\d,]+)\s*{keyword}|{keyword}[:\s]+(\d[\d,]+)'
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                num_str = match.group(1) or match.group(2)
                return int(num_str.replace(",", ""))
        return None

    def extract_date(self, text, keywords):
        """
        Try to find a date near deadline keywords.
        Returns date in YYYY-MM-DD format if found, else None.
        """
        import re
        # Common date patterns: "15 February 2025", "15/02/2025", "2025-02-15"
        date_patterns = [
            r'(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})',
            r'(\d{1,2})[/-](\d{1,2})[/-](\d{4})',
        ]
        month_map = {
            'january': 1, 'february': 2, 'march': 3, 'april': 4,
            'may': 5, 'june': 6, 'july': 7, 'august': 8,
            'september': 9, 'october': 10, 'november': 11, 'december': 12
        }

        for keyword in keywords:
            # Find text around keyword (200 chars window)
            idx = text.lower().find(keyword)
            if idx == -1:
                continue
            window = text[idx:idx + 200]

            # Try named month pattern first (most reliable for UPSC)
            m = re.search(date_patterns[0], window, re.IGNORECASE)
            if m:
                day   = int(m.group(1))
                month = month_map.get(m.group(2).lower(), 0)
                year  = int(m.group(3))
                if month:
                    return f"{year:04d}-{month:02d}-{day:02d}"

        return None
