# ============================================================
# spiders/konkan_railway_spider.py — Konkan Railway KRCL (DYNAMIC)
# Target: https://konkanrailway.com/en/current_notification
#
# PAGE STRUCTURE:
# - List-based layout with "Intimation" and "Notifications" sections
# - Each entry has: date, title, PDF link, publish date, closing date
# - Format: PDF Size:XXX KB Language:English Publish Date:DD/MM/YYYY
# - Mixed content: results, vacancies, deputation posts, contract posts
#
# PRINCIPLES (same as ACTREC/NEERI/IISER/ICT/PDKV/CIRCOT/NBSSLUP):
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


class KonkanRailwaySpider(DuplicateStopMixin, scrapy.Spider):
    name = "konkan_railway"
    source_name = "Konkan Railway Official Notifications Portal"
    allowed_domains = ["konkanrailway.com"]
    start_urls = [
        "https://konkanrailway.com/en/current_notification",
        "https://konkanrailway.com/",  # Warm-up
    ]

    dedup_org = "KONKAN_RAILWAY"
    
    # Multi-state / multi-language metadata
    target_state = "maharashtra"  # KRCL HQ in Belapur/Navi Mumbai
    target_lang = "en"

    custom_settings = {
        "DOWNLOAD_DELAY": 3,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        # NO USER_AGENT — RandomUserAgentMiddleware handles it
    }

    # Keywords that indicate a job/recruitment notification
    RECRUITMENT_KEYWORDS = [
        "vacancy", "vacancies", "recruitment", "notification", "employment",
        "post of", "posts", "engagement", "apprentice", "trainee",
        "deputation", "re-employment", "contract basis", "walk-in",
        "interview", "selection", "panel", "result", "shortlist"
    ]

    def parse(self, response):
        self.logger.info(f"Konkan Railway: Parsing {response.url} — status {response.status}")
        
        # If this is homepage warm-up, go to notifications page
        if response.url == "https://konkanrailway.com/" or response.url == "https://konkanrailway.com":
            yield scrapy.Request(
                "https://konkanrailway.com/en/current_notification",
                callback=self.parse_notifications_page
            )
            return
        
        yield from self.parse_notifications_page(response)

    def parse_notifications_page(self, response):
        """Parse the current notifications page."""
        self.logger.info(f"Konkan Railway: Parsing notifications page — status {response.status}")

        # Extract all notification entries
        entries = self._find_notification_entries(response)
        
        if entries:
            self.logger.info(f"Konkan Railway: Found {len(entries)} notification entries")
            for entry in entries:
                item = self._parse_entry(entry, response)
                if item:
                    yield item
        else:
            self.logger.warning("Konkan Railway: No notification entries found")
            # Fallback: scan entire page for PDF links
            yield from self._scrape_all_pdfs(response)

        # Follow pagination if exists
        next_page = response.css("a[rel='next']::attr(href), .pager-next a::attr(href)").get()
        if next_page:
            yield response.follow(next_page, self.parse_notifications_page)

    def _find_notification_entries(self, response):
        """Find all notification entries on the page."""
        entries = []
        
        # Strategy 1: Look for list items or divs with notification content
        containers = response.css("li, div, article, section, .view-content > div")
        for container in containers:
            text = " ".join(container.css("::text").getall()).strip()
            # Check if this container has notification-like content
            if len(text) > 50 and self._is_recruitment_notification(text):
                entries.append(container)
        
        # Strategy 2: If no structured containers found, split by date patterns
        if not entries:
            all_text = response.text
            # Split by date patterns like "2026-08-14"
            blocks = re.split(r'\n(?=\d{4}-\d{2}-\d{2}\n)', all_text)
            for block in blocks:
                if len(block) > 50 and self._is_recruitment_notification(block):
                    entries.append(scrapy.Selector(text=block))
        
        return entries

    def _is_recruitment_notification(self, text):
        """Check if text contains recruitment-related keywords."""
        text_lower = text.lower()
        return any(kw in text_lower for kw in self.RECRUITMENT_KEYWORDS)

    def _parse_entry(self, entry, response):
        """Parse a single notification entry."""
        
        # Extract all text
        all_text = " ".join(entry.css("::text").getall()).strip()
        if not all_text or len(all_text) < 50:
            return None
        
        # Extract title
        title_raw = self._extract_title(all_text)
        if not title_raw or len(title_raw) < 15:
            return None
        
        # Skip non-recruitment entries (general announcements, etc.)
        if not self._is_recruitment_notification(all_text):
            return None
        
        # Extract dates
        notification_date = self._extract_notification_date(all_text)
        publish_date = self._extract_publish_date(all_text)
        closing_date = self._extract_closing_date(all_text)
        
        # Find PDF links
        pdf_urls = []
        for link in entry.css("a"):
            href = link.attrib.get("href", "")
            if href.lower().endswith(".pdf") or "pdf" in href.lower():
                full_url = response.urljoin(href) if not href.startswith("http") else href
                pdf_urls.append(full_url)
        
        # Find detail page links (non-PDF)
        detail_link = None
        for link in entry.css("a"):
            href = link.attrib.get("href", "")
            if href and not href.lower().endswith(".pdf"):
                full_url = response.urljoin(href) if not href.startswith("http") else href
                if "konkanrailway.com" in full_url:
                    detail_link = full_url
                    break
        
        # Extract notification number
        notif_no = self._extract_notification_number(all_text)
        
        # Detect walk-in
        is_walk_in = "walk-in" in all_text.lower() or "walk in" in all_text.lower()
        
        # Detect if it's a result/panel (already closed)
        is_result = "result" in all_text.lower() or "panel" in all_text.lower() or "shortlist" in all_text.lower()
        
        # Deduplication
        dedup_string = f"KRCL_{notif_no or title_raw[:40]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            self.logger.debug(f"KRCL: Skipping known entry")
            return None
        
        clean_title = self._clean_title(title_raw)
        notification_pdf = pdf_urls[0] if pdf_urls else None
        
        # Determine status
        is_closed = is_result or (closing_date and self._is_past_date(closing_date))
        
        # Build item
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "Konkan Railway Corporation Limited"
        item['org_acronym'] = "KRCL"
        item['source_url'] = detail_link or response.url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = publish_date
        item['apply_end_date'] = closing_date
        item['advt_no'] = notif_no
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = ["Navi Mumbai", "Belapur", "Mumbai"]
        item['application_links'] = {
            "official_website": "https://konkanrailway.com",
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
        if is_result:
            desc_parts.append("Type: RESULT/PANEL")
        if publish_date:
            desc_parts.append(f"Published: {publish_date}")
        if closing_date:
            desc_parts.append(f"Closing: {closing_date}")
        if len(pdf_urls) > 1:
            desc_parts.append(f"{len(pdf_urls)} PDFs attached")
        item['description'] = " | ".join(desc_parts) if desc_parts else clean_title[:100]

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | Konkan Railway Recruitment {year}",
            "meta_description": f"{clean_title} at Konkan Railway Corporation Limited.",
        }

        self.logger.info(f"KRCL: Yielded item: {clean_title[:50]} | PDF: {notification_pdf or 'None'}")
        return item

    def _extract_title(self, text):
        """Extract the main title from notification text."""
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        # Skip date lines and metadata lines
        for line in lines:
            # Skip pure date lines
            if re.match(r'^\d{4}-\d{2}-\d{2}$', line):
                continue
            # Skip metadata lines (Format:PDF, Size:, etc.)
            if line.startswith(("Format:", "Size:", "Language:", "Publish Date:")):
                continue
            # Take the first substantial line
            if len(line) > 20:
                return line
        
        # Fallback: take first 200 chars
        return text[:200]

    def _extract_notification_date(self, text):
        """Extract the notification date (appears at start of entry)."""
        match = re.search(r'(\d{4}-\d{2}-\d{2})', text)
        if match:
            return match.group(1)
        return None

    def _extract_publish_date(self, text):
        """Extract publish date from metadata."""
        patterns = [
            r'Publish Date[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'published[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'dated[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self._parse_date(match.group(1))
        
        return None

    def _extract_closing_date(self, text):
        """Extract closing/last date."""
        patterns = [
            r'last date[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'closing date[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'deadline[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'before\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'on or before\s+(\d{2}[./-]\d{2}[./-]\d{4})',
            r'(\d{4}-\d{2}-\d{2})\s*$',  # Date at end of entry
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return self._parse_date(match.group(1))
        
        return None

    def _extract_notification_number(self, text):
        """Extract notification number."""
        patterns = [
            r'Notification No\.?\s*([A-Z0-9/\-]+)',
            r'notification no\.?\s*([A-Z0-9/\-]+)',
            r'No\.?\s*(CO/[A-Z0-9/\-]+)',
            r'([A-Z]+/[A-Z0-9/\-]+\d{4})',
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
            
            dedup_hash = hashlib.sha256(f"KRCL_PDF_{full_url}".encode()).hexdigest()
            from pipelines import DeduplicationPipeline
            if self.track_duplicate(dedup_hash, label=text or full_url, urls=[full_url]):
                continue
            
            clean_title = self._clean_title(text) if text else full_url.split("/")[-1].replace(".pdf", "").replace("_", " ")
            
            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "Konkan Railway Corporation Limited"
            item['org_acronym'] = "KRCL"
            item['source_url'] = full_url
            item['notification_pdf'] = full_url
            item['apply_start_date'] = None
            item['apply_end_date'] = self._extract_date_from_url(full_url)
            item['advt_no'] = None
            item['status'] = 'published'
            item['exam_cities'] = ["Navi Mumbai", "Belapur", "Mumbai"]
            item['application_links'] = {
                "official_website": "https://konkanrailway.com",
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
                "meta_title": f"{clean_title} | Konkan Railway Recruitment {year}",
                "meta_description": f"{clean_title} at Konkan Railway.",
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