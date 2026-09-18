# ============================================================
# spiders/jkssb_spider.py — J&K Services Selection Board
# ExamUdaan | https://jkssb.nic.in
# Run: scrapy crawl jkssb
#
# Note: Very active — hires frequently for Class I, Junior
# Assistant, Constable posts. Simple structure.
# ============================================================
from spiders.state_psc_base import StatePSCSpider


class JKSSBSpider(StatePSCSpider):
    name            = "jkssb"
    org_name        = "Jammu & Kashmir Services Selection Board"
    org_acronym     = "JKSSB"
    state_name      = "Jammu & Kashmir"
    allowed_domains = ["jkssb.nic.in"]
    start_urls      = [
        "https://jkssb.nic.in/notifications",
        "https://jkssb.nic.in/",
    ]
    custom_settings = {"state_slug": "jammu-kashmir"}
