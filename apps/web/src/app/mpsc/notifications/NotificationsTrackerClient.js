'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './notifications.module.css'

const STAGES = [
  { key: 'all', label: 'सर्व अपडेट्स (All)', icon: '⚡' },
  { key: 'recruitment', label: 'जाहिराती (Advts)', icon: '📢' },
  { key: 'schedule', label: 'वेळापत्रक (Schedules)', icon: '📅' },
  { key: 'admit_card', label: 'प्रवेशपत्रे (Hall Tickets)', icon: '🎫' },
  { key: 'answer_key', label: 'उत्तरतालिका (Answer Keys)', icon: '📝' },
  { key: 'result', label: 'निकाल (Results)', icon: '🏆' },
  { key: 'syllabus', label: 'अभ्यासक्रम (Syllabus)', icon: '📚' },
]

const CADRES = [
  { key: 'all', label: 'सर्व संवर्ग (All Cadres)' },
  { key: 'rajyaseva', label: 'राज्यसेवा (Rajyaseva)' },
  { key: 'group_b', label: 'गट ब संयुक्त (Group B)' },
  { key: 'group_c', label: 'गट क संयुक्त (Group C)' },
  { key: 'technical', label: 'तांत्रिक / वनसेवा (Technical)' },
]

export default function NotificationsTrackerClient() {
  const [stage, setStage] = useState('all')
  const [cadre, setCadre] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    stageCounts: {},
  })

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch from API
  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        stage,
        cadre,
        q: debouncedSearch,
        page: currentPage.toString(),
        limit: '12',
      })
      const res = await fetch(`/api/mpsc/notifications?${params.toString()}`)
      const json = await res.json()
      if (json.success && json.data) {
        setData(json.data)
      }
    } catch (err) {
      console.error('Failed to load MPSC notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [stage, cadre, debouncedSearch, currentPage])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleStageChange = (newStage) => {
    setStage(newStage)
    setCurrentPage(1)
    const el = document.getElementById('notifications-list')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleCadreChange = (newCadre) => {
    setCadre(newCadre)
    setCurrentPage(1)
    const el = document.getElementById('notifications-list')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'दिनांक उपलब्ध नाही'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('mr-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr.slice(0, 10)
    }
  }

  // Generate numbered pagination buttons
  const renderPaginationButtons = () => {
    const { totalPages, page } = data
    if (totalPages <= 1) return null

    const buttons = []
    const maxVisible = 5
    let startPage = Math.max(1, page - 2)
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    // Previous Button
    buttons.push(
      <button
        key="prev"
        className={styles.pageBtn}
        onClick={() => setCurrentPage(page - 1)}
        disabled={page === 1}
        aria-label="Previous Page"
      >
        ←
      </button>
    )

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          className={`${styles.pageBtn} ${page === 1 ? styles.pageBtnActive : ''}`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
      )
      if (startPage > 2) {
        buttons.push(<span key="dots-1" className={styles.pageEllipsis}>...</span>)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`${styles.pageBtn} ${page === i ? styles.pageBtnActive : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="dots-2" className={styles.pageEllipsis}>...</span>)
      }
      buttons.push(
        <button
          key={totalPages}
          className={`${styles.pageBtn} ${page === totalPages ? styles.pageBtnActive : ''}`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      )
    }

    // Next Button
    buttons.push(
      <button
        key="next"
        className={styles.pageBtn}
        onClick={() => setCurrentPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Next Page"
      >
        →
      </button>
    )

    return <div className={styles.paginationWrapper}>{buttons}</div>
  }

  // Stage count badge lookup
  const getStageCount = (key) => {
    const counts = data.stageCounts || {}
    if (key === 'all') return counts.all_count || data.total
    if (key === 'recruitment') return counts.recruitment_count || 0
    if (key === 'schedule') return counts.schedule_count || 0
    if (key === 'admit_card') return counts.admit_card_count || 0
    if (key === 'answer_key') return counts.answer_key_count || 0
    if (key === 'result') return counts.result_count || 0
    if (key === 'syllabus') return counts.syllabus_count || 0
    return 0
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">होम</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href="/mpsc">MPSC हब</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>अधिकृत प्रसिद्धीपत्रक ट्रॅकर</span>
          </nav>

          <div className={styles.heroBadge}>
            <span className={styles.liveDot} />
            MPSC Official Live Feed | थेट आयोगाचे अपडेट्स
          </div>

          <h1 className={styles.heroTitle}>MPSC Official Notification Tracker</h1>
          <p className={styles.heroSubtitle}>
            महाराष्ट्र लोकसेवा आयोगाच्या (MPSC) सर्व नवीन जाहिराती, परीक्षांचे अंदाजित व निश्चित वेळापत्रक,
            हॉल तिकीट, प्रथम व अंतिम उत्तरतालिका, आक्षेप नोंदणी आणि अंतिम गुणवत्ता याद्यांचा थेट कालक्रमानुसार (Chronological) ट्रॅकर.
          </p>

          {/* WhatsApp & Telegram Alert Subscriber Banner */}
          <div className={styles.subscribeHeroBar}>
            <div className={styles.subscribeHeroInfo}>
              <div className={styles.subscribeIconWrap}>🔔</div>
              <div>
                <p className={styles.subscribeHeading}>MPSC च्या प्रत्येक अपडेटचा तत्काळ मोफत अलर्ट हवा आहे?</p>
                <p className={styles.subscribeSub}>हॉल तिकीट, नवीन जाहिरात किंवा निकाल जाहीर होताच थेट तुमच्या मोबाईलवर मेसेज मिळवा.</p>
              </div>
            </div>
            <div className={styles.subscribeHeroButtons}>
              <a
                href="https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v"
                target="_blank" rel="noopener noreferrer"
                rel="noopener noreferrer"
                className={styles.btnWhatsApp}
              >
                <span>💬 WhatsApp चॅनेल फॉलो करा</span>
              </a>
              <a
                href="https://t.me/examudaanjobs"
                target="_blank" rel="noopener noreferrer"
                rel="noopener noreferrer"
                className={styles.btnTelegram}
              >
                <span>✈️ Telegram अलर्ट जॉइन करा</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className={styles.mainContainer}>
        {/* Control Card: Stages & Filters */}
        <section className={styles.controlCard} aria-label="Filters and Stage Navigation">
          {/* Stage Tabs */}
          <div className={styles.stageTabsWrapper} role="tablist">
            {STAGES.map((s) => {
              const count = getStageCount(s.key)
              const isActive = stage === s.key
              return (
                <button
                  key={s.key}
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.stageTab} ${isActive ? styles.stageTabActive : ''}`}
                  onClick={() => handleStageChange(s.key)}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                  {count > 0 && <span className={styles.tabCount}>{count}</span>}
                </button>
              )
            })}
          </div>

          {/* Filter Row */}
          <div className={styles.filterRow}>
            {/* Live Search */}
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="जाहिरात क्र., परीक्षेचे नाव किंवा पदाचे नाव शोधा..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search notifications"
              />
            </div>

            {/* Cadre Filter Pills */}
            <div className={styles.cadrePills} role="group" aria-label="Filter by cadre">
              {CADRES.map((c) => {
                const isActive = cadre === c.key
                return (
                  <button
                    key={c.key}
                    className={`${styles.cadrePill} ${isActive ? styles.cadrePillActive : ''}`}
                    onClick={() => handleCadreChange(c.key)}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Feed Timeline Header */}
        <div className={styles.feedHeader} id="notifications-list">
          <h2 className={styles.feedTitle}>
            <span>📋</span>
            <span>
              {stage === 'all'
                ? 'सर्व चालू घडामोडी व प्रसिद्धीपत्रके'
                : STAGES.find((s) => s.key === stage)?.label}
            </span>
          </h2>
          <span className={styles.feedMeta}>
            एकूण <strong>{data.total}</strong> अपडेट्स उपलब्ध (पृष्ठ {data.page} / {data.totalPages})
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinnerRing} />
            <p>MPSC अधिकृत डेटा लोड होत आहे...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && data.items.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>कोणतीही प्रसिद्धीपत्रके आढळली नाहीत</h3>
            <p className={styles.emptyText}>
              तुम्ही निवडलेल्या फिल्टर किंवा शोध संज्ञेशी सुसंगत अपडेट्स सध्या उपलब्ध नाहीत. कृपया दुसरे फिल्टर निवडून पुन्हा तपासा.
            </p>
            <button
              className={styles.btnClearFilter}
              onClick={() => {
                setStage('all')
                setCadre('all')
                setSearchQuery('')
              }}
            >
              सर्व फिल्टर्स रीसेट करा
            </button>
          </div>
        )}

        {/* Timeline Feed List */}
        {!loading && data.items.length > 0 && (
          <div className={styles.timelineFeed}>
            {data.items.map((item) => {
              const pubDate = formatDate(item.published_at)

              // Determine stage badge style
              let badgeStyle = styles.badgeCircular
              if (item.stageKey === 'schedule') badgeStyle = styles.badgeSchedule
              else if (item.stageKey === 'answer_key') badgeStyle = styles.badgeAnswerKey
              else if (item.stageKey === 'result') badgeStyle = styles.badgeResult
              else if (item.stageKey === 'admit_card') badgeStyle = styles.badgeAdmit
              else if (item.stageKey === 'recruitment') badgeStyle = styles.badgeRecruitment
              else if (item.stageKey === 'syllabus') badgeStyle = styles.badgeSyllabus

              return (
                <article key={item.id} className={styles.noticeCard}>
                  {/* Top Bar: Advt No, Type Badge, Published Date */}
                  <div className={styles.noticeTopBar}>
                    <div className={styles.badgeRow}>
                      {item.advt_no && (
                        <span className={styles.advtChip}>
                          जाहिरात क्र. {item.advt_no}
                        </span>
                      )}
                      <span className={`${styles.stageBadge} ${badgeStyle}`}>
                        {item.stageLabel}
                      </span>
                    </div>

                    <div className={styles.dateDisplay}>
                      <span>📅</span>
                      <time dateTime={item.published_at}>{pubDate}</time>
                    </div>
                  </div>

                  {/* Title & Marathi translation */}
                  <h3 className={styles.noticeTitle}>
                    {item.title}
                  </h3>
                  {item.title_mr && item.title_mr !== item.title && (
                    <p className={styles.noticeTitleMr}>
                      {item.title_mr}
                    </p>
                  )}

                  {/* Card Actions */}
                  <div className={styles.cardActions}>
                    <div className={styles.actionLinksGroup}>
                      {item.pdf_url && (
                        <a
                          href={item.pdf_url}
                          target="_blank" rel="noopener noreferrer"
                          rel="noopener noreferrer"
                          className={styles.btnDownloadPdf}
                        >
                          <span>📥</span>
                          <span>अधिकृत PDF डाऊनलोड</span>
                        </a>
                      )}

                      {item.internalHref && (
                        <Link href={item.internalHref} className={styles.btnViewDetails}>
                          <span>तपशील पहा →</span>
                        </Link>
                      )}
                    </div>

                    {/* Cross-linking to PYQ or Solutions if answer key or schedule */}
                    {(item.stageKey === 'answer_key' || item.stageKey === 'result') && (
                      <Link href="/mpsc/solutions" className={styles.relatedPracticePill}>
                        <span>💡 सविस्तर उत्तरे व स्पष्टीकरण पहा</span>
                      </Link>
                    )}

                    {item.stageKey === 'schedule' && (
                      <Link href="/mpsc/syllabus-tracker" className={styles.relatedPracticePill}>
                        <span>📖 अभ्यासक्रम व तयारी ट्रॅकर</span>
                      </Link>
                    )}

                    {item.stageKey === 'recruitment' && (
                      <Link href="/mpsc-pyq" className={styles.relatedPracticePill}>
                        <span>🎯 मागील वर्षांचे प्रश्न (PYQ) सराव</span>
                      </Link>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Numbered Pagination */}
        {!loading && renderPaginationButtons()}
      </main>
    </div>
  )
}
