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

      {/* ── PYQ Quick Links ── */}
      <section className={styles.pyqSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>📄 Previous Year Question Papers</h2>
          <p className={styles.sectionSubtitle}>Direct links to official PYQ papers — no third-party downloads</p>
          <div className={styles.pyqGrid}>
            {SYLLABUS_EXAMS.map(exam =>
              exam.pyqLinks.map((link, i) => (
                <a
                  key={`${exam.slug}-${i}`}
                  href={link.paperUrl || link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pyqCard}
                >
                  <span className={styles.pyqYear}>{link.year}</span>
                  <span className={styles.pyqExam}>{exam.shortName}</span>
                  <span className={styles.pyqLabel}>{link.label}</span>
                  <span className={styles.pyqIcon}>↗</span>
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <span className={styles.ctaIcon}>🎯</span>
            <h2>Practice with Free Mock Tests</h2>
            <p>Apply your syllabus knowledge with our timed MCQ practice tests — structured exam-by-exam.</p>
            <Link href="/mock-tests" className="btn-primary">Start Free Mock Test →</Link>
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
    <Link href={`/syllabus/${exam.slug}`} className={styles.examCard}>
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

      {/* Footer */}
      <div className={styles.examCardFooter}>
        <span>{totalPapers} papers covered</span>
        <span>{exam.pyqLinks.length} PYQ links</span>
        <span className={styles.viewBtn}>View Syllabus →</span>
      </div>
    </Link>
  )
}
