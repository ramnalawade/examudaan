// ============================================================
// app/api/admin/search-analytics/route.js — Search Intelligence & Content Gap Analysis
// ExamUdaan | High-Yield Search Insights:
// 1. Top Candidate Searches (What aspirants want most)
// 2. Zero-Result Content Gaps (What pages/exams we should create next)
// 3. Real-time Search Feed (Live queries with timestamps)
// ============================================================

import { query as pgQuery } from '../../../../lib/pgdb.js'
import { ok, serverError } from '../../../../lib/apiResponse.js'

export async function GET(req) {
  try {
    // 1. Top overall searches in last 30 days
    const topQueries = await pgQuery(`
      SELECT 
        query,
        COUNT(*) AS total_searches,
        ROUND(AVG(results_count)) AS avg_results,
        MAX(created_at) AS last_searched
      FROM search_queries
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY query
      ORDER BY total_searches DESC
      LIMIT 25;
    `)

    // 2. Zero-Result Searches (Content Gap Discovery — what pages to add!)
    const zeroResultQueries = await pgQuery(`
      SELECT 
        query,
        COUNT(*) AS missed_count,
        MAX(created_at) AS last_missed
      FROM search_queries
      WHERE results_count = 0
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY query
      ORDER BY missed_count DESC
      LIMIT 25;
    `)

    // 3. Recent 30 live candidate searches
    const recentQueries = await pgQuery(`
      SELECT id, query, category, results_count, created_at
      FROM search_queries
      ORDER BY created_at DESC
      LIMIT 30;
    `)

    // 4. Aggregate Summary Stats
    const summaryStats = await pgQuery(`
      SELECT 
        COUNT(*) AS total_searches_30d,
        COUNT(DISTINCT query) AS unique_queries_30d,
        COUNT(*) FILTER (WHERE results_count = 0) AS zero_result_searches_30d,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') AS searches_last_24h
      FROM search_queries
      WHERE created_at >= NOW() - INTERVAL '30 days';
    `)

    const stats = summaryStats[0] || {
      total_searches_30d: 0,
      unique_queries_30d: 0,
      zero_result_searches_30d: 0,
      searches_last_24h: 0
    }

    const total = parseInt(stats.total_searches_30d || '0', 10)
    const zeroCount = parseInt(stats.zero_result_searches_30d || '0', 10)
    const zeroRate = total > 0 ? ((zeroCount / total) * 100).toFixed(1) + '%' : '0%'

    return ok({
      stats: {
        totalSearches30d: total,
        uniqueQueries30d: parseInt(stats.unique_queries_30d || '0', 10),
        zeroResultCount30d: zeroCount,
        zeroResultRate: zeroRate,
        searchesLast24h: parseInt(stats.searches_last_24h || '0', 10)
      },
      topQueries: topQueries || [],
      zeroResultQueries: zeroResultQueries || [],
      recentQueries: recentQueries || []
    })
  } catch (err) {
    console.error('[admin/search-analytics] Error fetching search analytics:', err)
    return serverError('Failed to fetch search analytics')
  }
}
