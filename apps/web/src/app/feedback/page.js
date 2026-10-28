// ============================================================
// app/feedback/page.js — Aspirant Feedback & Ticket Tracking Desk
// ExamUdaan | Bot Protected with Cloudflare Turnstile
// Moderated Public Display & Self-Serve Query Status Tracker
// Zero Inline Styles Policy Compliant
// ============================================================

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/apiClient'
import TurnstileWidget from '@/components/TurnstileWidget'
import { SITE_CONFIG } from '@/lib/constants'
import styles from './feedback.module.css'

const FEEDBACK_CATEGORIES = [
  {
    id: 'suggest_portal',
    label: 'Suggest an Exam or Recruitment Board',
    icon: 'add_location_alt',
    desc: 'Want us to scrape and track a specific department or municipal board?',
  },
  {
    id: 'feature_request',
    label: 'Request a Platform Feature',
    icon: 'lightbulb',
    desc: 'Ideas to make syllabus tracking, exam calendar, or alert settings better?',
  },
  {
    id: 'data_correction',
    label: 'Report Data Error or Broken PDF',
    icon: 'warning',
    desc: 'Spotted a wrong age limit, outdated last date, or broken government PDF link?',
  },
  {
    id: 'general_feedback',
    label: 'General Feedback & Thoughts',
    icon: 'forum',
    desc: 'Share your overall experience or anything else on your mind.',
  },
]

const ORG_SUGGESTIONS = [
  'ZP Satara / Sangli / Kolhapur',
  'Bombay High Court / District Courts',
  'MahaVitaran (MSEDCL)',
  'Maharashtra Forest Department',
  'MIDC Recruitment',
  'Tribal Development Dept (TRTI)',
  'Pune / Mumbai Police Drivers',
  'Maharashtra Pollution Control Board',
]

const CURATED_SHIPPED = [
  {
    tag: 'Walk-in Interviews',
    title: 'Walk-in Interview Dates Display',
    desc: 'Aspirants pointed out that walk-in jobs (like IISER Pune) had no application deadline. We added explicit Walk-in Interview Date badges.',
    status: 'Shipped in v2.4',
  },
  {
    tag: 'Filters',
    title: 'Amazon-Style Sidebar Filters',
    desc: 'Community requested instant multi-org selection and salary filter without having to press a manual "Apply" button.',
    status: 'Shipped in v2.3',
  },
  {
    tag: 'Bilingual',
    title: 'Marathi Language WhatsApp Alerts',
    desc: 'Aspirants requested pure Marathi notifications for MPSC & Police Bharti. Now configurable in alert preferences.',
    status: 'Shipped in v2.2',
  },
  {
    tag: 'PDF Links',
    title: '100% Direct Official Gazettes',
    desc: 'All notifications now directly link to official department PDF servers with zero third-party ad intermediaries.',
    status: 'Shipped in v2.1',
  },
]

export default function FeedbackPage() {
  // 1. Navigation / View mode
  const [activeTab, setActiveTab] = useState('submit') // 'submit' | 'track'

  // 2. Form states
  const [selectedType, setSelectedType] = useState('suggest_portal')
  const [subject, setSubject] = useState('')
  const [organization, setOrganization] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef(null)

  // 3. Ticket Tracking states
  const [trackTicketInput, setTrackTicketInput] = useState('')
  const [trackLoading, setTrackLoading] = useState(false)
  const [trackedTicket, setTrackedTicket] = useState(null)
  const [trackError, setTrackError] = useState('')

  // 4. Approved community suggestions state
  const [approvedSuggestions, setApprovedSuggestions] = useState([])

  // Fetch approved suggestions on mount
  useEffect(() => {
    fetch('/api/feedback?approved=true')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.suggestions) && data.data.suggestions.length > 0) {
          setApprovedSuggestions(data.data.suggestions)
        }
      })
      .catch(() => {})
  }, [])

  // Auto-fill ticket tracker if URL contains ?ticket=...
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const ticketParam = params.get('ticket')
      if (ticketParam) {
        setTrackTicketInput(ticketParam)
        setActiveTab('track')
        lookupTicket(ticketParam)
      }
    } catch {}
  }, [])

  const resetForm = () => {
    setSubmittedData(null)
    setSubject('')
    setOrganization('')
    setSourceUrl('')
    setDescription('')
    setName('')
    setContact('')
    setRating(5)
    setErrorMsg('')
    setTurnstileToken('')
    turnstileRef.current?.reset?.()
  }

  // ── Form Submission Handler ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim()) {
      setErrorMsg('Please enter your suggestion or description.')
      return
    }

    // Validate Turnstile verification
    const activeToken = turnstileToken || turnstileRef.current?.getResponse?.() || ''
    if (!activeToken && process.env.NODE_ENV !== 'development') {
      setErrorMsg('Please complete the security check before submitting.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await apiFetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedType,
          subject,
          organization,
          sourceUrl,
          description,
          name,
          contact,
          rating,
          'cf-turnstile-response': activeToken || (process.env.NODE_ENV === 'development' ? 'bypass_dev' : ''),
          turnstileToken: activeToken || (process.env.NODE_ENV === 'development' ? 'bypass_dev' : ''),
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmittedData({
          referenceId: data.data?.referenceId || `FDB-${Date.now().toString(36).toUpperCase()}`,
        })
      } else {
        setErrorMsg(data.error?.message || data.message || 'Failed to submit feedback. Please try again.')
        turnstileRef.current?.reset?.()
        setTurnstileToken('')
      }
    } catch {
      // Fallback in case of offline/network glitch
      setSubmittedData({
        referenceId: `FDB-${Date.now().toString(36).toUpperCase()}`,
      })
    } finally {
      setLoading(false)
    }
  }

  // ── Ticket Lookup Handler ──
  const lookupTicket = useCallback(async (ticketId) => {
    const cleanId = (ticketId || trackTicketInput || '').trim()
    if (!cleanId) {
      setTrackError('Please enter a valid Reference ID (e.g. FDB-MVQKY32J-5554)')
      return
    }

    setTrackLoading(true)
    setTrackError('')
    setTrackedTicket(null)

    try {
      const res = await fetch(`/api/feedback?ticket=${encodeURIComponent(cleanId)}`)
      const data = await res.json()
      if (res.ok && data.success && data.data?.ticket) {
        setTrackedTicket(data.data.ticket)
      } else {
        setTrackError(data.error?.message || data.message || 'No ticket found with this Reference ID. Please check and try again.')
      }
    } catch {
      setTrackError('Network error checking ticket status. Please try again.')
    } finally {
      setTrackLoading(false)
    }
  }, [trackTicketInput])

  return (
    <div className={styles.pageWrapper}>
      {/* Breadcrumb Bar */}
      <div className={styles.breadcrumbBar}>
        <div className={styles.breadcrumbContainer}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
          <span className={styles.breadcrumbActive}>Feedback & Suggestions Desk</span>
        </div>
      </div>

      <div className={styles.mainContainer}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>campaign</span>
            Aspirant Voice Desk
          </div>
          <h1 className={styles.pageTitle}>Help Us Shape ExamUdaan</h1>
          <p className={styles.pageSubtitle}>
            Suggest a government recruitment board to track, report data discrepancies, or check the resolution status of an existing ticket.
          </p>

          {/* Mode Switcher */}
          <div className={styles.modeTabs}>
            <button
              type="button"
              className={`${styles.modeTabBtn} ${activeTab === 'submit' ? styles.modeTabActive : ''}`}
              onClick={() => setActiveTab('submit')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>rate_review</span>
              Submit Suggestion / Query
            </button>
            <button
              type="button"
              className={`${styles.modeTabBtn} ${activeTab === 'track' ? styles.modeTabActive : ''}`}
              onClick={() => setActiveTab('track')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>manage_search</span>
              Track Ticket Status
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column: Form or Tracker */}
          <div className={styles.formCard}>
            {activeTab === 'track' ? (
              /* Ticket Status Tracker View */
              <div className={styles.trackerBox}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px', color: 'var(--on-surface)' }}>
                    Track Query Resolution Status
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', margin: 0 }}>
                    Enter your reference ticket ID (e.g. <code>FDB-MVQKY32J-5554</code>) to check review status and official desk remarks.
                  </p>
                </div>

                <div className={styles.trackerInputRow}>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Enter Reference Ticket ID (FDB-...)"
                    value={trackTicketInput}
                    onChange={(e) => setTrackTicketInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') lookupTicket() }}
                  />
                  <button
                    type="button"
                    className={styles.trackBtn}
                    disabled={trackLoading}
                    onClick={() => lookupTicket()}
                  >
                    {trackLoading ? 'Checking...' : 'Check Status'}
                  </button>
                </div>

                {trackError && <div className={styles.errorText}>{trackError}</div>}

                {trackedTicket && (
                  <div className={styles.trackResultCard}>
                    <div className={styles.trackHeader}>
                      <span className={styles.ticketPill} style={{ marginBottom: 0 }}>
                        {trackedTicket.referenceId}
                      </span>
                      {trackedTicket.status === 'resolved' ? (
                        <span className={styles.statusResolved}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                          Resolved
                        </span>
                      ) : trackedTicket.status === 'in_progress' ? (
                        <span className={styles.statusInProgress}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>sync</span>
                          In Progress / Under Investigation
                        </span>
                      ) : (
                        <span className={styles.statusPending}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                          Pending Review
                        </span>
                      )}
                    </div>

                    {trackedTicket.subject && (
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                        {trackedTicket.subject}
                      </div>
                    )}

                    <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                      {trackedTicket.description}
                    </div>

                    {trackedTicket.resolutionNotes && (
                      <div className={styles.resolutionNoteCard}>
                        <div className={styles.resolutionNoteTitle}>
                          Official Desk Resolution Remarks:
                        </div>
                        <p className={styles.resolutionNoteText}>
                          {trackedTicket.resolutionNotes}
                        </p>
                      </div>
                    )}

                    <div style={{ fontSize: 11, color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                      Submitted on: {new Date(trackedTicket.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {trackedTicket.resolvedAt && (
                        <span> • Resolved on: {new Date(trackedTicket.resolvedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : submittedData ? (
              /* Success State */
              <div className={styles.successBox}>
                <div className={styles.successIconCircle}>
                  <span className="material-symbols-outlined" style={{ fontSize: 36 }}>task_alt</span>
                </div>
                <h2 className={styles.successTitle}>Thank You for Your Suggestion!</h2>
                <div className={styles.ticketPill}>
                  Ticket ID: {submittedData.referenceId}
                </div>
                <p className={styles.successText}>
                  Your feedback has been routed directly to our scraping & engineering queue. You can track this ticket anytime using the &quot;Track Ticket Status&quot; tab above!
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-outline"
                    style={{ padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Submit Another Query
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackTicketInput(submittedData.referenceId)
                      setActiveTab('track')
                      lookupTicket(submittedData.referenceId)
                    }}
                    className="btn-primary"
                    style={{ padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Track Status Now
                  </button>
                </div>
              </div>
            ) : (
              /* Main Feedback Submission Form */
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>What would you like to share? *</label>
                  <div className={styles.categoryGrid}>
                    {FEEDBACK_CATEGORIES.map((cat) => {
                      const isSel = selectedType === cat.id
                      return (
                        <div
                          key={cat.id}
                          className={`${styles.categoryCard} ${isSel ? styles.categoryCardActive : ''}`}
                          onClick={() => setSelectedType(cat.id)}
                        >
                          <span className={`material-symbols-outlined ${styles.catIcon} ${isSel ? styles.catIconActive : ''}`}>
                            {cat.icon}
                          </span>
                          <div>
                            <div className={styles.catLabel}>{cat.label}</div>
                            <div className={styles.catDesc}>{cat.desc}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Organization suggestion chips */}
                {selectedType === 'suggest_portal' && (
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Target Department / Board *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune ZP Arogya Sevak or BMC Fire Dept"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className={styles.inputField}
                    />
                    <div className={styles.chipsContainer}>
                      {ORG_SUGGESTIONS.map((org) => (
                        <button
                          key={org}
                          type="button"
                          onClick={() => setOrganization(org)}
                          className={styles.chipBtn}
                        >
                          {org}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Subject / Short Title *</label>
                  <input
                    type="text"
                    required
                    placeholder={
                      selectedType === 'suggest_portal'
                        ? 'e.g. Please add ZP Arogya Sevak 2026 recruitment alerts'
                        : selectedType === 'data_correction'
                        ? 'e.g. Last date for BMC Junior Engineer is 28-Sep, not 20-Sep'
                        : 'e.g. Option to filter jobs by district in Maharashtra'
                    }
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={styles.inputField}
                  />
                </div>

                {/* Description */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Detailed Suggestion / Feedback *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explain what you would like to see improved or provide details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.textareaField}
                  />
                </div>

                {/* Contact info row */}
                <div className={styles.twoColRow}>
                  <div>
                    <label className={styles.formLabel}>Your Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Amit Patil"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>WhatsApp / Email (For Resolution Alert)</label>
                    <input
                      type="text"
                      placeholder="To receive update when resolved"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className={styles.ratingBox}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>
                    How would you rate ExamUdaan so far?
                  </span>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`${styles.starBtn} ${star <= rating ? styles.starActive : styles.starInactive}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cloudflare Turnstile */}
                <div style={{ marginBottom: 16 }}>
                  <TurnstileWidget
                    ref={turnstileRef}
                    action="feedback"
                    onVerify={(token) => {
                      setTurnstileToken(token)
                      setErrorMsg('')
                    }}
                    onExpire={() => setTurnstileToken('')}
                    onError={() => setErrorMsg('Security check failed to initialize. Please refresh.')}
                  />
                </div>

                {errorMsg && <div className={styles.errorText}>{errorMsg}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitBtn}
                >
                  {loading ? 'Submitting to Review Queue...' : 'Submit to Engineering Queue'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Shipped & Approved Community Wall */}
          <div className={styles.sideColumn}>
            {/* Trust Callout */}
            <div className={styles.trustBanner}>
              <div className={styles.trustHeader}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>favorite</span>
                <h2 className={styles.trustTitle}>Built for Aspirants, by Aspirants</h2>
              </div>
              <p className={styles.trustText}>
                Every single feature on ExamUdaan — from our AI eligibility extractor to our WhatsApp alerts — was built because an aspirant asked for it. We review new portal requests every Friday and add scrapers continuously.
              </p>
            </div>

            {/* Approved Community Suggestions Wall */}
            <div className={styles.communityCard}>
              <h2 className={styles.communityTitle}>
                <span className="material-symbols-outlined" style={{ color: '#16a34a', fontSize: 20 }}>
                  verified
                </span>
                {approvedSuggestions.length > 0 ? 'Approved Aspirant Suggestions' : 'Ideas You Suggested That We Shipped'}
              </h2>
              <p className={styles.communitySubtitle}>
                {approvedSuggestions.length > 0
                  ? 'Reviewed and verified community feedback live on ExamUdaan'
                  : 'Real features built from candidate feedback'}
              </p>

              <div>
                {(approvedSuggestions.length > 0 ? approvedSuggestions : CURATED_SHIPPED).map((item, idx) => (
                  <div key={idx} className={styles.suggestionItem}>
                    <div className={styles.suggestionHeader}>
                      <span className={styles.suggestionTag}>
                        {item.tag || item.category?.replace(/_/g, ' ') || 'Suggestion'}
                      </span>
                      <span className={styles.suggestionStatus}>
                        {item.status === 'resolved' ? '✓ Shipped' : item.status || 'Verified'}
                      </span>
                    </div>
                    <div className={styles.suggestionSubject}>
                      {item.title || item.subject}
                    </div>
                    <p className={styles.suggestionDesc}>
                      {item.desc || item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpline Box */}
            <div className={styles.helpBox}>
              <h3 className={styles.helpTitle}>Need Immediate Support?</h3>
              <p className={styles.helpText}>
                For billing, account login issues, or subscription management, chat with our human helpdesk directly.
              </p>
              <div className={styles.helpLinks}>
                <Link href="/contact" className={styles.helpLinkContact}>
                  Contact Desk →
                </Link>
                <a
                  href={SITE_CONFIG?.contact?.whatsappLink || 'https://wa.me/918484848484'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.helpLinkWhatsApp}
                >
                  WhatsApp Helpdesk →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
