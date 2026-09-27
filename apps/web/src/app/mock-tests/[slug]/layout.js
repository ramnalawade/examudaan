// ============================================================
// app/mock-tests/[slug]/layout.js — Individual CBT Mock Test Metadata
// ============================================================

import { getTestBySlug } from '@/lib/mockTestsData'

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const test = getTestBySlug(resolvedParams?.slug)
  if (!test) return { title: 'Mock Test | ExamUdaan' }

  const canonicalUrl = `https://examudaan.in/mock-tests/${test.slug}`
  return {
    title: `${test.title} — Online CBT Mock Test | ExamUdaan`,
    description: test.description || `Attempt free online mock test for ${test.examName}. ${test.totalMarks} marks, ${test.durationMinutes} mins with instant scorecard and rank prediction.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${test.title} | ExamUdaan`,
      description: test.description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'ExamUdaan.in',
    },
  }
}

export default function MockTestDetailLayout({ children }) {
  return children
}
