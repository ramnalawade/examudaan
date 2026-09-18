# ============================================================
# spiders/rrb_spider.py — Railway Recruitment Board scraper
# Agent: Scraper Agent
# Scrapes: indianrailways.gov.in + all 21 RRB regional sites
# Handles: RRB NTPC, RRB Group D, RRB JE, RRB ALP
# ============================================================

import scrapy
import re
from spiders.dedup_mixin import DuplicateStopMixin
from pipelines import DeduplicationPipeline

# All 21 RRB regional websites
RRB_SITES = [
    'https://www.rrbahmedabad.gov.in',
    'https://www.rrbajmer.gov.in',
    'https://www.rrbaldenvr.gov.in',  # Allahabad
    'https://www.rrbbengaluru.gov.in',
    'https://www.rrbbhopal.gov.in',
    'https://www.rrbbhubaneswar.gov.in',
    'https://www.rrbchennai.gov.in',
    'https://www.rrbguwahati.gov.in',
    'https://www.rrbgorakhpur.gov.in',
    'https://www.rrbjabalpur.gov.in',
    'https://www.rrbjammu.gov.in',
    'https://www.rrbkolkata.gov.in',
    'https://www.rrbmumbai.gov.in',
    'https://www.rrbmuzaffarpur.gov.in',
    'https://www.rrbpatna.gov.in',
    'https://www.rrbranchi.gov.in',
    'https://www.rrbsecunderabad.gov.in',
    'https://www.rrbsiliguri.gov.in',
    'https://www.rrbthiruvananthapuram.gov.in',
]

class RRBSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes all 21 Railway Recruitment Board (RRB) regional websites.
    Each RRB uses a slightly different site layout, so we use broad
    selectors and fall back gracefully.
    """

    name = "rrb"                            # run with: scrapy crawl rrb
    allowed_domains = [
        site.replace('https://www.', '')
        for site in RRB_SITES
    ] + ['indianrailways.gov.in']

    start_urls = RRB_SITES

    # Items whose title has no recognizable keywords default to 'recruitment'
    # so they are not silently dropped by the pipeline.
    default_notification_type = 'recruitment'

    # Link-level relevance filtering is provided by DuplicateStopMixin.is_irrelevant_link().
    # No need to duplicate the keyword list here.

    def parse(self, response):
        """
        Parse RRB homepage — find links to notifications
        """
        self.logger.info(f"Parsing RRB site: {response.url}")

        # Common patterns across RRB sites for notification links
        link_selectors = [
            "a[href*='notification']",
            "a[href*='recruitment']",
            "a[href*='vacancy']",
            "a[href*='result']",
            "a[href*='admit']",
            "a[href*='answer']",
            "div.notification a",
            "div.news a",
            "ul.links a",
            "div.content a",
            "table a",
        ]

        seen = set()

        for selector in link_selectors:
            for link in response.css(selector):
                href  = link.attrib.get('href', '')
                title = link.css('::text').get('').strip()
                url   = response.urljoin(href)

                if not title or url in seen:
                    continue

                # Skip non-exam links (images)
                if href.endswith(('.jpg', '.png', '.gif', '.ico')):
                    continue

                # Skip irrelevant content — application summaries, tenders, etc.
                # is_irrelevant_link() is provided by DuplicateStopMixin.
                if self.is_irrelevant_link(title, href):
                    self.logger.debug(f"RRB: Skipping irrelevant link: {title!r}")
                    continue

                # Check duplicate before crawling
                if self.track_duplicate(url, label=title, urls=[url]):
                    continue

                # If it's a PDF, create item directly
                if href.lower().endswith('.pdf'):
                    yield self._make_item(title, url, response.url)
                    continue

                seen.add(url)

                # Follow HTML pages for more detail
                yield response.follow(
                    url,
                    callback=self.parse_notification,
                    meta={'title': title, 'source_url': url},
                    errback=self.handle_error,
                )

    def parse_notification(self, response):
        """
        Parse individual RRB notification page
        """
        title = response.meta.get('title') or response.css('h1::text, h2::text').get('').strip()
        source_url = response.meta.get('source_url', response.url)

        if not title or len(title) < 5:
            return

        if self.track_duplicate(source_url, label=title, urls=[source_url, response.url]):
            return

        yield self._make_item(title, source_url, response.url, response)

    def _make_item(self, title, source_url, page_url, response=None):
        """
        Build ExamNotificationItem from available data.
        Uses ExamNotificationItem-compatible field names (not the old ExamPost names).
        """
        from items import ExamNotificationItem
        item = ExamNotificationItem()

        item['title']           = title
        item['source_url']      = source_url
        item['org_name']        = 'Railway Recruitment Board'
        item['org_acronym']     = 'RRB'
        item['state_slug']      = 'all-india'
        item['lang']            = 'en'

        # Map old _get_type() values to valid notification_type values
        _type_map = {
            'result':    'result',
            'admit-card': 'admit_card',
            'answer-key': 'answer_key',
            'syllabus':   'syllabus',
            'job':        'recruitment',   # old 'job' → proper 'recruitment'
        }
        raw_type = self._get_type(title)
        item['notification_type'] = _type_map.get(raw_type, 'recruitment')

        # application_links JSONB
        item['application_links'] = {'official_website': page_url}

        # RRB qualification varies by exam type
        title_lower = title.lower()
        if 'ntpc' in title_lower or 'graduate' in title_lower:
            qual = ['12th Pass', 'Graduate']
        elif 'group d' in title_lower or 'track' in title_lower:
            qual = ['10th Pass']
        elif 'je' in title_lower or 'junior engineer' in title_lower:
            qual = ['Diploma', 'Graduate']
        elif 'alp' in title_lower or 'loco pilot' in title_lower:
            qual = ['10th Pass', 'ITI']
        else:
            qual = ['10th Pass']
        item['qualifications'] = {'mandatory': qual}

        if response:
            page_text = ' '.join(response.css('*::text').getall())
            item['total_vacancies'] = self._extract_number(page_text)
            item['apply_end_date']  = self._extract_date(page_text)

            pdf_links = response.css("a[href$='.pdf']::attr(href)").getall()
            if pdf_links:
                item['notification_pdf'] = response.urljoin(pdf_links[0])

        return item

    def _get_type(self, title):
        title_lower = title.lower()
        if 'result' in title_lower or 'merit list' in title_lower:
            return 'result'
        elif 'admit' in title_lower or 'call letter' in title_lower:
            return 'admit-card'
        elif 'answer key' in title_lower:
            return 'answer-key'
        elif 'syllabus' in title_lower:
            return 'syllabus'
        else:
            return 'job'

    def _extract_number(self, text):
        """Extract vacancy count near keywords"""
        for keyword in ['vacancies', 'posts', 'vacancy', 'seats']:
            pattern = rf'(\d[\d,]+)\s*{keyword}|{keyword}[:\s]+(\d[\d,]+)'
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                num_str = match.group(1) or match.group(2)
                return int(num_str.replace(',', ''))
        return None

    def _extract_date(self, text):
        """Extract application closing date"""
        month_map = {
            'january': 1, 'february': 2, 'march': 3, 'april': 4,
            'may': 5, 'june': 6, 'july': 7, 'august': 8,
            'september': 9, 'october': 10, 'november': 11, 'december': 12,
            'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4,
            'jun': 6, 'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12,
        }

        for keyword in ['last date', 'closing date', 'apply before', 'apply by', 'till']:
            idx = text.lower().find(keyword)
            if idx == -1:
                continue
            window = text[idx:idx + 150]

            # Pattern: "15 January 2025" or "15 Jan 2025"
            m = re.search(
                r'(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})',
                window, re.IGNORECASE
            )
            if m:
                day   = int(m.group(1))
                month = month_map.get(m.group(2).lower(), 0)
                year  = int(m.group(3))
                if month:
                    return f"{year:04d}-{month:02d}-{day:02d}"

            # Pattern: "15/01/2025" or "15-01-2025"
            m2 = re.search(r'(\d{2})[/-](\d{2})[/-](\d{4})', window)
            if m2:
                return f"{m2.group(3)}-{m2.group(2)}-{m2.group(1)}"

        return None

    def handle_error(self, failure):
        self.logger.warning(f"Request failed: {failure.request.url}")
