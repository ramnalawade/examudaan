// ============================================================
// app/jobs/central-govt/page.js — Central Government Recruitment Hub
// Clean URL replacing /jobs?govt_level=Central
// ExamUdaan.in | Clean SEO Architecture
// ============================================================

import ListingPage from '../../../components/ListingPage'

export const metadata = {
  title: 'Central Government Jobs 2026 — UPSC, SSC, Railways & Defence | ExamUdaan',
  description: 'Browse 50,000+ active Central Government jobs 2026. Official UPSC, SSC, Indian Railways, Defence & PSU vacancies with direct application links and exam dates.',
  alternates: {
    canonical: 'https://examudaan.in/jobs/central-govt',
  },
  openGraph: {
    title: 'Central Government Jobs 2026 — UPSC, SSC, Railways & Defence | ExamUdaan',
    description: 'Browse 50,000+ active Central Government jobs 2026. Official UPSC, SSC, Indian Railways, Defence & PSU vacancies.',
    url: 'https://examudaan.in/jobs/central-govt',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Central Govt Jobs 2026 | ExamUdaan',
    description: 'All-India central government vacancies across UPSC, SSC, Railways, Defence, and Autonomous bodies.',
  },
}

export default function CentralGovtJobsPage() {
  return (
    <ListingPage
      defaultType="recruitment"
      initialGovtLevel="Central"
      title="Central Government Jobs 2026"
      subtitle="All-India notifications across UPSC, SSC, Indian Railways, Defence, and Central PSUs"
    />
  )
}
