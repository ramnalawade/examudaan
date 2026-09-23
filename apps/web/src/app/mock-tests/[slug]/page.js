// ============================================================
// app/mock-tests/[slug]/page.js — Live CBT MCQ Test Engine
// ExamUdaan.in — Timer, Sections, 5-State Palette, Cutoffs & Scorecard
// Client component — all state local (no login required)
// ============================================================
'use client'
import { useState, useEffect, useCallback, use, useMemo } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTestBySlug } from '@/lib/mockTestsData'
import styles from './testEngine.module.css'

export default function TestEnginePage({ params }) {
  const resolvedParams = use(params)
  const test = getTestBySlug(resolvedParams.slug)

  // If test not found, show 404
  if (!test) notFound()

  const [phase, setPhase] = useState('idle') // idle | running | submitted
  const [answers, setAnswers] = useState({}) // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [marked, setMarked] = useState({}) // { [questionId]: true }
  const [visited, setVisited] = useState({ 1: true }) // { [questionId]: true }
  const [current, setCurrent] = useState(0) // question index 0..N-1
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60)
  const [result, setResult] = useState(null)
  const [paletteFilter, setPaletteFilter] = useState('all') // 'all' | section.id

  // Mark current question as visited
  useEffect(() => {
    if (phase === 'running' && test.questions[current]) {
      const qId = test.questions[current].id
      setVisited(prev => ({ ...prev, [qId]: true }))
    }
  }, [current, phase, test.questions])

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
    if (!test.sections || test.sections.length === 0) return null
    const qNum = current + 1
    return test.sections.find(s => qNum >= s.qStart && qNum <= s.qEnd) || test.sections[0]
  }, [test.sections, current])

  // Filter palette questions based on selected section or all
  const displayedPaletteQuestions = useMemo(() => {
    if (paletteFilter === 'all' || !test.sections) return test.questions
    const sec = test.sections.find(s => s.id === paletteFilter)
    if (!sec) return test.questions
    return test.questions.slice(sec.qStart - 1, sec.qEnd)
  }, [paletteFilter, test.questions, test.sections])

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
    if (current < test.questions.length - 1) {
      setCurrent(c => c + 1)
    }
  }

  // Mark for review & Next
  const handleMarkAndNext = (qId) => {
    toggleMark(qId)
    if (current < test.questions.length - 1) {
      setCurrent(c => c + 1)
    }
  }

  // Submit test and evaluate full metrics
  const handleSubmit = useCallback(() => {
    if (phase === 'submitted') return

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
  }, [phase, answers, test])

  // ── IDLE Phase (Pre-test screen) ──────────────────────────
  if (phase === 'idle') {
    return (
      <main className={styles.page}>
        <div className="container">
          <nav className="breadcrumb" style={{ padding: '16px 0' }}>
            <Link href="/">Home</Link><span>/</span>
            <Link href="/mock-tests">Mock Tests</Link><span>/</span>
            <span>{test.title}</span>
          </nav>

          <div className={styles.startCard}>
            <div className={styles.startTop}>
              <span className={styles.examBadge} data-exam={test.examType}>{test.examType}</span>
              <span className={styles.diffBadge} data-diff={test.difficulty}>{test.difficulty}</span>
              {test.isFullMock && (
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '100px', background: '#ecfdf5', color: '#047857', border: '1px solid #6ee7b7' }}>
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
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 20px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px', color: '#1e293b' }}>
                  📚 Examination Sections & Marks Weightage:
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {test.sections.map((s, idx) => (
                    <div key={s.id || idx} style={{ fontSize: '13px', color: '#475569', background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
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
                setPhase('running')
                setVisited({ [test.questions[0].id]: true })
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
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span className={styles.rankBadge}>Top {result.percentile}%</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>State Rank #{result.stateRank}</span>
              </div>
            </div>

            {/* Category Cutoff Gauge */}
            {test.cutoffs && (
              <div className={styles.cutoffCard}>
                <h3 className={styles.cutoffCardTitle}>
                  <span className="material-symbols-outlined" style={{ color: '#0284c7' }}>verified</span>
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
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>check_circle</span>
                            Cleared (+{diff})
                          </span>
                        ) : (
                          <span className={styles.cutoffStatusFail}>
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>cancel</span>
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
              <div style={{ margin: '0 36px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 20px', overflowX: 'auto' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px', color: '#1e293b' }}>
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
                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                        <td>{s.total}</td>
                        <td>{s.attempted}</td>
                        <td style={{ color: '#16a34a', fontWeight: 700 }}>{s.correct}</td>
                        <td style={{ color: '#dc2626' }}>{s.wrong}</td>
                        <td style={{ fontWeight: 700 }}>{s.earned}/{s.maxMarks}</td>
                        <td>
                          <span style={{ padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, background: s.accuracy >= 70 ? '#dcfce7' : s.accuracy >= 45 ? '#fef3c7' : '#fee2e2', color: s.accuracy >= 70 ? '#15803d' : s.accuracy >= 45 ? '#b45309' : '#b91c1c' }}>
                            {s.accuracy}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* YouTube Suggestion */}
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
                  setTimeLeft(test.durationMinutes * 60)
                  setResult(null)
                }}
              >
                Retry Test
              </button>
              <Link href="/mock-tests" className="btn-primary">Browse All Mock Tests →</Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ── RUNNING Phase (CBT Interface) ──────────────────────────
  const q = test.questions[current]
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
                  <span style={{ marginLeft: '10px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                    • {currentSection.name}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '3px 10px', borderRadius: '6px' }}>
                +{test.marksPerQuestion} / -{test.negativeMark}
              </span>
            </div>

            <p className={styles.questionText}>{q.text}</p>

            <div className={styles.options}>
              {Object.entries(q.options).map(([key, val]) => (
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
                onClick={() => handleMarkAndNext(q.id)}
              >
                {marked[q.id] ? '🔖 Unmark & Next' : '📌 Mark for Review & Next'}
              </button>
              {answers[q.id] && (
                <button
                  className={styles.btnClear}
                  onClick={() => clearAnswer(q.id)}
                >
                  Clear Response
                </button>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button
                  className="btn-outline"
                  disabled={current === 0}
                  onClick={() => setCurrent(c => c - 1)}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  ← Prev
                </button>
                <button
                  className="btn-outline"
                  disabled={current === test.questions.length - 1}
                  onClick={() => setCurrent(c => c + 1)}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className={styles.sidebarTitle} style={{ margin: 0 }}>Question Palette</h3>
              {test.sections && (
                <select
                  value={paletteFilter}
                  onChange={(e) => setPaletteFilter(e.target.value)}
                  style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
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
              <div className={styles.progressFill} style={{ width: `${(answered / test.totalQuestions) * 100}%` }} />
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
