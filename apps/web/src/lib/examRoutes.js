// ============================================================
// lib/examRoutes.js — Route resolver for exam disciplines & use cases
// Maps exam names, categories, and disciplines to internal ExamUdaan pages
// ============================================================

/**
 * Resolves a given exam discipline or use case string to the best internal ExamUdaan page.
 * @param {string} useCase - e.g. "UPSC Civil Services Examination", "MPSC Rajyaseva", etc.
 * @returns {string} - internal route path e.g. "/syllabus/upsc-cse"
 */
export function getExamUseCaseRoute(useCase) {
  if (!useCase || typeof useCase !== 'string') return '/syllabus'
  const text = useCase.toLowerCase().trim()

  // 1. UPSC Civil Services / IAS / IPS / CSE
  if (
    text.includes('upsc') ||
    text.includes('civil services') ||
    text.includes('ias') ||
    text.includes('ips')
  ) {
    return '/syllabus/upsc-cse'
  }

  // 2. MPSC Combined Group B & C
  if (
    text.includes('combined') ||
    text.includes('group b') ||
    text.includes('group c') ||
    text.includes('psi') ||
    text.includes('sti') ||
    text.includes('aso')
  ) {
    return '/syllabus/mpsc-combined'
  }

  // 3. MPSC State Services (Rajyaseva)
  if (
    text.includes('mpsc') ||
    text.includes('rajyaseva') ||
    text.includes('rajya seva') ||
    text.includes('state service')
  ) {
    return '/syllabus/mpsc-state-services'
  }

  // 4. Banking — RBI Grade B
  if (text.includes('rbi') || text.includes('reserve bank')) {
    return '/syllabus/rbi-grade-b'
  }

  // 5. Banking — SBI PO
  if (text.includes('sbi')) {
    return '/syllabus/sbi-po'
  }

  // 6. Banking — IBPS PO / General Banking
  if (
    text.includes('ibps') ||
    text.includes('banking') ||
    text.includes('bank po') ||
    text.includes('clerk')
  ) {
    return '/syllabus/ibps-po'
  }

  // 7. SSC CHSL
  if (text.includes('chsl') || text.includes('10+2')) {
    return '/syllabus/ssc-chsl'
  }

  // 8. SSC CGL & General Staff Selection Commission
  if (
    text.includes('ssc') ||
    text.includes('cgl') ||
    text.includes('staff selection')
  ) {
    return '/syllabus/ssc-cgl'
  }

  // 9. Railway Recruitment (RRB NTPC & Group D)
  if (text.includes('group d') || text.includes('rrc')) {
    return '/syllabus/rrb-group-d'
  }
  if (
    text.includes('railway') ||
    text.includes('rrb') ||
    text.includes('ntpc')
  ) {
    return '/syllabus/rrb-ntpc'
  }

  // 10. Maharashtra Police Bharti
  if (
    text.includes('police') ||
    text.includes('constable') ||
    text.includes('srpf')
  ) {
    return '/syllabus/maharashtra-police'
  }

  // 11. Maharashtra Talathi Bharti
  if (text.includes('talathi')) {
    return '/syllabus/maharashtra-talathi'
  }

  // 12. Interview / Personality Test / Viva
  if (
    text.includes('interview') ||
    text.includes('personality test') ||
    text.includes('viva')
  ) {
    return '/mock-interview'
  }

  // 13. Technical Exams / Coding / IT / ISRO / NIC / Engineering Projects
  if (
    text.includes('technical') ||
    text.includes('isro') ||
    text.includes('nic') ||
    text.includes('nielit') ||
    text.includes('it officer') ||
    text.includes('coding') ||
    text.includes('engineering')
  ) {
    return '/jobs?q=technical'
  }

  // 14. Academic / College / Dissertation / Semester / Research Theses
  if (
    text.includes('college') ||
    text.includes('university') ||
    text.includes('coursework') ||
    text.includes('semester') ||
    text.includes('theses') ||
    text.includes('thesis') ||
    text.includes('dissertation') ||
    text.includes('seminar')
  ) {
    return '/study-planner'
  }

  // 15. Quizzes / Quantitative / Data Interpretation / Practice Tests
  if (
    text.includes('quiz') ||
    text.includes('mock') ||
    text.includes('quantitative') ||
    text.includes('scripting') ||
    text.includes('recall check')
  ) {
    return '/mock-tests'
  }

  // 16. Other State PSCs (UPPSC, BPSC, WBPSC, KPSC)
  if (
    text.includes('state psc') ||
    text.includes('uppsc') ||
    text.includes('bpsc') ||
    text.includes('wbpsc') ||
    text.includes('kpsc')
  ) {
    return '/jobs?type=job'
  }

  // 17. Visual Study Mind-maps / Diagrams
  if (
    text.includes('mind-map') ||
    text.includes('infographic') ||
    text.includes('timeline')
  ) {
    return '/syllabus'
  }

  // 18. Default fallback
  return '/syllabus'
}
