// ============================================================
// lib/apiResponse.js — Standard API response helper
// ExamUdaan | Mirrors AiTEK's httpResponse pattern
//
// Response shape: { status, success, data, message? }
// ============================================================

import { NextResponse } from 'next/server'

/**
 * Standard success response
 * Mirrors AiTEK: res.status(status).json({ status, success, data, jwt_token })
 *
 * @param {any}    data    — payload to return
 * @param {number} status  — HTTP status code (default 200)
 * @param {string} message — optional message string
 */
export function success(data, status = 200, message = null) {
  return NextResponse.json(
    { status, success: true, data, ...(message && { message }) },
    { status }
  )
}

/**
 * Standard error response
 *
 * @param {string} message — human-readable error description
 * @param {number} status  — HTTP status code (default 500)
 * @param {any}    errors  — optional validation errors array
 */
export function error(message, status = 500, errors = null) {
  return NextResponse.json(
    { status, success: false, data: null, message, ...(errors && { errors }) },
    { status }
  )
}

// Shorthand helpers — match AiTEK's common status codes
export const ok          = (data, msg)    => success(data, 200, msg)
export const created     = (data, msg)    => success(data, 201, msg)
export const badRequest  = (msg, errs)    => error(msg, 400, errs)
export const unauthorized= (msg = 'Unauthorized — provide a valid token') => error(msg, 401)
export const forbidden   = (msg = 'Forbidden — insufficient permissions') => error(msg, 403)
export const notFound    = (msg = 'Resource not found') => error(msg, 404)
export const unprocessable = (msg, errs) => error(msg, 422, errs)
export const serverError = (msg = 'Internal server error') => error(msg, 500)
export const serviceUnavailable = (msg = 'Service not available') => error(msg, 503)
