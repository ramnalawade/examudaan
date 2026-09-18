# ============================================================
# spiders/moil_spider.py — MOIL Nagpur (TWO-STAGE, ROBUST VIEW LINK)
# Target: https://www.moil.nic.in/public/career
#         Detail pages: https://www.moil.nic.in/public/career/{id}
#
# TWO-STAGE PARSING:
#   Stage 1 (List page): Extract job metadata + find "View" link
#   Stage 2 (Detail page): Follow View link → extract PDF URL
#
# VIEW LINK DETECTION (4 strategies):
#   1. <a href> in View cell
#   2. onclick handler (button/a with onclick="...")
#   3. data-href / data-url / data-link attributes
#   4. Any href in row matching /public/career/{hex_id}
# ============================================================

import scrapy
import re
import hashlib
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class MoilSpider(DuplicateStopMixin, scrapy.Spider):
    name = "moil"
    source_name = "MOIL Official Careers Portal"
    allowed_domains = ["moil.nic.in"]
    start_urls = [
        "https://www.moil.nic.in/public/career",
        "https://www.moil.nic.in/",  # Warm-up
    ]

    dedup_org = "MOIL"
    
    target_state = "maharashtra"  # MOIL HQ in Nagpur
    target_lang = "en"

    custom_settings = {
        "DOWNLOAD_DELAY": 3,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
    }

    JOB_TYPE_KEYWORDS = {
        "graduate trainee": "permanent",
        "management trainee": "permanent",
        "manager": "permanent",
        "director": "permanent",
        "consultant": "contractual",
        "advisor": "deputation",
        "deputation": "deputation",
        "contract": "contractual",
        "apprentice": "apprentice",
    }

    def parse(self, response):
        self.logger.info(f"MOIL: Parsing {response.url} — status {response.status}")
        
        if response.url in ("https://www.moil.nic.in/", "https://www.moil.nic.in"):
            yield scrapy.Request(
                "https://www.moil.nic.in/public/career",
                callback=self.parse_careers_page
            )
            return
        
        yield from self.parse_careers_page(response)

    def parse_careers_page(self, response):
        """Stage 1: Parse careers table, follow View links."""
        self.logger.info(f"MOIL: Parsing careers page — status {response.status}")

        entries_found = 0
        for table in response.css("table"):
            for row in table.css("tr"):
                request = self._parse_table_row_to_request(row, response)
                if request:
                    entries_found += 1
                    yield request
        
        if entries_found == 0:
            self.logger.warning("MOIL: No entries found in tables — trying PDF fallback")
            yield from self._scrape_all_pdfs(response)
        else:
            self.logger.info(f"MOIL: Found {entries_found} jobs → following View links")

    # ============================================================
    # VIEW LINK DETECTION (4 strategies)
    # ============================================================
    def _find_view_link(self, row, response):
        """Find the View (eye icon) link using multiple strategies."""
        cells = row.css("td")
        
        # Strategy 1: <a href> inside View cell (index 2)
        if len(cells) > 2:
            href = cells[2].css("a::attr(href)").get()
            if href and href not in ("#", "", "javascript:void(0)", "javascript:;"):
                return response.urljoin(href) if not href.startswith("http") else href
        
        # Strategy 2: onclick handler anywhere in the row
        for onclick in row.css("a::attr(onclick), button::attr(onclick), [onclick]::attr(onclick)").getall():
            m = re.search(r"['\"]([^'\"]*career/[^'\"]+)['\"]", onclick)
            if m:
                url = m.group(1)
                return response.urljoin(url) if not url.startswith("http") else url
        
        # Strategy 3: data-href / data-url / data-link attributes
        for attr in row.css(
            "[data-href]::attr(data-href), [data-url]::attr(data-url), [data-link]::attr(data-link)"
        ).getall():
            if attr and attr not in ("#", ""):
                return response.urljoin(attr) if not attr.startswith("http") else attr
        
        # Strategy 4: any href in row matching /public/career/{hex_id} (MongoDB ObjectId)
        for href in row.css("a::attr(href)").getall():
            if re.search(r'career/[a-f0-9]{20,}', href):
                return response.urljoin(href) if not href.startswith("http") else href
        
        return None

    def _parse_table_row_to_request(self, row, response):
        """Stage 1: Extract metadata + yield Request to detail page."""
        
        cells = row.css("td")
        if len(cells) < 5:
            return None
        
        all_text = " ".join(row.css("::text").getall()).strip()
        if not all_text or len(all_text) < 20:
            return None
        
        # Column 0: Sr. No.
        sr_no = cells[0].css("::text").get("").strip()
        if not sr_no or not sr_no.isdigit():
            return None
        
        # Column 1: Title
        title_raw = cells[1].css("::text").get("").strip()
        if not title_raw or len(title_raw) < 10:
            return None
        
        # Column 3: Published Date
        publish_date = self._parse_date(cells[3].css("::text").get("").strip()) if len(cells) > 3 else None
        
        # Column 4: Submission Last Date
        last_date = self._parse_date(cells[4].css("::text").get("").strip()) if len(cells) > 4 else None
        
        # Column 5: Status
        status_text = cells[5].css("::text").get("").strip() if len(cells) > 5 else ""
        
        # Column 6: Apply link
        apply_link = None
        if len(cells) > 6:
            href = cells[6].css("a::attr(href)").get()
            if href and href not in ("#", ""):
                apply_link = response.urljoin(href) if not href.startswith("http") else href
        
        # Column 7: Other links
        other_links = []
        if len(cells) > 7:
            for link in cells[7].css("a"):
                href = link.attrib.get("href", "")
                if href and href not in ("#", ""):
                    other_links.append({
                        "url": response.urljoin(href) if not href.startswith("http") else href,
                        "text": link.css("::text").get("").strip()
                    })
        
        # Find View link (the eye icon button)
        detail_link = self._find_view_link(row, response)
        if not detail_link:
            self.logger.debug(f"MOIL: No View link found for: {title_raw[:50]}")
            return None
        
        advt_no = self._extract_advt_no(all_text)
        employment_type = self._detect_employment_type(title_raw)
        
        is_closed = status_text.lower() in ["closed", "expired", "completed"]
        if last_date and self._is_past_date(last_date):
            is_closed = True
        
        dedup_hash = hashlib.sha256(f"MOIL_{sr_no}_{title_raw[:30]}".encode()).hexdigest()
        
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            self.logger.debug(f"MOIL: Skipping known entry")
            return None
        
        # Stage 1 → yield Request to detail page
        return scrapy.Request(
            detail_link,
            callback=self.parse_detail_page,
            meta={
                'sr_no': sr_no,
                'title_raw': title_raw,
                'publish_date': publish_date,
                'last_date': last_date,
                'status_text': status_text,
                'is_closed': is_closed,
                'apply_link': apply_link,
                'other_links': other_links,
                'advt_no': advt_no,
                'employment_type': employment_type,
                'dedup_hash': dedup_hash,
            }
        )

    def parse_detail_page(self, response):
        """Stage 2: Extract PDF from detail page."""
        self.logger.info(f"MOIL Detail: Parsing {response.url} — status {response.status}")
        
        meta = response.meta
        
        # Find PDF links on detail page
        pdf_urls = []
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = link.css("::text").get("").strip().lower()
            if not href:
                continue
            full_url = response.urljoin(href) if not href.startswith("http") else href
            if href.lower().endswith(".pdf") or "pdf" in text or "download" in text or "notification" in text:
                pdf_urls.append(full_url)
        
        # Fallback: embedded PDF in iframe
        if not pdf_urls:
            for iframe in response.css("iframe"):
                src = iframe.attrib.get("src", "")
                if src and src.lower().endswith(".pdf"):
                    pdf_urls.append(response.urljoin(src) if not src.startswith("http") else src)
        
        clean_title = self._clean_title(meta['title_raw'])
        notification_pdf = pdf_urls[0] if pdf_urls else None
        
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "Manganese Ore (India) Limited"
        item['org_acronym'] = "MOIL"
        item['source_url'] = response.url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = meta.get('publish_date')
        item['apply_end_date'] = meta.get('last_date')
        item['advt_no'] = meta.get('advt_no')
        item['status'] = 'closed' if meta.get('is_closed') else 'published'
        item['exam_cities'] = ["Nagpur"]
        item['application_links'] = {
            "official_website": "https://www.moil.nic.in",
            "apply_online": meta.get('apply_link'),
            "detail_page": response.url,
            "all_pdfs": pdf_urls if len(pdf_urls) > 1 else None,
            "other_links": meta.get('other_links') or None,
        }

        item['state_slug'] = self.target_state
        item['lang'] = self.target_lang
        item['is_walk_in'] = None
        item['employment_type'] = meta.get('employment_type')
        item['dedup_hash'] = meta.get('dedup_hash')
        item['ai_extracted_data'] = {}

        desc_parts = []
        if meta.get('employment_type'):
            desc_parts.append(f"Type: {meta['employment_type'].upper()}")
        if meta.get('publish_date'):
            desc_parts.append(f"Published: {meta['publish_date']}")
        if meta.get('last_date'):
            desc_parts.append(f"Last Date: {meta['last_date']}")
        if meta.get('status_text'):
            desc_parts.append(f"Status: {meta['status_text']}")
        item['description'] = " | ".join(desc_parts) if desc_parts else clean_title[:100]

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | MOIL Recruitment {year}",
            "meta_description": f"{clean_title} at Manganese Ore (India) Limited, Nagpur.",
        }

        self.logger.info(f"MOIL: Yielded: {clean_title[:50]} | PDF: {notification_pdf or 'NONE'}")
        yield item

    # ============================================================
    # HELPERS
    # ============================================================

    def _detect_employment_type(self, title):
        title_lower = title.lower()
        for keyword, emp_type in self.JOB_TYPE_KEYWORDS.items():
            if keyword in title_lower:
                return emp_type
        return None

    def _extract_advt_no(self, text):
        patterns = [
            r'(?:advt|advertisement)[\s.#/-]*no[\s.:\-]*([A-Z0-9/\-]+\d{4})',
            r'Advt\.?\s*No\.?\s*([A-Z0-9/\-]+\d{4})',
            r'Advertisement No\.?\s*:?\s*([A-Z0-9/\-]+\d{4})',
            r'([A-Z]+/[A-Z0-9/\-]+\d{4})',
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None

    def _scrape_all_pdfs(self, response):
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
            
            dedup_hash = hashlib.sha256(f"MOIL_PDF_{full_url}".encode()).hexdigest()
            from pipelines import DeduplicationPipeline
            if self.track_duplicate(dedup_hash, label=text or full_url, urls=[full_url]):
                continue
            
            clean_title = self._clean_title(text) if text else full_url.split("/")[-1].replace(".pdf", "").replace("_", " ")
            
            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "Manganese Ore (India) Limited"
            item['org_acronym'] = "MOIL"
            item['source_url'] = full_url
            item['notification_pdf'] = full_url
            item['apply_start_date'] = None
            item['apply_end_date'] = self._extract_date_from_url(full_url)
            item['advt_no'] = self._extract_advt_no(text)
            item['status'] = 'published'
            item['exam_cities'] = ["Nagpur"]
            item['application_links'] = {"official_website": "https://www.moil.nic.in"}
            item['state_slug'] = self.target_state
            item['lang'] = self.target_lang
            item['is_walk_in'] = None
            item['employment_type'] = None
            item['dedup_hash'] = dedup_hash
            item['ai_extracted_data'] = {}
            item['description'] = f"PDF: {full_url.split('/')[-1]}"
            
            year = datetime.utcnow().year
            item['seo_metadata'] = {
                "meta_title": f"{clean_title} | MOIL Recruitment {year}",
                "meta_description": f"{clean_title} at MOIL, Nagpur.",
            }
            yield item

    def _parse_date(self, text):
        text = (text or "").strip()
        if not text:
            return None
        try:
            if re.match(r'^\d{2}[./-]\d{2}[./-]\d{4}$', text):
                text = text.replace('/', '-').replace('.', '-')
                day, month, year = text.split('-')
                return datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d").strftime("%Y-%m-%d")
            if re.match(r'^\d{4}-\d{2}-\d{2}$', text):
                return text
            return date_parser.parse(text, dayfirst=True).strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            return None

    def _extract_date_from_url(self, url):
        if not url:
            return None
        match = re.search(r'(\d{2})-(\d{2})-(\d{4})', url)
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

    def _is_past_date(self, date_str):
        if not date_str:
            return False
        try:
            return datetime.strptime(date_str, "%Y-%m-%d") < datetime.utcnow()
        except ValueError:
            return False

    def _clean_title(self, text):
        if not text:
            return ""
        cleaned = re.sub(r'<[^>]+>', '', text)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        cleaned = re.sub(r'[*•]+', '', cleaned)
        return cleaned.replace('...', '')[:500]