'use client'
// ============================================================
// app/search/page.js — Search Results Page (AI Upgraded)
// ExamUdaan | Smart Semantic Search + Keyword Search toggle
// ============================================================

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import JobCard from '../../components/JobCard'
import SkeletonCard from '../../components/SkeletonCard'
import styles from './search.module.css'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [posts,      setPosts]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [mode,       setMode]       = useState('smart')  // 'smart' | 'keyword'
  const [searchMode, setSearchMode] = useState('smart')  // what was actually used

  useEffect(() => {
    async function fetchResults() {
      setLoading(true)
      if (!query.trim()) {
        setPosts([])
        setLoading(false)
        return
      }

      try {
        let data
        if (mode === 'smart') {
          // AI Semantic Search
          const res = await fetch(`/api/search/semantic?q=${encodeURIComponent(query)}&limit=20`)
          if (res.ok) {
            data = await res.json()
            const payload = data.data || data
            setPosts(payload.results || payload.posts || [])
            setSearchMode(payload.mode || 'semantic')
          } else {
            setPosts([])
          }
        } else {
          // Classic keyword search
          const res = await fetch(`/api/posts?q=${encodeURIComponent(query)}&page=1`)
          if (res.ok) {
            data = await res.json()
            const payload = data.data || data
            setPosts(payload.posts || payload.results || [])
            setSearchMode('keyword')
          } else {
            setPosts([])
          }
        }
      } catch {
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query, mode])

  return (
    <div className="container">
      {/* Page header */}
      <div className="jobs-pageHeader">
        <h1 className="jobs-pageTitle">Search Results</h1>
        <p className="jobs-pageSubtitle">
          {query
            ? `Showing results for "${query}"`
            : 'Enter a search term to find exams, results, and admit cards.'}
        </p>
      </div>

      {/* Smart Search toggle */}
      {query && (
        <div className={styles.modeRow}>
          <span className={styles.modeLabel}>Search mode:</span>
          <div className={styles.modeToggleGroup}>
            <button
              id="search-mode-smart"
              onClick={() => setMode('smart')}
              className={`${styles.modeBtn} ${mode === 'smart' ? styles.modeBtnActive : ''}`}
            >
              Smart Search
            </button>
            <button
              id="search-mode-keyword"
              onClick={() => setMode('keyword')}
              className={`${styles.modeBtn} ${mode === 'keyword' ? styles.modeBtnActive : ''}`}
            >
              Keyword
            </button>
          </div>
          {mode === 'smart' && (
            <span className={styles.aiPoweredBadge}>
              AI-powered — understands meaning, not just words
            </span>
          )}
          {!loading && searchMode === 'keyword' && mode === 'smart' && (
            <span className={styles.fallbackNote}>
              (Smart search unavailable — showing keyword results)
            </span>
          )}
        </div>
      )}

      <div className="search-singleColumnLayout">
        <main className="jobs-main">
          {query && (
            <div className="jobs-toolbar">
              <span className="jobs-count">
                Found <strong>{posts.length}</strong> {mode === 'smart' ? 'AI-matched' : ''} results
              </span>
            </div>
          )}

          <div className="jobs-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : posts.length === 0 && query
                ? (
                  <div className="search-noResults">
                    <h3>No results found</h3>
                    <p>
                      {mode === 'smart'
                        ? 'Try switching to Keyword mode or different search terms.'
                        : 'Try different keywords or check spelling.'}
                    </p>
                    {mode === 'smart' && (
                      <button
                        onClick={() => setMode('keyword')}
                        className={`btn-primary ${styles.tryKeywordBtn}`}
                      >
                        Try Keyword Search
                      </button>
                    )}
                  </div>
                )
                : posts.map(post => (
                    <div key={post.id} className={styles.cardWrapper}>
                      <JobCard job={post} />
                      {/* Similarity badge for semantic results */}
                      {post.similarity !== undefined && post.similarity !== null && (
                        <div className={styles.similarityBadge}>
                          {Math.round(post.similarity * 100)}% match
                        </div>
                      )}
                    </div>
                  ))
            }
          </div>
        </main>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container search-loadingFallback">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  )
}
