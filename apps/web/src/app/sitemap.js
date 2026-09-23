// ============================================================
// app/sitemap.js — Comprehensive Dynamic XML Sitemap
// ExamUdaan | Next.js App Router sitemap generator
// Automatically served at /sitemap.xml
//
// Includes:
// 1. All primary portal & hub pages (Jobs, Results, Admit Cards, AI Tools, AI News, YouTube, etc.)
// 2. All 29 dynamic AI tool how-to guide pages (/ai-tools/[slug])
// 3. YouTube exam learning hubs & curated video pages
// 4. AI News source & intelligence feeds
// 5. All active government exam notifications from PostgreSQL
// ============================================================

import { query as pgQuery } from '../lib/pgdb'
import { AI_TOOLS } from '../lib/aiToolsData'
import { PRECOOKED_VIDEOS, EXAM_FILTERS } from '../lib/youtubeData'
import { MOCK_TESTS } from '../lib/mockTestsData'
import { SYLLABUS_EXAMS } from '../lib/syllabusData'
import { getAllBlogPosts } from '../lib/blogData'

// Revalidate sitemap from database & RSS every 24 hours (86,400s)
export const revalidate = 86400

const rawBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
const BASE_URL = (rawBase && !rawBase.includes('localhost')) ? rawBase : 'https://examudaan.in'

// Primary Hub & Static Pages
const STATIC_PAGES = [
  { url: '/',                  priority: 1.0,  changeFrequency: 'hourly'  },
  { url: '/jobs',              priority: 0.95, changeFrequency: 'hourly'  },
  { url: '/results',           priority: 0.95, changeFrequency: 'hourly'  },
  { url: '/admit-cards',       priority: 0.95, changeFrequency: 'hourly'  },
  { url: '/answer-keys',       priority: 0.85, changeFrequency: 'daily'   },
  { url: '/schemes',           priority: 0.85, changeFrequency: 'daily'   },
  { url: '/calendar',          priority: 0.85, changeFrequency: 'daily'   },
  { url: '/current-affairs',   priority: 0.95, changeFrequency: 'hourly'  },
  { url: '/daily-quiz',        priority: 0.92, changeFrequency: 'daily'   },
  { url: '/blog',              priority: 0.92, changeFrequency: 'daily'   },
  { url: '/mock-tests',        priority: 0.92, changeFrequency: 'daily'   },
  { url: '/syllabus',          priority: 0.92, changeFrequency: 'weekly'  },
  { url: '/cutoffs',           priority: 0.90, changeFrequency: 'weekly'  },
  { url: '/pyq',               priority: 0.90, changeFrequency: 'weekly'  },
  { url: '/score-calculator',  priority: 0.88, changeFrequency: 'weekly'  },
  { url: '/police-calculator', priority: 0.88, changeFrequency: 'weekly'  },
  { url: '/mock-interview',    priority: 0.88, changeFrequency: 'weekly'  },
  { url: '/ai-tools',          priority: 0.90, changeFrequency: 'daily'   },
  { url: '/ai-news',           priority: 0.90, changeFrequency: 'hourly'  },
  { url: '/youtube',           priority: 0.90, changeFrequency: 'daily'   },
  { url: '/ai-academy',        priority: 0.85, changeFrequency: 'daily'   },
  { url: '/salary-calculator', priority: 0.80, changeFrequency: 'monthly' },
  { url: '/resources',         priority: 0.80, changeFrequency: 'weekly'  },
  { url: '/ask',               priority: 0.75, changeFrequency: 'weekly'  },
  { url: '/alerts',            priority: 0.75, changeFrequency: 'weekly'  },
  { url: '/pricing',           priority: 0.70, changeFrequency: 'monthly' },
  { url: '/search',            priority: 0.65, changeFrequency: 'weekly'  },
  { url: '/about',             priority: 0.50, changeFrequency: 'monthly' },
  { url: '/faq',               priority: 0.50, changeFrequency: 'monthly' },
  { url: '/feedback',          priority: 0.50, changeFrequency: 'monthly' },
  { url: '/contact',           priority: 0.50, changeFrequency: 'monthly' },
  { url: '/terms',             priority: 0.40, changeFrequency: 'monthly' },
  { url: '/privacy',           priority: 0.40, changeFrequency: 'monthly' },
  { url: '/disclaimer',        priority: 0.40, changeFrequency: 'monthly' },
  { url: '/login',             priority: 0.30, changeFrequency: 'yearly'  },
  { url: '/register',          priority: 0.30, changeFrequency: 'yearly'  },
]

// Notification Type to Route Path
const TYPE_TO_PATH = {
  recruitment: '/jobs',
  result:      '/results',
  admit_card:  '/admit-cards',
  answer_key:  '/answer-keys',
  syllabus:    '/schemes',
}

export default async function sitemap() {
  const now = new Date().toISOString()

  // 1. Primary Static & Hub Pages
  const staticEntries = STATIC_PAGES.map(page => ({
    url:             `${BASE_URL}${page.url}`,
    lastModified:    now,
    changeFrequency: page.changeFrequency,
    priority:        page.priority,
  }))

  // 2. AI Tools Detail Pages (/ai-tools/[slug]) — All 29 Tools
  const aiToolEntries = (AI_TOOLS || []).map(tool => ({
    url:             `${BASE_URL}/ai-tools/${tool.slug}`,
    lastModified:    now,
    changeFrequency: 'weekly',
    priority:        0.85,
  }))

  // Key AI Tools Landing & Feature Filters
  const aiFeatureEntries = [
    { url: `${BASE_URL}/ai-tools?tool=resume`,   lastModified: now, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${BASE_URL}/ai-tools?filter=mpsc`,   lastModified: now, changeFrequency: 'daily',  priority: 0.85 },
    { url: `${BASE_URL}/ai-tools?filter=Study`,  lastModified: now, changeFrequency: 'weekly', priority: 0.80 },
    { url: `${BASE_URL}/ai-tools?filter=Writing`,lastModified: now, changeFrequency: 'weekly', priority: 0.80 },
  ]

  // 3. YouTube Educational Learning Hubs & Curated Video Endpoints
  const youtubeExamEntries = (EXAM_FILTERS || [])
    .filter(ef => ef.id !== 'all')
    .map(ef => ({
      url:             `${BASE_URL}/youtube?exam=${ef.id}`,
      lastModified:    now,
      changeFrequency: 'daily',
      priority:        0.82,
    }))

  const youtubeVideoEntries = (PRECOOKED_VIDEOS || []).map(v => ({
    url:             `${BASE_URL}/youtube?v=${v.videoId}`,
    lastModified:    now,
    changeFrequency: 'weekly',
    priority:        0.80,
  }))

  // 4. AI News RSS & Intelligence Feeds
  const aiNewsFeedEntries = [
    { url: `${BASE_URL}/ai-news?source=rss`,   lastModified: now, changeFrequency: 'hourly', priority: 0.85 },
    { url: `${BASE_URL}/ai-news?source=arxiv`, lastModified: now, changeFrequency: 'daily',  priority: 0.85 },
    { url: `${BASE_URL}/ai-news?source=hn`,    lastModified: now, changeFrequency: 'hourly', priority: 0.82 },
  ]

  // 5. Authentic CBT Mock Test Detail Pages (/mock-tests/[slug])
  const mockTestEntries = (MOCK_TESTS || [])
    .filter(t => t && t.slug)
    .map(test => ({
      url:             `${BASE_URL}/mock-tests/${test.slug}`,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        0.88,
    }))

  // 6. Comprehensive Exam Syllabus Detail Pages (/syllabus/[exam-slug])
  const syllabusEntries = (SYLLABUS_EXAMS || [])
    .filter(s => s && s.slug)
    .map(exam => ({
      url:             `${BASE_URL}/syllabus/${exam.slug}`,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        0.88,
    }))

  // 7. Live Current Affairs Category Feeds
  const currentAffairsCategories = [
    'National', 'Maharashtra', 'Economy', 'Science & Tech', 'Environment', 'Sports'
  ].map(cat => ({
    url:             `${BASE_URL}/current-affairs?cat=${encodeURIComponent(cat)}`,
    lastModified:    now,
    changeFrequency: 'daily',
    priority:        0.85,
  }))

  // 8. Flagship SEO Blog & Exam Strategy Guides (/blog/[slug])
  const blogEntries = (getAllBlogPosts() || [])
    .filter(p => p && p.slug)
    .map(post => ({
      url:             `${BASE_URL}/blog/${post.slug}`,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        0.88,
    }))

  // 9. Database Exam Notifications (Up to 45,000 published entries)
  let postEntries = []
  try {
    const rows = await pgQuery(`
      SELECT slug, notification_type, updated_at, apply_end_date
      FROM exam_notifications
      WHERE status = 'published'
      ORDER BY published_at DESC NULLS LAST
      LIMIT 45000
    `)

    postEntries = (rows || []).map(row => {
      const section = TYPE_TO_PATH[row.notification_type] || '/jobs'
      const recent = isRecent(row.apply_end_date)
      return {
        url:             `${BASE_URL}${section}/${row.slug}`,
        lastModified:    row.updated_at ? new Date(row.updated_at).toISOString() : now,
        changeFrequency: recent ? 'daily' : 'weekly',
        priority:        recent ? 0.85 : 0.60,
      }
    })
  } catch (err) {
    console.error('Sitemap DB query error:', err)
  }

  return [
    ...staticEntries,
    ...aiToolEntries,
    ...aiFeatureEntries,
    ...youtubeExamEntries,
    ...youtubeVideoEntries,
    ...aiNewsFeedEntries,
    ...mockTestEntries,
    ...syllabusEntries,
    ...currentAffairsCategories,
    ...blogEntries,
    ...postEntries,
  ]
}

/** Returns true if deadline is in the future or within the last 7 days */
function isRecent(dateStr) {
  if (!dateStr) return false
  const deadline = new Date(dateStr)
  const weekAgo  = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return deadline >= weekAgo
}
