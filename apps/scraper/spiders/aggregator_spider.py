# ============================================================
# spiders/aggregator_spider.py — Aggregator Site Scraper
#
# ⚠️  DISABLED — Third-party content scraping removed.
#
# All sites below (sarkarijobfind, jobrasta, sarkariresult, sarkaridisha,
# sarkarinaukri) are COMMERCIAL THIRD-PARTY WEBSITES that own their content.
# Scraping them without permission creates:
#   - Copyright infringement liability
#   - Terms of Service violations
#   - Privacy policy / data protection issues
#
# ExamUdaan only scrapes OFFICIAL GOVERNMENT SOURCES:
#   SSC, UPSC, RRB, IBPS, SBI, NTA, BPSC, state PSCs,
#   municipal corporations, research institutes, PSUs.
#
# This spider now runs with an empty AGGREGATOR_SITES list (no-op).
# To restore any site, move it back into AGGREGATOR_SITES ONLY IF:
#   1. The site is an official government portal, OR
#   2. You have explicit written permission from the site owner.
# ============================================================

import scrapy
import re
import feedparser
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin
from pipelines import DeduplicationPipeline
from datetime import datetime


# ---- Aggregator site configurations ----
# ⚠️  ALL THIRD-PARTY SITES DISABLED — see header comment above.
#
# DISABLED SITES (commercial third-party — do NOT re-enable without permission):
#
# AGGREGATOR_SITES = [
#     {
#         'name': 'sarkarijobfind',           # sarkarijobfind.com — private commercial site
#         'rss': 'https://sarkarijobfind.com/feed/',
#         ....
#     },
#     {
#         'name': 'sarkarinaukri',            # sarkarinaukri.com — private commercial site
#         'rss': 'https://sarkarinaukri.com/feed/',
#         ....
#     },
#     {
#         'name': 'sarkariresult_com',        # sarkariresult.com — private commercial site
#         'rss': 'https://www.sarkariresult.com/feed/',
#         ....
#     },
#     {
#         'name': 'jobrasta',                 # jobrasta.com — private commercial site
#         'rss': 'https://jobrasta.com/feed/',
#         ....
#     },
#     {
#         'name': 'sarkariresult_co',         # sarkariresult.co — private commercial site
#         'rss': 'https://www.sarkariresult.co/feed/',
#         ....
#     },
#     {
#         'name': 'sarkaridisha',             # sarkaridisha.com — private commercial site
#         'rss': 'https://www.sarkaridisha.com/feed/',
#         ....
#     },
# ]

# Empty — no sites to crawl. Spider runs but yields nothing.
AGGREGATOR_SITES = []

# Build lookup maps
SITE_BY_RSS = {s['rss']: s for s in AGGREGATOR_SITES}
SITE_BY_NAME = {s['name']: s for s in AGGREGATOR_SITES}


class AggregatorSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Comprehensive aggregator spider.

    Two-phase crawl:
    Phase 1 (RSS) — fetch latest posts immediately (fast, low bandwidth)
    Phase 2 (Pagination) — walk through listing pages to get all historical posts

    Each individual post page is fetched to extract:
    - Full "Post Wise Vacancy Details" tables
    - Important dates from structured HTML
    - Official PDF / apply links
    - post_type categorization

    Stealth: User-Agent and headers are rotated by middlewares.py
    """

    name = "aggregator"
    default_notification_type = 'recruitment' # fallback for items with generic titles
    start_urls = [s['rss'] for s in AGGREGATOR_SITES]

    def parse(self, response):
        """Phase 1: Parse RSS feeds."""
        self.logger.info(f"Parsing RSS feed: {response.url}")
        site = SITE_BY_RSS.get(response.url, {})

        # Guard: some sites send brotli-compressed feeds that may not decode correctly
        try:
            feed_text = response.text
        except AttributeError:
            self.logger.warning(f"Could not decode RSS response (non-text) for: {response.url}")
            # Still kick off pagination for this site
            site_name = site.get('name', '')
            if site_name:
                listing_url = site['listing'].format(page=site.get('listing_start', 2))
                yield scrapy.Request(
                    listing_url,
                    callback=self.parse_listing,
                    meta={'site_name': site_name, 'page': site.get('listing_start', 2)},
                    errback=self.handle_error,
                )
            return

        feed = feedparser.parse(feed_text)
        force_page_fetch = site.get('force_page_fetch', False)

        for entry in feed.entries:
            title = entry.get('title', '').strip()
            url   = entry.get('link', '').strip()
            pub_date = self._parse_rss_date(entry.get('published', ''))

            if not title or len(title) < 8:
                continue

            # Try to parse HTML from the RSS body first (saves an extra HTTP request)
            html_body = ''
            if hasattr(entry, 'content') and entry.content:
                html_body = entry.content[0].get('value', '')
            elif hasattr(entry, 'summary'):
                html_body = entry.get('summary', '')

            # Detect YouTube-based RSS bodies (jobrasta posts YouTube video embeds
            # in their RSS instead of actual job content — useless for extraction)
            is_youtube_content = (
                'youtube.com' in html_body or
                'youtu.be' in html_body or
                'In this Video we discuss' in html_body or
                html_body.strip().startswith('In this Video')
            )

            # Decide whether to parse inline or fetch the full page
            should_fetch_page = (
                force_page_fetch or
                is_youtube_content or
                not html_body or
                len(html_body) < 500
            )

            if not should_fetch_page:
                # We have enough usable HTML — parse directly (fast path)
                item = self._parse_post(title, url, html_body, site.get('name', 'aggregator'), pub_date)
                if item:
                    yield item
            else:
                # Fetch the full post page for proper structured content
                yield response.follow(
                    url,
                    callback=self.parse_post_page,
                    meta={
                        'title': title,
                        'pub_date': pub_date,
                        'site_name': site.get('name', 'aggregator'),
                        'content_css': site.get('content_css', '.entry-content'),
                    },
                    errback=self.handle_error,
                )

        # Phase 2: Kick off pagination from listing pages
        site_name = site.get('name', '')
        if site_name:
            listing_start = site.get('listing_start', 2)
            listing_url = site['listing'].format(page=listing_start)
            yield scrapy.Request(
                listing_url,
                callback=self.parse_listing,
                meta={
                    'site_name': site_name,
                    'page': listing_start,
                },
                errback=self.handle_error,
            )
            # Also crawl extra category listings (e.g. jobrasta's admit-card, results pages)
            for extra_template in site.get('extra_listings', []):
                extra_url = extra_template.format(page=1)
                yield scrapy.Request(
                    extra_url,
                    callback=self.parse_listing,
                    meta={
                        'site_name': site_name,
                        'page': 1,
                        'listing_template': extra_template,
                    },
                    errback=self.handle_error,
                )

    def parse_listing(self, response):
        """Phase 2: Parse a listing/category page and follow all post links + next page."""
        site_name = response.meta.get('site_name', '')
        page = response.meta.get('page', 1)
        site = SITE_BY_NAME.get(site_name, {})

        self.logger.info(f"[{site_name}] Parsing listing page {page}: {response.url}")

        # Guard: skip non-HTML responses (brotli decode failures, binary, etc.)
        try:
            _ = response.text  # triggers decode — will raise if brotli not installed or binary
        except Exception as e:
            self.logger.warning(f"[{site_name}] Cannot decode listing page {page}: {e}")
            return

        post_link_css = site.get('post_link_css', 'h2 a, article h2 a')
        content_css   = site.get('content_css', '.entry-content')

        # Extract all post links on this listing page
        try:
            post_links = response.css(post_link_css)
        except Exception:
            post_links = []
        if not post_links:
            self.logger.warning(f"[{site_name}] No post links found on page {page}")


        for link in post_links:
            url   = response.urljoin(link.attrib.get('href', ''))
            title = link.css('::text').get('').strip()
            if url and title and len(title) > 5:
                yield response.follow(
                    url,
                    callback=self.parse_post_page,
                    meta={
                        'title': title,
                        'site_name': site_name,
                        'content_css': content_css,
                    },
                    errback=self.handle_error,
                )

        # Pagination: follow "Next Page" link up to max_pages
        max_pages = site.get('max_pages', 30)
        # Use the template from meta (for extra_listings) or fall back to site default
        listing_template = response.meta.get('listing_template') or site.get('listing', '')

        if page < max_pages:
            next_page_css = site.get('next_page_css', 'a.next')
            next_links = response.css(next_page_css)

            if next_links:
                # CSS next-page link found — follow it directly
                next_url = response.urljoin(next_links[0].attrib.get('href', ''))
                yield scrapy.Request(
                    next_url,
                    callback=self.parse_listing,
                    meta={
                        'site_name': site_name,
                        'page': page + 1,
                        'listing_template': listing_template,
                    },
                    errback=self.handle_error,
                )
            elif listing_template:
                # Fallback: construct URL from template
                next_url = listing_template.format(page=page + 1)
                yield scrapy.Request(
                    next_url,
                    callback=self.parse_listing,
                    meta={
                        'site_name': site_name,
                        'page': page + 1,
                        'listing_template': listing_template,
                    },
                    errback=self.handle_error,
                )

    def parse_post_page(self, response):
        """Fetch and parse a full individual post page."""
        # Guard: skip non-HTML responses (PDFs, images, binary files)
        content_type = response.headers.get('Content-Type', b'').decode('utf-8', errors='ignore').lower()
        if 'text/html' not in content_type and 'text/plain' not in content_type:
            self.logger.debug(f"Skipping non-HTML response ({content_type}): {response.url}")
            return

        title       = response.meta.get('title', '')
        site_name   = response.meta.get('site_name', 'aggregator')
        content_css = response.meta.get('content_css', '.entry-content')
        pub_date    = response.meta.get('pub_date')

        # Try configured selector first, then common fallbacks
        selectors = [content_css] + [
            '.entry-content', '.post-content', 'article .content',
            '.elementor-widget-text-editor', 'main article', '.job-content'
        ]
        html_body = ''
        for sel in selectors:
            try:
                html_body = response.css(sel).get('')
            except Exception:
                continue
            if html_body and len(html_body) > 200:
                break

        # Title fallback from page H1
        if not title:
            title = response.css('h1::text, h1 a::text').get('').strip()

        item = self._parse_post(title, response.url, html_body, site_name, pub_date)
        if item:
            yield item

    def _parse_post(self, title, url, html_body, site_name, pub_date=None):
        """Parse a post from its HTML body into an ExamPost item."""
        if not title or len(title) < 6:
            return None

        # Dedup check — skip already-crawled post URLs
        import hashlib
        _dedup_hash = hashlib.sha256(f"AGG_{url}".encode()).hexdigest()
        if self.track_duplicate(_dedup_hash, label=title, urls=[url]):
            return None

        item = ExamPost()
        item['title']            = title
        item['type']             = self._get_type(title)
        item['board_slug']       = self._get_board_slug(title, html_body)
        item['source_url']       = url
        item['official_website'] = self._extract_official_link(html_body)
        item['html_body']        = html_body   # passed to GeminiExtractionPipeline

        # Dates
        item['notification_date']  = pub_date
        item['application_end']    = self._extract_date(html_body, [
            'last date', 'closing date', 'last day', 'apply online'
        ])
        item['application_start']  = self._extract_date(html_body, [
            'online application start', 'application start', 'start date'
        ])
        # Use dedicated exam_date_text extractor (filters noise, returns clean date string)
        item['exam_date_text']     = self._extract_exam_date_text(html_body)

        # Job details
        item['vacancies']          = self._extract_vacancies(html_body)
        item['age_min'], item['age_max'] = self._extract_age(html_body)
        item['qualification']      = self._extract_qualification(title, html_body)
        item['state']              = self._extract_state(title, html_body)
        item['apply_url']          = self._extract_apply_url(html_body)
        item['short_description']  = self._extract_description(html_body, title)

        # Notification PDF
        pdf = re.search(r'href=["\']([^"\']+\.pdf)["\']', html_body, re.IGNORECASE)
        if pdf:
            item['notification_pdf_url'] = pdf.group(1)

        return item

    # ================================================================
    # Extraction helpers
    # ================================================================

    def _get_type(self, title):
        t = title.lower()
        if any(k in t for k in ['result', 'merit list', 'final result', 'selected']):
            return 'result'
        if any(k in t for k in ['admit card', 'hall ticket', 'call letter', 'e-admit']):
            return 'admit-card'
        if any(k in t for k in ['answer key', 'answer-key', 'provisional answer']):
            return 'answer-key'
        if any(k in t for k in ['syllabus', 'exam pattern', 'curriculum']):
            return 'syllabus'
        return 'job'

    def _get_board_slug(self, title, html):
        t = (title + ' ' + html[:500]).lower()
        # Ordered from most-specific to least-specific to avoid false matches
        boards = {
            # Central bodies
            'upsc':     ['upsc', 'union public service', 'civil services', 'ias ', 'ips '],
            'ssc':      ['ssc cgl', 'ssc chsl', 'ssc mts', 'ssc gd', 'staff selection commission'],
            'rrb':      ['rrb ', 'railway recruitment', 'ntpc', ' alp ', 'je rrb', 'loco pilot', 'group d rail'],
            'ibps':     ['ibps', 'bank po', 'bank clerk', 'rrb po', 'rrb clerk'],
            'sbi':      ['sbi ', 'state bank of india', 'sbi po', 'sbi clerk'],
            'nta':      ['nta ', 'jee main', 'jee advanced', 'neet ug', 'neet pg', 'cuet', 'ugc-net', 'ugc net', 'cmat'],
            'isro':     ['isro', 'icrb', 'ursc ', 'vssc '],
            'drdo':     ['drdo', 'defence research'],
            # Defence services
            'army':     ['army', 'soldier gd', 'soldier tech', 'military', 'nda army', 'cds army'],
            'navy':     ['navy', 'naval ', 'indian navy'],
            'airforce': ['air force', 'airforce', 'afcat', 'iaf '],
            # State PSCs — ordered to avoid partial matches
            'uppsc':    ['uppsc', 'uttar pradesh public service', 'up psc', 'up state commission'],
            'bpsc':     ['bpsc', 'bihar public service', 'bihar psc'],
            'mpsc':     ['mpsc', 'maharashtra public service', 'maharashtra psc'],
            'rpsc':     ['rpsc', 'rajasthan public service', 'rajasthan psc'],
            'jssc':     ['jssc', 'jharkhand staff selection', 'jharkhand psc'],
            'hpsc':     ['hpsc', 'haryana public service'],
            'hssc':     ['hssc', 'haryana staff selection'],
            'uksssc':   ['uksssc', 'uttarakhand staff selection', 'uttarakhand ssc'],
            'ukpsc':    ['ukpsc', 'uttarakhand public service'],
            'tnpsc':    ['tnpsc', 'tamil nadu public service', 'tamil nadu psc'],
            'tnusrb':   ['tnusrb', 'tamil nadu police'],
            'wbpsc':    ['wbpsc', 'west bengal public service', 'wb psc'],
            'wbssc':    ['wbssc', 'west bengal school service'],
            'kpsc':     ['kpsc', 'karnataka public service', 'karnataka psc'],
            'gpsc':     ['gpsc', 'gujarat public service', 'gujarat psc'],
            'ppsc':     ['ppsc', 'punjab public service', 'punjab psc'],
            'hppsc':    ['hppsc', 'himachal public service', 'himachal psc'],
            'mppsc':    ['mppsc', 'madhya pradesh public service', 'mp psc'],
            'opsc':     ['opsc', 'odisha public service', 'odisha psc'],
            'osssc':    ['osssc', 'odisha sub-ordinate'],
            'apsc':     ['apsc', 'assam public service'],
            # Common central PSUs
            'hal':      ['hal ', 'hindustan aeronautics'],
            'bel':      ['bel ', 'bharat electronics'],
            'sail':     ['sail ', 'steel authority'],
            'ongc':     ['ongc', 'oil and natural gas'],
            'bpcl':     ['bpcl', 'bharat petroleum'],
            'aiims':    ['aiims', 'norcet'],
            'nhpc':     ['nhpc', 'national hydro'],
        }
        for slug, keywords in boards.items():
            if any(kw in t for kw in keywords):
                return slug
        return 'central-govt'

    def _extract_date(self, html, keywords):
        text = re.sub(r'<[^>]+>', ' ', html)
        text = re.sub(r'&[a-z#0-9]+;', ' ', text)
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
                r'september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)'
                r'\s+(\d{4})',
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

    def _extract_exam_date_text(self, html):
        """
        Extract exam date as a clean, human-readable string.
        Returns something like "August 2026" or "15 September 2026" — NOT
        surrounding paragraph noise.
        """
        text = re.sub(r'<[^>]+>', ' ', html)
        text = re.sub(r'&[a-z#0-9]+;', ' ', text)
        text = re.sub(r'\s+', ' ', text)

        keywords = ['exam date', 'examination date', 'written exam date', 'computer based test']
        month_names = (
            'january|february|march|april|may|june|july|august|september|'
            'october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec'
        )

        for kw in keywords:
            idx = text.lower().find(kw)
            if idx == -1:
                continue
            window_text = text[idx:idx + 250]

            # Try to find a specific date pattern near the keyword
            m = re.search(
                r'(\d{1,2}[\s/-](?:' + month_names + r')[\s/-]\d{4}|'
                r'(?:' + month_names + r')\s+\d{4}|'
                r'\d{1,2}/\d{1,2}/\d{4})',
                window_text, re.IGNORECASE
            )
            if m:
                return m.group(0).strip()[:80]

        return None

    def _extract_vacancies(self, html):
        text = re.sub(r'<[^>]+>', ' ', html)
        for pattern in [
            r'(\d[\d,]+)\s*(?:posts?|vacancies|vacancy|seats?)',
            r'(?:total\s*)?(?:posts?|vacancies|vacancy)\s*[:\-–]?\s*(\d[\d,]+)',
            r'(?:no\.?\s*of\s*posts?|number\s*of\s*posts?)\s*[:\-–]?\s*(\d[\d,]+)',
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

    def _extract_age(self, html):
        text = re.sub(r'<[^>]+>', ' ', html)
        age_min = age_max = None
        m = re.search(r'minimum\s*age\s*[:\-–]?\s*(\d{2})\s*years?', text, re.IGNORECASE)
        if m:
            age_min = int(m.group(1))
        m = re.search(r'maximum\s*age\s*[:\-–]?\s*(\d{2})\s*years?', text, re.IGNORECASE)
        if m:
            age_max = int(m.group(1))
        if not age_min or not age_max:
            m = re.search(r'(\d{2})\s*(?:to|-)\s*(\d{2})\s*years?', text, re.IGNORECASE)
            if m:
                age_min = age_min or int(m.group(1))
                age_max = age_max or int(m.group(2))
        return age_min, age_max

    def _extract_qualification(self, title, html):
        text = (title + ' ' + re.sub(r'<[^>]+>', ' ', html)).lower()
        quals = []
        if any(k in text for k in ['10th', 'matriculation', 'class 10', 'class x']):
            quals.append('10th Pass')
        if any(k in text for k in ['12th', 'intermediate', 'class 12', 'higher secondary']):
            quals.append('12th Pass')
        if 'diploma' in text:
            quals.append('Diploma')
        if any(k in text for k in ['b.tech', 'b.e.', 'engineering degree']):
            quals.append('B.Tech/B.E.')
        if any(k in text for k in ['graduate', 'graduation', 'degree', 'b.sc', 'b.com', 'b.a.']):
            quals.append('Graduate')
        if any(k in text for k in ['post graduate', 'postgraduate', 'master']):
            quals.append('Post Graduate')
        return quals if quals else ['Graduate']

    def _extract_state(self, title, html):
        text = (title + ' ' + re.sub(r'<[^>]+>', ' ', html[:2000])).lower()
        state_map = {
            'UP': ['uttar pradesh', 'uppsc', 'up govt'],
            'Bihar': ['bihar', 'bpsc', 'bssc'],
            'Rajasthan': ['rajasthan', 'rsmssb', 'rpsc'],
            'Maharashtra': ['maharashtra', 'mpsc'],
            'Gujarat': ['gujarat', 'gpsc'],
            'MP': ['madhya pradesh', 'mppsc'],
            'Haryana': ['haryana', 'hpsc', 'hssc'],
            'Punjab': ['punjab', 'ppsc'],
            'Jharkhand': ['jharkhand', 'jssc'],
            'Odisha': ['odisha', 'opsc', 'osssc'],
        }
        for state, keywords in state_map.items():
            if any(kw in text for kw in keywords):
                return [state]
        return ['All India']

    def _extract_official_link(self, html):
        links = re.findall(r'href=["\']([^"\']+)["\']', html)
        for link in links:
            if any(d in link for d in ['.gov.in', '.nic.in', '.ac.in']):
                return link
        return None

    def _extract_apply_url(self, html):
        """
        Extract the online application URL.
        Strategy:
        1. Find any link whose visible text contains 'apply' or 'online form'
        2. Prefer .gov.in / .nic.in links (official)
        3. Fall back to any link with 'apply' in the href
        """
        # Find all <a href='...'> tags and their text
        link_pattern = re.compile(
            r'href=["\']([^"\'\s]+)["\'][^>]*>(.*?)</a>',
            re.IGNORECASE | re.DOTALL
        )
        apply_keywords = ['apply online', 'apply now', 'online form', 'online apply', 'apply here']

        gov_links = []
        any_links = []

        for m in link_pattern.finditer(html):
            href = m.group(1).strip()
            link_text = re.sub(r'<[^>]+>', '', m.group(2)).strip().lower()

            # Skip empty, javascript, anchor-only, and PDF links
            if not href or href.startswith('#') or href.startswith('javascript') or href.endswith('.pdf'):
                continue

            has_apply_text = any(kw in link_text for kw in apply_keywords)
            has_apply_href = 'apply' in href.lower() or 'registration' in href.lower()
            is_gov = any(d in href for d in ['.gov.in', '.nic.in'])

            if has_apply_text or has_apply_href:
                if is_gov:
                    gov_links.append(href)
                else:
                    any_links.append(href)

        # Return best match: prefer .gov.in links
        if gov_links:
            return gov_links[0]
        if any_links:
            return any_links[0]
        return None

    def _extract_description(self, html, title):
        text = re.sub(r'<[^>]+>', ' ', html)
        text = re.sub(r'&[a-z#0-9]+;', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        idx = text.lower().find('about post')
        if idx != -1:
            snippet = text[idx:idx + 400]
            snippet = re.sub(r'^about\s*post\s*[:\-–]?\s*', '', snippet, flags=re.IGNORECASE)
            return snippet[:300].strip()
        return text[:250].strip() if text else f"Apply for {title}."

    def _parse_rss_date(self, date_str):
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
        self.logger.warning(f"Request failed [{failure.value}]: {failure.request.url}")
