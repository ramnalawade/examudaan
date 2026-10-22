// ============================================================
// components/OmniSearchModal.js — Unified Spotlight & Omni-Search
// ExamUdaan.in — Blazing Fast Portal Search across:
// 1. Jobs & Alerts (PostgreSQL)
// 2. Syllabus & Schemes
// 3. Mock Tests & Speed Drills
// 4. AI Study Tools
// 5. Preparation Strategies & Blogs
// 6. Career Pathways
//
// ZERO INLINE STYLES POLICY: All styling in OmniSearchModal.module.css
// Keyboard: Cmd+K / Ctrl+K / '/' to open, Arrow keys to navigate,
//           Enter to select, Esc to close.
// ============================================================

'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './OmniSearchModal.module.css'

export const OPEN_OMNI_SEARCH_EVENT = 'examudaan:open-omni-search'

export function triggerOmniSearch(initialQuery = '') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(OPEN_OMNI_SEARCH_EVENT, { detail: { query: initialQuery } })
    )
  }
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All', icon: 'auto_awesome' },
  { id: 'jobs', label: 'Jobs', icon: 'work' },
  { id: 'syllabus', label: 'Syllabus', icon: 'menu_book' },
  { id: 'mock_tests', label: 'Mock Tests', icon: 'quiz' },
  { id: 'papers', label: 'Papers & Keys', icon: 'description' },
  { id: 'blogs', label: 'Guides', icon: 'article' },
  { id: 'career', label: 'Career Paths', icon: 'map' },
  { id: 'ai_tools', label: 'AI Tools', icon: 'smart_toy' },
]

const QUICK_TRENDING_TOPICS = [
  { label: 'MPSC Rajyaseva', icon: 'account_balance' },
  { label: 'Police Bharti 2026', icon: 'local_police' },
  { label: 'Talathi TCS Mock', icon: 'quiz' },
  { label: 'Google NotebookLM', icon: 'smart_toy' },
  { label: 'SSC CGL Tier 1', icon: 'school' },
  { label: 'How to crack MPSC', icon: 'article' },
  { label: 'Software Engineer', icon: 'map' },
]

export default function OmniSearchModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [dynamicTrending, setDynamicTrending] = useState([])
  const [results, setResults] = useState({
    jobs: [],
    syllabus: [],
    mock_tests: [],
    papers: [],
    ai_tools: [],
    blogs: [],
    career: []
  })
  const [flatResults, setFlatResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef(null)
  const listRef = useRef(null)
  const filterBarRef = useRef(null)
  const debounceTimerRef = useRef(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Deduplicate and filter out partial keystroke fragments from dynamic trending topics
  const cleanTrendingTopics = useMemo(() => {
    if (!dynamicTrending || dynamicTrending.length === 0) return QUICK_TRENDING_TOPICS

    const unique = Array.from(new Set(dynamicTrending.map(t => (typeof t === 'string' ? t.trim() : '')))).filter(t => t.length >= 2)
    const deduped = unique.filter((item) => {
      const hasLonger = unique.some(other => other.length > item.length && other.toLowerCase().startsWith(item.toLowerCase()))
      return !hasLonger
    })

    const finalItems = (deduped.length > 0 ? deduped : unique).slice(0, 8)
    return finalItems.map(t => ({ label: t, icon: 'trending_up' }))
  }, [dynamicTrending])

  // ── Load Recent Searches from localStorage on Mount ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem('eu_recent_searches')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 6))
        }
      }
    } catch {}
  }, [])

  function saveRecentSearch(term) {
    if (!term || typeof term !== 'string') return
    const clean = term.trim()
    if (clean.length < 2) return

    setRecentSearches(prev => {
      const updated = [clean, ...prev.filter(t => t.toLowerCase() !== clean.toLowerCase())].slice(0, 6)
      try {
        localStorage.setItem('eu_recent_searches', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  function removeRecentSearch(term) {
    setRecentSearches(prev => {
      const updated = prev.filter(t => t !== term)
      try {
        localStorage.setItem('eu_recent_searches', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  function clearRecentSearches() {
    setRecentSearches([])
    try {
      localStorage.removeItem('eu_recent_searches')
    } catch {}
  }

  const checkFilterScroll = useCallback(() => {
    const el = filterBarRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 6)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6)
  }, [])

  // ── Global Keyboard Shortcuts (Cmd+K / Ctrl+K / '/') ──
  useEffect(() => {
    function handleKeyDown(e) {
      // Don't trigger if typing in another input / textarea
      const targetTag = e.target?.tagName?.toLowerCase()
      const isInput = targetTag === 'input' || targetTag === 'textarea' || e.target?.isContentEditable

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        return
      }

      if (e.key === '/' && !isInput && !isOpen) {
        e.preventDefault()
        setIsOpen(true)
        return
      }

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        setIsOpen(false)
      }
    }

    function handleCustomOpen(e) {
      setIsOpen(true)
      if (e?.detail?.query) {
        setQuery(e.detail.query)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener(OPEN_OMNI_SEARCH_EVENT, handleCustomOpen)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener(OPEN_OMNI_SEARCH_EVENT, handleCustomOpen)
    }
  }, [isOpen])

  // Focus input and check scroll when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
        checkFilterScroll()
      }, 60)
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      // Initial fetch of trending items
      fetchSearchResults(query, activeCategory)
    } else {
      document.body.style.overflow = ''
      setSelectedIndex(0)
    }
  }, [isOpen, checkFilterScroll])

  // Check scroll when window resizes or flatResults changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(checkFilterScroll, 100)
      window.addEventListener('resize', checkFilterScroll)
      return () => window.removeEventListener('resize', checkFilterScroll)
    }
  }, [isOpen, flatResults, checkFilterScroll])

  function scrollFilterBar(offset) {
    if (filterBarRef.current) {
      filterBarRef.current.scrollBy({ left: offset, behavior: 'smooth' })
      setTimeout(checkFilterScroll, 220)
    }
  }

  // ── Fetch Results ──
  const fetchSearchResults = useCallback(async (q, cat) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (cat && cat !== 'all') params.set('category', cat)

      const res = await fetch(`/api/search/omni?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        const payload = json.data || json
        setResults(payload.categories || {
          jobs: [],
          syllabus: [],
          mock_tests: [],
          papers: [],
          ai_tools: [],
          blogs: [],
          career: []
        })
        setFlatResults(payload.flat || [])
        setSelectedIndex(0)

        // Capture dynamic trending searches from database
        if (Array.isArray(payload.trendingSearches) && payload.trendingSearches.length > 0) {
          setDynamicTrending(payload.trendingSearches)
        }

        // Save valid search to user's personal history & trigger Google Analytics (GA4)
        if (q && q.trim().length >= 2) {
          saveRecentSearch(q)
          if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'search', {
              search_term: q.trim(),
              search_category: cat || 'all',
              results_count: payload.total || (payload.flat ? payload.flat.length : 0)
            })
          }
        }
      }
    } catch (err) {
      console.warn('[omni-search] fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced input change
  function handleInputChange(e) {
    const val = e.target.value
    setQuery(val)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSearchResults(val, activeCategory)
    }, 150)
  }

  // Handle Tab click
  function handleCategoryChange(catId, e) {
    setActiveCategory(catId)
    fetchSearchResults(query, catId)
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }

  // ── Keyboard Navigation (Arrows & Enter) ──
  function handleInputKeyDown(e) {
    if (flatResults.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % flatResults.length)
      scrollToItem((selectedIndex + 1) % flatResults.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + flatResults.length) % flatResults.length)
      scrollToItem((selectedIndex - 1 + flatResults.length) % flatResults.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = flatResults[selectedIndex]
      if (item?.url) {
        handleNavigate(item.url)
      }
    }
  }

  function scrollToItem(index) {
    const container = listRef.current
    if (!container) return
    const items = container.querySelectorAll(`.${styles.resultItem}`)
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }

  function handleNavigate(url) {
    if (query && query.trim().length >= 2) {
      saveRecentSearch(query)
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'select_content', {
          content_type: 'omni_search_result',
          item_id: url,
          search_term: query.trim()
        })
      }
    }
    setIsOpen(false)
    router.push(url)
  }

  function handleTrendingPillClick(topicLabel) {
    setQuery(topicLabel)
    fetchSearchResults(topicLabel, activeCategory)
    inputRef.current?.focus()
  }

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false)
      }}
      role="dialog"
      aria-modal="true"
      aria-label="ExamUdaan Omni Search"
    >
      <div className={styles.modal}>
        {/* ── Top Header Search Bar ── */}
        <div className={styles.inputHeader}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search all jobs, syllabus, mock tests, AI tools, guides..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            aria-label="Search ExamUdaan"
          />
          {query ? (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => {
                setQuery('')
                fetchSearchResults('', activeCategory)
                inputRef.current?.focus()
              }}
              aria-label="Clear search query"
            >
              <span className={`material-symbols-outlined ${styles.clearIcon}`}>
                close
              </span>
            </button>
          ) : null}
          <button
            type="button"
            className={styles.closeKeyBadge}
            onClick={() => setIsOpen(false)}
            aria-label="Close search"
          >
            ESC
          </button>
        </div>

        {/* ── Category Filter Tabs ── */}
        <div className={styles.filterBarWrapper}>
          {canScrollLeft && (
            <button
              type="button"
              className={`${styles.filterScrollBtn} ${styles.filterScrollBtnLeft}`}
              onClick={() => scrollFilterBar(-180)}
              aria-label="Scroll categories left"
            >
              <span className={`material-symbols-outlined ${styles.scrollArrowIcon}`}>chevron_left</span>
            </button>
          )}

          <div
            className={styles.filterBar}
            ref={filterBarRef}
            onScroll={checkFilterScroll}
          >
            {CATEGORY_TABS.map(tab => {
              const count = tab.id === 'all'
                ? flatResults.length
                : (results[tab.id]?.length || 0)

              const isActive = activeCategory === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.filterChip} ${isActive ? styles.filterChipActive : ''}`}
                  onClick={(e) => handleCategoryChange(tab.id, e)}
                >
                  <span className={`material-symbols-outlined ${styles.chipIcon}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span className={styles.chipCount}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>

          {canScrollRight && (
            <button
              type="button"
              className={`${styles.filterScrollBtn} ${styles.filterScrollBtnRight}`}
              onClick={() => scrollFilterBar(180)}
              aria-label="Scroll categories right"
            >
              <span className={`material-symbols-outlined ${styles.scrollArrowIcon}`}>chevron_right</span>
            </button>
          )}
        </div>

        {/* ── Results Container ── */}
        <div className={styles.resultsList} ref={listRef}>
          {/* Recent Searches & Trending Suggestions (when query is empty) */}
          {!query && (
            <div className={styles.emptyPromptBox}>
              {/* User Personal Search History */}
              {recentSearches.length > 0 && (
                <div className={styles.recentSection}>
                  <div className={styles.sectionHeaderRow}>
                    <span className={styles.sectionTitle}>
                      🕒 Recent Searches
                    </span>
                    <button
                      type="button"
                      className={styles.clearRecentBtn}
                      onClick={clearRecentSearches}
                      aria-label="Clear recent search history"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className={styles.recentPillGrid}>
                    {recentSearches.map(term => (
                      <div key={term} className={styles.recentPillWrapper}>
                        <button
                          type="button"
                          className={styles.recentPill}
                          onClick={() => handleTrendingPillClick(term)}
                        >
                          <span className={`material-symbols-outlined ${styles.recentPillIcon}`}>
                            history
                          </span>
                          <span>{term}</span>
                        </button>
                        <button
                          type="button"
                          className={styles.removeRecentBtn}
                          onClick={(e) => {
                            e.stopPropagation()
                            removeRecentSearch(term)
                          }}
                          aria-label={`Remove ${term} from history`}
                          title="Remove"
                        >
                          <span className={`material-symbols-outlined ${styles.removeIcon}`}>close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Trending / Popular Fast Jumps */}
              <div className={styles.trendingBox}>
                <div className={styles.sectionTitle}>
                  🔥 Trending Searches on ExamUdaan
                </div>
                <div className={styles.trendingPillGrid}>
                  {cleanTrendingTopics.map(topic => (
                    <button
                      key={topic.label}
                      type="button"
                      className={styles.trendingPill}
                      onClick={() => handleTrendingPillClick(topic.label)}
                    >
                      <span className={`material-symbols-outlined ${styles.trendingPillIcon}`}>
                        {topic.icon}
                      </span>
                      <span>{topic.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results List */}
          {flatResults.length > 0 ? (
            flatResults.map((item, idx) => {
              const isSelected = selectedIndex === idx
              const prevCategory = idx > 0 ? flatResults[idx - 1].category : null
              const showCategoryHeader = activeCategory === 'all' && item.category !== prevCategory

              return (
                <div key={item.id} className={styles.itemWrapper}>
                  {showCategoryHeader && (
                    <div className={styles.categorySectionHeader}>
                      <span className={`material-symbols-outlined ${styles.categoryHeaderIcon}`}>
                        {item.icon}
                      </span>
                      <span>{item.categoryLabel || item.category}</span>
                      {results[item.category]?.length > 0 && (
                        <span className={styles.categoryHeaderBadge}>
                          {results[item.category].length}
                        </span>
                      )}
                    </div>
                  )}
                  <div
                    className={`${styles.resultItem} ${isSelected ? styles.resultItemActive : ''}`}
                    onClick={() => handleNavigate(item.url)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className={styles.itemIconBox}>
                      <span className={`material-symbols-outlined ${styles.resultIcon}`}>
                        {item.icon}
                      </span>
                    </div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTitleRow}>
                        <span className={styles.itemTitle}>{item.title}</span>
                        {item.badge && (
                          <span className={styles.itemBadge}>{item.badge}</span>
                        )}
                      </div>
                      <div className={styles.itemSubtitle}>
                        {item.categoryLabel} • {item.subtitle}
                      </div>
                    </div>
                    <span className={`material-symbols-outlined ${styles.itemArrow}`}>
                      arrow_forward
                    </span>
                  </div>
                </div>
              )
            })
          ) : !loading ? (
            <div className={styles.emptyState}>
              <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
                search_off
              </span>
              <div className={styles.emptyTitle}>
                No results found for &ldquo;{query}&rdquo;
              </div>
              <div className={styles.emptyDesc}>
                Try searching with simpler terms like &ldquo;MPSC&rdquo;, &ldquo;Police&rdquo;, &ldquo;Syllabus&rdquo;, or &ldquo;Mock&rdquo;.
              </div>
            </div>
          ) : null}
        </div>

        {/* ── Footer Keyboard Hints ── */}
        <div className={styles.footerHints}>
          <div className={styles.hintsLeft}>
            <span className={styles.hintItem}>
              <kbd className={styles.kbd}>↑</kbd> <kbd className={styles.kbd}>↓</kbd> to navigate
            </span>
            <span className={styles.hintItem}>
              <kbd className={styles.kbd}>↵</kbd> to open
            </span>
            <span className={styles.hintItem}>
              <kbd className={styles.kbd}>ESC</kbd> to exit
            </span>
          </div>
          <div className={styles.poweredBy}>
            ExamUdaan Omni Search
          </div>
        </div>
      </div>
    </div>
  )
}
