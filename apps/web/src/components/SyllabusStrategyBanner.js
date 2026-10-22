// ============================================================
// components/SyllabusStrategyBanner.js — 2-Min Strategy Banner
// ExamUdaan.in — Direct interactive study planner & mock bridge
// ============================================================

import Link from 'next/link'
import styles from './SyllabusStrategyBanner.module.css'

export default function SyllabusStrategyBanner() {
  return (
    <section className={styles.section} id="strategy-planner">
      <div className="container">
        <div className={styles.bannerCard}>
          <div className={styles.contentBlock}>
            <div className={styles.tagPill}>
              <span className="material-symbols-outlined">explore</span>
              <span>Ensure Where to Begin Your Prep?</span>
            </div>
            <h2 className={styles.title}>
              Build your personalized exam strategy in 2 minutes.
            </h2>
            <p className={styles.desc}>
              Answer 4 simple questions about your educational qualification and preferred service cadre. We will generate your step-by-step syllabus map and recommended PYQ timeline.
            </p>
          </div>

          <div className={styles.actionRow}>
            <Link href="/study-planner" className={styles.btnQuiz}>
              <span>Take 2-Min Roadmap Quiz</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link href="/mock-tests" className={styles.btnMocks}>
              <span className="material-symbols-outlined">quiz</span>
              <span>Free Topic Mocks</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
