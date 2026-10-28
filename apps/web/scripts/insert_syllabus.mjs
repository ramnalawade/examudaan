// ==============================================================================
// scripts/insert_syllabus.mjs — Ingest MPSC Syllabus JSON into PostgreSQL
// ExamUdaan.in
//
// Usage:
//   node --env-file=.env.local scripts/insert_syllabus.mjs 1181
//   node --env-file=.env.local scripts/insert_syllabus.mjs "public/downloads/mpsc/syllabus/general/1181_mat.json"
//   node --env-file=.env.local scripts/insert_syllabus.mjs "path/to/any.json"
// ==============================================================================

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { query, queryOne } from '../src/lib/pgdb.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')

// Load Catalog for fallback metadata
const catalogPath = path.join(ROOT_DIR, 'src/lib/mpscSyllabusCatalog.json')
let catalogDocs = []
if (fs.existsSync(catalogPath)) {
  try {
    const raw = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'))
    catalogDocs = raw.syllabusDocuments || []
  } catch (err) {
    console.warn('[insert_syllabus] Warning: Could not read mpscSyllabusCatalog.json:', err.message)
  }
}

// Slugify helper
function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Category detector (supports English and Marathi titles)
function detectCategory(title, docId) {
  const t = (title || '').toLowerCase()
  if (t.includes('state service') || t.includes('rajyaseva') || t.includes('राज्य सेवा') || t.includes('civil service')) return 'rajyaseva'
  if (t.includes('group-b') || t.includes('group b') || t.includes('गट-ब') || t.includes('गट ब') || t.includes('subordinate') || t.includes('psi') || t.includes('sti') || t.includes('aso')) return 'group-b'
  if (t.includes('group-c') || t.includes('group c') || t.includes('गट-क') || t.includes('गट क') || t.includes('clerk') || t.includes('tax assistant')) return 'group-c'
  if (t.includes('engineer') || t.includes('अभियांत्रिकी') || t.includes('pwd') || t.includes('wrdo') || t.includes('polytechnic') || t.includes('civil eng')) return 'engineering'
  if (t.includes('education') || t.includes('शिक्षण') || t.includes('shikshan') || t.includes('teacher') || t.includes('professor') || t.includes('प्राध्यापक') || t.includes('lecturer')) return 'education'
  if (t.includes('medical') || t.includes('वैद्यकीय') || t.includes('health') || t.includes('आरोग्य') || t.includes('doctor') || t.includes('ayush') || t.includes('analyser')) return 'medical'
  if (t.includes('forest') || t.includes('वन') || t.includes('agri') || t.includes('कृषी') || t.includes('van') || t.includes('krishi')) return 'agriculture-forest'
  if (t.includes('court') || t.includes('न्यायालय') || t.includes('judge') || t.includes('न्यायाधीश') || t.includes('legal') || t.includes('विधि') || t.includes('prosecutor') || t.includes('अभियोक्ता') || t.includes('law')) return 'judicial-legal'
  if (t.includes('limited departmental') || t.includes('departmental') || t.includes('विभागीय')) return 'departmental'
  return 'other'
}

/**
 * Insert or update a single syllabus JSON into PostgreSQL
 */
export async function insertSyllabusJson(jsonData, options = {}) {
  // Support docId, doc_id, officialDocId, id, or options.docId
  const rawId = jsonData.docId ?? jsonData.doc_id ?? jsonData.officialDocId ?? jsonData.id ?? options.docId
  const docId = parseInt(rawId, 10)
  if (!docId || isNaN(docId)) {
    throw new Error('Missing or invalid docId / officialDocId in JSON or options')
  }

  // Cross-reference catalog doc
  const catDoc = catalogDocs.find(d => String(d.id) === String(docId)) || {}

  const titleEn = jsonData.examName || catDoc.descInEnglish || `MPSC Exam Document #${docId}`
  const titleMr = jsonData.examNameMr || catDoc.descMr || null
  const category = options.category || jsonData.category || detectCategory(titleEn + ' ' + (titleMr || ''), docId)
  const examLevel = jsonData.examLevel || 'State'
  const year = parseInt(jsonData.year || (catDoc.publicationDate ? catDoc.publicationDate.slice(0, 4) : 2026), 10) || 2026
  const language = jsonData.language || (titleMr && !jsonData.examName ? 'Marathi' : 'English')
  const totalMarks = parseInt(jsonData.totalMarks || 0, 10) || 0
  const mainsMarks = parseInt(jsonData.mainsMarks || 0, 10) || 0
  const interviewMarks = parseInt(jsonData.interviewMarks || 0, 10) || 0
  const examPattern = jsonData.examPattern || 'Written Examination'
  const totalPapers = Array.isArray(jsonData.papers) ? jsonData.papers.length : 0

  // Slug: e.g. '1182-state-services-main-examination'
  const cleanTitle = slugify(titleEn.replace(/\b(from|nov|format|english|marathi|syllabus|\d{4})\b/gi, '')).replace(/^-+|-+$/g, '')
  const slug = `${docId}-${cleanTitle || 'syllabus'}`

  // PDF info
  const pdfFilename = catDoc.englishFileName || catDoc.marathiFileName || options.pdfFilename || null
  const pdfUrl = pdfFilename ? `/downloads/mpsc/syllabus/general/${encodeURIComponent(pdfFilename)}` : null

  const sql = `
    INSERT INTO mpsc_syllabi (
      doc_id,
      slug,
      title_en,
      title_mr,
      category,
      exam_level,
      year,
      language,
      total_marks,
      mains_marks,
      interview_marks,
      exam_pattern,
      total_papers,
      pdf_filename,
      pdf_url,
      syllabus_data,
      is_published,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW()
    )
    ON CONFLICT (doc_id) DO UPDATE SET
      slug            = EXCLUDED.slug,
      title_en        = EXCLUDED.title_en,
      title_mr        = COALESCE(EXCLUDED.title_mr, mpsc_syllabi.title_mr),
      category        = EXCLUDED.category,
      exam_level      = EXCLUDED.exam_level,
      year            = EXCLUDED.year,
      language        = EXCLUDED.language,
      total_marks     = EXCLUDED.total_marks,
      mains_marks     = EXCLUDED.mains_marks,
      interview_marks = EXCLUDED.interview_marks,
      exam_pattern    = EXCLUDED.exam_pattern,
      total_papers    = EXCLUDED.total_papers,
      pdf_filename    = COALESCE(EXCLUDED.pdf_filename, mpsc_syllabi.pdf_filename),
      pdf_url         = COALESCE(EXCLUDED.pdf_url, mpsc_syllabi.pdf_url),
      syllabus_data   = EXCLUDED.syllabus_data,
      is_published    = EXCLUDED.is_published,
      updated_at      = NOW()
    RETURNING id, doc_id, slug, title_en, title_mr, category, total_papers;
  `

  const params = [
    docId,
    slug,
    titleEn,
    titleMr,
    category,
    examLevel,
    year,
    language,
    totalMarks,
    mainsMarks,
    interviewMarks,
    examPattern,
    totalPapers,
    pdfFilename,
    pdfUrl,
    JSON.stringify(jsonData), // JSONB column
    true
  ]

  const rows = await query(sql, params)
  return rows[0]
}

// CLI runner
async function main() {
  const target = process.argv[2]
  if (!target) {
    console.log(`
Usage:
  node --env-file=.env.local scripts/insert_syllabus.mjs <doc_id>
  node --env-file=.env.local scripts/insert_syllabus.mjs <path-to-file.json>

Examples:
  node --env-file=.env.local scripts/insert_syllabus.mjs 1181
  node --env-file=.env.local scripts/insert_syllabus.mjs public/downloads/mpsc/syllabus/general/1181_mat.json
    `)
    process.exit(0)
  }

  let filePath = ''
  let docId = null

  if (/^\d+$/.test(target)) {
    docId = parseInt(target, 10)
    // Check possible locations
    const locs = [
      path.join(ROOT_DIR, `src/lib/mpscSyllabusData/${docId}.json`),
      path.join(ROOT_DIR, `public/syllabus-json/${docId}.json`),
      path.join(ROOT_DIR, `public/downloads/mpsc/syllabus/general/${docId}_mat.json`),
      path.join(ROOT_DIR, `syllabus-json/${docId}.json`)
    ]
    filePath = locs.find(l => fs.existsSync(l))
    if (!filePath) {
      console.error(`[insert_syllabus] Error: Could not find JSON file for doc_id ${docId}`)
      process.exit(1)
    }
  } else {
    filePath = path.resolve(process.cwd(), target)
    if (!fs.existsSync(filePath)) {
      console.error(`[insert_syllabus] Error: File does not exist at ${filePath}`)
      process.exit(1)
    }
  }

  console.log(`[insert_syllabus] Reading JSON from: ${filePath}`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const jsonData = JSON.parse(raw)

  // Determine docId with fallbacks: json fields -> filename regex
  if (!docId) {
    const rawFromJson = jsonData.docId ?? jsonData.doc_id ?? jsonData.officialDocId ?? jsonData.id
    if (rawFromJson) {
      docId = parseInt(rawFromJson, 10)
    } else {
      const fnMatch = path.basename(filePath).match(/^(\d+)/)
      if (fnMatch) docId = parseInt(fnMatch[1], 10)
    }
  }

  console.log(`[insert_syllabus] Ingesting Doc #${docId}...`)
  const result = await insertSyllabusJson(jsonData, { docId })

  console.log('✅ Successfully inserted/updated syllabus in database:')
  console.log(JSON.stringify(result, null, 2))
  process.exit(0)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => {
    console.error('❌ Insert failed:', err)
    process.exit(1)
  })
}
