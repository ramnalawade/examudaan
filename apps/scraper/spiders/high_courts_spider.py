# ============================================================
# spiders/high_courts_spider.py — Multiple High Court Recruitment
# ExamUdaan | Covers major state High Courts career portals
# Run: scrapy crawl high_courts
#
# High Courts often hire directly for:
#  - Stenographer, Assistant, Junior Assistant
#  - Law Clerk, Law Officer
#  - Peon / Group D
# These are very popular among local aspirants.
# ============================================================

import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


# ---------------------------------------------------------------
# High Court sources registry
# Format: (board_slug, org_name, acronym, state_slug, url)
# ---------------------------------------------------------------
HC_SOURCES = [
    ("patna_hc",   "Patna High Court",              "PATNAHC",  "bihar",             "https://patnahighcourt.gov.in/Recruitments"),
    ("allahabad_hc","Allahabad High Court",          "ALLAHABADHC","uttar-pradesh",   "https://www.allahabadhighcourt.in/recruitment/index.html"),
    ("bombay_hc",  "Bombay High Court",              "BOMBAYHC", "maharashtra",       "https://bombayhighcourt.nic.in/recruitment.php"),
    ("delhi_hc",   "Delhi High Court",               "DELHIHC",  "delhi",             "https://www.delhihighcourt.nic.in/recruitmentinformation.aspx"),
    ("madras_hc",  "Madras High Court",              "MADRASHC", "tamil-nadu",        "https://www.hcmadras.tn.nic.in/recruitment.html"),
    ("calcutta_hc","Calcutta High Court",            "CALCHC",   "west-bengal",       "https://calcuttahighcourt.gov.in/Recruitments"),
    ("gujarat_hc", "Gujarat High Court",             "GUJHC",    "gujarat",           "https://gujarathighcourt.nic.in/recruitment.php"),
    ("mp_hc",      "Madhya Pradesh High Court",      "MPHC",     "madhya-pradesh",    "https://mphc.gov.in/recruitment"),
    ("rajasthan_hc","Rajasthan High Court",          "RJHC",     "rajasthan",         "https://hcraj.nic.in/hcraj/recruitment.php"),
    ("punjab_hc",  "Punjab & Haryana High Court",    "PHHC",     "punjab",            "https://sssc.gov.in/"),   # SSSC handles P&H HC clerks
    ("kerala_hc",  "Kerala High Court",              "KERHC",    "kerala",            "https://highcourt.kerala.gov.in/recruitment"),
    ("telangana_hc","Telangana High Court",          "TSHC",     "telangana",         "https://hc.ts.nic.in/Recruitments.aspx"),
    ("jharkhand_hc","Jharkhand High Court",          "JHKHC",    "jharkhand",         "https://jharkhandhighcourt.nic.in/recruitments"),
]

HC_KEYWORDS = [
    "recruitment", "vacancy", "advertisement", "advt", "post",
    "notification", "result", "admit", "answer key", "syllabus",
    "stenographer", "assistant", "clerk", "junior", "peon", "driver",
    "law clerk", "staff", "apply",
]


class HighCourtsSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Covers 13 major High Courts recruitment pages.
    High Court jobs are highly sought after — good state-level coverage.
    """

    name = "high_courts"
    default_notification_type = "recruitment"

    # Dynamically build allowed_domains from HC_SOURCES
    allowed_domains = list({
        url.split("//")[-1].split("/")[0].replace("www.", "")
        for _, _, _, _, url in HC_SOURCES
    })

    async def start(self):
        for req in self.start_requests():
            yield req

    def start_requests(self):
        for board_slug, org_name, acronym, state_slug, url in HC_SOURCES:
            yield scrapy.Request(
                url,
                callback=self.parse,
                meta={
                    "board_slug":  board_slug,
                    "org_name":    org_name,
                    "org_acronym": acronym,
                    "state_slug":  state_slug,
                },
                errback=self.on_error,
            )

    def parse(self, response):
        meta = response.meta
        self.logger.info(f"[high_courts] Parsing {meta['org_acronym']}: {response.url}")
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
                item = self._make(title, url, meta)
                if item:
                    yield item
            elif any(kw in t_low for kw in HC_KEYWORDS):
                yield response.follow(
                    url,
                    callback=self.parse_detail,
                    meta=dict(meta, title=title),
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
        item = self._make(title, response.url, meta)
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

    def _make(self, title, url, meta):
        acronym = meta["org_acronym"]
        dedup_hash = hashlib.sha256(f"{acronym}_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None
        state_slug = meta["state_slug"]
        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = meta["board_slug"]
        item["org_name"]         = meta["org_name"]
        item["org_acronym"]      = acronym
        item["source_url"]       = url
        item["official_website"] = url
        item["state_slug"]       = state_slug
        item["state"]            = [state_slug.replace("-", " ").title()]
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
        self.logger.warning(f"[high_courts] Error: {failure.request.url}")
