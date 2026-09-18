// ============================================================
// app/results/[slug]/page.js — Result Detail Page
// Shows all available data: description, ai_extracted_data,
// selection context, all application_links, org info.
// ============================================================

import Link from 'next/link'
import DetailBreadcrumb from '../../../components/DetailBreadcrumb'
import JobDetailTitle from '../../../components/JobDetailTitle'
import { T } from '../../../context/LanguageContext'
import { query, queryOne } from '../../../lib/pgdb'

function formatDate(d) {
  if (!d) return 'TBA'
  try {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return 'TBA' }
}

async function getResultData(slugParam) {
  let id = null
  const idMatch = slugParam.match(/-(\d+)$/) || slugParam.match(/^(\d+)$/)
  if (idMatch) id = parseInt(idMatch[1], 10)

  let en = null
  if (id) {
    en = await queryOne(
      `SELECT en.*, o.name AS org_name, o.name_mr AS org_name_mr, o.acronym AS org_acronym,
              o.website AS org_website, o.address AS org_address, o.phone AS org_phone
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       WHERE en.id = $1`,
      [id]
    )
  }
  if (!en) {
    en = await queryOne(
      `SELECT en.*, o.name AS org_name, o.name_mr AS org_name_mr, o.acronym AS org_acronym,
              o.website AS org_website, o.address AS org_address, o.phone AS org_phone
       FROM exam_notifications en
       JOIN organizations o ON o.id = en.organization_id
       WHERE en.slug = $1`,
      [slugParam]
    )
  }
  if (!en) return null

  // Related results — same org first
  const related = await query(
    `SELECT en.id, en.title, en.slug, en.apply_end_date, o.acronym AS org_acronym
     FROM exam_notifications en
     JOIN organizations o ON o.id = en.organization_id
     WHERE en.id != $1
       AND en.status = 'published'
       AND en.notification_type = 'result'
     ORDER BY
       CASE WHEN o.id = (SELECT organization_id FROM exam_notifications WHERE id = $1) THEN 0 ELSE 1 END,
       en.published_at DESC NULLS LAST
     LIMIT 3`,
    [en.id]
  )
  return { en, related }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const data = await getResultData(resolvedParams.slug)
  if (!data) return { title: 'Result | ExamUdaan' }
  const { en } = data
  const metaTitle =
    en.seo_metadata?.meta_title ||
    `${en.title} Result — Check Scorecard | ExamUdaan`
  const metaDesc =
    en.seo_metadata?.meta_description ||
    `${en.title} result declared by ${en.org_name}. Download scorecard, check merit list, and find out next steps.`
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
  const siteUrl = (rawUrl && !rawUrl.includes('localhost')) ? rawUrl : 'https://examudaan.in'
  const canonicalUrl = `${siteUrl}/results/${resolvedParams.slug}`
  return {
    title: metaTitle,
    description: metaDesc.slice(0, 160),
    alternates: { canonical: canonicalUrl },
    openGraph: { title: metaTitle, description: metaDesc.slice(0, 160), url: canonicalUrl, type: 'article', siteName: 'ExamUdaan.in' },
  }
}

export default async function ResultDetailPage({ params }) {
  const resolvedParams = await params
  const data = await getResultData(resolvedParams.slug)

  if (!data) {
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ color: 'var(--on-surface)' }}>Result Not Found</h1>
        <p style={{ color: 'var(--secondary)', marginTop: 8 }}>
          This result page does not exist or has been removed.
        </p>
        <Link href="/results" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
          Browse All Results
        </Link>
      </div>
    )
  }

  const { en, related } = data

  // ── ai_extracted_data ──────────────────────────────────────
  const ai = en.ai_extracted_data || {}
  const educationLevels  = ai.education_levels || []
  const jobCategories    = ai.job_categories || []
  const selectionMethods = ai.selection_methods || []
  const govtLevel        = ai.government_level || null

  // ── Links ──────────────────────────────────────────────────
  // Result / scorecard: result_link > result_pdf > notification_pdf > source_url
  const resultLink = en.application_links?.result_link
                  || en.application_links?.result_pdf
                  || en.notification_pdf
                  || en.source_url
                  || null
  const pdfLink    = en.notification_pdf || en.source_url || null

  // All available links for Quick Links block
  const allLinks = [
    { label: 'Check Result / Download Scorecard', url: resultLink,                                      icon: 'assignment_turned_in' },
    { label: 'Official Notification PDF',          url: pdfLink,                                        icon: 'picture_as_pdf' },
    { label: 'Official Website',                   url: en.application_links?.official_website || en.org_website, icon: 'language' },
    { label: 'Admit Card',                         url: en.application_links?.admit_card_link,          icon: 'badge' },
    { label: 'Answer Key',                         url: en.application_links?.answer_key_link,          icon: 'fact_check' },
  ].filter(l => l.url)

  const resultDate = en.apply_end_date  // used as "declared date" for results
  const examDate   = en.exam_date

  // Generic steps to check result online
  const checkSteps = [
    `Visit the official website: ${en.org_website || en.application_links?.official_website || `${(en.org_acronym || '').toLowerCase()}.gov.in`}.`,
    'Navigate to the "Results" or "Recruitment" section.',
    en.advt_no
      ? `Find the result for: "${en.title}" (Advt No: ${en.advt_no}).`
      : `Find the result link for: "${en.title}".`,
    'Click on the result link and enter your Registration Number / Roll Number.',
    'Enter your Date of Birth or Password as required.',
    'Your result / scorecard will appear on screen.',
    'Download and save your scorecard / merit list for future reference.',
  ]

  const relatedResults = related.map(r => ({
    slug:  r.org_acronym && r.id ? `${r.org_acronym.toLowerCase()}-${r.id}` : r.slug,
    title: r.title,
    org:   r.org_acronym || 'GOVT',
  }))

  const sectionStyle = {
    background: 'var(--surface-container-lowest)',
    border: '1px solid var(--outline-variant)',
    borderRadius: 12, padding: 20,
    boxShadow: '0 1px 4px rgba(28,25,23,0.04)',
  }
  const sectionHeadStyle = {
    fontSize: 18, fontWeight: 600, color: 'var(--on-surface)',
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
  }

  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
  const siteUrl = (rawUrl && !rawUrl.includes('localhost')) ? rawUrl : 'https://examudaan.in'
  const pageUrl = `${siteUrl}/results/${resolvedParams.slug}`

  // JSON-LD: Event schema — result declaration is a public event of significance
  const resultEventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: en.title,
    description: en.description || `${en.title} result declared by ${en.org_name}.`,
    startDate: en.exam_date ? new Date(en.exam_date).toISOString() : undefined,
    endDate: en.apply_end_date ? new Date(en.apply_end_date).toISOString() : undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: en.org_name || 'Government of India',
      url: en.org_website || siteUrl,
    },
    url: pageUrl,
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',    item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Results', item: `${siteUrl}/results` },
      { '@type': 'ListItem', position: 3, name: en.title,  item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(resultEventSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '100px' }}>

        {/* Breadcrumb */}
        <DetailBreadcrumb
          sectionLabel="Results"
          sectionHref="/results"
          orgAcronym={en.org_acronym}
          title={en.title}
          titleMr={en.title_mr}
        />

        {/* Hero block */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 16, padding: 24,
          boxShadow: '0 1px 8px rgba(28,25,23,0.06)',
          marginBottom: 24,
        }}>
          {/* RESULT DECLARED badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', background: '#F0FDF4', color: '#16A34A', marginBottom: 14 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
            <T k="card.result" fallback="RESULT" />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, background: '#F0FDF4', borderRadius: 12, border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#16A34A' }}>assignment_turned_in</span>
            </div>
            <div style={{ flex: 1 }}>
              <JobDetailTitle
                title={en.title}
                title_mr={en.title_mr}
                orgName={en.org_name}
                orgNameMr={en.org_name_mr}
                orgDepartment={en.org_department}
              />
            </div>
          </div>

          {/* Meta pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {en.advt_no && (
              <span className="info-pill">
                <span className="material-symbols-outlined">tag</span>Advt: {en.advt_no}
              </span>
            )}
            {govtLevel && (
              <span className="info-pill" style={{ background: '#FFF7ED', borderColor: '#FED7AA', color: '#C2410C' }}>
                <span className="material-symbols-outlined">account_balance</span>{govtLevel} Govt
              </span>
            )}
            {examDate && (
              <span className="info-pill">
                <span className="material-symbols-outlined">event</span>Exam: {formatDate(examDate)}
              </span>
            )}
            {resultDate && (
              <span className="info-pill" style={{ background: '#F0FDF4', borderColor: '#BBF7D0', color: '#15803D' }}>
                <span className="material-symbols-outlined">calendar_month</span>Declared: {formatDate(resultDate)}
              </span>
            )}
            {en.total_vacancies && (
              <span className="info-pill">
                <span className="material-symbols-outlined">group</span>{en.total_vacancies} Posts
              </span>
            )}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {resultLink && (
              <a
                href={resultLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-primary-lg"
                id="check-result-btn"
                style={{ background: 'linear-gradient(135deg,#16A34A,#15803D)' }}
              >
                <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>open_in_new</span>
                Check Result / Download Scorecard
              </a>
            )}
            {pdfLink && pdfLink !== resultLink && (
              <a
                href={pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ padding: '10px 20px' }}
                id="result-pdf-btn"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>picture_as_pdf</span>
                Official Notification PDF
              </a>
            )}
          </div>
        </div>

        {/* Two-column layout (Responsive) */}
        <div className="job-detail-layout">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Important Dates */}
            <section style={sectionStyle}>
              <h2 style={sectionHeadStyle}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>calendar_month</span>
                Important Dates
              </h2>
              {[
                { label: 'Exam Conducted',                  value: formatDate(examDate) },
                { label: 'Result Declared',                 value: formatDate(resultDate) },
                { label: 'Document Verification / Next Step', value: 'As per official notification' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--outline-variant)' }}>
                  <span style={{ fontSize: 15, color: 'var(--secondary)' }}>{label}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)' }}>{value}</span>
                </div>
              ))}
            </section>

            {/* Who is this result for — Education & Category context */}
            {(educationLevels.length > 0 || jobCategories.length > 0 || selectionMethods.length > 0) && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>info</span>
                  About This Result
                </h2>
                {educationLevels.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Education Level</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {educationLevels.map(l => (
                        <span key={l} style={{ padding: '4px 10px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#C2410C' }}>
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                {selectionMethods.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Selection Process Was</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectionMethods.map((m, i) => (
                        <span key={i} style={{ padding: '4px 10px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 999, fontSize: 12, color: '#15803D' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Full description */}
            {en.description && en.description.length > 50 && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>description</span>
                  Result Details
                </h2>
                <p style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {en.description.length > 2000
                    ? en.description.slice(0, 2000) + '...\n\n[See official PDF for complete details]'
                    : en.description}
                </p>
              </section>
            )}

            {/* How to Check Result */}
            <section style={sectionStyle}>
              <h2 style={sectionHeadStyle}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>help_outline</span>
                How to Check Result
              </h2>
              <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {checkSteps.map((step, i) => (
                  <li key={i} style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>{step}</li>
                ))}
              </ol>
            </section>

            {/* Quick Links */}
            {allLinks.length > 0 && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>link</span>
                  Quick Links
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
                        borderRadius: 8, textDecoration: 'none',
                        color: 'var(--on-surface)', fontSize: 14, fontWeight: 500,
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

            {/* Disclaimer */}
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20, flexShrink: 0, marginTop: 2 }}>warning</span>
              <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
                Always verify your result on the official government website. ExamUdaan aggregates information and may not reflect last-minute updates.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div id="result-detail-sidebar">
            <div style={{
              position: 'sticky', top: 'calc(var(--nav-height) + var(--ticker-height) + 12px)',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              {/* Quick Info */}
              <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 16 }}>Quick Info</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'Organization', value: en.org_acronym || en.org_name },
                    govtLevel ? { label: 'Govt Level', value: govtLevel } : null,
                    { label: 'Result Date', value: formatDate(resultDate) },
                    examDate ? { label: 'Exam Date', value: formatDate(examDate) } : null,
                    en.total_vacancies ? { label: 'Total Posts', value: String(en.total_vacancies) } : null,
                    en.advt_no ? { label: 'Advt No', value: en.advt_no } : null,
                  ].filter(Boolean).map(({ label, value }) => (
                    <li key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13, padding: '10px 0', borderBottom: '1px solid var(--outline-variant)', color: 'var(--secondary)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--on-surface)', flexShrink: 0 }}>{label}:</span>
                      <span style={{ textAlign: 'right', fontSize: 12 }}>{value}</span>
                    </li>
                  ))}
                </ul>
                {resultLink && (
                  <a
                    href={resultLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    id="sidebar-check-result-btn"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 16, background: 'linear-gradient(135deg,#16A34A,#15803D)' }}
                  >
                    <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>open_in_new</span>
                    Check Result
                  </a>
                )}
              </div>

              {/* Org Info */}
              {(en.org_website || en.org_address || en.org_phone) && (
                <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>Organization</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {en.org_website && (
                      <a href={en.org_website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--primary)', textDecoration: 'none' }}>
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

        {/* Related results */}
        {relatedResults.length > 0 && (
          <section style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--outline-variant)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 20 }}>Other Recent Results</h2>
            <div className="grid-2">
              {relatedResults.map(r => (
                <Link key={r.slug} href={`/results/${r.slug}`} className="job-card" style={{ flexDirection: 'column', gap: 8, textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="truncate-2" style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', flex: 1, lineHeight: 1.4 }}>{r.title}</h3>
                    <span style={{ background: '#F0FDF4', color: '#16A34A', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, marginLeft: 8, flexShrink: 0, border: '1px solid #BBF7D0' }}>{r.org}</span>
                  </div>
                  <div className="job-card-meta">
                    <span className="material-symbols-outlined">assignment_turned_in</span>
                    <span>Result Declared</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}