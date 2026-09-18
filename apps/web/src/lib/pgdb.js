// ============================================================
// lib/pgdb.js — Direct PostgreSQL client for Next.js
// ExamUdaan | Uses the same DB_* env vars as the scraper
//
// Reads connection from:
//   DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
//
// Falls back gracefully when env vars are missing so the dev
// server still starts — API routes guard against null pool.
// ============================================================

// Singleton pool (persists across Next.js hot-reloads in dev)
let _pool = null

async function getPool() {
  // Return cached pool
  if (_pool) return _pool

  // Lazy-load pg
  let PgPool
  try {
    const pg = await import('pg')
    // pg exports differently depending on version — handle both
    PgPool = pg.default?.Pool ?? pg.Pool
  } catch {
    console.warn('[pgdb] pg package not available')
    return null
  }

  const host = process.env.DB_HOST?.trim()
  const port = parseInt((process.env.DB_PORT || '5432').trim(), 10)
  const database = process.env.DB_DATABASE?.trim()
  const user = process.env.DB_USERNAME?.trim()
  const password = process.env.DB_PASSWORD?.trim()

  if (!host || !database || !user) {
    // DB not configured — return null silently (API routes handle this)
    return null
  }

  try {
    // Use individual config fields (NOT a connection string) so that
    // special characters in passwords (£, #, @, etc.) are passed
    // safely without URL-encoding issues.
    _pool = new PgPool({
      host,
      port,
      database,
      user,
      password,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })

    _pool.on('error', (err) => {
      console.error('[pgdb] Pool error:', err.message)
      // Reset pool so next request tries to reconnect
      _pool = null
    })

    // Eagerly verify the connection works
    const client = await _pool.connect()
    client.release()
    console.log(`[pgdb] Connected to ${host}:${port}/${database} as ${user}`)
  } catch (err) {
    console.error('[pgdb] Connection failed:', err.message)
    _pool = null
    return null
  }

  return _pool
}

// ---- Public helpers ----

/**
 * Run a parameterized query and return all rows.
 * @param {string} sql    — SQL with $1, $2 placeholders
 * @param {any[]}  params — parameter values
 * @returns {Promise<any[]>} — rows array, empty on error or no DB
 */
export async function query(sql, params = []) {
  const pool = await getPool()
  if (!pool) return []
  try {
    const result = await pool.query(sql, params)
    return result.rows
  } catch (err) {
    console.error('[pgdb] Query error:', err.message, '| SQL:', sql.slice(0, 80))
    throw err
  }
}

/**
 * Run a query and return the first row or null.
 */
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params)
  return rows[0] ?? null
}

/**
 * Check if the DB is reachable.
 * @returns {Promise<boolean>}
 */
export async function isConfigured() {
  const pool = await getPool()
  if (!pool) return false
  try {
    await pool.query('SELECT 1')
    return true
  } catch {
    return false
  }
}
