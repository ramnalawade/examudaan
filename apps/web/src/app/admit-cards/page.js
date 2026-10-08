// ============================================================
// app/admit-cards/page.js — Admit Cards Listing Page
// ============================================================

import ListingPage from '../../components/ListingPage'

export const metadata = {
  title: 'Admit Cards & Hall Tickets 2026 — Download Now',
  description: 'Download official admit cards and hall tickets for MPSC, SSC, RRB, UPSC, Police Bharti 2026. Get exam date, centre & reporting time in one click.',
  keywords: [
    'admit card 2026', 'hall ticket download', 'MPSC admit card', 'SSC CGL admit card',
    'RRB admit card', 'police bharti hall ticket', 'exam date slip', 'call letter'
  ],
  alternates: {
    canonical: 'https://examudaan.in/admit-cards',
  },
  openGraph: {
    title: 'Admit Cards & Hall Tickets 2026 | ExamUdaan',
    description: 'Download official MPSC, SSC, RRB & Police Bharti admit cards — exam date, centre & reporting time.',
    url: 'https://examudaan.in/admit-cards',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Admit Cards 2026 | ExamUdaan',
    description: 'Download MPSC, SSC, RRB & Police Bharti admit cards — exam date, centre & reporting time.',
  },
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
