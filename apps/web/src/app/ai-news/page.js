// ============================================================
// app/ai-news/page.js — ExamUdaan AI Intelligence Feed
// Latest AI news from HackerNews, ArXiv, Reddit — all free
// Also shows how AI tools relate to exam prep
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    } catch (e) {
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
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(99,102,241,0.06) 0%, var(--surface) 100%)',
        borderBottom: '1px solid var(--outline-variant)',
        padding: '36px 20px 28px',
      }}>
        <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 14 }}>
            <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Home</Link>
            {' › '}AI News & Research
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#EFF6FF', color: '#1D4ED8',
                padding: '4px 14px', borderRadius: 999,
                fontSize: 12, fontWeight: 800, marginBottom: 12,
              }}>
                <span style={{ width: 7, height: 7, background: '#3B82F6', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px #3B82F6' }} />
                Live AI Intelligence Feed
              </div>
              <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                AI News & Research
              </h1>
              <p style={{ fontSize: 14, color: 'var(--secondary)', margin: '0 0 16px', maxWidth: 600, lineHeight: 1.6 }}>
                Latest from Hacker News, ArXiv AI papers, and Reddit AI community — all in one feed.
                No X/Twitter API (too expensive). All sources are completely free.
              </p>
              {sources.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {sources.map(s => (
                    <span key={s} style={{
                      fontSize: 12, fontWeight: 700,
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      padding: '3px 10px', borderRadius: 999, color: 'var(--secondary)',
                    }}>{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Exam prep shortcut links */}
            <div style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 10, padding: '14px 16px', minWidth: 220,
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: 10 }}>
                Use AI for Exam Prep →
              </div>
              {EXAM_AI_LINKS.map((l, i) => (
                <Link
                  key={i}
                  href={l.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: 13, fontWeight: 600, color: 'var(--on-surface)',
                    textDecoration: 'none', padding: '5px 0',
                    borderBottom: i < EXAM_AI_LINKS.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--primary)' }}>arrow_forward</span>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100, margin: '24px auto 0', padding: '0 20px' }}>

        {/* ── Search + Sort row (Dominant Search, Compact Sort) ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
          <div className="search-hero" style={{ flex: 1, minWidth: 0 }}>
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Search AI news, LLM updates, research papers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ height: 48, fontSize: 15 }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)', display: 'flex' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            )}
          </div>

          <div style={{ position: 'relative', flexShrink: 0, width: 'auto' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="form-select"
              style={{
                width: 'auto',
                minWidth: 140,
                maxWidth: 175,
                flexShrink: 0,
                height: 48,
                padding: '0 34px 0 14px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 12,
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                cursor: 'pointer',
                color: 'var(--on-surface)',
              }}
              id="ai-news-sort-select"
              aria-label="Sort"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical</option>
            </select>
            <span className="material-symbols-outlined" style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              pointerEvents: 'none', color: 'var(--secondary)', fontSize: 20
            }}>
              expand_more
            </span>
          </div>
        </div>

        {/* Source tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--outline-variant)', overflowX: 'auto' }}>
          {SOURCE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSource(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: 'none',
                borderBottom: `3px solid ${activeSource === tab.id ? '#4F46E5' : 'transparent'}`,
                marginBottom: -2, padding: '10px 16px', cursor: 'pointer',
                fontSize: 13, fontWeight: activeSource === tab.id ? 700 : 500,
                color: activeSource === tab.id ? 'var(--on-surface)' : 'var(--secondary)',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => fetchNews(activeSource)}
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: 'none',
              padding: '10px 12px', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: 'var(--secondary)', fontFamily: 'inherit',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{
              width: 36, height: 36, border: '4px solid var(--outline-variant)',
              borderTopColor: '#4F46E5', borderRadius: '50%',
              margin: '0 auto 12px', animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: 'var(--secondary)', margin: 0 }}>Loading AI news...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* News feed */}
        {!loading && (
          <div className="ai-news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
            {displayedItems.map(item => {
              const catStyle = CATEGORY_COLORS[item.category] || { bg: '#F9FAFB', color: '#374151' }
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-lg)', padding: '16px 18px',
                    textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8,
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                >
                  {/* Source + Time */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14 }}>{item.sourceIcon}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--secondary)' }}>{item.source}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 4,
                        background: catStyle.bg, color: catStyle.color,
                      }}>{item.category}</span>
                      <span style={{ fontSize: 11, color: 'var(--secondary)' }}>{timeAgo(item.publishedAt)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1.45 }}>
                    {item.title}
                  </div>

                  {/* Summary (ArXiv + News) */}
                  {item.summary && (
                    <div style={{ fontSize: 12, color: 'var(--secondary)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.summary}
                    </div>
                  )}

                  {/* Points / comments (HN + Reddit) */}
                  {(item.points !== undefined || item.comments !== undefined) && (
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--secondary)' }}>
                      {item.points !== undefined && (
                        <span>⬆️ {item.points?.toLocaleString()} points</span>
                      )}
                      {item.comments !== undefined && (
                        <span>💬 {item.comments} comments</span>
                      )}
                    </div>
                  )}
                </a>
              )
            })}

            {items.length === 0 && !loading && (
              <div style={{
                gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px',
                background: 'var(--surface-container-lowest)',
                border: '1px dashed var(--outline-variant)', borderRadius: 'var(--radius-lg)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--secondary)', display: 'block', marginBottom: 12 }}>rss_feed</span>
                <p style={{ color: 'var(--secondary)', margin: 0 }}>
                  {error || 'No AI news at the moment. Try refreshing or check another source tab.'}
                </p>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  )
}
