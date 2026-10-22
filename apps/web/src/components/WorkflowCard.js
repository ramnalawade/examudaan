import Link from 'next/link'
import styles from './WorkflowCard.module.css'

export default function WorkflowCard({ workflow }) {
  if (!workflow) return null

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={`material-symbols-outlined ${styles.titleIcon}`}>
            hub
          </span>
          <span>{workflow.title}</span>
        </h3>
        {workflow.goal && <p className={styles.goal}>{workflow.goal}</p>}
      </div>

      {/* Tools In This Stack */}
      {workflow.tools && workflow.tools.length > 0 && (
        <div className={styles.toolsRow}>
          <span className={styles.stackLabel}>AI Stack:</span>
          {workflow.tools.map((t, idx) => (
            <Link
              key={idx}
              href={`/ai-tools/${t.slug}`}
              className={styles.toolPill}
            >
              <span>{t.name}</span>
              {t.role && <span className={styles.toolRole}>({t.role})</span>}
            </Link>
          ))}
        </div>
      )}

      {/* Step by Step Execution */}
      <div className={styles.body}>
        <div className={styles.stepsList}>
          {workflow.steps &&
            workflow.steps.map((st, i) => (
              <div key={i} className={styles.stepItem}>
                <div className={styles.stepNumber}>{i + 1}</div>
                <div className={styles.stepContent}>{st}</div>
              </div>
            ))}
        </div>

        {/* Time Saved / Edge */}
        {workflow.timeSaved && (
          <div className={styles.timeSavedBanner}>
            <span className={`material-symbols-outlined ${styles.timeSavedIcon}`}>
              timer
            </span>
            <span>
              <strong>Study Edge: </strong>
              {workflow.timeSaved}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
