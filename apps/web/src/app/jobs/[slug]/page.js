// ============================================================
// app/jobs/[slug]/page.js — Job Detail Page (Dynamic DB Fetch)
// Shows ALL available data: ai_extracted_data, application_links,
// posts table, org details, description, selection process, fees.
// ============================================================

import React from 'react'
import Link from 'next/link'
import DetailBreadcrumb from '../../../components/DetailBreadcrumb'
import JobDetailTitle from '../../../components/JobDetailTitle'
import { T } from '../../../context/LanguageContext'
import { query, queryOne } from '../../../lib/pgdb'

// ── Utility: format a date string to "DD Mon YYYY" ──────────
function formatDate(d) {
  if (!d) return 'TBA'
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  } catch {
    return 'TBA'
  }
}

// ── Utility: days remaining from today ──────────────────────
function getDaysLeft(dateStr) {
  if (!dateStr) return null
  try {
    return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  } catch {
    return null
  }
}

// ── Utility: format salary from JSONB ───────────────────────
function formatSalary(salary, posts) {
  if (salary && salary.amount) {
    const s = salary
    const breakdown = s.breakdown
      ? ` (Base ₹${s.breakdown.base?.toLocaleString('en-IN')}${s.breakdown.hra_percentage ? ` + ${s.breakdown.hra_percentage}% HRA` : ''})`
      : ''
    return `₹${Number(s.amount).toLocaleString('en-IN')}/${s.period?.replace('per ', '') || 'month'}${breakdown}`
  }
  const scales = (posts || []).map(p => p.pay_scale).filter(Boolean)
  return scales.length > 0 ? scales.join(' / ') : null
}

// ──────────────────────────────────────────────────────────────
// Database fetch helper
// ──────────────────────────────────────────────────────────────
async function getJobData(slugParam) {
  // Extract numeric ID from slug (e.g. "bmc-514" → 514, or "514" → 514)
  let id = null
  const idMatch = slugParam.match(/-(\d+)$/) || slugParam.match(/^(\d+)$/)
  if (idMatch) id = parseInt(idMatch[1], 10)

  let en = null
  if (id) {
    en = await queryOne(
      `SELECT en.*,
              o.name        AS org_name,
              o.name_mr     AS org_name_mr,
              o.acronym     AS org_acronym,
              o.website     AS org_website,
              o.department  AS org_department,
              o.parent_org  AS org_parent_org,
              o.address     AS org_address,
              o.phone       AS org_phone
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       WHERE en.id = $1`,
      [id]
    )
  }

  // Fallback: match by full slug column
  if (!en) {
    en = await queryOne(
      `SELECT en.*,
              o.name        AS org_name,
              o.name_mr     AS org_name_mr,
              o.acronym     AS org_acronym,
              o.website     AS org_website,
              o.department  AS org_department,
              o.parent_org  AS org_parent_org,
              o.address     AS org_address,
              o.phone       AS org_phone
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       WHERE en.slug = $1`,
      [slugParam]
    )
  }

  if (!en) return null

  // Posts: vacancy breakdown with all columns
  const posts = await query(
    `SELECT post_name, total_vacancies, qualification, pay_scale, category, job_type, reservation_json
     FROM posts
     WHERE notification_id = $1
     ORDER BY id ASC`,
    [en.id]
  )

  // Related: prefer same org first, then fill with any org
  const related = await query(
    `SELECT en.id, en.title, en.slug, en.apply_end_date, en.total_vacancies, o.acronym AS org_acronym
     FROM exam_notifications en
     JOIN organizations o ON o.id = en.organization_id
     WHERE en.id != $1
       AND en.status = 'published'
       AND en.notification_type = 'recruitment'
     ORDER BY
       CASE WHEN o.id = (SELECT organization_id FROM exam_notifications WHERE id = $1) THEN 0 ELSE 1 END,
       en.published_at DESC NULLS LAST
     LIMIT 4`,
    [en.id]
  )

  return { en, posts, related }
}

// ──────────────────────────────────────────────────────────────
// SEO Metadata
// ──────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const data = await getJobData(resolvedParams.slug)
  if (!data) {
    return { title: 'Government Job | ExamUdaan' }
  }
  const { en } = data
  const metaTitle =
    en.seo_metadata?.meta_title ||
    `${en.title} Recruitment — Apply Online | ExamUdaan`
  const metaDesc =
    en.seo_metadata?.meta_description ||
    `Apply for ${en.title}. Total vacancies: ${en.total_vacancies || 'Various'}. Last date: ${formatDate(en.apply_end_date)}. Check eligibility, fee, and how to apply.`
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
  const siteUrl = (rawUrl && !rawUrl.includes('localhost')) ? rawUrl : 'https://examudaan.in'
  const canonicalUrl = `${siteUrl}/jobs/${resolvedParams.slug}`

  return {
    title: metaTitle,
    description: metaDesc.slice(0, 160),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc.slice(0, 160),
      url: canonicalUrl,
      type: 'article',
      siteName: 'ExamUdaan.in',
    },
  }
}

// ──────────────────────────────────────────────────────────────
// Main Page (Server Component)
// ──────────────────────────────────────────────────────────────
export default async function JobDetailPage({ params }) {
  const resolvedParams = await params
  const data = await getJobData(resolvedParams.slug)

  // No data found → 404-style message
  if (!data) {
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ color: 'var(--on-surface)' }}>Job Not Found</h1>
        <p style={{ color: 'var(--secondary)', marginTop: 8 }}>
          This job page does not exist or may have been removed.
        </p>
        <Link href="/jobs" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
          Browse All Jobs
        </Link>
      </div>
    )
  }

  const { en, posts, related } = data

  // ── ai_extracted_data (AI classification) ──────────────
  const ai = en.ai_extracted_data || {}
  const educationLevels     = ai.education_levels || []
  const educationStreams     = ai.education_streams || []
  const educationQuals      = ai.education_qualifications || []
  const jobCategories       = ai.job_categories || []
  const careerStreams        = ai.career_streams || []
  const selectionMethods    = ai.selection_methods || []
  const recruitmentTypes    = ai.recruitment_types || []
  const employmentTypeAI    = ai.employment_type_normalized || null
  const govtLevel           = ai.government_level || null
  const stateNormalized     = ai.state_normalized || null
  const citiesNormalized    = ai.cities_normalized || []
  const expMin              = ai.experience_min_years ?? null
  const expMax              = ai.experience_max_years ?? null

  // ── Walk-in detection ──────────────────────────────────────
  // Walk-in when: explicit flag, OR selection_process contains 'walk-in', 
  // OR contractual employment with exam_date and no application dates
  const selectionProcessText = (en.selection_process || '').toLowerCase()
  const isWalkIn = en.is_walk_in === true
    || selectionProcessText.includes('walk-in')
    || selectionProcessText.includes('walk in')
    || selectionProcessText.includes('interview')
    || (en.employment_type === 'contractual' && !en.apply_start_date && !en.apply_end_date)

  // ── ai_extracted_data: IISER-style has posts[] array ───────
  // ai.posts[] = [{post_name, pay_scale, qualification, vacancies, job_type}]
  const aiPosts = (ai.posts || []).filter(p => p.post_name)

  // ── Merged posts: DB posts table OR ai_extracted_data.posts[] ─
  // Prefer DB posts (already joined), fallback to ai.posts
  const allPosts = posts.length > 0 ? posts : aiPosts

  // ── Salary ─────────────────────────────────────────────────
  const salaryDisplay = formatSalary(en.salary, allPosts)

  // ── Qualifications: JSONB > ai_extracted_data.posts > description ─
  const qualMandatory = en.qualifications?.mandatory?.length
    ? en.qualifications.mandatory
    : educationQuals.length
      ? educationQuals
      : []
  const qualDesirable = en.qualifications?.desirable || []

  // Post-level qual from DB posts or ai.posts
  const postsWithQual = allPosts.filter(p => p.qualification)
  const qualFallback = qualMandatory.length === 0 && postsWithQual.length === 0
    ? 'Refer to the official notification PDF below.'
    : null

  // ── Application details (walk-in note, process, required docs) ─
  const appDetails   = en.application_details || {}
  const requiredDocs = appDetails.required_documents || []
  const appNote      = appDetails.note || null
  const appProcess   = appDetails.process || null

  // ── Advertisement details (reference number, date, authority) ─
  const advtDetails  = en.advertisement_details || {}
  const advtRefNo    = advtDetails.reference_number || en.advt_no || null
  const advtDate     = advtDetails.date || null

  // ── Duration (contractual period) ─────────────────────────────
  const duration = en.duration || null

  // ── Application email (IISER-style) ──────────────────────────
  const appEmail = en.application_email || null

  // ── How to Apply (walk-in vs online) ─────────────────────────
  const applySteps = isWalkIn ? [
    appProcess || 'Check the official notification PDF for the walk-in schedule and venue.',
    appNote || 'Candidates reporting late may not be considered.',
    'Carry all original documents + one set of self-attested photocopies.',
    'Bring recent passport-size photographs.',
    'Reach the venue before the scheduled time.',
  ].filter(Boolean) : [
    `Visit the official website: ${en.application_links?.official_website || en.application_links?.detail_page || en.org_website || `${(en.org_acronym || '').toLowerCase()}.gov.in`}.`,
    'Navigate to the Recruitment / Vacancy / Career section.',
    advtRefNo
      ? `Look for Advertisement Number: ${advtRefNo}.`
      : 'Find the recruitment link for this post.',
    'Register your profile and fill in personal, contact, and education details.',
    'Upload scanned copies of photo, signature, and required certificates.',
    'Pay the application fee via net banking, debit/credit card, or UPI.',
    'Review all fields carefully and submit the application form.',
    'Download and print the submitted application for future reference.',
  ]

  // ── Exam cities: DB column > ai_extracted_data ─────────────
  const examCities = Array.isArray(en.exam_cities) && en.exam_cities.length > 0
    ? en.exam_cities
    : citiesNormalized.length > 0
      ? citiesNormalized
      : []

  // ── Apply link: NEVER '#' — use null and conditionally render
  const applyLink = en.application_links?.apply_online || en.application_links?.detail_page || null
  // Primary PDF from notification_pdf or all_pdfs[0]
  const allPdfs   = en.application_links?.all_pdfs || []
  const pdfLink   = en.notification_pdf
                 || en.application_links?.notification_pdf
                 || allPdfs[0]
                 || en.source_url
                 || null

  // Detail page link (for IISER-style sites)
  const detailPageLink = en.application_links?.detail_page || null



  // ── Urgency / status ───────────────────────────────────────
  // For walk-ins use exam_date; for regular jobs use apply_end_date
  const deadlineDate = isWalkIn ? en.exam_date : en.apply_end_date
  const daysLeft = getDaysLeft(deadlineDate)
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3
  const isClosed = daysLeft !== null && daysLeft < 0

  // ── Total vacancies: DB > sum of aiPosts > null ──────────────
  const totalVacancies = en.total_vacancies
    || allPosts.reduce((sum, p) => sum + (p.total_vacancies || p.vacancies || 0), 0)
    || null

  const allLinks = [
    { label: 'Apply Online',              url: en.application_links?.apply_online,       icon: 'open_in_new' },
    { label: 'View Job Details',          url: detailPageLink && detailPageLink !== en.application_links?.apply_online ? detailPageLink : null, icon: 'open_in_new' },
    { label: 'Official Website',          url: en.application_links?.official_website || en.org_website, icon: 'language' },
    { label: 'Official Notification PDF', url: pdfLink,                                  icon: 'picture_as_pdf' },
    { label: 'Result Link',               url: en.application_links?.result_link,        icon: 'assignment_turned_in' },
    { label: 'Admit Card',                url: en.application_links?.admit_card_link,    icon: 'badge' },
    { label: 'Answer Key',                url: en.application_links?.answer_key_link,    icon: 'fact_check' },
    // Extra PDFs (IISER-style)
    ...allPdfs.slice(1).map((url, i) => ({ label: `Notification PDF ${i + 2}`, url, icon: 'picture_as_pdf' })),
  ].filter(l => l.url)


  // ── Related jobs ───────────────────────────────────────────
  const relatedJobs = related.map(r => ({
    slug:  r.org_acronym && r.id ? `${r.org_acronym.toLowerCase()}-${r.id}` : r.slug,
    title: r.title,
    org:   r.org_acronym || 'GOVT',
    posts: r.total_vacancies ? `${r.total_vacancies} Posts` : 'Various Posts',
    ends:  r.apply_end_date ? `Ends ${formatDate(r.apply_end_date)}` : 'Active',
  }))

  // ── Shared section card style ──────────────────────────────
  const sectionStyle = {
    background: 'var(--surface-container-lowest)',
    border: '1px solid var(--outline-variant)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(28,25,23,0.04)',
  }

  const sectionHeadStyle = {
    fontSize: 18, fontWeight: 600, color: 'var(--on-surface)',
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
  }

  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
  const siteUrl = (rawUrl && !rawUrl.includes('localhost')) ? rawUrl : 'https://examudaan.in'
  const pageUrl = `${siteUrl}/jobs/${resolvedParams.slug}`

  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: en.title,
    description: en.summary_mr || en.description || en.title,
    datePosted: en.published_at ? new Date(en.published_at).toISOString() : new Date().toISOString(),
    validThrough: en.apply_end_date ? new Date(en.apply_end_date).toISOString() : undefined,
    employmentType: en.employment_type === 'contractual' ? 'CONTRACTOR' : 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: en.org_name || 'Government of Maharashtra',
      sameAs: en.org_website || siteUrl,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: (en.exam_cities && en.exam_cities[0]) || 'Mumbai',
        addressRegion: en.state_slug || 'Maharashtra',
        addressCountry: 'IN',
      },
    },
    directApply: true,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${siteUrl}/jobs` },
      { '@type': 'ListItem', position: 3, name: en.title, item: pageUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '100px' }}>

        {/* ── Breadcrumb ───────────────────────────────────── */}
        <DetailBreadcrumb
          sectionLabel="Jobs"
          sectionHref="/jobs"
          orgAcronym={en.org_acronym}
          title={en.title}
          titleMr={en.title_mr}
        />

        {/* ── Hero / Title Block ───────────────────────────── */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 8px rgba(28,25,23,0.06)',
          marginBottom: '24px',
          position: 'relative',
        }}>
          {/* Status badges */}
          {isUrgent && !isClosed && (
            <div className="urgency-badge" style={{ background: 'var(--error-container)', color: 'var(--on-error-container)' }}>
              LAST {daysLeft === 0 ? 'DAY' : `${daysLeft} DAYS`}
            </div>
          )}
          {isClosed && (
            <div className="urgency-badge" style={{ background: 'var(--surface-container-high)', color: 'var(--secondary)' }}>
              CLOSED
            </div>
          )}

          {/* Org icon + title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
            <div className="detail-org-icon" style={{
              background: 'var(--surface-container-low)',
              borderRadius: '12px',
              border: '1px solid var(--outline-variant)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--primary)' }}>
                account_balance
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <JobDetailTitle
                title={en.title}
                title_mr={en.title_mr}
                orgName={en.org_name}
                orgNameMr={en.org_name_mr}
                orgDepartment={en.org_department}
              />
              {en.summary_mr && (
                <div style={{
                  background: '#FFF7ED',
                  border: '1px solid #FED7AA',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginTop: '12px',
                  fontSize: '14px',
                  color: '#9A3412',
                  lineHeight: '1.5'
                }}>
                  <strong style={{ display: 'block', marginBottom: 2, fontSize: 13 }}>📌 परीक्षेचा सारांश (मराठी):</strong>
                  {en.summary_mr}
                </div>
              )}
            </div>
          </div>

          {/* Meta pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {en.advt_no && (
              <span className="info-pill">
                <span className="material-symbols-outlined">tag</span>
                Advt: {en.advt_no}
              </span>
            )}
            {/* Government level badge */}
            {govtLevel && (
              <span className="info-pill" style={{ background: '#FFF7ED', borderColor: '#FED7AA', color: '#C2410C' }}>
                <span className="material-symbols-outlined">account_balance</span>
                {govtLevel} Govt
              </span>
            )}
            {/* Location: exam cities or state */}
            {examCities.length > 0 && (
              <span className="info-pill">
                <span className="material-symbols-outlined">location_on</span>
                {examCities.slice(0, 3).join(', ')}{examCities.length > 3 ? ` +${examCities.length - 3} more` : ''}
              </span>
            )}
            {stateNormalized && examCities.length === 0 && (
              <span className="info-pill">
                <span className="material-symbols-outlined">location_on</span>
                {stateNormalized}
              </span>
            )}
            {/* Employment type */}
            {(en.employment_type || employmentTypeAI) && (
              <span className="info-pill">
                <span className="material-symbols-outlined">work</span>
                {en.employment_type || employmentTypeAI}
              </span>
            )}
            {salaryDisplay && (
              <span className="info-pill">
                <span className="material-symbols-outlined">payments</span>
                {salaryDisplay}
              </span>
            )}
            {totalVacancies && (
              <span className="info-pill">
                <span className="material-symbols-outlined">group</span>
                {totalVacancies} Posts
              </span>
            )}
            {/* Experience */}
            {(expMin !== null || expMax !== null) && (
              <span className="info-pill">
                <span className="material-symbols-outlined">workspace_premium</span>
                Exp: {expMin !== null ? `${expMin}` : '0'}{expMax !== null ? `–${expMax}` : '+'} yrs
              </span>
            )}
            {/* Selection process preview */}
            {selectionMethods.length > 0 && (
              <span className="info-pill">
                <span className="material-symbols-outlined">assignment_turned_in</span>
                {selectionMethods.slice(0, 2).join(' → ')}{selectionMethods.length > 2 ? '…' : ''}
              </span>
            )}
          </div>

          {/* CTA buttons — stacks vertically on small mobile */}
          <div className="detail-cta-row">
            {/* Walk-in badge */}
            {isWalkIn && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, fontSize: 13, color: '#1D4ED8', fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>how_to_reg</span>
                Walk-in Interview — No online application required
              </span>
            )}
            {/* Only render apply button if we have a real link and NOT a walk-in */}
            {!isClosed && !isWalkIn && applyLink && (
              <a
                href={applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-primary-lg"
                id="apply-online-btn"
              >
                <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>open_in_new</span>
                <T k="card.apply_online" fallback="Apply Online" />
              </a>
            )}
            {/* Walk-in: show detail page link as primary CTA */}
            {isWalkIn && detailPageLink && (
              <a
                href={detailPageLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-primary-lg"
                id="view-details-btn"
                style={{ background: '#1D4ED8' }}
              >
                <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>open_in_new</span>
                <T k="card.view_details" fallback="View Official Details" />
              </a>
            )}
            {pdfLink && (
              <a
                href={pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ padding: '10px 20px' }}
                id="notification-pdf-btn"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>picture_as_pdf</span>
                <T k="card.official_pdf" fallback="Official Notification PDF" />
              </a>
            )}
          </div>
        </div>

        {/* ── Two-column layout (Responsive: 1 col on mobile/tablet <900px, 2 col on laptop/desktop) ── */}
        <div className="job-detail-layout">

          {/* ════ LEFT COLUMN ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ── Important Dates ─────────────────────────── */}
            <section style={sectionStyle}>
              <h2 style={sectionHeadStyle}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>calendar_month</span>
                <T k="detail.important_dates" fallback="Important Dates" />
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {isWalkIn ? (
                  // Walk-in: show walk-in date if available, else notification date + PDF note
                  [
                    en.exam_date
                      ? { label: 'Walk-in / Interview Date', value: formatDate(en.exam_date), urgent: isUrgent && !isClosed, highlight: true }
                      : { label: 'Walk-in / Interview Date', value: null },
                    advtDate ? { label: 'Notification Date', value: formatDate(advtDate) } : null,
                    advtRefNo ? { label: 'Reference / Advt No', value: advtRefNo } : null,
                    duration  ? { label: 'Duration / Tenure',  value: duration } : null,
                  ].filter(Boolean).map(({ label, value, urgent, highlight }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid var(--outline-variant)', gap: 12 }}>
                      <span style={{ fontSize: 15, color: 'var(--secondary)', flexShrink: 0 }}>{label}</span>
                      {value ? (
                        <span style={{ fontSize: 15, fontWeight: 600, textAlign: 'right', color: urgent ? 'var(--error)' : highlight ? 'var(--primary)' : 'var(--on-surface)' }}>
                          {value}
                        </span>
                      ) : (
                        // No exam_date — link to PDF
                        <span style={{ fontSize: 14, textAlign: 'right' }}>
                          <span style={{ color: 'var(--secondary)', marginRight: 6 }}>See notification PDF</span>
                          {pdfLink && (
                            <a href={pdfLink} target="_blank" rel="noopener noreferrer"
                              style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', fontSize: 13 }}>
                              📄 Open PDF
                            </a>
                          )}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  // Normal recruitment: start, end, exam date, advt details
                  [
                    en.apply_start_date ? { label: 'Application Start Date', value: formatDate(en.apply_start_date) } : null,
                    { label: 'Last Date to Apply', value: formatDate(en.apply_end_date), urgent: isUrgent && !isClosed },
                    en.exam_date ? { label: 'Exam / Interview Date', value: formatDate(en.exam_date) } : null,
                    advtDate ? { label: 'Notification Date', value: formatDate(advtDate) } : null,
                    advtRefNo ? { label: 'Reference / Advt No', value: advtRefNo } : null,
                  ].filter(Boolean).map(({ label, value, urgent }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--outline-variant)' }}>
                      <span style={{ fontSize: 15, color: 'var(--secondary)' }}>{label}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: urgent ? 'var(--error)' : 'var(--on-surface)' }}>
                        {value}
                      </span>
                    </div>
                  ))
                )}
                {/* Application email if available */}
                {appEmail && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--outline-variant)' }}>
                    <span style={{ fontSize: 15, color: 'var(--secondary)' }}>Application Email</span>
                    <a href={`mailto:${appEmail}`} style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>{appEmail}</a>
                  </div>
                )}
              </div>
            </section>

            {/* ── Eligibility Criteria ─────────────────────── */}
            <section style={sectionStyle}>
              <h2 style={sectionHeadStyle}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>check_circle</span>
                <T k="detail.eligibility" fallback="Eligibility & Age Limit" />
              </h2>

              {/* Age limit */}
              {(en.age_limit?.min || en.age_limit?.max || en.age_limit?.max_open) ? (
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Age Limit</h3>
                  <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {en.age_limit.min && <li style={{ fontSize: 14, color: 'var(--secondary)' }}>Minimum Age: {en.age_limit.min} Years</li>}
                    {(en.age_limit.max || en.age_limit.max_open) && <li style={{ fontSize: 14, color: 'var(--secondary)' }}>Maximum Age (Open/General): {en.age_limit.max || en.age_limit.max_open} Years</li>}
                    {en.age_limit.max_reserved && <li style={{ fontSize: 14, color: 'var(--secondary)' }}>Maximum Age (Reserved): {en.age_limit.max_reserved} Years</li>}
                    {en.age_limit.obc_relax && <li style={{ fontSize: 14, color: 'var(--secondary)' }}>OBC Relaxation: +{en.age_limit.obc_relax} Years</li>}
                    {en.age_limit.sc_st_relax && <li style={{ fontSize: 14, color: 'var(--secondary)' }}>SC/ST Relaxation: +{en.age_limit.sc_st_relax} Years</li>}
                  </ul>
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Age Limit</h3>
                  <p style={{ fontSize: 14, color: 'var(--secondary)', paddingLeft: 8 }}>Refer to the official notification PDF for age limits and relaxation rules.</p>
                </div>
              )}

              {/* Education level tags */}
              {(educationLevels.length > 0 || educationStreams.length > 0) && (
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Education Required</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {educationLevels.map(l => (
                      <span key={l} style={{ padding: '4px 10px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#C2410C' }}>
                        {l}
                      </span>
                    ))}
                    {educationStreams.map(s => (
                      <span key={s} style={{ padding: '4px 10px', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: 999, fontSize: 12, color: 'var(--secondary)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mandatory qualifications */}
              {qualMandatory.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Essential Qualification</h3>
                  <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {qualMandatory.map((q, i) => (
                      <li key={i} style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Desirable qualifications */}
              {qualDesirable.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Desirable / Preferred</h3>
                  <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {qualDesirable.map((q, i) => (
                      <li key={i} style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fallback when no structured qual data */}
              {qualMandatory.length === 0 && qualDesirable.length === 0 && qualFallback && (
                <p style={{ fontSize: 14, color: 'var(--secondary)', paddingLeft: 8, lineHeight: 1.5 }}>{qualFallback}</p>
              )}

              {/* Post-level qualification from allPosts (DB posts or ai.posts) */}
              {qualMandatory.length === 0 && postsWithQual.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Qualification (by Post)</h3>
                  <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {postsWithQual.map((p, i) => (
                      <li key={i} style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--on-surface)' }}>{p.post_name}:</strong> {p.qualification}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Experience */}
              {(expMin !== null || expMax !== null) && (
                <div style={{ marginTop: 4 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Experience Required</h3>
                  <p style={{ fontSize: 14, color: 'var(--secondary)', paddingLeft: 8 }}>
                    {expMin !== null && expMax !== null
                      ? `${expMin} to ${expMax} years`
                      : expMin !== null
                        ? `Minimum ${expMin} year${expMin !== 1 ? 's' : ''}`
                        : `Maximum ${expMax} years`}
                  </p>
                </div>
              )}
            </section>

            {/* ── Vacancy Details Table ──────────────────────── */}
            {allPosts.length > 0 && (
              <section style={{ ...sectionStyle, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 20px 12px' }}>
                  <h2 style={sectionHeadStyle}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>group</span>
                    <T k="detail.vacancy_breakdown" fallback="Vacancy Breakdown" /> {totalVacancies ? `(Total: ${totalVacancies})` : ''}
                  </h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Post Name</th>
                        <th style={{ textAlign: 'right' }}>Vacancies</th>
                        {allPosts.some(p => p.pay_scale) && <th>Pay Scale</th>}
                        {allPosts.some(p => p.qualification) && <th>Qualification</th>}
                        {allPosts.some(p => p.job_type) && <th>Type</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {allPosts.map((post, i) => (
                        <React.Fragment key={i}>
                          <tr>
                            <td style={{ fontWeight: 500 }}>{post.post_name}</td>
                            <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                              {post.total_vacancies ?? post.vacancies ?? 'Various'}
                            </td>
                            {allPosts.some(p => p.pay_scale) && (
                              <td style={{ fontSize: 13, color: 'var(--secondary)' }}>{post.pay_scale || '—'}</td>
                            )}
                            {allPosts.some(p => p.qualification) && (
                              <td style={{ fontSize: 13, color: 'var(--secondary)', maxWidth: 250 }}>{post.qualification || '—'}</td>
                            )}
                            {allPosts.some(p => p.job_type) && (
                              <td style={{ fontSize: 13, color: 'var(--secondary)' }}>{post.job_type || '—'}</td>
                            )}
                          </tr>
                          {post.reservation_json && Object.keys(post.reservation_json).length > 0 && (
                            <tr style={{ background: '#FFFBF5' }}>
                              <td
                                colSpan={2 + (allPosts.some(p => p.pay_scale) ? 1 : 0) + (allPosts.some(p => p.qualification) ? 1 : 0) + (allPosts.some(p => p.job_type) ? 1 : 0)}
                                style={{ padding: '6px 12px 10px' }}
                              >
                                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                                  Category-wise Breakup:
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                  {Object.entries(post.reservation_json).map(([cat, count]) => (
                                    <span key={cat} style={{
                                      padding: '3px 10px',
                                      background: 'var(--surface-container-low)',
                                      border: '1px solid var(--outline-variant)',
                                      borderRadius: 999, fontSize: 12, fontWeight: 600, color: 'var(--on-surface)',
                                    }}>
                                      {cat.toUpperCase()}: {count}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ── Selection Process ─────────────────────────── */}
            {selectionMethods.length > 0 && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>route</span>
                  <T k="detail.selection_process" fallback="Selection Process" />
                </h2>
                <div className="selection-steps-row">
                  {selectionMethods.map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 14px',
                        background: 'var(--surface-container-low)',
                        border: '1px solid var(--outline-variant)',
                        borderRadius: 8,
                        fontSize: 13, fontWeight: 600, color: 'var(--on-surface)',
                      }}>
                        <span style={{
                          width: 20, height: 20,
                          background: 'var(--primary)',
                          color: '#fff',
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, flexShrink: 0,
                        }}>
                          {i + 1}
                        </span>
                        {step}
                      </div>
                      {i < selectionMethods.length - 1 && (
                        <span className="material-symbols-outlined selection-step-arrow" style={{ color: 'var(--secondary)', fontSize: 18 }}>arrow_forward</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Application Fee ───────────────────────────── */}
            {(en.application_fee?.general || en.application_fee?.open || en.application_fee?.sc_st || en.application_fee?.reserved) && (
              <section style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '12px', padding: '20px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#92400E', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined">payments</span>
                  <T k="detail.application_fee" fallback="Application Fee" />
                </h2>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {(en.application_fee.general || en.application_fee.open) && (
                    <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.7)', borderRadius: 8, minWidth: 100 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#B45309', textTransform: 'uppercase', marginBottom: 4 }}>General / Open</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>₹{en.application_fee.general || en.application_fee.open}</div>
                    </div>
                  )}
                  {(en.application_fee.sc_st || en.application_fee.reserved) && (
                    <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.7)', borderRadius: 8, minWidth: 100 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#B45309', textTransform: 'uppercase', marginBottom: 4 }}>SC / ST / Reserved</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>₹{en.application_fee.sc_st || en.application_fee.reserved}</div>
                    </div>
                  )}
                  {en.application_fee.women !== undefined && en.application_fee.women !== null && (
                    <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.7)', borderRadius: 8, minWidth: 100 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#B45309', textTransform: 'uppercase', marginBottom: 4 }}>Female Candidates</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>
                        {en.application_fee.women === 0 ? 'Free' : `₹${en.application_fee.women}`}
                      </div>
                    </div>
                  )}
                  {en.application_fee.note && (
                    <div style={{ width: '100%', marginTop: 4, fontSize: 13, color: '#92400E', fontStyle: 'italic' }}>
                      Note: {en.application_fee.note}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ── How to Apply ──────────────────────────────── */}
            <section style={sectionStyle}>
              <h2 style={sectionHeadStyle}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>description</span>
                <T k="detail.how_to_apply" fallback="How to Apply" />
              </h2>
              <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {applySteps.map((step, i) => (
                  <li key={i} style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>{step}</li>
                ))}
              </ol>

              {/* Application email */}
              {en.application_email && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--surface-container)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>mail</span>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 600 }}>Send Applications To:</div>
                    <a href={`mailto:${en.application_email}`} style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 600 }}>
                      {en.application_email}
                    </a>
                  </div>
                </div>
              )}

              {/* Required documents */}
              {requiredDocs.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Required Documents</h3>
                  <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {requiredDocs.map((doc, i) => (
                      <li key={i} style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.5 }}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* ── Exam Cities / Centres ─────────────────────── */}
            {examCities.length > 0 && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>location_on</span>
                  Exam Cities / Centres
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {examCities.map(city => (
                    <span key={city} style={{
                      padding: '5px 12px',
                      background: 'var(--surface-container-low)',
                      border: '1px solid var(--outline-variant)',
                      borderRadius: 999,
                      fontSize: 13,
                      color: 'var(--on-surface)',
                    }}>
                      {city}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* ── Full Description / Thin-content fallback ────── */}
            {en.description && en.description.length > 50 ? (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>info</span>
                  About This Notification
                </h2>
                <p style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {en.description.length > 2000
                    ? en.description.slice(0, 2000) + '...\n\n[See official PDF for complete details]'
                    : en.description}
                </p>
              </section>
            ) : (
              /* Thin-content fallback: show when Gemini extraction yielded little text.
                 Prevents Google from flagging this as a thin/low-quality page. */
              pdfLink && (
                <section style={{ ...sectionStyle, textAlign: 'center', padding: '28px 20px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--primary)', display: 'block', marginBottom: 8 }}>picture_as_pdf</span>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>
                    Full details available in the Official Notification PDF
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 16 }}>
                    Eligibility criteria, vacancy details, application fee, and selection process are
                    available in the official document published by {en.org_name || 'the organisation'}.
                  </p>
                  <a
                    href={pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ display: 'inline-flex', gap: 8 }}
                    id="thin-content-pdf-btn"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
                    Download Official Notification
                  </a>
                </section>
              )
            )}

            {/* ── AI Classification Tags ────────────────────── */}
            {(jobCategories.length > 0 || careerStreams.length > 0 || recruitmentTypes.length > 0) && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>label</span>
                  Job Classification
                </h2>
                {jobCategories.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Job Category</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {jobCategories.map(c => (
                        <span key={c} style={{ padding: '4px 10px', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: 999, fontSize: 12, color: 'var(--on-surface)' }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {careerStreams.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Career Stream</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {careerStreams.map(s => (
                        <span key={s} style={{ padding: '4px 10px', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: 999, fontSize: 12, color: 'var(--on-surface)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {recruitmentTypes.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Recruitment Type</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {recruitmentTypes.map(t => (
                        <span key={t} style={{ padding: '4px 10px', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: 999, fontSize: 12, color: 'var(--on-surface)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ── Quick Links ───────────────────────────────── */}
            {allLinks.length > 0 && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>link</span>
                  <T k="detail.official_links" fallback="Official Application & Gazette Links" />
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {allLinks.map(({ label, url, icon }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px',
                        background: 'var(--surface-container-low)',
                        border: '1px solid var(--outline-variant)',
                        borderRadius: 8,
                        textDecoration: 'none',
                        color: 'var(--on-surface)',
                        fontSize: 14,
                        fontWeight: 500,
                        transition: 'background 0.15s',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>{icon}</span>
                      {label}
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--secondary)', marginLeft: 'auto' }}>open_in_new</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* ── Disclaimer ─────────────────────────────────── */}
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20, flexShrink: 0, marginTop: 2 }}>info</span>
              <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
                Always verify information on the official government website before applying. ExamUdaan aggregates data and may not reflect last-minute changes.
              </p>
            </div>
          </div>

          {/* ════ RIGHT COLUMN — SIDEBAR ════ */}
          <div id="job-detail-sidebar">
            <div style={{
              position: 'sticky',
              top: 'calc(var(--nav-height) + var(--ticker-height) + 12px)',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>

              {/* Quick Summary */}
              <div style={{
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                borderRadius: '12px', padding: '20px',
                boxShadow: '0 1px 4px rgba(28,25,23,0.04)',
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 16 }}>
                  <T k="detail.quick_summary" fallback="Quick Summary" />
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'Organization',  value: en.org_acronym || 'GOVT' },
                    en.org_department         ? { label: 'Department',    value: en.org_department }       : null,
                    en.org_parent_org         ? { label: 'Parent Org',    value: en.org_parent_org }       : null,
                    govtLevel                 ? { label: 'Govt Level',    value: govtLevel }               : null,
                    totalVacancies            ? { label: 'Total Posts',   value: String(totalVacancies) }  : null,
                    (en.employment_type || employmentTypeAI) ? { label: 'Employment',   value: en.employment_type || employmentTypeAI } : null,
                    salaryDisplay             ? { label: 'Salary',        value: salaryDisplay }           : null,
                    { label: 'Last Date',     value: formatDate(en.apply_end_date) },
                    en.advt_no                ? { label: 'Advt No',       value: en.advt_no }              : null,
                  ].filter(Boolean).map(({ label, value }) => (
                    <li key={label} style={{
                      display: 'flex', justifyContent: 'space-between', gap: 8,
                      fontSize: 13, padding: '10px 0',
                      borderBottom: '1px solid var(--outline-variant)',
                      color: 'var(--secondary)',
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--on-surface)', flexShrink: 0 }}>{label}:</span>
                      <span style={{
                        textAlign: 'right',
                        color: label === 'Last Date' && isUrgent ? 'var(--error)' : undefined,
                        fontWeight: label === 'Last Date' ? 600 : 400,
                        fontSize: 12,
                        wordBreak: 'break-word',
                      }}>
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
                {/* Apply button */}
                {!isClosed && applyLink && (
                  <a
                    href={applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 16, marginBottom: 8 }}
                  >
                    <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>open_in_new</span>
                    Apply Now
                  </a>
                )}
                {pdfLink && (
                  <a
                    href={pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '8px', borderRadius: 8,
                      background: 'var(--surface-container-low)',
                      border: '1px solid var(--outline-variant)',
                      textDecoration: 'none', color: 'var(--on-surface)',
                      fontSize: 13, fontWeight: 500,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>picture_as_pdf</span>
                    View Notification PDF
                  </a>
                )}
              </div>

              {/* Organization Info */}
              {(en.org_website || en.org_address || en.org_phone) && (
                <div style={{
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: '12px', padding: '16px',
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                    Organization
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {en.org_website && (
                      <a
                        href={en.org_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--primary)', textDecoration: 'none' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>language</span>
                        Official Website
                      </a>
                    )}
                    {en.org_address && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: 'var(--secondary)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16, flexShrink: 0 }}>location_on</span>
                        {en.org_address}
                      </div>
                    )}
                    {en.org_phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--secondary)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>phone</span>
                        {en.org_phone}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Related Jobs ─────────────────────────────────── */}
        {relatedJobs.length > 0 && (
          <section style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--outline-variant)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: '20px' }}>
              <T k="detail.similar_jobs" fallback="Similar Opportunities" />
            </h2>
            <div className="grid-2">
              {relatedJobs.map(rj => (
                <Link
                  key={rj.slug}
                  href={`/jobs/${rj.slug}`}
                  className="job-card"
                  style={{ flexDirection: 'column', gap: 8, textDecoration: 'none' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="truncate-2" style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', flex: 1, lineHeight: 1.4 }}>
                      {rj.title}
                    </h3>
                    <span style={{
                      background: 'var(--surface-container-low)', color: 'var(--secondary)',
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                      marginLeft: 8, flexShrink: 0, border: '1px solid var(--outline-variant)',
                    }}>
                      {rj.org}
                    </span>
                  </div>
                  <div className="job-card-meta">
                    <span className="material-symbols-outlined">group</span>
                    <span>{rj.posts}</span>
                  </div>
                  <div className="job-card-meta">
                    <span className="material-symbols-outlined">calendar_today</span>
                    <span>{rj.ends}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Sticky Mobile Bar — sits above mobile bottom nav (z-index: 55 > bottom-nav z-50) ── */}
      {!isClosed && applyLink && (
        <div
          id="mobile-action-bar"
          style={{
            display: 'flex', position: 'fixed', bottom: 0, left: 0, width: '100%',
            background: 'var(--surface-container-lowest)',
            borderTop: '1px solid var(--outline-variant)',
            boxShadow: '0 -2px 16px rgba(28,25,23,0.08)',
            padding: '12px 16px', zIndex: 55,
            alignItems: 'center', justifyContent: 'space-between', gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--error)', letterSpacing: '0.04em' }}>
              Ends {formatDate(en.apply_end_date)}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {en.org_name}
            </div>
          </div>
          <a
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-primary-lg"
            style={{ flexShrink: 0 }}
            id="mobile-apply-now-btn"
          >
            Apply Now
          </a>
        </div>
      )}
    </>
  )
}
