// ============================================================
// app/current-affairs/layout.js — Daily Current Affairs Metadata
// ============================================================

export const metadata = {
  title: 'Daily Current Affairs 2026 — Exam-focused Digest',
  description: 'Daily news digest, national & state affairs, PIB summaries, and economic updates for MPSC, UPSC, Banking, and Police Bharti exams. Updated daily.',
  keywords: [
    'daily current affairs 2026', 'MPSC current affairs', 'UPSC current affairs',
    'Maharashtra current affairs', 'PIB summary', 'banking current affairs',
    'police bharti news', 'today current affairs', 'exam current affairs'
  ],
  alternates: {
    canonical: 'https://examudaan.in/current-affairs',
  },
  openGraph: {
    title: 'Daily Current Affairs 2026 | ExamUdaan',
    description: 'Exam-focused daily news digest and current affairs for MPSC, UPSC, Banking & Police Bharti.',
    url: 'https://examudaan.in/current-affairs',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Daily Current Affairs 2026 | ExamUdaan',
    description: 'MPSC, UPSC & Banking daily current affairs — updated daily.',
  },
}

export default function CurrentAffairsLayout({ children }) {
  return children
}
