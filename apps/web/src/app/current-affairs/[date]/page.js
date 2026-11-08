/**
 * /current-affairs/[date]/page.js
 * Daily "Chalu Ghadamodi" (Current Affairs) Summary Page
 * URL format: /current-affairs/01-october-2026
 *
 * Shows a structured bilingual digest with verified exam angles,
 * categorized articles, key terminology, and high-yield MCQ points.
 */

import Link from 'next/link'
import styles from './dailySummary.module.css'
import { fitDescription } from '@/lib/seoMetadata'
import { getDailyDigest } from '@/lib/currentAffairsData'
import { query } from '@/lib/pgdb'

// ── URL helper — converts "01-october-2026" → "2026-10-01" ────
function slugToDate(slug) {
  if (!slug) return null
  const months = {
    january: '01', february: '02', march: '03', april: '04',
    may: '05', june: '06', july: '07', august: '08',
    september: '09', october: '10', november: '11', december: '12',
  }
  const parts = slug.split('-')
  if (parts.length !== 3) return null
  const [day, month, year] = parts
  const mm = months[month.toLowerCase()]
  if (!mm) return null
  return `${year}-${mm}-${day.padStart(2, '0')}`
}

// ── Server-side data fetch ─────────────────────────────────────
async function getDailySummary(dateStr) {
  // 1. Try DB first if pre-generated summary exists
  try {
    const rows = await query(
      `SELECT digest FROM daily_ca_summaries WHERE summary_date = $1 LIMIT 1`,
      [dateStr]
    )
    if (rows && rows.length > 0 && rows[0].digest) {
      const parsed = typeof rows[0].digest === 'string' ? JSON.parse(rows[0].digest) : rows[0].digest
      if (parsed && Array.isArray(parsed.sections) && parsed.sections.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    // Database table may not exist yet or connection timed out — fallback smoothly
  }

  // 2. High-quality verified digest guaranteed for every requested date
  return getDailyDigest(dateStr)
}

export async function generateMetadata({ params }) {
  const { date: slug } = await params
  const dateStr = slugToDate(slug)
  if (!dateStr) {
    return { title: { absolute: 'Daily Current Affairs | ExamUdaan' } }
  }

  const dateDisplay = new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // Pattern: "{Date} Current Affairs - Daily GK PDF | ExamUdaan", max 60 chars
  let title = `${dateDisplay} Current Affairs - Daily GK PDF | ExamUdaan`
  if (title.length > 60) {
    title = `${dateDisplay} Current Affairs - Daily GK PDF`
  }
  if (title.length > 60) {
    title = `${dateDisplay} Current Affairs | ExamUdaan`
  }
  if (title.length > 60) {
    title = `${dateDisplay} Current Affairs`.slice(0, 60)
  }

  const description = fitDescription(
    `Daily current affairs digest for ${dateDisplay} — essential for MPSC, UPSC, Police Bharti, SSC & Banking. Bilingual English & Marathi summary with exam angles.`,
    'Daily Chalu Ghadamodi GK on ExamUdaan.'
  )

  const canonicalUrl = `https://examudaan.in/current-affairs/${slug}`

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
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

// ── Category Icon map ──────────────────────────────────────────
const CAT_ICONS = {
  'Maharashtra': '🏛️',
  'National': '🇮🇳',
  'Economy': '💰',
  'Science & Tech': '🔬',
  'Environment': '🌿',
  'Sports': '🏆',
  'International': '🌏',
}

const CAT_COLORS = {
  'Maharashtra': '#EA580C',
  'National': '#1D4ED8',
  'Economy': '#059669',
  'Science & Tech': '#7C3AED',
  'Environment': '#15803D',
  'Sports': '#B45309',
  'International': '#DC2626',
}

// ── Main Page ──────────────────────────────────────────────────
export default async function DailySummaryPage({ params }) {
  const { date: slug } = await params
  const dateStr = slugToDate(slug)

  if (!dateStr) {
    return (
      <main className={styles.invalidDateFormat}>
        <h1>Invalid Date Format</h1>
        <p>Please use format: /current-affairs/01-october-2026</p>
        <Link href="/current-affairs">← Back to Current Affairs</Link>
      </main>
    )
  }

  const digest = await getDailySummary(dateStr)
  const dateDisplay = new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  // JSON-LD for Google rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: digest?.title_en || `Current Affairs ${dateDisplay}`,
    description: digest?.summary_en || 'Daily current affairs digest for MPSC and competitive exams.',
    datePublished: dateStr,
    dateModified: dateStr,
    author: { '@type': 'Organization', name: 'ExamUdaan' },
    publisher: {
      '@type': 'Organization',
      name: 'ExamUdaan',
      logo: { '@type': 'ImageObject', url: 'https://examudaan.in/icon.png' },
    },
    inLanguage: 'en-IN',
    url: `https://examudaan.in/current-affairs/${slug}`,
  }

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Header ───────────────────────────────────── */}
      <section className={styles.header}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link> ›
            <Link href="/current-affairs">Current Affairs</Link> ›
            <span>{dateDisplay}</span>
          </div>

          <div className={styles.dateBadge}>
            <span>📅</span>
            <span>{dateDisplay}</span>
            <span className={styles.divider}>|</span>
            <span className={styles.marathi}>चालू घडामोडी</span>
          </div>

          <h1 className={styles.title}>
            {digest?.title_en || `Current Affairs ${dateDisplay}`}
          </h1>

          {digest?.title_mr && (
            <div className={styles.titleMr}>{digest.title_mr}</div>
          )}

          {/* Summary card */}
          {digest?.summary_en && (
            <div className={styles.summaryCard}>
              <div className={styles.summaryEn}>
                <strong>📌 Today's Overview:</strong>
                <p>{digest.summary_en}</p>
              </div>
              {digest.summary_mr && (
                <div className={styles.summaryMr}>
                  <strong>📌 थोडक्यात:</strong>
                  <p>{digest.summary_mr}</p>
                </div>
              )}
            </div>
          )}

          {/* Exam relevance tags (Clickable filters) */}
          <div className={styles.examBadges} aria-label="Exam Categories">
            {['MPSC', 'UPSC', 'Police Bharti', 'SSC', 'Banking'].map(tag => (
              <Link
                key={tag}
                href={`/current-affairs?exam=${encodeURIComponent(tag)}`}
                className={styles.examBadge}
                title={`Browse ${tag} Current Affairs & Practice Questions`}
              >
                <span>🏷️ {tag}</span>
              </Link>
            ))}
          </div>

          {/* Share buttons */}
          <div className={styles.shareRow}>
            <span className={styles.shareLabel}>Share:</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `📰 Current Affairs ${dateDisplay} — Chalu Ghadamodi\n\nCheck on ExamUdaan: https://examudaan.in/current-affairs/${slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.shareBtn} ${styles.whatsapp}`}
            >
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Today's Current Affairs ${dateDisplay} for #MPSC #UPSC #SSC:\nhttps://examudaan.in/current-affairs/${slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.shareBtn} ${styles.twitter}`}
            >
              Twitter/X
            </a>
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────── */}
      <section className={styles.content}>
        <div className="container">
          <div className={styles.layout}>

            {/* Main articles column */}
            <div className={styles.mainCol}>
              {digest?.sections?.length > 0 ? (
                digest.sections.map((section) => (
                  <div key={section.category} className={styles.section}>
                    {/* Section header with clickable category filter */}
                    <div
                      className={styles.sectionHeader}
                      style={{ '--sec-color': CAT_COLORS[section.category] || '#EA580C' }}
                    >
                      <span className={styles.secIcon}>{CAT_ICONS[section.category] || '📰'}</span>
                      <Link
                        href={`/current-affairs?category=${encodeURIComponent(section.category)}`}
                        className={styles.secTitleLink}
                        title={`Browse all ${section.category} Current Affairs`}
                      >
                        <h2 className={styles.secTitle}>{section.category}</h2>
                      </Link>
                      <span className={styles.secCount}>{section.articles?.length || 0} items</span>
                    </div>

                    {/* Articles */}
                    <div className={styles.articlesGrid}>
                      {(section.articles || []).map((art, i) => (
                        <div key={i} className={styles.articleCard}>
                          <h3 className={styles.artTitle}>{art.title}</h3>
                          <p className={styles.artDetail}>{art.detail}</p>

                          {/* Exam angle callout */}
                          {art.exam_angle && (
                            <div className={styles.examAngle}>
                              <span className={styles.examAngleLabel}>💡 Exam Angle:</span>
                              <span>{art.exam_angle}</span>
                            </div>
                          )}

                          {/* Clickable Exam tags */}
                          {art.exam_tags?.length > 0 && (
                            <div className={styles.artTags}>
                              {art.exam_tags.map(tag => (
                                <Link
                                  key={tag}
                                  href={`/current-affairs?exam=${encodeURIComponent(tag)}`}
                                  className={styles.artTag}
                                  title={`Filter ${tag} Current Affairs`}
                                >
                                  {tag}
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Action row with source & practice links */}
                          <div className={styles.artActionRow}>
                            {art.sourceUrl && (
                              <a
                                href={art.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.artSource}
                                title={`Read official source (${art.sourceName || 'Gov Portal'})`}
                              >
                                <span>🏛️ {art.sourceName || 'Read Source'} ↗</span>
                              </a>
                            )}
                            <Link
                              href="/pyq"
                              className={styles.artPracticeLink}
                              title="Practice related previous year questions"
                            >
                              <span>📝 Practice MCQs ↗</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                /* Fallback when no digest generated */
                <div className={styles.noDigest}>
                  <span>📰</span>
                  <h3>Digest Not Available</h3>
                  <p>
                    The AI digest for this date is being prepared.
                    Check back in a few minutes, or browse all current affairs below.
                  </p>
                  <Link href="/current-affairs" className="btn-primary">
                    Browse Current Affairs →
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className={styles.sidebar}>

              {/* Key Terms with Clickable Search Links */}
              {digest?.key_terms?.length > 0 && (
                <div className={styles.sideCard}>
                  <h4 className={styles.sideTitle}>🔑 Key Terms Today</h4>
                  <div className={styles.keyTerms}>
                    {digest.key_terms.map(term => (
                      <Link
                        key={term}
                        href={`/current-affairs?search=${encodeURIComponent(term)}`}
                        className={styles.keyTerm}
                        title={`Search "${term}" in Current Affairs`}
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* One-liners */}
              {digest?.one_liners?.length > 0 && (
                <div className={styles.sideCard}>
                  <h4 className={styles.sideTitle}>⚡ Quick Facts (MCQ Ready)</h4>
                  <ul className={styles.oneLiners}>
                    {digest.one_liners.map((line, i) => (
                      <li key={i} className={styles.oneLiner}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prep links */}
              <div className={styles.sideCard}>
                <h4 className={styles.sideTitle}>📚 Prepare with ExamUdaan</h4>
                <div className={styles.prepLinks}>
                  {[
                    { icon: '🎯', label: 'Daily Quiz', href: '/daily-quiz', sub: "Test today's GK" },
                    { icon: '📝', label: '15-Year PYQs', href: '/pyq', sub: 'Topic-wise MCQs' },
                    { icon: '🏛️', label: 'MPSC Mock Test', href: '/mock-tests/mpsc-combined-full-prelims', sub: 'Official CBT exam' },
                    { icon: '📅', label: 'Exam Calendar', href: '/calendar', sub: '2026 exam dates' },
                    { icon: '🔔', label: 'Set Free Alerts', href: '/alerts', sub: 'WhatsApp & SMS' },
                  ].map(link => (
                    <Link key={link.href} href={link.href} className={styles.prepLink}>
                      <span className={styles.prepLinkIcon}>{link.icon}</span>
                      <div className={styles.prepLinkInfo}>
                        <span className={styles.prepLinkLabel}>{link.label}</span>
                        {link.sub && <span className={styles.prepLinkSub}>{link.sub}</span>}
                      </div>
                      <span className={styles.prepLinkArrow}>→</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigate dates (Anchored around the requested date) */}
              <div className={styles.sideCard}>
                <h4 className={styles.sideTitle}>📅 Recent Digests</h4>
                <div className={styles.recentDates}>
                  {Array.from({ length: 7 }, (_, i) => {
                    const base = new Date(dateStr)
                    base.setDate(base.getDate() - (i - 1)) // 1 day ahead, current day, 5 days prior
                    const isoDate = base.toISOString().split('T')[0]
                    const months = ['january','february','march','april','may','june','july','august','september','october','november','december']
                    const urlSlug = `${String(base.getDate()).padStart(2,'0')}-${months[base.getMonth()]}-${base.getFullYear()}`
                    const label = base.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    return (
                      <Link
                        key={isoDate}
                        href={`/current-affairs/${urlSlug}`}
                        className={`${styles.recentDate} ${isoDate === dateStr ? styles.recentDateActive : ''}`}
                        title={`View Current Affairs for ${label}`}
                      >
                        <span>📅 {label}</span>
                        {isoDate === dateStr && <span className={styles.activePill}>Viewing</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>

    </main>
  )
}
