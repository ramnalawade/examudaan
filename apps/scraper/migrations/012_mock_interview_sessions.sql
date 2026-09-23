-- =================================================================
-- 012_mock_interview_sessions.sql — AI Mock Interview Sessions & History
-- ExamUdaan.in — Track candidate interview progress, scores & dossiers
-- =================================================================

CREATE TABLE IF NOT EXISTS mock_interview_sessions (
  id                    SERIAL PRIMARY KEY,
  user_id               UUID REFERENCES users(id) ON DELETE CASCADE,
  exam_type             TEXT NOT NULL,          -- mpsc | upsc | police | talathi | banking | ssc | forest | zp
  candidate_name        TEXT,
  mode                  TEXT DEFAULT 'quick',    -- quick (5) | full (8)
  total_questions       INT NOT NULL DEFAULT 5,
  score                 NUMERIC(5,2),           -- Score out of 100 or 275
  max_score             INT DEFAULT 100,
  verdict               TEXT,                   -- Recommended | Borderline | Needs Improvement
  feedback_summary      JSONB DEFAULT '{}',     -- { relevance, domain, composure, corrections }
  voice_delivery_tips   JSONB DEFAULT '[]',     -- Diction, pacing, filler words analysis
  dress_etiquette_tips  JSONB DEFAULT '[]',     -- Dress code, posture, eye contact advice
  book_recommendations  JSONB DEFAULT '[]',     -- Specific booklist & gazette reports
  transcript            JSONB NOT NULL DEFAULT '[]', -- Full conversation history
  created_at            TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mock_sessions_user ON mock_interview_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mock_sessions_exam ON mock_interview_sessions(exam_type);
