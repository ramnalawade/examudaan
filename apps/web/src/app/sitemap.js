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

import { query as pgQuery } from '../lib/pgdb.js'
import { AI_TOOLS } from '../lib/aiToolsData.js'
import { MOCK_TESTS } from '../lib/mockTestsData.js'
import { SYLLABUS_EXAMS } from '../lib/syllabusData.js'
import { getAllBlogPosts } from '../lib/blogData.js'

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
  { url: '/study-planner',     priority: 0.92, changeFrequency: 'daily'   },
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
  // Hyperlocal district index
  { url: '/jobs/district',     priority: 0.90, changeFrequency: 'daily'   },
  // Official Question Papers & Keys Directory
  { url: '/question-papers',   priority: 0.92, changeFrequency: 'daily'   },
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

  // 3. Authentic CBT Mock Test Detail Pages (/mock-tests/[slug])
  const mockTestEntries = (MOCK_TESTS || [])
    .filter(t => t && t.slug)
    .map(test => ({
      url:             `${BASE_URL}/mock-tests/${test.slug}`,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        0.88,
    }))

  // 4. Comprehensive Exam Syllabus Detail Pages (/syllabus/[exam-slug])
  const syllabusEntries = (SYLLABUS_EXAMS || [])
    .filter(s => s && s.slug)
    .map(exam => ({
      url:             `${BASE_URL}/syllabus/${exam.slug}`,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        0.88,
    }))

  // 5. Flagship SEO Blog & Exam Strategy Guides (/blog/[slug])
  const blogEntries = (getAllBlogPosts() || [])
    .filter(p => p && p.slug)
    .map(post => ({
      url:             `${BASE_URL}/blog/${post.slug}`,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        0.88,
    }))

  // 5b. Hyperlocal District Job Pages (/jobs/district/[district])
  const DISTRICT_SLUGS = [
    'pune', 'mumbai', 'nagpur', 'nashik', 'thane',
    'aurangabad', 'kolhapur', 'solapur', 'amravati', 'nanded',
  ]
  const districtEntries = DISTRICT_SLUGS.map(slug => ({
    url:             `${BASE_URL}/jobs/district/${slug}`,
    lastModified:    now,
    changeFrequency: 'daily',   // Job listings update frequently
    priority:        0.90,       // High — these target hyperlocal search traffic
  }))

  // 5c. Subject-wise Question Library Pages (/pyq/[subject]) — 1,100 PYQs
  const PYQ_SUBJECTS = [
    'polity', 'history', 'geography', 'economy', 'science',
    'marathi', 'english', 'reasoning', 'law'
  ]
  const pyqSubjectEntries = PYQ_SUBJECTS.map(subj => ({
    url:             `${BASE_URL}/pyq/${subj}`,
    lastModified:    now,
    changeFrequency: 'weekly',
    priority:        0.90,       // High — high-yield topic-wise question traffic
  }))

  // 6. Database Exam Notifications (Up to 45,000 published entries)
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
    ...mockTestEntries,
    ...syllabusEntries,
    ...blogEntries,
    ...districtEntries,
    ...pyqSubjectEntries,
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
