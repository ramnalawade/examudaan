// ============================================================
// components/VoiceSearchButton.js
// Voice search using the Web Speech API (Chrome/Edge/Safari).
// Converts speech to text and routes to /search?q=<query>.
//
// Usage:
//   <VoiceSearchButton onResult={(text) => setQuery(text)} />
//   OR with redirect:
//   <VoiceSearchButton redirect />
// ============================================================

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './VoiceSearchButton.module.css'

export default function VoiceSearchButton({
  onResult,
  redirect = false,
  placeholder = 'Speak your exam or job name…',
  size = 'md',
}) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) setSupported(true)
  }, [])

  const handleResult = useCallback((text) => {
    if (onResult) onResult(text)
    if (redirect && text) {
      window.location.href = `/search?q=${encodeURIComponent(text)}`
    }
  }, [onResult, redirect])

  const startListening = useCallback(() => {
    if (!supported) return
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    // Support Marathi/Hindi natively — browser sends Devanagari script
    // Also handles English automatically
    recognition.lang = 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 3

    setListening(true)
    setTranscript('')
    setError(null)

    recognition.onresult = (event) => {
      let interimText = ''
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript
        if (result.isFinal) finalText += text
        else interimText += text
      }
      setTranscript(finalText || interimText)
      if (finalText) handleResult(finalText.trim())
    }

    recognition.onerror = (event) => {
      const msg = event.error === 'not-allowed'
        ? 'Mic access denied. Allow mic in browser settings.'
        : event.error === 'no-speech'
          ? 'No speech detected. Try again.'
          : `Voice error: ${event.error}`
      setError(msg)
      setListening(false)
    }

    recognition.onend = () => setListening(false)
    recognition.start()
  }, [supported, handleResult])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop()
    setListening(false)
  }, [])

  if (!supported) return null

  const sizeClass = size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : styles.md

  return (
    <>
      <button
        type="button"
        className={`${styles.micBtn} ${sizeClass} ${listening ? styles.active : ''}`}
        onClick={listening ? stopListening : startListening}
        aria-label={listening ? 'Stop listening' : 'Search by voice'}
        title="Search by voice (Marathi / Hindi / English)"
        id="voice-search-btn"
      >
        {listening ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.icon}>
            <circle cx="12" cy="12" r="11" className={styles.pulseRing} />
            <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.icon}>
            <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" fill="currentColor" />
            <path d="M19 10a7 7 0 0 1-14 0M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {listening && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Voice search active">
          <div className={styles.overlayCard}>
            <div className={styles.waveGroup}>
              <span className={styles.wave} />
              <span className={styles.wave} />
              <span className={styles.wave} />
              <span className={styles.wave} />
              <span className={styles.wave} />
            </div>
            <p className={styles.listenLabel}>🎤 Listening…</p>
            {transcript
              ? <p className={styles.transcriptText}>"{transcript}"</p>
              : <p className={styles.placeholderText}>{placeholder}</p>
            }
            <p className={styles.langHint}>Speak in Marathi, Hindi or English</p>
            <button type="button" className={styles.stopBtn} onClick={stopListening}>Stop</button>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorToast} role="alert">
          {error}
          <button type="button" onClick={() => setError(null)} className={styles.dismissBtn} aria-label="Dismiss">✕</button>
        </div>
      )}
    </>
  )
}
