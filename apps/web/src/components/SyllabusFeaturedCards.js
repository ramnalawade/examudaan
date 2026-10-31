// ============================================================
// components/SyllabusFeaturedCards.js — Featured Public Service Exams
// ExamUdaan.in — 6 flagship state & central syllabi matching design
// ============================================================

import Link from 'next/link'
import styles from './SyllabusFeaturedCards.module.css'

const FEATURED_EXAMS = [
  {
    slug: 'mpsc-state-services',
    tagLeft: 'State • Gazetted',
    tagRight: '2025-26 Cycle',
    titleEn: 'MPSC State Services (Rajyaseva)',
    titleMr: 'महाराष्ट्र नागरी सेवा राजपत्रित संयुक्त परीक्षा • Dy. Collector, DSP, Tehsildar',
    eligibility: 'Graduate in any discipline (Final year eligible)',
    ageLimit: '19–38 yrs (Open) / +5 yrs',
    stages: 'Prelims (GS + CSAT) → Mains (1750 M) → Interview',
    badges: ['9 Official Papers', 'All Keys', 'Marathi & Eng'],
    buttonLabel: 'Explore Syllabus →',
    downloadUrl: '/api/mpsc-pdf/doc_876988be_98af8b85_179ad4fa',
    downloadTitle: 'Download Official Rajyaseva Syllabus PDF'
  },
  {
    slug: 'maharashtra-talathi',
    tagLeft: 'State • Group C',
    tagRight: 'Direct Recruitment',
    titleEn: 'Maharashtra Talathi Bharti',
    titleMr: 'महसूल विभाग Revenue & Forest Department • तलाठी भरती',
    eligibility: 'Any Degree + Computer Proficiency (MS-CIT)',
    ageLimit: '19–38 yrs (Open) / +5 yrs',
    stages: 'Single Stage CBT (200 Marks / 100 Qs)',
    badges: ['Single CBT Pattern', 'District-wise Merit'],
    buttonLabel: 'View Syllabus →',
    downloadUrl: '/syllabus/maharashtra-talathi#syllabus',
    downloadTitle: 'View Talathi Examination Standards'
  },
  {
    slug: 'maharashtra-police',
    tagLeft: 'Police • State Cadre',
    tagRight: 'Physical + Written',
    titleEn: 'Maharashtra Police Bharti',
    titleMr: 'महाराष्ट्र पोलीस शिपाई, चालक व SRPF सशस्त्र पोलीस भरती',
    eligibility: '12th Standard Passed (HSC) or equivalent',
    ageLimit: '18–28 yrs (Open) / +5 yrs',
    stages: 'Physical Test (50 M) → Written (100 M)',
    badges: ['Ground Standards', 'District PYQs'],
    buttonLabel: 'View Syllabus & Standards →',
    downloadUrl: '/syllabus/maharashtra-police#syllabus',
    downloadTitle: 'View Police Bharti Physical & Written Criteria'
  },
  {
    slug: 'maha-tet',
    tagLeft: 'Teacher • MSCE Pune',
    tagRight: 'Paper 1 & Paper 2',
    titleEn: 'Maharashtra Teacher Eligibility Test (MAHA TET)',
    titleMr: 'महाराष्ट्र राज्य परीक्षा परिषद पुणे • शिक्षक पात्रता परीक्षा (इ. १ ली ते ८ वी)',
    eligibility: '12th + D.El.Ed (Paper 1) / Degree + B.Ed/D.El.Ed (Paper 2)',
    ageLimit: 'Min 18 yrs / Govt relaxation',
    stages: 'Paper 1 Primary (150 M) & Paper 2 Upper Primary (150 M)',
    badges: ['Official GR PDF', 'Pedagogy Blueprint', 'Bilingual'],
    buttonLabel: 'View TET Syllabus →',
    downloadUrl: '/downloads/mahatet/syllabus/MAHATET_Syllabus.pdf',
    downloadTitle: 'Download Official MAHA TET Syllabus PDF'
  },
  {
    slug: 'upsc-cse',
    tagLeft: 'Central • All-India',
    tagRight: 'Annual Calendar',
    titleEn: 'UPSC Civil Services Examination (CSE)',
    titleMr: 'Union Public Service Commission • IAS, IPS, IFS, IRS',
    eligibility: "Bachelor's Degree in any discipline",
    ageLimit: '21–32 yrs (Gen) / Relaxations',
    stages: 'Prelims (GS + CSAT) → Mains (1750 M) → PT',
    badges: ['10 Years PYQs', 'Micro-topics Indexed'],
    buttonLabel: 'Syllabus Roadmap →',
    downloadUrl: '/syllabus/upsc-cse#syllabus',
    downloadTitle: 'Explore UPSC CSE Topic Roadmap'
  },
  {
    slug: 'ssc-cgl',
    tagLeft: 'Central • Staff Selection',
    tagRight: 'Revised Scheme',
    titleEn: 'SSC Combined Graduate Level (CGL)',
    titleMr: 'Staff Selection Commission • ASO, Excise Inspector, Income Tax, CBI',
    eligibility: "Bachelor's Degree in any discipline",
    ageLimit: '18–32 yrs (Post-wise)',
    stages: 'Tier-I (CBT Qualifying) → Tier-II (Merit CBT)',
    badges: ['Tier I & II Syllabi', 'Typing Speed Norms'],
    buttonLabel: 'Tier-wise Syllabus →',
    downloadUrl: '/syllabus/ssc-cgl#syllabus',
    downloadTitle: 'View SSC CGL Tier-wise Syllabus'
  },
  {
    slug: 'ibps-po',
    tagLeft: 'Banking • Public Sector',
    tagRight: 'Speed & Accuracy',
    titleEn: 'IBPS PO / MT & SBI PO',
    titleMr: 'Institute of Banking Personnel Selection • 11 Public Sector Banks',
    eligibility: 'Graduation degree in any discipline',
    ageLimit: '20–30 yrs + Age relaxations',
    stages: 'Prelims (100 M) → Mains (225 M) → Interview',
    badges: ['Sectional Timings', 'Topic Weightage Matrix'],
    buttonLabel: 'Pattern & Topics →',
    downloadUrl: '/syllabus/ibps-po#syllabus',
    downloadTitle: 'View Banking PO Pattern & Topic Weightage'
  }
]

export default function SyllabusFeaturedCards() {
  return (
    <section className={styles.section} id="featured-exams">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbBar} aria-label="Breadcrumb">
          <div className={styles.breadcrumb}>
            <Link href="/" title="ExamUdaan Home">Home</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>Exam Syllabus &amp; Question Papers</span>
          </div>
        </nav>

        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.subHeading}>COMPREHENSIVE BLUEPRINTS</span>
          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.title}>Featured Public Service Exams</h1>
              <p className={styles.caption}>
                Standardized eligibility thresholds, stage patterns, and verified previous papers archives across Maharashtra State &amp; Central services.
              </p>
            </div>
            <span className={styles.accessedBadge}>Showing 6 flagship national &amp; state syllabi</span>
          </div>
        </div>

        {/* 6 Cards Grid */}
        <div className={styles.cardsGrid}>
          {FEATURED_EXAMS.map((exam) => (
            <article key={exam.slug} className={styles.card}>
              <div>
                {/* Top Tags */}
                <div className={styles.tagRow}>
                  <span className={styles.levelTag}>{exam.tagLeft}</span>
                  <span className={styles.cycleTag}>{exam.tagRight}</span>
                </div>

                {/* Title */}
                <h2 className={styles.cardTitle}>
                  <Link href={`/syllabus/${exam.slug}`} className={styles.cardTitleLink}>
                    {exam.titleEn}
                  </Link>
                </h2>
                <p className={styles.cardTitleMr}>{exam.titleMr}</p>

                {/* Structured Attributes Box (Table) */}
                <div className={styles.attrBox}>
                  <div className={styles.attrRow}>
                    <span className={styles.attrLabel}>Eligibility:</span>
                    <span className={styles.attrVal}>{exam.eligibility}</span>
                  </div>
                  <div className={styles.attrRow}>
                    <span className={styles.attrLabel}>Age Limit:</span>
                    <span className={styles.attrVal}>{exam.ageLimit}</span>
                  </div>
                  <div className={styles.attrRow}>
                    <span className={styles.attrLabel}>Stages:</span>
                    <span className={styles.attrVal}>{exam.stages}</span>
                  </div>
                </div>

                {/* Feature Badges */}
                <div className={styles.badgeRow}>
                  {exam.badges.map((b) => (
                    <span key={b} className={styles.featureBadge}>
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>{b}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionRow}>
                <Link
                  href={`/syllabus/${exam.slug}`}
                  className={styles.btnExplore}
                  title={`Open ${exam.titleEn} study blueprint`}
                >
                  <span>{exam.buttonLabel}</span>
                </Link>
                <a
                  href={exam.downloadUrl}
                  target={exam.downloadUrl.endsWith('.pdf') ? '_blank' : undefined}
                  rel={exam.downloadUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                  className={styles.btnDownload}
                  title={exam.downloadTitle}
                >
                  <span className={`material-symbols-outlined ${styles.btnDownloadIcon}`}>download</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
