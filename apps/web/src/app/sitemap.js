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

import fs from 'fs'
import path from 'path'
import { query as pgQuery } from '../lib/pgdb.js'
import { AI_TOOLS } from '../lib/aiToolsData.js'
import { MOCK_TESTS } from '../lib/mockTestsData.js'
import { SYLLABUS_EXAMS } from '../lib/syllabusData.js'
import { getAllBlogPosts } from '../lib/blogData.js'
import { CAREER_PATHS } from '../lib/careerGuideData.js'
import { getCleanMpscPaperSitemapEntries } from '../lib/mpscDocumentResolver.js'
import { buildMpscSyllabusSlug } from '../lib/mpscTaxonomy.js'
import mpscSyllabusCatalog from '../lib/mpscSyllabusCatalog.json'

// Revalidate sitemap from database & RSS every 24 hours (86,400s)
export const revalidate = 86400

const rawBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
const BASE_URL = (rawBase && !rawBase.includes('localhost')) ? rawBase : 'https://examudaan.in'

// Primary Hub & Static Pages
const STATIC_PAGES = [
  { url: '/', priority: 1.0, changeFrequency: 'hourly' },
  { url: '/career', priority: 0.95, changeFrequency: 'daily' },
  { url: '/jobs', priority: 0.95, changeFrequency: 'hourly' },
  { url: '/walk-in-interviews', priority: 0.95, changeFrequency: 'daily' },
  { url: '/results', priority: 0.95, changeFrequency: 'hourly' },
  { url: '/admit-cards', priority: 0.95, changeFrequency: 'hourly' },
  { url: '/answer-keys', priority: 0.85, changeFrequency: 'daily' },
  { url: '/schemes', priority: 0.85, changeFrequency: 'daily' },
  { url: '/current-affairs', priority: 0.95, changeFrequency: 'hourly' },
  { url: '/daily-quiz', priority: 0.92, changeFrequency: 'daily' },
  { url: '/blog', priority: 0.92, changeFrequency: 'daily' },
  { url: '/mock-tests', priority: 0.92, changeFrequency: 'daily' },
  { url: '/study-planner', priority: 0.92, changeFrequency: 'daily' },
  { url: '/talathi-bharti-2026', priority: 0.95, changeFrequency: 'daily' },
  { url: '/maharashtra-police-bharti-2026', priority: 0.95, changeFrequency: 'daily' },
  { url: '/mpsc-exam-dates-2026', priority: 0.95, changeFrequency: 'daily' },
  { url: '/police-bharti-question-papers', priority: 0.95, changeFrequency: 'daily' },
  { url: '/talathi-question-papers', priority: 0.95, changeFrequency: 'daily' },
  { url: '/police-bharti-hall-ticket-2026', priority: 0.95, changeFrequency: 'daily' },
  { url: '/talathi-bharti-apply-online', priority: 0.95, changeFrequency: 'daily' },
  { url: '/bmc-recruitment-2026', priority: 0.95, changeFrequency: 'daily' },
  { url: '/syllabus', priority: 0.92, changeFrequency: 'weekly' },
  { url: '/syllabus/mpsc', priority: 0.92, changeFrequency: 'weekly' },
  { url: '/jobs/org/mpsc', priority: 0.90, changeFrequency: 'daily' },
  { url: '/question-papers', priority: 0.95, changeFrequency: 'daily' },
  { url: '/mpsc-pyq', priority: 0.95, changeFrequency: 'daily' },
  { url: '/cutoffs', priority: 0.90, changeFrequency: 'weekly' },
  { url: '/pyq', priority: 0.90, changeFrequency: 'weekly' },
  { url: '/score-calculator', priority: 0.88, changeFrequency: 'weekly' },
  { url: '/police-calculator', priority: 0.88, changeFrequency: 'weekly' },
  { url: '/mock-interview', priority: 0.88, changeFrequency: 'weekly' },
  { url: '/ai-tools', priority: 0.90, changeFrequency: 'daily' },
  { url: '/ai-news', priority: 0.90, changeFrequency: 'hourly' },
  { url: '/youtube', priority: 0.90, changeFrequency: 'daily' },
  { url: '/ai-academy', priority: 0.85, changeFrequency: 'daily' },
  { url: '/salary-calculator', priority: 0.80, changeFrequency: 'monthly' },
  { url: '/resources', priority: 0.80, changeFrequency: 'weekly' },
  { url: '/ask', priority: 0.75, changeFrequency: 'weekly' },
  { url: '/alerts', priority: 0.75, changeFrequency: 'weekly' },
  { url: '/pricing', priority: 0.70, changeFrequency: 'monthly' },
  { url: '/search', priority: 0.65, changeFrequency: 'weekly' },
  { url: '/about', priority: 0.50, changeFrequency: 'monthly' },
  { url: '/faq', priority: 0.50, changeFrequency: 'monthly' },
  { url: '/feedback', priority: 0.50, changeFrequency: 'monthly' },
  { url: '/contact', priority: 0.50, changeFrequency: 'monthly' },
  { url: '/terms', priority: 0.40, changeFrequency: 'monthly' },
  { url: '/privacy', priority: 0.40, changeFrequency: 'monthly' },
  { url: '/disclaimer', priority: 0.40, changeFrequency: 'monthly' },
  { url: '/login', priority: 0.30, changeFrequency: 'yearly' },
  { url: '/register', priority: 0.30, changeFrequency: 'yearly' },
  // Hyperlocal district index
  { url: '/jobs/district', priority: 0.90, changeFrequency: 'daily' },
  // Official Question Papers & Keys Directory
  { url: '/question-papers', priority: 0.92, changeFrequency: 'daily' },
  // Clean Human & SEO Friendly Organization Hubs
  { url: '/jobs/org/mpsc', priority: 0.95, changeFrequency: 'daily' },
  { url: '/jobs/org/upsc', priority: 0.95, changeFrequency: 'daily' },
  { url: '/jobs/org/rrb', priority: 0.95, changeFrequency: 'daily' },
  { url: '/jobs/org/ssc', priority: 0.95, changeFrequency: 'daily' },
  { url: '/jobs/org/banking', priority: 0.95, changeFrequency: 'daily' },
  { url: '/jobs/org/police', priority: 0.95, changeFrequency: 'daily' },
  { url: '/jobs/closing-soon', priority: 0.95, changeFrequency: 'hourly' },
  { url: '/jobs/central-govt', priority: 0.95, changeFrequency: 'daily' },
  // Dedicated Examination Syllabi & Cadre Taxonomy Hubs
  { url: '/syllabus/mpsc', priority: 0.95, changeFrequency: 'daily' },
  { url: '/syllabus/mpsc-combined', priority: 0.95, changeFrequency: 'weekly' },
  { url: '/syllabus/mpsc-state-services', priority: 0.95, changeFrequency: 'weekly' },
  { url: '/syllabus/upsc-civil-services', priority: 0.92, changeFrequency: 'weekly' },
  { url: '/syllabus/ssc-cgl', priority: 0.92, changeFrequency: 'weekly' },
  { url: '/syllabus/ibps-po', priority: 0.92, changeFrequency: 'weekly' },
  { url: '/syllabus/maharashtra-police-bharti', priority: 0.92, changeFrequency: 'weekly' },
  { url: '/syllabus/talathi-bharti', priority: 0.90, changeFrequency: 'weekly' },
  { url: '/syllabus/rrb-ntpc', priority: 0.90, changeFrequency: 'weekly' },
]

// Notification Type to Route Path
const TYPE_TO_PATH = {
  recruitment: '/jobs',
  result: '/results',
  admit_card: '/admit-cards',
  answer_key: '/answer-keys',
  syllabus: '/schemes',
}

export default async function sitemap() {
  const now = new Date().toISOString()

  // 1. Primary Static & Hub Pages
  const staticEntries = STATIC_PAGES.map(page => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  // 2. AI Tools Detail Pages (/ai-tools/[slug]) — All 124 Tools
  const aiToolEntries = (AI_TOOLS || []).map(tool => ({
    url: `${BASE_URL}/ai-tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  // 3. Authentic CBT Mock Test Detail Pages (/mock-tests/[slug])
  const mockTestEntries = (MOCK_TESTS || [])
    .filter(t => t && t.slug)
    .map(test => ({
      url: `${BASE_URL}/mock-tests/${test.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.88,
    }))

  // 4. Comprehensive Exam Syllabus Detail Pages (/syllabus/[exam-slug])
  const syllabusEntries = (SYLLABUS_EXAMS || [])
    .filter(s => s && s.slug)
    .map(exam => ({
      url: `${BASE_URL}/syllabus/${exam.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.88,
    }))

  // 5. Flagship SEO Blog & Exam Strategy Guides (/blog/[slug])
  const blogEntries = (getAllBlogPosts() || [])
    .filter(p => p && p.slug)
    .map(post => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.88,
    }))

  // 5b. Hyperlocal District Job Pages (/jobs/district/[district])
  const DISTRICT_SLUGS = [
    'pune', 'mumbai', 'nagpur', 'nashik', 'thane',
    'aurangabad', 'kolhapur', 'solapur', 'amravati', 'nanded',
  ]
  const districtEntries = DISTRICT_SLUGS.map(slug => ({
    url: `${BASE_URL}/jobs/district/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',   // Job listings update frequently
    priority: 0.90,       // High — these target hyperlocal search traffic
  }))

  // 5c. Subject-wise Question Library Pages (/pyq/[subject]) — 1,100 PYQs
  const PYQ_SUBJECTS = [
    'polity', 'history', 'geography', 'economy', 'science',
    'marathi', 'english', 'reasoning', 'law'
  ]
  const pyqSubjectEntries = PYQ_SUBJECTS.map(subj => ({
    url: `${BASE_URL}/pyq/${subj}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.90,       // High — high-yield topic-wise question traffic
  }))

  // 5d. Dedicated Career Decision Roadmaps (/career/[slug]) — All 50 Paths
  const careerEntries = (CAREER_PATHS || []).map(career => ({
    url: `${BASE_URL}/career/${career.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.90,       // High — Evergreen educational roadmap traffic
  }))

  // 5e. Recent Daily "Chalu Ghadamodi" Current Affairs Summaries (/current-affairs/[date]) — Last 30 Days
  const currentAffairsEntries = []
  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ]
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const day = String(d.getDate()).padStart(2, '0')
    const month = monthNames[d.getMonth()]
    const year = d.getFullYear()
    const slug = `${day}-${month}-${year}`
    currentAffairsEntries.push({
      url: `${BASE_URL}/current-affairs/${slug}`,
      lastModified: d.toISOString(),
      changeFrequency: i === 0 ? 'hourly' : 'daily',
      priority: i < 7 ? 0.92 : 0.80,
    })
  }

  // 5f. Authentic MPSC Question Papers & Answer Keys (Clean Human-Readable URLs, Zero Query Strings)
  let mpscPaperEntries = []
  try {
    mpscPaperEntries = getCleanMpscPaperSitemapEntries(BASE_URL, now)
  } catch (mpscErr) {
    console.error('Sitemap MPSC clean URLs error:', mpscErr)
  }

  // 5g. MPSC 343 Official Syllabus Documents (/mpsc-syllabus/[slug]) — SEO Keyword-Rich URLs (strictly <= 90 chars)
  let mpscSyllabusEntries = []
  try {
    const catalogDocs = mpscSyllabusCatalog.syllabusDocuments || []
    for (const doc of catalogDocs) {
      if (!doc.id) continue
      const docDate = doc.publicationDate ? new Date(doc.publicationDate).toISOString() : now
      const seoSlugEn = buildMpscSyllabusSlug(doc, 'en')
      const seoSlugMr = buildMpscSyllabusSlug(doc, 'mr')

      // 1. English / Canonical Syllabus entry (e.g. /mpsc-syllabus/mpsc-rajyaseva-state-services-main-exam-syllabus-1181)
      mpscSyllabusEntries.push({
        url: `${BASE_URL}/mpsc-syllabus/${seoSlugEn}`,
        lastModified: docDate,
        changeFrequency: 'monthly',
        priority: 0.88,
      })
      // 2. Marathi Format Syllabus entry (e.g. /mpsc-syllabus/mpsc-rajyaseva-state-services-main-exam-marathi-syllabus-1182)
      mpscSyllabusEntries.push({
        url: `${BASE_URL}/mpsc-syllabus/${seoSlugMr}?lang=mr`,
        lastModified: docDate,
        changeFrequency: 'monthly',
        priority: 0.88,
      })
    }
  } catch (err) {
    console.error('Sitemap MPSC syllabus error:', err)
  }

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
        url: `${BASE_URL}${section}/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at).toISOString() : now,
        changeFrequency: recent ? 'daily' : 'weekly',
        priority: recent ? 0.85 : 0.60,
      }
    })
  } catch (err) {
    console.error('Sitemap DB query error:', err)
  }

  const allEntries = [
    ...staticEntries,
    ...careerEntries,
    ...currentAffairsEntries,
    ...aiToolEntries,
    ...mockTestEntries,
    ...syllabusEntries,
    ...blogEntries,
    ...districtEntries,
    ...pyqSubjectEntries,
    ...mpscPaperEntries,
    ...mpscSyllabusEntries,
    ...postEntries,
  ]

  // Crucial: Next.js injects raw url into <loc>${item.url}</loc> without XML entity escaping.
  // Standard XML requires '&', '<', '>', '"', and '\'' to be entity-escaped.
  return allEntries.map(entry => {
    if (!entry?.url) return entry
    return {
      ...entry,
      url: entry.url
        .replace(/&(?!(?:amp|lt|gt|quot|apos);)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;'),
    }
  })
}

/** Returns true if deadline is in the future or within the last 7 days */
function isRecent(dateStr) {
  if (!dateStr) return false
  const deadline = new Date(dateStr)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return deadline >= weekAgo
}
