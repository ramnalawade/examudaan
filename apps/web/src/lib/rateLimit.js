// ============================================================
// lib/rateLimit.js — High-Performance In-Memory Rate Limiter
// ExamUdaan.in | Protects APIs, scrapers, and PDF streaming from flooding
//
// Compatible with both Edge Middleware (proxy.js) and Node.js Route Handlers.
// ============================================================

export class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60 * 1000 // default 1 minute
    this.max = options.max || 100 // default 100 requests per window
    this.hits = new Map()
    this.lastCleanup = Date.now()
  }

  /**
   * Periodically purge expired records to maintain lean memory footprint
   */
  _cleanup(now) {
    if (now - this.lastCleanup > 60000 || this.hits.size > 3000) {
      for (const [key, record] of this.hits.entries()) {
        if (now > record.resetTime) {
          this.hits.delete(key)
        }
      }
      this.lastCleanup = now
    }
  }

  /**
   * Check if request by key (e.g. IP) is within rate limit
   * @param {string} key - Unique identifier (IP address, user ID, etc.)
   * @param {number} [customMax] - Optional override limit
   * @returns {{ allowed: boolean, current: number, limit: number, remaining: number, retryAfter: number, resetTime: number }}
   */
  check(key, customMax = null) {
    const now = Date.now()
    this._cleanup(now)

    const limit = customMax || this.max
    const record = this.hits.get(key)

    if (!record || now > record.resetTime) {
      const resetTime = now + this.windowMs
      this.hits.set(key, { count: 1, resetTime })
      return {
        allowed: true,
        current: 1,
        limit,
        remaining: limit - 1,
        retryAfter: 0,
        resetTime,
      }
    }

    record.count += 1
    const allowed = record.count <= limit
    const remaining = Math.max(0, limit - record.count)
    const retryAfter = Math.ceil((record.resetTime - now) / 1000)

    return {
      allowed,
      current: record.count,
      limit,
      remaining,
      retryAfter,
      resetTime: record.resetTime,
    }
  }

  /**
   * Generate standard HTTP 429 Too Many Requests response
   */
  create429Response(checkResult, customMessage = null) {
    const message = customMessage || 'Rate limit exceeded. Please wait a few seconds before trying again.'
    const body = JSON.stringify({
      status: 429,
      success: false,
      error: 'Too Many Requests',
      message,
      retryAfter: checkResult.retryAfter,
    })

    return new Response(body, {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(checkResult.retryAfter),
        'X-RateLimit-Limit': String(checkResult.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(checkResult.resetTime / 1000)),
      },
    })
  }
}

/**
 * Extract client IP from incoming NextRequest or standard Request
 */
export function getClientIp(req) {
  if (!req) return '127.0.0.1'

  // Support NextRequest headers or standard Headers
  const getHeader = (name) => {
    if (typeof req.headers?.get === 'function') return req.headers.get(name)
    if (req.headers && typeof req.headers === 'object') return req.headers[name] || req.headers[name.toLowerCase()]
    return null
  }

  const cfIp = getHeader('cf-connecting-ip')
  if (cfIp) return cfIp.trim()

  const forwarded = getHeader('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0].trim()
    if (first) return first
  }

  const realIp = getHeader('x-real-ip')
  if (realIp) return realIp.trim()

  return '127.0.0.1'
}

// ── Global Singleton Limiters ──
// 1. General API: 120 req / 60 seconds per IP
export const apiLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 120 })

// 2. Sensitive / PDF Streamer: 15 document fetches / 60 seconds per IP (stops bulk scrapers)
export const pdfLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 15 })

// 3. Auth Endpoints: 10 attempts / 60 seconds per IP (stops brute force OTP/login)
export const authLimiter = new RateLimiter({ windowMs: 60 * 1000, max: 10 })
