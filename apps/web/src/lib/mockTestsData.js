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

// Helper: get test by slug (with defensive fallback)
export function getTestBySlug(slug) {
  if (!slug) return null
  return MOCK_TESTS.find(t => t && t.slug === slug) || null
}

// Helper: all test slugs for static routes / checks
export const ALL_TEST_SLUGS = MOCK_TESTS.filter(t => t && t.slug).map(t => t.slug)
