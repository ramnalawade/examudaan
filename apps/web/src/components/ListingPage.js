// ============================================================
// components/ListingPage.js — Shared listing page for all sections
// Used by: /jobs, /results, /admit-cards, /answer-keys
//
// Features:
//  - Category tab strip (Recruitments | Results | Admit Cards | Answer Keys | Syllabus)
//  - Search bar
//  - Amazon-style sidebar filter (instant apply, no modal)
//  - Load more / infinite scroll
//  - Wired to /api/notifications (the rich, full-filter API)
// ============================================================

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import JobCard from './JobCard'
import { useLanguage } from '../context/LanguageContext'

// ── Category tabs shown at top of every listing page ──────────
const CATEGORY_TABS = [
  { id: 'all',         label: 'All',          icon: 'grid_view',           href: '/jobs' },
  { id: 'recruitment', label: 'Jobs',          icon: 'work',               href: '/jobs' },
  { id: 'result',      label: 'Results',       icon: 'emoji_events',       href: '/results' },
  { id: 'admit_card',  label: 'Admit Cards',   icon: 'badge',              href: '/admit-cards' },
  { id: 'answer_key',  label: 'Answer Keys',   icon: 'fact_check',         href: '/answer-keys' },
  { id: 'syllabus',    label: 'Syllabus',      icon: 'menu_book',          href: '/schemes' },
]

// ── Static filter options ─────────────────────────────────────
const ORGS = [
  // Use EXACT acronyms from the organizations DB table
  { id: 'IISER PUNE',          label: 'IISER Pune' },
  { id: 'SRPF',                label: 'SRPF' },
  { id: 'MUMBAI POLICE',       label: 'Mumbai Police' },
  { id: 'ACTREC',              label: 'ACTREC' },
  { id: 'ICAR-CIRCOT',         label: 'ICAR-CIRCOT' },
  { id: 'BMC',                 label: 'BMC' },
  { id: 'THANE POLICE',        label: 'Thane Police' },
  { id: 'KRCL',                label: 'KRCL' },
  { id: 'CSIR-NEERI',          label: 'CSIR-NEERI' },
  { id: 'MECL',                label: 'MECL' },
  { id: 'PDKV AKOLA',          label: 'PDKV Akola' },
  { id: 'ICAR-NBSS&LUP',       label: 'ICAR-NBSS' },
  { id: 'AIIMS NAGPUR',        label: 'AIIMS Nagpur' },
  { id: 'UPSC',                label: 'UPSC' },
  { id: 'SSC',                 label: 'SSC' },
  { id: 'RRB',                 label: 'Railway (RRB)' },
  { id: 'MPSC',                label: 'MPSC' },
  { id: 'IBPS',                label: 'IBPS' },
  { id: 'SBI',                 label: 'SBI' },
]

const QUALIFICATIONS = [
  { id: '10th',         label: '10th Pass' },
  { id: '12th',         label: '12th Pass' },
  { id: 'graduate',     label: 'Graduate' },
  { id: 'post_graduate',label: 'Post Graduate' },
  { id: 'diploma',      label: 'Diploma / ITI' },
]

const STATES = [
  { id: 'all-india',    label: 'All India' },
  { id: 'maharashtra',  label: 'Maharashtra' },
  { id: 'up',           label: 'Uttar Pradesh' },
  { id: 'bihar',        label: 'Bihar' },
  { id: 'rajasthan',    label: 'Rajasthan' },
  { id: 'gujarat',      label: 'Gujarat' },
  { id: 'punjab',       label: 'Punjab' },
  { id: 'haryana',      label: 'Haryana' },
  { id: 'delhi',        label: 'Delhi' },
  { id: 'madhya-pradesh', label: 'Madhya Pradesh' },
  { id: 'tamil-nadu',   label: 'Tamil Nadu' },
  { id: 'telangana',    label: 'Telangana' },
  { id: 'andhra-pradesh', label: 'Andhra Pradesh' },
  { id: 'karnataka',    label: 'Karnataka' },
  { id: 'kerala',       label: 'Kerala' },
  { id: 'west-bengal',  label: 'West Bengal' },
  { id: 'odisha',       label: 'Odisha' },
  { id: 'jharkhand',    label: 'Jharkhand' },
  { id: 'chhattisgarh', label: 'Chhattisgarh' },
  { id: 'uttarakhand',  label: 'Uttarakhand' },
  { id: 'himachal-pradesh', label: 'Himachal Pradesh' },
  { id: 'goa',          label: 'Goa' },
]

const SALARY_RANGES = [
  { id: '10000',  label: '₹10,000+' },
  { id: '25000',  label: '₹25,000+' },
  { id: '50000',  label: '₹50,000+' },
  { id: '100000', label: '₹1 Lakh+' },
]

const PAGE_SIZE = 20

// ── Convert API row → JobCard shape ───────────────────────────
function toCard(n) {
  const orgAcronym = n.org_acronym || n.board_slug || 'GOVT'
  const id = n.id
  const slug = n.slug || (orgAcronym.toLowerCase() + '-' + id)
  return {
    id,
    slug,
    title:            n.title,
    title_mr:         n.title_mr,
    summary_mr:       n.summary_mr,
    org_name_mr:      n.org_name_mr,
    department:       n.org_name,
    organization:     orgAcronym,
    vacancies:        n.total_vacancies || n.vacancies || null,
    apply_start:      n.apply_start_date || n.application_start,
    apply_end:        n.apply_end_date   || n.application_end,
    exam_date:        n.exam_date,
    is_walk_in:       n.is_walk_in,
    employment_type:  n.employment_type,
    location:         Array.isArray(n.exam_cities) ? n.exam_cities.join(', ') : (n.exam_cities || ''),
    notification_pdf: n.notification_pdf || n.notification_pdf_url,
    source_url:       n.source_url,
    application_fee:  n.application_fee,
    status:           n.status,
    notification_type: n.notification_type || 'recruitment',
    salary_min:       n.salary_min,
    salary_max:       n.salary_max,
  }
}

// ── Sidebar filter section component ─────────────────────────
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid var(--outline-variant)', paddingBottom: 16, marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '0 0 12px 0', fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </span>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--secondary)' }}>
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}

// ── Main shared component ─────────────────────────────────────
export default function ListingPage({
  defaultType,
  title,
  subtitle,
  headerIcon = 'work',
  accentColor,
}) {
  const { lang, t, isMarathi } = useLanguage()

  // ── Active tab = same as defaultType ──────────────────────
  const [activeTab, setActiveTab] = useState(defaultType || 'all')

  // ── Filters ───────────────────────────────────────────────
  const [search,      setSearch]      = useState('')
  const [selOrgs,     setSelOrgs]     = useState([])  // multi-select org
  const [selQual,     setSelQual]     = useState('')
  const [selState,    setSelState]    = useState('')
  const [selSalary,   setSelSalary]   = useState('')
  const [selGovtLevel, setSelGovtLevel] = useState('')  // Central|State|PSU|Local
  const [sort,        setSort]        = useState('latest')

  // ── Data ──────────────────────────────────────────────────
  const [items,   setItems]   = useState([])
  const [total,   setTotal]   = useState(0)
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // ── Mobile sidebar toggle ──────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ── Fetch from /api/notifications ─────────────────────────
  const fetchItems = useCallback(async (reset = false) => {
    setLoading(true)
    setError(null)
    const currentPage = reset ? 1 : page

    const p = new URLSearchParams({
      status: 'published',
      sort,
      page:   String(currentPage),
      limit:  String(PAGE_SIZE),
    })

    // Use activeTab as the notification_type filter
    const typeToSend = activeTab !== 'all' ? activeTab : null
    if (typeToSend)       p.set('type', typeToSend)
    if (search.trim())    p.set('q', search.trim())
    // Send all selected orgs as comma-separated string
    if (selOrgs.length > 0) p.set('org', selOrgs.join(','))
    if (selState)         p.set('state', selState)
    if (selQual)          p.set('qualification', selQual)
    if (selSalary)        p.set('min_salary', selSalary)
    if (selGovtLevel)     p.set('govt_level', selGovtLevel)

    try {
      const res = await fetch(`/api/notifications?${p}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const rows  = json?.data?.notifications || []
      const count = json?.data?.total || 0

      const mapped = rows.map(toCard)
      if (reset) {
        setItems(mapped)
        setPage(1)
      } else {
        setItems(prev => currentPage === 1 ? mapped : [...prev, ...mapped])
      }
      setTotal(count)
    } catch (e) {
      setError(isMarathi ? 'माहिती लोड करण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.' : 'Failed to load. Please try again.')
      console.error('[ListingPage] fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [activeTab, search, sort, selOrgs, selState, selQual, selSalary, selGovtLevel, page, isMarathi])

  // Re-fetch when filters change (reset to page 1)
  const searchTimer = useRef(null)
  useEffect(() => {
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => fetchItems(true), search ? 350 : 0)
    return () => clearTimeout(searchTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sort, selOrgs, selState, selQual, selSalary, selGovtLevel, search])

  // Load more
  useEffect(() => {
    if (page > 1) fetchItems(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // ── Toggle org selection (multi) ──────────────────────────
  function toggleOrg(id) {
    setSelOrgs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function clearAll() {
    setSelOrgs([])
    setSelQual('')
    setSelState('')
    setSelSalary('')
    setSelGovtLevel('')
  }

  const hasFilters = selOrgs.length > 0 || selQual || selState || selSalary || selGovtLevel
  const hasMore    = items.length < total

  // ── Page label ────────────────────────────────────────────
  const tabLabel = isMarathi
    ? ({
        all: 'सर्व जाहिराती', recruitment: 'नोकऱ्या', result: 'निकाल',
        admit_card: 'प्रवेशपत्र', answer_key: 'उत्तरतालिका', syllabus: 'अभ्यासक्रम',
      }[activeTab] || 'जाहिराती')
    : ({
        all: 'Notifications', recruitment: 'Jobs', result: 'Results',
        admit_card: 'Admit Cards', answer_key: 'Answer Keys', syllabus: 'Syllabi',
      }[activeTab] || 'Notifications')

  const primaryColor = accentColor || 'var(--primary)'

  const categoryTabs = [
    { id: 'all',         label: t('listing.all', 'All'),                 icon: 'grid_view',     href: '/jobs' },
    { id: 'recruitment', label: t('listing.jobs', 'Jobs'),               icon: 'work',          href: '/jobs' },
    { id: 'result',      label: t('listing.results', 'Results'),         icon: 'emoji_events',  href: '/results' },
    { id: 'admit_card',  label: t('listing.admit_cards', 'Admit Cards'), icon: 'badge',         href: '/admit-cards' },
    { id: 'answer_key',  label: t('listing.answer_keys', 'Answer Keys'), icon: 'fact_check',    href: '/answer-keys' },
    { id: 'syllabus',    label: t('listing.syllabus', 'Syllabus'),       icon: 'menu_book',     href: '/schemes' },
  ]

  const qualList = isMarathi ? [
    { id: '10th',          label: '१०वी उत्तीर्ण' },
    { id: '12th',          label: '१२वी उत्तीर्ण' },
    { id: 'graduate',      label: 'पदवीधर (Graduate)' },
    { id: 'post_graduate', label: 'पदव्युत्तर (Post Graduate)' },
    { id: 'diploma',       label: 'डिप्लोमा / ITI' },
  ] : QUALIFICATIONS

  const salaryList = isMarathi ? [
    { id: '10000',  label: '₹१०,०००+' },
    { id: '25000',  label: '₹२५,०००+' },
    { id: '50000',  label: '₹५०,०००+' },
    { id: '100000', label: '₹१ लाख+' },
  ] : SALARY_RANGES

  const statesList = isMarathi ? [
    { id: 'maharashtra', label: 'महाराष्ट्र' },
    { id: 'up',          label: 'उत्तर प्रदेश' },
    { id: 'bihar',       label: 'बिहार' },
    { id: 'rajasthan',   label: 'राजस्थान' },
    { id: 'gujarat',     label: 'गुजरात' },
    { id: 'delhi',       label: 'दिल्ली' },
    { id: 'karnataka',   label: 'कर्नाटक' },
    { id: 'mp',          label: 'मध्य प्रदेश' },
  ] : STATES

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 80 }}>

      {/* ── Category Tab Nav ──────────────────────────────── */}
      <div
        id="listing-category-tabs"
        style={{
          display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
          marginBottom: 20, scrollbarWidth: 'none',
        }}
      >
        {categoryTabs.map(tab => {
          const isActive = tab.id === activeTab || (tab.id === 'recruitment' && activeTab === 'all' && defaultType === 'recruitment')
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={e => {
                if (tab.href === window.location.pathname || tab.id === activeTab) {
                  e.preventDefault()
                  setActiveTab(tab.id)
                }
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 999, whiteSpace: 'nowrap',
                border: isActive ? `1.5px solid ${primaryColor}` : '1.5px solid var(--outline-variant)',
                background: isActive ? primaryColor : 'var(--surface-container-low)',
                color: isActive ? '#fff' : 'var(--on-surface)',
                fontWeight: isActive ? 700 : 500, fontSize: 13,
                textDecoration: 'none', cursor: 'pointer',
                transition: 'all 0.18s',
              }}
              id={`tab-${tab.id}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* ── Search + Sort row ─────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {/* Search */}
        <div className="search-hero" style={{ flex: 1 }}>
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder={isMarathi ? 'जाहिराती किंवा पदे शोधा...' : `Search ${tabLabel.toLowerCase()}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="listing-search-input"
            aria-label={`Search ${tabLabel}`}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)', display: 'flex' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
            </button>
          )}
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="listing-mobile-filter-btn"
          style={{
            background: hasFilters ? primaryColor : 'var(--surface-container-low)',
            border: '1px solid var(--outline-variant)',
            borderRadius: 12, padding: '0 14px',
            display: 'none', alignItems: 'center', gap: 6,
            cursor: 'pointer', color: hasFilters ? '#fff' : 'var(--on-surface)',
            fontFamily: 'inherit', fontSize: 14,
          }}
          id="mobile-filter-toggle"
          aria-label="Open filters"
        >
          <span className="material-symbols-outlined">tune</span>
          {hasFilters ? `${t('listing.filter_title', 'Filters')} (${selOrgs.length + (selQual?1:0) + (selState?1:0) + (selSalary?1:0)})` : t('listing.filter_title', 'Filters')}
        </button>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="form-select"
          style={{ minWidth: 150, paddingRight: 32 }}
          id="listing-sort-select"
          aria-label="Sort"
        >
          <option value="latest">{t('listing.sort_latest', 'Latest First')}</option>
          <option value="closing">{t('listing.sort_closing', 'Closing Soon')}</option>
          <option value="vacancies">{t('listing.sort_vacancies', 'Most Posts')}</option>
        </select>
      </div>

      {/* ── Count + active filter chips ───────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)' }}>
            {loading && items.length === 0 ? 'Loading…' : `${total.toLocaleString('en-IN')} ${tabLabel}`}
          </span>
          {hasFilters && (
            <button
              onClick={clearAll}
              style={{ marginLeft: 12, fontSize: 12, color: primaryColor, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            >
              Clear all filters
            </button>
          )}
        </div>
        {/* Active filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {selOrgs.map(o => (
            <span key={o} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 999, fontSize: 12, color: '#C2410C', fontWeight: 600 }}>
              {o}
              <button onClick={() => toggleOrg(o)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'inherit', padding: 0 }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span></button>
            </span>
          ))}
          {selQual && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 999, fontSize: 12, color: '#1D4ED8', fontWeight: 600 }}>
              {QUALIFICATIONS.find(q => q.id === selQual)?.label}
              <button onClick={() => setSelQual('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'inherit', padding: 0 }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span></button>
            </span>
          )}
          {selState && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 999, fontSize: 12, color: '#15803D', fontWeight: 600 }}>
              {STATES.find(s => s.id === selState)?.label}
              <button onClick={() => setSelState('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'inherit', padding: 0 }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span></button>
            </span>
          )}
        </div>
      </div>

      {/* ── Two-column layout: Sidebar + Main ─────────────── */}
      <div className="listing-layout">

        {/* ════ SIDEBAR FILTER ════ */}
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }}
          />
        )}

        <aside
          className={`listing-sidebar${sidebarOpen ? ' listing-sidebar-open' : ''}`}
          id="listing-filter-sidebar"
          aria-label="Filters"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)' }}>{t('listing.filter_title', 'Filters')}</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  style={{ fontSize: 12, color: primaryColor, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
                >
                  {t('listing.clear_all', 'Clear All')}
                </button>
              )}
              {/* Mobile close */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="listing-sidebar-close"
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', color: 'var(--secondary)' }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Organization filter */}
          <FilterSection title={t('listing.filter_board', 'Organization / Board')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ORGS.map(org => (
                <label
                  key={org.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 8px', borderRadius: 8, background: selOrgs.includes(org.id) ? '#FFF7ED' : 'transparent', transition: 'background 0.15s' }}
                  htmlFor={`filter-org-${org.id}`}
                >
                  <input
                    type="checkbox"
                    id={`filter-org-${org.id}`}
                    checked={selOrgs.includes(org.id)}
                    onChange={() => toggleOrg(org.id)}
                    style={{ accentColor: primaryColor, width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 14, color: selOrgs.includes(org.id) ? '#C2410C' : 'var(--on-surface)', fontWeight: selOrgs.includes(org.id) ? 600 : 400 }}>
                    {org.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Education filter */}
          <FilterSection title={t('listing.filter_qualification', 'Education / Qualification')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {qualList.map(q => (
                <label
                  key={q.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 8px', borderRadius: 8, background: selQual === q.id ? '#EFF6FF' : 'transparent', transition: 'background 0.15s' }}
                  htmlFor={`filter-qual-${q.id}`}
                >
                  <input
                    type="radio"
                    id={`filter-qual-${q.id}`}
                    name="qualification"
                    checked={selQual === q.id}
                    onChange={() => setSelQual(prev => prev === q.id ? '' : q.id)}
                    style={{ accentColor: '#1D4ED8', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 14, color: selQual === q.id ? '#1D4ED8' : 'var(--on-surface)', fontWeight: selQual === q.id ? 600 : 400 }}>
                    {q.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* State filter */}
          <FilterSection title={t('listing.filter_state', 'State')} defaultOpen={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {statesList.map(s => (
                <label
                  key={s.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 8px', borderRadius: 8, background: selState === s.id ? '#F0FDF4' : 'transparent', transition: 'background 0.15s' }}
                  htmlFor={`filter-state-${s.id}`}
                >
                  <input
                    type="radio"
                    id={`filter-state-${s.id}`}
                    name="state"
                    checked={selState === s.id}
                    onChange={() => setSelState(prev => prev === s.id ? '' : s.id)}
                    style={{ accentColor: '#15803D', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 14, color: selState === s.id ? '#15803D' : 'var(--on-surface)', fontWeight: selState === s.id ? 600 : 400 }}>
                    {s.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Government Level filter */}
          <FilterSection title={t('listing.filter_govt_level', 'Government Level')} defaultOpen={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { id: 'Central', label: '🏛️ Central Govt', desc: 'UPSC, SSC, Railways, Banks' },
                { id: 'State',   label: '🏢 State Govt',   desc: 'MPSC, Police, ZP, BMC' },
                { id: 'PSU',     label: '🏭 PSU / Corp',   desc: 'ONGC, BHEL, NTPC, etc.' },
                { id: 'Local',   label: '🏘️ Local Bodies',  desc: 'Municipal, Panchayat' },
              ].map(gl => (
                <label
                  key={gl.id}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '6px 8px', borderRadius: 8, background: selGovtLevel === gl.id ? '#FFF7ED' : 'transparent', transition: 'background 0.15s' }}
                  htmlFor={`filter-govtlevel-${gl.id}`}
                >
                  <input
                    type="radio"
                    id={`filter-govtlevel-${gl.id}`}
                    name="govt_level"
                    checked={selGovtLevel === gl.id}
                    onChange={() => setSelGovtLevel(prev => prev === gl.id ? '' : gl.id)}
                    style={{ accentColor: 'var(--primary)', width: 16, height: 16, marginTop: 2 }}
                  />
                  <div>
                    <div style={{ fontSize: 14, color: selGovtLevel === gl.id ? 'var(--primary)' : 'var(--on-surface)', fontWeight: selGovtLevel === gl.id ? 700 : 400 }}>{gl.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--secondary)' }}>{gl.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Salary filter — only on recruitment/all */}
          {(activeTab === 'all' || activeTab === 'recruitment') && (
            <FilterSection title={t('listing.filter_salary', 'Minimum Salary')} defaultOpen={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {salaryList.map(s => (
                  <label
                    key={s.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 8px', borderRadius: 8, background: selSalary === s.id ? '#FFF7ED' : 'transparent', transition: 'background 0.15s' }}
                    htmlFor={`filter-salary-${s.id}`}
                  >
                    <input
                      type="radio"
                      id={`filter-salary-${s.id}`}
                      name="salary"
                      checked={selSalary === s.id}
                      onChange={() => setSelSalary(prev => prev === s.id ? '' : s.id)}
                      style={{ accentColor: '#C2410C', width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 14, color: selSalary === s.id ? '#C2410C' : 'var(--on-surface)', fontWeight: selSalary === s.id ? 600 : 400 }}>
                      {s.label}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>
          )}
        </aside>

        {/* ════ MAIN CONTENT ════ */}
        <main id="listing-main-content">

          {/* Error state */}
          {error && (
            <div style={{ padding: 24, textAlign: 'center', background: 'var(--error-container)', borderRadius: 12, marginBottom: 16, color: 'var(--on-error-container)' }}>
              {error}
            </div>
          )}

          {/* Skeleton loading */}
          {loading && items.length === 0 && (
            <div className="grid-jobs">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 16, height: 180, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && items.length === 0 && !error && (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--surface-container-lowest)', borderRadius: 16, border: '1px dashed var(--outline-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--secondary)', display: 'block', marginBottom: 12 }}>search_off</span>
              <p style={{ color: 'var(--secondary)', fontSize: 16, marginBottom: 8 }}>
                {search ? (isMarathi ? `"${search}" साठी कोणतेही निकाल सापडले नाहीत` : `No results for "${search}"`) : (isMarathi ? `कोणत्याही ${tabLabel} सापडल्या नाहीत.` : `No ${tabLabel} found with current filters.`)}
              </p>
              {hasFilters && (
                <button className="btn-outline" onClick={clearAll} style={{ marginTop: 8 }}>
                  {isMarathi ? 'फिल्टर्स हटवा' : 'Clear Filters'}
                </button>
              )}
            </div>
          )}

          {/* Cards grid */}
          {items.length > 0 && (
            <div className="grid-jobs" style={{ marginBottom: 32 }}>
              {items.map(item => (
                <JobCard key={item.slug || item.id} job={item} />
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && !loading && (
            <div style={{ textAlign: 'center', paddingBottom: 32 }}>
              <button
                className="btn-outline"
                style={{ padding: '12px 40px', fontSize: 15 }}
                onClick={() => setPage(p => p + 1)}
                id="load-more-btn"
              >
                {isMarathi ? `अधिक ${tabLabel} पहा` : `Load More ${tabLabel}`}
              </button>
            </div>
          )}

          {loading && items.length > 0 && (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3, display: 'inline-block' }} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
