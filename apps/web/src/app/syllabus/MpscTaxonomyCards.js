// ============================================================
// app/syllabus/MpscTaxonomyCards.js — MPSC 343 Papers Taxonomy Cards
// ExamUdaan.in — Cards for all MPSC Cadres with English & Marathi actions
// ============================================================

'use client'

import Link from 'next/link'
import styles from './MpscTaxonomyCards.module.css'

const TAXONOMY_CADRES = [
  {
    key: 'rajyaseva',
    icon: 'military_tech',
    iconClass: styles.iconRajyaseva,
    titleEn: 'State Services (Rajyaseva)',
    titleMr: 'राज्य सेवा परीक्षा (गट-अ व गट-ब राजपत्रित)',
    count: '36 Papers',
    isHighlight: true,
    hasInteractive: true,
    desc: 'Deputy Collector, DSP, Tehsildar, Naib Tehsildar, BDO & Administrative Cadres.',
    postsScope: 'Includes Preliminary Examination & Mains 6-9 Papers descriptive blueprints.',
    englishAction: {
      label: 'English Format (Doc 1181)',
      href: '/mpsc-syllabus/1181',
      isInteractive: true
    },
    marathiAction: {
      label: 'मराठी फॉरमॅट (Doc 1182)',
      href: '/mpsc-syllabus/1182',
      isInteractive: true
    }
  },
  {
    key: 'group-b',
    icon: 'shield_person',
    iconClass: styles.iconGroupB,
    titleEn: 'Group-B Non-Gazetted Services',
    titleMr: 'गट-ब (अराजपत्रित दुय्यम सेवा)',
    count: '89 Papers',
    hasInteractive: true,
    desc: 'Police Sub-Inspector (PSI), State Tax Inspector (STI), Assistant Section Officer (ASO), AMVI.',
    postsScope: 'Combined Prelims + Cadre-specific Mains syllabi & physical test guidelines.',
    englishAction: {
      label: 'English Format (89 Papers)',
      href: '#mpsc-catalog',
      category: 'group-b',
      isInteractive: true
    },
    marathiAction: {
      label: 'मराठी फॉरमॅट (८९ संचिका)',
      href: '#mpsc-catalog',
      category: 'group-b',
      isInteractive: true
    }
  },
  {
    key: 'group-c',
    icon: 'badge',
    iconClass: styles.iconGroupC,
    titleEn: 'Group-C Combined Services',
    titleMr: 'गट-क सेवा (लिपिक, कर सहायक व इतर)',
    count: '11 Papers',
    hasInteractive: true,
    desc: 'Clerk-Typist, Tax Assistant, Industry Inspector, Technical Assistant, State Excise Sub-Inspector.',
    postsScope: 'Combined Group C screening + Typing speed test norms & mains subject syllabi.',
    englishAction: {
      label: 'English Format (11 Papers)',
      href: '#mpsc-catalog',
      category: 'group-c',
      isInteractive: true
    },
    marathiAction: {
      label: 'मराठी फॉरमॅट (११ संचिका)',
      href: '#mpsc-catalog',
      category: 'group-c',
      isInteractive: true
    }
  },
  {
    key: 'engineering',
    icon: 'engineering',
    iconClass: styles.iconEngineering,
    titleEn: 'Maharashtra Engineering Services',
    titleMr: 'महाराष्ट्र अभियांत्रिकी सेवा',
    count: '32 Papers',
    hasInteractive: true,
    desc: 'Civil, Mechanical, Electrical, Architecture, PWD, WRD, Town Planning & Polytechnic Principals.',
    postsScope: 'Assistant Engineer Grade-1 & 2, Executive Engineer, Town Planning & Architectural branches.',
    englishAction: {
      label: 'English Format (32 Papers)',
      href: '#mpsc-catalog',
      category: 'engineering',
      isInteractive: true
    },
    marathiAction: {
      label: 'मराठी फॉरमॅट (३२ संचिका)',
      href: '#mpsc-catalog',
      category: 'engineering',
      isInteractive: true
    }
  },
  {
    key: 'education',
    icon: 'school',
    iconClass: styles.iconEducation,
    titleEn: 'Collegiate & Education Services',
    titleMr: 'शिक्षण व महाविद्यालयीन शाखा (प्राध्यापक)',
    count: '88 Papers',
    hasInteractive: true,
    desc: 'Assistant Professor, Lecturer, Education Officers (Shikshan Seva), Arts, Science, Commerce Colleges.',
    postsScope: 'Covers 88 distinct university subjects, collegiate branches & direct recruitment screening tests.',
    englishAction: {
      label: 'English Format (88 Papers)',
      href: '#mpsc-catalog',
      category: 'education',
      isInteractive: true
    },
    marathiAction: {
      label: 'मराठी फॉरमॅट (८८ संचिका)',
      href: '#mpsc-catalog',
      category: 'education',
      isInteractive: true
    }
  },
  {
    key: 'medical',
    icon: 'health_and_safety',
    iconClass: styles.iconMedical,
    titleEn: 'Medical, Health & Forensic Services',
    titleMr: 'वैद्यकीय, आरोग्य व न्यायवैद्यक सेवा',
    count: '11 Papers',
    hasInteractive: true,
    desc: 'Medical Officers, Assistant Chemical Analyser, Forensic Science Laboratories, Drug Inspectors, AYUSH.',
    postsScope: 'General State Medical Service, Forensic chemistry, toxicology, biology & public health cadres.',
    englishAction: {
      label: 'English Format (11 Papers)',
      href: '#mpsc-catalog',
      category: 'medical',
      isInteractive: true
    },
    marathiAction: {
      label: 'मराठी फॉरमॅट (११ संचिका)',
      href: '#mpsc-catalog',
      category: 'medical',
      isInteractive: true
    }
  },
  {
    key: 'agriculture-forest',
    icon: 'park',
    iconClass: styles.iconForest,
    titleEn: 'Agriculture & Forest Services',
    titleMr: 'महाराष्ट्र कृषी व वन सेवा',
    count: '11 Papers',
    hasInteractive: true,
    desc: 'Assistant Conservator of Forests (ACF), Range Forest Officer (RFO), Maharashtra Krishi Seva.',
    postsScope: 'Forest biology, silviculture, agricultural engineering, agronomy & soil sciences.',
    englishAction: {
      label: 'English Format (11 Papers)',
      href: '#mpsc-catalog',
      category: 'agriculture-forest',
      isInteractive: true
    },
    marathiAction: {
      label: 'मराठी फॉरमॅट (११ संचिका)',
      href: '#mpsc-catalog',
      category: 'agriculture-forest',
      isInteractive: true
    }
  },
  {
    key: 'judicial-legal',
    icon: 'gavel',
    iconClass: styles.iconJudicial,
    titleEn: 'Judicial & Legal Services',
    titleMr: 'न्यायालयीन व विधी शाखा',
    count: '10 Papers',
    hasInteractive: true,
    desc: 'Civil Judge Junior Division (CJJD), Judicial Magistrate First Class (JMFC), Assistant Public Prosecutor (APP).',
    postsScope: 'Civil law, criminal procedure code, IPC, evidence act, constitutional law & court practice.',
    englishAction: {
      label: 'English Format (10 Papers)',
      href: '#mpsc-catalog',
      category: 'judicial-legal',
      isInteractive: true
    },
    marathiAction: {
      label: 'मराठी फॉरमॅट (१० संचिका)',
      href: '#mpsc-catalog',
      category: 'judicial-legal',
      isInteractive: true
    }
  },
  {
    key: 'departmental',
    icon: 'work_history',
    iconClass: styles.iconDepartmental,
    titleEn: 'Departmental Competitive (LDCE)',
    titleMr: 'विभागीय स्पर्धा परीक्षा (LDCE)',
    count: '8 Papers',
    hasInteractive: true,
    desc: 'Police Sub-Inspector Limited Departmental, Desk Officer, Mantralaya & State Government in-service cadre.',
    postsScope: 'Internal promotion exams for police constabulary, clerks & ministerial assistants.',
    englishAction: {
      label: 'English Format (8 Papers)',
      href: '#mpsc-catalog',
      category: 'departmental',
      isInteractive: true
    },
    marathiAction: {
      label: 'मराठी फॉरमॅट (८ संचिका)',
      href: '#mpsc-catalog',
      category: 'departmental',
      isInteractive: true
    }
  },
  {
    key: 'other',
    icon: 'tune',
    iconClass: styles.iconOther,
    titleEn: 'Specialized Technical & Administration',
    titleMr: 'इतर विशेष संवर्ग व तांत्रिक पदे',
    count: '47 Papers',
    hasInteractive: true,
    desc: 'Administrative officers, system analysts, statisticians, translators, archival & specialized branches.',
    postsScope: 'Domain-specific examinations conducted by MPSC for specialized departmental cadres.',
    englishAction: {
      label: 'English Format (47 Papers)',
      href: '#mpsc-catalog',
      category: 'other',
      isInteractive: true
    },
    marathiAction: {
      label: 'मराठी फॉरमॅट (४७ संचिका)',
      href: '#mpsc-catalog',
      category: 'other',
      isInteractive: true
    }
  }
]

export default function MpscTaxonomyCards() {
  const triggerCategoryFilter = (categoryKey) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('selectMpscCategory', { detail: categoryKey }))
    }
  }

  return (
    <section className={styles.taxonomySection} id="mpsc-cadres">
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <span className="material-symbols-outlined">account_tree</span>
            <span>MPSC Examination Cadres Taxonomy</span>
          </div>
          <h2 className={styles.sectionTitle}>
            MPSC 343 Papers — Cadre-wise Categorization
          </h2>
          <p className={styles.sectionSubtitle}>
            Every official MPSC syllabus organized into standardized cadres. Access separate English and Marathi formats with interactive topic breakdowns and official PDFs.
          </p>
        </div>

        {/* Cards Grid with Dual English & Marathi Buttons */}
        <div className={styles.cardsGrid}>
          {TAXONOMY_CADRES.map(cadre => (
            <article
              key={cadre.key}
              className={`${styles.cadreCard} ${cadre.isHighlight ? styles.cadreCardHighlight : ''}`}
            >
              <div className={styles.cardHeader}>
                {cadre.englishAction.href.startsWith('/') ? (
                  <Link href={cadre.englishAction.href} className={styles.headerIconLink} title={`Open ${cadre.titleEn}`}>
                    <div className={`${styles.iconWrapper} ${cadre.iconClass}`}>
                      <span className="material-symbols-outlined">{cadre.icon}</span>
                    </div>
                  </Link>
                ) : (
                  <a
                    href={cadre.englishAction.href}
                    onClick={() => triggerCategoryFilter(cadre.englishAction.category)}
                    className={styles.headerIconLink}
                    title={`Filter by ${cadre.titleEn}`}
                  >
                    <div className={`${styles.iconWrapper} ${cadre.iconClass}`}>
                      <span className="material-symbols-outlined">{cadre.icon}</span>
                    </div>
                  </a>
                )}
                <div className={styles.badgeGroup}>
                  {cadre.englishAction.href.startsWith('/') ? (
                    <Link href={cadre.englishAction.href} className={styles.countBadgeLink} title={`View ${cadre.count}`}>
                      <span className={styles.countBadge}>{cadre.count}</span>
                    </Link>
                  ) : (
                    <a
                      href={cadre.englishAction.href}
                      onClick={() => triggerCategoryFilter(cadre.englishAction.category)}
                      className={styles.countBadgeLink}
                      title={`Filter by ${cadre.titleEn}`}
                    >
                      <span className={styles.countBadge}>{cadre.count}</span>
                    </a>
                  )}
                  {cadre.hasInteractive && (
                    <span className={styles.interactivePill}>⚡ Interactive</span>
                  )}
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.titleRow}>
                  <h3 className={styles.cardTitleEn}>
                    {cadre.englishAction.href.startsWith('/') ? (
                      <Link href={cadre.englishAction.href} className={styles.cardTitleLink} title={`Open ${cadre.titleEn}`}>
                        {cadre.titleEn}
                      </Link>
                    ) : (
                      <a
                        href={cadre.englishAction.href}
                        onClick={() => triggerCategoryFilter(cadre.englishAction.category)}
                        className={styles.cardTitleLink}
                        title={`Filter by ${cadre.titleEn}`}
                      >
                        {cadre.titleEn}
                      </a>
                    )}
                  </h3>
                  <p className={styles.cardTitleMr}>
                    {cadre.marathiAction.href.startsWith('/') ? (
                      <Link href={cadre.marathiAction.href} className={styles.cardTitleLink} title={`उघडा ${cadre.titleMr}`}>
                        {cadre.titleMr}
                      </Link>
                    ) : (
                      <a
                        href={cadre.marathiAction.href}
                        onClick={() => triggerCategoryFilter(cadre.marathiAction.category)}
                        className={styles.cardTitleLink}
                        title={`फिल्टर करा ${cadre.titleMr}`}
                      >
                        {cadre.titleMr}
                      </a>
                    )}
                  </p>
                </div>
                <p className={styles.cardDesc}>{cadre.desc}</p>
                <div className={styles.cardPostsScope}>{cadre.postsScope}</div>
              </div>

              {/* ── 2 Action Buttons in the Same Card (English & Marathi) ── */}
              <div className={styles.dualActionRow}>
                {cadre.englishAction.href.startsWith('/') ? (
                  <Link
                    href={cadre.englishAction.href}
                    className={`${styles.btnActionEn} ${cadre.englishAction.isInteractive ? styles.btnActionInteractive : ''}`}
                    title={`Open ${cadre.englishAction.label}`}
                  >
                    <span>{cadre.englishAction.label}</span>
                    <span className={`material-symbols-outlined ${styles.btnIcon}`}>arrow_forward</span>
                  </Link>
                ) : (
                  <a
                    href={cadre.englishAction.href}
                    className={styles.btnActionEn}
                    onClick={() => triggerCategoryFilter(cadre.englishAction.category)}
                    title={`Filter ${cadre.titleEn} in English`}
                  >
                    <span>{cadre.englishAction.label}</span>
                    <span className={`material-symbols-outlined ${styles.btnIcon}`}>arrow_downward</span>
                  </a>
                )}

                {cadre.marathiAction.href.startsWith('/') ? (
                  <Link
                    href={cadre.marathiAction.href}
                    className={`${styles.btnActionMr} ${cadre.marathiAction.isInteractive ? styles.btnActionInteractive : ''}`}
                    title={`उघडा ${cadre.marathiAction.label}`}
                  >
                    <span>{cadre.marathiAction.label}</span>
                    <span className={`material-symbols-outlined ${styles.btnIcon}`}>arrow_forward</span>
                  </Link>
                ) : (
                  <a
                    href={cadre.marathiAction.href}
                    className={styles.btnActionMr}
                    onClick={() => triggerCategoryFilter(cadre.marathiAction.category)}
                    title={`फिल्टर करा ${cadre.titleMr}`}
                  >
                    <span>{cadre.marathiAction.label}</span>
                    <span className={`material-symbols-outlined ${styles.btnIcon}`}>arrow_downward</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
