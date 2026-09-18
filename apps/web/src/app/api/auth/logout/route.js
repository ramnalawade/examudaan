// ============================================================
// app/api/auth/logout/route.js — Revoke refresh token
// ExamUdaan | Direct PostgreSQL via pgdb.js
//
// POST /api/auth/logout
//   header: Authorization: Bearer <access_token>
//   body:   { refresh_token }  (optional — omit to logout all devices)
//   → Marks session(s) as inactive
// ============================================================

import crypto from 'crypto'
import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, serverError } from '../../../../lib/apiResponse'
import { withAuth } from '../../../../lib/auth'

export const POST = withAuth(async (req, ctx, currentUser) => {
  try {
    const body = await req.json().catch(() => ({}))
    const { refresh_token } = body

    if (refresh_token) {
      // Revoke specific session by hashed refresh token
      const tokenHash = crypto.createHash('sha256').update(refresh_token).digest('hex')
      await pgQuery(
        `UPDATE user_sessions
         SET is_active = false
         WHERE user_id = $1 AND refresh_token = $2`,
        [currentUser.user_id, tokenHash]
      )
    } else {
      // Revoke ALL sessions for this user (logout all devices)
      await pgQuery(
        `UPDATE user_sessions SET is_active = false WHERE user_id = $1`,
        [currentUser.user_id]
      )
    }

    return ok(null, 'Logged out successfully')

  } catch (err) {
    console.error('[logout] Error:', err)
    return serverError()
  }
})
