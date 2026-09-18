# spiders/mumbai_police_spider.py — Mumbai Police (DYNAMIC, ICT Mumbai Pattern)
# Target: https://mumbaipolice.gov.in/Recruitment
#
# PAGE STRUCTURE:
# - Table with 4 columns: Date | Details | Title | Link
# - Bilingual content (Marathi + English)
# - Date formats: "१४-ऑगस्ट-२०२६" (Marathi) or "14-Aug-2026" (English)
# - Link column may have PDF or detail page links
#
# PRINCIPLES (same as ACTREC/NEERI/IISER/ICT/PDKV/CIRCOT/NBSSLUP/KRCL/MECL/MPSC):
# - NO hardcoded venue, selection process, relaxation, etc.
# - All rich data extracted from PDF by Gemini pipeline
# - Random user agents (handled by RandomUserAgentMiddleware)
# - Dynamic ai_extracted_data structure (starts empty, AI fills it)
# ============================================================

import scrapy
import re
import hashlib
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class MumbaiPoliceSpider(DuplicateStopMixin, scrapy.Spider):
    name = "mumbai_police"
    source_name = "Mumbai Police Official Recruitment Portal"
    allowed_domains = ["mumbaipolice.gov.in"]
    start_urls = [
        "https://mumbaipolice.gov.in/Recruitment",
        "https://mumbaipolice.gov.in/",  # Warm-up
    ]

    dedup_org = "MUMBAI_POLICE"
    
    target_state = "maharashtra"
    target_lang = "mr"  # Primary language is Marathi

    custom_settings = {
        "DOWNLOAD_DELAY": 3,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
    }

    # Marathi month names mapping
    MARATHI_MONTHS = {
        "जानेवारी": "01", "फेब्रुवारी": "02", "मार्च": "03", "एप्रिल": "04",
        "मे": "05", "जून": "06", "जुलै": "07", "ऑगस्ट": "08",
        "सप्टेंबर": "09", "ऑक्टोबर": "10", "नोव्हेंबर": "11", "डिसेंबर": "12",
    }

    # Devanagari digits to Arabic
    DEVANAGARI_DIGITS = {
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
    }

    # Keywords that indicate job types
    JOB_KEYWORDS = [
        "भरती", "recruitment", "constable", "शिपाई", "sub-inspector",
        "उप-निरीक्षक", "officer", "अधिकारी", "havaldar", "हवालदार",
        "naik", "नाईक", "assistant", "सहाय्यक", "clerk", "लिपिक",
        "driver", "चालक", "home guard", "होम गार्ड",
    ]

    # Keywords for notice types
    RESULT_KEYWORDS = ["निकाल", "result", "यादी", "list", "selected", "निवड", "merit"]
    CORRIGENDUM_KEYWORDS = ["सुधारणा", "corrigendum", "दुरुस्ती", "amendment"]

    def parse(self, response):
        self.logger.info(f"Mumbai Police: Parsing {response.url} — status {response.status}")
        
        # If this is homepage warm-up, go to recruitment page
        if response.url == "https://mumbaipolice.gov.in/" or response.url == "https://mumbaipolice.gov.in":
            yield scrapy.Request(
                "https://mumbaipolice.gov.in/Recruitment",
                callback=self.parse_recruitment_page
            )
            return
        
        yield from self.parse_recruitment_page(response)

    def parse_recruitment_page(self, response):
        """Parse the recruitment page table."""
        self.logger.info(f"Mumbai Police: Parsing recruitment page — status {response.status}")

        # Find all tables on the page
        tables = response.css("table")
        self.logger.info(f"Mumbai Police: Found {len(tables)} table(s) on page")
        
        entries_found = 0
        for table in tables:
            rows = table.css("tr")
            for row in rows:
                item = self._parse_table_row(row, response)
                if item:
                    entries_found += 1
                    yield item
        
        if entries_found == 0:
            self.logger.warning("Mumbai Police: No entries found in tables")
            # Fallback: scan entire page for PDF links
            yield from self._scrape_all_pdfs(response)
        else:
            self.logger.info(f"Mumbai Police: Found {entries_found} recruitment entries")

    def _parse_table_row(self, row, response):
        """Parse a single table row."""
        
        cells = row.css("td")
        if len(cells) < 3:
            return None
        
        all_text = " ".join(row.css("::text").getall()).strip()
        if not all_text or len(all_text) < 10:
            return None
        
        # Column mapping (4 columns):
        # 0: Date (Marathi or English)
        # 1: Details/Description
        # 2: Title/Recruitment Name
        # 3: Link (PDF or detail page)
        
        # Extract all cell texts
        cell_texts = []
        cell_links = []
        for cell in cells:
            text = " ".join(cell.css("::text").getall()).strip()
            cell_texts.append(text)
            
            # Extract links from this cell
            links = []
            for link in cell.css("a"):
                href = link.attrib.get("href", "")
                if href:
                    full_url = response.urljoin(href) if not href.startswith("http") else href
                    links.append(full_url)
            cell_links.append(links)
        
        # Flexible date detection — try first 2 cells
        publish_date = None
        date_cell_idx = None
        for i, text in enumerate(cell_texts[:2]):
            parsed = self._parse_date(text)
            if parsed:
                publish_date = parsed
                date_cell_idx = i
                break
        
        # Remaining cells form title and description
        remaining_texts = [t for i, t in enumerate(cell_texts) if i != date_cell_idx]
        
        # Title = longest remaining text (or last non-empty)
        title_raw = max(remaining_texts, key=len) if remaining_texts else ""
        
        # Description = all other remaining texts
        desc_parts = [t for t in remaining_texts if t != title_raw and len(t) > 5]
        
        if not title_raw or len(title_raw) < 5:
            return None
        
        # Collect all links from all cells
        all_links = []
        for links in cell_links:
            all_links.extend(links)
        
        # Separate PDF links from other links
        pdf_urls = [l for l in all_links if l.lower().endswith(".pdf")]
        detail_links = [l for l in all_links if not l.lower().endswith(".pdf")]
        
        # Detect language
        has_devanagari = bool(re.search(r'[\u0900-\u097F]', title_raw))
        detected_lang = 'mr' if has_devanagari else 'en'
        
        # Deduplication
        dedup_string = f"MUMBAI_POLICE_{title_raw[:50]}"
        dedup_hash = hashlib.sha256(dedup_string.encode()).hexdigest()
        
        from pipelines import DeduplicationPipeline
        candidate_url = pdf_urls[0] if pdf_urls else (detail_links[0] if detail_links else response.url)
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[candidate_url]):
            self.logger.debug(f"Mumbai Police: Skipping known URL")
            return None
        
        clean_title = self._clean_title(title_raw)
        
        # Detect notice type
        title_lower = (title_raw + " " + " ".join(desc_parts)).lower()
        is_result = any(kw in title_lower for kw in self.RESULT_KEYWORDS)
        is_corrigendum = any(kw in title_lower for kw in self.CORRIGENDUM_KEYWORDS)
        is_closed = is_result
        
        # Detect employment type from keywords
        employment_type = self._detect_employment_type(title_raw + " " + " ".join(desc_parts))
        
        # Build item
        item = ExamNotificationItem()
        
        item['title'] = clean_title
        item['org_name'] = "Mumbai Police"
        item['org_acronym'] = "Mumbai Police"
        item['source_url'] = candidate_url
        item['notification_pdf'] = pdf_urls[0] if pdf_urls else None
        item['apply_start_date'] = publish_date
        item['apply_end_date'] = None  # Gemini will extract from PDF
        item['advt_no'] = self._extract_advt_no(title_raw + " " + " ".join(desc_parts))
        item['status'] = 'closed' if is_closed else 'published'
        item['exam_cities'] = ["Mumbai"]
        item['application_links'] = {
            "official_website": "https://mumbaipolice.gov.in",
            "detail_page": detail_links[0] if detail_links else None,
            "all_pdfs": pdf_urls if len(pdf_urls) > 1 else None,
        }

        item['state_slug'] = self.target_state
        item['lang'] = detected_lang
        item['is_walk_in'] = None  # Let AI determine from PDF
        item['employment_type'] = employment_type
        item['dedup_hash'] = dedup_hash
        item['ai_extracted_data'] = {}

        # Description
        desc_parts_final = []
        if publish_date:
            desc_parts_final.append(f"Published: {publish_date}")
        if is_result:
            desc_parts_final.append("Type: RESULT")
        elif is_corrigendum:
            desc_parts_final.append("Type: CORRIGENDUM")
        if desc_parts:
            desc_parts_final.append(f"Details: {' '.join(desc_parts)[:100]}")
        item['description'] = " | ".join(desc_parts_final) if desc_parts_final else clean_title[:100]

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | Mumbai Police Recruitment {year}",
            "meta_description": f"{clean_title} at Mumbai Police.",
        }

        self.logger.info(f"Mumbai Police: Yielded: {clean_title[:50]} | PDF: {len(pdf_urls)} found")
        return item

    def _detect_employment_type(self, text):
        """Detect employment type from title/description."""
        text_lower = text.lower()
        
        if "तात्पुरत" in text_lower or "temporary" in text_lower or "contract" in text_lower:
            return "contractual"
        if "कायम" in text_lower or "permanent" in text_lower:
            return "permanent"
        
        return None

    def _extract_advt_no(self, text):
        """Extract advertisement number from text."""
        if not text:
            return None
        
        patterns = [
            r'(?:advt|advertisement|जाहिरात)[\s.#/-]*no[\s.:\-]*([A-Z0-9/\-\.]+)',
            r'(?:advt|advertisement|जाहिरात)[\s.#/-]*([A-Z0-9/\-\.]+)',
            r'Advt\.?\s*No\.?\s*([A-Z0-9/\-\.]+)',
            r'क्र\.?\s*([A-Z0-9/\-\.]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None

    def _scrape_all_pdfs(self, response):
        """Fallback: scrape all PDF links on the page."""
        seen = set()
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = " ".join(link.css("::text").getall()).strip()
            
            if not href.lower().endswith(".pdf"):
                continue
            
            full_url = response.urljoin(href) if not href.startswith("http") else href
            
            if full_url in seen:
                continue
            seen.add(full_url)
            
            dedup_hash = hashlib.sha256(f"MUMBAI_POLICE_PDF_{full_url}".encode()).hexdigest()
            from pipelines import DeduplicationPipeline
            if self.track_duplicate(dedup_hash, label=text or full_url, urls=[full_url]):
                continue
            
            clean_title = self._clean_title(text) if text else full_url.split("/")[-1].replace(".pdf", "").replace("_", " ")
            
            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "Mumbai Police"
            item['org_acronym'] = "Mumbai Police"
            item['source_url'] = full_url
            item['notification_pdf'] = full_url
            item['apply_start_date'] = None
            item['apply_end_date'] = self._extract_date_from_url(full_url)
            item['advt_no'] = None
            item['status'] = 'published'
            item['exam_cities'] = ["Mumbai"]
            item['application_links'] = {"official_website": "https://mumbaipolice.gov.in"}

            item['state_slug'] = self.target_state
            item['lang'] = self.target_lang
            item['is_walk_in'] = None
            item['employment_type'] = None
            item['dedup_hash'] = dedup_hash
            item['ai_extracted_data'] = {}

            item['description'] = f"PDF: {full_url.split('/')[-1]}"

            year = datetime.utcnow().year
            item['seo_metadata'] = {
                "meta_title": f"{clean_title} | Mumbai Police Recruitment {year}",
                "meta_description": f"{clean_title} at Mumbai Police.",
            }

            yield item

    # ============================================================
    # HELPERS
    # ============================================================

    def _convert_devanagari_digits(self, text):
        """Convert Devanagari digits to Arabic digits."""
        result = ""
        for char in text:
            result += self.DEVANAGARI_DIGITS.get(char, char)
        return result

    def _parse_date(self, text):
        """Parse Marathi and English date formats."""
        if not text:
            return None
        
        text = text.strip()
        
        # Convert Devanagari digits to Arabic
        text_converted = self._convert_devanagari_digits(text)
        
        # Pattern 1: Marathi format "१४-ऑगस्ट-२०२६" -> "14-ऑगस्ट-2026"
        marathi_match = re.search(r'(\d{1,2})[-\s](\w+)[-\s](\d{4})', text_converted)
        if marathi_match:
            day, month_word, year = marathi_match.groups()
            
            # Check if month_word is a Marathi month name
            month_num = self.MARATHI_MONTHS.get(month_word)
            if month_num:
                try:
                    date = datetime.strptime(f"{year}-{month_num}-{int(day):02d}", "%Y-%m-%d")
                    return date.strftime("%Y-%m-%d")
                except ValueError:
                    pass
        
        # Pattern 2: English format "14-Aug-2026"
        try:
            parsed = date_parser.parse(text_converted, dayfirst=True)
            return parsed.strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            pass
        
        # Pattern 3: DD-MM-YYYY
        if re.match(r'^\d{2}[./-]\d{2}[./-]\d{4}$', text_converted):
            try:
                text_clean = text_converted.replace('/', '-').replace('.', '-')
                day, month, year = text_clean.split('-')
                return datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d").strftime("%Y-%m-%d")
            except ValueError:
                pass
        
        # Pattern 4: YYYY-MM-DD
        if re.match(r'^\d{4}-\d{2}-\d{2}$', text_converted):
            return text_converted
        
        return None

    def _extract_date_from_url(self, url):
        """Extract date from URL or PDF filename."""
        if not url:
            return None
        
        match = re.search(r'(\d{2})[.-](\d{2})[.-](\d{4})', url)
        if match:
            day, month, year = match.groups()
            try:
                return datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d").strftime("%Y-%m-%d")
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

    def _clean_title(self, text):
        """Clean title text."""
        if not text:
            return ""
        cleaned = re.sub(r'<[^>]+>', '', text)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        cleaned = re.sub(r'[*•]+', '', cleaned)
        return cleaned[:500]