'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      // In production: redirect to login. In dev: allow access via env flag.
      const isDev = process.env.NODE_ENV === 'development'
      if (!isDev) {
        router.replace('/login')
        return
      }
      console.warn('[Admin] No auth token — allowing access in development mode only.')
    }
    setIsAuth(true)
  }, [router])

  const navItems = [
    { name: 'Overview', path: '/admin' },
    { name: 'Jobs', path: '/admin/jobs' },
    { name: 'Scrapers', path: '/admin/scrapers' },
  ]

  if (!isAuth) return null

  return (
    <div className="container" style={{ paddingBottom: '64px' }}>
      <div className="dash-dashboardHeader">
        <h1 className="dash-title">Admin Panel</h1>
        <p className="dash-subtitle">System overview, users, and scraper health.</p>
      </div>

      <div className="dash-layout">
        {/* Sidebar */}
        <aside className="dash-sidebar" style={{ width: '250px', flexShrink: 0 }}>
          <div className="dash-card" style={{ padding: '16px' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map((item) => {
                const isActive = pathname === item.path
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: isActive ? 'var(--accent)' : 'var(--text-body)',
                      background: isActive ? 'rgba(234, 88, 12, 0.05)' : 'transparent',
                      fontWeight: isActive ? '600' : '500',
                      transition: 'all 0.15s'
                    }}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dash-main">
          {children}
        </main>
      </div>
    </div>
  )
}
