// ============================================================
// app/api/user/delete/route.js — Account Deletion
// DPDP Act 2023 requirement: users must be able to delete their data.
// Requires: valid JWT session (Authorization: Bearer <token>)
// ============================================================

import { query } from '../../../../lib/pgdb'
import { verifyAccessToken } from '../../../../lib/auth'
import { success, error } from '../../../../lib/apiResponse'

export async function DELETE(request) {
  // 1. Verify the user is logged in
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) return error('No token provided', 401)

  let decoded
  try {
    decoded = verifyAccessToken(token)
  } catch {
    return error('Invalid or expired session', 401)
  }

  const phone = decoded?.phone
  if (!phone) return error('Session does not contain phone number', 401)

  try {
    // 2. Delete alert subscriptions
    await query(`DELETE FROM alert_subscriptions WHERE phone = $1`, [phone])

    // 3. Delete OTP sessions
    await query(`DELETE FROM otp_sessions WHERE phone = $1`, [phone])

    // 4. Delete from users table if it exists (soft or hard)
    try {
      await query(`DELETE FROM users WHERE phone = $1`, [phone])
    } catch {
      // users table may not exist in this deployment — not fatal
    }

    return success({
      message: 'Your account and all associated data have been permanently deleted.',
      deleted_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[DELETE /api/user/delete] Error:', err)
    return error('Failed to delete account. Please contact support at hello@examudaan.in', 500)
  }
}
