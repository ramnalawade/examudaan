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

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import JobCard from './JobCard'
import { LoadMore } from './Pagination'
import { useLanguage } from '../context/LanguageContext'
import { trackJobFilterApply, trackJobSearch } from '../lib/analytics'
import { formatTitle } from '../lib/formatTitle'
import styles from './ListingPage.module.css'

// ── Category tabs shown at top of every listing page ──────────
const CATEGORY_TABS = [
  { id: 'all', label: 'All', icon: 'grid_view', href: '/jobs' },
  { id: 'recruitment', label: 'Jobs', icon: 'work', href: '/jobs' },
  { id: 'result', label: 'Results', icon: 'emoji_events', href: '/results' },
  { id: 'admit_card', label: 'Admit Cards', icon: 'badge', href: '/admit-cards' },
  { id: 'answer_key', label: 'Answer Keys', icon: 'fact_check', href: '/answer-keys' },
  { id: 'syllabus', label: 'Syllabus', icon: 'menu_book', href: '/schemes' },
  { id: 'career', label: 'Career Guide', icon: 'explore', href: '/career' },
]

// ── Static filter options ─────────────────────────────────────
const ORGS = [
  // Use EXACT acronyms from the organizations DB table
  { id: 'ACTREC', label: 'ACTREC' },
  { id: 'AIIMS NAGPUR', label: 'AIIMS Nagpur' },
  { id: 'BMC', label: 'BMC' },
  { id: 'CSIR-NEERI', label: 'CSIR-NEERI' },
  { id: 'IBPS', label: 'IBPS' },
  { id: 'ICAR-CIRCOT', label: 'ICAR-CIRCOT' },
  { id: 'ICAR-NBSS&LUP', label: 'ICAR-NBSS' },
  { id: 'IISER PUNE', label: 'IISER Pune' },
  { id: 'KRCL', label: 'KRCL' },
  { id: 'MECL', label: 'MECL' },
  { id: 'MPSC', label: 'MPSC' },
  { id: 'MUMBAI POLICE', label: 'Mumbai Police' },
  { id: 'PDKV AKOLA', label: 'PDKV Akola' },
  { id: 'RRB', label: 'Railway (RRB)' },
  { id: 'SBI', label: 'SBI' },
  { id: 'SRPF', label: 'SRPF' },
  { id: 'SSC', label: 'SSC' },
  { id: 'THANE POLICE', label: 'Thane Police' },
  { id: 'UPSC', label: 'UPSC' },
]

const QUALIFICATIONS = [
  { id: '10th', label: '10th Pass' },
  { id: '12th', label: '12th Pass' },
  { id: 'graduate', label: 'Graduate' },
  { id: 'post_graduate', label: 'Post Graduate' },
  { id: 'diploma', label: 'Diploma / ITI' },
]

const STATES = [
  { id: 'all-india', label: 'All India' }, // kept first as the default/special option
  { id: 'andhra-pradesh', label: 'Andhra Pradesh' },
  { id: 'bihar', label: 'Bihar' },
  { id: 'chhattisgarh', label: 'Chhattisgarh' },
  { id: 'delhi', label: 'Delhi' },
  { id: 'goa', label: 'Goa' },
  { id: 'gujarat', label: 'Gujarat' },
  { id: 'haryana', label: 'Haryana' },
  { id: 'himachal-pradesh', label: 'Himachal Pradesh' },
  { id: 'jharkhand', label: 'Jharkhand' },
  { id: 'karnataka', label: 'Karnataka' },
  { id: 'kerala', label: 'Kerala' },
  { id: 'madhya-pradesh', label: 'Madhya Pradesh' },
  { id: 'maharashtra', label: 'Maharashtra' },
  { id: 'odisha', label: 'Odisha' },
  { id: 'punjab', label: 'Punjab' },
  { id: 'rajasthan', label: 'Rajasthan' },
  { id: 'tamil-nadu', label: 'Tamil Nadu' },
  { id: 'telangana', label: 'Telangana' },
  { id: 'uttar-pradesh', label: 'Uttar Pradesh' },
  { id: 'uttarakhand', label: 'Uttarakhand' },
  { id: 'west-bengal', label: 'West Bengal' },
]

const MAHARASHTRA_DISTRICTS = [
  { id: 'Ahmednagar', label: 'Ahilyanagar', label_mr: 'अहिल्यानगर' },
  { id: 'Akola', label: 'Akola', label_mr: 'अकोला' },
  { id: 'Amravati', label: 'Amravati', label_mr: 'अमरावती' },
  { id: 'Aurangabad', label: 'Chh. Sambhajinagar', label_mr: 'छत्रपती संभाजीनगर' },
  { id: 'Chandrapur', label: 'Chandrapur', label_mr: 'चंद्रपूर' },
  { id: 'Dhule', label: 'Dhule', label_mr: 'धुळे' },
  { id: 'Jalgaon', label: 'Jalgaon', label_mr: 'जळगाव' },
  { id: 'Kolhapur', label: 'Kolhapur', label_mr: 'कोल्हापूर' },
  { id: 'Latur', label: 'Latur', label_mr: 'लातूर' },
  { id: 'Mumbai', label: 'Mumbai', label_mr: 'मुंबई' },
  { id: 'Nagpur', label: 'Nagpur', label_mr: 'नागपूर' },
  { id: 'Nanded', label: 'Nanded', label_mr: 'नांदेड' },
  { id: 'Nashik', label: 'Nashik', label_mr: 'नाशिक' },
  { id: 'Pune', label: 'Pune', label_mr: 'पुणे' },
  { id: 'Ratnagiri', label: 'Ratnagiri', label_mr: 'रत्नागिरी' },
  { id: 'Sangli', label: 'Sangli', label_mr: 'सांगली' },
  { id: 'Satara', label: 'Satara', label_mr: 'सातारा' },
  { id: 'Solapur', label: 'Solapur', label_mr: 'सोलापूर' },
  { id: 'Thane', label: 'Thane', label_mr: 'ठाणे' },
]

const SALARY_RANGES = [
  { id: '10000', label: '₹10,000+' },
  { id: '25000', label: '₹25,000+' },
  { id: '50000', label: '₹50,000+' },
  { id: '100000', label: '₹1 Lakh+' },
]

const VACANCY_RANGES = [
  { id: '10', label: '10+ Posts', label_mr: '१०+ जागा' },
  { id: '50', label: '50+ Posts', label_mr: '५०+ जागा' },
  { id: '100', label: '100+ Posts', label_mr: '१००+ जागा' },
  { id: '500', label: '500+ Posts', label_mr: '५००+ जागा' },
  { id: '1000', label: '1,000+ Posts', label_mr: '१,०००+ जागा' },
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
    title: formatTitle(n.title),
    title_mr: n.title_mr,
    summary_mr: n.summary_mr,
    org_name_mr: n.org_name_mr,
    department: formatTitle(n.org_name),
    organization: orgAcronym,
    vacancies: n.total_vacancies || n.vacancies || null,
    apply_start: n.apply_start_date || n.application_start,
    apply_end: n.apply_end_date || n.application_end,
    exam_date: n.exam_date,
    is_walk_in: n.is_walk_in,
    employment_type: n.employment_type,
    location: Array.isArray(n.exam_cities) ? n.exam_cities.join(', ') : (n.exam_cities || ''),
    notification_pdf: n.notification_pdf || n.notification_pdf_url,
    source_url: n.source_url,
    application_fee: n.application_fee,
    status: n.status,
    notification_type: n.notification_type || 'recruitment',
    salary_min: n.salary_min,
    salary_max: n.salary_max,
    published_at: n.published_at,
    created_at: n.created_at,
  }
}

// ── Sidebar filter section component ─────────────────────────
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={styles.filterSection}>
      <button
        onClick={() => setOpen(o => !o)}
        className={styles.filterSectionToggle}
      >
        <span className={styles.filterSectionTitle}>
          {title}
        </span>
        <span className={`material-symbols-outlined ${styles.filterSectionChevron}`}>
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}

// ── Main shared component ─────────────────────────────────────
function ListingPageInner({
  defaultType,
  title,
  subtitle,
  headerIcon = 'work',
  accentColor,
  initialOrgs = [],
  initialSort = '',
  initialGovtLevel = '',
}) {
  const { lang, t, isMarathi } = useLanguage()
  const searchParams = useSearchParams()
  const initialSyncRef = useRef(false)

  // ── Active tab = same as defaultType ──────────────────────
  const [activeTab, setActiveTab] = useState(defaultType || 'all')

  // ── Filters ───────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [selOrgs, setSelOrgs] = useState(initialOrgs)  // multi-select org
  const [selQual, setSelQual] = useState('')
  const [selState, setSelState] = useState('')
  const [selCity, setSelCity] = useState('')
  const [selSalary, setSelSalary] = useState('')
  const [selGovtLevel, setSelGovtLevel] = useState(initialGovtLevel)  // Central|State|PSU|Local
  const [selVacancies, setSelVacancies] = useState('')  // min_vacancies filter
  const [sort, setSort] = useState(initialSort || 'latest')
  const [statusFilter, setStatusFilter] = useState('published') // 'published' (Active) | 'closed' (On Demand) | 'all' (All)

  // Sync incoming search params on mount
  useEffect(() => {
    if (initialSyncRef.current || !searchParams) return
    initialSyncRef.current = true

    const st = searchParams.get('state')
    const ct = searchParams.get('city') || searchParams.get('district')
    const q = searchParams.get('q')
    const o = searchParams.get('org')
    const qual = searchParams.get('qualification')
    const lvl = searchParams.get('govt_level')
    const vac = searchParams.get('min_vacancies')
    const sal = searchParams.get('min_salary')
    const tp = searchParams.get('type')
    const stat = searchParams.get('status')

    if (st) {
      const lower = st.toLowerCase().trim()
      if (lower === 'up') setSelState('uttar-pradesh')
      else if (lower === 'mp') setSelState('madhya-pradesh')
      else setSelState(lower)
    }
    if (ct) setSelCity(ct)
    if (q) setSearch(q)
    if (o) setSelOrgs(o.split(',').filter(Boolean))
    if (qual) setSelQual(qual)
    if (lvl) setSelGovtLevel(lvl)
    if (vac) setSelVacancies(vac)
    if (sal) setSelSalary(sal)
    if (tp && tp !== 'all') setActiveTab(tp)
    if (stat) setStatusFilter(stat)
  }, [searchParams])

  // ── Data ──────────────────────────────────────────────────
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Mobile sidebar toggle ──────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ── Fetch from /api/notifications ─────────────────────────
  const fetchItems = useCallback(async (reset = false) => {
    setLoading(true)
    setError(null)
    const currentPage = reset ? 1 : page

    const p = new URLSearchParams({
      status: statusFilter,
      sort,
      page: String(currentPage),
      limit: String(PAGE_SIZE),
    })

    // Use activeTab as the notification_type filter
    const typeToSend = activeTab !== 'all' ? activeTab : null
    if (typeToSend) p.set('type', typeToSend)
    if (search.trim()) p.set('q', search.trim())
    // Send all selected orgs as comma-separated string
    if (selOrgs.length > 0) p.set('org', selOrgs.join(','))
    if (selState) p.set('state', selState)
    if (selCity) p.set('city', selCity)
    if (selQual) p.set('qualification', selQual)
    if (selSalary) p.set('min_salary', selSalary)
    if (selGovtLevel) p.set('govt_level', selGovtLevel)
    if (selVacancies) p.set('min_vacancies', selVacancies)

    try {
      const res = await fetch(`/api/notifications?${p}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const rows = json?.data?.notifications || []
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
  }, [activeTab, search, sort, statusFilter, selOrgs, selState, selCity, selQual, selSalary, selGovtLevel, selVacancies, page, isMarathi])

  // Re-fetch when filters change (reset to page 1)
  const searchTimer = useRef(null)
  const isInitialListingSearch = useRef(true)
  useEffect(() => {
    clearTimeout(searchTimer.current)
    if (!isInitialListingSearch.current && search.trim()) {
      trackJobSearch({ search_term: search })
    } else {
      isInitialListingSearch.current = false
    }
    searchTimer.current = setTimeout(() => fetchItems(true), search ? 350 : 0)
    return () => clearTimeout(searchTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sort, statusFilter, selOrgs, selState, selCity, selQual, selSalary, selGovtLevel, selVacancies, search])

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
    setSelCity('')
    setSelSalary('')
    setSelGovtLevel('')
    setSelVacancies('')
    setSearch('')
    setStatusFilter('published')
  }

  const hasFilters = selOrgs.length > 0 || selQual || selState || selCity || selSalary || selGovtLevel || selVacancies || search || statusFilter !== 'published'
  const hasMore = items.length < total

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

  // primaryColor: expose as CSS custom property on the wrapper element
  // so child CSS classes can reference var(--listing-accent)
  const primaryColor = accentColor || 'var(--primary)'

  const categoryTabs = [
    { id: 'all', label: t('listing.all', 'All'), icon: 'grid_view', href: '/jobs' },
    { id: 'recruitment', label: t('listing.jobs', 'Jobs'), icon: 'work', href: '/jobs' },
    { id: 'result', label: t('listing.results', 'Results'), icon: 'emoji_events', href: '/results' },
    { id: 'admit_card', label: t('listing.admit_cards', 'Admit Cards'), icon: 'badge', href: '/admit-cards' },
    { id: 'answer_key', label: t('listing.answer_keys', 'Answer Keys'), icon: 'fact_check', href: '/answer-keys' },
    { id: 'syllabus', label: t('listing.syllabus', 'Syllabus'), icon: 'menu_book', href: '/schemes' },
    { id: 'career', label: t('nav.career', 'Career Guide'), icon: 'explore', href: '/career' },
  ]

  const qualList = isMarathi ? [
    { id: '10th', label: '१०वी उत्तीर्ण' },
    { id: '12th', label: '१२वी उत्तीर्ण' },
    { id: 'graduate', label: 'पदवीधर (Graduate)' },
    { id: 'post_graduate', label: 'पदव्युत्तर (Post Graduate)' },
    { id: 'diploma', label: 'डिप्लोमा / ITI' },
  ] : QUALIFICATIONS

  const salaryList = isMarathi ? [
    { id: '10000', label: '₹१०,०००+' },
    { id: '25000', label: '₹२५,०००+' },
    { id: '50000', label: '₹५०,०००+' },
    { id: '100000', label: '₹१ लाख+' },
  ] : SALARY_RANGES

  const statesList = isMarathi ? [
    { id: 'maharashtra', label: 'महाराष्ट्र' },
    { id: 'up', label: 'उत्तर प्रदेश' },
    { id: 'karnataka', label: 'कर्नाटक' },
    { id: 'gujarat', label: 'गुजरात' },
    { id: 'delhi', label: 'दिल्ली' },
    { id: 'bihar', label: 'बिहार' },
    { id: 'mp', label: 'मध्य प्रदेश' },
    { id: 'rajasthan', label: 'राजस्थान' },
  ] : STATES

  return (
    // Set --listing-accent CSS custom property on the root div so all
    // descendant CSS classes can reference it without any inline styles.
    <div className={`container ${styles.pageWrapper}`} style={{ '--listing-accent': primaryColor }}>

      {/* ── Page Header / H1 ──────────────────────────────── */}
      <div className={styles.pageHeaderBox}>
        <h1 className={styles.pageH1}>
          {headerIcon && (
            <span className={`material-symbols-outlined ${styles.pageH1Icon}`}>
              {headerIcon}
            </span>
          )}
          {title || tabLabel}
        </h1>
        {subtitle && (
          <p className={styles.pageSubtitle}>
            {subtitle}
          </p>
        )}
      </div>

      {/* ── Category Tab Nav ──────────────────────────────── */}
      <div
        id="listing-category-tabs"
        className={styles.categoryTabsRow}
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
              className={`${styles.categoryTab}${isActive ? ` ${styles.categoryTabActive}` : ''}`}
              id={`tab-${tab.id}`}
            >
              <span className={`material-symbols-outlined ${styles.categoryTabIcon}`}>{tab.icon}</span>
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* ── Quick Filter Bar ── */}
      <div
        id="listing-quick-chips"
        className={styles.quickChipsRow}
      >
        {[
          { label: isMarathi ? '🚩 महाराष्ट्र' : '🚩 Maharashtra', type: 'state', value: 'maharashtra' },
          { label: isMarathi ? '🏛️ केंद्र सरकार' : '🏛️ Central Govt', type: 'govt_level', value: 'Central' },
          { label: isMarathi ? '📍 नागपूर' : '📍 Nagpur', type: 'city', value: 'Nagpur' },
          { label: isMarathi ? '📍 मुंबई' : '📍 Mumbai', type: 'city', value: 'Mumbai' },
          { label: isMarathi ? '📍 पुणे' : '📍 Pune', type: 'city', value: 'Pune' },
          { label: isMarathi ? '🎓 १०वी उत्तीर्ण' : '🎓 10th Pass', type: 'qualification', value: '10th' },
          { label: isMarathi ? '🎓 १२वी उत्तीर्ण' : '🎓 12th Pass', type: 'qualification', value: '12th' },
          { label: isMarathi ? '🎓 पदवीधर' : '🎓 Graduate', type: 'qualification', value: 'graduate' },
          { label: isMarathi ? '⏰ अंतिम मुदत जवळ' : '⏰ Closing Soon', type: 'sort', value: 'closing' },
          { label: isMarathi ? '📁 बंद जाहिराती' : '📁 Closed Jobs', type: 'status', value: 'closed' },
        ].map(chip => {
          let isChipActive = false
          if (chip.type === 'state') isChipActive = selState === chip.value
          if (chip.type === 'govt_level') isChipActive = selGovtLevel === chip.value
          if (chip.type === 'city') isChipActive = selCity === chip.value
          if (chip.type === 'qualification') isChipActive = selQual === chip.value
          if (chip.type === 'sort') isChipActive = sort === chip.value
          if (chip.type === 'status') isChipActive = statusFilter === chip.value

          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => {
                trackJobFilterApply({ filter_type: chip.type, filter_value: chip.value })
                if (chip.type === 'state') setSelState(prev => prev === chip.value ? '' : chip.value)
                if (chip.type === 'govt_level') setSelGovtLevel(prev => prev === chip.value ? '' : chip.value)
                if (chip.type === 'city') setSelCity(prev => prev === chip.value ? '' : chip.value)
                if (chip.type === 'qualification') setSelQual(prev => prev === chip.value ? '' : chip.value)
                if (chip.type === 'sort') setSort(prev => prev === chip.value ? 'latest' : chip.value)
                if (chip.type === 'status') setStatusFilter(prev => prev === chip.value ? 'published' : chip.value)
              }}
              className={`${styles.quickChip}${isChipActive ? ` ${styles.quickChipActive}` : ''}`}
            >
              {chip.label}
              {isChipActive && <span className={`material-symbols-outlined ${styles.quickChipCheckIcon}`}>check</span>}
            </button>
          )
        })}
      </div>

      {/* ── Search + Sort row ─────────────────────────────── */}
      <div className={styles.searchSortRow}>
        {/* Search - Dominant width */}
        <div className={`search-hero ${styles.searchWrapper}`}>
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder={isMarathi ? 'जाहिराती किंवा पदे शोधा...' : `Search ${tabLabel.toLowerCase()}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="listing-search-input"
            aria-label={`Search ${tabLabel}`}
            className={styles.searchInput}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className={styles.searchClearBtn}
            >
              <span className={`material-symbols-outlined ${styles.searchClearIcon}`}>close</span>
            </button>
          )}
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className={`listing-mobile-filter-btn ${styles.mobileFilterBtn}`}
          data-active={hasFilters ? 'true' : 'false'}
          id="mobile-filter-toggle"
          aria-label="Open filters"
        >
          <span className="material-symbols-outlined">tune</span>
          {hasFilters ? `${t('listing.filter_title', 'Filters')} (${selOrgs.length + (selQual ? 1 : 0) + (selState ? 1 : 0) + (selCity ? 1 : 0) + (selSalary ? 1 : 0) + (selGovtLevel ? 1 : 0) + (selVacancies ? 1 : 0)})` : t('listing.filter_title', 'Filters')}
        </button>

        {/* Sort - Compact */}
        <div className={styles.sortWrapper}>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className={`form-select ${styles.sortSelect}`}
            id="listing-sort-select"
            aria-label="Sort"
          >
            <option value="latest">{t('listing.sort_latest', 'Latest First')}</option>
            <option value="closing">{t('listing.sort_closing', 'Closing Soon')}</option>
            <option value="vacancies">{t('listing.sort_vacancies', 'Most Posts')}</option>
          </select>
          <span className={`material-symbols-outlined ${styles.sortIcon}`}>
            expand_more
          </span>
        </div>
      </div>

      {/* ── Count + active filter chips ───────────────────── */}
      <div className={styles.countRow}>
        <div className={styles.countLeft}>
          <span className={styles.countLabel}>
            {loading && items.length === 0 ? 'Loading…' : `${total.toLocaleString('en-IN')} ${tabLabel}`}
          </span>
          {/* Active / Closed toggle pills (On Demand) */}
          <div className={styles.statusToggleGroup}>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`${styles.statusBtn}${statusFilter === 'published' ? ` ${styles.statusBtnActive}` : ''}`}
              id="filter-status-active-btn"
            >
              <span className={styles.statusDotGreen}></span>
              {isMarathi ? 'सुरू जाहिराती (Active)' : 'Active Jobs'}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('closed')}
              className={`${styles.statusBtn}${statusFilter === 'closed' ? ` ${styles.statusBtnClosed}` : ''}`}
              id="filter-status-closed-btn"
            >
              <span className={styles.statusDotGray}></span>
              {isMarathi ? 'बंद जाहिराती (Closed)' : 'Closed / Expired'}
            </button>
          </div>
          {hasFilters && (
            <button
              onClick={clearAll}
              className={styles.clearAllBtn}
            >
              Clear all filters
            </button>
          )}
        </div>
        {/* Active filter pills */}
        <div className={styles.activePillsRow}>
          {selOrgs.map(o => (
            <span key={o} className={styles.activePillOrg}>
              {o}
              <button onClick={() => toggleOrg(o)} className={styles.pillRemoveBtn}><span className={`material-symbols-outlined ${styles.pillRemoveIcon}`}>close</span></button>
            </span>
          ))}
          {selQual && (
            <span className={styles.activePillQual}>
              {QUALIFICATIONS.find(q => q.id === selQual)?.label}
              <button onClick={() => setSelQual('')} className={styles.pillRemoveBtn}><span className={`material-symbols-outlined ${styles.pillRemoveIcon}`}>close</span></button>
            </span>
          )}
          {selState && (
            <span className={styles.activePillState}>
              {STATES.find(s => s.id === selState)?.label}
              <button onClick={() => setSelState('')} className={styles.pillRemoveBtn}><span className={`material-symbols-outlined ${styles.pillRemoveIcon}`}>close</span></button>
            </span>
          )}
          {selCity && (
            <span className={styles.activePillCity}>
              📍 {selCity}
              <button onClick={() => setSelCity('')} className={styles.pillRemoveBtn}><span className={`material-symbols-outlined ${styles.pillRemoveIcon}`}>close</span></button>
            </span>
          )}
          {selVacancies && (
            <span className={styles.activePillVacancies}>
              {VACANCY_RANGES.find(v => v.id === selVacancies)?.label || `${selVacancies}+ Posts`}
              <button onClick={() => setSelVacancies('')} className={styles.pillRemoveBtn}><span className={`material-symbols-outlined ${styles.pillRemoveIcon}`}>close</span></button>
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
            className={styles.mobileOverlay}
          />
        )}

        <aside
          className={`listing-sidebar${sidebarOpen ? ' listing-sidebar-open' : ''}`}
          id="listing-filter-sidebar"
          aria-label="Filters"
        >
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>{t('listing.filter_title', 'Filters')}</h2>
            <div className={styles.sidebarHeaderActions}>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className={styles.sidebarClearBtn}
                >
                  {t('listing.clear_all', 'Clear All')}
                </button>
              )}
              {/* Mobile close */}
              <button
                onClick={() => setSidebarOpen(false)}
                className={`listing-sidebar-close ${styles.sidebarCloseBtn}`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Application Status Filter (Active vs Closed On Demand) */}
          <FilterSection title={isMarathi ? 'अर्जाची स्थिती' : 'Application Status'} defaultOpen={true}>
            <div className={styles.filterColGap6}>
              {[
                { id: 'published', label: isMarathi ? 'सुरू जाहिराती (नवीनतम)' : 'Active Jobs (Latest First)' },
                { id: 'closed', label: isMarathi ? 'मुदत संपलेल्या जाहिराती (Closed / Archive)' : 'Closed / Past Deadlines' },
                { id: 'all', label: isMarathi ? 'सर्व जाहिराती (Active + Closed)' : 'All Jobs (Active + Closed)' },
              ].map(st => (
                <label
                  key={st.id}
                  className={styles.filterLabel}
                  data-active={statusFilter === st.id ? 'true' : 'false'}
                  htmlFor={`filter-status-${st.id}`}
                >
                  <input
                    type="radio"
                    id={`filter-status-${st.id}`}
                    name="statusFilter"
                    checked={statusFilter === st.id}
                    onChange={() => setStatusFilter(st.id)}
                    className={styles.filterInputAccent}
                  />
                  <span
                    className={styles.filterTextStatus}
                    data-active={statusFilter === st.id ? 'true' : 'false'}
                  >
                    {st.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Organization filter */}
          <FilterSection title={t('listing.filter_board', 'Organization / Board')}>
            <div className={styles.filterColGap8}>
              {ORGS.map(org => (
                <label
                  key={org.id}
                  className={styles.filterLabel}
                  data-active={selOrgs.includes(org.id) ? 'true' : 'false'}
                  htmlFor={`filter-org-${org.id}`}
                >
                  <input
                    type="checkbox"
                    id={`filter-org-${org.id}`}
                    checked={selOrgs.includes(org.id)}
                    onChange={() => toggleOrg(org.id)}
                    className={styles.filterInputAccent}
                  />
                  <span
                    className={styles.filterTextOrg}
                    data-active={selOrgs.includes(org.id) ? 'true' : 'false'}
                  >
                    {org.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Education filter */}
          <FilterSection title={t('listing.filter_qualification', 'Education / Qualification')}>
            <div className={styles.filterColGap6}>
              {qualList.map(q => (
                <label
                  key={q.id}
                  className={styles.filterLabelQual}
                  data-active={selQual === q.id ? 'true' : 'false'}
                  htmlFor={`filter-qual-${q.id}`}
                >
                  <input
                    type="radio"
                    id={`filter-qual-${q.id}`}
                    name="qualification"
                    checked={selQual === q.id}
                    onChange={() => setSelQual(prev => prev === q.id ? '' : q.id)}
                    className={styles.filterInputBlue}
                  />
                  <span
                    className={styles.filterTextQual}
                    data-active={selQual === q.id ? 'true' : 'false'}
                  >
                    {q.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* State filter */}
          <FilterSection title={t('listing.filter_state', 'State')} defaultOpen={false}>
            <div className={styles.filterColGap6}>
              {statesList.map(s => (
                <label
                  key={s.id}
                  className={styles.filterLabelState}
                  data-active={selState === s.id ? 'true' : 'false'}
                  htmlFor={`filter-state-${s.id}`}
                >
                  <input
                    type="radio"
                    id={`filter-state-${s.id}`}
                    name="state"
                    checked={selState === s.id}
                    onChange={() => setSelState(prev => prev === s.id ? '' : s.id)}
                    className={styles.filterInputGreen}
                  />
                  <span
                    className={styles.filterTextState}
                    data-active={selState === s.id ? 'true' : 'false'}
                  >
                    {s.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Maharashtra District / City filter */}
          <FilterSection title={isMarathi ? 'महाराष्ट्र जिल्हे' : 'Maharashtra District'} defaultOpen={true}>
            <div className={styles.districtList}>
              {MAHARASHTRA_DISTRICTS.map(d => (
                <label
                  key={d.id}
                  className={styles.filterLabelDistrict}
                  data-active={selCity === d.id ? 'true' : 'false'}
                  htmlFor={`filter-district-${d.id}`}
                >
                  <input
                    type="radio"
                    id={`filter-district-${d.id}`}
                    name="city"
                    checked={selCity === d.id}
                    onChange={() => setSelCity(prev => prev === d.id ? '' : d.id)}
                    className={styles.filterInputAccent}
                  />
                  <span
                    className={styles.filterTextDistrict}
                    data-active={selCity === d.id ? 'true' : 'false'}
                  >
                    {isMarathi ? d.label_mr : d.label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Government Level filter */}
          <FilterSection title={t('listing.filter_govt_level', 'Government Level')} defaultOpen={false}>
            <div className={styles.filterColGap6}>
              {[
                { id: 'Central', label: '🏛️ Central Govt', desc: 'UPSC, SSC, Railways, Banks' },
                { id: 'State', label: '🏢 State Govt', desc: 'MPSC, Police, ZP, BMC' },
                { id: 'PSU', label: '🏭 PSU / Corp', desc: 'ONGC, BHEL, NTPC, etc.' },
                { id: 'Local', label: '🏘️ Local Bodies', desc: 'Municipal, Panchayat' },
              ].map(gl => (
                <label
                  key={gl.id}
                  className={styles.filterLabelGovt}
                  data-active={selGovtLevel === gl.id ? 'true' : 'false'}
                  htmlFor={`filter-govtlevel-${gl.id}`}
                >
                  <input
                    type="radio"
                    id={`filter-govtlevel-${gl.id}`}
                    name="govt_level"
                    checked={selGovtLevel === gl.id}
                    onChange={() => setSelGovtLevel(prev => prev === gl.id ? '' : gl.id)}
                    className={styles.filterInputGovtAccent}
                  />
                  <div>
                    <div
                      className={styles.filterGovtLabel}
                      data-active={selGovtLevel === gl.id ? 'true' : 'false'}
                    >{gl.label}</div>
                    <div className={styles.filterGovtDesc}>{gl.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Salary filter — only on recruitment/all */}
          {(activeTab === 'all' || activeTab === 'recruitment') && (
            <FilterSection title={t('listing.filter_salary', 'Minimum Salary')} defaultOpen={false}>
              <div className={styles.filterColGap6}>
                {salaryList.map(s => (
                  <label
                    key={s.id}
                    className={styles.filterLabel}
                    data-active={selSalary === s.id ? 'true' : 'false'}
                    htmlFor={`filter-salary-${s.id}`}
                  >
                    <input
                      type="radio"
                      id={`filter-salary-${s.id}`}
                      name="salary"
                      checked={selSalary === s.id}
                      onChange={() => setSelSalary(prev => prev === s.id ? '' : s.id)}
                      className={styles.filterInputOrangeRed}
                    />
                    <span
                      className={styles.filterTextSalary}
                      data-active={selSalary === s.id ? 'true' : 'false'}
                    >
                      {s.label}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Vacancies / Posts filter — only on recruitment/all */}
          {(activeTab === 'all' || activeTab === 'recruitment') && (
            <FilterSection title={t('listing.filter_vacancies', isMarathi ? 'एकूण पदे / जागा' : 'Number of Posts / Vacancies')} defaultOpen={true}>
              <div className={styles.filterColGap6}>
                {VACANCY_RANGES.map(v => (
                  <label
                    key={v.id}
                    className={styles.filterLabel}
                    data-active={selVacancies === v.id ? 'true' : 'false'}
                    htmlFor={`filter-vacancies-${v.id}`}
                  >
                    <input
                      type="radio"
                      id={`filter-vacancies-${v.id}`}
                      name="min_vacancies"
                      checked={selVacancies === v.id}
                      onChange={() => setSelVacancies(prev => prev === v.id ? '' : v.id)}
                      className={styles.filterInputOrange}
                    />
                    <span
                      className={styles.filterTextVacancies}
                      data-active={selVacancies === v.id ? 'true' : 'false'}
                    >
                      {isMarathi && v.label_mr ? v.label_mr : v.label}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Career Compass Promo Card */}
          <div className={styles.careerPromoCard}>
            <div className={styles.careerPromoHeader}>
              <span className={`material-symbols-outlined ${styles.careerPromoIcon}`}>explore</span>
              <strong className={styles.careerPromoTitle}>{isMarathi ? '१० वी व १२ वी करिअर दिशा' : 'Career Compass 2026'}</strong>
            </div>
            <p className={styles.careerPromoText}>
              {isMarathi ? 'सायन्स, कॉमर्स, आर्ट्स आणि पॉलिटेक्निकमधील ४०+ करिअर रोडमॅप, पगार व परीक्षा चक्र.' : 'Science, Commerce & Arts decision roadmaps, salary ladders & entrance exams.'}
            </p>
            <Link
              href="/career"
              className={styles.careerPromoLink}
            >
              <span>{isMarathi ? 'सर्व करिअर पर्याय पहा →' : 'Explore 40+ Careers →'}</span>
            </Link>
          </div>
        </aside>

        {/* ════ MAIN CONTENT ════ */}
        <main id="listing-main-content">

          {/* Error state */}
          {error && (
            <div className={styles.errorBanner}>
              {error}
            </div>
          )}

          {/* Skeleton loading */}
          {loading && items.length === 0 && (
            <div className="grid-jobs">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && items.length === 0 && !error && (
            <div className={styles.emptyState}>
              <span className={`material-symbols-outlined ${styles.emptyIcon}`}>search_off</span>
              <p className={styles.emptyText}>
                {search ? (isMarathi ? `"${search}" साठी कोणतेही निकाल सापडले नाहीत` : `No results for "${search}"`) : (isMarathi ? `कोणत्याही ${tabLabel} सापडल्या नाहीत.` : `No ${tabLabel} found with current filters.`)}
              </p>
              {hasFilters && (
                <button className={`btn-outline ${styles.emptyClearBtn}`} onClick={clearAll}>
                  {isMarathi ? 'फिल्टर्स हटवा' : 'Clear Filters'}
                </button>
              )}
            </div>
          )}

          {/* Cards grid */}
          {items.length > 0 && (
            <div className={`grid-jobs ${styles.cardsGrid}`}>
              {items.map(item => (
                <JobCard key={item.slug || item.id} job={item} />
              ))}
            </div>
          )}
          <LoadMore
            currentCount={items.length}
            totalCount={total}
            onLoadMore={() => setPage(p => p + 1)}
            loading={loading}
            label={isMarathi ? `अधिक ${tabLabel} पहा` : `Load More ${tabLabel}`}
            itemLabel={tabLabel.toLowerCase()}
          />
          {/* On-Demand Closed / Expired Prompt */}
          {statusFilter === 'published' && !loading && items.length > 0 && (
            <div className={styles.closedPromptBanner}>
              <div>
                <div className={styles.closedPromptTitle}>
                  {isMarathi ? '📁 जुन्या किंवा मुदत संपलेल्या जाहिराती शोधत आहात?' : '📁 Looking for previously closed or expired job postings?'}
                </div>
                <div className={styles.closedPromptDesc}>
                  {isMarathi ? 'अभ्यासक्रम, जुन्या जाहिरात क्रमांक व संदर्भासाठी बंद जाहिराती पहा.' : 'View archived government recruitment notices for reference, syllabus, and notification numbers.'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('closed')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`btn-outline ${styles.closedPromptBtn}`}
              >
                {isMarathi ? 'बंद जाहिराती पहा' : 'View Closed Jobs'}
              </button>
            </div>
          )}

          {statusFilter === 'closed' && (
            <div className={styles.viewingClosedBanner}>
              <span className={styles.viewingClosedText}>
                {isMarathi ? 'ℹ️ आपण सध्या मुदत संपलेल्या जाहिराती पहात आहात (On Demand).' : 'ℹ️ Currently viewing closed & past-deadline job advertisements (On Demand).'}
              </span>
              <button
                type="button"
                onClick={() => setStatusFilter('published')}
                className={styles.backToActiveBtn}
              >
                {isMarathi ? '← सुरू जाहिरातींवर परत जा' : '← Back to Active Jobs'}
              </button>
            </div>
          )}

          {/* Load more with progress counter & bar */}


          {loading && items.length > 0 && (
            <div className={styles.spinnerRow}>
              <span className={`spinner ${styles.spinnerInline}`} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function ListingPage(props) {
  const fallbackTitle = props.title || 'Government Jobs & Exam Alerts'
  return (
    <Suspense fallback={
      <div className={`container ${styles.suspenseFallback}`}>
        <h1 className={styles.suspenseFallbackH1}>
          {fallbackTitle}
        </h1>
        {props.subtitle && (
          <p className={styles.suspenseFallbackSubtitle}>
            {props.subtitle}
          </p>
        )}
        <span className={`spinner ${styles.suspenseFallbackSpinner}`} />
      </div>
    }>
      <ListingPageInner {...props} />
    </Suspense>
  )
}
