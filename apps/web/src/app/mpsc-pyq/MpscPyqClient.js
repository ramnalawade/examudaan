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

        {/* ── Category Quick Navigation Bar (Click loads paper in workspace + scrolls) ── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '12px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                className="mpsc-category-btn"
                onClick={() => handleSelectCategory(cat.id)}
                style={{
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? '2px solid #EA580C' : '1px solid #E5E7EB',
                  background: isSelected ? '#FFF7ED' : '#FFFFFF',
                  color: isSelected ? '#EA580C' : '#374151',
                  boxShadow: isSelected ? '0 2px 8px rgba(234, 88, 12, 0.2)' : 'none',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                }}
                title={`Filter by ${cat.label} and load in study workspace`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  background: isSelected ? '#EA580C' : '#F3F4F6',
                  color: isSelected ? '#FFFFFF' : '#6B7280',
                  fontWeight: 700
                }}>
                  {cat.count}
                </span>
                {isSelected && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#EA580C',
                    display: 'inline-block',
                    animation: 'livePulseDot 1.5s infinite ease-in-out'
                  }} />
                )}
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

        {/* ── Related Prep Hub Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
          border: '1px solid #FED7AA',
          borderRadius: '14px',
          padding: '24px 28px',
          marginBottom: '36px'
        }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 800, color: '#9A3412', margin: '0 0 8px 0' }}>
            MPSC 2026 परीक्षेच्या संपूर्ण तयारीसाठी मोफत टूल्स:
          </h3>
          <p style={{ fontSize: '14px', color: '#7C2D12', margin: '0 0 16px 0', lineHeight: 1.5 }}>
            प्रश्नपत्रिका वाचल्यानंतर मोफत मॉक टेस्ट, चालू घडामोडी आणि मागील 10 वर्षांच्या कट-ऑफचे विश्लेषण पहा.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { href: '/syllabus/mpsc-state-services', label: '📚 Rajyaseva Syllabus 2026' },
              { href: '/syllabus/mpsc-combined', label: '📚 MPSC Combined Syllabus 2026' },
              { href: '/mock-tests', label: '⏱️ Free Full Mock Tests' },
              { href: '/current-affairs', label: '📰 Daily Current Affairs' },
              { href: '/pyq', label: '🎯 15-Yr Subject-wise PYQ Bank' },
              { href: '/cutoffs', label: '📊 10-Yr MPSC Cutoffs' },
              { href: '/score-calculator', label: '🧮 Response Sheet Score Calc' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #FDBA74',
                  color: '#9A3412',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
