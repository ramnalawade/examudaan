'use client'
// ============================================================
// components/HindiToggle.js — Hindi/English description toggle
// ExamUdaan | AI-powered bilingual content
// ============================================================

import { useState } from 'react'

export default function HindiToggle({ descriptionEn, descriptionHi }) {
  const [isHindi, setIsHindi] = useState(false)

  if (!descriptionEn && !descriptionHi) return null

  const text = isHindi ? descriptionHi : descriptionEn

  return (
    <div>
      {/* Language toggle button — only show if Hindi is available */}
      {descriptionHi && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Language:</span>
          <div style={{
            display: 'flex',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <button
              id="lang-toggle-en"
              onClick={() => setIsHindi(false)}
              style={{
                padding: '4px 14px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: !isHindi ? 'var(--accent)' : 'transparent',
                color: !isHindi ? 'white' : 'var(--text-body)',
                transition: 'all 0.2s',
              }}
            >
              English
            </button>
            <button
              id="lang-toggle-hi"
              onClick={() => setIsHindi(true)}
              style={{
                padding: '4px 14px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: isHindi ? 'var(--accent)' : 'transparent',
                color: isHindi ? 'white' : 'var(--text-body)',
                transition: 'all 0.2s',
              }}
            >
              हिंदी
            </button>
          </div>
          {isHindi && (
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-light)',
              color: 'var(--accent-text)',
              fontWeight: 600,
            }}>
              AI Translated
            </span>
          )}
        </div>
      )}

      <p style={{ lineHeight: '1.7', color: 'var(--text-body)' }}>
        {text}
      </p>
    </div>
  )
}
