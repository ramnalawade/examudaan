// ============================================================
// OfficialPdfViewer.js — Advanced Interactive PDF Study Workspace
// ExamUdaan.in | 100% Direct Official Sources
// ============================================================

'use client'

import { useState, useMemo, useRef } from 'react'
import styles from './officialPdfViewer.module.css'

export default function OfficialPdfViewer({
  papers = [],
  conductingBody = "Maharashtra Public Service Commission (MPSC)",
  officialWebsite = "https://mpsc.gov.in",
  examName = "MPSC Examination"
}) {
  const [selectedId, setSelectedId] = useState(papers[0]?.id || null)
  const [selectedYear, setSelectedYear] = useState('ALL')
  const [selectedType, setSelectedType] = useState('ALL') // 'ALL' | 'PAPERS' | 'KEYS'
  const viewerRef = useRef(null)

  // Find currently active document
  const activePaper = useMemo(() => {
    return papers.find(p => p.id === selectedId) || papers[0] || null
  }, [papers, selectedId])

  // Look for corresponding pair (Question Paper <-> Answer Key)
  const pairedPaper = useMemo(() => {
    if (!activePaper) return null
    if (activePaper.pairId) {
      return papers.find(p => p.id === activePaper.pairId) || null
    }
    // Fallback heuristic: find same year, opposite type
    return papers.find(p =>
      p.id !== activePaper.id &&
      p.year === activePaper.year &&
      Boolean(p.isAnswerKey) !== Boolean(activePaper.isAnswerKey)
    ) || null
  }, [papers, activePaper])

  // Extract distinct available years for filtering
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(papers.map(p => p.year).filter(Boolean)))
    return years.sort((a, b) => b - a)
  }, [papers])

  // Filtered documents list based on Year and Type
  const filteredPapers = useMemo(() => {
    return papers.filter(p => {
      const matchYear = selectedYear === 'ALL' || p.year === Number(selectedYear)
      const matchType = selectedType === 'ALL'
        ? true
        : selectedType === 'PAPERS'
        ? !p.isAnswerKey
        : p.isAnswerKey
      return matchYear && matchType
    })
  }, [papers, selectedYear, selectedType])

  // Handler to select document and scroll smoothly to viewer
  function handleSelectDoc(docId, shouldScroll = false) {
    setSelectedId(docId)
    if (shouldScroll && viewerRef.current) {
      viewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (!papers || papers.length === 0) return null

  return (
    <div className={styles.workspaceWrapper} ref={viewerRef}>
      {/* ── Top Header & Source Attribution ── */}
      <div className={styles.topBar}>
        <div className={styles.sourceAttribution}>
          <div className={styles.verifiedBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
            <span>100% Official Govt Document</span>
          </div>
          <span className={styles.sourceText}>
            Source: <strong>{conductingBody}</strong> (<a href={officialWebsite} target="_blank" rel="noopener noreferrer">mpsc.gov.in</a>)
          </span>
        </div>

        {/* Year Filter Chips & Type Toggles */}
        <div className={styles.filterControls}>
          <div className={styles.yearPills} role="group" aria-label="Filter by Year">
            <button
              className={`${styles.filterPill} ${selectedYear === 'ALL' ? styles.activeFilterPill : ''}`}
              onClick={() => setSelectedYear('ALL')}
            >
              All Years
            </button>
            {availableYears.map(yr => (
              <button
                key={yr}
                className={`${styles.filterPill} ${selectedYear === String(yr) ? styles.activeFilterPill : ''}`}
                onClick={() => setSelectedYear(String(yr))}
              >
                {yr}
              </button>
            ))}
          </div>

          <div className={styles.typeSegmented} role="group" aria-label="Filter by Document Type">
            <button
              className={`${styles.typeBtn} ${selectedType === 'ALL' ? styles.activeTypeBtn : ''}`}
              onClick={() => setSelectedType('ALL')}
            >
              All ({papers.length})
            </button>
            <button
              className={`${styles.typeBtn} ${selectedType === 'PAPERS' ? styles.activeTypeBtn : ''}`}
              onClick={() => setSelectedType('PAPERS')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>description</span>
              Papers
            </button>
            <button
              className={`${styles.typeBtn} ${selectedType === 'KEYS' ? styles.activeTypeBtn : ''}`}
              onClick={() => setSelectedType('KEYS')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>task_alt</span>
              Answer Keys
            </button>
          </div>
        </div>
      </div>

      {/* ── Document Selector Chips Grid (Clean, Scrollbar-Free) ── */}
      <div className={styles.docSelectorBar}>
        <span className={styles.docSelectorLabel}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>library_books</span>
          Select Paper:
        </span>
        <div className={styles.chipsScrollContainer}>
          {filteredPapers.map(doc => {
            const isSelected = activePaper && doc.id === activePaper.id
            return (
              <button
                key={doc.id}
                className={`${styles.docChip} ${isSelected ? styles.activeDocChip : ''}`}
                onClick={() => handleSelectDoc(doc.id, false)}
                title={doc.title || doc.label}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: isSelected ? 'var(--primary, #EA580C)' : doc.isAnswerKey ? '#16A34A' : '#D97706' }}>
                  {doc.isAnswerKey ? 'task_alt' : 'description'}
                </span>
                <span className={styles.chipText}>{doc.label}</span>
                {doc.badge && (
                  <span className={doc.isAnswerKey ? styles.keyBadge : styles.chipBadge}>
                    {doc.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Active Viewer Canvas Container ── */}
      {activePaper && (
        <div className={styles.viewerContainer}>
          {/* Active Document Toolbar */}
          <div className={styles.viewerToolbar}>
            <div className={styles.docInfo}>
              <div className={styles.docTitleRow}>
                <span className={activePaper.isAnswerKey ? styles.typeTagKey : styles.typeTagPaper}>
                  {activePaper.isAnswerKey ? 'Official Answer Key' : 'Official Question Paper'}
                </span>
                <span className={styles.docYearTag}>{activePaper.year}</span>
                {activePaper.size && <span className={styles.docSizeTag}>{activePaper.size}</span>}
              </div>
              <h3 className={styles.docTitle}>{activePaper.title || activePaper.label}</h3>
            </div>

            <div className={styles.toolbarActions}>
              {/* Quick Pair Switcher Button */}
              {pairedPaper && (
                <button
                  onClick={() => handleSelectDoc(pairedPaper.id, false)}
                  className={styles.pairSwitcherBtn}
                  title={`Switch to ${pairedPaper.label}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    {pairedPaper.isAnswerKey ? 'task_alt' : 'description'}
                  </span>
                  <span>{pairedPaper.isAnswerKey ? 'Check Answer Key' : 'View Question Paper'}</span>
                </button>
              )}

              {/* Fullscreen Button */}
              <a
                href={activePaper.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionBtnOutline}
                title="Open in Fullscreen / New Tab"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
                <span>Fullscreen</span>
              </a>

              {/* Direct Download Button */}
              <a
                href={activePaper.url}
                download
                className={styles.actionBtnPrimary}
                title="Download PDF directly to your device"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* Embedded PDF Viewer Iframe */}
          <div className={styles.iframeBox}>
            <iframe
              src={`${activePaper.url}#view=FitH&toolbar=1`}
              className={styles.pdfIframe}
              title={activePaper.label}
              loading="lazy"
            />
            <div className={styles.iframeFooter}>
              <div className={styles.iframeFooterLeft}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#22C55E' }}>check_circle</span>
                <span>Direct PDF from MPSC Public Archive • 100% Genuine</span>
              </div>
              <a href={activePaper.url} target="_blank" rel="noopener noreferrer" className={styles.iframeFooterLink}>
                Direct Source Link ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Document Directory Table / Practice Matrix ── */}
      <div className={styles.directorySection}>
        <div className={styles.directoryHeader}>
          <h4 className={styles.directoryTitle}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>menu_book</span>
            Complete Question Papers & Answer Keys Directory ({papers.length} Documents)
          </h4>
          <span className={styles.directorySubtitle}>
            Click <strong>&quot;Read in Viewer&quot;</strong> to instantly preview any paper above or download for offline revision.
          </span>
        </div>

        <div className={styles.matrixList}>
          {papers.map(doc => {
            const isCurrentlyReading = activePaper && doc.id === activePaper.id
            return (
              <div
                key={doc.id}
                className={`${styles.matrixCard} ${isCurrentlyReading ? styles.matrixCardActive : ''}`}
              >
                <div className={styles.matrixCardLeft}>
                  <div
                    className={styles.matrixYearBox}
                    style={{
                      background: doc.isAnswerKey ? '#F0FDF4' : '#FFF7ED',
                      borderColor: doc.isAnswerKey ? '#BBF7D0' : '#FFEDD5',
                      color: doc.isAnswerKey ? '#15803D' : '#C2410C',
                    }}
                  >
                    <span className={styles.matrixYearText}>{doc.year || '2026'}</span>
                    <span className={styles.matrixYearSub}>
                      {doc.isAnswerKey ? 'KEY' : 'PAPER'}
                    </span>
                  </div>

                  <div className={styles.matrixInfo}>
                    <div className={styles.matrixTitleRow}>
                      <h4 className={styles.matrixTitle}>{doc.title || doc.label}</h4>
                      {isCurrentlyReading && (
                        <span className={styles.nowReadingTag}>
                          <span className={styles.pulseDot} />
                          Now Reading
                        </span>
                      )}
                    </div>
                    <div className={styles.matrixMetaRow}>
                      <span className={styles.metaItem}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>account_balance</span>
                        {conductingBody}
                      </span>
                      {doc.size && (
                        <span className={styles.metaItem}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>attach_file</span>
                          {doc.size}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.matrixActions}>
                  <button
                    onClick={() => handleSelectDoc(doc.id, true)}
                    className={`${styles.viewBtn} ${isCurrentlyReading ? styles.viewBtnActive : ''}`}
                    title="Load document into the interactive reader above"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      {isCurrentlyReading ? 'visibility' : 'menu_book'}
                    </span>
                    <span>{isCurrentlyReading ? 'Reading Now' : 'Read in Viewer'}</span>
                  </button>

                  <a
                    href={doc.url}
                    download
                    className={styles.downloadBtn}
                    title="Download PDF directly"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                    <span>Download</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
