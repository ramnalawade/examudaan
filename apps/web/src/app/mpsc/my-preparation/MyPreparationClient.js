'use client'

// ============================================================
// app/mpsc/my-preparation/MyPreparationClient.js — Personal Weakness & Revision Tracker
// ExamUdaan.in — Saffron & Ivory, Strict Zero Inline Styles, Mobile Responsive
// ============================================================

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import styles from './MyPreparation.module.css'
import {
  getPrepVault,
  reviewMistakeItem,
  removeMistakeItem,
  seedSamplePreparationData,
  savePrepVault
} from '@/lib/prepVault'

const TABS = [
  { id: 'notebook', label: 'Mistake Notebook (चूक वही)', icon: '📓' },
  { id: 'analytics', label: 'Weakness & Accuracy', icon: '📊' },
  { id: 'flashcards', label: 'Daily Spaced Revision', icon: '🧠' },
  { id: 'history', label: 'Test History', icon: '📈' }
]

export default function MyPreparationClient() {
  const [vault, setVault] = useState(null)
  const [activeTab, setActiveTab] = useState('notebook')
  const [filterSubject, setFilterSubject] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 8

  // Interactive Re-Test State
  const [reTestOpen, setReTestOpen] = useState(false)
  const [reTestQuestions, setReTestQuestions] = useState([])
  const [reTestAnswers, setReTestAnswers] = useState({})
  const [reTestSubmitted, setReTestSubmitted] = useState(false)

  // Flashcard Modal State
  const [flashcardOpen, setFlashcardOpen] = useState(false)
  const [flashcardIdx, setFlashcardIdx] = useState(0)
  const [flashcardRevealed, setFlashcardRevealed] = useState(false)

  // Load vault from localStorage on mount
  useEffect(() => {
    setVault(getPrepVault())

    const handleVaultUpdate = (e) => {
      setVault(e.detail || getPrepVault())
    }
    window.addEventListener('examudaan:vault_updated', handleVaultUpdate)
    return () => window.removeEventListener('examudaan:vault_updated', handleVaultUpdate)
  }, [])

  // Calculations
  const stats = useMemo(() => {
    if (!vault) return { totalAttempts: 0, overallAccuracy: 0, totalMistakes: 0, dueTodayCount: 0 }
    const totalAttempts = (vault.attempts || []).length
    const mistakes = vault.mistakeNotebook || []
    const totalMistakes = mistakes.length

    let totalAttempted = 0
    let totalCorrect = 0
    Object.values(vault.subjectAccuracy || {}).forEach(sub => {
      totalAttempted += (sub.attempted || 0)
      totalCorrect += (sub.correct || 0)
    })
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0

    const now = new Date()
    const dueTodayCount = mistakes.filter(m => {
      if (m.status === 'mastered') return false
      return !m.nextReviewDate || new Date(m.nextReviewDate) <= now
    }).length

    return { totalAttempts, overallAccuracy, totalMistakes, dueTodayCount }
  }, [vault])

  // Filtered Mistakes
  const filteredMistakes = useMemo(() => {
    if (!vault) return []
    let list = vault.mistakeNotebook || []

    if (filterSubject !== 'all') {
      list = list.filter(m => m.subject.toLowerCase() === filterSubject.toLowerCase())
    }
    if (filterStatus !== 'all') {
      list = list.filter(m => m.status === filterStatus)
    }
    return list
  }, [vault, filterSubject, filterStatus])

  const totalPages = Math.max(1, Math.ceil(filteredMistakes.length / pageSize))
  const paginatedMistakes = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredMistakes.slice(start, start + pageSize)
  }, [filteredMistakes, page])

  // Available subjects in mistakes
  const availableSubjects = useMemo(() => {
    if (!vault) return []
    const set = new Set((vault.mistakeNotebook || []).map(m => m.subject))
    return Array.from(set)
  }, [vault])

  // Handlers for Leitner Spaced Review
  const handleReview = (id, remembered) => {
    reviewMistakeItem(id, remembered)
    setVault(getPrepVault())
  }

  const handleDelete = (id) => {
    removeMistakeItem(id)
    setVault(getPrepVault())
  }

  const handleSeedDemo = () => {
    seedSamplePreparationData()
    setVault(getPrepVault())
  }

  // Launch Re-Test from Mistakes
  const handleLaunchReTest = () => {
    const mistakes = vault?.mistakeNotebook || []
    if (mistakes.length === 0) return

    // Pick up to 10 mistake questions
    const selected = mistakes.slice(0, 10).map(m => ({
      id: m.id,
      question: m.questionText,
      options: m.options,
      correct: m.correctAnswer,
      explanation: m.explanation,
      subject: m.subject,
      topic: m.topic
    }))

    setReTestQuestions(selected)
    setReTestAnswers({})
    setReTestSubmitted(false)
    setReTestOpen(true)
  }

  const handleSelectReTestOption = (qId, optionKey) => {
    if (reTestSubmitted) return
    setReTestAnswers(prev => ({ ...prev, [qId]: optionKey }))
  }

  const handleSubmitReTest = () => {
    setReTestSubmitted(true)
    // For each correct answer, advance spaced repetition in vault!
    reTestQuestions.forEach(q => {
      const userAns = reTestAnswers[q.id]
      if (userAns && userAns.toUpperCase() === q.correct.toUpperCase()) {
        reviewMistakeItem(q.id, true)
      }
    })
    setVault(getPrepVault())
  }

  // Flashcards for due questions
  const dueQuestions = useMemo(() => {
    if (!vault) return []
    const now = new Date()
    return (vault.mistakeNotebook || []).filter(m => {
      if (m.status === 'mastered') return false
      return !m.nextReviewDate || new Date(m.nextReviewDate) <= now
    })
  }, [vault])

  const handleStartFlashcards = () => {
    if (dueQuestions.length === 0) return
    setFlashcardIdx(0)
    setFlashcardRevealed(false)
    setFlashcardOpen(true)
  }

  const handleFlashcardAnswer = (remembered) => {
    const currentQ = dueQuestions[flashcardIdx]
    if (currentQ) {
      handleReview(currentQ.id, remembered)
    }

    if (flashcardIdx + 1 < dueQuestions.length) {
      setFlashcardIdx(prev => prev + 1)
      setFlashcardRevealed(false)
    } else {
      setFlashcardOpen(false)
    }
  }

  if (!vault) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container} style={{ paddingTop: '80px', textAlign: 'center', color: '#EA580C', fontWeight: 700 }}>
          Loading your personal preparation vault...
        </div>
      </div>
    )
  }

  const hasAnyData = (vault.attempts || []).length > 0 || (vault.mistakeNotebook || []).length > 0

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Breadcrumb Strip */}
      <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
        <div className={styles.container}>
          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
            </li>
            <li className={styles.breadcrumbItem}>
              <Link href="/mpsc-pyq" className={styles.breadcrumbLink}>MPSC Hub</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
            </li>
            <li className={styles.breadcrumbItem}>
              <span className={styles.breadcrumbActive}>Personal Weakness & Revision Vault</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.badgeRow}>
              <span className={styles.badgeVault}>
                🎯 Personal Preparation & Telemetry Hub
              </span>
              <span className={styles.privacyBadge}>
                🔒 100% Private Browser Vault • Zero Signup Required
              </span>
            </div>

            <h1 className={styles.mainHeading}>
              My MPSC Preparation, Weakness & Revision Tracker
            </h1>

            <p className={styles.subHeading}>
              Track your mock test accuracy, maintain your personal mistake notebook (चूक वही), and master weak topics using scientifically timed Leitner spaced repetition.
            </p>

            {/* Metrics Ribbon */}
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>{stats.totalAttempts}</span>
                <span className={styles.metricLabel}>Tests & Quizzes Taken</span>
                <span className={styles.metricSubtext}>Complete mock history</span>
              </div>

              <div className={styles.metricCard}>
                <span className={`${styles.metricVal} ${stats.overallAccuracy >= 60 ? styles.metricValGreen : styles.metricValRed}`}>
                  {stats.overallAccuracy}%
                </span>
                <span className={styles.metricLabel}>Cumulative Accuracy</span>
                <span className={styles.metricSubtext}>Target: 70%+ for Prelims</span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricVal}>{stats.totalMistakes}</span>
                <span className={styles.metricLabel}>Mistake Notebook</span>
                <span className={styles.metricSubtext}>Incorrect questions logged</span>
              </div>

              <div className={styles.metricCard}>
                <span className={`${styles.metricVal} ${stats.dueTodayCount > 0 ? styles.metricValRed : styles.metricValGreen}`}>
                  {stats.dueTodayCount}
                </span>
                <span className={styles.metricLabel}>Due for Revision Today</span>
                <span className={styles.metricSubtext}>Spaced repetition queue</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Sticky Navigation Tabs */}
      <nav className={styles.tabsBar} aria-label="Preparation Navigation">
        <div className={styles.container}>
          <div className={styles.tabsScroll}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                onClick={() => {
                  setActiveTab(tab.id)
                  setPage(1)
                  const el = document.getElementById('my-prep-content')
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'notebook' && (
                  <span className={styles.tabPill}>{stats.totalMistakes}</span>
                )}
                {tab.id === 'flashcards' && stats.dueTodayCount > 0 && (
                  <span className={styles.tabPill} style={{ background: '#DC2626', color: '#FFFFFF' }}>
                    {stats.dueTodayCount} Due
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className={styles.container} id="my-prep-content">
        <div className={styles.dashboardBody}>
          {/* Spaced Repetition Due Alert Strip */}
          {stats.dueTodayCount > 0 && (
            <div className={styles.revisionAlertStrip}>
              <div className={styles.revisionAlertContent}>
                <span className={styles.alertIcon}>⏰</span>
                <div>
                  <h3 className={styles.alertHeading}>
                    {stats.dueTodayCount} Questions Due for Daily Revision (आजची उजळणी)
                  </h3>
                  <p className={styles.alertText}>
                    According to the Ebbinghaus forgetting curve, reviewing questions today will consolidate them into long-term memory.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={styles.btnStartFlashcards}
                onClick={handleStartFlashcards}
              >
                ⚡ Start 5-Min Flashcard Review →
              </button>
            </div>
          )}

          {!hasAnyData ? (
            /* Empty State Container */
            <div className={styles.emptyVaultBox}>
              <span className={styles.emptyVaultIcon}>📚</span>
              <h2 className={styles.emptyVaultTitle}>Your Preparation Vault is Ready</h2>
              <p className={styles.emptyVaultDesc}>
                Take mock tests on ExamUdaan or solve 15-year PYQs. Any question you get wrong will be automatically captured here in your private Mistake Notebook for spaced repetition revision.
              </p>
              <div className={styles.emptyBtnRow}>
                <button
                  type="button"
                  className={styles.btnReTestLauncher}
                  onClick={handleSeedDemo}
                >
                  ✨ Load Demo Mistakes & Mock Data
                </button>
                <Link href="/mock-tests" className={styles.btnReTestLauncher} style={{ background: '#059669', borderColor: '#047857' }}>
                  🎯 Take a Real Mock Test →
                </Link>
                <Link href="/pyq" className={styles.btnReTestLauncher} style={{ background: '#334155', borderColor: '#1E293B' }}>
                  📖 Practise PYQs
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: MISTAKE NOTEBOOK (चूक वही) */}
              {activeTab === 'notebook' && (
                <section aria-labelledby="mistake-notebook-heading">
                  <div className={styles.sectionControlRow}>
                    <div className={styles.filterButtonGroup}>
                      <button
                        type="button"
                        className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.filterBtnActive : ''}`}
                        onClick={() => { setFilterStatus('all'); setPage(1) }}
                      >
                        All ({stats.totalMistakes})
                      </button>
                      <button
                        type="button"
                        className={`${styles.filterBtn} ${filterStatus === 'unrevised' ? styles.filterBtnActive : ''}`}
                        onClick={() => { setFilterStatus('unrevised'); setPage(1) }}
                      >
                        Unrevised (बाकी)
                      </button>
                      <button
                        type="button"
                        className={`${styles.filterBtn} ${filterStatus === 'reviewing' ? styles.filterBtnActive : ''}`}
                        onClick={() => { setFilterStatus('reviewing'); setPage(1) }}
                      >
                        Reviewing (सुरू)
                      </button>
                      <button
                        type="button"
                        className={`${styles.filterBtn} ${filterStatus === 'mastered' ? styles.filterBtnActive : ''}`}
                        onClick={() => { setFilterStatus('mastered'); setPage(1) }}
                      >
                        Mastered (आत्मसात ✓)
                      </button>
                    </div>

                    <button
                      type="button"
                      className={styles.btnReTestLauncher}
                      onClick={handleLaunchReTest}
                      disabled={filteredMistakes.length === 0}
                    >
                      🎯 Retest My Mistakes (सराव परीक्षा) →
                    </button>
                  </div>

                  {paginatedMistakes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
                      No mistakes found under this filter. Great job!
                    </div>
                  ) : (
                    <div className={styles.mistakesList}>
                      {paginatedMistakes.map(m => {
                        const opts = m.options || {}
                        return (
                          <article key={m.id} className={styles.mistakeCard}>
                            <div className={styles.mistakeHeader}>
                              <div className={styles.badgeTopicGroup}>
                                <span className={styles.badgeSubject}>{m.subject}</span>
                                <span style={{ fontWeight: 700, color: '#0F172A' }}>{m.topic}</span>
                                <span className={styles.badgeExam}>• {m.exam}</span>
                              </div>
                              <span className={`
                                ${styles.statusPill}
                                ${m.status === 'mastered' ? styles.statusPillMastered : m.status === 'reviewing' ? styles.statusPillReviewing : styles.statusPillUnrevised}
                              `}>
                                {m.status === 'mastered' ? 'Mastered (आत्मसात ✓)' : m.status === 'reviewing' ? `Reviewing (Level ${m.reviewCount || 1})` : 'Unrevised (पुनरावलोकन बाकी)'}
                              </span>
                            </div>

                            <p className={styles.questionBody}>{m.questionText}</p>

                            <div className={styles.answerComparisonGrid}>
                              <div className={styles.ansBoxWrong}>
                                <span className={styles.ansBoxLabel}>❌ Your Answer (तुमचे उत्तर):</span>
                                <strong>Option ({m.userAnswer}): {opts[m.userAnswer] || '(Not selected)'}</strong>
                              </div>
                              <div className={styles.ansBoxCorrect}>
                                <span className={styles.ansBoxLabel}>✓ Official Answer (आयोगाचे उत्तर):</span>
                                <strong>Option ({m.correctAnswer}): {opts[m.correctAnswer] || 'Official Key'}</strong>
                              </div>
                            </div>

                            {m.explanation && (
                              <div className={styles.explanationStrip}>
                                <strong>Official MPSC Explanation:</strong> {m.explanation}
                              </div>
                            )}

                            <div className={styles.mistakeActionRow}>
                              <div className={styles.leitnerButtonGroup}>
                                <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                                  Did you remember the concept?
                                </span>
                                <button
                                  type="button"
                                  className={styles.btnRemembered}
                                  onClick={() => handleReview(m.id, true)}
                                >
                                  ✓ Remembered
                                </button>
                                <button
                                  type="button"
                                  className={styles.btnForgot}
                                  onClick={() => handleReview(m.id, false)}
                                >
                                  ✗ Still Confused
                                </button>
                              </div>

                              <button
                                type="button"
                                className={styles.btnDeleteMistake}
                                onClick={() => handleDelete(m.id)}
                              >
                                Remove from Notebook
                              </button>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  )}

                  {/* Numbered Pagination (Rule: ALWAYS USE NUMBERED PAGINATION) */}
                  {totalPages > 1 && (
                    <div className={styles.paginationRow}>
                      <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                      >
                        ‹ Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          type="button"
                          className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                      >
                        Next ›
                      </button>
                    </div>
                  )}
                </section>
              )}

              {/* TAB 2: WEAKNESS & ACCURACY (कमकुवत घटक) */}
              {activeTab === 'analytics' && (
                <section aria-labelledby="weakness-analytics-heading">
                  <div className={styles.sectionControlRow}>
                    <div>
                      <h2 id="weakness-analytics-heading" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>
                        Subject-Wise Accuracy & Critical Weakness Heatmap
                      </h2>
                      <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                        Topics with accuracy below 60% are highlighted in red for urgent revision.
                      </p>
                    </div>
                  </div>

                  <div className={styles.accuracyGrid}>
                    {Object.entries(vault.subjectAccuracy || {}).map(([subj, data]) => {
                      const acc = data.accuracyPercent || 0
                      const isWeak = acc < 60
                      return (
                        <div key={subj} className={styles.accuracyCard}>
                          <div className={styles.accuracyCardTitle}>
                            <span>{subj}</span>
                            <span className={styles.accuracyPercent} style={{ color: isWeak ? '#DC2626' : '#059669' }}>
                              {acc}%
                            </span>
                          </div>

                          <div className={styles.accuracyBarTrack}>
                            <div
                              className={styles.accuracyBarFill}
                              style={{
                                width: `${Math.min(Math.max(acc, 5), 100)}%`,
                                background: isWeak ? '#DC2626' : '#10B981'
                              }}
                            />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
                            <span>Attempted: <strong>{data.attempted}</strong></span>
                            <span>Correct: <strong style={{ color: '#059669' }}>{data.correct}</strong></span>
                            <span>Wrong: <strong style={{ color: '#DC2626' }}>{data.wrong}</strong></span>
                          </div>

                          {isWeak && (
                            <div style={{ fontSize: '11px', color: '#DC2626', background: '#FEF2F2', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              ⚠️ High Priority: Needs immediate review before exam
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* TAB 3: DAILY SPACED REVISION (दैनिक उजळणी) */}
              {activeTab === 'flashcards' && (
                <section aria-labelledby="spaced-revision-heading">
                  <div className={styles.sectionControlRow}>
                    <div>
                      <h2 id="spaced-revision-heading" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>
                        Leitner Spaced Repetition Queue
                      </h2>
                      <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                        Review questions at expanding intervals (1d → 3d → 7d → 21d). Questions answered correctly 3 times are permanently mastered.
                      </p>
                    </div>

                    <button
                      type="button"
                      className={styles.btnStartFlashcards}
                      onClick={handleStartFlashcards}
                      disabled={dueQuestions.length === 0}
                    >
                      ⚡ Start Flashcards ({dueQuestions.length} Due)
                    </button>
                  </div>

                  <div className={styles.mistakesList}>
                    {dueQuestions.slice(0, 6).map(q => (
                      <div key={q.id} className={styles.mistakeCard}>
                        <div className={styles.mistakeHeader}>
                          <span className={styles.badgeSubject}>{q.subject} • {q.topic}</span>
                          <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700 }}>Due Today</span>
                        </div>
                        <p className={styles.questionBody}>{q.questionText}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className={styles.btnRemembered}
                            onClick={() => handleReview(q.id, true)}
                          >
                            ✓ Mark as Revised Today
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* TAB 4: TEST HISTORY (मागील परीक्षा) */}
              {activeTab === 'history' && (
                <section aria-labelledby="test-history-heading">
                  <h2 id="test-history-heading" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, margin: '0 0 16px 0' }}>
                    Mock Test & Quiz History Log
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(vault.attempts || []).map(att => (
                      <div key={att.id} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <strong style={{ fontSize: '15px', color: '#0F172A' }}>{att.testTitle}</strong>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            {new Date(att.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {att.examCadre}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#EA580C' }}>
                              {att.score} / {att.maxMarks}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>
                              Accuracy: {att.accuracy}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {/* Interactive Re-Test Modal */}
      {reTestOpen && (
        <div className={styles.flashcardModalOverlay} role="dialog" aria-modal="true">
          <div className={styles.flashcardCard} style={{ maxHeight: '88vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#EA580C', textTransform: 'uppercase' }}>
                🎯 Weakness Retest ({reTestQuestions.length} Questions)
              </span>
              <button
                type="button"
                onClick={() => setReTestOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reTestQuestions.map((q, idx) => {
                const selected = reTestAnswers[q.id]
                const opts = q.options || {}
                return (
                  <div key={q.id} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
                      Q.{idx + 1} • {q.subject} ({q.topic})
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px 0', color: '#0F172A' }}>
                      {q.question}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {Object.entries(opts).map(([key, val]) => {
                        const isChosen = selected === key
                        const isCorrectKey = q.correct && q.correct.toUpperCase() === key.toUpperCase()

                        let itemStyle = {
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: isChosen ? '1.5px solid #EA580C' : '1px solid #E2E8F0',
                          background: isChosen ? '#FFF7ED' : '#F8FAFC',
                          cursor: reTestSubmitted ? 'default' : 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }

                        if (reTestSubmitted) {
                          if (isCorrectKey) {
                            itemStyle.background = '#ECFDF5'
                            itemStyle.borderColor = '#10B981'
                            itemStyle.color = '#047857'
                          } else if (isChosen && !isCorrectKey) {
                            itemStyle.background = '#FEF2F2'
                            itemStyle.borderColor = '#EF4444'
                            itemStyle.color = '#B91C1C'
                          }
                        }

                        return (
                          <div
                            key={key}
                            style={itemStyle}
                            onClick={() => handleSelectReTestOption(q.id, key)}
                          >
                            <strong>({key})</strong>
                            <span>{val}</span>
                            {reTestSubmitted && isCorrectKey && <span style={{ marginLeft: 'auto', fontWeight: 700, color: '#047857' }}>✓ Correct</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
              {!reTestSubmitted ? (
                <button
                  type="button"
                  className={styles.btnReTestLauncher}
                  onClick={handleSubmitReTest}
                  disabled={Object.keys(reTestAnswers).length === 0}
                >
                  Submit Retest & Score →
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.btnReTestLauncher}
                  onClick={() => setReTestOpen(false)}
                >
                  Finish & Update Vault
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Leitner Flashcard Modal */}
      {flashcardOpen && dueQuestions[flashcardIdx] && (
        <div className={styles.flashcardModalOverlay} role="dialog" aria-modal="true">
          <div className={styles.flashcardCard}>
            <div className={styles.flashcardProgress}>
              <span>Card {flashcardIdx + 1} of {dueQuestions.length}</span>
              <span>{dueQuestions[flashcardIdx].subject}</span>
            </div>

            <p className={styles.flashcardQuestion}>
              {dueQuestions[flashcardIdx].questionText}
            </p>

            {!flashcardRevealed ? (
              <button
                type="button"
                className={styles.btnReTestLauncher}
                onClick={() => setFlashcardRevealed(true)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                👀 Reveal Official Answer & Key
              </button>
            ) : (
              <div className={styles.flashcardRevealBox}>
                <div style={{ fontSize: '13px', color: '#065F46', fontWeight: 800 }}>
                  ✓ Official Answer: Option ({dueQuestions[flashcardIdx].correctAnswer})
                </div>
                <div style={{ fontSize: '13px', color: '#1E293B' }}>
                  {dueQuestions[flashcardIdx].options?.[dueQuestions[flashcardIdx].correctAnswer]}
                </div>
                {dueQuestions[flashcardIdx].explanation && (
                  <div style={{ fontSize: '12px', color: '#7C2D12', marginTop: '4px' }}>
                    <strong>Explanation:</strong> {dueQuestions[flashcardIdx].explanation}
                  </div>
                )}
              </div>
            )}

            {flashcardRevealed && (
              <div className={styles.flashcardActions}>
                <button
                  type="button"
                  className={styles.btnFlashcardRemember}
                  onClick={() => handleFlashcardAnswer(true)}
                >
                  ✓ I Remembered (लक्षात राहिले)
                </button>
                <button
                  type="button"
                  className={styles.btnFlashcardForgot}
                  onClick={() => handleFlashcardAnswer(false)}
                >
                  ✗ I Forgot (विसरलो)
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setFlashcardOpen(false)}
              style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '12px', cursor: 'pointer', marginTop: '6px' }}
            >
              Exit Flashcards
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
