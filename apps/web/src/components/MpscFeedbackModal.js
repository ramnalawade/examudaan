'use client'

// ============================================================
// components/MpscFeedbackModal.js — Aspirant Feedback & Paper Request Modal
// ExamUdaan.in — Compact, High-Conversion, Full Mobile & Scroll Support
// ZERO INLINE STYLES POLICY: All styles in MpscFeedbackModal.module.css
// ============================================================

import { useState, useEffect, useRef } from 'react'
import { apiFetch } from '@/lib/apiClient'
import TurnstileWidget from '@/components/TurnstileWidget'
import styles from './MpscFeedbackModal.module.css'

const CATEGORIES = [
  {
    id: 'missing_papers',
    icon: '📄',
    title: 'Missing Paper',
    titleMr: 'कागदपत्रे मागणी'
  },
  {
    id: 'error_report',
    icon: '⚠️',
    title: 'Error or Bug',
    titleMr: 'त्रुटी नोंदवा'
  },
  {
    id: 'feature_request',
    icon: '💡',
    title: 'New Feature',
    titleMr: 'सुधारणा मागणी'
  },
  {
    id: 'general_feedback',
    icon: '⭐',
    title: 'Review',
    titleMr: 'अभिप्राय'
  }
]

const QUICK_CHIPS = {
  missing_papers: [
    'Rajyaseva (State Services)',
    'Combined Group B (PSI/STI/ASO)',
    'Combined Group C (Clerk)',
    'Final Official Answer Key',
    'MPSC CSAT Paper 2',
    'Technical / Forest Exam'
  ],
  error_report: [
    'Wrong Answer in Key / MCQ',
    'PDF Not Opening / 404 Link',
    'Mobile Screen Layout Cut',
    'Calculation Glitch',
    'Marathi Translation Issue'
  ],
  feature_request: [
    'More 100-Q Full Mocks',
    'Detailed Marathi Explanations',
    'Topic-wise 15-Yr Filter',
    'Subject Cutoff Analytics',
    'WhatsApp Instant Alerts'
  ],
  general_feedback: [
    'Fast & Smooth Viewer',
    'Very Helpful for MPSC',
    'Clean Interface (No Ads)',
    'Best Free Resource'
  ]
}

const FIELD_CONFIG = {
  missing_papers: {
    label: 'Which paper, year, or post is needed? / कोणता पेपर हवा?',
    placeholder: 'e.g. MPSC Group B 2023 Final Answer Key, Rajyaseva GS-2...'
  },
  error_report: {
    label: 'Describe the issue or error location / त्रुटी सांगा',
    placeholder: 'e.g. Question 14 answer is Option B not C, PDF page 3 is blurred or broken link...'
  },
  feature_request: {
    label: 'What should we add or improve? / काय हवे आहे?',
    placeholder: 'e.g. Need Marathi explanations for science questions, district-wise filter...'
  },
  general_feedback: {
    label: 'Your experience & thoughts / तुमचा अभिप्राय',
    placeholder: 'Share your feedback, exam preparation experience, or thoughts...'
  }
}

export default function MpscFeedbackModal({
  isOpen,
  onClose,
  examContext = 'MPSC Question Papers & Answer Keys',
  defaultCategory = 'missing_papers'
}) {
  const [category, setCategory] = useState(defaultCategory)
  const [selectedChips, setSelectedChips] = useState([])
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState(5)
  const [contact, setContact] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [submittedData, setSubmittedData] = useState(null)

  // Sync category when defaultCategory changes
  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory)
      setSelectedChips([])
      setErrorMsg('')
    }
  }, [defaultCategory, isOpen])

  // ESC key listener to close modal
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleToggleChip = (chipText) => {
    setSelectedChips((prev) =>
      prev.includes(chipText) ? prev.filter((c) => c !== chipText) : [...prev, chipText]
    )
  }

  const handleCategoryChange = (catId) => {
    setCategory(catId)
    setSelectedChips([])
    setErrorMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    const trimmedDesc = description.trim()

    // Validate: Needs either description or selected chips
    if (!trimmedDesc && selectedChips.length === 0) {
      setErrorMsg('Please enter details or tap at least one topic chip.')
      return
    }

    // Validate Turnstile verification
    const activeToken = turnstileToken || turnstileRef.current?.getResponse?.() || ''
    if (!activeToken && process.env.NODE_ENV !== 'development') {
      setErrorMsg('Please complete the security check before submitting.')
      return
    }

    setSubmitting(true)

    // Build comprehensive description text
    const chipsSection = selectedChips.length > 0 ? `Tags: ${selectedChips.join(', ')}\n` : ''
    const fullDescription = `${chipsSection}${trimmedDesc || selectedChips.join(', ')}`.trim()

    const subjectStr = selectedChips.length > 0
      ? `[${category.toUpperCase()}] ${selectedChips.join(', ')}`
      : `[${category.toUpperCase()}] ${trimmedDesc.slice(0, 48)}`

    try {
      const res = await apiFetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: `mpsc_${category}`,
          subject: subjectStr,
          description: fullDescription,
          organization: 'MPSC',
          sourceUrl: typeof window !== 'undefined' ? window.location.pathname : '/mpsc-pyq',
          name: 'MPSC Aspirant',
          contact: contact.trim() || null,
          rating,
          'cf-turnstile-response': activeToken || (process.env.NODE_ENV === 'development' ? 'bypass_dev' : ''),
          turnstileToken: activeToken || (process.env.NODE_ENV === 'development' ? 'bypass_dev' : ''),
          metadata: {
            portalSection: 'mpsc-pyq',
            examContext,
            tags: selectedChips,
            clientTimestamp: new Date().toISOString()
          }
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmittedData({
          referenceId: data.data?.referenceId || `FDB-${Date.now().toString(36).toUpperCase()}`
        })
      } else {
        setErrorMsg(data.error?.message || data.message || 'Failed to submit feedback. Please try again.')
        turnstileRef.current?.reset?.()
      }
    } catch (err) {
      console.error('[MpscFeedbackModal] submit error:', err)
      setErrorMsg('Network issue. Please check your internet connection and try again.')
      turnstileRef.current?.reset?.()
    } finally {
      setSubmitting(false)
    }
  }

  const contextTitle = typeof examContext === 'object'
    ? examContext.title || examContext.name || 'MPSC Exam'
    : String(examContext || 'MPSC Exam')

  const currentFieldConfig = FIELD_CONFIG[category] || FIELD_CONFIG.missing_papers

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Compact Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>
              <span>📝</span>
              <span>Feedback & Request Desk</span>
            </h2>
            <div className={styles.contextBox} title={contextTitle}>
              <span className={styles.contextIcon}>🎯</span>
              <span className={styles.contextText}>{contextTitle}</span>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {submittedData ? (
          /* Success Screen */
          <div className={styles.successBox}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>धन्यवाद! Feedback Received</h3>
            <p className={styles.successDesc}>
              तुमचा अभिप्राय ExamUdaan टीमकडे नोंदवला गेला आहे. तुम्ही मागितलेले पेपर्स किंवा त्रुटी लवकरच तपासली जाईल.
            </p>
            <div className={styles.refBadge}>Ref ID: {submittedData.referenceId}</div>
            <button
              type="button"
              className={styles.btnSubmit}
              onClick={onClose}
            >
              Continue Studying (अभ्यास सुरु ठेवा) →
            </button>
          </div>
        ) : (
          /* Form with Guaranteed Scrollability & Sticky Footer */
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.body}>
              {/* Category Segmented Pills (Compact 2x2 grid) */}
              <div>
                <div className={styles.sectionLabel}>
                  <span>1. Type / विषय निवडा</span>
                </div>
                <div className={styles.categoryGrid}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`${styles.categoryBtn} ${category === cat.id ? styles.categoryBtnActive : ''}`}
                      onClick={() => handleCategoryChange(cat.id)}
                    >
                      <span className={styles.categoryIcon}>{cat.icon}</span>
                      <div className={styles.categoryTextGroup}>
                        <span className={styles.categoryTitle}>{cat.title}</span>
                        <span className={styles.categoryBadge}>{cat.titleMr}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Topic Chips (Compact 1-click selectors) */}
              <div className={styles.quickChipsContainer}>
                <div className={styles.sectionLabel}>
                  <span>2. Quick Topics (Optional) / महत्त्वाचे मुद्दे</span>
                </div>
                <div className={styles.chipsList}>
                  {(QUICK_CHIPS[category] || []).map((chip) => {
                    const isSelected = selectedChips.includes(chip)
                    return (
                      <button
                        key={chip}
                        type="button"
                        className={`${styles.chip} ${isSelected ? styles.chipActive : ''}`}
                        onClick={() => handleToggleChip(chip)}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {chip}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Single Unified Details Field */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span>{currentFieldConfig.label}</span>
                  <span className={styles.optionalHint}>* Required</span>
                </label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder={currentFieldConfig.placeholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Inline Contact & Star Rating Row */}
              <div className={styles.inlineRow}>
                <div className={styles.contactCol}>
                  <label className={styles.label}>
                    <span>WhatsApp / Email</span>
                    <span className={styles.optionalHint}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="To notify when paper added/fixed"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>

                <div className={styles.ratingCol}>
                  <label className={styles.label}>
                    <span>Rating</span>
                    <span className={styles.ratingValue}>{rating}/5</span>
                  </label>
                  <div className={styles.starsGroup}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`${styles.starBtn} ${star <= rating ? styles.starBtnActive : ''}`}
                        onClick={() => setRating(star)}
                        aria-label={`Rate ${star} star`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bot Verification Widget */}
              <div className={styles.turnstileContainer}>
                <TurnstileWidget
                  ref={turnstileRef}
                  action="feedback"
                  onVerify={(token) => {
                    setTurnstileToken(token)
                    setErrorMsg('')
                  }}
                  onExpire={() => setTurnstileToken('')}
                  onError={() => setErrorMsg('Bot verification check failed to load. Please refresh.')}
                />
              </div>

              {errorMsg && (
                <div className={styles.errorMessage}>
                  ⚠️ {errorMsg}
                </div>
              )}
            </div>

            {/* Modal Footer — Always Visible & Accessible */}
            <div className={styles.footer}>
              <span className={styles.privacyNote}>
                🔒 100% Free & Spam-Free
              </span>
              <div className={styles.btnGroup}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback →'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/**
 * Floating trigger button rendered on MPSC study & practice pages
 */
export function MpscFeedbackFloatingButton({ onClick, label = 'Feedback & Request Papers' }) {
  return (
    <button
      type="button"
      className={styles.floatingTriggerBtn}
      onClick={onClick}
      title="Request MPSC papers, report errors or suggest features"
      aria-label="Open MPSC feedback and paper request desk"
    >
      <span className={styles.pulseDot} />
      <span>📝 {label}</span>
    </button>
  )
}
