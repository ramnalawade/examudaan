# ============================================================
# spiders/iips_mumbai_spider.py — IIPS Mumbai (FIXED - 11 columns)
# Target: https://www.iipsindia.ac.in/recruitment/job/list
# 
# ACTUAL Table columns (11 total):
# 0: Sr. No. | 1: Job Title | 2: Category | 3: Details |
# 4: Opening Date (DD-MM-YYYY) | 5: Closing Date (DD-MM-YYYY) |
# 6: Minimum Qualification | 7: Expected Experience |
# 8: Location | 9: Upload Document-1 (PDF) | 10: Upload Document-2 (PDF)
# ============================================================

import scrapy
import re
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class IipsMumbaiSpider(DuplicateStopMixin, scrapy.Spider):
    name = "iips_mumbai"
    source_name = "IIPS Mumbai Official Recruitment Portal"
    allowed_domains = ["iipsindia.ac.in"]
    start_urls = [
        "https://www.iipsindia.ac.in/recruitment/job/list",
        "https://www.iipsindia.ac.in/recruitment/job/list/archive-list",
    ]

    dedup_org = "IIPS_MUMBAI"

    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        "USER_AGENT": "ExamUdaanBot/1.0 (+https://examudaan.in; contact@examudaan.in)",
    }

    TABLE_SELECTORS = [
        "table.recruitment-table",
        "table.table-striped",
        "table.table",
        "table",
    ]

    def parse(self, response):
        self.logger.info(f"IIPS Mumbai: Parsing {response.url} — status {response.status}")

        rows = self._find_table_rows(response)

        if rows:
            self.logger.info(f"IIPS Mumbai: Found {len(rows)} table rows")
            for row in rows:
                item = self._parse_row(row, response)
                if item:
                    yield item
        else:
            self.logger.warning("IIPS Mumbai: No table rows found")

        next_pages = response.css(
            "a.next::attr(href), li.next a::attr(href), .pagination a[rel='next']::attr(href)"
        ).getall()
        for url in next_pages:
            yield response.follow(url, self.parse)

    def _find_table_rows(self, response):
        for selector in self.TABLE_SELECTORS:
            table = response.css(selector)
            if table:
                rows = table.css("tbody tr, tr")
                # Need at least 6 columns to be a valid data row
                data_rows = [r for r in rows if len(r.css("td")) >= 6]
                if data_rows:
                    return data_rows
        return []

    def _parse_row(self, row, response):
        """Parse a single IIPS table row (11 columns).
        
        Columns:
        0: Sr. No.
        1: Job Title
        2: Category
        3: Details
        4: Opening Date (DD-MM-YYYY)
        5: Closing Date (DD-MM-YYYY)
        6: Minimum Qualification
        7: Expected Experience
        8: Location
        9: Upload Document-1 (PDF link)
        10: Upload Document-2 (PDF link, optional)
        """
        cells = row.css("td")
        if len(cells) < 6:
            return None

        # Column 0: Serial number
        sr_text = cells[0].css("::text").get("").strip()
        if not sr_text.isdigit():
            return None

        # Column 1: Job Title
        title_raw = " ".join(cells[1].css("::text").getall()).strip()
        if not title_raw or len(title_raw) < 5:
            return None

        # Column 2: Category
        category = cells[2].css("::text").get("").strip() if len(cells) > 2 else None

        # Column 3: Details
        details = " ".join(cells[3].css("::text").getall()).strip() if len(cells) > 3 else None

        # Column 4: Opening Date (DD-MM-YYYY)
        apply_start = self._parse_date(cells[4].css("::text").get("").strip()) if len(cells) > 4 else None

        # Column 5: Closing Date (DD-MM-YYYY)
        apply_end = self._parse_date(cells[5].css("::text").get("").strip()) if len(cells) > 5 else None

        # Column 6: Minimum Qualification
        qualification = cells[6].css("::text").get("").strip() if len(cells) > 6 else None

        # Column 7: Expected Experience
        experience = cells[7].css("::text").get("").strip() if len(cells) > 7 else None

        # Column 8: Location
        location = cells[8].css("::text").get("").strip() if len(cells) > 8 else "Mumbai"

        # Column 9: Upload Document-1 (PRIMARY PDF + Apply Link)
        pdf_link_1 = None
        if len(cells) > 9:
            href = cells[9].css("a::attr(href)").get()
            if href:
                pdf_link_1 = response.urljoin(href) if not href.startswith("http") else href

        # Column 10: Upload Document-2 (SECONDARY PDF, optional)
        pdf_link_2 = None
        if len(cells) > 10:
            href = cells[10].css("a::attr(href)").get()
            if href:
                pdf_link_2 = response.urljoin(href) if not href.startswith("http") else href

        # Use first PDF as notification_pdf and apply link
        notification_pdf = pdf_link_1
        apply_link = pdf_link_1  # PDF IS the application document

        # Early duplicate check
        from pipelines import DeduplicationPipeline
        candidate_url = notification_pdf or response.url
        import hashlib
        dedup_hash = hashlib.sha256(f"IIPS_{candidate_url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[notification_pdf, candidate_url]):
            self.logger.debug(f"IIPS: Skipping known URL")
            return None

        clean_title = self._clean_title(title_raw)

        # Build item
        item = ExamNotificationItem()
        item['title'] = clean_title
        item['org_name'] = "International Institute for Population Sciences"
        item['org_acronym'] = "IIPS Mumbai"
        item['source_url'] = candidate_url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = apply_start
        item['apply_end_date'] = apply_end
        item['advt_no'] = None
        item['status'] = self._determine_status(apply_end)
        item['exam_cities'] = [location] if location else ["Mumbai"]
        item['application_links'] = {
            "official_website": "https://www.iipsindia.ac.in",
            "apply_online": pdf_link_1,       # Document-1 PDF
            "apply_pdf": pdf_link_2,           # Document-2 PDF (if exists)
        }

        # Build description
        desc_parts = []
        if details:
            desc_parts.append(details[:300])
        desc_parts.append(f"Start: {apply_start or 'N/A'}")
        desc_parts.append(f"Last: {apply_end or 'N/A'}")
        if qualification:
            desc_parts.append(f"Qualification: {qualification}")
        if experience:
            desc_parts.append(f"Experience: {experience}")
        if category:
            desc_parts.append(f"Category: {category}")
        item['description'] = " | ".join(desc_parts)

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | IIPS Mumbai Recruitment {year}",
            "meta_description": f"Apply for {clean_title} at IIPS Mumbai. Qualification: {qualification or 'N/A'}. Last date: {apply_end or 'N/A'}.",
        }

        return item

    def _parse_date(self, text):
        text = (text or "").strip()
        if not text or text.lower() in ("not available", "na", "n/a", "-", "tba", ""):
            return None
        try:
            if re.match(r'^\d{2}-\d{2}-\d{4}$', text):
                date = datetime.strptime(text, "%d-%m-%Y")
                return date.strftime("%Y-%m-%d")
            date = date_parser.parse(text, dayfirst=True)
            return date.strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            self.logger.debug(f"IIPS: Could not parse date: {text}")
            return None

    def _determine_status(self, apply_end_date):
        if not apply_end_date:
            return 'published'
        try:
            end = datetime.strptime(str(apply_end_date), "%Y-%m-%d")
            return 'closed' if end < datetime.utcnow() else 'published'
        except ValueError:
            return 'published'

    def _clean_title(self, text):
        cleaned = re.sub(r'\s+', ' ', text).strip()
        return cleaned[:500]