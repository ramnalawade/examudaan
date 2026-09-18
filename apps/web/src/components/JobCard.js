// ============================================================
// JobCard.js — Individual notification listing card
// ExamUdaan | Badge overlap fix + notification_type colored badge
// ============================================================

import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'

const ICON_MAP = {
  police:   'local_police',
  bmc:      'location_city',
  mpsc:     'account_balance',
  ssc:      'description',
  railway:  'train',
  banking:  'account_balance_wallet',
  health:   'medical_services',
  education:'school',
  nta:      'school',
  upsc:     'account_balance',
  rrb:      'train',
  ibps:     'account_balance_wallet',
  sbi:      'account_balance_wallet',
  default:  'work',
}

// ---- Notification type → colored badge config ----
const TYPE_BADGE = {
  recruitment: { label: 'Recruitment', color: '#EA580C', bg: '#FFF7ED' },
  result:      { label: 'Result',      color: '#16A34A', bg: '#F0FDF4' },
  answer_key:  { label: 'Answer Key',  color: '#2563EB', bg: '#EFF6FF' },
  admit_card:  { label: 'Admit Card',  color: '#7C3AED', bg: '#F5F3FF' },
  syllabus:    { label: 'Syllabus',    color: '#0891B2', bg: '#ECFEFF' },
  correction:  { label: 'Correction',  color: '#D97706', bg: '#FFFBEB' },
  other:       { label: 'Notice',      color: '#6B7280', bg: '#F3F4F6' },
}

function getDaysLeft(dateStr) {
  if (!dateStr) return null
  const end = new Date(dateStr)
  const now = new Date()
  // Compare dates at start of day to avoid timezone drift near midnight
  const endDay = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  const nowDay = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.ceil((endDay - nowDay) / (1000 * 60 * 60 * 24))
}

export default function JobCard({ job }) {
  const { lang } = useLanguage()
  const isMr = lang === 'mr'

  const {
    id,
    title = 'Government Job Notification',
    title_mr,
    summary_mr,
    department = '',
    organization = 'Government of India',
    slug = '',
    vacancies,
    apply_end,
    apply_start,
    exam_date,        // walk-in / interview date
    is_walk_in,       // explicit walk-in flag
    employment_type,  // 'contractual' = likely walk-in when no dates
    location = '',
    qualification = '',
    salary = '',
    salary_min,
    salary_max,
    category = 'default',
    notification_type = 'recruitment',
    status = 'published',
  } = job || {}

  // Walk-in: explicit flag OR contractual with exam_date and no apply dates
  const isWalkIn = is_walk_in === true
    || (employment_type === 'contractual' && exam_date && !apply_start && !apply_end)

  // Effective deadline: for walk-ins use exam_date, else apply_end
  const effectiveDeadline = isWalkIn ? exam_date : apply_end
  const daysLeft = getDaysLeft(effectiveDeadline)

  // ---- Badge priority: CLOSED > URGENT > LAST N DAYS (no overlap) ----
  // A card is CLOSED when status is 'closed' OR deadline passed
  const isClosed = status === 'closed' || (daysLeft !== null && daysLeft < 0)

  // Only show urgency when NOT closed
  const isUrgent = !isClosed && daysLeft !== null && daysLeft <= 3

  // Badge label (single badge — never both)
  let urgencyLabel = null
  if (isClosed) {
    urgencyLabel = isMr ? 'अर्ज बंद' : 'CLOSED'
  } else if (isUrgent) {
    urgencyLabel = daysLeft === 0
      ? (isMr ? 'आज शेवटचा दिवस' : 'TODAY')
      : daysLeft === 1
        ? (isMr ? 'शेवटचा दिवस' : 'LAST DAY')
        : (isMr ? `${daysLeft} दिवस शिल्लक` : `LAST ${daysLeft} DAYS`)
  } else if (isWalkIn) {
    urgencyLabel = isMr ? 'थेट मुलाखत' : 'WALK-IN'
  }

  const MR_TYPE_LABEL = {
    recruitment: 'भरती',
    result:      'निकाल',
    answer_key:  'उत्तरतालिका',
    admit_card:  'प्रवेशपत्र',
    syllabus:    'अभ्यासक्रम',
    correction:  'दुरुस्ती',
    other:       'सूचना',
  }

  const icon = ICON_MAP[category?.toLowerCase()] || ICON_MAP.default
  const typeBadge = TYPE_BADGE[notification_type] || TYPE_BADGE.other
  const badgeText = isMr ? (MR_TYPE_LABEL[notification_type] || typeBadge.label) : typeBadge.label

  const displayTitle = (isMr && title_mr) ? title_mr : title
  const secondaryTitle = (isMr && title_mr && title_mr !== title) ? title : (!isMr && title_mr) ? title_mr : null
  const displayOrg = isMr && (job?.org_name_mr || job?.name_mr) ? (job.org_name_mr || job.name_mr) : (department || organization)

  const formatDate = (d) => {
    if (!d) return 'TBA'
    const date = new Date(d)
    return date.toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatSalary = () => {
    if (salary) return salary
    if (salary_min && salary_max) return `₹${(salary_min/1000).toFixed(0)}k – ₹${(salary_max/1000).toFixed(0)}k`
    if (salary_min) return `₹${(salary_min/1000).toFixed(0)}k+`
    return null
  }

  // Route to type-specific detail page
  const TYPE_ROUTE = {
    result:      'results',
    admit_card:  'admit-cards',
    answer_key:  'answer-keys',
    syllabus:    'schemes',
    recruitment: 'jobs',
  }
  const section = TYPE_ROUTE[notification_type] || 'jobs'

  // DB Slugs pattern: ssc-514, or fallback to org-id or id
  const detailUrl = slug ? `/${section}/${slug}` : id ? `/${section}/${id}` : `/${section}`

  return (
    <Link
      href={detailUrl}
      className="job-card group"
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}
    >
      {/* ---- Single Priority Badge (CLOSED > URGENT > LAST N DAYS) ---- */}
      {urgencyLabel && (
        <div
          className="urgency-badge"
          style={isClosed ? {
            background: 'var(--surface-container-high)',
            color: 'var(--secondary)',
          } : undefined}
        >
          {urgencyLabel}
        </div>
      )}

      {/* Card Header: Icon + Title + Dept */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div className="job-card-icon">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Notification type colored badge */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.03em',
            background: typeBadge.bg,
            color: typeBadge.color,
            marginBottom: '6px',
            textTransform: 'uppercase',
          }}>
            {badgeText}
          </span>
          <h3 className="job-card-title">{displayTitle}</h3>
          {secondaryTitle && (
            <p style={{ fontSize: 13, color: isMr ? 'var(--secondary)' : 'var(--primary)', fontWeight: isMr ? 400 : 600, marginTop: '2px', lineHeight: 1.3 }}>
              {secondaryTitle}
            </p>
          )}
          <p className="job-card-dept">
            {displayOrg}
          </p>
        </div>
      </div>

      {/* Meta Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {location && (
          <div className="job-card-meta">
            <span className="material-symbols-outlined">location_on</span>
            <span>{location}</span>
          </div>
        )}
        {qualification && (
          <div className="job-card-meta">
            <span className="material-symbols-outlined">school</span>
            <span>{qualification}</span>
          </div>
        )}
        {vacancies && (
          <div className="job-card-meta">
            <span className="material-symbols-outlined">group</span>
            <span>{isMr ? (typeof vacancies === 'number' ? `${vacancies.toLocaleString('mr-IN')} पदे` : 'विविध पदे') : (typeof vacancies === 'number' ? `${vacancies.toLocaleString('en-IN')} Posts` : vacancies)}</span>
          </div>
        )}
        {formatSalary() && (
          <div className="job-card-meta">
            <span className="material-symbols-outlined">payments</span>
            <span>{formatSalary()}</span>
          </div>
        )}
      </div>

      {/* Footer: Deadline + CTA */}
      <div className="job-card-footer">
        <div>
          <div className="deadline-label">
            {isWalkIn ? (isMr ? 'मुलाखतीची तारीख' : 'Walk-in Date') :
             notification_type === 'result'     ? (isMr ? 'निकाल जाहीर' : 'Declared') :
             notification_type === 'admit_card'  ? (isMr ? 'प्रवेशपत्र उपलब्ध' : 'Available') :
             notification_type === 'answer_key'  ? (isMr ? 'उत्तरतालिका प्रसिद्ध' : 'Released') :
             (isMr ? 'अंतिम दिनांक' : 'Deadline')}
          </div>
          <div className={`deadline-value${isUrgent ? '' : ' safe'}`}
               style={isClosed ? { color: 'var(--secondary)' } : undefined}>
            {isClosed
              ? (isMr ? 'मुदत संपली' : 'Closed')
              : effectiveDeadline
                ? formatDate(effectiveDeadline)
                : 'TBA'}
          </div>
        </div>
        <button
          className="btn-outline"
          style={{ fontSize: 13, padding: '6px 14px' }}
          tabIndex={-1}
          aria-hidden="true"
        >
          {isMr ? 'तपशील पहा' : 'View Details'}
        </button>
      </div>
    </Link>
  )
}
