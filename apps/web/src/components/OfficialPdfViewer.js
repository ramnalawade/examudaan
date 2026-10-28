// ============================================================
// OfficialPdfViewer.js — Advanced Interactive PDF Study Workspace
// ExamUdaan.in | 100% Direct Official Sources
// Reusable Tool across Exam Syllabus, Question Papers & Answer Keys
// ============================================================

'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import styles from './officialPdfViewer.module.css'
import { toSecureDocUrl } from '../lib/docObfuscate.js'
import {
  trackAnswerKeyDownload,
  trackResultPdfView,
  trackOutboundLinkClick,
} from '@/lib/analytics'

// Bulletproof security & embed check: ONLY embed verified PDFs
// NEVER embed internal site routes or external web portals into iframes
function checkIsPdf(url) {
  if (!url || typeof url !== 'string') return false
  const clean = url.trim().toLowerCase().split('?')[0].split('#')[0]
  if (
    clean === '/question-papers' ||
    clean === '/answer-keys' ||
    clean === '/mpsc-pyq' ||
    clean === '/jobs' ||
    clean === '/results' ||
    clean.startsWith('/syllabus') ||
    clean.startsWith('/jobs/') ||
    clean.startsWith('/results/') ||
    clean.startsWith('/alerts')
  ) {
    return false
  }
  return (
    clean.endsWith('.pdf') ||
    clean.startsWith('/downloads/') ||
    clean.startsWith('/question-papers/mpsc/') ||
    clean.startsWith('/api/mpsc-pdf/')
  )
}

export default function OfficialPdfViewer({
  papers = [],
  pyqLinks = [],
  conductingBody = "Government Examination Board",
  officialWebsite = "",
  examName = "Government Examination",
  initialSelectedId = null,
  onSelectDoc = null,
  title = null,
  subtitle = null,
  showSelectorChips = true,
  showDirectorySection = true
}) {
  // Only accept verified real downloaded papers in /downloads/ or /question-papers/
  const allDocuments = useMemo(() => {
    if (!papers || papers.length === 0) return []
    return papers
      .filter(p => checkIsPdf(p?.url))
      .map(p => {
        const secureUrl = toSecureDocUrl(p?.url)
        return secureUrl !== p?.url ? { ...p, url: secureUrl } : p
      })
  }, [papers])

  const [selectedId, setSelectedId] = useState(initialSelectedId || allDocuments[0]?.id || null)
  const [selectedYear, setSelectedYear] = useState('ALL')
  const [selectedType, setSelectedType] = useState('ALL') // 'ALL' | 'PAPERS' | 'KEYS'
  const [searchQuery, setSearchQuery] = useState('')
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(true)
  const [loadingSlow, setLoadingSlow] = useState(false)
  const viewerRef = useRef(null)

  // Find currently active document
  const activePaper = useMemo(() => {
    return allDocuments.find(p => p.id === selectedId) || allDocuments[0] || null
  }, [allDocuments, selectedId])

  // Sync selectedId when parent passes a new initialSelectedId or documents list changes
  useEffect(() => {
    if (initialSelectedId) {
      setSelectedId(initialSelectedId)
    } else if (allDocuments.length > 0) {
      setSelectedId(prev => (prev && allDocuments.some(d => d.id === prev) ? prev : allDocuments[0].id))
    }
  }, [initialSelectedId, allDocuments])

  // Reset loading state whenever active document URL changes
  useEffect(() => {
    setPdfLoading(true)
    setLoadingSlow(false)

    // Fast automatic dismissal fallback:
    // Chromium/Edge/Firefox embedded PDF viewers (PDFium plugin) often do not emit standard DOM `load` events on the <iframe>.
    // If the browser starts rendering the PDF, dismiss the loading overlay after 1.2s so it never blocks an already rendered document.
    const autoDismissTimer = setTimeout(() => {
      setPdfLoading(false)
    }, 1200)

    const slowTimer = setTimeout(() => {
      setLoadingSlow(true)
    }, 5000)

    return () => {
      clearTimeout(autoDismissTimer)
      clearTimeout(slowTimer)
    }
  }, [activePaper?.url])

  // Extract clean domain name for display
  const domainName = useMemo(() => {
    if (!officialWebsite) return null
    try {
      const parsed = new URL(officialWebsite)
      return parsed.hostname.replace(/^www\./, '')
    } catch {
      return officialWebsite
    }
  }, [officialWebsite])

  // Strict check if currently active document is a direct PDF file
  const isEmbeddablePdf = useMemo(() => {
    return checkIsPdf(activePaper?.url)
  }, [activePaper])

  // Direct explicit lookup of Question Paper and Answer Key in allDocuments
  const questionPaperDoc = useMemo(() => {
    if (!activePaper) return null
    if (!activePaper.isAnswerKey) return activePaper
    if (activePaper.pairId) {
      return allDocuments.find(p => p.id === activePaper.pairId && !p.isAnswerKey) || null
    }
    if (allDocuments.length <= 2) {
      return allDocuments.find(p => !p.isAnswerKey) || null
    }
    return allDocuments.find(p => !p.isAnswerKey && p.year === activePaper.year) || null
  }, [allDocuments, activePaper])

  const answerKeyDoc = useMemo(() => {
    if (!activePaper) return null
    if (activePaper.isAnswerKey) return activePaper
    if (activePaper.pairId) {
      return allDocuments.find(p => p.id === activePaper.pairId && p.isAnswerKey) || null
    }
    if (allDocuments.length <= 2) {
      return allDocuments.find(p => p.isAnswerKey) || null
    }
    return allDocuments.find(p => p.isAnswerKey && p.year === activePaper.year && p.pairId === activePaper.id) || null
  }, [allDocuments, activePaper])

  // Look for corresponding pair (Question Paper <-> Answer Key)
  const pairedPaper = useMemo(() => {
    if (!activePaper) return null
    if (activePaper.pairId) {
      return allDocuments.find(p => p.id === activePaper.pairId) || null
    }
    // Fallback heuristic: find opposite type in current exam
    return allDocuments.find(p =>
      p.id !== activePaper.id &&
      Boolean(p.isAnswerKey) !== Boolean(activePaper.isAnswerKey)
    ) || null
  }, [allDocuments, activePaper])

  // Extract distinct available years for filtering
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(allDocuments.map(p => p.year).filter(Boolean)))
    return years.sort((a, b) => b - a)
  }, [allDocuments])

  // Filtered documents list based on Year, Type, and Search Query
  const filteredPapers = useMemo(() => {
    return allDocuments.filter(p => {
      const matchYear = selectedYear === 'ALL' || p.year === Number(selectedYear)
      const matchType = selectedType === 'ALL'
        ? true
        : selectedType === 'PAPERS'
        ? !p.isAnswerKey
        : p.isAnswerKey

      const query = searchQuery.trim().toLowerCase()
      const matchQuery = !query ||
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.label && p.label.toLowerCase().includes(query)) ||
        (p.year && String(p.year).includes(query))

      return matchYear && matchType && matchQuery
    })
  }, [allDocuments, selectedYear, selectedType, searchQuery])

  // Handler to select document and notify parent
  function handleSelectDoc(docId, shouldScroll = false) {
    setSelectedId(docId)
    if (onSelectDoc) {
      onSelectDoc(docId)
    }
    if (shouldScroll && viewerRef.current) {
      viewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (!allDocuments || allDocuments.length === 0) return null

  return (
    <div className={styles.workspaceWrapper} ref={viewerRef} id="official-pdf-workspace">
      {/* ── Top Header & Source Attribution ── */}
      <div className={styles.topBar}>
        <div className={styles.sourceAttribution}>
          <div className={styles.verifiedBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
            <span>100% Official Govt Document</span>
          </div>
          <span className={styles.sourceText}>
            Source: <strong>{conductingBody}</strong>
            {officialWebsite && (
              <> (<a href={officialWebsite} target="_blank" rel="noopener noreferrer">{domainName || 'Official Portal'}</a>)</>
            )}
          </span>
        </div>

        {/* Year Filter Chips & Type Toggles */}
        <div className={styles.filterControls}>
          {availableYears.length > 1 && (
            <div className={styles.yearPills} role="group" aria-label="Filter by Year">
              <button
                type="button"
                className={`${styles.filterPill} ${selectedYear === 'ALL' ? styles.activeFilterPill : ''}`}
                onClick={() => setSelectedYear('ALL')}
              >
                All Years
              </button>
              {availableYears.map(yr => (
                <button
                  key={yr}
                  type="button"
                  className={`${styles.filterPill} ${selectedYear === String(yr) ? styles.activeFilterPill : ''}`}
                  onClick={() => setSelectedYear(String(yr))}
                >
                  {yr}
                </button>
              ))}
            </div>
          )}

          <div className={styles.typeSegmented} role="group" aria-label="Filter by Document Type">
            <button
              type="button"
              className={`${styles.typeBtn} ${selectedType === 'ALL' ? styles.activeTypeBtn : ''}`}
              onClick={() => setSelectedType('ALL')}
            >
              All ({allDocuments.length})
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${selectedType === 'PAPERS' ? styles.activeTypeBtn : ''}`}
              onClick={() => setSelectedType('PAPERS')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>description</span>
              Papers
            </button>
            <button
              type="button"
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
      {showSelectorChips && allDocuments.length <= 40 && (
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
                  type="button"
                  className={`${styles.docChip} ${isSelected ? styles.activeDocChip : ''}`}
                  onClick={() => handleSelectDoc(doc.id, false)}
                  title={doc.title || doc.label}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 15,
                      color: isSelected
                        ? 'var(--primary, #EA580C)'
                        : doc.isAnswerKey
                        ? '#16A34A'
                        : '#D97706'
                    }}
                  >
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
      )}

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
              {/* Question / Answer Segmented Switch — Hide Answer Key if not available */}
              {answerKeyDoc ? (
                <div className={styles.qaSegmentedSwitch} role="group" aria-label="Toggle Question Paper and Answer Key">
                  {questionPaperDoc && (
                    <button
                      type="button"
                      className={!activePaper.isAnswerKey ? styles.qaSwitchActivePaper : styles.qaSwitchInactive}
                      onClick={() => handleSelectDoc(questionPaperDoc.id, false)}
                      title="View Question Paper"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>description</span>
                      <span>Question Paper</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className={activePaper.isAnswerKey ? styles.qaSwitchActiveKey : styles.qaSwitchInactive}
                    onClick={() => handleSelectDoc(answerKeyDoc.id, false)}
                    title="View Official Answer Key"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>task_alt</span>
                    <span>Answer Key</span>
                  </button>
                </div>
              ) : questionPaperDoc && (
                <div className={styles.qaSegmentedSwitch} role="group" aria-label="Question Paper">
                  <button
                    type="button"
                    className={styles.qaSwitchActivePaper}
                    onClick={() => handleSelectDoc(questionPaperDoc.id, false)}
                    title="Official Question Paper"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>description</span>
                    <span>Question Paper</span>
                  </button>
                </div>
              )}

              {/* Fullscreen / Open in New Tab Button */}
              <a
                href={activePaper.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionBtnOutline}
                title={isEmbeddablePdf ? "Open in Fullscreen / New Tab" : "Open official portal"}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  {isEmbeddablePdf ? 'open_in_new' : 'launch'}
                </span>
                <span>{isEmbeddablePdf ? 'Fullscreen' : 'Official Portal'}</span>
              </a>

              {/* Official External Portal Launch Button (only for external links) */}
              {!isEmbeddablePdf && (
                <a
                  href={activePaper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackAnswerKeyDownload({
                      exam_name: activePaper?.title || activePaper?.label || '',
                      year: activePaper?.year || '',
                      file_name: activePaper.url,
                    })
                    trackOutboundLinkClick({ link_url: activePaper.url })
                  }}
                  className={styles.actionBtnPrimary}
                  title="Open official government portal"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    open_in_new
                  </span>
                  <span>Open Govt Link ↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Direct Embedded PDF Viewer — Opens by default without requiring interstitial click */}
          {isEmbeddablePdf && (
            <div className={styles.iframeBox}>
              {/* Direct Mobile Quick Action Banner — Opens PDF with 1 tap */}
              <div className={styles.mobileDirectBanner}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>smartphone</span>
                  <span>Direct Mobile PDF View</span>
                </div>
                <a
                  href={activePaper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackAnswerKeyDownload({
                      exam_name: activePaper?.title || activePaper?.label || '',
                      year: activePaper?.year || '',
                      file_name: activePaper.url,
                    })
                    trackOutboundLinkClick({ link_url: activePaper.url })
                  }}
                  className={styles.mobileDirectLink}
                  title="Open full PDF directly in mobile browser"
                >
                  <span>📱 Open Full PDF ↗</span>
                </a>
              </div>

              <div className={styles.viewerSubHeader}>
                <div className={styles.viewerSubHeaderLeft}>
                  <span className={`material-symbols-outlined ${styles.viewerBookIcon}`}>menu_book</span>
                  <span>Official Viewer: <strong>{activePaper.title || activePaper.label}</strong></span>
                </div>
                <div className={styles.viewerSubHeaderRight}>
                  <a
                    href={activePaper.url}
                    target="_blank"
                    rel="noopener"
                    className={styles.viewerFullscreenLink}
                  >
                    <span className="material-symbols-outlined">open_in_new</span>
                    Fullscreen ↗
                  </a>
                </div>
              </div>

              {/* Central Loading State with ExamUdaan Branding */}
              {pdfLoading && (
                <div className={styles.loadingOverlay} role="status" aria-live="polite">
                  <div className={styles.loaderContent}>
                    <div className={styles.loaderSpinnerWrapper}>
                      <div className={styles.loaderSpinner}></div>
                      <div className={styles.loaderPulseDot}></div>
                    </div>
                    <div className={styles.loaderTitle}>Loading Study Workspace...</div>
                    <div className={styles.loaderSubtitle}>
                      Preparing Official Document • ExamUdaan Study Workspace
                    </div>
                    <div className={styles.loaderProgressBar}>
                      <div className={styles.loaderProgressIndicator}></div>
                    </div>
                    {loadingSlow && (
                      <div className={styles.loaderSlowHint}>
                        <span>Rendering is taking a moment. You can also open the full document directly:</span>
                        <div className={styles.loaderActionRow}>
                          <a
                            href={activePaper.url}
                            target="_blank"
                            rel="noopener"
                            className={styles.loaderDirectBtn}
                          >
                            📱 Open Full PDF ↗
                          </a>
                          <button
                            type="button"
                            className={styles.loaderRetryBtn}
                            onClick={() => {
                              setPdfLoading(true)
                              setLoadingSlow(false)
                              const el = document.getElementById('official-study-iframe')
                              if (el) el.src = el.src
                            }}
                          >
                            🔄 Refresh Viewer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <iframe
                id="official-study-iframe"
                key={activePaper.url}
                src={activePaper.url.includes('#') ? activePaper.url : `${activePaper.url}#view=FitH&toolbar=1`}
                className={styles.pdfIframe}
                title={activePaper.title || activePaper.label}
                onLoad={() => setPdfLoading(false)}
              />
              <div className={styles.iframeFooter}>
                <div className={styles.iframeFooterLeft}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#22C55E' }}>check_circle</span>
                  <span>Official PDF Archive • 100% Genuine {conductingBody} Source</span>
                </div>
                <a href={activePaper.url} target="_blank" rel="noopener noreferrer" className={styles.iframeFooterLink}>
                  Direct Source Link ↗
                </a>
              </div>
            </div>
          )}

          {/* Exam Details & Blueprint Matrix (Collapsible with More Info toggle) */}
          <div className={styles.docOverviewBox}>
            {isEmbeddablePdf ? (
              <>
                <div className={styles.docOverviewToggleBar}>
                  <div className={styles.docOverviewToggleLeft}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#EA580C' }}>assignment</span>
                    <span className={styles.docOverviewToggleHeading}>Exam Details & Question Blueprint</span>
                    <span className={styles.docOverviewToggleSummary}>
                      100 Questions • 100 Marks • 90 Mins • Bilingual (Marathi & English)
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.moreInfoBtn}
                    onClick={() => setShowMoreInfo(prev => !prev)}
                    aria-expanded={showMoreInfo}
                    title={showMoreInfo ? "Hide detailed examination specifications" : "View complete exam specifications, download options, and CBT practice"}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                      {showMoreInfo ? 'expand_less' : 'info'}
                    </span>
                    <span>{showMoreInfo ? 'Less Info ▴' : 'More Info ▾'}</span>
                  </button>
                </div>

                {showMoreInfo && (
                  <div className={styles.docOverviewCollapsibleContent}>
                    <div className={styles.docOverviewCard}>
                      <div className={styles.docOverviewBadgeRow}>
                        <span className={styles.verifiedGovBadge}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
                          100% Official {conductingBody} Examination Record
                        </span>
                        <span className={activePaper.isAnswerKey ? styles.typeTagKey : styles.typeTagPaper}>
                          {activePaper.isAnswerKey ? 'Official Final Answer Key' : 'Official Question Paper'}
                        </span>
                        <span className={styles.docYearTag}>{activePaper.year || 'Official'}</span>
                        {activePaper.badge && (
                          <span className={activePaper.isAnswerKey ? styles.keyBadge : styles.chipBadge}>
                            {activePaper.badge}
                          </span>
                        )}
                      </div>

                      <h3 className={styles.docOverviewHeading}>{activePaper.title || activePaper.label}</h3>

                      <p className={styles.docOverviewDescription}>
                        Official PDF document archive from {conductingBody}. Sourced directly for authentic examination preparation.
                      </p>

                      {/* Paper Pattern & Exam Blueprint Matrix */}
                      <div className={styles.blueprintGrid}>
                        <div className={styles.blueprintItem}>
                          <span className="material-symbols-outlined" style={{ color: '#EA580C', fontSize: 22 }}>format_list_numbered</span>
                          <div>
                            <div className={styles.bpVal}>100 Questions</div>
                            <div className={styles.bpLbl}>Objective MCQs Pattern</div>
                          </div>
                        </div>
                        <div className={styles.blueprintItem}>
                          <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: 22 }}>military_tech</span>
                          <div>
                            <div className={styles.bpVal}>100 Marks</div>
                            <div className={styles.bpLbl}>1 Mark Per Question</div>
                          </div>
                        </div>
                        <div className={styles.blueprintItem}>
                          <span className="material-symbols-outlined" style={{ color: '#2563EB', fontSize: 22 }}>timer</span>
                          <div>
                            <div className={styles.bpVal}>90 Minutes</div>
                            <div className={styles.bpLbl}>Allotted Examination Time</div>
                          </div>
                        </div>
                        <div className={styles.blueprintItem}>
                          <span className="material-symbols-outlined" style={{ color: '#7C3AED', fontSize: 22 }}>translate</span>
                          <div>
                            <div className={styles.bpVal}>Marathi & English</div>
                            <div className={styles.bpLbl}>Bilingual Exam Medium</div>
                          </div>
                        </div>
                      </div>

                      {/* Direct Action Buttons */}
                      <div className={styles.overviewCtaRow}>
                        <a
                          href={activePaper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.primaryGovBtn}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>open_in_new</span>
                          <span>Fullscreen / New Tab ↗</span>
                        </a>

                        <Link
                          href="/pyq"
                          className={styles.secondaryActionBtn}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#EA580C' }}>quiz</span>
                          <span>Practice 1,100+ Real PYQs</span>
                        </Link>

                        <Link
                          href="/mock-tests"
                          className={styles.secondaryActionBtn}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#2563EB' }}>timer</span>
                          <span>Attempt Full CBT Mock Test</span>
                        </Link>

                        {(examName.toLowerCase().includes('police') || conductingBody.toLowerCase().includes('police')) && (
                          <Link
                            href="/police-calculator"
                            className={styles.secondaryActionBtn}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#16A34A' }}>calculate</span>
                            <span>Police Physical & Written Marks Calculator</span>
                          </Link>
                        )}
                      </div>

                      <div className={styles.overviewNote}>
                        <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#D97706', flexShrink: 0 }}>info</span>
                        <span>
                          Official government objection tracking, master answer keys, and district recruitment circulars are served directly under government cybersecurity guidelines. Use the direct official link above for objection submission.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.docOverviewCard}>
                <div className={styles.docOverviewBadgeRow}>
                  <span className={styles.verifiedGovBadge}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
                    100% Official {conductingBody} Examination Record
                  </span>
                  <span className={activePaper.isAnswerKey ? styles.typeTagKey : styles.typeTagPaper}>
                    {activePaper.isAnswerKey ? 'Official Final Answer Key' : 'Official Question Paper'}
                  </span>
                  <span className={styles.docYearTag}>{activePaper.year || 'Official'}</span>
                  {activePaper.badge && (
                    <span className={activePaper.isAnswerKey ? styles.keyBadge : styles.chipBadge}>
                      {activePaper.badge}
                    </span>
                  )}
                </div>

                <h3 className={styles.docOverviewHeading}>{activePaper.title || activePaper.label}</h3>

                <p className={styles.docOverviewDescription}>
                  This official document record is published and maintained on the official {conductingBody} portal ({domainName || 'Gov Portal'}). You can launch the official government document in a new tab or practice questions with verified explanations directly inside ExamUdaan.
                </p>

                {/* Paper Pattern & Exam Blueprint Matrix */}
                <div className={styles.blueprintGrid}>
                  <div className={styles.blueprintItem}>
                    <span className="material-symbols-outlined" style={{ color: '#EA580C', fontSize: 22 }}>format_list_numbered</span>
                    <div>
                      <div className={styles.bpVal}>100 Questions</div>
                      <div className={styles.bpLbl}>Objective MCQs Pattern</div>
                    </div>
                  </div>
                  <div className={styles.blueprintItem}>
                    <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: 22 }}>military_tech</span>
                    <div>
                      <div className={styles.bpVal}>100 Marks</div>
                      <div className={styles.bpLbl}>1 Mark Per Question</div>
                    </div>
                  </div>
                  <div className={styles.blueprintItem}>
                    <span className="material-symbols-outlined" style={{ color: '#2563EB', fontSize: 22 }}>timer</span>
                    <div>
                      <div className={styles.bpVal}>90 Minutes</div>
                      <div className={styles.bpLbl}>Allotted Examination Time</div>
                    </div>
                  </div>
                  <div className={styles.blueprintItem}>
                    <span className="material-symbols-outlined" style={{ color: '#7C3AED', fontSize: 22 }}>translate</span>
                    <div>
                      <div className={styles.bpVal}>Marathi & English</div>
                      <div className={styles.bpLbl}>Bilingual Exam Medium</div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className={styles.overviewCtaRow}>
                  <a
                    href={activePaper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.primaryGovBtn}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>open_in_new</span>
                    <span>Fullscreen / New Tab ↗</span>
                  </a>

                  <Link href="/pyq" className={styles.secondaryActionBtn}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#EA580C' }}>quiz</span>
                    <span>Practice 1,100+ Real PYQs</span>
                  </Link>

                  <Link href="/mock-tests" className={styles.secondaryActionBtn}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#2563EB' }}>timer</span>
                    <span>Attempt Full CBT Mock Test</span>
                  </Link>

                  {(examName.toLowerCase().includes('police') || conductingBody.toLowerCase().includes('police')) && (
                    <Link href="/police-calculator" className={styles.secondaryActionBtn}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#16A34A' }}>calculate</span>
                      <span>Police Physical & Written Marks Calculator</span>
                    </Link>
                  )}
                </div>

                <div className={styles.overviewNote}>
                  <span className="material-symbols-outlined" style={{ fontSize: 17, color: '#D97706', flexShrink: 0 }}>info</span>
                  <span>
                    Official government objection tracking, master answer keys, and district recruitment circulars are served directly under government cybersecurity guidelines. Use the direct official link above for objection submission.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Document Directory Table / Practice Matrix ── */}
      {showDirectorySection && (
        <div className={styles.directorySection}>
          <div className={styles.directoryHeader}>
            <h4 className={styles.directoryTitle}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>menu_book</span>
              {title || `Complete Question Papers & Answer Keys Directory (${allDocuments.length} Documents)`}
            </h4>
            <span className={styles.directorySubtitle}>
              {subtitle || 'Click any paper to instantly preview in the study canvas above or download for offline revision.'}
            </span>
          </div>

          <div className={styles.matrixList}>
            {allDocuments.map(doc => {
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
                      type="button"
                      onClick={() => handleSelectDoc(doc.id, true)}
                      className={`${styles.viewBtn} ${isCurrentlyReading ? styles.viewBtnActive : ''}`}
                      title="Load document into the interactive reader above"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                        {isCurrentlyReading ? 'visibility' : 'menu_book'}
                      </span>
                      <span>{isCurrentlyReading ? 'Viewing Now' : 'View Document'}</span>
                    </button>

                    {!checkIsPdf(doc.url) && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.downloadBtn}
                        title="Open official document link on portal"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                          open_in_new
                        </span>
                        <span>Open Link ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
