# ============================================================
# spiders/maharashtra_syllabus_spider.py — Maharashtra Exam Syllabus & Scheme Crawler
# ExamUdaan.in — Continuous monitor for official syllabus PDFs & exam patterns
# Target Domains: mpsc.gov.in, mahapolice.gov.in, mahadma.maharashtra.gov.in, arogya.maharashtra.gov.in, mahadiscom.in
# ZERO LLM TOKEN USAGE: Fast heuristic and regex-based parser
# ============================================================

import scrapy
import re
from datetime import datetime
from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class MaharashtraSyllabusSpider(DuplicateStopMixin, scrapy.Spider):
    name = "maharashtra_syllabus"
    source_name = "Maharashtra Official Syllabus & Examination Schemes"
    allowed_domains = [
        "mpsc.gov.in",
        "mahapolice.gov.in",
        "mahadma.maharashtra.gov.in",
        "arogya.maharashtra.gov.in",
        "mahadiscom.in",
        "krishi.maharashtra.gov.in",
    ]

    start_urls = [
        # MPSC Official Syllabus & Scheme section
        "https://mpsc.gov.in/syllabus_schemes",
        # Maharashtra Police official notices
        "https://mahapolice.gov.in/recruitment",
        # Directorate of Municipal Administration (Nagar Parishad)
        "https://mahadma.maharashtra.gov.in",
        # Public Health Department (Arogya Vibhag)
        "https://arogya.maharashtra.gov.in",
        # MahaVitaran Career
        "https://mahadiscom.in/career",
    ]

    dedup_org = "MAHA_SYLLABUS"
    target_state = "maharashtra"
    target_lang = "mr"
    MAX_CONSECUTIVE_DUPLICATES = 5

    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "ROBOTSTXT_OBEY": False,
    }

    SYLLABUS_KEYWORDS = [
        "syllabus", "scheme", "अभ्यासक्रम", "परीक्षा योजना", "परीक्षेचे स्वरूप",
        "scheme of examination", "curriculum", "pattern"
    ]

    def parse(self, response):
        self.logger.info(f"MaharashtraSyllabusSpider: Scanning {response.url}")
        from pipelines import DeduplicationPipeline

        # Scan for links pointing to syllabus PDFs or announcement pages
        links = response.css("a")
        for link in links:
            text = " ".join(link.css("::text").getall()).strip()
            href = link.attrib.get("href", "").strip()

            if not href or href.startswith("#") or href.startswith("javascript:"):
                continue

            full_url = response.urljoin(href)

            # 1. Deduplication check — skip already crawled syllabus links and stop on consecutive duplicates
            if DeduplicationPipeline.is_known(full_url):
                self.track_duplicate(full_url, label=text)
                continue

            combined_text = f"{text} {href}".lower()

            is_syllabus_related = any(k in combined_text for k in self.SYLLABUS_KEYWORDS)
            is_pdf = full_url.lower().endswith(".pdf") or "download" in full_url.lower()

            if is_syllabus_related and len(text) > 4:
                item = ExamNotificationItem()
                item["title"] = text
                item["source_url"] = full_url
                item["notification_pdf"] = full_url if is_pdf else None
                item["notification_type"] = "syllabus"
                item["scraped_at"] = datetime.utcnow().isoformat()
                item["state"] = "Maharashtra"

                # Identify conducting organization
                if "mpsc.gov.in" in full_url:
                    item["organization"] = "MPSC"
                elif "mahapolice.gov.in" in full_url:
                    item["organization"] = "Maharashtra Police"
                elif "mahadma" in full_url:
                    item["organization"] = "DMA Maharashtra"
                elif "arogya" in full_url:
                    item["organization"] = "Public Health Department"
                elif "mahadiscom" in full_url:
                    item["organization"] = "MahaVitaran"
                else:
                    item["organization"] = "Maharashtra Govt"

                yield item
