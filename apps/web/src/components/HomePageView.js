// ============================================================
// components/HomePageView.js — Client-side Interactive Homepage View
// ExamUdaan.in | Full bilingual support (English <-> Marathi)
// ============================================================

'use client'

import Link from 'next/link'
import JobCard from './JobCard'
import AiMatcher from './AiMatcher'
import { useLanguage } from '../context/LanguageContext'

const MR_TYPE_LABELS = {
  recruitment: 'भरती',
  result:      'निकाल',
  admit_card:  'प्रवेशपत्र',
  answer_key:  'उत्तरतालिका',
  syllabus:    'अभ्यासक्रम',
  correction:  'दुरुस्ती',
  other:       'सूचना',
}

const CATEGORIES_EN = [
  { slug: 'MPSC', label: 'MPSC', desc: 'State Services & Group B/C', icon: 'account_balance' },
  { slug: 'MUMBAI POLICE', label: 'Police Bharti', desc: 'Constable, SI & Driver', icon: 'local_police' },
  { slug: 'BMC', label: 'BMC Mumbai', desc: 'Engineers, Clerks & Health', icon: 'location_city' },
  { slug: 'RRB', label: 'Railways (RRB)', desc: 'ALP, NTPC & Group D', icon: 'train' },
  { slug: 'SSC', label: 'Staff Selection', desc: 'CGL, CHSL & MTS', icon: 'description' },
  { slug: 'IBPS', label: 'Banking & Insurance', desc: 'PO, Clerk & Specialist', icon: 'account_balance_wallet' },
  { slug: 'ZP', label: 'Zilla Parishad', desc: 'Talathi, Gram Sevak & Arogya', icon: 'nature_people' },
  { slug: 'TEACHING', label: 'Teaching (TET)', desc: 'Shikshak Bharti & Professors', icon: 'school' },
]

const CATEGORIES_MR = [
  { slug: 'MPSC', label: 'MPSC महाराष्ट्र', desc: 'राज्यसेवा व गट-ब/क संयुक्त परीक्षा', icon: 'account_balance' },
  { slug: 'MUMBAI POLICE', label: 'पोलीस भरती', desc: 'पोलीस शिपाई, चालक व उपनिरीक्षक', icon: 'local_police' },
  { slug: 'BMC', label: 'BMC मुंबई', desc: 'कनिष्ठ अभियंता, लिपिक व आरोग्य', icon: 'location_city' },
  { slug: 'RRB', label: 'रेल्वे भरती (RRB)', desc: 'ALP, NTPC आणि गट ड संवर्ग', icon: 'train' },
  { slug: 'SSC', label: 'कर्मचारी निवड (SSC)', desc: 'CGL, CHSL, GD व MTS परीक्षा', icon: 'description' },
  { slug: 'IBPS', label: 'बँक व विमा भरती', desc: 'PO, लिपिक व विशेषज्ञ अधिकारी', icon: 'account_balance_wallet' },
  { slug: 'ZP', label: 'जिल्हा परिषद (ZP)', desc: 'तलाठी, ग्रामसेवक व आरोग्य सेवक', icon: 'nature_people' },
  { slug: 'TEACHING', label: 'शिक्षक भरती (TET)', desc: 'पवित्र पोर्टल व प्राध्यापक भरती', icon: 'school' },
]

export default function HomePageView({ jobs = [], walkIns = [], quickUpdates = [], stats = {} }) {
  const { lang, t, isMarathi } = useLanguage()

  const categories = isMarathi ? CATEGORIES_MR : CATEGORIES_EN

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 64 }}>
      {/* ── 1. Live Ticker / Real-time Pulse Banner ── */}
      <div style={{
        background: 'var(--surface-container-low)',
        borderBottom: '1px solid var(--outline-variant)',
        padding: '8px 16px',
        fontSize: 13,
      }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--on-surface-variant)' }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
              boxShadow: '0 0 8px #22c55e',
            }} />
            <strong style={{ color: 'var(--on-surface)' }}>
              {isMarathi ? 'थेट २४x७:' : 'LIVE 24x7:'}
            </strong>
            <span>{t('hero.live_monitored')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/pricing" style={{ color: 'var(--primary-cta)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chat</span>
              {t('hero.btn_whatsapp')}
            </Link>
            <span style={{ color: 'var(--outline-variant)' }}>|</span>
            <Link href="/feedback" style={{ color: 'var(--secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>feedback</span>
              {t('nav.suggest_exam')}
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 0' }}>
        {/* ── 2. Hero Section: Left Copy & CTAs + Right AI Matcher ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 36,
          alignItems: 'center',
          marginBottom: 48,
        }}>
          {/* Left Column */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--primary-fixed)',
              color: 'var(--on-primary-fixed)',
              padding: '5px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              <span className="material-symbols-outlined fill" style={{ fontSize: 16 }}>auto_awesome</span>
              {t('hero.badge')}
            </div>

            <h1 style={{
              fontSize: 'clamp(30px, 4vw, 46px)',
              fontWeight: 800,
              color: 'var(--on-surface)',
              lineHeight: 1.18,
              marginBottom: 16,
            }}>
              {t('hero.title_pre')}
              <span style={{ color: 'var(--primary-cta)' }}>
                {t('hero.title_hl')}
              </span>
            </h1>

            <p style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: 'var(--on-surface-variant)',
              marginBottom: 24,
            }}>
              {t('hero.desc')}
            </p>

            {/* Quick Proof Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              {[
                { icon: 'verified', label: t('hero.pill_pdf') },
                { icon: 'bolt', label: t('hero.pill_speed') },
                { icon: 'block', label: t('hero.pill_ads') },
              ].map((badge, idx) => (
                <div key={idx} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--on-surface)',
                }}>
                  <span className="material-symbols-outlined fill" style={{ fontSize: 16, color: 'var(--tertiary)' }}>
                    {badge.icon}
                  </span>
                  {badge.label}
                </div>
              ))}
            </div>

            {/* Direct Action Buttons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                href="/jobs"
                style={{
                  background: 'var(--primary-cta)',
                  color: '#ffffff',
                  padding: '13px 26px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
                {t('hero.btn_browse')}
              </Link>
              <Link
                href="/pricing"
                style={{
                  background: 'var(--surface-container-lowest)',
                  color: 'var(--primary)',
                  border: '1.5px solid var(--primary)',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chat</span>
                {t('hero.btn_whatsapp')}
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive AI Matcher */}
          <div>
            <AiMatcher />
          </div>
        </section>

        {/* ── 3. Quick Update Pills (Results / Admit Cards) ── */}
        {quickUpdates.length > 0 && (
          <section style={{
            background: 'var(--surface-container-lowest)',
            border: '1px solid var(--outline-variant)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: 44,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>
                  campaign
                </span>
                {t('hero.recent_updates')}
              </div>
              <Link href="/results" style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-cta)', textDecoration: 'none' }}>
                {t('hero.view_all_results')}
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
              {quickUpdates.map((item) => {
                const targetUrl = item.notification_type === 'result'
                  ? `/results/${item.slug}`
                  : item.notification_type === 'admit_card'
                  ? `/admit-cards/${item.slug}`
                  : `/answer-keys/${item.slug}`

                const displayTitle = isMarathi && item.title_mr ? item.title_mr : item.title
                const badgeText = isMarathi
                  ? (MR_TYPE_LABELS[item.notification_type] || item.notification_type)
                  : item.notification_type.replace('_', ' ')

                return (
                  <Link
                    key={item.id}
                    href={targetUrl}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      background: 'var(--surface)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      border: '1px solid var(--outline-variant)',
                      transition: 'background 0.15s',
                    }}
                  >
                    <span style={{
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: item.notification_type === 'result' ? '#ecfdf5' : '#eff6ff',
                      color: item.notification_type === 'result' ? '#059669' : '#2563eb',
                    }}>
                      {badgeText}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {displayTitle}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── 4. Browse by Top Sectors & Commissions ── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>
                {t('home.departments_title')}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--secondary)', margin: '4px 0 0' }}>
                {t('home.departments_sub')}
              </p>
            </div>
            <Link href="/jobs" style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-cta)', textDecoration: 'none' }}>
              {t('home.view_all_depts')}
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 14,
          }}>
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/jobs?org=${encodeURIComponent(cat.slug)}`}
                style={{
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 18px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-fixed)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{cat.icon}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)' }}>{cat.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>{cat.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 5. Urgent Walk-in Interviews Spotlight ── */}
        {walkIns.length > 0 && (
          <section style={{
            marginBottom: 48,
            background: 'linear-gradient(180deg, rgba(234, 88, 12, 0.05) 0%, var(--surface-container-lowest) 100%)',
            border: '1.5px solid var(--primary-fixed-dim)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase',
                  }}>
                    {t('home.walkin_urgent_badge')}
                  </span>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>
                    {t('home.walkin_headline')}
                  </h3>
                </div>
                <p style={{ fontSize: 13, color: 'var(--secondary)', margin: '4px 0 0' }}>
                  {t('home.walkin_subhead')}
                </p>
              </div>
              <Link href="/jobs" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-cta)', textDecoration: 'none' }}>
                {t('home.all_walkins_btn')}
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {walkIns.map((item) => {
                const displayTitle = isMarathi && item.title_mr ? item.title_mr : item.title
                const displayOrg = isMarathi && item.name_mr ? item.name_mr : (item.org_acronym || item.org_name)
                const vacanciesText = item.total_vacancies
                  ? `${item.total_vacancies} ${t('card.vacancies')}`
                  : (isMarathi ? 'नियमानुसार' : 'As per norms')

                return (
                  <div key={item.id} style={{
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-md)',
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{displayOrg}</span>
                      <span style={{ fontSize: 11, color: 'var(--secondary)' }}>
                        {t('home.vacancies_label')} <strong>{vacanciesText}</strong>
                      </span>
                    </div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)', margin: 0, lineHeight: 1.4 }}>
                      {displayTitle}
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 8, borderTop: '1px dashed var(--outline-variant)' }}>
                      <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_month</span>
                        {item.exam_date
                          ? `${isMarathi ? 'मुलाखत दिनांक: ' : 'Walk-in: '}${new Date(item.exam_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
                          : (isMarathi ? 'थेट मुलाखत (जाहिरात पहा)' : 'Walk-in (See PDF)')}
                      </span>
                      <Link
                        href={`/jobs/${item.slug}`}
                        style={{
                          background: 'var(--surface-container-high)',
                          color: 'var(--on-surface)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        {t('home.details_btn')}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── 6. Latest Notifications Grid ── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>
                {t('home.latest_verified')}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--secondary)', margin: '4px 0 0' }}>
                {t('home.latest_verified_sub')}
              </p>
            </div>
            <Link href="/jobs" style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-cta)', textDecoration: 'none' }}>
              {t('hero.view_all_jobs')}
            </Link>
          </div>

          {jobs.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
            }}>
              {jobs.map(job => (
                <JobCard key={job.slug || job.id} job={job} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '48px 20px',
              background: 'var(--surface-container-lowest)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--outline-variant)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 44, color: 'var(--secondary)', marginBottom: 8 }}>
                inbox
              </span>
              <p style={{ fontSize: 15, color: 'var(--secondary)', margin: 0 }}>
                {t('home.no_jobs_found')}
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link
              href="/jobs"
              className="btn-outline"
              style={{
                padding: '12px 32px',
                borderRadius: 'var(--radius-md)',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              {t('home.explore_all_maharashtra')}
            </Link>
          </div>
        </section>

        {/* ── 7. How AI Matching Works (Infographic Section) ── */}
        <section style={{
          background: 'var(--surface-container-low)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--outline-variant)',
          padding: '36px 28px',
          marginBottom: 48,
        }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 32px' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary-cta)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t('home.how_it_works_tag')}
            </span>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--on-surface)', marginTop: 6, marginBottom: 8 }}>
              {t('home.how_it_works_title')}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--secondary)' }}>
              {t('home.how_it_works_desc')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              {
                step: '01',
                icon: 'travel_explore',
                title: t('home.step1_title'),
                desc: t('home.step1_desc'),
              },
              {
                step: '02',
                icon: 'auto_awesome',
                title: t('home.step2_title'),
                desc: t('home.step2_desc'),
              },
              {
                step: '03',
                icon: 'send',
                title: t('home.step3_title'),
                desc: t('home.step3_desc'),
              },
            ].map((st, i) => (
              <div key={i} style={{
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 'var(--radius-md)',
                padding: 24,
                position: 'relative',
              }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: 'var(--primary)',
                  background: 'var(--primary-fixed)',
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 12,
                }}>
                  {isMarathi ? `पायरी ${i + 1}` : `STEP ${st.step}`}
                </div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-container-high)',
                  color: 'var(--primary-cta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{st.icon}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 6 }}>{st.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.6, margin: 0 }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. WhatsApp Promo Spotlight Card with Mockup ── */}
        <section style={{
          background: 'linear-gradient(135deg, #1b1c1b 0%, #292524 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px',
          marginBottom: 48,
          boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#4ade80',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 14,
              }}>
                <span className="material-symbols-outlined fill" style={{ fontSize: 16 }}>chat</span>
                {t('home.wa_network_tag')}
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
                {t('home.wa_title')}
              </h2>
              <p style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.6, marginBottom: 20 }}>
                {t('home.wa_desc')}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/pricing"
                  style={{
                    background: '#22c55e',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: 15,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chat</span>
                  {t('home.wa_btn')}
                </Link>
                <Link
                  href="/faq"
                  style={{
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  {t('home.wa_how_it_works')}
                </Link>
              </div>
            </div>

            {/* Simulated WhatsApp Notification Box */}
            <div style={{
              background: '#075e54',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              maxWidth: 380,
              margin: '0 auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 10, marginBottom: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#25d366' }}>verified</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>ExamUdaan Alerts ⚡</div>
                  <div style={{ fontSize: 11, color: '#e2e8f0' }}>{isMarathi ? 'अधिकृत WhatsApp चॅनेल' : 'Official WhatsApp Channel'}</div>
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                color: '#1e293b',
                borderRadius: '8px',
                padding: 14,
                fontSize: 13,
                lineHeight: 1.5,
              }}>
                <div style={{ fontWeight: 700, color: '#ea580c', marginBottom: 4 }}>
                  {isMarathi ? '🚨 नवीन: BMC भरती 2026 जाहीर!' : '🚨 NEW: BMC Recruitment 2026 Announced!'}
                </div>
                <div>💼 <strong>{isMarathi ? 'पद:' : 'Post:'}</strong> {isMarathi ? 'कनिष्ठ अभियंता (स्थापत्य)' : 'Junior Engineer (Civil)'}</div>
                <div>👥 <strong>{isMarathi ? 'जागा:' : 'Vacancies:'}</strong> {isMarathi ? '६९० पदे' : '690 Posts'}</div>
                <div>🎓 <strong>{isMarathi ? 'पात्रता:' : 'Eligibility:'}</strong> {isMarathi ? 'डिप्लोमा / पदवी (सिव्हिल)' : 'Diploma / Degree in Civil'}</div>
                <div>📅 <strong>{isMarathi ? 'अंतिम दिनांक:' : 'Last Date:'}</strong> 28-Sep-2026</div>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #cbd5e1', fontSize: 12, color: '#2563eb' }}>
                  {isMarathi ? '👉 अधिकृत PDF डाऊनलोड करण्यासाठी व ऑनलाईन अर्जासाठी येथे क्लिक करा' : '👉 Tap here to download Official PDF & Apply Online'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. Live Platform Statistics ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 48,
        }}>
          {[
            { icon: 'work', value: stats.total_jobs, label: t('home.stats_active_jobs') },
            { icon: 'groups', value: stats.total_vacancies, label: t('home.stats_total_posts') },
            { icon: 'travel_explore', value: stats.total_boards, label: t('home.stats_portals') },
            { icon: 'person_check', value: '25,000+', label: t('home.stats_aspirants') },
          ].map((s, idx) => (
            <div key={idx} style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 16px',
              textAlign: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26, color: 'var(--primary)', marginBottom: 6 }}>
                {s.icon}
              </span>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--on-surface)' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--secondary)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── 10. Community Feedback & Exam Inclusion Request Banner ── */}
        <section style={{
          background: 'var(--surface-container-lowest)',
          border: '1.5px dashed var(--primary-cta)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
        }}>
          <div style={{ maxWidth: 650 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary-cta)', fontSize: 22 }}>
                lightbulb
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>
                {t('home.feedback_banner_title')}
              </h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--secondary)', margin: 0 }}>
              {t('home.feedback_banner_desc')}
            </p>
          </div>

          <Link
            href="/feedback"
            style={{
              background: 'var(--primary-fixed)',
              color: 'var(--primary)',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>rate_review</span>
            {t('home.feedback_banner_btn')}
          </Link>
        </section>
      </div>
    </div>
  )
}
