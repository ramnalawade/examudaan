// ============================================================
// app/alerts/page.js — Job Alerts / Notifications
// Material Design 3 card-based notification list
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'

const ALERTS = [
  {
    id: 1,
    type: 'new',
    icon: 'account_balance',
    title: 'MPSC State Services 2024',
    body: 'New notification released. 274 vacancies. Apply before 25 Jan 2024.',
    time: '2 mins ago',
    read: false,
    slug: 'mpsc-state-services-2024',
  },
  {
    id: 2,
    type: 'urgent',
    icon: 'local_police',
    title: 'Police Bharti — Deadline Tomorrow!',
    body: 'Maharashtra Police Constable Bharti 2024 closes tomorrow. Don\'t miss it!',
    time: '1 hour ago',
    read: false,
    slug: 'maharashtra-police-constable-2024',
  },
  {
    id: 3,
    type: 'result',
    icon: 'emoji_events',
    title: 'Talathi Bharti Result Announced',
    body: 'Talathi Bharti 2023 results are now available. Check your roll number.',
    time: '3 hours ago',
    read: true,
    slug: 'talathi-bharti-result-2023',
  },
  {
    id: 4,
    type: 'new',
    icon: 'location_city',
    title: 'BMC Recruitment — 1500 Posts',
    body: 'BMC Executive Assistant Recruitment 2024 is open. Graduate + Computer cert required.',
    time: 'Yesterday',
    read: true,
    slug: 'bmc-executive-assistant-2024',
  },
  {
    id: 5,
    type: 'admit',
    icon: 'badge',
    title: 'Admit Card Released: MPSC Prelims',
    body: 'Download your MPSC State Services Prelims 2024 admit card now.',
    time: '2 days ago',
    read: true,
    slug: 'mpsc-state-services-2024',
  },
]

const TYPE_CONFIG = {
  new: { label: 'New Job', color: 'var(--primary)', bg: 'rgba(163,57,0,0.08)' },
  urgent: { label: 'Urgent', color: 'var(--error)', bg: 'var(--error-container)' },
  result: { label: 'Result', color: 'var(--tertiary)', bg: 'rgba(0,107,44,0.1)' },
  admit: { label: 'Admit Card', color: 'var(--secondary)', bg: 'var(--secondary-container)' },
}

const FILTER_TABS = ['All', 'New Jobs', 'Urgent', 'Results', 'Admit Card']

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [alerts, setAlerts] = useState(ALERTS)

  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })))

  const unreadCount = alerts.filter(a => !a.read).length

  return (
    <div className="container" style={{ paddingTop: '24px', maxWidth: 720 }}>

      {/* ---- Header ---- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--on-surface)' }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: 10, background: 'var(--error)', color: 'white',
                borderRadius: '99px', fontSize: 11, fontWeight: 700,
                padding: '2px 8px', minWidth: 22,
              }}>
                {unreadCount}
              </span>
            )}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--secondary)', marginTop: 4 }}>
            Stay updated on all your job alerts.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--primary)', fontSize: 13, fontWeight: 600,
              padding: '6px 12px', borderRadius: '8px',
              transition: 'background 0.1s',
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* ---- Filter Tabs ---- */}
      <div style={{
        display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px',
        marginBottom: '20px', scrollbarWidth: 'none',
      }}>
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'chip active' : 'chip'}
          >
            {tab}
          </button>
        ))}
      </div>

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

      {/* ---- Notifications List ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {alerts.map(alert => {
          const config = TYPE_CONFIG[alert.type] || TYPE_CONFIG.new
          return (
            <Link
              key={alert.id}
              href={`/jobs/${alert.slug}`}
              className="alert-card"
              style={{
                textDecoration: 'none',
                background: alert.read ? 'var(--surface-container-lowest)' : 'rgba(163,57,0,0.03)',
                transition: 'box-shadow 0.15s',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 44, height: 44,
                borderRadius: '10px',
                background: config.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24, color: config.color }}>
                  {alert.icon}
                </span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>
                    {alert.title}
                    {!alert.read && (
                      <span style={{
                        display: 'inline-block', width: 8, height: 8,
                        background: 'var(--primary)', borderRadius: '50%',
                        marginLeft: 8, verticalAlign: 'middle',
                      }} />
                    )}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--secondary)', flexShrink: 0 }}>
                    {alert.time}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--secondary)', marginTop: 4, lineHeight: 1.5 }}>
                  {alert.body}
                </p>
                <span style={{
                  display: 'inline-block', marginTop: 6,
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: config.color,
                }}>
                  {config.label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Empty state */}
      {alerts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--secondary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 56, display: 'block', marginBottom: 12, opacity: 0.4 }}>
            notifications_off
          </span>
          <p style={{ fontSize: 16, fontWeight: 600 }}>No notifications yet</p>
          <p style={{ fontSize: 14, marginTop: 4 }}>Subscribe to get instant job alerts</p>
        </div>
      )}
    </div>
  )
}
