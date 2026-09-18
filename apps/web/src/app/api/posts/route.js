// ============================================================
// app/api/posts/route.js — Posts API (reads from exam_notifications via pgdb)
// ExamUdaan | Migrated from Supabase public_jobs view → direct PostgreSQL
//
// GET /api/posts
//   ?type=job|result|admit-card|answer-key
//   ?board=ssc|upsc|rrb                    (maps to org_acronym)
//   ?status=active|closed                  (default: active → published)
//   ?page=1                                (20 per page)
//   ?q=search term
//
// Response: { status, success, data: { posts, total, page, totalPages } }
// ============================================================

import { NextResponse } from 'next/server'
import { query } from '../../../lib/pgdb'
import { ok, serverError } from '../../../lib/apiResponse'
import { withValidation, schemas } from '../../../lib/validate'

const PAGE_SIZE = 20

// Status mapping: old API used 'active'/'closed', new DB uses 'published'/'closed'
const STATUS_MAP = { active: 'published', closed: 'closed' }

async function handler(req) {
  const { type, board, status, page, q } = req.validatedBody
  const offset = (page - 1) * PAGE_SIZE
  const dbStatus = STATUS_MAP[status] || 'published'

  // Map URL param type names → DB notification_type values
  const TYPE_MAP = {
    'job':        'recruitment',
    'result':     'result',
    'admit-card': 'admit_card',
    'answer-key': 'answer_key',
    'syllabus':   'syllabus',
    'correction': 'correction',
  }

  const conditions = [`en.status = $1`]
  const values = [dbStatus]

  if (type && TYPE_MAP[type]) {
    conditions.push(`en.notification_type = $${values.length + 1}`)
    values.push(TYPE_MAP[type])
  }

  if (board) {
    conditions.push(`UPPER(o.acronym) = $${values.length + 1}`)
    values.push(board.toUpperCase())
  }

  if (q) {
    conditions.push(`en.title ILIKE $${values.length + 1}`)
    values.push(`%${q}%`)
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`

  try {
    const countRows = await query(
      `SELECT COUNT(*) AS total
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       ${whereClause}`,
      values
    )
    const count = parseInt(countRows[0]?.total || '0', 10)

    const dataRows = await query(
      `SELECT
         en.id, en.title, en.slug, en.advt_no,
         en.apply_start_date AS application_start,
         en.apply_end_date   AS application_end,
         en.exam_date, 0 AS vacancies,
         en.notification_pdf AS notification_pdf_url,
         en.application_links, en.age_limit, en.application_fee,
         en.selection_process, en.status, en.exam_cities,
         en.source_url, en.published_at, en.created_at,
         o.name    AS org_name,
         o.acronym AS board_slug,
         o.website AS official_website
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       ${whereClause}
       ORDER BY en.published_at DESC NULLS LAST, en.created_at DESC
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, PAGE_SIZE, offset]
    )

    return ok({
      posts: dataRows,
      total: count,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(count / PAGE_SIZE),
    })

  } catch (err) {
    if (!process.env.DB_HOST && !process.env.DATABASE_URL) {
      return ok(
        { posts: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 },
        'Database not configured — set DB_HOST / DATABASE_URL in .env.local'
      )
    }
    console.error('[GET /api/posts] Error:', err.message)
    return serverError('Failed to fetch posts')
  }
}

export const GET = withValidation(schemas.getPosts, handler)
