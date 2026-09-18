import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { withAuth } from '../../../../lib/auth'

// ============================================================
// app/api/admin/scrapers/route.js — Admin Scraper Logs
// ============================================================

export const GET = withAuth(async (request, ctx, user) => {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '50', 10)
    const start = (page - 1) * limit
    const end = start + limit - 1

    if (!supabase) {
      return NextResponse.json({
        success: true,
        data: [
          { id: 1, spider_name: 'ssc_spider', status: 'done', items_new: 14, items_updated: 2, started_at: new Date().toISOString(), duration_seconds: 45 },
          { id: 2, spider_name: 'upsc_spider', status: 'error', items_new: 0, items_updated: 0, started_at: new Date(Date.now() - 86400000).toISOString(), duration_seconds: 12, error_message: 'Connection timeout' },
        ],
        count: 2
      })
    }

    const { data, error, count } = await supabase
      .from('scraper_logs')
      .select('*', { count: 'exact' })
      .order('started_at', { ascending: false })
      .range(start, end)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data,
      count: count
    })
  } catch (error) {
    console.error('Admin scraper logs fetch error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
})
