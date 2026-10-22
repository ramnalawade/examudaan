// ============================================================
// app/syllabus/MpscSyllabusDirectory.js — MPSC 343 Papers Directory
// ExamUdaan.in — Client-side categorized browser with live search
// ============================================================

'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { MPSC_CATEGORIES, getAllEnrichedMpscDocs, getMpscCategoryCounts } from '@/lib/mpscTaxonomy'
import styles from './MpscSyllabusDirectory.module.css'

export default function MpscSyllabusDirectory() {
  const allDocs = useMemo(() => getAllEnrichedMpscDocs(), [])
  const categoryCounts = useMemo(() => getMpscCategoryCounts(), [])

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    function handleSelectCategory(e) {
      if (e.detail) {
        setActiveCategory(e.detail)
        setCurrentPage(1)
        const el = document.getElementById('mpsc-catalog')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    window.addEventListener('selectMpscCategory', handleSelectCategory)
    return () => window.removeEventListener('selectMpscCategory', handleSelectCategory)
  }, [])

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return allDocs.filter(doc => {
      // Category match
      if (activeCategory !== 'all' && doc.category !== activeCategory) {
        return false
      }

      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        const matchTitleEn = (doc.titleEn || '').toLowerCase().includes(q)
        const matchTitleMr = (doc.titleMr || '').toLowerCase().includes(q)
        const matchId = String(doc.id).includes(q)
        const matchCategory = (doc.categoryLabelEn || '').toLowerCase().includes(q)
        if (!matchTitleEn && !matchTitleMr && !matchId && !matchCategory) {
          return false
        }
      }

      return true
    })
  }, [allDocs, activeCategory, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / ITEMS_PER_PAGE))

  // Ensure currentPage doesn't exceed totalPages when filter narrows down
  const safeCurrentPage = Math.min(currentPage, totalPages)

  // Sliced for pagination (strict 12 items per page)
  const visibleDocs = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredDocs.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredDocs, safeCurrentPage, ITEMS_PER_PAGE])

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === safeCurrentPage) return
    setCurrentPage(newPage)
    const el = document.getElementById('mpsc-catalog')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCategorySelect = (key) => {
    setActiveCategory(key)
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setCurrentPage(1)
  }

  // Calculate pagination page numbers with smart ellipsis windowing
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }
    if (safeCurrentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
    return [1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages]
  }, [safeCurrentPage, totalPages])

  return (
    <section id="mpsc-catalog" className={styles.section}>
      <div className="container">
        {/* ── Section Header ── */}
        <div className={styles.header}>
          <div className={styles.headerBadge}>
            <span className="material-symbols-outlined">account_balance</span>
            <span>Official Commission Catalog</span>
          </div>
          <h2 className={styles.title}>
            MPSC Official Examination Syllabi (343 Papers)
          </h2>
          <p className={styles.subtitle}>
            Explore official Maharashtra Public Service Commission syllabi across Rajyaseva, Group B, Group C, Engineering, Education, and Medical cadres with topic-wise interactive breakdowns.
          </p>
        </div>

        {/* ── Controls & Filters Card ── */}
        <div className={styles.controlsCard}>
          <div className={styles.searchBarRow}>
            <div className={styles.searchInputWrapper}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search by paper name, post (e.g. State Services, PSI, Civil, Assistant Professor) or Doc ID..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search MPSC Syllabi"
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={handleClearSearch}
                  aria-label="Clear Search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ── Other National & State Exams Quick Links ── */}
          <div className={styles.otherExamsRow}>
            <span className={styles.otherExamsLabel}>Other Major Exams:</span>
            <div className={styles.otherExamsPills}>
              <Link href="/syllabus/upsc-civil-services" className={styles.otherExamPill}>
                <span className="material-symbols-outlined">flag</span>
                <span>UPSC CSE</span>
              </Link>
              <Link href="/syllabus/ssc-cgl" className={styles.otherExamPill}>
                <span className="material-symbols-outlined">badge</span>
                <span>SSC CGL</span>
              </Link>
              <Link href="/syllabus/ibps-po" className={styles.otherExamPill}>
                <span className="material-symbols-outlined">payments</span>
                <span>Banking / IBPS</span>
              </Link>
              <Link href="/syllabus/maharashtra-police-bharti" className={styles.otherExamPill}>
                <span className="material-symbols-outlined">local_police</span>
                <span>Police Bharti</span>
              </Link>
              <Link href="/syllabus/talathi-bharti" className={styles.otherExamPill}>
                <span className="material-symbols-outlined">edit_document</span>
                <span>Talathi Bharti</span>
              </Link>
            </div>
          </div>

          {/* ── Category Chips ── */}
          <div className={styles.categoriesScroll} role="tablist" aria-label="MPSC Exam Categories">
            {MPSC_CATEGORIES.map(cat => {
              const count = categoryCounts[cat.key] || 0
              const isActive = activeCategory === cat.key
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.catChip} ${isActive ? styles.catChipActive : ''}`}
                  onClick={() => handleCategorySelect(cat.key)}
                >
                  <span className={`material-symbols-outlined ${styles.chipIcon}`}>{cat.icon}</span>
                  <span>{cat.labelEn}</span>
                  <span className={styles.catCount}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Results Info Bar ── */}
        <div className={styles.resultsBar}>
          <div className={styles.resultsCount}>
            Showing <strong>{filteredDocs.length > 0 ? (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredDocs.length)}</strong> of <strong>{filteredDocs.length}</strong> official papers
            {activeCategory !== 'all' && ` in ${MPSC_CATEGORIES.find(c => c.key === activeCategory)?.labelEn}`}
            {totalPages > 1 && ` (Page ${safeCurrentPage} of ${totalPages})`}
          </div>
        </div>

        {/* ── Document Cards Grid ── */}
        {visibleDocs.length > 0 ? (
          <div className={styles.docGrid}>
            {visibleDocs.map(doc => (
              <article
                key={doc.id}
                className={`${styles.docCard} ${styles.docCardInteractive}`}
              >
                <div className={styles.cardTopRow}>
                  <Link
                    href={`/mpsc-syllabus/${doc.seoSlugEn || doc.id}`}
                    className={styles.cardIconLink}
                    title={`View official syllabus for Doc #${doc.id}`}
                  >
                    <div className={styles.cardIconWrap}>
                      <span className="material-symbols-outlined">{doc.categoryIcon || 'auto_stories'}</span>
                    </div>
                  </Link>
                  <div className={styles.badgePillRow}>
                    <Link
                      href={`/mpsc-syllabus/${doc.seoSlugEn || doc.id}`}
                      className={styles.badgePaperCountLink}
                      title={`Open document details for #${doc.id}`}
                    >
                      <span className={styles.badgePaperCount}>Doc #{doc.id}</span>
                    </Link>
                    <span className={styles.badgeInteractive}>⚡ INTERACTIVE</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.docTitle}>
                    <Link
                      href={`/mpsc-syllabus/${doc.seoSlugEn || doc.id}`}
                      className={styles.docTitleLink}
                      title={`Open ${doc.titleEn || `MPSC Examination Paper #${doc.id}`} Interactive Syllabus`}
                    >
                      {doc.titleEn || `MPSC Examination Paper #${doc.id}`}
                    </Link>
                  </h3>
                  {doc.titleMr && (
                    <p className={styles.docTitleMr}>
                      <Link
                        href={`/mpsc-syllabus/${doc.seoSlugMr || doc.id}?lang=mr`}
                        className={styles.docTitleLink}
                        title={`मराठी अभ्यासक्रम उघडा: ${doc.titleMr}`}
                      >
                        {doc.titleMr}
                      </Link>
                    </p>
                  )}
                  <div className={styles.cardAttrGrid}>
                    <div className={styles.cardAttrItem}>
                      <span className={styles.cardAttrLabel}>Conducted By:</span>
                      <span className={styles.cardAttrVal}>MPSC</span>
                    </div>
                    <div className={styles.cardAttrItem}>
                      <span className={styles.cardAttrLabel}>Level:</span>
                      <span className={styles.cardAttrVal}>State Level</span>
                    </div>
                    <div className={styles.cardAttrItem}>
                      <span className={styles.cardAttrLabel}>Category:</span>
                      <span className={styles.cardAttrVal}>{doc.categoryLabelEn || 'Gazetted'}</span>
                    </div>
                    <div className={styles.cardAttrItem}>
                      <span className={styles.cardAttrLabel}>Exam Pattern:</span>
                      <span className={styles.cardAttrVal}>{doc.category === 'engineering' ? 'Offline / CBT' : 'Online / Written'}</span>
                    </div>
                  </div>

                  <div className={styles.cardNote}>
                    Includes Paper units, topics checklist, qualifying marks &amp; preparation blueprint.
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.cardDualActions}>
                    {/* English Action Button */}
                    <Link
                      href={`/mpsc-syllabus/${doc.seoSlugEn || doc.id}`}
                      className={styles.btnActionGreen}
                      title={`Open English Format for #${doc.id}`}
                    >
                      <span className="material-symbols-outlined">description</span>
                      <span>English (Doc {doc.id === 1182 ? 1181 : doc.id})</span>
                    </Link>

                    {/* Marathi Action Button */}
                    <Link
                      href={`/mpsc-syllabus/${doc.seoSlugMr || doc.id}?lang=mr`}
                      className={styles.btnActionGreen}
                      title={`उघडा मराठी फॉरमॅट #${doc.id}`}
                    >
                      <span className="material-symbols-outlined">description</span>
                      <span>मराठी (Doc {doc.id === 1181 ? 1182 : doc.id})</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateTitle}>No syllabus documents matched your search</div>
            <p>Try resetting filters or searching with generic keywords like &quot;State Services&quot;, &quot;PSI&quot;, or &quot;Engineering&quot;.</p>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => {
                setActiveCategory('all')
                setSearchQuery('')
                setCurrentPage(1)
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ── Numbered Pagination ── */}
        {totalPages > 1 && (
          <nav className={styles.paginationContainer} aria-label="Catalog Pagination">
            <div className={styles.paginationSummary}>
              Showing Page <strong>{safeCurrentPage}</strong> of <strong>{totalPages}</strong> ({filteredDocs.length} total syllabi)
            </div>
            <div className={styles.paginationBar}>
              <button
                type="button"
                className={`${styles.pageBtn} ${safeCurrentPage === 1 ? styles.pageBtnDisabled : ''}`}
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                aria-label="Previous Page"
              >
                &laquo; Prev
              </button>

              {pageNumbers.map((p, idx) => {
                if (p === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className={styles.pageEllipsis}>
                      &hellip;
                    </span>
                  )
                }
                const isCurrent = p === safeCurrentPage
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
                className={`${styles.pageBtn} ${safeCurrentPage === totalPages ? styles.pageBtnDisabled : ''}`}
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                aria-label="Next Page"
              >
                Next &raquo;
              </button>
            </div>
          </nav>
        )}
      </div>
    </section>
  )
}
