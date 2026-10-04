// ============================================================
// app/mpsc-pyq/page.js — Official MPSC Question Papers & Answer Keys (2024–2026)
// Server Component with SEO Metadata & Structured Data
// 100% Sourced from Maharashtra Public Service Commission (mpsc.gov.in)
// ============================================================

import mpscLocalPapers from '@/lib/mpscLocalPapers.json'
import mpscPairedExams from '@/lib/mpscPairedExams.json'
import MpscPyqClient from './MpscPyqClient'

export const metadata = {
  title: 'MPSC Question Papers & Answer Keys 2026, 2025, 2024 (Official PDFs) | ExamUdaan',
  description: 'Download and read official MPSC question papers and answer keys for 2024, 2025, and 2026 in one row. State Services, Combined Group B & C, PSI, Town Planner, and screening tests sourced directly from mpsc.gov.in.',
  alternates: {
    canonical: 'https://examudaan.in/mpsc-pyq',
  },
  openGraph: {
    title: 'MPSC Question Papers & Answer Keys 2024–2026 (209 Official PDFs) | ExamUdaan',
    description: '100% authentic MPSC question papers & final answer keys in one row downloaded from Maharashtra Public Service Commission (mpsc.gov.in). Read in-browser directly.',
    url: 'https://examudaan.in/mpsc-pyq',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default async function MpscPyqPage({ searchParams }) {
  const resolvedParams = await Promise.resolve(searchParams)
  const initialDocId = resolvedParams?.docId ? parseInt(resolvedParams.docId) : null
  const initialPdf = resolvedParams?.pdf || null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MPSC Question Papers & Answer Keys 2024-2026',
    description: 'Official repository of 136 MPSC exams (209 question papers and final answer keys in one row) for Maharashtra Government examinations.',
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
          text: 'Yes. All 209 question papers and answer keys across 136 exam sets for 2024, 2025, and 2026 are sourced directly from the official Maharashtra Public Service Commission portal (mpsc.gov.in) and verified against official gazettes.',
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
    </>
  )
}
