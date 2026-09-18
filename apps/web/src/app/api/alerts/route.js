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

import { supabase } from '../../../lib/supabase'
import {
  ok, created, serverError, serviceUnavailable
} from '../../../lib/apiResponse'
import { withAuth } from '../../../lib/auth'
import { withValidation, schemas } from '../../../lib/validate'

// ---- POST /api/alerts — public subscribe ----
async function subscribeHandler(req) {
  if (!supabase) return serviceUnavailable('Alert service not configured')

  const {
    email, phone, whatsapp, name,
    boards, post_types, states,
    via_email, via_whatsapp, via_sms,
  } = req.validatedBody

  try {
    // Upsert user
    const upsertField = email ? 'email' : 'phone'
    const { data: user, error: userErr } = await supabase
      .from('users')
      .upsert(
        { email: email || null, phone: phone || null, whatsapp: whatsapp || null, name: name || null },
        { onConflict: upsertField, ignoreDuplicates: false }
      )
      .select('id, email, phone, plan')
      .single()

    if (userErr || !user) {
      console.error('[POST /alerts] User upsert error:', userErr)
      return serverError('Failed to create user')
    }

    // Create subscription
    const { error: subErr } = await supabase
      .from('alert_subscriptions')
      .insert({
        user_id:     user.id,
        boards:      boards || null,
        post_types:  post_types || null,
        states:      states || null,
        via_email,
        via_whatsapp,
        via_sms,
        is_active:   true,
      })

    if (subErr) {
      console.error('[POST /alerts] Subscription error:', subErr)
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
  if (!supabase) return serviceUnavailable()

  const { data, error } = await supabase
    .from('alert_subscriptions')
    .select('id, boards, post_types, states, via_email, via_whatsapp, via_sms, is_active, created_at')
    .eq('user_id', currentUser.user_id)
    .order('created_at', { ascending: false })

  if (error) return serverError('Failed to fetch subscriptions')
  return ok(data || [])
})

export const POST = withValidation(schemas.subscribeAlerts, subscribeHandler)
export const GET  = getSubscriptions
