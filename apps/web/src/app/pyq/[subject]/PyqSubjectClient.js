'use client'

// ============================================================
// app/pyq/[subject]/PyqSubjectClient.js — Interactive Subject Question View
// ExamUdaan | Instant answer reveal, exam filters & explanation drawers
// ============================================================

import { useState, useMemo } from 'react'
import Link from 'next/link'

export default function PyqSubjectClient({ subjectInfo, questions, allSubjects }) {
  const [selectedExam, setSelectedExam] = useState('All')
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [revealedSolutions, setRevealedSolutions] = useState({})
  const [searchFilter, setSearchFilter] = useState('')

  // Unique exams present in this subject
  const availableExams = useMemo(() => {
    const set = new Set()
    questions.forEach(q => {
      if (q.exam) {
        // extract primary exam name
        if (q.exam.includes('MPSC')) set.add('MPSC')
        else if (q.exam.includes('Police')) set.add('Police Bharti')
        else if (q.exam.includes('Talathi')) set.add('Talathi')
        else if (q.exam.includes('SSC')) set.add('SSC')
        else if (q.exam.includes('Bank') || q.exam.includes('IBPS')) set.add('Banking')
        else if (q.exam.includes('ZP')) set.add('ZP Bharti')
        else set.add(q.exam.split('&')[0].trim())
      }
    })
    return ['All', ...Array.from(set)]
  }, [questions])

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Exam filter
      if (selectedExam !== 'All') {
        if (!q.exam.toLowerCase().includes(selectedExam.toLowerCase().replace(' bharti', ''))) {
          return false
        }
      }
      // Text search
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase()
        const matchQ = q.question?.toLowerCase().includes(query)
        const matchTopic = q.topic?.toLowerCase().includes(query)
        const matchTags = q.tags?.some(t => t.toLowerCase().includes(query))
        if (!matchQ && !matchTopic && !matchTags) return false
      }
      return true
    })
  }, [questions, selectedExam, searchFilter])

  const handleSelectOption = (qId, optionKey) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionKey }))
    setRevealedSolutions(prev => ({ ...prev, [qId]: true }))
  }

  const toggleSolution = (qId) => {
    setRevealedSolutions(prev => ({ ...prev, [qId]: !prev[qId] }))
  }

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto' }}>

      {/* Subject Filter Bar */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        {/* Search within subject */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <input
            type="text"
            placeholder={`Search ${subjectInfo.name} questions (e.g. topic, keyword)...`}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Exam Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Exam:</span>
          {availableExams.map(ex => (
            <button
              key={ex}
              onClick={() => setSelectedExam(ex)}
              style={{
                background: selectedExam === ex ? '#EA580C' : '#F3F4F6',
                color: selectedExam === ex ? '#FFFFFF' : '#374151',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Showing count indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#4B5563' }}>
          Showing <strong>{filteredQuestions.length}</strong> solved questions for <strong>{subjectInfo.name}</strong>
        </p>
        <Link
          href="/pyq"
          style={{ fontSize: '13px', color: '#EA580C', fontWeight: 600, textDecoration: 'none' }}
        >
          View Full 1,100+ Question Bank ➔
        </Link>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredQuestions.map((q, idx) => {
          const isRevealed = revealedSolutions[q.id]
          const userChoice = selectedAnswers[q.id]
          const isCorrect = userChoice && userChoice === q.correct

          return (
            <article
              key={q.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                padding: '20px 22px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              {/* Question Header Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: '#FFF7ED',
                    color: '#C2410C',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    Q{idx + 1}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                    {q.exam} ({q.year})
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '11px', background: '#F3F4F6', color: '#4B5563', padding: '2px 8px', borderRadius: '4px' }}>
                    {q.topic}
                  </span>
                  {q.difficulty && (
                    <span style={{
                      fontSize: '11px',
                      background: q.difficulty === 'Hard' ? '#FEE2E2' : (q.difficulty === 'Easy' ? '#DCFCE7' : '#FEF3C7'),
                      color: q.difficulty === 'Hard' ? '#991B1B' : (q.difficulty === 'Easy' ? '#166534' : '#92400E'),
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      {q.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <h3 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#111827',
                margin: '0 0 16px 0',
                lineHeight: 1.5
              }}>
                {q.question}
              </h3>

              {/* Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                {Object.entries(q.options || {}).map(([optKey, optText]) => {
                  let optBg = '#FAFAFA'
                  let optBorder = '#E5E7EB'
                  let optColor = '#1F2937'

                  if (isRevealed) {
                    if (optKey === q.correct) {
                      optBg = '#DCFCE7'
                      optBorder = '#86EFAC'
                      optColor = '#14532D'
                    } else if (userChoice === optKey) {
                      optBg = '#FEE2E2'
                      optBorder = '#FCA5A5'
                      optColor = '#7F1D1D'
                    }
                  } else if (userChoice === optKey) {
                    optBg = '#EFF6FF'
                    optBorder = '#93C5FD'
                    optColor = '#1E3A8A'
                  }

                  return (
                    <button
                      key={optKey}
                      onClick={() => handleSelectOption(q.id, optKey)}
                      style={{
                        textAlign: 'left',
                        background: optBg,
                        border: `1.5px solid ${optBorder}`,
                        borderRadius: '8px',
                        padding: '10px 14px',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                        color: optColor,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isRevealed && optKey === q.correct ? '#16A34A' : '#E5E7EB',
                        color: isRevealed && optKey === q.correct ? '#FFFFFF' : '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        {optKey}
                      </span>
                      <span style={{ flex: 1, lineHeight: 1.4 }}>{optText}</span>
                    </button>
                  )
                })}
              </div>

              {/* Action & Solution Tray */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #F3F4F6' }}>
                <button
                  onClick={() => toggleSolution(q.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EA580C',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  {isRevealed ? 'Hide Explanation ▲' : 'Show Answer & Explanation ▼'}
                </button>

                {userChoice && (
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isCorrect ? '#16A34A' : '#DC2626'
                  }}>
                    {isCorrect ? '✓ Correct Answer' : `✗ Selected ${userChoice} (Correct: ${q.correct})`}
                  </span>
                )}
              </div>

              {/* Explanation Box */}
              {isRevealed && (
                <div style={{
                  marginTop: '12px',
                  background: '#FFF7ED',
                  border: '1px solid #FED7AA',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  color: '#7C2D12',
                  lineHeight: 1.5
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '4px', color: '#9A3412' }}>
                    Correct Answer: Option ({q.correct})
                  </div>
                  <div>{q.explanation || 'No detailed explanation provided for this question.'}</div>
                </div>
              )}
            </article>
          )
        })}
      </div>

      {/* Switch to Other Subject Question Banks */}
      <section style={{ marginTop: '48px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '24px' }}>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 14px 0' }}>
          Explore Other Subject Question Libraries
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {allSubjects.filter(s => s.slug !== subjectInfo.slug).map(s => (
            <Link
              key={s.slug}
              href={`/pyq/${s.slug}`}
              style={{
                background: '#FAFAFA',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '12px 14px',
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>{s.name}</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>{s.nameMr}</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#EA580C', background: '#FFF7ED', padding: '2px 8px', borderRadius: '4px' }}>
                {s.count} Qs
              </span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
