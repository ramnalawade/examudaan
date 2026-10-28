// ============================================================
// app/mpsc/solutions/page.js
// ExamUdaan | MPSC Previous Papers Detailed Solutions Page
// ============================================================

import SolutionsClient from './SolutionsClient'

export const metadata = {
  title: 'MPSC Previous Papers Detailed Solutions & Explanations | सविस्तर उत्तरे व विश्लेषण | ExamUdaan',
  description: 'MPSC राज्यसेवा (Rajyaseva), गट ब (Group B) व गट क संयुक्त परीक्षांच्या मागील वर्षांच्या प्रश्नपत्रिकांची अधिकृत अंतिम उत्तरतालिकेनुसार सविस्तर मराठी व इंग्रजी उत्तरे, इतर पर्याय का चुकीचे आहेत याचे विश्लेषण आणि संदर्भ ग्रंथ.',
  keywords: [
    'MPSC detailed solutions',
    'MPSC previous papers solved',
    'MPSC official answer key explanation',
    'MPSC Rajyaseva paper solution',
    'MPSC Group B solutions Marathi',
    'MPSC revised answer key analysis',
    'महाराष्ट्र लोकसेवा आयोग प्रश्नपत्रिका विश्लेषण'
  ],
  alternates: {
    canonical: 'https://examudaan.in/mpsc/solutions',
  },
  openGraph: {
    title: 'MPSC Previous Papers Detailed Solutions & Explanations | ExamUdaan',
    description: 'केवळ उत्तर न समजता "हेच उत्तर का योग्य आहे?" व "इतर पर्याय का अयोग्य आहेत?" याचे सप्रमाण विश्लेषण व संदर्भ ग्रंथ.',
    url: 'https://examudaan.in/mpsc/solutions',
    siteName: 'ExamUdaan',
    locale: 'mr_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MPSC Previous Papers Detailed Solutions & Explanations | ExamUdaan',
    description: 'MPSC मागील वर्षांच्या प्रश्नपत्रिकांची अधिकृत अंतिम उत्तरतालिकेनुसार सविस्तर उत्तरे व संदर्भ ग्रंथ.',
  },
}

export default function MpscSolutionsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MPSC Previous Papers Detailed Solutions & Explanations',
    description: 'Detailed solutions with Marathi explanations, option rebuttals, and source references for high-demand MPSC examination papers.',
    url: 'https://examudaan.in/mpsc/solutions',
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
          name: 'Detailed Solutions',
          item: 'https://examudaan.in/mpsc/solutions',
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
      <SolutionsClient />
    </>
  )
}
