// ============================================================
// app/mpsc/mains-answer-writing/page.js
// ExamUdaan | MPSC Mains Answer-Writing Practice Page
// ============================================================

import MainsPracticeClient from './MainsPracticeClient'

export const metadata = {
  title: 'MPSC Mains Answer-Writing Practice Studio | वर्णनात्मक मुख्य परीक्षा सराव | ExamUdaan',
  description: 'MPSC राज्यसेवा वर्णनात्मक मुख्य परीक्षेसाठी GS-1 ते GS-4 व निबंधांचे वेळेनुसार उत्तर लेखन (Timed Practice), मॉडेल आऊटलाईन, महाराष्ट्राचा विशेष संदर्भ आणि ५-आयामी स्वयं-मूल्यमापन रुब्रिक.',
  keywords: [
    'MPSC Mains Answer Writing Practice',
    'MPSC descriptive paper practice',
    'MPSC GS model answer Marathi',
    'MPSC UPSC pattern answer structure',
    'MPSC mains timed writing test',
    'MPSC mains rubric evaluation',
    'राज्यसेवा मुख्य परीक्षा उत्तर लेखन'
  ],
  alternates: {
    canonical: 'https://examudaan.in/mpsc/mains-answer-writing',
  },
  openGraph: {
    title: 'MPSC Mains Answer-Writing Practice Studio | ExamUdaan',
    description: 'वर्णनात्मक मुख्य परीक्षेच्या तयारीसाठी वेळेचे नियोजन, प्रस्तावना-गाभा-निष्कर्ष रचना, मॉडेल आऊटलाईन आणि ५-आयामी स्वयं-मूल्यमापन रुब्रिक.',
    url: 'https://examudaan.in/mpsc/mains-answer-writing',
    siteName: 'ExamUdaan',
    locale: 'mr_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MPSC Mains Answer-Writing Practice Studio | ExamUdaan',
    description: 'MPSC वर्णनात्मक मुख्य परीक्षेसाठी वेळेनुसार उत्तर लेखन व मॉडेल आऊटलाईन.',
  },
}

export default function MpscMainsAnswerWritingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MPSC Mains Answer-Writing Practice Studio',
    description: 'Timed descriptive answer-writing studio with model outlines, Maharashtra case studies, and rubrics for MPSC Civil Services Mains.',
    url: 'https://examudaan.in/mpsc/mains-answer-writing',
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
          name: 'Mains Answer Writing',
          item: 'https://examudaan.in/mpsc/mains-answer-writing',
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
      <MainsPracticeClient />
    </>
  )
}
