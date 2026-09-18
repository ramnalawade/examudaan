# spiders/thane_police_spider.py — Thane Police (SIMPLE VERSION)
import nest_asyncio
nest_asyncio.apply()

import scrapy
import re
import hashlib
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin
import nest_asyncio
nest_asyncio.apply()

class ThanePoliceSpider(DuplicateStopMixin, scrapy.Spider):
    name = "thane_police"
    source_name = "Thane Police Official Recruitment Portal"
    allowed_domains = ["thanepolice.gov.in"]
    start_urls = [
        "https://thanepolice.gov.in/recruitment",
    ]

    dedup_org = "THANE_POLICE"
    target_state = "maharashtra"
    target_lang = "en"

    BROWSER_HEADERS = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8,mi;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    }

    custom_settings = {
        "DOWNLOAD_DELAY": 3,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        "DOWNLOAD_TIMEOUT": 30,
        "RETRY_TIMES": 3,
        "DUPEFILTER_DEBUG": True,  # Helps debug dupefilter issues
        "DEFAULT_REQUEST_HEADERS": {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9",
            "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
        },
    }

    VACANCY_KEYWORDS = [
        "vacancy", "vacancies", "recruitment", "advertisement",
        "walk-in", "walk in", "interview", "constable", "sub-inspector",
        "psi", "asi", "police", "head constable", "naik", "havaldar",
        "armed", "unarmed", "driver", "clerk", "officer", "bharti",
        "भरती", "पदभरती", "जाहिरात", "notification", "notice"
    ]

    RESULT_KEYWORDS = ["result", "selected", "list", "merit", "final list", "waiting list", "panel", "निकाल", "यादी"]
    CORRIGENDUM_KEYWORDS = ["corrigendum", "amendment", "revised", "correction", "modification", "addendum", "सुधारणा"]

    def parse(self, response):
        """Warm-up: visit homepage first, then go to recruitment page."""
        self.logger.info(f"Thane Police: Homepage warm-up complete — status {response.status}")
        
        # Request the recruitment listing page
        recruitment_url = "https://thanepolice.gov.in/recruitment"
        
        yield scrapy.Request(
            recruitment_url,
            callback=self.parse_recruitment_list,
            headers=self.BROWSER_HEADERS,
            meta={'from_homepage': True},
            dont_filter=True,
        )

    def parse_recruitment_list(self, response):
        """Parse the recruitment page — extract PDFs and recruitment content directly."""
        self.logger.info(f"Thane Police: Parsing recruitment list — status {response.status}")

        if response.status != 200:
            self.logger.error(f"Thane Police: Bad status {response.status}")
            return

        # Get all page text for context
        page_text = " ".join(response.css("body::text").getall()).lower()
        
        # Extract all links from the page
        seen_urls = set()
        items_yielded = 0
        
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = " ".join(link.css("::text").getall()).strip()
            
            if not href:
                continue
            
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            # Skip non-relevant links
            if not href.lower().endswith(".pdf"):
                # Check if it's a recruitment-related internal link
                if any(kw in (href.lower() + " " + text.lower()) for kw in self.VACANCY_KEYWORDS):
                    # Yield request to follow this link
                    if full_url not in seen_urls:
                        seen_urls.add(full_url)
                        yield scrapy.Request(
                            full_url,
                            callback=self.parse_detail_page,
                            headers=self.BROWSER_HEADERS,
                            meta={'list_text': text, 'list_url': response.url},
                            dont_filter=True,
                        )
                continue
            
            # It's a PDF link
            if full_url in seen_urls:
                continue
            seen_urls.add(full_url)
            
            # Create dedup hash from URL without query params
            dedup_key = full_url.split('?')[0]
            dedup_hash = hashlib.sha256(f"THANE_POLICE_{dedup_key}".encode()).hexdigest()
            
            from pipelines import DeduplicationPipeline
            if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
                self.logger.debug(f"Thane Police: Skipping known PDF: {text[:50]}")
                continue
            
            # Build item directly from PDF
            clean_title = self._clean_title(text) if text else full_url.split("/")[-1].replace(".pdf", "").replace("_", " ").replace("-", " ")
            pdf_date = self._extract_date_from_url(full_url)
            
            # Detect notice type
            title_lower = clean_title.lower()
            is_result = any(kw in title_lower for kw in self.RESULT_KEYWORDS)
            is_corrigendum = any(kw in title_lower for kw in self.CORRIGENDUM_KEYWORDS)
            is_walk_in = "walk-in" in title_lower or "walk in" in title_lower
            
            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "Thane Police"
            item['org_acronym'] = "Thane Police"
            item['source_url'] = full_url
            item['notification_pdf'] = full_url
            item['apply_start_date'] = pdf_date
            item['apply_end_date'] = None  # Gemini will extract from PDF
            item['advt_no'] = self._extract_advt_no(text + " " + full_url)
            item['status'] = 'closed' if is_result else 'published'
            item['exam_cities'] = ["Thane", "Mumbai"]
            item['application_links'] = {
                "official_website": "https://thanepolice.gov.in",
            }

            item['state_slug'] = self.target_state
            item['lang'] = self.target_lang
            item['is_walk_in'] = is_walk_in if is_walk_in else None
            item['employment_type'] = 'walkin' if is_walk_in else None
            item['dedup_hash'] = dedup_hash
            item['ai_extracted_data'] = {}  # Empty - Gemini fills from PDF

            # Description
            desc_parts = []
            if is_walk_in:
                desc_parts.append("Type: WALK-IN")
            if pdf_date:
                desc_parts.append(f"Date: {pdf_date}")
            if is_result:
                desc_parts.append("Type: RESULT")
            elif is_corrigendum:
                desc_parts.append("Type: CORRIGENDUM")
            item['description'] = " | ".join(desc_parts) if desc_parts else f"Recruitment at Thane Police"

            year = datetime.utcnow().year
            item['seo_metadata'] = {
                "meta_title": f"{clean_title} | Thane Police Recruitment {year}",
                "meta_description": f"{clean_title} at Thane Police, Maharashtra.",
            }

            self.logger.info(f"Thane Police: Yielded: {clean_title[:60]}")
            items_yielded += 1
            yield item
        
        self.logger.info(f"Thane Police: Total items yielded from recruitment page: {items_yielded}")
        
        # If nothing found, scan all links as fallback
        if items_yielded == 0:
            self.logger.warning("Thane Police: No PDFs found, scanning all links as fallback")
            yield from self._scrape_all_links(response)

    def parse_detail_page(self, response):
        """Parse a detail page to find PDFs."""
        self.logger.info(f"Thane Police Detail: Parsing {response.url} — status {response.status}")
        
        if response.status != 200:
            return
        
        meta = response.meta
        page_text = " ".join(response.css("body::text, main::text").getall())
        
        # Find all PDFs on this page
        seen = set()
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = " ".join(link.css("::text").getall()).strip()
            
            if not href or not href.lower().endswith(".pdf"):
                continue
            
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            if full_url in seen:
                continue
            seen.add(full_url)
            
            dedup_key = full_url.split('?')[0]
            dedup_hash = hashlib.sha256(f"THANE_POLICE_{dedup_key}".encode()).hexdigest()
            
            from pipelines import DeduplicationPipeline
            if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
                continue
            
            # Extract title
            clean_title = self._clean_title(text) if text and len(text) > 10 else meta.get('list_text', '')
            if not clean_title or len(clean_title) < 10:
                # Try page heading
                for selector in ["h1", "h2", "h3", ".page-title"]:
                    heading = response.css(f"{selector}::text").get("")
                    if heading and len(heading) > 5:
                        clean_title = self._clean_title(heading)
                        break
            
            if not clean_title or len(clean_title) < 10:
                clean_title = full_url.split("/")[-1].replace(".pdf", "").replace("_", " ")
            
            pdf_date = self._extract_date_from_url(full_url) or self._extract_date_from_text(page_text)
            
            # Detect notice type
            combined_text = (clean_title + " " + page_text).lower()
            is_result = any(kw in combined_text for kw in self.RESULT_KEYWORDS)
            is_corrigendum = any(kw in combined_text for kw in self.CORRIGENDUM_KEYWORDS)
            is_walk_in = "walk-in" in combined_text or "walk in" in combined_text
            
            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "Thane Police"
            item['org_acronym'] = "Thane Police"
            item['source_url'] = full_url
            item['notification_pdf'] = full_url
            item['apply_start_date'] = pdf_date
            item['apply_end_date'] = None
            item['advt_no'] = self._extract_advt_no(page_text + " " + clean_title)
            item['status'] = 'closed' if is_result else 'published'
            item['exam_cities'] = ["Thane", "Mumbai"]
            item['application_links'] = {
                "official_website": "https://thanepolice.gov.in",
                "detail_page": response.url,
            }

            item['state_slug'] = self.target_state
            item['lang'] = self.target_lang
            item['is_walk_in'] = is_walk_in if is_walk_in else None
            item['employment_type'] = 'walkin' if is_walk_in else None
            item['dedup_hash'] = dedup_hash
            item['ai_extracted_data'] = {}

            desc_parts = []
            if is_walk_in:
                desc_parts.append("Type: WALK-IN")
            if pdf_date:
                desc_parts.append(f"Date: {pdf_date}")
            if is_result:
                desc_parts.append("Type: RESULT")
            elif is_corrigendum:
                desc_parts.append("Type: CORRIGENDUM")
            item['description'] = " | ".join(desc_parts) if desc_parts else f"Recruitment at Thane Police"

            year = datetime.utcnow().year
            item['seo_metadata'] = {
                "meta_title": f"{clean_title} | Thane Police Recruitment {year}",
                "meta_description": f"{clean_title} at Thane Police, Maharashtra.",
            }

            self.logger.info(f"Thane Police Detail: Yielded: {clean_title[:60]}")
            yield item

    def _scrape_all_links(self, response):
        """Fallback: scrape all PDF and vacancy-related links."""
        seen = set()
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = " ".join(link.css("::text").getall()).strip()
            
            if not href:
                continue
            
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            # Only PDFs
            if not href.lower().endswith(".pdf"):
                continue
            
            if full_url in seen:
                continue
            seen.add(full_url)
            
            dedup_key = full_url.split('?')[0]
            dedup_hash = hashlib.sha256(f"THANE_POLICE_{dedup_key}".encode()).hexdigest()
            
            from pipelines import DeduplicationPipeline
            if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
                continue
            
            clean_title = self._clean_title(text) if text else full_url.split("/")[-1].replace(".pdf", "").replace("_", " ")
            
            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "Thane Police"
            item['org_acronym'] = "Thane Police"
            item['source_url'] = full_url
            item['notification_pdf'] = full_url
            item['apply_start_date'] = self._extract_date_from_url(full_url)
            item['apply_end_date'] = None
            item['advt_no'] = None
            item['status'] = 'published'
            item['exam_cities'] = ["Thane", "Mumbai"]
            item['application_links'] = {"official_website": "https://thanepolice.gov.in"}
            item['state_slug'] = self.target_state
            item['lang'] = self.target_lang
            item['is_walk_in'] = None
            item['employment_type'] = None
            item['dedup_hash'] = dedup_hash
            item['ai_extracted_data'] = {}
            item['description'] = f"PDF: {full_url.split('/')[-1]}"
            
            year = datetime.utcnow().year
            item['seo_metadata'] = {
                "meta_title": f"{clean_title} | Thane Police Recruitment {year}",
                "meta_description": f"{clean_title} at Thane Police.",
            }

            yield item

    # ================================================================
    # HELPERS
    # ================================================================

    def _extract_date_from_text(self, text):
        if not text:
            return None
        
        patterns = [
            (r'\b(\d{2})[./-](\d{2})[./-](\d{4})\b', lambda m: f"{m.group(3)}-{m.group(2)}-{m.group(1)}"),
            (r'\b(\d{4})-(\d{2})-(\d{2})\b', lambda m: m.group(0)),
        ]
        
        for pattern, formatter in patterns:
            match = re.search(pattern, text)
            if match:
                try:
                    result = formatter(match)
                    datetime.strptime(result, "%Y-%m-%d")
                    return result
                except ValueError:
                    continue
        
        try:
            date_match = re.search(r'\b(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|\w+ \d{1,2},? \d{4})\b', text)
            if date_match:
                return date_parser.parse(date_match.group(1), dayfirst=True).strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            pass
        
        return None

    def _extract_date_from_url(self, url):
        if not url:
            return None
        
        clean_url = url.split('?')[0]
        
        # DD-MM-YYYY
        match = re.search(r'(\d{2})-(\d{2})-(\d{4})', clean_url)
        if match:
            day, month, year = match.groups()
            try:
                return datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d").strftime("%Y-%m-%d")
            except ValueError:
                pass
        
        # YYYY-MM-DD
        match = re.search(r'(\d{4})-(\d{2})-(\d{2})', clean_url)
        if match:
            return match.group(0)
        
        # YYYY-MM folder
        match = re.search(r'/(\d{4})-(\d{2})/', clean_url)
        if match:
            year, month = match.groups()
            try:
                return datetime.strptime(f"{year}-{month}-01", "%Y-%m-%d").strftime("%Y-%m-%d")
            except ValueError:
                pass
        
        return None

    def _extract_advt_no(self, text):
        if not text:
            return None
        
        patterns = [
            r'(?:advt|advertisement|adv|notification)[\s.#/-]*no[\s.:\-]*([A-Z0-9/\-]+\d{4})',
            r'(?:advt|advertisement|adv)[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'([A-Z]+/[A-Z0-9]+/\d{4})',
            r'(?:जाहिरात|अ\.क्र\.?)[\s.#/-]*([A-Z0-9/\-]+\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None

    def _clean_title(self, text):
        if not text:
            return ""
        cleaned = re.sub(r'<[^>]+>', '', text)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        cleaned = re.sub(r'[*•]+', '', cleaned)
        return cleaned[:500]