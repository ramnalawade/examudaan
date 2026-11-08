// ============================================================
// app/results/page.js — Results Listing Page
// All URLs are indexable. Canonical URL always points to /results.
// ============================================================

import ListingPage from '../../components/ListingPage'
import { fitDescription } from '../../lib/seoMetadata'

export async function generateMetadata() {
  const title = 'Exam Results 2026 — Merit List & Scorecard Out'
  const description = fitDescription(
    'Latest declared government exam results 2026 — MPSC, SSC, RRB, UPSC, Banking & Police Bharti. Check merit list, final answer key and cut-off marks.',
    'Official scorecard links on ExamUdaan.'
  )
  const canonicalUrl = 'https://examudaan.in/results'

  return {
    title: { absolute: title },
    description,
    keywords: [
      'exam results 2026', 'MPSC result', 'SSC CGL result', 'RRB result',
      'police bharti result', 'merit list', 'scorecard', 'cut-off marks'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ExamUdaan',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default function ResultsPage() {
  return (
    <ListingPage
      defaultType="result"
      title="Exam Results"
      subtitle="Latest declared results — check merit list, scorecard, and cut-off"
    />
  )
}
