/**
 * /walk-in-interviews — Walk-in Interview Listings
 * Shows all notifications where is_walk_in = TRUE
 * Fetches from /api/notifications?walk_in=true
 */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './walkIn.module.css'

// ── Utility: Days left badge ───────────────────────────────────
function DaysLeftBadge({ dateStr }) {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const today  = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24))

  if (diff < 0)  return <span className={`${styles.badge} ${styles.badgeClosed}`}>Closed</span>
  if (diff === 0) return <span className={`${styles.badge} ${styles.badgeToday}`}>📍 Today!</span>
  if (diff <= 3)  return <span className={`${styles.badge} ${styles.badgeUrgent}`}>⚡ {diff} Days Left</span>
  if (diff <= 7)  return <span className={`${styles.badge} ${styles.badgeSoon}`}>🕐 This Week</span>
  return <span className={`${styles.badge} ${styles.badgeUpcoming}`}>{diff} Days Left</span>
}

// ── Walk-in Card ───────────────────────────────────────────────
function WalkInCard({ item }) {
  const pdfLink = item.notification_pdf
    || item.application_links?.notification_pdf
    || item.source_url
    || null

  // Format exam date / walk-in date
  const walkInDate = item.exam_date || item.apply_end_date

  return (
    <div className={styles.card}>
      {/* Urgency ribbon */}
      <DaysLeftBadge dateStr={walkInDate} />

      <div className={styles.cardBody}>
        {/* Org + type */}
        <div className={styles.cardMeta}>
          <span className={styles.orgBadge}>{item.org_acronym || item.organization || 'Govt'}</span>
          <span className={styles.typeBadge}>🚶 Walk-in</span>
          {item.state_normalized && (
            <span className={styles.stateBadge}>{item.state_normalized}</span>
          )}
        </div>

        {/* Title */}
        <h3 className={styles.cardTitle}>
          <Link href={`/jobs/${item.slug || item.id}`} className={styles.titleLink}>
            {item.title}
          </Link>
        </h3>

        {/* Key details row */}
        <div className={styles.detailRow}>
          {item.total_vacancies && (
            <span className={styles.detail}>
              <span className={styles.detailIcon}>👥</span>
              {item.total_vacancies} Vacancies
            </span>
          )}
          {item.exam_date && (
            <span className={styles.detail}>
              <span className={styles.detailIcon}>📅</span>
              Walk-in: {new Date(item.exam_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          )}
          {item.apply_end_date && !item.exam_date && (
            <span className={styles.detail}>
              <span className={styles.detailIcon}>⏰</span>
              Last Date: {new Date(item.apply_end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          )}
          {item.salary_min && (
            <span className={styles.detail}>
              <span className={styles.detailIcon}>💰</span>
              ₹{(item.salary_min / 1000).toFixed(0)}K–{(item.salary_max / 1000).toFixed(0)}K/mo
            </span>
          )}
        </div>

        {/* Qualifications snippet */}
        {(item.qualifications?.mandatory?.length > 0) && (
          <p className={styles.qualSnippet}>
            🎓 {item.qualifications.mandatory.slice(0, 2).join(', ')}
          </p>
        )}

        {/* Cities */}
        {item.cities_normalized?.length > 0 && (
          <div className={styles.cities}>
            📍 {item.cities_normalized.slice(0, 3).join(' • ')}
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className={styles.cardFooter}>
        <Link href={`/jobs/${item.slug || item.id}`} className={styles.btnDetail}>
          View Details
        </Link>
        {pdfLink && (
          <a href={pdfLink} target="_blank" rel="noopener noreferrer" className={styles.btnPdf}>
            📄 Notification PDF
          </a>
        )}
        {item.application_links?.official_website && (
          <a
            href={item.application_links.official_website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnOfficial}
          >
            🌐 Official Site
          </a>
        )}
      </div>
    </div>
  )
}

// ── Skeleton loader ───────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.skel} ${styles.skelBadge}`} />
      <div className={`${styles.skel} ${styles.skelMeta}`} />
      <div className={`${styles.skel} ${styles.skelTitle}`} />
      <div className={`${styles.skel} ${styles.skelDetails}`} />
      <div className={`${styles.skel} ${styles.skelFooter}`} />
    </div>
  )
}

// ── Filter Chips ──────────────────────────────────────────────
const DEPARTMENTS = ['All', 'Medical / NHM', 'Education', 'Research', 'Agriculture', 'Municipal', 'Police']
const DATE_FILTERS = [
  { label: 'All Dates', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
]

// ── Main Page ─────────────────────────────────────────────────
export default function WalkInInterviewsPage() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [dept, setDept]         = useState('All')
  const [dateFilter, setDateFilter] = useState('all')
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(0)

  const PER_PAGE = 20

  // ── Fetch walk-in jobs ─────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          walk_in: 'true',
          page: String(page),
          limit: String(PER_PAGE),
        })
        if (search) params.set('q', search)

        const res = await fetch(`/api/notifications?${params}`)
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        setItems(data.posts || data.items || [])
        setTotal(data.total || 0)
      } catch (err) {
        console.error('Walk-in fetch error:', err)
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, search])

  // ── Client-side filter by dept / date ─────────────────────
  const filtered = items.filter(item => {
    // Dept filter (client-side on job_categories)
    if (dept !== 'All') {
      const cats = (item.job_categories || []).join(' ').toLowerCase()
      const deptLower = dept.toLowerCase()
      if (deptLower === 'medical / nhm' && !cats.match(/medical|health|nhm|nurse|doctor/)) return false
      if (deptLower === 'education' && !cats.match(/education|teacher|school|university/)) return false
      if (deptLower === 'research' && !cats.match(/research|scientist|lab/)) return false
      if (deptLower === 'agriculture' && !cats.match(/agriculture|agri|farm/)) return false
      if (deptLower === 'municipal' && !cats.match(/municipal|corporation|pmc|bmc/)) return false
      if (deptLower === 'police' && !cats.match(/police|security/)) return false
    }

    // Date filter
    if (dateFilter !== 'all') {
      const date = new Date(item.exam_date || item.apply_end_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (isNaN(date)) return false

      if (dateFilter === 'today') {
        const isSameDay = date.toDateString() === today.toDateString()
        return isSameDay
      }
      if (dateFilter === 'week') {
        const weekEnd = new Date(today)
        weekEnd.setDate(weekEnd.getDate() + 7)
        return date >= today && date <= weekEnd
      }
      if (dateFilter === 'month') {
        const monthEnd = new Date(today)
        monthEnd.setDate(monthEnd.getDate() + 30)
        return date >= today && date <= monthEnd
      }
    }

    return true
  })

  return (
    <main className={styles.page}>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link> › <span>Walk-in Interviews</span>
          </div>
          <div className={styles.heroContent}>
            <div>
              <h1 className={styles.heroTitle}>
                🚶 Walk-in Interviews 2026
              </h1>
              <p className={styles.heroSubtitle}>
                No online application needed — attend directly with your documents.
                Updated daily from NHM, Universities, Research Institutes & Govt Hospitals.
              </p>
            </div>
            <div className={styles.heroTip}>
              <strong>💡 Walk-in Tips:</strong>
              <ul>
                <li>Carry originals + 2 photocopies of all docs</li>
                <li>Reach venue 30 mins early</li>
                <li>Carry passport-size photos (6–8 copies)</li>
                <li>Bring valid ID proof (Aadhaar / PAN)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ────────────────────────────────────── */}
      <section className={styles.filterBar}>
        <div className="container">
          {/* Search */}
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search walk-in interviews (e.g. nurse, lecturer, doctor)"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
            {search && (
              <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* Department chips */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Department:</span>
            <div className={styles.chips}>
              {DEPARTMENTS.map(d => (
                <button
                  key={d}
                  className={`${styles.chip} ${dept === d ? styles.chipActive : ''}`}
                  onClick={() => { setDept(d); setPage(1) }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Date filter */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Walk-in Date:</span>
            <div className={styles.chips}>
              {DATE_FILTERS.map(df => (
                <button
                  key={df.value}
                  className={`${styles.chip} ${dateFilter === df.value ? styles.chipActive : ''}`}
                  onClick={() => { setDateFilter(df.value); setPage(1) }}
                >
                  {df.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.resultCount}>
            {loading ? 'Loading...' : `Showing ${filtered.length} of ${total} walk-in interviews`}
          </div>
        </div>
      </section>

      {/* ── Cards ──────────────────────────────────────── */}
      <section className={styles.content}>
        <div className="container">

          {/* Alert box */}
          <div className={styles.alertBox}>
            <span>🔔</span>
            <div>
              <strong>Never miss a walk-in interview!</strong>
              <span> Get instant WhatsApp/Email alerts for new walk-in postings.</span>
            </div>
            <Link href="/alerts" className={styles.alertBtn}>Set Alerts Free</Link>
          </div>

          {/* Cards grid */}
          <div className={styles.cardsGrid}>
            {loading
              ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : filtered.length > 0
                ? filtered.map(item => <WalkInCard key={item.id} item={item} />)
                : (
                  <div className={styles.emptyState}>
                    <span>🔍</span>
                    <h3>No walk-in interviews found</h3>
                    <p>
                      {search
                        ? `No results for "${search}". Try broader keywords.`
                        : 'No walk-in interviews currently listed. Check back tomorrow!'}
                    </p>
                    <Link href="/jobs" className="btn-primary">Browse All Jobs</Link>
                  </div>
                )
            }
          </div>

          {/* Pagination */}
          {total > PER_PAGE && !loading && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                ← Previous
              </button>
              <span className={styles.pageInfo}>Page {page} of {Math.ceil(total / PER_PAGE)}</span>
              <button
                className={styles.pageBtn}
                disabled={page * PER_PAGE >= total}
                onClick={() => setPage(p => p + 1)}
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ── Info Section: How Walk-in Works ─────────────── */}
      <section className={styles.infoSection}>
        <div className="container">
          <h2 className={styles.infoTitle}>📋 How Walk-in Interviews Work</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <span className={styles.infoNum}>1</span>
              <h4>No Online Application</h4>
              <p>Unlike regular recruitments, walk-in interviews don't require online form submission. Just show up with your documents.</p>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoNum}>2</span>
              <h4>Check Eligibility First</h4>
              <p>Read the notification PDF carefully. Confirm your age, qualification, and category eligibility before attending.</p>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoNum}>3</span>
              <h4>Document Checklist</h4>
              <p>Typically needed: SSC/HSC Marksheets, Degree Certificate, Experience Letters, Caste Certificate (if applicable), ID proof, Photos.</p>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoNum}>4</span>
              <h4>Same-Day Result</h4>
              <p>Many walk-in interviews are completed in a single day. Shortlisted candidates may be offered appointment letters on the spot.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
