# ============================================================
# spiders/mppsc_spider.py — Madhya Pradesh Public Service Commission
# ExamUdaan | Scrapes https://www.mppsc.mp.gov.in
# Run: scrapy crawl mppsc
# ============================================================

import scrapy
import hashlib
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class MPPSCSpider(DuplicateStopMixin, scrapy.Spider):
    name = "mppsc"
    allowed_domains = ["mppsc.mp.gov.in"]
    start_urls = [
        "https://www.mppsc.mp.gov.in/",
        "https://www.mppsc.mp.gov.in/en/recruitment",
    ]

    def parse(self, response):
        self.logger.info(f"[mppsc] Parsing: {response.url}")

        for a in response.css("a"):
            title = a.css("::text").get("").strip()
            href  = a.attrib.get("href", "")
            url   = response.urljoin(href)

            if not title or len(title) < 5:
                continue
            if self.should_skip_link(title, url):
                continue

            if url.endswith(".pdf"):
                item = ExamPost()
                item["title"]            = title
                item["board_slug"]       = "mppsc"
                item["org_acronym"]      = "MPPSC"
                item["org_name"]         = "Madhya Pradesh Public Service Commission"
                item["source_url"]       = url
                item["official_website"] = "https://www.mppsc.mp.gov.in"
                item["notification_pdf_url"] = url
                item["state"]            = ["Madhya Pradesh"]
                yield item
                continue

            keywords = ["notification", "recruitment", "vacancy", "result",
                        "admit", "answer", "syllabus", "exam", "advt"]
            if any(kw in title.lower() or kw in url.lower() for kw in keywords):
                yield response.follow(url, callback=self.parse_detail,
                                      meta={"title": title})

    def parse_detail(self, response):
        title = response.meta.get("title") or response.css("h1::text, h2::text").get("").strip()
        if not title or len(title) < 5:
            return

        dedup_hash = hashlib.sha256(f"MPPSC_{response.url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[response.url]):
            return

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = "mppsc"
        item["org_acronym"]      = "MPPSC"
        item["org_name"]         = "Madhya Pradesh Public Service Commission"
        item["source_url"]       = response.url
        item["official_website"] = "https://www.mppsc.mp.gov.in"
        item["state"]            = ["Madhya Pradesh"]
        item["dedup_hash"]       = dedup_hash

        pdf_links = response.css("a[href$='.pdf']::attr(href)").getall()
        if pdf_links:
            item["notification_pdf_url"] = response.urljoin(pdf_links[0])

        yield item
