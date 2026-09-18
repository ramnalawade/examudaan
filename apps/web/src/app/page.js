// ============================================================
// app/page.js — Redesigned Homepage (ExamUdaan.in)
// Features: Interactive AI Matcher, Walk-in Spotlight, Live Feeds,
// WhatsApp Preview & Feedback Portal
// ============================================================

import HomePageView from '../components/HomePageView'
import { query } from '../lib/pgdb'

export const metadata = {
  title: 'ExamUdaan.in — Maharashtra Govt Job Alerts | MPSC, Police Bharti, BMC',
  description:
    'Instant Maharashtra government job alerts for MPSC, Police Bharti, BMC, ZP, Talathi, and Central exams. AI-powered eligibility matching & real-time WhatsApp alerts.',
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
       ORDER BY en.published_at DESC NULLS LAST, en.created_at DESC
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

// ---- Fetch live stats directly from PostgreSQL ----
async function getSiteStats() {
  try {
    const rows = await query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'published') AS total_jobs,
        COUNT(DISTINCT organization_id)              AS total_boards
      FROM exam_notifications
    `)

    const vacanciesRows = await query(`
      SELECT COALESCE(SUM(total_vacancies), 0) AS total_vacancies FROM posts
    `)

    const totalJobs = rows[0]?.total_jobs || 0
    const totalBoards = rows[0]?.total_boards || 0
    const totalVacancies = vacanciesRows[0]?.total_vacancies || 0

    return {
      total_jobs: Number(totalJobs).toLocaleString('en-IN'),
      total_boards: Number(totalBoards).toLocaleString('en-IN'),
      total_vacancies: Number(totalVacancies).toLocaleString('en-IN'),
    }
  } catch (err) {
    console.error('[homepage] DB error fetching stats:', err.message)
    return {
      total_jobs: '1,200+',
      total_boards: '37+',
      total_vacancies: '50,000+',
    }
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
  }
}

export default async function HomePage() {
  const [recruitments, walkIns, quickUpdates, stats] = await Promise.all([
    getLatestRecruitments(),
    getWalkIns(),
    getQuickUpdates(),
    getSiteStats(),
  ])

  const jobs = recruitments.map(toJobCardShape)

  return (
    <HomePageView
      jobs={jobs}
      walkIns={walkIns}
      quickUpdates={quickUpdates}
      stats={stats}
    />
  )
}
