// ============================================================
// lib/hashVerify.js — API Request Signature Verification (x-verify)
// ExamUdaan | Direct implementation of AiTEK's GenerateHash & checkHash
//
// Key stored in .env: HASH_KEY (server) & NEXT_PUBLIC_HASH_KEY (client)
// Prevents unauthorized tampering and middleman API scraping.
// Rejects unmatched requests with 422 "Unprocessable Content".
// ============================================================

import jsSHA from 'jssha'

export const DEFAULT_HASH_KEY = 'examudaan_aitek_xverify_hash_sec_98f3b207a5e81'

function unprocessable(msg = 'Unprocessable Content') {
  if (typeof Response !== 'undefined') {
    return new Response(
      JSON.stringify({ status: 422, success: false, data: null, message: msg }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    )
  }
  return { status: 422, success: false, data: null, message: msg }
}

/**
 * Generate SHA-256 HEX hash from payload and secret key
 * Mirrors user's AiTEK GenerateHash algorithm:
 *   let text = Buffer.from(JSON.stringify(payload)).toString("base64")
 *   text = text + process.env.HASH_KEY
 *   const shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
 *   shaObj.update(text);
 *   const hash = shaObj.getHash("HEX");
 */
export function computePayloadHash(payload, secretKey = null) {
  try {
    const key = secretKey || process.env.HASH_KEY || process.env.NEXT_PUBLIC_HASH_KEY || DEFAULT_HASH_KEY
    const jsonString = typeof payload === 'string' ? payload : JSON.stringify(payload || {})

    // UTF-8 safe base64 encoding (Node.js & browser safe)
    let base64Text = ''
    if (typeof Buffer !== 'undefined') {
      base64Text = Buffer.from(jsonString, 'utf8').toString('base64')
    } else {
      const bytes = new TextEncoder().encode(jsonString)
      let bin = ''
      for (let i = 0; i < bytes.length; i++) {
        bin += String.fromCharCode(bytes[i])
      }
      base64Text = btoa(bin)
    }

    const text = base64Text + key
    const shaObj = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' })
    shaObj.update(text)
    return shaObj.getHash('HEX')
  } catch (err) {
    console.error('[hashVerify] Error in computePayloadHash:', err)
    return ''
  }
}

/**
 * GenerateHash verifier
 * Matches user's signature:
 *   function GenerateHash(req: any)
 */
export function GenerateHash(req, payload = null) {
  try {
    const data = payload !== null ? payload : { ...(req?.body || {}), ...(req?.query || {}), ...(req?.params || {}) }
    const expectedHash = computePayloadHash(data)

    // Extract header (supports NextRequest.headers.get() and standard req.headers['x-verify'])
    const headerVal = (
      req?.headers?.get?.('x-verify') ||
      req?.headers?.['x-verify'] ||
      req?.headers?.['X-Verify'] ||
      ''
    ).trim()

    if (!headerVal) {
      return { success: false, reason: 'missing_header' }
    }

    if (headerVal.toLowerCase() === expectedHash.toLowerCase()) {
      return { success: true, hash: expectedHash }
    }

    // Fallback: If JSON key order differed, test canonical sorted keys
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const sortedKeys = Object.keys(data).sort()
      const sortedData = {}
      for (const k of sortedKeys) {
        sortedData[k] = data[k]
      }
      const sortedHash = computePayloadHash(sortedData)
      if (headerVal.toLowerCase() === sortedHash.toLowerCase()) {
        return { success: true, hash: sortedHash }
      }
    }

    return { success: false, reason: 'mismatch', expected: expectedHash, received: headerVal }
  } catch (error) {
    console.error('[GenerateHash] Verification exception:', error)
    return { success: false, error }
  }
}

/**
 * checkHash middleware helper
 * Matches user's Express middleware:
 *   export const checkHash = async (req: Request, res: Response, next: NextFunction)
 *
 * In Next.js: returns NextResponse 422 if failed, or null if passed.
 */
export function checkHash(req, payload = null) {
  try {
    const data = payload !== null ? payload : { ...(req?.body || {}), ...(req?.query || {}), ...(req?.params || {}) }
    const hasData = data && typeof data === 'object' && Object.keys(data).length > 0
    const hasVerifyHeader = Boolean(
      req?.headers?.get?.('x-verify') ||
      req?.headers?.['x-verify'] ||
      req?.headers?.['X-Verify']
    )

    // Verify when payload is present or x-verify header is supplied
    if (hasData || hasVerifyHeader) {
      const isHashTrue = GenerateHash(req, data)
      if (!isHashTrue.success) {
        return unprocessable('Unprocessable Content')
      }
    }

    return null
  } catch (error) {
    console.error('[checkHash] Error:', error)
    return unprocessable('Unprocessable Content')
  }
}

/**
 * Higher-order wrapper for route handlers
 */
export function withCheckHash(handler) {
  return async function (req, ctx) {
    let body = {}
    try {
      const contentType = req?.headers?.get?.('content-type') || ''
      if (contentType.includes('application/json')) {
        body = await req.clone().json().catch(() => ({}))
      }
    } catch {}

    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())
    const merged = { ...body, ...query }

    const errResponse = checkHash(req, merged)
    if (errResponse) {
      return errResponse
    }

    return handler(req, ctx)
  }
}
