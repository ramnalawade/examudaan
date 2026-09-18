// ============================================================
// components/DetailBreadcrumb.js — Localized Detail Breadcrumbs
// ExamUdaan.in | Dynamically adapts to English / Marathi
// ============================================================

'use client'

import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'

export default function DetailBreadcrumb({ sectionLabel, sectionHref, orgAcronym, title, titleMr }) {
  const { t, isMarathi } = useLanguage()
  const displayTitle = (isMarathi && titleMr) ? titleMr : title

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
      <Link href="/">{t('nav.home', 'Home')}</Link>
      <span className="material-symbols-outlined breadcrumb-sep">chevron_right</span>
      <Link href={sectionHref}>{sectionLabel}</Link>
      {orgAcronym && (
        <>
          <span className="material-symbols-outlined breadcrumb-sep">chevron_right</span>
          <Link href={`${sectionHref}?org=${encodeURIComponent(orgAcronym)}`}>{orgAcronym}</Link>
        </>
      )}
      <span className="material-symbols-outlined breadcrumb-sep">chevron_right</span>
      <span
        className="breadcrumb-current"
        aria-current="page"
        style={{ maxWidth: 320, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}
      >
        {displayTitle}
      </span>
    </nav>
  )
}
