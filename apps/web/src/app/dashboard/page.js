// ============================================================
// app/dashboard/page.js — Personalised User Dashboard
// ExamUdaan | Connects to real DB via API routes
//
// Sections:
//   - Overview:   profile stats (saved jobs, alert count)
//   - Saved Jobs: from /api/user/saved-jobs
//   - Criteria:   from /api/user/job-criteria
//   - Profile:    full edit form (name, gender, DOB, state, WhatsApp)
//   - Security:   set / change password
//   - Plan:       current plan + upgrade CTA
//   - Alerts:     manage alert subscriptions
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiFetch, createVerifyHash } from '../../lib/apiClient'
import s from './dashboard.module.css'

const SIDEBAR_ITEMS = [
  { id: 'overview',  label: 'Overview',         icon: 'dashboard' },
  { id: 'saved',     label: 'Saved Jobs',        icon: 'bookmark' },
  { id: 'criteria',  label: 'My Criteria',       icon: 'tune' },
  { id: 'alerts',    label: 'Alert Settings',    icon: 'notifications_active' },
  { id: 'profile',   label: 'Edit Profile',      icon: 'person' },
  { id: 'security',  label: 'Security',          icon: 'lock' },
  { id: 'plan',      label: 'Plan & Billing',    icon: 'workspace_premium' },
]

const SITE_THEMES = [
  {
    id: 'default',
    name: 'ExamUdaan Classic',
    tagline: 'Warm Saffron & Cream Canvas',
    desc: 'The original iconic design system of ExamUdaan. Saffron primary (#EA580C) paired with warm ivory background (#FFFBF5) and rich typography.',
    primaryColor: '#EA580C',
    bgColor: '#FFFBF5',
    cardBg: '#FFFFFF',
    accentColor: '#CC4900',
    textColor: '#1B1C1B',
    badge: 'Default Theme',
  },
  {
    id: 'electric-aurora',
    name: 'Electric Aurora',
    tagline: 'Midnight Slate & Neon Aurora Glow',
    desc: 'High-tech dark command center from Stitch dashboard. Midnight surface (#090D16), slate containers (#0F172A), vibrant electric orange (#F97316) & cyan (#38BDF8).',
    primaryColor: '#F97316',
    bgColor: '#090D16',
    cardBg: '#0F172A',
    accentColor: '#38BDF8',
    textColor: '#F8FAFC',
    badge: 'Dark Command Mode',
  },
  {
    id: 'emerald-amber',
    name: 'Emerald & Amber',
    tagline: 'Sage Canvas & Warm Amber Accents',
    desc: 'Fresh botanical & authoritative civic design variant. Emerald green (#059669) headers with warm amber (#EA580C) highlights and sage borders (#E3EBE1).',
    primaryColor: '#059669',
    bgColor: '#FAFAF9',
    cardBg: '#FFFFFF',
    accentColor: '#EA580C',
    textColor: '#0F172A',
    badge: 'Fresh Sage Mode',
  },
]

// ── Helper: Auth headers ──
function authHeaders(payload = null) {
  const token   = typeof window !== 'undefined' ? localStorage.getItem('eu_access_token') || '' : ''
  const refresh = typeof window !== 'undefined' ? localStorage.getItem('eu_refresh_token') || '' : ''
  const headers = {
    Authorization:    `Bearer ${token}`,
    'x-refresh-token': refresh,
    'Content-Type':   'application/json',
  }
  if (payload) {
    headers['x-verify'] = createVerifyHash(payload)
  }
  return headers
}

// ── Date format helper ──
function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Date of Birth helper for HTML5 date input (strict YYYY-MM-DD format) ──
function formatDob(val) {
  if (!val) return ''
  if (typeof val === 'string') {
    const match = val.match(/^\d{4}-\d{2}-\d{2}/)
    if (match) return match[0]
  }
  try {
    const d = new Date(val)
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }
  } catch {}
  return ''
}

const CRITERIA_QUALIFICATIONS = [
  { id: '10th',          label: '10th Pass' },
  { id: '12th',          label: '12th Pass' },
  { id: 'Graduate',      label: 'Graduate (Any Degree)' },
  { id: 'Postgraduate',  label: 'Post Graduate' },
  { id: 'Engineering',   label: 'Engineering / B.Tech' },
  { id: 'Diploma',       label: 'Diploma' },
  { id: 'ITI',           label: 'ITI' },
]

const CRITERIA_CATEGORIES = [
  { id: 'Police/Law Enforcement', label: 'Police & Defense' },
  { id: 'Administrative',         label: 'MPSC / State PSC' },
  { id: 'Railway',                label: 'Railway (RRB)' },
  { id: 'Banking',                label: 'Banking / IBPS' },
  { id: 'SSC',                    label: 'SSC / Central Govt' },
  { id: 'Teaching',               label: 'Teaching & Education' },
  { id: 'Engineering/Technical',  label: 'Technical / IT' },
  { id: 'Medical/Healthcare',     label: 'Medical & Health' },
  { id: 'Civil Services',         label: 'UPSC / Civil Services' },
]

const CRITERIA_STATES = [
  { id: 'Maharashtra',   label: 'Maharashtra' },
  { id: 'All India',     label: 'All India / Central' },
  { id: 'Delhi',         label: 'Delhi NCR' },
  { id: 'Karnataka',     label: 'Karnataka' },
  { id: 'Gujarat',       label: 'Gujarat' },
  { id: 'Madhya Pradesh', label: 'Madhya Pradesh' },
]

const CRITERIA_GOVT_LEVELS = ['All Levels', 'State', 'Central', 'PSU']

function toggleChip(list, setList, item) {
  if (list.includes(item)) {
    setList(list.filter(x => x !== item))
  } else {
    setList([...list, item])
  }
}

function parseDateParts(dateVal) {
  if (!dateVal) return null
  if (typeof dateVal === 'string') {
    const match = dateVal.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      return {
        year: parseInt(match[1], 10),
        month: parseInt(match[2], 10) - 1,
        day: parseInt(match[3], 10),
      }
    }
  }
  const d = new Date(dateVal)
  if (isNaN(d.getTime())) return null
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() }
}

function getDeadlineBadge(endDateStr) {
  const target = parseDateParts(endDateStr)
  if (!target) return null
  let nowYear, nowMonth, nowDay
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    const parts = formatter.format(new Date()).split('-').map(Number)
    nowYear = parts[0]
    nowMonth = parts[1] - 1
    nowDay = parts[2]
  } catch {
    const now = new Date()
    nowYear = now.getFullYear()
    nowMonth = now.getMonth()
    nowDay = now.getDate()
  }
  const targetUTC = Date.UTC(target.year, target.month, target.day)
  const nowUTC = Date.UTC(nowYear, nowMonth, nowDay)
  const diffDays = Math.round((targetUTC - nowUTC) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { text: 'Expired', color: '#6B7280', bg: '#F3F4F6' }
  }
  if (diffDays === 0) {
    return { text: 'Ends Today', color: '#DC2626', bg: '#FEE2E2' }
  }
  if (diffDays === 1) {
    return { text: 'Ends Tomorrow', color: '#EA580C', bg: '#FFEDD5' }
  }
  if (diffDays <= 5) {
    return { text: `${diffDays} days left`, color: '#D97706', bg: '#FEF3C7' }
  }
  return { text: `${diffDays} days left`, color: '#059669', bg: '#DCFCE7' }
}

function getMatchingJobsUrl(c) {
  const params = new URLSearchParams()
  if (c.keywords) params.set('q', c.keywords)
  if (Array.isArray(c.qualifications) && c.qualifications.length > 0) {
    const q = c.qualifications[0].toLowerCase()
    if (q.includes('grad')) params.set('qualification', 'graduate')
    else if (q.includes('10')) params.set('qualification', '10th')
    else if (q.includes('12')) params.set('qualification', '12th')
    else if (q.includes('diploma')) params.set('qualification', 'diploma')
    else if (q.includes('iti')) params.set('qualification', 'iti')
  }
  if (Array.isArray(c.states) && c.states.length > 0) {
    const st = c.states[0].toLowerCase()
    if (st.includes('maha')) params.set('state', 'maharashtra')
  }
  if (c.govt_level && c.govt_level !== 'All Levels') {
    params.set('govt_level', c.govt_level)
  }
  const qs = params.toString()
  return qs ? `/jobs?${qs}` : '/jobs'
}

export default function DashboardPage() {
  const router = useRouter()

  const [activeSection, setActiveSection] = useState('overview')
  const [user,          setUser]          = useState(null)
  const [savedJobs,     setSavedJobs]     = useState([])
  const [criteria,      setCriteria]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [siteStats,     setSiteStats]     = useState(null)

  // ── Criteria form state ──
  const [showCriteriaForm,       setShowCriteriaForm]       = useState(false)
  const [criteriaName,           setCriteriaName]           = useState('')
  const [criteriaQualifications, setCriteriaQualifications] = useState([])
  const [criteriaCategories,     setCriteriaCategories]     = useState([])
  const [criteriaStates,         setCriteriaStates]         = useState(['Maharashtra'])
  const [criteriaGovtLevel,      setCriteriaGovtLevel]      = useState('All Levels')
  const [criteriaKeywords,       setCriteriaKeywords]       = useState('')
  const [alertEmail,             setAlertEmail]             = useState(true)
  const [alertWhatsapp,          setAlertWhatsapp]          = useState(false)
  const [criteriaLoading,        setCriteriaLoading]        = useState(false)
  const [criteriaMsg,            setCriteriaMsg]            = useState({ type: '', text: '' })

  // Profile edit form state
  const [profileForm,    setProfileForm]    = useState({ first_name: '', last_name: '', gender: '', dob: '', state: '', whatsapp: '', language: 'en' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg,     setProfileMsg]     = useState({ type: '', text: '' })

  // Security form state (set-password + change-password)
  const [secForm,    setSecForm]    = useState({ current_password: '', new_password: '', confirm_password: '', password: '', cp_confirm: '' })
  const [secLoading, setSecLoading] = useState(false)
  const [secMsg,     setSecMsg]     = useState({ type: '', text: '' })

  // Theme state for admin theme switcher
  const [currentTheme, setCurrentTheme] = useState('default')
  const [themeMsg,     setThemeMsg]     = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('eu_theme') || 'default'
      setCurrentTheme(saved)
    } catch {}
  }, [])

  async function handleSwitchTheme(themeId) {
    setCurrentTheme(themeId)
    try {
      localStorage.setItem('eu_theme', themeId)
      if (themeId === 'default') {
        document.documentElement.removeAttribute('data-theme')
        document.documentElement.classList.remove('dark')
      } else {
        document.documentElement.setAttribute('data-theme', themeId)
        if (themeId === 'electric-aurora') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      const token = localStorage.getItem('eu_access_token') || ''
      if (token) {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ key: 'site_theme', value: themeId }),
        })
      }
      setThemeMsg({ ok: true, text: `Active theme switched to ${SITE_THEMES.find(t => t.id === themeId)?.name || themeId}` })
      setTimeout(() => setThemeMsg(null), 3500)
    } catch {
      setThemeMsg({ ok: true, text: 'Theme applied locally' })
      setTimeout(() => setThemeMsg(null), 3500)
    }
  }

  // Read URL ?s= param to deep-link to a section (from Navbar dropdown)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const secParam = params.get('s')
    if (secParam && (SIDEBAR_ITEMS.find(i => i.id === secParam) || secParam === 'admin_theme')) setActiveSection(secParam)
  }, [])

  // ── Redirect if not logged in & prefill local user state ──
  useEffect(() => {
    const token = localStorage.getItem('eu_access_token')
    if (!token) {
      router.replace('/login?redirect=/dashboard')
      return
    }

    // Immediately prefill from localStorage so UI is populated with user's name & email
    try {
      const rawUser = localStorage.getItem('eu_user')
      if (rawUser) {
        const u = JSON.parse(rawUser)
        setUser(u)
        setProfileForm({
          first_name: u.first_name || '',
          last_name:  u.last_name  || '',
          gender:     u.gender     || '',
          dob:        formatDob(u.dob),
          state:      u.state      || '',
          whatsapp:   u.whatsapp   || u.phone || '',
          language:   u.language   || 'en',
        })
      }
    } catch (e) {
      console.warn('[Dashboard] Could not parse local user:', e)
    }

    fetchAll()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      // Fetch profile + saved jobs + criteria in parallel
      const [profileRes, savedRes, criteriaRes] = await Promise.all([
        fetch('/api/user/profile',      { headers: authHeaders() }),
        fetch('/api/user/saved-jobs',   { headers: authHeaders() }),
        fetch('/api/user/job-criteria', { headers: authHeaders() }),
      ])

      if (profileRes.status === 401) {
        // Token expired and refresh failed → redirect to login
        localStorage.removeItem('eu_access_token')
        router.replace('/login?redirect=/dashboard')
        return
      }

      if (profileRes.ok) {
        const d = await profileRes.json()
        const p = d.data || {}
        setUser(p)
        // Pre-fill the profile edit form with current values
        setProfileForm(prev => ({
          first_name: p.first_name !== undefined && p.first_name !== '' ? p.first_name : prev.first_name,
          last_name:  p.last_name  !== undefined && p.last_name  !== '' ? p.last_name  : prev.last_name,
          gender:     p.gender     !== undefined && p.gender     !== '' ? p.gender     : prev.gender,
          dob:        formatDob(p.dob) || prev.dob,
          state:      p.state      !== undefined && p.state      !== '' ? p.state      : prev.state,
          whatsapp:   p.whatsapp   !== undefined && p.whatsapp   !== '' ? p.whatsapp   : (p.phone || prev.whatsapp),
          language:   p.language   || prev.language || 'en',
        }))

        // Sync back to localStorage so Navbar and other components see latest data
        try {
          const cached = JSON.parse(localStorage.getItem('eu_user') || '{}')
          localStorage.setItem('eu_user', JSON.stringify({ ...cached, ...p }))
          window.dispatchEvent(new Event('storage'))
        } catch {}
      }

      // Check if access token was auto-refreshed by withAuth
      const newToken = profileRes.headers.get('x-jwt-token')
      if (newToken) {
        localStorage.setItem('eu_access_token', newToken)
      }

      if (savedRes.ok) {
        const d = await savedRes.json()
        const jobs = d.data?.saved_jobs || []
        setSavedJobs(jobs)
        const ids = d.data?.saved_ids || jobs.map(j => j.notification_id).filter(Boolean)
        try {
          localStorage.setItem('eu_saved_job_ids', JSON.stringify(ids))
        } catch {}
      }
      if (criteriaRes.ok) {
        const d = await criteriaRes.json()
        setCriteria(d.data?.criteria || [])
      }

      // Fetch live dynamic site statistics
      fetch('/api/stats')
        .then(res => res.json())
        .then(d => { if (d.data) setSiteStats(d.data) })
        .catch(() => {})
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err)
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  // Listen for bookmark changes across tabs or other components
  useEffect(() => {
    function handleSavedChanged() {
      fetch('/api/user/saved-jobs', { headers: authHeaders() })
        .then(r => r.json())
        .then(d => {
          if (d.data?.saved_jobs) {
            setSavedJobs(d.data.saved_jobs)
          }
        })
        .catch(() => {})
    }
    window.addEventListener('eu_saved_jobs_changed', handleSavedChanged)
    return () => window.removeEventListener('eu_saved_jobs_changed', handleSavedChanged)
  }, [])

  async function removeSavedJob(trackerId, notificationId) {
    try {
      const url = trackerId ? `/api/user/saved-jobs?id=${trackerId}` : `/api/user/saved-jobs?notification_id=${notificationId}`
      const res = await apiFetch(url, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (res.ok) {
        setSavedJobs(prev => prev.filter(j => j.tracker_id !== trackerId && (!notificationId || j.notification_id !== notificationId)))
        try {
          const cached = JSON.parse(localStorage.getItem('eu_saved_job_ids') || '[]')
          if (Array.isArray(cached) && notificationId) {
            const updated = cached.filter(id => id !== Number(notificationId))
            localStorage.setItem('eu_saved_job_ids', JSON.stringify(updated))
            window.dispatchEvent(new CustomEvent('eu_saved_jobs_changed', { detail: { savedIds: updated, id: notificationId, saved: false } }))
          }
        } catch {}
      }
    } catch (err) {
      console.error('[Dashboard] Remove saved job error:', err)
    }
  }

  async function saveCriteria(e) {
    e.preventDefault()
    if (!criteriaName.trim()) {
      setCriteriaMsg({ type: 'error', text: 'Please enter a name for this criteria.' })
      return
    }
    setCriteriaLoading(true)
    setCriteriaMsg({ type: '', text: '' })
    try {
      const payload = {
        name:           criteriaName.trim(),
        qualifications: criteriaQualifications,
        categories:     criteriaCategories,
        states:         criteriaStates,
        govt_level:     criteriaGovtLevel === 'All Levels' ? null : criteriaGovtLevel,
        keywords:       criteriaKeywords.trim() || null,
        alert_email:    alertEmail,
        alert_whatsapp: alertWhatsapp,
      }
      const res = await apiFetch('/api/user/job-criteria', {
        method:  'POST',
        headers: authHeaders(payload),
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.data) {
        setCriteria(prev => [data.data, ...prev])
        setShowCriteriaForm(false)
        setCriteriaName('')
        setCriteriaQualifications([])
        setCriteriaCategories([])
        setCriteriaStates(['Maharashtra'])
        setCriteriaGovtLevel('All Levels')
        setCriteriaKeywords('')
        setAlertEmail(true)
        setAlertWhatsapp(false)
        setCriteriaMsg({ type: 'success', text: 'Job alert criteria created successfully!' })
        setTimeout(() => setCriteriaMsg({ type: '', text: '' }), 4000)
      } else {
        setCriteriaMsg({ type: 'error', text: data.message || 'Failed to save criteria.' })
      }
    } catch (err) {
      console.error('[Dashboard] Save criteria error:', err)
      setCriteriaMsg({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setCriteriaLoading(false)
    }
  }

  async function toggleCriteriaActive(id, currentActive) {
    try {
      const nextActive = !currentActive
      const payload = { is_active: nextActive }
      const res = await apiFetch(`/api/user/job-criteria?id=${id}`, {
        method:  'PUT',
        headers: authHeaders(payload),
        body:    JSON.stringify(payload),
      })
      if (res.ok) {
        setCriteria(prev => prev.map(c => c.id === id ? { ...c, is_active: nextActive } : c))
      }
    } catch (err) {
      console.error('[Dashboard] Toggle criteria error:', err)
    }
  }

  async function deleteCriteria(id) {
    try {
      const res = await apiFetch(`/api/user/job-criteria?id=${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (res.ok) {
        setCriteria(prev => prev.filter(c => c.id !== id))
      }
    } catch (err) {
      console.error('[Dashboard] Delete criteria error:', err)
    }
  }

  function handleLogout() {
    // Call the logout API to revoke server session
    const token   = localStorage.getItem('eu_access_token')  || ''
    const refresh = localStorage.getItem('eu_refresh_token') || ''
    apiFetch('/api/auth/logout', {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refresh_token: refresh }),
    }).catch(() => {}) // fire-and-forget; clear local state regardless
    localStorage.removeItem('eu_access_token')
    localStorage.removeItem('eu_refresh_token')
    localStorage.removeItem('eu_user')
    // Trigger storage event so Navbar updates
    window.dispatchEvent(new Event('storage'))
    router.push('/')
  }

  // ── Save profile changes ──
  async function handleProfileSave(e) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg({ type: '', text: '' })
    try {
      const res = await apiFetch('/api/user/profile', {
        method:  'PUT',
        headers: authHeaders(),
        body:    JSON.stringify(profileForm),
      })
      const data = await res.json()
      if (res.ok) {
        setProfileMsg({ type: 'success', text: 'Profile saved successfully!' })
        const normalizedDob = formatDob(data.data?.dob || profileForm.dob)
        const updatedProfile = { ...profileForm, dob: normalizedDob }
        setProfileForm(updatedProfile)
        setUser(prev => ({ ...prev, ...updatedProfile }))
        const stored = JSON.parse(localStorage.getItem('eu_user') || '{}')
        localStorage.setItem('eu_user', JSON.stringify({ ...stored, ...updatedProfile }))
        window.dispatchEvent(new Event('storage')) // refresh Navbar avatar
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Failed to save profile.' })
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Set password (first time) ──
  async function handleSetPassword(e) {
    e.preventDefault()
    setSecLoading(true)
    setSecMsg({ type: '', text: '' })
    try {
      const res = await apiFetch('/api/auth/set-password', {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ password: secForm.password, confirm_password: secForm.cp_confirm }),
      })
      const data = await res.json()
      if (res.ok) {
        setSecMsg({ type: 'success', text: 'Password set! You can now log in with your email and password.' })
        setUser(prev => ({ ...prev, has_password: true }))
        setSecForm(f => ({ ...f, password: '', cp_confirm: '' }))
      } else {
        setSecMsg({ type: 'error', text: data.message || 'Failed to set password.' })
      }
    } catch {
      setSecMsg({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSecLoading(false)
    }
  }

  // ── Change password ──
  async function handleChangePassword(e) {
    e.preventDefault()
    setSecLoading(true)
    setSecMsg({ type: '', text: '' })
    try {
      const res = await apiFetch('/api/auth/change-password', {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({
          current_password: secForm.current_password,
          new_password:     secForm.new_password,
          confirm_password: secForm.confirm_password,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSecMsg({ type: 'success', text: 'Password changed successfully!' })
        setSecForm({ current_password: '', new_password: '', confirm_password: '', password: '', cp_confirm: '' })
      } else {
        setSecMsg({ type: 'error', text: data.message || 'Failed to change password.' })
      }
    } catch {
      setSecMsg({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSecLoading(false)
    }
  }

  // ── Loading state ──
  if (loading) {
    return (
      <div className={s.loadingWrap}>
        <div className={s.loadingInner}>
          <div className={s.loadingSpinner} />
          <p className={s.loadingText}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Derive display name and contact details from state and stored user
  const _storedUser = (() => { try { return JSON.parse(localStorage.getItem('eu_user') || '{}') } catch { return {} } })()
  const fullName = [
    profileForm.first_name || user?.first_name || _storedUser?.first_name,
    profileForm.last_name  || user?.last_name  || _storedUser?.last_name,
  ].filter(Boolean).join(' ')
  const userName  = fullName || user?.name || _storedUser?.name || 'Aspirant'
  const userEmail = user?.email || _storedUser?.email || ''
  const userPhone = user?.phone || _storedUser?.phone || profileForm.whatsapp || ''

  return (
    <div className={`container ${s.pageWrap}`}>

      {/* ── Page title ── */}
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>My Dashboard</h1>
          <p className={s.pageSubtitle}>
            Welcome back, <strong>{userName}</strong>! Here&apos;s your job search summary.
          </p>
        </div>
        <button onClick={handleLogout} className={s.logoutBtn}>
          <span className={`material-symbols-outlined ${s.logoutIcon}`}>logout</span>
          Sign out
        </button>
      </div>

      {error && <div className={s.errorBanner}>{error}</div>}

      <div className="dashboard-layout">

        {/* ── Sidebar ── */}
        <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
          {/* Profile card */}
          <div className={s.sidebarProfileCard}>
            <div className={s.sidebarAvatar}>
              {user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar_url} alt={userName} className={s.sidebarAvatarImg} />
              ) : (
                <span className={`material-symbols-outlined ${s.sidebarAvatarIcon}`}>person</span>
              )}
            </div>
            <div className={s.sidebarUserInfo}>
              <div className={s.sidebarUserName}>{userName}</div>
              <div className={s.sidebarUserEmail}>{userEmail}</div>
              <div className={s.sidebarPlanBadge}>{user?.plan || 'Free'} Plan</div>
            </div>
          </div>

          {/* Nav items */}
          <div className="dashboard-nav-container">
            <nav className={s.sidebarNavList}>
              {SIDEBAR_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`dashboard-nav-btn ${s.sidebarNavBtn} ${activeSection === item.id ? s.sidebarNavBtnActive : ''}`}
                >
                  <span className={`material-symbols-outlined ${s.sidebarNavIcon}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Admin Management (ADMIN ONLY) */}
          {Boolean(user?.is_admin || user?.role === 'admin') && (
            <div className={s.adminSection}>
              <div className={s.adminLabel}><span>🛡️</span> Admin Suite</div>
              <button
                onClick={() => setActiveSection('admin_theme')}
                className={`${s.adminThemeNavBtn} ${activeSection === 'admin_theme' ? s.adminThemeNavBtnActive : ''}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#EA580C' }}>palette</span>
                <span className={s.flex1}>Theme & Appearance</span>
                <span className={s.adminBadge}>ADMIN</span>
              </button>
              <Link href="/admin" className={s.adminPanelLink}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#64748B' }}>admin_panel_settings</span>
                <span className={s.flex1}>Full Admin Panel</span>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#94A3B8' }}>arrow_forward</span>
              </Link>
            </div>
          )}

          {/* Quick study access: Question Papers & Keys */}
          <div className={s.quickAccessSection}>
            <Link href="/question-papers" className={s.quickAccessLink}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#EA580C' }}>description</span>
              <span className={s.flex1}>Question Papers & Keys</span>
              <span className={s.quickAccessBadge}>214+</span>
            </Link>
          </div>

          {/* Upgrade banner */}
          {user?.plan === 'free' && (
            <div className={s.upgradeBanner}>
              <div className={s.upgradeBannerTitle}>Upgrade to Pro</div>
              <div className={s.upgradeBannerDesc}>WhatsApp + Email alerts for ₹49/mo</div>
              <Link href="/pricing" className={s.upgradeBannerLink}>View Plans →</Link>
            </div>
          )}
        </aside>

        {/* ── Main Content ── */}
        <main className="dashboard-main">

          {/* ─── Overview ─── */}
          {activeSection === 'overview' && (
            <div className={s.colFlex}>
              {/* Admin Theme & Appearance Quick Panel (ADMIN ONLY) */}
              {Boolean(user?.is_admin || user?.role === 'admin') && (
                <div className={s.adminThemePanel}>
                  <div className={s.adminThemePanelHeader}>
                    <div className={s.adminThemePanelLeft}>
                      <span className="material-symbols-outlined" style={{ color: '#FB923C', fontSize: 24 }}>palette</span>
                      <strong style={{ fontSize: 16 }}>Admin Theme & Appearance</strong>
                      <span className={s.adminOnlyTag}>ADMIN ONLY</span>
                    </div>
                    <div className={s.adminThemePanelRight}>
                      <button onClick={() => setActiveSection('admin_theme')} className={s.adminThemeStudioBtn}>
                        Theme Studio
                      </button>
                      <Link href="/admin?tab=themes" className={s.adminPanelSmallLink}>
                        <span>Full Admin Panel</span>
                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                  <div className={s.themeGridSmall}>
                    {SITE_THEMES.map(th => {
                      const isCurrent = currentTheme === th.id
                      return (
                        <button
                          key={th.id}
                          onClick={() => handleSwitchTheme(th.id)}
                          className={`${s.themeCardSmall} ${isCurrent ? s.themeCardSmallActive : ''}`}
                        >
                          <div className={s.themeCardSmallRow}>
                            <span className={s.themeCardSmallName}>{th.name}</span>
                            <span className={s.themeColorDotSmall} style={{ background: th.primaryColor }} />
                          </div>
                          <span className={s.themeCardSmallTagline}>{th.tagline}</span>
                          {isCurrent && <span className={s.themeCardActiveText}>✓ Active Site Theme</span>}
                        </button>
                      )
                    })}
                  </div>
                  {themeMsg && <div className={s.themePanelMsg}>✓ {themeMsg.text}</div>}
                </div>
              )}

              {/* Stat Cards */}
              <div className={s.statCardsGrid}>
                {[
                  { id: 'saved',    icon: 'bookmark',           label: 'Saved Jobs',      value: savedJobs.length,       color: 'var(--primary)' },
                  { id: 'alerts',   icon: 'notifications',       label: 'Active Alerts',   value: user?.alert_count || 0, color: 'var(--primary)' },
                  { id: 'criteria', icon: 'tune',                label: 'My Criteria',     value: criteria.length,        color: '#0284c7' },
                  { id: 'plan',     icon: 'workspace_premium',   label: 'Plan',            value: user?.plan || 'Free',   color: '#d97706' },
                ].map(stat => (
                  <button key={stat.label} onClick={() => setActiveSection(stat.id)} className={s.statCard}>
                    <div className={s.statCardTop}>
                      <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: 24 }}>{stat.icon}</span>
                      <span className={`material-symbols-outlined ${s.statCardArrow}`}>arrow_forward</span>
                    </div>
                    <div className={s.statCardValue}>{stat.value}</div>
                    <div className={s.statCardLabel}>{stat.label}</div>
                  </button>
                ))}
              </div>

              {/* Platform Pulse & Daily Study Launchpad */}
              <div className={s.prepPulse}>
                <div className={s.prepPulseHeader}>
                  <div className={s.prepPulseLeft}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>bolt</span>
                    <strong style={{ fontSize: 15, color: 'var(--on-surface)' }}>ExamUdaan Prep Pulse</strong>
                    <span className={s.prepPulseLiveTag}>Live Platform Stats</span>
                  </div>
                  <Link href="/daily-quiz" className={s.prepPulseLink}>
                    <span>🔥 Start Today&apos;s 5-Min Quiz</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  </Link>
                </div>
                <div className={s.prepPulseGrid}>
                  <Link href="/jobs" className={s.pulseCard}>
                    <span className={s.pulseCardLabel}>Active Govt Jobs</span>
                    <strong className={s.pulseCardValue} style={{ color: 'var(--on-surface)' }}>{siteStats?.total_jobs || '575'}</strong>
                    <span className={s.pulseCardCta} style={{ color: 'var(--primary)' }}>Browse alerts →</span>
                  </Link>
                  <Link href="/career" className={s.pulseCard}>
                    <span className={s.pulseCardLabel}>Career Compass</span>
                    <strong className={s.pulseCardValue} style={{ color: '#ea580c' }}>{siteStats?.total_careers ? `${siteStats.total_careers}+ Paths` : '40+ Paths'}</strong>
                    <span className={s.pulseCardCta} style={{ color: '#ea580c' }}>Careers guide →</span>
                  </Link>
                  <Link href="/ai-tools" className={s.pulseCard}>
                    <span className={s.pulseCardLabel}>AI Study Tools</span>
                    <strong className={s.pulseCardValue} style={{ color: '#2563eb' }}>{siteStats?.total_ai_tools ? `${siteStats.total_ai_tools} Tools` : '84 Tools'}</strong>
                    <span className={s.pulseCardCta} style={{ color: '#2563eb' }}>Explore tools →</span>
                  </Link>
                  <Link href="/pyq" className={s.pulseCard}>
                    <span className={s.pulseCardLabel}>Solved PYQ Bank</span>
                    <strong className={s.pulseCardValue} style={{ color: '#16a34a' }}>{siteStats?.total_questions ? `${siteStats.total_questions}+ MCQs` : '1,100+ MCQs'}</strong>
                    <span className={s.pulseCardCta} style={{ color: '#16a34a' }}>15-Yr papers →</span>
                  </Link>
                  <Link href="/mock-tests" className={s.pulseCard}>
                    <span className={s.pulseCardLabel}>CBT Mock Tests</span>
                    <strong className={s.pulseCardValue} style={{ color: '#7c3aed' }}>{siteStats?.total_mock_tests ? `${siteStats.total_mock_tests} Tests` : '12 Tests'}</strong>
                    <span className={s.pulseCardCta} style={{ color: '#7c3aed' }}>TCS/MPSC tests →</span>
                  </Link>
                  <Link href="/question-papers" className={`${s.pulseCard} ${s.pulseCardHighlight}`}>
                    <span className={s.pulseCardHighlightLabel}>Question Papers</span>
                    <strong className={s.pulseCardValue} style={{ color: '#EA580C' }}>214+ PDFs</strong>
                    <span className={s.pulseCardCta} style={{ color: '#EA580C' }}>Papers & Keys →</span>
                  </Link>
                </div>
              </div>

              {/* ── Official MPSC Question Papers & Answer Keys Study Hub Banner ── */}
              <div className={s.featureBanner}>
                <div className={s.featureBannerLeft}>
                  <div className={s.featureBannerIcon}>
                    <span className="material-symbols-outlined" style={{ fontSize: 26 }}>description</span>
                  </div>
                  <div className={s.featureBannerBody}>
                    <div className={s.featureBannerTagRow}>
                      <span className={s.featureBannerNewTag}>NEW FEATURE</span>
                      <strong className={s.featureBannerTitle}>Official Previous Year Question Papers & Answer Keys</strong>
                    </div>
                    <p className={s.featureBannerDesc}>
                      214+ authentic original question papers & official final answer keys (2024–2026). Read directly in-browser with zero ads.
                    </p>
                  </div>
                </div>
                <div className={s.featureBannerActions}>
                  <Link href="/question-papers" className={s.featureBannerBtnPrimary}>
                    <span>Browse Question Papers</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  </Link>
                  <Link href="/syllabus/mpsc-combined" className={s.featureBannerBtnSecondary}>
                    <span>MPSC Combined Prelims</span>
                  </Link>
                </div>
              </div>

              {/* Recent Saved Jobs */}
              <div>
                <div className={s.sectionHeaderRow}>
                  <h3 className={s.sectionTitle}>Recently Saved Jobs ({savedJobs.length})</h3>
                  {savedJobs.length > 0 && (
                    <button onClick={() => setActiveSection('saved')} className={s.linkBtn}>
                      View all {savedJobs.length} saved jobs →
                    </button>
                  )}
                </div>
                {savedJobs.length === 0 ? (
                  <div className={s.emptyState}>
                    <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--outline-variant)' }}>bookmark_border</span>
                    <p style={{ color: 'var(--secondary)', marginTop: 8, fontSize: 14 }}>No saved jobs yet.</p>
                    <p className={s.emptyStateDescSm}>Click the bookmark icon on any job card or notification page to save it for later.</p>
                    <Link href="/jobs" className="btn-primary" style={{ display: 'inline-flex', padding: '8px 20px', textDecoration: 'none' }}>Browse Active Jobs</Link>
                  </div>
                ) : (
                  <div className={s.colFlexSm}>
                    {savedJobs.slice(0, 4).map(job => {
                      const deadline = getDeadlineBadge(job.apply_end_date)
                      return (
                        <div key={job.tracker_id} className={s.savedJobCardMini}>
                          <div className={s.savedJobCardBody}>
                            <div className={s.savedJobCardMeta}>
                              <span className={s.orgBadge}>{job.org_acronym || 'GOVT'}</span>
                              {job.total_vacancies > 0 && <span className={s.vacancyBadge}>{job.total_vacancies.toLocaleString()} Posts</span>}
                              {deadline && <span className={s.deadlineBadgeSm} style={{ color: deadline.color, background: deadline.bg }}>{deadline.text}</span>}
                            </div>
                            <Link href={`/jobs/${job.slug}`} className={s.savedJobTitleSm}>{job.title}</Link>
                          </div>
                          <div className={s.savedJobCardActions}>
                            <Link href={`/jobs/${job.slug}`} className="btn-outline" style={{ fontSize: 12, padding: '4px 10px', textDecoration: 'none' }}>View</Link>
                            <button onClick={() => removeSavedJob(job.tracker_id, job.notification_id)} title="Remove from saved" className={s.removeBtn}>
                              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* My Job Criteria Quick Preview */}
              <div>
                <div className={s.sectionHeaderRow}>
                  <h3 className={s.sectionTitle}>My Job Criteria ({criteria.length})</h3>
                  <div className={s.rowGap10}>
                    <button onClick={() => { setActiveSection('criteria'); setShowCriteriaForm(true) }} className="btn-primary" style={{ fontSize: 12, padding: '5px 12px' }}>+ New Criteria</button>
                    {criteria.length > 0 && <button onClick={() => setActiveSection('criteria')} className={s.linkBtn}>Manage →</button>}
                  </div>
                </div>
                {criteria.length === 0 ? (
                  <div className={s.emptyState}>
                    <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--outline-variant)' }}>tune</span>
                    <p style={{ color: 'var(--secondary)', marginTop: 6, fontSize: 13 }}>No criteria set up yet.</p>
                    <p className={s.emptyStateDescSm}>Configure your qualifications and preferred sectors to get alerts.</p>
                    <button onClick={() => { setActiveSection('criteria'); setShowCriteriaForm(true) }} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>Set Up Criteria</button>
                  </div>
                ) : (
                  <div className={s.criteriaPreviewGrid}>
                    {criteria.slice(0, 2).map(c => (
                      <div key={c.id} className={s.criteriaPreviewCard}>
                        <div className={s.rowBetween}>
                          <strong style={{ fontSize: 14, color: 'var(--on-surface)' }}>{c.name}</strong>
                          <span className={`${s.criteriaStatusBadge} ${c.is_active !== false ? s.criteriaStatusActive : s.criteriaStatusPaused}`}>
                            {c.is_active !== false ? 'Active' : 'Paused'}
                          </span>
                        </div>
                        <div className={s.criteriaPreviewChips}>
                          {(c.qualifications || []).slice(0, 2).map((q, idx) => <span key={idx} className={s.criteriaSmallChipQual}>🎓 {q}</span>)}
                          {(c.categories || []).slice(0, 2).map((cat, idx) => <span key={idx} className={s.criteriaSmallChipCat}>🏛️ {cat}</span>)}
                        </div>
                        <div className={s.criteriaPreviewFooter}>
                          <div style={{ fontSize: 11, color: 'var(--secondary)' }}>{c.alert_email && '📧 Email'} {c.alert_whatsapp && '💬 WhatsApp'}</div>
                          <Link href={getMatchingJobsUrl(c)} style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>Find Jobs →</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Saved Jobs ─── */}
          {activeSection === 'saved' && (
            <div>
              <div className={`${s.savedJobsHeader} ${s.rowBetweenWrap}`}>
                <div>
                  <h2 className={s.sectionTitle2}>Saved Jobs ({savedJobs.length})</h2>
                  <p className={s.sectionDesc}>Keep track of government vacancies you want to review and apply for before the deadline.</p>
                </div>
                <Link href="/jobs" className="btn-primary" style={{ fontSize: 13, padding: '7px 16px', textDecoration: 'none' }}>+ Browse More Jobs</Link>
              </div>

              {savedJobs.length === 0 ? (
                <div className={s.emptyStateDashed}>
                  <div className={`${s.emptyStateIconWrap} ${s.emptyStateIconWrapOrange}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 30 }}>bookmark_border</span>
                  </div>
                  <h3 className={s.emptyStateTitle}>No Saved Jobs Yet</h3>
                  <p className={s.emptyStateDesc}>When browsing notifications on ExamUdaan, click the bookmark icon on any card to save it here for fast access.</p>
                  <Link href="/jobs" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 22px', fontSize: 13 }}>Explore Active Govt Jobs</Link>
                </div>
              ) : (
                <div className={s.savedJobsList}>
                  {savedJobs.map(job => {
                    const deadline = getDeadlineBadge(job.apply_end_date)
                    return (
                      <div key={job.tracker_id} className={s.savedJobCard}>
                        <div className={s.rowBetweenWrap}>
                          <div className={s.rowStartWrap}>
                            <span className={s.orgBadgeFull}>{job.org_acronym || 'GOVT'}</span>
                            <span className={s.orgNameText}>{job.org_name}</span>
                            {job.total_vacancies > 0 && (
                              <span className={s.vacancyBadgeFull}>👥 {job.total_vacancies.toLocaleString()} Vacancies</span>
                            )}
                            {job.is_walk_in && <span className={s.walkInBadge}>🚶 Walk-in Interview</span>}
                          </div>
                          {deadline && (
                            <span className={s.deadlineBadge} style={{ background: deadline.bg, color: deadline.color }}>⏳ {deadline.text}</span>
                          )}
                        </div>

                        <div>
                          <Link href={`/jobs/${job.slug}`} className={s.savedJobTitle}>{job.title}</Link>
                        </div>

                        <div className={s.savedJobFooter}>
                          <div className={s.savedJobDateRow}>
                            {job.apply_end_date && <span>📅 Last Date: <strong>{fmtDate(job.apply_end_date)}</strong></span>}
                            <span>🔖 Saved on {fmtDate(job.saved_at)}</span>
                          </div>
                          <div className={s.savedJobActionRow}>
                            <Link href={`/jobs/${job.slug}`} className="btn-primary" style={{ fontSize: 12, padding: '6px 14px', textDecoration: 'none' }}>View &amp; Apply →</Link>
                            <button onClick={() => removeSavedJob(job.tracker_id, job.notification_id)} title="Remove job from saved list" className={s.removeBtn2}>
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── Job Criteria ─── */}
          {activeSection === 'criteria' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--on-surface)' }}>
                    My Job Criteria ({criteria.length})
                  </h2>
                  <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--secondary)' }}>
                    Define your education, sectors, and locations. ExamUdaan will alert you on Email and WhatsApp when matching vacancies are published.
                  </p>
                </div>
                <button
                  onClick={() => setShowCriteriaForm(v => !v)}
                  className="btn-primary"
                  style={{ fontSize: 13, padding: '7px 16px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showCriteriaForm ? 'close' : 'add'}</span>
                  <span>{showCriteriaForm ? 'Close Form' : 'New Criteria'}</span>
                </button>
              </div>

              {criteriaMsg.text && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 14,
                  background: criteriaMsg.type === 'error' ? '#FEE2E2' : '#DCFCE7',
                  color: criteriaMsg.type === 'error' ? '#991B1B' : '#166534',
                  border: `1px solid ${criteriaMsg.type === 'error' ? '#FCA5A5' : '#86EFAC'}`,
                }}>
                  {criteriaMsg.type === 'error' ? '⚠️ ' : '✓ '}
                  {criteriaMsg.text}
                </div>
              )}

              {/* Add / Create Criteria Form */}
              {showCriteriaForm && (
                <form onSubmit={saveCriteria} style={{
                  background: 'var(--surface-container-lowest)',
                  border: '1.5px solid var(--primary)',
                  borderRadius: 14,
                  padding: '20px',
                  marginBottom: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  boxShadow: '0 4px 18px rgba(234, 88, 12, 0.08)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>tune</span>
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--on-surface)' }}>
                        Create Smart Job Criteria & Alert
                      </h4>
                    </div>
                    <span style={{ fontSize: 11, background: '#FFF7ED', color: 'var(--primary)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                      Live Alert Matcher
                    </span>
                  </div>

                  {/* Criteria Name */}
                  <div className="input-group">
                    <label className="input-label" htmlFor="criteria-name" style={{ fontWeight: 700, fontSize: 13 }}>
                      Criteria Name <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      id="criteria-name"
                      className="form-input"
                      type="text"
                      placeholder='e.g. "Maharashtra Police Bharti", "Graduate Bank Jobs", "SSC Railway Prep"'
                      value={criteriaName}
                      onChange={e => setCriteriaName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Education Qualifications Multi-Select Chips */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: 13, marginBottom: 8, color: 'var(--on-surface)' }}>
                      Education Qualification (Select all that apply)
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {CRITERIA_QUALIFICATIONS.map(q => {
                        const isSelected = criteriaQualifications.includes(q.id)
                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => toggleChip(criteriaQualifications, setCriteriaQualifications, q.id)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 999,
                              fontSize: 12.5,
                              fontWeight: isSelected ? 700 : 500,
                              cursor: 'pointer',
                              background: isSelected ? 'var(--primary)' : 'var(--surface-container-lowest)',
                              color: isSelected ? '#FFFFFF' : 'var(--on-surface)',
                              border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--outline-variant)',
                              transition: 'all 0.15s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                          >
                            <span>{isSelected ? '✓' : '+'}</span>
                            <span>{q.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Job Categories / Sectors Multi-Select Chips */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: 13, marginBottom: 8, color: 'var(--on-surface)' }}>
                      Exam Category / Sector
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {CRITERIA_CATEGORIES.map(cat => {
                        const isSelected = criteriaCategories.includes(cat.id)
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleChip(criteriaCategories, setCriteriaCategories, cat.id)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 999,
                              fontSize: 12.5,
                              fontWeight: isSelected ? 700 : 500,
                              cursor: 'pointer',
                              background: isSelected ? '#0284c7' : 'var(--surface-container-lowest)',
                              color: isSelected ? '#FFFFFF' : 'var(--on-surface)',
                              border: isSelected ? '1.5px solid #0284c7' : '1px solid var(--outline-variant)',
                              transition: 'all 0.15s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                          >
                            <span>{isSelected ? '✓' : '+'}</span>
                            <span>{cat.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Preferred Location / States Multi-Select Chips */}
                  <div>
                    <label className={s.chipLabel}>Location / State</label>
                    <div className={s.chipGroup}>
                      {CRITERIA_STATES.map(st => {
                        const isSelected = criteriaStates.includes(st.id)
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => toggleChip(criteriaStates, setCriteriaStates, st.id)}
                            className={`${s.chip} ${s.chipGreen} ${isSelected ? s.chipActive : ''}`}
                          >
                            <span>{isSelected ? '✓' : '+'}</span>
                            <span>{st.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Govt Level Selector */}
                  <div>
                    <label className={s.chipLabel}>Govt Level</label>
                    <div className={s.chipGroup}>
                      {CRITERIA_GOVT_LEVELS.map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setCriteriaGovtLevel(lvl)}
                          className={`${s.govtLevelChip} ${criteriaGovtLevel === lvl ? s.govtLevelChipActive : ''}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Keywords Input */}
                  <div className="input-group">
                    <label className="input-label" htmlFor="criteria-keywords" style={{ fontWeight: 700, fontSize: 13 }}>
                      Keywords (optional)
                    </label>
                    <input
                      id="criteria-keywords"
                      className="form-input"
                      type="text"
                      placeholder='e.g. "constable, clerk, talathi, steno, assistant"'
                      value={criteriaKeywords}
                      onChange={e => setCriteriaKeywords(e.target.value)}
                    />
                    <span style={{ fontSize: 11.5, color: 'var(--secondary)', marginTop: 3 }}>
                      Separate multiple keywords with commas.
                    </span>
                  </div>

                  {/* Alert Delivery Channels */}
                  <div style={{
                    background: '#FFF7ED',
                    border: '1px solid #FED7AA',
                    borderRadius: 12,
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}>
                    <strong style={{ fontSize: 13, color: '#C2410C' }}>
                      ⚡ Instant & Daily Alert Notifications
                    </strong>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5, color: 'var(--on-surface)' }}>
                      <input
                        type="checkbox"
                        checked={alertEmail}
                        onChange={e => setAlertEmail(e.target.checked)}
                        style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
                      />
                      <span>📧 <strong>Email alerts:</strong> Send daily digest of matching vacancies to <em>{user?.email}</em></span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5, color: 'var(--on-surface)' }}>
                      <input
                        type="checkbox"
                        checked={alertWhatsapp}
                        onChange={e => setAlertWhatsapp(e.target.checked)}
                        style={{ width: 16, height: 16, accentColor: '#16a34a' }}
                      />
                      <span>💬 <strong>WhatsApp alerts:</strong> Send instant WhatsApp notifications to <em>{user?.whatsapp || user?.phone || 'registered number'}</em></span>
                    </label>
                  </div>

                  {/* Form Action Buttons */}
                  <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ fontSize: 13, padding: '9px 22px' }}
                      disabled={criteriaLoading}
                    >
                      {criteriaLoading ? 'Saving Criteria...' : 'Save Criteria & Activate Alerts'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCriteriaForm(false)}
                      className="btn-outline"
                      style={{ fontSize: 13, padding: '9px 18px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Criteria List */}
              {criteria.length === 0 && !showCriteriaForm ? (
                <div style={{
                  background: 'var(--surface-container-lowest)',
                  border: '1.5px dashed var(--outline-variant)',
                  borderRadius: 14,
                  padding: '48px 24px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 30 }}>tune</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)', margin: '0 0 6px' }}>
                    No Job Criteria Created Yet
                  </h3>
                  <p style={{ color: 'var(--secondary)', fontSize: 13, maxWidth: 440, margin: '0 auto 18px', lineHeight: 1.5 }}>
                    Save custom criteria to automatically get matching notifications on Email and WhatsApp as soon as government agencies release advertisements.
                  </p>
                  <button
                    onClick={() => setShowCriteriaForm(true)}
                    className="btn-primary"
                    style={{ padding: '10px 22px', fontSize: 13 }}
                  >
                    + Create Your First Criteria
                  </button>
                </div>
              ) : (
                <div className={s.colFlexLg}>
                  {criteria.map(c => {
                    const isActive = c.is_active !== false
                    return (
                    <div key={c.id} className={s.criteriaCard}>
                        {/* Criteria Header */}
                        <div className={s.criteriaCardHeader}>
                          <div>
                            <div className={s.criteriaCardTitleRow}>
                              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--on-surface)' }}>{c.name}</h3>
                              <span className={`${s.criteriaStatusBadge} ${isActive ? s.criteriaStatusActive : s.criteriaStatusPaused}`}>
                                {isActive ? '● Active Alerts' : '○ Paused'}
                              </span>
                            </div>
                            <span className={s.criteriaCardDate}>Created on {fmtDate(c.created_at)}</span>
                          </div>

                          <div className={s.criteriaCardActions}>
                            <button onClick={() => toggleCriteriaActive(c.id, isActive)} className={s.criteriaActionBtn} style={{ color: isActive ? '#D97706' : '#059669' }}>
                              {isActive ? 'Pause Alerts' : 'Resume Alerts'}
                            </button>
                            <button onClick={() => deleteCriteria(c.id)} title="Delete criteria" className={s.criteriaDeleteBtn}>
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Criteria Chips */}
                        <div className={s.criteriaChips}>
                          {(c.qualifications || []).map((q, idx) => (
                            <span key={idx} className={s.criteriaChipQual}>🎓 {q}</span>
                          ))}
                          {(c.categories || []).map((cat, idx) => (
                            <span key={idx} className={s.criteriaChipCat}>🏛️ {cat}</span>
                          ))}
                          {(c.states || []).map((st, idx) => (
                            <span key={idx} className={s.criteriaChipState}>📍 {st}</span>
                          ))}
                          {c.govt_level && (
                            <span className={s.criteriaChipGovt}>🏛️ {c.govt_level}</span>
                          )}
                          {c.keywords && (
                            <span className={s.criteriaChipKeyword}>🔍 Keywords: <em>{c.keywords}</em></span>
                          )}
                        </div>

                        {/* Criteria Footer Row */}
                        <div className={s.criteriaFooter}>
                          <div className={s.criteriaFooterMeta}>
                            <span className={s.criteriaAlertStatus}>
                              <span className="material-symbols-outlined" style={{ fontSize: 15, color: c.alert_email ? '#2563EB' : 'var(--outline-variant)' }}>{c.alert_email ? 'check_circle' : 'cancel'}</span>
                              <span>Email Alerts: {c.alert_email ? 'On' : 'Off'}</span>
                            </span>
                            <span className={s.criteriaAlertStatus}>
                              <span className="material-symbols-outlined" style={{ fontSize: 15, color: c.alert_whatsapp ? '#16A34A' : 'var(--outline-variant)' }}>{c.alert_whatsapp ? 'check_circle' : 'cancel'}</span>
                              <span>WhatsApp Alerts: {c.alert_whatsapp ? 'On' : 'Off'}</span>
                            </span>
                          </div>
                          <Link href={getMatchingJobsUrl(c)} className="btn-primary" style={{ fontSize: 12.5, padding: '6px 14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span>Find Matching Jobs</span>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── Alert Settings ─── */}
          {activeSection === 'alerts' && (
            <div>
              <h2 className={s.sectionTitle2} style={{ marginBottom: 16 }}>Alert Settings</h2>
              <div className={s.alertSettingsCard}>
                <p style={{ color: 'var(--secondary)', fontSize: 14, marginBottom: 16 }}>Configure how and when you receive job alerts. Upgrade to Pro for WhatsApp + SMS alerts.</p>
                <div className={s.colFlexLg}>
                  {[
                    { icon: 'mail',  label: 'Email Alerts',    desc: 'Daily digest of matching jobs', free: true },
                    { icon: 'chat',  label: 'WhatsApp Alerts', desc: 'Instant alerts on WhatsApp',    free: false },
                    { icon: 'sms',   label: 'SMS Alerts',      desc: 'Text alerts for urgent jobs',   free: false },
                  ].map(ch => (
                    <div key={ch.label} className={s.alertChannelRow}>
                      <div className={s.alertChannelRowLeft}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>{ch.icon}</span>
                        <div>
                          <div className={s.alertChannelName}>{ch.label}</div>
                          <div className={s.alertChannelDesc}>{ch.desc}</div>
                        </div>
                      </div>
                      {ch.free ? (
                        <span className={s.alertActiveBadge}>Active</span>
                      ) : (
                        <Link href="/pricing" className={s.alertUpgradeLink}>Upgrade →</Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──── Edit Profile ──── */}
          {activeSection === 'profile' && (
            <div>
              <h2 className={s.sectionTitle2} style={{ marginBottom: 4 }}>Edit Profile</h2>
              <p className={s.sectionDesc} style={{ marginBottom: 20 }}>Keep your profile up to date for personalised job alerts.</p>
              {profileMsg.text && (
                <div className={`${s.msgBannerProfile} ${profileMsg.type === 'success' ? s.msgBannerProfileSuccess : s.msgBannerProfileError}`}>{profileMsg.text}</div>
              )}
              <form onSubmit={handleProfileSave} className={s.profileForm}>
                <div className={s.formGrid2}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="pf-first">First Name</label>
                    <input id="pf-first" className="form-input" type="text" placeholder="Rahul"
                      value={profileForm.first_name} onChange={e => setProfileForm(f => ({ ...f, first_name: e.target.value }))} />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="pf-last">Last Name</label>
                    <input id="pf-last" className="form-input" type="text" placeholder="Sharma"
                      value={profileForm.last_name} onChange={e => setProfileForm(f => ({ ...f, last_name: e.target.value }))} />
                  </div>
                </div>
                <div className={s.formGrid2}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="pf-gender">Gender</label>
                    <select id="pf-gender" className="form-input" value={profileForm.gender} onChange={e => setProfileForm(f => ({ ...f, gender: e.target.value }))}>
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="pf-dob">Date of Birth</label>
                    <input id="pf-dob" className="form-input" type="date" value={profileForm.dob} onChange={e => setProfileForm(f => ({ ...f, dob: e.target.value }))} />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="pf-state">State / UT</label>
                  <select id="pf-state" className="form-input" value={profileForm.state} onChange={e => setProfileForm(f => ({ ...f, state: e.target.value }))}>
                    <option value="">Select state...</option>
                    {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'].map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="pf-whatsapp">WhatsApp Number (for alerts)</label>
                  <div className="phone-input-wrap">
                    <span className="phone-prefix">+91</span>
                    <input id="pf-whatsapp" className="form-input" type="tel" placeholder="10-digit number" maxLength={10}
                      value={profileForm.whatsapp} onChange={e => setProfileForm(f => ({ ...f, whatsapp: e.target.value }))} />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="pf-lang">Preferred Language</label>
                  <select id="pf-lang" className="form-input" value={profileForm.language} onChange={e => setProfileForm(f => ({ ...f, language: e.target.value }))}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                  </select>
                </div>
                <div className={s.formGrid2}>
                  <div className="input-group">
                    <label className="input-label">Email (read-only)</label>
                    <input className={`form-input ${s.inputDisabled}`} type="text" value={userEmail || '—'} disabled />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone (read-only)</label>
                    <input className={`form-input ${s.inputDisabled}`} type="text" value={userPhone || 'Not linked'} disabled />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 28px', opacity: profileLoading ? 0.7 : 1 }} disabled={profileLoading}>
                  {profileLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          )}

          {/* ──── Security & Password ──── */}
          {activeSection === 'security' && (
            <div>
              <h2 className={s.sectionTitle2} style={{ marginBottom: 4 }}>Security &amp; Password</h2>
              <p className={s.sectionDesc} style={{ marginBottom: 20 }}>
                {user?.has_password ? 'Change your password below.' : 'Set a password to log in with your email and password.'}
              </p>
              {secMsg.text && (
                <div className={`${s.msgBannerProfile} ${secMsg.type === 'success' ? s.msgBannerProfileSuccess : s.msgBannerProfileError}`}>{secMsg.text}</div>
              )}
              <div className={s.securityMethodCard}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>
                  {user?.auth_provider === 'google' ? 'account_circle' : 'mail'}
                </span>
                <div>
                  <div className={s.securityMethodTitle}>{user?.auth_provider === 'google' ? 'Signed in with Google' : 'Signed in with OTP'}</div>
                  <div className={s.securityMethodDesc}>{user?.has_password ? 'Password is set — you can also log in with email + password.' : 'No password set yet.'}</div>
                </div>
              </div>
              {!user?.has_password && (
                <div className={s.securityFormCard}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Set a Password</h3>
                  <form onSubmit={handleSetPassword} className={s.colFlexLg}>
                    <div className="input-group">
                      <label className="input-label" htmlFor="sec-np">New Password (min 8 characters)</label>
                      <input id="sec-np" className="form-input" type="password" placeholder="Enter new password"
                        value={secForm.password} onChange={e => setSecForm(f => ({ ...f, password: e.target.value }))} required />
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="sec-cp">Confirm Password</label>
                      <input id="sec-cp" className="form-input" type="password" placeholder="Repeat password"
                        value={secForm.cp_confirm} onChange={e => setSecForm(f => ({ ...f, cp_confirm: e.target.value }))} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px', opacity: secLoading ? 0.7 : 1 }} disabled={secLoading}>
                      {secLoading ? 'Setting...' : 'Set Password'}
                    </button>
                  </form>
                </div>
              )}
              {user?.has_password && (
                <div className={s.securityFormCard}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Change Password</h3>
                  <form onSubmit={handleChangePassword} className={s.colFlexLg}>
                    <div className="input-group">
                      <label className="input-label" htmlFor="sec-curp">Current Password</label>
                      <input id="sec-curp" className="form-input" type="password" placeholder="Your current password"
                        value={secForm.current_password} onChange={e => setSecForm(f => ({ ...f, current_password: e.target.value }))} required />
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="sec-newp">New Password (min 8 characters)</label>
                      <input id="sec-newp" className="form-input" type="password" placeholder="New password"
                        value={secForm.new_password} onChange={e => setSecForm(f => ({ ...f, new_password: e.target.value }))} required />
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="sec-conf">Confirm New Password</label>
                      <input id="sec-conf" className="form-input" type="password" placeholder="Repeat new password"
                        value={secForm.confirm_password} onChange={e => setSecForm(f => ({ ...f, confirm_password: e.target.value }))} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px', opacity: secLoading ? 0.7 : 1 }} disabled={secLoading}>
                      {secLoading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ──── Plan & Billing ──── */}
          {activeSection === 'plan' && (
            <div>
              <h2 className={s.sectionTitle2} style={{ marginBottom: 4 }}>Plan &amp; Billing</h2>
              <p className={s.sectionDesc} style={{ marginBottom: 20 }}>Your current plan and upgrade options.</p>
              <div className={`${s.planCard} ${user?.plan !== 'free' ? s.planCardPremium : ''}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 36, color: user?.plan === 'free' ? 'var(--secondary)' : '#d97706' }}>workspace_premium</span>
                <div>
                  <div className={`${s.planName} ${user?.plan !== 'free' ? s.planNamePremium : ''}`}>{user?.plan || 'Free'} Plan</div>
                  {user?.plan_expiry && <div className={s.planExpiry}>Valid until: {fmtDate(user.plan_expiry)}</div>}
                  {user?.plan === 'free' && <div className={s.planExpiry}>Free plan — email alerts only</div>}
                </div>
              </div>
              {user?.plan === 'free' && (
                <div className={s.upgradePanel}>
                  <div className={s.upgradePanelTitle}>Upgrade for More Alerts</div>
                  <div className={s.upgradePanelDesc}>Get WhatsApp + SMS alerts, unlimited criteria, and priority notifications.</div>
                  <div className={s.upgradePlanGrid}>
                    {[{ plan: 'Basic', price: '₹29/mo', desc: 'Email + WhatsApp' }, { plan: 'Smart', price: '₹49/mo', desc: '+ SMS alerts' }, { plan: 'Pro', price: '₹99/mo', desc: 'Everything + Priority' }].map(p => (
                      <Link key={p.plan} href="/pricing" className={s.upgradePlanCard}>
                        <div className={s.upgradePlanName}>{p.plan}</div>
                        <div className={s.upgradePlanPrice}>{p.price}</div>
                        <div className={s.upgradePlanDesc}>{p.desc}</div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/pricing" className={s.upgradePlanViewAll}>View All Plans →</Link>
                </div>
              )}
              <div className={s.planIncludesCard}>
                <div className={s.planIncludesTitle}>Your Plan Includes:</div>
                {[
                  { icon: 'check_circle', text: 'Access to all job listings', active: true },
                  { icon: 'check_circle', text: 'Email job alerts', active: true },
                  { icon: 'check_circle', text: 'Save unlimited jobs', active: true },
                  { icon: user?.plan !== 'free' ? 'check_circle' : 'cancel', text: 'WhatsApp alerts', active: user?.plan !== 'free' },
                  { icon: ['smart','pro'].includes(user?.plan) ? 'check_circle' : 'cancel', text: 'SMS alerts', active: ['smart','pro'].includes(user?.plan) },
                  { icon: user?.plan === 'pro' ? 'check_circle' : 'cancel', text: 'Priority notifications', active: user?.plan === 'pro' },
                ].map(b => (
                  <div key={b.text} className={s.planBenefitRow}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: b.active ? '#16a34a' : '#d1d5db' }}>{b.icon}</span>
                    <span style={{ color: b.active ? 'var(--on-surface)' : 'var(--secondary)' }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* ─── Admin Theme & Appearance Studio (Admin Only) ─── */}
          {activeSection === 'admin_theme' && (
            <div>
              <div className={s.adminThemeStudioHeader}>
                <div>
                  <div className={s.adminPrivilegeBadge}>
                    <span>🛡️</span> SYSTEM ADMINISTRATOR PRIVILEGE
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--on-surface)' }}>
                    Site Theme &amp; Appearance
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--secondary)' }}>
                    Select the active color theme and appearance mode for ExamUdaan. Changes take effect across the entire portal immediately.
                  </p>
                </div>

                <Link href="/admin" className={s.adminPanelBtn}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>admin_panel_settings</span>
                  <span>Open Full Admin Panel →</span>
                </Link>
              </div>

              {themeMsg && (
                <div className={s.themeSuccessMsg}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
                  <span>{themeMsg.text}</span>
                </div>
              )}

              <div className={s.themeGrid}>
                {SITE_THEMES.map(th => {
                  const isCurrent = currentTheme === th.id
                  return (
                    <div
                      key={th.id}
                      onClick={() => handleSwitchTheme(th.id)}
                      className={`${s.themeCard} ${isCurrent ? s.themeCardActive : ''}`}
                      style={isCurrent ? { borderColor: th.primaryColor, boxShadow: `0 8px 24px rgba(0,0,0,0.08)` } : {}}
                    >
                      <div>
                        <div className={s.themeCardHeader}>
                          <div>
                            <span className={s.themeCardBadge} style={{ color: th.primaryColor }}>{th.badge}</span>
                            <h3 className={s.themeCardName}>{th.name}</h3>
                            <div className={s.themeCardTagline}>{th.tagline}</div>
                          </div>
                          <span className={s.themeColorDot} style={{ background: th.primaryColor }} />
                        </div>
                        <p className={s.themeCardDesc}>{th.desc}</p>
                      </div>

                      {/* Swatch palette */}
                      <div>
                        <div className={s.themeSwatches}>
                          <span title="Primary" className={s.themeSwatch} style={{ background: th.primaryColor }} />
                          <span title="Background" className={s.themeSwatch} style={{ background: th.bgColor, border: '1px solid #D1D5DB' }} />
                          <span title="Card" className={s.themeSwatch} style={{ background: th.cardBg, border: '1px solid #D1D5DB' }} />
                          <span title="Accent" className={s.themeSwatch} style={{ background: th.accentColor }} />
                        </div>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handleSwitchTheme(th.id); }}
                          className={s.themeApplyBtn}
                          style={{ background: isCurrent ? th.primaryColor : 'var(--surface-container-low)', color: isCurrent ? '#FFFFFF' : 'var(--on-surface)' }}
                        >
                          {isCurrent ? '✓ Active Site Theme' : 'Apply Theme'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
