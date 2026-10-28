# ============================================================
# spiders/mahatet_spider.py — Maharashtra Teacher Eligibility Test (MAHA TET)
# ExamUdaan | Official Question Papers & Answer Keys Scraper
# Source: https://www.mahatet.in/Notices/QuestionPaper/ShowPreviousQuestionPapers
# Run: scrapy crawl mahatet
# ============================================================

import scrapy
import re
from urllib.parse import urlparse, parse_qs
from items import ExamNotificationItem


class MahaTetSpider(scrapy.Spider):
    """
    Scrapes official Maharashtra State Council of Examination (MSCE Pune)
    MAHA TET previous year question papers and official final answer keys
    across Marathi, English, Hindi, Urdu and other official mediums.
    """

    name = "mahatet"
    allowed_domains = ["mahatet.in", "www.mahatet.in"]
    start_urls = [
        "https://www.mahatet.in/Notices/QuestionPaper/ShowPreviousQuestionPapers"
    ]

    custom_settings = {
        "ROBOTSTXT_OBEY": False,
        "DOWNLOAD_TIMEOUT": 30,
        "USER_AGENT": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
    }

    def parse(self, response):
        """Parse all previous question papers and answer key download links."""
        links = response.css('a[href*="DownloadMedia"]')
        self.logger.info(f"Found {len(links)} DownloadMedia links on {response.url}")

        for link in links:
            href = link.attrib.get('href', '').strip()
            raw_text = link.xpath('string(.)').get('').strip()

            if not href or 'DownloadMedia' not in href:
                continue

            full_url = response.urljoin(href)
            parsed = urlparse(href)
            params = parse_qs(parsed.query)
            folder_name = params.get('folderName', [''])[0]
            file_name = params.get('fileName', [''])[0]

            is_key = (
                'ANSWER_KEY' in folder_name.upper()
                or 'उत्तरसूची' in raw_text
                or 'उत्तरतालिका' in raw_text
                or 'key' in file_name.lower()
            )

            # Extract examination year
            year = None
            ym = re.search(r'20\d\d', file_name)
            if ym:
                year = int(ym.group(0))
            elif '2024' in folder_name:
                year = 2024
            elif '2025' in folder_name:
                year = 2025
            else:
                tm = re.search(r'20\d\d', raw_text)
                if tm:
                    year = int(tm.group(0))

            # Paper classification (Paper 1 vs Paper 2)
            if re.search(r'P2_Math|_Math', file_name, re.I):
                paper_name = "Paper II (Mathematics & Science)"
                paper_name_mr = "पेपर २ (गणित व विज्ञान - इयत्ता ६ वी ते ८ वी)"
                stage = "paper-2-math-sci"
            elif re.search(r'P2_Soc|_Soc', file_name, re.I):
                paper_name = "Paper II (Social Science)"
                paper_name_mr = "पेपर २ (सामाजिक शास्त्रे - इयत्ता ६ वी ते ८ वी)"
                stage = "paper-2-social"
            elif re.search(r'P2|Paper2', file_name, re.I):
                paper_name = "Paper II (Upper Primary)"
                paper_name_mr = "पेपर २ (इयत्ता ६ वी ते ८ वी)"
                stage = "paper-2"
            else:
                paper_name = "Paper I (Primary)"
                paper_name_mr = "पेपर १ (प्राथमिक - इयत्ता १ ली ते ५ वी)"
                stage = "paper-1"

            # Medium classification
            medium = "Other"
            medium_mr = "इतर माध्यम"
            if re.search(r'Marathi|मराठी', file_name + raw_text, re.I):
                medium = "Marathi"
                medium_mr = "मराठी माध्यम"
            elif re.search(r'English|इंग्रजी', file_name + raw_text, re.I):
                medium = "English"
                medium_mr = "इंग्रजी माध्यम"
            elif re.search(r'Hindi|हिन्दी|हिंदी', file_name + raw_text, re.I):
                medium = "Hindi"
                medium_mr = "हिंदी माध्यम"
            elif re.search(r'Urdu|उर्दू', file_name + raw_text, re.I):
                medium = "Urdu"
                medium_mr = "उर्दू माध्यम"
            elif re.search(r'Bangali|Bengali|बंगाली', file_name + raw_text, re.I):
                medium = "Bengali"
                medium_mr = "बंगाली माध्यम"
            elif re.search(r'Kannada|कन्नड', file_name + raw_text, re.I):
                medium = "Kannada"
                medium_mr = "कन्नड माध्यम"
            elif re.search(r'Gujarati|गुजराती', file_name + raw_text, re.I):
                medium = "Gujarati"
                medium_mr = "गुजराती माध्यम"
            elif re.search(r'Telugu|तेलगू', file_name + raw_text, re.I):
                medium = "Telugu"
                medium_mr = "तेलगू माध्यम"
            elif re.search(r'Sindhi|सिंधी', file_name + raw_text, re.I):
                medium = "Sindhi"
                medium_mr = "सिंधी माध्यम"

            doc_type = "answer_key" if is_key else "syllabus"

            doc_title = (
                f"MAHA TET {year or ''} {paper_name} - {medium} Medium "
                f"{'Official Final Answer Key' if is_key else 'Question Paper'}"
            ).strip()

            doc_title_mr = (
                f"महाटेट {year or ''} {paper_name_mr} - {medium_mr} "
                f"{'अधिकृत अंतिम उत्तरतालिका' if is_key else 'अधिकृत प्रश्नपत्रिका'}"
            ).strip()

            item = ExamNotificationItem()
            item["title"] = doc_title
            item["source_url"] = full_url
            item["notification_pdf"] = full_url
            item["org_name"] = "Maharashtra State Council of Examination (MSCE Pune)"
            item["org_acronym"] = "MSCE"
            item["notification_type"] = doc_type
            item["description"] = (
                f"<p>{doc_title_mr}</p>"
                f"<p>Official {doc_title} released by MSCE Pune for Maharashtra Teacher Eligibility Test.</p>"
            )

            # Metadata enrichment
            item["ai_extracted_data"] = {
                "exam_name": "Maharashtra Teacher Eligibility Test (MAHA TET)",
                "exam_year": year,
                "stage": stage,
                "paper_name": paper_name,
                "paper_name_mr": paper_name_mr,
                "medium": medium,
                "medium_mr": medium_mr,
                "is_answer_key": is_key,
                "folder_name": folder_name,
                "file_name": file_name,
                "education_levels": ["Graduate", "D.El.Ed", "B.Ed", "D.Ed"],
                "job_categories": ["Teaching / Education", "Primary Teacher", "Secondary Teacher"],
                "government_level": "State",
                "state_normalized": "Maharashtra",
                "is_teaching": True,
                "is_govt": True,
                "is_state_govt": True
            }

            yield item
