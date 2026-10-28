// ============================================================
// app/api/admin/enquiries/route.js — Academy Enquiries API (Admin Only)
// ExamUdaan | Protected via withAdminAuth
// GET → returns all academy_enquiries rows
// ============================================================

import { NextResponse } from 'next/server'
import { query } from '../../../../lib/pgdb'
import { withAdminAuth } from '../../../../lib/auth'

async function getEnquiriesHandler(request, ctx, user) {
  try {
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

    return NextResponse.json({ enquiries: rows || [] })
  } catch (err) {
    console.error('[admin/enquiries]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export const GET = withAdminAuth(getEnquiriesHandler)
