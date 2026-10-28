// ============================================================
// app/api/mpsc/notifications/route.js
// ExamUdaan | MPSC Official Notification Tracker API
// ============================================================

import { query } from '@/lib/pgdb'
import { ok, error } from '@/lib/apiResponse'
import { withValidation, schemas } from '@/lib/validate'

export const dynamic = 'force-dynamic'

async function mpscNotificationsHandler(request) {
  try {
    const { searchParams } = new URL(request.url)
    const stage = searchParams.get('stage') || 'all'
    const cadre = searchParams.get('cadre') || 'all'
    const q = (searchParams.get('q') || '').trim()
    const year = searchParams.get('year') || 'all'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)))
    const offset = (page - 1) * limit

    const whereClauses = [
      `(is_mpsc = true 
        OR title ILIKE '%MPSC%' 
        OR title ILIKE '%Maharashtra Public Service%' 
        OR source_url ILIKE '%mpsc.gov.in%'
        OR (ai_extracted_data IS NOT NULL AND ai_extracted_data->>'is_mpsc' = 'true'))`
    ]
    const params = []

    // 1. Stage filter
    if (stage === 'recruitment') {
      whereClauses.push(`(notification_type = 'recruitment' OR title ILIKE '%Advt%' OR title ILIKE '%जाहिरात%')`)
    } else if (stage === 'schedule') {
      whereClauses.push(`(title ILIKE '%schedule%' OR title ILIKE '%timetable%' OR title ILIKE '%वेळापत्रक%' OR title ILIKE '%time table%')`)
    } else if (stage === 'admit_card') {
      whereClauses.push(`(notification_type = 'admit_card' OR title ILIKE '%hall ticket%' OR title ILIKE '%admit card%' OR title ILIKE '%प्रवेशपत्र%')`)
    } else if (stage === 'answer_key') {
      whereClauses.push(`(notification_type = 'answer_key' OR title ILIKE '%answer key%' OR title ILIKE '%उत्तरतालिका%')`)
    } else if (stage === 'result') {
      whereClauses.push(`(notification_type = 'result' OR title ILIKE '%result%' OR title ILIKE '%निकाल%' OR title ILIKE '%merit%' OR title ILIKE '%गुणांकन%')`)
    } else if (stage === 'syllabus') {
      whereClauses.push(`(notification_type = 'syllabus' AND NOT (title ILIKE '%schedule%' OR title ILIKE '%timetable%' OR title ILIKE '%वेळापत्रक%'))`)
    }

    // 2. Cadre filter
    if (cadre === 'rajyaseva') {
      whereClauses.push(`(title ILIKE '%State Services%' OR title ILIKE '%Rajyaseva%' OR title ILIKE '%राज्यसेवा%')`)
    } else if (cadre === 'group_b') {
      whereClauses.push(`(title ILIKE '%Group-B%' OR title ILIKE '%Group B%' OR title ILIKE '%गट ब%' OR title ILIKE '%PSI%' OR title ILIKE '%STI%' OR title ILIKE '%ASO%')`)
    } else if (cadre === 'group_c') {
      whereClauses.push(`(title ILIKE '%Group-C%' OR title ILIKE '%Group C%' OR title ILIKE '%गट क%' OR title ILIKE '%Clerk%' OR title ILIKE '%लिपिक%')`)
    } else if (cadre === 'technical') {
      whereClauses.push(`(title ILIKE '%Engineering%' OR title ILIKE '%Forest%' OR title ILIKE '%AMVI%' OR title ILIKE '%RTO%' OR title ILIKE '%Agriculture%' OR title ILIKE '%Medical%')`)
    }

    // 3. Search query
    if (q) {
      params.push(`%${q}%`)
      const paramIdx = params.length
      whereClauses.push(`(title ILIKE $${paramIdx} OR title_mr ILIKE $${paramIdx} OR advt_no ILIKE $${paramIdx})`)
    }

    // 4. Year filter
    if (year !== 'all') {
      params.push(`%${year}%`)
      const paramIdx = params.length
      whereClauses.push(`(title ILIKE $${paramIdx} OR advt_no ILIKE $${paramIdx} OR CAST(published_at AS TEXT) ILIKE $${paramIdx} OR CAST(created_at AS TEXT) ILIKE $${paramIdx})`)
    }

    const whereSql = whereClauses.join(' AND ')

    // Fetch total matching count
    const countSql = `SELECT count(*) as total FROM exam_notifications WHERE ${whereSql}`
    const countRes = await query(countSql, params)
    const total = parseInt(countRes[0]?.total || '0', 10)
    const totalPages = Math.ceil(total / limit) || 1

    // Fetch paginated records
    const dataSql = `
      SELECT id, advt_no, title, title_mr, slug, notification_type, notification_category,
             published_at, apply_start_date, apply_end_date, exam_date,
             source_url, notification_pdf, application_links, created_at, status,
             ai_extracted_data
      FROM exam_notifications
      WHERE ${whereSql}
      ORDER BY COALESCE(published_at, created_at) DESC, id DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    const rows = await query(dataSql, params)

    // Calculate stage counts for header chips
    const stageCountsSql = `
      SELECT
        count(*) as all_count,
        COUNT(CASE WHEN notification_type = 'recruitment' OR title ILIKE '%Advt%' OR title ILIKE '%जाहिरात%' THEN 1 END) as recruitment_count,
        COUNT(CASE WHEN title ILIKE '%schedule%' OR title ILIKE '%timetable%' OR title ILIKE '%वेळापत्रक%' OR title ILIKE '%time table%' THEN 1 END) as schedule_count,
        COUNT(CASE WHEN notification_type = 'admit_card' OR title ILIKE '%hall ticket%' OR title ILIKE '%admit card%' OR title ILIKE '%प्रवेशपत्र%' THEN 1 END) as admit_card_count,
        COUNT(CASE WHEN notification_type = 'answer_key' OR title ILIKE '%answer key%' OR title ILIKE '%उत्तरतालिका%' THEN 1 END) as answer_key_count,
        COUNT(CASE WHEN notification_type = 'result' OR title ILIKE '%result%' OR title ILIKE '%निकाल%' OR title ILIKE '%merit%' OR title ILIKE '%गुणांकन%' THEN 1 END) as result_count,
        COUNT(CASE WHEN notification_type = 'syllabus' AND NOT (title ILIKE '%schedule%' OR title ILIKE '%timetable%' OR title ILIKE '%वेळापत्रक%') THEN 1 END) as syllabus_count
      FROM exam_notifications
      WHERE (is_mpsc = true 
        OR title ILIKE '%MPSC%' 
        OR title ILIKE '%Maharashtra Public Service%' 
        OR source_url ILIKE '%mpsc.gov.in%'
        OR (ai_extracted_data IS NOT NULL AND ai_extracted_data->>'is_mpsc' = 'true'))
    `
    const stageRes = await query(stageCountsSql)

    // Format rows
    const items = rows.map(r => {
      const pdf = r.notification_pdf || r.application_links?.notification_pdf || null
      const date = r.published_at || r.created_at

      // Determine stage tag
      let stageKey = r.notification_type || 'circular'
      let stageLabel = 'अधिकृत प्रसिद्धीपत्रक'
      let stageBadgeClass = 'badge-circular'

      const titleLower = (r.title || '').toLowerCase()
      if (titleLower.includes('schedule') || titleLower.includes('timetable') || titleLower.includes('वेळापत्रक')) {
        stageKey = 'schedule'
        stageLabel = 'वेळापत्रक (Timetable)'
        stageBadgeClass = 'badge-schedule'
      } else if (r.notification_type === 'answer_key' || titleLower.includes('answer key') || titleLower.includes('उत्तरतालिका')) {
        stageKey = 'answer_key'
        stageLabel = 'उत्तरतालिका (Answer Key)'
        stageBadgeClass = 'badge-answer-key'
      } else if (r.notification_type === 'result' || titleLower.includes('result') || titleLower.includes('निकाल')) {
        stageKey = 'result'
        stageLabel = 'निकाल (Exam Result)'
        stageBadgeClass = 'badge-result'
      } else if (r.notification_type === 'admit_card' || titleLower.includes('hall ticket') || titleLower.includes('admit card') || titleLower.includes('प्रवेशपत्र')) {
        stageKey = 'admit_card'
        stageLabel = 'प्रवेशपत्र (Admit Card)'
        stageBadgeClass = 'badge-admit'
      } else if (r.notification_type === 'recruitment' || titleLower.includes('advt') || titleLower.includes('जाहिरात')) {
        stageKey = 'recruitment'
        stageLabel = 'जाहिरात (Recruitment)'
        stageBadgeClass = 'badge-recruitment'
      } else if (r.notification_type === 'syllabus') {
        stageKey = 'syllabus'
        stageLabel = 'अभ्यासक्रम (Syllabus)'
        stageBadgeClass = 'badge-syllabus'
      }

      // Internal link based on type
      let internalHref = null
      if (r.notification_type === 'recruitment' && r.slug) {
        internalHref = `/jobs/${r.slug}`
      } else if (r.notification_type === 'result' && r.slug) {
        internalHref = `/results/${r.slug}`
      } else if (r.notification_type === 'admit_card' && r.slug) {
        internalHref = `/admit-cards/${r.slug}`
      } else if (r.notification_type === 'answer_key' && r.slug) {
        internalHref = `/answer-keys/${r.slug}`
      }

      return {
        id: r.id,
        advt_no: r.advt_no,
        title: r.title,
        title_mr: r.title_mr,
        slug: r.slug,
        notification_type: r.notification_type,
        stageKey,
        stageLabel,
        stageBadgeClass,
        published_at: date,
        apply_end_date: r.apply_end_date,
        exam_date: r.exam_date,
        pdf_url: pdf,
        source_url: r.source_url,
        internalHref,
        status: r.status,
      }
    })

    return ok({
      items,
      total,
      page,
      limit,
      totalPages,
      stageCounts: stageRes[0] || {},
      lastUpdated: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[API /api/mpsc/notifications] Error:', err)
    return error('MPSC Notifications fetch failed: ' + err.message, 500)
  }
}

export const GET = withValidation(schemas.mpscQuery, mpscNotificationsHandler)
