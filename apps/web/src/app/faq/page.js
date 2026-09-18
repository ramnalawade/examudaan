// ============================================================
// app/faq/page.js — Frequently Asked Questions (FAQ)
// Interactive accordion with category filtering and search
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SITE_CONFIG } from '../../lib/constants'

const FAQ_DATA = [
  {
    category: 'general',
    q: 'What is ExamUdaan.in and how does it work?',
    a: 'ExamUdaan.in is an intelligent aggregator of government exam notifications and Sarkari job openings across Maharashtra and India. We continuously crawl 37+ official boards (MPSC, Police, BMC, ZP, SSC, RRB, etc.) and use AI to extract important dates, educational eligibility, age criteria, and direct PDF download links.',
  },
  {
    category: 'general',
    q: 'Is ExamUdaan an official government website?',
    a: 'No. ExamUdaan.in is an independent, privately managed informational portal. We are NOT affiliated with any government agency. All our listings provide direct links to the official government gazettes and application websites.',
  },
  {
    category: 'general',
    q: 'Are the job listings on ExamUdaan free to view?',
    a: 'Yes, 100%! All recruitment updates, admit cards, exam calendars, results, and syllabus breakdowns are free and open to everyone without any registration or login required.',
  },
  {
    category: 'alerts',
    q: 'How do the WhatsApp alerts work and what do they cost?',
    a: `Our Personal alert plan costs ${SITE_CONFIG.pricing.alertMonthly}/month. Once subscribed, our system matches your qualifications (e.g. 10th pass, Graduate, Engineering, ITI) and target sectors, and sends instant notifications straight to your WhatsApp as soon as an official advertisement is published.`,
  },
  {
    category: 'alerts',
    q: 'Can I receive WhatsApp alerts in Marathi?',
    a: 'Yes. ExamUdaan is specifically designed for Maharashtra aspirants. You can toggle Marathi language in your profile to receive WhatsApp alerts, eligibility summaries, and exam dates in शुद्ध मराठी.',
  },
  {
    category: 'alerts',
    q: 'How do I cancel my WhatsApp alert subscription?',
    a: 'You can cancel anytime from your Account Dashboard under Billing, or simply reply with the keyword "STOP" to our official WhatsApp number. There are no cancellation penalties or hidden lock-ins.',
  },
  {
    category: 'eligibility',
    q: 'What is the difference between "Recruitment" and "Walk-in Interview"?',
    a: 'Recruitments usually involve an online application form, application fee, and written examination held weeks or months later. Walk-in interviews require candidates to carry their CV and certificates directly to a designated venue on a specific walk-in date without a prior written exam.',
  },
  {
    category: 'eligibility',
    q: 'How does the AI Eligibility Matching work?',
    a: 'Our proprietary AI extraction engine reads the official notification PDF and extracts mandatory qualifications (e.g. Degree in Civil Engineering, MS-CIT, typing speed) and caste category age relaxations (OBC +3 yrs, SC/ST +5 yrs). You can immediately see if you qualify without reading 80 pages of gazette text.',
  },
  {
    category: 'eligibility',
    q: 'Where do I find the official Notification PDF?',
    a: 'Every detail page on ExamUdaan includes an "Official Notification PDF" button in the Quick Links card and Important Dates section. This link downloads the original PDF directly from the government department’s official server.',
  },
  {
    category: 'payments',
    q: 'What payment methods do you support for alert plans?',
    a: 'We support all Indian payment methods via Razorpay: UPI (Google Pay, PhonePe, Paytm, BHIM), Debit & Credit cards (RuPay, Visa, Mastercard), and Net Banking across 50+ Indian banks.',
  },
  {
    category: 'payments',
    q: 'What is the "Form-Filling Assist" (₹99) service?',
    a: `Many aspirants make mistakes in document uploads, photo sizing, or category selection that lead to rejection. For ${SITE_CONFIG.pricing.formAssist} per form, our dedicated counselors help review your documents and ensure your application is filled out error-free before the deadline.`,
  },
  {
    category: 'payments',
    q: 'Are payments secure and refundable?',
    a: `All transactions are encrypted with 256-bit bank-grade TLS. If you were accidentally charged twice or faced a system failure, our support team issues a 100% refund within 3-5 business days upon request at ${SITE_CONFIG.contact.email}.`,
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'General & Portal' },
  { id: 'alerts', label: 'WhatsApp Alerts' },
  { id: 'eligibility', label: 'Eligibility & PDFs' },
  { id: 'payments', label: 'Payments & Billing' },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState(0)

  const filteredFaqs = FAQ_DATA.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.a.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 64 }}>
      {/* Breadcrumb Header */}
      <div style={{ borderBottom: '1px solid var(--outline-variant)', background: 'var(--surface-container-lowest)', padding: '16px 0' }}>
        <div className="container" style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--secondary)' }}>
            <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>FAQ</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 960, margin: '0 auto', padding: '40px 20px 0' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--primary-fixed)',
            color: 'var(--on-primary-fixed)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 12,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>quiz</span>
            Got Questions?
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: 'var(--on-surface)', marginBottom: 12 }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', maxWidth: 600, margin: '0 auto 28px' }}>
            Everything you need to know about ExamUdaan alerts, official PDF verifications, and subscription plans.
          </p>

          {/* Search Box */}
          <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
            <span className="material-symbols-outlined" style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--secondary)',
              fontSize: 20,
            }}>
              search
            </span>
            <input
              type="text"
              placeholder="Search questions (e.g. WhatsApp, refund, walk-in)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--outline-variant)',
                fontSize: 14,
                background: 'var(--surface-container-lowest)',
                color: 'var(--on-surface)',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 36,
        }}>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                fontWeight: 600,
                border: activeCategory === c.id ? '1px solid var(--primary)' : '1px solid var(--outline-variant)',
                background: activeCategory === c.id ? 'var(--primary-cta)' : 'var(--surface-container-lowest)',
                color: activeCategory === c.id ? '#ffffff' : 'var(--on-surface)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredFaqs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 48,
              background: 'var(--surface-container-lowest)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--outline-variant)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--secondary)', marginBottom: 8 }}>
                search_off
              </span>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--on-surface)', margin: '0 0 6px' }}>No questions found</p>
              <p style={{ fontSize: 14, color: 'var(--secondary)', margin: 0 }}>
                Try searching with different keywords or contact our team directly.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx
              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: 'var(--on-surface)',
                      fontSize: 15,
                      fontWeight: 600,
                      gap: 16,
                    }}
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined" style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      color: isOpen ? 'var(--primary-cta)' : 'var(--secondary)',
                      fontSize: 20,
                      flexShrink: 0,
                    }}>
                      keyboard_arrow_down
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: '0 20px 20px',
                      color: 'var(--on-surface-variant)',
                      fontSize: 14,
                      lineHeight: 1.7,
                      borderTop: '1px solid var(--surface-container-low)',
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div style={{
          marginTop: 48,
          background: 'var(--surface-container-low)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '28px 24px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8 }}>
            Still have a question?
          </h3>
          <p style={{ fontSize: 14, color: 'var(--secondary)', maxWidth: 500, margin: '0 auto 20px' }}>
            Can&apos;t find what you are looking for? Our friendly support team is here to assist you via WhatsApp and Email.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              className="btn-primary"
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>mail</span>
              Contact Support
            </Link>
            <a
              href={SITE_CONFIG.contact.whatsappGeneralQueryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
