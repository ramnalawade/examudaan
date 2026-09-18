// ============================================================
// app/jobs/page.js — Jobs Listing Page (Server component wrapper)
// Metadata is set here; actual client UI is in ListingPage component
// ============================================================

import ListingPage from '../../components/ListingPage'

export const metadata = {
  title: 'Government Jobs 2026 — Apply Online | ExamUdaan',
  description: 'Browse latest government jobs. Filter by organization, education, state. MPSC, UPSC, SSC, Railway, Banking & more.',
}

export default function JobsPage() {
  return (
    <ListingPage
      defaultType="recruitment"
      title="Government Jobs"
      subtitle="Latest vacancies — filter by org, qualification, state, salary"
    />
  )
}
