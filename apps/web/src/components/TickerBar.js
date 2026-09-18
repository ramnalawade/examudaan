// ============================================================
// TickerBar.js — Live scrolling ticker
// Shows latest 15 recruitment notifications fetched from DB.
// Falls back to static content during loading / if DB is empty.
// ============================================================

'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

// Static fallback items shown while the live data loads
const FALLBACK_EN = [
  'MPSC State Services 2026 Notification Released',
  'Maharashtra Police Bharti 2026 — 17,471 Posts',
  'BMC Junior Engineer Recruitment 2026 — Apply Online',
  'Talathi Bharti Scorecard & Selection List Announced',
  'ZP Bharti 2026 — Application Open for Maharashtra Districts',
  'MahaTransco & MahaGenco Technical Recruitment 2026',
  'SSC CGL 2026 — Applications Open',
  'UPSC Civil Services Notification 2026 Released',
  'SBI PO 2026 Recruitment — Online Applications Started',
  'IBPS PO 2026 — Official Notification Out',
]

const FALLBACK_MR = [
  'MPSC राज्यसेवा परीक्षा 2026 ची अधिकृत जाहिरात प्रसिद्ध',
  'महाराष्ट्र पोलीस शिपाई भरती 2026 — 17,471 पदे',
  'बृहन्मुंबई महानगरपालिका (BMC) कनिष्ठ अभियंता थेट भरती सुरू',
  'तलाठी भरती निवड यादी व गुणपत्रिका प्रसिद्ध',
  'जिल्हा परिषद भरती 2026 — ऑनलाईन अर्ज प्रक्रिया सुरू',
  'महापारेषण व महानिर्मिती तांत्रिक संवर्ग भरती 2026',
]

export default function TickerBar() {
  const { lang, t } = useLanguage()

  // Live titles fetched from API; null = not loaded yet
  const [liveTitles, setLiveTitles] = useState(null)

  // Fetch latest 15 recruitment notifications on mount
  useEffect(() => {
    let cancelled = false

    async function fetchLatest() {
      try {
        // Fetch 15 latest published recruitment notifications
        const res = await fetch(
          '/api/notifications?type=recruitment&limit=15&status=published',
          { cache: 'no-store' }
        )
        if (!res.ok) return
        const data = await res.json()
        // API response shape: { status, success, data: { notifications, total, page, totalPages } }
        const titles = (data.data?.notifications || data.notifications || data.posts || [])
          .map(n => n.title)
          .filter(Boolean)
          .slice(0, 15)
        if (!cancelled && titles.length > 0) {
          setLiveTitles(titles)
        }
      } catch {
        // Silently fall back to static content — ticker is non-critical
      }
    }

    fetchLatest()
    return () => { cancelled = true }
  }, [])

  // Choose what to display: live data > marathi fallback > english fallback
  const items = liveTitles
    ? liveTitles
    : lang === 'mr'
      ? FALLBACK_MR
      : FALLBACK_EN

  // Scale animation speed based on item count so each item has ~3s of visibility
  const durationSec = Math.max(30, items.length * 4)

  return (
    <div
      className="ticker-container"
      role="marquee"
      aria-label="Live government job updates"
    >
      <div
        className="ticker-content"
        aria-live="off"
        style={{ animationDuration: `${durationSec}s` }}
      >
        {/* LIVE badge */}
        <span style={{ marginRight: '24px', fontWeight: 700 }}>
          🔴 {t('ticker.live', 'LIVE UPDATES:')}
        </span>

        {/* Ticker items */}
        {items.map((item, i) => (
          <span key={i}>
            {item}
            {i < items.length - 1 && (
              <span style={{ margin: '0 24px', opacity: 0.6 }}>•</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
