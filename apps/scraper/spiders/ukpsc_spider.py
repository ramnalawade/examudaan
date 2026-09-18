# ============================================================
# spiders/ukpsc_spider.py — Uttarakhand Public Service Commission
# ExamUdaan | https://psc.uk.gov.in
# Run: scrapy crawl ukpsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class UKPSCSpider(StatePSCSpider):
    name            = "ukpsc"
    org_name        = "Uttarakhand Public Service Commission"
    org_acronym     = "UKPSC"
    state_name      = "Uttarakhand"
    allowed_domains = ["psc.uk.gov.in"]
    start_urls      = ["https://psc.uk.gov.in/pages/display/55-latest-notification"]
    custom_settings = {"state_slug": "uttarakhand"}
