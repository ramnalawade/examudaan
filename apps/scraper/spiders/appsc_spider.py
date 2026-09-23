# ============================================================
# spiders/appsc_spider.py — Andhra Pradesh Public Service Commission
# ExamUdaan | https://psc.ap.gov.in/
# Run: scrapy crawl appsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class APPSCSpider(StatePSCSpider):
    """
    Scrapes APPSC (Andhra Pradesh PSC) notification listings.
    Targets the official 'Notifications' page directly.
    """
    name            = "appsc"
    org_name        = "Andhra Pradesh Public Service Commission"
    org_acronym     = "APPSC"
    state_name      = "Andhra Pradesh"
    allowed_domains = ["psc.ap.gov.in"]
    # Start directly from the notifications listing — avoids homepage JS
    start_urls      = [
        "https://psc.ap.gov.in/Default.aspx?id=notifications",
        "https://psc.ap.gov.in/",
    ]
    custom_settings = {
        "DOWNLOAD_DELAY": 2,         # polite — .gov.in servers
        "state_slug": "andhra-pradesh",
        "ROBOTSTXT_OBEY": False,     # AP PSC robots.txt sometimes blocks crawlers
    }
