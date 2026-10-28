'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import styles from './mains.module.css'

export default function MainsPracticeClient() {
  const [paper, setPaper] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
    paperCounts: {},
    papersMetadata: [],
  })

  // Active Practice Question State
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [answerText, setAnswerText] = useState('')
  const [practiceMode, setPracticeMode] = useState('type') // 'type' | 'upload'
  const [uploadedFile, setUploadedFile] = useState(null)
  const [showModelOutline, setShowModelOutline] = useState(false)
  const [showRubric, setShowRubric] = useState(false)

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(420) // default 7 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch Questions
  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        paper,
        q: debouncedSearch,
        page: currentPage.toString(),
        limit: '6',
      })
      const res = await fetch(`/api/mpsc/mains-questions?${params.toString()}`)
      const json = await res.json()
      if (json.success && json.data) {
        setData(json.data)
      }
    } catch (err) {
      console.error('Failed to load mains questions:', err)
    } finally {
      setLoading(false)
    }
  }, [paper, debouncedSearch, currentPage])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  // Timer Logic
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev - 1)
      }, 1000)
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false)
    }
    return () => clearInterval(timerRef.current)
  }, [isTimerRunning, timerSeconds])

  const handleStartPractice = (q) => {
    setActiveQuestion(q)
    setTimerSeconds((q.timeMinutes || 7) * 60)
    setIsTimerRunning(false)
    setShowModelOutline(false)
    setShowRubric(false)
    setPracticeMode('type')
    setUploadedFile(null)

    // Load existing draft from localStorage
    const saved = localStorage.getItem(`mpsc_mains_draft_${q.id}`)
    setAnswerText(saved || '')

    // Scroll smoothly to studio
    window.scrollTo({ top: 380, behavior: 'smooth' })
  }

  const handleAnswerChange = (text) => {
    setAnswerText(text)
    if (activeQuestion) {
      localStorage.setItem(`mpsc_mains_draft_${activeQuestion.id}`, text)
    }
  }

  const handleTimerToggle = () => {
    setIsTimerRunning((prev) => !prev)
  }

  const handleTimerReset = () => {
    setIsTimerRunning(false)
    if (activeQuestion) {
      setTimerSeconds((activeQuestion.timeMinutes || 7) * 60)
    }
  }

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Count words
  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0

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
      {/* Hero Header */}
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">होम</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href="/mpsc">MPSC हब</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>मुख्य परीक्षा उत्तर लेखन सराव (Mains Practice)</span>
          </nav>

          <div className={styles.heroBadge}>
            <span>✍️</span>
            <span>UPSC Pattern Descriptive Answer Writing Studio</span>
          </div>

          <h1 className={styles.heroTitle}>MPSC Mains Answer-Writing Practice</h1>
          <p className={styles.heroSubtitle}>
            वर्णनात्मक मुख्य परीक्षेच्या तयारीसाठी मागील वर्षांचे व संभाव्य प्रश्न, वेळेचे नियोजन (Timed Writing),
            प्रस्तावना-गाभा-निष्कर्ष रचना, मॉडेल आऊटलाईन आणि ५-आयामी स्वयं-मूल्यमापन रुब्रिक.
          </p>

          {/* Statutory Educational Guidance Disclaimer Banner */}
          <div className={styles.disclaimerBanner} role="alert">
            <span className={styles.disclaimerIcon}>⚠️</span>
            <div>
              <p className={styles.disclaimerTitle}>
                शैक्षणिक मार्गदर्शन वैधानिक सूचना (Statutory Guidance Disclaimer):
              </p>
              <p className={styles.disclaimerText}>
                सदर पोर्टलवरील मॉडेल आऊटलाईन, स्वयंचलित शब्दमोजणी आणि मूल्यमापन रुब्रिक केवळ विद्यार्थ्यांच्या स्वयं-सरावासाठी व शैक्षणिक मार्गदर्शनासाठी (Educational Guidance) तयार करण्यात आले आहे. हे महाराष्ट्र लोकसेवा आयोगाचे (MPSC) अधिकृत मूल्यमापन नसून अंतिम गुणांची किंवा निवडीची कोणतीही कायदेशीर हमी देत नाही.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContainer}>
        {/* Active Writing Studio (Rendered when a question is chosen) */}
        {activeQuestion && (
          <section className={styles.activeStudioBox} aria-label="Active Answer Writing Studio">
            <div className={styles.studioTopBar}>
              <div className={styles.studioTitleGroup}>
                <span className={styles.liveStudioBadge}>
                  <span>●</span>
                  <span>सराव स्टुडिओ (Active Session)</span>
                </span>
                <span className={styles.studioMetaInfo}>
                  {activeQuestion.paperName} • {activeQuestion.marks} Marks • {activeQuestion.wordLimit} Words
                </span>
              </div>

              <button
                className={styles.btnStudioClose}
                onClick={() => setActiveQuestion(null)}
              >
                ✕ स्टुडिओ बंद करा
              </button>
            </div>

            <div className={styles.studioGrid}>
              {/* Left Column: Question & Model Outline */}
              <div className={styles.studioLeftCol}>
                <div className={styles.studioQuestionCard}>
                  <span className={styles.studioDirectiveChip}>
                    निर्देश: {activeQuestion.directive}
                  </span>
                  <h3 className={styles.studioQuestionText}>
                    {activeQuestion.question_mr}
                  </h3>
                  <p className={styles.studioQuestionSub}>
                    {activeQuestion.question_en}
                  </p>
                  <div className={styles.studioDirectiveNotice}>
                    💡 {activeQuestion.directiveGuidance}
                  </div>
                </div>

                {/* Model Outline Accordion */}
                <div className={styles.modelOutlineCard}>
                  <div
                    className={styles.modelOutlineHeading}
                    onClick={() => setShowModelOutline((prev) => !prev)}
                  >
                    <span>💡 मॉडेल आऊटलाईन व उत्तराची रचना पहा</span>
                    <span>{showModelOutline ? '▲ झाका' : '▼ उघडा'}</span>
                  </div>

                  {showModelOutline && (
                    <div className={styles.modelOutlineBody}>
                      <div className={styles.outlineSection}>
                        <div className={styles.outlineSectionLabel}>१. प्रस्तावना (Introduction - १५ ते २० शब्द):</div>
                        <p className={styles.outlineSectionText}>{activeQuestion.modelOutline.intro}</p>
                      </div>

                      <div className={styles.outlineSection}>
                        <div className={styles.outlineSectionLabel}>२. मुख्य गाभा (Body Points - १०० ते ११० शब्द):</div>
                        <ul className={styles.outlineBullets}>
                          {activeQuestion.modelOutline.bodyPoints.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>

                      {activeQuestion.modelOutline.mhContext && (
                        <div className={styles.outlineSection}>
                          <div className={styles.outlineSectionLabel}>३. महाराष्ट्राचा संदर्भ (Maharashtra Angle):</div>
                          <p className={styles.outlineSectionText}>{activeQuestion.modelOutline.mhContext}</p>
                        </div>
                      )}

                      <div className={styles.outlineSection}>
                        <div className={styles.outlineSectionLabel}>४. निष्कर्ष व पुढील वाटचाल (Way Forward / Conclusion):</div>
                        <p className={styles.outlineSectionText}>{activeQuestion.modelOutline.conclusion}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Timer, Editor, Rubric */}
              <div className={styles.studioRightCol}>
                {/* Timer & Word Count Bar */}
                <div className={styles.studioControlBar}>
                  <div className={styles.timerWrap}>
                    <span>⏱️</span>
                    <span className={styles.timerDisplay}>
                      {formatTimer(timerSeconds)}
                    </span>
                    <button
                      className={styles.btnTimerToggle}
                      onClick={handleTimerToggle}
                    >
                      {isTimerRunning ? '⏸️ थांबा' : '▶️ वेळ सुरू'}
                    </button>
                    <button
                      className={styles.btnTimerReset}
                      onClick={handleTimerReset}
                    >
                      रीसेट
                    </button>
                  </div>

                  <div className={styles.wordMeter}>
                    <span>शब्दसंख्या:</span>
                    <span
                      className={`${styles.wordCountNum} ${
                        wordCount > activeQuestion.wordLimit ? styles.wordCountWarn : ''
                      }`}
                    >
                      {wordCount} / {activeQuestion.wordLimit}
                    </span>
                  </div>
                </div>

                {/* Mode Tabs: Typing vs Upload */}
                <div className={styles.modeTabs}>
                  <button
                    className={`${styles.modeTabBtn} ${
                      practiceMode === 'type' ? styles.modeTabBtnActive : ''
                    }`}
                    onClick={() => setPracticeMode('type')}
                  >
                    ⌨️ थेट टाईप करा
                  </button>
                  <button
                    className={`${styles.modeTabBtn} ${
                      practiceMode === 'upload' ? styles.modeTabBtnActive : ''
                    }`}
                    onClick={() => setPracticeMode('upload')}
                  >
                    📄 हस्तलिखित उत्तर प्रत अपलोड करा
                  </button>
                </div>

                {/* Textarea Editor */}
                {practiceMode === 'type' && (
                  <textarea
                    value={answerText}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="येथे आपले उत्तर मुद्देसूद लिहा... (प्रस्तावना, मुख्य मुद्दे, महाराष्ट्राचा संदर्भ आणि निष्कर्ष). तुमचा मसुदा आपोआप सुरक्षित जतन होतो."
                    className={styles.editorTextarea}
                    aria-label="Write your mains answer"
                  />
                )}

                {/* Upload Zone */}
                {practiceMode === 'upload' && (
                  <label className={styles.uploadZone}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className={styles.hiddenFileInput}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setUploadedFile(e.target.files[0].name)
                        }
                      }}
                    />
                    <div className={styles.uploadIcon}>📸</div>
                    <p className={styles.uploadHeading}>
                      {uploadedFile ? `अपलोड झाले: ${uploadedFile}` : 'पेन-पेपरवर लिहिलेल्या उत्तराचा फोटो किंवा PDF निवडा'}
                    </p>
                    <p className={styles.uploadSub}>
                      मोबाईल कॅमेऱ्याने फोटो काढा किंवा स्कॅन केलेली PDF फाईल अपलोड करा (Max 10MB).
                    </p>
                  </label>
                )}

                {/* Rubric Accordion */}
                <div className={styles.rubricAccordion}>
                  <div
                    className={styles.rubricAccordionHeader}
                    onClick={() => setShowRubric((prev) => !prev)}
                  >
                    <span>📊 स्वयं-मूल्यमापन रुब्रिक (Evaluation Rubric)</span>
                    <span>{showRubric ? '▲' : '▼'}</span>
                  </div>

                  {showRubric && (
                    <div className={styles.rubricList}>
                      {activeQuestion.rubricCriteria.map((r, rIdx) => (
                        <div key={rIdx} className={styles.rubricItem}>
                          <div>
                            <div className={styles.rubricDimension}>{r.dimension}</div>
                            <div className={styles.rubricGuide}>{r.guide}</div>
                          </div>
                          <span className={styles.rubricMaxMarks}>{r.maxMarks} गुण</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Paper Selector & Search Control Card */}
        <section className={styles.controlCard} aria-label="Paper Filters">
          <div className={styles.paperTabsWrapper} role="tablist">
            {data.papersMetadata?.map((p) => {
              const isActive = paper === p.key
              const count = data.paperCounts[p.key] || 0
              return (
                <button
                  key={p.key}
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.paperTab} ${isActive ? styles.paperTabActive : ''}`}
                  onClick={() => {
                    setPaper(p.key)
                    setCurrentPage(1)
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                  {count > 0 && <span className={styles.paperCountBadge}>{count}</span>}
                </button>
              )
            })}
          </div>

          <div className={styles.filterRow}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="विषय, प्रश्न किंवा निर्देशाचे नाव शोधा (उदा. सत्यशोधक, राज्यपाल, जलसंकट, गाडगीळ)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search mains questions"
              />
            </div>
          </div>
        </section>

        {/* Questions Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span>
            <span>
              {paper === 'all'
                ? 'सर्व उपलब्ध मुख्य परीक्षा प्रश्न'
                : data.papersMetadata?.find((p) => p.key === paper)?.label}
            </span>
          </h2>
          <span className={styles.sectionMeta}>
            एकूण <strong>{data.total}</strong> वर्णनात्मक प्रश्न उपलब्ध (पृष्ठ {data.page} / {data.totalPages})
          </span>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className={styles.loadingBox}>
            <p>मुख्य परीक्षा प्रश्न बँक लोड होत आहे...</p>
          </div>
        )}

        {/* Questions Grid */}
        {!loading && data.items.length > 0 && (
          <div className={styles.questionsGrid}>
            {data.items.map((item) => (
              <article key={item.id} className={styles.questionCard}>
                <div>
                  <div className={styles.cardTopRow}>
                    <div className={styles.cardPills}>
                      <span className={styles.paperPill}>{item.paperName}</span>
                      <span className={styles.marksPill}>{item.marks} Marks • {item.wordLimit} Words</span>
                      <span className={styles.directiveBadge}>{item.directive}</span>
                    </div>

                    <div className={styles.timeTag}>
                      <span>⏱️</span>
                      <span>{item.timeMinutes} मिनिटे</span>
                    </div>
                  </div>

                  <h3 className={styles.cardQuestionText}>{item.question_mr}</h3>
                  <div className={styles.cardTopicMeta}>
                    <strong>विषय:</strong> {item.subject} • <strong>घटक:</strong> {item.topic}
                  </div>
                </div>

                <div className={styles.cardActionRow}>
                  <button
                    className={styles.btnStartPractice}
                    onClick={() => handleStartPractice(item)}
                  >
                    <span>✍️ सराव सुरू करा (Timed Practice)</span>
                  </button>

                  <button
                    className={styles.btnViewModel}
                    onClick={() => {
                      handleStartPractice(item)
                      setShowModelOutline(true)
                    }}
                  >
                    <span>💡 मॉडेल उत्तर रचना पहा</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Numbered Pagination */}
        {!loading && renderPaginationButtons()}
      </main>
    </div>
  )
}
