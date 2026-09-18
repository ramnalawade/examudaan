// ============================================================
// app/privacy/page.js — Privacy Policy
// Compliant with DPDP Act 2023 & Information Technology Act 2000
// ============================================================

import Link from 'next/link'
import { SITE_CONFIG } from '../../lib/constants'

export const metadata = {
  title: 'Privacy Policy — ExamUdaan.in',
  description: 'Learn how ExamUdaan.in collects, protects, and handles your personal information, mobile numbers, and WhatsApp alert preferences.',
}

export default function PrivacyPage() {
  const sections = [
    { id: 'collection', title: '1. Information We Collect' },
    { id: 'usage', title: '2. How We Use Your Information' },
    { id: 'whatsapp-policy', title: '3. WhatsApp & SMS Alert Communications' },
    { id: 'payments', title: '4. Payment Information & Security' },
    { id: 'cookies', title: '5. Cookies & Tracking Technologies' },
    { id: 'sharing', title: '6. Information Sharing & Third Parties' },
    { id: 'retention', title: '7. Data Retention & Storage' },
    { id: 'rights', title: '8. Your Rights Under DPDP Act 2023' },
    { id: 'security', title: '9. Security Measures' },
    { id: 'contact', title: '10. Grievance Redressal & Contact' },
  ]

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 64 }}>
      {/* Breadcrumb Header */}
      <div style={{ borderBottom: '1px solid var(--outline-variant)', background: 'var(--surface-container-lowest)', padding: '16px 0' }}>
        <div className="container" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--secondary)' }}>
            <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 0' }}>
        {/* Header */}
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
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>security</span>
            Data Protection
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: 'var(--on-surface)', marginBottom: 8 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: 'var(--secondary)' }}>
            Last Updated: September 6, 2026 • Effective Date: January 1, 2026
          </p>
        </div>

        {/* DPDP Trust Badge */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: 36,
          display: 'flex',
          gap: 14,
          alignItems: 'center',
        }}>
          <span className="material-symbols-outlined fill" style={{ fontSize: 28, color: 'var(--tertiary)' }}>
            verified_user
          </span>
          <div style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
            <strong>Your Privacy is Sacred:</strong> ExamUdaan.in respects your personal autonomy. We strictly do not sell your mobile number, email, or exam preferences to third-party telemarketers or coaching institutes.
          </div>
        </div>

        {/* Content Layout (Responsive) */}
        <div className="legal-page-layout">
          <div style={{
            background: 'var(--surface-container-lowest)',
            padding: '36px 32px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--outline-variant)',
            lineHeight: 1.7,
            color: 'var(--on-surface-variant)',
            fontSize: 15,
          }}>
            <section id="collection" style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                1. Information We Collect
              </h2>
              <p style={{ marginBottom: 12 }}>
                We collect only the minimum information necessary to deliver relevant Sarkari job updates and manage your alert preferences:
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li><strong>Account & Contact Info:</strong> Mobile phone number (used for OTP login & WhatsApp alerts), email address, and candidate display name.</li>
                <li><strong>Aspirant Preferences:</strong> Educational background (e.g., 10th, 12th, Graduate, B.E., Diploma), preferred job sectors (MPSC, Police, Teaching, Railways, BMC), and target districts in Maharashtra.</li>
                <li><strong>Usage & Technical Data:</strong> Device browser type, IP address, operating system, and pages viewed to optimize server load and prevent abuse.</li>
              </ul>
            </section>

            <section id="usage" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                2. How We Use Your Information
              </h2>
              <p style={{ marginBottom: 12 }}>Your data is utilized exclusively for:</p>
              <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Sending timely WhatsApp, SMS, or email alerts regarding new recruitment notifications matching your selected criteria.</li>
                <li>Notifying you about approaching application deadlines, admit card releases, answer keys, and merit list results.</li>
                <li>Authenticating account access securely via One-Time Password (OTP) verification.</li>
                <li>Troubleshooting customer support tickets and form-filling guidance requests.</li>
              </ul>
            </section>

            <section id="whatsapp-policy" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                3. WhatsApp & SMS Alert Communications
              </h2>
              <p style={{ marginBottom: 12 }}>
                We operate under a strict anti-spam policy. By subscribing to our ₹49/month or custom alert packages:
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>You provide express consent to receive automated transactional and informational messages via the official WhatsApp Business API.</li>
                <li>Alerts are sent strictly when verified government vacancies matching your profile are published.</li>
                <li><strong>Instant Opt-Out:</strong> You may unsubscribe at any moment by clicking &quot;Unsubscribe&quot; in your user dashboard or by replying with the keyword <strong>STOP</strong> on WhatsApp.</li>
              </ul>
            </section>

            <section id="payments" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                4. Payment Information & Security
              </h2>
              <p style={{ marginBottom: 12 }}>
                All digital transactions are processed through PCI-DSS Level 1 certified Indian payment gateways (such as Razorpay / Cashfree).
              </p>
              <p>
                ExamUdaan.in <strong>never captures, handles, or stores</strong> your complete credit/debit card numbers, CVV codes, net banking passwords, or UPI PINs. All financial credential exchanges occur in encrypted HTTPS sessions directly between your browser and the certified gateway.
              </p>
            </section>

            <section id="cookies" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                5. Cookies & Tracking Technologies
              </h2>
              <p style={{ marginBottom: 12 }}>
                We utilize essential cookies to keep you logged in and store your bilingual interface preference (English / Marathi). We may also use Google Analytics to analyze aggregate visitor traffic trends. You may disable cookies in your browser settings, though some portal preferences may not persist across sessions.
              </p>
            </section>

            <section id="sharing" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                6. Information Sharing & Third Parties
              </h2>
              <p style={{ marginBottom: 12 }}>
                We do not sell, rent, or trade your personal data. We only share data with trusted infrastructure providers under confidentiality obligations:
              </p>
              <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li><strong>Cloud Infrastructure:</strong> PostgreSQL database and server hosting within secure Indian data center facilities.</li>
                <li><strong>Telecommunications & Messaging:</strong> Official WhatsApp Business API solution partners (e.g. Meta / Gupshup / Twilio) solely for delivering notifications you subscribed to.</li>
                <li><strong>Legal Obligations:</strong> If mandated by a valid judicial warrant or lawful order issued by Indian statutory law enforcement authorities.</li>
              </ul>
            </section>

            <section id="retention" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                7. Data Retention & Storage
              </h2>
              <p>
                We retain your account profile and alert preferences as long as your subscription or user account remains active. If you choose to delete your account, your personal details are permanently deleted from our production database within 30 business days.
              </p>
            </section>

            <section id="rights" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                8. Your Rights Under DPDP Act 2023
              </h2>
              <p style={{ marginBottom: 12 }}>As a Data Principal, you possess statutory rights including:</p>
              <ul style={{ paddingLeft: 20, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li><strong>Right to Access:</strong> View the summary of personal data held about you.</li>
                <li><strong>Right to Correction & Erasure:</strong> Correct inaccuracies or request complete erasure of your profile.</li>
                <li><strong>Right to Withdraw Consent:</strong> Revoke authorization for WhatsApp notification dispatches at any time.</li>
                <li><strong>Right of Grievance Redressal:</strong> Lodge a complaint with our Grievance Redressal Officer.</li>
              </ul>
            </section>

            <section id="security" style={{ marginBottom: 32, paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                9. Security Measures
              </h2>
              <p>
                We employ industry-standard security protocols including 256-bit TLS/SSL encryption across all endpoints, strict role-based internal access controls, parameterized SQL queries to prevent injection attacks, and automated security scans.
              </p>
            </section>

            <section id="contact" style={{ paddingTop: 16, borderTop: '1px solid var(--outline-variant)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12 }}>
                10. Grievance Redressal & Contact
              </h2>
              <p style={{ marginBottom: 12 }}>
                In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:
              </p>
              <div style={{ background: 'var(--surface-container-low)', padding: 16, borderRadius: 'var(--radius-sm)' }}>
                <p style={{ margin: '0 0 6px', fontWeight: 600, color: 'var(--on-surface)' }}>{SITE_CONFIG.grievanceOfficer.title}</p>
                <p style={{ margin: '0 0 6px' }}>Email: <a href={`mailto:${SITE_CONFIG.contact.privacyEmail}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{SITE_CONFIG.contact.privacyEmail}</a></p>
                <p style={{ margin: '0 0 6px' }}>Office: {SITE_CONFIG.location.fullAddress}</p>
                <p style={{ margin: 0 }}>Grievance Resolution Timeline: Within {SITE_CONFIG.grievanceOfficer.resolutionDays} calendar days</p>
              </div>
            </section>
          </div>

          {/* Sticky TOC */}
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
              Contents
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
                  }}
                >
                  {s.title}
                </a>
              ))}
            </nav>
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
