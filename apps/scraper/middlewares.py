# ============================================================
# middlewares.py — Scrapy middlewares for polite crawling
# Redesigned: Removed proxy rotation, added SmartRetryMiddleware
#             which backs off on 403/429 instead of switching proxies
# ============================================================

import random
import time
import logging

from scrapy.downloadermiddlewares.retry import RetryMiddleware
from scrapy.utils.response import response_status_message

logger = logging.getLogger(__name__)


# ---- Realistic Browser User-Agents (updated 2026) ----
USER_AGENTS = [
    # Chrome Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    # Chrome Mac
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    # Firefox Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    # Firefox Linux
    "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
    # Safari Mac
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
    # Edge Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    # Chrome Android
    "Mozilla/5.0 (Linux; Android 14; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36",
]

ACCEPT_LANGUAGES = [
    "en-IN,en;q=0.9,hi;q=0.8",
    "en-US,en;q=0.9",
    "en-GB,en;q=0.9",
    "hi-IN,hi;q=0.9,en-IN;q=0.8,en;q=0.7",
]


class RandomUserAgentMiddleware:
    """Rotates User-Agent on every request to appear as different browsers."""

    def process_request(self, request, spider):
        request.headers['User-Agent'] = random.choice(USER_AGENTS)


class RandomHeadersMiddleware:
    """Adds realistic browser headers. Reduces 403 blocks on gov sites."""

    def process_request(self, request, spider):
        request.headers.setdefault(
            'Accept',
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        )
        request.headers.setdefault('Accept-Language', random.choice(ACCEPT_LANGUAGES))
        request.headers.setdefault('Accept-Encoding', 'gzip, deflate, br')
        request.headers.setdefault('DNT', '1')
        request.headers.setdefault('Connection', 'keep-alive')
        request.headers.setdefault('Upgrade-Insecure-Requests', '1')
        request.headers.setdefault('Cache-Control', 'max-age=0')


class SmartRetryMiddleware(RetryMiddleware):
    """
    Enhanced retry middleware that:
    1. Treats 403 as temporary (some gov sites throttle by IP temporarily)
    2. Adds exponential back-off wait before retry (no proxy needed)
    3. Logs detailed info about what got blocked and why
    
    This replaces proxy rotation for government sites:
    - Gov sites rarely use sophisticated anti-bot (no Cloudflare, CAPTCHA)
    - A simple wait + retry recovers most 403/429 responses
    - Waiting is FASTER than switching to a slow public proxy
    """

    BACKOFF_SECONDS = {
        403: 30,   # Forbidden — wait 30s then retry with fresh UA
        429: 60,   # Rate limited — wait 60s
        503: 20,   # Service Unavailable — wait 20s
    }

    def process_response(self, request, response, spider):
        if response.status in self.BACKOFF_SECONDS:
            wait = self.BACKOFF_SECONDS[response.status]
            logger.warning(
                f"[SmartRetry] Got {response.status} from {response.url}. "
                f"Waiting {wait}s before retry..."
            )
            time.sleep(wait)
            return self._retry(request, response_status_message(response.status), spider) or response

        return super().process_response(request, response, spider)
