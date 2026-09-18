# spiders/dedup_mixin.py
"""
Reusable duplicate tracker and relevance filter.

Provides utilities for every spider that inherits this mixin:

1. track_duplicate()      — stops spider after N consecutive duplicates.
2. is_irrelevant_link()   — returns True if a link title / URL looks like
                            administrative noise we do NOT want to scrape
                            (tenders, press releases, application summaries, etc.).
                            Call this in parse() before yielding a request so
                            irrelevant pages are never fetched.
3. should_skip_link()     — convenience method that combines both checks:
                            is_irrelevant_link() + DeduplicationPipeline.is_known().
                            Use this in any spider's parse() for a single-line
                            filter that blocks junk AND already-scraped URLs.
4. is_stale_date()        — returns True if a date string is older than
                            MAX_ITEM_AGE_DAYS (default: 21 days / 3 weeks).
                            Use this to skip old notifications at crawl time.

We only want these notification types:
  recruitment | result | admit_card | answer_key | syllabus
"""
from scrapy.exceptions import CloseSpider


class DuplicateStopMixin:

    # -------------------------------------------------------------------
    # Keywords in a link title or URL path that signal irrelevant content.
    # Checked by is_irrelevant_link() — case-insensitive substring match.
    # Keep in sync with _IRRELEVANT_TITLE_KEYWORDS in pipelines.py.
    # -------------------------------------------------------------------
    IRRELEVANT_KEYWORDS = (
        # Application statistics / summary reports (e.g. RRB APPLN SUMMARY)
        'appln summary', 'application summary', 'applicant summary',
        'applications received', 'application statistics',
        # Tenders / procurement
        'tender', 'quotation', 'rate contract', 'e-tender',
        'notice inviting tender',
        # Press / media
        'press release', 'press note', 'media release',
        # Annual reports / RTI / minutes
        'annual report', 'annual accounts', 'annual statement',
        'minutes of meeting', 'meeting minutes',
        # RTI — avoid substring false-positives on 'district'/'contribution' etc.
        ' rti ', '/rti/', 'rti_',
        # Misc administrative noise
        'office order', 'office memorandum', 'circular',
        'transfer order', 'posting order', 'seniority list',
        'pay revision', 'dpc meeting', 'vigilance',
        # Transfer/posting notifications (not recruitment)
        'transfer/posting', 'transfer & posting', 'transfer and posting',
        'transfer list', 'posting list',
        # Policy / wording documents
        'wording policy', 'policy document', 'action plan for',
        # IT / Technical documents
        'user manual', 'instruction manual', 'installation guide',
        'technical guide', 'procedure to configure',
        'vpn ', 'site preparation', 'case management', 'cis 3.0',
        'click here to download',
        # Court / legal documents
        'court order', 'court notice', 'judgment', 'cause list',
        # HR/admin manuals
        'mfn/la', 'cases manual', 'leave policy', 'leave rules',
        'pension rules', 'service rules',
        # Noise URL path segments
        '/tender/', '/tenders/', '/circular/', '/circulars/',
        '/office-order/', '/orders/', '/memo/', '/rti/',
        '/budget/', '/audit/', '/annual-report/', '/vigilance/',
        '/transfer/', '/posting/', '/seniority/', '/procurement/',
        '/quotation/',
        # Finance/creditor noise (e.g. NIACL PDF of creditor lists)
        'sundry_creditor', 'sundry creditor', 'outstanding_dues',
        'outstanding dues', 'list_of_creditor', 'creditor_list',
        'msme_outstanding', 'msme outstanding',
        # Vendor / empanelment
        'empanelment', 'tie-up', 'tie up',
        # Generic document noise
        'brochure', 'magazine', 'newsletter',
    )

    # -------------------------------------------------------------------
    # Minimum number of characters a link title must have to be considered
    # a valid notification. Single words like "Apply", "Post", "Jobs",
    # "Download" are button/nav texts — not real notification titles.
    # -------------------------------------------------------------------
    MIN_TITLE_LENGTH = 15

    # -------------------------------------------------------------------
    # URL path segments that confirm a link IS career/recruitment related.
    # is_valid_career_url() requires at least one of these in the URL path
    # OR the title when the URL path is generic.
    # -------------------------------------------------------------------
    CAREER_PATH_KEYWORDS = (
        'career', 'careers', 'recruit', 'recruitment', 'vacancy', 'vacancies',
        'job', 'jobs', 'opening', 'hiring', 'advertisement', 'advt',
        'notification', 'apply', 'result', 'admit', 'admit-card',
        'hall-ticket', 'answer-key', 'syllabus', 'admit_card', 'answer_key',
        'bharti', 'naukri',
    )

    # -------------------------------------------------------------------
    # PDF URL path patterns that are NEVER valid recruitment pages.
    # Matched against the full URL path (case-insensitive).
    # -------------------------------------------------------------------
    NOISE_PDF_PATH_PATTERNS = (
        'sundry', 'outstanding_dues', 'outstanding-dues', 'creditor',
        'msme', 'list_of_', 'vendor', 'empanelment', 'rate_contract',
        'annual_report', 'annual-report', 'brochure', 'magazine',
        'newsletter', 'minutes_of', 'minutes-of',
        'bank_detail', 'bank-detail', 'holiday', 'leave_',
    )

    def is_irrelevant_link(self, title: str, href: str = '') -> bool:
        """
        Return True if the link looks like administrative noise rather than
        a recruitment / result / admit-card / answer-key / syllabus page.

        Also rejects titles shorter than MIN_TITLE_LENGTH — single words
        like "Apply", "Post", "Jobs", "Download" are nav/button texts, not
        real notification titles.

        Usage in spider parse():
            if self.is_irrelevant_link(title, href):
                continue          # or return / skip the request
        """
        title_str = str(title).strip()

        # Reject very short titles — they are navigation buttons, not notifications
        if len(title_str) < self.MIN_TITLE_LENGTH:
            return True

        combined = (title_str + ' ' + str(href)).lower()
        return any(kw in combined for kw in self.IRRELEVANT_KEYWORDS)

    def is_valid_career_url(self, url: str, title: str = '') -> bool:
        """
        Return True only if the URL is a valid career/recruitment page.

        Rules (applied in order):
          1. If URL ends in .pdf AND contains a noise path pattern → False
          2. If URL path contains a career keyword → True
          3. If title contains a career/recruitment keyword → True
          4. Otherwise → False

        Examples:
          newindia.co.in/.../list_of_sundry_creditors/...pdf  → False ✗
          sidbi.in/en/careers/consultant-roles                 → True  ✓
          licindia.in/careers/recruitment-2026                 → True  ✓
          gailonline.com/Career.html                           → True  ✓
        """
        if not url:
            return True

        url_lower   = str(url).lower()
        title_lower = str(title).lower()

        # Rule 1: Reject noise PDF paths even if they contain 'career' in domain
        if url_lower.endswith('.pdf'):
            for noise in self.NOISE_PDF_PATH_PATTERNS:
                if noise in url_lower:
                    return False

        # Rule 2: Check URL path for career keywords
        from urllib.parse import urlparse
        try:
            path = urlparse(url_lower).path
        except Exception:
            path = url_lower
        for kw in self.CAREER_PATH_KEYWORDS:
            if kw in path:
                return True

        # Rule 3: Check title for career/recruitment keywords
        career_title_kws = (
            'recruit', 'vacancy', 'vacancies', 'job', 'hiring',
            'advertisement', 'advt', 'notification', 'apply',
            'result', 'admit card', 'answer key', 'syllabus',
            'hall ticket', 'call letter', 'walk-in', 'walk in',
            'bharti', 'post', 'opening', 'selection',
        )
        for kw in career_title_kws:
            if kw in title_lower:
                return True

        return False  # neither URL path nor title suggests recruitment

    def should_skip_link(self, title: str, href: str = '') -> bool:
        """
        Single-call convenience filter for use inside any spider's parse().

        Returns True (→ skip this link) if:
          a) The title/href matches IRRELEVANT_KEYWORDS (tenders, press, etc.), OR
          b) The URL is already in the DB (already scraped — avoid re-work)

        Usage in spider parse():
            for link in response.css('a'):
                title = link.css('::text').get('').strip()
                href  = link.attrib.get('href', '')
                url   = response.urljoin(href)
                if self.should_skip_link(title, url):   # ← one line does it all
                    continue
                yield response.follow(url, ...)
        """
        # 1. Relevance check — drop admin noise before making any HTTP request
        if self.is_irrelevant_link(title, href) or not self.is_valid_career_url(href):
            return True

        # 2. Dedup check — skip already-scraped URLs (saves HTTP requests + Gemini quota)
        from pipelines import DeduplicationPipeline
        url = str(href).strip()
        if url and DeduplicationPipeline.is_known(url):
            return True

        return False

    MAX_CONSECUTIVE_DUPLICATES = 2  # Stop after 2 repeated items in a row and move to next spider

    # Items older than this are considered stale and skipped.
    # Set to None on a spider class to disable the age check for that spider.
    MAX_ITEM_AGE_DAYS = 21   # 3 weeks

    def is_stale_date(self, date_str: str) -> bool:
        """
        Return True if the date is older than MAX_ITEM_AGE_DAYS.
        Accepts any date string that dateutil.parser can parse
        (e.g. "15 Aug 2026", "2026-08-15", "15/08/2026").
        Returns False (not stale) if the date cannot be parsed
        so we don't accidentally drop items with unparseable dates.

        Usage in spider parse():
            date_text = row.css('td.date::text').get('')
            if self.is_stale_date(date_text):
                self.logger.debug(f'Skipping old item: {date_text}')
                continue
        """
        if not date_str or self.MAX_ITEM_AGE_DAYS is None:
            return False   # can't determine age — let it through
        try:
            from datetime import datetime, timezone
            from dateutil import parser as date_parser
            parsed = date_parser.parse(str(date_str), dayfirst=True)
            # Make timezone-aware for safe comparison
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            now = datetime.now(timezone.utc)
            age_days = (now - parsed).days
            return age_days > self.MAX_ITEM_AGE_DAYS
        except Exception:
            return False   # unparseable date — let it through

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.consecutive_duplicates = 0
        self.total_duplicates = 0
        self.total_new_items = 0

    def track_duplicate(self, dedup_hash, label="", urls=None):
        """
        Returns True  → item is a duplicate (skip it)
        Returns False → item is NEW (counter reset)
        Raises CloseSpider → when 2 consecutive duplicates reached
        """
        from pipelines import DeduplicationPipeline

        # Check hash against known hashes or known URLs
        is_dup = (
            DeduplicationPipeline.is_hash_known(dedup_hash)
            or DeduplicationPipeline.is_known(dedup_hash)
        )

        # Also check raw URLs (source_url, pdf_url, etc.)
        if not is_dup and urls:
            for u in urls:
                if u and DeduplicationPipeline.is_known(u):
                    is_dup = True
                    break

        if is_dup:
            self.consecutive_duplicates += 1
            self.total_duplicates += 1
            spider_name = getattr(self, 'name', 'spider')
            self.logger.info(
                f"[{spider_name}] [DUP {self.consecutive_duplicates}/{self.MAX_CONSECUTIVE_DUPLICATES}] "
                f"Duplicate found: {str(label)[:60]}"
            )
            if self.consecutive_duplicates >= self.MAX_CONSECUTIVE_DUPLICATES:
                self.logger.info(
                    f"[{spider_name}] 🛑 Reached {self.MAX_CONSECUTIVE_DUPLICATES} consecutive duplicates. "
                    f"Stopping spider early and moving forward (new={self.total_new_items}, dups={self.total_duplicates})."
                )
                raise CloseSpider(
                    f"Stopped early: {self.MAX_CONSECUTIVE_DUPLICATES} consecutive duplicates "
                    f"(new={self.total_new_items}, dups={self.total_duplicates})"
                )
            return True

        # NEW item → reset consecutive counter
        self.consecutive_duplicates = 0
        self.total_new_items += 1
        return False

    def closed(self, reason):
        spider_name = getattr(self, 'name', 'spider')
        self.logger.info(
            f"[{spider_name} DEDUP SUMMARY] reason={reason} | new={self.total_new_items} | dups={self.total_duplicates}"
        )