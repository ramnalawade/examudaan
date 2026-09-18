# ============================================================
# spiders/csir_neeri_spider.py — CSIR-NEERI Nagpur (COMPLETE FILE)
# 
# TWO sources:
# 1. recruitment.neeri.res.in/appform/index.php?page=2
#    → Project Staff table (7 columns):
#    Title | Advt No | Positions | Opening Date | Closing Date | Apply Now | Remark
#    Dates: DD-MM-YYYY | Apply: "Walk-In\nDD-MM-YYYY" | No PDFs
#
# 2. www.neeri.res.in/contents/recruitment
#    → Permanent Staff / Notifications table (Hindi, 3 columns):
#    क्रमांक | विज्ञापन दस्तावेज़ | पीडीएफ / लिंक
#    Has actual PDF links ("पीडीएफ देखें") and detail links ("लिंक देखें")
# ============================================================

import scrapy
import re
from datetime import datetime
from dateutil import parser as date_parser

from items import ExamNotificationItem
from spiders.dedup_mixin import DuplicateStopMixin


class CsirNeeriSpider(DuplicateStopMixin, scrapy.Spider):
    name = "csir_neeri"
    source_name = "CSIR-NEERI Nagpur Official Recruitment"
    allowed_domains = ["neeri.res.in", "recruitment.neeri.res.in"]
    start_urls = [
        "https://recruitment.neeri.res.in/appform/index.php?page=2",
        "https://www.neeri.res.in/contents/recruitment",
    ]

    dedup_org = "CSIR_NEERI"

    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
        "DOWNLOAD_VERIFY_CERTIFICATES": False,
        "USER_AGENT": "ExamUdaanBot/1.0 (+https://examudaan.in; contact@examudaan.in)",
    }

    TABLE_SELECTORS = [
        "table.recruitment-table",
        "table.table-striped",
        "table.table",
        "table",
    ]

    def parse(self, response):
        self.logger.info(f"CSIR-NEERI: Parsing {response.url} — status {response.status}")

        if "recruitment.neeri.res.in" in response.url:
            yield from self._parse_project_staff(response)
        elif "neeri.res.in/contents/recruitment" in response.url:
            yield from self._parse_permanent_staff(response)
        else:
            self.logger.warning(f"CSIR-NEERI: Unknown URL pattern: {response.url}")

    # ================================================================
    # SOURCE 1: Project Staff Portal (recruitment.neeri.res.in)
    # ================================================================

    def _parse_project_staff(self, response):
        """Parse the project staff advertisement table.
        
        Columns (7):
        0: Title (project description)
        1: Advertisement No (RECRUIT_RC_...)
        2: Positions (Project Associate-I, Project Assistant-II, etc.)
        3: Date of Opening (DD-MM-YYYY)
        4: Date of Closing (DD-MM-YYYY)
        5: Apply Now (Walk-In + date, or Online link)
        6: Remark
        """
        rows = self._find_table_rows(response, min_cols=5)

        if rows:
            self.logger.info(f"CSIR-NEERI Project Staff: Found {len(rows)} rows")
            for row in rows:
                item = self._parse_project_row(row, response)
                if item:
                    yield item
        else:
            self.logger.warning("CSIR-NEERI Project Staff: No table rows found")

        # Follow pagination if any
        next_pages = response.css(
            "a.next::attr(href), li.next a::attr(href), a:contains('Next')::attr(href)"
        ).getall()
        for url in next_pages:
            yield response.follow(url, self._parse_project_staff)

    def _parse_project_row(self, row, response):
        cells = row.css("td")
        if len(cells) < 5:
            return None

        # Column 0: Title (project description — can be very long)
        title_raw = " ".join(cells[0].css("::text").getall()).strip()
        if not title_raw or len(title_raw) < 10:
            return None

        # Column 1: Advertisement No
        advt_no = cells[1].css("::text").get("").strip() if len(cells) > 1 else None

        # Column 2: Positions
        positions = cells[2].css("::text").get("").strip() if len(cells) > 2 else None

        # Column 3: Date of Opening (DD-MM-YYYY)
        apply_start = self._parse_date(cells[3].css("::text").get("").strip()) if len(cells) > 3 else None

        # Column 4: Date of Closing (DD-MM-YYYY)
        apply_end = self._parse_date(cells[4].css("::text").get("").strip()) if len(cells) > 4 else None

        # Column 5: Apply Now (may contain "Walk-In\nDD-MM-YYYY" or an <a> link)
        walkin_date = None
        apply_link = None
        if len(cells) > 5:
            apply_cell_text = " ".join(cells[5].css("::text").getall()).strip()
            href = cells[5].css("a::attr(href)").get()

            if href:
                apply_link = response.urljoin(href) if not href.startswith("http") else href

            # Extract walk-in date from text like "Walk-In 07-08-2026"
            date_match = re.search(r'(\d{2}-\d{2}-\d{4})', apply_cell_text)
            if date_match:
                walkin_date = self._parse_date(date_match.group(1))

        # Column 6: Remark
        remark = cells[6].css("::text").get("").strip() if len(cells) > 6 else None

        # Look for any PDF links in the row
        notification_pdf = None
        for link in row.css("a"):
            href = link.attrib.get("href", "")
            if href.lower().endswith(".pdf"):
                notification_pdf = response.urljoin(href) if not href.startswith("http") else href
                break

        import hashlib
        candidate_url = notification_pdf or apply_link or f"{response.url}#{advt_no}"
        dedup_hash = hashlib.sha256(f"NEERI_PROJ_{candidate_url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[notification_pdf, candidate_url]):
            return None

        # Build clean title: extract position + short project name
        clean_title = self._build_neeri_title(title_raw, positions)

        # Determine location from advt_no or title
        location = self._extract_location(advt_no, title_raw)

        # Build item
        item = ExamNotificationItem()
        item['title'] = clean_title
        item['org_name'] = "CSIR-National Environmental Engineering Research Institute"
        item['org_acronym'] = "CSIR-NEERI"
        item['source_url'] = candidate_url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = apply_start
        item['apply_end_date'] = apply_end
        item['advt_no'] = advt_no
        item['status'] = self._determine_status(apply_end or walkin_date)
        item['exam_cities'] = [location]
        item['application_links'] = {
            "official_website": "https://recruitment.neeri.res.in",
            "apply_online": apply_link,
            "walk_in_date": walkin_date,
        }

        # Build description
        desc_parts = []
        if positions:
            desc_parts.append(f"Position: {positions}")
        desc_parts.append(f"Opening: {apply_start or 'N/A'}")
        desc_parts.append(f"Closing: {apply_end or 'N/A'}")
        if walkin_date:
            desc_parts.append(f"Walk-In: {walkin_date}")
        if remark and remark.lower() != "none":
            desc_parts.append(f"Remark: {remark}")
        # Add truncated project title for context
        if len(title_raw) > 80:
            desc_parts.append(f"Project: {title_raw[:150]}...")
        item['description'] = " | ".join(desc_parts)

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | CSIR-NEERI Recruitment {year}",
            "meta_description": f"{clean_title} at CSIR-NEERI Nagpur. Position: {positions or 'N/A'}. Last date: {apply_end or walkin_date or 'N/A'}.",
        }

        return item

    # ================================================================
    # SOURCE 2: Permanent Staff / Notifications (neeri.res.in)
    # ================================================================

    def _parse_permanent_staff(self, response):
        """Parse the permanent staff recruitment page (Hindi).
        
        Table columns (3):
        0: क्रमांक (Serial number)
        1: विज्ञापन दस्तावेज़ (Advertisement document title)
        2: पीडीएफ / लिंक (PDF view / Link view — contains <a> tags)
        """
        rows = self._find_table_rows(response, min_cols=3)

        if rows:
            self.logger.info(f"CSIR-NEERI Permanent: Found {len(rows)} rows")
            for row in rows:
                item = self._parse_permanent_row(row, response)
                if item:
                    yield item
        else:
            self.logger.warning("CSIR-NEERI Permanent: No table rows found")

        # Also scrape any standalone PDF links on the page
        yield from self._scrape_pdf_links(response)

    def _parse_permanent_row(self, row, response):
        cells = row.css("td")
        if len(cells) < 2:
            return None

        # Column 0: Serial number
        sr_text = cells[0].css("::text").get("").strip()
        if not sr_text.isdigit():
            return None

        # Column 1: Document title
        title_raw = " ".join(cells[1].css("::text").getall()).strip()
        if not title_raw or len(title_raw) < 5:
            return None

        # Column 2: PDF / Link
        notification_pdf = None
        detail_link = None
        if len(cells) > 2:
            for link in cells[2].css("a"):
                href = link.attrib.get("href", "")
                text = link.css("::text").get("").strip()

                if not href:
                    continue

                full_url = response.urljoin(href) if not href.startswith("http") else href

                # "पीडीएफ देखें" = View PDF
                if href.lower().endswith(".pdf") or "pdf" in text.lower() or "पीडीएफ" in text:
                    notification_pdf = full_url
                # "लिंक देखें" = View Link
                elif "लिंक" in text or "link" in text.lower():
                    detail_link = full_url
                else:
                    detail_link = full_url

        # Skip rows that are just administrative notices (not job postings)
        skip_keywords = ["answer key", "rectification", "addendum", "annexure",
                         "faq", "proforma", "proficiency", "stenography",
                         "उत्तर कुंजी", "सुधार", "अनुलग्नक", "प्रवीणता"]
        if any(kw in title_raw.lower() for kw in skip_keywords):
            self.logger.debug(f"NEERI: Skipping non-recruitment notice: {title_raw[:50]}")
            return None

        import hashlib
        candidate_url = notification_pdf or detail_link or f"{response.url}#perm-{sr_text}"
        dedup_hash = hashlib.sha256(f"NEERI_PERM_{candidate_url}".encode()).hexdigest()
        if self.track_duplicate(dedup_hash, label=title_raw, urls=[notification_pdf, candidate_url]):
            return None

        clean_title = self._clean_title(title_raw)

        # Build item
        item = ExamNotificationItem()
        item['title'] = clean_title
        item['org_name'] = "CSIR-National Environmental Engineering Research Institute"
        item['org_acronym'] = "CSIR-NEERI"
        item['source_url'] = candidate_url
        item['notification_pdf'] = notification_pdf
        item['apply_start_date'] = None
        item['apply_end_date'] = None
        item['advt_no'] = None
        item['status'] = 'published'
        item['exam_cities'] = ["Nagpur"]
        item['application_links'] = {
            "official_website": "https://www.neeri.res.in",
            "apply_online": detail_link,
        }

        item['description'] = f"Permanent Staff Recruitment | Document: {clean_title}"

        year = datetime.utcnow().year
        item['seo_metadata'] = {
            "meta_title": f"{clean_title} | CSIR-NEERI Nagpur Recruitment {year}",
            "meta_description": f"{clean_title} at CSIR-NEERI, Nagpur. Check eligibility and apply.",
        }

        return item

    def _scrape_pdf_links(self, response):
        """Fallback: find all recruitment-related PDF links on the page."""
        seen = set()
        for link in response.css("a"):
            href = link.attrib.get("href", "")
            text = link.css("::text").get("").strip()

            if not href.lower().endswith(".pdf"):
                continue

            pdf_url = response.urljoin(href) if not href.startswith("http") else href
            if pdf_url in seen:
                continue
            seen.add(pdf_url)

            import hashlib
            dedup_hash = hashlib.sha256(f"NEERI_PDF_{pdf_url}".encode()).hexdigest()
            if self.track_duplicate(dedup_hash, label=text or pdf_url, urls=[pdf_url]):
                continue

            clean_title = self._clean_title(text) if text else pdf_url.split("/")[-1].replace(".pdf", "")

            item = ExamNotificationItem()
            item['title'] = clean_title
            item['org_name'] = "CSIR-National Environmental Engineering Research Institute"
            item['org_acronym'] = "CSIR-NEERI"
            item['source_url'] = pdf_url
            item['notification_pdf'] = pdf_url
            item['apply_start_date'] = None
            item['apply_end_date'] = None
            item['advt_no'] = None
            item['status'] = 'published'
            item['exam_cities'] = ["Nagpur"]
            item['application_links'] = {
                "official_website": "https://www.neeri.res.in",
            }
            item['description'] = f"PDF: {pdf_url.split('/')[-1]}"

            year = datetime.utcnow().year
            item['seo_metadata'] = {
                "meta_title": f"{clean_title} | CSIR-NEERI Recruitment {year}",
                "meta_description": f"{clean_title} at CSIR-NEERI, Nagpur.",
            }

            yield item

    # ================================================================
    # HELPERS
    # ================================================================

    def _find_table_rows(self, response, min_cols=3):
        for selector in self.TABLE_SELECTORS:
            table = response.css(selector)
            if table:
                rows = table.css("tbody tr, tr")
                data_rows = [r for r in rows if len(r.css("td")) >= min_cols]
                if data_rows:
                    return data_rows
        return []

    def _parse_date(self, text):
        text = (text or "").strip()
        if not text or text.lower() in ("not available", "na", "n/a", "-", "tba", "none", ""):
            return None
        try:
            # DD-MM-YYYY (NEERI format)
            if re.match(r'^\d{2}-\d{2}-\d{4}$', text):
                date = datetime.strptime(text, "%d-%m-%Y")
                return date.strftime("%Y-%m-%d")
            # DD/MM/YYYY
            if re.match(r'^\d{2}/\d{2}/\d{4}$', text):
                date = datetime.strptime(text, "%d/%m/%Y")
                return date.strftime("%Y-%m-%d")
            date = date_parser.parse(text, dayfirst=True)
            return date.strftime("%Y-%m-%d")
        except (ValueError, OverflowError):
            return None

    def _build_neeri_title(self, project_title, positions):
        """Build a clean title from long project description + position."""
        # Extract CNP/TSP number if present
        cnp_match = re.search(r'\((CNP-\d+|TSP-\d+)\)', project_title)
        cnp_no = cnp_match.group(1) if cnp_match else ""

        # Shorten project title
        short_title = project_title[:80].strip()
        if len(project_title) > 80:
            short_title += "..."

        if positions:
            title = f"{positions} — {short_title}"
        else:
            title = short_title

        if cnp_no:
            title = f"{title} ({cnp_no})"

        return title[:500]

    def _extract_location(self, advt_no, title):
        """Extract city from advertisement number or title."""
        text = f"{advt_no or ''} {title or ''}".lower()

        city_map = {
            "nagpur": "Nagpur",
            "hyderabad": "Hyderabad",
            "delhi": "Delhi",
            "new delhi": "New Delhi",
            "mumbai": "Mumbai",
            "pune": "Pune",
            "chennai": "Chennai",
            "kolkata": "Kolkata",
            "bangalore": "Bangalore",
            "bengaluru": "Bangalore",
        }

        for key, city in city_map.items():
            if key in text:
                return city

        return "Nagpur"  # Default: NEERI HQ

    def _determine_status(self, date_str):
        if not date_str:
            return 'published'
        try:
            d = datetime.strptime(str(date_str), "%Y-%m-%d")
            return 'closed' if d < datetime.utcnow() else 'published'
        except ValueError:
            return 'published'

    def _clean_title(self, text):
        cleaned = re.sub(r'\s+', ' ', text).strip()
        return cleaned[:500]