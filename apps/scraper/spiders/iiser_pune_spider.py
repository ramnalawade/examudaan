# ============================================================
# spiders/iiser_pune_spider.py — IISER Pune (UPDATED - Two-Stage Parsing)
# Target: https://www.iiserpune.ac.in/opportunities/openings
#         Detail pages: https://www.iiserpune.ac.in/opportunities/opening?id=XXXX
# 
# UPDATED FEATURES:
# - Two-stage parsing: List page → Detail page → PDF extraction
# - Follows detail page links to get PDF URLs
# - PDF URL pattern: /storage/recruitment/job-posts/{id}/documents/{uuid}.pdf
# - Extracts external project links (e.g., https://www.careproject.net/)
# - Combines metadata from list + detail pages
#
# PRINCIPLES (same as ACTREC/NEERI spiders):
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


class IiserPuneSpider(DuplicateStopMixin, scrapy.Spider):
    name = "iiser_pune"
    source_name = "IISER Pune Official Recruitment Portal"
    allowed_domains = ["iiserpune.ac.in"]
    start_urls = [
        "https://www.iiserpune.ac.in/opportunities/openings",
    ]

    dedup_org = "IISER_PUNE"
    
    # Multi-state / multi-language metadata
    target_state = "maharashtra"
    target_lang = "en"

    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
    }

    ENTRY_SELECTORS = [
        "div.opening",
        "div.job-opening",
        "div.vacancy",
        "div.announcement",
        "li.opening",
        "article",
        "div.card",
    ]

    def parse(self, response):
        self.logger.info(f"IISER Pune: Parsing {response.url} — status {response.status}")

        entries = self._find_entries(response)
        
        if entries:
            self.logger.info(f"IISER Pune: Found {len(entries)} job entries")
            for entry in entries:
                # Yield Request to detail page (not the item yet)
                request = self._parse_entry_to_request(entry, response)
                if request:
                    yield request
        else:
            self.logger.warning("IISER Pune: No job entries found with standard selectors")
            yield from self._parse_fallback(response)

        # Look for archived openings page
        archive_link = response.css("a:contains('Archived')::attr(href)").get()
        if archive_link:
            yield response.follow(archive_link, self._parse_archive)

    def _find_entries(self, response):
        """Try multiple selectors to find job entry containers."""
        for selector in self.ENTRY_SELECTORS:
            entries = response.css(selector)
            if entries:
                return entries
        
        all_divs = response.css("div, li, article")
        entries = [d for d in all_divs if "Adv. #" in d.css("::text").get("")]
        return entries if entries else []

    def _parse_entry_to_request(self, entry, response):
        """Parse a single job entry from list page and yield Request to detail page."""
        
        all_text = " ".join(entry.css("::text").getall()).strip()
        
        # Extract Advertisement Number
        advt_no = None
        advt_match = re.search(r'Adv\.\s*#\s*([A-Z0-9/\-]+)', all_text, re.IGNORECASE)
        if advt_match:
            advt_no = advt_match.group(1)
        
        # Extract title
        title_raw = self._extract_title(entry, all_text)
        if not title_raw or len(title_raw) < 5:
            return None
        
        title_raw = re.sub(r'•\s*New\s*', '', title_raw).strip()

        # Detect language
        has_devanagari = bool(re.search(r'[\u0900-\u097F]', title_raw))
        detected_lang = 'hi' if has_devanagari else 'en'

        # Extract dates
        walkin_date = None
        last_date = None
        published_date = None
        
        walkin_match = re.search(r'Walk-in\s+on\s+(\d{2}\.\d{2}\.\d{4})', all_text, re.IGNORECASE)
        if walkin_match:
            walkin_date = self._parse_date(walkin_match.group(1))
        
        last_match = re.search(r'Last\s+Date\s+(\w+\s+\d{1,2},?\s+\d{4})', all_text, re.IGNORECASE)
        if last_match:
            last_date = self._parse_date(last_match.group(1))
        
        pub_match = re.search(r'Published\s+Date\s+(\w+\s+\d{1,2},?\s+\d{4})', all_text, re.IGNORECASE)
        if pub_match:
            published_date = self._parse_date(pub_match.group(1))

        is_walk_in = "walk-in" in all_text.lower()
        is_closed = "applications closed" in all_text.lower() or (last_date and self._is_past_date(last_date))

        # Find detail page link
        detail_link = None
        for link in entry.css("a"):
            href = link.attrib.get("href", "")
            if "opening?id=" in href or "/opportunities/opening" in href:
                detail_link = response.urljoin(href) if not href.startswith("http") else href
                break
        
        # If no detail link found, try to construct from ID in text
        if not detail_link:
            id_match = re.search(r'id=(\d+)', all_text)
            if id_match:
                detail_link = f"https://www.iiserpune.ac.in/opportunities/opening?id={id_match.group(1)}"
        
        # If still no detail link, skip this entry
        if not detail_link:
            self.logger.warning(f"IISER: No detail link found for: {title_raw[:50]}")
            return None

        # Deduplication check
        dedup_string = f"IISER_{advt_no or title_raw[:30]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            self.logger.debug(f"IISER: Skipping known entry")
            return None

        # Yield Request to detail page with metadata
        return scrapy.Request(
            detail_link,
            callback=self._parse_detail_page,
            meta={
                'advt_no': advt_no,
                'title_raw': title_raw,
                'detected_lang': detected_lang,
                'walkin_date': walkin_date,
                'last_date': last_date,
                'published_date': published_date,
                'is_walk_in': is_walk_in,
                'is_closed': is_closed,
                'dedup_hash': dedup_hash,
            }
        )

    def _parse_detail_page(self, response):
        """Parse the detail page to extract PDF links and external project links."""
        self.logger.info(f"IISER Detail: Parsing {response.url}")
        
        meta = response.meta
        
        # Extract PDF links from detail page
        # Pattern: /storage/recruitment/job-posts/{id}/documents/{uuid}.pdf
        notification_pdf = None
        all_pdfs = []
        
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = link.css("::text").get("").strip().lower()
            
            if not href:
                continue
            
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            # Check if it's a PDF
            if href.lower().endswith(".pdf") or "/storage/recruitment/" in href or "pdf" in text:
                all_pdfs.append(full_url)
                if not notification_pdf:
                    notification_pdf = full_url
        
        # Extract external project links
        external_links = []
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            if href and href.startswith("http") and "iiserpune.ac.in" not in href and not href.endswith(".pdf"):
                external_links.append({
                    'url': href,
                    'text': link.css("::text").get("").strip()
                })

        # Extract additional text from detail page
        detail_text = " ".join(response.css("div.content::text, div.description::text, main::text, body::text").getall()).strip()
        
        # Try to extract more dates from detail page if not in meta
        if not meta.get('last_date'):
            last_match = re.search(r'(?:last\s+date|deadline|closing\s+date)[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{4}|\w+\s+\d{1,2},?\s+\d{4})', 
                                   detail_text, re.IGNORECASE)
            if last_match:
                meta['last_date'] = self._parse_date(last_match.group(1))

        # Build the final item
        clean_title = self._clean_title(meta['title_raw'])
        
        item = ExamNotificationItem()
        
        # Core fields
        item['title'] = clean_title
        item['org_name'] = "Indian Institute of Science Education and Research Pune"
        item['org_acronym'] = "IISER Pune"
        item['source_url'] = response.url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = meta.get('published_date')
        item['apply_end_date'] = meta.get('last_date') or meta.get('walkin_date')
        item['advt_no'] = meta.get('advt_no')
        item['status'] = 'closed' if meta.get('is_closed') else 'published'
        item['exam_cities'] = ["Pune"]
        item['application_links'] = {
            "official_website": "https://www.iiserpune.ac.in",
            "detail_page": response.url,
            "external_project_links": external_links if external_links else None,
            "all_pdfs": all_pdfs if len(all_pdfs) > 1 else None,
        }

        # Multi-state / multi-language metadata
        item['state_slug'] = self.target_state
        item['lang'] = meta.get('detected_lang', self.target_lang)
        item['is_walk_in'] = meta.get('is_walk_in')
        item['employment_type'] = 'walkin' if meta.get('is_walk_in') else 'contractual'
        item['dedup_hash'] = meta.get('dedup_hash')
        
        # DYNAMIC: Empty dict — Gemini pipeline will fill from PDF
        item['ai_extracted_data'] = {}

        # Description
        desc_parts = []
        desc_parts.append(f"Type: {item['employment_type'].upper()}")
        if meta.get('walkin_date'):
            desc_parts.append(f"Walk-In: {meta['walkin_date']}")
        if meta.get('last_date'):
            desc_parts.append(f"Last Date: {meta['last_date']}")
        if external_links:
            desc_parts.append(f"Project: {external_links[0]['text'][:50]}")
        item['description'] = " | ".join(desc_parts)

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | IISER Pune Recruitment {year}",
            "meta_description": f"{clean_title} at IISER Pune. {'Walk-in on ' + meta['walkin_date'] if meta.get('walkin_date') else 'Last date: ' + (meta.get('last_date') or 'N/A')}.",
        }

        self.logger.info(f"IISER: Yielded item: {clean_title[:50]} | PDF: {notification_pdf or 'None'}")
        yield item

    def _parse_archive(self, response):
        """Parse archived openings page."""
        self.logger.info(f"IISER Pune: Parsing archived page — {response.url}")
        entries = self._find_entries(response)
        
        if entries:
            self.logger.info(f"IISER Pune Archive: Found {len(entries)} archived entries")
            for entry in entries:
                request = self._parse_entry_to_request(entry, response)
                if request:
                    yield request

    def _parse_fallback(self, response):
        """Fallback: try to extract from any structured content."""
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = " ".join(link.css("::text").getall()).strip()
            
            if not text or len(text) < 10:
                continue
            
            job_keywords = ["technician", "fellow", "associate", "assistant", "officer", 
                          "scientist", "engineer", "professor", "faculty", "trainee"]
            
            if not any(kw in text.lower() for kw in job_keywords):
                continue
            
            if "opening?id=" in href:
                full_url = response.urljoin(href)
                
                advt_match = re.search(r'(\d{1,3}/\d{4})', text)
                advt_no = advt_match.group(1) if advt_match else None
                
                dedup_hash = hashlib.sha256(f"IISER_FALLBACK_{full_url}".encode()).hexdigest()
                from pipelines import DeduplicationPipeline
                if self.track_duplicate(dedup_hash, label=text or full_url, urls=[full_url]):
                    continue

                # Yield request to detail page
                yield scrapy.Request(
                    full_url,
                    callback=self._parse_detail_page,
                    meta={
                        'advt_no': advt_no,
                        'title_raw': text,
                        'detected_lang': 'en',
                        'walkin_date': None,
                        'last_date': None,
                        'published_date': None,
                        'is_walk_in': None,
                        'is_closed': False,
                        'dedup_hash': dedup_hash,
                    }
                )

    # ================================================================
    # HELPERS
    # ================================================================

    def _extract_title(self, entry, all_text):
        """Extract title from entry, handling bilingual format."""
        title = entry.css("h1::text, h2::text, h3::text, h4::text, h5::text").get("")
        if title and len(title) > 5:
            return title.strip()
        
        match = re.search(r'Adv\.\s*#[\s\S]*?(?=\*\*Walk-in|\*\*Last Date|\*\*Published)', all_text, re.IGNORECASE)
        if match:
            title_text = match.group(0)
            title_text = re.sub(r'Adv\.\s*#\s*[A-Z0-9/\-]+\s*', '', title_text, flags=re.IGNORECASE)
            return title_text.strip()
        
        lines = [l.strip() for l in all_text.split('\n') if len(l.strip()) > 10]
        return lines[0] if lines else ""

    def _extract_advt_no(self, text):
        """Extract advertisement number from text."""
        match = re.search(r'(\d{1,3}/\d{4})', text)
        return match.group(1) if match else None

    def _parse_date(self, text):
        """Parse various date formats."""
        text = (text or "").strip()
        if not text or text.lower() in ("not available", "na", "n/a", "-", "tba", ""):
            return None
        try:
            if re.match(r'^\d{2}\.\d{2}\.\d{4}$', text):
                return datetime.strptime(text, "%d.%m.%Y").strftime("%Y-%m-%d")
            if re.match(r'^\d{2}-\d{2}-\d{4}$', text):
                return datetime.strptime(text, "%d-%m-%Y").strftime("%Y-%m-%d")
            if re.match(r'^\d{2}/\d{2}/\d{4}$', text):
                return datetime.strptime(text, "%d/%m/%Y").strftime("%Y-%m-%d")
            return date_parser.parse(text).strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
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
        cleaned = re.sub(r'\s+', ' ', text).strip()
        cleaned = cleaned.replace("**", "")
        return cleaned[:500]