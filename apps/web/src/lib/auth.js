// ============================================================
// lib/auth.js — JWT Auth middleware for Next.js API routes
// ExamUdaan | Mirrors AiTEK's verifyHeader middleware
//
// Usage (in any route.js):
//   import { withAuth } from '@/lib/auth'
//   export const GET = withAuth(async (req, ctx, user) => { ... })
// ============================================================

import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { unauthorized, serverError } from './apiResponse'
import { checkHash } from './hashVerify.js'

const JWT_SECRET          = process.env.JWT_SECRET
const JWT_REFRESH_SECRET  = process.env.JWT_REFRESH_SECRET

// ---- Token generators ----

/**
 * Create a short-lived access token (15 min)
 * Mirrors AiTEK's accessToken()
 */
export function createAccessToken(payload) {
  return jwt.sign({ data: payload }, JWT_SECRET, { expiresIn: '15m' })
}

/**
 * Create a long-lived refresh token (30 days)
 * Mirrors AiTEK's generateRefreshToken()
 */
export function createRefreshToken(payload) {
  return jwt.sign({ data: payload }, JWT_REFRESH_SECRET, { expiresIn: '30d' })
}

/**
 * Verify access token
 * Returns decoded payload or null
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET)
  } catch {
    return null
  }
}

// ---- withAuth HOC ----

/**
 * Higher-order function that protects a Next.js route handler.
 * Mirrors AiTEK's verifyHeader middleware.
 *
 * Flow:
 *   1. Check Authorization header for Bearer token
 *   2. If valid → attach user to request, call handler
 *   3. If expired → check x-refresh-token header
 *   4. If refresh valid → issue new access token in x-jwt-token response header
 *   5. If both invalid → 401
 *
 * @param {Function} handler — async (req, ctx, user) => NextResponse
 * @returns {Function} Next.js route handler
 */
export function withAuth(handler) {
  return async function authWrapper(req, ctx) {
    try {
      const authHeader = req.headers.get('authorization')

      if (!authHeader) {
        return unauthorized('No authorization token provided')
      }

      // Strip "Bearer " prefix if present (AiTEK sends raw token)
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader

      // Try access token first
      const decoded = verifyAccessToken(token)

      // Check signature if mutating method or x-verify header is present
      const method = (req.method || 'GET').toUpperCase()
      const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
      const hasVerifyHeader = Boolean(req.headers.get('x-verify') || req.headers.get('X-Verify'))
      if (isMutating || hasVerifyHeader) {
        let body = {}
        const contentType = req.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          body = await req.clone().json().catch(() => ({}))
        }
        const { searchParams } = new URL(req.url)
        const queryParams = Object.fromEntries(searchParams.entries())
        const merged = { ...body, ...queryParams }
        const hashErr = checkHash(req, merged)
        if (hashErr) {
          return hashErr
        }
      }

      if (decoded) {
        // Token valid — pass user data to handler
        return handler(req, ctx, decoded.data)
      }

      // Access token expired — try refresh token (AiTEK pattern)
      const refreshHeader = req.headers.get('x-refresh-token')

      if (!refreshHeader) {
        return unauthorized('Access token expired — provide x-refresh-token to refresh')
      }

      const refreshDecoded = verifyRefreshToken(refreshHeader)

      if (!refreshDecoded) {
        return unauthorized('Refresh token invalid or expired — please login again')
      }

      // Refresh valid — issue new access token and continue
      const newAccessToken = createAccessToken(refreshDecoded.data)

      // Call handler with user from refresh token
      const response = await handler(req, ctx, refreshDecoded.data)

      // Attach new token to response header (AiTEK's jwt_token header pattern)
      const newResponse = new NextResponse(response.body, {
        status:  response.status,
        headers: response.headers,
      })
      newResponse.headers.set('x-jwt-token', newAccessToken)

      return newResponse

    } catch (err) {
      console.error('[withAuth] Error:', err)
      return serverError('Authentication error')
    }
  }
}

/**
 * Optional auth — doesn't reject, but attaches user if token present.
 * Use for public routes that show extra data when logged in.
 */
export function withOptionalAuth(handler) {
  return async function (req, ctx) {
    let user = null
    const authHeader = req.headers.get('authorization')

    if (authHeader) {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader
      const decoded = verifyAccessToken(token)
      if (decoded) user = decoded.data
    }

    return handler(req, ctx, user)
  }
}
