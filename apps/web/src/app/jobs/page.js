// ============================================================
// app/jobs/page.js — Jobs Listing Page (Server component wrapper)
// Metadata is set here; actual client UI is in ListingPage component
// ============================================================

import ListingPage from '../../components/ListingPage'

export const metadata = {
  title: 'Government Jobs 2026 — Apply Online',
  description: 'Browse 270+ latest Maharashtra & India government jobs 2026. MPSC, Police Bharti, SSC, RRB, Banking, ZP, BMC — filter by qualification, state & salary.',
  keywords: [
    'government jobs 2026', 'sarkari naukri', 'MPSC recruitment', 'Maharashtra govt jobs',
    'SSC jobs', 'Railway jobs', 'Banking jobs', 'police bharti', 'ZP bharti', 'BMC recruitment'
  ],
  alternates: {
    canonical: 'https://examudaan.in/jobs',
  },
  openGraph: {
    title: 'Government Jobs 2026 — Apply Online | ExamUdaan',
    description: 'Browse 270+ latest Maharashtra & India government job notifications. MPSC, Police Bharti, SSC, RRB, Banking & more.',
    url: 'https://examudaan.in/jobs',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Government Jobs 2026 | ExamUdaan',
    description: '270+ latest Maharashtra & India govt job notifications — MPSC, SSC, RRB, Banking, Police Bharti.',
  },
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
