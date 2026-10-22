// ============================================================
// app/jobs/org/[org]/page.js — Organization Specific Job Hub
// Human & Search Engine Friendly Static URL: /jobs/org/mpsc, /jobs/org/upsc, etc.
// ExamUdaan.in | Clean SEO Architecture
// ============================================================

import ListingPage from '../../../../components/ListingPage'
import { fitDescription } from '../../../../lib/seoMetadata'

const ORG_CONFIG = {
  mpsc: {
    orgs: ['MPSC'],
    name: 'MPSC Maharashtra',
    title: 'MPSC Recruitment 2026 — Latest Maharashtra PSC Jobs | ExamUdaan',
    description: 'Apply for 4,124+ active MPSC Maharashtra vacancies 2026. State Services Prelims, Rajyaseva, Combined Group B & C notifications, answer keys & exam dates.',
    heading: 'MPSC Recruitment 2026',
    subheading: 'Official Maharashtra Public Service Commission exam notifications, hall tickets & answer keys',
  },
  upsc: {
    orgs: ['UPSC'],
    name: 'UPSC New Delhi',
    title: 'UPSC Recruitment 2026 — Civil Services, NDA, CDS Jobs | ExamUdaan',
    description: 'Apply for active UPSC Central Government vacancies 2026. Civil Services IAS, IFS, NDA, CDS, CMS, and IES official notifications & deadlines.',
    heading: 'UPSC Recruitment 2026',
    subheading: 'Official Union Public Service Commission All-India exam notifications & application links',
  },
  rrb: {
    orgs: ['RRB'],
    name: 'Railway Recruitment Boards (RRB/RRC)',
    title: 'Railway RRB Recruitment 2026 — NTPC, Group D, ALP & RPF Jobs | ExamUdaan',
    description: 'Apply for 32,000+ Indian Railway RRB vacancies 2026. NTPC, Group D, Assistant Loco Pilot (ALP), and RPF Constable official notifications.',
    heading: 'Railway RRB & RRC Recruitment 2026',
    subheading: 'Official Indian Railways notifications, CEN advertisements, syllabus & application links',
  },
  railway: {
    orgs: ['RRB'],
    name: 'Railway Recruitment Boards (RRB/RRC)',
    title: 'Railway RRB Recruitment 2026 — NTPC, Group D, ALP & RPF Jobs | ExamUdaan',
    description: 'Apply for 32,000+ Indian Railway RRB vacancies 2026. NTPC, Group D, Assistant Loco Pilot (ALP), and RPF Constable official notifications.',
    heading: 'Railway RRB & RRC Recruitment 2026',
    subheading: 'Official Indian Railways notifications, CEN advertisements, syllabus & application links',
  },
  ssc: {
    orgs: ['SSC'],
    name: 'Staff Selection Commission (SSC)',
    title: 'SSC Recruitment 2026 — CGL, CHSL, GD Constable & MTS Jobs | ExamUdaan',
    description: 'Apply for 25,000+ Staff Selection Commission (SSC) vacancies 2026. SSC CGL, CHSL, GD Constable, MTS, and CPO official notifications.',
    heading: 'SSC Recruitment 2026',
    subheading: 'Official Staff Selection Commission exam notifications, tier schedules & answer keys',
  },
  banking: {
    orgs: ['IBPS', 'SBI'],
    name: 'Banking (IBPS & SBI)',
    title: 'Bank Recruitment 2026 — IBPS, SBI PO, Clerk & Specialist Jobs | ExamUdaan',
    description: 'Apply for 18,500+ Public Sector Bank jobs 2026. SBI PO, SBI Clerk, IBPS PO, Clerk, SO, and Regional Rural Bank (RRB) notifications.',
    heading: 'Bank Recruitment 2026 (IBPS & SBI)',
    subheading: 'Official Probationary Officer, Clerk & Specialist Officer vacancies across public sector banks',
  },
  ibps: {
    orgs: ['IBPS', 'SBI'],
    name: 'Banking (IBPS & SBI)',
    title: 'Bank Recruitment 2026 — IBPS, SBI PO, Clerk & Specialist Jobs | ExamUdaan',
    description: 'Apply for 18,500+ Public Sector Bank jobs 2026. SBI PO, SBI Clerk, IBPS PO, Clerk, SO, and Regional Rural Bank (RRB) notifications.',
    heading: 'Bank Recruitment 2026 (IBPS & SBI)',
    subheading: 'Official Probationary Officer, Clerk & Specialist Officer vacancies across public sector banks',
  },
  police: {
    orgs: ['MUMBAI POLICE', 'SRPF', 'THANE POLICE'],
    name: 'Maharashtra Police Bharti',
    title: 'Maharashtra Police Bharti 2026 — Constable, Driver & SRPF Jobs | ExamUdaan',
    description: 'Apply for 3,500+ Maharashtra Police Bharti 2026 vacancies. Mumbai Police Constable, Bandsman, Driver, SRPF & district police ground & written exam alerts.',
    heading: 'Maharashtra Police Bharti 2026',
    subheading: 'Official Police Constable, Driver, Bandsman & SRPF notifications, ground test & written exam merit',
  },
  'mumbai-police': {
    orgs: ['MUMBAI POLICE', 'SRPF'],
    name: 'Maharashtra Mumbai Police',
    title: 'Maharashtra Police Bharti 2026 — Constable, Driver & SRPF Jobs | ExamUdaan',
    description: 'Apply for 3,500+ Maharashtra Police Bharti 2026 vacancies. Mumbai Police Constable, Bandsman, Driver, SRPF & district police ground & written exam alerts.',
    heading: 'Maharashtra Police Bharti 2026',
    subheading: 'Official Police Constable, Driver, Bandsman & SRPF notifications, ground test & written exam merit',
  },
}

function resolveOrgData(rawSlug) {
  const slug = (rawSlug || '').toLowerCase().trim()
  if (ORG_CONFIG[slug]) {
    return { slug, ...ORG_CONFIG[slug] }
  }

  // Fallback: Dynamic uppercase acronym
  const upperAcronym = slug.toUpperCase().replace(/-/g, ' ')
  return {
    slug,
    orgs: [upperAcronym],
    name: upperAcronym,
    title: `${upperAcronym} Recruitment 2026 — Govt Job Vacancies | ExamUdaan`,
    description: `Browse latest official ${upperAcronym} recruitment notifications 2026. Apply online, download notification PDF, check qualifications & deadlines.`,
    heading: `${upperAcronym} Recruitment 2026`,
    subheading: `Official ${upperAcronym} employment notices and exam alerts`,
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const org = resolvedParams?.org
  const data = resolveOrgData(org)

  // Pattern: "{Org} Recruitment 2026 - Latest Govt Jobs & Vacancies", max 60 chars
  let title = `${data.name} Recruitment 2026 - Latest Govt Jobs`
  if (title.length > 60) {
    title = `${data.heading} - Latest Govt Vacancies`
  }
  if (title.length > 60) {
    title = `${data.heading} - Latest Govt Jobs`
  }
  if (title.length > 60) {
    title = `${data.heading}`.slice(0, 60)
  }

  const description = fitDescription(
    data.description || `Browse latest official ${data.name} recruitment notifications 2026. Apply online, download notification PDF & check eligibility.`,
    'Latest vacancies on ExamUdaan.'
  )

  const canonicalUrl = `https://examudaan.in/jobs/org/${data.slug}`

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ExamUdaan',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function OrgJobsPage({ params }) {
  const resolvedParams = await params
  const org = resolvedParams?.org
  const data = resolveOrgData(org)

  return (
    <ListingPage
      defaultType="recruitment"
      initialOrgs={data.orgs}
      title={data.heading}
      subtitle={data.subheading}
    />
  )
}
