import { NextResponse } from 'next/server'
import { query } from '../../../../../lib/pgdb'
import { withAuth } from '../../../../../lib/auth'

// ============================================================
// app/api/admin/jobs/[id]/route.js — Admin Job Update
// ============================================================

export const PATCH = withAuth(async (request, { params }, user) => {
  try {
    const { id } = params
    const updates = await request.json()

    // Build SET clause dynamically from the updates object
    // e.g. { title: 'New Title', status: 'active' } → "title = $1, status = $2"
    const keys = Object.keys(updates)
    if (keys.length === 0) {
      return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 })
    }

    const setClauses = keys.map((key, i) => `"${key}" = $${i + 1}`).join(', ')
    const values = keys.map(k => updates[k])
    values.push(id) // id goes last as the WHERE param

    const rows = await query(
      `UPDATE posts SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`,
      values
    )

    const data = rows && rows[0] ? rows[0] : null
    if (!data) {
      return NextResponse.json({ success: false, message: 'Job not found or update failed' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Admin job update error:', error)
    return NextResponse.json({ success: false, message: 'Failed to update job' }, { status: 500 })
  }
})
