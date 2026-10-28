// ============================================================
// app/api/admin/feedback/route.js — Admin Feedback Management API
// ExamUdaan | Protected via withAdminAuth — JWT + admin role check
// ============================================================

import { NextResponse } from 'next/server'
import { query } from '../../../../lib/pgdb'
import { withAdminAuth } from '../../../../lib/auth'

// GET /api/admin/feedback — paginated listing with KPI stats
async function feedbackGetHandler(request, ctx, user) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const category = searchParams.get('category') || ''
    const q = searchParams.get('q')?.trim() || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const offset = (page - 1) * limit

    // 1. KPI Counts
    const statsRes = await query(`
      SELECT 
        COUNT(*)::int AS total,
        COUNT(CASE WHEN status = 'pending' AND (is_spam IS NULL OR is_spam = FALSE) THEN 1 END)::int AS pending,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END)::int AS resolved,
        COUNT(CASE WHEN is_approved = TRUE THEN 1 END)::int AS approved,
        COUNT(CASE WHEN is_spam = TRUE THEN 1 END)::int AS spam
      FROM feedback
    `)
    const stats = (statsRes[0]) || { total: 0, pending: 0, resolved: 0, approved: 0, spam: 0 }

    // 2. Build filtered listing query
    const conditions = []
    const params = []
    let pIdx = 1

    if (status === 'pending') {
      conditions.push(`(status = 'pending' AND (is_spam IS NULL OR is_spam = FALSE))`)
    } else if (status === 'resolved') {
      conditions.push(`status = 'resolved'`)
    } else if (status === 'approved') {
      conditions.push(`is_approved = TRUE`)
    } else if (status === 'spam') {
      conditions.push(`is_spam = TRUE`)
    }

    if (category && category !== 'all') {
      conditions.push(`category = $${pIdx++}`)
      params.push(category)
    }

    if (q) {
      conditions.push(`(
        reference_id ILIKE $${pIdx} OR 
        subject ILIKE $${pIdx} OR 
        description ILIKE $${pIdx} OR 
        name ILIKE $${pIdx} OR 
        contact ILIKE $${pIdx}
      )`)
      params.push(`%${q}%`)
      pIdx++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Count matching rows
    const countSql = `SELECT COUNT(*)::int as count FROM feedback ${whereClause}`
    const countRes = await query(countSql, params)
    const totalMatching = (countRes[0])?.count || 0

    // Fetch page items
    const listSql = `
      SELECT 
        id,
        reference_id,
        category,
        subject,
        description,
        organization,
        source_url,
        name,
        contact,
        rating,
        status,
        metadata,
        is_approved,
        is_spam,
        resolution_notes,
        resolved_at,
        resolved_by,
        admin_notes,
        created_at,
        updated_at
      FROM feedback
      ${whereClause}
      ORDER BY id DESC
      LIMIT $${pIdx} OFFSET $${pIdx + 1}
    `
    const listParams = [...params, limit, offset]
    const listRes = await query(listSql, listParams)

    return NextResponse.json({
      success: true,
      feedback: listRes || [],
      pagination: {
        total: totalMatching,
        page,
        limit,
        totalPages: Math.ceil(totalMatching / limit) || 1,
      },
      stats,
    })
  } catch (err) {
    console.error('[Admin Feedback API GET]', err)
    return NextResponse.json({ error: 'Failed to retrieve feedback list' }, { status: 500 })
  }
}

// Export wrapped with admin auth guard
export const GET = withAdminAuth(feedbackGetHandler)
