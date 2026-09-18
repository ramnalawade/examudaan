# ============================================================
# spiders/cgpsc_spider.py — Chhattisgarh Public Service Commission
# ExamUdaan | https://psc.cg.gov.in/
# Run: scrapy crawl cgpsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class CGPSCSpider(StatePSCSpider):
    name            = "cgpsc"
    org_name        = "Chhattisgarh Public Service Commission"
    org_acronym     = "CGPSC"
    state_name      = "Chhattisgarh"
    allowed_domains = ["psc.cg.gov.in"]
    start_urls      = ["https://psc.cg.gov.in/recruitment.html", "https://psc.cg.gov.in/"]
    custom_settings = {"state_slug": "chhattisgarh"}
