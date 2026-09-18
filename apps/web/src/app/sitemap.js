// ============================================================
// app/sitemap.js — Dynamic XML Sitemap
// ExamUdaan | Next.js 13+ App Router sitemap generation
// Served at /sitemap.xml automatically by Next.js
//
// Includes: static pages + all active notifications from PostgreSQL
// Revalidated on every build + ISR
// ============================================================

import { query as pgQuery } from '../lib/pgdb'

const rawBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
const BASE_URL = (rawBase && !rawBase.includes('localhost')) ? rawBase : 'https://examudaan.in'

const STATIC_PAGES = [
  { url: '/',            priority: 1.0,  changeFrequency: 'hourly'  },
  { url: '/jobs',        priority: 0.9,  changeFrequency: 'hourly'  },
  { url: '/results',     priority: 0.9,  changeFrequency: 'hourly'  },
  { url: '/admit-cards', priority: 0.9,  changeFrequency: 'hourly'  },
  { url: '/answer-keys', priority: 0.8,  changeFrequency: 'daily'   },
  { url: '/schemes',     priority: 0.7,  changeFrequency: 'weekly'  },
  { url: '/calendar',    priority: 0.7,  changeFrequency: 'daily'   },
  { url: '/alerts',      priority: 0.7,  changeFrequency: 'weekly'  },
  { url: '/search',      priority: 0.6,  changeFrequency: 'weekly'  },
  { url: '/pricing',     priority: 0.6,  changeFrequency: 'monthly' },
  { url: '/about',       priority: 0.5,  changeFrequency: 'monthly' },
  { url: '/faq',         priority: 0.5,  changeFrequency: 'monthly' },
  { url: '/feedback',    priority: 0.5,  changeFrequency: 'monthly' },
  { url: '/contact',     priority: 0.5,  changeFrequency: 'monthly' },
  { url: '/terms',       priority: 0.4,  changeFrequency: 'monthly' },
  { url: '/privacy',     priority: 0.4,  changeFrequency: 'monthly' },
  { url: '/disclaimer',  priority: 0.4,  changeFrequency: 'monthly' },
  { url: '/login',       priority: 0.3,  changeFrequency: 'yearly'  },
  { url: '/register',    priority: 0.3,  changeFrequency: 'yearly'  },
]

const TYPE_TO_PATH = {
  recruitment: '/jobs',
  result:      '/results',
  admit_card:  '/admit-cards',
  answer_key:  '/answer-keys',
  syllabus:    '/schemes',
}

export default async function sitemap() {
  const now = new Date().toISOString()

  const staticEntries = STATIC_PAGES.map(page => ({
    url:             `${BASE_URL}${page.url}`,
    lastModified:    now,
    changeFrequency: page.changeFrequency,
    priority:        page.priority,
  }))

  let postEntries = []

  try {
    const rows = await pgQuery(`
      SELECT slug, notification_type, updated_at, apply_end_date
      FROM exam_notifications
      WHERE status = 'published'
      ORDER BY published_at DESC NULLS LAST
      LIMIT 5000
    `)

    postEntries = rows.map(row => {
      const section = TYPE_TO_PATH[row.notification_type] || '/jobs'
      return {
        url:             `${BASE_URL}${section}/${row.slug}`,
        lastModified:    row.updated_at || now,
        changeFrequency: isRecent(row.apply_end_date) ? 'daily' : 'weekly',
        priority:        isRecent(row.apply_end_date) ? 0.8 : 0.5,
      }
    })
  } catch {
    // If DB unavailable, sitemap only has static pages
  }

  return [...staticEntries, ...postEntries]
}

/** Returns true if deadline is in the future or within the last 7 days */
function isRecent(dateStr) {
  if (!dateStr) return false
  const deadline = new Date(dateStr)
  const weekAgo  = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return deadline >= weekAgo
}
