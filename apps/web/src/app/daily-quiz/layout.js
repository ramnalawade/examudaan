// ============================================================
// app/daily-quiz/layout.js — Daily GK & Current Affairs Quiz Metadata
// ============================================================

export const metadata = {
  title: 'Daily GK & Current Affairs Quiz 2026',
  description: 'Test your daily preparation with 10 fresh exam-level MCQs in Marathi and English. Instant explanations and score tracking for MPSC, Police Bharti & Talathi.',
  keywords: [
    'daily GK quiz', 'current affairs quiz 2026', 'MPSC daily quiz',
    'police bharti MCQ', 'talathi daily quiz', 'Marathi GK quiz',
    'exam MCQ practice', 'government exam quiz'
  ],
  alternates: {
    canonical: 'https://examudaan.in/daily-quiz',
  },
  openGraph: {
    title: 'Daily GK & Current Affairs Quiz 2026 | ExamUdaan',
    description: '10 daily exam-level MCQs with instant explanations for MPSC, Police Bharti & Talathi.',
    url: 'https://examudaan.in/daily-quiz',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Daily GK Quiz 2026 | ExamUdaan',
    description: '10 daily MCQs with instant explanations — MPSC, Police Bharti & Talathi.',
  },
}

export default function DailyQuizLayout({ children }) {
  return children
}
