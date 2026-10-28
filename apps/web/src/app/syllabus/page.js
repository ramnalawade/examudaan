// ============================================================
// app/syllabus/page.js — Exam Syllabus & Question Papers Directory
// ExamUdaan.in — Simplified, verified blueprints matching Screenshot 2
// ============================================================

import Link from 'next/link'
import SyllabusFeaturedCards from '@/components/SyllabusFeaturedCards'
import LatestMicroRubrics from '@/components/LatestMicroRubrics'
import SyllabusStrategyBanner from '@/components/SyllabusStrategyBanner'
import { MPSC_TOTAL_QUESTION_PAPERS, MPSC_ARCHIVE_YEARS_SPAN } from '@/lib/platformStats'
import styles from './syllabus.module.css'

export const metadata = {
  title: {
    absolute: 'Exam Syllabus & Question Papers 2026 | ExamUdaan',
  },
  description: 'Download verified syllabus blueprints for MPSC, Police Bharti, UPSC & SSC CGL 2026. Topic-wise breakdowns, schemes and solved question papers.',
  keywords: [
    'MPSC syllabus 2026', 'UPSC syllabus', 'IBPS PO syllabus', 'SSC CGL syllabus',
    'police bharti syllabus', 'exam syllabus download', 'MPSC PYQ papers',
    'Maharashtra exam syllabus', 'talathi syllabus'
  ],
  alternates: {
    canonical: 'https://examudaan.in/syllabus',
  },
  openGraph: {
    title: 'Exam Syllabus & Question Papers 2026 | ExamUdaan',
    description: 'Download verified syllabus blueprints for MPSC, Police Bharti, UPSC & SSC CGL 2026. Topic-wise breakdowns, schemes and solved question papers.',
    url: 'https://examudaan.in/syllabus',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Exam Syllabus & Question Papers 2026 | ExamUdaan',
    description: 'MPSC, UPSC, SSC & Police Bharti syllabus with topic-wise breakdown & PYQs.',
  },
}

export default function SyllabusPage() {
  return (
    <main className={styles.syllabusPage}>
      {/* ── 1. Featured Public Service Exams (6 Flagship Cards) ── */}
      <SyllabusFeaturedCards />

      {/* ── 3. Latest Official Exam Syllabi & Micro-Rubrics (Strip View) ── */}
      <LatestMicroRubrics />

      {/* ── 4. 2-Minute Personalized Strategy Builder Banner ── */}
      <SyllabusStrategyBanner />

      {/* ── 5. Complete Preparation & Solutions Ecosystem ── */}
      <section className={styles.hubSection} id="ecosystem">
        <div className="container">
          <h2 className={styles.sectionTitle}>
            <span className="material-symbols-outlined">hub</span>
            <span>Complete Preparation &amp; Solutions Ecosystem</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Looking for authentic question papers and official keys? Explore our dedicated exam verticals below:
          </p>

          <div className={styles.hubGrid}>
            <Link href="/syllabus/mpsc" className={`${styles.hubCard} ${styles.hubCardBorderOrange}`}>
              <div className={styles.hubCardHeader}>
                <div className={`${styles.hubCardIcon} ${styles.iconOrange}`}>
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <span className={`${styles.hubBadge} ${styles.badgeOrange}`}>343 Official Papers</span>
              </div>
              <h3 className={styles.hubCardTitle}>MPSC Official Examination Catalog</h3>
              <p className={styles.hubCardDesc}>
                Browse all 343 official MPSC syllabi across Rajyaseva, Group B, Group C, Engineering &amp; Education with bilingual readers.
              </p>
              <span className={styles.hubCardCta}>
                <span>Explore 343 MPSC Syllabi</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/mpsc-pyq" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={`${styles.hubCardIcon} ${styles.iconOrange}`}>
                  <span className="material-symbols-outlined">description</span>
                </div>
                <span className={`${styles.hubBadge} ${styles.badgeOrange}`}>{MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('en-IN')} Official Papers</span>
              </div>
              <h3 className={styles.hubCardTitle}>MPSC Papers &amp; Keys ({MPSC_ARCHIVE_YEARS_SPAN})</h3>
              <p className={styles.hubCardDesc}>
                Official {MPSC_ARCHIVE_YEARS_SPAN} Rajyaseva, Group B, Group C papers paired side-by-side with final answer keys in browser.
              </p>
              <span className={styles.hubCardCta}>
                <span>Open MPSC Archive</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/mpsc-syllabus/1181" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={`${styles.hubCardIcon} ${styles.iconPink}`}>
                  <span className="material-symbols-outlined">military_tech</span>
                </div>
                <span className={`${styles.hubBadge} ${styles.badgePink}`}>Descriptive Syllabus</span>
              </div>
              <h3 className={styles.hubCardTitle}>MPSC Rajyaseva Main Syllabus</h3>
              <p className={styles.hubCardDesc}>
                Official descriptive 9 papers structure, GS papers I to IV topic rubrics, essay marking, and optional list.
              </p>
              <span className={styles.hubCardCta}>
                <span>View Doc #1181</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/question-papers" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={`${styles.hubCardIcon} ${styles.iconBlue}`}>
                  <span className="material-symbols-outlined">article</span>
                </div>
                <span className={`${styles.hubBadge} ${styles.badgeBlue}`}>All State Exams</span>
              </div>
              <h3 className={styles.hubCardTitle}>All Question Papers</h3>
              <p className={styles.hubCardDesc}>
                Official Police Bharti, Talathi, ZP, UPSC, SSC &amp; RRB authentic question papers with verified final keys.
              </p>
              <span className={styles.hubCardCta}>
                <span>Browse Question Papers</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/answer-keys" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={`${styles.hubCardIcon} ${styles.iconGreen}`}>
                  <span className="material-symbols-outlined">fact_check</span>
                </div>
                <span className={`${styles.hubBadge} ${styles.badgeGreen}`}>Official Keys</span>
              </div>
              <h3 className={styles.hubCardTitle}>Answer Keys Portal</h3>
              <p className={styles.hubCardDesc}>
                Check provisional &amp; final response sheets, objection windows, and score calculators for all recruitment exams.
              </p>
              <span className={styles.hubCardCta}>
                <span>View Answer Keys</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/mock-tests" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={`${styles.hubCardIcon} ${styles.iconPurple}`}>
                  <span className="material-symbols-outlined">quiz</span>
                </div>
                <span className={`${styles.hubBadge} ${styles.badgePurple}`}>Timed Mock Tests</span>
              </div>
              <h3 className={styles.hubCardTitle}>Practice Free Mock Tests</h3>
              <p className={styles.hubCardDesc}>
                Apply your syllabus knowledge with timed practice tests — structured exam-by-exam according to latest negative marking patterns.
              </p>
              <span className={styles.hubCardCta}>
                <span>Start Free Mock Test</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/career" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={`${styles.hubCardIcon} ${styles.iconTeal}`}>
                  <span className="material-symbols-outlined">explore</span>
                </div>
                <span className={`${styles.hubBadge} ${styles.badgeTeal}`}>40+ Career Paths</span>
              </div>
              <h3 className={styles.hubCardTitle}>10th &amp; 12th Career Compass</h3>
              <p className={styles.hubCardDesc}>
                Confused between Science, Commerce, Arts &amp; Polytechnic? Explore 40+ career roadmaps, salary ladders &amp; entrance exams.
              </p>
              <span className={styles.hubCardCta}>
                <span>Explore Career Paths</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/talathi-bharti-2026" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={`${styles.hubCardIcon} ${styles.iconAmber}`}>
                  <span className="material-symbols-outlined">agriculture</span>
                </div>
                <span className={`${styles.hubBadge} ${styles.badgeAmber}`}>TCS 200M Pattern</span>
              </div>
              <h3 className={styles.hubCardTitle}>Talathi Bharti 2026 Hub</h3>
              <p className={styles.hubCardDesc}>
                Complete 200-mark TCS exam structure, district-wise rosters, subject weightage, and free mock tests.
              </p>
              <span className={styles.hubCardCta}>
                <span>Explore Talathi 2026</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/maharashtra-police-bharti-2026" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={`${styles.hubCardIcon} ${styles.iconOrange}`}>
                  <span className="material-symbols-outlined">local_police</span>
                </div>
                <span className={`${styles.hubBadge} ${styles.badgeOrange}`}>150-Mark Merit</span>
              </div>
              <h3 className={styles.hubCardTitle}>Police Bharti 2026 Hub</h3>
              <p className={styles.hubCardDesc}>
                50-mark physical test matrix, 100-mark written syllabus, physical merit calculator, and practice papers.
              </p>
              <span className={styles.hubCardCta}>
                <span>Explore Police 2026</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
