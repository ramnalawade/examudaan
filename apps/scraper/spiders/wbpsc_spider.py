# ============================================================
# spiders/wbpsc_spider.py — West Bengal Public Service Commission
# ExamUdaan | https://wbpsc.gov.in
# Run: scrapy crawl wbpsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class WBPSCSpider(StatePSCSpider):
    name            = "wbpsc"
    org_name        = "West Bengal Public Service Commission"
    org_acronym     = "WBPSC"
    state_name      = "West Bengal"
    allowed_domains = ["wbpsc.gov.in"]
    start_urls      = ["https://wbpsc.gov.in/Notification", "https://wbpsc.gov.in/"]
    custom_settings = {"state_slug": "west-bengal"}
