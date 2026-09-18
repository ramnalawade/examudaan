# ============================================================
# pipelines.py — What happens after a spider finds something
# Redesigned: Now writes to PostgreSQL directly via psycopg2
# matching the flexible multi-state, multi-language schema:
#   exam_notifications + posts + organizations
#
# Flow:
#   DeduplicationPipeline (10) → GeminiExtractionPipeline (50)
#   → PostgresPipeline (200) → CrawlSummaryEmailPipeline (400)
#
# DATA FLOW INSIDE AN ITEM:
#   1. Spider fills: basic fields + state_slug + lang + is_walk_in (from HTML)
#                    + ai_extracted_data = {}  (empty dict)
#   2. Gemini fills: ai_extracted_data with salary, quals, venue, etc. from PDF
#   3. Pipeline: promotes key values from ai_extracted_data into
#                first-class filter columns (salary_min, max_age_limit, etc.)
#   4. Postgres: stores everything — fast indexed columns + flexible JSONB
# ============================================================

import hashlib
import json
import os, sys
import re
import requests
from datetime import datetime
from scrapy.exceptions import DropItem

import db as pg_db  # our custom db.py module


# ============================================================
# Notification Type Classifier
# Matches title keywords (priority order: correction > result > answer_key
# > admit_card > syllabus > recruitment > other)
# ============================================================

_NOTIFICATION_TYPE_RULES = [
    # Rules applied top-to-bottom; LAST match wins (higher priority = later).
    # IMPORTANT: keep keywords specific — generic words like 'apply' / 'post'
    # match too many non-recruitment titles (manuals, notices, court orders).
    ('recruitment', [
        'recruitment', 'vacancy', 'vacancies', 'bharti',
        'advertisement', 'advt', 'hiring',
        'walk-in', 'walk in', 'walkin', 'naukri',
        'open position', 'open post', 'career opportunity',
        'job notification', 'job opening', 'job advertisement',
        'direct recruitment', 'lateral recruitment',
        'fresh recruitment', 'new recruitment',
        'applications invited', 'application invited',
        'apply online', 'apply now',
    ]),
    ('syllabus', [
        'syllabus', 'exam pattern', 'curriculum', 'study plan', 'paper pattern',
    ]),
    ('admit_card', [
        'admit card', 'hall ticket', 'call letter', 'e-admit', 'e admit',
        'pravesh patra', 'interview letter', 'interview schedule',
    ]),
    ('answer_key', [
        'answer key', 'answerkey', 'answer sheet', 'response sheet',
        'provisional key', 'final key', 'model answer', ' omr ',
    ]),
    ('result', [
        'result', 'merit list', 'score card', 'scorecard', 'final result',
        'provisional result', 'selected candidate', 'selection list',
        'wait list', 'waitlist', 'cut off', 'cutoff',
    ]),
    ('correction', [
        'corrigendum', 'correction', 'amendment', 'erratum',
        'modification', 'revised', 'addendum', 'rectification',
    ]),
]


# ============================================================
# Title-level blocklist — items matching ANY of these are
# dropped immediately (before Gemini and before DB write).
# We only want: recruitment, result, admit_card, answer_key, syllabus.
# Everything else (stats, tenders, press releases, etc.) is noise.
# ============================================================
_IRRELEVANT_TITLE_KEYWORDS = [
    # Application statistics / summary reports
    'appln summary', 'application summary', 'applicant summary',
    'applications received', 'application statistics',
    # Tenders / procurement
    'tender', 'quotation', 'rate contract', 'e-tender', 'nit ',
    'notice inviting tender',
    # Press / media
    'press release', 'press note', 'media release', 'communique',
    # Annual reports / RTI / minutes
    'annual report', 'annual accounts', 'annual statement',
    'minutes of meeting', 'meeting minutes', 'rti ', ' rti',
    # Misc administrative noise
    'office order', 'office memorandum', 'circular',
    'transfer order', 'posting order', 'seniority list',
    'pay revision', 'dpc meeting', 'vigilance',
    # Transfer/posting notifications (not recruitment)
    'transfer/posting', 'transfer & posting', 'transfer and posting',
    'transfer list', 'posting list', 'posting of ',
    # Policy / wording documents
    'wording policy', 'policy document', 'policy note',
    'action plan for', 'action plan of',
    # IT / Technical documents (not job postings)
    'user manual', 'instruction manual', 'installation guide',
    'technical guide', 'software guide', 'network setup',
    'vpn ', '/vpn', 'site preparation', 'cis 3.0', 'case management',
    'procedure to configure', 'configuration guide',
    'click here to download',
    # Court / legal documents
    'court order', 'court notice', 'court circular',
    'judgment', 'order sheet', 'cause list',
    # HR/admin manuals
    'mfn/la', 'cases manual', 'leave policy', 'leave rules',
    'gpf ', 'epf ', 'pension rules', 'service rules',
    # Empanelment (different from recruitment)
    'empanelment', 'rate list', 'approved list',
]


def is_irrelevant_title(title: str) -> bool:
    """
    Returns True if the notification title looks like administrative noise
    rather than a recruitment / result / syllabus / admit-card / answer-key.
    """
    if not title:
        return False
    t = title.lower()
    return any(kw in t for kw in _IRRELEVANT_TITLE_KEYWORDS)


def classify_notification_type(title: str) -> str:
    """
    Determine the notification_type from the title string.

    Returns one of:
      'recruitment', 'result', 'answer_key', 'admit_card',
      'syllabus', 'correction', 'other'

    Rules:
    - Minimum title length of 15 chars — avoids single-word false-matches
      like "Apply" or "Post" being classified as 'recruitment'.
    - Rules applied in priority order — last match wins.
    """
    if not title:
        return 'other'

    # Reject titles that are too short to be a real notification
    # (e.g. "Apply", "Post", "Jobs", "Download" are button/nav texts)
    if len(title.strip()) < 15:
        return 'other'

    t = title.lower()
    matched = 'other'

    for ntype, keywords in _NOTIFICATION_TYPE_RULES:
        for kw in keywords:
            if kw in t:
                matched = ntype
                break  # move to next rule group

    return matched


# ============================================================
# Pipeline 00: URL + Hash Deduplication — skip already-crawled items
# Priority: 10  (runs FIRST, before Gemini saves quota)
# ============================================================
class DeduplicationPipeline:
    """
    Loads all known source_url + notification_pdf + dedup_hash values
    from exam_notifications at spider open. Any incoming item whose
    URL or hash already exists in the DB is dropped immediately —
    no Gemini call, no DB write.

    Spider can set a `dedup_org` attribute to filter to only its org's URLs
    (e.g. self.dedup_org = 'BMC') — keeps the set small for large DBs.

    Also exposes `known_urls` as a class-level set so spiders can check
    before even yielding a request (zero HTTP requests wasted).
    """

    # Class-level: shared so individual spiders can read it for early-skip
    known_urls: set = set()   # { url, ... }
    known_hashes: set = set() # { dedup_hash, ... }

    @classmethod
    def from_crawler(cls, crawler):
        pipe = cls()
        pipe.crawler = crawler
        return pipe

    def open_spider(self, spider=None):
        spider = spider or (getattr(self, 'crawler', None) and self.crawler.spider)
        self.consecutive_dups = 0
        org = getattr(spider, 'dedup_org', None) if spider else None
        try:
            DeduplicationPipeline.known_urls = pg_db.get_known_urls(org_acronym=org)
            # Load dedup_hashes if the DB helper supports it
            try:
                DeduplicationPipeline.known_hashes = pg_db.get_known_hashes(org_acronym=org)
            except Exception:
                DeduplicationPipeline.known_hashes = set()

            count_urls = len(DeduplicationPipeline.known_urls)
            count_hashes = len(DeduplicationPipeline.known_hashes)
            if spider:
                spider.logger.info(
                    f"DeduplicationPipeline: Loaded {count_urls} known URL(s) + "
                    f"{count_hashes} known hash(es) from DB"
                    + (f" (org={org})" if org else "")
                    + ". Matching items will be skipped."
                )
        except Exception as e:
            if spider:
                spider.logger.warning(f"DeduplicationPipeline: Failed to load known URLs — {e}. Skipping dedup.")
            DeduplicationPipeline.known_urls = set()
            DeduplicationPipeline.known_hashes = set()

    def process_item(self, item, spider=None):
        spider = spider or (getattr(self, 'crawler', None) and self.crawler.spider)
        if not DeduplicationPipeline.known_urls and not DeduplicationPipeline.known_hashes:
            return item   # DB not loaded — pass everything through

        # Check source_url + notification_pdf + dedup_hash
        source_url  = (item.get('source_url')      or '').strip()
        pdf_url     = (item.get('notification_pdf') or '').strip()
        dedup_hash  = (item.get('dedup_hash')       or '').strip()

        matched = None
        if dedup_hash and dedup_hash in DeduplicationPipeline.known_hashes:
            matched = f"hash:{dedup_hash[:16]}"
        elif source_url and source_url in DeduplicationPipeline.known_urls:
            matched = source_url
        elif pdf_url and pdf_url in DeduplicationPipeline.known_urls:
            matched = pdf_url

        if matched:
            self.consecutive_dups += 1
            title = item.get('title', '')[:60]
            spider.logger.info(
                f"[{spider.name}] DUP {self.consecutive_dups}/2: SKIP (already in DB) — {title!r} [{matched[-40:]}]"
            )

            # Early exit: if 2 consecutive duplicates found, stop this spider and let runner move to next
            max_consec = getattr(spider, 'MAX_CONSECUTIVE_DUPLICATES', 2)
            if spider.name != 'multi_govt_jobs' and self.consecutive_dups >= max_consec:
                spider.logger.info(
                    f"[{spider.name}] 🛑 DeduplicationPipeline: {self.consecutive_dups} consecutive duplicates reached. "
                    f"Closing spider early and moving forward."
                )
                if hasattr(spider, 'crawler') and hasattr(spider.crawler, 'engine') and spider.crawler.engine:
                    spider.crawler.engine.close_spider(spider, 'consecutive_duplicates_limit_reached')

            raise DropItem(f"Duplicate: {matched}")

        # Fresh/new item — reset consecutive duplicate counter
        self.consecutive_dups = 0
        return item

    @classmethod
    def is_known(cls, val: str) -> bool:
        """Spiders call this in parse() to skip a request before it's even made."""
        if not val:
            return False
        v = str(val).strip()
        return bool(v in cls.known_urls or v in cls.known_hashes)

    @classmethod
    def is_hash_known(cls, h: str) -> bool:
        """Spiders can also check specifically by hash."""
        return bool(h and str(h).strip() in cls.known_hashes)


# ============================================================
# Pipeline 0: LLM AI — fills in missing fields from PDFs
# Priority: 50
# Providers: Gemini (native PDF) → DeepSeek (text) → Groq (text)
# Best output wins (scored by # of non-null fields extracted)
# ============================================================
class GeminiExtractionPipeline:
    """
    Downloads the notification PDF and sends it through a multi-LLM router.

    Provider priority:
      1. Gemini  — native PDF, best quality
      2. DeepSeek — OpenAI-compat, text extracted first
      3. Groq     — LLaMA/Mixtral, text extracted first

    After LLM extraction, results are merged into `ai_extracted_data` JSONB,
    and key values are PROMOTED into first-class filter columns
    (salary_min, max_age_limit, min_experience_years, etc.) so they can be
    queried fast on the frontend without JSONB parsing.

    Env vars:
      GEMINI_API_KEY    — comma-separated, supports rotation
      DEEPSEEK_API_KEY  — from platform.deepseek.com
      GROQ_API_KEY      — from console.groq.com/keys
    """

    # Fields that, if ALL are present, skip LLM call (save quota)
    FIELDS_TO_CHECK = [
        'apply_end_date', 'age_limit', 'total_vacancies',
        # NEW first-class filters — skip if all present
        'salary_min', 'max_age_limit', 'min_experience_years',
    ]

    MAX_PDF_SIZE_MB = 10

    @classmethod
    def from_crawler(cls, crawler):
        pipe = cls()
        pipe.crawler = crawler
        return pipe

    def open_spider(self, spider=None):
        spider = spider or (getattr(self, 'crawler', None) and self.crawler.spider)
        from utils.gemini_client import GeminiKeyManager
        from utils.llm_client import LLMRouter

        logger = spider.logger if spider else None
        key_manager = GeminiKeyManager(logger=logger)
        self.router = LLMRouter(key_manager=key_manager, spider_logger=logger)
        self.enabled = self.router.is_available

        if not self.enabled and spider:
            spider.logger.warning(
                "GeminiExtractionPipeline: No LLM providers available — PDF extraction disabled."
            )

    def process_item(self, item, spider=None):
        spider = spider or (getattr(self, 'crawler', None) and self.crawler.spider)
        from items import ExamNotificationItem
        if not isinstance(item, ExamNotificationItem):
            return item  # only process notifications, not PostItems

        if not self.enabled:
            return item

        # Skip if all important fields already populated
        missing = [f for f in self.FIELDS_TO_CHECK if not item.get(f)]
        if not missing:
            return item

        pdf_url = item.get('notification_pdf')
        if not pdf_url:
            return item

        spider.logger.info(f"LLM: Extracting from PDF: {item.get('title', '')[:50]}")

        try:
            pdf_bytes = self._download_pdf(pdf_url)
            if pdf_bytes:
                extracted = self.router.extract(pdf_bytes)
                if extracted:
                    self._merge(item, extracted, spider)
                    # NEW: promote key values from ai_extracted_data into
                    # first-class filter columns for fast SQL queries
                    self._promote_ai_fields(item, spider)
        except Exception as e:
            spider.logger.warning(f"LLM PDF extraction failed: {e}")

        return item

    def _download_pdf(self, url):
        try:
            resp = requests.get(url, timeout=20, stream=True, verify=False)
            resp.raise_for_status()
            chunks, total = [], 0
            for chunk in resp.iter_content(chunk_size=65536):
                chunks.append(chunk)
                total += len(chunk)
                if total > self.MAX_PDF_SIZE_MB * 1024 * 1024:
                    return None
            return b''.join(chunks)
        except Exception:
            return None

    def _merge(self, item, extracted, spider):
        """
        Merge LLM extracted data into item.
        - Scalar/JSONB fields: don't overwrite existing non-null values
        - ai_extracted_data: DEEP MERGE (spider may have pre-filled some keys)
        """
        # Flat scalar/JSONB fields — only fill if currently empty
        scalar_fields = [
            'total_vacancies', 'apply_start_date', 'apply_end_date', 'exam_date',
            'age_limit', 'application_fee', 'selection_process',
            # Rich fields
            'employment_type', 'duration', 'salary', 'qualifications',
            'application_email', 'advertisement_details', 'application_details',
        ]
        filled = []
        for field in scalar_fields:
            if not item.get(field) and extracted.get(field) is not None:
                item[field] = extracted[field]
                filled.append(field)

        # NEW: Deep merge into ai_extracted_data (spider may have initialized
        # it as {} or with partial values; LLM fills the rest)
        if extracted:
            existing_ai = item.get('ai_extracted_data') or {}
            # Shallow merge: LLM keys overwrite spider pre-fills
            merged_ai = {**existing_ai, **extracted}
            item['ai_extracted_data'] = merged_ai
            if 'ai_extracted_data' not in filled:
                filled.append('ai_extracted_data')

        # Org enrichment sub-fields
        org_data = extracted.get('org') or {}
        org_map = [
            ('department', 'org_department'),
            ('parent_org', 'org_parent'),
            ('address',    'org_address'),
            ('phone',      'org_phone'),
        ]
        for src_key, item_key in org_map:
            if org_data.get(src_key) and not item.get(item_key):
                item[item_key] = org_data[src_key]
                filled.append(item_key)

        # Posts list (used by PostgresPipeline to create posts rows)
        if extracted.get('posts'):
            item.setdefault('_gemini_posts', extracted['posts'])
            filled.append('posts')

        if filled:
            spider.logger.info(f"LLM filled: {', '.join(filled)}")

    def _promote_ai_fields(self, item, spider):
        """
        Pull key values OUT of ai_extracted_data into first-class
        filter columns. This is what makes frontend queries fast.

        Example: if PDF mentions "Max Age: 35 years" → ai_extracted_data
        stores {"age_limit": {"max": 35}} → this method sets
        item['max_age_limit'] = 35 so Postgres stores it in the
        indexed max_age_limit column.
        """
        ai = item.get('ai_extracted_data') or {}
        promoted = []

        # --- Age ---
        if not item.get('max_age_limit'):
            age = ai.get('age_limit') or {}
            max_age = age.get('max_age') or age.get('max') or age.get('upper')
            if max_age:
                try:
                    item['max_age_limit'] = int(max_age)
                    promoted.append('max_age_limit')
                except (ValueError, TypeError):
                    pass

        # --- Salary ---
        if not item.get('salary_min'):
            sal = ai.get('salary') or {}
            amount = (sal.get('monthly_consolidated')
                      or sal.get('monthly')
                      or sal.get('amount')
                      or sal.get('consolidated'))
            if amount:
                try:
                    # Handle "89,600" or "89600" or 89600
                    if isinstance(amount, str):
                        amount = int(re.sub(r'[^\d]', '', amount))
                    item['salary_min'] = float(amount)
                    promoted.append('salary_min')
                except (ValueError, TypeError):
                    pass

        # --- Salary max (if range was provided) ---
        if not item.get('salary_max'):
            sal = ai.get('salary') or {}
            max_sal = sal.get('max') or sal.get('upper')
            if max_sal:
                try:
                    if isinstance(max_sal, str):
                        max_sal = int(re.sub(r'[^\d]', '', max_sal))
                    item['salary_max'] = float(max_sal)
                    promoted.append('salary_max')
                except (ValueError, TypeError):
                    pass

        # --- Experience ---
        if item.get('min_experience_years') is None:
            exp = ai.get('min_experience_years') or ai.get('experience_years')
            if exp is not None:
                try:
                    item['min_experience_years'] = int(exp)
                    promoted.append('min_experience_years')
                except (ValueError, TypeError):
                    pass

        # --- Walk-in flag (AI can override spider's guess) ---
        if item.get('is_walk_in') is None:
            walkin = ai.get('is_walk_in')
            if walkin is not None:
                item['is_walk_in'] = bool(walkin)
                promoted.append('is_walk_in')

        # --- Employment type ---
        if not item.get('employment_type'):
            emp = ai.get('employment_type')
            if emp:
                item['employment_type'] = str(emp).lower()
                promoted.append('employment_type')

        # --- Gender ---
        if not item.get('gender_preference'):
            gender = ai.get('gender_preference')
            if gender:
                item['gender_preference'] = str(gender).lower()
                promoted.append('gender_preference')

        # --- Total vacancies ---
        if not item.get('total_vacancies'):
            adv = ai.get('advertisement_details') or {}
            vac = adv.get('number_of_vacancies') or adv.get('vacancies') or ai.get('total_vacancies')
            if vac is not None:
                try:
                    if isinstance(vac, str):
                        vac = int(re.sub(r'[^\d]', '', vac))
                    item['total_vacancies'] = int(vac)
                    promoted.append('total_vacancies')
                except (ValueError, TypeError):
                    pass

        # --- Exam cities (if AI found venue info) ---
        if not item.get('exam_cities'):
            app = ai.get('application_details') or {}
            venue = app.get('venue_address') or ''
            if venue:
                # Simple heuristic: extract known Indian cities
                known_cities = [
                    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane',
                    'Navi Mumbai', 'Aurangabad', 'Solapur', 'Kolhapur',
                    'Delhi', 'New Delhi', 'Lucknow', 'Bhopal', 'Indore',
                    'Hyderabad', 'Bangalore', 'Chennai', 'Kolkata',
                ]
                cities = [c for c in known_cities if c.lower() in venue.lower()]
                if cities:
                    item['exam_cities'] = cities
                    promoted.append('exam_cities')

        # --- Notification Type (Gemini-classified — highest confidence) ---
        # Gemini reads the full PDF content, so its classification is
        # more accurate than keyword matching on just the title.
        # Only promote if Gemini returned a valid type value.
        VALID_TYPES = {'recruitment', 'result', 'answer_key', 'admit_card',
                       'syllabus', 'correction', 'other'}
        ai_ntype = ai.get('notification_type')
        if ai_ntype and str(ai_ntype).lower() in VALID_TYPES:
            item['notification_type'] = str(ai_ntype).lower()
            promoted.append(f'notification_type={ai_ntype}')

        if promoted:
            spider.logger.info(f"LLM promoted: {', '.join(promoted)}")


# ============================================================
# Pipeline 1: Write to PostgreSQL
# Priority: 200
# ============================================================
class PostgresPipeline:
    """
    Saves exam_notifications + posts + organizations to PostgreSQL.
    Uses the new flexible schema with direct psycopg2 connection.

    Handles:
    - org lookup/create in organizations table
    - source lookup/create in scrape_sources table
    - upsert into exam_notifications (by slug/dedup_hash, ON CONFLICT)
    - upsert posts into posts table
    - log to raw_scraped_data + scrape_log
    """

    @classmethod
    def from_crawler(cls, crawler):
        pipe = cls()
        pipe.crawler = crawler
        return pipe

    def open_spider(self, spider=None):
        spider = spider or (getattr(self, 'crawler', None) and self.crawler.spider)
        self.conn = pg_db.get_conn()

        # Source = this spider's source entry
        source_name = getattr(spider, 'source_name', spider.name) if spider else "unknown_source"
        start_urls = getattr(spider, 'start_urls', []) if spider else []
        source_url = start_urls[0] if start_urls else (getattr(spider, 'GROUPS_API', f"https://{spider.name}") if spider else "https://examudaan.in")
        self.source_id = pg_db.get_or_create_source(self.conn, source_name, source_url)

        # Scrape log entry
        self.log_id  = pg_db.start_scrape_log(self.conn, self.source_id)
        self.added   = 0
        self.updated = 0
        self.errors  = []

        if spider:
            spider.logger.info(
                f"PostgresPipeline: Connected. source_id={self.source_id}, log_id={self.log_id}"
            )

    def close_spider(self, spider=None):
        spider = spider or (getattr(self, 'crawler', None) and self.crawler.spider)
        pg_db.finish_scrape_log(self.conn, self.log_id, self.added, self.updated, self.errors)
        pg_db.release_conn(self.conn)
        if spider:
            spider.logger.info(
                f"PostgresPipeline: Done. Added={self.added}, Updated={self.updated}, Errors={len(self.errors)}"
            )

    def process_item(self, item, spider=None):
        spider = spider or (getattr(self, 'crawler', None) and self.crawler.spider)
        from items import ExamNotificationItem, PostItem

        try:
            if isinstance(item, ExamNotificationItem):
                self._save_notification(item, spider)
            elif isinstance(item, PostItem):
                self._save_post(item, spider)
        except Exception as e:
            self.errors.append(str(e))
            spider.logger.error(f"PostgresPipeline error: {e}")
            try:
                self.conn.rollback()
            except Exception:
                pass

        return item

    def _save_notification(self, item, spider):
        # 1. Resolve org — pass enrichment fields from LLM extraction
        org_id = pg_db.get_or_create_org(
            self.conn,
            name=item.get('org_name', 'Unknown Organization'),
            acronym=item.get('org_acronym', ''),
            website=item.get('application_links', {}).get('official_website'),
            department=item.get('org_department'),
            parent_org=item.get('org_parent'),
            address=item.get('org_address'),
            phone=item.get('org_phone'),
        )

        # 2. Archive to raw_scraped_data
        pg_db.save_raw_scraped(
            self.conn,
            source_id=self.source_id,
            url=item.get('source_url', ''),
            parsed_data=dict(item),
        )

        # 3. NEW: Set last_source_sync timestamp
        item['last_source_sync'] = datetime.utcnow().isoformat()

        # 3b. Drop items that are clearly irrelevant administrative content
        #     (application summaries, tenders, press releases, manuals, etc.)
        title = item.get('title', '')
        if is_irrelevant_title(title):
            raise DropItem(f"Irrelevant title (blocked keyword): {title[:80]}")

        # 3b1. Drop items whose notification_type is 'other' — these are
        #      documents that don't fit any known exam category and are
        #      never shown on the site. No point storing them.
        ntype = item.get('notification_type', 'other')
        if ntype == 'other':
            raise DropItem(f"notification_type=other, not a known exam category: {title[:60]}")

        # 3b2. DATE CUTOFF — drop items older than 3 weeks.
        #      We check the best available date: apply_end_date first
        #      (still-open jobs are always fresh), then scraped_at.
        #      If no date is available, we let it through.
        _MAX_AGE_DAYS = 21   # 3 weeks
        _cutoff_date = None
        try:
            from dateutil import parser as _dp
            from datetime import timezone as _tz

            # Priority: apply_end_date > apply_start_date > scraped_at
            _date_candidates = [
                item.get('apply_end_date'),
                item.get('apply_start_date'),
                item.get('last_source_sync'),
            ]
            for _dc in _date_candidates:
                if _dc:
                    try:
                        _parsed = _dp.parse(str(_dc), dayfirst=True)
                        if _parsed.tzinfo is None:
                            _parsed = _parsed.replace(tzinfo=_tz.utc)
                        _cutoff_date = _parsed
                        break
                    except Exception:
                        continue

            if _cutoff_date:
                _now = datetime.now(_tz.utc)
                _age_days = (_now - _cutoff_date).days

                # If apply_end_date is in the past, mark as 'closed'
                # (but only drop if it's VERY old — older than cutoff)
                if item.get('apply_end_date') and _age_days > 0:
                    item['status'] = 'closed'

                # Drop items that are older than the cutoff
                if _age_days > _MAX_AGE_DAYS:
                    raise DropItem(
                        f"Stale item (age={_age_days}d > {_MAX_AGE_DAYS}d): {title[:60]}"
                    )
        except DropItem:
            raise   # re-raise DropItem so Scrapy handles it correctly
        except Exception as _e:
            spider.logger.debug(f"Date cutoff check failed (letting item through): {_e}")



        # 3c. Classify notification_type from title (if not already set by spider)
        if not item.get('notification_type'):
            item['notification_type'] = classify_notification_type(title)

        # 3d. If still 'other', allow spiders to provide a default type.
        #     e.g. a recruitment-board spider sets:
        #       default_notification_type = 'recruitment'
        #     on its class — so items without clear keywords still get saved.
        if item.get('notification_type') == 'other':
            spider_default = getattr(spider, 'default_notification_type', None)
            if spider_default and spider_default in (
                'recruitment', 'result', 'admit_card', 'answer_key', 'syllabus'
            ):
                item['notification_type'] = spider_default
                spider.logger.debug(
                    f"notification_type defaulted to '{spider_default}' via spider default: {title[:60]}"
                )

        # 3e. Drop anything we can't usefully categorise.
        #     We only store: recruitment, result, admit_card, answer_key, syllabus.
        #     'correction' and 'other' are not displayed on the site.
        ntype = item.get('notification_type', 'other')
        if ntype in ('other', 'correction'):
            raise DropItem(f"Unwanted notification_type='{ntype}': {title[:80]}")
        # 4. Upsert exam_notification (now includes all new fields)
        is_update = item.get('_is_update', False)
        notification_id = pg_db.upsert_notification(
            self.conn,
            org_id=org_id,
            source_id=self.source_id,
            data=dict(item),
        )

        # 5. Save posts from Gemini extraction if present
        gemini_posts = item.pop('_gemini_posts', None)
        if gemini_posts:
            for p in gemini_posts:
                pg_db.upsert_post(self.conn, notification_id, {
                    'post_name':       p.get('post_name', 'Various Posts'),
                    'total_vacancies': p.get('vacancies'),
                    'qualification':   p.get('qualification'),
                    'pay_scale':       p.get('pay_scale'),
                    'category':        p.get('category'),
                })

        if is_update:
            self.updated += 1
        else:
            self.added += 1

        # Store notification_id for linked PostItems
        item['_notification_id'] = notification_id

    def _save_post(self, item, spider):
        notification_id = item.get('notification_id') or item.get('_notification_id')
        if not notification_id:
            # Try to look up by source_url
            notification_id = self._find_notification_by_url(
                item.get('notification_source_url', '')
            )
        if not notification_id:
            spider.logger.warning(f"No notification_id for post: {item.get('post_name')}")
            return

        post_id = pg_db.upsert_post(self.conn, notification_id, dict(item))

        # Handle locations
        if item.get('locations'):
            pg_db.upsert_post_locations(self.conn, post_id, item['locations'])

        self.added += 1

    def _find_notification_by_url(self, url: str):
        """Look up notification by source_url."""
        if not url:
            return None
        with self.conn.cursor() as cur:
            cur.execute(
                "SELECT id FROM exam_notifications WHERE source_url = %s LIMIT 1",
                (url,)
            )
            row = cur.fetchone()
            return row[0] if row else None


# ============================================================
# Pipeline 2: Crawl Summary Email via Brevo
# Priority: 400  (runs LAST, after everything is saved)
# ============================================================
class CrawlSummaryEmailPipeline:
    """
    Sends a rich HTML summary email via the Brevo (Sendinblue) transactional
    email API at the end of every spider run.

    Required env vars:
        BREVO_API_KEY        — Brevo v3 API key
        BREVO_SENDER_EMAIL   — verified sender in Brevo (default: noreply@examudaan.in)
        BREVO_SENDER_NAME    — sender display name (default: ExamUdaan Scraper)
        BREVO_RECIPIENT_EMAIL — where to send the report (default: ramnalawade1986@gmail.com)

    The pipeline is silently disabled if BREVO_API_KEY is not set.
    """

    BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

    @classmethod
    def from_crawler(cls, crawler):
        pipe = cls()
        pipe.crawler = crawler
        return pipe

    def open_spider(self, spider=None):
        spider = spider or (getattr(self, 'crawler', None) and self.crawler.spider)
        self.enabled = False
        self.api_key        = os.getenv("BREVO_API_KEY", "")
        self.sender_email   = os.getenv("BREVO_SENDER_EMAIL", "noreply@examudaan.in")
        self.sender_name    = os.getenv("BREVO_SENDER_NAME", "ExamUdaan Scraper")
        self.recipient_email = os.getenv("BREVO_RECIPIENT_EMAIL", "ramnalawade1986@gmail.com")

        # Disabled by default: we send ONE consolidated email at end of day / run instead of per spider
        if os.getenv("ENABLE_PER_SPIDER_EMAIL", "false").lower() not in ("true", "1"):
            self.enabled = False
            return

        self.enabled = bool(self.api_key)
        if not self.enabled:
            if spider:
                spider.logger.warning(
                    "CrawlSummaryEmailPipeline: BREVO_API_KEY not set — email summary disabled."
                )
            return

        self.start_time = datetime.now()
        self.items_processed = 0
        # NEW: track per-state counts
        self.items_by_state = {}
        self.items_by_lang = {}
        if spider:
            spider.logger.info(
                f"CrawlSummaryEmailPipeline: Enabled. Summary will be sent to {self.recipient_email}"
            )

    def close_spider(self, spider=None):
        spider = spider or (getattr(self, 'crawler', None) and self.crawler.spider)
        if not self.enabled:
            return
        try:
            self._send_summary(spider)
        except Exception as e:
            if spider:
                spider.logger.error(f"CrawlSummaryEmailPipeline: Failed to send email — {e}")

    def process_item(self, item, spider=None):
        spider = spider or (getattr(self, 'crawler', None) and self.crawler.spider)
        if self.enabled:
            self.items_processed += 1
            # NEW: aggregate per-state + per-lang counts for the email report
            state = item.get('state_slug') or 'unknown'
            lang = item.get('lang') or 'unknown'
            self.items_by_state[state] = self.items_by_state.get(state, 0) + 1
            self.items_by_lang[lang] = self.items_by_lang.get(lang, 0) + 1
        return item

    # ──────────────────────────────────────────────────────────────────
    # Internal helpers
    # ──────────────────────────────────────────────────────────────────

    def _send_summary(self, spider):
        end_time  = datetime.now()
        duration  = end_time - self.start_time
        duration_str = str(duration).split('.')[0]   # e.g. "0:04:22"

        # Collect stats from the spider
        spider_stats = getattr(spider, 'stats_summary', {})
        pdf_parsed   = spider_stats.get('pdf_parsed', 0)
        pdf_failed   = spider_stats.get('pdf_failed', 0)
        pages_crawled = spider_stats.get('pages_crawled', 0)
        pages_skipped = spider_stats.get('pages_skipped_duplicate', 0)
        source_stats  = spider_stats.get('source_stats', {})

        # Also pull from Scrapy's built-in stats
        scrapy_stats = spider.crawler.stats.get_stats() if hasattr(spider, 'crawler') else {}
        total_requests   = scrapy_stats.get('downloader/request_count', 'N/A')
        total_responses  = scrapy_stats.get('downloader/response_count', 'N/A')
        http_errors      = scrapy_stats.get('downloader/exception_count', 0)
        items_dropped    = scrapy_stats.get('item_dropped_count', 0)

        status  = '✅ Success' if pdf_failed == 0 else ('⚠️ Partial' if pdf_parsed > 0 else '❌ Failed')
        subject = f"[ExamUdaan] Crawl Report — {spider.name} | {status} | {end_time.strftime('%d %b %Y %H:%M')}"

        html_body = self._build_html(
            spider_name=spider.name,
            start_time=self.start_time,
            end_time=end_time,
            duration_str=duration_str,
            pdf_parsed=pdf_parsed,
            pdf_failed=pdf_failed,
            pages_crawled=pages_crawled,
            pages_skipped=pages_skipped,
            source_stats=source_stats,
            total_requests=total_requests,
            total_responses=total_responses,
            http_errors=http_errors,
            items_dropped=items_dropped,
            items_processed=self.items_processed,
            items_by_state=self.items_by_state,
            items_by_lang=self.items_by_lang,
            status=status,
        )

        payload = {
            "sender": {"name": self.sender_name, "email": self.sender_email},
            "to": [{"email": self.recipient_email}],
            "subject": subject,
            "htmlContent": html_body,
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": self.api_key,
        }

        resp = requests.post(self.BREVO_API_URL, json=payload, headers=headers, timeout=15)
        if resp.status_code in (200, 201):
            spider.logger.info(
                f"CrawlSummaryEmailPipeline: ✉️  Summary sent to {self.recipient_email} "
                f"(messageId={resp.json().get('messageId', '?')})"
            )
        else:
            spider.logger.error(
                f"CrawlSummaryEmailPipeline: Brevo API error {resp.status_code}: {resp.text[:200]}"
            )

    def _build_html(self, spider_name, start_time, end_time, duration_str,
                    pdf_parsed, pdf_failed, pages_crawled, pages_skipped,
                    source_stats, total_requests, total_responses,
                    http_errors, items_dropped, items_processed,
                    items_by_state, items_by_lang, status):
        """Build a clean HTML email body for the crawl summary."""

        # Per-source rows
        source_rows = ""
        for src, s in source_stats.items():
            source_rows += (
                f"<tr>"
                f"<td style='padding:6px 12px;border-bottom:1px solid #eee'>{src}</td>"
                f"<td style='padding:6px 12px;border-bottom:1px solid #eee;text-align:center'>{s.get('found', 0)}</td>"
                f"<td style='padding:6px 12px;border-bottom:1px solid #eee;text-align:center'>{s.get('parsed', 0)}</td>"
                f"<td style='padding:6px 12px;border-bottom:1px solid #eee;text-align:center'>{s.get('pages_crawled', 0)}</td>"
                f"<td style='padding:6px 12px;border-bottom:1px solid #eee;text-align:center'>{s.get('pages_skipped_duplicate', 0)}</td>"
                f"</tr>"
            )
        if not source_rows:
            source_rows = "<tr><td colspan='5' style='padding:10px;text-align:center;color:#888'>No source data</td></tr>"

        # NEW: per-state rows
        state_rows = ""
        for state, count in sorted(items_by_state.items(), key=lambda x: -x[1]):
            state_rows += (
                f"<tr>"
                f"<td style='padding:4px 12px;border-bottom:1px solid #eee'>{state}</td>"
                f"<td style='padding:4px 12px;border-bottom:1px solid #eee;text-align:right'>{count}</td>"
                f"</tr>"
            )
        if not state_rows:
            state_rows = "<tr><td colspan='2' style='padding:8px;text-align:center;color:#888'>No state data</td></tr>"

        # NEW: per-language rows
        lang_rows = ""
        for lang, count in sorted(items_by_lang.items(), key=lambda x: -x[1]):
            lang_rows += (
                f"<tr>"
                f"<td style='padding:4px 12px;border-bottom:1px solid #eee'>{lang}</td>"
                f"<td style='padding:4px 12px;border-bottom:1px solid #eee;text-align:right'>{count}</td>"
                f"</tr>"
            )
        if not lang_rows:
            lang_rows = "<tr><td colspan='2' style='padding:8px;text-align:center;color:#888'>No language data</td></tr>"

        status_color = '#27ae60' if '✅' in status else ('#e67e22' if '⚠️' in status else '#e74c3c')

        return f"""
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'></head>
<body style='font-family:Arial,sans-serif;background:#f5f6fa;padding:20px;color:#333'>
  <div style='max-width:680px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)'>

    <!-- Header -->
    <div style='background:linear-gradient(135deg,#1a237e,#283593);padding:28px 32px;color:#fff'>
      <h1 style='margin:0;font-size:22px;letter-spacing:0.5px'>📋 ExamUdaan Crawl Report</h1>
      <p style='margin:6px 0 0;opacity:0.85;font-size:14px'>Spider: <strong>{spider_name}</strong> &nbsp;|&nbsp; {end_time.strftime('%d %b %Y, %H:%M IST')}</p>
    </div>

    <!-- Status Banner -->
    <div style='background:{status_color};color:#fff;padding:12px 32px;font-size:15px;font-weight:bold'>
      {status}
    </div>

    <!-- Summary Cards -->
    <div style='display:flex;gap:0;border-bottom:1px solid #eee'>
      <div style='flex:1;padding:20px;text-align:center;border-right:1px solid #eee'>
        <div style='font-size:28px;font-weight:bold;color:#27ae60'>{pdf_parsed}</div>
        <div style='font-size:12px;color:#888;margin-top:4px'>PDFs Parsed ✅</div>
      </div>
      <div style='flex:1;padding:20px;text-align:center;border-right:1px solid #eee'>
        <div style='font-size:28px;font-weight:bold;color:#e74c3c'>{pdf_failed}</div>
        <div style='font-size:12px;color:#888;margin-top:4px'>PDFs Failed ❌</div>
      </div>
      <div style='flex:1;padding:20px;text-align:center;border-right:1px solid #eee'>
        <div style='font-size:28px;font-weight:bold;color:#2980b9'>{pages_crawled}</div>
        <div style='font-size:12px;color:#888;margin-top:4px'>Pages Crawled</div>
      </div>
      <div style='flex:1;padding:20px;text-align:center'>
        <div style='font-size:28px;font-weight:bold;color:#8e44ad'>{pages_skipped}</div>
        <div style='font-size:12px;color:#888;margin-top:4px'>Pages Skipped (dup)</div>
      </div>
    </div>

    <!-- Run Details -->
    <div style='padding:20px 32px'>
      <h3 style='margin:0 0 12px;font-size:15px;color:#555;border-bottom:1px solid #eee;padding-bottom:8px'>⏱ Run Details</h3>
      <table style='width:100%;border-collapse:collapse;font-size:13px'>
        <tr><td style='padding:5px 0;color:#888'>Start Time</td><td style='text-align:right'>{start_time.strftime('%Y-%m-%d %H:%M:%S')}</td></tr>
        <tr><td style='padding:5px 0;color:#888'>End Time</td><td style='text-align:right'>{end_time.strftime('%Y-%m-%d %H:%M:%S')}</td></tr>
        <tr><td style='padding:5px 0;color:#888'>Duration</td><td style='text-align:right'>{duration_str}</td></tr>
        <tr><td style='padding:5px 0;color:#888'>Total HTTP Requests</td><td style='text-align:right'>{total_requests}</td></tr>
        <tr><td style='padding:5px 0;color:#888'>HTTP Responses</td><td style='text-align:right'>{total_responses}</td></tr>
        <tr><td style='padding:5px 0;color:#888'>HTTP Errors</td><td style='text-align:right'>{http_errors}</td></tr>
        <tr><td style='padding:5px 0;color:#888'>Items Dropped (dedup)</td><td style='text-align:right'>{items_dropped}</td></tr>
        <tr><td style='padding:5px 0;color:#888'>Items Processed</td><td style='text-align:right'>{items_processed}</td></tr>
      </table>
    </div>

    <!-- NEW: Per-State + Per-Language Breakdown -->
    <div style='padding:0 32px 24px;display:flex;gap:20px'>
      <div style='flex:1'>
        <h3 style='margin:0 0 8px;font-size:14px;color:#555'>📍 By State</h3>
        <table style='width:100%;border-collapse:collapse;font-size:12px'>
          <thead><tr style='background:#f5f6fa'>
            <th style='padding:6px 12px;text-align:left'>State</th>
            <th style='padding:6px 12px;text-align:right'>Count</th>
          </tr></thead>
          <tbody>{state_rows}</tbody>
        </table>
      </div>
      <div style='flex:1'>
        <h3 style='margin:0 0 8px;font-size:14px;color:#555'>🌐 By Language</h3>
        <table style='width:100%;border-collapse:collapse;font-size:12px'>
          <thead><tr style='background:#f5f6fa'>
            <th style='padding:6px 12px;text-align:left'>Lang</th>
            <th style='padding:6px 12px;text-align:right'>Count</th>
          </tr></thead>
          <tbody>{lang_rows}</tbody>
        </table>
      </div>
    </div>

    <!-- Per-Source Breakdown -->
    <div style='padding:0 32px 24px'>
      <h3 style='margin:0 0 12px;font-size:15px;color:#555;border-bottom:1px solid #eee;padding-bottom:8px'>📌 Per-Source Breakdown</h3>
      <table style='width:100%;border-collapse:collapse;font-size:13px'>
        <thead>
          <tr style='background:#f5f6fa;font-weight:bold;color:#555'>
            <th style='padding:8px 12px;text-align:left'>Source</th>
            <th style='padding:8px 12px;text-align:center'>Found</th>
            <th style='padding:8px 12px;text-align:center'>Parsed</th>
            <th style='padding:8px 12px;text-align:center'>Pages</th>
            <th style='padding:8px 12px;text-align:center'>Skipped</th>
          </tr>
        </thead>
        <tbody>{source_rows}</tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style='background:#f5f6fa;padding:16px 32px;font-size:11px;color:#aaa;text-align:center'>
      Generated by ExamUdaan Scrapy Crawler &nbsp;•&nbsp; {end_time.strftime('%Y')}
    </div>
  </div>
</body>
</html>
"""