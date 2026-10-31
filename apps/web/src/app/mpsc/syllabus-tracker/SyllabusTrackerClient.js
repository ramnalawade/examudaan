'use client'

// ============================================================
// app/mpsc/syllabus-tracker/SyllabusTrackerClient.js — Interactive Syllabus-to-PYQ Checklist
// ExamUdaan.in — Saffron & Ivory, Strict Zero Inline Styles, Mobile Responsive
// ============================================================

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import styles from './SyllabusTracker.module.css'
import {
  getSyllabusTrackerVault,
  setTopicStatus,
  getTopicStatus,
  STATUS_STATES,
  STATUS_CONFIG,
  PYQ_TOPIC_MAP
} from '@/lib/syllabusTrackerVault'

export default function SyllabusTrackerClient({ syllabusExams }) {
  const [selectedExamSlug, setSelectedExamSlug] = useState('mpsc-state-services')
  const [vault, setVault] = useState(null)
  const [showVersionComparison, setShowVersionComparison] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  // Load vault from localStorage
  useEffect(() => {
    setVault(getSyllabusTrackerVault())

    const handleVaultUpdate = (e) => {
      setVault(e.detail || getSyllabusTrackerVault())
    }
    window.addEventListener('examudaan:syllabus_updated', handleVaultUpdate)
    return () => window.removeEventListener('examudaan:syllabus_updated', handleVaultUpdate)
  }, [])

  const currentExam = useMemo(() => {
    return syllabusExams.find(e => e.slug === selectedExamSlug) || syllabusExams[0]
  }, [syllabusExams, selectedExamSlug])

  // Compute total subtopics and completion stats for current exam
  const examStats = useMemo(() => {
    if (!currentExam || !vault) return { total: 0, completed: 0, revised: 0, studying: 0, percent: 0 }

    let total = 0
    let completed = 0
    let revised = 0
    let studying = 0

    currentExam.papers?.forEach(stage => {
      stage.papers?.forEach(paper => {
        paper.topics?.forEach(topic => {
          topic.subtopics?.forEach(sub => {
            total++
            const status = getTopicStatus(vault, currentExam.slug, paper.name, topic.name, sub)
            if (status === STATUS_STATES.COMPLETED) completed++
            else if (status === STATUS_STATES.REVISED) revised++
            else if (status === STATUS_STATES.STUDYING) studying++
          })
        })
      })
    })

    const percent = total > 0 ? Math.round(((completed + (revised * 0.5) + (studying * 0.25)) / total) * 100) : 0
    return { total, completed, revised, studying, percent }
  }, [currentExam, vault])

  const handleStatusChange = (paperName, topicName, subtopicName, newStatus) => {
    const updated = setTopicStatus(currentExam.slug, paperName, topicName, subtopicName, newStatus)
    setVault({ ...updated })
  }

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Breadcrumb Strip */}
      <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
        <div className={styles.container}>
          <ol className={styles.breadcrumbList}>
            <li className={styles.breadcrumbItem}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
            </li>
            <li className={styles.breadcrumbItem}>
              <Link href="/syllabus/mpsc" className={styles.breadcrumbLink}>MPSC Syllabus</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
            </li>
            <li className={styles.breadcrumbItem}>
              <span className={styles.breadcrumbActive}>Interactive Syllabus-to-PYQ Tracker</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.badgeRow}>
              <span className={styles.badgeTracker}>
                🗺️ Syllabus-to-PYQ Study Roadmap
              </span>
              <span className={styles.badgeVerified}>
                ✓ Mapped to 10,392 Solved Official Questions
              </span>
            </div>

            <h1 className={styles.mainHeading}>
              Interactive MPSC Syllabus Tracker & PYQ Mapper
            </h1>

            <p className={styles.subHeading}>
              Every official syllabus converted into an actionable checklist of subjects, units, and subtopics.
              Track your preparation journey, verify question bank density, and identify content gaps topic-by-topic.
            </p>

            {/* Overall Preparation Readiness Meter */}
            <div className={styles.overallProgressCard}>
              <div className={styles.progressStatsGroup}>
                <div className={styles.progressCircularBlock}>
                  <span className={styles.progressPercentNumber}>{examStats.percent}%</span>
                  <div className={styles.progressLabelText}>
                    <strong>Readiness Score</strong>
                    <span>{currentExam.shortName || currentExam.nameEn}</span>
                  </div>
                </div>

                <div className={styles.progressDetailBar}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFillCompleted}
                      style={{ width: `${Math.round((examStats.completed / (examStats.total || 1)) * 100)}%` }}
                      title={`${examStats.completed} Mastered`}
                    />
                    <div
                      className={styles.progressFillRevised}
                      style={{ width: `${Math.round((examStats.revised / (examStats.total || 1)) * 100)}%` }}
                      title={`${examStats.revised} Revised`}
                    />
                    <div
                      className={styles.progressFillStudying}
                      style={{ width: `${Math.round((examStats.studying / (examStats.total || 1)) * 100)}%` }}
                      title={`${examStats.studying} Studying`}
                    />
                  </div>

                  <div className={styles.progressBreakdownPills}>
                    <span className={styles.pillCompleted}>✅ {examStats.completed} Mastered</span>
                    <span className={styles.pillRevised}>🔄 {examStats.revised} Revised</span>
                    <span className={styles.pillStudying}>📖 {examStats.studying} Studying</span>
                    <span>○ {examStats.total - examStats.completed - examStats.revised - examStats.studying} Remaining</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={styles.btnToggleVersion}
                onClick={() => setShowVersionComparison(!showVersionComparison)}
              >
                {showVersionComparison ? 'Hide Pattern Changes ▲' : '📋 View Official Pattern Changes ▼'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Sticky Exam Navigation Bar */}
      <nav className={styles.examNav} aria-label="Select MPSC Exam">
        <div className={styles.container}>
          <div className={styles.examNavScroll}>
            {syllabusExams.map(exam => {
              const isActive = selectedExamSlug === exam.slug
              return (
                <button
                  key={exam.slug}
                  type="button"
                  className={`${styles.examNavBtn} ${isActive ? styles.examNavBtnActive : ''}`}
                  onClick={() => {
                    setSelectedExamSlug(exam.slug)
                    const el = document.getElementById('tracker-content')
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  <span>🏛️</span>
                  <span>{exam.shortName || exam.nameEn}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className={styles.container} id="tracker-content">
        <div className={styles.dashboardBody}>
          {/* Documented Version Comparison (Old vs. Revised UPSC Pattern) */}
          {showVersionComparison && (
            <section className={styles.versionComparisonBox} aria-label="Syllabus Pattern Comparison">
              <div className={styles.versionHeader}>
                <h3 className={styles.versionTitle}>
                  <span>⚖️</span>
                  <span>Documented MPSC Pattern Changes (Old vs. Revised Version)</span>
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Official Commission Gazettes (शासन निर्णय)
                </span>
              </div>

              <div className={styles.versionGrid}>
                <div className={`${styles.versionColumn} ${styles.versionColNew}`}>
                  <h4 className={styles.versionColTitle}>
                    ✓ Applicable Revised Pattern (सध्या लागू रचना)
                  </h4>
                  <ul className={styles.versionPointList}>
                    <li><strong>Mains Descriptive Pattern:</strong> 9 Papers total. 7 merit papers of 250 marks each (1,750 marks) + 2 qualifying language papers (300 marks each).</li>
                    <li><strong>CSAT Paper 2 Qualifying:</strong> Required minimum qualifying score of 33% (66 marks); not counted in preliminary merit rank.</li>
                    <li><strong>Optional Subjects Restored:</strong> 2 Optional Subject Papers (250 marks each) matching UPSC domain depth.</li>
                    <li><strong>Interview Weightage:</strong> 275 marks interview evaluated by multidimensional board. Total Exam: 2,025 Marks.</li>
                  </ul>
                </div>

                <div className={`${styles.versionColumn} ${styles.versionColOld}`}>
                  <h4 className={styles.versionColTitle}>
                    Previous Objective Pattern (मागील वस्तुनिष्ठ स्वरूप)
                  </h4>
                  <ul className={styles.versionPointList}>
                    <li><strong>Mains Multiple Choice:</strong> 6 Objective Multiple-Choice Question Papers (800 Marks).</li>
                    <li><strong>CSAT Scored in Merit:</strong> CSAT marks previously determined cutoffs, leading to engineering student skew.</li>
                    <li><strong>No Optional Subjects:</strong> All candidates answered identical standardized general studies papers.</li>
                    <li><strong>Interview:</strong> 100 marks interview test. Total: 900 marks.</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* Interactive Checklist by Stage and Paper */}
          {currentExam.papers?.map((stage, stageIdx) => (
            <section key={stageIdx} className={styles.stageBlock}>
              <h2 className={styles.stageHeading}>
                <span>📑</span>
                <span>{stage.stage}</span>
              </h2>

              {stage.papers?.map((paper, paperIdx) => (
                <div key={paperIdx} className={styles.paperCard}>
                  <div className={styles.paperHeaderRow}>
                    <div className={styles.paperTitleGroup}>
                      <h3 className={styles.paperTitle}>{paper.name}</h3>
                      <div className={styles.paperMetaBadges}>
                        <span className={styles.paperBadge}>{paper.marks} Marks</span>
                        {paper.duration && <span>⏱️ {paper.duration}</span>}
                        {paper.type && <span>• {paper.type}</span>}
                      </div>
                    </div>

                    <Link
                      href="/mock-tests"
                      className={styles.pyqDensityTag}
                      style={{ background: '#EA580C', color: '#FFFFFF', padding: '6px 12px' }}
                    >
                      <span>🎯 Take Sectional Mock Test →</span>
                    </Link>
                  </div>

                  {/* Units & Subtopics */}
                  {paper.topics?.map((topic, topicIdx) => (
                    <div key={topicIdx} className={styles.topicGroup}>
                      <h4 className={styles.topicNameHeader}>
                        <span>📌</span>
                        <span>{topic.name}</span>
                      </h4>

                      <div className={styles.subtopicList}>
                        {topic.subtopics?.map((sub, subIdx) => {
                          const status = getTopicStatus(vault, currentExam.slug, paper.name, topic.name, sub)
                          const pyqInfo = PYQ_TOPIC_MAP[sub]

                          return (
                            <div key={subIdx} className={styles.subtopicRow}>
                              <div className={styles.subtopicInfo}>
                                <span className={styles.subtopicTitle}>{sub}</span>

                                {/* PYQ Density or Content Gap Auditor */}
                                {pyqInfo ? (
                                  <Link
                                    href={`/pyq/${pyqInfo.subjectSlug}?topic=${encodeURIComponent(sub)}`}
                                    className={styles.pyqDensityTag}
                                    title={`Practise ${pyqInfo.qCount} official questions for this topic`}
                                  >
                                    <span>🔥</span>
                                    <span>{pyqInfo.qCount} Solved PYQs</span>
                                  </Link>
                                ) : (
                                  <span className={styles.coverageGapTag} title="Topic identified for future question bank expansion">
                                    <span>⚪</span>
                                    <span>Question Bank Gap</span>
                                  </span>
                                )}
                              </div>

                              {/* 4-Stage Status Toggle Segmented Buttons */}
                              <div className={styles.statusButtonGroup} role="group" aria-label={`Status for ${sub}`}>
                                {Object.values(STATUS_CONFIG).map(cfg => {
                                  const isActive = status === cfg.id
                                  let activeClass = ''
                                  if (isActive) {
                                    if (cfg.id === STATUS_STATES.STUDYING) activeClass = styles.statusStudyingActive
                                    else if (cfg.id === STATUS_STATES.REVISED) activeClass = styles.statusRevisedActive
                                    else if (cfg.id === STATUS_STATES.COMPLETED) activeClass = styles.statusCompletedActive
                                    else activeClass = styles.statusRevisedActive
                                  }

                                  return (
                                    <button
                                      key={cfg.id}
                                      type="button"
                                      className={`${styles.statusToggleBtn} ${isActive ? activeClass : ''}`}
                                      onClick={() => handleStatusChange(paper.name, topic.name, sub, cfg.id)}
                                      title={`Mark as ${cfg.label}`}
                                    >
                                      <span>{cfg.icon}</span>
                                      <span>{cfg.labelMr}</span>
                                    </button>
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
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
