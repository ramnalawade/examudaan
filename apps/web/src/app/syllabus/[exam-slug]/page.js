// ============================================================
// app/syllabus/[exam-slug]/page.js — Per-exam syllabus detail
// Shows full topic breakdown, paper structure, PYQ links, books
// ============================================================
import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getExamBySlug, ALL_EXAM_SLUGS, SYLLABUS_EXAMS, getMockTestForExam } from '@/lib/syllabusData'
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

  // Matching mock test for closed learning loop
  const matchedMock = getMockTestForExam(exam.slug)

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
      <section className={styles.hero}>
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
                    <span className={`material-symbols-outlined ${styles.pdfStatIcon}`}>picture_as_pdf</span>
                    <div>
                      <strong>Question Paper (PDF)</strong>
                      <span className={styles.pdfStatBadge}>
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
                    className={`${styles.heroOfficialBtn} ${styles.heroPdfBtn}`}
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
                  <a href={exam.notificationUrl} target="_blank" rel="noopener noreferrer" className={`${styles.heroOfficialBtn} ${styles.heroPortalBtn}`}>
                    <span className="material-symbols-outlined">notifications_active</span>
                    Recruitment Portal
                  </a>
                )}
                <Link href={matchedMock ? `/mock-tests/${matchedMock.slug}` : '/mock-tests'} className={styles.heroMockBtn}>
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

      {/* ── 4-Way Closed Learning Loop Bar ── */}
      <section className={styles.learningLoopSection}>
        <div className="container">
          <div className={styles.learningLoopCard}>
            <div className={styles.learningLoopHeader}>
              <span className="material-symbols-outlined">sync</span>
              <span>4-Way Integrated Learning Loop — {exam.shortName || exam.nameEn}</span>
            </div>
            <div className={styles.learningLoopGrid}>
              {/* 1. Syllabus & Topic Tracker */}
              <a href="#syllabus" className={styles.learningLoopItem}>
                <div className={styles.learningLoopIconBox} data-type="mock">
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <div>
                  <div className={styles.learningLoopTitle}>अभ्यासक्रम व घटक</div>
                  <div className={styles.learningLoopSub}>100% Verified Blueprint</div>
                </div>
              </a>

              {/* 2. Practice Mock Tests */}
              <Link href={matchedMock ? `/mock-tests/${matchedMock.slug}` : '/mock-tests'} className={styles.learningLoopItem}>
                <div className={styles.learningLoopIconBox} data-type="mock">
                  <span className="material-symbols-outlined">quiz</span>
                </div>
                <div>
                  <div className={styles.learningLoopTitle}>{matchedMock ? matchedMock.label : 'ऑनलाईन मॉक टेस्ट'}</div>
                  <div className={styles.learningLoopSub}>100-Q CBT Simulation</div>
                </div>
              </Link>

              {/* 3. PYQ Papers & Solutions */}
              <a href={exam.slug.startsWith('mpsc-') ? '/mpsc-pyq' : '#pyq'} className={styles.learningLoopItem}>
                <div className={styles.learningLoopIconBox} data-type="pyq">
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <div>
                  <div className={styles.learningLoopTitle}>मागील प्रश्नपत्रिका (PYQ)</div>
                  <div className={styles.learningLoopSub}>{hasOfficialPdfs ? `${verifiedPdfs.length} Verified PDFs` : 'Official Question Papers'}</div>
                </div>
              </a>

              {/* 4. Official Answer Keys & Latest Jobs */}
              <Link href={`/jobs?q=${encodeURIComponent(exam.shortName || exam.nameEn)}`} className={styles.learningLoopItem}>
                <div className={styles.learningLoopIconBox} data-type="jobs">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <div>
                  <div className={styles.learningLoopTitle}>चालू भरती जाहिराती</div>
                  <div className={styles.learningLoopSub}>Live Vacancies & Apply Links</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Syllabus Tracker & Topic Checklist ── */}
      <section className={styles.syllabusSection} id="syllabus">
        <div className="container">
          <h2 className={styles.sectionTitle}>
            <span className="material-symbols-outlined">menu_book</span>
            Exam Syllabus & Interactive Checklist
          </h2>

          <InteractiveSyllabusTracker exam={exam} />
        </div>
      </section>

      {/* ── Revised Pattern Blueprint (if available) ── */}
      {exam.revisedPatternNotes && (
        <section className={styles.revisedPatternSection}>
          <div className="container">
            <div className={styles.revisedPatternCard}>
              <div className={styles.revisedPatternHeader}>
                <span className={`material-symbols-outlined ${styles.revisedPatternIcon}`}>verified</span>
                <div>
                  <h3 className={styles.revisedPatternTitle}>
                    सुधारित परीक्षा पद्धती (Revised 9-Paper Descriptive Blueprint)
                  </h3>
                  <p className={styles.revisedPatternSubtitle}>
                    {exam.revisedPatternNotes.patternType}
                  </p>
                </div>
              </div>
              <div className={styles.revisedPatternGrid}>
                <div className={styles.revisedPatternStatBox}>
                  <span className={styles.revisedPatternStatLabel}>एकूण मुख्य पेपर</span>
                  <div className={styles.revisedPatternStatVal}>{exam.revisedPatternNotes.totalPapers} Papers</div>
                </div>
                <div className={styles.revisedPatternStatBox}>
                  <span className={styles.revisedPatternStatLabel}>मुख्य परीक्षा गुण</span>
                  <div className={styles.revisedPatternStatVal}>{exam.revisedPatternNotes.mainsMarks} Marks</div>
                </div>
                <div className={styles.revisedPatternStatBox}>
                  <span className={styles.revisedPatternStatLabel}>मुलाखत गुण</span>
                  <div className={styles.revisedPatternStatVal}>{exam.revisedPatternNotes.interviewMarks} Marks</div>
                </div>
                <div className={styles.revisedPatternStatBoxDanger}>
                  <span className={styles.revisedPatternStatLabel}>अंतिम मेरिट गुण</span>
                  <div className={styles.revisedPatternStatValDanger}>{exam.revisedPatternNotes.grandTotalMarks} Marks</div>
                </div>
              </div>
              <div className={styles.revisedPatternBulletList}>
                <div className={styles.revisedPatternBulletItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span><strong>पात्रता पेपर्स:</strong> {exam.revisedPatternNotes.qualifyingPapers}</span>
                </div>
                <div className={styles.revisedPatternBulletItem}>
                  <span className={styles.bulletDot}>•</span>
                  <span><strong>गुणवत्तेचे पेपर्स:</strong> {exam.revisedPatternNotes.meritPapers}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Optional Subjects Section (if available) ── */}
      {exam.optionalSubjects?.length > 0 && (
        <section className={styles.optionalSubjectsSection}>
          <div className="container">
            <div className={styles.optionalSubjectsHeader}>
              <div>
                <h2 className={styles.optionalSubjectsTitle}>
                  <span className={`material-symbols-outlined ${styles.optionalSubjectsTitleIcon}`}>library_books</span>
                  ऐच्छिक विषयांची यादी — Optional Subjects ({exam.optionalSubjects.length} Disciplines)
                </h2>
                <p className={styles.optionalSubjectsDesc}>
                  मुख्य परीक्षेसाठी उमेदवाराने खालीलपैकी एका ऐच्छिक विषयाची निवड करणे आवश्यक आहे (पेपर ८ व पेपर ९, प्रत्येकी २५० गुण).
                </p>
              </div>
              <span className={styles.optionalSubjectsBadge}>
                Choose Any 1 Subject
              </span>
            </div>

            <div className={styles.optionalSubjectsGrid}>
              {exam.optionalSubjects.map((subj, sIdx) => (
                <div key={sIdx} className={styles.optionalSubjectCard}>
                  <span className={styles.optionalSubjectNum}>
                    {sIdx + 1}
                  </span>
                  <div>
                    <strong className={styles.optionalSubjectName}>{subj.name}</strong>
                    {subj.nameMr && <span className={styles.optionalSubjectNameMr}>{subj.nameMr}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Interview & Personality Test Section (if available) ── */}
      {exam.interviewDetails && (
        <section className={styles.interviewSection}>
          <div className="container">
            <div className={styles.interviewCard}>
              <div className={styles.interviewHeader}>
                <div className={styles.interviewHeaderLeft}>
                  <span className={`material-symbols-outlined ${styles.interviewHeaderIcon}`}>record_voice_over</span>
                  <div>
                    <h2 className={styles.interviewTitle}>
                      मुलाखत व व्यक्तिमत्त्व चाचणी — Interview Process ({exam.interviewDetails.marks} Marks)
                    </h2>
                    <p className={styles.interviewMeta}>
                      कालावधी: {exam.interviewDetails.duration} • मंडळ: {exam.interviewDetails.panel}
                    </p>
                  </div>
                </div>
                <Link href="/mock-interview" className={styles.interviewAiBtn}>
                  <span className={`material-symbols-outlined ${styles.interviewAiBtnIcon}`}>psychology</span>
                  AI मॉक मुलाखत सुरू करा →
                </Link>
              </div>

              {exam.interviewDetails.purpose && (
                <p className={styles.interviewObjective}>
                  <strong>उद्दिष्ट (Objective):</strong> {exam.interviewDetails.purpose}
                </p>
              )}

              <div>
                <strong className={styles.interviewFocusTitle}>
                  मुलाखतीतील मुख्य तपासणी घटक (Core Assessment Focus Areas):
                </strong>
                <div className={styles.interviewFocusGrid}>
                  {exam.interviewDetails.focusAreas.map((area, aIdx) => (
                    <div key={aIdx} className={styles.interviewFocusItem}>
                      <span className={`material-symbols-outlined ${styles.interviewFocusCheckIcon}`}>check_circle</span>
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
                    <div className={`${styles.pyqYearCol} ${styles.pyqYearColThemed}`}>
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
                        className={`${styles.pyqPaperBtn} ${styles.pyqBankBtn}`}
                        title="Practice topic questions in 15-Year PYQ Bank"
                      >
                        <span className={`material-symbols-outlined ${styles.pyqBankIcon}`}>quiz</span>
                        <span>15-Yr Bank Practice</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {exam.slug.startsWith('mpsc-') && (
              <div className={styles.mpscArchiveBanner}>
                <div>
                  <strong className={styles.mpscArchiveBannerTitle}>🏛️ संपूर्ण MPSC २०२१–२०२६ अधिकृत संग्रह (841 Papers & Keys)</strong>
                  <p className={styles.mpscArchiveBannerText}>सर्व राज्यसेवा, संयुक्त गट ब व क, वनसेवा आणि चाळणी परीक्षा प्रश्नपत्रिका व उत्तरतालिका थेट ब्राऊझरमध्ये उपलब्ध.</p>
                </div>
                <Link href="/mpsc-pyq" className={styles.mpscArchiveBannerBtn}>
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
                  <span className="material-symbols-outlined">{rel.logo}</span>
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
      <section className={styles.nextStepsSection}>
        <div className="container">
          <div className={styles.nextStepsHeader}>
            <span className={styles.nextStepsTag}>
              From Syllabus to Selection
            </span>
            <h2 className={styles.nextStepsTitle}>
              अभ्यासक्रमानंतर सराव करा (Practice Next Steps)
            </h2>
            <p className={styles.nextStepsDesc}>
              {exam.shortName || exam.nameEn} च्या संपूर्ण तयारीसाठी खालील अधिकृत टूल्स वापरा:
            </p>
          </div>

          <div className={styles.nextStepsGrid}>
            <Link
              href="/mpsc-pyq"
              className={`${styles.nextStepCard} ${styles.nextStepCardFeatured}`}
            >
              <div>
                <div className={styles.nextStepCardTop}>
                  <span className={styles.nextStepEmoji}>📄</span>
                  <span className={styles.nextStepBadgePrimary}>
                    841 Papers
                  </span>
                </div>
                <strong className={styles.nextStepCardTitle}>
                  MPSC मूळ प्रश्नपत्रिका व की
                </strong>
                <p className={styles.nextStepCardDesc}>
                  २०२१ ते २०२६ चे सर्व ४२९ अधिकृत संच थेट ब्राऊझरमध्ये वाचा व डाऊनलोड करा.
                </p>
              </div>
              <span className={styles.nextStepCardLinkPrimary}>
                प्रश्नपत्रिका उघडा →
              </span>
            </Link>

            <Link
              href={matchedMock ? `/mock-tests/${matchedMock.slug}` : '/mock-tests'}
              className={styles.nextStepCard}
            >
              <div>
                <div className={styles.nextStepCardTop}>
                  <span className={styles.nextStepEmoji}>⏱️</span>
                  <span className={styles.nextStepBadgeSuccess}>
                    100% Free
                  </span>
                </div>
                <strong className={styles.nextStepCardTitle}>
                  मोफत ऑनलाईन मॉक टेस्ट्स
                </strong>
                <p className={styles.nextStepCardDesc}>
                  १०० प्रश्नांचे संपूर्ण मॉक पेपर्स व विषयवार स्पीड ड्रिल्स — राज्यस्तरीय रँकसह.
                </p>
              </div>
              <span className={styles.nextStepCardLinkSuccess}>
                मॉक टेस्ट द्या →
              </span>
            </Link>

            <Link
              href={`/pyq?q=${encodeURIComponent(exam.shortName || exam.nameEn)}`}
              className={styles.nextStepCard}
            >
              <div>
                <div className={styles.nextStepCardTop}>
                  <span className={styles.nextStepEmoji}>🎯</span>
                  <span className={styles.nextStepBadgePurple}>
                    9,000+ MCQs
                  </span>
                </div>
                <strong className={styles.nextStepCardTitle}>
                  15-Year Topic PYQ Bank
                </strong>
                <p className={styles.nextStepCardDesc}>
                  अभ्यासक्रमातील घटकनिहाय प्रश्न सोडवा — राज्यव्यवस्था, भूगोल, विज्ञान व इतिहास.
                </p>
              </div>
              <span className={styles.nextStepCardLinkPurple}>
                विषयवार प्रश्न सोडवा →
              </span>
            </Link>

            <Link
              href="/cutoffs"
              className={styles.nextStepCard}
            >
              <div>
                <div className={styles.nextStepCardTop}>
                  <span className={styles.nextStepEmoji}>📊</span>
                  <span className={styles.nextStepBadgeBlue}>
                    10-Yr Benchmark
                  </span>
                </div>
                <strong className={styles.nextStepCardTitle}>
                  १०-वर्षीय कट-ऑफ विश्लेषण
                </strong>
                <p className={styles.nextStepCardDesc}>
                  Open, OBC, EWS, SC, ST प्रवर्गांचे मागील १० वर्षांचे अधिकृत बेंचमार्क गुण.
                </p>
              </div>
              <span className={styles.nextStepCardLinkBlue}>
                कट-ऑफ तपासा →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
