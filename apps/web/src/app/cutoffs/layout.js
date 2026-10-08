// ============================================================
// app/cutoffs/layout.js — Exam Cut-Off Marks Directory Metadata
// ============================================================

export const metadata = {
  title: 'Govt Exam Cut-Off Marks 2026 — Category-wise',
  description: 'Check official previous year and expected cut-off marks for MPSC, Police Bharti, Talathi, SSC & Banking exams by category (Open, OBC, SC, ST, EWS).',
  keywords: [
    'MPSC cut off 2026', 'police bharti cutoff', 'SSC CGL cutoff',
    'talathi cut off', 'category-wise cutoff', 'OBC cutoff', 'merit cutoff',
    'expected cutoff 2026', 'exam selection cutoff'
  ],
  alternates: {
    canonical: 'https://examudaan.in/cutoffs',
  },
  openGraph: {
    title: 'Govt Exam Cut-Off Marks 2026 | ExamUdaan',
    description: 'Category-wise cut-off marks for MPSC, Police Bharti, Talathi, SSC & Banking exams.',
    url: 'https://examudaan.in/cutoffs',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Exam Cut-Off Marks 2026 | ExamUdaan',
    description: 'MPSC, Police Bharti, SSC & Talathi category-wise cut-off marks.',
  },
}

export default function CutoffsLayout({ children }) {
  return children
}
