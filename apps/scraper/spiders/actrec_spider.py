# ============================================================
# spiders/actrec_spider.py — ACTREC / Tata Memorial Centre (DYNAMIC)
# Target: https://actrec.gov.in/jobs
# 
# PRINCIPLES:
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


class ActrecSpider(DuplicateStopMixin, scrapy.Spider):
    name = "actrec"
    source_name = "ACTREC Tata Memorial Centre Official Recruitment"
    allowed_domains = ["actrec.gov.in"]
    start_urls = [
        "https://actrec.gov.in/jobs",
        "https://actrec.gov.in/home",
    ]

    dedup_org = "ACTREC"
    
    # Multi-state / multi-language metadata
    target_state = "maharashtra"
    target_lang = "en"

    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        # NO USER_AGENT here — RandomUserAgentMiddleware handles it
    }

    TABLE_SELECTORS = [
        "table.recruitment-table",
        "table.table-striped",
        "table.table",
        "table",
    ]

    def parse(self, response):
        self.logger.info(f"ACTREC: Parsing {response.url} — status {response.status}")

        if "/jobs" in response.url:
            yield from self._parse_jobs_page(response)
        else:
            yield from self._parse_homepage(response)

    def _parse_jobs_page(self, response):
        """Parse the /jobs page which has Walk-in + Results tables."""

        # Section 1: Walk-in Interviews
        walkin_rows = self._find_section_rows(response, "Walk-in Interviews")
        if walkin_rows:
            self.logger.info(f"ACTREC: Found {len(walkin_rows)} walk-in interview rows")
            for row in walkin_rows:
                item = self._parse_walkin_row(row, response, is_walkin=True)
                if item:
                    yield item

        # Section 2: Permanent Posts
        perm_rows = self._find_section_rows(response, "Permanent Posts")
        if perm_rows:
            self.logger.info(f"ACTREC: Found {len(perm_rows)} permanent post rows")
            for row in perm_rows:
                item = self._parse_walkin_row(row, response, is_walkin=False)
                if item:
                    yield item

        # Section 3: Results (separate handler)
        result_rows = self._find_section_rows(response, "Results")
        if result_rows:
            self.logger.info(f"ACTREC: Found {len(result_rows)} result rows")
            for row in result_rows:
                item = self._parse_result_row(row, response)
                if item:
                    yield item

        # Fallback: scrape all PDF links
        yield from self._scrape_pdf_links(response)

    def _parse_homepage(self, response):
        """Parse homepage for any recruitment cards/links."""
        yield from self._scrape_pdf_links(response)

    def _find_section_rows(self, response, section_heading):
        """Find table rows under a specific section heading."""
        tables = response.css("table")
        all_rows = []

        for table in tables:
            rows = table.css("tbody tr, tr")
            data_rows = [r for r in rows if len(r.css("td")) >= 3]
            if data_rows:
                all_rows.extend(data_rows)

        return all_rows if all_rows else []

    def _parse_walkin_row(self, row, response, is_walkin):
        """Parse a walk-in or permanent post row from HTML table."""
        cells = row.css("td")
        if len(cells) < 3:
            return None

        # Column 0: Serial number
        sr_text = cells[0].css("::text").get("").strip()
        if not sr_text.isdigit():
            return None

        # Column 1: Advertisement Number
        advt_no = cells[1].css("::text").get("").strip()

        # Column 2: Title
        title_raw = " ".join(cells[2].css("::text").getall()).strip()
        if not title_raw or len(title_raw) < 5:
            return None

        # Column 3: Extra description (optional)
        extra_desc = " ".join(cells[3].css("::text").getall()).strip() if len(cells) > 3 else ""

        # Column 4: Interview Date / Last Date
        interview_date = None
        if len(cells) > 4:
            date_text = cells[4].css("::text").get("").strip()
            interview_date = self._parse_date(date_text)

        # Find PDF link in row
        notification_pdf = None
        for link in row.css("a"):
            href = link.attrib.get("href", "")
            if href.lower().endswith(".pdf") or "pdf" in href.lower():
                notification_pdf = response.urljoin(href) if not href.startswith("http") else href
                break

        # Deduplication
        dedup_string = f"ACTREC_{advt_no}_{title_raw[:20]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        candidate_url = notification_pdf or f"{response.url}#{advt_no}"
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[notification_pdf, candidate_url]):
            return None

        clean_title = self._clean_title(title_raw)

        # Build item
        item = ExamNotificationItem()
        
        # Core fields from HTML table
        item['title'] = clean_title
        item['org_name'] = "Advanced Centre for Treatment Research and Education in Cancer (Tata Memorial Centre)"
        item['org_acronym'] = "ACTREC"
        item['source_url'] = candidate_url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = None
        item['apply_end_date'] = interview_date
        item['advt_no'] = advt_no if advt_no else None
        item['status'] = self._determine_status(interview_date)
        item['exam_cities'] = ["Navi Mumbai", "Kharghar"]
        item['application_links'] = {
            "official_website": "https://actrec.gov.in",
        }

        # Multi-state / multi-language metadata
        item['lang'] = self.target_lang
        item['state_slug'] = self.target_state
        item['is_walk_in'] = is_walkin  # Metadata from HTML section, not PDF
        item['employment_type'] = 'walkin' if is_walkin else 'permanent'
        
        # DYNAMIC: Empty dict — Gemini pipeline will fill from PDF
        # No hardcoded venue, selection process, relaxation, etc.
        item['ai_extracted_data'] = {}

        # Description (from HTML only)
        desc_parts = [f"Type: {item['employment_type'].upper()}"]
        if interview_date:
            desc_parts.append(f"Date: {interview_date}")
        if extra_desc:
            desc_parts.append(extra_desc[:200])
        item['description'] = " | ".join(desc_parts)

        # SEO metadata
        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | ACTREC Recruitment {year}",
            "meta_description": f"{clean_title} at ACTREC Tata Memorial Centre.",
        }

        return item

    def _parse_result_row(self, row, response):
        """Parse a result row."""
        cells = row.css("td")
        if len(cells) < 3:
            return None

        sr_text = cells[0].css("::text").get("").strip()
        if not sr_text.isdigit():
            return None

        advt_no = cells[1].css("::text").get("").strip()
        title_raw = " ".join(cells[2].css("::text").getall()).strip()
        if not title_raw or len(title_raw) < 5:
            return None

        result_desc = " ".join(cells[3].css("::text").getall()).strip() if len(cells) > 3 else ""
        result_date = self._parse_date(cells[4].css("::text").get("").strip()) if len(cells) > 4 else None

        # Find PDF link
        result_pdf = None
        for link in row.css("a"):
            href = link.attrib.get("href", "")
            if href.lower().endswith(".pdf"):
                result_pdf = response.urljoin(href) if not href.startswith("http") else href
                break

        # Deduplication
        dedup_hash = hashlib.sha256(f"ACTREC_RESULT_{advt_no}".encode()).hexdigest()
        candidate_url = result_pdf or f"{response.url}#result-{advt_no}"
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[result_pdf, candidate_url]):
            return None

        clean_title = f"[RESULT] {self._clean_title(title_raw)}"

        item = ExamNotificationItem()
        item['title'] = clean_title
        item['org_name'] = "Advanced Centre for Treatment Research and Education in Cancer (Tata Memorial Centre)"
        item['org_acronym'] = "ACTREC"
        item['source_url'] = candidate_url
        item['notification_pdf'] = result_pdf
        item['apply_start_date'] = None
        item['apply_end_date'] = None
        item['advt_no'] = advt_no if advt_no else None
        item['status'] = 'closed'
        item['exam_cities'] = ["Navi Mumbai", "Kharghar"]
        item['application_links'] = {
            "official_website": "https://actrec.gov.in",
        }

        # Metadata
        item['lang'] = self.target_lang
        item['state_slug'] = self.target_state
        item['is_walk_in'] = False
        item['employment_type'] = 'permanent'
        
        # DYNAMIC: Empty dict
        item['ai_extracted_data'] = {}

        # Description
        desc_parts = ["Type: RESULT"]
        if result_desc:
            desc_parts.append(result_desc[:200])
        if result_date:
            desc_parts.append(f"Result Date: {result_date}")
        item['description'] = " | ".join(desc_parts)

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | ACTREC Result {year}",
            "meta_description": f"Result for {title_raw} at ACTREC Tata Memorial Centre.",
        }

        return item

    def _scrape_pdf_links(self, response):
        """Fallback: find all PDF links that look like advertisements."""
        seen_pdfs = set()
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = link.css("::text").get("").strip()

            if not href.lower().endswith(".pdf"):
                continue
            if "advertisement" not in href.lower() and "adv" not in href.lower() and "walk" not in href.lower():
                continue

            pdf_url = response.urljoin(href) if not href.startswith("http") else href

            if pdf_url in seen_pdfs:
                continue
            seen_pdfs.add(pdf_url)

            # Deduplication
            dedup_hash = hashlib.sha256(f"ACTREC_PDF_{pdf_url}".encode()).hexdigest()
            if self.track_duplicate(dedup_hash, label=text or pdf_url, urls=[pdf_url]):
                continue

            # Extract date from URL path
            url_date = None
            date_match = re.search(r'/(\d{4}-\d{2})/', pdf_url)
            if date_match:
                try:
                    url_date = datetime.strptime(date_match.group(1), "%Y-%m").strftime("%Y-%m-01")
                except ValueError:
                    pass

            clean_title = self._clean_title(text) if text else pdf_url.split("/")[-1].replace(".pdf", "").replace("%20", " ")

            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "Advanced Centre for Treatment Research and Education in Cancer (Tata Memorial Centre)"
            item['org_acronym'] = "ACTREC"
            item['source_url'] = pdf_url
            item['notification_pdf'] = pdf_url
            item['apply_start_date'] = None
            item['apply_end_date'] = url_date
            item['advt_no'] = self._extract_advt_no(clean_title)
            item['status'] = 'published'
            item['exam_cities'] = ["Navi Mumbai", "Kharghar"]
            item['application_links'] = {
                "official_website": "https://actrec.gov.in",
            }

            # Metadata (uncertain if walk-in, so set to None for AI to determine)
            item['lang'] = self.target_lang
            item['state_slug'] = self.target_state
            item['is_walk_in'] = None  # Let AI determine from PDF
            item['employment_type'] = None  # Let AI determine from PDF
            
            # DYNAMIC: Empty dict — Gemini will fill from PDF
            item['ai_extracted_data'] = {}

            item['description'] = f"PDF: {pdf_url.split('/')[-1]}"

            year = datetime.utcnow().year
            item['seo_metadata'] = {
                "meta_title": f"{clean_title} | ACTREC Recruitment {year}",
                "meta_description": f"{clean_title} at ACTREC Tata Memorial Centre.",
            }

            yield item

    # --- Helpers ---
    def _parse_date(self, text):
        text = (text or "").strip()
        if not text or text.lower() in ("not available", "na", "n/a", "-", "tba", ""):
            return None
        try:
            if re.match(r'^\d{2}/\d{2}/\d{4}$', text):
                return datetime.strptime(text, "%d/%m/%Y").strftime("%Y-%m-%d")
            if re.match(r'^\d{2}-\d{2}-\d{4}$', text):
                return datetime.strptime(text, "%d-%m-%Y").strftime("%Y-%m-%d")
            return date_parser.parse(text, dayfirst=True).strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            return None

    def _extract_advt_no(self, text):
        match = re.search(r'((?:ACTREC|CCE|OS-A)[\w./\-]+\d{4})', text, re.IGNORECASE)
        return match.group(1) if match else None

    def _determine_status(self, date_str):
        if not date_str:
            return 'published'
        try:
            d = datetime.strptime(str(date_str), "%Y-%m-%d")
            return 'closed' if d < datetime.utcnow() else 'published'
        except ValueError:
            return 'published'

    def _clean_title(self, text):
        return re.sub(r'\s+', ' ', text).strip()[:500]