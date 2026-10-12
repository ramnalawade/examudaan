'use client'

import {
  trackJobApplyClick,
  trackAnswerKeyDownload,
  trackOutboundLinkClick,
} from '../lib/analytics'
import SaveJobButton from './SaveJobButton'

export default function DetailActionButtons({
  applyLink,
  detailPageLink,
  pdfLink,
  isClosed,
  isWalkIn,
  notificationId,
  title,
  organization = '',
  applyLabel = 'Apply Online',
  detailsLabel = 'View Official Details',
  pdfLabel = 'Official Notification PDF',
}) {
  return (
    <div className="detail-actions-row">
      {/* Walk-in notice */}
      {isWalkIn && (
        <span className="walk-in-pill">
          <span className="material-symbols-outlined btn-icon-18">how_to_reg</span>
          Walk-in Interview — No online application required
        </span>
      )}

      {/* Online Apply button */}
      {!isClosed && !isWalkIn && applyLink && (
        <a
          href={applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary btn-primary-lg"
          id="apply-online-btn"
          onClick={() => {
            trackJobApplyClick({ job_title: title, organization, job_id: notificationId })
            trackOutboundLinkClick({ link_url: applyLink })
          }}
        >
          <span className="material-symbols-outlined fill btn-icon-18">open_in_new</span>
          {applyLabel}
        </a>
      )}

      {/* Walk-in: official details link */}
      {isWalkIn && detailPageLink && (
        <a
          href={detailPageLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary btn-primary-lg walk-in-btn-blue"
          id="view-details-btn"
          onClick={() => {
            trackJobApplyClick({ job_title: title, organization, job_id: notificationId })
            trackOutboundLinkClick({ link_url: detailPageLink })
          }}
        >
          <span className="material-symbols-outlined fill btn-icon-18">open_in_new</span>
          {detailsLabel}
        </a>
      )}

      {/* Official Notification PDF link */}
      {pdfLink && (
        <a
          href={pdfLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline pdf-btn-padded"
          id="notification-pdf-btn"
          onClick={() => {
            trackAnswerKeyDownload({ exam_name: title, year: '', file_name: pdfLink })
            trackOutboundLinkClick({ link_url: pdfLink })
          }}
        >
          <span className="material-symbols-outlined btn-icon-18">picture_as_pdf</span>
          {pdfLabel}
        </a>
      )}

      {/* Save / Bookmark Button */}
      {notificationId && (
        <SaveJobButton
          notificationId={notificationId}
          variant="button"
          title={title}
        />
      )}
    </div>
  )
}
