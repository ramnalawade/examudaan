// ============================================================
// app/login/layout.js — Sign In Metadata
// ============================================================

export const metadata = {
  title: {
    absolute: 'Sign In | ExamUdaan.in — Maharashtra Govt Job Alerts | MPSC, Police Bharti, BMC',
  },
  description: 'Sign in to ExamUdaan.in to manage your saved government jobs, set custom exam alert criteria, and get instant updates.',
  alternates: {
    canonical: 'https://examudaan.in/login',
  },
  openGraph: {
    title: 'Sign In | ExamUdaan.in — Maharashtra Govt Job Alerts | MPSC, Police Bharti, BMC',
    description: 'Sign in to ExamUdaan.in to manage your saved government jobs, set custom exam alert criteria, and get instant updates.',
    url: 'https://examudaan.in/login',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function LoginLayout({ children }) {
  return children
}
