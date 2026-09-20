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
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1.3 }}>
        {primaryTitle}
      </h1>
      {secondaryTitle && (
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--primary)', marginTop: 6, lineHeight: 1.4 }}>
          {secondaryTitle}
        </h2>
      )}
      <p style={{ fontSize: 14, color: 'var(--secondary)', marginTop: 4 }}>
        {isMarathi && orgNameMr ? `${orgNameMr} (${orgName})` : orgName}
        {orgDepartment && ` — ${orgDepartment}`}
      </p>
    </div>
  )
}
