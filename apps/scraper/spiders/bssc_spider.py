# ============================================================
# spiders/bssc_spider.py — Bihar Staff Selection Commission
# ExamUdaan | https://bssc.bihar.gov.in
# Run: scrapy crawl bssc
# ============================================================
import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class BSSCSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Bihar Staff Selection Commission (BSSC) — covers non-gazetted posts in Bihar.
    Usually has a simple table/list structure with Advertisement links.
    """

    name            = "bssc"
    org_name        = "Bihar Staff Selection Commission"
    org_acronym     = "BSSC"
    state_name      = "Bihar"
    default_notification_type = "recruitment"
    allowed_domains = ["bssc.bihar.gov.in"]
    start_urls      = ["https://bssc.bihar.gov.in/"]

    async def start(self):
        for req in self.start_requests():
            yield req

    def start_requests(self):
        # Primary page + advertisement listing page
        urls = [
            "https://bssc.bihar.gov.in/",
            "https://bssc.bihar.gov.in/bssc_advertisement",
        ]
        for url in urls:
            yield scrapy.Request(url, callback=self.parse, errback=self.on_error)

    def parse(self, response):
        self.logger.info(f"[bssc] Parsing: {response.url}")
        seen = set()

        selectors = [
            "table a", "ul.advertisement a", "div.row a",
            "a[href*='advt']", "a[href*='advertisement']",
            "a[href*='result']", "a[href*='notice']",
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
                t_low = title.lower()

                if url.lower().endswith(".pdf"):
                    item = self._make_item(title, url)
                    if item:
                        yield item
                elif any(kw in t_low for kw in ["advt", "advertisement", "recruitment", "result", "admit", "notification", "vacancy"]):
                    yield response.follow(
                        url,
                        callback=self.parse_detail,
                        meta={"title": title},
                        errback=self.on_error,
                    )

    def parse_detail(self, response):
        title = (
            response.meta.get("title")
            or response.css("h1::text, h2::text, h3::text").get("")
        ).strip()

        if not title or len(title) < 5:
            return

        item = self._make_item(title, response.url)
        if not item:
            return

        # First PDF link
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        text = " ".join(response.css("*::text").getall())
        m = re.search(r"(\d[\d,]+)\s*(vacancies|posts?|vacancy)", text, re.IGNORECASE)
        if m:
            item["total_vacancies"] = int(m.group(1).replace(",", ""))

        yield item

    def _make_item(self, title, url):
        dedup_hash = hashlib.sha256(f"BSSC_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = "bssc"
        item["org_name"]         = self.org_name
        item["org_acronym"]      = self.org_acronym
        item["source_url"]       = url
        item["official_website"] = "https://bssc.bihar.gov.in"
        item["state"]            = ["Bihar"]
        item["state_slug"]       = "bihar"
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
        self.logger.warning(f"[bssc] Request failed: {failure.request.url}")
