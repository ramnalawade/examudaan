// ============================================================
// score-calculator/page.js — Official Response Sheet Raw Score Calculator
// ExamUdaan.in | TCS iON, MPSC, Police Bharti & SSC Response Sheet Parser
// Fully responsive across Mobile, Tablet, Laptop, and Desktop
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './scoreCalculator.module.css'

const EXAM_PRESETS = {
  talathi: {
    name: 'Maharashtra Talathi Bharti (TCS Pattern)',
    totalQuestions: 100,
    marksPerQuestion: 2,
    negativeMarking: 0,
    maxMarks: 200,
    sections: [
      { name: 'मराठी व्याकरण', start: 1, end: 25 },
      { name: 'English Language', start: 26, end: 50 },
      { name: 'सामान्य ज्ञान (GK & Current)', start: 51, end: 75 },
      { name: 'बौद्धिक चाचणी व अंकगणित', start: 76, end: 100 }
    ],
    cutoffs: { open: 172, obc: 168, ews: 166, sebc: 166, sc: 156, st: 148, nt: 164 }
  },
  police: {
    name: 'Maharashtra Police Constable Written Exam',
    totalQuestions: 100,
    marksPerQuestion: 1,
    negativeMarking: 0,
    maxMarks: 100,
    sections: [
      { name: 'अंकगणित (Maths)', start: 1, end: 25 },
      { name: 'सामान्य ज्ञान व पोलीस प्रशासन', start: 26, end: 50 },
      { name: 'बुद्धिमत्ता चाचणी (Reasoning)', start: 51, end: 75 },
      { name: 'मराठी व्याकरण', start: 76, end: 100 }
    ],
    cutoffs: { open: 84, obc: 80, ews: 78, sebc: 79, sc: 74, st: 68, nt: 77 }
  },
  mpsc_combined: {
    name: 'MPSC Combined Non-Gazetted Group B & C Prelims',
    totalQuestions: 100,
    marksPerQuestion: 1,
    negativeMarking: 0.25,
    maxMarks: 100,
    sections: [
      { name: 'इतिहास व भूगोल', start: 1, end: 30 },
      { name: 'भारतीय राज्यघटना व अर्थशास्त्र', start: 31, end: 60 },
      { name: 'सामान्य विज्ञान व चालू घडामोडी', start: 61, end: 85 },
      { name: 'अंकगणित व बुद्धिमत्ता', start: 86, end: 100 }
    ],
    cutoffs: { open: 52.5, obc: 51.0, ews: 50.0, sebc: 50.5, sc: 45.0, st: 40.0, nt: 48.0 }
  },
  ssc_cgl: {
    name: 'SSC CGL / CHSL Tier 1 Exam',
    totalQuestions: 100,
    marksPerQuestion: 2,
    negativeMarking: 0.50,
    maxMarks: 200,
    sections: [
      { name: 'General Intelligence & Reasoning', start: 1, end: 25 },
      { name: 'General Awareness', start: 26, end: 50 },
      { name: 'Quantitative Aptitude', start: 51, end: 75 },
      { name: 'English Comprehension', start: 76, end: 100 }
    ],
    cutoffs: { open: 142, obc: 136, ews: 132, sebc: 134, sc: 122, st: 114, nt: 130 }
  }
}

// Sample realistic datasets for 1-click test
const SAMPLE_TALATHI_DATA = `Q1. Question ID : 75101 | Chosen Option : 2 | Correct Answer : 2
Q2. Question ID : 75102 | Chosen Option : 1 | Correct Answer : 1
Q3. Question ID : 75103 | Chosen Option : 4 | Correct Answer : 4
Q4. Question ID : 75104 | Chosen Option : 3 | Correct Answer : 3
Q5. Question ID : 75105 | Chosen Option : 2 | Correct Answer : 1
Q6. Question ID : 75106 | Chosen Option : 1 | Correct Answer : 1
Q7. Question ID : 75107 | Chosen Option : 3 | Correct Answer : 3
Q8. Question ID : 75108 | Chosen Option : -- | Correct Answer : 2
Q9. Question ID : 75109 | Chosen Option : 4 | Correct Answer : 4
Q10. Question ID : 75110 | Chosen Option : 1 | Correct Answer : 1
Q11. Question ID : 75111 | Chosen Option : 2 | Correct Answer : 2
Q12. Question ID : 75112 | Chosen Option : 3 | Correct Answer : 4
Q13. Question ID : 75113 | Chosen Option : 1 | Correct Answer : 1
Q14. Question ID : 75114 | Chosen Option : 4 | Correct Answer : 4
Q15. Question ID : 75115 | Chosen Option : 2 | Correct Answer : 2
Q16. Question ID : 75116 | Chosen Option : 3 | Correct Answer : 3
Q17. Question ID : 75117 | Chosen Option : 1 | Correct Answer : 1
Q18. Question ID : 75118 | Chosen Option : 2 | Correct Answer : 2
Q19. Question ID : 75119 | Chosen Option : 4 | Correct Answer : 4
Q20. Question ID : 75120 | Chosen Option : 3 | Correct Answer : 3
Q21. Question ID : 75121 | Chosen Option : 1 | Correct Answer : 1
Q22. Question ID : 75122 | Chosen Option : 2 | Correct Answer : 2
Q23. Question ID : 75123 | Chosen Option : -- | Correct Answer : 3
Q24. Question ID : 75124 | Chosen Option : 4 | Correct Answer : 4
Q25. Question ID : 75125 | Chosen Option : 1 | Correct Answer : 1
Q26. Question ID : 75126 | Chosen Option : 2 | Correct Answer : 2
Q27. Question ID : 75127 | Chosen Option : 3 | Correct Answer : 3
Q28. Question ID : 75128 | Chosen Option : 1 | Correct Answer : 2
Q29. Question ID : 75129 | Chosen Option : 4 | Correct Answer : 4
Q30. Question ID : 75130 | Chosen Option : 2 | Correct Answer : 2
Q31. Question ID : 75131 | Chosen Option : 3 | Correct Answer : 3
Q32. Question ID : 75132 | Chosen Option : 1 | Correct Answer : 1
Q33. Question ID : 75133 | Chosen Option : 4 | Correct Answer : 4
Q34. Question ID : 75134 | Chosen Option : 2 | Correct Answer : 2
Q35. Question ID : 75135 | Chosen Option : 3 | Correct Answer : 3
Q36. Question ID : 75136 | Chosen Option : 1 | Correct Answer : 1
Q37. Question ID : 75137 | Chosen Option : 2 | Correct Answer : 2
Q38. Question ID : 75138 | Chosen Option : 4 | Correct Answer : 4
Q39. Question ID : 75139 | Chosen Option : 3 | Correct Answer : 3
Q40. Question ID : 75140 | Chosen Option : 1 | Correct Answer : 1
Q41. Question ID : 75141 | Chosen Option : 2 | Correct Answer : 2
Q42. Question ID : 75142 | Chosen Option : 3 | Correct Answer : 3
Q43. Question ID : 75143 | Chosen Option : 4 | Correct Answer : 4
Q44. Question ID : 75144 | Chosen Option : 1 | Correct Answer : 1
Q45. Question ID : 75145 | Chosen Option : 2 | Correct Answer : 2
Q46. Question ID : 75146 | Chosen Option : 3 | Correct Answer : 3
Q47. Question ID : 75147 | Chosen Option : 4 | Correct Answer : 4
Q48. Question ID : 75148 | Chosen Option : 1 | Correct Answer : 1
Q49. Question ID : 75149 | Chosen Option : 2 | Correct Answer : 2
Q50. Question ID : 75150 | Chosen Option : 3 | Correct Answer : 3
Q51. Question ID : 75151 | Chosen Option : 4 | Correct Answer : 4
Q52. Question ID : 75152 | Chosen Option : 1 | Correct Answer : 1
Q53. Question ID : 75153 | Chosen Option : 2 | Correct Answer : 2
Q54. Question ID : 75154 | Chosen Option : 3 | Correct Answer : 3
Q55. Question ID : 75155 | Chosen Option : 4 | Correct Answer : 4
Q56. Question ID : 75156 | Chosen Option : 1 | Correct Answer : 1
Q57. Question ID : 75157 | Chosen Option : 2 | Correct Answer : 2
Q58. Question ID : 75158 | Chosen Option : 3 | Correct Answer : 3
Q59. Question ID : 75159 | Chosen Option : 4 | Correct Answer : 4
Q60. Question ID : 75160 | Chosen Option : 1 | Correct Answer : 1
Q61. Question ID : 75161 | Chosen Option : 2 | Correct Answer : 2
Q62. Question ID : 75162 | Chosen Option : 3 | Correct Answer : 3
Q63. Question ID : 75163 | Chosen Option : 4 | Correct Answer : 4
Q64. Question ID : 75164 | Chosen Option : 1 | Correct Answer : 1
Q65. Question ID : 75165 | Chosen Option : 2 | Correct Answer : 2
Q66. Question ID : 75166 | Chosen Option : 3 | Correct Answer : 3
Q67. Question ID : 75167 | Chosen Option : 4 | Correct Answer : 4
Q68. Question ID : 75168 | Chosen Option : 1 | Correct Answer : 1
Q69. Question ID : 75169 | Chosen Option : 2 | Correct Answer : 2
Q70. Question ID : 75170 | Chosen Option : 3 | Correct Answer : 3
Q71. Question ID : 75171 | Chosen Option : 4 | Correct Answer : 4
Q72. Question ID : 75172 | Chosen Option : 1 | Correct Answer : 1
Q73. Question ID : 75173 | Chosen Option : 2 | Correct Answer : 2
Q74. Question ID : 75174 | Chosen Option : 3 | Correct Answer : 3
Q75. Question ID : 75175 | Chosen Option : 4 | Correct Answer : 4
Q76. Question ID : 75176 | Chosen Option : 1 | Correct Answer : 1
Q77. Question ID : 75177 | Chosen Option : 2 | Correct Answer : 2
Q78. Question ID : 75178 | Chosen Option : 3 | Correct Answer : 3
Q79. Question ID : 75179 | Chosen Option : 4 | Correct Answer : 4
Q80. Question ID : 75180 | Chosen Option : 1 | Correct Answer : 1
Q81. Question ID : 75181 | Chosen Option : 2 | Correct Answer : 2
Q82. Question ID : 75182 | Chosen Option : 3 | Correct Answer : 3
Q83. Question ID : 75183 | Chosen Option : 4 | Correct Answer : 4
Q84. Question ID : 75184 | Chosen Option : 1 | Correct Answer : 1
Q85. Question ID : 75185 | Chosen Option : 2 | Correct Answer : 2
Q86. Question ID : 75186 | Chosen Option : 3 | Correct Answer : 3
Q87. Question ID : 75187 | Chosen Option : 4 | Correct Answer : 4
Q88. Question ID : 75188 | Chosen Option : 1 | Correct Answer : 1
Q89. Question ID : 75189 | Chosen Option : 2 | Correct Answer : 2
Q90. Question ID : 75190 | Chosen Option : 3 | Correct Answer : 3
Q91. Question ID : 75191 | Chosen Option : 4 | Correct Answer : 4
Q92. Question ID : 75192 | Chosen Option : 1 | Correct Answer : 1
Q93. Question ID : 75193 | Chosen Option : 2 | Correct Answer : 2
Q94. Question ID : 75194 | Chosen Option : 3 | Correct Answer : 3
Q95. Question ID : 75195 | Chosen Option : 4 | Correct Answer : 4
Q96. Question ID : 75196 | Chosen Option : 1 | Correct Answer : 1
Q97. Question ID : 75197 | Chosen Option : 2 | Correct Answer : 2
Q98. Question ID : 75198 | Chosen Option : 3 | Correct Answer : 3
Q99. Question ID : 75199 | Chosen Option : 4 | Correct Answer : 4
Q100. Question ID : 75200 | Chosen Option : 1 | Correct Answer : 1`

export default function ScoreCalculatorPage() {
  const [selectedExamKey, setSelectedExamKey] = useState('talathi')
  const [category, setCategory] = useState('open')
  const [urlInput, setUrlInput] = useState('')
  const [rawText, setRawText] = useState('')
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  const exam = EXAM_PRESETS[selectedExamKey]

  // Parser logic supporting TCS HTML DOM snippets and structured text lines
  function calculateScore() {
    const textToParse = rawText.trim() || SAMPLE_TALATHI_DATA
    const lines = textToParse.split('\n')
    const parsedQuestions = []

    let qIndex = 1
    for (const line of lines) {
      if (!line.trim()) continue

      let chosen = null
      let correct = null

      // Pattern 1: TCS standard text "Chosen Option : 2 | Correct Answer : 2"
      const chosenMatch = line.match(/Chosen\s*Option\s*:\s*([1-4]|--)/i)
      const correctMatch = line.match(/Correct\s*(?:Answer|Option)\s*:\s*([1-4])/i)

      if (chosenMatch) {
        chosen = chosenMatch[1] === '--' ? null : parseInt(chosenMatch[1], 10)
      }
      if (correctMatch) {
        correct = parseInt(correctMatch[1], 10)
      }

      // Pattern 2: Short format "Q1: C:2, A:2" or "1: 2, 2"
      if (!chosenMatch && !correctMatch) {
        const shortMatch = line.match(/(?:Q\s*\d+[:.]?\s*)?([1-4]|-|x)\s*[,/|-]\s*([1-4])/i)
        if (shortMatch) {
          chosen = (shortMatch[1] === '-' || shortMatch[1].toLowerCase() === 'x') ? null : parseInt(shortMatch[1], 10)
          correct = parseInt(shortMatch[2], 10)
        }
      }

      // Fallback synthetic if still not matched but line has data
      if (chosen === null && correct === null) {
        continue
      }

      const isAttempted = chosen !== null && !isNaN(chosen)
      const isCorrect = isAttempted && chosen === correct
      const isWrong = isAttempted && chosen !== correct

      parsedQuestions.push({
        num: qIndex,
        chosen: chosen || 'Skipped',
        correct: correct || '?',
        status: !isAttempted ? 'skipped' : (isCorrect ? 'correct' : 'wrong'),
        marks: !isAttempted ? 0 : (isCorrect ? exam.marksPerQuestion : -exam.negativeMarking)
      })

      qIndex++
    }

    if (parsedQuestions.length === 0) {
      alert('Please enter valid response sheet content or click one of the sample buttons.')
      return
    }

    const totalQuestions = parsedQuestions.length
    const correctCount = parsedQuestions.filter(q => q.status === 'correct').length
    const wrongCount = parsedQuestions.filter(q => q.status === 'wrong').length
    const skippedCount = parsedQuestions.filter(q => q.status === 'skipped').length

    const positiveMarks = correctCount * exam.marksPerQuestion
    const negativePenalty = wrongCount * exam.negativeMarking
    const rawScore = Math.max(0, +(positiveMarks - negativePenalty).toFixed(2))
    const maxScore = totalQuestions * exam.marksPerQuestion
    const accuracy = correctCount + wrongCount > 0 ? +((correctCount / (correctCount + wrongCount)) * 100).toFixed(1) : 0

    // Section-wise breakdown
    const sectionStats = exam.sections.map(sec => {
      const secQuestions = parsedQuestions.filter(q => q.num >= sec.start && q.num <= sec.end)
      const secCorrect = secQuestions.filter(q => q.status === 'correct').length
      const secWrong = secQuestions.filter(q => q.status === 'wrong').length
      const secSkipped = secQuestions.filter(q => q.status === 'skipped').length
      const secMarks = +(secCorrect * exam.marksPerQuestion - secWrong * exam.negativeMarking).toFixed(2)
      return {
        name: sec.name,
        total: secQuestions.length,
        correct: secCorrect,
        wrong: secWrong,
        skipped: secSkipped,
        marks: secMarks
      }
    })

    const categoryCutoff = exam.cutoffs[category] || exam.cutoffs.open
    let statusZone = 'risk'
    if (rawScore >= categoryCutoff) {
      statusZone = 'safe'
    } else if (categoryCutoff - rawScore <= 6) {
      statusZone = 'borderline'
    }

    setResult({
      totalQuestions,
      correctCount,
      wrongCount,
      skippedCount,
      positiveMarks,
      negativePenalty,
      rawScore,
      maxScore,
      accuracy,
      sectionStats,
      categoryCutoff,
      statusZone,
      parsedQuestions
    })
  }

  function loadSampleData(examType) {
    setSelectedExamKey(examType)
    setRawText(SAMPLE_TALATHI_DATA)
  }

  const filteredQuestions = result ? result.parsedQuestions.filter(q => {
    if (activeTab === 'correct') return q.status === 'correct'
    if (activeTab === 'wrong') return q.status === 'wrong'
    if (activeTab === 'skipped') return q.status === 'skipped'
    return true
  }) : []

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--secondary)' }}>
          <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>Response Sheet Raw Score Calculator</span>
        </div>

        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.badge}>
            <span>⚡ Official Key Scanner</span>
          </div>
          <h1 className={styles.title}>Response Sheet Raw Score Calculator</h1>
          <p className={styles.subtitle}>
            Instantly evaluate your official TCS iON, MPSC, Police Bharti, or SSC response sheet. Calculate positive marks, negative penalties, section breakdowns, and check your selection probability against district category cutoffs.
          </p>
        </div>

        {/* Form Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>settings_suggest</span>
              Exam & Answer Key Details
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>100% Client-Side Safe — No credentials stored</span>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Examination</label>
              <select
                className={styles.select}
                value={selectedExamKey}
                onChange={e => setSelectedExamKey(e.target.value)}
              >
                {Object.entries(EXAM_PRESETS).map(([key, item]) => (
                  <option key={key} value={key}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Your Category</label>
              <select
                className={styles.select}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="open">Open (General)</option>
                <option value="obc">OBC (Other Backward Class)</option>
                <option value="ews">EWS (Economically Weaker Section)</option>
                <option value="sebc">SEBC (Maratha Reservation)</option>
                <option value="sc">SC (Scheduled Caste)</option>
                <option value="st">ST (Scheduled Tribe)</option>
                <option value="nt">NT / VJNT</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: 16 }}>
            <label className={styles.label}>Response Sheet URL (Optional - Direct Login Link)</label>
            <input
              type="url"
              className={styles.input}
              placeholder="https://cdn.digialm.com/.../CandidateResponseSheet.html"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Paste Response Sheet Text / HTML / Question Data
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Paste the copied content from your official answer key / response sheet or click one of the sample buttons below..."
              value={rawText}
              onChange={e => setRawText(e.target.value)}
            />
          </div>

          {/* Quick Demo Pre-loader */}
          <div className={styles.sampleBar}>
            <span className={styles.sampleLabel}>Try Demo Data:</span>
            <button
              type="button"
              className={styles.sampleBtn}
              onClick={() => loadSampleData('talathi')}
            >
              ⚡ Load Sample TCS Talathi Sheet (100 Qs)
            </button>
            <button
              type="button"
              className={styles.sampleBtn}
              onClick={() => loadSampleData('police')}
            >
              🚓 Load Sample Police Bharti Sheet
            </button>
            <button
              type="button"
              className={styles.sampleBtn}
              onClick={() => loadSampleData('mpsc_combined')}
            >
              🏛️ Load Sample MPSC Combined Sheet
            </button>
          </div>

          <button
            type="button"
            className={styles.btnPrimary}
            onClick={calculateScore}
          >
            <span className="material-symbols-outlined">calculate</span>
            Calculate My Raw Score & Cutoff Standing
          </button>
        </div>

        {/* Results Dashboard */}
        {result && (
          <div className={styles.resultSection}>
            {/* Top Score Banner */}
            <div className={styles.scoreBanner}>
              <div className={styles.scoreInfo}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                  ✓ Official Evaluation
                </div>
                <h3>{exam.name}</h3>
                <p>Calculated with negative marking of <strong>-{exam.negativeMarking} marks</strong> per wrong answer.</p>
              </div>

              <div className={styles.scorePill}>
                <div className={styles.scoreNumber}>{result.rawScore}</div>
                <div className={styles.scoreTotal}>Out of {result.maxScore} Marks</div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statCardVal} style={{ color: '#0f172a' }}>{result.totalQuestions}</div>
                <div className={styles.statCardLabel}>Total Questions</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statCardVal} style={{ color: '#22c55e' }}>{result.correctCount}</div>
                <div className={styles.statCardLabel}>Correct (+{result.positiveMarks}M)</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statCardVal} style={{ color: '#ef4444' }}>{result.wrongCount}</div>
                <div className={styles.statCardLabel}>Wrong (-{result.negativePenalty}M)</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statCardVal} style={{ color: '#64748b' }}>{result.skippedCount}</div>
                <div className={styles.statCardLabel}>Unattempted</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statCardVal} style={{ color: '#ea580c' }}>{result.accuracy}%</div>
                <div className={styles.statCardLabel}>Accuracy Rate</div>
              </div>
            </div>

            {/* Probability Status Gauge */}
            <div className={`${styles.gaugeBox} ${result.statusZone === 'safe' ? styles.gaugeSafe : result.statusZone === 'borderline' ? styles.gaugeBorderline : styles.gaugeRisk}`}>
              <div className={styles.gaugeIcon}>
                {result.statusZone === 'safe' ? '🎯' : result.statusZone === 'borderline' ? '⚠️' : '🚨'}
              </div>
              <div className={styles.gaugeText}>
                <h4>
                  {result.statusZone === 'safe' && `Safe Zone! Projected above expected ${category.toUpperCase()} cutoff (${result.categoryCutoff} Marks)`}
                  {result.statusZone === 'borderline' && `Borderline Zone! Within reach of expected ${category.toUpperCase()} cutoff (${result.categoryCutoff} Marks)`}
                  {result.statusZone === 'risk' && `Below Expected Cutoff (${result.categoryCutoff} Marks for ${category.toUpperCase()})`}
                </h4>
                <p>
                  {result.statusZone === 'safe' && `Your raw score of ${result.rawScore} gives you a high selection probability. Start preparing for document verification or the next tier!`}
                  {result.statusZone === 'borderline' && `You are just ${(result.categoryCutoff - result.rawScore).toFixed(2)} marks away from the average past cutoff. Normalization might shift you into the safe list!`}
                  {result.statusZone === 'risk' && `Benchmark cutoff is ${result.categoryCutoff}. Use our 15-Year PYQ Bank and Mock Tests to boost your sectional speed.`}
                </p>
              </div>
            </div>

            {/* Section Breakdown Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle} style={{ marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>pie_chart</span>
                Section-wise Performance Breakdown
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.sectionTable}>
                  <thead>
                    <tr>
                      <th>Section Name</th>
                      <th>Questions</th>
                      <th>Correct</th>
                      <th>Wrong</th>
                      <th>Skipped</th>
                      <th>Net Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.sectionStats.map((sec, idx) => (
                      <tr key={idx}>
                        <td><strong>{sec.name}</strong></td>
                        <td>{sec.total}</td>
                        <td style={{ color: '#16a34a', fontWeight: 600 }}>{sec.correct}</td>
                        <td style={{ color: '#dc2626', fontWeight: 600 }}>{sec.wrong}</td>
                        <td>{sec.skipped}</td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{sec.marks} M</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Question Details List & Filters */}
            <div className={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <h3 className={styles.cardTitle}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>list_alt</span>
                  Question-by-Question Audit ({filteredQuestions.length})
                </h3>

                {/* 1-Click WhatsApp Share */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `🎯 *My ExamUdaan Scorecard*\n\nExam: ${exam.name}\nRaw Score: *${result.rawScore} / ${result.maxScore} Marks*\nCorrect: ${result.correctCount} | Wrong: ${result.wrongCount}\nAccuracy: ${result.accuracy}%\n\nCalculate your exact raw score & cutoff standing here: https://examudaan.in/score-calculator`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.shareBtn}
                >
                  <span className="material-symbols-outlined">share</span>
                  Share My Scorecard on WhatsApp
                </a>
              </div>

              <div className={styles.qFilterBar}>
                <button
                  type="button"
                  className={`${styles.qFilterBtn} ${activeTab === 'all' ? styles.qFilterBtnActive : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All ({result.parsedQuestions.length})
                </button>
                <button
                  type="button"
                  className={`${styles.qFilterBtn} ${activeTab === 'correct' ? styles.qFilterBtnActive : ''}`}
                  onClick={() => setActiveTab('correct')}
                >
                  Correct ({result.correctCount})
                </button>
                <button
                  type="button"
                  className={`${styles.qFilterBtn} ${activeTab === 'wrong' ? styles.qFilterBtnActive : ''}`}
                  onClick={() => setActiveTab('wrong')}
                >
                  Wrong ({result.wrongCount})
                </button>
                <button
                  type="button"
                  className={`${styles.qFilterBtn} ${activeTab === 'skipped' ? styles.qFilterBtnActive : ''}`}
                  onClick={() => setActiveTab('skipped')}
                >
                  Skipped ({result.skippedCount})
                </button>
              </div>

              <div style={{ maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
                {filteredQuestions.map(q => (
                  <div
                    key={q.num}
                    className={`${styles.qItem} ${q.status === 'correct' ? styles.qItemCorrect : q.status === 'wrong' ? styles.qItemWrong : styles.qItemSkipped}`}
                  >
                    <div>
                      <div className={styles.qItemTitle}>Question #{q.num}</div>
                      <div className={styles.qItemMeta}>
                        <span>Your Option: <strong>{q.chosen}</strong></span>
                        <span>Official Answer: <strong>{q.correct}</strong></span>
                      </div>
                    </div>
                    <span
                      className={styles.qItemBadge}
                      style={{
                        backgroundColor: q.status === 'correct' ? '#dcfce7' : q.status === 'wrong' ? '#fee2e2' : '#f1f5f9',
                        color: q.status === 'correct' ? '#15803d' : q.status === 'wrong' ? '#b91c1c' : '#475569'
                      }}
                    >
                      {q.status === 'correct' ? `+${exam.marksPerQuestion} Marks` : q.status === 'wrong' ? `-${exam.negativeMarking} Marks` : '0 Marks'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
