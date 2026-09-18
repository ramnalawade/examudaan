# upsssc_scraper/spiders/multi_govt_spider.py
import tempfile,hashlib,scrapy,requests,json,os,time,re
from pathlib import Path
from urllib.parse import urljoin, urlparse
from datetime import datetime


class MultiGovtJobSpider(scrapy.Spider):
    name = 'multi_govt_jobs'
    
    # Multiple domains allowed
    allowed_domains = [
##        'upsssc.gov.in',
        'rpsc.rajasthan.gov.in',
        'ibps.in',
        'employmentnews.gov.in'
    ]
    
    # Start with UPSSSC + RPSC for pilot
    start_urls = [
        'https://upsssc.gov.in/News.aspx?id=1',
        'https://rpsc.rajasthan.gov.in/advertisements',
        'https://ibps.in/notification/',
    ]
    
    custom_settings = {
        'DOWNLOADER_MIDDLEWARES': {
            'scrapy.downloadermiddlewares.retry.RetryMiddleware': 90,
        },
        'HTTPPROXY_ENABLED': False,
    }

    # ─── How many consecutive all-duplicate pages before we stop paginating ───
    MAX_CONSECUTIVE_DUP_PAGES = 3
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Initialize Gemini with key rotation (uses google-genai SDK internally)
        from utils.gemini_client import GeminiKeyManager
        self.key_manager = GeminiKeyManager(logger=self.logger)
        self._configure_next_key()

        # Rate limiting — free tier:
        #   gemini-2.0-flash-lite → 30 RPM
        #   gemini-2.0-flash      → 15 RPM  (conservative limit used here)
        self.gemini_requests = 0
        self.minute_start = time.time()
        self._gemini_rpm_limit = 14   # stay under 15 RPM to be safe

        # Stats tracking (used by CrawlSummaryEmailPipeline at close)
        self.stats_summary = {
            'pdf_parsed': 0,
            'pdf_failed': 0,
            'pages_crawled': 0,
            'pages_skipped_duplicate': 0,
            'source_stats': {}
        }
        # legacy alias — kept so existing code referencing self.stats works
        self.stats = self.stats_summary

        # PDF hash cache to avoid re-parsing same PDF within a run
        self.parsed_hashes = set()

        # ── Consecutive all-duplicate page counter per source ──
        # Key: source name (str), Value: count of consecutive dup pages
        self._consec_dup_pages: dict[str, int] = {}

    # Model fallback chain — confirmed working on this account (2026-08)
    # Uses the new google-genai SDK; gemini-2.0/1.5 names are retired.
    MODEL_FALLBACK_CHAIN = [
        'gemini-flash-lite-latest',   # lightest / fastest (free tier)
        'gemini-3.5-flash-lite',      # explicit version
        'gemini-3.5-flash',           # higher quality
        'gemini-flash-latest',        # always-latest alias
    ]

    def _configure_next_key(self):
        from google import genai
        key = self.key_manager.get_current_key()
        if not key:
            self.logger.error("All Gemini API keys are exhausted! Disabling Gemini parsing.")
            self.gemini_client = None
            return False

        self._gemini_api_key = key
        model_name = os.environ.get('GEMINI_MODEL', self.MODEL_FALLBACK_CHAIN[0])
        self._active_model_name = model_name
        self.gemini_client = genai.Client(api_key=key)
        masked = f"...{key[-6:]}" if len(key) > 6 else key
        self.logger.info(f"MultiGovtJobSpider: model={model_name}, key={masked}")
        return True
    
    def _gemini_rate_limit(self):
        """Stay within configured RPM free-tier limit (default 14/min to stay under 15)."""
        self.gemini_requests += 1
        if self.gemini_requests >= self._gemini_rpm_limit:
            elapsed = time.time() - self.minute_start
            if elapsed < 60:
                wait = 60 - elapsed + 2   # +2s buffer
                self.logger.info(f'⏳ Gemini rate limit: waiting {wait:.0f}s (hit {self._gemini_rpm_limit} RPM)')
                time.sleep(wait)
            self.gemini_requests = 0
            self.minute_start = time.time()

    def _detect_source(self, url):
        """Detect which government site we're scraping"""
        domain = urlparse(url).netloc
        
        if 'upsssc' in domain:
            return 'UPSSSC', 'Uttar Pradesh'
        elif 'rpsc' in domain or 'rajasthan' in domain:
            return 'RPSC', 'Rajasthan'
        elif 'ibps' in domain:
            return 'IBPS', 'All India'
        elif 'employmentnews' in domain:
            return 'Employment News', 'All India'
        else:
            return 'Unknown', 'Unknown'

    def _init_source_stats(self, source):
        """Ensure per-source stats dict is initialized."""
        if source not in self.stats_summary['source_stats']:
            self.stats_summary['source_stats'][source] = {
                'found': 0,
                'parsed': 0,
                'pages_crawled': 0,
                'pages_skipped_duplicate': 0,
            }

    # ──────────────────────────────────────────────────────────────────
    # Duplicate-page detection helpers
    # ──────────────────────────────────────────────────────────────────

    def _check_page_duplicates(self, source: str, links: list[str]) -> bool:
        """
        Given a list of absolute URLs found on the current page, determine
        whether ALL of them are already known duplicates.

        Returns True if the page is "all duplicates" (should not be followed).
        Updates self._consec_dup_pages accordingly.

        Also increments stats_summary page counters.
        """
        from pipelines import DeduplicationPipeline

        if not links:
            # Empty page — count as no-new-content (not a dup page for stopping)
            return False

        dup_count = sum(1 for url in links if DeduplicationPipeline.is_known(url))
        all_dups = (dup_count == len(links))

        self.stats_summary['pages_crawled'] += 1
        self.stats_summary['source_stats'][source]['pages_crawled'] += 1

        if all_dups:
            self._consec_dup_pages[source] = self._consec_dup_pages.get(source, 0) + 1
            self.logger.info(
                f"🔁 [{source}] Page fully duplicate ({dup_count}/{len(links)} known). "
                f"Consecutive dup pages: {self._consec_dup_pages[source]}/{self.MAX_CONSECUTIVE_DUP_PAGES}"
            )
            self.stats_summary['pages_skipped_duplicate'] += 1
            self.stats_summary['source_stats'][source]['pages_skipped_duplicate'] += 1
        else:
            # Reset counter — found at least one new URL
            self._consec_dup_pages[source] = 0

        return all_dups

    def _should_stop_paginating(self, source: str) -> bool:
        """Return True if we've hit MAX_CONSECUTIVE_DUP_PAGES all-duplicate pages."""
        reached = self._consec_dup_pages.get(source, 0) >= self.MAX_CONSECUTIVE_DUP_PAGES
        if reached:
            self.logger.info(
                f"⏹️  [{source}] Stopping pagination — {self.MAX_CONSECUTIVE_DUP_PAGES} consecutive "
                f"all-duplicate pages reached. Existing data covers remaining pages."
            )
        return reached

    # ──────────────────────────────────────────────────────────────────
    
    def parse(self, response):
        """Route to appropriate parser based on source"""
        source, state = self._detect_source(response.url)
        self.logger.info(f'🔍 Parsing {source} - {response.url}')
        
        # Initialize source stats
        self._init_source_stats(source)
        
        # UPSSSC specific parsing
        if 'upsssc' in response.url:
            yield from self.parse_upsssc(response, source, state)
        
        # RPSC specific parsing
        elif 'rpsc' in response.url:
            yield from self.parse_rpsc(response, source, state)
        
        # IBPS specific parsing
        elif 'ibps' in response.url:
            yield from self.parse_ibps(response, source, state)
        
        # Employment News
        elif 'employmentnews' in response.url:
            yield from self.parse_employment_news(response, source, state)
    
    # ========== UPSSSC PARSER ==========
    def parse_upsssc(self, response, source, state):
        """Parse UPSSSC notification pages"""
        
        # Find notification links - UPSSSC uses gridview/table layout
        notification_links = response.css('a[href*="ViewPdf"]::attr(href)').getall()
        
        # Also try table rows
        if not notification_links:
            rows = response.css('table tr')
            for row in rows:
                link = row.css('a::attr(href)').get()
                if link and 'ViewPdf' in link:
                    notification_links.append(link)
        
        # Build absolute PDF URLs for duplicate checking
        abs_pdf_urls = [urljoin('https://upsssc.gov.in/', link) for link in notification_links]

        self.logger.info(f'Found {len(notification_links)} UPSSSC notifications')
        self.stats_summary['source_stats'][source]['found'] += len(notification_links)

        # ── Duplicate-page guard ──
        page_all_dups = self._check_page_duplicates(source, abs_pdf_urls)

        for link, pdf_url in zip(notification_links, abs_pdf_urls):
            from pipelines import DeduplicationPipeline
            if DeduplicationPipeline.is_known(pdf_url):
                self.logger.debug(f'UPSSSC: Skipping known PDF — {pdf_url[-60:]}')
                continue

            # Try to get title and date from nearby elements
            title = response.css(f'a[href="{link}"]::text').get()
            date_elem = response.css(f'a[href="{link}"]').xpath('../../td[2]//text()').get()

            yield scrapy.Request(
                pdf_url,
                callback=self.parse_pdf_with_gemini,
                meta={
                    'title': title.strip() if title else 'UPSSSC Notification',
                    'pdf_url': pdf_url,
                    'source': source,
                    'state': state,
                    'published_date': date_elem.strip() if date_elem else None,
                    'source_url': response.url
                },
                errback=self.handle_pdf_error
            )
        
        # Handle pagination — stop if we've hit MAX_CONSECUTIVE_DUP_PAGES
        if not self._should_stop_paginating(source):
            next_page = response.css('a:contains("Next"), a.next::attr(href), .pagination a[href*="page"]::attr(href)').get()
            if next_page:
                yield response.follow(next_page, self.parse)
    
    # ========== RPSC PARSER ==========
    def parse_rpsc(self, response, source, state):
        """Parse RPSC advertisement pages"""
        
        # RPSC uses a list of advertisements with PDF links
        notif_items = response.css('a[href*=".pdf"], .advertisement-list a, .notification a')
        
        abs_pdf_urls = []
        item_data = []

        for item in notif_items:
            link = item.css('::attr(href)').get()
            title = item.css('::text').get()
            
            if link and '.pdf' in link.lower():
                pdf_url = urljoin('https://rpsc.rajasthan.gov.in/', link)
                abs_pdf_urls.append(pdf_url)
                date_text = item.xpath('ancestor::tr/td[last()]//text()').get()
                item_data.append((pdf_url, title, date_text))

        self.stats_summary['source_stats'][source]['found'] += len(abs_pdf_urls)

        # ── Duplicate-page guard ──
        self._check_page_duplicates(source, abs_pdf_urls)

        for pdf_url, title, date_text in item_data:
            from pipelines import DeduplicationPipeline
            if DeduplicationPipeline.is_known(pdf_url):
                self.logger.debug(f'RPSC: Skipping known PDF — {pdf_url[-60:]}')
                continue

            yield scrapy.Request(
                pdf_url,
                callback=self.parse_pdf_with_gemini,
                meta={
                    'title': title.strip() if title else 'RPSC Notification',
                    'pdf_url': pdf_url,
                    'source': source,
                    'state': state,
                    'published_date': date_text.strip() if date_text else None,
                    'source_url': response.url
                },
                errback=self.handle_pdf_error
            )

        # Handle pagination
        if not self._should_stop_paginating(source):
            next_page = response.css('a:contains("Next"), .pagination a[href*="page"]::attr(href)').get()
            if next_page:
                yield response.follow(next_page, self.parse)
    
    # ========== IBPS PARSER ==========
    def parse_ibps(self, response, source, state):
        """Parse IBPS notification pages"""
        
        # IBPS notifications page
        links = response.css('a[href*=".pdf"], a[href*="notification"], .notification-list a')
        
        abs_pdf_urls = []
        link_data = []

        for link in links:
            href = link.css('::attr(href)').get()
            title = link.css('::text').get()
            
            if href:
                pdf_url = urljoin('https://ibps.in/', href)
                abs_pdf_urls.append(pdf_url)
                link_data.append((pdf_url, title))

        self.stats_summary['source_stats'][source]['found'] += len(abs_pdf_urls)

        # ── Duplicate-page guard ──
        self._check_page_duplicates(source, abs_pdf_urls)

        for pdf_url, title in link_data:
            from pipelines import DeduplicationPipeline
            if DeduplicationPipeline.is_known(pdf_url):
                self.logger.debug(f'IBPS: Skipping known PDF — {pdf_url[-60:]}')
                continue

            yield scrapy.Request(
                pdf_url,
                callback=self.parse_pdf_with_gemini,
                meta={
                    'title': title.strip() if title else 'IBPS Notification',
                    'pdf_url': pdf_url,
                    'source': source,
                    'state': state,
                    'published_date': None,
                    'source_url': response.url
                },
                errback=self.handle_pdf_error
            )

        # Handle pagination
        if not self._should_stop_paginating(source):
            next_page = response.css('a:contains("Next"), .pagination a[href*="page"]::attr(href)').get()
            if next_page:
                yield response.follow(next_page, self.parse)
    
    # ========== EMPLOYMENT NEWS PARSER ==========
    def parse_employment_news(self, response, source, state):
        """Parse Employment News website"""
        
        # Employment News archives PDFs by date
        pdf_links = response.css('a[href*=".pdf"]::attr(href)').getall()
        
        abs_pdf_urls = [urljoin('https://employmentnews.gov.in/', link) for link in pdf_links]
        self.stats_summary['source_stats'][source]['found'] += len(abs_pdf_urls)

        # ── Duplicate-page guard ──
        self._check_page_duplicates(source, abs_pdf_urls)

        for link, pdf_url in zip(pdf_links, abs_pdf_urls):
            from pipelines import DeduplicationPipeline
            if DeduplicationPipeline.is_known(pdf_url):
                self.logger.debug(f'EmploymentNews: Skipping known PDF — {pdf_url[-60:]}')
                continue

            # Extract date from URL or filename
            date_match = re.search(r'(\d{1,2})-(\w+)-(\d{4})', link)
            if date_match:
                try:
                    pub_date = datetime.strptime(
                        f"{date_match.group(1)} {date_match.group(2)} {date_match.group(3)}",
                        "%d %B %Y"
                    ).strftime("%d/%m/%Y")
                except Exception:
                    pub_date = None
            else:
                pub_date = None
            
            yield scrapy.Request(
                pdf_url,
                callback=self.parse_pdf_with_gemini,
                meta={
                    'title': f'Employment News {pub_date}' if pub_date else 'Employment News',
                    'pdf_url': pdf_url,
                    'source': source,
                    'state': state,
                    'published_date': pub_date,
                    'source_url': response.url
                },
                errback=self.handle_pdf_error
            )

        # Handle pagination
        if not self._should_stop_paginating(source):
            next_page = response.css('a:contains("Next"), .pagination a[href*="page"]::attr(href)').get()
            if next_page:
                yield response.follow(next_page, self.parse)
    
    # ========== GEMINI PDF PARSER - ENHANCED ==========
    def parse_pdf_with_gemini(self, response):
        """Enhanced PDF parser with extended fields"""
        
        # Validate PDF
        content_type = response.headers.get('Content-Type', b'').decode().lower()
        if 'pdf' not in content_type and not response.url.endswith('.pdf'):
            self.logger.warning(f'Not a PDF: {response.url}')
            return
        
        # Save PDF temporarily
        pdf_content = response.body
        pdf_hash = hashlib.md5(pdf_content).hexdigest()
        
        # Skip if already parsed in this run (in-memory dedup by content hash)
        if pdf_hash in self.parsed_hashes:
            self.logger.info(f'⏭️ Skipping duplicate PDF (same content): {response.meta["title"]}')
            return
        
        self.parsed_hashes.add(pdf_hash)
        
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            tmp.write(pdf_content)
            tmp_path = tmp.name

        prompt = """
        Extract ALL details from this Indian government job notification PDF into comprehensive JSON.
        
        Return EXACTLY this expanded JSON structure (use null for truly missing fields):
        {
            "notification_number": "string or null",
            "advertisement_number": "string or null",
            "organization_name": "string",
            "department_name": "string",
            "ministry_name": "string or null",
            "recruiting_agency": "string or null",
            "job_type": "Permanent/Temporary/Contractual/Apprenticeship/Other",
            "service_category": "Group A/Group B/Group C/Group D/Central/State/PSU",
            
            "post_details": [
                {
                    "post_name": "string",
                    "post_code": "string or null",
                    "total_vacancies": number,
                    "ur": number or null,
                    "ews": number or null,
                    "obc": number or null,
                    "sc": number or null,
                    "st": number or null
                }
            ],
            
            "important_dates": {
                "notification_date": "DD/MM/YYYY or null",
                "application_start_date": "DD/MM/YYYY or null",
                "application_end_date": "DD/MM/YYYY or null",
                "extended_end_date": "DD/MM/YYYY or null",
                "fee_payment_last_date": "DD/MM/YYYY or null",
                "correction_window_start": "DD/MM/YYYY or null",
                "correction_window_end": "DD/MM/YYYY or null",
                "prelims_exam_date": "DD/MM/YYYY or null",
                "mains_exam_date": "DD/MM/YYYY or null",
                "interview_date_start": "DD/MM/YYYY or null",
                "interview_date_end": "DD/MM/YYYY or null",
                "admit_card_release_date": "DD/MM/YYYY or null",
                "answer_key_date": "DD/MM/YYYY or null",
                "result_date": "DD/MM/YYYY or null",
                "document_verification_date": "DD/MM/YYYY or null",
                "joining_date": "DD/MM/YYYY or null"
            },
            
            "application_fee": {
                "general": "string or null",
                "ews": "string or null",
                "obc": "string or null",
                "sc_st": "string or null",
                "pwd": "string or null",
                "female": "string or null",
                "ex_serviceman": "string or null",
                "payment_mode": ["Online/Offline/SBI Challan/Net Banking/Credit Card/Debit Card/UPI"],
                "fee_exemption_details": "string or null"
            },
            
            "eligibility_criteria": {
                "nationality": "string or null",
                "age_limit": {
                    "min_age_years": number or null,
                    "max_age_years": number or null,
                    "age_cutoff_date": "DD/MM/YYYY or null",
                    "age_relaxation_sc_st": "string or null",
                    "age_relaxation_obc": "string or null",
                    "age_relaxation_pwd": "string or null",
                    "age_relaxation_ex_serviceman": "string or null",
                    "age_relaxation_other": "string or null"
                },
                "educational_qualification": {
                    "essential": ["string"],
                    "desirable": ["string or null"],
                    "percentage_requirement": "string or null",
                    "cgpa_requirement": "string or null"
                },
                "experience_required": {
                    "years": "string or null",
                    "field": "string or null",
                    "details": "string or null"
                },
                "physical_standards": {
                    "height_male": "string or null",
                    "height_female": "string or null",
                    "chest_unexpanded_male": "string or null",
                    "chest_expanded_male": "string or null",
                    "weight_female": "string or null",
                    "weight_male": "string or null",
                    "running_male": "string or null",
                    "running_female": "string or null",
                    "other_physical_standards": "string or null"
                },
                "medical_standards": "string or null"
            },
            
            "selection_process_stages": [
                {
                    "stage_number": number,
                    "stage_name": "Written Exam/Prelims/Mains/PET/PST/Interview/Skill Test/DV/Medical",
                    "is_qualifying_only": boolean,
                    "max_marks": number or null,
                    "duration_minutes": number or null,
                    "syllabus_topics": ["string or null"],
                    "negative_marking": "string or null"
                }
            ],
            
            "syllabus_summary": {
                "subjects": ["string"],
                "exam_pattern_note": "string or null"
            },
            
            "how_to_apply_steps": ["string"],
            "official_website_url": "string or null",
            "contact_helpdesk": "string or null",
            "language_detected": "Hindi/English/Both"
        }
        
        Important instructions for extraction:
        1. Extract ALL posts in the table, don't miss any post
        2. Convert ALL dates to DD/MM/YYYY format strictly
        3. Handle Hindi + English mixed text - translate Hindi to English but preserve proper nouns
        4. Extract ALL tables completely with exact numbers
        5. For dates, if year is implied (like "2024" is written once), apply consistently
        6. If a field structure is completely absent, use null, never omit the field
        7. For arrays, return empty array [] if no data, not null
        8. Pay special attention to:
           - Category-wise vacancy breakdowns (often in tables)
           - Multiple exam stages and their marks
           - Age relaxation details (often in footnotes)
           - Fee exemption details (often in notes)
        9. Do NOT hallucinate - if truly uncertain, use null
        10. Government notifications often have important details in small print/footnotes - read EVERYTHING
        """

        from google import genai as genai_sdk
        from google.genai import types as genai_types

        try:
            api_success = False
            response_text = None
            while True:
                if not self.gemini_client:
                    self.logger.error("No active Gemini client (all keys exhausted).")
                    self.stats_summary['pdf_failed'] += 1
                    return

                try:
                    # Rate limit Gemini API calls
                    self._gemini_rate_limit()

                    key_preview = self._gemini_api_key[-6:] if len(self._gemini_api_key) > 6 else self._gemini_api_key
                    self.logger.info(f'🤖 Parsing: {response.meta["title"]} | model={self._active_model_name} | key=...{key_preview}')

                    # Send PDF bytes inline (no file upload needed with new SDK)
                    with open(tmp_path, 'rb') as f:
                        pdf_bytes = f.read()

                    res = self.gemini_client.models.generate_content(
                        model=self._active_model_name,
                        contents=[
                            genai_types.Part.from_bytes(data=pdf_bytes, mime_type='application/pdf'),
                            prompt,
                        ],
                        config=genai_types.GenerateContentConfig(
                            temperature=0.1,
                            max_output_tokens=8192,
                            top_p=0.95,
                        )
                    )
                    response_text = res.text.strip()
                    api_success = True
                    break

                except Exception as e:
                    err_str = str(e)

                    # ---- 429 / Quota: rotate API key ----
                    if "429" in err_str or "quota" in err_str.lower() or "ResourceExhausted" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                        masked = self._gemini_api_key[-6:] if len(self._gemini_api_key) > 6 else self._gemini_api_key
                        self.logger.warning(f"Gemini 429/quota on key=...{masked}: rotating key")
                        self.key_manager.mark_exhausted(self._gemini_api_key)
                        if not self._configure_next_key():
                            break   # all keys exhausted

                    # ---- 404 / Model not available: try fallback model ----
                    elif "404" in err_str or "NOT_FOUND" in err_str or "not available" in err_str.lower():
                        self.logger.warning(
                            f"Gemini 404: model '{self._active_model_name}' not available — trying next model"
                        )
                        chain   = self.MODEL_FALLBACK_CHAIN
                        current = self._active_model_name
                        try:
                            start_idx = chain.index(current) + 1
                        except ValueError:
                            start_idx = 0

                        if start_idx < len(chain):
                            self._active_model_name = chain[start_idx]
                            self.logger.info(f"MultiGovtJobSpider: Switched to fallback model={self._active_model_name}")
                        else:
                            self.logger.error("MultiGovtJobSpider: All fallback models exhausted. Skipping PDF.")
                            self.stats_summary['pdf_failed'] += 1
                            return

                    # ---- Any other error: log and skip this PDF ----
                    else:
                        self.stats_summary['pdf_failed'] += 1
                        self.logger.error(f'Gemini error (skipping PDF): {str(e)[:200]}')
                        return   # skip without crashing

            if not api_success or response_text is None:
                self.stats_summary['pdf_failed'] += 1
                yield {
                    'error': 'Gemini API failed',
                    'error_details': 'All Gemini API keys exhausted.',
                    'source_url': response.meta['pdf_url'],
                    'source': response.meta.get('source', 'Unknown')
                }
                return

            # ── Clean markdown code-fence if present ──
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            elif response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            try:
                structured_data = json.loads(response_text)
                
                # Add source metadata
                structured_data['_source_metadata'] = {
                    'pdf_url': response.meta['pdf_url'],
                    'source_url': response.meta['source_url'],
                    'title': response.meta['title'],
                    'source': response.meta['source'],
                    'state': response.meta['state'],
                    'published_date': response.meta['published_date'],
                    'parsed_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'pdf_hash': pdf_hash,
                    'pdf_size_bytes': len(pdf_content),
                    'parser_version': getattr(self, '_active_model_name', 'gemini-2.0-flash-lite')
                }
                
                # Update stats
                self.stats_summary['pdf_parsed'] += 1
                self.stats_summary['source_stats'][response.meta['source']]['parsed'] += 1
                
                # Log success
                org = structured_data.get('organization_name', 'Unknown')
                posts = len(structured_data.get('post_details', []))
                total_vac = sum(
                    post.get('total_vacancies', 0) or 0 
                    for post in structured_data.get('post_details', [])
                )
                
                self.logger.info(
                    f'✅ Parsed: {org} | Posts: {posts} | '
                    f'Vacancies: {total_vac} | '
                    f'Source: {response.meta["source"]}'
                )
                
                yield structured_data
                
            except json.JSONDecodeError as e:
                self.stats_summary['pdf_failed'] += 1
                self.logger.error(f'❌ JSON parse failed: {str(e)[:100]}')
                
                # Save failed response for debugging
                debug_file = f'debug_failed_{pdf_hash[:8]}.txt'
                with open(debug_file, 'w', encoding='utf-8') as f:
                    f.write(response_text)
                
                yield {
                    'error': 'JSON parsing failed',
                    'error_details': str(e),
                    'raw_response_preview': response_text[:500],
                    'debug_file': debug_file,
                    'source_url': response.meta['pdf_url']
                }
            
        finally:
            # Cleanup temp file
            Path(tmp_path).unlink(missing_ok=True)
    
    def handle_pdf_error(self, failure):
        """Handle PDF download failures"""
        self.logger.error(f'❌ Failed to download PDF: {failure.request.url}')
        self.stats_summary['pdf_failed'] += 1
    
    def closed(self, reason):
        """Print final statistics"""
        self.logger.info('='*60)
        self.logger.info('📊 FINAL STATISTICS')
        self.logger.info('='*60)
        self.logger.info(f'✅ PDFs Successfully Parsed: {self.stats_summary["pdf_parsed"]}')
        self.logger.info(f'❌ PDFs Failed: {self.stats_summary["pdf_failed"]}')
        self.logger.info(f'📦 Total PDFs Processed: {self.stats_summary["pdf_parsed"] + self.stats_summary["pdf_failed"]}')
        self.logger.info(f'📄 Pages Crawled: {self.stats_summary["pages_crawled"]}')
        self.logger.info(f'🔁 Pages Skipped (all duplicates): {self.stats_summary["pages_skipped_duplicate"]}')
        self.logger.info('')
        
        for source, stats in self.stats_summary['source_stats'].items():
            self.logger.info(
                f'📌 {source}: {stats["found"]} found, {stats["parsed"]} parsed, '
                f'{stats["pages_crawled"]} pages crawled, '
                f'{stats["pages_skipped_duplicate"]} pages skipped (dup)'
            )
        
        self.logger.info('='*60)