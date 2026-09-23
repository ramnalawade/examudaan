// ============================================================
// app/salary-calculator/page.js — Govt Job Salary Calculator
// ExamUdaan.in — Shows in-hand salary breakdown for govt posts
// Pure client component — no DB, no API needed.
// ============================================================
'use client'
import { useState } from 'react'
import styles from './salary.module.css'

// ── Salary Data ──────────────────────────────────────────────
// DA Rate as of 2026: 53% (revised quarterly)
const DA_RATE = 0.53

// HRA rates by city class
const HRA = { X: 0.27, Y: 0.18, Z: 0.09 }

// Maharashtra major cities by class
const CITY_CLASSES = {
  X: ['Mumbai', 'Pune'],
  Y: ['Nagpur', 'Nashik', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Kolhapur', 'Solapur', 'Amravati'],
  Z: ['Other Maharashtra Cities', 'Rural Areas'],
}

const POSTS = [
  // MPSC / Maharashtra State
  { id: 'ias-mah', label: 'IAS Officer (Maharashtra Cadre)', body: 'IAS / UPSC', level: 10, basic: 56100, nps: 0.10, cghs: 350, note: 'Increases with promotions. Senior IAS earns ₹2.5L+' },
  { id: 'ips-mah', label: 'IPS Officer (Maharashtra Cadre)', body: 'IPS / UPSC', level: 10, basic: 56100, nps: 0.10, cghs: 350, note: 'Starting pay at ASP level' },
  { id: 'dy-collector', label: 'Deputy Collector (MPSC)', body: 'MPSC State Services', level: 10, basic: 56100, nps: 0.10, cghs: 0, note: 'Grade Pay ₹5400 equivalent (Level S-20)' },
  { id: 'tehsildar-mpsc', label: 'Tehsildar (MPSC Class-1)', body: 'MPSC State Services', level: 9, basic: 53100, nps: 0.10, cghs: 0, note: 'Executive Magistrate (Level S-19)' },
  { id: 'dsp-mpsc', label: 'DSP — Deputy Superintendent of Police (MPSC)', body: 'MPSC State Services', level: 10, basic: 56100, nps: 0.10, cghs: 0, note: 'State Police Service (Level S-20)' },
  { id: 'sti-mpsc', label: 'State Tax Inspector — STI (MPSC)', body: 'MPSC Combined', level: 7, basic: 38600, nps: 0.10, cghs: 0, note: 'Level S-14 / GST Administration' },
  { id: 'aso-mpsc', label: 'Assistant Section Officer — ASO (MPSC)', body: 'MPSC Combined', level: 7, basic: 38600, nps: 0.10, cghs: 0, note: 'Mantralaya Secretariat Cadre (Level S-14)' },
  { id: 'psi-maharashtra', label: 'Police Sub Inspector — PSI (Maharashtra)', body: 'MPSC / Police Bharti', level: 7, basic: 38600, nps: 0.10, cghs: 0, note: 'Level S-14 / Executive Police Cadre' },
  { id: 'talathi-mah', label: 'Talathi (Revenue Department)', body: 'Maharashtra Mahabhumi', level: 4, basic: 25500, nps: 0.10, cghs: 0, note: 'Level S-8 (₹25,500 - ₹81,100) / Revenue Village Officer' },
  { id: 'gram-sevak', label: 'Gram Sevak / Gramvikas Adhikari (ZP)', body: 'Rural Development Dept', level: 3, basic: 21700, nps: 0.10, cghs: 0, note: 'Level S-6 / Panchayat Administration' },
  { id: 'arogya-sevak', label: 'Arogya Sevak (Health Department / ZP)', body: 'Public Health Dept', level: 4, basic: 25500, nps: 0.10, cghs: 0, note: 'Level S-8 / Primary Health Centre' },
  { id: 'forest-guard', label: 'Vanrakshak / Forest Guard (Mahaforest)', body: 'Maharashtra Forest Dept', level: 3, basic: 21700, nps: 0.10, cghs: 0, note: 'Level S-6 (₹21,700 - ₹69,100)' },
  { id: 'police-constable', label: 'Police Constable / Driver (Maharashtra)', body: 'Maharashtra Police Bharti', level: 3, basic: 21700, nps: 0.10, cghs: 0, note: 'Level S-6 (₹21,700 - ₹69,100) + Special allowances' },

  // Central / Banking / Railways
  { id: 'rbi-grade-b', label: 'RBI Grade B Officer', body: 'Reserve Bank of India', level: 0, basic: 55200, nps: 0.10, cghs: 350, note: 'Basic + Special Allowances. Actual Gross ≈ ₹1.16L/month' },
  { id: 'ibps-po', label: 'IBPS PO — Probationary Officer', body: 'IBPS / PSU Banks', level: 0, basic: 48480, nps: 0.10, cghs: 350, note: 'Scale-I Officer across Public Sector Banks' },
  { id: 'ibps-clerk', label: 'IBPS Clerk / Customer Associate', body: 'IBPS / PSU Banks', level: 0, basic: 19900, nps: 0.10, cghs: 350, note: 'Clerical cadre + location allowances' },
  { id: 'ssc-cgl-inspector', label: 'Income Tax Inspector (SSC CGL)', body: 'SSC / CBDT', level: 7, basic: 44900, nps: 0.10, cghs: 350, note: '7th CPC Level 7 (Grade Pay ₹4600)' },
  { id: 'ssc-cgl-aso', label: 'Assistant Section Officer — MEA (SSC CGL)', body: 'SSC / Central Govt', level: 7, basic: 44900, nps: 0.10, cghs: 350, note: 'Ministry of External Affairs' },
  { id: 'rrb-station-master', label: 'Station Master (RRB NTPC)', body: 'Indian Railways (RRB)', level: 6, basic: 35400, nps: 0.10, cghs: 350, note: 'Level 6 + Running/Night Duty Allowances' },
  { id: 'rrb-group-d', label: 'Track Maintainer / Pointsman (RRB Group D)', body: 'Indian Railways (RRC)', level: 1, basic: 18000, nps: 0.10, cghs: 350, note: 'Level 1 + Risk & Hardship Allowances' },
]

// Travel Allowance (approximate, by city class)
const TA_BY_CLASS = { X: 3600, Y: 1800, Z: 1350 }

// ── Component ────────────────────────────────────────────────
export default function SalaryCalculatorPage() {
  const [selectedPost, setSelectedPost] = useState(POSTS[0])
  const [cityClass, setCityClass] = useState('Y')
  const [city, setCity] = useState('Nagpur')

  // Calculate salary breakdown
  const basic = selectedPost.basic
  const da = Math.round(basic * DA_RATE)
  const hraRate = HRA[cityClass]
  const hra = Math.round(basic * hraRate)
  const ta = TA_BY_CLASS[cityClass]
  const gross = basic + da + hra + ta + (selectedPost.cghs || 0)
  const npsDeduction = Math.round(basic * (selectedPost.nps || 0.10))
  const taxDeduction = 0 // simplified — most aspirants want CTC
  const netInHand = gross - npsDeduction - taxDeduction

  // Handle city class change — reset city to first in class
  const handleCityClassChange = (cls) => {
    setCityClass(cls)
    setCity(CITY_CLASSES[cls][0])
  }

  return (
    <main className={styles.calculatorPage}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroLabel}>💰 Free Tool</span>
            <h1>Government Job Salary Calculator 2026</h1>
            <p>Check exact in-hand salary for MPSC, IBPS, SSC, and RBI posts — with DA, HRA, and NPS deductions. Updated for 7th Pay Commission.</p>
          </div>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section className={styles.calculatorSection}>
        <div className="container">
          <div className={styles.calculatorLayout}>

            {/* ── Left: Inputs ── */}
            <div className={styles.inputs}>
              <h2 className={styles.inputTitle}>Select Your Post & City</h2>

              {/* Post Selector */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <span className="material-symbols-outlined">work</span>
                  Government Post / Exam
                </label>
                <select
                  className={styles.select}
                  value={selectedPost.id}
                  onChange={e => setSelectedPost(POSTS.find(p => p.id === e.target.value))}
                >
                  {POSTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.body})
                    </option>
                  ))}
                </select>
              </div>

              {/* City Class */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <span className="material-symbols-outlined">location_city</span>
                  City Type (for HRA calculation)
                </label>
                <div className={styles.cityClassButtons}>
                  {['X', 'Y', 'Z'].map(cls => (
                    <button
                      key={cls}
                      className={`${styles.cityBtn} ${cityClass === cls ? styles.cityBtnActive : ''}`}
                      onClick={() => handleCityClassChange(cls)}
                    >
                      <span>Class {cls}</span>
                      <small>{cls === 'X' ? 'Metro (HRA 27%)' : cls === 'Y' ? 'City (HRA 18%)' : 'Town (HRA 9%)'}</small>
                    </button>
                  ))}
                </div>
              </div>

              {/* City Name */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <span className="material-symbols-outlined">place</span>
                  City in Maharashtra
                </label>
                <select
                  className={styles.select}
                  value={city}
                  onChange={e => setCity(e.target.value)}
                >
                  {CITY_CLASSES[cityClass].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Key Info */}
              <div className={styles.infoBox}>
                <p><strong>Pay Level:</strong> {selectedPost.level > 0 ? `Level ${selectedPost.level} (7th CPC)` : 'Industry Linked (Bank Pay Scale)'}</p>
                <p><strong>NPS Deduction:</strong> {(selectedPost.nps * 100).toFixed(0)}% of Basic (employee share)</p>
                <p><strong>DA Rate:</strong> {DA_RATE * 100}% (as of Jan 2026)</p>
                {selectedPost.note && <p>ℹ️ {selectedPost.note}</p>}
              </div>
            </div>

            {/* ── Right: Breakdown ── */}
            <div className={styles.breakdown}>
              <div className={styles.breakdownCard}>
                <div className={styles.breakdownHeader}>
                  <h2>{selectedPost.label}</h2>
                  <p>{city} • {selectedPost.body}</p>
                </div>

                {/* Earnings */}
                <div className={styles.breakdownSection}>
                  <h3 className={styles.breakdownLabel}>✅ Earnings</h3>
                  <div className={styles.breakdownRows}>
                    <BreakdownRow label="Basic Pay" value={basic} />
                    <BreakdownRow label={`Dearness Allowance (DA @ ${DA_RATE * 100}%)`} value={da} />
                    <BreakdownRow label={`House Rent Allowance (HRA @ ${hraRate * 100}% — Class ${cityClass})`} value={hra} />
                    <BreakdownRow label="Transport Allowance (TA)" value={ta} />
                    {selectedPost.cghs > 0 && (
                      <BreakdownRow label="CGHS (Medical)" value={selectedPost.cghs} />
                    )}
                  </div>
                  <div className={styles.grossTotal}>
                    <span>Gross Salary</span>
                    <span>₹{gross.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className={styles.breakdownSection}>
                  <h3 className={styles.breakdownLabel}>❌ Deductions</h3>
                  <div className={styles.breakdownRows}>
                    <BreakdownRow label="NPS Contribution (Employee)" value={npsDeduction} negative />
                    <BreakdownRow label="Professional Tax (approx.)" value={200} negative />
                  </div>
                </div>

                {/* Net In-Hand */}
                <div className={styles.netSalary}>
                  <div className={styles.netLabel}>Estimated Net In-Hand</div>
                  <div className={styles.netAmount}>₹{(netInHand - 200).toLocaleString('en-IN')}</div>
                  <div className={styles.netNote}>per month (approx.)</div>
                  <div className={styles.annualCTC}>Annual CTC ≈ ₹{Math.round(gross * 12 / 100000).toFixed(1)}L/year</div>
                </div>

                <p className={styles.disclaimer}>
                  * This is an estimate. Actual salary varies by department, seniority, special pay components, and government orders. Income Tax not deducted above (depends on regime and investments).
                </p>
              </div>

              {/* Compare CTA */}
              <div className={styles.compareCta}>
                <strong>📊 Compare Salaries</strong>
                <p>Check which exam gives you the best salary for your city and qualification.</p>
                <a href="/jobs" className="btn-outline">Browse Current Job Notifications →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pay Commission Note ── */}
      <section className={styles.noteSection}>
        <div className="container">
          <div className={styles.noteGrid}>
            <div className={styles.noteCard}>
              <span className="material-symbols-outlined">update</span>
              <h3>7th Pay Commission</h3>
              <p>All Central Govt salaries are based on the 7th Central Pay Commission (effective Jan 2016). DA is revised quarterly based on CPI (Consumer Price Index).</p>
            </div>
            <div className={styles.noteCard}>
              <span className="material-symbols-outlined">savings</span>
              <h3>NPS vs Old Pension</h3>
              <p>Employees joining after 2004 are under NPS (National Pension System). Employee contributes 10% of Basic+DA, government contributes 14%. At retirement, 60% lump sum is taxable.</p>
            </div>
            <div className={styles.noteCard}>
              <span className="material-symbols-outlined">trending_up</span>
              <h3>Salary Grows With Experience</h3>
              <p>Government salaries increase every year with Annual Increment (3% of Basic Pay). Promotions bring Pay Level upgrades. After 30 years, starting ₹35,400 grows to ₹1,00,000+.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// ── Row Component ─────────────────────────────────────────────
function BreakdownRow({ label, value, negative }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={`${styles.rowValue} ${negative ? styles.negative : ''}`}>
        {negative ? '-' : '+'}₹{value.toLocaleString('en-IN')}
      </span>
    </div>
  )
}
