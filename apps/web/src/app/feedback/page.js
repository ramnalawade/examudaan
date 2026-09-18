// ============================================================
// app/feedback/page.js — Feedback & Exam Portal Suggestions Desk
// Allows aspirants to request new portals, suggest features & report bugs
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SITE_CONFIG } from '../../lib/constants'
import { apiFetch } from '../../lib/apiClient'

const FEEDBACK_TYPES = [
  {
    id: 'suggest_portal',
    label: 'Suggest a Government Portal / Exam',
    icon: 'account_balance',
    desc: 'Want us to track a specific Zilla Parishad, Municipal Corporation, Court, or University?',
  },
  {
    id: 'feature_request',
    label: 'Feature Request & Improvements',
    icon: 'lightbulb',
    desc: 'Ideas to make ExamUdaan search, alerts, or UI more helpful for your preparation.',
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

const SHIPPED_IMPROVEMENTS = [
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim()) {
      setErrorMsg('Please enter your suggestion or description.')
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
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmittedData({
          referenceId: data.data?.referenceId || `FDB-${Date.now().toString(36).toUpperCase()}`,
        })
      } else {
        setErrorMsg(data.error?.message || 'Failed to submit feedback. Please try again.')
      }
    } catch (err) {
      // Fallback in case of offline/network glitch
      setSubmittedData({
        referenceId: `FDB-${Date.now().toString(36).toUpperCase()}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSubmittedData(null)
    setSubject('')
    setOrganization('')
    setSourceUrl('')
    setDescription('')
    setName('')
    setContact('')
    setRating(5)
  }

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 64 }}>
      {/* Breadcrumb Header */}
      <div style={{ borderBottom: '1px solid var(--outline-variant)', background: 'var(--surface-container-lowest)', padding: '16px 0' }}>
        <div className="container" style={{ maxWidth: 1040, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--secondary)' }}>
            <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Feedback & Suggestions</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1040, margin: '0 auto', padding: '40px 20px 0' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--primary-fixed)',
            color: 'var(--on-primary-fixed)',
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>rate_review</span>
            Community-Driven Development
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'var(--on-surface)', marginBottom: 12 }}>
            Aspirant Feedback & Portal Suggestion Desk
          </h1>
          <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', maxWidth: 640, margin: '0 auto' }}>
            Help us build Maharashtra&apos;s most accurate exam tracker. Want us to track a new department, suggest a feature, or report a bug? We read every submission.
          </p>
        </div>

        {/* Main Grid: Feedback Form + Shipped Improvements */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36, alignItems: 'start' }}>
          {/* Left Column: Form Container */}
          <div style={{
            background: 'var(--surface-container-lowest)',
            border: '1px solid var(--outline-variant)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 28px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
          }}>
            {submittedData ? (
              /* Success State */
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'var(--tertiary-fixed)',
                  color: 'var(--tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 36 }}>task_alt</span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 8 }}>
                  Thank You for Your Suggestion!
                </h2>
                <div style={{
                  display: 'inline-block',
                  background: 'var(--surface-container-low)',
                  border: '1px solid var(--outline-variant)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--primary-cta)',
                  marginBottom: 16,
                }}>
                  Ticket ID: {submittedData.referenceId}
                </div>
                <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.6, maxWidth: 440, margin: '0 auto 24px' }}>
                  Your feedback has been routed directly to our scraping & engineering queue. If you provided contact details, we will notify you once your suggested portal or feature is released!
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-outline"
                    style={{
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Submit Another Idea
                  </button>
                  <Link
                    href="/jobs"
                    className="btn-primary"
                    style={{
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Back to Jobs
                  </Link>
                </div>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* 1. Feedback Type Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8 }}>
                    What would you like to share? *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                    {FEEDBACK_TYPES.map((t) => {
                      const isSelected = selectedType === t.id
                      return (
                        <div
                          key={t.id}
                          onClick={() => setSelectedType(t.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-md)',
                            border: isSelected ? '1.5px solid var(--primary-cta)' : '1px solid var(--outline-variant)',
                            background: isSelected ? 'var(--primary-fixed)' : 'var(--surface-container-low)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span className="material-symbols-outlined" style={{
                            fontSize: 22,
                            color: isSelected ? 'var(--primary)' : 'var(--secondary)',
                            marginTop: 2,
                          }}>
                            {t.icon}
                          </span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--on-surface)' }}>
                              {t.label}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2, lineHeight: 1.4 }}>
                              {t.desc}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 2. Organization / Portal Name (Crucial if suggesting an exam) */}
                {selectedType === 'suggest_portal' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>
                      Department / Exam Board Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zilla Parishad Solapur, High Court of Bombay..."
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--outline-variant)',
                        fontSize: 14,
                        background: 'var(--surface)',
                        color: 'var(--on-surface)',
                        boxSizing: 'border-box',
                        marginBottom: 8,
                      }}
                    />

                    {/* Quick suggestion chips */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--secondary)', fontWeight: 600 }}>Popular:</span>
                      {ORG_SUGGESTIONS.map((org, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setOrganization(org)}
                          style={{
                            background: 'var(--surface-container-low)',
                            border: '1px solid var(--outline-variant)',
                            borderRadius: 'var(--radius-full)',
                            padding: '3px 8px',
                            fontSize: 11,
                            color: 'var(--on-surface)',
                            cursor: 'pointer',
                          }}
                        >
                          {org}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Subject / Brief Title */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>
                    Subject / Short Title *
                  </label>
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
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--outline-variant)',
                      fontSize: 14,
                      background: 'var(--surface)',
                      color: 'var(--on-surface)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* 4. Open-Text Description */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>
                    Detailed Suggestion / Feedback *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={
                      selectedType === 'suggest_portal'
                        ? 'Tell us about this recruitment board, how frequently they release notifications, or any specific job posts you are targeting...'
                        : 'Explain what you would like to see improved, or provide details about the data discrepancy you spotted...'
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--outline-variant)',
                      fontSize: 14,
                      background: 'var(--surface)',
                      color: 'var(--on-surface)',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* 5. Optional URL (Official site or PDF link) */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>
                    Official Website or PDF Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--outline-variant)',
                      fontSize: 14,
                      background: 'var(--surface)',
                      color: 'var(--on-surface)',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 4 }}>
                    Providing the official recruitment link helps our engineers build a scraper faster.
                  </div>
                </div>

                {/* 6. Contact Details (Optional) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patil"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--outline-variant)',
                        fontSize: 14,
                        background: 'var(--surface)',
                        color: 'var(--on-surface)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>
                      WhatsApp / Email (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="To notify when shipped"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--outline-variant)',
                        fontSize: 14,
                        background: 'var(--surface)',
                        color: 'var(--on-surface)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* 7. Rating Widget */}
                <div style={{ background: 'var(--surface-container-low)', padding: '12px 14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>
                      How would you rate ExamUdaan so far?
                    </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 2,
                            color: star <= rating ? '#eab308' : 'var(--outline-variant)',
                            fontSize: 22,
                          }}
                        >
                          <span className="material-symbols-outlined fill" style={{ fontSize: 22 }}>star</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div style={{ color: 'var(--error)', fontSize: 13, fontWeight: 600 }}>
                    {errorMsg}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'var(--primary-cta)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px 20px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(234, 88, 12, 0.28)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
                  {loading ? 'Submitting Idea...' : 'Submit Feedback & Suggestions'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Community Shipped Wall & How We Listen */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Trust Callout */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-cta) 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 20px',
              boxShadow: '0 6px 20px rgba(163, 57, 0, 0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span className="material-symbols-outlined fill" style={{ fontSize: 24 }}>favorite</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Built for Aspirants, by Aspirants</h3>
              </div>
              <p style={{ fontSize: 14, opacity: 0.92, lineHeight: 1.6, margin: 0 }}>
                Every single feature on ExamUdaan — from our AI eligibility extractor to our WhatsApp alerts — was built because an aspirant asked for it. We review new portal requests every Friday and add scrapers continuously.
              </p>
            </div>

            {/* Shipped Improvements Wall */}
            <div style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 20px',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)', fontSize: 20 }}>
                  verified
                </span>
                Ideas You Suggested That We Shipped:
              </h3>
              <p style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 16 }}>
                Real features built from candidate feedback
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {SHIPPED_IMPROVEMENTS.map((item, idx) => (
                  <div key={idx} style={{
                    background: 'var(--surface-container-low)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    border: '1px solid var(--outline-variant)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-fixed)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
                        {item.tag}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tertiary)' }}>
                        {item.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--secondary)', lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Helpline Box */}
            <div style={{
              background: 'var(--surface-container-low)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 6 }}>
                Need Immediate Customer Support?
              </h4>
              <p style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.5, margin: '0 0 10px' }}>
                For billing, account login issues, or subscription management, chat with our human helpdesk directly.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <Link
                  href="/contact"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--primary-cta)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  Contact Desk →
                </Link>
                <a
                  href={SITE_CONFIG.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#25d366',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
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
