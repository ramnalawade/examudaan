// ============================================================
// app/api/auth/verify-otp/route.js — Verify OTP + issue JWT
// ExamUdaan | Direct PostgreSQL via pgdb.js
//
// POST /api/auth/verify-otp
//   body: { identifier, code, channel }
//   → Verifies OTP → upserts user → issues access + refresh tokens
// ============================================================

import crypto from 'crypto'
import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, badRequest, notFound, serverError } from '../../../../lib/apiResponse'
import { withValidation, schemas } from '../../../../lib/validate'
import { createAccessToken, createRefreshToken } from '../../../../lib/auth'

async function handler(req) {
  const { identifier, channel, name } = req.validatedBody
  const code = String(req.validatedBody.code || req.validatedBody.otp || '').trim()

  if (!code) {
    return badRequest('OTP code is required')
  }

  try {
    // --- Find latest valid OTP for this identifier ---
    const otpRows = await pgQuery(
      `SELECT *
       FROM otp_codes
       WHERE identifier = $1
         AND channel    = $2
         AND verified   = false
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [identifier, channel]
    )

    const otpRecord = otpRows[0]
    if (!otpRecord) {
      return notFound('OTP not found or expired. Please request a new one.')
    }

    // --- Check attempt limit (max 3 tries) ---
    if (otpRecord.attempts >= 3) {
      return badRequest('Too many incorrect attempts. Please request a new OTP.')
    }

    // --- Verify OTP hash ---
    const submittedHash = crypto.createHash('sha256').update(code).digest('hex')
    if (submittedHash !== otpRecord.code) {
      await pgQuery(
        `UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1`,
        [otpRecord.id]
      )
      return badRequest(`Incorrect OTP. ${2 - otpRecord.attempts} attempt(s) remaining.`)
    }

    // --- Mark OTP as verified ---
    await pgQuery(
      `UPDATE otp_codes SET verified = true WHERE id = $1`,
      [otpRecord.id]
    )

    // --- Upsert user (create if new, find if existing) ---
    const isEmail = identifier.includes('@')
    const trimmedName = (name || '').trim()
    const nameParts = trimmedName ? trimmedName.split(/\s+/) : []
    const fallbackFirst = isEmail ? identifier.split('@')[0] : 'Candidate'
    const firstName = nameParts[0] || fallbackFirst
    const lastName = nameParts.slice(1).join(' ') || ''
    let userRows

    if (isEmail) {
      userRows = await pgQuery(
        `INSERT INTO users (email, first_name, last_name, name, auth_provider, plan)
         VALUES ($1, $2, $3, $4, 'otp', 'free')
         ON CONFLICT (email) DO UPDATE SET
           first_name = CASE WHEN $2 != 'Candidate' AND $2 != '' THEN $2 ELSE COALESCE(NULLIF(users.first_name, ''), EXCLUDED.first_name) END,
           last_name  = CASE WHEN $3 != '' THEN $3 ELSE COALESCE(NULLIF(users.last_name, ''), EXCLUDED.last_name) END,
           name       = CASE WHEN $4 != '' THEN $4 ELSE COALESCE(users.name, EXCLUDED.name) END,
           updated_at = NOW()
         RETURNING id, email, phone, first_name, last_name, name, plan, plan_expiry, language`,
        [identifier, firstName, lastName, trimmedName || firstName]
      )
    } else {
      userRows = await pgQuery(
        `INSERT INTO users (phone, first_name, last_name, name, auth_provider, plan)
         VALUES ($1, $2, $3, $4, 'otp', 'free')
         ON CONFLICT (phone) DO UPDATE SET
           first_name = CASE WHEN $2 != 'Candidate' AND $2 != '' THEN $2 ELSE COALESCE(NULLIF(users.first_name, ''), EXCLUDED.first_name) END,
           last_name  = CASE WHEN $3 != '' THEN $3 ELSE COALESCE(NULLIF(users.last_name, ''), EXCLUDED.last_name) END,
           name       = CASE WHEN $4 != '' THEN $4 ELSE COALESCE(users.name, EXCLUDED.name) END,
           updated_at = NOW()
         RETURNING id, email, phone, first_name, last_name, name, plan, plan_expiry, language`,
        [identifier, firstName, lastName, trimmedName || firstName]
      )
    }

    const user = userRows[0]
    if (!user) {
      return serverError('Failed to authenticate user')
    }

    // --- Issue JWT tokens ---
    const tokenPayload = {
      user_id:    user.id,
      email:      user.email || '',
      phone:      user.phone || '',
      first_name: user.first_name || firstName,
      last_name:  user.last_name || lastName,
      plan:       user.plan || 'free',
      language:   user.language || 'en',
    }

    const access_token = createAccessToken(tokenPayload)
    const refresh_token = createRefreshToken(tokenPayload)

    // --- Store refresh token hash in sessions table ---
    const refreshHash = crypto.createHash('sha256').update(refresh_token).digest('hex')
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

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
        email:      user.email || '',
        phone:      user.phone || '',
        first_name: user.first_name || firstName,
        last_name:  user.last_name  || lastName,
        name:       user.name || `${user.first_name || firstName} ${user.last_name || lastName}`.trim(),
        plan:       user.plan || 'free',
        language:   user.language || 'en',
      },
    }, 'Login successful')

  } catch (err) {
    console.error('[verify-otp] Error:', err)
    return serverError('Authentication failed')
  }
}

export const POST = withValidation(schemas.verifyOtp, handler)
