// ============================================================
// app/jobs/page.js — Jobs Listing Page (Server component wrapper)
// All URLs including filtered ones are indexable. Canonical URL always
// points to /jobs so Google consolidates link equity.
// ============================================================

import ListingPage from '../../components/ListingPage'
import { fitDescription } from '../../lib/seoMetadata'

export async function generateMetadata() {
  const title = 'Govt Jobs 2026 — Latest Recruitment Notifications'
  const description = fitDescription(
    'Browse 270+ latest Maharashtra & India government jobs 2026. MPSC, Police Bharti, SSC, RRB, Banking, ZP & BMC — filter by qualification, state & salary.',
    'Apply online on ExamUdaan.'
  )
  const canonicalUrl = 'https://examudaan.in/jobs'

  return {
    title: { absolute: title },
    description,
    keywords: [
      'government jobs 2026', 'sarkari naukri', 'MPSC recruitment', 'Maharashtra govt jobs',
      'SSC jobs', 'Railway jobs', 'Banking jobs', 'police bharti', 'ZP bharti', 'BMC recruitment'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ExamUdaan',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
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
