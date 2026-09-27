// ============================================================
// app/current-affairs/layout.js — Daily Current Affairs Metadata
// ============================================================

export const metadata = {
  title: 'Daily Current Affairs 2026 for Maharashtra & Central Exams | ExamUdaan',
  description: 'Daily news digest, national & state affairs, PIB summaries, and economic updates curated specifically for MPSC, UPSC, Banking, and Police Bharti exams.',
  alternates: {
    canonical: 'https://examudaan.in/current-affairs',
  },
  openGraph: {
    title: 'Daily Current Affairs 2026 | ExamUdaan',
    description: 'Exam-focused daily news digest and current affairs summaries.',
    url: 'https://examudaan.in/current-affairs',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function CurrentAffairsLayout({ children }) {
  return children
}
