// ============================================================
// app/mpsc-pyq/MpscPyqClient.js — Interactive Study Hub
// Question Papers & Answer Keys with Clear Paper Names & Fast Toggle
// 100% Sourced from mpsc.gov.in (Maharashtra Public Service Commission)
// ============================================================

'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import OfficialPdfViewer from '@/components/OfficialPdfViewer'
import { Pagination } from '@/components/Pagination'

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
    negative: '-0.25 Marks',
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
    negative: 'No Negative',
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
    negative: 'No Negative',
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
    negative: 'No Negative',
    marks: '40 Marks',
    desc: 'महाराष्ट्र शासन योजना, क्रीडा, पुरस्कार, राष्ट्रीय घडामोडी व महत्त्वाच्या नियुक्त्या २०२६ वरील अद्ययावत सराव प्रश्न.'
  },
  {
    title: 'Maharashtra Police Bharti Written Exam Full 100-Q Mock',
    slug: 'maharashtra-police-written-mock',
    badge: '100-Q Full Mock',
    badgeBg: '#ECFDF5',
    badgeColor: '#047857',
    icon: '👮',
    qCount: '100 MCQs',
    duration: '90 Mins',
    negative: 'No Negative',
    marks: '100 Marks',
    desc: 'मराठी व्याकरण, सामान्य ज्ञान, गणित व बुद्धिमत्तेचा १०० प्रश्नांचा संपूर्ण अधिकृत सराव पेपर.'
  },
  {
    title: 'Maharashtra Talathi TCS Pattern Full 100-Q Mock',
    slug: 'maharashtra-talathi-tcs-mock',
    badge: 'TCS Pattern Mock',
    badgeBg: '#FEF2F2',
    badgeColor: '#B91C1C',
    icon: '📋',
    qCount: '100 MCQs',
    duration: '120 Mins',
    negative: 'No Negative',
    marks: '200 Marks',
    desc: 'TCS पॅटर्नवर आधारित मराठी, इंग्रजी, सामान्य ज्ञान व बौद्धिक चाचणीचा संपूर्ण २०० गुणांचा सराव पेपर.'
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
  },
  {
    title: 'दैनिक चालू घडामोडी व क्विझ (Daily Quiz)',
    href: '/daily-quiz',
    icon: '⏱️',
    badge: 'Daily MCQs',
    desc: 'दररोज सकाळी नवीन १० परीक्षाभिमुख प्रश्न स्पष्टीकरणासह सोडवा आणि चालू घडामोडी रिव्हाइज करा.'
  },
  {
    title: 'नवीन सरकारी नोकरी भरती २०२६ (Job Alerts)',
    href: '/jobs',
    icon: '💼',
    badge: 'Live Alerts',
    desc: 'महाराष्ट्र शासन, MPSC, तलाठी, झेडपी व केंद्र सरकारच्या सर्व चालू भरती जाहिराती व थेट अर्ज लिंक.'
  }
]

export default function MpscPyqClient({
  pairedExams = [],
  allPapers = [],
  initialDocId = null,
  initialPdf = null,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all') // 'all' | '2026' | '2025' | '2024'
  const [selectedKeyFilter, setSelectedKeyFilter] = useState('all') // 'all' | 'with-key' | 'qp-only'
  const [searchQuery, setSearchQuery] = useState('')
  const [feedbackNotice, setFeedbackNotice] = useState(null)
  const [feedbackKey, setFeedbackKey] = useState(0)
  const [activeStatPill, setActiveStatPill] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 20
  const workspaceRef = useRef(null)
  const tableSectionRef = useRef(null)

  // Determine active exam and document type (Question Paper vs Answer Key)
  const [activeExamId, setActiveExamId] = useState(() => {
    if (initialDocId) {
      const match = pairedExams.find(
        e => e.id === initialDocId || e.questionPaper?.id === initialDocId || e.answerKey?.id === initialDocId
      )
      if (match) return match.id
    }
    if (initialPdf) {
      const match = pairedExams.find(
        e => e.questionPaper?.localPath === initialPdf || e.answerKey?.localPath === initialPdf
      )
      if (match) return match.id
    }
    // Default to latest 2026 Group B combined prelims or first exam
    const default2026 = pairedExams.find(e => e.year === 2026 && e.questionPaper)
    return default2026?.id || pairedExams[0]?.id || 13763
  })

  const [activeDocType, setActiveDocType] = useState(() => {
    if (initialDocId) {
      const isKey = allPapers.some(p => p.id === initialDocId && p.type === 'answer-key')
      if (isKey) return 'ak'
    }
    if (initialPdf && initialPdf.includes('answer_key')) return 'ak'
    return 'qp'
  })

  // Scroll to workspace on initial load if URL requested a specific document
  useEffect(() => {
    if (initialDocId || initialPdf) {
      if (workspaceRef.current) {
        workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [initialDocId, initialPdf])

  // Get currently active exam object
  const activeExam = useMemo(() => {
    return pairedExams.find(e => e.id === activeExamId) || pairedExams[0] || null
  }, [pairedExams, activeExamId])

  // Prepare documents array for OfficialPdfViewer
  const activeViewerPapers = useMemo(() => {
    if (!activeExam) return []
    const papersList = []

    if (activeExam.questionPaper) {
      papersList.push({
        id: activeExam.questionPaper.id,
        year: activeExam.year,
        label: `${activeExam.paperName} (Question Paper)`,
        title: `${activeExam.title} — ${activeExam.paperName}`,
        size: activeExam.questionPaper.sizeFormatted,
        url: activeExam.questionPaper.localPath,
        isAnswerKey: false,
        pairId: activeExam.answerKey ? activeExam.answerKey.id : null,
        badge: 'QP'
      })
    }

    if (activeExam.answerKey) {
      papersList.push({
        id: activeExam.answerKey.id,
        year: activeExam.year,
        label: `${activeExam.paperName} (Official Answer Key)`,
        title: `${activeExam.title} — ${activeExam.paperName} (Final Answer Key)`,
        size: activeExam.answerKey.sizeFormatted,
        url: activeExam.answerKey.localPath,
        isAnswerKey: true,
        pairId: activeExam.questionPaper ? activeExam.questionPaper.id : null,
        badge: activeExam.answerKey.isFinal ? 'FINAL KEY' : '1ST KEY'
      })
    }

    return papersList
  }, [activeExam])

  // Active selected ID in viewer
  const activeSelectedId = useMemo(() => {
    if (activeDocType === 'ak' && activeExam?.answerKey) {
      return activeExam.answerKey.id
    }
    return activeExam?.questionPaper?.id || activeExam?.answerKey?.id || null
  }, [activeDocType, activeExam])

  // Distinct categories with counts
  const categories = useMemo(() => {
    const list = [
      { id: 'all', label: 'All Exams', icon: '🌟' },
      { id: 'Rajyaseva (State Services)', label: 'Rajyaseva (State Services)', icon: '🏛️' },
      { id: 'Group B Non-Gazetted', label: 'Group B (PSI / STI / ASO)', icon: '👮' },
      { id: 'Group C Services', label: 'Group C (Clerk / Typist / Tax)', icon: '📋' },
      { id: 'Forest Services (Vanseva)', label: 'Forest Services (Vanseva)', icon: '🌲' },
      { id: 'Engineering Services', label: 'Engineering Services', icon: '🏗️' },
      { id: 'Town Planning', label: 'Town Planning', icon: '📐' },
      { id: 'Court & Judicial', label: 'Court & Judicial', icon: '⚖️' },
      { id: 'Special Cadre & Screening', label: 'Special Cadre & Screening', icon: '🔬' },
    ]
    return list.map(cat => {
      const count = cat.id === 'all'
        ? pairedExams.length
        : pairedExams.filter(e => e.category === cat.id).length
      return { ...cat, count }
    }).filter(c => c.count > 0 || c.id === 'all')
  }, [pairedExams])

  // Real, accurate statistics based on verified downloaded files
  const stats = useMemo(() => {
    const totalExams = pairedExams.length
    const totalQps = pairedExams.filter(e => e.questionPaper !== null).length
    const totalAks = pairedExams.filter(e => e.answerKey !== null).length
    const withKey = pairedExams.filter(e => e.questionPaper && e.answerKey).length

    const y2026 = pairedExams.filter(e => e.year === 2026).length
    const y2025 = pairedExams.filter(e => e.year === 2025).length
    const y2024 = pairedExams.filter(e => e.year === 2024).length
    const y2023 = pairedExams.filter(e => e.year === 2023).length
    const y2022 = pairedExams.filter(e => e.year === 2022).length
    const y2021 = pairedExams.filter(e => e.year === 2021).length

    return { totalExams, totalQps, totalAks, withKey, y2026, y2025, y2024, y2023, y2022, y2021 }
  }, [pairedExams])

  // Filter paired rows by category, year, key availability, and search query
  const filteredRows = useMemo(() => {
    return pairedExams.filter(row => {
      // Category filter
      if (selectedCategory !== 'all' && row.category !== selectedCategory) {
        return false
      }
      // Year filter
      if (selectedYear !== 'all' && row.year !== parseInt(selectedYear)) {
        return false
      }
      // Answer Key status filter
      if (selectedKeyFilter === 'with-key' && !row.answerKey) {
        return false
      }
      if (selectedKeyFilter === 'qp-only' && row.answerKey) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = (row.title || '').toLowerCase().includes(q)
        const matchTitleMr = (row.titleMr || '').toLowerCase().includes(q)
        const matchPaper = (row.paperName || '').toLowerCase().includes(q)
        const matchPaperMr = (row.paperNameMr || '').toLowerCase().includes(q)
        const matchAdvt = (row.advertisementNumber || '').toLowerCase().includes(q)
        const matchYear = String(row.year).includes(q)
        const matchCategory = (row.category || '').toLowerCase().includes(q)

        if (!matchTitle && !matchTitleMr && !matchPaper && !matchPaperMr && !matchAdvt && !matchYear && !matchCategory) {
          return false
        }
      }
      return true
    })
  }, [pairedExams, selectedCategory, selectedYear, selectedKeyFilter, searchQuery])

  // Reset to first page when any search/filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedYear, selectedKeyFilter, searchQuery])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredRows.length)
  const paginatedRows = useMemo(() => {
    return filteredRows.slice(startIndex, endIndex)
  }, [filteredRows, startIndex, endIndex])

  function handlePageChange(newPage) {
    setCurrentPage(newPage)
    if (tableSectionRef.current) {
      tableSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Switch to exam and document type in workspace
  function handleSelectExam(examId, docType = 'qp', scroll = true) {
    setActiveExamId(examId)
    setActiveDocType(docType)
    const exam = pairedExams.find(e => e.id === examId)
    if (exam) {
      setFeedbackNotice(`📖 Loaded: ${exam.paperName} (${exam.year}) — ${docType === 'ak' ? 'Official Answer Key' : 'Official Question Paper'}`)
      setFeedbackKey(k => k + 1)
    }
    if (scroll && workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle category navigation with instant workspace synchronization and smooth scroll
  function handleSelectCategory(catId) {
    setSelectedCategory(catId)
    const catObj = categories.find(c => c.id === catId)
    const label = catObj?.label || 'All Exams'
    const count = catObj?.count || 0

    // Automatically load the first paper from the selected category into the workspace
    const match = pairedExams.find(e => catId === 'all' || e.category === catId)
    if (match) {
      setActiveExamId(match.id)
      setActiveDocType('qp')
    }

    setFeedbackNotice(`⚡ Category Selected: ${label} (${count} Papers) — Loaded in Study Workspace Below`)
    setFeedbackKey(k => k + 1)

    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle top stats pill clicks with auto-scroll and workspace update
  function handleSelectStatPill(pillType) {
    setActiveStatPill(pillType)
    if (pillType === 'all') {
      setSelectedCategory('all')
      setSelectedKeyFilter('all')
      setSelectedYear('all')
      setSearchQuery('')
      const defaultExam = pairedExams[0]
      if (defaultExam) {
        setActiveExamId(defaultExam.id)
        setActiveDocType('qp')
      }
      setFeedbackNotice(`📊 Viewing All ${stats.totalExams} Exam Papers — Loaded in Study Workspace`)
    } else if (pillType === 'qp') {
      setSelectedKeyFilter('all')
      setActiveDocType('qp')
      const defaultQp = pairedExams.find(e => e.questionPaper) || pairedExams[0]
      if (defaultQp) setActiveExamId(defaultQp.id)
      setFeedbackNotice(`📄 Viewing Question Papers (${stats.totalQps} Available) — Loaded in Study Workspace`)
    } else if (pillType === 'ak') {
      setSelectedKeyFilter('with-key')
      setActiveDocType('ak')
      const defaultAk = pairedExams.find(e => e.answerKey) || pairedExams[0]
      if (defaultAk) setActiveExamId(defaultAk.id)
      setFeedbackNotice(`✓ Filter Applied: ${stats.totalAks} Official Answer Keys — Loaded in Study Workspace`)
    } else if (pillType === 'paired') {
      setSelectedKeyFilter('with-key')
      const defaultPaired = pairedExams.find(e => e.questionPaper && e.answerKey) || pairedExams[0]
      if (defaultPaired) {
        setActiveExamId(defaultPaired.id)
        setActiveDocType('qp')
      }
      setFeedbackNotice(`⚡ Filter Applied: ${stats.withKey} Paired Q&A Sets — Loaded in Study Workspace`)
    }
    setFeedbackKey(k => k + 1)
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle year selection
  function handleSelectYear(year) {
    setSelectedYear(year)
    const yrLabel = year === 'all' ? 'All Years' : year
    const match = pairedExams.find(e => year === 'all' || e.year === parseInt(year))
    if (match) {
      setActiveExamId(match.id)
      setActiveDocType('qp')
    }
    setFeedbackNotice(`📅 Filtered by Year: ${yrLabel} — Loaded in Study Workspace`)
    setFeedbackKey(k => k + 1)
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle status key filter selection
  function handleSelectKeyFilter(filter) {
    setSelectedKeyFilter(filter)
    const label = filter === 'with-key' ? 'With Answer Key' : filter === 'qp-only' ? 'Question Papers Only' : 'All Exam Sets'
    const match = pairedExams.find(e => {
      if (filter === 'with-key') return Boolean(e.answerKey)
      if (filter === 'qp-only') return !e.answerKey
      return true
    })
    if (match) {
      setActiveExamId(match.id)
      setActiveDocType(filter === 'with-key' ? 'ak' : 'qp')
    }
    setFeedbackNotice(`✓ Status Filter: ${label} — Loaded in Study Workspace`)
    setFeedbackKey(k => k + 1)
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div style={{ background: 'var(--surface, #FFFBF5)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* ── Top Breadcrumbs ── */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '12px 20px',
        fontSize: '13px'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#EA580C', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          <span>/</span>
          <Link href="/question-papers" style={{ color: '#EA580C', textDecoration: 'none', fontWeight: 600 }}>Question Papers</Link>
          <span>/</span>
          <span style={{ color: '#1F2937', fontWeight: 700 }}>MPSC Question Papers & Answer Keys (2021–2026)</span>
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(14px, 3vw, 24px) clamp(12px, 2.5vw, 20px) 0' }}>
        {/* ── Hero Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 32px) clamp(16px, 3vw, 28px)',
          color: '#FFFFFF',
          marginBottom: '20px',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            right: '-10px',
            top: '-15px',
            fontSize: '120px',
            opacity: 0.05,
            userSelect: 'none',
            pointerEvents: 'none'
          }}>
            🏛️
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(234, 88, 12, 0.2)', border: '1px solid rgba(234, 88, 12, 0.4)', padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, color: '#FB923C', marginBottom: '14px' }}>
            <span>🏛️</span> 100% OFFICIAL MAHARASHTRA PUBLIC SERVICE COMMISSION ARCHIVE (mpsc.gov.in)
          </div>

          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(22px, 3.5vw, 32px)',
            fontWeight: 800,
            margin: '0 0 10px 0',
            lineHeight: 1.25,
            letterSpacing: '-0.02em'
          }}>
            MPSC Question Papers & Answer Keys (2021–2026)
          </h1>

          <p style={{
            fontSize: '14.5px',
            color: '#CBD5E1',
            maxWidth: '860px',
            margin: '0 0 20px 0',
            lineHeight: 1.6
          }}>
            थेट mpsc.gov.in वरून संकलित अधिकृत परीक्षा संच. प्रत्येक परीक्षेसाठी मूळ <strong>प्रश्नपत्रिका</strong> (Question Paper) आणि <strong>उत्तरतालिका</strong> (Answer Key) अचूक विषयाच्या नावासह उपलब्ध आहेत. खालील कोणत्याही पेपरवर क्लिक करून थेट ब्राऊझरमध्ये वाचा किंवा PDF डाउनलोड करा.
          </p>

          {/* Accurate Statistics Row — Interactive Clickable Buttons that Load into Workspace */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
            fontSize: '13px',
            fontWeight: 600,
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <button
              type="button"
              className="mpsc-stat-pill-btn"
              onClick={() => handleSelectStatPill('all')}
              style={{
                background: activeStatPill === 'all' ? '#EA580C' : 'rgba(234, 88, 12, 0.85)',
                color: '#FFFFFF',
                boxShadow: activeStatPill === 'all' ? '0 0 0 2px #FFFFFF, 0 0 12px rgba(234, 88, 12, 0.8)' : 'none'
              }}
              title="Click to view all exam papers in study workspace"
            >
              <span>📊</span> {stats.totalExams} Exam Papers
            </button>

            <button
              type="button"
              className="mpsc-stat-pill-btn"
              onClick={() => handleSelectStatPill('qp')}
              style={{
                background: activeStatPill === 'qp' ? '#3B82F6' : 'rgba(255, 255, 255, 0.12)',
                color: '#F1F5F9',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: activeStatPill === 'qp' ? '0 0 0 2px #FFFFFF, 0 0 12px rgba(59, 130, 246, 0.6)' : 'none'
              }}
              title="Click to view question papers in study workspace"
            >
              <span>📄</span> {stats.totalQps} Question Papers
            </button>

            <button
              type="button"
              className="mpsc-stat-pill-btn"
              onClick={() => handleSelectStatPill('ak')}
              style={{
                background: activeStatPill === 'ak' ? '#059669' : 'rgba(255, 255, 255, 0.12)',
                color: '#F1F5F9',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: activeStatPill === 'ak' ? '0 0 0 2px #FFFFFF, 0 0 12px rgba(5, 150, 105, 0.6)' : 'none'
              }}
              title="Click to view answer keys in study workspace"
            >
              <span>✓</span> {stats.totalAks} Answer Keys
            </button>

            <button
              type="button"
              className="mpsc-stat-pill-btn"
              onClick={() => handleSelectStatPill('paired')}
              style={{
                background: activeStatPill === 'paired' ? '#059669' : 'rgba(16, 185, 129, 0.25)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                color: activeStatPill === 'paired' ? '#FFFFFF' : '#6EE7B7',
                boxShadow: activeStatPill === 'paired' ? '0 0 0 2px #FFFFFF, 0 0 12px rgba(16, 185, 129, 0.6)' : 'none'
              }}
              title="Click to view paired question papers and answer keys"
            >
              <span>⚡</span> {stats.withKey} Paired Q&A Sets
            </button>

            {/* Quick Year Filters — stacks below stat pills on small screens */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              <span style={{ color: '#94A3B8', fontSize: '12px', flexShrink: 0 }}>Year:</span>
              {[
                { yr: 'All', count: 429 },
                { yr: '2026', count: stats.y2026 },
                { yr: '2025', count: stats.y2025 },
                { yr: '2024', count: stats.y2024 },
                { yr: '2023', count: stats.y2023 },
                { yr: '2022', count: stats.y2022 },
                { yr: '2021', count: stats.y2021 },
              ].map(y => (
                <button
                  key={y.yr}
                  type="button"
                  onClick={() => handleSelectYear(y.yr)}
                  style={{
                    background: selectedYear === y.yr ? '#EA580C' : 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: selectedYear === y.yr ? '#FFFFFF' : '#CBD5E1',
                    fontSize: '11.5px',
                    fontWeight: selectedYear === y.yr ? 700 : 500,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={`Filter by year ${y.yr} and load in workspace`}
                >
                  {y.yr} ({y.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Category Quick Navigation Bar (Wrapped pill container matching screenshot 2) ── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '10px 14px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          marginBottom: '16px'
        }}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                className={`mpsc-category-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectCategory(cat.id)}
                title={`Filter by ${cat.label} and load in study workspace`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="mpsc-category-badge">
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Animated Visual Feedback Notice (Shows What Setting / Filter Was Applied) ── */}
        {feedbackNotice && (
          <div
            key={feedbackKey}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, #FFF7ED 0%, #FEF3C7 100%)',
              border: '1.5px solid #F97316',
              borderRadius: '10px',
              padding: '10px 16px',
              marginBottom: '18px',
              color: '#9A3412',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.12)',
              animation: 'feedbackSlideDown 0.3s ease-out',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>⚡</span>
              <span>{feedbackNotice}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              <span style={{
                fontSize: '11px',
                background: '#EA580C',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '999px',
                fontWeight: 700,
                letterSpacing: '0.03em'
              }}>
                ✓ APPLIED
              </span>
              <button
                type="button"
                onClick={() => setFeedbackNotice(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9A3412',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '2px',
                  fontWeight: 700
                }}
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
          style={{ marginBottom: '32px', scrollMarginTop: '20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📖</span> MPSC In-Browser Study Workspace
              </h2>
              <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                प्रश्नपत्रिका व उत्तरतालिका थेट ब्राऊझरमध्ये वाचा — खालील टूलबारमधील बटनांवरून त्वरित स्विच करा.
              </p>
            </div>
            {activeExam && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#EA580C', background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '4px 10px', borderRadius: '6px' }}>
                  {activeExam.year} • Advt {activeExam.advertisementNumber || 'MPSC'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px' }}>
                  {activeExam.category}
                </span>
              </div>
            )}
          </div>

          {/* Connected Official Study Workspace */}
          <OfficialPdfViewer
            papers={activeViewerPapers}
            conductingBody="Maharashtra Public Service Commission (MPSC)"
            officialWebsite="https://mpsc.gov.in"
            examName={activeExam?.title || 'MPSC Official Examination'}
            initialSelectedId={activeSelectedId}
            onSelectDoc={(docId) => {
              if (activeExam?.answerKey && docId === activeExam.answerKey.id) {
                setActiveDocType('ak')
              } else {
                setActiveDocType('qp')
              }
            }}
            showSelectorChips={false}
            showDirectorySection={false}
          />
        </section>

        {/* ── Instant Practice & Test Jump Strip (High-CTR Conversion Bar) ── */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)',
          border: '1.5px solid #FDBA74',
          borderRadius: '14px',
          padding: '14px 18px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(234, 88, 12, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>⚡</span>
              <div>
                <strong style={{ fontSize: '14px', color: '#9A3412', fontFamily: 'Outfit, sans-serif' }}>
                  प्रश्नपत्रिका वाचल्यानंतर लगेच सराव करा (Instant Practice Hub):
                </strong>
                <span style={{ fontSize: '12.5px', color: '#64748B', marginLeft: '6px' }}>
                  विषयवार PYQ प्रश्नसंच व अधिकृत मॉक टेस्ट्स थेट सोडवा.
                </span>
              </div>
            </div>
            <Link
              href="/mock-tests"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#EA580C',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              सर्व मोफत टेस्ट्स →
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { label: '💯 MPSC Full Mock 100-Q', href: '/mock-tests/mpsc-combined-full-prelims', highlight: true },
              { label: '🏛️ Polity PYQs (787)', href: '/pyq/polity' },
              { label: '🗺️ Geography PYQs (817)', href: '/pyq/geography' },
              { label: '📜 History PYQs (712)', href: '/pyq/history' },
              { label: '📈 Economy PYQs (987)', href: '/pyq/economy' },
              { label: '🔬 Science PYQs (2337)', href: '/pyq/science' },
              { label: '📖 Marathi PYQs (101)', href: '/pyq/marathi' },
              { label: '🧩 Reasoning PYQs (764)', href: '/pyq/reasoning' },
              { label: '🗺️ Maha Geo Mock Drill', href: '/mock-tests/mpsc-gs-maharashtra-geography' },
              { label: '🏛️ Polity Mock Drill', href: '/mock-tests/mpsc-polity-constitution' },
              { label: '📰 Current Affairs Drill', href: '/mock-tests/mpsc-current-affairs-2026' },
              { label: '📊 10-Yr Cutoffs', href: '/cutoffs' },
              { label: '📋 MPSC Syllabus', href: '/syllabus/mpsc-state-services' }
            ].map(chip => (
              <Link
                key={chip.href}
                href={chip.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: chip.highlight ? '6px 14px' : '5px 11px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: chip.highlight ? 700 : 600,
                  textDecoration: 'none',
                  background: chip.highlight ? '#EA580C' : '#FFFFFF',
                  color: chip.highlight ? '#FFFFFF' : '#334155',
                  border: chip.highlight ? '1px solid #EA580C' : '1px solid #E2E8F0',
                  boxShadow: chip.highlight ? '0 2px 6px rgba(234, 88, 12, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          padding: '20px 22px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Search Input */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '17px', color: '#9CA3AF' }}>
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search papers by name, subject, or advt (e.g. Advt 013, Group B, GS 4, Rajyaseva, PSI, Forestry, Civil Engineering)..."
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid #D1D5DB',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  color: '#1F2937',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '13px',
                    color: '#6B7280',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Year Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginRight: '4px' }}>
                Year:
              </span>
              {[
                { id: 'all', label: `All Years (${stats.totalExams})` },
                { id: '2026', label: `2026 (${stats.y2026})` },
                { id: '2025', label: `2025 (${stats.y2025})` },
                { id: '2024', label: `2024 (${stats.y2024})` },
                { id: '2023', label: `2023 (${stats.y2023})` },
                { id: '2022', label: `2022 (${stats.y2022})` },
                { id: '2021', label: `2021 (${stats.y2021})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectYear(tab.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: selectedYear === tab.id ? 700 : 500,
                    cursor: 'pointer',
                    border: selectedYear === tab.id ? '1.5px solid #EA580C' : '1px solid #D1D5DB',
                    background: selectedYear === tab.id ? '#FFF7ED' : '#FFFFFF',
                    color: selectedYear === tab.id ? '#EA580C' : '#4B5563',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Answer Key Availability Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginRight: '4px' }}>
                Status:
              </span>
              {[
                { id: 'all', label: 'All Exam Sets' },
                { id: 'with-key', label: `✓ With Answer Key (${stats.totalAks})` },
                { id: 'qp-only', label: 'Question Papers Only' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectKeyFilter(tab.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: selectedKeyFilter === tab.id ? 700 : 500,
                    cursor: 'pointer',
                    border: selectedKeyFilter === tab.id ? '1.5px solid #059669' : '1px solid #D1D5DB',
                    background: selectedKeyFilter === tab.id ? '#ECFDF5' : '#FFFFFF',
                    color: selectedKeyFilter === tab.id ? '#059669' : '#4B5563',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Table Header / Status Strip ── */}
        <div
          ref={tableSectionRef}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '10px',
            scrollMarginTop: '24px'
          }}
        >
          <div style={{ fontSize: '14px', color: '#4B5563' }}>
            Showing <strong>{filteredRows.length > 0 ? startIndex + 1 : 0}–{endIndex}</strong> of <strong>{filteredRows.length}</strong> exam papers
            {totalPages > 1 && (
              <span style={{ color: '#EA580C', fontWeight: 600, marginLeft: '6px' }}>
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🏛️</span> Official Source: <strong>mpsc.gov.in</strong>
          </div>
        </div>

        {/* ── Quick Tip Banner (Tells users explicitly how to click & study) ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(90deg, #FFF7ED 0%, #FEF3C7 100%)',
          border: '1.5px solid #FDBA74',
          borderRadius: '10px',
          padding: '10px 16px',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#9A3412',
          fontWeight: 600,
          boxShadow: '0 1px 4px rgba(234, 88, 12, 0.08)'
        }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
          <span>
            <strong>कसे वाचावे (How to Study):</strong> खालील कोणत्याही परीक्षेसाठी <strong>"View Paper"</strong> किंवा <strong>"View Key"</strong> बटणावर क्लिक करा — तो पेपर वरील अभ्यासिकेत (Study Workspace) लगेच उघडेल.
          </span>
        </div>

        {/* ── ONE ROW PER EXAM TABLE ── */}
        {filteredRows.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            border: '1px dashed #CBD5E1',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            <p style={{ fontSize: '24px', margin: '0 0 8px 0' }}>🔍</p>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 6px 0' }}>
              कोणतेही परीक्षा संच सापडले नाहीत (No matching exams)
            </h3>
            <p style={{ fontSize: '13.5px', margin: '0 0 16px 0' }}>
              कृपया शोध शब्द तपासा किंवा फिल्टर्स रीसेट करा.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedYear('all'); setSelectedKeyFilter('all'); setSearchQuery(''); }}
              style={{
                background: '#EA580C',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mpsc-pyq-desktop" style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              marginBottom: '40px'
            }}>
              <div style={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                width: '100%'
              }}>
                <div style={{ minWidth: '780px' }}>
                  {/* Desktop Table Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(340px, 2.3fr) minmax(210px, 1.2fr) minmax(210px, 1.2fr) 140px',
                    background: '#F8FAFC',
                    borderBottom: '1px solid #E5E7EB',
                    padding: '14px 20px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#475569',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    <div>Examination & Paper Name</div>
                    <div>Question Paper (Read / PDF)</div>
                    <div>Official Answer Key</div>
                    <div style={{ textAlign: 'center' }}>Reader Status</div>
                  </div>

                  {/* Exam Rows */}
                  {paginatedRows.map((row, idx) => {
                    const qp = row.questionPaper
                    const ak = row.answerKey
                    const isEven = idx % 2 === 0
                    const isActiveExam = activeExam?.id === row.id

                    return (
                      <div
                        key={`${row.id}-${idx}`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(340px, 2.3fr) minmax(210px, 1.2fr) minmax(210px, 1.2fr) 140px',
                          alignItems: 'center',
                          padding: '16px 20px',
                          borderBottom: idx === filteredRows.length - 1 ? 'none' : '1px solid #F1F5F9',
                          background: isActiveExam ? '#FFF7ED' : isEven ? '#FFFFFF' : '#FAFAFA',
                          gap: '16px',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        {/* Column 1: Exam Info & Specific Paper Name */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: row.year === 2026 ? '#EA580C' : '#334155',
                              color: '#FFFFFF'
                            }}>
                              {row.year}
                            </span>

                            {row.advertisementNumber && (
                              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                                Advt {row.advertisementNumber}
                              </span>
                            )}

                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', background: '#F8FAFC', padding: '2px 6px', borderRadius: '4px' }}>
                              {row.category}
                            </span>

                            {ak && (
                              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                                ✓ Key Available
                              </span>
                            )}
                          </div>

                          <h3
                            onClick={() => handleSelectExam(row.id, 'qp')}
                            style={{
                              fontFamily: 'Outfit, sans-serif',
                              fontSize: '14.5px',
                              fontWeight: 700,
                              color: '#1E293B',
                              margin: '0 0 3px 0',
                              lineHeight: 1.35,
                              cursor: 'pointer'
                            }}
                            title="Click to load paper in workspace"
                          >
                            {row.title}
                          </h3>

                          {/* Prominent Paper Name Highlight (Clickable) */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => handleSelectExam(row.id, 'qp')}
                              style={{
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: (isActiveExam && activeDocType === 'qp') ? '#EA580C' : '#FFF7ED',
                                color: (isActiveExam && activeDocType === 'qp') ? '#FFFFFF' : '#C2410C',
                                border: (isActiveExam && activeDocType === 'qp') ? '1.5px solid #EA580C' : '1px solid #FFEDD5',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                textAlign: 'left',
                                boxShadow: (isActiveExam && activeDocType === 'qp') ? '0 2px 6px rgba(234, 88, 12, 0.25)' : 'none',
                                transition: 'all 0.15s ease'
                              }}
                              title={`Click to read ${row.paperName} in reader`}
                            >
                              <span>📄 {row.paperName}</span>
                              {row.paperNameMr && (
                                <span style={{
                                  fontSize: '12px',
                                  color: (isActiveExam && activeDocType === 'qp') ? '#FED7AA' : '#64748B',
                                  fontWeight: 500
                                }}>
                                  {row.paperNameMr}
                                </span>
                              )}
                              {isActiveExam && activeDocType === 'qp' && (
                                <span style={{
                                  fontSize: '10px',
                                  background: 'rgba(255,255,255,0.25)',
                                  color: '#FFFFFF',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}>
                                  <span>📖</span> Currently Reading
                                </span>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Column 2: Official Question Paper (Action-Oriented View Button) */}
                        <div>
                          {qp ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => handleSelectExam(row.id, 'qp', true)}
                                style={{
                                  background: (isActiveExam && activeDocType === 'qp') ? '#C2410C' : '#EA580C',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '8px 13px',
                                  borderRadius: '7px',
                                  fontSize: '12.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  boxShadow: (isActiveExam && activeDocType === 'qp') ? '0 2px 6px rgba(194, 65, 12, 0.35)' : '0 1px 3px rgba(234, 88, 12, 0.25)',
                                  transition: 'all 0.15s ease'
                                }}
                                title="Click to view Question Paper in Study Workspace above"
                              >
                                <span>{isActiveExam && activeDocType === 'qp' ? '📖' : '📄'}</span>
                                <span>{isActiveExam && activeDocType === 'qp' ? 'Reading Paper' : 'View Paper'}</span>
                              </button>

                              <a
                                href={qp.localPath}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#4B5563',
                                  background: '#FFFFFF',
                                  border: '1px solid #D1D5DB',
                                  padding: '7px 9px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="Download PDF"
                              >
                                <span>⬇️</span> {qp.sizeFormatted || 'PDF'}
                              </a>
                            </div>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Not Applicable</span>
                          )}
                        </div>

                        {/* Column 3: Official Answer Key (Action-Oriented View Button) */}
                        <div>
                          {ak ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => handleSelectExam(row.id, 'ak', true)}
                                style={{
                                  background: (isActiveExam && activeDocType === 'ak') ? '#15803D' : '#059669',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '8px 13px',
                                  borderRadius: '7px',
                                  fontSize: '12.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  boxShadow: (isActiveExam && activeDocType === 'ak') ? '0 2px 6px rgba(21, 128, 61, 0.35)' : '0 1px 3px rgba(5, 150, 105, 0.25)',
                                  transition: 'all 0.15s ease'
                                }}
                                title="Click to view Official Answer Key in Study Workspace above"
                              >
                                <span>✓</span>
                                <span>{isActiveExam && activeDocType === 'ak' ? 'Reading Key' : 'View Key'}</span>
                              </button>

                              <a
                                href={ak.localPath}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#4B5563',
                                  background: '#FFFFFF',
                                  border: '1px solid #D1D5DB',
                                  padding: '7px 9px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="Download PDF"
                              >
                                <span>⬇️</span> {ak.sizeFormatted || 'PDF'}
                              </a>
                            </div>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11.5px',
                              color: '#6B7280',
                              background: '#F3F4F6',
                              padding: '5px 10px',
                              borderRadius: '6px'
                            }}>
                              <span>⏳</span> Key Pending
                            </span>
                          )}
                        </div>

                        {/* Column 4: Quick Action (Load in Workspace) */}
                        <div style={{ textAlign: 'center' }}>
                          {isActiveExam ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#DCFCE7',
                              border: '1.5px solid #86EFAC',
                              color: '#15803D',
                              padding: '6px 12px',
                              borderRadius: '7px',
                              fontSize: '12px',
                              fontWeight: 700,
                              boxShadow: '0 1px 3px rgba(22, 163, 74, 0.15)'
                            }}>
                              <span style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: '#16A34A',
                                display: 'inline-block',
                                animation: 'livePulseDot 1.5s infinite ease-in-out'
                              }} />
                              Currently Reading
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectExam(row.id, qp ? 'qp' : 'ak', true)}
                              style={{
                                background: 'transparent',
                                border: '1.5px solid #EA580C',
                                color: '#EA580C',
                                padding: '6px 12px',
                                borderRadius: '7px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s ease'
                              }}
                              title="Load Paper into In-Browser Reader"
                            >
                              <span>⚡</span> Open in Reader
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ── Mobile View (Interactive Touch Cards with Direct 1-Tap PDF View) ── */}
            <div className="mpsc-pyq-mobile">
              {paginatedRows.map((row, idx) => {
                const qp = row.questionPaper
                const ak = row.answerKey
                const isActiveExam = activeExam?.id === row.id

                return (
                  <div
                    key={`mob-${row.id}-${idx}`}
                    style={{
                      background: isActiveExam ? '#FFF7ED' : '#FFFFFF',
                      border: isActiveExam ? '2px solid #EA580C' : '1.5px solid #E5E7EB',
                      borderRadius: '14px',
                      padding: '16px',
                      boxShadow: isActiveExam ? '0 4px 14px rgba(234, 88, 12, 0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Top Row: Meta Badges + Active Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '4px',
                          background: row.year === 2026 ? '#EA580C' : '#334155',
                          color: '#FFFFFF'
                        }}>
                          {row.year}
                        </span>

                        {row.advertisementNumber && (
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                            Advt {row.advertisementNumber}
                          </span>
                        )}

                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', background: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                          {row.category}
                        </span>

                        {ak && (
                          <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                            ✓ Key Available
                          </span>
                        )}
                      </div>

                      {isActiveExam && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '11px',
                          fontWeight: 800,
                          background: '#DCFCE7',
                          border: '1px solid #86EFAC',
                          color: '#15803D',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          boxShadow: '0 1px 3px rgba(22, 163, 74, 0.2)'
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#16A34A',
                            animation: 'livePulseDot 1.5s infinite ease-in-out'
                          }} />
                          Currently Viewing
                        </span>
                      )}
                    </div>

                    {/* Exam Title (Clickable) */}
                    <h3
                      onClick={() => handleSelectExam(row.id, 'qp', true)}
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '14.5px',
                        fontWeight: 700,
                        color: '#1E293B',
                        margin: '0 0 8px 0',
                        lineHeight: 1.4,
                        cursor: 'pointer'
                      }}
                      title="Tap to read this paper in reader"
                    >
                      {row.title}
                    </h3>

                    {/* Prominent Paper Name Pill (Tap to Read) */}
                    <div style={{ marginBottom: '14px' }}>
                      <button
                        type="button"
                        onClick={() => handleSelectExam(row.id, 'qp', true)}
                        style={{
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: (isActiveExam && activeDocType === 'qp') ? '#EA580C' : '#FFF7ED',
                          color: (isActiveExam && activeDocType === 'qp') ? '#FFFFFF' : '#C2410C',
                          border: (isActiveExam && activeDocType === 'qp') ? '1.5px solid #EA580C' : '1px solid #FFEDD5',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '13px',
                          textAlign: 'left',
                          boxShadow: (isActiveExam && activeDocType === 'qp') ? '0 2px 8px rgba(234, 88, 12, 0.25)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                        title="Tap to read this paper in reader"
                      >
                        <span>📄 {row.paperName}</span>
                        {row.paperNameMr && (
                          <span style={{
                            fontSize: '12px',
                            color: (isActiveExam && activeDocType === 'qp') ? '#FED7AA' : '#64748B',
                            fontWeight: 500
                          }}>
                            {row.paperNameMr}
                          </span>
                        )}
                        {isActiveExam && activeDocType === 'qp' && (
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: 800,
                            background: 'rgba(255,255,255,0.25)',
                            color: '#FFFFFF',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            marginLeft: '4px'
                          }}>
                            📖 Currently Reading
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Mobile Action Buttons Bar — Direct 1-Tap PDF View + Download + Reader Jump */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      paddingTop: '12px',
                      borderTop: '1px solid #F1F5F9'
                    }}>
                      <div className="mpsc-mobile-actions-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {/* Direct Question Paper View Button — 1-tap view without asking to click again */}
                        {qp && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <a
                              href={qp.localPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleSelectExam(row.id, 'qp', false)}
                              style={{
                                background: (isActiveExam && activeDocType === 'qp') ? '#C2410C' : '#EA580C',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                boxShadow: '0 2px 5px rgba(234, 88, 12, 0.25)',
                                minHeight: '38px'
                              }}
                              title="View official Question Paper PDF directly"
                            >
                              <span>📄</span> View Paper (PDF)
                            </a>
                            <a
                              href={qp.localPath}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#4B5563',
                                background: '#FFFFFF',
                                border: '1px solid #D1D5DB',
                                padding: '7px 9px',
                                borderRadius: '7px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                minHeight: '38px'
                              }}
                              title="Download PDF"
                            >
                              <span>⬇️</span> {qp.sizeFormatted || 'PDF'}
                            </a>
                          </div>
                        )}

                        {/* Direct Answer Key View Button — 1-tap view without asking to click again */}
                        {ak ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <a
                              href={ak.localPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleSelectExam(row.id, 'ak', false)}
                              style={{
                                background: (isActiveExam && activeDocType === 'ak') ? '#15803D' : '#059669',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                boxShadow: '0 2px 5px rgba(5, 150, 105, 0.25)',
                                minHeight: '38px'
                              }}
                              title="View official Answer Key PDF directly"
                            >
                              <span>✓</span> View Key (PDF)
                            </a>
                            <a
                              href={ak.localPath}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#4B5563',
                                background: '#FFFFFF',
                                border: '1px solid #D1D5DB',
                                padding: '7px 9px',
                                borderRadius: '7px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                minHeight: '38px'
                              }}
                              title="Download Answer Key PDF"
                            >
                              <span>⬇️</span> {ak.sizeFormatted || 'PDF'}
                            </a>
                          </div>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11.5px',
                            color: '#6B7280',
                            background: '#F3F4F6',
                            padding: '6px 10px',
                            borderRadius: '7px'
                          }}>
                            <span>⏳</span> Key Pending
                          </span>
                        )}
                      </div>

                      {/* Workspace In-Browser Study Switcher */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleSelectExam(row.id, qp ? 'qp' : 'ak', true)}
                          style={{
                            width: '100%',
                            background: isActiveExam ? '#FFF7ED' : '#F8FAFC',
                            border: isActiveExam ? '1.5px solid #EA580C' : '1px solid #D1D5DB',
                            color: isActiveExam ? '#EA580C' : '#334155',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            minHeight: '38px',
                            transition: 'all 0.15s ease'
                          }}
                          title="Open in Study Workspace at top"
                        >
                          <span>⚡</span> {isActiveExam ? 'Currently Viewing (Jump to Reader ↑)' : 'Open in Study Workspace ↑'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Universal Numbered Pagination ── */}
            {totalPages > 1 && (
              <div style={{
                marginTop: '16px',
                marginBottom: '32px',
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E7EB',
                padding: '8px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {/* ── SECTION 1: 15-Year Subject-wise PYQ Practice Bank ── */}
        <section style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '28px 24px',
          marginBottom: '32px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '20px' }}>🎯</span>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  विषयवार १५-वर्षीय PYQ प्रश्नसंच (15-Year Subject-wise PYQ Bank)
                </h2>
                <span style={{ fontSize: '11px', fontWeight: 700, background: '#FFF7ED', color: '#EA580C', border: '1px solid #FED7AA', padding: '2px 8px', borderRadius: '999px' }}>
                  ९,०००+ प्रश्न
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B', lineHeight: 1.5 }}>
                MPSC राज्यसेवा, संयुक्त गट ब/क, तलाठी व पोलीस भरतीमध्ये विचारलेले मागील १५ वर्षांचे प्रश्न विषयनिहाय सोडवा. अचूक उत्तर, संदर्भ व स्पष्टीकरणासह.
              </p>
            </div>
            <Link
              href="/pyq"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FFF7ED',
                color: '#EA580C',
                border: '1.5px solid #FDBA74',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>सर्व विषयवार बँक पहा →</span>
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '14px'
          }}>
            {SUBJECT_PYQ_CARDS.map(sub => (
              <div
                key={sub.slug}
                className="mpsc-hub-card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{sub.icon}</span>
                      <strong style={{ fontSize: '14.5px', color: '#1E293B', fontFamily: 'Outfit, sans-serif' }}>
                        {sub.title}
                      </strong>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: sub.bg,
                      color: sub.color,
                      border: `1px solid ${sub.border}`,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap'
                    }}>
                      {sub.count}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                    📌 <strong>महत्त्वाचे घटक:</strong> {sub.topics}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Link
                    href={`/pyq/${sub.slug}`}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      background: '#F8FAFC',
                      color: '#0F172A',
                      border: '1px solid #CBD5E1',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    विषयवार प्रश्न सोडवा →
                  </Link>
                  <Link
                    href={`/pyq?subject=${sub.subject}`}
                    style={{
                      background: '#FFF7ED',
                      color: '#EA580C',
                      border: '1px solid #FED7AA',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                    title="Search in PYQ Bank"
                  >
                    🔍 शोध
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: Free Online CBT Mock Tests 2026 ── */}
        <section style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '28px 24px',
          marginBottom: '32px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '20px' }}>⚡</span>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  मोफत MPSC व स्पर्धा परीक्षा ऑनलाईन मॉक टेस्ट्स २०२६ (Free CBT Mock Tests)
                </h2>
                <span style={{ fontSize: '11px', fontWeight: 700, background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '999px' }}>
                  100% Free
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B', lineHeight: 1.5 }}>
                MPSC आणि TCS पॅटर्नवर आधारित १०० प्रश्नांचे संपूर्ण मॉक पेपर्स व २० प्रश्नांचे स्पीड ड्रिल्स — अधिकृत नेगेटिव्ह मार्किंग, श्रेणीनिहाय कट-ऑफ व राज्यस्तरीय रँकसह.
              </p>
            </div>
            <Link
              href="/mock-tests"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#EA580C',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(234, 88, 12, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <span>सर्व ऑनलाईन मॉक टेस्ट्स पहा →</span>
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {MOCK_TEST_CARDS.map(test => (
              <div
                key={test.slug}
                className="mpsc-hub-card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      background: test.badgeBg,
                      color: test.badgeColor,
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {test.badge}
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B' }}>
                      🏆 {test.marks}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: '0 0 8px 0',
                    fontFamily: 'Outfit, sans-serif',
                    lineHeight: 1.4
                  }}>
                    {test.icon} {test.title}
                  </h3>

                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: '0 0 14px 0', lineHeight: 1.45 }}>
                    {test.desc}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '12px',
                    color: '#475569',
                    background: '#F8FAFC',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '14px',
                    fontWeight: 600,
                    flexWrap: 'wrap'
                  }}>
                    <span>⏱️ {test.duration}</span>
                    <span>📝 {test.qCount}</span>
                    <span style={{ color: test.negative !== 'No Negative' ? '#DC2626' : '#059669' }}>
                      ⚠️ {test.negative}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/mock-tests/${test.slug}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  मोफत टेस्ट सुरू करा (Start CBT) →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: MPSC 2026 Integrated Preparation Tools Hub ── */}
        <section style={{
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
          border: '1.5px solid #FED7AA',
          borderRadius: '16px',
          padding: '28px 24px',
          marginBottom: '36px',
          boxShadow: '0 4px 14px rgba(234, 88, 12, 0.08)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '20px' }}>🚀</span>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#9A3412', margin: 0 }}>
                MPSC २०२६ संपूर्ण तयारी हब (Integrated Preparation Tools)
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#7C2D12', lineHeight: 1.5 }}>
              प्रश्नपत्रिका व उत्तरतालिका वाचल्यानंतर पुढील टप्प्यांच्या अचूक तयारीसाठी खालील मोफत टूल्स वापरा:
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '14px'
          }}>
            {PREP_TOOL_CARDS.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="mpsc-hub-card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #FDBA74',
                  borderRadius: '12px',
                  padding: '16px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(234, 88, 12, 0.04)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{tool.icon}</span>
                      <strong style={{ fontSize: '14px', color: '#9A3412', fontFamily: 'Outfit, sans-serif' }}>
                        {tool.title}
                      </strong>
                    </div>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      background: '#FFF7ED',
                      color: '#EA580C',
                      border: '1px solid #FFEDD5',
                      padding: '2px 7px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap'
                    }}>
                      {tool.badge}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                    {tool.desc}
                  </p>
                </div>

                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#EA580C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>एक्सप्लोर करा (Open Tool)</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
