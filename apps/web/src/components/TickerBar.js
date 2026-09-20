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

// Static fallback items (all have >= 10 posts and direct job slugs)
const FALLBACK_ITEMS = [
  {
    id: 'police-2026',
    slug: 'police-17471',
    title: 'Maharashtra Police Bharti 2026',
    title_mr: 'महाराष्ट्र पोलीस शिपाई भरती 2026',
    total_vacancies: 17471,
  },
  {
    id: 'mpsc-2026',
    slug: 'mpsc-514',
    title: 'MPSC State Services & Judicial Services Exam 2026',
    title_mr: 'MPSC राज्यसेवा व दिवाणी न्यायाधीश परीक्षा 2026',
    total_vacancies: 385,
  },
  {
    id: 'bmc-2026',
    slug: 'bmc-690',
    title: 'BMC Junior Engineer (Civil/Mech) Recruitment 2026',
    title_mr: 'बृहन्मुंबई महानगरपालिका कनिष्ठ अभियंता भरती 2026',
    total_vacancies: 690,
  },
  {
    id: 'ssc-cgl-2026',
    slug: 'ssc-cgl-2026',
    title: 'SSC CGL Combined Graduate Level Exam 2026',
    title_mr: 'कर्मचारी निवड आयोग (SSC CGL) पदवीधर स्तर परीक्षा 2026',
    total_vacancies: 14582,
  },
  {
    id: 'rrb-2026',
    slug: 'rrb-alp-2026',
    title: 'RRB Assistant Loco Pilot & Technician Recruitment 2026',
    title_mr: 'रेल्वे भरती मंडळ (RRB) तंत्रज्ञ व एएलपी भरती 2026',
    total_vacancies: 9144,
  },
  {
    id: 'ibps-po-2026',
    slug: 'ibps-po-2026',
    title: 'IBPS Probationary Officers Recruitment 2026',
    title_mr: 'IBPS प्रोबेशनरी ऑफिसर (PO) भरती 2026',
    total_vacancies: 3955,
  },
  {
    id: 'sbi-clerk-2026',
    slug: 'sbi-clerk-2026',
    title: 'SBI Junior Associates (Clerk) Recruitment 2026',
    title_mr: 'स्टेट बँक ऑफ इंडिया (SBI) लिपिक भरती 2026',
    total_vacancies: 8283,
  },
  {
    id: 'zp-bharti-2026',
    slug: 'zp-bharti-2026',
    title: 'Zilla Parishad Talathi & Arogya Sevak Bharti 2026',
    title_mr: 'जिल्हा परिषद तलाठी व आरोग्य सेवक भरती 2026',
    total_vacancies: 4890,
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
        // Query recruitment jobs with at least 10 vacancies and longer duration (at least 3 days left)
        const res = await fetch(
          '/api/notifications?type=recruitment&min_vacancies=10&min_days_left=3&status=published&sort=vacancies&limit=15'
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

    fetchLatest()
    return () => { cancelled = true }
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
