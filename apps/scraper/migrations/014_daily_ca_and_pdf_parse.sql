-- ============================================================
-- Migration 014: Daily Current Affairs Summaries Table
--               + PDF Parsed At column for PDF parser tracking
-- ExamUdaan | Session 65
-- Run: python apps/scraper/migrations/run_migration.py apps/scraper/migrations/014_daily_ca_and_pdf_parse.sql
-- ============================================================

-- ── daily_ca_summaries: stores Gemini-generated daily digests ──
CREATE TABLE IF NOT EXISTS daily_ca_summaries (
    id           BIGSERIAL PRIMARY KEY,
    summary_date DATE        NOT NULL,          -- e.g. 2026-10-01
    digest       JSONB       NOT NULL,           -- full structured digest from Gemini
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT daily_ca_summaries_date_unique UNIQUE (summary_date)
);

-- Index for fast date lookups
CREATE INDEX IF NOT EXISTS idx_daily_ca_date ON daily_ca_summaries (summary_date DESC);

-- Comment
COMMENT ON TABLE daily_ca_summaries IS
    'Gemini AI-generated daily current affairs digests. One row per day. '
    'Digest JSON contains: title_en, title_mr, summary_en, summary_mr, sections[], key_terms[], one_liners[]';

-- ── pdf_parsed_at: track which notifications have been PDF-parsed ──
ALTER TABLE exam_notifications
    ADD COLUMN IF NOT EXISTS pdf_parsed_at TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN exam_notifications.pdf_parsed_at IS
    'Timestamp when Gemini Vision PDF parser last processed this notification''s PDF. '
    'NULL = not yet parsed. Allows re-parsing after 7 days.';

-- Index to find unparsed notifications with PDFs
CREATE INDEX IF NOT EXISTS idx_en_pdf_unparsed
    ON exam_notifications (notification_pdf)
    WHERE notification_pdf IS NOT NULL
      AND pdf_parsed_at IS NULL
      AND status = 'published';

-- Also add selection_process column if not exists (needed by PDF parser)
ALTER TABLE exam_notifications
    ADD COLUMN IF NOT EXISTS selection_process JSONB DEFAULT NULL;

COMMENT ON COLUMN exam_notifications.selection_process IS
    'Selection process steps: ["Written Exam", "Physical Test", "Medical", "Document Verification"]';

RAISE NOTICE 'Migration 014 completed: daily_ca_summaries table + pdf_parsed_at + selection_process columns added';
