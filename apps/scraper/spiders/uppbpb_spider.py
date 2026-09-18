# ============================================================
# spiders/uppbpb_spider.py — UP Police Recruitment Board
# ExamUdaan | https://uppbpb.gov.in
# Run: scrapy crawl uppbpb
# ============================================================
import scrapy
import hashlib
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


EXAM_KEYWORDS = [
    "notification", "recruitment", "vacancy", "result", "admit", "answer",
    "syllabus", "exam", "advt", "advertisement", "bharti", "post", "apply",
    "application", "constable", "si", "sub inspector", "head constable",
]


class UPPBPBSpider(DuplicateStopMixin, scrapy.Spider):
    """
    UP Police Recruitment Board — one of India's highest-volume recruiters.
    Targets the What's New / Latest Notifications section.
    """

    name            = "uppbpb"
    org_name        = "UP Police Recruitment & Promotion Board"
    org_acronym     = "UPPBPB"
    state_name      = "Uttar Pradesh"
    default_notification_type = "recruitment"
    allowed_domains = ["uppbpb.gov.in"]
    start_urls      = ["https://uppbpb.gov.in/"]

    async def start(self):
        for req in self.start_requests():
            yield req

    def start_requests(self):
        yield scrapy.Request(
            "https://uppbpb.gov.in/",
            callback=self.parse,
            errback=self.on_error,
        )

    def parse(self, response):
        self.logger.info(f"[uppbpb] Parsing: {response.url}")
        seen = set()

        # Target specific notification containers if present
        selectors = [
            "div.marquee a", "div.scroll a", "marquee a",
            "div.latest-news a", "ul.news-list a", "div.whats-new a",
            "table a", "div.content a", "div.main-content a",
            "a[href*='notice']", "a[href*='result']", "a[href*='advt']",
            "a[href$='.pdf']",
        ]

        for sel in selectors:
            for link in response.css(sel):
                href  = link.attrib.get("href", "")
                title = (link.css("::text").get() or link.xpath("string(.)").get() or "").strip()
                url   = response.urljoin(href)

                if not title or len(title) < 6 or url in seen:
                    continue
                if href.endswith((".jpg", ".png", ".gif", ".ico", ".js", ".css")):
                    continue

                seen.add(url)
                t_low = title.lower()

                if url.lower().endswith(".pdf"):
                    yield self._make_item(title, url)
                elif any(kw in t_low for kw in EXAM_KEYWORDS):
                    yield response.follow(
                        url,
                        callback=self.parse_detail,
                        meta={"title": title},
                        errback=self.on_error,
                    )

    def parse_detail(self, response):
        title = (
            response.meta.get("title")
            or response.css("h1::text, h2::text, title::text").get("")
        ).strip()

        if not title or len(title) < 6:
            return

        item = self._make_item(title, response.url)

        # Grab first PDF link
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        # Extract vacancy number and last date
        text = " ".join(response.css("*::text").getall())
        import re
        m = re.search(r"(\d[\d,]+)\s*(vacancies|posts?|vacancy|seat)", text, re.IGNORECASE)
        if m:
            item["total_vacancies"] = int(m.group(1).replace(",", ""))
        m2 = re.search(r"last\s+date[:\s]+(\d{1,2}[/-]\d{1,2}[/-]\d{4})", text, re.IGNORECASE)
        if m2:
            item["apply_end_date"] = m2.group(1)

        yield item

    def _make_item(self, title, url):
        dedup_hash = hashlib.sha256(f"UPPBPB_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = "uppbpb"
        item["org_name"]         = self.org_name
        item["org_acronym"]      = self.org_acronym
        item["source_url"]       = url
        item["official_website"] = "https://uppbpb.gov.in"
        item["state"]            = ["Uttar Pradesh"]
        item["state_slug"]       = "uttar-pradesh"
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
        self.logger.warning(f"[uppbpb] Request failed: {failure.request.url}")
