'use client'

// ============================================================
// app/mpsc/pyq-analysis/[slug]/ConceptQuestionsClient.js
// Interactive Questions Explorer for Specific High-Frequency MPSC Concept
// ExamUdaan.in — Saffron & Warm Ivory, Numbered Pagination, Zero Inline Styles
// ============================================================

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './conceptDetails.module.css'

function getPageNumbers(currentPage, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }
  if (currentPage >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', total]
}

export default function ConceptQuestionsClient({ topicItem, relatedTopics = [] }) {
  const initialTotal = parseInt(topicItem?.total_occurrences || '1', 10)
  const initialQuestions = topicItem?.sample_question ? [topicItem.sample_question] : []

  const [questions, setQuestions] = useState(initialQuestions)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalCount, setTotalCount] = useState(initialTotal)
  const [totalPages, setTotalPages] = useState(Math.max(1, Math.ceil(initialTotal / 10)))
  const [revealedSolutions, setRevealedSolutions] = useState({ 0: true })
  const [selectedOptions, setSelectedOptions] = useState({})

  const questionsRef = useRef(null)

  const topicName = topicItem?.topic || ''
  const topicSubject = topicItem?.subject || ''
  const subjectSlug = topicSubject.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  // Fetch full live questions from /api/pyq/analytics for this topic
  useEffect(() => {
    let isMounted = true

    async function loadTopicQuestions() {
      if (!topicName) return
      setLoading(true)

      try {
        const queryUrl = `/api/pyq/analytics?topic=${encodeURIComponent(topicName)}&subject=${encodeURIComponent(topicSubject || 'all')}&page=${page}&limit=${limit}`
        const res = await fetch(queryUrl)
        const json = await res.json()

        if (isMounted && json.success && json.data) {
          if (Array.isArray(json.data.questions) && json.data.questions.length > 0) {
            setQuestions(json.data.questions)
            if (json.data.pagination) {
              setTotalCount(json.data.pagination.total || initialTotal)
              setTotalPages(json.data.pagination.totalPages || 1)
            }
          }
        }
      } catch (err) {
        console.error('[ConceptQuestionsClient] Error loading questions:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadTopicQuestions()

    return () => {
      isMounted = false
    }
  }, [topicName, topicSubject, page, limit, initialTotal])

  const toggleSolution = (idx) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  const handleSelectOption = (qIdx, optKey) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [qIdx]: optKey
    }))
    // Auto-reveal solution on answer selection
    setRevealedSolutions((prev) => ({
      ...prev,
      [qIdx]: true
    }))
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return
    setPage(newPage)
    setRevealedSolutions({ 0: true })
    if (questionsRef.current) {
      questionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const startQuestionNum = (page - 1) * limit + 1
  const endQuestionNum = Math.min(page * limit, totalCount)

  return (
    <div className={styles.contentArea}>
      {/* 1. Analyzed High-Frequency Questions */}
      <section aria-labelledby="section-questions-heading" ref={questionsRef} id="questions-archive">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <span className={styles.sectionTag}>Verified Question Archive • अधिकृत प्रश्नसंच</span>
            <h2 id="section-questions-heading" className={styles.sectionHeading}>
              Verified MPSC Questions on &ldquo;{topicName}&rdquo; ({totalCount} Questions Analyzed)
            </h2>
            <div className={styles.questionsCountNotice}>
              Showing questions {startQuestionNum}–{endQuestionNum} of {totalCount} verified questions
              {loading && (
                <span className={styles.questionsLoadingNotice}>
                  <span className="material-symbols-outlined">sync</span>
                  Loading latest questions...
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.questionsList}>
          {questions.map((q, qIdx) => {
            const isRevealed = Boolean(revealedSolutions[qIdx])
            const chosen = selectedOptions[qIdx]
            const qGlobalNum = (page - 1) * limit + qIdx + 1

            // Safe parsing of options (handles JSON string, object, and array)
            let rawOptions = {}
            if (q.options) {
              if (typeof q.options === 'string') {
                try {
                  rawOptions = JSON.parse(q.options)
                } catch {
                  rawOptions = {}
                }
              } else if (typeof q.options === 'object') {
                rawOptions = q.options
              }
            }

            if (Array.isArray(rawOptions)) {
              const letters = ['A', 'B', 'C', 'D', 'E']
              const temp = {}
              rawOptions.forEach((opt, i) => {
                temp[letters[i] || String(i + 1)] = opt
              })
              rawOptions = temp
            }

            const options = rawOptions
            const correctRaw = String(q.correct || '').trim().toUpperCase()

            return (
              <article key={q.id || `${page}-${qIdx}`} className={styles.questionCard}>
                <div className={styles.questionMetaRow}>
                  <span className={styles.qNumPill}>Question #{qGlobalNum}</span>
                  <span className={styles.qExamPill}>{q.exam || 'MPSC Official Exam'}</span>
                  <span className={styles.qYearPill}>Year: {q.year || 'Official'}</span>
                  {topicItem?.maharashtra_focus > 0 && (
                    <span className={styles.qExamPill}>🏛️ Maharashtra Focus</span>
                  )}
                  {q.difficulty && (
                    <span className={styles.qYearPill}>Level: {q.difficulty}</span>
                  )}
                </div>

                <h3 className={styles.questionStem}>
                  {q.question}
                </h3>

                {/* 4 Options Grid */}
                <div className={styles.optionsGrid}>
                  {Object.entries(options).map(([optKey, optText]) => {
                    const optKeyUpper = String(optKey).toUpperCase()
                    const isCorrect = isRevealed && (
                      correctRaw === optKeyUpper ||
                      (optKeyUpper === 'A' && correctRaw === '1') ||
                      (optKeyUpper === 'B' && correctRaw === '2') ||
                      (optKeyUpper === 'C' && correctRaw === '3') ||
                      (optKeyUpper === 'D' && correctRaw === '4')
                    )
                    const isSelected = chosen === optKey

                    return (
                      <div
                        key={optKey}
                        className={`${styles.optionItem} ${isCorrect ? styles.optionItemCorrect : ''}`}
                        onClick={() => handleSelectOption(qIdx, optKey)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') handleSelectOption(qIdx, optKey)
                        }}
                      >
                        <span className={styles.optionKey}>({optKey})</span>
                        <span className={styles.optionText}>{optText}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Solution Reveal Toggle */}
                <button
                  type="button"
                  className={styles.solutionToggleBtn}
                  onClick={() => toggleSolution(qIdx)}
                  aria-expanded={isRevealed}
                >
                  <span className="material-symbols-outlined">
                    {isRevealed ? 'visibility_off' : 'lightbulb'}
                  </span>
                  <span>{isRevealed ? 'Hide Detailed Explanation' : 'View Official Key & Explanation'}</span>
                </button>

                {isRevealed && (
                  <div className={styles.solutionContent}>
                    <div className={styles.solutionHeading}>
                      <span className="material-symbols-outlined">verified</span>
                      <span>Official Answer: Option ({q.correct}) — 100% Commission Verified</span>
                    </div>
                    <p className={styles.solutionText}>
                      {q.explanation || 'Official answer verified against Maharashtra Public Service Commission final gazetted answer key.'}
                    </p>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {/* UNIFIED NUMBERED PAGINATION (Rule: ALWAYS USE NUMBERED PAGINATION) */}
        {totalPages > 1 && (
          <nav className={styles.paginationNav} aria-label="Question Pages">
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous Page"
            >
              ← Prev
            </button>

            {getPageNumbers(page, totalPages).map((p, pIdx) => {
              if (p === '...') {
                return (
                  <span key={`ellipsis-${pIdx}`} className={styles.pageEllipsis}>
                    ...
                  </span>
                )
              }
              const isCurrent = p === page
              return (
                <button
                  key={p}
                  type="button"
                  className={`${styles.pageBtn} ${isCurrent ? styles.pageBtnActive : ''}`}
                  onClick={() => handlePageChange(p)}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            })}

            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next Page"
            >
              Next →
            </button>
          </nav>
        )}
      </section>

      {/* 2. Targeted Action Hub */}
      <section className={styles.actionHubCard}>
        <div className={styles.actionHubLeft}>
          <h3 className={styles.actionHubTitle}>
            Ready to Master &ldquo;{topicName}&rdquo; &amp; {topicSubject}?
          </h3>
          <p className={styles.actionHubSub}>
            Practice topic-wise MCQs with instant scoring, attempt timed CBT drills, or check the full syllabus checklist.
          </p>
        </div>

        <div className={styles.actionHubButtons}>
          <Link
            href={`/pyq/${subjectSlug}`}
            className={styles.btnPrimaryOrange}
          >
            <span className="material-symbols-outlined">quiz</span>
            <span>Practice All {topicSubject} PYQs →</span>
          </Link>

          <Link
            href="/mock-tests"
            className={styles.btnOutline}
          >
            <span className="material-symbols-outlined">timer</span>
            <span>Take CBT Mock Drill</span>
          </Link>

          <Link
            href="/mpsc/pyq-analysis"
            className={styles.btnOutline}
          >
            <span className="material-symbols-outlined">insights</span>
            <span>All 40 Concepts Dashboard</span>
          </Link>
        </div>
      </section>

      {/* 3. Related High-Frequency Concepts in same subject */}
      {relatedTopics && relatedTopics.length > 0 && (
        <section aria-labelledby="section-related-heading">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Related High-Yield Concepts • इतर महत्त्वाचे घटक</span>
            <h2 id="section-related-heading" className={styles.sectionHeading}>
              Other Frequently Tested {topicSubject} Topics
            </h2>
          </div>

          <div className={styles.relatedGrid}>
            {relatedTopics.map((rel) => (
              <div key={rel.slug} className={styles.relatedCard}>
                <div className={styles.relatedCardTop}>
                  <h3 className={styles.relatedCardTitle}>{rel.topic}</h3>
                  <div className={styles.relatedCardMeta}>
                    <span>Frequency: <strong>🔥 {rel.total_occurrences} Qs</strong></span>
                    <span>•</span>
                    <span>{rel.subject}</span>
                  </div>
                </div>

                <Link
                  href={`/mpsc/pyq-analysis/${rel.slug}`}
                  className={styles.relatedBtnInspect}
                >
                  <span>View Questions →</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
