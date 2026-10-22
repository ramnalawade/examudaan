// ============================================================
// components/CadreCoverageWidget.js — Cadre Coverage & Donut Chart
// ExamUdaan.in — 343 Papers Visual Analytics matching Screenshot 1
// ============================================================

import styles from './CadreCoverageWidget.module.css'

export default function CadreCoverageWidget() {
  return (
    <section className={styles.section} id="cadre-stats">
      <div className="container">
        <div className={styles.widgetGrid}>
          {/* ── Left Card (Bars) ── */}
          <div className={styles.leftCard}>
            <div className={styles.badgeStats}>
              <span className="material-symbols-outlined">analytics</span>
              <span>Cadre Distribution Stats</span>
            </div>
            <h3 className={styles.title}>
              Comprehensive Cadre Coverage for Maharashtra State Exams
            </h3>
            <p className={styles.desc}>
              Every syllabus is parsed directly from the official Maharashtra Public Service Commission gazette archives to maintain exact exam patterns, negative marking rubrics, and bilingual terminology.
            </p>

            <div className={styles.barsList}>
              <div className={styles.barItem}>
                <div className={styles.barMeta}>
                  <span className={styles.barLabel}>Group B Non-Gazetted</span>
                  <span className={styles.barCount}>89 Papers (26%)</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={`${styles.barFill} ${styles.barFillBlue} ${styles.w26}`} />
                </div>
              </div>

              <div className={styles.barItem}>
                <div className={styles.barMeta}>
                  <span className={styles.barLabel}>Teaching &amp; Academic Framework</span>
                  <span className={styles.barCount}>88 Papers (25.6%)</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={`${styles.barFill} ${styles.barFillPurple} ${styles.w25}`} />
                </div>
              </div>

              <div className={styles.barItem}>
                <div className={styles.barMeta}>
                  <span className={styles.barLabel}>Administrative &amp; Rajyaseva</span>
                  <span className={styles.barCount}>36 Papers (10.5%)</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={`${styles.barFill} ${styles.barFillOrange} ${styles.w10}`} />
                </div>
              </div>

              <div className={styles.barItem}>
                <div className={styles.barMeta}>
                  <span className={styles.barLabel}>Engineering &amp; Technical</span>
                  <span className={styles.barCount}>32 Papers (9.3%)</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={`${styles.barFill} ${styles.barFillIndigo} ${styles.w9}`} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Card (Donut Chart) ── */}
          <div className={styles.rightCard}>
            <div className={styles.donutWrapper}>
              <svg className={styles.donutSvg} viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="18"
                />
                {/* Segment 1: Group B/C (Orange) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="18"
                  strokeDasharray="110 377"
                  strokeDashoffset="0"
                />
                {/* Segment 2: Education & Medical (Green) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="18"
                  strokeDasharray="135 377"
                  strokeDashoffset="-110"
                />
                {/* Segment 3: Rajyaseva (Brown) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#b45309"
                  strokeWidth="18"
                  strokeDasharray="40 377"
                  strokeDashoffset="-245"
                />
                {/* Segment 4: Engineering (Indigo) */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="18"
                  strokeDasharray="35 377"
                  strokeDashoffset="-285"
                />
              </svg>

              <div className={styles.donutCenter}>
                <span className={styles.donutTotal}>343</span>
                <span className={styles.donutSub}>Total Syllabi</span>
              </div>
            </div>

            <div className={styles.legendGrid}>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.dotOrange}`} />
                <span>Group B/C</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.dotGreen}`} />
                <span>Education &amp; Medical</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.dotBrown}`} />
                <span>Rajyaseva</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.dotIndigo}`} />
                <span>Engineering</span>
              </div>
            </div>

            <div className={styles.accessPill}>
              <span className="material-symbols-outlined">lock_open</span>
              <span>100% Free Public Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
