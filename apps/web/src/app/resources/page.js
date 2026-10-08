// ============================================================
// app/resources/page.js — ExamUdaan Resources Hub
// Simplified: links to dedicated pages + Syllabus PDF directory
// YouTube channels → /youtube | AI Tools → /ai-tools
// ============================================================

import Link from 'next/link'

export const metadata = {
  title: 'Free Study Resources \u2014 Syllabus, YouTube & AI Tools',
  description: 'Free study resources for MPSC, UPSC, Banking, SSC, Railways \u2014 syllabus PDFs, official links, YouTube channels, and AI study tools for government exam aspirants.',
  keywords: [
    'MPSC study resources', 'free exam study material', 'government exam syllabus PDF',
    'MPSC YouTube channels', 'AI tools for exam', 'free study material India',
    'SSC study resources', 'banking exam material'
  ],
  alternates: {
    canonical: 'https://examudaan.in/resources',
  },
  openGraph: {
    title: 'Free Study Resources \u2014 Syllabus, YouTube & AI Tools | ExamUdaan',
    description: 'Syllabus PDFs, YouTube channels and AI tools for MPSC, UPSC, SSC & Banking exam preparation.',
    url: 'https://examudaan.in/resources',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Free Study Resources | ExamUdaan',
    description: 'Syllabus PDFs, YouTube & AI tools for MPSC, UPSC, SSC & Banking.',
  },
}


// ── Verified Syllabus & Guide Links (No 404s) ────────────────
const SYLLABUS_LINKS = [
  { exam: 'MPSC State Services (Rajyaseva)', url: '/syllabus/mpsc-state-services', org: 'MPSC', label: 'Complete Syllabus Guide' },
  { exam: 'MPSC Group B & C Combined', url: '/syllabus/mpsc-combined', org: 'MPSC', label: 'Complete Syllabus Guide' },
  { exam: 'MPSC PSI / STI / ASO Special Cadre', url: '/syllabus/mpsc-psi-sti', org: 'MPSC', label: 'Complete Syllabus Guide' },
  { exam: 'Maharashtra Police Bharti', url: '/syllabus/maharashtra-police', org: 'MPSC', label: 'Physical & Written Guide' },
  { exam: 'Maharashtra Talathi Bharti', url: '/syllabus/maharashtra-talathi', org: 'MPSC', label: 'TCS Pattern Syllabus' },
  { exam: 'Maharashtra ZP Bharti (Gram Sevak)', url: '/syllabus/maharashtra-zp', org: 'MPSC', label: 'IBPS Pattern Syllabus' },
  { exam: 'UPSC CSE (Civil Services)', url: '/syllabus/upsc-cse', org: 'UPSC', label: 'Complete Prelims & Mains' },
  { exam: 'SSC CGL 2026', url: '/syllabus/ssc-cgl', org: 'SSC', label: 'Tier 1 & Tier 2 Guide' },
  { exam: 'SSC CHSL 2026', url: '/syllabus/ssc-chsl', org: 'SSC', label: '10+2 Complete Syllabus' },
  { exam: 'IBPS PO Syllabus', url: '/syllabus/ibps-po', org: 'IBPS', label: 'Prelims & Mains Guide' },
  { exam: 'IBPS Clerk Syllabus', url: '/syllabus/ibps-clerk', org: 'IBPS', label: 'State Language Guide' },
  { exam: 'RRB NTPC 2026 (CBT-1 & CBT-2)', url: '/syllabus/rrb-ntpc', org: 'RRB', label: 'Railway NTPC Syllabus' },
  { exam: 'RRB Group D Syllabus', url: '/syllabus/rrb-group-d', org: 'RRB', label: 'Level-1 Complete Guide' },
  { exam: 'RBI Grade B Officer', url: '/syllabus/rbi-grade-b', org: 'IBPS', label: 'Phase 1 & Phase 2 Guide' },
  { exam: 'UPSC Official Candidate Portal', url: 'https://upsc.gov.in/examinations/active-examinations', org: 'UPSC', label: 'Official UPSC Portal' },
  { exam: 'MPSC Official Candidate Portal', url: 'https://mpsconline.gov.in', org: 'MPSC', label: 'Official MPSC Portal' },
  { exam: 'SSC Official Candidate Portal', url: 'https://ssc.gov.in/candidate-portal', org: 'SSC', label: 'Official SSC Portal' },
  { exam: 'CTET Paper 1 & 2', url: 'https://ctet.nic.in', org: 'CBSE', label: 'Official CTET Portal' },
]

const ORG_COLORS = {
  MPSC: { bg: '#FFF7ED', color: '#C2410C' },
  UPSC: { bg: '#EFF6FF', color: '#1D4ED8' },
  SSC:  { bg: '#ECFDF5', color: '#065F46' },
  IBPS: { bg: '#F5F3FF', color: '#5B21B6' },
  RRB:  { bg: '#FDF4FF', color: '#7E22CE' },
  GATE: { bg: '#F0FDF4', color: '#166534' },
  SBI:  { bg: '#FFFBEB', color: '#92400E' },
}

// Quick link blocks at top
const QUICK_LINKS = [
  {
    icon: 'play_circle',
    title: 'YouTube Channels',
    desc: '30+ exam-specific channels for MPSC, UPSC, Banking, SSC, Railways, GATE, and Teaching.',
    href: '/youtube',
    cta: 'Browse Channels',
    badge: 'Marathi / Hindi / English',
    bg: '#FF0000',
  },
  {
    icon: 'smart_toy',
    title: 'AI Tools for Study',
    desc: '84+ curated AI tools — NotebookLM, Claude, Gamma, Perplexity — each with a step-by-step how-to guide.',
    href: '/ai-tools',
    cta: 'Explore 84 AI Tools',
    badge: '84 Free & Pro Tools',
    bg: 'var(--primary)',
  },
  {
    icon: 'explore',
    title: 'Career Decision Compass',
    desc: 'Complete career options after 10th & 12th across Science, Commerce, Arts, and Polytechnic with salary ladders.',
    href: '/career',
    cta: 'Explore Careers',
    badge: '40+ Career Paths',
    bg: '#EA580C',
  },
  {
    icon: 'school',
    title: 'AI Academy',
    desc: 'Live weekend cohorts: Prompt Engineering, Cursor, NotebookLM, Resume Building, and more.',
    href: '/ai-academy',
    cta: 'Join Academy',
    badge: 'Live Cohort',
    bg: '#7C3AED',
  },
]

export default function ResourcesPage() {
  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Hero */}
      <div style={{
        borderBottom: '1px solid var(--outline-variant)',
        padding: '40px 20px 32px',
        background: 'var(--surface-container-lowest)',
      }}>
        <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 14 }}>
            <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Home</Link>
            {' › '}Resources
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Study Resources & Learning Hub
          </h1>
          <p style={{ fontSize: 15, color: 'var(--secondary)', margin: 0, maxWidth: 680, lineHeight: 1.6 }}>
            Free curated resources for government exam aspirants — YouTube channels, AI study tools,
            and official syllabus PDF links. All verified, all free.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100, margin: '32px auto 0', padding: '0 20px' }}>

        {/* ── Quick Navigation Blocks ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 48 }}>
          {QUICK_LINKS.map((block, i) => (
            <Link
              key={i}
              href={block.href}
              style={{
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 20px',
                textDecoration: 'none',
                display: 'flex', flexDirection: 'column', gap: 10,
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: block.bg, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{block.icon}</span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 800,
                  background: 'var(--primary-fixed)', color: 'var(--primary)',
                  padding: '3px 8px', borderRadius: 999,
                }}>
                  {block.badge}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 6 }}>{block.title}</div>
                <p style={{ fontSize: 13, color: 'var(--secondary)', margin: 0, lineHeight: 1.55 }}>{block.desc}</p>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
                {block.cta}
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Syllabus & Official PDFs ── */}
        <section>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Official Syllabus & Exam Portals</h2>
            <p style={{ fontSize: 13, color: 'var(--secondary)', margin: 0 }}>
              Direct links to official syllabi and exam portals — no third-party PDFs, no spam.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
            {SYLLABUS_LINKS.map((item, i) => {
              const orgStyle = ORG_COLORS[item.org] || { bg: '#F9FAFB', color: '#374151' }
              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                  }}
                >
                  <span style={{
                    fontSize: 11, fontWeight: 800,
                    padding: '3px 8px', borderRadius: 6,
                    background: orgStyle.bg, color: orgStyle.color,
                    flexShrink: 0,
                  }}>
                    {item.org}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', flex: 1, minWidth: 0 }}>
                    {item.exam}
                  </span>
                  {item.url.startsWith('/') ? (
                    <Link
                      href={item.url}
                      style={{
                        fontSize: 12, fontWeight: 700, color: 'var(--primary)',
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                    </Link>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12, fontWeight: 700, color: 'var(--primary)',
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                    </a>
                  )}
                </div>
              )
            })}
          </div>

          <p style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 16, textAlign: 'center' }}>
            Links open official government/exam board websites in a new tab. ExamUdaan does not host or modify any PDFs.
          </p>
        </section>
      </div>
    </div>
  )
}
