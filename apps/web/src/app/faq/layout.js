// ============================================================
// app/faq/layout.js — Frequently Asked Questions Metadata
// ============================================================

export const metadata = {
  title: 'FAQ — Frequently Asked Questions | ExamUdaan',
  description: 'Find answers to common questions about ExamUdaan job alerts, WhatsApp notifications, eligibility criteria, MPSC exam updates and payment support.',
  keywords: [
    'ExamUdaan FAQ', 'govt job alerts FAQ', 'MPSC notification questions',
    'WhatsApp alerts help', 'exam udaan support', 'sarkari job portal FAQ'
  ],
  alternates: {
    canonical: 'https://examudaan.in/faq',
  },
  openGraph: {
    title: 'FAQ — Frequently Asked Questions | ExamUdaan',
    description: 'Common questions about ExamUdaan job alerts, WhatsApp notifications, eligibility, and support.',
    url: 'https://examudaan.in/faq',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FAQ | ExamUdaan',
    description: 'Common questions about ExamUdaan job alerts, notifications & support.',
  },
}

export default function FaqLayout({ children }) {
  return children
}
