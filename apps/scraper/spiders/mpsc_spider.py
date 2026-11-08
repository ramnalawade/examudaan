# ============================================================
# spiders/mpsc_spider.py — MPSC Advertisements & Corrigendums
# ExamUdaan | https://mpsc.gov.in/adv_notification/8
# Uses Playwright (Edge/Chromium) to crawl MPSC's React SPA,
# decrypts notifications from React state, and handles pagination.
#
# Run:
#   scrapy crawl mpsc
#   scrapy crawl mpsc_crawl4ai
# ============================================================

import scrapy
import concurrent.futures
import hashlib
import re
from datetime import datetime
from dateutil import parser as date_parser
from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class MpscCrawl4aiSpider(DuplicateStopMixin, scrapy.Spider):
    name = "mpsc_crawl4ai"
    source_name = "MPSC Official Advertisements Portal"
    allowed_domains = ["mpsc.gov.in"]
    start_urls = ["https://mpsc.gov.in/adv_notification/8"]

    dedup_org = "MPSC"
    target_state = "maharashtra"
    target_lang = "en"
    default_notification_type = "recruitment"

    custom_settings = {
        "DOWNLOAD_DELAY": 1,
        "CONCURRENT_REQUESTS": 1,
    }

    CORRIGENDUM_KEYWORDS = ["corrigendum", "amendment", "modification", "revision", "शुद्धीपत्रक"]
    RESULT_KEYWORDS = ["result", "selected", "shortlist", "merit list", "final list", "निकाल"]
    EXAM_KEYWORDS = ["examination", "exam", "test", "interview", "preliminary", "mains", "परीक्षा"]

    max_crawl_pages = 5  # Crawl first 5 pages (50 recent entries)

    def parse(self, response):
        """Main entry point — runs Playwright in a worker thread to render MPSC React SPA."""
        self.logger.info(f"MPSC: Starting Playwright crawler for {response.url}")

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(self._crawl_with_playwright)
            all_records = future.result(timeout=180)

        if not all_records:
            self.logger.error("MPSC: Failed to extract any notifications from page")
            return

        self.logger.info(f"MPSC: Playwright extracted {len(all_records)} raw records")
        entries_yielded = 0

        for rec in all_records:
            item = self._build_item(rec)
            if item:
                entries_yielded += 1
                yield item

        self.logger.info(f"MPSC: Successfully yielded {entries_yielded} notifications")

    def _crawl_with_playwright(self):
        """Executes in a dedicated background thread with its own synchronous context."""
        import sys
        import asyncio
        if sys.platform == 'win32':
            asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

        from playwright.sync_api import sync_playwright

        records = []
        try:
            with sync_playwright() as p:
                # Try msedge first (preinstalled on Windows), fallback to chromium / chrome
                browser = None
                for channel in ['msedge', 'chrome', None]:
                    try:
                        kwargs = {'headless': True}
                        if channel:
                            kwargs['channel'] = channel
                        browser = p.chromium.launch(**kwargs)
                        self.logger.info(f"MPSC Playwright: Launched browser with channel={channel}")
                        break
                    except Exception as launch_err:
                        self.logger.debug(f"MPSC Playwright: Channel {channel} launch failed: {launch_err}")
                        continue

                if not browser:
                    self.logger.error("MPSC Playwright: Failed to launch any Chromium/Edge browser")
                    return []

                try:
                    page = browser.new_page()
                    page.on("console", lambda msg: self.logger.info(f"MPSC Console: {msg.text}"))
                    page.on("requestfailed", lambda req: self.logger.warning(f"MPSC Req Failed: {req.url} {req.failure}"))
                    page.on("response", lambda res: self.logger.info(f"MPSC Res: {res.status} {res.url}") if 'api' in res.url else None)
                    
                    # 1. Warm up session at base domain
                    try:
                        page.goto('https://mpsc.gov.in/', timeout=30000)
                        page.wait_for_timeout(2000)
                    except Exception as e:
                        self.logger.warning(f"MPSC Warmup notice: {e}")

                    # 2. Navigate to advertisements list
                    self.logger.info("MPSC Playwright: Navigating to https://mpsc.gov.in/adv_notification/8")
                    page.goto('https://mpsc.gov.in/adv_notification/8', timeout=60000)
                    
                    # Wait for table rows to appear dynamically (React API call + decrypt + render)
                    try:
                        page.wait_for_selector('table tbody tr', timeout=25000)
                        self.logger.info("MPSC Playwright: 'table tbody tr' found!")
                    except Exception as wait_err:
                        self.logger.warning(f"MPSC Playwright: wait_for_selector timeout: {wait_err}")
                        page.wait_for_timeout(5000)

                    self.logger.info(f"MPSC Playwright: Current URL={page.url}, Title={page.title()}")
                    has_table = page.locator('table').count()
                    self.logger.info(f"MPSC Playwright: Table count={has_table}")

                    # 3. Extract across pages
                    for page_num in range(1, self.max_crawl_pages + 1):
                        # Extract from React state (preferred, has exact DB IDs and metadata)
                        page_items = self._extract_react_state(page)

                        # Fallback to DOM table if React fiber extraction misses
                        if not page_items:
                            page_items = self._extract_dom_table(page)

                        self.logger.info(f"MPSC Playwright: Page {page_num} extracted {len(page_items or [])} items")

                        if page_items:
                            for it in page_items:
                                # Avoid duplicates across pagination loops
                                if not any(r.get('id') == it.get('id') and r.get('title') == it.get('title') for r in records):
                                    records.append(it)

                        # Click Next button for next page if not on last requested page
                        if page_num < self.max_crawl_pages:
                            next_btn = page.locator('text="Next"').first
                            if next_btn.is_visible():
                                try:
                                    next_btn.click()
                                    page.wait_for_timeout(3500)
                                except Exception as next_err:
                                    self.logger.warning(f"MPSC Playwright: Failed to click Next on page {page_num}: {next_err}")
                                    break
                            else:
                                self.logger.info(f"MPSC Playwright: Next button not visible on page {page_num}")
                                break
                except Exception as page_err:
                    self.logger.error(f"MPSC Playwright page execution error: {page_err}", exc_info=True)
                finally:
                    browser.close()
        except Exception as p_err:
            self.logger.error(f"MPSC Playwright sync execution failed: {p_err}", exc_info=True)

        return records

    def _extract_react_state(self, page):
        """Extracts decrypted notification items directly from React Fiber state."""
        try:
            raw_data = page.evaluate('''() => {
                const root = document.getElementById('root');
                if (!root) return null;
                const fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactContainer'));
                if (!fiberKey) return null;

                let foundData = null;
                let stack = [root[fiberKey]];
                while (stack.length > 0 && !foundData) {
                    let curr = stack.pop();
                    if (!curr) continue;
                    if (curr.memoizedState) {
                        let s = curr.memoizedState;
                        while (s) {
                            if (Array.isArray(s.memoizedState) && s.memoizedState.length >= 5) {
                                const item0 = s.memoizedState[0];
                                if (item0 && item0.descInEnglish && item0.id) {
                                    foundData = s.memoizedState;
                                    break;
                                }
                            }
                            s = s.next;
                        }
                    }
                    if (curr.child) stack.push(curr.child);
                    if (curr.sibling) stack.push(curr.sibling);
                }

                if (!foundData) return null;
                return foundData.map(item => ({
                    id: item.id,
                    advertisementNumber: item.advertisementNumber,
                    yearOfAdvertisement: item.yearOfAdvertisement,
                    title: item.descInEnglish || '',
                    title_mr: item.descMr || '',
                    date: item.publicationDate || '',
                    pdf_name: item.englishFileName || item.marathiFileName || '',
                    pdf_size: item.englishFileSize || item.marathiFileSize || '',
                }));
            }''')
            return raw_data or []
        except Exception as e:
            self.logger.warning(f"MPSC React state extract error: {e}")
            return []

    def _extract_dom_table(self, page):
        """Fallback extractor directly from rendered DOM table."""
        try:
            return page.evaluate('''() => {
                const trs = document.querySelectorAll('table tbody tr');
                const list = [];
                for (const tr of trs) {
                    const tds = tr.querySelectorAll('td');
                    if (tds.length >= 4) {
                        const advt = tds[1].innerText.trim();
                        const title = tds[2].innerText.trim();
                        const date = tds[3].innerText.trim();
                        if (title.length > 5) {
                            list.push({
                                id: null,
                                advertisementNumber: advt,
                                yearOfAdvertisement: '',
                                title: title,
                                title_mr: '',
                                date: date,
                                pdf_name: '',
                                pdf_size: '',
                            });
                        }
                    }
                }
                return list;
            }''') or []
        except Exception as e:
            self.logger.warning(f"MPSC DOM extract error: {e}")
            return []

    def _build_item(self, rec):
        """Builds ExamNotificationItem from raw record dictionary."""
        title_raw = (rec.get('title') or '').strip()
        if not title_raw or len(title_raw) < 10:
            return None

        clean_title = self._clean_title(title_raw)
        advt_no = rec.get('advertisementNumber')
        year = rec.get('yearOfAdvertisement')
        if advt_no and year and '/' not in str(advt_no):
            advt_full = f"{advt_no}/{year}"
        else:
            advt_full = advt_no

        raw_id = rec.get('id')
        parsed_date = self._parse_date(rec.get('date'))

        # Official MPSC direct secure PDF endpoint
        if raw_id:
            pdf_url = f"https://mpsc.gov.in/web/api/v1/downloadFile/english/{raw_id}"
            source_url = f"https://mpsc.gov.in/adv_notification/8#item_{raw_id}"
        else:
            pdf_url = None
            source_url = f"https://mpsc.gov.in/adv_notification/8#{advt_full or clean_title[:30]}"

        # Deduplication check
        dedup_string = f"MPSC_{raw_id or advt_full or clean_title[:50]}"
        dedup_hash = hashlib.sha256(dedup_string.encode('utf-8')).hexdigest()

        if self.track_duplicate(dedup_hash, label=clean_title, urls=[source_url]):
            return None

        title_lower = title_raw.lower()
        is_corrigendum = any(kw in title_lower for kw in self.CORRIGENDUM_KEYWORDS)
        is_result = any(kw in title_lower for kw in self.RESULT_KEYWORDS)
        is_closed = is_result

        if is_result:
            notif_type = 'result'
        elif any(kw in title_lower for kw in ['answer key', 'answerkey', 'response sheet', 'उत्तरपत्रिका']):
            notif_type = 'answer_key'
        elif any(kw in title_lower for kw in ['hall ticket', 'admit card', 'call letter', 'प्रवेशपत्र']):
            notif_type = 'admit_card'
        elif any(kw in title_lower for kw in ['syllabus', 'exam pattern', 'अभ्यासक्रम']):
            notif_type = 'syllabus'
        else:
            notif_type = 'recruitment'

        item = ExamNotificationItem()
        item['notification_type'] = notif_type
        item['title'] = clean_title
        item['org_name'] = "Maharashtra Public Service Commission"
        item['org_acronym'] = "MPSC"
        item['source_url'] = source_url
        item['notification_pdf'] = pdf_url
        item['apply_start_date'] = parsed_date
        item['apply_end_date'] = None
        item['advt_no'] = advt_full
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = ["Maharashtra", "Mumbai", "Pune"]
        item['application_links'] = {
            "official_website": "https://mpsc.gov.in",
            "notification_pdf": pdf_url,
            "apply_online": "https://mpsconline.gov.in",
        }

        item['state_slug'] = self.target_state
        item['lang'] = self.target_lang
        item['is_walk_in'] = False
        item['employment_type'] = "permanent"
        item['dedup_hash'] = dedup_hash
        item['ai_extracted_data'] = {
            "title_mr": rec.get('title_mr') or None,
            "file_size": rec.get('pdf_size') or None,
            "mpsc_item_id": raw_id,
        }

        desc_parts = []
        if advt_full:
            desc_parts.append(f"Advt: {advt_full}")
        if parsed_date:
            desc_parts.append(f"Published: {parsed_date}")
        if is_corrigendum:
            desc_parts.append("Type: CORRIGENDUM / शुद्धीपत्रक")
        elif is_result:
            desc_parts.append("Type: RESULT / निकाल")
        item['description'] = " | ".join(desc_parts) if desc_parts else clean_title[:100]

        cur_year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | MPSC Recruitment {cur_year}",
            "meta_description": f"{clean_title} at Maharashtra Public Service Commission. Advt: {advt_full or 'N/A'}.",
        }

        self.logger.info(f"MPSC: Yielded -> {clean_title[:55]} | Advt: {advt_full} | PDF: {pdf_url}")
        return item

    def _parse_date(self, text):
        text = str(text or "").strip()
        if not text or text.upper() in ("N.A", "NA", "NOT AVAILABLE", "-", "TBA", "", "NULL"):
            return None
        # Handle "2026-11-06 00:00:00" or "06-11-2026"
        text = text.split(' ')[0].strip()
        try:
            if re.match(r'^\d{4}-\d{2}-\d{2}$', text):
                return text
            if re.match(r'^\d{2}-\d{2}-\d{4}$', text):
                day, month, year = text.split('-')
                return f"{year}-{month}-{day}"
            return date_parser.parse(text, dayfirst=True).strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            return None

    def _clean_title(self, text):
        if not text:
            return ""
        cleaned = re.sub(r'<[^>]+>', '', str(text))
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        return cleaned[:500]


# Alias so both `scrapy crawl mpsc` and `scrapy crawl mpsc_crawl4ai` work
class MpscSpider(MpscCrawl4aiSpider):
    name = "mpsc"
