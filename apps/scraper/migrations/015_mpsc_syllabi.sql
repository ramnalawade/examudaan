-- =================================================================
-- 015_mpsc_syllabi.sql — MPSC Official Syllabus Documents
-- ExamUdaan.in — Interactive Syllabus Storage & Fast Filtering
-- =================================================================

CREATE TABLE IF NOT EXISTS mpsc_syllabi (
  id                  SERIAL PRIMARY KEY,
  doc_id              INT UNIQUE NOT NULL,            -- e.g. 1181, 10094
  slug                TEXT UNIQUE NOT NULL,           -- e.g. '1181-state-services-main-examination'
  title_en            TEXT NOT NULL,                  -- 'State Services Main Examination'
  title_mr            TEXT,                           -- 'राज्य सेवा मुख्य परीक्षा'
  category            TEXT NOT NULL DEFAULT 'other',  -- rajyaseva | group-b | group-c | engineering | education | medical | agriculture-forest | judicial-legal | departmental | other
  exam_level          TEXT DEFAULT 'State',
  year                INT DEFAULT 2026,
  language            TEXT DEFAULT 'English',         -- English | Marathi | Bilingual
  total_marks         INT DEFAULT 0,
  mains_marks         INT DEFAULT 0,
  interview_marks     INT DEFAULT 0,
  exam_pattern        TEXT,
  total_papers        INT DEFAULT 0,
  pdf_filename        TEXT,                           -- '1181_Slyb_State_Services_...pdf'
  pdf_url             TEXT,
  syllabus_data       JSONB NOT NULL,                 -- Full JSON: { papers: [...], optionalSubjects: [...], importantNotes: [...] }
  is_published        BOOLEAN DEFAULT true,
  view_count          INT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mpsc_syllabi_category ON mpsc_syllabi(category);
CREATE INDEX IF NOT EXISTS idx_mpsc_syllabi_year ON mpsc_syllabi(year DESC);
CREATE INDEX IF NOT EXISTS idx_mpsc_syllabi_data_gin ON mpsc_syllabi USING GIN (syllabus_data);
