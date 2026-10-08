// ============================================================
// app/feedback/layout.js — Candidate Feedback Desk Metadata
// ============================================================

export const metadata = {
  title: 'Feedback & Suggestions — ExamUdaan',
  description: 'Share your feedback, suggest new exams or features, or report issues to help us make ExamUdaan the most reliable government exam portal for aspirants.',
  keywords: [
    'ExamUdaan feedback', 'suggest exam', 'report issue', 'exam portal suggestions',
    'government job portal feedback', 'aspirant feedback'
  ],
  alternates: {
    canonical: 'https://examudaan.in/feedback',
  },
  openGraph: {
    title: 'Feedback & Suggestions | ExamUdaan',
    description: 'Share feedback, suggest exams or features, or report issues to improve ExamUdaan.',
    url: 'https://examudaan.in/feedback',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Feedback | ExamUdaan',
    description: 'Suggest new exams, features or report issues to ExamUdaan.',
  },
}

export default function FeedbackLayout({ children }) {
  return children
}
