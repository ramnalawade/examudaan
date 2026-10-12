'use client'
// ============================================================
// components/HindiToggle.js — Hindi/English description toggle
// ExamUdaan | AI-powered bilingual content
// ============================================================

import { useState } from 'react'
import styles from './hindiToggle.module.css'

export default function HindiToggle({ descriptionEn, descriptionHi }) {
  const [isHindi, setIsHindi] = useState(false)

  if (!descriptionEn && !descriptionHi) return null

  const text = isHindi ? descriptionHi : descriptionEn

  return (
    <div>
      {/* Language toggle button — only show if Hindi is available */}
      {descriptionHi && (
        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Language:</span>
          <div className={styles.toggleGroup}>
            <button
              id="lang-toggle-en"
              onClick={() => setIsHindi(false)}
              className={`${styles.toggleBtn} ${!isHindi ? styles.toggleBtnActive : ''}`}
            >
              English
            </button>
            <button
              id="lang-toggle-hi"
              onClick={() => setIsHindi(true)}
              className={`${styles.toggleBtn} ${isHindi ? styles.toggleBtnActive : ''}`}
            >
              हिंदी
            </button>
          </div>
          {isHindi && (
            <span className={styles.aiBadge}>
              AI Translated
            </span>
          )}
        </div>
      )}

      <p className={styles.textBody}>
        {text}
      </p>
    </div>
  )
}
