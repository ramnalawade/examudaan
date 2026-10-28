// ============================================================
// app/talathi-bharti-apply-online/page.js — Talathi Bharti 2026 Apply Online Guide
// Target Query: "talathi bharti 2026 apply online" (14,800 monthly searches, KD 0)
// ExamUdaan | Official Mahabhumi TCS Portal Link, Steps, Document Specs & Fees
// ============================================================

import React from 'react'
import Link from 'next/link'
import styles from './applyOnline.module.css'

export const metadata = {
  title: {
    absolute: 'Talathi Bharti 2026 Apply Online — Registration Link & Steps | ExamUdaan',
  },
  description: 'Maharashtra Talathi Bharti 2026 online application: Mahabhumi TCS portal direct link, registration process, document upload checklist & fee details.',
  keywords: [
    'talathi bharti 2026 apply online', 'talathi apply online',
    'mahabhumi talathi registration', 'talathi application form 2026',
    'talathi eligibility', 'talathi bharti fees', 'tcs talathi apply link'
  ],
  alternates: {
    canonical: 'https://examudaan.in/talathi-bharti-apply-online',
  },
  openGraph: {
    title: 'Talathi Bharti 2026 Apply Online — Registration Link & Steps | ExamUdaan',
    description: 'Maharashtra Talathi Bharti 2026 online application: Mahabhumi TCS portal direct link, registration process, document upload checklist & fee details.',
    url: 'https://examudaan.in/talathi-bharti-apply-online',
    siteName: 'ExamUdaan.in',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Talathi Bharti 2026 Apply Online | ExamUdaan',
    description: 'Step-by-step registration guide for Maharashtra Talathi Bharti 2026 on Mahabhumi TCS portal.',
  },
}

export default function TalathiBhartiApplyOnlinePage() {
  const currentDate = 'October 22, 2026'

  const applicationSteps = [
    {
      step: 1,
      title: 'Portal One-Time Registration (OTR)',
      desc: 'Visit mahabhumi.gov.in. Create an applicant profile using your Active Mobile Number, Email ID, and Aadhaar verification. Complete OTP authentication.',
    },
    {
      step: 2,
      title: 'Select Revenue District & Cadre',
      desc: 'Choose your desired Revenue District (महसूल जिल्हा). Note: As per Maharashtra Revenue rules, an applicant can apply to only ONE district cadre.',
    },
    {
      step: 3,
      title: 'Fill Educational & Personal Details',
      desc: 'Enter 10th, 12th, and Bachelor Degree marks, percentage, and passing year. Verify Marathi language fluency and MS-CIT computer certification status.',
    },
    {
      step: 4,
      title: 'Upload Scanned Documents & Photos',
      desc: 'Upload recent color passport photograph (20–50 KB), signature (10–20 KB), and original certificates in PDF format (up to 2 MB each).',
    },
    {
      step: 5,
      title: 'Pay Application Fee & Print Receipt',
      desc: 'Pay the non-refundable examination fee online via UPI, Net Banking, or Debit/Credit card. Download the final confirmation application slip for future reference.',
    },
  ]

  const docSpecs = [
    { doc: 'Passport Size Photograph', format: 'JPG / JPEG', size: '20 KB to 50 KB', notes: 'White background, clicked within last 3 months' },
    { doc: 'Applicant Signature', format: 'JPG / JPEG', size: '10 KB to 20 KB', notes: 'Clear black ink on plain white paper' },
    { doc: 'Degree Passing Certificate', format: 'PDF', size: 'Up to 2 MB', notes: 'Bachelor degree from recognized university' },
    { doc: 'Maharashtra Domicile Certificate', format: 'PDF', size: 'Up to 2 MB', notes: 'Mandatory proof of state residency' },
    { doc: 'Caste & Non-Creamy Layer (NCL)', format: 'PDF', size: 'Up to 2 MB', notes: 'Valid for current financial year (if applicable)' },
    { doc: 'Photo Identity Card (Aadhaar / PAN)', format: 'PDF', size: 'Up to 2 MB', notes: 'Self-attested copy of original identity proof' },
  ]

  const feeStructure = [
    { cat: 'Open / General Category (खुला प्रवर्ग)', fee: '₹1,000 /-', mode: 'Online (Net Banking / UPI / Cards)' },
    { cat: 'Backward Classes (OBC, SC, ST, EWS, SEBC, VJNT)', fee: '₹900 /-', mode: 'Online (Net Banking / UPI / Cards)' },
    { cat: 'Ex-Servicemen (माजी सैनिक)', fee: '₹0 (Exempted)', mode: 'No Fee' },
  ]

  const faqList = [
    {
      q: 'Can a candidate apply for Talathi Bharti in multiple districts?',
      a: 'No. As per the official notification of the Revenue and Forest Department, a candidate can submit an application for only ONE district cadre across Maharashtra.',
    },
    {
      q: 'Is MS-CIT mandatory at the time of online application?',
      a: 'No. Candidates who do not have an MS-CIT or equivalent computer certificate at the time of application are eligible to apply, provided they submit the certificate within two years of appointment.',
    },
    {
      q: 'What is the official website for Talathi Bharti 2026 registration?',
      a: 'The official portal is https://mahabhumi.gov.in hosted jointly by Maharashtra State Revenue Department and TCS (Tata Consultancy Services).',
    },
    {
      q: 'What is the educational qualification required for Talathi Bharti?',
      a: 'Candidates must possess a Bachelor Degree (Graduation) in any faculty from a recognized statutory university. Fluency in Marathi speaking, reading, and writing is mandatory.',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Apply Online for Maharashtra Talathi Bharti 2026',
    description: 'Step-by-step instructions for submitting Maharashtra Talathi recruitment application on the Mahabhumi TCS portal.',
    step: applicationSteps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.title,
      text: s.desc,
    })),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <main className={styles.pageWrapper}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.badgeRow}>
            <span className={styles.pillBadge}>Mahabhumi TCS Portal</span>
            <span className={styles.pillBadgeOrange}>Step-by-Step Guide</span>
            <span className={styles.updatedDate}>
              <span className="material-symbols-outlined">schedule</span>
              Updated: {currentDate}
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            Maharashtra Talathi Bharti <span className={styles.heroTitleHighlight}>Apply Online 2026</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Complete step-by-step registration procedure for Maharashtra Talathi Bharti on the official Mahabhumi TCS portal. Direct registration link, document upload specifications, district selection rules, and fee structure.
          </p>

          <div className={styles.actionRow}>
            <a
              href="https://mahabhumi.gov.in"
              target="_blank" rel="noopener noreferrer"
              rel="noopener noreferrer"
              className={styles.btnPrimaryPortal}
            >
              <span className="material-symbols-outlined">open_in_new</span> Go to Mahabhumi Portal ↗
            </a>
            <Link href="/talathi-question-papers" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">quiz</span> Talathi Question Papers
            </Link>
            <Link href="/talathi-bharti-2026" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">campaign</span> Talathi Bharti 2026 Hub
            </Link>
            <Link href="/syllabus/maharashtra-talathi" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">menu_book</span> Official Syllabus
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5-Step Application Flow ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Online Registration</span>
            <h2 className={styles.sectionTitle}>5-Step Application Process on Mahabhumi Portal</h2>
            <p className={styles.sectionDesc}>
              Follow this verified sequential walkthrough to complete your Talathi application without errors.
            </p>
          </div>

          <div className={styles.flowList}>
            {applicationSteps.map(st => (
              <div key={st.step} className={styles.flowItem}>
                <div className={styles.flowNumber}>{st.step}</div>
                <div className={styles.flowContent}>
                  <h3 className={styles.flowTitle}>{st.title}</h3>
                  <p className={styles.flowText}>{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Document Specifications Table ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Document Checklist</span>
            <h2 className={styles.sectionTitle}>Mandatory Document Upload Specifications</h2>
            <p className={styles.sectionDesc}>
              Ensure all scanned certificates and images strictly conform to file type and dimension limits.
            </p>
          </div>

          <div className={styles.specTableCard}>
            <div className={styles.tableResponsive}>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Allowed Format</th>
                    <th>File Size Limit</th>
                    <th>Official Requirements</th>
                  </tr>
                </thead>
                <tbody>
                  {docSpecs.map((d, i) => (
                    <tr key={i}>
                      <td><strong>{d.doc}</strong></td>
                      <td>{d.format}</td>
                      <td><span className={styles.badgeFee}>{d.size}</span></td>
                      <td>{d.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fee Structure Table ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Examination Fees</span>
            <h2 className={styles.sectionTitle}>Category-wise Application Fee Structure</h2>
          </div>

          <div className={styles.specTableCard}>
            <div className={styles.tableResponsive}>
              <table className={styles.specTable}>
                <thead>
                  <tr>
                    <th>Candidate Category</th>
                    <th>Examination Fee</th>
                    <th>Payment Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructure.map((f, i) => (
                    <tr key={i}>
                      <td><strong>{f.cat}</strong></td>
                      <td><span className={styles.badgeFee}>{f.fee}</span></td>
                      <td>{f.mode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>FAQ</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions (तलाठी भरती अर्ज FAQ)</h2>
          </div>

          <div className={styles.faqGrid}>
            {faqList.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
