// ============================================================
// app/api/mock-interview/route.js — Executive AI Mock Interview API
// Powered by Google Gemini 1.5 + Commission Prompt Engineering
// Features: Turn evaluation, 120+ variations, Dress/Etiquette coaching,
// Booklist suggestions, and PostgreSQL session tracking for logged-in users.
// ============================================================

import { query, queryOne } from '../../../lib/pgdb'
import { verifyAccessToken } from '../../../lib/auth'
import { INTERVIEW_PANELS, generateQuestionPool } from '../../../lib/mockInterviewQuestions'

// Ensure sessions table exists (idempotent init)
let _tableInitialized = false
async function ensureTable() {
  if (_tableInitialized) return
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS mock_interview_sessions (
        id SERIAL PRIMARY KEY,
        user_id UUID,
        exam_type TEXT NOT NULL,
        candidate_name TEXT,
        mode TEXT DEFAULT 'quick',
        total_questions INT NOT NULL DEFAULT 5,
        score NUMERIC(5,2),
        max_score INT DEFAULT 100,
        verdict TEXT,
        feedback_summary JSONB DEFAULT '{}',
        voice_delivery_tips JSONB DEFAULT '[]',
        dress_etiquette_tips JSONB DEFAULT '[]',
        book_recommendations JSONB DEFAULT '[]',
        transcript JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_mock_sessions_user ON mock_interview_sessions(user_id, created_at DESC);
    `)
    _tableInitialized = true
  } catch (err) {
    console.warn('[mock-interview] DB table init note:', err.message)
  }
}

// Key rotation state for Gemini
const _exhaustedKeys = new Set()
let _keyIndex = 0

function getActiveKey(keys) {
  for (let i = 0; i < keys.length; i++) {
    const idx = (_keyIndex + i) % keys.length
    if (!_exhaustedKeys.has(keys[idx])) {
      _keyIndex = idx
      return keys[idx]
    }
  }
  return null
}

async function callGemini(systemPrompt, userPrompt) {
  const rawKeys = process.env.GEMINI_API_KEY || ''
  const keys = rawKeys.split(',').map(k => k.trim()).filter(Boolean)
  if (keys.length === 0) return null

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    for (let attempt = 0; attempt < keys.length; attempt++) {
      const apiKey = getActiveKey(keys)
      if (!apiKey) break

      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: systemPrompt,
        })
        const result = await model.generateContent(userPrompt)
        return result?.response?.text() || null
      } catch (err) {
        const msg = String(err?.message || err).toLowerCase()
        if (msg.includes('429') || msg.includes('quota') || msg.includes('resourceexhausted')) {
          _exhaustedKeys.add(apiKey)
          _keyIndex = (_keyIndex + 1) % keys.length
          continue
        }
        console.warn('[mock-interview] Gemini non-quota error:', err.message)
        return null
      }
    }
  } catch (err) {
    console.warn('[mock-interview] Gemini load failed:', err.message)
  }
  return null
}

export async function POST(req) {
  await ensureTable()

  try {
    const body = await req.json()
    const {
      action = 'turn',       // 'turn' | 'conclude'
      examType = 'mpsc',
      candidateName = 'Candidate',
      candidateContext = {},
      history = [],
      lastAnswer = '',
      questionCount = 1,
      totalTarget = 5,
      isMarathi = false,
    } = body

    const panel = INTERVIEW_PANELS[examType] || INTERVIEW_PANELS.mpsc

    // Read user auth token if present
    let authUser = null
    const authHeader = req.headers.get('authorization') || ''
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim()
      const decoded = verifyAccessToken(token)
      if (decoded && (decoded.data?.id || decoded.data?.user_id)) {
        authUser = decoded.data
      }
    }

    // ── ACTION: CONCLUDE (Generate Final Executive Dossier) ───────
    if (action === 'conclude') {
      const systemPrompt = `You are the Chairman and Interview Board panel for the ${panel.title_en}.
You are giving a final executive evaluation report to candidate "${candidateName}".
Evaluate the full transcript across 4 axes:
1. Relevance & Precision of thought
2. Administrative & Domain Knowledge
3. Composure, Temperament & Ethics
4. Articulation and STAR framework adherence

Provide actionable guidance on:
- Speech & Voice Delivery (pacing, filler words)
- Dress Code & Boardroom Etiquette
- Critical Mistakes identified in their answers
- Recommended reading books and official gazettes

Respond in clean JSON format:
{
  "score": <number between 40 and ${panel.maxScore}>,
  "maxScore": ${panel.maxScore},
  "verdict": "<Recommended | Borderline | Needs Improvement>",
  "summary": "<2-3 sentence overview of candidate performance>",
  "axisScores": {
    "relevance": <0-10>,
    "domainKnowledge": <0-10>,
    "composure": <0-10>,
    "articulation": <0-10>
  },
  "voiceDeliveryTips": [
    "<specific tip about tone, pacing, or filler words>"
  ],
  "dressEtiquetteTips": [
    "<body language, posture, eye contact or attire tip>"
  ],
  "mistakes": [
    "<specific mistake noticed in candidate answers and how to avoid it>"
  ],
  "recommendedBooks": [
    { "title": "<book title>", "author": "<author>", "reason": "<why read this>" }
  ]
}`

      const userPrompt = `Candidate Name: ${candidateName}
Exam: ${panel.title_en}
Language Preference: ${isMarathi ? 'Marathi + English (bilingual)' : 'English'}
Full Interview Transcript:
${JSON.stringify(history, null, 2)}`

      let dossier = null
      const geminiReply = await callGemini(systemPrompt, userPrompt)

      if (geminiReply) {
        try {
          const jsonMatch = geminiReply.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            dossier = JSON.parse(jsonMatch[0])
          }
        } catch {
          // fallback parsing
        }
      }

      // Robust fallback dossier if Gemini is offline
      if (!dossier) {
        const baseScore = Math.floor(panel.maxScore * 0.72)
        dossier = {
          score: baseScore,
          maxScore: panel.maxScore,
          verdict: baseScore >= panel.passingTarget ? 'Recommended' : 'Borderline',
          summary: isMarathi
            ? `${candidateName}, तुमची मुलाखत प्रभावी झाली. प्रशासकीय जाणीव उत्तम आहे, परंतु अधिक आकडेवारी व सरकारी योजनांचा संदर्भ दिल्यास गुण वाढतील.`
            : `${candidateName}, you demonstrated good administrative clarity and calm composure. Incorporating specific policy data and constitutional provisions will push you into top rank.`,
          axisScores: { relevance: 8, domainKnowledge: 7, composure: 8, articulation: 7 },
          voiceDeliveryTips: [
            isMarathi
              ? 'उत्तराचा वेग मध्यम ठेवा (१२०-१४० शब्द/मिनिट) आणि "basically" किंवा "umm" सारखे शब्द टाळा.'
              : 'Maintain steady pacing (120-140 wpm). Eliminate filler words like "basically", "actually", or repetitive hesitations.',
            isMarathi
              ? 'STAR पद्धत वापरा: आधी परिस्थिती (Situation), नंतर कृती (Action) आणि शेवटी निकाल (Result) सांगा.'
              : 'Use the STAR structure (Situation, Task, Action, Result) for situational questions to keep answers concise.',
          ],
          dressEtiquetteTips: panel.etiquetteTips.slice(0, 3),
          mistakes: [
            isMarathi
              ? 'काही प्रश्नांमध्ये थेट मुद्द्यावर न येता पार्श्वभूमी सांगण्यात वेळ गेला. पहिल्या वाक्यात थेट उत्तर द्या.'
              : 'Initial answers spent too much time on background. Provide the core stance in the very first sentence.',
            isMarathi
              ? 'फॅक्च्युअल डेटा आठवला नाही तर अंदाज लावू नका, प्रामाणिकपणे नकार द्या.'
              : 'Avoid speculative guessing on statutory provisions; saying "I will read up on this" shows intellectual honesty.',
          ],
          recommendedBooks: panel.recommendedBooks.map(b => ({
            title: b.title,
            author: b.author,
            reason: b.topic,
          })),
        }
      }

      // Save session to PostgreSQL if user is logged in
      let savedId = null
      if (authUser?.id || authUser?.user_id) {
        try {
          const uid = authUser.id || authUser.user_id
          const res = await queryOne(`
            INSERT INTO mock_interview_sessions (
              user_id, exam_type, candidate_name, mode, total_questions, score, max_score,
              verdict, feedback_summary, voice_delivery_tips, dress_etiquette_tips, book_recommendations, transcript
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id
          `, [
            uid,
            examType,
            candidateName,
            totalTarget > 5 ? 'full' : 'quick',
            history.length,
            dossier.score,
            dossier.maxScore,
            dossier.verdict,
            JSON.stringify(dossier.axisScores || {}),
            JSON.stringify(dossier.voiceDeliveryTips || []),
            JSON.stringify(dossier.dressEtiquetteTips || []),
            JSON.stringify(dossier.recommendedBooks || []),
            JSON.stringify(history),
          ])
          savedId = res?.id
        } catch (dbErr) {
          console.warn('[mock-interview] Failed to save session:', dbErr.message)
        }
      }

      return new Response(JSON.stringify({
        success: true,
        dossier,
        dressCode: panel.dressCode,
        isSaved: Boolean(savedId),
        sessionId: savedId,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // ── ACTION: TURN (Evaluate last answer & produce next question) ──
    const pool = generateQuestionPool(examType, candidateContext)
    const randomIdx = (questionCount * 7 + Math.floor(Math.random() * 5)) % pool.length
    const nextScenario = pool[randomIdx] || pool[0]

    const systemPrompt = `You are the executive 3-member Interview Board of the ${panel.title_en}.
Board Members:
${panel.boardMembers.join('\n')}

Role Rules:
1. Act as a distinguished, objective, and realistic government commission interview panel.
2. The candidate "${candidateName}" is sitting before you.
3. Review their answer to the previous question and provide immediate brief constructive feedback:
   - Relevance & Depth (Score out of 10)
   - One strength
   - One sharp correction or missing administrative perspective
4. Then present Question ${questionCount + 1} of ${totalTarget}.
5. If language requested is Marathi, formulate the response primarily in crisp Marathi with English terminology in brackets where appropriate.

Format your output:
**Board Feedback:**
• **Score:** X/10
• **Observation:** [1 sentence on precision/depth]
• **Correction:** [1 actionable sentence]

**Question ${questionCount + 1}:** [Your next question]`

    const userPrompt = `Candidate Name: ${candidateName}
Context: Degree in ${candidateContext.degree || 'Engineering/Arts'}, District: ${candidateContext.district || 'Maharashtra'}
Preferred Language: ${isMarathi ? 'Marathi' : 'English'}
Question Count: ${questionCount} of ${totalTarget}
Candidate's Latest Answer:
"${lastAnswer}"

Next Topic Focus: ${nextScenario.stageLabel} (${nextScenario.text})`

    let boardReply = await callGemini(systemPrompt, userPrompt)

    if (!boardReply) {
      // Deterministic realistic fallback
      const feedbackPrefix = isMarathi
        ? `**मंडळाचे अभिप्राय (Board Feedback):**\n• **गुण:** ७.५/१०\n• **निरीक्षण:** तुमचे उत्तर योग्य दिशेने आहे, परंतु प्रशासकीय कार्यपद्धती स्पष्ट हवी.\n• **सुधारणा:** कायद्यातील कलम किंवा अधिकृत नियमावलीचा संदर्भ द्या.\n\n`
        : `**Board Feedback:**\n• **Score:** 7.5/10\n• **Observation:** Your answer showed sound intent, but needs greater policy precision.\n• **Correction:** Cite specific legal sections, statistical data, or government initiatives to substantiate your claim.\n\n`

      const questionText = isMarathi
        ? `**प्रश्न ${questionCount + 1}:** ${nextScenario.text}`
        : `**Question ${questionCount + 1}:** ${nextScenario.text}`

      boardReply = `${feedbackPrefix}${questionText}`
    }

    return new Response(JSON.stringify({
      success: true,
      reply: boardReply,
      stageLabel: nextScenario.stageLabel,
      questionNumber: questionCount + 1,
      totalTarget,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('[mock-interview API] Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// GET: Return candidate's past interview session history
export async function GET(req) {
  await ensureTable()

  try {
    const authHeader = req.headers.get('authorization') || ''
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ sessions: [], message: 'Not logged in' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.substring(7).trim()
    const decoded = verifyAccessToken(token)
    const userId = decoded?.data?.id || decoded?.data?.user_id

    if (!userId) {
      return new Response(JSON.stringify({ sessions: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const sessions = await query(`
      SELECT id, exam_type, candidate_name, mode, total_questions, score, max_score,
             verdict, feedback_summary, created_at
      FROM mock_interview_sessions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 15
    `, [userId])

    return new Response(JSON.stringify({ sessions: sessions || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ sessions: [], error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
