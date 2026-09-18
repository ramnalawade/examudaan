# ============================================================
# spiders/ssc_spider.py — SSC.gov.in scraper
# Agent: Scraper Agent
# Scrapes: https://ssc.gov.in — latest notifications
# ============================================================

import scrapy
from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin
from pipelines import DeduplicationPipeline


class SSCSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Scrapes the SSC website for new exam notifications.
    SSC website has a "Latest" section on homepage with links to PDFs.
    We scrape the links, extract details from each page.
    """

    name = "ssc"                              # run with: scrapy crawl ssc
    default_notification_type = 'recruitment' # fallback for items with generic titles
    allowed_domains = ["ssc.gov.in"]
    start_urls = ["https://ssc.gov.in/"]      # start from homepage

    def parse(self, response):
        """
        Step 1: Parse the SSC homepage.
        Look for the 'Latest' or 'What's New' section links.
        """
        self.logger.info("Parsing SSC homepage...")

        # SSC homepage has a "Latest" section with exam links
        # We look for links in the notices/latest section
        for link in response.css("div.what-new a, ul.latest-links a"):
            url = response.urljoin(link.attrib.get("href", ""))
            title = link.css("::text").get("").strip()

            if not title or not url:
                continue

            # Only follow links that look like exam notifications
            if any(word in title.lower() for word in ["notification", "recruitment", "result", "admit", "answer"]):
                yield response.follow(
                    url,
                    callback=self.parse_notification,
                    meta={"title": title, "source_url": url}
                )

    def parse_notification(self, response):
        """
        Step 2: Parse an individual notification page.
        Extract all details and return an ExamPost item.
        """
        title = response.meta.get("title") or response.css("h1::text").get("").strip()
        source_url = response.meta.get("source_url", response.url)

        # Determine type from title
        post_type = self.get_type(title)

        # Create the item and fill it in
        item = ExamPost()
        item["title"]      = title
        item["type"]       = post_type
        item["board_slug"] = "ssc"
        item["source_url"] = source_url

        # Dedup check
        import hashlib
        _dedup_hash = hashlib.sha256(f"SSC_{source_url}".encode()).hexdigest()
        if self.track_duplicate(_dedup_hash, label=title, urls=[source_url]):
            return

        # Look for PDF links (most SSC notifications are PDFs)
        pdf_links = response.css("a[href$='.pdf']::attr(href)").getall()
        if pdf_links:
            item["notification_pdf_url"] = response.urljoin(pdf_links[0])

        # Try to extract vacancies from page text
        page_text = " ".join(response.css("*::text").getall())
        item["vacancies"] = self.extract_number(page_text, ["vacancies", "posts", "vacancy"])

        # Set apply URL if there's an online application link
        apply_link = response.css("a:contains('Apply'), a:contains('Online')::attr(href)").get()
        if apply_link:
            item["apply_url"] = response.urljoin(apply_link)

        item["official_website"] = "https://ssc.gov.in"

        yield item

    def get_type(self, title):
        """Determine if this is a job, result, admit card, or answer key"""
        title_lower = title.lower()
        if "result" in title_lower:
            return "result"
        elif "admit" in title_lower or "hall ticket" in title_lower:
            return "admit-card"
        elif "answer key" in title_lower or "answer-key" in title_lower:
            return "answer-key"
        else:
            return "job"

    def extract_number(self, text, keywords):
        """
        Try to find a number near a keyword in text.
        Example: "Total Vacancies: 17,727" → 17727
        """
        import re
        for keyword in keywords:
            # Look for number followed by or preceded by keyword
            pattern = rf'(\d[\d,]+)\s*{keyword}|{keyword}[:\s]+(\d[\d,]+)'
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                num_str = match.group(1) or match.group(2)
                return int(num_str.replace(",", ""))
        return None
