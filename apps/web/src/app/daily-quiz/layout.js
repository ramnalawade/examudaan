// ============================================================
// app/daily-quiz/layout.js — Daily GK & Current Affairs Quiz Metadata
// ============================================================

export const metadata = {
  title: 'Daily Quiz 2026 — General Knowledge & Current Affairs Test | ExamUdaan',
  description: 'Test your daily preparation with 10 fresh exam-level MCQs in Marathi and English. Instant explanations and score tracking for MPSC, Police Bharti & Talathi.',
  alternates: {
    canonical: 'https://examudaan.in/daily-quiz',
  },
  openGraph: {
    title: 'Daily GK & Current Affairs Quiz 2026 | ExamUdaan',
    description: '10 daily exam-level MCQs with instant explanations.',
    url: 'https://examudaan.in/daily-quiz',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function DailyQuizLayout({ children }) {
  return children
}
