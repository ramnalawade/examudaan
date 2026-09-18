// ============================================================
// app/about/page.js — About ExamUdaan.in
// Design: Warm ivory + saffron accents, rich stats, mission & values
// ============================================================

import Link from 'next/link'

export const metadata = {
  title: 'About Us — ExamUdaan.in',
  description: 'Learn about ExamUdaan.in, Maharashtra\'s premier AI-powered government exam and job alerts platform. Monitored across 37+ official state and central portals.',
}

export default function AboutPage() {
  const stats = [
    { value: '37+', label: 'Official Portals Tracked', icon: 'travel_explore' },
    { value: '100%', label: 'Direct Govt PDF Links', icon: 'verified' },
    { value: '< 5 min', label: 'Instant Alert Latency', icon: 'bolt' },
    { value: '25,000+', label: 'Aspirants Empowered', icon: 'groups' },
  ]

  const pillars = [
    {
      icon: 'auto_awesome',
      title: 'AI-Powered Extraction',
      description: 'Our proprietary scrapers and automated AI pipeline digest complex 60-page official notification PDFs into crystal-clear age limits, qualifications, walk-in dates, and vacancy breakdowns.',
    },
    {
      icon: 'chat',
      title: 'Real-Time WhatsApp Alerts',
      description: 'Never miss a last-date deadline. Receive tailored alerts for MPSC, Police Bharti, BMC, ZP, and Railway recruitments straight to your WhatsApp for less than the price of a cup of tea.',
    },
    {
      icon: 'policy',
      title: 'Zero Clickbait, 100% Authentic',
      description: 'Every job listing, result, and admit card on ExamUdaan links directly to the verified official government portal and authentic PDF gazette. No fake jobs, no deceptive advertising.',
    },
    {
      icon: 'translate',
      title: 'Tailored for Maharashtra & India',
      description: 'Built from Pune and Mumbai with native bilingual focus (Marathi & English), catering to local municipal corporations, state police commissionerates, Zilla Parishads, and national central recruitment.',
    },
  ]

  const milestones = [
    {
      year: '2024',
      title: 'The Inception',
      desc: 'Founded by competitive exam aspirants frustrated by fragmented government portals, spammy job aggregators, and missed application deadlines.',
    },
    {
      year: '2025',
      title: 'AI Pipeline & Scraper Engine',
      desc: 'Launched automated crawlers across 37+ Maharashtra and Central recruitment boards with automatic AI-driven classification and qualification tagging.',
    },
    {
      year: '2026',
      title: 'WhatsApp Alert Network',
      desc: 'Rolled out low-latency WhatsApp notification channels, daily digest updates, and walk-in interview tracking to empower thousands of rural and urban aspirants.',
    },
  ]

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 64 }}>
      {/* Breadcrumb Header */}
      <div style={{ borderBottom: '1px solid var(--outline-variant)', background: 'var(--surface-container-lowest)', padding: '16px 0' }}>
        <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--secondary)' }}>
            <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>About Us</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        {/* Hero Section */}
        <section style={{ textAlign: 'center', padding: '56px 0 40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--primary-fixed)',
            color: 'var(--on-primary-fixed)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 16,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>rocket_launch</span>
            Our Mission & Story
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            color: 'var(--on-surface)',
            lineHeight: 1.2,
            marginBottom: 20,
          }}>
            Empowering Maharashtra’s Aspirants with <span style={{ color: 'var(--primary-cta)' }}>Instant & Verified</span> Sarkari Alerts
          </h1>
          <p style={{
            fontSize: 17,
            lineHeight: 1.6,
            color: 'var(--on-surface-variant)',
            maxWidth: 760,
            margin: '0 auto 36px',
          }}>
            ExamUdaan.in was built to solve a critical problem: government notifications in India are published across hundreds of archaic departmental portals. We track, verify, and summarize every opportunity so you can focus entirely on your preparation.
          </p>

          {/* Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            background: 'var(--surface-container-lowest)',
            padding: 24,
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--outline-variant)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}>
            {stats.map((s, idx) => (
              <div key={idx} style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--primary-fixed)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{s.icon}</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary-cta)', lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--secondary)', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Why ExamUdaan Grid */}
        <section style={{ padding: '40px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8 }}>
              Why Lakhs of Aspirants Trust ExamUdaan
            </h2>
            <p style={{ color: 'var(--secondary)', fontSize: 15 }}>
              Designed from ground up with speed, transparency, and candidate convenience at its heart.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {pillars.map((p, idx) => (
              <div key={idx} style={{
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 'var(--radius-md)',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-container-low)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 26 }}>{p.icon}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)' }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.6, flexGrow: 1 }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The Problem & Solution */}
        <section style={{
          padding: '40px 32px',
          background: 'var(--surface-container-low)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--outline-variant)',
          margin: '20px 0 40px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Our Purpose
              </span>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--on-surface)', marginTop: 8, marginBottom: 16 }}>
                Bridging the Gap Between Government Vacancies and Deserving Candidates
              </h2>
              <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', lineHeight: 1.7, marginBottom: 16 }}>
                Every year in Maharashtra, thousands of posts across MPSC, Police Commissionerates, BMC, Municipal Councils, and District Collectorates go unnoticed or receive late applications because notification releases are unpredictable.
              </p>
              <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', lineHeight: 1.7 }}>
                ExamUdaan indexes each announcement in real time, extracts eligibility criteria (minimum age, educational degree, caste category relaxations, and fees), and pings relevant candidates so no one misses out due to informational asymmetry.
              </p>
            </div>
            <div style={{
              background: 'var(--surface-container-lowest)',
              padding: 24,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--outline-variant)',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 16 }}>
                What Sets Us Apart
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Real-time scrapers running 24x7 across Maharashtra & Central boards',
                  'Clear classification: Walk-In interviews vs Online Written Exams',
                  'Dedicated Admit Card, Answer Key, and Final Merit Result trackers',
                  'Direct PDF downloads hosted on authentic government servers',
                  'Zero misleading sponsored links or third-party phishing ads',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--on-surface)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--tertiary)', flexShrink: 0, marginTop: 2 }}>
                      check_circle
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Our Journey Milestones */}
        <section style={{ padding: '32px 0 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8 }}>
              Our Journey
            </h2>
            <p style={{ color: 'var(--secondary)', fontSize: 15 }}>
              From a simple alert script to Maharashtra’s most dependable exam tracker.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {milestones.map((m, idx) => (
              <div key={idx} style={{
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 'var(--radius-md)',
                padding: 24,
                position: 'relative',
              }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: 'var(--primary-cta)',
                  background: 'var(--primary-fixed)',
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 12,
                }}>
                  {m.year}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8 }}>{m.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Box */}
        <section style={{
          background: 'linear-gradient(135deg, #a33900 0%, #EA580C 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '44px 32px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(234, 88, 12, 0.25)',
        }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, marginBottom: 12 }}>
            Start Receiving Alerts for Your Target Exam Today
          </h2>
          <p style={{ fontSize: 16, opacity: 0.92, maxWidth: 600, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Join thousands of active students and job seekers across Maharashtra who get instant updates via WhatsApp and Email.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link
              href="/pricing"
              style={{
                background: '#ffffff',
                color: 'var(--primary)',
                padding: '12px 26px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chat</span>
              Subscribe WhatsApp Alerts
            </Link>
            <Link
              href="/jobs"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '12px 26px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
              Browse Active Jobs
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
