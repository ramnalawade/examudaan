# ============================================================
# spiders/rsmssb_spider.py — Rajasthan Staff Selection Board
# ExamUdaan | https://rsmssb.rajasthan.gov.in
# Run: scrapy crawl rsmssb
# ============================================================
import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class RSMSSBSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Rajasthan Staff Selection Board — high volume state recruitment.
    The "What's New" marquee / ticker at the top has the latest links.
    """

    name            = "rsmssb"
    org_name        = "Rajasthan Staff Selection Board"
    org_acronym     = "RSMSSB"
    state_name      = "Rajasthan"
    default_notification_type = "recruitment"
    allowed_domains = ["rsmssb.rajasthan.gov.in"]
    start_urls      = ["https://rsmssb.rajasthan.gov.in/page?menuName=Latest+Notifications"]

    async def start(self):
        for req in self.start_requests():
            yield req

    def start_requests(self):
        urls = [
            "https://rsmssb.rajasthan.gov.in/page?menuName=Latest+Notifications",
            "https://rsmssb.rajasthan.gov.in/",
        ]
        for url in urls:
            yield scrapy.Request(url, callback=self.parse, errback=self.on_error)

    def parse(self, response):
        self.logger.info(f"[rsmssb] Parsing: {response.url}")
        seen = set()

        # RSMSSB has a "What's New" section + regular content tables
        selectors = [
            "div.whats-new a", "marquee a", "div.scroll a",
            "div.notification-list a", "table a",
            "a[href*='advt']", "a[href*='notification']",
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
                        "advt", "notification", "recruitment", "vacancy",
                        "result", "admit", "answer key", "syllabus",
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
        dedup_hash = hashlib.sha256(f"RSMSSB_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = "rsmssb"
        item["org_name"]         = self.org_name
        item["org_acronym"]      = self.org_acronym
        item["source_url"]       = url
        item["official_website"] = "https://rsmssb.rajasthan.gov.in"
        item["state"]            = ["Rajasthan"]
        item["state_slug"]       = "rajasthan"
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
        self.logger.warning(f"[rsmssb] Request failed: {failure.request.url}")
