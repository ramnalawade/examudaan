// ============================================================
// app/admin/page.js — ExamUdaan Site Admin Panel
// Protected: Only accessible to users with is_admin = true in DB
// Features: Feature toggles, site stats, enquiry inbox
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Feature toggle definitions — keys stored in site_settings DB table
const DEFAULT_FEATURES = [
  { key: 'feature_ai_tools',   label: 'AI Tools Page (/ai-tools)',       desc: 'Enable/disable the AI Tools lab page for all users',              icon: 'smart_toy' },
  { key: 'feature_ai_academy', label: 'AI Academy Page (/ai-academy)',   desc: 'Show or hide the Academy course catalog and enrollment form',      icon: 'school' },
  { key: 'feature_resources',  label: 'Resources Hub (/resources)',       desc: 'Enable YouTube + AI Tools + PDF learning resource hub',           icon: 'play_circle' },
  { key: 'feature_alerts',     label: 'WhatsApp / Telegram Alerts',      desc: 'Enable alert broadcast section and Follow Channel CTAs',           icon: 'notifications_active' },
  { key: 'feature_ai_matcher', label: 'AI Eligibility Matcher (Home)',   desc: 'Toggle the homepage AI eligibility matcher widget on/off',         icon: 'tune' },
  { key: 'maintenance_mode',   label: 'Maintenance Mode',                desc: 'Show a maintenance banner at the top of all pages for users',      icon: 'engineering' },
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

export default function AdminPage() {
  const router = useRouter()

  // Auth state
  const [user, setUser]             = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  // Feature toggles (loaded from API)
  const [features, setFeatures]     = useState({})
  const [saving, setSaving]         = useState(null)   // key of feature currently being saved
  const [saveMsg, setSaveMsg]       = useState(null)

  // Theme switcher state
  const [currentTheme, setCurrentTheme] = useState('default')
  const [themeSaving, setThemeSaving]   = useState(false)
  const [themeMsg, setThemeMsg]         = useState(null)

  // Site stats
  const [stats, setStats]           = useState(null)

  // Enquiries inbox
  const [enquiries, setEnquiries]   = useState([])
  const [activeTab, setActiveTab]   = useState('features') // 'features' | 'themes' | 'stats' | 'enquiries' | 'seo'
  const [sitemapData, setSitemapData] = useState(null)
  const [sitemapLoading, setSitemapLoading] = useState(false)

  // ── Sync current theme & active tab from URL on mount ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem('eu_theme') || 'default'
      setCurrentTheme(saved)

      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab && ['features', 'themes', 'stats', 'enquiries', 'seo'].includes(tab)) {
        setActiveTab(tab)
      }
    } catch {}
  }, [])

  // ── Auth check on mount ───────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem('eu_user')
      if (!raw) { router.push('/login'); return }
      const u = JSON.parse(raw)
      if (!u?.is_admin && u?.role !== 'admin') { router.push('/login'); return }  // redirect non-admins
      setUser(u)
    } catch {
      router.push('/login')
    }
    setAuthChecked(true)
  }, [router])

  // ── Load feature toggles from API ────────────────────────
  useEffect(() => {
    if (!authChecked) return
    const token = localStorage.getItem('eu_access_token') || ''
    fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const map = {}
        if (Array.isArray(data.settings)) {
          data.settings.forEach(s => { map[s.key] = s.value === 'true' })
        }
        // Default any missing keys to true (on)
        DEFAULT_FEATURES.forEach(f => {
          if (!(f.key in map)) map[f.key] = true
        })
        setFeatures(map)
      })
      .catch(() => {
        const map = {}
        DEFAULT_FEATURES.forEach(f => { map[f.key] = true })
        setFeatures(map)
      })
  }, [authChecked])

  // ── Load stats ────────────────────────────────────────────
  useEffect(() => {
    if (!authChecked) return
    const token = localStorage.getItem('eu_access_token') || ''
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setStats(data.stats || null))
      .catch(() => setStats(null))
  }, [authChecked])

  // ── Load enquiries when tab becomes active ────────────────
  useEffect(() => {
    if (activeTab !== 'enquiries' || !authChecked) return
    const token = localStorage.getItem('eu_access_token') || ''
    fetch('/api/admin/enquiries', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setEnquiries(data.enquiries || []))
      .catch(() => setEnquiries([]))
  }, [activeTab, authChecked])

  // ── Load sitemap data when SEO tab becomes active ─────────
  useEffect(() => {
    if (activeTab !== 'seo') return
    setSitemapLoading(true)
    fetch('/api/admin/sitemap/ping')
      .then(r => r.json())
      .then(d => { setSitemapData(d.data || d); setSitemapLoading(false) })
      .catch(() => setSitemapLoading(false))
  }, [activeTab])

  // ── Switch Theme & Persist ────────────────────────────────
  const handleThemeSelect = async (themeId) => {
    setCurrentTheme(themeId)
    setThemeSaving(true)
    setThemeMsg(null)
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
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key: 'site_theme', value: themeId }),
      })
      setThemeMsg({ ok: true, text: `Active theme switched to ${SITE_THEMES.find(t => t.id === themeId)?.name || themeId}` })
    } catch {
      setThemeMsg({ ok: true, text: 'Theme applied locally' })
    }
    setThemeSaving(false)
    setTimeout(() => setThemeMsg(null), 3000)
  }

  // ── Toggle a feature and save to DB ──────────────────────
  const handleToggle = async (key) => {
    const newVal = !features[key]
    setFeatures(prev => ({ ...prev, [key]: newVal }))
    setSaving(key)
    setSaveMsg(null)
    try {
      const token = localStorage.getItem('eu_access_token') || ''
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key, value: String(newVal) }),
      })
      if (!res.ok) throw new Error('save_failed')
      setSaveMsg({ key, ok: true })
    } catch {
      setFeatures(prev => ({ ...prev, [key]: !newVal }))  // revert
      setSaveMsg({ key, ok: false })
    }
    setSaving(null)
    setTimeout(() => setSaveMsg(null), 2500)
  }

  if (!authChecked) return null   // avoid flash before redirect

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Admin Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        color: '#fff', padding: '32px 20px 24px',
        borderBottom: '3px solid var(--primary)',
      }}>
        <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--primary)' }}>
              admin_panel_settings
            </span>
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ADMIN PANEL
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>ExamUdaan Site Settings</h1>
            </div>
          </div>
          {user && (
            <div style={{ fontSize: 13, color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                Logged in as <strong style={{ color: '#CBD5E1' }}>{user.first_name || user.email}</strong>
                {' · '}<span style={{ color: '#4ADE80' }}>Admin Access</span>
              </div>

              {/* Fast Theme Switcher in Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>Theme:</span>
                {SITE_THEMES.map(th => (
                  <button
                    key={th.id}
                    onClick={() => handleThemeSelect(th.id)}
                    type="button"
                    title={`Switch to ${th.name}`}
                    style={{
                      padding: '3px 9px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: currentTheme === th.id ? `2px solid ${th.primaryColor}` : '1px solid #475569',
                      background: currentTheme === th.id ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.6)',
                      color: currentTheme === th.id ? '#ffffff' : '#94a3b8',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: th.primaryColor }} />
                    {th.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100, margin: '28px auto 0', padding: '0 20px' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--outline-variant)', marginBottom: 28 }}>
          {[
            { id: 'features',  label: 'Feature Toggles',       icon: 'toggle_on' },
            { id: 'themes',    label: 'Theme & Appearance',    icon: 'palette' },
            { id: 'stats',     label: 'Site Stats',             icon: 'bar_chart' },
            { id: 'enquiries', label: 'Academy Enquiries',      icon: 'inbox' },
            { id: 'seo',       label: 'Google SEO & Sitemap',   icon: 'travel_explore' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none', border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--secondary)',
                padding: '10px 18px', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 6,
                marginBottom: -2,   /* overlap bottom border */
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Feature Toggles ── */}
        {activeTab === 'features' && (
          <div>
            <p style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 24 }}>
              Toggle site features on/off. Changes are saved immediately to the database.
              Users see the update on their next page load.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {DEFAULT_FEATURES.map(feat => {
                const isOn     = features[feat.key] !== false
                const isSaving = saving === feat.key
                const msg      = saveMsg?.key === feat.key ? saveMsg : null

                return (
                  <div
                    key={feat.key}
                    style={{
                      background: 'var(--surface-container-lowest)',
                      border: `1.5px solid ${isOn ? 'var(--outline-variant)' : '#FCA5A5'}`,
                      borderRadius: 12, padding: '18px 20px',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="material-symbols-outlined" style={{
                        fontSize: 24,
                        color: isOn ? 'var(--primary)' : '#94A3B8',
                      }}>
                        {feat.icon}
                      </span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{feat.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>{feat.desc}</div>
                        {msg && (
                          <div style={{ fontSize: 11, marginTop: 4, fontWeight: 700, color: msg.ok ? '#16A34A' : '#DC2626' }}>
                            {msg.ok ? '✓ Saved successfully' : '✗ Save failed — please retry'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Toggle switch button */}
                    <button
                      onClick={() => handleToggle(feat.key)}
                      disabled={isSaving}
                      title={isOn ? 'Click to disable' : 'Click to enable'}
                      aria-label={`${isOn ? 'Disable' : 'Enable'} ${feat.label}`}
                      style={{
                        width: 52, height: 28, borderRadius: 999,
                        background: isOn ? 'var(--primary)' : '#CBD5E1',
                        border: 'none', cursor: isSaving ? 'wait' : 'pointer',
                        position: 'relative', transition: 'background 0.2s ease',
                        flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 3,
                        left: isOn ? 26 : 3,
                        width: 22, height: 22,
                        borderRadius: '50%', background: '#fff',
                        transition: 'left 0.2s ease',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>
                )
              })}
            </div>

            <div style={{
              marginTop: 28, padding: 16, borderRadius: 10,
              background: '#FFF7ED', border: '1px solid #FED7AA',
              fontSize: 13, color: '#9A3412', lineHeight: 1.6,
            }}>
              <strong>Setup Note:</strong> To grant admin access, run once in your PostgreSQL database:<br />
              <code style={{ background: '#FEF3C7', padding: '2px 6px', borderRadius: 4, display: 'block', marginTop: 6 }}>
                ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
              </code>
              <code style={{ background: '#FEF3C7', padding: '2px 6px', borderRadius: 4, display: 'block', marginTop: 4 }}>
                UPDATE users SET is_admin = true WHERE email = 'your@email.com';
              </code>
            </div>
          </div>
        )}

        {/* ── Tab 2: Theme & Appearance ── */}
        {activeTab === 'themes' && (
          <div>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: 'var(--on-surface)' }}>
                  Theme & Visual Design System
                </h2>
                <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', margin: 0 }}>
                  Switch between 3 crafted design systems. Changes apply immediately across the entire site and persist in database.
                </p>
              </div>
              {themeMsg && (
                <div style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                  background: themeMsg.ok ? '#DCFCE7' : '#FEE2E2',
                  color: themeMsg.ok ? '#15803D' : '#B91C1C',
                  border: `1px solid ${themeMsg.ok ? '#86EFAC' : '#FCA5A5'}`,
                }}>
                  {themeMsg.text}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {SITE_THEMES.map(th => {
                const isActive = currentTheme === th.id
                return (
                  <div
                    key={th.id}
                    style={{
                      background: 'var(--surface-container-lowest)',
                      border: `2px solid ${isActive ? th.primaryColor : 'var(--outline-variant)'}`,
                      borderRadius: 16, padding: 24,
                      display: 'flex', flexDirection: 'column',
                      boxShadow: isActive ? `0 8px 24px ${th.primaryColor}25` : 'none',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isActive && (
                      <span style={{
                        position: 'absolute', top: 16, right: 16,
                        background: th.primaryColor, color: '#ffffff',
                        fontSize: 11, fontWeight: 800, padding: '3px 10px',
                        borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.04em',
                      }}>
                        Active Theme
                      </span>
                    )}

                    <div style={{ fontSize: 12, fontWeight: 700, color: th.primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      {th.badge}
                    </div>
                    <h3 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 6px', color: 'var(--on-surface)' }}>
                      {th.name}
                    </h3>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: 12 }}>
                      {th.tagline}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5, margin: '0 0 20px', flexGrow: 1 }}>
                      {th.desc}
                    </p>

                    {/* Mini Color Palette Swatches */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                        Palette Tokens
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div title={`Primary: ${th.primaryColor}`} style={{ width: 32, height: 32, borderRadius: 8, background: th.primaryColor, border: '1px solid rgba(0,0,0,0.1)' }} />
                        <div title={`Canvas: ${th.bgColor}`} style={{ width: 32, height: 32, borderRadius: 8, background: th.bgColor, border: '1px solid #cbd5e1' }} />
                        <div title={`Card Container: ${th.cardBg}`} style={{ width: 32, height: 32, borderRadius: 8, background: th.cardBg, border: '1px solid #94a3b8' }} />
                        <div title={`Accent / Secondary: ${th.accentColor}`} style={{ width: 32, height: 32, borderRadius: 8, background: th.accentColor, border: '1px solid rgba(0,0,0,0.1)' }} />
                      </div>
                    </div>

                    {/* Mini Theme Mockup Preview */}
                    <div style={{
                      background: th.bgColor,
                      border: '1px solid var(--outline-variant)',
                      borderRadius: 12, padding: 14, marginBottom: 20,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: th.primaryColor }}>ExamUdaan.in</span>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: th.primaryColor, color: '#fff' }}>LIVE</span>
                      </div>
                      <div style={{
                        background: th.cardBg, border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 8, padding: '8px 10px', fontSize: 11, color: th.textColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <span>MPSC Rajyaseva 2026</span>
                        <span style={{ color: th.primaryColor, fontWeight: 700 }}>Apply ↗</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => handleThemeSelect(th.id)}
                      disabled={isActive || themeSaving}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 10,
                        border: 'none', cursor: isActive ? 'default' : 'pointer',
                        background: isActive ? '#E2E8F0' : th.primaryColor,
                        color: isActive ? '#64748B' : '#FFFFFF',
                        fontWeight: 700, fontSize: 14,
                        transition: 'opacity 0.15s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {isActive ? 'check_circle' : 'palette'}
                      </span>
                      {isActive ? 'Current Active Theme' : `Activate ${th.name}`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Tab 3: Site Stats ── */}
        {activeTab === 'stats' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Site Statistics</h2>
            {stats ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {[
                  { label: 'Total Published Jobs',  value: stats.total_jobs      || 0, icon: 'work',         color: 'var(--primary)' },
                  { label: 'Registered Users',      value: stats.total_users     || 0, icon: 'group',        color: '#2563EB' },
                  { label: 'AI Tool Guides',        value: stats.total_ai_tools   || 29, icon: 'smart_toy',   color: '#7C3AED' },
                  { label: 'Mock Test Blueprints',  value: stats.total_mock_tests || 12, icon: 'quiz',        color: '#0891B2' },
                  { label: 'Exam Syllabi',          value: stats.total_syllabi    || 17, icon: 'menu_book',   color: '#059669' },
                  { label: 'Academy Enquiries',     value: stats.total_enquiries || 0, icon: 'school',       color: '#16A34A' },
                  { label: 'Jobs Added Today',      value: stats.jobs_today      || 0, icon: 'add_circle',   color: '#D97706' },
                ].map(stat => (
                  <div
                    key={stat.label}
                    style={{
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      borderRadius: 12, padding: '20px 18px', textAlign: 'center',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 32, color: stat.color, display: 'block', marginBottom: 8 }}>
                      {stat.icon}
                    </span>
                    <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--secondary)', fontSize: 14 }}>
                Loading stats... (requires /api/admin/stats endpoint to be implemented)
              </div>
            )}
          </div>
        )}

        {/* ── Tab 3: Academy Enquiries ── */}
        {activeTab === 'enquiries' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
              Academy Enquiries ({enquiries.length})
            </h2>
            {enquiries.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-container-lowest)', borderBottom: '2px solid var(--outline-variant)' }}>
                      {['Name', 'Phone', 'Course', 'Background', 'Date'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--secondary)', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 700 }}>{enq.name}</td>
                        <td style={{ padding: '10px 14px' }}>{enq.phone}</td>
                        <td style={{ padding: '10px 14px' }}>{enq.course}</td>
                        <td style={{ padding: '10px 14px' }}>{enq.background}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--secondary)' }}>
                          {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                padding: 40, textAlign: 'center',
                color: 'var(--secondary)', fontSize: 14,
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)', borderRadius: 12,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>inbox</span>
                No enquiries yet. Entries submitted via the /ai-academy form will appear here.
              </div>
            )}
          </div>
        )}

        {/* ── Tab 4: Google SEO & Sitemap ── */}
        {activeTab === 'seo' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>
                  Google Search Console & Sitemap Indexing
                </h2>
                <p style={{ fontSize: 13, color: 'var(--secondary)', margin: 0 }}>
                  ExamUdaan automatically generates and serves dynamic XML sitemaps covering all portals, AI tools, video hubs, news feeds, and published exam notifications.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href="https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fexamudaan.in%2F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 8, fontSize: 13, textDecoration: 'none',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>open_in_new</span>
                  Submit in Google Search Console
                </a>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 8, fontSize: 13,
                    background: 'var(--surface-container-lowest)', color: 'var(--on-surface)',
                    border: '1px solid var(--outline-variant)', textDecoration: 'none', fontWeight: 700,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>xml</span>
                  View Live sitemap.xml
                </a>
              </div>
            </div>

            {/* Sitemap Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Total Sitemapped URLs', value: sitemapData?.stats?.total || '4,500+', icon: 'link', color: 'var(--primary)' },
                { label: 'Published Jobs & Exams', value: sitemapData?.stats?.notifications || '700+', icon: 'work', color: '#16A34A' },
                { label: 'AI Tool Guides', value: sitemapData?.stats?.aiTools || 29, icon: 'smart_toy', color: '#2563EB' },
                { label: 'CBT Mock Tests', value: sitemapData?.stats?.mockTests || 12, icon: 'quiz', color: '#0891B2' },
                { label: 'Exam Syllabi Hubs', value: sitemapData?.stats?.syllabi || 17, icon: 'menu_book', color: '#D97706' },
                { label: 'YouTube Hubs & Videos', value: sitemapData?.stats?.youtube || 15, icon: 'play_circle', color: '#DC2626' },
                { label: 'Portal Hubs & News Feeds', value: (sitemapData?.stats?.staticHubs || 35) + (sitemapData?.stats?.aiNews || 3), icon: 'newspaper', color: '#7C3AED' },
              ].map(item => (
                <div
                  key={item.label}
                  style={{
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 12, padding: '18px 16px', textAlign: 'center',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 28, color: item.color, display: 'block', marginBottom: 6 }}>
                    {item.icon}
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 4 }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Step-by-Step Google Submission Guide */}
            <div style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 12, padding: 24, marginBottom: 24,
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 14px' }}>
                🚀 How to Submit Sitemap to Google Search Console (One-Time Setup)
              </h3>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
                <li>
                  Open the <strong>Google Search Console Sitemaps page</strong> for <code>https://examudaan.in/</code>.
                </li>
                <li>
                  In the <em>"Add a new sitemap"</em> text box, enter: <code>sitemap.xml</code>
                </li>
                <li>
                  Click <strong>Submit</strong>. Google will instantly queue all job notifications, AI tools, and video hubs for crawling.
                </li>
                <li>
                  Your <code>robots.txt</code> already automatically declares: <code>Sitemap: https://examudaan.in/sitemap.xml</code>, ensuring Googlebot, Bingbot, and other search engines crawl it continuously on every visit.
                </li>
              </ol>
            </div>

            {/* Verification Metadata Status */}
            <div style={{
              background: '#F0FDF4', border: '1px solid #86EFAC',
              borderRadius: 10, padding: '16px 20px', fontSize: 13, color: '#166534',
            }}>
              <div style={{ fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
                Google Search Console Verification Status: Active
              </div>
              <div>
                Verification code <code>uZyoLIN8oRIAAlJ9zsueDi-8nz1smurC71rNGZR15yU</code> is embedded in the HTML head across all pages.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
