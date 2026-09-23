// ============================================================
// app/blog/page.js — ExamUdaan Blog & Preparation Guides Hub
// High-Quality Long-Tail Keyword Articles for Maximum Google Traffic
// ============================================================

import BlogClientView from './BlogClientView'
import { getAllBlogPosts } from '../../lib/blogData'

export const metadata = {
  title: 'Exam Preparation Blog & Study Guides | MPSC, Police Bharti, Talathi — ExamUdaan',
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
    title: 'Exam Preparation Blog & Guides — ExamUdaan.in',
    description: 'In-depth preparation blueprints, 90-day study plans, and 10-year PYQ trend analysis for MPSC, Police Bharti, Talathi, and SSC CGL.',
    url: 'https://examudaan.in/blog',
    type: 'website',
  },
}

export const revalidate = 86400 // Daily ISR refresh

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return <BlogClientView initialPosts={posts} />
}
