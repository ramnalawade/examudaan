# ============================================================
# spiders/tnpsc_spider.py — Tamil Nadu Public Service Commission
# ExamUdaan | Scrapes https://www.tnpsc.gov.in
# Run: scrapy crawl tnpsc
# ============================================================

import scrapy
import hashlib
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class TNPSCSpider(DuplicateStopMixin, scrapy.Spider):
    name = "tnpsc"
    allowed_domains = ["tnpsc.gov.in"]
    start_urls = [
        "https://www.tnpsc.gov.in/newnotifications.html",
        "https://www.tnpsc.gov.in/Notifications.html",
    ]

    def parse(self, response):
        self.logger.info(f"[tnpsc] Parsing: {response.url}")

        # TNPSC uses table-based layout
        for row in response.css("table tr"):
            cells = row.css("td")
            a     = row.css("a")
            if not a:
                continue

            title = a[0].css("::text").get("").strip()
            href  = a[0].attrib.get("href", "")
            url   = response.urljoin(href)

            # Try to get date from adjacent cell
            date_text = cells[0].css("::text").get("").strip() if cells else ""

            if not title or len(title) < 5:
                continue
            if self.should_skip_link(title, url):
                continue
            if date_text and self.is_stale_date(date_text):
                continue

            if url.endswith(".pdf"):
                item = ExamPost()
                item["title"]            = title
                item["board_slug"]       = "tnpsc"
                item["org_acronym"]      = "TNPSC"
                item["org_name"]         = "Tamil Nadu Public Service Commission"
                item["source_url"]       = url
                item["official_website"] = "https://www.tnpsc.gov.in"
                item["notification_pdf_url"] = url
                item["notification_date"] = date_text or None
                item["state"]            = ["Tamil Nadu"]
                yield item
                continue

            yield response.follow(url, callback=self.parse_detail,
                                  meta={"title": title, "date_text": date_text})

    def parse_detail(self, response):
        title = response.meta.get("title") or response.css("h1::text, h2::text").get("").strip()
        if not title or len(title) < 5:
            return

        dedup_hash = hashlib.sha256(f"TNPSC_{response.url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[response.url]):
            return

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = "tnpsc"
        item["org_acronym"]      = "TNPSC"
        item["org_name"]         = "Tamil Nadu Public Service Commission"
        item["source_url"]       = response.url
        item["official_website"] = "https://www.tnpsc.gov.in"
        item["state"]            = ["Tamil Nadu"]
        item["notification_date"] = response.meta.get("date_text")
        item["dedup_hash"]        = dedup_hash

        pdf_links = response.css("a[href$='.pdf']::attr(href)").getall()
        if pdf_links:
            item["notification_pdf_url"] = response.urljoin(pdf_links[0])

        yield item
