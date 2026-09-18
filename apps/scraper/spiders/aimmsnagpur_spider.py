# ============================================================
# spiders/aimmsnagpur_spider.py — AIIMS Nagpur (COMPLETE FILE)
# Target: https://aiimsnagpur.edu.in/recruitment
# ============================================================

import scrapy
import re
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class AiimsNagpurSpider(DuplicateStopMixin, scrapy.Spider):
    name = "aiims_nagpur"
    source_name = "AIIMS Nagpur Official Recruitment Portal"
    allowed_domains = ["aiimsnagpur.edu.in"]
    start_urls = [
        "https://aiimsnagpur.edu.in/recruitment",
        "https://aiimsnagpur.edu.in/recruitment?category=SR/JR",
        "https://aiimsnagpur.edu.in/recruitment?category=Project",
    ]

    dedup_org = "AIIMS_NAGPUR"

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
        self.logger.info(f"AIIMS Nagpur: Parsing {response.url} — status {response.status}")

        rows = self._find_table_rows(response)

        if rows:
            self.logger.info(f"AIIMS Nagpur: Found {len(rows)} table rows")
            for row in rows:
                item = self._parse_row(row, response)
                if item:
                    yield item
        else:
            self.logger.warning("AIIMS Nagpur: No table rows found")

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
                data_rows = [r for r in rows if len(r.css("td")) >= 5]
                if data_rows:
                    return data_rows
        return []

    def _parse_row(self, row, response):
        cells = row.css("td")
        if len(cells) < 5:
            return None

        sr_text = cells[0].css("::text").get("").strip()
        if not sr_text.isdigit():
            return None

        title_raw = " ".join(cells[1].css("::text").getall()).strip()
        if not title_raw or len(title_raw) < 5:
            return None

        category = cells[2].css("::text").get("").strip() if len(cells) > 2 else None

        apply_links = []
        app_pdfs = []
        for link in cells[3].css("a"):
            href = link.attrib.get("href", "")
            full_url = response.urljoin(href) if href and not href.startswith("http") else href
            if href.lower().endswith(".pdf") or "pdf" in href.lower():
                app_pdfs.append(full_url)
            elif href:
                apply_links.append(full_url)

        apply_start = self._parse_iso_date(cells[4].css("::text").get("").strip()) if len(cells) > 4 else None
        apply_end = self._parse_iso_date(cells[5].css("::text").get("").strip()) if len(cells) > 5 else None

        notification_pdf = None
        if len(cells) > 6:
            for link in cells[6].css("a"):
                href = link.attrib.get("href", "")
                if href.lower().endswith(".pdf") or "pdf" in href.lower():
                    notification_pdf = response.urljoin(href) if not href.startswith("http") else href
                    break

        result_pdf = None
        if len(cells) > 7:
            for link in cells[7].css("a"):
                href = link.attrib.get("href", "")
                if href.lower().endswith(".pdf"):
                    result_pdf = response.urljoin(href) if not href.startswith("http") else href
                    break

        if not notification_pdf and app_pdfs:
            notification_pdf = app_pdfs[0]

        import hashlib
        from pipelines import DeduplicationPipeline
        candidate_url = notification_pdf or (apply_links[0] if apply_links else None) or response.url
        dedup_hash = hashlib.sha256(f"AIIMS_NAGPUR_{candidate_url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[notification_pdf, candidate_url]):
            return None

        advt_no = self._extract_advt_no(title_raw)
        clean_title = self._clean_title(title_raw)

        item = ExamNotificationItem()
        item['title'] = clean_title
        item['org_name'] = "All India Institute of Medical Sciences Nagpur"
        item['org_acronym'] = "AIIMS Nagpur"
        item['source_url'] = candidate_url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = apply_start
        item['apply_end_date'] = apply_end
        item['advt_no'] = advt_no
        item['status'] = self._determine_status(apply_end)
        item['exam_cities'] = ["Nagpur"]
        item['application_links'] = {
            "official_website": "https://aiimsnagpur.edu.in",
            "apply_online": apply_links[0] if apply_links else None,
            "apply_pdf": app_pdfs[0] if app_pdfs else None,
            "result_pdf": result_pdf,
        }

        desc_parts = [f"Start: {apply_start or 'N/A'}", f"Last: {apply_end or 'N/A'}"]
        if category:
            desc_parts.append(f"Category: {category}")
        item['description'] = " | ".join(desc_parts)

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | AIIMS Nagpur Recruitment {year}",
            "meta_description": f"Apply for {clean_title} at AIIMS Nagpur. Last date: {apply_end or 'N/A'}.",
        }

        return item

    def _parse_iso_date(self, text):
        text = (text or "").strip()
        if not text or text.lower() in ("not available", "na", "n/a", "-", "tba"):
            return None
        try:
            if re.match(r'^\d{4}-\d{2}-\d{2}$', text):
                return text
            date = date_parser.parse(text, dayfirst=True)
            return date.strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            return None

    def _extract_advt_no(self, title):
        match = re.search(r'(AIIMS[-/][\w./\-]+(?:\d{4})[\w./\-]*)', title, re.IGNORECASE)
        if match:
            return match.group(1).strip()
        match = re.search(r'(?:advt|advertisement|notice)[\s.#-]*no\.?[\s.:]*(\S+)', title, re.IGNORECASE)
        return match.group(1) if match else None

    def _determine_status(self, apply_end_date):
        if not apply_end_date:
            return 'published'
        try:
            end = datetime.strptime(str(apply_end_date), "%Y-%m-%d")
            return 'closed' if end < datetime.utcnow() else 'published'
        except ValueError:
            return 'published'

    def _clean_title(self, text):
        cleaned = re.sub(r'AIIMS[-/][\w./\-]+(?:\d{4})[\w./\-]*\s*', '', text, flags=re.IGNORECASE)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        return cleaned[:500] if cleaned else text[:500]