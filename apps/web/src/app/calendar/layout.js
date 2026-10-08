// ============================================================
// app/calendar/layout.js — Exam Calendar & Schedule Metadata
// ============================================================

export const metadata = {
  title: 'Govt Exam Calendar 2026',
  description: 'Annual exam calendar and official timetable for MPSC, UPSC, SSC, Banking, and Maharashtra recruitment exams. Never miss an application deadline.',
  alternates: {
    canonical: 'https://examudaan.in/calendar',
  },
  openGraph: {
    title: 'Govt Exam Calendar 2026 | ExamUdaan',
    description: 'Annual exam calendar and official application deadlines.',
    url: 'https://examudaan.in/calendar',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function CalendarLayout({ children }) {
  return children
}
