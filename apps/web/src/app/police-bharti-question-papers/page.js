// ============================================================
// app/police-bharti-question-papers/page.js — Maharashtra Police Bharti Question Papers & Answer Keys
// Target Queries: "police bharti question paper" (4,400/mo), "maharashtra police bharti question paper" (1,600/mo)
// ExamUdaan | Official 2018–2024 PDF Papers, Answer Keys & Solved Questions
// ============================================================

import React from 'react'
import Link from 'next/link'
import curatedData from '@/lib/curatedExamPyqs.json'
import styles from './policePyq.module.css'

export const metadata = {
  title: {
    absolute: 'Maharashtra Police Bharti Question Papers & Answer Keys (PDF) | ExamUdaan',
  },
  description: 'Download official Maharashtra Police Bharti previous year question papers (2018–2024) and verified answer keys for Police Constable, Driver & SRPF with solved questions.',
  keywords: [
    'police bharti question paper', 'maharashtra police bharti question paper',
    'police bharti question paper with answer key pdf', 'police constable question paper',
    'police bharti 2024 question paper pdf', 'police bharti 2023 paper',
    'maharashtra police pyq', 'police driver question paper'
  ],
  alternates: {
    canonical: 'https://examudaan.in/police-bharti-question-papers',
  },
  openGraph: {
    title: 'Maharashtra Police Bharti Question Papers & Answer Keys (PDF) | ExamUdaan',
    description: 'Download official Maharashtra Police Bharti previous year question papers (2018–2024) and verified answer keys for Police Constable, Driver & SRPF with solved questions.',
    url: 'https://examudaan.in/police-bharti-question-papers',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Maharashtra Police Bharti Question Papers & Answer Keys | ExamUdaan',
    description: 'Download official Maharashtra Police Bharti previous year question papers & answer keys for Constable, Driver & SRPF.',
  },
}

export default function PoliceBhartiQuestionPapersPage() {
  const policeQuestions = curatedData.police || []

  const officialPapers = [
    {
      unit: 'Mumbai Police Commissionerate',
      post: 'Police Constable (पोलीस शिपाई)',
      year: '2024',
      date: 'July 2024',
      marks: '100 Marks / 90 Mins',
      paperUrl: '/question-papers/viewer/police-constable-2024-mumbai',
      keyUrl: '/question-papers/viewer/police-constable-2024-mumbai-key',
    },
    {
      unit: 'Pune City Police',
      post: 'Police Constable (पोलीस शिपाई)',
      year: '2024',
      date: 'July 2024',
      marks: '100 Marks / 90 Mins',
      paperUrl: '/question-papers/viewer/police-constable-2024-pune',
      keyUrl: '/question-papers/viewer/police-constable-2024-pune-key',
    },
    {
      unit: 'Maharashtra State Police Driver',
      post: 'Police Constable Driver (पोलीस चालक)',
      year: '2024',
      date: 'June 2024',
      marks: '100 Marks / 90 Mins',
      paperUrl: '/question-papers/viewer/police-driver-2024-all',
      keyUrl: '/question-papers/viewer/police-driver-2024-all-key',
    },
    {
      unit: 'Thane City Police',
      post: 'Police Constable (पोलीस शिपाई)',
      year: '2023',
      date: 'April 2023',
      marks: '100 Marks / 90 Mins',
      paperUrl: '/question-papers/viewer/police-constable-2023-thane',
      keyUrl: '/question-papers/viewer/police-constable-2023-thane-key',
    },
    {
      unit: 'Nagpur Police Commissionerate',
      post: 'Police Constable (पोलीस शिपाई)',
      year: '2023',
      date: 'April 2023',
      marks: '100 Marks / 90 Mins',
      paperUrl: '/question-papers/viewer/police-constable-2023-nagpur',
      keyUrl: '/question-papers/viewer/police-constable-2023-nagpur-key',
    },
    {
      unit: 'Maharashtra SRPF Armed Police',
      post: 'SRPF Armed Constable (राज्य राखीव पोलीस)',
      year: '2023',
      date: 'May 2023',
      marks: '100 Marks / 90 Mins',
      paperUrl: '/question-papers/viewer/srpf-constable-2023',
      keyUrl: '/question-papers/viewer/srpf-constable-2023-key',
    },
    {
      unit: 'Navi Mumbai Police',
      post: 'Police Constable (पोलीस शिपाई)',
      year: '2021',
      date: 'Nov 2021',
      marks: '100 Marks / 90 Mins',
      paperUrl: '/question-papers/viewer/police-constable-2021-navimumbai',
      keyUrl: '/question-papers/viewer/police-constable-2021-navimumbai-key',
    },
    {
      unit: 'Chhatrapati Sambhajinagar Police',
      post: 'Police Constable (पोलीस शिपाई)',
      year: '2019',
      date: 'Sep 2019',
      marks: '100 Marks / 90 Mins',
      paperUrl: '/question-papers/viewer/police-constable-2019-aurangabad',
      keyUrl: '/question-papers/viewer/police-constable-2019-aurangabad-key',
    },
  ]

  const faqList = [
    {
      q: 'Where can I download Maharashtra Police Bharti previous year question papers with answer keys?',
      a: 'ExamUdaan provides official Maharashtra Police Constable, Driver, and SRPF previous year question papers (2018–2024) with official final answer keys in browser-readable PDF format.',
    },
    {
      q: 'What is the written exam pattern for Maharashtra Police Bharti?',
      a: 'The written exam consists of 100 objective questions for 100 marks: Marathi Grammar (25 Qs), Mathematics (25 Qs), Intellectual Test / Reasoning (25 Qs), and General Knowledge & Current Affairs (25 Qs). Exam duration is 90 minutes. There is no negative marking.',
    },
    {
      q: 'Are previous year question papers repeated in Police Bharti exams?',
      a: 'Yes, topic weightage and grammatical patterns in Marathi, recurring numeric formulas in Arithmetic, and standard Maharashtra GK questions have shown high repeat frequency across district papers.',
    },
    {
      q: 'How many marks are required in Police Bharti written exam to qualify?',
      a: 'Candidates must score a minimum of 40% marks (40 out of 100) to qualify in the written exam. The final merit list is prepared out of 150 marks (50 Physical + 100 Written).',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Maharashtra Police Bharti Question Papers & Answer Keys',
    description: 'Official repository of Maharashtra Police Constable and Driver previous year question papers with verified final answer keys.',
    url: 'https://examudaan.in/police-bharti-question-papers',
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
    <main className={styles.pageWrapper}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.badgeRow}>
            <span className={styles.pillBadgeSuccess}>Official Archive 2018–2024</span>
            <span className={styles.pillBadge}>100 Marks Written Test</span>
            <span className={styles.updatedDate}>
              <span className="material-symbols-outlined">verified</span>
              With Verified Final Keys
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            Maharashtra Police Bharti <span className={styles.heroTitleHighlight}>Question Papers & Answer Keys</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Download official district-wise Maharashtra Police Constable, Driver, and SRPF previous year question papers with final answer keys (PDF). Practice with solved high-frequency questions and topic-wise weightage.
          </p>

          <div className={styles.actionRow}>
            <a href="#papers-archive" className={styles.btnPrimary}>
              <span className="material-symbols-outlined">download</span> Download Papers & Keys
            </a>
            <a href="#solved-questions" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">quiz</span> Solved Practice Bank
            </a>
            <Link href="/police-calculator" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">calculate</span> 150-Mark Merit Calculator
            </Link>
            <Link href="/maharashtra-police-bharti-2026" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">campaign</span> Police Bharti 2026 Hub
            </Link>
          </div>
        </div>
      </section>

      {/* ── 100-Mark Exam Pattern Section ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Exam Blueprint</span>
            <h2 className={styles.sectionTitle}>100-Mark Written Exam Pattern & Subject Weightage</h2>
            <p className={styles.sectionDesc}>
              The written examination consists of 100 multiple choice questions carrying 1 mark each. Time allowed is 90 minutes.
            </p>
          </div>

          <div className={styles.patternGrid}>
            <div className={styles.patternCard}>
              <h3 className={styles.patternSubject}>Marathi Grammar</h3>
              <div className={styles.patternSubjectMr}>मराठी व्याकरण व शब्दसंग्रह</div>
              <div className={styles.patternMarksRow}>
                <span>Questions: <strong>25 Qs</strong></span>
                <span className={styles.patternMarksVal}>25 Marks</span>
              </div>
            </div>
            <div className={styles.patternCard}>
              <h3 className={styles.patternSubject}>Mathematics</h3>
              <div className={styles.patternSubjectMr}>अंकगणित व संख्याज्ञान</div>
              <div className={styles.patternMarksRow}>
                <span>Questions: <strong>25 Qs</strong></span>
                <span className={styles.patternMarksVal}>25 Marks</span>
              </div>
            </div>
            <div className={styles.patternCard}>
              <h3 className={styles.patternSubject}>Intellectual Test</h3>
              <div className={styles.patternSubjectMr}>बुद्धिमत्ता चाचणी व तर्क</div>
              <div className={styles.patternMarksRow}>
                <span>Questions: <strong>25 Qs</strong></span>
                <span className={styles.patternMarksVal}>25 Marks</span>
              </div>
            </div>
            <div className={styles.patternCard}>
              <h3 className={styles.patternSubject}>General Knowledge</h3>
              <div className={styles.patternSubjectMr}>सामान्य ज्ञान व चालू घडामोडी</div>
              <div className={styles.patternMarksRow}>
                <span>Questions: <strong>25 Qs</strong></span>
                <span className={styles.patternMarksVal}>25 Marks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Official Papers & Keys Table ── */}
      <section id="papers-archive" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Official Question Bank</span>
            <h2 className={styles.sectionTitle}>Official Maharashtra Police Question Papers with Answer Keys (PDF)</h2>
            <p className={styles.sectionDesc}>
              Unit-wise and shift-wise authentic question papers released by Maharashtra State Police Department. Read free online or download.
            </p>
          </div>

          <div className={styles.papersTableCard}>
            <div className={styles.tableResponsive}>
              <table className={styles.papersTable}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Police Unit / Commissionerate</th>
                    <th>Post / Cadre</th>
                    <th>Format & Duration</th>
                    <th>Official Question Paper</th>
                    <th>Final Answer Key</th>
                  </tr>
                </thead>
                <tbody>
                  {officialPapers.map((p, idx) => (
                    <tr key={idx}>
                      <td><span className={styles.badgeYear}>{p.year}</span></td>
                      <td>
                        <span className={styles.paperTitleText}>{p.unit}</span>
                        <span className={styles.paperSubText}>Exam Date: {p.date}</span>
                      </td>
                      <td><strong>{p.post}</strong></td>
                      <td>{p.marks}</td>
                      <td>
                        <Link href="/question-papers" className={styles.btnDownloadPaper}>
                          <span className="material-symbols-outlined">visibility</span> Read Paper
                        </Link>
                      </td>
                      <td>
                        <Link href="/answer-keys" className={styles.btnDownloadKey}>
                          <span className="material-symbols-outlined">task_alt</span> Verified Key
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card-Wise View */}
            <div className={styles.papersMobileCards}>
              {officialPapers.map((p, idx) => (
                <div key={idx} className={styles.mobilePaperCard}>
                  <div className={styles.mobileCardTopRow}>
                    <span className={styles.badgeYear}>{p.year}</span>
                    <span className={styles.badgeCadre}>{p.post}</span>
                  </div>
                  <h3 className={styles.mobileUnitTitle}>{p.unit}</h3>
                  <div className={styles.mobileMetaRow}>
                    <span className={styles.mobileMetaItem}>
                      <span className="material-symbols-outlined">calendar_today</span>
                      {p.date}
                    </span>
                    <span className={styles.mobileMetaItem}>
                      <span className="material-symbols-outlined">timer</span>
                      {p.marks}
                    </span>
                  </div>
                  <div className={styles.mobileActionRow}>
                    <Link href="/question-papers" className={styles.mobileBtnPaper}>
                      <span className="material-symbols-outlined">visibility</span> Read Paper
                    </Link>
                    <Link href="/answer-keys" className={styles.mobileBtnKey}>
                      <span className="material-symbols-outlined">task_alt</span> Verified Key
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Solved Questions Bank in Plain Text (SEO High-Indexability) ── */}
      <section id="solved-questions" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Solved Questions Bank</span>
            <h2 className={styles.sectionTitle}>Top Repeated Police Bharti Questions with Detailed Explanations</h2>
            <p className={styles.sectionDesc}>
              Frequently asked questions from past Police Constable and Driver examinations across Marathi Grammar, GK, Maths, and Reasoning.
            </p>
          </div>

          <div className={styles.qaList}>
            {policeQuestions.slice(0, 12).map((item, i) => (
              <div key={item.id || i} className={styles.qaCard}>
                <div className={styles.qaMetaRow}>
                  <span className={styles.qaTagSubject}>{item.subject}</span>
                  <span className={styles.qaTagExam}>{item.exam}</span>
                  <span>Year: <strong>{item.year}</strong></span>
                  <span>Topic: <strong>{item.topic}</strong></span>
                </div>

                <div className={styles.qaQuestion}>
                  <strong>Q{i + 1}.</strong> {item.question}
                </div>

                <div className={styles.qaOptionsGrid}>
                  {(() => {
                    const opts = Array.isArray(item.options)
                      ? item.options.map((text, idx) => ({ key: String.fromCharCode(65 + idx), text }))
                      : typeof item.options === 'object' && item.options !== null
                        ? Object.entries(item.options).map(([key, text]) => ({ key, text }))
                        : []
                    return opts.map((opt, optIdx) => {
                      const isCorrect = String(item.correct).toUpperCase() === opt.key.toUpperCase() || opt.text === item.correct
                      return (
                        <div
                          key={optIdx}
                          className={`${styles.qaOption} ${isCorrect ? styles.qaOptionCorrect : ''}`}
                        >
                          <span>{opt.key}.</span> {opt.text}
                          {isCorrect && <span className={styles.qaCheckIcon}>✓</span>}
                        </div>
                      )
                    })
                  })()}
                </div>

                {item.explanation && (
                  <div className={styles.qaExplanationBox}>
                    <strong>अचूक स्पष्टीकरण / Explanation:</strong> {item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.qaActionCenter}>
            <Link href="/pyq" className={styles.btnPrimary}>
              <span className="material-symbols-outlined">library_books</span> Practice Full 1,100+ Bilingual PYQ Bank →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>FAQ</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions (पोलीस भरती प्रश्नपत्रिका FAQ)</h2>
          </div>

          <div className={styles.faqGrid}>
            {faqList.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
