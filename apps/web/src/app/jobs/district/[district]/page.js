// ============================================================
// app/jobs/district/[district]/page.js — Hyperlocal District Job Pages
//
// Purpose: Capture long-tail local search traffic like:
//   "Police Bharti Pune 2026", "Govt Jobs Nagpur", "Talathi Bharti Nashik"
//
// Each page is statically generated (SSG) via generateStaticParams.
// The city filter is passed to the ListingPage via URL ?city= param
// which the existing /api/notifications route already supports.
//
// Route: /jobs/district/[district]
// Examples:
//   /jobs/district/pune          → Pune Govt Jobs
//   /jobs/district/nagpur        → Nagpur Govt Jobs
//   /jobs/district/mumbai        → Mumbai Govt Jobs
// ============================================================

import { notFound } from 'next/navigation'
import Link from 'next/link'
import DistrictJobsClient from './DistrictJobsClient'

// ── District catalogue ────────────────────────────────────────
// Each entry defines: slug (URL param), display name, popular local exams,
// official posting city name used in exam_cities DB column (for ?city= filter).
const DISTRICTS = [
  {
    slug:        'pune',
    name:        'Pune',
    nameMr:      'पुणे',
    cityFilter:  'Pune',
    region:      'Western Maharashtra',
    popular:     ['MPSC', 'Police Bharti', 'PMC', 'Talathi Bharti', 'ZP Pune'],
    desc:        'Pune is Maharashtra\'s second largest city and a major hub for MPSC, Police Bharti, PMC, and Zilla Parishad recruitments.',
    faqExtra:    'Which exam has the most vacancies in Pune district? MPSC Combined Group B & C and Maharashtra Police Constable Bharti together announce thousands of vacancies annually in Pune district.',
  },
  {
    slug:        'nagpur',
    name:        'Nagpur',
    nameMr:      'नागपूर',
    cityFilter:  'Nagpur',
    region:      'Vidarbha',
    popular:     ['MPSC', 'Police Bharti', 'NMC', 'Talathi Bharti', 'ZP Nagpur', 'AIIMS Nagpur'],
    desc:        'Nagpur — Maharashtra\'s winter capital — sees high recruitment activity from MPSC, NMC, Zilla Parishad, and central government units like AIIMS Nagpur and CSIR-NEERI.',
    faqExtra:    'Is there a separate recruitment for Vidarbha candidates? Some Maharashtra state-level recruitments (like ZP and Talathi) have district-wise merit lists, meaning Nagpur division candidates are ranked separately.',
  },
  {
    slug:        'nashik',
    name:        'Nashik',
    nameMr:      'नाशिक',
    cityFilter:  'Nashik',
    region:      'Northern Maharashtra',
    popular:     ['MPSC', 'Police Bharti', 'NMC Nashik', 'Talathi Bharti', 'ZP Nashik'],
    desc:        'Nashik district is a major recruitment hub for Nashik Municipal Corporation (NMC), Maharashtra Police, Zilla Parishad, and Talathi Bharti under the Nashik division.',
    faqExtra:    'Which are the most popular exams in Nashik? Maharashtra Police Constable Bharti, Talathi Bharti, and MPSC Combined exams attract the highest number of aspirants from Nashik and surrounding areas.',
  },
  {
    slug:        'thane',
    name:        'Thane',
    nameMr:      'ठाणे',
    cityFilter:  'Thane',
    region:      'Konkan',
    popular:     ['Thane Police', 'KRCL', 'TMC', 'MPSC', 'Police Bharti'],
    desc:        'Thane district offers a wide range of government job opportunities from Thane Municipal Corporation, Konkan Railway (KRCL), Thane Police, and MPSC.',
    faqExtra:    'Does Konkan Railway recruit in Thane district? Yes — KRCL (Konkan Railway Corporation Limited) with its headquarters near Mumbai regularly announces technical and non-technical vacancies relevant to Thane and Konkan region aspirants.',
  },
  {
    slug:        'mumbai',
    name:        'Mumbai',
    nameMr:      'मुंबई',
    cityFilter:  'Mumbai',
    region:      'Mumbai Metropolitan Region',
    popular:     ['Mumbai Police', 'BMC', 'MPSC', 'RBI', 'IBPS', 'SSC', 'SBI'],
    desc:        'Mumbai — Maharashtra\'s capital and financial hub — is home to BMC (one of India\'s largest municipal employers), Mumbai Police, RBI, IBPS, SBI, and major SSC recruitment centres.',
    faqExtra:    'Which govt job has the most vacancies in Mumbai? BMC (Brihanmumbai Municipal Corporation) consistently announces the largest number of vacancies in Mumbai, followed by Mumbai Police.',
  },
  {
    slug:        'aurangabad',
    name:        'Chhatrapati Sambhajinagar',
    nameMr:      'छत्रपती संभाजीनगर',
    cityFilter:  'Aurangabad',
    region:      'Marathwada',
    popular:     ['MPSC', 'Police Bharti', 'ZP Aurangabad', 'Talathi Bharti'],
    desc:        'Chhatrapati Sambhajinagar (formerly Aurangabad) is Marathwada\'s administrative capital with significant MPSC, Police Bharti, and Zilla Parishad recruitment activity.',
    faqExtra:    'Are Marathwada candidates given any priority in local recruitment? Zilla Parishad and Talathi recruitments in Chhatrapati Sambhajinagar follow district-wise merit, benefiting local candidates.',
  },
  {
    slug:        'kolhapur',
    name:        'Kolhapur',
    nameMr:      'कोल्हापूर',
    cityFilter:  'Kolhapur',
    region:      'Western Maharashtra (South)',
    popular:     ['MPSC', 'Police Bharti', 'KMC', 'Talathi Bharti', 'ZP Kolhapur'],
    desc:        'Kolhapur district offers government job opportunities through Kolhapur Municipal Corporation, Maharashtra Police, Zilla Parishad, and MPSC examinations.',
    faqExtra:    'Which exam is most sought-after by Kolhapur aspirants? MPSC Combined (PSI, STI, ASO) and Maharashtra Police Constable Bharti are consistently the most competitive exams for Kolhapur district candidates.',
  },
  {
    slug:        'solapur',
    name:        'Solapur',
    nameMr:      'सोलापूर',
    cityFilter:  'Solapur',
    region:      'Western Maharashtra',
    popular:     ['MPSC', 'Police Bharti', 'Talathi Bharti', 'ZP Solapur'],
    desc:        'Solapur district government job opportunities span MPSC, Maharashtra Police, Talathi Bharti, and Solapur Zilla Parishad.',
    faqExtra:    'Is Solapur a separate district for Police Bharti merit? Yes — Maharashtra Police Bharti follows commissionerate/district-wise merit lists, so Solapur candidates compete in a separate merit pool.',
  },
  {
    slug:        'amravati',
    name:        'Amravati',
    nameMr:      'अमरावती',
    cityFilter:  'Amravati',
    region:      'Vidarbha',
    popular:     ['MPSC', 'Police Bharti', 'ZP Amravati', 'Talathi Bharti'],
    desc:        'Amravati district government jobs include MPSC exams, Maharashtra Police Bharti, and Zilla Parishad vacancies under Amravati division.',
    faqExtra:    'Does Amravati division have separate exam centres? Yes — MPSC, Police Bharti, and Talathi exams offer Amravati division exam centres, reducing travel burden for local aspirants.',
  },
  {
    slug:        'nanded',
    name:        'Nanded',
    nameMr:      'नांदेड',
    cityFilter:  'Nanded',
    region:      'Marathwada',
    popular:     ['MPSC', 'Police Bharti', 'ZP Nanded', 'Talathi Bharti'],
    desc:        'Nanded district in Marathwada region sees government job openings from MPSC, Maharashtra Police, Zilla Parishad Nanded, and Talathi Bharti.',
    faqExtra:    'Are there reserved category-specific cutoffs for Nanded district? Yes — district-level ZP and Talathi recruitments maintain separate category-wise merit lists (OBC, SC, ST, NT, EWS) for Nanded district.',
  },
]

// Slug → district map for fast lookup
const DISTRICT_MAP = Object.fromEntries(DISTRICTS.map(d => [d.slug, d]))

// ── Static params: tell Next.js which district slugs exist ────
export async function generateStaticParams() {
  return DISTRICTS.map(d => ({ district: d.slug }))
}

// ── SEO Metadata (dynamic per district) ──────────────────────
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const district = DISTRICT_MAP[resolvedParams.district]
  if (!district) return {}

  const title = `${district.name} Govt Jobs 2026`
  const description = `Latest government job vacancies in ${district.name} district (${district.region}). ${district.popular.join(', ')} and more — direct official links, no clickbait.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://examudaan.in/jobs/district/${district.slug}`,
    },
    openGraph: {
      title: `${title} | ExamUdaan`,
      description,
      url: `https://examudaan.in/jobs/district/${district.slug}`,
      siteName: 'ExamUdaan.in',
      locale: 'en_IN',
      type: 'website',
    },
  }
}

// ── Page component (Server Component) ────────────────────────
export default async function DistrictJobsPage({ params }) {
  const resolvedParams = await params
  const district = DISTRICT_MAP[resolvedParams.district]

  // 404 for unknown district slugs
  if (!district) notFound()

  const siteUrl = 'https://examudaan.in'
  const pageUrl = `${siteUrl}/jobs/district/${district.slug}`

  // ── Structured data: FAQPage JSON-LD for rich snippets ─────
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are the latest government jobs in ${district.name} district?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ExamUdaan tracks all official government job notifications for ${district.name} district in real time. Popular recruitments include ${district.popular.join(', ')}. Check the listings above for current vacancies.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which exams are most competitive in ${district.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: district.desc,
        },
      },
      {
        '@type': 'Question',
        name: `How do I apply for government jobs in ${district.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `All job listings on ExamUdaan link directly to the official government portal and notification PDF. Click "Apply Online" or "Official PDF" on any listing to reach the authentic government website. Never pay any fee to a third party.`,
        },
      },
      {
        '@type': 'Question',
        name: district.faqExtra.split('?')[0] + '?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: district.faqExtra.split('?').slice(1).join('?').trim(),
        },
      },
    ],
  }

  // ── Breadcrumb JSON-LD ──────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',       item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Jobs',       item: `${siteUrl}/jobs` },
      { '@type': 'ListItem', position: 3, name: `${district.name} Jobs`, item: pageUrl },
    ],
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Client component renders the hero + listing */}
      <DistrictJobsClient district={district} />
    </>
  )
}
