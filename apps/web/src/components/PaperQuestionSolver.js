// ============================================================
// components/PaperQuestionSolver.js — Interactive In-Browser PYQ Solver
// ExamUdaan | Solves official question paper questions with instant evaluation,
// detailed Marathi explanations & persistent LocalStorage progress capture.
// ZERO INLINE STYLES POLICY: Pure CSS Modules
// ============================================================

'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styles from './PaperQuestionSolver.module.css'

export default function PaperQuestionSolver({
  questions = [],
  paperSlug = '',
  paperTitle = '',
  pdfUrl = null
}) {
  const [userAnswers, setUserAnswers] = useState({})
  const [bookmarks, setBookmarks] = useState([])
  const [filterMode, setFilterMode] = useState('all') // 'all' | 'unattempted' | 'incorrect' | 'bookmarked'
  const [showPdf, setShowPdf] = useState(false)
  const [isClientLoaded, setIsClientLoaded] = useState(false)

  const storageKey = `eu_mpsc_solve_${paperSlug}`

  // 1. Read stored answers from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.userAnswers) setUserAnswers(parsed.userAnswers)
        if (parsed.bookmarks) setBookmarks(parsed.bookmarks)
      }
    } catch (err) {
      console.warn('[solver] Could not read localStorage:', err)
    } finally {
      setIsClientLoaded(true)
    }
  }, [storageKey])

  // 2. Persist answers to localStorage whenever userAnswers or bookmarks change
  useEffect(() => {
    if (!isClientLoaded) return
    try {
      const dataToSave = {
        userAnswers,
        bookmarks,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
    } catch (err) {
      console.warn('[solver] Could not save to localStorage:', err)
    }
  }, [userAnswers, bookmarks, isClientLoaded, storageKey])

  // Select an option
  const handleSelectOption = useCallback((qNum, optKey) => {
    setUserAnswers(prev => ({
      ...prev,
      [qNum]: optKey
    }))
  }, [])

  // Toggle bookmark
  const toggleBookmark = useCallback((qNum) => {
    setBookmarks(prev => {
      if (prev.includes(qNum)) {
        return prev.filter(n => n !== qNum)
      } else {
        return [...prev, qNum]
      }
    })
  }, [])

  // Reset entire test
  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset your answers and re-attempt this paper?')) {
      setUserAnswers({})
      setBookmarks([])
      try {
        localStorage.removeItem(storageKey)
      } catch {}
    }
  }, [storageKey])

  // Compute live statistics
  const stats = useMemo(() => {
    const totalQ = questions.length
    let attempted = 0
    let correct = 0
    let wrong = 0

    questions.forEach(q => {
      const qNum = q.question_number || q.id
      const ans = userAnswers[qNum]
      if (ans) {
        attempted++
        if (ans.toUpperCase() === (q.correct || '').toUpperCase()) {
          correct++
        } else {
          wrong++
        }
      }
    })

    const score = Math.max(0, correct * 1 - wrong * 0.25).toFixed(2)
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0

    return { totalQ, attempted, correct, wrong, score, accuracy }
  }, [questions, userAnswers])

  // Filter questions according to active tab
  const displayedQuestions = useMemo(() => {
    return questions.filter(q => {
      const qNum = q.question_number || q.id
      const ans = userAnswers[qNum]
      if (filterMode === 'unattempted') {
        return !ans
      }
      if (filterMode === 'incorrect') {
        return ans && ans.toUpperCase() !== (q.correct || '').toUpperCase()
      }
      if (filterMode === 'bookmarked') {
        return bookmarks.includes(qNum)
      }
      return true
    })
  }, [questions, userAnswers, bookmarks, filterMode])

  if (!questions || questions.length === 0) {
    return null
  }

  return (
    <section id="solver" className={styles.solverContainer} aria-label="Interactive PYQ Solving Workspace">
      {/* Header */}
      <div className={styles.solverHeader}>
        <div className={styles.titleArea}>
          <h2 className={styles.solverTitle}>
            <span>✍️</span> सराव परीक्षा (Interactive Question Solver)
          </h2>
          <p className={styles.solverSubtitle}>
            Solve original questions directly with instant validation and detailed explanations
          </p>
        </div>
        <div className={styles.storageBadge}>
          <span>💾</span> Progress Auto-Saved in LocalStorage
        </div>
      </div>

      {/* Score Card Dashboard */}
      <div className={styles.scoreCard}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Questions</span>
          <span className={styles.statVal}>{stats.totalQ}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Attempted</span>
          <span className={styles.statVal}>{stats.attempted}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Correct</span>
          <span className={`${styles.statVal} ${styles.statValCorrect}`}>{stats.correct}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Wrong (-0.25)</span>
          <span className={`${styles.statVal} ${styles.statValWrong}`}>{stats.wrong}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Accuracy</span>
          <span className={styles.statVal}>{stats.accuracy}%</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Net Score</span>
          <span className={`${styles.statVal} ${styles.statValScore}`}>{stats.score}</span>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className={styles.toolbar}>
        <div className={styles.filterTabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${filterMode === 'all' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All Questions ({stats.totalQ})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${filterMode === 'unattempted' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilterMode('unattempted')}
          >
            Unattempted ({stats.totalQ - stats.attempted})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${filterMode === 'incorrect' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilterMode('incorrect')}
          >
            Incorrect ({stats.wrong})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${filterMode === 'bookmarked' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilterMode('bookmarked')}
          >
            Bookmarked ({bookmarks.length})
          </button>
        </div>

        <div className={styles.filterTabs}>
          {pdfUrl && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => setShowPdf(prev => !prev)}
            >
              <span>{showPdf ? 'Hide PDF' : '📄 View Official PDF'}</span>
            </button>
          )}
          {stats.attempted > 0 && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handleReset}
            >
              <span>🔄 Reset My Answers</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional PDF Split Preview */}
      {showPdf && pdfUrl && (
        <div className={styles.pdfFrameWrapper}>
          <iframe
            src={pdfUrl}
            title={`${paperTitle} Official PDF`}
            className={styles.pdfFrame}
          />
        </div>
      )}

      {/* Questions List */}
      <div className={styles.questionsList}>
        {displayedQuestions.map((q) => {
          const qNum = q.question_number || q.id
          const chosen = userAnswers[qNum]
          const isAnswered = !!chosen
          const isCorrect = isAnswered && chosen.toUpperCase() === (q.correct || '').toUpperCase()
          const isBookmarked = bookmarks.includes(qNum)

          return (
            <article key={qNum} className={styles.questionCard}>
              <div className={styles.qMetaRow}>
                <div className={styles.qMetaPills}>
                  <span className={styles.qNumPill}>Q. {qNum}</span>
                  {q.topic && <span className={styles.topicPill}>{q.topic}</span>}
                  {q.difficulty && (
                    <span
                      className={`${styles.diffPill} ${
                        q.difficulty.toLowerCase() === 'easy'
                          ? styles.diffEasy
                          : q.difficulty.toLowerCase() === 'hard'
                          ? styles.diffHard
                          : styles.diffMedium
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarkActive : ''}`}
                  onClick={() => toggleBookmark(qNum)}
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                  aria-label="Bookmark Question"
                >
                  {isBookmarked ? '★' : '☆'}
                </button>
              </div>

              {/* Question Text */}
              <div className={styles.questionText}>
                {q.question}
              </div>

              {/* Options Grid */}
              <div className={styles.optionsGrid}>
                {Object.entries(q.options || {}).map(([optKey, optVal]) => {
                  const isSelected = chosen === optKey
                  const isThisCorrect = isAnswered && optKey.toUpperCase() === (q.correct || '').toUpperCase()
                  const isThisWrong = isSelected && !isThisCorrect

                  return (
                    <button
                      key={optKey}
                      type="button"
                      className={`${styles.optionBtn} ${
                        isThisCorrect ? styles.optCorrect : isThisWrong ? styles.optWrong : ''
                      }`}
                      onClick={() => handleSelectOption(qNum, optKey)}
                    >
                      <span className={styles.optKey}>{optKey}</span>
                      <span className={styles.optText}>{optVal}</span>
                    </button>
                  )
                })}
              </div>

              {/* Explanation Box (Revealed when answered) */}
              {isAnswered && (
                <div className={styles.explanationBox}>
                  <div className={styles.expHeader}>
                    <span>{isCorrect ? '✅ बरोबर उत्तर' : '❌ चुकीचे उत्तर'}</span>
                    <span>• Official Correct: Option {q.correct}</span>
                  </div>
                  {q.explanation && (
                    <p className={styles.expText}>
                      {q.explanation}
                    </p>
                  )}
                </div>
              )}
            </article>
          )
        })}

        {displayedQuestions.length === 0 && (
          <div className={styles.emptyState}>
            <p>No questions found under this filter ({filterMode}).</p>
          </div>
        )}
      </div>
    </section>
  )
}
