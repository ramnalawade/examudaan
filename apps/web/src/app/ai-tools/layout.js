// ============================================================
// app/ai-tools/layout.js — AI Tools Directory Metadata
// ============================================================

export const metadata = {
  title: 'Top AI Tools for Students & Aspirants 2026',
  description: 'Curated directory of 50+ free and essential AI tools for study, note-making, PDF chat, essay writing, coding, and exam preparation — reviewed for Indian aspirants.',
  keywords: [
    'AI tools for students', 'free AI tools 2026', 'AI tools for exam preparation',
    'NotebookLM for MPSC', 'AI note making tool', 'PDF chat AI',
    'best AI tools India', 'AI study tools', 'MPSC AI preparation'
  ],
  alternates: {
    canonical: 'https://examudaan.in/ai-tools',
  },
  openGraph: {
    title: 'Top AI Tools for Students & Aspirants 2026 | ExamUdaan',
    description: '50+ free AI tools for exam preparation, note-making, PDF chat & essay writing — for Indian aspirants.',
    url: 'https://examudaan.in/ai-tools',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Best AI Tools for Students 2026 | ExamUdaan',
    description: '50+ free AI tools for MPSC & exam preparation — note-making, PDF chat & more.',
  },
}

export default function AiToolsLayout({ children }) {
  return children
}
