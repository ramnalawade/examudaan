-- ============================================================
-- Migration: Create resume_versions table
-- Run this on your PostgreSQL DB once before deploying.
-- ============================================================

CREATE TABLE IF NOT EXISTS resume_versions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL,
  name         TEXT        NOT NULL DEFAULT 'My Resume',
  template     TEXT        NOT NULL DEFAULT 'modern',
  color        TEXT        NOT NULL DEFAULT '#EA580C',
  data         JSONB       NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast per-user lookup
CREATE INDEX IF NOT EXISTS idx_resume_versions_user_id ON resume_versions(user_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resume_versions_updated_at
  BEFORE UPDATE ON resume_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
