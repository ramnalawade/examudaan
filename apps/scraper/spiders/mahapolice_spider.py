# ============================================================
# spiders/mahapolice_spider.py — Maharashtra Police Recruitment
# Target: https://mahapolice.gov.in
# 
# Maharashtra Police publishes recruitment for:
# - Constable, SI (Sub-Inspector), various support staff
# - Also uses Maharecruitment.gov.in for some exams
# ============================================================

import scrapy
import re
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin
from pipelines import DeduplicationPipeline


class MahaPoliceSpider(DuplicateStopMixin, scrapy.Spider):
    name = "mahapolice"
    source_name = "Maharashtra Police Recruitment"
    allowed_domains = ["mahapolice.gov.in", "maharecruitment.gov.in"]
    start_urls = [
        "https://mahapolice.gov.in/recruitment",
        "https://mahapolice.gov.in/notification",
        "https://maharecruitment.gov.in",
    ]

    custom_settings = {
        "DOWNLOAD_DELAY": 3,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
    }

    def parse(self, response):
        self.logger.info(f"MahaPolice: Parsing {response.url} — {response.status}")

        # --- Table-based layout ---
        rows = response.css("table tr")
        for row in rows:
            cells = row.css("td")
            if len(cells) < 2:
                continue

            cell_texts = [" ".join(c.css("::text").getall()).strip() for c in cells]
            title = None
            for text in cell_texts:
                if len(text) > 10 and not re.match(r'^\d+$', text):
                    title = text
                    break

            if not title:
                continue

            pdf_url = None
            for link in row.css("a"):
                href = link.attrib.get("href", "")
                if "pdf" in href.lower():
                    pdf_url = response.urljoin(href)
                    break

            link_url = row.css("a::attr(href)").get()
            source_url = response.urljoin(link_url) if link_url else response.url

            all_text = " ".join(cell_texts)
            dates = self._extract_dates(all_text)

            item = ExamNotificationItem()
            item['title']          = self._clean_title(title)
            item['org_name']       = "Maharashtra Police"
            item['org_acronym']    = "MahaPolice"
            item['source_url']     = source_url
            item['notification_pdf'] = pdf_url
            item['apply_start_date'] = dates[0] if len(dates) > 1 else None
            item['apply_end_date']   = dates[-1] if dates else None
            item['status']           = self._determine_status(item.get('apply_end_date'))
            item['exam_cities']      = ["Mumbai", "Pune", "Nagpur", "Nashik",
                                        "Aurangabad", "Thane", "Kolhapur"]
            item['application_links'] = {
                "official_website": "https://mahapolice.gov.in",
                "apply_online": source_url if "pdf" not in source_url.lower() else None,
            }
            item['seo_metadata'] = {
                "meta_title": f"{item['title']} | Maharashtra Police Recruitment",
                "meta_description": f"Apply for {item['title']}. Check eligibility and dates.",
            }
            import hashlib
            _dedup_hash = hashlib.sha256(f"MAHAPOLICE_{source_url}".encode()).hexdigest()
            if self.track_duplicate(_dedup_hash, label=item['title'], urls=[source_url, pdf_url]):
                continue
            yield item

        # --- Card/list based layout ---
        for card in response.css(".notification-card, .job-listing, article, .post"):
            title_tag = card.css("h2, h3, h4, .title::text").get("")
            if not title_tag or len(title_tag) < 5:
                continue

            href = card.css("a::attr(href)").get("")
            pdf_href = None
            for a in card.css("a"):
                h = a.attrib.get("href", "")
                if "pdf" in h.lower():
                    pdf_href = response.urljoin(h)
                    break

            card_text = " ".join(card.css("::text").getall())
            dates = self._extract_dates(card_text)

            item = ExamNotificationItem()
            item['title']          = self._clean_title(title_tag)
            item['org_name']       = "Maharashtra Police"
            item['org_acronym']    = "MahaPolice"
            item['source_url']     = response.urljoin(href) if href else response.url
            item['notification_pdf'] = pdf_href
            item['apply_start_date'] = dates[0] if len(dates) > 1 else None
            item['apply_end_date']   = dates[-1] if dates else None
            item['status']           = self._determine_status(item.get('apply_end_date'))
            item['exam_cities']      = ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"]
            item['application_links'] = {"official_website": "https://mahapolice.gov.in"}
            yield item

        # Pagination
        for url in response.css("a.next::attr(href), .pagination a::attr(href)").getall():
            yield response.follow(url, self.parse)

    # ---- Helpers ----

    DATE_PATTERNS = [
        r'\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b',
        r'\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|'
        r'Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|'
        r'Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})\b',
    ]

    def _extract_dates(self, text):
        found = []
        for pattern in self.DATE_PATTERNS:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                try:
                    date = date_parser.parse(match.group(0), dayfirst=True)
                    date_str = date.strftime("%Y-%m-%d")
                    if date_str not in found:
                        found.append(date_str)
                except (ValueError, OverflowError):
                    continue
        return found

    def _determine_status(self, apply_end_date):
        if not apply_end_date:
            return 'published'
        try:
            end = datetime.strptime(str(apply_end_date), "%Y-%m-%d")
            return 'closed' if end < datetime.utcnow() else 'published'
        except ValueError:
            return 'published'

    def _clean_title(self, text):
        return re.sub(r'\s+', ' ', text).strip()[:500]
