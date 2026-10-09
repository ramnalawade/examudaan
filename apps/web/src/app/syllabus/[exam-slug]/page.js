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

// ISR cache for fast page delivery
export const revalidate = 86400

// Dynamic metadata per exam — must await params in Next.js 15+
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const exam = getExamBySlug(resolvedParams['exam-slug'])
  if (!exam) return {}
  const canonicalUrl = `https://examudaan.in/syllabus/${exam.slug}`
  return {
    title: `${exam.shortName || exam.nameEn} Syllabus 2026`,
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

  // Question Paper & Verified PDF details
  const verifiedPdfs = exam.officialPdfs || []
  const hasOfficialPdfs = verifiedPdfs.length > 0
  const pyqLinksList = exam.pyqLinks || []
  const hasPyqLinks = pyqLinksList.length > 0
  const hasDirectPdf = hasOfficialPdfs && !!verifiedPdfs[0]?.url
  const primaryPdfUrl = hasDirectPdf
    ? verifiedPdfs[0].url
    : (hasPyqLinks ? (pyqLinksList[0].paperUrl || pyqLinksList[0].url) : (exam.slug.startsWith('mpsc-') ? '/mpsc-pyq' : '/question-papers'))

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

                {/* Question Paper (PDF) Highlight Card — Clickable, opens question paper in PDF format */}
                {(hasOfficialPdfs || hasPyqLinks) && (
                  <a
                    href={hasDirectPdf ? primaryPdfUrl : '#pyq'}
                    target={hasDirectPdf ? "_blank" : undefined}
                    rel={hasDirectPdf ? "noopener noreferrer" : undefined}
                    className={`${styles.keyStat} ${styles.keyStatClickable}`}
                    title={hasDirectPdf ? `Open verified ${exam.shortName} Question Paper in PDF format` : "View verified previous year question papers"}
                  >
                    <span className="material-symbols-outlined" style={{ color: '#22c55e' }}>picture_as_pdf</span>
                    <div>
                      <strong>Question Paper (PDF)</strong>
                      <span style={{ color: '#86efac', fontWeight: 600 }}>
                        {hasDirectPdf ? `${verifiedPdfs.length} Verified PDFs ↗` : `${pyqLinksList.length} Papers Available ↓`}
                      </span>
                    </div>
                  </a>
                )}
              </div>

              {/* Posts — each chip is a clickable link to related job listings */}
              <div className={styles.postsList}>
                <strong>Target Posts:</strong>
                <div className={styles.postsRow}>
                  {exam.targetPosts.map(p => (
                    <a
                      key={p}
                      href={`/jobs?q=${encodeURIComponent(p)}`}
                      className={styles.postChip}
                      title={`View ${p} job notifications`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              </div>

              <div className={styles.heroButtons}>
                {/* Question Paper in PDF format direct action */}
                {(hasOfficialPdfs || hasPyqLinks) && (
                  <a
                    href={hasDirectPdf ? primaryPdfUrl : '#pyq'}
                    target={hasDirectPdf ? "_blank" : undefined}
                    rel={hasDirectPdf ? "noopener noreferrer" : undefined}
                    className={styles.heroOfficialBtn}
                    style={{ background: '#16a34a', borderColor: '#15803d', color: '#fff' }}
                    title={`Open authentic ${exam.shortName || exam.nameEn} question paper in PDF format`}
                  >
                    <span className="material-symbols-outlined">description</span>
                    Question Paper (PDF) {hasDirectPdf ? '↗' : '↓'}
                  </a>
                )}

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

      {/* ── Official Question Papers & Official Answer Keys ── */}
      {(hasOfficialPdfs || hasPyqLinks) && (
        <section className={styles.pyqSection} id="pyq">
          <div className="container">
            <div className={styles.pyqHeaderRow}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span className="material-symbols-outlined">history_edu</span>
                  Previous Year Question Papers & Official Answer Keys ({hasOfficialPdfs ? verifiedPdfs.length : pyqLinksList.length} Verified {hasOfficialPdfs ? 'Files' : 'Cycles'})
                </h2>
                <p className={styles.pyqSubtitle}>
                  Read and download authentic question papers and official answer keys directly from {exam.conductingBody}.
                </p>
              </div>
              <span className={styles.pyqCountBadge}>
                {hasOfficialPdfs ? `${verifiedPdfs.length} Verified Files` : `${pyqLinksList.length} Exam Cycles`}
              </span>
            </div>

            {hasOfficialPdfs ? (
              /* Embedded Official In-Browser PDF Document Viewer & Directory Workspace */
              <OfficialPdfViewer
                papers={verifiedPdfs}
                conductingBody={exam.conductingBody}
                officialWebsite={exam.officialWebsite}
                examName={exam.nameEn}
              />
            ) : (
              /* Verified PYQ Cards List for exams with official external/portal question papers */
              <div className={styles.pyqList}>
                {pyqLinksList.map((p, idx) => (
                  <div key={idx} className={styles.pyqCardItem}>
                    <div className={styles.pyqYearCol} style={{ background: 'rgba(234, 88, 12, 0.08)', color: 'var(--primary, #ea580c)' }}>
                      <span className={styles.pyqYearText}>{p.year}</span>
                      <span className={styles.pyqYearBadge}>{p.exam || 'Paper'}</span>
                    </div>
                    <div className={styles.pyqInfoCol}>
                      <h3 className={styles.pyqPaperTitle}>{p.label}</h3>
                      <p className={styles.pyqExamMeta}>
                        <span className="material-symbols-outlined">account_balance</span>
                        <span>{exam.conductingBody}</span>
                        <span>•</span>
                        <span>Official Question Paper & Solution</span>
                      </p>
                    </div>
                    <div className={styles.pyqActions}>
                      {p.paperUrl && (
                        <a
                          href={p.paperUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.pyqPaperBtn}
                          title={`Open ${p.year} official question paper in PDF format`}
                        >
                          <span className="material-symbols-outlined">picture_as_pdf</span>
                          <span>Question Paper (PDF)</span>
                          <span className="material-symbols-outlined">open_in_new</span>
                        </a>
                      )}
                      {p.answerKeyUrl && p.answerKeyUrl !== p.paperUrl && (
                        <a
                          href={p.answerKeyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.pyqAnswerBtn}
                          title={`Open ${p.year} official answer key`}
                        >
                          <span className="material-symbols-outlined">task_alt</span>
                          <span>Official Key</span>
                          <span className="material-symbols-outlined">open_in_new</span>
                        </a>
                      )}
                      <Link
                        href={`/pyq?q=${encodeURIComponent(exam.shortName || exam.nameEn)}`}
                        className={styles.pyqPaperBtn}
                        style={{ background: '#FFF7ED', borderColor: '#FED7AA', color: '#EA580C' }}
                        title="Practice topic questions in 15-Year PYQ Bank"
                      >
                        <span className="material-symbols-outlined" style={{ color: '#EA580C' }}>quiz</span>
                        <span>15-Yr Bank Practice</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {exam.slug.startsWith('mpsc-') && (
              <div style={{ marginTop: '16px', padding: '14px 18px', background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong style={{ color: '#9A3412', fontSize: '14px' }}>🏛️ संपूर्ण MPSC २०२१–२०२६ अधिकृत संग्रह (841 Papers & Keys)</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#7C2D12' }}>सर्व राज्यसेवा, संयुक्त गट ब व क, वनसेवा आणि चाळणी परीक्षा प्रश्नपत्रिका व उत्तरतालिका थेट ब्राऊझरमध्ये उपलब्ध.</p>
                </div>
                <Link href="/mpsc-pyq" style={{ background: '#EA580C', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 6px rgba(234,88,12,0.2)' }}>
                  संपूर्ण MPSC संग्रह उघडा (841 Papers) →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

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

      {/* ── Next Steps: Practice & Test Hub ── */}
      <section style={{ padding: '36px 0', background: '#FFFFFF', borderTop: '1px solid var(--outline-variant)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              From Syllabus to Selection
            </span>
            <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '4px 0 6px' }}>
              अभ्यासक्रमानंतर सराव करा (Practice Next Steps)
            </h2>
            <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
              {exam.shortName || exam.nameEn} च्या संपूर्ण तयारीसाठी खालील अधिकृत टूल्स वापरा:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <Link
              href="/mpsc-pyq"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #FED7AA',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(234,88,12,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '22px' }}>📄</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#FFF7ED', color: '#EA580C', border: '1px solid #FED7AA', padding: '2px 7px', borderRadius: '999px' }}>
                    841 Papers
                  </span>
                </div>
                <strong style={{ fontSize: '15px', color: '#0F172A', fontFamily: 'var(--font-outfit)', display: 'block', marginBottom: '4px' }}>
                  MPSC मूळ प्रश्नपत्रिका व की
                </strong>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                  २०२१ ते २०२६ चे सर्व ४२९ अधिकृत संच थेट ब्राऊझरमध्ये वाचा व डाऊनलोड करा.
                </p>
              </div>
              <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#EA580C' }}>
                प्रश्नपत्रिका उघडा →
              </span>
            </Link>

            <Link
              href="/mock-tests"
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--outline-variant)',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '22px' }}>⏱️</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '2px 7px', borderRadius: '999px' }}>
                    100% Free
                  </span>
                </div>
                <strong style={{ fontSize: '15px', color: '#0F172A', fontFamily: 'var(--font-outfit)', display: 'block', marginBottom: '4px' }}>
                  मोफत ऑनलाईन मॉक टेस्ट्स
                </strong>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                  १०० प्रश्नांचे संपूर्ण मॉक पेपर्स व विषयवार स्पीड ड्रिल्स — राज्यस्तरीय रँकसह.
                </p>
              </div>
              <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#047857' }}>
                मॉक टेस्ट द्या →
              </span>
            </Link>

            <Link
              href="/pyq"
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--outline-variant)',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '22px' }}>🎯</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE', padding: '2px 7px', borderRadius: '999px' }}>
                    9,000+ MCQs
                  </span>
                </div>
                <strong style={{ fontSize: '15px', color: '#0F172A', fontFamily: 'var(--font-outfit)', display: 'block', marginBottom: '4px' }}>
                  15-Year Topic PYQ Bank
                </strong>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                  अभ्यासक्रमातील घटकनिहाय प्रश्न सोडवा — राज्यव्यवस्था, भूगोल, विज्ञान व इतिहास.
                </p>
              </div>
              <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#6D28D9' }}>
                विषयवार प्रश्न सोडवा →
              </span>
            </Link>

            <Link
              href="/cutoffs"
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--outline-variant)',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '22px' }}>📊</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '2px 7px', borderRadius: '999px' }}>
                    10-Yr Benchmark
                  </span>
                </div>
                <strong style={{ fontSize: '15px', color: '#0F172A', fontFamily: 'var(--font-outfit)', display: 'block', marginBottom: '4px' }}>
                  १०-वर्षीय कट-ऑफ विश्लेषण
                </strong>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                  Open, OBC, EWS, SC, ST प्रवर्गांचे मागील १० वर्षांचे अधिकृत बेंचमार्क गुण.
                </p>
              </div>
              <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#1D4ED8' }}>
                कट-ऑफ तपासा →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
