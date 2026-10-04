// ============================================================
// app/syllabus/page.js — Syllabus & PYQ listing page
// ExamUdaan.in — Lists all major exam syllabi with direct links
// ============================================================

import { SYLLABUS_EXAMS } from '@/lib/syllabusData'
import Link from 'next/link'
import styles from './syllabus.module.css'

export const metadata = {
  title: 'Exam Syllabus 2026 — MPSC, UPSC, IBPS, SSC, Police Bharti | ExamUdaan',
  description: 'Download complete syllabus and previous year question papers (PYQ) for MPSC State Services, UPSC CSE, IBPS PO, SSC CGL, and Maharashtra Police Bharti 2026.',
  keywords: 'MPSC syllabus 2026, UPSC syllabus, IBPS PO syllabus, SSC CGL syllabus, police bharti syllabus, exam syllabus download, PYQ papers',
  alternates: {
    canonical: 'https://examudaan.in/syllabus',
  },
}

// Exam level filter groups
const LEVEL_FILTERS = ['All', 'State', 'Central']

export default function SyllabusPage() {
  return (
    <main className={styles.syllabusPage}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroLabel}>📚 Free Resource</span>
            <h1>Exam Syllabus & Previous Year Papers</h1>
            <p>Complete topic-wise syllabus, paper structure, and official PYQ links for every major government exam. No coaching fees — free forever.</p>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <strong>{SYLLABUS_EXAMS.length}</strong>
                <span>Exams Covered</span>
              </div>
              <div className={styles.stat}>
                <strong>{SYLLABUS_EXAMS.reduce((a, e) => a + e.pyqLinks.length, 0)}+</strong>
                <span>PYQ Links</span>
              </div>
              <div className={styles.stat}>
                <strong>2026</strong>
                <span>Updated For</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Exam Cards ── */}
      <section className={styles.examSection}>
        <div className="container">
          <div className={styles.examGrid}>
            {SYLLABUS_EXAMS.map(exam => (
              <ExamCard key={exam.slug} exam={exam} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Official Question Papers, Keys & Prep Hub ── */}
      <section className={styles.hubSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>📚 Complete Preparation & Solutions Ecosystem</h2>
          <p className={styles.sectionSubtitle}>
            Looking for authentic question papers and official keys? Explore our dedicated exam verticals below:
          </p>
          <div className={styles.hubGrid}>
            <Link href="/mpsc-pyq" className={styles.hubCard} style={{ border: '1.5px solid #EA580C' }}>
              <div className={styles.hubCardHeader}>
                <div className={styles.hubCardIcon} style={{ background: '#FFF7ED', color: '#EA580C' }}>
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <span className={styles.hubBadge} style={{ background: '#FFEDD5', color: '#C2410C' }}>209 Official PDFs</span>
              </div>
              <h3 className={styles.hubCardTitle}>MPSC Papers & Keys (2024–2026)</h3>
              <p className={styles.hubCardDesc}>
                Official MPSC State Services, Group B & C Combined, and screening test question papers with final answer keys from mpsc.gov.in.
              </p>
              <span className={styles.hubCardCta} style={{ color: '#EA580C' }}>Open MPSC Archive (209) →</span>
            </Link>

            <Link href="/question-papers" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={styles.hubCardIcon}>
                  <span className="material-symbols-outlined">description</span>
                </div>
                <span className={styles.hubBadge}>All Exams</span>
              </div>
              <h3 className={styles.hubCardTitle}>All Question Papers</h3>
              <p className={styles.hubCardDesc}>
                Official Police Bharti, Talathi, ZP, UPSC, SSC & RRB authentic question papers with verified final keys.
              </p>
              <span className={styles.hubCardCta}>Browse Question Papers →</span>
            </Link>

            <Link href="/answer-keys" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={styles.hubCardIcon} style={{ background: '#ecfdf5', color: '#059669' }}>
                  <span className="material-symbols-outlined">fact_check</span>
                </div>
                <span className={styles.hubBadge} style={{ background: '#d1fae5', color: '#047857' }}>Official Keys</span>
              </div>
              <h3 className={styles.hubCardTitle}>Answer Keys Portal</h3>
              <p className={styles.hubCardDesc}>
                Check provisional & final response sheets, objection windows, and score calculators for all recruitment exams.
              </p>
              <span className={styles.hubCardCta} style={{ color: '#059669' }}>View Answer Keys →</span>
            </Link>

            <Link href="/pyq" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={styles.hubCardIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <span className={styles.hubBadge} style={{ background: '#fef3c7', color: '#b45309' }}>15-Yr Bank</span>
              </div>
              <h3 className={styles.hubCardTitle}>Interactive PYQ Bank</h3>
              <p className={styles.hubCardDesc}>
                Practice 15 years of previous exam questions topic-by-topic with detailed solutions and time counters.
              </p>
              <span className={styles.hubCardCta} style={{ color: '#d97706' }}>Practice PYQs Online →</span>
            </Link>

            <Link href="/current-affairs" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={styles.hubCardIcon} style={{ background: '#e0f2fe', color: '#0284c7' }}>
                  <span className="material-symbols-outlined">newspaper</span>
                </div>
                <span className={styles.hubBadge} style={{ background: '#e0f2fe', color: '#0369a1' }}>Daily CA</span>
              </div>
              <h3 className={styles.hubCardTitle}>Daily Current Affairs</h3>
              <p className={styles.hubCardDesc}>
                Daily Maharashtra & All-India GK summaries, editorial analysis, and downloadable monthly PDF capsules.
              </p>
              <span className={styles.hubCardCta} style={{ color: '#0284c7' }}>Read Today's CA →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className={styles.ctaBox}>
            <span className={styles.ctaIcon}>🎯</span>
            <h2>Practice with Free Mock Tests</h2>
            <p>Apply your syllabus knowledge with our timed MCQ practice tests — structured exam-by-exam.</p>
            <Link href="/mock-tests" className="btn-primary">Start Free Mock Test →</Link>
          </div>
          <div className={styles.ctaBoxSlate}>
            <span className={styles.ctaIcon}>🧭</span>
            <h2>10th & 12th Career Compass</h2>
            <p>Confused between Science, Commerce, Arts & Polytechnic? Explore 40+ career roadmaps, salary ladders & entrance exams.</p>
            <Link href="/career" className="btn-primary">Explore 40+ Career Paths →</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

// ── Exam Card Component ──────────────────────────────────────
function ExamCard({ exam }) {
  const totalPapers = exam.papers.reduce((a, s) => a + s.papers.length, 0)
  return (
    <div className={styles.examCard} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Color accent bar */}
      <div className={styles.examCardBar} style={{ background: exam.color }} />

      {/* Header */}
      <div className={styles.examCardHeader}>
        <span className={`material-symbols-outlined ${styles.examIcon}`} style={{ color: exam.color }}>
          {exam.logo}
        </span>
        <div>
          <h3 className={styles.examName}>{exam.nameEn}</h3>
          <p className={styles.examBody}>{exam.conductingBody}</p>
        </div>
        <span className={styles.examLevel}
          data-level={exam.examLevel}>
          {exam.examLevel}
        </span>
      </div>

      {/* Posts */}
      <div className={styles.examPosts}>
        {exam.targetPosts.slice(0, 3).map(p => (
          <span key={p} className={styles.postPill}>{p}</span>
        ))}
        {exam.targetPosts.length > 3 && (
          <span className={styles.postPillMore}>+{exam.targetPosts.length - 3} more</span>
        )}
      </div>

      {/* Meta row */}
      <div className={styles.examMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Eligibility</span>
          <span className={styles.metaVal}>{exam.eligibility.length > 40 ? exam.eligibility.slice(0, 40) + '…' : exam.eligibility}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Age</span>
          <span className={styles.metaVal}>{exam.ageLimit.min}–{exam.ageLimit.max} yrs</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Stages</span>
          <span className={styles.metaVal}>{exam.stages.join(' → ')}</span>
        </div>
      </div>

      {/* Quick Direct Links to Papers & Keys */}
      <div className={styles.examQuickLinks}>
        <Link
          href={exam.slug.startsWith('mpsc-') ? '/mpsc-pyq' : '/question-papers'}
          className={styles.examQuickLink}
          title="View official previous year question papers"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>description</span>
          <span>{exam.slug.startsWith('mpsc-') ? 'MPSC Papers (209)' : 'Papers'}</span>
        </Link>
        <Link href={`/answer-keys`} className={styles.examQuickLink} title="View official answer keys">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>key</span>
          <span>Keys</span>
        </Link>
        <Link href={`/syllabus/${exam.slug}`} className={styles.examQuickLink} style={{ marginLeft: 'auto', background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }}>
          <span>Full Syllabus →</span>
        </Link>
      </div>

      {/* Footer */}
      <div className={styles.examCardFooter}>
        <span>{totalPapers} papers</span>
        <span>{exam.pyqLinks.length} PYQ resources</span>
        <Link href={`/syllabus/${exam.slug}`} className={styles.viewBtn}>View Syllabus →</Link>
      </div>
    </div>
  )
}
