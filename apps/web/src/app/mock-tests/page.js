// ============================================================
// app/mock-tests/page.js — Mock Test listing page
// ExamUdaan.in — Browse official 100-Q mocks & sectional drills
// ============================================================
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MOCK_TESTS } from '@/lib/mockTestsData'
import styles from './mockTests.module.css'

const EXAM_FILTERS = ['All', 'MPSC', 'Police Bharti', 'Talathi Bharti', 'SSC', 'IBPS', 'Banking', 'UPSC']
const DIFFICULTY_COLORS = { Easy: '#059669', Medium: '#d97706', Hard: '#dc2626' }

export default function MockTestsPage() {
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'full' | 'sectional'
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredTests = useMemo(() => {
    return MOCK_TESTS.filter(t => {
      // Tab filter
      if (activeTab === 'full' && !t.isFullMock) return false
      if (activeTab === 'sectional' && t.isFullMock) return false

      // Exam body filter
      if (activeFilter !== 'All') {
        const examMatch = t.examType.toLowerCase().includes(activeFilter.toLowerCase())
        if (!examMatch) return false
      }
      return true
    })
  }, [activeTab, activeFilter])

  const totalQuestions = MOCK_TESTS.reduce((a, t) => a + (t.questions?.length || t.totalQuestions), 0)
  const fullMocksCount = MOCK_TESTS.filter(t => t.isFullMock).length
  const sectionalCount = MOCK_TESTS.filter(t => !t.isFullMock).length

  return (
    <main className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroLabel}>🎯 Authentic CBT Examination Simulation</span>
            <h1>Government Exam Authentic Mock Tests 2026</h1>
            <p>
              Real 100-question blueprints for Maharashtra Talathi, Police Bharti, MPSC Combined, and SSC CGL.
              Experience authentic TCS / MPSC pattern computer-based tests with <strong>official section weightages, negative marking, category cutoffs, and simulated state rank</strong>. No login required.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}><strong>{fullMocksCount}</strong><span>100-Q Full Mocks</span></div>
              <div className={styles.stat}><strong>{totalQuestions}+</strong><span>Real Exam MCQs</span></div>
              <div className={styles.stat}><strong>{sectionalCount}</strong><span>Sectional Speed Drills</span></div>
              <div className={styles.stat}><strong>100% Free</strong><span>State Rank Analysis</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Test Format Tabs (Full Mocks vs Sectional) ── */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--outline-variant)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Test Format:
          </span>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'all' ? '1px solid var(--primary)' : '1px solid #cbd5e1',
              background: activeTab === 'all' ? 'var(--primary)' : '#fff',
              color: activeTab === 'all' ? '#fff' : '#475569',
              transition: 'all 0.15s ease'
            }}
          >
            All Practice Tests ({MOCK_TESTS.length})
          </button>
          <button
            onClick={() => setActiveTab('full')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'full' ? '1px solid #059669' : '1px solid #cbd5e1',
              background: activeTab === 'full' ? '#059669' : '#fff',
              color: activeTab === 'full' ? '#fff' : '#475569',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>💯 Full-Length Exams (100 Qs)</span>
            <span style={{ background: activeTab === 'full' ? 'rgba(255,255,255,0.25)' : '#ecfdf5', color: activeTab === 'full' ? '#fff' : '#047857', padding: '1px 8px', borderRadius: '10px', fontSize: '11px' }}>
              {fullMocksCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('sectional')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeTab === 'sectional' ? '1px solid #7c3aed' : '1px solid #cbd5e1',
              background: activeTab === 'sectional' ? '#7c3aed' : '#fff',
              color: activeTab === 'sectional' ? '#fff' : '#475569',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⚡ Sectional Speed Drills (20–25 Qs)</span>
            <span style={{ background: activeTab === 'sectional' ? 'rgba(255,255,255,0.25)' : '#f5f3ff', color: activeTab === 'sectional' ? '#fff' : '#7c3aed', padding: '1px 8px', borderRadius: '10px', fontSize: '11px' }}>
              {sectionalCount}
            </span>
          </button>
        </div>
      </section>

      {/* ── Filter Pills by Exam ── */}
      <section style={{ background: '#f8fafc', borderBottom: '1px solid var(--outline-variant)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '6px' }}>
            Filter by Exam:
          </span>
          {EXAM_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '5px 14px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
                border: activeFilter === f ? '1px solid var(--primary)' : '1px solid #cbd5e1',
                background: activeFilter === f ? 'var(--primary)' : '#fff',
                color: activeFilter === f ? '#fff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* ── Test Cards Grid ── */}
      <section className={styles.testsSection}>
        <div className="container">
          <div className={styles.testsGrid}>
            {filteredTests.map(test => (
              <TestCard key={test.slug} test={test} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.howSection}>
        <div className="container">
          <h2 className={styles.howTitle}>How ExamUdaan Authentic CBT Mocks Work</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <h3>Real 100-Q Blueprints</h3>
              <p>Experience the exact question counts, sectional weightages, and time limits set by MPSC, Police & TCS.</p>
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <h3>TCS 5-State Palette</h3>
              <p>Section tabs, Answered, Unanswered, Marked for Review, and Answered & Marked tracking.</p>
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <h3>State Rank & Cutoffs</h3>
              <p>Measure your score against official category cutoffs (Open, OBC, SC/ST) and simulated rank among 50,000 aspirants.</p>
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNum}>4</div>
              <h3>20-Year PYQ Citations</h3>
              <p>Conceptual solutions with verified historical examination pattern tags for every single question.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Official Prep Hubs ── */}
      <section className={styles.ctaSection} style={{ padding: '36px 0', background: 'var(--surface-container-lowest)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Complete Preparation Ecosystem
            </span>
            <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '24px', fontWeight: 800, color: 'var(--on-surface)', margin: '6px 0 8px' }}>
              Master Real Exams with Official Past Papers & Cutoffs
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--secondary)', margin: 0 }}>
              Before and after taking mock tests, study the authentic question papers, analyze historical category benchmarks, and practice topic-wise MCQs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <Link
              href="/mpsc-pyq"
              style={{
                background: '#fff',
                border: '1.5px solid #fed7aa',
                borderRadius: '12px',
                padding: '18px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(234,88,12,0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>📄</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa', padding: '2px 8px', borderRadius: '999px' }}>
                    841 Official Papers
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px', fontFamily: 'var(--font-outfit)' }}>
                  MPSC Question Papers & Keys
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  Download & read official 2021–2026 MPSC question papers and answer keys directly in browser.
                </p>
              </div>
              <span style={{ marginTop: '12px', fontSize: '12.5px', fontWeight: 700, color: '#ea580c', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Open Official Papers →
              </span>
            </Link>

            <Link
              href="/pyq"
              style={{
                background: '#fff',
                border: '1px solid var(--outline-variant)',
                borderRadius: '12px',
                padding: '18px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>🎯</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '999px' }}>
                    9,000+ MCQs
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px', fontFamily: 'var(--font-outfit)' }}>
                  15-Year Topic PYQ Bank
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  Practice topic-wise previous year questions across Polity, Geography, History, Science, and Marathi.
                </p>
              </div>
              <span style={{ marginTop: '12px', fontSize: '12.5px', fontWeight: 700, color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Practice Topic-wise →
              </span>
            </Link>

            <Link
              href="/cutoffs"
              style={{
                background: '#fff',
                border: '1px solid var(--outline-variant)',
                borderRadius: '12px',
                padding: '18px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>📊</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe', padding: '2px 8px', borderRadius: '999px' }}>
                    10-Yr Benchmark
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px', fontFamily: 'var(--font-outfit)' }}>
                  Historical Cutoff Marks
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  Compare your mock test scores against Open, OBC, EWS, SC, and ST official cutoffs.
                </p>
              </div>
              <span style={{ marginTop: '12px', fontSize: '12.5px', fontWeight: 700, color: '#6d28d9', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                View Cutoff Marks →
              </span>
            </Link>

            <Link
              href="/syllabus"
              style={{
                background: '#fff',
                border: '1px solid var(--outline-variant)',
                borderRadius: '12px',
                padding: '18px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>📚</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '999px' }}>
                    17 Exams
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px', fontFamily: 'var(--font-outfit)' }}>
                  Detailed Syllabus & Schemes
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  Subject weightage, marking scheme, and sectional breakdowns for Maharashtra and Central exams.
                </p>
              </div>
              <span style={{ marginTop: '12px', fontSize: '12.5px', fontWeight: 700, color: '#1d4ed8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                View Full Syllabus →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

// ── Test Card Component ──────────────────────────────────────
function TestCard({ test }) {
  const diffColor = DIFFICULTY_COLORS[test.difficulty] || '#ea580c'
  const qCount = test.questions?.length || test.totalQuestions
  const totalMarks = test.marksPerQuestion * qCount

  return (
    <Link href={`/mock-tests/${test.slug}`} className={styles.testCard}>
      <div className={styles.testCardTop}>
        <span className={styles.examBadge} data-exam={test.examType}>{test.examType}</span>
        <span className={styles.diffBadge} style={{ color: diffColor, borderColor: diffColor, background: diffColor + '15' }}>
          {test.difficulty}
        </span>
        {test.isFullMock && (
          <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: '#ecfdf5', color: '#047857', border: '1px solid #6ee7b7', marginLeft: 'auto' }}>
            💯 100 Qs Full Mock
          </span>
        )}
      </div>

      <h3 className={styles.testTitle}>{test.title}</h3>
      <p className={styles.testDesc}>{test.description}</p>

      {test.sections && test.sections.length > 1 && (
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', marginBottom: '12px' }}>
          📌 {test.sections.length} Sections: {test.sections.map(s => s.name.split(' ')[0]).join(' • ')}
        </div>
      )}

      <div className={styles.testMeta}>
        <span>⏱️ {test.durationMinutes} mins</span>
        <span>📝 {qCount} MCQs</span>
        <span>🏆 {totalMarks} marks</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        {test.negativeMark > 0 ? (
          <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>⚠️ -{test.negativeMark} per wrong</span>
        ) : (
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>✓ No Negative Marking</span>
        )}
        {test.cutoffs && (
          <span style={{ fontSize: '11px', color: '#475569', fontWeight: 700 }}>Open Cutoff: {test.cutoffs.open}</span>
        )}
      </div>

      <div className={styles.startBtn} style={{ marginTop: '14px' }}>
        {test.isFullMock ? 'Start Official Mock Exam →' : 'Start Speed Drill →'}
      </div>
    </Link>
  )
}
