// ============================================================
// app/youtube/page.js — ExamUdaan YouTube Learning Hub
// Shows curated channels + inline video search with embedded players
// Users watch videos DIRECTLY on ExamUdaan — no redirect to YouTube
// Fully bilingual in Marathi & English using useLanguage()
// ============================================================

'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'
import { ALL_CHANNELS, EXAM_FILTERS, LANG_FILTERS, PRECOOKED_VIDEOS } from '../../lib/youtubeData'

// ── Quick topic searches that pre-populate the search box ────
const QUICK_SEARCHES = [
  'MPSC Rajyaseva 2026',
  'महाराष्ट्र पोलीस भरती',
  'UPSC GS Paper 1',
  'Banking PO preparation',
  'तलाठी भरती सराव',
  'SSC CGL 2026',
  'Current Affairs Today',
  'AI tools for students',
]

function YouTubeContent() {
  const { isMarathi } = useLanguage()
  const [tab, setTab] = useState('featured') // 'featured' | 'channels' | 'search'
  const [featuredExam, setFeaturedExam] = useState('all')
  const [featuredSearch, setFeaturedSearch] = useState('')
  const [featuredSort, setFeaturedSort] = useState('latest')
  const [activeExam, setActiveExam] = useState('all')
  const [activeLang, setActiveLang] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeVideo, setActiveVideo] = useState(null)
  const [nextPageToken, setNextPageToken] = useState(null)
  const [error, setError] = useState(null)
  const searchParams = useSearchParams()
  const playerRef = useRef(null)

  // ── Search videos via our API ─────────────────────────────
  const searchVideos = useCallback(async (query, pageToken = '') => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ q: query, maxResults: 12 })
      if (pageToken) params.set('pageToken', pageToken)
      const res = await fetch(`/api/youtube?${params}`)
      const data = await res.json()
      if (data.error && !data.demo) {
        setError(data.error)
        return
      }
      if (pageToken) {
        setSearchResults(prev => [...prev, ...(data.items || [])])
      } else {
        setSearchResults(data.items || [])
        setActiveVideo(null)
      }
      setNextPageToken(data.nextPageToken || null)
    } catch {
      setError('Failed to fetch videos. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Auto-handle URL query params (?q=... or ?v=...) ────────
  useEffect(() => {
    if (!searchParams) return
    const q = searchParams.get('q') || searchParams.get('search')
    const v = searchParams.get('v')
    const title = searchParams.get('title')
    if (v) {
      setActiveVideo({ videoId: v, title: title || 'Exam Lecture', channelTitle: 'YouTube Learning Hub' })
    }
    if (q) {
      setSearchInput(q)
      setSearchQuery(q)
      setTab('search')
      searchVideos(q)
    }
  }, [searchParams, searchVideos])

  // ── Select and play video in top main player & smoothly scroll up ──
  const handlePlayVideo = useCallback((video) => {
    setActiveVideo(video)
    if (searchResults.length === 0) {
      setSearchResults(PRECOOKED_VIDEOS.filter(v => v.videoId !== video.videoId))
    }
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 60)
  }, [searchResults.length])

  // Scroll to player whenever activeVideo changes
  useEffect(() => {
    if (activeVideo) {
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 60)
    }
  }, [activeVideo?.videoId])

  // ── Fetch channel videos ─────────────────────────────────
  const fetchChannelVideos = useCallback(async (channelId) => {
    setLoading(true)
    setError(null)
    setActiveVideo(null)
    try {
      const res = await fetch(`/api/youtube?channelId=${channelId}&maxResults=8`)
      const data = await res.json()
      if (data.error && !data.demo) setError(data.error)
      else setSearchResults(data.items || [])
    } catch {
      setError('Failed to load channel videos.')
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Handle search form submit ─────────────────────────────
  function handleSearch(e) {
    e.preventDefault()
    if (!searchInput.trim()) return
    setSearchQuery(searchInput)
    setTab('search')
    searchVideos(searchInput)
  }

  // ── Handle quick topic click ──────────────────────────────
  function handleQuickSearch(q) {
    setSearchInput(q)
    setSearchQuery(q)
    setTab('search')
    searchVideos(q)
  }

  // Filtered channels
  const filteredChannels = ALL_CHANNELS.filter(ch => {
    const examMatch = activeExam === 'all' || ch.exam === activeExam
    const langMatch = activeLang === 'all' || ch.lang === activeLang
    return examMatch && langMatch
  })

  // Filtered precooked videos
  const displayedPrecooked = PRECOOKED_VIDEOS
    .filter(v => {
      const examMatch = featuredExam === 'all' || v.exam === featuredExam
      if (!examMatch) return false
      if (!featuredSearch.trim()) return true
      const q = featuredSearch.toLowerCase()
      return (
        v.title?.toLowerCase().includes(q) ||
        v.channelTitle?.toLowerCase().includes(q) ||
        v.subject?.toLowerCase().includes(q) ||
        v.badge?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (featuredSort === 'channel') {
        return (a.channelTitle || '').localeCompare(b.channelTitle || '')
      }
      if (featuredSort === 'title') {
        return (a.title || '').localeCompare(b.title || '')
      }
      return 0
    })

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 80 }}>

      {/* ── Page Header ── */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(255,0,0,0.05) 0%, var(--surface) 100%)',
        borderBottom: '1px solid var(--outline-variant)',
        padding: '32px 20px 24px',
      }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>
              {isMarathi ? 'मुख्यपृष्ठ' : 'Home'}
            </Link>
            {' › '}
            {isMarathi ? 'YouTube अभ्यास हब' : 'YouTube Learning Hub'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                📺 {isMarathi ? 'YouTube मोफत लेक्चर्स व मार्गदर्शक हब' : 'YouTube Learning Hub'}
              </h1>
              <p style={{ fontSize: 14, color: 'var(--secondary)', margin: 0 }}>
                {isMarathi
                  ? 'कोणत्याही जाहिरातींशिवाय आणि ExamUdaan न सोडता थेट सर्वोत्तम परीक्षा मार्गदर्शन व्हिडिओ पहा'
                  : 'Watch curated exam prep videos without leaving ExamUdaan'}
              </p>
            </div>

            {/* Search box in header */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 280, maxWidth: 650 }}>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder={isMarathi ? 'शोधा: MPSC राज्यसेवा, पोलीस भरती, चालू घडामोडी, AI साधने...' : 'Search: MPSC 2026 strategy, AI tools for students, GK...'}
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 10,
                  border: '1.5px solid var(--outline-variant)',
                  fontSize: 15, background: 'var(--surface-container-lowest)',
                  color: 'var(--on-surface)', fontFamily: 'inherit',
                  outline: 'none', height: 48,
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#FF0000', color: '#fff', border: 'none',
                  padding: '0 22px', borderRadius: 10, height: 48,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
                {isMarathi ? 'शोधा' : 'Search'}
              </button>
            </form>
          </div>

          {/* Quick topic pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--secondary)', alignSelf: 'center', whiteSpace: 'nowrap' }}>
              {isMarathi ? 'लोकप्रिय विषय:' : 'Quick search:'}
            </span>
            {QUICK_SEARCHES.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickSearch(q)}
                style={{
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)',
                  padding: '4px 12px', borderRadius: 999,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  color: 'var(--on-surface)', fontFamily: 'inherit',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active Video Player ── */}
      {activeVideo && (
        <div
          ref={playerRef}
          id="main-video-player"
          style={{
            background: '#000', borderBottom: '1px solid #222',
            padding: '20px 20px',
            scrollMarginTop: '10px',
          }}
        >
          <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="yt-player-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 20 }}>
              {/* Player */}
              <div>
                <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 8, overflow: 'hidden', background: '#111' }}>
                  <iframe
                    key={activeVideo.videoId}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div style={{ padding: '12px 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
                      {activeVideo.title}
                    </h2>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>{activeVideo.channelTitle}</span>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'rgba(255,255,255,0.1)', color: '#fff',
                      padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                      textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
                    {isMarathi ? 'YouTube वर उघडा' : 'Open in YouTube'}
                  </a>
                </div>
              </div>

              {/* Up Next sidebar */}
              <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  {isMarathi ? 'पुढील लेक्चर्स (Up Next)' : 'Up Next'}
                </div>
                {searchResults.slice(0, 8).map((v) => (
                  <button
                    key={v.videoId}
                    onClick={() => handlePlayVideo(v)}
                    style={{
                      width: '100%', display: 'flex', gap: 10, alignItems: 'center',
                      background: activeVideo?.videoId === v.videoId ? 'rgba(255,255,255,0.1)' : 'transparent',
                      border: 'none', padding: '8px 6px', borderRadius: 6,
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      marginBottom: 6,
                    }}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`}
                        alt={v.title}
                        style={{ width: 100, height: 56, objectFit: 'cover', borderRadius: 4 }}
                      />
                      <span style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 20,
                      }}>▶</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {v.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{v.channelTitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ maxWidth: 1200, margin: '24px auto 0', padding: '0 20px' }}>

        {/* ── Tab switcher ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--outline-variant)' }}>
          {[
            { id: 'featured', label: isMarathi ? '🔥 निवडक लेक्चर्स' : '🔥 Pre-Cooked Videos', icon: 'smart_display' },
            { id: 'channels', label: isMarathi ? 'YouTube चॅनेल्स (३०+)' : 'Browse Channels (30+)', icon: 'subscriptions' },
            { id: 'search', label: searchQuery ? (isMarathi ? `निकाल: "${searchQuery}"` : `Results: "${searchQuery}"`) : (isMarathi ? 'थेट शोध' : 'Live Search'), icon: 'search' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: 'none',
                borderBottom: `3px solid ${tab === t.id ? '#FF0000' : 'transparent'}`,
                marginBottom: -2,
                padding: '10px 16px', cursor: 'pointer',
                fontSize: 14, fontWeight: tab === t.id ? 700 : 500,
                color: tab === t.id ? 'var(--on-surface)' : 'var(--secondary)',
                fontFamily: 'inherit', transition: 'all 0.15s ease',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── FEATURED PRE-COOKED VIDEOS TAB ── */}
        {tab === 'featured' && (
          <div>
            {/* ── Search + Sort row ── */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center' }}>
              <div className="search-hero" style={{ flex: 1, minWidth: 0 }}>
                <span className="material-symbols-outlined search-icon">search</span>
                <input
                  type="text"
                  placeholder={isMarathi ? 'लेक्चर्स, विषय, मार्गदर्शक किंवा चॅनेलचे नाव शोधा...' : 'Search pre-cooked videos, subjects, channels, mentors...'}
                  value={featuredSearch}
                  onChange={e => setFeaturedSearch(e.target.value)}
                  style={{ height: 48, fontSize: 15 }}
                />
                {featuredSearch && (
                  <button
                    onClick={() => setFeaturedSearch('')}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)', display: 'flex' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                  </button>
                )}
              </div>

              <div style={{ position: 'relative', flexShrink: 0, width: 'auto' }}>
                <select
                  value={featuredSort}
                  onChange={e => setFeaturedSort(e.target.value)}
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
                  id="youtube-featured-sort-select"
                  aria-label="Sort"
                >
                  <option value="latest">{isMarathi ? 'निवडक क्रम' : 'Curated Order'}</option>
                  <option value="title">{isMarathi ? 'शीर्षक (A-Z)' : 'Title A-Z'}</option>
                  <option value="channel">{isMarathi ? 'चॅनेल नाव' : 'Channel Name'}</option>
                </select>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  pointerEvents: 'none', color: 'var(--secondary)', fontSize: 20
                }}>
                  expand_more
                </span>
              </div>
            </div>

            {/* Filter pills */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              flexWrap: 'wrap', marginBottom: 24,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--secondary)', whiteSpace: 'nowrap' }}>
                {isMarathi ? 'परीक्षा फिल्टर:' : 'Filter Exam:'}
              </span>
              {[
                { id: 'all', label: isMarathi ? 'सर्व व्हिडिओ' : 'All Videos' },
                { id: 'ai', label: isMarathi ? '🤖 AI साधने' : '🤖 AI Study Tools' },
                { id: 'mpsc', label: '🔶 MPSC' },
                { id: 'upsc', label: '🎯 UPSC' },
                { id: 'banking', label: isMarathi ? '🏦 बँकिंग' : '🏦 Banking' },
                { id: 'ssc', label: '📝 SSC & RRB' },
                { id: 'gate', label: '⚙️ GATE' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFeaturedExam(f.id)}
                  style={{
                    background: featuredExam === f.id ? '#FF0000' : 'var(--surface-container-lowest)',
                    color: featuredExam === f.id ? '#fff' : 'var(--on-surface)',
                    border: `1.5px solid ${featuredExam === f.id ? '#FF0000' : 'var(--outline-variant)'}`,
                    padding: '6px 14px', borderRadius: 8,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.15s ease',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Video Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {displayedPrecooked.map((video) => {
                const isActive = activeVideo?.videoId === video.videoId
                return (
                  <div
                    key={video.videoId + video.title}
                    style={{
                      background: 'var(--surface-container-lowest)',
                      border: `2px solid ${isActive ? 'var(--primary)' : 'var(--outline-variant)'}`,
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      display: 'flex', flexDirection: 'column',
                      boxShadow: isActive ? '0 0 0 3px rgba(234,88,12,0.2)' : 'none',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                    }}
                  >
                    {/* Thumbnail banner with Play overlay */}
                    <div
                      onClick={() => handlePlayVideo(video)}
                      style={{
                        position: 'relative', paddingTop: '56.25%',
                        cursor: 'pointer', background: '#000', overflow: 'hidden',
                      }}
                      title={isActive ? (isMarathi ? 'सध्या वर प्लेअरमध्ये सुरू आहे' : 'Currently playing in top player') : `Play "${video.title}"`}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                          objectFit: 'cover', transition: 'transform 0.2s ease',
                        }}
                      />
                      {/* Play Button Overlay or Now Playing */}
                      {isActive ? (
                        <div style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(234,88,12,0.85)',
                        }}>
                          <div style={{ textAlign: 'center', color: '#fff' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 36, display: 'block' }}>play_circle</span>
                            <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                              {isMarathi ? 'आता सुरू आहे ▲' : 'Now Playing ▲'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.3)',
                        }}>
                          <div style={{
                            width: 52, height: 52, borderRadius: '50%', background: '#FF0000',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', boxShadow: '0 4px 15px rgba(255,0,0,0.4)',
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 32, marginLeft: 3 }}>play_arrow</span>
                          </div>
                        </div>
                      )}
                      {video.duration && (
                        <span style={{
                          position: 'absolute', bottom: 8, right: 8,
                          background: 'rgba(0,0,0,0.85)', color: '#fff',
                          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                        }}>
                          {video.duration}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 999,
                          background: 'rgba(0,0,0,0.06)', color: video.badgeColor,
                        }}>
                          {video.examBadge}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--secondary)' }}>
                          {video.lang}
                        </span>
                      </div>

                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--on-surface)', lineHeight: 1.4 }}>
                        {video.title}
                      </div>

                      <p style={{ fontSize: 12.5, color: 'var(--secondary)', lineHeight: 1.5, margin: 0, flex: 1 }}>
                        {video.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 10, borderTop: '1px solid var(--outline-variant)' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--secondary)' }}>
                          {video.channelTitle}
                        </span>
                        <button
                          onClick={() => handlePlayVideo(video)}
                          style={{
                            background: isActive ? 'var(--primary)' : '#FF0000', color: '#fff', border: 'none',
                            padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                            {isActive ? 'arrow_upward' : 'play_circle'}
                          </span>
                          {isActive ? (isMarathi ? 'वर सुरू आहे' : 'Now Playing Above') : (isMarathi ? 'आता पहा' : 'Watch Now')}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── CHANNELS TAB ── */}
        {tab === 'channels' && (
          <div>
            {/* Filters */}
            <div style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 'var(--radius-lg)', padding: '16px 18px',
              marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  {isMarathi ? 'परीक्षानिहाय फिल्टर' : 'Filter by Exam'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {EXAM_FILTERS.map(f => (
                    <button key={f.id} onClick={() => setActiveExam(f.id)} style={{
                      background: activeExam === f.id ? 'var(--primary)' : 'var(--surface)',
                      color: activeExam === f.id ? '#fff' : 'var(--on-surface)',
                      border: `1.5px solid ${activeExam === f.id ? 'var(--primary)' : 'var(--outline-variant)'}`,
                      padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  {isMarathi ? 'भाषानिहाय फिल्टर' : 'Filter by Language'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {LANG_FILTERS.map(f => (
                    <button key={f.id} onClick={() => setActiveLang(f.id)} style={{
                      background: activeLang === f.id ? '#DC2626' : 'var(--surface)',
                      color: activeLang === f.id ? '#fff' : 'var(--on-surface)',
                      border: `1.5px solid ${activeLang === f.id ? '#DC2626' : 'var(--outline-variant)'}`,
                      padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Channel grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {filteredChannels.map((ch, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-lg)', padding: 16,
                    display: 'flex', flexDirection: 'column', gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, background: '#FF0000', borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, flexShrink: 0,
                    }}>
                      {ch.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ch.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--secondary)' }}>
                        {ch.subscribers} • {ch.lang}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        setTab('search')
                        fetchChannelVideos(ch.channelId)
                        setSearchQuery(`Channel: ${ch.name}`)
                        setSearchInput(ch.name)
                      }}
                      style={{
                        flex: 1, background: '#FF0000', color: '#fff',
                        border: 'none', padding: '8px 0', borderRadius: 8,
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 14 }}>▶</span>
                      {isMarathi ? 'व्हिडिओ पहा' : 'Watch Videos'}
                    </button>
                    <button
                      onClick={() => handleQuickSearch(ch.name + ' exam prep')}
                      style={{
                        background: 'var(--surface)', border: '1.5px solid var(--outline-variant)',
                        padding: '8px 12px', borderRadius: 8,
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        color: 'var(--on-surface)', fontFamily: 'inherit',
                      }}
                    >
                      {isMarathi ? 'शोधा' : 'Search'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SEARCH / VIDEO RESULTS TAB ── */}
        {tab === 'search' && (
          <div>
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: 40, height: 40, border: '4px solid var(--outline-variant)',
                  borderTopColor: '#FF0000', borderRadius: '50%',
                  margin: '0 auto 12px',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <p style={{ color: 'var(--secondary)', margin: 0 }}>
                  {isMarathi ? 'व्हिडिओ लोड होत आहेत...' : 'Loading videos...'}
                </p>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {error && (
              <div style={{
                padding: '16px 20px', borderRadius: 10,
                background: '#FEF2F2', border: '1px solid #FECACA',
                color: '#991B1B', marginBottom: 20, fontSize: 14,
              }}>
                <strong>⚠️ {isMarathi ? 'नोंद:' : 'Note:'}</strong> {error.includes('YOUTUBE_API_KEY') || error.includes('not configured')
                  ? (isMarathi
                      ? 'YouTube API की कन्फिगर केलेली नाही. सॅम्पल व्हिडिओ खाली दर्शवले आहेत.'
                      : 'YouTube API key not configured. Sample videos shown below.')
                  : error}
              </div>
            )}

            {!loading && searchResults.length === 0 && !error && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 52, color: 'var(--secondary)', display: 'block', marginBottom: 12 }}>
                  ondemand_video
                </span>
                <p style={{ color: 'var(--secondary)', margin: 0 }}>
                  {isMarathi
                    ? 'वरील शोधपेटीमध्ये कोणताही विषय टाईप करा किंवा चॅनेलचे व्हिडिओ पहा'
                    : 'Search for any topic above or click "Watch Videos" on a channel'}
                </p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div>
                <div style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 16, fontWeight: 600 }}>
                  {searchResults.length} {isMarathi ? 'व्हिडिओ' : 'videos'} {searchQuery && (isMarathi ? `— "${searchQuery}" शोध निकाल` : `for "${searchQuery}"`)}
                  {activeVideo && <span style={{ color: 'var(--primary)' }}> · {isMarathi ? 'सुरू आहे:' : 'Now playing:'} {activeVideo.title.substring(0, 40)}...</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {searchResults.map((video, i) => (
                    <VideoCard
                      key={video.videoId + i}
                      video={video}
                      isActive={activeVideo?.videoId === video.videoId}
                      onPlay={handlePlayVideo}
                      isMarathi={isMarathi}
                    />
                  ))}
                </div>

                {nextPageToken && !loading && (
                  <div style={{ textAlign: 'center', marginTop: 28 }}>
                    <button
                      onClick={() => searchVideos(searchQuery, nextPageToken)}
                      style={{
                        background: 'var(--surface-container-lowest)',
                        border: '1.5px solid var(--outline-variant)',
                        padding: '11px 28px', borderRadius: 8,
                        fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        color: 'var(--on-surface)', fontFamily: 'inherit',
                      }}
                    >
                      {isMarathi ? 'आणखी व्हिडिओ पहा' : 'Load More Videos'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

// ── Individual video card ──────────────────────────────────
function VideoCard({ video, isActive, onPlay, isMarathi }) {
  const thumb = video.thumbnail || `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`

  return (
    <div style={{
      background: 'var(--surface-container-lowest)',
      border: `2px solid ${isActive ? 'var(--primary)' : 'var(--outline-variant)'}`,
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'border-color 0.15s, box-shadow 0.15s',
      boxShadow: isActive ? '0 0 0 3px rgba(234,88,12,0.2)' : 'none',
    }}>
      {/* Video thumbnail with Play overlay */}
      <div
        style={{
          position: 'relative', paddingTop: '56.25%',
          background: '#000', cursor: 'pointer', overflow: 'hidden',
        }}
        onClick={() => onPlay(video)}
        title={isActive ? (isMarathi ? 'सध्या वर प्लेअरमध्ये सुरू आहे' : 'Currently playing in top player') : `Play "${video.title}"`}
      >
        <img
          src={thumb}
          alt={video.title}
          loading="lazy"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {isActive ? (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(234,88,12,0.85)',
          }}>
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, display: 'block' }}>play_circle</span>
              <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {isMarathi ? 'आता सुरू आहे ▲' : 'Now Playing ▲'}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.25)',
            transition: 'background 0.2s',
          }}>
            <div style={{
              width: 52, height: 36, background: '#FF0000', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}>
              ▶
            </div>
          </div>
        )}
      </div>

      {/* Video info */}
      <div style={{ padding: '12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, lineHeight: 1.4, color: 'var(--on-surface)',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {video.title}
        </div>
        <div style={{ fontSize: 11, color: 'var(--secondary)' }}>
          {video.channelTitle}
          {video.publishedAt && (
            <> · {new Date(video.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        padding: '0 14px 12px',
        display: 'flex', gap: 8,
      }}>
        <button
          onClick={() => onPlay(video)}
          style={{
            flex: 1,
            background: isActive ? 'var(--primary)' : '#FF0000',
            color: '#fff', border: 'none',
            padding: '8px 0', borderRadius: 7,
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background 0.15s',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            {isActive ? 'arrow_upward' : 'play_circle'}
          </span>
          {isActive ? (isMarathi ? 'वर सुरू आहे' : 'Now Playing Above') : (isMarathi ? 'प्लेअरमध्ये पहा' : 'Watch in Player')}
        </button>
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          title={isMarathi ? 'YouTube वर उघडा' : 'Open in YouTube'}
          style={{
            background: 'var(--surface)', border: '1.5px solid var(--outline-variant)',
            padding: '7px 10px', borderRadius: 7,
            fontSize: 11, color: 'var(--secondary)', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
        </a>
      </div>
    </div>
  )
}

export default function YouTubePage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--surface)', color: 'var(--on-surface)', minHeight: '60vh' }}>
        <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, marginBottom: 12 }}>
          📺 YouTube Learning Hub
        </h1>
        <p style={{ fontSize: 14, color: 'var(--secondary)' }}>
          Loading curated exam preparation lectures &amp; videos...
        </p>
      </div>
    }>
      <YouTubeContent />
    </Suspense>
  )
}
