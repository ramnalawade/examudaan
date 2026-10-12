// ============================================================
// JobCard.js — Individual notification listing card
// ExamUdaan | Badge overlap fix + notification_type colored badge
// ============================================================

import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'
import { formatTitle } from '../lib/formatTitle'
import { trackCtaClick } from '../lib/analytics'
import SaveJobButton from './SaveJobButton'

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

function parseDateParts(dateVal) {
  if (!dateVal) return null
  if (typeof dateVal === 'string') {
    const match = dateVal.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      return {
        year: parseInt(match[1], 10),
        month: parseInt(match[2], 10) - 1,
        day: parseInt(match[3], 10),
      }
    }
  }
  const d = new Date(dateVal)
  if (isNaN(d.getTime())) return null
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() }
}

function getTodayISTParts() {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    const parts = formatter.format(new Date()).split('-').map(Number)
    return { year: parts[0], month: parts[1] - 1, day: parts[2] }
  } catch {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() }
  }
}

function getDaysLeft(dateStr) {
  const target = parseDateParts(dateStr)
  if (!target) return null
  const today = getTodayISTParts()
  const endDay = Date.UTC(target.year, target.month, target.day)
  const nowDay = Date.UTC(today.year, today.month, today.day)
  return Math.round((endDay - nowDay) / (1000 * 60 * 60 * 24))
}

function getDaysSince(dateStr) {
  const target = parseDateParts(dateStr)
  if (!target) return null
  const today = getTodayISTParts()
  const dDay = Date.UTC(target.year, target.month, target.day)
  const nowDay = Date.UTC(today.year, today.month, today.day)
  const diff = Math.floor((nowDay - dDay) / (1000 * 60 * 60 * 24))
  return diff >= 0 ? diff : 0
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
    published_at,
    created_at,
  } = job || {}

  // Walk-in: explicit flag OR contractual with exam_date and no apply dates
  const isWalkIn = is_walk_in === true
    || (employment_type === 'contractual' && exam_date && !apply_start && !apply_end)

  // Effective deadline: for walk-ins use exam_date, else apply_end
  const effectiveDeadline = isWalkIn ? exam_date : apply_end
  const daysLeft = getDaysLeft(effectiveDeadline)

  // Effective posted date: published_at > created_at > apply_start
  const postDate = published_at || created_at || apply_start
  const daysAgo = getDaysSince(postDate)

  // ---- Badge priority: CLOSED > URGENT (CLOSING SOON) > FRESH (NEW TODAY) > WALK-IN ----
  const isClosed = status === 'closed' || (daysLeft !== null && daysLeft < 0)
  const isUrgent = !isClosed && daysLeft !== null && daysLeft >= 0 && daysLeft <= 3
  const isFresh = !isClosed && !isUrgent && daysAgo !== null && daysAgo <= 3

  let urgencyLabel = null
  let urgencyClass = ''

  if (isClosed) {
    urgencyLabel = isMr ? 'अर्ज बंद' : 'CLOSED'
    urgencyClass = 'urgency-badge-closed'
  } else if (isUrgent) {
    if (daysLeft === 0) {
      urgencyLabel = isMr ? 'आज शेवटचा दिवस' : 'CLOSING TODAY'
      urgencyClass = 'urgency-badge-urgent-0'
    } else if (daysLeft === 1) {
      urgencyLabel = isMr ? 'उद्या शेवटचा दिवस' : 'ENDS TOMORROW'
      urgencyClass = 'urgency-badge-urgent'
    } else if (daysLeft > 1) {
      urgencyLabel = isMr ? `${daysLeft} दिवस शिल्लक` : `${daysLeft} DAYS LEFT`
      urgencyClass = 'urgency-badge-urgent'
    }
  } else if (isFresh) {
    if (daysAgo === 0) {
      urgencyLabel = isMr ? 'नवीन (आज)' : 'NEW TODAY'
      urgencyClass = 'urgency-badge-fresh-today'
    } else {
      urgencyLabel = isMr ? 'नवीन' : 'NEW'
      urgencyClass = 'urgency-badge-fresh'
    }
  } else if (isWalkIn) {
    urgencyLabel = isMr ? 'थेट मुलाखत' : 'WALK-IN'
    urgencyClass = 'urgency-badge-walkin'
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

  const displayTitle = formatTitle((isMr && title_mr) ? title_mr : title)
  const secondaryTitle = (isMr && title_mr && title_mr !== title) ? formatTitle(title) : (!isMr && title_mr) ? formatTitle(title_mr) : null
  const displayOrg = formatTitle(isMr && (job?.org_name_mr || job?.name_mr) ? (job.org_name_mr || job.name_mr) : (department || organization))

  const formatDate = (d) => {
    if (!d) return 'TBA'
    const date = new Date(d)
    return date.toLocaleDateString(isMr ? 'mr-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatPostedDate = () => {
    if (daysAgo === null || !postDate) return null
    if (daysAgo === 0) return isMr ? 'आज प्रसिद्ध (Live Today)' : 'Posted Today'
    if (daysAgo === 1) return isMr ? 'काल प्रसिद्ध (Yesterday)' : 'Posted Yesterday'
    if (daysAgo <= 7) return isMr ? `${daysAgo} दिवसांपूर्वी प्रसिद्ध` : `Posted ${daysAgo} days ago`
    return isMr ? `प्रसिद्ध: ${formatDate(postDate)}` : `Posted: ${formatDate(postDate)}`
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
      onClick={() => trackCtaClick(`View Job Card: ${title}`, detailUrl, 'job_card')}
    >
      {/* Card Header: Icon + Title + Dept */}
      <div className="job-card-header">
        <div className="job-card-icon">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="job-card-content">
          {/* Metadata Row: Badges (Type + Urgency) on left, Bookmark Save Button on right */}
          <div className="job-card-meta-row">
            <div className="job-card-badges">
              <span className={`job-card-type-badge badge-type-${notification_type || 'other'}`}>
                {badgeText}
              </span>
              {urgencyLabel && (
                <span className={`job-card-urgency-badge ${urgencyClass}`}>
                  {urgencyLabel}
                </span>
              )}
            </div>
            {id && (
              <div
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="job-card-save-wrap"
              >
                <SaveJobButton
                  notificationId={id}
                  variant="icon"
                  size="sm"
                  title={displayTitle}
                />
              </div>
            )}
          </div>
          <h3 className="job-card-title">{displayTitle}</h3>
          {secondaryTitle && (
            <p className={`job-card-secondary-title ${isMr ? 'mr-secondary' : 'en-secondary'}`}>
              {secondaryTitle}
            </p>
          )}
          <p className="job-card-dept">
            {displayOrg}
          </p>
        </div>
      </div>

      {/* Meta Details */}
      <div className="job-card-details">
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
        {formatPostedDate() && (
          <div className={`job-card-meta job-card-meta-posted${daysAgo === 0 ? ' posted-today' : ''}`}>
            <span className="material-symbols-outlined">schedule</span>
            <span>{formatPostedDate()}</span>
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
          <div className={`deadline-value${isClosed ? ' closed' : isUrgent ? '' : ' safe'}`}>
            {isClosed
              ? (isMr ? 'मुदत संपली' : 'Closed')
              : effectiveDeadline
                ? formatDate(effectiveDeadline)
                : 'TBA'}
          </div>
        </div>
        <button
          className="btn-outline job-card-cta"
          tabIndex={-1}
          aria-hidden="true"
        >
          {isMr ? 'तपशील पहा' : 'View Details'}
        </button>
      </div>
    </Link>
  )
}
