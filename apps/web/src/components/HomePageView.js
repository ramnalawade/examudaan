// ============================================================
// components/HomePageView.js — ExamUdaan Homepage (Clean Redesign)
// Goal: Minimal, uncluttered — like Legalit.ai
// Sections: Hero → Stats Bar → Departments → Latest Jobs → Alerts CTA
// Everything else lives on dedicated pages (/jobs, /ai-tools, /youtube, etc.)
// ============================================================

'use client'

import Link from 'next/link'
import JobCard from './JobCard'
import { useLanguage } from '../context/LanguageContext'
import { SITE_CONFIG } from '../lib/constants'
import { formatTitle } from '../lib/formatTitle'

// ── Department categories ────────────────────────────────────
const CATEGORIES_EN = [
  { slug: 'MPSC',         label: 'MPSC',              desc: 'State Services & Group B/C',     icon: 'account_balance' },
  { slug: 'MUMBAI POLICE',label: 'Police Bharti',      desc: 'Constable, SI & Driver',         icon: 'local_police' },
  { slug: 'BMC',          label: 'BMC Mumbai',         desc: 'Engineers, Clerks & Health',     icon: 'location_city' },
  { slug: 'RRB',          label: 'Railways (RRB)',     desc: 'ALP, NTPC & Group D',            icon: 'train' },
  { slug: 'SSC',          label: 'Staff Selection',    desc: 'CGL, CHSL & MTS',               icon: 'description' },
  { slug: 'IBPS',         label: 'Banking',            desc: 'PO, Clerk & Specialist',         icon: 'account_balance_wallet' },
  { slug: 'ZP',           label: 'Zilla Parishad',     desc: 'Talathi, Gram Sevak & Arogya',  icon: 'nature_people' },
  { slug: 'TEACHING',     label: 'Teaching (TET)',     desc: 'Shikshak Bharti & Professors',  icon: 'school' },
]

const CATEGORIES_MR = [
  { slug: 'MPSC',          label: 'MPSC महाराष्ट्र',       desc: 'राज्यसेवा व गट-ब/क संयुक्त परीक्षा',   icon: 'account_balance' },
  { slug: 'MUMBAI POLICE', label: 'पोलीस भरती',            desc: 'पोलीस शिपाई, चालक व उपनिरीक्षक',       icon: 'local_police' },
  { slug: 'BMC',           label: 'BMC मुंबई',              desc: 'कनिष्ठ अभियंता, लिपिक व आरोग्य',       icon: 'location_city' },
  { slug: 'RRB',           label: 'रेल्वे भरती (RRB)',      desc: 'ALP, NTPC आणि गट ड संवर्ग',            icon: 'train' },
  { slug: 'SSC',           label: 'कर्मचारी निवड (SSC)',   desc: 'CGL, CHSL, GD व MTS परीक्षा',           icon: 'description' },
  { slug: 'IBPS',          label: 'बँक भरती',               desc: 'PO, लिपिक व विशेषज्ञ अधिकारी',         icon: 'account_balance_wallet' },
  { slug: 'ZP',            label: 'जिल्हा परिषद (ZP)',     desc: 'तलाठी, ग्रामसेवक व आरोग्य सेवक',       icon: 'nature_people' },
  { slug: 'TEACHING',      label: 'शिक्षक भरती (TET)',     desc: 'पवित्र पोर्टल व प्राध्यापक भरती',       icon: 'school' },
]

// ── Product/feature blocks (Dashboard Grid) ────────────────
const FEATURE_BLOCKS = [
  {
    icon: 'work',
    title_en: 'Government Jobs',
    title_mr: 'सरकारी नोकऱ्या',
    desc_en: '500+ live notifications from 260+ official portals. Central & state government, PSU, and autonomous bodies.',
    desc_mr: '२६०+ अधिकृत पोर्टल्सवरून ५००+ थेट भरती जाहिराती. केंद्र, राज्य सरकार व PSU.',
    href: '/jobs',
    cta_en: 'Browse Jobs',
    cta_mr: 'नोकऱ्या पहा',
    badge: 'Live',
  },
  {
    icon: 'explore',
    title_en: '10th & 12th Career Compass',
    title_mr: '१० वी व १२ वी नंतर करिअर मार्गदर्शक',
    desc_en: 'Complete roadmap for Science, Commerce, Arts & Polytechnic with salaries, entrance exams, subjects to score, and top colleges.',
    desc_mr: 'सायन्स, कॉमर्स, आर्ट्स आणि पॉलिटेक्निकसाठी पगार, प्रवेश परीक्षा, आवश्यक विषय आणि भविष्यातील संधींचे सविस्तर विश्लेषण.',
    href: '/career',
    cta_en: 'Explore 40+ Careers',
    cta_mr: '४०+ करिअर पर्याय पहा',
    badge: 'New 2026',
  },
  {
    icon: 'smart_toy',
    title_en: 'AI Tools for Exam Prep',
    title_mr: 'परीक्षेसाठी AI साधने',
    desc_en: '84+ curated tools across 8 categories — NotebookLM, Claude, Cursor, Gamma, Perplexity — each with a step-by-step guide.',
    desc_mr: 'NotebookLM, Claude, Cursor, Gamma सारखी ८४+ AI साधने — सविस्तर मार्गदर्शनासह.',
    href: '/ai-tools',
    cta_en: 'Explore 84 AI Tools',
    cta_mr: '८४ AI साधने पहा',
    badge: '84 Tools',
  },
  {
    icon: 'quiz',
    title_en: 'CBT Mock Tests',
    title_mr: 'CBT सराव मॉक टेस्ट',
    desc_en: 'Full-length computer-based practice test series with timer, instant score breakdown, and all-Maharashtra rank for Talathi, Police, MPSC & SSC.',
    desc_mr: 'तलाठी, पोलीस, MPSC आणि SSC साठी वेळ, अचूक गुण आणि महाराष्ट्र गुणवत्ता यादीसह संपूर्ण मॉक टेस्ट मालिका.',
    href: '/mock-tests',
    cta_en: 'Start Free Mock',
    cta_mr: 'मोफत टेस्ट सुरू करा',
    badge: 'Free CBT',
  },
  {
    icon: 'history_edu',
    title_en: '15-Yr Solved PYQ Bank',
    title_mr: '१५ वर्षांच्या मागील प्रश्नपत्रिका',
    desc_en: '560+ topic-wise solved previous year questions with detailed answer keys, exam trends, and subject analysis.',
    desc_mr: '५६०+ विषयवार सोडवलेले मागील प्रश्न, सविस्तर उत्तरे, आणि मागील १५ वर्षांचे परीक्षा कल विश्लेषण.',
    href: '/pyq',
    cta_en: 'Practice PYQs',
    cta_mr: 'PYQ सराव करा',
    badge: '560+ MCQs',
  },
  {
    icon: 'local_police',
    title_en: 'Police Merit Calculator',
    title_mr: 'पोलीस भरती मेरिट कॅल्क्युलेटर',
    desc_en: 'Calculate your 150-mark composite merit (1600m/800m run, 100m sprint, shot put + written) and check district cutoffs instantly.',
    desc_mr: '१५० गुणांमधील मैदानी (५०) + लेखी (१००) अचूक गुण मोजा आणि सर्व जिल्ह्यांचे अंदाजित कट-ऑफ तपासा.',
    href: '/police-calculator',
    cta_en: 'Calculate Merit',
    cta_mr: 'गुण मोजा',
    badge: '150 Marks',
  },
  {
    icon: 'score',
    title_en: 'Key Score Calculator',
    title_mr: 'रिस्पॉन्स शीट स्कोर कॅल्क्युलेटर',
    desc_en: 'Calculate raw marks and accuracy from TCS iON, MPSC & Police Bharti answer key response sheets with category cutoff prediction.',
    desc_mr: 'TCS iON, MPSC आणि पोलीस भरती रिस्पॉन्स शीटवरून अचूक गुण आणि प्रवर्गनिहाय कट-ऑफ अंदाज मिळवा.',
    href: '/score-calculator',
    cta_en: 'Check My Score',
    cta_mr: 'माझा स्कोर तपासा',
    badge: 'TCS / MPSC',
  },
  {
    icon: 'local_fire_department',
    title_en: 'Daily Streak Quiz',
    title_mr: 'दैनिक स्ट्रीक क्विझ',
    desc_en: '10 daily high-yield questions covering Current Affairs, Maharashtra GK, and Marathi Grammar in a 5-minute blitz challenge.',
    desc_mr: 'चालू घडामोडी, महाराष्ट्र सामान्य ज्ञान व मराठी व्याकरण यांवर आधारित दररोजची ५ मिनिटांची १० प्रश्नांची क्विझ.',
    href: '/daily-quiz',
    cta_en: 'Take Daily Quiz',
    cta_mr: 'आजची क्विझ सोडवा',
    badge: '5-Min Blitz',
  },
  {
    icon: 'leaderboard',
    title_en: '10-Yr Cutoff Explorer',
    title_mr: '१० वर्षांचे कट-ऑफ विश्लेषण',
    desc_en: 'Historical cutoff marks by district and caste category (Open, OBC, EWS, SEBC, SC, ST) across major Maharashtra competitive exams.',
    desc_mr: 'MPSC, पोलीस, तलाठी व ZP परीक्षांसाठी सर्व जिल्हे व प्रवर्गांमधील मागील १० वर्षांचे अधिकृत कट-ऑफ.',
    href: '/cutoffs',
    cta_en: 'Explore Cutoffs',
    cta_mr: 'कट-ऑफ पहा',
    badge: 'Trends',
  },
  {
    icon: 'menu_book',
    title_en: 'Exam Blog & Guides',
    title_mr: 'परीक्षा मार्गदर्शक व ब्लॉग',
    desc_en: 'Actionable 90-day blueprints, subject-wise booklists, and preparation strategies written by top educators.',
    desc_mr: 'परीक्षेची ९० दिवसांची अचूक रणनीती, संदर्भ पुस्तके आणि सविस्तर अभ्यासक्रम विश्लेषण.',
    href: '/blog',
    cta_en: 'Read Guides',
    cta_mr: 'मार्गदर्शन वाचा',
    badge: 'Guides',
  },
  {
    icon: 'school',
    title_en: 'AI Academy',
    title_mr: 'AI अकॅडमी',
    desc_en: 'Weekend live cohorts by a 20-year enterprise software architect. Prompt engineering, Cursor, project building — practical, not theory.',
    desc_mr: '२० वर्षांच्या तज्ञाकडून प्रॅक्टिकल AI शिक्षण. ChatGPT, Cursor, प्रोजेक्ट बिल्डिंग — प्रॅक्टिकल अनुभव.',
    href: '/ai-academy',
    cta_en: 'Join Academy',
    cta_mr: 'अकॅडमीत सामील व्हा',
    badge: 'Live Cohort',
  },
  {
    icon: 'play_circle',
    title_en: 'YouTube & Resources',
    title_mr: 'YouTube चॅनेल्स',
    desc_en: '30+ curated YouTube channels for MPSC, UPSC, Banking, SSC, Railways and GATE — filtered by exam and language.',
    desc_mr: 'MPSC, UPSC, Banking, RRB साठी ३०+ निवडक YouTube चॅनेल्स — परीक्षा व भाषेनुसार.',
    href: '/youtube',
    cta_en: 'Browse Channels',
    cta_mr: 'चॅनेल्स पहा',
    badge: '30+ Channels',
  },
]

export default function HomePageView({ jobs = [], quickUpdates = [], stats = {} }) {
  const { t, isMarathi } = useLanguage()
  const categories = isMarathi ? CATEGORIES_MR : CATEGORIES_EN

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 64 }}>

      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(234,88,12,0.05) 0%, var(--surface) 100%)',
        borderBottom: '1px solid var(--outline-variant)',
        padding: 'clamp(40px, 6vw, 72px) 20px clamp(36px, 5vw, 60px)',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#ECFDF5', color: '#065F46',
            padding: '5px 16px', borderRadius: 999,
            fontSize: 12, fontWeight: 800, letterSpacing: '0.05em',
            textTransform: 'uppercase', marginBottom: 24,
          }}>
            <span style={{
              width: 7, height: 7, background: '#22c55e',
              borderRadius: '50%', display: 'inline-block',
              boxShadow: '0 0 6px #22c55e',
            }} />
            {isMarathi ? 'थेट २४x७ — सरकारी जाहिराती' : 'Live 24×7 — Official Govt Notifications'}
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: 'clamp(30px, 5vw, 52px)',
            fontWeight: 800,
            color: 'var(--on-surface)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 18px',
          }}>
            {isMarathi ? (
              <>
                महाराष्ट्र <span style={{ color: 'var(--primary)' }}>&</span> भारतातील सर्व<br />
                सरकारी भरती — <span style={{ color: 'var(--primary)' }}>एकाच ठिकाणी</span>
              </>
            ) : (
              <>
                All India Government Jobs<br />
                <span style={{ color: 'var(--primary)' }}>— One Trusted Source</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: 'var(--secondary)',
            lineHeight: 1.65,
            margin: '0 auto 32px',
            maxWidth: 620,
          }}>
            {isMarathi
              ? 'MPSC, UPSC, SSC, RRB, Banking, ZP, पोलीस — सर्व अधिकृत पोर्टल्सवरून थेट PDF नोटिफिकेशन्स. कोणतीही भरती चुकणार नाही.'
              : 'MPSC, UPSC, SSC, RRB, Banking, ZP, Police — direct PDF notifications from 260+ official portals. Never miss a recruitment again.'}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/jobs"
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                padding: '13px 28px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700, fontSize: 15,
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(234,88,12,0.28)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
              {isMarathi ? 'नोकऱ्या शोधा' : 'Browse Jobs'}
            </Link>
            <a
              href={SITE_CONFIG?.social?.whatsappChannel || 'https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#22c55e',
                color: '#ffffff',
                padding: '13px 24px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700, fontSize: 15,
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(34,197,94,0.28)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chat</span>
              {isMarathi ? 'WhatsApp अलर्ट' : 'WhatsApp Alerts'}
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. Stats Bar ────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--outline-variant)', background: 'var(--surface-container-lowest)' }}>
        <div className="container" style={{
          maxWidth: 1100, margin: '0 auto', padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 0,
        }}>
          {[
            { value: stats.total_jobs  || '740+',        label: isMarathi ? 'सक्रिय भरती' : 'Active Jobs',         icon: 'work' },
            { value: stats.total_vacancies || '85,000+', label: isMarathi ? 'एकूण जागा' : 'Total Vacancies',      icon: 'groups' },
            { value: stats.total_boards || '42+',        label: isMarathi ? 'सरकारी पोर्टल' : 'Govt Portals',       icon: 'travel_explore' },
            { value: stats.total_ai_tools ? `${stats.total_ai_tools} AI Tools` : '84 AI Tools', label: isMarathi ? 'एआय अभ्यास साधने' : 'AI Study Tools', icon: 'smart_toy' },
          ].map((s, i, arr) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 20px',
                borderRight: i < arr.length - 1 ? '1px solid var(--outline-variant)' : 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--primary)', flexShrink: 0 }}>
                {s.icon}
              </span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--on-surface)', lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1150, margin: '0 auto', padding: '44px 20px 0' }}>

        {/* ── 3. Quick Update Strip (Results / Admit Cards) ── */}
        {quickUpdates.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 16, gap: 12, flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 800, color: 'var(--on-surface)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--primary)' }}>campaign</span>
                  {isMarathi ? 'ताज्या अपडेट्स' : 'Latest Updates'}
                </div>
                <p style={{ fontSize: 13, color: 'var(--secondary)', margin: '2px 0 0' }}>
                  {isMarathi ? 'नुकतेच जाहीर झालेले निकाल, प्रवेशपत्रे व उत्तरतालिका' : 'Freshly announced results, hall tickets & answer keys'}
                </p>
              </div>
              <Link href="/results" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                {isMarathi ? 'सर्व निकाल पहा →' : 'View all results →'}
              </Link>
            </div>

            {/* Grid of Update Cards matching Browse by Department aesthetic */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
              {quickUpdates.slice(0, 4).map(item => {
                const href = item.notification_type === 'result'
                  ? `/results/${item.slug || item.id}`
                  : item.notification_type === 'admit_card'
                  ? `/admit-cards/${item.slug || item.id}`
                  : `/answer-keys/${item.slug || item.id}`

                const typeConfig = item.notification_type === 'result'
                  ? { label: isMarathi ? 'निकाल' : 'RESULT', icon: 'emoji_events', color: '#16A34A', bg: '#F0FDF4' }
                  : item.notification_type === 'admit_card'
                  ? { label: isMarathi ? 'प्रवेशपत्र' : 'ADMIT CARD', icon: 'badge', color: '#7C3AED', bg: '#F5F3FF' }
                  : { label: isMarathi ? 'उत्तरतालिका' : 'ANSWER KEY', icon: 'fact_check', color: '#2563EB', bg: '#EFF6FF' }

                const rawTitle = (isMarathi && item.title_mr) ? item.title_mr : item.title
                const displayTitle = formatTitle(rawTitle)

                return (
                  <Link
                    key={item.id}
                    href={href}
                    className="dept-card"
                    style={{
                      background: 'var(--surface-container-lowest)',
                      border: '1px solid var(--outline-variant)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 16px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: typeConfig.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span className="material-symbols-outlined" style={{ color: typeConfig.color, fontSize: 22 }}>
                        {typeConfig.icon}
                      </span>
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: typeConfig.bg,
                          color: typeConfig.color,
                          whiteSpace: 'nowrap',
                          letterSpacing: '0.04em',
                        }}>
                          {typeConfig.label}
                        </span>
                        {item.org_acronym && (
                          <span style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: 'var(--surface-container-high)',
                            color: 'var(--secondary)',
                            whiteSpace: 'nowrap',
                          }}>
                            {item.org_acronym}
                          </span>
                        )}
                      </div>

                      <div style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--on-surface)',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {displayTitle}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 8,
                        fontSize: 11,
                        color: 'var(--secondary)',
                      }}>
                        <span>{item.published_at ? new Date(item.published_at).toLocaleDateString(isMarathi ? 'mr-IN' : 'en-IN', { day: '2-digit', month: 'short' }) : 'Live'}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                          {isMarathi ? 'पहा' : 'Check'} →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── 4. Browse by Department ─────────────────────── */}
        <section style={{ marginBottom: 52 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--on-surface)', margin: '0 0 4px' }}>
                {isMarathi ? 'विभागानुसार शोधा' : 'Browse by Department'}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--secondary)', margin: 0 }}>
                {isMarathi ? 'तुमच्या आवडीच्या विभागावर क्लिक करा' : 'Click any sector to see live openings'}
              </p>
            </div>
            <Link href="/jobs" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
              {isMarathi ? 'सर्व पहा →' : 'View all →'}
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/jobs?org=${encodeURIComponent(cat.slug)}`}
                style={{
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--primary-fixed)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{cat.icon}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>{cat.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 5. Latest Job Notifications ──────────────────── */}
        <section style={{ marginBottom: 52 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--on-surface)', margin: '0 0 4px' }}>
                {isMarathi ? 'ताज्या भरती जाहिराती' : 'Latest Recruitment Notifications'}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--secondary)', margin: 0 }}>
                {isMarathi ? 'अधिकृत सरकारी पोर्टल्सवरून थेट — दररोज अपडेट' : 'Direct from official govt portals — updated daily'}
              </p>
            </div>
            <Link href="/jobs" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
              {isMarathi ? 'सर्व नोकऱ्या →' : 'All jobs →'}
            </Link>
          </div>

          {jobs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
              {jobs.slice(0, 6).map(job => (
                <JobCard key={job.slug || job.id} job={job} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '48px 20px',
              background: 'var(--surface-container-lowest)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--outline-variant)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--secondary)', display: 'block', marginBottom: 8 }}>inbox</span>
              <p style={{ fontSize: 14, color: 'var(--secondary)', margin: 0 }}>
                {isMarathi ? 'नोकऱ्या लोड होत आहेत...' : 'Loading jobs...'}
              </p>
            </div>
          )}

          {jobs.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link href="/jobs" className="btn-outline" style={{
                padding: '11px 28px', borderRadius: 'var(--radius-md)',
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                {isMarathi ? 'सर्व नोकऱ्या पहा' : 'View All Jobs'}
              </Link>
            </div>
          )}
        </section>

        {/* ── 6. Feature / Product Blocks ────────────────── */}
        <section style={{ marginBottom: 52 }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--on-surface)', margin: '0 0 4px' }}>
              {isMarathi ? 'ExamUdaan वर काय आहे?' : 'Everything on ExamUdaan'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--secondary)', margin: 0 }}>
              {isMarathi ? 'नोकऱ्यांपासून AI साधनांपर्यंत — सर्व एकाच ठिकाणी' : 'Jobs, AI tools, YouTube channels, and training — all in one place'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURE_BLOCKS.map((block, i) => (
              <Link
                key={i}
                href={block.href}
                style={{
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 20px',
                  textDecoration: 'none',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'var(--primary-fixed)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{block.icon}</span>
                  </div>
                  {block.badge && (
                    <span style={{
                      fontSize: 11, fontWeight: 800,
                      background: 'var(--primary-fixed)', color: 'var(--primary)',
                      padding: '3px 8px', borderRadius: 999,
                    }}>
                      {block.badge}
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)', margin: '0 0 6px' }}>
                    {isMarathi ? block.title_mr : block.title_en}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--secondary)', margin: 0, lineHeight: 1.55 }}>
                    {isMarathi ? block.desc_mr : block.desc_en}
                  </p>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
                  {isMarathi ? block.cta_mr : block.cta_en}
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 7. Alerts / WhatsApp CTA (dark strip) ───────── */}
        <section style={{
          background: 'linear-gradient(135deg, #1b1c1b 0%, #292524 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(28px,4vw,44px) clamp(24px,4vw,40px)',
          marginBottom: 48,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>

            {/* Left: copy */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(34,197,94,0.18)', color: '#4ade80',
                padding: '4px 12px', borderRadius: 999,
                fontSize: 12, fontWeight: 700, marginBottom: 14,
              }}>
                <span className="material-symbols-outlined fill" style={{ fontSize: 15 }}>chat</span>
                {isMarathi ? 'WhatsApp / Telegram' : 'Instant Job Alerts'}
              </div>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, marginBottom: 12, lineHeight: 1.25 }}>
                {isMarathi
                  ? 'नवीन भरती जाहीर होताच तुमच्या मोबाईलवर अलर्ट मिळवा'
                  : 'Get notified the moment a new govt job is announced'}
              </h2>
              <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.6, marginBottom: 20 }}>
                {isMarathi
                  ? 'WhatsApp Channel, Telegram, किंवा ईमेल अलर्ट — तुमच्या सोयीनुसार. कोणतीही भरती चुकणार नाही.'
                  : 'WhatsApp Channel, Telegram, or Email alerts — your choice. Custom filters by state, category, and education level.'}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href={SITE_CONFIG?.social?.whatsappChannel || 'https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#22c55e', color: '#fff',
                    padding: '11px 22px', borderRadius: 'var(--radius-md)',
                    fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                  {isMarathi ? 'WhatsApp Channel' : 'Join WhatsApp'}
                </a>
                <a
                  href={SITE_CONFIG?.social?.telegramChannel || 'https://t.me/examudaan'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#0284c7', color: '#fff',
                    padding: '11px 20px', borderRadius: 'var(--radius-md)',
                    fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                  Telegram
                </a>
                <Link
                  href="/pricing"
                  style={{
                    color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
                    padding: '11px 18px', borderRadius: 'var(--radius-md)',
                    fontWeight: 600, fontSize: 13, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}
                >
                  {isMarathi ? 'कस्टम अलर्ट प्लान' : 'Custom Alert Plans'}
                </Link>
              </div>
            </div>

            {/* Right: simulated WA message */}
            <div style={{
              background: '#075e54', borderRadius: 'var(--radius-md)',
              padding: 16, maxWidth: 360, margin: '0 auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 10, marginBottom: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#25d366' }}>verified</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>ExamUdaan Alerts ⚡</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{isMarathi ? 'अधिकृत WhatsApp चॅनेल' : 'Official WhatsApp Channel'}</div>
                </div>
              </div>
              <div style={{ background: '#fff', color: '#1e293b', borderRadius: 8, padding: 12, fontSize: 13, lineHeight: 1.55 }}>
                <div style={{ fontWeight: 700, color: '#ea580c', marginBottom: 4 }}>
                  {isMarathi ? '🚨 नवीन: BMC भरती 2026 जाहीर!' : '🚨 NEW: BMC Recruitment 2026!'}
                </div>
                <div>💼 <strong>{isMarathi ? 'पद:' : 'Post:'}</strong> {isMarathi ? 'कनिष्ठ अभियंता (स्थापत्य)' : 'Junior Engineer (Civil)'}</div>
                <div>👥 <strong>{isMarathi ? 'जागा:' : 'Vacancies:'}</strong> {isMarathi ? '६९० पदे' : '690 Posts'}</div>
                <div>📅 <strong>{isMarathi ? 'अंतिम दिनांक:' : 'Last Date:'}</strong> 28-Sep-2026</div>
                <div style={{ marginTop: 8, fontSize: 12, color: '#2563eb' }}>
                  {isMarathi ? '👉 PDF डाऊनलोड व ऑनलाईन अर्जासाठी येथे क्लिक करा' : '👉 Tap to download PDF & Apply Online'}
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
