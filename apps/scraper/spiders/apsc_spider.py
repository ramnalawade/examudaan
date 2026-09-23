# ============================================================
# spiders/apsc_spider.py — Assam Public Service Commission
# ExamUdaan | https://apsc.nic.in
# Run: scrapy crawl apsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class ASamPSCSpider(StatePSCSpider):
    """
    Scrapes APSC (Assam PSC) recruitment & exam notifications.
    APSC publishes via NIC-hosted subdomain (apsc.nic.in).
    The site uses a standard HTML listing of PDF links.
    """
    name            = "apsc"
    org_name        = "Assam Public Service Commission"
    org_acronym     = "APSC"
    state_name      = "Assam"
    allowed_domains = ["apsc.nic.in"]
    start_urls      = [
        "https://apsc.nic.in/AdvertisementNotification",
        "https://apsc.nic.in/",
    ]
    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "state_slug": "assam",
        "ROBOTSTXT_OBEY": True,
    }
