// ============================================================
// app/pricing/layout.js — Pricing & Subscription Plans Metadata
// ============================================================

export const metadata = {
  title: 'Pricing & Subscription Plans — WhatsApp Alerts',
  description: 'Choose affordable monthly plans (from ₹29/month) for personalized WhatsApp, SMS, and Email job alerts with custom eligibility matching for MPSC, Police, SSC & more.',
  keywords: [
    'ExamUdaan pricing', 'WhatsApp job alerts subscription', 'govt job alert plans',
    'MPSC alert subscription', 'sarkari naukri alert price', 'monthly job alert'
  ],
  alternates: {
    canonical: 'https://examudaan.in/pricing',
  },
  openGraph: {
    title: 'Pricing & Subscription Plans | ExamUdaan',
    description: 'Affordable monthly plans from ₹29/month for personalized WhatsApp & Email job alerts.',
    url: 'https://examudaan.in/pricing',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Pricing Plans | ExamUdaan',
    description: 'WhatsApp & Email govt job alerts from ₹29/month.',
  },
}

export default function PricingLayout({ children }) {
  return children
}
