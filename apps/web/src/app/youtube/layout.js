// ============================================================
// app/youtube/layout.js — YouTube Video Hub Metadata
// ============================================================

export const metadata = {
  title: 'Top YouTube Lectures for Govt Exams 2026',
  description: 'Free curated YouTube video lectures and complete syllabus playlists from top educators for MPSC, UPSC, Police Bharti, Talathi & SSC government competitive examinations.',
  keywords: [
    'MPSC YouTube lectures', 'free exam video lectures', 'police bharti YouTube',
    'talathi exam videos', 'SSC YouTube playlist', 'UPSC free lectures',
    'government exam YouTube channel', 'Marathi exam lectures'
  ],
  alternates: {
    canonical: 'https://examudaan.in/youtube',
  },
  openGraph: {
    title: 'Top YouTube Lectures for Govt Exams 2026 | ExamUdaan',
    description: 'Free YouTube video lectures for MPSC, Police Bharti, Talathi & SSC from top educators.',
    url: 'https://examudaan.in/youtube',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'YouTube Lectures for Exams 2026 | ExamUdaan',
    description: 'Free MPSC, Police Bharti & Talathi YouTube video lectures from top educators.',
  },
}

export default function YoutubeLayout({ children }) {
  return children
}
