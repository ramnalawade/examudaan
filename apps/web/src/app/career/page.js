// ============================================================
// app/career/page.js — Complete Career Decision & Stream Compass
// ExamUdaan.in — Science, Commerce, Arts, Polytechnic & ITI Guides
// ============================================================

import CareerExplorerClient from './CareerExplorerClient'

export const metadata = {
  title: 'Career Options After 10th & 12th Guide 2026',
  description:
    'Comprehensive career guide for students in Maharashtra & India. Explore Science (Engineering, MBBS, BDS, BAMS, BHMS, ISRO), Commerce (CA, Investment Banking, MBA), Arts (IAS, Law, Psychology), and Polytechnic with salary, required subjects, entrance exams & top colleges.',
  alternates: { canonical: 'https://examudaan.in/career' },
  keywords: [
    'career options after 10th',
    'career options after 12th science',
    'career options after 12th commerce',
    'career options after 12th arts',
    'mbbs vs bds vs bhms vs bams',
    'engineering branches salary 2026',
    'how to become a chartered accountant',
    'polytechnic diploma direct second year engineering',
    'upsc civil services preparation after 12th',
    'highest paying careers in india'
  ],
  openGraph: {
    title: 'Career Options After 10th & 12th Guide 2026 | ExamUdaan',
    description:
      'In-depth guide for Science, Commerce, Arts & Polytechnic. Realistic salaries, entrance exams, subjects to score in, future AI scope, and top colleges.',
    url: 'https://examudaan.in/career',
    type: 'website',
    siteName: 'ExamUdaan.in',
  },
}

export default function CareerPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can a Science student switch to Commerce or Arts after 12th?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. A student who completes 12th Science has universal eligibility: you can pursue CA (Chartered Accountancy), 5-Year Law (CLAT), BBA/BMS, Mass Media, or Civil Services.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is Mathematics compulsory in 11th & 12th for high-paying careers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mathematics opens doors to B.Tech Engineering, Computer Science, Commercial Pilot, Investment Banking, and Actuarial Science. However, high-paying careers without Mathematics include MBBS Doctor, Dental (BDS), 5-Year Corporate Law (CLAT), Clinical Psychology, and Civil Services (IAS/IPS).'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the advantage of Polytechnic Diploma over 11th & 12th Science?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Polytechnic Diploma allows a student to enter technical engineering immediately after 10th. After completing the 3-year diploma, students receive Direct Second Year (DSE) Admission into 4-year B.Tech / B.E. programs at premier colleges like COEP and VJTI, bypassing JEE Main and MHT-CET.'
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CareerExplorerClient />
    </>
  )
}
