# ============================================================
# spiders/tspsc_spider.py — Telangana State Public Service Commission
# ExamUdaan | https://tspsc.gov.in
# Run: scrapy crawl tspsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class TSPSCSpider(StatePSCSpider):
    """
    Scrapes TSPSC (Telangana PSC) notification listings.
    Targets the 'Notifications' tab which lists all current announcements.
    """
    name            = "tspsc"
    org_name        = "Telangana State Public Service Commission"
    org_acronym     = "TSPSC"
    state_name      = "Telangana"
    allowed_domains = ["tspsc.gov.in"]
    start_urls      = [
        "https://tspsc.gov.in/notfns-0.html",    # Notifications page
        "https://tspsc.gov.in/",
    ]
    custom_settings = {
        "DOWNLOAD_DELAY": 2,
        "state_slug": "telangana",
        "ROBOTSTXT_OBEY": False,  # TSPSC does not provide robots.txt
    }
