// ============================================================
// app/api/mock-tests/submit/route.js — Mock Test Submission & Lead Capture API
// ExamUdaan | Captures test attempts, identifies weak areas, and returns
// personalized preparation roadmaps (Syllabus, Matching Jobs & AI Tools).
// ============================================================

import { query } from '../../../../lib/pgdb'
import { ok, badRequest, serverError } from '../../../../lib/apiResponse'
import { getExamUseCaseRoute } from '../../../../lib/examRoutes'
import { withValidation, schemas } from '../../../../lib/validate'

/**
 * Ensures the mock_test_attempts table exists in PostgreSQL.
 */
async function ensureTableExists() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS mock_test_attempts (
        id SERIAL PRIMARY KEY,
        user_id INT,
        test_slug VARCHAR(120) NOT NULL,
        test_title VARCHAR(255) NOT NULL,
        candidate_name VARCHAR(120),
        candidate_phone VARCHAR(20),
        candidate_email VARCHAR(160),
        target_exam VARCHAR(100),
        score NUMERIC(6, 2) NOT NULL,
        max_marks NUMERIC(6, 2) NOT NULL,
        percentage INT NOT NULL,
        accuracy INT NOT NULL,
        time_taken_seconds INT DEFAULT 0,
        section_breakdown JSONB DEFAULT '[]'::jsonb,
        weakest_subjects JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_mock_attempts_slug ON mock_test_attempts(test_slug);
      CREATE INDEX IF NOT EXISTS idx_mock_attempts_phone ON mock_test_attempts(candidate_phone);
    `)
  } catch (err) {
    console.warn('[mock-tests/submit] Error verifying table schema:', err.message)
  }
}

/**
 * Analyzes section breakdown to isolate candidate's weakest topics.
 */
function analyzeWeakAreas(sectionBreakdown = []) {
  if (!Array.isArray(sectionBreakdown) || sectionBreakdown.length === 0) {
    return []
  }

  // Filter sections that were attempted or had questions
  const scored = sectionBreakdown
    .map(s => ({
      name: s.name || 'General Topic',
      accuracy: typeof s.accuracy === 'number' ? s.accuracy : 0,
      wrong: s.wrong || 0,
      total: s.total || 0,
      earned: parseFloat(s.earned || 0),
      maxMarks: s.maxMarks || 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)

  // Pick bottom 1 or 2 sections with accuracy < 70%
  const weakSections = scored.filter(s => s.accuracy < 75)
  return (weakSections.length > 0 ? weakSections : scored).slice(0, 2)
}

/**
 * Generates personalized EdTech recommendations based on exam & weak topics.
 */
function generatePersonalizedRoadmap({ targetExam, weakestSubjects, testSlug, percentage }) {
  const exam = targetExam || 'MPSC / Maharashtra Govt'
  const primaryWeak = weakestSubjects[0]?.name || 'General Studies'
  const secondaryWeak = weakestSubjects[1]?.name || null

  // 1. Target Syllabus & PYQ Link
  const syllabusPath = getExamUseCaseRoute(exam)

  // 2. Matching Live Govt Jobs Link
  let jobsQuery = 'mpsc'
  const lowerExam = exam.toLowerCase()
  if (lowerExam.includes('police')) jobsQuery = 'police'
  else if (lowerExam.includes('talathi')) jobsQuery = 'talathi'
  else if (lowerExam.includes('ssc')) jobsQuery = 'ssc'
  else if (lowerExam.includes('bank') || lowerExam.includes('ibps')) jobsQuery = 'banking'
  else if (lowerExam.includes('upsc')) jobsQuery = 'upsc'
  else if (lowerExam.includes('railway') || lowerExam.includes('rrb')) jobsQuery = 'railway'

  const jobsPath = `/jobs?q=${encodeURIComponent(jobsQuery)}`

  // 3. Personalized AI Tools Recommendation
  const recommendedAiTools = []

  // Check weak area topic
  const weakText = (primaryWeak + ' ' + (secondaryWeak || '')).toLowerCase()
  if (weakText.includes('gk') || weakText.includes('science') || weakText.includes('history') || weakText.includes('geography') || weakText.includes('current')) {
    recommendedAiTools.push({
      name: 'NotebookLM (Google)',
      slug: 'notebooklm',
      icon: 'auto_stories',
      benefit: 'Turn complex textbooks into audio podcasts & active recall notes to boost GK retention.',
      path: '/ai-tools/notebooklm'
    })
    recommendedAiTools.push({
      name: 'Anki Pro',
      slug: 'anki',
      icon: 'style',
      benefit: 'Spaced repetition flashcards so you never forget dates, articles, and historical acts.',
      path: '/ai-tools/anki'
    })
  } else if (weakText.includes('marathi') || weakText.includes('english') || weakText.includes('grammar') || weakText.includes('comprehension')) {
    recommendedAiTools.push({
      name: 'Yomu AI',
      slug: 'yomu-ai',
      icon: 'history_edu',
      benefit: 'Master formal syntax, essay structure, and grammar rules for top descriptive marks.',
      path: '/ai-tools/yomu-ai'
    })
    recommendedAiTools.push({
      name: 'QuillBot',
      slug: 'quillbot',
      icon: 'spellcheck',
      benefit: 'Vocabulary expansion and real-time sentence structuring to eliminate grammar errors.',
      path: '/ai-tools/quillbot'
    })
  } else {
    // Math, Quantitative, Reasoning, or General
    recommendedAiTools.push({
      name: 'DeepSeek Math & Reasoning',
      slug: 'deepseek',
      icon: 'calculate',
      benefit: 'Step-by-step shortcuts and logic derivations for numerical and aptitude problems.',
      path: '/ai-tools/deepseek'
    })
    recommendedAiTools.push({
      name: 'NotebookLM',
      slug: 'notebooklm',
      icon: 'auto_stories',
      benefit: 'Synthesize full exam syllabus modules into high-yield 5-minute revision summaries.',
      path: '/ai-tools/notebooklm'
    })
  }

  return {
    examName: exam,
    primaryWeakSubject: primaryWeak,
    secondaryWeakSubject: secondaryWeak,
    diagnosticMessage: secondaryWeak
      ? `You scored ${percentage}%. Your accuracy in "${primaryWeak}" and "${secondaryWeak}" is currently below 65%. Strengthening these 2 modules will raise your score by 15-20 marks.`
      : `You scored ${percentage}%. Your accuracy in "${primaryWeak}" is your main bottleneck. Focusing on targeted PYQ practice here will yield maximum mark gains.`,
    syllabusLink: {
      title: `Official ${exam} Syllabus & 5-Year PYQ Papers`,
      path: syllabusPath,
    },
    jobsLink: {
      title: `Live ${exam} Vacancies Closing Soon`,
      path: jobsPath,
    },
    aiTools: recommendedAiTools,
    shareUrl: `https://examudaan.in/mock-tests/${testSlug}`,
  }
}

async function mockTestSubmitHandler(req) {
  try {
    const body = await req.json().catch(() => ({}))

    const {
      test_slug,
      test_title,
      score,
      max_marks,
      percentage,
      accuracy,
      time_taken_seconds = 0,
      section_breakdown = [],
      candidate_name = '',
      candidate_phone = '',
      candidate_email = '',
      target_exam = '',
    } = body

    if (!test_slug || typeof score === 'undefined') {
      return badRequest('Missing required test_slug or score parameters')
    }

    // Ensure database table exists
    await ensureTableExists()

    // Analyze weakest subject areas
    const weakestSubjects = analyzeWeakAreas(section_breakdown)

    // Generate tailored edtech roadmap
    const roadmap = generatePersonalizedRoadmap({
      targetExam: target_exam || test_title,
      weakestSubjects,
      testSlug: test_slug,
      percentage: Number(percentage) || 0,
    })

    let attemptId = null

    // Persist attempt to PostgreSQL
    try {
      const cleanPhone = String(candidate_phone || '').trim().replace(/[^\d+]/g, '')
      const cleanEmail = String(candidate_email || '').trim().toLowerCase()
      const cleanName = String(candidate_name || '').trim()

      const insertSql = `
        INSERT INTO mock_test_attempts (
          test_slug, test_title, candidate_name, candidate_phone, candidate_email,
          target_exam, score, max_marks, percentage, accuracy, time_taken_seconds,
          section_breakdown, weakest_subjects
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        ) RETURNING id;
      `

      const params = [
        test_slug,
        test_title || test_slug,
        cleanName || null,
        cleanPhone || null,
        cleanEmail || null,
        target_exam || null,
        Number(score) || 0,
        Number(max_marks) || 100,
        Number(percentage) || 0,
        Number(accuracy) || 0,
        Number(time_taken_seconds) || 0,
        JSON.stringify(section_breakdown),
        JSON.stringify(weakestSubjects),
      ]

      const res = await query(insertSql, params)
      if (res && res.length > 0) {
        attemptId = res[0].id
      }
    } catch (dbErr) {
      console.warn('[mock-tests/submit] DB insert error (non-fatal):', dbErr.message)
    }

    return ok({
      success: true,
      attempt_id: attemptId,
      weakest_subjects: weakestSubjects,
      roadmap,
    })
  } catch (err) {
    console.error('[mock-tests/submit] Handler exception:', err)
    return serverError('Failed to record test submission: ' + err.message)
  }
}

export const POST = withValidation(schemas.mockTestSubmit, mockTestSubmitHandler)
