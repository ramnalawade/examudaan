// ============================================================
// components/MpscDistributionChart.js — Visual Paper Distribution Pie/Donut Chart
// ExamUdaan | Visual breakdown of 1,284 Question Papers across Rajyaseva, Group B, Group C & Other Services
// ZERO INLINE STYLES POLICY: Pure SVG attributes & CSS Modules
// ============================================================

import React from 'react'
import Link from 'next/link'
import styles from './MpscDistributionChart.module.css'
import {
  MPSC_CADRE_COUNTS,
  MPSC_TOTAL_QUESTION_PAPERS,
  MPSC_ARCHIVE_YEARS_SPAN,
  MPSC_ARCHIVE_YEARS_COUNT
} from '@/lib/platformStats'

export default function MpscDistributionChart({ currentCadre = null }) {
  const cadres = [
    MPSC_CADRE_COUNTS.otherServices,
    MPSC_CADRE_COUNTS.rajyaseva,
    MPSC_CADRE_COUNTS.groupB,
    MPSC_CADRE_COUNTS.groupC
  ]

  const total = MPSC_TOTAL_QUESTION_PAPERS // 1284
  const radius = 40
  const circumference = 2 * Math.PI * radius // ~251.327

  // Calculate SVG strokeDasharray and strokeDashoffset cumulatively
  let accumulatedOffset = 0
  const segments = cadres.map(c => {
    const strokeLength = (c.count / total) * circumference
    const offset = -accumulatedOffset
    accumulatedOffset += strokeLength
    return {
      ...c,
      strokeLength,
      offset
    }
  })

  return (
    <section className={styles.chartContainer} aria-label="MPSC Question Papers Distribution by Cadre">
      <div className={styles.chartHeader}>
        <div className={styles.chartTitleWrap}>
          <h2 className={styles.chartTitle}>
            <span>📊</span> MPSC Question Paper Distribution (2009–2026)
          </h2>
          <p className={styles.chartSubtitle}>
            Complete catalog of {total.toLocaleString('en-IN')} official question papers across {MPSC_ARCHIVE_YEARS_COUNT} calendar years
          </p>
        </div>
        <div className={styles.chartBadge}>
          {MPSC_ARCHIVE_YEARS_SPAN} • 100% Official
        </div>
      </div>

      <div className={styles.chartLayout}>
        {/* Donut SVG */}
        <div className={styles.svgWrapper}>
          <svg
            viewBox="0 0 100 100"
            className={styles.svgDonut}
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              className={styles.svgCircleBg}
            />
            {segments.map(seg => (
              <circle
                key={seg.key}
                cx="50"
                cy="50"
                r={radius}
                className={styles.svgSegment}
                stroke={seg.color}
                strokeDasharray={`${seg.strokeLength} ${circumference - seg.strokeLength}`}
                strokeDashoffset={seg.offset}
              >
                <title>{`${seg.name}: ${seg.count} papers (${seg.percent}%)`}</title>
              </circle>
            ))}
          </svg>

          <div className={styles.donutCenterText}>
            <span className={styles.centerTotal}>{total.toLocaleString('en-IN')}</span>
            <span className={styles.centerLabel}>Question Papers</span>
            <span className={styles.centerSpan}>{MPSC_ARCHIVE_YEARS_SPAN}</span>
          </div>
        </div>

        {/* Legend Cards */}
        <div className={styles.legendGrid}>
          {cadres.map(c => {
            const isActive = currentCadre && (currentCadre === c.key || currentCadre === c.slug)
            return (
              <Link
                key={c.key}
                href={`/mpsc/${c.slug}`}
                className={`${styles.legendCard} ${isActive ? styles.legendCardActive : ''}`}
                title={`Browse ${c.name} Previous Year Papers`}
              >
                <div className={styles.legendCardTop}>
                  <div className={styles.legendDotWrap}>
                    <span
                      className={`${styles.legendDot} ${
                        c.key === 'rajyaseva'
                          ? styles.dotRajyaseva
                          : c.key === 'group-b'
                          ? styles.dotGroupB
                          : c.key === 'group-c'
                          ? styles.dotGroupC
                          : styles.dotOtherServices
                      }`}
                    />
                    <span className={styles.legendName}>{c.name}</span>
                  </div>
                  <span className={styles.legendPercent}>{c.percent}%</span>
                </div>

                <div className={styles.legendStats}>
                  <span className={styles.legendCount}>{c.count}</span>
                  <span className={styles.legendUnits}>Available Papers ({c.keys} Answer Keys)</span>
                </div>

                <div className={styles.legendSub}>
                  <span>{c.nameMr}</span>
                  <span className={styles.legendLinkText}>Browse →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
