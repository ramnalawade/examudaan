'use client'
// ============================================================
// components/FilterChips.js — Horizontal filter tab row
// ExamUdaan | V4 Clean — no emoji prefixes
// Active chip: solid orange. Inactive: ghost pill.
// ============================================================


const FILTERS = [
  { id: 'all',        label: 'All' },
  { id: 'job',        label: 'Jobs' },
  { id: 'result',     label: 'Results' },
  { id: 'admit-card', label: 'Admit Cards' },
  { id: 'ssc',        label: 'SSC' },
  { id: 'upsc',       label: 'UPSC' },
  { id: 'rrb',        label: 'Railway' },
  { id: 'ibps',       label: 'Banking' },
  { id: 'nta',        label: 'NTA' },
  { id: 'state',      label: 'State PSC' },
]

/**
 * FilterChips component
 * @param {string}   active    — currently active filter id
 * @param {Function} onChange  — callback(filterId)
 * @param {Object}   counts   — { job: 120, result: 45, ... } optional counts
 */
export default function FilterChips({ active = 'all', onChange, counts = {} }) {
  return (
    <div className="filter-wrapper" role="group" aria-label="Filter exams">
      {FILTERS.map(({ id, label }) => {
        const isActive = active === id
        const count = counts[id]

        return (
          <button
            key={id}
            id={`filter-${id}`}
            className={`filter-chip ${isActive ? 'filter-active' : ''}`}
            onClick={() => onChange?.(id)}
            aria-pressed={isActive}
            aria-label={`Filter by ${label}${count ? `, ${count} items` : ''}`}
          >
            {label}
            {count != null && (
              <span className="filter-count">{count > 999 ? '999+' : count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
