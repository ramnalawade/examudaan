# ============================================================
# spiders/maharashtra_prisons_spider.py — Maharashtra Prisons (DYNAMIC)
# Target: https://mahaprisons.gov.in/en/notice-category/recruitments/
#
# PAGE STRUCTURE:
# - WordPress-style recruitment notices page
# - Likely article or card-based layout for job openings
# - PDF links for advertisements
# - Notice-based layout (recruitments category)
#
# PRINCIPLES (same as ACTREC/NEERI/IISER/ICT/PDKV/CIRCOT spiders):
# - NO hardcoded venue, selection process, relaxation, etc.
# - All rich data extracted from PDF by Gemini pipeline
# - Random user agents (handled by RandomUserAgentMiddleware)
# - Dynamic ai_extracted_data structure (starts empty, AI fills it)
#
# ENHANCEMENTS over CIRCOT template:
# - Pagination support (CIRCOT is single-page, this has multiple pages)
# - Notice type detection (Results / Corrigendums)
# ============================================================

import scrapy
import re
import hashlib
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class MaharashtraPrisonsSpider(DuplicateStopMixin, scrapy.Spider):
    name = "maharashtra_prisons"
    source_name = "Maharashtra Prisons Official Recruitment Portal"
    allowed_domains = ["mahaprisons.gov.in"]
    start_urls = [
        "https://mahaprisons.gov.in/en/notice-category/recruitments/",
        "https://mahaprisons.gov.in/",  # Warm-up
    ]

    dedup_org = "MAHARASHTRA_PRISONS"
    
    # Multi-state / multi-language metadata
    target_state = "maharashtra"  # Maharashtra Prisons HQ
    target_lang = "en"            # Primary language (bilingual content)

    custom_settings = {
        "DOWNLOAD_DELAY": 3,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        # NO USER_AGENT — RandomUserAgentMiddleware handles it
    }

    # Keywords that indicate a job opening
    JOB_KEYWORDS = [
        "vacancy", "vacancies", "recruitment", "advertisement", "walk-in",
        "walk in", "interview", "fellow", "trainee", "apprentice",
        "professor", "assistant", "officer", "scientist", "research",
        "constable", "warden", "jailor", "superintendent", "deputy",
        "contractual", "adhoc", "भरती", "नोकरी", "पद", "अर्ज"
    ]

    # ENHANCEMENT: Notice type keywords (not in CIRCOT template)
    RESULT_KEYWORDS = ["result", "selected", "list", "merit", "final list", "waiting list"]
    CORRIGENDUM_KEYWORDS = ["corrigendum", "amendment", "revised", "correction", "modification"]

    def parse(self, response):
        self.logger.info(f"Maharashtra Prisons: Parsing {response.url} — status {response.status}")
        
        # If this is homepage warm-up, go to recruitments page
        if response.url == "https://mahaprisons.gov.in/" or response.url == "https://mahaprisons.gov.in":
            yield scrapy.Request(
                "https://mahaprisons.gov.in/en/notice-category/recruitments/",
                callback=self.parse_careers_page
            )
            return
        
        yield from self.parse_careers_page(response)

    def parse_careers_page(self, response):
        """Parse the recruitments page and extract job openings."""
        self.logger.info(f"Maharashtra Prisons: Parsing recruitments page — status {response.status}")

        # Try multiple parsing strategies
        entries = self._find_job_entries(response)
        
        if entries:
            self.logger.info(f"Maharashtra Prisons: Found {len(entries)} job entries")
            for entry in entries:
                item = self._parse_entry(entry, response)
                if item:
                    yield item
        else:
            self.logger.warning("Maharashtra Prisons: No job entries found with standard selectors")
            # Fallback: scan entire page for links
            yield from self._scrape_all_links(response)
        
        # ENHANCEMENT: Follow pagination (not in CIRCOT template)
        yield from self._follow_pagination(response)

    def _find_job_entries(self, response):
        """Find all job entry containers using multiple strategies."""
        entries = []
        
        # Strategy 1: Table rows
        table_rows = response.css("table tr")
        for row in table_rows:
            text = " ".join(row.css("::text").getall()).strip()
            if len(text) > 20 and self._is_job_entry(text):
                entries.append(row)
        
        # Strategy 2: Articles/cards/divs with job-related content
        if not entries:
            containers = response.css(
                "article, div, section, li, .post, .notice, .recruitment-item, "
                ".news-item, .card, .job, .vacancy, .entry"
            )
            for container in containers:
                text = " ".join(container.css("::text").getall()).strip()
                if len(text) > 30 and self._is_job_entry(text):
                    entries.append(container)
        
        # Strategy 3: Headings followed by content
        if not entries:
            headings = response.css("h1, h2, h3, h4, h5")
            for heading in headings:
                text = heading.css("::text").get("").strip()
                if self._is_job_entry(text):
                    # Get the parent container
                    parent = heading.xpath("./..")
                    if parent:
                        entries.append(parent[0])
        
        return entries

    def _is_job_entry(self, text):
        """Check if text contains job-related keywords."""
        text_lower = text.lower()
        return any(kw in text_lower for kw in self.JOB_KEYWORDS)

    def _parse_entry(self, entry, response):
        """Parse a single job entry."""
        
        # Extract all text
        all_text = " ".join(entry.css("::text").getall()).strip()
        if not all_text or len(all_text) < 20:
            return None
        
        # Extract title
        title_raw = self._extract_title(entry, all_text)
        if not title_raw or len(title_raw) < 10:
            return None
        
        # Detect walk-in
        is_walk_in = "walk-in" in all_text.lower() or "walk in" in all_text.lower()
        
        # Extract dates
        walkin_date = self._extract_walkin_date(all_text)
        last_date = self._extract_last_date(all_text)
        published_date = self._extract_published_date(all_text)
        
        # Find PDF links
        pdf_urls = []
        detail_url = None
        for link in entry.css("a"):
            href = link.attrib.get("href", "")
            if not href:
                continue
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            if href.lower().endswith(".pdf"):
                pdf_urls.append(full_url)
            elif detail_url is None and "mahaprisons.gov.in" in full_url:
                detail_url = full_url
        
        # Extract advertisement number
        advt_no = self._extract_advt_no(all_text)
        
        # Deduplication
        dedup_string = f"MAHARASHTRA_PRISONS_{advt_no or title_raw[:40]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            self.logger.debug(f"Maharashtra Prisons: Skipping known entry")
            return None
        
        clean_title = self._clean_title(title_raw)
        notification_pdf = pdf_urls[0] if pdf_urls else None
        
        # Determine status
        is_closed = "closed" in all_text.lower() or "applications closed" in all_text.lower()
        final_date = last_date or walkin_date
        if final_date and self._is_past_date(final_date):
            is_closed = True
        
        # ENHANCEMENT: Detect notice type (not in CIRCOT template)
        title_lower = title_raw.lower()
        is_result = any(kw in title_lower for kw in self.RESULT_KEYWORDS)
        is_corrigendum = any(kw in title_lower for kw in self.CORRIGENDUM_KEYWORDS)
        if is_result:
            is_closed = True
        
        # Build item
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "Maharashtra Prisons Department"
        item['org_acronym'] = "Maharashtra Prisons"
        item['source_url'] = detail_url or response.url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = published_date
        item['apply_end_date'] = final_date
        item['advt_no'] = advt_no
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = ["Maharashtra"]
        item['application_links'] = {
            "official_website": "https://mahaprisons.gov.in",
            "detail_page": detail_url,
            "all_pdfs": pdf_urls if len(pdf_urls) > 1 else None,
        }

        # Multi-state / multi-language
        item['state_slug'] = self.target_state
        item['lang'] = self.target_lang
        item['is_walk_in'] = is_walk_in if is_walk_in else None
        item['employment_type'] = 'walkin' if is_walk_in else None
        item['dedup_hash'] = dedup_hash
        
        # DYNAMIC: Empty dict — Gemini pipeline will fill from PDF
        item['ai_extracted_data'] = {}

        # Description
        desc_parts = []
        if is_walk_in:
            desc_parts.append("Type: WALK-IN")
        if walkin_date:
            desc_parts.append(f"Walk-In: {walkin_date}")
        if last_date:
            desc_parts.append(f"Last Date: {last_date}")
        # ENHANCEMENT: Notice type in description
        if is_result:
            desc_parts.append("Type: RESULT")
        elif is_corrigendum:
            desc_parts.append("Type: CORRIGENDUM")
        if len(pdf_urls) > 1:
            desc_parts.append(f"{len(pdf_urls)} PDFs attached")
        item['description'] = " | ".join(desc_parts) if desc_parts else clean_title[:100]

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | Maharashtra Prisons Recruitment {year}",
            "meta_description": f"{clean_title} at Maharashtra Prisons Department.",
        }

        self.logger.info(f"Maharashtra Prisons: Yielded item: {clean_title[:50]} | PDF: {notification_pdf or 'None'}")
        return item

    def _extract_title(self, entry, all_text):
        """Extract the main title from entry."""
        # Try heading tags first
        title = entry.css(
            "h1::text, h2::text, h3::text, h4::text, h5::text, "
            ".title::text, .entry-title::text, .post-title::text, .job-title::text"
        ).get("")
        if title and len(title) > 10:
            return title.strip()
        
        # Try first substantial line
        lines = [l.strip() for l in all_text.split('\n') if l.strip() and len(l.strip()) > 10]
        if lines:
            return lines[0]
        
        return all_text[:200]

    def _extract_walkin_date(self, text):
        """Extract walk-in interview date."""
        patterns = [
            r'walk-in.*?(\d{2}[./-]\d{2}[./-]\d{4})',
            r'interview.*?on\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'conducted on\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'scheduled (?:for|on)\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'date[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self._parse_date(match.group(1))
        
        return None

    def _extract_last_date(self, text):
        """Extract last date / deadline."""
        patterns = [
            r'last date[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'deadline[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'before\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'on or before\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'closing date[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self._parse_date(match.group(1))
        
        return None

    def _extract_published_date(self, text):
        """Extract published/posted date."""
        patterns = [
            r'published[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'posted[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'dated[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'notification date[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self._parse_date(match.group(1))
        
        return None

    def _extract_advt_no(self, text):
        """Extract advertisement number."""
        patterns = [
            r'(?:advt|advertisement|adv|notification)[\s.#/-]*no[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'(?:advt|advertisement|adv|notification)[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'(?:no|number)[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'([A-Z]+/[A-Z0-9]+/\d{4})',
            r'PRISONS[\s/-]*([A-Z0-9/\-]+\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None

    # ENHANCEMENT: Pagination support (not in CIRCOT template)
    def _follow_pagination(self, response):
        """Follow pagination links to get more pages."""
        next_links = response.css(
            "a.next::attr(href), "
            "li.next a::attr(href), "
            ".pagination a[rel='next']::attr(href), "
            "a:contains('Next')::attr(href), "
            "a:contains('›')::attr(href), "
            "a:contains('older')::attr(href), "
            ".nav-next a::attr(href)"
        ).getall()
        
        for link in next_links:
            if link:
                full_url = response.urljoin(link) if not link.startswith("http") else link
                if full_url != response.url:
                    self.logger.info(f"Maharashtra Prisons: Following pagination to {full_url}")
                    yield scrapy.Request(full_url, callback=self.parse_careers_page)

    def _scrape_all_links(self, response):
        """Fallback: scrape all PDF and job-related links."""
        seen = set()
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = " ".join(link.css("::text").getall()).strip()
            
            if not href:
                continue
            
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            # Only PDFs or job-related pages
            is_pdf = href.lower().endswith(".pdf")
            is_job_page = any(kw in href.lower() or kw in text.lower() for kw in self.JOB_KEYWORDS)
            
            if not (is_pdf or is_job_page):
                continue
            
            if full_url in seen:
                continue
            seen.add(full_url)
            
            if is_pdf:
                # Direct PDF link
                dedup_hash = hashlib.sha256(f"MAHARASHTRA_PRISONS_PDF_{full_url}".encode()).hexdigest()
                from pipelines import DeduplicationPipeline
                if self.track_duplicate(dedup_hash, label=text or full_url, urls=[full_url]):
                    continue
                
                clean_title = self._clean_title(text) if text else full_url.split("/")[-1].replace(".pdf", "").replace("_", " ")
                
                item = ExamNotificationItem()
                item['title'] = clean_title
                item['org_name'] = "Maharashtra Prisons Department"
                item['org_acronym'] = "Maharashtra Prisons"
                item['source_url'] = full_url
                item['notification_pdf'] = full_url
                item['apply_start_date'] = None
                item['apply_end_date'] = self._extract_date_from_url(full_url)
                item['advt_no'] = None
                item['status'] = 'published'
                item['exam_cities'] = ["Maharashtra"]
                item['application_links'] = {
                    "official_website": "https://mahaprisons.gov.in",
                }

                item['state_slug'] = self.target_state
                item['lang'] = self.target_lang
                item['is_walk_in'] = None
                item['employment_type'] = None
                item['dedup_hash'] = dedup_hash
                item['ai_extracted_data'] = {}

                item['description'] = f"PDF: {full_url.split('/')[-1]}"

                year = datetime.utcnow().year
                item['seo_metadata'] = {
                    "meta_title": f"{clean_title} | Maharashtra Prisons Recruitment {year}",
                    "meta_description": f"{clean_title} at Maharashtra Prisons Department.",
                }

                yield item

    # ============================================================
    # HELPERS
    # ============================================================

    def _parse_date(self, text):
        """Parse various date formats."""
        text = (text or "").strip()
        if not text:
            return None
        try:
            # DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
            if re.match(r'^\d{2}[./-]\d{2}[./-]\d{4}$', text):
                text = text.replace('/', '-').replace('.', '-')
                day, month, year = text.split('-')
                date = datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d")
                return date.strftime("%Y-%m-%d")
            
            # YYYY-MM-DD
            if re.match(r'^\d{4}-\d{2}-\d{2}$', text):
                datetime.strptime(text, "%Y-%m-%d")
                return text
            
            # Try dateutil
            return date_parser.parse(text, dayfirst=True).strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            return None

    def _extract_date_from_url(self, url):
        """Extract date from URL or PDF filename."""
        if not url:
            return None
        
        # DD-MM-YYYY pattern
        match = re.search(r'(\d{2})-(\d{2})-(\d{4})', url)
        if match:
            day, month, year = match.groups()
            try:
                date = datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d")
                return date.strftime("%Y-%m-%d")
            except ValueError:
                pass
        
        # YYYY-MM-DD
        match = re.search(r'(\d{4})-(\d{2})-(\d{2})', url)
        if match:
            try:
                datetime.strptime(match.group(0), "%Y-%m-%d")
                return match.group(0)
            except ValueError:
                pass
        
        return None

    def _is_past_date(self, date_str):
        """Check if a date is in the past."""
        if not date_str:
            return False
        try:
            d = datetime.strptime(date_str, "%Y-%m-%d")
            return d < datetime.utcnow()
        except ValueError:
            return False

    def _clean_title(self, text):
        """Clean title text."""
        if not text:
            return ""
        cleaned = re.sub(r'\s+', ' ', text).strip()
        cleaned = re.sub(r'[*•]+', '', cleaned)
        return cleaned[:500]