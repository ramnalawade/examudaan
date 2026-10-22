// ============================================================
// app/bmc-recruitment-2026/page.js — BMC / MCGM Recruitment 2026 Hub
// Target Query: "bmc recruitment 2026" (5,400/mo, KD 0, 765 impressions, avg position 5.2)
// ExamUdaan | Official Brihanmumbai Municipal Corporation Notification & Apply Link
// ============================================================

import React from 'react'
import Link from 'next/link'
import styles from './bmcRecruitment.module.css'

export const metadata = {
  title: {
    absolute: 'BMC Recruitment 2026 (MCGM) — Notification, Vacancies & Apply Online | ExamUdaan',
  },
  description: 'Brihanmumbai Municipal Corporation (BMC / MCGM) Recruitment 2026: Executive Assistant, Sub Engineer, Clerk & Medical Officer notification, dates & apply link.',
  keywords: [
    'bmc recruitment 2026', 'mcgm recruitment 2026',
    'bmc executive assistant recruitment', 'bmc sub engineer recruitment',
    'bmc clerk bharti 2026', 'portal.mcgm.gov.in recruitment',
    'bmc notification 2026', 'mumbai municipal corporation jobs'
  ],
  alternates: {
    canonical: 'https://examudaan.in/bmc-recruitment-2026',
  },
  openGraph: {
    title: 'BMC Recruitment 2026 (MCGM) — Notification, Vacancies & Apply Online | ExamUdaan',
    description: 'Brihanmumbai Municipal Corporation (BMC / MCGM) Recruitment 2026: Executive Assistant, Sub Engineer, Clerk & Medical Officer notification, dates & apply link.',
    url: 'https://examudaan.in/bmc-recruitment-2026',
    siteName: 'ExamUdaan.in',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'BMC Recruitment 2026 (MCGM) | ExamUdaan',
    description: 'Latest Brihanmumbai Municipal Corporation (BMC) recruitment notifications, vacancies, and official online application links.',
  },
}

export default function BmcRecruitment2026Page() {
  const currentDate = 'October 22, 2026'

  const bmcCadres = [
    {
      role: 'Executive Assistant (Clerk)',
      roleMr: 'कार्यकारी सहाय्यक (लिपिक)',
      qual: 'Any Degree + Marathi / English Typing',
      age: '18 to 38 Years',
      pay: 'Level M-13 (₹25,500 – ₹81,100)',
      selection: 'Online CBT (200 Marks)',
    },
    {
      role: 'Sub Engineer (Civil / Mech / Elec)',
      roleMr: 'उपअभियंता (स्थापत्य / यांत्रिकी / विद्युत)',
      qual: 'Degree / Diploma in Engineering',
      age: '18 to 38 Years',
      pay: 'Level M-15 (₹41,800 – ₹1,32,300)',
      selection: 'Online CBT + Document Verification',
    },
    {
      role: 'Junior Stenographer',
      roleMr: 'लघुलेखक (निम्नश्रेणी / उच्चश्रेणी)',
      qual: '10th / 12th + Steno 80/100 wpm',
      age: '18 to 38 Years',
      pay: 'Level M-14 (₹35,400 – ₹1,12,400)',
      selection: 'Shorthand Skill Test + CBT',
    },
    {
      role: 'Staff Nurse & Paramedical',
      roleMr: 'परिचारिका व आरोग्य कर्मचारी',
      qual: 'GNM / B.Sc Nursing / DMLT',
      age: '18 to 38 Years',
      pay: 'Level M-14 (₹35,400 – ₹1,12,400)',
      selection: 'Written Test + Merit List',
    },
    {
      role: 'Junior Overseer / Building Mukadam',
      roleMr: 'कनिष्ठ पर्यवेक्षक / मुकादम',
      qual: '10th / ITI Pass + Experience',
      age: '18 to 40 Years',
      pay: 'Level M-10 (₹19,900 – ₹63,200)',
      selection: 'Physical / Skill Test + CBT',
    },
    {
      role: 'Medical Officer (MBBS / Specialist)',
      roleMr: 'वैद्यकीय अधिकारी (नागरी आरोग्य केंद्र)',
      qual: 'MBBS / MD from recognized institute',
      age: 'Up to 45 Years',
      pay: 'Level M-20 (₹56,100 – ₹1,77,500)',
      selection: 'Interview + Experience Merit',
    },
  ]

  const bmcSteps = [
    { step: 1, title: 'Visit Portal', desc: 'Visit official MCGM portal (portal.mcgm.gov.in) and navigate to "Careers / Recruitment" tab.' },
    { step: 2, title: 'Read Notice', desc: 'Download official PDF notification for your specific department and verify eligibility & reservation.' },
    { step: 3, title: 'Fill Form', desc: 'Register with basic bio-data, educational records, typing certifications, and upload required documents.' },
    { step: 4, title: 'Submit & Pay', desc: 'Submit application fee via online payment gateway and download confirmation acknowledgment.' },
  ]

  const faqList = [
    {
      q: 'What is the official website for BMC (MCGM) Recruitment 2026?',
      a: 'The official website for all Brihanmumbai Municipal Corporation recruitment advertisements and online application links is https://portal.mcgm.gov.in under the Careers section.',
    },
    {
      q: 'Is knowledge of Marathi compulsory for BMC jobs in Mumbai?',
      a: 'Yes, candidates applying for Group B and Group C posts in BMC must have passed the 10th (SSC) examination with Marathi as a subject or possess equivalent state language qualification.',
    },
    {
      q: 'What is the salary of a BMC Executive Assistant (Clerk)?',
      a: 'A BMC Executive Assistant receives salary under 7th Pay Commission Level M-13 (Basic Pay ₹25,500 to ₹81,100), with in-hand monthly salary approximately ₹38,000 to ₹44,000 including Mumbai HRA and DA.',
    },
    {
      q: 'What is the exam pattern for BMC Executive Assistant and Clerk posts?',
      a: 'The exam is conducted in Computer-Based Test (CBT) format comprising 100 questions for 200 marks covering Marathi (50 marks), English (50 marks), General Knowledge (50 marks), and Mental Ability / Reasoning (50 marks).',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'BMC Recruitment 2026 (MCGM): Notification, Vacancies, Eligibility & Apply Online',
    datePublished: '2026-10-22T00:00:00+05:30',
    dateModified: '2026-10-22T00:00:00+05:30',
    description: 'Comprehensive guide to Brihanmumbai Municipal Corporation (BMC) recruitment notifications, cadre vacancies, pay matrix, and application process.',
    publisher: {
      '@type': 'Organization',
      name: 'ExamUdaan',
      url: 'https://examudaan.in',
    },
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
            <span className={styles.pillBadgeSuccess}>Official MCGM Portal</span>
            <span className={styles.pillBadge}>Mumbai Municipal Corporation</span>
            <span className={styles.updatedDate}>
              <span className="material-symbols-outlined">schedule</span>
              Updated: {currentDate}
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            BMC Recruitment 2026 <span className={styles.heroTitleHighlight}>(MCGM Mumbai)</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Brihanmumbai Municipal Corporation (BMC / MCGM) official recruitment notifications, cadre-wise vacancies, 7th Pay Commission salary, eligibility criteria, and direct online application links on portal.mcgm.gov.in.
          </p>

          <div className={styles.actionRow}>
            <a
              href="https://portal.mcgm.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimaryPortal}
            >
              <span className="material-symbols-outlined">open_in_new</span> Go to Official BMC Portal ↗
            </a>
            <Link href="/salary-calculator" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">calculate</span> 7th CPC Salary Calculator
            </Link>
            <Link href="/jobs" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">work</span> All Maharashtra Govt Jobs
            </Link>
            <Link href="/question-papers" className={styles.btnSecondary}>
              <span className="material-symbols-outlined">menu_book</span> Question Papers & Keys
            </Link>
          </div>
        </div>
      </section>

      {/* ── Popular BMC Cadres Grid ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Key Posts</span>
            <h2 className={styles.sectionTitle}>Popular BMC Cadres & Eligibility Overview</h2>
            <p className={styles.sectionDesc}>
              Detailed breakdown of recurring municipal corporation vacancies in Mumbai.
            </p>
          </div>

          <div className={styles.cadresGrid}>
            {bmcCadres.map((c, idx) => (
              <div key={idx} className={styles.cadreCard}>
                <h3 className={styles.cadreRole}>{c.role}</h3>
                <div className={styles.cadreRoleMr}>{c.roleMr}</div>
                <div className={styles.cadreDetailRow}>
                  <span>Qualification:</span>
                  <span className={styles.cadreVal}>{c.qual}</span>
                </div>
                <div className={styles.cadreDetailRow}>
                  <span>Age Limit:</span>
                  <span className={styles.cadreVal}>{c.age}</span>
                </div>
                <div className={styles.cadreDetailRow}>
                  <span>Pay Scale:</span>
                  <span className={styles.cadreVal}>{c.pay}</span>
                </div>
                <div className={styles.cadreDetailRow}>
                  <span>Selection:</span>
                  <span className={styles.cadreVal}>{c.selection}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Apply Steps ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Application Process</span>
            <h2 className={styles.sectionTitle}>How to Apply Online for BMC (MCGM) Recruitment</h2>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableResponsive}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Process Stage</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {bmcSteps.map(s => (
                    <tr key={s.step}>
                      <td><strong>Step {s.step}</strong></td>
                      <td><span className={styles.badgePay}>{s.title}</span></td>
                      <td>{s.desc}</td>
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
            <h2 className={styles.sectionTitle}>Frequently Asked Questions (BMC भरती FAQ)</h2>
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
