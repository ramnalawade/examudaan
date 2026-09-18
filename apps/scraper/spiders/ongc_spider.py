# ============================================================
# spiders/ongc_spider.py — Oil and Natural Gas Corporation
# ExamUdaan | https://www.ongcindia.com/wps/wcm/connect/ongcindia/Home/Career/
# Run: scrapy crawl ongc
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class ONGCSpider(StatePSCSpider):
    name            = "ongc"
    org_name        = "Oil and Natural Gas Corporation"
    org_acronym     = "ONGC"
    state_name      = "All India"
    allowed_domains = ["ongcindia.com"]
    start_urls      = ["https://www.ongcindia.com/wps/wcm/connect/ongcindia/Home/Career/"]
