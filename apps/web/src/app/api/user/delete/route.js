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

  const userId = decoded?.user_id || decoded?.id
  const phone = decoded?.phone
  const email = decoded?.email

  if (!userId && !phone && !email) return error('Session does not contain valid user identifier', 401)

  try {
    // 2. Delete alert subscriptions
    if (userId) {
      await query(`DELETE FROM alert_subscriptions WHERE user_id::text = $1::text`, [userId])
    }
    if (phone) {
      await query(`DELETE FROM alert_subscriptions WHERE phone = $1`, [phone])
    }
    if (email) {
      await query(`DELETE FROM alert_subscriptions WHERE email = $1`, [email])
    }

    // 3. Delete user job tracker & criteria
    if (userId) {
      await query(`DELETE FROM user_job_tracker WHERE user_id::text = $1::text`, [userId]).catch(() => {})
      await query(`DELETE FROM user_job_criteria WHERE user_id::text = $1::text`, [userId]).catch(() => {})
    }

    // 4. Delete sessions
    if (userId) {
      await query(`DELETE FROM user_sessions WHERE user_id::text = $1::text`, [userId]).catch(() => {})
    }
    if (phone) {
      await query(`DELETE FROM otp_sessions WHERE phone = $1`, [phone]).catch(() => {})
    }

    // 5. Delete from users table
    if (userId) {
      await query(`DELETE FROM users WHERE id::text = $1::text`, [userId])
    } else if (email) {
      await query(`DELETE FROM users WHERE email = $1`, [email])
    } else if (phone) {
      await query(`DELETE FROM users WHERE phone = $1`, [phone])
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
