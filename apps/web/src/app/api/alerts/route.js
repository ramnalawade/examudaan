// ============================================================
// app/api/alerts/route.js — Alert Subscription API (upgraded)
// ExamUdaan | Agent: API Agent
//
// POST /api/alerts — subscribe to exam alerts
//   body: { email?, phone?, boards?, post_types?, via_email, via_whatsapp }
//
// GET  /api/alerts — get current user's subscriptions (protected)
//   header: Authorization: Bearer <token>
// ============================================================

import { query, queryOne } from '../../../lib/pgdb'
import {
  ok, created, badRequest, serverError, serviceUnavailable
} from '../../../lib/apiResponse'
import { withAuth } from '../../../lib/auth'
import { withValidation, schemas } from '../../../lib/validate'
import { verifyTurnstileToken } from '../../../lib/turnstile'

// ---- POST /api/alerts — public subscribe ----
async function subscribeHandler(req) {
  const {
    email, phone, whatsapp, name,
    boards, post_types, states,
    via_email, via_whatsapp, via_sms,
    'cf-turnstile-response': turnstileTokenAlt,
    turnstileToken,
  } = req.validatedBody

  const token = turnstileTokenAlt || turnstileToken
  if (token) {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null
    const turnstileCheck = await verifyTurnstileToken({
      token,
      action: 'alert_subscribe',
      clientIp,
    })
    if (!turnstileCheck.success) {
      return badRequest(turnstileCheck.reason || 'Bot verification failed. Please try again.')
    }
  }


  try {
    // Upsert user — insert or update on conflict with existing email/phone
    const upsertField = email ? 'email' : 'phone'
    const user = await queryOne(
      `INSERT INTO users (email, phone, whatsapp, name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (${upsertField}) DO UPDATE
         SET phone    = EXCLUDED.phone,
             whatsapp = EXCLUDED.whatsapp,
             name     = EXCLUDED.name
       RETURNING id, email, phone, plan`,
      [email || null, phone || null, whatsapp || null, name || null]
    )

    if (!user) {
      console.error('[POST /alerts] User upsert error: no row returned')
      return serverError('Failed to create user')
    }

    // Create subscription
    const subResult = await query(
      `INSERT INTO alert_subscriptions
         (user_id, boards, post_types, states, via_email, via_whatsapp, via_sms, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
      [user.id, boards || null, post_types || null, states || null, via_email, via_whatsapp, via_sms]
    )

    if (!subResult) {
      console.error('[POST /alerts] Subscription insert error')
      return serverError('Failed to create subscription')
    }

    return created(
      { user_id: user.id, via_email, via_whatsapp, via_sms },
      'Subscribed to alerts successfully!'
    )

  } catch (err) {
    console.error('[POST /alerts] Error:', err)
    return serverError()
  }
}

// ---- GET /api/alerts — protected: get own subscriptions ----
const getSubscriptions = withAuth(async (req, ctx, currentUser) => {
  const rows = await query(
    `SELECT id, boards, post_types, states, via_email, via_whatsapp, via_sms, is_active, created_at
     FROM alert_subscriptions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [currentUser.user_id]
  )

  if (rows === null) return serverError('Failed to fetch subscriptions')
  return ok(rows || [])
})

export const POST = withValidation(schemas.subscribeAlerts, subscribeHandler)
export const GET  = getSubscriptions
