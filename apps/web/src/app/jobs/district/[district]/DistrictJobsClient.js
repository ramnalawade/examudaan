'use client'
// ============================================================
// app/jobs/district/[district]/DistrictJobsClient.js
//
// Client component for hyperlocal district job pages.
// Renders:
//   1. Hero banner with district name + popular exams
//   2. Breadcrumb trail
//   3. Job listings — fetched from /api/notifications?city=&type=recruitment
//   4. FAQ section (for users + SEO)
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import JobCard from '../../../../components/JobCard'
import styles from './districtJobs.module.css'

export default function DistrictJobsClient({ district }) {
  const [jobs, setJobs]           = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const [hasMore, setHasMore]     = useState(false)

  // Fetch jobs for this district via existing API (?city= filter)
  const fetchJobs = useCallback(async (pageNum = 1, reset = true) => {
    setLoading(true)
    try {
      const url = `/api/notifications?type=recruitment&city=${encodeURIComponent(district.cityFilter)}&page=${pageNum}&limit=20&sort=latest`
      const res  = await fetch(url)
      const json = await res.json()
      const newJobs = json?.data?.notifications || []
      const totalCount = json?.data?.total || 0

      if (reset) {
        setJobs(newJobs)
      } else {
        setJobs(prev => [...prev, ...newJobs])
      }
      setTotal(totalCount)
      setHasMore(pageNum * 20 < totalCount)
    } catch {
      // DB not connected in dev — show empty state gracefully
      setJobs([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [district.cityFilter])

  useEffect(() => {
    setPage(1)
    fetchJobs(1, true)
  }, [fetchJobs])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchJobs(next, false)
  }

  return (
    <div className={styles.page}>

      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.sep}>/</span>
          <Link href="/jobs">Jobs</Link>
          <span className={styles.sep}>/</span>
          <span>{district.name} Jobs</span>
        </nav>
      </div>

      {/* ── Hero Banner ────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          {/* Region tag */}
          <span className={styles.regionPill}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
            {district.region}
          </span>

          {/* Title */}
          <h1 className={styles.heroTitle}>
            {district.name} Government Jobs 2026
            <span className={styles.heroTitleMr}> — {district.nameMr} सरकारी नोकरी</span>
          </h1>

          {/* Subtitle */}
          <p className={styles.heroDesc}>{district.desc}</p>

          {/* Popular exams as chips */}
          <div className={styles.popularRow}>
            <span className={styles.popularLabel}>Popular in {district.name}:</span>
            <div className={styles.chipRow}>
              {district.popular.map(exam => (
                <Link
                  key={exam}
                  href={`/jobs?q=${encodeURIComponent(exam)}`}
                  className={styles.examChip}
                >
                  {exam}
                </Link>
              ))}
            </div>
          </div>

          {/* Total count badge */}
          {!loading && (
            <p className={styles.totalBadge}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle' }}>work</span>
              {total > 0
                ? ` ${total.toLocaleString('en-IN')} active notifications for ${district.name}`
                : ` No active notifications right now — check back soon`
              }
            </p>
          )}
        </div>
      </section>

      {/* ── Job Listings ───────────────────────────────────── */}
      <div className={`container ${styles.content}`}>
        <div className={styles.listingHeader}>
          <h2 className={styles.sectionTitle}>
            Latest Jobs in {district.name}
          </h2>
          <Link href="/alerts" className="btn-primary" style={{ fontSize: 13 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>notifications</span>
            Get Alerts
          </Link>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className={styles.skeletonGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        )}

        {/* Job cards */}
        {!loading && jobs.length > 0 && (
          <div className={styles.jobGrid}>
            {jobs.map(job => (
              <JobCard key={job.id} notification={job} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && jobs.length === 0 && (
          <div className={styles.emptyState}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--outline-variant)' }}>search_off</span>
            <p>No active recruitments found for {district.name} right now.</p>
            <p style={{ fontSize: 13 }}>New notifications are scraped every 6 hours. Bookmark this page and check back!</p>
            <Link href="/jobs" className="btn-outline" style={{ marginTop: 16 }}>
              View All India Jobs
            </Link>
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div className={styles.loadMoreRow}>
            <button onClick={loadMore} className="btn-outline">
              Load More Jobs
            </button>
          </div>
        )}

        {/* ── Quick nav to other districts ─────────────────── */}
        <div className={styles.otherDistricts}>
          <h3 className={styles.otherTitle}>Browse Other Districts</h3>
          <div className={styles.districtGrid}>
            {[
              { slug: 'pune', name: 'Pune' },
              { slug: 'mumbai', name: 'Mumbai' },
              { slug: 'nagpur', name: 'Nagpur' },
              { slug: 'nashik', name: 'Nashik' },
              { slug: 'thane', name: 'Thane' },
              { slug: 'aurangabad', name: 'Chh. Sambhajinagar' },
              { slug: 'kolhapur', name: 'Kolhapur' },
              { slug: 'solapur', name: 'Solapur' },
              { slug: 'amravati', name: 'Amravati' },
              { slug: 'nanded', name: 'Nanded' },
            ]
              .filter(d => d.slug !== district.slug) // exclude current
              .map(d => (
                <Link key={d.slug} href={`/jobs/district/${d.slug}`} className={styles.districtCard}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>location_city</span>
                  {d.name}
                </Link>
              ))
            }
          </div>
        </div>

        {/* ── FAQ Section ──────────────────────────────────── */}
        <section className={styles.faq} id="faq">
          <h2 className={styles.faqTitle}>
            Frequently Asked Questions — {district.name} Govt Jobs
          </h2>
          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary className={styles.faqQ}>
                What are the latest government jobs in {district.name} district?
              </summary>
              <div className={styles.faqA}>
                ExamUdaan tracks all official government job notifications for {district.name} district in real time.
                Popular recruitments include {district.popular.join(', ')}. All listings link directly to the
                official government portal — no clickbait, no fake jobs.
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQ}>
                How do I apply for government jobs in {district.name}?
              </summary>
              <div className={styles.faqA}>
                Click any job card above and then click &ldquo;Apply Online&rdquo; or &ldquo;Official Notification PDF&rdquo;
                on the detail page. This takes you directly to the government website. Never pay any fee to a
                third-party agent — all government job applications are free.
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQ}>
                How can I get alerts for new jobs in {district.name}?
              </summary>
              <div className={styles.faqA}>
                Subscribe to ExamUdaan WhatsApp or Email alerts from the{' '}
                <Link href="/alerts">Alerts page</Link>. You can filter alerts by organization, qualification
                level, and exam type so you only receive notifications relevant to your profile.
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQ}>
                {district.faqExtra.split('?')[0]}?
              </summary>
              <div className={styles.faqA}>
                {district.faqExtra.split('?').slice(1).join('?').trim()}
              </div>
            </details>
          </div>
        </section>

      </div>
    </div>
  )
}
