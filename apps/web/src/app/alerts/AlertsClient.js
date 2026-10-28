// ============================================================
// app/alerts/AlertsClient.js — Interactive Client Island for Alerts
// Fast, zero-blocking hydration, active tab filter, mark as read
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './AlertsClient.module.css'

const TYPE_CONFIG = {
  new: { label: 'New Job', iconBoxClass: styles.iconBoxNew, tagClass: styles.typeTagNew },
  urgent: { label: 'Urgent', iconBoxClass: styles.iconBoxUrgent, tagClass: styles.typeTagUrgent },
  result: { label: 'Result', iconBoxClass: styles.iconBoxResult, tagClass: styles.typeTagResult },
  admit: { label: 'Admit Card', iconBoxClass: styles.iconBoxAdmit, tagClass: styles.typeTagAdmit },
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
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.headerTitle}>
            Notifications & Job Alerts
            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>
                {unreadCount}
              </span>
            )}
          </h1>
          <p className={styles.headerSubtitle}>
            Real-time Maharashtra and Central government exam alerts.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            type="button"
            className={styles.markReadBtn}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* ---- Filter Tabs ---- */}
      <div className={styles.tabsRow}>
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
      <div className={styles.alertsList}>
        {filteredAlerts.map(alert => {
          const config = TYPE_CONFIG[alert.type] || TYPE_CONFIG.new
          return (
            <Link
              key={alert.id}
              href={alert.href || `/jobs/${alert.slug}`}
              className={`alert-card ${styles.alertLink} ${!alert.read ? styles.alertLinkUnread : ''}`}
            >
              {/* Icon */}
              <div className={`${styles.iconBox} ${config.iconBoxClass}`}>
                <span className={`material-symbols-outlined ${styles.iconSymbol}`}>
                  {alert.icon}
                </span>
              </div>

              {/* Content */}
              <div className={styles.contentCol}>
                <div className={styles.cardTopRow}>
                  <h2 className={styles.cardTitle}>
                    {alert.title}
                    {!alert.read && (
                      <span className={styles.unreadDot} />
                    )}
                  </h2>
                  <span className={styles.timeAgo}>
                    {alert.time}
                  </span>
                </div>
                <p className={styles.cardBody}>
                  {alert.body}
                </p>
                <span className={`${styles.typeTag} ${config.tagClass}`}>
                  {config.label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Empty state */}
      {filteredAlerts.length === 0 && (
        <div className={styles.emptyState}>
          <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
            notifications_off
          </span>
          <p className={styles.emptyTitle}>No notifications in this category</p>
          <p className={styles.emptySubtitle}>Select "All" to view all active exam notifications</p>
        </div>
      )}
    </>
  )
}
