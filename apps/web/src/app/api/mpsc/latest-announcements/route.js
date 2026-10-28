// ============================================================
// app/api/mpsc/latest-announcements/route.js
// Fetches recent official MPSC circulars, timetables & results
// ============================================================

import { query } from '@/lib/pgdb'
import { ok, serverError } from '@/lib/apiResponse'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '8', 10), 20)

    const sql = `
      SELECT en.id, en.title, en.slug, en.notification_type, en.advt_no,
             en.notification_pdf, en.published_at, en.source_url,
             en.title_translations, en.ai_extracted_data, en.created_at
      FROM exam_notifications en
      JOIN organizations o ON o.id = en.organization_id
      WHERE UPPER(o.acronym) = 'MPSC'
        AND en.status = 'published'
      ORDER BY COALESCE(en.published_at, en.created_at) DESC, en.id DESC
      LIMIT $1
    `

    const rows = await query(sql, [limit])

    const announcements = (rows || []).map(r => {
      const trans = r.title_translations || {}
      const ai = r.ai_extracted_data || {}
      
      // Determine friendly category
      let category = 'Announcement'
      let categoryMr = 'प्रसिद्धीपत्रक'
      if (r.notification_type === 'result') {
        category = 'Result'
        categoryMr = 'निकाल'
      } else if (r.notification_type === 'syllabus') {
        category = 'Timetable / Schedule'
        categoryMr = 'वेळापत्रक'
      } else if (r.notification_type === 'admit_card') {
        category = 'Admit Card'
        categoryMr = 'प्रवेशपत्र'
      } else if (r.notification_type === 'answer_key') {
        category = 'Answer Key'
        categoryMr = 'उत्तरतालिका'
      }

      // Determine portal route prefix
      let routePrefix = 'jobs'
      if (r.notification_type === 'result') routePrefix = 'results'
      else if (r.notification_type === 'admit_card') routePrefix = 'admit-cards'
      else if (r.notification_type === 'answer_key') routePrefix = 'answer-keys'
      else if (r.notification_type === 'syllabus') routePrefix = 'schemes'

      const dateStr = r.published_at 
        ? new Date(r.published_at).toISOString().split('T')[0]
        : (r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : null)

      return {
        id: r.id,
        titleEn: trans.en || r.title,
        titleMr: trans.mr || r.title,
        slug: r.slug,
        notificationType: r.notification_type,
        category,
        categoryMr,
        advtNo: r.advt_no || ai.advt_number || null,
        pdfUrl: r.notification_pdf || (ai.mpsc_item_id ? `https://mpsc.gov.in/web/api/v1/downloadFile/english/${ai.mpsc_item_id}` : null),
        portalUrl: `/${routePrefix}/${r.slug}`,
        publishedAt: dateStr,
        sourceUrl: r.source_url || 'https://mpsc.gov.in',
      }
    })

    return ok({
      total: announcements.length,
      data: announcements,
      source: 'https://mpsc.gov.in',
      lastUpdated: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[API /api/mpsc/latest-announcements] Error:', err)
    return serverError('Failed to fetch MPSC announcements')
  }
}
