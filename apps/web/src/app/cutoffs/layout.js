// ============================================================
// app/cutoffs/layout.js — Exam Cut-Off Marks Directory Metadata
// ============================================================

export const metadata = {
  title: 'Government Exam Cut-Off Marks 2026 — Category-wise Trends | ExamUdaan',
  description: 'Check official previous years and expected cut-off marks for MPSC, Police Bharti, Talathi, SSC, and Banking exams by category (Open, OBC, SC, ST, EWS).',
  alternates: {
    canonical: 'https://examudaan.in/cutoffs',
  },
  openGraph: {
    title: 'Government Exam Cut-Off Marks 2026 | ExamUdaan',
    description: 'Category-wise cut-off marks and merit trends.',
    url: 'https://examudaan.in/cutoffs',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function CutoffsLayout({ children }) {
  return children
}
