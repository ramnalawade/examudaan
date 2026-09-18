// ============================================================
// app/api/payment/create-order/route.js — Razorpay order
// ExamUdaan | Direct PostgreSQL via pgdb.js
//
// POST /api/payment/create-order
//   header: Authorization: Bearer <token>
//   body:   { plan: "basic" | "smart" | "pro" }
//
// Response: { order_id, amount, currency, key_id }
// ============================================================

import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, badRequest, serverError, serviceUnavailable } from '../../../../lib/apiResponse'
import { withAuth } from '../../../../lib/auth'

const PLAN_PRICES = {
  basic: 2900,   // ₹29/month
  smart: 4900,   // ₹49/month
  pro:   9900,   // ₹99/month
}

const PLAN_LABELS = {
  basic: 'ExamUdaan Basic — Email Alerts (1 Month)',
  smart: 'ExamUdaan Smart — Email + WhatsApp Alerts (1 Month)',
  pro:   'ExamUdaan Pro — All Channels (1 Month)',
}

export const POST = withAuth(async (req, ctx, currentUser) => {
  try {
    const body = await req.json().catch(() => ({}))
    const { plan } = body

    if (!plan || !PLAN_PRICES[plan]) {
      return badRequest(`Invalid plan. Choose one of: ${Object.keys(PLAN_PRICES).join(', ')}`)
    }

    const amount = PLAN_PRICES[plan]

    const razorpayKeyId     = process.env.RAZORPAY_KEY_ID
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

    if (!razorpayKeyId || !razorpayKeySecret) {
      return serviceUnavailable('Payment gateway not configured')
    }

    // Create Razorpay order
    const credentials = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64')
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt:  `examudaan_${currentUser.user_id}_${Date.now()}`,
        notes: { user_id: currentUser.user_id, plan },
      }),
    })

    if (!rzpRes.ok) {
      const err = await rzpRes.json()
      console.error('[create-order] Razorpay error:', err)
      return serverError('Failed to create payment order')
    }

    const order = await rzpRes.json()

    // Store pending payment record in PostgreSQL
    await pgQuery(
      `INSERT INTO payments (user_id, razorpay_id, plan, amount, status)
       VALUES ($1, $2, $3, $4, 'pending')`,
      [currentUser.user_id, order.id, plan, amount]
    )

    return ok({
      order_id: order.id,
      amount:   order.amount,
      currency: order.currency,
      key_id:   razorpayKeyId,
      plan,
      label:    PLAN_LABELS[plan],
    })

  } catch (err) {
    console.error('[create-order] Error:', err)
    return serverError()
  }
})
