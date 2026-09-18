// ============================================================
// components/CookieConsent.js — DPDP Act 2023 Compliance
// Shows a consent banner on first visit.
// Stores choice in localStorage ('examudaan_cookie_consent' = 'yes'|'no').
// Dispatches 'cookieConsent' event so layout.js can load GA.
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const CONSENT_KEY = 'examudaan_cookie_consent'

export default function CookieConsent() {
  // null = not yet checked, 'pending' = showing banner, 'yes'/'no' = decided
  const [consentState, setConsentState] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (stored === 'yes' || stored === 'no') {
      setConsentState(stored)
      // Re-fire event so GA initialises on page load if already accepted
      if (stored === 'yes') {
        window.dispatchEvent(new CustomEvent('cookieConsent', { detail: 'yes' }))
      }
    } else {
      setConsentState('pending')
    }
  }, [])

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'yes')
    setConsentState('yes')
    window.dispatchEvent(new CustomEvent('cookieConsent', { detail: 'yes' }))
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'no')
    setConsentState('no')
  }

  // Only render when pending
  if (consentState !== 'pending') return null

  return (
    <div
      id="cookie-consent-banner"
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#1C1917',
        color: '#F5F5F4',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.25)',
        borderTop: '1px solid #292524',
        fontSize: '14px',
      }}
    >
      <p style={{ margin: 0, lineHeight: 1.5, color: '#D6D3D1', flex: 1, minWidth: '240px' }}>
        🍪 We use cookies and analytics to improve your experience.{' '}
        <Link href="/privacy" style={{ color: '#FB923C', textDecoration: 'underline' }}>Privacy Policy</Link>
        {' · '}
        <Link href="/terms" style={{ color: '#FB923C', textDecoration: 'underline' }}>Terms</Link>
      </p>
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <button
          id="cookie-decline-btn"
          onClick={decline}
          style={{
            padding: '8px 18px', borderRadius: '8px',
            border: '1px solid #57534E', background: 'transparent',
            color: '#A8A29E', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          }}
        >Decline</button>
        <button
          id="cookie-accept-btn"
          onClick={accept}
          style={{
            padding: '8px 20px', borderRadius: '8px',
            border: 'none', background: '#EA580C',
            color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}
        >Accept</button>
      </div>
    </div>
  )
}
