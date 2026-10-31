'use client'

// ============================================================
// components/CadreHubClient.js — Interactive MPSC Cadre Hub Listing
// Full Filter by Stage, Year & Keyword with Numbered Pagination
// Connects each paper to its database PYQ questions or CBT Mock
// ZERO INLINE STYLES POLICY: All styles in CadreHubClient.module.css
// ============================================================

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import questionsCounts from '@/lib/mpscPaperQuestionsCounts.json'
import { MPSC_TOTAL_QUESTION_PAPERS } from '@/lib/platformStats'
import styles from './CadreHubClient.module.css'

export default function CadreHubClient({ cadreEntry, papers = [] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const listTopRef = useRef(null)

  // Initial params
  const initialPage = parseInt(searchParams.get('page') || '1', 10) || 1
  const initialStage = searchParams.get('stage') || 'all'
  const initialYear = searchParams.get('year') || 'all'

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [selectedStage, setSelectedStage] = useState(initialStage)
  const [selectedYear, setSelectedYear] = useState(initialYear)
  const [searchQuery, setSearchQuery] = useState('')

  const ITEMS_PER_PAGE = 12

  // Sync state if URL changes externally
  useEffect(() => {
    const p = parseInt(searchParams.get('page') || '1', 10) || 1
    const s = searchParams.get('stage') || 'all'
    const y = searchParams.get('year') || 'all'
    setCurrentPage(p)
    setSelectedStage(s)
    setSelectedYear(y)
  }, [searchParams])

  // Automatically scroll to papers listing when navigating from cadre distribution card or hash
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.hash === '#cadre-listing' || window.location.hash === '#papers-list')) {
      const scrollTimer = setTimeout(() => {
        const el = document.getElementById('cadre-listing') || listTopRef.current
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 120)
      return () => clearTimeout(scrollTimer)
    }
  }, [pathname])

  // Available distinct years for this cadre
  const availableYears = useMemo(() => {
    const yrs = Array.from(new Set(papers.map(p => p.examYear).filter(Boolean)))
    return yrs.sort((a, b) => b - a)
  }, [papers])

  // Filter papers
  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      // Stage filter
      if (selectedStage !== 'all' && paper.stage !== selectedStage) {
        return false
      }
      // Year filter
      if (selectedYear !== 'all' && String(paper.examYear) !== String(selectedYear)) {
        return false
      }
      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = (paper.title || '').toLowerCase().includes(q)
        const matchTitleMr = (paper.titleMr || '').toLowerCase().includes(q)
        const matchAdvt = String(paper.advertisementNumber || '').toLowerCase().includes(q)
        const matchYear = String(paper.examYear || '').includes(q)
        if (!matchTitle && !matchTitleMr && !matchAdvt && !matchYear) {
          return false
        }
      }
      return true
    })
  }, [papers, selectedStage, selectedYear, searchQuery])

  // Pagination calculation
  const totalItems = filteredPapers.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const validPage = Math.min(Math.max(currentPage, 1), totalPages)
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE
  const pagedPapers = filteredPapers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Update URL helper without full reload
  function updateUrl(newPage, newStage, newYear) {
    const params = new URLSearchParams()
    if (newPage > 1) params.set('page', String(newPage))
    if (newStage !== 'all') params.set('stage', newStage)
    if (newYear !== 'all') params.set('year', String(newYear))

    const qs = params.toString()
    const targetUrl = qs ? `${pathname}?${qs}` : pathname
    window.history.pushState(null, '', targetUrl)
  }

  function handlePageChange(pNum) {
    setCurrentPage(pNum)
    updateUrl(pNum, selectedStage, selectedYear)
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function handleStageChange(stg) {
    setSelectedStage(stg)
    setCurrentPage(1)
    updateUrl(1, stg, selectedYear)
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function handleYearChange(yr) {
    setSelectedYear(yr)
    setCurrentPage(1)
    updateUrl(1, selectedStage, yr)
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function handleClearFilters() {
    setSelectedStage('all')
    setSelectedYear('all')
    setSearchQuery('')
    setCurrentPage(1)
    updateUrl(1, 'all', 'all')
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={styles.container} id="cadre-listing">
      {/* ── Interactive Filter & Search Bar ── */}
      <div className={styles.filterBar} ref={listTopRef} id="papers-list">
        <div className={styles.filterRowTop}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={`Search ${cadreEntry.shortName} papers, years, posts...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearFiltersBtn}
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>

          <div className={styles.yearSelectWrap}>
            <span className={styles.filterLabel}>Jump to Year:</span>
            <select
              aria-label="Filter by Exam Year"
              className={styles.yearSelect}
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="all">All Years (2009–2026)</option>
              {availableYears.map(yr => {
                const countForYr = papers.filter(p => p.examYear === yr).length
                return (
                  <option key={yr} value={yr}>
                    {yr} ({countForYr} papers)
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        <div className={styles.filterControlsRow}>
          <div className={styles.stageButtonGroup}>
            <span className={styles.filterLabel}>Filter by Stage:</span>
            <button
              type="button"
              className={`${styles.stageBtn} ${selectedStage === 'all' ? styles.stageBtnActive : ''}`}
              onClick={() => handleStageChange('all')}
            >
              All Stages ({papers.length})
            </button>
            <button
              type="button"
              className={`${styles.stageBtn} ${selectedStage === 'prelims' ? styles.stageBtnActive : ''}`}
              onClick={() => handleStageChange('prelims')}
            >
              Prelims Only ({papers.filter(p => p.stage === 'prelims').length})
            </button>
            <button
              type="button"
              className={`${styles.stageBtn} ${selectedStage === 'mains' ? styles.stageBtnActive : ''}`}
              onClick={() => handleStageChange('mains')}
            >
              Mains Only ({papers.filter(p => p.stage === 'mains').length})
            </button>
          </div>

          {(selectedStage !== 'all' || selectedYear !== 'all' || searchQuery) && (
            <button
              type="button"
              className={styles.clearFiltersBtn}
              onClick={handleClearFilters}
            >
              Reset All Filters ↺
            </button>
          )}
        </div>
      </div>

      {/* ── Results Summary Bar ── */}
      <div className={styles.resultsSummaryBar}>
        <div>
          Showing <span className={styles.resultsCount}>{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}</span> of{' '}
          <span className={styles.resultsCount}>{totalItems}</span> {cadreEntry.shortName} papers
          {selectedYear !== 'all' ? ` for ${selectedYear}` : ''}
          {selectedStage !== 'all' ? ` (${selectedStage})` : ''}
          {totalPages > 1 ? ` — Page ${validPage} of ${totalPages}` : ''}
        </div>
        <div>
          <span className={styles.badgePyqLive}>🔥 {MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('en-IN')} Available Question Papers</span>
        </div>
      </div>

      {/* ── Papers Listing Grid ── */}
      {pagedPapers.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyEmoji}>🔎</div>
          <h3 className={styles.emptyTitle}>No examination papers found</h3>
          <p className={styles.emptyDesc}>
            No question papers match your current filter selections. Try clearing your search or selecting a different year.
          </p>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleClearFilters}
          >
            Show All {papers.length} Papers
          </button>
        </div>
      ) : (
        <div className={styles.paperList}>
          {pagedPapers.map(paper => {
            const questionCount = questionsCounts[paper.slug] || questionsCounts[paper.folderName] || 0
            const hasQuestions = questionCount > 0

            return (
              <article key={paper.slug} className={styles.paperCard}>
                <div className={styles.badgeRow}>
                  <span className={styles.badgeStage}>{paper.stageLabel || paper.stage}</span>
                  <span className={styles.badgeYear}>Exam Year: {paper.examYear}</span>
                  {paper.advertisementNumber && (
                    <span className={styles.badgeYear}>
                      Advt: {paper.advertisementNumber}/{paper.advertisementYear || paper.examYear}
                    </span>
                  )}
                  <span className={styles.badgeKey}>{paper.keyStatus || 'Official Final Answer Key'}</span>
                  {hasQuestions ? (
                    <span className={styles.badgePyqLive}>
                      ✨ {questionCount} Solved PYQs in Database
                    </span>
                  ) : (
                    <span className={styles.badgeYear}>
                      Official Scanned PDF
                    </span>
                  )}
                </div>

                <h2 className={styles.paperTitle}>
                  <Link
                    href={`/mpsc-pyq?docId=${paper.id || ''}&year=${paper.examYear}&docType=qp`}
                    className={styles.paperTitleLink}
                    title="Open paper directly in Study Workspace"
                  >
                    {paper.title}
                  </Link>
                </h2>

                {paper.titleMr && (
                  <div className={styles.paperTitleMr}>
                    <Link
                      href={`/mpsc-pyq?docId=${paper.id || ''}&year=${paper.examYear}&docType=qp`}
                      className={styles.paperTitleLink}
                      title="Open paper directly in Study Workspace"
                    >
                      {paper.titleMr}
                    </Link>
                  </div>
                )}

                <div className={styles.paperMeta}>
                  <span>Max Marks: <strong>{paper.totalMarks || 100}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong>{paper.durationMinutes || 60} mins</strong></span>
                  <span>•</span>
                  <span>Pattern: <strong>{paper.topicAnalysis?.examPattern || 'Objective & Descriptive'}</strong></span>
                  <span>•</span>
                  <span>Medium: <strong>Bilingual (मराठी / English)</strong></span>
                </div>

                <div className={styles.actionsGrid}>
                  {/* 1. Primary Action: View paper directly in Study Workspace */}
                  <Link
                    href={`/mpsc-pyq?docId=${paper.id || ''}&year=${paper.examYear}&docType=qp`}
                    className={styles.btnWorkspaceOrange}
                    title="View official question paper in study workspace"
                  >
                    📄 View Paper
                  </Link>

                  {/* 2. Direct Answer Key Action (placed directly next to View Paper!) */}
                  {paper.answerKey?.downloadUrl ? (
                    <Link
                      href={`/mpsc-pyq?docId=${paper.id || ''}&year=${paper.examYear}&docType=ak`}
                      className={styles.btnAnswerKeyGreen}
                      title="View official answer key in study workspace"
                    >
                      🔑 View Answer Key
                    </Link>
                  ) : (
                    <span className={styles.btnAnswerKeyDisabled} title="Official Answer Key pending publication by MPSC">
                      🔑 Key Awaited
                    </span>
                  )}

                  {/* 3. Practice Action: If questions exist in DB -> Solve PYQs Online, else -> Timed CBT Mock */}
                  {hasQuestions ? (
                    <Link
                      href={`/mpsc/${paper.slug}#solver`}
                      className={styles.btnSolvePyq}
                      title={`Solve all ${questionCount} questions online with instant scores`}
                    >
                      📝 Solve PYQs ({questionCount} Qs) Online
                    </Link>
                  ) : (
                    <Link
                      href={`/mock-tests?exam=mpsc&year=${paper.examYear || 2023}`}
                      className={styles.btnOutlineCbt}
                      title="Practice 100-Q CBT Mock Test for this exam year"
                    >
                      ⏱️ Timed CBT Mock ({paper.examYear})
                    </Link>
                  )}

                  {/* 4. Deep Solutions */}
                  <Link
                    href={paper.practiceLinks?.detailedSolutions || `/mpsc/solutions`}
                    className={styles.btnOutline}
                  >
                    Solutions & Explanations
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* ── Numbered Pagination Navigation ── */}
      {totalPages > 1 && (
        <nav aria-label="Pagination Navigation" className={styles.paginationNav}>
          {validPage > 1 ? (
            <button
              type="button"
              onClick={() => handlePageChange(validPage - 1)}
              className={styles.pageBtn}
            >
              ← Prev
            </button>
          ) : (
            <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>← Prev</span>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => {
            // Show first page, last page, and 2 pages around current page
            if (
              pNum === 1 ||
              pNum === totalPages ||
              (pNum >= validPage - 2 && pNum <= validPage + 2)
            ) {
              const isActive = pNum === validPage
              return (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => handlePageChange(pNum)}
                  className={`${styles.pageBtn} ${isActive ? styles.pageBtnActive : ''}`}
                >
                  {pNum}
                </button>
              )
            }
            if (pNum === validPage - 3 || pNum === validPage + 3) {
              return <span key={pNum} className={styles.ellipsis}>...</span>
            }
            return null
          })}

          {validPage < totalPages ? (
            <button
              type="button"
              onClick={() => handlePageChange(validPage + 1)}
              className={styles.pageBtn}
            >
              Next →
            </button>
          ) : (
            <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>Next →</span>
          )}
        </nav>
      )}
    </div>
  )
}
