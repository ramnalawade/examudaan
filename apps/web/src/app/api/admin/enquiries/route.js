// ============================================================
// app/api/admin/enquiries/route.js — Academy Enquiries API (Admin Only)
// GET → returns all academy_enquiries rows
// ============================================================

import { NextResponse }       from 'next/server'
import { query }              from '../../../../lib/pgdb'
import { verifyAccessToken }  from '../../../../lib/auth'

// Extract and verify admin user from Bearer token
function getAdminUser(request) {
  const auth    = request.headers.get('authorization') || ''
  const token   = auth.replace(/^Bearer\s+/i, '').trim()
  if (!token) return null
  const decoded = verifyAccessToken(token)
  return decoded?.data || null
}

export async function GET(request) {
  try {
    const user = getAdminUser(request)
    if (!user || (!user.is_admin && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure the academy_enquiries table exists (inline, no migration file needed)
    await query(`
      CREATE TABLE IF NOT EXISTS academy_enquiries (
        id         BIGSERIAL PRIMARY KEY,
        name       TEXT NOT NULL,
        phone      TEXT NOT NULL,
        course     TEXT,
        background TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const rows = await query(
      `SELECT id, name, phone, course, background, created_at
       FROM academy_enquiries
       ORDER BY created_at DESC
       LIMIT 200`
    )

    return NextResponse.json({ enquiries: rows.rows || [] })
  } catch (err) {
    console.error('[admin/enquiries]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
