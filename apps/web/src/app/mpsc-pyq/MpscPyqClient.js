// ============================================================
// app/mpsc-pyq/MpscPyqClient.js — Interactive Study Hub
// Question Papers & Answer Keys with Clear Paper Names & Fast Toggle
// 100% Sourced from mpsc.gov.in (Maharashtra Public Service Commission)
// ============================================================

'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import OfficialPdfViewer from '@/components/OfficialPdfViewer'

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
  const workspaceRef = useRef(null)

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

    return { totalExams, totalQps, totalAks, withKey, y2026, y2025, y2024 }
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

  // Switch to exam and document type in workspace
  function handleSelectExam(examId, docType = 'qp') {
    setActiveExamId(examId)
    setActiveDocType(docType)
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
          <span style={{ color: '#1F2937', fontWeight: 700 }}>MPSC Question Papers & Answer Keys (2024–2026)</span>
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 0' }}>
        {/* ── Hero Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '16px',
          padding: '30px 28px',
          color: '#FFFFFF',
          marginBottom: '24px',
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
            MPSC Question Papers & Answer Keys (2024–2026)
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

          {/* Accurate Statistics Row */}
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
            <span style={{ background: '#EA580C', color: '#FFFFFF', padding: '4px 12px', borderRadius: '6px' }}>
              📊 {stats.totalExams} Exam Papers
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#F1F5F9', padding: '4px 10px', borderRadius: '6px' }}>
              📄 {stats.totalQps} Question Papers
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#F1F5F9', padding: '4px 10px', borderRadius: '6px' }}>
              ✓ {stats.totalAks} Answer Keys
            </span>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6EE7B7', padding: '4px 10px', borderRadius: '6px' }}>
              ⚡ {stats.withKey} Paired Q&A Sets
            </span>
            <span style={{ color: '#94A3B8', fontSize: '12.5px', marginLeft: 'auto' }}>
              • 2026 ({stats.y2026}) • 2025 ({stats.y2025}) • 2024 ({stats.y2024})
            </span>
          </div>
        </div>

        {/* ── Category Quick Navigation Bar ── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px',
          scrollbarWidth: 'none'
        }}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isSelected ? 700 : 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid #EA580C' : '1px solid #E5E7EB',
                  background: isSelected ? '#FFF7ED' : '#FFFFFF',
                  color: isSelected ? '#EA580C' : '#374151',
                  boxShadow: isSelected ? '0 2px 6px rgba(234, 88, 12, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '999px',
                  background: isSelected ? '#EA580C' : '#F3F4F6',
                  color: isSelected ? '#FFFFFF' : '#6B7280',
                  fontWeight: 700
                }}>
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>

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
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedYear(tab.id)}
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
                  onClick={() => setSelectedKeyFilter(tab.id)}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '14px', color: '#4B5563' }}>
            Showing <strong>{filteredRows.length}</strong> exam papers (Question Papers & Answer Keys paired in 1 Row)
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🏛️</span> Official Source: <strong>mpsc.gov.in</strong>
          </div>
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
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            marginBottom: '40px'
          }}>
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
              <div>Question Paper</div>
              <div>Official Answer Key</div>
              <div style={{ textAlign: 'center' }}>In-Browser Study</div>
            </div>

            {/* Exam Rows */}
            {filteredRows.map((row, idx) => {
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

                    <h3 style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '14.5px',
                      fontWeight: 700,
                      color: '#1E293B',
                      margin: '0 0 3px 0',
                      lineHeight: 1.35
                    }}>
                      {row.title}
                    </h3>

                    {/* Prominent Paper Name Highlight */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: '#C2410C',
                        background: '#FFF7ED',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        border: '1px solid #FFEDD5'
                      }}>
                        📄 {row.paperName}
                      </span>
                      {row.paperNameMr && (
                        <span style={{ fontSize: '12px', color: '#64748B' }}>
                          {row.paperNameMr}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Official Question Paper */}
                  <div>
                    {qp ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleSelectExam(row.id, 'qp')}
                          style={{
                            background: (isActiveExam && activeDocType === 'qp') ? '#C2410C' : '#EA580C',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '7px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 1px 3px rgba(234, 88, 12, 0.2)'
                          }}
                          title="Read Question Paper in Workspace"
                        >
                          <span>👁️</span> Question Paper
                        </button>

                        <a
                          href={qp.localPath}
                          download
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

                  {/* Column 3: Official Answer Key */}
                  <div>
                    {ak ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleSelectExam(row.id, 'ak')}
                          style={{
                            background: (isActiveExam && activeDocType === 'ak') ? '#15803D' : '#059669',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '7px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 1px 3px rgba(5, 150, 105, 0.2)'
                          }}
                          title="Read Official Answer Key in Workspace"
                        >
                          <span>✓</span> Answer Key
                        </button>

                        <a
                          href={ak.localPath}
                          download
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
                    <button
                      onClick={() => handleSelectExam(row.id, qp ? 'qp' : 'ak')}
                      style={{
                        background: isActiveExam ? '#EA580C' : 'transparent',
                        border: '1.5px solid #EA580C',
                        color: isActiveExam ? '#FFFFFF' : '#EA580C',
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
                      <span>⚡</span> {isActiveExam ? 'Active Now' : 'Study'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
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
