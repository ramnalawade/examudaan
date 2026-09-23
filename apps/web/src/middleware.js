// ============================================================
// middleware.js — ExamUdaan Edge Security & Scraper Protection
// Protects candidate data & content from unauthorized scrapers,
// abusive bots, and automated crawlers while whitelisting SEO crawlers.
// ============================================================

import { NextResponse } from 'next/server'

// Legitimate crawlers that MUST be allowed for search indexing & social cards
const WHITELISTED_BOTS = [
  'googlebot',
  'bingbot',
  'bingpreview',
  'msnbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'pinterestbot',
]

// Known aggressive scrapers, data-mining tools, and unauthorized bots
const BLOCKED_BOT_PATTERNS = [
  /scrapy/i,
  /python-requests/i,
  /aiohttp/i,
  /httpx/i,
  /go-http-client/i,
  /wget/i,
  /curl\//i,
  /sqlmap/i,
  /nikto/i,
  /censys/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /dotbot/i,
  /mj12bot/i,
  /petalbot/i,
  /megaindex/i,
  /barkrowler/i,
  /blexbot/i,
  /dataforseobot/i,
  /serpstatbot/i,
  /screaming frog/i,
  /bytespider/i,
  /ccbot/i,
  /gptbot/i,
  /claudebot/i,
  /amazonbot/i,
  /diffbot/i,
  /imagesiftbot/i,
]

export function middleware(request) {
  const ua = request.headers.get('user-agent') || ''

  // 1. If empty or suspiciously short user-agent, reject
  if (!ua.trim() || ua.trim().length < 5) {
    return new Response('Access Denied: Valid browser User-Agent required.', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  const lowerUa = ua.toLowerCase()

  // 2. Allow whitelisted search engines & social previews
  const isWhitelisted = WHITELISTED_BOTS.some(bot => lowerUa.includes(bot))
  if (isWhitelisted) {
    return NextResponse.next()
  }

  // 3. Block known scrapers & content miners
  const isBlocked = BLOCKED_BOT_PATTERNS.some(regex => regex.test(lowerUa))
  if (isBlocked) {
    return new Response('Access Denied: Automated crawling and data scraping is prohibited on ExamUdaan.in.', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow, noai, noimageai',
      },
    })
  }

  // 4. Pass normal requests with standard security headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
