# ============================================================
# spiders/keralapsc_spider.py — Kerala Public Service Commission
# ExamUdaan | https://keralapsc.gov.in
# Run: scrapy crawl keralapsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class KeralaPSCSpider(StatePSCSpider):
    """
    Scrapes Kerala PSC notification listings.
    Kerala PSC's 'What's New' and 'Notifications' sections use
    standard anchor links that the base class parses correctly.
    """
    name            = "keralapsc"
    org_name        = "Kerala Public Service Commission"
    org_acronym     = "KeraPSC"
    state_name      = "Kerala"
    allowed_domains = ["keralapsc.gov.in"]
    start_urls      = [
        "https://www.keralapsc.gov.in/notifications",
        "https://www.keralapsc.gov.in/",
    ]
    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "state_slug": "kerala",
    }
