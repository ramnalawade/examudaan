import { NextResponse } from 'next/server'
import { query } from '../../../../lib/pgdb'
import { withAuth } from '../../../../lib/auth'

// ============================================================
// app/api/admin/scrapers/route.js — Admin Scraper Logs
// ============================================================

export const GET = withAuth(async (request, ctx, user) => {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    // Fetch paginated rows and total count in parallel
    const [rows, countRows] = await Promise.all([
      query(
        'SELECT * FROM scraper_logs ORDER BY started_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      ),
      query('SELECT COUNT(*)::int AS total FROM scraper_logs', []),
    ])

    const count = countRows && countRows[0] ? countRows[0].total : 0

    return NextResponse.json({
      success: true,
      data: rows || [],
      count,
    })
  } catch (error) {
    console.error('Admin scraper logs fetch error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
})
