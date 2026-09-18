# ============================================================
# spiders/nta_spider.py — NTA (National Testing Agency) scraper
# Agent: Scraper Agent
# Scrapes: nta.ac.in — JEE, NEET, CUET, UGC-NET, CMAT etc.
# ============================================================

import scrapy
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin
from pipelines import DeduplicationPipeline

# NTA runs multiple exam portals — scrape each
NTA_PORTALS = [
    'https://nta.ac.in',
    'https://nta.ac.in/ExamList',
]


class NTASpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes NTA (National Testing Agency) for exam notifications.
    NTA conducts: JEE Main, NEET UG, CUET (UG/PG), UGC-NET,
    CMAT, GPAT, ICAR, and 100+ other entrance exams.
    """

    name = "nta"
    default_notification_type = 'recruitment' # fallback for items with generic titles
    allowed_domains = [
        "nta.ac.in", "www.nta.ac.in",
        "jeemain.nta.nic.in",
        "neet.nta.nic.in",
        "ugcnet.nta.nic.in",
        "cuet.samarth.ac.in",
    ]
    start_urls = NTA_PORTALS

    def parse(self, response):
        self.logger.info(f"Parsing NTA page: {response.url}")

        selectors = [
            "a[href*='notification']",
            "a[href*='exam']",
            "a[href*='result']",
            "a[href*='admit']",
            "div.public-notice a",
            "div.whats-new a",
            "ul.exam-list a",
            "div.notification-list a",
            "a[href$='.pdf']",
        ]

        seen = set()
        for sel in selectors:
            for link in response.css(sel):
                href  = link.attrib.get('href', '')
                title = link.css('::text').get('').strip()
                url   = response.urljoin(href)

                if not title or url in seen or len(title) < 5:
                    continue
                if href.endswith(('.jpg', '.png', '.gif', '.ico')):
                    continue

                seen.add(url)

                if href.lower().endswith('.pdf'):
                    yield self._make_item(title, url)
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

        item = self._make_item(title, source_url)

        page_text = ' '.join(response.css('*::text').getall())
        item['vacancies']       = self._extract_number(page_text)
        item['application_end'] = self._extract_date(page_text)
        item['exam_date_text']  = self._extract_exam_date(page_text)

        pdf_links = response.css("a[href$='.pdf']::attr(href)").getall()
        if pdf_links:
            item['notification_pdf_url'] = response.urljoin(pdf_links[0])

        yield item

    def _make_item(self, title, source_url):
        item = ExamPost()
        item['title']            = title
        item['type']             = self._get_type(title)
        item['board_slug']       = 'nta'
        item['source_url']       = source_url
        item['official_website'] = 'https://nta.ac.in'
        # Dedup check
        import hashlib
        _dedup_hash = hashlib.sha256(f"NTA_{source_url}".encode()).hexdigest()
        if self.track_duplicate(_dedup_hash, label=title, urls=[source_url]):
            return None
        item['state']            = ['All India']
        # NTA qualification varies by exam
        item['qualification']    = self._get_qualification(title)
        return item

    def _get_type(self, title):
        t = title.lower()
        if 'result' in t or 'scorecard' in t or 'score card' in t:
            return 'result'
        if 'admit' in t or 'hall ticket' in t or 'call letter' in t:
            return 'admit-card'
        if 'answer key' in t or 'final answer' in t:
            return 'answer-key'
        if 'syllabus' in t or 'pattern' in t:
            return 'syllabus'
        return 'job'

    def _get_qualification(self, title):
        """Infer qualification from NTA exam name"""
        t = title.lower()
        if 'neet' in t:
            return ['12th Pass']                    # NEET UG = 12th
        if 'jee' in t:
            return ['12th Pass']                    # JEE = 12th
        if 'cuet ug' in t:
            return ['12th Pass']                    # CUET UG = 12th
        if 'cuet pg' in t or 'net' in t or 'ugc' in t:
            return ['Graduate']                     # PG entrance = degree
        if 'phd' in t:
            return ['Post Graduate']
        return ['12th Pass', 'Graduate']

    def _extract_number(self, text):
        for kw in ['seats', 'intake', 'vacancies', 'posts']:
            m = re.search(rf'(\d[\d,]+)\s*{kw}|{kw}[:\s]+(\d[\d,]+)', text, re.IGNORECASE)
            if m:
                return int((m.group(1) or m.group(2)).replace(',', ''))
        return None

    def _extract_exam_date(self, text):
        """Try to find exam date (NTA always mentions it prominently)"""
        for kw in ['exam date', 'examination date', 'test date']:
            idx = text.lower().find(kw)
            if idx == -1:
                continue
            window = text[idx:idx + 200]
            m = re.search(
                r'(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})',
                window, re.IGNORECASE
            )
            if m:
                return f"{m.group(1)} {m.group(2)} {m.group(3)}"
        return None

    def _extract_date(self, text):
        months = {
            'january':1,'february':2,'march':3,'april':4,'may':5,'june':6,
            'july':7,'august':8,'september':9,'october':10,'november':11,'december':12,
            'jan':1,'feb':2,'mar':3,'apr':4,'jun':6,'jul':7,'aug':8,
            'sep':9,'oct':10,'nov':11,'dec':12
        }
        for kw in ['last date', 'closing date', 'last day to apply']:
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
        self.logger.warning(f"NTA request failed: {failure.request.url}")
