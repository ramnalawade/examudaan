# ============================================================
# spiders/ai_spider.py — AI-Assisted Spider using Jina + Gemini
# ExamUdaan | For JS-heavy sites where Scrapy cannot render HTML
#
# How it works:
#   1. Input: a list of seed URLs (govt job pages)
#   2. Fetch each via Jina Reader (r.jina.ai) → clean markdown
#   3. Send markdown to Gemini Flash → extract structured JSON
#   4. Map to ExamPost and yield to pipeline
#
# Why Jina Reader?
#   - Free (rate-limited), handles JavaScript-rendered pages
#   - Returns clean markdown — much cheaper to send to Gemini
#   - Agent Reach also uses Jina (confirmed active channel)
#
# Run: scrapy crawl ai_spider
# Cost: ~$0.001 per page via Gemini Flash
# ============================================================

import json
import hashlib
import os
import re
from datetime import datetime, timezone

import scrapy

from items import ExamPost
from spiders.dedup_mixin import DuplicateStopMixin

# Jina Reader base URL — prefix any URL to get clean markdown
JINA_BASE = "https://r.jina.ai/"

# Gemini API endpoint (Flash model — cheapest, fastest)
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-1.5-flash:generateContent"
)

# ============================================================
# Seed URLs — JS-heavy govt pages that Scrapy cannot parse
# These are ORIGINAL government sources, never aggregators
# ============================================================
AI_SOURCES = [
    # State PSCs with JS-heavy portals
    {"board_slug": "rpsc",   "org_name": "Rajasthan Public Service Commission", "org_acronym": "RPSC", "state": "Rajasthan", "state_slug": "rajasthan",
     "url": "https://rpsc.rajasthan.gov.in/"},

    {"board_slug": "mppsc",  "org_name": "Madhya Pradesh Public Service Commission", "org_acronym": "MPPSC", "state": "Madhya Pradesh", "state_slug": "madhya-pradesh",
     "url": "https://www.mppsc.mp.gov.in/"},

    {"board_slug": "gpsc",   "org_name": "Gujarat Public Service Commission", "org_acronym": "GPSC", "state": "Gujarat", "state_slug": "gujarat",
     "url": "https://gpsc.gujarat.gov.in/LatestNews"},

    {"board_slug": "hpsc",   "org_name": "Haryana Public Service Commission", "org_acronym": "HPSC", "state": "Haryana", "state_slug": "haryana",
     "url": "https://hpsc.gov.in/"},

    {"board_slug": "ppsc",   "org_name": "Punjab Public Service Commission", "org_acronym": "PPSC", "state": "Punjab", "state_slug": "punjab",
     "url": "https://ppsc.gov.in/"},

    {"board_slug": "kpsc",   "org_name": "Karnataka Public Service Commission", "org_acronym": "KPSC", "state": "Karnataka", "state_slug": "karnataka",
     "url": "https://kpsc.kar.nic.in/"},

    {"board_slug": "tnpsc",  "org_name": "Tamil Nadu Public Service Commission", "org_acronym": "TNPSC", "state": "Tamil Nadu", "state_slug": "tamil-nadu",
     "url": "https://www.tnpsc.gov.in/newnotifications.html"},

    {"board_slug": "tspsc",  "org_name": "Telangana State Public Service Commission", "org_acronym": "TSPSC", "state": "Telangana", "state_slug": "telangana",
     "url": "https://www.tspsc.gov.in/"},

    # Central PSUs
    {"board_slug": "nabard",  "org_name": "National Bank for Agriculture and Rural Development", "org_acronym": "NABARD", "state": "All India", "state_slug": "all-india",
     "url": "https://www.nabard.org/content.aspx?id=572&catid=8&mid=490"},

    {"board_slug": "lic",     "org_name": "Life Insurance Corporation of India", "org_acronym": "LIC", "state": "All India", "state_slug": "all-india",
     "url": "https://licindia.in/bottom-links/recruitment"},

    {"board_slug": "isro",    "org_name": "Indian Space Research Organisation", "org_acronym": "ISRO", "state": "All India", "state_slug": "all-india",
     "url": "https://www.isro.gov.in/Careers.html"},

    {"board_slug": "coalindia", "org_name": "Coal India Limited", "org_acronym": "CIL", "state": "All India", "state_slug": "all-india",
     "url": "https://www.coalindia.in/en-us/career/ongoingRecruitment.aspx"},

    {"board_slug": "hal",     "org_name": "Hindustan Aeronautics Limited", "org_acronym": "HAL", "state": "All India", "state_slug": "all-india",
     "url": "https://hal-india.co.in/Careers/pg392.html"},
]

# Gemini extraction prompt
EXTRACT_PROMPT = """
You are a government recruitment data extractor.
Read the following webpage content and extract ALL job/exam notifications visible.

Return a JSON array. Each element represents one notification with these fields:
- title: string (notification title)
- source_url: string (direct link to the notification, if found)
- notification_pdf_url: string or null (direct PDF link if present)
- notification_type: one of: recruitment | result | admit_card | answer_key | syllabus
- apply_start_date: string YYYY-MM-DD or null
- apply_end_date: string YYYY-MM-DD or null
- total_vacancies: integer or null
- short_description: string (1-2 sentences max)

If no notifications found, return [].
Return ONLY valid JSON, no markdown code fences, no explanation.

CONTENT:
{content}
"""


class AISpider(DuplicateStopMixin, scrapy.Spider):
    """
    AI-assisted spider using Jina Reader + Gemini Flash.

    For each seed URL:
      1. Fetch via Jina Reader (handles JS rendering)
      2. Send clean markdown to Gemini for structured extraction
      3. Yield ExamPost items from parsed JSON
    """

    name = "ai_spider"
    MAX_ITEM_AGE_DAYS = 30

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from utils.gemini_client import GeminiKeyManager
        self.key_manager = GeminiKeyManager(logger=self.logger)
        self.model_name = os.environ.get("GEMINI_MODEL", "gemini-flash-lite-latest")
        if not self.key_manager.has_working_keys():
            self.logger.error("[ai_spider] No valid GEMINI_API_KEY available — AI extraction disabled")

    async def start(self):
        """Scrapy 2.17+ entry point: yield initial requests."""
        for req in self.start_requests():
            yield req

    def start_requests(self):
        """Fetch each seed URL directly from official government source."""
        for source in AI_SOURCES:
            self.logger.info(f"[ai_spider] Fetching direct: {source['url']}")
            yield scrapy.Request(
                url=source["url"],
                callback=self.parse_with_gemini,
                meta={"source": source},
                errback=self.on_error,
                dont_filter=True,
            )

    def on_error(self, failure):
        """Log fetch errors without crashing."""
        source = failure.request.meta.get("source", {})
        url = source.get("url") or failure.request.url
        self.logger.warning(f"[ai_spider] Direct fetch failed for {url}: {failure.getErrorMessage()}")

    def parse_with_gemini(self, response):
        """Clean HTML and send readable content to Gemini for extraction."""
        key = self.key_manager.get_current_key()
        if not key:
            self.logger.warning("[ai_spider] No working Gemini API key available — skipping.")
            return

        source = response.meta["source"]

        # Strip scripts, styles, and tags to produce clean readable text for Gemini
        raw_html = response.text
        clean = re.sub(r'<script.*?</script>', '', raw_html, flags=re.DOTALL | re.IGNORECASE)
        clean = re.sub(r'<style.*?</style>', '', clean, flags=re.DOTALL | re.IGNORECASE)
        clean = re.sub(r'<[^>]+>', ' ', clean)
        content = ' '.join(clean.split())[:15000]

        if len(content) < 50:
            self.logger.warning(f"[ai_spider] Page content too short for {source['url']} ({len(content)} chars)")
            return

        # Build Gemini API request
        prompt  = EXTRACT_PROMPT.replace("{content}", content)
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 2048,
            },
        }

        gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={key}"

        yield scrapy.Request(
            url=gemini_url,
            method="POST",
            body=json.dumps(payload),
            headers={"Content-Type": "application/json"},
            callback=self.parse_gemini_response,
            meta={"source": source, "api_key": key},
            errback=self.on_gemini_error,
            dont_filter=True,
        )

    def on_gemini_error(self, failure):
        """Log Gemini API errors and rotate key on 429/quota."""
        source = failure.request.meta["source"]
        key = failure.request.meta.get("api_key")
        err_msg = failure.getErrorMessage()
        self.logger.warning(f"[ai_spider] Gemini error for {source['url']}: {err_msg}")
        if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg or "quota" in err_msg.lower():
            if key:
                self.key_manager.mark_exhausted(key)

    def parse_gemini_response(self, response):
        """Parse Gemini JSON output and yield ExamPost items."""
        source = response.meta["source"]

        try:
            data     = response.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()

            # Gemini sometimes wraps in ```json ... ``` — strip that
            if raw_text.startswith("```"):
                raw_text = raw_text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

            notifications = json.loads(raw_text)
            if not isinstance(notifications, list):
                notifications = []

        except Exception as e:
            self.logger.warning(f"[ai_spider] Failed to parse Gemini response for {source['url']}: {e}")
            return

        self.logger.info(f"[ai_spider] {source['org_acronym']}: Gemini found {len(notifications)} notifications")

        for notif in notifications:
            title = (notif.get("title") or "").strip()
            link  = (notif.get("source_url") or source["url"]).strip()

            if not title or len(title) < 5:
                continue
            if self.is_irrelevant_link(title, link):
                continue

            # Apply date staleness check
            apply_end = notif.get("apply_end_date")
            if apply_end and self.is_stale_date(apply_end):
                self.logger.debug(f"[ai_spider] Stale: {title[:60]}")
                continue

            # Dedup
            dedup_hash = hashlib.sha256(f"{source['org_acronym']}_{link}".encode()).hexdigest()
            if self.track_duplicate(dedup_hash, label=title, urls=[link]):
                continue

            # Map to ExamPost
            item = ExamPost()
            item["title"]               = title
            item["board_slug"]          = source["board_slug"]
            item["org_name"]            = source["org_name"]
            item["org_acronym"]         = source["org_acronym"]
            item["source_url"]          = link
            item["official_website"]    = source["url"]
            item["notification_type"]   = notif.get("notification_type", "recruitment")
            item["state"]               = [source.get("state", "All India")]
            item["state_slug"]          = source.get("state_slug", "all-india")
            item["short_description"]   = notif.get("short_description")
            item["apply_start_date"]    = notif.get("apply_start_date")
            item["apply_end_date"]      = notif.get("apply_end_date")
            item["total_vacancies"]     = notif.get("total_vacancies")
            item["scraped_at"]          = datetime.now(timezone.utc).isoformat()
            item["dedup_hash"]          = dedup_hash

            pdf_url = notif.get("notification_pdf_url")
            if pdf_url:
                item["notification_pdf_url"] = pdf_url

            yield item
