# ============================================================
# spiders/appsc_spider.py — Andhra Pradesh Public Service Commission
# ExamUdaan | https://psc.ap.gov.in/
# Run: scrapy crawl appsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class APPSCSpider(StatePSCSpider):
    name            = "appsc"
    org_name        = "Andhra Pradesh Public Service Commission"
    org_acronym     = "APPSC"
    state_name      = "Andhra Pradesh"
    allowed_domains = ["psc.ap.gov.in"]
    start_urls      = ["https://psc.ap.gov.in/"]
