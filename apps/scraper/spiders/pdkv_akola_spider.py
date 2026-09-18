# ============================================================
# spiders/pdkv_akola_spider.py — PDKV Akola (DYNAMIC, WordPress-based)
# Target: https://www.pdkv.ac.in/?page_id=1406
#
# PAGE STRUCTURE:
# - WordPress page with table-based layout
# - Each recruitment entry is a table row
# - Mixed Marathi + English content
# - Entries contain department names + numbered items
# - PDF links embedded within entry text
#
# PRINCIPLES (same as ACTREC/NEERI/IISER/ICT spiders):
# - NO hardcoded venue, selection process, relaxation, etc.
# - All rich data extracted from PDF by Gemini pipeline
# - Random user agents (handled by RandomUserAgentMiddleware)
# - Dynamic ai_extracted_data structure (starts empty, AI fills it)
# - Bilingual support (Marathi + English)
# ============================================================

import scrapy
import re
import hashlib
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class PdkvAkolaSpider(DuplicateStopMixin, scrapy.Spider):
    name = "pdkv_akola"
    source_name = "PDKV Akola Official Recruitment Portal"
    allowed_domains = ["pdkv.ac.in"]
    start_urls = [
        "https://www.pdkv.ac.in/?page_id=1406",
        "https://www.pdkv.ac.in/",  # Warm-up
    ]

    dedup_org = "PDKV_AKOLA"
    
    # Multi-state / multi-language metadata
    target_state = "maharashtra"  # PDKV is in Akola, Maharashtra
    target_lang = "mr"            # Primary language (Marathi), but bilingual content

    custom_settings = {
        "DOWNLOAD_DELAY": 3,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        # NO USER_AGENT — RandomUserAgentMiddleware handles it
    }

    # Keywords that indicate a recruitment entry
    RECRUITMENT_KEYWORDS = [
        "recruitment", "vacancy", "vacancies", "advertisement", "walk-in",
        "walk in", "interview", "भरती", "जाहिरात", "मुलाखत", "रिक्त पद",
        "पदभरती", "contractual", "adhoc", "fellow", "trainee", "professor",
        "assistant", "officer", "young professional", "project assistant",
    ]

    # Department name patterns (English + Marathi)
    DEPT_PATTERNS = [
        r'(?:Head|Associate Dean|कुलसचिव|विभाग प्रमुख|Registrar)',
        r'Department of \w+',
        r'विभाग',
        r'College of \w+',
    ]

    def parse(self, response):
        self.logger.info(f"PDKV Akola: Parsing {response.url} — status {response.status}")
        
        # If this is homepage warm-up, go to actual recruitment page
        if response.url == "https://www.pdkv.ac.in/":
            yield scrapy.Request(
                "https://www.pdkv.ac.in/?page_id=1406",
                callback=self.parse_recruitment_page
            )
            return
        
        yield from self.parse_recruitment_page(response)

    def parse_recruitment_page(self, response):
        """Parse the recruitment page and extract entries."""
        self.logger.info(f"PDKV Akola: Parsing recruitment page — status {response.status}")

        # The page uses a table-based layout
        # Each recruitment entry is typically in a table row or a div
        entries = self._find_recruitment_entries(response)
        
        if entries:
            self.logger.info(f"PDKV Akola: Found {len(entries)} recruitment entries")
            for entry in entries:
                item = self._parse_entry(entry, response)
                if item:
                    yield item
        else:
            self.logger.warning("PDKV Akola: No recruitment entries found with standard selectors")
            # Fallback: scan entire page for PDF links
            yield from self._scrape_all_pdfs(response)

    def _find_recruitment_entries(self, response):
        """Find all recruitment entries on the page."""
        entries = []
        
        # Try table rows first (WordPress often uses tables)
        table_rows = response.css("table tr, table td")
        for row in table_rows:
            text = " ".join(row.css("::text").getall()).strip()
            if len(text) > 20 and self._is_recruitment_entry(text):
                entries.append(row)
        
        # Try divs and other containers
        if not entries:
            containers = response.css("div, article, section, li")
            for container in containers:
                text = " ".join(container.css("::text").getall()).strip()
                if len(text) > 20 and self._is_recruitment_entry(text):
                    entries.append(container)
        
        # Fallback: split by line breaks and treat each substantial block as an entry
        if not entries:
            all_text = response.text
            blocks = re.split(r'\n{2,}', all_text)
            for block in blocks:
                if len(block) > 50 and self._is_recruitment_entry(block):
                    entries.append(scrapy.Selector(text=block))
        
        return entries

    def _is_recruitment_entry(self, text):
        """Check if text contains recruitment keywords."""
        text_lower = text.lower()
        return any(kw in text_lower for kw in self.RECRUITMENT_KEYWORDS)

    def _parse_entry(self, entry, response):
        """Parse a single recruitment entry."""
        
        # Extract all text
        all_text = " ".join(entry.css("::text").getall()).strip()
        if not all_text or len(all_text) < 20:
            return None
        
        # Extract department name
        dept_name = self._extract_department(all_text)
        
        # Extract title (usually the first line or the main announcement)
        title_raw = self._extract_title(all_text, dept_name)
        if not title_raw or len(title_raw) < 10:
            return None
        
        # Detect language (Marathi has Devanagari script)
        has_devanagari = bool(re.search(r'[\u0900-\u097F]', title_raw))
        detected_lang = 'mr' if has_devanagari else 'en'
        
        # Extract dates (walk-in dates, last dates, etc.)
        walkin_date = self._extract_walkin_date(all_text)
        last_date = self._extract_last_date(all_text)
        published_date = self._extract_published_date(all_text)
        
        # Detect walk-in
        is_walk_in = "walk-in" in all_text.lower() or "walk in" in all_text.lower() or "मुलाखत" in all_text
        
        # Find PDF links in this entry
        pdf_urls = []
        for link in entry.css("a"):
            href = link.attrib.get("href", "")
            if href.lower().endswith(".pdf"):
                full_url = response.urljoin(href) if not href.startswith("http") else href
                pdf_urls.append(full_url)
        
        # Extract advertisement number
        advt_no = self._extract_advt_no(all_text)
        
        # Deduplication
        dedup_string = f"PDKV_{advt_no or title_raw[:40]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            self.logger.debug(f"PDKV: Skipping known entry")
            return None
        
        clean_title = self._clean_title(title_raw)
        notification_pdf = pdf_urls[0] if pdf_urls else None
        
        # Determine status
        is_closed = "closed" in all_text.lower() or "बंद" in all_text
        final_date = last_date or walkin_date
        if final_date and self._is_past_date(final_date):
            is_closed = True
        
        # Build item
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "Dr. Panjabrao Deshmukh Krishi Vidyapeeth"
        item['org_acronym'] = "PDKV Akola"
        item['source_url'] = response.url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = published_date
        item['apply_end_date'] = final_date
        item['advt_no'] = advt_no
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = ["Akola"]
        item['application_links'] = {
            "official_website": "https://www.pdkv.ac.in",
            "all_pdfs": pdf_urls if len(pdf_urls) > 1 else None,
        }

        # Multi-state / multi-language
        item['state_slug'] = self.target_state
        item['lang'] = detected_lang
        item['is_walk_in'] = is_walk_in if is_walk_in else None
        item['employment_type'] = 'walkin' if is_walk_in else None
        item['dedup_hash'] = dedup_hash
        
        # DYNAMIC: Empty dict — Gemini pipeline will fill from PDF
        item['ai_extracted_data'] = {}

        # Description
        desc_parts = []
        if dept_name:
            desc_parts.append(f"Dept: {dept_name[:50]}")
        if is_walk_in:
            desc_parts.append("Type: WALK-IN")
        if walkin_date:
            desc_parts.append(f"Walk-In: {walkin_date}")
        if last_date:
            desc_parts.append(f"Last Date: {last_date}")
        item['description'] = " | ".join(desc_parts) if desc_parts else clean_title[:100]

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | PDKV Akola Recruitment {year}",
            "meta_description": f"{clean_title} at Dr. Panjabrao Deshmukh Krishi Vidyapeeth, Akola.",
        }

        self.logger.info(f"PDKV: Yielded item: {clean_title[:50]} | PDF: {notification_pdf or 'None'}")
        return item

    def _extract_department(self, text):
        """Extract department name from entry text."""
        # Try to match department patterns
        for pattern in self.DEPT_PATTERNS:
            match = re.search(pattern + r'[^\n:]+', text, re.IGNORECASE)
            if match:
                dept = match.group(0).strip()
                # Clean up
                dept = re.sub(r'\s+', ' ', dept)
                return dept[:100]
        
        # Fallback: look for "Department of" or "विभाग"
        match = re.search(r'(?:Department of|विभाग)\s+([^\n,]+)', text, re.IGNORECASE)
        if match:
            return match.group(1).strip()[:100]
        
        return None

    def _extract_title(self, text, dept_name):
        """Extract the main title from entry text."""
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        # If we have a department name, skip it and take the next line
        if dept_name and len(lines) > 1:
            for line in lines:
                if line != dept_name and len(line) > 10:
                    return line
        
        # Otherwise take the first substantial line
        for line in lines:
            if len(line) > 10:
                return line
        
        return text[:200]

    def _extract_walkin_date(self, text):
        """Extract walk-in interview date."""
        patterns = [
            r'walk-in.*?(\d{2}[./-]\d{2}[./-]\d{4})',
            r'मुलाखत.*?(\d{1,2}[./-]\d{1,2}[./-]\d{4})',
            r'interview.*?on\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'conducted on\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'रोजी\s+(\d{1,2}[./-]\d{1,2}[./-]\d{4})',
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
            r'अंतिम तारीख[:\s]+(\d{1,2}[./-]\d{1,2}[./-]\d{4})',
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
            r'दिनांक[:\s]+(\d{1,2}[./-]\d{1,2}[./-]\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self._parse_date(match.group(1))
        
        return None

    def _extract_advt_no(self, text):
        """Extract advertisement number."""
        patterns = [
            r'(?:advt|advertisement|adv|जाहिरात)[\s.#/-]*no[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'(?:advt|advertisement|adv|जाहिरात)[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'(?:क्र|no|number)[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'([A-Z]+/[A-Z0-9]+/\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
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
            
            dedup_hash = hashlib.sha256(f"PDKV_PDF_{full_url}".encode()).hexdigest()
            from pipelines import DeduplicationPipeline
            if self.track_duplicate(dedup_hash, label=text or full_url, urls=[full_url]):
                continue
            
            clean_title = self._clean_title(text) if text else full_url.split("/")[-1].replace(".pdf", "").replace("_", " ")
            
            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "Dr. Panjabrao Deshmukh Krishi Vidyapeeth"
            item['org_acronym'] = "PDKV Akola"
            item['source_url'] = full_url
            item['notification_pdf'] = full_url
            item['apply_start_date'] = None
            item['apply_end_date'] = self._extract_date_from_url(full_url)
            item['advt_no'] = None
            item['status'] = 'published'
            item['exam_cities'] = ["Akola"]
            item['application_links'] = {
                "official_website": "https://www.pdkv.ac.in",
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
                "meta_title": f"{clean_title} | PDKV Akola Recruitment {year}",
                "meta_description": f"{clean_title} at PDKV Akola.",
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