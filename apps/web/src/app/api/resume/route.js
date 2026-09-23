// ============================================================
// app/api/resume/route.js — Resume Version Save/Load API
// Logged-in users can save, list, and delete resume versions.
// Auth: reads JWT from Authorization: Bearer header via withAuth
// ============================================================

import { NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/pgdb'
import { withAuth } from '@/lib/auth'
import { ok, serverError, unauthorized } from '@/lib/apiResponse'

/**
 * GET /api/resume — list all resume versions for the logged-in user
 */
export const GET = withAuth(async (req, ctx, user) => {
  try {
    const rows = await query(
      `SELECT id, name, template, color, data, created_at, updated_at
       FROM resume_versions
       WHERE user_id = $1
       ORDER BY updated_at DESC
       LIMIT 20`,
      [user.id]
    )
    return ok({ resumes: rows })
  } catch (err) {
    console.error('[resume GET]', err)
    return serverError('Failed to load resumes')
  }
})

/**
 * POST /api/resume — save (create or update) a resume version
 * Body: { id?, name, template, color, data }
 *   - If id is provided and belongs to this user → UPDATE
 *   - Otherwise → INSERT (new version)
 */
export const POST = withAuth(async (req, ctx, user) => {
  try {
    const body = await req.json()
    const { id, name, template, color, data } = body

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'data is required' }, { status: 400 })
    }

    const versionName = (name || 'My Resume').slice(0, 80)
    const tmpl = (template || 'modern').slice(0, 30)
    const clr  = (color || '#EA580C').slice(0, 20)

    if (id) {
      // Check ownership before updating
      const existing = await queryOne(
        'SELECT id FROM resume_versions WHERE id = $1 AND user_id = $2',
        [id, user.id]
      )
      if (!existing) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
      }
      const updated = await queryOne(
        `UPDATE resume_versions
         SET name=$1, template=$2, color=$3, data=$4, updated_at=NOW()
         WHERE id=$5 AND user_id=$6
         RETURNING id, name, updated_at`,
        [versionName, tmpl, clr, JSON.stringify(data), id, user.id]
      )
      return ok({ resume: updated, action: 'updated' })
    } else {
      // Check if user already has 10 versions (soft limit)
      const countRow = await queryOne(
        'SELECT COUNT(*) as cnt FROM resume_versions WHERE user_id = $1',
        [user.id]
      )
      if (parseInt(countRow?.cnt || 0) >= 10) {
        return NextResponse.json(
          { error: 'Maximum 10 resume versions allowed. Please delete an old version first.' },
          { status: 400 }
        )
      }
      const created = await queryOne(
        `INSERT INTO resume_versions (user_id, name, template, color, data)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, created_at`,
        [user.id, versionName, tmpl, clr, JSON.stringify(data)]
      )
      return ok({ resume: created, action: 'created' })
    }
  } catch (err) {
    console.error('[resume POST]', err)
    return serverError('Failed to save resume')
  }
})

/**
 * DELETE /api/resume?id={uuid} — delete a resume version
 */
export const DELETE = withAuth(async (req, ctx, user) => {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }
    const deleted = await queryOne(
      'DELETE FROM resume_versions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user.id]
    )
    if (!deleted) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }
    return ok({ deleted: true, id })
  } catch (err) {
    console.error('[resume DELETE]', err)
    return serverError('Failed to delete resume')
  }
})
