# ============================================================
# spiders/jpsc_spider.py — Jharkhand Public Service Commission
# ExamUdaan | https://jpsc.gov.in
# Run: scrapy crawl jpsc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class JPSCSpider(StatePSCSpider):
    name            = "jpsc"
    org_name        = "Jharkhand Public Service Commission"
    org_acronym     = "JPSC"
    state_name      = "Jharkhand"
    allowed_domains = ["jpsc.gov.in"]
    start_urls      = ["https://jpsc.gov.in/", "https://jpsc.gov.in/notice_board.html"]
    custom_settings = {"state_slug": "jharkhand"}
