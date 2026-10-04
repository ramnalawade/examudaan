#!/usr/bin/env python3
# ============================================================
# apps/scraper/daily_ca_fetcher.py — Automated Daily Current Affairs Pipeline
# ExamUdaan.in | Automatically ingests live govt & exam current affairs
# Sources:
#   1. PIB India (Press Information Bureau — official releases)
#   2. All India Radio News (AIR News)
#   3. Google News RSS (MPSC, Maharashtra Govt, National Schemes, RBI Economy, Police Bharti)
#
# Stores into PostgreSQL `daily_ca_summaries` table (upsert by summary_date).
# Zero manual work. Runs daily via cron_6h.sh.
# ============================================================

import os
import sys
import re
import json
import base64
import html
import logging
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, date
from dotenv import load_dotenv
import psycopg2
import psycopg2.extras

load_dotenv("apps/scraper/.env")
load_dotenv(".env")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("DailyCA")

# Comprehensive RSS feeds covering every ExamUdaan category & target exam
FEEDS = [
    {
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("site:pib.gov.in when:2d") + "&hl=en-IN&gl=IN&ceid=IN:en",
        "source": "PIB India (Govt Press Releases)",
        "priority_category": "National",
    },
    {
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("Maharashtra government OR Mantralaya OR MPSC when:3d") + "&hl=en-IN&gl=IN&ceid=IN:en",
        "source": "Maharashtra Governance Feed",
        "priority_category": "Maharashtra",
    },
    {
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("MPSC चालू घडामोडी OR महाराष्ट्र शासन when:3d") + "&hl=mr&gl=IN&ceid=IN:mr",
        "source": "MPSC Chalu Ghadamodi",
        "priority_category": "Maharashtra",
    },
    {
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("RBI OR repo rate OR inflation OR GDP India OR banking OR SEBI when:3d") + "&hl=en-IN&gl=IN&ceid=IN:en",
        "source": "Economy & Banking Feed",
        "priority_category": "Economy",
    },
    {
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("ISRO OR DRDO OR space mission OR satellite OR defence India when:3d") + "&hl=en-IN&gl=IN&ceid=IN:en",
        "source": "Science & Tech Feed",
        "priority_category": "Science & Tech",
    },
    {
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("wildlife sanctuary OR Ramsar OR climate change OR solar renewable India when:4d") + "&hl=en-IN&gl=IN&ceid=IN:en",
        "source": "Environment & Ecology Feed",
        "priority_category": "Environment",
    },
    {
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("India sports OR Olympics OR cricket championship OR medal winner when:3d") + "&hl=en-IN&gl=IN&ceid=IN:en",
        "source": "National Sports Feed",
        "priority_category": "Sports",
    },
    {
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("bilateral summit OR G20 OR BRICS OR United Nations India when:3d") + "&hl=en-IN&gl=IN&ceid=IN:en",
        "source": "International Relations Feed",
        "priority_category": "International",
    },
    {
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("Maharashtra police bharti OR police recruitment when:5d") + "&hl=en-IN&gl=IN&ceid=IN:en",
        "source": "Police Bharti News",
        "priority_category": "Maharashtra",
    },
]


def clean_text(text: str) -> str:
    """Decode all HTML entities first, then strip HTML tags and normalize whitespace."""
    if not text:
        return ""
    text = re.sub(r"<!\[CDATA\[(.*?)\]\]>", r"\1", text, flags=re.DOTALL)
    # Unescape HTML entities (&quot;, &lt;, &gt;, &#39;, &lsquo;, etc.)
    text = html.unescape(text)
    # Strip any residual HTML tags
    text = re.sub(r"<[^>]+>", "", text)
    # Remove any broken entities or hex characters
    text = re.sub(r"&[a-zA-Z0-9#]+;", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def strip_source_suffix(title: str) -> tuple[str, str]:
    """Strip trailing news source (e.g. ' - PIB', ' - The Hindu') and return clean title and source."""
    match = re.search(r"\s*[-–—|]\s*([^–—|-]+)$", title)
    if match:
        extracted_source = match.group(1).strip()
        clean_title = title[:match.start()].strip()
        # Avoid stripping if the title is too short
        if len(clean_title) >= 15:
            return clean_title, extracted_source
    return title, ""


def categorize(text: str, default_cat: str = "National") -> str:
    t = text.lower()
    if any(k in t for k in ["maharashtra", "mumbai", "pune", "nagpur", "mpsc", "mantralaya", "ladki bahin", "talathi", "zp", "police bharti"]):
        return "Maharashtra"
    if any(k in t for k in ["rbi", "repo rate", "inflation", "gdp", "economy", "fiscal", "budget", "banking", "rupee", "sebi", "sensex"]):
        return "Economy"
    if any(k in t for k in ["isro", "drdo", "satellite", "space", "missile", "ai", "quantum", "technology", "cyber", "nasa", "defence"]):
        return "Science & Tech"
    if any(k in t for k in ["environment", "climate", "forest", "wildlife", "tiger", "ramsar", "pollution", "solar", "renewable", "cop"]):
        return "Environment"
    if any(k in t for k in ["olympics", "cricket", "sports", "medal", "badminton", "hockey", "chess", "world cup", "asian games"]):
        return "Sports"
    if any(k in t for k in ["un ", "united nations", "brics", "g20", "summit", "treaty", "foreign", "bilateral", "diplomacy"]):
        return "International"
    return default_cat


def determine_exam_tags(category: str, text: str) -> list:
    t = text.lower()
    tags = set()
    if category == "Maharashtra" or any(k in t for k in ["maharashtra", "mpsc", "police"]):
        tags.add("MPSC")
        tags.add("Police Bharti")
    if category == "Economy" or any(k in t for k in ["rbi", "banking", "finance", "sebi", "repo", "inflation"]):
        tags.add("IBPS")
        tags.add("Banking")
        tags.add("MPSC")
        tags.add("UPSC")
    if any(k in t for k in ["upsc", "ias", "ips", "constitution", "parliament", "bill", "amendment", "supreme court", "treaty", "summit"]):
        tags.add("UPSC")
        tags.add("MPSC")
        tags.add("SSC")
    if any(k in t for k in ["ssc", "cgl", "chsl", "railway", "rrb", "sports", "isro"]):
        tags.add("SSC")
        tags.add("MPSC")

    if not tags:
        tags.update(["MPSC", "UPSC", "SSC"])

    return sorted(list(tags))


def generate_exam_angle(category: str, clean_title: str, exam_tags: list) -> str:
    """Generate meaningful exam context instead of a generic placeholder."""
    tags_str = ", ".join(exam_tags)
    if category == "Maharashtra":
        return f"High priority for MPSC Rajyaseva, Combined Group B/C & Police Bharti. Expected in Maharashtra General Studies papers."
    elif category == "Economy":
        return f"Key focus for IBPS/SBI Banking Awareness and UPSC/MPSC GS Paper III (Economic Development & Monetary Policy)."
    elif category == "Science & Tech":
        return f"Frequently tested in UPSC Prelims GS Paper I, MPSC, and SSC CGL Science & Technology section."
    elif category == "Environment":
        return f"Crucial for UPSC & MPSC Environment & Ecology syllabus (GS Paper III) and State Forest examinations."
    elif category == "International":
        return f"Key topic for UPSC GS Paper II (Bilateral & International Relations) and MPSC International Affairs."
    elif category == "Sports":
        return f"High probability target for SSC CGL, RRB, and Police Bharti Current Affairs / General Knowledge MCQs."
    return f"Frequently tested in {tags_str} General Studies and current affairs papers."


def fetch_rss_feed(feed_info: dict) -> list:
    url = feed_info["url"]
    source = feed_info["source"]
    default_cat = feed_info.get("priority_category", "National")
    items = []

    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 ExamUdaanBot/1.0"
            },
        )
        with urllib.request.urlopen(req, timeout=12) as response:
            xml_data = response.read()

        root = ET.fromstring(xml_data)
        for item in root.findall(".//item"):
            raw_title = clean_text(item.findtext("title", ""))
            link = clean_text(item.findtext("link", ""))
            raw_desc = clean_text(item.findtext("description", ""))
            pub_date = item.findtext("pubDate", "")

            if not raw_title or not link:
                continue

            clean_title, extracted_source = strip_source_suffix(raw_title)
            final_source = extracted_source or source

            # Format date
            date_str = str(date.today())
            if pub_date:
                try:
                    dt = datetime.strptime(pub_date[:16], "%a, %d %b %Y")
                    date_str = dt.strftime("%Y-%m-%d")
                except Exception:
                    pass

            combined = f"{clean_title} {raw_desc}"
            category = categorize(combined, default_cat)
            exam_tags = determine_exam_tags(category, combined)

            # Generate insightful summary if Google News only gave redundant headline
            if not raw_desc or len(raw_desc) < 40 or raw_desc.lower() in clean_title.lower() or clean_title.lower() in raw_desc.lower():
                summary = f"Key government development concerning {clean_title}. High relevance for {', '.join(exam_tags)} aspirants covering recent administrative, economic, and policy updates."
            else:
                summary = raw_desc[:260] + ("..." if len(raw_desc) > 260 else "")

            why_it_matters = generate_exam_angle(category, clean_title, exam_tags)
            slug = re.sub(r"[^a-z0-9]+", "-", clean_title.lower()).strip("-")[:70]
            item_id = f"ca_{base64.urlsafe_b64encode(link.encode()).decode()[:16]}"

            items.append({
                "id": item_id,
                "slug": slug,
                "date": date_str,
                "title": clean_title,
                "summary": summary,
                "category": category,
                "examTags": exam_tags,
                "whyItMatters": why_it_matters,
                "sourceUrl": link,
                "sourceName": final_source,
                "youtubeQuery": f"{clean_title} MPSC UPSC analysis",
                "isLive": True,
            })
    except Exception as e:
        logger.warning(f"Error fetching RSS feed {url}: {e}")

    return items


def run_daily_fetch():
    logger.info("Starting Daily Current Affairs fetch from official & live feeds...")
    all_articles = []

    for feed in FEEDS:
        articles = fetch_rss_feed(feed)
        logger.info(f"Fetched {len(articles)} articles from {feed['source']}")
        all_articles.extend(articles)

    # Deduplicate by title key
    seen = set()
    unique_articles = []
    for a in all_articles:
        key = a["title"].lower()[:42]
        if key not in seen:
            seen.add(key)
            unique_articles.append(a)

    logger.info(f"Total unique articles collected: {len(unique_articles)}")

    if not unique_articles:
        logger.warning("No articles collected. Exiting.")
        return

    # Group by category to ensure balanced representation
    cat_buckets = {}
    for a in unique_articles:
        cat = a["category"]
        cat_buckets.setdefault(cat, []).append(a)

    balanced_articles = []
    # Take up to 15 per category so Economy, Science, Environment, etc. all get featured
    for cat, items in cat_buckets.items():
        balanced_articles.extend(items[:15])

    logger.info(f"Balanced articles pool: {len(balanced_articles)} items across {len(cat_buckets)} categories.")
    for cat, items in cat_buckets.items():
        logger.info(f"  - {cat}: {len(items[:15])} items")

    # Connect to PostgreSQL and persist into `daily_ca_summaries`
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            dbname=os.getenv("DB_DATABASE"),
            user=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
        )
        cur = conn.cursor()

        today = str(date.today())
        digest_payload = {
            "date": today,
            "articles": balanced_articles,
            "total": len(balanced_articles),
            "updated_at": datetime.now().isoformat(),
        }

        # Upsert into daily_ca_summaries table
        upsert_sql = """
            INSERT INTO daily_ca_summaries (summary_date, digest, updated_at)
            VALUES (%s, %s, NOW())
            ON CONFLICT (summary_date)
            DO UPDATE SET
                digest = EXCLUDED.digest,
                updated_at = NOW()
        """
        cur.execute(upsert_sql, (today, json.dumps(digest_payload)))
        conn.commit()
        logger.info(f"Successfully saved {len(balanced_articles)} balanced current affairs for {today} in PostgreSQL!")

        cur.close()
        conn.close()
    except Exception as e:
        logger.error(f"Failed to save current affairs to database: {e}")


if __name__ == "__main__":
    run_daily_fetch()
