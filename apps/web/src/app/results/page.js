// ============================================================
// app/results/page.js — Results Listing Page
// ============================================================

import ListingPage from '../../components/ListingPage'

export const metadata = {
  title: 'Exam Results 2026 — Check Merit List & Scorecard',
  description: 'Latest declared government exam results 2026 — MPSC, SSC, RRB, UPSC, Banking, Maharashtra Police Bharti. Check merit list, final answer key & cut-off.',
  keywords: [
    'exam results 2026', 'MPSC result', 'SSC CGL result', 'RRB result',
    'police bharti result', 'merit list', 'scorecard', 'cut-off marks'
  ],
  alternates: {
    canonical: 'https://examudaan.in/results',
  },
  openGraph: {
    title: 'Exam Results 2026 — Merit List & Scorecard | ExamUdaan',
    description: 'Latest MPSC, SSC, RRB, UPSC & Police Bharti results. Check merit list, scorecard and cut-off.',
    url: 'https://examudaan.in/results',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Exam Results 2026 | ExamUdaan',
    description: 'Latest MPSC, SSC, RRB & Police Bharti results — merit list & cut-off.',
  },
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
