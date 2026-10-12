// ============================================================
// app/jobs/closing-soon/page.js — Urgent / Closing Soon Exam Openings
// Clean URL replacing /jobs?sort=closing
// ExamUdaan.in | Clean SEO Architecture
// ============================================================

import ListingPage from '../../../components/ListingPage'

export const metadata = {
  title: 'Urgent Govt Job Openings 2026 — Closing Soon Deadlines | ExamUdaan',
  description: 'Apply now before deadlines expire! Browse urgent government jobs and exam notifications closing in the next few days across Maharashtra & Central India.',
  alternates: {
    canonical: 'https://examudaan.in/jobs/closing-soon',
  },
  openGraph: {
    title: 'Urgent Govt Job Openings 2026 — Closing Soon Deadlines | ExamUdaan',
    description: 'Apply now before deadlines expire! Browse urgent government jobs and exam notifications closing in the next few days.',
    url: 'https://examudaan.in/jobs/closing-soon',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Urgent Govt Jobs 2026 | ExamUdaan',
    description: 'Active exam notifications and recruitments closing soon. Don\'t miss your application deadline.',
  },
}

export default function ClosingSoonJobsPage() {
  return (
    <ListingPage
      defaultType="recruitment"
      initialSort="closing"
      title="Urgent Government Job Openings"
      subtitle="Recruitments closing in the coming days — verify eligibility and submit application before deadline"
    />
  )
}
