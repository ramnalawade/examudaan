// ============================================================
// app/question-papers/page.js — Question Papers & Official Keys Directory
// Sourced from MPSC, Maharashtra Police, TCS Talathi & State Recruiting Bodies
// Fully compliant with ZERO INLINE STYLES and Platform Stats Single Source of Truth
// ============================================================

import Link from 'next/link'
import mpscLocalPapers from '@/lib/mpscLocalPapers.json'
import mpscPairedExams from '@/lib/mpscPairedExams.json'
import { MPSC_TOTAL_QUESTION_PAPERS, MPSC_ARCHIVE_YEARS_SPAN } from '@/lib/platformStats'
import styles from './questionPapers.module.css'

export const metadata = {
  title: {
    absolute: 'Previous Year Question Papers & Official Keys (PDF & In-Browser) | ExamUdaan',
  },
  description: 'Download and read official previous year question papers and verified answer keys (2009–2026) for MPSC, Maharashtra Police Bharti, TCS Talathi, and Central Exams free in browser.',
  keywords: [
    'previous year question papers', 'MPSC question papers with answer key',
    'police bharti question paper pdf', 'talathi question paper tcs pattern',
    'mpsc pyq download', 'government exam question papers'
  ],
  alternates: {
    canonical: 'https://examudaan.in/question-papers',
  },
  openGraph: {
    title: 'Previous Year Question Papers & Official Keys (PDF & In-Browser) | ExamUdaan',
    description: 'Download and read official previous year question papers and verified answer keys (2009–2026) for MPSC, Maharashtra Police Bharti, TCS Talathi, and Central Exams free in browser.',
    url: 'https://examudaan.in/question-papers',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Previous Year Question Papers & Official Keys | ExamUdaan',
    description: 'Official MPSC, Police Bharti, Talathi and state recruitment question papers with verified final keys.',
  },
}

const EXAM_GROUPS = [
  {
    id: 'mpsc-group',
    title: 'MPSC & State Services',
    titleMr: 'एमपीएससी व राज्यसेवा मागील प्रश्नपत्रिका',
    badge: 'MPSC',
    colorClass: styles.badgeOrange,
    exams: [
      {
        name: 'MPSC State Services (Rajyaseva)',
        slug: 'mpsc-state-services',
        count: '2009–2026 Archive',
        pyqSubject: 'polity',
        targetUrl: '/mpsc/rajyaseva-previous-year-papers',
        badgeStatus: '180+ Papers & Keys',
        isCurating: false
      },
      {
        name: 'MPSC Combined Group B (PSI / STI / ASO)',
        slug: 'mpsc-group-b',
        count: 'Non-Gazetted Group B',
        pyqSubject: 'history',
        targetUrl: '/mpsc/group-b-previous-year-papers',
        badgeStatus: '140+ Official Sets',
        isCurating: false
      },
      {
        name: 'MPSC Combined Group C (Clerk / Tax / Excise)',
        slug: 'mpsc-group-c',
        count: 'Group C Services',
        pyqSubject: 'marathi',
        targetUrl: '/mpsc/group-c-previous-year-papers',
        badgeStatus: '88+ Official Sets',
        isCurating: false
      },
    ]
  },
  {
    id: 'maharashtra-direct',
    title: 'Maharashtra Direct Recruitments (TCS / IBPS)',
    titleMr: 'महाराष्ट्र सरळसेवा भरती (पोलीस, तलाठी, झेडपी)',
    badge: 'Direct Recruitment',
    colorClass: styles.badgeTeal,
    exams: [
      {
        name: 'Maharashtra Police Constable & Driver',
        slug: 'maharashtra-police',
        count: 'District & Unit Papers',
        pyqSubject: 'marathi',
        targetUrl: '/police-bharti-question-papers',
        badgeStatus: '12+ Unit Sets & Keys',
        isCurating: false
      },
      {
        name: 'Maharashtra Talathi Bharti (TCS Pattern)',
        slug: 'maharashtra-talathi',
        count: 'TCS Shift Papers',
        pyqSubject: 'reasoning',
        targetUrl: '/talathi-question-papers',
        badgeStatus: '10+ Shift Sets & Keys',
        isCurating: false
      },
      {
        name: 'Maharashtra Teacher Eligibility Test (MAHA TET)',
        slug: 'maha-tet',
        count: '2013–2026 Archive',
        pyqSubject: 'marathi',
        targetUrl: '/mahatet-previous-year-papers',
        badgeStatus: '49+ Official Sets & Keys',
        isCurating: false
      },
      {
        name: 'Maharashtra ZP Bharti (Gram Sevak / Arogya)',
        slug: 'maharashtra-zp',
        count: 'Gram Sevak & Arogya',
        pyqSubject: 'geography',
        targetUrl: '/syllabus/maharashtra-zp',
        badgeStatus: 'Archiving Official Sets',
        isCurating: true
      },
    ]
  },
  {
    id: 'central-exams',
    title: 'Central Government, SSC & Railways',
    titleMr: 'केंद्रीय परीक्षा, एसएससी व रेल्वे भरती',
    badge: 'Central Govt',
    colorClass: styles.badgeBlue,
    exams: [
      {
        name: 'UPSC Civil Services Prelims (GS + CSAT)',
        slug: 'upsc-cse',
        count: 'Official Papers & Keys',
        pyqSubject: 'polity',
        targetUrl: '/syllabus/upsc-cse',
        badgeStatus: 'Archiving Official Sets',
        isCurating: true
      },
      {
        name: 'SSC CGL Tier 1 & Tier 2',
        slug: 'ssc-cgl',
        count: 'Tier 1 & 2 Blueprint',
        pyqSubject: 'reasoning',
        targetUrl: '/syllabus/ssc-cgl',
        badgeStatus: 'Archiving Official Sets',
        isCurating: true
      },
      {
        name: 'SSC CHSL 10+2 Examination',
        slug: 'ssc-chsl',
        count: '10+2 Shift Blueprint',
        pyqSubject: 'english',
        targetUrl: '/syllabus/ssc-chsl',
        badgeStatus: 'Archiving Official Sets',
        isCurating: true
      },
      {
        name: 'RRB NTPC (Graduate & 12th Level)',
        slug: 'rrb-ntpc',
        count: 'CBT 1 & 2 Blueprint',
        pyqSubject: 'science',
        targetUrl: '/syllabus/rrb-ntpc',
        badgeStatus: 'Archiving Official Sets',
        isCurating: true
      },
      {
        name: 'RRB Group D (Level-1)',
        slug: 'rrb-group-d',
        count: 'Level-1 CBT Blueprint',
        pyqSubject: 'science',
        targetUrl: '/syllabus/rrb-group-d',
        badgeStatus: 'Archiving Official Sets',
        isCurating: true
      },
    ]
  },
  {
    id: 'banking',
    title: 'Banking & Financial Institutions',
    titleMr: 'बँकिंग व वित्तीय संस्था भरती',
    badge: 'Banking',
    colorClass: styles.badgePurple,
    exams: [
      {
        name: 'IBPS PO Prelims & Mains',
        slug: 'ibps-po',
        count: 'PO Prelims & Mains',
        pyqSubject: 'economy',
        targetUrl: '/syllabus/ibps-po',
        badgeStatus: 'Archiving Official Sets',
        isCurating: true
      },
      {
        name: 'IBPS Clerk (Regional Language)',
        slug: 'ibps-clerk',
        count: 'Regional Shift Blueprint',
        pyqSubject: 'reasoning',
        targetUrl: '/syllabus/ibps-clerk',
        badgeStatus: 'Archiving Official Sets',
        isCurating: true
      },
      {
        name: 'RBI Grade B Officer Phase 1 & 2',
        slug: 'rbi-grade-b',
        count: 'Phase 1 & Phase 2',
        pyqSubject: 'economy',
        targetUrl: '/syllabus/rbi-grade-b',
        badgeStatus: 'Archiving Official Sets',
        isCurating: true
      },
    ]
  }
]

export default function QuestionPapersPage() {
  const siteUrl = 'https://examudaan.in'

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where can I download MPSC previous year question papers with answer keys?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ExamUdaan provides direct links to over ${MPSC_TOTAL_QUESTION_PAPERS} official MPSC Rajyaseva, Combined Group B & C, and PSI/STI question papers from 2009 to 2026 along with official final answer keys validated by the commission.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Are Maharashtra Police Bharti and Talathi question papers based on TCS pattern?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our question paper library includes authentic TCS pattern shift questions for Talathi Bharti and official district-wise written question papers for Maharashtra Police Constable and Driver recruitment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I practice these previous year questions online interactively?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! In addition to reading PDF question papers, you can solve over 1,100 previous year questions interactively in our PYQ Question Bank and attempt full 100-question computer-based mock tests on ExamUdaan.',
        },
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Question Papers', item: `${siteUrl}/question-papers` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className={styles.pageWrapper}>
        <div className={styles.container}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>Previous Year Question Papers</span>
          </nav>

          {/* Hero Header */}
          <header className={styles.heroHeader}>
            <div className={styles.heroBadge}>
              100% Direct Official Sources
            </div>
            <h1 className={styles.heroTitle}>
              Previous Year Question Papers & Official Keys
            </h1>
            <p className={styles.heroDesc}>
              Read official question papers and verified final answer keys from {MPSC_ARCHIVE_YEARS_SPAN} for MPSC, Maharashtra Police Bharti, TCS Talathi, ZP, UPSC, SSC, and Railway exams — right in your browser. No sign-up, no ads.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/pyq" className={styles.btnPrimaryHero}>
                <span>🔍</span> Interactive 1,100+ PYQ Bank
              </Link>
              <Link href="/mock-tests" className={styles.btnSecondaryHero}>
                <span>⏱️</span> CBT Mock Tests & Practical Drills
              </Link>
            </div>
          </header>

          {/* Quick Jump Question Library Subject Pills */}
          <section className={styles.subjectSection}>
            <h2 className={styles.subjectSectionTitle}>
              Solve PYQs by Subject (Topic-wise Question Library)
            </h2>
            <div className={styles.subjectList}>
              {[
                { name: 'Polity (राज्यघटना)', slug: 'polity', count: '139 Qs' },
                { name: 'Marathi (मराठी व्याकरण)', slug: 'marathi', count: '119 Qs' },
                { name: 'History (इतिहास)', slug: 'history', count: '129 Qs' },
                { name: 'Geography (भूगोल)', slug: 'geography', count: '122 Qs' },
                { name: 'Science (विज्ञान)', slug: 'science', count: '124 Qs' },
                { name: 'Economy (अर्थव्यवस्था)', slug: 'economy', count: '132 Qs' },
                { name: 'Reasoning (बुद्धिमत्ता)', slug: 'reasoning', count: '119 Qs' },
                { name: 'Law (कायदा)', slug: 'law', count: '108 Qs' },
                { name: 'English (इंग्रजी)', slug: 'english', count: '108 Qs' },
              ].map(sub => (
                <Link
                  key={sub.slug}
                  href={`/pyq/${sub.slug}`}
                  className={styles.subjectPill}
                >
                  <span>{sub.name}</span>
                  <span className={styles.subjectPillCount}>
                    {sub.count}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Locally Hosted Clean MPSC PDFs ── */}
          <section className={styles.mpscArchiveCard}>
            <div className={styles.mpscArchiveHeader}>
              <div>
                <span className={styles.mpscTag}>
                  <span>🏛️</span> महाराष्ट्र लोकसेवा आयोग अधिकृत संग्रह (mpsc.gov.in)
                </span>
                <h2 className={styles.mpscTitle}>
                  MPSC मूळ प्रश्नपत्रिका व अंतिम उत्तरतालिका ({MPSC_ARCHIVE_YEARS_SPAN})
                </h2>
                <p className={styles.mpscDesc}>
                  थेट mpsc.gov.in कडून संकलित केलेल्या {MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('mr-IN')} अधिकृत PDF. ब्राउझरमध्ये वाचा किंवा थेट डाउनलोड करा.
                </p>
              </div>
              <div>
                <Link
                  href="/mpsc-pyq"
                  className={styles.mpscExploreBtn}
                >
                  <span>🏛️</span> सर्व {MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('mr-IN')} MPSC पेपर्स पहा →
                </Link>
              </div>
            </div>

            {/* 1-Row Exam Table */}
            <div className={styles.tableWrapper}>
              <div className={styles.tableScroll}>
                <div className={styles.tableContainer}>
                  {/* Desktop Table Header */}
                  <div className={styles.tableHeaderRow}>
                    <div>Examination / Advertisement</div>
                    <div>Official Question Paper</div>
                    <div>Official Answer Key</div>
                    <div className={styles.tableHeaderAction}>Action</div>
                  </div>

                  {/* Exam Rows */}
                  {mpscPairedExams.slice(0, 15).map((row, idx) => {
                    const qp = row.questionPaper
                    const ak = row.answerKey
                    const isEven = idx % 2 === 0

                    return (
                      <div
                        key={`${row.id}-${idx}`}
                        className={`${styles.tableDataRow} ${isEven ? styles.rowEven : styles.rowOdd}`}
                      >
                        {/* Exam Name */}
                        <div>
                          <div className={styles.examNameMeta}>
                            <span className={`${styles.yearPill} ${row.year >= 2024 ? styles.yearPillRecent : styles.yearPillOlder}`}>
                              {row.year}
                            </span>
                            {row.advertisementNumber && (
                              <span className={styles.advtBadge}>
                                Advt {row.advertisementNumber}
                              </span>
                            )}
                            {ak && (
                              <span className={styles.keyVerifiedBadge}>
                                ✓ Key Available
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/mpsc-pyq?docId=${row.id}&docType=qp`}
                            className={styles.examTitleLink}
                            title="View paper in workspace"
                          >
                            {row.titleMr || row.title}
                          </Link>
                          <div className={styles.examCadreSubtitle}>
                            {row.category} • {row.paperNameMr || row.paperName}
                          </div>
                        </div>

                        {/* Question Paper */}
                        <div>
                          {qp ? (
                            <Link
                              href={`/mpsc-pyq?docId=${row.id}&docType=qp`}
                              className={styles.docItemLink}
                              title={`View ${row.paperNameMr || row.paperName || 'Question Paper'} in Study Workspace`}
                            >
                              <div className={styles.docItemBox}>
                                <span className={styles.qpIcon}>📄</span>
                                <div className={styles.docTextWrap}>
                                  <div className={styles.docTitle} title={qp.title}>
                                     {row.paperNameMr || row.paperName || 'प्रश्नपत्रिका'}
                                  </div>
                                  <div className={styles.docMeta}>
                                    <span className={styles.qpBadge}>QP</span>
                                    <span>{qp.sizeFormatted || 'PDF'}</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ) : (
                            <span className={styles.curationBadge}>Paper Not Found</span>
                          )}
                        </div>

                        {/* Answer Key */}
                        <div>
                          {ak ? (
                            <Link
                              href={`/mpsc-pyq?docId=${row.id}&docType=ak`}
                              className={styles.docItemLink}
                              title={`View ${ak.isFinal ? 'Official Final Answer Key' : 'Answer Key'} in Study Workspace`}
                            >
                              <div className={styles.docItemBox}>
                                <span className={styles.qpIcon}>🔑</span>
                                <div className={styles.docTextWrap}>
                                  <div className={styles.docTitle} title={ak.title}>
                                    {ak.isFinal ? 'अंतिम उत्तरतालिका' : 'प्रथम उत्तरतालिका'}
                                  </div>
                                  <div className={styles.docMeta}>
                                    <span className={styles.akBadge}>
                                      {ak.isFinal ? 'FINAL KEY' : 'FIRST KEY'}
                                    </span>
                                    <span>{ak.sizeFormatted || 'PDF'}</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ) : (
                            <span className={styles.curationBadge}>Key in Verification</span>
                          )}
                        </div>

                        {/* Direct In-Browser Viewer CTA */}
                        <div>
                          <Link
                            href={`/mpsc-pyq?docId=${row.id}&docType=qp`}
                            className={styles.btnViewerDirect}
                          >
                            <span>📄</span> View Paper
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Mobile Card-Wise View (< 768px) */}
              <div className={styles.mobileCardsWrapper}>
                {mpscPairedExams.slice(0, 15).map((row, idx) => {
                  const qp = row.questionPaper
                  const ak = row.answerKey

                  return (
                    <div key={`mob-${row.id}-${idx}`} className={styles.mobilePaperCard}>
                      <div className={styles.mobileCardTopRow}>
                        <div className={styles.examNameMeta}>
                          <span className={`${styles.yearPill} ${row.year >= 2024 ? styles.yearPillRecent : styles.yearPillOlder}`}>
                            {row.year}
                          </span>
                          {row.advertisementNumber && (
                            <span className={styles.advtBadge}>
                              Advt {row.advertisementNumber}
                            </span>
                          )}
                          {ak && (
                            <span className={styles.keyVerifiedBadge}>
                              ✓ Key Available
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/mpsc-pyq?docId=${row.id}&docType=qp`}
                        className={styles.mobileExamTitleLink}
                        title="View paper"
                      >
                        {row.titleMr || row.title}
                      </Link>

                      <div className={styles.examCadreSubtitle}>
                        {row.category} • {row.paperNameMr || row.paperName}
                      </div>

                      <div className={styles.mobileDocsRow}>
                        {qp && (
                          <Link
                            href={`/mpsc-pyq?docId=${row.id}&docType=qp`}
                            className={styles.mobileDocLink}
                            title="View Question Paper"
                          >
                            <div className={styles.mobileDocPill}>
                              <span className={styles.qpIconSmall}>📄</span>
                              <span>{row.paperNameMr || row.paperName || 'प्रश्नपत्रिका'}</span>
                              <span className={styles.qpBadge}>{qp.sizeFormatted || 'PDF'}</span>
                            </div>
                          </Link>
                        )}
                        {ak && (
                          <Link
                            href={`/mpsc-pyq?docId=${row.id}&docType=ak`}
                            className={styles.mobileDocLink}
                            title="View Answer Key"
                          >
                            <div className={styles.mobileDocPill}>
                              <span className={styles.qpIconSmall}>🔑</span>
                              <span>{ak.isFinal ? 'अंतिम उत्तरतालिका' : 'उत्तरतालिका'}</span>
                              <span className={styles.akBadge}>{ak.sizeFormatted || 'PDF'}</span>
                            </div>
                          </Link>
                        )}
                      </div>

                      <div className={styles.mobileActionRow}>
                        <Link
                          href={`/mpsc-pyq?docId=${row.id}&docType=qp`}
                          className={styles.btnViewerDirectMobile}
                        >
                          <span>📄</span> View Paper
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* View All MPSC CTA Bar */}
            <div className={styles.viewAllMpscBar}>
              <p className={styles.viewAllMpscText}>
                एकूण {mpscPairedExams.length} अधिकृत MPSC परीक्षा संच (209 प्रश्नपत्रिका व उत्तरतालिका) उपलब्ध आहेत.
              </p>
              <Link
                href="/mpsc-pyq"
                className={styles.viewAllMpscBtn}
              >
                सर्व {mpscPairedExams.length} परीक्षा संच इन-ब्राउझर व्ह्यूअरमध्ये उघडा (Open MPSC Archive) →
              </Link>
            </div>

            {/* ── Related Content Bar ── */}
            <div className={styles.nextActionBar}>
              <p className={styles.nextActionTitle}>
                📚 प्रश्नपत्रिका वाचल्यानंतर — पुढे काय करायचे?
              </p>
              <div className={styles.nextActionLinks}>
                <Link href="/pyq" className={`${styles.actionLinkBtn} ${styles.actionLinkOrange}`}>
                  🔍 1,100+ PYQ Practice Bank
                </Link>
                <Link href="/mock-tests" className={`${styles.actionLinkBtn} ${styles.actionLinkBlue}`}>
                  ⏱️ Full CBT Mock Tests
                </Link>
                <Link href="/ai-tools" className={`${styles.actionLinkBtn} ${styles.actionLinkPurple}`}>
                  🤖 114 Free AI Study Tools
                </Link>
                <Link href="/study-planner" className={`${styles.actionLinkBtn} ${styles.actionLinkTeal}`}>
                  📅 AI Study Planner
                </Link>
                <Link href="/score-calculator" className={`${styles.actionLinkBtn} ${styles.actionLinkGray}`}>
                  🧮 Score Calculator
                </Link>
              </div>
            </div>
          </section>

          {/* Grouped Exam Sections */}
          <div className={styles.groupsContainer}>
            {EXAM_GROUPS.map(group => (
              <section
                key={group.id}
                className={styles.groupSection}
              >
                <div className={styles.groupHeader}>
                  <div>
                    <span className={`${styles.groupBadge} ${group.colorClass}`}>
                      {group.badge}
                    </span>
                    <h2 className={styles.groupTitle}>
                      {group.title}
                    </h2>
                    <p className={styles.groupSubtitle}>
                      {group.titleMr}
                    </p>
                  </div>
                </div>

                <div className={styles.examGrid}>
                  {group.exams.map(exam => {
                    return (
                      <div
                        key={exam.slug}
                        className={styles.examCard}
                      >
                        <div>
                          <div className={styles.examCardTop}>
                            <span className={styles.examBadge}>
                              {exam.count}
                            </span>
                            <span className={exam.isCurating ? styles.curationBadge : styles.archiveBadgeActive}>
                              {exam.badgeStatus}
                            </span>
                          </div>
                          <h3 className={styles.examName}>
                            {exam.name}
                          </h3>

                          {exam.isCurating ? (
                            <p className={styles.curationNotice}>
                              Official commission question papers & final answer keys currently undergoing quality curation. Solve verified syllabus questions and mock sets below.
                            </p>
                          ) : (
                            <p className={`${styles.curationNotice} ${styles.curationNoticeActive}`}>
                              ✓ Full verified question paper sets with answer keys available. View papers online or attempt timed test.
                            </p>
                          )}
                        </div>

                        <div className={styles.cardBtnRow}>
                          {exam.isCurating ? (
                            <>
                              <Link
                                href={`/pyq/${exam.pyqSubject}`}
                                className={styles.btnCurationPractice}
                              >
                                Solve {exam.name.split(' ')[0]} PYQs ➔
                              </Link>
                              <Link
                                href={exam.targetUrl}
                                className={styles.btnCurationSyllabus}
                              >
                                Syllabus & Blueprint ➔
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link
                                href={exam.targetUrl}
                                className={styles.btnOpenArchive}
                              >
                                View Papers & Keys ➔
                              </Link>
                              <Link
                                href={`/pyq/${exam.pyqSubject}`}
                                className={styles.btnSolvePyqs}
                              >
                                Solve Online PYQs ➔
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
