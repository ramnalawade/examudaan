# ============================================================
# spiders/pmc_spider.py — PMC (Pimpri-Chinchwad Municipal Corporation)
# Target: https://www.pmc.gov.in/en/b/recruitment
#
# PDF URL PATTERN:
#   https://webadmin.pmc.gov.in/sites/default/files/YYYY-MM/filename.pdf?VersionId=...
#
# PAGE STRUCTURE:
# - Drupal-based blog listing of recruitment notices
# - Each entry has: Title, Published date, PDF attachment
# - Paginated listing (multiple pages)
# ============================================================

from openai.types import eval_stored_completions_data_source_config
import scrapy
import re
import hashlib
from datetime import datetime
from dateutil import parser as date_parser
from spiders.dedup_mixin import DuplicateStopMixin
from items import ExamNotificationItem


class PmcSpider(DuplicateStopMixin, scrapy.Spider):
    name = "pmc"
    source_name = "PMC Official Recruitment Portal"
    # IMPORTANT: Include both domains since PDFs are on webadmin subdomain
    allowed_domains = ["pmc.gov.in", "webadmin.pmc.gov.in"]
    start_urls = [
        "https://www.pmc.gov.in/en/b/recruitment",
        "https://www.pmc.gov.in/",  # Warm-up
    ]

    dedup_org = "PMC"
    
    # Multi-state / multi-language metadata
    target_state = "maharashtra"
    target_lang = "en"

    # PMC-specific selectors (from DevTools inspection)
    # Page is Next.js (#__next); PDFs are card links inside read-more container
    CARD_LINK_SELECTOR = "a.card-link-clickble"
    CONTENT_CONTAINER = "div.read-more-read-less-content"

    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 2,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        # NO USER_AGENT — RandomUserAgentMiddleware handles it
    }

    # Keywords that indicate a job opening
    JOB_KEYWORDS = [
        "vacancy", "vacancies", "recruitment", "advertisement", "walk-in",
        "walk in", "interview", "fellow", "trainee", "apprentice",
        "professor", "assistant", "officer", "engineer", "research",
        "constable", "warden", "clerk", "deputy", "manager", "junior",
        "senior", "contractual", "adhoc", "bharti", "भरती", "नोकरी", "पद"
    ]

    # Notice type keywords
    RESULT_KEYWORDS = ["result", "selected", "list", "merit", "final list", "waiting list", "provisional list"]
    CORRIGENDUM_KEYWORDS = ["corrigendum", "amendment", "revised", "correction", "modification", "addendum"]

    def parse(self, response):
        self.logger.info(f"PMC: Parsing {response.url} — status {response.status}")
        
        # If this is homepage warm-up, go to recruitment page
        if response.url.rstrip('/') in ("https://www.pmc.gov.in", "https://www.pmc.gov.in/en"):
            yield scrapy.Request(
                "https://www.pmc.gov.in/en/b/recruitment",
                callback=self.parse_careers_page
            )
            return
        
        yield from self.parse_careers_page(response)

    def parse_careers_page(self, response):
        """Parse the recruitment page and extract job openings."""
        self.logger.info(f"PMC: Parsing recruitment page — status {response.status}")

        # Strategy 0 (PMC-specific): direct PDF card links
        card_links = response.css(f"{self.CONTENT_CONTAINER} {self.CARD_LINK_SELECTOR}")
        if not card_links:
            card_links = response.css(self.CARD_LINK_SELECTOR)
        
        if card_links:
            self.logger.info(f"PMC: Found {len(card_links)} PDF card links")
            for link in card_links:
                item = self._parse_card_link(link, response)
                if item:
                    yield item
        else:
            # Generic fallback strategies
            entries = self._find_job_entries(response)
            if entries:
                self.logger.info(f"PMC: Found {len(entries)} job entries")
                for entry in entries:
                    item = self._parse_entry(entry, response)
                    if item:
                        yield item
            else:
                self.logger.warning("PMC: No job entries found with standard selectors")
                yield from self._scrape_all_links(response)
        
        # Follow pagination
        yield from self._follow_pagination(response)
        
        
    def _parse_card_link(self, link, response):
        """Parse a single PDF card link (a.card-link-clickble)."""
        
        href = link.attrib.get("href", "")
        if not href:
            return None
        
        full_url = self._normalize_pmc_url(href, response)
        
        # Only process PDF links
        if ".pdf" not in full_url.lower():
            return None
        
        # Title = first <span> inside the card (e.g. "Junior Engineer (Civil) Grade-3 Recruitment Revised Advertisement")
        title_raw = link.css("span::text").get("")
        if not title_raw:
            title_raw = " ".join(link.css("::text").getall())
        
        # Strip "File Format: PDF | File Size: 822 KB" metadata
        title_raw = re.sub(r'File Format:.*', '', title_raw, flags=re.IGNORECASE | re.DOTALL).strip()
        
        if not title_raw or len(title_raw) < 10:
            return None
        
        # Dedup by URL WITHOUT the ?VersionId= param (it changes on re-upload)
        dedup_key = full_url.split('?')[0]
        dedup_hash = hashlib.sha256(f"PMC_{dedup_key}".encode()).hexdigest()
        
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[full_url]):
            return None
        
        clean_title = self._clean_title(title_raw)
        published_date = self._extract_date_from_url(full_url)
        
        # Detect notice type
        title_lower = clean_title.lower()
        is_result = any(kw in title_lower for kw in self.RESULT_KEYWORDS)
        is_corrigendum = any(kw in title_lower for kw in self.CORRIGENDUM_KEYWORDS)
        is_walk_in = "walk-in" in title_lower or "walk in" in title_lower
        is_closed = is_result
        
        # Build item
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "Pune Municipal Corporation"
        item['org_acronym'] = "PMC"
        item['source_url'] = full_url
        item['notification_pdf'] = full_url
        item['apply_start_date'] = published_date
        item['apply_end_date'] = None  # Gemini will extract from PDF
        item['advt_no'] = self._extract_advt_no(clean_title)
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = ["Pune"]
        item['application_links'] = {
            "official_website": "https://www.pmc.gov.in",
        }

        item['state_slug'] = self.target_state
        item['lang'] = self.target_lang
        item['is_walk_in'] = is_walk_in if is_walk_in else None
        item['employment_type'] = 'walkin' if is_walk_in else None
        item['dedup_hash'] = dedup_hash
        item['ai_extracted_data'] = {}  # Empty — Gemini fills from PDF

        # Description
        desc_parts = []
        if published_date:
            desc_parts.append(f"Published: {published_date}")
        if is_result:
            desc_parts.append("Type: RESULT")
        elif is_corrigendum:
            desc_parts.append("Type: CORRIGENDUM/REVISED")
        item['description'] = " | ".join(desc_parts) if desc_parts else clean_title[:100]

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | PMC Pune Recruitment {year}",
            "meta_description": f"{clean_title} at Pune Municipal Corporation.",
        }

        self.logger.info(f"PMC: Yielded: {clean_title[:60]} | PDF: {full_url[-50:]}")
        return item

    def _find_job_entries(self, response):
        """Find all job entry containers using multiple strategies."""
        entries = []
        
        # Strategy 1: Drupal blog article nodes (most likely for PMC)
        drupal_selectors = [
            "article",
            ".node",
            ".view-content .views-row",
            ".blog-post",
            "article.node-recruitment",
            "article.node-article",
        ]
        
        for selector in drupal_selectors:
            candidates = response.css(selector)
            if candidates:
                for item in candidates:
                    text = " ".join(item.css("::text").getall()).strip()
                    if len(text) > 20 and self._is_job_entry(text):
                        entries.append(item)
                if entries:
                    break
        
        # Strategy 2: Table rows (fallback)
        if not entries:
            table_rows = response.css("table tr")
            for row in table_rows:
                text = " ".join(row.css("::text").getall()).strip()
                if len(text) > 20 and self._is_job_entry(text):
                    entries.append(row)
        
        # Strategy 3: Generic containers
        if not entries:
            containers = response.css(
                "div, section, li, .post, .notice, .recruitment-item, "
                ".news-item, .card, .job, .vacancy, .entry"
            )
            for container in containers:
                text = " ".join(container.css("::text").getall()).strip()
                if len(text) > 50 and self._is_job_entry(text):
                    # Only add if it has links (likely a real entry, not just noise)
                    if container.css("a"):
                        entries.append(container)
        
        return entries

    def _is_job_entry(self, text):
        """Check if text contains job-related keywords."""
        if not text or len(text) < 10:
            return False
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
        published_date = self._extract_published_date(entry, all_text)
        
        # Find ALL PDF links (including on webadmin subdomain)
        pdf_urls = []
        detail_url = None
        
        for link in entry.css("a"):
            href = link.attrib.get("href", "")
            if not href:
                continue
            
            full_url = self._normalize_pmc_url(href, response)
            
            # Match PDF files (with or without VersionId parameter)
            if ".pdf" in full_url.lower():
                if full_url not in pdf_urls:
                    pdf_urls.append(full_url)
            elif detail_url is None and "pmc.gov.in" in full_url and not full_url.endswith(('.jpg', '.png', '.jpeg')):
                detail_url = full_url
        
        # Extract advertisement number
        advt_no = self._extract_advt_no(all_text)
        
        # Deduplication — use clean URL without VersionId for dedup
        dedup_key = pdf_urls[0].split('?')[0] if pdf_urls else (advt_no or title_raw[:40])
        dedup_string = f"PMC_{dedup_key}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
       
        candidate_url = pdf_urls[0] if pdf_urls else (detail_url or response.url)
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            return None
        
        clean_title = self._clean_title(title_raw)
        notification_pdf = pdf_urls[0] if pdf_urls else None
        
        # Determine status
        is_closed = "closed" in all_text.lower() or "applications closed" in all_text.lower()
        final_date = last_date or walkin_date
        if final_date and self._is_past_date(final_date):
            is_closed = True
        
        # Detect notice type
        title_lower = title_raw.lower()
        is_result = any(kw in title_lower for kw in self.RESULT_KEYWORDS)
        is_corrigendum = any(kw in title_lower for kw in self.CORRIGENDUM_KEYWORDS)
        if is_result:
            is_closed = True
        
        # Build item
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "Pune Municipal Corporation"
        item['exam_cities'] = ["Pune"]
        item['source_url'] = detail_url or response.url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = published_date
        item['apply_end_date'] = final_date
        item['advt_no'] = advt_no
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = ["Pimpri-Chinchwad", "Pune"]
        item['application_links'] = {
            "official_website": "https://www.pmc.gov.in",
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
        if is_result:
            desc_parts.append("Type: RESULT")
        elif is_corrigendum:
            desc_parts.append("Type: CORRIGENDUM")
        if len(pdf_urls) > 1:
            desc_parts.append(f"{len(pdf_urls)} PDFs attached")
        item['description'] = " | ".join(desc_parts) if desc_parts else clean_title[:100]

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | PMC Recruitment {year}",
            "meta_description": f"{clean_title} at Pimpri-Chinchwad Municipal Corporation.",
        }

        self.logger.info(f"PMC: Yielded item: {clean_title[:50]} | PDF: {notification_pdf or 'None'}")
        return item

    def _normalize_pmc_url(self, url, response):
        """Normalize PMC URLs — handle relative paths and webadmin subdomain."""
        if not url:
            return ""
        
        url = url.strip()
        
        # Already absolute
        if url.startswith("http"):
            return url
        
        # Protocol-relative
        if url.startswith("//"):
            return f"https:{url}"
        
        # Relative URL — resolve against response URL
        return response.urljoin(url)

    def _extract_title(self, entry, all_text):
        """Extract the main title from entry."""
        # Try Drupal-specific heading selectors first
        title_selectors = [
            "h2.node-title a::text",
            "h2 a::text",
            "h2::text",
            "h1::text",
            "h3 a::text",
            "h3::text",
            ".node-title a::text",
            ".title::text",
            ".entry-title::text",
            ".post-title a::text",
        ]
        
        for selector in title_selectors:
            title = entry.css(selector).get("")
            if title and len(title.strip()) > 5:
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

    def _extract_published_date(self, entry, all_text):
        """Extract published/posted date — checks Drupal time element first."""
        # Drupal often uses <time datetime="YYYY-MM-DD"> elements
        datetime_attr = entry.css("time::attr(datetime)").get("")
        if datetime_attr:
            parsed = self._parse_date(datetime_attr)
            if parsed:
                return parsed
        
        # Try <time> inner text
        time_text = entry.css("time::text").get("")
        if time_text:
            parsed = self._parse_date(time_text)
            if parsed:
                return parsed
        
        # Try date classes
        for selector in [".date::text", ".published::text", ".post-date::text", ".field-name-created::text"]:
            date_text = entry.css(selector).get("")
            if date_text:
                parsed = self._parse_date(date_text)
                if parsed:
                    return parsed
        
        # Fallback to regex in text
        patterns = [
            r'published[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'posted[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'dated[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'notification date[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, all_text, re.IGNORECASE)
            if match:
                parsed = self._parse_date(match.group(1))
                if parsed:
                    return parsed
        
        return None

    def _extract_advt_no(self, text):
        """Extract advertisement number."""
        patterns = [
            r'(?:advt|advertisement|adv|notification)[\s.#/-]*no[\s.:\-]*([A-Z0-9/\-]+\d{4})',
            r'(?:advt|advertisement|adv|notification)[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'(?:no|number)[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'([A-Z]+/[A-Z0-9]+/\d{4})',
            r'PMC[\s/-]*([A-Z0-9/\-]+\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None

    def _follow_pagination(self, response):
        """Follow pagination links to get more pages."""
        # Drupal typically uses .pager-next or <a rel="next">
        next_links = response.css(
            ".pager-next a::attr(href), "
            ".pager-item.next a::attr(href), "
            "a.pager-next::attr(href), "
            "li.pager-next a::attr(href), "
            "a[rel='next']::attr(href), "
            "a.next::attr(href), "
            "li.next a::attr(href), "
            "a:contains('Next')::attr(href), "
            "a:contains('›')::attr(href), "
            "a:contains('next')::attr(href)"
        ).getall()
        
        seen_urls = set()
        for link in next_links:
            if link:
                full_url = self._normalize_pmc_url(link, response)
                if full_url != response.url and full_url not in seen_urls:
                    seen_urls.add(full_url)
                    self.logger.info(f"PMC: Following pagination to {full_url}")
                    yield scrapy.Request(full_url, callback=self.parse_careers_page)

    def _scrape_all_links(self, response):
        """Fallback: scrape all PDF and job-related links."""
        seen = set()
        
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = " ".join(link.css("::text").getall()).strip()
            
            if not href:
                continue
            
            full_url = self._normalize_pmc_url(href, response)
            
            # Only PDFs (including webadmin URLs with VersionId)
            is_pdf = ".pdf" in full_url.lower()
            
            if not is_pdf:
                continue
            
            # Dedup by URL without query params
            dedup_key = full_url.split('?')[0]
            if dedup_key in seen:
                continue
            seen.add(dedup_key)
            
            dedup_hash = hashlib.sha256(f"PMC_PDF_{dedup_key}".encode()).hexdigest()
            if self.track_duplicate(dedup_hash, label=text, urls=[full_url]):
                continue
            
            clean_title = self._clean_title(text) if text else full_url.split("/")[-1].split("?")[0].replace(".pdf", "").replace("_", " ").replace("-", " ")
            
            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "Pune Municipal Corporation"
            item['exam_cities'] = ["Pune"]
            item['source_url'] = full_url
            item['notification_pdf'] = full_url
            item['apply_start_date'] = self._extract_date_from_url(full_url)
            item['apply_end_date'] = None
            item['advt_no'] = None
            item['status'] = 'published'
            item['exam_cities'] = ["Pimpri-Chinchwad", "Pune"]
            item['application_links'] = {
                "official_website": "https://www.pmc.gov.in",
            }

            item['state_slug'] = self.target_state
            item['lang'] = self.target_lang
            item['is_walk_in'] = None
            item['employment_type'] = None
            item['dedup_hash'] = dedup_hash
            item['ai_extracted_data'] = {}

            item['description'] = f"PDF: {full_url.split('/')[-1].split('?')[0]}"

            year = datetime.utcnow().year
            item['seo_metadata'] = {
                "meta_title": f"{clean_title} | PMC Recruitment {year}",
                "meta_description": f"{clean_title} at Pimpri-Chinchwad Municipal Corporation.",
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
            # ISO format from <time datetime="...">
            if "T" in text:
                return date_parser.parse(text).strftime("%Y-%m-%d")
            
            # YYYY-MM-DD
            if re.match(r'^\d{4}-\d{2}-\d{2}', text):
                return datetime.strptime(text[:10], "%Y-%m-%d").strftime("%Y-%m-%d")
            
            # DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
            if re.match(r'^\d{2}[./-]\d{2}[./-]\d{4}$', text):
                text = text.replace('/', '-').replace('.', '-')
                day, month, year = text.split('-')
                date = datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d")
                return date.strftime("%Y-%m-%d")
            
            # Try dateutil
            return date_parser.parse(text, dayfirst=True).strftime("%Y-%m-%d")
        except (ValueError, OverflowError, TypeError):
            return None

    def _extract_date_from_url(self, url):
        """Extract date from URL or PDF filename.
        
        Handles PMC pattern: /sites/default/files/2025-09/Civil-Junior-Engineer-Recruitment-30-09-2025.pdf
        """
        if not url:
            return None
        
        # Remove query params
        clean_url = url.split('?')[0]
        
        # Try to extract date from folder path (YYYY-MM)
        folder_match = re.search(r'/(\d{4})-(\d{2})/', clean_url)
        if folder_match:
            year, month = folder_match.groups()
            # Use 1st of that month as fallback
            try:
                return datetime.strptime(f"{year}-{month}-01", "%Y-%m-%d").strftime("%Y-%m-%d")
            except ValueError:
                pass
        
        # Try DD-MM-YYYY in filename (like 30-09-2025)
        date_match = re.search(r'(\d{2})-(\d{2})-(\d{4})', clean_url)
        if date_match:
            day, month, year = date_match.groups()
            try:
                return datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d").strftime("%Y-%m-%d")
            except ValueError:
                pass
        
        # YYYY-MM-DD
        match = re.search(r'(\d{4})-(\d{2})-(\d{2})', clean_url)
        if match:
            try:
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
        cleaned = re.sub(r'<[^>]+>', '', text)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        cleaned = re.sub(r'[*•]+', '', cleaned)
        return cleaned[:500]