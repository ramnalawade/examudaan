// ============================================================
// lib/mpscDocumentResolver.js — MPSC Document Index & Clean Slug Resolver
// ExamUdaan.in | Eliminates query strings for 1,159 MPSC Question Papers,
// Answer Keys, Syllabus & Timetables into clean, human-readable SEO slugs.
// ============================================================

import fs from 'fs'
import path from 'path'

// Cache maps in module scope for high-speed resolution
let cachedDocMap = null
let cachedList = null

export function slugifyTitle(text) {
  if (!text || typeof text !== 'string') return 'document'
  return text
    .toLowerCase()
    .replace(/^advt?\.?\s*(no\.?)?\s*[\d\/\-_]+\s*/i, '') // strip Advt No prefix
    .replace(/[_\s]+/g, '-')                             // convert underscores & spaces to hyphen
    .replace(/[^\w-]/g, '')                              // keep clean ascii letters, numbers & hyphen
    .trim()
    .replace(/-+/g, '-')                                 // collapse duplicate hyphens
    .replace(/^-+|-+$/g, '')                             // trim edge hyphens
    .slice(0, 90) || 'document'
}

function normalizeType(folderName) {
  const f = String(folderName || '').toLowerCase()
  if (f.includes('answer_key') || f.includes('answer-key')) return 'answer-keys'
  if (f.includes('question_paper') || f.includes('question-paper')) return 'question-papers'
  if (f.includes('syllabus')) return 'syllabus'
  if (f.includes('calendar') || f.includes('timetable')) return 'calendar'
  return 'question-papers'
}

/**
 * Loads all catalogs and scans the disk to build the complete document index.
 */
export function getMpscDocumentIndex() {
  if (cachedDocMap && cachedList) {
    return { map: cachedDocMap, list: cachedList }
  }

  const map = new Map()
  const list = []

  let baseDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'downloads', 'mpsc')
  if (!fs.existsSync(baseDir)) {
    baseDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'apps', 'web', 'public', 'downloads', 'mpsc')
  }

  let libDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'src', 'lib')
  if (!fs.existsSync(libDir)) {
    libDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'apps', 'web', 'src', 'lib')
  }

  // Helper to register catalog entries
  const catalogMeta = new Map()
  function registerMeta(id, meta) {
    if (!id) return
    const num = parseInt(id, 10)
    if (isNaN(num)) return
    if (!catalogMeta.has(num)) {
      catalogMeta.set(num, meta)
    } else {
      const existing = catalogMeta.get(num)
      catalogMeta.set(num, { ...existing, ...meta })
    }
  }

  // 1. Ingest Official Catalog
  try {
    const offPath = path.join(libDir, 'mpscOfficialCatalog.json')
    if (fs.existsSync(offPath)) {
      const off = JSON.parse(fs.readFileSync(offPath, 'utf8'))
      ;(off.questionPapers || []).forEach(p => registerMeta(p.id, {
        title: p.descInEnglish,
        titleMr: p.descMr,
        year: p.yearOfAdvertisement,
        type: 'question-papers',
        advtNo: p.advertisementNumber
      }))
      ;(off.answerKeys || []).forEach(k => registerMeta(k.id, {
        title: k.descInEnglish,
        titleMr: k.descMr,
        year: k.yearOfAdvertisement,
        type: 'answer-keys',
        advtNo: k.advertisementNumber
      }))
    }
  } catch (err) {
    // Continue
  }

  // 2. Ingest Local Papers Catalog
  try {
    const locPath = path.join(libDir, 'mpscLocalPapers.json')
    if (fs.existsSync(locPath)) {
      const loc = JSON.parse(fs.readFileSync(locPath, 'utf8'))
      loc.forEach(p => registerMeta(p.id, {
        title: p.title,
        titleMr: p.titleMr,
        year: p.year,
        type: p.type === 'answer-key' ? 'answer-keys' : 'question-papers',
        advtNo: p.advertisementNumber
      }))
    }
  } catch (err) {
    // Continue
  }

  // 3. Ingest Syllabus Catalog
  try {
    const sylPath = path.join(libDir, 'mpscSyllabusCatalog.json')
    if (fs.existsSync(sylPath)) {
      const syl = JSON.parse(fs.readFileSync(sylPath, 'utf8'))
      ;(syl.syllabusDocuments || []).forEach(s => registerMeta(s.id, {
        title: s.descInEnglish,
        titleMr: s.descMr,
        year: s.yearOfAdvertisement || 2025,
        type: 'syllabus',
        advtNo: s.advertisementNumber
      }))
    }
  } catch (err) {
    // Continue
  }

  // 4. Ingest Calendar Catalog
  try {
    const calPath = path.join(libDir, 'mpscCalendarCatalog.json')
    if (fs.existsSync(calPath)) {
      const cal = JSON.parse(fs.readFileSync(calPath, 'utf8'))
      ;(cal.annualSchedules || []).forEach(c => registerMeta(c.id, {
        title: c.descInEnglish,
        titleMr: c.descMr,
        year: c.yearOfAdvertisement || 2025,
        type: 'calendar'
      }))
      ;(cal.examinationTimetables || []).forEach(c => registerMeta(c.id, {
        title: c.descInEnglish,
        titleMr: c.descMr,
        year: c.yearOfAdvertisement || 2025,
        type: 'calendar'
      }))
    }
  } catch (err) {
    // Continue
  }

  // 5. Scan actual disk files in public/downloads/mpsc/
  if (fs.existsSync(baseDir)) {
    function scanDir(dir) {
      let results = []
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
          const full = path.join(dir, entry.name)
          if (entry.isDirectory()) {
            results = results.concat(scanDir(full))
          } else if (entry.name.endsWith('.pdf')) {
            const rel = path.relative(baseDir, full).split(path.sep).join('/')
            const stats = fs.statSync(full)
            results.push({ full, rel, filename: entry.name, mtime: stats.mtime.toISOString(), size: stats.size })
          }
        }
      } catch (e) {}
      return results
    }

    const diskFiles = scanDir(baseDir)
    diskFiles.forEach(file => {
      const m = file.filename.match(/^(\d+)/)
      if (!m) return
      const numId = parseInt(m[1], 10)
      const meta = catalogMeta.get(numId) || {}

      // Deduce category and year from folder path
      // rel looks like: "answer_keys/2025/11293_..." or "14404_..."
      const parts = file.rel.split('/')
      let folderType = parts.length > 2 ? normalizeType(parts[0]) : (meta.type || 'question-papers')
      let folderYear = parts.length > 2 ? parts[1] : (meta.year || '2025')

      const rawTitle = meta.title || file.filename.replace(/^\d+_/, '').replace(/\.pdf$/i, '')
      const cleanSlugStr = slugifyTitle(rawTitle)
      const slugSegment = `${numId}-${cleanSlugStr}`

      const cleanSlugArray = ['mpsc', folderType, String(folderYear), slugSegment]
      const cleanUrlPath = `/question-papers/viewer/mpsc/${folderType}/${folderYear}/${slugSegment}`
      const directWebPath = `/downloads/mpsc/${file.rel}`

      const docRecord = {
        id: numId,
        title: rawTitle,
        titleMr: meta.titleMr || rawTitle,
        year: folderYear,
        type: folderType,
        advtNo: meta.advtNo || null,
        slugSegment,
        cleanSlugArray,
        cleanUrlPath,
        directWebPath,
        mtime: file.mtime,
        sizeBytes: file.size,
      }

      map.set(numId, docRecord)
      list.push(docRecord)
    })
  }

  cachedDocMap = map
  cachedList = list

  return { map, list }
}

/**
 * Resolves a document record from a dynamic slug array.
 * Works with ['mpsc', 'answer-keys', '2025', '11293-slug'] OR ['11293-slug'] OR ['11293']
 */
export function resolveMpscDocument(slugArray) {
  if (!slugArray) return null
  const { map } = getMpscDocumentIndex()

  const rawArr = Array.isArray(slugArray) ? slugArray : [String(slugArray)]
  const lastPart = rawArr[rawArr.length - 1] || ''

  // 1. Extract leading or sole ID
  const match = lastPart.match(/^(\d+)/)
  if (match) {
    const numId = parseInt(match[1], 10)
    if (map.has(numId)) {
      return map.get(numId)
    }
  }

  // 2. Scan entire slug array for any numeric segment
  for (const part of rawArr) {
    const pMatch = part.match(/^(\d+)/)
    if (pMatch) {
      const numId = parseInt(pMatch[1], 10)
      if (map.has(numId)) {
        return map.get(numId)
      }
    }
  }

  return null
}

/**
 * Resolves legacy query string ?pdf=/downloads/mpsc/... to its new clean human-readable URL.
 */
export function resolveLegacyPdfUrl(pdfQueryParam) {
  if (!pdfQueryParam || typeof pdfQueryParam !== 'string') return null
  const { map } = getMpscDocumentIndex()

  // Extract ID from path e.g. /downloads/mpsc/answer_keys/2025/11293_...
  const filename = pdfQueryParam.split('/').pop() || ''
  const m = filename.match(/^(\d+)/)
  if (m) {
    const numId = parseInt(m[1], 10)
    if (map.has(numId)) {
      return map.get(numId).cleanUrlPath
    }
  }

  return null
}

/**
 * Returns all clean, human-readable MPSC paper entries for sitemap.js.
 * Zero query strings, pure semantic URL paths.
 */
export function getCleanMpscPaperSitemapEntries(baseUrl, nowIso) {
  const { list } = getMpscDocumentIndex()
  const base = baseUrl.replace(/\/+$/, '')

  return list.map(doc => ({
    url: `${base}${doc.cleanUrlPath}`,
    lastModified: doc.mtime || nowIso,
    changeFrequency: 'monthly',
    priority: 0.88,
  }))
}

/**
 * Returns all static slug parameters for generateStaticParams().
 */
export function getMpscViewerStaticParams() {
  const { list } = getMpscDocumentIndex()
  return list.map(doc => ({
    slug: doc.cleanSlugArray,
  }))
}
