'use client'
// ============================================================
// components/SyllabusBreakdown.js — AI-generated syllabus topics
// ExamUdaan | Shows subject-wise breakdown with weightages
// ============================================================

import { useState } from 'react'

export default function SyllabusBreakdown({ syllabusData }) {
  const [expanded, setExpanded] = useState(null)

  if (!syllabusData || !syllabusData.subjects || syllabusData.subjects.length === 0) {
    return null
  }

  return (
    <div className="jobdet-section">
      <h2 className="jobdet-sectionTitle" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        Syllabus Breakdown
        <span style={{
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--accent-light)',
          color: 'var(--accent-text)',
          fontWeight: 600,
        }}>
          AI Generated
        </span>
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {syllabusData.subjects.map((subject, i) => (
          <div
            key={i}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s',
            }}
          >
            {/* Subject header — clickable accordion */}
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              id={`syllabus-subject-${i}`}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: expanded === i ? 'var(--bg-tint)' : 'var(--bg-card)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '14px' }}>
                {subject.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {subject.weightage && (
                  <span style={{
                    fontSize: '12px',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent)',
                    color: 'white',
                    fontWeight: 700,
                  }}>
                    {subject.weightage}
                  </span>
                )}
                <span style={{ color: 'var(--text-muted)', fontSize: '16px', transition: 'transform 0.2s', transform: expanded === i ? 'rotate(180deg)' : 'rotate(0)' }}>
                  ▾
                </span>
              </div>
            </button>

            {/* Topics list — expanded */}
            {expanded === i && subject.topics && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {subject.topics.map((topic, j) => (
                    <span
                      key={j}
                      style={{
                        fontSize: '12px',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-tint)',
                        color: 'var(--text-body)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
