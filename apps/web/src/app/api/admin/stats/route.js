// ============================================================
// app/api/admin/stats/route.js — Admin Dashboard Stats (from PostgreSQL)
// ============================================================

import { NextResponse } from 'next/server'
import { query }        from '../../../../lib/pgdb'
import { withAuth }     from '../../../../lib/auth'

export const GET = withAuth(async (request, ctx, user) => {
  try {
    // Parallel queries against PostgreSQL
    const [
      userRows,
      alertRows,
      paymentRows,
      scraperRows,
      notifRows,
    ] = await Promise.all([
      query(`SELECT COUNT(*) AS total FROM users`),
      query(`SELECT COUNT(*) AS total FROM alert_subscriptions WHERE is_active = true`),
      query(`
        SELECT id, email, amount, plan, status, created_at AS date
        FROM payments
        ORDER BY created_at DESC
        LIMIT 5
      `),
      query(`
        SELECT source_id, started_at, finished_at, records_added, records_updated, errors
        FROM scrape_log
        ORDER BY started_at DESC
        LIMIT 5
      `),
      query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'published') AS published,
          COUNT(*) FILTER (WHERE status = 'closed')    AS closed,
          COALESCE(SUM(total_vacancies), 0)            AS total_vacancies,
          COUNT(DISTINCT organization_id)              AS orgs
        FROM exam_notifications
      `),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalUsers:      parseInt(userRows[0]?.total   || '0', 10),
        activeAlerts:    parseInt(alertRows[0]?.total  || '0', 10),
        notifications: {
          published:       parseInt(notifRows[0]?.published || '0', 10),
          closed:          parseInt(notifRows[0]?.closed    || '0', 10),
          total_vacancies: parseInt(notifRows[0]?.total_vacancies || '0', 10),
          orgs:            parseInt(notifRows[0]?.orgs      || '0', 10),
        },
        recentPayments:  paymentRows  || [],
        scraperStatus:   scraperRows  || [],
      },
    })

  } catch (err) {
    console.error('[admin/stats] error:', err.message)
    return NextResponse.json(
      { success: false, message: 'Server error', error: err.message },
      { status: 500 }
    )
  }
})
