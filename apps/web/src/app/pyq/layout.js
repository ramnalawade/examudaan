// ============================================================
// app/pyq/layout.js — Previous Year Question Papers Metadata
// ============================================================

export const metadata = {
  title: '15-Year PYQ Bank — Previous Year Question Papers',
  description: 'Download free 15-year previous year question papers (PYQ) with official answer keys for MPSC, UPSC, Police Bharti, Talathi, SSC & Banking exams. Topic-wise searchable.',
  keywords: [
    'MPSC PYQ', 'previous year question papers', 'PYQ with answer key',
    'MPSC previous papers', 'police bharti PYQ', 'talathi PYQ',
    'SSC CGL previous papers', 'UPSC PYQ', 'topic-wise PYQ'
  ],
  alternates: {
    canonical: 'https://examudaan.in/pyq',
  },
  openGraph: {
    title: '15-Year PYQ Bank — Previous Year Question Papers | ExamUdaan',
    description: 'Download free PYQ papers with answer keys and solutions for MPSC, Police Bharti, Talathi, SSC & UPSC.',
    url: 'https://examudaan.in/pyq',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'PYQ Bank 2026 | ExamUdaan',
    description: '15-year PYQ papers with answer keys — MPSC, Police, Talathi, SSC.',
  },
}

export default function PyqLayout({ children }) {
  return children
}
