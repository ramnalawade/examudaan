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
      className="cookie-consent-banner"
    >
      <p className="cookie-consent-text">
        🍪 We use cookies and analytics to improve your experience.{' '}
        <Link href="/privacy" className="cookie-consent-link">Privacy Policy</Link>
        {' · '}
        <Link href="/terms" className="cookie-consent-link">Terms</Link>
      </p>
      <div className="cookie-consent-actions">
        <button
          id="cookie-decline-btn"
          onClick={decline}
          className="cookie-decline-button"
        >Decline</button>
        <button
          id="cookie-accept-btn"
          onClick={accept}
          className="cookie-accept-button"
        >Accept</button>
      </div>
    </div>
  )
}
