# ============================================================
# spiders/dmer_spider.py — Directorate of Medical Education & Research
# ExamUdaan | https://dmer.maharashtra.gov.in
# Run: scrapy crawl dmer
#
# DMER Maharashtra controls medical education in the state and
# frequently posts walk-in interviews for:
# - Medical Officer (MBBS) — contractual
# - Staff Nurse (GNM / B.Sc Nursing)
# - Pharmacist / Lab Technician
# - Radiographer / X-Ray Technician
# - Physiotherapist / Occupational Therapist
# - Administrative posts in government medical colleges
#
# Walk-in interviews are very frequent — often 1-2 per week.
# ============================================================

import scrapy
import re
import hashlib
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class DMERSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes DMER (Directorate of Medical Education & Research) Maharashtra
    for walk-in interviews and direct recruitments in government medical
    colleges, hospitals, and health institutes.

    Also covers subsidiary bodies:
    - NHM (National Health Mission) Maharashtra — separate nhm_spider exists
    - BJMC (BJ Medical College Pune)
    - Grant Medical College Mumbai
    - Nagpur Government Medical College
    """

    name            = "dmer"
    org_name        = "Directorate of Medical Education & Research Maharashtra"
    org_acronym     = "DMER"
    allowed_domains = [
        "dmer.maharashtra.gov.in",
        "bjmcpune.org",
        "gmch.gov.in",
    ]

    start_urls = [
        "https://dmer.maharashtra.gov.in/",
        "https://dmer.maharashtra.gov.in/Recruitment.aspx",
        "https://dmer.maharashtra.gov.in/WalkInInterview.aspx",
        "https://dmer.maharashtra.gov.in/Notification.aspx",
    ]

    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "ROBOTSTXT_OBEY": True,
        "DEFAULT_REQUEST_HEADERS": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-IN,en;q=0.9,mr;q=0.8",
        },
    }

    def parse(self, response):
        """
        Parse DMER portal pages.
        DMER uses .aspx pages with tabular/list notifications.
        Walk-in interviews are clearly labeled in the title.
        """
        self.logger.info(f"[dmer] Parsing: {response.url}")

        seen = set()

        # Walk-in specific and recruitment selectors
        selectors = [
            "table.table a",
            ".notification-table a",
            ".walkin-table a",
            "a[href*='.pdf']",
            "a[href*='WalkIn']",
            "a[href*='Recruitment']",
            "a[href*='notification']",
            "ul.list li a",
            ".panel-default a",
            "tr td a",
        ]

        for sel in selectors:
            for link in response.css(sel):
                title = link.css("::text").get("").strip()
                href  = link.attrib.get("href", "")
                url   = response.urljoin(href)

                if not title or len(title) < 8:
                    continue
                if not any(kw in title.lower() for kw in [
                    "walk", "recruitment", "vacancy", "appointment",
                    "medical officer", "nurse", "pharmacist", "technician",
                    "radiographer", "physiotherapist", "laboratory",
                    "notification", "interview", "apply",
                    "भरती", "जाहिरात", "वॉक-इन", "मुलाखत",
                ]):
                    continue
                if self.should_skip_link(title, url):
                    continue
                if url in seen:
                    continue

                seen.add(url)

                if url.lower().endswith(".pdf"):
                    item = self._make_item(title, url)
                    item["notification_pdf_url"] = url
                    # Most DMER PDFs are walk-in notices
                    if any(kw in title.lower() for kw in ["walk", "walkin", "walk-in", "वॉक"]):
                        item["is_walk_in"] = True
                    yield item
                else:
                    yield response.follow(
                        url,
                        callback=self.parse_detail,
                        meta={"title": title},
                        errback=self.on_error,
                    )

    def parse_detail(self, response):
        """Extract structured data from a DMER notification page."""
        title = (
            response.meta.get("title")
            or response.css("h1::text, h2::text, .page-title::text").get("")
        ).strip()

        if not title or len(title) < 5:
            return

        dedup_hash = hashlib.sha256(f"DMER_{response.url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[response.url]):
            return

        item = self._make_item(title, response.url, dedup_hash)
        page_text = " ".join(response.css("*::text").getall())

        # PDF
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        # Walk-in date (for DMER, exam_date is the walk-in interview date)
        is_walk_in = any(kw in title.lower() for kw in ["walk-in", "walk in", "walkin", "वॉक"])
        if is_walk_in:
            item["is_walk_in"] = True
            # Try to find "Date: DD/MM/YYYY" or "Walk-in Date: ..."
            m = re.search(
                r"(?:walk.in\s+date|interview\s+date|date)[:\s]+(\d{1,2}[/\-]\d{1,2}[/\-]\d{4})",
                page_text, re.IGNORECASE
            )
            if m:
                parts = re.split(r"[/\-]", m.group(1))
                if len(parts) == 3:
                    item["exam_date"] = f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"

        # Vacancy count
        item["total_vacancies"] = self._extract_number(page_text)

        # Apply end date
        item["apply_end_date"] = self._extract_date(page_text)

        # Qualification hints
        qual = []
        if "mbbs" in page_text.lower():
            qual.append("MBBS")
        if re.search(r"b\.?sc\.? nurs", page_text, re.IGNORECASE):
            qual.append("B.Sc Nursing")
        if "gnm" in page_text.lower():
            qual.append("GNM")
        if re.search(r"b\.pharm", page_text, re.IGNORECASE):
            qual.append("B.Pharm")
        if qual:
            item["qualifications"] = {"mandatory": qual}

        yield item

    def _make_item(self, title, url, dedup_hash=None):
        item = ExamPost()
        item["title"]             = title
        item["board_slug"]        = "dmer"
        item["org_name"]          = self.org_name
        item["org_acronym"]       = self.org_acronym
        item["source_url"]        = url
        item["official_website"]  = "https://dmer.maharashtra.gov.in/"
        item["state"]             = ["Maharashtra"]
        item["notification_type"] = self._infer_type(title)
        if dedup_hash:
            item["dedup_hash"] = dedup_hash
        return item

    def _infer_type(self, title):
        t = title.lower()
        if any(k in t for k in ["result", "merit list", "selected", "निकाल"]):
            return "result"
        if any(k in t for k in ["admit card", "call letter", "hall ticket"]):
            return "admit_card"
        if "answer key" in t:
            return "answer_key"
        if "syllabus" in t:
            return "syllabus"
        return "recruitment"

    def _extract_number(self, text):
        for kw in ["posts", "vacancies", "vacancy", "जागा", "पदे"]:
            m = re.search(rf"(\d[\d,]+)\s*{kw}|{kw}[:\s]+(\d[\d,]+)", text, re.IGNORECASE)
            if m:
                return int((m.group(1) or m.group(2)).replace(",", ""))
        return None

    def _extract_date(self, text):
        months = {
            "january": 1, "february": 2, "march": 3, "april": 4,
            "may": 5, "june": 6, "july": 7, "august": 8,
            "september": 9, "october": 10, "november": 11, "december": 12,
        }
        for kw in ["last date", "closing date", "apply before"]:
            idx = text.lower().find(kw)
            if idx == -1:
                continue
            window = text[idx: idx + 200]
            m = re.search(
                r"(\d{1,2})\s+(January|February|March|April|May|June|July|"
                r"August|September|October|November|December)\s+(\d{4})",
                window, re.IGNORECASE
            )
            if m:
                mon = months.get(m.group(2).lower(), 0)
                if mon:
                    return f"{m.group(3)}-{mon:02d}-{int(m.group(1)):02d}"
            m2 = re.search(r"(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})", window)
            if m2:
                return f"{m2.group(3)}-{int(m2.group(2)):02d}-{int(m2.group(1)):02d}"
        return None

    def on_error(self, failure):
        self.logger.warning(f"[dmer] Request failed: {failure.request.url}")
