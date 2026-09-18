# spiders/bmc_spider.py — BMC / Brihanmumbai Municipal Corporation (FIXED)
# Target: https://www.mcgm.gov.in/irj/portal/anonymous/qlrn?guest_user=english
#
# FIXED: SAP cache timeout handling with wait-and-retry logic
# Instead of raising IgnoreRequest, we now retry with delays

import scrapy
import re
import hashlib
import time
import random
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class BmcSpider(DuplicateStopMixin, scrapy.Spider):
    name = "bmc"
    source_name = "BMC Official Recruitment Portal"
    allowed_domains = ["mcgm.gov.in"]
    start_urls = [
        "https://www.mcgm.gov.in/irj/portal/anonymous/qlrn?guest_user=english",
        "https://www.mcgm.gov.in/irj/portal/anonymous/qlrn",
    ]

    dedup_org = "BMC"
    
    target_state = "maharashtra"
    target_lang = "en"
    
    # Retry configuration
    MAX_RETRIES = 5
    MIN_WAIT_SECONDS = 5
    MAX_WAIT_SECONDS = 15

    custom_settings = {
        "DOWNLOAD_DELAY": 3,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        "RETRY_TIMES": 3,
        "RETRY_HTTP_CODES": [500, 502, 503, 504, 408, 429],
    }

    EXPECTED_HEADERS = ["Sr. No", "Advt No", "Dept Name", "Vacancy", "View Details", "Start Date", "End Date"]

    def parse(self, response, retry_count=0):
        """Parse BMC recruitment page with retry logic for SAP cache timeout."""
        self.logger.info(f"BMC: Parsing {response.url} — status {response.status} (attempt {retry_count + 1}/{self.MAX_RETRIES})")
        
        # Check for SAP cache issue
        if self._is_cache_timeout(response):
            if retry_count < self.MAX_RETRIES:
                # Wait random time before retry
                wait_time = random.uniform(self.MIN_WAIT_SECONDS, self.MAX_WAIT_SECONDS)
                self.logger.warning(
                    f"BMC: SAP cache timeout detected. Waiting {wait_time:.1f}s before retry "
                    f"(attempt {retry_count + 2}/{self.MAX_RETRIES})"
                )
                time.sleep(wait_time)
                
                # Retry the same URL
                yield scrapy.Request(
                    url=response.url,
                    callback=self.parse,
                    cb_kwargs={'retry_count': retry_count + 1},
                    dont_filter=True,  # Allow duplicate requests
                    meta={'retry_count': retry_count + 1}
                )
                return
            else:
                self.logger.error(
                    f"BMC: SAP cache timeout after {self.MAX_RETRIES} retries. "
                    f"Moving to fallback scraping."
                )
                yield from self._scrape_all_pdfs(response)
                return
        
        # Check if Recruitment table exists
        table = self._find_recruitment_table(response)
        if not table:
            self.logger.warning("BMC: No recruitment table found on page")
            yield from self._scrape_all_pdfs(response)
            return
        
        # Parse table rows
        rows = table.css("tr")
        entries_found = 0
        
        for row in rows:
            item = self._parse_table_row(row, response)
            if item:
                entries_found += 1
                yield item
        
        if entries_found == 0:
            self.logger.warning("BMC: No valid entries found in recruitment table")
            yield from self._scrape_all_pdfs(response)
        else:
            self.logger.info(f"BMC: Found {entries_found} recruitment entries")

    def _is_cache_timeout(self, response):
        """Detect SAP 'iView timed out' cache page."""
        body_text = response.text.lower()
        cache_indicators = [
            "iview has timed out",
            "iview timed out",
            "expired content from the cache",
            "click 'reload' to retrieve updated content",
            "cache to retrieve content from the source",
            "the iview has timed out",
        ]
        return any(indicator in body_text for indicator in cache_indicators)

    def _find_recruitment_table(self, response):
        """Find the Recruitment table on the page."""
        tables = response.css("table")
        
        for table in tables:
            header_text = " ".join(table.css("th::text, td::text").getall()).lower()
            
            has_recruitment_headers = (
                "advt" in header_text or
                "vacancy" in header_text or
                "dept" in header_text or
                ("start date" in header_text and "end date" in header_text)
            )
            
            if has_recruitment_headers:
                rows = table.css("tr")
                data_rows = [r for r in rows if len(r.css("td")) >= 5]
                if len(data_rows) >= 3:
                    return table
        
        return None

    def _parse_table_row(self, row, response):
        """Parse a single BMC recruitment table row."""
        
        cells = row.css("td")
        if len(cells) < 5:
            return None
        
        all_text = " ".join(row.css("::text").getall()).strip()
        if not all_text or len(all_text) < 10:
            return None
        
        # Column 0: Serial number
        sr_no = cells[0].css("::text").get("").strip()
        if not sr_no or not sr_no.isdigit():
            return None
        
        # Column 1: Advertisement Number
        advt_no = cells[1].css("::text").get("").strip() if len(cells) > 1 else None
        if advt_no and advt_no.upper() == "N.A":
            advt_no = None
        
        # Column 2: Department Name
        dept_name = cells[2].css("::text").get("").strip() if len(cells) > 2 else None
        
        # Column 3: Vacancy Description (title)
        title_raw = " ".join(cells[3].css("::text").getall()).strip() if len(cells) > 3 else ""
        if not title_raw or len(title_raw) < 5:
            return None
        
        # Column 4: View Details (PDF link or detail page)
        pdf_url = None
        detail_url = None
        if len(cells) > 4:
            for link in cells[4].css("a"):
                href = link.attrib.get("href", "")
                if not href:
                    continue
                full_url = response.urljoin(href) if not href.startswith("http") else href
                
                if href.lower().endswith(".pdf") or "pdf" in href.lower():
                    pdf_url = full_url
                else:
                    detail_url = full_url
        
        # Column 5: Start Date
        start_date = None
        if len(cells) > 5:
            start_text = cells[5].css("::text").get("").strip()
            start_date = self._parse_date(start_text)
        
        # Column 6: End Date
        end_date = None
        if len(cells) > 6:
            end_text = cells[6].css("::text").get("").strip()
            end_date = self._parse_date(end_text)
        
        # Deduplication
        dedup_string = f"BMC_{advt_no or title_raw[:40]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        candidate_url = pdf_url or detail_url or f"{response.url}#{advt_no or sr_no}"
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[pdf_url, candidate_url]):
            return None
        
        clean_title = self._clean_title(title_raw)
        
        # Determine status
        is_closed = end_date and self._is_past_date(end_date)
        
        # Detect employment type
        employment_type = self._detect_employment_type(title_raw, dept_name)
        
        # Build item
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "Brihanmumbai Municipal Corporation"
        item['org_acronym'] = "BMC"
        item['org_department'] = dept_name
        item['source_url'] = candidate_url
        item['notification_pdf'] = pdf_url
        item['apply_start_date'] = start_date
        item['apply_end_date'] = end_date
        item['advt_no'] = advt_no
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = ["Mumbai"]
        item['application_links'] = {
            "official_website": "https://mcgm.gov.in",
            "detail_page": detail_url,
        }

        item['state_slug'] = self.target_state
        item['lang'] = self.target_lang
        item['is_walk_in'] = None
        item['employment_type'] = employment_type
        item['dedup_hash'] = dedup_hash
        item['ai_extracted_data'] = {}

        # Description
        desc_parts = []
        if dept_name:
            desc_parts.append(f"Dept: {dept_name}")
        if start_date:
            desc_parts.append(f"Start: {start_date}")
        if end_date:
            desc_parts.append(f"End: {end_date}")
        item['description'] = " | ".join(desc_parts) if desc_parts else clean_title[:100]

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | BMC Recruitment {year}",
            "meta_description": f"{clean_title} at Brihanmumbai Municipal Corporation, Mumbai. Last date: {end_date or 'N/A'}.",
        }

        self.logger.info(f"BMC: Yielded item: {clean_title[:50]} | PDF: {pdf_url or 'None'}")
        return item

    def _detect_employment_type(self, title, dept):
        """Detect employment type from title/department."""
        text = f"{title or ''} {dept or ''}".lower()
        
        if "contract" in text or "contractual" in text:
            return "contractual"
        if "deputation" in text:
            return "deputation"
        if "apprentice" in text:
            return "apprentice"
        if "intern" in text:
            return "internship"
        if "walk-in" in text or "walkin" in text:
            return "walkin"
        if "adhoc" in text or "ad-hoc" in text:
            return "adhoc"
        
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
            
            dedup_hash = hashlib.sha256(f"BMC_PDF_{full_url}".encode()).hexdigest()
            if self.track_duplicate(dedup_hash, label=text or full_url, urls=[full_url]):
                continue
            
            clean_title = self._clean_title(text) if text else full_url.split("/")[-1].replace(".pdf", "").replace("_", " ")
            
            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "Brihanmumbai Municipal Corporation"
            item['org_acronym'] = "BMC"
            item['source_url'] = full_url
            item['notification_pdf'] = full_url
            item['apply_start_date'] = None
            item['apply_end_date'] = self._extract_date_from_url(full_url)
            item['advt_no'] = self._extract_advt_no(text)
            item['status'] = 'published'
            item['exam_cities'] = ["Mumbai"]
            item['application_links'] = {
                "official_website": "https://mcgm.gov.in",
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
                "meta_title": f"{clean_title} | BMC Recruitment {year}",
                "meta_description": f"{clean_title} at BMC, Mumbai.",
            }

            yield item

    def _parse_date(self, text):
        """Parse various date formats (BMC uses DD.MM.YYYY)."""
        text = (text or "").strip()
        if not text or text.upper() in ("N.A", "NA", "NOT AVAILABLE", "-", "TBA", ""):
            return None
        try:
            # DD.MM.YYYY (BMC's primary format)
            if re.match(r'^\d{2}\.\d{2}\.\d{4}$', text):
                day, month, year = text.split('.')
                return datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d").strftime("%Y-%m-%d")
            
            # DD-MM-YYYY or DD/MM/YYYY
            if re.match(r'^\d{2}[/-]\d{2}[/-]\d{4}$', text):
                text = text.replace('/', '-').replace('.', '-')
                day, month, year = text.split('-')
                return datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d").strftime("%Y-%m-%d")
            
            # YYYY-MM-DD
            if re.match(r'^\d{4}-\d{2}-\d{2}$', text):
                return text
            
            # Try dateutil
            return date_parser.parse(text, dayfirst=True).strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            return None

    def _extract_date_from_url(self, url):
        """Extract date from URL or PDF filename."""
        if not url:
            return None
        
        match = re.search(r'(\d{2})[.-](\d{2})[.-](\d{4})', url)
        if match:
            day, month, year = match.groups()
            try:
                return datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d").strftime("%Y-%m-%d")
            except ValueError:
                pass
        
        match = re.search(r'(\d{4})-(\d{2})-(\d{2})', url)
        if match:
            try:
                datetime.strptime(match.group(0), "%Y-%m-%d")
                return match.group(0)
            except ValueError:
                pass
        
        return None

    def _extract_advt_no(self, text):
        """Extract advertisement number from text."""
        if not text:
            return None
        
        patterns = [
            r'(?:advt|advertisement|adv|notice)[\s.#/-]*no[\s.:\-]*([A-Z0-9/\-\.]+)',
            r'(?:advt|advertisement|adv|notice)[\s.#/-]*([A-Z0-9/\-\.]+)',
            r'Advt\.?\s*No\.?\s*([A-Z0-9/\-\.]+)',
            r'([A-Z]+/[A-Z0-9/\-\.]+)',
            r'(CLO/[A-Z0-9/\-\.]+)',
            r'(MPR-[A-Z0-9/\-\.]+)',
            r'(HO/[A-Z0-9/\-\.]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None

    def _is_past_date(self, date_str):
        """Check if a date is in the past."""
        if not date_str:
            return False
        try:
            return datetime.strptime(date_str, "%Y-%m-%d") < datetime.utcnow()
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