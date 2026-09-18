# ============================================================
# spiders/aiims_central_spider.py — AIIMS Exams Central Portal
# ExamUdaan | https://aiimsexams.ac.in
# Run: scrapy crawl aiims_central
#
# Also covers PGIMER, JIPMER, and other medical institutes.
# ============================================================
import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


MEDICAL_SOURCES = [
    ("aiims_central", "All India Institute of Medical Sciences",           "AIIMS",   "all-india", "https://aiimsexams.ac.in/"),
    ("pgimer",        "Post Graduate Institute of Medical Education",      "PGIMER",  "all-india", "https://pgimer.edu.in/PGIMER_PORTAL/PgimerPortal/recruitementNotification.jsp"),
    ("jipmer",        "Jawaharlal Institute of Postgraduate Medical Edu",  "JIPMER",  "all-india", "https://jipmer.edu.in/recruitment"),
    ("esic",          "Employees State Insurance Corporation",             "ESIC",    "all-india", "https://www.esic.nic.in/recruitment"),
    ("health_delhi",  "Delhi AIIMS Nursing & Allied",                     "AIIMSDL", "delhi",     "https://www.aiims.edu/en/departments-and-centres/nursing-section.html"),
]


class AiimsSpider(DuplicateStopMixin, scrapy.Spider):
    """
    AIIMS Central Exams portal + PGIMER, JIPMER, ESIC medical portals.
    All medical/nursing/paramedic recruitments in one spider.
    """

    name = "aiims_central"
    default_notification_type = "recruitment"
    allowed_domains = [
        "aiimsexams.ac.in",
        "pgimer.edu.in",
        "jipmer.edu.in",
        "esic.nic.in",
        "aiims.edu",
    ]

    async def start(self):
        for req in self.start_requests():
            yield req

    def start_requests(self):
        for board_slug, org_name, org_acronym, state_slug, url in MEDICAL_SOURCES:
            yield scrapy.Request(
                url,
                callback=self.parse,
                meta={
                    "board_slug":  board_slug,
                    "org_name":    org_name,
                    "org_acronym": org_acronym,
                    "state_slug":  state_slug,
                },
                errback=self.on_error,
            )

    def parse(self, response):
        meta = response.meta
        self.logger.info(f"[aiims_central] Parsing {meta['org_acronym']}: {response.url}")
        seen = set()

        selectors = [
            "div.notification a", "div.news a", "marquee a",
            "table a", "ul.news-list a", "div.latest a",
            "a[href*='notification']", "a[href*='result']",
            "a[href*='recruit']", "a[href*='exam']",
            "a[href*='admit']", "a[href$='.pdf']",
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
                        "recruit", "notification", "vacancy", "exam",
                        "result", "admit", "aiims", "nursing", "medical",
                        "paramedic", "technician", "staff",
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

        text = " ".join(response.css("*::text").getall())
        m = re.search(r"(\d[\d,]+)\s*(posts?|vacancies|vacancy)", text, re.IGNORECASE)
        if m:
            item["total_vacancies"] = int(m.group(1).replace(",", ""))

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
        item["state"]            = ["All India"]
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
        self.logger.warning(f"[aiims_central] Request failed: {failure.request.url}")
