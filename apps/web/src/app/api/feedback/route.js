// ============================================================
// app/api/feedback/route.js — Feedback Submission API
// Accepts user feedback, exam portal requests & bug reports
// Stores submissions directly to PostgreSQL 'feedback' table
// ============================================================

import { ok, badRequest, serverError } from '../../../lib/apiResponse.js'
import { query } from '../../../lib/pgdb.js'
import { checkHash } from '../../../lib/hashVerify.js'

export async function POST(req) {
  try {
    const body = await req.json()

    // Signature verification (mirrors AiTEK checkHash)
    const hashErr = checkHash(req, body)
    if (hashErr) {
      return hashErr
    }
    const {
      category = 'general',
      subject = '',
      description = '',
      organization = '',
      sourceUrl = '',
      name = '',
      contact = '',
      rating = 5,
    } = body

    // 1. Validation
    const trimmedDesc = typeof description === 'string' ? description.trim() : ''
    if (!trimmedDesc) {
      return badRequest('Description is required')
    }

    // 2. Generate unique reference ID
    const referenceId = `FDB-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`

    // Clean & normalize fields
    const safeCategory = typeof category === 'string' && category.trim() ? category.trim() : 'general'
    const safeSubject = typeof subject === 'string' && subject.trim() ? subject.trim() : null
    const safeOrg = typeof organization === 'string' && organization.trim() ? organization.trim() : null
    const safeSourceUrl = typeof sourceUrl === 'string' && sourceUrl.trim() ? sourceUrl.trim() : null
    const safeName = typeof name === 'string' && name.trim() ? name.trim() : null
    const safeContact = typeof contact === 'string' && contact.trim() ? contact.trim() : null
    const numRating = Number.isInteger(Number(rating)) ? Math.min(Math.max(Number(rating), 1), 5) : 5

    // Extract request audit metadata
    const userAgent = req.headers.get('user-agent') || null
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null
    const metadata = { userAgent, ip }

    // 3. Persist to PostgreSQL feedback table
    try {
      await query(
        `INSERT INTO feedback (
          reference_id,
          category,
          subject,
          description,
          organization,
          source_url,
          name,
          contact,
          rating,
          status,
          metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          referenceId,
          safeCategory,
          safeSubject,
          trimmedDesc,
          safeOrg,
          safeSourceUrl,
          safeName,
          safeContact,
          numRating,
          'pending',
          JSON.stringify(metadata),
        ]
      )
    } catch (dbErr) {
      console.error('[Feedback API] DB insert error:', dbErr.message)
      return serverError('Failed to record your feedback in the database. Please try again.')
    }

    // 4. Log for dev & operations visibility
    console.log('[Feedback API] New submission saved to DB:', {
      referenceId,
      category: safeCategory,
      subject: safeSubject,
      organization: safeOrg,
      name: safeName,
      contact: safeContact,
      rating: numRating,
      createdAt: new Date().toISOString(),
    })

    return ok({
      referenceId,
      message: 'Thank you! Your suggestion has been recorded and submitted to the ExamUdaan review desk.',
    })
  } catch (err) {
    console.error('[Feedback API] Error processing feedback:', err)
    return serverError('Failed to process feedback. Please try again.')
  }
}

