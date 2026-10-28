// ============================================================
// components/TurnstileWidget.js — Cloudflare Turnstile CAPTCHA Component
// ExamUdaan | Bot protection & candidate verification
// Zero Inline Styles Policy Compliant
// ============================================================

'use client'

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import styles from './TurnstileWidget.module.css'

const DEFAULT_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAFkIk44JeRTwc3wB'

/**
 * TurnstileWidget component
 * @param {Object} props
 * @param {string} [props.action] - Turnstile action identifier (e.g. 'feedback', 'contact', 'alert_subscribe')
 * @param {function} props.onVerify - Callback receiving the verified cf-turnstile-response token string
 * @param {function} [props.onExpire] - Callback when token expires
 * @param {function} [props.onError] - Callback when Turnstile encounters an error
 * @param {string} [props.siteKey] - Override site key
 */
const TurnstileWidget = forwardRef(function TurnstileWidget(
  { action = 'generic', onVerify, onExpire, onError, siteKey = DEFAULT_SITE_KEY },
  ref
) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  const onVerifyRef = useRef(onVerify)
  const onExpireRef = useRef(onExpire)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onVerifyRef.current = onVerify
    onExpireRef.current = onExpire
    onErrorRef.current = onError
  })

  // Expose reset and getResponse methods to parent forms
  useImperativeHandle(ref, () => ({
    reset: () => {
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.reset(widgetIdRef.current)
        } catch (e) {
          console.warn('[Turnstile] Reset failed:', e)
        }
      }
    },
    getResponse: () => {
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current !== null) {
        try {
          return window.turnstile.getResponse(widgetIdRef.current) || ''
        } catch (e) {
          return ''
        }
      }
      return ''
    },
  }))

  // 1. Ensure Cloudflare Turnstile script is loaded
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.turnstile) {
      setIsScriptLoaded(true)
      return
    }

    const existingScript = document.getElementById('cf-turnstile-script')
    if (!existingScript) {
      const script = document.createElement('script')
      script.id = 'cf-turnstile-script'
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.onload = () => setIsScriptLoaded(true)
      script.onerror = () => {
        console.error('[Turnstile] Failed to load Cloudflare Turnstile script')
        onErrorRef.current?.()
      }
      document.head.appendChild(script)
    } else {
      existingScript.addEventListener('load', () => setIsScriptLoaded(true))
    }
  }, [])

  // 2. Render widget when container & script are ready
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || typeof window === 'undefined' || !window.turnstile) {
      return
    }

    // If widget is already mounted, do not duplicate
    if (widgetIdRef.current !== null) {
      return
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: action,
        theme: 'auto',
        callback: (token) => {
          onVerifyRef.current?.(token)
        },
        'expired-callback': () => {
          onExpireRef.current?.()
        },
        'error-callback': (code) => {
          console.warn('[Turnstile] Widget error code:', code)
          onErrorRef.current?.(code)
        },
      })
    } catch (err) {
      console.error('[Turnstile] Render failed:', err)
    }

    return () => {
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch (_) {}
        widgetIdRef.current = null
      }
    }
  }, [isScriptLoaded, siteKey, action])

  return (
    <div className={styles.turnstileContainer}>
      <div ref={containerRef} className={styles.turnstileBox} />
      {!isScriptLoaded && (
        <div className={styles.turnstileLoading}>
          <div className={styles.spinner} />
          <span>Verifying security check...</span>
        </div>
      )}
    </div>
  )
})

export default TurnstileWidget
