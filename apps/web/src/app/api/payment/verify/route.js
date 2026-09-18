// ============================================================
// app/api/payment/verify/route.js — Verify Razorpay payment
// ExamUdaan | Direct PostgreSQL via pgdb.js
//
// POST /api/payment/verify
//   header: Authorization: Bearer <token>
//   body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan }
//
// Flow:
//   1. Verify HMAC-SHA256 signature (cryptographic proof of payment)
//   2. Update payment status to 'paid'
//   3. Update user's plan + set expiry (30 days)
// ============================================================

import crypto from 'crypto'
import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, badRequest, serverError } from '../../../../lib/apiResponse'
import { withAuth } from '../../../../lib/auth'
import { withValidation, schemas } from '../../../../lib/validate'
import { getFutureDate } from '../../../../lib/helpers'

const verifyHandler = withValidation(schemas.verifyPayment, async (req, ctx, currentUser) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
  } = req.validatedBody

  try {
    // --- STEP 1: Verify Razorpay HMAC-SHA256 signature ---
    const body     = `${razorpay_order_id}|${razorpay_payment_id}`
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      console.warn('[verify-payment] Signature mismatch — possible fraud attempt')
      return badRequest('Payment signature verification failed')
    }

    // --- STEP 2: Mark payment as paid in PostgreSQL ---
    const payRows = await pgQuery(
      `UPDATE payments
       SET status = 'paid', paid_at = NOW()
       WHERE razorpay_id = $1 AND user_id = $2
       RETURNING id`,
      [razorpay_order_id, currentUser.user_id]
    )

    if (!payRows.length) {
      console.error('[verify-payment] Payment record not found')
      return serverError('Failed to update payment record')
    }

    // --- STEP 3: Upgrade user plan + set 30-day expiry ---
    const planExpiry = getFutureDate(30)

    await pgQuery(
      `UPDATE users SET plan = $1, plan_expiry = $2 WHERE id = $3`,
      [plan, planExpiry, currentUser.user_id]
    )

    return ok(
      {
        plan,
        plan_expiry: planExpiry,
        payment_id:  razorpay_payment_id,
      },
      `Welcome to ExamUdaan ${plan.charAt(0).toUpperCase() + plan.slice(1)}! Your alerts are now active.`
    )

  } catch (err) {
    console.error('[verify-payment] Error:', err)
    return serverError()
  }
})

export const POST = withAuth((req, ctx, user) => {
  req._authUser = user
  return verifyHandler(req, ctx)
})
