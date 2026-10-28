// ============================================================
// app/api/search/omni/route.js — Unified Omni-Search API
// ExamUdaan | High-speed multi-entity discovery across:
// 1. Live Jobs & Official Notices (PostgreSQL exam_notifications)
// 2. Exam Syllabi & Schemes (SYLLABUS_EXAMS)
// 3. Live Mock Tests & Sectional Drills (MOCK_TESTS)
// 4. Curated AI Study Tools (AI_TOOLS)
// 5. Preparation Strategies & Blogs (BLOG_POSTS)
// 6. Career Exploration Pathways (CAREER_PATHS)
// ============================================================

import { query as pgQuery } from '../../../../lib/pgdb.js'
import { ok } from '../../../../lib/apiResponse.js'
import { withValidation, schemas } from '../../../../lib/validate.js'
import { SYLLABUS_EXAMS } from '../../../../lib/syllabusData.js'
import { MOCK_TESTS } from '../../../../lib/mockTestsData.js'
import { AI_TOOLS } from '../../../../lib/aiToolsData.js'
import { BLOG_POSTS } from '../../../../lib/blogData.js'
import { CAREER_PATHS } from '../../../../lib/careerGuideData.js'
import mpscCatalog from '../../../../lib/mpscOfficialCatalog.json'
import mpscSyllabusCatalog from '../../../../lib/mpscSyllabusCatalog.json'

// Helper: map notification_type to route
function getNotificationRoute(type, slug) {
  switch (type) {
    case 'recruitment': return `/jobs/${slug}`
    case 'result': return `/results/${slug}`
    case 'admit_card': return `/admit-cards/${slug}`
    case 'answer_key': return `/answer-keys/${slug}`
    case 'syllabus': return `/schemes/${slug}`
    default: return `/jobs/${slug}`
  }
}

function getNotificationTypeLabel(type) {
  switch (type) {
    case 'recruitment': return 'Job / Bharti'
    case 'result': return 'Result'
    case 'admit_card': return 'Admit Card'
    case 'answer_key': return 'Answer Key'
    case 'syllabus': return 'Scheme / Syllabus'
    default: return 'Notification'
  }
}

async function omniHandler(req) {
  const validated = req.validatedBody || {}
  const q = (validated.q || '').trim()
  const categoryFilter = validated.category || 'all'

  const results = {
    jobs: [],
    syllabus: [],
    mock_tests: [],
    papers: [],
    ai_tools: [],
    blogs: [],
    career: []
  }

  // If query is empty or too short, return curated trending items for instant exploration
  if (!q || q.length < 2) {
    // 1. Curated Syllabi
    results.syllabus = (SYLLABUS_EXAMS || []).slice(0, 3).map(exam => ({
      id: `syl-${exam.slug}`,
      title: exam.nameEn || exam.name,
      subtitle: exam.conductingBody || 'Official Syllabus & Exam Pattern',
      category: 'syllabus',
      categoryLabel: 'Syllabus',
      icon: 'menu_book',
      badge: exam.examLevel ? `${exam.examLevel} Level` : 'Syllabus',
      url: `/syllabus/${exam.slug}`
    }))

    // 2. Curated Mock Tests
    results.mock_tests = (MOCK_TESTS || []).slice(0, 3).map(test => ({
      id: `mock-${test.slug}`,
      title: test.title,
      subtitle: test.exam ? `${test.exam} • ${test.totalQuestions || 100} MCQs` : `${test.totalQuestions || 25} MCQs`,
      category: 'mock_tests',
      categoryLabel: 'Mock Tests',
      icon: 'quiz',
      badge: 'Free CBT',
      url: `/mock-tests/${test.slug}`
    }))

    // 3. Curated AI Tools
    results.ai_tools = (AI_TOOLS || []).slice(0, 3).map(tool => ({
      id: `ai-${tool.slug}`,
      title: tool.name,
      subtitle: tool.tagline || tool.whatIs?.slice(0, 80),
      category: 'ai_tools',
      categoryLabel: 'AI Tools',
      icon: 'smart_toy',
      badge: tool.badge || (tool.free ? 'Free' : 'AI Aid'),
      url: `/ai-tools/${tool.slug}`
    }))

    // 4. Curated Blogs / Guides
    results.blogs = (BLOG_POSTS || []).slice(0, 3).map(post => ({
      id: `blog-${post.slug}`,
      title: post.title,
      subtitle: post.category || 'Preparation Strategy',
      category: 'blogs',
      categoryLabel: 'Guides & Strategy',
      icon: 'article',
      badge: post.readTime || 'Guide',
      url: `/blog/${post.slug}`
    }))

    // 5. Curated Papers (3 latest MPSC papers)
    results.papers = (mpscCatalog.questionPapers || []).slice(0, 3).map(p => ({
      id: `paper-${p.id}`,
      title: p.descInEnglish?.trim() || `MPSC Question Paper ${p.yearOfAdvertisement}`,
      subtitle: `MPSC Official Paper • ${p.yearOfAdvertisement || '2026'} (${p.englishFileSize || 'PDF'})`,
      category: 'papers',
      categoryLabel: 'Official Paper (PDF)',
      icon: 'description',
      badge: p.yearOfAdvertisement ? `${p.yearOfAdvertisement}` : 'MPSC',
      url: `/mpsc-pyq?search=${encodeURIComponent(p.id)}`
    }))

    // 6. Curated Career Pathways (3 popular roadmaps)
    results.career = (CAREER_PATHS || []).slice(0, 3).map(c => ({
      id: `career-${c.id || c.slug}`,
      title: c.title || c.name,
      subtitle: c.tagline || `${c.stream || 'Career'} Pathway`,
      category: 'career',
      categoryLabel: 'Career Roadmaps',
      icon: 'map',
      badge: c.stream || 'Career',
      url: `/career/${c.id || c.slug}`
    }))

    // 7. Latest active notifications from PostgreSQL
    try {
      const dbRows = await pgQuery(
        `SELECT en.id, en.title, en.slug, en.notification_type, en.status,
                en.total_vacancies, en.apply_end_date, coalesce(o.name, o.acronym) AS org_name
         FROM exam_notifications en
         LEFT JOIN organizations o ON o.id = en.organization_id
         WHERE en.status = 'published'
         ORDER BY en.published_at DESC NULLS LAST, en.id DESC
         LIMIT 4`
      )

      if (Array.isArray(dbRows)) {
        results.jobs = dbRows.map(row => ({
          id: `job-${row.id}`,
          title: row.title,
          subtitle: row.org_name || 'Government of Maharashtra / Central',
          category: 'jobs',
          categoryLabel: getNotificationTypeLabel(row.notification_type),
          icon: row.notification_type === 'result' ? 'workspace_premium' :
                row.notification_type === 'admit_card' ? 'badge' :
                row.notification_type === 'answer_key' ? 'key' : 'work',
          badge: row.total_vacancies ? `${row.total_vacancies} Posts` : 'Active',
          url: getNotificationRoute(row.notification_type, row.slug)
        }))
      }
    } catch (dbErr) {
      // Postgres error fallback gracefully
    }

    // 8. Fetch dynamic top trending queries from search_queries table
    let trendingSearches = []
    try {
      const topRows = await pgQuery(
        `SELECT query, COUNT(*) as count 
         FROM search_queries 
         WHERE created_at >= NOW() - INTERVAL '30 days'
         GROUP BY query 
         ORDER BY count DESC, MAX(created_at) DESC 
         LIMIT 8`
      )
      if (Array.isArray(topRows) && topRows.length > 0) {
        trendingSearches = topRows.map(r => r.query)
      }
    } catch {}

    const flat = [
      ...results.jobs,
      ...results.syllabus,
      ...results.mock_tests,
      ...results.papers,
      ...results.blogs,
      ...results.career,
      ...results.ai_tools
    ]

    return ok({
      query: '',
      isTrending: true,
      total: flat.length,
      categories: results,
      trendingSearches,
      flat
    })
  }

  // ── ACTIVE SEARCH MATCHING ──
  const qLower = q.toLowerCase()
  const qWords = qLower.split(/\s+/).filter(Boolean)

  // 1. PostgreSQL DB Query (uses GIN trigram indexes)
  try {
    const searchTerm = `%${q}%`
    const startsTerm = `${q}%`

    const dbRows = await pgQuery(
      `SELECT en.id, en.title, en.slug, en.notification_type, en.status,
              en.total_vacancies, en.apply_end_date, coalesce(o.name, o.acronym, '') AS org_name
       FROM exam_notifications en
       LEFT JOIN organizations o ON o.id = en.organization_id
       WHERE en.status = 'published'
         AND (
           en.title ILIKE $1 
           OR o.name ILIKE $1
           OR o.acronym ILIKE $1
           OR en.slug ILIKE $1
         )
       ORDER BY 
         CASE 
           WHEN o.acronym ILIKE $2 THEN 0 
           WHEN en.title ILIKE $2 THEN 1 
           WHEN o.name ILIKE $2 THEN 2
           ELSE 3 
         END,
         en.published_at DESC NULLS LAST
       LIMIT 8`,
      [searchTerm, startsTerm]
    )

    if (Array.isArray(dbRows)) {
      results.jobs = dbRows.map(row => ({
        id: `job-${row.id}`,
        title: row.title,
        subtitle: row.org_name || 'Government Department',
        category: 'jobs',
        categoryLabel: getNotificationTypeLabel(row.notification_type),
        icon: row.notification_type === 'result' ? 'workspace_premium' :
              row.notification_type === 'admit_card' ? 'badge' :
              row.notification_type === 'answer_key' ? 'key' : 'work',
        badge: row.total_vacancies ? `${row.total_vacancies} Posts` : 'Active',
        url: getNotificationRoute(row.notification_type, row.slug)
      }))
    }
  } catch (err) {
    console.warn('[omni-search] Postgres search error:', err.message)
  }

  // 2. Exam Syllabi Search
  try {
    const matchedSyllabus = (SYLLABUS_EXAMS || []).filter(exam => {
      const haystack = [
        exam.name,
        exam.nameEn,
        exam.shortName,
        exam.conductingBody,
        ...(exam.targetPosts || []),
        exam.slug,
        'syllabus',
        'अभ्यासक्रम'
      ].filter(Boolean).join(' ').toLowerCase()

      return qWords.every(w => haystack.includes(w))
    }).slice(0, 5)

    const syllabusItems = []

    // If query matches syllabus/study/pattern, provide the main Syllabus Hub as first entry
    if (qLower.includes('syllab') || qLower.includes('अभ्यास') || qLower.includes('pattern')) {
      syllabusItems.push({
        id: 'syl-hub',
        title: 'Exam Syllabus & PYQ Study Guide',
        subtitle: 'Complete topic-wise syllabus, pattern & PYQs for 17+ exams',
        category: 'syllabus',
        categoryLabel: 'Syllabus Hub',
        icon: 'menu_book',
        badge: 'All Exams',
        url: '/syllabus'
      })
    }

    // Add matched structured syllabus exams
    matchedSyllabus.forEach(exam => {
      syllabusItems.push({
        id: `syl-${exam.slug}`,
        title: exam.nameEn || exam.name,
        subtitle: exam.conductingBody || 'Comprehensive Syllabus',
        category: 'syllabus',
        categoryLabel: 'Syllabus',
        icon: 'menu_book',
        badge: exam.examLevel ? `${exam.examLevel} Level` : 'Syllabus',
        url: `/syllabus/${exam.slug}`
      })
    })

    // Search MPSC Syllabus Catalog (343 official MPSC documents)
    const mpscSyllabusDocs = mpscSyllabusCatalog?.syllabusDocuments || []
    const matchedMpscDocs = mpscSyllabusDocs.filter(doc => {
      const text = `${doc.descInEnglish || ''} ${doc.descMr || ''} ${doc.id || ''} MPSC Syllabus`.toLowerCase()
      return qWords.every(w => text.includes(w))
    }).slice(0, 4)

    matchedMpscDocs.forEach(doc => {
      syllabusItems.push({
        id: `mpsc-syl-${doc.id}`,
        title: doc.descInEnglish || doc.descMr || `MPSC Syllabus #${doc.id}`,
        subtitle: `MPSC Official Syllabus (${doc.englishFileSize || 'PDF'})`,
        category: 'syllabus',
        categoryLabel: 'MPSC Syllabus',
        icon: 'menu_book',
        badge: 'MPSC',
        url: `/mpsc-syllabus/${doc.id}`
      })
    })

    results.syllabus = syllabusItems.slice(0, 8)
  } catch {}

  // 3. Mock Tests Search
  try {
    const matchedMocks = (MOCK_TESTS || []).filter(test => {
      const haystack = [
        test.title,
        test.titleMr,
        test.exam,
        test.category,
        test.slug
      ].filter(Boolean).join(' ').toLowerCase()

      return qWords.every(w => haystack.includes(w))
    }).slice(0, 5)

    results.mock_tests = matchedMocks.map(test => ({
      id: `mock-${test.slug}`,
      title: test.title,
      subtitle: test.exam ? `${test.exam} • ${test.totalQuestions || 100} MCQs` : `${test.totalQuestions || 25} MCQs`,
      category: 'mock_tests',
      categoryLabel: 'Mock Tests',
      icon: 'quiz',
      badge: 'Free CBT',
      url: `/mock-tests/${test.slug}`
    }))
  } catch {}

  // 4. Official Question Papers & Answer Keys (824 verified MPSC papers & keys)
  try {
    const allPapers = mpscCatalog.questionPapers || []
    const matchedPapers = allPapers.filter(p => {
      const text = `${p.descInEnglish || ''} ${p.descMr || ''} ${p.yearOfAdvertisement || ''} MPSC`.toLowerCase()
      return qWords.every(w => text.includes(w))
    }).slice(0, 4)

    results.papers = matchedPapers.map(p => ({
      id: `paper-${p.id}`,
      title: p.descInEnglish?.trim() || `MPSC Question Paper ${p.yearOfAdvertisement}`,
      subtitle: `MPSC Official Paper • ${p.yearOfAdvertisement || '2026'} (${p.englishFileSize || 'PDF'})`,
      category: 'papers',
      categoryLabel: 'Official Paper (PDF)',
      icon: 'description',
      badge: p.yearOfAdvertisement ? `${p.yearOfAdvertisement}` : 'MPSC',
      url: `/mpsc-pyq?search=${encodeURIComponent(p.id)}`
    }))
  } catch {}

  // 5. AI Tools Search
  try {
    const matchedAi = (AI_TOOLS || []).filter(tool => {
      const haystack = [
        tool.name,
        tool.tagline,
        tool.whatIs,
        tool.category,
        tool.badge,
        ...(tool.targetUsers || []),
        tool.slug
      ].filter(Boolean).join(' ').toLowerCase()

      return qWords.every(w => haystack.includes(w))
    }).slice(0, 5)

    results.ai_tools = matchedAi.map(tool => ({
      id: `ai-${tool.slug}`,
      title: tool.name,
      subtitle: tool.tagline || (tool.whatIs ? tool.whatIs.slice(0, 80) : 'AI Study Assistant'),
      category: 'ai_tools',
      categoryLabel: 'AI Tools',
      icon: 'smart_toy',
      badge: tool.badge || (tool.free ? 'Free' : 'AI Tool'),
      url: `/ai-tools/${tool.slug}`
    }))
  } catch {}

  // 6. Blogs & Strategy Guides Search
  try {
    const matchedBlogs = (BLOG_POSTS || []).filter(post => {
      const haystack = [
        post.title,
        post.titleMr,
        post.excerpt,
        post.category,
        post.primaryKeyword,
        ...(post.secondaryKeywords || []),
        post.slug
      ].filter(Boolean).join(' ').toLowerCase()

      return qWords.every(w => haystack.includes(w))
    }).slice(0, 5)

    results.blogs = matchedBlogs.map(post => ({
      id: `blog-${post.slug}`,
      title: post.title,
      subtitle: post.category || 'Preparation Strategy',
      category: 'blogs',
      categoryLabel: 'Guides',
      icon: 'article',
      badge: post.readTime || 'Guide',
      url: `/blog/${post.slug}`
    }))
  } catch {}

  // 7. Career Guide Pathways Search
  try {
    const matchedCareers = (CAREER_PATHS || []).filter(c => {
      const haystack = [
        c.title,
        c.name,
        c.stream,
        c.tagline,
        ...(c.targetRoles || []),
        c.id,
        c.slug
      ].filter(Boolean).join(' ').toLowerCase()

      return qWords.every(w => haystack.includes(w))
    }).slice(0, 4)

    results.career = matchedCareers.map(c => ({
      id: `career-${c.id || c.slug}`,
      title: c.title || c.name,
      subtitle: c.tagline || `${c.stream || 'Career'} Pathway`,
      category: 'career',
      categoryLabel: 'Career Roadmaps',
      icon: 'map',
      badge: c.stream || 'Career',
      url: `/career/${c.id || c.slug}`
    }))
  } catch {}

  // Filter by category if requested
  let flat = []
  if (categoryFilter === 'all') {
    // Interleave top results from each matching category so Guides, Career Paths,
    // Syllabi, Mocks, Papers, and Jobs are visible immediately without being buried
    const topPicks = [
      ...results.jobs.slice(0, 3),
      ...results.syllabus.slice(0, 2),
      ...results.mock_tests.slice(0, 2),
      ...results.papers.slice(0, 2),
      ...results.blogs.slice(0, 2),
      ...results.career.slice(0, 2),
      ...results.ai_tools.slice(0, 2)
    ]
    const pickIds = new Set(topPicks.map(item => item.id))

    const remaining = [
      ...results.jobs,
      ...results.syllabus,
      ...results.mock_tests,
      ...results.papers,
      ...results.blogs,
      ...results.career,
      ...results.ai_tools
    ].filter(item => !pickIds.has(item.id))

    flat = [...topPicks, ...remaining]
  } else if (results[categoryFilter]) {
    flat = results[categoryFilter]
  }

  // Asynchronously record search query in PostgreSQL search_queries table for intelligence & gap discovery
  try {
    const forwarded = req.headers.get('x-forwarded-for') || ''
    const ip = forwarded ? forwarded.split(',')[0].trim() : ''
    const ipHash = ip ? ip.slice(0, 16) : null
    pgQuery(
      'INSERT INTO search_queries (query, category, results_count, ip_hash) VALUES ($1, $2, $3, $4)',
      [q.slice(0, 255), categoryFilter, flat.length, ipHash]
    ).catch(() => {})
  } catch {}

  return ok({
    query: q,
    isTrending: false,
    total: flat.length,
    categories: results,
    flat
  })
}

export const GET = withValidation(schemas.omniSearch, omniHandler)
