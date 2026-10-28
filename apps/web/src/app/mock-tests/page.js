// ============================================================
// app/mock-tests/page.js — Mock Test listing page
// ExamUdaan.in — Browse official 100-Q mocks & sectional drills
// ============================================================
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MOCK_TESTS } from '@/lib/mockTestsData'
import { trackMockTestStart } from '@/lib/analytics'
import { MPSC_TOTAL_QUESTION_PAPERS, MPSC_ARCHIVE_YEARS_SPAN } from '@/lib/platformStats'
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
              Experience authentic TCS / MPSC pattern computer-based tests with <strong>official section weightages, negative marking, category cutoffs, and simulated state percentile band</strong>. No login required.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}><strong>{fullMocksCount}</strong><span>100-Q Full Mocks</span></div>
              <div className={styles.stat}><strong>{totalQuestions}+</strong><span>Real Exam MCQs</span></div>
              <div className={styles.stat}><strong>{sectionalCount}</strong><span>Sectional Speed Drills</span></div>
              <div className={styles.stat}><strong>100% Free</strong><span>State Percentile Band</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Test Format Tabs (Full Mocks vs Sectional) ── */}
      <section className={styles.formatSection}>
        <div className={`container ${styles.formatRow}`}>
          <span className={styles.formatLabel}>
            Test Format:
          </span>
          <button
            onClick={() => setActiveTab('all')}
            className={`${styles.formatBtn} ${activeTab === 'all' ? styles.formatBtnActiveAll : ''}`}
          >
            All Practice Tests ({MOCK_TESTS.length})
          </button>
          <button
            onClick={() => setActiveTab('full')}
            className={`${styles.formatBtn} ${activeTab === 'full' ? styles.formatBtnActiveFull : ''}`}
          >
            <span>💯 Full-Length Exams (100 Qs)</span>
            <span className={`${styles.formatCountBadge} ${activeTab === 'full' ? styles.formatCountBadgeActive : ''}`}>
              {fullMocksCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('sectional')}
            className={`${styles.formatBtn} ${activeTab === 'sectional' ? styles.formatBtnActiveSectional : ''}`}
          >
            <span>⚡ Sectional Speed Drills (20–25 Qs)</span>
            <span className={`${styles.formatCountBadgePurple} ${activeTab === 'sectional' ? styles.formatCountBadgeActive : ''}`}>
              {sectionalCount}
            </span>
          </button>
        </div>
      </section>

      {/* ── Filter Pills by Exam ── */}
      <section className={styles.examFilterSection}>
        <div className={`container ${styles.examFilterRow}`}>
          <span className={styles.examFilterLabel}>
            Filter by Exam:
          </span>
          {EXAM_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`${styles.examFilterBtn} ${activeFilter === f ? styles.examFilterBtnActive : ''}`}
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
              <h3>State Percentile & Merit Band</h3>
              <p>Measure your score against official category cutoffs (Open, OBC, SC/ST) and projected percentile band based on historic candidate cohorts.</p>
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
            <h2 className={styles.ecosystemTitle}>
              Master Real Exams with Official Past Papers & Cutoffs
            </h2>
            <p className={styles.ecosystemSubtitle}>
              Before and after taking mock tests, study the authentic question papers, analyze historical category benchmarks, and practice topic-wise MCQs.
            </p>
          </div>

          <div className={styles.ecosystemGrid}>
            <Link
              href="/mpsc-pyq"
              className={styles.ecosystemCardMpsc}
            >
              <div>
                <div className={styles.cardTopRow}>
                  <span className={styles.cardTopEmoji}>📄</span>
                  <span className={styles.cardBadgeMpsc}>
                    {MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('en-IN')} Official Papers
                  </span>
                </div>
                <h3 className={styles.cardTitle}>
                  MPSC Question Papers & Keys
                </h3>
                <p className={styles.cardDesc}>
                  Download & read official {MPSC_ARCHIVE_YEARS_SPAN} MPSC question papers and answer keys directly in browser.
                </p>
              </div>
              <span className={styles.cardLinkMpsc}>
                Open Official Papers →
              </span>
            </Link>

            <Link
              href="/pyq"
              className={styles.ecosystemCard}
            >
              <div>
                <div className={styles.cardTopRow}>
                  <span className={styles.cardTopEmoji}>🎯</span>
                  <span className={styles.cardBadgeGreen}>
                    9,000+ MCQs
                  </span>
                </div>
                <h3 className={styles.cardTitle}>
                  15-Year Topic PYQ Bank
                </h3>
                <p className={styles.cardDesc}>
                  Practice topic-wise previous year questions across Polity, Geography, History, Science, and Marathi.
                </p>
              </div>
              <span className={styles.cardLinkGreen}>
                Practice Topic-wise →
              </span>
            </Link>

            <Link
              href="/cutoffs"
              className={styles.ecosystemCard}
            >
              <div>
                <div className={styles.cardTopRow}>
                  <span className={styles.cardTopEmoji}>📊</span>
                  <span className={styles.cardBadgePurple}>
                    10-Yr Benchmark
                  </span>
                </div>
                <h3 className={styles.cardTitle}>
                  Historical Cutoff Marks
                </h3>
                <p className={styles.cardDesc}>
                  Compare your mock test scores against Open, OBC, EWS, SC, and ST official cutoffs.
                </p>
              </div>
              <span className={styles.cardLinkPurple}>
                View Cutoff Marks →
              </span>
            </Link>

            <Link
              href="/syllabus"
              className={styles.ecosystemCard}
            >
              <div>
                <div className={styles.cardTopRow}>
                  <span className={styles.cardTopEmoji}>📚</span>
                  <span className={styles.cardBadgeBlue}>
                    17 Exams
                  </span>
                </div>
                <h3 className={styles.cardTitle}>
                  Detailed Syllabus & Schemes
                </h3>
                <p className={styles.cardDesc}>
                  Subject weightage, marking scheme, and sectional breakdowns for Maharashtra and Central exams.
                </p>
              </div>
              <span className={styles.cardLinkBlue}>
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
    <Link
      href={`/mock-tests/${test.slug}`}
      className={styles.testCard}
      onClick={() => {
        trackMockTestStart({ exam_name: test.title, test_id: test.slug })
      }}
    >
      <div className={styles.testCardTop}>
        <span className={styles.examBadge} data-exam={test.examType}>{test.examType}</span>
        <span className={styles.diffBadge} style={{ color: diffColor, borderColor: diffColor, background: diffColor + '15' }}>
          {test.difficulty}
        </span>
        {test.isFullMock && (
          <span className={styles.fullMockBadge}>
            💯 100 Qs Full Mock
          </span>
        )}
      </div>

      <h2 className={styles.testTitle}>{test.title}</h2>
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
