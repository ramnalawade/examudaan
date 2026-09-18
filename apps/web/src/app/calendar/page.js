'use client'
// ============================================================
// app/calendar/page.js — Exam Calendar
// ExamUdaan | Monthly view of upcoming exam events
// Shows: application deadlines, exam dates, result dates
// ============================================================

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Months for navigation
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]



// Mock calendar events (replaced with Supabase query when connected)
const MOCK_EVENTS = [
  { id: 1, date: '2025-08-10', title: 'SSC CGL 2024 — Application Start',       type: 'application-open', slug: 'ssc-cgl-2024-notification',    board: 'SSC' },
  { id: 2, date: '2025-08-15', title: 'Independence Day — Govt offices closed',  type: 'exam',             slug: null,                            board: null },
  { id: 3, date: '2025-08-20', title: 'IBPS PO 2025 — Last Date to Apply',       type: 'application-end',  slug: 'ibps-po-2025',                  board: 'IBPS' },
  { id: 4, date: '2025-08-22', title: 'RRB NTPC Phase 1 Exam',                   type: 'exam',             slug: 'rrb-ntpc-2024',                 board: 'RRB' },
  { id: 5, date: '2025-08-28', title: 'UPSC CSE Prelims Result',                 type: 'result',           slug: 'upsc-cse-2025',                 board: 'UPSC' },
  { id: 6, date: '2025-09-05', title: 'SBI Clerk 2025 — Application Opens',      type: 'application-open', slug: 'sbi-clerk-2025',                board: 'SBI' },
  { id: 7, date: '2025-09-12', title: 'IBPS Clerk 2025 — Admit Card',            type: 'admit-card',       slug: 'ibps-clerk-2025-admit',         board: 'IBPS' },
  { id: 8, date: '2025-09-18', title: 'NTA UGC NET September 2025 Exam',         type: 'exam',             slug: 'nta-ugc-net-sep-2025',          board: 'NTA' },
  { id: 9, date: '2025-09-25', title: 'SSC CHSL Tier-1 Result Declared',         type: 'result',           slug: 'ssc-chsl-2024-result',          board: 'SSC' },
]

export default function CalendarPage() {
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())   // 0-indexed
  const [events, setEvents] = useState(MOCK_EVENTS)
  const [loading, setLoading] = useState(false)

  // Fetch events from API when month changes
  useEffect(() => {
    // TODO: fetch from /api/posts with date range filter when Supabase connected
    // For now, filter mock events
    setEvents(MOCK_EVENTS.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === month && d.getFullYear() === year
    }))
  }, [month, year])

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // Build calendar grid
  const firstDay  = new Date(year, month, 1).getDay()   // 0=Sun
  const daysCount = new Date(year, month + 1, 0).getDate()
  const cells     = []

  // Pad start
  for (let i = 0; i < firstDay; i++) cells.push(null)
  // Fill days
  for (let d = 1; d <= daysCount; d++) cells.push(d)

  // Map events by day
  const eventsByDay = {}
  events.forEach(e => {
    const day = new Date(e.date).getDate()
    if (!eventsByDay[day]) eventsByDay[day] = []
    eventsByDay[day].push(e)
  })

  const today = new Date()
  const isToday = (d) =>
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()

  return (
    <div className="container">
      <div className="cal-wrapper">
        {/* Header */}
        <div className="cal-header">
          <h1 className="cal-title">Exam Calendar</h1>
          <p className="cal-subtitle">
            Application deadlines, exam dates, and result announcements at a glance
          </p>
        </div>

        <div className="cal-layout">
          {/* ======== CALENDAR ======== */}
          <div>
            {/* Month navigation */}
            <div className="cal-calNav">
              <button className="cal-navBtn" onClick={prevMonth} aria-label="Previous month" id="cal-prev">
                ←
              </button>
              <h2 className="cal-monthLabel">
                {MONTHS[month]} {year}
              </h2>
              <button className="cal-navBtn" onClick={nextMonth} aria-label="Next month" id="cal-next">
                →
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="cal-dayHeaders">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="cal-dayHeader">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="cal-calGrid">
              {cells.map((day, i) => (
                <div
                  key={i}
                  className={`cal-calCell ${day ? '' : 'cal-empty'} ${day && isToday(day) ? 'cal-today' : ''}`}
                >
                  {day && (
                    <>
                      <span className="cal-dayNum">{day}</span>
                      {/* Event dots */}
                      {eventsByDay[day] && (
                        <div className="cal-dots">
                          {eventsByDay[day].slice(0, 3).map(e => (
                              <span
                                key={e.id}
                                className={`cal-dot cal-dot-${e.type}`}
                                title={e.title}
                              />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="cal-legend">
              {['application-open', 'application-end', 'exam', 'result', 'admit-card'].map(type => (
                <div key={type} className="cal-legendItem">
                  <span className={`cal-legendDot cal-dot-${type}`} />
                  <span className="cal-legendLabel">
                    {type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ======== EVENT LIST ======== */}
          <div className="cal-eventList">
            <h2 className="cal-eventListTitle">
              Events in {MONTHS[month]} {year}
            </h2>

            {events.length === 0 ? (
              <div className="cal-noEvents">
                No events scheduled this month.
              </div>
            ) : (
              events
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map(e => {
                  const d = new Date(e.date);
                  return (
                    <div
                      key={e.id}
                      className={`cal-eventCard cal-card-${e.type}`}
                    >
                      <div className="cal-eventDate">
                        <span className="cal-eventDay">{d.getDate()}</span>
                        <span className="cal-eventMon">{MONTHS[d.getMonth()].slice(0, 3)}</span>
                      </div>
                      <div className="cal-eventInfo">
                        {e.slug ? (
                          <Link href={`/jobs/${e.slug}`} className="cal-eventTitle">
                            {e.title}
                          </Link>
                        ) : (
                          <span className="cal-eventTitle">{e.title}</span>
                        )}
                        <div className="cal-eventMeta">
                          {e.board && <span className="cal-eventBoard">{e.board}</span>}
                          <span
                            className={`cal-eventType cal-badge-${e.type}`}
                          >
                            {e.type.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
