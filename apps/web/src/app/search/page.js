'use client'
// ============================================================
// app/search/page.js — Search Results Page (AI Upgraded)
// ExamUdaan | Smart Semantic Search + Keyword Search toggle
// ============================================================

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import JobCard from '../../components/JobCard'
import SkeletonCard from '../../components/SkeletonCard'

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
            setPosts(data.results || [])
            setSearchMode(data.mode || 'semantic')
          } else {
            setPosts([])
          }
        } else {
          // Classic keyword search
          const res = await fetch(`/api/posts?q=${encodeURIComponent(query)}&page=1`)
          if (res.ok) {
            data = await res.json()
            setPosts(data.posts || [])
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Search mode:</span>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <button
              id="search-mode-smart"
              onClick={() => setMode('smart')}
              style={{
                padding: '6px 16px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'smart' ? 'var(--accent)' : 'transparent',
                color: mode === 'smart' ? 'white' : 'var(--text-body)',
                transition: 'all 0.2s',
              }}
            >
              Smart Search
            </button>
            <button
              id="search-mode-keyword"
              onClick={() => setMode('keyword')}
              style={{
                padding: '6px 16px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'keyword' ? 'var(--accent)' : 'transparent',
                color: mode === 'keyword' ? 'white' : 'var(--text-body)',
                transition: 'all 0.2s',
              }}
            >
              Keyword
            </button>
          </div>
          {mode === 'smart' && (
            <span style={{
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-light)',
              color: 'var(--accent-text)',
              fontWeight: 600,
            }}>
              AI-powered — understands meaning, not just words
            </span>
          )}
          {!loading && searchMode === 'keyword' && mode === 'smart' && (
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
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
                        className="btn-primary"
                        style={{ marginTop: '12px' }}
                      >
                        Try Keyword Search
                      </button>
                    )}
                  </div>
                )
                : posts.map(post => (
                    <div key={post.id} style={{ position: 'relative' }}>
                      <JobCard post={post} />
                      {/* Similarity badge for semantic results */}
                      {post.similarity !== undefined && post.similarity !== null && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'var(--accent)',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 'var(--radius-full)',
                        }}>
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
