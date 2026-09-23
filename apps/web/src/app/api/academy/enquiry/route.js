// ============================================================
// app/api/academy/enquiry/route.js — Academy Lead Capture API
// POST → saves name, phone, course, background to academy_enquiries
// No auth required (anyone can enquire)
// ============================================================

import { NextResponse } from 'next/server'
import { query }        from '../../../../lib/pgdb'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, phone, course, background } = body

    // Basic validation
    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    // Ensure the table exists (inline CREATE IF NOT EXISTS — idempotent)
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

    // Insert the new lead
    await query(
      `INSERT INTO academy_enquiries (name, phone, course, background)
       VALUES ($1, $2, $3, $4)`,
      [
        name.trim().substring(0, 200),
        phone.trim().substring(0, 20),
        (course  || 'track2_jobs').substring(0, 100),
        (background || 'student').substring(0, 100),
      ]
    )

    return NextResponse.json({ ok: true, message: 'Enquiry submitted successfully' })
  } catch (err) {
    console.error('[academy/enquiry]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
