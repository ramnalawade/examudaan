// ============================================================
// Navbar.js — Top App Bar
// Fully responsive across Mobile, Tablet, Laptop, and Desktop
// Desktop/Laptop: Clean logo, center navigation, right search & language
// Mobile: Logo, search toggle, language toggle, bottom nav + optional drawer
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '../context/LanguageContext'
import { apiFetch } from '../lib/apiClient'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { lang, setLang, t } = useLanguage()
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [searchOpen,    setSearchOpen]    = useState(false)
  const [searchQuery,   setSearchQuery]   = useState('')
  const [navUser,       setNavUser]       = useState(null)   // { first_name, last_name, avatar_url }
  const [dropdownOpen,  setDropdownOpen]  = useState(false)

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

  const NAV_ITEMS = [
    { href: '/', label: t('nav.home', 'Home'), icon: 'home' },
    { href: '/jobs', label: t('nav.jobs', 'Jobs'), icon: 'work' },
    { href: '/results', label: t('nav.results', 'Results'), icon: 'emoji_events' },
    { href: '/admit-cards', label: t('nav.admit_cards', 'Admit Card'), icon: 'badge' },
    { href: '/alerts', label: t('nav.alerts', 'Alerts'), icon: 'notifications' },
    { href: '/pricing', label: t('nav.alert_plans', 'Alert Plans'), icon: 'payments' },
  ]

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setDropdownOpen(false)
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

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

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

        {/* ---- Center: Desktop & Laptop Navigation (Hidden on mobile <768px) ---- */}
        <nav className="navbar-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = href === '/'
              ? pathname === '/'
              : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* ---- Right: Search + Language Toggle + Auth ---- */}
        <div className="navbar-actions">
          {/* Desktop & Tablet Search */}
          <form onSubmit={handleSearchSubmit} className="navbar-search">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder={t('nav.search_placeholder', 'Search jobs, exams...')}
              aria-label="Search jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Mobile search toggle button (Hidden on tablet/laptop/desktop) */}
          <button
            className="navbar-mobile-search-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
            id="navbar-mobile-search-btn"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              {searchOpen ? 'close' : 'search'}
            </span>
          </button>

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
            <div style={{ position: 'relative' }}>
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
                    minWidth: 200, zIndex: 61, overflow: 'hidden',
                  }}>
                    {/* User info header */}
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--outline-variant)', background: 'var(--primary-fixed)' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary)' }}>
                        {[navUser.first_name, navUser.last_name].filter(Boolean).join(' ') || 'My Account'}
                      </div>
                      {navUser.email && <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>{navUser.email}</div>}
                    </div>

                    {/* Menu items */}
                    {[
                      { href: '/dashboard',          icon: 'dashboard',     label: 'My Dashboard' },
                      { href: '/dashboard?s=profile',icon: 'person',        label: 'Edit Profile' },
                      { href: '/dashboard?s=security',icon: 'lock',         label: 'Security & Password' },
                      { href: '/pricing',             icon: 'workspace_premium', label: 'Upgrade Plan' },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        id={`nav-dd-${item.icon}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px', fontSize: 14, fontWeight: 500,
                          color: 'var(--on-surface)', textDecoration: 'none',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-low)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>{item.icon}</span>
                        {item.label}
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

      {/* ---- Mobile Search Expandable Bar (<768px) ---- */}
      {searchOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--surface-container-lowest)',
            borderBottom: '1px solid var(--outline-variant)',
            padding: '10px 16px',
            boxShadow: '0 4px 12px rgba(28,25,23,0.08)',
            zIndex: 48,
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span
                className="material-symbols-outlined"
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 18,
                  color: 'var(--secondary)',
                }}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Search jobs, exams, boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--outline-variant)',
                  background: 'var(--surface-container-low)',
                  color: 'var(--on-surface)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '9px 16px', fontSize: 13, flexShrink: 0 }}>
              Search
            </button>
          </form>
        </div>
      )}

      {/* ---- Mobile Drawer Menu (<768px only) ---- */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--surface-container-lowest)',
            borderBottom: '1px solid var(--outline-variant)',
            padding: '8px 0',
            boxShadow: '0 8px 24px rgba(28,25,23,0.12)',
            zIndex: 49,
          }}
        >
          {NAV_ITEMS.map(({ href, label, icon }) => {
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
                {label}
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
