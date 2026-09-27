# ============================================================
# spiders/archive_spider.py — Official PYQ & Answer Key Archive Spider
# ExamUdaan.in | Proprietary Database of Official Exam Question Papers
#
# Crawls official archive repositories of MPSC and UPSC:
#   - MPSC Previous Question Papers: https://mpsc.gov.in/previous_question_papers
#   - UPSC Previous Question Papers: https://upsc.gov.in/examinations/previous-question-papers
#
# Extracts Master Question Paper PDFs, Final Answer Keys, Years, and Subjects.
#
# Run: scrapy crawl pyq_archive
# ============================================================

import re
import json
import scrapy
from urllib.parse import urljoin

ARCHIVE_SOURCES = [
    {
        "org": "MPSC",
        "name": "Maharashtra Public Service Commission",
        "url": "https://mpsc.gov.in/previous_question_papers",
        "type": "mpsc",
    },
    {
        "org": "UPSC",
        "name": "Union Public Service Commission",
        "url": "https://upsc.gov.in/examinations/previous-question-papers",
        "type": "upsc",
    },
]

class PYQArchiveSpider(scrapy.Spider):
    name = "pyq_archive"
    allowed_domains = ["mpsc.gov.in", "upsc.gov.in"]

    custom_settings = {
        "DOWNLOAD_DELAY": 3.0,
        "USER_AGENT": "ExamUdaan-Bot/1.0 (+https://examudaan.in/bot-info; student-prep-aggregator)",
        "ROBOTSTXT_OBEY": True,
        "AUTOTHROTTLE_ENABLED": True,
        "AUTOTHROTTLE_START_DELAY": 2.0,
        "AUTOTHROTTLE_MAX_DELAY": 8.0,
    }

    def start_requests(self):
        for source in ARCHIVE_SOURCES:
            self.logger.info(f"[pyq_archive] Starting crawl for {source['org']}: {source['url']}")
            yield scrapy.Request(
                url=source["url"],
                callback=self.parse_archive,
                meta={"source": source},
                errback=self.on_error,
                dont_filter=True,
            )

    def on_error(self, failure):
        self.logger.warning(f"[pyq_archive] Request failed: {failure.request.url} - {failure.getErrorMessage()}")

    def parse_archive(self, response):
        source = response.meta["source"]
        org = source["org"]

        self.logger.info(f"[pyq_archive] Parsing {org} archive page...")
        items = []

        if org == "UPSC":
            # UPSC tables typically have: Examination Name | Year | Subject / Paper | Download PDF Link
            rows = response.css("table tbody tr, .view-content tbody tr")
            for row in rows:
                title = row.css("td:nth-child(1)::text, td:nth-child(2)::text").get() or ""
                year_text = row.css("td:nth-child(2)::text, td:nth-child(3)::text").get() or ""
                pdf_link = row.css("a[href$='.pdf']::attr(href)").get()

                if not pdf_link:
                    continue

                full_pdf_url = urljoin(response.url, pdf_link)
                clean_title = re.sub(r'\s+', ' ', title).strip()

                # Extract year (4 digits)
                match_yr = re.search(r'\b(20\d\d)\b', f"{year_text} {clean_title}")
                year = int(match_yr.group(1)) if match_yr else 2024

                doc_type = "answer_key" if "answer key" in clean_title.lower() or "key" in clean_title.lower() else "question_paper"

                record = {
                    "conducting_body": "UPSC",
                    "title": clean_title,
                    "year": year,
                    "pdf_url": full_pdf_url,
                    "doc_type": doc_type,
                    "scraped_from": response.url,
                }
                items.append(record)
                yield record

        elif org == "MPSC":
            # MPSC archives: Table with Title / Advt No | Year | PDF download link
            rows = response.css("table tr, .table tr")
            for row in rows:
                cols = row.css("td")
                if len(cols) < 2:
                    continue

                title = cols[1].css("::text").get() or cols[0].css("::text").get() or ""
                clean_title = re.sub(r'\s+', ' ', title).strip()
                pdf_link = row.css("a[href*='.pdf']::attr(href)").get()

                if not pdf_link or len(clean_title) < 5:
                    continue

                full_pdf_url = urljoin(response.url, pdf_link)
                match_yr = re.search(r'\b(20\d\d)\b', clean_title)
                year = int(match_yr.group(1)) if match_yr else 2024

                doc_type = "answer_key" if any(w in clean_title.lower() for w in ["उत्तरतालिका", "answer key", "key"]) else "question_paper"

                record = {
                    "conducting_body": "MPSC",
                    "title": clean_title,
                    "year": year,
                    "pdf_url": full_pdf_url,
                    "doc_type": doc_type,
                    "scraped_from": response.url,
                }
                items.append(record)
                yield record

        # Save local JSON cache for instant reference
        if items:
            filename = f"pyq_archive_{org.lower()}.json"
            try:
                with open(filename, "w", encoding="utf-8") as f:
                    json.dump(items, f, ensure_ascii=False, indent=2)
                self.logger.info(f"[pyq_archive] Saved {len(items)} {org} papers to {filename}")
            except Exception as e:
                self.logger.warning(f"[pyq_archive] Failed to write {filename}: {e}")
