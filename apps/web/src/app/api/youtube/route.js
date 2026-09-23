// ============================================================
// app/api/youtube/route.js — YouTube Data API v3 Proxy
// Fetches videos from a channel or by search query
// Keeps API key server-side only
// ============================================================

import { NextResponse } from 'next/server'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'
const API_KEY = process.env.YOUTUBE_API_KEY

/**
 * GET /api/youtube?channelId=UCxxxxxx&maxResults=12
 * GET /api/youtube?q=MPSC+2026&maxResults=12
 * GET /api/youtube?playlistId=PLxxxxxx&maxResults=12
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const channelId  = searchParams.get('channelId')
  const q          = searchParams.get('q')
  const playlistId = searchParams.get('playlistId')
  const maxResults = parseInt(searchParams.get('maxResults') || '12', 10)
  const pageToken  = searchParams.get('pageToken') || ''

  // If no API key configured, return demo data so UI still renders
  if (!API_KEY) {
    return NextResponse.json({
      error: 'YOUTUBE_API_KEY not configured',
      demo: true,
      items: getDemoVideos(),
    }, { status: 200 })
  }

  try {
    let url

    if (playlistId) {
      // Fetch from a specific playlist
      url = `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${maxResults}&pageToken=${pageToken}&key=${API_KEY}`
    } else if (channelId) {
      // Search within a specific channel
      url = `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${maxResults}&pageToken=${pageToken}&key=${API_KEY}`
    } else if (q) {
      // General search
      url = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(q)}&type=video&order=relevance&maxResults=${maxResults}&pageToken=${pageToken}&key=${API_KEY}`
    } else {
      return NextResponse.json({ error: 'Provide channelId, playlistId, or q param' }, { status: 400 })
    }

    const res = await fetch(url, { next: { revalidate: 3600 } }) // Cache 1 hour
    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err?.error?.message || 'YouTube API error' }, { status: res.status })
    }

    const data = await res.json()

    // Normalize response into consistent shape
    const items = (data.items || []).map(item => {
      // Handle both search results and playlistItems
      const snippet = item.snippet || {}
      const videoId = item.id?.videoId || item.contentDetails?.videoId || item.id
      return {
        videoId,
        title:        snippet.title || '',
        description:  snippet.description || '',
        thumbnail:    snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
        channelTitle: snippet.channelTitle || '',
        publishedAt:  snippet.publishedAt || '',
      }
    }).filter(v => v.videoId) // Remove items without a video ID

    return NextResponse.json({
      items,
      nextPageToken: data.nextPageToken || null,
      totalResults:  data.pageInfo?.totalResults || items.length,
    })
  } catch (err) {
    console.error('[YouTube API]', err)
    return NextResponse.json({ error: 'Internal error', demo: true, items: getDemoVideos() }, { status: 200 })
  }
}

// Pre-cooked educational videos shown when no API key is configured
function getDemoVideos() {
  return [
    {
      videoId: 'pAgnJDJN4VA',
      title: 'Google NotebookLM Complete Tutorial — Turn Any PDF into AI Audio & Notes',
      channelTitle: 'ExamUdaan AI Labs',
      thumbnail: 'https://i.ytimg.com/vi/pAgnJDJN4VA/mqdefault.jpg',
      publishedAt: '2026-09-18',
    },
    {
      videoId: 'ScMzIvxBSi4',
      title: 'UPSC GS Paper 1 — Top 50 High-Yield Topics Strategy 2026',
      channelTitle: 'StudyIQ IAS',
      thumbnail: 'https://i.ytimg.com/vi/ScMzIvxBSi4/mqdefault.jpg',
      publishedAt: '2026-09-15',
    },
    {
      videoId: 'o_XVt5rdpFY',
      title: 'Banking PO 2026 — Complete Quantitative Aptitude & Speed Math Secrets',
      channelTitle: 'Adda247 Banking',
      thumbnail: 'https://i.ytimg.com/vi/o_XVt5rdpFY/mqdefault.jpg',
      publishedAt: '2026-09-14',
    },
    {
      videoId: 'VYOjWnS4cMY',
      title: 'SSC CGL 2026 Complete Notification Breakdown, Syllabus & Booklist',
      channelTitle: 'SSC Adda247',
      thumbnail: 'https://i.ytimg.com/vi/VYOjWnS4cMY/mqdefault.jpg',
      publishedAt: '2026-09-12',
    },
    {
      videoId: 'eALQAHLUdkU',
      title: 'GATE 2026 Computer Science — Complete 6-Month Preparation Roadmap',
      channelTitle: 'GATE Wallah',
      thumbnail: 'https://i.ytimg.com/vi/eALQAHLUdkU/mqdefault.jpg',
      publishedAt: '2026-09-10',
    },
    {
      videoId: 'Z-zNHHpX3iw',
      title: 'Anki App for UPSC & Competitive Exams: Spaced Repetition Mastery',
      channelTitle: 'Anki Mastery',
      thumbnail: 'https://i.ytimg.com/vi/Z-zNHHpX3iw/mqdefault.jpg',
      publishedAt: '2026-09-08',
    },
  ]
}
