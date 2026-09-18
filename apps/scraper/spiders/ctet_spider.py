# ============================================================
# spiders/ctet_spider.py — CTET & State TETs
# ExamUdaan | https://ctet.nic.in + State TET portals
# Run: scrapy crawl ctet
# ============================================================
import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


# All national + state teaching eligibility test portals
TET_SOURCES = [
    ("ctet",  "CTET",  "Central Board of Secondary Education",     "CTET",  "all-india",       "https://ctet.nic.in/"),
    ("uptet", "UPTET", "UP Basic Education Board",                 "UPTET", "uttar-pradesh",   "https://updeled.gov.in/"),
    ("reet",  "REET",  "Board of Secondary Education Rajasthan",   "BSER",  "rajasthan",       "https://rajeduboard.rajasthan.gov.in/"),
    ("htet",  "HTET",  "Board of School Education Haryana",        "BSEH",  "haryana",         "https://bseh.org.in/"),
    ("maha_tet", "MAHATET", "Maharashtra State Exam Council",      "MSEC",  "maharashtra",     "https://mahatet.in/"),
    ("tntet", "TNTET", "Teachers Recruitment Board Tamil Nadu",     "TRB",   "tamil-nadu",      "https://trb.tn.gov.in/"),
    ("ktet",  "KTET",  "Kerala Infrastructure and Technology",     "KITE",  "kerala",          "https://ktet.kerala.gov.in/"),
]


class CTETSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes CTET and all major State TET portals for exam notifications.
    Active only during exam cycles but covers huge aspirant count.
    """

    name = "ctet"
    default_notification_type = "recruitment"
    allowed_domains = [
        "ctet.nic.in",
        "updeled.gov.in",
        "rajeduboard.rajasthan.gov.in",
        "bseh.org.in",
        "mahatet.in",
        "trb.tn.gov.in",
        "ktet.kerala.gov.in",
    ]
    start_urls = [src[5] for src in TET_SOURCES]

    # Map URL → TET source metadata
    _URL_META = {src[5]: src for src in TET_SOURCES}

    async def start(self):
        for req in self.start_requests():
            yield req

    def start_requests(self):
        for src in TET_SOURCES:
            slug, acronym, org_name, org_acronym, state_slug, url = src
            yield scrapy.Request(
                url,
                callback=self.parse,
                meta={
                    "board_slug": slug,
                    "org_name":   org_name,
                    "org_acronym": org_acronym,
                    "state_slug":  state_slug,
                },
                errback=self.on_error,
            )

    def parse(self, response):
        meta = response.meta
        self.logger.info(f"[ctet] Parsing {meta['org_acronym']}: {response.url}")
        seen = set()

        selectors = [
            "div.notification a", "div.news a", "marquee a",
            "table a", "ul.news-list a", "div.latest a",
            "a[href*='notification']", "a[href*='result']",
            "a[href*='admit']", "a[href*='exam']", "a[href*='tet']",
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
                    item = self._make_item(title, url, meta)
                    if item:
                        yield item
                else:
                    t_low = title.lower()
                    if any(kw in t_low for kw in [
                        "notification", "tet", "ctet", "exam", "result",
                        "admit", "recruitment", "teacher", "syllabus",
                    ]):
                        yield response.follow(
                            url,
                            callback=self.parse_detail,
                            meta={**meta, "title": title},
                            errback=self.on_error,
                        )

    def parse_detail(self, response):
        meta  = response.meta
        title = (
            meta.get("title")
            or response.css("h1::text, h2::text").get("")
        ).strip()

        if not title or len(title) < 5:
            return

        item = self._make_item(title, response.url, meta)
        if not item:
            return

        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        yield item

    def _make_item(self, title, url, meta):
        dedup_hash = hashlib.sha256(f"{meta['org_acronym']}_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = meta["board_slug"]
        item["org_name"]         = meta["org_name"]
        item["org_acronym"]      = meta["org_acronym"]
        item["source_url"]       = url
        item["official_website"] = url
        item["state_slug"]       = meta["state_slug"]
        item["state"]            = [meta["state_slug"].replace("-", " ").title()]
        item["dedup_hash"]       = dedup_hash
        t = title.lower()
        if "result" in t or "merit" in t:
            item["notification_type"] = "result"
        elif "admit" in t or "call letter" in t or "hall ticket" in t:
            item["notification_type"] = "admit_card"
        elif "answer key" in t:
            item["notification_type"] = "answer_key"
        elif "syllabus" in t:
            item["notification_type"] = "syllabus"
        else:
            item["notification_type"] = "recruitment"
        return item

    def on_error(self, failure):
        self.logger.warning(f"[ctet] Request failed: {failure.request.url}")
