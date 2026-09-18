# ============================================================
# spiders/icar_nbsslup_spider.py — ICAR-NBSS&LUP Nagpur (DYNAMIC)
# Target: https://icar-nbsslup.org.in/jobs_viewmore/
#
# PAGE STRUCTURE:
# - Simple list-based layout with job announcements
# - Walk-in interview dates common
# - Mixed text with dates, positions, project names
# - PDF links may be embedded or on detail pages
#
# PRINCIPLES (same as ACTREC/NEERI/IISER/ICT/PDKV/CIRCOT spiders):
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


class IcarNbsslupSpider(DuplicateStopMixin, scrapy.Spider):
    name = "icar_nbsslup"
    source_name = "ICAR-NBSS&LUP Official Jobs Portal"
    allowed_domains = ["icar-nbsslup.org.in"]
    start_urls = [
        "https://icar-nbsslup.org.in/jobs_viewmore/",
        "https://icar-nbsslup.org.in/",  # Warm-up
    ]

    dedup_org = "ICAR_NBSSLUP"
    
    # Multi-state / multi-language metadata
    target_state = "maharashtra"  # NBSS&LUP is in Nagpur, Maharashtra
    target_lang = "en"            # ICAR institutes primarily use English

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
        "assistant", "officer", "scientist", "research", "young professional",
        "project", "technical", "contractual", "adhoc", "srf", "jrf",
        "applications are invited", "position", "post of", "engagement"
    ]

    def parse(self, response):
        self.logger.info(f"ICAR-NBSS&LUP: Parsing {response.url} — status {response.status}")
        
        # If this is homepage warm-up, go to jobs page
        if response.url == "https://icar-nbsslup.org.in/" or response.url == "https://icar-nbsslup.org.in":
            yield scrapy.Request(
                "https://icar-nbsslup.org.in/jobs_viewmore/",
                callback=self.parse_jobs_page
            )
            return
        
        yield from self.parse_jobs_page(response)

    def parse_jobs_page(self, response):
        """Parse the jobs page and extract job openings."""
        self.logger.info(f"ICAR-NBSS&LUP: Parsing jobs page — status {response.status}")

        # Try multiple parsing strategies
        entries = self._find_job_entries(response)
        
        if entries:
            self.logger.info(f"ICAR-NBSS&LUP: Found {len(entries)} job entries")
            for entry in entries:
                item = self._parse_entry(entry, response)
                if item:
                    yield item
        else:
            self.logger.warning("ICAR-NBSS&LUP: No job entries found with standard selectors")
            # Fallback: scan entire page for links and text blocks
            yield from self._scrape_all_content(response)

    def _find_job_entries(self, response):
        """Find all job entry containers using multiple strategies."""
        entries = []
        
        # Strategy 1: List items
        list_items = response.css("li, ul li, ol li")
        for item in list_items:
            text = " ".join(item.css("::text").getall()).strip()
            if len(text) > 30 and self._is_job_entry(text):
                entries.append(item)
        
        # Strategy 2: Paragraphs or divs
        if not entries:
            containers = response.css("p, div, article, section")
            for container in containers:
                text = " ".join(container.css("::text").getall()).strip()
                if len(text) > 50 and self._is_job_entry(text):
                    entries.append(container)
        
        # Strategy 3: Text blocks separated by line breaks
        if not entries:
            all_text = response.text
            blocks = re.split(r'\n{2,}', all_text)
            for block in blocks:
                if len(block) > 50 and self._is_job_entry(block):
                    entries.append(scrapy.Selector(text=block))
        
        return entries

    def _is_job_entry(self, text):
        """Check if text contains job-related keywords."""
        text_lower = text.lower()
        return any(kw in text_lower for kw in self.JOB_KEYWORDS)

    def _parse_entry(self, entry, response):
        """Parse a single job entry."""
        
        # Extract all text
        all_text = " ".join(entry.css("::text").getall()).strip()
        if not all_text or len(all_text) < 30:
            return None
        
        # Extract title (first sentence or main announcement)
        title_raw = self._extract_title(all_text)
        if not title_raw or len(title_raw) < 15:
            return None
        
        # Detect walk-in
        is_walk_in = "walk-in" in all_text.lower() or "walk in" in all_text.lower()
        
        # Extract dates
        walkin_date = self._extract_walkin_date(all_text)
        last_date = self._extract_last_date(all_text)
        published_date = self._extract_published_date(all_text)
        
        # Find PDF links
        pdf_urls = []
        for link in entry.css("a"):
            href = link.attrib.get("href", "")
            if href.lower().endswith(".pdf"):
                full_url = response.urljoin(href) if not href.startswith("http") else href
                pdf_urls.append(full_url)
        
        # Find detail page links (non-PDF links that might have more info)
        detail_link = None
        for link in entry.css("a"):
            href = link.attrib.get("href", "")
            if href and not href.lower().endswith(".pdf") and href.startswith("http"):
                detail_link = href
                break
        
        # Extract advertisement number
        advt_no = self._extract_advt_no(all_text)
        
        # Extract location (city) if mentioned
        location = self._extract_location(all_text)
        
        # Deduplication
        dedup_string = f"NBSSLUP_{advt_no or title_raw[:40]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            self.logger.debug(f"NBSSLUP: Skipping known entry")
            return None
        
        clean_title = self._clean_title(title_raw)
        notification_pdf = pdf_urls[0] if pdf_urls else None
        
        # Determine status
        is_closed = "closed" in all_text.lower() or "applications closed" in all_text.lower()
        final_date = last_date or walkin_date
        if final_date and self._is_past_date(final_date):
            is_closed = True
        
        # Build item
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "ICAR-National Bureau of Soil Survey and Land Use Planning"
        item['org_acronym'] = "ICAR-NBSS&LUP"
        item['source_url'] = detail_link or response.url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = published_date
        item['apply_end_date'] = final_date
        item['advt_no'] = advt_no
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = [location] if location else ["Nagpur"]
        item['application_links'] = {
            "official_website": "https://icar-nbsslup.org.in",
            "detail_page": detail_link,
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
        if location:
            desc_parts.append(f"Location: {location}")
        if len(pdf_urls) > 1:
            desc_parts.append(f"{len(pdf_urls)} PDFs attached")
        item['description'] = " | ".join(desc_parts) if desc_parts else clean_title[:100]

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | ICAR-NBSS&LUP Recruitment {year}",
            "meta_description": f"{clean_title} at ICAR-NBSS&LUP, {location or 'Nagpur'}.",
        }

        self.logger.info(f"NBSSLUP: Yielded item: {clean_title[:50]} | PDF: {notification_pdf or 'None'}")
        return item

    def _extract_title(self, text):
        """Extract the main title from entry text."""
        # Take first sentence or first 150 chars
        sentences = re.split(r'[.!?]', text)
        if sentences and len(sentences[0]) > 15:
            return sentences[0].strip()
        
        # Otherwise take first substantial chunk
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        if lines:
            return lines[0][:200]
        
        return text[:200]

    def _extract_walkin_date(self, text):
        """Extract walk-in interview date."""
        patterns = [
            r'walk-in.*?(\d{2}[./-]\d{2}[./-]\d{4})',
            r'interview.*?on\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'conducted on\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'scheduled (?:for|on)\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'on\s+(\d{2}[./-]\d{2}[./-]\d{4})\s+(?:at|from)',
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
            r'apply by\s+(\d{2}[./-]\d{2}[./-]\d{4})',
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
            r'NBSSLUP[\s/-]*([A-Z0-9/\-]+\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None

    def _extract_location(self, text):
        """Extract location/city from text."""
        # Common cities for NBSS&LUP projects
        cities = ["Nagpur", "Amravati", "Pune", "Mumbai", "Bhopal", "Delhi", 
                  "Hyderabad", "Bangalore", "Kolkata", "Chennai"]
        
        text_lower = text.lower()
        for city in cities:
            if city.lower() in text_lower:
                return city
        
        return None

    def _scrape_all_content(self, response):
        """Fallback: scrape all content and create items from text blocks."""
        # Scan for all PDF links
        seen_pdfs = set()
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = " ".join(link.css("::text").getall()).strip()
            
            if not href.lower().endswith(".pdf"):
                continue
            
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            if full_url in seen_pdfs:
                continue
            seen_pdfs.add(full_url)
            
            dedup_hash = hashlib.sha256(f"NBSSLUP_PDF_{full_url}".encode()).hexdigest()
            from pipelines import DeduplicationPipeline
            if self.track_duplicate(dedup_hash, label=text or full_url, urls=[full_url]):
                continue
            
            clean_title = self._clean_title(text) if text else full_url.split("/")[-1].replace(".pdf", "").replace("_", " ")
            
            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "ICAR-National Bureau of Soil Survey and Land Use Planning"
            item['org_acronym'] = "ICAR-NBSS&LUP"
            item['source_url'] = full_url
            item['notification_pdf'] = full_url
            item['apply_start_date'] = None
            item['apply_end_date'] = self._extract_date_from_url(full_url)
            item['advt_no'] = None
            item['status'] = 'published'
            item['exam_cities'] = ["Nagpur"]
            item['application_links'] = {
                "official_website": "https://icar-nbsslup.org.in",
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
                "meta_title": f"{clean_title} | ICAR-NBSS&LUP Recruitment {year}",
                "meta_description": f"{clean_title} at ICAR-NBSS&LUP, Nagpur.",
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