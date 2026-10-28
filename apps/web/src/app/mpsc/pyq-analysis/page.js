// ============================================================
// app/mpsc/pyq-analysis/page.js — MPSC PYQ Analytics Dashboard Page
// ExamUdaan.in — SEO Optimized, Rich Schema, Zero Inline Styles
// ============================================================

import PyqAnalyticsClient from './PyqAnalyticsClient'
import initialAnalyticsData from '@/lib/mpscAnalyticsData.json'

export const metadata = {
  title: 'MPSC PYQ Analytics & Weightage Dashboard (10,392 Questions Analyzed) | ExamUdaan',
  description: 'Verified historical question paper analysis across 89 official MPSC exams (2002–2025). Topic-wise frequency, recurring concepts, question formats, and Maharashtra weightage.',
  keywords: [
    'MPSC PYQ analysis',
    'MPSC topic weightage',
    'MPSC subject frequency',
    'MPSC previous year question trends',
    'Rajyaseva prelims analysis',
    'MPSC Group B question pattern',
    'MPSC recurring questions',
    'Maharashtra government exam analytics'
  ],
  alternates: {
    canonical: 'https://examudaan.in/mpsc/pyq-analysis',
  },
  openGraph: {
    title: 'MPSC PYQ Analytics & Topic Weightage Dashboard | ExamUdaan',
    description: 'Empirical analysis of 10,392 official MPSC questions (2002–2025). Explore recurring topics, Maharashtra vs National weightage, and difficulty ratings.',
    url: 'https://examudaan.in/mpsc/pyq-analysis',
    siteName: 'ExamUdaan',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MPSC PYQ Analytics & Weightage Dashboard (10,392 Questions Analyzed)',
    description: 'Empirical analysis of 89 official MPSC papers across Rajyaseva, Group B, Group C & Technical exams.',
  },
}

export default function MpscPyqAnalysisPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
            'name': 'PYQ Analytics',
            'item': 'https://examudaan.in/mpsc/pyq-analysis'
          }
        ]
      },
      {
        '@type': 'Dataset',
        'name': 'MPSC Historical Examination Question Analytics (2002–2025)',
        'description': 'Comprehensive question frequency, cognitive format, difficulty rating, and topic recurrence data across 10,392 verified Maharashtra Public Service Commission questions.',
        'url': 'https://examudaan.in/mpsc/pyq-analysis',
        'keywords': ['MPSC', 'PYQ', 'Question Paper Analysis', 'Maharashtra Public Service Commission', 'Competitive Exams'],
        'creator': {
          '@type': 'Organization',
          'name': 'ExamUdaan Editorial & Analytics Desk',
          'url': 'https://examudaan.in'
        },
        'temporalCoverage': '2002/2025',
        'spatialCoverage': {
          '@type': 'Place',
          'name': 'Maharashtra, India'
        }
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Which subjects have the highest weightage in MPSC Prelims?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Based on our empirical analysis of 10,392 questions, General Science (22.5%) and General Studies/Polity (21.1%) carry the largest question volume, followed by Economy (9.5%), Geography (7.9%), and History (6.9%).'
            }
          },
          {
            '@type': 'Question',
            'name': 'How many questions in MPSC focus exclusively on Maharashtra?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'In Geography, approximately 62% of questions test Maharashtra physical, economic, and mineral geography. In History, over 58% of questions relate to Maharashtra social reformers and the 1857 resistance.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What is the trend of multi-statement questions in MPSC?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Multi-statement questions (requiring candidates to evaluate statements A, B, and C) have surged from ~8% in 2014 to over 28% in 2024–2025, reflecting an increased emphasis on analytical depth.'
            }
          }
        ]
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PyqAnalyticsClient initialData={initialAnalyticsData} />
    </>
  )
}
