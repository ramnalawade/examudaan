// ============================================================
// app/mock-tests/layout.js — CBT Mock Tests Metadata
// ============================================================

export const metadata = {
  title: 'Free Mock Tests 2026 — Online Practice Sets',
  description: 'Practice real exam-pattern CBT mock tests with timer, question palette, negative marking, and instant scorecard & performance analytics for MPSC, Police Bharti, SSC & Banking.',
  keywords: [
    'free mock tests 2026', 'MPSC mock test', 'police bharti mock test',
    'SSC CGL mock test', 'online practice test', 'CBT mock test',
    'talathi mock test', 'banking mock test', 'full length mock'
  ],
  alternates: {
    canonical: 'https://examudaan.in/mock-tests',
  },
  openGraph: {
    title: 'Free Mock Tests 2026 — Online Practice | ExamUdaan',
    description: 'Real exam pattern mock tests for MPSC, Police Bharti, SSC & Banking with detailed solutions.',
    url: 'https://examudaan.in/mock-tests',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Free Mock Tests 2026 | ExamUdaan',
    description: 'MPSC, Police Bharti, SSC & Banking mock tests with instant scorecard.',
  },
}

export default function MockTestsLayout({ children }) {
  return children
}
