// ============================================================
// app/question-papers/viewer/[...slug]/page.js — Clean Human-Readable PDF Viewer
// Replaces legacy query strings (?pdf=...) with semantic SEO slugs.
// 100% Sourced from Maharashtra Public Service Commission (mpsc.gov.in)
// ZERO INLINE STYLES POLICY: All styles live in viewer.module.css
// ============================================================

import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from '../viewer.module.css'
import {
  resolveMpscDocument,
  getMpscViewerStaticParams
} from '@/lib/mpscDocumentResolver'
import { toSecureDocUrl } from '@/lib/docObfuscate'
import { fitDescription } from '@/lib/seoMetadata'
import { MPSC_TOTAL_QUESTION_PAPERS } from '@/lib/platformStats'

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return getMpscViewerStaticParams()
}

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params)
  const doc = resolveMpscDocument(resolvedParams?.slug)

  if (!doc) {
    return {
      title: { absolute: 'MPSC Question Paper with Answer Key PDF | ExamUdaan' },
      description: 'Official question papers and answer keys from mpsc.gov.in. Free online viewer on ExamUdaan.',
    }
  }

  const examName = doc.examName || doc.title || 'MPSC'
  const yearStr = doc.year ? ` ${doc.year}` : ''

  // Pattern: "{Exam} {Year} Question Paper with Answer Key PDF", max 60 chars
  let title = `${examName}${yearStr} Question Paper with Answer Key PDF`
  if (title.length > 60) {
    title = `${examName}${yearStr} Question Paper & Answer Key PDF`
  }
  if (title.length > 60) {
    title = `${examName}${yearStr} Question Paper PDF`
  }
  if (title.length > 60) {
    title = `${examName}${yearStr} Question Paper`
  }
  if (title.length > 60) {
    title = `${examName}${yearStr}`.slice(0, 60)
  }

  const canonicalUrl = `https://examudaan.in${doc.cleanUrlPath}`
  const description = fitDescription(
    `Read official ${doc.title} (${doc.year}) question paper directly with verified answer key from Maharashtra PSC (mpsc.gov.in).`,
    'Official question paper PDF download on ExamUdaan.'
  )

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
      type: 'article',
      siteName: 'ExamUdaan',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function PaperViewerSlugPage({ params }) {
  const resolvedParams = await Promise.resolve(params)
  const doc = resolveMpscDocument(resolvedParams?.slug)

  if (!doc) {
    notFound()
  }

  const securePdfUrl = toSecureDocUrl(doc.directWebPath || `/api/mpsc-pdf/${doc.id}`)
  const officialSource = 'https://mpsc.gov.in'

  // Schema.org Structured Data
  const docSchema = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: doc.title,
    description: `Official document: ${doc.title} (${doc.year}) published by Maharashtra Public Service Commission.`,
    url: `https://examudaan.in${doc.cleanUrlPath}`,
    encodingFormat: 'application/pdf',
    publisher: {
      '@type': 'Organization',
      name: 'Maharashtra Public Service Commission (MPSC)',
      url: officialSource,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://examudaan.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Question Papers',
        item: 'https://examudaan.in/question-papers',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'MPSC Study Hub',
        item: 'https://examudaan.in/mpsc-pyq',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: doc.title,
        item: `https://examudaan.in${doc.cleanUrlPath}`,
      },
    ],
  }

  return (
    <div className={styles.viewerPage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <Link href="/mpsc-pyq" className={styles.backLink}>
            ← MPSC Papers Hub
          </Link>
          <span className={styles.divider}>|</span>
          <span className={styles.docTitleText} title={doc.title}>
            {doc.title}
          </span>
        </div>

        <a
          href={officialSource}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.sourceBadge}
        >
          <span>🏛️</span> Official Source: mpsc.gov.in ↗
        </a>
      </header>

      {/* Main Layout: PDF Viewer + Related Study Sidebar */}
      <div className={styles.mainLayout}>
        {/* PDF Embed Workspace */}
        <main className={styles.pdfContainer}>
          <iframe
            src={securePdfUrl}
            title={doc.title}
            className={styles.iframe}
          />
        </main>

        {/* Related Content Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>
              <span>⚡</span> Practice Related PYQs
            </h3>
            <p className={styles.sidebarText}>
              Solve authentic previous year questions from this paper with instant answer verification and Marathi explanations.
            </p>
            <div className={styles.toolList}>
              <Link href="/pyq" className={styles.toolItem}>
                <span className={styles.toolIcon}>📚</span>
                <div className={styles.toolInfo}>
                  <span className={styles.toolLabel}>15-Yr Topic PYQ Bank</span>
                  <span className={styles.toolDesc}>1,100+ Solved MPSC MCQs</span>
                </div>
              </Link>
              <Link href="/mock-tests" className={styles.toolItem}>
                <span className={styles.toolIcon}>🎯</span>
                <div className={styles.toolInfo}>
                  <span className={styles.toolLabel}>CBT Mock Test Engine</span>
                  <span className={styles.toolDesc}>100-Q Full Timed Simulations</span>
                </div>
              </Link>
              <Link href="/syllabus/mpsc-state-services" className={styles.toolItem}>
                <span className={styles.toolIcon}>📋</span>
                <div className={styles.toolInfo}>
                  <span className={styles.toolLabel}>Official Syllabus 2026</span>
                  <span className={styles.toolDesc}>Topic-wise weightage</span>
                </div>
              </Link>
              <Link href="/score-calculator" className={styles.toolItem}>
                <span className={styles.toolIcon}>🧮</span>
                <div className={styles.toolInfo}>
                  <span className={styles.toolLabel}>Score Calculator</span>
                  <span className={styles.toolDesc}>1/4 Negative marking calc</span>
                </div>
              </Link>
            </div>
          </div>

          <div className={styles.mpscHubCard}>
            <h4 className={styles.sidebarTitle}>
              <span>📖</span> MPSC Study Workspace
            </h4>
            <p className={styles.sidebarText}>
              Access {MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('en-IN')} official question papers & final answer keys arranged side-by-side in one row.
            </p>
            <Link href="/mpsc-pyq" className={styles.mpscHubBtn}>
              Open MPSC Hub ({MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('en-IN')} PDFs) →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
