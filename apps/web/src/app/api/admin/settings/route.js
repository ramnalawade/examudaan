// ============================================================
// app/api/admin/settings/route.js — Site Feature Toggle API
// ExamUdaan | Protected via withAdminAuth
// GET  → returns all site_settings rows
// POST → upserts a key/value toggle (admin only)
// Table: site_settings (key TEXT PK, value TEXT, label TEXT, updated_at TIMESTAMPTZ)
// ============================================================

import { NextResponse } from 'next/server'
import { query } from '../../../../lib/pgdb'
import { withAdminAuth } from '../../../../lib/auth'

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key        TEXT PRIMARY KEY,
      value      TEXT        NOT NULL DEFAULT 'true',
      label      TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

// GET /api/admin/settings — returns all feature toggle key/value pairs
async function getHandler(request, ctx, user) {
  try {
    await ensureTable()
    const rows = await query('SELECT key, value, label, updated_at FROM site_settings ORDER BY key')
    return NextResponse.json({ settings: rows || [] })
  } catch (err) {
    console.error('[admin/settings GET]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST /api/admin/settings — upsert a single setting
// Body: { key: string, value: string }
async function postHandler(request, ctx, user) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || typeof key !== 'string' || value === undefined) {
      return NextResponse.json({ error: 'key and value are required' }, { status: 400 })
    }

    await ensureTable()

    // Upsert: insert or update on conflict
    await query(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
      [key.trim(), String(value)]
    )

    return NextResponse.json({ ok: true, key, value })
  } catch (err) {
    console.error('[admin/settings POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export const GET = withAdminAuth(getHandler)
export const POST = withAdminAuth(postHandler)
