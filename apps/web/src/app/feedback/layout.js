// ============================================================
// app/feedback/layout.js — Candidate Feedback Desk Metadata
// ============================================================

export const metadata = {
  title: 'Candidate Feedback & Exam Portal Suggestions | ExamUdaan',
  description: 'Share your feedback, suggest new exams or features, or report issues to help us make ExamUdaan the most reliable government exam portal.',
  alternates: {
    canonical: 'https://examudaan.in/feedback',
  },
  openGraph: {
    title: 'Candidate Feedback & Exam Portal Suggestions | ExamUdaan',
    description: 'Share your feedback and suggestions.',
    url: 'https://examudaan.in/feedback',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function FeedbackLayout({ children }) {
  return children
}
