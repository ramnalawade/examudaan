// ============================================================
// app/syllabus/[exam-slug]/page.js — Per-exam syllabus detail
// Shows full topic breakdown, paper structure, PYQ links, books
// ============================================================
import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getExamBySlug, ALL_EXAM_SLUGS, SYLLABUS_EXAMS } from '@/lib/syllabusData'
import InteractiveSyllabusTracker from '@/components/InteractiveSyllabusTracker'
import OfficialPdfViewer from '@/components/OfficialPdfViewer'
import styles from './examDetail.module.css'

// Static params for Next.js build
export async function generateStaticParams() {
  return ALL_EXAM_SLUGS.map(slug => ({ 'exam-slug': slug }))
}

// Dynamic metadata per exam — must await params in Next.js 15+
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const exam = getExamBySlug(resolvedParams['exam-slug'])
  if (!exam) return {}
  const canonicalUrl = `https://examudaan.in/syllabus/${exam.slug}`
  return {
    title: `${exam.nameEn} Syllabus 2026 — Complete Topic-wise Guide | ExamUdaan`,
    description: `Full ${exam.nameEn} syllabus 2026 with paper-wise topics, previous year question papers, recommended books, and exam pattern. Free for all aspirants.`,
    keywords: `${exam.nameEn} syllabus 2026, ${exam.shortName} exam pattern, ${exam.shortName} PYQ papers`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${exam.nameEn} Syllabus 2026 | ExamUdaan`,
      description: `Full ${exam.nameEn} syllabus with topic breakdown and paper pattern.`,
      url: canonicalUrl,
      type: 'article',
      siteName: 'ExamUdaan.in',
    },
  }
}

export default function ExamDetailPage({ params }) {
  // Next.js 15+: params is a Promise — unwrap with React.use()
  const resolvedParams = use(params)
  const exam = getExamBySlug(resolvedParams['exam-slug'])
  if (!exam) notFound()

  // Related exams (exclude self)
  const related = SYLLABUS_EXAMS.filter(e =>
    exam.relatedExams.includes(e.slug)
  )

  return (
    <main className={styles.detailPage}>
      {/* ── Hero with Integrated Breadcrumb ── */}
      <section className={styles.hero} style={{ '--exam-color': exam.color }}>
        <div className="container">
          {/* Integrated Breadcrumb */}
          <nav className={styles.heroBreadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={`material-symbols-outlined ${styles.breadcrumbSep}`}>chevron_right</span>
            <Link href="/syllabus">Syllabus</Link>
            <span className={`material-symbols-outlined ${styles.breadcrumbSep}`}>chevron_right</span>
            <span className={styles.breadcrumbCurrent}>{exam.shortName}</span>
          </nav>

          <div className={styles.heroInner}>
            <div className={styles.heroLeft}>
              <span className={styles.examLevelBadge} data-level={exam.examLevel}>{exam.examLevel} Government</span>
              <h1>{exam.nameEn}</h1>
              <p className={styles.conductingBody}>Conducted by: <strong>{exam.conductingBody}</strong></p>

              {/* Key Stats */}
              <div className={styles.keyStats}>
                <div className={styles.keyStat}>
                  <span className="material-symbols-outlined">badge</span>
                  <div>
                    <strong>Vacancies</strong>
                    <span>{exam.totalVacancies}</span>
                  </div>
                </div>
                <div className={styles.keyStat}>
                  <span className="material-symbols-outlined">school</span>
                  <div>
                    <strong>Eligibility</strong>
                    <span>{exam.eligibility}</span>
                  </div>
                </div>
                <div className={styles.keyStat}>
                  <span className="material-symbols-outlined">cake</span>
                  <div>
                    <strong>Age Limit</strong>
                    <span>{exam.ageLimit.min}–{exam.ageLimit.max} yrs</span>
                  </div>
                </div>
                <div className={styles.keyStat}>
                  <span className="material-symbols-outlined">payments</span>
                  <div>
                    <strong>Application Fee</strong>
                    <span>General: {exam.applicationFee.general} | Reserved: {exam.applicationFee.reserved}</span>
                  </div>
                </div>
              </div>

              {/* Posts */}
              <div className={styles.postsList}>
                <strong>Target Posts:</strong>
                <div className={styles.postsRow}>
                  {exam.targetPosts.map(p => (
                    <span key={p} className={styles.postChip}>{p}</span>
                  ))}
                </div>
              </div>

              <div className={styles.heroButtons}>
                <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer" className={styles.heroOfficialBtn}>
                  <span className="material-symbols-outlined">launch</span>
                  Official Website
                </a>
                {exam.notificationUrl && exam.notificationUrl !== exam.officialWebsite && (
                  <a href={exam.notificationUrl} target="_blank" rel="noopener noreferrer" className={styles.heroOfficialBtn} style={{ background: '#2563EB', borderColor: '#1D4ED8', color: '#fff' }}>
                    <span className="material-symbols-outlined">notifications_active</span>
                    Recruitment Portal
                  </a>
                )}
                <Link href="/mock-tests" className={styles.heroMockBtn}>
                  <span className="material-symbols-outlined">quiz</span>
                  Practice Mock Test →
                </Link>
              </div>
            </div>

            {/* Selection Process Timeline */}
            <div className={styles.heroRight}>
              <div className={styles.stagesCard}>
                <div className={styles.stagesHeader}>
                  <span className="material-symbols-outlined">route</span>
                  <h3>Selection Process</h3>
                </div>
                <div className={styles.stagesList}>
                  {exam.stages.map((stage, i) => (
                    <div key={stage} className={styles.stageItem}>
                      <div className={styles.stageIndicator}>
                        <span className={styles.stageBadge}>{i + 1}</span>
                        {i < exam.stages.length - 1 && <span className={styles.stageConnector} />}
                      </div>
                      <div className={styles.stageContent}>
                        <span className={styles.stageStageLabel}>Stage {i + 1}</span>
                        <h4 className={styles.stageTitle}>{stage}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Syllabus Tracker & Topic Checklist ── */}
      <section className={styles.syllabusSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            <span className="material-symbols-outlined">menu_book</span>
            Exam Syllabus & Interactive Checklist
          </h2>

          <InteractiveSyllabusTracker exam={exam} />
        </div>
      </section>

      {/* ── PYQ Links ── */}
      <section className={styles.pyqSection}>
        <div className="container">
          <div className={styles.pyqHeaderRow}>
            <div>
              <h2 className={styles.sectionTitle}>
                <span className="material-symbols-outlined">history_edu</span>
                Previous Year Question Papers & Official Answer Keys (5+ Years)
              </h2>
              <p className={styles.pyqSubtitle}>
                Read and download authentic question papers and official answer keys directly from {exam.conductingBody}.
              </p>
            </div>
            <span className={styles.pyqCountBadge}>{exam.pyqLinks.length} Sets Available</span>
          </div>

          {/* Embedded Official In-Browser PDF Document Viewer & Directory Workspace */}
          {exam.officialPdfs && exam.officialPdfs.length > 0 ? (
            <>
              <OfficialPdfViewer
                papers={exam.officialPdfs}
                conductingBody={exam.conductingBody}
                officialWebsite={exam.officialWebsite}
                examName={exam.nameEn}
              />
              {exam.slug.startsWith('mpsc-') && (
                <div style={{ marginTop: '16px', padding: '14px 18px', background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <strong style={{ color: '#9A3412', fontSize: '14px' }}>🏛️ संपूर्ण MPSC २०२४–२०२६ अधिकृत संग्रह (209 PDFs)</strong>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#7C2D12' }}>सर्व राज्यसेवा, संयुक्त गट ब व क, नगर रचनाकार आणि चाळणी परीक्षा प्रश्नपत्रिका व उत्तरतालिका उपलब्ध आहेत.</p>
                  </div>
                  <Link href="/mpsc-pyq" style={{ background: '#EA580C', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                    संपूर्ण MPSC संग्रह उघडा (209) →
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className={styles.pyqList}>
              {exam.pyqLinks.map((link, i) => (
                <div key={i} className={styles.pyqCardItem}>
                  <div className={styles.pyqYearCol} style={{ backgroundColor: `${exam.color}15`, color: exam.color }}>
                    <span className={styles.pyqYearText}>{link.year}</span>
                    <span className={styles.pyqYearBadge}>Q & A</span>
                  </div>
                  <div className={styles.pyqInfoCol}>
                    <h3 className={styles.pyqPaperTitle}>{link.label}</h3>
                    <p className={styles.pyqExamMeta}>
                      <span className="material-symbols-outlined">fact_check</span>
                      {link.exam} • Official {exam.conductingBody}
                    </p>
                  </div>
                  <div className={styles.pyqActions}>
                    <a
                      href={link.paperUrl || link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.pyqPaperBtn}
                      title="Download / View Question Paper"
                    >
                      <span className="material-symbols-outlined">description</span>
                      Question Paper
                      <span className="material-symbols-outlined">open_in_new</span>
                    </a>
                    {link.answerKeyUrl && (
                      <a
                        href={link.answerKeyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.pyqAnswerBtn}
                        title="Download / View Official Answer Key"
                      >
                        <span className="material-symbols-outlined">task_alt</span>
                        Answer Key / Answers
                        <span className="material-symbols-outlined">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Books ── */}
      <section className={styles.booksSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            <span className="material-symbols-outlined">auto_stories</span>
            Recommended Books
          </h2>
          <div className={styles.booksGrid}>
            {exam.books.map((book, i) => (
              <div key={i} className={styles.bookCard}>
                <span className={styles.bookNum}>{i + 1}</span>
                <div>
                  <strong>{book.title}</strong>
                  <span>Use for: {book.useFor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Exams ── */}
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              <span className="material-symbols-outlined">link</span>
              Related Exams
            </h2>
            <div className={styles.relatedGrid}>
              {related.map(rel => (
                <Link key={rel.slug} href={`/syllabus/${rel.slug}`} className={styles.relatedCard}>
                  <span className={`material-symbols-outlined`} style={{ color: rel.color }}>{rel.logo}</span>
                  <div>
                    <strong>{rel.nameEn}</strong>
                    <span>{rel.conductingBody}</span>
                  </div>
                  <span className={styles.relatedArrow}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
