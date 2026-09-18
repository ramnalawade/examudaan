'use client'
// ============================================================
// app/admin/page.js — Internal Admin Dashboard
// ExamUdaan | View system stats and scraper logs
// ============================================================

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
          setStats(data.data)
        } else {
          setError(data.message || 'Failed to load stats')
        }
      } catch (err) {
        setError('Network error')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [router])

  if (loading) return <div className={`container admin-loadingState`}>Loading admin dashboard...</div>
  if (error) return <div className={`container admin-errorState`}>{error}</div>
  if (!stats) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="dash-card" style={{ marginBottom: 0 }}>
            <h2 className="admin-cardTitle">System Metrics</h2>
            <div className="admin-metricsGrid">
              <div className="admin-metricBox">
                <div className="admin-metricLabel">Total Users</div>
                <div className="admin-metricValue">{stats.totalUsers.toLocaleString()}</div>
              </div>
              <div className="admin-metricBox">
                <div className="admin-metricLabel">Active Alerts</div>
                <div className="admin-metricValue">{stats.activeAlerts.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className={`dash-card admin-tableContainer`}>
            <h2 className="admin-cardTitle">Recent Scraper Logs</h2>
            <table className="admin-logsTable">
              <thead>
                <tr>
                  <th>Spider</th>
                  <th>Status</th>
                  <th>New Items</th>
                  <th>Last Run</th>
                </tr>
              </thead>
              <tbody>
                {stats.scraperStatus.map((log, i) => (
                  <tr key={i}>
                    <td className="admin-spiderName">{log.spider_name || log.spider}</td>
                    <td>
                      <span className={`chip ${log.status === 'error' ? 'admin-statusError' : 'admin-statusSuccess'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td>{log.items_new}</td>
                    <td className="admin-logDate">{new Date(log.started_at || log.last_run).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`dash-card admin-tableContainer`} style={{ marginBottom: 0 }}>
            <h2 className="admin-cardTitle">Recent Payments</h2>
            <table className="admin-logsTable">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPayments && stats.recentPayments.length > 0 ? (
                  stats.recentPayments.map((payment, i) => (
                    <tr key={i}>
                      <td className="admin-spiderName">{payment.email || `User #${payment.user_id}`}</td>
                      <td>₹{payment.amount}</td>
                      <td>
                        <span className="chip" style={{ textTransform: 'uppercase' }}>
                          {payment.plan || 'Pro'}
                        </span>
                      </td>
                      <td>
                        <span className={`chip ${payment.status === 'paid' || payment.status === 'success' ? 'admin-statusSuccess' : 'admin-statusError'}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="admin-logDate">{new Date(payment.created_at || payment.date).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No recent payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
    </div>
  )
}
