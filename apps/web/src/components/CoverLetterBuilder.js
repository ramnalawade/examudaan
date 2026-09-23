// ============================================================
// components/CoverLetterBuilder.js — Professional Cover Letter Generator
// Features:
// - Form-based input (role, org, qualifications, date)
// - 3 professional templates (Formal, Modern, Government)
// - Live preview panel
// - Print/Download as PDF (popup window approach — same as ResumeBuilder)
// - Copy plain text for email paste
// - Save/load for logged-in users via /api/resume endpoint (reuses same table)
// ============================================================

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

// ── Cover Letter Templates ──────────────────────────────────
const CL_TEMPLATES = [
  {
    id: 'formal',
    name: 'Formal Professional',
    badge: '🏛️ Government / PSU',
    desc: 'Traditional block format with full address headers. Best for government, PSU, and banking applications.',
  },
  {
    id: 'modern',
    name: 'Modern Executive',
    badge: '💼 Corporate / Tech',
    desc: 'Clean modern layout with accent header. Best for private sector, tech, and startups.',
  },
  {
    id: 'concise',
    name: 'Concise Impact',
    badge: '⚡ Quick Apply',
    desc: 'Short punchy format (3 paragraphs). Best for online applications with limited space.',
  },
]

// ── Default cover letter data ────────────────────────────────
const DEFAULT_DATA = {
  // Sender info
  name: 'Aditya Deshmukh',
  phone: '+91 98230 12345',
  email: 'aditya.dev@example.com',
  address: 'Pune, Maharashtra',
  date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),

  // Recipient info
  hiringManager: 'The Hiring Manager',
  organization: 'Maharashtra Public Service Commission',
  orgAddress: 'MPSC, 5th Floor, Kousar Baug, Pune – 411 001',
  jobTitle: 'Assistant Engineer (Civil)',
  refNo: 'Advertisement No. 002/2026',

  // Letter body
  openingHook: 'I am writing to express my strong interest in the Assistant Engineer (Civil) position advertised by MPSC. With a B.E. in Civil Engineering (7.8 CGPA, 2024) and hands-on project experience, I am confident in my ability to contribute meaningfully to your organization.',
  whyFit: 'During my academic and project tenure, I have developed proficiency in AutoCAD, STAAD Pro, and site supervision. I have successfully completed an 8-month internship with Maharashtra PWD, where I assisted in quality inspection of a ₹12 crore road widening project under SH-27. I have also cleared the GATE 2024 exam with a score of 512 (AIR 3,841), demonstrating my technical foundation.',
  closing: 'I am eager to contribute to public infrastructure development in Maharashtra. I would welcome the opportunity to discuss my qualifications further. I have enclosed all required documents as per the advertisement.',

  // Sign-off
  signoff: 'Yours faithfully,',
}

export default function CoverLetterBuilder() {
  const [template, setTemplate] = useState('formal')
  const [data, setData] = useState({ ...DEFAULT_DATA })
  const [copied, setCopied] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Auth for save feature (future use)
  const [authToken, setAuthToken] = useState(null)
  useEffect(() => {
    try {
      setAuthToken(localStorage.getItem('eu_access_token') || null)
    } catch { setAuthToken(null) }
  }, [])

  // Update a single field
  const update = (field, value) => setData(d => ({ ...d, [field]: value }))

  // ── Print / Download PDF via popup window ──
  const handlePrint = () => {
    const printTarget = document.getElementById('cover-letter-preview')
    if (!printTarget) return
    const styles = Array.from(document.styleSheets)
      .map(ss => {
        try { return Array.from(ss.cssRules || []).map(r => r.cssText).join('\n') } catch { return '' }
      })
      .join('\n')

    const pw = window.open('', '_blank', 'width=850,height=1100')
    if (!pw) return
    pw.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Cover Letter — ${data.name}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #fff; color: #1a1a1a; }
    @page { size: A4 portrait; margin: 20mm; }
    ${styles}
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  </style>
</head>
<body>
  ${printTarget.outerHTML}
</body>
</html>`)
    pw.document.close()
    pw.focus()
    setTimeout(() => { pw.print(); pw.close() }, 400)
  }

  // ── Copy plain text ──
  const handleCopy = () => {
    const text = buildPlainText()
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const buildPlainText = () => `${data.name}
${data.phone} | ${data.email}
${data.address}

${data.date}

${data.hiringManager}
${data.organization}
${data.orgAddress}

Subject: Application for the Post of ${data.jobTitle}${data.refNo ? ` (Ref: ${data.refNo})` : ''}

Dear ${data.hiringManager},

${data.openingHook}

${data.whyFit}

${data.closing}

${data.signoff}
${data.name}
`

  // ── Render template ──
  const renderPreview = () => {
    if (template === 'modern') return <ModernTemplate data={data} />
    if (template === 'concise') return <ConciseTemplate data={data} />
    return <FormalTemplate data={data} />
  }

  return (
    <div style={{
      background: 'var(--surface-container-lowest)',
      border: '1px solid var(--outline-variant)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginBottom: 32,
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid var(--outline-variant)',
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        color: '#fff',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#EA580C' }}>mail</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>Professional Cover Letter Builder</div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
            3 templates · Print A4 PDF · Copy plain text · After-interview follow-up ready
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowForm(f => !f)}
            style={{
              background: showForm ? '#EA580C' : 'rgba(255,255,255,0.1)',
              color: '#fff', border: 'none',
              padding: '7px 14px', borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
            {showForm ? 'Hide Form' : 'Edit Details'}
          </button>
          <button
            onClick={handleCopy}
            style={{
              background: copied ? '#16a34a' : 'rgba(255,255,255,0.1)',
              color: '#fff', border: 'none',
              padding: '7px 14px', borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={handlePrint}
            style={{
              background: '#EA580C', color: '#fff', border: 'none',
              padding: '7px 16px', borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>print</span>
            Download / Print PDF
          </button>
        </div>
      </div>

      {/* ── Template selector ── */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--outline-variant)',
        background: 'var(--surface)',
        display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', whiteSpace: 'nowrap' }}>Template:</span>
        {CL_TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            title={t.desc}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: template === t.id ? 'var(--primary)' : 'var(--surface-container-lowest)',
              color: template === t.id ? '#fff' : 'var(--on-surface)',
              border: `1.5px solid ${template === t.id ? 'var(--primary)' : 'var(--outline-variant)'}`,
              padding: '6px 14px', borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            {t.badge} {t.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 0 }}>
        {/* ── Form Editor (collapsible) ── */}
        {showForm && (
          <div style={{
            width: 340, flexShrink: 0,
            borderRight: '1px solid var(--outline-variant)',
            overflowY: 'auto', maxHeight: '80vh',
            padding: 20,
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>
            {/* Sender */}
            <FieldGroup title="Your Details">
              <Field label="Full Name" value={data.name} onChange={v => update('name', v)} />
              <Field label="Phone" value={data.phone} onChange={v => update('phone', v)} />
              <Field label="Email" value={data.email} onChange={v => update('email', v)} />
              <Field label="City / Address" value={data.address} onChange={v => update('address', v)} />
              <Field label="Date" value={data.date} onChange={v => update('date', v)} />
            </FieldGroup>

            {/* Recipient */}
            <FieldGroup title="Recipient / Organization">
              <Field label="Hiring Manager / Title" value={data.hiringManager} onChange={v => update('hiringManager', v)} placeholder="The Hiring Manager / Director HR" />
              <Field label="Organization Name" value={data.organization} onChange={v => update('organization', v)} />
              <Field label="Organization Address" value={data.orgAddress} onChange={v => update('orgAddress', v)} textarea />
              <Field label="Job Title Applied For" value={data.jobTitle} onChange={v => update('jobTitle', v)} />
              <Field label="Reference / Advt No." value={data.refNo} onChange={v => update('refNo', v)} placeholder="Optional" />
            </FieldGroup>

            {/* Body */}
            <FieldGroup title="Letter Body">
              <Field label="Opening (Why you're applying)" value={data.openingHook} onChange={v => update('openingHook', v)} textarea rows={4} />
              <Field label="Why you're the right fit (skills, experience)" value={data.whyFit} onChange={v => update('whyFit', v)} textarea rows={5} />
              <Field label="Closing Statement" value={data.closing} onChange={v => update('closing', v)} textarea rows={3} />
              <Field label="Sign-off" value={data.signoff} onChange={v => update('signoff', v)} placeholder="Yours faithfully," />
            </FieldGroup>

            {!authToken && (
              <div style={{
                padding: 12, borderRadius: 8,
                background: 'var(--primary-fixed)',
                border: '1px solid var(--outline-variant)',
                fontSize: 12, color: 'var(--on-surface)', textAlign: 'center',
              }}>
                <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Login</Link> to save your cover letter versions
              </div>
            )}
          </div>
        )}

        {/* ── Live Preview ── */}
        <div style={{ flex: 1, background: '#F1F5F9', padding: 24, overflowY: 'auto' }}>
          <div style={{
            background: '#fff',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            borderRadius: 4,
            maxWidth: 794,
            margin: '0 auto',
          }} id="cover-letter-preview">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Field helpers ────────────────────────────────────────────
function FieldGroup({ title, children }) {
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'var(--primary)',
        borderBottom: '2px solid var(--primary)',
        paddingBottom: 4, marginBottom: 12,
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, textarea, rows = 3, placeholder }) {
  const style = {
    width: '100%', padding: '7px 10px',
    border: '1px solid var(--outline-variant)',
    borderRadius: 6, fontSize: 12, fontFamily: 'inherit',
    background: 'var(--surface-container-lowest)',
    color: 'var(--on-surface)', outline: 'none',
    resize: textarea ? 'vertical' : 'none',
  }
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--secondary)', marginBottom: 3 }}>{label}</div>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} style={style} placeholder={placeholder} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} style={style} placeholder={placeholder} />
      }
    </div>
  )
}

// ── FORMAL TEMPLATE ─────────────────────────────────────────
function FormalTemplate({ data }) {
  return (
    <div style={{ padding: '40px 48px', fontFamily: 'Georgia, serif', fontSize: 13, lineHeight: 1.7, color: '#1a1a1a' }}>
      {/* Sender info top right */}
      <div style={{ textAlign: 'right', marginBottom: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{data.name}</div>
        <div>{data.phone} | {data.email}</div>
        <div>{data.address}</div>
      </div>

      <div style={{ marginBottom: 20 }}>{data.date}</div>

      {/* Recipient */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700 }}>{data.hiringManager}</div>
        <div>{data.organization}</div>
        <div style={{ whiteSpace: 'pre-line' }}>{data.orgAddress}</div>
      </div>

      {/* Subject */}
      <div style={{ marginBottom: 20, fontWeight: 700, textDecoration: 'underline' }}>
        Subject: Application for the Post of {data.jobTitle}
        {data.refNo && ` — Ref: ${data.refNo}`}
      </div>

      <div style={{ marginBottom: 12 }}>Dear {data.hiringManager},</div>

      <p style={{ marginBottom: 14 }}>{data.openingHook}</p>
      <p style={{ marginBottom: 14 }}>{data.whyFit}</p>
      <p style={{ marginBottom: 28 }}>{data.closing}</p>

      <div style={{ marginBottom: 4 }}>{data.signoff}</div>
      <div style={{ fontWeight: 700 }}>{data.name}</div>
    </div>
  )
}

// ── MODERN TEMPLATE ─────────────────────────────────────────
function ModernTemplate({ data }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, lineHeight: 1.7, color: '#1a1a1a' }}>
      {/* Accent header */}
      <div style={{
        background: '#EA580C', color: '#fff',
        padding: '28px 40px 20px',
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>{data.name}</div>
        <div style={{ fontSize: 12, marginTop: 4, opacity: 0.9 }}>
          {data.phone} · {data.email} · {data.address}
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700 }}>{data.hiringManager}</div>
            <div>{data.organization}</div>
            <div style={{ color: '#555', fontSize: 12 }}>{data.orgAddress}</div>
          </div>
          <div style={{ textAlign: 'right', color: '#555', fontSize: 12 }}>
            {data.date}
          </div>
        </div>

        <div style={{
          fontWeight: 700, fontSize: 14,
          borderLeft: '4px solid #EA580C', paddingLeft: 12, marginBottom: 20,
        }}>
          Re: Application for {data.jobTitle}
          {data.refNo && <span style={{ fontWeight: 400, fontSize: 12 }}> ({data.refNo})</span>}
        </div>

        <div style={{ marginBottom: 12 }}>Dear {data.hiringManager},</div>
        <p style={{ marginBottom: 14 }}>{data.openingHook}</p>
        <p style={{ marginBottom: 14 }}>{data.whyFit}</p>
        <p style={{ marginBottom: 28 }}>{data.closing}</p>

        <div style={{ marginBottom: 4 }}>{data.signoff}</div>
        <div style={{ fontWeight: 700 }}>{data.name}</div>
      </div>
    </div>
  )
}

// ── CONCISE TEMPLATE ─────────────────────────────────────────
function ConciseTemplate({ data }) {
  return (
    <div style={{ padding: '40px 48px', fontFamily: 'Arial, sans-serif', fontSize: 13, lineHeight: 1.7, color: '#1a1a1a' }}>
      <div style={{
        borderBottom: '2px solid #1E293B', paddingBottom: 16, marginBottom: 20,
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1E293B' }}>{data.name}</div>
          <div style={{ fontSize: 12, color: '#555' }}>{data.phone} · {data.email} · {data.address}</div>
        </div>
        <div style={{ fontSize: 12, color: '#555', textAlign: 'right' }}>{data.date}</div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700 }}>{data.hiringManager}</div>
        <div style={{ color: '#555' }}>{data.organization}</div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>Re: {data.jobTitle}</strong>
        {data.refNo && <span style={{ color: '#555' }}> — {data.refNo}</span>}
      </div>

      <p style={{ marginBottom: 14 }}>{data.openingHook}</p>
      <p style={{ marginBottom: 14 }}>{data.whyFit}</p>
      <p style={{ marginBottom: 24 }}>{data.closing}</p>

      <div>{data.signoff}</div>
      <div style={{ fontWeight: 700 }}>{data.name}</div>
    </div>
  )
}
