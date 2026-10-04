// ============================================================
// app/api/admin/stats/route.js — Site Statistics API (Admin Only)
// Returns high-level counts for the admin dashboard
// ============================================================

import { NextResponse }       from 'next/server'
import { query }              from '../../../../lib/pgdb'
import { verifyAccessToken }  from '../../../../lib/auth'
import { AI_TOOLS }           from '../../../../lib/aiToolsData'
import { MOCK_TESTS }         from '../../../../lib/mockTestsData'
import { SYLLABUS_EXAMS }     from '../../../../lib/syllabusData'

// Extract and verify admin user from Bearer token
function getAdminUser(request) {
  const auth    = request.headers.get('authorization') || ''
  const token   = auth.replace(/^Bearer\s+/i, '').trim()
  if (!token) return null
  const decoded = verifyAccessToken(token)
  return decoded?.data || null
}

export async function GET(request) {
  try {
    const user = getAdminUser(request)
    if (!user || (!user.is_admin && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Run all stat queries in parallel for speed
    const [jobsRes, usersRes, enquiriesRes, todayRes] = await Promise.all([
      query(`SELECT COUNT(*) AS cnt FROM exam_notifications WHERE status = 'published' AND deleted_at IS NULL`).catch(() => []),
      query(`SELECT COUNT(*) AS cnt FROM users`).catch(() => []),
      query(`SELECT COUNT(*) AS cnt FROM academy_enquiries`).catch(() => []),
      query(`SELECT COUNT(*) AS cnt FROM exam_notifications WHERE DATE(created_at) = CURRENT_DATE`).catch(() => []),
    ])

    return NextResponse.json({
      stats: {
        total_jobs:      parseInt(jobsRes?.[0]?.cnt      || jobsRes?.rows?.[0]?.cnt      || 0),
        total_users:     parseInt(usersRes?.[0]?.cnt     || usersRes?.rows?.[0]?.cnt     || 0),
        total_enquiries: parseInt(enquiriesRes?.[0]?.cnt || enquiriesRes?.rows?.[0]?.cnt || 0),
        jobs_today:      parseInt(todayRes?.[0]?.cnt      || todayRes?.rows?.[0]?.cnt      || 0),
        total_ai_tools:   (AI_TOOLS || []).length,
        total_mock_tests: (MOCK_TESTS || []).length,
        total_syllabi:    (SYLLABUS_EXAMS || []).length,
      },
    })
  } catch (err) {
    console.error('[admin/stats]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
