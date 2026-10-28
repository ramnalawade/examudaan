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

  const isDocOrPdf = pathname.startsWith('/downloads/') || pathname.endsWith('.pdf') || pathname.startsWith('/api/mpsc-pdf')

  // 2. Allow whitelisted search engines & social previews (BUT disallow direct PDF binaries)
  const isWhitelisted = WHITELISTED_BOTS.some(bot => lowerUa.includes(bot))
  if (isWhitelisted) {
    if (isDocOrPdf) {
      return new Response('Access Denied: Document archiving disallowed.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
        },
      })
    }
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

  // 4. Crawl-Proof PDF & Document Protection
  // Prevents automated bots, external hotlinkers, or scripts from harvesting papers
  let rateCheck = null
  const clientIp = getClientIp(request)

  if (isDocOrPdf) {
    const isRangeReq = Boolean(request.headers.get('range'))
    if (!isRangeReq) {
      rateCheck = pdfLimiter.check(clientIp)
      if (!rateCheck.allowed) {
        return pdfLimiter.create429Response(rateCheck, 'Document access rate limit exceeded. Please wait a moment before viewing more papers.')
      }
    }

    const referer = request.headers.get('referer') || ''
    const secFetchSite = request.headers.get('sec-fetch-site') || ''
    const secFetchDest = request.headers.get('sec-fetch-dest') || ''
    const hasInternalReferer = referer.includes('examudaan.in') || referer.includes('localhost') || referer.includes('127.0.0.1')
    const hasInternalFetch = secFetchSite === 'same-origin' || secFetchSite === 'same-site' || secFetchDest === 'iframe'
    const hasVerify = Boolean(request.headers.get('x-verify') || request.headers.get('X-Verify'))
    const isObfuscatedDoc = pathname.includes('/api/mpsc-pdf/doc_')

    // Require internal study workspace context, authenticated token, or cryptographic signature
    if (!hasInternalReferer && !hasInternalFetch && !hasVerify && !isObfuscatedDoc) {
      return new Response('Access Denied: Direct document crawling is prohibited. Official question papers can only be viewed in the ExamUdaan study workspace.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
        },
      })
    }
  }

  // 5. Rate Limiting on API Endpoints & Mutating Method Origin Verification
  if (pathname.startsWith('/api/')) {
    // Check mutating methods (POST, PUT, DELETE, PATCH)
    const method = request.method
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const origin = request.headers.get('origin') || ''
      const referer = request.headers.get('referer') || ''
      const isInternal = origin.includes('examudaan.in') || origin.includes('localhost') || origin.includes('127.0.0.1') ||
                         referer.includes('examudaan.in') || referer.includes('localhost') || referer.includes('127.0.0.1')
      const hasVerify = Boolean(request.headers.get('x-verify') || request.headers.get('X-Verify'))
      if (!isInternal && !hasVerify) {
        return new Response(JSON.stringify({ status: 403, success: false, message: 'Forbidden: Untrusted API origin' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    // A. PDF & Question Paper Streamer: Strict 15 docs/minute (already checked above if isDocOrPdf)
    if (pathname.startsWith('/api/mpsc-pdf') && !rateCheck && !request.headers.get('range')) {
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
    else if (!isDocOrPdf) {
      rateCheck = apiLimiter.check(clientIp)
      if (!rateCheck.allowed) {
        return apiLimiter.create429Response(rateCheck, 'API request limit exceeded. Please wait a moment before trying again.')
      }
    }
  }

  // 6. Pass normal requests with standard security and rate limit headers
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  if (isDocOrPdf) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex')
    response.headers.set('Content-Security-Policy', "frame-ancestors 'self'")
    response.headers.set('Content-Disposition', 'inline')
  }

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
