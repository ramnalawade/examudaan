// ============================================================
// app/api/notifications/route.js — Exam Notifications API
// ExamUdaan | Reads from exam_notifications + organizations tables
//
// GET /api/notifications
//   ?status=published|closed             (default: published)
//   ?type=recruitment|result|answer_key|admit_card|syllabus|correction|other
//   ?org=BMC|MPSC                        (filter by org acronym, case-insensitive)
//   ?q=search term                       (title ILIKE search)
//   ?state=maharashtra|up|bihar...       (state_slug filter)
//   ?city=mumbai|pune...                 (exam_cities contains, case-insensitive)
//   ?qualification=graduate|10th|12th|diploma
//   ?employment_type=permanent|contractual
//   ?min_salary=10000                    (salary_min >= N)
//   ?max_age=35                          (max_age_limit <= N)
//   ?page=1                              (1-indexed pagination)
//   ?limit=20                            (max 50)
//   ?sort=latest|closing|vacancies       (default: latest)
//
// Response shape (success):
//   { status: 200, success: true, data: { notifications, total, page, totalPages } }
//
// Security:
//   - Public read-only endpoint (no auth required)
//   - All query params validated via Joi
//   - All SQL uses parameterized $n placeholders (no interpolation)
//   - No internal fields (org_id, source_id) exposed in response
// ============================================================

import { NextResponse } from 'next/server'
import Joi from 'joi'
import { query } from '../../../lib/pgdb'
import { ok, serverError, serviceUnavailable, badRequest } from '../../../lib/apiResponse'

const PAGE_SIZE = 20

// ---- Validation schema ----
const schema = Joi.object({
  status: Joi.string().valid('published', 'closed', 'all').default('published'),
  type: Joi.string().valid(
    'recruitment', 'result', 'answer_key', 'admit_card',
    'syllabus', 'correction', 'other'
  ).allow(null, ''),
  org: Joi.string().max(200).allow(null, ''),  // comma-separated for multi-org
  q: Joi.string().trim().max(200).allow(null, ''),
  state: Joi.string().max(50).allow(null, ''),
  city: Joi.string().max(100).allow(null, ''),
  qualification: Joi.string().valid(
    '10th', '12th', 'graduate', 'post_graduate', 'diploma', 'iti'
  ).allow(null, ''),
  employment_type: Joi.string().valid('permanent', 'contractual').allow(null, ''),
  min_salary: Joi.number().integer().min(0).max(10000000).allow(null, ''),
  max_age: Joi.number().integer().min(18).max(65).allow(null, ''),
  govt_level: Joi.string().valid('Central', 'State', 'PSU', 'Local').allow(null, ''),
  min_vacancies: Joi.number().integer().min(0).max(1000000).allow(null, ''),
  min_days_left: Joi.number().integer().min(0).max(365).allow(null, ''),
  active_only: Joi.string().valid('true', 'false').allow(null, ''),
  include_closed: Joi.string().valid('true', 'false').allow(null, ''),
  walk_in: Joi.string().valid('true', 'false').allow(null, ''),  // filter walk-in only
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(PAGE_SIZE),
  sort: Joi.string().valid('latest', 'closing', 'vacancies', 'deadline').default('latest'),
})

// ---- Qualification keyword map ----
const QUAL_MAP = {
  '10th': '10th',
  '12th': '12th',
  'graduate': 'graduate',
  'post_graduate': 'post graduate',
  'diploma': 'diploma',
  'iti': 'iti',
}

// ---- Sort → SQL ----
// Ensures newly scraped/published jobs appear at the top so the page stays fresh daily
const SORT_MAP = {
  latest: `
    (CASE WHEN en.status = 'closed' OR (en.notification_type = 'recruitment' AND en.apply_end_date IS NOT NULL AND en.apply_end_date < CURRENT_DATE) THEN 1 ELSE 0 END) ASC,
    COALESCE(en.published_at, en.created_at) DESC NULLS LAST,
    en.id DESC
  `,
  closing: `
    (CASE WHEN en.status = 'closed' OR (en.notification_type = 'recruitment' AND en.apply_end_date IS NOT NULL AND en.apply_end_date < CURRENT_DATE) THEN 1 ELSE 0 END) ASC,
    (CASE WHEN en.apply_end_date >= CURRENT_DATE THEN en.apply_end_date END) ASC NULLS LAST,
    COALESCE(en.published_at, en.created_at) DESC NULLS LAST,
    en.id DESC
  `,
  vacancies: `
    (CASE WHEN en.status = 'closed' OR (en.notification_type = 'recruitment' AND en.apply_end_date IS NOT NULL AND en.apply_end_date < CURRENT_DATE) THEN 1 ELSE 0 END) ASC,
    en.total_vacancies DESC NULLS LAST,
    COALESCE(en.published_at, en.created_at) DESC NULLS LAST,
    en.id DESC
  `,
}
SORT_MAP.deadline = SORT_MAP.closing

export async function GET(req) {
  // Parse + validate query params
  const { searchParams } = new URL(req.url)
  const raw = Object.fromEntries(searchParams.entries())
  const { error: valErr, value: params } = schema.validate(raw, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  })
  if (valErr) {
    const errors = valErr.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    return badRequest('Validation failed', errors)
  }

  const {
    status, type, org, q, state, city,
    qualification, employment_type, min_salary, max_age, govt_level,
    min_vacancies, min_days_left, active_only, include_closed, walk_in,
    page, limit, sort,
  } = params
  const offset = (page - 1) * limit

  // Build WHERE clauses + params array (parameterized — no interpolation)
  const conditions = []
  const values = []

  // Status & closed on-demand filter:
  // - Default / 'published': strictly active open notifications (excludes expired deadlines)
  // - 'closed': past-deadline or closed notifications
  // - 'all' or include_closed=true: both active and closed (ordered with active dates first)
  if (include_closed === 'true' || status === 'all') {
    // Show all — DEADLINE_TIER_SQL ensures active dates appear first
  } else if (status === 'closed') {
    conditions.push(
      `(en.status = 'closed' OR (en.notification_type = 'recruitment' AND en.apply_end_date IS NOT NULL AND en.apply_end_date < CURRENT_DATE))`
    )
  } else {
    conditions.push(
      `(en.status = 'published' AND (en.notification_type != 'recruitment' OR en.apply_end_date IS NULL OR en.apply_end_date >= CURRENT_DATE))`
    )
  }

  // Active only filter (omits closed recruitments and past deadlines)
  if (active_only === 'true') {
    conditions.push(
      `(en.apply_end_date IS NULL OR en.apply_end_date >= CURRENT_DATE) AND en.status != 'closed'`
    )
  }

  // Notification type filter
  if (type) {
    conditions.push(`en.notification_type = $${values.length + 1}`)
    values.push(type)
  }

  // Organization filter — supports comma-separated multi-org (e.g. org=MPSC,SSC)
  if (org) {
    const orgs = org.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    if (orgs.length === 1) {
      // Single org — exact match
      conditions.push(`UPPER(o.acronym) = $${values.length + 1}`)
      values.push(orgs[0])
    } else {
      // Multi-org — use = ANY($n::text[])
      conditions.push(`UPPER(o.acronym) = ANY($${values.length + 1})`)
      values.push(orgs)
    }
  }

  // Full-text title search (matches English or Marathi)
  if (q) {
    conditions.push(`(en.title ILIKE $${values.length + 1} OR en.title_mr ILIKE $${values.length + 1})`)
    values.push(`%${q}%`)
  }

  // State filter (supports state_slug, state_normalized, and abbreviations)
  if (state) {
    const STATE_ALIASES = {
      up: 'uttar-pradesh',
      mp: 'madhya-pradesh',
      ap: 'andhra-pradesh',
      ts: 'telangana',
      tn: 'tamil-nadu',
      wb: 'west-bengal',
      hp: 'himachal-pradesh',
      uk: 'uttarakhand',
    }
    const resolvedState = STATE_ALIASES[state.toLowerCase()] || state.toLowerCase()
    conditions.push(`(en.state_slug ILIKE $${values.length + 1} OR en.state_normalized ILIKE $${values.length + 1})`)
    values.push(`%${resolvedState.replace(/-/g, '%')}%`)
  }

  // City / District filter — checks exam_cities array, title, title_mr, and ai_extracted_data
  if (city) {
    conditions.push(
      `((en.exam_cities IS NOT NULL AND EXISTS (
          SELECT 1 FROM unnest(en.exam_cities) AS c
          WHERE c ILIKE $${values.length + 1}
        ))
        OR en.title ILIKE $${values.length + 2}
        OR en.title_mr ILIKE $${values.length + 3}
        OR (en.ai_extracted_data IS NOT NULL AND en.ai_extracted_data::text ILIKE $${values.length + 4})
      )`
    )
    values.push(`%${city}%`, `%${city}%`, `%${city}%`, `%${city}%`)
  }

  // Qualification filter — search across qualifications JSONB, education arrays, and ai_extracted_data
  if (qualification) {
    const qualKw = QUAL_MAP[qualification] || qualification
    conditions.push(
      `(en.qualifications::text ILIKE $${values.length + 1}
        OR en.education_qualifications::text ILIKE $${values.length + 1}
        OR en.education_levels::text ILIKE $${values.length + 1}
        OR en.ai_extracted_data::text ILIKE $${values.length + 1})`
    )
    values.push(`%${qualKw}%`)
  }

  // Employment type filter
  if (employment_type) {
    conditions.push(`en.employment_type ILIKE $${values.length + 1}`)
    values.push(employment_type)
  }

  // Salary filter — salary_min >= N
  if (min_salary) {
    conditions.push(`en.salary_min >= $${values.length + 1}`)
    values.push(min_salary)
  }

  // Age filter — max_age_limit >= N (jobs you're eligible for)
  if (max_age) {
    conditions.push(
      `(en.max_age_limit IS NULL OR en.max_age_limit >= $${values.length + 1})`
    )
    values.push(max_age)
  }

  // Government level filter — from ai_extracted_data JSONB
  if (govt_level) {
    conditions.push(
      `en.ai_extracted_data->>'government_level' ILIKE $${values.length + 1}`
    )
    values.push(govt_level)
  }

  // Minimum vacancies filter (e.g. for marquee ticker or post-count filtering)
  if (min_vacancies !== undefined && min_vacancies !== null && min_vacancies !== '') {
    conditions.push(`en.total_vacancies >= $${values.length + 1}`)
    values.push(min_vacancies)
  }

  // Minimum days remaining before deadline (e.g. at least 3 days for longer-duration ticker items)
  if (min_days_left !== undefined && min_days_left !== null && min_days_left !== '') {
    conditions.push(
      `(en.apply_end_date IS NULL OR en.apply_end_date >= CURRENT_DATE + ($${values.length + 1} * interval '1 day'))`
    )
    values.push(min_days_left)
  }

  // Walk-in interview filter
  if (walk_in === 'true') {
    conditions.push('en.is_walk_in = TRUE')
  } else if (walk_in === 'false') {
    conditions.push('en.is_walk_in = FALSE')
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const orderClause = SORT_MAP[sort] || SORT_MAP.latest

  try {
    // Count query for pagination meta
    const countRows = await query(
      `SELECT COUNT(*) AS total
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       ${whereClause}`,
      values
    )
    const total = parseInt(countRows[0]?.total || '0', 10)
    const totalPages = Math.ceil(total / limit)

    // Data query — expose only safe public fields
    const dataRows = await query(
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
         en.max_age_limit,
         en.application_fee,
         en.selection_process,
         en.status,
         en.exam_cities,
         en.state_slug,
         en.seo_metadata,
         en.source_url,
         en.published_at,
         en.created_at,
         en.total_vacancies,
         en.salary_min,
         en.salary_max,
         en.employment_type,
         en.is_walk_in,
         en.title_mr,
         en.summary_mr,
         en.qualifications_mr,
         en.job_categories,
         en.education_levels,
         en.state_normalized,
         en.cities_normalized,
         en.government_level,
         o.name     AS org_name,
         o.name_mr  AS org_name_mr,
         o.acronym  AS org_acronym,
         o.website  AS org_website
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       ${whereClause}
       ORDER BY ${orderClause}
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, limit, offset]
    )

    const res = ok({
      notifications: dataRows,
      total,
      page,
      limit,
      totalPages,
    })
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return res

  } catch (err) {
    // Likely DB not configured yet — return friendly empty response
    if (!process.env.DB_HOST && !process.env.DATABASE_URL) {
      return ok(
        { notifications: [], total: 0, page: 1, limit, totalPages: 0 },
        'Database not configured — set DB_HOST / DATABASE_URL in .env.local'
      )
    }
    console.error('[GET /api/notifications] Error:', err.message)
    return serverError('Failed to fetch notifications')
  }
}
