// ============================================================
// app/question-papers/viewer/page.js — In-Browser PDF Viewer
// Embeds the PDF via iframe so the user STAYS on ExamUdaan.
// URL: /question-papers/viewer?pdf=/question-papers/mpsc/...pdf&title=...
// Related content sidebar encourages PYQ practice / mock tests.
// ============================================================

import Link from 'next/link'

export const metadata = {
  title: 'View Question Paper | ExamUdaan',
  description: 'Read previous year question papers and answer keys in your browser. Practice interactively with 1,100+ PYQs and CBT mock tests on ExamUdaan.',
}

// Viewer is a client component because we read searchParams at render time.
// Next.js 14 App Router: searchParams is passed as a prop to the page.
export default function PaperViewerPage({ searchParams }) {
  const pdfPath = searchParams?.pdf || ''
  const title   = searchParams?.title || 'Question Paper'

  // Security: only allow PDFs from our own /question-papers/ folder
  const safeToEmbed = pdfPath.startsWith('/question-papers/') && pdfPath.endsWith('.pdf')

  return (
    <div style={{ background: '#FFFBF5', minHeight: '100vh' }}>

      {/* ── Top Bar ── */}
      <div style={{
        background: '#1F2937',
        color: '#FFFFFF',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/question-papers"
            style={{ color: '#FED7AA', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}
          >
            ← Question Papers
          </Link>
          <span style={{ color: '#6B7280' }}>|</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#F9FAFB', maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </span>
        </div>
        {/* Source badge */}
        <span style={{ fontSize: '11px', background: '#374151', color: '#9CA3AF', padding: '4px 10px', borderRadius: '20px' }}>
          📄 Official Source — mpscs.in
        </span>
      </div>

      {/* ── Main Layout: PDF + Sidebar ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '0',
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 52px)'
      }}>

        {/* PDF Embed (no download, stays on page) */}
        <div style={{ borderRight: '1px solid #E5E7EB' }}>
          {safeToEmbed ? (
            <iframe
              src={pdfPath}
              title={title}
              width="100%"
              height="100%"
              style={{ border: 'none', minHeight: '85vh', display: 'block' }}
              // Disable the browser default download toolbar via CSP headers set in next.config
            />
          ) : (
            <div style={{ padding: '48px', textAlign: 'center', color: '#6B7280' }}>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444' }}>Invalid PDF path.</p>
              <Link href="/question-papers" style={{ color: '#EA580C', fontWeight: 600 }}>← Back to Question Papers</Link>
            </div>
          )}
        </div>

        {/* ── Related Content Sidebar ── */}
        <aside style={{
          background: '#FFFFFF',
          padding: '24px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowY: 'auto'
        }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '17px', fontWeight: 800, color: '#1F2937', margin: '0 0 4px 0' }}>
              पुढे काय करायचे?
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>
              प्रश्नपत्रिका वाचल्यानंतर सराव सुरू करा
            </p>
          </div>

          {/* PYQ Bank */}
          <SidebarCard
            href="/pyq"
            bg="#FFF7ED"
            border="#FFEDD5"
            iconBg="#EA580C"
            icon="🔍"
            title="1,100+ PYQ Bank"
            desc="15 वर्षांचे विषयनिहाय सराव प्रश्न — Polity, History, Geography, Marathi + 6 more"
            badge="Most Used"
            badgeColor="#EA580C"
          />

          {/* Mock Tests */}
          <SidebarCard
            href="/mock-tests"
            bg="#EFF6FF"
            border="#BFDBFE"
            iconBg="#1D4ED8"
            icon="⏱️"
            title="CBT Mock Tests"
            desc="100 प्रश्न, वेळ मर्यादा, TCS / MPSC / SSC official blueprint"
            badge="Full Exams"
            badgeColor="#1D4ED8"
          />

          {/* AI Tools */}
          <SidebarCard
            href="/ai-tools"
            bg="#F5F3FF"
            border="#DDD6FE"
            iconBg="#7C3AED"
            icon="🤖"
            title="84 Free AI Study Tools"
            desc="Summarize, explain, translate any concept instantly with AI"
            badge="Free"
            badgeColor="#7C3AED"
          />

          {/* Study Planner */}
          <SidebarCard
            href="/study-planner"
            bg="#F0FDFA"
            border="#CCFBF1"
            iconBg="#0D9488"
            icon="📅"
            title="AI Study Planner"
            desc="30/60/90 दिवसांची दैनंदिन अभ्यास योजना — exam-specific"
            badge="New"
            badgeColor="#0D9488"
          />

          {/* Score Calculator */}
          <SidebarCard
            href="/score-calculator"
            bg="#F8FAFC"
            border="#E2E8F0"
            iconBg="#374151"
            icon="🧮"
            title="Score Calculator"
            desc="Response sheet पेस्ट करा — raw score, cutoff compare, percentile"
            badge="Official Pattern"
            badgeColor="#374151"
          />

          {/* Daily Quiz */}
          <SidebarCard
            href="/daily-quiz"
            bg="#FFF7ED"
            border="#FED7AA"
            iconBg="#C2410C"
            icon="🔥"
            title="Daily 10Q Streak Quiz"
            desc="दररोज 10 प्रश्न — 5 मिनिटांचा सराव, streak tracker"
            badge="Daily Habit"
            badgeColor="#C2410C"
          />

          {/* Divider */}
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '14px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
              सर्व परीक्षा
            </p>
            {[
              { href: '/pyq/polity', label: 'Polity PYQs →' },
              { href: '/pyq/history', label: 'History PYQs →' },
              { href: '/pyq/marathi', label: 'Marathi PYQs →' },
              { href: '/pyq/geography', label: 'Geography PYQs →' },
              { href: '/cutoffs', label: '10-Year Cutoffs →' },
              { href: '/syllabus/mpsc-combined', label: 'MPSC Syllabus →' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                display: 'block', fontSize: '13px', fontWeight: 600, color: '#EA580C',
                textDecoration: 'none', padding: '5px 0', borderBottom: '1px solid #F9FAFB'
              }}>
                {l.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>

      {/* ── Mobile: related links below viewer ── */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 300px"] {
            grid-template-columns: 1fr !important;
          }
          iframe { min-height: 60vh !important; }
        }
      `}</style>
    </div>
  )
}

// ── Reusable sidebar card ────────────────────────────────────
function SidebarCard({ href, bg, border, iconBg, icon, title, desc, badge, badgeColor }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: bg, border: `1px solid ${border}`, borderRadius: '10px',
        padding: '12px 14px', cursor: 'pointer',
        transition: 'box-shadow 0.15s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: iconBg, color: '#FFF', fontSize: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: 700, color: '#1F2937' }}>
                {title}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: badgeColor, background: '#fff', border: `1px solid ${badgeColor}`, padding: '2px 6px', borderRadius: '4px' }}>
                {badge}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: 1.45 }}>
              {desc}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
