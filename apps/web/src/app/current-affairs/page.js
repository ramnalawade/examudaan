// ============================================================
// app/current-affairs/page.js — Current Affairs listing page
// ExamUdaan.in — Daily current affairs with exam-wise filters
// Automatically ingests live PIB & Govt feeds from /api/current-affairs
// ============================================================
'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { CURRENT_AFFAIRS, CA_CATEGORIES, CA_EXAM_TAGS } from '@/lib/currentAffairsData'
import { LoadMore } from '@/components/Pagination'
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
  Maharashtra: '#ea580c', 'Science & Tech': '#06b6d4', Environment: '#16a34a',
  Sports: '#ef4444', All: '#4f46e5',
}

// Helper to strip HTML tags & unescape entities for display safety
function cleanDisplay(str) {
  if (!str) return ''
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
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

  const PAGE_SIZE = 12
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Reset pagination when category, exam, or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [activeCategory, activeExam, search])

  // Dynamic counts for category pills
  const categoryCounts = useMemo(() => {
    const counts = { All: items.length }
    for (const item of items) {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1
      }
    }
    return counts
  }, [items])

  // Dynamic counts for exam pills
  const examCounts = useMemo(() => {
    const counts = { All: items.length }
    for (const item of items) {
      if (Array.isArray(item.examTags)) {
        for (const tag of item.examTags) {
          counts[tag] = (counts[tag] || 0) + 1
        }
      }
    }
    return counts
  }, [items])

  // Smart toggle handler for Category pill
  const handleCategoryClick = (cat) => {
    if (activeCategory === cat) {
      setActiveCategory('All')
      return
    }
    // If selecting a category that has 0 matches with the current active exam, relax exam to 'All'
    if (cat !== 'All' && activeExam !== 'All') {
      const hasMatch = items.some(
        ca => ca.category === cat && Array.isArray(ca.examTags) && ca.examTags.includes(activeExam)
      )
      if (!hasMatch) {
        setActiveExam('All')
      }
    }
    setActiveCategory(cat)
  }

  // Smart toggle handler for Exam pill
  const handleExamClick = (tag) => {
    if (activeExam === tag) {
      setActiveExam('All')
      return
    }
    // If selecting an exam that has 0 matches with the current active category, relax category to 'All'
    if (tag !== 'All' && activeCategory !== 'All') {
      const hasMatch = items.some(
        ca => ca.category === activeCategory && Array.isArray(ca.examTags) && ca.examTags.includes(tag)
      )
      if (!hasMatch) {
        setActiveCategory('All')
      }
    }
    setActiveExam(tag)
  }

  // Reset all filters
  const resetAllFilters = () => {
    setActiveCategory('All')
    setActiveExam('All')
    setSearch('')
  }

  // Filter entries
  const filtered = useMemo(() => {
    return items.filter(ca => {
      const catMatch = activeCategory === 'All' || ca.category === activeCategory
      const examMatch = activeExam === 'All' || (Array.isArray(ca.examTags) && ca.examTags.includes(activeExam))
      const searchMatch = !search ||
        (ca.title && ca.title.toLowerCase().includes(search.toLowerCase())) ||
        (ca.summary && ca.summary.toLowerCase().includes(search.toLowerCase()))
      return catMatch && examMatch && searchMatch
    })
  }, [items, activeCategory, activeExam, search])

  // Visible items slice for smooth, lightweight DOM rendering
  const visibleItems = useMemo(() => {
    return filtered.slice(0, visibleCount)
  }, [filtered, visibleCount])

  const hasActiveFilters = activeCategory !== 'All' || activeExam !== 'All' || !!search

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
              <div className={styles.stat}><strong>{items.length}+</strong><span>Live Entries</span></div>
              <div className={styles.stat}><strong>6</strong><span>Exam Types</span></div>
              <div className={styles.stat}><strong>Daily</strong><span>Auto-Updates</span></div>
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
              <button className={styles.clearSearch} onClick={() => setSearch('')} title="Clear search">✕</button>
            )}
          </div>

          {/* Category pills */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Category:</span>
            <div className={styles.pills}>
              {CA_CATEGORIES.map(cat => {
                const isSelected = activeCategory === cat
                const count = categoryCounts[cat] || 0
                return (
                  <button
                    key={cat}
                    className={`${styles.pill} ${isSelected ? styles.pillActive : ''}`}
                    onClick={() => handleCategoryClick(cat)}
                    style={isSelected ? { borderColor: CAT_COLORS[cat] || '#ea580c', color: CAT_COLORS[cat] || '#ea580c', background: (CAT_COLORS[cat] || '#ea580c') + '15' } : {}}
                    title={isSelected ? `Click to deselect ${cat}` : `Filter by ${cat}`}
                  >
                    {cat !== 'All' && <span className="material-symbols-outlined">{CAT_ICONS[cat]}</span>}
                    {cat}
                    <span className={styles.pillCount}>({count})</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Exam pills */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Exam:</span>
            <div className={styles.pills}>
              {CA_EXAM_TAGS.map(tag => {
                const isSelected = activeExam === tag
                const count = examCounts[tag] || 0
                return (
                  <button
                    key={tag}
                    className={`${styles.pill} ${styles.pillSmall} ${isSelected ? styles.pillExamActive : ''}`}
                    onClick={() => handleExamClick(tag)}
                    title={isSelected ? `Click to deselect ${tag}` : `Filter by ${tag}`}
                  >
                    {tag}
                    <span className={styles.pillCount}>({count})</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Filters Bar */}
          {hasActiveFilters && (
            <div className={styles.activeFiltersBar}>
              <span className={styles.activeFiltersLabel}>Active Filters:</span>
              {activeCategory !== 'All' && (
                <span className={styles.activeFilterChip}>
                  Category: <strong>{activeCategory}</strong>
                  <button className={styles.removeFilterBtn} onClick={() => setActiveCategory('All')}>✕</button>
                </span>
              )}
              {activeExam !== 'All' && (
                <span className={styles.activeFilterChip}>
                  Exam: <strong>{activeExam}</strong>
                  <button className={styles.removeFilterBtn} onClick={() => setActiveExam('All')}>✕</button>
                </span>
              )}
              {search && (
                <span className={styles.activeFilterChip}>
                  Search: <strong>&ldquo;{search}&rdquo;</strong>
                  <button className={styles.removeFilterBtn} onClick={() => setSearch('')}>✕</button>
                </span>
              )}
              <button className={styles.clearAllBtn} onClick={resetAllFilters}>
                Clear All
              </button>
            </div>
          )}

          <p className={styles.resultCount}>Showing {filtered.length} of {items.length} current affairs</p>
        </div>
      </section>

      {/* ── Cards Grid with Progressive Load More ── */}
      <section className={styles.cardsSection}>
        <div className="container">
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <span className="material-symbols-outlined">search_off</span>
              <h3>No matching updates found</h3>
              <p>We couldn&apos;t find any current affairs matching your current filter selection.</p>
              <div className={styles.emptyActions}>
                <button onClick={resetAllFilters} className="btn-primary" style={{ cursor: 'pointer' }}>
                  Clear All Filters
                </button>
                {activeExam !== 'All' && (
                  <button onClick={() => { setActiveCategory('All'); setSearch('') }} className="btn-outline" style={{ cursor: 'pointer' }}>
                    Show All {activeExam} News ({examCounts[activeExam] || 0})
                  </button>
                )}
                {activeCategory !== 'All' && (
                  <button onClick={() => { setActiveExam('All'); setSearch('') }} className="btn-outline" style={{ cursor: 'pointer' }}>
                    Show All {activeCategory} News ({categoryCounts[activeCategory] || 0})
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className={styles.cardsGrid}>
                {visibleItems.map(ca => (
                  <CACard key={ca.id} ca={ca} />
                ))}
              </div>

              {/* Load More Pagination */}
              <LoadMore
                currentCount={visibleItems.length}
                totalCount={filtered.length}
                onLoadMore={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                label="Load More Current Affairs"
                itemLabel="daily updates"
              />
            </>
          )}

          {/* ── AI Digest Due Diligence Notice (* Conditions) ── */}
          <div style={{
            marginTop: '36px',
            background: '#FFFBEB',
            border: '1px solid #FEF3C7',
            borderLeft: '4px solid var(--primary, #EA580C)',
            borderRadius: '12px',
            padding: '16px 20px',
            color: '#78350F'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '13.5px', color: '#92400E', marginBottom: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#EA580C' }}>smart_toy</span>
              <span>* AI Current Affairs Digest &amp; Candidate Due Diligence Notice</span>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: '12.5px', lineHeight: 1.55 }}>
              Daily headlines, exam syllabus mappings, and &ldquo;Exam Angle&rdquo; analytical notes on this page are generated with AI-assisted aggregation from official PIB and news wires:
            </p>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li style={{ fontSize: '12px', lineHeight: 1.5 }}>
                <strong style={{ color: '#9A3412' }}>* Condition 1 (Academic Reference Only):</strong> Content is compiled strictly for competitive exam preparation and general studies awareness.
              </li>
              <li style={{ fontSize: '12px', lineHeight: 1.5 }}>
                <strong style={{ color: '#9A3412' }}>* Condition 2 (Mandatory Verification with Official Releases):</strong> Aspirants must independently verify statistical figures, cabinet decisions, and policy details with official Gazette publications (PIB, Maharashtra Government) for descriptive/mains examination answers.
              </li>
            </ul>
          </div>
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

  // Clean strings
  const title = cleanDisplay(ca.title)
  let summary = cleanDisplay(ca.summary)
  const whyItMatters = cleanDisplay(ca.whyItMatters)

  // Avoid identical headline duplication in summary
  if (!summary || summary.toLowerCase() === title.toLowerCase() || (summary.length < 40 && title.includes(summary))) {
    summary = `Key government and administrative update concerning ${title}. Critical focus area for ${(ca.examTags || []).join(', ')} syllabus and upcoming preliminary/mains exams.`
  }

  // Format date nicely
  const dateObj = new Date(ca.date)
  const formattedDate = isNaN(dateObj.getTime())
    ? ca.date
    : dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const ytQuery = ca.youtubeQuery || `${title} exam analysis`

  return (
    <article className={styles.caCard}>
      {/* Category accent bar */}
      <div className={styles.cardBar} style={{ background: color }} />

      {/* Category + Date */}
      <div className={styles.cardMeta}>
        <span className={styles.cardCat} style={{ color, background: color + '15' }}>
          <span className="material-symbols-outlined">{icon}</span>
          {ca.category}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {ca.isLive && (
            <span style={{ fontSize: '10px', fontWeight: 800, background: '#ecfdf5', color: '#047857', padding: '2px 7px', borderRadius: 4, letterSpacing: '.4px' }}>
              ● LIVE
            </span>
          )}
          <span className={styles.cardDate}>{formattedDate}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className={styles.cardTitle}>{title}</h3>

      {/* Summary */}
      <p className={styles.cardSummary}>{summary}</p>

      {/* Why it matters */}
      {whyItMatters && (
        <div className={styles.whyBox}>
          <span className={styles.whyIcon}>💡</span>
          <p><strong>Exam Angle:</strong> {whyItMatters}</p>
        </div>
      )}

      {/* Exam tags + Action Buttons */}
      <div className={styles.cardFooter}>
        <div className={styles.examTags}>
          {(ca.examTags || []).map(tag => (
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
              title={`Read source at ${ca.sourceName || 'Govt Portal'}`}
            >
              Source ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

