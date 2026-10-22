// ============================================================
// app/mpsc-exam-dates-2026/page.js — MPSC Exam Dates 2026 Hub
// Target Query: "mpsc exam date 2026" (18,100 monthly searches)
// ExamUdaan | Official 2026 calendar, Rajyaseva, Combined B & C schedule
// ============================================================

import React from 'react'
import Link from 'next/link'
import styles from '@/components/examHub.module.css'

export const metadata = {
  title: {
    absolute: 'MPSC Exam Date 2026 — Official Calendar & Schedule | ExamUdaan',
  },
  description: 'Official MPSC Exam Dates 2026: Rajyaseva, Combined Group B & C Prelims/Mains timetable, notification schedule, 841+ PYQ papers & answer key links.',
  keywords: [
    'mpsc exam date 2026', 'mpsc timetable 2026', 'mpsc calendar 2026',
    'mpsc rajyaseva exam date', 'mpsc combined group b c date 2026',
    'mpsc hall ticket 2026', 'mpsc answer key 2026'
  ],
  alternates: {
    canonical: 'https://examudaan.in/mpsc-exam-dates-2026',
  },
  openGraph: {
    title: 'MPSC Exam Date 2026 — Official Calendar & Schedule | ExamUdaan',
    description: 'Official MPSC Exam Dates 2026: Rajyaseva, Combined Group B & C Prelims/Mains timetable, notification schedule, 841+ PYQ papers & answer key links.',
    url: 'https://examudaan.in/mpsc-exam-dates-2026',
    siteName: 'ExamUdaan.in',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'MPSC Exam Date 2026 — Official Calendar & Schedule | ExamUdaan',
    description: 'Official MPSC 2026 timetable, Rajyaseva & Combined exam dates, and 841+ question papers.',
  },
}

export default function MpscExamDates2026Page() {
  const currentDate = 'October 21, 2026'

  const faqList = [
    {
      q: 'Where can I download the official MPSC 2026 Annual Calendar (वेळापत्रक)?',
      a: 'The annual examination calendar is published on the official portal mpsc.gov.in under the "Candidate Information > Examination Schedule" section. ExamUdaan tracks real-time commission circulars and updates dates immediately.',
    },
    {
      q: 'When is the MPSC Civil Services (Rajyaseva) Preliminary Examination 2026?',
      a: 'The Rajyaseva Preliminary exam is scheduled as per the Maharashtra Public Service Commission revised gazette timetable. Candidates must clear GS Paper 1 and qualify CSAT Paper 2 (minimum 33% / 66 marks) to be considered for Mains merit.',
    },
    {
      q: 'When will MPSC Combined Group B and Group C Prelims 2026 be conducted?',
      a: 'The Combined Group B & C Non-Gazetted Preliminary Examination notification is typically issued in early Q1/Q2, with the single composite preliminary paper (100 questions, 100 marks, 1 hour) conducted across all district centers.',
    },
    {
      q: 'How many days before the exam does MPSC release the Hall Ticket?',
      a: 'MPSC releases admission certificates (Hall Tickets) exactly 7 to 10 days before the scheduled exam date through the candidate profile login at mpsconline.gov.in.',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: 'MPSC Exam Dates 2026: Official Calendar, Timetable, Notification & Prelims/Mains Schedule',
    datePublished: '2026-10-21T00:00:00+05:30',
    dateModified: '2026-10-21T00:00:00+05:30',
    description: 'Official dates, circular updates, syllabus blueprints, and previous year question papers for all MPSC examinations in 2026.',
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
              Commission Timetable 2026
            </span>
            <span className={styles.updatedDate}>
              <span className="material-symbols-outlined">schedule</span>
              Last verified: {currentDate}
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            Official <span className={styles.heroTitleHighlight}>MPSC Exam Dates 2026</span> — Annual Calendar, Schedule &amp; Timetable
          </h1>

          <p className={styles.heroSubtitle}>
            Consolidated examination schedule for Maharashtra Public Service Commission (MPSC). Track Rajyaseva, Combined Group B &amp; Group C (PSI, STI, ASO, Clerk-Typist), Agriculture, and Engineering exam dates.
          </p>

          <div className={styles.quickActionStrip}>
            <Link href="/mpsc-pyq" className={styles.quickActionBtnPrimary}>
              <span className="material-symbols-outlined">description</span>
              Browse 841+ MPSC Papers &amp; Keys
            </Link>
            <Link href="/syllabus/mpsc" className={styles.quickActionBtnOutline}>
              <span className="material-symbols-outlined">account_balance</span>
              343 Official Exam Syllabi
            </Link>
            <Link href="/mpsc-syllabus/1181" className={styles.quickActionBtnOutline}>
              <span className="material-symbols-outlined">military_tech</span>
              Descriptive Rajyaseva Blueprint
            </Link>
            <Link href="/mock-tests/mpsc-combined-full-prelims" className={styles.quickActionBtnOutline}>
              <span className="material-symbols-outlined">quiz</span>
              Combined Prelims Mock Test
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Conducting Body</span>
              <span className={styles.overviewVal}>MPSC (mpsc.gov.in)</span>
              <span className={styles.overviewSub}>Govt of Maharashtra</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Paired Exam Archive</span>
              <span className={styles.overviewVal}>429 Exam Sets</span>
              <span className={styles.overviewSub}>841+ PDFs with Answer Keys</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Official Syllabi</span>
              <span className={styles.overviewVal}>343 Gazettes</span>
              <span className={styles.overviewSub}>Group A, B &amp; C</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>Negative Marking</span>
              <span className={styles.overviewVal}>1/4th (25%)</span>
              <span className={styles.overviewSub}>Standard MPSC Rule</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* ── Official Examination Timetable ── */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Commission Schedule</div>
            <h2 className={styles.sectionTitle}>MPSC 2026 Major Examination Calendar</h2>
            <p className={styles.sectionSubtitle}>
              Official dates and planned notification windows across Maharashtra gazetted and non-gazetted recruitment cadres.
            </p>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Examination Cadre</th>
                  <th>Preliminary Exam Date</th>
                  <th>Mains Exam Date</th>
                  <th>Cadre Posts / Services</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Maharashtra Gazetted Civil Services (राज्यसेवा)</strong></td>
                  <td><span className={styles.tableTagOrange}>Scheduled per Calendar</span></td>
                  <td>Descriptive Format (9 Papers)</td>
                  <td>Deputy Collector, DSP/ACP, Tehsildar, BDO (Group A &amp; B)</td>
                </tr>
                <tr>
                  <td><strong>Combined Non-Gazetted Services (गट-ब संयुक्त)</strong></td>
                  <td><span className={styles.tableTagBlue}>100 Marks Single Paper</span></td>
                  <td>Paper 1 &amp; Paper 2 (Objective)</td>
                  <td>Police Sub-Inspector (PSI), State Tax Inspector (STI), ASO</td>
                </tr>
                <tr>
                  <td><strong>Combined Non-Gazetted Services (गट-क संयुक्त)</strong></td>
                  <td><span className={styles.tableTagBlue}>100 Marks Single Paper</span></td>
                  <td>Paper 1 &amp; Paper 2 (Objective)</td>
                  <td>Clerk-Typist, Tax Assistant, Technical Assistant, Excise SI</td>
                </tr>
                <tr>
                  <td><strong>Maharashtra Agriculture Services (कृषी सेवा)</strong></td>
                  <td>Combined Gazetted Preliminary</td>
                  <td>Subject Specific Mains</td>
                  <td>Taluka Agriculture Officer, Agricultural Officer Group A &amp; B</td>
                </tr>
                <tr>
                  <td><strong>Maharashtra Engineering Services (अभियांत्रिकी)</strong></td>
                  <td>Combined Gazetted Preliminary</td>
                  <td>Civil / Mech / Elec Mains</td>
                  <td>Assistant Executive Engineer (AEE), Assistant Engineer (AE)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Direct Ecosystem Links ── */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Preparation Tools</div>
            <h2 className={styles.sectionTitle}>Official MPSC Preparation Ecosystem</h2>
            <p className={styles.sectionSubtitle}>
              Everything you need: authentic question papers, official answer keys, syllabi, and practice tests.
            </p>
          </div>

          <div className={styles.resourceGrid}>
            <Link href="/mpsc-pyq" className={styles.resourceCard}>
              <div className={styles.resourceCardTop}>
                <div className={styles.resourceIcon}>
                  <span className="material-symbols-outlined">description</span>
                </div>
                <span className={styles.resourceBadge}>429 Exam Sets</span>
              </div>
              <h3 className={styles.resourceTitle}>841+ MPSC Question Papers &amp; Keys</h3>
              <p className={styles.resourceDesc}>
                Official 2021–2026 question papers paired side-by-side with verified final answer keys in browser.
              </p>
              <span className={styles.resourceCta}>
                <span>Open MPSC Archive</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/syllabus/mpsc" className={styles.resourceCard}>
              <div className={styles.resourceCardTop}>
                <div className={styles.resourceIcon}>
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <span className={styles.resourceBadge}>343 Blueprints</span>
              </div>
              <h3 className={styles.resourceTitle}>343 Official MPSC Examination Catalog</h3>
              <p className={styles.resourceDesc}>
                Complete official gazette blueprints across Rajyaseva, Group B, Group C, Engineering &amp; Education.
              </p>
              <span className={styles.resourceCta}>
                <span>Explore All 343 Syllabi</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </Link>

            <Link href="/mock-tests/mpsc-combined-full-prelims" className={styles.resourceCard}>
              <div className={styles.resourceCardTop}>
                <div className={styles.resourceIcon}>
                  <span className="material-symbols-outlined">quiz</span>
                </div>
                <span className={styles.resourceBadge}>Free Online Mock</span>
              </div>
              <h3 className={styles.resourceTitle}>MPSC Combined Prelims Full Mock Test</h3>
              <p className={styles.resourceDesc}>
                Timed 1-hour practice test covering 100 questions with 1/4th negative marking score calculation.
              </p>
              <span className={styles.resourceCta}>
                <span>Start Practice Test</span>
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
              Essential answers on the MPSC 2026 calendar, hall tickets, objection windows, and normalisation.
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
