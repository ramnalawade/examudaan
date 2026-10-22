// ============================================================
// app/talathi-bharti-2026/page.js — Talathi Bharti 2026 Hub
// Target Query: "talathi bharti 2026" (60,500 monthly searches)
// ExamUdaan | Official dates, TCS pattern, syllabus, mock tests & PYQ
// ============================================================

import React from 'react'
import Link from 'next/link'
import styles from '@/components/examHub.module.css'

export const metadata = {
  title: {
    absolute: 'Talathi Bharti 2026 — Dates, TCS Pattern & Syllabus | ExamUdaan',
  },
  description: 'Maharashtra Talathi Bharti 2026 live updates: notification dates, eligibility, 200-mark TCS exam pattern, district vacancies, and free mock tests & PYQs.',
  keywords: [
    'talathi bharti 2026', 'talathi syllabus', 'talathi exam date 2026',
    'talathi question paper', 'talathi eligibility', 'tcs talathi mock test'
  ],
  alternates: {
    canonical: 'https://examudaan.in/talathi-bharti-2026',
  },
  openGraph: {
    title: 'Talathi Bharti 2026 — Dates, TCS Pattern & Syllabus | ExamUdaan',
    description: 'Maharashtra Talathi Bharti 2026 live updates: notification dates, eligibility, 200-mark TCS exam pattern, district vacancies, and free mock tests & PYQs.',
    url: 'https://examudaan.in/talathi-bharti-2026',
    siteName: 'ExamUdaan.in',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Talathi Bharti 2026 — Dates, TCS Pattern & Syllabus | ExamUdaan',
    description: 'Maharashtra Talathi Bharti 2026 live updates: notification dates, eligibility, 200-mark TCS exam pattern & free mock tests.',
  },
}

export default function TalathiBharti2026Page() {
  const currentDate = 'October 21, 2026'

  const faqList = [
    {
      q: 'When will Maharashtra Talathi Bharti 2026 notification be announced?',
      a: 'The Maharashtra Revenue and Forest Department is preparing the district-wise vacancy rosters for 2026. Official registration notification is expected via the Mahabhumi TCS portal once the state cabinet finalizes cadre requisitions.',
    },
    {
      q: 'What is the educational qualification for Talathi Bharti 2026?',
      a: 'Candidates must possess a Bachelor Degree (Graduation) in any stream from a recognized university. Knowledge of Marathi is mandatory. MS-CIT / computer certification can be submitted within 2 years of appointment.',
    },
    {
      q: 'What is the TCS Talathi exam pattern and marking scheme?',
      a: 'The computer-based test consists of 100 questions carrying 200 marks (2 marks per question) with a duration of 120 minutes. There is NO negative marking. Subjects: Marathi (25 Qs), English (25 Qs), General Knowledge (25 Qs), and Intellectual Test/Maths (25 Qs).',
    },
    {
      q: 'What is the age limit for Maharashtra Talathi examination?',
      a: 'Minimum age is 18 years. Maximum age is 38 years for Open/General category candidates and 43 years for Reserved category (OBC, SC, ST, EWS, SEBC) candidates, plus category-specific relaxations.',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: 'Maharashtra Talathi Bharti 2026: Notification, Exam Pattern, Dates & Preparation Guide',
    datePublished: '2026-10-21T00:00:00+05:30',
    dateModified: '2026-10-21T00:00:00+05:30',
    description: 'Comprehensive guide and live updates for Maharashtra Talathi Bharti 2026 recruitment examination.',
    publisher: {
      '@type': 'Organization',
      name: 'ExamUdaan',
      url: 'https://examudaan.in',
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <main className={styles.hubPageWrapper}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ── Hero Section ── */}
      <section className={styles.hubHero}>
        <div className="container">
          <div className={styles.liveBadgeRow}>
            <span className={styles.liveBadge}>
              <span className={styles.livePulse} />
              Live Updates 2026
            </span>
            <span className={styles.updatedDate}>
              <span className="material-symbols-outlined">schedule</span>
              Last verified: {currentDate}
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            Maharashtra <span className={styles.heroTitleHighlight}>Talathi Bharti 2026</span> — Exam Dates, TCS Pattern &amp; Syllabus
          </h1>

          <p className={styles.heroSubtitle}>
            Complete preparation tracker for Maharashtra Revenue Department Talathi (Group C) examination. Official notification schedule, district eligibility criteria, 200-mark TCS rubric, and verified practice papers.
          </p>

          <div className={styles.quickActionStrip}>
            <Link href="/talathi-bharti-apply-online" className={styles.quickActionBtnPrimary}>
              <span className="material-symbols-outlined">how_to_reg</span>
              Apply Online Guide 2026
            </Link>
            <Link href="/talathi-question-papers" className={styles.quickActionBtnOutline}>
              <span className="material-symbols-outlined">description</span>
              TCS Solved Papers &amp; Keys
            </Link>
            <Link href="/syllabus/maharashtra-talathi" className={styles.quickActionBtnOutline}>
              <span className="material-symbols-outlined">menu_book</span>
              Official Talathi Syllabus
            </Link>
            <Link href="/mock-tests/maharashtra-talathi-tcs-mock" className={styles.quickActionBtnOutline}>
              <span className="material-symbols-outlined">quiz</span>
              Free TCS Mock Test
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Conducting Body</span>
              <span className={styles.overviewVal}>TCS / Mahabhumi</span>
              <span className={styles.overviewSub}>Revenue Dept</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Total Vacancies</span>
              <span className={styles.overviewVal}>~4,600+ Posts</span>
              <span className={styles.overviewSub}>District-wise</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Pay Scale</span>
              <span className={styles.overviewVal}>S-8 Level</span>
              <span className={styles.overviewSub}>₹25,500 – ₹81,100</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Exam Format</span>
              <span className={styles.overviewVal}>200 Marks CBT</span>
              <span className={styles.overviewSub}>No Negative Marking</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* ── Key Dates & Timeline ── */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Official Timetable</div>
            <h2 className={styles.sectionTitle}>Talathi Bharti 2026 Expected Schedule</h2>
            <p className={styles.sectionSubtitle}>
              Stay ahead with verified dates for application form release, objection tracking, and exam shifts.
            </p>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Event / Milestone</th>
                  <th>Expected Date / Status</th>
                  <th>Official Notification Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Official Requisition &amp; Cadre Approval</strong></td>
                  <td><span className={styles.tableTagGreen}>Approved by State Cabinet</span></td>
                  <td>Revenue &amp; Forest Department</td>
                </tr>
                <tr>
                  <td><strong>Online Application Window</strong></td>
                  <td><span className={styles.tableTagOrange}>Expected Q1/Q2 2026</span></td>
                  <td>mahabhumi.gov.in / TCS iON</td>
                </tr>
                <tr>
                  <td><strong>Hall Ticket / Admit Card Release</strong></td>
                  <td>7 Days Prior to Exam Shifts</td>
                  <td>Direct Hall Ticket Portal</td>
                </tr>
                <tr>
                  <td><strong>Online Computer-Based Examination</strong></td>
                  <td>Multiple Shifts (TCS Normalized)</td>
                  <td>36 District Exam Centers</td>
                </tr>
                <tr>
                  <td><strong>TCS Provisional Answer Key &amp; Objections</strong></td>
                  <td>Within 72 Hours of Last Shift</td>
                  <td>Response Sheet Viewer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── TCS Exam Pattern (200 Marks) ── */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Exam Pattern Breakdown</div>
            <h2 className={styles.sectionTitle}>TCS 200-Mark Question Distribution</h2>
            <p className={styles.sectionSubtitle}>
              The exam consists of 100 multiple choice questions with 2 marks each. Speed and high accuracy in Marathi Grammar are decisive for final merit.
            </p>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Section / Subject</th>
                  <th>No. of Questions</th>
                  <th>Total Marks</th>
                  <th>Difficulty Level &amp; Syllabus Focus</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Marathi Language (मराठी व्याकरण)</strong></td>
                  <td>25 Questions</td>
                  <td>50 Marks</td>
                  <td>12th Standard: समास, प्रयोग, समानार्थी/विरुद्धार्थी, म्हणी</td>
                </tr>
                <tr>
                  <td><strong>English Language</strong></td>
                  <td>25 Questions</td>
                  <td>50 Marks</td>
                  <td>12th Standard: Idioms, Tenses, Error Spotting, Vocab</td>
                </tr>
                <tr>
                  <td><strong>General Knowledge (सामान्य ज्ञान)</strong></td>
                  <td>25 Questions</td>
                  <td>50 Marks</td>
                  <td>Degree Level: Maharashtra History, Geography, RTI 2005</td>
                </tr>
                <tr>
                  <td><strong>Intellectual Test &amp; Maths (बुद्धिमत्ता व अंकगणित)</strong></td>
                  <td>25 Questions</td>
                  <td>50 Marks</td>
                  <td>Degree Level: Reasoning, Percentages, Time &amp; Work</td>
                </tr>
                <tr>
                  <td><strong>Total Composite</strong></td>
                  <td><strong>100 Questions</strong></td>
                  <td><strong>200 Marks</strong></td>
                  <td><strong>120 Minutes (2 Hours) • No Negative Marking</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Ecosystem Resources ── */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Preparation Tools</div>
            <h2 className={styles.sectionTitle}>Dedicated Talathi Study Resources</h2>
            <p className={styles.sectionSubtitle}>
              Access official syllabi, previous papers, shift cut-offs, and free online practice tests.
            </p>
          </div>

          <div className={styles.resourceGrid}>
            <Link href="/syllabus/maharashtra-talathi" className={styles.resourceCard}>
              <div className={styles.resourceCardTop}>
                <div className={styles.resourceIcon}>
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <span className={styles.resourceBadge}>Official Syllabus</span>
              </div>
              <h3 className={styles.resourceTitle}>Detailed Talathi Topic Blueprint</h3>
              <p className={styles.resourceDesc}>
                Micro-level breakdown of all 4 subjects with recommended booklist and Marathi grammar chapter weightage.
              </p>
              <span className={styles.resourceCta}>
                <span>View Full Syllabus</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/mock-tests/maharashtra-talathi-tcs-mock" className={styles.resourceCard}>
              <div className={styles.resourceCardTop}>
                <div className={styles.resourceIcon}>
                  <span className="material-symbols-outlined">quiz</span>
                </div>
                <span className={styles.resourceBadge}>Free Online Mock</span>
              </div>
              <h3 className={styles.resourceTitle}>TCS Pattern Timed Mock Test</h3>
              <p className={styles.resourceDesc}>
                Experience authentic computer-based testing conditions with instant scorecard and percentile rank analysis.
              </p>
              <span className={styles.resourceCta}>
                <span>Start Practice Test</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/pyq" className={styles.resourceCard}>
              <div className={styles.resourceCardTop}>
                <div className={styles.resourceIcon}>
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <span className={styles.resourceBadge}>15-Yr PYQ Bank</span>
              </div>
              <h3 className={styles.resourceTitle}>Talathi Solved Question Papers</h3>
              <p className={styles.resourceDesc}>
                Search and practice previous year Talathi questions organized by topic, grammar rule, and difficulty.
              </p>
              <span className={styles.resourceCta}>
                <span>Browse Solved Papers</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>
          </div>
        </section>

        {/* ── Frequently Asked Questions ── */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Aspirant Helpdesk</div>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>
              Essential answers on eligibility relaxations, syllabus coverage, and normalization.
            </p>
          </div>

          <div className={styles.faqGrid}>
            {faqList.map((item, idx) => (
              <div key={idx} className={styles.faqCard}>
                <h3 className={styles.faqQuestion}>{item.q}</h3>
                <p className={styles.faqAnswer}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
