-- =================================================================
-- 011_exam_prep_tables.sql — Phase 2: Exam Prep Hub DB schema
-- ExamUdaan.in — Run on production PostgreSQL after deploying Phase 2
-- Created: 2026-09-22
-- =================================================================

-- ── Current Affairs table ──────────────────────────────────────
-- Phase 1: data comes from currentAffairsData.js static file
-- Phase 2: scraper will feed this table from PIB/PRS India RSS
CREATE TABLE IF NOT EXISTS current_affairs (
  id          SERIAL PRIMARY KEY,
  date        DATE NOT NULL,
  title       TEXT NOT NULL,
  summary     TEXT,
  category    TEXT CHECK (category IN ('National', 'International', 'Economy', 'Science & Tech', 'Maharashtra', 'Sports', 'Environment')),
  exam_tags   TEXT[] DEFAULT '{}',   -- e.g. ['MPSC', 'UPSC', 'Banking']
  source_url  TEXT,
  source_name TEXT,
  youtube_query TEXT,               -- keyword to match relevant YouTube video
  slug        TEXT UNIQUE,          -- SEO-friendly URL slug
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_current_affairs_date ON current_affairs(date DESC);
CREATE INDEX IF NOT EXISTS idx_current_affairs_category ON current_affairs(category);
CREATE INDEX IF NOT EXISTS idx_current_affairs_exam_tags ON current_affairs USING GIN(exam_tags);

-- ── Mock Tests table ───────────────────────────────────────────
-- Phase 1: data comes from mockTestsData.js static file
-- Phase 2: admin UI will allow creating tests via DB
CREATE TABLE IF NOT EXISTS mock_tests (
  id               SERIAL PRIMARY KEY,
  slug             TEXT UNIQUE NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  exam_type        TEXT NOT NULL,   -- MPSC | UPSC | IBPS | SSC | Banking | Police
  topic            TEXT,
  difficulty       TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  duration_minutes INT NOT NULL DEFAULT 20,
  total_questions  INT NOT NULL,
  marks_per_question NUMERIC(4,2) DEFAULT 1,
  negative_mark    NUMERIC(4,2) DEFAULT 0,
  youtube_query    TEXT,
  is_published     BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ── Questions table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id              SERIAL PRIMARY KEY,
  test_id         INT NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
  question_text   TEXT NOT NULL,
  options         JSONB NOT NULL,   -- { "A": "...", "B": "...", "C": "...", "D": "..." }
  correct_option  CHAR(1) NOT NULL CHECK (correct_option IN ('A','B','C','D')),
  explanation     TEXT,
  source_year     INT,
  difficulty      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_test_id ON questions(test_id);

-- ── User Test Attempts (future: save scores per user) ──────────
-- Not active in Phase 2 — for Phase 3 (user dashboard)
CREATE TABLE IF NOT EXISTS test_attempts (
  id              SERIAL PRIMARY KEY,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  test_id         INT NOT NULL REFERENCES mock_tests(id),
  answers         JSONB NOT NULL,   -- { "1": "A", "2": "C", ... }
  score           NUMERIC(5,2),
  percent         NUMERIC(5,2),
  correct_count   INT,
  wrong_count     INT,
  skipped_count   INT,
  time_taken_sec  INT,
  completed_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test ON test_attempts(test_id);

-- =================================================================
-- HOW TO RUN:
--   psql -h $DB_HOST -U $DB_USERNAME -d $DB_DATABASE -f 011_exam_prep_tables.sql
-- =================================================================
