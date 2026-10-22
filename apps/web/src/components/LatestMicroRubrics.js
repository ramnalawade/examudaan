// ============================================================
// components/LatestMicroRubrics.js — Latest Official Exam Syllabi
// ExamUdaan.in — Verified gazette curriculum documents strip view
// Full Numbered Pagination (8 items/page) • Brand Guidelines
// ============================================================

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getAllEnrichedMpscDocs } from '@/lib/mpscTaxonomy'
import styles from './LatestMicroRubrics.module.css'

export default function LatestMicroRubrics() {
  const allDocs = useMemo(() => getAllEnrichedMpscDocs(), [])
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 8

  // Real, working category filtering across all 343 verified documents
  const filteredDocs = useMemo(() => {
    if (activeTab === 'all') return allDocs
    if (activeTab === 'rajyaseva') {
      return allDocs.filter(d => d.category === 'rajyaseva' || d.category === 'group-a')
    }
    if (activeTab === 'group-b') {
      return allDocs.filter(d => d.category === 'group-b')
    }
    if (activeTab === 'group-c') {
      return allDocs.filter(d => d.category === 'group-c')
    }
    if (activeTab === 'engineering') {
      return allDocs.filter(d => d.category === 'engineering')
    }
    if (activeTab === 'education') {
      return allDocs.filter(d => d.category === 'education')
    }
    return allDocs
  }, [allDocs, activeTab])

  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  // Strict 8 items per page numbered pagination
  const visibleDocs = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredDocs.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredDocs, safeCurrentPage, ITEMS_PER_PAGE])

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === safeCurrentPage) return
    setCurrentPage(newPage)
    const el = document.getElementById('latest-rubrics')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Dynamic windowing for pagination numbers
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

  // Count helper
  const counts = useMemo(() => {
    return {
      all: allDocs.length,
      rajyaseva: allDocs.filter(d => d.category === 'rajyaseva' || d.category === 'group-a').length,
      groupB: allDocs.filter(d => d.category === 'group-b').length,
      groupC: allDocs.filter(d => d.category === 'group-c').length,
      engineering: allDocs.filter(d => d.category === 'engineering').length,
      education: allDocs.filter(d => d.category === 'education').length,
    }
  }, [allDocs])

  return (
    <section className={styles.section} id="latest-rubrics">
      <div className="container">
        {/* Header Row */}
        <div className={styles.headerRow}>
          <div>
            <div className={styles.badgeArchive}>
              <span className="material-symbols-outlined">verified</span>
              <span>Official Commission Notifications Archive</span>
            </div>
            <h2 className={styles.title}>Latest Official Exam Syllabi &amp; Micro-Rubrics</h2>
            <p className={styles.subtitle}>
              Verified gazette curriculum documents with direct interactive checklist links and bilingual language copies.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className={styles.filterTabs} role="tablist" aria-label="Syllabi categories">
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('all')}
            >
              All Syllabi ({counts.all})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'rajyaseva' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('rajyaseva')}
            >
              State Services ({counts.rajyaseva})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'group-b' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('group-b')}
            >
              Group B ({counts.groupB})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'group-c' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('group-c')}
            >
              Group C ({counts.groupC})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'engineering' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('engineering')}
            >
              Engineering ({counts.engineering})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'education' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabChange('education')}
            >
              Education ({counts.education})
            </button>
          </div>
        </div>

        {/* Strip List */}
        <div className={styles.stripList}>
          {visibleDocs.map((doc) => {
            const badgeColor = doc.category === 'rajyaseva' || doc.category === 'group-a'
              ? 'docBadgeSquareOrange'
              : doc.category === 'group-b'
              ? 'docBadgeSquareGreen'
              : doc.category === 'engineering'
              ? 'docBadgeSquareSlate'
              : 'docBadgeSquareSalmon'

            return (
              <article key={doc.id} className={styles.stripCard}>
                <div className={styles.stripLeft}>
                  {/* Doc ID Square Badge */}
                  <div className={`${styles.docBadgeSquare} ${styles[badgeColor]}`}>
                    <span>DOC</span>
                    <span className={styles.docBadgeNum}>#{doc.id}</span>
                  </div>

                  {/* Content */}
                  <div className={styles.stripContent}>
                    <div className={styles.metaRow}>
                      <span className={styles.interactiveTag}>
                        <span className="material-symbols-outlined">bolt</span>
                        <span>Interactive Checklist</span>
                      </span>
                      <span className={styles.deptTag}>{doc.categoryLabelEn || 'Official MPSC Cadre'}</span>
                    </div>
                    <h3 className={styles.stripTitle}>
                      <Link href={`/mpsc-syllabus/${doc.seoSlugEn || doc.id}`} className={styles.stripTitleLink}>
                        {doc.titleEn || `MPSC Examination Paper #${doc.id}`}
                      </Link>
                    </h3>
                    <p className={styles.stripDescMr}>
                      {doc.titleMr || 'महाराष्ट्र लोकसेवा आयोग अधिकृत अभ्यासक्रम तपशील व घटक.'}
                    </p>
                  </div>
                </div>

                {/* Actions on Right */}
                <div className={styles.stripActions}>
                  <Link
                    href={`/mpsc-syllabus/${doc.seoSlugEn || doc.id}`}
                    className={styles.btnActionEn}
                    title={`Open English Syllabus Format for Doc #${doc.id}`}
                  >
                    <span className="material-symbols-outlined">description</span>
                    <span>English Format PDF</span>
                  </Link>
                  <Link
                    href={`/mpsc-syllabus/${doc.seoSlugMr || doc.id}?lang=mr`}
                    className={styles.btnActionMr}
                    title={`उघडा मराठी अभ्यासक्रम संचिका #${doc.id}`}
                  >
                    <span className="material-symbols-outlined">description</span>
                    <span>मराठी फॉरमॅट PDF</span>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {/* ── Full Numbered Pagination (Never load all pages) ── */}
        {totalPages > 1 && (
          <nav className={styles.paginationContainer} aria-label="Syllabi Catalog Pagination">
            <div className={styles.paginationSummary}>
              Showing <strong>{(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredDocs.length)}</strong> of <strong>{filteredDocs.length}</strong> official verified blueprints (Page {safeCurrentPage} of {totalPages})
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
