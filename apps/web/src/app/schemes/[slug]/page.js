// ============================================================
// app/schemes/[slug]/page.js — Syllabus / Exam Pattern Detail Page
// DB notification_type: 'syllabus'  |  URL section: /schemes
//
// Shows: title, org info, description, selection process, eligibility,
// official PDF + links, related syllabi, JSON-LD Course schema.
// ============================================================

import Link from 'next/link'
import DetailBreadcrumb from '../../../components/DetailBreadcrumb'
import JobDetailTitle from '../../../components/JobDetailTitle'
import { T } from '../../../context/LanguageContext'
import { query, queryOne } from '../../../lib/pgdb'

// ── Helpers ───────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return 'TBA'
  try {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return 'TBA' }
}

// ── DB fetch ──────────────────────────────────────────────────
async function getSyllabusData(slugParam) {
  // Resolve ID from trailing digits in slug (e.g. "upsc-514" -> 514)
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

  // Related syllabi — same org first
  const related = await query(
    `SELECT en.id, en.title, en.slug, en.published_at, o.acronym AS org_acronym
     FROM exam_notifications en
     JOIN organizations o ON o.id = en.organization_id
     WHERE en.id != $1
       AND en.status = 'published'
       AND en.notification_type = 'syllabus'
     ORDER BY
       CASE WHEN o.id = (SELECT organization_id FROM exam_notifications WHERE id = $1) THEN 0 ELSE 1 END,
       en.published_at DESC NULLS LAST
     LIMIT 3`,
    [en.id]
  )
  return { en, related }
}

// ── SEO Metadata ──────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const data = await getSyllabusData(resolvedParams.slug)
  if (!data) return { title: 'Syllabus | ExamUdaan' }
  const { en } = data
  const metaTitle =
    en.seo_metadata?.meta_title ||
    `${en.title} Syllabus and Exam Pattern | ExamUdaan`
  const metaDesc = (
    en.seo_metadata?.meta_description ||
    `Download ${en.title} official syllabus from ${en.org_name}. Check topics, marking scheme, paper pattern, and selection process.`
  ).slice(0, 160)
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
  const siteUrl = (rawUrl && !rawUrl.includes('localhost')) ? rawUrl : 'https://examudaan.in'
  const canonicalUrl = `${siteUrl}/schemes/${resolvedParams.slug}`
  return {
    title: metaTitle,
    description: metaDesc,
    alternates: { canonical: canonicalUrl },
    openGraph: { title: metaTitle, description: metaDesc, url: canonicalUrl, type: 'article', siteName: 'ExamUdaan.in' },
  }
}

// ── Main Page ─────────────────────────────────────────────────
export default async function SyllabusDetailPage({ params }) {
  const resolvedParams = await params
  const data = await getSyllabusData(resolvedParams.slug)

  // 404 state
  if (!data) {
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ color: 'var(--on-surface)' }}>Syllabus Not Found</h1>
        <p style={{ color: 'var(--secondary)', marginTop: 8 }}>
          This syllabus page does not exist or has been removed.
        </p>
        <Link href="/schemes" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
          Browse All Syllabi
        </Link>
      </div>
    )
  }

  const { en, related } = data

  // ── ai_extracted_data ──────────────────────────────────────
  const ai = en.ai_extracted_data || {}
  const educationLevels  = ai.education_levels || []
  const educationStreams  = ai.education_streams || []
  const selectionMethods = ai.selection_methods || []
  const govtLevel        = ai.government_level || null
  const stateNormalized  = ai.state_normalized || null

  // ── Links ──────────────────────────────────────────────────
  // PDF: notification_pdf > application_links.notification_pdf > apply_online > source_url
  const pdfLink = en.notification_pdf
               || en.application_links?.notification_pdf
               || en.application_links?.apply_online
               || en.source_url
               || null

  const allLinks = [
    { label: 'Download Official Syllabus PDF', url: pdfLink,                                                  icon: 'picture_as_pdf' },
    { label: 'Official Website',               url: en.application_links?.official_website || en.org_website, icon: 'language' },
    { label: 'Apply for Related Recruitment',  url: en.application_links?.apply_online,                      icon: 'open_in_new' },
    { label: 'Check Result',                   url: en.application_links?.result_link,                       icon: 'assignment_turned_in' },
  ].filter(l => l.url)

  // Related syllabi slug construction
  const relatedSyllabi = related.map(r => ({
    slug:  r.org_acronym && r.id ? `${r.org_acronym.toLowerCase()}-${r.id}` : r.slug,
    title: r.title,
    org:   r.org_acronym || 'GOVT',
  }))

  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
  const siteUrl = (rawUrl && !rawUrl.includes('localhost')) ? rawUrl : 'https://examudaan.in'
  const pageUrl = `${siteUrl}/schemes/${resolvedParams.slug}`

  // Shared styles
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

  // JSON-LD: Course schema — syllabus is course preparation material
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: en.title,
    description: en.description || `Official syllabus and exam pattern for ${en.title} published by ${en.org_name}.`,
    provider: {
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
      { '@type': 'ListItem', position: 2, name: 'Syllabi', item: `${siteUrl}/schemes` },
      { '@type': 'ListItem', position: 3, name: en.title,  item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '100px' }}>

        {/* ── Breadcrumb ───────────────────────────────────── */}
        <DetailBreadcrumb
          sectionLabel="Syllabi"
          sectionHref="/schemes"
          orgAcronym={en.org_acronym}
          title={en.title}
          titleMr={en.title_mr}
        />

        {/* ── Hero Block ───────────────────────────────────── */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 16, padding: 24,
          boxShadow: '0 1px 8px rgba(28,25,23,0.06)',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            {/* Icon */}
            <div style={{
              width: 64, height: 64,
              background: 'var(--surface-container-low)',
              borderRadius: 12,
              border: '1px solid var(--outline-variant)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--primary)' }}>
                menu_book
              </span>
            </div>
            {/* Title */}
            <div style={{ flex: 1 }}>
              <JobDetailTitle
                title={en.title}
                title_mr={en.title_mr}
                orgName={en.org_name}
                orgNameMr={en.org_name_mr}
              />
            </div>
          </div>

          {/* Meta pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {govtLevel && (
              <span className="info-pill" style={{ background: '#FFF7ED', borderColor: '#FED7AA', color: '#C2410C' }}>
                <span className="material-symbols-outlined">account_balance</span>
                {govtLevel} Govt
              </span>
            )}
            {stateNormalized && (
              <span className="info-pill">
                <span className="material-symbols-outlined">location_on</span>
                {stateNormalized}
              </span>
            )}
            {educationLevels.length > 0 && (
              <span className="info-pill">
                <span className="material-symbols-outlined">school</span>
                {educationLevels.slice(0, 2).join(' / ')}
              </span>
            )}
            {selectionMethods.length > 0 && (
              <span className="info-pill">
                <span className="material-symbols-outlined">assignment_turned_in</span>
                {selectionMethods.slice(0, 2).join(' + ')}
              </span>
            )}
            {en.published_at && (
              <span className="info-pill">
                <span className="material-symbols-outlined">calendar_month</span>
                Published: {formatDate(en.published_at)}
              </span>
            )}
            {en.advt_no && (
              <span className="info-pill">
                <span className="material-symbols-outlined">tag</span>
                Advt: {en.advt_no}
              </span>
            )}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {pdfLink && (
              <a
                href={pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-primary-lg"
                id="syllabus-pdf-btn"
              >
                <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>download</span>
                <T k="card.official_pdf" fallback="Download Official Syllabus" />
              </a>
            )}
            {(en.application_links?.official_website || en.org_website) && (
              <a
                href={en.application_links?.official_website || en.org_website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ padding: '10px 20px' }}
                id="syllabus-website-btn"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>language</span>
                Official Website
              </a>
            )}
          </div>
        </div>

        {/* ── Two-column layout ─────────────────────────────── */}
        <div className="job-detail-layout">

          {/* ════ LEFT COLUMN ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Description / Thin-content fallback ──────── */}
            {en.description && en.description.length > 50 ? (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>info</span>
                  About This Syllabus
                </h2>
                <p style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {en.description.length > 2000
                    ? en.description.slice(0, 2000) + '...\n\n[See official PDF for complete syllabus]'
                    : en.description}
                </p>
              </section>
            ) : pdfLink ? (
              <section style={{ ...sectionStyle, textAlign: 'center', padding: '32px 20px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 44, color: 'var(--primary)', display: 'block', marginBottom: 10 }}>menu_book</span>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>
                  Full Syllabus Available in the Official PDF
                </p>
                <p style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 18 }}>
                  Complete syllabus, paper pattern, marking scheme, and topic-wise breakdown
                  published by {en.org_name || 'the organisation'}.
                </p>
                <a
                  href={pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', gap: 8 }}
                  id="thin-syllabus-pdf-btn"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
                  Download Official Syllabus
                </a>
              </section>
            ) : null}

            {/* ── Selection Process ─────────────────────────── */}
            {selectionMethods.length > 0 && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>route</span>
                  <T k="detail.selection_process" fallback="Selection Process" />
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectionMethods.map((step, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px',
                      background: 'var(--surface-container-low)',
                      border: '1px solid var(--outline-variant)',
                      borderRadius: 8,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'var(--primary)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13, flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: 14, color: 'var(--on-surface)', fontWeight: 500 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Eligibility ───────────────────────────────── */}
            {(educationLevels.length > 0 || educationStreams.length > 0) && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>school</span>
                  Eligibility
                </h2>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Education Required
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {educationLevels.map(l => (
                    <span key={l} style={{ padding: '4px 12px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#C2410C' }}>
                      {l}
                    </span>
                  ))}
                  {educationStreams.map(s => (
                    <span key={s} style={{ padding: '4px 12px', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: 999, fontSize: 13, color: 'var(--secondary)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* ── Official Links ────────────────────────────── */}
            {allLinks.length > 0 && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>link</span>
                  Official Links
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
                        fontSize: 14, fontWeight: 500,
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

            {/* ── Disclaimer ────────────────────────────────── */}
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20, flexShrink: 0, marginTop: 2 }}>info</span>
              <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
                Always verify the syllabus on the official website before preparing. ExamUdaan aggregates data and may not reflect last-minute changes.
              </p>
            </div>
          </div>

          {/* ════ RIGHT COLUMN — SIDEBAR ════ */}
          <div id="syllabus-detail-sidebar">
            <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + var(--ticker-height) + 12px)', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Quick Summary */}
              <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(28,25,23,0.04)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 16 }}>
                  Quick Summary
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'Organisation',  value: en.org_acronym || en.org_name || 'GOVT' },
                    govtLevel          ? { label: 'Govt Level', value: govtLevel }                          : null,
                    stateNormalized    ? { label: 'State',      value: stateNormalized }                    : null,
                    en.advt_no         ? { label: 'Advt No',    value: en.advt_no }                         : null,
                    en.published_at    ? { label: 'Published',  value: formatDate(en.published_at) }        : null,
                    selectionMethods.length > 0
                      ? { label: 'Exam Type', value: selectionMethods.slice(0, 2).join(', ') } : null,
                  ].filter(Boolean).map(({ label, value }) => (
                    <li key={label} style={{
                      display: 'flex', justifyContent: 'space-between', gap: 8,
                      fontSize: 13, padding: '10px 0',
                      borderBottom: '1px solid var(--outline-variant)',
                      color: 'var(--secondary)',
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--on-surface)', flexShrink: 0 }}>{label}:</span>
                      <span style={{ textAlign: 'right', fontSize: 12, wordBreak: 'break-word' }}>{value}</span>
                    </li>
                  ))}
                </ul>
                {pdfLink && (
                  <a
                    href={pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
                    id="sidebar-syllabus-pdf-btn"
                  >
                    <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>download</span>
                    Download Syllabus
                  </a>
                )}
              </div>

              {/* Related Syllabi */}
              {relatedSyllabi.length > 0 && (
                <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(28,25,23,0.04)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>Related Syllabi</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {relatedSyllabi.map(s => (
                      <Link
                        key={s.slug}
                        href={`/schemes/${s.slug}`}
                        style={{ display: 'block', padding: '10px 12px', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: 8, textDecoration: 'none', transition: 'background 0.15s' }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', lineHeight: 1.4 }}>{s.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 3 }}>{s.org}</div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/schemes" style={{ display: 'block', marginTop: 12, fontSize: 13, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                    View all syllabi →
                  </Link>
                </div>
              )}

              {/* Org Info */}
              {(en.org_website || en.org_phone || en.org_address) && (
                <div style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(28,25,23,0.04)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>Organisation</h3>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 4 }}>{en.org_name}</div>
                  {en.org_address && (
                    <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 6, lineHeight: 1.5 }}>{en.org_address}</div>
                  )}
                  {en.org_phone && (
                    <a href={`tel:${en.org_phone}`} style={{ fontSize: 12, color: 'var(--primary)', display: 'block', marginBottom: 6 }}>
                      {en.org_phone}
                    </a>
                  )}
                  {en.org_website && (
                    <a href={en.org_website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                      Visit Official Website →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
