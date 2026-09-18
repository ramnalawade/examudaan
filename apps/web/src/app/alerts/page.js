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
  new:    { label: 'New Job',   color: 'var(--primary)',        bg: 'rgba(163,57,0,0.08)' },
  urgent: { label: 'Urgent',   color: 'var(--error)',           bg: 'var(--error-container)' },
  result: { label: 'Result',   color: 'var(--tertiary)',        bg: 'rgba(0,107,44,0.1)' },
  admit:  { label: 'Admit Card', color: 'var(--secondary)',     bg: 'var(--secondary-container)' },
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

      {/* ---- WhatsApp Upgrade Banner ---- */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <span className="material-symbols-outlined fill" style={{ fontSize: 32, color: 'white', flexShrink: 0 }}>
          chat
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>
            Get WhatsApp Alerts Instantly
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
            Upgrade to Personal Plan @ ₹49/month
          </div>
        </div>
        <Link href="/pricing" className="btn-primary"
          style={{ background: 'white', color: 'var(--primary)', flexShrink: 0, fontWeight: 700 }}>
          Upgrade
        </Link>
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
