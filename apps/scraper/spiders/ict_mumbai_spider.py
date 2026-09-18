# ============================================================
# spiders/ict_mumbai_spider.py — ICT Mumbai (ANTI-BLOCK VERSION)
# Target: https://www.ictmumbai.edu.in/NewsEventViewAllNew.aspx?type=vn
# 
# ANTI-BLOCK STRATEGY:
# - Full browser-like headers (Accept, Referer, etc.)
# - Warm-up request to homepage first (establishes session)
# - Longer delays (4-6 seconds)
# - Retry with exponential backoff
# - Rotate common browser user agents
# ============================================================

import scrapy
import re
import hashlib
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class IctMumbaiSpider(DuplicateStopMixin, scrapy.Spider):
    name = "ict_mumbai"
    source_name = "ICT Mumbai Official Vacancies Portal"
    allowed_domains = ["ictmumbai.edu.in"]
    
    # Start with homepage to warm up session
    start_urls = [
        "https://www.ictmumbai.edu.in/",
    ]

    dedup_org = "ICT_MUMBAI"
    
    target_state = "maharashtra"
    target_lang = "en"

    # Browser-like headers (critical for bypassing 403)
    BROWSER_HEADERS = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
    }

    custom_settings = {
        "DOWNLOAD_DELAY": 4,  # Longer delay (4 seconds)
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        "DOWNLOAD_TIMEOUT": 30,
        "RETRY_TIMES": 5,
        "RETRY_HTTP_CODES": [403, 429, 500, 502, 503, 504, 408],
        "DEFAULT_REQUEST_HEADERS": {
            **{
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
            }
        },
        # NO USER_AGENT here — RandomUserAgentMiddleware handles it
    }

    VACANCY_KEYWORDS = [
        "vacancy", "vacancies", "recruitment", "advertisement",
        "walk-in", "walk in", "interview", "fellow", "trainee",
        "apprentice", "professor", "faculty", "scientist",
        "engineer", "officer", "assistant", "research",
        "vnc", "vn", "bira", "advert"
    ]

    def parse(self, response):
        """Warm-up: visit homepage first, then go to vacancies page."""
        self.logger.info(f"ICT Mumbai: Homepage warm-up complete — status {response.status}")
        
        # Now request the actual vacancies listing page
        vacancies_url = "https://www.ictmumbai.edu.in/NewsEventViewAllNew.aspx?type=vn"
        
        yield scrapy.Request(
            vacancies_url,
            callback=self.parse_vacancies_list,
            headers=self.BROWSER_HEADERS,
            meta={'from_homepage': True}
        )

    def parse_vacancies_list(self, response):
        """Parse the vacancies listing page."""
        self.logger.info(f"ICT Mumbai: Parsing vacancies list — status {response.status}")

        if response.status == 403:
            self.logger.error("ICT Mumbai: Still getting 403 — server is blocking requests")
            return

        links = self._find_vacancy_links(response)
        
        if links:
            self.logger.info(f"ICT Mumbai: Found {len(links)} vacancy links")
            for link_info in links:
                request = self._build_detail_request(link_info, response)
                if request:
                    yield request
        else:
            self.logger.warning("ICT Mumbai: No vacancy links found, trying fallback")
            yield from self._scrape_all_links(response)

    def _find_vacancy_links(self, response):
        """Find all links that look like vacancies."""
        links_info = []
        seen_urls = set()

        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = " ".join(link.css("::text").getall()).strip()
            
            if not href:
                continue
            
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            if full_url in seen_urls:
                continue
            
            is_detail_page = "NewsFilesN.aspx" in href or "NewsEventView.aspx" in href
            is_pdf = href.lower().endswith(".pdf")
            
            if not (is_detail_page or is_pdf):
                continue
            
            combined = f"{text} {href}".lower()
            is_vacancy = any(kw in combined for kw in self.VACANCY_KEYWORDS)
            
            if not is_vacancy and not is_pdf:
                continue
            
            seen_urls.add(full_url)
            
            extracted_date = self._extract_date_from_text(text) or self._extract_date_from_url(href)
            
            links_info.append({
                'url': full_url,
                'text': text,
                'is_pdf': is_pdf,
                'extracted_date': extracted_date,
            })

        return links_info

    def _build_detail_request(self, link_info, response):
        """Build a Request with full browser headers."""
        url = link_info['url']
        text = link_info['text']
        is_pdf = link_info['is_pdf']
        
        if is_pdf:
            return self._build_direct_pdf_item(url, text, link_info.get('extracted_date'), response)
        
        id_match = re.search(r'id=([^&]+)', url)
        unique_id = id_match.group(1) if id_match else url
        
        dedup_string = f"ICT_{unique_id}_{text[:30]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            self.logger.debug(f"ICT: Skipping known URL")
            return None
        
        # Build headers with Referer pointing to listing page
        headers = {
            **self.BROWSER_HEADERS,
            "Referer": response.url,  # Critical: pretend we clicked from listing page
        }
        
        return scrapy.Request(
            url,
            callback=self._parse_detail_page,
            headers=headers,
            meta={
                'list_text': text,
                'list_date': link_info.get('extracted_date'),
                'dedup_hash': dedup_hash,
                'list_url': response.url,
            }
        )

    def _parse_detail_page(self, response):
        """Parse the detail page to extract PDF URLs and full title."""
        self.logger.info(f"ICT Detail: Parsing {response.url} — status {response.status}")
        
        if response.status == 403:
            self.logger.warning(f"ICT Detail: 403 Forbidden — {response.url}")
            return
        
        meta = response.meta
        
        # Find PDF links
        pdf_urls = []
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            if not href:
                continue
            
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            if href.lower().endswith(".pdf"):
                pdf_urls.append(full_url)
            elif "vacancy" in href.lower() or "advert" in href.lower():
                pdf_urls.append(full_url)
        
        # Extract full title
        detail_title = None
        for selector in ["h1", "h2", "h3", ".page-title", ".news-title"]:
            detail_title = response.css(f"{selector}::text").get("")
            if detail_title and len(detail_title) > 5:
                detail_title = detail_title.strip()
                break
        
        if not detail_title or len(detail_title) < 5:
            detail_title = meta.get('list_text', '')
        
        detail_text = " ".join(response.css("body::text, main::text").getall())
        more_date = self._extract_date_from_text(detail_text)
        
        pdf_date = None
        if pdf_urls:
            for pdf_url in pdf_urls:
                d = self._extract_date_from_url(pdf_url)
                if d:
                    pdf_date = d
                    break
        
        final_date = more_date or meta.get('list_date') or pdf_date

        # Extract external links
        external_links = []
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            if href and href.startswith("http") and "ictmumbai.edu.in" not in href and not href.endswith(".pdf"):
                external_links.append({
                    'url': href,
                    'text': link.css("::text").get("").strip()
                })

        clean_title = self._clean_title(detail_title)
        notification_pdf = pdf_urls[0] if pdf_urls else None
        
        is_walk_in = "walk-in" in detail_text.lower() or "walk in" in detail_text.lower()
        is_walk_in = is_walk_in or "walk-in" in (meta.get('list_text', '').lower())
        is_closed = "closed" in detail_text.lower() or "applications closed" in detail_text.lower()

        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "Institute of Chemical Technology Mumbai"
        item['org_acronym'] = "ICT Mumbai"
        item['source_url'] = response.url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = None
        item['apply_end_date'] = final_date
        item['advt_no'] = self._extract_advt_no(detail_text + " " + meta.get('list_text', ''))
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = ["Mumbai"]
        item['application_links'] = {
            "official_website": "https://www.ictmumbai.edu.in",
            "detail_page": response.url,
            "all_pdfs": pdf_urls if len(pdf_urls) > 1 else None,
            "external_links": external_links if external_links else None,
        }

        item['state_slug'] = self.target_state
        item['lang'] = self.target_lang
        item['is_walk_in'] = is_walk_in if is_walk_in else None
        item['employment_type'] = 'walkin' if is_walk_in else None
        item['dedup_hash'] = meta.get('dedup_hash')
        item['ai_extracted_data'] = {}

        desc_parts = []
        if is_walk_in:
            desc_parts.append("Type: WALK-IN")
        if final_date:
            desc_parts.append(f"Date: {final_date}")
        if len(pdf_urls) > 1:
            desc_parts.append(f"{len(pdf_urls)} PDFs attached")
        item['description'] = " | ".join(desc_parts) if desc_parts else f"Vacancy at ICT Mumbai"

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | ICT Mumbai Recruitment {year}",
            "meta_description": f"{clean_title} at Institute of Chemical Technology, Mumbai.",
        }

        self.logger.info(f"ICT: Yielded item: {clean_title[:50]} | PDF: {notification_pdf or 'None'}")
        yield item

    def _build_direct_pdf_item(self, pdf_url, text, extracted_date, response):
        """Build an item directly from a PDF link."""
        
        dedup_string = f"ICT_PDF_{pdf_url}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        from pipelines import DeduplicationPipeline
        if DeduplicationPipeline.is_known(dedup_hash):
            return None
        
        clean_title = self._clean_title(text) if text else pdf_url.split("/")[-1].replace(".pdf", "").replace("_", " ")
        pdf_date = extracted_date or self._extract_date_from_url(pdf_url)

        item = ExamNotificationItem()
        item['title'] = clean_title
        item['org_name'] = "Institute of Chemical Technology Mumbai"
        item['org_acronym'] = "ICT Mumbai"
        item['source_url'] = pdf_url
        item['notification_pdf'] = pdf_url
        item['apply_start_date'] = None
        item['apply_end_date'] = pdf_date
        item['advt_no'] = None
        item['status'] = 'published'
        item['exam_cities'] = ["Mumbai"]
        item['application_links'] = {
            "official_website": "https://www.ictmumbai.edu.in",
        }

        item['state_slug'] = self.target_state
        item['lang'] = self.target_lang
        item['is_walk_in'] = None
        item['employment_type'] = None
        item['dedup_hash'] = dedup_hash
        item['ai_extracted_data'] = {}

        item['description'] = f"PDF: {pdf_url.split('/')[-1]}"

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | ICT Mumbai Recruitment {year}",
            "meta_description": f"{clean_title} at ICT Mumbai.",
        }

        return item

    def _scrape_all_links(self, response):
        """Fallback: scrape all PDF and vacancy-related links."""
        seen = set()
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = " ".join(link.css("::text").getall()).strip()
            
            if not href:
                continue
            
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            if not (href.lower().endswith(".pdf") or "NewsFilesN.aspx" in href):
                continue
            
            if full_url in seen:
                continue
            seen.add(full_url)
            
            link_info = {
                'url': full_url,
                'text': text,
                'is_pdf': href.lower().endswith(".pdf"),
                'extracted_date': self._extract_date_from_url(href),
            }
            
            request = self._build_detail_request(link_info, response)
            if request:
                yield request

    # ================================================================
    # HELPERS
    # ================================================================

    def _extract_date_from_text(self, text):
        if not text:
            return None
        
        patterns = [
            (r'\b(\d{2})[./-](\d{2})[./-](\d{4})\b', lambda m: f"{m.group(3)}-{m.group(2)}-{m.group(1)}"),
            (r'\b(\d{4})-(\d{2})-(\d{2})\b', lambda m: m.group(0)),
        ]
        
        for pattern, formatter in patterns:
            match = re.search(pattern, text)
            if match:
                try:
                    result = formatter(match)
                    datetime.strptime(result, "%Y-%m-%d")
                    return result
                except ValueError:
                    continue
        
        try:
            date_match = re.search(r'\b(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|\w+ \d{1,2},? \d{4})\b', text)
            if date_match:
                return date_parser.parse(date_match.group(1), dayfirst=True).strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            pass
        
        return None

    def _extract_date_from_url(self, url):
        if not url:
            return None
        
        match = re.search(r'(\d{2})-(\d{2})-(\d{4})', url)
        if match:
            day, month, year = match.groups()
            try:
                date = datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d")
                return date.strftime("%Y-%m-%d")
            except ValueError:
                pass
        
        match = re.search(r'(\d{4})-(\d{2})-(\d{2})', url)
        if match:
            try:
                datetime.strptime(match.group(0), "%Y-%m-%d")
                return match.group(0)
            except ValueError:
                pass
        
        return None

    def _extract_advt_no(self, text):
        if not text:
            return None
        
        patterns = [
            r'(?:advt|advertisement|adv)[\s.#/-]*no[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'(?:advt|advertisement|adv)[\s.#/-]*([A-Z0-9/\-]+\d{4})',
            r'([A-Z]+/[A-Z0-9]+/\d{4})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None

    def _clean_title(self, text):
        if not text:
            return ""
        cleaned = re.sub(r'\s+', ' ', text).strip()
        cleaned = re.sub(r'[*•]+', '', cleaned)
        return cleaned[:500]