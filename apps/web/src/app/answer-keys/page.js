// ============================================================
// app/answer-keys/page.js — Answer Keys Listing Page
// ============================================================

import ListingPage from '../../components/ListingPage'

export const metadata = {
  title: 'Answer Keys 2026 — Download Official Keys | ExamUdaan',
  description: 'Official and provisional answer keys for government exams. Calculate your score before results are declared.',
}

export default function AnswerKeysPage() {
  return (
    <ListingPage
      defaultType="answer_key"
      title="Answer Keys"
      subtitle="Official answer keys — calculate your score before results"
    />
  )
}
