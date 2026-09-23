// ============================================================
// app/pyq/page.js — 15-Year Topic-wise Searchable PYQ Bank
// ExamUdaan.in — Instant search across MPSC, TCS Talathi & Police PYQs
// ============================================================
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PYQ_DATABASE } from '@/lib/pyqData'
import styles from './pyq.module.css'

const SUBJECT_FILTERS = ['All', 'Polity', 'Geography', 'History', 'Economy', 'Science', 'Marathi', 'English', 'Reasoning']

const TRENDING_TOPICS = [
  '73rd Amendment',
  'RTI Act 2005',
  'Koyna Dam',
  'सत्यशोधक समाज',
  'नवीन कर्मणी',
  'Repo Rate',
  'Blood Groups',
  'Mahad Satyagraha'
]

export default function PyqSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSubject, setActiveSubject] = useState('All')
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [revealedSolutions, setRevealedSolutions] = useState({})

  // Filtered PYQs based on query and subject
  const filteredPyqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return PYQ_DATABASE.filter(item => {
      // Subject filter
      if (activeSubject !== 'All' && item.subject.toLowerCase() !== activeSubject.toLowerCase()) {
        return false
      }
      // Query filter
      if (!q) return true

      const inQuestion = item.question.toLowerCase().includes(q)
      const inTopic = item.topic.toLowerCase().includes(q)
      const inExplanation = item.explanation.toLowerCase().includes(q)
      const inTags = item.tags && item.tags.some(t => t.toLowerCase().includes(q))
      const inExam = item.exam.toLowerCase().includes(q)

      return inQuestion || inTopic || inExplanation || inTags || inExam
    })
  }, [searchQuery, activeSubject])

  // Count matches across ALL subjects for the query
  const allSubjectMatchCount = useMemo(() => {
    if (!searchQuery.trim()) return 0
    const q = searchQuery.toLowerCase().trim()
    return PYQ_DATABASE.filter(item => {
      const inQuestion = item.question.toLowerCase().includes(q)
      const inTopic = item.topic.toLowerCase().includes(q)
      const inExplanation = item.explanation.toLowerCase().includes(q)
      const inTags = item.tags && item.tags.some(t => t.toLowerCase().includes(q))
      const inExam = item.exam.toLowerCase().includes(q)
      return inQuestion || inTopic || inExplanation || inTags || inExam
    }).length
  }, [searchQuery])

  // Select user option to test self
  const handleSelectOption = (pyqId, optKey) => {
    setSelectedAnswers(prev => ({ ...prev, [pyqId]: optKey }))
    setRevealedSolutions(prev => ({ ...prev, [pyqId]: true }))
  }

  // Toggle reveal solution
  const toggleSolution = (pyqId) => {
    setRevealedSolutions(prev => ({ ...prev, [pyqId]: !prev[pyqId] }))
  }

  return (
    <main className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>history_edu</span>
              १५ वर्षांचा विषयवार प्रश्नसंच (2011–2025)
            </span>
            <h1>MPSC, TCS तलाठी व पोलीस भरती सर्च करण्यायोग्य PYQ बँक</h1>
            <p>
              कोणताही विषय किंवा कीवर्ड सर्च करा (उदा. <em>"RTI Act 2005"</em>, <em>"कळसूबाई"</em>, <em>"73rd Amendment"</em>, <em>"सत्यशोधक समाज"</em>) आणि मागील १५ वर्षांत विचारलेले सर्व अधिकृत प्रश्न, अचूक उत्तरे व सविस्तर स्पष्टीकरणासह त्वरित पहा.
            </p>

            {/* Search Box */}
            <div className={styles.searchBoxWrap}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
              <input
                type="text"
                placeholder="कोणताही घटक किंवा कीवर्ड टाईप करा (उदा. Godavari, कलम ३२, Repo Rate, प्रयोग)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  className={styles.searchClearBtn}
                  onClick={() => setSearchQuery('')}
                  title="Clear Search"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>

            {/* Trending Topic Chips */}
            <div className={styles.trendingRow}>
              <span className={styles.trendingLabel}>🔥 वारंवार विचारले जाणारे घटक:</span>
              {TRENDING_TOPICS.map(topic => (
                <button
                  key={topic}
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
        </div>
      </section>

      {/* ── Subject Filter Bar ── */}
      <div className={styles.filterBar}>
        <div className="container">
          <div className={styles.filterScroll}>
            {SUBJECT_FILTERS.map(sub => (
              <button
                key={sub}
                className={`${styles.filterBtn} ${activeSubject === sub ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveSubject(sub)}
              >
                {sub === 'All' ? 'सर्व विषय (All Subjects)' : sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── PYQ Questions List ── */}
      <section className={styles.pyqSection}>
        <div className="container">
          <div className={styles.resultsCount}>
            <span>
              🎯 एकूण सापडलेले प्रश्न: <strong>{filteredPyqs.length}</strong>
              {searchQuery && ` ("${searchQuery}" साठी)`}
            </span>
            <Link href="/mock-tests" className="btn-outline" style={{ fontSize: '13px', padding: '6px 14px' }}>
              १०० गुणांचे मॉक टेस्ट सोडवा →
            </Link>
          </div>

          {filteredPyqs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', margin: '20px 0' }}>
              <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>🔍</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: '#1e293b' }}>
                "{searchQuery}" या शोधघटकासाठी {activeSubject !== 'All' ? `विषय "${activeSubject}" मध्ये` : ''} ० प्रश्न सापडले
              </h3>
              {activeSubject !== 'All' && allSubjectMatchCount > 0 ? (
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '520px', margin: '0 auto 16px' }}>
                    तथापि, इतर विषयांमध्ये <strong>{allSubjectMatchCount}</strong> प्रश्न उपलब्ध आहेत!
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setActiveSubject('All')}
                    style={{ margin: '0 auto', display: 'inline-flex', padding: '10px 20px', fontSize: '14px' }}
                  >
                    सर्व विषयांमध्ये पहा ({allSubjectMatchCount} प्रश्न उपलब्ध)
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '520px', margin: '0 auto' }}>
                  कृपया दुसरा कीवर्ड किंवा घटक शोधा किंवा वरील ट्रेंडिंग टॅग्जवर क्लिक करा.
                </p>
              )}
            </div>
          )}

          <div className={styles.pyqGrid}>
            {filteredPyqs.map((item, idx) => {
              const userAns = selectedAnswers[item.id]
              const isRevealed = revealedSolutions[item.id]

              return (
                <div key={item.id} className={styles.pyqCard}>
                  <div className={styles.cardTop}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={styles.topicBadge}>#{idx + 1} {item.topic}</span>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                        {item.subject}
                      </span>
                    </div>
                    <div className={styles.examMeta}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span>
                      {item.exam} ({item.year})
                    </div>
                  </div>

                  <h3 className={styles.questionText}>{item.question}</h3>

                  <div className={styles.optionsList}>
                    {Object.entries(item.options).map(([key, val]) => {
                      const isCorrect = isRevealed && key === item.correct
                      const isUserWrong = isRevealed && userAns === key && key !== item.correct

                      let optClass = styles.optionItem
                      if (isCorrect) optClass = `${styles.optionItem} ${styles.optionItemCorrect}`
                      else if (isUserWrong) optClass = `${styles.optionItem} ${styles.optionItemUserWrong}`

                      return (
                        <div
                          key={key}
                          className={optClass}
                          onClick={() => handleSelectOption(item.id, key)}
                        >
                          <span className={styles.optionKey}>{key}</span>
                          <span style={{ flex: 1 }}>{val}</span>
                          {isCorrect && (
                            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800 }}>✓ अचूक उत्तर</span>
                          )}
                          {isUserWrong && (
                            <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 800 }}>✗ चुकीची निवड</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className={styles.cardFooter}>
                    <button
                      className={styles.toggleAnswerBtn}
                      onClick={() => toggleSolution(item.id)}
                    >
                      <span className="material-symbols-outlined">
                        {isRevealed ? 'visibility_off' : 'lightbulb'}
                      </span>
                      {isRevealed ? 'स्पष्टीकरण लपवा' : 'उत्तर व सविस्तर स्पष्टीकरण पहा'}
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`प्रश्न (${item.exam} ${item.year}):\n${item.question}\n\nसविस्तर उत्तर व ट्रिक्स ExamUdaan वर पहा:\nhttps://examudaan.in/pyq`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                        style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>share</span>
                        शेअर करा
                      </a>
                    </div>
                  </div>

                  {isRevealed && (
                    <div className={styles.explanationBox}>
                      <span className="material-symbols-outlined">psychology</span>
                      <div>
                        <strong style={{ display: 'block', fontSize: '13px', color: '#86198f', marginBottom: '4px' }}>
                          💡 अचूक पर्याय: ({item.correct}) — संदर्भासह सविस्तर स्पष्टीकरण:
                        </strong>
                        <p>{item.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
