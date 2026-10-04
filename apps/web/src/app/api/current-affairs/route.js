import { NextResponse } from 'next/server'
import { CURRENT_AFFAIRS } from '@/lib/currentAffairsData'
import { query } from '@/lib/pgdb'

// Helper to clean HTML & XML entities
function cleanText(str) {
  if (!str) return ''
  let text = str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  // Decode common HTML entities FIRST so escaped tags become real tags and get stripped
  text = text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
  // Strip all HTML tags
  text = text.replace(/<[^>]+>/g, '')
  // Strip stray entities
  text = text.replace(/&[a-zA-Z0-9#]+;/g, ' ')
  return text.replace(/\s+/g, ' ').trim()
}

// Strip news source suffix from headline (e.g. " - PIB")
function stripSource(title) {
  const match = title.match(/\s*[-–—|]\s*([^–—|-]+)$/)
  if (match && match.index >= 15) {
    return {
      cleanTitle: title.substring(0, match.index).trim(),
      extractedSource: match[1].trim(),
    }
  }
  return { cleanTitle: title, extractedSource: '' }
}

// Categorize based on keywords
function categorize(text) {
  const lower = text.toLowerCase()
  if (/maharashtra|mumbai|pune|nagpur|mantralaya|mpsc|fadnavis|ladki bahin|konkan|vidarbha|police bharti/.test(lower)) {
    return 'Maharashtra'
  }
  if (/rbi|repo rate|inflation|gdp|economy|fiscal|budget|banking|rupee|stock|trade|forex|sebi|sensex/.test(lower)) {
    return 'Economy'
  }
  if (/isro|drdo|satellite|space|missile|ai|quantum|technology|cyber|nasa|defence/.test(lower)) {
    return 'Science & Tech'
  }
  if (/environment|climate|forest|wildlife|tiger|ramsar|pollution|solar|renewable|green|cop/.test(lower)) {
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

  if (category === 'Maharashtra' || /maharashtra|mpsc|police/.test(lower)) {
    tags.add('MPSC')
    tags.add('Police Bharti')
  }
  if (category === 'Economy' || /rbi|banking|loan|sebi|repo|inflation/.test(lower)) {
    tags.add('IBPS')
    tags.add('Banking')
    tags.add('MPSC')
    tags.add('UPSC')
  }
  if (/upsc|ias|ips|judiciary|constitution|parliament|bill|amendment|commission|treaty|summit/.test(lower)) {
    tags.add('UPSC')
    tags.add('MPSC')
    tags.add('SSC')
  }
  if (/ssc|cgl|chsl|railway|rrb|sports|isro/.test(lower)) {
    tags.add('SSC')
    tags.add('MPSC')
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

    const rawTitle = cleanText(titleMatch ? titleMatch[1] : '')
    const url = (linkMatch ? linkMatch[1] : '').replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
    const desc = cleanText(descMatch ? descMatch[1] : '')
    const srcName = cleanText(sourceMatch ? sourceMatch[1] : defaultSource)
    const pubDate = dateMatch ? new Date(dateMatch[1]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]

    if (rawTitle && url) {
      const { cleanTitle, extractedSource } = stripSource(rawTitle)
      const finalSource = extractedSource || srcName || defaultSource
      const combined = `${cleanTitle} ${desc}`
      const category = categorize(combined)
      const examTags = getExamTags(category, combined)
      const slug = cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 60)

      let summary = desc
      if (!desc || desc.length < 40 || desc.toLowerCase().includes(cleanTitle.toLowerCase()) || cleanTitle.toLowerCase().includes(desc.toLowerCase())) {
        summary = `Key government development concerning ${cleanTitle}. High relevance for ${examTags.join(', ')} aspirants covering recent administrative, economic, and policy updates.`
      } else {
        summary = desc.substring(0, 260) + (desc.length > 260 ? '...' : '')
      }

      items.push({
        id: `rss_${Buffer.from(url).toString('base64').substring(0, 16)}`,
        slug,
        date: pubDate,
        title: cleanTitle,
        summary,
        category,
        examTags,
        whyItMatters: `Frequently tested in ${examTags.join(', ')} General Studies and current affairs papers.`,
        sourceUrl: url,
        sourceName: finalSource,
        youtubeQuery: `${cleanTitle} UPSC MPSC analysis`,
        isLive: true,
      })
    }
  }

  return items
}

/**
 * GET /api/current-affairs?category=...&exam=...&search=...&page=...&limit=...
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'All'
  const exam = searchParams.get('exam') || 'All'
  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '60', 10)))

  const dbArticles = []

  // 1. Fetch pre-aggregated daily summaries from PostgreSQL (fastest & persistent)
  try {
    const rows = await query(
      `SELECT summary_date, digest
       FROM daily_ca_summaries
       ORDER BY summary_date DESC
       LIMIT 5`
    )
    if (rows && rows.length > 0) {
      for (const row of rows) {
        const articles = row.digest?.articles || []
        if (Array.isArray(articles)) {
          dbArticles.push(...articles)
        }
      }
    }
  } catch (dbErr) {
    // Non-fatal: continue with live feeds and curated data
    console.warn('[api/current-affairs] DB fetch note:', dbErr.message)
  }

  // 2. Fetch live RSS feeds — PIB, Google News, MPSC-specific sources
  const liveItems = []
  try {
    const feeds = [
      // PIB India via Google News (official press releases)
      {
        url: 'https://news.google.com/rss/search?q=' + encodeURIComponent('site:pib.gov.in when:2d') + '&hl=en-IN&gl=IN&ceid=IN:en',
        source: 'PIB India (Govt Press Releases)',
      },
      // Maharashtra Specific — MPSC, Police Bharti, State Govt
      {
        url: 'https://news.google.com/rss/search?q=' + encodeURIComponent('Maharashtra government OR Mantralaya OR MPSC when:3d') + '&hl=en-IN&gl=IN&ceid=IN:en',
        source: 'Maharashtra Governance Feed',
      },
      // MPSC-Specific (Marathi language)
      {
        url: 'https://news.google.com/rss/search?q=' + encodeURIComponent('MPSC चालू घडामोडी OR महाराष्ट्र शासन when:3d') + '&hl=mr&gl=IN&ceid=IN:mr',
        source: 'MPSC Current Affairs',
      },
      // National Governance & Cabinet
      {
        url: 'https://news.google.com/rss/search?q=' + encodeURIComponent('central government scheme OR cabinet decision OR ISRO OR DRDO when:3d') + '&hl=en-IN&gl=IN&ceid=IN:en',
        source: 'Cabinet & National Schemes',
      },
      // Economy & Banking (RBI, SEBI, Budget)
      {
        url: 'https://news.google.com/rss/search?q=' + encodeURIComponent('RBI OR repo rate OR inflation OR GDP India when:3d') + '&hl=en-IN&gl=IN&ceid=IN:en',
        source: 'Economic & Banking Feed',
      },
      // Police Bharti & Recruitment
      {
        url: 'https://news.google.com/rss/search?q=' + encodeURIComponent('Maharashtra police bharti OR police recruitment when:5d') + '&hl=en-IN&gl=IN&ceid=IN:en',
        source: 'Police Bharti Feed',
      },
      // Drishti IAS
      {
        url: 'https://www.drishtiias.com/rss.rss',
        source: 'Drishti IAS Current Affairs',
      },
    ]

    const responses = await Promise.allSettled(
      feeds.map(f =>
        fetch(f.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 ExamUdaanBot/1.0' },
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

  // 3. Deduplicate by normalized title
  const seenTitles = new Set()
  const combinedAll = []

  // Priority: Database daily records first, then curated seed entries, then live RSS
  const candidatePool = [...dbArticles, ...CURRENT_AFFAIRS, ...liveItems]
  for (const item of candidatePool) {
    if (!item || !item.title) continue
    const key = item.title.toLowerCase().substring(0, 42).trim()
    if (!seenTitles.has(key)) {
      seenTitles.add(key)
      combinedAll.push(item)
    }
  }

  // 4. Apply Filters
  const filtered = combinedAll.filter(ca => {
    const catMatch = category === 'All' || ca.category === category
    const examMatch = exam === 'All' || (Array.isArray(ca.examTags) && ca.examTags.includes(exam))
    const searchMatch =
      !search ||
      ca.title.toLowerCase().includes(search.toLowerCase()) ||
      (ca.summary && ca.summary.toLowerCase().includes(search.toLowerCase()))
    return catMatch && examMatch && searchMatch
  })

  // 5. Pagination offset/slice
  const offset = (page - 1) * limit
  const paginatedItems = filtered.slice(offset, offset + limit)
  const totalPages = Math.ceil(filtered.length / limit)

  const response = NextResponse.json({
    total: filtered.length,
    page,
    limit,
    totalPages,
    items: paginatedItems,
    dbCount: dbArticles.length,
    curatedCount: CURRENT_AFFAIRS.length,
    liveCount: liveItems.length,
    timestamp: new Date().toISOString(),
  })

  // Cache for 30 minutes on edge / CDN
  response.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
  return response
}
