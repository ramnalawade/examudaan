// ============================================================
// app/api/auth/send-otp/route.js — Send OTP for login / register
// ExamUdaan | Direct PostgreSQL via pgdb.js
//
// POST /api/auth/send-otp
//   body: { identifier: "email@x.com" | "9876543210", channel: "email" | "sms" | "whatsapp" }
//   → Generates 6-digit OTP, stores hashed in DB, sends via channel
//
// Email channel: Uses Brevo Transactional Email API (BREVO_API_KEY)
// SMS/WhatsApp:  Uses MSG91 / AiSensy (configured via env)
// ============================================================

import crypto from 'crypto'
import { query as pgQuery } from '../../../../lib/pgdb'
import { ok, badRequest, serverError } from '../../../../lib/apiResponse'
import { withValidation, schemas } from '../../../../lib/validate'
import { generateOTP } from '../../../../lib/helpers'

const OTP_EXPIRY_MINUTES = 10
const MAX_OTP_PER_HOUR   = 5

async function handler(req) {
  const { identifier, channel } = req.validatedBody

  try {
    // --- Rate limiting: max 5 OTPs per hour per identifier ---
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const countRows = await pgQuery(
      `SELECT COUNT(*) AS cnt
       FROM otp_codes
       WHERE identifier = $1
         AND created_at >= $2`,
      [identifier, oneHourAgo]
    )
    const count = parseInt(countRows[0]?.cnt || '0', 10)

    if (count >= MAX_OTP_PER_HOUR) {
      return badRequest('Too many OTP requests. Please wait before trying again.')
    }

    // --- Generate 6-digit OTP ---
    const otp       = generateOTP(6)
    const otpHash   = crypto.createHash('sha256').update(otp).digest('hex')
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString()

    // --- Store hashed OTP in DB ---
    await pgQuery(
      `INSERT INTO otp_codes (identifier, channel, code, expires_at, verified, attempts)
       VALUES ($1, $2, $3, $4, false, 0)`,
      [identifier, channel, otpHash, expiresAt]
    )

    // --- Send OTP via selected channel ---
    if (channel === 'email') {
      await sendEmailOtpBrevo(identifier, otp)
    } else if (channel === 'sms' || channel === 'whatsapp') {
      await sendSmsOtp(identifier, otp, channel)
    }

    return ok(
      { identifier, channel, expires_in: `${OTP_EXPIRY_MINUTES} minutes` },
      `OTP sent to ${identifier} via ${channel}`
    )

  } catch (err) {
    console.error('[send-otp] Error:', err)
    return serverError('Failed to send OTP')
  }
}

// ============================================================
// Brevo Transactional Email OTP sender
// Docs: https://developers.brevo.com/reference/sendtransacemail
// ============================================================
async function sendEmailOtpBrevo(email, otp) {
  const apiKey      = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'alerts@examudaan.in'
  const senderName  = process.env.BREVO_SENDER_NAME  || 'ExamUdaan'

  // Dev fallback — log to console if Brevo not configured
  if (!apiKey || apiKey.startsWith('your-')) {
    console.log(`[DEV] Email OTP for ${email}: ${otp}`)
    return
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method:  'POST',
    headers: {
      'api-key':      apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to:     [{ email }],
      subject: `${otp} — Your ExamUdaan Login OTP`,
      htmlContent: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="utf-8"/></head>
        <body style="margin:0;padding:0;background:#FFFBF5;font-family:Inter,sans-serif">
          <div style="max-width:480px;margin:32px auto;background:#fff;border-radius:12px;border:1px solid #e5e0da;overflow:hidden">

            <!-- Header -->
            <div style="background:#EA580C;padding:20px 28px;display:flex;align-items:center;gap:12px">
              <div style="background:rgba(255,255,255,0.2);border-radius:8px;width:40px;height:40px;display:flex;align-items:center;justify-content:center">
                <span style="font-size:22px">🎓</span>
              </div>
              <div>
                <div style="font-size:18px;font-weight:800;color:#fff">ExamUdaan.in</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.85)">Maharashtra's Smartest Sarkari Portal</div>
              </div>
            </div>

            <!-- Body -->
            <div style="padding:28px">
              <p style="color:#555;font-size:15px;margin:0 0 20px">
                Your one-time password to sign in to ExamUdaan is:
              </p>

              <div style="background:#FFF7ED;border:2px solid #EA580C;border-radius:10px;padding:20px;text-align:center;margin:0 0 24px">
                <div style="font-size:42px;font-weight:800;letter-spacing:14px;color:#EA580C">${otp}</div>
              </div>

              <p style="color:#888;font-size:13px;margin:0 0 6px">
                ⏰ This OTP expires in <strong>10 minutes</strong>.
              </p>
              <p style="color:#888;font-size:13px;margin:0 0 20px">
                🔒 Do not share this code with anyone. ExamUdaan will never ask for your OTP.
              </p>

              <div style="border-top:1px solid #f0ebe5;padding-top:16px">
                <p style="color:#aaa;font-size:12px;margin:0">
                  If you didn't request this OTP, please ignore this email.
                  Your account is safe — no action needed.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background:#f9f6f2;padding:14px 28px;border-top:1px solid #e5e0da">
              <p style="color:#aaa;font-size:11px;margin:0;text-align:center">
                ExamUdaan.in — Not affiliated with any government organization.
                <br/>Maharashtra's free government job aggregator portal.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('[send-otp] Brevo error:', err)
    throw new Error('Email delivery failed via Brevo')
  }

  console.log(`[send-otp] OTP email sent to ${email} via Brevo`)
}

// ============================================================
// SMS / WhatsApp OTP senders (MSG91 / AiSensy)
// ============================================================
async function sendSmsOtp(phone, otp, channel) {
  const authKey = process.env.MSG91_AUTH_KEY

  if (!authKey || authKey.startsWith('your-')) {
    console.log(`[DEV] ${channel} OTP for ${phone}: ${otp}`)
    return
  }

  if (channel === 'sms') {
    await fetch('https://control.msg91.com/api/v5/otp', {
      method:  'POST',
      headers: {
        authkey:        authKey,
        'Content-Type': 'application/json',
        accept:         'application/json',
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile:      `91${phone}`,
        otp,
      }),
    })
  } else if (channel === 'whatsapp') {
    await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey:          process.env.AISENSY_API_KEY,
        campaignName:    process.env.AISENSY_CAMPAIGN_NAME,
        destination:     `91${phone}`,
        userName:        'ExamUdaan User',
        templateParams:  [otp],
      }),
    })
  }
}

export const POST = withValidation(schemas.sendOtp, handler)
