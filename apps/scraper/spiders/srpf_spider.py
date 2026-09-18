# spiders/srpf_spider.py — SRPF Maharashtra (API-Only, No Crawling)
# API Endpoints:
#   1. https://api.maharashtrasrpf.gov.in/api/get-groups
#   2. https://api.maharashtrasrpf.gov.in/api/get-records?tag=recruit&groupId={id}
#
# FLOW:
#   Step 1: Call get-groups API to get all SRPF groups
#   Step 2: For each group, call get-records API with groupId
#   Step 3: Parse JSON responses and create items
#
# NO CRAWLING - Pure API-based approach
# ============================================================

import scrapy
import json
import re
import hashlib
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class SrpfSpider(DuplicateStopMixin, scrapy.Spider):
    name = "srpf"
    source_name = "SRPF Maharashtra Official API"
    allowed_domains = ["api.maharashtrasrpf.gov.in"]
    
    # ADD THIS LINE - prevents pipeline crash
    start_urls = ["https://api.maharashtrasrpf.gov.in/api/get-groups"]
    
    
    # API endpoints
    GROUPS_API = "https://api.maharashtrasrpf.gov.in/api/get-groups"
    RECORDS_API = "https://api.maharashtrasrpf.gov.in/api/get-records"

    dedup_org = "SRPF"
    target_state = "maharashtra"
    target_lang = "mr"

    custom_settings = {
        "DOWNLOAD_DELAY": 0.5,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 5,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        "DEFAULT_REQUEST_HEADERS": {
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.9,mr;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
    }

    # Keywords for notice types
    RESULT_KEYWORDS = ["निकाल", "result", "यादी", "list", "selected", "निवड", "merit", "waiting list", "selection list"]
    CORRIGENDUM_KEYWORDS = ["सुधारणा", "corrigendum", "दुरुस्ती", "amendment", "revised", "शुद्धिपत्रक", "correction"]

    def start_requests(self):
        """Step 1: Call get-groups API to get all SRPF groups."""
        self.logger.info("SRPF: Fetching all groups from API")
        
        yield scrapy.Request(
            self.GROUPS_API,
            callback=self.parse_groups_response,
            errback=self.handle_error,
            meta={"request_type": "groups"}
        )
    def parse(self, response):
        """
        Handle the automatic request Scrapy makes from start_urls.
        Redirects to parse_groups_response since start_urls[0] is the groups API.
        """
        # Just delegate to the groups parser
        yield from self.parse_groups_response(response)
    def parse_groups_response(self, response):
        """Parse the groups API response and yield requests for each group's records."""
        self.logger.info(f"SRPF: Groups API response — status {response.status}")
        
        try:
            data = response.json()
        except Exception as e:
            self.logger.error(f"SRPF: Failed to parse groups JSON: {e}")
            self.logger.debug(f"Response: {response.text[:500]}")
            return
        
        # Extract groups array (auto-detect structure)
        groups = self._extract_groups(data)
        
        if not groups:
            self.logger.error("SRPF: No groups found in API response")
            self.logger.debug(f"Response keys: {list(data.keys()) if isinstance(data, dict) else 'array'}")
            return
        
        self.logger.info(f"SRPF: Found {len(groups)} SRPF groups")
        
        # For each group, yield a request to get its records
        groups_yielded = 0
        for group in groups:
            group_id = self._extract_group_id(group)
            group_name = self._extract_group_name(group)
            
            if not group_id:
                self.logger.warning(f"SRPF: Group missing ID, skipping: {group}")
                continue
            
            if not group_name:
                group_name = f"Group_{group_id}"
            
            # Build API URL for this group's records
            api_url = f"{self.RECORDS_API}?tag=recruit&groupId={group_id}"
            
            self.logger.info(f"SRPF: Fetching records for {group_name} (ID: {group_id})")
            
            yield scrapy.Request(
                api_url,
                callback=self.parse_records_response,
                meta={
                    "group_id": group_id,
                    "group_name": group_name,
                    "request_type": "records"
                },
                errback=self.handle_error,
            )
            groups_yielded += 1
        
        self.logger.info(f"SRPF: Yielded {groups_yielded} group record requests")

    def parse_records_response(self, response):
        """Parse the records API response for a specific group."""
        group_id = response.meta.get("group_id")
        group_name = response.meta.get("group_name")
        
        self.logger.info(f"SRPF: Records API response for {group_name} — status {response.status}")
        
        try:
            data = response.json()
        except Exception as e:
            self.logger.error(f"SRPF: Failed to parse records JSON for {group_name}: {e}")
            return
        
        # Extract records array (auto-detect structure)
        records = self._extract_records(data)
        
        if not records:
            self.logger.warning(f"SRPF: No records found for {group_name}")
            return
        
        self.logger.info(f"SRPF: Found {len(records)} records for {group_name}")
        
        # Process each record
        entries_yielded = 0
        for record in records:
            item = self._parse_record(record, group_name, group_id)
            if item:
                entries_yielded += 1
                yield item
        
        self.logger.info(f"SRPF: Yielded {entries_yielded} items for {group_name}")

    def _extract_groups(self, data):
        """Extract groups array from API response."""
        if isinstance(data, list):
            return data
        
        if isinstance(data, dict):
            for key in ["data", "groups", "results", "items"]:
                if key in data and isinstance(data[key], list):
                    return data[key]
            
            # Fallback: find first list
            for value in data.values():
                if isinstance(value, list) and len(value) > 0:
                    if isinstance(value[0], dict):
                        return value
        
        return []

    def _extract_group_id(self, group):
        """Extract group ID from group object."""
        if not isinstance(group, dict):
            return None
        
        # Try common ID field names
        for key in ["_id", "id", "groupId", "group_id"]:
            if key in group and group[key]:
                return str(group[key])
        
        return None

    def _extract_group_name(self, group):
        """Extract group name from group object."""
        if not isinstance(group, dict):
            return None
        
        # Try common name field names
        for key in ["name", "groupName", "group_name", "title", "displayName"]:
            if key in group and group[key]:
                return str(group[key]).strip()
        
        return None

    def _extract_records(self, data):
        """Extract records array from API response."""
        if isinstance(data, list):
            return data
        
        if isinstance(data, dict):
            for key in ["data", "records", "results", "items", "rows"]:
                if key in data and isinstance(data[key], list):
                    return data[key]
            
            # Try nested: data.records
            if "data" in data and isinstance(data["data"], dict):
                for key in ["records", "items", "rows"]:
                    if key in data["data"] and isinstance(data["data"][key], list):
                        return data["data"][key]
            
            # Fallback: find first list
            for value in data.values():
                if isinstance(value, list) and len(value) > 0:
                    if isinstance(value[0], dict):
                        return value
        
        return []

    def _parse_record(self, record, group_name, group_id):
        """Parse a single record from the API JSON."""
        if not isinstance(record, dict):
            return None
        
        # Auto-detect field names
        title = (record.get("title") or record.get("name") or record.get("subject") or
                record.get("description") or record.get("heading") or record.get("text") or "")
        
        publish_date = (record.get("date") or record.get("publish_date") or
                       record.get("published_at") or record.get("created_at") or
                       record.get("date_of_publication") or record.get("publishDate"))
        
        # PDF URLs
        pdf_urls = self._extract_pdf_urls(record)
        
        if not title or len(str(title).strip()) < 10:
            return None
        
        title = str(title).strip()
        parsed_date = self._parse_date(str(publish_date)) if publish_date else None
        
        # Deduplication
        dedup_string = f"SRPF_{group_id}_{title[:50]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        from pipelines import DeduplicationPipeline
        candidate_url = pdf_urls[0] if pdf_urls else f"https://maharashtrasrpf.gov.in/recruitment#{group_id}"
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            return None
        
        clean_title = self._clean_title(title)
        
        # Detect notice type
        title_lower = title.lower()
        is_result = any(kw in title_lower for kw in self.RESULT_KEYWORDS)
        is_corrigendum = any(kw in title_lower for kw in self.CORRIGENDUM_KEYWORDS)
        is_closed = is_result
        
        # Detect language
        has_devanagari = bool(re.search(r'[\u0900-\u097F]', title))
        detected_lang = 'mr' if has_devanagari else 'en'
        
        # Build item
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "State Reserve Police Force Maharashtra"
        item['org_acronym'] = "SRPF"
        item['org_department'] = group_name
        item['source_url'] = candidate_url
        item['notification_pdf'] = pdf_urls[0] if pdf_urls else None
        item['apply_start_date'] = parsed_date
        item['apply_end_date'] = None  # Gemini will extract from PDF
        item['advt_no'] = None
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = [group_name]  # Use group name as location
        item['application_links'] = {
            "official_website": "https://maharashtrasrpf.gov.in",
            "all_pdfs": pdf_urls if len(pdf_urls) > 1 else None,
        }

        item['state_slug'] = self.target_state
        item['lang'] = detected_lang
        item['is_walk_in'] = None  # Let AI determine from PDF
        item['employment_type'] = None  # Let AI determine from PDF
        item['dedup_hash'] = dedup_hash
        item['ai_extracted_data'] = {}  # Empty - Gemini will fill

        # Description
        desc_parts = [f"Group: {group_name}"]
        if parsed_date:
            desc_parts.append(f"Published: {parsed_date}")
        if is_result:
            desc_parts.append("Type: RESULT")
        elif is_corrigendum:
            desc_parts.append("Type: CORRIGENDUM")
        item['description'] = " | ".join(desc_parts)

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | SRPF {group_name} {year}",
            "meta_description": f"{clean_title} at SRPF {group_name}, Maharashtra.",
        }

        self.logger.debug(f"SRPF: Yielded: {clean_title[:50]} | PDF: {len(pdf_urls)} found")
        return item

    def _extract_pdf_urls(self, record):
        """Extract PDF URLs from various possible field names."""
        pdf_urls = []
        
        # Common field names for PDF/file URLs
        file_keys = [
            "pdf", "pdf_url", "pdfUrl", "file", "file_url", "fileUrl",
            "document", "document_url", "attachment", "attachment_url",
            "files", "pdfs", "documents", "attachments", "link", "url"
        ]
        
        for key in file_keys:
            if key not in record:
                continue
            
            value = record[key]
            
            if isinstance(value, str) and value:
                url = self._normalize_url(value)
                if url.lower().endswith(".pdf"):
                    pdf_urls.append(url)
            
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, str) and item.lower().endswith(".pdf"):
                        pdf_urls.append(self._normalize_url(item))
                    elif isinstance(item, dict):
                        url = item.get("url") or item.get("path") or item.get("link") or item.get("href")
                        if url and str(url).lower().endswith(".pdf"):
                            pdf_urls.append(self._normalize_url(url))
            
            elif isinstance(value, dict):
                url = value.get("url") or value.get("path") or value.get("link") or value.get("href")
                if url and str(url).lower().endswith(".pdf"):
                    pdf_urls.append(self._normalize_url(url))
        
        # Dedupe
        return list(dict.fromkeys(pdf_urls))

    def _normalize_url(self, url):
        """Convert relative URLs to absolute."""
        url = str(url).strip()
        if url.startswith("http"):
            return url
        if url.startswith("//"):
            return f"https:{url}"
        if url.startswith("/"):
            return f"https://maharashtrasrpf.gov.in{url}"
        return f"https://maharashtrasrpf.gov.in/{url}"

    def handle_error(self, failure):
        """Handle API request errors."""
        request = failure.request
        self.logger.error(f"SRPF API error for {request.url}: {failure.value}")

    def _parse_date(self, text):
        """Parse various date formats."""
        if not text:
            return None
        
        text = str(text).strip()
        
        # Skip invalid values
        if text.upper() in ("NULL", "NONE", "N/A", "NA", "-", ""):
            return None
        
        try:
            # ISO format with time
            if "T" in text or len(text) > 10:
                parsed = date_parser.parse(text)
                return parsed.strftime("%Y-%m-%d")
            
            # YYYY-MM-DD
            if re.match(r'^\d{4}-\d{2}-\d{2}', text):
                return date_parser.parse(text).strftime("%Y-%m-%d")
            
            # DD-MM-YYYY or DD/MM/YYYY
            if re.match(r'^\d{2}[./-]\d{2}[./-]\d{4}$', text):
                text = text.replace('/', '-').replace('.', '-')
                day, month, year = text.split('-')
                return datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d").strftime("%Y-%m-%d")
            
            # Fallback
            return date_parser.parse(text, dayfirst=False).strftime("%Y-%m-%d")
            
        except (ValueError, OverflowError, TypeError):
            return None

    def _clean_title(self, text):
        """Clean title text."""
        if not text:
            return ""
        
        cleaned = re.sub(r'<[^>]+>', '', str(text))
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        cleaned = re.sub(r'[*•]+', '', cleaned)
        
        return cleaned[:500]