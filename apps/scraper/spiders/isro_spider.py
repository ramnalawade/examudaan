# ============================================================
# spiders/isro_spider.py — ISRO Recruitment (Careers)
# ExamUdaan | https://www.isro.gov.in/careers.html
# Run: scrapy crawl isro
# ============================================================
import scrapy
import hashlib
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class ISROSpider(DuplicateStopMixin, scrapy.Spider):
    """
    ISRO Careers — modern site. We target the Careers listing directly.
    Playwright is recommended for full render; this uses static fallback.
    """

    name            = "isro"
    org_name        = "Indian Space Research Organisation"
    org_acronym     = "ISRO"
    state_name      = "All India"
    default_notification_type = "recruitment"
    allowed_domains = ["www.isro.gov.in", "isro.gov.in"]
    start_urls      = ["https://www.isro.gov.in/careers.html"]

    async def start(self):
        for req in self.start_requests():
            yield req

    def start_requests(self):
        yield scrapy.Request(
            "https://www.isro.gov.in/careers.html",
            callback=self.parse,
            errback=self.on_error,
        )

    def parse(self, response):
        self.logger.info(f"[isro] Parsing: {response.url}")
        seen = set()

        for link in response.css("a"):
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
                item = self._make(title, url)
                if item:
                    yield item
            elif any(kw in t_low for kw in [
                "recruitment", "scientist", "engineer", "job", "career",
                "vacancy", "advt", "application", "result", "admit",
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
        item = self._make(title, response.url)
        if not item:
            return
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)
        yield item

    def _make(self, title, url):
        dedup_hash = hashlib.sha256(f"ISRO_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None
        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = "isro"
        item["org_name"]         = self.org_name
        item["org_acronym"]      = self.org_acronym
        item["source_url"]       = url
        item["official_website"] = "https://www.isro.gov.in"
        item["state"]            = ["All India"]
        item["state_slug"]       = "all-india"
        item["dedup_hash"]       = dedup_hash
        t = title.lower()
        if "result" in t:
            item["notification_type"] = "result"
        elif "admit" in t:
            item["notification_type"] = "admit_card"
        elif "answer key" in t:
            item["notification_type"] = "answer_key"
        else:
            item["notification_type"] = "recruitment"
        return item

    def on_error(self, failure):
        self.logger.warning(f"[isro] Error: {failure.request.url}")
