// ============================================================
// proxy.js — ExamUdaan Edge Security & Scraper Protection
// Protects candidate data & content from unauthorized scrapers,
// abusive bots, and automated crawlers while whitelisting SEO crawlers.
// Migrated from deprecated middleware.js convention in Next.js 16.
// ============================================================

import { NextResponse } from 'next/server'

// Legitimate crawlers that MUST be allowed for search indexing & social cards
const WHITELISTED_BOTS = [
  'googlebot',
  'google',
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

// In-memory sliding-window rate limiters
import { apiLimiter, pdfLimiter, authLimiter, getClientIp } from './lib/rateLimit.js'

export function proxy(request) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname
  const host = request.headers.get('host') || ''
  const proto = request.headers.get('x-forwarded-proto') || 'https'

  // Canonical Domain & HTTPS Enforcement (301 Permanent Redirect)
  // Eliminates duplicate indexing of www vs non-www and http vs https
  if (host.startsWith('www.examudaan.in') || (host.includes('examudaan.in') && proto === 'http')) {
    url.hostname = 'examudaan.in'
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }

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

  // 4. Rate Limiting on API and Document Stream Endpoints
  let rateCheck = null
  if (pathname.startsWith('/api/')) {
    const clientIp = getClientIp(request)

    // A. PDF & Question Paper Streamer: Strict 15 docs/minute
    if (pathname.startsWith('/api/mpsc-pdf')) {
      rateCheck = pdfLimiter.check(clientIp)
      if (!rateCheck.allowed) {
        return pdfLimiter.create429Response(rateCheck, 'Document download rate limit exceeded. Please wait a moment before accessing more papers.')
      }
    }
    // B. Auth Endpoints: 10 attempts/minute
    else if (pathname.startsWith('/api/auth')) {
      rateCheck = authLimiter.check(clientIp)
      if (!rateCheck.allowed) {
        return authLimiter.create429Response(rateCheck, 'Too many login or verification attempts. Please wait a minute.')
      }
    }
    // C. General API endpoints: 120 req/minute
    else {
      rateCheck = apiLimiter.check(clientIp)
      if (!rateCheck.allowed) {
        return apiLimiter.create429Response(rateCheck, 'API request limit exceeded. Please wait a moment before trying again.')
      }
    }
  }

  // 5. Pass normal requests with standard security and rate limit headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  if (rateCheck) {
    response.headers.set('X-RateLimit-Limit', String(rateCheck.limit))
    response.headers.set('X-RateLimit-Remaining', String(rateCheck.remaining))
  }

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
