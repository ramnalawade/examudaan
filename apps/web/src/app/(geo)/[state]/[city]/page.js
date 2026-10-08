// ============================================================
// app/(geo)/[state]/[city]/page.js — Hyperlocal State & City Job Pages
// Route: /[state]/[city] e.g. /maharashtra/nagpur, /maharashtra/mumbai
// ============================================================

import { notFound } from 'next/navigation'
import DistrictJobsClient from '../../../jobs/district/[district]/DistrictJobsClient'

// Catalog of known districts/cities
const CITIES = {
  nagpur: {
    slug: 'nagpur',
    name: 'Nagpur',
    nameMr: 'नागपूर',
    cityFilter: 'Nagpur',
    region: 'Vidarbha',
    popular: ['MPSC', 'Police Bharti', 'NMC', 'Talathi Bharti', 'ZP Nagpur', 'AIIMS Nagpur', 'CSIR-NEERI'],
    desc: 'Nagpur — Maharashtra\'s winter capital — sees high recruitment activity from MPSC, NMC, Zilla Parishad, and central government units like AIIMS Nagpur and CSIR-NEERI.',
    faqExtra: 'Which exam has high recruitment in Nagpur? MPSC, Nagpur Police Bharti, AIIMS Nagpur, and Zilla Parishad announce regular vacancies for local candidates.',
  },
  mumbai: {
    slug: 'mumbai',
    name: 'Mumbai',
    nameMr: 'मुंबई',
    cityFilter: 'Mumbai',
    region: 'Mumbai Metropolitan Region',
    popular: ['Mumbai Police', 'BMC', 'MPSC', 'RBI', 'IBPS', 'SSC', 'SBI'],
    desc: 'Mumbai — Maharashtra\'s capital and financial hub — is home to BMC, Mumbai Police, RBI, IBPS, SBI, and major SSC recruitment centres.',
    faqExtra: 'Which body recruits the most in Mumbai? BMC and Mumbai Police consistently announce the largest recruitment drives in Mumbai.',
  },
  pune: {
    slug: 'pune',
    name: 'Pune',
    nameMr: 'पुणे',
    cityFilter: 'Pune',
    region: 'Western Maharashtra',
    popular: ['MPSC', 'Police Bharti', 'PMC', 'Talathi Bharti', 'ZP Pune'],
    desc: 'Pune is Maharashtra\'s second largest city and a major hub for MPSC, Police Bharti, PMC, and Zilla Parishad recruitments.',
    faqExtra: 'Which exams are popular in Pune? MPSC Combined Group B & C, PMC Bharti, and Pune Police Bharti are the most popular.',
  },
  nashik: {
    slug: 'nashik',
    name: 'Nashik',
    nameMr: 'नाशिक',
    cityFilter: 'Nashik',
    region: 'Northern Maharashtra',
    popular: ['MPSC', 'Police Bharti', 'NMC Nashik', 'Talathi Bharti', 'ZP Nashik'],
    desc: 'Nashik district is a major recruitment hub for Nashik Municipal Corporation, Maharashtra Police, and Zilla Parishad.',
    faqExtra: 'What are the top jobs in Nashik? Maharashtra Police Constable, Talathi, and Nashik Municipal Corporation recruitments.',
  },
  thane: {
    slug: 'thane',
    name: 'Thane',
    nameMr: 'ठाणे',
    cityFilter: 'Thane',
    region: 'Konkan',
    popular: ['Thane Police', 'KRCL', 'TMC', 'MPSC', 'Police Bharti'],
    desc: 'Thane district offers government job opportunities from TMC, Konkan Railway, Thane Police, and MPSC.',
    faqExtra: 'Are there railway jobs in Thane? Yes, Konkan Railway Corporation Limited (KRCL) regularly recruits in Thane district.',
  },
  aurangabad: {
    slug: 'aurangabad',
    name: 'Chhatrapati Sambhajinagar',
    nameMr: 'छत्रपती संभाजीनगर',
    cityFilter: 'Aurangabad',
    region: 'Marathwada',
    popular: ['MPSC', 'Police Bharti', 'ZP Aurangabad', 'Talathi Bharti'],
    desc: 'Chhatrapati Sambhajinagar is Marathwada\'s administrative capital with significant MPSC, Police, and Zilla Parishad recruitment.',
    faqExtra: 'Do local candidates get preference? District-cadre posts like Talathi and Zilla Parishad follow district-wise merit lists.',
  },
  kolhapur: {
    slug: 'kolhapur',
    name: 'Kolhapur',
    nameMr: 'कोल्हापूर',
    cityFilter: 'Kolhapur',
    region: 'Western Maharashtra (South)',
    popular: ['MPSC', 'Police Bharti', 'KMC', 'Talathi Bharti', 'ZP Kolhapur'],
    desc: 'Kolhapur district offers government job opportunities through Kolhapur Municipal Corporation, Police, and ZP.',
    faqExtra: 'Which exam is most competitive in Kolhapur? MPSC Combined (PSI, STI, ASO) and Kolhapur Police Bharti are highly competitive.',
  },
  solapur: {
    slug: 'solapur',
    name: 'Solapur',
    nameMr: 'सोलापूर',
    cityFilter: 'Solapur',
    region: 'Western Maharashtra',
    popular: ['MPSC', 'Police Bharti', 'Talathi Bharti', 'ZP Solapur'],
    desc: 'Solapur district government job opportunities span MPSC, Maharashtra Police, and Solapur Zilla Parishad.',
    faqExtra: 'Does Solapur have a separate merit list? Police Bharti follows commissionerate/district merit lists for Solapur.',
  },
  amravati: {
    slug: 'amravati',
    name: 'Amravati',
    nameMr: 'अमरावती',
    cityFilter: 'Amravati',
    region: 'Vidarbha',
    popular: ['MPSC', 'Police Bharti', 'ZP Amravati', 'Talathi Bharti'],
    desc: 'Amravati district government jobs include MPSC exams, Maharashtra Police Bharti, and Zilla Parishad vacancies.',
    faqExtra: 'Does Amravati have division exam centres? Yes, MPSC, Police Bharti, and Talathi exams provide local Amravati exam centres.',
  },
}

export async function generateMetadata(props) {
  const params = await props.params
  const stateStr = params?.state || 'maharashtra'
  const cityStr = params?.city || ''
  const cityKey = cityStr.toLowerCase()
  const district = CITIES[cityKey] || {
    name: cityStr ? cityStr.charAt(0).toUpperCase() + cityStr.slice(1) : 'Maharashtra',
    nameMr: cityStr,
    desc: `Browse latest government job vacancies in ${cityStr}, ${stateStr}.`,
  }

  const title = `${district.name} Govt Jobs 2026`
  const description = `Apply online for latest government jobs in ${district.name} (${district.nameMr}). Official notification PDFs, vacancies, eligibility, and direct apply links.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://examudaan.in/${stateStr}/${cityKey}`,
    },
    openGraph: {
      title: `${title} | ExamUdaan`,
      description,
      url: `https://examudaan.in/${stateStr}/${cityKey}`,
      type: 'website',
    },
  }
}

export function generateStaticParams() {
  return Object.keys(CITIES).map(city => ({
    state: 'maharashtra',
    city,
  }))
}

export default async function GeoCityJobsPage(props) {
  const params = await props.params
  const stateStr = params?.state || 'maharashtra'
  const cityStr = params?.city || ''
  const cityKey = cityStr.toLowerCase()
  const district = CITIES[cityKey] || {
    slug: cityKey,
    name: cityStr ? cityStr.charAt(0).toUpperCase() + cityStr.slice(1) : 'Maharashtra',
    nameMr: cityStr,
    cityFilter: cityStr,
    region: stateStr ? stateStr.charAt(0).toUpperCase() + stateStr.slice(1) : 'Maharashtra',
    popular: ['MPSC', 'Police Bharti', 'Talathi', 'ZP Bharti'],
    desc: `Latest verified government recruitment opportunities in ${cityStr}, ${stateStr}.`,
  }

  return <DistrictJobsClient district={district} />
}
