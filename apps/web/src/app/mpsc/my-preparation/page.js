// ============================================================
// app/mpsc/my-preparation/page.js — Personal Weakness & Revision Tracker
// ExamUdaan.in — SEO Optimized, Rich Schema, Zero Inline Styles
// ============================================================

import MyPreparationClient from './MyPreparationClient'

export const metadata = {
  title: 'My MPSC Preparation & Personal Mistake Notebook (चूक वही) | ExamUdaan',
  description: 'Track your mock test accuracy, maintain your personal MPSC mistake notebook, and master weak topics using scientifically timed Leitner spaced repetition.',
  keywords: [
    'MPSC preparation tracker',
    'MPSC mistake notebook',
    'MPSC chuk vahi',
    'spaced repetition MPSC',
    'MPSC mock test analysis',
    'weak topic tracker MPSC',
    'Leitner flashcards Maharashtra'
  ],
  alternates: {
    canonical: 'https://examudaan.in/mpsc/my-preparation',
  },
  openGraph: {
    title: 'Personal MPSC Weakness & Revision Tracker | ExamUdaan',
    description: 'Track your mock test accuracy by subject, log incorrect answers in your mistake notebook, and take custom tests from previous errors.',
    url: 'https://examudaan.in/mpsc/my-preparation',
    siteName: 'ExamUdaan',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal MPSC Weakness & Revision Tracker (चूक वही)',
    description: 'Transform mock test attempts into repeat mastery with spaced repetition and mistake re-tests.',
  },
}

export default function MyPreparationPage() {
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
        'name': 'MPSC Papers',
        'item': 'https://examudaan.in/mpsc-pyq'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'My Preparation & Mistake Notebook',
        'item': 'https://examudaan.in/mpsc/my-preparation'
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MyPreparationClient />
    </>
  )
}
