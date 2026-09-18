import scrapy
from google import genai
from google.genai import types
import json
import time
from pathlib import Path
from urllib.parse import urljoin
import tempfile
import hashlib
from datetime import datetime
import ssl
import urllib3,os
import warnings
import requests

# Disable SSL warnings for legacy government servers
warnings.filterwarnings('ignore', message='Unverified HTTPS request')
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class CustomHttpAdapter(requests.adapters.HTTPAdapter):
    """Transport adapter for legacy SSL servers like UPSSSC"""
    
    def init_poolmanager(self, connections, maxsize, block=False):
        ctx = ssl.create_default_context()
        ctx.options |= ssl.OP_LEGACY_SERVER_CONNECT
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        self.poolmanager = urllib3.PoolManager(
            num_pools=connections,
            maxsize=maxsize,
            block=block,
            ssl_context=ctx
        )


class UPSSSCSpider(scrapy.Spider):
    name = 'upsssc'
    
    start_urls = ['https://upsssc.gov.in/AllNotifications.aspx']

    # URL-path keywords that indicate irrelevant content.
    # We only want: recruitment, result, admit_card, answer_key, syllabus.
    _IRRELEVANT_URL_KEYWORDS = (
        'appln_summary', 'application_summary', 'appln summary',
        'application summary', 'applications_received',
        'tender', 'quotation', 'rate_contract',
        'press_release', 'press_note',
        'annual_report', 'annual_accounts',
        'office_order', 'office_memorandum', 'circular',
        'transfer_order', 'posting_order', 'seniority_list',
    )

    def _is_irrelevant_url(self, url: str) -> bool:
        """Return True if the PDF URL looks like administrative noise."""
        u = url.lower()
        return any(kw in u for kw in self._IRRELEVANT_URL_KEYWORDS)
    
    custom_settings = {
        'DOWNLOADER_MIDDLEWARES': {
            'rotating_proxies.middlewares.RotatingProxyMiddleware': None,
            'rotating_proxies.middlewares.BanDetectionMiddleware': None,
            'scrapy.downloadermiddlewares.httpproxy.HttpProxyMiddleware': None,
        },
        'DOWNLOADER_CLIENTCONTEXTFACTORY': 'apps.scraper.spiders.upsssc_spider.LegacySSLContextFactory',
        'RETRY_TIMES': 3,
        'DOWNLOAD_DELAY': 3,
        'CONCURRENT_REQUESTS': 1,
        'COOKIES_ENABLED': False,
    }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Initialize Gemini client
        from utils.gemini_client import GeminiKeyManager
        self.key_manager = GeminiKeyManager(logger=self.logger)
        self.current_key = self.key_manager.get_current_key()
        if self.current_key:
            self.gemini_client = genai.Client(api_key=self.current_key)
        else:
            self.gemini_client = None
        
        # Working model (fastest from your tests)
        self.model = "gemini-3.5-flash-lite"
        
        # Rate limiting (15 RPM free tier)
        self.gemini_requests = 0
        self.minute_start = time.time()
        
        # Stats
        self.pdf_count = 0
        self.parsed_count = 0
        self.failed_count = 0
        self.skipped_count = 0
        
        # PDF hash cache to avoid re-parsing
        self.parsed_hashes = set()
        
        # Custom session for PDF downloads
        self._session = None
    
    @property
    def session(self):
        """Lazy initialization of custom SSL session"""
        if self._session is None:
            self._session = requests.Session()
            adapter = CustomHttpAdapter()
            self._session.mount('https://', adapter)
            self._session.verify = False
        return self._session
    
    def _rate_limit(self):
        """Stay within 15 requests per minute free tier limit"""
        self.gemini_requests += 1
        if self.gemini_requests >= 14:
            elapsed = time.time() - self.minute_start
            if elapsed < 60:
                wait = 60 - elapsed + 2
                self.logger.info(f'⏳ Rate limit: waiting {wait:.0f}s...')
                time.sleep(wait)
            self.gemini_requests = 0
            self.minute_start = time.time()
    
    def _get_prompt(self):
        """Return comprehensive extraction prompt"""
        return """
        Extract ALL details from this Indian government job notification PDF.
        
        Return ONLY valid JSON (NO markdown, NO code blocks, NO explanations):
        
        {
            "language_detected": "Hindi/English/Bilingual/Multilingual",
            "organization": "Full organization name",
            "department": "Department/Ministry name",
            "recruiting_agency": "Agency conducting recruitment",
            "notification_number": "Official notification number",
            "advt_number": "Advertisement number if different",
            "job_type": "Permanent/Temporary/Contractual/Apprenticeship",
            "service_category": "Group A/Group B/Group C/Group D/Central/State/PSU",
            
            "post_details": [
                {
                    "post_name": "Name of the position",
                    "post_code": "Post code if any",
                    "total_vacancies": 0,
                    "category_breakdown": {
                        "general": null,
                        "ews": null,
                        "obc": null,
                        "sc": null,
                        "st": null,
                        "pwd_horizontal": null,
                        "ex_serviceman": null,
                        "sports_quota": null
                    },
                    "gender_specific": "Male/Female/Both",
                    "pay_scale": "Pay scale or level",
                    "pay_level": "Pay matrix level",
                    "salary_range": "Monthly salary range",
                    "allowances": "Additional allowances",
                    "job_location": ["List of posting locations"],
                    "posting_place": "State/District"
                }
            ],
            
            "total_combined_vacancies": 0,
            
            "important_dates": {
                "notification_date": "DD/MM/YYYY",
                "application_start_date": "DD/MM/YYYY",
                "application_end_date": "DD/MM/YYYY",
                "extended_end_date": null,
                "fee_payment_last_date": "DD/MM/YYYY",
                "correction_window_start": null,
                "correction_window_end": null,
                "prelims_exam_date": null,
                "mains_exam_date": null,
                "skill_test_date": null,
                "interview_start_date": null,
                "interview_end_date": null,
                "admit_card_release_date": null,
                "answer_key_date": null,
                "result_date": null,
                "document_verification_date": null,
                "joining_date": null
            },
            
            "application_fee": {
                "general": "Amount or FREE",
                "ews": null,
                "obc": "Amount or FREE",
                "sc_st": "Amount or FREE",
                "pwd": "Amount or FREE",
                "female": null,
                "ex_serviceman": null,
                "departmental_candidate": null,
                "payment_mode": ["Online/Offline/Challan/etc"],
                "fee_exemption_details": null
            },
            
            "eligibility_criteria": {
                "nationality": "Indian/Nepali/Bhutanese/etc",
                "age_limit": {
                    "min_age_years": 0,
                    "max_age_years": 0,
                    "age_cutoff_date": "DD/MM/YYYY",
                    "age_relaxation_sc_st": "Years of relaxation",
                    "age_relaxation_obc": "Years of relaxation",
                    "age_relaxation_pwd": "Years of relaxation",
                    "age_relaxation_ex_serviceman": "Years of relaxation",
                    "age_relaxation_departmental": null,
                    "age_relaxation_other": null
                },
                "educational_qualification": {
                    "essential": ["Required qualifications"],
                    "desirable": ["Preferred qualifications"],
                    "percentage_requirement": null,
                    "cgpa_requirement": null,
                    "specific_subjects": []
                },
                "experience_required": {
                    "years": null,
                    "field": null,
                    "details": null
                },
                "physical_standards": {
                    "height_male_cm": null,
                    "height_female_cm": null,
                    "chest_male_cm": null,
                    "chest_female_cm": null,
                    "weight_male_kg": null,
                    "weight_female_kg": null,
                    "running_male": null,
                    "running_female": null,
                    "other_tests": []
                },
                "other_eligibility": []
            },
            
            "vacancy_distribution": {
                "total_vacancies": 0,
                "category_wise": {
                    "ur": null,
                    "ews": null,
                    "obc": null,
                    "sc": null,
                    "st": null
                },
                "horizontal_reservation": null,
                "pwd_vacancies": null,
                "ex_serviceman_vacancies": null,
                "backlog_vacancies": null,
                "year_wise_breakdown": null
            },
            
            "selection_process": {
                "stages": ["Prelims/Mains/Interview/Skill Test/Physical/Document/Medical"],
                "exam_type": "Online/Offline/Both",
                "exam_details": [
                    {
                        "stage_name": "Name of exam stage",
                        "paper_name": "Paper name",
                        "subjects": ["List of subjects"],
                        "number_of_questions": 0,
                        "total_marks": 0,
                        "duration_minutes": 0,
                        "negative_marking": "Yes/No",
                        "negative_marking_per_question": null,
                        "qualifying_marks_general": null,
                        "qualifying_marks_reserved": null,
                        "medium_of_exam": "Hindi/English/Bilingual"
                    }
                ],
                "interview_details": {
                    "marks": null,
                    "weightage_percentage": null
                },
                "final_merit_criteria": null,
                "minimum_qualifying_marks": null
            },
            
            "exam_centers": ["List of exam cities"],
            "exam_cities_count": 0,
            
            "how_to_apply": {
                "steps": ["Step by step instructions"],
                "application_mode": "Online/Offline/Both",
                "documents_required": ["List of documents"],
                "photograph_specifications": null,
                "signature_specifications": null,
                "id_proof_required": []
            },
            
            "important_links": {
                "official_notification_pdf": "URL",
                "apply_online_link": "URL",
                "official_website": "URL",
                "admit_card_link": null,
                "result_link": null,
                "answer_key_link": null,
                "corrigendum_link": null,
                "syllabus_link": null
            },
            
            "contact_details": {
                "helpline_number": null,
                "email": null,
                "address": null,
                "website": null,
                "fax": null,
                "helpline_timing": null
            },
            
            "additional_information": {
                "corrigendum_details": null,
                "important_instructions": [],
                "special_provisions": null,
                "reservation_policy_note": null,
                "court_orders": null,
                "withdrawn_posts": [],
                "note_for_candidates": null
            },
            
            "syllabus": {
                "prelims_syllabus": null,
                "mains_syllabus": null,
                "skill_test_syllabus": null,
                "reference_books": []
            },
            
            "metadata": {
                "language_of_pdf": "Hindi/English/Bilingual",
                "total_pages": 0,
                "has_tables": true,
                "has_images": false,
                "is_scanned_document": false,
                "has_watermark": false
            }
        }
        
        CRITICAL RULES:
        1. Return ONLY the raw JSON object - NO markdown, NO code blocks, NO backticks
        2. Convert ALL dates to DD/MM/YYYY format strictly
        3. Handle Hindi + English mixed text - translate Hindi to English but PRESERVE proper nouns
        4. Extract ALL tables completely with exact numbers
        5. For dates, if year is implied, apply it consistently
        6. Use null for missing fields - NEVER omit a field
        7. For empty arrays use [] not null
        8. For empty objects use {} not null
        9. Read EVERY page of the PDF including footnotes and small print
        10. Pay special attention to:
            - Category-wise vacancy breakdowns (often in tables)
            - Multiple exam stages and their marks
            - Age relaxation details (often in footnotes)
            - Fee exemption details (often in notes)
            - Language of the notification
        11. Do NOT hallucinate - if truly uncertain, use null
        12. Detect the language(s) used in the PDF accurately
        """
    
    def _create_download_request(self, url, callback, meta=None):
        """Create request with custom SSL handling"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/pdf, */*;q=0.9',
            'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
            'Referer': 'https://upsssc.gov.in/',
        }
        
        return scrapy.Request(
            url,
            callback=callback,
            meta=meta or {},
            headers=headers,
            dont_filter=True,
            errback=self.handle_error
        )
    
    def parse(self, response):
        """Parse UPSSSC notification listing page"""
        self.logger.info(f'📄 Parsing listing: {response.url}')
        self.logger.info(f'📄 Status: {response.status}')
        
        # Find all PDF links
        pdf_links = set()
        
        # Selector 1: ViewPdf links
        for link in response.css('a[href*="ViewPdf"]::attr(href)').getall():
            if link and link != '#':
                pdf_links.add(link)
        
        # Selector 2: .pdf links
        for link in response.css('a[href*=".pdf"]::attr(href)').getall():
            if link and link != '#':
                pdf_links.add(link)
        
        # Selector 3: Table links
        for link in response.css('table a::attr(href)').getall():
            if link and ('ViewPdf' in link or '.pdf' in link.lower()):
                pdf_links.add(link)
        
        # Selector 4: GridView/DataGrid links
        for link in response.css('#GridView1 a::attr(href), #DataGrid1 a::attr(href), .gridview a::attr(href)').getall():
            if link and link != '#' and 'javascript' not in link.lower():
                pdf_links.add(link)
        
        # Selector 5: All links containing "notification" or "advt"
        for link in response.css('a::attr(href)').getall():
            if link and any(kw in link.lower() for kw in ['notification', 'advt', 'advertisement', 'vacancy', 'viewpdf']):
                pdf_links.add(link)
        
        self.logger.info(f'🔗 Found {len(pdf_links)} unique PDF links')
        
        if not pdf_links:
            self.logger.warning('⚠️ No PDF links found! Saving page for debugging...')
            with open('debug_listing_page.html', 'w', encoding='utf-8') as f:
                f.write(response.text)
            return
        
        # Process PDFs (limit to 10 for initial run)
        for link in list(pdf_links)[:10]:
            pdf_url = urljoin('https://upsssc.gov.in/', link)

            # Skip irrelevant PDFs (application summaries, tenders, etc.)
            if self._is_irrelevant_url(pdf_url):
                self.logger.debug(f'UPPSC: Skipping irrelevant URL: {pdf_url}')
                self.skipped_count += 1
                continue

            self.pdf_count += 1
            
            yield self._create_download_request(
                pdf_url,
                callback=self.parse_pdf,
                meta={
                    'pdf_url': pdf_url,
                    'source_page': response.url
                }
            )
        
        # Handle pagination
        next_page = response.css(
            'a:contains("Next")::attr(href), '
            'a:contains(">")::attr(href), '
            '.pagination a[href*="page"]::attr(href)'
        ).get()
        
        if next_page:
            next_url = urljoin('https://upsssc.gov.in/', next_page)
            yield response.follow(next_url, self.parse)
    
    def parse_pdf(self, response):
        """Download and parse PDF with Gemini"""
        
        self.logger.info(f'📎 Received: {response.url[:80]}...')
        self.logger.info(f'📎 Size: {len(response.body)} bytes')
        
        # Validate PDF
        if len(response.body) < 1000:
            self.logger.warning('⚠️ Response too small, skipping')
            self.skipped_count += 1
            return
        
        if not response.body.startswith(b'%PDF'):
            # Check if it's HTML redirect
            if b'<html' in response.body[:200].lower():
                self.logger.warning('⚠️ Got HTML instead of PDF (possibly redirect page)')
            else:
                self.logger.warning(f'⚠️ Not a PDF (starts with: {response.body[:50]})')
            self.skipped_count += 1
            return
        
        # Check for duplicate
        pdf_hash = hashlib.md5(response.body).hexdigest()
        if pdf_hash in self.parsed_hashes:
            self.logger.info(f'⏭️ Skipping duplicate: {pdf_hash[:8]}')
            self.skipped_count += 1
            return
        
        self.parsed_hashes.add(pdf_hash)
        
        # Save PDF
        pdf_filename = f'temp_pdfs/{pdf_hash}.pdf'
        Path('temp_pdfs').mkdir(exist_ok=True)
        
        with open(pdf_filename, 'wb') as f:
            f.write(response.body)
        
        self.logger.info(f'💾 Saved: {pdf_filename}')
        
        # Loop for key rotation/retry on API errors
        api_success = False
        text = None
        while True:
            if not self.gemini_client:
                self.logger.error("No active Gemini client (all keys exhausted).")
                self.failed_count += 1
                return

            try:
                # Rate limit
                self._rate_limit()
                
                masked_key = f"...{self.current_key[-6:]}" if len(self.current_key) > 6 else self.current_key
                self.logger.info(f'🤖 Sending to Gemini using key ending in {masked_key}...')
                
                # Upload PDF
                pdf_file = self.gemini_client.files.upload(file=pdf_filename)
                
                # Wait for processing
                retries = 0
                while pdf_file.state == "PROCESSING" and retries < 30:
                    time.sleep(1)
                    pdf_file = self.gemini_client.files.get(name=pdf_file.name)
                    retries += 1
                    if retries % 10 == 0:
                        self.logger.info(f'   Still processing... ({retries}s)')
                
                if pdf_file.state != "ACTIVE":
                    self.logger.error(f'❌ PDF state: {pdf_file.state}')
                    self.failed_count += 1
                    return
                
                self.logger.info('✅ PDF processed by Gemini')
                
                # Parse with comprehensive prompt
                prompt = self._get_prompt()
                
                result = self.gemini_client.models.generate_content(
                    model=self.model,
                    contents=[prompt, pdf_file],
                    config=types.GenerateContentConfig(
                        temperature=0.1,
                        max_output_tokens=8192,
                    )
                )
                text = result.text.strip()
                api_success = True
                break
            except Exception as e:
                err_str = str(e)
                if "429" in err_str or "quota" in err_str.lower() or "ResourceExhausted" in err_str:
                    self.logger.warning(f"Gemini API 429/quota error with key ending in ...{self.current_key[-6:] if len(self.current_key) > 6 else self.current_key}: {err_str}")
                    self.key_manager.mark_exhausted(self.current_key)
                    self.current_key = self.key_manager.get_current_key()
                    if self.current_key:
                        self.gemini_client = genai.Client(api_key=self.current_key)
                        self.logger.info("Retrying PDF parsing with next API key...")
                        continue
                    else:
                        self.gemini_client = None
                        self.logger.error("All Gemini API keys exhausted.")
                        self.failed_count += 1
                        return
                else:
                    self.failed_count += 1
                    self.logger.error(f'❌ Gemini API error: {str(e)[:200]}')
                    return

        if not api_success or text is None:
            return

        try:
            # Remove markdown code blocks
            for prefix in ['```json\n', '```json', '```\n', '```']:
                if text.startswith(prefix):
                    text = text[len(prefix):]
            for suffix in ['\n```', '```']:
                if text.endswith(suffix):
                    text = text[:-len(suffix)]
            text = text.strip()
            
            # Parse JSON
            data = json.loads(text)
            
            # Add source metadata
            data['_source_metadata'] = {
                'pdf_url': response.meta['pdf_url'],
                'source_page': response.meta['source_page'],
                'parsed_at': datetime.now().isoformat(),
                'model_used': self.model,
                'pdf_hash': pdf_hash,
                'pdf_size_bytes': len(response.body),
                'source': 'UPSSSC',
                'state': 'Uttar Pradesh'
            }
            
            self.parsed_count += 1
            
            # Log summary
            org = data.get('organization', 'Unknown')
            posts = len(data.get('post_details', []))
            total_vac = data.get('total_combined_vacancies', 0)
            lang = data.get('language_detected', 'Unknown')
            
            # Calculate from post_details if total_combined is 0
            if total_vac == 0:
                total_vac = sum(
                    p.get('total_vacancies', 0) or 0 
                    for p in data.get('post_details', [])
                )
            
            self.logger.info(
                f'✅ PARSED [{lang}] | {org} | '
                f'Posts: {posts} | Vacancies: {total_vac}'
            )
            
            yield data
            
        except json.JSONDecodeError as e:
            self.failed_count += 1
            self.logger.error(f'❌ JSON parse error: {e}')
            
            # Save failed response
            debug_file = f'failed_parse_{pdf_hash[:8]}.txt'
            with open(debug_file, 'w', encoding='utf-8') as f:
                f.write(text if text is not None else 'No response')
            self.logger.error(f'💾 Debug saved: {debug_file}')
    
    def handle_error(self, failure):
        """Handle download errors"""
        self.logger.error(f'❌ Download failed: {failure.request.url[:80]}')
        self.logger.error(f'   Error: {str(failure.value)[:200]}')
        self.failed_count += 1
    
    def closed(self, reason):
        """Print final statistics"""
        self.logger.info('='*60)
        self.logger.info('📊 FINAL STATISTICS')
        self.logger.info('='*60)
        self.logger.info(f'📄 PDFs found: {self.pdf_count}')
        self.logger.info(f'✅ Successfully parsed: {self.parsed_count}')
        self.logger.info(f'❌ Failed: {self.failed_count}')
        self.logger.info(f'⏭️ Skipped: {self.skipped_count}')
        self.logger.info(f'🤖 Model: {self.model}')
        self.logger.info(f'📦 Total processed: {self.parsed_count + self.failed_count + self.skipped_count}')
        self.logger.info('='*60)


class LegacySSLContextFactory:
    """Custom SSL context factory for Scrapy to handle legacy servers"""
    
    def getContext(self, hostname=None, port=None):
        ctx = ssl.create_default_context()
        ctx.options |= ssl.OP_LEGACY_SERVER_CONNECT
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx