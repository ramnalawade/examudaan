// ============================================================
// app/current-affairs/page.js — Current Affairs listing page
// ExamUdaan.in — Daily current affairs with exam-wise filters
// Automatically ingests live PIB & Govt feeds from /api/current-affairs
// ============================================================
'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { CURRENT_AFFAIRS, CA_CATEGORIES, CA_EXAM_TAGS } from '@/lib/currentAffairsData'
import styles from './currentAffairs.module.css'

// Category icon map
const CAT_ICONS = {
  National: 'flag', International: 'public', Economy: 'show_chart',
  Maharashtra: 'location_on', 'Science & Tech': 'science', Environment: 'eco',
  Sports: 'sports_cricket', All: 'newspaper',
}

// Category color map
const CAT_COLORS = {
  National: '#3b82f6', International: '#8b5cf6', Economy: '#10b981',
  Maharashtra: '#f97316', 'Science & Tech': '#06b6d4', Environment: '#22c55e',
  Sports: '#ef4444',
}

export default function CurrentAffairsPage() {
  const [items, setItems] = useState(CURRENT_AFFAIRS)
  const [isLiveConnected, setIsLiveConnected] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeExam, setActiveExam] = useState('All')
  const [search, setSearch] = useState('')

  // ── Ingest live Govt & PIB feeds asynchronously on mount ────
  useEffect(() => {
    let active = true
    async function fetchLiveUpdates() {
      try {
        const res = await fetch('/api/current-affairs?limit=100')
        if (res.ok) {
          const data = await res.json()
          if (active && data.items && data.items.length > 0) {
            setItems(data.items)
            setIsLiveConnected(true)
          }
        }
      } catch (err) {
        // Fallback to initial CURRENT_AFFAIRS gracefully
      }
    }
    fetchLiveUpdates()
    return () => { active = false }
  }, [])

  // Filter entries
  const filtered = useMemo(() => {
    return items.filter(ca => {
      const catMatch = activeCategory === 'All' || ca.category === activeCategory
      const examMatch = activeExam === 'All' || ca.examTags.includes(activeExam)
      const searchMatch = !search || ca.title.toLowerCase().includes(search.toLowerCase()) || ca.summary.toLowerCase().includes(search.toLowerCase())
      return catMatch && examMatch && searchMatch
    })
  }, [items, activeCategory, activeExam, search])

  return (
    <main className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <span className={styles.heroLabel}>📰 Daily Updates</span>
              {isLiveConnected && (
                <span className={styles.liveBadge}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  Live Govt RSS Active
                </span>
              )}
            </div>
            <h1>Current Affairs — MPSC, UPSC, IBPS, SSC</h1>
            <p>Curated daily current affairs with exam relevance explained. Know exactly <em>why</em> each news item matters for your exam — not just <em>what</em> happened.</p>
            <div className={styles.heroStats}>
              <div className={styles.stat}><strong>{items.length}+</strong><span>Entries</span></div>
              <div className={styles.stat}><strong>6</strong><span>Exam Types</span></div>
              <div className={styles.stat}><strong>Daily</strong><span>Updates</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className={styles.filterBar}>
        <div className="container">
          {/* Search */}
          <div className={styles.searchBox}>
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search current affairs (e.g. Budget, Metro, Ladki Bahin, RBI)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* Category pills */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Category:</span>
            <div className={styles.pills}>
              {CA_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`${styles.pill} ${activeCategory === cat ? styles.pillActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  style={activeCategory === cat ? { borderColor: CAT_COLORS[cat] || '#ea580c', color: CAT_COLORS[cat] || '#ea580c', background: (CAT_COLORS[cat] || '#ea580c') + '15' } : {}}
                >
                  {cat !== 'All' && <span className="material-symbols-outlined">{CAT_ICONS[cat]}</span>}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Exam pills */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Exam:</span>
            <div className={styles.pills}>
              {CA_EXAM_TAGS.map(tag => (
                <button
                  key={tag}
                  className={`${styles.pill} ${styles.pillSmall} ${activeExam === tag ? styles.pillExamActive : ''}`}
                  onClick={() => setActiveExam(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <p className={styles.resultCount}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      {/* ── Cards Grid ── */}
      <section className={styles.cardsSection}>
        <div className="container">
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <span className="material-symbols-outlined">search_off</span>
              <p>No results found. Try a different filter or search term.</p>
            </div>
          ) : (
            <div className={styles.cardsGrid}>
              {filtered.map(ca => (
                <CACard key={ca.id} ca={ca} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA row ── */}
      <section className={styles.ctaRow}>
        <div className="container">
          <div className={styles.ctaGrid}>
            <div className={styles.ctaCard}>
              <span>🎯</span>
              <div>
                <h3>Test Your Knowledge</h3>
                <p>Try our free current affairs mock test with 20 MCQs.</p>
              </div>
              <Link href="/mock-tests/mpsc-current-affairs-2026" className="btn-primary">Start Test →</Link>
            </div>
            <div className={styles.ctaCard}>
              <span>📚</span>
              <div>
                <h3>Full Syllabus</h3>
                <p>Know the complete current affairs topics for your exam.</p>
              </div>
              <Link href="/syllabus" className="btn-outline">View Syllabus →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// ── CA Card Component ────────────────────────────────────────
function CACard({ ca }) {
  const color = CAT_COLORS[ca.category] || '#ea580c'
  const icon = CAT_ICONS[ca.category] || 'article'

  // Format date nicely
  const dateObj = new Date(ca.date)
  const formattedDate = isNaN(dateObj.getTime())
    ? ca.date
    : dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const ytQuery = ca.youtubeQuery || `${ca.title} exam analysis`

  return (
    <div className={styles.caCard}>
      {/* Color bar */}
      <div className={styles.cardBar} style={{ background: color }} />

      {/* Category + Date */}
      <div className={styles.cardMeta}>
        <span className={styles.cardCat} style={{ color, background: color + '15' }}>
          <span className="material-symbols-outlined">{icon}</span>
          {ca.category}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {ca.isLive && (
            <span style={{ fontSize: '10px', fontWeight: 800, background: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: 4 }}>
              LIVE
            </span>
          )}
          <span className={styles.cardDate}>{formattedDate}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className={styles.cardTitle}>{ca.title}</h3>

      {/* Summary */}
      <p className={styles.cardSummary}>{ca.summary}</p>

      {/* Why it matters */}
      <div className={styles.whyBox}>
        <span className={styles.whyIcon}>💡</span>
        <p><strong>Exam Angle:</strong> {ca.whyItMatters}</p>
      </div>

      {/* Exam tags + YouTube Learning Hub Link */}
      <div className={styles.cardFooter}>
        <div className={styles.examTags}>
          {ca.examTags.map(tag => (
            <span key={tag} className={styles.examTag}>{tag}</span>
          ))}
        </div>
        <div className={styles.cardActions}>
          <Link
            href={`/youtube?q=${encodeURIComponent(ytQuery)}`}
            className={styles.ytBtn}
            title="Watch in ExamUdaan YouTube Learning Hub"
          >
            ▶ Watch on Hub
          </Link>
          {ca.sourceUrl && (
            <a
              href={ca.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceBtn}
            >
              Source ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
