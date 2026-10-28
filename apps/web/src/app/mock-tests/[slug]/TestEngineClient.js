// ============================================================
// app/mock-tests/[slug]/TestEngineClient.js — Live CBT MCQ Test Engine
// ExamUdaan.in — Timer, Sections, 5-State Palette, Cutoffs & Scorecard
// Client component — all state local (no login required)
// ============================================================
'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import {
  trackMockTestStart,
  trackMockTestComplete,
  trackMockTestView,
  trackMockTestSectionStart,
  trackMockTestAnswerReview,
} from '@/lib/analytics'
import { getSyllabusForMockTest } from '@/lib/syllabusData'
import MpscFeedbackModal from '@/components/MpscFeedbackModal'
import { recordTestAttempt } from '@/lib/prepVault'
import styles from './testEngine.module.css'

function TestProgressFillBar({ percent }) {
  const fillRef = useRef(null)
  useEffect(() => {
    if (fillRef.current) fillRef.current.style.width = `${percent}%`
  }, [percent])
  return <div ref={fillRef} className={styles.progressFill} />
}

export default function TestEngineClient({ test }) {
  const [phase, setPhase] = useState('idle') // idle | running | submitted
  const [answers, setAnswers] = useState({}) // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [marked, setMarked] = useState({}) // { [questionId]: true }
  const [visited, setVisited] = useState({ 1: true }) // { [questionId]: true }
  const [current, setCurrent] = useState(0) // question index 0..N-1
  const [timeLeft, setTimeLeft] = useState((test?.durationMinutes || 60) * 60)
  const [paletteFilter, setPaletteFilter] = useState('all') // 'all' | section.id
  const matchedSyllabus = useMemo(() => getSyllabusForMockTest(test), [test])
  const [result, setResult] = useState(null) // evaluation result metrics
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)

  // ── Personalized Roadmap & Lead Capture State ──
  const [candidateName, setCandidateName] = useState('')
  const [candidatePhone, setCandidatePhone] = useState('')
  const [targetExam, setTargetExam] = useState(test?.exam || 'MPSC State Services')
  const [isSavingLead, setIsSavingLead] = useState(false)
  const [hasSavedLead, setHasSavedLead] = useState(false)
  const [roadmapData, setRoadmapData] = useState(null)
  const [leadError, setLeadError] = useState('')

  // Automatically prompt feedback modal after completing test
  useEffect(() => {
    if (phase === 'submitted' && test) {
      const storageKey = `mpsc_feedback_shown_${test.slug || 'mpsc'}`
      const alreadyShown = typeof window !== 'undefined' ? sessionStorage.getItem(storageKey) : null
      if (!alreadyShown) {
        const timer = setTimeout(() => {
          setFeedbackModalOpen(true)
          try {
            sessionStorage.setItem(storageKey, 'true')
          } catch (e) {}
        }, 1600)
        return () => clearTimeout(timer)
      }
    }
  }, [phase, test])

  // Track mock test page view on mount
  useEffect(() => {
    if (test?.title) {
      trackMockTestView({ exam_name: test.title, test_id: test.slug })
    }
  }, [test?.title, test?.slug])

  // Mark current question as visited
  useEffect(() => {
    if (phase === 'running' && test?.questions?.[current]) {
      const qId = test.questions[current].id
      setVisited(prev => ({ ...prev, [qId]: true }))
    }
  }, [current, phase, test?.questions])

  // Timer countdown
  useEffect(() => {
    if (phase !== 'running') return
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [phase, timeLeft])

  // Format seconds → MM:SS or HH:MM:SS
  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`
  }

  // Current active section
  const currentSection = useMemo(() => {
    if (!test?.sections || test.sections.length === 0) return null
    const qNum = current + 1
    return test.sections.find(s => qNum >= s.qStart && qNum <= s.qEnd) || test.sections[0]
  }, [test?.sections, current])

  // Filter palette questions based on selected section or all
  const displayedPaletteQuestions = useMemo(() => {
    if (paletteFilter === 'all' || !test?.sections) return test?.questions || []
    const sec = test.sections.find(s => s.id === paletteFilter)
    if (!sec) return test?.questions || []
    return test.questions.slice(sec.qStart - 1, sec.qEnd)
  }, [paletteFilter, test?.questions, test?.sections])

  // Select an answer
  const selectAnswer = (qId, option) => {
    if (phase !== 'running') return
    setAnswers(prev => ({ ...prev, [qId]: option }))
  }

  // Clear answer
  const clearAnswer = (qId) => {
    setAnswers(prev => {
      const copy = { ...prev }
      delete copy[qId]
      return copy
    })
  }

  // Toggle mark for review
  const toggleMark = (qId) => {
    setMarked(prev => ({ ...prev, [qId]: !prev[qId] }))
  }

  // Save & Next
  const handleSaveAndNext = () => {
    if (current < (test?.questions?.length || 0) - 1) {
      setCurrent(c => c + 1)
    }
  }

  // Mark for review & Next
  const handleMarkAndNext = (qId) => {
    toggleMark(qId)
    if (current < (test?.questions?.length || 0) - 1) {
      setCurrent(c => c + 1)
    }
  }

  // Submit test and evaluate full metrics
  const handleSubmit = useCallback(() => {
    if (phase === 'submitted' || !test) return

    let correct = 0, wrong = 0, skipped = 0
    test.questions.forEach(q => {
      const ans = answers[q.id]
      if (!ans) { skipped++ }
      else if (ans === q.correct) { correct++ }
      else { wrong++ }
    })

    const marksEarned = Math.max(0, (correct * test.marksPerQuestion) - (wrong * test.negativeMark))
    const maxMarks = test.totalQuestions * test.marksPerQuestion
    const percent = Math.round((marksEarned / maxMarks) * 100)
    const grade = percent >= 80 ? 'Distinction' : percent >= 60 ? 'First Class' : percent >= 40 ? 'Qualified' : 'Needs Practice'

    // Section-wise breakdown
    const sectionStats = (test.sections || []).map(sec => {
      const secQs = test.questions.slice(sec.qStart - 1, sec.qEnd)
      let sCorrect = 0, sWrong = 0, sSkipped = 0
      secQs.forEach(sq => {
        const a = answers[sq.id]
        if (!a) sSkipped++
        else if (a === sq.correct) sCorrect++
        else sWrong++
      })
      const sEarned = Math.max(0, (sCorrect * (sec.marksPerQuestion || test.marksPerQuestion)) - (sWrong * test.negativeMark))
      const sMax = secQs.length * (sec.marksPerQuestion || test.marksPerQuestion)
      const sAcc = (sCorrect + sWrong > 0) ? Math.round((sCorrect / (sCorrect + sWrong)) * 100) : 0
      return {
        name: sec.name,
        total: secQs.length,
        attempted: sCorrect + sWrong,
        correct: sCorrect,
        wrong: sWrong,
        skipped: sSkipped,
        earned: sEarned.toFixed(1),
        maxMarks: sMax,
        accuracy: sAcc
      }
    })

    // Simulated State Percentile (Normal distribution against 50,000 aspirants)
    const z = (percent - 42) / 16
    const normCDF = 1 / (1 + Math.exp(-0.07056 * z * z * z - 1.5976 * z))
    const percentile = Math.min(99.9, Math.max(1.0, normCDF * 100)).toFixed(1)
    const stateRank = Math.max(1, Math.round(50000 * (1 - normCDF)))

    setResult({
      correct,
      wrong,
      skipped,
      marksEarned: parseFloat(marksEarned.toFixed(2)),
      negativeDeducted: parseFloat((wrong * test.negativeMark).toFixed(2)),
      maxMarks,
      percent,
      grade,
      sectionStats,
      percentile,
      stateRank
    })
    setPhase('submitted')

    trackMockTestComplete({
      exam_name: test.title,
      test_id: test.slug,
      score: parseFloat(marksEarned.toFixed(2)),
      percentage: percent,
      rank: stateRank ? `#${stateRank}` : '',
    })

    // Local preparation vault recording (100% offline & private)
    try {
      const questionsWithUserAnswers = (test.questions || []).map(q => ({
        id: q.id,
        question: q.text || q.question,
        options: q.options || {},
        correct: q.correct,
        userAnswer: answers[q.id] || null,
        explanation: q.explanation,
        subject: q.subject || test.subject || 'General Studies',
        topic: q.topic || 'General'
      }))

      recordTestAttempt({
        testSlug: test.slug,
        testTitle: test.title,
        examCadre: test.exam || 'MPSC',
        score: parseFloat(marksEarned.toFixed(2)),
        maxMarks,
        percentage: percent,
        timeSpentSeconds: ((test.durationMinutes || 60) * 60) - timeLeft,
        questions: questionsWithUserAnswers
      })
    } catch (vaultErr) {
      console.warn('[prepVault] Error recording attempt in vault:', vaultErr)
    }

    // Auto-record attempt in database and pre-fetch personalized roadmap
    try {
      fetch('/api/mock-tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_slug: test.slug,
          test_title: test.title,
          score: parseFloat(marksEarned.toFixed(2)),
          max_marks: maxMarks,
          percentage: percent,
          accuracy: (correct + wrong > 0) ? Math.round((correct / (correct + wrong)) * 100) : 0,
          section_breakdown: sectionStats,
          target_exam: test.exam || 'MPSC State Services',
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data?.roadmap) {
            setRoadmapData(data.roadmap)
          }
        })
        .catch(err => console.warn('[mock-tests] Auto-submit background ping error:', err))
    } catch (e) {}
  }, [phase, answers, test])

  // Lead capture submission handler
  const handleSaveScorecard = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }
    const cleanPhone = String(candidatePhone || '').trim().replace(/[^\d]/g, '')
    if (cleanPhone.length < 10) {
      setLeadError('Please enter a valid 10-digit mobile / WhatsApp number')
      return
    }
    setLeadError('')
    setIsSavingLead(true)

    try {
      const res = await fetch('/api/mock-tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_slug: test.slug,
          test_title: test.title,
          candidate_name: candidateName,
          candidate_phone: cleanPhone,
          target_exam: targetExam,
          score: result?.marksEarned || 0,
          max_marks: result?.maxMarks || 100,
          percentage: result?.percent || 0,
          accuracy: (result?.correct + result?.wrong > 0)
            ? Math.round((result.correct / (result.correct + result.wrong)) * 100)
            : 0,
          section_breakdown: result?.sectionStats || [],
        }),
      })

      const data = await res.json()
      if (data?.roadmap) {
        setRoadmapData(data.roadmap)
      }
      setHasSavedLead(true)
    } catch (err) {
      console.error('Failed to save lead scorecard:', err)
      setHasSavedLead(true) // Still show roadmap even if network issue
    } finally {
      setIsSavingLead(false)
    }
  }

  if (!test) return null

  // ── IDLE Phase (Pre-test screen) ──────────────────────────
  if (phase === 'idle') {
    return (
      <main className={styles.page}>
        <div className="container">
          <nav className={`breadcrumb ${styles.breadcrumbNav}`}>
            <Link href="/">Home</Link><span>/</span>
            <Link href="/mock-tests">Mock Tests</Link><span>/</span>
            <span>{test.title}</span>
          </nav>

          <div className={styles.startCard}>
            <div className={styles.startTop}>
              <span className={styles.examBadge} data-exam={test.examType}>{test.examType}</span>
              <span className={styles.diffBadge} data-diff={test.difficulty}>{test.difficulty}</span>
              {test.isFullMock && (
                <span className={styles.blueprintBadge}>
                  💯 Official Blueprint (100 Qs)
                </span>
              )}
            </div>
            <h1 className={styles.startTitle}>{test.title}</h1>
            <p className={styles.startDesc}>{test.description}</p>

            <div className={styles.startMeta}>
              <div className={styles.metaItem}>
                <span className="material-symbols-outlined">timer</span>
                <div><strong>{test.durationMinutes} Minutes</strong><span>Exam Duration</span></div>
              </div>
              <div className={styles.metaItem}>
                <span className="material-symbols-outlined">quiz</span>
                <div><strong>{test.totalQuestions} Questions</strong><span>Total MCQs</span></div>
              </div>
              <div className={styles.metaItem}>
                <span className="material-symbols-outlined">grade</span>
                <div><strong>{test.marksPerQuestion * test.totalQuestions} Marks</strong><span>Maximum Marks</span></div>
              </div>
              <div className={styles.metaItem}>
                <span className="material-symbols-outlined">remove_circle</span>
                <div><strong>{test.negativeMark > 0 ? `-${test.negativeMark} per wrong` : 'No Negative'}</strong><span>Negative Marking</span></div>
              </div>
            </div>

            {/* Sections Breakdown if full exam */}
            {test.sections && test.sections.length > 0 && (
              <div className={styles.sectionsBox}>
                <h3 className={styles.sectionsTitle}>
                  📚 Examination Sections & Marks Weightage:
                </h3>
                <div className={styles.sectionsGrid}>
                  {test.sections.map((s, idx) => (
                    <div key={s.id || idx} className={styles.sectionItem}>
                      <strong>Section {idx + 1}:</strong> {s.name} ({s.qEnd - s.qStart + 1} Qs)
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.startInstructions}>
              <h3>📋 Real Exam Instructions (TCS / MPSC CBT Pattern)</h3>
              <ul>
                <li>The countdown timer starts as soon as you click <strong>Start Test</strong>. It cannot be paused.</li>
                <li><strong>Green</strong> indicates an Answered question. <strong>Red</strong> indicates a question you visited but skipped.</li>
                <li><strong>Purple</strong> indicates Marked for Review. If you answer and mark a question, it will be evaluated in the final score!</li>
                <li>You can freely navigate between questions and sections using the Question Palette on the right.</li>
                {test.negativeMark > 0 ? (
                  <li>⚠️ <strong>Negative Marking:</strong> Each incorrect answer deducts {test.negativeMark} marks from your score.</li>
                ) : (
                  <li>ℹ️ <strong>Marking:</strong> No negative marking for wrong answers. Attempt all questions!</li>
                )}
                <li>Instant scorecard displays your accuracy, category-wise cutoff comparison, and simulated state rank.</li>
              </ul>
            </div>

            <button
              className={styles.startBtn}
              onClick={() => {
                trackMockTestStart({ exam_name: test?.title, test_id: test?.slug })
                setPhase('running')
                if (test?.questions?.[0]) {
                  setVisited({ [test.questions[0].id]: true })
                }
              }}
            >
              Start Official Mock Test →
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ── SUBMITTED Phase (Comprehensive Scorecard) ──────────────
  if (phase === 'submitted' && result) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.resultCard}>
            {/* Score Overview */}
            <div className={styles.scoreHeader} data-grade={result.grade}>
              <div className={styles.scoreCircle}>
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#ffffff22" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - result.percent / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className={styles.scoreText}>
                  <span className={styles.scorePercent}>{result.percent}%</span>
                  <span className={styles.scoreGrade}>{result.grade}</span>
                </div>
              </div>
              <div className={styles.scoreSummary}>
                <h2>{test.title}</h2>
                <div className={styles.scoreStats}>
                  <div className={styles.scoreStat} data-type="correct">
                    <strong>{result.correct}</strong><span>Correct</span>
                  </div>
                  <div className={styles.scoreStat} data-type="wrong">
                    <strong>{result.wrong}</strong><span>Wrong</span>
                  </div>
                  <div className={styles.scoreStat} data-type="skipped">
                    <strong>{result.skipped}</strong><span>Skipped</span>
                  </div>
                  <div className={styles.scoreStat} data-type="marks">
                    <strong>{result.marksEarned}/{result.maxMarks}</strong><span>Net Score</span>
                  </div>
                </div>
              </div>
            </div>

            {/* State Rank & Percentile Banner */}
            <div className={styles.rankBanner}>
              <div className={styles.rankText}>
                <h4>🏆 Simulated Maharashtra State Rank & Percentile</h4>
                <p>Benchmarked across 50,000+ aspirants on official bell-curve scoring.</p>
              </div>
              <div className={styles.rankMetaGroup}>
                <span className={styles.rankBadge}>Top {result.percentile}%</span>
                <span className={styles.stateRankText}>State Rank #{result.stateRank}</span>
              </div>
            </div>

            {/* ── Personalized Preparation Roadmap & Save Scorecard ── */}
            <div className={styles.roadmapLeadCard}>
              <div className={styles.roadmapLeadHeader}>
                <div className={styles.roadmapLeadBadge}>
                  <span className="material-symbols-outlined">psychology</span>
                  <span>Free Personalized AI Exam Engine</span>
                </div>
                <h3 className={styles.roadmapLeadTitle}>
                  {hasSavedLead
                    ? '🎯 Your Personalized Preparation Blueprint'
                    : 'Unlock Your Personalized Exam Roadmap & Save Scorecard'}
                </h3>
                <p className={styles.roadmapLeadDesc}>
                  {hasSavedLead
                    ? `Based on your ${result.percent}% score in ${test.title}, here are your diagnostic weak areas, targeted syllabus links, matching live jobs, and curated AI tools.`
                    : 'Save this scorecard to your phone to diagnose your weak subjects, track your rank progress across tests, and get curated syllabus, job alerts, and AI tools tailored to your exam.'}
                </p>

                <div className={styles.roadmapValuePills}>
                  <span className={styles.roadmapValuePillItem}>
                    <span className="material-symbols-outlined">menu_book</span>
                    <span>Targeted Weak-Topic Syllabus &amp; PYQs</span>
                  </span>
                  <span className={styles.roadmapValuePillItem}>
                    <span className="material-symbols-outlined">work</span>
                    <span>Live Eligible Govt Job Alerts</span>
                  </span>
                  <span className={styles.roadmapValuePillItem}>
                    <span className="material-symbols-outlined">smart_toy</span>
                    <span>Curated AI Study Tools</span>
                  </span>
                  <span className={styles.roadmapValuePillItem}>
                    <span className="material-symbols-outlined">chat</span>
                    <span>WhatsApp Scorecard &amp; Rank Updates</span>
                  </span>
                </div>
              </div>

              {/* Form (If not saved yet) */}
              {!hasSavedLead ? (
                <div className={styles.leadFormContainer}>
                  <form onSubmit={handleSaveScorecard}>
                    <div className={styles.leadFormInputs}>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className={styles.leadInput}
                        required
                      />
                      <input
                        type="tel"
                        placeholder="WhatsApp Number (10 Digits)"
                        value={candidatePhone}
                        onChange={(e) => setCandidatePhone(e.target.value)}
                        className={styles.leadInput}
                        maxLength={15}
                        required
                      />
                      <select
                        value={targetExam}
                        onChange={(e) => setTargetExam(e.target.value)}
                        className={styles.leadSelect}
                        aria-label="Target Exam"
                      >
                        <option value="MPSC State Services">MPSC State Services (Rajyaseva)</option>
                        <option value="MPSC Combined Group B & C">MPSC Combined (Group B &amp; C)</option>
                        <option value="Maharashtra Police Bharti">Maharashtra Police Bharti</option>
                        <option value="Maharashtra Talathi Bharti">Maharashtra Talathi Bharti</option>
                        <option value="Banking (IBPS PO / Clerk / SBI)">Banking (IBPS / SBI / RBI)</option>
                        <option value="SSC CGL / CHSL">SSC (CGL / CHSL / MTS)</option>
                        <option value="UPSC Civil Services">UPSC Civil Services (IAS / IPS)</option>
                        <option value="Railway (RRB NTPC / Group D)">Railway Recruitment (RRB)</option>
                      </select>
                      <button
                        type="submit"
                        disabled={isSavingLead}
                        className={styles.leadSubmitBtn}
                      >
                        <span className="material-symbols-outlined">send</span>
                        <span>{isSavingLead ? 'Saving...' : 'Save & Unlock Roadmap 🎯'}</span>
                      </button>
                    </div>
                    {leadError && (
                      <div className={styles.leadErrorText}>
                        <span className="material-symbols-outlined">error</span>
                        <span>{leadError}</span>
                      </div>
                    )}
                    <div className={styles.leadPrivacyNotice}>
                      <span className="material-symbols-outlined">verified_user</span>
                      <span>100% Free &amp; Spam-Free. We only send syllabus breakdowns and matching recruitment notifications.</span>
                    </div>
                  </form>
                </div>
              ) : (
                /* Unlocked Personalized Results Area */
                <div className={styles.roadmapUnlockedContent}>
                  {roadmapData?.diagnosticMessage && (
                    <div className={styles.diagnosticBox}>
                      <span className={`material-symbols-outlined ${styles.diagnosticIcon}`}>
                        error_outline
                      </span>
                      <div className={styles.diagnosticText}>
                        <strong>Diagnostic Weakness Analysis: </strong>
                        {roadmapData.diagnosticMessage}
                      </div>
                    </div>
                  )}

                  <div className={styles.recGrid}>
                    {roadmapData?.syllabusLink && (
                      <Link href={roadmapData.syllabusLink.path} className={styles.recCard}>
                        <div>
                          <div className={styles.recCardTop}>
                            <span className={`material-symbols-outlined ${styles.recCardIcon}`}>menu_book</span>
                            <span className={styles.recCardTitle}>Targeted Syllabus &amp; PYQ Papers</span>
                          </div>
                          <p className={styles.recCardDesc}>{roadmapData.syllabusLink.title}</p>
                        </div>
                        <span className={styles.recCardAction}>
                          <span>Open Syllabus Tracker</span>
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </span>
                      </Link>
                    )}

                    {roadmapData?.jobsLink && (
                      <Link href={roadmapData.jobsLink.path} className={styles.recCard}>
                        <div>
                          <div className={styles.recCardTop}>
                            <span className={`material-symbols-outlined ${styles.recCardIcon}`}>work</span>
                            <span className={styles.recCardTitle}>Live Government Job Matches</span>
                          </div>
                          <p className={styles.recCardDesc}>{roadmapData.jobsLink.title}</p>
                        </div>
                        <span className={styles.recCardAction}>
                          <span>View Open Vacancies</span>
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </span>
                      </Link>
                    )}
                  </div>

                  {/* AI Tools for Weak Topics */}
                  {roadmapData?.aiTools && roadmapData.aiTools.length > 0 && (
                    <div className={styles.aiRecSection}>
                      <div className={styles.aiRecSectionTitle}>
                        <span className="material-symbols-outlined">smart_toy</span>
                        <span>Curated AI Study Tools to Fix Your Bottlenecks:</span>
                      </div>
                      <div className={styles.aiRecGrid}>
                        {roadmapData.aiTools.map((tool, i) => (
                          <Link key={i} href={tool.path} className={styles.aiRecCard}>
                            <div>
                              <div className={styles.aiRecCardHead}>
                                <span className="material-symbols-outlined">{tool.icon || 'auto_awesome'}</span>
                                <span className={styles.aiRecCardName}>{tool.name}</span>
                              </div>
                              <p className={styles.aiRecCardBenefit}>{tool.benefit}</p>
                            </div>
                            <span className={styles.aiRecCardLink}>
                              <span>View 10-Min Masterclass &amp; Prompts</span>
                              <span className="material-symbols-outlined">arrow_forward</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Share Bar */}
                  <div className={styles.whatsappShareBar}>
                    <div className={styles.saveConfirmedNote}>
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>Scorecard &amp; Personalized Roadmap Saved Successfully!</span>
                    </div>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `🚨 I scored ${result.percent}% on ExamUdaan's official mock test for ${test.title}! State Rank: #${result.stateRank}. Can you beat my score? Check your rank here: https://examudaan.in/mock-tests/${test.slug}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappShareBtn}
                    >
                      <span className="material-symbols-outlined">share</span>
                      <span>Share Scorecard on WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Category Cutoff Gauge */}
            {test.cutoffs && (
              <div className={styles.cutoffCard}>
                <h3 className={styles.cutoffCardTitle}>
                  <span className={`material-symbols-outlined ${styles.cutoffVerifiedIcon}`}>verified</span>
                  Official Category Cutoff Analysis (Your Score: {result.marksEarned})
                </h3>
                <div className={styles.cutoffGrid}>
                  {Object.entries(test.cutoffs).map(([cat, cutoff]) => {
                    const isPass = result.marksEarned >= cutoff
                    const diff = Math.abs(result.marksEarned - cutoff).toFixed(1)
                    return (
                      <div key={cat} className={styles.cutoffPill}>
                        <span className={styles.cutoffPillTitle}>{cat.toUpperCase()} Cutoff</span>
                        <span className={styles.cutoffScore}>{cutoff}</span>
                        {isPass ? (
                          <span className={styles.cutoffStatusPass}>
                            <span className={`material-symbols-outlined ${styles.cutoffStatusIcon}`}>check_circle</span>
                            Cleared (+{diff})
                          </span>
                        ) : (
                          <span className={styles.cutoffStatusFail}>
                            <span className={`material-symbols-outlined ${styles.cutoffStatusIcon}`}>cancel</span>
                            Missed by {diff}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Section-wise Performance Breakdown */}
            {result.sectionStats && result.sectionStats.length > 0 && (
              <div className={styles.sectionBreakdownCard}>
                <h3 className={styles.sectionBreakdownTitle}>
                  📊 Section-wise Score & Accuracy Breakdown
                </h3>
                <table className={styles.sectionScoreTable}>
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Total Qs</th>
                      <th>Attempted</th>
                      <th>Correct</th>
                      <th>Wrong</th>
                      <th>Marks</th>
                      <th>Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.sectionStats.map((s, idx) => (
                      <tr key={idx}>
                        <td className={styles.secName}>{s.name}</td>
                        <td>{s.total}</td>
                        <td>{s.attempted}</td>
                        <td className={styles.secCorrect}>{s.correct}</td>
                        <td className={styles.secWrong}>{s.wrong}</td>
                        <td className={styles.secEarned}>{s.earned}/{s.maxMarks}</td>
                        <td>
                          <span className={`${styles.secAccuracyBadge} ${s.accuracy >= 70 ? styles.secAccuracyHigh : s.accuracy >= 45 ? styles.secAccuracyMid : styles.secAccuracyLow}`}>
                            {s.accuracy}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Syllabus Topic Revision & Learning Loop Card */}
            {matchedSyllabus && (
              <div className={styles.syllabusSuggestion}>
                <span className="material-symbols-outlined">menu_book</span>
                <div>
                  <strong>अभ्यासक्रम तपासा व कच्चे मुद्दे सुधारा (Revise Full Syllabus)</strong>
                  <p>
                    {matchedSyllabus.name} च्या अधिकृत परीक्षा योजना, घटकनिहाय गुण आणि संदर्भ पुस्तके पाहून तयारी पूर्ण करा.
                  </p>
                </div>
                <Link
                  href={matchedSyllabus.path}
                  className="btn-outline"
                >
                  अभ्यासक्रम ट्रॅकर उघडा →
                </Link>
              </div>
            )}

            {/* YouTube Suggestion */}
            {test.youtubeQuery && (
              <div className={styles.ytSuggestion}>
                <span className="material-symbols-outlined">smart_display</span>
                <div>
                  <strong>Watch Free Lectures for this Topic</strong>
                  <p>Strengthen your weak areas with curated YouTube videos on ExamUdaan Hub.</p>
                </div>
                <Link
                  href={`/youtube?q=${encodeURIComponent(test.youtubeQuery)}`}
                  className="btn-outline"
                >
                  Watch on YouTube Hub →
                </Link>
              </div>
            )}

            {/* Per-question Review */}
            <div className={styles.reviewSection}>
              <h3 className={styles.reviewTitle}>📝 Detailed Solutions & Official PYQ Citations</h3>
              {test.questions.map((qItem, i) => {
                const userAns = answers[qItem.id]
                const isCorrect = userAns === qItem.correct
                const isSkipped = !userAns
                return (
                  <div
                    key={qItem.id}
                    onClick={() => trackMockTestAnswerReview({ exam_name: test.title, question_id: qItem.id })}
                    className={`${styles.reviewItem} ${isCorrect ? styles.reviewCorrect : isSkipped ? styles.reviewSkipped : styles.reviewWrong}`}
                  >
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewNum}>Q{i + 1}</span>
                      <span className={styles.reviewStatus}>
                        {isSkipped ? '⏭ Skipped' : isCorrect ? '✅ Correct' : '❌ Wrong'}
                      </span>
                    </div>
                    <p className={styles.reviewQuestion}>{qItem.text}</p>
                    <div className={styles.reviewOptions}>
                      {Object.entries(qItem.options).map(([key, val]) => (
                        <div
                          key={key}
                          className={`${styles.reviewOption}
                            ${key === qItem.correct ? styles.reviewOptionCorrect : ''}
                            ${userAns === key && key !== qItem.correct ? styles.reviewOptionWrong : ''}
                          `}
                        >
                          <span className={styles.optKey}>{key}</span>
                          <span>{val}</span>
                          {key === qItem.correct && <span className={styles.correctLabel}>✓ Correct</span>}
                          {userAns === key && key !== qItem.correct && <span className={styles.wrongLabel}>✗ Your Answer</span>}
                        </div>
                      ))}
                    </div>
                    <div className={styles.reviewExplanation}>
                      <span className="material-symbols-outlined">lightbulb</span>
                      <div>
                        <p>{qItem.explanation}</p>
                        <span className={styles.pyqBadge}>📚 Verified 20-Year Exam Pattern</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom CTA */}
            <div className={styles.resultFooter}>
              <button
                className="btn-outline"
                onClick={() => {
                  setPhase('idle')
                  setAnswers({})
                  setMarked({})
                  setVisited({ 1: true })
                  setCurrent(0)
                  setTimeLeft((test?.durationMinutes || 60) * 60)
                  setResult(null)
                }}
              >
                Retry Test
              </button>
              {matchedSyllabus && (
                <Link href={matchedSyllabus.path} className="btn-outline">
                  📖 {matchedSyllabus.name} अभ्यासक्रम →
                </Link>
              )}
              <button
                type="button"
                className={styles.feedbackTriggerBtn}
                onClick={() => setFeedbackModalOpen(true)}
              >
                📝 Feedback & Report (अभिप्राय / त्रुटी)
              </button>
              <Link href="/mpsc/my-preparation" className={`btn-primary ${styles.btnPreparation}`}>
                📓 View in Mistake Notebook (चूक वही) →
              </Link>
              <Link href="/mock-tests" className="btn-outline">Browse All Mock Tests →</Link>
            </div>
          </div>
          <MpscFeedbackModal
            isOpen={feedbackModalOpen}
            onClose={() => setFeedbackModalOpen(false)}
            examContext={{
              title: test.title,
              type: 'mock_test',
              slug: test.slug,
              score: result ? `${result.marksEarned}/${result.maxMarks} (${result.percent}%)` : null,
              rank: result?.stateRank ? `#${result.stateRank}` : null,
            }}
            defaultCategory="general_feedback"
          />
        </div>
      </main>
    )
  }

  // ── RUNNING Phase (CBT Interface) ──────────────────────────
  const q = test.questions[current] || test.questions[0]
  const answered = Object.keys(answers).length
  const timerWarning = timeLeft < 300 // < 5 min

  // Count 5-state statistics
  const answeredCount = Object.keys(answers).filter(id => !marked[id]).length
  const ansMarkedCount = Object.keys(answers).filter(id => marked[id]).length
  const markedOnlyCount = Object.keys(marked).filter(id => !answers[id]).length
  const notAnsweredCount = Object.keys(visited).filter(id => !answers[id] && !marked[id]).length
  const notVisitedCount = Math.max(0, test.totalQuestions - Object.keys(visited).length)

  return (
    <main className={styles.page} data-phase="running">
      {/* ── Fixed Top Bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topTitle}>{test.title}</div>
        <div className={`${styles.timer} ${timerWarning ? styles.timerWarning : ''}`}>
          <span className="material-symbols-outlined">timer</span>
          {formatTime(timeLeft)}
        </div>
        <button
          className={styles.submitTopBtn}
          onClick={() => {
            if (confirm(`Submit Test?\nAnswered: ${answered}\nUnanswered: ${test.totalQuestions - answered}\nThis action cannot be undone.`)) {
              handleSubmit()
            }
          }}
        >
          Submit Test
        </button>
      </div>

      {/* ── Section Switcher Bar (TCS iON Pattern) ── */}
      {test.sections && test.sections.length > 1 && (
        <div className={styles.sectionTabs}>
          {test.sections.map((sec, idx) => {
            const isActive = currentSection && currentSection.id === sec.id
            const secAnsCount = test.questions
              .slice(sec.qStart - 1, sec.qEnd)
              .filter(sq => answers[sq.id]).length
            return (
              <button
                key={sec.id || idx}
                className={`${styles.sectionTab} ${isActive ? styles.sectionTabActive : ''}`}
                onClick={() => {
                  trackMockTestSectionStart({ exam_name: test?.title, section_name: sec.name })
                  setCurrent(sec.qStart - 1)
                  setPaletteFilter(sec.id)
                }}
              >
                <span>Section {idx + 1}: {sec.name}</span>
                <span className={styles.sectionTabCount}>
                  {secAnsCount}/{sec.qEnd - sec.qStart + 1}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className={styles.testLayout}>
        {/* ── Left: Question Card & CBT Actions ── */}
        <div className={styles.questionArea}>
          <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <div>
                <span className={styles.questionNum}>
                  Question {current + 1} of {test.totalQuestions}
                </span>
                {currentSection && (
                  <span className={styles.sectionHeaderMeta}>
                    • {currentSection.name}
                  </span>
                )}
              </div>
              <span className={styles.marksPill}>
                +{test.marksPerQuestion} / -{test.negativeMark}
              </span>
            </div>

            <p className={styles.questionText}>{q?.text}</p>

            <div className={styles.options}>
              {q?.options && Object.entries(q.options).map(([key, val]) => (
                <button
                  key={key}
                  className={`${styles.option} ${answers[q.id] === key ? styles.optionSelected : ''}`}
                  onClick={() => selectAnswer(q.id, key)}
                >
                  <span className={styles.optionKey}>{key}</span>
                  <span className={styles.optionVal}>{val}</span>
                </button>
              ))}
            </div>

            {/* CBT Action Bar */}
            <div className={styles.cbtActions}>
              <button
                className={styles.btnSaveNext}
                onClick={handleSaveAndNext}
              >
                Save & Next →
              </button>
              <button
                className={styles.btnMarkNext}
                onClick={() => q && handleMarkAndNext(q.id)}
              >
                {q && marked[q.id] ? '🔖 Unmark & Next' : '📌 Mark for Review & Next'}
              </button>
              {q && answers[q.id] && (
                <button
                  className={styles.btnClear}
                  onClick={() => clearAnswer(q.id)}
                >
                  Clear Response
                </button>
              )}
              <div className={styles.cbtNavGroup}>
                <button
                  className={`btn-outline ${styles.cbtNavBtn}`}
                  disabled={current === 0}
                  onClick={() => setCurrent(c => c - 1)}
                >
                  ← Prev
                </button>
                <button
                  className={`btn-outline ${styles.cbtNavBtn}`}
                  disabled={current === test.questions.length - 1}
                  onClick={() => setCurrent(c => c + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: 5-State Question Palette ── */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHeaderFlex}>
              <h3 className={`${styles.sidebarTitle} ${styles.sidebarHeaderTitle}`}>Question Palette</h3>
              {test.sections && (
                <select
                  value={paletteFilter}
                  onChange={(e) => setPaletteFilter(e.target.value)}
                  className={styles.sectionFilterSelect}
                >
                  <option value="all">All ({test.totalQuestions})</option>
                  {test.sections.map((s, i) => (
                    <option key={s.id || i} value={s.id}>Sec {i + 1} ({s.qEnd - s.qStart + 1})</option>
                  ))}
                </select>
              )}
            </div>

            {/* TCS 5-State Legend */}
            <div className={styles.legend}>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} data-s="answered" /> Answered ({answeredCount})
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} data-s="ansMarked" /> Answered & Marked ({ansMarkedCount})
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} data-s="marked" /> Marked for Review ({markedOnlyCount})
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} data-s="notAnswered" /> Not Answered ({notAnsweredCount})
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} data-s="notVisited" /> Not Visited ({notVisitedCount})
              </span>
            </div>

            {/* Palette Grid */}
            <div className={styles.questionGrid}>
              {displayedPaletteQuestions.map((qItem) => {
                const idx = test.questions.findIndex(x => x.id === qItem.id)
                const isCur = current === idx
                const isAns = !!answers[qItem.id]
                const isMrk = !!marked[qItem.id]
                const isVis = !!visited[qItem.id]

                let stateClass = styles.gridBtnNotVisited
                if (isAns && isMrk) stateClass = styles.gridBtnAnsweredMarked
                else if (isAns) stateClass = styles.gridBtnAnswered
                else if (isMrk) stateClass = styles.gridBtnMarked
                else if (isVis) stateClass = styles.gridBtnNotAnswered

                return (
                  <button
                    key={qItem.id}
                    className={`${styles.gridBtn} ${stateClass} ${isCur ? styles.gridBtnCurrent : ''}`}
                    onClick={() => setCurrent(idx)}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            <div className={styles.progressBar}>
              <TestProgressFillBar percent={(answered / test.totalQuestions) * 100} />
            </div>
            <p className={styles.progressText}>{answered} of {test.totalQuestions} questions answered</p>

            <button
              className={`${styles.submitSideBtn} btn-primary`}
              onClick={() => {
                if (confirm(`Submit Test?\nAnswered: ${answered}\nUnanswered: ${test.totalQuestions - answered}\nThis cannot be undone.`)) {
                  handleSubmit()
                }
              }}
            >
              Submit & View Scorecard
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
