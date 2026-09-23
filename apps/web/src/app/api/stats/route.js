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
import { AI_TOOLS } from '../../../lib/aiToolsData'
import { MOCK_TESTS } from '../../../lib/mockTestsData'
import { SYLLABUS_EXAMS } from '../../../lib/syllabusData'

export const revalidate = 300

const totalAiTools = (AI_TOOLS || []).length
const totalMockTests = (MOCK_TESTS || []).length
const totalSyllabi = (SYLLABUS_EXAMS || []).length
const totalQuestionsInTests = (MOCK_TESTS || []).reduce((acc, t) => acc + (t.questions?.length || 0), 0)

const FALLBACK_STATS = {
  total_jobs:       '700+',
  total_results:    '120+',
  total_boards:     '37+',
  total_vacancies:  '80,000+',
  total_ai_tools:   totalAiTools,
  total_mock_tests: totalMockTests,
  total_syllabi:    totalSyllabi,
  total_questions:  totalQuestionsInTests || 560,
}

export async function GET() {
  try {
    const rows = await pgQuery(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'published')                                  AS total_jobs,
        COUNT(*) FILTER (WHERE status = 'published' AND notification_type = 'result') AS total_results,
        COUNT(DISTINCT organization_id)                                               AS total_boards,
        COALESCE(SUM(total_vacancies), 0)                                             AS total_vacancies
      FROM exam_notifications
    `)

    if (rows && rows.length > 0) {
      const r = rows[0]
      return ok({
        total_jobs:       r.total_jobs ? Number(r.total_jobs).toLocaleString('en-IN') : '700+',
        total_results:    r.total_results ? Number(r.total_results).toLocaleString('en-IN') : '120+',
        total_boards:     r.total_boards ? Number(r.total_boards).toLocaleString('en-IN') : '37+',
        total_vacancies:  r.total_vacancies ? Number(r.total_vacancies).toLocaleString('en-IN') : '80,000+',
        total_ai_tools:   totalAiTools,
        total_mock_tests: totalMockTests,
        total_syllabi:    totalSyllabi,
        total_questions:  totalQuestionsInTests || 560,
      })
    }
  } catch (err) {
    console.warn('[GET /api/stats] pgdb query error:', err.message)
  }

  // Static fallback when DB not yet configured
  return ok(FALLBACK_STATS, 'Using fallback stats with live dynamic tool counts')
}
