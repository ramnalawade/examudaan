// ============================================================
// Footer.js — Precision 5-Column Grouped Footer
// ExamUdaan.in | Matching Mockup (Screenshot 2)
// ============================================================

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '../context/LanguageContext'
import styles from './footer.module.css'

export default function Footer() {
  const { t, isMarathi } = useLanguage()

  const TOP_RECRUITMENTS = [
    { label: isMarathi ? 'MPSC राज्यसेवा २०२६' : 'MPSC State Services 2026', href: '/jobs?org=MPSC' },
    { label: isMarathi ? 'महाराष्ट्र पोलीस भरती' : 'Maharashtra Police Bharti', href: '/jobs?org=MUMBAI%20POLICE' },
    { label: isMarathi ? 'रेल्वे भरती (RRB NTPC)' : 'Railway RRB NTPC & Group D', href: '/jobs?org=RRB' },
    { label: isMarathi ? 'कर्मचारी निवड (SSC CGL & CHSL)' : 'SSC CGL & CHSL Combined', href: '/jobs?org=SSC' },
    { label: isMarathi ? 'बँक ऑफ बडोदा SO व IBPS' : 'Bank of Baroda SO Specialist', href: '/jobs?org=IBPS,SBI' },
    { label: isMarathi ? 'थेट मुलाखत भरती (Walk-in)' : 'Walk-in Interview Openings', href: '/walk-in-interviews' },
    { label: isMarathi ? 'CSIR व संशोधन भरती' : 'CSIR & Research Recruitment', href: '/jobs?q=CSIR' },
  ]

  const DEPARTMENTS = [
    { label: isMarathi ? 'महाराष्ट्र सरकारी नोकऱ्या (महाभरती)' : 'Maharashtra Govt Jobs (MahaBharti)', href: '/jobs?state=maharashtra' },
    { label: isMarathi ? 'उत्तर प्रदेश व MP पोलीस भरती' : 'Uttar Pradesh & MP Police / Forest', href: '/jobs?state=uttar%20pradesh' },
    { label: isMarathi ? 'केंद्र सरकार (UPSC, SSC, संरक्षण)' : 'Central (UPSC, SSC, Defence)', href: '/jobs?govt_level=Central' },
    { label: isMarathi ? 'कृषी, जिल्हा परिषद व तांत्रिक' : 'Agriculture, ZP & Tech Exams', href: '/jobs?category=engineering' },
    { label: isMarathi ? 'अभियांत्रिकी व PSU (GATE/SSC)' : 'Engineering & PSU (GATE/SSC)', href: '/jobs?category=engineering' },
    { label: isMarathi ? 'नागपूर व विदर्भ जिल्हा भरती' : 'Nagpur & Vidarbha District Bharti', href: '/maharashtra/nagpur' },
    { label: isMarathi ? 'मुंबई व MMR शासकीय भरती' : 'Mumbai & MMR Govt Recruitment', href: '/maharashtra/mumbai' },
  ]

  const PREP_SUITE = [
    { label: isMarathi ? 'AI अभ्यास वेळापत्रक व रूटीन' : 'AI Study Planner & Routine', href: '/study-planner' },
    { label: isMarathi ? 'TCS उत्तरतालिका रँक प्रेडिक्टर' : 'TCS Answer Key Response Predictor', href: '/score-calculator' },
    { label: isMarathi ? 'पोलीस ग्राउंड + लेखी गुण मॅट्रिक्स' : 'Police Ground + Written Score', href: '/police-calculator' },
    { label: isMarathi ? '७ वे वेतन आयोग इन-हँड पगार' : 'In-Hand Salary Calculator', href: '/salary-calculator' },
    { label: isMarathi ? '१० वर्षांचे प्रवर्गनिहाय कटऑफ' : '10-Year Cutoff Analyzers', href: '/score-calculator' },
    { label: isMarathi ? 'CBT सराव टेस्ट सिरीज व PYQs' : 'CBT Mock Test Series & PYQs', href: '/mock-tests' },
    { label: isMarathi ? '१० वी व १२ वी करिअर मार्गदर्शक' : '10th & 12th Career Compass', href: '/career' },
  ]

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.footerInner}`}>

        {/* ── 5-Column Grid Layout matching Screenshot 2 ── */}
        <div className={styles.columnsGrid}>

          {/* Column 1: Brand & WhatsApp Community */}
          <div className={styles.brandCol}>
            <Link href="/" aria-label="ExamUdaan Home">
              <Image
                src="/logo-light.svg"
                alt="ExamUdaan.in"
                width={150}
                height={38}
                style={{ height: 38, width: 'auto', display: 'block' }}
              />
            </Link>
            <p className={styles.brandDesc}>
              {isMarathi
                ? 'भारतातील सर्वात बुद्धिमान परीक्षा शोध व तयारी प्लॅटफॉर्म. १००% पडताळलेली अधिकृत नोटिफिकेशन्स, थेट अर्ज लिंक्स, मेरिट ट्रॅकर्स व डायनॅमिक सिलॅबस.'
                : "India's smartest exam aggregator & prep engine. 100% verified notifications, direct official application links, algorithmic merit trackers, and dynamic syllabus roadmaps."}
            </p>
            <a
              href="https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waBtn}
            >
              {/* Official WhatsApp SVG Icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19.01L7.54 18.83L4.43 19.65L5.26 16.62L5.06 16.3C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.45C16.32 14.33 15.1 13.73 14.88 13.64C14.65 13.56 14.49 13.52 14.32 13.76C14.16 14.01 13.68 14.58 13.53 14.75C13.39 14.91 13.24 14.93 12.99 14.81C12.74 14.68 11.94 14.42 11 13.58C10.26 12.92 9.77 12.11 9.63 11.86C9.48 11.61 9.61 11.48 9.74 11.35C9.85 11.24 9.99 11.06 10.12 10.92C10.24 10.77 10.28 10.67 10.36 10.51C10.45 10.34 10.41 10.2 10.34 10.07C10.28 9.95 9.79 8.74 9.58 8.25C9.38 7.77 9.18 7.83 9.03 7.82H8.56C8.4 7.82 8.13 7.88 7.9 8.13C7.67 8.38 7.03 8.98 7.03 10.2C7.03 11.42 7.92 12.6 8.04 12.76C8.17 12.92 9.79 15.42 12.27 16.49C12.86 16.74 13.32 16.9 13.67 17.01C14.26 17.2 14.8 17.17 15.23 17.11C15.71 17.04 16.7 16.51 16.91 15.93C17.11 15.36 17.11 14.87 17.05 14.76C16.99 14.66 16.82 14.58 16.57 14.45Z"/>
              </svg>
              <span>{isMarathi ? 'WhatsApp चॅनेल जॉइन करा' : 'Join WhatsApp Channel'}</span>
            </a>
          </div>

          {/* Column 2: Top Recruitments */}
          <div>
            <h4 className={styles.colTitle}>
              {isMarathi ? 'प्रमुख भरती जाहिराती' : 'TOP RECRUITMENTS'}
            </h4>
            <ul className={styles.linkList}>
              {TOP_RECRUITMENTS.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: State & Govt Departments */}
          <div>
            <h4 className={styles.colTitle}>
              {isMarathi ? 'राज्य व सरकारी विभाग' : 'STATE & GOVT DEPARTMENTS'}
            </h4>
            <ul className={styles.linkList}>
              {DEPARTMENTS.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Preparation Suite & Tools */}
          <div>
            <h4 className={styles.colTitle}>
              {isMarathi ? 'तयारी साधने व टूल्स' : 'PREPARATION SUITE & TOOLS'}
            </h4>
            <ul className={styles.linkList}>
              {PREP_SUITE.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Mobile Apps & Newsletter */}
          <div>
            <h4 className={styles.colTitle}>
              {isMarathi ? 'मोबाईल अ‍ॅप व अपडेट्स' : 'MOBILE APPS & NEWSLETTER'}
            </h4>
            <p className={styles.appText}>
              {isMarathi
                ? 'तुमच्या मोबाईलवर थेट परीक्षा अपडेट्स. दैनिक क्विझ व चालू घडामोडी एका टचवर.'
                : 'Instant alerts on your phone. Daily quiz & current affairs in one touch.'}
            </p>

            <div className={styles.appButtons}>
              <a
                href="https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.appStoreBtn}
                aria-label="Download from Google Play Store"
              >
                {/* Official Google Play Multicolor SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M3.6 1.7C3.2 2.1 3 2.7 3 3.5V20.5C3 21.3 3.2 21.9 3.6 22.3L3.7 22.4L13.4 12.7V12.3L3.7 1.6L3.6 1.7Z" fill="#00C1A6"/>
                  <path d="M16.6 15.9L13.4 12.7V12.3L16.6 9.1L16.7 9.2L20.5 11.3C21.6 11.9 21.6 12.9 20.5 13.5L16.7 15.8L16.6 15.9Z" fill="#FFC400"/>
                  <path d="M16.7 15.9L13.4 12.5L3.6 22.3C4 22.7 4.7 22.8 5.6 22.3L16.7 15.9Z" fill="#FF3A44"/>
                  <path d="M16.7 9.1L5.6 2.7C4.7 2.2 4 2.3 3.6 2.7L13.4 12.5L16.7 9.1Z" fill="#00E676"/>
                </svg>
                <span className={styles.storeBtnText}>Google Play Store</span>
              </a>

              <a
                href="https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.appStoreBtn}
                aria-label="Download from Apple App Store"
              >
                {/* Official Apple Logo SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0F172A" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.74 1.01.08 2.03-.49 2.65-1.22z"/>
                </svg>
                <span className={styles.storeBtnText}>Apple App Store</span>
              </a>
            </div>

            <div className={styles.quickNavRow}>
              <Link href="/about" className={styles.quickNavLink}>About Us</Link>
              <span className={styles.dot}>•</span>
              <Link href="/contact" className={styles.quickNavLink}>Contact</Link>
              <span className={styles.dot}>•</span>
              <Link href="/feedback" className={styles.quickNavLink}>Feedback Desk</Link>
              <span className={styles.dot}>•</span>
              <Link href="/faq" className={styles.quickNavLink}>FAQ</Link>
            </div>
          </div>

        </div>

        {/* ── Bottom Row: Non-Affiliation Disclaimer & Legal Links ── */}
        <div className={styles.bottomStrip}>
          <p className={styles.disclaimerText}>
            © {new Date().getFullYear()} ExamUdaan. All rights reserved. Disclaimer: ExamUdaan is an independent exam discovery and preparation portal not affiliated with any government entity. Information sourced from official public notifications.
          </p>

          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <span className={styles.sep}>•</span>
            <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
            <span className={styles.sep}>•</span>
            <Link href="/disclaimer" className={styles.legalLink}>Disclaimer</Link>
            <span className={styles.sep}>•</span>
            <Link href="/contact" className={styles.legalLink}>Contact Us</Link>
            <span className={styles.sep}>•</span>
            <Link href="/sitemap.xml" className={styles.legalLink}>Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
