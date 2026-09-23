// ============================================================
// app/api/admin/sitemap/ping/route.js — Sitemap Test & Search Engine Ping API
// ExamUdaan | Notifies Google & Bing of sitemap updates
// ============================================================

import { NextResponse } from 'next/server'
import { ok, serverError } from '../../../../../lib/apiResponse'
import sitemap from '../../../../sitemap'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rawBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
    const BASE_URL = (rawBase && !rawBase.includes('localhost')) ? rawBase : 'https://examudaan.in'
    const sitemapUrl = `${BASE_URL}/sitemap.xml`

    // Generate sitemap items
    const entries = await sitemap()
    const totalUrls = entries.length

    // Breakdown
    const stats = {
      total: totalUrls,
      staticHubs: entries.filter(e => !e.url.includes('/ai-tools/') && !e.url.includes('/jobs/') && !e.url.includes('/results/') && !e.url.includes('/admit-cards/') && !e.url.includes('/answer-keys/') && !e.url.includes('/schemes/') && !e.url.includes('/mock-tests/') && !e.url.includes('/syllabus/') && !e.url.includes('/blog/')).length,
      aiTools: entries.filter(e => e.url.includes('/ai-tools/')).length,
      mockTests: entries.filter(e => e.url.includes('/mock-tests/')).length,
      syllabi: entries.filter(e => e.url.includes('/syllabus/')).length,
      blog: entries.filter(e => e.url.includes('/blog/')).length,
      youtube: entries.filter(e => e.url.includes('/youtube')).length,
      aiNews: entries.filter(e => e.url.includes('/ai-news')).length,
      notifications: entries.filter(e => e.url.includes('/jobs/') || e.url.includes('/results/') || e.url.includes('/admit-cards/') || e.url.includes('/answer-keys/') || e.url.includes('/schemes/')).length,
    }

    // Ping Bing (Bing officially supports XML sitemap pings)
    let bingStatus = 'skipped'
    try {
      const bingRes = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
        headers: { 'User-Agent': 'ExamUdaan-Sitemap-Bot/1.0' },
        signal: AbortSignal.timeout(5000),
      })
      bingStatus = bingRes.ok ? 'success' : `failed (${bingRes.status})`
    } catch {
      bingStatus = 'timeout / network error'
    }

    return ok({
      sitemapUrl,
      stats,
      pings: {
        bing: bingStatus,
        google: 'Google Search Console requires direct web submission or Search Console API (direct link provided in admin)',
      },
      searchConsoleUrl: `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(BASE_URL + '/')}`,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Sitemap ping error:', err)
    return serverError('Failed to generate sitemap ping: ' + err.message)
  }
}
