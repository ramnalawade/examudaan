# ============================================================
# spiders/opsc_spider.py — Odisha Public Service Commission
# ExamUdaan | https://opsc.gov.in/
# Run: scrapy crawl opsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class OPSCSpider(StatePSCSpider):
    name            = "opsc"
    org_name        = "Odisha Public Service Commission"
    org_acronym     = "OPSC"
    state_name      = "Odisha"
    allowed_domains = ["opsc.gov.in"]
    start_urls      = ["https://opsc.gov.in/notification.aspx", "https://opsc.gov.in/"]
    custom_settings = {"state_slug": "odisha"}
