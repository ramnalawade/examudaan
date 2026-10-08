// ============================================================
// app/search/layout.js — Search Page Metadata
// ============================================================

export const metadata = {
  title: {
    absolute: 'Search Govt Jobs & Exams 2026 | ExamUdaan',
  },
  description: 'Search Maharashtra government job recruitments, results, admit cards, and answer keys across MPSC, Police Bharti, BMC, ZP, and more.',
  keywords: [
    'search govt jobs', 'MPSC jobs search', 'Maharashtra sarkari naukri search',
    'exam results search', 'admit card search', 'answer key search', 'government exam search'
  ],
  alternates: {
    canonical: 'https://examudaan.in/search',
  },
  openGraph: {
    title: 'Search Govt Jobs & Exams 2026 | ExamUdaan',
    description: 'Search Maharashtra government job recruitments, results, admit cards, and answer keys.',
    url: 'https://examudaan.in/search',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Search Govt Jobs & Exams | ExamUdaan',
    description: 'Search MPSC, Police Bharti, BMC, ZP jobs, results, admit cards & answer keys.',
  },
}

export default function SearchLayout({ children }) {
  return children
}
