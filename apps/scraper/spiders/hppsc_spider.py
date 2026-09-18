# ============================================================
# spiders/hppsc_spider.py — Himachal Pradesh PSC
# ExamUdaan | https://hppsc.hp.gov.in
# Run: scrapy crawl hppsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class HPPSCSpider(StatePSCSpider):
    name            = "hppsc"
    org_name        = "Himachal Pradesh Public Service Commission"
    org_acronym     = "HPPSC"
    state_name      = "Himachal Pradesh"
    allowed_domains = ["hppsc.hp.gov.in"]
    start_urls      = ["https://hppsc.hp.gov.in/hppsc/recruitment"]
    custom_settings = {"state_slug": "himachal-pradesh"}
