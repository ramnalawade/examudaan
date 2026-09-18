'use client'
// ============================================================
// app/admin/jobs/page.js — Jobs Management
// ExamUdaan | View, edit, hide job postings
// ============================================================

import { useState, useEffect } from 'react'
import { formatDate } from '../../../lib/formatDate'

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs() {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch('/api/admin/jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setJobs(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHide(id, currentHidden) {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_hidden: !currentHidden })
      })
      const data = await res.json()
      if (data.success) {
        setJobs(jobs.map(j => j.id === id ? { ...j, is_hidden: !currentHidden } : j))
      } else {
        alert('Failed to update status')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch(`/api/admin/jobs/${editingJob.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editingJob.title,
          vacancies: editingJob.vacancies ? parseInt(editingJob.vacancies, 10) : null,
          application_end: editingJob.application_end || null
        })
      })
      const data = await res.json()
      if (data.success) {
        setJobs(jobs.map(j => j.id === editingJob.id ? { ...j, ...data.data } : j))
        setEditingJob(null)
      } else {
        alert('Failed to save')
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loadingState">Loading jobs...</div>
  if (error) return <div className="admin-errorState">{error}</div>

  return (
    <div>
      <div className="dash-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="admin-cardTitle" style={{ margin: 0 }}>Jobs Management</h2>
          <span className="jobs-count">Total: <strong>{jobs.length}</strong></span>
        </div>
        
        <div className="admin-tableContainer" style={{ margin: 0, overflowX: 'auto' }}>
          <table className="admin-logsTable" style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th>Title & Board</th>
                <th>Vacancies</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-heading)', marginBottom: '4px' }}>
                      {job.title}
                    </div>
                    {job.boards?.short_name && (
                      <span className="chip">{job.boards.short_name}</span>
                    )}
                  </td>
                  <td>{job.vacancies ? job.vacancies.toLocaleString() : '-'}</td>
                  <td className="admin-logDate">{job.application_end ? formatDate(job.application_end) : '-'}</td>
                  <td>
                    <span className={`chip ${job.is_hidden ? 'admin-statusError' : 'admin-statusSuccess'}`}>
                      {job.is_hidden ? 'Hidden' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-ghost" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => setEditingJob(job)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-ghost" 
                        style={{ padding: '6px 12px', fontSize: '12px', borderColor: job.is_hidden ? 'var(--status-open)' : 'var(--status-closed)', color: job.is_hidden ? 'var(--status-open)' : 'var(--text-body)' }}
                        onClick={() => handleToggleHide(job.id, job.is_hidden)}
                      >
                        {job.is_hidden ? 'Publish' : 'Hide'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal (Basic inline style implementation for MVP) */}
      {editingJob && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="dash-card" style={{ width: '100%', maxWidth: '500px', margin: 0 }}>
            <h2 className="dash-title" style={{ fontSize: '20px', marginBottom: '16px' }}>Edit Job</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="login-formGroup">
                <label className="login-label">Job Title</label>
                <input 
                  type="text" 
                  className="login-input" 
                  value={editingJob.title || ''} 
                  onChange={e => setEditingJob({...editingJob, title: e.target.value})}
                  required
                />
              </div>
              <div className="login-formGroup">
                <label className="login-label">Vacancies</label>
                <input 
                  type="number" 
                  className="login-input" 
                  value={editingJob.vacancies || ''} 
                  onChange={e => setEditingJob({...editingJob, vacancies: e.target.value})}
                />
              </div>
              <div className="login-formGroup">
                <label className="login-label">Application End Date (YYYY-MM-DD)</label>
                <input 
                  type="date" 
                  className="login-input" 
                  value={editingJob.application_end || ''} 
                  onChange={e => setEditingJob({...editingJob, application_end: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setEditingJob(null)} disabled={saving}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
