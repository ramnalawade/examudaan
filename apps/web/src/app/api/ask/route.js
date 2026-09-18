// ============================================================
// app/api/ask/route.js — AI Exam Assistant
// ExamUdaan | gemini-1.5-flash + Google Search Grounding + RAG
//
// Features:
//   - gemini-1.5-flash (free tier: 15 RPM / 1M TPM / 1500 RPD)
//   - Smart 2-key rotation: if key1 hits 429, switches to key2
//   - Google Search Grounding: answers cite live govt website data
//   - RAG: injects relevant exam data from PostgreSQL into context
//   - Plan gating: Smart/Pro only (₹49+)
//
// Key config in .env:
//   GEMINI_API_KEY=key1,key2
// ============================================================

import { queryOne } from '../../../lib/pgdb'
import { ok, serverError, unauthorized } from '../../../lib/apiResponse'
import { withAuth } from '../../../lib/auth'

// ---- Key rotation state (in-process, per request shared via module scope) ----
// For a serverless environment this only persists within a single warm instance.
// For persistent rotation across instances, use Redis — but module scope is
// enough for a small deployment.
const _exhausted = new Set()
let _keyIdx = 0

function getNextKey(keys) {
  for (let i = 0; i < keys.length; i++) {
    const idx = (_keyIdx + i) % keys.length
    if (!_exhausted.has(keys[idx])) {
      _keyIdx = idx
      return keys[idx]
    }
  }
  return null  // all exhausted
}

function exhaustKey(key) {
  _exhausted.add(key)
  console.warn(`[ask] Gemini key ...${key.slice(-6)} marked exhausted (429)`)
}

// ---- Generate with retry on 429 ----
async function generateWithRotation(keys, model, contents, systemInstruction) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')

  for (let attempt = 0; attempt < keys.length; attempt++) {
    const apiKey = getNextKey(keys)
    if (!apiKey) throw new Error('All Gemini API keys exhausted')

    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const gemini = genAI.getGenerativeModel({
        model,
        tools: [{ googleSearch: {} }],   // Google Search Grounding
      })
      const result = await gemini.generateContent({ contents, systemInstruction })
      return result
    } catch (err) {
      const msg = String(err?.message || err)
      if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.includes('ResourceExhausted')) {
        exhaustKey(apiKey)
        // Advance to next key and retry
        _keyIdx = (_keyIdx + 1) % keys.length
        console.warn(`[ask] 429 on key ...${apiKey.slice(-6)}, switching to next key`)
        continue
      }
      throw err  // Non-quota error — rethrow
    }
  }
  throw new Error('All keys exhausted after retries')
}

export const POST = withAuth(async (req, ctx, currentUser) => {
  try {
    // 1. Verify user plan via PostgreSQL directly
    const user = await queryOne(
      'SELECT plan FROM users WHERE id = $1 LIMIT 1',
      [currentUser.user_id || currentUser.id]
    )

    if (!user) return unauthorized('User not found')

    if (user.plan === 'free' || user.plan === 'basic') {
      return new Response(
        JSON.stringify({ error: 'This feature requires a Smart or Pro plan. Please upgrade to use the AI Assistant.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 2. Parse request
    const body = await req.json()
    const { prompt, history = [], examSlug } = body

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 3. Load API keys (supports 2+ keys for rotation)
    const keyStr = process.env.GEMINI_API_KEY || ''
    const keys = keyStr.split(/[,;]/).map(k => k.trim()).filter(Boolean)
    if (keys.length === 0) return serverError('AI Assistant not configured')

    // 4. RAG — fetch exam context from PostgreSQL exam_notifications table
    let examContext = ''

    if (examSlug) {
      const notification = await queryOne(
        `SELECT
           en.title, en.advt_no, en.apply_start_date, en.apply_end_date,
           en.exam_date, en.age_limit, en.application_fee,
           en.selection_process, en.notification_pdf, en.application_links,
           o.name AS org_name
         FROM exam_notifications en
         JOIN organizations o ON o.id = en.organization_id
         WHERE en.slug = $1
         LIMIT 1`,
        [examSlug]
      )

      if (notification) {
        const age = notification.age_limit || {}
        const fee = notification.application_fee || {}
        const links = notification.application_links || {}
        examContext = `
--- EXAM CONTEXT (ExamUdaan DB) ---
Exam: ${notification.title}
Organization: ${notification.org_name}
Advt No: ${notification.advt_no || 'N/A'}
Total Vacancies: ${notification.total_vacancies || 'Not announced'}
Apply Start: ${notification.apply_start_date || 'Not announced'}
Last Date to Apply: ${notification.apply_end_date || 'Not announced'}
Exam Date: ${notification.exam_date || 'Not announced'}
Age Limit: ${age.min || '?'}–${age.max || '?'} years${age.obc_relax ? ` (OBC relaxation: ${age.obc_relax} yrs)` : ''}
Application Fee: General ₹${fee.general || '0'}, SC/ST ₹${fee.sc_st || '0'}, Women ₹${fee.women || '0'}
Selection Process: ${notification.selection_process || 'Not specified'}
Notification PDF: ${notification.notification_pdf || 'Not available'}
Apply Online: ${links.apply_online || 'Not available'}
--- END CONTEXT ---
`
      }
    }

    // 5. Build system prompt
    const systemPrompt = `You are ExamUdaan AI, a knowledgeable and friendly assistant specializing in Indian government exams (SSC, UPSC, IBPS, RRB, NTA, State PSC, Banking, Teaching, Defence, Maharashtra state exams like MPSC, BMC, Police Bharti).

Your role:
- Answer exam eligibility, syllabus, cut-off, preparation strategy questions clearly
- Use structured formatting (bullet points, tables) when helpful
- Cite official sources when possible (upsc.gov.in, ssc.gov.in, mpsc.gov.in, etc.)
- If you don't know something, say so and direct user to the official website
- Keep answers concise but complete
- You have access to Google Search to find real-time government exam updates

${examContext ? `You have specific information about an exam the user is viewing:\n${examContext}` : ''}`

    // 6. Build conversation history
    const contents = []
    for (const msg of history.slice(-6)) {   // last 6 messages for context window
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      })
    }
    contents.push({ role: 'user', parts: [{ text: prompt }] })

    // 7. Generate with gemini-1.5-flash + key rotation on 429
    const result = await generateWithRotation(
      keys,
      'gemini-1.5-flash',
      contents,
      { parts: [{ text: systemPrompt }] }
    )

    const reply = result.response.text()

    // Extract grounding metadata (search queries used) if available
    const groundingMetadata = result.response.candidates?.[0]?.groundingMetadata
    const searchQueries = groundingMetadata?.webSearchQueries || []

    return ok({
      reply,
      searchQueries,
      hasGrounding: searchQueries.length > 0,
    })

  } catch (err) {
    const msg = String(err?.message || err)
    if (msg.includes('All Gemini API keys exhausted') || msg.includes('exhausted')) {
      return serverError('AI service temporarily unavailable — all API quotas exceeded. Please try again later.')
    }
    console.error('[POST /api/ask] Error:', err)
    return serverError('Failed to process request')
  }
})
