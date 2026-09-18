// ============================================================
// app/auth-success/page.js — OAuth success landing page
// ExamUdaan | Client-side token storage after Google OAuth
//
// After Google OAuth, the callback server-side route can't write
// to localStorage (it's server-side). So we redirect here with
// tokens in URL params, store them in localStorage, then redirect.
// ============================================================

'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthSuccessContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const at = searchParams.get('at')  // access token
    const rt = searchParams.get('rt')  // refresh token
    const u  = searchParams.get('u')   // user JSON

    if (at) {
      try {
        localStorage.setItem('eu_access_token',  at)
        localStorage.setItem('eu_refresh_token', rt || '')
        localStorage.setItem('eu_user',          decodeURIComponent(u || '{}'))
      } catch {
        // localStorage might be unavailable in some browsers
        console.warn('[auth-success] Could not write to localStorage')
      }
    }

    // Clean the URL and redirect to dashboard
    router.replace('/dashboard')
  }, [router, searchParams])

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    }}>
      {/* Spinner */}
      <div style={{
        width: 48,
        height: 48,
        border: '4px solid var(--outline-variant)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: 16, color: 'var(--secondary)', fontWeight: 500 }}>
        Signing you in...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <AuthSuccessContent />
    </Suspense>
  )
}
