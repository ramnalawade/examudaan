// ============================================================
// app/pricing/page.js — Pricing Plans
// Matches reference: 3 cards, feature comparison table, FAQ accordion
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'

// Note: metadata is defined in layout.js template for all pages
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: '/forever',
    description: 'Essential tools for every aspirant.',
    cta: 'Browse Jobs Now',
    ctaStyle: 'primary',
    featured: true,
    badge: 'Available Now',
    features: [
      'Daily Job Updates & Walk-ins',
      'AI Eligibility Matcher',
      'Direct Official PDF Links',
      'All 37+ Maharashtra Portals',
    ],
  },
  {
    id: 'personal',
    name: 'Personal (WhatsApp Alerts)',
    price: '₹49',
    period: '/month',
    description: 'Instant WhatsApp notifications tailored to your qualification.',
    cta: 'Coming Soon',
    ctaStyle: 'outline',
    featured: false,
    badge: 'Coming Soon',
    isComingSoon: true,
    features: [
      'Instant WhatsApp Alerts (< 5 min)',
      'Custom Category & Age Filters',
      'Save Unlimited Jobs',
      'Direct Apply Links on Chat',
      'Priority Notifications',
    ],
  },
  {
    id: 'assist',
    name: 'Form-Filling Assist',
    price: '₹99',
    period: '/per form',
    description: 'Expert help for complex application submissions.',
    cta: 'Coming Soon',
    ctaStyle: 'outline',
    featured: false,
    badge: 'Coming Soon',
    isComingSoon: true,
    features: [
      'Expert Form-Filling Support',
      'Document Verification',
      'Error-Free Submission',
      'Personalized Counseling (15m)',
    ],
  },
]

const COMPARISON = [
  { feature: 'Daily Job Updates',       free: true,  personal: true,  assist: true },
  { feature: 'Save Jobs',               free: '10',  personal: '∞',   assist: '∞' },
  { feature: 'Instant WhatsApp Alerts', free: false, personal: true,  assist: false },
  { feature: 'AI Eligibility Matching', free: false, personal: true,  assist: false },
  { feature: 'Ad-Free Experience',      free: false, personal: true,  assist: false },
  { feature: 'Expert Form-Filling',     free: false, personal: false, assist: true },
  { feature: 'Document Verification',   free: false, personal: false, assist: true },
]

const FAQS = [
  {
    q: 'Can I cancel my Personal subscription anytime?',
    a: 'Yes, absolutely. Our subscriptions run on a month-to-month basis. You can cancel anytime from your dashboard, and you won\'t be billed for the subsequent month.',
  },
  {
    q: 'How does the Form-Filling Assist work?',
    a: 'Once you book the service for ₹99, our experts will contact you to collect necessary documents securely. We will fill out the application on your behalf, verify it with you, and submit it before the deadline to ensure zero errors.',
  },
  {
    q: 'Is Marathi language supported in Alerts?',
    a: 'Yes! As a bilingual platform tailored for Maharashtra, all our WhatsApp alerts, email notifications, and AI matching insights can be configured to be delivered in Marathi.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept UPI (PhonePe, GPay, Paytm), all major debit & credit cards, and net banking. All payments are secured via Razorpay.',
  },
]

function CheckIcon({ color }) {
  return (
    <span className="material-symbols-outlined fill" style={{ fontSize: 22, color: color || 'var(--primary)' }}>
      check_circle
    </span>
  )
}
function CrossIcon() {
  return (
    <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--surface-dim)' }}>
      cancel
    </span>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <button className="faq-trigger" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q}</span>
        <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--on-surface-variant)', flexShrink: 0 }}>
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      <div className={`faq-body${open ? ' open' : ''}`}>{a}</div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '48px' }}>

      {/* ---- Hero header ---- */}
      <header style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 12, lineHeight: 1.2 }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{ fontSize: 17, color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
          Choose the right plan to accelerate your government job preparation.
          No hidden fees, cancel anytime.
        </p>
      </header>

      {/* ---- Pricing Cards ---- */}
      <section
        aria-label="Pricing plans"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          maxWidth: '960px',
          margin: '0 auto 56px',
          alignItems: 'center',
        }}
      >
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className={`pricing-card${plan.featured ? ' featured' : ''}`}
            style={plan.featured ? { transform: 'translateY(-12px)' } : {}}
          >
            {plan.badge && (
              <div className="pricing-badge">{plan.badge}</div>
            )}

            <div style={{ marginBottom: '12px', marginTop: plan.badge ? '12px' : 0 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--on-surface)' }}>{plan.name}</h2>
              <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 4 }}>{plan.description}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span className="pricing-price">{plan.price}</span>
              <span className="pricing-period"> {plan.period}</span>
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, marginBottom: '24px' }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckIcon color={plan.featured ? 'var(--primary-cta)' : 'var(--primary)'} />
                  <span style={{ fontSize: 15, color: 'var(--on-surface)', fontWeight: plan.featured ? 500 : 400 }}>{f}</span>
                </li>
              ))}
            </ul>

            {plan.isComingSoon ? (
              <div
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--surface-container-low)',
                  color: 'var(--on-surface-variant)',
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  border: '1.5px dashed var(--primary-cta)',
                  boxSizing: 'border-box',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary-cta)' }}>
                  hourglass_top
                </span>
                Coming Soon
              </div>
            ) : plan.id === 'free' ? (
              <Link href="/jobs" className="btn-primary btn-primary-lg"
                style={{ width: '100%', justifyContent: 'center', background: 'var(--primary-cta)', textDecoration: 'none' }}
                id={`plan-cta-${plan.id}`}>
                {plan.cta}
              </Link>
            ) : (
              <Link href="/login" className="btn-outline"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                id={`plan-cta-${plan.id}`}>
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </section>

      {/* ---- Feature Comparison Table ---- */}
      <section style={{ maxWidth: '800px', margin: '0 auto 56px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--on-surface)', textAlign: 'center', marginBottom: '24px' }}>
          Compare Features
        </h2>
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', width: '40%' }}>
                  Feature
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 15, fontWeight: 600, color: 'var(--on-surface)' }}>Free</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 15, fontWeight: 700, color: 'var(--primary-cta)' }}>Personal</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 15, fontWeight: 600, color: 'var(--on-surface)' }}>Assist</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(({ feature, free, personal, assist }, i) => (
                <tr key={feature} style={{
                  borderBottom: i < COMPARISON.length - 1 ? '1px solid var(--surface-container-high)' : 'none',
                  transition: 'background 0.1s',
                }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--on-surface-variant)' }}>{feature}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {free === true ? <CheckIcon /> : free === false ? <CrossIcon /> : (
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--secondary)' }}>{free}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', background: 'rgba(234,88,12,0.04)' }}>
                    {personal === true ? <CheckIcon color="var(--primary-cta)" /> : personal === false ? <CrossIcon /> : (
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-cta)' }}>{personal}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {assist === true ? <CheckIcon /> : assist === false ? <CrossIcon /> : (
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--secondary)' }}>{assist}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section style={{ maxWidth: '680px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--on-surface)', textAlign: 'center', marginBottom: '24px' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FAQS.map(faq => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>
    </div>
  )
}
