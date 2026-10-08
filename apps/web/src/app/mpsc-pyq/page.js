// ============================================================
// app/mpsc-pyq/page.js — Official MPSC Question Papers & Answer Keys (2024–2026)
// Server Component with SEO Metadata & Structured Data
// 100% Sourced from Maharashtra Public Service Commission (mpsc.gov.in)
// ============================================================

import mpscLocalPapers from '@/lib/mpscLocalPapers.json'
import mpscPairedExams from '@/lib/mpscPairedExams.json'
import MpscPyqClient from './MpscPyqClient'

export const metadata = {
  title: {
    absolute: 'MPSC Question Papers & Answer Keys 2021-2026 | ExamUdaan'
  },
  description: 'Download 841 official MPSC question papers and answer keys (2021-2026) — Rajyaseva, Group B, Group C, PSI, STI, Vanseva. Read free in browser, sourced 100% from mpsc.gov.in.',
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
    </>
  )
}
