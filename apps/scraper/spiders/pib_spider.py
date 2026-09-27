# ============================================================
# spiders/pib_spider.py — PIB (Press Information Bureau) RSS Spider
# ExamUdaan.in | Automated Current Affairs & GS News Ingestion
#
# Extracts official press releases from PIB India (English & Marathi)
# Categorizes them into exam topics (Economy, Defence, Science, Governance)
# and generates exam-specific "Why It Matters" context.
#
# Run: scrapy crawl pib
# ============================================================

import re
import json
import hashlib
from datetime import datetime, timezone
import scrapy
import feedparser

PIB_FEEDS = [
    {
        "name": "PIB National (English)",
        "lang": "en",
        "url": "https://pib.gov.in/Rss/Rss.aspx",
    },
    {
        "name": "PIB All Ministries",
        "lang": "en",
        "url": "https://pib.gov.in/rss/RssEnglish.aspx",
    },
    {
        "name": "PIB Mumbai / Maharashtra (Marathi)",
        "lang": "mr",
        "url": "https://pib.gov.in/Rss/RssMarathi.aspx",
    },
]

# Keyword-to-Category classifier
CATEGORY_RULES = [
    ("Economy", [
        "gdp", "inflation", "rbi", "repo rate", "budget", "tax", "gst", "forex", 
        "export", "import", "trade", "banking", "finance ministry", "msme", 
        "niti aayog", "investment", "fdi", "rupee", "disinvestment", "अर्थव्यवस्था"
    ]),
    ("Science & Tech", [
        "isro", "drdo", "satellite", "space", "moon", "chandrayaan", "gaganyaan", 
        "ai", "supercomputer", "semiconductor", "quantum", "csir", "biotechnology", 
        "missile", "nuclear", "आयटी", "विज्ञान", "उपग्रह"
    ]),
    ("Defence & Security", [
        "army", "navy", "air force", "defence", "exercise", "ins ", "iaf", 
        "border", "coast guard", "weapon", "warfare", "suraksha", "संरक्षण", "लष्कर"
    ]),
    ("Environment & Ecology", [
        "wildlife", "forest", "tiger", "ramsar", "climate change", "cop2", 
        "renewable", "solar", "pollution", "biodiversity", "western ghats", 
        "national park", "sanctuary", "पर्यावरण", "हवामान"
    ]),
    ("Cabinet & Governance", [
        "cabinet", "approves", "bill", "ordinance", "amendment", "committee", 
        "scheme", "yojana", "portal", "mission", "panchayat", "governance", 
        "कायदा", "योजना", "मंत्रिमंडळ"
    ]),
    ("Maharashtra", [
        "maharashtra", "mumbai", "pune", "nagpur", "chhatrapati sambhajinagar", 
        "western ghats", "godavari", "sahayadri", "nashik", "thane", "महाराष्ट्र"
    ]),
]

def clean_html(raw_html):
    """Strip HTML tags and extra whitespaces."""
    if not raw_html:
        return ""
    clean = re.sub(r'<.*?>', '', raw_html)
    clean = re.sub(r'\s+', ' ', clean)
    return clean.strip()

def classify_category(title, summary):
    """Return matching exam category."""
    text = f"{title} {summary}".lower()
    for category, keywords in CATEGORY_RULES:
        if any(kw in text for kw in keywords):
            return category
    return "National Affairs"

def generate_why_it_matters(category, title):
    """Generate exam-specific preparation context."""
    if category == "Economy":
        return "UPSC/MPSC GS Paper III & Banking: Crucial for monetary policy, macro indicators, and fiscal reforms. Frequently asked in Prelims and Mains analysis."
    elif category == "Science & Tech":
        return "UPSC GS-III & State Services: Space science, indigenous technology milestones, and defense R&D are core recurring question areas."
    elif category == "Defence & Security":
        return "CDS, NDA, AFCAT & MPSC GS-III: Joint bilateral exercises, naval commissioning, and internal security frameworks."
    elif category == "Environment & Ecology":
        return "UPSC Prelims & Forest Services: Protected areas, conservation initiatives, and international environmental conventions."
    elif category == "Cabinet & Governance":
        return "Polity & Governance (GS-II): Cabinet decisions, welfare schemes, and policy directives are directly tested in analytical and MCQ questions."
    elif category == "Maharashtra":
        return "MPSC State Services, Combined & Police Bharti: State infrastructure, government schemes, and regional milestones."
    return "General Studies & Current Affairs: Important development for Prelims MCQs and general awareness sections."


class PIBSpider(scrapy.Spider):
    """
    Spider that ingests daily Press Information Bureau (PIB) RSS releases.
    Outputs structured current affairs items for ExamUdaan's study portal.
    """
    name = "pib"
    allowed_domains = ["pib.gov.in"]

    custom_settings = {
        "DOWNLOAD_DELAY": 3.0,
        "USER_AGENT": "ExamUdaan-Bot/1.0 (+https://examudaan.in/bot-info; student-prep-aggregator)",
        "ROBOTSTXT_OBEY": True,
        "AUTOTHROTTLE_ENABLED": True,
        "AUTOTHROTTLE_START_DELAY": 2.0,
        "AUTOTHROTTLE_MAX_DELAY": 10.0,
    }

    def start_requests(self):
        for feed in PIB_FEEDS:
            self.logger.info(f"[pib] Requesting feed: {feed['name']} ({feed['url']})")
            yield scrapy.Request(
                url=feed["url"],
                callback=self.parse_feed,
                meta={"feed_info": feed},
                errback=self.on_error,
                dont_filter=True,
            )

    def on_error(self, failure):
        self.logger.warning(f"[pib] Failed to fetch feed: {failure.request.url} - {failure.getErrorMessage()}")

    def parse_feed(self, response):
        feed_info = response.meta["feed_info"]
        parsed = feedparser.parse(response.text)

        if not parsed.entries:
            self.logger.warning(f"[pib] No entries found for: {feed_info['name']}")
            return

        self.logger.info(f"[pib] Found {len(parsed.entries)} releases in {feed_info['name']}")

        results = []
        for entry in parsed.entries[:25]:  # Process top 25 fresh items
            title = clean_html(entry.get("title", ""))
            summary = clean_html(entry.get("summary", "") or entry.get("description", ""))
            link = entry.get("link", "").strip()

            if not title or len(title) < 10:
                continue

            # Parse date
            pub_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            if entry.get("published_parsed"):
                try:
                    dt = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
                    pub_date = dt.strftime("%Y-%m-%d")
                except Exception:
                    pass

            category = classify_category(title, summary)
            why_it_matters = generate_why_it_matters(category, title)
            slug = re.sub(r'[^a-z0-9]+', '-', title.lower())[:80].strip('-')

            item = {
                "source": "PIB",
                "source_name": feed_info["name"],
                "lang": feed_info["lang"],
                "title": title,
                "summary": summary[:400] + ("..." if len(summary) > 400 else ""),
                "url": link,
                "date": pub_date,
                "category": category,
                "examTags": ["UPSC", "MPSC", "SSC", "Banking"],
                "whyItMatters": why_it_matters,
                "slug": slug,
            }
            results.append(item)
            yield item

        # Also write latest batch to scratch/pib_latest.json for inspection/frontend sync
        try:
            with open("pib_latest.json", "w", encoding="utf-8") as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            self.logger.info(f"[pib] Saved {len(results)} items to pib_latest.json")
        except Exception as e:
            self.logger.warning(f"[pib] Could not save local json: {e}")
