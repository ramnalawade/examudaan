# ============================================================
# spiders/maha_municipalities_spider.py
# ExamUdaan | Maharashtra Municipal Corporations Recruitment
# Run: scrapy crawl maha_municipalities
#
# Covers all major Maharashtra municipal corporations beyond BMC/PMC/TMC:
#   - NMC (Nashik Municipal Corporation)
#   - CSMC / AMC (Chhatrapati Sambhajinagar — Aurangabad)
#   - NMC Nagpur (Nagpur Municipal Corporation)
#   - SMC (Solapur Municipal Corporation)
#   - KMC (Kolhapur Municipal Corporation)
#   - NMMC (Navi Mumbai Municipal Corporation)
#   - PCMC (Pimpri-Chinchwad Municipal Corporation) — already in pmc spider?
#   - VMC (Vasai-Virar City Municipal Corporation)
#   - MBMC (Mira-Bhayandar Municipal Corporation)
#   - UMC (Ulhasnagar Municipal Corporation)
#   - KDMC (Kalyan-Dombivli Municipal Corporation)
#   - AMRAVATI Municipal Corporation
#   - LATUR Municipal Corporation
#   - JALGAON Municipal Corporation
#   - DHULE Municipal Corporation
#   - MAHANAGAR PALIKA Nanded
# ============================================================

import scrapy
import hashlib
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


MUNI_SOURCES = [
    # Nashik Municipal Corporation
    ("nmc_nashik",    "Nashik Municipal Corporation",                "NMC",    "Maharashtra",
     "https://www.nmc.gov.in/en/pages/recruitment", []),

    # Chhatrapati Sambhajinagar (Aurangabad) Municipal Corporation
    ("csmc",          "Chhatrapati Sambhajinagar Municipal Corporation", "CSMC", "Maharashtra",
     "https://www.aurangabadmahanagar.com/en/pages/recruitment", []),

    # Nagpur Municipal Corporation
    ("nmc_nagpur",    "Nagpur Municipal Corporation",                "NMCNAGPUR", "Maharashtra",
     "https://www.nmcnagpur.gov.in/jobs", [
         "https://www.nmcnagpur.gov.in/tender",
     ]),

    # Solapur Municipal Corporation
    ("smc_solapur",   "Solapur Municipal Corporation",              "SMC",    "Maharashtra",
     "https://www.smc.gov.in/en/pages/recruitment", []),

    # Kolhapur Municipal Corporation
    ("kmc_kolhapur",  "Kolhapur Municipal Corporation",             "KMC",    "Maharashtra",
     "https://www.kmc.gov.in/en/pages/careers", []),

    # Navi Mumbai Municipal Corporation
    ("nmmc",          "Navi Mumbai Municipal Corporation",          "NMMC",   "Maharashtra",
     "https://www.nmmc.gov.in/index.aspx?pgID=recruitment", []),

    # Pimpri-Chinchwad Municipal Corporation
    ("pcmc",          "Pimpri-Chinchwad Municipal Corporation",     "PCMC",   "Maharashtra",
     "https://pcmcjobs.in/", [
         "https://www.pcmcindia.gov.in/marathi/job.php",
     ]),

    # Vasai-Virar City Municipal Corporation
    ("vvcmc",         "Vasai-Virar City Municipal Corporation",     "VVCMC",  "Maharashtra",
     "https://www.vvcmc.in/en/pages/tender-notice", []),

    # Mira-Bhayandar Municipal Corporation
    ("mbmc",          "Mira-Bhayandar Municipal Corporation",       "MBMC",   "Maharashtra",
     "https://www.mbmc.gov.in/en/pages/recruitment", []),

    # Kalyan-Dombivli Municipal Corporation
    ("kdmc",          "Kalyan-Dombivli Municipal Corporation",      "KDMC",   "Maharashtra",
     "https://www.kdmc.gov.in/pages/recruitment.aspx", []),

    # Ulhasnagar Municipal Corporation
    ("umc",           "Ulhasnagar Municipal Corporation",           "UMC",    "Maharashtra",
     "https://www.ulhasnagarmc.org/Recruitment.aspx", []),

    # Amravati Municipal Corporation
    ("amc_amravati",  "Amravati Municipal Corporation",             "AMCAMRAVATI", "Maharashtra",
     "https://www.amravatimunicipalcorporation.gov.in/recruitment", []),

    # Latur Municipal Corporation
    ("lmc",           "Latur Municipal Corporation",                "LMC",    "Maharashtra",
     "https://www.laturmahanagar.com/recruitment", []),

    # Nanded Municipal Corporation
    ("nanded_mc",     "Nanded-Waghala City Municipal Corporation",  "NWCMC",  "Maharashtra",
     "https://www.nwcmc.gov.in/recruitment", []),

    # Jalgaon Municipal Corporation
    ("jmc",           "Jalgaon Municipal Corporation",              "JMC",    "Maharashtra",
     "https://jalgaonmc.gov.in/recruitment", []),
]

MUNI_KEYWORDS = [
    "recruitment", "vacancy", "bharti", "notification", "apply",
    "advertisement", "advt", "post", "clerk", "engineer", "driver",
    "sweeper", "gardener", "assistant", "officer", "nurse",
    "pharmacist", "result", "admit", "interview", "walk-in",
    "safai", "pani", "aarogya", "job",
]


class MahaMunicipalitiesSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes 15 Maharashtra municipal corporations for recruitment.
    These corporations post regular vacancies for engineers, nurses,
    clerks, safai workers etc. — popular in Tier-2 Maharashtra cities.
    """

    name = "maha_municipalities"
    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "RANDOMIZE_DOWNLOAD_DELAY": True,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
    }

    allowed_domains = list({
        url.split("//")[-1].split("/")[0].replace("www.", "")
        for _, _, _, _, url, _ in MUNI_SOURCES
    })

    def start_requests(self):
        for board_slug, org_name, acronym, state, url, extras in MUNI_SOURCES:
            meta = {
                "board_slug":  board_slug,
                "org_name":    org_name,
                "org_acronym": acronym,
                "state":       state,
            }
            yield scrapy.Request(url, callback=self.parse, meta=meta, errback=self.on_error)
            for extra in extras:
                yield scrapy.Request(extra, callback=self.parse, meta=meta, errback=self.on_error)

    def parse(self, response):
        meta = response.meta
        self.logger.info(f"[maha_municipalities] {meta['org_acronym']}: {response.url}")
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
                    item["notification_pdf_url"] = url
                    yield item
            elif any(kw in t_low for kw in MUNI_KEYWORDS):
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
        m = re.search(r"(\d[\d,]+)\s*(posts?|vacancies|vacancy|jaga|seats?)", text, re.IGNORECASE)
        if m:
            item["total_vacancies"] = int(m.group(1).replace(",", ""))

        yield item

    def _make(self, title, url, meta):
        acronym = meta["org_acronym"]
        dedup_hash = hashlib.sha256(f"{acronym}_{url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[url]):
            return None

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = meta["board_slug"]
        item["org_name"]         = meta["org_name"]
        item["org_acronym"]      = acronym
        item["source_url"]       = url
        item["official_website"] = url
        item["state"]            = [meta["state"]]
        item["dedup_hash"]       = dedup_hash

        t = title.lower()
        if any(k in t for k in ["result", "merit list", "निकाल", "final list"]):
            item["notification_type"] = "result"
        elif any(k in t for k in ["admit card", "call letter", "प्रवेशपत्र"]):
            item["notification_type"] = "admit_card"
        elif any(k in t for k in ["answer key", "answer-key"]):
            item["notification_type"] = "answer_key"
        elif any(k in t for k in ["syllabus", "exam pattern"]):
            item["notification_type"] = "syllabus"
        else:
            item["notification_type"] = "recruitment"

        return item

    def on_error(self, failure):
        self.logger.warning(f"[maha_municipalities] Error: {failure.request.url} — {failure.value}")
