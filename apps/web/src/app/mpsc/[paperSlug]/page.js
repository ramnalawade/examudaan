// ============================================================
// app/mpsc/[paperSlug]/page.js — MPSC Exam Hub & Dedicated Paper Detail
// ExamUdaan.in | Full Server-Side Rendered (SSR) for Search Crawlers
// Covers 2009–2026 Archive with Strict Zero Inline Styles Policy
// ============================================================

import Link from 'next/link'
import { notFound } from 'next/navigation'
import manifest from '@/lib/mpscPyqArchiveManifest.json'
import styles from './paperDetail.module.css'
import MpscDistributionChart from '@/components/MpscDistributionChart'
import PaperQuestionSolver from '@/components/PaperQuestionSolver'
import CadreHubClient from '@/components/CadreHubClient'
import { getQuestionsForPaper } from '@/lib/mpscPaperQuestions'
import {
  MPSC_ARCHIVE_YEARS_SPAN,
  MPSC_TOTAL_QUESTION_PAPERS,
  MPSC_CADRE_COUNTS
} from '@/lib/platformStats'

export const dynamic = 'auto'
export const dynamicParams = true

/**
 * Generate static params for build-time pre-rendering of high-priority hubs & papers
 */
export async function generateStaticParams() {
  const params = []

  // 1. Cadre Hub slugs
  Object.values(manifest.cadres || {}).forEach(cadre => {
    if (cadre.slug) {
      params.push({ paperSlug: cadre.slug })
    }
  })

  // 2. High-demand recent year paper slugs (2021–2026)
  const recentItems = (manifest.items || []).filter(item => item.examYear >= 2021)
  recentItems.forEach(item => {
    if (item.slug) {
      params.push({ paperSlug: item.slug })
    }
  })

  return params
}

/**
 * Dynamic SEO Metadata Generator for both Exam Hubs & Individual Paper Pages
 */
export async function generateMetadata({ params }) {
  const { paperSlug } = await params
  const cadreEntry = Object.values(manifest.cadres || {}).find(c => c.slug === paperSlug)

  if (cadreEntry) {
    const title = `MPSC ${cadreEntry.nameEn} Previous Year Papers (2009-2026) PDF | ExamUdaan`
    const description = `${cadreEntry.description} Download official prelims & mains question papers with answer keys.`
    return {
      title: { absolute: title },
      description,
      alternates: { canonical: `https://examudaan.in/mpsc/${cadreEntry.slug}` },
      openGraph: {
        title,
        description,
        url: `https://examudaan.in/mpsc/${cadreEntry.slug}`,
        siteName: 'ExamUdaan.in',
        type: 'website'
      }
    }
  }

  const paperItem = (manifest.items || []).find(item => item.slug === paperSlug)
  if (paperItem) {
    const title = `${paperItem.title} | ExamUdaan`
    const description = paperItem.metaDescription || `Download official ${paperItem.title}. Review in browser or download PDF with verified answer key.`
    return {
      title: { absolute: title },
      description,
      alternates: { canonical: `https://examudaan.in/mpsc/${paperItem.slug}` },
      openGraph: {
        title,
        description,
        url: `https://examudaan.in/mpsc/${paperItem.slug}`,
        siteName: 'ExamUdaan.in',
        type: 'article'
      }
    }
  }

  return {
    title: 'MPSC Question Papers & Answer Keys | ExamUdaan'
  }
}

export default async function MpscArchiveRouterPage({ params, searchParams }) {
  const { paperSlug } = await params
  const sParams = await searchParams
  const currentPage = parseInt(sParams?.page || '1', 10) || 1
  const selectedYear = sParams?.year ? parseInt(sParams.year, 10) : null
  const selectedStage = sParams?.stage || 'all'

  // 1. Check if this request is for an Exam Hub (e.g. /mpsc/rajyaseva-previous-year-papers)
  const cadreEntry = Object.values(manifest.cadres || {}).find(c => c.slug === paperSlug)
  if (cadreEntry) {
    return renderCadreHub({ cadreEntry, currentPage, selectedYear, selectedStage })
  }

  // 2. Check if this request is for a Dedicated Stage-Year Paper
  const paperItem = (manifest.items || []).find(item => item.slug === paperSlug)
  if (paperItem) {
    return renderPaperDetail({ paperItem })
  }

  // Sibling routes take precedence, anything else not found
  notFound()
}

/**
 * ============================================================
 * RENDERER A: Exam Cadre Hub (e.g. Rajyaseva / Group B / Group C)
 * Numbered Pagination + Filter by Year & Stage + SSR Crawlable Links
 * ============================================================
 */
function renderCadreHub({ cadreEntry }) {
  const cadreKey = Object.keys(manifest.cadres || {}).find(k => manifest.cadres[k].slug === cadreEntry.slug)
  const allCadrePapers = (manifest.items || []).filter(item => item.cadreKey === cadreKey)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `MPSC ${cadreEntry.nameEn} Previous Year Question Papers (2009–2026)`,
    description: cadreEntry.description,
    url: `https://examudaan.in/mpsc/${cadreEntry.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'ExamUdaan',
      url: 'https://examudaan.in'
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
          <ol className={styles.breadcrumbList}>
            <li>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            </li>
            <li className={styles.breadcrumbSeparator}>›</li>
            <li>
              <Link href="/mpsc-pyq" className={styles.breadcrumbLink}>MPSC PYQ Archive</Link>
            </li>
            <li className={styles.breadcrumbSeparator}>›</li>
            <li className={styles.breadcrumbCurrent}>{cadreEntry.shortName}</li>
          </ol>
        </nav>

        {/* Header Banner */}
        <div className={styles.headerBanner}>
          <div className={styles.badgeRow}>
            <span className={styles.cadreBadge}>{cadreEntry.badge}</span>
            <span className={styles.yearBadge}>Coverage: 2009–2026 (18 Years)</span>
            <span className={styles.stageBadge}>{allCadrePapers.length} Papers Available</span>
          </div>

          <h1 className={styles.mainTitle}>
            MPSC {cadreEntry.nameEn} Question Papers & Official Keys (2009–2026)
          </h1>
          <div className={styles.marathiTitle}>
            {cadreEntry.nameMr} — मागील वर्षांच्या अधिकृत प्रश्नपत्रिका व उत्तरतालिका
          </div>
          <p className={styles.leadDescription}>
            {cadreEntry.description} Sourced directly from official Maharashtra Public Service Commission notifications with verified answer key status.
          </p>
        </div>

        {/* Visual Paper Distribution Donut/Pie Chart */}
        <MpscDistributionChart currentCadre={cadreEntry.slug} />

        {/* Interactive Cadre Hub (Full Filters, Year Dropdown, Search & Numbered Pagination) */}
        <CadreHubClient cadreEntry={cadreEntry} papers={allCadrePapers} />
      </div>
    </div>
  )
}

/**
 * ============================================================
 * RENDERER B: Individual Exam-Stage-Year Dedicated Paper Page
 * Matches User Template to the letter with Verified Metadata
 * ============================================================
 */
function renderPaperDetail({ paperItem }) {
  const questions = getQuestionsForPaper(paperItem)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: paperItem.title,
    description: paperItem.metaDescription,
    educationalLevel: 'Competitive Government Examination',
    learningResourceType: 'Question Paper and Answer Key',
    url: `https://examudaan.in/mpsc/${paperItem.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'ExamUdaan',
      url: 'https://examudaan.in'
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
          <ol className={styles.breadcrumbList}>
            <li>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            </li>
            <li className={styles.breadcrumbSeparator}>›</li>
            <li>
              <Link href="/mpsc-pyq" className={styles.breadcrumbLink}>MPSC PYQ Archive</Link>
            </li>
            <li className={styles.breadcrumbSeparator}>›</li>
            <li>
              <Link href={paperItem.hubUrl} className={styles.breadcrumbLink}>{paperItem.cadreShortName}</Link>
            </li>
            <li className={styles.breadcrumbSeparator}>›</li>
            <li className={styles.breadcrumbCurrent}>{paperItem.stageLabel} {paperItem.examYear}</li>
          </ol>
        </nav>

        {/* Template Header Banner */}
        <div className={styles.headerBanner}>
          <div className={styles.badgeRow}>
            <span className={styles.cadreBadge}>{paperItem.cadreBadge}</span>
            <span className={styles.stageBadge}>{paperItem.stageLabel}</span>
            <span className={styles.yearBadge}>Exam Year {paperItem.examYear}</span>
            <span className={styles.statusPill}>{paperItem.keyStatus}</span>
          </div>

          <h1 className={styles.mainTitle}>
            {paperItem.title}
          </h1>
          <div className={styles.marathiTitle}>
            मराठी: {paperItem.titleMr}
          </div>
          <p className={styles.leadDescription}>
            Access the original question paper and official verified answer key for the MPSC {paperItem.cadreNameEn} {paperItem.stageLabel}. Review the paper online or download the official PDF to practise offline under real exam conditions.
          </p>
        </div>

        {/* Two-Column Grid: Main Content & Sidebar */}
        <div className={styles.contentGrid}>
          <div className={styles.mainCol}>
            {/* 1. Exam Details Card (User Template Table) */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span>📋</span> Exam Details & Metadata
                </h2>
                <span className={styles.statusPill}>Official Government Record</span>
              </div>

              <table className={styles.metaTable}>
                <tbody>
                  <tr className={styles.metaRow}>
                    <td className={styles.metaLabel}>Examination</td>
                    <td className={styles.metaValue}>{paperItem.cadreNameEn} ({paperItem.cadreNameMr})</td>
                  </tr>
                  <tr className={styles.metaRow}>
                    <td className={styles.metaLabel}>Stage</td>
                    <td className={styles.metaValue}>{paperItem.stageLabel} ({paperItem.stageLabelMr})</td>
                  </tr>
                  <tr className={styles.metaRow}>
                    <td className={styles.metaLabel}>Exam Year</td>
                    <td className={styles.metaValue}><strong>{paperItem.examYear}</strong></td>
                  </tr>
                  <tr className={styles.metaRow}>
                    <td className={styles.metaLabel}>Advertisement Year</td>
                    <td className={styles.metaValue}>
                      {paperItem.advertisementYear}
                      {paperItem.advertisementNumber && ` (Advt. No. ${paperItem.advertisementNumber}/${paperItem.advertisementYear})`}
                    </td>
                  </tr>
                  <tr className={styles.metaRow}>
                    <td className={styles.metaLabel}>Paper</td>
                    <td className={styles.metaValue}>{paperItem.paperName} ({paperItem.paperNameMr})</td>
                  </tr>
                  <tr className={styles.metaRow}>
                    <td className={styles.metaLabel}>Total Marks & Duration</td>
                    <td className={styles.metaValue}>{paperItem.totalMarks} Marks • {paperItem.durationMinutes} Minutes</td>
                  </tr>
                  <tr className={styles.metaRow}>
                    <td className={styles.metaLabel}>Answer Key Status</td>
                    <td className={styles.metaValue}>
                      <span className={styles.statusPill}>{paperItem.keyStatus}</span>
                    </td>
                  </tr>
                  <tr className={styles.metaRow}>
                    <td className={styles.metaLabel}>Official Source</td>
                    <td className={styles.metaValue}>
                      <a
                        href={paperItem.officialSource.startsWith('http') ? paperItem.officialSource : 'https://mpsc.gov.in'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.breadcrumbLink}
                      >
                        {paperItem.officialSource} ↗
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. Question Paper and Answer Key Resource Downloads */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span>📥</span> Question Paper & Official Answer Key
                </h2>
              </div>

              <div className={styles.resourceGrid}>
                {/* Paper Resource */}
                <div className={styles.resourceCard}>
                  <div>
                    <span className={styles.resourceType}>Official Question Paper</span>
                    <h3 className={styles.resourceTitle}>{paperItem.paperName}</h3>
                    <p className={styles.resourceDesc}>
                      Original question paper released by Maharashtra Public Service Commission. Contains all official questions with original set numbering.
                    </p>
                  </div>
                  <div className={styles.btnGroup}>
                    <Link
                      href={paperItem.questionPaper?.readOnlineUrl || `/mpsc-pyq?year=${paperItem.examYear}`}
                      className={styles.btnPrimary}
                    >
                      📄 View Paper →
                    </Link>
                    <Link
                      href={`/mock-tests?exam=mpsc&year=${paperItem.examYear || 2023}`}
                      className={styles.btnOutline}
                    >
                      ⏱️ Timed CBT Mock ({paperItem.examYear})
                    </Link>
                  </div>
                </div>

                {/* Answer Key Resource */}
                <div className={styles.resourceCard}>
                  <div>
                    <span className={styles.resourceType}>Verified Answer Key</span>
                    <h3 className={styles.resourceTitle}>Official Final Key</h3>
                    <p className={styles.resourceDesc}>
                      Final revised answer key issued post-objections by MPSC subject experts. Used for official merit ranking and cutoffs.
                    </p>
                  </div>
                  <div className={styles.btnGroup}>
                    {paperItem.answerKey?.downloadUrl ? (
                      <a
                        href={paperItem.answerKey.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnKeySuccess}
                      >
                        🔑 View Answer Key →
                      </a>
                    ) : (
                      <Link
                        href={`/mpsc-pyq?docId=${paperItem.id || ''}&year=${paperItem.examYear}&docType=ak`}
                        className={styles.btnKeySuccess}
                      >
                        🔑 View Answer Key →
                      </Link>
                    )}
                    <span className={styles.statusPill}>Status: {paperItem.keyStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Question Practice Mode (Instant Evaluation + LocalStorage Progress) */}
            {questions && questions.length > 0 && (
              <PaperQuestionSolver
                questions={questions}
                paperSlug={paperItem.slug}
                paperTitle={paperItem.title}
                pdfUrl={paperItem.questionPaper?.downloadUrl}
              />
            )}

            {/* 3. Analysis of This Paper (Subject Distribution & Difficulty) */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span>📊</span> Analysis of this Paper
                </h2>
                <span className={styles.stageBadge}>Syllabus Weightage</span>
              </div>
              <p className={styles.leadDescription}>
                Subject distribution, question format, and negative marking scheme verified against the official examination curriculum:
              </p>

              <div className={styles.analysisList}>
                <div className={styles.analysisItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>Exam Pattern: <strong>{paperItem.topicAnalysis?.examPattern}</strong></span>
                </div>
                <div className={styles.analysisItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>Negative Marking: <strong>{paperItem.topicAnalysis?.negativeMarking}</strong></span>
                </div>
                <div className={styles.analysisItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>Medium: <strong>{paperItem.topicAnalysis?.medium}</strong></span>
                </div>
                <div className={styles.analysisItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>Official Total Marks: <strong>{paperItem.totalMarks} Marks</strong></span>
                </div>
              </div>

              <div className={`${styles.sectionHeader} ${styles.subSectionHeader}`}>
                <h3 className={styles.sectionTitle}>Key Subject Areas Tested:</h3>
              </div>
              <ul className={styles.analysisList}>
                {(paperItem.topicAnalysis?.keySubjects || []).map((sub, idx) => (
                  <li key={idx} className={styles.analysisItem}>
                    <span className={styles.checkIcon}>•</span>
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Practice the Same Syllabus */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span>🎯</span> Practice the Same Syllabus
                </h2>
              </div>

              <div className={styles.practiceGrid}>
                <Link
                  href={paperItem.practiceLinks?.detailedSolutions || `/mpsc/solutions`}
                  className={styles.practiceCard}
                >
                  <div className={styles.practiceCardTitle}>
                    Detailed Solutions & Explanations <span>→</span>
                  </div>
                  <p className={styles.practiceCardDesc}>
                    Step-by-step Marathi & English solutions explaining why the correct option is right and why others are incorrect.
                  </p>
                </Link>

                <Link
                  href={paperItem.practiceLinks?.solveOnlineMock || `/mock-tests`}
                  className={styles.practiceCard}
                >
                  <div className={styles.practiceCardTitle}>
                    Attempt Timed Online Mock Test <span>→</span>
                  </div>
                  <p className={styles.practiceCardDesc}>
                    Solve this exact paper under realistic exam timer conditions with negative marking calculations.
                  </p>
                </Link>

                <Link
                  href={paperItem.practiceLinks?.topicWisePyq || `/pyq`}
                  className={styles.practiceCard}
                >
                  <div className={styles.practiceCardTitle}>
                    Topic-Wise 1,100+ PYQ Question Bank <span>→</span>
                  </div>
                  <p className={styles.practiceCardDesc}>
                    Practice questions organized strictly by subject: Polity, History, Geography, Economy, and Science.
                  </p>
                </Link>

                <Link
                  href={paperItem.practiceLinks?.syllabusTracker || `/mpsc/syllabus-tracker`}
                  className={styles.practiceCard}
                >
                  <div className={styles.practiceCardTitle}>
                    Track Syllabus Progress <span>→</span>
                  </div>
                  <p className={styles.practiceCardDesc}>
                    Check your completion percentage against the 343 officially gazetted MPSC micro-topics.
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className={styles.sidebarCol}>
            {/* Same Cadre Other Years Hub Card */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>More {paperItem.cadreShortName} Papers</h3>
              </div>
              <p className={styles.leadDescription}>
                Browse all previous year question papers from 2009 to 2026 for {paperItem.cadreNameEn}.
              </p>
              <div className={styles.actionSpacing}>
                <Link href={paperItem.hubUrl} className={styles.btnPrimary}>
                  Browse All {paperItem.cadreShortName} Papers →
                </Link>
              </div>
            </div>

            {/* Quick Navigation to Other Cadres */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>MPSC Examination Hubs</h3>
              </div>
              <ul className={styles.sidebarNavList}>
                {Object.values(manifest.cadres || {}).map(c => (
                  <li key={c.slug} className={styles.analysisItem}>
                    <Link href={`/mpsc/${c.slug}`} className={styles.breadcrumbLink}>
                      {c.nameEn} ({c.badge}) →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Master Archive Link */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Master MPSC Archive</h3>
              </div>
              <p className={styles.leadDescription}>
                Looking for all {MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('en-IN')} question papers and answer keys in one interactive in-browser workspace?
              </p>
              <div className={styles.actionSpacing}>
                <Link href="/mpsc-pyq" className={styles.btnOutline}>
                  Open Master Archive (2009–2026) →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
