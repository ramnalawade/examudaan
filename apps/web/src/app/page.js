// ============================================================
// app/page.js — Redesigned Homepage (ExamUdaan.in)
// Features: Interactive AI Matcher, Walk-in Spotlight, Live Feeds,
// WhatsApp Preview & Feedback Portal
// ============================================================

import HomePageView from '../components/HomePageView'
import { query } from '../lib/pgdb'
import { getPlatformStats } from '../lib/platformStats'

export const metadata = {
  title: "ExamUdaan — Govt Jobs, MPSC Question Papers, Police Bharti & Answer Keys 2026",
  description:
    "India & Maharashtra's #1 exam portal for MPSC Question Papers, Police Bharti 2026, Govt Job alerts, official Answer Keys, free CBT Mock Tests & daily Current Affairs.",
  keywords: [
    'govt jobs 2026',
    'MPSC question papers',
    'police bharti',
    'official answer keys',
    'sarkari naukri',
    'MPSC recruitment',
    'Maharashtra police bharti',
    'CBT mock tests',
    'current affairs',
    'ExamUdaan'
  ],
  alternates: {
    canonical: 'https://examudaan.in',
  },
  openGraph: {
    title: "ExamUdaan — Govt Jobs, MPSC Question Papers, Police Bharti & Answer Keys 2026",
    description:
      "India & Maharashtra's #1 exam portal for MPSC Question Papers, Police Bharti 2026, Govt Job alerts, official Answer Keys, free CBT Mock Tests & daily Current Affairs.",
    siteName: 'ExamUdaan',
    type: 'website',
    url: 'https://examudaan.in',
    images: [{ url: 'https://examudaan.in/logo-light.png', width: 512, height: 512, alt: 'ExamUdaan.in Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "ExamUdaan — Govt Jobs, MPSC Question Papers, Police Bharti & Answer Keys 2026",
    description:
      "MPSC Question Papers, Maharashtra Police Bharti 2026, official Answer Keys, Govt Job Alerts & CBT Mock Tests on ExamUdaan.in.",
    images: ['https://examudaan.in/logo-light.png'],
  },
}

// ISR — revalidate every 5 minutes
export const revalidate = 300

// ---- Fetch live latest recruitment notifications ----
async function getLatestRecruitments() {
  try {
    const notifications = await query(
      `SELECT
         en.id,
         en.title,
         en.slug,
         en.advt_no,
         en.notification_type,
         en.apply_start_date,
         en.apply_end_date,
         en.exam_date,
         en.notification_pdf,
         en.application_links,
         en.age_limit,
         en.application_fee,
         en.selection_process,
         en.status,
         en.exam_cities,
         en.total_vacancies,
         en.source_url,
         en.is_walk_in,
         en.title_mr,
         en.summary_mr,
         en.ai_extracted_data,
         en.published_at,
         en.created_at,
         o.name AS org_name,
         o.name_mr AS org_name_mr,
         o.acronym AS org_acronym,
         o.website AS org_website
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       WHERE en.status = 'published'
         AND (en.notification_type = 'recruitment' OR en.notification_type IS NULL)
         AND (en.apply_end_date IS NULL OR en.apply_end_date >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date)
       ORDER BY
         COALESCE(en.published_at, en.created_at) DESC NULLS LAST,
         en.id DESC
       LIMIT 6`
    )
    return notifications
  } catch (err) {
    console.error('[homepage] DB error fetching recruitments:', err.message)
    return []
  }
}

// ---- Fetch urgent walk-in interviews ----
async function getWalkIns() {
  try {
    const walkIns = await query(
      `SELECT
         en.id,
         en.title,
         en.slug,
         en.advt_no,
         en.notification_type,
         en.apply_start_date,
         en.apply_end_date,
         en.exam_date,
         en.notification_pdf,
         en.application_links,
         en.total_vacancies,
         en.source_url,
         en.is_walk_in,
         en.title_mr,
         en.summary_mr,
         en.ai_extracted_data,
         en.published_at,
         en.created_at,
         o.name AS org_name,
         o.name_mr AS org_name_mr,
         o.acronym AS org_acronym
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       WHERE en.status = 'published'
         AND (en.is_walk_in = TRUE OR en.selection_process ILIKE '%walk-in%' OR en.title ILIKE '%walk-in%')
       ORDER BY en.published_at DESC NULLS LAST, en.created_at DESC
       LIMIT 3`
    )
    return walkIns
  } catch (err) {
    console.error('[homepage] DB error fetching walk-ins:', err.message)
    return []
  }
}

// ---- Fetch latest admit cards and results ----
async function getQuickUpdates() {
  try {
    const updates = await query(
      `SELECT
         en.id,
         en.title,
         en.title_mr,
         en.slug,
         en.notification_type,
         en.published_at,
         o.acronym AS org_acronym
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       WHERE en.status = 'published'
         AND en.notification_type IN ('result', 'admit_card', 'answer_key')
       ORDER BY en.published_at DESC NULLS LAST, en.created_at DESC
       LIMIT 4`
    )
    return updates
  } catch (err) {
    console.error('[homepage] DB error fetching quick updates:', err.message)
    return []
  }
}

// ---- Fetch live stats from central platformStats module ----
async function getSiteStats() {
  return await getPlatformStats()
}

// ---- Fetch real live urgent recruitment openings closing soon ----
async function getUrgentOpenings() {
  try {
    const openings = await query(
      `SELECT
         en.id,
         en.title,
         en.title_mr,
         en.slug,
         en.notification_type,
         en.apply_start_date,
         en.apply_end_date,
         en.exam_date,
         en.total_vacancies,
         en.is_walk_in,
         o.name AS org_name,
         o.name_mr AS org_name_mr,
         o.acronym AS org_acronym
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       WHERE en.status = 'published'
         AND (en.notification_type = 'recruitment' OR en.notification_type IS NULL)
         AND (
           (en.apply_end_date IS NOT NULL AND en.apply_end_date >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date)
           OR (en.is_walk_in = TRUE AND en.exam_date >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date)
         )
       ORDER BY
         COALESCE(en.apply_end_date, en.exam_date) ASC,
         en.id DESC
       LIMIT 4`
    )
    return openings || []
  } catch (err) {
    console.error('[homepage] DB error fetching urgent openings:', err.message)
    return []
  }
}

// ---- Count total recruitment openings closing in next 14 days ----
async function getUrgentCount() {
  try {
    const rows = await query(
      `SELECT COUNT(*) AS total
       FROM exam_notifications
       WHERE status = 'published'
         AND (notification_type = 'recruitment' OR notification_type IS NULL)
         AND (
           (apply_end_date IS NOT NULL AND apply_end_date >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date AND apply_end_date <= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date + interval '14 days')
           OR (is_walk_in = TRUE AND exam_date >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date AND exam_date <= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date + interval '14 days')
         )`
    )
    return parseInt(rows[0]?.total || '0', 10)
  } catch (err) {
    console.error('[homepage] DB error fetching urgent count:', err.message)
    return 0
  }
}

// ---- Helper to map notification row to JobCard props ----
function toJobCardShape(n) {
  return {
    id: n.id,
    slug: n.slug,
    title: n.title,
    title_mr: n.title_mr,
    summary_mr: n.summary_mr,
    org_name_mr: n.org_name_mr,
    department: n.org_name,
    organization: n.org_acronym,
    vacancies: n.total_vacancies,
    apply_start: n.apply_start_date,
    apply_end: n.apply_end_date,
    exam_date: n.exam_date,
    location: Array.isArray(n.exam_cities)
      ? n.exam_cities.join(', ')
      : (n.exam_cities || 'Maharashtra'),
    qualification: null,
    salary: null,
    category: n.org_acronym?.toLowerCase() || 'default',
    notification_pdf: n.notification_pdf,
    application_links: n.application_links,
    source_url: n.source_url,
    age_limit: n.age_limit,
    application_fee: n.application_fee,
    selection_process: n.selection_process,
    is_walk_in: n.is_walk_in,
    ai_extracted_data: n.ai_extracted_data,
    status: n.status,
    notification_type: n.notification_type || 'recruitment',
    published_at: n.published_at,
    created_at: n.created_at,
  }
}

export default async function HomePage() {
  try {
    const [recruitments, quickUpdates, stats, urgentOpenings, urgentCount] = await Promise.all([
      getLatestRecruitments().catch(err => {
        console.error('[homepage] getLatestRecruitments failed:', err.message)
        return []
      }),
      getQuickUpdates().catch(err => {
        console.error('[homepage] getQuickUpdates failed:', err.message)
        return []
      }),
      getSiteStats().catch(err => {
        console.error('[homepage] getSiteStats failed:', err.message)
        return {}
      }),
      getUrgentOpenings().catch(err => {
        console.error('[homepage] getUrgentOpenings failed:', err.message)
        return []
      }),
      getUrgentCount().catch(err => {
        console.error('[homepage] getUrgentCount failed:', err.message)
        return 0
      }),
    ])

    const safeRecruitments = Array.isArray(recruitments) ? recruitments : []
    const jobs = safeRecruitments.map(toJobCardShape)

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://examudaan.in/#website',
      url: 'https://examudaan.in',
      name: 'ExamUdaan',
      alternateName: ['ExamUdaan.in', 'Exam Udaan', 'एक्झामउडान'],
      description: "Maharashtra's #1 AI-Powered Sarkari Job Alerts, PYQ Question Papers, Exam Syllabus & Authentic Mock Test Platform",
      inLanguage: ['en-IN', 'mr-IN'],
      publisher: {
        '@id': 'https://examudaan.in/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://examudaan.in/jobs?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    }

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://examudaan.in/#organization',
      name: 'ExamUdaan',
      alternateName: ['ExamUdaan.in', 'Exam Udaan'],
      url: 'https://examudaan.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://examudaan.in/logo-light.png',
        width: 512,
        height: 512,
        caption: "ExamUdaan — India's & Maharashtra's Premier Exam Portal",
      },
      image: 'https://examudaan.in/logo-light.png',
      sameAs: [
        'https://t.me/examudaan',
        'https://whatsapp.com/channel/0029Vb33ZTU9MF8t5n9Rao0i',
        'https://www.youtube.com/@ExamUdaan',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Aspirant Support & Queries',
        url: 'https://examudaan.in/contact',
        availableLanguage: ['English', 'Marathi', 'Hindi'],
      },
    }

    const siteNavigationSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'ExamUdaan Primary Sitelinks Navigation',
      description: 'Key portals and examination services available on ExamUdaan',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'Mock Tests',
          description: 'Free CBT mock tests with timer, negative marking, instant scorecard & state rank for MPSC, Police Bharti & Talathi.',
          url: 'https://examudaan.in/mock-tests',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'Previous Year Question Papers',
          description: 'Official MPSC, Police Bharti, Talathi, ZP, SSC & RRB previous year question papers with verified answer keys.',
          url: 'https://examudaan.in/question-papers',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'Government Jobs',
          description: 'Real-time Maharashtra government job alerts for MPSC, Police Bharti, BMC, ZP, Talathi and Central vacancies.',
          url: 'https://examudaan.in/jobs',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 4,
          name: 'Exam Syllabus',
          description: 'Paper-wise syllabus, exam patterns, marks weightage and interactive topic preparation checklists.',
          url: 'https://examudaan.in/syllabus',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 5,
          name: 'Exam Results',
          description: 'Check latest government exam results, official merit lists, selection announcements and cut-off marks.',
          url: 'https://examudaan.in/results',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 6,
          name: 'Admit Cards',
          description: 'Direct download links and exam schedule notices for Maharashtra and Central exam hall tickets.',
          url: 'https://examudaan.in/admit-cards',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 7,
          name: 'Daily Current Affairs',
          description: 'Bilingual daily current affairs, Maharashtra state updates and speed drills for competitive exams.',
          url: 'https://examudaan.in/current-affairs',
        },
        {
          '@type': 'SiteNavigationElement',
          position: 8,
          name: 'MPSC Papers (2021-2026)',
          description: 'Complete archive of 429+ authentic MPSC question papers and final answer keys with in-browser PDF reader.',
          url: 'https://examudaan.in/mpsc-pyq',
        },
      ],
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
        />
        <HomePageView
          jobs={jobs}
          quickUpdates={Array.isArray(quickUpdates) ? quickUpdates : []}
          stats={stats || {}}
          urgentOpenings={Array.isArray(urgentOpenings) ? urgentOpenings : []}
          urgentCount={Number(urgentCount) || 0}
        />
      </>
    )
  } catch (err) {
    console.error('[homepage] Fatal render error:', err)
    return (
      <HomePageView
        jobs={[]}
        quickUpdates={[]}
        stats={{}}
        urgentOpenings={[]}
        urgentCount={0}
      />
    )
  }
}
