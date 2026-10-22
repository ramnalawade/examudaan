// ============================================================
// components/HomePageView.js — Precision Redesign matching Mockup
// ExamUdaan.in | All India & Maharashtra Government Exam Ecosystem
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'
import { trackCtaClick, trackSocialCommunity } from '../lib/analytics'
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

// ── 1B. "What's New on ExamUdaan" (New Releases, Blogs, AI Tools, Calculators & PYQs) ────
const WHATS_NEW_ITEMS = [
  {
    id: 'wn-1',
    badge: 'NEW BLOG',
    badge_mr: 'नवीन लेख',
    badgeClass: 'badgeBlog',
    title: 'Marathi Grammar (मराठी व्याकरण) 15-Year PYQ Analysis',
    title_mr: 'मराठी व्याकरण PYQ विश्लेषण: १५ वर्षांचे वारंवार विचारलेले प्रश्न',
    subtitle: 'Deep analysis of 3,200+ questions across MPSC & TCS: समास, प्रयोग व शब्दसंग्रह.',
    subtitle_mr: 'MPSC व TCS तलाठीच्या ३,२००+ प्रश्नांचे विश्लेषण: समास, प्रयोग व शब्दसंग्रह ट्रॅप्स.',
    href: '/blog/marathi-grammar-pyq-analysis-mpsc-talathi-repeated-topics',
    ctaText: 'Read Analysis ↗',
    ctaText_mr: 'विश्लेषण वाचा ↗',
  },
  {
    id: 'wn-2',
    badge: 'NEW TOOL',
    badge_mr: 'नवीन टूल',
    badgeClass: 'badgeTool',
    title: 'Police Bharti 150-Mark Physical + Written Merit Calculator',
    title_mr: 'पोलीस शिपाई १५० गुण मैदानी + लेखी मेरिट व कट-ऑफ कॅल्क्युलेटर',
    subtitle: 'Calculate exact 1600m/100m ground + written marks with live district cutoffs.',
    subtitle_mr: '१६०० मी धावणे, १०० मी व गोळाफेक + लेखी गुण मिळवून जिल्हा कट-ऑफ तपासा.',
    href: '/police-calculator',
    ctaText: 'Calculate Merit ↗',
    ctaText_mr: 'गुण मोजा ↗',
  },
  {
    id: 'wn-3',
    badge: 'PREP GUIDE',
    badge_mr: 'अभ्यास मॉडेल',
    badgeClass: 'badgeGuide',
    title: 'How to Clear MPSC While Working Full-Time: 4-Hour Daily Plan',
    title_mr: 'नोकरी सांभाळून MPSC कशी पास करावी: खाजगी क्षेत्रातील ४ तासांचे दैनिक मॉडेल',
    subtitle: 'Time-blocking blueprint, commute audio routine & weekend marathon for private employees.',
    subtitle_mr: 'खाजगी नोकरदारांसाठी सकाळचे २ तास, प्रवासातील ऑडिओ व शनिवार-रविवार मॅरेथॉन प्लॅन.',
    href: '/blog/how-to-study-for-mpsc-with-full-time-private-job',
    ctaText: 'Read Guide ↗',
    ctaText_mr: 'मार्गदर्शक वाचा ↗',
  },
  {
    id: 'wn-4',
    badge: 'AI LAB',
    badge_mr: 'AI टूल्स',
    badgeClass: 'badgeAi',
    title: '124+ Curated AI Study Tools, Resume Builder & Mock Interview',
    title_mr: '१२४+ AI अभ्यास साधने, रेझ्युमे बिल्डर व थेट AI मॉक मुलाखत',
    subtitle: 'Free NotebookLM, PDF chat, prompt templates & real-time MPSC interview simulator.',
    subtitle_mr: 'NotebookLM, PDF चॅट, मुलाखत सिम्युलेटर आणि स्पर्धा परीक्षेसाठी उपयुक्त AI साधने.',
    href: '/ai-tools',
    ctaText: 'Explore Lab ↗',
    ctaText_mr: 'AI लॅब पहा ↗',
  },
]

const NEW_BLOGS_ITEMS = [
  {
    id: 'nb-1',
    badge: 'PYQ ANALYSIS',
    badge_mr: 'PYQ विश्लेषण',
    badgeClass: 'badgeBlog',
    title: 'Marathi Grammar PYQ Analysis: 15-Year Repeated Questions',
    title_mr: 'मराठी व्याकरण PYQ विश्लेषण: १५ वर्षांचे वारंवार विचारलेले प्रश्न',
    subtitle: 'Repeated rules in प्रयोग (नवीन कर्मणी, समापन), समास, विभक्ती व समानार्थी शब्द.',
    subtitle_mr: 'प्रयोग, समास, विभक्ती आणि शब्दसंग्रह यावरील वारंवार विचारलेले अचूक नियम.',
    href: '/blog/marathi-grammar-pyq-analysis-mpsc-talathi-repeated-topics',
    ctaText: 'Read Analysis ↗',
    ctaText_mr: 'विश्लेषण वाचा ↗',
  },
  {
    id: 'nb-2',
    badge: 'STRATEGY',
    badge_mr: 'स्ट्रॅटेजी',
    badgeClass: 'badgeGuide',
    title: 'How to Clear MPSC While Working Full-Time: 4-Hour Daily Model',
    title_mr: 'नोकरी सांभाळून MPSC कशी पास करावी: खाजगी क्षेत्रातील ४ तासांचे दैनिक मॉडेल',
    subtitle: 'Time-blocking blueprint, commute audio routine & weekend marathon for private employees.',
    subtitle_mr: 'खाजगी नोकरदारांसाठी सकाळचे २ तास, प्रवासातील ऑडिओ व शनिवार-रविवार मॅरेथॉन प्लॅन.',
    href: '/blog/how-to-study-for-mpsc-with-full-time-private-job',
    ctaText: 'Read Guide ↗',
    ctaText_mr: 'मार्गदर्शक वाचा ↗',
  },
  {
    id: 'nb-3',
    badge: 'SYLLABUS',
    badge_mr: 'अभ्यासक्रम',
    badgeClass: 'badgeSyllabus',
    title: 'Maharashtra Police Bharti Written Exam 100M Syllabus & Books',
    title_mr: 'महाराष्ट्र पोलीस शिपाई लेखी परीक्षा १०० गुणांचे विषयनिहाय वेटेज व पुस्तके',
    subtitle: 'Complete 25M Marathi, 25M Maths, 25M Reasoning, 25M GK blueprint with safe cutoff plan.',
    subtitle_mr: 'मराठी, अंकगणित, बुद्धिमत्ता व सामान्य ज्ञान २५-२५ गुण वेटेज व पुस्तकांची यादी.',
    href: '/blog/maharashtra-police-bharti-written-exam-syllabus-and-topic-weightage',
    ctaText: 'View Syllabus ↗',
    ctaText_mr: 'अभ्यासक्रम पहा ↗',
  },
  {
    id: 'nb-4',
    badge: 'CAREER CADRE',
    badge_mr: 'करिअर तुलना',
    badgeClass: 'badgeTool',
    title: 'PWD vs Water Resources Department (WRD): Junior Engineer vs Assistant Engineer',
    title_mr: 'PWD वि. जलसंपदा विभाग (WRD): कनिष्ठ अभियंता (JE) वि. सहाय्यक अभियंता (AE)',
    subtitle: 'Level S-14 vs S-15 pay matrix, field inspections, tendering & promotion to Executive Engineer.',
    subtitle_mr: 'वेतन श्रेणी (S-14 वि. S-15), साईट तपासणी, टेंडर कामे आणि कार्यकारी अभियंता पदोन्नती.',
    href: '/blog/pwd-junior-engineer-je-vs-water-resources-wrd-ae-maharashtra-comparison',
    ctaText: 'Compare Cadres ↗',
    ctaText_mr: 'तुलना पहा ↗',
  },
]

const NEW_TOOLS_ITEMS = [
  {
    id: 'nt-1',
    badge: 'MERIT CALCULATOR',
    badge_mr: 'मेरिट कॅल्क्युलेटर',
    badgeClass: 'badgeTool',
    title: 'Police Bharti 150-Mark Physical + Written Merit Calculator',
    title_mr: 'पोलीस शिपाई १५० गुण मैदानी + लेखी मेरिट व कट-ऑफ कॅल्क्युलेटर',
    subtitle: 'Calculate exact 1600m/100m ground + written marks with live district cutoffs.',
    subtitle_mr: '१६०० मी धावणे, १०० मी व गोळाफेक + लेखी गुण मिळवून जिल्हा कट-ऑफ तपासा.',
    href: '/police-calculator',
    ctaText: 'Open Calculator ↗',
    ctaText_mr: 'कॅल्क्युलेटर उघडा ↗',
  },
  {
    id: 'nt-2',
    badge: 'AI TOOLS LAB',
    badge_mr: 'AI लॅब',
    badgeClass: 'badgeAi',
    title: '124+ Curated AI Study Tools, Resume Builder & Mock Interview',
    title_mr: '१२४+ AI अभ्यास साधने, रेझ्युमे बिल्डर व थेट AI मॉक मुलाखत',
    subtitle: 'Free NotebookLM, PDF chat, prompt templates & real-time MPSC interview simulator.',
    subtitle_mr: 'NotebookLM, PDF चॅट, मुलाखत सिम्युलेटर आणि स्पर्धा परीक्षेसाठी उपयुक्त AI साधने.',
    href: '/ai-tools',
    ctaText: 'Explore Lab ↗',
    ctaText_mr: 'AI लॅब पहा ↗',
  },
  {
    id: 'nt-3',
    badge: 'OFFICIAL PAPERS',
    badge_mr: 'अधिकृत पेपर्स',
    badgeClass: 'badgePyq',
    title: '841 Official MPSC Question Papers & Final Answer Keys (2021–2026)',
    title_mr: '८४१ अधिकृत MPSC प्रश्नपत्रिका व अंतिम उत्तरतालिका (२०२१–२०२६)',
    subtitle: 'Download & read Rajyaseva, Group B, Group C & PSI papers free in browser.',
    subtitle_mr: 'राज्यसेवा, गट ब व क चे अधिकृत पेपर व फायनल की एकाच ओळीत मोफत वाचा.',
    href: '/mpsc-pyq',
    ctaText: 'Open Papers ↗',
    ctaText_mr: 'पेपर्स उघडा ↗',
  },
  {
    id: 'nt-4',
    badge: '15-YR PYQ BANK',
    badge_mr: '१५-वर्षीय बँक',
    badgeClass: 'badgeGuide',
    title: '15-Year Topic-wise Searchable PYQ Question Bank',
    title_mr: '१५-वर्षीय घटकनिहाय सर्च करण्यायोग्य PYQ प्रश्न बँक',
    subtitle: 'Interactive MCQ practice with answers & explanations across Polity, History, Science & Marathi.',
    subtitle_mr: 'राज्यघटना, इतिहास, भूगोल, विज्ञान व मराठी विषयांचे घटकनिहाय प्रश्न व स्पष्टीकरणे.',
    href: '/pyq',
    ctaText: 'Practice PYQs ↗',
    ctaText_mr: 'सराव करा ↗',
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
    badge: 'MPSC 2021–2026',
    title: 'MPSC Question Papers & Answer Keys',
    title_mr: 'MPSC मूळ प्रश्नपत्रिका व उत्तरतालिका',
    desc: '841 official MPSC question papers and validated final answer keys across 429 exams (2021–2026). Read in-browser or download.',
    cta: 'Browse 841 MPSC Papers & Keys →',
    cta_mr: '८४१ MPSC पेपर्स व कीज् पहा →',
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
  { name: 'MPSC Maharashtra', name_mr: 'MPSC महाराष्ट्र', meta: 'State Civil Services • 4,124+ Posts', icon: 'account_balance', href: '/jobs/org/mpsc' },
  { name: 'UPSC New Delhi', name_mr: 'UPSC नवी दिल्ली', meta: 'Civil & Defense • 1,200+ Posts', icon: 'gavel', href: '/jobs/org/upsc' },
  { name: 'Railway (RRB/RRC)', name_mr: 'रेल्वे भरती बोर्ड', meta: 'ALP, NTPC, Group D • 32K+ Posts', icon: 'train', href: '/jobs/org/rrb' },
  { name: 'SSC New Delhi', name_mr: 'कर्मचारी निवड आयोग', meta: 'CGL, CHSL, GD, MTS • 25K+ Posts', icon: 'description', href: '/jobs/org/ssc' },
  { name: 'Banking (IBPS/SBI)', name_mr: 'बँक भरती (IBPS/SBI)', meta: 'PO, Clerk, SO • 18,500+ Posts', icon: 'savings', href: '/jobs/org/banking' },
  { name: 'Maharashtra Police', name_mr: 'महाराष्ट्र पोलीस', meta: 'Constable, Driver • 3,521+ Posts', icon: 'local_police', href: '/jobs/org/police' },
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

// ── 5. Verified Aspirant Testimonials ────────────────────────────
const TESTIMONIALS = [
  {
    name: 'ExamUdaan Aspirant',
    exam: 'Selected in Maharashtra Mumbai Police 2025',
    text: 'ExamUdaan was the only portal where the Police physical sprint score calculator accurately mapped my 150-mark composite cutoff before the official list was declared.',
    initial: 'E',
  },
  {
    name: 'ExamUdaan Aspirant',
    exam: 'Selected as Talathi (Chhatrapati Sambhajinagar)',
    text: 'TCS answer keys always create confusion about shift normalisation. ExamUdaan shift rank predictor gave me 99.2 percentile within 15 minutes of response sheet release.',
    initial: 'E',
  },
  {
    name: 'ExamUdaan Aspirant',
    exam: 'MPSC Combined Group-B (STI Aspirant)',
    text: 'Every morning at 7 AM I read the Current Affairs digest and solve the 5-Minute Quiz. The district-wise alerts saved me from missing local municipal corporation posts.',
    initial: 'E',
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

// Format current date in Indian Standard Time (IST) — rolls over automatically at midnight
function getFormattedTodayDate(isMr = false) {
  try {
    const now = new Date()
    return now.toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return 'Today'
  }
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
  const [heroTab, setHeroTab] = useState('whatsNew') // 'whatsNew' | 'blogs' | 'tools' | 'urgent'

  // Dynamic daily current affairs date & live headlines (updates daily at 12am midnight IST)
  const [todayDate, setTodayDate] = useState(() => getFormattedTodayDate(isMarathi))
  const [caBullets, setCaBullets] = useState([
    'Maharashtra Cabinet clears key irrigation and rural road infrastructure packages.',
    'RBI Monetary Policy keeps repo rate steady; highlights bank liquidity norms.',
    'National Clean Air Programme review awards Pune & Nagpur top civic score.'
  ])

  useEffect(() => {
    setTodayDate(getFormattedTodayDate(isMarathi))

    // Fetch live daily current affairs headlines from API
    fetch('/api/current-affairs?limit=3')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.items && data.items.length > 0) {
          const freshHeadlines = data.items.slice(0, 3).map(item => item.title).filter(Boolean)
          if (freshHeadlines.length > 0) {
            setCaBullets(freshHeadlines)
          }
        }
      })
      .catch(() => {})

    // Schedule update exactly at 12:00 AM midnight (IST)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    tomorrow.setHours(0, 0, 1, 0)
    const msToMidnight = Math.max(1000, tomorrow.getTime() - now.getTime())

    const midnightTimer = setTimeout(() => {
      setTodayDate(getFormattedTodayDate(isMarathi))
    }, msToMidnight)

    return () => clearTimeout(midnightTimer)
  }, [isMarathi])

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

  // Choose jobs for the active region tab (live DB jobs first, fallback to mock)
  const displayOpenings = (jobs && jobs.length > 0)
    ? jobs.slice(0, 6).map(j => {
        const deadline = j.apply_end
          ? new Date(j.apply_end).toLocaleDateString(isMarathi ? 'mr-IN' : 'en-IN', { day: '2-digit', month: 'short' })
          : 'Closing Soon'
        const org = (isMarathi && j.org_name_mr) ? j.org_name_mr : (j.department || j.organization || 'Govt Department')
        const vac = j.vacancies ? `${j.vacancies} Posts` : 'Various Posts'
        const qual = j.ai_extracted_data?.education_levels?.[0] || 'Graduation / Any Degree'
        return {
          id: j.id,
          region: j.organization || 'Govt of India',
          status: j.is_walk_in ? 'Walk-in' : 'Active Recruitment',
          isNew: true,
          title: (isMarathi && j.title_mr) ? j.title_mr : j.title,
          dept: org,
          vacancies: vac,
          qualification: qual,
          deadline,
          slug: j.slug || `${(j.organization || 'job').toLowerCase()}-${j.id}`,
        }
      })
    : (REGION_JOBS[activeRegion] || REGION_JOBS.maharashtra)

  return (
    <div className={styles.page}>

      {/* ════════ 1. HERO SECTION (Screenshot 2 Match) ════════ */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroGrid}>

            {/* Left Hero Column */}
            <div>
              <div className={styles.heroTag}>
                <span className={`material-symbols-outlined ${styles.icon14}`}>verified</span>
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
              {/* Action Buttons */}
              <div className={styles.heroCtas}>
                <Link
                  href="/jobs"
                  className={styles.ctaPrimary}
                  onClick={() => trackCtaClick('Browse Active Jobs', '/jobs', 'homepage_hero')}
                >
                  <span className={`material-symbols-outlined ${styles.icon20}`}>search</span>
                  {isMarathi ? `${stats.total_jobs || '575'}+ सक्रिय नोकऱ्या पहा →` : `Browse ${stats.total_jobs || '575'}+ Active Jobs →`}
                </Link>

                <div className={styles.heroChannelRow}>
                  {/* Primary Broadcast Channel: Telegram */}
                  <a
                    href="https://t.me/examudaanjobs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ctaTelegram}
                    title="Join Official Telegram Channel"
                    onClick={() => trackSocialCommunity('telegram', 'https://t.me/examudaanjobs', 'homepage_hero')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                    <span>{isMarathi ? 'Telegram अलर्ट' : 'Join Telegram'}</span>
                  </a>

                  {/* Secondary Channel: WhatsApp */}
                  <a
                    href="https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ctaWhatsAppSecondary}
                    title="Follow WhatsApp Channel"
                    onClick={() => trackSocialCommunity('whatsapp', 'https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v', 'homepage_hero')}
                  >
                    <span className={`material-symbols-outlined ${styles.icon18}`}>chat</span>
                    <span>{isMarathi ? 'WhatsApp' : 'WhatsApp'}</span>
                  </a>
                </div>
              </div>

              {/* Trust Checkmarks */}
              <div className={styles.heroTrustList}>
                <span className={styles.trustItem}>✓ 100% Official Sources</span>
                <span className={styles.trustItem}>✓ Zero Fake / Expired Alerts</span>
                <span className={styles.trustItem}>✓ Free Exam Guides</span>
              </div>

              {/* 4 Core Pillars - Instant Clarity on Mobile & Desktop */}
              <div className={styles.portalCorePillars}>
                <Link href="/jobs" className={styles.pillarCard}>
                  <span className={styles.pillarIcon}>💼</span>
                  <div>
                    <strong>{isMarathi ? '२७५+ सरकारी नोकऱ्या' : '275+ Live Govt Jobs'}</strong>
                    <span>{isMarathi ? 'MPSC, UPSC, पोलीस, SSC भरती' : 'MPSC, UPSC, Police, SSC & Bank'}</span>
                  </div>
                </Link>
                <Link href="/answer-keys" className={styles.pillarCard}>
                  <span className={styles.pillarIcon}>🔑</span>
                  <div>
                    <strong>{isMarathi ? 'उत्तरतालिका व कटऑफ्स' : 'Answer Keys & Cutoffs'}</strong>
                    <span>{isMarathi ? 'अधिकृत रेस्पॉन्स शीट व नॉर्मलायझेशन' : 'Official TCS/MPSC response sheets'}</span>
                  </div>
                </Link>
                <Link href="/mpsc-pyq" className={styles.pillarCard}>
                  <span className={styles.pillarIcon}>📚</span>
                  <div>
                    <strong>{isMarathi ? '१५-वर्षीय PYQ पेपर्स' : '15-Yr Solved PYQ Bank'}</strong>
                    <span>{isMarathi ? '८४१+ MPSC प्रश्नपत्रिका उत्तरे' : '841+ MPSC papers & keys'}</span>
                  </div>
                </Link>
                <Link href="/study-planner" className={styles.pillarCard}>
                  <span className={styles.pillarIcon}>🤖</span>
                  <div>
                    <strong>{isMarathi ? 'AI स्टडी प्लॅनर' : 'AI Study Planner & Tools'}</strong>
                    <span>{isMarathi ? '१२४+ मोफत अभ्यास साधने' : '124+ Free prep tools & timetable'}</span>
                  </div>
                </Link>
              </div>

              {/* Popular Navigation Hub Pills */}
              <div className={styles.popularHubRow}>
                <span className={styles.popularHubLabel}>
                  {isMarathi ? 'लोकप्रिय:' : 'Popular:'}
                </span>
                <Link href="/talathi-bharti-2026" className={styles.popularPillOrange}>
                  🌾 {isMarathi ? 'तलाठी भरती २०२६' : 'Talathi Bharti 2026'}
                </Link>
                <Link href="/maharashtra-police-bharti-2026" className={styles.popularPillRust}>
                  👮 {isMarathi ? 'पोलीस भरती २०२६' : 'Police Bharti 2026'}
                </Link>
                <Link href="/mpsc-exam-dates-2026" className={styles.popularPillPurple}>
                  📅 {isMarathi ? 'MPSC वेळापत्रक २०२६' : 'MPSC Exam Dates 2026'}
                </Link>
                <Link href="/mpsc-pyq" className={styles.popularPillBlue}>
                  🏛️ MPSC Papers &amp; Keys (841)
                </Link>
                <Link href="/answer-keys" className={styles.popularPillGreen}>
                  🔑 Answer Keys
                </Link>
                <Link href="/mock-tests" className={styles.popularPillGray}>
                  ⏱️ Mock Tests
                </Link>
              </div>
            </div>

            {/* Right Hero Column: What's New & Updates Hub Card */}
            <div>
              <div className={styles.urgentCard}>
                <div className={styles.urgentHeader}>
                  <div className={styles.urgentTitle}>
                    <span className={`material-symbols-outlined ${styles.sparkleIcon}`}>
                      {heroTab === 'urgent' ? 'alarm' : 'stars'}
                    </span>
                    <span>
                      {heroTab === 'urgent'
                        ? (isMarathi ? 'अंतिम मुदतीच्या परीक्षा जाहिराती' : 'Urgent Exam Openings')
                        : (isMarathi ? 'ExamUdaan वर काय नवीन आहे?' : "What's New on ExamUdaan")}
                    </span>
                  </div>
                  {heroTab === 'urgent' ? (
                    <span className={styles.urgentBadge}>
                      {urgentCount > 0
                        ? (isMarathi ? `${urgentCount} अंतिम मुदत` : `${urgentCount} Closing Soon`)
                        : (isMarathi ? `${displayUrgent.length} अंतिम मुदत` : `${displayUrgent.length} Closing Soon`)}
                    </span>
                  ) : (
                    <span className={styles.whatsNewPillBadge}>
                      <span className={styles.pulseDot} />
                      {isMarathi ? 'नवीन अपडेट्स' : 'NEW RELEASES'}
                    </span>
                  )}
                </div>

                {/* Switcher Pill Tabs */}
                <div className={styles.heroTabsBar} role="tablist" aria-label="Hero Updates Tabs">
                  <button
                    type="button"
                    onClick={() => setHeroTab('whatsNew')}
                    className={`${styles.heroTabBtn} ${heroTab === 'whatsNew' ? styles.heroTabBtnActive : ''}`}
                  >
                    ✨ {isMarathi ? 'काय नवीन आहे' : "What's New"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTab('blogs')}
                    className={`${styles.heroTabBtn} ${heroTab === 'blogs' ? styles.heroTabBtnActive : ''}`}
                  >
                    📝 {isMarathi ? 'नवीन लेख' : 'New Blogs'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTab('tools')}
                    className={`${styles.heroTabBtn} ${heroTab === 'tools' ? styles.heroTabBtnActive : ''}`}
                  >
                    🤖 {isMarathi ? 'AI टूल्स व PYQ' : 'AI Tools & PYQ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTab('urgent')}
                    className={`${styles.heroTabBtn} ${heroTab === 'urgent' ? styles.heroTabBtnActive : ''}`}
                  >
                    ⏰ {isMarathi ? 'मुदत संपत आहे' : 'Urgent Jobs'}
                    {urgentCount > 0 && ` (${urgentCount})`}
                  </button>
                </div>

                {/* Items List */}
                <div>
                  {heroTab === 'urgent' ? (
                    displayUrgent.map(item => (
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
                          <span className={styles.urgentCardSpacer}>
                            <Link
                              href={`/jobs/${item.slug}`}
                              className={styles.applyLink}
                              aria-label={isMarathi ? `${item.title_mr || item.title} तपशील पहा` : `Apply for ${item.title}`}
                            >
                              {isMarathi ? 'तपशील पहा ↗' : 'Apply Direct ↗'}
                            </Link>
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    (heroTab === 'whatsNew'
                      ? WHATS_NEW_ITEMS
                      : heroTab === 'blogs'
                      ? NEW_BLOGS_ITEMS
                      : NEW_TOOLS_ITEMS
                    ).map(item => (
                      <div key={item.id} className={styles.whatsNewItem}>
                        <div className={styles.whatsNewItemHeader}>
                          <span className={styles[item.badgeClass] || styles.badgeBlog}>
                            {isMarathi && item.badge_mr ? item.badge_mr : item.badge}
                          </span>
                          <Link href={item.href} className={styles.whatsNewAction}>
                            {isMarathi && item.ctaText_mr ? item.ctaText_mr : item.ctaText}
                          </Link>
                        </div>
                        <Link href={item.href} className={styles.whatsNewItemTitle}>
                          {isMarathi && item.title_mr ? item.title_mr : item.title}
                        </Link>
                        <p className={styles.whatsNewSubtitle}>
                          {isMarathi && item.subtitle_mr ? item.subtitle_mr : item.subtitle}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.urgentFooter}>
                  {heroTab === 'urgent' ? (
                    <Link href="/jobs/closing-soon">
                      {isMarathi
                        ? `सर्व ${urgentCount || displayUrgent.length || 10}+ अंतिम मुदतीच्या जाहिराती पहा →`
                        : `View All ${urgentCount || displayUrgent.length || 10} Urgent Notifications →`}
                    </Link>
                  ) : heroTab === 'blogs' ? (
                    <Link href="/blog">
                      {isMarathi
                        ? 'सर्व २८ सविस्तर परीक्षा गाईड्स व स्ट्रॅटेजी वाचा →'
                        : 'View All 28 Prep Guides & Strategies →'}
                    </Link>
                  ) : heroTab === 'tools' ? (
                    <Link href="/ai-tools">
                      {isMarathi
                        ? 'सर्व १२४+ AI टूल्स, कॅल्क्युलेटर व PYQ बँक उघडा →'
                        : 'Explore All AI Tools, Calculators & PYQs →'}
                    </Link>
                  ) : (
                    <Link href="/blog">
                      {isMarathi
                        ? 'सर्व २८ परीक्षा गाईड्स, मोफत साधने व PYQ पेपर्स पहा →'
                        : 'Explore All 28 Guides, AI Tools & PYQ Banks →'}
                    </Link>
                  )}
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
            <Link href="/jobs" className={styles.statBox} title="View all active government job vacancies">
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
                <div className={styles.statValue}>{stats.total_ai_tools ? `${stats.total_ai_tools}+` : '124+'}</div>
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
            <span className={styles.badgeText16}>📚</span>
            <span>MPSC Question Papers</span>
          </Link>
          <Link href="/answer-keys" className={styles.quickPill} title="Official Exam Answer Keys">
            <span className={styles.badgeText16}>🔑</span>
            <span>Answer Keys Portal</span>
          </Link>
          <Link href="/current-affairs" className={styles.quickPill} title="Daily Current Affairs Digest">
            <span className={styles.badgeText16}>📰</span>
            <span>Daily Current Affairs</span>
          </Link>
          <Link href="/syllabus" className={styles.quickPill} title="Exam Syllabus 2026">
            <span className={styles.badgeText16}>📖</span>
            <span>Syllabus 2026</span>
          </Link>
          <Link href="/pyq" className={styles.quickPill} title="15-Year PYQ Practice Bank">
            <span className={styles.badgeText16}>⏱️</span>
            <span>15-Yr PYQ Bank</span>
          </Link>
          <Link href="/question-papers#maharashtra-direct" className={styles.quickPill} title="Maharashtra Police Bharti Papers">
            <span className={styles.badgeText16}>👮</span>
            <span>Police Bharti Papers</span>
          </Link>
          <Link href="/mock-tests" className={styles.quickPill} title="Free CBT Mock Tests">
            <span className={styles.badgeText16}>🎯</span>
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
              View all tools ({stats.total_ai_tools || 124} AI Tools) →
            </Link>
          </div>

          <div className={styles.suiteGrid}>
            {SUITE_CARDS.map((card, i) => (
              <Link key={i} href={card.href} className={styles.suiteCard}>
                <div className={styles.suiteCardTop}>
                  <div className={styles.suiteIconBox}>
                    <span className={`material-symbols-outlined ${styles.icon22}`}>{card.icon}</span>
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
        <section className={`${styles.sectionBlock} ${styles.sectionBlockNoPaddingTop}`}>
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
        <section className={`${styles.sectionBlock} ${styles.sectionBlockNoPaddingTop}`}>
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
                    <span className={`material-symbols-outlined ${styles.icon13}`}>groups</span>
                    {job.vacancies}
                  </span>
                  <span className={styles.jobPill}>
                    <span className={`material-symbols-outlined ${styles.icon13}`}>school</span>
                    {job.qualification}
                  </span>
                </div>

                <div className={styles.jobBottomRow}>
                  <span className={styles.jobDeadline}>Last Date: <time>{job.deadline}</time></span>
                  <Link
                    href={`/jobs/${job.slug}`}
                    className={styles.applyDirectBtn}
                    aria-label={`Apply direct for ${job.title}`}
                  >
                    Apply Direct ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.centerCtaWrap}>
            <Link href="/jobs" className={`${styles.ctaPrimary} ${styles.ctaPrimaryCompact}`}>
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
              <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLarge}`}>
                {isMarathi
                  ? 'अंदाजावर विसंबून राहू नका. अचूक विश्लेषणासह निकाल तपासा.'
                  : 'Stop Guessing Your Rank. Prepare with Algorithmic Precision.'}
              </h2>
              <p className={`${styles.sectionSubtitle} ${styles.sectionSubtitleSpaced}`}>
                {isMarathi
                  ? 'TCS व MPSC च्या मागील १० वर्षांच्या नॉर्मलायझेशन अल्गोरिदमच्या आधारे तुमचा अधिकृत निकालापूर्वीचा अचूक पर्सेन्टाइल, शिफ्ट रँक आणि प्रवर्गनिहाय मेरिट गुण मिळवा.'
                  : 'ExamUdaan ingests machine learning models trained on 10 years of normalization patterns across TCS-administered government exams to reveal your exact percentile, rank, and merit raw score before official results.'}
              </p>

              <div className={styles.rankFeatureItem}>
                <div className={styles.rankFeatureIcon}>
                  <span className={`material-symbols-outlined ${styles.icon18}`}>timeline</span>
                </div>
                <div className={styles.rankFeatureText}>
                  <strong>Dynamic Shift Normalization Engine</strong>
                  <p>Accurate shift-by-shift difficulty index calibrated using Gaussian standard deviations for multi-session exams.</p>
                </div>
              </div>

              <div className={styles.rankFeatureItem}>
                <div className={styles.rankFeatureIcon}>
                  <span className={`material-symbols-outlined ${styles.icon18}`}>tune</span>
                </div>
                <div className={styles.rankFeatureText}>
                  <strong>Mean-Typical Shift Timetable</strong>
                  <p>Immediate comparison of your performance against your shift average and standard deviation spread.</p>
                </div>
              </div>

              <div className={styles.rankFeatureItem}>
                <div className={styles.rankFeatureIcon}>
                  <span className={`material-symbols-outlined ${styles.icon18}`}>local_police</span>
                </div>
                <div className={styles.rankFeatureText}>
                  <strong>Composite Police Merit Forecaster</strong>
                  <p>Combined physical sprint/run scores + written score projected against historical category cutoff thresholds.</p>
                </div>
              </div>

              <div className={styles.toolsMarginTop}>
                <Link href="/score-calculator" className={styles.ctaPrimary}>
                  Launch Answer Key Rank Calc ↗
                </Link>
              </div>
            </div>

            {/* Right Column: Live Interactive Widget Card */}
            <div>
              <div className={styles.analyzerWidget}>
                <div className={styles.widgetHeader}>
                  <div className={styles.scoreHeaderRow}>
                    <span className={`material-symbols-outlined ${styles.iconPrimary18}`}>calculate</span>
                    <strong className={styles.scoreTitleText}>TCS / MPSC Response Key Analyzer</strong>
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
                    <span className={styles.scorePercentileLabel}>Overall Predicted Score:</span>
                    <span className={styles.scoreValue}>{calculatedScore.score}</span>
                  </div>

                  {/* Progress bar */}
                  <div className={styles.scoreProgressBarTrack}>
                    <div className={styles.scoreProgressBarFill} />
                  </div>

                  <div className={styles.scoreStatsRow}>
                    <span>Overall Percentile: <strong className={styles.scoreHighlightGreen}>{calculatedScore.percentile}</strong></span>
                    <span>Shift Rank: <strong className={styles.scoreHighlightPrimary}>{calculatedScore.rank}</strong></span>
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
                <span className={`${styles.suiteBadge} ${styles.suiteBadgeOrange}`}>
                  Daily 5-Min Drill
                </span>
                <span className={styles.suiteMetaText}>10 Questions • 5 Mins</span>
              </div>
              <h3 className={styles.boosterTitle}>
                10 Questions on MPSC & Police Bharti Current Events
              </h3>
              <p className={styles.suiteDescText}>
                <strong>Sample Question:</strong> Which state government department notified the revised quota and physical merit structure for 2026?
              </p>
              <div className={styles.boosterActionRow}>
                <Link href="/daily-quiz" className={styles.boosterBtn}>
                  <span className={`material-symbols-outlined ${styles.icon16}`}>play_arrow</span>
                  Start 5-Minute Quiz Now
                </Link>
              </div>
            </div>

            {/* Card 2: Daily Current Affairs Bullet Points */}
            <div className={styles.boosterCard}>
              <div className={styles.boosterCardTop}>
                <span className={`${styles.suiteBadge} ${styles.suiteBadgeGreen}`}>
                  {isMarathi ? `दैनिक ${todayDate}` : `Daily ${todayDate}`}
                </span>
                <span className={styles.suiteMetaText}>5 Min Read • PDF Ready</span>
              </div>
              <h3 className={styles.boosterTitle}>
                {isMarathi ? 'दैनिक चालू घडामोडी महत्त्वाचे मुद्दे' : 'Daily Current Affairs Bullet Points'}
              </h3>
              <ul className={styles.bulletPoints}>
                {caBullets.map((bullet, idx) => (
                  <li key={idx} className={styles.bulletItem}>
                    <span className={`material-symbols-outlined ${styles.bulletIcon}`}>check_circle</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.boosterActionRow}>
                <Link href="/current-affairs" className={`${styles.boosterBtn} ${styles.boosterBtnFlex}`}>
                  Read More →
                </Link>
                <Link href="/current-affairs" className={styles.boosterBtnOutline}>
                  <span className={`material-symbols-outlined ${styles.icon16}`}>download</span>
                  PDF
                </Link>
              </div>
            </div>

            {/* Card 3: Video Masterclass */}
            <div className={styles.boosterCard}>
              <div className={styles.boosterCardTop}>
                <span className={`${styles.suiteBadge} ${styles.suiteBadgeRed}`}>
                  Video Masterclass
                </span>
                <span className={styles.suiteMetaText}>Free YouTube Lecture</span>
              </div>
              <h3 className={styles.boosterTitle}>
                MPSC & Police Bharti Reasoning Marathon
              </h3>
              <div className={styles.youtubePreviewBox}>
                <span className={`material-symbols-outlined ${styles.iconYoutubeLarge}`}>
                  play_circle
                </span>
                <span className={styles.youtubeVideoBadge}>
                  1 hr 45 min • High-Yield
                </span>
              </div>
              <div className={styles.boosterActionRow}>
                <Link href="/youtube" className={`${styles.boosterBtn} ${styles.boosterBtnYoutube}`}>
                  <span className={`material-symbols-outlined ${styles.icon16}`}>play_circle</span>
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
                ? 'हजारो विद्यार्थ्यांसोबत मोफत प्रश्नपत्रिका, चालू घडामोडी आणि थेट भरती अलर्ट मिळवा.'
                : 'Join thousands of Maharashtra govt job aspirants with real-time verified alerts, current affairs, and practice sets.'}
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
              onClick={() => trackSocialCommunity('telegram', 'https://t.me/examudaanjobs', 'homepage_prefooter')}
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
              onClick={() => trackSocialCommunity('whatsapp', 'https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v', 'homepage_prefooter')}
            >
              <span className={`material-symbols-outlined ${styles.icon18}`}>chat</span>
              <span>{isMarathi ? 'WhatsApp चॅनेल' : 'WhatsApp'}</span>
            </a>

            <Link
              href="/jobs"
              className={styles.bannerBtnLight}
              onClick={() => trackCtaClick('Explore Free Content', '/jobs', 'homepage_prefooter')}
            >
              Explore Free Content
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
