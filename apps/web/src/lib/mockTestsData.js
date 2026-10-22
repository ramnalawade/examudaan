// ============================================================================
// lib/mockTestsData.js — Static MCQ question banks & real exam simulation tests
// ExamUdaan.in — Full 100-question blueprints & high-yield sectional speed drills
// Sourced from 20-year MPSC, Maharashtra Police, TCS Talathi & SSC PYQ patterns
// ============================================================================

import { TALATHI_FULL_MOCK_1 } from './mock-tests/talathiMock100.js'
import { POLICE_BHARTI_FULL_MOCK_1 } from './mock-tests/policeBhartiMock100.js'
import { MPSC_COMBINED_FULL_MOCK_1 } from './mock-tests/mpscCombinedMock100.js'
import { SSC_CGL_FULL_MOCK_1 } from './mock-tests/sscCglMock100.js'
import { SECTIONAL_DRILLS } from './mock-tests/sectionalDrills.js'

// All Mock Tests (Full 100-Q papers first, followed by Sectional Drills)
export const MOCK_TESTS = [
  TALATHI_FULL_MOCK_1,
  POLICE_BHARTI_FULL_MOCK_1,
  MPSC_COMBINED_FULL_MOCK_1,
  SSC_CGL_FULL_MOCK_1,
  ...SECTIONAL_DRILLS
]

// Defensive Aliases: Map legacy or previously broadcasted slugs to real canonical tests
export const MOCK_TEST_ALIASES = {
  // Telegram & WhatsApp broadcasted legacy drill slugs
  'maharashtra-geography-drill-1': 'mpsc-gs-maharashtra-geography',
  'indian-polity-drill-1': 'mpsc-polity-constitution',
  'quantitative-aptitude-drill-1': 'upsc-csat-reasoning',
  'marathi-vyakaran-drill-1': 'marathi-vyakaran-drill-1',

  // Full mock legacy broadcast slugs
  'talathi-full-mock-1': 'maharashtra-talathi-tcs-mock',
  'police-bharti-full-mock-1': 'maharashtra-police-written-mock',
  'police-bharti-written-mock-1': 'maharashtra-police-written-mock',
  'mpsc-combined-prelims-mock-1': 'mpsc-combined-full-prelims',
  'mpsc-combined-full-mock-1': 'mpsc-combined-full-prelims',
  'ssc-cgl-tier1-mock-1': 'ssc-cgl-tier1-full',

  // Additional friendly aliases
  'mpsc-geography': 'mpsc-gs-maharashtra-geography',
  'talathi-mock': 'maharashtra-talathi-tcs-mock',
  'police-bharti-mock': 'maharashtra-police-written-mock',
  'mpsc-combined-mock': 'mpsc-combined-full-prelims',
  'ssc-cgl-mock': 'ssc-cgl-tier1-full',
}

// Helper: get test by slug (with defensive fallback & alias resolution)
export function getTestBySlug(slug) {
  if (!slug) return null
  const resolvedSlug = MOCK_TEST_ALIASES[slug] || slug
  return MOCK_TESTS.find(t => t && t.slug === resolvedSlug) || null
}

// Helper: all test slugs for static routes / checks (includes both canonical slugs & aliases)
export const ALL_TEST_SLUGS = Array.from(new Set([
  ...MOCK_TESTS.filter(t => t && t.slug).map(t => t.slug),
  ...Object.keys(MOCK_TEST_ALIASES)
]))

