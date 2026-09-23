# ============================================================
# spiders/wbpsc_spider.py — West Bengal Public Service Commission
# ExamUdaan | https://wbpsc.gov.in
# Run: scrapy crawl wbpsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class WBPSCSpider(StatePSCSpider):
    """
    Scrapes WBPSC notification listings from the official Notification page.
    West Bengal PSC uses a standard HTML table — the base class handles it.
    """
    name            = "wbpsc"
    org_name        = "West Bengal Public Service Commission"
    org_acronym     = "WBPSC"
    state_name      = "West Bengal"
    allowed_domains = ["wbpsc.gov.in"]
    start_urls      = [
        "https://wbpsc.gov.in/Notification",
        "https://wbpsc.gov.in/",
    ]
    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "state_slug": "west-bengal",
    }
