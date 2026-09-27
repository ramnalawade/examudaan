// ============================================================
// app/contact/layout.js — Contact Us Metadata
// ============================================================

export const metadata = {
  title: 'Contact Us — Support & Grievance Desk | ExamUdaan',
  description: 'Get in touch with the ExamUdaan team for student support, technical assistance, subscription queries, or advertising partnerships.',
  alternates: {
    canonical: 'https://examudaan.in/contact',
  },
  openGraph: {
    title: 'Contact Us | ExamUdaan.in',
    description: 'Get in touch for support, feedback, or partnerships.',
    url: 'https://examudaan.in/contact',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function ContactLayout({ children }) {
  return children
}
