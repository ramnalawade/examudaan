// ============================================================
// app/syllabus/SyllabusListingClient.js — Interactive Syllabus Catalog
// ExamUdaan.in — Dynamic filters, search, and aligned card matrix
// ============================================================

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './syllabus.module.css'

export default function SyllabusListingClient({ exams = [] }) {
  const [activeLevel, setActiveLevel] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter exams based on active level (State / Central) and search query
  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const matchLevel =
        activeLevel === 'All'
          ? true
          : exam.examLevel?.toLowerCase() === activeLevel.toLowerCase()

      const query = searchQuery.trim().toLowerCase()
      if (!query) return matchLevel

      const matchText =
        exam.nameEn?.toLowerCase().includes(query) ||
        exam.name?.toLowerCase().includes(query) ||
        exam.shortName?.toLowerCase().includes(query) ||
        exam.conductingBody?.toLowerCase().includes(query) ||
        exam.targetPosts?.some(p => p.toLowerCase().includes(query))

      return matchLevel && matchText
    })
  }, [exams, activeLevel, searchQuery])

  // Counts for filter pills
  const counts = useMemo(() => {
    const total = exams.length
    const state = exams.filter(e => e.examLevel === 'State').length
    const central = exams.filter(e => e.examLevel === 'Central').length
    return { total, state, central }
  }, [exams])

  return (
    <div className={styles.catalogWrapper}>
      {/* ── Filter Bar & Search ── */}
      <div className={styles.controlsBar}>
        <div className={styles.filterPillsGroup} role="group" aria-label="Filter by level">
          <button
            type="button"
            className={`${styles.levelPill} ${activeLevel === 'All' ? styles.activeLevelPill : ''}`}
            onClick={() => setActiveLevel('All')}
          >
            <span>All Exams</span>
            <span className={styles.pillCount}>{counts.total}</span>
          </button>
          <button
            type="button"
            className={`${styles.levelPill} ${activeLevel === 'State' ? styles.activeLevelPill : ''}`}
            onClick={() => setActiveLevel('State')}
          >
            <span>Maharashtra State</span>
            <span className={styles.pillCount}>{counts.state}</span>
          </button>
          <button
            type="button"
            className={`${styles.levelPill} ${activeLevel === 'Central' ? styles.activeLevelPill : ''}`}
            onClick={() => setActiveLevel('Central')}
          >
            <span>Central Government</span>
            <span className={styles.pillCount}>{counts.central}</span>
          </button>
        </div>

        {/* Live Search */}
        <div className={styles.searchBox}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#94A3B8' }}>search</span>
          <input
            type="text"
            placeholder="Search exam, post, or body (e.g. Police, MPSC, UPSC, Talathi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Active Result Status ── */}
      {(activeLevel !== 'All' || searchQuery) && (
        <div className={styles.filterStatusRow}>
          <span>
            Showing <strong>{filteredExams.length}</strong> of {exams.length} examinations
            {searchQuery && <> for &quot;<strong>{searchQuery}</strong>&quot;</>}
          </span>
          <button
            type="button"
            className={styles.resetFiltersBtn}
            onClick={() => {
              setActiveLevel('All')
              setSearchQuery('')
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── Exam Cards Grid ── */}
      {filteredExams.length === 0 ? (
        <div className={styles.emptyState}>
          <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#94A3B8' }}>manage_search</span>
          <h3>No matching exam syllabus found</h3>
          <p>Try searching for a different exam name, post title, or reset your filters.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setActiveLevel('All')
              setSearchQuery('')
            }}
          >
            Show All {exams.length} Exams
          </button>
        </div>
      ) : (
        <div className={styles.examGrid}>
          {filteredExams.map(exam => (
            <ExamCard key={exam.slug} exam={exam} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Redesigned, Robust Exam Card Component ───────────────────
function ExamCard({ exam }) {
  const totalPapers = exam.papers?.reduce((a, s) => a + (s.papers?.length || 0), 0) || 0
  const downloadedPdfsCount = (exam.officialPdfs || []).filter(p =>
    p.url && (p.url.startsWith('/downloads/') || p.url.startsWith('/question-papers/mpsc/') || p.url.startsWith('/api/mpsc-pdf/'))
  ).length
  const hasDownloadedPapers = downloadedPdfsCount > 0

  // Clean format for stages to avoid card blowout
  const stagesSummary = useMemo(() => {
    if (!exam.stages || exam.stages.length === 0) return 'Written Exam'
    return exam.stages
      .map(s => {
        // Strip out excessive parenthetical markings for cleaner display
        return s.replace(/\s*\([^)]*\)/g, '').trim()
      })
      .join(' → ')
  }, [exam.stages])

  return (
    <div className={styles.examCard}>
      {/* Color accent bar */}
      <div className={styles.examCardBar} style={{ background: exam.color || 'var(--primary)' }} />

      {/* Header */}
      <div className={styles.examCardHeader}>
        <div
          className={styles.examIconWrap}
          style={{
            background: `${exam.color || '#EA580C'}18`,
            color: exam.color || '#EA580C',
          }}
        >
          <span className={`material-symbols-outlined ${styles.examIcon}`}>
            {exam.logo || 'school'}
          </span>
        </div>
        <div className={styles.examTitleBox}>
          <h3 className={styles.examName}>{exam.nameEn}</h3>
          <p className={styles.examBody}>{exam.conductingBody}</p>
        </div>
        <span className={styles.examLevel} data-level={exam.examLevel}>
          {exam.examLevel}
        </span>
      </div>

      {/* Target Posts Pills (Always 1 row) */}
      <div className={styles.examPosts}>
        {exam.targetPosts?.slice(0, 3).map(p => (
          <span key={p} className={styles.postPill}>{p}</span>
        ))}
        {exam.targetPosts?.length > 3 && (
          <span className={styles.postPillMore}>+{exam.targetPosts.length - 3} more</span>
        )}
      </div>

      {/* Structured Meta Grid (Uniform Height) */}
      <div className={styles.examMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Eligibility</span>
          <span className={styles.metaValEligibility} title={exam.eligibility}>
            {exam.eligibility}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Age Limit</span>
          <span className={styles.metaVal}>
            <strong>{exam.ageLimit?.min}–{exam.ageLimit?.max} yrs</strong>
            {exam.ageLimit?.obcRelax ? ` (OBC: +${exam.ageLimit.obcRelax} | SC/ST: +${exam.ageLimit.scStRelax || 5})` : ''}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Stages</span>
          <span className={styles.metaValStages} title={exam.stages?.join(' → ')}>
            {stagesSummary}
          </span>
        </div>
      </div>

      {/* Bottom Section (Anchored to Card Bottom) */}
      <div className={styles.cardBottomArea}>
        {/* Resource Stats Strip */}
        <div className={styles.statsStrip}>
          <span className={styles.statChip}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#EA580C' }}>menu_book</span>
            {totalPapers > 0 ? `${totalPapers} Papers` : 'Syllabus'}
          </span>
          <span className={styles.statDot}>•</span>
          {hasDownloadedPapers ? (
            <a
              href={exam.officialPdfs?.[0]?.url || `/syllabus/${exam.slug}#pyq`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.statChip} ${styles.statChipClickable}`}
              title={`Open ${exam.shortName || exam.nameEn} Question Paper in PDF format`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#16A34A' }}>
                picture_as_pdf
              </span>
              <span>{downloadedPdfsCount} Official PDFs ↗</span>
            </a>
          ) : (
            <Link
              href={`/syllabus/${exam.slug}#pyq`}
              className={`${styles.statChip} ${styles.statChipClickable}`}
              title={`View ${exam.pyqLinks?.length || 0} previous year papers for ${exam.shortName || exam.nameEn}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#2563EB' }}>
                history_edu
              </span>
              <span>{exam.pyqLinks?.length ? `${exam.pyqLinks.length} PYQ Papers` : 'Topic Tracker'}</span>
            </Link>
          )}
          <span className={styles.cycleBadge}>2026 Cycle</span>
        </div>

        {/* Action Row — Clean & Single Primary CTA */}
        <div className={styles.actionsRow}>
          <div className={styles.quickAccessPills}>
            {hasDownloadedPapers ? (
              <>
                <a
                  href={exam.officialPdfs?.[0]?.url || `/syllabus/${exam.slug}#pyq`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.quickPill}
                  title="Open official question paper PDF directly in new tab"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>picture_as_pdf</span>
                  <span>Papers (PDF)</span>
                </a>
                <Link
                  href={`/syllabus/${exam.slug}#official-pdf-workspace`}
                  className={styles.quickPill}
                  title="Jump directly to official answer keys"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>task_alt</span>
                  <span>Keys</span>
                </Link>
              </>
            ) : exam.pyqLinks?.length > 0 ? (
              <Link
                href={`/syllabus/${exam.slug}#pyq`}
                className={styles.quickPill}
                title="View previous year question papers"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>picture_as_pdf</span>
                <span>{exam.pyqLinks.length} PYQs</span>
              </Link>
            ) : null}
          </div>

          <Link
            href={`/syllabus/${exam.slug}`}
            className={`${styles.fullSyllabusBtn} ${!hasDownloadedPapers ? styles.fullSyllabusBtnWide : ''}`}
            title={`View full topic breakdown for ${exam.nameEn}`}
          >
            <span>Full Syllabus</span>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
