// ============================================================
// app/career/CareerExplorerClient.js — Interactive Stream & Career Guide
// ExamUdaan.in — In-depth educational pathways for 10th & 12th students
// ============================================================
'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import styles from './career.module.css'
import { STREAMS, CAREER_PATHS } from '@/lib/careerGuideData'

export default function CareerExplorerClient() {
  const [selectedStreamId, setSelectedStreamId] = useState('science')
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDossier, setActiveDossier] = useState(null) // Active career for deep-dive modal

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeDossier) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [activeDossier])

  // Get active stream metadata
  const currentStream = useMemo(() => {
    return STREAMS.find(s => s.id === selectedStreamId) || STREAMS[0]
  }, [selectedStreamId])

  // When stream changes, reset category filter to 'all'
  const handleStreamChange = (streamId) => {
    setSelectedStreamId(streamId)
    setSelectedCategoryId('all')
  }

  // Filter careers by stream, category, and search query
  const filteredCareers = useMemo(() => {
    return CAREER_PATHS.filter(career => {
      // If user typed a search query, search globally across all streams
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = career.title.toLowerCase().includes(q)
        const matchesRole = career.role.toLowerCase().includes(q)
        const matchesSubj = career.keySubjectsToScore.some(s => s.subject.toLowerCase().includes(q))
        const matchesExam = career.entranceExams.some(e => e.name.toLowerCase().includes(q))
        const matchesColleges = career.topColleges.some(c => c.name.toLowerCase().includes(q))
        return matchesTitle || matchesRole || matchesSubj || matchesExam || matchesColleges
      }

      // Otherwise filter strictly by selected stream
      if (career.streamId !== selectedStreamId) return false

      // Filter by category if not 'all'
      if (selectedCategoryId !== 'all' && career.categoryId !== selectedCategoryId) {
        return false
      }

      return true
    })
  }, [selectedStreamId, selectedCategoryId, searchQuery])

  return (
    <div className={styles.page}>
      {/* ── Breadcrumb ── */}
      <div className={`container ${styles.breadcrumbContainer}`}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Career Decision Guide</span>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroLabel}>
              🎓 Complete 10th & 12th Career Decision Engine
            </span>
            <h1 className={styles.heroTitle}>
              What Next After 10th & 12th? Stream & Career Compass 2026
            </h1>
            <p className={styles.heroDesc}>
              Confused between <strong>Science, Commerce, and Arts</strong>? Explore in-depth educational roadmaps,
              realistic salary ladders, key entrance exams, critical subjects you must score in, and future AI demand for every professional field.
            </p>

            {/* Global Search Bar */}
            <div className={styles.searchWrapper}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search any career e.g. Doctor, Mechanical Engineer, CA, Pilot, Judge, Teacher, BCA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* ── Stream Selector ── */}
            <div className={styles.streamSelector}>
              {STREAMS.map(stream => {
                const isActive = stream.id === selectedStreamId && !searchQuery.trim()
                return (
                  <button
                    key={stream.id}
                    type="button"
                    className={`${styles.streamTab} ${isActive ? styles.streamTabActive : ''}`}
                    onClick={() => {
                      setSearchQuery('')
                      handleStreamChange(stream.id)
                    }}
                  >
                    <div className={styles.streamIconRow}>
                      <span className={styles.streamIcon}>{stream.icon}</span>
                      <span className={styles.streamBadge} style={{ background: stream.badgeBg, color: stream.color }} /* stream-dynamic-colors */>
                        {stream.shortName}
                      </span>
                    </div>
                    <div className={styles.streamName}>{stream.shortName} Stream</div>
                    <div className={styles.streamSub}>{stream.tagline.split(',')[0]} & more</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Area ── */}
      <main className={`container ${styles.mainContent}`}>
        {/* If no search query, show current Stream Banner & Subject Combinations */}
        {!searchQuery.trim() && (
          <div className={styles.streamBanner}>
            <div className={styles.streamBannerTitle}>
              <span className={styles.streamBannerIcon}>{currentStream.icon}</span>
              <div>
                <strong>{currentStream.name}</strong>
                <p className={styles.streamEligibility}>
                  {currentStream.eligibility10th}
                </p>
              </div>
            </div>

            <div className={styles.combinationsGrid}>
              {currentStream.combinations.map(comb => (
                <div key={comb.code} className={styles.combCard}>
                  <div className={styles.combCode}>{comb.code}</div>
                  <div className={styles.combSubjs}>{comb.subjects}</div>
                  <div className={styles.combBestFor}><strong>Best For: </strong>{comb.bestFor}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Domain / Category Filter Bar ── */}
        {!searchQuery.trim() && (
          <div className={styles.categoryBar}>
            <button
              type="button"
              className={`${styles.catBtn} ${selectedCategoryId === 'all' ? styles.catBtnActive : ''}`}
              onClick={() => setSelectedCategoryId('all')}
            >
              🌟 All {currentStream.shortName} Pathways ({CAREER_PATHS.filter(c => c.streamId === selectedStreamId).length})
            </button>
            {currentStream.categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.catBtn} ${selectedCategoryId === cat.id ? styles.catBtnActive : ''}`}
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search Results indicator */}
        {searchQuery.trim() && (
          <div className={styles.searchResultsHeader}>
            <span className={styles.searchResultsCount}>
              Showing {filteredCareers.length} career options matching &quot;<strong>{searchQuery}</strong>&quot;
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className={styles.clearSearchBtn}
            >
              Clear Search ✕
            </button>
          </div>
        )}

        {/* ── Career Cards Grid ── */}
        {filteredCareers.length === 0 ? (
          <div className={styles.noResultsBox}>
            <span className={`material-symbols-outlined ${styles.noResultsIcon}`}>
              search_off
            </span>
            <h3 className={styles.noResultsTitle}>
              No specific career found for &quot;{searchQuery}&quot;
            </h3>
            <p className={styles.noResultsText}>
              Try searching with broader terms like &quot;Engineer&quot;, &quot;Doctor&quot;, &quot;Teacher&quot;, &quot;Law&quot;, or &quot;Pilot&quot;.
            </p>
            <button className="btn-primary" onClick={() => setSearchQuery('')}>
              Reset Search & Browse Streams
            </button>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {filteredCareers.map(career => {
              const streamMeta = STREAMS.find(s => s.id === career.streamId)
              return (
                <div key={career.id} className={styles.careerCard}>
                  <div>
                    {/* Header */}
                    <div className={styles.cardHeader}>
                      <div>
                        <span className={styles.badgeCategory}>
                          {streamMeta?.icon} {streamMeta?.shortName}
                        </span>
                        <h2 className={styles.cardTitle}>
                          {career.title}
                        </h2>
                        <p className={styles.cardRole}>{career.role}</p>
                      </div>
                    </div>

                    {/* Salary Snapshot */}
                    <div className={styles.cardSalaryBanner}>
                      <div className={styles.salaryEntry}>
                        <span>Entry Fresher:</span>
                        <strong>{career.salaryLadder.entry.split('(')[0]}</strong>
                      </div>
                      <div className={`${styles.salaryEntry} ${styles.salaryEntryRight}`}>
                        <span>Senior Potential:</span>
                        <strong className={styles.salaryHighlight}>{career.salaryLadder.senior.split('(')[0]}</strong>
                      </div>
                    </div>

                    {/* Crucial Subjects & Entrance */}
                    <div className={styles.cardMetaBlock}>
                      <div className={styles.cardMetaRow}>
                        <span className={`material-symbols-outlined ${styles.cardMetaIcon}`}>grade</span>
                        <div>
                          <span className={styles.cardMetaLabel}>Must Score In 10th / 12th:</span>
                          <span className={styles.examName}>
                            {career.keySubjectsToScore.map(s => `${s.subject} (${s.minScore})`).join(' • ')}
                          </span>
                        </div>
                      </div>

                      <div className={styles.cardMetaRow}>
                        <span className={`material-symbols-outlined ${styles.cardMetaIcon}`}>quiz</span>
                        <div>
                          <span className={styles.cardMetaLabel}>Key Entrance Exams:</span>
                          <span className={styles.examDate}>
                            {career.entranceExams.map(e => e.name).slice(0, 3).join(', ')}
                          </span>
                        </div>
                      </div>

                      <div className={styles.cardMetaRow}>
                        <span className={`material-symbols-outlined ${styles.cardMetaIcon}`}>trending_up</span>
                        <div>
                          <span className={styles.cardMetaLabel}>Future Scope:</span>
                          <span className={styles.examVacancy}>
                            {career.scopeAndFuture.rating} • {career.scopeAndFuture.aiImpact.split(':')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className={styles.cardButtonGrid}>
                    <button
                      type="button"
                      className={`${styles.btnExplore} ${styles.cardBtnNoMargin}`}
                      onClick={() => setActiveDossier(career)}
                      title="Quick Dossier Preview"
                    >
                      <span>Quick View</span>
                      <span className={`material-symbols-outlined ${styles.btnIcon}`}>visibility</span>
                    </button>

                    <Link
                      href={`/career/${career.id}`}
                      className="btn-outline"
                      className={styles.cardFullPageBtn}
                      title="Open Dedicated Full Page with Complete Syllabus"
                    >
                      <span>Full Page</span>
                      <span className={`material-symbols-outlined ${styles.btnIconSm}`}>open_in_new</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Stream Decision Matrix & Comparison Table ── */}
        <section className={styles.sectionSpacingLg}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>
              Strategic Comparison
            </span>
            <h2 className={styles.sectionTitle}>
              Side-by-Side Stream Comparison: Science vs Commerce vs Arts
            </h2>
            <p className={styles.sectionDesc}>
              Benchmark degree duration, study intensity, education cost, and long-term career adaptability.
            </p>
          </div>

          <div className={styles.compTableWrap}>
            <table className={styles.compTable}>
              <thead>
                <tr>
                  <th>Parameters</th>
                  <th>🔬 Science Stream</th>
                  <th>💼 Commerce Stream</th>
                  <th>🎨 Arts & Humanities</th>
                  <th>⚙️ Polytechnic / ITI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Underlying Aptitude</strong></td>
                  <td>Strong numerical, analytical, and spatial reasoning</td>
                  <td>Business curiosity, commercial numbers, economics logic</td>
                  <td>Critical thinking, verbal eloquence, social empathy</td>
                  <td>Hands-on mechanical, electrical & technical craft</td>
                </tr>
                <tr>
                  <td><strong>Core Gateway Exams</strong></td>
                  <td>JEE Main/Adv, NEET-UG, MHT-CET, BITSAT</td>
                  <td>CA Foundation, IIM IPMAT, CAT, CFA Level 1</td>
                  <td>CLAT (Law), CUET-UG, NID, NIFT, UPSC/MPSC</td>
                  <td>DTE Direct Merit (No entrance exam needed)</td>
                </tr>
                <tr>
                  <td><strong>Degree Duration</strong></td>
                  <td>4 to 5.5 Years (B.Tech / MBBS / B.Arch)</td>
                  <td>3 to 5 Years (B.Com / CA / IPMAT / BBA)</td>
                  <td>3 to 5 Years (BA / 5-Yr BA LLB / BMM)</td>
                  <td>2 to 3 Years (Diploma / Direct 2nd Yr B.Tech)</td>
                </tr>
                <tr>
                  <td><strong>Average Fresher Salary</strong></td>
                  <td>₹6 Lakhs – ₹18 Lakhs / year</td>
                  <td>₹5 Lakhs – ₹14 Lakhs / year</td>
                  <td>₹4 Lakhs – ₹12 Lakhs / year</td>
                  <td>₹3 Lakhs – ₹6 Lakhs / year</td>
                </tr>
                <tr>
                  <td><strong>Peak Earning Ceiling</strong></td>
                  <td>₹80L – ₹2 Cr+ (Surgeons, US Tech Staff, Pilots)</td>
                  <td>₹75L – ₹2.5 Cr+ (Big 4 Partners, CFOs, IB)</td>
                  <td>₹60L – ₹2 Cr+ (Senior Advocates, Judges, Top PR)</td>
                  <td>₹25L – ₹50 Lakhs (Plant Heads, PWD Engineers)</td>
                </tr>
                <tr>
                  <td><strong>AI Automation Risk</strong></td>
                  <td>Low (Clinical decisions, physical hardware, complex algorithms)</td>
                  <td>Medium-Low (Strategic finance, forensic audits, M&A)</td>
                  <td>Very Low (Court litigation, psychology, public governance)</td>
                  <td>Extremely Low (Physical repair, field construction, manufacturing)</td>
                </tr>
                <tr>
                  <td><strong>Stream Switch Flexibility</strong></td>
                  <td>Can switch to Commerce or Arts after 12th!</td>
                  <td>Can switch to Arts or Law; cannot switch to Science</td>
                  <td>Cannot switch to Science or Commerce after 12th</td>
                  <td>Direct Lateral Entry to 2nd Year B.Tech Engineering</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Visual Technical Ladder: ITI -> Diploma -> Degree ── */}
        <section className={styles.techLadderSection}>
          <div className={styles.techLadderHeader}>
            <div>
              <span className={styles.techLadderBadge}>
                ⭐ High-ROI Alternative Technical Route
              </span>
              <h2 className={styles.techLadderTitle}>
                The 10th Technical Ladder: ITI → Polytechnic Diploma → B.Tech Degree
              </h2>
              <p className={styles.techLadderSubtitle}>
                Don&apos;t want to face the extreme stress of JEE Main or MHT-CET coaching? You can earn a full <strong>B.Tech / B.E. Engineering Degree</strong> starting right after Class 10th through progressive lateral entry!
              </p>
            </div>
            <Link
              href="/career/iti-diploma-degree-lateral-pathway"
              className="btn-primary"
              className={`btn-primary ${styles.techLadderBtn}`}
            >
              View Full Ladder Dossier →
            </Link>
          </div>

          <div className={styles.ladderStepsGrid}>
            <div className={styles.ladderStepCard}>
              <div className={styles.ladderStepHeader}>
                <span className={styles.ladderStepNum}>1</span>
                <strong className={styles.ladderStepTitle}>Class 10th → 2-Yr ITI Trade</strong>
              </div>
              <p className={styles.ladderStepDesc}>
                Direct merit admission on DVET portal. Learn practical trades: Electrician, Fitter, Machinist, Wireman.
              </p>
              <div className={styles.jobExitBadge}>
                ⚡ Job Exit: Railway ALP, PSU Technician (₹3.5L – ₹6L)
              </div>
            </div>

            <div className={styles.ladderStepCard}>
              <div className={styles.ladderStepHeader}>
                <span className={styles.ladderStepNum}>2</span>
                <strong className={styles.ladderStepTitle}>Post-ITI Lateral Diploma</strong>
              </div>
              <p className={styles.ladderStepDesc}>
                Direct admission into <strong>2nd Year of Polytechnic Diploma</strong> (skips 1st year). Complete 3-year diploma in just 2 years!
              </p>
              <div className={styles.jobExitBadge + " " + styles.jobExitBadgeBlue}>
                ⚡ Job Exit: PWD, SSC JE, RRB Junior Engineer (₹5L – ₹9L)
              </div>
            </div>

            <div className={styles.ladderStepCard}>
              <div className={styles.ladderStepHeader}>
                <span className={styles.ladderStepNum}>3</span>
                <strong className={styles.ladderStepTitle}>DSE B.Tech Engineering Degree</strong>
              </div>
              <p className={styles.ladderStepDesc}>
                Direct Second Year (DSE) into 4-year B.Tech at <strong>COEP, VJTI, SPCE</strong> without taking JEE Main or MHT-CET!
              </p>
              <div className={styles.jobExitBadge + " " + styles.jobExitBadgePurple}>
                ⚡ Graduate as B.Tech Engineer: MPSC MES, Core MNCs (₹8L – ₹35L+)
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQs for 10th & 12th Students ── */}
        <section className={styles.faqSection}>
          <h2 className={styles.faqTitle}>
            ❓ Frequently Asked Career Questions by Maharashtra Students
          </h2>
          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                How does the ITI to Polytechnic Diploma to B.Tech Degree ladder work?
              </summary>
              <p className={styles.faqAnswer}>
                In Maharashtra, the technical education directorate (DTE & DVET) offers a completely integrated progression:
                <br />
                <strong>1. Class 10th Pass</strong> → Join a 2-Year ITI trade (Electrician, Fitter, Machinist) via DVET portal.
                <br />
                <strong>2. Post-ITI Lateral Entry</strong> → ITI pass students receive <strong>Direct Admission into the 2nd Year</strong> of a 3-Year Polytechnic Diploma (saving 1 year).
                <br />
                <strong>3. Direct Second Year (DSE) B.Tech</strong> → With 80%+ marks in the final year of diploma, students receive <strong>Direct 2nd-Year Admission into 4-Year B.Tech / B.E. Degree</strong> at premier colleges (COEP Pune, VJTI Mumbai, SPPU) with 10% supernumerary seats, completely bypassing JEE Main and MHT-CET!
                <br />
                Students graduate with <strong>triple credentials: NCVT ITI + MSBTE Diploma + University B.Tech Degree</strong>, making them the most practically skilled engineers in India.
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                Which is better after 10th: 11th–12th Science or Polytechnic Diploma?
              </summary>
              <p className={styles.faqAnswer}>
                • <strong>Choose 11th & 12th Science</strong> if you wish to pursue <strong>Medical (MBBS, BDS, BAMS), Commercial Pilot, Pure Science (ISRO), or standard JEE Main/Advanced</strong>.
                <br />
                • <strong>Choose Polytechnic Diploma</strong> if your sole focus is <strong>Engineering</strong>. You avoid massive coaching fees, study core technical subjects from day one, and enter B.Tech via DSE based on continuous diploma semester marks instead of a single high-stress 3-hour entrance exam!
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                Can a Science student switch to Commerce or Arts after 12th?
              </summary>
              <p className={styles.faqAnswer}>
                <strong>Yes, absolutely.</strong> A student who completes 12th Science has universal eligibility: you can pursue CA (Chartered Accountancy), 5-Year Law (CLAT), BBA/BMS, Mass Media, or Civil Services. However, an Arts or Commerce student cannot pursue B.Tech Engineering, MBBS, or Commercial Pilot courses without 12th Science PCM/PCB.
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                Is Mathematics compulsory in 11th & 12th for high-paying careers?
              </summary>
              <p className={styles.faqAnswer}>
                Mathematics opens the widest doors (B.Tech Engineering, Computer Science, Data Science, Commercial Pilot, Investment Banking, Actuarial Science). However, lucrative careers without Mathematics include <strong>MBBS Doctor, Dental (BDS), 5-Year Corporate Law (CLAT), Clinical Psychology, UPSC / MPSC Civil Services, and Fashion Design (NIFT)</strong>.
              </p>
            </details>
          </div>
        </section>

        {/* ── Career Guidance Advisory & Due Diligence Box with * Conditions ── */}
        <section className={styles.advisoryBox} aria-label="Career Guidance Advisory">
          <div className={styles.advisoryHeader}>
            <span className={`material-symbols-outlined ${styles.advisoryIcon}`}>gavel</span>
            <h3>* Career Decision Advisory & Mandatory Due Diligence Notice</h3>
          </div>
          <p className={styles.advisoryText}>
            Students, aspirants, and parents are advised to review the following conditions before finalizing any stream, coaching admission, or degree program:
          </p>
          <ul className={styles.advisoryList}>
            <li>
              <strong>* Condition 1 (AI-Assisted Educational Intelligence):</strong> Career roadmaps, syllabus portions, college cutoffs, and future AI demand indices displayed on ExamUdaan are synthesized using AI models from public university curriculums, recruitment surveys, and past examination trends for informational guidance.
            </li>
            <li>
              <strong>* Condition 2 (Compensation & Package Disparities):</strong> All salary figures (entry-level, mid-level, and peak earning ceilings) are estimated market approximations. Actual packages depend strictly on individual skill, university accreditation, economic cycles, location, and recruiter hiring standards.
            </li>
            <li>
              <strong>* Condition 3 (Statutory Due Diligence Required):</strong> Admission eligibility criteria, reservation percentages, seat intake, and entrance exam patterns (NEET, JEE, CLAT, CAT, MHT-CET) are governed solely by statutory regulatory authorities (UGC, AICTE, NMC, BCI, DTE Maharashtra). Candidates must independently cross-verify all details directly with official university portals and government directorates before taking career or financial decisions.
            </li>
          </ul>
        </section>
      </main>

      {/* ── In-Depth Career Dossier Modal ── */}
      {activeDossier && (
        <div className={styles.modalBackdrop} onClick={() => setActiveDossier(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.badgeCategory}>
                  {STREAMS.find(s => s.id === activeDossier.streamId)?.icon} {STREAMS.find(s => s.id === activeDossier.streamId)?.shortName}
                </span>
                <h2 className={styles.modalTitle}>{activeDossier.title}</h2>
                <p className={styles.modalRole}>{activeDossier.role}</p>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setActiveDossier(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              {/* Minimum 12th Stream */}
              <div className={styles.eligibilityBox}>
                <span className={`material-symbols-outlined ${styles.iconOrange}`}>verified</span>
                <span className={styles.eligibilityText}>
                  <strong>Eligibility Requirement: </strong>{activeDossier.min12thStream}
                </span>
              </div>

              {/* Dedicated Page Link Banner */}
              <div className={styles.fullPageBanner}>
                <span className={styles.fullPageBannerText}>
                  💡 Prefer a full printable roadmap with official syllabus breakdown?
                </span>
                <Link
                  href={`/career/${activeDossier.id}`}
                  className="btn-primary"
                  className={`btn-primary ${styles.fullPageBannerBtn}`}
                >
                  Open Dedicated Page ↗
                </Link>
              </div>

              {/* 1. Key Subjects to Score in */}
              <div className={styles.dossierSection}>
                <h3 className={styles.dossierHeading}>
                  <span className={`material-symbols-outlined ${styles.iconOrange}`}>grade</span>
                  🎯 Key Subjects to Score in (10th / 12th Focus & Cutoffs)
                </h3>
                <div className={styles.subjectGrid}>
                  {activeDossier.keySubjectsToScore.map((subj, idx) => (
                    <div key={idx} className={styles.subjectCard}>
                      <div className={styles.subjectHeader}>
                        <span className={styles.subjectName}>{subj.subject}</span>
                        <span className={styles.subjectScore}>Target {subj.minScore}</span>
                      </div>
                      <p className={styles.subjectReason}>{subj.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Gateway Entrance Exams */}
              <div className={styles.dossierSection}>
                <h3 className={styles.dossierHeading}>
                  <span className={`material-symbols-outlined ${styles.iconBlue}`}>quiz</span>
                  📝 Gateway Entrance Exams (National & Maharashtra)
                </h3>
                <div className={styles.tableScrollWrapper}>
                  <table className={styles.examTable}>
                    <thead>
                      <tr>
                        <th>Exam Name</th>
                        <th>Conducting Body</th>
                        <th>Level</th>
                        <th>Exam Mode</th>
                        <th>Official Portal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeDossier.entranceExams.map((exam, idx) => (
                        <tr key={idx}>
                          <td><strong>{exam.name}</strong></td>
                          <td>{exam.body}</td>
                          <td>{exam.level}</td>
                          <td>{exam.mode}</td>
                          <td>
                            <a
                              href={exam.website}
                              target="_blank" rel="noopener noreferrer"
                              rel="noopener noreferrer"
                              className={styles.examTableLink}
                            >
                              Visit Official Site ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Annual Application & Exam Cycle */}
                {activeDossier.examDatesAndCycles && (
                  <div className={styles.examCycleBox}>
                    <span className={`material-symbols-outlined ${styles.iconAmber}`}>calendar_month</span>
                    <div className={styles.examCycleText}>
                      <strong>Annual Application & Exam Cycle: </strong>{activeDossier.examDatesAndCycles}
                    </div>
                  </div>
                )}
              </div>

              {/* 2.5 Detailed Syllabus Portion & Exam Pattern */}
              {(activeDossier.portionAndSyllabus || activeDossier.examPatternSummary) && (
                <div className={styles.dossierSection}>
                  <h3 className={styles.dossierHeading}>
                    <span className={`material-symbols-outlined ${styles.iconPink}`}>menu_book</span>
                    📖 Syllabus Portion & Exam Pattern Breakdown
                  </h3>
                  {activeDossier.examPatternSummary && (
                    <div className={styles.syllabusPatternBox}>
                      <strong>Pattern & Marking Scheme: </strong>{activeDossier.examPatternSummary}
                    </div>
                  )}
                  {activeDossier.portionAndSyllabus && (
                    <ul className={styles.syllabusPortionList}>
                      {activeDossier.portionAndSyllabus.map((p, idx) => (
                        <li key={idx} className={styles.syllabusLi}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* 3. Realistic Salary Ladder */}
              <div className={styles.dossierSection}>
                <h3 className={styles.dossierHeading}>
                  <span className={`material-symbols-outlined ${styles.iconGreen}`}>payments</span>
                  💰 Realistic Salary Ladder (2026 – 2030 Updated)
                </h3>
                <div className={styles.salaryLadderGrid}>
                  <div className={styles.ladderPill} data-level="entry">
                    <div className={styles.ladderLevel}>🟢 Entry-Level (0–2 Yrs)</div>
                    <div className={styles.ladderAmount}>{activeDossier.salaryLadder.entry}</div>
                    <div className={styles.ladderNote}>Fresher graduate package</div>
                  </div>
                  <div className={styles.ladderPill} data-level="mid">
                    <div className={styles.ladderLevel}>🟡 Mid-Level (3–7 Yrs)</div>
                    <div className={styles.ladderAmount}>{activeDossier.salaryLadder.mid}</div>
                    <div className={styles.ladderNoteBlue}>Experienced specialist</div>
                  </div>
                  <div className={styles.ladderPill} data-level="senior">
                    <div className={styles.ladderLevel}>🔴 Senior / Partner (8+ Yrs)</div>
                    <div className={styles.ladderAmount}>{activeDossier.salaryLadder.senior}</div>
                    <div className={styles.ladderNoteRed}>Leadership / Equity / Private Practice</div>
                  </div>
                </div>
                <div className={styles.salaryNiche}>
                  <strong>Highest Paying Niches: </strong>{activeDossier.salaryLadder.highestPaying}
                </div>
              </div>

              {/* 4. Future Scope & AI Impact */}
              <div className={styles.dossierSection}>
                <h3 className={styles.dossierHeading}>
                  <span className={`material-symbols-outlined ${styles.iconPurple}`}>psychology</span>
                  🚀 Future Scope & AI Impact (2026–2035)
                </h3>
                <p className={styles.scopeSummary}>
                  {activeDossier.scopeAndFuture.summary}
                </p>
                <div className={styles.aiImpactGrid}>
                  <div className={styles.aiImpactCard}>
                    <strong className={styles.aiImpactLabel}>AI Automation Vulnerability:</strong>
                    <p className={styles.aiImpactValue}>
                      {activeDossier.scopeAndFuture.aiImpact}
                    </p>
                  </div>
                  <div className={styles.growthCard}>
                    <strong className={styles.growthLabel}>High-Growth Niches:</strong>
                    <p className={styles.growthValue}>
                      {activeDossier.scopeAndFuture.growthSectors.join(' • ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5. Required Tech Stack & Skills */}
              <div className={styles.dossierSection}>
                <h3 className={styles.dossierHeading}>
                  <span className={`material-symbols-outlined ${styles.iconAmberDark}`}>terminal</span>
                  💻 Required Tech Stack, Software & Core Skills
                </h3>
                <ul className={styles.skillsList}>
                  {activeDossier.techStackAndSkills.map((skill, idx) => (
                    <li key={idx} className={styles.skillsLi}>{skill}</li>
                  ))}
                </ul>
              </div>

              {/* 6. Step-by-Step Educational Journey */}
              <div className={styles.dossierSection}>
                <h3 className={styles.dossierHeading}>
                  <span className={`material-symbols-outlined ${styles.iconOrange}`}>route</span>
                  🗺️ Step-by-Step Educational Journey (10th to Career)
                </h3>
                <div className={styles.roadmapList}>
                  {activeDossier.stepByStepRoadmap.map((step, idx) => (
                    <div key={idx} className={styles.roadmapItem}>
                      <span className={styles.roadmapNum}>{idx + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Top Colleges in Maharashtra & India */}
              <div className={styles.dossierSection}>
                <h3 className={styles.dossierHeading}>
                  <span className={`material-symbols-outlined ${styles.iconBlue}`}>school</span>
                  🏛️ Top Colleges in Maharashtra & Across India
                </h3>
                <div className={styles.collegesGrid}>
                  {activeDossier.topColleges.map((col, idx) => (
                    <div key={idx} className={styles.collegeCard}>
                      <strong className={styles.collegeName}>{col.name}</strong>
                      <span className={styles.collegeMeta}>{col.location} • {col.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. Official External Websites to Explore */}
              <div className={styles.dossierSection}>
                <h3 className={styles.dossierHeading}>
                  <span className={`material-symbols-outlined ${styles.iconGreen}`}>link</span>
                  🌐 Official External Portals to Explore (Verified URLs)
                </h3>
                <div className={styles.extLinksGrid}>
                  {activeDossier.externalWebsites.map((site, idx) => (
                    <a
                      key={idx}
                      href={site.url}
                      target="_blank" rel="noopener noreferrer"
                      rel="noopener noreferrer"
                      className={styles.extLinkCard}
                    >
                      <div className={styles.extLinkTitle}>
                        <span>{site.title}</span>
                        <span className={`material-symbols-outlined ${styles.btnIcon}`}>open_in_new</span>
                      </div>
                      <div className={styles.extLinkNote}>{site.note}</div>
                    </a>
                  ))}
                </div>
              </div>

              {/* 9. ExamUdaan Synergy Box */}
              <div className={styles.synergyCard}>
                <div className={styles.synergyText}>
                  <strong>🏛️ Related Government Job Opportunities in this Field</strong>
                  <p>{activeDossier.govtExamSynergy.jobs}</p>
                </div>
                <div className={styles.synergyBtns}>
                  <Link
                    href={`/career/${activeDossier.id}`}
                    className="btn-primary"
                    className={`btn-primary ${styles.synergyBtnDark}`}
                  >
                    Open Full Dedicated Page ↗
                  </Link>
                  <Link
                    href={activeDossier.govtExamSynergy.examUdaanLink}
                    className="btn-primary"
                    className={`btn-primary ${styles.synergyBtnPrimary}`}
                  >
                    View Govt Jobs →
                  </Link>
                  <Link
                    href={activeDossier.govtExamSynergy.mockTestLink}
                    className="btn-outline"
                    className={`btn-outline ${styles.synergyBtnOutline}`}
                  >
                    Free Mock Tests
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
