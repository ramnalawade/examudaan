// ============================================================
// components/SaveJobButton.js — Bookmark/save job toggle
// ExamUdaan | Shows on job cards + detail pages
//
// Usage: <SaveJobButton notificationId={123} trackerId={null} />
//   - notificationId: the exam_notifications.id
//   - trackerId: if user already saved it, pass the tracker id for removal
//   - size: 'sm' | 'md' (default 'md')
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch } from '../lib/apiClient'

export default function SaveJobButton({ notificationId, trackerId = null, size = 'md' }) {
  const [saved,     setSaved]     = useState(!!trackerId)
  const [tid,       setTid]       = useState(trackerId)   // tracker id for deletion
  const [loading,   setLoading]   = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  // Sync saved state if trackerId prop changes
  useEffect(() => {
    setSaved(!!trackerId)
    setTid(trackerId)
  }, [trackerId])

  // Get JWT from localStorage
  function getToken() {
    try { return localStorage.getItem('eu_access_token') || '' }
    catch { return '' }
  }

  async function handleToggle(e) {
    e.preventDefault()   // don't navigate if inside a Link
    e.stopPropagation()

    const token = getToken()
    if (!token) {
      setShowLogin(true)
      setTimeout(() => setShowLogin(false), 3000)
      return
    }

    setLoading(true)
    try {
      if (saved && tid) {
        // Remove from saved
        const res = await apiFetch(`/api/user/saved-jobs?id=${tid}`, {
          method:  'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          setSaved(false)
          setTid(null)
        }
      } else {
        // Save the job
        const res = await apiFetch('/api/user/saved-jobs', {
          method:  'POST',
          headers: {
            Authorization:  `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notification_id: notificationId }),
        })
        if (res.ok) {
          const data = await res.json()
          setSaved(true)
          setTid(data.data?.tracker_id || null)
        }
      }
    } catch (err) {
      console.error('[SaveJobButton] Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const iconSize = size === 'sm' ? 18 : 22

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Login nudge tooltip */}
      {showLogin && (
        <div style={{
          position: 'absolute',
          bottom: '110%',
          right: 0,
          background: 'var(--on-surface)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 500,
          padding: '6px 10px',
          borderRadius: 6,
          whiteSpace: 'nowrap',
          zIndex: 100,
        }}>
          <Link href="/login" style={{ color: '#fdba74', fontWeight: 700 }}>Sign in</Link>
          {' '}to save jobs
        </div>
      )}

      <button
        onClick={handleToggle}
        disabled={loading}
        title={saved ? 'Remove from saved' : 'Save this job'}
        aria-label={saved ? 'Remove from saved jobs' : 'Save this job'}
        style={{
          background: saved ? 'var(--primary-fixed)' : 'transparent',
          border:     `1.5px solid ${saved ? 'var(--primary)' : 'var(--outline-variant)'}`,
          borderRadius: '8px',
          padding: size === 'sm' ? '4px 8px' : '6px 10px',
          cursor: loading ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          transition: 'all 0.15s',
          color: saved ? 'var(--primary)' : 'var(--secondary)',
        }}
      >
        <span
          className={`material-symbols-outlined${saved ? ' fill' : ''}`}
          style={{ fontSize: iconSize, transition: 'all 0.15s' }}
        >
          bookmark
        </span>
        {size !== 'sm' && (
          <span style={{ fontSize: 12, fontWeight: 600 }}>
            {loading ? '...' : saved ? 'Saved' : 'Save'}
          </span>
        )}
      </button>
    </div>
  )
}
