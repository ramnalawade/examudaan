// ============================================================
// app/contact/layout.js — Contact Us Metadata
// ============================================================

export const metadata = {
  title: 'Contact Us — Support & Grievance Desk',
  description: 'Get in touch with the ExamUdaan team for student support, technical assistance, subscription queries, or advertising partnerships.',
  keywords: ['ExamUdaan contact', 'exam portal support', 'job alerts help', 'subscription support'],
  alternates: {
    canonical: 'https://examudaan.in/contact',
  },
  openGraph: {
    title: 'Contact Us | ExamUdaan',
    description: 'Get in touch for support, feedback, or partnerships.',
    url: 'https://examudaan.in/contact',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | ExamUdaan',
    description: 'Get in touch for support, feedback or partnerships.',
  },
}

export default function ContactLayout({ children }) {
  return children
}
