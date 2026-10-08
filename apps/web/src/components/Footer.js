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
    { label: isMarathi ? 'केंद्र सरकार (UPSC, SSC, संरक्षण)' : 'Central (UPSC, SSC, Defence)', href: '/jobs?govt_level=Central' },
  ]

  const QUESTION_PAPERS_KEYS = [
    { label: isMarathi ? 'MPSC मूळ प्रश्नपत्रिका व कीज् (२०२१-२०२६)' : 'MPSC Papers & Keys (2021-2026)', href: '/mpsc-pyq' },
    { label: isMarathi ? 'सर्व अधिकृत प्रश्नपत्रिका (All PYQs)' : 'All Official Question Papers', href: '/question-papers' },
    { label: isMarathi ? 'अधिकृत उत्तरतालिका पोर्टल (Keys)' : 'Official Answer Keys Portal', href: '/answer-keys' },
    { label: isMarathi ? 'महाराष्ट्र पोलीस भरती प्रश्नपत्रिका' : 'Maharashtra Police Bharti Papers', href: '/question-papers#maharashtra-direct' },
    { label: isMarathi ? '१५ वर्षांची PYQ बँक' : '15-Year Interactive PYQ Bank', href: '/pyq' },
    { label: isMarathi ? 'SSC व रेल्वे प्रश्नपत्रिका' : 'SSC & Railway Question Papers', href: '/question-papers#central-exams' },
    { label: isMarathi ? 'TCS उत्तरतालिका रँक प्रेडिक्टर' : 'TCS Key Rank Predictor', href: '/score-calculator' },
  ]

  const PREP_STUDY = [
    { label: isMarathi ? 'दैनिक चालू घडामोडी (Current Affairs)' : 'Daily Current Affairs Digest', href: '/current-affairs' },
    { label: isMarathi ? '५ मिनिटे दैनिक क्विझ' : '5-Minute Daily Quiz', href: '/daily-quiz' },
    { label: isMarathi ? 'परीक्षा अभ्यासक्रम २०२६' : 'Exam Syllabus 2026', href: '/syllabus' },
    { label: isMarathi ? 'CBT सराव टेस्ट सिरीज' : 'CBT Mock Test Series', href: '/mock-tests' },
    { label: isMarathi ? '१० वी व १२ वी करिअर मार्गदर्शक' : '10th & 12th Career Compass', href: '/career' },
    { label: isMarathi ? 'पोलीस ग्राउंड + लेखी मेरिट' : 'Police Ground + Written Merit', href: '/police-calculator' },
    { label: isMarathi ? '१० वर्षांचे कटऑफ विश्लेषण' : '10-Year Cutoff Analyzer', href: '/cutoffs' },
  ]

  const PORTAL_HELPDESK = [
    { label: isMarathi ? 'आमच्याबद्दल (About ExamUdaan)' : 'About ExamUdaan', href: '/about' },
    { label: isMarathi ? 'संपर्क व मदत कक्ष' : 'Contact & Helpdesk', href: '/contact' },
    { label: isMarathi ? 'अभिप्राय नोंदणी (Feedback Desk)' : 'Aspirant Feedback Desk', href: '/feedback' },
    { label: isMarathi ? 'वारंवार विचारले जाणारे प्रश्न (FAQ)' : 'Frequently Asked Questions', href: '/faq' },
    { label: isMarathi ? 'टेलिग्राम जॉब अलर्ट नेटवर्क' : 'Telegram Job Alerts Network', href: '/alerts' },
    { label: isMarathi ? '७ वे वेतन आयोग पगार कॅल्क्युलेटर' : '7th CPC Salary Calculator', href: '/salary-calculator' },
    { label: isMarathi ? 'AI अभ्यास साधने (८४+ टूल्स)' : 'AI Study Tools Directory', href: '/ai-tools' },
  ]

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.footerInner}`}>

        {/* ── 5-Column Grid Layout matching Usage Priority ── */}
        <div className={styles.columnsGrid}>

          {/* Column 1: Brand & Telegram/WhatsApp Channels */}
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
                ? 'भारतातील सर्वात बुद्धिमान परीक्षा शोध व तयारी प्लॅटफॉर्म. १००% पडताळलेली अधिकृत नोटिफिकेशन्स, थेट अर्ज लिंक्स, प्रश्नपत्रिका, उत्तरतालिका व चालू घडामोडी.'
                : "India's smartest exam aggregator & prep engine. 100% verified notifications, official question papers, answer keys, current affairs, and syllabus roadmaps."}
            </p>

            <div className={styles.channelButtons}>
              {/* Primary Channel: Telegram */}
              <a
                href="https://t.me/examudaanjobs"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tgBtn}
                title="Join ExamUdaan Telegram Channel"
              >
                {/* Official Telegram Paper Plane SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
                <span>{isMarathi ? 'Telegram अलर्ट जॉइन करा (मोफत)' : 'Join Telegram Channel (Free)'}</span>
              </a>

              {/* Secondary Channel: WhatsApp */}
              <a
                href="https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waSecondaryBtn}
                title="Follow ExamUdaan on WhatsApp"
              >
                {/* WhatsApp SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19.01L7.54 18.83L4.43 19.65L5.26 16.62L5.06 16.3C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.45C16.32 14.33 15.1 13.73 14.88 13.64C14.65 13.56 14.49 13.52 14.32 13.76C14.16 14.01 13.68 14.58 13.53 14.75C13.39 14.91 13.24 14.93 12.99 14.81C12.74 14.68 11.94 14.42 11 13.58C10.26 12.92 9.77 12.11 9.63 11.86C9.48 11.61 9.61 11.48 9.74 11.35C9.85 11.24 9.99 11.06 10.12 10.92C10.24 10.77 10.28 10.67 10.36 10.51C10.45 10.34 10.41 10.2 10.34 10.07C10.28 9.95 9.79 8.74 9.58 8.25C9.38 7.77 9.18 7.83 9.03 7.82H8.56C8.4 7.82 8.13 7.88 7.9 8.13C7.67 8.38 7.03 8.98 7.03 10.2C7.03 11.42 7.92 12.6 8.04 12.76C8.17 12.92 9.79 15.42 12.27 16.49C12.86 16.74 13.32 16.9 13.67 17.01C14.26 17.2 14.8 17.17 15.23 17.11C15.71 17.04 16.7 16.51 16.91 15.93C17.11 15.36 17.11 14.87 17.05 14.76C16.99 14.66 16.82 14.58 16.57 14.45Z" />
                </svg>
                <span>{isMarathi ? 'WhatsApp चॅनेल' : 'WhatsApp Channel'}</span>
              </a>
            </div>
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

          {/* Column 3: Question Papers & Answer Keys */}
          <div>
            <h4 className={styles.colTitle}>
              {isMarathi ? 'प्रश्नपत्रिका व उत्तरतालिका' : 'PAPERS & ANSWER KEYS'}
            </h4>
            <ul className={styles.linkList}>
              {QUESTION_PAPERS_KEYS.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Preparation & Current Affairs */}
          <div>
            <h4 className={styles.colTitle}>
              {isMarathi ? 'तयारी व चालू घडामोडी' : 'PREPARATION & CA'}
            </h4>
            <ul className={styles.linkList}>
              {PREP_STUDY.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Portal & Helpdesk */}
          <div>
            <h4 className={styles.colTitle}>
              {isMarathi ? 'पोर्टल व मदत केंद्र' : 'PORTAL & HELPDESK'}
            </h4>
            <ul className={styles.linkList}>
              {PORTAL_HELPDESK.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
        {/* ── Single-Line AI & Due Diligence Advisory (* Conditions) ── */}
        <p className={styles.aiOneLiner} role="note">
          * <strong>{isMarathi ? 'महत्त्वाची सूचना (AI Advisory):' : 'Important Advisory:'}</strong>{' '}
          {isMarathi
            ? 'या पोर्टलवरील माहिती AI-साहाय्यित संकलित आहे. उमेदवारांनी अर्ज करण्यापूर्वी अधिकृत सरकारी राजपत्रावरून स्वतः पडताळणी (Due Diligence) करावी.'
            : 'Content on this portal includes AI-assisted aggregations for reference only. Candidates must exercise due diligence and verify all details with official government gazettes.'}{' '}
          <Link href="/disclaimer#ai-policy" className={styles.aiOneLinerLink}>
            {isMarathi ? 'संपूर्ण AI धोरण व अटी वाचा *' : 'Read full AI Policy & Due Diligence Terms *'}
          </Link>
        </p>

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
