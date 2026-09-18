-- ============================================================
-- 003_notification_type.sql
-- Adds notification_type column to exam_notifications
-- Backfills all existing rows using keyword matching on title
--
-- Types (7):
--   recruitment  — Recruitment, Vacancy, Bharti, Post, Advertisement
--   result       — Result, Merit List, Score Card, Final Result
--   answer_key   — Answer Key, Response Sheet, OMR
--   admit_card   — Admit Card, Hall Ticket, Call Letter, e-Admit
--   syllabus     — Syllabus, Exam Pattern, Curriculum, Study Plan
--   correction   — Corrigendum, Correction, Amendment, Erratum, Modification
--   other        — anything else
--
-- Run once:
--   psql -h DB_HOST -U postgres -d DB_NAME -f 003_notification_type.sql
-- ============================================================

-- STEP 1: Add the column (safe to run multiple times)
ALTER TABLE exam_notifications
  ADD COLUMN IF NOT EXISTS notification_type TEXT NOT NULL DEFAULT 'recruitment';

-- STEP 2: Add index for fast filtering
CREATE INDEX IF NOT EXISTS idx_en_notification_type
  ON exam_notifications(notification_type);

-- Composite index for common query pattern: type + status + published_at
CREATE INDEX IF NOT EXISTS idx_en_type_status_date
  ON exam_notifications(notification_type, status, published_at DESC NULLS LAST);

-- STEP 3: Backfill all existing rows (keyword match priority order)
-- Higher-priority rules run LAST so they overwrite lower-priority matches.
-- Start with 'other', then layer specifics on top.

-- 3a. Default everything to 'other'
UPDATE exam_notifications SET notification_type = 'other';

-- 3b. Recruitment (broad default for job posts)
UPDATE exam_notifications
SET notification_type = 'recruitment'
WHERE
  title ILIKE '%recruitment%'
  OR title ILIKE '%vacancy%'
  OR title ILIKE '%vacancies%'
  OR title ILIKE '%bharti%'
  OR title ILIKE '%notification%'
  OR title ILIKE '%advertisement%'
  OR title ILIKE '%advt%'
  OR title ILIKE '%job%'
  OR title ILIKE '%post%'
  OR title ILIKE '%hiring%'
  OR title ILIKE '%application%'
  OR title ILIKE '%walk-in%'
  OR title ILIKE '%walk in%'
  OR title ILIKE '%walkin%'
  OR title ILIKE '%naukri%'
  OR title ILIKE '%apply%';

-- 3c. Syllabus (before correction — "Syllabus Correction" → correction wins later)
UPDATE exam_notifications
SET notification_type = 'syllabus'
WHERE
  title ILIKE '%syllabus%'
  OR title ILIKE '%exam pattern%'
  OR title ILIKE '%curriculum%'
  OR title ILIKE '%study plan%'
  OR title ILIKE '%paper pattern%';

-- 3d. Admit Card / Hall Ticket
UPDATE exam_notifications
SET notification_type = 'admit_card'
WHERE
  title ILIKE '%admit card%'
  OR title ILIKE '%hall ticket%'
  OR title ILIKE '%call letter%'
  OR title ILIKE '%e-admit%'
  OR title ILIKE '%e admit%'
  OR title ILIKE '%pravesh patra%'
  OR title ILIKE '%interview letter%'
  OR title ILIKE '%interview schedule%';

-- 3e. Answer Key / Response Sheet
UPDATE exam_notifications
SET notification_type = 'answer_key'
WHERE
  title ILIKE '%answer key%'
  OR title ILIKE '%answerkey%'
  OR title ILIKE '%answer sheet%'
  OR title ILIKE '%response sheet%'
  OR title ILIKE '% omr %'
  OR title ILIKE '%provisional key%'
  OR title ILIKE '%final key%'
  OR title ILIKE '%model answer%';

-- 3f. Result / Merit List (higher priority than recruitment so "Result Notification" → result)
UPDATE exam_notifications
SET notification_type = 'result'
WHERE
  title ILIKE '%result%'
  OR title ILIKE '%merit list%'
  OR title ILIKE '%score card%'
  OR title ILIKE '%scorecard%'
  OR title ILIKE '%final result%'
  OR title ILIKE '%provisional result%'
  OR title ILIKE '%selected candidate%'
  OR title ILIKE '%selection list%'
  OR title ILIKE '%wait list%'
  OR title ILIKE '%waitlist%'
  OR title ILIKE '%cut off%'
  OR title ILIKE '%cutoff%';

-- 3g. Correction / Corrigendum (highest priority — overrides all above)
UPDATE exam_notifications
SET notification_type = 'correction'
WHERE
  title ILIKE '%corrigendum%'
  OR title ILIKE '%correction%'
  OR title ILIKE '%amendment%'
  OR title ILIKE '%erratum%'
  OR title ILIKE '%modification%'
  OR title ILIKE '%revised%'
  OR title ILIKE '%addendum%'
  OR title ILIKE '%rectification%';

-- STEP 4: Verify — print breakdown
SELECT
  notification_type,
  COUNT(*)         AS total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS pct
FROM exam_notifications
GROUP BY notification_type
ORDER BY total DESC;

-- STEP 5: Show samples of each type
SELECT notification_type, title
FROM exam_notifications
ORDER BY notification_type, id
LIMIT 30;
