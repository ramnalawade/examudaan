// ============================================================
// app/talathi-question-papers/page.js — Talathi Bharti Question Papers & Answer Keys
// Target Queries: "talathi bharti question paper" (2,400/mo), "talathi question paper with answers pdf"
// ExamUdaan | TCS Pattern 2019–2023 Shift Papers, Answer Keys & Solved Questions
// ============================================================

import React from 'react'
import Link from 'next/link'
import curatedData from '@/lib/curatedExamPyqs.json'
import styles from './talathiPyq.module.css'

export const metadata = {
  title: {
    absolute: 'Talathi Bharti Question Papers & Answer Keys (TCS Pattern PDF) | ExamUdaan',
  },
  description: 'Download Maharashtra Talathi Bharti previous year question papers (2019–2023 TCS pattern) and official answer keys. Read shift-wise solved papers free.',
  keywords: [
    'talathi bharti question paper', 'talathi question paper with answers pdf',
    'talathi question paper 2023', 'tcs talathi pyq', 'talathi bharti 2019 question paper',
    'talathi syllabus', 'tcs pattern question paper talathi', 'mahabhumi talathi paper'
  ],
  alternates: {
    canonical: 'https://examudaan.in/talathi-question-papers',
  },
  openGraph: {
    title: 'Talathi Bharti Question Papers & Answer Keys (TCS Pattern PDF) | ExamUdaan',
    description: 'Download Maharashtra Talathi Bharti previous year question papers (2019–2023 TCS pattern) and official answer keys. Read shift-wise solved papers free.',
    url: 'https://examudaan.in/talathi-question-papers',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Talathi Bharti Question Papers & Answer Keys | ExamUdaan',
    description: 'Download Maharashtra Talathi Bharti previous year question papers & official answer keys (TCS pattern).',
  },
}

export default function TalathiQuestionPapersPage() {
  const talathiQuestions = curatedData.talathi || []

  const officialPapers = [
    {
      shift: 'TCS Shift 1 (Phase 1)',
      district: 'All Maharashtra Districts (TCS CBT)',
      year: '2023',
      date: 'August 17, 2023',
      pattern: '100 Qs / 200 Marks / 120 Mins',
      paperUrl: '/question-papers/viewer/talathi-2023-shift1',
      keyUrl: '/question-papers/viewer/talathi-2023-shift1-key',
    },
    {
      shift: 'TCS Shift 2 (Phase 1)',
      district: 'All Maharashtra Districts (TCS CBT)',
      year: '2023',
      date: 'August 18, 2023',
      pattern: '100 Qs / 200 Marks / 120 Mins',
      paperUrl: '/question-papers/viewer/talathi-2023-shift2',
      keyUrl: '/question-papers/viewer/talathi-2023-shift2-key',
    },
    {
      shift: 'TCS Shift 3 (Phase 2)',
      district: 'All Maharashtra Districts (TCS CBT)',
      year: '2023',
      date: 'August 28, 2023',
      pattern: '100 Qs / 200 Marks / 120 Mins',
      paperUrl: '/question-papers/viewer/talathi-2023-shift3',
      keyUrl: '/question-papers/viewer/talathi-2023-shift3-key',
    },
    {
      shift: 'TCS Shift 1 (Phase 3)',
      district: 'All Maharashtra Districts (TCS CBT)',
      year: '2023',
      date: 'September 10, 2023',
      pattern: '100 Qs / 200 Marks / 120 Mins',
      paperUrl: '/question-papers/viewer/talathi-2023-shift4',
      keyUrl: '/question-papers/viewer/talathi-2023-shift4-key',
    },
    {
      shift: 'Pune District Written Paper',
      district: 'Pune District Revenue Cadre',
      year: '2019',
      date: 'July 2019',
      pattern: '100 Qs / 200 Marks / 120 Mins',
      paperUrl: '/question-papers/viewer/talathi-2019-pune',
      keyUrl: '/question-papers/viewer/talathi-2019-pune-key',
    },
    {
      shift: 'Nashik District Written Paper',
      district: 'Nashik District Revenue Cadre',
      year: '2019',
      date: 'July 2019',
      pattern: '100 Qs / 200 Marks / 120 Mins',
      paperUrl: '/question-papers/viewer/talathi-2019-nashik',
      keyUrl: '/question-papers/viewer/talathi-2019-nashik-key',
    },
    {
      shift: 'Nagpur District Written Paper',
      district: 'Nagpur District Revenue Cadre',
      year: '2019',
      date: 'July 2019',
      pattern: '100 Qs / 200 Marks / 120 Mins',
      paperUrl: '/question-papers/viewer/talathi-2019-nagpur',
      keyUrl: '/question-papers/viewer/talathi-2019-nagpur-key',
    },
    {
      shift: 'Chhatrapati Sambhajinagar Paper',
      district: 'Aurangabad District Revenue Cadre',
      year: '2019',
      date: 'July 2019',
      pattern: '100 Qs / 200 Marks / 120 Mins',
      paperUrl: '/question-papers/viewer/talathi-2019-aurangabad',
      keyUrl: '/question-papers/viewer/talathi-2019-aurangabad-key',
    },
  ]

  const faqList = [
    {
      q: 'What is the TCS pattern for Maharashtra Talathi Bharti?',
      a: 'The TCS computer-based test (CBT) consists of 100 objective questions carrying 200 marks (2 marks per question) with a duration of 120 minutes. There is NO negative marking. Subjects: Marathi (25 Qs/50 M), English (25 Qs/50 M), General Knowledge (25 Qs/50 M), and Intellectual Test/Maths (25 Qs/50 M).',
    },
    {
      q: 'Where can I download Talathi Bharti 2023 question papers with official answer keys?',
      a: 'ExamUdaan provides official shift-wise question papers and verified final answer keys from the 2023 TCS Talathi examination, viewable and downloadable in clean PDF format.',
    },
    {
      q: 'What is the difficulty level of TCS Talathi question papers?',
      a: 'Marathi and English sections follow Senior Secondary / 12th standard level, while General Knowledge and Intellectual Tests are at Graduate degree level. Repeated practice with past TCS shifts is critical for speed and accuracy.',
    },
    {
      q: 'Is normalisation applied to TCS Talathi examination marks?',
      a: 'Yes, because the exam is held across multiple shifts over several weeks, the Revenue Department applies standard equipercentile normalisation formula across all shifts.',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Maharashtra Talathi Bharti Question Papers & Answer Keys (TCS Pattern)',
    description: 'Official repository of TCS pattern Talathi Bharti shift-wise question papers and verified final answer keys.',
    url: 'https://examudaan.in/talathi-question-papers',
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
            <span className={styles.pillBadge}>TCS Pattern 2019–2023</span>
            <span className={styles.pillBadgeOrange}>200 Marks / 100 Questions</span>
            <span className={styles.updatedDate}>
              <span className="material-symbols-outlined">verified</span>
              With Verified Final Keys
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            Maharashtra Talathi Bharti <span className={styles.heroTitleHighlight}>Question Papers & Answer Keys</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Download official TCS shift-wise Talathi Bharti previous year question papers with final answer keys (PDF). Practice with verified repeated questions, topic-wise weightage, and detailed explanations.
          </p>

          <div className={styles.actionRow}>
            <a href="#papers-archive" className={styles.btnPrimary}>
              <span className="material-symbols-outlined">download</span> Download Shift Papers & Keys
            </a>
            <a href="#solved-questions" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">quiz</span> Solved TCS Practice Questions
            </a>
            <Link href="/talathi-bharti-2026" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">campaign</span> Talathi Bharti 2026 Hub
            </Link>
            <Link href="/talathi-bharti-apply-online" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">app_registration</span> Apply Online Guide
            </Link>
          </div>
        </div>
      </section>

      {/* ── 200-Mark TCS Pattern Section ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Exam Structure</span>
            <h2 className={styles.sectionTitle}>TCS 200-Mark Computer-Based Test (CBT) Blueprint</h2>
            <p className={styles.sectionDesc}>
              The Talathi exam has 100 objective questions for 200 marks (2 marks per question) with a 120-minute duration and no negative marking.
            </p>
          </div>

          <div className={styles.patternGrid}>
            <div className={styles.patternCard}>
              <h3 className={styles.patternSubject}>Marathi Language</h3>
              <div className={styles.patternSubjectMr}>मराठी व्याकरण, शब्दसंग्रह व उतारे</div>
              <div className={styles.patternMarksRow}>
                <span>25 Qs / 50 Marks</span>
                <span className={styles.patternMarksVal}>25% Weight</span>
              </div>
            </div>
            <div className={styles.patternCard}>
              <h3 className={styles.patternSubject}>English Language</h3>
              <div className={styles.patternSubjectMr}>Grammar, Vocab & Comprehension</div>
              <div className={styles.patternMarksRow}>
                <span>25 Qs / 50 Marks</span>
                <span className={styles.patternMarksVal}>25% Weight</span>
              </div>
            </div>
            <div className={styles.patternCard}>
              <h3 className={styles.patternSubject}>General Knowledge</h3>
              <div className={styles.patternSubjectMr}>सामान्य ज्ञान व चालू घडामोडी</div>
              <div className={styles.patternMarksRow}>
                <span>25 Qs / 50 Marks</span>
                <span className={styles.patternMarksVal}>25% Weight</span>
              </div>
            </div>
            <div className={styles.patternCard}>
              <h3 className={styles.patternSubject}>Intellectual & Maths</h3>
              <div className={styles.patternSubjectMr}>बौद्धिक चाचणी व अंकगणित</div>
              <div className={styles.patternMarksRow}>
                <span>25 Qs / 50 Marks</span>
                <span className={styles.patternMarksVal}>25% Weight</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Official Shift Papers Table ── */}
      <section id="papers-archive" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Shift Papers & Keys</span>
            <h2 className={styles.sectionTitle}>TCS Talathi Bharti Shift-wise Papers with Answer Keys (PDF)</h2>
            <p className={styles.sectionDesc}>
              Authentic shift question papers released by Revenue Department and TCS. Read free online or download.
            </p>
          </div>

          <div className={styles.papersTableCard}>
            <div className={styles.tableResponsive}>
              <table className={styles.papersTable}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Exam Shift / Session</th>
                    <th>District / Coverage</th>
                    <th>Pattern</th>
                    <th>Question Paper</th>
                    <th>Official Key</th>
                  </tr>
                </thead>
                <tbody>
                  {officialPapers.map((p, idx) => (
                    <tr key={idx}>
                      <td><span className={styles.badgeYear}>{p.year}</span></td>
                      <td>
                        <span className={styles.paperTitleText}>{p.shift}</span>
                        <span className={styles.paperSubText}>Date: {p.date}</span>
                      </td>
                      <td>{p.district}</td>
                      <td>{p.pattern}</td>
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
                    <span className={styles.badgeDistrict}>{p.district}</span>
                  </div>
                  <h3 className={styles.mobileUnitTitle}>{p.shift}</h3>
                  <div className={styles.mobileMetaRow}>
                    <span className={styles.mobileMetaItem}>
                      <span className="material-symbols-outlined">calendar_today</span>
                      {p.date}
                    </span>
                    <span className={styles.mobileMetaItem}>
                      <span className="material-symbols-outlined">quiz</span>
                      {p.pattern}
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

      {/* ── Solved TCS Questions Stream ── */}
      <section id="solved-questions" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Solved Question Bank</span>
            <h2 className={styles.sectionTitle}>Top Repeated TCS Talathi Questions with Explanations</h2>
            <p className={styles.sectionDesc}>
              High-frequency questions from past TCS Talathi shifts across Marathi Grammar, English, GK, and Mental Ability.
            </p>
          </div>

          <div className={styles.qaList}>
            {talathiQuestions.slice(0, 12).map((item, i) => (
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
              <span className="material-symbols-outlined">library_books</span> Solve Complete 1,100+ Bilingual PYQ Bank →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>FAQ</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions (तलाठी भरती प्रश्नपत्रिका FAQ)</h2>
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
