# ============================================================
# spiders/keralapsc_spider.py — Kerala Public Service Commission
# ExamUdaan | https://www.keralapsc.gov.in/
# Run: scrapy crawl keralapsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class KeraalaPSCSpider(StatePSCSpider):
    name            = "keralapsc"
    org_name        = "Kerala Public Service Commission"
    org_acronym     = "KPSCKer"
    state_name      = "Kerala"
    allowed_domains = ["keralapsc.gov.in"]
    start_urls      = ["https://www.keralapsc.gov.in/"]
