// ============================================================
// app/results/page.js — Results Listing Page
// ============================================================

import ListingPage from '../../components/ListingPage'

export const metadata = {
  title: 'Exam Results 2026 — Check Now | ExamUdaan',
  description: 'Latest declared exam results for UPSC, SSC, Railway, MPSC, Banking & State PSC. Check merit list, scorecard, and cut-off.',
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
