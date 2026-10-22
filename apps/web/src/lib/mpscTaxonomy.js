// ==============================================================================
// lib/mpscTaxonomy.js — MPSC 343 Papers Categorization & Taxonomy
// ExamUdaan.in — Systematic taxonomy across all official MPSC syllabi
// ==============================================================================

import mpscSyllabusCatalog from './mpscSyllabusCatalog.json'

export const MPSC_CATEGORIES = [
  {
    key: 'all',
    labelEn: 'All Papers',
    labelMr: 'सर्व अभ्यासक्रम',
    icon: 'folder_open',
    color: '#EA580C',
    bg: '#FFF7ED',
    description: 'Complete archive of all 343 official MPSC syllabus notifications.'
  },
  {
    key: 'rajyaseva',
    labelEn: 'State Services (Rajyaseva)',
    labelMr: 'राज्य सेवा (गट-अ व गट-ब राजपत्रित)',
    icon: 'military_tech',
    color: '#B45309',
    bg: '#FEF3C7',
    description: 'Deputy Collector, DSP, Tehsildar, Naib Tehsildar, BDO & Gazetted Cadres.'
  },
  {
    key: 'group-b',
    labelEn: 'Group-B (Non-Gazetted)',
    labelMr: 'गट-ब (अराजपत्रित दुय्यम सेवा)',
    icon: 'shield_person',
    color: '#0369A1',
    bg: '#E0F2FE',
    description: 'Police Sub-Inspector (PSI), State Tax Inspector (STI), Assistant Section Officer (ASO), AMVI.'
  },
  {
    key: 'group-c',
    labelEn: 'Group-C Services',
    labelMr: 'गट-क सेवा',
    icon: 'badge',
    color: '#047857',
    bg: '#D1FAE5',
    description: 'Clerk-Typist, Tax Assistant, Industry Inspector, Technical Assistant, Excise SI.'
  },
  {
    key: 'engineering',
    labelEn: 'Engineering Services',
    labelMr: 'महाराष्ट्र अभियांत्रिकी सेवा',
    icon: 'engineering',
    color: '#4F46E5',
    bg: '#EEF2FF',
    description: 'Civil, Mechanical, Electrical, Architecture, PWD, WRD, Town Planning & Polytechnic.'
  },
  {
    key: 'education',
    labelEn: 'Collegiate & Education',
    labelMr: 'शिक्षण व महाविद्यालयीन शाखा',
    icon: 'school',
    color: '#7C3AED',
    bg: '#F5F3FF',
    description: 'Assistant Professor, Lecturer, Education Officers (Shikshan Seva), Arts & Science Colleges.'
  },
  {
    key: 'medical',
    labelEn: 'Medical, Health & Forensic',
    labelMr: 'वैद्यकीय, आरोग्य व न्यायवैद्यक',
    icon: 'health_and_safety',
    color: '#BE123C',
    bg: '#FFE4E6',
    description: 'Medical Officers, Assistant Chemical Analyser, Forensic Science, Drug Inspectors, AYUSH.'
  },
  {
    key: 'agriculture-forest',
    labelEn: 'Agriculture & Forest',
    labelMr: 'कृषी व वन सेवा',
    icon: 'park',
    color: '#15803D',
    bg: '#DCFCE7',
    description: 'Maharashtra Forest Services (ACF / RFO), Agriculture Services (Krishi Seva).'
  },
  {
    key: 'judicial-legal',
    labelEn: 'Judicial & Legal Services',
    labelMr: 'न्यायालयीन व विधी शाखा',
    icon: 'gavel',
    color: '#6D28D9',
    bg: '#EDE9FE',
    description: 'Civil Judge Junior Division (CJJD), Assistant Public Prosecutor (APP), Motor Vehicle Prosecutor.'
  },
  {
    key: 'departmental',
    labelEn: 'Departmental (LDCE)',
    labelMr: 'विभागीय परीक्षा (LDCE)',
    icon: 'work_history',
    color: '#C2410C',
    bg: '#FFEDD5',
    description: 'Limited Departmental Competitive Exams for serving Police, Mantralaya & State employees.'
  },
  {
    key: 'other',
    labelEn: 'Specialized & Other',
    labelMr: 'इतर विशेष संवर्ग',
    icon: 'tune',
    color: '#475569',
    bg: '#F1F5F9',
    description: 'Administrative officers, system analysts, statisticians, translators & specialized posts.'
  }
]

/**
 * Classifies an MPSC syllabus catalog document into one of the standardized taxonomy categories.
 * Supports both English & Marathi official descriptions.
 */
export function classifyMpscDoc(doc) {
  const t = ((doc.descInEnglish || '') + ' ' + (doc.descMr || '') + ' ' + (doc.englishFileName || '')).toLowerCase()

  if (
    t.includes('limited departmental') ||
    t.includes('विभागीय') ||
    t.includes('ldce') ||
    t.includes('departmental competitive')
  ) {
    return 'departmental'
  }

  if (
    t.includes('state service') ||
    t.includes('rajyaseva') ||
    t.includes('राज्य सेवा') ||
    t.includes('civil service')
  ) {
    return 'rajyaseva'
  }

  if (
    t.includes('group-b') ||
    t.includes('group b') ||
    t.includes('गट-ब') ||
    t.includes('गट ब') ||
    t.includes('subordinate') ||
    t.includes('psi') ||
    t.includes('police sub-inspector') ||
    t.includes('state tax inspector') ||
    t.includes('sti') ||
    t.includes('assistant section officer') ||
    t.includes('aso') ||
    t.includes('motor vehicle inspector') ||
    t.includes('amvi')
  ) {
    return 'group-b'
  }

  if (
    t.includes('group-c') ||
    t.includes('group c') ||
    t.includes('गट-क') ||
    t.includes('गट क') ||
    t.includes('clerk-typist') ||
    t.includes('लिपिक-टंकलेखक') ||
    t.includes('tax assistant') ||
    t.includes('कर सहायक') ||
    t.includes('industry inspector') ||
    t.includes('excise')
  ) {
    return 'group-c'
  }

  if (
    t.includes('professor') ||
    t.includes('प्राध्यापक') ||
    t.includes('lecturer') ||
    t.includes('अधिव्याख्याता') ||
    t.includes('education service') ||
    t.includes('शिक्षण सेवा') ||
    t.includes('collegiate branch') ||
    t.includes('shikshan')
  ) {
    return 'education'
  }

  if (
    t.includes('engineer') ||
    t.includes('अभियांत्रिकी') ||
    t.includes('pwd') ||
    t.includes('wrdo') ||
    t.includes('water resources') ||
    t.includes('polytechnic') ||
    t.includes('civil eng') ||
    t.includes('mechanical eng') ||
    t.includes('electrical eng') ||
    t.includes('architecture') ||
    t.includes('town planning') ||
    t.includes('वास्तुशास्त्र') ||
    t.includes('नगर रचना')
  ) {
    return 'engineering'
  }

  if (
    t.includes('medical') ||
    t.includes('वैद्यकीय') ||
    t.includes('health') ||
    t.includes('आरोग्य') ||
    t.includes('doctor') ||
    t.includes('surgeon') ||
    t.includes('chemical analyser') ||
    t.includes('रासायनिक विश्लेषक') ||
    t.includes('forensic') ||
    t.includes('न्यायवैद्यक') ||
    t.includes('ayush') ||
    t.includes('drug')
  ) {
    return 'medical'
  }

  if (
    t.includes('forest') ||
    t.includes('वन सेवा') ||
    t.includes('agri') ||
    t.includes('कृषी') ||
    t.includes('krishi') ||
    t.includes('vanseva') ||
    t.includes('soil conservation')
  ) {
    return 'agriculture-forest'
  }

  if (
    t.includes('court') ||
    t.includes('न्यायालय') ||
    t.includes('judge') ||
    t.includes('न्यायाधीश') ||
    t.includes('legal') ||
    t.includes('विधी') ||
    t.includes('prosecutor') ||
    t.includes('अभियोक्ता') ||
    t.includes('cjjd') ||
    t.includes('app')
  ) {
    return 'judicial-legal'
  }

  return 'other'
}

/**
 * Generates an SEO-optimized URL slug (strictly <= 90 characters) for MPSC syllabus papers.
 * Integrates: mpsc-[cadre]-[post-title]-[optional-year]-[doc-id]
 * Example outputs:
 *   Doc 1181: mpsc-rajyaseva-state-services-main-exam-syllabus-1181 (61 chars)
 *   Doc 1182: mpsc-rajyaseva-state-services-main-exam-marathi-syllabus-1182 (69 chars)
 *   Doc 1183: mpsc-group-b-subordinate-services-non-gazetted-exam-syllabus-1183 (70 chars)
 *   Doc 14199: mpsc-group-b-assistant-chemical-analyser-forensic-syllabus-14199 (67 chars)
 */
export function buildMpscSyllabusSlug(doc, lang = 'en') {
  if (!doc) return 'mpsc-syllabus'
  const id = doc.id || doc.docId || ''
  const category = doc.category || classifyMpscDoc(doc)
  const isMr = lang === 'mr'

  // Pick source text — always base on English title to preserve high-yield Latin keywords
  const rawTitle = doc.descInEnglish || doc.titleEn || doc.descMr || ''

  // Clean and normalize terms
  let clean = String(rawTitle || '')
    .toLowerCase()
    .replace(/^slyb[_\-\s]*/i, '')
    .replace(/^advt?\.?\s*(no\.?)?\s*[\d\/\-_]+\s*/i, '')
    .replace(/directorate\s+of\s+languages/gi, 'languages')
    .replace(/directorate\s+of/gi, '')
    .replace(/general\s+state\s+service/gi, '')
    .replace(/competitive\s+examination/gi, 'exam')
    .replace(/examination/gi, 'exam')
    .replace(/corrigendum\s+regarding\s+syllabus/gi, 'corrigendum-syllabus')
    .replace(/syllabus/gi, '')
    .replace(/अभ्यासक्रम/gi, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')

  // Strip initial redundant 'mpsc' if already there
  clean = clean.replace(/^mpsc-/, '')

  // Prefix with cadre keyword if helpful for SEO
  let cadrePrefix = ''
  if (category === 'group-b' && !clean.includes('group-b') && !clean.includes('gr-b')) {
    cadrePrefix = 'group-b-'
  } else if (category === 'group-c' && !clean.includes('group-c') && !clean.includes('gr-c')) {
    cadrePrefix = 'group-c-'
  } else if (category === 'rajyaseva' && !clean.includes('rajyaseva') && !clean.includes('state-services')) {
    cadrePrefix = 'rajyaseva-'
  }

  // Base slug assembly
  let assembled = `mpsc-${cadrePrefix}${clean}`
  if (isMr && !assembled.includes('marathi')) {
    assembled = `${assembled}-marathi`
  }
  if (!assembled.includes('syllabus')) {
    assembled = `${assembled}-syllabus`
  }

  // Deduplicate hyphens
  assembled = assembled.replace(/-+/g, '-').replace(/^-|-$/g, '')

  // Enforce max 90 characters including `-${id}`
  const suffix = id ? `-${id}` : ''
  const maxBaseLen = 90 - suffix.length
  if (assembled.length > maxBaseLen) {
    const truncated = assembled.slice(0, maxBaseLen)
    const lastHyphen = truncated.lastIndexOf('-')
    assembled = lastHyphen > 20 ? truncated.slice(0, lastHyphen) : truncated
  }

  return `${assembled}${suffix}`
}

/**
 * Returns all 343 documents enriched with category, slug, year, and interactive status.
 */
export function getAllEnrichedMpscDocs() {
  const docs = mpscSyllabusCatalog.syllabusDocuments || []

  // Known interactive documents processed into DB / JSON
  const interactiveDocIds = new Set([1181, 1182])

  return docs.map(doc => {
    const category = classifyMpscDoc(doc)
    const categoryObj = MPSC_CATEGORIES.find(c => c.key === category) || MPSC_CATEGORIES.find(c => c.key === 'other')
    const year = doc.publicationDate ? parseInt(doc.publicationDate.slice(0, 4), 10) : 2026
    const pdfFileName = doc.englishFileName || doc.marathiFileName || ''
    const pdfUrl = pdfFileName ? `/downloads/mpsc/syllabus/general/${encodeURIComponent(pdfFileName)}` : null
    const hasInteractive = interactiveDocIds.has(doc.id)

    const seoSlugEn = buildMpscSyllabusSlug({ ...doc, category }, 'en')
    const seoSlugMr = buildMpscSyllabusSlug({ ...doc, category }, 'mr')

    return {
      id: doc.id,
      titleEn: doc.descInEnglish,
      titleMr: doc.descMr || null,
      category,
      categoryLabelEn: categoryObj.labelEn,
      categoryLabelMr: categoryObj.labelMr,
      categoryColor: categoryObj.color,
      categoryBg: categoryObj.bg,
      categoryIcon: categoryObj.icon,
      year,
      publicationDate: doc.publicationDate,
      fileSize: doc.englishFileSize || doc.marathiFileSize || null,
      pdfFileName,
      pdfUrl,
      hasInteractive,
      seoSlugEn,
      seoSlugMr,
      interactiveUrl: `/mpsc-syllabus/${seoSlugEn}`
    }
  })
}

/**
 * Returns category breakdown with counts for all 343 papers.
 */
export function getMpscCategoryCounts() {
  const enriched = getAllEnrichedMpscDocs()
  const counts = { all: enriched.length }

  for (const cat of MPSC_CATEGORIES) {
    if (cat.key !== 'all') {
      counts[cat.key] = 0
    }
  }

  for (const doc of enriched) {
    if (counts[doc.category] !== undefined) {
      counts[doc.category]++
    } else {
      counts.other = (counts.other || 0) + 1
    }
  }

  return counts
}
