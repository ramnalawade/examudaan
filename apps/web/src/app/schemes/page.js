'use client'
// ============================================================
// app/schemes/page.js — Syllabus and Exam Pattern Listing
// Cards now link to /schemes/[slug] internal detail pages.
// Uses /api/notifications (returns org_acronym + id for slug).
// ============================================================

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSchemes() {
      try {
        // /api/notifications returns org_acronym, org_name, id — needed to build slugs
        const res = await fetch('/api/notifications?type=syllabus&page=1&limit=50')
        if (res.ok) {
          const data = await res.json()
          setSchemes(data.notifications || [])
        } else {
          setSchemes([])
        }
      } catch {
        setSchemes([])
      } finally {
        setLoading(false)
      }
    }
    fetchSchemes()
  }, [])

  return (
    <div className="container">
      <div className="jobs-pageHeader">
        <h1 className="jobs-pageTitle">Syllabus &amp; Exam Pattern</h1>
        <p className="jobs-pageSubtitle">
          Official syllabi, exam patterns, and marking schemes for government recruitment exams.
        </p>
      </div>

      <div className="jobs-layout">
        <main className="jobs-main">
          <div className="jobs-toolbar">
            <span className="jobs-count">
              Showing <strong>{schemes.length}</strong> syllabi
            </span>
          </div>

          <div className="jobs-grid">
            {loading ? (
              <div style={{ padding: '60px 0', textAlign: 'center', gridColumn: '1 / -1' }}>
                Loading...
              </div>
            ) : schemes.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--secondary)' }}>
                No syllabi found
              </div>
            ) : (
              schemes.map(scheme => {
                // Slug pattern: {org_acronym_lower}-{id}  e.g. "upsc-514"
                const slug = scheme.org_acronym && scheme.id
                  ? `${scheme.org_acronym.toLowerCase()}-${scheme.id}`
                  : scheme.slug || String(scheme.id)
                return (
                  <Link
                    key={scheme.id}
                    href={`/schemes/${slug}`}
                    className="schemes-schemeCard"
                    style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
                  >
                    <h3 className="schemes-schemeTitle" style={{ marginBottom: 6 }}>
                      {scheme.title}
                    </h3>
                    <p className="schemes-schemeDept" style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 8 }}>
                      {scheme.org_name || scheme.org_acronym}
                    </p>
                    {scheme.description && (
                      <p className="schemes-schemeDesc" style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.5 }}>
                        {scheme.description.slice(0, 140)}{scheme.description.length > 140 ? '...' : ''}
                      </p>
                    )}
                    <div style={{ marginTop: 10, fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
                      View Syllabus
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
