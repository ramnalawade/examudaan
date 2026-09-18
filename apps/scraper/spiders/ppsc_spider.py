# ============================================================
# spiders/ppsc_spider.py — Punjab Public Service Commission
# ExamUdaan | https://ppsc.gov.in
# Run: scrapy crawl ppsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class PPSCSpider(StatePSCSpider):
    name            = "ppsc"
    org_name        = "Punjab Public Service Commission"
    org_acronym     = "PPSC"
    state_name      = "Punjab"
    allowed_domains = ["ppsc.gov.in"]
    start_urls      = ["https://ppsc.gov.in/Advertisements", "https://ppsc.gov.in/"]
    custom_settings = {"state_slug": "punjab"}
