// ============================================================
// app/alerts/layout.js — WhatsApp & SMS Job Alerts Metadata
// ============================================================

export const metadata = {
  title: 'Instant WhatsApp & Telegram Govt Job Alerts | ExamUdaan',
  description: 'Subscribe to instant WhatsApp, Telegram, and SMS job notifications for Maharashtra and Central government recruitment, admit cards, and results.',
  alternates: {
    canonical: 'https://examudaan.in/alerts',
  },
  openGraph: {
    title: 'Instant WhatsApp & Telegram Govt Job Alerts | ExamUdaan',
    description: 'Subscribe to instant job alerts directly on your phone.',
    url: 'https://examudaan.in/alerts',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function AlertsLayout({ children }) {
  return children
}
