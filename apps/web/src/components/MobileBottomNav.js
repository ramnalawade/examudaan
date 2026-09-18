// ============================================================
// MobileBottomNav.js — Fixed bottom navigation (mobile only)
// ExamUdaan.in | Fully bilingual support (English <-> Marathi)
// ============================================================

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '../context/LanguageContext'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { t, isMarathi } = useLanguage()

  const navItems = [
    { href: '/',          label: t('nav.home', 'Home'),       icon: 'home' },
    { href: '/jobs',      label: t('nav.jobs', 'Jobs'),       icon: 'work' },
    { href: '/alerts',    label: t('nav.alerts', 'Alerts'),   icon: 'notifications' },
    { href: '/dashboard', label: isMarathi ? 'जतन' : 'Saved',  icon: 'bookmark' },
    { href: '/login',     label: isMarathi ? 'प्रोफाइल' : 'Profile', icon: 'person' },
  ]

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {navItems.map(({ href, label, icon }) => {
        const isActive = href === '/'
          ? pathname === '/'
          : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            className={`mobile-nav-item${isActive ? ' active' : ''}`}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: isActive
                  ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                  : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
              }}
            >
              {icon}
            </span>
            <span className="mobile-nav-label">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
