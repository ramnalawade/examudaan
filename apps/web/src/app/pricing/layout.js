// ============================================================
// app/pricing/layout.js — Pricing & Subscription Plans Metadata
// ============================================================

export const metadata = {
  title: 'Pricing & Plans — Unlimited Govt Exam Alerts | ExamUdaan',
  description: 'Choose affordable monthly and annual plans for personalized WhatsApp, SMS, and Email job alerts, custom criteria matching, and priority support.',
  alternates: {
    canonical: 'https://examudaan.in/pricing',
  },
  openGraph: {
    title: 'Pricing & Plans — ExamUdaan.in',
    description: 'Affordable monthly and annual plans for personalized exam alerts.',
    url: 'https://examudaan.in/pricing',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function PricingLayout({ children }) {
  return children
}
