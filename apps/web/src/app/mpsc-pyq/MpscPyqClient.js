// ============================================================
// app/mpsc-pyq/MpscPyqClient.js — Interactive Study Hub
// Question Papers & Answer Keys (2009–2026) with Cards Design & PYQ Solvers
// 100% Sourced from mpsc.gov.in (Maharashtra Public Service Commission)
// ZERO INLINE STYLES POLICY: All styles strictly in mpscPyqClient.module.css
// ============================================================

'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import OfficialPdfViewer from '@/components/OfficialPdfViewer'
import { toSecureDocUrl } from '@/lib/docObfuscate'
import { trackCtaClick } from '@/lib/analytics'
import MpscFeedbackModal, { MpscFeedbackFloatingButton } from '@/components/MpscFeedbackModal'
import manifest from '@/lib/mpscPyqArchiveManifest.json'
import questionsCounts from '@/lib/mpscPaperQuestionsCounts.json'
import {
  MPSC_ARCHIVE_YEARS_SPAN,
  MPSC_TOTAL_QUESTION_PAPERS,
  MPSC_TOTAL_ANSWER_KEYS,
  MPSC_TOTAL_ARCHIVE_FOLDERS,
  MPSC_CADRE_COUNTS
} from '@/lib/platformStats'
import styles from './mpscPyqClient.module.css'

const SUBJECT_PYQ_CARDS = [
  {
    subject: 'Polity',
    title: 'राज्यव्यवस्था व राज्यघटना',
    count: '787+ MCQs',
    icon: '🏛️',
    slug: 'polity',
    topics: 'मूलभूत हक्क, संसद, 73वी घटनादुरुस्ती, राज्यपाल, उच्च न्यायालय',
    color: '#0284C7',
    bg: '#F0F9FF',
    border: '#BAE6FD'
  },
  {
    subject: 'Geography',
    title: 'महाराष्ट्र व भारताचा भूगोल',
    count: '817+ MCQs',
    icon: '🗺️',
    slug: 'geography',
    topics: 'सह्याद्री पर्वत, गोदावरी-कृष्णा नद्या, कोयना धरण, वने व जिल्हे',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0'
  },
  {
    subject: 'History',
    title: 'इतिहास व समाजसुधारक',
    count: '712+ MCQs',
    icon: '📜',
    slug: 'history',
    topics: 'सत्यशोधक समाज, महाड सत्याग्रह, १८५७ उठाव, संयुक्त महाराष्ट्र',
    color: '#B45309',
    bg: '#FFFBEB',
    border: '#FDE68A'
  },
  {
    subject: 'Economy',
    title: 'भारतीय अर्थव्यवस्था',
    count: '987+ MCQs',
    icon: '📈',
    slug: 'economy',
    topics: 'पंचवार्षिक योजना, RBI रेपो दर, महागाई, अर्थसंकल्प, कृषी अर्थशास्त्र',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE'
  },
  {
    subject: 'Science',
    title: 'सामान्य विज्ञान',
    count: '2,337+ MCQs',
    icon: '🔬',
    slug: 'science',
    topics: 'जीवशास्त्र, भौतिकशास्त्र, रसायनशास्त्र, मानवी शरीर, रोगशास्त्र',
    color: '#0D9488',
    bg: '#F0FDFA',
    border: '#99F6E4'
  },
  {
    subject: 'Marathi',
    title: 'मराठी व्याकरण व भाषा',
    count: '101+ MCQs',
    icon: '📖',
    slug: 'marathi',
    topics: 'समास, प्रयोग, समानार्थी शब्द, विरुद्धार्थी शब्द, म्हणी व वाक्प्रचार',
    color: '#EA580C',
    bg: '#FFF7ED',
    border: '#FED7AA'
  },
  {
    subject: 'Reasoning',
    title: 'बुद्धिमत्ता चाचणी व CSAT',
    count: '764+ MCQs',
    icon: '🧩',
    slug: 'reasoning',
    topics: 'बैठक व्यवस्था, कोडिंग-डिकोडिंग, अंकमालिका, नातेसंबंध, वेळ व कार्य',
    color: '#4F46E5',
    bg: '#EEF2FF',
    border: '#C7D2FE'
  },
  {
    subject: 'Law',
    title: 'विधी, कायदे व अधिकार',
    count: '63+ MCQs',
    icon: '⚖️',
    slug: 'law',
    topics: 'माहितीचा अधिकार २००५, महाराष्ट्र लोकसेवा हक्क, पोलीस कायदे',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA'
  }
]

const MOCK_TEST_CARDS = [
  {
    title: 'MPSC Combined (Group B & C) Prelims Full Mock 2026',
    slug: 'mpsc-combined-full-prelims',
    badge: '100-Q Full CBT Mock',
    badgeBg: '#ECFDF5',
    badgeColor: '#047857',
    icon: '💯',
    qCount: '100 MCQs',
    duration: '60 Mins',
    marks: '100 Marks',
    desc: 'संपूर्ण संयुक्त पूर्वपरीक्षा पॅटर्न — इतिहास, भूगोल, राज्यशास्त्र, विज्ञान, चालू घडामोडी व बुद्धिमत्ता चाचणी. राज्यस्तरीय रँक व कटऑफ विश्लेषण.'
  },
  {
    title: 'MPSC Maharashtra Geography Sectional Speed Drill',
    slug: 'mpsc-gs-maharashtra-geography',
    badge: 'Sectional Speed Drill',
    badgeBg: '#EFF6FF',
    badgeColor: '#1D4ED8',
    icon: '🗺️',
    qCount: '20 MCQs',
    duration: '20 Mins',
    marks: '40 Marks',
    desc: 'महाराष्ट्राच्या नद्या, धरणे, जिल्हे, हवामान, वने व प्राकृतिक भूगोलावरील आयोगाच्या पॅटर्नवर आधारित उच्च-उत्पादक प्रश्न.'
  },
  {
    title: 'MPSC Indian Polity & Constitution Speed Drill',
    slug: 'mpsc-polity-constitution',
    badge: 'Sectional Speed Drill',
    badgeBg: '#F5F3FF',
    badgeColor: '#6D28D9',
    icon: '🏛️',
    qCount: '20 MCQs',
    duration: '20 Mins',
    marks: '40 Marks',
    desc: 'कलमे, घटनादुरुस्ती, संसद, राष्ट्रपती, राज्यपाल व पंचायती राज विषयावरील आयोगाचे वारंवार विचारले जाणारे प्रश्न.'
  },
  {
    title: 'MPSC Current Affairs & Maharashtra Events 2026',
    slug: 'mpsc-current-affairs-2026',
    badge: 'Current Affairs 2026',
    badgeBg: '#FFF7ED',
    badgeColor: '#C2410C',
    icon: '📰',
    qCount: '20 MCQs',
    duration: '20 Mins',
    marks: '40 Marks',
    desc: 'महाराष्ट्र शासन योजना, क्रीडा, पुरस्कार, राष्ट्रीय घडामोडी व महत्त्वाच्या नियुक्त्या २०२६ वरील अद्ययावत सराव प्रश्न.'
  }
]

const PREP_TOOL_CARDS = [
  {
    title: 'अधिकृत अभ्यासक्रम (Official Syllabus 2026)',
    href: '/syllabus/mpsc-state-services',
    icon: '📋',
    badge: 'Syllabus 2026',
    desc: 'राज्यसेवा व संयुक्त गट ब/क पूर्व आणि मुख्य परीक्षेचा विषयवार घटकनिहाय अभ्यासक्रम व गुणविभागणी.'
  },
  {
    title: '१०-वर्षीय कट-ऑफ विश्लेषण (10-Yr Cutoffs)',
    href: '/cutoffs',
    icon: '📊',
    badge: 'Cutoff Archive',
    desc: 'Open, OBC, EWS, SC, ST प्रवर्गांचे मागील १० वर्षांचे अधिकृत कट-ऑफ व २०२६ चा सेफ स्कोअर अंदाज.'
  },
  {
    title: 'MPSC डेली स्टडी प्लॅनर (Study Planner)',
    href: '/study-planner',
    icon: '📅',
    badge: 'Revision Planner',
    desc: '३०, ६० आणि ९० दिवसांचे रिव्हिजन वेळापत्रक — तुमचा दैनंदिन अभ्यास व टार्गेट ट्रॅक करा.'
  },
  {
    title: 'रिस्पॉन्स शीट स्कोअर कॅल्क्युलेटर',
    href: '/score-calculator',
    icon: '🧮',
    badge: 'Score Calc',
    desc: 'MPSC उत्तरतालिकेनुसार तुमचे बरोबर व चुकीचे प्रश्न टाकून १/४ नेगेटिव्ह मार्किंगनंतरचा अचूक स्कोअर काढा.'
  }
]

export default function MpscPyqClient({
  pairedExams = [],
  allPapers = [],
  initialDocId = null,
  initialPdf = null,
  initialDocType = 'qp',
}) {
  // All 1,491 archive items
  const allArchivePapers = useMemo(() => manifest.items || [], [])

  const [selectedCategory, setSelectedCategory] = useState('all') // 'all' | 'rajyaseva' | 'group-b' | 'group-c' | 'other-services'
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedStage, setSelectedStage] = useState('all') // 'all' | 'prelims' | 'mains'
  const [selectedKeyFilter, setSelectedKeyFilter] = useState('all') // 'all' | 'with-key' | 'qp-only'
  const [searchQuery, setSearchQuery] = useState('')
  const [feedbackNotice, setFeedbackNotice] = useState(null)
  const [feedbackKey, setFeedbackKey] = useState(0)
  const [activeStatPill, setActiveStatPill] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  const workspaceRef = useRef(null)
  const cardsSectionRef = useRef(null)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [feedbackCategory, setFeedbackCategory] = useState('missing_papers')

  // Available distinct years for archive
  const availableYears = useMemo(() => {
    const yrs = Array.from(new Set(allArchivePapers.map(p => p.examYear).filter(Boolean)))
    return yrs.sort((a, b) => b - a)
  }, [allArchivePapers])

  // Active exam and doc type for Workspace
  const [activePaper, setActivePaper] = useState(() => {
    if (initialDocId) {
      const match = allArchivePapers.find(p => p.id === initialDocId || p.slug === String(initialDocId))
      if (match) return match
    }
    // Default to latest 2026 Group B combined prelims or first paper
    const default2026 = allArchivePapers.find(p => p.examYear === 2026 && p.questionPaper?.downloadUrl)
    return default2026 || allArchivePapers[0] || null
  })

  const [activeDocType, setActiveDocType] = useState(initialDocType || 'qp') // 'qp' | 'ak'

    // Scroll to workspace on initial load if URL requested a specific document
  useEffect(() => {
    if (initialDocId || initialPdf) {
      if (workspaceRef.current) {
        workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [initialDocId, initialPdf])

  // Intelligent client-side prefetching to warm up server disk and Cloudflare CDN edge cache
  const prefetchedUrls = useRef(new Set())
  const handlePrefetch = (urlOrId) => {
    if (!urlOrId) return
    const secureUrl = toSecureDocUrl(urlOrId)
    if (!secureUrl || prefetchedUrls.current.has(secureUrl)) return
    prefetchedUrls.current.add(secureUrl)
    if (typeof window !== 'undefined' && 'fetch' in window) {
      // Fire-and-forget background prefetch to prime both server disk and CDN edge
      fetch(secureUrl, { priority: 'low' }).catch(() => {})
    }
  }

  // Pre-cache active paper on load
  useEffect(() => {
    if (activePaper) {
      handlePrefetch(activePaper.id || activePaper.questionPaper?.downloadUrl)
      if (activePaper.answerKey?.downloadUrl) {
        handlePrefetch(activePaper.answerKey.downloadUrl)
      }
    }
  }, [activePaper])

  // Prepare documents array for OfficialPdfViewer
  const activeViewerPapers = useMemo(() => {
    if (!activePaper) return []
    const papersList = []

    if (activePaper.questionPaper?.downloadUrl) {
      papersList.push({
        id: activePaper.id || 1,
        year: activePaper.examYear,
        label: `${activePaper.paperName || activePaper.title} (Question Paper)`,
        title: `${activePaper.title}`,
        size: 'Official PDF',
        url: toSecureDocUrl(activePaper.id || activePaper.questionPaper.downloadUrl),
        isAnswerKey: false,
        pairId: activePaper.answerKey?.downloadUrl ? 2 : null,
        badge: 'QP'
      })
    }

    if (activePaper.answerKey?.downloadUrl) {
      papersList.push({
        id: 2,
        year: activePaper.examYear,
        label: `${activePaper.paperName || activePaper.title} (Official Answer Key)`,
        title: `${activePaper.title} (Answer Key)`,
        size: 'Official PDF',
        url: toSecureDocUrl(activePaper.answerKey.downloadUrl),
        isAnswerKey: true,
        pairId: 1,
        badge: 'KEY'
      })
    }

    return papersList
  }, [activePaper])

  // Active selected ID in viewer
  const activeSelectedId = useMemo(() => {
    if (activeDocType === 'ak' && activePaper?.answerKey?.downloadUrl) {
      return 2
    }
    return activePaper?.id || 1
  }, [activeDocType, activePaper])

  // Filtered archive papers for cards list
  const filteredPapers = useMemo(() => {
    return allArchivePapers.filter(paper => {
      // Cadre filter
      if (selectedCategory !== 'all' && paper.cadreKey !== selectedCategory) {
        return false
      }
      // Year filter
      if (selectedYear !== 'all' && String(paper.examYear) !== String(selectedYear)) {
        return false
      }
      // Stage filter
      if (selectedStage !== 'all' && paper.stage !== selectedStage) {
        return false
      }
      // Key filter
      if (selectedKeyFilter === 'with-key' && (!paper.answerKey?.downloadUrl || paper.keyStatus?.toLowerCase().includes('awaiting'))) {
        return false
      }
      if (selectedKeyFilter === 'qp-only' && paper.answerKey?.downloadUrl) {
        return false
      }
      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = (paper.title || '').toLowerCase().includes(q)
        const matchTitleMr = (paper.titleMr || '').toLowerCase().includes(q)
        const matchAdvt = String(paper.advertisementNumber || '').toLowerCase().includes(q)
        const matchYear = String(paper.examYear || '').includes(q)
        const matchCadre = (paper.cadreNameEn || '').toLowerCase().includes(q)
        if (!matchTitle && !matchTitleMr && !matchAdvt && !matchYear && !matchCadre) {
          return false
        }
      }
      return true
    })
  }, [allArchivePapers, selectedCategory, selectedYear, selectedStage, selectedKeyFilter, searchQuery])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedYear, selectedStage, selectedKeyFilter, searchQuery])

  // Pagination calculation
  const totalItems = filteredPapers.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const validPage = Math.min(Math.max(currentPage, 1), totalPages)
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE
  const pagedPapers = filteredPapers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Warm up visible page's first 3 papers in the background
  useEffect(() => {
    if (pagedPapers && pagedPapers.length > 0) {
      pagedPapers.slice(0, 3).forEach(p => {
        if (p.id) handlePrefetch(p.id)
      })
    }
  }, [pagedPapers])

  function handlePageChange(pNum) {
    setCurrentPage(pNum)
    if (cardsSectionRef.current) {
      cardsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle loading paper into workspace
  function handleLoadInWorkspace(paper, docType = 'qp') {
    setActivePaper(paper)
    setActiveDocType(docType)
    trackCtaClick(`Load in Workspace: ${paper.title} (${paper.examYear}) - ${docType.toUpperCase()}`, `/mpsc/${paper.slug}`, 'mpsc_pyq_card')
    const docLabel = docType === 'ak' ? '🔑 Official Answer Key' : '📄 Question Paper'
    setFeedbackNotice(`Loaded ${docLabel} into Study Workspace: ${paper.title}`)
    setFeedbackKey(k => k + 1)
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle stat pill clicks
  function handleSelectStatPill(pillType) {
    setActiveStatPill(pillType)
    if (pillType === 'all') {
      setSelectedKeyFilter('all')
      setSelectedCategory('all')
      setSelectedYear('all')
      setFeedbackNotice(`📊 Viewing All ${MPSC_TOTAL_ARCHIVE_FOLDERS.toLocaleString('en-IN')} Exam Papers (2009–2026)`)
    } else if (pillType === 'qp') {
      setSelectedKeyFilter('all')
      setFeedbackNotice(`📄 Viewing ${MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('en-IN')} Question Papers`)
    } else if (pillType === 'ak') {
      setSelectedKeyFilter('with-key')
      setFeedbackNotice(`✓ Filter Applied: ${MPSC_TOTAL_ANSWER_KEYS.toLocaleString('en-IN')} Official Answer Keys`)
    } else if (pillType === 'paired') {
      setSelectedKeyFilter('with-key')
      setFeedbackNotice(`⚡ Filter Applied: Verified Paired Sets with Final Keys`)
    }
    setFeedbackKey(k => k + 1)
  }

  return (
    <div className={styles.pageWrapper}>
      {/* ── Top Breadcrumbs ── */}
      <div className={styles.breadcrumbWrap}>
        <div className={styles.breadcrumbContainer}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/question-papers" className={styles.breadcrumbLink}>Question Papers</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>MPSC Question Papers & Answer Keys ({MPSC_ARCHIVE_YEARS_SPAN})</span>
        </div>
      </div>

      <div className={styles.mainContainer}>
        {/* ── Hero Banner ── */}
        <div className={styles.heroBanner}>
          <div className={styles.heroIconWatermark}>🏛️</div>

          <div className={styles.heroTopBadges}>
            <div className={styles.badgeGovArchive}>
              <span>🏛️</span> 100% OFFICIAL MPSC ARCHIVE (mpsc.gov.in)
            </div>
            <Link href="/mpsc/pyq-analysis" className={styles.badgeAnalytics}>
              <span>📊</span> New: MPSC PYQ Analytics & Weightage Dashboard →
            </Link>
          </div>

          <h1 className={styles.heroTitle}>
            MPSC Question Papers & Answer Keys ({MPSC_ARCHIVE_YEARS_SPAN})
          </h1>

          <p className={styles.heroDesc}>
            थेट mpsc.gov.in वरून संकलित अधिकृत परीक्षा संच (२००९ ते २०२६). प्रत्येक परीक्षेसाठी मूळ <strong>प्रश्नपत्रिका</strong> (Question Paper) आणि <strong>उत्तरतालिका</strong> (Answer Key) अचूक विषयाच्या नावासह उपलब्ध आहेत. खालील कोणत्याही पेपरवर क्लिक करून थेट ब्राऊझरमध्ये वाचा किंवा PDF डाउनलोड करा.
          </p>

          {/* Accurate Statistics Row — Interactive Clickable Buttons */}
          <div className={styles.statsRow}>
            <button
              type="button"
              className={`${styles.statPillBtn} ${activeStatPill === 'all' ? `${styles.statPillAll} ${styles.statPillActiveRing}` : styles.statPillAllInactive}`}
              onClick={() => handleSelectStatPill('all')}
              title="Click to view all exam papers"
            >
              <span>📊</span> {MPSC_TOTAL_ARCHIVE_FOLDERS.toLocaleString('en-IN')} Exam Papers
            </button>

            <button
              type="button"
              className={`${styles.statPillBtn} ${activeStatPill === 'qp' ? `${styles.statPillQp} ${styles.statPillActiveRing}` : styles.statPillQpInactive}`}
              onClick={() => handleSelectStatPill('qp')}
              title="Click to view question papers"
            >
              <span>📄</span> {MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('en-IN')} Question Papers
            </button>

            <button
              type="button"
              className={`${styles.statPillBtn} ${activeStatPill === 'ak' ? `${styles.statPillAk} ${styles.statPillActiveRing}` : styles.statPillAkInactive}`}
              onClick={() => handleSelectStatPill('ak')}
              title="Click to view answer keys"
            >
              <span>✓</span> {MPSC_TOTAL_ANSWER_KEYS.toLocaleString('en-IN')} Answer Keys
            </button>

            <button
              type="button"
              className={`${styles.statPillBtn} ${activeStatPill === 'paired' ? `${styles.statPillPaired} ${styles.statPillActiveRing}` : styles.statPillPairedInactive}`}
              onClick={() => handleSelectStatPill('paired')}
              title="Click to view paired sets with key"
            >
              <span>⚡</span> 18 Years Archive (2009–2026)
            </button>

            {/* Quick Year Filters (Complete 2009–2026 Archive) */}
            <div className={styles.quickYearWrap}>
              <span className={styles.quickYearLabel}>Year:</span>
              {['all', ...availableYears.map(String)].map(yr => {
                const countForYr = yr === 'all'
                  ? allArchivePapers.length
                  : allArchivePapers.filter(p => String(p.examYear) === yr).length
                const isActive = selectedYear === yr
                return (
                  <button
                    key={yr}
                    type="button"
                    className={`${styles.yearPillBtn} ${isActive ? styles.yearPillBtnActive : ''}`}
                    onClick={() => {
                      setSelectedYear(yr)
                      setFeedbackNotice(`📅 Filtered by Year: ${yr === 'all' ? 'All Years (2009–2026)' : yr}`)
                      setFeedbackKey(k => k + 1)
                    }}
                  >
                    {yr === 'all' ? 'All' : yr} ({countForYr})
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Category Quick Navigation Bar (Updated to match exact 2009–2026 Cadre Counts) ── */}
        <div className={styles.categoryNavWrap}>
          {[
            { id: 'all', label: 'All Exams', count: MPSC_TOTAL_ARCHIVE_FOLDERS, icon: '🌟' },
            { id: 'rajyaseva', label: 'Rajyaseva (State Services)', count: MPSC_CADRE_COUNTS.rajyaseva.count, icon: '🏛️' },
            { id: 'group-b', label: 'Group B (PSI / STI / ASO)', count: MPSC_CADRE_COUNTS.groupB.count, icon: '👮' },
            { id: 'group-c', label: 'Group C (Clerk / Typist / Tax)', count: MPSC_CADRE_COUNTS.groupC.count, icon: '📋' },
            { id: 'other-services', label: 'Other Services (Engineering / Forest / Agri)', count: MPSC_CADRE_COUNTS.otherServices.count, icon: '🌲' },
          ].map(cat => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                className={`${styles.categoryBtn} ${isSelected ? styles.categoryBtnActive : ''}`}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setFeedbackNotice(`⚡ Cadre Selected: ${cat.label} (${cat.count} Papers)`)
                  setFeedbackKey(k => k + 1)
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={styles.categoryCountBadge}>{cat.count}</span>
              </button>
            )
          })}
        </div>

        {/* ── Animated Visual Feedback Notice Strip ── */}
        {feedbackNotice && (
          <div key={feedbackKey} className={styles.feedbackNoticeStrip}>
            <div>
              <span>⚡ </span>
              <span>{feedbackNotice}</span>
            </div>
            <div className={styles.badgeGroup}>
              <span className={styles.appliedBadge}>✓ APPLIED</span>
              <button
                type="button"
                className={styles.dismissBtn}
                onClick={() => setFeedbackNotice(null)}
                title="Dismiss notice"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ── Interactive In-Browser Study Workspace (Shows PDF directly) ── */}
        <section
          id="mpsc-study-workspace"
          ref={workspaceRef}
          className={styles.workspaceSection}
        >
          <div className={styles.workspaceHeader}>
            <div>
              <h2 className={styles.workspaceTitle}>
                <span>📖</span> MPSC In-Browser Study Workspace
              </h2>
              <p className={styles.workspaceSubtext}>
                प्रश्नपत्रिका व उत्तरतालिका थेट ब्राऊझरमध्ये वाचा — खालील बटनांवरून त्वरित स्विच करा.
              </p>
            </div>

            {activePaper && (
              <div className={styles.workspaceBadges}>
                <span className={styles.advtBadge}>
                  {activePaper.examYear} • Advt {activePaper.advertisementNumber || 'MPSC'}
                </span>
                <span className={styles.cadrePill}>
                  {activePaper.cadreShortName || 'MPSC'}
                </span>
                <button
                  type="button"
                  className={styles.reportBtn}
                  onClick={() => {
                    setFeedbackCategory('error_report')
                    setFeedbackModalOpen(true)
                  }}
                  title="Report wrong key, missing PDF or request paper"
                >
                  💬 Report / Request Paper
                </button>
              </div>
            )}
          </div>

          {/* Connected Official Study Workspace */}
          <OfficialPdfViewer
            papers={activeViewerPapers}
            conductingBody="Maharashtra Public Service Commission (MPSC)"
            officialWebsite="https://mpsc.gov.in"
            examName={activePaper?.title || 'MPSC Official Examination'}
            initialSelectedId={activeSelectedId}
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
        </section>

        {/* ── High-CTR Conversion Bar ── */}
        <div className={styles.jumpStrip}>
          <div className={styles.jumpStripHeader}>
            <div className={styles.badgeGroup}>
              <span>⚡</span>
              <strong className={styles.prepTitle}>
                प्रश्नपत्रिका वाचल्यानंतर लगेच सराव करा (Instant Practice Hub):
              </strong>
            </div>
            <Link href="/mock-tests" className={styles.breadcrumbLink}>
              सर्व मोफत टेस्ट्स →
            </Link>
          </div>

          <div className={styles.jumpStripChips}>
            {[
              { label: '💯 MPSC Full Mock 100-Q', href: '/mock-tests/mpsc-combined-full-prelims', highlight: true },
              { label: '🏛️ Polity PYQs (787)', href: '/pyq/polity' },
              { label: '🗺️ Geography PYQs (817)', href: '/pyq/geography' },
              { label: '📜 History PYQs (712)', href: '/pyq/history' },
              { label: '📈 Economy PYQs (987)', href: '/pyq/economy' },
              { label: '🔬 Science PYQs (2337)', href: '/pyq/science' },
              { label: '📖 Marathi PYQs (101)', href: '/pyq/marathi' },
              { label: '🧩 Reasoning PYQs (764)', href: '/pyq/reasoning' },
              { label: '📊 10-Yr Cutoffs', href: '/cutoffs' },
              { label: '📋 MPSC Syllabus', href: '/syllabus/mpsc-state-services' }
            ].map(chip => (
              <Link
                key={chip.href}
                href={chip.href}
                className={`${styles.jumpChip} ${chip.highlight ? styles.jumpChipHighlight : ''}`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Interactive Search & Filter Controls ── */}
        <div className={styles.filterCard} ref={cardsSectionRef}>
          {/* Keyword Search Input */}
          <div className={styles.searchBoxWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 1,491 papers by name, cadre, advt, or year (e.g. Advt 015, Group B, Rajyaseva, PSI, STI, Vanseva, CSAT)..."
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Filter Rows */}
          <div className={styles.filterRowsFlex}>
            {/* Stage Filters */}
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Stage:</span>
              {[
                { id: 'all', label: 'All Stages' },
                { id: 'prelims', label: 'Prelims Only' },
                { id: 'mains', label: 'Mains Only' }
              ].map(stg => (
                <button
                  key={stg.id}
                  type="button"
                  className={`${styles.tabBtn} ${selectedStage === stg.id ? styles.tabBtnActive : ''}`}
                  onClick={() => setSelectedStage(stg.id)}
                >
                  {stg.label}
                </button>
              ))}
            </div>

            {/* Answer Key Availability Filter */}
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Status:</span>
              {[
                { id: 'all', label: 'All Exam Sets' },
                { id: 'with-key', label: `✓ With Answer Key (${MPSC_TOTAL_ANSWER_KEYS})` },
                { id: 'qp-only', label: 'Question Papers Only' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.tabBtn} ${selectedKeyFilter === tab.id ? styles.tabBtnKeyActive : ''}`}
                  onClick={() => setSelectedKeyFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Jump to Year Select */}
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Jump to Year:</span>
              <select
                aria-label="Filter by Year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={styles.tabBtn}
              >
                <option value="all">All Years (2009–2026)</option>
                {availableYears.map(yr => (
                  <option key={yr} value={String(yr)}>
                    {yr} ({allArchivePapers.filter(p => String(p.examYear) === String(yr)).length} papers)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Status Strip ── */}
        <div className={styles.statusStrip}>
          <div className={styles.resultsCount}>
            Showing <strong>{filteredPapers.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredPapers.length)}</strong> of <strong>{filteredPapers.length}</strong> exam papers
            {totalPages > 1 && (
              <span className={styles.activePageHint}>
                (Page {validPage} of {totalPages})
              </span>
            )}
          </div>
          <div className={styles.sourceHint}>
            <span>🏛️</span> Official Source: <strong>mpsc.gov.in</strong>
          </div>
        </div>

        {/* ── Quick Tip Banner ── */}
        <div className={styles.tipBanner}>
          <span>💡</span>
          <span>
            <strong>कसे वाचावे (How to Study):</strong> खालील कोणत्याही परीक्षेसाठी <strong>"View Paper"</strong> वर क्लिक करा — तो पेपर वरील अभ्यासिकेत त्वरित उघडेल, किंवा <strong>"Solve PYQs Online"</strong> वरून थेट प्रश्न सोडवा.
          </span>
        </div>

        {/* ── SCREENSHOT 5 REDESIGNED: Exact Screenshot 4 Card Grid with PYQ Linking ── */}
        {filteredPapers.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>कोणतेही परीक्षा संच सापडले नाहीत (No matching exams)</h3>
            <p>कृपया शोध शब्द तपासा किंवा फिल्टर्स रीसेट करा.</p>
            <button
              type="button"
              className={styles.btnPrimaryCard}
              onClick={() => {
                setSelectedCategory('all')
                setSelectedYear('all')
                setSelectedStage('all')
                setSelectedKeyFilter('all')
                setSearchQuery('')
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {pagedPapers.map((paper) => {
              const qCount = questionsCounts[paper.slug] || questionsCounts[paper.folderName] || 0
              const hasExtractedPyq = qCount > 0
              const isActiveInWorkspace = activePaper?.slug === paper.slug

              return (
                <article
                  key={paper.slug}
                  className={`${styles.paperCard} ${isActiveInWorkspace ? styles.cardActiveInWorkspace : ''}`}
                >
                  <div className={styles.cardHeaderRow}>
                    <div className={styles.badgeGroup}>
                      <span className={paper.stage === 'mains' ? styles.stageBadgeMains : styles.stageBadgePrelims}>
                        {paper.stageLabel || (paper.stage === 'mains' ? 'Mains Examination' : 'Preliminary Examination')}
                      </span>
                      <span className={styles.yearBadge}>
                        Exam Year: {paper.examYear}
                      </span>
                      {paper.advertisementNumber && (
                        <span className={styles.advtBadgeCard}>
                          Advt: {paper.advertisementNumber}/{paper.advertisementYear || paper.examYear}
                        </span>
                      )}
                      <span className={styles.keyStatusPill}>
                        {paper.keyStatus}
                      </span>
                      {hasExtractedPyq && (
                        <span className={styles.pyqExtractedPill}>
                          ⚡ {qCount} Qs Solver Live
                        </span>
                      )}
                    </div>
                  </div>

                  <h2 className={styles.paperTitle}>
                    <button
                      type="button"
                      onClick={() => handleLoadInWorkspace(paper, 'qp')}
                      onMouseEnter={() => handlePrefetch(paper.id || paper.questionPaper?.downloadUrl)}
                      onFocus={() => handlePrefetch(paper.id || paper.questionPaper?.downloadUrl)}
                      className={styles.paperTitleLinkBtn}
                      title="Click to view question paper directly in Study Workspace"
                    >
                      {paper.title}
                    </button>
                  </h2>

                  <div className={styles.paperTitleMr}>
                    <button
                      type="button"
                      onClick={() => handleLoadInWorkspace(paper, 'qp')}
                      onMouseEnter={() => handlePrefetch(paper.id || paper.questionPaper?.downloadUrl)}
                      onFocus={() => handlePrefetch(paper.id || paper.questionPaper?.downloadUrl)}
                      className={styles.paperTitleMrBtn}
                      title="Click to view question paper directly in Study Workspace"
                    >
                      {paper.titleMr}
                    </button>
                  </div>

                  <div className={styles.paperMetaRow}>
                    <span>Max Marks: <strong>{paper.totalMarks || 100}</strong></span>
                    <span>•</span>
                    <span>Duration: <strong>{paper.durationMinutes || 60} mins</strong></span>
                    <span>•</span>
                    <span>Pattern: <strong>{paper.topicAnalysis?.examPattern || 'Objective MCQ'}</strong></span>
                    <span>•</span>
                    <span>Medium: <strong>Bilingual (मराठी / English)</strong></span>
                  </div>

                  <div className={styles.paperActionsRow}>
                    {/* 1. Primary Action: View paper directly in Study Workspace */}
                    <button
                      type="button"
                      onClick={() => handleLoadInWorkspace(paper, 'qp')}
                      onMouseEnter={() => handlePrefetch(paper.id || paper.questionPaper?.downloadUrl)}
                      onFocus={() => handlePrefetch(paper.id || paper.questionPaper?.downloadUrl)}
                      className={isActiveInWorkspace && activeDocType === 'qp' ? styles.btnWorkspaceCardOrangeActive : styles.btnWorkspaceCardOrange}
                      title="Load question paper directly into Study Workspace above"
                    >
                      {isActiveInWorkspace && activeDocType === 'qp' ? '📄 Currently Viewing Paper' : '📄 View Paper'}
                    </button>

                    {/* 2. Direct Answer Key Action: Placed directly next to View Paper! */}
                    {paper.answerKey?.downloadUrl ? (
                      <button
                        type="button"
                        onClick={() => handleLoadInWorkspace(paper, 'ak')}
                        onMouseEnter={() => handlePrefetch(paper.answerKey?.downloadUrl)}
                        onFocus={() => handlePrefetch(paper.answerKey?.downloadUrl)}
                        className={isActiveInWorkspace && activeDocType === 'ak' ? styles.btnAnswerKeyCardActive : styles.btnAnswerKeyCard}
                        title="Load official answer key directly into Study Workspace above"
                      >
                        {isActiveInWorkspace && activeDocType === 'ak' ? '🔑 Currently Viewing Key' : '🔑 View Answer Key'}
                      </button>
                    ) : (
                      <span className={styles.btnAnswerKeyDisabled} title="Official Answer Key pending publication by MPSC">
                        🔑 Key Awaited
                      </span>
                    )}

                    {/* 3. Practice Action: Solve PYQs Online or Timed CBT Mock */}
                    {hasExtractedPyq ? (
                      <Link
                        href={`/mpsc/${paper.slug}#solver`}
                        className={styles.btnSolvePyqCard}
                        title={`Solve all ${qCount} questions online with instant scores`}
                      >
                        📝 Solve PYQs ({qCount} Qs) Online
                      </Link>
                    ) : (
                      <Link
                        href={`/mock-tests?exam=mpsc&year=${paper.examYear}`}
                        className={styles.btnCbtMockCard}
                        title={`Practice 100-Q timed CBT Mock test for ${paper.examYear}`}
                      >
                        ⏱️ Timed CBT Mock ({paper.examYear})
                      </Link>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* ── Universal Numbered Pagination (Screenshot 4 standard) ── */}
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
                return <span key={pNum} className={styles.breadcrumbSeparator}>...</span>
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

        {/* ── SECTION 1: 15-Year Subject-wise PYQ Practice Bank ── */}
        <section className={styles.resourceSection}>
          <div className={styles.resourceSectionHeader}>
            <div>
              <div className={styles.resourceSectionTitleGroup}>
                <span>🎯</span>
                <h2 className={styles.resourceSectionTitle}>
                  विषयवार १५-वर्षीय PYQ प्रश्नसंच (15-Year Subject-wise PYQ Bank)
                </h2>
                <span className={styles.resourceBadge}>
                  ९,०००+ प्रश्न
                </span>
              </div>
              <p className={styles.resourceSectionDesc}>
                MPSC राज्यसेवा, संयुक्त गट ब/क, तलाठी व पोलीस भरतीमध्ये विचारलेले मागील १५ वर्षांचे प्रश्न विषयनिहाय सोडवा. अचूक उत्तर, संदर्भ व स्पष्टीकरणासह.
              </p>
            </div>
            <Link href="/pyq" className={styles.btnAllResources}>
              सर्व विषयवार बँक पहा →
            </Link>
          </div>

          <div className={styles.subjectGrid}>
            {SUBJECT_PYQ_CARDS.map(sub => (
              <div key={sub.slug} className={styles.subjectCard}>
                <div>
                  <div className={styles.subjectCardHeader}>
                    <div className={styles.subjectCardTitleGroup}>
                      <span>{sub.icon}</span>
                      <strong className={styles.subjectCardTitle}>
                        {sub.title}
                      </strong>
                    </div>
                    <span className={styles.resourceBadge}>
                      {sub.count}
                    </span>
                  </div>

                  <p className={styles.subjectCardDesc}>
                    📌 <strong>महत्त्वाचे घटक:</strong> {sub.topics}
                  </p>
                </div>

                <div className={styles.subjectBtnRow}>
                  <Link href={`/pyq/${sub.slug}`} className={styles.subjectSolveBtn}>
                    विषयवार प्रश्न सोडवा →
                  </Link>
                  <Link href={`/pyq?subject=${sub.subject}`} className={styles.subjectSearchBtn} title="Search in PYQ Bank">
                    🔍 शोध
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: Free Online CBT Mock Tests 2026 ── */}
        <section className={styles.resourceSection}>
          <div className={styles.resourceSectionHeader}>
            <div>
              <div className={styles.resourceSectionTitleGroup}>
                <span>⚡</span>
                <h2 className={styles.resourceSectionTitle}>
                  मोफत MPSC व स्पर्धा परीक्षा ऑनलाईन मॉक टेस्ट्स २०२६ (Free CBT Mock Tests)
                </h2>
                <span className={styles.resourceBadgeGreen}>
                  100% Free
                </span>
              </div>
              <p className={styles.resourceSectionDesc}>
                MPSC आणि TCS पॅटर्नवर आधारित १०० प्रश्नांचे संपूर्ण मॉक पेपर्स व २० प्रश्नांचे स्पीड ड्रिल्स — अधिकृत नेगेटिव्ह मार्किंग, श्रेणीनिहाय कट-ऑफ व राज्यस्तरीय रँकसह.
              </p>
            </div>
            <Link href="/mock-tests" className={styles.btnAllMocks}>
              सर्व ऑनलाईन मॉक टेस्ट्स पहा →
            </Link>
          </div>

          <div className={styles.mockGrid}>
            {MOCK_TEST_CARDS.map(test => (
              <div key={test.slug} className={styles.mockCard}>
                <div>
                  <div className={styles.subjectCardHeader}>
                    <span className={styles.resourceBadgeGreen}>
                      {test.badge}
                    </span>
                    <span className={styles.sourceHint}>
                      {test.duration}
                    </span>
                  </div>

                  <h3 className={styles.subjectCardTitle}>
                    <span>{test.icon} </span>
                    {test.title}
                  </h3>

                  <p className={styles.subjectCardDesc}>
                    {test.desc}
                  </p>
                </div>

                <Link href={`/mock-tests/${test.slug}`} className={styles.btnPrimaryCard}>
                  मॉक टेस्ट सुरू करा ({test.qCount}) →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: Preparation Tools ── */}
        <section className={styles.resourceSection}>
          <div className={styles.resourceSectionHeader}>
            <div>
              <div className={styles.resourceSectionTitleGroup}>
                <span>🛠️</span>
                <h2 className={styles.resourceSectionTitle}>
                  MPSC तयारीसाठी आवश्यक टूल्स (Essential Aspirant Tools)
                </h2>
              </div>
              <p className={styles.resourceSectionDesc}>
                अभ्यासक्रम, रिव्हिजन वेळापत्रक, कट-ऑफ आणि स्कोअर कॅल्क्युलेटर.
              </p>
            </div>
          </div>

          <div className={styles.prepGrid}>
            {PREP_TOOL_CARDS.map(tool => (
              <Link key={tool.href} href={tool.href} className={styles.prepCard}>
                <div>
                  <div className={styles.subjectCardHeader}>
                    <div className={styles.subjectCardTitleGroup}>
                      <span>{tool.icon}</span>
                      <strong className={styles.prepTitle}>{tool.title}</strong>
                    </div>
                    <span className={styles.resourceBadge}>{tool.badge}</span>
                  </div>
                  <p className={styles.prepDesc}>{tool.desc}</p>
                </div>
                <div className={styles.prepAction}>
                  <span>एक्सप्लोर करा (Open Tool) →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Aspirant Feedback Desk Floating Button & Modal */}
        <MpscFeedbackFloatingButton
          onClick={() => {
            setFeedbackCategory('missing_papers')
            setFeedbackModalOpen(true)
          }}
        />

        <MpscFeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          examContext={{
            title: activePaper ? `${activePaper.paperName || activePaper.title} (${activePaper.examYear})` : 'MPSC Question Papers & Answer Keys',
            docType: activeDocType === 'ak' ? 'Final Answer Key' : 'Question Paper',
            category: activePaper?.cadreShortName || selectedCategory,
            year: activePaper?.examYear || selectedYear,
          }}
          defaultCategory={feedbackCategory}
        />
      </div>
    </div>
  )
}
