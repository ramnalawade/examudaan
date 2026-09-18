# ============================================================
# spiders/tspsc_spider.py — Telangana State Public Service Commission
# ExamUdaan | https://tspsc.gov.in
# Run: scrapy crawl tspsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class TSPSCSpider(StatePSCSpider):
    name            = "tspsc"
    org_name        = "Telangana State Public Service Commission"
    org_acronym     = "TSPSC"
    state_name      = "Telangana"
    allowed_domains = ["tspsc.gov.in"]
    start_urls      = ["https://tspsc.gov.in/", "https://tspsc.gov.in/notfns-0.html"]
    custom_settings = {"state_slug": "telangana"}
