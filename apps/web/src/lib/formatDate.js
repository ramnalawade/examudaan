// ============================================================
// lib/formatDate.js — Date helpers for ExamUdaan
// ============================================================

/**
 * Format a date string into readable Indian format
 * "2024-06-24" → "24 Jun 2024"
 */
export function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr  // fallback: return as-is
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * How many days until the application closes?
 * Returns negative if already past
 * "2024-06-24" → 7  (if today is June 17)
 */
export function daysLeft(dateStr) {
  if (!dateStr) return null
  const end = new Date(dateStr)
  const now = new Date()
  // Reset times to midnight so we count calendar days
  end.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  return Math.round((end - now) / (1000 * 60 * 60 * 24))
}

/**
 * Is the application window currently open?
 * Returns: 'open' | 'upcoming' | 'closed'
 */
export function getStatus(applicationStart, applicationEnd) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const start = applicationStart ? new Date(applicationStart) : null
  const end   = applicationEnd   ? new Date(applicationEnd)   : null

  if (end && now > end)   return 'closed'
  if (start && now < start) return 'upcoming'
  return 'open'
}

/**
 * Format vacancy number with Indian comma style
 * 17727 → "17,727"
 */
export function formatNumber(n) {
  if (!n) return null
  return Number(n).toLocaleString('en-IN')
}

/**
 * Relative time — "3 days ago", "just now"
 */
export function timeAgo(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const seconds = Math.round((Date.now() - d) / 1000)
  if (seconds < 60)    return 'just now'
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return formatDate(dateStr)
}
