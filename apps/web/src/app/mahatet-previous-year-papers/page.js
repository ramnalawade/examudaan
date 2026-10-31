// ============================================================
// app/mahatet-previous-year-papers/page.js — Official MAHA TET Question Papers & Keys
// Target Queries: "maha tet question paper", "mahatet previous year question paper pdf"
// ExamUdaan | Official Papers & Final Keys Sourced from mahatet.in (MSCE Pune)
// Zero Inline Styles Policy Compliant
// ============================================================

import React from 'react'
import Link from 'next/link'
import { query } from '@/lib/pgdb'
import manifestData from '@/lib/mahatetPyqManifest.json'
import MahatetPyqClient from './MahatetPyqClient'
import styles from './mahatetPyq.module.css'

export const metadata = {
  title: {
    absolute: 'MAHA TET Previous Year Question Papers & Answer Keys (PDF) | ExamUdaan',
  },
  description: 'Download official MAHA TET previous year question papers (2013–2026) and final answer keys for Paper 1 (Primary) and Paper 2 (Math-Science & Social Studies) in Marathi, English & Hindi.',
  keywords: [
    'maha tet question paper', 'mahatet previous year question paper pdf',
    'maha tet answer key 2024', 'maha tet answer key 2025', 'maha tet question paper marathi',
    'maha tet paper 1 question paper', 'maha tet paper 2 math science', 'maha tet pedagogy questions',
    'msce pune tet paper', 'mahatet.in download'
  ],
  alternates: {
    canonical: 'https://examudaan.in/mahatet-previous-year-papers',
  },
  openGraph: {
    title: 'MAHA TET Previous Year Question Papers & Answer Keys (PDF) | ExamUdaan',
    description: 'Download official MAHA TET previous year question papers (2013–2026) and final answer keys for Paper 1 and Paper 2 in Marathi, English & Hindi from mahatet.in.',
    url: 'https://examudaan.in/mahatet-previous-year-papers',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'MAHA TET Previous Year Question Papers & Answer Keys | ExamUdaan',
    description: 'Official MAHA TET Question Papers and Verified Final Answer Keys (2013–2026) from MSCE Pune.',
  },
}

export default async function MahatetPreviousYearPapersPage({ searchParams }) {
  const resolvedParams = await Promise.resolve(searchParams)
  const initialDocId = resolvedParams?.docId || null
  const initialPdf = resolvedParams?.pdf || null

  const catalog = manifestData?.items || []
  const totalSets = catalog.length
  const totalWithKey = catalog.filter(c => c.hasKey).length
  const totalYears = (manifestData.yearsCovered || []).length || 7

  // Live pyq_questions counts by paper_pdf_name
  const questionCountsMap = {}
  let totalLiveQuestions = 0
  try {
    const qRes = await query(`
      SELECT 
        LOWER(REGEXP_REPLACE(paper_pdf_name, '\\.pdf$', '', 'i')) AS clean_name,
        COUNT(*)::int AS count 
      FROM pyq_questions 
      WHERE 
        paper_pdf_name ~* '^(2013|2014|2016|2017|2021|2024|2025)_P'
        OR exam ILIKE '%TET%'
      GROUP BY clean_name
    `)
    const qRows = Array.isArray(qRes) ? qRes : (qRes?.rows || [])
    qRows.forEach(r => {
      if (r.clean_name) {
        const key = r.clean_name.toLowerCase().trim()
        const count = parseInt(r.count, 10) || 0
        questionCountsMap[key] = count
        questionCountsMap[key + '.pdf'] = count
        totalLiveQuestions += count
      }
    })
  } catch (err) {
    console.warn('[MahatetPage] Could not query live question counts:', err.message)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MAHA TET Previous Year Question Papers & Official Answer Keys',
    description: `Official archive of ${totalSets} Maharashtra Teacher Eligibility Test (MAHA TET) question papers and final answer keys across Paper 1 and Paper 2 in Marathi, English, and Hindi mediums from 2013 to 2026.`,
    url: 'https://examudaan.in/mahatet-previous-year-papers',
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
        name: 'Where can I download official MAHA TET question papers with answer keys?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ExamUdaan provides direct official question papers and verified final answer keys from 2013 to 2026 published by MSCE Pune (mahatet.in) across Paper 1 (Primary) and Paper 2 (Math-Science & Social Studies).',
        },
      },
      {
        '@type': 'Question',
        name: 'Are MAHA TET question papers available in Marathi, English and Hindi mediums?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All question papers and answer keys are indexed medium-wise including Marathi (मराठी माध्यम), English, Hindi (हिंदी माध्यम), and Urdu mediums with side-by-side answer key pairs.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the passing cutoff marks for MAHA TET?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'General/Open category candidates must score at least 60% (90 out of 150 marks). Reserved categories (SC, ST, VJ/DT, NT, OBC, SBC, SEBC, and PwD) require 55% (82.5 rounded to 83 out of 150 marks).',
        },
      },
      {
        '@type': 'Question',
        name: 'Is MAHA TET compulsory for Maharashtra teacher recruitment under Pavitra Portal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Clearing MAHA TET (or CTET) is mandatory for teaching classes 1 to 8 in government and aided schools, followed by the TAIT (Teacher Aptitude and Intelligence Test) examination for Pavitra Portal merit ranking.',
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

      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span>/</span>
            <Link href="/question-papers" className={styles.breadcrumbLink}>Question Papers</Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>MAHA TET Papers</span>
          </nav>

          <header className={styles.heroHeader}>
            <span className={styles.heroTag}>
              🏛️ Official MSCE Pune Archive (mahatet.in)
            </span>
            <h1 className={styles.heroTitle}>
              MAHA TET Previous Year Question Papers & Official Keys (2013–2026)
            </h1>
            <div className={styles.heroTitleMr}>
              महाराष्ट्र शिक्षक पात्रता परीक्षा — अधिकृत प्रश्नपत्रिका व अंतिम उत्तरतालिका
            </div>
            <p className={styles.heroDesc}>
              Download and read authentic Maharashtra Teacher Eligibility Test (MAHA TET) Paper I (Classes 1–5) and Paper II (Classes 6–8) question papers paired with official final answer keys in Marathi, English, and Hindi mediums.
            </p>
          </header>

          {/* Interactive Filtering, Stat Buttons & Listing Client Component */}
          <MahatetPyqClient
            catalog={catalog}
            initialDocId={initialDocId}
            initialPdf={initialPdf}
            questionCountsMap={questionCountsMap}
            stats={{
              totalSets,
              totalWithKey,
              totalLiveQuestions
            }}
          />
        </div>
      </div>
    </>
  )
}
