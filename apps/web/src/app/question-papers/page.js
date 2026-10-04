// ============================================================
// app/question-papers/page.js — Official Previous Year Question Papers Directory
// ExamUdaan | Sourced directly from MPSC, Police Bharti, Talathi, UPSC, SSC, RRB & IBPS
// Design: Warm Ivory (#FFFBF5), Deep Saffron (#EA580C), Outfit & Inter typography
// ============================================================

import Link from 'next/link'
import { SYLLABUS_EXAMS } from '@/lib/syllabusData'
import mpscLocalPapers from '@/lib/mpscLocalPapers.json'
import mpscPairedExams from '@/lib/mpscPairedExams.json'

export const metadata = {
  title: 'Official Previous Year Question Papers (PYQ) & Answer Keys — 2018 to 2024 | ExamUdaan',
  description: 'View official Maharashtra & Central Government previous year question papers with answer keys for MPSC, Police Bharti, Talathi, ZP, UPSC, SSC, and RRB. Read in-browser — 100% direct official sources.',
  alternates: {
    canonical: 'https://examudaan.in/question-papers',
  },
  openGraph: {
    title: 'Official Previous Year Question Papers (PYQ) with Answer Keys | ExamUdaan',
    description: 'View official question papers and answer keys for MPSC, Police Bharti, Talathi, and Central exams — right in your browser.',
    url: 'https://examudaan.in/question-papers',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

const EXAM_GROUPS = [
  {
    id: 'mpsc',
    title: 'MPSC & Maharashtra State Services',
    titleMr: 'एमपीएससी व राज्यसेवा मागील प्रश्नपत्रिका',
    badge: 'MPSC',
    color: '#EA580C',
    exams: [
      { name: 'MPSC State Services (Rajyaseva)', slug: 'mpsc-state-services', count: '6 Years Papers', pyqSubject: 'polity' },
      { name: 'MPSC Group B & C Combined Prelims', slug: 'mpsc-combined', count: '5 Years Papers', pyqSubject: 'history' },
      { name: 'MPSC PSI / STI / ASO Special Cadre', slug: 'mpsc-psi-sti', count: '4 Years Papers', pyqSubject: 'law' },
    ]
  },
  {
    id: 'maharashtra-direct',
    title: 'Maharashtra Direct Recruitments (TCS / IBPS)',
    titleMr: 'महाराष्ट्र सरळसेवा भरती (पोलीस, तलाठी, झेडपी)',
    badge: 'Direct Recruitment',
    color: '#0D9488',
    exams: [
      { name: 'Maharashtra Police Constable & Driver', slug: 'maharashtra-police', count: '2019-2023 Papers', pyqSubject: 'marathi' },
      { name: 'Maharashtra Talathi Bharti (TCS Pattern)', slug: 'maharashtra-talathi', count: '2015-2023 Shift Papers', pyqSubject: 'reasoning' },
      { name: 'Maharashtra ZP Bharti (Gram Sevak / Arogya)', slug: 'maharashtra-zp', count: '2015-2020 Papers', pyqSubject: 'geography' },
    ]
  },
  {
    id: 'central-exams',
    title: 'Central Government, SSC & Railways',
    titleMr: 'केंद्रीय परीक्षा, एसएससी व रेल्वे भरती',
    badge: 'Central Govt',
    color: '#2563EB',
    exams: [
      { name: 'UPSC Civil Services Prelims (GS + CSAT)', slug: 'upsc-cse', count: '2019-2024 Papers & Keys', pyqSubject: 'polity' },
      { name: 'SSC CGL Tier 1 & Tier 2', slug: 'ssc-cgl', count: '2020-2024 Shift Papers', pyqSubject: 'reasoning' },
      { name: 'SSC CHSL 10+2 Examination', slug: 'ssc-chsl', count: '2020-2024 Shift Papers', pyqSubject: 'english' },
      { name: 'RRB NTPC (Graduate & 12th Level)', slug: 'rrb-ntpc', count: '2016-2024 CBT Papers', pyqSubject: 'science' },
      { name: 'RRB Group D (Level-1)', slug: 'rrb-group-d', count: '2014-2024 CBT Papers', pyqSubject: 'science' },
    ]
  },
  {
    id: 'banking',
    title: 'Banking & Financial Institutions',
    titleMr: 'बँकिंग व वित्तीय संस्था भरती',
    badge: 'Banking',
    color: '#7C3AED',
    exams: [
      { name: 'IBPS PO Prelims & Mains', slug: 'ibps-po', count: '2020-2024 Question Papers', pyqSubject: 'economy' },
      { name: 'IBPS Clerk (Regional Language)', slug: 'ibps-clerk', count: '2020-2024 Shift Papers', pyqSubject: 'reasoning' },
      { name: 'RBI Grade B Officer Phase 1 & 2', slug: 'rbi-grade-b', count: '2020-2024 Question Papers', pyqSubject: 'economy' },
    ]
  }
]

export default function QuestionPapersPage() {
  const siteUrl = 'https://examudaan.in'

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where can I download MPSC previous year question papers with answer keys?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ExamUdaan provides direct links to official MPSC Rajyaseva, Combined Group B & C, and PSI/STI question papers from 2019 to 2024 along with official final answer keys validated by the commission.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are Maharashtra Police Bharti and Talathi question papers based on TCS pattern?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our question paper library includes authentic TCS pattern shift questions for Talathi Bharti and official district-wise written question papers for Maharashtra Police Constable and Driver recruitment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I practice these previous year questions online interactively?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! In addition to downloading PDF question papers, you can solve over 1,100 previous year questions interactively in our PYQ Question Bank and attempt full 100-question computer-based mock tests on ExamUdaan.',
        },
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Question Papers', item: `${siteUrl}/question-papers` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div style={{ background: '#FFFBF5', minHeight: '100vh', padding: '24px 16px 80px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '14px', color: '#6B7280' }}>
            <Link href="/" style={{ color: '#EA580C', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#374151', fontWeight: 600 }}>Previous Year Question Papers</span>
          </nav>

          {/* Hero Header */}
          <header style={{
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '1px solid #FED7AA',
            borderRadius: '16px',
            padding: '36px 28px',
            marginBottom: '32px',
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.06)'
          }}>
            <div style={{ display: 'inline-block', background: '#EA580C', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              100% Direct Official Sources
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: 800, color: '#1F2937', margin: '0 0 10px 0', lineHeight: 1.25 }}>
              Previous Year Question Papers & Official Keys
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#4B5563', margin: '0 0 20px 0', maxWidth: '820px', lineHeight: 1.6 }}>
              Read official question papers and verified final answer keys from 2018 to 2024 for MPSC, Maharashtra Police Bharti, TCS Talathi, ZP, UPSC, SSC, and Railway exams — right in your browser. No sign-up, no ads.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/pyq"
                style={{
                  background: '#EA580C',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🔍</span> Interactive 1,100+ PYQ Bank
              </Link>
              <Link
                href="/mock-tests"
                style={{
                  background: '#FFFFFF',
                  color: '#1F2937',
                  border: '1px solid #D1D5DB',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>⏱️</span> CBT Mock Tests & Practical Drills
              </Link>
            </div>
          </header>

          {/* Quick Jump Question Library Subject Pills */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: '#1F2937', marginBottom: '12px' }}>
              Solve PYQs by Subject (Topic-wise Question Library)
            </h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { name: 'Polity (राज्यघटना)', slug: 'polity', count: '139 Qs' },
                { name: 'Marathi (मराठी व्याकरण)', slug: 'marathi', count: '119 Qs' },
                { name: 'History (इतिहास)', slug: 'history', count: '129 Qs' },
                { name: 'Geography (भूगोल)', slug: 'geography', count: '122 Qs' },
                { name: 'Science (विज्ञान)', slug: 'science', count: '124 Qs' },
                { name: 'Economy (अर्थव्यवस्था)', slug: 'economy', count: '132 Qs' },
                { name: 'Reasoning (बुद्धिमत्ता)', slug: 'reasoning', count: '119 Qs' },
                { name: 'Law (कायदा)', slug: 'law', count: '108 Qs' },
                { name: 'English (इंग्रजी)', slug: 'english', count: '108 Qs' },
              ].map(sub => (
                <Link
                  key={sub.slug}
                  href={`/pyq/${sub.slug}`}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{sub.name}</span>
                  <span style={{ fontSize: '11px', background: '#F3F4F6', color: '#6B7280', padding: '2px 6px', borderRadius: '4px' }}>
                    {sub.count}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Locally Hosted Clean MPSC PDFs (Phase 1) ── */}
          <section style={{
            marginBottom: '36px',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #EA580C',
            padding: '24px 26px',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #FED7AA', paddingBottom: '14px' }}>
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#C2410C', background: '#FFF7ED', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  <span>🏛️</span> महाराष्ट्र लोकसेवा आयोग अधिकृत संग्रह (mpsc.gov.in)
                </span>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>
                  MPSC मूळ प्रश्नपत्रिका व अंतिम उत्तरतालिका (2024–2026)
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#4B5563' }}>
                  थेट mpsc.gov.in कडून संकलित केलेल्या {mpscLocalPapers.length} अधिकृत PDF. ब्राउझरमध्ये वाचा किंवा थेट डाउनलोड करा.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link
                  href="/mpsc-pyq"
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    background: '#EA580C',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>🏛️</span> सर्व {mpscLocalPapers.length} MPSC पेपर्स पहा →
                </Link>
              </div>
            </div>

            {/* 1-Row Exam Table */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              marginBottom: '20px'
            }}>
              {/* Desktop Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(300px, 2.2fr) minmax(210px, 1.3fr) minmax(210px, 1.3fr) 130px',
                background: '#F8FAFC',
                borderBottom: '1px solid #E5E7EB',
                padding: '12px 18px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                <div>Examination / Advertisement</div>
                <div>Official Question Paper</div>
                <div>Official Answer Key</div>
                <div style={{ textAlign: 'center' }}>PDF Viewer</div>
              </div>

              {/* Exam Rows */}
              {mpscPairedExams.slice(0, 15).map((row, idx) => {
                const qp = row.questionPaper
                const ak = row.answerKey
                const isEven = idx % 2 === 0

                return (
                  <div
                    key={`${row.id}-${idx}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(300px, 2.2fr) minmax(210px, 1.3fr) minmax(210px, 1.3fr) 130px',
                      alignItems: 'center',
                      padding: '14px 18px',
                      borderBottom: idx === 14 ? 'none' : '1px solid #F1F5F9',
                      background: isEven ? '#FFFFFF' : '#FAFAFA',
                      gap: '14px'
                    }}
                  >
                    {/* Exam Name */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', background: row.year === 2026 ? '#EA580C' : '#475569', color: '#FFFFFF' }}>
                          {row.year}
                        </span>
                        {row.advertisementNumber && (
                          <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', background: '#F1F5F9', padding: '1px 6px', borderRadius: '4px' }}>
                            Advt {row.advertisementNumber}
                          </span>
                        )}
                        {ak && (
                          <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                            ✓ Key
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: '0 0 2px 0', lineHeight: 1.35 }}>
                        {row.title}
                      </h3>
                      {row.titleMr && row.titleMr !== row.title && (
                        <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.3 }}>
                          {row.titleMr}
                        </p>
                      )}
                    </div>

                    {/* Question Paper */}
                    <div>
                      {qp ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <Link
                            href={`/mpsc-pyq?docId=${qp.id}`}
                            style={{
                              background: '#EA580C',
                              color: '#FFFFFF',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>👁️</span> Paper
                          </Link>
                          <a
                            href={qp.localPath}
                            download
                            style={{
                              color: '#4B5563',
                              background: '#FFFFFF',
                              border: '1px solid #D1D5DB',
                              padding: '5px 7px',
                              borderRadius: '5px',
                              fontSize: '11px',
                              fontWeight: 600,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            <span>⬇️</span> {qp.sizeFormatted}
                          </a>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11.5px', color: '#9CA3AF' }}>—</span>
                      )}
                    </div>

                    {/* Answer Key */}
                    <div>
                      {ak ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <Link
                            href={`/mpsc-pyq?docId=${ak.id}`}
                            style={{
                              background: '#059669',
                              color: '#FFFFFF',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>✓</span> Key
                          </Link>
                          <a
                            href={ak.localPath}
                            download
                            style={{
                              color: '#4B5563',
                              background: '#FFFFFF',
                              border: '1px solid #D1D5DB',
                              padding: '5px 7px',
                              borderRadius: '5px',
                              fontSize: '11px',
                              fontWeight: 600,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            <span>⬇️</span> {ak.sizeFormatted}
                          </a>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#6B7280', background: '#F3F4F6', padding: '4px 8px', borderRadius: '5px' }}>
                          ⏳ Key Pending
                        </span>
                      )}
                    </div>

                    {/* Pair Compare / Direct Viewer */}
                    <div style={{ textAlign: 'center' }}>
                      <Link
                        href={`/mpsc-pyq?docId=${qp ? qp.id : ak?.id}`}
                        style={{
                          background: '#FFF7ED',
                          border: '1px solid #FFEDD5',
                          color: '#EA580C',
                          padding: '5px 9px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <span>⚡</span> Viewer
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* View All MPSC CTA Bar */}
            <div style={{ textAlign: 'center', padding: '16px', background: '#FFF7ED', borderRadius: '10px', border: '1px dashed #FDBA74', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#9A3412', fontWeight: 600 }}>
                एकूण {mpscPairedExams.length} अधिकृत MPSC परीक्षा संच (209 प्रश्नपत्रिका व उत्तरतालिका) उपलब्ध आहेत.
              </p>
              <Link
                href="/mpsc-pyq"
                style={{
                  background: '#EA580C',
                  color: '#FFFFFF',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                सर्व {mpscPairedExams.length} परीक्षा संच इन-ब्राउझर व्ह्यूअरमध्ये उघडा (Open MPSC Archive) →
              </Link>
            </div>

            {/* ── Related Content Bar — keeps users on ExamUdaan ── */}
            <div style={{
              background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
              border: '1px solid #FED7AA',
              borderRadius: '12px',
              padding: '18px 20px'
            }}>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: 700, color: '#92400E', margin: '0 0 12px 0' }}>
                📚 प्रश्नपत्रिका वाचल्यानंतर — पुढे काय करायचे?
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link href="/pyq" style={{ background: '#EA580C', color: '#FFF', padding: '8px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  🔍 1,100+ PYQ Practice Bank
                </Link>
                <Link href="/mock-tests" style={{ background: '#1D4ED8', color: '#FFF', padding: '8px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  ⏱️ Full CBT Mock Tests
                </Link>
                <Link href="/ai-tools" style={{ background: '#7C3AED', color: '#FFF', padding: '8px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  🤖 84 Free AI Study Tools
                </Link>
                <Link href="/study-planner" style={{ background: '#0D9488', color: '#FFF', padding: '8px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  📅 AI Study Planner
                </Link>
                <Link href="/score-calculator" style={{ background: '#374151', color: '#FFF', padding: '8px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  🧮 Score Calculator
                </Link>
              </div>
            </div>
          </section>

          {/* Grouped Exam Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {EXAM_GROUPS.map(group => (
              <section
                key={group.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E5E7EB',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', borderBottom: '1px solid #F3F4F6', paddingBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: group.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {group.badge}
                    </span>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 700, color: '#111827', margin: '4px 0 2px 0' }}>
                      {group.title}
                    </h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>
                      {group.titleMr}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                  {group.exams.map(exam => {
                    const syllabusData = SYLLABUS_EXAMS.find(s => s.slug === exam.slug)
                    const papers = syllabusData?.previousPapers || []

                    return (
                      <div
                        key={exam.slug}
                        style={{
                          background: '#FAFAFA',
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#EA580C', background: '#FFF7ED', padding: '2px 8px', borderRadius: '6px' }}>
                              {exam.count}
                            </span>
                            <span style={{ fontSize: '12px', color: '#6B7280' }}>
                              {papers.length} Official Sets
                            </span>
                          </div>
                          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '17px', fontWeight: 700, color: '#1F2937', margin: '0 0 10px 0' }}>
                            {exam.name}
                          </h3>

                          {/* Top 3 Paper Samples */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                            {papers.slice(0, 3).map((p, idx) => (
                              <div
                                key={idx}
                                style={{
                                  fontSize: '12px',
                                  color: '#4B5563',
                                  background: '#FFFFFF',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #EEEEEE',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <span style={{ fontWeight: 600, color: '#111827' }}>{p.year} {p.exam}</span>
                                {p.paperUrl && (
                                  <a
                                    href={p.paperUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600, fontSize: '11px' }}
                                  >
                                    Official PDF ↗
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #E5E7EB' }}>
                          <Link
                            href={`/syllabus/${exam.slug}`}
                            style={{
                              flex: 1,
                              textAlign: 'center',
                              background: '#FFFFFF',
                              border: '1px solid #D1D5DB',
                              color: '#374151',
                              fontSize: '12px',
                              fontWeight: 600,
                              padding: '8px',
                              borderRadius: '8px',
                              textDecoration: 'none'
                            }}
                          >
                            All Papers & Keys ➔
                          </Link>
                          <Link
                            href={`/pyq/${exam.pyqSubject}`}
                            style={{
                              flex: 1,
                              textAlign: 'center',
                              background: '#EA580C',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              fontWeight: 600,
                              padding: '8px',
                              borderRadius: '8px',
                              textDecoration: 'none'
                            }}
                          >
                            Solve Online PYQs ➔
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* FAQ Section */}
          <section style={{ marginTop: '48px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '32px' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1F2937', marginBottom: '20px' }}>
              Frequently Asked Questions (FAQ)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '14px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 6px 0' }}>
                  Are these previous year question papers official or unofficial copies?
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: 1.5 }}>
                  All PDF links on ExamUdaan point directly to official government portals (e.g. mpsc.gov.in, mahabhumi.gov.in, upsc.gov.in, ssc.gov.in). We never host modified or watermarked unofficial PDFs.
                </p>
              </div>
              <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '14px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 6px 0' }}>
                  How do previous year papers help in TCS / IBPS pattern exams?
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: 1.5 }}>
                  TCS and IBPS frequently repeat question structures in Marathi Grammar, General Science, and Reasoning. Solving 2019-2023 shift papers gives you accurate timing, difficulty assessment, and section weightage.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 6px 0' }}>
                  Where can I take authentic CBT practical tests for these exams?
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: 1.5 }}>
                  You can attempt full 100-question timed simulations in our <Link href="/mock-tests" style={{ color: '#EA580C', fontWeight: 600 }}>CBT Mock Test Simulator</Link>, complete with positive/negative marking, timer countdown, and detailed explanations.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
