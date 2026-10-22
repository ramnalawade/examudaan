// ============================================================
// app/question-papers/viewer/page.js — Legacy Query String Handler & 301 Redirect
// Automatically upgrades legacy URLs (?pdf=/downloads/mpsc/...) to clean human-readable paths.
// ZERO INLINE STYLES POLICY: Fallback render uses viewer.module.css
// ============================================================

import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './viewer.module.css'
import { resolveLegacyPdfUrl } from '@/lib/mpscDocumentResolver'
import { toSecureDocUrl } from '@/lib/docObfuscate'

export const metadata = {
  title: 'View Question Paper | ExamUdaan',
  description: 'Read previous year question papers and answer keys in your browser. Practice interactively with 1,100+ PYQs and CBT mock tests on ExamUdaan.',
}

export default async function LegacyPaperViewerPage({ searchParams }) {
  const resolvedParams = await Promise.resolve(searchParams)
  const rawPdfPath = resolvedParams?.pdf || ''

  // 1. If empty query, redirect to question papers directory
  if (!rawPdfPath) {
    redirect('/question-papers')
  }

  // 2. Attempt 301 permanent upgrade to clean human-readable path
  const cleanUrl = resolveLegacyPdfUrl(rawPdfPath)
  if (cleanUrl) {
    redirect(cleanUrl)
  }

  // 3. Fallback render for unknown or custom PDF queries (preserves zero 404s)
  const pdfPath = toSecureDocUrl(rawPdfPath)
  const title = resolvedParams?.title || 'Official Government Examination Document'

  const safeToEmbed = (
    pdfPath.startsWith('/question-papers/') ||
    pdfPath.startsWith('/downloads/mpsc/') ||
    pdfPath.startsWith('/api/mpsc-pdf/')
  ) && (pdfPath.endsWith('.pdf') || pdfPath.includes('/api/mpsc-pdf/'))

  return (
    <div className={styles.viewerPage}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <Link href="/question-papers" className={styles.backLink}>
            ← Question Papers
          </Link>
          <span className={styles.divider}>|</span>
          <span className={styles.docTitleText} title={title}>
            {title}
          </span>
        </div>

        <a
          href="https://mpsc.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.sourceBadge}
        >
          <span>🏛️</span> Official Source: mpsc.gov.in ↗
        </a>
      </header>

      {/* Main Layout */}
      <div className={styles.mainLayout}>
        <main className={styles.pdfContainer}>
          {safeToEmbed ? (
            <iframe
              src={pdfPath}
              title={title}
              className={styles.iframe}
            />
          ) : (
            <div className={styles.errorBox}>
              <h2 className={styles.errorTitle}>Invalid Document Path</h2>
              <p className={styles.errorText}>
                The requested PDF path could not be verified from official government sources.
              </p>
              <Link href="/question-papers" className={styles.backLink}>
                ← Return to Question Papers Directory
              </Link>
            </div>
          )}
        </main>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>
              <span>⚡</span> Practice Related PYQs
            </h3>
            <p className={styles.sidebarText}>
              Solve authentic previous year questions with instant answer verification.
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
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
