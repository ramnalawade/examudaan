// ============================================================
// app/register/layout.js — Sign Up Metadata
// ============================================================

export const metadata = {
  title: {
    absolute: 'Sign Up | ExamUdaan.in — Maharashtra Govt Job Alerts | MPSC, Police Bharti, BMC',
  },
  description: 'Create your free account on ExamUdaan to get instant WhatsApp alerts, track government exams, and check AI eligibility.',
  alternates: {
    canonical: 'https://examudaan.in/register',
  },
  openGraph: {
    title: 'Sign Up | ExamUdaan.in — Maharashtra Govt Job Alerts | MPSC, Police Bharti, BMC',
    description: 'Create your free account on ExamUdaan to get instant WhatsApp alerts, track government exams, and check AI eligibility.',
    url: 'https://examudaan.in/register',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function RegisterLayout({ children }) {
  return children
}
