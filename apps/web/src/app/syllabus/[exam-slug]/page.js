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
import { fitDescription } from '@/lib/seoMetadata'
import { MPSC_TOTAL_QUESTION_PAPERS, MPSC_ARCHIVE_YEARS_SPAN } from '@/lib/platformStats'
import styles from './examDetail.module.css'

// Static params for Next.js build
export async function generateStaticParams() {
  return ALL_EXAM_SLUGS.map(slug => ({ 'exam-slug': slug }))
}

// ISR cache for fast page delivery
export const revalidate = 86400

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const exam = getExamBySlug(resolvedParams['exam-slug'])
  if (!exam) return {}
  const canonicalUrl = `https://examudaan.in/syllabus/${exam.slug}`
  const examName = exam.shortName || exam.nameEn

  // Pattern: "{Exam} Syllabus {Year} & Exam Pattern - Subject-wise PDF", max 60 chars
  let title = `${examName} Syllabus 2026 & Exam Pattern - Subject-wise PDF`
  if (title.length > 60) {
    title = `${examName} Syllabus 2026 & Exam Pattern - PDF`
  }
  if (title.length > 60) {
    title = `${examName} Syllabus 2026 & Exam Pattern`
  }
  if (title.length > 60) {
    title = `${examName} Syllabus 2026 PDF`
  }
  if (title.length > 60) {
    title = `${examName} Syllabus 2026`.slice(0, 60)
  }

  const description = fitDescription(
    `Download ${exam.nameEn} syllabus 2026 with paper-wise topic breakdown, marking scheme, exam pattern and negative marking.`,
    'Official syllabus PDF download on ExamUdaan.'
  )

  return {
    title: { absolute: title },
    description,
    keywords: `${exam.nameEn} syllabus 2026, ${exam.shortName} exam pattern, ${exam.shortName} PYQ papers`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      siteName: 'ExamUdaan',
    },
    twitter: {
      card: 'summary',
      title,
      description,
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
            <Link href="/" title="ExamUdaan Home">Home</Link>
            <span className={`material-symbols-outlined ${styles.breadcrumbSep}`}>chevron_right</span>
            <Link href="/syllabus" title="All Syllabi">Syllabus</Link>
            {exam.slug.startsWith('mpsc-') && (
              <>
                <span className={`material-symbols-outlined ${styles.breadcrumbSep}`}>chevron_right</span>
                <Link href="/syllabus#mpsc-catalog" title="MPSC Examination Cadres">MPSC Cadres</Link>
              </>
            )}
            <span className={`material-symbols-outlined ${styles.breadcrumbSep}`}>chevron_right</span>
            <a href="#top" className={styles.breadcrumbCurrent} title="Current exam (Click to scroll to top)">
              {exam.shortName}
            </a>
          </nav>

          <div className={styles.heroInner}>
            <div className={styles.heroLeft}>
              <Link
                href="/syllabus#mpsc-catalog"
                className={styles.examLevelBadge}
                data-level={exam.examLevel}
                title="View Government Examination Levels"
              >
                {exam.examLevel} Government
              </Link>
              <h1>{exam.nameEn}</h1>
              <p className={styles.conductingBody}>
                Conducted by:{' '}
                <Link
                  href={`/jobs/org/${exam.conductingBody?.toLowerCase() === 'mpsc' ? 'mpsc' : exam.conductingBody?.toLowerCase()}`}
                  className={styles.conductingBodyLink}
                  title={`View all ${exam.conductingBody} recruitment notifications`}
                >
                  <strong>{exam.conductingBody}</strong>
                </Link>
              </p>

              {/* Key Stats — 100% Clickable Interactive Row */}
              <div className={styles.keyStats}>
                <Link
                  href={`/jobs?q=${encodeURIComponent(exam.shortName || exam.nameEn)}`}
                  className={`${styles.keyStat} ${styles.keyStatInteractive}`}
                  title="View active job vacancies for this exam"
                >
                  <span className="material-symbols-outlined">badge</span>
                  <div>
                    <strong>Vacancies ↗</strong>
                    <span>{exam.totalVacancies}</span>
                  </div>
                </Link>
                <a
                  href="#syllabus"
                  className={`${styles.keyStat} ${styles.keyStatInteractive}`}
                  title="Jump to eligibility and qualifications"
                >
                  <span className="material-symbols-outlined">school</span>
                  <div>
                    <strong>Eligibility ↓</strong>
                    <span>{exam.eligibility}</span>
                  </div>
                </a>
                <a
                  href="#syllabus"
                  className={`${styles.keyStat} ${styles.keyStatInteractive}`}
                  title="Jump to age limit criteria"
                >
                  <span className="material-symbols-outlined">cake</span>
                  <div>
                    <strong>Age Limit ↓</strong>
                    <span>{exam.ageLimit.min}–{exam.ageLimit.max} yrs</span>
                  </div>
                </a>
                <a
                  href="#syllabus"
                  className={`${styles.keyStat} ${styles.keyStatInteractive}`}
                  title="Jump to application fee structure"
                >
                  <span className="material-symbols-outlined">payments</span>
                  <div>
                    <strong>Application Fee ↓</strong>
                    <span>General: {exam.applicationFee.general} | Reserved: {exam.applicationFee.reserved}</span>
                  </div>
                </a>

                {/* Question Paper (PDF) Highlight Card — Clickable, jumps to in-page study workspace */}
                {(hasOfficialPdfs || hasPyqLinks) && (
                  <a
                    href="#pyq"
                    className={`${styles.keyStat} ${styles.keyStatClickable}`}
                    title={`View verified ${exam.shortName} Question Papers in interactive study workspace`}
                  >
                    <span className={`material-symbols-outlined ${styles.pdfStatIcon}`}>picture_as_pdf</span>
                    <div>
                      <strong>Question Paper (PDF)</strong>
                      <span className={styles.pdfStatBadge}>
                        {hasDirectPdf ? `${verifiedPdfs.length} Verified PDFs ↓` : `${pyqLinksList.length} Papers Available ↓`}
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
                {/* Question Paper in study workspace direct action */}
                {(hasOfficialPdfs || hasPyqLinks) && (
                  <a
                    href="#pyq"
                    className={`${styles.heroOfficialBtn} ${styles.heroPdfBtn}`}
                    title={`Open authentic ${exam.shortName || exam.nameEn} question papers in study workspace`}
                  >
                    <span className="material-symbols-outlined">description</span>
                    Question Paper (PDF) ↓
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
              <a
                href={exam.slug.startsWith('mpsc-') ? '/mpsc-pyq' : (hasOfficialPdfs || hasPyqLinks ? '#pyq' : '/question-papers')}
                className={styles.learningLoopItem}
              >
                <div className={styles.learningLoopIconBox} data-type="pyq">
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <div>
                  <div className={styles.learningLoopTitle}>मागील प्रश्नपत्रिका (PYQ)</div>
                  <div className={styles.learningLoopSub}>
                    {hasOfficialPdfs
                      ? `${verifiedPdfs.length} Verified PDFs`
                      : hasPyqLinks
                      ? `${pyqLinksList.length} Exam Cycles`
                      : 'Question Papers Directory'}
                  </div>
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

          {/* ── Official Examination Ecosystem & Dedicated Tool Cross-links ── */}
          <div className={styles.officialPapersModule}>
            <div className={styles.officialPapersHeader}>
              <div className={styles.officialPapersIcon}>
                <span className="material-symbols-outlined">hub</span>
              </div>
              <div>
                <h3 className={styles.officialPapersTitle}>
                  {exam.slug.includes('police')
                    ? 'महाराष्ट्र पोलीस भरती संपूर्ण तयारी टूल्स व पेपर्स (Police Exam Ecosystem)'
                    : exam.slug.includes('talathi')
                    ? 'तलाठी भरती संपूर्ण तयारी टूल्स व शिफ्ट पेपर्स (Talathi Ecosystem)'
                    : exam.slug.startsWith('mpsc-')
                    ? 'अधिकृत MPSC पेपरनिहाय अभ्यासक्रम व साधने (Official MPSC Ecosystem)'
                    : `${exam.shortName || exam.nameEn} Examination Ecosystem & Tools`}
                </h3>
                <p className={styles.officialPapersSubtitle}>
                  {exam.slug.includes('police')
                    ? 'ग्राउंड व लेखी गुणांची गणना, ३६ जिल्ह्यांचे कटऑफ ट्रेंड्स, मागील प्रश्नपत्रिका आणि इन-हँड वेतन तपशील'
                    : exam.slug.includes('talathi')
                    ? 'TCS पॅटर्न ३६ जिल्ह्यांचे अधिकृत कटऑफ, मागील शिफ्ट पेपर्स आणि महसूल वेतन मॅट्रिक्स'
                    : exam.slug.startsWith('mpsc-')
                    ? 'MPSC च्या अधिकृत संकेतस्थळावरून (mpsc.gov.in) घटकनिहाय गुण, १० वर्षांचे कटऑफ, व वेतन गणना'
                    : '10-Year Cutoffs, Question Papers, 7th CPC Salary Calculator, and Live Topic PYQ Bank'}
                </p>
              </div>
            </div>

            <div className={styles.officialPapersGrid}>
              {exam.slug.includes('police') ? (
                <>
                  <Link href="/cutoffs" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>36 Districts</span>
                      <span className={styles.officialPaperYear}>2019–2024</span>
                    </div>
                    <h4 className={styles.officialPaperName}>महाराष्ट्र पोलीस ३६ जिल्हे कटऑफ ट्रेंड्स</h4>
                    <p className={styles.officialPaperDesc}>
                      पुणे, मुंबई, नागपूर, ठाणे, गडचिरोली पोलीस शिपाई, चालक व SRPF मेरिट ट्रेंड व सेफ स्कोअर मॅट्रिक्स.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Explore District Cutoffs</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href="/police-calculator" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>Official Norms</span>
                      <span className={styles.officialPaperYear}>50 + 100 Marks</span>
                    </div>
                    <h4 className={styles.officialPaperName}>मैदानी व लेखी परीक्षा गुण कॅल्क्युलेटर</h4>
                    <p className={styles.officialPaperDesc}>
                      १६०० मी, १०० मी धावणे, गोळाफेक अचूक टाइमिंग व गुणांकन (५० गुण) + लेखी (१०० गुण) एकत्रित मेरिट गणना.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Calculate Physical &amp; Written</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href="/salary-calculator" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>7th CPC (S-7 / S-13)</span>
                      <span className={styles.officialPaperYear}>50% MH DA</span>
                    </div>
                    <h4 className={styles.officialPaperName}>पोलीस शिपाई / चालक / PSI इन-हँड वेतन</h4>
                    <p className={styles.officialPaperDesc}>
                      मूळ वेतन, ५०% महागाई भत्ता, ३०%/२०%/१०% HRA, युनिफॉर्म व वाहन भत्ता आणि UPS निवृत्तीवेतन गणना.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Open Salary Calculator</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href="/question-papers" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>Verified PYQ</span>
                      <span className={styles.officialPaperYear}>2019–2024</span>
                    </div>
                    <h4 className={styles.officialPaperName}>पोलीस भरती मूळ प्रश्नपत्रिका व उत्तरतालिका</h4>
                    <p className={styles.officialPaperDesc}>
                      महाराष्ट्र राज्य पोलीस दलाच्या मागील सर्व लेखी परीक्षा प्रश्नपत्रिका थेट ब्राऊझरमध्ये वाचा व डाऊनलोड करा.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Open Question Papers</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>
                </>
              ) : exam.slug.includes('talathi') ? (
                <>
                  <Link href="/cutoffs" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>36 Districts</span>
                      <span className={styles.officialPaperYear}>2023 Official</span>
                    </div>
                    <h4 className={styles.officialPaperName}>तलाठी भरती २०२३ ३६ जिल्हे कटऑफ</h4>
                    <p className={styles.officialPaperDesc}>
                      पुणे, छत्रपती संभाजीनगर, नागपूर, नाशिक सह पेसा व नॉन-पेसा महसूल संवर्ग कटऑफ व नॉर्मलायझेशन.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>View Talathi Cutoffs</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href="/salary-calculator" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>S-8 Pay Band</span>
                      <span className={styles.officialPaperYear}>₹25,500 Base</span>
                    </div>
                    <h4 className={styles.officialPaperName}>तलाठी इन-हँड मासिक वेतन व भत्ते</h4>
                    <p className={styles.officialPaperDesc}>
                      महसूल विभाग तलाठी संवर्ग मूळ वेतन, ५०% डीए, ग्रामीण/शहरी HRA व व्यावसायिक कर वजावट.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Calculate In-Hand Salary</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href="/question-papers" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>TCS Pattern</span>
                      <span className={styles.officialPaperYear}>All Shifts</span>
                    </div>
                    <h4 className={styles.officialPaperName}>तलाठी TCS शिफ्ट प्रश्नपत्रिका व उत्तरे</h4>
                    <p className={styles.officialPaperDesc}>
                      २०२३ च्या सर्व ५७ शिफ्ट्सचे अस्सल प्रश्नपत्रिका व अधिकृत अंतिम सुधारित उत्तरतालिका संच.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>View Shift Papers</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href="/mock-tests" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>100 Questions</span>
                      <span className={styles.officialPaperYear}>100% Free</span>
                    </div>
                    <h4 className={styles.officialPaperName}>तलाठी TCS पॅटर्न ऑनलाईन मॉक टेस्ट्स</h4>
                    <p className={styles.officialPaperDesc}>
                      मराठी, इंग्रजी, सामान्य ज्ञान व बौद्धिक चाचणी १०० प्रश्नांचा संपूर्ण कम्प्युटर बेस्ड सराव.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Attempt Mock Test</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>
                </>
              ) : exam.slug.startsWith('mpsc-') ? (
                <>
                  <Link href="/mpsc-syllabus/1181" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>MPSC #1181</span>
                      <span className={styles.officialPaperYear}>Official Paper</span>
                    </div>
                    <h4 className={styles.officialPaperName}>State Services Main Exam (English Format)</h4>
                    <p className={styles.officialPaperDesc}>
                      4 General Studies papers (GS-I to GS-IV), 400 marks objective pattern, unit-by-unit syllabus breakdown.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>View Interactive Breakdown</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href="/syllabus/mpsc" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>Complete Directory</span>
                      <span className={styles.officialPaperYear}>343 Papers</span>
                    </div>
                    <h4 className={styles.officialPaperName}>MPSC सर्व ३४३ अधिकृत अभ्यासक्रम संचिका</h4>
                    <p className={styles.officialPaperDesc}>
                      गट-ब (८९), शिक्षण (८८), राज्यसेवा (३६), अभियांत्रिकी (३२), गट-क (११) व सर्व संचिका शोध.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Explore 343 Papers Directory</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href="/cutoffs" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>10-Year Analysis</span>
                      <span className={styles.officialPaperYear}>2015–2024</span>
                    </div>
                    <h4 className={styles.officialPaperName}>MPSC राज्यसेवा व संयुक्त १० वर्षांचे कटऑफ</h4>
                    <p className={styles.officialPaperDesc}>
                      ओपन, ओबीसी, ईडब्ल्यूएस, एससी व महिला कटऑफ, सीएसएटी सुधारणा व २०२६ सेफ स्कोअर टार्गेट.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>View Cutoff Trajectory</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href="/salary-calculator" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>Pay Matrix</span>
                      <span className={styles.officialPaperYear}>S-1 to S-30</span>
                    </div>
                    <h4 className={styles.officialPaperName}>MPSC संवर्ग वेतन गणना (7th CPC)</h4>
                    <p className={styles.officialPaperDesc}>
                      डिप्टी कलेक्टर (S-20), तहसीलदार (S-15), PSI/STI (S-13) व लिपिक इन-हँड मासिक वेतन व भत्ते.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Calculate Cadre Salary</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/cutoffs" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>10-Yr Trends</span>
                      <span className={styles.officialPaperYear}>2015–2024</span>
                    </div>
                    <h4 className={styles.officialPaperName}>10-Year Category Cutoff Trend Analyzer</h4>
                    <p className={styles.officialPaperDesc}>
                      Official commission cutoff progression across Open, OBC, EWS, SC, ST and 2026 safe targets.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Open Cutoff Analyzer</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href="/salary-calculator" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>7th CPC Calculator</span>
                      <span className={styles.officialPaperYear}>53% DA / 50% MH</span>
                    </div>
                    <h4 className={styles.officialPaperName}>In-Hand Salary &amp; Pension Calculator</h4>
                    <p className={styles.officialPaperDesc}>
                      Compute monthly take-home salary, HRA 30%/20%/10%, Transport allowance, and UPS vs NPS pension.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Calculate In-Hand Pay</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href="/question-papers" className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>Official Papers</span>
                      <span className={styles.officialPaperYear}>PDF &amp; Keys</span>
                    </div>
                    <h4 className={styles.officialPaperName}>Previous Year Question Papers Archive</h4>
                    <p className={styles.officialPaperDesc}>
                      Download authentic previous year question papers and official answer keys directly from recruitment boards.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Browse Question Papers</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>

                  <Link href={`/pyq?q=${encodeURIComponent(exam.shortName || exam.nameEn)}`} className={styles.officialPaperCard}>
                    <div className={styles.officialPaperMeta}>
                      <span className={styles.officialPaperBadge}>Interactive Bank</span>
                      <span className={styles.officialPaperYear}>1,200+ MCQs</span>
                    </div>
                    <h4 className={styles.officialPaperName}>Topic-wise PYQ Question Bank</h4>
                    <p className={styles.officialPaperDesc}>
                      Solve previous year questions interactively in browser with instant explanations and accuracy tracking.
                    </p>
                    <span className={styles.officialPaperCta}>
                      <span>Practice in PYQ Bank</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
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
                      <h3 className={styles.pyqPaperTitle}>
                        <a
                          href={p.paperUrl || p.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.pyqPaperTitleLink}
                          title={`Open ${p.label}`}
                        >
                          {p.label}
                        </a>
                      </h3>
                      <p className={styles.pyqExamMeta}>
                        <span className="material-symbols-outlined">account_balance</span>
                        <span>{exam.conductingBody}</span>
                        <span>•</span>
                        <span>Official Question Paper & Solution</span>
                      </p>
                    </div>
                    <div className={styles.pyqActions}>
                      {/* 1. Direct Official Question Paper */}
                      <a
                        href={p.paperUrl || p.url || exam.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.pyqPaperBtn}
                        title={`Open ${p.year} official question paper (PDF)`}
                      >
                        <span className="material-symbols-outlined">description</span>
                        <span>Question Paper (PDF)</span>
                        <span className="material-symbols-outlined">open_in_new</span>
                      </a>

                      {/* 2. Direct Official Answer Key (Always available next to Question Paper) */}
                      <a
                        href={p.answerKeyUrl || p.paperUrl || `/answer-keys?q=${encodeURIComponent(exam.shortName || exam.nameEn)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.pyqAnswerBtn}
                        title={`Open ${p.year} official answer key`}
                      >
                        <span className="material-symbols-outlined">key</span>
                        <span>Official Answer Key</span>
                        <span className="material-symbols-outlined">open_in_new</span>
                      </a>

                      {/* 3. Interactive Practice in PYQ Bank */}
                      <Link
                        href={`/pyq?q=${encodeURIComponent(exam.shortName || exam.nameEn)}`}
                        className={`${styles.pyqPaperBtn} ${styles.pyqBankBtn}`}
                        title="Practice topic questions interactively in 15-Year PYQ Bank"
                      >
                        <span className={`material-symbols-outlined ${styles.pyqBankIcon}`}>quiz</span>
                        <span>Practice in PYQ Bank</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contextual Ecosystem Tool Banners */}
            {exam.slug.includes('police') ? (
              <div className={styles.mpscArchiveBanner}>
                <div>
                  <strong className={styles.mpscArchiveBannerTitle}>👮 संपूर्ण महाराष्ट्र पोलीस भरती टूलकिट (Cutoffs + Ground Calculator + Papers)</strong>
                  <p className={styles.mpscArchiveBannerText}>३६ जिल्ह्यांचे कटऑफ ट्रेंड्स, ५० गुण मैदानी व १०० गुण लेखी अचूक मेरिट गणना आणि मागील सर्व प्रश्नपत्रिका.</p>
                </div>
                <div className={styles.bannerButtonGroup}>
                  <Link href="/police-calculator" className={styles.mpscArchiveBannerBtn}>
                    ग्राउंड कॅल्क्युलेटर उघडा →
                  </Link>
                  <Link href="/cutoffs" className={styles.mpscArchiveBannerBtnSecondary}>
                    ३६ जिल्हे कटऑफ पहा →
                  </Link>
                </div>
              </div>
            ) : exam.slug.includes('talathi') ? (
              <div className={styles.mpscArchiveBanner}>
                <div>
                  <strong className={styles.mpscArchiveBannerTitle}>🏛️ तलाठी भरती २०२३ संपूर्ण विश्लेषण (३६ जिल्हे कटऑफ + TCS शिफ्ट पेपर्स)</strong>
                  <p className={styles.mpscArchiveBannerText}>सर्व ३६ जिल्ह्यांचे पेसा व नॉन-पेसा कटऑफ, नॉर्मलायझेशन स्कोअर आणि ५७ शिफ्ट्सचे अस्सल प्रश्नपत्रिका संच.</p>
                </div>
                <div className={styles.bannerButtonGroup}>
                  <Link href="/cutoffs" className={styles.mpscArchiveBannerBtn}>
                    तलाठी कटऑफ पहा →
                  </Link>
                  <Link href="/question-papers" className={styles.mpscArchiveBannerBtnSecondary}>
                    TCS शिफ्ट पेपर्स →
                  </Link>
                </div>
              </div>
            ) : exam.slug.startsWith('mpsc-') ? (
              <div className={styles.mpscArchiveBanner}>
                <div>
                  <strong className={styles.mpscArchiveBannerTitle}>🏛️ संपूर्ण MPSC {MPSC_ARCHIVE_YEARS_SPAN} अधिकृत संग्रह ({MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('en-IN')} Papers &amp; 343 Syllabi)</strong>
                  <p className={styles.mpscArchiveBannerText}>सर्व राज्यसेवा, संयुक्त गट ब व क, वनसेवा आणि चाळणी परीक्षा प्रश्नपत्रिका व उत्तरतालिका थेट ब्राऊझरमध्ये उपलब्ध.</p>
                </div>
                <div className={styles.bannerButtonGroup}>
                  <Link href="/mpsc-pyq" className={styles.mpscArchiveBannerBtn}>
                    {MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('mr-IN')} पेपर्स संग्रह उघडा →
                  </Link>
                  <Link href="/syllabus/mpsc" className={styles.mpscArchiveBannerBtnSecondary}>
                    ३४३ अभ्यासक्रम संचिका →
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.mpscArchiveBanner}>
                <div>
                  <strong className={styles.mpscArchiveBannerTitle}>📊 10-Year Cutoff Trends &amp; Official Question Papers</strong>
                  <p className={styles.mpscArchiveBannerText}>Explore category-wise closing marks, 7th CPC salary calculator, and verified answer keys in browser.</p>
                </div>
                <div className={styles.bannerButtonGroup}>
                  <Link href="/cutoffs" className={styles.mpscArchiveBannerBtn}>
                    View 10-Yr Cutoffs →
                  </Link>
                  <Link href="/question-papers" className={styles.mpscArchiveBannerBtnSecondary}>
                    Question Papers →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Related Exams & PYQ Practice Sets (Books Removed per User Request) ── */}
      <section className={styles.relatedSection}>
        <div className="container">
          <div className={styles.relatedSectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <span className="material-symbols-outlined">hub</span>
                Related Exams & PYQ Practice Sets
              </h2>
              <p className={styles.relatedSubtitle}>
                Explore connected exam syllabi, previous year papers, and syllabus-matched practice question banks.
              </p>
            </div>
            <Link href="/syllabus" className={styles.viewAllSyllabiBtn}>
              All Exam Syllabi →
            </Link>
          </div>

          {related.length > 0 && (
            <div className={styles.relatedGrid}>
              {related.map(rel => (
                <div key={rel.slug} className={styles.relatedCardItem}>
                  <div className={styles.relatedCardTop}>
                    <div className={styles.relatedIconBadge}>
                      <span className="material-symbols-outlined">{rel.logo || 'school'}</span>
                    </div>
                    <div className={styles.relatedInfo}>
                      <strong className={styles.relatedName}>{rel.nameEn}</strong>
                      <span className={styles.relatedOrg}>{rel.conductingBody}</span>
                    </div>
                  </div>
                  <div className={styles.relatedActionsRow}>
                    <Link
                      href={`/syllabus/${rel.slug}`}
                      className={styles.btnRelatedSyllabus}
                      title={`View ${rel.nameEn} syllabus & exam pattern`}
                    >
                      <span>📄 View Syllabus</span>
                    </Link>
                    <Link
                      href={`/pyq?q=${encodeURIComponent(rel.shortName || rel.nameEn)}`}
                      className={styles.btnRelatedPyq}
                      title={`Practice ${rel.shortName || rel.nameEn} previous year questions`}
                    >
                      <span>🎯 Solve PYQs</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Access to Main Official PYQ Archives */}
          <div className={styles.quickPyqHub}>
            <div className={styles.quickPyqHeader}>
              <span className="material-symbols-outlined">collections_bookmark</span>
              <strong>Quick Access to Official Question Papers & Keys</strong>
            </div>
            <div className={styles.quickPyqLinksRow}>
              <Link href="/mpsc-pyq" className={styles.quickPyqChipOrange}>
                🏛️ MPSC Question Papers & Keys (2009–2026)
              </Link>
              <Link href="/police-bharti-question-papers" className={styles.quickPyqChipBlue}>
                👮 Police Bharti Papers & Keys
              </Link>
              <Link href="/talathi-question-papers" className={styles.quickPyqChipGreen}>
                🏛️ Talathi Bharti Question Papers
              </Link>
              <Link href="/mahatet-previous-year-papers" className={styles.quickPyqChipPurple}>
                🎓 MAHA TET Previous Papers
              </Link>
              <Link href="/question-papers" className={styles.quickPyqChipTeal}>
                📚 All Central & State Papers
              </Link>
              <Link href="/answer-keys" className={styles.quickPyqChipAmber}>
                🔑 All Official Answer Keys
              </Link>
            </div>
          </div>
        </div>
      </section>

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
            {exam.slug.includes('police') ? (
              <Link
                href="/police-calculator"
                className={`${styles.nextStepCard} ${styles.nextStepCardFeatured}`}
              >
                <div>
                  <div className={styles.nextStepCardTop}>
                    <span className={styles.nextStepEmoji}>👮</span>
                    <span className={styles.nextStepBadgePrimary}>
                      50 + 100 Marks
                    </span>
                  </div>
                  <strong className={styles.nextStepCardTitle}>
                    पोलीस ग्राउंड व लेखी गुण कॅल्क्युलेटर
                  </strong>
                  <p className={styles.nextStepCardDesc}>
                    ५० गुण मैदानी (१६०० मी, १०० मी, गोळाफेक) + १०० गुण लेखी चाचणी अचूक मेरिट गणना.
                  </p>
                </div>
                <span className={styles.nextStepCardLinkPrimary}>
                  कॅल्क्युलेटर उघडा →
                </span>
              </Link>
            ) : exam.slug.includes('talathi') ? (
              <Link
                href="/cutoffs"
                className={`${styles.nextStepCard} ${styles.nextStepCardFeatured}`}
              >
                <div>
                  <div className={styles.nextStepCardTop}>
                    <span className={styles.nextStepEmoji}>🏛️</span>
                    <span className={styles.nextStepBadgePrimary}>
                      36 Districts
                    </span>
                  </div>
                  <strong className={styles.nextStepCardTitle}>
                    तलाठी भरती २०२३ अधिकृत कटऑफ
                  </strong>
                  <p className={styles.nextStepCardDesc}>
                    पेसा व नॉन-पेसा सर्व ३६ जिल्ह्यांचे अधिकृत कटऑफ व सेफ स्कोअर बेंचमार्क.
                  </p>
                </div>
                <span className={styles.nextStepCardLinkPrimary}>
                  कटऑफ तपासा →
                </span>
              </Link>
            ) : exam.slug.startsWith('mpsc-') ? (
              <Link
                href="/mpsc-pyq"
                className={`${styles.nextStepCard} ${styles.nextStepCardFeatured}`}
              >
                <div>
                  <div className={styles.nextStepCardTop}>
                    <span className={styles.nextStepEmoji}>📄</span>
                    <span className={styles.nextStepBadgePrimary}>
                      {MPSC_TOTAL_QUESTION_PAPERS.toLocaleString('en-IN')} Papers
                    </span>
                  </div>
                  <strong className={styles.nextStepCardTitle}>
                    MPSC मूळ प्रश्नपत्रिका व की
                  </strong>
                  <p className={styles.nextStepCardDesc}>
                    {MPSC_ARCHIVE_YEARS_SPAN} चे सर्व अधिकृत संच थेट ब्राऊझरमध्ये वाचा व डाऊनलोड करा.
                  </p>
                </div>
                <span className={styles.nextStepCardLinkPrimary}>
                  प्रश्नपत्रिका उघडा →
                </span>
              </Link>
            ) : (
              <Link
                href="/question-papers"
                className={`${styles.nextStepCard} ${styles.nextStepCardFeatured}`}
              >
                <div>
                  <div className={styles.nextStepCardTop}>
                    <span className={styles.nextStepEmoji}>📄</span>
                    <span className={styles.nextStepBadgePrimary}>
                      Official Archive
                    </span>
                  </div>
                  <strong className={styles.nextStepCardTitle}>
                    अधिकृत मागील प्रश्नपत्रिका व की
                  </strong>
                  <p className={styles.nextStepCardDesc}>
                    मागील १० वर्षांचे अधिकृत प्रश्नपत्रिका संच व अंतिम सुधारित उत्तरतालिका.
                  </p>
                </div>
                <span className={styles.nextStepCardLinkPrimary}>
                  प्रश्नपत्रिका उघडा →
                </span>
              </Link>
            )}

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
