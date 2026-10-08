// ============================================================
// app/schemes/layout.js — Schemes / Syllabus Metadata
// ============================================================

export const metadata = {
  title: 'Exam Schemes & Patterns 2026 — Official Syllabus',
  description: 'Download official exam schemes, syllabi, and marking patterns for MPSC, Police Bharti, Talathi, SSC & Banking 2026 — sourced from official government notifications.',
  keywords: [
    'exam scheme 2026', 'MPSC exam pattern', 'police bharti exam scheme',
    'talathi exam syllabus', 'SSC CGL exam pattern', 'marking scheme download',
    'official exam syllabus', 'government exam scheme'
  ],
  alternates: {
    canonical: 'https://examudaan.in/schemes',
  },
  openGraph: {
    title: 'Exam Schemes & Patterns 2026 | ExamUdaan',
    description: 'Official exam schemes, syllabi and marking patterns for MPSC, Police, Talathi, SSC & Banking.',
    url: 'https://examudaan.in/schemes',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Exam Schemes 2026 | ExamUdaan',
    description: 'Official exam schemes & syllabi for MPSC, Police Bharti, Talathi & SSC.',
  },
}

export default function SchemesLayout({ children }) {
  return children
}
