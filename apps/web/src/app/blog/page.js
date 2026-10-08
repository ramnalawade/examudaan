// ============================================================
// app/blog/page.js — ExamUdaan Blog & Preparation Guides Hub
// High-Quality Long-Tail Keyword Articles for Maximum Google Traffic
// ============================================================

import BlogClientView from './BlogClientView'
import { getAllBlogPosts } from '../../lib/blogData'

export const metadata = {
  title: 'Exam Prep Blog \u2014 MPSC, Police Bharti & Talathi Guides',
  description: 'In-depth preparation blueprints, 90-day micro-study plans, 10-year PYQ trend analysis, and career guidance for Maharashtra government competitive examinations.',
  keywords: [
    'how to crack mpsc in 6 months',
    'maharashtra police bharti preparation strategy',
    'mpsc combined syllabus 2026',
    'tcs pattern syllabus maharashtra',
    'mpsc 10 year pyq analysis',
    'class 1 vs class 2 govt jobs maharashtra'
  ],
  alternates: {
    canonical: 'https://examudaan.in/blog',
  },
  openGraph: {
    title: 'Exam Prep Blog \u2014 MPSC, Police Bharti & Talathi Guides',
    description: 'Prep blueprints, 90-day study plans, and PYQ analysis for MPSC, Police Bharti & Talathi.',
    url: 'https://examudaan.in/blog',
    siteName: 'ExamUdaan.in',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Exam Prep Blog | ExamUdaan',
    description: 'MPSC, Police Bharti & Talathi preparation guides.',
  },
}


export const revalidate = 86400 // Daily ISR refresh

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return <BlogClientView initialPosts={posts} />
}
