// ============================================================
// app/api/user/job-criteria/route.js — Save / get user's job criteria
// ExamUdaan | Protected — requires Bearer JWT
//
// GET  /api/user/job-criteria           → list user's saved criteria
// POST /api/user/job-criteria           → create new criteria set
// PUT  /api/user/job-criteria?id=NNN    → update a criteria set
// DELETE /api/user/job-criteria?id=NNN  → delete a criteria set
// ============================================================

import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, notFound, serverError, badRequest } from '../../../../lib/apiResponse'
import { withAuth } from '../../../../lib/auth'

// ── GET: list all saved criteria for the user ──
export const GET = withAuth(async (req, ctx, currentUser) => {
  try {
    const userId = currentUser?.user_id ?? currentUser?.id ?? null
    if (!userId) {
      return ok({ criteria: [], count: 0 })
    }

    // Use user_id::text = $1::text to support both UUID and INTEGER user_id types
    const rows = await pgQuery(
      `SELECT * FROM user_job_criteria
       WHERE user_id::text = $1::text AND is_active = true
       ORDER BY created_at DESC`,
      [userId]
    )
    return ok({ criteria: rows || [], count: rows?.length || 0 })
  } catch (err) {
    console.warn('[GET /user/job-criteria] Handled warning:', err.message)
    // Return empty list instead of failing dashboard
    return ok({ criteria: [], count: 0 })
  }
})

// ── POST: create a new criteria set ──
export const POST = withAuth(async (req, ctx, currentUser) => {
  try {
    const userId = currentUser?.user_id ?? currentUser?.id ?? null
    if (!userId) {
      return badRequest('User authentication required')
    }

    const body = await req.json().catch(() => ({}))

    const {
      name              = 'My Criteria',
      qualifications    = [],
      categories        = [],
      govt_level        = null,
      states            = [],
      cities            = [],
      reservation_category = null,
      max_age           = null,
      min_vacancies     = null,
      keywords          = null,
      alert_email       = false,
      alert_whatsapp    = false,
      alert_sms         = false,
    } = body

    // Inspect user_id column data type to handle integer vs uuid/text gracefully
    let userIdValue = userId
    try {
      const colInfo = await pgQuery(
        `SELECT data_type FROM information_schema.columns
         WHERE table_name = 'user_job_criteria' AND column_name = 'user_id' LIMIT 1`
      )
      const dataType = colInfo?.[0]?.data_type || ''
      if (dataType === 'integer' || dataType === 'smallint' || dataType === 'bigint') {
        const parsed = parseInt(userId, 10)
        if (isNaN(parsed)) {
          // user_id in DB is integer but user has UUID — alter or handle
          return serverError('Database schema mismatch: user_job_criteria.user_id requires UUID type. Please run migration.')
        }
        userIdValue = parsed
      }
    } catch {}

    const rows = await pgQuery(
      `INSERT INTO user_job_criteria (
         user_id, name, qualifications, categories, govt_level,
         states, cities, reservation_category, max_age, min_vacancies,
         keywords, alert_email, alert_whatsapp, alert_sms
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        userIdValue, name, qualifications, categories, govt_level,
        states, cities, reservation_category, max_age, min_vacancies,
        keywords, alert_email, alert_whatsapp, alert_sms,
      ]
    )

    return ok(rows?.[0] || null, 'Job criteria saved successfully')
  } catch (err) {
    console.error('[POST /user/job-criteria] Error:', err)
    return serverError('Failed to save job criteria')
  }
})

// ── PUT: update an existing criteria set ──
export const PUT = withAuth(async (req, ctx, currentUser) => {
  try {
    const userId = currentUser?.user_id ?? currentUser?.id ?? null
    const { searchParams } = new URL(req.url)
    const criteriaId       = parseInt(searchParams.get('id'), 10)

    if (!criteriaId || isNaN(criteriaId)) {
      return badRequest('?id=<criteria_id> is required')
    }

    const body = await req.json().catch(() => ({}))
    const allowed = [
      'name', 'qualifications', 'categories', 'govt_level',
      'states', 'cities', 'reservation_category', 'max_age',
      'min_vacancies', 'keywords', 'alert_email', 'alert_whatsapp', 'alert_sms',
    ]

    const setClauses = []
    const values     = []

    for (const [key, val] of Object.entries(body)) {
      if (allowed.includes(key) && val !== undefined) {
        setClauses.push(`${key} = $${values.length + 1}`)
        values.push(val)
      }
    }

    if (setClauses.length === 0) return ok(null, 'Nothing to update')

    setClauses.push(`updated_at = NOW()`)

    values.push(criteriaId, userId)
    const rows = await pgQuery(
      `UPDATE user_job_criteria
       SET ${setClauses.join(', ')}
       WHERE id = $${values.length - 1} AND user_id::text = $${values.length}::text
       RETURNING *`,
      values
    )

    if (!rows || rows.length === 0) return notFound('Criteria not found or access denied')

    return ok(rows[0], 'Criteria updated')
  } catch (err) {
    console.error('[PUT /user/job-criteria] Error:', err)
    return serverError('Failed to update job criteria')
  }
})

// ── DELETE: soft-delete (mark inactive) ──
export const DELETE = withAuth(async (req, ctx, currentUser) => {
  try {
    const userId = currentUser?.user_id ?? currentUser?.id ?? null
    const { searchParams } = new URL(req.url)
    const criteriaId       = parseInt(searchParams.get('id'), 10)

    if (!criteriaId || isNaN(criteriaId)) {
      return badRequest('?id=<criteria_id> is required')
    }

    const rows = await pgQuery(
      `UPDATE user_job_criteria
       SET is_active = false, updated_at = NOW()
       WHERE id = $1 AND user_id::text = $2::text
       RETURNING id`,
      [criteriaId, userId]
    )

    if (!rows || rows.length === 0) return notFound('Criteria not found')

    return ok(null, 'Criteria deleted')
  } catch (err) {
    console.error('[DELETE /user/job-criteria] Error:', err)
    return serverError('Failed to delete criteria')
  }
})
