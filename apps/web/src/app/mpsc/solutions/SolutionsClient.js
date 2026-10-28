'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './solutions.module.css'

const POPULAR_PAPERS = [
  { label: 'सर्व पेपर्स (All)', exam: 'all', year: 'all' },
  { label: 'राज्यसेवा २०२४ GS', exam: 'State Services', year: '2024' },
  { label: 'गट ब संयुक्त २०२४', exam: 'Group B', year: '2024' },
  { label: 'राज्यसेवा २०२३ GS', exam: 'State Services', year: '2023' },
  { label: 'गट ब संयुक्त २०२३', exam: 'Group B', year: '2023' },
  { label: 'राज्यसेवा २०२२ GS', exam: 'State Services', year: '2022' },
  { label: 'गट क संयुक्त २०२४', exam: 'Group C', year: '2024' },
]

export default function SolutionsClient() {
  const [selectedPaper, setSelectedPaper] = useState(POPULAR_PAPERS[0])
  const [subject, setSubject] = useState('all')
  const [keyStatus, setKeyStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    papersCatalog: [],
    subjectsCatalog: [],
  })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch Solutions
  const fetchSolutions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        exam: selectedPaper.exam,
        year: selectedPaper.year,
        subject,
        key_status: keyStatus,
        q: debouncedSearch,
        page: currentPage.toString(),
        limit: '10',
      })
      const res = await fetch(`/api/mpsc/solutions?${params.toString()}`)
      const json = await res.json()
      if (json.success && json.data) {
        setData(json.data)
      }
    } catch (err) {
      console.error('Failed to load MPSC solutions:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedPaper, subject, keyStatus, debouncedSearch, currentPage])

  useEffect(() => {
    fetchSolutions()
  }, [fetchSolutions])

  const handlePaperSelect = (paper) => {
    setSelectedPaper(paper)
    setCurrentPage(1)
  }

  // Key Status Badge Helper
  const renderKeyStatusBadge = (status) => {
    const s = (status || 'final').toLowerCase()
    if (s === 'revised') {
      return (
        <span className={`${styles.keyStatusBadge} ${styles.keyStatusRevised}`}>
          <span>🔄</span>
          <span>सुधारित उत्तरतालिका (Revised Key)</span>
        </span>
      )
    }
    if (s === 'provisional') {
      return (
        <span className={`${styles.keyStatusBadge} ${styles.keyStatusProvisional}`}>
          <span>⚠️</span>
          <span>प्रथम उत्तरतालिका (Provisional Key)</span>
        </span>
      )
    }
    if (s === 'cancelled') {
      return (
        <span className={`${styles.keyStatusBadge} ${styles.keyStatusCancelled}`}>
          <span>🚫</span>
          <span>आयोगाने रद्द केलेला प्रश्न (Cancelled)</span>
        </span>
      )
    }
    return (
      <span className={`${styles.keyStatusBadge} ${styles.keyStatusFinal}`}>
        <span>✓</span>
        <span>अधिकृत अंतिम उत्तरतालिका (Final Key)</span>
      </span>
    )
  }

  // Numbered Pagination
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
            <span className={styles.breadcrumbCurrent}>मागील प्रश्नपत्रिका सविस्तर उत्तरे व स्पष्टीकरण</span>
          </nav>

          <div className={styles.heroBadge}>
            <span>📚</span>
            <span>MPSC Verified Answer Keys & Explanations</span>
          </div>

          <h1 className={styles.heroTitle}>Detailed Solutions for MPSC Previous Papers</h1>
          <p className={styles.heroSubtitle}>
            केवळ उत्तर न समजता "हेच उत्तर का योग्य आहे?", "इतर पर्याय का चुकीचे ठरतात?" आणि अधिकृत संदर्भ ग्रंथ काय सांगतात,
            याचे मराठी व इंग्रजी सविस्तर स्पष्टीकरण. अंतिम, सुधारित व प्रथम उत्तरतालिकेनुसार संपूर्ण विश्लेषण.
          </p>
        </div>
      </header>

      {/* Main Container */}
      <main className={styles.mainContainer}>
        {/* Control Card */}
        <section className={styles.controlCard} aria-label="Paper and Subject Filters">
          {/* High Demand Papers Ribbon */}
          <div className={styles.ribbonHeader}>
            <span className={styles.ribbonTitle}>
              <span>🔥</span>
              <span>अधिक मागणी असलेले प्रश्नपत्रिका संच (High-Demand Papers):</span>
            </span>
          </div>

          <div className={styles.paperButtonsRow} role="tablist">
            {POPULAR_PAPERS.map((p, idx) => {
              const isActive = selectedPaper.label === p.label
              return (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.paperBtn} ${isActive ? styles.paperBtnActive : ''}`}
                  onClick={() => handlePaperSelect(p)}
                >
                  <span>{p.label}</span>
                </button>
              )
            })}
          </div>

          {/* Secondary Filters */}
          <div className={styles.filterControlsGrid}>
            {/* Search */}
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="प्रश्नातील शब्द, घटक किंवा संकल्पना शोधा..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search questions"
              />
            </div>

            {/* Subject Select */}
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                setCurrentPage(1)
              }}
              className={styles.selectInput}
              aria-label="Filter by subject"
            >
              <option value="all">सर्व विषय (All Subjects)</option>
              {data.subjectsCatalog?.map((s) => (
                <option key={s.subject} value={s.subject}>
                  {s.subject} ({s.count})
                </option>
              ))}
            </select>

            {/* Key Status Select */}
            <select
              value={keyStatus}
              onChange={(e) => {
                setKeyStatus(e.target.value)
                setCurrentPage(1)
              }}
              className={styles.selectInput}
              aria-label="Filter by answer key status"
            >
              <option value="all">सर्व उत्तरतालिका स्थिती</option>
              <option value="final">अंतिम उत्तरतालिका (Final)</option>
              <option value="revised">सुधारित उत्तरतालिका (Revised)</option>
              <option value="provisional">प्रथम उत्तरतालिका (Provisional)</option>
              <option value="cancelled">रद्द प्रश्न (Cancelled)</option>
            </select>
          </div>
        </section>

        {/* Results Header */}
        <div className={styles.solutionsHeader}>
          <h2 className={styles.solutionsTitle}>
            <span>📝</span>
            <span>
              {selectedPaper.label === 'सर्व पेपर्स (All)'
                ? 'सर्व सोडवलेले प्रश्न व स्पष्टीकरण'
                : `${selectedPaper.label} — सोडवलेले प्रश्न`}
            </span>
          </h2>
          <span className={styles.solutionsMeta}>
            एकूण <strong>{data.total}</strong> सोडवलेले प्रश्न उपलब्ध (पृष्ठ {data.page} / {data.totalPages})
          </span>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className={styles.loadingSpinner}>
            <p>सविस्तर उत्तरे व विश्लेषण लोड होत आहे...</p>
          </div>
        )}

        {/* Solutions List */}
        {!loading && data.items.length > 0 && (
          <div className={styles.solutionsList}>
            {data.items.map((item, idx) => {
              const options = item.options || {}
              const correctKey = (item.correct || '').trim().toUpperCase()
              const whyIncorrect = item.why_others_incorrect

              return (
                <article key={item.id} className={styles.solutionCard}>
                  {/* Card Header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.examBadgeGroup}>
                      <span className={styles.examPill}>
                        {item.exam} ({item.year})
                      </span>
                      {item.subject && (
                        <span className={styles.subjectPill}>{item.subject}</span>
                      )}
                      {item.topic && (
                        <span className={styles.topicPill}>{item.topic}</span>
                      )}
                    </div>

                    {/* Official Key Status Badge */}
                    {renderKeyStatusBadge(item.key_status)}
                  </div>

                  {/* Question Content */}
                  <div className={styles.questionBody}>
                    <div className={styles.questionIndex}>
                      प्रश्न क्रमांक {(data.page - 1) * data.limit + idx + 1}
                    </div>
                    <p className={styles.questionText}>{item.question}</p>
                  </div>

                  {/* 4 Options Grid */}
                  <div className={styles.optionsList}>
                    {Object.entries(options).map(([optKey, optText]) => {
                      const isCorrect = optKey.toUpperCase() === correctKey
                      return (
                        <div
                          key={optKey}
                          className={`${styles.optionItem} ${isCorrect ? styles.optionItemCorrect : ''}`}
                        >
                          <span className={styles.optionKey}>{optKey}</span>
                          <span>{optText}</span>
                          {isCorrect && (
                            <span className={styles.correctCheckmark}>✓ अधिकृत उत्तर</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Detailed Marathi Explanation */}
                  {item.explanation && (
                    <div className={styles.solutionBox}>
                      <div className={styles.solutionBoxHeader}>
                        <span>💡</span>
                        <span>सविस्तर स्पष्टीकरण (Detailed Explanation):</span>
                      </div>
                      <p className={styles.solutionTextMr}>{item.explanation}</p>
                      {item.explanation_en && (
                        <p className={styles.solutionTextEn}>{item.explanation_en}</p>
                      )}
                    </div>
                  )}

                  {/* Why Other Options Are Incorrect */}
                  {whyIncorrect && typeof whyIncorrect === 'object' && Object.keys(whyIncorrect).length > 0 && (
                    <div className={styles.whyIncorrectBox}>
                      <div className={styles.whyIncorrectTitle}>
                        <span>❌</span>
                        <span>इतर पर्याय का अयोग्य ठरतात? (Why Other Options Are Incorrect):</span>
                      </div>
                      <div className={styles.incorrectOptionsList}>
                        {Object.entries(whyIncorrect).map(([wKey, wReason]) => (
                          <div key={wKey} className={styles.incorrectOptionRow}>
                            <span className={styles.incorrectOptionKey}>पर्याय ({wKey}):</span>
                            <span>{wReason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Source Reference */}
                  {item.source_reference && (
                    <div className={styles.sourceBox}>
                      <span className={styles.sourceLabel}>📖 अधिकृत संदर्भ ग्रंथ:</span>
                      <span>{item.source_reference}</span>
                    </div>
                  )}

                  {/* Footer Cross-Links */}
                  <div className={styles.solutionFooter}>
                    <div className={styles.footerLinksGroup}>
                      <Link
                        href={`/mpsc-pyq?subject=${encodeURIComponent(item.subject || '')}&topic=${encodeURIComponent(item.topic || '')}`}
                        className={styles.btnPracticeTopic}
                      >
                        <span>🎯 या घटकावर सराव करा (PYQ)</span>
                      </Link>

                      <Link
                        href={`/mpsc/syllabus-tracker?subject=${encodeURIComponent(item.subject || '')}`}
                        className={styles.btnSyllabusTrack}
                      >
                        <span>📖 अभ्यासक्रमात महत्त्व तपासा</span>
                      </Link>
                    </div>

                    <Link
                      href={`/mpsc-pyq?exam=${encodeURIComponent(item.exam || '')}&year=${item.year}`}
                      className={styles.viewAllExamLink}
                    >
                      या प्रश्नपत्रिकेतील सर्व {item.year} प्रश्न पहा →
                    </Link>
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
