// ============================================================
// app/pyq/[subject]/page.js — Subject Question Library Page (SSG)
// ExamUdaan | Sourced from 1,100 authentic PYQ questions
// High-intent SEO for MPSC, Police Bharti, Talathi, ZP, and SSC
// ============================================================

import { notFound } from 'next/navigation'
import Link from 'next/link'
import pyqSeedData from '@/lib/pyqSeed.json'
import PyqSubjectClient from './PyqSubjectClient'

// All 9 supported subjects
export const SUBJECT_METADATA = {
  polity: {
    slug: 'polity',
    dbSubject: 'Polity',
    name: 'Indian Polity & Constitution',
    nameMr: 'भारतीय राज्यघटना व पंचायतराज',
    description: '139+ solved Indian Polity and Constitution previous year questions (PYQ) for MPSC Rajyaseva, Combined Group B & C, and Talathi Bharti with detailed explanations.',
    count: 139,
  },
  history: {
    slug: 'history',
    dbSubject: 'History',
    name: 'History of Modern India & Maharashtra',
    nameMr: 'आधुनिक भारताचा व महाराष्ट्राचा इतिहास',
    description: '129+ solved History questions covering 1857 revolt, social reformers of Maharashtra, and freedom movement for MPSC and state competitive exams.',
    count: 129,
  },
  geography: {
    slug: 'geography',
    dbSubject: 'Geography',
    name: 'Geography of Maharashtra & India',
    nameMr: 'महाराष्ट्र व भारताचा भूगोल',
    description: '122+ solved Geography PYQs on Maharashtra rivers, dams, national parks, districts, soil, and climate with explanations.',
    count: 122,
  },
  economy: {
    slug: 'economy',
    dbSubject: 'Economy',
    name: 'Indian Economy & Banking',
    nameMr: 'भारतीय अर्थव्यवस्था व बँकिंग',
    description: '132+ solved Indian Economy questions on RBI, Five Year Plans, monetary policy, budget, and inflation for MPSC, Banking, and SSC.',
    count: 132,
  },
  science: {
    slug: 'science',
    dbSubject: 'Science',
    name: 'General Science (Physics, Chemistry, Biology)',
    nameMr: 'सामान्य विज्ञान (भौतिकशास्त्र, रसायनशास्त्र, जीवशास्त्र)',
    description: '124+ solved General Science questions covering human anatomy, diseases, physics laws, and environmental science for government exams.',
    count: 124,
  },
  marathi: {
    slug: 'marathi',
    dbSubject: 'Marathi',
    name: 'Marathi Grammar & Vocabulary (मराठी व्याकरण)',
    nameMr: 'मराठी व्याकरण व शब्दसंग्रह (TCS / MPSC Pattern)',
    description: '119+ solved Marathi grammar and vocabulary questions (संधी, समास, प्रयोग, अलंकार, म्हणी) for Talathi, Police Bharti, and MPSC Combined.',
    count: 119,
  },
  english: {
    slug: 'english',
    dbSubject: 'English',
    name: 'English Grammar & Vocabulary',
    nameMr: 'इंग्रजी व्याकरण व व्होकॅब्युलरी',
    description: '108+ solved English Grammar and Vocabulary questions (tenses, idioms, prepositions, voice) for MPSC, SSC, and Banking exams.',
    count: 108,
  },
  reasoning: {
    slug: 'reasoning',
    dbSubject: 'Reasoning',
    name: 'Logical Reasoning & Quantitative Aptitude',
    nameMr: 'अंकगणित व बुद्धिमत्ता चाचणी',
    description: '119+ solved Logical Reasoning and Quantitative Aptitude questions with step-by-step shortcuts and solutions for competitive exams.',
    count: 119,
  },
  law: {
    slug: 'law',
    dbSubject: 'Law',
    name: 'Law & Human Rights (MPSC PSI Minor Acts)',
    nameMr: 'कायदा व मानवाधिकार (IPC, CrPC, पुरावा कायदा, RTI)',
    description: '108+ solved Law questions on IPC, CrPC, Indian Evidence Act, RTI Act 2005, and Maharashtra Public Records Act for MPSC PSI Mains.',
    count: 108,
  },
}

export async function generateStaticParams() {
  return Object.keys(SUBJECT_METADATA).map(subject => ({ subject }))
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const info = SUBJECT_METADATA[resolvedParams.subject]
  if (!info) return {}

  const title = `${info.name} PYQ Questions`
  const canonicalUrl = `https://examudaan.in/pyq/${info.slug}`

  return {
    title,
    description: info.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: info.description,
      url: canonicalUrl,
      siteName: 'ExamUdaan.in',
      type: 'article',
    },
  }
}

export default async function SubjectPyqPage({ params }) {
  const resolvedParams = await params
  const info = SUBJECT_METADATA[resolvedParams.subject]
  if (!info) notFound()

  // Filter seed questions for this subject
  const subjectQuestions = pyqSeedData.filter(
    q => q.subject?.toLowerCase() === info.dbSubject.toLowerCase()
  )

  const siteUrl = 'https://examudaan.in'
  const pageUrl = `${siteUrl}/pyq/${info.slug}`

  // Quiz / QAPage JSON-LD Schema (top 15 questions embedded for Google Rich Snippets)
  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `${info.name} PYQ Question Bank`,
    description: info.description,
    about: {
      '@type': 'Thing',
      name: info.name,
    },
    hasPart: subjectQuestions.slice(0, 15).map(q => ({
      '@type': 'Question',
      name: q.question,
      text: q.question,
      suggestedAnswer: Object.entries(q.options || {}).map(([key, text]) => ({
        '@type': 'Answer',
        text: `${key}: ${text}`,
      })),
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${q.correct}: ${q.options?.[q.correct] || ''}. ${q.explanation || ''}`,
      },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'PYQ Question Bank', item: `${siteUrl}/pyq` },
      { '@type': 'ListItem', position: 3, name: info.name, item: pageUrl },
    ],
  }

  const allSubjects = Object.values(SUBJECT_METADATA)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div style={{ background: '#FFFBF5', minHeight: '100vh', padding: '24px 16px 80px' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '14px', color: '#6B7280' }}>
            <Link href="/" style={{ color: '#EA580C', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link href="/pyq" style={{ color: '#EA580C', textDecoration: 'none', fontWeight: 500 }}>PYQ Bank</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#374151', fontWeight: 600 }}>{info.name}</span>
          </nav>

          {/* Hero Header */}
          <header style={{
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '1px solid #FED7AA',
            borderRadius: '16px',
            padding: '32px 28px',
            marginBottom: '28px',
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.05)'
          }}>
            <div style={{ display: 'inline-block', background: '#EA580C', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              Question Library — {subjectQuestions.length} Solved Questions
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '30px', fontWeight: 800, color: '#1F2937', margin: '0 0 6px 0', lineHeight: 1.25 }}>
              {info.name}
            </h1>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 600, color: '#C2410C', margin: '0 0 10px 0' }}>
              {info.nameMr}
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#4B5563', margin: '0 0 18px 0', lineHeight: 1.6, maxWidth: '780px' }}>
              {info.description}
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link
                href="/question-papers"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  color: '#374151',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                📄 Download Official PDF Papers
              </Link>
              <Link
                href="/mock-tests"
                style={{
                  background: '#EA580C',
                  color: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                ⏱️ Attempt CBT Mock Test
              </Link>
            </div>
          </header>

          {/* Interactive Client View */}
          <PyqSubjectClient
            subjectInfo={info}
            questions={subjectQuestions}
            allSubjects={allSubjects}
          />

        </div>
      </div>
    </>
  )
}
