# ============================================================
# spiders/gpsc_spider.py — Gujarat Public Service Commission
# ExamUdaan | Scrapes https://gpsc.gujarat.gov.in
# Run: scrapy crawl gpsc
# ============================================================

import scrapy
import hashlib
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class GPSCSpider(DuplicateStopMixin, scrapy.Spider):
    name = "gpsc"
    allowed_domains = ["gpsc.gujarat.gov.in"]
    start_urls = [
        "https://gpsc.gujarat.gov.in/LatestNews",
        "https://gpsc.gujarat.gov.in/Recruitment",
        "https://gpsc.gujarat.gov.in/Results",
    ]

    def parse(self, response):
        self.logger.info(f"[gpsc] Parsing: {response.url}")

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
                item["board_slug"]       = "gpsc"
                item["org_acronym"]      = "GPSC"
                item["org_name"]         = "Gujarat Public Service Commission"
                item["source_url"]       = url
                item["official_website"] = "https://gpsc.gujarat.gov.in"
                item["notification_pdf_url"] = url
                item["state"]            = ["Gujarat"]
                yield item
                continue

            keywords = ["notification", "recruitment", "vacancy", "result",
                        "admit", "answer", "syllabus", "exam", "advt", "bharti"]
            if any(kw in title.lower() or kw in url.lower() for kw in keywords):
                yield response.follow(url, callback=self.parse_detail,
                                      meta={"title": title})

    def parse_detail(self, response):
        title = response.meta.get("title") or response.css("h1::text, h2::text").get("").strip()
        if not title or len(title) < 5:
            return

        dedup_hash = hashlib.sha256(f"GPSC_{response.url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[response.url]):
            return

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = "gpsc"
        item["org_acronym"]      = "GPSC"
        item["org_name"]         = "Gujarat Public Service Commission"
        item["source_url"]       = response.url
        item["official_website"] = "https://gpsc.gujarat.gov.in"
        item["state"]            = ["Gujarat"]
        item["dedup_hash"]       = dedup_hash

        pdf_links = response.css("a[href$='.pdf']::attr(href)").getall()
        if pdf_links:
            item["notification_pdf_url"] = response.urljoin(pdf_links[0])

        yield item
