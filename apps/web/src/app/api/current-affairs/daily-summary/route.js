// ============================================================
// app/api/current-affairs/daily-summary/route.js
// Generates & serves a daily Chalu Ghadamodi (Current Affairs) digest
// using Gemini API to summarize today's top articles.
//
// GET /api/current-affairs/daily-summary?date=2026-10-01
//   Returns pre-generated digest for that date, or falls back to live generation.
//
// POST /api/current-affairs/daily-summary
//   Triggers generation for today (used by cron job).
//   Protected: requires X-Cron-Secret header = CRON_SECRET env var.
// ============================================================

import { NextResponse } from 'next/server'
import { query } from '@/lib/pgdb'

// ── Helpers ────────────────────────────────────────────────────

function cleanText(str) {
  if (!str) return ''
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim()
}

function parseRssItems(xmlText, source) {
  const items = []
  const matches = xmlText.match(/<item[\s>]([\s\S]*?)<\/item>/gi) || []
  for (const raw of matches) {
    const titleM = raw.match(/<title>([\s\S]*?)<\/title>/i)
    const linkM  = raw.match(/<link>([\s\S]*?)<\/link>/i)
    const descM  = raw.match(/<description>([\s\S]*?)<\/description>/i)
    const dateM  = raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)
    const title  = cleanText(titleM?.[1] || '')
    const url    = (linkM?.[1] || '').replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
    const desc   = cleanText(descM?.[1] || '')
    const date   = dateM ? new Date(dateM[1]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    if (title && url) items.push({ title, url, desc, date, source })
  }
  return items
}

// Categorize article into one of 5 sections
function categorize(text) {
  const t = text.toLowerCase()
  if (/maharashtra|mumbai|pune|nagpur|mpsc|mantralaya|konkan|vidarbha|marathwada|ladki bahin/.test(t))
    return 'Maharashtra'
  if (/rbi|repo rate|inflation|gdp|economy|fiscal|budget|banking|rupee|sebi|sensex/.test(t))
    return 'Economy'
  if (/isro|drdo|satellite|space|missile|technology|cyber|ai|quantum|defence/.test(t))
    return 'Science & Tech'
  if (/environment|climate|forest|wildlife|tiger|ramsar|pollution|solar|renewable/.test(t))
    return 'Environment'
  if (/olympic|cricket|sports|medal|badminton|hockey|world cup|asian games/.test(t))
    return 'Sports'
  return 'National'
}

// Tag exam relevance
function examTags(category, text) {
  const t = text.toLowerCase()
  const tags = new Set()
  if (category === 'Maharashtra' || /mpsc/.test(t)) {
    tags.add('MPSC').add('Police Bharti').add('Talathi')
  }
  if (category === 'Economy' || /rbi|banking/.test(t)) {
    tags.add('IBPS').add('Banking').add('MPSC').add('UPSC')
  }
  if (/upsc|ias|ips|constitution|parliament|bill|amendment/.test(t)) {
    tags.add('UPSC').add('MPSC').add('SSC')
  }
  if (tags.size === 0) { tags.add('MPSC').add('UPSC').add('SSC') }
  return [...tags]
}

// Format date as "01 October 2026"
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

// Try to get Gemini summary (best-effort; falls back to structured headline list)
async function generateGeminiSummary(articles, targetDate) {
  const apiKey = process.env.GEMINI_API_KEY?.split(',')[0]?.trim()
  if (!apiKey) return null

  const articleList = articles.slice(0, 15).map((a, i) =>
    `${i + 1}. ${a.title}\n   Source: ${a.source}\n   ${a.desc?.slice(0, 200) || ''}`
  ).join('\n\n')

  const prompt = `You are an expert current affairs analyst for Indian government competitive exams (MPSC, UPSC, SSC, Police Bharti, Banking).

Today's date: ${targetDate}

Below are today's top news headlines. Write a structured "Chalu Ghadamodi" (Current Affairs) digest in the following format:

OUTPUT FORMAT (JSON):
{
  "date": "${targetDate}",
  "title_en": "Current Affairs ${formatDate(targetDate)} — Daily Digest",
  "title_mr": "चालू घडामोडी ${new Date(targetDate).toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}",
  "summary_en": "2-3 sentence overview of today's most important news for exam aspirants",
  "summary_mr": "Marathi translation of the summary",
  "sections": [
    {
      "category": "National/Maharashtra/Economy/Science & Tech/Environment/Sports",
      "articles": [
        {
          "title": "concise headline",
          "detail": "2-3 sentence explanation with exam relevance",
          "exam_angle": "why this matters for MPSC/UPSC/SSC",
          "exam_tags": ["MPSC", "UPSC"]
        }
      ]
    }
  ],
  "key_terms": ["term1", "term2"],
  "one_liners": ["fact1 suitable for one-liner MCQ", "fact2"]
}

TODAY'S NEWS:
${articleList}

Return ONLY valid JSON. No markdown code blocks.`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return null
    return JSON.parse(text)
  } catch (err) {
    console.error('[daily-summary] Gemini error:', err.message)
    return null
  }
}

// Build a fallback (no Gemini) structured digest from raw articles
function buildFallbackDigest(articles, targetDate) {
  // Group by category
  const grouped = {}
  for (const a of articles.slice(0, 20)) {
    const cat = categorize(`${a.title} ${a.desc}`)
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push({
      title: a.title,
      detail: a.desc?.slice(0, 300) || a.title,
      exam_angle: `Important for ${examTags(cat, `${a.title} ${a.desc}`).join(', ')} aspirants`,
      exam_tags: examTags(cat, `${a.title} ${a.desc}`),
      sourceUrl: a.url,
    })
  }

  const sections = Object.entries(grouped).map(([category, arts]) => ({
    category,
    articles: arts,
  }))

  return {
    date: targetDate,
    title_en: `Current Affairs ${formatDate(targetDate)} — Daily Digest`,
    title_mr: `चालू घडामोडी — ${formatDate(targetDate)}`,
    summary_en: `Today's current affairs digest covering ${sections.length} categories with ${articles.length} articles relevant for MPSC, UPSC, SSC, and banking exams.`,
    summary_mr: `आजच्या चालू घडामोडी — ${sections.length} विभागांमध्ये ${articles.length} महत्त्वाच्या बातम्या.`,
    sections,
    key_terms: [],
    one_liners: [],
    generated_by: 'fallback',
  }
}

// ── GET — Fetch digest for a date ─────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0]

  // 1. Try DB cache first (fast path)
  try {
    const row = await query(
      `SELECT digest FROM daily_ca_summaries WHERE summary_date = $1 LIMIT 1`,
      [dateParam]
    )
    if (row.length > 0 && row[0].digest) {
      return NextResponse.json(row[0].digest, {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' }
      })
    }
  } catch (_) {
    // DB may not have the table yet — fall through to live generation
  }

  // 2. Generate live (slower path — happens when no cached digest exists)
  const liveFeeds = [
    {
      url: 'https://news.google.com/rss/search?q=government+OR+MPSC+OR+UPSC+when:1d&hl=en-IN&gl=IN&ceid=IN:en',
      source: 'Google News India',
    },
    {
      url: 'https://news.google.com/rss/search?q=Maharashtra+government+OR+MPSC+when:1d&hl=en-IN&gl=IN&ceid=IN:en',
      source: 'Maharashtra News',
    },
    {
      url: 'https://www.drishtiias.com/rss.rss',
      source: 'Drishti IAS',
    },
  ]

  const rawArticles = []
  await Promise.allSettled(
    liveFeeds.map(f =>
      fetch(f.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ExamUdaanBot/1.0)' },
        signal: AbortSignal.timeout(6000),
      })
        .then(r => r.text())
        .then(xml => rawArticles.push(...parseRssItems(xml, f.source)))
        .catch(() => {})
    )
  )

  // Try Gemini summary; fall back to structured list
  const geminiDigest = await generateGeminiSummary(rawArticles, dateParam)
  const digest = geminiDigest || buildFallbackDigest(rawArticles, dateParam)
  digest.article_count = rawArticles.length

  return NextResponse.json(digest, {
    headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' }
  })
}

// ── POST — Trigger digest generation (cron) ───────────────────
export async function POST(request) {
  // Validate cron secret
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]

  // Check if already generated today
  try {
    const existing = await query(
      `SELECT id FROM daily_ca_summaries WHERE summary_date = $1 LIMIT 1`,
      [today]
    )
    if (existing.length > 0) {
      return NextResponse.json({ status: 'already_exists', date: today })
    }
  } catch (_) {
    // Table may not exist — proceed and attempt generation
  }

  // Fetch articles and generate digest
  const feeds = [
    { url: 'https://news.google.com/rss/search?q=government+MPSC+UPSC+India+when:1d&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News India' },
    { url: 'https://news.google.com/rss/search?q=Maharashtra+government+MPSC+when:1d&hl=en-IN&gl=IN&ceid=IN:en', source: 'Maharashtra News' },
    { url: 'https://www.drishtiias.com/rss.rss', source: 'Drishti IAS' },
    { url: 'https://affairscloud.com/feed/', source: 'AffairsCloud' },
  ]

  const articles = []
  await Promise.allSettled(
    feeds.map(f =>
      fetch(f.url, { headers: { 'User-Agent': 'ExamUdaanBot/1.0' }, signal: AbortSignal.timeout(8000) })
        .then(r => r.text())
        .then(xml => articles.push(...parseRssItems(xml, f.source)))
        .catch(() => {})
    )
  )

  const geminiDigest = await generateGeminiSummary(articles, today)
  const digest = geminiDigest || buildFallbackDigest(articles, today)
  digest.article_count = articles.length

  // Save to DB
  try {
    await query(
      `INSERT INTO daily_ca_summaries (summary_date, digest, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (summary_date) DO UPDATE SET digest = $2, created_at = NOW()`,
      [today, JSON.stringify(digest)]
    )
  } catch (dbErr) {
    // Table not yet created — log and return the digest anyway
    console.warn('[daily-summary] DB save failed (table may not exist):', dbErr.message)
  }

  return NextResponse.json({ status: 'generated', date: today, article_count: articles.length })
}
