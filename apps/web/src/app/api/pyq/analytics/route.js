// ============================================================
// app/api/pyq/analytics/route.js — MPSC PYQ Analytics & Topic Inspector API
// ExamUdaan.in — Aggregated statistics & live question sample queries
// ============================================================

import { ok, badRequest, serverError } from '@/lib/apiResponse'
import { query } from '@/lib/pgdb'
import analyticsData from '@/lib/mpscAnalyticsData.json'
import { withValidation, schemas } from '@/lib/validate'

export const dynamic = 'force-dynamic'

async function pyqAnalyticsHandler(req) {
  try {
    const { searchParams } = new URL(req.url)
    const cadre = searchParams.get('cadre') || 'all'
    const subject = searchParams.get('subject') || 'all'
    const topic = searchParams.get('topic')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '5', 10), 1), 20)

    // Case 1: Topic Question Inspector (Fetch actual past questions for a topic)
    if (topic) {
      try {
        const offset = (page - 1) * limit
        let topicFilter = 'topic = $1'
        let queryParams = [topic, limit, offset]

        if (subject && subject !== 'all') {
          topicFilter += ' AND subject = $4'
          queryParams = [topic, limit, offset, subject]
        }

        const countRes = await query(
          `SELECT count(*) as total FROM pyq_questions WHERE ${subject && subject !== 'all' ? 'topic = $1 AND subject = $2' : 'topic = $1'}`,
          subject && subject !== 'all' ? [topic, subject] : [topic]
        )
        const total = parseInt(countRes[0]?.total || '0', 10)

        const questions = await query(
          `SELECT id, topic, subject, exam, year, question, options, correct, explanation, tags, difficulty
           FROM pyq_questions
           WHERE ${subject && subject !== 'all' ? 'topic = $1 AND subject = $4' : 'topic = $1'}
           ORDER BY year DESC, id DESC
           LIMIT $2 OFFSET $3`,
          queryParams
        )

        return ok({
          topic,
          subject: subject !== 'all' ? subject : null,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          },
          questions
        })
      } catch (dbErr) {
        console.error('[Analytics API] DB topic fetch error, falling back to static hitlist:', dbErr.message)
        const matchingTopic = analyticsData.hitlist.find(h => h.topic.toLowerCase() === topic.toLowerCase())
        return ok({
          topic,
          pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
          questions: matchingTopic?.sample_question ? [matchingTopic.sample_question] : []
        })
      }
    }

    // Case 2: Cadre & Subject Aggregated Data
    const cadreStats = analyticsData.cadreData[cadre] || analyticsData.cadreData.all

    let filteredSubjects = cadreStats.subjects
    let filteredTopTopics = cadreStats.topTopics

    if (subject && subject !== 'all') {
      filteredSubjects = cadreStats.subjects.filter(
        s => s.subject.toLowerCase() === subject.toLowerCase()
      )
      filteredTopTopics = cadreStats.topTopics.filter(
        t => t.subject.toLowerCase() === subject.toLowerCase()
      )
    }

    return ok({
      metadata: analyticsData.metadata,
      selectedCadre: cadre,
      selectedSubject: subject,
      overview: cadreStats.overview,
      subjects: filteredSubjects,
      topTopics: filteredTopTopics,
      yearTrend: cadreStats.yearTrend,
      hitlist: analyticsData.hitlist.filter(h => subject === 'all' || h.subject.toLowerCase() === subject.toLowerCase()).slice(0, 25),
      mhBreakdown: analyticsData.mhBreakdown,
      formatTrends: analyticsData.formatTrends
    })
  } catch (err) {
    console.error('[Analytics API] Global error:', err)
    return serverError('Failed to fetch MPSC analytics')
  }
}

export const GET = withValidation(schemas.pyqAnalytics, pyqAnalyticsHandler)
