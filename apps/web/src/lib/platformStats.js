// ============================================================
// lib/platformStats.js — Central Single Source of Truth for Platform Numbers
// ExamUdaan.in — Synchronized stats across Homepage, Dashboard, APIs & Hubs
// ============================================================

import { AI_TOOLS } from './aiToolsData.js'
import { MOCK_TESTS } from './mockTestsData.js'
import { SYLLABUS_EXAMS } from './syllabusData.js'
import { CAREER_PATHS } from './careerGuideData.js'
import { BLOG_POSTS } from './blogData.js'

// Real exact counts from active data registries
export const REAL_AI_TOOLS_COUNT = (AI_TOOLS || []).length || 124
export const REAL_MOCK_TESTS_COUNT = (MOCK_TESTS || []).length || 13
export const REAL_SYLLABI_COUNT = 280
export const REAL_CAREERS_COUNT = (CAREER_PATHS || []).length || 50
export const REAL_BLOGS_COUNT = (BLOG_POSTS || []).length || 28

// 18-Year MPSC Archive (2009-2026) verified counts — Single Source of Truth
export const MPSC_ARCHIVE_YEARS_SPAN = '2009-2026'
export const MPSC_ARCHIVE_YEARS_COUNT = 18
export const MPSC_TOTAL_QUESTION_PAPERS = 1284
export const MPSC_TOTAL_ANSWER_KEYS = 773
export const MPSC_TOTAL_ARCHIVE_FOLDERS = 1491
export const MPSC_TOTAL_EXTRACTED_PYQS = '11,960+'

export const MPSC_CADRE_COUNTS = {
  rajyaseva: {
    key: 'rajyaseva',
    name: 'Rajyaseva (State Services)',
    nameMr: 'राज्यसेवा परीक्षा',
    count: 344,
    folders: 429,
    keys: 152,
    percent: 26.8,
    color: '#EA580C',
    slug: 'rajyaseva-previous-year-papers',
    badge: 'State Services',
    icon: '🏛️'
  },
  groupB: {
    key: 'group-b',
    name: 'Group B (PSI / STI / ASO)',
    nameMr: 'गट ब संयुक्त परीक्षा',
    count: 259,
    folders: 290,
    keys: 206,
    percent: 20.2,
    color: '#0284C7',
    slug: 'group-b-previous-year-papers',
    badge: 'Non-Gazetted Group B',
    icon: '👮'
  },
  groupC: {
    key: 'group-c',
    name: 'Group C Services',
    nameMr: 'गट क संयुक्त परीक्षा',
    count: 53,
    folders: 88,
    keys: 38,
    percent: 4.1,
    color: '#059669',
    slug: 'group-c-previous-year-papers',
    badge: 'Group C Services',
    icon: '📋'
  },
  otherServices: {
    key: 'other-services',
    name: 'Other & Technical Services',
    nameMr: 'इतर व तांत्रिक सेवा',
    count: 628,
    folders: 684,
    keys: 377,
    percent: 48.9,
    color: '#7C3AED',
    slug: 'other-services-previous-year-papers',
    badge: 'Technical & Other Services',
    icon: '🏗️'
  }
}

export const REAL_PYQ_PAPERS_COUNT = MPSC_TOTAL_QUESTION_PAPERS
export const REAL_PYQ_EXAMS_COUNT = MPSC_TOTAL_ARCHIVE_FOLDERS
export const REAL_PYQ_COUNT = MPSC_TOTAL_EXTRACTED_PYQS

// Safe fallback for live database counts
export const DEFAULT_PLATFORM_STATS = {
  total_jobs: '575',
  raw_total_jobs: 575,
  total_notifications: '740+',
  total_results: '140+',
  total_answer_keys: '68+',
  total_keys_results: '208+',
  total_boards: '42+',
  total_vacancies: '90,791',
  total_ai_tools: REAL_AI_TOOLS_COUNT,
  total_mock_tests: REAL_MOCK_TESTS_COUNT,
  total_syllabi: REAL_SYLLABI_COUNT,
  total_pyq_papers: REAL_PYQ_PAPERS_COUNT,
  total_careers: REAL_CAREERS_COUNT,
  total_questions: REAL_PYQ_COUNT,
  total_blogs: REAL_BLOGS_COUNT,
}

