# ============================================================
# spiders/state_psc_base.py — Shared base class for State PSC spiders
# ExamUdaan | Inherit this to create a new state PSC spider in ~20 lines
#
# Usage:
#   class HPSCSpider(StatePSCSpider):
#       name         = "hpsc"
#       org_name     = "Haryana Public Service Commission"
#       org_acronym  = "HPSC"
#       state_name   = "Haryana"
#       allowed_domains = ["hpsc.gov.in"]
#       start_urls   = ["https://hpsc.gov.in/"]
# ============================================================

import hashlib
import scrapy
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin

# Keywords that indicate a link is a recruitment/exam notification
EXAM_KEYWORDS = [
    "notification", "recruitment", "vacancy", "result", "admit",
    "answer", "syllabus", "exam", "advt", "advertisement", "bharti",
    "post", "apply", "application", "selection", "interview",
]


class StatePSCSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Generic base class for state public service commission spiders.
    
    Subclass this and set: name, org_name, org_acronym, state_name,
    allowed_domains, start_urls.
    
    The base class handles:
      - Link discovery (PDF + HTML notifications)
      - Deduplication
      - ExamPost item construction
      - Date/vacancy extraction
    """

    # Subclasses MUST override these
    org_name    = ""       # e.g. "Haryana Public Service Commission"
    org_acronym = ""       # e.g. "HPSC"
    state_name  = ""       # e.g. "Haryana"

    def parse(self, response):
        """Discover notification links on the listing page."""
        self.logger.info(f"[{self.name}] Parsing: {response.url}")

        seen = set()
        for a in response.css("a"):
            title = (a.css("::text").get() or "").strip()
            href  = a.attrib.get("href", "")
            url   = response.urljoin(href)

            # Skip short, empty, or irrelevant links
            if not title or len(title) < 4 or url in seen:
                continue
            if self.should_skip_link(title, url):
                continue

            seen.add(url)

            # Direct PDF — yield immediately without following
            if url.lower().endswith(".pdf"):
                item = self._make_item(title, url)
                item["notification_pdf_url"] = url
                yield item
                continue

            # HTML page with exam keywords — follow to detail page
            t_low = title.lower()
            u_low = url.lower()
            if any(kw in t_low or kw in u_low for kw in EXAM_KEYWORDS):
                yield response.follow(
                    url,
                    callback=self.parse_detail,
                    meta={"title": title},
                )

    def parse_detail(self, response):
        """Extract details from an individual notification page."""
        title = (
            response.meta.get("title")
            or response.css("h1::text, h2::text, title::text").get("")
        ).strip()

        if not title or len(title) < 4:
            return

        dedup_hash = hashlib.sha256(
            f"{self.org_acronym}_{response.url}".encode()
        ).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[response.url]):
            return

        item = self._make_item(title, response.url, dedup_hash=dedup_hash)

        # Grab first PDF link on page
        pdf = response.css("a[href$='.pdf']::attr(href)").get()
        if pdf:
            item["notification_pdf_url"] = response.urljoin(pdf)

        # Try to extract vacancy count and closing date from page text
        page_text = " ".join(response.css("*::text").getall())
        item["total_vacancies"] = self._extract_number(
            page_text, ["vacancies", "posts", "vacancy", "post"]
        )
        item["apply_end_date"] = self._extract_date(
            page_text, ["last date", "closing date", "apply before", "apply by"]
        )

        yield item

    def _make_item(self, title, url, dedup_hash=None):
        """Build an ExamPost with org fields pre-filled."""
        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = self.name
        item["org_name"]         = self.org_name
        item["org_acronym"]      = self.org_acronym
        item["source_url"]       = url
        item["official_website"] = self.start_urls[0] if self.start_urls else ""
        item["state"]            = [self.state_name]
        item["notification_type"] = self._infer_type(title)
        if dedup_hash:
            item["dedup_hash"] = dedup_hash
        return item

    def _infer_type(self, title):
        t = title.lower()
        if any(k in t for k in ["result", "merit list", "final result"]):
            return "result"
        if any(k in t for k in ["admit card", "call letter", "hall ticket"]):
            return "admit_card"
        if any(k in t for k in ["answer key", "answer-key"]):
            return "answer_key"
        if any(k in t for k in ["syllabus", "exam pattern"]):
            return "syllabus"
        return "recruitment"

    def _extract_number(self, text, keywords):
        import re
        for kw in keywords:
            m = re.search(
                rf"(\d[\d,]+)\s*{kw}|{kw}[:\s]+(\d[\d,]+)",
                text, re.IGNORECASE
            )
            if m:
                return int((m.group(1) or m.group(2)).replace(",", ""))
        return None

    def _extract_date(self, text, keywords):
        import re
        months = {
            "january":1,"february":2,"march":3,"april":4,"may":5,"june":6,
            "july":7,"august":8,"september":9,"october":10,"november":11,"december":12,
        }
        for kw in keywords:
            idx = text.lower().find(kw)
            if idx == -1:
                continue
            window = text[idx:idx + 200]
            m = re.search(
                r"(\d{1,2})\s+(January|February|March|April|May|June|July|"
                r"August|September|October|November|December)\s+(\d{4})",
                window, re.IGNORECASE
            )
            if m:
                mon = months.get(m.group(2).lower(), 0)
                if mon:
                    return f"{m.group(3)}-{mon:02d}-{int(m.group(1)):02d}"
            # Try numeric date
            m2 = re.search(r"(\d{1,2})[/-](\d{1,2})[/-](\d{4})", window)
            if m2:
                return f"{m2.group(3)}-{int(m2.group(2)):02d}-{int(m2.group(1)):02d}"
        return None
