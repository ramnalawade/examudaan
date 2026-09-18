// ============================================================
// app/answer-keys/[slug]/page.js — Answer Key Detail Page
// Shows all available data: description, ai_extracted_data,
// selection stage context, Quick Links, objection window, org info.
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

async function getAnswerKeyData(slugParam) {
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

  // Related answer keys — same org first
  const related = await query(
    `SELECT en.id, en.title, en.slug, o.acronym AS org_acronym
     FROM exam_notifications en
     JOIN organizations o ON o.id = en.organization_id
     WHERE en.id != $1
       AND en.status = 'published'
       AND en.notification_type = 'answer_key'
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
  const data = await getAnswerKeyData(resolvedParams.slug)
  if (!data) return { title: 'Answer Key | ExamUdaan' }
  const { en } = data
  const rawUrlMeta = process.env.NEXT_PUBLIC_SITE_URL || 'https://examudaan.in'
  const siteUrlMeta = (rawUrlMeta && !rawUrlMeta.includes('localhost')) ? rawUrlMeta : 'https://examudaan.in'
  const canonicalUrl = `${siteUrlMeta}/answer-keys/${resolvedParams.slug}`
  return {
    title: `${en.title} Answer Key — Download & Calculate Score | ExamUdaan`,
    description: `Download ${en.title} official answer key from ${en.org_name}. Calculate your expected score, raise objections if any, and check expected cut-off.`.slice(0, 160),
    alternates: { canonical: canonicalUrl },
    openGraph: { title: `${en.title} Answer Key`, url: canonicalUrl, type: 'article', siteName: 'ExamUdaan.in' },
  }
}

export default async function AnswerKeyDetailPage({ params }) {
  const resolvedParams = await params
  const data = await getAnswerKeyData(resolvedParams.slug)

  if (!data) {
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ color: 'var(--on-surface)' }}>Answer Key Not Found</h1>
        <p style={{ color: 'var(--secondary)', marginTop: 8 }}>
          This answer key page does not exist or has been removed.
        </p>
        <Link href="/answer-keys" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
          Browse All Answer Keys
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
  // Answer key: answer_key_link > answer_key_pdf > notification_pdf > source_url
  const answerKeyLink = en.application_links?.answer_key_link
                     || en.application_links?.answer_key_pdf
                     || en.notification_pdf
                     || en.source_url
                     || null
  const pdfLink = en.notification_pdf || en.source_url || null

  const allLinks = [
    { label: 'Download Official Answer Key', url: answerKeyLink,                                          icon: 'fact_check' },
    { label: 'Official Notification PDF',    url: pdfLink && pdfLink !== answerKeyLink ? pdfLink : null,  icon: 'picture_as_pdf' },
    { label: 'Official Website',             url: en.application_links?.official_website || en.org_website, icon: 'language' },
    { label: 'Check Result',                 url: en.application_links?.result_link,                      icon: 'assignment_turned_in' },
    { label: 'Admit Card',                   url: en.application_links?.admit_card_link,                  icon: 'badge' },
    { label: 'Apply Online',                 url: en.application_links?.apply_online,                     icon: 'open_in_new' },
  ].filter(l => l.url)

  // ── Dates ──────────────────────────────────────────────────
  const releasedDate   = en.apply_start_date  // "released on" for answer keys
  const objectionTill  = en.apply_end_date    // objection window closing date
  const examDate       = en.exam_date

  // ── Steps to calculate score ───────────────────────────────
  const calcSteps = [
    `Visit the official website: ${en.org_website || en.application_links?.official_website || `${(en.org_acronym || '').toLowerCase()}.gov.in`}.`,
    'Navigate to the "Answer Key" or "Recruitment" section.',
    en.advt_no
      ? `Find the answer key for: "${en.title}" (Advt No: ${en.advt_no}).`
      : `Find the answer key for: "${en.title}".`,
    'Download the answer key PDF and compare with your attempted answers.',
    'Count correct answers and apply marking scheme (typically +1 for correct, -0.25 for wrong).',
    'Calculate your total expected score to estimate your result.',
    objectionTill
      ? `If you find any error, raise an objection before ${formatDate(objectionTill)} with documentary evidence.`
      : 'If you find any error, raise an objection within the specified window with documentary evidence.',
  ]

  const relatedKeys = related.map(r => ({
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
  const pageUrl = `${siteUrl}/answer-keys/${resolvedParams.slug}`

  // JSON-LD: CreativeWork — answer key is an educational/assessment document
  const answerKeySchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${en.title} — Official Answer Key`,
    description: en.description || `Official answer key for ${en.title} published by ${en.org_name}.`,
    datePublished: en.apply_start_date ? new Date(en.apply_start_date).toISOString() : undefined,
    publisher: {
      '@type': 'Organization',
      name: en.org_name || 'Government of India',
      url: en.org_website || siteUrl,
    },
    url: answerKeyLink || pageUrl,
    mainEntityOfPage: pageUrl,
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',        item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Answer Keys', item: `${siteUrl}/answer-keys` },
      { '@type': 'ListItem', position: 3, name: en.title,      item: pageUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(answerKeySchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '100px' }}>

        {/* Breadcrumb */}
        <DetailBreadcrumb
          sectionLabel="Answer Keys"
          sectionHref="/answer-keys"
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
          {/* RELEASED badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', background: '#F0FDF4', color: '#15803D', marginBottom: 14 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>fact_check</span>
            <T k="card.answer_key" fallback="ANSWER KEY" />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, background: '#F0FDF4', borderRadius: 12, border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#15803D' }}>fact_check</span>
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
            {releasedDate && (
              <span className="info-pill" style={{ background: '#F0FDF4', borderColor: '#BBF7D0', color: '#15803D' }}>
                <span className="material-symbols-outlined">calendar_month</span>Released: {formatDate(releasedDate)}
              </span>
            )}
            {objectionTill && (
              <span className="info-pill" style={{ background: '#FFF1F2', borderColor: '#FECDD3', color: '#BE123C' }}>
                <span className="material-symbols-outlined">warning</span>Objection Till: {formatDate(objectionTill)}
              </span>
            )}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {answerKeyLink && (
              <a
                href={answerKeyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-primary-lg"
                id="download-answer-key-btn"
                style={{ background: 'linear-gradient(135deg,#15803D,#166534)' }}
              >
                <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>download</span>
                Download Official Answer Key
              </a>
            )}
            {pdfLink && pdfLink !== answerKeyLink && (
              <a
                href={pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ padding: '10px 20px' }}
                id="answer-key-pdf-btn"
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
                { label: 'Exam Conducted',              value: formatDate(examDate) },
                { label: 'Answer Key Released',         value: formatDate(releasedDate) },
                { label: 'Objection Window Closes',     value: formatDate(objectionTill) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--outline-variant)' }}>
                  <span style={{ fontSize: 15, color: 'var(--secondary)' }}>{label}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)' }}>{value}</span>
                </div>
              ))}
            </section>

            {/* This answer key is for which stage */}
            {(selectionMethods.length > 0 || educationLevels.length > 0 || jobCategories.length > 0) && (
              <section style={sectionStyle}>
                <h2 style={sectionHeadStyle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>info</span>
                  About This Exam
                </h2>
                {selectionMethods.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>This Answer Key Is For</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectionMethods.map((m, i) => (
                        <span key={i} style={{ padding: '4px 10px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#15803D' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                  <div>
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
              </section>
            )}

            {/* How to use the answer key */}
            <section style={sectionStyle}>
              <h2 style={sectionHeadStyle}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>calculate</span>
                How to Use the Answer Key
              </h2>
              <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {calcSteps.map((step, i) => (
                  <li key={i} style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>{step}</li>
                ))}
              </ol>
            </section>

            {/* Objection window notice — only if date is set */}
            {objectionTill && (
              <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span className="material-symbols-outlined" style={{ color: '#BE123C', fontSize: 22, flexShrink: 0, marginTop: 2 }}>warning</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#9F1239', marginBottom: 4 }}>Objection Window Open</p>
                  <p style={{ fontSize: 13, color: '#BE123C', lineHeight: 1.6 }}>
                    You can challenge incorrect answers till {formatDate(objectionTill)}. Visit the official website and submit your objection with documentary proof. A fee may be applicable per question challenged.
                  </p>
                </div>
              </div>
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
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#15803D' }}>{icon}</span>
                      {label}
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--secondary)', marginLeft: 'auto' }}>open_in_new</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Disclaimer */}
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20, flexShrink: 0, marginTop: 2 }}>info</span>
              <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
                Always download the answer key from the official government website. ExamUdaan aggregates information and may not reflect last-minute changes or revised answer keys.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div id="answer-key-detail-sidebar">
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
                    examDate ? { label: 'Exam Date',     value: formatDate(examDate) } : null,
                    releasedDate ? { label: 'Key Released',  value: formatDate(releasedDate) } : null,
                    objectionTill ? { label: 'Objection Till', value: formatDate(objectionTill) } : null,
                    en.total_vacancies ? { label: 'Total Posts',  value: String(en.total_vacancies) } : null,
                    en.advt_no ? { label: 'Advt No', value: en.advt_no } : null,
                  ].filter(Boolean).map(({ label, value }) => (
                    <li key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13, padding: '10px 0', borderBottom: '1px solid var(--outline-variant)', color: 'var(--secondary)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--on-surface)', flexShrink: 0 }}>{label}:</span>
                      <span style={{ textAlign: 'right', fontSize: 12 }}>{value}</span>
                    </li>
                  ))}
                </ul>
                {answerKeyLink && (
                  <a
                    href={answerKeyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    id="sidebar-download-answer-key-btn"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 16, background: 'linear-gradient(135deg,#15803D,#166534)' }}
                  >
                    <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>download</span>
                    Download Answer Key
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

        {/* Related answer keys */}
        {relatedKeys.length > 0 && (
          <section style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--outline-variant)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 20 }}>Other Answer Keys</h2>
            <div className="grid-2">
              {relatedKeys.map(r => (
                <Link key={r.slug} href={`/answer-keys/${r.slug}`} className="job-card" style={{ flexDirection: 'column', gap: 8, textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="truncate-2" style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', flex: 1, lineHeight: 1.4 }}>{r.title}</h3>
                    <span style={{ background: '#F0FDF4', color: '#15803D', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, marginLeft: 8, flexShrink: 0, border: '1px solid #BBF7D0' }}>{r.org}</span>
                  </div>
                  <div className="job-card-meta">
                    <span className="material-symbols-outlined">fact_check</span>
                    <span>Answer Key Available</span>
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