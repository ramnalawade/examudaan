// ============================================================
// app/api/mpsc/solutions/route.js
// ExamUdaan | MPSC Detailed Solutions for Previous Papers API
// ============================================================

import { query } from '@/lib/pgdb'
import { ok, error } from '@/lib/apiResponse'
import { withValidation, schemas } from '@/lib/validate'

export const dynamic = 'force-dynamic'

async function mpscSolutionsHandler(request) {
  try {
    const { searchParams } = new URL(request.url)
    const examParam = searchParams.get('exam') || 'all'
    const yearParam = searchParams.get('year') || 'all'
    const subjectParam = searchParams.get('subject') || 'all'
    const keyStatusParam = searchParams.get('key_status') || 'all'
    const q = (searchParams.get('q') || '').trim()
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(30, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const offset = (page - 1) * limit

    const whereClauses = ['(explanation IS NOT NULL AND length(trim(explanation)) > 10)']
    const params = []

    // 1. Exam filter
    if (examParam !== 'all') {
      params.push(`%${examParam}%`)
      whereClauses.push(`exam ILIKE $${params.length}`)
    }

    // 2. Year filter
    if (yearParam !== 'all') {
      params.push(parseInt(yearParam, 10))
      whereClauses.push(`year = $${params.length}`)
    }

    // 3. Subject filter
    if (subjectParam !== 'all') {
      params.push(`%${subjectParam}%`)
      whereClauses.push(`subject ILIKE $${params.length}`)
    }

    // 4. Key Status filter
    if (keyStatusParam !== 'all') {
      params.push(keyStatusParam)
      whereClauses.push(`COALESCE(key_status, 'final') = $${params.length}`)
    }

    // 5. Search query
    if (q) {
      params.push(`%${q}%`)
      const pIdx = params.length
      whereClauses.push(`(question ILIKE $${pIdx} OR topic ILIKE $${pIdx} OR subject ILIKE $${pIdx} OR explanation ILIKE $${pIdx})`)
    }

    const whereSql = whereClauses.join(' AND ')

    // Fetch total matching count
    const countSql = `SELECT count(*) as total FROM pyq_questions WHERE ${whereSql}`
    const countRes = await query(countSql, params)
    const total = parseInt(countRes[0]?.total || '0', 10)
    const totalPages = Math.ceil(total / limit) || 1

    // Fetch paginated solutions
    const dataSql = `
      SELECT id, exam, year, subject, topic, question, options, correct, 
             explanation, explanation_en, why_others_incorrect, source_reference,
             COALESCE(key_status, 'final') as key_status, difficulty, tags, paper_pdf_name
      FROM pyq_questions
      WHERE ${whereSql}
      ORDER BY 
        (CASE WHEN why_others_incorrect IS NOT NULL THEN 0 ELSE 1 END) ASC,
        year DESC, id ASC
      LIMIT ${limit} OFFSET ${offset}
    `
    const rows = await query(dataSql, params)

    // Fetch high-demand papers catalog for quick filtering
    const papersCatalogSql = `
      SELECT exam, year, count(*) as count
      FROM pyq_questions
      WHERE explanation IS NOT NULL AND length(trim(explanation)) > 10
        AND (exam ILIKE '%State Services%' OR exam ILIKE '%Rajyaseva%' OR exam ILIKE '%Group B%' OR exam ILIKE '%Group C%')
      GROUP BY exam, year
      ORDER BY year DESC, count DESC
      LIMIT 12
    `
    const papersCatalog = await query(papersCatalogSql)

    // Fetch subjects catalog
    const subjectsCatalogSql = `
      SELECT subject, count(*) as count
      FROM pyq_questions
      WHERE explanation IS NOT NULL AND length(trim(explanation)) > 10
      GROUP BY subject
      ORDER BY count DESC
      LIMIT 15
    `
    const subjectsCatalog = await query(subjectsCatalogSql)

    return ok({
      items: rows,
      total,
      page,
      limit,
      totalPages,
      papersCatalog,
      subjectsCatalog,
    })
  } catch (err) {
    console.error('[API /api/mpsc/solutions] Error:', err)
    return error('Detailed Solutions fetch failed: ' + err.message, 500)
  }
}

export const GET = withValidation(schemas.mpscQuery, mpscSolutionsHandler)
