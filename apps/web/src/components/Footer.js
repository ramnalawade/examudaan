// ============================================================
// Footer.js — Desktop & Mobile footer
// ExamUdaan.in | Fully bilingual support (English <-> Marathi)
// ============================================================

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t, isMarathi } = useLanguage()

  const links = [
    { href: '/about', label: t('footer.about', 'About Us') },
    { href: '/faq', label: t('footer.faq', 'FAQ') },
    { href: '/feedback', label: t('footer.suggest', 'Suggest Exam / Feedback') },
    { href: '/contact', label: t('footer.contact', 'Contact Us') },
    { href: '/pricing', label: t('footer.whatsapp_alerts', 'WhatsApp Alerts (Coming Soon)') },
    { href: '/terms', label: t('footer.terms', 'Terms of Service') },
    { href: '/privacy', label: t('footer.privacy', 'Privacy Policy') },
    { href: '/disclaimer', label: t('footer.disclaimer', 'Disclaimer') },
  ]

  return (
    <footer className="footer" role="contentinfo" style={{ display: 'block', padding: '36px 20px 80px' }}>
      <div className="footer-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Top row: Brand & Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, width: '100%' }}>
          {/* Brand */}
          <div style={{ maxWidth: 360 }}>
            <Link href="/" aria-label="ExamUdaan Home">
              <Image
                src="/logo-light.svg"
                alt="ExamUdaan.in"
                width={160}
                height={42}
                style={{ height: 42, width: 'auto' }}
              />
            </Link>
            <p className="footer-copy" style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>
              {t('footer.tagline', 'Your Exam. Your Career. Your Udaan.')}
            </p>
            <p className="footer-copy" style={{ marginTop: 4, opacity: 0.8, fontSize: 13 }}>
              {t('footer.subtagline', "Maharashtra's AI-Powered Sarkari Job & Exam Alerts Aggregator")}
            </p>
          </div>

          {/* Links */}
          <nav className="footer-links" aria-label="Footer navigation" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', alignItems: 'center' }}>
            {links.map(({ href, label }) => (
              <Link key={href} href={href} style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom row: Disclaimer & Copyright */}
        <div style={{
          borderTop: '1px solid var(--outline-variant)',
          paddingTop: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          width: '100%',
          fontSize: 12,
          color: 'var(--secondary)',
        }}>
          <p style={{ margin: 0, maxWidth: 680, lineHeight: 1.5 }}>
            <strong>{isMarathi ? 'अस्वीकरण: ' : 'Disclaimer: '}</strong>
            {t('footer.disclaimer_text', 'ExamUdaan.in is an independent platform and is not affiliated with, endorsed by, or representing any government department or recruiting board. Always cross-verify notifications with official government gazettes.')}
          </p>
          <div className="footer-copy" style={{ margin: 0 }}>
            © {new Date().getFullYear()} ExamUdaan.in — {t('footer.rights', 'All rights reserved.')}
          </div>
        </div>
      </div>
    </footer>
  )
}
