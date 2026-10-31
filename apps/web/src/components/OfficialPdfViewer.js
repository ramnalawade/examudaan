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
      const match = allDocuments.find(p => (p.id === activePaper.pairId || String(p.id) === String(activePaper.pairId)) && !p.isAnswerKey)
      if (match) return match
    }
    return allDocuments.find(p => !p.isAnswerKey) || null
  }, [allDocuments, activePaper])

  const answerKeyDoc = useMemo(() => {
    if (!activePaper) return null
    if (activePaper.isAnswerKey) return activePaper
    if (activePaper.pairId) {
      const match = allDocuments.find(p => (p.id === activePaper.pairId || String(p.id) === String(activePaper.pairId)) && p.isAnswerKey)
      if (match) return match
    }
    return allDocuments.find(p => p.isAnswerKey) || null
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
    if (shouldScroll) {
      setTimeout(() => {
        const target = document.getElementById('official-pdf-canvas') || viewerRef.current
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 50)
    }
  }

  // Handle Fullscreen viewer
  function handleFullscreen() {
    const target = document.getElementById('official-pdf-canvas') || viewerRef.current
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (target.requestFullscreen) {
        target.requestFullscreen().catch(() => {})
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen()
      }
    }
  }

  // Handle toggle Exam Details & Question Blueprint
  function handleToggleMoreInfo() {
    setShowMoreInfo(prev => {
      const next = !prev
      if (next) {
        setTimeout(() => {
          const el = document.getElementById('exam-blueprint-matrix')
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }, 80)
      }
      return next
    })
  }

  if (!allDocuments || allDocuments.length === 0) return null

  return (
    <div className={styles.workspaceWrapper} ref={viewerRef} id="official-pdf-workspace">
      {/* ── Top Header & Source Attribution ── */}
      <div className={styles.topBar}>
        <div className={styles.sourceAttribution}>
          <div className={styles.verifiedBadge}>
            <span className={`material-symbols-outlined ${styles.topBarVerifiedIcon}`}>verified</span>
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
              <span className={`material-symbols-outlined ${styles.filterTypeIcon}`}>description</span>
              Papers
            </button>
            <button
              type="button"
              className={`${styles.typeBtn} ${selectedType === 'KEYS' ? styles.activeTypeBtn : ''}`}
              onClick={() => setSelectedType('KEYS')}
            >
              <span className={`material-symbols-outlined ${styles.filterTypeIcon}`}>task_alt</span>
              Answer Keys
            </button>
          </div>
        </div>
      </div>

      {/* ── Document Selector Chips Grid (Clean, Scrollbar-Free) ── */}
      {showSelectorChips && allDocuments.length <= 40 && (
        <div className={styles.docSelectorBar}>
          <span className={styles.docSelectorLabel}>
            <span className={`material-symbols-outlined ${styles.selectPaperIcon}`}>library_books</span>
            Select Paper:
          </span>
          <div className={styles.chipsScrollContainer}>
            {filteredPapers.map(doc => {
              const isSelected = activePaper && doc.id === activePaper.id
              const chipIconClass = isSelected
                ? styles.chipSelectedIcon
                : doc.isAnswerKey
                ? styles.chipUnselectedKeyIcon
                : styles.chipUnselectedPaperIcon
              return (
                <button
                  key={doc.id}
                  type="button"
                  className={`${styles.docChip} ${isSelected ? styles.activeDocChip : ''}`}
                  onClick={() => handleSelectDoc(doc.id, false)}
                  title={doc.title || doc.label}
                >
                  <span className={`material-symbols-outlined ${chipIconClass}`}>
                    {doc.isAnswerKey ? 'task_alt' : 'description'}
                  </span>
                  <span className={styles.docChipLabel}>{doc.label || doc.title}</span>
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
                      onClick={() => handleSelectDoc(questionPaperDoc.id, true)}
                      title="View Question Paper"
                    >
                      <span className={`material-symbols-outlined ${styles.toolbarIcon}`}>description</span>
                      <span>Question Paper</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className={activePaper.isAnswerKey ? styles.qaSwitchActiveKey : styles.qaSwitchInactive}
                    onClick={() => handleSelectDoc(answerKeyDoc.id, true)}
                    title="View Official Answer Key"
                  >
                    <span className={`material-symbols-outlined ${styles.toolbarIcon}`}>task_alt</span>
                    <span>Answer Key</span>
                  </button>
                </div>
              ) : questionPaperDoc && (
                <div className={styles.qaSegmentedSwitch} role="group" aria-label="Question Paper">
                  <button
                    type="button"
                    className={styles.qaSwitchActivePaper}
                    onClick={() => handleSelectDoc(questionPaperDoc.id, true)}
                    title="Official Question Paper"
                  >
                    <span className={`material-symbols-outlined ${styles.toolbarIcon}`}>description</span>
                    <span>Question Paper</span>
                  </button>
                </div>
              )}

              {/* Fullscreen Viewer Mode Button */}
              <button
                type="button"
                onClick={handleFullscreen}
                className={styles.actionBtnOutline}
                title="Open viewer in full screen"
              >
                <span className={`material-symbols-outlined ${styles.toolbarIcon}`}>fullscreen</span>
                <span>Fullscreen</span>
              </button>

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
                  <span className={`material-symbols-outlined ${styles.toolbarIcon}`}>
                    open_in_new
                  </span>
                  <span>Open Govt Link ↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Direct Embedded PDF Viewer — Opens by default without requiring interstitial click */}
          {isEmbeddablePdf && (
            <div className={styles.iframeBox} id="official-pdf-canvas">
              {/* Direct Mobile Quick Action Banner — Direct Fullscreen Mode */}
              <div className={styles.mobileDirectBanner}>
                <div className={styles.mobileDirectLabel}>
                  <span className={`material-symbols-outlined ${styles.toolbarIcon}`}>smartphone</span>
                  <span>Study Workspace PDF View</span>
                </div>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className={styles.mobileFullscreenBtn}
                  title="Expand to Fullscreen"
                >
                  <span className={`material-symbols-outlined ${styles.toolbarIcon}`}>fullscreen</span>
                  <span>Fullscreen ⛶</span>
                </button>
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
                  <span className={`material-symbols-outlined ${styles.footerCheckIcon}`}>check_circle</span>
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
                <div
                  className={styles.docOverviewToggleBar}
                  onClick={handleToggleMoreInfo}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleToggleMoreInfo()
                    }
                  }}
                  aria-expanded={showMoreInfo}
                  title={showMoreInfo ? "Hide detailed examination specifications" : "Click to view complete exam specifications, negative marking, and CBT practice"}
                >
                  <div className={styles.docOverviewToggleLeft}>
                    <span className="material-symbols-outlined">assignment</span>
                    <span className={styles.docOverviewToggleHeading}>Exam Details & Question Blueprint</span>
                    <span className={styles.docOverviewToggleSummary}>
                      100 Questions • 100 Marks • 90 Mins • Bilingual (Marathi & English)
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.moreInfoBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleMoreInfo()
                    }}
                    aria-expanded={showMoreInfo}
                    title={showMoreInfo ? "Hide detailed examination specifications" : "View complete exam specifications"}
                  >
                    <span className="material-symbols-outlined">
                      {showMoreInfo ? 'expand_less' : 'info'}
                    </span>
                    <span>{showMoreInfo ? 'Less Info ▴' : 'More Info ▾'}</span>
                  </button>
                </div>

                {showMoreInfo && (
                  <div className={styles.docOverviewCollapsibleContent} id="exam-blueprint-matrix">
                    <div className={styles.docOverviewCard}>
                      <div className={styles.docOverviewBadgeRow}>
                        <span className={styles.verifiedGovBadge}>
                          <span className="material-symbols-outlined">verified</span>
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

                      {/* Redesigned Executive Examination Blueprint Matrix */}
                      <div className={styles.blueprintSpecGrid}>
                        {/* 1. Exam Pattern */}
                        <div className={`${styles.blueprintSpecCard} ${styles.cardPurple}`}>
                          <div className={styles.specCardTop}>
                            <span className={styles.specCardLabel}>Exam Pattern</span>
                            <span className={`${styles.specCardPill} ${styles.pillPurple}`}>OMR / CBT Standard</span>
                          </div>
                          <div className={styles.specCardVal}>100 Questions</div>
                          <div className={styles.specCardSub}>Objective MCQs (बहुपर्यायी प्रश्न)</div>
                        </div>

                        {/* 2. Total Marks */}
                        <div className={`${styles.blueprintSpecCard} ${styles.cardGreen}`}>
                          <div className={styles.specCardTop}>
                            <span className={styles.specCardLabel}>Total Marks</span>
                            <span className={`${styles.specCardPill} ${styles.pillGreen}`}>+1 Correct Mark</span>
                          </div>
                          <div className={styles.specCardVal}>100 Marks</div>
                          <div className={styles.specCardSub}>1 Mark per correct answer</div>
                        </div>

                        {/* 3. Negative Marking */}
                        <div className={`${styles.blueprintSpecCard} ${styles.cardRed}`}>
                          <div className={styles.specCardTop}>
                            <span className={styles.specCardLabel}>Negative Marking</span>
                            <span className={`${styles.specCardPill} ${styles.pillRed}`}>Official 1/4th Rule</span>
                          </div>
                          <div className={styles.specCardVal}>-0.25 (1/4th)</div>
                          <div className={styles.specCardSub}>Deducted for each wrong answer</div>
                        </div>

                        {/* 4. Duration & Pace */}
                        <div className={`${styles.blueprintSpecCard} ${styles.cardBlue}`}>
                          <div className={styles.specCardTop}>
                            <span className={styles.specCardLabel}>Duration & Pace</span>
                            <span className={`${styles.specCardPill} ${styles.pillBlue}`}>Speed Drill Pace</span>
                          </div>
                          <div className={styles.specCardVal}>90 Minutes</div>
                          <div className={styles.specCardSub}>54 seconds per question pace</div>
                        </div>

                        {/* 5. Language Medium */}
                        <div className={`${styles.blueprintSpecCard} ${styles.cardAmber}`}>
                          <div className={styles.specCardTop}>
                            <span className={styles.specCardLabel}>Language Medium</span>
                            <span className={`${styles.specCardPill} ${styles.pillAmber}`}>Dual Language</span>
                          </div>
                          <div className={styles.specCardVal}>मराठी व इंग्रजी</div>
                          <div className={styles.specCardSub}>Bilingual Question Booklet</div>
                        </div>

                        {/* 6. Commission Verification */}
                        <div className={`${styles.blueprintSpecCard} ${styles.cardTeal}`}>
                          <div className={styles.specCardTop}>
                            <span className={styles.specCardLabel}>Verification</span>
                            <span className={`${styles.specCardPill} ${styles.pillTeal}`}>Commission Verified</span>
                          </div>
                          <div className={styles.specCardVal}>100% Authentic</div>
                          <div className={styles.specCardSub}>Cross-verified with Final Key</div>
                        </div>
                      </div>

                      {/* Official Scoring Formula Callout Banner */}
                      <div className={styles.scoringFormulaBox}>
                        <span className={styles.formulaIconWrap}>⚖️</span>
                        <div className={styles.formulaContent}>
                          <span className={styles.formulaHeading}>
                            अधिकृत गुण मोजणी सूत्र (Official Scoring Formula):
                          </span>
                          <p className={styles.formulaText}>
                            एकूण गुण = (बरोबर उत्तरे × १) - (चुकीची उत्तरे × ०.२५). अनुत्तरित किंवा रद्द केलेल्या प्रश्नांसाठी कोणतेही नकारात्मक गुण आकारले जात नाहीत.
                          </p>
                        </div>
                      </div>

                      {/* Direct Action Buttons */}
                      <div className={styles.overviewCtaRow}>
                        <button
                          type="button"
                          onClick={handleFullscreen}
                          className={styles.primaryGovBtn}
                          title="Open PDF viewer in fullscreen"
                        >
                          <span className={`material-symbols-outlined ${styles.overviewCtaIcon}`}>fullscreen</span>
                          <span>Study In Fullscreen ⛶</span>
                        </button>

                        <Link
                          href="/pyq"
                          className={styles.secondaryActionBtn}
                        >
                          <span className={`material-symbols-outlined ${styles.overviewCtaIcon}`}>quiz</span>
                          <span>Practice 1,100+ Real PYQs</span>
                        </Link>

                        <Link
                          href="/mock-tests"
                          className={styles.secondaryActionBtn}
                        >
                          <span className={`material-symbols-outlined ${styles.overviewCtaIcon}`}>timer</span>
                          <span>Attempt Full CBT Mock Test</span>
                        </Link>

                        {(examName.toLowerCase().includes('police') || conductingBody.toLowerCase().includes('police')) && (
                          <Link
                            href="/police-calculator"
                            className={styles.secondaryActionBtn}
                          >
                            <span className={`material-symbols-outlined ${styles.overviewCtaIcon}`}>calculate</span>
                            <span>Police Marks Calculator</span>
                          </Link>
                        )}
                      </div>

                      <div className={styles.overviewNote}>
                        <span className="material-symbols-outlined">info</span>
                        <span>
                          Official government objection tracking, master answer keys, and district recruitment circulars are served directly under government cybersecurity guidelines.
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
                    <span className="material-symbols-outlined">verified</span>
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

                {/* Redesigned Executive Examination Blueprint Matrix */}
                <div className={styles.blueprintSpecGrid}>
                  <div className={`${styles.blueprintSpecCard} ${styles.cardPurple}`}>
                    <div className={styles.specCardTop}>
                      <span className={styles.specCardLabel}>Exam Pattern</span>
                      <span className={`${styles.specCardPill} ${styles.pillPurple}`}>OMR / CBT Standard</span>
                    </div>
                    <div className={styles.specCardVal}>100 Questions</div>
                    <div className={styles.specCardSub}>Objective MCQs (बहुपर्यायी प्रश्न)</div>
                  </div>

                  <div className={`${styles.blueprintSpecCard} ${styles.cardGreen}`}>
                    <div className={styles.specCardTop}>
                      <span className={styles.specCardLabel}>Total Marks</span>
                      <span className={`${styles.specCardPill} ${styles.pillGreen}`}>+1 Correct Mark</span>
                    </div>
                    <div className={styles.specCardVal}>100 Marks</div>
                    <div className={styles.specCardSub}>1 Mark per correct answer</div>
                  </div>

                  <div className={`${styles.blueprintSpecCard} ${styles.cardRed}`}>
                    <div className={styles.specCardTop}>
                      <span className={styles.specCardLabel}>Negative Marking</span>
                      <span className={`${styles.specCardPill} ${styles.pillRed}`}>Official 1/4th Rule</span>
                    </div>
                    <div className={styles.specCardVal}>-0.25 (1/4th)</div>
                    <div className={styles.specCardSub}>Deducted for each wrong answer</div>
                  </div>

                  <div className={`${styles.blueprintSpecCard} ${styles.cardBlue}`}>
                    <div className={styles.specCardTop}>
                      <span className={styles.specCardLabel}>Duration & Pace</span>
                      <span className={`${styles.specCardPill} ${styles.pillBlue}`}>Speed Drill Pace</span>
                    </div>
                    <div className={styles.specCardVal}>90 Minutes</div>
                    <div className={styles.specCardSub}>54 seconds per question pace</div>
                  </div>

                  <div className={`${styles.blueprintSpecCard} ${styles.cardAmber}`}>
                    <div className={styles.specCardTop}>
                      <span className={styles.specCardLabel}>Language Medium</span>
                      <span className={`${styles.specCardPill} ${styles.pillAmber}`}>Dual Language</span>
                    </div>
                    <div className={styles.specCardVal}>मराठी व इंग्रजी</div>
                    <div className={styles.specCardSub}>Bilingual Question Booklet</div>
                  </div>

                  <div className={`${styles.blueprintSpecCard} ${styles.cardTeal}`}>
                    <div className={styles.specCardTop}>
                      <span className={styles.specCardLabel}>Verification</span>
                      <span className={`${styles.specCardPill} ${styles.pillTeal}`}>Commission Verified</span>
                    </div>
                    <div className={styles.specCardVal}>100% Authentic</div>
                    <div className={styles.specCardSub}>Cross-verified with Final Key</div>
                  </div>
                </div>

                {/* Official Scoring Formula Callout Banner */}
                <div className={styles.scoringFormulaBox}>
                  <span className={styles.formulaIconWrap}>⚖️</span>
                  <div className={styles.formulaContent}>
                    <span className={styles.formulaHeading}>
                      अधिकृत गुण मोजणी सूत्र (Official Scoring Formula):
                    </span>
                    <p className={styles.formulaText}>
                      एकूण गुण = (बरोबर उत्तरे × १) - (चुकीची उत्तरे × ०.२५). अनुत्तरित किंवा रद्द केलेल्या प्रश्नांसाठी कोणतेही नकारात्मक गुण आकारले जात नाहीत.
                    </p>
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
                    <span className={`material-symbols-outlined ${styles.overviewCtaIcon}`}>open_in_new</span>
                    <span>Launch Govt Document ↗</span>
                  </a>

                  <Link href="/pyq" className={styles.secondaryActionBtn}>
                    <span className={`material-symbols-outlined ${styles.overviewCtaIcon}`}>quiz</span>
                    <span>Practice 1,100+ Real PYQs</span>
                  </Link>

                  <Link href="/mock-tests" className={styles.secondaryActionBtn}>
                    <span className={`material-symbols-outlined ${styles.overviewCtaIcon}`}>timer</span>
                    <span>Attempt Full CBT Mock Test</span>
                  </Link>

                  {(examName.toLowerCase().includes('police') || conductingBody.toLowerCase().includes('police')) && (
                    <Link href="/police-calculator" className={styles.secondaryActionBtn}>
                      <span className={`material-symbols-outlined ${styles.overviewCtaIcon}`}>calculate</span>
                      <span>Police Marks Calculator</span>
                    </Link>
                  )}
                </div>

                <div className={styles.overviewNote}>
                  <span className="material-symbols-outlined">info</span>
                  <span>
                    Official government objection tracking, master answer keys, and district recruitment circulars are served directly under government cybersecurity guidelines.
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
              <span className={`material-symbols-outlined ${styles.directoryTitleIcon}`}>menu_book</span>
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
                    <div className={`${styles.matrixYearBox} ${doc.isAnswerKey ? styles.matrixYearKey : styles.matrixYearPaper}`}>
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
                          <span className={`material-symbols-outlined ${styles.directoryItemIcon}`}>account_balance</span>
                          {conductingBody}
                        </span>
                        {doc.size && (
                          <span className={styles.metaItem}>
                            <span className={`material-symbols-outlined ${styles.directoryItemIcon}`}>attach_file</span>
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
                      <span className={`material-symbols-outlined ${styles.toolbarIcon}`}>
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
                        <span className={`material-symbols-outlined ${styles.toolbarIcon}`}>
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
