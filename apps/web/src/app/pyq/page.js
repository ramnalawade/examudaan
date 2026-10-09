// ============================================================
// app/pyq/page.js — 15-Year Topic-wise Searchable PYQ Bank
// ExamUdaan.in — Database-backed API search across MPSC, TCS Talathi & Police PYQs
// Design: Warm Ivory (#FFFBF5), Deep Saffron (#EA580C), Outfit & Inter typography
// ============================================================
'use client'

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './pyq.module.css'

const SUBJECT_FILTERS = [
  'All',
  'Polity',
  'Geography',
  'History',
  'Economy',
  'Science',
  'Marathi',
  'Reasoning',
  'Law'
]

const SUBJECT_ICONS = {
  All: '🌟',
  Polity: '🏛️',
  Geography: '🗺️',
  History: '📜',
  Economy: '📈',
  Science: '🔬',
  Marathi: '📖',
  Reasoning: '🧩',
  Law: '⚖️'
}

const TRENDING_TOPICS = [
  '73rd Amendment',
  'RTI Act 2005',
  'महाराष्ट्र लोकसेवा हक्क कायदा',
  'समास',
  'नवीन कर्मणी',
  'समानार्थी शब्द',
  'Koyna Dam',
  'सत्यशोधक समाज',
  'Repo Rate',
  'Blood Groups',
  'Mahad Satyagraha'
]

function PyqSearchInner() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams ? searchParams.get('q') || '' : ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeSubject, setActiveSubject] = useState('All')
  const [questions, setQuestions] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [subjectCounts, setSubjectCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [revealedSolutions, setRevealedSolutions] = useState({})

  const debounceTimerRef = useRef(null)
  const PAGE_LIMIT = 50

  // Fetch questions from database via API
  const fetchPyqs = useCallback(async (qStr, subjectStr, currentOffset = 0, isAppend = false) => {
    try {
      if (isAppend) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const params = new URLSearchParams()
      if (qStr && qStr.trim()) params.set('q', qStr.trim())
      if (subjectStr && subjectStr !== 'All') params.set('subject', subjectStr)
      params.set('limit', String(PAGE_LIMIT))
      params.set('offset', String(currentOffset))

      const res = await fetch(`/api/pyq?${params.toString()}`)
      const json = await res.json()

      if (json.success && json.data) {
        const { questions: newQuestions, total, hasMore: moreAvailable, subjectCounts: counts } = json.data

        if (isAppend) {
          setQuestions((prev) => [...prev, ...(newQuestions || [])])
        } else {
          setQuestions(newQuestions || [])
        }

        setTotalCount(total || 0)
        setHasMore(!!moreAvailable)
        setOffset(currentOffset)
        if (counts) setSubjectCounts(counts)
      }
    } catch (err) {
      console.error('[pyq] Fetch error:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  // Sync URL search param if present
  useEffect(() => {
    if (searchParams) {
      const q = searchParams.get('q')
      if (q !== null && q !== undefined) {
        setSearchQuery(q)
        setActiveSubject('All')
      }
    }
  }, [searchParams])

  // Trigger search with debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchPyqs(searchQuery, activeSubject, 0, false)
    }, 250)

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [searchQuery, activeSubject, fetchPyqs])

  // Load more questions (next page from DB)
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return
    const nextOffset = offset + PAGE_LIMIT
    fetchPyqs(searchQuery, activeSubject, nextOffset, true)
  }

  // User interactive answer check
  const handleSelectOption = (pyqId, optKey) => {
    setSelectedAnswers((prev) => ({ ...prev, [pyqId]: optKey }))
    setRevealedSolutions((prev) => ({ ...prev, [pyqId]: true }))
  }

  // Toggle explanation
  const toggleSolution = (pyqId) => {
    setRevealedSolutions((prev) => ({ ...prev, [pyqId]: !prev[pyqId] }))
  }

  // Score statistics computed dynamically as user solves MCQs
  const scoreStats = useMemo(() => {
    let attempted = 0
    let correct = 0
    let wrong = 0
    Object.entries(selectedAnswers).forEach(([pyqId, optKey]) => {
      const q = questions.find((item) => String(item.id) === String(pyqId))
      if (q) {
        attempted++
        if (optKey === q.correct) correct++
        else wrong++
      }
    })
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0
    return { attempted, correct, wrong, accuracy }
  }, [selectedAnswers, questions])

  const handleResetScore = () => {
    setSelectedAnswers({})
    setRevealedSolutions({})
  }

  const handleToggleAllSolutions = () => {
    const hasAnyRevealed = Object.values(revealedSolutions).some(Boolean)
    if (hasAnyRevealed) {
      setRevealedSolutions({})
    } else {
      const allTrue = {}
      questions.forEach((q) => { allTrue[q.id] = true })
      setRevealedSolutions(allTrue)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                database
              </span>
              १५ वर्षांचा विषयवार प्रश्नसंच — थेट डेटाबेस शोध
            </span>
            <h1 className={styles.heroTitle}>MPSC, TCS तलाठी व पोलीस भरती सर्च करण्यायोग्य PYQ बँक</h1>
            <p className={styles.heroSubtitle}>
              कोणताही विषय किंवा कीवर्ड सर्च करा (उदा. <em>"RTI Act 2005"</em>, <em>"महाराष्ट्र लोकसेवा हक्क"</em>, <em>"समास"</em>, <em>"नवीन कर्मणी"</em>, <em>"कळसूबाई"</em>, <em>"73rd Amendment"</em>) आणि मागील १५ वर्षांत विचारलेले सर्व अधिकृत प्रश्न, अचूक उत्तरे व सविस्तर स्पष्टीकरणासह त्वरित पहा.
            </p>

            {/* Search Box Card */}
            <div className={styles.searchCard}>
              <div className={styles.searchBoxWrap}>
                <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
                <input
                  type="text"
                  placeholder="कोणताही घटक किंवा कीवर्ड टाईप करा (उदा. RTI, समास, प्रयोग, कलम ३२, Repo Rate)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    className={styles.searchClearBtn}
                    onClick={() => setSearchQuery('')}
                    title="Clear Search"
                    type="button"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                )}
              </div>

              {/* Trending Topic Chips */}
              <div className={styles.trendingRow}>
                <span className={styles.trendingLabel}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>local_fire_department</span>
                  वारंवार विचारले जाणारे घटक:
                </span>
                {TRENDING_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className={styles.trendChip}
                    onClick={() => {
                      setActiveSubject('All')
                      setSearchQuery(topic)
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interactive Score Tracker Strip */}
            {scoreStats.attempted > 0 && (
              <div className={styles.scoreTrackerStrip}>
                <div className={styles.scoreStatsRow}>
                  <span>🎯 चाचणी स्कोअर:</span>
                  <span className={`${styles.scorePill} ${styles.scorePillAttempted}`}>
                    सोडवले: {scoreStats.attempted}
                  </span>
                  <span className={`${styles.scorePill} ${styles.scorePillCorrect}`}>
                    ✓ बरोबर: {scoreStats.correct}
                  </span>
                  <span className={`${styles.scorePill} ${styles.scorePillWrong}`}>
                    ✕ चूक: {scoreStats.wrong}
                  </span>
                  <span className={`${styles.scorePill} ${styles.scorePillAccuracy}`}>
                    अचूकता: {scoreStats.accuracy}%
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetScore}
                  className={styles.scoreResetBtn}
                  title="Reset score"
                >
                  🔄 स्कोअर रीसेट करा
                </button>
              </div>
            )}

            {/* Direct Official MPSC PDF Repository Banner */}
            <div className={styles.mpscBanner}>
              <div className={styles.mpscBannerLeft}>
                <span className={styles.mpscBadge}>🏛️ 100% Official MPSC PDFs</span>
                <h3 className={styles.mpscBannerTitle}>
                  संपूर्ण MPSC प्रश्नपत्रिका व अंतिम उत्तरतालिका हव्या आहेत का?
                </h3>
                <p className={styles.mpscBannerDesc}>
                  राज्यसेवा, संयुक्त गट ब व क (PSI/STI/ASO), वनसेवा आणि नगर रचनाकार परीक्षांचे सर्व १३८ अधिकृत पेपर एकाच ओळीत वाचण्यासाठी आमचे नवीन स्टडी वर्कस्पेस वापरा.
                </p>
              </div>
              <Link href="/mpsc-pyq" className={styles.mpscBannerBtn}>
                MPSC प्रश्नपत्रिका व की उघडा (429) →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Subject Filter Tabs ── */}
        <section className={styles.filterSection}>
          <div className={styles.subjectTabs}>
            {SUBJECT_FILTERS.map((sub) => {
              const count = sub === 'All' ? subjectCounts.All : subjectCounts[sub]
              return (
                <button
                  key={sub}
                  type="button"
                  className={`${styles.subjectTab} ${activeSubject === sub ? styles.subjectTabActive : ''}`}
                  onClick={() => setActiveSubject(sub)}
                >
                  <span>{SUBJECT_ICONS[sub] || '📚'}</span>
                  <span>{sub === 'All' ? 'सर्व विषय' : sub}</span>
                  {count !== undefined && count !== null && (
                    <span className={styles.tabBadge}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Dedicated Question Library Subject Hub Links for SEO & Deep Browsing */}
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', padding: '10px 14px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px' }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>
              📚 विषयवार स्वतंत्र लायब्ररी:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { name: 'Polity', slug: 'polity' },
                { name: 'मराठी व्याकरण', slug: 'marathi' },
                { name: 'History', slug: 'history' },
                { name: 'Geography', slug: 'geography' },
                { name: 'Science', slug: 'science' },
                { name: 'Economy', slug: 'economy' },
                { name: 'Reasoning', slug: 'reasoning' },
                { name: 'Law', slug: 'law' },
              ].map(s => (
                <Link
                  key={s.slug}
                  href={`/pyq/${s.slug}`}
                  style={{ color: '#EA580C', fontWeight: 600, textDecoration: 'none', background: '#FFF7ED', padding: '3px 8px', borderRadius: '4px' }}
                >
                  {s.name} ➔
                </Link>
              ))}
              <Link
                href="/mpsc-pyq"
                style={{ color: '#EA580C', fontWeight: 700, textDecoration: 'none', background: '#FFF7ED', border: '1px solid #FED7AA', padding: '3px 10px', borderRadius: '4px' }}
              >
                📄 841 MPSC मूळ पेपर्स व की ➔
              </Link>
              <Link
                href="/mock-tests"
                style={{ color: '#047857', fontWeight: 700, textDecoration: 'none', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 10px', borderRadius: '4px' }}
              >
                ⏱️ मोफत ऑनलाईन मॉक टेस्ट्स ➔
              </Link>
            </div>
          </div>
        </section>

        {/* ── Questions List ── */}
        <section className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <h2>
              <span>{searchQuery ? `"${searchQuery}" साठी शोध निकाल` : `${activeSubject === 'All' ? 'सर्व विषय' : activeSubject} प्रश्न`}</span>
              <span className={styles.resultsCount}>
                ({loading && questions.length === 0 ? 'शोधत आहे...' : `${totalCount} प्रश्न उपलब्ध`})
              </span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {questions.length > 0 && (
                <button
                  type="button"
                  onClick={handleToggleAllSolutions}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#334155',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Toggle all explanations"
                >
                  <span>💡</span>
                  <span>{Object.values(revealedSolutions).some(Boolean) ? 'स्पष्टीकरणे लपवा' : 'सर्व उत्तरे दाखवा'}</span>
                </button>
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveSubject('All')
                  }}
                  className={styles.resetSearchBtn}
                >
                  सर्व प्रश्न पुन्हा पहा
                </button>
              )}
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && questions.length === 0 && (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner} />
              <p>अधिकृत प्रश्नसंच डेटाबेसमधून लोड होत आहे...</p>
            </div>
          )}

          {/* Cross-Subject match suggestion */}
          {!loading && questions.length === 0 && activeSubject !== 'All' && (
            <div className={styles.crossSubjectBanner}>
              <span className="material-symbols-outlined">info</span>
              <div>
                <strong>'{activeSubject}' या विषयात निकाल आढळले नाहीत.</strong>
                <p>इतर सर्व विषयांमध्ये हा कीवर्ड शोधण्यासाठी खालील बटनावर क्लिक करा.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubject('All')}
                className={styles.crossSubjectBtn}
              >
                सर्व विषयांमध्ये शोधा →
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && questions.length === 0 && activeSubject === 'All' && (
            <div className={styles.emptyState}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ea580c' }}>
                search_off
              </span>
              <h3>कोणतेही प्रश्न आढळले नाहीत</h3>
              <p>
                कृपया वेगळा कीवर्ड टाईप करा (उदा. <em>'RTI'</em>, <em>'समास'</em>, <em>'Polity'</em>, <em>'History'</em>) किंवा वरील ट्रेंडिंग घटकांवर क्लिक करा.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setSearchQuery('')
                  setActiveSubject('All')
                }}
                style={{ marginTop: '16px' }}
              >
                सर्व १५ वर्षांचे प्रश्न पहा
              </button>
            </div>
          )}

          {/* PYQ Cards */}
          <div className={styles.pyqList}>
            {questions.map((item, idx) => {
              const selectedOpt = selectedAnswers[item.id]
              const isRevealed = revealedSolutions[item.id]
              const isCorrect = selectedOpt === item.correct

              return (
                <div key={item.id} className={styles.pyqCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.badgeRow}>
                      <span className={styles.examTag}>
                        {item.exam} ({item.year})
                      </span>
                      <span className={styles.subjectTag}>{item.subject}</span>
                    </div>
                    <span className={styles.topicPill}>घटक: {item.topic}</span>
                  </div>

                  <h3 className={styles.questionText}>
                    <span className={styles.qNum}>प्र. {offset + idx + 1}.</span> {item.question}
                  </h3>

                  {/* MCQ Options */}
                  <div className={styles.optionsGrid}>
                    {item.options &&
                      Object.entries(item.options).map(([optKey, optVal]) => {
                        let optClass = styles.optionBtn
                        if (selectedOpt === optKey) {
                          optClass += isCorrect ? ` ${styles.optionCorrect}` : ` ${styles.optionWrong}`
                        } else if (isRevealed && optKey === item.correct) {
                          optClass += ` ${styles.optionCorrect}`
                        }

                        return (
                          <button
                            key={optKey}
                            type="button"
                            className={optClass}
                            onClick={() => handleSelectOption(item.id, optKey)}
                          >
                            <span className={styles.optLetter}>{optKey}</span>
                            <span className={styles.optText}>{optVal}</span>
                          </button>
                        )
                      })}
                  </div>

                  {/* Reveal Solution Bar */}
                  <div className={styles.cardFooter}>
                    <button
                      type="button"
                      className={styles.toggleAnswerBtn}
                      onClick={() => toggleSolution(item.id)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {isRevealed ? 'visibility_off' : 'lightbulb'}
                      </span>
                      {isRevealed ? 'स्पष्टीकरण लपवा' : 'उत्तर व सविस्तर स्पष्टीकरण पहा'}
                    </button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `प्रश्न (${item.exam} ${item.year}):\n${item.question}\n\nसविस्तर उत्तर व ट्रिक्स ExamUdaan वर पहा:\nhttps://examudaan.in/pyq`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.shareBtn}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                        share
                      </span>
                      शेअर करा
                    </a>
                  </div>

                  {isRevealed && (
                    <div className={styles.explanationBox}>
                      <span className={`material-symbols-outlined ${styles.explanationIcon}`}>
                        psychology
                      </span>
                      <div>
                        <strong className={styles.explanationTitle}>
                          💡 अचूक पर्याय: ({item.correct}) — संदर्भासह सविस्तर स्पष्टीकरण:
                        </strong>
                        <p className={styles.explanationText}>{item.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className={styles.loadMoreWrap}>
              <button
                type="button"
                className={styles.loadMoreBtn}
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <span
                      className="material-symbols-outlined"
                      style={{ animation: 'pyqSpin 0.7s linear infinite' }}
                    >
                      progress_activity
                    </span>
                    पुढील प्रश्न लोड होत आहेत...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">expand_more</span>
                    आणखी प्रश्न लोड करा ({questions.length} / {totalCount})
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── Related Prep Ecosystem Cards ── */}
          <div style={{
            marginTop: '44px',
            background: '#FFFFFF',
            border: '1px solid var(--outline-variant, #E2E8F0)',
            borderRadius: '16px',
            padding: '28px 24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 22px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary, #EA580C)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Complete Exam Preparation
              </span>
              <h2 style={{ fontFamily: 'var(--font-outfit, Outfit)', fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '4px 0 6px' }}>
                मूळ प्रश्नपत्रिका, मॉक टेस्ट्स व कट-ऑफ विश्लेषण
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
                विषयवार सराव केल्यानंतर मूळ पूर्ण पेपर्स वाचा आणि १०० प्रश्नांची मॉक टेस्ट देऊन तुमची रँक तपासा.
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
                      841 पेपर्स
                    </span>
                  </div>
                  <strong style={{ fontSize: '15px', color: '#0F172A', fontFamily: 'var(--font-outfit, Outfit)', display: 'block', marginBottom: '4px' }}>
                    MPSC मूळ प्रश्नपत्रिका व की
                  </strong>
                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                    २०२१ ते २०२६ चे सर्व ४२९ परीक्षा संच थेट ब्राऊझरमध्ये वाचा व डाऊनलोड करा.
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
                  border: '1px solid #E2E8F0',
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
                  <strong style={{ fontSize: '15px', color: '#0F172A', fontFamily: 'var(--font-outfit, Outfit)', display: 'block', marginBottom: '4px' }}>
                    मोफत ऑनलाईन मॉक टेस्ट्स
                  </strong>
                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                    MPSC संयुक्त १०० प्रश्नांचा संपूर्ण मॉक व विषयवार स्पीड ड्रिल्स सोडवा.
                  </p>
                </div>
                <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#047857' }}>
                  मॉक टेस्ट द्या →
                </span>
              </Link>

              <Link
                href="/cutoffs"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
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
                    <span style={{ fontSize: '11px', fontWeight: 700, background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE', padding: '2px 7px', borderRadius: '999px' }}>
                      10-Yr Cutoffs
                    </span>
                  </div>
                  <strong style={{ fontSize: '15px', color: '#0F172A', fontFamily: 'var(--font-outfit, Outfit)', display: 'block', marginBottom: '4px' }}>
                    मागील १० वर्षांचे कट-ऑफ
                  </strong>
                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                    Open, OBC, EWS, SC, ST प्रवर्गांचे अधिकृत बेंचमार्क मार्क्स तपासा.
                  </p>
                </div>
                <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#6D28D9' }}>
                  कट-ऑफ पहा →
                </span>
              </Link>

              <Link
                href="/syllabus"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
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
                    <span style={{ fontSize: '22px' }}>📚</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '2px 7px', borderRadius: '999px' }}>
                      17 Exams
                    </span>
                  </div>
                  <strong style={{ fontSize: '15px', color: '#0F172A', fontFamily: 'var(--font-outfit, Outfit)', display: 'block', marginBottom: '4px' }}>
                    अधिकृत अभ्यासक्रम व पॅटर्न
                  </strong>
                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                    परीक्षा पद्धती, विषयनिहाय गुणविभागणी आणि नकारात्मक गुण पद्धती.
                  </p>
                </div>
                <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#1D4ED8' }}>
                  अभ्यासक्रम पहा →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default function PyqSearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '60px 20px', textAlign: 'center', background: '#fffbf5', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1F2937', marginBottom: '12px' }}>
            MPSC, TCS तलाठी व पोलीस भरती PYQ बँक
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 auto 20px' }}>
            १५ वर्षांचा विषयवार प्रश्नसंच लोड होत आहे...
          </p>
        </div>
      }
    >
      <PyqSearchInner />
    </Suspense>
  )
}
