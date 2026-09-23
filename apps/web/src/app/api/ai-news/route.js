// ============================================================
// app/api/ai-news/route.js — Real-Time AI News & Research RSS Aggregator
// Fetches daily fresh feeds from Google News AI (India & Global),
// TechCrunch AI RSS, ArXiv CS.AI Research, and Hacker News.
// Always current, zero paid API keys, cached for 30 minutes.
// ============================================================

import { NextResponse } from 'next/server'

// Clean HTML & XML entities
function cleanText(str) {
  if (!str) return ''
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Parse generic RSS/Atom XML string into standard news items
function parseRssItems(xmlText, defaultSource = 'AI News', sourceIcon = '📰', category = 'AI News') {
  const items = []
  if (!xmlText) return items

  // Match all <item>...</item> tags
  const itemMatches = xmlText.match(/<item[\s>]([\s\S]*?)<\/item>/gi) || []

  for (const rawItem of itemMatches) {
    const titleMatch = rawItem.match(/<title>([\s\S]*?)<\/title>/i)
    const linkMatch  = rawItem.match(/<link>([\s\S]*?)<\/link>/i) || rawItem.match(/<link\s+href=["']([^"']+)["']/i)
    const dateMatch  = rawItem.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || rawItem.match(/<dc:date>([\s\S]*?)<\/dc:date>/i)
    const descMatch  = rawItem.match(/<description>([\s\S]*?)<\/description>/i)
    const sourceMatch = rawItem.match(/<source[^>]*>([\s\S]*?)<\/source>/i)

    const title = cleanText(titleMatch ? titleMatch[1] : '')
    const url   = (linkMatch ? linkMatch[1] : '').replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
    const desc  = cleanText(descMatch ? descMatch[1] : '')
    const srcName = cleanText(sourceMatch ? sourceMatch[1] : defaultSource)
    const pubDate = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString()

    if (title && url) {
      items.push({
        id: `rss_${Buffer.from(url).toString('base64').substring(0, 16)}`,
        source: srcName || defaultSource,
        sourceIcon,
        title,
        url,
        summary: desc ? desc.substring(0, 220) + (desc.length > 220 ? '...' : '') : '',
        publishedAt: pubDate,
        category,
      })
    }
  }

  return items
}

/**
 * GET /api/ai-news?source=all|news|arxiv|hn&limit=30
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') || 'all'
  const limit  = parseInt(searchParams.get('limit') || '30', 10)

  const results = []
  const sourcesActive = []
  const errors = []

  // ── 1. Google News RSS: Latest AI & Generative AI (Updated Continuously) ──
  if (source === 'all' || source === 'news' || source === 'rss') {
    try {
      const gnewsUrl = 'https://news.google.com/rss/search?q=Artificial+Intelligence+OR+Generative+AI+OR+LLM+when:3d&hl=en-IN&gl=IN&ceid=IN:en'
      const res = await fetch(gnewsUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ExamUdaanNewsBot/1.0' },
        next: { revalidate: 1800 },
      })
      if (res.ok) {
        const xml = await res.text()
        const parsed = parseRssItems(xml, 'Google AI News', '🌐', 'AI News')
        results.push(...parsed.slice(0, 14))
        sourcesActive.push('Google News AI')
      }
    } catch (e) {
      errors.push('Google News RSS: ' + e.message)
    }

    // TechCrunch AI RSS
    try {
      const tcUrl = 'https://techcrunch.com/category/artificial-intelligence/feed/'
      const res = await fetch(tcUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 ExamUdaanNewsBot/1.0' },
        next: { revalidate: 1800 },
      })
      if (res.ok) {
        const xml = await res.text()
        const parsed = parseRssItems(xml, 'TechCrunch AI', '⚡', 'AI Breakthrough')
        results.push(...parsed.slice(0, 8))
        sourcesActive.push('TechCrunch AI')
      }
    } catch (e) {
      errors.push('TechCrunch RSS: ' + e.message)
    }
  }

  // ── 2. ArXiv CS.AI Research Papers (Daily Fresh Preprints) ──
  if (source === 'all' || source === 'arxiv') {
    try {
      const arxivRes = await fetch(
        'https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending',
        { next: { revalidate: 3600 } }
      )
      if (arxivRes.ok) {
        const xml = await arxivRes.text()
        const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || []
        entries.forEach((entry, i) => {
          const titleRaw = (entry.match(/<title>([\s\S]*?)<\/title>/) || [])[1]
          const idRaw    = (entry.match(/<id>([\s\S]*?)<\/id>/) || [])[1]
          const summaryRaw = (entry.match(/<summary>([\s\S]*?)<\/summary>/) || [])[1]
          const updatedRaw = (entry.match(/<updated>([\s\S]*?)<\/updated>/) || [])[1]

          const title = cleanText(titleRaw)
          const url   = idRaw?.trim()
          const summary = cleanText(summaryRaw)

          if (title && url) {
            results.push({
              id: `arxiv_${i}_${Date.now()}`,
              source: 'ArXiv AI Research',
              sourceIcon: '🔬',
              title,
              url,
              summary: summary.substring(0, 200) + (summary.length > 200 ? '...' : ''),
              publishedAt: updatedRaw ? new Date(updatedRaw).toISOString() : new Date().toISOString(),
              category: 'Research Paper',
            })
          }
        })
        sourcesActive.push('ArXiv Research')
      }
    } catch (e) {
      errors.push('ArXiv: ' + e.message)
    }
  }

  // ── 3. Hacker News AI Discussions ──
  if (source === 'all' || source === 'hn') {
    try {
      const hnRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', { next: { revalidate: 1800 } })
      if (hnRes.ok) {
        const topIds = await hnRes.json()
        const storyFetches = topIds.slice(0, 40).map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { next: { revalidate: 1800 } })
            .then(r => r.json())
            .catch(() => null)
        )
        const stories = await Promise.all(storyFetches)
        const AI_KEYWORDS = ['ai', 'gpt', 'llm', 'machine learning', 'deepseek', 'anthropic', 'claude', 'openai', 'gemini', 'transformer', 'neural', 'cursor', 'copilot', 'agent']

        stories
          .filter(s => s && s.title && s.type === 'story' && s.url)
          .filter(s => AI_KEYWORDS.some(kw => s.title.toLowerCase().includes(kw) || (s.url || '').toLowerCase().includes(kw)))
          .slice(0, 6)
          .forEach(s => {
            results.push({
              id: `hn_${s.id}`,
              source: 'Hacker News',
              sourceIcon: '🔶',
              title: cleanText(s.title),
              url: s.url,
              points: s.score,
              comments: s.descendants || 0,
              publishedAt: new Date(s.time * 1000).toISOString(),
              category: 'Tech Community',
            })
          })
        sourcesActive.push('Hacker News')
      }
    } catch (e) {
      errors.push('Hacker News: ' + e.message)
    }
  }

  // Deduplicate by normalized title
  const seenTitles = new Set()
  const uniqueResults = []
  for (const item of results) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!seenTitles.has(key)) {
      seenTitles.add(key)
      uniqueResults.push(item)
    }
  }

  // Sort by newest publication date
  uniqueResults.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  const response = NextResponse.json({
    items: uniqueResults.slice(0, limit),
    total: uniqueResults.length,
    sources: Array.from(new Set(sourcesActive)),
    errors: errors.length ? errors : undefined,
    refreshedAt: new Date().toISOString(),
  })

  // Cache at CDN/edge for 30 minutes, serve stale for 60 minutes while revalidating
  response.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
  return response
}
