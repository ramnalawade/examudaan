// ============================================================================
// app/career/[slug]/page.js — Dedicated Standalone Career Dossier Page (SSG)
// ExamUdaan.in — Deep Educational Guidance for 10th & 12th Students
// Complete Syllabus Portion, Live Exam Cycles, Salary Ladders, Top Colleges & SEO
// ============================================================================

import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from '../careerDetail.module.css'
import { CAREER_PATHS, STREAMS, getCareerBySlug, getAllCareerSlugs } from '@/lib/careerGuideData'
import PrintButton from './PrintButton'

// Statically pre-render all 40 career paths at build time
export async function generateStaticParams() {
  return getAllCareerSlugs().map(slug => ({
    slug
  }))
}

// Dynamic SEO metadata with rich descriptions
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const career = getCareerBySlug(resolvedParams?.slug)

  if (!career) {
    return {
      title: 'Career Dossier Not Found | ExamUdaan.in',
      description: 'The requested career guidance dossier could not be found.'
    }
  }

  const streamMeta = STREAMS.find(s => s.id === career.streamId)
  const examNames = career.entranceExams.map(e => e.name).join(', ')

  return {
    title: `${career.title} — Career Roadmap, Syllabus, Exam Dates, Salary & Colleges 2026 | ExamUdaan`,
    description: `Complete career guide for ${career.title} after 10th & 12th ${streamMeta?.shortName || ''}. Eligibility: ${career.min12thStream}. Key entrance exams: ${examNames}. Syllabus portion, realistic salary ladder, top colleges in Maharashtra & India.`,
    keywords: [
      career.title,
      career.role,
      `${streamMeta?.shortName} career options`,
      'career after 12th science',
      'career after 12th commerce',
      'career after 12th arts',
      ...career.entranceExams.map(e => e.name),
      'exam syllabus and pattern',
      'examudaan career guide'
    ].join(', '),
    alternates: {
      canonical: `https://examudaan.in/career/${career.id}`
    },
    openGraph: {
      title: `${career.title} — Career Roadmap & Exam Guide 2026`,
      description: `In-depth educational roadmap, entrance exams (${examNames}), salary ladder, and future AI demand for ${career.title}.`,
      url: `https://examudaan.in/career/${career.id}`,
      siteName: 'ExamUdaan.in',
      type: 'article',
      locale: 'en_IN'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${career.title} — Career Roadmap & Exam Guide 2026`,
      description: `In-depth roadmap, syllabus portion, exam dates & salary ladder for ${career.title}.`
    }
  }
}

export default async function CareerDetailPage({ params }) {
  const resolvedParams = await params
  const career = getCareerBySlug(resolvedParams?.slug)

  if (!career) {
    notFound()
  }

  const streamMeta = STREAMS.find(s => s.id === career.streamId)
  const relatedCareers = CAREER_PATHS
    .filter(c => c.streamId === career.streamId && c.id !== career.id)
    .slice(0, 4)

  // JSON-LD Structured Data
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://examudaan.in'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Career Decision Compass',
        item: 'https://examudaan.in/career'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: career.title,
        item: `https://examudaan.in/career/${career.id}`
      }
    ]
  }

  const jsonLdOccupational = {
    '@context': 'https://schema.org',
    '@type': 'OccupationalExperienceRequirements',
    name: career.title,
    description: career.scopeAndFuture?.summary || career.role,
    occupationalCategory: career.categoryId,
    estimatedSalary: [
      {
        '@type': 'MonetaryAmountDistribution',
        name: 'Entry Fresher Package',
        currency: 'INR',
        description: career.salaryLadder?.entry
      },
      {
        '@type': 'MonetaryAmountDistribution',
        name: 'Senior Leadership Package',
        currency: 'INR',
        description: career.salaryLadder?.senior
      }
    ]
  }

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the eligibility requirement for ${career.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The minimum eligibility requirement is: ${career.min12thStream}. Crucial subjects to score well in include: ${career.keySubjectsToScore.map(s => `${s.subject} (${s.minScore})`).join(', ')}.`
        }
      },
      {
        '@type': 'Question',
        name: `Which entrance exams are required for ${career.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Key entrance examinations include: ${career.entranceExams.map(e => `${e.name} (${e.body} - ${e.level})`).join(', ')}. The typical application & examination cycle is: ${career.examDatesAndCycles || 'Annual national/state cycles'}.`
        }
      },
      {
        '@type': 'Question',
        name: `What is the realistic salary progression for ${career.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Entry-level salary starts at ${career.salaryLadder?.entry}. Mid-career professionals (3-7 years) earn ${career.salaryLadder?.mid}, while senior leaders and partners earn ${career.salaryLadder?.senior}. Highest-paying sectors include: ${career.salaryLadder?.highestPaying}.`
        }
      }
    ]
  }

  const whatsappShareText = encodeURIComponent(
    `Check out the complete Career Roadmap, Syllabus Portion & Exam Dates for *${career.title}* on ExamUdaan:\nhttps://examudaan.in/career/${career.id}`
  )

  return (
    <div className={styles.page}>
      {/* Structured Data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOccupational) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* ── Breadcrumb ── */}
      <div className="container" style={{ paddingTop: '16px' }}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/career">Career Decision Guide</Link>
          <span>/</span>
          <span>{career.title}</span>
        </nav>
      </div>

      {/* ── Detail Hero Banner ── */}
      <section className={styles.detailHero}>
        <div className="container">
          <div className={styles.heroTopRow}>
            <span className={styles.streamBadge}>
              {streamMeta?.icon} {streamMeta?.name}
            </span>
            <Link
              href="/career"
              style={{ fontSize: '13px', color: '#ea580c', fontWeight: 700, textDecoration: 'none' }}
            >
              ← Back to All Career Options
            </Link>
          </div>

          <h1 className={styles.detailTitle}>{career.title}</h1>
          <p className={styles.detailRole}>
            <strong>Target Industry Roles:</strong> {career.role}
          </p>

          {/* Quick Highlight Cards */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#ea580c' }}>verified</span>
                Eligibility
              </span>
              <span className={styles.statValue} style={{ fontSize: '14px', lineHeight: 1.4 }}>
                {career.min12thStream}
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#059669' }}>payments</span>
                Fresher Salary Range
              </span>
              <span className={styles.statValue} style={{ color: '#059669' }}>
                {career.salaryLadder?.entry?.split('(')[0]}
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#7c3aed' }}>psychology</span>
                Future Scope Rating
              </span>
              <span className={styles.statValue} style={{ color: '#6d28d9', fontSize: '14px' }}>
                {career.scopeAndFuture?.rating}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className={styles.actionRow}>
            <a
              href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnAction}
              style={{ background: '#25D366', color: '#fff', borderColor: '#25D366' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
              Share on WhatsApp
            </a>

            <PrintButton />

            <Link
              href={career.govtExamSynergy?.examUdaanLink || '/jobs'}
              className={styles.btnAction}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>work</span>
              Browse Sarkari Jobs in This Field →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <div className="container">
        <div className={styles.layoutGrid}>
          {/* Main Left Column */}
          <main>
            {/* 1. Crucial 10th & 12th Subjects */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={`material-symbols-outlined ${styles.sectionIcon}`}>grade</span>
                <h2>1. Key 10th & 12th Subjects You Must Score In</h2>
              </div>
              <p style={{ fontSize: '14px', color: '#57534e', margin: '0 0 16px', lineHeight: 1.5 }}>
                To secure admission into top-tier government and premier private institutions, maintaining high percentile cutoffs in these specific foundational subjects is mandatory:
              </p>
              <div className={styles.subjectList}>
                {career.keySubjectsToScore.map((sub, idx) => (
                  <div key={idx} className={styles.subjectCard}>
                    <div>
                      <div className={styles.subjectTitle}>{sub.subject}</div>
                      <div className={styles.subjectReason}>{sub.reason}</div>
                    </div>
                    <span className={styles.subjectScoreBadge}>{sub.minScore}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Entrance Examination Schedule & Official Portals */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={`material-symbols-outlined ${styles.sectionIcon}`}>quiz</span>
                <h2>2. Key Entrance Exams & Live Application Schedule</h2>
              </div>

              {/* Verified Application Cycles Banner */}
              {career.examDatesAndCycles && (
                <div className={styles.calendarBox}>
                  <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#b45309' }}>
                    calendar_month
                  </span>
                  <div className={styles.calendarText}>
                    <strong>Annual Application & Examination Cycle:</strong>
                    {career.examDatesAndCycles}
                  </div>
                </div>
              )}

              <p style={{ fontSize: '14px', color: '#57534e', margin: '0 0 12px' }}>
                Admission is strictly governed through the following national and state-level competitive exams:
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table className={styles.examTable}>
                  <thead>
                    <tr>
                      <th>Exam Name</th>
                      <th>Conducting Body</th>
                      <th>Level / Jurisdiction</th>
                      <th>Official Portal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {career.entranceExams.map((exam, idx) => (
                      <tr key={idx}>
                        <td><strong>{exam.name}</strong></td>
                        <td>{exam.body}</td>
                        <td><span style={{ fontSize: '12px', background: '#f5f5f4', padding: '2px 8px', borderRadius: '4px' }}>{exam.level}</span></td>
                        <td>
                          {exam.website ? (
                            <a
                              href={exam.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#ea580c', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <span>Official Site</span>
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                            </a>
                          ) : (
                            <span style={{ color: '#a8a29e' }}>State Portal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Detailed Syllabus Portion & Exam Pattern */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={`material-symbols-outlined ${styles.sectionIcon}`} style={{ color: '#be185d' }}>
                  menu_book
                </span>
                <h2>3. Syllabus Portion & Exam Pattern Breakdown</h2>
              </div>

              {career.examPatternSummary && (
                <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
                  <strong style={{ fontSize: '13px', color: '#9d174d', display: 'block', textTransform: 'uppercase' }}>
                    Exam Pattern & Marking Scheme:
                  </strong>
                  <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#831843' }}>
                    {career.examPatternSummary}
                  </p>
                </div>
              )}

              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1c1917', margin: '0 0 10px' }}>
                Key Syllabus Topics & Portion Tested:
              </h3>
              <div className={styles.syllabusBox}>
                {career.portionAndSyllabus && career.portionAndSyllabus.map((topic, idx) => (
                  <div key={idx} className={styles.syllabusItem}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#db2777', flexShrink: 0, marginTop: '2px' }}>
                      check_circle
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Step-by-Step Educational Journey */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={`material-symbols-outlined ${styles.sectionIcon}`}>route</span>
                <h2>4. Step-by-Step Educational Journey (10th to Career)</h2>
              </div>
              <div className={styles.roadmapGrid}>
                {career.stepByStepRoadmap.map((step, idx) => (
                  <div key={idx} className={styles.roadmapStep}>
                    <div className={styles.stepNumber}>{idx + 1}</div>
                    <div className={styles.stepContent}>{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Realistic Salary Progression Ladder */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={`material-symbols-outlined ${styles.sectionIcon}`} style={{ color: '#059669' }}>
                  payments
                </span>
                <h2>5. Realistic Salary Progression Ladder (2026 – 2030)</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                    🟢 Entry Fresher (0–2 Yrs)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#065f46', margin: '6px 0' }}>
                    {career.salaryLadder?.entry}
                  </div>
                  <div style={{ fontSize: '12px', color: '#047857' }}>Campus hiring / Starting package</div>
                </div>

                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                    🟡 Mid-Level (3–7 Yrs)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e40af', margin: '6px 0' }}>
                    {career.salaryLadder?.mid}
                  </div>
                  <div style={{ fontSize: '12px', color: '#1d4ed8' }}>Experienced practitioner</div>
                </div>

                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#b91c1c', textTransform: 'uppercase' }}>
                    🔴 Senior Leadership (8+ Yrs)
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#991b1b', margin: '6px 0' }}>
                    {career.salaryLadder?.senior}
                  </div>
                  <div style={{ fontSize: '12px', color: '#b91c1c' }}>Partners / Chief Specialists</div>
                </div>
              </div>

              <div style={{ background: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '10px', padding: '12px 16px', fontSize: '13.5px', color: '#57534e' }}>
                <strong style={{ color: '#1c1917' }}>Highest Paying Niches: </strong>
                {career.salaryLadder?.highestPaying}
              </div>
            </div>

            {/* 6. Future Scope & AI Impact */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={`material-symbols-outlined ${styles.sectionIcon}`} style={{ color: '#7c3aed' }}>
                  psychology
                </span>
                <h2>6. Future Scope, Market Demand & AI Impact</h2>
              </div>
              <p style={{ fontSize: '14.5px', color: '#292524', lineHeight: 1.6, margin: '0 0 16px' }}>
                {career.scopeAndFuture?.summary}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '10px', padding: '14px' }}>
                  <strong style={{ fontSize: '12px', color: '#6d28d9', textTransform: 'uppercase' }}>
                    AI Automation Impact:
                  </strong>
                  <p style={{ margin: '6px 0 0', fontSize: '13.5px', color: '#4c1d95', fontWeight: 600 }}>
                    {career.scopeAndFuture?.aiImpact}
                  </p>
                </div>

                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '14px' }}>
                  <strong style={{ fontSize: '12px', color: '#047857', textTransform: 'uppercase' }}>
                    High-Growth Sectors:
                  </strong>
                  <p style={{ margin: '6px 0 0', fontSize: '13.5px', color: '#065f46' }}>
                    {career.scopeAndFuture?.growthSectors?.join(' • ')}
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Tech Stack, Tools & Essential Skills */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={`material-symbols-outlined ${styles.sectionIcon}`} style={{ color: '#d97706' }}>
                  terminal
                </span>
                <h2>7. Essential Tech Stack, Software & Core Skills</h2>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#44403c', lineHeight: 1.7 }}>
                {career.techStackAndSkills.map((skill, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* 8. Top Colleges in Maharashtra & India */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={`material-symbols-outlined ${styles.sectionIcon}`} style={{ color: '#0284c7' }}>
                  school
                </span>
                <h2>8. Top Colleges & Universities</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {career.topColleges.map((col, idx) => (
                  <div key={idx} style={{ background: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '10px', padding: '12px 16px' }}>
                    <strong style={{ fontSize: '14px', color: '#1c1917', display: 'block' }}>{col.name}</strong>
                    <span style={{ fontSize: '12.5px', color: '#78716c' }}>{col.location} • {col.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 9. Official Portals & Direct Links */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <span className={`material-symbols-outlined ${styles.sectionIcon}`} style={{ color: '#059669' }}>
                  link
                </span>
                <h2>9. Official External Portals to Explore (Verified Sources)</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {career.externalWebsites.map((site, idx) => (
                  <a
                    key={idx}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#fff',
                      border: '1px solid #fed7aa',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ea580c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{site.title}</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#78716c' }}>{site.note}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Career Guidance Advisory & Due Diligence Box with * Conditions ── */}
            <div className={styles.advisoryBox} aria-label="Career Guidance Advisory">
              <div className={styles.advisoryHeader}>
                <span className="material-symbols-outlined" style={{ color: '#ea580c', fontSize: '24px' }}>gavel</span>
                <h3>* Career Guidance Advisory & Mandatory Due Diligence</h3>
              </div>
              <p className={styles.advisoryText}>
                Before taking any irreversible admission, stream, or coaching decision for <strong>{career.title}</strong>, please note:
              </p>
              <ul className={styles.advisoryList}>
                <li>
                  <strong>* Condition 1 (AI-Synthesized Data):</strong> The syllabus details, entrance exam analysis, college cutoff benchmarks, and salary tiers for {career.title} are compiled using AI models from public university guidelines, past exam notifications, and employer surveys.
                </li>
                <li>
                  <strong>* Condition 2 (Compensation Variances):</strong> The salary ladders shown above (Entry: {career.salaryLadder?.entry?.split('(')[0]?.trim()}, Peak: {career.salaryLadder?.peak?.split('(')[0]?.trim()}) are statistical industry approximations and do not constitute a guaranteed wage or placement offer.
                </li>
                <li>
                  <strong>* Condition 3 (Mandatory Verification with Statutory Bodies):</strong> Academic regulations, eligibility criteria ({career.min12thStream}), entrance test formats, and college affiliation statuses are regulated exclusively by statutory authorities (UGC, AICTE, NMC, BCI) and individual institutions. Candidates must independently cross-verify all details directly from official institution prospectuses before enrolling.
                </li>
              </ul>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside>
            {/* Sarkari Synergy Widget */}
            <div className={styles.sidebarWidget} style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', borderColor: '#fdba74' }}>
              <div className={styles.sidebarTitle} style={{ color: '#9a3412' }}>
                <span className="material-symbols-outlined" style={{ color: '#ea580c' }}>account_balance</span>
                Govt Job Opportunities
              </div>
              <p style={{ fontSize: '13.5px', color: '#431407', lineHeight: 1.5, margin: '0 0 14px' }}>
                {career.govtExamSynergy?.jobs}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link
                  href={career.govtExamSynergy?.examUdaanLink || '/jobs'}
                  className="btn-primary"
                  style={{ textAlign: 'center', fontSize: '13px', padding: '8px 12px' }}
                >
                  Search Jobs in This Field →
                </Link>
                <Link
                  href={career.govtExamSynergy?.mockTestLink || '/mock-tests'}
                  className="btn-outline"
                  style={{ textAlign: 'center', fontSize: '13px', padding: '8px 12px', background: '#fff' }}
                >
                  Free Practice Mock Tests
                </Link>
              </div>
            </div>

            {/* Quick Stream Navigation */}
            <div className={styles.sidebarWidget}>
              <div className={styles.sidebarTitle}>
                <span className="material-symbols-outlined" style={{ color: '#ea580c' }}>explore</span>
                Browse Other Streams
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {STREAMS.map(st => (
                  <Link
                    key={st.id}
                    href="/career"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: st.id === career.streamId ? '#fff7ed' : '#fafaf9',
                      border: `1px solid ${st.id === career.streamId ? '#fdba74' : '#e7e5e4'}`,
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#1c1917'
                    }}
                  >
                    <span>{st.icon}</span>
                    <span>{st.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Careers in this Stream */}
            <div className={styles.sidebarWidget}>
              <div className={styles.sidebarTitle}>
                <span className="material-symbols-outlined" style={{ color: '#ea580c' }}>hub</span>
                More in {streamMeta?.shortName}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {relatedCareers.map(rel => (
                  <Link
                    key={rel.id}
                    href={`/career/${rel.id}`}
                    style={{
                      background: '#fff',
                      border: '1px solid #e7e5e4',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1c1917', lineHeight: 1.3 }}>
                      {rel.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
                      Entry: {rel.salaryLadder?.entry?.split('(')[0]}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
