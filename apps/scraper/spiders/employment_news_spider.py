# ==============================================================================
# spiders/employment_news_spider.py
# Scrapes the official Government of India Employment News portal
# Source: https://www.employmentnews.gov.in/
#
# This is the MOST RELIABLE source — every notification is officially verified.
# Uses RSS feed + follows individual article pages for full details.
# ==============================================================================

import scrapy
import feedparser
import re
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin
from pipelines import DeduplicationPipeline
from datetime import datetime


class EmploymentNewsSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes Employment News — the official weekly GOI recruitment publication.

    Strategy:
    1. Parse the RSS feed for the latest ~20 articles
    2. Also crawl the listing pages (paginated) for historical articles
    3. Follow each article URL to get full details, PDF links, and dates
    """

    name = "employment_news"
    default_notification_type = 'recruitment' # fallback for items with generic titles
    allowed_domains = ["employmentnews.gov.in"]

    RSS_URL = "https://www.employmentnews.gov.in/NewArticles.rss"
    LISTING_URL = "https://www.employmentnews.gov.in/RecPages/SearchResult.aspx"
    MAX_LISTING_PAGES = 10  # 10 pages × ~20 articles = ~200 notifications max

    start_urls = [RSS_URL]

    def parse(self, response):
        """
        Parse the Employment News RSS feed.
        Each <item> is a recruitment notification article.
        """
        self.logger.info(f"Parsing Employment News RSS: {response.url}")

        feed = feedparser.parse(response.text)
        for entry in feed.entries:
            title = entry.get('title', '').strip()
            url = entry.get('link', '').strip()
            published = entry.get('published', '')

            if not title or len(title) < 8:
                continue

            # Convert RSS date to YYYY-MM-DD
            pub_date = self._parse_rss_date(published)

            yield response.follow(
                url,
                callback=self.parse_article,
                meta={
                    'title': title,
                    'pub_date': pub_date,
                },
                errback=self.handle_error,
            )

        # Also kick off the paginated listing crawl for older articles
        yield scrapy.Request(
            self.LISTING_URL,
            callback=self.parse_listing,
            meta={'page': 1},
            errback=self.handle_error,
        )

    def parse_listing(self, response):
        """
        Parse the Employment News listing/search page.
        Extract article links and follow pagination.
        """
        page = response.meta.get('page', 1)
        self.logger.info(f"Parsing Employment News listing page {page}")

        # Find all article links on this listing page
        article_links = response.css(
            "a[href*='ViewArticle'], a[href*='Article'], table.gridView a"
        )

        for link in article_links:
            url = response.urljoin(link.attrib.get('href', ''))
            title = link.css('::text').get('').strip()
            if url and title:
                yield response.follow(
                    url,
                    callback=self.parse_article,
                    meta={'title': title},
                    errback=self.handle_error,
                )

        # Follow pagination — only up to MAX_LISTING_PAGES
        if page < self.MAX_LISTING_PAGES:
            next_page = response.css(
                "a:contains('Next'), a[href*='Page$Next'], .pagination a:last-child"
            )
            if next_page:
                yield response.follow(
                    next_page[0],
                    callback=self.parse_listing,
                    meta={'page': page + 1},
                    errback=self.handle_error,
                )

    def parse_article(self, response):
        """
        Parse an individual Employment News article page.
        Extract all structured information.
        """
        title = response.meta.get('title') or \
                response.css('h1::text, h2::text, .article-title::text').get('').strip()
        pub_date = response.meta.get('pub_date')

        if not title or len(title) < 8:
            return

        import hashlib
        _dedup_hash = hashlib.sha256(f"EMNEWS_{response.url}".encode()).hexdigest()
        if self.track_duplicate(_dedup_hash, label=title, urls=[response.url]):
            return

        item = ExamPost()
        item['title'] = title
        item['type'] = self._get_type(title)
        item['board_slug'] = self._get_board_slug(title, response.text)
        item['source_url'] = response.url
        item['official_website'] = 'https://www.employmentnews.gov.in'
        item['state'] = self._get_state(title, response.text)
        item['qualification'] = self._get_qualification(title, response.text)

        # Dates
        item['notification_date'] = pub_date
        body_html = response.css(
            '.article-body, .entry-content, #ContentPlaceHolder1_lblDesc, table'
        ).get('') or ''
        item['html_body'] = body_html

        # Try regex extraction for key dates
        item['application_end'] = self._extract_date(body_html, [
            'last date', 'closing date', 'last day to apply', 'closing of online application'
        ])
        item['application_start'] = self._extract_date(body_html, [
            'application start', 'start date', 'opening date'
        ])
        item['exam_date_text'] = self._extract_text(body_html, [
            'examination date', 'exam date', 'date of examination'
        ])
        item['vacancies'] = self._extract_vacancies(body_html + ' ' + title)

        # PDF notification link
        pdf_links = response.css("a[href$='.pdf']::attr(href)").getall()
        if pdf_links:
            item['notification_pdf_url'] = response.urljoin(pdf_links[0])

        # Apply link
        apply_links = response.css(
            "a:contains('Apply Online'), a:contains('Apply Now')"
        ).attrib.get('href', '')
        if apply_links:
            item['apply_url'] = response.urljoin(apply_links)

        yield item

    # ---- Helpers ----

    def _get_type(self, title):
        t = title.lower()
        if any(k in t for k in ['result', 'merit list', 'final result', 'selected candidates']):
            return 'result'
        if any(k in t for k in ['admit card', 'hall ticket', 'call letter', 'e-admit']):
            return 'admit-card'
        if any(k in t for k in ['answer key', 'answer-key', 'provisional answer']):
            return 'answer-key'
        if any(k in t for k in ['syllabus', 'exam pattern']):
            return 'syllabus'
        return 'job'

    def _get_board_slug(self, title, html):
        t = (title + ' ' + html[:500]).lower()
        boards = {
            'upsc':     ['upsc', 'civil services', 'ias', 'ips', 'ifs'],
            'ssc':      ['ssc', 'staff selection commission'],
            'rrb':      ['rrb', 'railway recruitment', 'ntpc', 'alp'],
            'ibps':     ['ibps', 'bank po', 'bank clerk'],
            'sbi':      ['sbi', 'state bank of india'],
            'nta':      ['nta', 'jee', 'neet', 'cuet', 'ugc-net'],
            'drdo':     ['drdo'],
            'isro':     ['isro'],
            'army':     ['army', 'military', 'soldier gd'],
            'navy':     ['navy', 'naval'],
            'airforce': ['air force', 'airforce', 'afcat'],
            'uppsc':    ['uppsc', 'uttar pradesh public service'],
            'bpsc':     ['bpsc', 'bihar public service'],
        }
        for slug, keywords in boards.items():
            if any(kw in t for kw in keywords):
                return slug
        return 'central-govt'

    def _get_state(self, title, html):
        t = (title + ' ' + html[:1000]).lower()
        state_map = {
            'UP': ['uttar pradesh', 'uppsc'],
            'Bihar': ['bihar', 'bpsc'],
            'Rajasthan': ['rajasthan', 'rpsc'],
            'Maharashtra': ['maharashtra', 'mpsc'],
            'Gujarat': ['gujarat', 'gpsc'],
            'MP': ['madhya pradesh', 'mppsc'],
            'Haryana': ['haryana', 'hssc'],
            'Punjab': ['punjab', 'ppsc'],
        }
        for state, kws in state_map.items():
            if any(kw in t for kw in kws):
                return [state]
        return ['All India']

    def _get_qualification(self, title, html):
        t = (title + ' ' + html[:2000]).lower()
        quals = []
        if any(k in t for k in ['10th', 'matriculation', 'class x']):
            quals.append('10th Pass')
        if any(k in t for k in ['12th', 'intermediate', 'class xii', 'higher secondary']):
            quals.append('12th Pass')
        if 'diploma' in t:
            quals.append('Diploma')
        if any(k in t for k in ['b.tech', 'b.e.', 'engineering degree']):
            quals.append('B.Tech/B.E.')
        if any(k in t for k in ['graduate', 'graduation', 'degree', 'b.sc', 'b.com', 'b.a']):
            quals.append('Graduate')
        if any(k in t for k in ['post graduate', 'postgraduate', 'master']):
            quals.append('Post Graduate')
        return quals or ['Graduate']

    def _extract_date(self, html, keywords):
        text = re.sub(r'<[^>]+>', ' ', html)
        month_map = {
            'january': 1, 'february': 2, 'march': 3, 'april': 4,
            'may': 5, 'june': 6, 'july': 7, 'august': 8,
            'september': 9, 'october': 10, 'november': 11, 'december': 12,
            'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'jun': 6,
            'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12,
        }
        for kw in keywords:
            idx = text.lower().find(kw)
            if idx == -1:
                continue
            window = text[idx:idx + 300]
            m = re.search(r'(\d{1,2})[/-](\d{1,2})[/-](\d{4})', window)
            if m:
                return f"{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
            m = re.search(
                r'(\d{1,2})\s+(january|february|march|april|may|june|july|august|'
                r'september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})',
                window, re.IGNORECASE
            )
            if m:
                mn = month_map.get(m.group(2).lower(), 0)
                if mn:
                    return f"{m.group(3)}-{mn:02d}-{int(m.group(1)):02d}"
        return None

    def _extract_text(self, html, keywords, window=200):
        text = re.sub(r'<[^>]+>', ' ', html)
        text = re.sub(r'\s+', ' ', text)
        for kw in keywords:
            idx = text.lower().find(kw)
            if idx != -1:
                snippet = text[idx + len(kw):idx + len(kw) + window].strip()
                snippet = re.sub(r'^[\s:–—]+', '', snippet)
                lines = [l.strip() for l in snippet.split('\n') if l.strip()]
                if lines:
                    return lines[0][:150]
        return None

    def _extract_vacancies(self, text):
        text = re.sub(r'<[^>]+>', ' ', text)
        for pattern in [
            r'(\d[\d,]+)\s*(?:posts?|vacancies|vacancy|seats?)',
            r'(?:total\s*)?(?:posts?|vacancies|vacancy)\s*[:\-–]?\s*(\d[\d,]+)',
        ]:
            m = re.search(pattern, text, re.IGNORECASE)
            if m:
                val = m.group(1).replace(',', '')
                try:
                    n = int(val)
                    if 1 <= n <= 500000:
                        return n
                except ValueError:
                    pass
        return None

    def _parse_rss_date(self, date_str):
        """Parse RSS pubDate string to YYYY-MM-DD."""
        if not date_str:
            return None
        formats = [
            '%a, %d %b %Y %H:%M:%S %z',
            '%a, %d %b %Y %H:%M:%S GMT',
            '%Y-%m-%dT%H:%M:%S%z',
        ]
        for fmt in formats:
            try:
                dt = datetime.strptime(date_str.strip(), fmt)
                return dt.strftime('%Y-%m-%d')
            except ValueError:
                continue
        return None

    def handle_error(self, failure):
        self.logger.warning(f"Employment News request failed: {failure.request.url}")
