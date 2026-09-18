// ============================================================
// app/api/auth/google/route.js — Initiate Google OAuth 2.0 flow
// ExamUdaan | Redirects user to Google's consent screen
//
// GET /api/auth/google
//   → builds Google OAuth URL with scopes
//   → redirects user to Google
//   → Google redirects to /api/auth/google/callback with ?code=
// ============================================================

import { NextResponse } from 'next/server'

export async function GET() {
  const clientId    = process.env.GOOGLE_CLIENT_ID
  const rawSiteUrl  = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
  const siteUrl     = (rawSiteUrl && !rawSiteUrl.includes('localhost')) ? rawSiteUrl : 'https://examudaan.in'
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ||
                      `${siteUrl}/api/auth/google/callback`

  // If Google OAuth is not yet configured, show a helpful message
  if (!clientId || clientId.trim() === '') {
    return NextResponse.json(
      { error: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID in .env' },
      { status: 503 }
    )
  }

  // Build the Google OAuth consent URL
  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: 'code',
    // Request email + profile — minimum scopes needed
    scope:         'openid email profile',
    access_type:   'offline',
    prompt:        'select_account',   // Always show account picker
  })

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  return NextResponse.redirect(googleAuthUrl)
}
