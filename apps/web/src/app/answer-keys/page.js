// ============================================================
// app/answer-keys/page.js — Answer Keys Listing Page
// All URLs are indexable. Canonical URL always points to /answer-keys.
// ============================================================

import ListingPage from '../../components/ListingPage'
import { fitDescription } from '../../lib/seoMetadata'

export async function generateMetadata() {
  const title = 'Official Answer Keys 2026 — Response Sheet & PDF'
  const description = fitDescription(
    'Download official & provisional answer keys for MPSC, SSC, RRB, UPSC, Police Bharti 2026. Calculate your score and raise objections before results.',
    'Response sheet PDF on ExamUdaan.'
  )
  const canonicalUrl = 'https://examudaan.in/answer-keys'

  return {
    title: { absolute: title },
    description,
    keywords: [
      'answer key 2026', 'MPSC answer key', 'SSC CGL answer key', 'RRB answer key',
      'police bharti answer key', 'provisional answer key', 'calculate score', 'objection'
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

export default function AnswerKeysPage() {
  return (
    <ListingPage
      defaultType="answer_key"
      title="Answer Keys"
      subtitle="Official answer keys — calculate your score before results"
    />
  )
}
