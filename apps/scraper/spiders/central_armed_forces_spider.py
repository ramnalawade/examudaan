# ============================================================
# spiders/central_armed_forces_spider.py
# ExamUdaan | Central Armed Forces Recruitment
# Run: scrapy crawl central_armed_forces
#
# Covers:
#   - India Post GDS (indiapostgdsonline.gov.in) — 40,000+ posts/yr
#   - Indian Coast Guard (joinindiancoastguard.cdac.in)
#   - CRPF (crpf.gov.in)
#   - BSF (bsf.nic.in)
#   - CISF (cisf.gov.in)
#   - SSB (ssb.nic.in) — Sashastra Seema Bal
#   - ITBP (itbpolice.nic.in) — Indo-Tibetan Border Police
#   - CAPF (dopt.gov.in/capf) — Central Armed Police Forces
#   - Assam Rifles (assamrifles.gov.in)
#   - Delhi Police (delhipolice.gov.in)
#   - CBI (cbi.gov.in)
#   - Narcotics Control Bureau (narcoticsindia.nic.in)
# ============================================================

import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


# Registry: (board_slug, org_name, acronym, state, url, extra_urls)
CAF_SOURCES = [
    # India Post — massive GDS hiring every year
    ("india_post_gds",   "India Post GDS",                 "INDIAPOST",  "Central",
     "https://indiapostgdsonline.gov.in/", []),

    # Indian Coast Guard
    ("coast_guard",      "Indian Coast Guard",             "ICG",        "Central",
     "https://joinindiancoastguard.cdac.in/cgept/", [
         "https://joinindiancoastguard.cdac.in/cgept/NewNotification.aspx"
     ]),

    # CRPF
    ("crpf",             "Central Reserve Police Force",   "CRPF",       "Central",
     "https://crpf.gov.in/Recruitment", [
         "https://crpf.gov.in/Recruitment/Constable-Tradesman.htm",
         "https://crpf.gov.in/Recruitment/Head-Constable.htm",
     ]),

    # BSF
    ("bsf",              "Border Security Force",          "BSF",        "Central",
     "https://bsf.nic.in/Recruitment.html", []),

    # CISF
    ("cisf",             "Central Industrial Security Force", "CISF",    "Central",
     "https://cisfrectt.cisf.gov.in/", [
         "https://cisf.gov.in/recruitment",
     ]),

    # SSB — Sashastra Seema Bal
    ("ssb",              "Sashastra Seema Bal",            "SSB",        "Central",
     "https://ssb.nic.in/recruitment", []),

    # ITBP
    ("itbp",             "Indo-Tibetan Border Police",     "ITBP",       "Central",
     "https://itbpolice.nic.in/recruitment", [
         "https://itbpolice.nic.in/recruitment/constable-recruitment.htm",
     ]),

    # Assam Rifles
    ("assam_rifles",     "Assam Rifles",                   "AR",         "Central",
     "https://assamrifles.gov.in/Recruitment", []),

    # Delhi Police
    ("delhi_police",     "Delhi Police",                   "DELHIPOLICE","Delhi",
     "https://www.delhipolice.gov.in/pages/recruitment", []),

    # CBI
    ("cbi",              "Central Bureau of Investigation","CBI",        "Central",
     "https://cbi.gov.in/recruitment", []),

    # Narcotics Control Bureau
    ("ncb",              "Narcotics Control Bureau",       "NCB",        "Central",
     "https://narcoticsindia.nic.in/Recruitment.aspx", []),
]

CAF_KEYWORDS = [
    "recruitment", "vacancy", "notification", "apply", "advertisement",
    "bharti", "constable", "sub-inspector", "inspector", "gds",
    "postman", "mail guard", "head constable", "tradesman",
    "result", "admit", "answer key", "syllabus", "call letter",
]


class CentralArmedForcesSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Covers India Post GDS + all Central Armed Police Forces + Delhi Police.
    These portals together account for 60,000+ vacancies per year.
    """

    name = "central_armed_forces"
    custom_settings = {
        "DOWNLOAD_DELAY": 2,        # be polite to .gov.in servers
        "RANDOMIZE_DOWNLOAD_DELAY": True,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 2,
    }

    # Build allowed_domains from all source URLs
    allowed_domains = list({
        url.split("//")[-1].split("/")[0].replace("www.", "")
        for _, _, _, _, url, _ in CAF_SOURCES
    } | {
        extra.split("//")[-1].split("/")[0].replace("www.", "")
        for _, _, _, _, _, extras in CAF_SOURCES
        for extra in extras
    })

    def start_requests(self):
        for board_slug, org_name, acronym, state, url, extra_urls in CAF_SOURCES:
            meta = {
                "board_slug": board_slug,
                "org_name":   org_name,
                "org_acronym": acronym,
                "state":      state,
            }
            yield scrapy.Request(url, callback=self.parse, meta=meta, errback=self.on_error)
            for extra in extra_urls:
                yield scrapy.Request(extra, callback=self.parse, meta=meta, errback=self.on_error)

    def parse(self, response):
        meta = response.meta
        self.logger.info(f"[{self.name}] {meta['org_acronym']}: {response.url}")
        seen = set()

        for link in response.css("a"):
            href  = link.attrib.get("href", "")
            title = (link.xpath("string(.)").get() or "").strip()
            url   = response.urljoin(href)

            if not title or len(title) < 6 or url in seen:
                continue
            if href.endswith((".jpg", ".png", ".gif", ".ico", ".js", ".css")):
                continue

            seen.add(url)
            t_low = title.lower()

            if url.lower().endswith(".pdf"):
                # Direct PDF notification
                item = self._make(title, url, meta)
                if item:
                    item["notification_pdf_url"] = url
                    yield item
            elif any(kw in t_low for kw in CAF_KEYWORDS):
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
        if not title or len(title) < 6:
            return

        item = self._make(title, response.url, meta)
        if not item:
            return

        # Grab first PDF
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        # Extract vacancy count + closing date
        text = " ".join(response.css("*::text").getall())
        m = re.search(r"(\d[\d,]+)\s*(posts?|vacancies|vacancy|seats?)", text, re.IGNORECASE)
        if m:
            item["total_vacancies"] = int(m.group(1).replace(",", ""))

        # Apply link
        apply = response.css("a:contains('Apply Online')::attr(href), a:contains('Apply Now')::attr(href)").get()
        if apply:
            item["apply_link"] = response.urljoin(apply)

        yield item

    def _make(self, title, url, meta):
        acronym = meta["org_acronym"]
        dedup_hash = hashlib.sha256(f"{acronym}_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None

        item = ExamPost()
        item["title"]             = title
        item["board_slug"]        = meta["board_slug"]
        item["org_name"]          = meta["org_name"]
        item["org_acronym"]       = acronym
        item["source_url"]        = url
        item["official_website"]  = url
        item["state"]             = [meta["state"]]
        item["dedup_hash"]        = dedup_hash

        # Classify notification type
        t = title.lower()
        if any(k in t for k in ["result", "merit list", "final result", "selected"]):
            item["notification_type"] = "result"
        elif any(k in t for k in ["admit card", "call letter", "hall ticket"]):
            item["notification_type"] = "admit_card"
        elif any(k in t for k in ["answer key", "answer-key"]):
            item["notification_type"] = "answer_key"
        elif any(k in t for k in ["syllabus", "exam pattern"]):
            item["notification_type"] = "syllabus"
        else:
            item["notification_type"] = "recruitment"

        return item

    def on_error(self, failure):
        self.logger.warning(f"[{self.name}] Error: {failure.request.url} — {failure.value}")
