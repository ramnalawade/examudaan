// ============================================================
// app/syllabus/SyllabusHeroSearch.js — Interactive Hero Search
// ExamUdaan.in — Scope pills, quick keyword tags, disciplines
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './syllabus.module.css'

const DISCIPLINES = [
  { key: 'all', label: 'All Disciplines' },
  { key: 'admin', label: 'Administrative / Civil' },
  { key: 'police', label: 'Police & Defense' },
  { key: 'revenue', label: 'Revenue & Forests' },
  { key: 'engineering', label: 'Engineering & Tech' },
  { key: 'banking', label: 'Banking & SSC' },
  { key: 'health', label: 'Health & Family' }
]

export default function SyllabusHeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeScope, setActiveScope] = useState('all')
  const [activeDiscipline, setActiveDiscipline] = useState('all')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/syllabus/mpsc?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleQuickTagClick = (tag) => {
    setQuery(tag)
    const el = document.getElementById('featured-exams')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.heroSearchCard}>
      {/* Search Input Row */}
      <form onSubmit={handleSearchSubmit} className={styles.searchRow}>
        <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by exam name, post, or department (e.g. MPSC Rajyaseva, Talathi, Police Bharti, UPSC, SSC CGL)..."
          className={styles.searchInput}
          aria-label="Search syllabus and exam blueprints"
        />
        <button
          type="button"
          onClick={() => handleQuickTagClick('SSC CGL')}
          className={styles.searchPillRight}
          title="Quick search SSC CGL"
        >
          SSC CGL
        </button>
      </form>

      {/* Scope Filter Pills & Bilingual Notice */}
      <div className={styles.filterScopeRow}>
        <div className={styles.scopePills}>
          <button
            type="button"
            className={`${styles.scopeBtn} ${activeScope === 'all' ? styles.scopeBtnActive : ''}`}
            onClick={() => setActiveScope('all')}
          >
            All Exams (343)
          </button>
          <button
            type="button"
            className={`${styles.scopeBtn} ${activeScope === 'state' ? styles.scopeBtnActive : ''}`}
            onClick={() => setActiveScope('state')}
          >
            Maharashtra State (194)
          </button>
          <button
            type="button"
            className={`${styles.scopeBtn} ${activeScope === 'central' ? styles.scopeBtnActive : ''}`}
            onClick={() => setActiveScope('central')}
          >
            Central Government (154)
          </button>
        </div>

        <div className={styles.bilingualNotice}>
          <span className="material-symbols-outlined">translate</span>
          <span>Bilingual (EN + MR) Available</span>
        </div>
      </div>

      {/* Categories / Disciplines Scroll Row */}
      <div className={styles.categoriesScrollRow}>
        <span className={styles.categoryLabelSmall}>Categories:</span>
        {DISCIPLINES.map((d) => (
          <button
            key={d.key}
            type="button"
            className={`${styles.disciplineChip} ${activeDiscipline === d.key ? styles.disciplineChipActive : ''}`}
            onClick={() => setActiveDiscipline(d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  )
}
