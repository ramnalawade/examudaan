// ============================================================
// app/salary-calculator/page.js — 7th CPC In-Hand Salary & Pension Calculator
// ExamUdaan.in — Verified for 53% Central DA & 50% Maharashtra Shasan GR
// ZERO INLINE STYLES POLICY COMPLIANT
// ============================================================

'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { trackCalculatorUse } from '../../lib/analytics'
import styles from './salary.module.css'

// Master Presets & Posts Database
// Helper: Convert number to Indian words
function numberToIndianWords(num) {
  if (!num || isNaN(num) || num <= 0) return 'Zero Rupees Only'
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  const convertLessThanThousand = (n) => {
    let str = ''
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred '
      n %= 100
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' '
      n %= 10
    }
    if (n > 0) {
      str += ones[n] + ' '
    }
    return str.trim()
  }

  let crore = Math.floor(num / 10000000)
  num %= 10000000
  let lakh = Math.floor(num / 100000)
  num %= 100000
  let thousand = Math.floor(num / 1000)
  num %= 1000
  let remainder = num

  let res = ''
  if (crore > 0) res += convertLessThanThousand(crore) + ' Crore '
  if (lakh > 0) res += convertLessThanThousand(lakh) + ' Lakh '
  if (thousand > 0) res += convertLessThanThousand(thousand) + ' Thousand '
  if (remainder > 0) res += convertLessThanThousand(remainder) + ' '

  return (res.trim() + ' Rupees Only')
}

// Master Presets & Posts Database (7th Central & Maharashtra S-Matrix Verified)
const ALL_POSTS = [
  // ─── MAHARASHTRA GROUP A (GAZETTED CLASS-1) ───
  { id: 'dy-collector', label: 'Deputy Collector / SDO (MPSC Class 1)', cadre: 'maha', group: 'group-a', level: 'S-20 (Group A)', basic: 56100, special: 0, peak: 'Additional Collector (₹1,82,400)' },
  { id: 'dysp-police', label: 'Dy. Superintendent of Police / ACP (DySP)', cadre: 'maha', group: 'group-a', level: 'S-20 (Group A)', basic: 56100, special: 1500, peak: 'Superintendent of Police (₹1,82,400)' },
  { id: 'tehsildar', label: 'Tehsildar (Executive Magistrate)', cadre: 'maha', group: 'group-a', level: 'S-19 (Class 1)', basic: 53100, special: 0, peak: 'Sub-Divisional Officer (₹1,67,800)' },
  { id: 'acst-gst', label: 'Assistant Commissioner of State Tax (GST)', cadre: 'maha', group: 'group-a', level: 'S-20 (Group A)', basic: 56100, special: 0, peak: 'Joint Commissioner (₹1,82,400)' },
  { id: 'bdo-group-a', label: 'Block Development Officer (BDO - Group A)', cadre: 'maha', group: 'group-a', level: 'S-20 (Group A)', basic: 56100, special: 0, peak: 'CEO Zilla Parishad (₹1,82,400)' },
  { id: 'co-nagar-parishad', label: 'Chief Officer (Nagar Parishad Gr-A)', cadre: 'maha', group: 'group-a', level: 'S-20 (Group A)', basic: 56100, special: 0, peak: 'Municipal Commissioner (₹1,82,400)' },
  { id: 'rto-officer', label: 'Regional Transport Officer (RTO Class 1)', cadre: 'maha', group: 'group-a', level: 'S-20 (Group A)', basic: 56100, special: 0, peak: 'Transport Commissioner (₹1,82,400)' },

  // ─── MAHARASHTRA GROUP B (GAZETTED & SUBORDINATE) ───
  { id: 'naib-tehsildar', label: 'Naib Tehsildar (Revenue Dept)', cadre: 'maha', group: 'group-b', level: 'S-15 (Group B)', basic: 41800, special: 0, peak: 'Tehsildar (₹1,32,000)' },
  { id: 'bdo-group-b', label: 'Block Development Officer (BDO - Gr B)', cadre: 'maha', group: 'group-b', level: 'S-15 (Group B)', basic: 41800, special: 0, peak: 'BDO Group A (₹1,32,000)' },
  { id: 'aso-mah', label: 'Assistant Section Officer (ASO Mantralaya)', cadre: 'maha', group: 'group-b', level: 'S-14 (Group B)', basic: 38600, special: 0, peak: 'Deputy Secretary (₹1,44,200)' },
  { id: 'sti-mah', label: 'State Tax Inspector / STI (GST)', cadre: 'maha', group: 'group-b', level: 'S-14 (Group B)', basic: 38600, special: 0, peak: 'Assistant Commissioner (₹1,32,000)' },
  { id: 'sub-registrar', label: 'Sub-Registrar / Stamp Inspector (Class II)', cadre: 'maha', group: 'group-b', level: 'S-14 (Group B)', basic: 38600, special: 0, peak: 'District Registrar (₹1,32,000)' },
  { id: 'psi-mah', label: 'Police Sub-Inspector / PSI (MPSC)', cadre: 'maha', group: 'group-b', level: 'S-13 (Group B)', basic: 35400, special: 540, peak: 'Senior Police Inspector (₹1,12,400)' },
  { id: 'amvi-rto', label: 'Asst. Motor Vehicle Inspector (AMVI)', cadre: 'maha', group: 'group-b', level: 'S-14 (Group B)', basic: 38600, special: 500, peak: 'Deputy RTO (₹1,32,000)' },
  { id: 'ext-agri-officer', label: 'Extension Officer (Agriculture / ZP)', cadre: 'maha', group: 'group-b', level: 'S-13 (Group B)', basic: 35400, special: 0, peak: 'Taluka Agri Officer (₹1,12,400)' },

  // ─── MAHARASHTRA GROUP C (MINISTERIAL & FIELD) ───
  { id: 'talathi', label: 'Talathi / Revenue Assistant', cadre: 'maha', group: 'group-c', level: 'S-8 (Group C)', basic: 25500, special: 0, peak: 'Naib Tehsildar (₹81,100)' },
  { id: 'tax-assistant-mah', label: 'Tax Assistant (Sales Tax / GST Dept)', cadre: 'maha', group: 'group-c', level: 'S-8 (Group C)', basic: 25500, special: 0, peak: 'State Tax Inspector (₹81,100)' },
  { id: 'clerk-typist-mah', label: 'Clerk-Typist (Mantralaya & Field)', cadre: 'maha', group: 'group-c', level: 'S-6 (Group C)', basic: 19900, special: 0, peak: 'Section Officer (₹81,100)' },
  { id: 'police-constable', label: 'Police Constable / Shipayi', cadre: 'maha', group: 'group-c', level: 'S-6 (Group C)', basic: 21700, special: 1200, peak: 'Assistant Police Sub-Inspector (₹69,100)' },
  { id: 'police-head-constable', label: 'Police Naik / Head Constable', cadre: 'maha', group: 'group-c', level: 'S-7 (Group C)', basic: 23500, special: 1200, peak: 'Police Sub-Inspector (₹74,800)' },
  { id: 'gram-sevak', label: 'Gram Sevak / Gramvikas Adhikari (ZP)', cadre: 'maha', group: 'group-c', level: 'S-6 (Group C)', basic: 21700, special: 300, peak: 'Block Development Officer (₹81,100)' },
  { id: 'forest-guard', label: 'Vanrakshak / Forest Guard (Mahaforest)', cadre: 'maha', group: 'group-c', level: 'S-6 (Group C)', basic: 21700, special: 800, peak: 'Range Forest Officer (₹1,12,400)' },
  { id: 'arogya-sevak', label: 'Arogya Sevak (Health Dept / ZP)', cadre: 'maha', group: 'group-c', level: 'S-8 (Group C)', basic: 25500, special: 0, peak: 'Health Supervisor (₹81,100)' },
  { id: 'junior-engineer', label: 'Junior Engineer (PWD / WRD / ZP)', cadre: 'maha', group: 'group-c', level: 'S-14 (Group B/C)', basic: 38600, special: 0, peak: 'Executive Engineer (₹1,32,000)' },
  { id: 'primary-teacher', label: 'Primary Teacher / Shikshak (ZP School)', cadre: 'maha', group: 'group-c', level: 'S-10 (Group C)', basic: 29200, special: 0, peak: 'Headmaster / Kendra Pramukh (₹92,300)' },
  { id: 'driver-police', label: 'Driver Constable / Vahan Chalak', cadre: 'maha', group: 'group-c', level: 'S-6 (Group C)', basic: 19900, special: 600, peak: 'Head Driver (₹63,200)' },
  { id: 'peon-shipayi', label: 'Kotwal / Shipayi / Peon (Group D)', cadre: 'maha', group: 'group-c', level: 'S-1 (Group D)', basic: 15000, special: 0, peak: 'Daftari / Record Keeper (₹47,600)' },

  // ─── CENTRAL GOVERNMENT, DEFENCE & ALL-INDIA CADRES ───
  { id: 'ias-central', label: 'IAS / IPS Sub-Divisional Magistrate (UPSC)', cadre: 'central', group: 'central', level: 'Level 10 (Central)', basic: 56100, special: 0, peak: 'Cabinet Secretary / DGP (₹2,25,000)' },
  { id: 'ssc-aso', label: 'SSC CGL ASO (CSS / MEA / IB / Railway)', cadre: 'central', group: 'central', level: 'Level 7 (Central)', basic: 44900, special: 0, peak: 'Under Secretary / Director (₹1,51,100)' },
  { id: 'ssc-inspector', label: 'Income Tax / GST / Preventive Inspector (SSC)', cadre: 'central', group: 'central', level: 'Level 7 (Central)', basic: 44900, special: 0, peak: 'Assistant Commissioner (₹1,51,100)' },
  { id: 'cbi-sub-inspector', label: 'Sub-Inspector (CBI / NIA / ED)', cadre: 'central', group: 'central', level: 'Level 7 (Central)', basic: 44900, special: 2500, peak: 'Superintendent of Police (₹1,51,100)' },
  { id: 'ssc-auditor', label: 'Auditor / Accountant (CAG / CGDA)', cadre: 'central', group: 'central', level: 'Level 5 (Central)', basic: 29200, special: 0, peak: 'Senior Audit Officer (₹92,300)' },
  { id: 'ssc-tax-asst', label: 'Tax Assistant (CBDT / CBIC Excise)', cadre: 'central', group: 'central', level: 'Level 4 (Central)', basic: 25500, special: 0, peak: 'Senior Tax Assistant (₹81,100)' },
  { id: 'ssc-chsl-ldc', label: 'Lower Division Clerk / LDC (SSC CHSL)', cadre: 'central', group: 'central', level: 'Level 2 (Central)', basic: 19900, special: 0, peak: 'Section Officer (₹63,200)' },
  { id: 'railway-station-master', label: 'Station Master (RRB NTPC)', cadre: 'central', group: 'central', level: 'Level 6 (Railways)', basic: 35400, special: 2400, peak: 'Divisional Traffic Manager (₹1,12,400)' },
  { id: 'railway-train-manager', label: 'Train Manager / Goods Guard (RRB)', cadre: 'central', group: 'central', level: 'Level 5 (Railways)', basic: 29200, special: 3200, peak: 'Chief Train Controller (₹92,300)' },
  { id: 'railway-alp', label: 'Railway ALP / Loco Pilot (RRB)', cadre: 'central', group: 'central', level: 'Level 2 (Railways)', basic: 19900, special: 3500, peak: 'Mail / Express Loco Pilot (₹81,100)' },
  { id: 'railway-group-d', label: 'Track Maintainer / Pointsman (RRB Gr D)', cadre: 'central', group: 'central', level: 'Level 1 (Railways)', basic: 18000, special: 1000, peak: 'Senior Technician (₹56,900)' },
  { id: 'ibps-po', label: 'IBPS PO — Probationary Officer (PSU Bank)', cadre: 'central', group: 'central', level: 'Scale-I (PSU Bank)', basic: 48480, special: 0, peak: 'Chief General Manager (₹1,80,000)' },
  { id: 'sbi-clerk', label: 'SBI Junior Associate / Cashier (Banking)', cadre: 'central', group: 'central', level: 'Clerical (Bank)', basic: 26000, special: 0, peak: 'Chief Associate (₹65,000)' },
  { id: 'rbi-grade-b', label: 'RBI Grade B Officer (Managerial)', cadre: 'central', group: 'central', level: 'Grade B (Executive)', basic: 55200, special: 5000, peak: 'Executive Director (₹2,18,000)' }
]

export default function SalaryCalculatorPage() {
  // Config State
  const [cadre, setCadre] = useState('maha') // 'maha' | 'central'
  const [selectedPostId, setSelectedPostId] = useState('psi-mah')
  const [basicPay, setBasicPay] = useState(35400)
  const [hraTier, setHraTier] = useState('Y') // 'X' (30%) | 'Y' (20%) | 'Z' (10%)
  const [hasGovtQuarter, setHasGovtQuarter] = useState(false)
  const [taOption, setTaOption] = useState('other') // 'higher' (3600), 'other' (1800), 'none' (0)
  const [specialAllowance, setSpecialAllowance] = useState(540)
  const [pensionScheme, setPensionScheme] = useState('ups') // 'ups' (10% + 18.5%) | 'nps' (10% + 14%)
  const [gisTier, setGisTier] = useState('360') // GIS: 480 (A), 360 (B), 240 (C), 120 (D)
  const [tdsTax, setTdsTax] = useState(0)
  const [vpfSavings, setVpfSavings] = useState(0)
  const [tableSearch, setTableSearch] = useState('')

  // DA Rates
  // Maharashtra State Shasan: 50%
  // Central Government: 53%
  const daRate = cadre === 'maha' ? 0.50 : 0.53

  // HRA Rates (Post 50% DA Thresholds)
  const HRA_PERCENT = { X: 0.30, Y: 0.20, Z: 0.10 }

  // Handle Preset Selection
  const handlePresetChange = (postId) => {
    setSelectedPostId(postId)
    const found = ALL_POSTS.find(p => p.id === postId)
    if (found) {
      setCadre(found.cadre)
      setBasicPay(found.basic)
      setSpecialAllowance(found.special)
    }
  }

  // Handle Cadre switch
  const handleCadreSwitch = (newCadre) => {
    setCadre(newCadre)
    // pick first post in that cadre
    const candidate = ALL_POSTS.find(p => p.cadre === newCadre)
    if (candidate) {
      setSelectedPostId(candidate.id)
      setBasicPay(candidate.basic)
      setSpecialAllowance(candidate.special)
    }
  }

  // Handle +3% Annual Increment Simulator
  const handleNextIncrement = () => {
    const increment = Math.round((basicPay * 1.03) / 100) * 100
    setBasicPay(increment)
  }

  // Real-time Calculations
  const calculated = useMemo(() => {
    const daAmount = Math.round(basicPay * daRate)

    // HRA
    const hraRateDecimal = HRA_PERCENT[hraTier] || 0.20
    const hraAmount = hasGovtQuarter ? 0 : Math.round(basicPay * hraRateDecimal)

    // Transport Allowance (TA) + DA on TA
    let baseTa = 0
    if (taOption === 'higher') {
      baseTa = basicPay >= 35400 ? 7200 : 3600
    } else if (taOption === 'other') {
      baseTa = basicPay >= 35400 ? 3600 : 1800
    }
    const daOnTa = Math.round(baseTa * daRate)
    const totalTa = baseTa + daOnTa

    // Gross Earnings
    const grossSalary = basicPay + daAmount + hraAmount + totalTa + Number(specialAllowance || 0)

    // Deductions
    // Pension (UPS or NPS): 10% of (Basic + DA)
    const pensionBase = basicPay + daAmount
    const employeePension = Math.round(pensionBase * 0.10)
    const govtPensionContrib = Math.round(pensionBase * (pensionScheme === 'ups' ? 0.185 : 0.14))

    const ptDeduction = cadre === 'maha' ? 200 : 0
    const gisDeduction = Number(gisTier) || 0
    const tdsDeduction = Number(tdsTax) || 0
    const vpfDeduction = Number(vpfSavings) || 0

    const totalDeductions = employeePension + ptDeduction + gisDeduction + tdsDeduction + vpfDeduction
    const netTakeHome = Math.max(0, grossSalary - totalDeductions)
    const annualNet = netTakeHome * 12

    // Percentage shares for visual chart
    const basicPct = Math.round((basicPay / grossSalary) * 100)
    const daPct = Math.round((daAmount / grossSalary) * 100)
    const hraPct = Math.round((hraAmount / grossSalary) * 100)
    const perksPct = Math.max(0, 100 - (basicPct + daPct + hraPct))

    return {
      daAmount,
      hraAmount,
      totalTa,
      grossSalary,
      employeePension,
      govtPensionContrib,
      ptDeduction,
      gisDeduction,
      totalDeductions,
      netTakeHome,
      annualNet,
      basicPct,
      daPct,
      hraPct,
      perksPct
    }
  }, [basicPay, daRate, hraTier, hasGovtQuarter, taOption, specialAllowance, pensionScheme, gisTier, tdsTax, vpfSavings, cadre])

  // Track Calculator Usage for analytics
  const userInteracted = useRef(false)
  useEffect(() => {
    if (!userInteracted.current) {
      userInteracted.current = true
      return
    }
    const timer = setTimeout(() => {
      trackCalculatorUse({
        calculator_type: '7th_cpc_salary_pension',
        post_id: selectedPostId,
        basic_pay: basicPay,
        net_salary: calculated.netTakeHome
      })
    }, 1200)
    return () => clearTimeout(timer)
  }, [selectedPostId, basicPay, calculated.netTakeHome])

  // Filter Pay Matrix Table
  const [tableCadreFilter, setTableCadreFilter] = useState('all')

  const selectedPost = useMemo(() => {
    return ALL_POSTS.find(p => p.id === selectedPostId) || ALL_POSTS[0]
  }, [selectedPostId])

  const filteredMatrix = useMemo(() => {
    let result = ALL_POSTS
    if (tableCadreFilter !== 'all') {
      result = result.filter(p => p.group === tableCadreFilter)
    }
    if (!tableSearch.trim()) return result
    const q = tableSearch.toLowerCase()
    return result.filter(p =>
      p.label.toLowerCase().includes(q) ||
      p.level.toLowerCase().includes(q) ||
      p.peak.toLowerCase().includes(q)
    )
  }, [tableSearch, tableCadreFilter])

  return (
    <div className={styles.calculatorPage}>
      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            <span className="material-symbols-outlined">home</span>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbLink}>Tools & Calculators</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>7th CPC In-Hand Salary & Pension Calculator</span>
        </nav>

        {/* Gazette Verified Badge */}
        <div className={styles.verifiedBadge}>
          <span className={`material-symbols-outlined ${styles.verifiedBadgeIcon}`}>verified</span>
          <span>Updated with 53% Central DA & 50% Maharashtra Shasan GR</span>
          <span className={styles.badgeDot}></span>
          <span className={styles.verifiedBadgeHighlight}>7th Pay Matrix (Levels 1 to 14) • NPS vs UPS Models</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className={styles.heroTitle}>7th CPC In-Hand Salary & Pension Calculator</h1>
        <p className={styles.heroSubtitle}>
          Calculate your exact monthly take-home pay, HRA tier adjustments (Class X, Y, Z cities), revised DA increments, NPS/UPS guaranteed retirement contributions, and annual CTC across Maharashtra State and Central Government cadres.
        </p>

        {/* Quick Stat Strip */}
        <div className={styles.statStrip}>
          <div className={styles.statCard}>
            <div className={styles.statIconPrimary}>
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div>
              <div className={styles.statLabel}>Current DA Rates</div>
              <div className={styles.statValue}>53% Ctr / 50% MH</div>
              <div className={styles.statSubtextGreen}>Post-July 2024 revised</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconSecondary}>
              <span className="material-symbols-outlined">location_city</span>
            </div>
            <div>
              <div className={styles.statLabel}>City Classes Mapped</div>
              <div className={styles.statValue}>36 MH Districts</div>
              <div className={styles.statSubtext}>Tier X (30%), Y (20%), Z (10%)</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconTerracotta}>
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div>
              <div className={styles.statLabel}>Pay Bands Covered</div>
              <div className={styles.statValue}>S-1 to S-30</div>
              <div className={styles.statSubtext}>₹15,000 to ₹2,24,100 Matrix</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconGreen}>
              <span className="material-symbols-outlined">shield_person</span>
            </div>
            <div>
              <div className={styles.statLabel}>Retirement Regime</div>
              <div className={styles.statValue}>UPS & NPS Mode</div>
              <div className={styles.statSubtextGreen}>50% Assured Pension rule</div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Calculator Layout */}
        <div className={styles.calcGrid}>
          {/* Left Column: 5-Step Configurator */}
          <div className={styles.configCard}>
            {/* Step 1: Select Cadre / Jurisdiction */}
            <div className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <div className={styles.stepTitle}>
                  <span className={styles.stepBadgeNum}>1</span>
                  Select Cadre / Jurisdiction
                </div>
                <span className={styles.daHighlightBadge}>
                  DA: {Math.round(daRate * 100)}% ({cadre === 'maha' ? 'Maha Shasan' : 'Central'})
                </span>
              </div>
              <div className={styles.cadreGrid}>
                <button
                  type="button"
                  className={`${styles.cadreBtn} ${cadre === 'maha' ? styles.cadreBtnActive : ''}`}
                  onClick={() => handleCadreSwitch('maha')}
                >
                  <div className={styles.cadreBtnHeader}>
                    <span>Maharashtra Shasan</span>
                    {cadre === 'maha' && <span className={`material-symbols-outlined ${styles.cadreCheckIcon}`}>done</span>}
                  </div>
                  <span className={styles.cadreBtnDesc}>MPSC, Police Bharti, Talathi, ZP, PWD, Forest (50% DA)</span>
                </button>

                <button
                  type="button"
                  className={`${styles.cadreBtn} ${cadre === 'central' ? styles.cadreBtnActive : ''}`}
                  onClick={() => handleCadreSwitch('central')}
                >
                  <div className={styles.cadreBtnHeader}>
                    <span>Central Govt of India</span>
                    {cadre === 'central' && <span className={`material-symbols-outlined ${styles.cadreCheckIcon}`}>done</span>}
                  </div>
                  <span className={styles.cadreBtnDesc}>UPSC, SSC CGL/CHSL, RRB Railways, IBPS (53% DA)</span>
                </button>
              </div>
            </div>

            {/* Step 2: Designation Preset or Basic Pay Matrix */}
            <div className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <div className={styles.stepTitle}>
                  <span className={styles.stepBadgeNum}>2</span>
                  Designation Preset or Basic Pay Matrix
                </div>
                <span className={styles.statSubtext}>Quick Fill Cadres</span>
              </div>

              {/* Preset Dropdown */}
              <div className={styles.selectWrapper}>
                <select
                  className={styles.postSelect}
                  value={selectedPostId}
                  onChange={e => handlePresetChange(e.target.value)}
                >
                  {ALL_POSTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.level}: ₹{p.basic.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
                <span className={`material-symbols-outlined ${styles.selectArrow}`}>expand_more</span>
              </div>

              {/* Slider + Number Input */}
              <div className={styles.sliderContainer}>
                <div className={styles.sliderTopRow}>
                  <span className={styles.basicPayLabel}>Basic Pay (मूळ वेतन)</span>
                  <div className={styles.basicPayInputWrap}>
                    <span className={styles.rupeePrefix}>₹</span>
                    <input
                      type="number"
                      className={styles.basicPayNumberInput}
                      value={basicPay}
                      min={15000}
                      max={225000}
                      step={100}
                      onChange={e => setBasicPay(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <input
                  type="range"
                  className={styles.rangeSlider}
                  min={18000}
                  max={144200}
                  step={100}
                  value={basicPay}
                  onChange={e => setBasicPay(Number(e.target.value))}
                />

                <div className={styles.sliderScaleLabels}>
                  <span>Min ₹18,000 (Level 1)</span>
                  <span>₹56,100 (Level 10)</span>
                  <span>Max ₹1,44,200 (Level 14)</span>
                </div>
              </div>
            </div>

            {/* Step 3: Posting Location & HRA Classification */}
            <div className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <div className={styles.stepTitle}>
                  <span className={styles.stepBadgeNum}>3</span>
                  Posting Location & HRA Classification
                </div>
                <span className={styles.statSubtextGreen}>Re-indexed to 30 / 20 / 10%</span>
              </div>

              <div className={styles.hraGrid}>
                <div
                  className={`${styles.hraCard} ${hraTier === 'X' ? styles.hraCardActive : ''}`}
                  onClick={() => setHraTier('X')}
                >
                  <div className={styles.hraCardHeader}>
                    <span>Class X (30%)</span>
                    <span className={styles.hraCardTag}>Metro</span>
                  </div>
                  <span className={styles.hraCardDesc}>Mumbai, Navi Mumbai, Pune Urban MMR</span>
                </div>

                <div
                  className={`${styles.hraCard} ${hraTier === 'Y' ? styles.hraCardActive : ''}`}
                  onClick={() => setHraTier('Y')}
                >
                  <div className={styles.hraCardHeader}>
                    <span>Class Y (20%)</span>
                    <span className={styles.hraCardTag}>Cities</span>
                  </div>
                  <span className={styles.hraCardDesc}>Nagpur, Nashik, Sambhajinagar, Thane, Solapur</span>
                </div>

                <div
                  className={`${styles.hraCard} ${hraTier === 'Z' ? styles.hraCardActive : ''}`}
                  onClick={() => setHraTier('Z')}
                >
                  <div className={styles.hraCardHeader}>
                    <span>Class Z (10%)</span>
                    <span className={styles.hraCardTag}>Rural</span>
                  </div>
                  <span className={styles.hraCardDesc}>Tahsil towns, Gadchiroli, Nandurbar, Washim</span>
                </div>
              </div>

              {/* Government Accommodation Toggle */}
              <div className={styles.quarterToggleRow}>
                <div className={styles.quarterToggleText}>
                  <span className={styles.quarterToggleTitle}>Government Quarter Allotted?</span>
                  <span className={styles.quarterToggleSub}>If Yes, HRA is set to ₹0 + License fee applies</span>
                </div>
                <input
                  type="checkbox"
                  className={styles.toggleSwitch}
                  checked={hasGovtQuarter}
                  onChange={e => setHasGovtQuarter(e.target.checked)}
                />
              </div>
            </div>

            {/* Step 4: Transport & Cadre Special Allowances */}
            <div className={styles.stepSection}>
              <div className={styles.stepTitle}>
                <span className={styles.stepBadgeNum}>4</span>
                Transport & Cadre Special Allowances
              </div>

              <div className={styles.allowanceGrid}>
                <div className={styles.inputFieldWrap}>
                  <label className={styles.fieldLabel}>Transport Allowance (TA) Base</label>
                  <select
                    className={styles.commonSelect}
                    value={taOption}
                    onChange={e => setTaOption(e.target.value)}
                  >
                    <option value="higher">Higher TPTA City (₹3,600 / ₹7,200)</option>
                    <option value="other">Other Places (₹1,800 / ₹3,600)</option>
                    <option value="none">Nil / Field Vehicle Provided (₹0)</option>
                  </select>
                </div>

                <div className={styles.inputFieldWrap}>
                  <label className={styles.fieldLabel}>Special / Uniform / Hardship Allowance</label>
                  <div className={styles.commonNumberInputWrap}>
                    <span className={styles.rupeePrefix}>₹</span>
                    <input
                      type="number"
                      className={styles.commonNumberInput}
                      value={specialAllowance}
                      min={0}
                      max={25000}
                      step={50}
                      onChange={e => setSpecialAllowance(Number(e.target.value) || 0)}
                    />
                    <span className={styles.unitSuffix}>/mo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Pension Scheme & Tax Deductions */}
            <div className={styles.stepSection}>
              <div className={styles.stepTitle}>
                <span className={styles.stepBadgeNum}>5</span>
                Pension Scheme & Tax Deductions
              </div>

              {/* Pension Switcher */}
              <div className={styles.pensionSwitcherBox}>
                <div className={styles.pensionToggleRow}>
                  <div className={styles.pensionToggleTitle}>
                    <span className={`material-symbols-outlined ${styles.pensionIcon}`}>account_balance</span>
                    <span>Retirement Security Regime</span>
                  </div>
                  <div className={styles.pensionBtnGroup}>
                    <button
                      type="button"
                      className={`${styles.pensionBtn} ${pensionScheme === 'ups' ? styles.pensionBtnActive : ''}`}
                      onClick={() => setPensionScheme('ups')}
                    >
                      UPS (Unified)
                    </button>
                    <button
                      type="button"
                      className={`${styles.pensionBtn} ${pensionScheme === 'nps' ? styles.pensionBtnActive : ''}`}
                      onClick={() => setPensionScheme('nps')}
                    >
                      NPS (National)
                    </button>
                  </div>
                </div>
                <p className={styles.pensionDesc}>
                  {pensionScheme === 'ups'
                    ? 'Under UPS, employee pays 10% (Basic + DA), Union/State contributes 18.5%. Guarantees 50% assured pension of last drawn pay with inflation indexation.'
                    : 'Under NPS, employee pays 10% (Basic + DA), Govt contributes 14%. Corpus is market-linked across equity, govt bonds, and annuities.'}
                </p>
              </div>

              {/* Standard Deductions Inputs */}
              <div className={styles.allowanceGrid}>
                <div className={styles.inputFieldWrap}>
                  <label className={styles.fieldLabel}>State Group Insurance (GIS)</label>
                  <select
                    className={styles.commonSelect}
                    value={gisTier}
                    onChange={e => setGisTier(e.target.value)}
                  >
                    <option value="480">₹480 (Group A Gazetted)</option>
                    <option value="360">₹360 (Group B Officer)</option>
                    <option value="240">₹240 (Group C Staff)</option>
                    <option value="120">₹120 (Group D Cadre)</option>
                  </select>
                </div>

                <div className={styles.inputFieldWrap}>
                  <label className={styles.fieldLabel}>Est. Monthly Income Tax (TDS)</label>
                  <div className={styles.commonNumberInputWrap}>
                    <span className={styles.rupeePrefix}>₹</span>
                    <input
                      type="number"
                      className={styles.commonNumberInput}
                      value={tdsTax}
                      min={0}
                      max={60000}
                      step={100}
                      placeholder="e.g. 2500"
                      onChange={e => setTdsTax(Number(e.target.value) || 0)}
                    />
                    <span className={styles.unitSuffix}>/mo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Live Salary Slip & Summary */}
          <div className={styles.slipStickyWrap}>
            <div className={styles.slipCard}>
              <div className={styles.slipHeader}>
                <span className={styles.slipOverline}>Estimated Take-Home</span>
                <span className={styles.liveTag}>
                  <span className={styles.liveDot}></span>
                  Live Recalculated
                </span>
              </div>

              {/* Highlight Amount */}
              <div className={styles.takeHomeBanner}>
                <div className={styles.takeHomeLabel}>Net Monthly In-Hand Salary</div>
                <div className={styles.takeHomeAmount}>₹{calculated.netTakeHome.toLocaleString('en-IN')}</div>
                <div className={styles.takeHomeCreditInfo}>Credited on 1st of every month into bank account</div>
              </div>

              {/* High-Level Financial Ratios */}
              <div className={styles.ratioGrid}>
                <div className={styles.ratioCard}>
                  <span className={styles.ratioLabel}>Gross Monthly Pay</span>
                  <div className={styles.ratioValue}>₹{calculated.grossSalary.toLocaleString('en-IN')}</div>
                </div>
                <div className={styles.ratioCard}>
                  <span className={styles.ratioLabel}>Total Deductions</span>
                  <div className={styles.ratioValueDeduct}>₹{calculated.totalDeductions.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Annual CTC Banner */}
              <div className={styles.annualBanner}>
                <div className={styles.annualLeft}>
                  <span className={`material-symbols-outlined ${styles.annualIcon}`}>calendar_month</span>
                  <span>Annual Net Take-Home</span>
                </div>
                <span className={styles.annualValue}>₹{calculated.annualNet.toLocaleString('en-IN')} / yr</span>
              </div>

              {/* Multi-segment Proportion Bar */}
              <div className={styles.propBarWrap}>
                <div className={styles.propBarHeader}>
                  <span>Salary Component Share</span>
                  <span>Basic {calculated.basicPct}% • DA {calculated.daPct}% • HRA {calculated.hraPct}%{calculated.perksPct > 0 ? ` • Perks ${calculated.perksPct}%` : ''}</span>
                </div>
                <svg className={styles.multiBarSvg} viewBox="0 0 100 12" preserveAspectRatio="none">
                  <rect x="0" y="0" width={calculated.basicPct} height="12" fill="#ea580c" />
                  <rect x={calculated.basicPct} y="0" width={calculated.daPct} height="12" fill="#f97316" />
                  <rect x={calculated.basicPct + calculated.daPct} y="0" width={calculated.hraPct} height="12" fill="#059669" />
                  <rect x={calculated.basicPct + calculated.daPct + calculated.hraPct} y="0" width={calculated.perksPct} height="12" fill="#0284c7" />
                </svg>
                <div className={styles.propBarLegend}>
                  <span><span className={styles.legendDotBasic}></span> Basic</span>
                  <span><span className={styles.legendDotDA}></span> DA</span>
                  <span><span className={styles.legendDotHRA}></span> HRA</span>
                  <span><span className={styles.legendDotTA}></span> Perks</span>
                </div>
              </div>

              {/* Itemized Official Pay Slip Table */}
              <div className={styles.slipItemBox}>
                <div>
                  <span className={styles.slipSectionHeader}>1. Allowances & Earnings (वेतन व भत्ते)</span>
                  <div className={styles.slipLineItem}>
                    <span>Basic Pay (मूळ वेतन)</span>
                    <span className={styles.slipValueBold}>₹{basicPay.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.slipLineItem}>
                    <span>Dearness Allowance ({Math.round(daRate * 100)}% DA)</span>
                    <span className={styles.slipValueBold}>₹{calculated.daAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.slipLineItem}>
                    <span>House Rent Allowance ({hasGovtQuarter ? 'Quarter Allotted' : `Class ${hraTier}`})</span>
                    <span className={styles.slipValueBold}>₹{calculated.hraAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.slipLineItem}>
                    <span>Transport Allowance (वाहतूक भत्ता + DA)</span>
                    <span className={styles.slipValueBold}>₹{calculated.totalTa.toLocaleString('en-IN')}</span>
                  </div>
                  {specialAllowance > 0 && (
                    <div className={styles.slipLineItem}>
                      <span>Special / Hardship Allowance</span>
                      <span className={styles.slipValueBold}>₹{specialAllowance.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <div className={styles.slipDivider}></div>

                <div>
                  <span className={styles.slipSectionHeaderDeduct}>2. Monthly Deductions (कपात)</span>
                  <div className={styles.slipLineItem}>
                    <span>{pensionScheme.toUpperCase()} (10% B+DA)</span>
                    <span className={styles.slipValueDeduct}>₹{calculated.employeePension.toLocaleString('en-IN')}</span>
                  </div>
                  {calculated.ptDeduction > 0 && (
                    <div className={styles.slipLineItem}>
                      <span>Professional Tax (व्यवसाय कर - PT)</span>
                      <span className={styles.slipValueDeduct}>₹{calculated.ptDeduction}</span>
                    </div>
                  )}
                  <div className={styles.slipLineItem}>
                    <span>State Group Insurance (गट विमा - GIS)</span>
                    <span className={styles.slipValueDeduct}>₹{calculated.gisDeduction}</span>
                  </div>
                  {tdsTax > 0 && (
                    <div className={styles.slipLineItem}>
                      <span>Estimated Income Tax (TDS)</span>
                      <span className={styles.slipValueDeduct}>₹{tdsTax.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Employer Contribution Tracker */}
              <div className={styles.employerCard}>
                <span className={`material-symbols-outlined ${styles.employerIcon}`}>savings</span>
                <div>
                  <div className={styles.employerTitle}>Govt Monthly Pension Addition</div>
                  <p className={styles.employerText}>
                    Govt adds <strong>₹{calculated.govtPensionContrib.toLocaleString('en-IN')} / mo</strong> ({pensionScheme === 'ups' ? '18.5% UPS' : '14% NPS'}) directly into your retirement ledger outside this take-home figure.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {/* <div className={styles.slipActionRow}>
                <button
                  type="button"
                  className={styles.btnDownloadSlip}
                  onClick={() => window.print()}
                >
                  <span className="material-symbols-outlined">print</span>
                  Print Pay Slip
                </button>
                <button
                  type="button"
                  className={styles.btnIncrement}
                  onClick={handleNextIncrement}
                >
                  <span className="material-symbols-outlined">trending_up</span>
                  +3% Step
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Printable Official Pay Slip Statement — Rendered strictly for Window Print */}
        <div className={styles.printablePaySlipContainer}>
          <div className={styles.slipPrintInner}>
            <div className={styles.slipPrintHeader}>
              <div className={styles.printEmblemText}>★ ★ ★</div>
              <div className={styles.printGovtTitle}>
                {cadre === 'maha' ? 'GOVERNMENT OF MAHARASHTRA • महाराष्ट्र शासन' : 'GOVERNMENT OF INDIA • भारत सरकार'}
              </div>
              <div className={styles.printDeptSubtitle}>
                FINANCE DEPARTMENT • 7TH CENTRAL PAY COMMISSION (CPC) PAY STATEMENT
              </div>
              <div className={styles.printCycleTitle}>
                OFFICIAL SALARY & PENSION STATEMENT FOR {new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }).toUpperCase()}
              </div>
            </div>

            <table className={styles.printMetaTable}>
              <tbody>
                <tr>
                  <td><strong>Employee / Cadre:</strong> {selectedPost.label}</td>
                  <td><strong>Pay Band Level:</strong> {selectedPost.level}</td>
                </tr>
                <tr>
                  <td><strong>Posting Classification:</strong> Class {hraTier} ({hraTier === 'X' ? '30% Metro' : hraTier === 'Y' ? '20% Urban Area' : '10% Rural District'})</td>
                  <td><strong>Dearness Allowance Rate:</strong> {Math.round(daRate * 100)}% (Post-July Revision)</td>
                </tr>
                <tr>
                  <td><strong>Retirement Security Regime:</strong> {pensionScheme === 'ups' ? 'Unified Pension Scheme (UPS)' : 'National Pension System (NPS)'}</td>
                  <td><strong>Govt Pension Contribution:</strong> {pensionScheme === 'ups' ? '18.5%' : '14%'} (₹{calculated.govtPensionContrib.toLocaleString('en-IN')} / mo)</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.printColumns}>
              <div className={styles.printCol}>
                <div className={styles.printColHeader}>1. ALLOWANCES & EARNINGS (वेतन व भत्ते)</div>
                <table className={styles.printItemTable}>
                  <tbody>
                    <tr>
                      <td>Basic Pay (मूळ वेतन)</td>
                      <td className={styles.printRight}>₹{basicPay.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Dearness Allowance ({Math.round(daRate * 100)}% DA)</td>
                      <td className={styles.printRight}>₹{calculated.daAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>House Rent Allowance (HRA Class {hraTier})</td>
                      <td className={styles.printRight}>₹{calculated.hraAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Transport Allowance (TA + DA on TA)</td>
                      <td className={styles.printRight}>₹{calculated.totalTa.toLocaleString('en-IN')}</td>
                    </tr>
                    {specialAllowance > 0 && (
                      <tr>
                        <td>Special / Hardship Allowance</td>
                        <td className={styles.printRight}>₹{specialAllowance.toLocaleString('en-IN')}</td>
                      </tr>
                    )}
                    <tr className={styles.printTotalRow}>
                      <td><strong>GROSS MONTHLY EARNINGS</strong></td>
                      <td className={styles.printRight}><strong>₹{calculated.grossSalary.toLocaleString('en-IN')}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={styles.printCol}>
                <div className={styles.printColHeaderDeduct}>2. MONTHLY DEDUCTIONS (कपात)</div>
                <table className={styles.printItemTable}>
                  <tbody>
                    <tr>
                      <td>{pensionScheme.toUpperCase()} Pension (10% B+DA)</td>
                      <td className={styles.printRight}>₹{calculated.employeePension.toLocaleString('en-IN')}</td>
                    </tr>
                    {calculated.ptDeduction > 0 && (
                      <tr>
                        <td>Professional Tax (PT - Maharashtra)</td>
                        <td className={styles.printRight}>₹{calculated.ptDeduction.toLocaleString('en-IN')}</td>
                      </tr>
                    )}
                    <tr>
                      <td>State Group Insurance Scheme (GIS)</td>
                      <td className={styles.printRight}>₹{calculated.gisDeduction.toLocaleString('en-IN')}</td>
                    </tr>
                    {tdsTax > 0 && (
                      <tr>
                        <td>Estimated Income Tax (TDS)</td>
                        <td className={styles.printRight}>₹{tdsTax.toLocaleString('en-IN')}</td>
                      </tr>
                    )}
                    {vpfSavings > 0 && (
                      <tr>
                        <td>Voluntary Provident Fund (VPF)</td>
                        <td className={styles.printRight}>₹{vpfSavings.toLocaleString('en-IN')}</td>
                      </tr>
                    )}
                    <tr className={styles.printTotalRow}>
                      <td><strong>TOTAL MONTHLY DEDUCTIONS</strong></td>
                      <td className={styles.printRight}><strong>₹{calculated.totalDeductions.toLocaleString('en-IN')}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.printNetBanner}>
              <div className={styles.printNetWordsWrap}>
                <div className={styles.printNetLabel}>NET MONTHLY TAKE-HOME (खात्यात जमा होणारे निव्वळ वेतन):</div>
                <div className={styles.printNetWords}>{numberToIndianWords(calculated.netTakeHome)}</div>
              </div>
              <div className={styles.printNetAmount}>
                ₹{calculated.netTakeHome.toLocaleString('en-IN')}
              </div>
            </div>

            <div className={styles.printRetirementBox}>
              <strong>Government Employer Pension Addition:</strong> Union/State Government credits <strong>₹{calculated.govtPensionContrib.toLocaleString('en-IN')} / month</strong> ({pensionScheme === 'ups' ? '18.5% UPS Assured Pension Model' : '14% NPS Corpus'}) directly to your permanent retirement ledger. Annual Total Net In-Hand: ₹{calculated.annualNet.toLocaleString('en-IN')} / year.
            </div>

            <div className={styles.printFooterBox}>
              <div>Certified Computer-Generated Statement • ExamUdaan.in 7th CPC Treasury Benchmark</div>
              <div>Calculated under Maharashtra State Service (Revised Pay) Rules 2019 & Central 7th CPC Pay Matrix</div>
            </div>
          </div>
        </div>

        {/* Popular Maharashtra & Central Government Pay Scale Comparison Table */}
        <section className={styles.matrixSection}>
          <div className={styles.matrixHeaderRow}>
            <div className={styles.matrixTitleWrap}>
              <span className={styles.matrixOverline}>Standard Benchmarks</span>
              <h2 className={styles.matrixTitle}>Maharashtra & Central Cadre Pay Matrix Table</h2>
              <p className={styles.matrixDesc}>
                Direct comparison of entry-level basic pay, city tier take-homes, and peak promotion ceilings across frequently contested public service examinations.
              </p>
            </div>

            <div className={styles.searchBox}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Filter post (e.g. Talathi, PSI, Deputy Collector)..."
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Cadre Filter Tabs */}
          <div className={styles.matrixFilterRow}>
            <button
              type="button"
              className={`${styles.matrixFilterBtn} ${tableCadreFilter === 'all' ? styles.matrixFilterBtnActive : ''}`}
              onClick={() => setTableCadreFilter('all')}
            >
              All Cadres ({ALL_POSTS.length})
            </button>
            <button
              type="button"
              className={`${styles.matrixFilterBtn} ${tableCadreFilter === 'group-a' ? styles.matrixFilterBtnActive : ''}`}
              onClick={() => setTableCadreFilter('group-a')}
            >
              MPSC Group A (Class 1)
            </button>
            <button
              type="button"
              className={`${styles.matrixFilterBtn} ${tableCadreFilter === 'group-b' ? styles.matrixFilterBtnActive : ''}`}
              onClick={() => setTableCadreFilter('group-b')}
            >
              MPSC Group B
            </button>
            <button
              type="button"
              className={`${styles.matrixFilterBtn} ${tableCadreFilter === 'group-c' ? styles.matrixFilterBtnActive : ''}`}
              onClick={() => setTableCadreFilter('group-c')}
            >
              Group C & Field Staff
            </button>
            <button
              type="button"
              className={`${styles.matrixFilterBtn} ${tableCadreFilter === 'central' ? styles.matrixFilterBtnActive : ''}`}
              onClick={() => setTableCadreFilter('central')}
            >
              Central Govt & Railways
            </button>
          </div>

          {/* Mobile Table Swipe Hint */}
          <div className={styles.mobileTableHint}>
            <span>👆</span> Pan horizontally to view all pay matrix columns (Entry Basic, X/Y/Z Cities, Peak)
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th>Designation / Cadre</th>
                  <th>Pay Band Level</th>
                  <th className={styles.colRight}>Entry Basic</th>
                  <th className={styles.colRight}>Class X (Mumbai)</th>
                  <th className={styles.colRight}>Class Y (Pune/Nagpur)</th>
                  <th className={styles.colRight}>Class Z (Rural)</th>
                  <th>Peak Promotion Ceiling</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatrix.map(post => {
                  const pDaRate = post.cadre === 'maha' ? 0.50 : 0.53
                  const b = post.basic
                  const daAmt = Math.round(b * pDaRate)

                  // 7th CPC Transport Allowance: Level 9+ (>= 53100) / Level 3-8 (>= 21700)
                  const taBaseHigher = b >= 35400 ? 7200 : b >= 21700 ? 3600 : 1350
                  const taBaseOther = b >= 35400 ? 3600 : b >= 21700 ? 1800 : 900
                  const taX = Math.round(taBaseHigher * (1 + pDaRate))
                  const taY = Math.round(taBaseOther * (1 + pDaRate))
                  const taZ = Math.round((taBaseOther / 2) * (1 + pDaRate))

                  const pensionDeduct = Math.round((b + daAmt) * 0.10)
                  const ptDeduct = post.cadre === 'maha' ? 200 : 0
                  const gisDeduct = b >= 53100 ? 480 : b >= 35400 ? 360 : 240

                  const xTakeHome = Math.round(b + daAmt + (b * 0.30) + taX - pensionDeduct - ptDeduct - gisDeduct)
                  const yTakeHome = Math.round(b + daAmt + (b * 0.20) + taY - pensionDeduct - ptDeduct - gisDeduct)
                  const zTakeHome = Math.round(b + daAmt + (b * 0.10) + taZ - pensionDeduct - ptDeduct - gisDeduct)

                  return (
                    <tr key={post.id} className={styles.matrixRow}>
                      <td>
                        <div className={styles.colPost}>{post.label}</div>
                        <div className={styles.colCadreSub}>{post.cadre === 'maha' ? 'Maharashtra Shasan' : 'Central Govt / UPSC'}</div>
                      </td>
                      <td>
                        <span className={styles.payBandBadge}>{post.level}</span>
                      </td>
                      <td className={styles.colRight}>₹{post.basic.toLocaleString('en-IN')}</td>
                      <td className={styles.colRightGreen}>₹{xTakeHome.toLocaleString('en-IN')}</td>
                      <td className={styles.colRight}>₹{yTakeHome.toLocaleString('en-IN')}</td>
                      <td className={styles.colRightMuted}>₹{zTakeHome.toLocaleString('en-IN')}</td>
                      <td className={styles.colPeak}>{post.peak}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Pay Matrix Cards (Screenshot 5 Fix) */}
          <div className={styles.matrixMobileCards}>
            {filteredMatrix.map(post => {
              const pDaRate = post.cadre === 'maha' ? 0.50 : 0.53
              const b = post.basic
              const daAmt = Math.round(b * pDaRate)
              const taBaseHigher = b >= 35400 ? 7200 : b >= 21700 ? 3600 : 1350
              const taBaseOther = b >= 35400 ? 3600 : b >= 21700 ? 1800 : 900
              const taX = Math.round(taBaseHigher * (1 + pDaRate))
              const taY = Math.round(taBaseOther * (1 + pDaRate))
              const taZ = Math.round((taBaseOther / 2) * (1 + pDaRate))

              const pensionDeduct = Math.round((b + daAmt) * 0.10)
              const ptDeduct = post.cadre === 'maha' ? 200 : 0
              const gisDeduct = b >= 53100 ? 480 : b >= 35400 ? 360 : 240

              const xTakeHome = Math.round(b + daAmt + (b * 0.30) + taX - pensionDeduct - ptDeduct - gisDeduct)
              const yTakeHome = Math.round(b + daAmt + (b * 0.20) + taY - pensionDeduct - ptDeduct - gisDeduct)
              const zTakeHome = Math.round(b + daAmt + (b * 0.10) + taZ - pensionDeduct - ptDeduct - gisDeduct)

              return (
                <div key={post.id} className={styles.salaryCard}>
                  <div className={styles.salaryCardTop}>
                    <div className={styles.salaryCardTitleWrap}>
                      <h4 className={styles.salaryPostTitle}>{post.label}</h4>
                      <span className={styles.salaryCadreSub}>
                        {post.cadre === 'maha' ? 'Maharashtra Shasan' : 'Central Govt / UPSC'}
                      </span>
                    </div>
                    <span className={styles.payBandBadge}>{post.level}</span>
                  </div>

                  <div className={styles.salaryBasicRow}>
                    <div className={styles.salaryBasicItem}>
                      Entry Basic: <strong>₹{post.basic.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className={styles.salaryPeakItem}>
                      Peak: <strong>{post.peak}</strong>
                    </div>
                  </div>

                  <div className={styles.salaryTierGrid}>
                    <div className={styles.salaryTierCardX}>
                      <span className={styles.salaryTierLabel}>Class X (Mumbai)</span>
                      <span className={styles.salaryTierValX}>₹{xTakeHome.toLocaleString('en-IN')}</span>
                    </div>
                    <div className={styles.salaryTierCardY}>
                      <span className={styles.salaryTierLabel}>Class Y (Pune)</span>
                      <span className={styles.salaryTierValY}>₹{yTakeHome.toLocaleString('en-IN')}</span>
                    </div>
                    <div className={styles.salaryTierCardZ}>
                      <span className={styles.salaryTierLabel}>Class Z (Rural)</span>
                      <span className={styles.salaryTierValZ}>₹{zTakeHome.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
