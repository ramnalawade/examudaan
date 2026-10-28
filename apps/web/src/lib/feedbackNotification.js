// ============================================================
// lib/feedbackNotification.js — Aspirant Feedback Resolution Notification
// ExamUdaan | Brevo Transactional Email & WhatsApp Deep-Links
// ============================================================

/**
 * Send an official resolution email to candidate via Brevo API
 * @param {Object} params
 * @param {string} params.email - Candidate email
 * @param {string} [params.name] - Candidate name
 * @param {string} params.ticketId - Reference ID (e.g. FDB-MVQKY32J-5554)
 * @param {string} [params.subject] - User's original subject
 * @param {string} params.resolutionNotes - Admin remarks / solution
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export async function sendFeedbackResolutionEmail({
  email,
  name = 'Aspirant',
  ticketId,
  subject = 'Government Exam Portal Query',
  resolutionNotes = 'Your request has been addressed by our engineering desk.',
}) {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'support@examudaan.in'
  const senderName = process.env.BREVO_SENDER_NAME || 'ExamUdaan Review Desk'

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Invalid recipient email' }
  }

  if (!apiKey) {
    console.warn('[FeedbackNotification] BREVO_API_KEY missing in environment. Logging resolution email instead:', {
      to: email,
      ticketId,
      resolutionNotes,
    })
    return { success: true, bypassed: true }
  }

  const safeName = (typeof name === 'string' && name.trim()) ? name.trim() : 'Candidate'
  const safeSubject = (typeof subject === 'string' && subject.trim()) ? subject.trim() : 'Your Feedback Query'

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>ExamUdaan Query Resolved</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFFBF5; margin: 0; padding: 24px; color: #1E293B; }
        .card { max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
        .header { background: #EA580C; padding: 28px 24px; text-align: center; color: #FFFFFF; }
        .header h1 { margin: 0 0 6px; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }
        .header p { margin: 0; font-size: 14px; opacity: 0.95; }
        .content { padding: 28px 24px; }
        .ticket-badge { display: inline-block; background: #FFF7ED; border: 1px solid #FFEDD5; color: #EA580C; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 9999px; margin-bottom: 16px; }
        .box { background: #F8FAFC; border-left: 4px solid #10B981; border-radius: 6px; padding: 16px; margin: 20px 0; font-size: 14px; line-height: 1.6; color: #334155; }
        .cta-btn { display: inline-block; background: #EA580C; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; margin-top: 12px; }
        .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748B; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>ExamUdaan.in</h1>
          <p>Official Government Recruitment & Study Aggregator</p>
        </div>
        <div class="content">
          <div class="ticket-badge">Ticket: ${ticketId}</div>
          <p style="font-size: 16px; font-weight: 600; margin: 0 0 12px;">Namaskar ${safeName},</p>
          <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            Thank you for bringing your suggestion / feedback to our attention regarding:
            <br>
            <strong style="color: #0F172A;">"${safeSubject}"</strong>
          </p>
          <p style="font-size: 14px; font-weight: 700; color: #0F172A; margin: 0 0 4px;">Desk Resolution & Updates:</p>
          <div class="box">
            ${resolutionNotes.replace(/\n/g, '<br>')}
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            You can verify live exam gazettes, syllabi, and solved previous papers directly on the portal anytime.
          </p>
          <div style="text-align: center; margin: 24px 0 8px;">
            <a href="https://examudaan.in" class="cta-btn" target="_blank" rel="noopener noreferrer">
              Open ExamUdaan Portal ↗
            </a>
          </div>
        </div>
        <div class="footer">
          ExamUdaan.in — Free government exam notifications & PYQ study workspace.<br>
          This is an automated resolution dispatch for Ticket ID: ${ticketId}.
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email, name: safeName }],
        subject: `[Resolved] Update on your ExamUdaan Ticket: ${ticketId}`,
        htmlContent,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error('[FeedbackNotification] Brevo API error:', res.status, errBody)
      return { success: false, error: `Brevo dispatch failed: ${res.status}` }
    }

    const data = await res.json()
    console.log(`[FeedbackNotification] Resolution email sent to ${email} for ticket ${ticketId}`)
    return { success: true, messageId: data.messageId }
  } catch (err) {
    console.error('[FeedbackNotification] Network exception in Brevo call:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Generate a pre-filled WhatsApp Web link for mobile contacts
 * @param {Object} params
 * @param {string} params.phone - Contact phone number
 * @param {string} params.ticketId - Reference ID
 * @param {string} [params.subject] - User subject
 * @param {string} params.resolutionNotes - Resolution notes
 * @returns {string|null} - WhatsApp URL or null if invalid phone
 */
export function getWhatsAppNotificationUrl({ phone, ticketId, subject = '', resolutionNotes = '' }) {
  if (!phone) return null
  const cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.length < 10) return null

  // Ensure country code (default India 91)
  const fullPhone = cleaned.length === 10 ? `91${cleaned}` : cleaned

  const message = [
    `Namaskar from ExamUdaan.in 🙏`,
    ``,
    `Your query/feedback has been resolved!`,
    `📌 Ticket ID: ${ticketId}`,
    subject ? `📝 Subject: ${subject}` : null,
    ``,
    `✅ Resolution:`,
    `${resolutionNotes}`,
    ``,
    `Visit portal: https://examudaan.in`,
  ].filter(Boolean).join('\n')

  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`
}
