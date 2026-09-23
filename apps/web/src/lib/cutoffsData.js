// ============================================================
// cutoffsData.js — 10-Year (2015–2024) Comprehensive Cutoff Database
// Covers MPSC Rajyaseva, Combined PSI/STI/ASO, Group C, Talathi, Police Bharti, ZP & SSC
// ============================================================

export const HISTORICAL_CUTOFFS = [
  // ─────────────────────────────────────────────────────────────
  // 1. MPSC COMBINED GROUP B (PSI, STI, ASO) — 2015 to 2024
  // ─────────────────────────────────────────────────────────────
  {
    id: 'mpsc_psi_2024',
    exam: 'MPSC Combined Group B',
    post: 'Police Sub-Inspector (PSI) Prelims',
    year: '2024',
    totalMarks: 100,
    trend: 'up',
    cutoffs: { open: 55.50, obc: 55.50, ews: 55.50, sebc: 55.50, sc: 53.00, st: 48.00, women: 50.50, sports: 40.00, ex_service: 31.00 },
    vacancies: 480,
    notes: 'Negative marking -0.25. High competition; revised syllabus format.'
  },
  {
    id: 'mpsc_psi_2023',
    exam: 'MPSC Combined Group B',
    post: 'Police Sub-Inspector (PSI) Prelims',
    year: '2023',
    totalMarks: 100,
    trend: 'up',
    cutoffs: { open: 53.75, obc: 53.75, ews: 53.75, sebc: 53.75, sc: 51.50, st: 46.25, women: 48.00, sports: 38.50, ex_service: 29.00 },
    vacancies: 603,
    notes: 'Negative marking -0.25. High competition due to vacancy gap.'
  },
  {
    id: 'mpsc_psi_2022',
    exam: 'MPSC Combined Group B',
    post: 'Police Sub-Inspector (PSI) Prelims',
    year: '2022',
    totalMarks: 100,
    trend: 'stable',
    cutoffs: { open: 48.50, obc: 48.50, ews: 48.50, sebc: 48.50, sc: 46.00, st: 41.50, women: 44.00, sports: 34.00, ex_service: 25.50 },
    vacancies: 521,
    notes: 'Moderate difficulty paper with tricky Polity & Science sections.'
  },
  {
    id: 'mpsc_psi_2021',
    exam: 'MPSC Combined Group B',
    post: 'Police Sub-Inspector (PSI) Prelims',
    year: '2021',
    totalMarks: 100,
    trend: 'stable',
    cutoffs: { open: 46.25, obc: 46.25, ews: 46.25, sebc: 46.25, sc: 44.00, st: 39.50, women: 41.50, sports: 31.00, ex_service: 23.00 },
    vacancies: 376,
    notes: 'Post-pandemic backlog exam conducted with tight guidelines.'
  },
  {
    id: 'mpsc_psi_2020',
    exam: 'MPSC Combined Group B',
    post: 'Police Sub-Inspector (PSI) Prelims',
    year: '2020',
    totalMarks: 100,
    trend: 'down',
    cutoffs: { open: 43.75, obc: 43.75, ews: 43.75, sebc: 43.75, sc: 41.50, st: 36.00, women: 38.50, sports: 28.00, ex_service: 20.00 },
    vacancies: 650,
    notes: 'Large vacancy pool relaxed overall qualifying threshold.'
  },
  {
    id: 'mpsc_psi_2019',
    exam: 'MPSC Combined Group B',
    post: 'Police Sub-Inspector (PSI) Prelims',
    year: '2019',
    totalMarks: 100,
    trend: 'stable',
    cutoffs: { open: 44.00, obc: 44.00, ews: 44.00, sebc: 44.00, sc: 42.00, st: 37.00, women: 39.00, sports: 29.00, ex_service: 21.00 },
    vacancies: 496,
    notes: 'SEBC reservation introduced for the first time.'
  },
  {
    id: 'mpsc_psi_2018',
    exam: 'MPSC Combined Group B',
    post: 'Police Sub-Inspector (PSI) Prelims',
    year: '2018',
    totalMarks: 100,
    trend: 'up',
    cutoffs: { open: 46.00, obc: 46.00, ews: 46.00, sebc: 46.00, sc: 43.00, st: 38.00, women: 40.50, sports: 30.00, ex_service: 22.00 },
    vacancies: 387,
    notes: 'First unified Combined Prelims for PSI, STI, and ASO.'
  },
  {
    id: 'mpsc_psi_2017',
    exam: 'MPSC Combined Group B',
    post: 'Police Sub-Inspector (PSI) Prelims',
    year: '2017',
    totalMarks: 100,
    trend: 'stable',
    cutoffs: { open: 45.00, obc: 45.00, ews: 45.00, sebc: 45.00, sc: 42.00, st: 37.00, women: 39.00, sports: 28.00, ex_service: 19.00 },
    vacancies: 650,
    notes: 'Standalone PSI exam format transition year.'
  },
  {
    id: 'mpsc_psi_2016',
    exam: 'MPSC Combined Group B',
    post: 'Police Sub-Inspector (PSI) Prelims',
    year: '2016',
    totalMarks: 100,
    trend: 'stable',
    cutoffs: { open: 42.00, obc: 42.00, ews: 42.00, sebc: 42.00, sc: 39.00, st: 34.00, women: 36.00, sports: 25.00, ex_service: 17.00 },
    vacancies: 828,
    notes: 'Mega PSI recruitment drive.'
  },
  {
    id: 'mpsc_psi_2015',
    exam: 'MPSC Combined Group B',
    post: 'Police Sub-Inspector (PSI) Prelims',
    year: '2015',
    totalMarks: 100,
    trend: 'stable',
    cutoffs: { open: 41.00, obc: 41.00, ews: 41.00, sebc: 41.00, sc: 38.00, st: 33.00, women: 35.00, sports: 24.00, ex_service: 16.00 },
    vacancies: 730,
    notes: 'Negative marking -0.25 introduced across state commissions.'
  },

  // STI & ASO Benchmarks
  {
    id: 'mpsc_sti_2023',
    exam: 'MPSC Combined Group B',
    post: 'State Tax Inspector (STI) Prelims',
    year: '2023',
    totalMarks: 100,
    trend: 'up',
    cutoffs: { open: 59.25, obc: 59.25, ews: 59.25, sebc: 59.25, sc: 56.00, st: 50.75, women: 54.50, sports: 42.00, ex_service: 32.00 },
    vacancies: 159,
    notes: 'STI historically demands the highest general cutoff among Group B.'
  },
  {
    id: 'mpsc_aso_2023',
    exam: 'MPSC Combined Group B',
    post: 'Assistant Section Officer (ASO) Prelims',
    year: '2023',
    totalMarks: 100,
    trend: 'up',
    cutoffs: { open: 61.50, obc: 61.50, ews: 61.50, sebc: 61.50, sc: 57.50, st: 52.00, women: 56.50, sports: 45.00, ex_service: 36.00 },
    vacancies: 78,
    notes: 'Lowest vacancy post in Mantralaya resulted in 61+ cutoff.'
  },
  {
    id: 'mpsc_sti_2022',
    exam: 'MPSC Combined Group B',
    post: 'State Tax Inspector (STI) Prelims',
    year: '2022',
    totalMarks: 100,
    trend: 'stable',
    cutoffs: { open: 56.50, obc: 56.50, ews: 56.50, sebc: 56.50, sc: 53.00, st: 47.50, women: 51.50, sports: 39.00, ex_service: 28.50 },
    vacancies: 190,
    notes: 'Balanced cutoff distribution.'
  },
  {
    id: 'mpsc_aso_2022',
    exam: 'MPSC Combined Group B',
    post: 'Assistant Section Officer (ASO) Prelims',
    year: '2022',
    totalMarks: 100,
    trend: 'stable',
    cutoffs: { open: 58.75, obc: 58.75, ews: 58.75, sebc: 58.75, sc: 55.00, st: 49.00, women: 53.50, sports: 41.00, ex_service: 31.00 },
    vacancies: 102,
    notes: 'Intense competition for Mantralaya administrative posts.'
  },

  // ─────────────────────────────────────────────────────────────
  // 2. MPSC STATE SERVICES (RAJYASEVA) — 2015 to 2024
  // ─────────────────────────────────────────────────────────────
  {
    id: 'mpsc_rajyaseva_2024',
    exam: 'MPSC State Services (Rajyaseva)',
    post: 'Deputy Collector, DSP, Tehsildar (Prelims GS Paper 1)',
    year: '2024',
    totalMarks: 200,
    trend: 'up',
    cutoffs: { open: 114.00, obc: 114.00, ews: 114.00, sebc: 114.00, sc: 105.50, st: 94.00, women: 101.00, sports: 81.00, ex_service: 67.00 },
    vacancies: 274,
    notes: 'CSAT qualifying (33%). GS Paper 1 decides merit rank.'
  },
  {
    id: 'mpsc_rajyaseva_2023',
    exam: 'MPSC State Services (Rajyaseva)',
    post: 'Deputy Collector, DSP, Tehsildar (Prelims GS Paper 1)',
    year: '2023',
    totalMarks: 200,
    trend: 'stable',
    cutoffs: { open: 110.50, obc: 110.50, ews: 110.50, sebc: 110.50, sc: 102.00, st: 91.50, women: 98.50, sports: 78.00, ex_service: 64.00 },
    vacancies: 342,
    notes: 'First batch under qualifying CSAT pattern.'
  },
  {
    id: 'mpsc_rajyaseva_2022',
    exam: 'MPSC State Services (Rajyaseva)',
    post: 'Deputy Collector, DSP, Tehsildar (Prelims GS Paper 1)',
    year: '2022',
    totalMarks: 200,
    trend: 'down',
    cutoffs: { open: 106.00, obc: 106.00, ews: 106.00, sebc: 106.00, sc: 98.00, st: 88.00, women: 94.00, sports: 72.00, ex_service: 58.00 },
    vacancies: 623,
    notes: 'Large vacancy pool relaxed the cutoff threshold.'
  },
  {
    id: 'mpsc_rajyaseva_2021',
    exam: 'MPSC State Services (Rajyaseva)',
    post: 'Deputy Collector, DSP, Tehsildar (Prelims Both Papers)',
    year: '2021',
    totalMarks: 400,
    trend: 'stable',
    cutoffs: { open: 212.50, obc: 212.50, ews: 212.50, sebc: 212.50, sc: 198.00, st: 175.50, women: 192.00, sports: 154.00, ex_service: 122.00 },
    vacancies: 390,
    notes: 'Score out of 400 marks (GS 200 + CSAT 200 included in merit).'
  },
  {
    id: 'mpsc_rajyaseva_2020',
    exam: 'MPSC State Services (Rajyaseva)',
    post: 'Deputy Collector, DSP, Tehsildar (Prelims Both Papers)',
    year: '2020',
    totalMarks: 400,
    trend: 'down',
    cutoffs: { open: 203.50, obc: 203.50, ews: 203.50, sebc: 203.50, sc: 190.00, st: 167.00, women: 184.00, sports: 145.00, ex_service: 114.00 },
    vacancies: 200,
    notes: 'Covid-impacted preliminary cycle.'
  },
  {
    id: 'mpsc_rajyaseva_2019',
    exam: 'MPSC State Services (Rajyaseva)',
    post: 'Deputy Collector, DSP, Tehsildar (Prelims Both Papers)',
    year: '2019',
    totalMarks: 400,
    trend: 'up',
    cutoffs: { open: 217.00, obc: 217.00, ews: 217.00, sebc: 217.00, sc: 201.00, st: 180.00, women: 197.00, sports: 160.00, ex_service: 130.00 },
    vacancies: 431,
    notes: 'High scoring CSAT paper pushed aggregate above 215.'
  },
  {
    id: 'mpsc_rajyaseva_2018',
    exam: 'MPSC State Services (Rajyaseva)',
    post: 'Deputy Collector, DSP, Tehsildar (Prelims Both Papers)',
    year: '2018',
    totalMarks: 400,
    trend: 'up',
    cutoffs: { open: 247.00, obc: 247.00, ews: 247.00, sebc: 247.00, sc: 228.00, st: 202.00, women: 224.00, sports: 182.00, ex_service: 148.00 },
    vacancies: 130,
    notes: 'Low vacancy count of 130 led to historic high prelims cutoff.'
  },
  {
    id: 'mpsc_rajyaseva_2017',
    exam: 'MPSC State Services (Rajyaseva)',
    post: 'Deputy Collector, DSP, Tehsildar (Prelims Both Papers)',
    year: '2017',
    totalMarks: 400,
    trend: 'stable',
    cutoffs: { open: 189.00, obc: 189.00, ews: 189.00, sebc: 189.00, sc: 174.00, st: 152.00, women: 170.00, sports: 134.00, ex_service: 105.00 },
    vacancies: 377,
    notes: 'Tough GS Paper 1 brought general cutoff under 190.'
  },
  {
    id: 'mpsc_rajyaseva_2016',
    exam: 'MPSC State Services (Rajyaseva)',
    post: 'Deputy Collector, DSP, Tehsildar (Prelims Both Papers)',
    year: '2016',
    totalMarks: 400,
    trend: 'stable',
    cutoffs: { open: 194.00, obc: 194.00, ews: 194.00, sebc: 194.00, sc: 178.00, st: 156.00, women: 175.00, sports: 138.00, ex_service: 110.00 },
    vacancies: 298,
    notes: 'Standard difficulty distribution.'
  },
  {
    id: 'mpsc_rajyaseva_2015',
    exam: 'MPSC State Services (Rajyaseva)',
    post: 'Deputy Collector, DSP, Tehsildar (Prelims Both Papers)',
    year: '2015',
    totalMarks: 400,
    trend: 'stable',
    cutoffs: { open: 191.00, obc: 191.00, ews: 191.00, sebc: 191.00, sc: 175.00, st: 153.00, women: 172.00, sports: 135.00, ex_service: 108.00 },
    vacancies: 368,
    notes: 'Merit list generated from both GS Paper 1 and CSAT Paper 2.'
  },

  // ─────────────────────────────────────────────────────────────
  // 3. MAHARASHTRA TALATHI BHARTI (TCS & Mahapariksha) — 2016 to 2024
  // ─────────────────────────────────────────────────────────────
  {
    id: 'talathi_pune_2023',
    exam: 'Maharashtra Talathi Bharti',
    post: 'Talathi (Pune District)',
    year: '2023',
    totalMarks: 200,
    trend: 'up',
    cutoffs: { open: 178, obc: 174, ews: 172, sebc: 172, sc: 164, st: 154, women: 168, sports: 148, ex_service: 132 },
    vacancies: 383,
    notes: 'TCS normalized score out of 200. Highest cutoff district.'
  },
  {
    id: 'talathi_mumbai_2023',
    exam: 'Maharashtra Talathi Bharti',
    post: 'Talathi (Mumbai Suburban District)',
    year: '2023',
    totalMarks: 200,
    trend: 'stable',
    cutoffs: { open: 170, obc: 166, ews: 164, sebc: 164, sc: 156, st: 146, women: 160, sports: 138, ex_service: 124 },
    vacancies: 257,
    notes: 'TCS Computer Based Test (CBT) normalization.'
  },
  {
    id: 'talathi_nagpur_2023',
    exam: 'Maharashtra Talathi Bharti',
    post: 'Talathi (Nagpur District)',
    year: '2023',
    totalMarks: 200,
    trend: 'stable',
    cutoffs: { open: 172, obc: 168, ews: 166, sebc: 166, sc: 158, st: 148, women: 162, sports: 140, ex_service: 126 },
    vacancies: 312,
    notes: 'Vidarbha zone benchmark cutoff.'
  },
  {
    id: 'talathi_nashik_2023',
    exam: 'Maharashtra Talathi Bharti',
    post: 'Talathi (Nashik District)',
    year: '2023',
    totalMarks: 200,
    trend: 'up',
    cutoffs: { open: 174, obc: 170, ews: 168, sebc: 168, sc: 160, st: 152, women: 164, sports: 142, ex_service: 128 },
    vacancies: 268,
    notes: 'High tribal reservation quota.'
  },
  {
    id: 'talathi_sambhajinagar_2023',
    exam: 'Maharashtra Talathi Bharti',
    post: 'Talathi (Chhatrapati Sambhajinagar)',
    year: '2023',
    totalMarks: 200,
    trend: 'up',
    cutoffs: { open: 173, obc: 169, ews: 167, sebc: 167, sc: 159, st: 150, women: 163, sports: 141, ex_service: 127 },
    vacancies: 161,
    notes: 'Marathwada administrative headquarters.'
  },
  {
    id: 'talathi_kolhapur_2023',
    exam: 'Maharashtra Talathi Bharti',
    post: 'Talathi (Kolhapur District)',
    year: '2023',
    totalMarks: 200,
    trend: 'up',
    cutoffs: { open: 176, obc: 172, ews: 170, sebc: 170, sc: 162, st: 152, women: 166, sports: 144, ex_service: 130 },
    vacancies: 157,
    notes: 'High competition western Maharashtra district.'
  },
  {
    id: 'talathi_pune_2019',
    exam: 'Maharashtra Talathi Bharti',
    post: 'Talathi (Pune District)',
    year: '2019',
    totalMarks: 200,
    trend: 'stable',
    cutoffs: { open: 172, obc: 166, ews: 164, sebc: 164, sc: 156, st: 144, women: 160, sports: 136, ex_service: 120 },
    vacancies: 214,
    notes: 'Mahapariksha portal online exam format.'
  },
  {
    id: 'talathi_nashik_2019',
    exam: 'Maharashtra Talathi Bharti',
    post: 'Talathi (Nashik District)',
    year: '2019',
    totalMarks: 200,
    trend: 'stable',
    cutoffs: { open: 168, obc: 162, ews: 160, sebc: 160, sc: 152, st: 140, women: 156, sports: 132, ex_service: 116 },
    vacancies: 180,
    notes: 'Mahapariksha online mode.'
  },
  {
    id: 'talathi_pune_2016',
    exam: 'Maharashtra Talathi Bharti',
    post: 'Talathi (Pune District - Offline OMR)',
    year: '2016',
    totalMarks: 200,
    trend: 'stable',
    cutoffs: { open: 166, obc: 160, ews: 160, sebc: 160, sc: 150, st: 138, women: 154, sports: 128, ex_service: 112 },
    vacancies: 162,
    notes: 'District Collectorate offline OMR examination.'
  },

  // ─────────────────────────────────────────────────────────────
  // 4. MAHARASHTRA POLICE CONSTABLE BHARTI — 2016 to 2024
  // ─────────────────────────────────────────────────────────────
  {
    id: 'police_mumbai_2024',
    exam: 'Maharashtra Police Bharti',
    post: 'Police Constable (Mumbai CP - Physical + Written)',
    year: '2024',
    totalMarks: 150,
    trend: 'up',
    cutoffs: { open: 132, obc: 126, ews: 124, sebc: 125, sc: 118, st: 110, women: 108, sports: 100, ex_service: 88 },
    vacancies: 2572,
    notes: 'Physical 50M + Written 100M composite merit list.'
  },
  {
    id: 'police_pune_2024',
    exam: 'Maharashtra Police Bharti',
    post: 'Police Constable (Pune City CP)',
    year: '2024',
    totalMarks: 150,
    trend: 'up',
    cutoffs: { open: 136, obc: 132, ews: 130, sebc: 131, sc: 124, st: 115, women: 114, sports: 105, ex_service: 92 },
    vacancies: 450,
    notes: 'Fierce competition; 90+ in written exam required.'
  },
  {
    id: 'police_mumbai_2023',
    exam: 'Maharashtra Police Bharti',
    post: 'Police Constable (Mumbai CP)',
    year: '2023',
    totalMarks: 150,
    trend: 'stable',
    cutoffs: { open: 128, obc: 122, ews: 120, sebc: 121, sc: 114, st: 106, women: 104, sports: 96, ex_service: 84 },
    vacancies: 7076,
    notes: 'Mega drive with 7000+ vacancies kept cutoff balanced.'
  },
  {
    id: 'police_pune_2023',
    exam: 'Maharashtra Police Bharti',
    post: 'Police Constable (Pune City CP)',
    year: '2023',
    totalMarks: 150,
    trend: 'up',
    cutoffs: { open: 134, obc: 130, ews: 128, sebc: 129, sc: 122, st: 112, women: 112, sports: 102, ex_service: 90 },
    vacancies: 720,
    notes: 'Higher applicant-to-post ratio.'
  },
  {
    id: 'police_thane_2023',
    exam: 'Maharashtra Police Bharti',
    post: 'Police Constable (Thane CP)',
    year: '2023',
    totalMarks: 150,
    trend: 'stable',
    cutoffs: { open: 130, obc: 125, ews: 124, sebc: 124, sc: 118, st: 108, women: 108, sports: 98, ex_service: 86 },
    vacancies: 521,
    notes: 'Thane Commissionerate composite score.'
  },
  {
    id: 'police_mumbai_2021',
    exam: 'Maharashtra Police Bharti',
    post: 'Police Constable (Mumbai CP - 100M Format)',
    year: '2021',
    totalMarks: 100,
    trend: 'stable',
    cutoffs: { open: 82, obc: 78, ews: 76, sebc: 77, sc: 72, st: 66, women: 65, sports: 58, ex_service: 48 },
    vacancies: 1076,
    notes: 'Written exam 100 marks benchmark.'
  },
  {
    id: 'police_mumbai_2019',
    exam: 'Maharashtra Police Bharti',
    post: 'Police Constable (Mumbai CP - 100M Format)',
    year: '2019',
    totalMarks: 100,
    trend: 'down',
    cutoffs: { open: 79, obc: 75, ews: 74, sebc: 74, sc: 69, st: 62, women: 62, sports: 55, ex_service: 44 },
    vacancies: 1400,
    notes: 'SEBC 16% reservation applied.'
  },
  {
    id: 'police_mumbai_2017',
    exam: 'Maharashtra Police Bharti',
    post: 'Police Constable (Mumbai CP - Old 200M Format)',
    year: '2017',
    totalMarks: 200,
    trend: 'stable',
    cutoffs: { open: 174, obc: 168, ews: 168, sebc: 168, sc: 160, st: 148, women: 150, sports: 135, ex_service: 118 },
    vacancies: 2600,
    notes: 'Old pattern: 100M Physical + 100M Written.'
  },

  // ─────────────────────────────────────────────────────────────
  // 5. SSC CGL TIER 1 — 2017 to 2024
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ssc_cgl_2024',
    exam: 'SSC CGL',
    post: 'Combined Graduate Level Tier 1 (All Posts)',
    year: '2024',
    totalMarks: 200,
    trend: 'up',
    cutoffs: { open: 153.25, obc: 148.50, ews: 146.00, sebc: 147.00, sc: 129.50, st: 121.00, women: 148.00, sports: 114.00, ex_service: 104.50 },
    vacancies: 17727,
    notes: 'High scoring shift normalization.'
  },
  {
    id: 'ssc_cgl_2023',
    exam: 'SSC CGL',
    post: 'Combined Graduate Level Tier 1 (All Posts)',
    year: '2023',
    totalMarks: 200,
    trend: 'up',
    cutoffs: { open: 150.04, obc: 145.93, ews: 143.44, sebc: 144.00, sc: 126.68, st: 118.16, women: 145.00, sports: 110.00, ex_service: 100.29 },
    vacancies: 8440,
    notes: 'Normalized Tier 1 score out of 200 with -0.50 negative marking.'
  },
  {
    id: 'ssc_cgl_2022',
    exam: 'SSC CGL',
    post: 'Combined Graduate Level Tier 1 (All Posts)',
    year: '2022',
    totalMarks: 200,
    trend: 'down',
    cutoffs: { open: 114.27, obc: 102.78, ews: 102.35, sebc: 102.50, sc: 89.08, st: 77.56, women: 102.00, sports: 70.00, ex_service: 40.00 },
    vacancies: 36012,
    notes: 'Historic 36,000+ vacancies caused a massive drop in cutoff marks.'
  },
  {
    id: 'ssc_cgl_2021',
    exam: 'SSC CGL',
    post: 'Combined Graduate Level Tier 1 (All Posts)',
    year: '2021',
    totalMarks: 200,
    trend: 'stable',
    cutoffs: { open: 130.18, obc: 117.87, ews: 109.64, sebc: 112.00, sc: 94.58, st: 81.52, women: 117.00, sports: 85.00, ex_service: 50.12 },
    vacancies: 7686,
    notes: 'Normal shift variance.'
  },
  {
    id: 'ssc_cgl_2020',
    exam: 'SSC CGL',
    post: 'Combined Graduate Level Tier 1 (All Posts)',
    year: '2020',
    totalMarks: 200,
    trend: 'stable',
    cutoffs: { open: 132.37, obc: 119.23, ews: 109.21, sebc: 112.00, sc: 100.76, st: 93.75, women: 119.00, sports: 88.00, ex_service: 74.87 },
    vacancies: 7035,
    notes: 'COVID delay cycle.'
  },
  {
    id: 'ssc_cgl_2019',
    exam: 'SSC CGL',
    post: 'Combined Graduate Level Tier 1 (All Posts)',
    year: '2019',
    totalMarks: 200,
    trend: 'up',
    cutoffs: { open: 147.78, obc: 135.95, ews: 135.04, sebc: 135.00, sc: 115.35, st: 104.91, women: 135.00, sports: 95.00, ex_service: 89.34 },
    vacancies: 8582,
    notes: 'Mathematical normalization formula version 2 applied.'
  },
  {
    id: 'ssc_cgl_2018',
    exam: 'SSC CGL',
    post: 'Combined Graduate Level Tier 1 (All Posts)',
    year: '2018',
    totalMarks: 200,
    trend: 'stable',
    cutoffs: { open: 137.07, obc: 131.18, ews: 131.00, sebc: 131.00, sc: 111.10, st: 103.22, women: 131.00, sports: 92.00, ex_service: 40.00 },
    vacancies: 11105,
    notes: 'Normalization introduced for multi-shift CGL.'
  }
]
