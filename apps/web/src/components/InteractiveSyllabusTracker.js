'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import styles from './InteractiveSyllabusTracker.module.css'

// Helper: extract clean first keyword from subtopic for search
function getCleanSearchKeyword(subtopic, topicName) {
  const clean = subtopic.replace(/[()]/g, ' ').trim()
  const tokens = clean
    .split(/[,/;|]+/)
    .map(t => t.trim())
    .filter(t => t.length >= 2)
  if (tokens.length > 0) return tokens[0]
  return topicName || subtopic
}

export default function InteractiveSyllabusTracker({ exam }) {
  // Extract all subtopics into a flat list with unique keys: "stage-paper-topic-subtopic"
  const allSubtopics = useMemo(() => {
    const list = []
    if (!exam?.papers) return list

    exam.papers.forEach((stageGroup, stageIdx) => {
      stageGroup.papers?.forEach((paper, paperIdx) => {
        paper.topics?.forEach((topic, topicIdx) => {
          topic.subtopics?.forEach((subtopic, subIdx) => {
            const key = `${stageIdx}_${paperIdx}_${topicIdx}_${subIdx}`
            list.push({
              key,
              stageName: stageGroup.stage,
              paperName: paper.name,
              topicName: topic.name,
              subtopic,
            })
          })
        })
      })
    })
    return list
  }, [exam])

  const totalCount = allSubtopics.length

  // Track checked keys
  const [checkedKeys, setCheckedKeys] = useState({})
  const [mounted, setMounted] = useState(false)
  const [openTopics, setOpenTopics] = useState({})
  const [expandedPyqs, setExpandedPyqs] = useState({})
  const [userSelectedOpts, setUserSelectedOpts] = useState({})
  const [loadedPyqs, setLoadedPyqs] = useState({})
  const [loadingPyqKeys, setLoadingPyqKeys] = useState({})

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && exam?.slug) {
      try {
        const stored = localStorage.getItem(`examudaan_syllabus_${exam.slug}`)
        if (stored) {
          setCheckedKeys(JSON.parse(stored))
        }
      } catch (err) {
        console.error('Failed to read syllabus progress from localStorage', err)
      }
    }
  }, [exam?.slug])

  // Save to localStorage whenever checkedKeys change
  const toggleSubtopic = (key) => {
    setCheckedKeys((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (!next[key]) delete next[key]
      if (typeof window !== 'undefined' && exam?.slug) {
        try {
          localStorage.setItem(`examudaan_syllabus_${exam.slug}`, JSON.stringify(next))
        } catch (err) {
          console.error('Failed to save syllabus progress', err)
        }
      }
      return next
    })
  }

  // Toggle Accordion Topic Open/Close
  const toggleTopicOpen = (topicKey) => {
    setOpenTopics((prev) => ({
      ...prev,
      [topicKey]: prev[topicKey] === undefined ? false : !prev[topicKey],
    }))
  }

  const isTopicOpen = (topicKey) => {
    return openTopics[topicKey] !== false
  }

  // Toggle Inline PYQ drawer and fetch from DB API if needed
  const togglePyqDrawer = useCallback((key, cleanKeyword) => {
    setExpandedPyqs((prev) => {
      const willOpen = !prev[key]
      if (willOpen && !loadedPyqs[key] && !loadingPyqKeys[key] && cleanKeyword) {
        setLoadingPyqKeys((l) => ({ ...l, [key]: true }))
        fetch(`/api/pyq?q=${encodeURIComponent(cleanKeyword)}&limit=2`)
          .then((res) => res.json())
          .then((json) => {
            if (json.success && json.data?.questions) {
              setLoadedPyqs((lp) => ({ ...lp, [key]: json.data.questions }))
            }
          })
          .catch((err) => console.error('[syllabus pyq] fetch error:', err))
          .finally(() => {
            setLoadingPyqKeys((l) => ({ ...l, [key]: false }))
          })
      }
      return { ...prev, [key]: willOpen }
    })
  }, [loadedPyqs, loadingPyqKeys])

  // Option select within inline PYQ drawer
  const handleInlineSelect = (qId, optKey) => {
    setUserSelectedOpts(prev => ({
      ...prev,
      [qId]: optKey
    }))
  }

  // Quick Actions
  const handleSelectAll = () => {
    const all = {}
    allSubtopics.forEach((s) => {
      all[s.key] = true
    })
    setCheckedKeys(all)
    if (typeof window !== 'undefined' && exam?.slug) {
      localStorage.setItem(`examudaan_syllabus_${exam.slug}`, JSON.stringify(all))
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset all checked topics for this exam?')) {
      setCheckedKeys({})
      if (typeof window !== 'undefined' && exam?.slug) {
        localStorage.removeItem(`examudaan_syllabus_${exam.slug}`)
      }
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  // Computed metrics
  const completedCount = mounted ? Object.keys(checkedKeys).filter((k) => checkedKeys[k]).length : 0
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Status message
  let statusBadge = { label: 'Not Started', status: 'idle' }
  if (percentage === 100) {
    statusBadge = { label: '100% Complete! Ready for Exam 🎉', status: 'complete' }
  } else if (percentage >= 75) {
    statusBadge = { label: 'Final Lap — Revision & Mock Tests', status: 'active' }
  } else if (percentage >= 50) {
    statusBadge = { label: 'Halfway Mark — Keep the Momentum', status: 'active' }
  } else if (percentage >= 25) {
    statusBadge = { label: 'Foundation Phase — Solid Progress', status: 'active' }
  } else if (completedCount > 0) {
    statusBadge = { label: 'Underway — Target 1 Topic Daily', status: 'active' }
  }

  return (
    <div className={styles.trackerWrapper} style={{ '--exam-color': exam?.color || '#ea580c' }}>
      {/* ── Top Progress Banner ── */}
      <div className={styles.progressBanner}>
        <div className={styles.bannerTop}>
          <div className={styles.bannerHeading}>
            <div className={styles.iconWrap}>
              <span className="material-symbols-outlined">checklist</span>
            </div>
            <div>
              <h3 className={styles.bannerTitle}>Interactive Syllabus Completion Tracker</h3>
              <p className={styles.bannerSubtitle}>
                Check off topics as you study. Your progress is saved automatically on your device.
              </p>
            </div>
          </div>
          <div className={styles.bannerBadge} data-status={statusBadge.status}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              {percentage === 100 ? 'verified' : 'timelapse'}
            </span>
            {statusBadge.label}
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${percentage}%` }}
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        <div className={styles.bannerFooter}>
          <div className={styles.statsCount}>
            <span>Completed: </span>
            <strong>
              {completedCount} of {totalCount} topics ({percentage}%)
            </strong>
          </div>

          <div className={styles.actionButtons}>
            <button type="button" onClick={handleSelectAll} className={styles.btnAction} title="Mark all topics complete">
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                done_all
              </span>
              Select All
            </button>
            <button type="button" onClick={handleReset} className={`${styles.btnAction} ${styles.btnReset}`} title="Clear checklist">
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                restart_alt
              </span>
              Reset
            </button>
            <button type="button" onClick={handlePrint} className={styles.btnAction} title="Print or save as PDF">
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                print
              </span>
              Print Checklist
            </button>
          </div>
        </div>
      </div>

      {/* ── Papers & Topics Breakdown ── */}
      {exam?.papers?.map((stageGroup, stageIdx) => (
        <div key={stageGroup.stage} className={styles.stageGroup}>
          <h3 className={styles.stageLabel}>{stageGroup.stage}</h3>
          <div className={styles.papersGrid}>
            {stageGroup.papers?.map((paper, paperIdx) => {
              // Calculate completion for this specific paper
              let paperTotal = 0
              let paperDone = 0

              paper.topics?.forEach((t, tIdx) => {
                t.subtopics?.forEach((_, sIdx) => {
                  paperTotal++
                  const key = `${stageIdx}_${paperIdx}_${tIdx}_${sIdx}`
                  if (mounted && checkedKeys[key]) paperDone++
                })
              })

              return (
                <div key={paper.name} className={styles.paperCard}>
                  <div className={styles.paperHeader}>
                    <div>
                      <h4 className={styles.paperName}>{paper.name}</h4>
                      <div className={styles.paperMeta}>
                        {paper.marks && (
                          <span>
                            <strong>{paper.marks}</strong> marks
                          </span>
                        )}
                        {paper.questions && (
                          <span>
                            <strong>{paper.questions}</strong> questions
                          </span>
                        )}
                        {paper.duration && <span>⏱ {paper.duration}</span>}
                        {paper.type && <span className={styles.paperType}>{paper.type}</span>}
                      </div>
                    </div>
                    <div className={styles.paperProgressMini}>
                      {paperDone} / {paperTotal} Done ({paperTotal > 0 ? Math.round((paperDone / paperTotal) * 100) : 0}%)
                    </div>
                  </div>

                  {/* Topics List with Interactive Subtopics */}
                  <div className={styles.topicList}>
                    {paper.topics?.map((topic, topicIdx) => {
                      const topicKey = `${stageIdx}_${paperIdx}_${topicIdx}`
                      const open = isTopicOpen(topicKey)

                      let topicTotal = topic.subtopics?.length || 0
                      let topicDone = 0
                      topic.subtopics?.forEach((_, sIdx) => {
                        const key = `${stageIdx}_${paperIdx}_${topicIdx}_${sIdx}`
                        if (mounted && checkedKeys[key]) topicDone++
                      })
                      const topicComplete = topicTotal > 0 && topicDone === topicTotal

                      return (
                        <div key={topic.name} className={styles.topicAccordion}>
                          <div className={styles.topicHeader} onClick={() => toggleTopicOpen(topicKey)}>
                            <div className={styles.topicTitleWrap}>
                              <span
                                className={`material-symbols-outlined ${styles.chevronIcon} ${
                                  open ? styles.chevronOpen : ''
                                }`}
                              >
                                chevron_right
                              </span>
                              <span>{topic.name}</span>
                            </div>
                            <span className={styles.topicProgressBadge} data-complete={topicComplete}>
                              {topicDone} / {topicTotal}
                            </span>
                          </div>

                          {open && (
                            <div className={styles.subtopicList}>
                              {topic.subtopics?.map((sub, subIdx) => {
                                const key = `${stageIdx}_${paperIdx}_${topicIdx}_${subIdx}`
                                const isChecked = mounted && !!checkedKeys[key]
                                const isPyqDrawerOpen = !!expandedPyqs[key]
                                const cleanKeyword = getCleanSearchKeyword(sub, topic.name)
                                const matchedPyqs = loadedPyqs[key] || []
                                const isPyqLoading = !!loadingPyqKeys[key]

                                return (
                                  <div key={sub} className={styles.subtopicItem} data-checked={isChecked}>
                                    <div className={styles.subtopicRow}>
                                      <label className={styles.checkboxLabel}>
                                        <input
                                          type="checkbox"
                                          className={styles.customCheckbox}
                                          checked={isChecked}
                                          onChange={() => toggleSubtopic(key)}
                                        />
                                        <span className={styles.subtopicText}>{sub}</span>
                                      </label>

                                      <div className={styles.subtopicActions}>
                                        {/* In-Place Collapsible PYQ Drawer Toggle */}
                                        <button
                                          type="button"
                                          className={styles.pyqToggleBtn}
                                          data-active={isPyqDrawerOpen}
                                          onClick={() => togglePyqDrawer(key, cleanKeyword)}
                                          title="View authentic questions & answers right here"
                                        >
                                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                            {isPyqDrawerOpen ? 'keyboard_arrow_up' : 'lightbulb'}
                                          </span>
                                          {isPyqDrawerOpen ? 'प्रश्न लपवा' : 'सराव प्रश्न (PYQs)'}
                                        </button>

                                        {/* Direct clean keyword link to 15-Yr Bank */}
                                        <Link
                                          href={`/pyq?q=${encodeURIComponent(cleanKeyword)}`}
                                          className={styles.pyqQuickLink}
                                          title={`15 वर्षांच्या PYQ बँकेत '${cleanKeyword}' शोधा`}
                                        >
                                          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                                            open_in_new
                                          </span>
                                          PYQ बँक
                                        </Link>
                                      </div>
                                    </div>

                                    {/* ── IN-PLACE COLLAPSIBLE PYQ DRAWER ── */}
                                    {isPyqDrawerOpen && (
                                      <div className={styles.inlinePyqDrawer}>
                                        <div className={styles.inlinePyqHeader}>
                                          <div className={styles.inlinePyqMeta}>
                                            <span className={styles.inlineExamBadge}>अधिकृत PYQ सराव</span>
                                            <span className={styles.inlineYearBadge}>घटक: {cleanKeyword}</span>
                                          </div>
                                          <button
                                            type="button"
                                            className={styles.inlineCloseBtn}
                                            onClick={() => togglePyqDrawer(key, cleanKeyword)}
                                            title="बंद करा"
                                          >
                                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                                              close
                                            </span>
                                          </button>
                                        </div>

                                        {isPyqLoading ? (
                                          <div style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                                            डेटाबेसमधून सराव प्रश्न लोड होत आहेत...
                                          </div>
                                        ) : matchedPyqs.length > 0 ? (
                                          matchedPyqs.map((q, qIndex) => {
                                            const selected = userSelectedOpts[q.id]
                                            const isAnswered = !!selected

                                            return (
                                              <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                <h5 className={styles.inlineQuestionTitle}>
                                                  प्र. {qIndex + 1} ({q.exam} {q.year}): {q.question}
                                                </h5>

                                                {/* Interactive Clickable Options */}
                                                <div className={styles.inlineOptionsGrid}>
                                                  {Object.entries(q.options).map(([optKey, optVal]) => {
                                                    const isOptCorrect = isAnswered && optKey === q.correct
                                                    const isOptSelected = selected === optKey

                                                    return (
                                                      <button
                                                        key={optKey}
                                                        type="button"
                                                        className={styles.inlineOptBtn}
                                                        data-selected={isOptSelected}
                                                        data-correct={isOptCorrect}
                                                        onClick={() => handleInlineSelect(q.id, optKey)}
                                                      >
                                                        <span className={styles.inlineOptLetter}>{optKey}</span>
                                                        <span>{optVal}</span>
                                                      </button>
                                                    )
                                                  })}
                                                </div>

                                                {/* Instant Explanation Box */}
                                                {isAnswered && (
                                                  <div className={styles.inlineExplanationBox}>
                                                    <strong>
                                                      💡 अचूक पर्याय: ({q.correct}) — अधिकृत स्पष्टीकरण:
                                                    </strong>
                                                    <p style={{ margin: 0 }}>{q.explanation}</p>
                                                  </div>
                                                )}
                                              </div>
                                            )
                                          })
                                        ) : (
                                          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8, fontSize: 13, color: '#475569' }}>
                                            <p style={{ margin: '0 0 6px' }}>
                                              या घटकावर १५ वर्षांच्या PYQ बँकेत अनेक प्रश्न उपलब्ध आहेत.
                                            </p>
                                            <Link
                                              href={`/pyq?q=${encodeURIComponent(cleanKeyword)}`}
                                              style={{ color: '#ea580c', fontWeight: 700, textDecoration: 'underline' }}
                                            >
                                              '{cleanKeyword}' संबंधित सर्व प्रश्न PYQ बँकेत पहा →
                                            </Link>
                                          </div>
                                        )}

                                        <div className={styles.inlineDrawerFooter}>
                                          <Link
                                            href={`/pyq?q=${encodeURIComponent(cleanKeyword)}`}
                                            className={styles.inlineBankLink}
                                          >
                                            १५ वर्षांच्या PYQ बँकेत या घटकाचे सर्व प्रश्न सोडवा →
                                          </Link>
                                          <button
                                            type="button"
                                            onClick={() => togglePyqDrawer(key)}
                                            style={{ fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
                                          >
                                            लपवा ▲
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
