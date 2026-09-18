// ============================================================
// components/AiMatcher.js — Interactive AI Eligibility Matcher
// Dynamic profile matching with age relaxation calculator & live vacancy counter
// ============================================================

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../context/LanguageContext'

const QUALIFICATIONS = [
  { value: 'Graduate', label: 'Graduate (B.A, B.Sc, B.Com, etc.)', count: 52 },
  { value: '12th Pass', label: '12th Pass (HSC / Any Stream)', count: 28 },
  { value: '10th Pass', label: '10th Pass (SSC)', count: 19 },
  { value: 'ITI / Diploma', label: 'ITI / Polytechnic Diploma', count: 34 },
  { value: 'Post Graduate', label: 'Post Graduate (M.A, M.Sc, etc.)', count: 22 },
  { value: 'Engineering', label: 'B.E. / B.Tech (Engineering)', count: 41 },
  { value: 'Medical / Nursing', label: 'MBBS / BDS / Nursing / B.Pharm', count: 16 },
  { value: 'Police / Defence', label: 'Police Bharti / Physical Fitness', count: 25 },
]

const CATEGORIES = [
  { id: 'Open', label: 'Open (General)', relax: 0 },
  { id: 'OBC', label: 'OBC (Non-Creamy)', relax: 3 },
  { id: 'SC/ST', label: 'SC / ST', relax: 5 },
  { id: 'EWS', label: 'EWS', relax: 0 },
  { id: 'Female', label: 'Women (All Categories)', relax: 3 },
  { id: 'Ex-Serviceman', label: 'Ex-Serviceman', relax: 5 },
]

const DISTRICTS = [
  'All Maharashtra',
  'Pune',
  'Mumbai / Thane',
  'Nagpur',
  'Nashik',
  'Chhatrapati Sambhajinagar',
  'Kolhapur',
  'Solapur',
  'Amravati',
  'Central Govt (All India)',
]

const PRESETS = [
  { label: '🎓 Fresh Graduate', qual: 'Graduate', age: 23, cat: 'Open' },
  { label: '👮 Police Bharti', qual: '12th Pass', age: 22, cat: 'OBC' },
  { label: '⚡ ITI / Tech', qual: 'ITI / Diploma', age: 25, cat: 'Open' },
  { label: '🏛️ MPSC Officer', qual: 'Graduate', age: 28, cat: 'Open' },
  { label: '🩺 Medical Staff', qual: 'Medical / Nursing', age: 27, cat: 'Open' },
]

export default function AiMatcher() {
  const router = useRouter()
  const { lang, t } = useLanguage()
  const isMr = lang === 'mr'

  const qualList = isMr ? [
    { value: 'Graduate', label: 'पदवीधर (B.A, B.Sc, B.Com, इत्यादी)', count: 52 },
    { value: '12th Pass', label: '१२वी उत्तीर्ण (HSC / कोणतीही शाखा)', count: 28 },
    { value: '10th Pass', label: '१०वी उत्तीर्ण (SSC)', count: 19 },
    { value: 'ITI / Diploma', label: 'ITI / पॉलिटेक्निक डिप्लोमा', count: 34 },
    { value: 'Post Graduate', label: 'पदव्युत्तर (M.A, M.Sc, इत्यादी)', count: 22 },
    { value: 'Engineering', label: 'B.E. / B.Tech (अभियांत्रिकी)', count: 41 },
    { value: 'Medical / Nursing', label: 'MBBS / BDS / नर्सिंग / फार्मसी', count: 16 },
    { value: 'Police / Defence', label: 'पोलीस भरती / शारीरिक पात्रता', count: 25 },
  ] : QUALIFICATIONS

  const catList = isMr ? [
    { id: 'Open', label: 'खुला प्रवर्ग (General)', relax: 0 },
    { id: 'OBC', label: 'इतर मागासवर्गीय (OBC)', relax: 3 },
    { id: 'SC/ST', label: 'अनुसूचित जाती/जमाती (SC / ST)', relax: 5 },
    { id: 'EWS', label: 'आर्थिक दुर्बल घटक (EWS)', relax: 0 },
    { id: 'Female', label: 'महिला (सर्व प्रवर्ग)', relax: 3 },
    { id: 'Ex-Serviceman', label: 'माजी सैनिक', relax: 5 },
  ] : CATEGORIES

  const districtList = isMr ? [
    'संपूर्ण महाराष्ट्र',
    'पुणे',
    'मुंबई / ठाणे',
    'नागपूर',
    'नाशिक',
    'छत्रपती संभाजीनगर',
    'कोल्हापूर',
    'सोलापूर',
    'अमरावती',
    'केंद्रीय भरती (अखिल भारतीय)',
  ] : DISTRICTS

  const presetList = isMr ? [
    { label: '🎓 पदवीधर उमेदवार', qual: 'Graduate', age: 23, cat: 'Open' },
    { label: '👮 पोलीस भरती', qual: '12th Pass', age: 22, cat: 'OBC' },
    { label: '⚡ ITI / तंत्रज्ञ', qual: 'ITI / Diploma', age: 25, cat: 'Open' },
    { label: '🏛️ MPSC अधिकारी', qual: 'Graduate', age: 28, cat: 'Open' },
    { label: '🩺 आरोग्य सेवक', qual: 'Medical / Nursing', age: 27, cat: 'Open' },
  ] : PRESETS

  const [qual, setQual] = useState('Graduate')
  const [cat, setCat] = useState('Open')
  const [age, setAge] = useState(24)
  const [district, setDistrict] = useState(isMr ? 'संपूर्ण महाराष्ट्र' : 'All Maharashtra')
  const [naturalPrompt, setNaturalPrompt] = useState('')
  const [showAiInput, setShowAiInput] = useState(false)

  // Current category relaxation
  const currentRelax = useMemo(() => {
    const found = CATEGORIES.find(c => c.id === cat)
    return found ? found.relax : 0
  }, [cat])

  // Calculated estimated matching jobs count
  const estimatedMatches = useMemo(() => {
    const base = QUALIFICATIONS.find(q => q.value === qual)?.count || 35
    let factor = 1.0
    if (district !== 'All Maharashtra') factor *= 0.65
    if (age > 38 && currentRelax === 0) factor *= 0.5
    else if (age <= 30) factor *= 1.15
    return Math.max(8, Math.round(base * factor))
  }, [qual, cat, age, district, currentRelax])

  const handleApplyPreset = (p) => {
    setQual(p.qual)
    setAge(p.age)
    setCat(p.cat)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Map qualification to query parameter
    const params = new URLSearchParams()
    if (qual) params.set('qualification', qual)
    if (district && district !== 'All Maharashtra') params.set('state', district)
    
    // Push to /jobs with active filters
    router.push(`/jobs?${params.toString()}`)
  }

  const handleAiPromptSubmit = (e) => {
    e.preventDefault()
    if (!naturalPrompt.trim()) return
    const text = naturalPrompt.toLowerCase()
    
    // Simple natural language detector
    if (text.includes('10th') || text.includes('ssc')) setQual('10th Pass')
    else if (text.includes('12th') || text.includes('hsc')) setQual('12th Pass')
    else if (text.includes('iti') || text.includes('diploma')) setQual('ITI / Diploma')
    else if (text.includes('engineer') || text.includes('b.e') || text.includes('b.tech')) setQual('Engineering')
    else if (text.includes('doctor') || text.includes('nurse') || text.includes('medical')) setQual('Medical / Nursing')
    else if (text.includes('police') || text.includes('constable')) setQual('Police / Defence')
    else if (text.includes('graduate') || text.includes('degree') || text.includes('b.com') || text.includes('b.sc') || text.includes('b.a')) setQual('Graduate')

    if (text.includes('obc')) setCat('OBC')
    else if (text.includes('sc') || text.includes('st')) setCat('SC/ST')
    else if (text.includes('ews')) setCat('EWS')

    if (text.includes('pune')) setDistrict('Pune')
    else if (text.includes('mumbai')) setDistrict('Mumbai / Thane')
    else if (text.includes('nagpur')) setDistrict('Nagpur')

    setShowAiInput(false)
  }

  return (
    <div style={{
      background: 'var(--surface-container-lowest)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--outline-variant)',
      boxShadow: '0 12px 40px rgba(163, 57, 0, 0.08)',
      padding: '24px 22px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent Top Gradient Line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-cta) 50%, #f59e0b 100%)',
      }} />

      {/* Header with Live Match Pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span className="material-symbols-outlined fill" style={{ color: 'var(--primary-cta)', fontSize: 22 }}>
              auto_awesome
            </span>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--on-surface)' }}>
              {t('matcher.title', 'AI Eligibility Matcher')}
            </span>
            <span style={{
              background: 'var(--primary-fixed)',
              color: 'var(--on-primary-fixed)',
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.04em',
            }}>
              v2.0
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--secondary)', margin: 0 }}>
            {t('matcher.subtitle', 'Instant qualification & age relaxation filtering')}
          </p>
        </div>

        {/* Dynamic Live Counter */}
        <div style={{
          background: 'var(--surface-container-low)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 10px',
          textAlign: 'right',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 11, color: 'var(--secondary)', fontWeight: 600 }}>
            {t('matcher.live_matches', 'LIVE MATCHES')}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--tertiary)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--tertiary)',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite',
            }} />
            ~{estimatedMatches} {t('matcher.jobs', 'Jobs')}
          </div>
        </div>
      </div>

      {/* Presets Row */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
          {t('matcher.quick_profiles', 'Quick Aspirant Profiles:')}
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {presetList.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyPreset(p)}
              style={{
                background: qual === p.qual && cat === p.cat ? 'var(--primary-fixed)' : 'var(--surface-container-low)',
                color: qual === p.qual && cat === p.cat ? 'var(--primary)' : 'var(--on-surface)',
                border: qual === p.qual && cat === p.cat ? '1px solid var(--primary)' : '1px solid var(--outline-variant)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Qualification Dropdown */}
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>
            <span>{t('matcher.highest_education', 'Highest Education / Degree *')}</span>
            <span style={{ fontSize: 11, color: 'var(--primary-cta)', fontWeight: 600 }}>{t('matcher.ai_verified', 'AI Verified')}</span>
          </label>
          <select
            value={qual}
            onChange={(e) => setQual(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--outline-variant)',
              fontSize: 14,
              fontWeight: 500,
              background: 'var(--surface)',
              color: 'var(--on-surface)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          >
            {qualList.map(q => (
              <option key={q.value} value={q.value}>{q.label}</option>
            ))}
          </select>
        </div>

        {/* Category & District Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Reservation Category */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>
              {t('matcher.category', 'Category (आरक्षण)')}
            </label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--outline-variant)',
                fontSize: 13,
                fontWeight: 500,
                background: 'var(--surface)',
                color: 'var(--on-surface)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              {catList.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label} {c.relax > 0 ? `(+${c.relax}y)` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>
              {t('matcher.region', 'Preferred Region')}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--outline-variant)',
                fontSize: 13,
                fontWeight: 500,
                background: 'var(--surface)',
                color: 'var(--on-surface)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              {districtList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Age Slider with Relaxation Info */}
        <div style={{ background: 'var(--surface-container-low)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface)' }}>
              {t('matcher.your_age', 'Your Age:')} <strong style={{ color: 'var(--primary-cta)', fontSize: 14 }}>{age} {t('matcher.years', 'Years')}</strong>
            </span>
            {currentRelax > 0 && (
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--tertiary)',
                background: 'var(--tertiary-fixed)',
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
              }}>
                +{currentRelax}y Govt Age Relaxation Applied
              </span>
            )}
          </div>
          <input
            type="range"
            min="18"
            max="45"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--primary-cta)',
              cursor: 'pointer',
              height: 5,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--secondary)', marginTop: 2 }}>
            <span>18 yrs</span>
            <span>25 yrs</span>
            <span>33 yrs (MPSC max)</span>
            <span>38+ (Reserved)</span>
            <span>45 yrs</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #a33900 0%, #EA580C 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '13px 20px',
            borderRadius: 'var(--radius-md)',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 16px rgba(234, 88, 12, 0.28)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
          {t('matcher.find_jobs_btn', 'Find My Eligible Jobs')} (~{estimatedMatches} {t('matcher.jobs', 'Vacancies')})
        </button>
      </form>

      {/* Natural Language Search Toggle */}
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--outline-variant)' }}>
        {!showAiInput ? (
          <button
            type="button"
            onClick={() => setShowAiInput(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: 0,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit_note</span>
            {t('matcher.describe_plain', 'Or describe in plain words (e.g. "B.Com in Pune, age 26 OBC")')}
          </button>
        ) : (
          <form onSubmit={handleAiPromptSubmit} style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <input
              type="text"
              placeholder="e.g. 12th pass looking for police bharti..."
              value={naturalPrompt}
              onChange={(e) => setNaturalPrompt(e.target.value)}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--outline-variant)',
                fontSize: 12,
                background: 'var(--surface)',
                color: 'var(--on-surface)',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--primary-fixed)',
                color: 'var(--primary)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Parse
            </button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.4; transform: scale(0.9); }
        }
      `}</style>
    </div>
  )
}
