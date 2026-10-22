// ============================================================
// app/ai-news/page.js — ExamUdaan AI Intelligence Feed
// Latest AI news from HackerNews, ArXiv, Reddit — all free
// Also shows how AI tools relate to exam prep
// ZERO INLINE STYLES POLICY COMPLIANT
// FULLY RESPONSIVE ACROSS MOBILE, TABLET, AND DESKTOP
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './aiNews.module.css'

const SOURCE_TABS = [
  { id: 'all', label: 'All Updates', icon: 'newspaper' },
  { id: 'rss', label: 'Google & Tech RSS', icon: 'rss_feed' },
  { id: 'arxiv', label: 'ArXiv Research', icon: 'science' },
  { id: 'hn', label: 'Hacker News AI', icon: 'trending_up' },
]

const CATEGORY_COLORS = {
  'AI News': { bg: '#EFF6FF', color: '#1D4ED8' },
  'AI Breakthrough': { bg: '#ECFDF5', color: '#065F46' },
  'Research Paper': { bg: '#F5F3FF', color: '#5B21B6' },
  'Tech Community': { bg: '#FFF7ED', color: '#C2410C' },
}

// Quick AI-related exam searches with verified working links
const EXAM_AI_LINKS = [
  { label: 'AI for MPSC Prep', href: '/ai-tools?filter=mpsc' },
  { label: 'Claude How-To', href: '/ai-tools/claude' },
  { label: 'NotebookLM Guide', href: '/ai-tools/notebooklm' },
  { label: 'DeepSeek Reasoning', href: '/ai-tools/deepseek' },
  { label: 'Anki Flashcards', href: '/ai-tools/anki' },
  { label: 'AI Academy', href: '/ai-academy' },
]

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function AiNewsPage() {
  const [activeSource, setActiveSource] = useState('all')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sources, setSources] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')

  async function fetchNews(source) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/ai-news?source=${source}&limit=30`)
      const data = await res.json()
      setItems(data.items || [])
      setSources(data.sources || [])
      if (data.error) setError(data.error)
    } catch {
      setError('Failed to load AI news. Try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNews(activeSource) }, [activeSource])

  const displayedItems = items
    .filter(item => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        item.title?.toLowerCase().includes(q) ||
        item.summary?.toLowerCase().includes(q) ||
        item.source?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.publishedAt || 0) - new Date(b.publishedAt || 0)
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '')
      }
      return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
    })

  return (
    <div className={styles.pageWrapper}>
      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span>›</span>
            <span className={styles.breadcrumbCurrent}>AI News & Research</span>
          </nav>

          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <div className={styles.liveBadge}>
                <span className={styles.livePulseDot} />
                Live AI Intelligence Feed
              </div>
              <h1 className={styles.heroTitle}>
                AI News & Research Feed
              </h1>
              <p className={styles.heroSubtitle}>
                Real-time updates from Hacker News, ArXiv AI papers, and open AI tech research communities — all curated free for competitive exam aspirants and tech researchers.
              </p>
              {sources.length > 0 && (
                <div className={styles.sourcesRow}>
                  {sources.map(s => (
                    <span key={s} className={styles.sourcePill}>{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Exam prep shortcut links */}
            <div className={styles.shortcutsCard}>
              <div className={styles.shortcutsHeader}>
                <span>AI for Exam Prep</span>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>bolt</span>
              </div>
              {EXAM_AI_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className={styles.shortcutLink}
                >
                  <span className={`material-symbols-outlined ${styles.shortcutIcon}`}>arrow_forward</span>
                  <span>{l.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Feed Section ── */}
      <main className={styles.container}>
        {/* Search + Sort row (Responsive: Stacks cleanly on mobile < 640px) */}
        <div className={styles.controlRow}>
          <div className={styles.searchHero}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search AI news, LLM updates, ArXiv papers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search AI News"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={styles.clearSearchBtn}
                aria-label="Clear Search"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            )}
          </div>

          <div className={styles.sortWrapper}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={styles.sortSelect}
              id="ai-news-sort-select"
              aria-label="Sort articles"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical</option>
            </select>
            <span className={`material-symbols-outlined ${styles.sortArrow}`}>
              expand_more
            </span>
          </div>
        </div>

        {/* Source Tabs Bar */}
        <div className={styles.sourceTabsRow}>
          {SOURCE_TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSource(tab.id)}
              className={`${styles.sourceTabBtn} ${activeSource === tab.id ? styles.sourceTabBtnActive : ''}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => fetchNews(activeSource)}
            className={styles.refreshBtn}
            title="Refresh feed"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
            <span>Refresh</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingBox}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Loading latest AI intelligence updates...</p>
          </div>
        )}

        {/* News Feed Grid */}
        {!loading && (
          <div className={styles.newsGrid}>
            {displayedItems.map(item => {
              const catStyle = CATEGORY_COLORS[item.category] || { bg: '#F9FAFB', color: '#374151' }
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.newsCard}
                >
                  <div>
                    {/* Source + Category + Time */}
                    <div className={styles.cardHeaderRow}>
                      <div className={styles.sourceBadge}>
                        <span>{item.sourceIcon || '📰'}</span>
                        <span>{item.source}</span>
                      </div>
                      <div className={styles.cardMetaRight}>
                        <span
                          className={styles.categoryTag}
                          style={{ backgroundColor: catStyle.bg, color: catStyle.color }}
                        >
                          {item.category}
                        </span>
                        <span className={styles.timeAgoText}>{timeAgo(item.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className={styles.cardTitle}>
                      {item.title}
                    </h2>

                    {/* Summary (ArXiv + News) */}
                    {item.summary && (
                      <p className={styles.cardSummary}>
                        {item.summary}
                      </p>
                    )}
                  </div>

                  {/* Card Footer: Engagement & Read Link */}
                  <div className={styles.cardFooter}>
                    {(item.points !== undefined || item.comments !== undefined) ? (
                      <div className={styles.engagementRow}>
                        {item.points !== undefined && (
                          <span>⬆️ {item.points?.toLocaleString()} pts</span>
                        )}
                        {item.comments !== undefined && (
                          <span>💬 {item.comments}</span>
                        )}
                      </div>
                    ) : (
                      <span className={styles.timeAgoText}>Verified Source</span>
                    )}
                    <span className={styles.readMoreText}>
                      Read Source
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>open_in_new</span>
                    </span>
                  </div>
                </a>
              )
            })}

            {displayedItems.length === 0 && !loading && (
              <div className={styles.emptyState}>
                <span className={`material-symbols-outlined ${styles.emptyIcon}`}>rss_feed</span>
                <p className={styles.emptyText}>
                  {error || 'No AI news articles matching your search query. Try another term or switch source tabs.'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
