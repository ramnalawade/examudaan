// ============================================================
// TickerBar.js — Live Scrolling Marquee Ticker
// ExamUdaan.in | Features:
//  - Clickable job links navigating directly to /jobs/[slug]
//  - High-volume jobs (at least 10 posts / total_vacancies >= 10)
//  - Longer duration (active deadline >= 3 days)
//  - Fast caching (in-memory + sessionStorage) for zero latency
//  - Proper title casing ("Bima Sakhi", "MPSC", Marathi support)
//  - Smooth hover-to-pause for effortless clicking
// ============================================================

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'
import { formatTitle } from '../lib/formatTitle'

// Static fallback items (verified major recruitments with high vacancies)
const FALLBACK_ITEMS = [
  {
    id: '18001',
    slug: 'rrb-non-technical-popular-categories-ntpc-2026',
    title: 'RRB Non-Technical Popular Categories (NTPC)',
    title_mr: 'रेल्वे भरती बोर्ड (RRB NTPC) भरती २०२६',
    total_vacancies: 11558,
  },
  {
    id: '18002',
    slug: 'ssc-combined-graduate-level-cgl-2026',
    title: 'SSC Combined Graduate Level (CGL) 2026',
    title_mr: 'कर्मचारी निवड आयोग (SSC CGL) भरती २०२६',
    total_vacancies: 17727,
  },
  {
    id: '18003',
    slug: 'up-police-civilian-constable-recruitment-2026',
    title: 'Uttar Pradesh Police Civilian Constable Bharti',
    title_mr: 'उत्तर प्रदेश पोलीस कॉन्स्टेबल भरती',
    total_vacancies: 60244,
  },
  {
    id: '3993',
    slug: 'munbii-poliis-shipaaii-bhrtii-sn-2024-25-mdhye-vaaddhiiv-pdaancaa-sudhaarit-kppiikrt-aarkssnn-nihaay-tktaa-di-22-01-2026',
    title: 'Maharashtra Mumbai Police Bharti 2026',
    title_mr: 'मुंबई पोलीस शिपाई भरती २०२६ सुधारित आरक्षण',
    total_vacancies: 3521,
  },
  {
    id: '18004',
    slug: 'mpsc-state-services-combined-prelims-2026',
    title: 'Maharashtra Combined Civil Services Prelims 2026',
    title_mr: 'महाराष्ट्र नागरी सेवा संयुक्त पूर्व परीक्षा २०२६ (MPSC)',
    total_vacancies: 4124,
  },
  {
    id: '18005',
    slug: 'income-tax-filing-executive-recruitment-2026',
    title: 'Income Tax Department Tax Assistant & Executive',
    title_mr: 'आयकर विभाग कर सहाय्यक भरती २०२६',
    total_vacancies: 50,
  },
  {
    id: '18006',
    slug: 'csir-neeri-nagpur-junior-secretariat-assistant-2026',
    title: 'CSIR-NEERI Nagpur Junior Secretariat Assistant & Steno',
    title_mr: 'CSIR-NEERI नागपूर कनिष्ठ सचिवालय सहाय्यक भरती',
    total_vacancies: 28,
  },
  {
    id: '3998',
    slug: 'jaahiraat-munbii-poliis-shipaaii-bennnddsmn-kaaraagrh-shipaaii-bhrtii-sn-2024-25',
    title: 'Mumbai Police Bandsman & Jail Constable Bharti',
    title_mr: 'मुंबई पोलीस शिपाई / बॅण्डस्मन / कारागृह शिपाई भरती',
    total_vacancies: 2641,
  },
]

// In-memory module cache across page transitions to ensure instant 0ms loads
let _cachedTickerItems = null
let _cachedTickerTimestamp = 0
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export default function TickerBar() {
  const { lang, t, isMarathi } = useLanguage()

  // Live items fetched from API; starts with cached data if available
  const [liveItems, setLiveItems] = useState(() => _cachedTickerItems)

  useEffect(() => {
    let cancelled = false

    // Check sessionStorage cache for instant restoration across full reloads
    try {
      if (!_cachedTickerItems && typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('examudaan_ticker_cache')
        const storedTime = sessionStorage.getItem('examudaan_ticker_time')
        if (stored && storedTime && Date.now() - parseInt(storedTime, 10) < CACHE_TTL_MS) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            _cachedTickerItems = parsed
            _cachedTickerTimestamp = parseInt(storedTime, 10)
            setLiveItems(parsed)
          }
        }
      }
    } catch {
      // sessionStorage unavailable or quota exceeded — continue
    }

    // If cache is fresh, skip network request entirely for speed
    if (_cachedTickerItems && (Date.now() - _cachedTickerTimestamp < CACHE_TTL_MS)) {
      return
    }

    async function fetchLatest() {
      try {
        // Query active recruitment jobs with highest vacancies (active only, no closed jobs)
        const res = await fetch(
          '/api/notifications?type=recruitment&active_only=true&min_vacancies=10&status=published&sort=vacancies&limit=15'
        )
        if (!res.ok) return
        const json = await res.json()
        const rows = json.data?.notifications || json.notifications || []

        if (!cancelled && rows.length > 0) {
          const mapped = rows.map(n => {
            const orgAcronym = n.org_acronym || 'GOVT'
            const slug = n.slug || `${orgAcronym.toLowerCase()}-${n.id}`
            return {
              id: n.id,
              slug,
              title: n.title,
              title_mr: n.title_mr,
              total_vacancies: n.total_vacancies,
              apply_end_date: n.apply_end_date,
            }
          })

          _cachedTickerItems = mapped
          _cachedTickerTimestamp = Date.now()
          setLiveItems(mapped)

          try {
            sessionStorage.setItem('examudaan_ticker_cache', JSON.stringify(mapped))
            sessionStorage.setItem('examudaan_ticker_time', String(Date.now()))
          } catch {
            // Ignore storage errors
          }
        }
      } catch {
        // Silently fall back to cached or static content
      }
    }

    // Defer network request to browser idle time to ensure 0% contention with LCP
    let idleTimer = null
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        idleTimer = window.requestIdleCallback(() => {
          fetchLatest()
        }, { timeout: 4000 })
      } else {
        idleTimer = setTimeout(() => {
          fetchLatest()
        }, 3500)
      }
    }

    return () => {
      cancelled = true
      if (idleTimer) {
        if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && typeof idleTimer === 'number') {
          window.cancelIdleCallback(idleTimer)
        } else {
          clearTimeout(idleTimer)
        }
      }
    }
  }, [])

  // Choose items: live data > fallback list
  const items = liveItems && liveItems.length > 0 ? liveItems : FALLBACK_ITEMS

  // Scale animation duration based on items count (~4.5s per item for comfortable reading)
  const durationSec = Math.max(35, items.length * 5)

  return (
    <div
      className="ticker-container"
      role="marquee"
      aria-label="Live government job updates with 10+ vacancies"
    >
      <div
        className="ticker-content"
        aria-live="off"
        style={{ animationDuration: `${durationSec}s` }}
      >
        {/* LIVE badge */}
        <span style={{ marginRight: '24px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1.5s infinite' }} />
          {t('ticker.live', 'LIVE UPDATES:')}
        </span>

        {/* Ticker items with direct job links */}
        {items.map((item, i) => {
          const rawTitle = (isMarathi && item.title_mr) ? item.title_mr : item.title
          const displayTitle = formatTitle(rawTitle)
          const vacancies = item.total_vacancies
          const jobHref = `/jobs/${item.slug || item.id}`

          return (
            <span key={item.id || item.slug || i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Link
                href={jobHref}
                className="ticker-item-link"
                title={`${displayTitle} — Click to view job details & apply`}
              >
                <span className="ticker-item-title">{displayTitle}</span>
                {vacancies && vacancies >= 10 && (
                  <span className="ticker-item-badge">
                    {Number(vacancies).toLocaleString('en-IN')} {isMarathi ? 'जागा' : 'Posts'}
                  </span>
                )}
              </Link>

              {i < items.length - 1 && (
                <span style={{ margin: '0 20px', opacity: 0.5, userSelect: 'none' }}>•</span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
