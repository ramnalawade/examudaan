# ============================================================
# spiders/rss_spider.py — Generic Government RSS/Atom Feed Spider
# ExamUdaan | Polls all known official govt RSS feeds in one run
#
# Why RSS first?
#   - Instant data — feeds update when the source does
#   - Zero parse cost — structured XML, no HTML scraping
#   - Single spider covers 15+ orgs
#
# Run: scrapy crawl rss
# Add new feeds: just append to RSS_SOURCES below — no code change
# ============================================================

import re
import hashlib
from datetime import datetime, timezone

import scrapy
import feedparser          # pip install feedparser (already in requirements.txt)

from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin


# ============================================================
# Feed registry — add new govt RSS URLs here
# Format: (board_slug, org_name, org_acronym, rss_url)
# ============================================================
RSS_SOURCES = [
    # ---- Central Recruitment Bodies ----
    ("upsc",            "Union Public Service Commission",           "UPSC",    "https://upsc.gov.in/rss/notification.rss"),
    ("upsc",            "Union Public Service Commission",           "UPSC",    "https://upsc.gov.in/rss/examcalendar.rss"),
    ("ssc",             "Staff Selection Commission",                "SSC",     "https://ssc.gov.in/rss/notifications"),
    ("nta",             "National Testing Agency",                   "NTA",     "https://nta.ac.in/rss"),

    # ---- Banking / Finance ----
    ("ibps",            "Institute of Banking Personnel Selection",  "IBPS",    "https://www.ibps.in/feed/"),
    ("rbi",             "Reserve Bank of India",                     "RBI",     "https://www.rbi.org.in/rss/PressReleases.xml"),
    ("sbi",             "State Bank of India",                       "SBI",     "https://bank.sbi/web/guest/careers/-/blogs/rss"),
    ("nabard",          "National Bank for Agriculture & Rural Dev", "NABARD",  "https://www.nabard.org/rss.xml"),

    # ---- Insurance PSU ----
    ("uiic",            "United India Insurance Company",            "UIIC",    "https://www.uiic.co.in/rss"),
    ("niacl",           "New India Assurance Company",               "NIACL",   "https://newindia.co.in/rss"),
    ("lic",             "Life Insurance Corporation of India",       "LIC",     "https://licindia.in/Home/rss"),

    # ---- Defence / Research ----
    ("drdo",            "Defence Research and Development Org",      "DRDO",    "https://www.drdo.gov.in/rss.xml"),
    ("isro",            "Indian Space Research Organisation",        "ISRO",    "https://www.isro.gov.in/rss.xml"),
    ("barc",            "Bhabha Atomic Research Centre",             "BARC",    "https://www.barc.gov.in/rss.xml"),

    # ---- Railways ----
    ("rrb",             "Railway Recruitment Boards",                "RRB",     "https://indianrailways.gov.in/railwayboard/rss/announcements.xml"),
    ("dfccil",          "Dedicated Freight Corridor Corp India",     "DFCCIL",  "https://dfccil.com/rss"),
    ("konkan-railway",  "Konkan Railway Corporation",                "KRCL",    "https://www.konkanrailway.com/rss"),

    # ---- Energy PSU ----
    ("ongc",            "Oil and Natural Gas Corporation",           "ONGC",    "https://www.ongcindia.com/wps/wcm/connect/ongcindia/Home/RSS/Recruitment"),
    ("ntpc",            "NTPC Limited",                              "NTPC",    "https://careers.ntpc.co.in/rss"),
    ("pgcil",           "Power Grid Corporation of India",           "PGCIL",   "https://www.powergrid.in/rss"),
    ("iocl",            "Indian Oil Corporation Limited",            "IOCL",    "https://iocl.com/rss"),

    # ---- Infrastructure ----
    ("aai",             "Airports Authority of India",               "AAI",     "https://www.aai.aero/en/news/rss"),
    ("rites",           "RITES Limited",                             "RITES",   "https://rites.com/web/index.php/news-rss"),

    # ---- Autonomous / Welfare Bodies ----
    ("fci",             "Food Corporation of India",                 "FCI",     "https://fci.gov.in/rss"),
    ("esic",            "Employees State Insurance Corporation",     "ESIC",    "https://www.esic.nic.in/rss"),
    ("epfo",            "Employees Provident Fund Organisation",     "EPFO",    "https://www.epfindia.gov.in/site_en/rss.php"),

    # ---- Public Services ----
    ("india-post",      "India Post",                                "INDPOST", "https://www.indiapost.gov.in/rss/rss.xml"),
    ("employment-news", "Employment News",                           "EN",      "https://www.employmentnews.gov.in/RSS/ENRSSFeed.aspx"),

    # ---- Medical / Health ----
    ("aiims-delhi",     "AIIMS New Delhi",                           "AIIMS",   "https://www.aiims.edu/en/miscellaneous/rss.html"),
    ("pgimer",          "PGIMER Chandigarh",                         "PGIMER",  "https://pgimer.edu.in/rss"),

    # ---- Metals / Manufacturing ----
    ("nalco",           "National Aluminium Company",                "NALCO",   "https://nalcoindia.com/rss"),
    ("sail",            "Steel Authority of India Limited",          "SAIL",    "https://www.sail.co.in/rss"),
    ("gail",            "Gas Authority of India",                    "GAIL",    "https://www.gailonline.com/rss.xml"),
]

# Notification type inference from title keywords
_TYPE_MAP = [
    (["result", "final result", "merit list", "selected"],             "result"),
    (["admit card", "call letter", "hall ticket", "e-admit"],          "admit_card"),
    (["answer key", "answer-key", "provisional key"],                  "answer_key"),
    (["syllabus", "exam pattern", "scheme of exam"],                   "syllabus"),
    (["recruitment", "vacancy", "job", "post", "notification", "advt",
      "advertisement", "apply", "application"],                         "recruitment"),
]


def infer_type(title):
    """Return DB notification_type from title keywords."""
    t = title.lower()
    for keywords, ntype in _TYPE_MAP:
        if any(kw in t for kw in keywords):
            return ntype
    return "recruitment"


class RSSSpider(DuplicateStopMixin, scrapy.Spider):
    """
    Single spider that polls all government RSS/Atom feeds.

    Flow:
      1. start_requests() yields one Request per RSS URL
      2. parse_feed()     feedparser parses the XML
      3. For each item:   map to ExamPost, dedup, yield
    """

    name = "rss"
    MAX_ITEM_AGE_DAYS = 30   # RSS items can be slightly older than HTML scrapes

    async def start(self):
        """Scrapy 2.17+ entry point: yield initial requests."""
        for req in self.start_requests():
            yield req

    def start_requests(self):
        """Generate one request per RSS feed URL."""
        for board_slug, org_name, org_acronym, feed_url in RSS_SOURCES:
            self.logger.info(f"[rss] Fetching feed: {feed_url}")
            yield scrapy.Request(
                url=feed_url,
                callback=self.parse_feed,
                meta={
                    "board_slug":  board_slug,
                    "org_name":    org_name,
                    "org_acronym": org_acronym,
                    "feed_url":    feed_url,
                },
                errback=self.on_feed_error,  # log errors, do not crash
                dont_filter=True,
            )

    def on_feed_error(self, failure):
        """Log failed feeds gracefully — do not stop the whole spider."""
        url = failure.request.url
        self.logger.warning(f"[rss] Feed error ({url}): {failure.getErrorMessage()}")

    def parse_feed(self, response):
        """
        Parse one RSS/Atom feed response using feedparser.
        Handles both RSS 2.0 and Atom 1.0 formats automatically.
        """
        meta         = response.meta
        board_slug   = meta["board_slug"]
        org_name     = meta["org_name"]
        org_acronym  = meta["org_acronym"]
        feed_url     = meta["feed_url"]

        parsed = feedparser.parse(response.text)

        if not parsed.entries:
            self.logger.warning(f"[rss] No entries in feed: {feed_url}")
            return

        self.logger.info(f"[rss] {org_acronym}: {len(parsed.entries)} entries found")

        for entry in parsed.entries:
            title   = (entry.get("title")   or "").strip()
            link    = (entry.get("link")    or "").strip()
            summary = (entry.get("summary") or entry.get("description") or "").strip()

            # Parse published date from feedparser tuple
            pub_date = None
            if entry.get("published_parsed"):
                try:
                    pub_date = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
                    pub_date = pub_date.strftime("%Y-%m-%d")
                except Exception:
                    pass

            # Skip if title too short or irrelevant
            if not title or len(title) < 5:
                continue
            if self.is_irrelevant_link(title, link):
                continue

            # Skip old items
            if pub_date and self.is_stale_date(pub_date):
                self.logger.debug(f"[rss] Stale ({pub_date}): {title[:60]}")
                continue

            # Dedup check using URL hash
            dedup_hash = hashlib.sha256(f"{org_acronym}_{link}".encode()).hexdigest()
            if self.track_duplicate(dedup_hash, label=title, urls=[link]):
                continue

            # Extract PDF link from summary HTML if present
            pdf_url = None
            if summary:
                pdf_match = re.search(r'href=["\']([^"\']+\.pdf)["\']', summary, re.IGNORECASE)
                if pdf_match:
                    pdf_url = pdf_match.group(1)

            # Build ExamPost item
            item = ExamPost()
            item["title"]               = title
            item["board_slug"]          = board_slug
            item["org_name"]            = org_name
            item["org_acronym"]         = org_acronym
            item["source_url"]          = link
            item["official_website"]    = self._org_website(board_slug)
            item["notification_type"]   = infer_type(title)
            item["state"]               = ["All India"]
            item["short_description"]   = self._clean_html(summary)[:500] if summary else None
            item["notification_date"]   = pub_date
            item["scraped_at"]          = datetime.now(timezone.utc).isoformat()
            item["dedup_hash"]          = dedup_hash

            if pdf_url:
                item["notification_pdf_url"] = pdf_url

            yield item

    def _org_website(self, board_slug):
        """Map board_slug to canonical website URL."""
        _map = {
            "upsc":            "https://upsc.gov.in",
            "ssc":             "https://ssc.gov.in",
            "nta":             "https://nta.ac.in",
            "ibps":            "https://www.ibps.in",
            "rbi":             "https://www.rbi.org.in",
            "sbi":             "https://sbi.co.in",
            "drdo":            "https://www.drdo.gov.in",
            "india-post":      "https://www.indiapost.gov.in",
            "employment-news": "https://www.employmentnews.gov.in",
            "rrb":             "https://indianrailways.gov.in",
            "konkan-railway":  "https://www.konkanrailway.com",
            "ongc":            "https://www.ongcindia.com",
            "ntpc":            "https://www.ntpc.co.in",
            "aiims-delhi":     "https://www.aiims.edu",
        }
        return _map.get(board_slug, "")

    def _clean_html(self, text):
        """Strip HTML tags from summary text."""
        return re.sub(r"<[^>]+>", " ", text).strip()
