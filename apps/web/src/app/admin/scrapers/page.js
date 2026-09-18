'use client'
// ============================================================
// app/admin/scrapers/page.js — Scraper Logs Management
// ExamUdaan | View detailed logs from Scrapy spiders
// ============================================================

import { useState, useEffect } from 'react'

export default function AdminScrapersPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch('/api/admin/scrapers', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setLogs(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="admin-loadingState">Loading scraper logs...</div>
  if (error) return <div className="admin-errorState">{error}</div>

  return (
    <div>
      <div className="dash-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="admin-cardTitle" style={{ margin: 0 }}>Scraper Logs</h2>
          <span className="jobs-count">Total Records: <strong>{logs.length}</strong></span>
        </div>
        
        <div className="admin-tableContainer" style={{ margin: 0, overflowX: 'auto' }}>
          <table className="admin-logsTable" style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th>Spider</th>
                <th>Status</th>
                <th>New/Updated</th>
                <th>Duration</th>
                <th>Start Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="admin-spiderName">
                    {log.spider_name || log.spider}
                    {log.error_message && (
                      <div style={{ fontSize: '11px', color: 'var(--status-closed)', marginTop: '4px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.error_message}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`chip ${log.status === 'error' ? 'admin-statusError' : 'admin-statusSuccess'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--status-open)', fontWeight: 600 }}>+{log.items_new || 0}</span> / <span style={{ color: 'var(--text-muted)' }}>~{log.items_updated || 0}</span>
                  </td>
                  <td className="admin-logDate">{log.duration_seconds ? `${log.duration_seconds}s` : '-'}</td>
                  <td className="admin-logDate">{new Date(log.started_at || log.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No scraper logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
