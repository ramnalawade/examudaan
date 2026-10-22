// ============================================================
// app/schemes/layout.js — Schemes / Syllabus Listing Layout
// ============================================================

import { fitDescription } from '@/lib/seoMetadata'

export const metadata = {
  title: 'Exam Schemes & Syllabus 2026 — Official Patterns',
  description: fitDescription(
    'Download official exam schemes, syllabi and marking patterns for MPSC, Police Bharti, Talathi, SSC & Banking 2026 — sourced from official notifications.',
    'Official syllabus PDF download on ExamUdaan.'
  ),
  keywords: [
    'exam scheme 2026', 'MPSC exam pattern', 'police bharti exam scheme',
    'talathi exam syllabus', 'SSC CGL exam pattern', 'marking scheme download',
    'official exam syllabus', 'government exam scheme'
  ],
  alternates: {
    canonical: 'https://examudaan.in/schemes',
  },
  openGraph: {
    title: 'Exam Schemes & Syllabus 2026 — Official Patterns',
    description: 'Official exam schemes, syllabi and marking patterns for MPSC, Police, Talathi, SSC & Banking.',
    url: 'https://examudaan.in/schemes',
    siteName: 'ExamUdaan',
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
