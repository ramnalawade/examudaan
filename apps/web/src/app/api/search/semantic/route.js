// ============================================================
// app/api/search/semantic/route.js — AI Semantic Search
// ExamUdaan | Uses Gemini text-embedding-004 + pgvector
//
// GET /api/search/semantic?q=bank job 12th pass&limit=10
//
// Flow:
//   1. Generate embedding for query via Gemini text-embedding-004
//   2. Run cosine similarity SQL directly on exam_notifications
//   3. Return ranked results with similarity scores
//   (fallback: ILIKE keyword search if Gemini key not set)
// ============================================================

import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, serverError } from '../../../../lib/apiResponse'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const q     = searchParams.get('q')?.trim()
  const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 20)

  if (!q || q.length < 3) {
    return ok({ results: [], query: q, mode: 'semantic' })
  }

  let apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return _keywordSearch(q, limit)
  }

  // Support comma/semicolon-separated key list
  const keys = apiKey.split(/[,;]/).map(k => k.trim()).filter(Boolean)
  apiKey = keys[0]

  try {
    // 1. Generate query embedding via Gemini text-embedding-004
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)

    const embeddingResult = await genAI.getGenerativeModel({
      model: 'text-embedding-004',
    }).embedContent({
      content:  { parts: [{ text: q }] },
      taskType: 'RETRIEVAL_QUERY',
    })

    const embedding = embeddingResult.embedding.values
    // Convert to Postgres vector literal: '[0.1, 0.2, ...]'
    const vectorLiteral = `[${embedding.join(',')}]`

    // 2. Cosine similarity search directly via pgvector SQL
    // Requires: pgvector extension + embedding column on exam_notifications
    const rows = await pgQuery(
      `SELECT
         id, title, slug, notification_type, status,
         total_vacancies, apply_end_date, org_name,
         1 - (embedding <=> $1::vector) AS similarity
       FROM exam_notifications
       WHERE status = 'published'
         AND embedding IS NOT NULL
         AND 1 - (embedding <=> $1::vector) >= 0.4
       ORDER BY embedding <=> $1::vector
       LIMIT $2`,
      [vectorLiteral, limit]
    )

    return ok({
      results: rows,
      query:   q,
      mode:    'semantic',
      count:   rows.length,
    })

  } catch (err) {
    const msg = String(err?.message || err)
    if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.includes('ResourceExhausted')) {
      console.warn('[semantic search] Gemini quota exceeded — falling back to keyword search')
      return _keywordSearch(q, limit)
    }
    // pgvector not installed or no embeddings yet — graceful fallback
    if (msg.includes('column') || msg.includes('operator') || msg.includes('vector')) {
      console.warn('[semantic search] pgvector not available — falling back to keyword search')
      return _keywordSearch(q, limit)
    }
    console.error('[semantic search] Error:', err)
    return _keywordSearch(q, limit)
  }
}

// Keyword fallback (ILIKE) when embedding unavailable
async function _keywordSearch(q, limit) {
  try {
    const rows = await pgQuery(
      `SELECT
         en.id, en.title, en.slug, en.notification_type, en.status,
         en.total_vacancies, en.apply_end_date,
         o.name AS org_name,
         NULL::float AS similarity
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       WHERE en.status = 'published'
         AND en.title ILIKE $1
       ORDER BY en.published_at DESC NULLS LAST
       LIMIT $2`,
      [`%${q}%`, limit]
    )

    return ok({
      results: rows,
      query:   q,
      mode:    'keyword',
      count:   rows.length,
    })
  } catch (err) {
    console.error('[keyword search] Error:', err)
    return serverError('Search failed')
  }
}
