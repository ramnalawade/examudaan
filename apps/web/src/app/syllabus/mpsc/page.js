// ============================================================
// app/syllabus/mpsc/page.js — MPSC Official Examination Syllabi
// ExamUdaan.in — 343 Official MPSC Papers Directory & Analytics
// Matches Screenshot 1 layout and visual design
// ============================================================

import Link from 'next/link'
import MpscSyllabusDirectory from '../MpscSyllabusDirectory'
import CadreCoverageWidget from '@/components/CadreCoverageWidget'
import styles from './mpscPage.module.css'

export const metadata = {
  title: 'MPSC Official Examination Syllabi (343 Papers) — English & Marathi',
  description: 'Download official Maharashtra Public Service Commission (MPSC) syllabi across Rajyaseva, Group B, Group C, Engineering, Education and Medical cadres with bilingual topic breakdowns.',
  keywords: [
    'MPSC syllabus 343 papers', 'MPSC Rajyaseva syllabus', 'MPSC Group B syllabus',
    'MPSC Group C syllabus', 'MPSC engineering syllabus', 'MPSC Marathi syllabus download',
    'MPSC official gazette papers', 'Maharashtra exam syllabus'
  ],
  alternates: {
    canonical: 'https://examudaan.in/syllabus/mpsc',
  },
  openGraph: {
    title: 'MPSC Official Examination Syllabi (343 Papers) | ExamUdaan',
    description: 'Complete official 343 MPSC syllabus notifications with bilingual units, topics checklist, and marking patterns.',
    url: 'https://examudaan.in/syllabus/mpsc',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'MPSC Official Examination Syllabi (343 Papers) | ExamUdaan',
    description: 'Download all 343 official MPSC examination syllabi with English & Marathi blueprints.',
  },
}

export default function MpscSyllabusCatalogPage() {
  return (
    <main className={styles.page}>
      {/* ── Breadcrumb Bar ── */}
      <div className={styles.breadcrumbBar}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" title="ExamUdaan Home">Home</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href="/syllabus" title="All Exam Syllabi">Maharashtra Services</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>MPSC Official Examination Syllabi</span>
          </nav>
        </div>
      </div>

      {/* ── 343 Papers Interactive Directory ── */}
      <MpscSyllabusDirectory />

      {/* ── Cadre Coverage & Distribution Stats Widget (Donut + Bars) ── */}
      <CadreCoverageWidget />

      {/* ── Complete Preparation & Solutions Ecosystem ── */}
      <section className={styles.hubSection} id="ecosystem">
        <div className="container">
          <div className={styles.hubHeader}>
            <h2 className={styles.hubSectionTitle}>
              <span className="material-symbols-outlined">hub</span>
              <span>Complete Preparation &amp; Solutions Ecosystem</span>
            </h2>
            <p className={styles.hubSectionSubtitle}>
              Looking for authentic question papers and official keys? Explore our verified exam verticals below:
            </p>
          </div>

          <div className={styles.hubGrid}>
            {/* 0. Interactive Syllabus-to-PYQ Checklist */}
            <Link href="/mpsc/syllabus-tracker" className={styles.hubCard} style={{ borderColor: '#EA580C', background: '#FFFBF5' }}>
              <div className={styles.hubCardHeader}>
                <div className={styles.hubCardIcon}>
                  <span className="material-symbols-outlined" style={{ color: '#EA580C' }}>checklist_rtl</span>
                </div>
                <span className={`${styles.hubBadge} ${styles.badgeOrange}`}>New Interactive Tracker</span>
              </div>
              <h3 className={styles.hubCardTitle}>Interactive Syllabus-to-PYQ Tracker</h3>
              <p className={styles.hubCardDesc}>
                Track your topic progress, view real-time solved question density (10,392 PYQs), and compare revised vs old pattern.
              </p>
              <span className={styles.hubCardCta}>
                <span>Launch Interactive Checklist</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            {/* 1. MPSC Papers & Keys */}
            <Link href="/mpsc-pyq" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={styles.hubCardIcon}>
                  <span className="material-symbols-outlined">description</span>
                </div>
                <span className={`${styles.hubBadge} ${styles.badgeOrange}`}>Daily Updated PYQ</span>
              </div>
              <h3 className={styles.hubCardTitle}>MPSC Papers &amp; Keys (2021–2026)</h3>
              <p className={styles.hubCardDesc}>
                Official 2021–2026 Rajyaseva, Group B, Group C papers paired side-by-side with final answer keys in browser.
              </p>
              <span className={styles.hubCardCta}>
                <span>Open MPSC Archive</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            {/* 2. MPSC Rajyaseva Main Syllabus */}
            <Link href="/mpsc-syllabus/1181" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={styles.hubCardIcon}>
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

            {/* 3. All Question Papers */}
            <Link href="/question-papers" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={styles.hubCardIcon}>
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

            {/* 4. Answer Keys Portal */}
            <Link href="/answer-keys" className={styles.hubCard}>
              <div className={styles.hubCardHeader}>
                <div className={styles.hubCardIcon}>
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
          </div>
        </div>
      </section>

      {/* ── Split Callout Banners (Mock Tests & Career Compass) ── */}
      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaGrid}`}>
          <div className={styles.ctaBoxOrange}>
            <div>
              <div className={`${styles.ctaIconBadge} ${styles.ctaIconOrange}`}>
                <span className="material-symbols-outlined">quiz</span>
              </div>
              <h2 className={styles.ctaTitle}>Practice with Free Mock Tests</h2>
              <p className={styles.ctaDesc}>
                Apply your syllabus knowledge with timed MPSC practice tests — structured exam-by-exam according to latest negative marking patterns.
              </p>
            </div>
            <Link href="/mock-tests" className={styles.btnCtaWhite}>
              <span>Start Mock Practice</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className={styles.ctaBoxNavy}>
            <div>
              <div className={`${styles.ctaIconBadge} ${styles.ctaIconNavy}`}>
                <span className="material-symbols-outlined">explore</span>
              </div>
              <h2 className={styles.ctaTitle}>10th &amp; 12th Career Compass</h2>
              <p className={styles.ctaDesc}>
                Confused between Science, Commerce, Arts &amp; Polytechnic? Explore 40+ career roadmaps, salary ladders &amp; entrance exams.
              </p>
            </div>
            <Link href="/career" className={styles.btnCtaGreen}>
              <span>Explore 10th / Career Paths</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
