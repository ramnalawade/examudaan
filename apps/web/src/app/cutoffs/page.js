// ============================================================
// cutoffs/page.js — 10-Year Historical Cutoff & Trend Explorer
// ExamUdaan.in | Benchmark Cutoffs for MPSC, Police, Talathi & SSC
// Fully responsive across Mobile, Tablet, Laptop, and Desktop
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HISTORICAL_CUTOFFS } from '../../lib/cutoffsData'
import styles from './cutoffs.module.css'

export default function CutoffsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExam, setSelectedExam] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [highlightCat, setHighlightCat] = useState('open')

  const examsList = ['all', ...new Set(HISTORICAL_CUTOFFS.map(c => c.exam))]
  const yearsList = ['all', ...Array.from(new Set(HISTORICAL_CUTOFFS.map(c => c.year))).sort((a, b) => b.localeCompare(a))]

  const filteredCutoffs = HISTORICAL_CUTOFFS.filter(item => {
    if (selectedExam !== 'all' && item.exam !== selectedExam) return false
    if (selectedYear !== 'all' && item.year !== selectedYear) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = item.exam.toLowerCase().includes(q)
      const matchPost = item.post.toLowerCase().includes(q)
      const matchNotes = (item.notes || '').toLowerCase().includes(q)
      if (!matchName && !matchPost && !matchNotes) return false
    }
    return true
  })

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--secondary)' }}>
          <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>10-Year Historical Cutoff Explorer</span>
        </div>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.badge}>
            <span>📊 Official Cutoff Archive</span>
          </div>
          <h1 className={styles.title}>10-Year Government Exam Cutoff Explorer</h1>
          <p className={styles.subtitle}>
            Explore historical category cutoffs (Open, OBC, EWS, SEBC, SC, ST) across MPSC Rajyaseva, PSI/STI/ASO, TCS Talathi, Police Bharti, and SSC CGL to benchmark your target score.
          </p>
        </div>

        {/* Filter Card */}
        <div className={styles.filterCard}>
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.label}>Search Exam / District / Post</label>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="e.g. Pune, PSI, Talathi, Rajyaseva..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.label}>Filter by Exam</label>
              <select
                className={styles.select}
                value={selectedExam}
                onChange={e => setSelectedExam(e.target.value)}
              >
                <option value="all">All Examinations</option>
                {examsList.filter(e => e !== 'all').map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.label}>Exam Year</label>
              <select
                className={styles.select}
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
              >
                <option value="all">All Years (2015–2024)</option>
                {yearsList.filter(y => y !== 'all').map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Highlight Category Chips */}
          <div className={styles.categoryBar}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Highlight Category:</span>
            {['open', 'obc', 'ews', 'sebc', 'sc', 'st', 'women'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`${styles.catChip} ${highlightCat === cat ? styles.catChipActive : ''}`}
                onClick={() => setHighlightCat(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className={styles.cardsList}>
          {filteredCutoffs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 16 }}>
              <p style={{ color: '#64748b', fontSize: 15 }}>No historical cutoffs found matching your filters. Try clearing the search query.</p>
            </div>
          ) : (
            filteredCutoffs.map(item => {
              const trendClass = item.trend === 'up'
                ? styles.trendTagUp
                : item.trend === 'down'
                ? styles.trendTagDown
                : styles.trendTagStable

              const trendLabel = item.trend === 'up'
                ? '↗ Rising Competition'
                : item.trend === 'down'
                ? '↘ Relaxed (High Vacancies)'
                : '↔ Stable Trend'

              const targetScore = typeof item.cutoffs[highlightCat] === 'number'
                ? +(item.cutoffs[highlightCat] * 1.05).toFixed(1)
                : 'N/A'

              return (
                <div key={item.id} className={styles.cutoffCard}>
                  <div className={styles.cardTop}>
                    <div>
                      <h2 className={styles.examTitle}>{item.exam}</h2>
                      <p className={styles.postSubtitle}>{item.post} • {item.vacancies} Vacancies Announced</p>
                    </div>

                    <div className={styles.yearTrendPill}>
                      <span className={styles.yearTag}>{item.year}</span>
                      <span className={trendClass}>{trendLabel}</span>
                    </div>
                  </div>

                  {/* Marks Grid */}
                  <div className={styles.marksGrid}>
                    {Object.entries(item.cutoffs).map(([catKey, mark]) => {
                      const isHighlighted = catKey === highlightCat
                      return (
                        <div
                          key={catKey}
                          className={`${styles.markBox} ${isHighlighted ? styles.markBoxHighlight : ''}`}
                          style={{ border: isHighlighted ? '1.5px solid var(--primary)' : 'none' }}
                        >
                          <div className={styles.markCategory} style={{ color: isHighlighted ? 'var(--primary)' : '#64748b' }}>
                            {catKey.replace('_', ' ')}
                          </div>
                          <div className={styles.markVal} style={{ color: isHighlighted ? 'var(--primary)' : '#0f172a' }}>
                            {mark}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Footer details & Recommended target */}
                  <div className={styles.cardFooter}>
                    <div>
                      <strong>Safe Target for 2025-26 ({highlightCat.toUpperCase()}): </strong>
                      <span style={{ color: '#ea580c', fontWeight: 800 }}>{targetScore} / {item.totalMarks} Marks</span>
                      <span style={{ margin: '0 8px' }}>|</span>
                      <span>{item.notes}</span>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `📊 *Historical Cutoff for ${item.post} (${item.year})*\n\nExam: ${item.exam}\nOpen: ${item.cutoffs.open} | OBC: ${item.cutoffs.obc} | EWS: ${item.cutoffs.ews} | SC: ${item.cutoffs.sc} | ST: ${item.cutoffs.st}\n\nExplore complete 10-year cutoff benchmarks here: https://examudaan.in/cutoffs`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>share</span>
                      Share Cutoff
                    </a>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* ── Related Prep & Practice Hub ── */}
        <div style={{
          marginTop: '40px',
          background: '#ffffff',
          border: '1px solid var(--outline-variant)',
          borderRadius: '16px',
          padding: '28px 24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Cutoff Benchmark Next Steps
            </span>
            <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '22px', fontWeight: 800, color: 'var(--on-surface)', margin: '4px 0 6px' }}>
              Hit Your Target Cutoff with Authentic Practice
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--secondary)', margin: 0 }}>
              Use our official papers, mock tests, and topic question bank to reach the safe cutoff marks shown above.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <Link
              href="/mpsc-pyq"
              style={{
                background: '#fff',
                border: '1.5px solid #fed7aa',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(234,88,12,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '22px' }}>📄</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa', padding: '2px 7px', borderRadius: '999px' }}>
                    841 Papers
                  </span>
                </div>
                <strong style={{ fontSize: '15px', color: '#0f172a', fontFamily: 'var(--font-outfit)', display: 'block', marginBottom: '4px' }}>
                  Official MPSC Papers & Keys
                </strong>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Read official question papers & final keys from mpsc.gov.in in-browser.
                </p>
              </div>
              <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#ea580c' }}>
                Open MPSC Papers →
              </span>
            </Link>

            <Link
              href="/mock-tests"
              style={{
                background: '#fff',
                border: '1px solid var(--outline-variant)',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '22px' }}>⏱️</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 7px', borderRadius: '999px' }}>
                    100% Free
                  </span>
                </div>
                <strong style={{ fontSize: '15px', color: '#0f172a', fontFamily: 'var(--font-outfit)', display: 'block', marginBottom: '4px' }}>
                  Free Online CBT Mock Tests
                </strong>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Take authentic 100-Q timed mocks with state rank to test your cutoff readiness.
                </p>
              </div>
              <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#047857' }}>
                Start Free Test →
              </span>
            </Link>

            <Link
              href="/pyq"
              style={{
                background: '#fff',
                border: '1px solid var(--outline-variant)',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '22px' }}>🎯</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe', padding: '2px 7px', borderRadius: '999px' }}>
                    9,000+ MCQs
                  </span>
                </div>
                <strong style={{ fontSize: '15px', color: '#0f172a', fontFamily: 'var(--font-outfit)', display: 'block', marginBottom: '4px' }}>
                  15-Year Topic PYQ Bank
                </strong>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Subject-wise practice across Polity, Geography, History, Economy & Science.
                </p>
              </div>
              <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#6d28d9' }}>
                Practice by Topic →
              </span>
            </Link>

            <Link
              href="/score-calculator"
              style={{
                background: '#fff',
                border: '1px solid var(--outline-variant)',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '22px' }}>🧮</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 7px', borderRadius: '999px' }}>
                    Instant
                  </span>
                </div>
                <strong style={{ fontSize: '15px', color: '#0f172a', fontFamily: 'var(--font-outfit)', display: 'block', marginBottom: '4px' }}>
                  Score & Negative Marks Calc
                </strong>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Check response sheet score after deducting official 1/4th negative marks.
                </p>
              </div>
              <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#1d4ed8' }}>
                Calculate Score →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
