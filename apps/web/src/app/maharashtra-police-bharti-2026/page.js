// ============================================================
// app/maharashtra-police-bharti-2026/page.js — Police Bharti 2026 Hub
// Target Query: "maharashtra police bharti 2026" (14,800 monthly searches)
// ExamUdaan | Physical test 50M, Written 100M, merit calculator & syllabus
// ============================================================

import React from 'react'
import Link from 'next/link'
import styles from '@/components/examHub.module.css'

export const metadata = {
  title: {
    absolute: 'Maharashtra Police Bharti 2026 — Dates, Physical & Syllabus | ExamUdaan',
  },
  description: 'Maharashtra Police Bharti 2026 updates: 17,000+ posts, physical test standards (50 marks), written exam pattern (100 marks), merit calculator & question papers.',
  keywords: [
    'maharashtra police bharti 2026', 'police bharti physical test 50 marks',
    'police bharti syllabus 2026', 'police bharti merit calculator',
    'police bharti question paper', 'srpf bharti 2026'
  ],
  alternates: {
    canonical: 'https://examudaan.in/maharashtra-police-bharti-2026',
  },
  openGraph: {
    title: 'Maharashtra Police Bharti 2026 — Dates, Physical & Syllabus | ExamUdaan',
    description: 'Maharashtra Police Bharti 2026 updates: 17,000+ posts, physical test standards (50 marks), written exam pattern (100 marks), merit calculator & question papers.',
    url: 'https://examudaan.in/maharashtra-police-bharti-2026',
    siteName: 'ExamUdaan.in',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Maharashtra Police Bharti 2026 — Dates, Physical & Syllabus | ExamUdaan',
    description: 'Maharashtra Police Bharti 2026 updates: physical standards, 100-mark written test & free mock tests.',
  },
}

export default function MaharashtraPoliceBharti2026Page() {
  const currentDate = 'October 21, 2026'

  const faqList = [
    {
      q: 'What is the selection process for Maharashtra Police Constable 2026?',
      a: 'Selection is conducted in two main phases: Phase 1 is the Physical Efficiency Test (PET) & Physical Measurement Test (PMT) for 50 Marks. Candidates securing at least 50% in PET (25 marks) qualify for Phase 2: Written Examination of 100 Marks (1:10 ratio). Final merit is compiled out of 150 marks.',
    },
    {
      q: 'What are the events in the 50-mark physical test for male candidates?',
      a: 'Male candidates undergo 3 events: 1600 Meters Run (20 Marks), 100 Meters Sprint (15 Marks), and Shot Put / गोळाफेक (15 Marks, weight 7.26 kg).',
    },
    {
      q: 'What are the events in the 50-mark physical test for female candidates?',
      a: 'Female candidates undergo 3 events: 800 Meters Run (20 Marks), 100 Meters Sprint (15 Marks), and Shot Put / गोळाफेक (15 Marks, weight 4.0 kg).',
    },
    {
      q: 'What is the educational qualification and age limit for Maharashtra Police Bharti?',
      a: 'Candidates must be 12th Pass (Higher Secondary) from a recognized board. Age limit is 18 to 28 years for Open category, with an extension up to 33 years for Reserved category candidates (OBC, SC, ST, VJ/NT, EWS, SEBC).',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: 'Maharashtra Police Bharti 2026: Notification, Physical Standards, Exam Pattern & Timetable',
    datePublished: '2026-10-21T00:00:00+05:30',
    dateModified: '2026-10-21T00:00:00+05:30',
    description: 'Complete verified portal for Maharashtra Police Constable, SRPF, Driver, and Bandsman recruitment 2026.',
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
              Recruitment Desk 2026
            </span>
            <span className={styles.updatedDate}>
              <span className="material-symbols-outlined">schedule</span>
              Last verified: {currentDate}
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            Maharashtra <span className={styles.heroTitleHighlight}>Police Bharti 2026</span> — Physical Standards, Written Exam &amp; Merit Cutoff
          </h1>

          <p className={styles.heroSubtitle}>
            Authoritative resource hub for Maharashtra Police Constable, SRPF, and Police Driver recruitment. Complete 50-mark physical norms, 100-mark written syllabus, physical merit calculator, and free mock tests.
          </p>

          <div className={styles.quickActionStrip}>
            <Link href="/police-calculator" className={styles.quickActionBtnPrimary}>
              <span className="material-symbols-outlined">calculate</span>
              150-Mark Merit Calculator
            </Link>
            <Link href="/police-bharti-hall-ticket-2026" className={styles.quickActionBtnOutline}>
              <span className="material-symbols-outlined">badge</span>
              Hall Ticket 2026 (Live)
            </Link>
            <Link href="/police-bharti-question-papers" className={styles.quickActionBtnOutline}>
              <span className="material-symbols-outlined">description</span>
              Solved Papers &amp; Answer Keys
            </Link>
            <Link href="/syllabus/maharashtra-police" className={styles.quickActionBtnOutline}>
              <span className="material-symbols-outlined">menu_book</span>
              Written Syllabus &amp; Booklist
            </Link>
            <Link href="/mock-tests/maharashtra-police-written-mock" className={styles.quickActionBtnOutline}>
              <span className="material-symbols-outlined">quiz</span>
              100-Mark Practice Mock Test
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Recruitment Posts</span>
              <span className={styles.overviewVal}>~17,000+ Posts</span>
              <span className={styles.overviewSub}>Constable &amp; Driver</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Phase 1 Physical</span>
              <span className={styles.overviewVal}>50 Marks</span>
              <span className={styles.overviewSub}>Min 25 Marks to Qualify</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Phase 2 Written</span>
              <span className={styles.overviewVal}>100 Marks</span>
              <span className={styles.overviewSub}>90 Minutes • OMR / CBT</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Final Selection</span>
              <span className={styles.overviewVal}>150 Marks Merit</span>
              <span className={styles.overviewSub}>Physical + Written</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* ── Physical Efficiency Test (50 Marks) ── */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Physical Test Norms (50 Marks)</div>
            <h2 className={styles.sectionTitle}>Physical Efficiency Test (PET) Marks Matrix</h2>
            <p className={styles.sectionSubtitle}>
              Candidates must score at least 50% (25 marks) in the physical test to be eligible for the written examination.
            </p>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Category / Gender</th>
                  <th>Running Event 1</th>
                  <th>Running Event 2</th>
                  <th>Shot Put (गोळाफेक)</th>
                  <th>Total PET Marks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Male Candidates (पुरुष उमेदवार)</strong></td>
                  <td>1,600 Meters Run (20 Marks)</td>
                  <td>100 Meters Sprint (15 Marks)</td>
                  <td>Shot Put 7.26 Kg (15 Marks, 8.5m+ for full marks)</td>
                  <td><strong>50 Marks</strong></td>
                </tr>
                <tr>
                  <td><strong>Female Candidates (महिला उमेदवार)</strong></td>
                  <td>800 Meters Run (20 Marks)</td>
                  <td>100 Meters Sprint (15 Marks)</td>
                  <td>Shot Put 4.00 Kg (15 Marks, 6.0m+ for full marks)</td>
                  <td><strong>50 Marks</strong></td>
                </tr>
                <tr>
                  <td><strong>Police Driver Candidates (चालक शिपाई)</strong></td>
                  <td>1,600m / 800m Run (30 Marks)</td>
                  <td>Shot Put (20 Marks)</td>
                  <td>Additional Driving Skill Test (50 Marks - Qualifying)</td>
                  <td><strong>50 Marks Physical</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Written Examination (100 Marks) ── */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Written Exam Structure (100 Marks)</div>
            <h2 className={styles.sectionTitle}>100-Mark Written Exam Syllabus &amp; Distribution</h2>
            <p className={styles.sectionSubtitle}>
              Duration is 90 minutes. Questions are in Marathi language and multiple-choice objective format.
            </p>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Questions</th>
                  <th>Marks</th>
                  <th>Key Focus Areas &amp; Preparation Strategy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Mathematics (अंकगणित)</strong></td>
                  <td>25 Qs</td>
                  <td>25 Marks</td>
                  <td>LCM/HCF, Ratio-Proportion, Average, Percentages, Profit &amp; Loss</td>
                </tr>
                <tr>
                  <td><strong>Intellectual Reasoning (बुद्धिमत्ता चाचणी)</strong></td>
                  <td>25 Qs</td>
                  <td>25 Marks</td>
                  <td>Series completion, Analogies, Coding-Decoding, Direction test</td>
                </tr>
                <tr>
                  <td><strong>Marathi Grammar (मराठी व्याकरण)</strong></td>
                  <td>25 Qs</td>
                  <td>25 Marks</td>
                  <td>वर्णमाला, संधी, नाम, सर्वनाम, काळ, विभक्ती, समास, शब्दसंग्रह</td>
                </tr>
                <tr>
                  <td><strong>GK &amp; Current Affairs (सामान्य ज्ञान व चालू घडामोडी)</strong></td>
                  <td>25 Qs</td>
                  <td>25 Marks</td>
                  <td>Maharashtra Police administration, History, Constitution, Daily CA</td>
                </tr>
                <tr>
                  <td><strong>Total Composite</strong></td>
                  <td><strong>100 Qs</strong></td>
                  <td><strong>100 Marks</strong></td>
                  <td><strong>90 Minutes (1.5 Hours) • Minimum 40% to qualify</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Direct Ecosystem Links ── */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Preparation Tools</div>
            <h2 className={styles.sectionTitle}>Dedicated Police Bharti Resources</h2>
            <p className={styles.sectionSubtitle}>
              Simulate your 150-mark composite cutoff score, download blueprints, and take timed mock exams.
            </p>
          </div>

          <div className={styles.resourceGrid}>
            <Link href="/police-calculator" className={styles.resourceCard}>
              <div className={styles.resourceCardTop}>
                <div className={styles.resourceIcon}>
                  <span className="material-symbols-outlined">calculate</span>
                </div>
                <span className={styles.resourceBadge}>Instant Tool</span>
              </div>
              <h3 className={styles.resourceTitle}>150-Mark Physical &amp; Written Calculator</h3>
              <p className={styles.resourceDesc}>
                Enter your 1600m run timing, shot put distance, and written mock marks to predict your composite rank.
              </p>
              <span className={styles.resourceCta}>
                <span>Calculate Your Score</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/syllabus/maharashtra-police" className={styles.resourceCard}>
              <div className={styles.resourceCardTop}>
                <div className={styles.resourceIcon}>
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <span className={styles.resourceBadge}>Official Blueprint</span>
              </div>
              <h3 className={styles.resourceTitle}>Official Police Constable Syllabus</h3>
              <p className={styles.resourceDesc}>
                Complete subject rubrics, standard reference books, and physical measurement exemption norms.
              </p>
              <span className={styles.resourceCta}>
                <span>View Syllabus</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/mock-tests/maharashtra-police-written-mock" className={styles.resourceCard}>
              <div className={styles.resourceCardTop}>
                <div className={styles.resourceIcon}>
                  <span className="material-symbols-outlined">quiz</span>
                </div>
                <span className={styles.resourceBadge}>Free Online Mock</span>
              </div>
              <h3 className={styles.resourceTitle}>100-Question Written Mock Test</h3>
              <p className={styles.resourceDesc}>
                Full-length practice test mirroring authentic Maharashtra Police exam papers with detailed answer keys.
              </p>
              <span className={styles.resourceCta}>
                <span>Start Mock Test</span>
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
              Essential guidance on height measurements, chest expansion, and category concessions.
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
