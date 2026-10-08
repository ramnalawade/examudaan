// ============================================================
// app/dashboard/layout.js — Candidate Dashboard Metadata
// ============================================================

export const metadata = {
  title: {
    absolute: 'Candidate Dashboard | ExamUdaan',
  },
  description: 'Manage your saved jobs, track application statuses, and customize personalized exam alerts.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({ children }) {
  return children
}
