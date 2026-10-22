// ============================================================
// app/mpsc-pyq/page.js — Official MPSC Question Papers & Answer Keys (2021–2026)
// Server Component with SEO Metadata & Crawlable Structured Content
// 100% Sourced from Maharashtra Public Service Commission (mpsc.gov.in)
// ============================================================

import Link from 'next/link'
import mpscLocalPapers from '@/lib/mpscLocalPapers.json'
import mpscPairedExams from '@/lib/mpscPairedExams.json'
import curatedData from '@/lib/curatedExamPyqs.json'
import MpscPyqClient from './MpscPyqClient'
import styles from './mpscPyqServer.module.css'

export const metadata = {
  title: {
    absolute: 'MPSC Question Papers & Answer Keys 2021-2026 | ExamUdaan'
  },
  description: 'Download 841 official MPSC question papers and answer keys (2021–2026) for Rajyaseva, Group B, C & PSI. Read free in browser from mpsc.gov.in.',
  keywords: [
    'MPSC question papers', 'MPSC answer key', 'MPSC previous year papers',
    'MPSC PYQ 2024', 'MPSC PYQ 2025', 'MPSC PYQ 2026',
    'MPSC Rajyaseva question paper', 'MPSC Group B question paper',
    'MPSC Group C question paper', 'MPSC PSI STI question paper',
    'Maharashtra PSC papers', 'mpsc.gov.in PDF'
  ],
  alternates: {
    canonical: 'https://examudaan.in/mpsc-pyq',
  },
  openGraph: {
    title: 'MPSC Question Papers & Answer Keys 2021-2026 | ExamUdaan',
    description: '841 official MPSC question papers and answer keys (2021–2026) from mpsc.gov.in. Rajyaseva, Group B, C, PSI, STI, Vanseva — free in-browser PDF reader.',
    url: 'https://examudaan.in/mpsc-pyq',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'MPSC Question Papers & Answer Keys 2021-2026 | ExamUdaan',
    description: '841 official MPSC papers & answer keys from 2021-2026. Read free in browser from mpsc.gov.in.',
  },
}

export default async function MpscPyqPage({ searchParams }) {
  const resolvedParams = await Promise.resolve(searchParams)
  const initialDocId = resolvedParams?.docId ? parseInt(resolvedParams.docId) : null
  const initialPdf = resolvedParams?.pdf || null

  const mpscQuestions = curatedData.mpsc || []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MPSC Question Papers & Answer Keys 2021-2026',
    description: 'Official repository of 429 MPSC exams (841 question papers and final answer keys in one row) from 2021 to 2026 for Maharashtra Government examinations.',
    url: 'https://examudaan.in/mpsc-pyq',
    publisher: {
      '@type': 'Organization',
      name: 'ExamUdaan',
      url: 'https://examudaan.in',
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are these MPSC question papers and answer keys official?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. All 841 question papers and answer keys across 429 exam sets from 2021 to 2026 are sourced directly from the official Maharashtra Public Service Commission portal (mpsc.gov.in) and verified against official gazettes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I read MPSC question papers and answer keys directly in the browser?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! ExamUdaan provides a high-speed In-Browser PDF Study Workspace where you can read any paper directly, switch to its corresponding answer key in one click, and download official PDFs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are question papers and answer keys arranged in one row?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Every exam row contains the official question paper and its matching final answer key side-by-side with verified file sizes and direct in-browser reading buttons.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <MpscPyqClient
        pairedExams={mpscPairedExams}
        allPapers={mpscLocalPapers}
        initialDocId={initialDocId}
        initialPdf={initialPdf}
      />

      {/* ── Server-Rendered Crawlable SEO Content Section (OpenSEO Audit Recommended) ── */}
      <section className={styles.seoContainer}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Exam Cadres Breakdown</span>
            <h2 className={styles.sectionTitle}>MPSC Previous Year Question Papers & Official Final Keys</h2>
            <p className={styles.sectionDesc}>
              Complete archive of Maharashtra Public Service Commission examinations organized by cadre. Sourced directly from mpsc.gov.in with matching final keys.
            </p>
          </div>

          <div className={styles.cadreGrid}>
            <div className={styles.cadreCard}>
              <span className={styles.cadreBadge}>State Services</span>
              <h3 className={styles.cadreTitle}>MPSC Rajyaseva (Civil Services)</h3>
              <div className={styles.cadreSubtitle}>राज्यसेवा पूर्व व मुख्य परीक्षा</div>
              <ul className={styles.cadreDetails}>
                <li className={styles.cadreDetailItem}>✓ GS Paper 1 & GS Paper 2 (CSAT)</li>
                <li className={styles.cadreDetailItem}>✓ Descriptive & Objective Mains Papers</li>
                <li className={styles.cadreDetailItem}>✓ Official First & Final Answer Keys</li>
                <li className={styles.cadreDetailItem}>✓ Verified Coverage 2021 to 2026</li>
              </ul>
            </div>

            <div className={styles.cadreCard}>
              <span className={styles.cadreBadge}>Non-Gazetted Group B</span>
              <h3 className={styles.cadreTitle}>MPSC Combined Group B (PSI / STI / ASO)</h3>
              <div className={styles.cadreSubtitle}>गट ब संयुक्त पूर्व व मुख्य परीक्षा</div>
              <ul className={styles.cadreDetails}>
                <li className={styles.cadreDetailItem}>✓ 100-Mark Common Combined Prelims</li>
                <li className={styles.cadreDetailItem}>✓ Paper 1 (Marathi & English) & Paper 2 (Law/GS)</li>
                <li className={styles.cadreDetailItem}>✓ Police Sub-Inspector & Sales Tax Inspector</li>
                <li className={styles.cadreDetailItem}>✓ Official Final Revised Answer Keys</li>
              </ul>
            </div>

            <div className={styles.cadreCard}>
              <span className={styles.cadreBadge}>Group C Cadre</span>
              <h3 className={styles.cadreTitle}>MPSC Combined Group C (Clerk & Excise)</h3>
              <div className={styles.cadreSubtitle}>गट क संयुक्त पूर्व व मुख्य परीक्षा</div>
              <ul className={styles.cadreDetails}>
                <li className={styles.cadreDetailItem}>✓ Clerk Typist, Tax Assistant & Excise SI</li>
                <li className={styles.cadreDetailItem}>✓ 100-Mark Screening Test Sets A/B/C/D</li>
                <li className={styles.cadreDetailItem}>✓ Typing Skill Test Guidelines</li>
                <li className={styles.cadreDetailItem}>✓ Complete Official Answer Keys PDF</li>
              </ul>
            </div>
          </div>

          {/* Solved Questions Stream */}
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Solved Question Bank</span>
            <h2 className={styles.sectionTitle}>High-Frequency MPSC Solved Questions with Detailed Explanations</h2>
            <p className={styles.sectionDesc}>
              Sample recurring questions from MPSC Rajyaseva and Combined examinations across Polity, Geography, History, and Economy.
            </p>
          </div>

          <div className={styles.qaList}>
            {mpscQuestions.slice(0, 10).map((item, i) => (
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
            <Link
              href="/pyq"
              className={styles.btnPyqExplore}
            >
              Explore Complete 1,100+ Bilingual MPSC PYQ Bank →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
