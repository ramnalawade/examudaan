// ============================================================
// app/answer-keys/page.js — Answer Keys Listing Page
// ============================================================

import ListingPage from '../../components/ListingPage'

export const metadata = {
  title: 'Official Answer Keys 2026 — Calculate Your Score',
  description: 'Download official & provisional answer keys for MPSC, SSC, RRB, UPSC, Police Bharti 2026. Calculate your score and raise objections before final results.',
  keywords: [
    'answer key 2026', 'MPSC answer key', 'SSC CGL answer key', 'RRB answer key',
    'police bharti answer key', 'provisional answer key', 'calculate score', 'objection'
  ],
  alternates: {
    canonical: 'https://examudaan.in/answer-keys',
  },
  openGraph: {
    title: 'Official Answer Keys 2026 | ExamUdaan',
    description: 'MPSC, SSC, RRB & Police Bharti official answer keys — calculate your score before results.',
    url: 'https://examudaan.in/answer-keys',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Answer Keys 2026 | ExamUdaan',
    description: 'MPSC, SSC, RRB & Police Bharti answer keys — calculate your score before results.',
  },
}

export default function AnswerKeysPage() {
  return (
    <ListingPage
      defaultType="answer_key"
      title="Answer Keys"
      subtitle="Official answer keys — calculate your score before results"
    />
  )
}
