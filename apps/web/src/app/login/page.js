// ============================================================
// app/login/page.js — Login Page
// ExamUdaan | OTP-based login via Brevo email or SMS + Google OAuth
//
// Flow:
//   1. User enters email or phone → clicks "Send OTP"
//   2. POST /api/auth/send-otp → Brevo sends 6-digit OTP
//   3. User enters OTP → POST /api/auth/verify-otp
//   4. JWT stored in localStorage → redirect to dashboard
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiFetch } from '../../lib/apiClient'

export default function LoginPage() {
  const router = useRouter()

  const [tab, setTab]         = useState('email')  // 'email' | 'phone' | 'password'
  const [password, setPassword] = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [otp, setOtp]         = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('eu_access_token')
    if (token) router.replace('/dashboard')
  }, [router])

  const identifier = tab === 'email' ? email : phone
  const channel    = tab === 'email' ? 'email' : 'sms'

  // --- Step 1: Send OTP ---
  async function handleSendOtp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await apiFetch('/api/auth/send-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ identifier, channel }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to send OTP. Please try again.')
        return
      }

      setOtpSent(true)
      setSuccess(`OTP sent to ${identifier}`)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // --- Step 2: Verify OTP → Login ---
  async function handleVerifyOtp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await apiFetch('/api/auth/verify-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ identifier, channel, otp }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Invalid OTP. Please try again.')
        return
      }

      // Store JWT tokens in localStorage for auth persistence
      if (data.data?.access_token) {
        localStorage.setItem('eu_access_token',  data.data.access_token)
        localStorage.setItem('eu_refresh_token', data.data.refresh_token || '')
        localStorage.setItem('eu_user',          JSON.stringify(data.data.user || {}))
      }

      setSuccess('Logged in! Redirecting...')
      setTimeout(() => router.push('/dashboard'), 800)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }


  // --- Step: Login with email + password ---
  async function handlePasswordLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiFetch('/api/auth/login-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Invalid email or password.')
        return
      }
      if (data.data?.access_token) {
        localStorage.setItem('eu_access_token',  data.data.access_token)
        localStorage.setItem('eu_refresh_token', data.data.refresh_token || '')
        localStorage.setItem('eu_user',          JSON.stringify(data.data.user || {}))
        window.dispatchEvent(new Event('storage'))
      }
      setSuccess('Logged in! Redirecting...')
      setTimeout(() => router.push('/dashboard'), 800)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

    function resetTab(newTab) {
    setTab(newTab)
    setOtpSent(false)
    setOtp('')
    setError('')
    setSuccess('')
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 100px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'var(--background)',
    }}>
      <div className="login-card" style={{ width: '100%', maxWidth: '900px' }}>

        {/* ---- Illustration (desktop left) ---- */}
        <div className="login-illustration">
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle at 20% 30%, #a33900 0%, transparent 50%), radial-gradient(circle at 80% 70%, #686361 0%, transparent 50%)',
          }} />
          <div style={{ zIndex: 1, textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: 72, height: 72,
              background: 'var(--primary)',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: 40, color: '#fff' }}>
                school
              </span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', fontFamily: 'Inter, sans-serif' }}>
              ExamUdaan.in
            </h2>
            <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', marginTop: 8 }}>
              Your gateway to government careers.
            </p>
          </div>

          {/* Feature highlights */}
          <div style={{
            zIndex: 1, width: '100%',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            {[
              { icon: 'notifications_active', text: 'Instant job alerts via WhatsApp' },
              { icon: 'auto_awesome',          text: 'AI-powered eligibility matching' },
              { icon: 'bookmark',              text: 'Save & track unlimited jobs' },
            ].map(({ icon, text }) => (
              <div key={icon} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '10px',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--outline-variant)',
              }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>
                  {icon}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--on-surface)' }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Form Side ---- */}
        <div className="login-form-side">
          {/* Mobile logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px', display: 'none' }} id="mobile-logo">
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>ExamUdaan.in</h1>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--on-surface)' }}>Welcome Back</h2>
            <p style={{ fontSize: 15, color: 'var(--secondary)', marginTop: 4 }}>
              Sign in to access your job alerts and saved profiles.
            </p>
          </div>

          {/* Error / Success banners */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 14 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#16a34a', fontSize: 14 }}>
              {success}
            </div>
          )}

          {/* Tabs */}
          <div className="tab-bar">
            <button
              className={`tab-btn${tab === 'email' ? ' active' : ''}`}
              onClick={() => resetTab('email')}
              id="tab-email-btn"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>
                mail
              </span>
              Email (OTP)
            </button>
            <button
              className={`tab-btn${tab === 'phone' ? ' active' : ''}`}
              onClick={() => resetTab('phone')}
              id="tab-phone-btn"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>
                phone
              </span>
              Phone (OTP)
            </button>
          
            <button
              className={`tab-btn${tab === 'password' ? ' active' : ''}`}
              onClick={() => resetTab('password')}
              id="tab-password-btn"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>
                lock
              </span>
              Password
            </button>
          </div>

          {/* OTP Form — shared for email and phone */}
          {/* OTP Form (email / phone tabs) */}
          {tab !== 'password' && (
          <form
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
          >
            {/* Email input */}
            {tab === 'email' && !otpSent && (
              <div className="input-group">
                <label className="input-label" htmlFor="email-input">Email Address</label>
                <input
                  id="email-input"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Phone input */}
            {tab === 'phone' && !otpSent && (
              <div className="input-group">
                <label className="input-label" htmlFor="phone-input">Mobile Number</label>
                <div className="phone-input-wrap">
                  <span className="phone-prefix">+91</span>
                  <input
                    id="phone-input"
                    className="form-input"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    maxLength={10}
                    required
                  />
                </div>
              </div>
            )}

            {/* OTP input — shown after sending */}
            {otpSent && (
              <div className="input-group">
                <label className="input-label" htmlFor="otp-input">
                  Enter OTP sent to {identifier}
                </label>
                <input
                  id="otp-input"
                  className="form-input"
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  autoFocus
                  style={{ letterSpacing: '0.2em', textAlign: 'center', fontSize: 20 }}
                />
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(''); setError('') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: 13, fontWeight: 600, textAlign: 'left', padding: '4px 0' }}
                >
                  Change {tab === 'email' ? 'email' : 'number'}
                </button>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary btn-primary-lg"
              style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? (
                <>Loading...</>
              ) : otpSent ? (
                <>
                  Verify & Login
                  <span className="material-symbols-outlined">lock_open</span>
                </>
              ) : (
                <>
                  Send OTP
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>
          )}

          {/* Password Login Form */}
          {tab === 'password' && (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handlePasswordLogin}>
              <div className="input-group">
                <label className="input-label" htmlFor="pw-email-input">Email Address</label>
                <input
                  id="pw-email-input"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="pw-password-input">Password</label>
                <input
                  id="pw-password-input"
                  className="form-input"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary btn-primary-lg"
                style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                disabled={loading}
                id="login-password-submit-btn"
              >
                {loading ? <>Loading...</> : <>Sign In <span className="material-symbols-outlined">lock_open</span></>}
              </button>
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--secondary)' }}>
                Don&apos;t have a password yet? Use <button type="button" onClick={() => resetTab('email')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>OTP login</button> then set one in Dashboard → Security.
              </p>
            </form>
          )}

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">OR CONTINUE WITH</span>
          </div>

          {/* Google Sign-In — redirects to Google OAuth flow */}
          <a
            href="/api/auth/google"
            className="social-btn"
            id="google-login-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', width: '100%', padding: '11px 0' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          {/* Sign up link */}
          <p style={{ textAlign: 'center', fontSize: 15, color: 'var(--secondary)', marginTop: '20px' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
