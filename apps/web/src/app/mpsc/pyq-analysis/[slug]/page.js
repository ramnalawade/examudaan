// ============================================================
// app/mpsc/pyq-analysis/[slug]/page.js — Dedicated Concept PYQ Analysis Page
// ExamUdaan.in — SEO Optimized, Rich JSON-LD, Zero Inline Styles
// ============================================================

import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getAllTopicSlugs,
  getTopicItemFromSlug,
  getTopicSlug
} from '@/lib/mpscTopicSlugs'
import analyticsData from '@/lib/mpscAnalyticsData.json'
import ConceptQuestionsClient from './ConceptQuestionsClient'
import styles from './conceptDetails.module.css'

export async function generateStaticParams() {
  const slugs = getAllTopicSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug
  const topicItem = getTopicItemFromSlug(slug)

  if (!topicItem) {
    return {
      title: 'MPSC PYQ Concept Analysis | ExamUdaan',
      description: 'Historical MPSC question paper analysis and recurring concept breakdown.'
    }
  }

  const topicName = topicItem.topic
  const subject = topicItem.subject
  const qCount = topicItem.total_occurrences || 'Multiple'

  return {
    title: `${topicName} MPSC PYQ Analysis & Solved Questions | ExamUdaan`,
    description: `Practice verified MPSC questions on ${topicName} (${subject}). ${qCount} questions analyzed across official Maharashtra Public Service Commission exams with explanations.`,
    keywords: [
      `${topicName} MPSC questions`,
      `${topicName} PYQ`,
      `MPSC ${subject} ${topicName}`,
      'MPSC topic weightage',
      'MPSC recurring questions',
      'MPSC question paper solutions'
    ],
    alternates: {
      canonical: `https://examudaan.in/mpsc/pyq-analysis/${slug}`
    },
    openGraph: {
      title: `${topicName} MPSC Previous Year Questions & Solutions`,
      description: `Detailed analysis of ${qCount} official MPSC questions on ${topicName}. Explore question format, correct answer key, and commission explanations.`,
      url: `https://examudaan.in/mpsc/pyq-analysis/${slug}`,
      siteName: 'ExamUdaan',
      locale: 'en_IN',
      type: 'article'
    },
    twitter: {
      card: 'summary',
      title: `${topicName} MPSC PYQs (${qCount} Questions Analyzed)`,
      description: `Official MPSC exam questions on ${topicName} with answer keys.`
    }
  }
}

export default async function DedicatedConceptAnalysisPage({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug
  const topicItem = getTopicItemFromSlug(slug)

  if (!topicItem) {
    notFound()
  }

  // Find rank in hitlist
  const hitlist = analyticsData.hitlist || []
  const rank = hitlist.findIndex(h => h.topic === topicItem.topic) + 1

  // Related topics in same subject
  const relatedTopics = hitlist
    .filter(h => h.subject === topicItem.subject && h.topic !== topicItem.topic)
    .slice(0, 3)
    .map(h => ({ ...h, slug: getTopicSlug(h.topic) }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://examudaan.in'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'MPSC Papers',
            'item': 'https://examudaan.in/mpsc-pyq'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': 'PYQ Analytics',
            'item': 'https://examudaan.in/mpsc/pyq-analysis'
          },
          {
            '@type': 'ListItem',
            'position': 4,
            'name': topicItem.topic,
            'item': `https://examudaan.in/mpsc/pyq-analysis/${slug}`
          }
        ]
      },
      {
        '@type': 'Quiz',
        'name': `${topicItem.topic} MPSC Examination Practice Questions`,
        'description': `Verified MPSC previous year questions on ${topicItem.topic} with official keys.`,
        'educationalLevel': 'Competitive Examination',
        'about': {
          '@type': 'Thing',
          'name': topicItem.subject
        }
      }
    ]
  }

  return (
    <div className={styles.pageWrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Breadcrumbs */}
      <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
        <div className={styles.container}>
          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
            </li>
            <li className={styles.breadcrumbItem}>
              <Link href="/mpsc-pyq" className={styles.breadcrumbLink}>MPSC Papers</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
            </li>
            <li className={styles.breadcrumbItem}>
              <Link href="/mpsc/pyq-analysis" className={styles.breadcrumbLink}>PYQ Analytics</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
            </li>
            <li className={styles.breadcrumbItem}>
              <span className={styles.breadcrumbActive}>{topicItem.topic}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* 2. Hero Header */}
      <header className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.rankBadgeTop}>
              🔥 Rank #{rank || 1} High-Frequency Concept
            </span>
            <span className={styles.subjectBadgeTop}>
              {topicItem.subject}
            </span>
            <span className={styles.verifiedBadgeTop}>
              <span className="material-symbols-outlined">verified</span>
              100% Official MPSC Record
            </span>
          </div>

          <h1 className={styles.mainTitle}>
            {topicItem.topic} — MPSC Previous Year Questions &amp; Analysis
          </h1>

          <div className={styles.subtitleMr}>
            वारंवार विचारला जाणारा घटक • एकूण विचारलेले प्रश्न: {topicItem.total_occurrences}
          </div>

          <p className={styles.heroDescription}>
            Empirical question bank analysis for &ldquo;{topicItem.topic}&rdquo; under {topicItem.subject}.
            Explore verified questions asked across official MPSC examinations, check the official final answer keys, and read comprehensive explanations.
          </p>

          {/* Metric Cards Ribbon */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Questions</span>
              <span className={styles.metricVal}>{topicItem.total_occurrences} Qs</span>
              <span className={styles.metricSub}>Asked in MPSC exams</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Exam Years Asked</span>
              <span className={styles.metricVal}>
                {(topicItem.years_asked || []).length} Years
              </span>
              <span className={styles.metricSub}>
                {(topicItem.years_asked || []).join(', ') || 'Recent cycles'}
              </span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Maharashtra Focus</span>
              <span className={styles.metricVal}>
                {topicItem.maharashtra_focus || 0} Qs
              </span>
              <span className={styles.metricSub}>State-specific context</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Subject Weightage</span>
              <span className={styles.metricVal}>{topicItem.subject}</span>
              <span className={styles.metricSub}>Priority syllabus unit</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Interactive Question Explorer & Actions */}
      <main className={styles.container}>
        <ConceptQuestionsClient
          topicItem={topicItem}
          relatedTopics={relatedTopics}
        />
      </main>
    </div>
  )
}

