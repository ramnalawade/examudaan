# ============================================================
# spiders/mecl_spider.py — MECL Nagpur (DYNAMIC)
# Target: https://mecl.co.in/Careers.aspx
#
# PAGE STRUCTURE:
# - "Recruitment notices and downloadable documents" section
# - Table with columns: Sr. No. | Title | Download/Link
# - Multiple PDF links for advertisements, results, cancellations
# - "Information Handouts" section with role-specific PDFs
# - Advertisement numbers: "01/Rectt./2024", "02/Rectt./2026"
#
# PRINCIPLES (same as ACTREC/NEERI/IISER/ICT/PDKV/CIRCOT/NBSSLUP/KRCL):
# - NO hardcoded venue, selection process, relaxation, etc.
# - All rich data extracted from PDF by Gemini pipeline
# - Random user agents (handled by RandomUserAgentMiddleware)
# - Dynamic ai_extracted_data structure (starts empty, AI fills it)
# ============================================================

import scrapy
import re
import hashlib
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class MeclSpider(DuplicateStopMixin, scrapy.Spider):
    name = "mecl"
    source_name = "MECL Official Careers Portal"
    allowed_domains = ["mecl.co.in"]
    start_urls = [
        "https://mecl.co.in/Careers.aspx",
        "https://mecl.co.in/",  # Warm-up
    ]

    dedup_org = "MECL"
    
    # Multi-state / multi-language metadata
    target_state = "maharashtra"  # MECL HQ in Nagpur, Maharashtra
    target_lang = "en"

    custom_settings = {
        "DOWNLOAD_DELAY": 3,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        # NO USER_AGENT — RandomUserAgentMiddleware handles it
    }

    # Keywords that indicate different types of notices
    RECRUITMENT_KEYWORDS = [
        "recruitment", "vacancy", "advertisement", "advt", "engagement",
        "young professional", "executive trainee", "officer", "engineer",
        "geologist", "geophysicist", "chemist", "accountant", "assistant"
    ]
    
    RESULT_KEYWORDS = [
        "selected candidates", "list of selected", "result", "shortlist",
        "qualified candidates", "merit list", "panel"
    ]
    
    CANCELLATION_KEYWORDS = [
        "cancellation", "cancelled", "postponement", "postponed"
    ]

    def parse(self, response):
        self.logger.info(f"MECL: Parsing {response.url} — status {response.status}")
        
        # If this is homepage warm-up, go to careers page
        if response.url == "https://mecl.co.in/" or response.url == "https://mecl.co.in":
            yield scrapy.Request(
                "https://mecl.co.in/Careers.aspx",
                callback=self.parse_careers_page
            )
            return
        
        yield from self.parse_careers_page(response)

    def parse_careers_page(self, response):
        """Parse the careers page and extract recruitment notices."""
        self.logger.info(f"MECL: Parsing careers page — status {response.status}")

        # Find all tables on the page
        tables = response.css("table")
        
        entries_found = 0
        for table in tables:
            rows = table.css("tr")
            for row in rows:
                item = self._parse_table_row(row, response)
                if item:
                    entries_found += 1
                    yield item
        
        if entries_found == 0:
            self.logger.warning("MECL: No recruitment entries found in tables")
            # Fallback: scan entire page for PDF links
            yield from self._scrape_all_pdfs(response)
        else:
            self.logger.info(f"MECL: Found {entries_found} recruitment entries")

    def _parse_table_row(self, row, response):
        """Parse a single table row."""
        
        cells = row.css("td")
        if len(cells) < 2:
            return None
        
        # Extract all text from the row
        all_text = " ".join(row.css("::text").getall()).strip()
        if not all_text or len(all_text) < 20:
            return None
        
        # Extract title (usually in second column)
        title_raw = cells[1].css("::text").get("").strip() if len(cells) > 1 else ""
        if not title_raw or len(title_raw) < 10:
            # Try to get title from entire row text
            title_raw = self._extract_title_from_text(all_text)
        
        if not title_raw or len(title_raw) < 10:
            return None
        
        # Skip non-recruitment entries
        if not self._is_recruitment_related(all_text):
            return None
        
        # Find PDF links in this row
        pdf_urls = []
        for link in row.css("a"):
            href = link.attrib.get("href", "")
            if href.lower().endswith(".pdf") or "download" in href.lower():
                full_url = response.urljoin(href) if not href.startswith("http") else href
                pdf_urls.append(full_url)
        
        # Find detail/apply links (non-PDF)
        detail_link = None
        for link in row.css("a"):
            href = link.attrib.get("href", "")
            text = link.css("::text").get("").strip().lower()
            if href and not href.lower().endswith(".pdf"):
                if "visit" in text or "link" in text or "apply" in text:
                    full_url = response.urljoin(href) if not href.startswith("http") else href
                    detail_link = full_url
                    break
        
        # Extract advertisement number
        advt_no = self._extract_advt_no(all_text)
        
        # Detect notice type
        is_result = self._is_result(all_text)
        is_cancellation = self._is_cancellation(all_text)
        
        # Extract dates
        last_date = self._extract_last_date(all_text)
        publish_date = self._extract_publish_date(all_text)
        
        # Deduplication
        dedup_string = f"MECL_{advt_no or title_raw[:40]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            self.logger.debug(f"MECL: Skipping known entry")
            return None
        
        clean_title = self._clean_title(title_raw)
        notification_pdf = pdf_urls[0] if pdf_urls else None
        
        # Determine status
        is_closed = is_result or is_cancellation
        if last_date and self._is_past_date(last_date):
            is_closed = True
        
        # Determine employment type
        employment_type = None
        if "young professional" in all_text.lower():
            employment_type = "contractual"
        elif "executive trainee" in all_text.lower():
            employment_type = "permanent"
        elif "contract" in all_text.lower() or "contractual" in all_text.lower():
            employment_type = "contractual"
        
        # Build item
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "Mineral Exploration & Consultancy Limited"
        item['org_acronym'] = "MECL"
        item['source_url'] = detail_link or response.url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = publish_date
        item['apply_end_date'] = last_date
        item['advt_no'] = advt_no
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = ["Nagpur"]
        item['application_links'] = {
            "official_website": "https://mecl.co.in",
            "detail_page": detail_link,
            "all_pdfs": pdf_urls if len(pdf_urls) > 1 else None,
        }

        # Multi-state / multi-language
        item['state_slug'] = self.target_state
        item['lang'] = self.target_lang
        item['is_walk_in'] = None  # MECL typically uses online applications
        item['employment_type'] = employment_type
        item['dedup_hash'] = dedup_hash
        
        # DYNAMIC: Empty dict — Gemini pipeline will fill from PDF
        item['ai_extracted_data'] = {}

        # Description
        desc_parts = []
        if is_result:
            desc_parts.append("Type: RESULT")
        elif is_cancellation:
            desc_parts.append("Type: CANCELLATION")
        if advt_no:
            desc_parts.append(f"Advt: {advt_no}")
        if last_date:
            desc_parts.append(f"Last Date: {last_date}")
        if len(pdf_urls) > 1:
            desc_parts.append(f"{len(pdf_urls)} PDFs attached")
        item['description'] = " | ".join(desc_parts) if desc_parts else clean_title[:100]

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | MECL Recruitment {year}",
            "meta_description": f"{clean_title} at Mineral Exploration & Consultancy Limited, Nagpur.",
        }

        self.logger.info(f"MECL: Yielded item: {clean_title[:50]} | PDF: {notification_pdf or 'None'}")
        return item

    def _is_recruitment_related(self, text):
        """Check if text is related to recruitment."""
        text_lower = text.lower()
        return any(kw in text_lower for kw in self.RECRUITMENT_KEYWORDS + self.RESULT_KEYWORDS + self.CANCELLATION_KEYWORDS)

    def _is_result(self, text):
        """Check if this is a result/selection list."""
        text_lower = text.lower()
        return any(kw in text_lower for kw in self.RESULT_KEYWORDS)

    def _is_cancellation(self, text):
        """Check if this is a cancellation notice."""
        text_lower = text.lower()
        return any(kw in text_lower for kw in self.CANCELLATION_KEYWORDS)

    def _extract_title_from_text(self, text):
        """Extract title from text when table structure is unclear."""
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        for line in lines:
            # Skip serial numbers
            if re.match(r'^\d+\s*$', line):
                continue
            # Skip metadata
            if line.startswith(("File Size:", "File Language:", "Download", "Visit")):
                continue
            # Take first substantial line
            if len(line) > 15:
                return line
        
        return text[:200]

    def _extract_advt_no(self, text):
        """Extract advertisement number."""
        patterns = [
            r'(?:advt|advertisement)[\s.#/-]*no[\s.:\-]*([A-Z0-9/\-]+\d{4})',
            r'(?:advt|advertisement)[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'Advt\.?\s*No\.?\s*([A-Z0-9/\-]+\d{4})',
            r'Advertisement No\.?\s*:?\s*([A-Z0-9/\-]+\d{4})',
            r'(\d{2}/Rectt\.?/\d{4})',  # 01/Rectt./2024 pattern
            r'([A-Z]+/[A-Z0-9/\-]+\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None

    def _extract_last_date(self, text):
        """Extract last date / closing date."""
        patterns = [
            r'last date[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'closing date[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'extended closing date is\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'before\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'on or before\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'deadline[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self._parse_date(match.group(1))
        
        return None

    def _extract_publish_date(self, text):
        """Extract publish/posted date."""
        patterns = [
            r'published[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'posted[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'dated[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self._parse_date(match.group(1))
        
        return None

    def _scrape_all_pdfs(self, response):
        """Fallback: scrape all PDF links on the page."""
        seen = set()
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = " ".join(link.css("::text").getall()).strip()
            
            if not href.lower().endswith(".pdf"):
                continue
            
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            if full_url in seen:
                continue
            seen.add(full_url)
            
            dedup_hash = hashlib.sha256(f"MECL_PDF_{full_url}".encode()).hexdigest()
            from pipelines import DeduplicationPipeline
            if self.track_duplicate(dedup_hash, label=text or full_url, urls=[full_url]):
                continue
            
            clean_title = self._clean_title(text) if text else full_url.split("/")[-1].replace(".pdf", "").replace("_", " ")
            
            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "Mineral Exploration & Consultancy Limited"
            item['org_acronym'] = "MECL"
            item['source_url'] = full_url
            item['notification_pdf'] = full_url
            item['apply_start_date'] = None
            item['apply_end_date'] = self._extract_date_from_url(full_url)
            item['advt_no'] = self._extract_advt_no(text)
            item['status'] = 'published'
            item['exam_cities'] = ["Nagpur"]
            item['application_links'] = {
                "official_website": "https://mecl.co.in",
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
                "meta_title": f"{clean_title} | MECL Recruitment {year}",
                "meta_description": f"{clean_title} at MECL, Nagpur.",
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
        # Remove HTML tags if any
        cleaned = re.sub(r'<[^>]+>', '', text)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        cleaned = re.sub(r'[*•]+', '', cleaned)
        return cleaned[:500]