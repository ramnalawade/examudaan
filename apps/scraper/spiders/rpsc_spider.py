# ============================================================
# spiders/rpsc_spider.py — Rajasthan Public Service Commission
# ExamUdaan | Scrapes https://rpsc.rajasthan.gov.in
# Run: scrapy crawl rpsc
# ============================================================

import scrapy
import hashlib
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


class RPSCSpider(DuplicateStopMixin, scrapy.Spider):
    name = "rpsc"
    allowed_domains = ["rpsc.rajasthan.gov.in"]
    start_urls = [
        "https://rpsc.rajasthan.gov.in/announcements",
        "https://rpsc.rajasthan.gov.in/CurrentVacancyList",
        "https://rpsc.rajasthan.gov.in/result",
    ]

    def parse(self, response):
        """Parse RPSC announcements/vacancies listing page."""
        self.logger.info(f"[rpsc] Parsing: {response.url}")

        # RPSC uses tables and lists for notifications
        rows = response.css(
            "table.recruitment-table tr, "
            "ul.notification-list li, "
            "div.announcements-list a, "
            "div.content a"
        )

        for row in rows:
            link  = row.css("a")
            if not link:
                link = [row] if row.root.tag == "a" else []

            for a in link:
                title = a.css("::text").get("").strip()
                href  = a.attrib.get("href", "")
                url   = response.urljoin(href)

                if not title or len(title) < 5:
                    continue
                if self.should_skip_link(title, url):
                    continue

                # Skip PDFs in this pass (pipeline handles direct PDF upsert)
                if url.endswith(".pdf"):
                    item = ExamPost()
                    item["title"]            = title
                    item["board_slug"]       = "rpsc"
                    item["org_acronym"]      = "RPSC"
                    item["org_name"]         = "Rajasthan Public Service Commission"
                    item["source_url"]       = url
                    item["official_website"] = "https://rpsc.rajasthan.gov.in"
                    item["notification_pdf_url"] = url
                    item["state"]            = ["Rajasthan"]
                    yield item
                    continue

                keywords = ["notification", "recruitment", "vacancy", "result",
                            "admit", "answer", "syllabus", "exam", "bharti"]
                t_low = title.lower()
                u_low = url.lower()
                if any(kw in t_low or kw in u_low for kw in keywords):
                    yield response.follow(url, callback=self.parse_detail,
                                          meta={"title": title})

    def parse_detail(self, response):
        """Parse an individual RPSC notification page."""
        title = response.meta.get("title") or response.css("h1::text, h2::text").get("").strip()
        if not title or len(title) < 5:
            return

        dedup_hash = hashlib.sha256(f"RPSC_{response.url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title, urls=[response.url]):
            return

        item = ExamPost()
        item["title"]            = title
        item["board_slug"]       = "rpsc"
        item["org_acronym"]      = "RPSC"
        item["org_name"]         = "Rajasthan Public Service Commission"
        item["source_url"]       = response.url
        item["official_website"] = "https://rpsc.rajasthan.gov.in"
        item["state"]            = ["Rajasthan"]
        item["dedup_hash"]       = dedup_hash

        pdf_links = response.css("a[href$='.pdf']::attr(href)").getall()
        if pdf_links:
            item["notification_pdf_url"] = response.urljoin(pdf_links[0])

        page_text = " ".join(response.css("*::text").getall())
        item["total_vacancies"] = self._extract_number(page_text, ["vacancies", "posts", "vacancy"])
        item["apply_end_date"]  = self._extract_date(page_text, ["last date", "closing date", "apply before"])

        yield item

    def _extract_number(self, text, keywords):
        import re
        for kw in keywords:
            m = re.search(rf"(\d[\d,]+)\s*{kw}|{kw}[:\s]+(\d[\d,]+)", text, re.IGNORECASE)
            if m:
                return int((m.group(1) or m.group(2)).replace(",", ""))
        return None

    def _extract_date(self, text, keywords):
        import re
        months = {"january":1,"february":2,"march":3,"april":4,"may":5,"june":6,
                  "july":7,"august":8,"september":9,"october":10,"november":11,"december":12}
        for kw in keywords:
            idx = text.lower().find(kw)
            if idx == -1:
                continue
            window = text[idx:idx+200]
            m = re.search(r"(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})",
                          window, re.IGNORECASE)
            if m:
                mon = months.get(m.group(2).lower(), 0)
                if mon:
                    return f"{m.group(3)}-{mon:02d}-{int(m.group(1)):02d}"
        return None
