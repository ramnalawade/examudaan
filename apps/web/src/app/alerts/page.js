// ============================================================
// app/alerts/page.js — Job Alerts / Notifications (Server Component)
// Fast initial paint, pre-rendered semantic HTML, 5-min ISR cache
// ============================================================

import AlertsClient from './AlertsClient'
import { query } from '@/lib/pgdb'

export const revalidate = 300 // 5-minute ISR cache

export const metadata = {
  title: 'Instant Govt Job Alerts & Exam Notifications | ExamUdaan',
  description: 'Get instant notifications for MPSC, Maharashtra Police Bharti, RRB, SSC, and Banking exams. Free WhatsApp and Telegram alert broadcasts.',
  keywords: [
    'govt job alerts', 'exam notifications 2026', 'MPSC notification', 'WhatsApp job alerts',
    'Telegram job alerts', 'sarkari naukri alert', 'police bharti notification', 'SSC notification'
  ],
  alternates: {
    canonical: 'https://examudaan.in/alerts',
  },
  openGraph: {
    title: 'Instant Govt Job Alerts & Exam Notifications | ExamUdaan',
    description: 'Get real-time alerts for Maharashtra and Central Govt exam recruitments, results, and admit cards.',
    url: 'https://examudaan.in/alerts',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Govt Job Alerts 2026 | ExamUdaan',
    description: 'Instant alerts for MPSC, Police Bharti, SSC, RRB — free WhatsApp & Telegram broadcasts.',
  },
}

const FALLBACK_ALERTS = [
  {
    id: 'a1',
    type: 'new',
    icon: 'account_balance',
    title: 'MPSC State Services 2026 (Rajyaseva)',
    body: 'Maharashtra Civil Services Combined Prelims notification released. Over 4,100 vacancies across state departments.',
    time: 'Today',
    read: false,
    slug: 'mpsc-state-services-combined-prelims-2026',
    href: '/jobs/mpsc-state-services-combined-prelims-2026',
  },
  {
    id: 'a2',
    type: 'urgent',
    icon: 'local_police',
    title: 'Mumbai Police Bharti 2026 — Deadline Soon!',
    body: 'Mumbai Police Constable & Bandsman recruitment closing soon. Verify document uploads and submit online.',
    time: 'Urgent',
    read: false,
    slug: 'munbii-poliis-shipaaii-bhrtii-sn-2024-25-mdhye-vaaddhiiv-pdaancaa-sudhaarit-kppiikrt-aarkssnn-nihaay-tktaa-di-22-01-2026',
    href: '/jobs/munbii-poliis-shipaaii-bhrtii-sn-2024-25-mdhye-vaaddhiiv-pdaancaa-sudhaarit-kppiikrt-aarkssnn-nihaay-tktaa-di-22-01-2026',
  },
  {
    id: 'a3',
    type: 'new',
    icon: 'train',
    title: 'RRB NTPC Graduate & Undergraduate 2026',
    body: 'Railway Recruitment Board opened 11,558 vacancies for Station Master, Goods Train Manager, and Clerks.',
    time: '1 day ago',
    read: false,
    slug: 'rrb-non-technical-popular-categories-ntpc-2026',
    href: '/jobs/rrb-non-technical-popular-categories-ntpc-2026',
  },
  {
    id: 'a4',
    type: 'result',
    icon: 'emoji_events',
    title: 'Maharashtra Talathi & ZP Bharti Merit Lists',
    body: 'District selection lists and scorecards declared. Check roll numbers on the official results directory.',
    time: 'Recent',
    read: true,
    slug: 'results',
    href: '/results',
  },
  {
    id: 'a5',
    type: 'new',
    icon: 'badge',
    title: 'SSC CGL 2026 Combined Graduate Level',
    body: 'Staff Selection Commission announced 17,727 vacancies for Assistant Section Officer, Inspector, and Tax Assistant.',
    time: '2 days ago',
    read: true,
    slug: 'ssc-combined-graduate-level-cgl-2026',
    href: '/jobs/ssc-combined-graduate-level-cgl-2026',
  },
  {
    id: 'a6',
    type: 'admit',
    icon: 'assignment_turned_in',
    title: 'MPSC Hall Tickets & Examination Timetable',
    body: 'Download official admit cards for upcoming screening and departmental preliminary exams.',
    time: 'Active',
    read: true,
    slug: 'admit-cards',
    href: '/admit-cards',
  },
]

export default async function AlertsPage() {
  let realAlerts = []
  try {
    const rows = await query(`
      SELECT en.id, en.title, en.slug, en.notification_type, en.total_vacancies,
             en.apply_end_date, en.published_at, o.acronym AS org_acronym
      FROM exam_notifications en
      JOIN organizations o ON o.id = en.organization_id
      WHERE en.status = 'published'
      ORDER BY COALESCE(en.published_at, en.created_at) DESC NULLS LAST, en.id DESC
      LIMIT 10
    `)

    if (rows && rows.length > 0) {
      realAlerts = rows.map((r, i) => {
        let type = 'new'
        let icon = 'account_balance'
        let href = `/jobs/${r.slug || r.id}`

        if (r.notification_type === 'result') {
          type = 'result'
          icon = 'emoji_events'
          href = `/results/${r.slug || r.id}`
        } else if (r.notification_type === 'admit_card') {
          type = 'admit'
          icon = 'badge'
          href = `/admit-cards/${r.slug || r.id}`
        } else if (r.apply_end_date) {
          const daysLeft = Math.round((new Date(r.apply_end_date) - new Date()) / (1000 * 60 * 60 * 24))
          if (daysLeft >= 0 && daysLeft <= 3) {
            type = 'urgent'
            icon = 'priority_high'
          }
        }

        return {
          id: String(r.id),
          type,
          icon,
          title: r.title,
          body: r.total_vacancies
            ? `${r.org_acronym || 'Govt'} Recruitment — ${Number(r.total_vacancies).toLocaleString('en-IN')} total posts announced.`
            : `Official notification update from ${r.org_acronym || 'Government Department'}.`,
          time: i < 3 ? 'Today' : 'Recent',
          read: i > 2,
          slug: r.slug || String(r.id),
          href,
        }
      })
    }
  } catch {
    // Gracefully fall back to verified 2026 alerts
  }

  const alerts = realAlerts.length > 0 ? realAlerts : FALLBACK_ALERTS

  return (
    <div className="container" style={{ paddingTop: '24px', paddingBottom: '60px', maxWidth: 720 }}>
      {/* ---- Telegram & WhatsApp Alert Channels Banner ---- */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        color: 'white',
        boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
      }}>
        {/* Telegram Icon */}
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>
            Instant Govt Job Alerts on Telegram (100% Free)
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
            Join 25,000+ Maharashtra aspirants on our official Telegram broadcast.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a
            href="https://t.me/examudaanjobs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ background: 'white', color: '#0369a1', flexShrink: 0, fontWeight: 700, padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}
          >
            Join Telegram ↗
          </a>
          <a
            href="https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* ---- Interactive Client Island ---- */}
      <AlertsClient initialAlerts={alerts} />
    </div>
  )
}
