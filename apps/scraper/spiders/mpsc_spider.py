# spiders/mpsc_crawl4ai_spider.py — MPSC with crawl4ai

# Run crawl4ai in a background thread with its own fresh event loop.
# This avoids the sniffio AsyncLibraryNotFoundError that happens when
# asyncio code using httpx is called from inside Scrapy's sync context.

import scrapy
import asyncio
import concurrent.futures
import hashlib
import re
from datetime import datetime
from dateutil import parser as date_parser
from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


def get_crawl4ai():
    from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
    return AsyncWebCrawler, BrowserConfig, CrawlerRunConfig


class MpscCrawl4aiSpider(DuplicateStopMixin, scrapy.Spider):
    name = "mpsc_crawl4ai"
    source_name = "MPSC Official Advertisements Portal (crawl4ai)"
    allowed_domains = ["mpsc.gov.in"]
    start_urls = ["https://mpsc.gov.in/adv_notification/8"]

    dedup_org = "MPSC"
    target_state = "maharashtra"
    target_lang = "en"

    custom_settings = {
        "DOWNLOAD_DELAY": 1,
        "CONCURRENT_REQUESTS": 1,
    }

    CORRIGENDUM_KEYWORDS = ["corrigendum", "amendment", "modification", "revision"]
    RESULT_KEYWORDS = ["result", "selected", "shortlist", "merit list", "final list"]
    EXAM_KEYWORDS = ["examination", "exam", "test", "interview", "preliminary", "mains"]

    def parse(self, response):
        """Main entry point — call crawl4ai to get rendered HTML."""
        self.logger.info(f"MPSC: Using crawl4ai to render {response.url}")
        
        # Run crawl4ai in a separate thread with its own event loop.
        # asyncio.run() inside a ThreadPoolExecutor creates a brand-new event
        # loop that sniffio can recognise, avoiding AsyncLibraryNotFoundError.
        url = response.url
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(asyncio.run, self._crawl_with_crawl4ai(url))
            result = future.result(timeout=120)
        
        if not result:
            self.logger.error("MPSC: crawl4ai failed to fetch page")
            return
        
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(result['html'], 'html.parser')
        
        table = soup.select_one('#datatable')
        if not table:
            self.logger.warning("MPSC: No #datatable found in rendered HTML")
            # Try to find ANY table as fallback
            tables = soup.select('table')
            self.logger.info(f"MPSC: Found {len(tables)} other tables")
            for i, t in enumerate(tables[:3]):
                rows = t.select('tr')
                self.logger.info(f"  Table {i}: {len(rows)} rows")
            return
        
        rows = table.select('tbody tr')
        self.logger.info(f"MPSC: Found {len(rows)} rows in datatable")
        
        entries_yielded = 0
        for row in rows:
            item = self._parse_row(row, response)
            if item:
                entries_yielded += 1
                yield item
        
        self.logger.info(f"MPSC: Yielded {entries_yielded} entries")

    async def _crawl_with_crawl4ai(self, url):
        """Use crawl4ai to fetch and render the page."""
        try:
            AsyncWebCrawler, BrowserConfig, CrawlerRunConfig = get_crawl4ai()
            
            browser_config = BrowserConfig(
                headless=True,
                verbose=False,
                extra_args=["--disable-gpu", "--disable-dev-shm-usage"]
            )
            
            run_config = CrawlerRunConfig(
                word_count_threshold=10,
                bypass_cache=True,
                wait_for="css:#datatable tbody tr",
            )
            
            async with AsyncWebCrawler(config=browser_config) as crawler:
                result = await crawler.arun(url=url, config=run_config)
                
                if result.success:
                    self.logger.info(f"crawl4ai: Success! Got {len(result.html)} bytes")
                    return {
                        'html': result.html,
                        'markdown': result.markdown,
                        'success': True
                    }
                else:
                    self.logger.error(f"crawl4ai failed: {result.error_message}")
                    return None
                    
        except Exception as e:
            self.logger.error(f"crawl4ai exception: {e}")
            return None

    def _parse_row(self, row, response):
        """Parse a single table row from BeautifulSoup."""
        cells = row.select('td')
        if len(cells) < 4:
            return None
        
        cell_texts = [cell.get_text(strip=True) for cell in cells]
        
        sr_no = cell_texts[0] if len(cell_texts) > 0 else None
        advt_no = cell_texts[1] if len(cell_texts) > 1 else None
        title_raw = cell_texts[2] if len(cell_texts) > 2 else None
        publish_date = cell_texts[3] if len(cell_texts) > 3 else None
        
        if not title_raw or len(title_raw) < 10:
            return None
        
        pdf_urls = []
        for cell in cells:
            for link in cell.select('a[href$=".pdf"]'):
                href = link.get('href', '')
                if href:
                    full_url = self._normalize_url(href)
                    if full_url not in pdf_urls:
                        pdf_urls.append(full_url)
        
        dedup_string = f"MPSC_{advt_no or title_raw[:40]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        from pipelines import DeduplicationPipeline
        candidate_url = pdf_urls[0] if pdf_urls else f"{response.url}#{advt_no or sr_no}"
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            return None
        
        clean_title = self._clean_title(title_raw)
        parsed_date = self._parse_date(publish_date)
        
        title_lower = title_raw.lower()
        is_corrigendum = any(kw in title_lower for kw in self.CORRIGENDUM_KEYWORDS)
        is_result = any(kw in title_lower for kw in self.RESULT_KEYWORDS)
        is_closed = is_result
        
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "Maharashtra Public Service Commission"
        item['org_acronym'] = "MPSC"
        item['source_url'] = candidate_url
        item['notification_pdf'] = pdf_urls[0] if pdf_urls else None
        item['apply_start_date'] = parsed_date
        item['apply_end_date'] = None
        item['advt_no'] = advt_no
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = ["Maharashtra"]
        item['application_links'] = {
            "official_website": "https://mpsc.gov.in",
            "all_pdfs": pdf_urls if len(pdf_urls) > 1 else None,
        }

        item['state_slug'] = self.target_state
        item['lang'] = self.target_lang
        item['is_walk_in'] = None
        item['employment_type'] = "permanent"
        item['dedup_hash'] = dedup_hash
        item['ai_extracted_data'] = {}

        desc_parts = []
        if advt_no:
            desc_parts.append(f"Advt: {advt_no}")
        if parsed_date:
            desc_parts.append(f"Published: {parsed_date}")
        if is_corrigendum:
            desc_parts.append("Type: CORRIGENDUM")
        elif is_result:
            desc_parts.append("Type: RESULT")
        item['description'] = " | ".join(desc_parts) if desc_parts else clean_title[:100]

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | MPSC Recruitment {year}",
            "meta_description": f"{clean_title} at Maharashtra Public Service Commission. Advt: {advt_no or 'N/A'}.",
        }

        self.logger.info(f"MPSC: Yielded: {clean_title[:50]} | PDF: {len(pdf_urls)} found")
        return item

    def _normalize_url(self, url):
        url = str(url).strip()
        if url.startswith("http"):
            return url
        if url.startswith("/"):
            return f"https://mpsc.gov.in{url}"
        return f"https://mpsc.gov.in/{url}"

    def _parse_date(self, text):
        text = (text or "").strip()
        if not text or text.upper() in ("N.A", "NA", "NOT AVAILABLE", "-", "TBA", "", "NULL"):
            return None
        try:
            if re.match(r'^\d{2}-\d{2}-\d{4}$', text):
                day, month, year = text.split('-')
                return datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d").strftime("%Y-%m-%d")
            if re.match(r'^\d{4}-\d{2}-\d{2}$', text):
                return text
            return date_parser.parse(text, dayfirst=True).strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            return None

    def _clean_title(self, text):
        if not text:
            return ""
        cleaned = re.sub(r'<[^>]+>', '', str(text))
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        return cleaned[:500]