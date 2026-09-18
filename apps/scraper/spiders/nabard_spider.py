# ============================================================
# spiders/nabard_spider.py — National Bank for Agriculture & Rural Development
# ExamUdaan | https://www.nabard.org/content.aspx?id=572&catid=8&mid=490
# Run: scrapy crawl nabard
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class NABARDSpider(StatePSCSpider):
    name            = "nabard"
    org_name        = "National Bank for Agriculture & Rural Development"
    org_acronym     = "NABARD"
    state_name      = "All India"
    allowed_domains = ["nabard.org"]
    start_urls      = ["https://www.nabard.org/content.aspx?id=572&catid=8&mid=490"]
