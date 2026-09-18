-- ============================================================
-- 002_enrich_schema.sql
-- Adds richer job fields to exam_notifications and organizations
-- Run once: psql -h HOST -U USER -d DB -f 002_enrich_schema.sql
-- ============================================================

-- ---- exam_notifications: new columns ----
ALTER TABLE exam_notifications
  ADD COLUMN IF NOT EXISTS employment_type       TEXT,
  ADD COLUMN IF NOT EXISTS duration              TEXT,
  ADD COLUMN IF NOT EXISTS salary                JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS qualifications        JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS application_email     TEXT,
  ADD COLUMN IF NOT EXISTS advertisement_details JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS application_details   JSONB DEFAULT '{}';

-- ---- organizations: enrich with contact/hierarchy ----
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS department  TEXT,
  ADD COLUMN IF NOT EXISTS parent_org  TEXT,
  ADD COLUMN IF NOT EXISTS address     TEXT,
  ADD COLUMN IF NOT EXISTS phone       TEXT;

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'exam_notifications'
  AND column_name IN ('employment_type','duration','salary','qualifications',
                      'application_email','advertisement_details','application_details')
ORDER BY column_name;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'organizations'
  AND column_name IN ('department','parent_org','address','phone')
ORDER BY column_name;
