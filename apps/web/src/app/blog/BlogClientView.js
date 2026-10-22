// ============================================================
// app/blog/BlogClientView.js — Client Interactive Component for Blog Hub
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './blog.module.css'
import { BLOG_CATEGORIES } from '../../lib/blogData'

export default function BlogClientView({ initialPosts = [] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = initialPosts.filter(post => {
    if (activeCategory !== 'All' && post.category !== activeCategory) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const matchTitle = post.title.toLowerCase().includes(q)
      const matchTitleMr = post.titleMr?.toLowerCase().includes(q)
      const matchExcerpt = post.excerpt.toLowerCase().includes(q)
      const matchKeywords = post.secondaryKeywords?.some(k => k.toLowerCase().includes(q))
      return matchTitle || matchTitleMr || matchExcerpt || matchKeywords
    }
    return true
  })

  const featuredPost = initialPosts.find(p => p.featured) || initialPosts[0]
  const remainingPosts = filteredPosts.filter(p => p.slug !== (activeCategory === 'All' && !searchQuery ? featuredPost?.slug : ''))

  return (
    <div className={styles.pageWrapper}>
      {/* ── 1. Hero Header ── */}
      <header className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>›</span>
            <span>Exam Blog & Study Guides</span>
          </div>

          <div className={styles.badgePill}>
            <span className={`material-symbols-outlined ${styles.badgeIcon}`}>menu_book</span>
            <span>ExamUdaan Academic Intelligence</span>
          </div>

          <h1 className={styles.heroTitle}>
            Exam Preparation Blueprints & Masterclasses
          </h1>
          <p className={styles.heroSubtitle}>
            Comprehensive, actionable study plans, 10-year PYQ analyses, and official syllabus breakdowns compiled by the ExamUdaan Editorial &amp; Research Desk.
          </p>

          {/* Daily Freshness Signal */}
          <div className={styles.freshnessBar}>
            <div className={styles.pulseDot} />
            <div className={styles.freshnessText}>
              Verified for 2026 Examination Cycles — Aligned with live PIB, MPSC & MahaPolice notifications.
            </div>
            <Link href="/daily-quiz" className={styles.freshnessLink}>
              <span>Attempt Today&apos;s 5-Min Quiz</span>
              <span className={`material-symbols-outlined ${styles.freshnessIcon}`}>arrow_forward</span>
            </Link>
          </div>

          {/* Filter & Search Toolbar */}
          <div className={styles.filterToolbar}>
            <div className={styles.categoryTabs}>
              {BLOG_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.tabBtn} ${activeCategory === cat ? styles.activeTabBtn : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className={styles.searchBox}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
              <input
                type="text"
                placeholder="Search strategies, PYQs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. Main Content ── */}
      <main className={styles.mainContainer}>
        {/* Flagship Featured Article Banner (Only on "All" without search) */}
        {activeCategory === 'All' && !searchQuery && featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredCard}>
            <div className={styles.featuredContent}>
              <div className={styles.featuredMeta}>
                <span className={styles.catBadge}>{featuredPost.category}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
                <span>•</span>
                <span>Updated 2026 Cycle</span>
              </div>
              <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
              <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
              <div className={styles.readMoreLink}>
                <span>Read Complete Masterplan</span>
                <span className={`material-symbols-outlined ${styles.readMoreIcon}`}>arrow_forward</span>
              </div>
            </div>
            <div className={styles.featuredBanner}>
              <span className={`material-symbols-outlined ${styles.featuredBannerIcon}`}>verified_user</span>
              <div className={styles.featuredBannerBadge}>{featuredPost.badge}</div>
            </div>
          </Link>
        )}

        {/* ── Article Grid ── */}
        <section>
          {filteredPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={`material-symbols-outlined ${styles.emptyIcon}`}>search_off</span>
              <h3 className={styles.emptyTitle}>No matching articles found</h3>
              <p className={styles.emptyDesc}>Try searching for &quot;MPSC&quot;, &quot;Police&quot;, &quot;TCS&quot;, or &quot;Syllabus&quot;.</p>
              <button
                type="button"
                onClick={() => { setActiveCategory('All'); setSearchQuery('') }}
                className={styles.emptyResetBtn}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.articleGrid}>
              {(activeCategory === 'All' && !searchQuery ? remainingPosts : filteredPosts).map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.articleCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardMeta}>
                      <span className={styles.catBadge}>{post.category}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                    <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  </div>

                  <div className={styles.cardBottom}>
                    <div className={styles.authorInfo}>
                      <span className={`material-symbols-outlined ${styles.authorIcon}`}>
                        {post.author?.avatar || 'edit_note'}
                      </span>
                      <span>{post.author?.name || 'ExamUdaan Blog'}</span>
                    </div>
                    <span className={styles.readMoreLink}>
                      Read Guide →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── WhatsApp Free Alert Banner ── */}
        <section className={styles.whatsappBanner}>
          <div>
            <h3 className={styles.whatsappTitle}>Never Miss an Exam Strategy or Job Alert</h3>
            <p className={styles.whatsappDesc}>
              Get instant MPSC, Police Bharti, and Talathi exam date alerts, revised answer keys, and daily high-yield questions directly on your WhatsApp.
            </p>
          </div>
          <a
            href="https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <span className="material-symbols-outlined">chat</span>
            <span>Get Free WhatsApp Alerts</span>
          </a>
        </section>
      </main>
    </div>
  )
}
