// ============================================================
// components/JobDetailTitle.js — Localized Job Detail Header
// ExamUdaan.in | Dynamically swaps primary title on language toggle
// ============================================================

'use client'

import { useLanguage } from '../context/LanguageContext'
import { formatTitle } from '../lib/formatTitle'

export default function JobDetailTitle({ title, title_mr, orgName, orgNameMr, orgDepartment }) {
  const { isMarathi } = useLanguage()
  const rawPrimary = (isMarathi && title_mr) ? title_mr : title
  const rawSecondary = (isMarathi && title_mr) ? title : title_mr
  const primaryTitle = formatTitle(rawPrimary)
  const secondaryTitle = rawSecondary ? formatTitle(rawSecondary) : null

  return (
    <div>
      <h1 className="job-detail-primary-title">
        {primaryTitle}
      </h1>
      {secondaryTitle && (
        <h2 className="job-detail-secondary-title">
          {secondaryTitle}
        </h2>
      )}
      <p className="job-detail-org-subtitle">
        {isMarathi && orgNameMr ? `${orgNameMr} (${orgName})` : orgName}
        {orgDepartment && ` — ${orgDepartment}`}
      </p>
    </div>
  )
}
