// ============================================================
// app/jobs/page.js — Jobs Listing Page (Server component wrapper)
// Metadata is set dynamically: filter/query params (?org=, ?q=, ?state=)
// receive robots: { index: false, follow: true } and canonical to clean URL.
// ============================================================

import ListingPage from '../../components/ListingPage'
import { fitDescription } from '../../lib/seoMetadata'

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams
  const hasParams = resolvedParams && Object.keys(resolvedParams).length > 0

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
    ...(hasParams ? { robots: { index: false, follow: true } } : {}),
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
