// ============================================================
// app/api/auth/set-password/route.js — Set password for the first time
// ExamUdaan | Protected route (requires Bearer token)
//
// POST /api/auth/set-password
//   body: { password, confirm_password }
//   → Hashes password with bcrypt and stores in users.password_hash
//   → Used by OTP/Google users who want to set a password
// ============================================================

import bcrypt from 'bcryptjs'
import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, badRequest, serverError } from '../../../../lib/apiResponse'
import { withAuth } from '../../../../lib/auth'
import { withValidation, schemas } from '../../../../lib/validate'

const setPasswordHandler = withValidation(schemas.setPassword, async (req) => {
  const currentUser = req._authUser
  try {
    const { password } = req.validatedBody
    const userId = currentUser?.user_id ?? currentUser?.id ?? null
    const userEmail = currentUser?.email ?? null

    if (!userId && !userEmail) {
      return badRequest('User authentication required')
    }

    // Check if user already has a password set
    let rows = []
    if (userId) {
      rows = await pgQuery(`SELECT id, password_hash FROM users WHERE id = $1`, [userId])
    }
    if ((!rows || rows.length === 0) && userEmail) {
      rows = await pgQuery(`SELECT id, password_hash FROM users WHERE email = $1`, [userEmail])
    }

    const user = rows?.[0]
    if (!user) return badRequest('User not found')

    if (user.password_hash) {
      // User already has a password — they should use change-password instead
      return badRequest('Password already set. Use "Change Password" to update it.')
    }

    // Hash with bcrypt (10 rounds is the sweet spot for security vs speed)
    const hash = await bcrypt.hash(password, 10)

    await pgQuery(
      `UPDATE users
       SET password_hash = $1, updated_at = NOW()
       WHERE id = $2`,
      [hash, user.id]
    )

    return ok(null, 'Password set successfully. You can now log in with your email and password.')

  } catch (err) {
    console.error('[set-password] Error:', err)
    return serverError('Failed to set password')
  }
})

export const POST = withAuth((req, ctx, user) => {
  req._authUser = user
  return setPasswordHandler(req, ctx)
})
