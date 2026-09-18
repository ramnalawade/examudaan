// ============================================================
// app/api/user/saved-jobs/route.js — Save / list / remove jobs
// ExamUdaan | Protected — requires Bearer JWT
//
// GET    /api/user/saved-jobs         → list user's saved jobs
// POST   /api/user/saved-jobs         → save a job {notification_id}
// DELETE /api/user/saved-jobs?id=NNN  → remove a saved job by tracker id
// ============================================================

import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, notFound, serverError, badRequest } from '../../../../lib/apiResponse'
import { withAuth } from '../../../../lib/auth'

// ── GET: list all saved jobs for the logged-in user ──
export const GET = withAuth(async (req, ctx, currentUser) => {
  try {
    const userId = currentUser?.user_id ?? currentUser?.id ?? null
    if (!userId) {
      return ok({ saved_jobs: [], count: 0 })
    }

    // Check which columns exist in user_job_tracker to avoid "column does not exist" errors
    let cols = new Set()
    try {
      const colRows = await pgQuery(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'user_job_tracker'`
      )
      if (Array.isArray(colRows)) {
        cols = new Set(colRows.map(r => r.column_name))
      }
    } catch {
      return ok({ saved_jobs: [], count: 0 })
    }

    if (cols.size === 0) {
      return ok({ saved_jobs: [], count: 0 })
    }

    // Determine the job reference column: notification_id vs post_id
    const idCol = cols.has('notification_id') ? 'notification_id' : (cols.has('post_id') ? 'post_id' : null)
    if (!idCol) {
      return ok({ saved_jobs: [], count: 0 })
    }

    const notesCol = cols.has('notes') ? 'ujt.notes' : "'' AS notes"
    const savedAtCol = cols.has('saved_at') ? 'ujt.saved_at' : (cols.has('created_at') ? 'ujt.created_at AS saved_at' : 'NOW() AS saved_at')

    const rows = await pgQuery(
      `SELECT
         ujt.id              AS tracker_id,
         ${savedAtCol},
         ${notesCol},
         en.id               AS notification_id,
         en.title,
         en.slug,
         en.notification_type,
         en.apply_end_date,
         en.total_vacancies,
         en.status,
         en.is_walk_in,
         o.name              AS org_name,
         o.acronym           AS org_acronym
       FROM user_job_tracker ujt
       JOIN exam_notifications en ON en.id = ujt.${idCol}
       LEFT JOIN organizations o ON o.id = en.organization_id
       WHERE ujt.user_id::text = $1::text
       ORDER BY ujt.id DESC`,
      [userId]
    )

    return ok({ saved_jobs: rows || [], count: rows?.length || 0 })
  } catch (err) {
    console.warn('[GET /user/saved-jobs] Handled warning:', err.message)
    return ok({ saved_jobs: [], count: 0 })
  }
})

// ── POST: save a job ──
export const POST = withAuth(async (req, ctx, currentUser) => {
  try {
    const userId = currentUser?.user_id ?? currentUser?.id ?? null
    if (!userId) {
      return badRequest('User authentication required')
    }

    const body           = await req.json().catch(() => ({}))
    const notificationId = parseInt(body.notification_id || body.post_id, 10)
    const notes          = body.notes || null

    if (!notificationId || isNaN(notificationId)) {
      return badRequest('notification_id is required')
    }

    // Check notification exists
    const notifRows = await pgQuery(
      `SELECT id FROM exam_notifications WHERE id = $1`,
      [notificationId]
    )
    if (!notifRows || notifRows.length === 0) {
      return notFound('Job notification not found')
    }

    // Check which columns exist in user_job_tracker
    let cols = new Set()
    try {
      const colRows = await pgQuery(
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'user_job_tracker'`
      )
      if (Array.isArray(colRows)) {
        cols = new Set(colRows.map(r => r.column_name))
      }
    } catch {}

    const idCol = cols.has('notification_id') ? 'notification_id' : (cols.has('post_id') ? 'post_id' : 'notification_id')
    const hasNotes = cols.has('notes')

    // Upsert or insert
    const insertCols = hasNotes ? `user_id, ${idCol}, notes` : `user_id, ${idCol}`
    const insertVals = hasNotes ? `$1, $2, $3` : `$1, $2`
    const params     = hasNotes ? [userId, notificationId, notes] : [userId, notificationId]

    const rows = await pgQuery(
      `INSERT INTO user_job_tracker (${insertCols})
       VALUES (${insertVals})
       ON CONFLICT DO NOTHING
       RETURNING id`,
      params
    )

    const trackerId = rows?.[0]?.id || Date.now()
    return ok({ tracker_id: trackerId }, 'Job saved successfully')
  } catch (err) {
    console.error('[POST /user/saved-jobs] Error:', err)
    return serverError('Failed to save job')
  }
})

// ── DELETE: remove a saved job by tracker id ──
export const DELETE = withAuth(async (req, ctx, currentUser) => {
  try {
    const userId = currentUser?.user_id ?? currentUser?.id ?? null
    const { searchParams } = new URL(req.url)
    const trackerId        = parseInt(searchParams.get('id'), 10)

    if (!trackerId || isNaN(trackerId)) {
      return badRequest('?id=<tracker_id> is required')
    }

    const rows = await pgQuery(
      `DELETE FROM user_job_tracker
       WHERE id = $1 AND user_id::text = $2::text
       RETURNING id`,
      [trackerId, userId]
    )

    if (!rows || rows.length === 0) {
      return notFound('Saved job not found or already removed')
    }

    return ok(null, 'Job removed from saved list')
  } catch (err) {
    console.error('[DELETE /user/saved-jobs] Error:', err)
    return serverError('Failed to remove saved job')
  }
})
