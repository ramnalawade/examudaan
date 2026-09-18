// ============================================================
// app/api/auth/change-password/route.js — Change existing password
// ExamUdaan | Protected route (requires Bearer token)
//
// POST /api/auth/change-password
//   body: { current_password, new_password, confirm_password }
//   → Verifies current password → hashes new one → updates DB
// ============================================================

import bcrypt from 'bcryptjs'
import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, badRequest, serverError } from '../../../../lib/apiResponse'
import { withAuth } from '../../../../lib/auth'
import { withValidation, schemas } from '../../../../lib/validate'

const changePasswordHandler = withValidation(schemas.changePassword, async (req) => {
  const currentUser = req._authUser
  try {
    const { current_password, new_password } = req.validatedBody
    const userId = currentUser?.user_id ?? currentUser?.id ?? null
    const userEmail = currentUser?.email ?? null

    if (!userId && !userEmail) {
      return badRequest('User authentication required')
    }

    // Fetch current password hash
    let rows = []
    if (userId) {
      rows = await pgQuery(`SELECT id, password_hash FROM users WHERE id = $1`, [userId])
    }
    if ((!rows || rows.length === 0) && userEmail) {
      rows = await pgQuery(`SELECT id, password_hash FROM users WHERE email = $1`, [userEmail])
    }

    const user = rows?.[0]
    if (!user) return badRequest('User not found')

    if (!user.password_hash) {
      return badRequest('No password set. Please use "Set Password" first.')
    }

    // Verify current password
    const isValid = await bcrypt.compare(current_password, user.password_hash)
    if (!isValid) {
      return badRequest('Current password is incorrect')
    }

    // Hash new password and store
    const newHash = await bcrypt.hash(new_password, 10)
    await pgQuery(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [newHash, user.id]
    )

    return ok(null, 'Password changed successfully')

  } catch (err) {
    console.error('[change-password] Error:', err)
    return serverError('Failed to change password')
  }
})

export const POST = withAuth((req, ctx, user) => {
  req._authUser = user
  return changePasswordHandler(req, ctx)
})
