// ============================================================
// lib/formatTitle.js — Consistent Title Casing & Acronym Preservation
// ExamUdaan.in | Handles "Bima Sakhi", "MPSC", Marathi & mixed casing
// ============================================================

// Known acronyms and uppercase terms that must ALWAYS be preserved
const ACRONYMS = new Set([
  'MPSC', 'UPSC', 'SSC', 'BMC', 'RRB', 'LIC', 'AIIMS', 'ITI', 'NCS',
  'DRDO', 'ISRO', 'ONGC', 'SBI', 'IBPS', 'TCS', 'CBSE', 'NEET', 'GATE',
  'IIT', 'IIM', 'NIT', 'BSc', 'MSc', 'BTech', 'MTech', 'B.Ed', 'D.Ed',
  'LLB', 'LLM', 'MBBS', 'BAMS', 'BHMS', 'GNM', 'ANM', 'PO', 'JE',
  'ASO', 'PSI', 'STI', 'PDF', 'ZP', 'NDRF', 'SDRF', 'CISF', 'BSF',
  'CRPF', 'ITBP', 'SSB', 'UGC', 'NET', 'SET', 'CSIR', 'ICAR', 'ICMR',
  'BARC', 'HAL', 'BEL', 'BHEL', 'NTPC', 'IOCL', 'BPCL', 'HPCL',
  'GAIL', 'SAIL', 'CGL', 'CHSL', 'MTS', 'GD', 'NDA', 'CDS', 'AFCAT',
  'NABARD', 'SIDBI', 'SEBI', 'RBI', 'NHM', 'MCGM', 'PMRDA', 'CIDCO',
  'MSEB', 'MAHAGENCO', 'MAHATRANSCO', 'MSEDCL', 'SRPF', 'PDKV', 'MECL',
  'NEERI', 'ACTREC', 'CIRCOT', 'NBSS', 'IISER', 'KRCL', 'NTA', 'TET'
])

// Lowercase words mapping for case-insensitive lookup
const ACRONYMS_LOWER = new Map(
  Array.from(ACRONYMS).map(a => [a.toLowerCase(), a])
)

// Minor connecting words in English titles (should be lowercased unless first/last word)
const MINOR_WORDS = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at',
  'to', 'from', 'by', 'with', 'in', 'of', 'as', 'via'
])

// Check if a character or text has Devanagari characters
const DEVANAGARI_REGEX = /[\u0900-\u097F]/

/**
 * Format a single word:
 * - Checks if it's a known acronym (returns canonical acronym, e.g. "mpsc" -> "MPSC")
 * - Handles punctuation attachments like "MPSC:", "(SSC)", "BSc/MSc"
 * - Otherwise converts to Title Case: "bima" -> "Bima", "SAKHI" -> "Sakhi"
 */
function formatWord(word, isFirstWord = false, isLastWord = false) {
  if (!word) return ''

  // If word contains Devanagari script, return as-is
  if (DEVANAGARI_REGEX.test(word)) {
    return word
  }

  // Separate leading and trailing non-alphanumeric characters (brackets, quotes, colons, etc.)
  const match = word.match(/^([^a-zA-Z0-9]*)(.*?)([^a-zA-Z0-9]*)$/)
  if (!match) return word

  const [, leading, core, trailing] = match
  if (!core) return word

  const coreLower = core.toLowerCase()

  // 1. Check known acronyms
  if (ACRONYMS_LOWER.has(coreLower)) {
    return leading + ACRONYMS_LOWER.get(coreLower) + trailing
  }

  // 2. If it's a roman numeral like "I", "II", "III", "IV", "V", etc.
  if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(core)) {
    return leading + core.toUpperCase() + trailing
  }

  // 3. If word is a minor connector and not the first/last word
  if (!isFirstWord && !isLastWord && MINOR_WORDS.has(coreLower)) {
    return leading + coreLower + trailing
  }

  // 4. Handle hyphenated or slash-separated subwords (e.g. "Walk-In", "Assistant-Manager", "BSc/MSc")
  if (core.includes('-') || core.includes('/')) {
    const delimiter = core.includes('-') ? '-' : '/'
    const subParts = core.split(delimiter).map((sub, idx) =>
      formatWord(sub, idx === 0 && isFirstWord, idx === core.split(delimiter).length - 1 && isLastWord)
    )
    return leading + subParts.join(delimiter) + trailing
  }

  // 5. Standard Title Casing: Capitalize first letter, lowercase rest
  // E.g. "bima" -> "Bima", "SAKHI" -> "Sakhi", "telecaller" -> "Telecaller"
  const formattedCore = core.charAt(0).toUpperCase() + core.slice(1).toLowerCase()
  return leading + formattedCore + trailing
}

/**
 * Format a title or job heading to clean, proper title case.
 * Examples:
 *   "bima sakhi" -> "Bima Sakhi"
 *   "BIMA SAKHI" -> "Bima Sakhi"
 *   "mpsc civil judge recruitment 2026" -> "MPSC Civil Judge Recruitment 2026"
 *   "bmc junior engineer (civil)" -> "BMC Junior Engineer (Civil)"
 *   "मराठी भरती जाहिरात" -> "मराठी भरती जाहिरात" (untouched)
 *
 * @param {string} str
 * @returns {string}
 */
export function formatTitle(str) {
  if (!str || typeof str !== 'string') return ''
  const trimmed = str.trim()
  if (!trimmed) return ''

  // If entirely Devanagari with no latin words, return trimmed directly
  if (DEVANAGARI_REGEX.test(trimmed) && !/[a-zA-Z]/.test(trimmed)) {
    return trimmed
  }

  // Split by whitespace
  const words = trimmed.split(/\s+/)
  const total = words.length

  const formattedWords = words.map((w, idx) => {
    const isFirst = idx === 0
    const isLast = idx === total - 1
    return formatWord(w, isFirst, isLast)
  })

  return formattedWords.join(' ')
}

/**
 * Format short text or label (alias to formatTitle)
 */
export function formatText(str) {
  return formatTitle(str)
}

export default formatTitle
