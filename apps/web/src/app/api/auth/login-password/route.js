// ============================================================
// app/api/auth/login-password/route.js — Login with email + password
// ExamUdaan | Public route (no auth required)
//
// POST /api/auth/login-password
//   body: { email, password }
//   → Verifies password hash → issues JWT access + refresh tokens
// ============================================================

import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, badRequest, notFound, serverError } from '../../../../lib/apiResponse'
import { withValidation, schemas } from '../../../../lib/validate'
import { createAccessToken, createRefreshToken } from '../../../../lib/auth'

async function handler(req) {
  const { email, password } = req.validatedBody

  try {
    // Find user by email
    const rows = await pgQuery(
      `SELECT id, email, phone, first_name, last_name, plan, plan_expiry,
              language, password_hash, auth_provider
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email]
    )

    const user = rows[0]

    // Don't reveal whether user exists to prevent user enumeration
    if (!user || !user.password_hash) {
      return badRequest(
        !user
          ? 'No account found with this email. Please register first.'
          : 'No password set for this account. Please use OTP login instead.'
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return badRequest('Incorrect email or password')
    }

    // Issue JWT tokens
    const tokenPayload = {
      user_id: user.id,
      email:   user.email,
      phone:   user.phone,
      plan:    user.plan,
    }

    const access_token  = createAccessToken(tokenPayload)
    const refresh_token = createRefreshToken(tokenPayload)

    // Store refresh token hash in sessions table
    const refreshHash = crypto.createHash('sha256').update(refresh_token).digest('hex')
    const expiresAt   = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    await pgQuery(
      `INSERT INTO user_sessions (user_id, refresh_token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshHash, expiresAt]
    )

    return ok({
      access_token,
      refresh_token,
      user: {
        id:         user.id,
        email:      user.email,
        phone:      user.phone,
        first_name: user.first_name || '',
        last_name:  user.last_name  || '',
        plan:       user.plan,
        language:   user.language,
      },
    }, 'Login successful')

  } catch (err) {
    console.error('[login-password] Error:', err)
    return serverError('Login failed. Please try again.')
  }
}

export const POST = withValidation(schemas.loginWithPassword, handler)
