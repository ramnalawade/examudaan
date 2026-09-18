// ============================================================
// app/terms/page.js — Terms of Service
// Comprehensive legal terms conforming to Indian IT Act & DPDP Act
// ============================================================

import Link from 'next/link'
import { SITE_CONFIG } from '../../lib/constants'

export const metadata = {
  title: 'Terms of Service — ExamUdaan.in',
  description: 'Terms and conditions governing the use of ExamUdaan.in, including free exam aggregation services and paid WhatsApp alert subscriptions.',
}

export default function TermsPage() {
  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'disclaimer-govt', title: '2. Disclaimer: Not Affiliated with Government' },
    { id: 'services', title: '3. Description of Services & Alerts' },
    { id: 'subscriptions', title: '4. Subscriptions, Fees & Cancellation' },
    { id: 'user-conduct', title: '5. User Responsibilities & Account Security' },
    { id: 'accuracy', title: '6. Accuracy of Information & Official Sources' },
    { id: 'intellectual-property', title: '7. Intellectual Property Rights' },
    { id: 'limitation', title: '8. Limitation of Liability' },
    { id: 'governing-law', title: '9. Governing Law & Jurisdiction' },
    { id: 'modifications', title: '10. Changes to Terms' },
    { id: 'contact', title: '11. Contact & Grievance Redressal' },
  ]

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 64 }}>
      {/* Breadcrumb Header */}
      <div style={{ borderBottom: '1px solid var(--outline-variant)', background: 'var(--surface-container-lowest)', padding: '16px 0' }}>
        <div className="container" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--secondary)' }}>
            <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms of Service</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 0' }}>
        {/* Title & Meta */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--surface-container-low)',
            color: 'var(--secondary)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 12,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>gavel</span>
            Legal Agreement
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: 'var(--on-surface)', marginBottom: 8 }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: 14, color: 'var(--secondary)' }}>
            Last Updated: September 6, 2026 • Effective Date: January 1, 2026
          </p>
        </div>

        {/* Important Notice Callout */}
        <div style={{
          background: 'var(--primary-fixed)',
          borderLeft: '4px solid var(--primary-cta)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 36,
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--on-primary-fixed)', flexShrink: 0 }}>
            warning
          </span>
          <div style={{ fontSize: 14, color: 'var(--on-primary-fixed)', lineHeight: 1.6 }}>
            <strong>Important Government Non-Affiliation Notice:</strong> ExamUdaan.in is a privately operated portal. We are <strong>NOT</strong> an official government agency, department, or recruiting board. All exam notifications and recruitment details published here are aggregated from publicly available government websites. Candidates must always verify details with official notification PDFs.
          </div>
        </div>

        {/* Layout: TOC + Content (Responsive) */}
        <div className="legal-page-layout">
          {/* Main Legal Content */}
          <div style={{
            background: 'var(--surface-container-lowest)',
            padding: '36px 32px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--outline-variant)',
            lineHeight: 1.7,
            color: 'var(--on-surface-variant)',
            fontSize: 15,
          }}>
            <section id="acceptance" style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                1. Acceptance of Terms
              </h2>
              <p style={{ marginBottom: 12 }}>
                By accessing, browsing, or utilizing ExamUdaan.in (the &quot;Platform&quot; or &quot;Website&quot;) or by subscribing to our SMS, WhatsApp, or Email notification services, you agree to be bound by these Terms of Service (&quot;Terms&quot;) and our <Link href="/privacy" style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</Link>.
              </p>
              <p>
                If you do not agree with any part of these Terms, you must discontinue your use of ExamUdaan.in immediately. This agreement is compliant with the Information Technology Act, 2000 and rules made thereunder.
              </p>
            </section>

            <section id="disclaimer-govt" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                2. Disclaimer: Not Affiliated with Government
              </h2>
              <p style={{ marginBottom: 12 }}>
                ExamUdaan.in is an independent digital news and aggregation service operated for the benefit of job seekers in Maharashtra and across India.
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>We are not affiliated with, endorsed by, or representing any government department, ministry, public sector undertaking (PSU), or recruiting commission (including MPSC, UPSC, SSC, RRB, BMC, Police Commissionerates, or Zilla Parishads).</li>
                <li>We do not issue official admit cards, exam schedules, or employment appointment letters.</li>
                <li>All links labeled &quot;Apply Online&quot;, &quot;Official Notification PDF&quot;, or &quot;Result Link&quot; redirect users to external government servers over which ExamUdaan.in exercises no administrative control.</li>
              </ul>
            </section>

            <section id="services" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                3. Description of Services & Alerts
              </h2>
              <p style={{ marginBottom: 12 }}>
                ExamUdaan.in offers both free and optional paid services:
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li><strong>Free Services:</strong> Publicly searchable catalog of recruitment notifications, exam date calendars, results, syllabus summaries, and answer keys.</li>
                <li><strong>Paid Alert Subscriptions (Personal Plan ₹49/mo, etc.):</strong> Direct automated WhatsApp and Email notifications categorized by your preferred qualifications (10th, 12th, ITI, Graduate, Engineering, Police, Teaching) and geographic preferences.</li>
                <li><strong>Form-Filling Assistance (₹99/form):</strong> Guidance service to assist candidates in filling online application forms accurately before official submission.</li>
              </ul>
            </section>

            <section id="subscriptions" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                4. Subscriptions, Fees & Cancellation
              </h2>
              <p style={{ marginBottom: 12 }}>
                When subscribing to our WhatsApp alerts or paid assistance tiers:
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li><strong>Payment:</strong> All fees are billed in Indian National Rupees (INR) through authorized RBI-compliant payment processors (Razorpay / Cashfree). Fees include applicable GST.</li>
                <li><strong>Billing Cycle:</strong> Subscriptions renew on a 30-day billing cycle unless cancelled prior to the renewal date.</li>
                <li><strong>Cancellation:</strong> You may cancel your subscription at any time from your Account Dashboard. Upon cancellation, your alert access will remain active until the conclusion of the paid billing period.</li>
                <li><strong>Refund Policy:</strong> Due to immediate digital delivery of automated notification services, subscription fees are non-refundable once the billing period has commenced, except in documented cases of double charges or system failure.</li>
              </ul>
            </section>

            <section id="user-conduct" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                5. User Responsibilities & Account Security
              </h2>
              <p style={{ marginBottom: 12 }}>
                When creating an account or subscribing for alerts:
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>You agree to provide accurate, current, and verifiable mobile phone numbers and email addresses.</li>
                <li>You are responsible for maintaining the confidentiality of any One-Time Passwords (OTPs) sent to your device.</li>
                <li>You agree not to scrape, reverse-engineer, automated-query, or harvest data from ExamUdaan.in for commercial resale without prior written authorization.</li>
              </ul>
            </section>

            <section id="accuracy" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                6. Accuracy of Information & Official Sources
              </h2>
              <p style={{ marginBottom: 12 }}>
                While ExamUdaan employs automated crawlers and AI extraction mechanisms to deliver accurate summaries (including educational eligibility, age criteria, application fees, and deadlines), human or algorithmic errors may occur.
              </p>
              <p>
                In the event of any discrepancy between information shown on ExamUdaan.in and the official published notification PDF or gazette of the recruiting authority, <strong>the official government notification shall always prevail</strong>. We strongly recommend that candidates download and review the official PDF before submitting applications or remitting exam fees.
              </p>
            </section>

            <section id="intellectual-property" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                7. Intellectual Property Rights
              </h2>
              <p style={{ marginBottom: 12 }}>
                The ExamUdaan name, brand logo, software code, user interface designs, and AI classification models are the proprietary intellectual property of ExamUdaan.in.
              </p>
              <p>
                Government recruitment notifications, emblems, department acronyms, and official recruitment gazettes remain the intellectual property and copyright of their respective government authorities and ministries.
              </p>
            </section>

            <section id="limitation" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                8. Limitation of Liability
              </h2>
              <p style={{ marginBottom: 12 }}>
                To the maximum extent permitted by applicable Indian law, ExamUdaan.in, its founders, and affiliates shall not be held liable for:
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Any missed exam deadlines, application rejections, or disqualifications resulting from delayed alerts or network carrier failures.</li>
                <li>Changes made by recruiting boards to exam dates, vacancy counts, or syllabus guidelines without prior public notice.</li>
                <li>Downtime, network interruptions, or WhatsApp messaging protocol suspensions beyond our reasonable operational control.</li>
              </ul>
            </section>

            <section id="governing-law" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                9. Governing Law & Jurisdiction
              </h2>
              <p>
                These Terms shall be governed by and interpreted under the laws of the Republic of India. Any disputes, claims, or legal proceedings arising out of or in connection with these Terms or the Platform shall be subject to the exclusive jurisdiction of the competent courts in <strong>Pune / Mumbai, Maharashtra, India</strong>.
              </p>
            </section>

            <section id="modifications" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                10. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. Significant updates will be communicated via notice on our website or via WhatsApp announcement for active subscribers. Continued use of the platform after updates indicates acceptance of the revised Terms.
              </p>
            </section>

            <section id="contact" style={{ paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                11. Contact & Grievance Redressal
              </h2>
              <p style={{ marginBottom: 12 }}>
                If you have questions regarding these Terms, or wish to report a content inaccuracy:
              </p>
              <div style={{ background: 'var(--surface-container-low)', padding: 16, borderRadius: 'var(--radius-sm)' }}>
                <p style={{ margin: '0 0 6px', fontWeight: 600, color: 'var(--on-surface)' }}>{SITE_CONFIG.grievanceOfficer.title}</p>
                <p style={{ margin: '0 0 6px' }}>Email: <a href={`mailto:${SITE_CONFIG.contact.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{SITE_CONFIG.contact.email}</a></p>
                <p style={{ margin: '0 0 6px' }}>Address: {SITE_CONFIG.location.fullAddress}</p>
                <p style={{ margin: 0 }}>Response Time: Within 48 working hours</p>
              </div>
            </section>
          </div>

          {/* Sticky Table of Contents */}
          <div style={{
            position: 'sticky',
            top: 80,
            background: 'var(--surface-container-lowest)',
            padding: 20,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--outline-variant)',
            display: 'none',
          }} className="desktop-toc">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              On This Page
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sections.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  style={{
                    fontSize: 13,
                    color: 'var(--secondary)',
                    textDecoration: 'none',
                    lineHeight: 1.4,
                    transition: 'color 0.15s',
                  }}
                >
                  {s.title}
                </a>
              ))}
            </nav>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <Link
                href="/contact"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--primary-cta)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>mail</span>
                Have a question? Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .desktop-toc {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}
