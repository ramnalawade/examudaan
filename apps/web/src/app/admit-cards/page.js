// ============================================================
// app/admit-cards/page.js — Admit Cards Listing Page
// All URLs are indexable. Canonical URL always points to /admit-cards.
// ============================================================

import ListingPage from '../../components/ListingPage'
import { fitDescription } from '../../lib/seoMetadata'

export async function generateMetadata() {
  const title = 'Admit Cards 2026 — Download Hall Ticket Online'
  const description = fitDescription(
    'Download official admit cards and hall tickets for MPSC, SSC, RRB, UPSC & Police Bharti 2026. Get exam date, center & reporting time in one click.',
    'Fast download link on ExamUdaan.'
  )
  const canonicalUrl = 'https://examudaan.in/admit-cards'

  return {
    title: { absolute: title },
    description,
    keywords: [
      'admit card 2026', 'hall ticket download', 'MPSC admit card', 'SSC CGL admit card',
      'RRB admit card', 'police bharti hall ticket', 'exam date slip', 'call letter'
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

export default function AdmitCardsPage() {
  return (
    <ListingPage
      defaultType="admit_card"
      title="Admit Cards"
      subtitle="Download hall tickets for upcoming government exams"
    />
  )
}
