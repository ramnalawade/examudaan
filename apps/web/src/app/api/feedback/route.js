// ============================================================
// app/api/feedback/route.js — Feedback Submission API
// Accepts user feedback, exam portal requests & bug reports
// Stores submissions directly to PostgreSQL 'feedback' table
// ============================================================

import { ok, badRequest, serverError } from '../../../lib/apiResponse.js'
import { query } from '../../../lib/pgdb.js'
import { checkHash } from '../../../lib/hashVerify.js'
import { verifyTurnstileToken } from '../../../lib/turnstile.js'
import { withValidation, schemas } from '../../../lib/validate.js'

async function postFeedbackHandler(req) {
  try {
    const body = req.validatedBody || (await req.json().catch(() => ({})))

    // Signature verification (mirrors AiTEK checkHash)
    const hashErr = checkHash(req, body)
    if (hashErr) {
      return hashErr
    }

    // Cloudflare Turnstile Bot Verification (action: 'feedback')
    const turnstileToken = body['cf-turnstile-response'] || body.turnstileToken
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null
    const turnstileCheck = await verifyTurnstileToken({
      token: turnstileToken,
      action: 'feedback',
      clientIp,
    })

    if (!turnstileCheck.success) {
      return badRequest(turnstileCheck.reason || 'Bot verification failed. Please try again.')
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
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null
    const metadata = {
      userAgent,
      ip,
      ...(typeof body.metadata === 'object' && body.metadata !== null ? body.metadata : {})
    }

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

export const POST = withValidation(schemas.submitFeedback, postFeedbackHandler)

/**
 * GET /api/feedback
 * 1. ?ticket=FDB-... -> Public ticket status lookup for aspirants
 * 2. ?approved=true  -> Public list of approved community suggestions/reviews
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const ticket = searchParams.get('ticket')?.trim()
    const approved = searchParams.get('approved')

    // 1. Ticket status lookup
    if (ticket) {
      const row = await query(
        `SELECT 
          reference_id,
          category,
          subject,
          description,
          organization,
          rating,
          status,
          resolution_notes,
          resolved_at,
          created_at
         FROM feedback
         WHERE LOWER(reference_id) = LOWER($1)
         LIMIT 1`,
        [ticket]
      )

      const items = Array.isArray(row) ? row : (row?.rows || [])
      if (items.length === 0) {
        return badRequest('No ticket found with this Reference ID. Please verify and try again.')
      }

      const item = items[0]
      return ok({
        ticket: {
          referenceId: item.reference_id,
          category: item.category,
          subject: item.subject,
          description: item.description,
          organization: item.organization,
          rating: item.rating,
          status: item.status || 'pending',
          resolutionNotes: item.resolution_notes || null,
          resolvedAt: item.resolved_at || null,
          createdAt: item.created_at,
        },
      })
    }

    // 2. Approved suggestions for website display
    if (approved === 'true' || approved === '1') {
      const rows = await query(
        `SELECT 
          reference_id,
          category,
          subject,
          description,
          organization,
          rating,
          status,
          resolution_notes,
          resolved_at,
          created_at
         FROM feedback
         WHERE is_approved = TRUE AND (is_spam IS NULL OR is_spam = FALSE)
         ORDER BY id DESC
         LIMIT 20`
      )

      const list = Array.isArray(rows) ? rows : (rows?.rows || [])
      return ok({
        suggestions: list.map((r) => ({
          referenceId: r.reference_id,
          category: r.category,
          subject: r.subject,
          description: r.description,
          organization: r.organization,
          rating: r.rating,
          status: r.status,
          resolutionNotes: r.resolution_notes,
          resolvedAt: r.resolved_at,
          createdAt: r.created_at,
        })),
      })
    }

    return badRequest('Query parameter "ticket" or "approved" is required.')
  } catch (err) {
    console.error('[Feedback API GET error]', err)
    return serverError('Failed to fetch feedback data.')
  }
}


