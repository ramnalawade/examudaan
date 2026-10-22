// ============================================================
// components/BlogEngagementHub.js — Client-Side Engagement Engine
// Features: 10-Min Focus Study Sprint Timer, Aspirant Self-Audit
// Checklist, and Contextual Practice Hub (PYQs, MPSC Papers, Mocks, Tools)
// ============================================================

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './BlogEngagementHub.module.css'

export default function BlogEngagementHub({
  postSlug = '',
  category = '',
  primaryKeyword = '',
  relatedResources = null,
}) {
  // ── 1. 10-Minute Focus Timer State ──
  const INITIAL_TIME = 600 // 10 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [timerFinished, setTimerFinished] = useState(false)

  useEffect(() => {
    let timer = null
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      setTimerFinished(true)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, timeLeft])

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(INITIAL_TIME)
    setTimerFinished(false)
  }

  // ── 2. Aspirant Self-Audit Checklist State ──
  const defaultChecklist = [
    { id: 'pay_matrix', label: 'Checked official 7th Pay Commission S-Level & in-hand monthly salary breakdown' },
    { id: 'syllabus_topics', label: 'Noted exam stage pattern, negative marking penalty (-0.25) & high-yield modules' },
    { id: 'age_relax', label: 'Verified age limit criteria, category relaxations & horizontal reservation eligibility' },
    { id: 'solve_pyq', label: 'Attempted at least 5 chapter-wise solved PYQ questions on this subject' },
    { id: 'cbt_mock', label: 'Bookmarked official question papers or scheduled a free 60-min CBT mock simulator' },
  ]

  const storageKey = `eu_blog_chk_${postSlug || 'default'}`
  const [checklist, setChecklist] = useState(defaultChecklist)
  const [checkedIds, setCheckedIds] = useState({})
  const progressFillRef = useRef(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setCheckedIds(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
  }, [storageKey])

  const toggleCheck = id => {
    setCheckedIds(prev => {
      const updated = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }

  const completedCount = Object.values(checkedIds).filter(Boolean).length
  const progressPct = Math.round((completedCount / checklist.length) * 100)

  useEffect(() => {
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${progressPct}%`
    }
  }, [progressPct])

  // ── 3. Targeted Practice Hub Resources ──
  // Fallbacks tailored to categories if not explicitly passed
  const resources = relatedResources || getFallbackResources(category, primaryKeyword)
  const [activeTab, setActiveTab] = useState('pyqs')

  return (
    <div className={styles.engagementHub}>
      {/* ── Focus Study Sprint ── */}
      <div className={styles.timerCard}>
        <div className={styles.timerLeft}>
          <div className={styles.timerIconBox}>
            <span className={`material-symbols-outlined ${styles.timerIcon}`}>
              {timerFinished ? 'celebration' : 'timer'}
            </span>
          </div>
          <div>
            <h3 className={styles.timerTitle}>
              {timerFinished ? '🎉 10-Minute Deep Prep Sprint Completed!' : 'Active Reading Sprint: 10-Minute Study Timer'}
            </h3>
            <p className={styles.timerSubtitle}>
              {timerFinished
                ? 'Great focus! Now consolidate your understanding by testing yourself with the PYQs below.'
                : 'Commit 10 undistracted minutes to absorb this entire blueprint and note key high-yield topics.'}
            </p>
          </div>
        </div>

        <div className={styles.timerRight}>
          <div className={styles.timerDisplay}>
            {formatTime(timeLeft)}
          </div>
          <button
            type="button"
            className={styles.timerBtn}
            onClick={() => setIsRunning(!isRunning)}
          >
            <span className={`material-symbols-outlined ${styles.btnIcon}`}>
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isRunning ? 'Pause' : timeLeft < INITIAL_TIME ? 'Resume' : 'Start Sprint'}</span>
          </button>
          {timeLeft < INITIAL_TIME && (
            <button
              type="button"
              className={styles.timerResetBtn}
              onClick={resetTimer}
              title="Reset 10-minute timer"
            >
              <span className={`material-symbols-outlined ${styles.resetIcon}`}>refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Aspirant Self-Audit Checklist ── */}
      <div className={styles.checklistCard}>
        <div className={styles.checklistHeader}>
          <h3 className={styles.checklistTitle}>
            <span className={`material-symbols-outlined ${styles.primaryIcon}`}>checklist</span>
            <span>Aspirant 5-Point Blueprint Mastery Checklist</span>
          </h3>
          <span className={styles.checklistBadge}>
            {completedCount} of {checklist.length} Completed ({progressPct}%)
          </span>
        </div>

        <div className={styles.progressBarTrack}>
          <div ref={progressFillRef} className={styles.progressBarFill} />
        </div>

        <div className={styles.checklistItems}>
          {checklist.map(item => {
            const isDone = !!checkedIds[item.id]
            return (
              <label key={item.id} className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleCheck(item.id)}
                  className={styles.checkboxInput}
                />
                <span className={`${styles.checkLabel} ${isDone ? styles.checkLabelDone : ''}`}>
                  {item.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* ── Targeted Practice Hub ── */}
      <div className={styles.practiceHubCard}>
        <div className={styles.hubHeader}>
          <h3 className={styles.hubTitle}>
            <span className={`material-symbols-outlined ${styles.primaryIcon}`}>hub</span>
            <span>Contextual Practice Hub: Solved PYQs, Papers & CBT Mocks</span>
          </h3>
          <p className={styles.hubSubtitle}>
            Jump directly into verified resources specifically matching the concepts discussed in this guide.
          </p>
        </div>

        {/* Tab Controls */}
        <div className={styles.resourceTabs}>
          <button
            type="button"
            className={`${styles.resourceTab} ${activeTab === 'pyqs' ? styles.activeResourceTab : ''}`}
            onClick={() => setActiveTab('pyqs')}
          >
            <span className={`material-symbols-outlined ${styles.tabIcon}`}>history_edu</span>
            <span>Solved PYQ Bank ({resources.pyqs?.length || 0})</span>
          </button>
          <button
            type="button"
            className={`${styles.resourceTab} ${activeTab === 'mpsc' ? styles.activeResourceTab : ''}`}
            onClick={() => setActiveTab('mpsc')}
          >
            <span className={`material-symbols-outlined ${styles.tabIcon}`}>description</span>
            <span>Official Papers & Keys ({resources.mpscPapers?.length || 0})</span>
          </button>
          <button
            type="button"
            className={`${styles.resourceTab} ${activeTab === 'mocks' ? styles.activeResourceTab : ''}`}
            onClick={() => setActiveTab('mocks')}
          >
            <span className={`material-symbols-outlined ${styles.tabIcon}`}>quiz</span>
            <span>CBT Mock Tests ({resources.mockTests?.length || 0})</span>
          </button>
          <button
            type="button"
            className={`${styles.resourceTab} ${activeTab === 'tools' ? styles.activeResourceTab : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            <span className={`material-symbols-outlined ${styles.tabIcon}`}>calculate</span>
            <span>Calculators & Portals ({resources.tools?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className={styles.resourceGrid}>
          {activeTab === 'pyqs' && (resources.pyqs || []).map((item, idx) => (
            <Link key={idx} href={item.link} className={styles.resourceCard}>
              <div className={styles.cardTopRow}>
                <span className={styles.resBadge}>{item.badge || 'Solved MCQs'}</span>
                <span className={`material-symbols-outlined ${styles.resIcon}`}>arrow_forward</span>
              </div>
              <h4 className={styles.resTitle}>{item.title}</h4>
              <div className={styles.resActionRow}>
                <span>Practice Topic MCQs</span>
                <span>→</span>
              </div>
            </Link>
          ))}

          {activeTab === 'mpsc' && (resources.mpscPapers || []).map((item, idx) => (
            <Link key={idx} href={item.link} className={styles.resourceCard}>
              <div className={styles.cardTopRow}>
                <span className={styles.resBadge}>{item.badge || 'Official PDF'}</span>
                <span className={`material-symbols-outlined ${styles.resIcon}`}>visibility</span>
              </div>
              <h4 className={styles.resTitle}>{item.title}</h4>
              <div className={styles.resActionRow}>
                <span>Open Clean Viewer</span>
                <span>→</span>
              </div>
            </Link>
          ))}

          {activeTab === 'mocks' && (resources.mockTests || []).map((item, idx) => (
            <Link key={idx} href={item.link} className={styles.resourceCard}>
              <div className={styles.cardTopRow}>
                <span className={styles.resBadge}>{item.badge || 'Timed CBT'}</span>
                <span className={`material-symbols-outlined ${styles.resIcon}`}>bolt</span>
              </div>
              <h4 className={styles.resTitle}>{item.title}</h4>
              <div className={styles.resActionRow}>
                <span>Launch Mock Test</span>
                <span>→</span>
              </div>
            </Link>
          ))}

          {activeTab === 'tools' && (resources.tools || []).map((item, idx) => (
            <Link key={idx} href={item.link} className={styles.resourceCard}>
              <div className={styles.cardTopRow}>
                <span className={styles.resBadge}>{item.badge || 'Interactive'}</span>
                <span className={`material-symbols-outlined ${styles.resIcon}`}>calculate</span>
              </div>
              <h4 className={styles.resTitle}>{item.title}</h4>
              <div className={styles.resActionRow}>
                <span>Calculate & Explore</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Smart Resource Fallback Resolver ──
function getFallbackResources(category = '', primaryKeyword = '') {
  const kw = (primaryKeyword || '').toLowerCase()

  if (kw.includes('police')) {
    return {
      pyqs: [
        { title: 'Maharashtra & India Geography PYQs', link: '/pyq/geography', badge: '122+ MCQs' },
        { title: 'Modern History & Social Reformers PYQs', link: '/pyq/history', badge: '129+ MCQs' },
        { title: 'Arithmetic & Reasoning PYQ Drill', link: '/pyq/maths', badge: '100+ MCQs' },
      ],
      mpscPapers: [
        { title: 'Police Sub-Inspector (PSI) 2024 Exam Paper', link: '/mpsc-pyq', badge: 'MPSC Paper' },
        { title: 'Police Bharti 2024 Question Paper & Model Key', link: '/question-papers', badge: 'Official Key' },
        { title: 'MPSC PSI 2023 Final Answer Key (Paper 1 & 2)', link: '/mpsc-pyq', badge: 'Final Key' },
      ],
      mockTests: [
        { title: 'Maharashtra Police Written 100-Question CBT Mock', link: '/mock-tests/maharashtra-police-written-mock', badge: '100 Qs / 90 Min' },
        { title: 'Daily 5-Minute Maharashtra Police Speed Quiz', link: '/daily-quiz', badge: 'Live Quiz' },
      ],
      tools: [
        { title: 'Police Bharti 150-Mark Composite Merit Calculator', link: '/police-calculator', badge: 'Ground + Written' },
        { title: '7th Pay In-Hand Salary Matrix for Constables & PSIs', link: '/salary-calculator', badge: 'S-6 & S-14' },
        { title: 'Active Maharashtra Police Vacancy Alerts', link: '/jobs', badge: 'Direct Alerts' },
      ],
    }
  }

  if (kw.includes('talathi') || kw.includes('tcs') || kw.includes('clerk') || kw.includes('gram sevak')) {
    return {
      pyqs: [
        { title: 'Marathi Grammar & Vyakaran Solved PYQs', link: '/pyq/marathi', badge: 'Walambe Model' },
        { title: 'English Vocabulary & Idioms Solved PYQs', link: '/pyq/english', badge: 'TCS iON Pattern' },
        { title: 'Indian Polity & 73rd/74th Amendment PYQs', link: '/pyq/polity', badge: '139+ MCQs' },
      ],
      mpscPapers: [
        { title: 'MPSC Clerk-Typist 2024 Group C Combined Paper', link: '/mpsc-pyq', badge: 'Official Paper' },
        { title: 'MPSC Tax Assistant & Clerk Final Answer Key', link: '/mpsc-pyq', badge: 'Official Key' },
        { title: 'Zilla Parishad & Saral Seva Past Question Papers', link: '/question-papers', badge: 'TCS Archive' },
      ],
      mockTests: [
        { title: 'Maharashtra Talathi TCS 100-Question CBT Simulation', link: '/mock-tests/maharashtra-talathi-tcs-mock', badge: '200 Marks / 120 Min' },
        { title: 'Daily Speed Arithmetic & Reasoning Drill', link: '/daily-quiz', badge: 'Daily Test' },
      ],
      tools: [
        { title: '7th Pay Level S-6 & S-8 Salary Calculator', link: '/salary-calculator', badge: 'Talathi & Clerk' },
        { title: 'TCS iON Response Sheet Key Score Calculator', link: '/score-calculator', badge: 'Instant Marks' },
        { title: 'Talathi & Clerk Category Cutoff Explorer', link: '/cutoffs', badge: '2019-2024 Cutoffs' },
      ],
    }
  }

  // Default MPSC Rajyaseva / Combined fallback
  return {
    pyqs: [
      { title: 'Indian Polity & Constitutional Articles PYQs', link: '/pyq/polity', badge: '139+ MCQs' },
      { title: 'Maharashtra History & Reformers PYQs', link: '/pyq/history', badge: '129+ MCQs' },
      { title: 'Western Ghats & River Systems Geography PYQs', link: '/pyq/geography', badge: '122+ MCQs' },
      { title: 'Indian Economy & Banking System PYQs', link: '/pyq/economy', badge: '132+ MCQs' },
    ],
    mpscPapers: [
      { title: 'MPSC Combined Group B & C Prelims 2024 Paper', link: '/mpsc-pyq', badge: 'Official PDF' },
      { title: 'MPSC Combined Group B 2024 1st & Final Answer Key', link: '/mpsc-pyq', badge: 'Final Key' },
      { title: 'MPSC Rajyaseva Prelims 2024 GS Paper 1 & Key', link: '/mpsc-pyq', badge: 'GS 100 Qs' },
      { title: 'MPSC Rajyaseva 2023 CSAT Paper & Answer Key', link: '/mpsc-pyq', badge: 'CSAT Paper' },
    ],
    mockTests: [
      { title: 'MPSC Combined Group B Prelims Full CBT Mock Test', link: '/mock-tests/mpsc-combined-full-prelims', badge: '100 Qs / 60 Min' },
      { title: 'SSC CGL Tier 1 Full CBT Simulation Mock', link: '/mock-tests/ssc-cgl-tier1-full', badge: '100 Qs / 200 Marks' },
      { title: 'Daily 5-Minute Active Recall Quiz', link: '/daily-quiz', badge: 'ExamUdaan Quiz' },
    ],
    tools: [
      { title: '7th Pay In-Hand Salary Calculator (S-1 to S-31)', link: '/salary-calculator', badge: '50% DA & HRA' },
      { title: '10-Year MPSC Category Cutoff Explorer', link: '/cutoffs', badge: 'MPSC Trends' },
      { title: 'Official MPSC State Services Syllabus Portal', link: '/syllabus/mpsc-state-services', badge: 'Full Syllabus' },
      { title: 'Browse Active Maharashtra Govt Job Recruitments', link: '/jobs', badge: 'Live Feed' },
    ],
  }
}
