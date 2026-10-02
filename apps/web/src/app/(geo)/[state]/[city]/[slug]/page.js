// ============================================================
// app/(geo)/[state]/[city]/[slug]/page.js — Hierarchical Job Detail Page
// Route: /[state]/[city]/[slug] e.g. /maharashtra/nagpur/csir-neeri-nagpur-junior-secretariat-assistant-2026
// ============================================================

import JobDetailPage, { generateMetadata as baseGenerateMetadata } from '../../../../jobs/[slug]/page'

export async function generateMetadata(props) {
  return baseGenerateMetadata(props)
}

export default function GeoJobDetailPage(props) {
  return <JobDetailPage {...props} />
}
