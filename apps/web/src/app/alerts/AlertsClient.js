// ============================================================
// app/alerts/AlertsClient.js — Interactive Client Island for Alerts
// Fast, zero-blocking hydration, active tab filter, mark as read
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'

const TYPE_CONFIG = {
  new: { label: 'New Job', color: 'var(--primary)', bg: 'rgba(163,57,0,0.08)' },
  urgent: { label: 'Urgent', color: 'var(--error)', bg: 'var(--error-container)' },
  result: { label: 'Result', color: 'var(--tertiary)', bg: 'rgba(0,107,44,0.1)' },
  admit: { label: 'Admit Card', color: 'var(--secondary)', bg: 'var(--secondary-container)' },
}

const FILTER_TABS = ['All', 'New Jobs', 'Urgent', 'Results', 'Admit Card']

export default function AlertsClient({ initialAlerts = [] }) {
  const [activeTab, setActiveTab] = useState('All')
  const [alerts, setAlerts] = useState(initialAlerts)

  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })))

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'All') return true
    if (activeTab === 'New Jobs') return alert.type === 'new'
    if (activeTab === 'Urgent') return alert.type === 'urgent'
    if (activeTab === 'Results') return alert.type === 'result'
    if (activeTab === 'Admit Card') return alert.type === 'admit'
    return true
  })

  const unreadCount = alerts.filter(a => !a.read).length

  return (
    <>
      {/* ---- Header Controls ---- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--on-surface)', margin: 0 }}>
            Notifications & Job Alerts
            {unreadCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: 10, background: 'var(--error, #BA1A1A)', color: 'white',
                borderRadius: '99px', fontSize: 11, fontWeight: 700,
                padding: '2px 8px', minWidth: 22,
              }}>
                {unreadCount}
              </span>
            )}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--secondary)', marginTop: 4, marginBottom: 0 }}>
            Real-time Maharashtra and Central government exam alerts.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            type="button"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--primary, #EA580C)', fontSize: 13, fontWeight: 600,
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
            type="button"
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'chip active' : 'chip'}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---- Notifications List ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredAlerts.map(alert => {
          const config = TYPE_CONFIG[alert.type] || TYPE_CONFIG.new
          return (
            <Link
              key={alert.id}
              href={alert.href || `/jobs/${alert.slug}`}
              className="alert-card"
              style={{
                textDecoration: 'none',
                background: alert.read ? 'var(--surface-container-lowest, #fff)' : 'rgba(163,57,0,0.03)',
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
                        background: 'var(--primary, #EA580C)', borderRadius: '50%',
                        marginLeft: 8, verticalAlign: 'middle',
                      }} />
                    )}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--secondary)', flexShrink: 0 }}>
                    {alert.time}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--secondary)', marginTop: 4, marginBottom: 0, lineHeight: 1.5 }}>
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
      {filteredAlerts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--secondary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 56, display: 'block', marginBottom: 12, opacity: 0.4 }}>
            notifications_off
          </span>
          <p style={{ fontSize: 16, fontWeight: 600 }}>No notifications in this category</p>
          <p style={{ fontSize: 14, marginTop: 4 }}>Select "All" to view all active exam notifications</p>
        </div>
      )}
    </>
  )
}
