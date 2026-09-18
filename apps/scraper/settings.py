# ============================================================
# settings.py — ExamUdaan Scrapy Settings
# Redesigned: Removed proxy rotation (too slow), added smart
#             rate limiting + retry strategy. Direct PostgreSQL.
# ============================================================

import os
from dotenv import load_dotenv

load_dotenv()

BOT_NAME = "examudaan"

SPIDER_MODULES = ["spiders"]
NEWSPIDER_MODULE = "spiders"

# ---- Polite crawling: rotating UA, no fixed bot string ----
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"

# ---- Robots.txt ----
# Gov sites often have misconfigured robots.txt. We follow rules manually per spider.
ROBOTSTXT_OBEY = False

# ---- Rate Limiting ----
# Government portals are slow — be gentle. 2s base delay, randomised.
DOWNLOAD_DELAY = 2
RANDOMIZE_DOWNLOAD_DELAY = True       # actual delay = 0.5x to 1.5x DOWNLOAD_DELAY

# ---- Concurrency ----
# Keep it low for gov sites — they're fragile
CONCURRENT_REQUESTS = 4
CONCURRENT_REQUESTS_PER_DOMAIN = 1   # one request at a time per gov portal

# ---- Auto-throttle ----
# Dynamically slows down if server is responding slowly — much better than proxy rotation
AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_START_DELAY = 2
AUTOTHROTTLE_MAX_DELAY = 30          # max 30s delay if server is overloaded
AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
AUTOTHROTTLE_DEBUG = False

# ---- Safety limits — prevent spiders crawling 3+ years of history ----
# Each spider stops after 10 listing/detail pages (not PDFs — those are downloads).
# Combined with the 3-week date cutoff in pipelines.py, this keeps runs fast.
CLOSESPIDER_PAGECOUNT = 10      # stop after 10 pages per spider
CLOSESPIDER_ITEMCOUNT = 50      # also stop after 50 items saved per spider run

# ---- Retry on 403/429/5xx (NOT via proxy — just wait and retry) ----
RETRY_ENABLED = True
RETRY_TIMES = 4
RETRY_HTTP_CODES = [403, 429, 500, 502, 503, 504, 408]
RETRY_PRIORITY_ADJUST = -1           # retry requests have lower priority

# ---- Download timeout ----
DOWNLOAD_TIMEOUT = 45                # longer for gov sites (they're slow)

# ---- Middlewares: UA rotation + browser headers only ----
# Proxy rotation REMOVED — it was too slow and unreliable for gov sites
# Government sites rarely block legitimate crawlers with good UA + polite rate limiting
DOWNLOADER_MIDDLEWARES = {
    # Disable Scrapy's default fixed User-Agent
    'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware': None,

    # Rotating User-Agent (priority 400)
    'middlewares.RandomUserAgentMiddleware': 400,

    # Realistic browser headers (priority 410)
    'middlewares.RandomHeadersMiddleware': 410,

    # Custom retry handler for 403 (treat as temporary, wait longer)
    'middlewares.SmartRetryMiddleware': 550,
}

# ---- HTTP Cache ----
# Skip re-crawling the same URL within 12 hours (short for active spiders)
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 43200   # 12 hours
HTTPCACHE_DIR = '.scrapy_cache'
HTTPCACHE_IGNORE_HTTP_CODES = [500, 502, 503, 504, 408, 429, 403]
HTTPCACHE_STORAGE = 'scrapy.extensions.httpcache.FilesystemCacheStorage'

# ---- SSL: many gov sites have outdated SSL certs ----
DOWNLOADER_CLIENTCONTEXTFACTORY = 'scrapy.core.downloader.contextfactory.ScrapyClientContextFactory'
DOWNLOAD_VERIFY_CERTIFICATES = False

# ---- Pipelines ----
# Flow: DeduplicationPipeline → GeminiExtraction → PostgresPipeline
# NOTE: CrawlSummaryEmailPipeline disabled per-spider to avoid 50+ separate emails.
# Consolidated daily summary email is sent at the end of the entire crawl run by run_scraper.py.
ITEM_PIPELINES = {
    "pipelines.DeduplicationPipeline":          10,   # Skip already-crawled URLs (before Gemini)
    "pipelines.GeminiExtractionPipeline":       50,   # AI PDF extraction
    "pipelines.PostgresPipeline":              200,   # Save to PostgreSQL (new schema)
}

# ---- Database (Direct PostgreSQL via psycopg2) ----
DB_HOST     = os.getenv("DB_HOST", "aws-0-ap-southeast-1.pooler.supabase.com")
DB_PORT     = int(os.getenv("DB_PORT", "5432"))
DB_NAME     = os.getenv("DB_DATABASE", "postgres")
DB_USER     = os.getenv("DB_USERNAME", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
# Or use full DATABASE_URL if available
DATABASE_URL = os.getenv("DIRECT_URL", os.getenv("DATABASE_URL", ""))

# ---- Output ----
FEED_EXPORT_ENCODING = "utf-8"

# ---- Logging ----
LOG_LEVEL = "INFO"

# ============================================================
# Brevo (Sendinblue) transactional email — crawl summary
# ============================================================
# Sign up at https://app.brevo.com  → My Account → SMTP & API → API Keys
# The sender email MUST be verified in Brevo.
BREVO_API_KEY         = os.getenv("BREVO_API_KEY", "")
BREVO_SENDER_EMAIL    = os.getenv("BREVO_SENDER_EMAIL", "noreply@examudaan.in")
BREVO_SENDER_NAME     = os.getenv("BREVO_SENDER_NAME", "ExamUdaan Scraper")
BREVO_RECIPIENT_EMAIL = os.getenv("BREVO_RECIPIENT_EMAIL", "ramnalawade1986@gmail.com")

# ============================================================
# Gemini key rate-limit info (documented for reference)
# ============================================================
# Current working models on this account (2026-08):
#   gemini-flash-lite-latest  → resolves to current lightest free-tier flash (fastest)
#   gemini-3.5-flash-lite     → explicit version, free tier
#   gemini-3.5-flash          → higher quality
#   gemini-flash-latest       → always-latest alias
# NOTE: gemini-2.0-flash-lite, gemini-2.0-flash, gemini-1.5-flash-* are RETIRED on this account.
# Uses: google-genai SDK (new). google-generativeai is DEPRECATED.
# Key rotation: add multiple keys to GEMINI_API_KEY separated by commas.
# Example: GEMINI_API_KEY=key1,key2,key3

# ============================================================
# Download delay documentation
# ============================================================
# DOWNLOAD_DELAY = 2           → base delay between requests (2 seconds)
# RANDOMIZE_DOWNLOAD_DELAY = True → actual delay is 0.5x-1.5x (i.e., 1-3s)
# AUTOTHROTTLE_ENABLED = True  → dynamically adjusts delay based on server latency
# AUTOTHROTTLE_MAX_DELAY = 30  → max 30s delay if server is very slow
# CONCURRENT_REQUESTS = 4      → max 4 parallel requests globally
# CONCURRENT_REQUESTS_PER_DOMAIN = 1 → only 1 request at a time per gov portal
