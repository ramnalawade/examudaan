// ============================================================
// app/admin/feedback/page.js — Admin Feedback & Query Review Desk
// ExamUdaan | Protected Admin Moderation, Resolution & User Notification Desk
// Zero Inline Styles Policy Compliant
// ============================================================

'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import styles from './adminFeedback.module.css'

const CATEGORY_LABELS = {
  suggest_portal: 'Suggest Portal',
  data_correction: 'Data Correction',
  feature_request: 'Feature Request',
  missing_papers: 'Missing Papers',
  error_report: 'Error / Bug',
  general_feedback: 'General Review',
  mpsc_missing_papers: 'MPSC Missing Papers',
  mpsc_error_report: 'MPSC Error Report',
  mpsc_feature_request: 'MPSC Feature',
  mpsc_general_feedback: 'MPSC Review',
  general: 'General',
}

export default function AdminFeedbackPage() {
  const router = useRouter()

  // 1. Auth & Data states
  const [authChecked, setAuthChecked] = useState(false)
  const [feedbackList, setFeedbackList] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, approved: 0, spam: 0 })
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 })
  const [loading, setLoading] = useState(true)

  // 2. Filter states
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'pending' | 'resolved' | 'approved' | 'spam'
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // 3. Modal & Action states
  const [activeModalItem, setActiveModalItem] = useState(null)
  const [modalResolutionNotes, setModalResolutionNotes] = useState('')
  const [modalStatus, setModalStatus] = useState('resolved')
  const [modalApproveWeb, setModalApproveWeb] = useState(false)
  const [modalNotifyUser, setModalNotifyUser] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // 4. Toast notifications
  const [toast, setToast] = useState(null)

  // Memoized auth token
  const token = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('eu_access_token') || localStorage.getItem('token') || ''
  }, [])

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4500)
  }, [])

  // ── Auth verification ──
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('eu_user')
      const isDev = process.env.NODE_ENV === 'development'
      if (!rawUser && !isDev) {
        router.push('/login')
        return
      }
      if (rawUser) {
        const u = JSON.parse(rawUser)
        if (!u?.is_admin && u?.role !== 'admin' && !isDev) {
          router.push('/login')
          return
        }
      }
    } catch {
      if (process.env.NODE_ENV !== 'development') {
        router.push('/login')
        return
      }
    }
    setAuthChecked(true)
  }, [router])

  // ── Fetch feedback records ──
  const fetchFeedbacks = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        status: statusFilter,
      })
      if (categoryFilter && categoryFilter !== 'all') {
        params.set('category', categoryFilter)
      }
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim())
      }

      const res = await fetch(`/api/admin/feedback?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setFeedbackList(data.feedback || [])
        setStats(data.stats || { total: 0, pending: 0, resolved: 0, approved: 0, spam: 0 })
        setPagination(data.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 })
      } else {
        showToast(data.error || 'Failed to load feedbacks', 'error')
      }
    } catch (err) {
      console.error('[AdminFeedbackPage fetch error]', err)
      showToast('Network error loading feedbacks', 'error')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, categoryFilter, searchQuery, token, showToast])

  useEffect(() => {
    if (authChecked) {
      fetchFeedbacks(currentPage)
    }
  }, [authChecked, fetchFeedbacks, currentPage])

  // ── Toggle Approved on Website ──
  const handleToggleApproved = async (item) => {
    const nextApproved = !item.is_approved
    try {
      const res = await fetch(`/api/admin/feedback/${item.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_approved: nextApproved,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(
          nextApproved
            ? `Ticket ${item.reference_id} approved for public display on website!`
            : `Ticket ${item.reference_id} hidden from public website view.`
        )
        fetchFeedbacks(currentPage)
      } else {
        showToast(data.error || 'Failed to update visibility', 'error')
      }
    } catch {
      showToast('Network error updating approval status', 'error')
    }
  }

  // ── Toggle Spam Flag ──
  const handleToggleSpam = async (item) => {
    const nextSpam = !item.is_spam
    try {
      const res = await fetch(`/api/admin/feedback/${item.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_spam: nextSpam,
          status: nextSpam ? 'spam' : 'pending',
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(nextSpam ? `Marked ticket ${item.reference_id} as spam.` : `Unflagged ticket ${item.reference_id}.`)
        fetchFeedbacks(currentPage)
      }
    } catch {
      showToast('Network error updating spam flag', 'error')
    }
  }

  // ── Delete item permanently ──
  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Permanently delete ticket ${item.reference_id}? This cannot be undone.`)) {
      return
    }
    try {
      const res = await fetch(`/api/admin/feedback/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Ticket ${item.reference_id} permanently deleted.`)
        fetchFeedbacks(currentPage)
      }
    } catch {
      showToast('Network error deleting record', 'error')
    }
  }

  // ── Open Resolution Modal ──
  const handleOpenResolveModal = (item) => {
    setActiveModalItem(item)
    setModalResolutionNotes(item.resolution_notes || '')
    setModalStatus(item.status === 'resolved' ? 'resolved' : 'resolved')
    setModalApproveWeb(!!item.is_approved)
    setModalNotifyUser(!!(item.contact && item.contact.includes('@')))
  }

  // ── Submit Resolution ──
  const handleSubmitResolution = async (e) => {
    e.preventDefault()
    if (!activeModalItem) return

    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/feedback/${activeModalItem.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: modalStatus,
          resolution_notes: modalResolutionNotes.trim(),
          is_approved: modalApproveWeb,
          notify_user: modalNotifyUser,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const notifMsg = data.notification?.message ? ` (${data.notification.message})` : ''
        showToast(`Query ${activeModalItem.reference_id} updated successfully!${notifMsg}`)
        setActiveModalItem(null)
        fetchFeedbacks(currentPage)
      } else {
        showToast(data.error || 'Failed to save resolution', 'error')
      }
    } catch {
      showToast('Network error saving resolution', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  if (!authChecked) {
    return null
  }

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toast && (
        <div className={toast.type === 'error' ? styles.toastError : styles.toastSuccess}>
          <span className="material-symbols-outlined">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={`material-symbols-outlined ${styles.titleIcon}`}>support_agent</span>
          Aspirant Feedback & Query Review Desk
        </h1>
        <p className={styles.subtitle}>
          Review aspirant suggestions, portal additions, and error reports. Mark queries as resolved, trigger email/WhatsApp notifications, and approve non-spam items for public website display.
        </p>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div
          className={`${styles.kpiCard} ${statusFilter === 'all' ? styles.kpiCardActive : ''}`}
          onClick={() => { setStatusFilter('all'); setCurrentPage(1) }}
        >
          <span className={styles.kpiLabel}>Total Queries</span>
          <span className={styles.kpiValue}>{stats.total}</span>
        </div>
        <div
          className={`${styles.kpiCard} ${statusFilter === 'pending' ? styles.kpiCardActive : ''}`}
          onClick={() => { setStatusFilter('pending'); setCurrentPage(1) }}
        >
          <span className={styles.kpiLabel}>Pending Attention</span>
          <span className={`${styles.kpiValue} ${styles.kpiPending}`}>{stats.pending}</span>
        </div>
        <div
          className={`${styles.kpiCard} ${statusFilter === 'resolved' ? styles.kpiCardActive : ''}`}
          onClick={() => { setStatusFilter('resolved'); setCurrentPage(1) }}
        >
          <span className={styles.kpiLabel}>Resolved Queries</span>
          <span className={`${styles.kpiValue} ${styles.kpiResolved}`}>{stats.resolved}</span>
        </div>
        <div
          className={`${styles.kpiCard} ${statusFilter === 'approved' ? styles.kpiCardActive : ''}`}
          onClick={() => { setStatusFilter('approved'); setCurrentPage(1) }}
        >
          <span className={styles.kpiLabel}>Approved on Web</span>
          <span className={`${styles.kpiValue} ${styles.kpiApproved}`}>{stats.approved}</span>
        </div>
        <div
          className={`${styles.kpiCard} ${statusFilter === 'spam' ? styles.kpiCardActive : ''}`}
          onClick={() => { setStatusFilter('spam'); setCurrentPage(1) }}
        >
          <span className={styles.kpiLabel}>Spam Flagged</span>
          <span className={`${styles.kpiValue} ${styles.kpiSpam}`}>{stats.spam}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {/* Status Tabs */}
          <div className={styles.tabsContainer}>
            <button
              type="button"
              className={`${styles.tabBtn} ${statusFilter === 'all' ? styles.tabBtnActive : ''}`}
              onClick={() => { setStatusFilter('all'); setCurrentPage(1) }}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${statusFilter === 'pending' ? styles.tabBtnActive : ''}`}
              onClick={() => { setStatusFilter('pending'); setCurrentPage(1) }}
            >
              Pending ({stats.pending})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${statusFilter === 'resolved' ? styles.tabBtnActive : ''}`}
              onClick={() => { setStatusFilter('resolved'); setCurrentPage(1) }}
            >
              Resolved ({stats.resolved})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${statusFilter === 'approved' ? styles.tabBtnActive : ''}`}
              onClick={() => { setStatusFilter('approved'); setCurrentPage(1) }}
            >
              On Website ({stats.approved})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${statusFilter === 'spam' ? styles.tabBtnActive : ''}`}
              onClick={() => { setStatusFilter('spam'); setCurrentPage(1) }}
            >
              Spam ({stats.spam})
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            className={styles.selectInput}
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1) }}
          >
            <option value="all">All Categories</option>
            <option value="suggest_portal">Suggest Portal</option>
            <option value="data_correction">Data Correction</option>
            <option value="missing_papers">Missing Papers</option>
            <option value="error_report">Error / Bug</option>
            <option value="general_feedback">General Review</option>
            <option value="mpsc_missing_papers">MPSC Missing Papers</option>
            <option value="mpsc_error_report">MPSC Error Report</option>
            <option value="mpsc_general_feedback">MPSC Review</option>
          </select>
        </div>

        {/* Search & Refresh */}
        <div className={styles.toolbarLeft}>
          <div className={styles.searchBox}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by ticket ID, keyword, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setCurrentPage(1); fetchFeedbacks(1) } }}
            />
          </div>

          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => fetchFeedbacks(currentPage)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Listing Cards */}
      <div className={styles.feedbackList}>
        {loading ? (
          <div className={styles.emptyState}>
            <span className={`material-symbols-outlined ${styles.emptyIcon}`}>sync</span>
            <p>Loading feedback desk entries...</p>
          </div>
        ) : feedbackList.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={`material-symbols-outlined ${styles.emptyIcon}`}>inbox</span>
            <p>No queries found matching the selected filter criteria.</p>
          </div>
        ) : (
          feedbackList.map((item) => {
            const isResolved = item.status === 'resolved'
            const isSpam = !!item.is_spam
            const isApproved = !!item.is_approved
            const formattedDate = item.created_at
              ? new Date(item.created_at).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Unknown'

            // Clean phone for WhatsApp
            const phoneDigits = (item.contact || '').replace(/[^0-9]/g, '')
            const isPhone = phoneDigits.length >= 10
            const waLink = isPhone
              ? `https://wa.me/${phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits}?text=${encodeURIComponent(
                  `Namaskar from ExamUdaan.in 🙏\n\nYour query (Ticket: ${item.reference_id}) has been updated!\nStatus: ${item.status || 'Resolved'}\n${item.resolution_notes ? `Notes: ${item.resolution_notes}` : ''}\n\nVisit: https://examudaan.in`
                )}`
              : null

            return (
              <div
                key={item.id}
                className={`${styles.feedbackCard} ${
                  isSpam
                    ? styles.feedbackCardSpam
                    : isResolved
                    ? styles.feedbackCardResolved
                    : styles.feedbackCardPending
                }`}
              >
                {/* Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardBadges}>
                    <span className={styles.ticketBadge}>{item.reference_id}</span>
                    <span className={styles.categoryBadge}>
                      {CATEGORY_LABELS[item.category] || item.category || 'General'}
                    </span>
                    {isResolved ? (
                      <span className={styles.statusResolved}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                        Resolved
                      </span>
                    ) : isSpam ? (
                      <span className={styles.statusSpam}>Spam</span>
                    ) : (
                      <span className={styles.statusPending}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                        Pending Review
                      </span>
                    )}

                    {isApproved ? (
                      <span className={styles.approvedBadge}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>public</span>
                        Approved on Website
                      </span>
                    ) : (
                      <span className={styles.hiddenBadge}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility_off</span>
                        Internal Only
                      </span>
                    )}

                    {item.rating && (
                      <span style={{ color: '#eab308', fontSize: '0.85rem', fontWeight: 700 }}>
                        {'★'.repeat(item.rating)}
                      </span>
                    )}
                  </div>

                  <span className={styles.dateText}>{formattedDate}</span>
                </div>

                {/* Subject & Description */}
                {item.subject && <h3 className={styles.cardSubject}>{item.subject}</h3>}
                <p className={styles.cardDescription}>{item.description}</p>

                {/* Metadata */}
                <div className={styles.metaBar}>
                  {item.name && (
                    <div className={styles.metaItem}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
                      <span>{item.name}</span>
                    </div>
                  )}
                  {item.contact && (
                    <div className={styles.metaItem}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>contact_mail</span>
                      {item.contact.includes('@') ? (
                        <a href={`mailto:${item.contact}`} className={styles.contactLink}>
                          {item.contact}
                        </a>
                      ) : (
                        <a href={`tel:${item.contact}`} className={styles.contactLink}>
                          {item.contact}
                        </a>
                      )}
                    </div>
                  )}
                  {item.organization && (
                    <div className={styles.metaItem}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>account_balance</span>
                      <span>{item.organization}</span>
                    </div>
                  )}
                  {item.source_url && (
                    <div className={styles.metaItem}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>link</span>
                      <a href={item.source_url} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                        Page Link ↗
                      </a>
                    </div>
                  )}
                </div>

                {/* Existing Resolution Box */}
                {item.resolution_notes && (
                  <div className={styles.resolutionBox}>
                    <div className={styles.resolutionHeader}>
                      <span>Desk Resolution Remarks</span>
                      {item.resolved_by && <span>By {item.resolved_by}</span>}
                    </div>
                    <p className={styles.resolutionText}>{item.resolution_notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className={styles.actionBar}>
                  {/* Website Approval Toggle */}
                  <button
                    type="button"
                    className={isApproved ? styles.btnUnapprove : styles.btnApprove}
                    onClick={() => handleToggleApproved(item)}
                    title={isApproved ? 'Remove from public website' : 'Review and approve to show publicly on website'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      {isApproved ? 'visibility_off' : 'verified'}
                    </span>
                    {isApproved ? 'Hide from Website' : 'Approve for Website'}
                  </button>

                  {/* Resolve / Edit Resolution Modal Trigger */}
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => handleOpenResolveModal(item)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>task_alt</span>
                    {isResolved ? 'Edit Resolution' : 'Mark as Resolved'}
                  </button>

                  {/* WhatsApp Direct Notify Button (if mobile provided) */}
                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank" rel="noopener noreferrer"
                      rel="noopener noreferrer"
                      className={styles.btnWhatsApp}
                      title="Open WhatsApp with pre-filled update message"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chat</span>
                      WhatsApp
                    </a>
                  )}

                  {/* Spam Toggle */}
                  <button
                    type="button"
                    className={styles.btnSpam}
                    onClick={() => handleToggleSpam(item)}
                  >
                    {isSpam ? 'Unflag Spam' : 'Flag Spam'}
                  </button>

                  {/* Delete Item */}
                  <button
                    type="button"
                    className={styles.btnDelete}
                    onClick={() => handleDeleteItem(item)}
                    title="Permanently Delete"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Numbered Pagination */}
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={pagination.page <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              type="button"
              className={`${styles.pageBtn} ${pg === pagination.page ? styles.pageBtnActive : ''}`}
              onClick={() => setCurrentPage(pg)}
            >
              {pg}
            </button>
          ))}
          <button
            type="button"
            className={styles.pageBtn}
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}

      {/* Resolution & Notification Modal */}
      {activeModalItem && (
        <div className={styles.modalOverlay} onClick={() => setActiveModalItem(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                Resolve Query — {activeModalItem.reference_id}
              </h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setActiveModalItem(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitResolution}>
              <div className={styles.modalBody}>
                {/* Query Snapshot */}
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, fontSize: '0.85rem' }}>
                  <strong>Subject:</strong> {activeModalItem.subject || 'No subject'}
                  <br />
                  <strong>User Contact:</strong> {activeModalItem.contact || 'None provided'}
                </div>

                {/* Resolution Notes */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    Resolution Remarks & Solution Details *
                  </label>
                  <p className={styles.fieldHint}>
                    Explain what action was taken (e.g. &quot;Added official MPSC CSAT 2026 Paper 2 to the archive&quot; or &quot;Fixed question key error&quot;). This text is sent to the aspirant.
                  </p>
                  <textarea
                    required
                    rows={4}
                    className={styles.textarea}
                    placeholder="Enter resolution remarks..."
                    value={modalResolutionNotes}
                    onChange={(e) => setModalResolutionNotes(e.target.value)}
                  />
                </div>

                {/* Status Selection */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Status</label>
                  <select
                    className={styles.selectInput}
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                  >
                    <option value="resolved">Resolved (Completed)</option>
                    <option value="in_progress">In Progress (Under Investigation)</option>
                    <option value="pending">Pending</option>
                    <option value="dismissed">Dismissed (No action needed)</option>
                  </select>
                </div>

                {/* Website Approval Checkbox */}
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={modalApproveWeb}
                    onChange={(e) => setModalApproveWeb(e.target.checked)}
                  />
                  <div>
                    <strong>Approve for Public Website Display</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Verified non-spam suggestion or review. Once checked, it will be visible in the community suggestions section on the website.
                    </div>
                  </div>
                </label>

                {/* Email Notification Checkbox */}
                {activeModalItem.contact && activeModalItem.contact.includes('@') && (
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkboxInput}
                      checked={modalNotifyUser}
                      onChange={(e) => setModalNotifyUser(e.target.checked)}
                    />
                    <div>
                      <strong>Send Official Resolution Email via Brevo</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Dispatches a branded resolution email to <code>{activeModalItem.contact}</code> with your remarks and ticket ID.
                      </div>
                    </div>
                  </label>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setActiveModalItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={styles.btnPrimary}
                >
                  {actionLoading ? 'Saving...' : 'Save & Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
