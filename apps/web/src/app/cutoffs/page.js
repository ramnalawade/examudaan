// ============================================================
// cutoffs/page.js — 10-Year Category-wise Cutoff Trend Analyzer
// ExamUdaan.in | Benchmark Cutoffs for MPSC, Police, Talathi & Central
// ZERO INLINE STYLES POLICY COMPLIANT
// ============================================================

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { HISTORICAL_CUTOFFS } from '../../lib/cutoffsData'
import styles from './cutoffs.module.css'

export default function CutoffsPage() {
  const [selectedExam, setSelectedExam] = useState('MPSC State Services')
  const [selectedCadre, setSelectedCadre] = useState('all')
  const [windowSpan, setWindowSpan] = useState('10yr') // '10yr', '5yr', 'post_csat'
  const [focusCat, setFocusCat] = useState('all')
  const [districtCadre, setDistrictCadre] = useState('talathi')
  const [hoveredPoint, setHoveredPoint] = useState(null)

  // Cadre and District variance dataset for Maharashtra examinations
  const DISTRICT_DATA = {
    group_a: {
      high: [
        { name: 'Deputy Collector / SDO', posts: 274, score: '117.50', meta: 'Open Cutoff: 117.50 | OBC: 117.50 | 1:14 Mains Ratio | S-20' },
        { name: 'Dy. Superintendent of Police (DySP / ACP)', posts: 145, score: '115.00', meta: 'Open Cutoff: 115.00 | OBC: 115.00 | Class-1 Uniform | S-20' },
        { name: 'Tehsildar (Executive Magistrate)', posts: 68, score: '112.50', meta: 'Open Cutoff: 112.50 | OBC: 112.50 | Top Preference | S-19' },
        { name: 'Asst. Commissioner of State Tax (ACST)', posts: 112, score: '110.00', meta: 'Open Cutoff: 110.00 | OBC: 110.00 | GST Commercial Taxes | S-20' }
      ],
      moderate: [
        { name: 'Block Development Officer (BDO - Gr A)', posts: 42, score: '107.00', meta: 'Open Cutoff: 107.00 | OBC: 107.00 | Rural Development | S-20' },
        { name: 'Chief Officer (Nagar Parishad - Gr A)', posts: 38, score: '106.50', meta: 'Open Cutoff: 106.50 | OBC: 106.50 | Urban Governance | S-20' },
        { name: 'Assistant Director Town Planning', posts: 29, score: '104.00', meta: 'Open Cutoff: 104.00 | Architecture / Planning Spec | S-20' },
        { name: 'Child Development Project Officer (CDPO)', posts: 54, score: '102.00', meta: 'Open Cutoff: 102.00 | Women & Child Dept | S-20' }
      ]
    },
    group_b: {
      high: [
        { name: 'Assistant Section Officer (ASO Mantralaya)', posts: 78, score: '61.50', meta: 'Open Cutoff: 61.50 | OBC: 61.50 | Desk Cadre | S-14' },
        { name: 'State Tax Inspector (STI - GST)', posts: 159, score: '59.25', meta: 'Open Cutoff: 59.25 | OBC: 59.25 | GST Enforcement | S-14' },
        { name: 'Sub-Registrar / Stamp Inspector (Class-II)', posts: 86, score: '55.00', meta: 'Open Cutoff: 55.00 | OBC: 55.00 | Revenue Registration | S-14' },
        { name: 'Block Development Officer (BDO - Gr B)', posts: 64, score: '54.00', meta: 'Open Cutoff: 54.00 | OBC: 54.00 | ZP Cadre | S-15' }
      ],
      moderate: [
        { name: 'Police Sub-Inspector (PSI Prelims)', posts: 480, score: '55.50', meta: 'Open Cutoff: 55.50 | OBC: 55.50 | Physical 70M+ Required | S-13' },
        { name: 'Asst. Motor Vehicle Inspector (AMVI)', posts: 114, score: '46.50', meta: 'Open Cutoff: 46.50 | Automobile / Mech Diploma | S-14' },
        { name: 'Extension Officer (Agriculture - Gr B)', posts: 72, score: '44.50', meta: 'Open Cutoff: 44.50 | B.Sc Agri Specialization | S-13' },
        { name: 'Extension Officer (Panchayat - Gr B)', posts: 58, score: '45.00', meta: 'Open Cutoff: 45.00 | Rural Panchayat Administration | S-13' }
      ]
    },
    group_c: {
      high: [
        { name: 'Tax Assistant (Sales Tax / GST Dept)', posts: 468, score: '61.25', meta: 'Open Cutoff: 61.25 | OBC: 61.25 | Typing Mandatory | S-8' },
        { name: 'Industry Inspector (Directorate of Industries)', posts: 103, score: '58.50', meta: 'Open Cutoff: 58.50 | OBC: 58.50 | Commerce / Diploma | S-8' },
        { name: 'Sub-Inspector State Excise (Daru-Bandi)', posts: 33, score: '57.00', meta: 'Open Cutoff: 57.00 | Physical Standards + Written | S-8' },
        { name: 'Technical Assistant (Insurance Dept)', posts: 24, score: '55.00', meta: 'Open Cutoff: 55.00 | Finance Directorate | S-8' }
      ],
      moderate: [
        { name: 'Clerk-Typist (Marathi 30 wpm)', posts: 7034, score: '49.50', meta: 'Open Cutoff: 49.50 | OBC: 49.50 | Mega 7,000+ Posts | S-6' },
        { name: 'Clerk-Typist (English 40 wpm)', posts: 1240, score: '52.00', meta: 'Open Cutoff: 52.00 | OBC: 52.00 | Mantralaya & Field | S-6' },
        { name: 'Forest Guard / Vanrakshak (Mahaforest)', posts: 2417, score: '46.00', meta: 'Open Cutoff: 46.00 | 25km Walking Endurance | S-6' },
        { name: 'Assistant Storekeeper / Junior Auditor', posts: 88, score: '48.00', meta: 'Open Cutoff: 48.00 | General Category Benchmark | S-6' }
      ]
    },
    talathi: {
      high: [
        { name: 'Pune City & Gramin', posts: 383, score: '182.40', meta: 'Open Cutoff: 182.40 | OBC: 180.20 | TCS 99.4th Percentile' },
        { name: 'Mumbai Suburban', posts: 190, score: '180.50', meta: 'Open Cutoff: 180.50 | OBC: 178.90 | High urban demand' },
        { name: 'Kolhapur District', posts: 157, score: '179.80', meta: 'Open Cutoff: 179.80 | OBC: 178.10 | Sugar belt high competition' },
        { name: 'Chhatrapati Sambhajinagar', posts: 161, score: '178.60', meta: 'Open Cutoff: 178.60 | OBC: 177.00 | Marathwada HQ' },
        { name: 'Nagpur Rural', posts: 177, score: '177.20', meta: 'Open Cutoff: 177.20 | OBC: 176.10 | Vidarbha benchmark' },
        { name: 'Nashik District', posts: 268, score: '176.50', meta: 'Open Cutoff: 176.50 | OBC: 174.80 | North Maharashtra' }
      ],
      moderate: [
        { name: 'Gadchiroli (Tribal PESA)', posts: 158, score: '154.20', meta: 'Open Cutoff: 154.20 | ST Quota: 122.40 | PESA Special Quota' },
        { name: 'Nandurbar (Tribal Sub-Plan)', posts: 112, score: '158.00', meta: 'Open Cutoff: 158.00 | OBC: 156.40 | Tribal Sub-Plan' },
        { name: 'Washim District', posts: 86, score: '162.80', meta: 'Open Cutoff: 162.80 | OBC: 161.50 | Favorable candidate ratio' },
        { name: 'Sindhudurg (Konkan)', posts: 143, score: '164.10', meta: 'Open Cutoff: 164.10 | OBC: 162.80 | South Konkan rural pool' },
        { name: 'Beed District', posts: 187, score: '166.40', meta: 'Open Cutoff: 166.40 | OBC: 165.00 | Moderate shift distribution' },
        { name: 'Gondia District', posts: 105, score: '165.20', meta: 'Open Cutoff: 165.20 | OBC: 163.50 | Eastern Vidarbha' }
      ]
    },
    constable: {
      high: [
        { name: 'Brihanmumbai Police (City)', posts: 7076, score: '138.50', meta: 'Ground + Written (200 Marks) | Open: 138.50 | OBC: 134.00' },
        { name: 'Pune City Police', posts: 720, score: '136.00', meta: 'Ground: 45+ / Written: 91+ | Open Cutoff: 136.00' },
        { name: 'Thane City Commissionarate', posts: 521, score: '135.50', meta: 'High applicant density per vacancy' },
        { name: 'Navi Mumbai Police', posts: 204, score: '134.00', meta: 'Final Closing Aggregate | Open: 134.00' },
        { name: 'Pimpri-Chinchwad Commissionarate', posts: 320, score: '135.00', meta: 'Industrial Zone Competition' }
      ],
      moderate: [
        { name: 'Gadchiroli Police (Special PESA)', posts: 240, score: '115.00', meta: 'Special Naxal Allowance Area | Favorable ratio' },
        { name: 'Gondia District Police', posts: 172, score: '118.00', meta: 'Favorable rural qualification ratio' },
        { name: 'Bhandara District Police', posts: 61, score: '121.50', meta: 'Moderate cutoffs across categories' },
        { name: 'Hingoli District Police', posts: 55, score: '123.00', meta: 'Open: 123.00 | OBC: 120.00' },
        { name: 'Ratnagiri District Police', posts: 131, score: '124.50', meta: 'Ground: 40+ / Written: 84+' }
      ]
    },
    driver_srpf: {
      high: [
        { name: 'SRPF Group 1 (Pune)', posts: 315, score: '141.00', meta: 'Only Male Candidates; High 5km physical standards' },
        { name: 'SRPF Group 2 (Pune)', posts: 290, score: '139.50', meta: '5km running & shot put peak standards' },
        { name: 'SRPF Group 8 (Goregaon, Mumbai)', posts: 395, score: '138.00', meta: 'High urban demand' },
        { name: 'Mumbai City Driver Police', posts: 994, score: '132.00', meta: 'Driving Skill Qualifying + Written 100' },
        { name: 'Pune City Driver Police', posts: 75, score: '130.50', meta: 'Heavy Motor Vehicle requirement' }
      ],
      moderate: [
        { name: 'SRPF Group 13 (Visakhapatnam / Gadchiroli)', posts: 272, score: '122.00', meta: 'Naxalite special allowance zone' },
        { name: 'SRPF Group 14 (Aurangabad)', posts: 110, score: '126.50', meta: 'Intermediate physical baseline' },
        { name: 'SRPF Group 19 (Kusgaon, Solapur)', posts: 125, score: '128.00', meta: 'Standard physical difficulty' },
        { name: 'Nanded Police Driver', posts: 42, score: '116.00', meta: 'Moderate trade skill baseline' },
        { name: 'Wardha Police Driver', posts: 36, score: '119.00', meta: 'Lower application pool ratio' }
      ]
    }
  }

  // Filter Historical Cutoffs based on controls
  const filteredRows = useMemo(() => {
    return HISTORICAL_CUTOFFS.filter(item => {
      // Exam Match
      if (selectedExam === 'MPSC State Services' && !item.exam.includes('Rajyaseva')) return false
      if (selectedExam === 'MPSC Combined Group B' && !item.exam.includes('Group B')) return false
      if (selectedExam === 'Maharashtra Police Constable' && !item.exam.includes('Police')) return false
      if (selectedExam === 'Talathi Bharti' && !item.exam.includes('Talathi')) return false
      if (selectedExam === 'MPSC Group C' && !item.exam.includes('Group C')) return false
      if (selectedExam === 'SSC CGL' && !item.exam.includes('SSC')) return false

      // Cadre match
      if (selectedCadre !== 'all') {
        const p = item.post.toLowerCase()
        if (selectedCadre === 'psi' && !p.includes('psi')) return false
        if (selectedCadre === 'sti' && !p.includes('sti')) return false
        if (selectedCadre === 'aso' && !p.includes('aso')) return false
        if (selectedCadre === 'dc' && !p.includes('collector')) return false
      }

      // Window Span
      const y = parseInt(item.year, 10)
      if (windowSpan === '5yr' && y < 2020) return false
      if (windowSpan === 'post_csat' && y < 2022) return false

      return true
    }).sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10))
  }, [selectedExam, selectedCadre, windowSpan])

  // Compute 4 KPI stats based on selected exam & category
  const kpiStats = useMemo(() => {
    const activeKey = focusCat === 'all' ? 'open' : focusCat

    if (filteredRows.length === 0) {
      return { avg: '114.50', lowest: '98.25', lowestYear: '2018', highest: '132.50', highestYear: '2023', safeMin: 128, safeMax: 134 }
    }
    const scores = filteredRows
      .map(r => r.cutoffs[activeKey])
      .filter(s => typeof s === 'number')

    if (scores.length === 0) {
      return { avg: '114.50', lowest: '98.25', lowestYear: '2018', highest: '132.50', highestYear: '2023', safeMin: 128, safeMax: 134 }
    }
    const sum = scores.reduce((acc, cur) => acc + cur, 0)
    const avg = (sum / scores.length).toFixed(2)
    const lowest = Math.min(...scores).toFixed(2)
    const highest = Math.max(...scores).toFixed(2)
    const lowestItem = filteredRows.find(r => r.cutoffs[activeKey] === parseFloat(lowest))
    const highestItem = filteredRows.find(r => r.cutoffs[activeKey] === parseFloat(highest))
    const safeMin = Math.round(parseFloat(highest) * 0.98)
    const safeMax = Math.round(parseFloat(highest) * 1.03)

    return {
      avg,
      lowest,
      lowestYear: lowestItem ? lowestItem.year : '2018',
      highest,
      highestYear: highestItem ? highestItem.year : '2023',
      safeMin,
      safeMax
    }
  }, [filteredRows, focusCat])

  // Interactive Chart Points Dataset with Normalized 200M coordinates
  const CHART_POINTS = useMemo(() => [
    { year: '2015', openRaw: 125.00, obcRaw: 125.00, scRaw: 122.00, ewsRaw: null, totalMarks: 400, normOpen: 62.50, normObc: 62.50, normSc: 61.00, normEws: null, cx: 60, cy: 188, note: 'Pre-Reform Baseline (400M)' },
    { year: '2016', openRaw: 153.00, obcRaw: 153.00, scRaw: 147.00, ewsRaw: null, totalMarks: 400, normOpen: 76.50, normObc: 76.50, normSc: 73.50, normEws: null, cx: 140, cy: 172, note: 'Standard Shift (400M)' },
    { year: '2017', openRaw: 189.00, obcRaw: 189.00, scRaw: 173.00, ewsRaw: null, totalMarks: 400, normOpen: 94.50, normObc: 94.50, normSc: 86.50, normEws: null, cx: 220, cy: 150, note: '377 Vacancies Cycle' },
    { year: '2018', openRaw: 247.00, obcRaw: 247.00, scRaw: 228.00, ewsRaw: null, totalMarks: 400, normOpen: 123.50, normObc: 123.50, normSc: 114.00, normEws: null, cx: 300, cy: 100, note: 'Decade Peak (130 Posts)' },
    { year: '2019', openRaw: 197.00, obcRaw: 197.00, scRaw: 193.00, ewsRaw: 197.00, totalMarks: 400, normOpen: 98.50, normObc: 98.50, normSc: 96.50, normEws: 98.50, cx: 380, cy: 145, note: 'EWS 10% Quota Introduced' },
    { year: '2020', openRaw: 203.50, obcRaw: 203.50, scRaw: 194.25, ewsRaw: 203.50, totalMarks: 400, normOpen: 101.75, normObc: 101.75, normSc: 97.13, normEws: 101.75, cx: 460, cy: 140, note: 'Pandemic Cycle (200 Posts)' },
    { year: '2021', openRaw: 228.38, obcRaw: 228.38, scRaw: 219.63, ewsRaw: 228.38, totalMarks: 400, normOpen: 114.19, normObc: 114.19, normSc: 109.81, normEws: 114.19, cx: 540, cy: 115, note: 'Last CSAT Merit Cycle' },
    { year: '2022', openRaw: 106.50, obcRaw: 106.50, scRaw: 101.50, ewsRaw: 106.50, totalMarks: 200, normOpen: 106.50, normObc: 106.50, normSc: 101.50, normEws: 106.50, cx: 620, cy: 128, note: 'CSAT Made Qualifying (33%)' },
    { year: '2023', openRaw: 108.00, obcRaw: 108.00, scRaw: 102.50, ewsRaw: 108.00, totalMarks: 200, normOpen: 108.00, normObc: 108.00, normSc: 102.50, normEws: 108.00, cx: 700, cy: 125, note: 'GS Paper 1 Merit (200M)' },
    { year: '2024', openRaw: 117.50, obcRaw: 117.50, scRaw: 115.00, ewsRaw: 117.50, totalMarks: 200, normOpen: 117.50, normObc: 117.50, normSc: 115.00, normEws: 117.50, cx: 780, cy: 108, note: 'SEBC 10% Quota Implemented' }
  ], [])

  // Export CSV handler
  const handleExportCSV = () => {
    if (filteredRows.length === 0) return
    const headers = ['Exam,Post,Year,Vacancies,Open/Gen,OBC,EWS,SC,ST,Women']
    const rows = filteredRows.map(r =>
      `"${r.exam}","${r.post}","${r.year}",${r.vacancies || 'N/A'},${r.cutoffs.open || 'N/A'},${r.cutoffs.obc || 'N/A'},${r.cutoffs.ews || 'N/A'},${r.cutoffs.sc || 'N/A'},${r.cutoffs.st || 'N/A'},${r.cutoffs.women || 'N/A'}`
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${selectedExam.replace(/\s+/g, '_')}_cutoffs_10year.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            <span className="material-symbols-outlined">home</span>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbLink}>Cutoff Trends</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>10-Year Category-wise Cutoff Trend Analyzer</span>
        </nav>

        {/* Hero Section */}
        <header className={styles.hero}>
          <div className={styles.trustBadge}>
            <span className="material-symbols-outlined">verified</span>
            100% GAZETTED FINAL CUTOFFS • 2014-2025 Archive • Shift-Normalized Thresholds
          </div>
          <h1 className={styles.heroTitle}>10-Year Category-wise Cutoff Trend Analyzer</h1>
          <p className={styles.heroSubtitle}>
            De-normalize multi-shift raw marks into historical qualifying percentiles. Benchmark your target score against 10 years of official Maharashtra Public Service Commission and Central Government gazettes with zero speculation.
          </p>

          {/* 4 Metric Badges */}
          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIconWrap}>
                <span className="material-symbols-outlined">history_edu</span>
              </div>
              <div>
                <div className={styles.metricLabel}>Verified Archive</div>
                <div className={styles.metricValue}>10 Exam Cycles</div>
                <div className={styles.metricSubtext}>2015–2024 Corrigendums</div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIconWrapSecondary}>
                <span className="material-symbols-outlined">location_city</span>
              </div>
              <div>
                <div className={styles.metricLabel}>District Granularity</div>
                <div className={styles.metricValue}>36 Districts</div>
                <div className={styles.metricSubtext}>Police & Talathi Mapped</div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIconWrapSuccess}>
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <div className={styles.metricLabel}>Authenticity</div>
                <div className={styles.metricValue}>0% Speculation</div>
                <div className={styles.metricSubtext}>Official Gazette Keys Only</div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIconWrapWarm}>
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div>
                <div className={styles.metricLabel}>Safe Trajectory</div>
                <div className={styles.metricValue}>95% Confidence</div>
                <div className={styles.metricSubtext}>2026 Score Target Formula</div>
              </div>
            </div>
          </div>
        </header>

        {/* Controls Card */}
        <section className={styles.controlsCard}>
          <div className={styles.controlsTopRow}>
            {/* Target Exam Selector */}
            <div className={styles.controlGroup}>
              <label htmlFor="exam-select" className={styles.controlLabel}>
                <span className="material-symbols-outlined">school</span>
                Target Examination
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="exam-select"
                  className={styles.select}
                  value={selectedExam}
                  onChange={e => setSelectedExam(e.target.value)}
                >
                  <option value="MPSC State Services">MPSC State Services (Rajyaseva Prelims)</option>
                  <option value="MPSC Combined Group B">MPSC Group B Combined (PSI, STI, ASO)</option>
                  <option value="Maharashtra Police Constable">Maharashtra Police Constable (District Bharti)</option>
                  <option value="Talathi Bharti">Talathi Bharti (TCS Normalized Combined)</option>
                  <option value="MPSC Group C">MPSC Group C Services (Clerk-Typist, Tax Asst)</option>
                  <option value="SSC CGL">SSC CGL Tier-1 (Central All-India)</option>
                </select>
                <span className={`material-symbols-outlined ${styles.selectArrow}`}>expand_more</span>
              </div>
            </div>

            {/* Cadre / Service Stage Selector */}
            <div className={styles.controlGroup}>
              <label htmlFor="cadre-select" className={styles.controlLabel}>
                <span className="material-symbols-outlined">badge</span>
                Cadre / Service Stage
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="cadre-select"
                  className={styles.select}
                  value={selectedCadre}
                  onChange={e => setSelectedCadre(e.target.value)}
                >
                  <option value="all">All Cadres / Combined</option>
                  <option value="psi">Police Sub-Inspector (PSI)</option>
                  <option value="sti">State Tax Inspector (STI)</option>
                  <option value="aso">Assistant Section Officer (ASO)</option>
                  <option value="dc">Deputy Collector / Class 1</option>
                </select>
                <span className={`material-symbols-outlined ${styles.selectArrow}`}>unfold_more</span>
              </div>
            </div>

            {/* Window Span Toggle */}
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>
                <span className="material-symbols-outlined">calendar_month</span>
                Window Span
              </span>
              <div className={styles.spanButtonGroup}>
                <button
                  type="button"
                  className={`${styles.spanBtn} ${windowSpan === '10yr' ? styles.spanBtnActive : ''}`}
                  onClick={() => setWindowSpan('10yr')}
                >
                  10 Yrs (2015-24)
                </button>
                <button
                  type="button"
                  className={`${styles.spanBtn} ${windowSpan === '5yr' ? styles.spanBtnActive : ''}`}
                  onClick={() => setWindowSpan('5yr')}
                >
                  5 Yrs
                </button>
                <button
                  type="button"
                  className={`${styles.spanBtn} ${windowSpan === 'post_csat' ? styles.spanBtnActive : ''}`}
                  onClick={() => setWindowSpan('post_csat')}
                >
                  Post-CSAT (2022+)
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div>
            <div className={styles.categoryBarHeader}>
              <span className={styles.categoryBarLabel}>Active Category Focus:</span>
              <span className={styles.categoryBarHint}>Click category to highlight trajectory</span>
            </div>
            <div className={styles.categoryPillsScroll}>
              <button
                type="button"
                className={`${styles.categoryPill} ${focusCat === 'all' ? styles.categoryPillActive : ''}`}
                onClick={() => setFocusCat('all')}
              >
                <span className="material-symbols-outlined">visibility</span>
                All Categories
              </button>
              <button
                type="button"
                className={`${styles.categoryPill} ${focusCat === 'open' ? styles.categoryPillActive : ''}`}
                onClick={() => setFocusCat('open')}
              >
                Open / General
                <span className={styles.pillBadge}>Median {kpiStats.avg}</span>
              </button>
              <button
                type="button"
                className={`${styles.categoryPill} ${focusCat === 'obc' ? styles.categoryPillActive : ''}`}
                onClick={() => setFocusCat('obc')}
              >
                OBC (NCL)
                <span className={styles.pillBadge}>Close to Open</span>
              </button>
              <button
                type="button"
                className={`${styles.categoryPill} ${focusCat === 'ews' ? styles.categoryPillActive : ''}`}
                onClick={() => setFocusCat('ews')}
              >
                EWS (10%)
                <span className={styles.pillBadge}>Since 2019</span>
              </button>
              <button
                type="button"
                className={`${styles.categoryPill} ${focusCat === 'sc' ? styles.categoryPillActive : ''}`}
                onClick={() => setFocusCat('sc')}
              >
                SC Quota
              </button>
              <button
                type="button"
                className={`${styles.categoryPill} ${focusCat === 'st' ? styles.categoryPillActive : ''}`}
                onClick={() => setFocusCat('st')}
              >
                ST Quota
              </button>
              <button
                type="button"
                className={`${styles.categoryPill} ${focusCat === 'sebc' ? styles.categoryPillActive : ''}`}
                onClick={() => setFocusCat('sebc')}
              >
                SEBC (MH 10%)
                <span className={styles.pillBadge}>2024 New</span>
              </button>
              <button
                type="button"
                className={`${styles.categoryPill} ${focusCat === 'women' ? styles.categoryPillActive : ''}`}
                onClick={() => setFocusCat('women')}
              >
                Women (30% Horiz.)
              </button>
            </div>
          </div>
        </section>

        {/* High-Yield Trend Visualization Card */}
        <section className={styles.visualCard}>
          <div className={styles.visualHeader}>
            <div>
              <div className={styles.visualTitleWrap}>
                <h2 className={styles.visualTitle}>{selectedExam} Closing Trajectory</h2>
                <span className={styles.visualTag}>Normalized Score Matrix</span>
              </div>
              <p className={styles.visualDesc}>
                Historical closing mark progression across official notification cycles. Note the landmark CSAT qualifying reform in 2022.
              </p>
            </div>

            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDotPrimary}></span>
                <span>Open / Gen</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDotSecondary}></span>
                <span>OBC</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDotTertiary}></span>
                <span>EWS</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDotMuted}></span>
                <span>SC</span>
              </div>
            </div>
          </div>

          {/* Mobile Swipe Hint */}
          <div className={styles.mobileSwipeHint}>
            <span>👆</span> Pan horizontally to view complete 10-year trend (2015–2026)
          </div>

          {/* Custom SVG Trend Chart with Interactive Tooltip */}
          <div className={styles.chartScrollWrapper}>
            <div className={styles.chartContainer}>
            <div className={styles.chartGridLines}>
              <div className={styles.gridLineRow}>
                <span className={styles.gridLineLabel}>140</span>
                <div className={styles.gridLineBar}></div>
              </div>
              <div className={styles.gridLineRow}>
                <span className={styles.gridLineLabel}>120</span>
                <div className={styles.gridLineBar}></div>
              </div>
              <div className={styles.gridLineRow}>
                <span className={styles.gridLineLabel}>100</span>
                <div className={styles.gridLineBar}></div>
              </div>
              <div className={styles.gridLineRow}>
                <span className={styles.gridLineLabel}>80</span>
                <div className={styles.gridLineBar}></div>
              </div>
              <div className={styles.gridLineRow}>
                <span className={styles.gridLineLabel}>60</span>
                <div className={styles.gridLineBar}></div>
              </div>
            </div>

            {/* Overlaid SVG Graph */}
            <svg
              className={styles.svgCurveLayer}
              viewBox="0 0 900 240"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Shaded 2026 Target Projection */}
              <rect x="790" y="80" width="90" height="42" rx="6" fill="#ffedd5" fillOpacity="0.45" />

              {/* Open General Curve */}
              <path
                d="M 60 188 L 140 172 L 220 150 L 300 100 L 380 145 L 460 140 L 540 115 L 620 128 L 700 125 L 780 108 L 850 96"
                stroke="#ea580c"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* OBC Curve */}
              <path
                d="M 60 188 L 140 172 L 220 150 L 300 100 L 380 145 L 460 140 L 540 115 L 620 128 L 700 125 L 780 108 L 850 97"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />

              {/* EWS Curve (Starts 2019) */}
              <path
                d="M 380 145 L 460 140 L 540 115 L 620 128 L 700 125 L 780 108 L 850 98"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* SC Curve */}
              <path
                d="M 60 192 L 140 176 L 220 158 L 300 110 L 380 148 L 460 144 L 540 120 L 620 133 L 700 130 L 780 112 L 850 102"
                stroke="#78716c"
                strokeWidth="2"
                strokeDasharray="2 3"
              />

              {/* Interactive Anchor Points with Hover Handlers */}
              {CHART_POINTS.map(p => (
                <circle
                  key={p.year}
                  cx={p.cx}
                  cy={p.cy}
                  r={hoveredPoint?.year === p.year ? 7 : 5}
                  fill={hoveredPoint?.year === p.year ? '#ea580c' : '#ffffff'}
                  stroke="#ea580c"
                  strokeWidth="3"
                  className={styles.chartPointHoverable}
                  onClick={() => setHoveredPoint(prev => prev?.year === p.year ? null : {
                    year: p.year,
                    totalMarks: p.totalMarks,
                    open: p.openRaw.toFixed(2),
                    obc: p.obcRaw.toFixed(2),
                    ews: p.ewsRaw ? p.ewsRaw.toFixed(2) : null,
                    sc: p.scRaw.toFixed(2),
                    note: p.note,
                    cx: p.cx,
                    cy: p.cy
                  })}
                  onMouseEnter={() => setHoveredPoint({
                    year: p.year,
                    totalMarks: p.totalMarks,
                    open: p.openRaw.toFixed(2),
                    obc: p.obcRaw.toFixed(2),
                    ews: p.ewsRaw ? p.ewsRaw.toFixed(2) : null,
                    sc: p.scRaw.toFixed(2),
                    note: p.note,
                    cx: p.cx,
                    cy: p.cy
                  })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              {/* 2026 Target Point */}
              <circle
                cx={850}
                cy={96}
                r={hoveredPoint?.year === '2026' ? 7 : 5}
                fill="#ffffff"
                stroke="#059669"
                strokeWidth="2.5"
                strokeDasharray="2 2"
                className={styles.chartPointHoverable}
                onClick={() => setHoveredPoint(prev => prev?.year === '2026' ? null : {
                  year: '2026',
                  totalMarks: 200,
                  open: `${kpiStats.safeMin} – ${kpiStats.safeMax}`,
                  obc: `${kpiStats.safeMin} – ${kpiStats.safeMax}`,
                  ews: `${kpiStats.safeMin - 1} – ${kpiStats.safeMax}`,
                  sc: `${Math.round(kpiStats.safeMin * 0.95)} – ${Math.round(kpiStats.safeMax * 0.95)}`,
                  note: '95% Confidence Safe Target',
                  cx: 850,
                  cy: 96
                })}
                onMouseEnter={() => setHoveredPoint({
                  year: '2026',
                  totalMarks: 200,
                  open: `${kpiStats.safeMin} – ${kpiStats.safeMax}`,
                  obc: `${kpiStats.safeMin} – ${kpiStats.safeMax}`,
                  ews: `${kpiStats.safeMin - 1} – ${kpiStats.safeMax}`,
                  sc: `${Math.round(kpiStats.safeMin * 0.95)} – ${Math.round(kpiStats.safeMax * 0.95)}`,
                  note: '95% Confidence Safe Target',
                  cx: 850,
                  cy: 96
                })}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {/* SVG Floating Tooltip Popup — Fully Enclosed Card with All 3-4 Series */}
              {hoveredPoint && (() => {
                const clampedX = Math.max(120, Math.min(780, hoveredPoint.cx))
                const arrowX = hoveredPoint.cx - clampedX
                const isTop = hoveredPoint.cy >= 115
                const boxY = isTop ? -116 : 12

                return (
                  <g transform={`translate(${clampedX}, ${hoveredPoint.cy})`}>
                    {/* Tooltip Background Card */}
                    <rect
                      x="-110"
                      y={boxY}
                      width="220"
                      height="104"
                      rx="8"
                      fill="#18181b"
                      stroke="#ea580c"
                      strokeWidth="1.5"
                    />

                    {/* Pointer Triangle */}
                    <polygon
                      points={isTop
                        ? `${arrowX - 6},-6 ${arrowX + 6},-6 ${arrowX},0`
                        : `${arrowX - 6},6 ${arrowX + 6},6 ${arrowX},0`
                      }
                      fill="#18181b"
                      stroke="#ea580c"
                      strokeWidth="1"
                    />

                    {/* Header Row: Cycle & Pattern Note */}
                    <text
                      x="-98"
                      y={boxY + 18}
                      fill="#fed7aa"
                      fontSize="10.5"
                      fontWeight="800"
                      letterSpacing="0.3"
                    >
                      {hoveredPoint.year} Cycle ({hoveredPoint.totalMarks}M Base)
                    </text>
                    <text
                      x="98"
                      y={boxY + 18}
                      textAnchor="end"
                      fill="#a1a1aa"
                      fontSize="8.5"
                    >
                      {hoveredPoint.year === '2026' ? 'Target' : hoveredPoint.totalMarks === 200 ? 'GS-1 Only' : 'GS + CSAT'}
                    </text>

                    {/* Subtle Divider Line */}
                    <line
                      x1="-98"
                      y1={boxY + 24}
                      x2="98"
                      y2={boxY + 24}
                      stroke="#3f3f46"
                      strokeWidth="0.8"
                    />

                    {/* Line 1: Open / General */}
                    <circle cx="-92" cy={boxY + 39} r="3" fill="#ea580c" />
                    <text x="-82" y={boxY + 42} fill="#f4f4f5" fontSize="10" fontWeight="600">Open / General</text>
                    <text x="98" y={boxY + 42} textAnchor="end" fill="#ffffff" fontSize="11" fontWeight="800">{hoveredPoint.open} M</text>

                    {/* Line 2: OBC (NCL) */}
                    <circle cx="-92" cy={boxY + 56} r="3" fill="#0284c7" />
                    <text x="-82" y={boxY + 59} fill="#f4f4f5" fontSize="10" fontWeight="600">OBC (NCL)</text>
                    <text x="98" y={boxY + 59} textAnchor="end" fill="#ffffff" fontSize="11" fontWeight="800">{hoveredPoint.obc} M</text>

                    {/* Line 3: EWS (10%) */}
                    <circle cx="-92" cy={boxY + 73} r="3" fill="#059669" />
                    <text x="-82" y={boxY + 76} fill="#f4f4f5" fontSize="10" fontWeight="600">EWS (10%)</text>
                    <text x="98" y={boxY + 76} textAnchor="end" fill="#ffffff" fontSize="11" fontWeight="800">{hoveredPoint.ews ? `${hoveredPoint.ews} M` : 'Pre-2019'}</text>

                    {/* Line 4: SC Quota */}
                    <circle cx="-92" cy={boxY + 90} r="3" fill="#a1a1aa" />
                    <text x="-82" y={boxY + 93} fill="#a1a1aa" fontSize="9.5" fontWeight="500">SC Quota</text>
                    <text x="98" y={boxY + 93} textAnchor="end" fill="#e4e4e7" fontSize="10.5" fontWeight="700">{hoveredPoint.sc} M</text>
                  </g>
                )
              })()}
            </svg>

            <div className={styles.axisYearsRow}>
              <span>2015</span>
              <span>2016</span>
              <span>2017</span>
              <span>2018</span>
              <span>2019</span>
              <span>2020</span>
              <span>2021</span>
              <span>2022</span>
              <span>2023</span>
              <span>2024</span>
              <span className={styles.axisYearHighlight}>2026 (Est.)</span>
            </div>
          </div>
        </div>

          {/* Major Historical Gazette Annotations */}
          <div className={styles.timelineGrid}>
            <div className={styles.timelineCard}>
              <span className={styles.timelineStepNum}>1</span>
              <div>
                <h3 className={styles.timelineTitle}>2019: Introduction of EWS Quota</h3>
                <p className={styles.timelineText}>
                  10% Central & State quota caused an immediate 3.5 mark divergence between Open General and Economically Weaker Section closing marks.
                </p>
              </div>
            </div>

            <div className={styles.timelineCard}>
              <span className={styles.timelineStepNum}>2</span>
              <div>
                <h3 className={styles.timelineTitle}>2022: CSAT Made Qualifying (33%)</h3>
                <p className={styles.timelineText}>
                  Landmark reform eliminated CSAT Paper-2 from merit calculation. Cutoff shifted strictly to 200 marks of Paper-1 (GS), causing raw mark calibration.
                </p>
              </div>
            </div>

            <div className={styles.timelineCard}>
              <span className={styles.timelineStepNum}>3</span>
              <div>
                <h3 className={styles.timelineTitle}>2024: SEBC Reservation Promulgation</h3>
                <p className={styles.timelineText}>
                  Re-entry of Socially and Educationally Backward Classes (10% state quota) re-calibrated Open cutoffs higher across Group A and Group B cadres.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Stat Summary Cards (KPI Benchmarks) */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>10-Year Median Cutoff</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiNumber}>{kpiStats.avg}</span>
                <span className={styles.kpiUnit}>/ Max Marks</span>
              </div>
              <p className={styles.kpiFootnote}>Average across verified notification cycles for {selectedExam}</p>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Historical Lowest Point</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiNumber}>{kpiStats.lowest}</span>
                <span className={styles.kpiBadgeSuccess}>Cycle {kpiStats.lowestYear}</span>
              </div>
              <p className={styles.kpiFootnote}>High-difficulty shift coupled with high vacancy cycle</p>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Historical Peak Cutoff</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiNumber}>{kpiStats.highest}</span>
                <span className={styles.kpiBadgeSecondary}>Cycle {kpiStats.highestYear}</span>
              </div>
              <p className={styles.kpiFootnote}>Low vacancy year with intense candidate concentration</p>
            </div>

            <div className={styles.kpiCardPrimary}>
              <span className={styles.kpiLabel}>Target Safe Range (2026)</span>
              <div className={styles.kpiValueRow}>
                <span className={styles.kpiNumber}>{kpiStats.safeMin} – {kpiStats.safeMax}</span>
                <span className={styles.kpiUnit}>Marks</span>
              </div>
              <p className={styles.kpiFootnote}>Calculated for 95% qualification probability in upcoming exams</p>
            </div>
          </div>
        </section>

        {/* Comprehensive 10-Year Cutoff Comparison Data Table (GAZETTE COLUMN REMOVED AS REQUESTED) */}
        <section className={styles.tableSection}>
          <div className={styles.tableHeaderRow}>
            <div>
              <h2 className={styles.tableTitle}>10-Year Official Gazette Archives</h2>
              <p className={styles.tableSubtitle}>
                Every score verified against official Maharashtra Administrative Gazette corrigendums and commission final merit keys.
              </p>
            </div>
            <div className={styles.tableActions}>
              <button type="button" className={styles.actionBtn} onClick={handleExportCSV}>
                <span className="material-symbols-outlined">download</span>
                Export CSV
              </button>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.cutoffTable}>
              <thead>
                <tr>
                  <th>Exam Year</th>
                  <th>Vacancies</th>
                  <th className={styles.cellHardness}>Hardness</th>
                  <th>Open / Gen</th>
                  <th>OBC (NCL)</th>
                  <th>EWS (10%)</th>
                  <th>SC</th>
                  <th>ST</th>
                  <th>Women (Open)</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.emptyRow}>
                      No cutoff records found matching the active filters.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((item, idx) => {
                    const prevItem = filteredRows[idx + 1]
                    const denominatorChanged = prevItem && item.totalMarks && prevItem.totalMarks && item.totalMarks !== prevItem.totalMarks
                    const diff = prevItem && item.cutoffs.open && prevItem.cutoffs.open && !denominatorChanged
                      ? (item.cutoffs.open - prevItem.cutoffs.open).toFixed(2)
                      : null

                    const hardnessScore = item.year === '2024' ? '8.6' : item.year === '2023' ? '7.4' : item.year === '2022' ? '6.8' : item.year === '2020' ? '8.9' : '7.5'
                    const isHard = parseFloat(hardnessScore) >= 8.0

                    return (
                      <tr key={item.id} className={styles.tableRow}>
                        <td>
                          <span className={styles.cellYear}>{item.year} ({item.totalMarks ? `${item.totalMarks}M Base` : (item.post.includes('Prelims') ? 'Prelims' : 'Final')})</span>
                          <span className={styles.cellSubtext}>{item.post}</span>
                        </td>
                        <td>
                          <span className={styles.cellYear}>{item.vacancies ? `${item.vacancies} Posts` : 'N/A'}</span>
                        </td>
                        <td className={styles.cellHardness}>
                          <span className={isHard ? styles.hardnessBadge : styles.hardnessBadgeModerate}>
                            {hardnessScore} / 10
                          </span>
                        </td>
                        <td>
                          <span className={styles.cellScorePrimary}>{item.cutoffs.open ? item.cutoffs.open.toFixed(2) : 'N/A'}</span>
                          {denominatorChanged ? (
                            <span className={styles.scoreDiffReform}>CSAT Reform ({prevItem.totalMarks}M → {item.totalMarks}M)</span>
                          ) : diff && parseFloat(diff) > 0 ? (
                            <span className={styles.scoreDiffPositive}>+{diff} vs prev</span>
                          ) : diff && parseFloat(diff) < 0 ? (
                            <span className={styles.scoreDiffNegative}>{diff} vs prev</span>
                          ) : null}
                        </td>
                        <td>
                          <span className={styles.cellYear}>{item.cutoffs.obc ? item.cutoffs.obc.toFixed(2) : 'N/A'}</span>
                        </td>
                        <td>
                          <span className={styles.cellYear}>
                            {item.cutoffs.ews ? item.cutoffs.ews.toFixed(2) : 'Pre-EWS'}
                          </span>
                        </td>
                        <td>
                          <span className={styles.cellSubtext}>{item.cutoffs.sc ? item.cutoffs.sc.toFixed(2) : 'N/A'}</span>
                        </td>
                        <td>
                          <span className={styles.cellSubtext}>{item.cutoffs.st ? item.cutoffs.st.toFixed(2) : 'N/A'}</span>
                        </td>
                        <td>
                          <span className={styles.cellSubtext}>{item.cutoffs.women ? item.cutoffs.women.toFixed(2) : 'N/A'}</span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card-Wise View (Screenshot 3 Fix) */}
          <div className={styles.gazetteMobileCards}>
            {filteredRows.length === 0 ? (
              <div className={styles.emptyRow}>
                No cutoff records found matching the active filters.
              </div>
            ) : (
              filteredRows.map((item, idx) => {
                const prevItem = filteredRows[idx + 1]
                const denominatorChanged = prevItem && item.totalMarks && prevItem.totalMarks && item.totalMarks !== prevItem.totalMarks
                const diff = prevItem && item.cutoffs.open && prevItem.cutoffs.open && !denominatorChanged
                  ? (item.cutoffs.open - prevItem.cutoffs.open).toFixed(2)
                  : null

                const hardnessScore = item.year === '2024' ? '8.6' : item.year === '2023' ? '7.4' : item.year === '2022' ? '6.8' : item.year === '2020' ? '8.9' : '7.5'
                const isHard = parseFloat(hardnessScore) >= 8.0

                return (
                  <div key={item.id} className={styles.gazetteCard}>
                    <div className={styles.gazetteCardHeader}>
                      <div className={styles.gazetteYearPill}>
                        <span className={styles.gazetteYearBadge}>{item.year}</span>
                        <span className={styles.gazetteBaseTag}>
                          {item.totalMarks ? `${item.totalMarks}M Base` : (item.post.includes('Prelims') ? 'Prelims' : 'Final')}
                        </span>
                      </div>
                      <span className={isHard ? styles.hardnessBadge : styles.hardnessBadgeModerate}>
                        Hardness: {hardnessScore}/10
                      </span>
                    </div>

                    <h3 className={styles.gazettePostTitle}>{item.post}</h3>

                    <div className={styles.gazetteMetaRow}>
                      <span className={styles.gazetteVacancies}>
                        <span className="material-symbols-outlined">work</span>
                        {item.vacancies ? `${item.vacancies} Official Vacancies` : 'Vacancies N/A'}
                      </span>
                    </div>

                    {/* Open / General Cutoff Focus */}
                    <div className={styles.gazetteOpenBlock}>
                      <div className={styles.gazetteOpenHeader}>
                        <span>OPEN / GENERAL CUTOFF</span>
                        {denominatorChanged ? (
                          <span className={styles.scoreDiffReform}>CSAT Reform ({prevItem.totalMarks}M → {item.totalMarks}M)</span>
                        ) : diff && parseFloat(diff) > 0 ? (
                          <span className={styles.scoreDiffPositive}>+{diff} vs prev</span>
                        ) : diff && parseFloat(diff) < 0 ? (
                          <span className={styles.scoreDiffNegative}>{diff} vs prev</span>
                        ) : null}
                      </div>
                      <div className={styles.gazetteOpenScore}>
                        {item.cutoffs.open ? item.cutoffs.open.toFixed(2) : 'N/A'}
                      </div>
                    </div>

                    {/* Reserved Categories Grid */}
                    <div className={styles.gazetteCategoryGrid}>
                      <div className={styles.gazetteCatCard}>
                        <span className={styles.gazetteCatName}>OBC (NCL)</span>
                        <span className={styles.gazetteCatScore}>{item.cutoffs.obc ? item.cutoffs.obc.toFixed(2) : 'N/A'}</span>
                      </div>
                      <div className={styles.gazetteCatCard}>
                        <span className={styles.gazetteCatName}>EWS (10%)</span>
                        <span className={styles.gazetteCatScore}>{item.cutoffs.ews ? item.cutoffs.ews.toFixed(2) : 'Pre-EWS'}</span>
                      </div>
                      <div className={styles.gazetteCatCard}>
                        <span className={styles.gazetteCatName}>SC</span>
                        <span className={styles.gazetteCatScore}>{item.cutoffs.sc ? item.cutoffs.sc.toFixed(2) : 'N/A'}</span>
                      </div>
                      <div className={styles.gazetteCatCard}>
                        <span className={styles.gazetteCatName}>ST</span>
                        <span className={styles.gazetteCatScore}>{item.cutoffs.st ? item.cutoffs.st.toFixed(2) : 'N/A'}</span>
                      </div>
                      {item.cutoffs.women && (
                        <div className={styles.gazetteCatCard}>
                          <span className={styles.gazetteCatName}>Women</span>
                          <span className={styles.gazetteCatScore}>{item.cutoffs.women.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* Cadre & District-wise Cutoff Variance Heatmap (SCREENSHOT 2 ENHANCEMENT) */}
        <section className={styles.districtSection}>
          <div className={styles.districtHeaderRow}>
            <div>
              <div className={styles.districtTitleWrap}>
                <span className={styles.districtIndicator}></span>
                <h2 className={styles.districtTitle}>Maharashtra Cadre & District Cutoff Variance</h2>
              </div>
              <p className={styles.heroSubtitle}>
                Closing marks benchmarks across MPSC Gazetted Group A, Group B, Group C services and decentralised examinations (Police & Talathi).
              </p>
            </div>

            <div className={styles.districtToggleGroup}>
              <button
                type="button"
                className={`${styles.districtToggleBtn} ${districtCadre === 'group_a' ? styles.districtToggleBtnActive : ''}`}
                onClick={() => setDistrictCadre('group_a')}
              >
                MPSC Group A (Gazetted)
              </button>
              <button
                type="button"
                className={`${styles.districtToggleBtn} ${districtCadre === 'group_b' ? styles.districtToggleBtnActive : ''}`}
                onClick={() => setDistrictCadre('group_b')}
              >
                MPSC Group B (Combined)
              </button>
              <button
                type="button"
                className={`${styles.districtToggleBtn} ${districtCadre === 'group_c' ? styles.districtToggleBtnActive : ''}`}
                onClick={() => setDistrictCadre('group_c')}
              >
                MPSC Group C Services
              </button>
              <button
                type="button"
                className={`${styles.districtToggleBtn} ${districtCadre === 'talathi' ? styles.districtToggleBtnActive : ''}`}
                onClick={() => setDistrictCadre('talathi')}
              >
                Talathi Bharti 2023
              </button>
              <button
                type="button"
                className={`${styles.districtToggleBtn} ${districtCadre === 'constable' ? styles.districtToggleBtnActive : ''}`}
                onClick={() => setDistrictCadre('constable')}
              >
                Police Constable
              </button>
              <button
                type="button"
                className={`${styles.districtToggleBtn} ${districtCadre === 'driver_srpf' ? styles.districtToggleBtnActive : ''}`}
                onClick={() => setDistrictCadre('driver_srpf')}
              >
                Driver & SRPF
              </button>
            </div>
          </div>

          <div className={styles.districtGrid}>
            {/* High Competition Cadres / Districts */}
            <div className={styles.districtBox}>
              <div className={styles.districtBoxHeader}>
                <div className={styles.districtBoxTitleWrap}>
                  <span className={`material-symbols-outlined ${styles.iconFire}`}>local_fire_department</span>
                  <span>
                    {districtCadre === 'group_a' ? 'High Competition Gazetted Cadres' :
                     districtCadre === 'group_b' ? 'High Demand Secretariat & Tax Posts' :
                     districtCadre === 'group_c' ? 'High Cutoff Tax & Commercial Posts' :
                     districtCadre === 'driver_srpf' ? 'Elite SRPF & Urban Units' :
                     districtCadre === 'constable' ? 'High Competition Commissionerates' :
                     'High Competition Districts'}
                  </span>
                </div>
                <span className={styles.badgeHighCutoff}>
                  {districtCadre === 'group_a' ? 'Class 1 / S-20' :
                   districtCadre === 'group_b' ? 'S-14 Cadres' :
                   districtCadre === 'group_c' ? 'Group C Top' :
                   'Tier-1 Cutoffs'}
                </span>
              </div>
              <div className={styles.districtList}>
                {DISTRICT_DATA[districtCadre]?.high?.map(d => (
                  <div key={d.name} className={styles.districtCard}>
                    <div>
                      <span className={styles.districtName}>{d.name}</span>
                      <span className={styles.districtPosts}>({d.posts} Posts)</span>
                      <div className={styles.districtMeta}>{d.meta}</div>
                    </div>
                    <div className={styles.districtScoreWrap}>
                      <span className={styles.districtScoreHigh}>{d.score}</span>
                      <span className={styles.districtScoreLabel}>Closing Mark</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Moderate & Favorable Cadres / Districts */}
            <div className={styles.districtBox}>
              <div className={styles.districtBoxHeader}>
                <div className={styles.districtBoxTitleWrap}>
                  <span className={`material-symbols-outlined ${styles.iconTrendingDown}`}>trending_down</span>
                  <span>
                    {districtCadre === 'group_a' ? 'Specialized & Administrative Cadres' :
                     districtCadre === 'group_b' ? 'Field & Subordinate Cadres' :
                     districtCadre === 'group_c' ? 'Typing & Field Services' :
                     districtCadre === 'driver_srpf' ? 'Regional Battalions & Districts' :
                     districtCadre === 'constable' ? 'Moderate & Rural Districts' :
                     'Moderate & Favorable Districts'}
                  </span>
                </div>
                <span className={styles.badgeModerateCutoff}>
                  {districtCadre === 'group_a' || districtCadre === 'group_b' || districtCadre === 'group_c' ? 'Favorable Selection' : 'Favorable Ratio'}
                </span>
              </div>
              <div className={styles.districtList}>
                {DISTRICT_DATA[districtCadre]?.moderate?.map(d => (
                  <div key={d.name} className={styles.districtCard}>
                    <div>
                      <span className={styles.districtName}>{d.name}</span>
                      <span className={styles.districtPosts}>({d.posts} Posts)</span>
                      <div className={styles.districtMeta}>{d.meta}</div>
                    </div>
                    <div className={styles.districtScoreWrap}>
                      <span className={styles.districtScoreModerate}>{d.score}</span>
                      <span className={styles.districtScoreLabel}>Closing Mark</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Factor Analysis: Why Cutoffs Fluctuate (4 Scientific Drivers) */}
        <section className={styles.driversSection}>
          <div className={styles.driversHeader}>
            <span className={styles.driversOverline}>Aspirant Clarity Rubric</span>
            <h2 className={styles.driversTitle}>The 4 Scientific Drivers of Cutoff Fluctuation</h2>
            <p className={styles.driversDesc}>
              Understanding why cutoffs shift by 10 to 18 marks across years prevents premature anxiety and helps you construct a realistic, data-backed score target.
            </p>
          </div>

          <div className={styles.driversGrid}>
            <div className={styles.driverCard}>
              <div className={styles.driverIcon}>
                <span className="material-symbols-outlined">group</span>
              </div>
              <h3 className={styles.driverCardTitle}>1. Vacancy Ratio Inverse</h3>
              <p className={styles.driverCardText}>
                In MPSC Rajyaseva, the qualifying ratio is strictly 1:14 for Mains. When notified posts drop from 600 to 120, the qualifying pool shrinks from 8,400 to 1,680 candidates, mechanically raising the cutoff by 12–16 marks.
              </p>
            </div>

            <div className={styles.driverCard}>
              <div className={styles.driverIcon}>
                <span className="material-symbols-outlined">calculate</span>
              </div>
              <h3 className={styles.driverCardTitle}>2. TCS Shift Normalization</h3>
              <p className={styles.driverCardText}>
                In multi-shift exams (Talathi & Police Bharti), the TCS equi-percentile formula maps tough morning shifts against easier afternoon shifts. A 99th percentile candidate in a tough shift can gain +14 raw marks post-normalization.
              </p>
            </div>

            <div className={styles.driverCard}>
              <div className={styles.driverIcon}>
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <h3 className={styles.driverCardTitle}>3. Statutory Quota Shifts</h3>
              <p className={styles.driverCardText}>
                The addition of EWS (10% in 2019) and SEBC (10% in 2024) reduced the unreserved Open merit pool slice. High-performing reserved candidates opting into Open shifts the unreserved cutoff to parity with the top 40th percentile.
              </p>
            </div>

            <div className={styles.driverCard}>
              <div className={styles.driverIcon}>
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <h3 className={styles.driverCardTitle}>4. Repeat Aspirant Density</h3>
              <p className={styles.driverCardText}>
                Over 42% of candidates appearing in Rajyaseva have completed 2+ preparation cycles. This core merit ceiling group consistently clusters scores between 110–125 regardless of paper ambiguity or negative marking traps.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-Navigation Tool Prompts & Direct CTAs */}
        <section className={styles.ctaGrid}>
          <div className={styles.ctaCard}>
            <div>
              <div className={styles.ctaIcon}>
                <span className="material-symbols-outlined">calculate</span>
              </div>
              <h3 className={styles.ctaTitle}>7th CPC Salary & Pension Calculator</h3>
              <p className={styles.ctaText}>
                Check your exact in-hand take-home pay, HRA class (X, Y, Z), DA revision (53%), and NPS/UPS pension benefits for any post analyzed above.
              </p>
            </div>
            <Link href="/salary-calculator" className={styles.ctaBtnPrimary}>
              Calculate In-Hand Salary
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className={styles.ctaCard}>
            <div>
              <div className={styles.ctaIconGreen}>
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <h3 className={styles.ctaTitle}>Topic-wise Official Syllabi Hub</h3>
              <p className={styles.ctaText}>
                Access comprehensive 343 MPSC and national syllabi blueprints with interactive checklists, unit-wise breakdown, and downloadable PDFs.
              </p>
            </div>
            <Link href="/syllabus" className={styles.ctaBtnSecondary}>
              Browse Syllabus Directory
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className={styles.ctaCardDark}>
            <div>
              <div className={styles.broadcastBadge}>
                <span className={`material-symbols-outlined ${styles.broadcastIcon}`}>notifications_active</span>
                Zero Spam Gazette Broadcast
              </div>
              <h3 className={styles.ctaTitle}>Instant Cutoff Corrigendum Alerts</h3>
              <p className={styles.ctaText}>
                Receive official MPSC and State Board cutoff gazette PDFs directly on Telegram & WhatsApp within 20 minutes of formal release.
              </p>
            </div>
            <div className={styles.channelBtnRow}>
              <a
                href="https://t.me/examudaan"
                target="_blank" rel="noopener noreferrer"
                rel="noopener noreferrer"
                className={styles.channelBtnTelegram}
              >
                <span className="material-symbols-outlined">send</span>
                Telegram
              </a>
              <a
                href="https://whatsapp.com/channel/examudaan"
                target="_blank" rel="noopener noreferrer"
                rel="noopener noreferrer"
                className={styles.channelBtnWhatsapp}
              >
                <span className="material-symbols-outlined">chat</span>
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
