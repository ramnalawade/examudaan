// ============================================================
// app/score-calculator/layout.js — Exam Negative Marking Score Calculator Metadata
// ============================================================

export const metadata = {
  title: 'Negative Marking & Merit Score Calculator 2026 | ExamUdaan',
  description: 'Calculate your normalized and net marks for MPSC, UPSC, SSC, Banking, and Police Bharti exams with negative marking penalties (1/3, 1/4, 1/2).',
  alternates: {
    canonical: 'https://examudaan.in/score-calculator',
  },
  openGraph: {
    title: 'Negative Marking & Merit Score Calculator | ExamUdaan',
    description: 'Calculate your net marks with exact negative marking deductions.',
    url: 'https://examudaan.in/score-calculator',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function ScoreCalculatorLayout({ children }) {
  return children
}
