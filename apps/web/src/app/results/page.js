// ============================================================
// app/results/page.js — Results Listing Page
// Metadata is set dynamically: filter/query params (?org=, ?q=)
// receive robots: { index: false, follow: true } and canonical to clean URL.
// ============================================================

import ListingPage from '../../components/ListingPage'
import { fitDescription } from '../../lib/seoMetadata'

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams
  const hasParams = resolvedParams && Object.keys(resolvedParams).length > 0

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
    ...(hasParams ? { robots: { index: false, follow: true } } : {}),
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
