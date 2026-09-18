// ============================================================
// lib/apiClient.js — Client-Side API Helper with x-verify Signature
// ExamUdaan | Automatically calculates x-verify header for requests
//
// Key: process.env.NEXT_PUBLIC_HASH_KEY
// Algorithm: Base64(JSON.stringify(payload)) + HASH_KEY → SHA-256 HEX
// ============================================================

import jsSHA from 'jssha'

const DEFAULT_HASH_KEY = 'examudaan_aitek_xverify_hash_sec_98f3b207a5e81'

/**
 * Generate client-side x-verify signature from payload
 */
export function createVerifyHash(payload, secretKey = null) {
  try {
    const key = secretKey || process.env.NEXT_PUBLIC_HASH_KEY || DEFAULT_HASH_KEY
    const jsonString = typeof payload === 'string' ? payload : JSON.stringify(payload || {})

    // UTF-8 safe base64 encoding (Node.js & browser)
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
    console.error('[createVerifyHash] Error generating hash:', err)
    return ''
  }
}

/**
 * Get headers object containing x-verify
 */
export function getVerifyHeaders(payload) {
  return {
    'x-verify': createVerifyHash(payload),
  }
}

/**
 * apiFetch: Enhanced fetch that automatically signs requests with x-verify header
 */
export async function apiFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const headers = { ...(options.headers || {}) }

  let payload = {}

  // Parse body if provided
  if (options.body) {
    if (typeof options.body === 'string') {
      try {
        payload = JSON.parse(options.body)
      } catch {
        payload = {}
      }
    } else if (typeof options.body === 'object') {
      payload = options.body
      options.body = JSON.stringify(options.body)
    }
  }

  // Extract query parameters from URL to include in hash
  try {
    const fullUrl = url.startsWith('http') ? new URL(url) : new URL(url, 'http://localhost')
    const queryParams = Object.fromEntries(fullUrl.searchParams.entries())
    payload = { ...payload, ...queryParams }
  } catch {}

  // Attach x-verify header if payload exists or method is mutating
  const hasPayload = Object.keys(payload).length > 0
  if (hasPayload || ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    headers['x-verify'] = createVerifyHash(payload)
  }

  // Default content-type for mutations with body
  if (options.body && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json'
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
