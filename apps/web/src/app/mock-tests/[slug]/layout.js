import { getTestBySlug } from '@/lib/mockTestsData'

export async function generateMetadata({ params }) {
  const resolvedParams = params && typeof params.then === 'function' ? await params : (params || {})
  const test = getTestBySlug(resolvedParams?.slug)
  if (!test) return { title: 'Mock Test | ExamUdaan' }

  const canonicalUrl = `https://examudaan.in/mock-tests/${test.slug}`
  const totalMarks = test.totalMarks || ((test.totalQuestions || 100) * (test.marksPerQuestion || 1))
  return {
    title: `${test.title} — Online CBT Mock Test | ExamUdaan`,
    description: test.description || `Attempt free online mock test for ${test.examType || 'Competitive Exams'}. ${totalMarks} marks, ${test.durationMinutes} mins with instant scorecard and rank prediction.`,
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
