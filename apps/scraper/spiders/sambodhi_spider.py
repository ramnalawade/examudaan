# ============================================================
# spiders/sambodhi_spider.py — Sambodhi Academy Syllabus Spider
# Scrapes syllabus, pattern, eligibility & optional subjects
# Target: https://www.sambodhiacademy.com/en/exams/{slug} & /mr/exams/{slug}
# ============================================================

import json
import os
import re
from datetime import datetime

try:
    import scrapy
    SpiderBase = scrapy.Spider
except ImportError:
    scrapy = None
    class SpiderBase:
        pass


class SambodhiSpider(SpiderBase):
    """
    Scrapes syllabus blueprints, eligibility criteria, exam patterns,
    optional subjects, and interview formats from Sambodhi Academy
    for 11 state and national competitive examinations.
    """
    name = "sambodhi"
    allowed_domains = ["sambodhiacademy.com"]

    EXAM_SLUGS = [
        "mpsc-rajyaseva",
        "mpsc-group-bc",
        "policeBharti",
        "upsc",
        "ssc-cgl",
        "ssc",
        "ibps",
        "sbi",
        "mes",
        "Ca",
        "gnm",
    ]

    LANGUAGES = ["en", "mr"]

    custom_settings = {
        "DOWNLOAD_DELAY": 0.5,
        "CONCURRENT_REQUESTS": 2,
        "ROBOTSTXT_OBEY": False,
        "ITEM_PIPELINES": {},
        "DOWNLOADER_MIDDLEWARES": {
            "middlewares.RandomUserAgentMiddleware": None,
            "middlewares.RandomHeadersMiddleware": None,
            "middlewares.SmartRetryMiddleware": None,
        },
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    }

    def start_requests(self):
        for lang in self.LANGUAGES:
            for slug in self.EXAM_SLUGS:
                url = f"https://www.sambodhiacademy.com/{lang}/exams/{slug}"
                yield scrapy.Request(
                    url=url,
                    callback=self.parse_exam_page,
                    meta={"exam_slug": slug, "lang": lang},
                )

    def _clean_text(self, text):
        if not text:
            return ""
        return re.sub(r"\s+", " ", text).strip()

    def _parse_table(self, table_el):
        """Extract headers and rows from an HTML table element."""
        headers = []
        for th in table_el.css("thead th"):
            headers.append(self._clean_text(th.xpath("string()").get()))

        rows = []
        for tr in table_el.css("tbody tr"):
            row = []
            for td in tr.css("td"):
                row.append(self._clean_text(td.xpath("string()").get()))
            if any(row):
                if headers and len(headers) == len(row):
                    rows.append(dict(zip(headers, row)))
                else:
                    rows.append(row)
        return {"headers": headers, "rows": rows}

    def parse_exam_page(self, response):
        exam_slug = response.meta["exam_slug"]
        lang = response.meta["lang"]

        # 1. Title
        title = self._clean_text(response.css("h1::text").get())

        # 2. Extract all section titles and rich-text blocks
        # Tables with captions
        prelims_table = None
        mains_table = None
        other_tables = []

        for table_container in response.css(".table-container"):
            caption = self._clean_text(table_container.css(".table-caption::text").get())
            table_el = table_container.css("table")
            if table_el:
                parsed_tbl = self._parse_table(table_el)
                parsed_tbl["caption"] = caption
                caption_lower = caption.lower()
                if "prelim" in caption_lower or "पूर्व" in caption_lower:
                    prelims_table = parsed_tbl
                elif "main" in caption_lower or "मुख्य" in caption_lower:
                    mains_table = parsed_tbl
                else:
                    other_tables.append(parsed_tbl)

        # 3. Optional subjects list
        optional_subjects = []
        # Find header containing "Optional Subjects" or "ऐच्छिक विषय"
        for h3 in response.css("h3"):
            h3_text = self._clean_text(h3.xpath("string()").get())
            if "optional subject" in h3_text.lower() or "ऐच्छिक विषय" in h3_text:
                # Following list items
                parent_or_next = h3.xpath("./following::div[contains(@class, 'rich-text')][1]//li")
                for li in parent_or_next:
                    subj = self._clean_text(li.xpath("string()").get())
                    if subj:
                        optional_subjects.append(subj)
                break

        # 4. Interview section
        interview_details = {}
        interview_points = []
        for h3 in response.css("h3"):
            h3_text = self._clean_text(h3.xpath("string()").get())
            if "interview" in h3_text.lower() or "मुलाखत" in h3_text:
                div_rt = h3.xpath("./following::div[contains(@class, 'rich-text')][1]")
                for p in div_rt.css("p"):
                    ptxt = self._clean_text(p.xpath("string()").get())
                    if ptxt:
                        interview_points.append(ptxt)
                for li in div_rt.css("li"):
                    litxt = self._clean_text(li.xpath("string()").get())
                    if litxt:
                        interview_points.append(litxt)
                break

        if interview_points:
            interview_details = {
                "summary": " ".join(interview_points[:3]),
                "details": interview_points,
            }

        # 5. Full text paragraphs for overview & eligibility
        all_paragraphs = []
        for p in response.css("main .rich-text p"):
            txt = self._clean_text(p.xpath("string()").get())
            if txt and len(txt) > 5:
                all_paragraphs.append(txt)

        # 6. Extract eligibility details
        eligibility_items = []
        for li in response.css("main .rich-text li"):
            txt = self._clean_text(li.xpath("string()").get())
            if txt and len(txt) > 3 and txt not in optional_subjects and txt not in interview_points:
                eligibility_items.append(txt)

        item = {
            "source": "Sambodhi Academy",
            "url": response.url,
            "exam_slug": exam_slug,
            "language": lang,
            "title": title,
            "overview_paragraphs": all_paragraphs[:6],
            "eligibility_highlights": eligibility_items,
            "prelims_pattern": prelims_table,
            "mains_pattern": mains_table,
            "other_tables": other_tables,
            "optional_subjects": optional_subjects,
            "interview_details": interview_details,
            "scraped_at": datetime.utcnow().isoformat(),
        }

        self.logger.info(f"Successfully scraped {lang.upper()} syllabus for {exam_slug}: {title}")
        yield item


if __name__ == "__main__":
    # Allow running directly via Python without Scrapy CLI dependencies
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    import requests
    from bs4 import BeautifulSoup

    print("==================================================")
    print(" Sambodhi Academy Exam Syllabus Scraper (CLI Mode)")
    print("==================================================")

    scraper = SambodhiSpider()
    all_data = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }

    for lang in ["en", "mr"]:
        for slug in SambodhiSpider.EXAM_SLUGS:
            url = f"https://www.sambodhiacademy.com/{lang}/exams/{slug}"
            try:
                resp = requests.get(url, headers=headers, timeout=15)
                if resp.status_code != 200:
                    print(f"[{lang.upper()}] {slug}: HTTP {resp.status_code} (Skipping)")
                    continue

                soup = BeautifulSoup(resp.text, "html.parser")
                title = soup.find("h1").get_text(strip=True) if soup.find("h1") else slug

                # Tables
                tables = []
                for tc in soup.find_all(class_="table-container"):
                    cap = tc.find(class_="table-caption")
                    cap_text = cap.get_text(strip=True) if cap else "Table"
                    tbl = tc.find("table")
                    if tbl:
                        headers_list = [th.get_text(strip=True) for th in tbl.find_all("th")]
                        rows_list = []
                        for tr in tbl.find_all("tr"):
                            cols = [td.get_text(strip=True) for td in tr.find_all("td")]
                            if cols:
                                if headers_list and len(headers_list) == len(cols):
                                    rows_list.append(dict(zip(headers_list, cols)))
                                else:
                                    rows_list.append(cols)
                        tables.append({"caption": cap_text, "headers": headers_list, "rows": rows_list})

                # Optional subjects
                opt_subjects = []
                for h3 in soup.find_all("h3"):
                    h3_text = h3.get_text(strip=True).lower()
                    if "optional subject" in h3_text or "ऐच्छिक विषय" in h3_text:
                        next_div = h3.find_next("div", class_="rich-text")
                        if next_div:
                            for li in next_div.find_all("li"):
                                txt = li.get_text(strip=True)
                                if txt:
                                    opt_subjects.append(txt)
                        break

                # Interview
                interview_points = []
                for h3 in soup.find_all("h3"):
                    h3_text = h3.get_text(strip=True).lower()
                    if "interview" in h3_text or "मुलाखत" in h3_text:
                        next_div = h3.find_next("div", class_="rich-text")
                        if next_div:
                            for item in next_div.find_all(["p", "li"]):
                                txt = item.get_text(strip=True)
                                if txt and len(txt) > 3:
                                    interview_points.append(txt)
                        break

                # Paragraphs
                paragraphs = [
                    p.get_text(strip=True)
                    for p in soup.select("main .rich-text p")
                    if len(p.get_text(strip=True)) > 5
                ]

                record = {
                    "slug": slug,
                    "lang": lang,
                    "url": url,
                    "title": title,
                    "paragraphs_count": len(paragraphs),
                    "tables_count": len(tables),
                    "optional_subjects_count": len(opt_subjects),
                    "interview_points_count": len(interview_points),
                    "tables": tables,
                    "optional_subjects": opt_subjects,
                    "interview_details": interview_points,
                    "overview": paragraphs[:5],
                }
                all_data.append(record)
                print(f"[{lang.upper()}] {slug}: '{title}' | {len(tables)} tables | {len(opt_subjects)} opt subjects")

            except Exception as e:
                print(f"Error scraping {url}: {e}")

    out_file = os.path.join(os.path.dirname(__file__), "..", "sambodhi_all_exams.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    print(f"\nDone! Scraped {len(all_data)} pages. Saved to {out_file}")

