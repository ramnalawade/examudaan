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
    { href: '/blog', label: isMarathi ? 'परीक्षा ब्लॉग व मार्गदर्शक' : 'Exam Blog & Guides' },
    { href: '/score-calculator', label: isMarathi ? 'गुण कॅल्क्युलेटर' : 'Key Score Calc' },
    { href: '/daily-quiz', label: isMarathi ? 'दैनिक क्विझ' : 'Daily Quiz' },
    { href: '/cutoffs', label: isMarathi ? 'कट-ऑफ विश्लेषक' : 'Cutoff Explorer' },
    { href: '/pyq', label: isMarathi ? '१५ वर्षे प्रश्नपत्रिका' : '15-Yr PYQs' },
    { href: '/police-calculator', label: isMarathi ? 'पोलीस भरती कॅल्क्युलेटर' : 'Police Merit Calc' },
    { href: '/contact', label: t('footer.contact', 'Contact Us') },
    { href: 'https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v', label: isMarathi ? 'WhatsApp चॅनेल' : 'WhatsApp Channel', isExternal: true },
    { href: 'https://t.me/examudaanjobs', label: isMarathi ? 'Telegram अलर्ट' : 'Telegram Alerts', isExternal: true },
    { href: '/pricing', label: t('footer.pricing_plans', 'Alert Plans') },
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
            {links.map(({ href, label, isExternal }) => (
              isExternal ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
                >
                  {label}
                </a>
              ) : (
                <Link key={href} href={href} style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
                  {label}
                </Link>
              )
            ))}
          </nav>
        </div>

        {/* Bottom row: Disclaimer & Copyright */}
        <div style={{
          borderTop: '1px solid var(--outline-variant)',
          paddingTop: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          width: '100%',
          fontSize: 12,
          color: 'var(--secondary)',
        }}>
          <div style={{ maxWidth: 760, lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 6px 0' }}>
              <strong>{isMarathi ? 'अस्वीकरण: ' : 'Disclaimer: '}</strong>
              {t('footer.disclaimer_text', 'ExamUdaan.in is an independent educational portal and is not affiliated with, endorsed by, or representing any government department or recruiting commission. All information is aggregated from public gazettes and official websites for informational purposes only.')}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--secondary)' }}>
              <strong>{isMarathi ? 'सामग्री तक्रार / दुरुस्ती निवारण (Takedown Notice): ' : 'Content Takedown & Grievance Notice: '}</strong>
              {isMarathi
                ? 'जर कोणत्याही भरती मंडळाला किंवा अधिकारधारकाला या संकेतस्थळावरील सामग्रीबाबत आक्षेप असल्यास किंवा दुरुस्ती/काढून टाकण्याची विनंती असल्यास, कृपया '
                : 'If any recruiting board, organization, or copyright holder wishes to request correction or removal of any content, please contact us at '}
              <a href="mailto:grievance@examudaan.in" style={{ color: 'var(--primary-cta)', fontWeight: 600, textDecoration: 'underline' }}>
                grievance@examudaan.in
              </a>
              {isMarathi
                ? ' वर ईमेल पाठवावा. २४ ते ४८ तासांत योग्य कार्यवाही केली जाईल.'
                : ' with relevant details. All valid notices will be acted upon within 24–48 hours.'}
            </p>
          </div>
          <div className="footer-copy" style={{ margin: 0, whiteSpace: 'nowrap' }}>
            © {new Date().getFullYear()} ExamUdaan.in — {t('footer.rights', 'All rights reserved.')}
          </div>
        </div>
      </div>
    </footer>
  )
}
