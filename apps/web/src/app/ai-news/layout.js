// ============================================================
// app/ai-news/layout.js — AI News & Research Radar Metadata
// ============================================================

export const metadata = {
  title: 'AI News & Research Radar 2026',
  description: 'Curated daily AI news, breakthrough arXiv research papers, and discussions for competitive exam science & tech preparation.',
  keywords: [
    'AI news 2026', 'artificial intelligence news India', 'arXiv research papers',
    'AI for exam preparation', 'science tech current affairs', 'AI weekly digest'
  ],
  alternates: {
    canonical: 'https://examudaan.in/ai-news',
  },
  openGraph: {
    title: 'AI News & Research Radar 2026 | ExamUdaan',
    description: 'Curated daily AI news, arXiv breakthroughs and discussions for science & tech exam prep.',
    url: 'https://examudaan.in/ai-news',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'AI News Radar 2026 | ExamUdaan',
    description: 'Daily AI news & arXiv research for science & tech exam preparation.',
  },
}

export default function AiNewsLayout({ children }) {
  return children
}
