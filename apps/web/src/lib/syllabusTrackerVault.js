// ============================================================
// lib/syllabusTrackerVault.js — Interactive Syllabus Checklist & PYQ Mapper
// ExamUdaan.in — Client-first LocalStorage Tracker with PYQ Bank Density
// ============================================================

const STORAGE_KEY = 'examudaan_syllabus_tracker_v1'

export const STATUS_STATES = {
  NOT_STARTED: 'not_started',
  STUDYING: 'studying',
  REVISED: 'revised',
  COMPLETED: 'completed'
}

export const STATUS_CONFIG = {
  not_started: {
    id: 'not_started',
    label: 'Not Started',
    labelMr: 'शुरू नाही',
    icon: '○',
    badgeClass: 'statusNotStarted'
  },
  studying: {
    id: 'studying',
    label: 'Studying',
    labelMr: 'अभ्यास सुरू',
    icon: '📖',
    badgeClass: 'statusStudying'
  },
  revised: {
    id: 'revised',
    label: 'Revised',
    labelMr: 'उजळणी झाली',
    icon: '🔄',
    badgeClass: 'statusRevised'
  },
  completed: {
    id: 'completed',
    label: 'Mastered & Tested',
    labelMr: 'सराव पूर्ण',
    icon: '✅',
    badgeClass: 'statusCompleted'
  }
}

/**
 * Approximate PYQ density mapped to syllabus subtopics
 * Derived from the 10,392 question database
 */
export const PYQ_TOPIC_MAP = {
  'Ancient & Medieval India': { qCount: 42, subjectSlug: 'history', coverage: 'high' },
  'Modern Indian History (1857-1947)': { qCount: 88, subjectSlug: 'history', coverage: 'high' },
  'Maharashtra Renaissance & Social Reformers': { qCount: 122, subjectSlug: 'history', coverage: 'high' },
  'Freedom Movement in Maharashtra': { qCount: 64, subjectSlug: 'history', coverage: 'high' },

  'Physical & Economic Geography': { qCount: 74, subjectSlug: 'geography', coverage: 'high' },
  'Rivers, Dams & Drainage Systems of Maharashtra': { qCount: 112, subjectSlug: 'geography', coverage: 'high' },
  'Forests, Agriculture & Soil': { qCount: 86, subjectSlug: 'geography', coverage: 'high' },
  'Demographics & Urbanization': { qCount: 48, subjectSlug: 'geography', coverage: 'medium' },

  'Constitution of India': { qCount: 110, subjectSlug: 'polity', coverage: 'high' },
  'Panchayati Raj & 73rd/74th Amendments': { qCount: 71, subjectSlug: 'polity', coverage: 'high' },
  'State Legislature & Governor': { qCount: 84, subjectSlug: 'polity', coverage: 'high' },
  'Judiciary & High Court': { qCount: 65, subjectSlug: 'polity', coverage: 'high' },
  'Public Policy & Rights Issues': { qCount: 38, subjectSlug: 'polity', coverage: 'medium' },

  'Sustainable Development & Poverty': { qCount: 44, subjectSlug: 'economy', coverage: 'medium' },
  'Maharashtra State Budget & Economic Survey': { qCount: 52, subjectSlug: 'economy', coverage: 'high' },
  'Banking, Inflation & RBI': { qCount: 77, subjectSlug: 'economy', coverage: 'high' },
  'Social Sector Initiatives & Welfare Programs': { qCount: 78, subjectSlug: 'economy', coverage: 'high' },

  'Physics, Chemistry & Biology basics': { qCount: 200, subjectSlug: 'science', coverage: 'high' },
  'Ecology & Biodiversity of Western Ghats': { qCount: 54, subjectSlug: 'science', coverage: 'high' },
  'Climate Change & Pollution': { qCount: 36, subjectSlug: 'science', coverage: 'medium' },
  'Disaster Management': { qCount: 18, subjectSlug: 'geography', coverage: 'low' },

  'Maharashtra State Affairs': { qCount: 140, subjectSlug: 'current-affairs', coverage: 'high' },
  'National Political & Economic Events': { qCount: 95, subjectSlug: 'current-affairs', coverage: 'high' },
  'Sports, Awards & Scientific Milestones': { qCount: 60, subjectSlug: 'current-affairs', coverage: 'medium' },

  'Logical Reasoning & Analytical Ability': { qCount: 120, subjectSlug: 'reasoning', coverage: 'high' },
  'Basic Numeracy & Data Interpretation': { qCount: 85, subjectSlug: 'reasoning', coverage: 'high' },
  'Marathi Reading Comprehension passages': { qCount: 50, subjectSlug: 'marathi', coverage: 'medium' },
  'English Reading Comprehension passages': { qCount: 40, subjectSlug: 'english', coverage: 'medium' },

  'Grammar & Sentence Structure': { qCount: 96, subjectSlug: 'marathi', coverage: 'high' },
  'Vocabulary & Idioms': { qCount: 72, subjectSlug: 'marathi', coverage: 'high' }
}

export function getSyllabusTrackerVault() {
  if (typeof window === 'undefined') return { progress: {}, lastUpdated: null }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { progress: {}, lastUpdated: null }
    return JSON.parse(raw)
  } catch (err) {
    console.warn('[syllabusTrackerVault] Read error:', err)
    return { progress: {}, lastUpdated: null }
  }
}

export function saveSyllabusTrackerVault(vault) {
  if (typeof window === 'undefined') return
  try {
    vault.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault))
    window.dispatchEvent(new CustomEvent('examudaan:syllabus_updated', { detail: vault }))
  } catch (err) {
    console.warn('[syllabusTrackerVault] Write error:', err)
  }
}

export function setTopicStatus(examSlug, paperName, topicName, subtopicName, status) {
  const vault = getSyllabusTrackerVault()
  const key = `${examSlug}::${paperName}::${topicName}::${subtopicName}`
  vault.progress[key] = {
    status,
    updatedAt: new Date().toISOString()
  }
  saveSyllabusTrackerVault(vault)
  return vault
}

export function getTopicStatus(vault, examSlug, paperName, topicName, subtopicName) {
  const key = `${examSlug}::${paperName}::${topicName}::${subtopicName}`
  return vault?.progress?.[key]?.status || STATUS_STATES.NOT_STARTED
}
