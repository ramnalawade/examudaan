# ============================================================
# spiders/hpsc_spider.py — Haryana Public Service Commission
# ExamUdaan | https://hpsc.gov.in/
# Run: scrapy crawl hpsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class HPSCSpider(StatePSCSpider):
    name            = "hpsc"
    org_name        = "Haryana Public Service Commission"
    org_acronym     = "HPSC"
    state_name      = "Haryana"
    allowed_domains = ["hpsc.gov.in"]
    start_urls      = ["https://hpsc.gov.in/"]
