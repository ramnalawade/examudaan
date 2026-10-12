// ============================================================
// lib/analytics.js — Client-Side GA4 & GTM Event Tracker
// ExamUdaan.in — Safe SSR execution for Custom & Key Events
// Covers Priority 1 (Key Events), Priority 2 (Engagement), Priority 3 (Site-Wide)
// ============================================================

/**
 * Core event dispatcher: sends events safely to both Google Analytics 4 (gtag)
 * and Google Tag Manager (dataLayer).
 *
 * @param {string} eventName
 * @param {Record<string, any>} params
 */
export function sendEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || !eventName) return

  // 1. Send to Google Analytics 4 via gtag if available
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params)
    }
  } catch (err) {
    // Non-blocking error handling
  }

  // 2. Push to Google Tag Manager dataLayer
  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: eventName,
      ...params,
    })
  } catch (err) {
    // Non-blocking error handling
  }
}

// ── 🚨 Priority 1: Core Conversion & Key Events ─────────────────

/**
 * 1. Mock Test Start (Key Event)
 * Fires when user clicks "Start Official Mock Exam" on /mock-tests/...
 */
export function trackMockTestStart({ exam_name = '', test_id = '' } = {}) {
  sendEvent('mock_test_start', {
    exam_name: String(exam_name || '').trim(),
    test_id: String(test_id || '').trim(),
  })
}

/**
 * 2. Mock Test Complete (Key Event)
 * Fires when user submits a mock test and receives scorecard
 */
export function trackMockTestComplete({
  exam_name = '',
  test_id = '',
  score = 0,
  percentage = 0,
  rank = '',
} = {}) {
  sendEvent('mock_test_complete', {
    exam_name: String(exam_name || '').trim(),
    test_id: String(test_id || '').trim(),
    score: Number(score) || 0,
    percentage: Number(percentage) || 0,
    rank: String(rank || '').trim(),
  })
}

/**
 * 3. Study Planner Generate (Key Event)
 * Fires when user generates/recalibrates a study plan on /study-planner
 */
export function trackStudyPlannerGenerate({
  target_exam = '',
  plan_duration_days = 60,
  study_hours_per_day = '',
} = {}) {
  sendEvent('study_planner_generate', {
    target_exam: String(target_exam || '').trim(),
    plan_duration_days: Number(plan_duration_days) || 60,
    study_hours_per_day: String(study_hours_per_day || '').trim(),
  })
}

/**
 * 4. AI Tool Click (Key Event)
 * Fires when user clicks any AI tool card on /ai-tools
 */
export function trackAiToolClick({ tool_name = '', tool_category = '' } = {}) {
  sendEvent('ai_tool_click', {
    tool_name: String(tool_name || '').trim(),
    tool_category: String(tool_category || '').trim(),
  })
}

/**
 * 5. Job Apply Click (Key Event)
 * Fires when user clicks "Apply Online" on job detail pages
 */
export function trackJobApplyClick({ job_title = '', organization = '', job_id = '' } = {}) {
  sendEvent('job_apply_click', {
    job_title: String(job_title || '').trim(),
    organization: String(organization || '').trim(),
    job_id: String(job_id || '').trim(),
  })
}

/**
 * 6. Answer Key / PDF Download (Key Event)
 * Fires when user clicks to download answer key, PYQ paper, or notification PDF
 */
export function trackAnswerKeyDownload({ exam_name = '', year = '', file_name = '' } = {}) {
  sendEvent('answer_key_download', {
    exam_name: String(exam_name || '').trim(),
    year: String(year || '').trim(),
    file_name: String(file_name || '').trim(),
  })
}

/**
 * 7. Calculator Use (Key Event)
 * Fires when user calculates score on /police-calculator or /salary-calculator
 */
export function trackCalculatorUse({ calculator_type = '', exam_name = '' } = {}) {
  sendEvent('calculator_use', {
    calculator_type: String(calculator_type || '').trim(),
    exam_name: String(exam_name || '').trim(),
  })
}

/**
 * 8. User Signup (Standard GA4 Conversion / Key Event)
 */
export function trackSignUp({ method = 'email' } = {}) {
  sendEvent('sign_up', {
    method: String(method || '').trim(),
  })
}

/**
 * 9. User Login (Standard GA4 Event)
 */
export function trackLogin({ method = 'email' } = {}) {
  sendEvent('login', {
    method: String(method || '').trim(),
  })
}

// ── 🧪 Priority 2: In-Depth Engagement Events ──────────────────

/**
 * Mock Test Page View
 */
export function trackMockTestView({ exam_name = '', test_id = '' } = {}) {
  sendEvent('mock_test_view', {
    exam_name: String(exam_name || '').trim(),
    test_id: String(test_id || '').trim(),
  })
}

/**
 * Mock Test Section Start
 */
export function trackMockTestSectionStart({ exam_name = '', section_name = '' } = {}) {
  sendEvent('mock_test_section_start', {
    exam_name: String(exam_name || '').trim(),
    section_name: String(section_name || '').trim(),
  })
}

/**
 * Mock Test Answer Review
 */
export function trackMockTestAnswerReview({ exam_name = '', question_id = '' } = {}) {
  sendEvent('mock_test_answer_review', {
    exam_name: String(exam_name || '').trim(),
    question_id: String(question_id || '').trim(),
  })
}

/**
 * Study Planner Day Completed
 */
export function trackPlannerDayComplete({ plan_id = '', day_number = 1 } = {}) {
  sendEvent('planner_day_complete', {
    plan_id: String(plan_id || '').trim(),
    day_number: Number(day_number) || 1,
  })
}

/**
 * Study Planner Task Clicked
 */
export function trackPlannerTaskClick({ plan_id = '', task_type = '' } = {}) {
  sendEvent('planner_task_click', {
    plan_id: String(plan_id || '').trim(),
    task_type: String(task_type || '').trim(),
  })
}

/**
 * AI Tool Directory Category Filter
 */
export function trackAiToolFilter({ filter_type = 'category', filter_value = '' } = {}) {
  sendEvent('ai_tool_filter', {
    filter_type: String(filter_type || '').trim(),
    filter_value: String(filter_value || '').trim(),
  })
}

/**
 * AI Tool Directory Search
 */
export function trackAiToolSearch({ search_term = '' } = {}) {
  if (!search_term || !search_term.trim()) return
  sendEvent('ai_tool_search', {
    search_term: String(search_term || '').trim(),
  })
}

/**
 * Interactive Syllabus Checklist Item Checked
 */
export function trackSyllabusChecklistItemCheck({
  syllabus_name = '',
  item_text = '',
  stage = '',
} = {}) {
  sendEvent('syllabus_checklist_item_check', {
    syllabus_name: String(syllabus_name || '').trim(),
    item_text: String(item_text || '').trim(),
    stage: String(stage || '').trim(),
  })
}

/**
 * Syllabus Scroll Depth >75%
 */
export function trackSyllabusScroll75({ syllabus_name = '' } = {}) {
  sendEvent('syllabus_scroll_75', {
    syllabus_name: String(syllabus_name || '').trim(),
    scroll_depth: 75,
  })
}

/**
 * Job Board Filter Applied
 */
export function trackJobFilterApply({ filter_type = '', filter_value = '' } = {}) {
  sendEvent('job_filter_apply', {
    filter_type: String(filter_type || '').trim(),
    filter_value: String(filter_value || '').trim(),
  })
}

/**
 * Job Board Search
 */
export function trackJobSearch({ search_term = '' } = {}) {
  if (!search_term || !search_term.trim()) return
  sendEvent('job_search', {
    search_term: String(search_term || '').trim(),
  })
}

/**
 * Result PDF View / Download
 */
export function trackResultPdfView({ result_title = '', organization = '' } = {}) {
  sendEvent('result_pdf_view', {
    result_title: String(result_title || '').trim(),
    organization: String(organization || '').trim(),
  })
}

/**
 * YouTube Video Play
 */
export function trackVideoPlay({ video_title = '', video_id = '' } = {}) {
  sendEvent('video_play', {
    video_title: String(video_title || '').trim(),
    video_id: String(video_id || '').trim(),
  })
}

// ── 🛠️ Priority 3: Advanced & Site-Wide Events ──────────────────

/**
 * Pricing Page View
 */
export function trackPricingPageView() {
  sendEvent('pricing_page_view', {
    page_path: '/pricing',
  })
}

/**
 * Outbound Link Click
 */
export function trackOutboundLinkClick({ link_url = '', link_domain = '' } = {}) {
  let domain = link_domain
  if (!domain && link_url) {
    try {
      domain = new URL(link_url).hostname
    } catch {
      domain = ''
    }
  }
  sendEvent('outbound_link_click', {
    link_url: String(link_url || '').trim(),
    link_domain: String(domain || '').trim(),
  })
}

/**
 * Admin Page View (Data hygiene - sets traffic_type internal)
 */
export function trackAdminPageView({ page_path = '' } = {}) {
  sendEvent('admin_page_view', {
    page_path: String(page_path || '').trim(),
    traffic_type: 'internal',
  })
}

/**
 * High-value CTA click (backward compatible + fires specific cta_click)
 */
export function trackCtaClick(buttonName, destinationUrl, buttonLocation = 'general') {
  const bName = String(buttonName || '').trim()
  const dUrl = String(destinationUrl || '').trim()
  const bLoc = String(buttonLocation || 'general').trim()

  sendEvent('cta_click', {
    cta_text: bName,
    destination_url: dUrl,
    cta_location: bLoc,
  })

  // Retain legacy event for backward compatibility with active reporting
  sendEvent('click_cta', {
    button_name: bName,
    destination_url: dUrl,
    button_location: bLoc,
  })
}

/**
 * Social / Community click
 */
export function trackSocialCommunity(platformName, pageUrl = '', buttonLocation = 'general') {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const payload = {
    platform_name: String(platformName || '').toLowerCase().trim(),
    page_url: String(pageUrl || currentPath).trim(),
    button_location: String(buttonLocation || 'general').trim(),
  }

  sendEvent('click_social_community', payload)
}
