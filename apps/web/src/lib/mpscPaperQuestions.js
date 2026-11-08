// ============================================================
// lib/mpscPaperQuestions.js — Loads Extracted PYQs for a Specific Paper
// ExamUdaan | Per-paper JSON files in lib/mpsc-questions/{slug}.json
//
// IMPORTANT: Uses fs.readFileSync at request time (server-side only).
// This avoids loading the full 69 MB monolith into memory.
// Each paper file is small (~10-200 KB) and only loaded when needed.
// ============================================================

import fs from 'fs'
import path from 'path'

// Directory containing per-paper JSON files
const QUESTIONS_DIR = path.join(process.cwd(), 'src/lib/mpsc-questions')

/**
 * Reads questions for a specific paper from its individual JSON file.
 * Falls back to partial slug matching if exact slug file not found.
 */
export function getQuestionsForPaper(paperItem) {
  if (!paperItem) return []

  const { slug, id } = paperItem

  // 1. Try exact slug match first (fastest path)
  if (slug) {
    const exactPath = path.join(QUESTIONS_DIR, `${slug}.json`)
    if (fs.existsSync(exactPath)) {
      try {
        return JSON.parse(fs.readFileSync(exactPath, 'utf8'))
      } catch {
        return []
      }
    }
  }

  // 2. Scan directory for a partial slug or id match
  // (handles cases where stored slug differs slightly from catalog slug)
  let files
  try {
    files = fs.readdirSync(QUESTIONS_DIR)
  } catch {
    return []
  }

  const slugLower = (slug || '').toLowerCase()
  const idStr = String(id || '')

  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const key = file.slice(0, -5) // strip .json
    const kLower = key.toLowerCase()
    if (
      (slugLower && (kLower.includes(slugLower) || slugLower.includes(kLower))) ||
      (idStr && (kLower.includes(idStr) || kLower.startsWith(idStr + '_')))
    ) {
      try {
        const filePath = path.join(QUESTIONS_DIR, file)
        return JSON.parse(fs.readFileSync(filePath, 'utf8'))
      } catch {
        return []
      }
    }
  }

  return []
}
