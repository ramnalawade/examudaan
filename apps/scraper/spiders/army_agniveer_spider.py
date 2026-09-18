# ============================================================
# spiders/army_agniveer_spider.py — Indian Army Agniveer Recruitment
# ExamUdaan | https://joinindianarmy.nic.in
# Run: scrapy crawl army_agniveer
#
# Note: Modern JS-rendered portal. This spider handles static fallback.
# For full JS rendering, upgrade to Playwright middleware in settings.
# ============================================================
import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class ArmyAgniveerSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Indian Army Agniveer & recruitment notifications.
    Targets announcement/news blocks on the Joinindianarmy portal.
    """

    name            = "army_agniveer"
    org_name        = "Indian Army"
    org_acronym     = "ARMY"
    state_name      = "All India"
    default_notification_type = "recruitment"
    # The JS-heavy main site; also try a static news page
    allowed_domains = ["joinindianarmy.nic.in", "www.joinindianarmy.nic.in"]
    start_urls      = [
        "https://joinindianarmy.nic.in/",
        "https://joinindianarmy.nic.in/News.aspx",
    ]

    async def start(self):
        for req in self.start_requests():
            yield req

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url, callback=self.parse, errback=self.on_error)

    def parse(self, response):
        self.logger.info(f"[army_agniveer] Parsing: {response.url}")
        seen = set()

        selectors = [
            "div.news a", "div.notification a", "ul.news-list a",
            "div.latest-news a", "div.announcement a",
            "a[href*='news']", "a[href*='notification']",
            "a[href*='recruitment']", "a[href*='agniveer']",
            "a[href$='.pdf']", "table a",
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
                        "recruit", "agniveer", "notification", "vacancy",
                        "result", "admit", "join", "sena", "soldier",
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

        yield item

    def _make_item(self, title, url):
        dedup_hash = hashlib.sha256(f"ARMY_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = "army_agniveer"
        item["org_name"]         = self.org_name
        item["org_acronym"]      = self.org_acronym
        item["source_url"]       = url
        item["official_website"] = "https://joinindianarmy.nic.in"
        item["state"]            = ["All India"]
        item["state_slug"]       = "all-india"
        item["dedup_hash"]       = dedup_hash
        t = title.lower()
        if "result" in t or "merit" in t:
            item["notification_type"] = "result"
        elif "admit" in t or "call letter" in t:
            item["notification_type"] = "admit_card"
        elif "answer key" in t:
            item["notification_type"] = "answer_key"
        else:
            item["notification_type"] = "recruitment"
        return item

    def on_error(self, failure):
        self.logger.warning(f"[army_agniveer] Request failed: {failure.request.url}")
