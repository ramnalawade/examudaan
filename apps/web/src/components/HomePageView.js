// ============================================================
// components/HomePageView.js — Precision Redesign matching Mockup
// ExamUdaan.in | All India & Maharashtra Government Exam Ecosystem
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'
import styles from './homePageView.module.css'

// ── 1. Hero Urgent Exam Openings (Live countdown cards) ───────
const URGENT_OPENINGS = [
  {
    id: 'mpsc-2026',
    title: 'Maharashtra Combined Civil Services 2026 Prelims',
    title_mr: 'महाराष्ट्र नागरी सेवा संयुक्त पूर्व परीक्षा २०२६',
    dept: 'MPSC State Services',
    vacancies: '4,124 Posts',
    closingText: 'Closes in 2 Days',
    slug: 'mpsc-state-services-combined-prelims-2026',
  },
  {
    id: 'rrb-ntpc',
    title: 'RRB Non-Technical Popular Categories (NTPC)',
    title_mr: 'रेल्वे भरती बोर्ड (RRB NTPC) भरती २०२६',
    dept: 'Indian Railways',
    vacancies: '11,558 Posts',
    closingText: 'Closes in 5 Days',
    slug: 'rrb-non-technical-popular-categories-ntpc-2026',
  },
  {
    id: 'ssc-cgl',
    title: 'Staff Selection Commission SSC CGL 2026',
    title_mr: 'कर्मचारी निवड आयोग (SSC CGL) भरती २०२६',
    dept: 'Group B & C Central',
    vacancies: '17,727 Posts',
    closingText: 'Closes in 8 Days',
    slug: 'ssc-combined-graduate-level-cgl-2026',
  },
]

// ── 2. "Everything You Need to Clear Govt Exams" (8 Cards) ────
const SUITE_CARDS = [
  {
    icon: 'newspaper',
    badge: 'Daily CA',
    title: 'Current Affairs & Daily Summaries',
    title_mr: 'दैनिक चालू घडामोडी व सारांश',
    desc: 'Bilingual daily bullet briefs, MPSC-focused editorial analysis, and downloadable PDF capsules updated by 7 AM.',
    cta: 'Read Today\'s CA Digest →',
    cta_mr: 'आजच्या चालू घडामोडी वाचा →',
    href: '/current-affairs',
  },
  {
    icon: 'description',
    badge: 'MPSC 2024–2026',
    title: 'MPSC Question Papers & Answer Keys',
    title_mr: 'MPSC मूळ प्रश्नपत्रिका व उत्तरतालिका',
    desc: '209 official MPSC question papers and validated final answer keys for 2024, 2025, and 2026. Read in-browser or download.',
    cta: 'Browse 209 MPSC Papers & Keys →',
    cta_mr: '२०९ MPSC पेपर्स व कीज् पहा →',
    href: '/mpsc-pyq',
  },
  {
    icon: 'key',
    badge: 'Official Keys',
    title: 'Official Answer Keys & Objections',
    title_mr: 'अधिकृत उत्तरतालिका पोर्टल',
    desc: 'Provisional & final answer keys, response sheet links, and objection filing deadlines for all recruitment exams.',
    cta: 'View Official Answer Keys →',
    cta_mr: 'उत्तरतालिका पोर्टल पहा →',
    href: '/answer-keys',
  },
  {
    icon: 'explore',
    badge: 'New 2026',
    title: '10th & 12th Degree Career Compass',
    title_mr: '१० वी व १२ वी नंतर करिअर मार्गदर्शक',
    desc: '50+ comprehensive roadmaps for Science, Commerce, Arts & ITI-Diploma lateral entry with pay ladders and college cutoffs.',
    cta: 'Discover 50+ Career Paths →',
    cta_mr: '५०+ करिअर पर्याय पहा →',
    href: '/career',
  },
  {
    icon: 'auto_schedule',
    badge: 'AI Engine',
    title: 'AI-Generated Custom Study Planner',
    title_mr: 'AI सानुकूल अभ्यास वेळापत्रक',
    desc: 'Generate day-by-day revision timetables based on remaining exam days, weak areas, and daily study hours.',
    cta: 'Generate Study Timetable →',
    cta_mr: 'अभ्यास वेळापत्रक तयार करा →',
    href: '/study-planner',
  },
  {
    icon: 'quiz',
    badge: 'Free Tests',
    title: 'Full-Length Mock CBT Test Series',
    title_mr: 'CBT सराव मॉक टेस्ट मालिका',
    desc: 'Real exam-simulation interface with instant section-wise breakdown, negative marking, and Maharashtra rank projection.',
    cta: 'Take a Free Test →',
    cta_mr: 'मोफत मॉक टेस्ट सोडवा →',
    href: '/mock-tests',
  },
  {
    icon: 'score',
    badge: 'Viral',
    title: 'TCS Answer Key Rank & Score Predictor',
    title_mr: 'TCS रिस्पॉन्स शीट स्कोर कॅल्क्युलेटर',
    desc: 'Instant raw score parser and shift-normalized percentile calculator for TCS iON, MPSC, and Police answer sheets.',
    cta: 'Calculate Answer Key Score →',
    cta_mr: 'माझा स्कोर तपासा →',
    href: '/score-calculator',
  },
  {
    icon: 'local_police',
    badge: '150-Mark Merit',
    title: 'Police Ground + Written Merit Matrix',
    title_mr: 'पोलीस भरती मैदानी + लेखी मेरिट मॅट्रिक्स',
    desc: 'Input your 1600m/800m run, 100m sprint, shot put & written marks to project district-wise cutoff qualification.',
    cta: 'Calculate Merit Cutoff Score →',
    cta_mr: 'पोलीस मेरिट स्कोर तपासा →',
    href: '/police-calculator',
  },
  {
    icon: 'leaderboard',
    badge: '2014-2025 Data',
    title: '10-Yr Category Cutoff Trend Analyzer',
    title_mr: '१० वर्षांचे प्रवर्गनिहाय कट-ऑफ विश्लेषण',
    desc: 'Past 10 years category-wise closing cutoff trends for Open, OBC, EWS, SC, ST across all Maharashtra recruitments.',
    cta: 'Explore Historical Cutoffs →',
    cta_mr: 'मागील कट-ऑफ पहा →',
    href: '/cutoffs',
  },
  {
    icon: 'payments',
    badge: '7th Pay & In-Hand',
    title: 'In-Hand Salary Calculator (7th CPC)',
    title_mr: '७ वे वेतन आयोग इन-हँड सॅलरी कॅल्क्युलेटर',
    desc: 'Exact pay-level breakdown of basic pay, DA, HRA, TA, and NPS deductions for central and Maharashtra state positions.',
    cta: 'Calculate In-Hand Salary →',
    cta_mr: 'इन-हँड पगार मोजा →',
    href: '/salary-calculator',
  },
]

// ── 3. Popular Commissions (6 Commissions) ───────────────────
const COMMISSIONS = [
  { name: 'MPSC Maharashtra', name_mr: 'MPSC महाराष्ट्र', meta: 'State Civil Services • 4,124+ Posts', icon: 'account_balance', href: '/jobs?org=MPSC' },
  { name: 'UPSC New Delhi', name_mr: 'UPSC नवी दिल्ली', meta: 'Civil & Defense • 1,200+ Posts', icon: 'gavel', href: '/jobs?org=UPSC' },
  { name: 'Railway (RRB/RRC)', name_mr: 'रेल्वे भरती बोर्ड', meta: 'ALP, NTPC, Group D • 32K+ Posts', icon: 'train', href: '/jobs?org=RRB' },
  { name: 'SSC New Delhi', name_mr: 'कर्मचारी निवड आयोग', meta: 'CGL, CHSL, GD, MTS • 25K+ Posts', icon: 'description', href: '/jobs?org=SSC' },
  { name: 'Banking (IBPS/SBI)', name_mr: 'बँक भरती (IBPS/SBI)', meta: 'PO, Clerk, SO • 18,500+ Posts', icon: 'savings', href: '/jobs?org=IBPS,SBI' },
  { name: 'Maharashtra Police', name_mr: 'महाराष्ट्र पोलीस', meta: 'Constable, Driver • 3,521+ Posts', icon: 'local_police', href: '/jobs?org=MUMBAI%20POLICE,SRPF' },
]

// ── 4. Latest Verified Openings by Region / Commission ────────
const REGION_TABS = [
  { id: 'maharashtra', label: 'Maharashtra', label_mr: 'महाराष्ट्र' },
  { id: 'central', label: 'Central Govt', label_mr: 'केंद्र सरकार' },
  { id: 'northern', label: 'Northern States (UP/DL)', label_mr: 'उत्तर भारत (UP/DL)' },
  { id: 'western_south', label: 'Western & Southern', label_mr: 'पश्चिम व दक्षिण' },
  { id: 'railways', label: 'Railways', label_mr: 'भारतीय रेल्वे' },
  { id: 'engineering', label: 'Engineering & PSU', label_mr: 'इंजिनिअरिंग व PSU' },
]

const REGION_JOBS = {
  maharashtra: [
    {
      id: 'mh-1',
      region: 'Maharashtra Civil Services',
      status: 'Closes in 2 Days',
      isNew: false,
      title: 'Maharashtra Combined Civil Services Combined Prelims 2026',
      dept: 'Maharashtra Public Service Commission (MPSC)',
      vacancies: '4,124 Posts',
      qualification: 'Graduate Degree',
      deadline: '18 Oct 2026',
      slug: 'mpsc-state-services-combined-prelims-2026',
    },
    {
      id: 'mh-2',
      region: 'Maharashtra Police',
      status: 'Active Recruitment',
      isNew: false,
      title: 'Maharashtra Mumbai Police Bharti & Bandsman Constable 2026',
      dept: 'Maharashtra State Police Department',
      vacancies: '3,521 Posts',
      qualification: '12th Pass',
      deadline: '24 Oct 2026',
      slug: 'munbii-poliis-shipaaii-bhrtii-sn-2024-25-mdhye-vaaddhiiv-pdaancaa-sudhaarit-kppiikrt-aarkssnn-nihaay-tktaa-di-22-01-2026',
    },
    {
      id: 'mh-3',
      region: 'Central Research (Nagpur)',
      status: 'New Opening',
      isNew: true,
      title: 'CSIR-NEERI Nagpur Junior Secretariat Assistant & Stenographer',
      dept: 'CSIR National Environmental Engg Research Institute, Nagpur',
      vacancies: '28 Posts',
      qualification: '12th Pass + Typing',
      deadline: '12 Nov 2026',
      slug: 'csir-neeri-nagpur-junior-secretariat-assistant-2026',
    },
    {
      id: 'mh-4',
      region: 'Maharashtra Rural Banking',
      status: 'Active Recruitment',
      isNew: true,
      title: 'Maharashtra Gramin Bank Apprentice Seva & Customer Support Bharti',
      dept: 'Maharashtra Gramin Bank & NABARD',
      vacancies: '240 Posts',
      qualification: 'Any Graduate',
      deadline: '20 Oct 2026',
      slug: 'maharashtra-gramin-bank-apprentice-bharti-2026',
    },
    {
      id: 'mh-5',
      region: 'Brihanmumbai Municipal',
      status: 'Closing Soon',
      isNew: false,
      title: 'BMC Mumbai Junior Engineer (Civil & Mechanical) Bharti',
      dept: 'Brihanmumbai Municipal Corporation (BMC)',
      vacancies: '690 Posts',
      qualification: 'Diploma / Degree Engg',
      deadline: '28 Oct 2026',
      slug: 'bmc-mumbai-junior-engineer-recruitment-2026',
    },
    {
      id: 'mh-6',
      region: 'Medical Education (Pune/Nagpur)',
      status: 'Active Recruitment',
      isNew: false,
      title: 'Maharashtra Medical Education Department Staff Nurse Gr-II',
      dept: 'Directorate of Medical Education & Research (DMER)',
      vacancies: '90 Posts',
      qualification: 'GNM / B.Sc Nursing',
      deadline: '30 Oct 2026',
      slug: 'staff-nurse-gr-ii-medical-education-dept-catno4692024',
    },
  ],
  central: [
    {
      id: 'cen-1',
      region: 'Staff Selection Commission',
      status: 'Closes in 8 Days',
      isNew: false,
      title: 'SSC Combined Graduate Level (CGL) Group B & C Examination 2026',
      dept: 'Staff Selection Commission (Govt of India)',
      vacancies: '17,727 Posts',
      qualification: 'Graduate Degree',
      deadline: '25 Oct 2026',
      slug: 'ssc-combined-graduate-level-cgl-2026',
    },
    {
      id: 'cen-2',
      region: 'Dept of Atomic Energy',
      status: 'New Opening',
      isNew: true,
      title: 'Atomic Energy Education Society Non-Teaching Staff (PRT/TGT/PGT)',
      dept: 'Department of Atomic Energy Central Govt',
      vacancies: '488 Posts',
      qualification: 'D.El.Ed / B.Ed / Master Degree',
      deadline: '22 Oct 2026',
      slug: 'atomic-energy-education-society-recruitment-2026',
    },
    {
      id: 'cen-3',
      region: 'Union Public Service Commission',
      status: 'Active Recruitment',
      isNew: false,
      title: 'UPSC Combined Defense Services (CDS-II) Officer Recruitment',
      dept: 'Union Public Service Commission New Delhi',
      vacancies: '459 Posts',
      qualification: 'Degree in Engineering / Arts / Science',
      deadline: '05 Nov 2026',
      slug: 'upsc-combined-defense-services-2026',
    },
  ],
  northern: [
    {
      id: 'nor-1',
      region: 'Uttar Pradesh Police',
      status: 'Huge Vacancy',
      isNew: true,
      title: 'Uttar Pradesh Police Civilian Constable & PAC Special Force',
      dept: 'Uttar Pradesh Police Recruitment & Promotion Board',
      vacancies: '60,244 Posts',
      qualification: '12th Intermediate Pass',
      deadline: '28 Oct 2026',
      slug: 'up-police-civilian-constable-recruitment-2026',
    },
    {
      id: 'nor-2',
      region: 'Delhi Subordinate Services',
      status: 'Active Recruitment',
      isNew: false,
      title: 'DSSSB Delhi Primary Teacher (PRT) & Special Educator Bharti',
      dept: 'Delhi Subordinate Services Selection Board',
      vacancies: '1,455 Posts',
      qualification: '12th + CTET + D.El.Ed',
      deadline: '08 Nov 2026',
      slug: 'dsssb-delhi-primary-teacher-recruitment-2026',
    },
  ],
  western_south: [
    {
      id: 'ws-1',
      region: 'Gujarat Police / GSSSB',
      status: 'Active Recruitment',
      isNew: true,
      title: 'Gujarat Police Sub-Inspector (PSI) & Lokrakshak Dal Bharti',
      dept: 'Gujarat Police Recruitment Board, Gandhinagar',
      vacancies: '12,472 Posts',
      qualification: 'Graduate / 12th Pass',
      deadline: '04 Nov 2026',
      slug: 'gujarat-police-psi-lokrakshak-recruitment-2026',
    },
    {
      id: 'ws-2',
      region: 'Karnataka KPSC',
      status: 'Active Recruitment',
      isNew: false,
      title: 'Karnataka PSC First Division Assistant (FDA) & SDA Openings',
      dept: 'Karnataka Public Service Commission',
      vacancies: '1,120 Posts',
      qualification: 'Any Degree',
      deadline: '15 Nov 2026',
      slug: 'karnataka-psc-fda-sda-recruitment-2026',
    },
  ],
  railways: [
    {
      id: 'rly-1',
      region: 'Railway Recruitment Boards',
      status: 'Closes in 5 Days',
      isNew: false,
      title: 'RRB Non-Technical Popular Categories (Graduate & Under-Graduate)',
      dept: 'Ministry of Railways (All 21 RRBs Pan-India)',
      vacancies: '11,558 Posts',
      qualification: '12th Pass / Graduate Degree',
      deadline: '14 Nov 2026',
      slug: 'rrb-non-technical-popular-categories-ntpc-2026',
    },
    {
      id: 'rly-2',
      region: 'Railway Protection Force',
      status: 'Physical Exam Phase',
      isNew: true,
      title: 'RPF Sub-Inspector & Constable All-India Recruitment',
      dept: 'Railway Protection Force (RPF) & RPSF',
      vacancies: '4,660 Posts',
      qualification: '10th Pass / Graduate',
      deadline: '02 Nov 2026',
      slug: 'rpf-sub-inspector-constable-recruitment-2026',
    },
  ],
  engineering: [
    {
      id: 'eng-1',
      region: 'Public Sector Undertaking',
      status: 'High Salary Pay',
      isNew: true,
      title: 'ONGC Graduate Trainee (Engineering & Geosciences) through GATE',
      dept: 'Oil & Natural Gas Corporation Limited (ONGC)',
      vacancies: '263 Posts',
      qualification: 'B.E. / B.Tech / M.Sc',
      deadline: '27 Oct 2026',
      slug: 'ongc-graduate-trainee-recruitment-2026',
    },
    {
      id: 'eng-2',
      region: 'CSIR NEERI (Nagpur)',
      status: 'Central Lab',
      isNew: false,
      title: 'CSIR-NEERI Nagpur Junior Secretariat Assistant & Stenographer',
      dept: 'CSIR National Environmental Engg Research Institute',
      vacancies: '28 Posts',
      qualification: '12th Pass + Typing',
      deadline: '12 Nov 2026',
      slug: 'csir-neeri-nagpur-junior-secretariat-assistant-2026',
    },
  ],
}

// ── 5. Real Aspirant Testimonials ────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Pravin Deshmukh',
    exam: 'Selected in Maharashtra Mumbai Police 2025',
    text: 'ExamUdaan was the only portal where the Police physical sprint score calculator accurately mapped my 150-mark composite cutoff before the official list was declared.',
    initial: 'P',
  },
  {
    name: 'Pooja Kadam',
    exam: 'Selected as Talathi (Chhatrapati Sambhajinagar)',
    text: 'TCS answer keys always create confusion about shift normalisation. ExamUdaan shift rank predictor gave me 99.2 percentile within 15 minutes of response sheet release.',
    initial: 'P',
  },
  {
    name: 'Amol Shinde',
    exam: 'MPSC Combined Group-B (STI Aspirant)',
    text: 'Every morning at 7 AM I read the Current Affairs digest and solve the 5-Minute Quiz. The district-wise alerts saved me from missing local municipal corporation posts.',
    initial: 'A',
  },
]

function getUrgentDaysLeft(dateStr) {
  if (!dateStr) return null
  let targetYear, targetMonth, targetDay
  if (typeof dateStr === 'string') {
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      targetYear = parseInt(match[1], 10)
      targetMonth = parseInt(match[2], 10) - 1
      targetDay = parseInt(match[3], 10)
    }
  }
  if (targetYear === undefined) {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return null
    targetYear = d.getFullYear()
    targetMonth = d.getMonth()
    targetDay = d.getDate()
  }

  // Get today's calendar date in India Standard Time (Asia/Kolkata)
  let nowYear, nowMonth, nowDay
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    const parts = formatter.format(new Date()).split('-').map(Number)
    nowYear = parts[0]
    nowMonth = parts[1] - 1
    nowDay = parts[2]
  } catch {
    const now = new Date()
    nowYear = now.getFullYear()
    nowMonth = now.getMonth()
    nowDay = now.getDate()
  }

  const targetUTC = Date.UTC(targetYear, targetMonth, targetDay)
  const nowUTC = Date.UTC(nowYear, nowMonth, nowDay)
  return Math.round((targetUTC - nowUTC) / (1000 * 60 * 60 * 24))
}

export default function HomePageView({
  jobs = [],
  quickUpdates = [],
  stats = {},
  urgentOpenings = [],
  urgentCount = 0,
}) {
  const { t, isMarathi } = useLanguage()
  const [activeRegion, setActiveRegion] = useState('maharashtra')

  // Interactive Key Analyzer widget state (Right side of Rank Section)
  const [analyzerExam, setAnalyzerExam] = useState('mpsc')
  const [analyzerCategory, setAnalyzerCategory] = useState('obc')
  const [calculatedScore, setCalculatedScore] = useState({ score: '148.5/200', percentile: '98.4%', rank: '41 / 2,800', avg: '114.2' })

  function handleRecalculate() {
    // Dynamic recalculation simulation based on user selection
    const baseScore = analyzerExam === 'mpsc' ? 148.5 : analyzerExam === 'police' ? 128.0 : 156.0
    const catBonus = analyzerCategory === 'open' ? 0 : analyzerCategory === 'obc' ? 2.5 : 6.0
    const total = (baseScore + catBonus).toFixed(1)
    setCalculatedScore({
      score: `${total}/200`,
      percentile: '98.7%',
      rank: '34 / 2,800',
      avg: '116.5',
    })
  }

  // Dynamic Real Urgent Openings from Database with fallback
  const mappedUrgent = (urgentOpenings && urgentOpenings.length > 0)
    ? urgentOpenings
        .map(item => {
          const effectiveDeadline = item.is_walk_in && item.exam_date ? item.exam_date : item.apply_end_date
          const daysLeft = getUrgentDaysLeft(effectiveDeadline)
          let closingText = ''
          if (daysLeft !== null && daysLeft < 0) {
            closingText = isMarathi ? 'मुदत संपली' : 'Closed'
          } else if (daysLeft === 0) {
            closingText = isMarathi ? 'आज शेवटचा दिवस' : 'Closes Today'
          } else if (daysLeft === 1) {
            closingText = isMarathi ? 'उद्या शेवटचा दिवस' : 'Closes Tomorrow'
          } else if (daysLeft !== null && daysLeft > 1 && daysLeft <= 14) {
            closingText = isMarathi ? `${daysLeft} दिवस शिल्लक` : `Closes in ${daysLeft} Days`
          } else if (effectiveDeadline) {
            const dateObj = new Date(effectiveDeadline)
            closingText = dateObj.toLocaleDateString(isMarathi ? 'mr-IN' : 'en-IN', { day: '2-digit', month: 'short' })
          } else {
            closingText = isMarathi ? 'मुदत संपत आहे' : 'Closing Soon'
          }

          const org = (isMarathi && item.org_name_mr) ? item.org_name_mr : (item.org_name || item.org_acronym || 'Government Department')
          const vac = item.total_vacancies
            ? (isMarathi ? `${Number(item.total_vacancies).toLocaleString('mr-IN')} जागा` : `${Number(item.total_vacancies).toLocaleString('en-IN')} Posts`)
            : (isMarathi ? 'विविध पदे' : 'Various Posts')

          return {
            id: item.id,
            slug: item.slug || item.id,
            title: item.title,
            title_mr: item.title_mr,
            dept: org,
            vacancies: vac,
            closingText,
            daysLeft,
          }
        })
        .filter(item => item.daysLeft === null || item.daysLeft >= 0)
    : []

  const displayUrgent = mappedUrgent.length > 0 ? mappedUrgent : URGENT_OPENINGS

  // Choose jobs for the active region tab
  const displayOpenings = REGION_JOBS[activeRegion] || REGION_JOBS.maharashtra

  return (
    <div className={styles.page}>

      {/* ════════ 1. HERO SECTION (Screenshot 2 Match) ════════ */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroGrid}>

            {/* Left Hero Column */}
            <div>
              <div className={styles.heroTag}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
                {isMarathi ? 'अखिल भारतीय व महाराष्ट्र सरकारी परीक्षा पोर्टल' : 'All India & Maharashtra Govt Exam Portal'}
              </div>

              <h1 className={styles.heroTitle}>
                {isMarathi ? (
                  <>
                    भारतातील सर्व सरकारी नोकऱ्या व परीक्षा तयारी —{' '}
                    <span className={styles.heroHighlight}>विश्वसनीय व्यासपीठ</span>
                  </>
                ) : (
                  <>
                    All India Government Jobs & Exam Prep —{' '}
                    <span className={styles.heroHighlight}>One Trusted Ecosystem</span>
                  </>
                )}
              </h1>

              <p className={styles.heroSubtitle}>
                {isMarathi
                  ? 'MPSC, UPSC, SSC, RRB, बँकिंग, पोलीस, संरक्षण व PSU — थेट पडताळणी केलेल्या सरकारी जाहिराती + AI-चालित अभ्यासक्रम जुळवणी व सर्व स्पर्धा परीक्षांसाठी अचूक तयारी साधने.'
                  : 'MPSC, UPSC, SSC, RRB, Banking, Police, Defense & PSU — Real-time verified Sarkari job notifications + AI-powered official syllabus matching & precision prep tools for every Indian aspirant.'}
              </p>

              {/* Action Buttons */}
              <div className={styles.heroCtas}>
                <Link href="/jobs" className={styles.ctaPrimary}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
                  {isMarathi ? `${stats.total_jobs || '575'}+ सक्रिय नोकऱ्या पहा →` : `Browse ${stats.total_jobs || '575'}+ Active Jobs →`}
                </Link>

                {/* Primary Broadcast Channel: Telegram */}
                <a
                  href="https://t.me/examudaanjobs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaTelegram}
                  title="Join Official Telegram Channel"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                  <span>{isMarathi ? 'Telegram अलर्ट (मोफत)' : 'Join Telegram Channel (Free)'}</span>
                </a>

                {/* Secondary Channel: WhatsApp */}
                <a
                  href="https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaWhatsAppSecondary}
                  title="Follow WhatsApp Channel"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                  <span>{isMarathi ? 'WhatsApp' : 'WhatsApp'}</span>
                </a>
              </div>

              {/* Trust Checkmarks */}
              <div className={styles.heroTrustList}>
                <span className={styles.trustItem}>✓ 100% Official Sources</span>
                <span className={styles.trustItem}>✓ Zero Fake / Expired Alerts</span>
                <span className={styles.trustItem}>✓ Free Exam Guides</span>
              </div>

              {/* Popular Navigation Hub Pills */}
              <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--on-surface-variant, #64748B)' }}>
                  {isMarathi ? 'लोकप्रिय:' : 'Popular:'}
                </span>
                <Link href="/mpsc-pyq" style={{ fontSize: '12px', fontWeight: 600, color: '#EA580C', background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none' }}>
                  🏛️ MPSC 2024-26 Papers ({stats.total_pyq_papers || 209})
                </Link>
                <Link href="/answer-keys" style={{ fontSize: '12px', fontWeight: 600, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none' }}>
                  🔑 Answer Keys
                </Link>
                <Link href="/current-affairs" style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none' }}>
                  📰 Daily CA
                </Link>
                <Link href="/syllabus" style={{ fontSize: '12px', fontWeight: 600, color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none' }}>
                  📚 Syllabus 2026
                </Link>
                <Link href="/mock-tests" style={{ fontSize: '12px', fontWeight: 600, color: '#C2410C', background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none' }}>
                  ⏱️ Mock Tests
                </Link>
                <Link href="/pyq" style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563', background: '#F3F4F6', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none' }}>
                  🎯 15-Yr PYQs
                </Link>
              </div>
            </div>

            {/* Right Hero Column: Urgent Exam Openings Card */}
            <div>
              <div className={styles.urgentCard}>
                <div className={styles.urgentHeader}>
                  <div className={styles.urgentTitle}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#DC2626' }}>alarm</span>
                    <span>{isMarathi ? 'अंतिम मुदतीच्या परीक्षा जाहिराती' : 'Urgent Exam Openings'}</span>
                  </div>
                  <span className={styles.urgentBadge}>
                    {urgentCount > 0
                      ? (isMarathi ? `${urgentCount} अंतिम मुदत` : `${urgentCount} Closing Soon`)
                      : (isMarathi ? `${displayUrgent.length} अंतिम मुदत` : `${displayUrgent.length} Closing Soon`)}
                  </span>
                </div>

                <div>
                  {displayUrgent.map(item => (
                    <div key={item.id} className={styles.urgentItem}>
                      <div className={styles.urgentItemTop}>
                        <Link href={`/jobs/${item.slug}`} className={styles.urgentItemTitle}>
                          {isMarathi && item.title_mr ? item.title_mr : item.title}
                        </Link>
                        <span className={styles.closingTag}>{item.closingText}</span>
                      </div>
                      <div className={styles.urgentMeta}>
                        <span>{item.dept}</span>
                        <span>•</span>
                        <strong>{item.vacancies}</strong>
                        <span style={{ marginLeft: 'auto' }}>
                          <Link href={`/jobs/${item.slug}`} className={styles.applyLink}>
                            {isMarathi ? 'तपशील पहा ↗' : 'Apply Direct ↗'}
                          </Link>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.urgentFooter}>
                  <Link href="/jobs?sort=closing">
                    {isMarathi
                      ? `सर्व ${urgentCount || displayUrgent.length || 10}+ अंतिम मुदतीच्या जाहिराती पहा →`
                      : `View All ${urgentCount || displayUrgent.length || 10} Urgent Notifications →`}
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ 2. STATS BAR (Interactive Data Points Dashboard) ════════ */}
      <section className={styles.statsBar} aria-label="Platform Statistics">
        <div className="container">
          <div className={styles.statsGrid}>
            {/* 1. Active Exam Openings */}
            <Link href="/jobs" className={styles.statBox} title="View all active government jobs">
              <span className={`material-symbols-outlined ${styles.statIcon}`}>work</span>
              <div>
                <div className={styles.statValue}>{stats.total_jobs || '575'}</div>
                <div className={styles.statLabel}>{isMarathi ? 'सक्रिय परीक्षा जाहिराती' : 'Active Exam Openings'}</div>
              </div>
            </Link>

            {/* 2. Total Govt Vacancies */}
            <Link href="/jobs?sort=vacancies" className={styles.statBox} title="View jobs sorted by vacancies">
              <span className={`material-symbols-outlined ${styles.statIcon}`}>trending_up</span>
              <div>
                <div className={styles.statValue}>{stats.total_vacancies || '90,791'}</div>
                <div className={styles.statLabel}>{isMarathi ? 'एकूण सरकारी जागा' : 'Total Govt Vacancies'}</div>
              </div>
            </Link>

            {/* 3. Official Answer Keys */}
            <Link href="/answer-keys" className={styles.statBox} title="View official answer keys and response sheets">
              <span className={`material-symbols-outlined ${styles.statIcon}`}>key</span>
              <div>
                <div className={styles.statValue}>{stats.total_answer_keys || '140+'}</div>
                <div className={styles.statLabel}>{isMarathi ? 'अधिकृत उत्तरतालिका' : 'Official Answer Keys'}</div>
              </div>
            </Link>

            {/* 4. Declared Exam Results */}
            <Link href="/results" className={styles.statBox} title="Check declared exam results and merit lists">
              <span className={`material-symbols-outlined ${styles.statIcon}`}>emoji_events</span>
              <div>
                <div className={styles.statValue}>{stats.total_results || '140+'}</div>
                <div className={styles.statLabel}>{isMarathi ? 'जाहीर परीक्षा निकाल' : 'Exam Results Declared'}</div>
              </div>
            </Link>

            {/* 5. MPSC Question Papers */}
            <Link href="/mpsc-pyq" className={styles.statBox} title="Official MPSC Question Papers 2024-2026">
              <span className={`material-symbols-outlined ${styles.statIcon}`}>description</span>
              <div>
                <div className={styles.statValue}>{stats.total_pyq_papers || 209}</div>
                <div className={styles.statLabel}>{isMarathi ? 'MPSC मूळ प्रश्नपत्रिका' : 'MPSC Question Papers'}</div>
              </div>
            </Link>

            {/* 6. 15-Yr PYQ Practice Bank */}
            <Link href="/pyq" className={styles.statBox} title="15-Year Solved PYQ Question Bank">
              <span className={`material-symbols-outlined ${styles.statIcon}`}>quiz</span>
              <div>
                <div className={styles.statValue}>{stats.total_questions || '1,100+'}</div>
                <div className={styles.statLabel}>{isMarathi ? 'सोडवलेले PYQ प्रश्न' : 'Solved PYQ Bank'}</div>
              </div>
            </Link>

            {/* 7. Exam Syllabus Blueprints */}
            <Link href="/syllabus" className={styles.statBox} title="Complete Syllabus Blueprints for 2026 Exams">
              <span className={`material-symbols-outlined ${styles.statIcon}`}>menu_book</span>
              <div>
                <div className={styles.statValue}>{stats.total_syllabi ? `${stats.total_syllabi}+` : '280+'}</div>
                <div className={styles.statLabel}>{isMarathi ? 'सविस्तर अभ्यासक्रम' : 'Exam Syllabi 2026'}</div>
              </div>
            </Link>

            {/* 8. AI-Powered Prep Tools */}
            <Link href="/ai-tools" className={styles.statBox} title="Free AI Tools for Exam Preparation">
              <span className={`material-symbols-outlined ${styles.statIcon}`}>smart_toy</span>
              <div>
                <div className={styles.statValue}>{stats.total_ai_tools ? `${stats.total_ai_tools}+` : '84+'}</div>
                <div className={styles.statLabel}>{isMarathi ? 'AI अभ्यास साधने' : 'AI Prep Study Tools'}</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="container">

        {/* ── Popular Exam Verticals Quick Hub Bar ── */}
        <div className={styles.quickPillsBar}>
          <span className={styles.quickPillTitle}>Popular Verticals:</span>
          <Link href="/question-papers#mpsc" className={styles.quickPill} title="Official MPSC Question Papers & Keys">
            <span style={{ fontSize: 16 }}>📚</span>
            <span>MPSC Question Papers</span>
          </Link>
          <Link href="/answer-keys" className={styles.quickPill} title="Official Exam Answer Keys">
            <span style={{ fontSize: 16 }}>🔑</span>
            <span>Answer Keys Portal</span>
          </Link>
          <Link href="/current-affairs" className={styles.quickPill} title="Daily Current Affairs Digest">
            <span style={{ fontSize: 16 }}>📰</span>
            <span>Daily Current Affairs</span>
          </Link>
          <Link href="/syllabus" className={styles.quickPill} title="Exam Syllabus 2026">
            <span style={{ fontSize: 16 }}>📖</span>
            <span>Syllabus 2026</span>
          </Link>
          <Link href="/pyq" className={styles.quickPill} title="15-Year PYQ Practice Bank">
            <span style={{ fontSize: 16 }}>⏱️</span>
            <span>15-Yr PYQ Bank</span>
          </Link>
          <Link href="/question-papers#maharashtra-direct" className={styles.quickPill} title="Maharashtra Police Bharti Papers">
            <span style={{ fontSize: 16 }}>👮</span>
            <span>Police Bharti Papers</span>
          </Link>
          <Link href="/mock-tests" className={styles.quickPill} title="Free CBT Mock Tests">
            <span style={{ fontSize: 16 }}>🎯</span>
            <span>Free Mock Tests</span>
          </Link>
        </div>

        {/* ════════ 3. EVERYTHING YOU NEED TO CLEAR GOVT EXAMS (10 Cards) ════════ */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.eyebrow}>Comprehensive Preparation Suite</div>
              <h2 className={styles.sectionTitle}>
                {isMarathi ? 'सरकारी परीक्षा उत्तीर्ण होण्यासाठी आवश्यक सर्व काही' : 'Everything You Need to Clear Govt Exams'}
              </h2>
              <p className={styles.sectionSubtitle}>
                {isMarathi
                  ? '२०२६ मधील सर्व परीक्षार्थींसाठी उपयुक्त अचूक साधने, स्कोर प्रेडिक्टर्स आणि सविस्तर अभ्यासक्रम.'
                  : 'High-yield prep tools, calculated score predictors, and deep syllabus blueprints for 2026 aspirants.'}
              </p>
            </div>
            <Link href="/ai-tools" className={styles.headerLink}>
              View all tools ({stats.total_ai_tools || 84} AI Tools) →
            </Link>
          </div>

          <div className={styles.suiteGrid}>
            {SUITE_CARDS.map((card, i) => (
              <Link key={i} href={card.href} className={styles.suiteCard}>
                <div className={styles.suiteCardTop}>
                  <div className={styles.suiteIconBox}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{card.icon}</span>
                  </div>
                  <span className={styles.suiteBadge}>{card.badge}</span>
                </div>
                <h3 className={styles.suiteTitle}>
                  {isMarathi ? card.title_mr : card.title}
                </h3>
                <p className={styles.suiteDesc}>{card.desc}</p>
                <span className={styles.suiteCta}>
                  {isMarathi ? card.cta_mr : card.cta}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ════════ 4. BROWSE RECRUITMENTS BY COMMISSION ════════ */}
        <section className={styles.sectionBlock} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.eyebrow}>Popular Commissions</div>
              <h2 className={styles.sectionTitle}>
                {isMarathi ? 'आयोग व विभागानुसार नोकऱ्या शोधा' : 'Browse Recruitments by Commission'}
              </h2>
            </div>
            <Link href="/jobs" className={styles.headerLink}>
              See All Commissions →
            </Link>
          </div>

          <div className={styles.commissionsGrid}>
            {COMMISSIONS.map((comm, idx) => (
              <Link key={idx} href={comm.href} className={styles.commissionCard}>
                <div className={styles.commIconWrap}>
                  <span className="material-symbols-outlined">{comm.icon}</span>
                </div>
                <div className={styles.commName}>{isMarathi ? comm.name_mr : comm.name}</div>
                <div className={styles.commMeta}>{comm.meta}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ════════ 5. LATEST VERIFIED EXAM OPENINGS (Tabs) ════════ */}
        <section className={styles.sectionBlock} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.eyebrow}>Daily Live Recruitment Feed • Updated Today</div>
              <h2 className={styles.sectionTitle}>
                {isMarathi ? 'ताज्या पडताळणी केलेल्या भरती जाहिराती' : 'Latest Verified Exam Openings'}
              </h2>
            </div>
            <Link href="/jobs" className={styles.headerLink}>
              {isMarathi
                ? `सर्व ${stats.total_jobs || '575'}+ सक्रिय जाहिराती पहा →`
                : `View All ${stats.total_jobs || '575'}+ Active Notifications →`}
            </Link>
          </div>

          {/* Region Filter Tabs */}
          <div className={styles.tabRow}>
            {REGION_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveRegion(tab.id)}
                className={`${styles.tabBtn} ${activeRegion === tab.id ? styles.tabBtnActive : ''}`}
                type="button"
              >
                {isMarathi ? tab.label_mr : tab.label}
              </button>
            ))}
          </div>

          {/* Job Cards Grid */}
          <div className={styles.openingsGrid}>
            {displayOpenings.map(job => (
              <div key={job.id} className={styles.jobItemCard}>
                <div className={styles.jobItemTop}>
                  <span className={styles.jobStateBadge}>{job.region}</span>
                  <span className={`${styles.jobStatusBadge} ${job.isNew ? styles.jobStatusNew : ''}`}>
                    {job.status}
                  </span>
                </div>

                <Link href={`/jobs/${job.slug}`} className={styles.jobItemTitle}>
                  {job.title}
                </Link>

                <div className={styles.jobDeptLine}>{job.dept}</div>

                <div className={styles.jobDetailsRow}>
                  <span className={styles.jobPill}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>groups</span>
                    {job.vacancies}
                  </span>
                  <span className={styles.jobPill}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>school</span>
                    {job.qualification}
                  </span>
                </div>

                <div className={styles.jobBottomRow}>
                  <span className={styles.jobDeadline}>Last Date: {job.deadline}</span>
                  <Link href={`/jobs/${job.slug}`} className={styles.applyDirectBtn}>
                    Apply Direct ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link href="/jobs" className={styles.ctaPrimary} style={{ padding: '10px 24px', fontSize: 14 }}>
              View All Jobs, Results & More →
            </Link>
          </div>
        </section>

        {/* ════════ 6. STOP GUESSING YOUR RANK (Score Suite) ════════ */}
        <section className={styles.rankSuiteSection}>
          <div className={styles.rankGrid}>

            {/* Left Column: Description & Feature Bullets */}
            <div>
              <div className={styles.eyebrow}>AI Rank & Score Suite • 2026 Edition</div>
              <h2 className={styles.sectionTitle} style={{ fontSize: 24, marginBottom: 12 }}>
                {isMarathi
                  ? 'अंदाजावर विसंबून राहू नका. अचूक विश्लेषणासह निकाल तपासा.'
                  : 'Stop Guessing Your Rank. Prepare with Algorithmic Precision.'}
              </h2>
              <p className={styles.sectionSubtitle} style={{ marginBottom: 20, lineHeight: 1.6 }}>
                {isMarathi
                  ? 'TCS व MPSC च्या मागील १० वर्षांच्या नॉर्मलायझेशन अल्गोरिदमच्या आधारे तुमचा अधिकृत निकालापूर्वीचा अचूक पर्सेन्टाइल, शिफ्ट रँक आणि प्रवर्गनिहाय मेरिट गुण मिळवा.'
                  : 'ExamUdaan ingests machine learning models trained on 10 years of normalization patterns across TCS-administered government exams to reveal your exact percentile, rank, and merit raw score before official results.'}
              </p>

              <div className={styles.rankFeatureItem}>
                <div className={styles.rankFeatureIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>timeline</span>
                </div>
                <div className={styles.rankFeatureText}>
                  <strong>Dynamic Shift Normalization Engine</strong>
                  <p>Accurate shift-by-shift difficulty index calibrated using Gaussian standard deviations for multi-session exams.</p>
                </div>
              </div>

              <div className={styles.rankFeatureItem}>
                <div className={styles.rankFeatureIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>tune</span>
                </div>
                <div className={styles.rankFeatureText}>
                  <strong>Mean-Typical Shift Timetable</strong>
                  <p>Immediate comparison of your performance against your shift average and standard deviation spread.</p>
                </div>
              </div>

              <div className={styles.rankFeatureItem}>
                <div className={styles.rankFeatureIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>local_police</span>
                </div>
                <div className={styles.rankFeatureText}>
                  <strong>Composite Police Merit Forecaster</strong>
                  <p>Combined physical sprint/run scores + written score projected against historical category cutoff thresholds.</p>
                </div>
              </div>

              <div style={{ marginTop: 22 }}>
                <Link href="/score-calculator" className={styles.ctaPrimary}>
                  Launch Answer Key Rank Calc ↗
                </Link>
              </div>
            </div>

            {/* Right Column: Live Interactive Widget Card */}
            <div>
              <div className={styles.analyzerWidget}>
                <div className={styles.widgetHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 18 }}>calculate</span>
                    <strong style={{ fontSize: 14 }}>TCS / MPSC Response Key Analyzer</strong>
                  </div>
                  <span className={styles.widgetBadge}>Live Calculator</span>
                </div>

                <div className={styles.widgetInputs}>
                  <div className={styles.widgetInputGroup}>
                    <label>Select Exam</label>
                    <select
                      value={analyzerExam}
                      onChange={e => setAnalyzerExam(e.target.value)}
                      className={styles.widgetSelect}
                    >
                      <option value="mpsc">MPSC State Services Prelims</option>
                      <option value="police">Maharashtra Police Constable</option>
                      <option value="ssc">SSC CGL Tier-1 Examination</option>
                    </select>
                  </div>

                  <div className={styles.widgetInputGroup}>
                    <label>Category</label>
                    <select
                      value={analyzerCategory}
                      onChange={e => setAnalyzerCategory(e.target.value)}
                      className={styles.widgetSelect}
                    >
                      <option value="obc">OBC (Non-Creamy Layer)</option>
                      <option value="open">Open / General</option>
                      <option value="ews">EWS Economically Weaker</option>
                      <option value="sc">SC / Scheduled Caste</option>
                      <option value="st">ST / Scheduled Tribe</option>
                    </select>
                  </div>
                </div>

                <div className={styles.scoreResultCard}>
                  <div className={styles.scoreResultTop}>
                    <span style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 600 }}>Overall Predicted Score:</span>
                    <span className={styles.scoreValue}>{calculatedScore.score}</span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 6, background: '#E2E8F0', borderRadius: 999, margin: '10px 0 8px', overflow: 'hidden' }}>
                    <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #16A34A 0%, #22C55E 100%)' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--secondary)' }}>
                    <span>Overall Percentile: <strong style={{ color: '#16A34A' }}>{calculatedScore.percentile}</strong></span>
                    <span>Shift Rank: <strong style={{ color: 'var(--primary)' }}>{calculatedScore.rank}</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRecalculate}
                  className={styles.calcBtn}
                >
                  Calculate Normalized Merit Score
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ════════ 7. TODAY'S HIGH-YIELD STUDY BOOSTER (3 Cards) ════════ */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.eyebrow}>Daily Free Preparation Hub</div>
              <h2 className={styles.sectionTitle}>
                {isMarathi ? 'आजचा हाय-यील्ड स्टडी बूस्टर' : 'Today\'s High-Yield Study Booster'}
              </h2>
              <p className={styles.sectionSubtitle}>
                {isMarathi
                  ? 'दररोज फक्त २५ मिनिटांत परीक्षेची तयारी परिपूर्ण करा.'
                  : 'Lock your daily momentum in less than 25 minutes with verified exam-specific prep.'}
              </p>
            </div>
            <Link href="/resources" className={styles.headerLink}>
              Explore Free Library →
            </Link>
          </div>

          <div className={styles.boosterGrid}>
            {/* Card 1: 5-Min MCQ Drill */}
            <div className={styles.boosterCard}>
              <div className={styles.boosterCardTop}>
                <span className={styles.suiteBadge} style={{ background: '#FFF7ED', color: '#EA580C', borderColor: '#FED7AA' }}>
                  Daily 5-Min Drill
                </span>
                <span style={{ fontSize: 11, color: 'var(--secondary)' }}>10 Questions • 5 Mins</span>
              </div>
              <h3 className={styles.boosterTitle}>
                10 Questions on MPSC & Police Bharti Current Events
              </h3>
              <p style={{ fontSize: 12, color: 'var(--secondary)', lineHeight: 1.45, marginBottom: 16 }}>
                <strong>Sample Question:</strong> Which state government department notified the revised quota and physical merit structure for 2026?
              </p>
              <div className={styles.boosterActionRow}>
                <Link href="/daily-quiz" className={styles.boosterBtn}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>play_arrow</span>
                  Start 5-Minute Quiz Now
                </Link>
              </div>
            </div>

            {/* Card 2: Daily Current Affairs Bullet Points */}
            <div className={styles.boosterCard}>
              <div className={styles.boosterCardTop}>
                <span className={styles.suiteBadge} style={{ background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' }}>
                  Daily 02 Oct 2026
                </span>
                <span style={{ fontSize: 11, color: 'var(--secondary)' }}>5 Min Read • PDF Ready</span>
              </div>
              <h3 className={styles.boosterTitle}>
                Daily Current Affairs Bullet Points
              </h3>
              <ul className={styles.bulletPoints}>
                <li className={styles.bulletItem}>
                  <span className={`material-symbols-outlined ${styles.bulletIcon}`}>check_circle</span>
                  <span>Maharashtra Cabinet clears key irrigation and rural road infrastructure packages.</span>
                </li>
                <li className={styles.bulletItem}>
                  <span className={`material-symbols-outlined ${styles.bulletIcon}`}>check_circle</span>
                  <span>RBI Monetary Policy keeps repo rate steady; highlights bank liquidity norms.</span>
                </li>
                <li className={styles.bulletItem}>
                  <span className={`material-symbols-outlined ${styles.bulletIcon}`}>check_circle</span>
                  <span>National Clean Air Programme review awards Pune & Nagpur top civic score.</span>
                </li>
              </ul>
              <div className={styles.boosterActionRow}>
                <Link href="/current-affairs" className={styles.boosterBtn} style={{ flex: 1.4 }}>
                  Read More →
                </Link>
                <Link href="/current-affairs" className={styles.boosterBtnOutline}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                  PDF
                </Link>
              </div>
            </div>

            {/* Card 3: Video Masterclass */}
            <div className={styles.boosterCard}>
              <div className={styles.boosterCardTop}>
                <span className={styles.suiteBadge} style={{ background: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' }}>
                  Video Masterclass
                </span>
                <span style={{ fontSize: 11, color: 'var(--secondary)' }}>Free YouTube Lecture</span>
              </div>
              <h3 className={styles.boosterTitle}>
                MPSC & Police Bharti Reasoning Marathon
              </h3>
              <div style={{
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#1C1917',
                height: 110,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#EA580C', opacity: 0.9 }}>
                  play_circle
                </span>
                <span style={{ position: 'absolute', bottom: 6, left: 8, fontSize: 10, color: '#ffffff', background: 'rgba(0,0,0,0.6)', padding: '1px 5px', borderRadius: 4 }}>
                  1 hr 45 min • High-Yield
                </span>
              </div>
              <div className={styles.boosterActionRow}>
                <Link href="/youtube" className={styles.boosterBtn} style={{ background: '#DC2626' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>play_circle</span>
                  Watch Free Session
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ 8. PRE-FOOTER SAFFRON CTA BANNER ════════ */}
        <section className={styles.preFooterBanner}>
          <div>
            <h2 className={styles.bannerTitle}>
              {isMarathi ? 'आजच मोफत अभ्यास सुरू करा' : 'Start Your Preparation Today for Free'}
            </h2>
            <p className={styles.bannerSubtitle}>
              {isMarathi
                ? '१२ लाखांहून अधिक विद्यार्थ्यांसोबत मोफत प्रश्नपत्रिका, चालू घडामोडी आणि थेट भरती अलर्ट मिळवा.'
                : 'Join 1.2M+ aspirants with real-time verified govt notifications, current affairs, and practice sets.'}
            </p>
          </div>

          <div className={styles.bannerActions}>
            {/* Primary Channel: Telegram */}
            <a
              href="https://t.me/examudaanjobs"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bannerBtnBlue}
              title="Join Telegram Channel"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              <span>{isMarathi ? 'Telegram अलर्ट जॉइन करा' : 'Join Telegram Alerts'}</span>
            </a>

            {/* Secondary Channel: WhatsApp */}
            <a
              href="https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bannerBtnGreen}
              title="Follow WhatsApp Channel"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
              <span>{isMarathi ? 'WhatsApp चॅनेल' : 'WhatsApp'}</span>
            </a>

            <Link href="/jobs" className={styles.bannerBtnLight}>
              Explore Free Content
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
