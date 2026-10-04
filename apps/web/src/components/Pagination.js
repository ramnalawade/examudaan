// ============================================================
// components/Pagination.js — Universal Reusable Pagination & LoadMore
// ExamUdaan.in | Reusable across Jobs, Current Affairs, PYQ, Question Papers, Blog
// Supports:
//   1. <LoadMore /> — Infinite list expansion with progress counter & bar
//   2. <Pagination /> — Page-numbered pagination (< 1 2 3 ... 10 >)
//   3. Default export <UniversalPagination /> — Auto-switches via `variant` prop
// ============================================================
'use client'

import styles from './Pagination.module.css'

/**
 * ── 1. LoadMore Component ───────────────────────────────────
 * Best for feeds, search results, and continuous browsing (Jobs, Current Affairs, Walk-ins)
 *
 * @param {number} currentCount - Number of items currently shown
 * @param {number} totalCount   - Total count of items available
 * @param {function} onLoadMore - Handler called when user clicks Load More
 * @param {boolean} loading     - Whether fetching is currently in flight
 * @param {string} label        - Button label (e.g. "Load More Current Affairs")
 * @param {string} itemLabel    - Noun for item counter (e.g. "updates", "jobs")
 * @param {boolean} showProgress- Whether to render the visual progress bar
 */
export function LoadMore({
  currentCount = 0,
  totalCount = 0,
  onLoadMore,
  loading = false,
  label = 'Load More',
  itemLabel = 'items',
  showProgress = true,
  className = '',
}) {
  const hasMore = currentCount < totalCount
  const percentage = totalCount > 0 ? Math.min(100, Math.round((currentCount / totalCount) * 100)) : 100

  if (totalCount <= 0) return null

  return (
    <div className={`${styles.loadMoreContainer} ${className}`} id="pagination-load-more">
      {/* Visual Counter & Progress */}
      {showProgress && (
        <div className={styles.progressWrap}>
          <div className={styles.counterText}>
            Showing <span className={styles.counterHighlight}>{currentCount.toLocaleString('en-IN')}</span> of{' '}
            <span className={styles.counterHighlight}>{totalCount.toLocaleString('en-IN')}</span> {itemLabel}
          </div>
          <div className={styles.progressBarBg} role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
            <div className={styles.progressBarFill} style={{ width: `${percentage}%` }} />
          </div>
        </div>
      )}

      {/* Button or All Loaded State */}
      {hasMore ? (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loading}
          className={styles.loadMoreBtn}
          id="btn-load-more"
          aria-label={label}
        >
          {loading ? (
            <>
              <span className={styles.btnSpinner} aria-hidden="true" />
              <span>Loading more…</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>expand_more</span>
              <span>{label}</span>
            </>
          )}
        </button>
      ) : (
        <div className={styles.allLoadedWrap} id="pagination-all-loaded">
          <span className={`material-symbols-outlined ${styles.allLoadedCheck}`}>check_circle</span>
          <span>You have viewed all {totalCount.toLocaleString('en-IN')} {itemLabel}</span>
        </div>
      )}
    </div>
  )
}

/**
 * ── 2. Standard Numbered Pagination Component ───────────────
 * Best for structured archives (PYQ, Question Papers, Blog, Admin)
 *
 * @param {number} currentPage  - 1-indexed active page
 * @param {number} totalPages   - Total number of pages
 * @param {function} onPageChange - Callback receiving (pageNumber)
 * @param {boolean} loading     - Whether page change is in flight
 */
export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
  className = '',
}) {
  if (totalPages <= 1) return null

  // Generate sliding window of page numbers with ellipses
  const getPageNumbers = () => {
    const pages = []
    const delta = 2 // Number of pages around current

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className={`${styles.numberedContainer} ${className}`} aria-label="Pagination Navigation" id="pagination-numbered">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
        className={styles.pageNavBtn}
        aria-label="Previous page"
      >
        <span className={`material-symbols-outlined ${styles.pageNavIcon}`}>chevron_left</span>
        <span>Prev</span>
      </button>

      {/* Numbered Page Buttons */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
              …
            </span>
          )
        }

        const isActive = page === currentPage

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            disabled={loading || isActive}
            className={`${styles.pageBtn} ${isActive ? styles.pageBtnActive : ''}`}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        )
      })}

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        className={styles.pageNavBtn}
        aria-label="Next page"
      >
        <span>Next</span>
        <span className={`material-symbols-outlined ${styles.pageNavIcon}`}>chevron_right</span>
      </button>
    </nav>
  )
}

/**
 * ── 3. Universal Default Export ─────────────────────────────
 * Swappable via `variant="loadMore"` (default) or `variant="numbered"`
 */
export default function UniversalPagination({
  variant = 'loadMore',
  ...props
}) {
  if (variant === 'numbered') {
    return <Pagination {...props} />
  }
  return <LoadMore {...props} />
}
