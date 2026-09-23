// ============================================================
// app/api/admin/settings/route.js — Site Feature Toggle API
// GET  → returns all site_settings rows
// POST → upserts a key/value toggle (admin only)
// Table: site_settings (key TEXT PK, value TEXT, label TEXT, updated_at TIMESTAMPTZ)
// ============================================================

import { NextResponse }       from 'next/server'
import { query }              from '../../../../lib/pgdb'
import { verifyAccessToken }  from '../../../../lib/auth'

// Extract and verify the Bearer token from the request, returning user or null
function getAdminUser(request) {
  const auth  = request.headers.get('authorization') || ''
  const token = auth.replace(/^Bearer\s+/i, '').trim()
  if (!token) return null
  const decoded = verifyAccessToken(token)
  return decoded?.data || null
}
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
export async function GET(request) {
  try {
    const user = getAdminUser(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureTable()
    const rows = await query('SELECT key, value, label, updated_at FROM site_settings ORDER BY key')

    return NextResponse.json({ settings: rows.rows || [] })
  } catch (err) {
    console.error('[admin/settings GET]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST /api/admin/settings — upsert a single setting
// Body: { key: string, value: string }
export async function POST(request) {
  try {
    const user = getAdminUser(request)
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
