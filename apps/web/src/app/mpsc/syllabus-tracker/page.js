// ============================================================
// app/mpsc/syllabus-tracker/page.js — Interactive Syllabus-to-PYQ Checklist
// ExamUdaan.in — SEO Optimized, Rich Schema, Zero Inline Styles
// ============================================================

import SyllabusTrackerClient from './SyllabusTrackerClient'
import { SYLLABUS_EXAMS } from '@/lib/syllabusData'

export const metadata = {
  title: 'Interactive MPSC Syllabus Tracker & PYQ Checklist | ExamUdaan',
  description: 'Track your preparation across official MPSC Rajyaseva, Group B & Group C syllabi. Topic-by-topic progress checklist, PYQ bank density, and documented pattern changes.',
  keywords: [
    'MPSC syllabus tracker',
    'MPSC syllabus checklist',
    'MPSC topic progress',
    'MPSC PYQ mapper',
    'Rajyaseva syllabus checklist',
    'MPSC revised pattern comparison',
    'MPSC study roadmap'
  ],
  alternates: {
    canonical: 'https://examudaan.in/mpsc/syllabus-tracker',
  },
  openGraph: {
    title: 'Interactive MPSC Syllabus Tracker & PYQ Checklist | ExamUdaan',
    description: 'Convert every official MPSC syllabus into an actionable study checklist. Connect subtopics directly to 10,392+ solved questions.',
    url: 'https://examudaan.in/mpsc/syllabus-tracker',
    siteName: 'ExamUdaan',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive MPSC Syllabus Tracker & PYQ Checklist',
    description: 'Topic-by-topic MPSC syllabus checklist with real-time PYQ density counters and readiness score.',
  },
}

export default function MpscSyllabusTrackerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://examudaan.in'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'MPSC Syllabus',
        'item': 'https://examudaan.in/syllabus/mpsc'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'Interactive Syllabus Tracker',
        'item': 'https://examudaan.in/mpsc/syllabus-tracker'
      }
    ]
  }

  // Filter top MPSC exams
  const mpscExams = SYLLABUS_EXAMS.filter(e =>
    e.slug.startsWith('mpsc') || e.conductingBody?.includes('MPSC') || e.conductingBody?.includes('Maharashtra')
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SyllabusTrackerClient syllabusExams={mpscExams.length > 0 ? mpscExams : SYLLABUS_EXAMS.slice(0, 4)} />
    </>
  )
}
