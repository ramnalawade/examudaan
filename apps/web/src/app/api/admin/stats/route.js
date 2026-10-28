// ============================================================
// app/api/admin/stats/route.js — Site Statistics API (Admin Only)
// ExamUdaan | Protected via withAdminAuth
// Returns high-level counts for the admin dashboard
// ============================================================

import { NextResponse } from 'next/server'
import { query } from '../../../../lib/pgdb'
import { withAdminAuth } from '../../../../lib/auth'
import { AI_TOOLS } from '../../../../lib/aiToolsData'
import { MOCK_TESTS } from '../../../../lib/mockTestsData'
import { SYLLABUS_EXAMS } from '../../../../lib/syllabusData'

async function getStatsHandler(request, ctx, user) {
  try {
    // Run all stat queries in parallel for speed
    const [jobsRes, usersRes, enquiriesRes, todayRes] = await Promise.all([
      query(`SELECT COUNT(*) AS cnt FROM exam_notifications WHERE status = 'published' AND deleted_at IS NULL`).catch(() => []),
      query(`SELECT COUNT(*) AS cnt FROM users`).catch(() => []),
      query(`SELECT COUNT(*) AS cnt FROM academy_enquiries`).catch(() => []),
      query(`SELECT COUNT(*) AS cnt FROM exam_notifications WHERE DATE(created_at) = CURRENT_DATE`).catch(() => []),
    ])

    return NextResponse.json({
      stats: {
        total_jobs:      parseInt(jobsRes?.[0]?.cnt      || 0, 10),
        total_users:     parseInt(usersRes?.[0]?.cnt     || 0, 10),
        total_enquiries: parseInt(enquiriesRes?.[0]?.cnt || 0, 10),
        jobs_today:      parseInt(todayRes?.[0]?.cnt     || 0, 10),
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

export const GET = withAdminAuth(getStatsHandler)
