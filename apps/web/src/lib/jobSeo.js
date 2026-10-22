// ============================================================
// lib/jobSeo.js — Drop-in SEO helpers for Job Detail pages
// Rule: If a value is not in your data, OMIT it. Never invent it.
// ============================================================

/* ------------------------------------------------------------------ */
/* Dates (IST)                                                         */
/* ------------------------------------------------------------------ */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// 'YYYY-MM-DD' of the IST calendar day for a Date or date string
export function dateOnly(v) {
  if (!v) return null
  if (typeof v === 'string') {
    const m = v.match(/^(\d{4}-\d{2}-\d{2})/)
    if (m) return m[1]
  }
  const d = new Date(v)
  if (isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(d)
}

// validThrough must be end of the LAST day in IST, not 00:00 UTC (which is 05:30 IST)
export const endOfDayIST = (v) => {
  const d = dateOnly(v)
  return d ? `${d}T23:59:59+05:30` : null
}

export function shortDate(v) {
  const d = dateOnly(v)
  if (!d) return null
  const [, m, day] = d.split('-').map(Number)
  return `${String(day).padStart(2, '0')} ${MONTHS[m - 1]}`
}

export function longDate(v) {
  const d = dateOnly(v)
  if (!d) return null
  const [y, m, day] = d.split('-').map(Number)
  return `${String(day).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`
}

/* ------------------------------------------------------------------ */
/* Safety: JSON-LD and hrefs built from scraped data                   */
/* ------------------------------------------------------------------ */
export function safeJsonLd(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c') // stops "</script>" inside scraped text from breaking out
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function safeHref(url) {
  if (!url || typeof url !== 'string') return null
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null // blocks javascript:
  } catch {
    return null
  }
}

export const stripUnsafeHtml = (s) =>
  String(s || '')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?(script|style|iframe|object|embed)[^>]*>/gi, '')

/* ------------------------------------------------------------------ */
/* Walk-in detection (the old check treated any "interview" as walk-in)*/
/* ------------------------------------------------------------------ */
export function isWalkInNotification(en) {
  if (!en) return false
  const text = `${en.selection_process || ''} ${en.title || ''}`.toLowerCase()
  return (
    en.is_walk_in === true ||
    /walk[\s-]*in/.test(text) ||
    (en.employment_type === 'contractual' && !en.apply_start_date && !en.apply_end_date && !!en.exam_date)
  )
}

/* ------------------------------------------------------------------ */
/* Titles and descriptions                                             */
/* ------------------------------------------------------------------ */
const MAX_TITLE = 60
const BRAND = ' | ExamUdaan'

// Keep as many useful extras (last date, posts, city) as fit; the brand goes first when space is short.
// Strict enforcement: max 60 characters, no duplicates.
function fitTitle(base, extras) {
  const list = extras.filter(Boolean)
  for (let n = list.length; n >= 0; n--) {
    for (const brand of [BRAND, '']) {
      const t = base + (n ? ` – ${list.slice(0, n).join(', ')}` : '') + brand
      if (t.length <= MAX_TITLE) return t
    }
  }
  return (base.slice(0, MAX_TITLE - BRAND.length).trim() + BRAND).slice(0, MAX_TITLE)
}

export const uniquePostNames = (posts) =>
  [...new Set((posts || []).map((p) => (p.post_name || '').trim()).filter(Boolean))]

export const firstCity = (en) =>
  en.exam_cities?.[0] || en.cities_normalized?.[0] || en.ai_extracted_data?.cities_normalized?.[0] || null

export function resolveTrueEmployer(en) {
  if (!en) return 'Govt'
  const acronym = (en.org_acronym || '').toUpperCase().trim()
  const name = (en.org_name || '').trim()

  // If the organization is an aggregator/board rather than the actual department
  const isAggregator = acronym === 'NCS' || name.toLowerCase().includes('national career service')

  if (isAggregator) {
    if (en.org_department && en.org_department.length > 2) return en.org_department.trim()
    if (en.ai_extracted_data?.employer_name) return en.ai_extracted_data.employer_name.trim()
    if (en.ai_extracted_data?.organization_name) return en.ai_extracted_data.organization_name.trim()
    // Try to extract employer from title e.g. "...at ICAR-Central Marine Fisheries Research Institute"
    const atMatch = (en.title || '').match(/\b(?:at|in|under|by)\s+([A-Z0-9][A-Za-z0-9\s&-]{2,35})/i)
    if (atMatch && atMatch[1]) return atMatch[1].trim()
  }

  return en.org_acronym || en.org_name || 'Govt'
}

export function resolveTruePostName(en, posts = []) {
  const names = uniquePostNames(posts)
  if (names.length === 1 && names[0].length >= 3) return names[0].trim()

  if (en.title) {
    let clean = en.title
      .replace(/^(Walk[\s-]*in(\/Zoom)?\s*(Interview)?\s*(for)?\s*(the\s*post\s*of)?\s*)/i, '')
      .replace(/^Recruitment\s*(for\s*(the\s*post\s*of)?)?/i, '')
      .replace(/^Advertisement\s*(for)?/i, '')
      .replace(/\s*\(on\s*contract\s*basis\)/i, '')
      .replace(/\s*\(Contractual\)/i, '')
      .trim()

    const splitRole = clean.split(/\s+(?:at|in|under)\s+/i)
    if (splitRole[0] && splitRole[0].length <= 40) {
      clean = splitRole[0].trim()
    }
    if (clean.length <= 42) return clean
  }
  return null
}

export function buildSeoTitle(en, posts = []) {
  const org = resolveTrueEmployer(en)
  const post = resolveTruePostName(en, posts)
  const year = (dateOnly(en.published_at) || dateOnly(en.apply_end_date) || String(new Date().getFullYear())).slice(0, 4)

  // If scraper already provided a meta_title, sanitize it to strict <= 60 chars and strip double brand
  if (en.seo_metadata?.meta_title) {
    let raw = String(en.seo_metadata.meta_title).replace(/\s*\|\s*ExamUdaan.*$/i, '').trim()
    if (raw.startsWith('NCS Recruitment')) {
      if (org && org !== 'NCS' && org !== 'Govt') {
        raw = raw.replace(/^NCS Recruitment/i, `${org} Recruitment`)
      } else if (post) {
        raw = raw.replace(/^NCS Recruitment/i, `${post} Recruitment`)
      }
    }
    const idSuffix = en.slug ? (en.slug.match(/(\d+)$/)?.[1] || '') : ''
    if (idSuffix && !raw.includes(idSuffix)) {
      if (raw.length + idSuffix.length + 4 <= MAX_TITLE - BRAND.length) {
        raw = `${raw} (#${idSuffix})`
      }
    }
    return fitTitle(raw, [])
  }

  const v = Number(en.total_vacancies)
  const count = v > 0 ? `${v.toLocaleString('en-IN')} Post${v === 1 ? '' : 's'}` : null
  const last = shortDate(en.apply_end_date) ? `Last Date ${shortDate(en.apply_end_date)}` : null
  const city = firstCity(en)
  const idSuffix = en.slug ? (en.slug.match(/(\d+)$/)?.[1] || '') : ''
  const idTag = idSuffix ? `#${idSuffix}` : null

  switch (en.notification_type) {
    case 'recruitment':
      return post
        ? fitTitle(`${post} Recruitment ${year}`, [org !== 'Govt' && org !== post ? org : null, idTag, last, city, count])
        : fitTitle(`${org} Recruitment ${year}`, [idTag, count, last, city])
    case 'result':
      return fitTitle(`${org} Result ${year}`, [idTag, 'Merit List Out'])
    case 'admit_card':
      return fitTitle(`${org} Admit Card ${year}`, [idTag, 'Hall Ticket'])
    case 'answer_key':
      return fitTitle(`${org} Answer Key ${year}`, [idTag, 'Response Sheet'])
    default:
      return fitTitle(`${org} Notification ${year}`, [idTag, 'Eligibility & Dates'])
  }
}

export function buildSeoDescription(en, posts = []) {
  // If database already has a meta_description, ensure it is within 70-155 characters and unique
  if (en.seo_metadata?.meta_description) {
    let raw = String(en.seo_metadata.meta_description).trim()
    const idSuffix = en.slug ? (en.slug.match(/(\d+)$/)?.[1] || '') : ''
    if (idSuffix && !raw.includes(idSuffix) && raw.length <= 140) {
      raw = `${raw} (Ref #${idSuffix}).`
    }
    if (raw.length > 155) {
      raw = raw.slice(0, 155).replace(/\s+\S*$/, '') + '.'
    }
    return raw
  }

  const ai = en.ai_extracted_data || {}
  const org = en.org_acronym || en.org_name || 'Govt'
  const names = uniquePostNames(posts)
  const post = names.length === 1 ? names[0] : 'recruitment'
  const v = Number(en.total_vacancies)
  const qualRaw = en.qualifications?.mandatory?.[0] || (ai.education_levels || []).join('/')
  const qual = qualRaw && qualRaw.length <= 50 ? qualRaw : null
  const age = en.age_limit?.max || en.age_limit?.max_open
  const idSuffix = en.slug ? (en.slug.match(/(\d+)$/)?.[1] || '') : ''

  const parts = [
    `${org} ${post}${idSuffix ? ` (#${idSuffix})` : ''}.`,
    v > 0 ? `${v.toLocaleString('en-IN')} vacanc${v === 1 ? 'y' : 'ies'}.` : null,
    qual ? `Qualification: ${qual}.` : null,
    age ? `Max age ${age}.` : null,
    en.apply_end_date ? `Last date ${longDate(en.apply_end_date)}.` : null,
    'Eligibility, fee & online application link.',
  ].filter(Boolean)

  let d = parts.join(' ')
  if (d.length > 155) d = d.slice(0, 155).replace(/\s+\S*$/, '') + '.'
  return d
}

/* Thin pages: true empty notifications only. Real government jobs with links, pdfs or vacancies are never noindexed. */
export function isThinNotification(en, posts = []) {
  if (!en) return true
  // Crucial: If it has vacancies, PDF notification, apply link or substantive title, it is authentic content
  if (Number(en.total_vacancies) > 0) return false
  if (en.notification_pdf || en.source_url) return false
  if ((en.title || '').length > 25 && (en.description || '').length > 60) return false

  const ai = en.ai_extracted_data || {}
  const signals = [
    (en.description || '').length > 80,
    posts.length > 0 || (ai.posts || []).length > 0,
    !!(en.apply_end_date || en.exam_date || en.published_at),
    (en.qualifications?.mandatory?.length || ai.education_levels?.length || ai.education_qualifications?.length || 0) > 0,
    !!(en.age_limit && (en.age_limit.min || en.age_limit.max || en.age_limit.max_open)),
  ].filter(Boolean).length
  return signals < 1
}

/* ------------------------------------------------------------------ */
/* JobPosting structured data (only what the data actually says)       */
/* ------------------------------------------------------------------ */
// 7th CPC central pay matrix (initial pay - top of level). Verify against the official matrix.
// Used ONLY when a pay field says "Level N". Maharashtra "S-14" style scales are NOT the same thing.
const CPC7 = {
  1: [18000, 56900], 2: [19900, 63200], 3: [21700, 69100], 4: [25500, 81100], 5: [29200, 92300],
  6: [35400, 112400], 7: [44900, 142400], 8: [47600, 151100], 9: [53100, 167800], 10: [56100, 177500],
  11: [67700, 208700], 12: [78800, 209200], 13: [123100, 215900], 14: [144200, 218200],
}

export function resolveBaseSalary(en, posts = []) {
  const num = (v) => (v !== null && v !== undefined && v !== '' && Number(v) > 0 ? Number(v) : null)
  const s = en.salary && typeof en.salary === 'object' ? en.salary : {}
  // Indian govt pay is quoted monthly unless the data says otherwise
  const unitText = /year|annum/i.test(s.period || '') ? 'YEAR' : 'MONTH'
  const money = (value) => ({ '@type': 'MonetaryAmount', currency: 'INR', value: { '@type': 'QuantitativeValue', ...value, unitText } })

  const min = num(en.salary_min ?? s.min)
  const max = num(en.salary_max ?? s.max)
  if (min && max && max >= min) return money({ minValue: min, maxValue: max })

  const amount = num(s.amount) || num(s.breakdown?.base)
  if (amount) return money({ value: amount })

  // Explicit central "Level N" in pay fields only (never title/description, never "S-14")
  const payText = [s.pay_scale, s.salary_note, s.note, ...posts.map((p) => p.pay_scale)].filter(Boolean).join(' ')
  const m = payText.match(/\b(?:pay\s*)?(?:matrix\s*)?level[\s-]*(\d{1,2})\b/i)
  if (m && CPC7[Number(m[1])]) {
    const [lo, hi] = CPC7[Number(m[1])]
    return money({ minValue: lo, maxValue: hi })
  }
  return null // omit baseSalary rather than guess
}

const prettyRegion = (s) =>
  s ? String(s).replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null

export function explicitPin(text) {
  const m = String(text || '').match(/\b(?:pin(?:\s*code)?|postal\s*code)\s*[:\-]?\s*([1-9]\d{2}\s?\d{3})\b/i)
  return m ? m[1].replace(/\s/g, '') : null
}

const compact = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined && v !== ''))

export function resolveJobLocations(en) {
  const ai = en.ai_extracted_data || {}
  const cities = [...new Set([...(en.exam_cities || []), ...(en.cities_normalized || []), ...(ai.cities_normalized || [])].filter(Boolean))].slice(0, 5)
  const region = prettyRegion(ai.state_normalized || en.state_normalized || en.state_slug)
  const venueText = [JSON.stringify(en.application_details || {}), en.description || ''].join(' ')
  const pin = (/^[1-9]\d{5}$/.test(String(ai.postal_code || '')) ? String(ai.postal_code) : null) || explicitPin(venueText)
  const street = typeof ai.street_address === 'string' && ai.street_address.trim().length > 5 ? ai.street_address.trim() : null

  if (!cities.length && !region) return []
  const place = (locality) => ({
    '@type': 'Place',
    address: compact({
      '@type': 'PostalAddress',
      streetAddress: cities.length <= 1 ? street : null,
      addressLocality: locality,
      addressRegion: region,
      postalCode: cities.length <= 1 ? pin : null,
      addressCountry: 'IN',
    }),
  })
  return cities.length ? cities.map(place) : [place(null)]
}

// Google wants the JOB title, not "Applications are invited for the post of ..."
export function cleanJobTitle(en, posts = []) {
  const names = uniquePostNames(posts)
  if (names.length === 1) return names[0]
  return String(en.title_en || en.title || '')
    .replace(/^applications?\s+(are\s+)?invited\s+(for|to)\s+(the\s+)?(post\s+of\s+)?/i, '')
    .trim()
}

export function buildJobPostingSchema({ en, posts, richDescription, siteUrl, pageUrl, isClosed, isWalkIn, educationRequirements }) {
  if (isClosed) return null // don't advertise closed jobs
  const datePosted = dateOnly(en.published_at || en.created_at)
  const locations = resolveJobLocations(en)
  if (!datePosted || !locations.length || !en.org_name) return null // no markup beats made-up markup

  const validThrough = endOfDayIST(isWalkIn ? en.exam_date : en.apply_end_date)
  const baseSalary = resolveBaseSalary(en, posts)

  return compact({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: cleanJobTitle(en, posts),
    description: stripUnsafeHtml(richDescription),
    datePosted,
    validThrough,
    employmentType: en.employment_type === 'contractual' ? 'CONTRACTOR' : 'FULL_TIME',
    hiringOrganization: compact({ '@type': 'Organization', name: en.org_name, sameAs: safeHref(en.org_website) }),
    identifier: { '@type': 'PropertyValue', name: en.org_name, value: String(en.id) },
    jobLocation: locations.length === 1 ? locations[0] : locations,
    baseSalary,
    educationRequirements,
    directApply: false, // candidates apply on the official site, not on this page
    url: pageUrl,
  })
}
