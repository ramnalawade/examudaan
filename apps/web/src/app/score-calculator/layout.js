// ============================================================
// app/score-calculator/layout.js — Exam Negative Marking Score Calculator Metadata
// ============================================================

export const metadata = {
  title: 'Negative Marking & Score Calculator 2026',
  description: 'Calculate your normalized and net marks for MPSC, UPSC, SSC, Banking, and Police Bharti exams with negative marking penalties (1/3, 1/4, 1/2). Instant results.',
  keywords: [
    'negative marking calculator', 'score calculator 2026', 'MPSC marks calculator',
    'SSC CGL negative marking', 'exam score calculator', '1/4 negative marking',
    'TCS pattern score calculator', 'police bharti marks calculator'
  ],
  alternates: {
    canonical: 'https://examudaan.in/score-calculator',
  },
  openGraph: {
    title: 'Negative Marking & Score Calculator 2026 | ExamUdaan',
    description: 'Calculate net exam marks with exact negative marking deductions for MPSC, SSC, UPSC & Banking.',
    url: 'https://examudaan.in/score-calculator',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Score Calculator 2026 | ExamUdaan',
    description: 'Calculate exam marks with negative marking — MPSC, SSC, UPSC & Banking.',
  },
}

export default function ScoreCalculatorLayout({ children }) {
  return children
}
