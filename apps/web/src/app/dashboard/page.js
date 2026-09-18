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

const SIDEBAR_ITEMS = [
  { id: 'overview',  label: 'Overview',         icon: 'dashboard' },
  { id: 'saved',     label: 'Saved Jobs',        icon: 'bookmark' },
  { id: 'criteria',  label: 'My Criteria',       icon: 'tune' },
  { id: 'alerts',    label: 'Alert Settings',    icon: 'notifications_active' },
  { id: 'profile',   label: 'Edit Profile',      icon: 'person' },
  { id: 'security',  label: 'Security',          icon: 'lock' },
  { id: 'plan',      label: 'Plan & Billing',    icon: 'workspace_premium' },
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

export default function DashboardPage() {
  const router = useRouter()

  const [activeSection, setActiveSection] = useState('overview')
  const [user,          setUser]          = useState(null)
  const [savedJobs,     setSavedJobs]     = useState([])
  const [criteria,      setCriteria]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')

  // ── Criteria form state ──
  const [showCriteriaForm, setShowCriteriaForm] = useState(false)
  const [criteriaName,     setCriteriaName]     = useState('')
  const [criteriaKeywords, setCriteriaKeywords] = useState('')
  const [alertEmail,       setAlertEmail]       = useState(false)
  const [criteriaLoading,  setCriteriaLoading]  = useState(false)

  // Profile edit form state
  const [profileForm,    setProfileForm]    = useState({ first_name: '', last_name: '', gender: '', dob: '', state: '', whatsapp: '', language: 'en' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg,     setProfileMsg]     = useState({ type: '', text: '' })

  // Security form state (set-password + change-password)
  const [secForm,    setSecForm]    = useState({ current_password: '', new_password: '', confirm_password: '', password: '', cp_confirm: '' })
  const [secLoading, setSecLoading] = useState(false)
  const [secMsg,     setSecMsg]     = useState({ type: '', text: '' })

  // Read URL ?s= param to deep-link to a section (from Navbar dropdown)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const s = params.get('s')
    if (s && SIDEBAR_ITEMS.find(i => i.id === s)) setActiveSection(s)
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
          dob:        u.dob ? String(u.dob).slice(0, 10) : '',
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
          dob:        p.dob ? String(p.dob).slice(0, 10) : prev.dob,
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
        setSavedJobs(d.data?.saved_jobs || [])
      }
      if (criteriaRes.ok) {
        const d = await criteriaRes.json()
        setCriteria(d.data?.criteria || [])
      }
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err)
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  async function removeSavedJob(trackerId) {
    try {
      const res = await apiFetch(`/api/user/saved-jobs?id=${trackerId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (res.ok) {
        setSavedJobs(prev => prev.filter(j => j.tracker_id !== trackerId))
      }
    } catch (err) {
      console.error('[Dashboard] Remove saved job error:', err)
    }
  }

  async function saveCriteria(e) {
    e.preventDefault()
    setCriteriaLoading(true)
    try {
      const res = await apiFetch('/api/user/job-criteria', {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({
          name:        criteriaName || 'My Criteria',
          keywords:    criteriaKeywords || null,
          alert_email: alertEmail,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setCriteria(prev => [data.data, ...prev])
        setShowCriteriaForm(false)
        setCriteriaName('')
        setCriteriaKeywords('')
        setAlertEmail(false)
      }
    } catch (err) {
      console.error('[Dashboard] Save criteria error:', err)
    } finally {
      setCriteriaLoading(false)
    }
  }

  async function deleteCriteria(id) {
    try {
      await apiFetch(`/api/user/job-criteria?id=${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      setCriteria(prev => prev.filter(c => c.id !== id))
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
        // Update user state and localStorage user data
        setUser(prev => ({ ...prev, ...profileForm }))
        const stored = JSON.parse(localStorage.getItem('eu_user') || '{}')
        localStorage.setItem('eu_user', JSON.stringify({ ...stored, ...profileForm }))
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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40,
            border: '4px solid var(--outline-variant)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          <p style={{ color: 'var(--secondary)', fontSize: 14 }}>Loading your dashboard...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
    <div className="container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>

      {/* ── Page title ── */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--on-surface)', margin: 0 }}>My Dashboard</h1>
          <p style={{ fontSize: 14, color: 'var(--secondary)', marginTop: 4 }}>
            Welcome back, <strong>{userName}</strong>! Here&apos;s your job search summary.
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: '1px solid var(--outline-variant)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 13, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
          Sign out
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 14 }}>
          {error}
        </div>
      )}

      <div className="dashboard-layout">

        {/* ── Sidebar ── */}
        <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
          {/* Profile card */}
          <div style={{
            background: 'var(--surface-container-lowest)',
            border: '1px solid var(--outline-variant)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px',
          }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: '50%',
              background: 'var(--primary-fixed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
            }}>
              {user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar_url} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 26 }}>person</span>
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userName}
              </div>
              <div style={{ fontSize: 12, color: 'var(--secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userEmail}
              </div>
              <div style={{ fontSize: 11, marginTop: 2, background: 'var(--primary-fixed)', color: 'var(--primary)', padding: '1px 6px', borderRadius: 99, display: 'inline-block', fontWeight: 700 }}>
                {user?.plan || 'Free'} Plan
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {SIDEBAR_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: activeSection === item.id ? 'var(--primary-fixed)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: activeSection === item.id ? 700 : 500,
                  fontSize: 14,
                  color: activeSection === item.id ? 'var(--primary)' : 'var(--on-surface)',
                  transition: 'background 0.15s',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Upgrade banner */}
          {user?.plan === 'free' && (
            <div style={{
              marginTop: 16,
              background: 'linear-gradient(135deg, #a33900, #EA580C)',
              borderRadius: 12,
              padding: '14px 16px',
              color: '#fff',
            }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 12, opacity: 0.85, margin: '4px 0 10px' }}>
                WhatsApp + Email alerts for ₹49/mo
              </div>
              <Link
                href="/pricing"
                style={{ background: '#fff', color: '#a33900', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}
              >
                View Plans →
              </Link>
            </div>
          )}
        </aside>

        {/* ── Main Content ── */}
        <main className="dashboard-main">

          {/* ─── Overview ─── */}
          {activeSection === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                {[
                  { icon: 'bookmark',           label: 'Saved Jobs',      value: savedJobs.length,       color: 'var(--primary)' },
                  { icon: 'notifications',       label: 'Active Alerts',   value: user?.alert_count || 0, color: 'var(--primary)' },
                  { icon: 'tune',                label: 'My Criteria',     value: criteria.length,        color: '#0284c7' },
                  { icon: 'workspace_premium',   label: 'Plan',            value: user?.plan || 'Free',   color: '#d97706' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 12,
                    padding: '16px',
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: 24 }}>{stat.icon}</span>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--on-surface)' }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Saved Jobs */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px', color: 'var(--on-surface)' }}>
                  Recently Saved Jobs
                </h3>
                {savedJobs.length === 0 ? (
                  <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: '24px', textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--outline-variant)' }}>bookmark_border</span>
                    <p style={{ color: 'var(--secondary)', marginTop: 8, fontSize: 14 }}>No saved jobs yet.</p>
                    <Link href="/jobs" className="btn-primary" style={{ marginTop: 12, display: 'inline-flex', padding: '8px 20px', textDecoration: 'none' }}>
                      Browse Jobs
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {savedJobs.slice(0, 5).map(job => (
                      <div key={job.tracker_id} style={{
                        background: 'var(--surface-container-lowest)',
                        border: '1px solid var(--outline-variant)',
                        borderRadius: 10,
                        padding: '12px 14px',
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link href={`/jobs/${job.slug}`} style={{ fontWeight: 600, fontSize: 14, color: 'var(--on-surface)', textDecoration: 'none' }}>
                            {job.title}
                          </Link>
                          <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>
                            {job.org_acronym} · Deadline: {fmtDate(job.apply_end_date)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeSavedJob(job.tracker_id)}
                          title="Remove from saved"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                        </button>
                      </div>
                    ))}
                    {savedJobs.length > 5 && (
                      <button onClick={() => setActiveSection('saved')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                        View all {savedJobs.length} saved jobs →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Saved Jobs ─── */}
          {activeSection === 'saved' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--on-surface)' }}>
                  Saved Jobs ({savedJobs.length})
                </h2>
                <Link href="/jobs" className="btn-outline" style={{ fontSize: 13, padding: '6px 14px', textDecoration: 'none' }}>
                  + Browse More
                </Link>
              </div>

              {savedJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--secondary)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>bookmark_border</span>
                  No saved jobs yet. Browse jobs and click the bookmark icon to save them here.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {savedJobs.map(job => (
                    <div key={job.tracker_id} style={{
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      borderRadius: 12,
                      padding: '14px 16px',
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                            padding: '2px 6px', borderRadius: 99,
                            background: '#FFF7ED', color: 'var(--primary)',
                          }}>
                            {job.notification_type}
                          </span>
                          {job.total_vacancies && (
                            <span style={{ fontSize: 12, color: 'var(--secondary)' }}>
                              {job.total_vacancies} vacancies
                            </span>
                          )}
                        </div>
                        <Link href={`/jobs/${job.slug}`} style={{ fontWeight: 700, fontSize: 14, color: 'var(--on-surface)', textDecoration: 'none', display: 'block' }}>
                          {job.title}
                        </Link>
                        <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 4, display: 'flex', gap: 12 }}>
                          <span>{job.org_name}</span>
                          {job.apply_end_date && <span>· Deadline: {fmtDate(job.apply_end_date)}</span>}
                          <span>· Saved: {fmtDate(job.saved_at)}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/jobs/${job.slug}`} className="btn-outline" style={{ fontSize: 12, padding: '5px 12px', textDecoration: 'none' }}>
                          View
                        </Link>
                        <button
                          onClick={() => removeSavedJob(job.tracker_id)}
                          title="Remove"
                          style={{ background: 'none', border: '1px solid var(--outline-variant)', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', color: '#dc2626', fontSize: 12 }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── Job Criteria ─── */}
          {activeSection === 'criteria' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--on-surface)' }}>
                  My Job Criteria
                </h2>
                <button
                  onClick={() => setShowCriteriaForm(v => !v)}
                  className="btn-primary"
                  style={{ fontSize: 13, padding: '7px 16px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                  New Criteria
                </button>
              </div>

              {/* Add Criteria Form */}
              {showCriteriaForm && (
                <form onSubmit={saveCriteria} style={{
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--primary)',
                  borderRadius: 12,
                  padding: '16px',
                  marginBottom: 16,
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>Add New Criteria</h4>
                  <div className="input-group">
                    <label className="input-label" htmlFor="criteria-name">Criteria Name</label>
                    <input id="criteria-name" className="form-input" type="text" placeholder='e.g. "Police Jobs Pune"' value={criteriaName} onChange={e => setCriteriaName(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="criteria-keywords">Keywords (optional)</label>
                    <input id="criteria-keywords" className="form-input" type="text" placeholder='e.g. "constable, clerk, talathi"' value={criteriaKeywords} onChange={e => setCriteriaKeywords(e.target.value)} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'var(--on-surface)' }}>
                    <input type="checkbox" checked={alertEmail} onChange={e => setAlertEmail(e.target.checked)} />
                    Email me when matching jobs are found
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" className="btn-primary" style={{ fontSize: 13, padding: '8px 18px' }} disabled={criteriaLoading}>
                      {criteriaLoading ? 'Saving...' : 'Save Criteria'}
                    </button>
                    <button type="button" onClick={() => setShowCriteriaForm(false)} className="btn-outline" style={{ fontSize: 13, padding: '8px 18px' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {criteria.length === 0 && !showCriteriaForm ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--secondary)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>tune</span>
                  No saved criteria yet. Create one to get personalised job alerts!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {criteria.map(c => (
                    <div key={c.id} style={{
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      borderRadius: 12,
                      padding: '14px 16px',
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--on-surface)' }}>{c.name}</div>
                        {c.keywords && <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 3 }}>Keywords: {c.keywords}</div>}
                        <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>
                          {c.alert_email && <span style={{ background: '#eff6ff', color: '#2563eb', padding: '1px 6px', borderRadius: 99, fontWeight: 600 }}>📧 Email alerts</span>}
                          {c.alert_whatsapp && <span style={{ marginLeft: 4, background: '#f0fdf4', color: '#16a34a', padding: '1px 6px', borderRadius: 99, fontWeight: 600 }}>💬 WhatsApp</span>}
                        </div>
                      </div>
                      <button onClick={() => deleteCriteria(c.id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── Alert Settings ─── */}
          {activeSection === 'alerts' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: 'var(--on-surface)' }}>Alert Settings</h2>
              <div style={{
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 12,
                padding: '20px',
              }}>
                <p style={{ color: 'var(--secondary)', fontSize: 14, marginBottom: 16 }}>
                  Configure how and when you receive job alerts. Upgrade to Pro for WhatsApp + SMS alerts.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { icon: 'mail',      label: 'Email Alerts',     desc: 'Daily digest of matching jobs', free: true },
                    { icon: 'chat',      label: 'WhatsApp Alerts',  desc: 'Instant alerts on WhatsApp',    free: false },
                    { icon: 'sms',       label: 'SMS Alerts',       desc: 'Text alerts for urgent jobs',   free: false },
                  ].map(ch => (
                    <div key={ch.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--outline-variant)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>{ch.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--on-surface)' }}>{ch.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{ch.desc}</div>
                        </div>
                      </div>
                      {ch.free ? (
                        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>Active</span>
                      ) : (
                        <Link href="/pricing" style={{ background: '#FFF7ED', color: 'var(--primary)', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                          Upgrade →
                        </Link>
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
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: 'var(--on-surface)' }}>Edit Profile</h2>
              <p style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 20 }}>Keep your profile up to date for personalised job alerts.</p>
              {profileMsg.text && (
                <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14,
                  background: profileMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  border: profileMsg.type === 'success' ? '1px solid #86efac' : '1px solid #fca5a5',
                  color:  profileMsg.type === 'success' ? '#16a34a' : '#dc2626' }}>
                  {profileMsg.text}
                </div>
              )}
              <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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
                    {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'].map(s => (
                      <option key={s} value={s}>{s}</option>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="input-group">
                    <label className="input-label">Email (read-only)</label>
                    <input
                      className="form-input"
                      type="text"
                      value={userEmail || '—'}
                      disabled
                      style={{ opacity: 0.75, background: 'var(--surface-container-low, #f8fafc)', cursor: 'not-allowed', fontWeight: 500 }}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone (read-only)</label>
                    <input
                      className="form-input"
                      type="text"
                      value={userPhone || 'Not linked'}
                      disabled
                      style={{ opacity: 0.75, background: 'var(--surface-container-low, #f8fafc)', cursor: 'not-allowed', fontWeight: 500 }}
                    />
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
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: 'var(--on-surface)' }}>Security &amp; Password</h2>
              <p style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 20 }}>
                {user?.has_password ? 'Change your password below.' : 'Set a password to log in with your email and password.'}
              </p>
              {secMsg.text && (
                <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14,
                  background: secMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  border: secMsg.type === 'success' ? '1px solid #86efac' : '1px solid #fca5a5',
                  color:  secMsg.type === 'success' ? '#16a34a' : '#dc2626' }}>
                  {secMsg.text}
                </div>
              )}
              <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>
                  {user?.auth_provider === 'google' ? 'account_circle' : 'mail'}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.auth_provider === 'google' ? 'Signed in with Google' : 'Signed in with OTP'}</div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)' }}>
                    {user?.has_password ? 'Password is set — you can also log in with email + password.' : 'No password set yet.'}
                  </div>
                </div>
              </div>
              {!user?.has_password && (
                <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Set a Password</h3>
                  <form onSubmit={handleSetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: '20px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Change Password</h3>
                  <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: 'var(--on-surface)' }}>Plan &amp; Billing</h2>
              <p style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 20 }}>Your current plan and upgrade options.</p>
              <div style={{ background: user?.plan === 'free' ? 'var(--surface-container-lowest)' : 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '1px solid var(--outline-variant)', borderRadius: 14, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 36, color: user?.plan === 'free' ? 'var(--secondary)' : '#d97706' }}>workspace_premium</span>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, textTransform: 'capitalize', color: user?.plan === 'free' ? 'var(--on-surface)' : '#92400e' }}>{user?.plan || 'Free'} Plan</div>
                  {user?.plan_expiry && <div style={{ fontSize: 13, color: 'var(--secondary)', marginTop: 2 }}>Valid until: {fmtDate(user.plan_expiry)}</div>}
                  {user?.plan === 'free' && <div style={{ fontSize: 13, color: 'var(--secondary)', marginTop: 2 }}>Free plan — email alerts only</div>}
                </div>
              </div>
              {user?.plan === 'free' && (
                <div style={{ background: 'linear-gradient(135deg, #a33900, #EA580C)', borderRadius: 14, padding: '24px', color: '#fff', marginBottom: 20 }}>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Upgrade for More Alerts</div>
                  <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 16 }}>Get WhatsApp + SMS alerts, unlimited criteria, and priority notifications.</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                    {[{ plan: 'Basic', price: '₹29/mo', desc: 'Email + WhatsApp' }, { plan: 'Smart', price: '₹49/mo', desc: '+ SMS alerts' }, { plan: 'Pro', price: '₹99/mo', desc: 'Everything + Priority' }].map(p => (
                      <Link key={p.plan} href="/pricing" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '10px 16px', textDecoration: 'none', color: '#fff' }}>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{p.plan}</div>
                        <div style={{ fontSize: 13 }}>{p.price}</div>
                        <div style={{ fontSize: 11, opacity: 0.8 }}>{p.desc}</div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/pricing" style={{ display: 'inline-flex', background: '#fff', color: 'var(--primary)', textDecoration: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
                    View All Plans →
                  </Link>
                </div>
              )}
              <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Your Plan Includes:</div>
                {[
                  { icon: 'check_circle', text: 'Access to all job listings', active: true },
                  { icon: 'check_circle', text: 'Email job alerts', active: true },
                  { icon: 'check_circle', text: 'Save unlimited jobs', active: true },
                  { icon: user?.plan !== 'free' ? 'check_circle' : 'cancel', text: 'WhatsApp alerts', active: user?.plan !== 'free' },
                  { icon: ['smart','pro'].includes(user?.plan) ? 'check_circle' : 'cancel', text: 'SMS alerts', active: ['smart','pro'].includes(user?.plan) },
                  { icon: user?.plan === 'pro' ? 'check_circle' : 'cancel', text: 'Priority notifications', active: user?.plan === 'pro' },
                ].map(b => (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--outline-variant)', fontSize: 14 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: b.active ? '#16a34a' : '#d1d5db' }}>{b.icon}</span>
                    <span style={{ color: b.active ? 'var(--on-surface)' : 'var(--secondary)' }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          

          {/* Alerts Section */}
          {activeSection === 'alerts' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: 'var(--on-surface)' }}>Alert Settings</h2>
              <div style={{
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 12,
                padding: '20px',
              }}>
                <p style={{ color: 'var(--secondary)', fontSize: 14, marginBottom: 16 }}>
                  Configure how and when you receive job alerts. Upgrade to Pro for WhatsApp + SMS alerts.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { icon: 'mail',      label: 'Email Alerts',     desc: 'Daily digest of matching jobs', free: true },
                    { icon: 'chat',      label: 'WhatsApp Alerts',  desc: 'Instant alerts on WhatsApp',    free: false },
                    { icon: 'sms',       label: 'SMS Alerts',       desc: 'Text alerts for urgent jobs',   free: false },
                  ].map(ch => (
                    <div key={ch.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--outline-variant)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>{ch.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--on-surface)' }}>{ch.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{ch.desc}</div>
                        </div>
                      </div>
                      {ch.free ? (
                        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>Active</span>
                      ) : (
                        <Link href="/pricing" style={{ background: '#FFF7ED', color: 'var(--primary)', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                          Upgrade ?
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
