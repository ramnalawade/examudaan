'use client'

// ============================================================
// components/SaveJobButton.js — Universal Bookmark / Save Job Button
// ExamUdaan | Seamlessly saves jobs to user's profile/dashboard
// ============================================================

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '../lib/apiClient'

export default function SaveJobButton({
  notificationId,
  initialSaved = false,
  variant = 'icon', // 'icon' | 'button'
  size = 'md',      // 'sm' | 'md' | 'lg'
  style = {},
  className = '',
  title = '',
}) {
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const numId = Number(notificationId)

  // Sync saved status from cache or event
  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('eu_access_token')
    setIsLoggedIn(Boolean(token))

    if (!token) return

    try {
      const cached = JSON.parse(localStorage.getItem('eu_saved_job_ids') || '[]')
      if (Array.isArray(cached) && cached.includes(numId)) {
        setIsSaved(true)
      }
    } catch {}

    function handleCacheUpdate(e) {
      if (e?.detail?.savedIds) {
        setIsSaved(e.detail.savedIds.includes(numId))
      }
    }

    window.addEventListener('eu_saved_jobs_changed', handleCacheUpdate)
    return () => window.removeEventListener('eu_saved_jobs_changed', handleCacheUpdate)
  }, [numId])

  async function handleToggle(e) {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('eu_access_token') : null
    if (!token) {
      // Prompt user to login with return redirect
      const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '/jobs'
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`)
      return
    }

    const nextState = !isSaved
    setIsSaved(nextState)
    setLoading(true)

    // Optimistically update localStorage cache
    try {
      let cached = JSON.parse(localStorage.getItem('eu_saved_job_ids') || '[]')
      if (!Array.isArray(cached)) cached = []
      if (nextState) {
        if (!cached.includes(numId)) cached.push(numId)
      } else {
        cached = cached.filter(id => id !== numId)
      }
      localStorage.setItem('eu_saved_job_ids', JSON.stringify(cached))
      window.dispatchEvent(new CustomEvent('eu_saved_jobs_changed', { detail: { savedIds: cached, id: numId, saved: nextState } }))
    } catch {}

    try {
      const refresh = localStorage.getItem('eu_refresh_token') || ''
      const headers = {
        Authorization: `Bearer ${token}`,
        'x-refresh-token': refresh,
        'Content-Type': 'application/json',
      }

      if (nextState) {
        // Save
        const res = await apiFetch('/api/user/saved-jobs', {
          method: 'POST',
          headers,
          body: JSON.stringify({ notification_id: numId }),
        })
        if (!res.ok) {
          // Revert on failure
          setIsSaved(false)
        }
      } else {
        // Unsave
        const res = await apiFetch(`/api/user/saved-jobs?notification_id=${numId}`, {
          method: 'DELETE',
          headers,
        })
        if (!res.ok) {
          // Revert on failure
          setIsSaved(true)
        }
      }
    } catch (err) {
      console.error('[SaveJobButton] Error saving job:', err)
      // Revert state
      setIsSaved(!nextState)
    } finally {
      setLoading(false)
    }
  }

  // ── Variant: Icon Only (for JobCard.js) ──
  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isSaved ? 'Remove from Saved Jobs' : 'Save Job to Profile'}
        title={isSaved ? 'Saved to your profile (click to remove)' : 'Save job to your profile'}
        style={{
          background: isSaved ? '#FFF7ED' : 'rgba(255, 255, 255, 0.9)',
          border: isSaved ? '1.5px solid #EA580C' : '1px solid #E5E7EB',
          borderRadius: '50%',
          width: size === 'sm' ? '30px' : '34px',
          height: size === 'sm' ? '30px' : '34px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isSaved ? '#EA580C' : '#6B7280',
          transition: 'all 0.15s ease',
          boxShadow: isSaved ? '0 2px 6px rgba(234, 88, 12, 0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
          zIndex: 2,
          padding: 0,
          ...style,
        }}
        className={className}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: size === 'sm' ? 16 : 18,
            fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
            color: isSaved ? '#EA580C' : 'inherit',
          }}
        >
          {isSaved ? 'bookmark' : 'bookmark_border'}
        </span>
      </button>
    )
  }

  // ── Variant: Full Action Button (for detail page / headers) ──
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isSaved ? 'Saved in My Profile' : 'Save Job to Profile'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '6px 12px' : '9px 18px',
        borderRadius: '999px',
        fontSize: size === 'sm' ? '12.5px' : '13.5px',
        fontWeight: 700,
        cursor: 'pointer',
        border: isSaved ? '1.5px solid #EA580C' : '1.5px solid #D1D5DB',
        background: isSaved ? '#FFF7ED' : '#FFFFFF',
        color: isSaved ? '#EA580C' : '#374151',
        boxShadow: isSaved ? '0 2px 8px rgba(234, 88, 12, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.15s ease',
        ...style,
      }}
      className={className}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: 18,
          fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
          color: isSaved ? '#EA580C' : '#6B7280',
        }}
      >
        {isSaved ? 'bookmark' : 'bookmark_border'}
      </span>
      <span>{isSaved ? 'Saved to Profile' : 'Save Job'}</span>
    </button>
  )
}
