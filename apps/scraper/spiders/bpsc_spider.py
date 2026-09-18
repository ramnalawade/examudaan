# ============================================================
# spiders/bpsc_spider.py — BPSC scraper
# Agent: Scraper Agent
# Scrapes: https://bpsc.bih.nic.in
# ============================================================

import scrapy
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin
from pipelines import DeduplicationPipeline

class BPSCSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes the BPSC website for new exam notifications.
    """

    name = "bpsc"
    default_notification_type = 'recruitment' # fallback for items with generic titles
    allowed_domains = ["bpsc.bih.nic.in"]
    start_urls = ["https://bpsc.bih.nic.in/"]

    def parse(self, response):
        self.logger.info(f"Parsing BPSC homepage: {response.url}")

        selectors = [
            "table.table-striped a",
            "div.content a",
            "a[href*='notice']",
            "a[href*='result']",
            "a[href$='.pdf']"
        ]

        seen = set()
        for sel in selectors:
            for link in response.css(sel):
                href  = link.attrib.get('href', '')
                title = link.xpath("string(.)").get('').strip()
                url   = response.urljoin(href)

                if not title or url in seen or len(title) < 5:
                    continue
                if href.endswith(('.jpg', '.png', '.gif', '.ico')):
                    continue

                seen.add(url)

                if href.lower().endswith('.pdf'):
                    yield self._make_item(title, url, response.url)
                else:
                    yield response.follow(
                        url,
                        callback=self.parse_notification,
                        meta={'title': title, 'source_url': url},
                        errback=self.handle_error,
                    )

    def parse_notification(self, response):
        title = response.meta.get('title') or response.css('h1::text, h2::text').get('').strip()
        source_url = response.meta.get('source_url', response.url)

        if not title or len(title) < 5:
            return

        item = self._make_item(title, source_url, response.url)

        page_text = ' '.join(response.css('*::text').getall())
        item['vacancies']       = self._extract_number(page_text)
        item['application_end'] = self._extract_date(page_text)

        pdf_links = response.css("a[href$='.pdf']::attr(href)").getall()
        if pdf_links:
            item['notification_pdf_url'] = response.urljoin(pdf_links[0])

        yield item

    def _make_item(self, title, source_url, official_url):
        item = ExamPost()
        item['title']            = title
        item['type']             = self._get_type(title)
        item['board_slug']       = 'bpsc'
        item['source_url']       = source_url
        item['official_website'] = 'https://bpsc.bih.nic.in/'
        # Dedup check
        import hashlib
        _dedup_hash = hashlib.sha256(f"BPSC_{source_url}".encode()).hexdigest()
        if self.track_duplicate(_dedup_hash, label=title, urls=[source_url]):
            return None
        item['state']            = ['Bihar']
        item['qualification']    = ['Graduate'] # Default BPSC
        return item

    def _get_type(self, title):
        t = title.lower()
        if 'result' in t or 'merit list' in t: return 'result'
        if 'admit' in t or 'call letter' in t: return 'admit-card'
        if 'answer key' in t: return 'answer-key'
        if 'syllabus' in t: return 'syllabus'
        return 'job'

    def _extract_number(self, text):
        for kw in ['vacancies', 'posts', 'vacancy', 'seats']:
            m = re.search(rf'(\d[\d,]+)\s*{kw}|{kw}[:\s]+(\d[\d,]+)', text, re.IGNORECASE)
            if m:
                return int((m.group(1) or m.group(2)).replace(',', ''))
        return None

    def _extract_date(self, text):
        months = {
            'january':1,'february':2,'march':3,'april':4,'may':5,'june':6,
            'july':7,'august':8,'september':9,'october':10,'november':11,'december':12,
            'jan':1,'feb':2,'mar':3,'apr':4,'jun':6,'jul':7,'aug':8,
            'sep':9,'oct':10,'nov':11,'dec':12
        }
        for kw in ['last date', 'closing date', 'apply before']:
            idx = text.lower().find(kw)
            if idx == -1: continue
            window = text[idx:idx+150]
            m = re.search(
                r'(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})',
                window, re.IGNORECASE
            )
            if m:
                month = months.get(m.group(2).lower(), 0)
                if month:
                    return f"{m.group(3)}-{month:02d}-{int(m.group(1)):02d}"
        return None

    def handle_error(self, failure):
        self.logger.warning(f"BPSC request failed: {failure.request.url}")
