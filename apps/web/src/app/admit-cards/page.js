// ============================================================
// app/admit-cards/page.js — Admit Cards Listing Page
// ============================================================

import ListingPage from '../../components/ListingPage'

export const metadata = {
  title: 'Admit Cards / Hall Tickets 2026 — Download | ExamUdaan',
  description: 'Download admit cards and hall tickets for upcoming government exams. Filter by board, state, and education level.',
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
