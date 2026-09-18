// ============================================================
// app/admit-cards/[slug]/page.js — Admit Card Detail Page
// Shows all available data: exam cities, description, ai_extracted_data,
// documents checklist, all application_links, org info.
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

async function getAdmitCardData(slugParam) {
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

  // Related admit cards — same org first
  const related = await query(
    `SELECT en.id, en.title, en.slug, o.acronym AS org_acronym
     FROM exam_notifications en
     JOIN organizations o ON o.id = en.organization_id
     WHERE en.id != $1
       AND en.status = 'published'
       AND en.notification_type = 'admit_card'
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
  const data = await getAdmitCardData(resolvedParams.slug)
  if (!data) return { title: 'Admit Card | ExamUdaan' }
  const { en } = data
  const rawUrl2 = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
  const siteUrl2 = (rawUrl2 && !rawUrl2.includes('localhost')) ? rawUrl2 : 'https://examudaan.in'
  const canonicalUrl = `${siteUrl2}/admit-cards/${resolvedParams.slug}`
  return {
    title: `${en.title} Admit Card — Download Hall Ticket | ExamUdaan`,
    description: `Download ${en.title} admit card / hall ticket from ${en.org_name}. Exam date: ${formatDate(en.exam_date)}. Check exam centers and download steps.`.slice(0, 160),
    alternates: { canonical: canonicalUrl },
    openGraph: { title: `${en.title} Admit Card`, url: canonicalUrl, type: 'article', siteName: 'ExamUdaan.in' },
  }
}

export default async function AdmitCardDetailPage({ params }) {
  const resolvedParams = await params
  const data = await getAdmitCardData(resolvedParams.slug)

  if (!data) {
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ color: 'var(--on-surface)' }}>Admit Card Not Found</h1>
        <p style={{ color: 'var(--secondary)', marginTop: 8 }}>
          This admit card page does not exist or has been removed.
        </p>
        <Link href="/admit-cards" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
          Browse All Admit Cards
        </Link>
      </div>
    )
  }

  const { en, related } = data

  // ── ai_extracted_data ──────────────────────────────────────
  const ai = en.ai_extracted_data || {}
  const educationLevels  = ai.education_levels || []
  const jobCategories    = ai.job_categories || []
  const citiesNormalized = ai.cities_normalized || []
  const selectionMethods = ai.selection_methods || []
  const govtLevel        = ai.government_level || null

  // ── Links ──────────────────────────────────────────────────
  const downloadLink = en.application_links?.admit_card_link
                    || en.application_links?.hall_ticket_link
                    || en.notification_pdf
                    || en.source_url
                    || null
  const pdfLink = en.notification_pdf || en.source_url || null

  const allLinks = [
    { label: 'Download Admit Card / Hall Ticket', url: downloadLink,                                    icon: 'badge' },
    { label: 'Official Notification PDF',          url: pdfLink && pdfLink !== downloadLink ? pdfLink : null, icon: 'picture_as_pdf' },
    { label: 'Official Website',                   url: en.application_links?.official_website || en.org_website, icon: 'language' },
    { label: 'Check Result',                       url: en.application_links?.result_link,              icon: 'assignment_turned_in' },
    { label: 'Answer Key',                         url: en.application_links?.answer_key_link,          icon: 'fact_check' },
  ].filter(l => l.url)

  // ── Dates ──────────────────────────────────────────────────
  const examDate       = en.exam_date
  const availableFrom  = en.apply_start_date
  const availableTill  = en.apply_end_date  // "available till" for admit cards

  // ── Exam cities: DB column > ai_extracted_data ─────────────
  const examCities = Array.isArray(en.exam_cities) && en.exam_cities.length > 0
    ? en.exam_cities
    : citiesNormalized

  // ── Download steps ─────────────────────────────────────────
  const downloadSteps = [
    `Visit the official website: ${en.org_website || en.application_links?.official_website || `${(en.org_acronym || '').toLowerCase()}.gov.in`}.`,
    'Click on "Admit Card" / "Hall Ticket" link on the homepage or recruitment section.',
    en.advt_no
      ? `Find the admit card for: "${en.title}" (Advt No: ${en.advt_no}).`
      : `Find the admit card link for: "${en.title}".`,
    'Enter your Registration Number / Application Number.',
    'Enter your Date of Birth or Password as required.',
    'Click "Submit" — your hall ticket will appear on screen.',
    'Download the admit card PDF and take 2–3 printouts on A4 paper.',
    'Carry a printed copy along with a valid photo ID to the exam centre.',
  ]

  // ── Documents to carry ─────────────────────────────────────
  // Standard list — shown when no structured data available
  const docsToCarry = [
    'Printed copy of Admit Card (2–3 copies recommended)',
    'Valid Photo ID proof (Aadhaar Card / PAN Card / Voter ID / Passport / Driving License)',
    'Recent passport-size photographs (as specified in notification)',
    'Any other document as mentioned in the official notification',
  ]

  const relatedCards = related.map(r => ({
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
  const pageUrl = `${siteUrl}/admit-cards/${resolvedParams.slug}`

  // JSON-LD: Event schema — admit card is issued for an upcoming exam event
  const examEventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: en.title,
    description: en.description || `${en.title} admit card / hall ticket issued by ${en.org_name}.`,
    startDate: en.exam_date ? new Date(en.exam_date).toISOString() : undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: examCities.length > 0
      ? { '@type': 'Place', name: examCities.slice(0, 3).join(', ') }
      : undefined,
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
      { '@type': 'ListItem', position: 1, name: 'Home',        item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Admit Cards', item: `${siteUrl}/admit-cards` },
      { '@type': 'ListItem', position: 3, name: en.title,      item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(examEventSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '100px' }}>

        {/* Breadcrumb */}
        <DetailBreadcrumb
          sectionLabel="Admit Cards"
          sectionHref="/admit-cards"
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
          {/* AVAILABLE badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', background: '#EFF6FF', color: '#1D4ED8', marginBottom: 14 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>badge</span>
            <T k="card.admit_card" fallback="ADMIT CARD" />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, background: '#EFF6FF', borderRadius: 12, border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#1D4ED8' }}>badge</span>
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
              <span className="info-pill" style={{ background: '#FFF1F2', borderColor: '#FECDD3', color: '#BE123C' }}>
                <span className="material-symbols-outlined">event</span>Exam: {formatDate(examDate)}
              </span>
            )}
            {availableTill && (
              <span className="info-pill">
                <span className="material-symbols-outlined">calendar_today</span>Available Till: {formatDate(availableTill)}
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
            {downloadLink && (
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-primary-lg"
                id="download-admit-card-btn"
                style={{ background: 'linear-gradient(135deg,#1D4ED8,#1E40AF)' }}
              >
                <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>download</span>
                Download Hall Ticket
              </a>
            )}
            {pdfLink && pdfLink !== downloadLink && (
              <a
                href={pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ padding: '10px 20px' }}
                id="admit-card-pdf-btn"
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
                { label: 'Available From',     value: formatDate(availableFrom) },
                { label: 'Available Till',     value: formatDate(availableTill) },
                { label: 'Exam / Test Date',   value: formatDate(examDate) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--outline-variant)' }}>
                  <span style={{ fontSize: 15, color: 'var(--secondary)' }}>{label}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)' }}>{value}</span>
                </div>
              ))}
            </section>

            {/* Exam Cities / Centres */}
            {examCities.length > 0 && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>location_on</span>
                  Exam Cities / Centres ({examCities.length})
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {examCities.map(city => (
                    <span key={city} style={{
                      padding: '6px 14px',
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: 999,
                      fontSize: 13, fontWeight: 500,
                      color: '#1D4ED8',
                    }}>
                      {city}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* How to Download */}
            <section style={sectionStyle}>
              <h2 style={sectionHeadStyle}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>download</span>
                How to Download Admit Card
              </h2>
              <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {downloadSteps.map((step, i) => (
                  <li key={i} style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>{step}</li>
                ))}
              </ol>
            </section>

            {/* Documents to Carry */}
            <section style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: 20 }}>
              <h2 style={{ ...sectionHeadStyle, color: '#1E40AF' }}>
                <span className="material-symbols-outlined">checklist</span>
                Documents to Carry to Exam Hall
              </h2>
              <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {docsToCarry.map((doc, i) => (
                  <li key={i} style={{ fontSize: 14, color: '#1D4ED8', lineHeight: 1.6 }}>{doc}</li>
                ))}
              </ul>
            </section>

            {/* About / Classification context */}
            {(educationLevels.length > 0 || jobCategories.length > 0 || selectionMethods.length > 0) && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>info</span>
                  About This Exam
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
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Selection Stages</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectionMethods.map((m, i) => (
                        <span key={i} style={{ padding: '4px 10px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 999, fontSize: 12, color: '#1D4ED8' }}>
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
                  Notification Details
                </h2>
                <p style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {en.description.length > 2000
                    ? en.description.slice(0, 2000) + '...\n\n[See official PDF for complete details]'
                    : en.description}
                </p>
              </section>
            )}

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
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#1D4ED8' }}>{icon}</span>
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
                Always download your admit card from the official government website. ExamUdaan aggregates information and may not reflect last-minute changes.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div id="admit-card-detail-sidebar">
            <div style={{
              position: 'sticky', top: 'calc(var(--nav-height) + var(--ticker-height) + 12px)',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 16 }}>Quick Info</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'Organization', value: en.org_acronym || en.org_name },
                    govtLevel ? { label: 'Govt Level', value: govtLevel } : null,
                    examDate ? { label: 'Exam Date',    value: formatDate(examDate) } : null,
                    availableTill ? { label: 'Available Till', value: formatDate(availableTill) } : null,
                    en.total_vacancies ? { label: 'Total Posts', value: String(en.total_vacancies) } : null,
                    examCities.length > 0 ? { label: 'Centres',    value: `${examCities.length} cities` } : null,
                    en.advt_no ? { label: 'Advt No', value: en.advt_no } : null,
                  ].filter(Boolean).map(({ label, value }) => (
                    <li key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13, padding: '10px 0', borderBottom: '1px solid var(--outline-variant)', color: 'var(--secondary)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--on-surface)', flexShrink: 0 }}>{label}:</span>
                      <span style={{ textAlign: 'right', fontSize: 12 }}>{value}</span>
                    </li>
                  ))}
                </ul>
                {downloadLink && (
                  <a
                    href={downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    id="sidebar-download-admit-card-btn"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 16, background: 'linear-gradient(135deg,#1D4ED8,#1E40AF)' }}
                  >
                    <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>download</span>
                    Download Hall Ticket
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
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>language</span>Official Website
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
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>phone</span>{en.org_phone}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related admit cards */}
        {relatedCards.length > 0 && (
          <section style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--outline-variant)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 20 }}>Other Admit Cards</h2>
            <div className="grid-2">
              {relatedCards.map(r => (
                <Link key={r.slug} href={`/admit-cards/${r.slug}`} className="job-card" style={{ flexDirection: 'column', gap: 8, textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="truncate-2" style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', flex: 1, lineHeight: 1.4 }}>{r.title}</h3>
                    <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, marginLeft: 8, flexShrink: 0, border: '1px solid #BFDBFE' }}>{r.org}</span>
                  </div>
                  <div className="job-card-meta">
                    <span className="material-symbols-outlined">badge</span>
                    <span>Admit Card Available</span>
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