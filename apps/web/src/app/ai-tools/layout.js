// ============================================================
// app/ai-tools/layout.js — AI Tools Directory Metadata
// ============================================================

import { REAL_AI_TOOLS_COUNT } from '@/lib/platformStats'

export const metadata = {
  title: {
    absolute: `Top AI Tools for Students & Aspirants 2026 (${REAL_AI_TOOLS_COUNT}+ Tools) | ExamUdaan`,
  },
  description: `Curated directory of ${REAL_AI_TOOLS_COUNT}+ free AI tools for study, note-making, PDF chat, math and exam preparation — reviewed for Indian competitive exam aspirants.`,
  keywords: [
    'AI tools for students', 'free AI tools 2026', 'AI tools for exam preparation',
    'NotebookLM for MPSC', 'AI note making tool', 'PDF chat AI',
    'best AI tools India', 'AI study tools', 'MPSC AI preparation'
  ],
  alternates: {
    canonical: 'https://examudaan.in/ai-tools',
  },
  openGraph: {
    title: `Top AI Tools for Students & Aspirants 2026 (${REAL_AI_TOOLS_COUNT}+ Tools) | ExamUdaan`,
    description: `${REAL_AI_TOOLS_COUNT}+ free AI tools for exam preparation, note-making, PDF chat, math & essay writing — for Indian aspirants.`,
    url: 'https://examudaan.in/ai-tools',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `Best AI Tools for Students 2026 | ExamUdaan`,
    description: `${REAL_AI_TOOLS_COUNT}+ free AI tools for MPSC & exam preparation — note-making, PDF chat, math & more.`,
  },
}

export default function AiToolsLayout({ children }) {
  return children
}
