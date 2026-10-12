'use client'

// ============================================================
// components/SaveJobButton.js — Universal Bookmark / Save Job Button
// ExamUdaan | Seamlessly saves jobs to user's profile/dashboard
// ============================================================

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '../lib/apiClient'
import styles from './saveJobButton.module.css'

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
    const iconBtnClass = [
      styles.iconBtn,
      size === 'sm' ? styles.iconBtnSm : '',
      isSaved ? styles.iconBtnSaved : '',
      className,
    ].filter(Boolean).join(' ')

    const iconClass = [
      'material-symbols-outlined',
      styles.icon,
      size === 'sm' ? styles.iconSm : '',
      isSaved ? styles.iconSaved : '',
    ].filter(Boolean).join(' ')

    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isSaved ? 'Remove from Saved Jobs' : 'Save Job to Profile'}
        title={isSaved ? 'Saved to your profile (click to remove)' : 'Save job to your profile'}
        className={iconBtnClass}
      >
        <span className={iconClass} aria-hidden="true">
          {isSaved ? 'bookmark' : 'bookmark_border'}
        </span>
      </button>
    )
  }

  // ── Variant: Full Action Button (for detail page / headers) ──
  const actionBtnClass = [
    styles.actionBtn,
    size === 'sm' ? styles.actionBtnSm : '',
    isSaved ? styles.actionBtnSaved : '',
    className,
  ].filter(Boolean).join(' ')

  const actionIconClass = [
    'material-symbols-outlined',
    styles.icon,
    isSaved ? styles.iconSaved : '',
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isSaved ? 'Saved in My Profile' : 'Save Job to Profile'}
      className={actionBtnClass}
    >
      <span className={actionIconClass}>
        {isSaved ? 'bookmark' : 'bookmark_border'}
      </span>
      <span>{isSaved ? 'Saved to Profile' : 'Save Job'}</span>
    </button>
  )
}
