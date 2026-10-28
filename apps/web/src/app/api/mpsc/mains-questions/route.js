// ============================================================
// app/api/mpsc/mains-questions/route.js
// ExamUdaan | MPSC Mains Answer-Writing Practice API
// ============================================================

import { ok, error } from '@/lib/apiResponse'
import { MAINS_QUESTIONS, MAINS_PAPERS } from '@/lib/mainsQuestionsVault'
import { withValidation, schemas } from '@/lib/validate'

export const dynamic = 'force-dynamic'

async function mpscMainsQuestionsHandler(request) {
  try {
    const { searchParams } = new URL(request.url)
    const paper = searchParams.get('paper') || 'all'
    const q = (searchParams.get('q') || '').trim().toLowerCase()
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '6', 10)))

    let filtered = [...MAINS_QUESTIONS]

    // 1. Filter by paper
    if (paper !== 'all') {
      filtered = filtered.filter((item) => item.paper === paper)
    }

    // 2. Filter by search query
    if (q) {
      filtered = filtered.filter((item) => {
        return (
          item.question_mr.toLowerCase().includes(q) ||
          item.question_en.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          item.topic.toLowerCase().includes(q) ||
          item.directive.toLowerCase().includes(q)
        )
      })
    }

    const total = filtered.length
    const totalPages = Math.ceil(total / limit) || 1
    const offset = (page - 1) * limit
    const items = filtered.slice(offset, offset + limit)

    // Calculate paper counts
    const paperCounts = {
      all: MAINS_QUESTIONS.length,
      gs1: MAINS_QUESTIONS.filter((m) => m.paper === 'gs1').length,
      gs2: MAINS_QUESTIONS.filter((m) => m.paper === 'gs2').length,
      gs3: MAINS_QUESTIONS.filter((m) => m.paper === 'gs3').length,
      gs4: MAINS_QUESTIONS.filter((m) => m.paper === 'gs4').length,
      essay: MAINS_QUESTIONS.filter((m) => m.paper === 'essay').length,
    }

    return ok({
      items,
      total,
      page,
      limit,
      totalPages,
      paperCounts,
      papersMetadata: MAINS_PAPERS,
    })
  } catch (err) {
    console.error('[API /api/mpsc/mains-questions] Error:', err)
    return error('Failed to fetch mains questions: ' + err.message, 500)
  }
}

export const GET = withValidation(schemas.mpscQuery, mpscMainsQuestionsHandler)
