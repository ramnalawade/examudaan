// ============================================================
// lib/helpers.js — Shared utility functions
// ExamUdaan | Mirrors AiTEK's helper.ts utilities
// Note: date helpers (formatDate, daysLeft, getStatus, timeAgo)
//       live in lib/formatDate.js — import from there
// ============================================================

// Re-export date utils so components can import from one place
export { formatDate, daysLeft, getStatus, formatNumber, timeAgo } from './formatDate'

/**
 * Generate a numeric OTP of given length
 * Mirrors AiTEK's generateOTP()
 */
export function generateOTP(length = 4) {
  const digits = '123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  return otp
}

/**
 * Slugify a title for URL use
 * "SSC CGL 2024 Notification!" → "ssc-cgl-2024-notification"
 */
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80)
}

/**
 * Get days until a date (negative if past)
 * "2024-06-24" → 7
 */
export function daysUntil(dateStr) {
  if (!dateStr) return null
  const end = new Date(dateStr)
  const now = new Date()
  end.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  return Math.round((end - now) / (1000 * 60 * 60 * 24))
}

/**
 * Determine if a post is new (added within last 3 days)
 */
export function isNewPost(createdAt) {
  if (!createdAt) return false
  const days = daysUntil(createdAt.split('T')[0])
  return days !== null && days >= -3
}

/**
 * Paginate helper — calculates offset and meta
 */
export function paginate(page = 1, pageSize = 20, total = 0) {
  const offset     = (page - 1) * pageSize
  const totalPages = Math.ceil(total / pageSize)
  const hasNext    = page < totalPages
  const hasPrev    = page > 1
  return { offset, totalPages, hasNext, hasPrev }
}

/**
 * Mask email for privacy display
 * "user@example.com" → "us**@example.com"
 */
export function maskEmail(email) {
  if (!email) return null
  const [local, domain] = email.split('@')
  const masked = local.slice(0, 2) + '*'.repeat(Math.max(local.length - 2, 2))
  return `${masked}@${domain}`
}

/**
 * Mask phone for privacy
 * "9876543210" → "98*****210"
 */
export function maskPhone(phone) {
  if (!phone) return null
  return phone.slice(0, 2) + '*'.repeat(5) + phone.slice(-3)
}

/**
 * Get a future ISO date string from today
 * Mirrors AiTEK's getFutureDates()
 * getFutureDate(30) → "2024-07-27T..." (30 days from now)
 */
export function getFutureDate(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}
