// ============================================================
// app/api/admin/jobs/route.js — Admin Jobs List (from PostgreSQL)
// ============================================================

import { NextResponse } from 'next/server'
import { query } from '../../../../lib/pgdb'
import { withAuth } from '../../../../lib/auth'

export const GET = withAuth(async (request, ctx, user) => {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    const countRows = await query(`SELECT COUNT(*) AS total FROM exam_notifications`)
    const total = parseInt(countRows[0]?.total || '0', 10)

    const rows = await query(
      `SELECT
         en.id, en.title, en.advt_no, 0 AS vacancies,
         en.apply_end_date AS application_end,
         en.status, en.created_at,
         o.acronym AS board
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       ORDER BY en.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    return NextResponse.json({ success: true, data: rows, count: total })

  } catch (err) {
    console.error('[admin/jobs] error:', err.message)
    return NextResponse.json(
      { success: false, message: 'Server error', error: err.message },
      { status: 500 }
    )
  }
})
