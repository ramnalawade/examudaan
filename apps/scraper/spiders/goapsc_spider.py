# ============================================================
# spiders/goapsc_spider.py — Goa Public Service Commission
# ExamUdaan | https://gpsc.goa.gov.in
# Run: scrapy crawl goapsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class GOAPSCSpider(StatePSCSpider):
    name            = "goapsc"
    org_name        = "Goa Public Service Commission"
    org_acronym     = "GPSC"
    state_name      = "Goa"
    allowed_domains = ["gpsc.goa.gov.in"]
    start_urls      = ["https://gpsc.goa.gov.in/", "https://gpsc.goa.gov.in/notifications/"]
    custom_settings = {"state_slug": "goa"}
