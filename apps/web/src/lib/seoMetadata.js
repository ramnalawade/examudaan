// ============================================================
// lib/seoMetadata.js — Centralized SEO Metadata Engine for ExamUdaan
// Follows strict SEO Rules:
// 1. Titles <= 60 chars (drop brand first, then post count if needed)
// 2. Descriptions strictly 140-155 chars with real facts (no invented data)
// 3. Absolute canonicals (clean URLs without query params)
// 4. Consistent trailing-slash handling
// ============================================================

const SITE_URL = 'https://examudaan.in'

/**
 * Format date to "DD Mon YYYY" (e.g. "15 Nov 2026")
 */
export function formatDateDDMonYYYY(dateStr) {
  if (!dateStr) return null
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return null
    const day = String(d.getDate()).padStart(2, '0')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
  } catch {
    return null
  }
}

/**
 * Clean post/role name from raw notification title
 */
export function cleanPostName(rawTitle, orgAcronym) {
  if (!rawTitle || typeof rawTitle !== 'string') return 'Various Posts'
  let t = rawTitle.trim()

  // Remove org acronym if embedded
  if (orgAcronym && orgAcronym.length > 1) {
    const orgRegex = new RegExp(`\\b${orgAcronym}\\b`, 'gi')
    t = t.replace(orgRegex, '').trim()
  }

  // Remove common recruitment boilerplate
  t = t.replace(/^(recruitment of|recruitment for|notification for the post of|applications are invited for(?: the post of)?|walk-in interview for(?: the post of| one post of)?|walk-in-interview for(?: the post of| one post of)?|recruitment to the posts of|advertisement for the post of)\s+/i, '')
  t = t.replace(/\s+(recruitment|bharti|exam|examination|vacancy|vacancies)\s*(202\d)?$/i, '')
  t = t.replace(/[-–]\s*\d+\s*(posts?|vacancies).*$/i, '')
  t = t.replace(/[-–]\s*last date.*$/i, '')
  t = t.replace(/\s+(at|in)\s+.*$/i, '')
  t = t.replace(/\s+on\s+[A-Za-z]+\s+\d{1,2}(?:,\s*\d{4})?$/i, '')
  t = t.replace(/\s*\(Advt\.?\s*No\.?.*?\)/i, '')
  t = t.replace(/\s{2,}/g, ' ').trim()

  return t || 'Various Posts'
}

/**
 * Fit description strictly to 140-155 characters
 */
export function fitDescription(primaryText, secondaryContext = '') {
  let combined = primaryText.trim()
  if (secondaryContext && combined.length < 140) {
    combined = `${combined} ${secondaryContext}`.trim()
  }

  if (combined.length > 155) {
    // Truncate at last space before 155
    const truncated = combined.slice(0, 154)
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > 120) {
      combined = truncated.slice(0, lastSpace).trim()
      if (!combined.endsWith('.')) combined += '.'
    } else {
      combined = truncated.trim()
    }
  }

  // If still below 140 chars, append high-intent keywords to reach 140-155
  if (combined.length < 140) {
    const filler = ' Check eligibility, dates & official PDF on ExamUdaan.'
    const needed = 140 - combined.length
    if (needed <= filler.length) {
      combined = (combined + filler).slice(0, 155).trim()
    } else {
      combined = (combined + ' Check syllabus, age limit, salary & official PDF on ExamUdaan.').slice(0, 155).trim()
    }
  }

  return combined.slice(0, 155)
}

/**
 * 1. Job Detail Metadata
 * Pattern: "{Org} {Post} Recruitment {Year} - {N} Posts, Last Date {DD Mon YYYY} | ExamUdaan", max 60 chars
 * Walk-in: "Walk-in Interview: {Post} at {Org}, {City} - {Date}"
 */
export function buildJobMetadata(en, posts = [], slugParam = '') {
  const org = en.org_acronym || en.org_name || 'Govt'
  const firstPost = posts && posts.length > 0 ? posts[0].post_name : null
  const post = firstPost || cleanPostName(en.title_en || en.title, en.org_acronym)
  const isWalkIn = Boolean(en.is_walk_in)

  let title = ''

  if (isWalkIn) {
    const rawCity = Array.isArray(en.exam_cities)
      ? en.exam_cities[0]
      : (typeof en.exam_cities === 'string' ? en.exam_cities.replace(/[{}]/g, '').split(',')[0].trim() : null)
    const city = rawCity && rawCity !== 'Maharashtra' ? rawCity : null
    const date = formatDateDDMonYYYY(en.exam_date || en.apply_end_date)

    title = `Walk-in Interview: ${post} at ${org}`
    if (city) title += `, ${city}`
    if (date) title += ` - ${date}`

    if (title.length > 60 && date) {
      const tNoCity = `Walk-in Interview: ${post} at ${org} - ${date}`
      if (tNoCity.length <= 60) title = tNoCity
    }
    if (title.length > 60) {
      const tNoDate = `Walk-in Interview: ${post} at ${org}${city ? `, ${city}` : ''}`
      if (tNoDate.length <= 60) title = tNoDate
    }
    if (title.length > 60) {
      title = `Walk-in: ${post} at ${org}`.slice(0, 60).trim()
    }
  } else {
    let year = null
    if (en.apply_end_date) {
      year = new Date(en.apply_end_date).getFullYear()
    } else if (en.published_at) {
      year = new Date(en.published_at).getFullYear()
    } else if (en.created_at) {
      year = new Date(en.created_at).getFullYear()
    }

    const postsPart = en.total_vacancies ? `${Number(en.total_vacancies).toLocaleString('en-IN')} Posts` : null
    const lastDateStr = formatDateDDMonYYYY(en.apply_end_date)
    const lastDatePart = lastDateStr ? `Last Date ${lastDateStr}` : null

    const details = []
    if (postsPart) details.push(postsPart)
    if (lastDatePart) details.push(lastDatePart)
    const detailsStr = details.length > 0 ? ` - ${details.join(', ')}` : ''
    const yearStr = year ? ` ${year}` : ''

    // 1. Full with brand
    let candidate = `${org} ${post} Recruitment${yearStr}${detailsStr} | ExamUdaan`
    if (candidate.length <= 60) {
      title = candidate
    } else {
      // 2. Drop brand first
      candidate = `${org} ${post} Recruitment${yearStr}${detailsStr}`
      if (candidate.length <= 60) {
        title = candidate
      } else if (postsPart && lastDatePart) {
        // 3. Drop post count if still > 60
        candidate = `${org} ${post} Recruitment${yearStr} - ${lastDatePart}`
        if (candidate.length <= 60) {
          title = candidate
        } else {
          // 4. Drop last date if still > 60
          candidate = `${org} ${post} Recruitment${yearStr}`
          if (candidate.length <= 60) {
            title = candidate
          } else {
            const prefix = `${org} `
            const suffix = ` Recruitment${yearStr}`
            const maxPostLen = Math.max(10, 60 - prefix.length - suffix.length)
            title = `${prefix}${post.slice(0, maxPostLen).trim()}${suffix}`.slice(0, 60)
          }
        }
      } else {
        candidate = `${org} ${post} Recruitment${yearStr}`
        if (candidate.length <= 60) {
          title = candidate
        } else {
          const prefix = `${org} `
          const suffix = ` Recruitment${yearStr}`
          const maxPostLen = Math.max(10, 60 - prefix.length - suffix.length)
          title = `${prefix}${post.slice(0, maxPostLen).trim()}${suffix}`.slice(0, 60)
        }
      }
    }
  }

  // Description: 140-155 chars
  // Required components: posts, qualification, last date, "apply online/offline", official source
  const vacStr = en.total_vacancies ? `${en.total_vacancies} ` : ''
  const qual = posts && posts[0]?.qualification
    ? posts[0].qualification
    : (Array.isArray(en.education_levels) && en.education_levels.length > 0 ? en.education_levels[0] : null)
  const lastDateStr = formatDateDDMonYYYY(en.apply_end_date)
  const applyMode = isWalkIn
    ? 'walk-in interview'
    : (en.application_links?.apply_online ? 'apply online' : 'apply online/offline')
  const officialSource = en.org_website ? `official site ${en.org_website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}` : 'official portal'

  const p1 = `Apply for ${vacStr}${post} at ${org}.`
  const p2 = qual ? ` Qual: ${qual}.` : ''
  const p3 = lastDateStr ? ` Last Date: ${lastDateStr}.` : ''
  const p4 = ` Mode: ${applyMode}. Sourced from ${officialSource}.`

  const description = fitDescription(`${p1}${p2}${p3}${p4}`, 'Official notification PDF available on ExamUdaan.')

  const canonicalSlug = en.slug || slugParam
  const canonicalUrl = `${SITE_URL}/jobs/${canonicalSlug}`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      siteName: 'ExamUdaan',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

/**
 * 2. Result Detail Metadata
 * Pattern: "{Org} {Post} Result {Year} - Merit List, Scorecard | ExamUdaan", max 60 chars
 */
export function buildResultMetadata(en, slugParam = '') {
  const org = en.org_acronym || en.org_name || 'Govt'
  const post = cleanPostName(en.title_en || en.title, en.org_acronym)
  const year = en.apply_end_date
    ? new Date(en.apply_end_date).getFullYear()
    : (en.published_at ? new Date(en.published_at).getFullYear() : (en.created_at ? new Date(en.created_at).getFullYear() : null))
  const yearStr = year ? ` ${year}` : ''

  let title = `${org} ${post} Result${yearStr} - Merit List | ExamUdaan`
  if (title.length > 60) {
    title = `${org} ${post} Result${yearStr} - Merit List`
  }
  if (title.length > 60) {
    title = `${org} ${post} Result${yearStr} | ExamUdaan`
  }
  if (title.length > 60) {
    title = `${org} ${post} Result${yearStr}`.slice(0, 60)
  }

  const p1 = `Check ${org} ${post} result${yearStr}.`
  const p2 = ` Download official selection merit list, cutoff marks & scorecard PDF.`
  const p3 = ` Declared on ${en.org_website ? en.org_website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : 'official portal'}.`
  const description = fitDescription(`${p1}${p2}${p3}`, 'Direct download link & steps on ExamUdaan.')

  const canonicalSlug = en.slug || slugParam
  const canonicalUrl = `${SITE_URL}/results/${canonicalSlug}`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article', siteName: 'ExamUdaan' },
    twitter: { card: 'summary', title, description },
  }
}

/**
 * 3. Admit Card Metadata
 * Pattern: "{Org} {Post} Admit Card {Year} - Hall Ticket Download | ExamUdaan", max 60 chars
 */
export function buildAdmitCardMetadata(en, slugParam = '') {
  const org = en.org_acronym || en.org_name || 'Govt'
  const post = cleanPostName(en.title_en || en.title, en.org_acronym)
  const year = en.apply_end_date
    ? new Date(en.apply_end_date).getFullYear()
    : (en.published_at ? new Date(en.published_at).getFullYear() : (en.created_at ? new Date(en.created_at).getFullYear() : null))
  const yearStr = year ? ` ${year}` : ''

  let title = `${org} ${post} Admit Card${yearStr} - Hall Ticket | ExamUdaan`
  if (title.length > 60) {
    title = `${org} ${post} Admit Card${yearStr} - Hall Ticket`
  }
  if (title.length > 60) {
    title = `${org} ${post} Admit Card${yearStr} | ExamUdaan`
  }
  if (title.length > 60) {
    title = `${org} ${post} Admit Card${yearStr}`.slice(0, 60)
  }

  const examDateStr = formatDateDDMonYYYY(en.exam_date)
  const p1 = `Download ${org} ${post} admit card${yearStr} & hall ticket.`
  const p2 = examDateStr ? ` Exam Date: ${examDateStr}.` : ''
  const p3 = ` Check reporting time, exam centre & direct login download link.`
  const description = fitDescription(`${p1}${p2}${p3}`, 'Official hall ticket instructions on ExamUdaan.')

  const canonicalSlug = en.slug || slugParam
  const canonicalUrl = `${SITE_URL}/admit-cards/${canonicalSlug}`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article', siteName: 'ExamUdaan' },
    twitter: { card: 'summary', title, description },
  }
}

/**
 * 4. Answer Key Metadata
 * Pattern: "{Org} {Post} Answer Key {Year} - Response Sheet PDF | ExamUdaan", max 60 chars
 */
export function buildAnswerKeyMetadata(en, slugParam = '') {
  const org = en.org_acronym || en.org_name || 'Govt'
  const post = cleanPostName(en.title_en || en.title, en.org_acronym)
  const year = en.apply_end_date
    ? new Date(en.apply_end_date).getFullYear()
    : (en.published_at ? new Date(en.published_at).getFullYear() : (en.created_at ? new Date(en.created_at).getFullYear() : null))
  const yearStr = year ? ` ${year}` : ''

  let title = `${org} ${post} Answer Key${yearStr} - Response Sheet | ExamUdaan`
  if (title.length > 60) {
    title = `${org} ${post} Answer Key${yearStr} - Response Sheet`
  }
  if (title.length > 60) {
    title = `${org} ${post} Answer Key${yearStr} | ExamUdaan`
  }
  if (title.length > 60) {
    title = `${org} ${post} Answer Key${yearStr}`.slice(0, 60)
  }

  const p1 = `Download official ${org} ${post} answer key${yearStr} PDF.`
  const p2 = ` Calculate your score with master question paper, response sheet & submit objections.`
  const description = fitDescription(`${p1}${p2}`, 'Direct official key download link on ExamUdaan.')

  const canonicalSlug = en.slug || slugParam
  const canonicalUrl = `${SITE_URL}/answer-keys/${canonicalSlug}`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article', siteName: 'ExamUdaan' },
    twitter: { card: 'summary', title, description },
  }
}

/**
 * 5. Syllabus / Scheme Metadata
 * Pattern: "{Exam} Syllabus {Year} & Exam Pattern - Subject-wise PDF", max 60 chars
 */
export function buildSyllabusMetadata(examName, year, slug, customDescription) {
  const yearStr = year ? ` ${year}` : ''
  let title = `${examName} Syllabus${yearStr} & Exam Pattern - PDF`
  if (title.length > 60) {
    title = `${examName} Syllabus${yearStr} & Exam Pattern`
  }
  if (title.length > 60) {
    title = `${examName} Syllabus${yearStr} PDF`
  }
  if (title.length > 60) {
    title = `${examName} Syllabus${yearStr}`.slice(0, 60)
  }

  const defaultDesc = `Download official ${examName} syllabus${yearStr} with subject-wise topics, marking scheme, exam pattern and negative marking rules. Free PDF download on ExamUdaan.`
  const description = fitDescription(customDescription || defaultDesc)

  const canonicalUrl = `${SITE_URL}/syllabus/${slug}`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'article', siteName: 'ExamUdaan' },
    twitter: { card: 'summary', title, description },
  }
}
