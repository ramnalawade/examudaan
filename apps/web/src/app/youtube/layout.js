// ============================================================
// app/youtube/layout.js — YouTube Video Hub Metadata
// ============================================================

export const metadata = {
  title: 'Top YouTube Lectures for MPSC, UPSC & Police Bharti 2026 | ExamUdaan',
  description: 'Free curated video lectures and complete syllabus playlists from top educators for Maharashtra and Central government competitive examinations.',
  alternates: {
    canonical: 'https://examudaan.in/youtube',
  },
  openGraph: {
    title: 'Top YouTube Lectures for Competitive Exams | ExamUdaan',
    description: 'Free curated video lectures and playlists.',
    url: 'https://examudaan.in/youtube',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
}

export default function YoutubeLayout({ children }) {
  return children
}
