'use client'

import styles from '../careerDetail.module.css'

export default function PrintButton() {
  return (
    <button
      type="button"
      className={styles.btnAction}
      onClick={() => window.print()}
      title="Save as PDF or Print Roadmap"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>print</span>
      Print / Save Roadmap PDF
    </button>
  )
}
