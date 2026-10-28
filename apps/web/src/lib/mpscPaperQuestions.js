// ============================================================
// lib/mpscPaperQuestions.js — Loads Extracted PYQs for a Specific Paper
// ExamUdaan | Direct JSON lookup mapped by paper slug & id
// ============================================================

import questionsMap from './mpscPaperQuestionsMap.json'

export function getQuestionsForPaper(paperItem) {
  if (!paperItem) return []

  const { slug, id } = paperItem

  if (slug && questionsMap[slug]) {
    return questionsMap[slug]
  }

  // Look for partial matches on slug or id
  const slugLower = (slug || '').toLowerCase()
  const idStr = String(id || '')

  for (const [key, questions] of Object.entries(questionsMap)) {
    const kLower = key.toLowerCase()
    if (
      (slugLower && (kLower.includes(slugLower) || slugLower.includes(kLower))) ||
      (idStr && (kLower.includes(idStr) || kLower.startsWith(idStr + '_')))
    ) {
      return questions
    }
  }

  return []
}
