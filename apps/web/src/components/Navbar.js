// ============================================================
// Navbar.js — Top App Bar
// Fully responsive across Mobile, Tablet, Laptop, and Desktop
// Desktop/Laptop: Clean logo, center navigation, right search & language
// Mobile: Logo, search toggle, language toggle, bottom nav + optional drawer
// ============================================================

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '../context/LanguageContext'
import { apiFetch } from '../lib/apiClient'
import VoiceSearchButton from './VoiceSearchButton'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { lang, setLang, t } = useLanguage()
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [navUser,       setNavUser]       = useState(null)   // { first_name, last_name, avatar_url }
  const [dropdownOpen,      setDropdownOpen]      = useState(false)
  const [moreDropdownOpen,  setMoreDropdownOpen]  = useState(false)

  // Ref for delayed close timer — prevents dropdown from closing when mouse
  // briefly passes through the gap between the More button and the dropdown panel
  const moreCloseTimer = useRef(null)

  function openMoreDropdown() {
    if (moreCloseTimer.current) {
      clearTimeout(moreCloseTimer.current)
      moreCloseTimer.current = null
    }
    setMoreDropdownOpen(true)
  }

  function scheduleCloseMoreDropdown() {
    // Give user 250ms to move from the button into the panel without it closing
    moreCloseTimer.current = setTimeout(() => {
      setMoreDropdownOpen(false)
    }, 250)
  }

  // ── Read auth state from localStorage (client-side only) ──
  useEffect(() => {
    function syncUser() {
      try {
        const token = localStorage.getItem('eu_access_token')
        const raw   = localStorage.getItem('eu_user')
        if (token && raw) {
          setNavUser(JSON.parse(raw))
        } else {
          setNavUser(null)
        }
      } catch {
        setNavUser(null)
      }
    }
    syncUser()
    // Listen for storage events so cross-tab sign-in/out updates the navbar
    window.addEventListener('storage', syncUser)
    return () => window.removeEventListener('storage', syncUser)
  }, [])

  const PRIMARY_NAV_ITEMS = [
    { href: '/jobs',               label: t('nav.jobs',            'Jobs'),              icon: 'work' },
    { href: '/current-affairs',    label: t('nav.current_affairs', 'Current Affairs'),   icon: 'newspaper',             badge: 'Daily', badgeBg: '#16a34a' },
    { href: '/question-papers',    label: t('nav.question_papers', 'Question Papers'),   icon: 'description',           badge: 'MPSC',  badgeBg: '#ea580c' },
    { href: '/answer-keys',        label: t('nav.answer_keys',     'Answer Keys'),       icon: 'key',                   badge: 'Keys',  badgeBg: '#059669' },
    { href: '/syllabus',           label: t('nav.syllabus',        'Syllabus'),          icon: 'menu_book' },
    { href: '/mock-tests',         label: t('nav.mock_tests',      'Mock Tests'),        icon: 'quiz',                  badge: 'Free',  badgeBg: '#9a3412' },
  ]

  const MORE_NAV_ITEMS = [
    { href: '/mpsc-pyq',            label: t('nav.mpsc_pyq',        'MPSC Papers (2024-26)'),icon: 'description',           badge: '209 PDFs',desc: 'Official MPSC question papers & final answer keys from mpsc.gov.in' },
    { href: '/admit-cards',        label: t('nav.admit_cards',     'Admit Cards'),          icon: 'badge',                                 desc: 'Hall tickets & exam venue notices for all exams' },
    { href: '/results',            label: t('nav.results',         'Results & Merits'),     icon: 'workspace_premium',                     desc: 'Official merit lists, selection lists & marksheets' },
    { href: '/pyq',                label: t('nav.pyq',             '15-Yr PYQ Bank'),       icon: 'history_edu',           badge: 'Hot',   desc: 'Interactive chapter-wise previous year question papers' },
    { href: '/daily-quiz',         label: t('nav.daily_quiz',      'Daily Quiz'),           icon: 'local_fire_department', badge: '5 Min', desc: '5-Minute daily speed blitz test with score badges' },
    { href: '/career',             label: t('nav.career',          'Career Guide'),         icon: 'map',                   badge: 'New',   desc: 'Career streams, pay scales, eligibility for all Govt jobs' },
    { href: '/walk-in-interviews', label: t('nav.walk_in',         'Walk-in Interviews'),   icon: 'directions_walk',       badge: 'Live',  desc: 'No online form needed — daily walk-in vacancies' },
    { href: '/study-planner',      label: t('nav.study_planner',   'AI Study Planner'),     icon: 'auto_schedule',         badge: 'AI',    desc: 'Adaptive day-by-day exam study timetable & targets' },
    { href: '/score-calculator',   label: t('nav.score_calc',      'Key Score Calculator'), icon: 'score',                 badge: 'Viral', desc: 'TCS iON, MPSC & Police Response Sheet Calculator' },
    { href: '/police-calculator',  label: t('nav.police_calc',     'Police Merit Calc'),    icon: 'calculate',             badge: '150M',  desc: 'Physical + Written composite merit cutoff calculator' },
    { href: '/cutoffs',            label: t('nav.cutoffs',         '10-Yr Cutoff Explorer'),icon: 'leaderboard',                           desc: 'Category cutoffs for MPSC, Police, Talathi & SSC' },
    { href: '/salary-calculator',  label: t('nav.salary',          'Salary Calculator'),    icon: 'payments',                              desc: '7th Pay Commission in-hand salary matrix' },
    { href: '/alerts',             label: t('nav.alerts',          'Telegram Job Alerts'),  icon: 'send',                  badge: 'Free',  desc: 'Instant official exam alerts directly on Telegram' },
    { href: '/schemes',            label: t('nav.schemes',         'Govt Schemes'),         icon: 'policy',                                desc: 'Scholarship, employment & training schemes' },
    { href: '/blog',               label: t('nav.blog',            'Exam Blog & Guides'),   icon: 'menu_book',             badge: 'Guides',desc: 'In-depth exam blueprints, 90-day plans & PYQ trends' },
    { href: '/youtube',            label: t('nav.youtube',         'YouTube Classes'),      icon: 'play_circle',                           desc: 'Free lectures, strategy & exam updates' },
    { href: '/ai-tools',           label: t('nav.ai_tools',        'AI Study Tools'),       icon: 'smart_toy',                             desc: '84+ curated AI study aids' },
    { href: '/ai-academy',         label: t('nav.ai_academy',      'AI Academy'),           icon: 'school',                badge: 'New',   desc: 'Master AI skills, prompts & workflows' },
    { href: '/mock-interview',     label: t('nav.mock_interview',  'Mock Interview AI'),    icon: 'mic',                   badge: 'AI',    desc: 'Real-time AI voice/chat board mock interview' },
    { href: '/ai-news',            label: t('nav.ai_news',         'AI News Feed'),         icon: 'feed',                  badge: 'Live',  desc: 'Real-time AI research & tech updates' },
  ]

  const MOBILE_NAV_ITEMS = [
    { href: '/',                   label: t('nav.home',            'Home'),              icon: 'home' },
    { href: '/jobs',               label: t('nav.jobs',            'Jobs'),              icon: 'work' },
    { href: '/current-affairs',    label: t('nav.current_affairs', 'Current Affairs'),   icon: 'newspaper',             badge: 'Daily' },
    { href: '/question-papers',    label: t('nav.question_papers', 'Question Papers'),   icon: 'description',           badge: 'MPSC' },
    { href: '/mpsc-pyq',           label: t('nav.mpsc_pyq',        'MPSC Papers (24-26)'),icon: 'description',          badge: '209' },
    { href: '/answer-keys',        label: t('nav.answer_keys',     'Answer Keys'),       icon: 'key',                   badge: 'Keys' },
    { href: '/syllabus',           label: t('nav.syllabus',        'Syllabus'),          icon: 'menu_book' },
    { href: '/mock-tests',         label: t('nav.mock_tests',      'Mock Tests'),        icon: 'quiz',                  badge: 'Free' },
    { href: '/pyq',                label: t('nav.pyq',             '15-Yr PYQ Bank'),    icon: 'history_edu',           badge: 'Hot' },
    { href: '/daily-quiz',         label: t('nav.daily_quiz',      'Daily Quiz'),        icon: 'local_fire_department', badge: '5 Min' },
    { href: '/admit-cards',        label: t('nav.admit_cards',     'Admit Cards'),       icon: 'badge' },
    { href: '/results',            label: t('nav.results',         'Results'),           icon: 'workspace_premium' },
    { href: '/career',             label: t('nav.career',          'Career Guide'),      icon: 'map',                   badge: 'New' },
    { href: '/walk-in-interviews', label: t('nav.walk_in',         'Walk-in'),           icon: 'directions_walk',       badge: 'Live' },
    { href: '/score-calculator',   label: t('nav.score_calc',      'Score Calculator'),  icon: 'score',                 badge: 'Viral' },
    { href: '/police-calculator',  label: t('nav.police_calc',     'Police Merit Calc'), icon: 'calculate',             badge: '150M' },
    { href: '/study-planner',      label: t('nav.study_planner',   'Study Planner'),     icon: 'auto_schedule',         badge: 'AI' },
    { href: '/cutoffs',            label: t('nav.cutoffs',         '10-Yr Cutoffs'),     icon: 'leaderboard' },
    { href: '/salary-calculator',  label: t('nav.salary',          'Salary Calc'),       icon: 'payments' },
    { href: '/alerts',             label: t('nav.alerts',          'Telegram Alerts'),   icon: 'send',                  badge: 'Free' },
    { href: '/schemes',            label: t('nav.schemes',         'Govt Schemes'),      icon: 'policy' },
    { href: '/blog',               label: t('nav.blog',            'Exam Blog'),         icon: 'menu_book',             badge: 'Guides' },
    { href: '/youtube',            label: t('nav.youtube',         'YouTube'),           icon: 'play_circle' },
    { href: '/ai-tools',           label: t('nav.ai_tools',        'AI Tools'),          icon: 'smart_toy' },
    { href: '/ai-academy',         label: t('nav.ai_academy',      'AI Academy'),        icon: 'school',                badge: 'New' },
    { href: '/mock-interview',     label: t('nav.mock_interview',  'Mock Interview'),    icon: 'mic',                   badge: 'AI' },
    { href: '/ai-news',            label: t('nav.ai_news',         'AI News'),           icon: 'feed',                  badge: 'Live' },
  ]


  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
    setMoreDropdownOpen(false)
  }, [pathname])

  // ── Sign out: call API + clear localStorage ──
  async function handleSignOut() {
    try {
      const token   = localStorage.getItem('eu_access_token')   || ''
      const refresh = localStorage.getItem('eu_refresh_token')  || ''
      await apiFetch('/api/auth/logout', {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ refresh_token: refresh }),
      })
    } catch { /* ignore network errors — we still clear local state */ }
    localStorage.removeItem('eu_access_token')
    localStorage.removeItem('eu_refresh_token')
    localStorage.removeItem('eu_user')
    setNavUser(null)
    setDropdownOpen(false)
    router.push('/')
  }

  // ── Compute user initials for avatar bubble ──
  function getInitials(u) {
    if (!u) return '?'
    const f = (u.first_name || '').trim()
    const l = (u.last_name  || '').trim()
    if (f && l) return (f[0] + l[0]).toUpperCase()
    if (f)      return f.slice(0, 2).toUpperCase()
    if (u.email) return u.email[0].toUpperCase()
    return 'U'
  }

  const handleLangChange = (newLang) => {
    setLang(newLang)
  }

  // Search is available on individual listing pages — no global navbar search needed

  return (
    <header className="navbar" style={{ position: 'relative' }}>
      <div className="navbar-inner">
        {/* ---- Left: Mobile Drawer Trigger + Brand Logo ---- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Hamburger (Mobile only — completely hidden on tablet/laptop/desktop via CSS) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="navbar-hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            id="navbar-hamburger-btn"
          >
            <span className="material-symbols-outlined">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <Link href="/" className="navbar-logo" aria-label="ExamUdaan Home">
            <Image
              src="/logo-light.svg"
              alt="ExamUdaan.in"
              width={140}
              height={36}
              priority
              style={{ height: 36, width: 'auto', display: 'block' }}
            />
          </Link>
        </div>

        {/* ---- Center: Desktop & Laptop Navigation ---- */}
        <nav className="navbar-nav" aria-label="Main navigation">
          {PRIMARY_NAV_ITEMS.map(({ href, label, badge, badgeBg }) => {
            const isActive = href === '/'
              ? pathname === '/'
              : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link${isActive ? ' active' : ''}`}
              >
                <span>{label}</span>
                {badge && (
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    lineHeight: 1,
                    padding: '2.5px 6.5px',
                    borderRadius: 999,
                    background: badgeBg || (badge === 'New' ? '#16a34a' : 'var(--primary)'),
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    verticalAlign: 'middle',
                    flexShrink: 0,
                    marginLeft: '2px',
                  }}>
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}

          {/* More Prep Tools Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={openMoreDropdown}
            onMouseLeave={scheduleCloseMoreDropdown}
          >
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(o => !o)}
              className={`nav-link${MORE_NAV_ITEMS.some(m => pathname.startsWith(m.href)) ? ' active' : ''}`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'inherit',
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              <span>More</span>
              <span className="material-symbols-outlined" style={{ fontSize: 18, transition: 'transform 0.2s', transform: moreDropdownOpen ? 'rotate(180deg)' : 'none' }}>
                expand_more
              </span>
            </button>

            {moreDropdownOpen && (
              <div
                onMouseEnter={openMoreDropdown}
                onMouseLeave={scheduleCloseMoreDropdown}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0px)',  /* No gap — prevents mouse leaving dead zone */
                  right: 0,
                  width: 320,
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 12,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                  padding: '8px',
                  zIndex: 99,
                  /* Transparent top padding bridges any sub-pixel gap between button and panel */
                  paddingTop: 12,
                  marginTop: -4,
                }}
              >
                {/* Invisible bridge strip at the very top prevents gap-related close */}
                <div style={{ position: 'absolute', top: -8, left: 0, right: 0, height: 8, background: 'transparent' }} />
                {MORE_NAV_ITEMS.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 8,
                      textDecoration: 'none',
                      color: 'var(--on-surface)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-low)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary)', marginTop: 2 }}>
                      {item.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13 }}>
                        <span>{item.label}</span>
                        {item.badge && (
                          <span style={{
                            fontSize: 9,
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: 999,
                            background: 'var(--primary)',
                            color: '#fff',
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2, lineHeight: 1.3 }}>
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* ---- Right: Voice Search + Language Toggle + Auth ---- */}
        <div className="navbar-actions">

          {/* Voice search button — uses Web Speech API, shows only on supported browsers */}
          <VoiceSearchButton
            redirect
            size="md"
            placeholder="Speak: MPSC, Police Bharti, SSC..."
          />

          {/* Language toggle */}
          <div className="lang-toggle" role="group" aria-label="Language selector">
            <button
              type="button"
              className={`lang-btn${lang === 'en' ? ' active' : ''}`}
              onClick={() => handleLangChange('en')}
            >
              English
            </button>
            <button
              type="button"
              className={`lang-btn font-marathi${lang === 'mr' ? ' active' : ''}`}
              onClick={() => handleLangChange('mr')}
              style={{ fontFamily: 'Mukta, sans-serif' }}
            >
              मराठी
            </button>
          </div>

          {/* ── User: avatar dropdown if logged in, else Sign In button ── */}
          {navUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
              {/* Admin Theme & Settings Quick Pill (Admin only) */}
              {Boolean(navUser?.is_admin || navUser?.role === 'admin') && (
                <Link
                  href="/admin?tab=themes"
                  id="nav-admin-theme-pill"
                  title="Admin Theme & Appearance Studio"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'linear-gradient(135deg, #0F172A, #1E293B)',
                    color: '#FB923C',
                    border: '1px solid rgba(251, 146, 60, 0.4)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>palette</span>
                  <span>Theme Studio</span>
                </Link>
              )}

              {/* Avatar bubble */}
              <button
                id="navbar-user-avatar-btn"
                onClick={() => setDropdownOpen(o => !o)}
                aria-label="User menu"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: navUser.avatar_url ? 'transparent' : 'var(--primary)',
                  border: '2px solid var(--primary)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', padding: 0,
                  fontSize: 13, fontWeight: 700, color: '#fff',
                  flexShrink: 0,
                }}
              >
                {navUser.avatar_url
                  ? <img src={navUser.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : getInitials(navUser)
                }
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 60 }}
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 12, boxShadow: '0 8px 32px rgba(28,25,23,0.14)',
                    minWidth: 220, zIndex: 61, overflow: 'hidden',
                  }}>
                    {/* User info header */}
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--outline-variant)', background: 'var(--primary-fixed)' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{[navUser.first_name, navUser.last_name].filter(Boolean).join(' ') || 'My Account'}</span>
                        {Boolean(navUser?.is_admin || navUser?.role === 'admin') && (
                          <span style={{ fontSize: 9.5, fontWeight: 800, background: '#EA580C', color: '#FFF', padding: '1px 5px', borderRadius: 4 }}>
                            ADMIN
                          </span>
                        )}
                      </div>
                      {navUser.email && <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>{navUser.email}</div>}
                    </div>

                    {/* Menu items */}
                    {[
                      { href: '/dashboard',           icon: 'dashboard',          label: 'My Dashboard' },
                      ...(Boolean(navUser?.is_admin || navUser?.role === 'admin') ? [
                        { href: '/admin?tab=themes',  icon: 'palette',            label: '🎨 Theme & Appearance', badge: 'ADMIN' },
                        { href: '/admin',             icon: 'admin_panel_settings', label: '⚙️ Admin Settings',   badge: 'ADMIN' },
                      ] : []),
                      { href: '/dashboard?s=profile', icon: 'person',             label: 'Edit Profile' },
                      { href: '/dashboard?s=security',icon: 'lock',               label: 'Security & Password' },
                      { href: '/pricing',              icon: 'workspace_premium',  label: 'Upgrade Plan' },
                    ].map(item => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        id={`nav-dd-${item.icon}`}
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 16px', fontSize: 13.5, fontWeight: item.badge ? 700 : 500,
                          color: item.badge ? '#C2410C' : 'var(--on-surface)',
                          background: item.badge ? '#FFF7ED' : 'transparent',
                          textDecoration: 'none',
                          transition: 'background 0.1s',
                          borderBottom: item.badge ? '1px solid #FFEDD5' : 'none',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = item.badge ? '#FFEDD5' : 'var(--surface-container-low)'}
                        onMouseLeave={e => e.currentTarget.style.background = item.badge ? '#FFF7ED' : 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18, color: item.badge ? '#EA580C' : 'var(--primary)' }}>{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span style={{ fontSize: 10, fontWeight: 800, background: '#EA580C', color: '#FFF', padding: '1px 6px', borderRadius: 4 }}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}

                    {/* Sign out */}
                    <div style={{ borderTop: '1px solid var(--outline-variant)' }}>
                      <button
                        id="navbar-signout-btn"
                        onClick={handleSignOut}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px', fontSize: 14, fontWeight: 500,
                          color: '#dc2626', background: 'none', border: 'none',
                          width: '100%', cursor: 'pointer', textAlign: 'left',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-ghost"
              style={{ padding: '6px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              id="navbar-login-btn"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
              <span>{t('nav.signin', 'Sign In')}</span>
            </Link>
          )}

        </div>
      </div>

      {/* Search moved to individual listing pages — no global search bar */}

      {/* ---- Mobile Drawer Menu (<768px only) ---- */}
      {menuOpen && (
        <div
          id="navbar-mobile-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--surface-container-lowest)',
            borderBottom: '1px solid var(--outline-variant)',
            padding: '12px 0',
            boxShadow: '0 8px 24px rgba(28,25,23,0.12)',
            zIndex: 49,
          }}
        >
          {MOBILE_NAV_ITEMS.map(({ href, label, icon, badge }) => {
            const isActive = href === '/'
              ? pathname === '/'
              : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  color: isActive ? 'var(--primary)' : 'var(--on-surface)',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 16,
                  background: isActive ? 'var(--primary-fixed)' : 'transparent',
                  transition: 'background 0.12s',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20, color: isActive ? 'var(--primary)' : 'var(--secondary)' }}
                >
                  {icon}
                </span>
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 999,
                    background: badge === 'New' ? '#22c55e' : 'var(--primary)',
                    color: '#fff',
                    textTransform: 'uppercase',
                  }}>
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}

          {/* Secondary links for mobile */}
          <div style={{ borderTop: '1px solid var(--outline-variant)', marginTop: 8, paddingTop: 8 }}>
            <Link
              href="/feedback"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', fontSize: 14, color: 'var(--secondary)', textDecoration: 'none' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>rate_review</span>
              Suggest Exam / Feedback
            </Link>
            <Link
              href="/faq"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', fontSize: 14, color: 'var(--secondary)', textDecoration: 'none' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>help</span>
              Help & FAQ
            </Link>
          </div>

          {/* Mobile Language Toggle */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--outline-variant)', marginTop: 8 }}>
            <div className="lang-toggle" style={{ display: 'flex', maxWidth: 200 }}>
              <button
                type="button"
                className={`lang-btn${lang === 'en' ? ' active' : ''}`}
                onClick={() => handleLangChange('en')}
                style={{ flex: 1 }}
              >
                English
              </button>
              <button
                type="button"
                className={`lang-btn font-marathi${lang === 'mr' ? ' active' : ''}`}
                onClick={() => handleLangChange('mr')}
                style={{ fontFamily: 'Mukta, sans-serif', flex: 1 }}
              >
                मराठी
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
