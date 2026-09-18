# ============================================================
# spiders/lic_spider.py — Life Insurance Corporation of India
# ExamUdaan | https://licindia.in/bottom-links/recruitment
# Run: scrapy crawl lic
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class LICSpider(StatePSCSpider):
    name            = "lic"
    org_name        = "Life Insurance Corporation of India"
    org_acronym     = "LIC"
    state_name      = "All India"
    allowed_domains = ["licindia.in"]
    start_urls      = ["https://licindia.in/bottom-links/recruitment"]
