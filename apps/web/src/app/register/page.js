// ============================================================
// app/register/page.js — New User Registration
// ExamUdaan | OTP-based — no passwords needed.
// A user registers by entering name + email/phone, then verifying OTP.
// Backend auto-creates user on first successful OTP verification.
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiFetch } from '../../lib/apiClient'

export default function RegisterPage() {
  const router = useRouter()

  const [tab, setTab]         = useState('email') // 'email' | 'phone'
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [otp, setOtp]         = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

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

  // --- Step 2: Verify OTP → auto-register + login ---
  async function handleVerifyOtp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await apiFetch('/api/auth/verify-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ identifier, channel, otp, name, register: true }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Invalid OTP. Please try again.')
        return
      }

      // Store JWT tokens in localStorage
      if (data.data?.access_token) {
        localStorage.setItem('eu_access_token',  data.data.access_token)
        localStorage.setItem('eu_refresh_token', data.data.refresh_token || '')
        localStorage.setItem('eu_user',          JSON.stringify(data.data.user || {}))
      }

      setSuccess('Account created! Redirecting to your dashboard...')
      setTimeout(() => router.push('/dashboard'), 1200)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
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
              Create your free account in seconds.
            </p>
          </div>

          {/* Benefits */}
          <div style={{ zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: 'notifications_active', text: 'Personalised job alerts' },
              { icon: 'bookmark',             text: 'Save jobs & track deadlines' },
              { icon: 'auto_awesome',         text: 'AI eligibility matching' },
              { icon: 'lock',                 text: 'No password needed — OTP login' },
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

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--on-surface)', margin: 0 }}>
              Create Your Account
            </h1>
            <p style={{ fontSize: 15, color: 'var(--secondary)', marginTop: 4 }}>
              Free forever. No spam. Instant job alerts.
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

          {/* Tab selector */}
          <div className="tab-bar">
            <button
              className={`tab-btn${tab === 'email' ? ' active' : ''}`}
              onClick={() => { setTab('email'); setOtpSent(false); setError('') }}
              id="reg-tab-email"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>mail</span>
              Email
            </button>
            <button
              className={`tab-btn${tab === 'phone' ? ' active' : ''}`}
              onClick={() => { setTab('phone'); setOtpSent(false); setError('') }}
              id="reg-tab-phone"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>phone</span>
              Phone (OTP)
            </button>
          </div>

          {/* Registration Form */}
          <form
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
          >
            {/* Name — only show before OTP is sent */}
            {!otpSent && (
              <div className="input-group">
                <label className="input-label" htmlFor="reg-name-input">Full Name</label>
                <input
                  id="reg-name-input"
                  className="form-input"
                  type="text"
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Email or Phone */}
            {!otpSent && tab === 'email' && (
              <div className="input-group">
                <label className="input-label" htmlFor="reg-email-input">Email Address</label>
                <input
                  id="reg-email-input"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {!otpSent && tab === 'phone' && (
              <div className="input-group">
                <label className="input-label" htmlFor="reg-phone-input">Mobile Number</label>
                <div className="phone-input-wrap">
                  <span className="phone-prefix">+91</span>
                  <input
                    id="reg-phone-input"
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

            {/* OTP Input — shown after send */}
            {otpSent && (
              <div className="input-group">
                <label className="input-label" htmlFor="reg-otp-input">
                  Enter OTP sent to {identifier}
                </label>
                <input
                  id="reg-otp-input"
                  className="form-input"
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  autoFocus
                  required
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
              id="reg-submit-btn"
            >
              {loading ? (
                <>Loading...</>
              ) : otpSent ? (
                <>
                  Verify & Create Account
                  <span className="material-symbols-outlined">check_circle</span>
                </>
              ) : (
                <>
                  Send OTP
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">OR SIGN UP WITH</span>
          </div>

          {/* Google Sign-Up */}
          <a
            href="/api/auth/google"
            className="social-btn"
            id="google-register-btn"
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

          {/* Login link */}
          <p style={{ textAlign: 'center', fontSize: 15, color: 'var(--secondary)', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
