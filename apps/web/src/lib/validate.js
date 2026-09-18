// ============================================================
// lib/validate.js — Request validation (mirrors AiTEK's Joi Validator)
// ExamUdaan | Joi schemas for all API endpoints
//
// Usage (in route.js):
//   import { validate, schemas } from '@/lib/validate'
//   const { value, error } = validate(schemas.sendOtp, body)
// ============================================================

import Joi from 'joi'
import { unprocessable } from './apiResponse'
import { checkHash } from './hashVerify.js'

// ---- Validation runner ----
// Mirrors AiTEK's ValidatorMiddleware: validates body+params+query
export function validate(schema, data) {
  const { error, value } = schema.validate(data, {
    abortEarly: false,   // return ALL errors, not just first
    stripUnknown: true,  // remove fields not in schema
    convert: true,       // coerce types (string "1" → number 1)
  })
  return { value, error: error || null }
}

/**
 * withValidation HOC — wraps a route handler with body validation.
 * Mirrors AiTEK's Validator(schema) middleware and checkHash verification.
 *
 * Usage:
 *   export const POST = withValidation(schemas.sendOtp, async (req, ctx) => { ... })
 */
export function withValidation(schema, handler) {
  return async function validationWrapper(req, ctx) {
    try {
      let body = {}

      // Parse body based on content type
      const contentType = req.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        body = await req.json().catch(() => ({}))
      }

      // Merge with URL query params (mirrors AiTEK merging body+params+query)
      const { searchParams } = new URL(req.url)
      const queryParams = Object.fromEntries(searchParams.entries())
      const merged = { ...body, ...queryParams }

      // Signature verification: validate x-verify header (mirrors AiTEK checkHash)
      const method = (req.method || 'GET').toUpperCase()
      const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
      const hasVerifyHeader = Boolean(req.headers.get('x-verify') || req.headers.get('X-Verify'))
      const hasBody = Boolean(body && Object.keys(body).length > 0)

      if (isMutating || hasVerifyHeader || hasBody) {
        const hashErr = checkHash(req, merged)
        if (hashErr) {
          return hashErr
        }
      }

      const { value, error } = validate(schema, merged)

      if (error) {
        const errors = error.details.map(d => ({
          field:   d.path.join('.'),
          message: d.message.replace(/['"]/g, ''),
        }))
        return unprocessable('Validation failed', errors)
      }

      // Attach validated data back to request (AiTEK does req.body = validated)
      req.validatedBody = value

      return handler(req, ctx)
    } catch (err) {
      console.error('[withValidation] Error:', err)
      return unprocessable('Invalid request body')
    }
  }
}

// ============================================================
// SCHEMAS — one per endpoint (mirrors AiTEK's Validators index)
// ============================================================
export const schemas = {

  // Auth: Send OTP to email or phone
  sendOtp: Joi.object({
    identifier: Joi.string().trim().required()
      .messages({ 'string.empty': 'Email or phone number is required' }),
    channel: Joi.string().valid('email', 'sms', 'whatsapp').default('email'),
  }),

  // Auth: Verify OTP
  verifyOtp: Joi.object({
    identifier: Joi.string().trim().required(),
    code:       Joi.string().length(4).pattern(/^\d+$/).required()
      .messages({ 'string.pattern.base': 'OTP must be a 4-digit number' }),
    channel:    Joi.string().valid('email', 'sms', 'whatsapp').default('email'),
  }),

  // Alert subscription
  subscribeAlerts: Joi.object({
    email:        Joi.string().email().trim().lowercase().allow(null),
    phone:        Joi.string().pattern(/^[6-9]\d{9}$/).allow(null)
      .messages({ 'string.pattern.base': 'Enter a valid 10-digit Indian mobile number' }),
    name:         Joi.string().trim().max(100).allow(null),
    boards:       Joi.array().items(Joi.string()).allow(null).default(null),
    post_types:   Joi.array().items(Joi.string().valid('job','result','admit-card','answer-key')).allow(null).default(null),
    states:       Joi.array().items(Joi.string()).allow(null).default(null),
    via_email:    Joi.boolean().default(true),
    via_whatsapp: Joi.boolean().default(false),
    via_sms:      Joi.boolean().default(false),
  }).or('email', 'phone'),  // at least one of email/phone required

  // Posts list / search
  getPosts: Joi.object({
    type:   Joi.string().valid('job','result','admit-card','answer-key','syllabus').allow(null),
    board:  Joi.string().alphanum().lowercase().max(20).allow(null),
    status: Joi.string().valid('active','closed').default('active'),
    page:   Joi.number().integer().min(1).default(1),
    q:      Joi.string().trim().max(200).allow(null, ''),
  }),

  // User profile update — accepts all editable fields
  updateProfile: Joi.object({
    first_name: Joi.string().trim().min(1).max(60).allow(null, ''),
    last_name:  Joi.string().trim().min(1).max(60).allow(null, ''),
    gender:     Joi.string().valid('Male', 'Female', 'Other', 'Prefer not to say').allow(null, ''),
    dob:        Joi.string().isoDate().allow(null, ''),           // YYYY-MM-DD
    state:      Joi.string().trim().max(60).allow(null, ''),
    whatsapp:   Joi.string().pattern(/^[6-9]\d{9}$/).allow(null, ''),
    language:   Joi.string().valid('en', 'hi', 'mr').default('en'),
  }).min(1),  // at least one field required

  // Set password for the first time (OTP/Google users)
  setPassword: Joi.object({
    password:         Joi.string().min(8).max(128).required()
      .messages({ 'string.min': 'Password must be at least 8 characters' }),
    confirm_password: Joi.string().valid(Joi.ref('password')).required()
      .messages({ 'any.only': 'Passwords do not match' }),
  }),

  // Change existing password
  changePassword: Joi.object({
    current_password: Joi.string().required()
      .messages({ 'string.empty': 'Current password is required' }),
    new_password:     Joi.string().min(8).max(128).required()
      .messages({ 'string.min': 'New password must be at least 8 characters' }),
    confirm_password: Joi.string().valid(Joi.ref('new_password')).required()
      .messages({ 'any.only': 'Passwords do not match' }),
  }),

  // Login with email + password
  loginWithPassword: Joi.object({
    email:    Joi.string().email().trim().lowercase().required(),
    password: Joi.string().required(),
  }),

  // Razorpay payment verification
  verifyPayment: Joi.object({
    razorpay_order_id:   Joi.string().required(),
    razorpay_payment_id: Joi.string().required(),
    razorpay_signature:  Joi.string().required(),
    plan:                Joi.string().valid('basic','smart','pro').required(),
  }),

}
