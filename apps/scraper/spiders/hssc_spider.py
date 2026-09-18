# ============================================================
# spiders/hssc_spider.py — Haryana Staff Selection Commission
# ExamUdaan | https://hssc.gov.in
# Run: scrapy crawl hssc
# ============================================================
import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class HSSCSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Haryana Staff Selection Commission (HSSC).
    Different from HPSC (IAS-level posts). HSSC handles Group C/D state posts.
    Simple table structure — look for Advertisement and Result tabs.
    """

    name            = "hssc"
    org_name        = "Haryana Staff Selection Commission"
    org_acronym     = "HSSC"
    state_name      = "Haryana"
    default_notification_type = "recruitment"
    allowed_domains = ["hssc.gov.in"]
    start_urls      = ["https://hssc.gov.in/"]

    async def start(self):
        for req in self.start_requests():
            yield req

    def start_requests(self):
        yield scrapy.Request(
            "https://hssc.gov.in/",
            callback=self.parse,
            errback=self.on_error,
        )

    def parse(self, response):
        self.logger.info(f"[hssc] Parsing: {response.url}")
        seen = set()

        selectors = [
            "div.latest-news a", "div.notification a", "table a",
            "marquee a", "a[href*='advt']", "a[href*='advertisement']",
            "a[href*='result']", "a[href*='admit']",
            "a[href$='.pdf']",
        ]

        for sel in selectors:
            for link in response.css(sel):
                href  = link.attrib.get("href", "")
                title = (link.xpath("string(.)").get() or "").strip()
                url   = response.urljoin(href)

                if not title or len(title) < 5 or url in seen:
                    continue
                if href.endswith((".jpg", ".png", ".gif", ".ico", ".js", ".css")):
                    continue

                seen.add(url)

                if url.lower().endswith(".pdf"):
                    item = self._make_item(title, url)
                    if item:
                        yield item
                else:
                    t_low = title.lower()
                    if any(kw in t_low for kw in [
                        "advt", "advertisement", "recruitment", "vacancy",
                        "result", "admit", "syllabus", "answer key", "notification",
                    ]):
                        yield response.follow(
                            url,
                            callback=self.parse_detail,
                            meta={"title": title},
                            errback=self.on_error,
                        )

    def parse_detail(self, response):
        title = (
            response.meta.get("title")
            or response.css("h1::text, h2::text").get("")
        ).strip()

        if not title or len(title) < 5:
            return

        item = self._make_item(title, response.url)
        if not item:
            return

        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        text = " ".join(response.css("*::text").getall())
        m = re.search(r"(\d[\d,]+)\s*(posts?|vacancies|vacancy)", text, re.IGNORECASE)
        if m:
            item["total_vacancies"] = int(m.group(1).replace(",", ""))

        yield item

    def _make_item(self, title, url):
        dedup_hash = hashlib.sha256(f"HSSC_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = "hssc"
        item["org_name"]         = self.org_name
        item["org_acronym"]      = self.org_acronym
        item["source_url"]       = url
        item["official_website"] = "https://hssc.gov.in"
        item["state"]            = ["Haryana"]
        item["state_slug"]       = "haryana"
        item["dedup_hash"]       = dedup_hash
        t = title.lower()
        if "result" in t or "merit" in t:
            item["notification_type"] = "result"
        elif "admit" in t or "call letter" in t:
            item["notification_type"] = "admit_card"
        elif "answer key" in t:
            item["notification_type"] = "answer_key"
        elif "syllabus" in t:
            item["notification_type"] = "syllabus"
        else:
            item["notification_type"] = "recruitment"
        return item

    def on_error(self, failure):
        self.logger.warning(f"[hssc] Request failed: {failure.request.url}")
