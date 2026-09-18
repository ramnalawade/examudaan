// ============================================================
// app/search/layout.js — Search Page Metadata
// ============================================================

export const metadata = {
  title: {
    absolute: 'Search Govt Jobs & Exams | ExamUdaan.in — Maharashtra Govt Job Alerts | MPSC, Police Bharti, BMC',
  },
  description: 'Search Maharashtra government job recruitments, results, admit cards, and answer keys across MPSC, Police Bharti, BMC, ZP, and more.',
  alternates: {
    canonical: 'https://examudaan.in/search',
  },
  openGraph: {
    title: 'Search Govt Jobs & Exams | ExamUdaan.in — Maharashtra Govt Job Alerts | MPSC, Police Bharti, BMC',
    description: 'Search Maharashtra government job recruitments, results, admit cards, and answer keys across MPSC, Police Bharti, BMC, ZP, and more.',
    url: 'https://examudaan.in/search',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function SearchLayout({ children }) {
  return children
}
