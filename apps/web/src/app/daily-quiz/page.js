// ============================================================
// daily-quiz/page.js — Daily 10-Question Habit Streak Quiz
// ExamUdaan.in | 5 Min Blitz Mode | WhatsApp Streak Badges
// Fully responsive across Mobile, Tablet, Laptop, and Desktop
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DAILY_QUIZ_QUESTIONS } from '../../lib/dailyQuizData'
import styles from './dailyQuiz.module.css'

export default function DailyQuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answers, setAnswers] = useState({}) // { [qId]: { chosen: int, isCorrect: bool } }
  const [quizFinished, setQuizFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [streak, setStreak] = useState(1)

  // Load streak from localStorage
  useEffect(() => {
    try {
      const storedStreak = parseInt(localStorage.getItem('eu_daily_streak') || '1', 10)
      setStreak(storedStreak)
    } catch {
      // ignore
    }
  }, [])

  // Timer countdown
  useEffect(() => {
    if (quizFinished) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setQuizFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [quizFinished])

  const q = DAILY_QUIZ_QUESTIONS[currentIndex]
  const currentAnswer = answers[q.id]

  function handleSelectOption(index) {
    if (currentAnswer !== undefined) return // already answered
    setSelectedOption(index)

    const isCorrect = index === q.correct
    setAnswers(prev => ({
      ...prev,
      [q.id]: { chosen: index, isCorrect }
    }))
  }

  function handleNext() {
    setSelectedOption(null)
    if (currentIndex < DAILY_QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      finishQuiz()
    }
  }

  function finishQuiz() {
    setQuizFinished(true)
    // Increment streak
    try {
      const today = new Date().toISOString().slice(0, 10)
      const lastQuizDate = localStorage.getItem('eu_last_quiz_date')
      let newStreak = streak

      if (lastQuizDate !== today) {
        newStreak = streak + 1
        localStorage.setItem('eu_daily_streak', newStreak.toString())
        localStorage.setItem('eu_last_quiz_date', today)
        setStreak(newStreak)
      }
    } catch {
      // ignore
    }
  }

  function handleRestart() {
    setCurrentIndex(0)
    setSelectedOption(null)
    setAnswers({})
    setQuizFinished(false)
    setTimeLeft(300)
  }

  const score = Object.values(answers).filter(a => a.isCorrect).length
  const minutes = Math.floor(timeLeft / 60)
  const seconds = (timeLeft % 60).toString().padStart(2, '0')
  const progressPercent = ((currentIndex + 1) / DAILY_QUIZ_QUESTIONS.length) * 100

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--secondary)' }}>
          <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>Daily 10-Question Streak Quiz</span>
        </div>

        {/* Streak & Timer Top Bar */}
        <div className={styles.streakBar}>
          <div className={styles.streakPill}>
            <span>🔥</span>
            <span>{streak} Day Streak Active!</span>
          </div>

          <div className={styles.timerPill}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ea580c' }}>schedule</span>
            <span>{minutes}:{seconds} Remaining</span>
          </div>
        </div>

        {!quizFinished ? (
          <>
            {/* Hero Heading */}
            <div className={styles.hero}>
              <h1 className={styles.title}>Daily High-Yield GK Blitz</h1>
              <p className={styles.subtitle}>
                10 handpicked questions daily (5 Maharashtra + 5 National GK & Aptitude). Keep your streak alive to unlock weekly topper badges!
              </p>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>Question {currentIndex + 1} of {DAILY_QUIZ_QUESTIONS.length}</span>
                <span>{progressPercent.toFixed(0)}% Completed</span>
              </div>
              <div className={styles.progressBarBg}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className={styles.quizCard}>
              <div className={styles.metaRow}>
                <span className={styles.subjectBadge}>{q.subject}</span>
                <span className={styles.examBadge}>Target: {q.examTag}</span>
              </div>

              <h2 className={styles.questionText}>
                {currentIndex + 1}. {q.question}
              </h2>

              <div className={styles.optionsList}>
                {q.options.map((opt, idx) => {
                  let optClass = styles.optionBtn
                  if (currentAnswer !== undefined) {
                    if (idx === q.correct) {
                      optClass += ` ${styles.optionBtnCorrect}`
                    } else if (idx === currentAnswer.chosen) {
                      optClass += ` ${styles.optionBtnWrong}`
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={optClass}
                      onClick={() => handleSelectOption(idx)}
                      disabled={currentAnswer !== undefined}
                    >
                      <span className={styles.optionIndex}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  )
                })}
              </div>

              {/* Instant Explanation Box */}
              {currentAnswer !== undefined && (
                <div className={styles.explanationBox}>
                  <strong>
                    {currentAnswer.isCorrect ? '✅ बरोबर उत्तर!' : '❌ चूक उत्तर — योग्य उत्तर पाहा:'}
                  </strong>
                  {q.explanation}
                </div>
              )}

              {/* Action Bar */}
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={handleNext}
                  disabled={currentAnswer === undefined}
                  style={{ opacity: currentAnswer === undefined ? 0.6 : 1 }}
                >
                  <span>{currentIndex < DAILY_QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Final Score'}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Finished Result Modal */
          <div className={styles.modalCard}>
            <div className={styles.scoreCircle}>
              <div className={styles.scoreCircleVal}>{score}</div>
              <div className={styles.scoreCircleSub}>/ 10 Marks</div>
            </div>

            <h2 className={styles.modalTitle}>
              {score >= 8 ? '🎉 उत्कृष्ट कामगिरी!' : score >= 5 ? '👍 छान प्रयत्न!' : '📚 सराव वाढवा!'}
            </h2>

            <p className={styles.modalDesc}>
              {score >= 8
                ? `अप्रतिम! तुम्ही आजच्या दैनंदिन प्रश्नमंजुषामध्ये ${score}/१० गुण मिळवले आहेत. तुमची सातत्यता (🔥 ${streak} Days Streak) कायम ठेवा!`
                : `तुम्ही १० पैकी ${score} प्रश्नांची बरोबर उत्तरे दिली. दररोज सकाळी ५ मिनिटांचा सराव करून आपला गुण वाढवा.`}
            </p>

            {/* 1-Click WhatsApp Share */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `🔥 *I just scored ${score}/10 in today's ExamUdaan Daily GK Challenge!*\n\nDay ${streak} Streak Active ⚡\nCan you beat my score? Attempt today's free 5-minute quiz here: https://examudaan.in/daily-quiz`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shareBtn}
            >
              <span className="material-symbols-outlined">share</span>
              Share My Score & Streak on WhatsApp
            </a>

            <div style={{ display: 'flex', gap: 10, marginTop: 14, width: '100%', flexWrap: 'wrap' }}>
              <Link
                href="/pyq"
                style={{
                  flex: 1, minWidth: 160, padding: '12px 16px', borderRadius: 10,
                  background: 'var(--surface-container-lowest, #fff)', border: '1.5px solid var(--outline-variant, #e2e8f0)',
                  color: 'var(--on-surface, #1e293b)', textDecoration: 'none', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary, #ea580c)' }}>menu_book</span>
                <span>१५ वर्षे PYQ सोडवा</span>
              </Link>

              <Link
                href="/current-affairs"
                style={{
                  flex: 1, minWidth: 160, padding: '12px 16px', borderRadius: 10,
                  background: 'var(--surface-container-lowest, #fff)', border: '1.5px solid var(--outline-variant, #e2e8f0)',
                  color: 'var(--on-surface, #1e293b)', textDecoration: 'none', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#2563eb' }}>newspaper</span>
                <span>दैनिक घडामोडी वाचा</span>
              </Link>
            </div>

            <button
              type="button"
              className={styles.retryBtn}
              onClick={handleRestart}
              style={{ marginTop: 12 }}
            >
              Try Again / Re-attempt
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
