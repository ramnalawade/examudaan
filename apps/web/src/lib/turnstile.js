// ============================================================
// lib/turnstile.js — Cloudflare Turnstile Verification Helper
// ExamUdaan | Canonical siteverify integration
// Reference: https://developers.cloudflare.com/turnstile/
// ============================================================

/**
 * Validates a Cloudflare Turnstile response token server-side.
 *
 * @param {Object} options
 * @param {string} options.token - The token received from cf-turnstile-response
 * @param {string} [options.action] - The expected action name (e.g. 'feedback', 'contact', 'alert_subscribe')
 * @param {string} [options.clientIp] - Client IP (from x-forwarded-for or req.headers)
 * @returns {Promise<{ success: boolean, reason?: string, errorCodes?: string[], hostname?: string }>}
 */
export async function verifyTurnstileToken({ token, action, clientIp }) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET

  // Graceful fallback for local development if secret is not yet set
  if (!secretKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Turnstile] TURNSTILE_SECRET_KEY is unset in local environment. Permitting request for local test.')
      return { success: true, bypassed: true }
    }
    console.error('[Turnstile] Server misconfiguration: TURNSTILE_SECRET_KEY missing')
    return { success: false, reason: 'Turnstile secret unconfigured on server' }
  }

  // Token basic sanity check (support graceful dev bypass for localhost testing)
  if (typeof token !== 'string' || token.trim().length === 0 || token.length > 2048) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Turnstile] Missing token in development mode; permitting request for local test.')
      return { success: true, bypassed: true }
    }
    return { success: false, reason: 'Invalid or missing Turnstile token' }
  }

  if (process.env.NODE_ENV === 'development' && token === 'bypass_dev') {
    return { success: true, bypassed: true }
  }

  // Hostname allowlist
  const rawHostnames = process.env.TURNSTILE_HOSTNAMES || 'examudaan.in,www.examudaan.in,localhost,127.0.0.1'
  const expectedHostnames = new Set(
    rawHostnames
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean)
  )

  try {
    const postBody = new URLSearchParams({
      secret: secretKey,
      response: token.trim(),
    })
    if (clientIp) {
      postBody.append('remoteip', clientIp)
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: AbortSignal.timeout(10000),
      body: postBody,
    })

    if (!res.ok) {
      console.error(`[Turnstile] siteverify HTTP status error: ${res.status}`)
      return { success: false, reason: `Siteverify HTTP error ${res.status}` }
    }

    const data = await res.json()

    if (!data.success) {
      console.warn('[Turnstile] Verification failed:', data['error-codes'])
      return {
        success: false,
        reason: 'Bot verification failed',
        errorCodes: data['error-codes'] || [],
      }
    }

    // Validate Action if specified
    if (action && data.action && data.action !== action) {
      console.warn(`[Turnstile] Action mismatch. Expected '${action}', received '${data.action}'`)
      return { success: false, reason: 'Turnstile action mismatch' }
    }

    // Validate Hostname
    if (data.hostname) {
      const respHostname = data.hostname.toLowerCase()
      if (expectedHostnames.size > 0 && !expectedHostnames.has(respHostname)) {
        console.warn(`[Turnstile] Hostname mismatch: '${respHostname}' not in allowlist:`, Array.from(expectedHostnames))
        return { success: false, reason: 'Turnstile hostname unauthorized' }
      }
    }

    return {
      success: true,
      hostname: data.hostname,
      action: data.action,
      cdata: data.cdata,
    }
  } catch (err) {
    console.error('[Turnstile] Network / siteverify error:', err.message)
    return { success: false, reason: 'Turnstile verification network error' }
  }
}
