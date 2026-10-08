// ============================================================
// app/disclaimer/page.js — Disclaimer & Government Non-Affiliation
// Clear disclosure regarding non-affiliation, external PDF gazettes & data accuracy
// ============================================================

import Link from 'next/link'
import { SITE_CONFIG } from '../../lib/constants'

export const metadata = {
  title: 'Disclaimer \u2014 Non-Affiliation Policy | ExamUdaan',
  description: 'ExamUdaan.in is an independent recruitment aggregation platform and is NOT affiliated with any central or state government organization or recruiting commission.',
  keywords: ['ExamUdaan disclaimer', 'non-affiliation', 'independent exam portal', 'not government website'],
  alternates: {
    canonical: 'https://examudaan.in/disclaimer',
  },
  openGraph: {
    title: 'Disclaimer \u2014 Non-Affiliation Policy | ExamUdaan',
    description: 'ExamUdaan.in is independent and NOT affiliated with any government organization.',
    url: 'https://examudaan.in/disclaimer',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: { card: 'summary', title: 'Disclaimer | ExamUdaan' },
}


export default function DisclaimerPage() {
  const points = [
    {
      title: 'Independent Information Aggregator',
      text: 'ExamUdaan.in is an independent, privately managed informational portal. We do not represent, nor are we associated with, endorsed by, or operating on behalf of the Government of India, Government of Maharashtra, or any public recruitment agency (including but not limited to MPSC, UPSC, SSC, IBPS, BMC, Railway Recruitment Boards, or Police Commissionerates).',
    },
    {
      title: 'Public Domain Sourcing',
      text: 'All recruitment notices, exam schedules, admit card links, answer keys, and result summaries published on ExamUdaan.in are sourced from publicly available official gazettes, department portals, and newspaper advertisements. We do not create official notifications or formulate recruitment criteria.',
    },
    {
      title: 'Official Notification Supersedes All Summaries',
      text: 'While ExamUdaan strives to maintain the highest standard of accuracy through automated scrapers and artificial intelligence summarization, human or system errors may occur. In any instance of ambiguity, difference, or dispute regarding age limits, educational qualifications, application fees, or important dates, the official PDF released by the respective recruiting authority shall be considered the sole authentic and legally binding document.',
    },
    {
      title: 'No Guarantee of Selection or Direct Application Processing',
      text: 'ExamUdaan.in does not issue admit cards, accept official job applications, or process government employment examinations. We solely direct aspirants to official government registration portals (such as mahampsc.mahaonline.gov.in, mahapolice.gov.in, ssc.gov.in, etc.). We do not collect government examination fees or guarantee selection or appointment.',
    },
    {
      title: 'AI-Generated Content & Mandatory Candidate Due Diligence (* Conditions)',
      text: 'Portions of this platform — including job summaries, eligibility criteria classifications, career roadmaps, salary projections, current affairs exam relevance notes, and mock interview questions — utilize artificial intelligence and automated document parsing. Candidates must strictly observe the following conditions:\n\n* Condition 1 (Informational Purpose Only): AI-generated content is provided solely for academic guidance, rapid notification discovery, and study reference.\n* Condition 2 (Mandatory Independent Due Diligence): Candidates must exercise their own due diligence by opening and reading the official government notification PDF and verifying all qualification criteria, age relaxations, reservation categories, and deadlines before submitting applications or paying exam fees.\n* Condition 3 (No Liability for Corrigenda/Variances): ExamUdaan assumes no liability for automated classification edge-cases or subsequent corrigenda/addenda issued by recruiting commissions.',
    },
    {
      title: 'External Third-Party Links',
      text: 'Our portal contains hyperlinks to third-party government websites. We have no control over the content, uptime, availability, or privacy policies of those external servers. Clicking on external links is done at the user\'s own discretion.',
    },
  ]

  const majorPortals = [
    { name: 'Maharashtra Public Service Commission (MPSC)', url: 'https://mpsc.gov.in' },
    { name: 'Maharashtra Police Recruitment (MahaPolice)', url: 'https://www.mahapolice.gov.in' },
    { name: 'Brihanmumbai Municipal Corporation (BMC)', url: 'https://www.mcgm.gov.in' },
    { name: 'Staff Selection Commission (SSC)', url: 'https://ssc.gov.in' },
    { name: 'Union Public Service Commission (UPSC)', url: 'https://upsc.gov.in' },
    { name: 'Railway Recruitment Control Board (RRB)', url: 'https://indianrailways.gov.in' },
    { name: 'Institute of Banking Personnel Selection (IBPS)', url: 'https://www.ibps.in' },
  ]

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 64 }}>
      {/* Breadcrumb Header */}
      <div style={{ borderBottom: '1px solid var(--outline-variant)', background: 'var(--surface-container-lowest)', padding: '16px 0' }}>
        <div className="container" style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--secondary)' }}>
            <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Disclaimer</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 960, margin: '0 auto', padding: '40px 20px 0' }}>
        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--primary-fixed)',
            color: 'var(--on-primary-fixed)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 12,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>report</span>
            Important Notice
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: 'var(--on-surface)', marginBottom: 8 }}>
            Disclaimer & Non-Affiliation Notice
          </h1>
          <p style={{ fontSize: 14, color: 'var(--secondary)' }}>
            ExamUdaan.in is an independent platform. Please review this declaration carefully.
          </p>
        </div>

        {/* Big Alert Banner */}
        <div style={{
          background: 'var(--surface-container-low)',
          border: '2px solid var(--primary-cta)',
          borderRadius: 'var(--radius-md)',
          padding: '24px 28px',
          marginBottom: 36,
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--primary-cta)', flexShrink: 0 }}>
            gavel
          </span>
          <div style={{ fontSize: 15, color: 'var(--on-surface)', lineHeight: 1.7 }}>
            <strong>Declaration of Non-Government Status:</strong> ExamUdaan.in is NOT an official website of the Government of India or the Government of Maharashtra. We are an educational aggregator providing curated summaries and alerts for public job notifications. We do not process official applications or collect exam fees on behalf of any recruiting body.
          </div>
        </div>

        {/* Detailed Points */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}>
          {points.map((p, idx) => (
            <div
              key={idx}
              id={p.title.includes('AI') ? 'ai-policy' : undefined}
              style={{
                borderBottom: idx < points.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                paddingBottom: idx < points.length - 1 ? 24 : 0,
                scrollMarginTop: '100px',
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--surface-container-high)',
                  color: 'var(--primary)',
                  fontSize: 12,
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {idx + 1}
                </span>
                {p.title}
              </h2>
              <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', lineHeight: 1.7, margin: 0, paddingLeft: 34 }}>
                {p.text}
              </p>
            </div>
          ))}
        </div>

        {/* Official Portals Directory */}
        <div style={{
          marginTop: 40,
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '28px 32px',
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8 }}>
            Reference List of Official Government Recruitment Portals
          </h3>
          <p style={{ fontSize: 14, color: 'var(--secondary)', marginBottom: 20 }}>
            Candidates are encouraged to bookmark and cross-check information on the official portals listed below:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {majorPortals.map((portal, i) => (
              <a
                key={i}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--surface-container-low)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--on-surface)',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'background 0.15s',
                }}
              >
                <span>{portal.name}</span>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>
                  open_in_new
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Content Sourcing, Copyright & Takedown Policy */}
        <div style={{
          marginTop: 40,
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--primary-cta)' }}>
              shield
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>
              Content Sourcing, Copyright & Takedown Policy (IT Act Sec 79)
            </h2>
          </div>

          <div style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0 }}>
              <strong>1. Public Interest & Educational Purpose:</strong> ExamUdaan.in is a free educational information aggregator. All recruitment notifications, exam schedules, public notices, and PDF gazettes referenced on this portal are collected from publicly accessible government websites, gazettes, and official press releases for the purpose of informing aspirants in the public interest (pursuant to Section 52(1)(a) of the Indian Copyright Act, 1957 — Fair Dealing for public education and reporting).
            </p>
            <p style={{ margin: 0 }}>
              <strong>2. No Claim Over Official Marks:</strong> ExamUdaan.in does not claim any ownership, copyright, or proprietary rights over official government logos, recruiting commission trademarks, or original notification PDFs. All trademarks and gazettes belong to their respective government departments.
            </p>
            <p style={{ margin: 0 }}>
              <strong>3. Intermediary Safe Harbor:</strong> In accordance with Section 79 of the Information Technology Act, 2000 and Rule 3 of the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, ExamUdaan.in functions as an intermediary platform providing informational indexing. We do not initiate the transmission, select the receiver, or modify the underlying official gazettes.
            </p>
            <div style={{
              background: 'var(--surface-container-low)',
              border: '1px solid var(--primary-cta)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px 20px',
              marginTop: 8,
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', margin: '0 0 8px 0' }}>
                How to Request a Content Correction or Takedown
              </h3>
              <p style={{ margin: '0 0 10px 0', fontSize: 13, color: 'var(--secondary)' }}>
                If any government authority, recruitment board, university, or copyright holder believes that any content, link, or document on this portal contains errors, is published erroneously, or infringes upon any legal rights, please send a written takedown notice to our designated Grievance Desk:
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <a
                  href="mailto:grievance@examudaan.in"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'var(--primary-cta)',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: 'none',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>mail</span>
                  grievance@examudaan.in
                </a>
                <span style={{ fontSize: 13, color: 'var(--secondary)' }}>
                  (Response & Action Commitment: <strong>Within 24 to 48 business hours</strong>)
                </span>
              </div>
              <p style={{ margin: '10px 0 0 0', fontSize: 12, color: 'var(--outline)' }}>
                Please include: (a) Exact URL(s) of the affected page on ExamUdaan, (b) Description of the error or objection, and (c) Official authority/proof of representation.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Note */}
        <div style={{ textAlign: 'center', marginTop: 36, color: 'var(--secondary)', fontSize: 14 }}>
          General questions or feedback? Contact us at{' '}
          <a href={`mailto:${SITE_CONFIG.contact.email}`} style={{ color: 'var(--primary-cta)', fontWeight: 600 }}>
            {SITE_CONFIG.contact.email}
          </a>
          {' '}| For takedown requests:{' '}
          <a href={`mailto:${SITE_CONFIG.contact.grievanceEmail || 'grievance@examudaan.in'}`} style={{ color: 'var(--primary-cta)', fontWeight: 600 }}>
            {SITE_CONFIG.contact.grievanceEmail || 'grievance@examudaan.in'}
          </a>
        </div>
      </div>
    </div>
  )
}
