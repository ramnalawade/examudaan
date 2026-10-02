// ============================================================
// app/api/current-affairs/route.js — Real-Time Current Affairs Aggregator
// Fetches daily fresh government press releases & exam current affairs
// from PIB India, Google News (Govt & Maharashtra), RBI & Economy RSS.
// Merges with high-yield curated database from lib/currentAffairsData.js.
// ============================================================

import { NextResponse } from 'next/server'
import { CURRENT_AFFAIRS } from '@/lib/currentAffairsData'

// Helper to clean HTML & XML entities
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

// Categorize based on keywords
function categorize(text) {
  const lower = text.toLowerCase()
  if (/maharashtra|mumbai|pune|nagpur|mantralaya|mpsc|fadnavis|ladki bahin|konkan|vidarbha/.test(lower)) {
    return 'Maharashtra'
  }
  if (/rbi|repo rate|inflation|gdp|economy|fiscal|budget|banking|rupee|stock|trade|forex|sebi/.test(lower)) {
    return 'Economy'
  }
  if (/isro|drdo|satellite|space|missile|ai|quantum|technology|cyber|nasa|defence/.test(lower)) {
    return 'Science & Tech'
  }
  if (/environment|climate|forest|wildlife|tiger|ramsar|pollution|solar|renewable|green|cop2/.test(lower)) {
    return 'Environment'
  }
  if (/olympics|cricket|sports|medal|badminton|hockey|chess|world cup|asian games/.test(lower)) {
    return 'Sports'
  }
  if (/un |united nations|brics|g20|summit|treaty|foreign|bilateral|diplomacy|president|prime minister/.test(lower)) {
    return 'International'
  }
  return 'National'
}

// Determine exam relevance tags
function getExamTags(category, text) {
  const lower = text.toLowerCase()
  const tags = new Set()

  if (category === 'Maharashtra' || /maharashtra|mpsc/.test(lower)) {
    tags.add('MPSC')
    tags.add('Police Bharti')
  }
  if (category === 'Economy' || /rbi|banking|loan|sebi/.test(lower)) {
    tags.add('IBPS')
    tags.add('Banking')
    tags.add('MPSC')
    tags.add('UPSC')
  }
  if (/upsc|ias|ips|judiciary|constitution|parliament|bill|amendment|commission/.test(lower)) {
    tags.add('UPSC')
    tags.add('MPSC')
    tags.add('SSC')
  }
  if (/ssc|cgl|chsl|railway|rrb/.test(lower)) {
    tags.add('SSC')
  }

  if (tags.size === 0) {
    tags.add('MPSC')
    tags.add('UPSC')
    tags.add('SSC')
  }

  return Array.from(tags)
}

// Parse generic RSS/Atom XML string
function parseRss(xmlText, defaultSource = 'Govt Press Release') {
  const items = []
  if (!xmlText) return items

  const itemMatches = xmlText.match(/<item[\s>]([\s\S]*?)<\/item>/gi) || []

  for (const rawItem of itemMatches) {
    const titleMatch = rawItem.match(/<title>([\s\S]*?)<\/title>/i)
    const linkMatch = rawItem.match(/<link>([\s\S]*?)<\/link>/i) || rawItem.match(/<link\s+href=["']([^"']+)["']/i)
    const dateMatch = rawItem.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || rawItem.match(/<dc:date>([\s\S]*?)<\/dc:date>/i)
    const descMatch = rawItem.match(/<description>([\s\S]*?)<\/description>/i)
    const sourceMatch = rawItem.match(/<source[^>]*>([\s\S]*?)<\/source>/i)

    const title = cleanText(titleMatch ? titleMatch[1] : '')
    const url = (linkMatch ? linkMatch[1] : '').replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
    const desc = cleanText(descMatch ? descMatch[1] : '')
    const srcName = cleanText(sourceMatch ? sourceMatch[1] : defaultSource)
    const pubDate = dateMatch ? new Date(dateMatch[1]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]

    if (title && url) {
      const combined = `${title} ${desc}`
      const category = categorize(combined)
      const examTags = getExamTags(category, combined)
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 60)

      items.push({
        id: `rss_${Buffer.from(url).toString('base64').substring(0, 16)}`,
        slug,
        date: pubDate,
        title,
        summary: desc ? desc.substring(0, 260) + (desc.length > 260 ? '...' : '') : title,
        category,
        examTags,
        whyItMatters: `High priority for ${examTags.join(', ')} aspirants. Key target for General Studies and current affairs papers.`,
        sourceUrl: url,
        sourceName: srcName || defaultSource,
        youtubeQuery: `${title} UPSC MPSC analysis`,
        isLive: true,
      })
    }
  }

  return items
}

/**
 * GET /api/current-affairs?category=...&exam=...&search=...&limit=...
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'All'
  const exam = searchParams.get('exam') || 'All'
  const search = searchParams.get('search') || ''
  const limit = parseInt(searchParams.get('limit') || '60', 10)

  const liveItems = []

  // ── Fetch live RSS feeds — PIB, Google News, MPSC-specific sources ───────────
  try {
    const feeds = [
      // National Governance
      {
        url: 'https://news.google.com/rss/search?q=government+scheme+OR+MPSC+OR+UPSC+OR+budget+when:5d&hl=en-IN&gl=IN&ceid=IN:en',
        source: 'National Governance Feed',
      },
      // Maharashtra Specific — MPSC, Police Bharti, State Govt
      {
        url: 'https://news.google.com/rss/search?q=Maharashtra+government+OR+Mantralaya+OR+MPSC+when:5d&hl=en-IN&gl=IN&ceid=IN:en',
        source: 'Maharashtra Governance Feed',
      },
      // MPSC-Specific (Marathi language Google News)
      {
        url: 'https://news.google.com/rss/search?q=MPSC+2026+OR+MPSC+bharti+OR+MPSC+result+when:7d&hl=mr&gl=IN&ceid=IN:mr',
        source: 'MPSC Current Affairs',
      },
      // Economy & Banking (RBI, SEBI, Budget)
      {
        url: 'https://news.google.com/rss/search?q=RBI+OR+repo+rate+OR+inflation+OR+GDP+India+when:5d&hl=en-IN&gl=IN&ceid=IN:en',
        source: 'Economic & Banking Feed',
      },
      // Police Bharti & Recruitment
      {
        url: 'https://news.google.com/rss/search?q=Maharashtra+police+bharti+OR+police+recruitment+Maharashtra+2026&hl=en-IN&gl=IN&ceid=IN:en',
        source: 'Police Bharti Feed',
      },
      // PIB India — official government press releases
      {
        url: 'https://www.pib.gov.in/RssMain.aspx',
        source: 'PIB India — Govt Press Releases',
      },
      // Drishti IAS — curated current affairs (great for MPSC/UPSC)
      {
        url: 'https://www.drishtiias.com/rss.rss',
        source: 'Drishti IAS Current Affairs',
      },
      // AffairsCloud — daily current affairs digest
      {
        url: 'https://affairscloud.com/feed/',
        source: 'AffairsCloud Daily Digest',
      },
    ]

    const responses = await Promise.allSettled(
      feeds.map(f =>
        fetch(f.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ExamUdaanBot/1.0)' },
          next: { revalidate: 1800 },
        })
          .then(async res => {
            if (!res.ok) return []
            const xml = await res.text()
            return parseRss(xml, f.source)
          })
          .catch(() => [])
      )
    )

    responses.forEach(r => {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        liveItems.push(...r.value)
      }
    })
  } catch (err) {
    console.error('Error fetching live current affairs feeds:', err)
  }

  // Deduplicate live items by normalized title
  const seenTitles = new Set()
  const uniqueLive = []
  for (const item of liveItems) {
    const key = item.title.toLowerCase().substring(0, 40)
    if (!seenTitles.has(key)) {
      seenTitles.add(key)
      uniqueLive.push(item)
    }
  }

  // Combine curated seed entries with live items (curated entries take precedence)
  const combined = [...CURRENT_AFFAIRS, ...uniqueLive]

  // Filter
  const filtered = combined.filter(ca => {
    const catMatch = category === 'All' || ca.category === category
    const examMatch = exam === 'All' || ca.examTags.includes(exam)
    const searchMatch =
      !search ||
      ca.title.toLowerCase().includes(search.toLowerCase()) ||
      ca.summary.toLowerCase().includes(search.toLowerCase())
    return catMatch && examMatch && searchMatch
  })

  return NextResponse.json({
    total: filtered.length,
    items: filtered.slice(0, limit),
    curatedCount: CURRENT_AFFAIRS.length,
    liveCount: uniqueLive.length,
    timestamp: new Date().toISOString(),
  })
}
