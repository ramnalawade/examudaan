// ============================================================
// app/api/auth/google/callback/route.js — Google OAuth callback
// ExamUdaan | Handles Google redirect with ?code= param
//
// Flow:
//   1. Receives ?code= from Google
//   2. Exchanges code for Google access token
//   3. Fetches user profile from Google (email, name, avatar)
//   4. Creates or updates user in DB (upsert by google_id OR email)
//   5. Issues ExamUdaan JWT access + refresh tokens
//   6. Redirects to /auth-success?token=... so the client can store JWT
// ============================================================

import { NextResponse } from 'next/server'
import { query as pgQuery } from '../../../../../lib/pgdb'
import { createAccessToken, createRefreshToken } from '../../../../../lib/auth'

const rawSiteUrl   = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
const SITE_URL     = (rawSiteUrl && !rawSiteUrl.includes('localhost')) ? rawSiteUrl : 'https://examudaan.in'
const CLIENT_ID    = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET= process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI ||
                     `${SITE_URL}/api/auth/google/callback`

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  // User denied access on Google's screen
  if (error || !code) {
    return NextResponse.redirect(`${SITE_URL}/login?error=google_denied`)
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.redirect(`${SITE_URL}/login?error=oauth_not_configured`)
  }

  try {
    // ── Step 1: Exchange code for Google tokens ──
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri:  REDIRECT_URI,
        grant_type:    'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      console.error('[google-cb] Token exchange failed:', await tokenRes.text())
      return NextResponse.redirect(`${SITE_URL}/login?error=token_exchange_failed`)
    }

    const { access_token: googleAccessToken } = await tokenRes.json()

    // ── Step 2: Fetch user profile from Google ──
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    })

    if (!profileRes.ok) {
      return NextResponse.redirect(`${SITE_URL}/login?error=profile_fetch_failed`)
    }

    const profile = await profileRes.json()
    // profile has: sub (google_id), email, name, picture

    // Split Google's single `name` field into first_name / last_name
    const nameParts = (profile.name || '').trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName  = nameParts.slice(1).join(' ') || ''

    // ── Step 3: Upsert user in DB ──
    // Try to find existing user by google_id or email
    const existingRows = await pgQuery(
      `SELECT id, first_name, last_name, email, phone, plan FROM users
       WHERE google_id = $1 OR email = $2
       LIMIT 1`,
      [profile.sub, profile.email]
    )

    let userId
    if (existingRows.length > 0) {
      // Update existing user with latest Google info
      const user = existingRows[0]
      userId = user.id
      await pgQuery(
        `UPDATE users
         SET google_id     = $1,
             avatar_url    = $2,
             first_name    = COALESCE(NULLIF(first_name,''), $3),
             last_name     = COALESCE(NULLIF(last_name,''), $4),
             auth_provider = 'google',
             updated_at    = NOW()
         WHERE id = $5`,
        [profile.sub, profile.picture, firstName, lastName, userId]
      )
    } else {
      // Create new user
      const newRows = await pgQuery(
        `INSERT INTO users (email, first_name, last_name, google_id, avatar_url, auth_provider, plan, created_at)
         VALUES ($1, $2, $3, $4, $5, 'google', 'free', NOW())
         RETURNING id`,
        [profile.email, firstName, lastName, profile.sub, profile.picture]
      )
      userId = newRows[0].id
    }

    // ── Step 4: Issue ExamUdaan JWT tokens ──
    const tokenPayload = {
      user_id:    userId,
      email:      profile.email,
      first_name: firstName,
      last_name:  lastName,
    }
    const accessToken  = createAccessToken(tokenPayload)
    const refreshToken = createRefreshToken(tokenPayload)

    const userJson = encodeURIComponent(JSON.stringify({
      id:         userId,
      email:      profile.email,
      first_name: firstName,
      last_name:  lastName,
      avatar_url: profile.picture,
    }))

    // ── Step 5: Redirect to /auth-success — client stores tokens ──
    // Pass tokens as URL params — auth-success page stores them in localStorage
    const successUrl = `${SITE_URL}/auth-success?at=${encodeURIComponent(accessToken)}&rt=${encodeURIComponent(refreshToken)}&u=${userJson}`
    return NextResponse.redirect(successUrl)

  } catch (err) {
    console.error('[google-cb] Error:', err)
    return NextResponse.redirect(`${SITE_URL}/login?error=server_error`)
  }
}
