// ============================================================
// app/contact/page.js — Contact Us Page
// Interactive support form, direct WhatsApp helpline, office info & FAQs
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SITE_CONFIG } from '../../lib/constants'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'alert_support',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  const contactCards = [
    {
      icon: 'chat',
      title: 'WhatsApp Support',
      subtitle: 'Instant chat for alert queries & plan activation',
      value: SITE_CONFIG.contact.phoneFormatted,
      actionLabel: 'Chat on WhatsApp',
      href: SITE_CONFIG.contact.whatsappAlertQueryLink,
      badge: 'Fastest Response',
    },
    {
      icon: 'mail',
      title: 'Email Desk',
      subtitle: 'For partnership, grievance & technical support',
      value: SITE_CONFIG.contact.email,
      actionLabel: 'Send an Email',
      href: `mailto:${SITE_CONFIG.contact.email}`,
    },
    {
      icon: 'location_on',
      title: 'Office Address',
      subtitle: 'Maharashtra Operations Center',
      value: SITE_CONFIG.location.fullAddress,
      actionLabel: 'View on Maps',
      href: SITE_CONFIG.location.googleMapsUrl,
    },
  ]

  const quickFaqs = [
    {
      q: 'How quickly will I receive WhatsApp job alerts after subscribing?',
      a: 'Alerts are dispatched within 5 minutes of a verified government recruitment announcement or deadline update being indexed by our crawlers.',
    },
    {
      q: 'Can ExamUdaan change my exam center or fix an error on my admit card?',
      a: 'No. ExamUdaan is an informational aggregator. You must contact the official recruiting board (e.g. MPSC, BMC, or Police Commissionerate) directly for corrections.',
    },
    {
      q: 'How do I cancel or modify my ₹49/month WhatsApp alert subscription?',
      a: 'You can cancel or switch exam categories anytime from your user dashboard, or by replying with the keyword STOP directly on WhatsApp.',
    },
  ]

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 64 }}>
      {/* Breadcrumb Header */}
      <div style={{ borderBottom: '1px solid var(--outline-variant)', background: 'var(--surface-container-lowest)', padding: '16px 0' }}>
        <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--secondary)' }}>
            <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact Us</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px 0' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--primary-fixed)',
            color: 'var(--on-primary-fixed)',
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 12,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>headset_mic</span>
            We&apos;re Here to Help
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'var(--on-surface)', marginBottom: 12 }}>
            Get in Touch with ExamUdaan
          </h1>
          <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', maxWidth: 640, margin: '0 auto' }}>
            Have a question about your WhatsApp subscription, found a data discrepancy, or want to suggest a new government recruitment board? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Methods Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 44,
        }}>
          {contactCards.map((card, idx) => (
            <div key={idx} style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            }}>
              {card.badge && (
                <span style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'var(--tertiary-fixed)',
                  color: 'var(--on-tertiary-fixed)',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {card.badge}
                </span>
              )}
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--primary-fixed)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{card.icon}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 12, flexGrow: 1 }}>{card.subtitle}</p>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 16, wordBreak: 'break-word' }}>
                {card.value}
              </div>
              <a
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{
                  color: 'var(--primary-cta)',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {card.actionLabel}
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </a>
            </div>
          ))}
        </div>

        {/* Main Grid: Form + FAQs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>
          {/* Form */}
          <div style={{
            background: 'var(--surface-container-lowest)',
            border: '1px solid var(--outline-variant)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 28px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 6 }}>
              Send Us a Message
            </h2>
            <p style={{ fontSize: 14, color: 'var(--secondary)', marginBottom: 24 }}>
              Our support team usually responds within 2 to 4 business hours.
            </p>

            {submitted ? (
              <div style={{
                background: 'var(--surface-container-low)',
                border: '1px solid var(--tertiary)',
                borderRadius: 'var(--radius-md)',
                padding: '32px 24px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'var(--tertiary-fixed)',
                  color: 'var(--tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32 }}>check_circle</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8 }}>
                  Message Received!
                </h3>
                <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: 20 }}>
                  Thank you for reaching out, <strong>{formData.name || 'Candidate'}</strong>. A confirmation has been registered, and our support team will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', email: '', phone: '', category: 'alert_support', subject: '', message: '' })
                  }}
                  className="btn-outline"
                  style={{
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Deshmukh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--outline-variant)',
                      fontSize: 14,
                      background: 'var(--surface)',
                      color: 'var(--on-surface)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>
                      Mobile / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--outline-variant)',
                        fontSize: 14,
                        background: 'var(--surface)',
                        color: 'var(--on-surface)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--outline-variant)',
                        fontSize: 14,
                        background: 'var(--surface)',
                        color: 'var(--on-surface)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>
                    Query Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--outline-variant)',
                      fontSize: 14,
                      background: 'var(--surface)',
                      color: 'var(--on-surface)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="alert_support">WhatsApp Alerts & Subscription Support</option>
                    <option value="payment">Billing, Payment, or Refund Issue</option>
                    <option value="data_correction">Report Job Notification Discrepancy</option>
                    <option value="form_assist">Form-Filling Assist Service (₹99)</option>
                    <option value="partnership">Partnership or Institutional Inquiries</option>
                    <option value="other">General Feedback / Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>
                    Message / Query Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please provide specific details so we can assist you quickly..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--outline-variant)',
                      fontSize: 14,
                      background: 'var(--surface)',
                      color: 'var(--on-surface)',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'var(--primary-cta)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 8,
                    boxShadow: '0 2px 8px rgba(234, 88, 12, 0.25)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                  {loading ? 'Submitting...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Side Info & Quick FAQs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              background: 'var(--surface-container-low)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>schedule</span>
                Operating Hours
              </h3>
              <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.6, margin: '0 0 8px' }}>
                <strong>{SITE_CONFIG.hours.workingDays}:</strong> {SITE_CONFIG.hours.timing}
              </p>
              <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.6, margin: 0 }}>
                {SITE_CONFIG.hours.weekendNote}
              </p>
            </div>

            {/* Quick Support FAQs */}
            <div style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 16 }}>
                Frequently Asked
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {quickFaqs.map((faq, i) => (
                  <div key={i} style={{ borderBottom: i < quickFaqs.length - 1 ? '1px solid var(--outline-variant)' : 'none', paddingBottom: i < quickFaqs.length - 1 ? 14 : 0 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>
                      {faq.q}
                    </h4>
                    <p style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.5, margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--outline-variant)' }}>
                <Link
                  href="/faq"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--primary-cta)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  View All FAQs
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
