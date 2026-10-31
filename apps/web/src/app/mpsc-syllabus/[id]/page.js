// ============================================================
// app/mpsc-syllabus/[id]/page.js — MPSC Interactive Syllabus Viewer
// Official MPSC Exam Syllabus, Subject-wise Topics, PYQ Practice & Feedback
// ============================================================

'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { toSecureDocUrl } from '@/lib/docObfuscate'
import styles from './syllabus.module.css'

// Glimpse of authentic MPSC Previous Year Question mapped to this syllabus
const MPSC_GLIMPSE_QUESTION = {
  examTag: 'MPSC Rajyaseva / Combined Prelims',
  topicTag: 'Indian Constitution & Polity',
  questionEn: 'Which Article of the Constitution of India provides for the establishment of the State Public Service Commission (MPSC)?',
  questionMr: 'भारतीय राज्यघटनेतील कोणत्या कलमानुसार प्रत्येक राज्यासाठी राज्य लोकसेवा आयोगाची (MPSC) स्थापना केली जाते?',
  answerInsightEn: 'Article 315 — Mandates a Public Service Commission for the Union (UPSC) and for each State (MPSC for Maharashtra). Article 320 defines the powers and commission functions.',
  answerInsightMr: 'कलम ३१५ — केंद्र व प्रत्येक घटकराज्यासाठी स्वतंत्र लोकसेवा आयोगाची घटनात्मक तरतूद. कलम ३२० अन्वये आयोगाची कर्तव्ये निश्चित केली आहेत.'
}

function PaperCard({ paper }) {
  const [open, setOpen] = useState(true)
  const units = paper.units || []
  const totalTopics = units.reduce((s, u) => s + (u.topics || []).length, 0)

  useEffect(() => {
    function handleHash() {
      if (typeof window !== 'undefined' && window.location.hash === `#paper-${paper.paperNumber}`) {
        setOpen(true)
      }
    }
    window.addEventListener('hashchange', handleHash)
    handleHash()
    return () => window.removeEventListener('hashchange', handleHash)
  }, [paper.paperNumber])

  const handleBadgeClick = (e) => {
    e.stopPropagation()
    setOpen(true)
  }

  return (
    <div className={styles.paperCard}>
      {/* Paper summary header (toggle) */}
      <button
        type="button"
        className={styles.paperToggle}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        title={open ? 'Click to collapse paper details' : 'Click to expand paper details'}
      >
        <span className={`${styles.paperNumBadge} ${paper.isQualifying ? styles.paperNumBadgeQual : ''}`}>
          {paper.paperNumber}
        </span>
        <div className={styles.paperMeta}>
          <span className={styles.paperTitle}>{paper.paperTitle}</span>
          {paper.paperTitleMr && (
            <span className={styles.paperTitleMr}>{paper.paperTitleMr}</span>
          )}
          <div className={styles.paperBadgeRow}>
            {paper.type && (
              <span className={`${styles.smallBadge} ${styles.smallBadgePrimary}`}>
                {paper.type}
              </span>
            )}
            {paper.duration && (
              <span className={styles.smallBadge}>⏱ {paper.duration}</span>
            )}
            {units.length > 0 && (
              <span
                className={`${styles.smallBadge} ${styles.smallBadgeClickable}`}
                onClick={handleBadgeClick}
                title="Click to expand and view units breakdown"
              >
                {units.length} Units ▾
              </span>
            )}
            {totalTopics > 0 && (
              <span
                className={`${styles.smallBadge} ${styles.smallBadgeClickable}`}
                onClick={handleBadgeClick}
                title="Click to expand and view topic checklist"
              >
                {totalTopics} Topics ▾
              </span>
            )}
            {paper.isQualifying && (
              <span className={styles.smallBadge}>Qualifying Only</span>
            )}
            {paper.isMerit && (
              <span className={`${styles.smallBadge} ${styles.smallBadgePrimary}`}>
                Merit Counted
              </span>
            )}
          </div>
        </div>
        <div className={styles.paperMarksCol}>
          <div className={styles.paperMarks}>{paper.totalMarks}M</div>
          <span className={styles.paperMarksSub}>marks</span>
        </div>
        <span className={`material-symbols-outlined ${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          expand_more
        </span>
      </button>

      {/* Collapsible units + topics */}
      {open && units.length > 0 && (
        <div className={styles.paperBody}>
          {units.map((unit, ui) => (
            <div key={ui} className={styles.unitCard}>
              <div className={styles.unitHeader}>
                <span className={styles.unitNumDot}>{unit.unitNumber || ui + 1}</span>
                <span className={styles.unitTitle}>{unit.unitTitle}</span>
                {unit.unitTitleMr && (
                  <span className={styles.unitTitleMr}>({unit.unitTitleMr})</span>
                )}
                {(unit.topics || []).length > 0 && (
                  <span className={styles.unitCountBadge}>
                    {unit.topics.length} topics
                  </span>
                )}
              </div>

              {(unit.topics || []).length > 0 && (
                <div className={styles.topicList}>
                  {unit.topics.map((topic, ti) => (
                    <div key={ti} className={styles.topicItem}>
                      <span className={styles.topicDot} />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MpscSyllabusPage({ params }) {
  const { id } = use(params)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [feedbackVote, setFeedbackVote] = useState(null)

  useEffect(() => {
    if (!id) return
    const trailingMatch = id.match(/(\d+)$/)
    const numericId = trailingMatch ? trailingMatch[1] : id

    // Fetch from database API first, fallback to static JSON / catalog
    fetch(`/api/syllabus/mpsc/${id}`)
      .then(async r => {
        if (r.ok) {
          const json = await r.json()
          if (json.success && json.data) return json.data
          if (json.papers) return json
        }
        // Fallback to static JSON file
        const fallback = await fetch(`/syllabus-json/${numericId}.json`)
        if (fallback.ok) return fallback.json()
        throw new Error(`Syllabus data document #${numericId} not found in database or files.`)
      })
      .then(setData)
      .catch(e => setError(e.message))
  }, [id])

  const handleFeedback = (type) => {
    setFeedbackVote(type)
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.errorPage}>
            <div className={styles.errorCode}>404</div>
            <div className={styles.errorMsg}>Syllabus Not Found for ID: {id}</div>
            <div className={styles.errorHint}>{error}</div>
            <Link href="/syllabus" className={styles.downloadBtn}>
              ← Back to All Syllabi
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.errorPage}>
            <div className={styles.errorCode}>⏳</div>
            <div className={styles.errorMsg}>Loading Official MPSC Syllabus…</div>
          </div>
        </div>
      </div>
    )
  }

  const papers = data.papers || []
  const meritPapers = papers.filter(p => !p.isQualifying)
  const qualPapers = papers.filter(p => p.isQualifying)
  const optSubs = data.optionalSubjects || []
  const qualPaperNames = data.qualifyingPapers || []
  const notes = data.importantNotes || []
  const totalUnits = papers.reduce((s, p) => s + (p.units || []).length, 0)
  const totalTopics = papers.reduce(
    (s, p) => s + (p.units || []).reduce((s2, u) => s2 + (u.topics || []).length, 0),
    0
  )
  const trailingMatch = id ? id.match(/(\d+)$/) : null
  const numericDocId = trailingMatch ? trailingMatch[1] : (data?.officialDocId || data?.docId || id)
  const isMarathi = (typeof window !== 'undefined' && window.location.search.includes('lang=mr')) || (id && id.includes('-marathi'))
  const cleanBaseSlug = id ? id.replace(/\?.*$/, '') : ''
  const officialPdfUrl = toSecureDocUrl(data?.pdfPublicPath || data?.pdfUrl || data?._dbMeta?.pdfUrl || (numericDocId ? `/downloads/mpsc/syllabus/general/${numericDocId}.pdf` : null))

  return (
    <div className={styles.page}>
      <div className={styles.layout}>

        {/* Sidebar TOC */}
        <nav className={styles.sidebar} aria-label="Syllabus Navigation">
          <div className={styles.tocSection}>
            <div className={styles.tocLabel}>Overview</div>
            <a href="#hero" className={styles.tocLink}>📋 Exam Info</a>
            <a href="#stats" className={styles.tocLink}>📊 Stats</a>
            <a href="#papers-section" className={styles.tocLink}>📄 Papers ({papers.length})</a>
            <a href="#practice-pyq" className={styles.tocLink}>🎯 Mock Tests &amp; PYQ</a>
            <a href="#ecosystem" className={styles.tocLink}>🔗 Related Resources</a>
            <a href="#feedback" className={styles.tocLink}>💬 Aspirant Feedback</a>
          </div>

          {meritPapers.length > 0 && (
            <div className={styles.tocSection}>
              <div className={styles.tocDivider} />
              <div className={styles.tocLabel}>Merit Papers ({meritPapers.length})</div>
              {meritPapers.map(p => (
                <a key={p.paperNumber} href={`#paper-${p.paperNumber}`} className={styles.tocLink}>
                  <span>Paper {p.paperNumber}</span>
                  <span className={styles.tocMark}>{p.totalMarks}M</span>
                </a>
              ))}
            </div>
          )}

          {qualPapers.length > 0 && (
            <div className={styles.tocSection}>
              <div className={styles.tocDivider} />
              <div className={styles.tocLabel}>Qualifying ({qualPapers.length})</div>
              {qualPapers.map(p => (
                <a key={p.paperNumber} href={`#paper-${p.paperNumber}`} className={styles.tocLink}>
                  <span>{p.paperTitle?.slice(0, 20)}…</span>
                </a>
              ))}
            </div>
          )}

          {optSubs.length > 0 && (
            <div className={styles.tocSection}>
              <div className={styles.tocDivider} />
              <a href="#optional" className={styles.tocLink}>📚 Optional ({optSubs.length})</a>
            </div>
          )}

          {notes.length > 0 && (
            <div className={styles.tocSection}>
              <div className={styles.tocDivider} />
              <a href="#notes" className={styles.tocLink}>📌 Notes ({notes.length})</a>
            </div>
          )}
        </nav>

        {/* Main content */}
        <main className={styles.main}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" title="ExamUdaan Home">Home</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href="/syllabus" title="All Exam Syllabi">Syllabus</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href="/syllabus#mpsc-catalog" title="MPSC Examination Cadres">MPSC Cadres</Link>
            {data.categoryLabelEn && (
              <>
                <span className={styles.breadcrumbSep}>/</span>
                <Link href="/syllabus#mpsc-catalog" title={`View ${data.categoryLabelEn} papers`}>
                  {data.categoryLabelEn}
                </Link>
              </>
            )}
            <span className={styles.breadcrumbSep}>/</span>
            <a href="#hero" className={styles.breadcrumbCurrent} title="Current exam (Click to view exam overview)">
              {data.examName}
            </a>
          </nav>

          {/* Exam hero */}
          <div id="hero" className={styles.examHero}>
            <h1 className={styles.examName}>{data.examName}</h1>
            {data.examNameMr && <div className={styles.examNameMr}>{data.examNameMr}</div>}
            <div className={styles.examMeta}>
              <Link
                href="/jobs/org/mpsc"
                className={`${styles.metaPill} ${styles.metaPillPrimary} ${styles.metaPillLink}`}
                title="View all MPSC Jobs, Results & Notification Updates"
              >
                <span>{data.conductingBody || 'MPSC'}</span>
                <span className={`material-symbols-outlined ${styles.metaPillIcon}`}>open_in_new</span>
              </Link>
              <Link
                href="/syllabus#mpsc-catalog"
                className={`${styles.metaPill} ${styles.metaPillLink}`}
                title="Explore Maharashtra State Level Examination Cadres"
              >
                <span>{data.examLevel || 'State Level (Maharashtra)'}</span>
                <span className={`material-symbols-outlined ${styles.metaPillIcon}`}>account_balance</span>
              </Link>
              <Link
                href="/syllabus#mpsc-catalog"
                className={`${styles.metaPill} ${styles.metaPillLink}`}
                title="View Examination Calendar & Deadlines"
              >
                <span>Year: {data.year || 2026}</span>
                <span className={`material-symbols-outlined ${styles.metaPillIcon}`}>calendar_month</span>
              </Link>
              <Link
                href={isMarathi ? `/mpsc-syllabus/${cleanBaseSlug}` : `/mpsc-syllabus/${cleanBaseSlug}?lang=mr`}
                className={`${styles.metaPill} ${styles.metaPillLink}`}
                title={isMarathi ? 'Switch to English Format' : 'मराठी फॉरमॅट मध्ये पहा (Switch to Marathi)'}
              >
                <span>Language: {data.language || 'Marathi/English'}</span>
                <span className={`material-symbols-outlined ${styles.metaPillIcon}`}>translate</span>
              </Link>
              {officialPdfUrl ? (
                <a
                  href={officialPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.metaPill} ${styles.metaPillLink}`}
                  title="Open Official Commission Notification PDF"
                >
                  <span>Official Doc #{numericDocId}</span>
                  <span className={`material-symbols-outlined ${styles.metaPillIcon}`}>picture_as_pdf</span>
                </a>
              ) : (
                <Link
                  href="/question-papers"
                  className={`${styles.metaPill} ${styles.metaPillLink}`}
                  title="Browse Question Papers & Documents"
                >
                  <span>Official Doc #{numericDocId}</span>
                  <span className={`material-symbols-outlined ${styles.metaPillIcon}`}>description</span>
                </Link>
              )}
            </div>
            {data.examPattern && (
              <div id="exam-pattern" className={styles.examPattern}>
                <strong>Exam Pattern &amp; Scheme:</strong> {data.examPattern}
              </div>
            )}
          </div>

          {/* Stats */}
          <div id="stats" className={styles.statsRow}>
            <a href="#papers-section" className={`${styles.statBox} ${styles.statBoxLink}`} title="Click to view total marks breakdown">
              <div className={styles.statVal}>{data.totalMarks || '—'}</div>
              <div className={styles.statLabel}>
                <span>Total Marks</span>
                <span className={`material-symbols-outlined ${styles.statLabelIcon}`}>arrow_downward</span>
              </div>
            </a>
            <a href="#papers-section" className={`${styles.statBox} ${styles.statBoxLink}`} title="Click to view all examination papers">
              <div className={styles.statVal}>{papers.length}</div>
              <div className={styles.statLabel}>
                <span>Papers</span>
                <span className={`material-symbols-outlined ${styles.statLabelIcon}`}>arrow_downward</span>
              </div>
            </a>
            <a href="#papers-section" className={`${styles.statBox} ${styles.statBoxLink}`} title="Click to view all syllabus units">
              <div className={styles.statVal}>{totalUnits}</div>
              <div className={styles.statLabel}>
                <span>Units</span>
                <span className={`material-symbols-outlined ${styles.statLabelIcon}`}>arrow_downward</span>
              </div>
            </a>
            <a href="#papers-section" className={`${styles.statBox} ${styles.statBoxLink}`} title="Click to view all topic checklists">
              <div className={styles.statVal}>{totalTopics}</div>
              <div className={styles.statLabel}>
                <span>Topics</span>
                <span className={`material-symbols-outlined ${styles.statLabelIcon}`}>arrow_downward</span>
              </div>
            </a>
            {optSubs.length > 0 && (
              <a href="#optional" className={`${styles.statBox} ${styles.statBoxLink}`} title="Click to view optional subjects list">
                <div className={styles.statVal}>{optSubs.length}</div>
                <div className={styles.statLabel}>
                  <span>Optional Subjects</span>
                  <span className={`material-symbols-outlined ${styles.statLabelIcon}`}>arrow_downward</span>
                </div>
              </a>
            )}
            {data.interviewMarks > 0 && (
              <a href="#exam-pattern" className={`${styles.statBox} ${styles.statBoxLink}`} title="Click to view interview marks & exam scheme">
                <div className={styles.statVal}>{data.interviewMarks}</div>
                <div className={styles.statLabel}>
                  <span>Interview Marks</span>
                  <span className={`material-symbols-outlined ${styles.statLabelIcon}`}>arrow_downward</span>
                </div>
              </a>
            )}
          </div>

          {/* Papers section */}
          <div id="papers-section" className={styles.sectionTitle}>
            📄 Exam Papers &amp; Topic Structure
            <span className={styles.sectionCount}>{papers.length} paper(s)</span>
          </div>

          {/* Paper cards — collapsible */}
          {papers.map(paper => (
            <div key={paper.paperNumber} id={`paper-${paper.paperNumber}`}>
              <PaperCard paper={paper} />
            </div>
          ))}

          {/* ── 🎯 Practice PYQ Glimpse & Dedicated Mock Test Bridge ── */}
          <section id="practice-pyq" className={styles.pyqSection}>
            <div className={styles.pyqSectionHeader}>
              <div>
                <div className={styles.pyqBadgeRow}>
                  <span className={styles.pyqMainBadge}>
                    <span className="material-symbols-outlined">quiz</span>
                    <span>Exam Practice Glimpse</span>
                  </span>
                  <span className={styles.pyqTagPill}>{MPSC_GLIMPSE_QUESTION.examTag}</span>
                </div>
                <h2 className={styles.pyqTitle}>Practice Exam Questions &amp; Full Mock Tests</h2>
                <p className={styles.pyqSubtitle}>
                  Here is a quick snapshot of authentic commission questions mapped to this syllabus. For full timed mock exams, visit our dedicated practice portal.
                </p>
              </div>
            </div>

            {/* Glimpse Card */}
            <div className={styles.pyqGlimpseCard}>
              <div className={styles.pyqGlimpseHeader}>
                <span className={styles.pyqGlimpseTopic}>{MPSC_GLIMPSE_QUESTION.topicTag}</span>
                <span className={styles.pyqGlimpseBadge}>Sample PYQ Glimpse</span>
              </div>

              <div className={styles.pyqQuestionText}>
                <span>Q. {MPSC_GLIMPSE_QUESTION.questionEn}</span>
                {MPSC_GLIMPSE_QUESTION.questionMr && (
                  <div className={styles.pyqQuestionTextMr}>प्रश्न. {MPSC_GLIMPSE_QUESTION.questionMr}</div>
                )}
              </div>

              <div className={styles.pyqKeyInsight}>
                <div className={styles.insightHeader}>
                  <span className="material-symbols-outlined">verified</span>
                  <strong>Verified Commission Solution:</strong>
                </div>
                <p>{MPSC_GLIMPSE_QUESTION.answerInsightEn}</p>
                <p className={styles.insightMr}>{MPSC_GLIMPSE_QUESTION.answerInsightMr}</p>
              </div>
            </div>

            {/* Dedicated Page Callout Banner */}
            <div className={styles.mockTestBridge}>
              <div className={styles.bridgeContent}>
                <div className={styles.bridgeIconWrap}>
                  <span className="material-symbols-outlined">timer</span>
                </div>
                <div>
                  <h3 className={styles.bridgeTitle}>Solve Full Mock Tests &amp; 209+ Previous Year Papers</h3>
                  <p className={styles.bridgeDesc}>
                    Practice timed questions, full mock exams, and download official MPSC Question Papers (2021–2026) with final commission answer keys on our dedicated portals.
                  </p>
                </div>
              </div>
              <div className={styles.bridgeActions}>
                <Link href="/mpsc-pyq" className={styles.btnBridgePrimary}>
                  <span>Start Dedicated MPSC Mock Test</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link href="/question-papers" className={styles.btnBridgeSecondary}>
                  <span>Browse All Question Papers &amp; Keys</span>
                  <span className="material-symbols-outlined">description</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Optional Subjects */}
          {optSubs.length > 0 && (
            <>
              <div id="optional" className={styles.sectionTitle}>
                📚 Optional Subjects
                <span className={styles.sectionCount}>{optSubs.length} subjects</span>
              </div>
              <div className={styles.optGrid}>
                {optSubs.map((s, i) => (
                  <div key={i} className={styles.optCard}>
                    <div className={styles.optNum}>{i + 1}</div>
                    <div>
                      <div className={styles.optName}>{s.name}</div>
                      {s.nameMr && <div className={styles.optNameMr}>{s.nameMr}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Qualifying Papers */}
          {qualPaperNames.length > 0 && (
            <>
              <div id="qualifying" className={styles.sectionTitle}>✅ Qualifying Papers</div>
              <div className={styles.qualRow}>
                {qualPaperNames.map((qp, i) => (
                  <div key={i} className={styles.qualPill}>{qp}</div>
                ))}
              </div>
            </>
          )}

          {/* Notes */}
          {notes.length > 0 && (
            <>
              <div id="notes" className={styles.sectionTitle}>📌 Important Notes</div>
              <div className={styles.notesList}>
                {notes.map((n, i) => (
                  <div key={i} className={styles.noteItem}>{n}</div>
                ))}
              </div>
            </>
          )}

          {/* ── 🔗 Interconnected Ecosystem Section ── */}
          <section id="ecosystem" className={styles.ecosystemSection}>
            <h2 className={styles.ecosystemTitle}>Explore ExamUdaan Ecosystem for this Exam</h2>
            <p className={styles.ecosystemSubtitle}>
              Connect with question papers, recruitment notifications, admit cards, and results for complete preparation.
            </p>
            <div className={styles.ecosystemGrid}>
              <Link href="/mpsc-pyq" className={styles.ecosystemCard}>
                <div className={styles.ecosystemCardIcon}>
                  <span className="material-symbols-outlined">description</span>
                </div>
                <h3 className={styles.ecosystemCardTitle}>MPSC PYQ Archive (209 Papers)</h3>
                <p className={styles.ecosystemCardDesc}>
                  Authentic State Services, Combined Group B &amp; C question papers with final official keys.
                </p>
                <span className={styles.ecosystemCardCta}>Open Papers Archive →</span>
              </Link>

              <Link href="/jobs" className={styles.ecosystemCard}>
                <div className={styles.ecosystemCardIcon}>
                  <span className="material-symbols-outlined">work</span>
                </div>
                <h3 className={styles.ecosystemCardTitle}>Live Government Jobs</h3>
                <p className={styles.ecosystemCardDesc}>
                  Current Maharashtra government and Central notifications with eligibility, age &amp; deadlines.
                </p>
                <span className={styles.ecosystemCardCta}>Browse Vacancies →</span>
              </Link>

              <Link href="/admit-cards" className={styles.ecosystemCard}>
                <div className={styles.ecosystemCardIcon}>
                  <span className="material-symbols-outlined">confirmation_number</span>
                </div>
                <h3 className={styles.ecosystemCardTitle}>Hall Tickets &amp; Dates</h3>
                <p className={styles.ecosystemCardDesc}>
                  Download hall tickets, exam schedules and venue guidelines directly from official sources.
                </p>
                <span className={styles.ecosystemCardCta}>Check Admit Cards →</span>
              </Link>

              <Link href="/results" className={styles.ecosystemCard}>
                <div className={styles.ecosystemCardIcon}>
                  <span className="material-symbols-outlined">emoji_events</span>
                </div>
                <h3 className={styles.ecosystemCardTitle}>Cut-Offs &amp; Results</h3>
                <p className={styles.ecosystemCardDesc}>
                  Final selection lists, cut-off marks analysis and category-wise merit ranks for all cadres.
                </p>
                <span className={styles.ecosystemCardCta}>View Final Results →</span>
              </Link>
            </div>
          </section>

          {/* ── 💬 Aspirant Feedback Desk ── */}
          <section id="feedback" className={styles.feedbackSection}>
            <h2 className={styles.feedbackTitle}>Was this syllabus breakdown helpful?</h2>
            <p className={styles.feedbackDesc}>
              Help us improve ExamUdaan. Report errors, request additional practice topics, or suggest new exam portals.
            </p>
            <div className={styles.feedbackActionRow}>
              <button
                type="button"
                className={`${styles.feedbackBtnThumbs} ${feedbackVote === 'yes' ? styles.feedbackBtnThumbsActive : ''}`}
                onClick={() => handleFeedback('yes')}
              >
                <span>👍 Yes, very helpful!</span>
              </button>
              <button
                type="button"
                className={`${styles.feedbackBtnThumbs} ${feedbackVote === 'no' ? styles.feedbackBtnThumbsActive : ''}`}
                onClick={() => handleFeedback('no')}
              >
                <span>👎 Needs improvement</span>
              </button>
              <Link
                href={`/feedback?category=data_correction&ref=mpsc-syllabus-${id}&subject=Syllabus+Update+Request`}
                className={styles.feedbackLinkDesk}
              >
                <span>Suggest Corrections / Feedback Desk →</span>
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
