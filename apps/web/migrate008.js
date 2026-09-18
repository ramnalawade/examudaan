// migrate008-standalone.js — Run from examudaan/apps/web directory
// Sets env vars directly, then runs migration statements

process.env.DB_HOST     = '10.0.2.160'
process.env.DB_PORT     = '5432'
process.env.DB_USERNAME = 'postgres'
process.env.DB_DATABASE = 'test_n_new'

// Read password from .env.local if needed
const fs = require('fs')
const envLocal = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : ''
const pwMatch = envLocal.match(/DB_PASSWORD\s*=\s*"?([^"\r\n]+)"?/)
if (pwMatch) {
  process.env.DB_PASSWORD = pwMatch[1].replace(/\\$/, '$').replace(/\\\$/g, '$')
} else {
  // fallback from .env
  const envFile = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : ''
  const m = envFile.match(/DB_PASSWORD\s*=\s*"([^"]+)"/)
  if (m) process.env.DB_PASSWORD = m[1].replace(/\\\$/g, '$')
}

const { query } = require('./src/lib/pgdb.js')

const stmts = [
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(128) UNIQUE`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(32) DEFAULT 'otp'`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()`,
  `CREATE TABLE IF NOT EXISTS user_job_criteria (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL DEFAULT 'My Criteria',
    qualifications TEXT[],
    categories TEXT[],
    govt_level VARCHAR(32),
    states TEXT[],
    cities TEXT[],
    reservation_category VARCHAR(20),
    max_age INTEGER,
    min_vacancies INTEGER,
    keywords TEXT,
    alert_email BOOLEAN DEFAULT false,
    alert_whatsapp BOOLEAN DEFAULT false,
    alert_sms BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS user_job_tracker (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_id INTEGER NOT NULL REFERENCES exam_notifications(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    UNIQUE(user_id, notification_id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_user_job_criteria_user ON user_job_criteria(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_user_job_tracker_user ON user_job_tracker(user_id)`,
]

async function run() {
  console.log('DB_PASSWORD length:', (process.env.DB_PASSWORD || '').length)
  for (const s of stmts) {
    try {
      await query(s)
      console.log('OK:', s.split('\n')[0].slice(0, 80))
    } catch (e) {
      console.log('ERR:', e.message.slice(0, 120))
    }
  }
  console.log('Migration complete')
  process.exit(0)
}

run()
