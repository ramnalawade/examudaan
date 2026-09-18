# ============================================================
# spiders/navy_airforce_spider.py — Indian Navy & Air Force Recruitment
# ExamUdaan | https://joinindiannavy.gov.in & https://agnipathvayu.cdac.in
# Run: scrapy crawl navy_airforce
# ============================================================
import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class NavyAirForceSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Indian Navy and Air Force recruitment notifications.
    Both sites are modern and fairly easy to scrape — no major Cloudflare.
    """

    name            = "navy_airforce"
    org_name        = "Indian Navy / Air Force"
    default_notification_type = "recruitment"
    allowed_domains = [
        "joinindiannavy.gov.in",
        "www.joinindiannavy.gov.in",
        "agnipathvayu.cdac.in",
        "airmenselection.cdac.in",
        "afcat.cdac.in",
    ]
    start_urls = [
        "https://joinindiannavy.gov.in/",
        "https://afcat.cdac.in/AFCAT/",
    ]

    _ORG_MAP = {
        "joinindiannavy.gov.in": ("Indian Navy", "NAVY", "all-india", "navy"),
        "agnipathvayu.cdac.in":  ("Indian Air Force", "IAF",  "all-india", "navy_airforce"),
        "airmenselection.cdac.in": ("Indian Air Force", "IAF", "all-india", "navy_airforce"),
        "afcat.cdac.in":         ("Indian Air Force", "IAF",  "all-india", "navy_airforce"),
    }

    async def start(self):
        for req in self.start_requests():
            yield req

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url, callback=self.parse, errback=self.on_error)

    def parse(self, response):
        self.logger.info(f"[navy_airforce] Parsing: {response.url}")
        seen = set()

        selectors = [
            "div.news a", "div.notification a", "ul.news-list a",
            "div.latest-news a", "div.announcement a",
            "a[href*='news']", "a[href*='notification']",
            "a[href*='recruitment']", "a[href*='afcat']",
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
                    item = self._make_item(title, url, response.url)
                    if item:
                        yield item
                else:
                    t_low = title.lower()
                    if any(kw in t_low for kw in [
                        "recruit", "afcat", "notification", "vacancy",
                        "result", "admit", "join", "navy", "airforce", "air force",
                        "agniveer", "sailor", "officer",
                    ]):
                        yield response.follow(
                            url,
                            callback=self.parse_detail,
                            meta={"title": title, "origin_url": response.url},
                            errback=self.on_error,
                        )

    def parse_detail(self, response):
        title = (
            response.meta.get("title")
            or response.css("h1::text, h2::text").get("")
        ).strip()

        if not title or len(title) < 5:
            return

        item = self._make_item(title, response.url, response.meta.get("origin_url", ""))
        if not item:
            return

        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        yield item

    def _make_item(self, title, url, origin_url=""):
        dedup_hash = hashlib.sha256(f"NAVYIAF_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None

        # Determine org from domain
        from urllib.parse import urlparse
        domain = urlparse(url).netloc.replace("www.", "")
        org_name, org_acronym, state_slug, board_slug = self._ORG_MAP.get(
            domain, ("Indian Navy / Air Force", "NAVY", "all-india", "navy_airforce")
        )

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = board_slug
        item["org_name"]         = org_name
        item["org_acronym"]      = org_acronym
        item["source_url"]       = url
        item["official_website"] = origin_url or url
        item["state"]            = ["All India"]
        item["state_slug"]       = state_slug
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
        self.logger.warning(f"[navy_airforce] Request failed: {failure.request.url}")
