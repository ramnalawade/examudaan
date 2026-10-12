'use client'

import { T } from '../context/LanguageContext'
import {
  trackResultPdfView,
  trackOutboundLinkClick,
} from '../lib/analytics'
import styles from './resultActionButtons.module.css'

export default function ResultActionButtons({
  resultLink,
  pdfLink,
  title = '',
  orgName = '',
}) {
  return (
    <div className={styles.resultActionsRow}>
      {resultLink && (
        <a
          href={resultLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-primary btn-primary-lg ${styles.checkResultBtn}`}
          id="check-result-btn"
          onClick={() => {
            trackResultPdfView({ result_title: title, organization: orgName })
            trackOutboundLinkClick({ link_url: resultLink })
          }}
        >
          <span className="material-symbols-outlined fill" style={{ fontSize: 18 }}>open_in_new</span>
          <T k="card.check_result" fallback="Check Result / Download Scorecard" />
        </a>
      )}

      {pdfLink && pdfLink !== resultLink && (
        <a
          href={pdfLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-outline ${styles.resultPdfBtn}`}
          id="result-pdf-btn"
          onClick={() => {
            trackResultPdfView({ result_title: title, organization: orgName })
            trackOutboundLinkClick({ link_url: pdfLink })
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>picture_as_pdf</span>
          <T k="detail.view_pdf" fallback="Official Notification PDF" />
        </a>
      )}
    </div>
  )
}
