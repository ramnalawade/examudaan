// ============================================================
// app/mock-tests/[slug]/page.js — Live CBT MCQ Test Engine (Server Component)
// ExamUdaan.in — Static Generation & Server-side validation
// ============================================================

import { notFound } from 'next/navigation'
import { getTestBySlug, ALL_TEST_SLUGS } from '@/lib/mockTestsData'
import TestEngineClient from './TestEngineClient'

export function generateStaticParams() {
  return ALL_TEST_SLUGS.map(slug => ({ slug }))
}

export default async function TestEnginePage({ params }) {
  const resolvedParams = params && typeof params.then === 'function' ? await params : (params || {})
  const test = getTestBySlug(resolvedParams?.slug)

  if (!test) {
    notFound()
  }

  return <TestEngineClient test={test} />
}
