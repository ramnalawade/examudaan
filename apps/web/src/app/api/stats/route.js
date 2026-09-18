// ============================================================
// app/api/stats/route.js — Site statistics (public)
// ExamUdaan | Direct PostgreSQL via pgdb.js
//
// GET /api/stats
//   → Returns live counts for homepage hero section
//   Response: { total_jobs, total_results, total_boards, total_vacancies }
//
// Next.js ISR — revalidate every 5 minutes
// ============================================================

import { query as pgQuery } from '../../../lib/pgdb'
import { ok } from '../../../lib/apiResponse'

export const revalidate = 300

const FALLBACK_STATS = {
  total_jobs:      '50,000+',
  total_results:   '12,000+',
  total_boards:    '10',
  total_vacancies: '2,00,000+',
}

export async function GET() {
  try {
    const rows = await pgQuery(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'published')                              AS total_jobs,
        COUNT(*) FILTER (WHERE status = 'published' AND notification_type = 'result') AS total_results,
        COUNT(DISTINCT organization_id)                                           AS total_boards,
        COALESCE(SUM(total_vacancies), 0)                                         AS total_vacancies
      FROM exam_notifications
    `)

    if (rows.length > 0) {
      const r = rows[0]
      return ok({
        total_jobs:      r.total_jobs?.toString()      || '0',
        total_results:   r.total_results?.toString()   || '0',
        total_boards:    r.total_boards?.toString()    || '0',
        total_vacancies: r.total_vacancies?.toString() || '0',
      })
    }
  } catch (err) {
    console.warn('[GET /api/stats] pgdb query error:', err.message)
  }

  // Static fallback when DB not yet configured
  return ok(FALLBACK_STATS, 'Using static fallback stats — configure DB_HOST in .env.local')
}
