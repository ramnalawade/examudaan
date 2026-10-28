'use client'

// ============================================================
// app/mahatet-previous-year-papers/MahatetPyqClient.js
// Interactive MAHA TET Question Papers & Official Keys Browser
// 100% Sourced from MSCE Pune (mahatet.in) | Zero Inline Styles
// Features: Official Study Workspace with In-Browser PDF Reader,
// Paired Exam Cards, Subject PYQ Practice & Numbered Pagination
// ============================================================

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import OfficialPdfViewer from '@/components/OfficialPdfViewer'
import PaperQuestionSolver from '@/components/PaperQuestionSolver'
import styles from './mahatetPyq.module.css'

const MAHATET_SUBJECT_CARDS = [
  {
    subject: 'Child Pedagogy',
    title: 'बालमानसशास्त्र व अध्यापनशास्त्र',
    count: '३० गुण (अनिवार्य)',
    icon: '🧠',
    slug: 'pedagogy',
    topics: 'बालविकास अवस्था, अध्ययनाची उपपत्ती, समावेशक शिक्षण, अध्ययनार्थीची वैशिष्ट्ये व मूल्यमापन पद्धती.',
    badge: 'Paper 1 & 2'
  },
  {
    subject: 'Marathi Language',
    title: 'भाषा १: मराठी भाषा व व्याकरण',
    count: '३० गुण',
    icon: '📖',
    slug: 'marathi',
    topics: 'वर्णविचार, नाम, सर्वनाम, समास, प्रयोग, वाक्प्रचार, म्हणी, शब्दसंग्रह व उतार्‍यावरील प्रश्न.',
    badge: 'Compulsory'
  },
  {
    subject: 'English Language',
    title: 'भाषा २: English Language & Grammar',
    count: '30 Marks',
    icon: '🔤',
    slug: 'english',
    topics: 'Parts of Speech, Tenses, Voice, Direct-Indirect, Synonyms, Antonyms, Idioms & Reading Comprehension.',
    badge: 'Compulsory'
  },
  {
    subject: 'Mathematics',
    title: 'गणित व अंकगणित (Maths)',
    count: '३० / ६० गुण',
    icon: '📐',
    slug: 'reasoning',
    topics: 'संख्याज्ञान, लसावि-मसावि, अपूर्णांक, शेकडेवारी, नफा-तोटा, सरळव्याज, भूमिती व सांख्यिकी.',
    badge: 'Core Subject'
  },
  {
    subject: 'Environmental Studies',
    title: 'परिसर अभ्यास (EVS - Paper 1)',
    count: '३० गुण (प्राथमिक)',
    icon: '🌿',
    slug: 'science',
    topics: 'सजीव सृष्टी, नैसर्गिक साधनसंपत्ती, कुटुंब व संस्था, पर्यावरण प्रदूषण, आरोग्य व भारतीय नागरिकशास्त्र.',
    badge: 'Paper 1 Primary'
  },
  {
    subject: 'Social Science',
    title: 'सामाजिक शास्त्रे (Social Science)',
    count: '६० गुण (उच्च प्राथमिक)',
    icon: '🏛️',
    slug: 'history',
    topics: 'प्राचीन व मध्ययुगीन भारत, छत्रपती शिवाजी महाराज, स्वातंत्र्य लढा, महाराष्ट्र व भारताचा भूगोल, राज्यघटना.',
    badge: 'Paper 2 Social'
  }
]

export default function MahatetPyqClient({
  catalog = [],
  initialDocId = null,
  initialPdf = null,
  questionCountsMap = {}
}) {
  const [selectedStage, setSelectedStage] = useState('all') // 'all' | 'paper-1' | 'paper-2-math-sci' | 'paper-2-social'
  const [selectedMedium, setSelectedMedium] = useState('all') // 'all' | 'Marathi' | 'English' | 'Hindi' | 'Urdu'
  const [selectedYear, setSelectedYear] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Active study workspace selection state
  const [activeExamId, setActiveExamId] = useState(initialDocId || catalog[0]?.id || null)
  const [activeDocType, setActiveDocType] = useState('qp') // 'qp' | 'ak' | 'solve'
  const [activeQuestions, setActiveQuestions] = useState([])
  const [solverLoading, setSolverLoading] = useState(false)

  const workspaceRef = useRef(null)
  const listTopRef = useRef(null)
  const ITEMS_PER_PAGE = 12

  // Helper: check question count available for a paper
  const getQuestionCount = useCallback((item) => {
    if (!item || !item.questionPaper) return 0
    const fn = (item.questionPaper.fileName || '').toLowerCase().trim()
    if (!fn) return 0
    return questionCountsMap[fn] || questionCountsMap[fn.replace('.pdf', '')] || 0
  }, [questionCountsMap])

  // Scroll to workspace on initial load if requested via URL
  useEffect(() => {
    if (initialDocId || initialPdf) {
      if (workspaceRef.current) {
        workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [initialDocId, initialPdf])

  // Distinct available years
  const availableYears = useMemo(() => {
    const yrs = Array.from(new Set(catalog.map(c => c.year).filter(Boolean)))
    return yrs.sort((a, b) => b - a)
  }, [catalog])

  // Distinct available mediums
  const availableMediums = useMemo(() => {
    const meds = Array.from(new Set(catalog.map(c => c.medium).filter(Boolean)))
    const priority = ['Marathi', 'English', 'Hindi', 'Urdu']
    return meds.sort((a, b) => {
      const idxA = priority.indexOf(a)
      const idxB = priority.indexOf(b)
      if (idxA !== -1 && idxB !== -1) return idxA - idxB
      if (idxA !== -1) return -1
      if (idxB !== -1) return 1
      return a.localeCompare(b)
    })
  }, [catalog])

  // Filtered catalog
  const filteredSets = useMemo(() => {
    return catalog.filter(item => {
      // Stage filter
      if (selectedStage !== 'all') {
        if (selectedStage === 'paper-1' && item.stageGroup !== 'paper-1') return false
        if (selectedStage === 'paper-2-math-sci' && item.paperId !== 'p2_math') return false
        if (selectedStage === 'paper-2-social' && item.paperId !== 'p2_soc') return false
      }

      // Medium filter
      if (selectedMedium !== 'all' && item.medium !== selectedMedium) {
        return false
      }

      // Year filter
      if (selectedYear !== 'all' && String(item.year) !== String(selectedYear)) {
        return false
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const textToSearch = `${item.title} ${item.titleMr} ${item.paperName} ${item.medium} ${item.year}`.toLowerCase()
        if (!textToSearch.includes(q)) return false
      }

      return true
    })
  }, [catalog, selectedStage, selectedMedium, selectedYear, searchQuery])

  // Active exam set for the embedded workspace
  const activeExamSet = useMemo(() => {
    if (!catalog || catalog.length === 0) return null
    if (activeExamId) {
      const found = catalog.find(item => item.id === activeExamId)
      if (found) return found
    }
    return catalog[0]
  }, [catalog, activeExamId])

  // Count of questions for active exam set
  const currentExamQCount = useMemo(() => {
    return getQuestionCount(activeExamSet)
  }, [activeExamSet, getQuestionCount])

  // Prepare papers list for OfficialPdfViewer
  const activeViewerPapers = useMemo(() => {
    if (!activeExamSet) return []
    const list = []
    const qp = activeExamSet.questionPaper
    const ak = activeExamSet.answerKey

    if (qp?.downloadUrl) {
      list.push({
        id: 1,
        year: activeExamSet.year,
        label: `${activeExamSet.title} (Question Paper)`,
        title: activeExamSet.title,
        size: qp.sizeFormatted || 'Official PDF',
        url: qp.downloadUrl,
        isAnswerKey: false,
        pairId: ak?.downloadUrl ? 2 : null,
        badge: 'QP'
      })
    }

    if (ak?.downloadUrl) {
      list.push({
        id: 2,
        year: activeExamSet.year,
        label: `${activeExamSet.title} (Official Answer Key)`,
        title: `${activeExamSet.title} (Answer Key)`,
        size: ak.sizeFormatted || 'Official PDF',
        url: ak.downloadUrl,
        isAnswerKey: true,
        pairId: qp?.downloadUrl ? 1 : null,
        badge: 'KEY'
      })
    }

    return list
  }, [activeExamSet])

  // Pagination
  const totalItems = filteredSets.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const validPage = Math.min(Math.max(currentPage, 1), totalPages)
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE
  const pagedSets = filteredSets.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  function handleFilterChange(setter, val) {
    setter(val)
    setCurrentPage(1)
  }

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      if (listTopRef.current) {
        listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 340, behavior: 'smooth' })
      }
    }
  }

  // Fetch interactive questions when 'solve' mode is active
  useEffect(() => {
    if (activeDocType !== 'solve' || !activeExamSet?.questionPaper?.fileName) {
      return
    }
    const fileName = activeExamSet.questionPaper.fileName
    const count = getQuestionCount(activeExamSet)
    if (count === 0) {
      setActiveQuestions([])
      return
    }

    let isMounted = true
    setSolverLoading(true)

    fetch(`/api/pyq?paper=${encodeURIComponent(fileName)}&limit=500`)
      .then(res => res.json())
      .then(json => {
        if (!isMounted) return
        const list = json?.data?.questions || json?.questions || []
        const formatted = list.map((q, idx) => ({
          id: q.id || idx + 1,
          question_number: idx + 1,
          question: q.question,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || {}),
          correct: q.correct,
          explanation: q.explanation || q.explanation_mr,
          topic: q.topic || activeExamSet.title,
          difficulty: q.difficulty || 'Medium'
        }))
        setActiveQuestions(formatted)
      })
      .catch(err => {
        console.error('[MahatetPyqClient] Error fetching questions:', err)
      })
      .finally(() => {
        if (isMounted) setSolverLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [activeDocType, activeExamSet, getQuestionCount])

  function handleOpenInWorkspace(item, docType = 'qp') {
    setActiveExamId(item.id)
    setActiveDocType(docType)
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div>
      {/* ── Live Study Workspace (Integrated In-Browser PDF Reader) ── */}
      <section ref={workspaceRef} className={styles.workspaceSection} aria-label="Official Study Workspace">
        <div className={styles.workspaceHeader}>
          <div className={styles.workspaceMeta}>
            <span className={styles.workspaceTag}>⚡ Live Official Study Workspace</span>
            <h2 className={styles.workspaceTitle}>
              {activeExamSet?.title || 'MAHA TET Official Paper & Answer Key'}
            </h2>
            <div className={styles.workspaceSubtitle}>
              {activeExamSet?.titleMr} • {activeExamSet?.year} ({activeExamSet?.medium} Medium)
            </div>
          </div>

          <div className={styles.workspaceActions}>
            {/* Document Switcher Toggle */}
            <div className={styles.workspaceToggleRow}>
              <button
                type="button"
                className={`${styles.toggleBtn} ${activeDocType === 'qp' ? styles.toggleBtnActive : ''}`}
                onClick={() => setActiveDocType('qp')}
                disabled={!activeExamSet?.questionPaper?.downloadUrl}
              >
                📄 प्रश्नपत्रिका (Question Paper)
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${activeDocType === 'ak' ? styles.toggleBtnActive : ''}`}
                onClick={() => setActiveDocType('ak')}
                disabled={!activeExamSet?.answerKey?.downloadUrl}
              >
                🔑 अंतिम उत्तरतालिका (Final Key)
                {!activeExamSet?.answerKey?.downloadUrl && ' (Pending)'}
              </button>
              {currentExamQCount > 0 && (
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${styles.toggleBtnHighlight} ${activeDocType === 'solve' ? styles.toggleBtnActive : ''}`}
                  onClick={() => setActiveDocType('solve')}
                >
                  📝 सोडवा (Solve MCQs) ({currentExamQCount})
                </button>
              )}
            </div>

            <Link
              href={`/feedback?topic=mahatet_paper_issue&ref=${encodeURIComponent(activeExamSet?.id || '')}`}
              className={styles.reportPaperBtn}
              title="Report wrong answer key or request missing question paper"
            >
              💬 Report / Request Paper
            </Link>
          </div>
        </div>

        {/* Workspace Display: Official PDF Viewer or Interactive MCQ Solver */}
        {activeDocType === 'solve' ? (
          <div className={styles.solverWorkspaceWrapper}>
            {solverLoading ? (
              <div className={styles.solverLoading}>
                <span>⏳</span> लोड होत आहे... Loading {currentExamQCount} Questions for {activeExamSet?.title}...
              </div>
            ) : activeQuestions.length > 0 ? (
              <PaperQuestionSolver
                questions={activeQuestions}
                paperSlug={activeExamSet?.id || 'mahatet'}
                paperTitle={activeExamSet?.title || 'MAHA TET Paper'}
                pdfUrl={activeExamSet?.questionPaper?.downloadUrl || null}
              />
            ) : (
              <div className={styles.solverLoading}>
                प्रश्न लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा किंवा PDF पहा.
              </div>
            )}
          </div>
        ) : (
          <OfficialPdfViewer
            papers={activeViewerPapers}
            conductingBody="Maharashtra State Council of Examination (MSCE Pune)"
            officialWebsite="https://www.mahatet.in"
            examName={activeExamSet?.title || 'MAHA TET Official Examination'}
            initialSelectedId={activeDocType === 'ak' ? 2 : 1}
            onSelectDoc={(docId) => {
              if (docId === 2) {
                setActiveDocType('ak')
              } else {
                setActiveDocType('qp')
              }
            }}
            showSelectorChips={false}
            showDirectorySection={false}
          />
        )}
      </section>

      {/* ── High-CTR Instant Practice Conversion Strip ── */}
      <div className={styles.practiceStrip}>
        <div className={styles.practiceStripLeft}>
          <span>⚡</span>
          <strong className={styles.practiceTitle}>
            प्रश्नपत्रिका वाचल्यानंतर लगेच ऑनलाइन सराव करा (Instant Mock Practice):
          </strong>
        </div>
        <div className={styles.practiceChips}>
          <Link href="/syllabus/maha-tet" className={styles.practiceChip}>
            📋 Official Syllabus & GR PDF →
          </Link>
          <Link href="/mock-tests" className={styles.practiceChip}>
            🎯 TET Full Mock Tests →
          </Link>
          <Link href="/pyq" className={styles.practiceChip}>
            📚 15-Yr Interactive PYQ Bank →
          </Link>
          <Link href="/study-planner" className={styles.practiceChip}>
            🗓️ AI Study Timetable →
          </Link>
        </div>
      </div>

      {/* ── Subject-Wise PYQ Preparation Cards ── */}
      <section className={styles.subjectSection} aria-label="Subject Wise Practice">
        <div className={styles.subjectSectionHeader}>
          <h2 className={styles.subjectSectionTitle}>
            विषयनिहाय ऑनलाइन सराव व प्रश्नसंच (Subject-Wise Practice Hub)
          </h2>
          <p className={styles.subjectSectionSubtitle}>
            MAHA TET पेपर १ व पेपर २ साठी आवश्यक सर्व विषयांचे घटकनिहाय प्रश्न व स्पष्टीकरणे सोडवा.
          </p>
        </div>

        <div className={styles.subjectGrid}>
          {MAHATET_SUBJECT_CARDS.map((card, idx) => (
            <Link
              key={idx}
              href={`/pyq?subject=${card.slug}`}
              className={styles.subjectCard}
            >
              <div>
                <div className={styles.subjectCardHeader}>
                  <span className={styles.subjectIcon}>{card.icon}</span>
                  <span className={styles.subjectBadge}>{card.badge}</span>
                </div>
                <h3 className={styles.subjectTitle}>{card.subject}</h3>
                <div className={styles.subjectTitleMr}>{card.title}</div>
                <p className={styles.subjectTopics}>{card.topics}</p>
              </div>
              <div className={styles.subjectCta}>
                <span>सराव सुरू करा ({card.count})</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Interactive Filter & Search Bar (Screenshot 1 Standard) ── */}
      <div className={styles.filterBar} ref={listTopRef}>
        <div className={styles.filterRowTop}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search MAHA TET papers, years, mediums, subjects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              aria-label="Search question papers"
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearFiltersBtn}
                onClick={() => {
                  setSearchQuery('')
                  setCurrentPage(1)
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div className={styles.yearSelectWrap}>
            <span className={styles.filterLabel}>Jump to Year:</span>
            <select
              aria-label="Filter by Exam Year"
              className={styles.yearSelect}
              value={selectedYear}
              onChange={(e) => handleFilterChange(setSelectedYear, e.target.value)}
            >
              <option value="all">All Years (2013–2026)</option>
              {availableYears.map(yr => {
                const count = catalog.filter(c => c.year === yr).length
                return (
                  <option key={yr} value={yr}>
                    {yr} ({count} papers)
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        <div className={styles.filterControlsRow}>
          <div className={styles.stageButtonGroup}>
            <span className={styles.filterLabel}>Filter by Stage:</span>
            <button
              type="button"
              className={`${styles.stageBtn} ${selectedStage === 'all' ? styles.stageBtnActive : ''}`}
              onClick={() => handleFilterChange(setSelectedStage, 'all')}
            >
              All Stages ({catalog.length})
            </button>
            <button
              type="button"
              className={`${styles.stageBtn} ${selectedStage === 'paper-1' ? styles.stageBtnActive : ''}`}
              onClick={() => handleFilterChange(setSelectedStage, 'paper-1')}
            >
              Paper 1 (Primary) ({catalog.filter(c => c.stageGroup === 'paper-1').length})
            </button>
            <button
              type="button"
              className={`${styles.stageBtn} ${selectedStage === 'paper-2-math-sci' ? styles.stageBtnActive : ''}`}
              onClick={() => handleFilterChange(setSelectedStage, 'paper-2-math-sci')}
            >
              Paper 2 (Math-Sci) ({catalog.filter(c => c.paperId === 'p2_math').length})
            </button>
            <button
              type="button"
              className={`${styles.stageBtn} ${selectedStage === 'paper-2-social' ? styles.stageBtnActive : ''}`}
              onClick={() => handleFilterChange(setSelectedStage, 'paper-2-social')}
            >
              Paper 2 (Social) ({catalog.filter(c => c.paperId === 'p2_soc').length})
            </button>
          </div>

          <div className={styles.yearSelectWrap}>
            <span className={styles.filterLabel}>Medium:</span>
            <select
              aria-label="Filter by Medium"
              className={styles.yearSelect}
              value={selectedMedium}
              onChange={(e) => handleFilterChange(setSelectedMedium, e.target.value)}
            >
              <option value="all">All Mediums</option>
              {availableMediums.map(med => {
                const count = catalog.filter(c => c.medium === med).length
                return (
                  <option key={med} value={med}>
                    {med} ({count})
                  </option>
                )
              })}
            </select>
          </div>

          {(selectedStage !== 'all' || selectedMedium !== 'all' || selectedYear !== 'all' || searchQuery) && (
            <button
              type="button"
              className={styles.clearFiltersBtn}
              onClick={() => {
                setSelectedStage('all')
                setSelectedMedium('all')
                setSelectedYear('all')
                setSearchQuery('')
                setCurrentPage(1)
              }}
            >
              Reset All Filters ↺
            </button>
          )}
        </div>
      </div>

      {/* ── Results Summary Bar (Screenshot 1 Standard) ── */}
      <div className={styles.resultsSummaryBar}>
        <div>
          Showing <span className={styles.resultsCount}>{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}</span> of{' '}
          <span className={styles.resultsCount}>{totalItems}</span> exam papers
          {totalPages > 1 ? ` (Page ${validPage} of ${totalPages})` : ''}
        </div>
        <div className={styles.sourceHint}>
          <span>🏛️ Official Source: mahatet.in (MSCE Pune)</span>
        </div>
      </div>

      {/* ── How to Study Tip Banner (Matches MPSC PYQ standard) ── */}
      <div className={styles.tipBanner}>
        <span>💡</span>
        <span>
          <strong>कसे वाचावे (How to Study):</strong> खालील कोणत्याही परीक्षेसाठी &quot;View Paper&quot; वर क्लिक करा — तो पेपर वरील अभ्यासिकेत त्वरित उघडेल, किंवा &quot;Solve PYQs Online&quot; वरून थेट प्रश्न सोडवा.
        </span>
      </div>

      {/* ── Paper Cards List (Screenshot 1 Standard) ── */}
      {pagedSets.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyEmoji}>🔎</div>
          <h3 className={styles.emptyTitle}>कोणतीही प्रश्नपत्रिका सापडली नाही (No papers found)</h3>
          <p className={styles.emptyDesc}>
            No question papers match your current filter selections. Try clearing your search or selecting a different year/medium.
          </p>
          <button
            type="button"
            className={styles.btnWorkspaceOrange}
            onClick={() => {
              setSelectedStage('all')
              setSelectedMedium('all')
              setSelectedYear('all')
              setSearchQuery('')
              setCurrentPage(1)
            }}
          >
            Show All {catalog.length} Papers
          </button>
        </div>
      ) : (
        <div className={styles.paperList}>
          {pagedSets.map((item) => {
            const qp = item.questionPaper
            const ak = item.answerKey
            const isSelected = activeExamId === item.id
            const isViewingPaper = isSelected && activeDocType === 'qp'
            const isViewingKey = isSelected && activeDocType === 'ak'
            const isSolving = isSelected && activeDocType === 'solve'
            const qCount = getQuestionCount(item)
            const hasKey = Boolean(ak?.downloadUrl)

            return (
              <article
                key={item.id}
                className={`${styles.paperCard} ${isSelected ? styles.paperCardActive : ''}`}
              >
                <div className={styles.badgeRow}>
                  <span className={styles.badgeStage}>
                    {item.stageLabel || item.paperName}
                  </span>
                  <span className={styles.badgeYear}>Exam Year: {item.year}</span>
                  <span className={styles.badgeMedium}>
                    {item.mediumMr || `${item.medium} Medium`}
                  </span>
                  {hasKey && (
                    <span className={styles.badgeKey}>Official Final Answer Key</span>
                  )}
                  {qCount > 0 ? (
                    <span className={styles.badgePyqLive}>
                      ✨ {qCount} Solved PYQs in Database
                    </span>
                  ) : (
                    <span className={styles.badgeYear}>
                      Official Scanned PDF
                    </span>
                  )}
                </div>

                <h2 className={styles.paperTitle}>
                  <button
                    type="button"
                    onClick={() => handleOpenInWorkspace(item, 'qp')}
                    className={styles.paperTitleBtn}
                    title="Click to view question paper in study workspace"
                  >
                    {item.title} Question Paper & Official Answer Key
                  </button>
                </h2>

                {item.titleMr && (
                  <div className={styles.paperTitleMr}>
                    {item.titleMr} अधिकृत प्रश्नपत्रिका व अंतिम उत्तरतालिका
                  </div>
                )}

                <div className={styles.paperMeta}>
                  <span>Max Marks: <strong>150</strong></span>
                  <span>•</span>
                  <span>Duration: <strong>150 mins</strong></span>
                  <span>•</span>
                  <span>Pattern: <strong>Objective Multiple Choice (MCQ)</strong></span>
                  <span>•</span>
                  <span>Medium: <strong>{item.medium} ({item.mediumMr || 'माध्यम'})</strong></span>
                </div>

                <div className={styles.actionsGrid}>
                  {/* 1. Primary Action: View paper directly in Study Workspace */}
                  <button
                    type="button"
                    onClick={() => handleOpenInWorkspace(item, 'qp')}
                    className={isViewingPaper ? styles.btnWorkspaceOrangeActive : styles.btnWorkspaceOrange}
                    title="View official question paper in study workspace"
                  >
                    {isViewingPaper ? '📄 Currently Viewing Paper' : '📄 View Paper'}
                  </button>

                  {/* 2. Answer Key: ONLY if available, name: View Answer Key, else HIDE */}
                  {hasKey && (
                    <button
                      type="button"
                      onClick={() => handleOpenInWorkspace(item, 'ak')}
                      className={isViewingKey ? styles.btnAnswerKeyGreenActive : styles.btnAnswerKeyGreen}
                      title="View official final answer key in study workspace"
                    >
                      {isViewingKey ? '🔑 Currently Viewing Key' : '🔑 View Answer Key'}
                    </button>
                  )}

                  {/* 3. Practice Action: If questions exist in DB -> Solve PYQs Online, else -> CBT Mock */}
                  {qCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleOpenInWorkspace(item, 'solve')}
                      className={isSolving ? styles.btnSolvePyqActive : styles.btnSolvePyq}
                      title={`Solve all ${qCount} questions online with instant scores`}
                    >
                      {isSolving ? '📝 Currently Solving PYQs' : `📝 Solve PYQs (${qCount} Qs) Online`}
                    </button>
                  ) : (
                    <Link
                      href="/mock-tests?exam=mahatet"
                      className={styles.btnOutlineCbt}
                      title="Practice 150-Q CBT Mock Test for MAHA TET"
                    >
                      ⏱️ Timed CBT Mock
                    </Link>
                  )}

                  {/* 4. Syllabus / Solutions */}
                  <Link
                    href="/syllabus/maha-tet"
                    className={styles.btnOutline}
                    title="View official MAHA TET syllabus & pedagogy blueprint"
                  >
                    Solutions & Explanations
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* ── Numbered Pagination Navigation (Screenshot 1 Standard) ── */}
      {totalPages > 1 && (
        <nav aria-label="Pagination Navigation" className={styles.paginationNav}>
          {validPage > 1 ? (
            <button
              type="button"
              onClick={() => handlePageChange(validPage - 1)}
              className={styles.pageBtn}
            >
              ← Prev
            </button>
          ) : (
            <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>← Prev</span>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => {
            // Show first page, last page, and 2 pages around current page
            if (
              pNum === 1 ||
              pNum === totalPages ||
              (pNum >= validPage - 2 && pNum <= validPage + 2)
            ) {
              const isActive = pNum === validPage
              return (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => handlePageChange(pNum)}
                  className={`${styles.pageBtn} ${isActive ? styles.pageBtnActive : ''}`}
                >
                  {pNum}
                </button>
              )
            }
            if (pNum === validPage - 3 || pNum === validPage + 3) {
              return <span key={pNum} className={styles.ellipsis}>...</span>
            }
            return null
          })}

          {validPage < totalPages ? (
            <button
              type="button"
              onClick={() => handlePageChange(validPage + 1)}
              className={styles.pageBtn}
            >
              Next →
            </button>
          ) : (
            <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>Next →</span>
          )}
        </nav>
      )}

      {/* ── Pedagogy & TAIT Prep Callouts ── */}
      <section className={styles.prepCalloutGrid}>
        <div className={styles.calloutCard}>
          <div>
            <span className={styles.calloutTag}>Exam Preparation Blueprint</span>
            <h3 className={styles.calloutTitle}>Child Development & Pedagogy (बालमानसशास्त्र)</h3>
            <p className={styles.calloutDesc}>
              Child development theory, teaching methods, Piaget & Vygotsky theories, inclusive education & RTE 2009 questions analyzed across all 7 MAHA TET exam cycles.
            </p>
          </div>
          <Link href="/pyq?subject=pedagogy" className={styles.calloutBtn}>
            <span>📚</span> Practice Pedagogy PYQs →
          </Link>
        </div>

        <div className={styles.calloutCard}>
          <div>
            <span className={`${styles.calloutTag} ${styles.calloutTagBlue}`}>Next Step: Pavitra Portal</span>
            <h3 className={styles.calloutTitle}>Maharashtra TAIT Teacher Recruitment</h3>
            <p className={styles.calloutDesc}>
              Cleared MAHA TET? Prepare for the Teacher Aptitude and Intelligence Test (TAIT) 200-mark examination with district-wise school selection rules.
            </p>
          </div>
          <Link href="/mock-tests" className={`${styles.calloutBtn} ${styles.calloutBtnSecondary}`}>
            <span>🎯</span> Start TAIT Mock Tests →
          </Link>
        </div>
      </section>
    </div>
  )
}
