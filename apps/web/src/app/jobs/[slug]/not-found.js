import React from 'react'
import Link from 'next/link'
import styles from './page.module.css'

export default function JobNotFound() {
  return (
    <div className={`container ${styles.notFoundWrapper}`}>
      <div className={styles.notFoundCard}>
        <span className={styles.notFoundIcon} role="img" aria-label="Clipboard">📋</span>
        <h1 className={styles.notFoundTitle}>
          Notification Updated or Relocated
        </h1>
        <p className={styles.notFoundDesc}>
          ही जाहिरात मुदत संपल्यामुळे किंवा नवीन माहिती प्रसिद्ध झाल्यामुळे अद्ययावत केली गेली आहे. खालील लिंकवरून सध्या सुरू असलेल्या अधिकृत भरती जाहिराती पहा.
        </p>
        <div className={styles.notFoundActions}>
          <Link href="/jobs" className={`btn-primary ${styles.notFoundPrimaryBtn}`}>
            View All Active Jobs →
          </Link>
          <Link href="/mpsc-pyq" className={`btn-outline ${styles.notFoundOutlineBtn}`}>
            🏛️ MPSC Question Papers & Keys
          </Link>
        </div>
      </div>
    </div>
  )
}
