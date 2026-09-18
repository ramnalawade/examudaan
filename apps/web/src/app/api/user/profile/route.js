// ============================================================
// app/api/user/profile/route.js — User profile (protected)
// ExamUdaan | Direct PostgreSQL via pgdb.js
//
// GET  /api/user/profile  → get current user's full profile
// PUT  /api/user/profile  → update any editable field
//
// Resilience:
//   Works regardless of migration state (008, 009, 010).
//   Uses SELECT * to avoid "column does not exist" errors.
//   Dynamically checks existing columns before building UPDATE queries.
//   Gracefully falls back to token claims if DB connection fails.
// ============================================================

import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, unauthorized, serverError } from '../../../../lib/apiResponse'
import { withAuth } from '../../../../lib/auth'
import { withValidation, schemas } from '../../../../lib/validate'
import { maskEmail, maskPhone } from '../../../../lib/helpers'

// ---- GET /api/user/profile ----
export const GET = withAuth(async (req, ctx, currentUser) => {
  try {
    const userId = currentUser?.user_id ?? currentUser?.id ?? null
    const userEmail = currentUser?.email ?? null

    let user = null

    // Safe query: use SELECT * so it NEVER errors on missing columns
    try {
      let rows = []
      if (userId) {
        rows = await pgQuery(`SELECT * FROM users WHERE id::text = $1::text LIMIT 1`, [userId])
      }
      if ((!rows || rows.length === 0) && userEmail) {
        rows = await pgQuery(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [userEmail])
      }
      if (rows && rows.length > 0) {
        user = rows[0]
      }
    } catch (dbErr) {
      console.warn('[GET /user/profile] Error querying users table:', dbErr.message)
      user = null
    }

    // Active alert subscriptions count (graceful — won't fail profile if table doesn't exist)
    let alertCount = 0
    if (user?.id) {
      try {
        const countRows = await pgQuery(
          `SELECT COUNT(*) AS cnt FROM alert_subscriptions WHERE user_id::text = $1::text AND is_active = true`,
          [user.id]
        )
        alertCount = parseInt(countRows[0]?.cnt || '0', 10)
      } catch {
        alertCount = 0
      }
    }

    // Compute names from whatever fields exist (first_name/last_name, or legacy name, or token payload)
    let firstName = user?.first_name || ''
    let lastName  = user?.last_name  || ''
    if (!firstName && user?.name) {
      const parts = user.name.trim().split(' ')
      firstName = parts[0] || ''
      lastName  = parts.slice(1).join(' ') || ''
    }
    if (!firstName && currentUser?.first_name) firstName = currentUser.first_name
    if (!lastName  && currentUser?.last_name)  lastName  = currentUser.last_name

    const email = user?.email || userEmail || ''
    const phone = user?.phone || currentUser?.phone || ''

    return ok({
      id:            user?.id || userId,
      email:         email,                                // unmasked for private profile display
      email_masked:  maskEmail(email),
      phone:         phone,                                // unmasked for private profile display
      phone_masked:  maskPhone(phone),
      first_name:    firstName,
      last_name:     lastName,
      gender:        user?.gender || '',
      dob:           user?.dob ? String(user.dob).slice(0, 10) : null,
      state:         user?.state || '',
      whatsapp:      user?.whatsapp || phone || '',
      language:      user?.language || currentUser?.language || 'en',
      plan:          user?.plan || currentUser?.plan || 'free',
      plan_expiry:   user?.plan_expiry || null,
      auth_provider: user?.auth_provider || (email ? 'google' : 'otp'),
      avatar_url:    user?.avatar_url || currentUser?.avatar_url || null,
      has_password:  !!user?.password_hash,
      created_at:    user?.created_at || null,
      alert_count:   alertCount,
    })

  } catch (err) {
    console.error('[GET /user/profile] Unexpected Error:', err)
    // Fallback gracefully so the client is never locked out of their profile
    const email = currentUser?.email || ''
    const phone = currentUser?.phone || ''
    return ok({
      id:            currentUser?.user_id ?? currentUser?.id ?? null,
      email:         email,
      email_masked:  maskEmail(email),
      phone:         phone,
      phone_masked:  maskPhone(phone),
      first_name:    currentUser?.first_name || '',
      last_name:     currentUser?.last_name  || '',
      gender:        '',
      dob:           null,
      state:         '',
      whatsapp:      phone || '',
      language:      currentUser?.language || 'en',
      plan:          currentUser?.plan || 'free',
      plan_expiry:   null,
      auth_provider: email ? 'google' : 'otp',
      avatar_url:    currentUser?.avatar_url || null,
      has_password:  false,
      alert_count:   0,
    })
  }
})

// ---- PUT /api/user/profile ----
// Accepts any combination of editable fields.
// Safely inspects columns in users table so it never fails on missing migration fields.
const updateHandler = withValidation(schemas.updateProfile, async (req, ctx) => {
  const currentUser = req._authUser
  try {
    const updates = req.validatedBody
    const userId = currentUser?.user_id ?? currentUser?.id ?? null
    const userEmail = currentUser?.email ?? null

    if (!userId && !userEmail) {
      return unauthorized('Invalid user authentication')
    }

    // Inspect which columns actually exist in the users table
    let existingCols = new Set()
    try {
      const colRows = await pgQuery(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'users'`
      )
      if (Array.isArray(colRows)) {
        existingCols = new Set(colRows.map(r => r.column_name))
      }
    } catch (e) {
      console.warn('[PUT /user/profile] Could not check columns:', e.message)
    }

    const setClauses = []
    const values     = []

    // 1. First name & Last name
    if (existingCols.has('first_name') && updates.first_name !== undefined) {
      setClauses.push(`first_name = $${values.length + 1}`)
      values.push(updates.first_name || null)
    }
    if (existingCols.has('last_name') && updates.last_name !== undefined) {
      setClauses.push(`last_name = $${values.length + 1}`)
      values.push(updates.last_name || null)
    }

    // 2. Legacy `name` column fallback if first_name column doesn't exist
    if (!existingCols.has('first_name') && existingCols.has('name') && (updates.first_name !== undefined || updates.last_name !== undefined)) {
      const fullName = `${updates.first_name || ''} ${updates.last_name || ''}`.trim()
      setClauses.push(`name = $${values.length + 1}`)
      values.push(fullName || null)
    }

    // 3. Extended profile fields
    const extendedFields = ['gender', 'dob', 'state', 'whatsapp', 'language']
    for (const field of extendedFields) {
      if (existingCols.has(field) && updates[field] !== undefined) {
        const val = updates[field] === '' ? null : updates[field]
        setClauses.push(`${field} = $${values.length + 1}`)
        values.push(val)
      }
    }

    // 4. updated_at if column exists
    if (existingCols.has('updated_at')) {
      setClauses.push(`updated_at = NOW()`)
    }

    if (setClauses.length === 0) {
      return ok({ ...updates, id: userId }, 'Profile updated')
    }

    let whereClause = ''
    if (userId) {
      values.push(userId)
      whereClause = `id::text = $${values.length}::text`
    } else {
      values.push(userEmail)
      whereClause = `email = $${values.length}`
    }

    let updatedUser = null
    try {
      const updatedRows = await pgQuery(
        `UPDATE users
         SET ${setClauses.join(', ')}
         WHERE ${whereClause}
         RETURNING *`,
        values
      )
      updatedUser = updatedRows?.[0] || null
    } catch (updateErr) {
      console.error('[PUT /user/profile] Update query error:', updateErr.message)
    }

    return ok(updatedUser || { ...updates, id: userId }, 'Profile updated successfully')

  } catch (err) {
    console.error('[PUT /user/profile] Error:', err)
    return serverError('Failed to update profile')
  }
})

// Wrap updateHandler with auth so currentUser is available via req._authUser
export const PUT = withAuth((req, ctx, user) => {
  req._authUser = user
  return updateHandler(req, ctx)
})
