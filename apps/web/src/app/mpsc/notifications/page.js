// ============================================================
// app/mpsc/notifications/page.js
// ExamUdaan | MPSC Official Notification Tracker Page
// ============================================================

import NotificationsTrackerClient from './NotificationsTrackerClient'

export const metadata = {
  title: 'MPSC Official Notification Tracker 2026 | वेळापत्रक, प्रवेशपत्र, उत्तरतालिका व निकाल | ExamUdaan',
  description: 'महाराष्ट्र लोकसेवा आयोग (MPSC) अधिकृत प्रसिद्धीपत्रके, जाहिराती, परीक्षांचे वेळापत्रक, प्रवेशपत्र (Hall Ticket), प्रथम व अंतिम उत्तरतालिका आणि निकाल थेट PDF सह डाऊनलोड करा.',
  keywords: [
    'MPSC Notifications 2026',
    'MPSC official announcement',
    'MPSC hall ticket download',
    'MPSC provisional answer key',
    'MPSC final answer key',
    'MPSC exam timetable 2026',
    'MPSC result of exam',
    'महाराष्ट्र लोकसेवा आयोग प्रसिद्धीपत्रक'
  ],
  alternates: {
    canonical: 'https://examudaan.in/mpsc/notifications',
  },
  openGraph: {
    title: 'MPSC Official Notification Tracker 2026 | ExamUdaan',
    description: 'थेट MPSC आयोगाकडून सर्व अधिकृत जाहिराती, वेळापत्रक, प्रवेशपत्रे, उत्तरतालिका आणि निकालांचे रिअल-टाइम कालक्रमानुसार संकलन.',
    url: 'https://examudaan.in/mpsc/notifications',
    siteName: 'ExamUdaan',
    locale: 'mr_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MPSC Official Notification Tracker 2026 | ExamUdaan',
    description: 'MPSC सर्व अधिकृत जाहिराती, वेळापत्रक, हॉल तिकीट व निकाल मोफत पहा व अधिकृत PDF डाऊनलोड करा.',
  },
}

export default function MpscNotificationsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MPSC Official Notification Tracker',
    description: 'Live chronological feed for official MPSC advertisements, exam schedules, hall tickets, answer keys and results.',
    url: 'https://examudaan.in/mpsc/notifications',
    publisher: {
      '@type': 'Organization',
      name: 'ExamUdaan',
      url: 'https://examudaan.in',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://examudaan.in',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'MPSC Hub',
          item: 'https://examudaan.in/mpsc',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Notification Tracker',
          item: 'https://examudaan.in/mpsc/notifications',
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NotificationsTrackerClient />
    </>
  )
}
