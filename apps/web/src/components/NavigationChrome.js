// apps/web/src/components/NavigationChrome.js
// Client component that conditionally suppresses global navigation & chrome
// for internal /dev/ developer tools and preview routes.

'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import TickerBar from './TickerBar'
import MobileBottomNav from './MobileBottomNav'
import Footer from './Footer'
import CookieConsent from './CookieConsent'
import OmniSearchModal from './OmniSearchModal'

export default function NavigationChrome({ children }) {
  const pathname = usePathname()
  const isDevRoute = pathname?.startsWith('/dev')

  if (isDevRoute) {
    return (
      <>
        <Navbar />
        <main>{children}</main>
        <OmniSearchModal />
      </>
    )
  }

  return (
    <>
      {/* Live Updates Ticker — saffron bar */}
      <TickerBar />

      {/* Sticky top navbar */}
      <Navbar />

      {/* Page content */}
      <main style={{ paddingBottom: '90px' }}>{children}</main>

      {/* Desktop footer */}
      <Footer />

      {/* Mobile fixed bottom nav */}
      <MobileBottomNav />

      {/* Global omni search modal */}
      <OmniSearchModal />

      {/* Cookie consent banner — DPDP Act 2023 requirement */}
      <CookieConsent />
    </>
  )
}
