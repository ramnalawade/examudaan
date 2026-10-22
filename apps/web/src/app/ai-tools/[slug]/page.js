// ============================================================
// app/ai-tools/[slug]/page.js — Individual AI Tool Comprehensive Guide
// 10-Minute Deep-Dive Guide, Hands-on Masterclass, Before/After Examples,
// Multi-Tool AI Power Workflows, Mega-Prompts, and Curated Resources
// ZERO INLINE STYLES POLICY COMPLIANT
// ============================================================

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AI_TOOLS, getToolBySlug, getRelatedTools } from '../../../lib/aiToolsData'
import { getExamUseCaseRoute } from '../../../lib/examRoutes'
import { enrichAiTool } from '../../../lib/aiToolEnricher'
import PromptShowcase from '../../../components/PromptShowcase'
import BeforeAfterViewer from '../../../components/BeforeAfterViewer'
import WorkflowCard from '../../../components/WorkflowCard'
import styles from './aiToolDetail.module.css'

export const dynamicParams = true

// Next.js static generation — pre-build all tool pages at deploy time
export async function generateStaticParams() {
  return AI_TOOLS.map(tool => ({ slug: tool.slug }))
}

// SEO metadata per tool
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const rawTool = getToolBySlug(resolvedParams?.slug)
  if (!rawTool) return { title: 'AI Tools | ExamUdaan' }

  const tool = enrichAiTool(rawTool)
  const canonicalUrl = `https://examudaan.in/ai-tools/${tool.slug}`
  const pageTitle = `${tool.name} — Comprehensive AI Guide, Workflows & Prompts | ExamUdaan`
  const pageDesc = `${tool.tagline} Complete 10-minute masterclass on how to use ${tool.name} for UPSC, MPSC, competitive exams, multi-tool workflows, and high-yield prompts.`

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      type: 'article',
      siteName: 'ExamUdaan.in',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
    },
  }
}

// Helper for category badge class
function getCategoryClass(category) {
  switch (category) {
    case 'Study': return styles.catStudy
    case 'Research': return styles.catResearch
    case 'Writing': return styles.catWriting
    case 'Presentation': return styles.catPresentation
    case 'Design': return styles.catDesign
    case 'Dev': return styles.catDev
    case 'Productivity': return styles.catProductivity
    case 'AI Hub': return styles.catAiHub
    default: return styles.catDefault
  }
}

export default async function AiToolDetailPage({ params }) {
  const resolvedParams = await params
  const rawTool = getToolBySlug(resolvedParams?.slug)
  if (!rawTool) notFound()

  const tool = enrichAiTool(rawTool)
  const related = getRelatedTools(rawTool)
  const catClass = getCategoryClass(tool.category)

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: `${tool.name} — Full Guide, Multi-Tool Workflows & Exam Prompts`,
        description: tool.tagline,
        url: `https://examudaan.in/ai-tools/${tool.slug}`,
        datePublished: '2026-01-15T00:00:00+05:30',
        dateModified: '2026-10-17T00:00:00+05:30',
        author: {
          '@type': 'Organization',
          name: 'ExamUdaan AI Research Desk',
          url: 'https://examudaan.in',
        },
        publisher: {
          '@type': 'Organization',
          name: 'ExamUdaan.in',
          logo: {
            '@type': 'ImageObject',
            url: 'https://examudaan.in/logo.png',
          },
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: 'EducationalSoftware',
        operatingSystem: 'Web, iOS, Android',
        offers: {
          '@type': 'Offer',
          price: tool.free ? '0' : '0',
          priceCurrency: 'INR',
        },
        url: tool.url,
      },
      ...(tool.faqs && tool.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: tool.faqs.map(faq => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.a,
                },
              })),
            },
          ]
        : []),
    ],
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumbBar}>
        <div className={styles.breadcrumbContainer}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link href="/ai-tools" className={styles.breadcrumbLink}>AI Tools Directory</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>{tool.name}</span>
        </div>
      </nav>

      <main className={styles.mainContainer}>

        {/* ── Hero Section ── */}
        <section className={styles.hero}>
          <div className={styles.badgeRow}>
            <Link
              href={`/ai-tools?category=${encodeURIComponent(tool.category)}`}
              className={`${styles.categoryBadge} ${catClass}`}
              title={`View all ${tool.category} AI tools`}
            >
              {tool.category}
            </Link>
            <span className={styles.readingTimeBadge}>
              <span className={`material-symbols-outlined ${styles.readingTimeIcon}`}>schedule</span>
              <span>{tool.readingTime || '10 min read'}</span>
            </span>
            {tool.badge && (
              <span className={styles.highlightBadge}>{tool.badge}</span>
            )}
            <a
              href="#limitations"
              className={`${styles.pricingBadge} ${
                !tool.free ? styles.pricingBadgePaid : ''
              }`}
              title="View pricing details, free allowances, and student advice"
            >
              {tool.free ? '✓ Free Tier Available' : '💳 Freemium / Paid Options'}
            </a>
          </div>

          <div className={styles.heroTitleRow}>
            <div className={styles.logoIconBox}>
              <span className={`material-symbols-outlined ${styles.logoIcon}`}>
                {tool.logo || 'auto_awesome'}
              </span>
            </div>
            <div>
              <h1 className={styles.heroTitle}>{tool.name}</h1>
            </div>
          </div>

          <p className={styles.tagline}>{tool.tagline}</p>

          {/* Quick Specs Matrix */}
          <div className={styles.heroSpecsGrid}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Pricing Model</span>
              <span className={styles.specValue}>{tool.pricingModel || (tool.free ? 'Free / Freemium' : 'Freemium')}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Learning Curve</span>
              <span className={styles.specValue}>{tool.difficulty || 'Beginner Friendly'}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Ideal For</span>
              <span className={styles.specValue}>
                {tool.targetUsers && tool.targetUsers.length > 0
                  ? tool.targetUsers.slice(0, 2).join(', ')
                  : 'Exam Aspirants & Students'}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className={styles.heroCtaRow}>
            {tool.url && tool.url.startsWith('http') && !tool.url.includes('antigravity.dev') && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtnPrimary}
              >
                <span className="material-symbols-outlined">open_in_new</span>
                <span>Launch {tool.name} (Official Website)</span>
              </a>
            )}
            <a href="#mega-prompts" className={styles.ctaBtnOutline}>
              <span className="material-symbols-outlined">terminal</span>
              <span>Jump to High-Yield Prompts</span>
            </a>
            <a href="#workflows" className={styles.ctaBtnOutline}>
              <span className="material-symbols-outlined">hub</span>
              <span>View Multi-Tool Workflows</span>
            </a>
          </div>
        </section>

        {/* ── Table of Contents / Sticky Jump Bar ── */}
        <nav aria-label="Table of Contents" className={styles.tocBar}>
          <div className={styles.tocTitle}>
            <span className="material-symbols-outlined">format_list_bulleted</span>
            <span>10-Minute Masterclass Navigation</span>
          </div>
          <div className={styles.tocLinks}>
            <a href="#deep-dive" className={styles.tocLink}>01. Overview & Architecture</a>
            <a href="#case-studies" className={styles.tocLink}>02. Real-World Student Case Studies</a>
            <a href="#masterclass" className={styles.tocLink}>03. Step-by-Step Guide</a>
            <a href="#workflows" className={styles.tocLink}>04. Multi-Tool AI Workflows</a>
            <a href="#mega-prompts" className={styles.tocLink}>05. Advanced Mega-Prompts</a>
            <a href="#resources" className={styles.tocLink}>06. Videos & Study Guides</a>
            <a href="#limitations" className={styles.tocLink}>07. Limitations & Pro-Tips</a>
            <a href="#faqs" className={styles.tocLink}>08. Exam FAQs</a>
            <a href="#related" className={styles.tocLink}>09. Alternative Tools</a>
          </div>
        </nav>

        {/* ── Section 01: Deep-Dive Overview & Architecture ── */}
        <section id="deep-dive" className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionNumber}>Section 01</div>
            <h2 className={styles.sectionTitle}>What is {tool.name}? Core Technology & Exam Edge</h2>
            <p className={styles.sectionSubtitle}>
              An architectural breakdown of how the platform operates and why it delivers a distinct advantage for competitive examinations.
            </p>
          </div>

          <div className={styles.deepDiveCard}>
            <p className={styles.proseText}>
              {tool.deepDive?.overview || tool.whatIs}
            </p>

            {tool.deepDive?.coreTechnology && (
              <div className={styles.techBox}>
                <div className={styles.techBoxTitle}>
                  <span className="material-symbols-outlined">memory</span>
                  <span>Underlying AI Architecture & Engine</span>
                </div>
                <p className={styles.techBoxText}>{tool.deepDive.coreTechnology}</p>
              </div>
            )}

            <div className={styles.whyMattersBox}>
              <div className={styles.whyMattersTitle}>
                <span className="material-symbols-outlined">military_tech</span>
                <span>Why It Matters for Competitive Exam Aspirants:</span>
              </div>
              <p className={styles.whyMattersText}>
                {tool.deepDive?.whyItMattersForExams || tool.whyItMatters}
              </p>
            </div>
          </div>

          {/* Key Capabilities Grid */}
          {tool.keyCapabilities && tool.keyCapabilities.length > 0 && (
            <div className={styles.capabilitiesGrid}>
              {tool.keyCapabilities.map((cap, i) => (
                <div key={i} className={styles.capabilityCard}>
                  <span className={`material-symbols-outlined ${styles.capabilityIcon}`}>
                    {cap.icon || 'star'}
                  </span>
                  <h3 className={styles.capabilityTitle}>{cap.title}</h3>
                  <p className={styles.capabilityDesc}>{cap.desc}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Target Exams Bar ── */}
        {tool.bestExamUseCases && tool.bestExamUseCases.length > 0 && (
          <div className={styles.targetExamsCard}>
            <div className={styles.targetExamsTitle}>
              Recommended Exam Disciplines & Use Cases:
            </div>
            <div className={styles.targetExamsList}>
              {tool.bestExamUseCases.map((useCase, idx) => {
                const targetRoute = getExamUseCaseRoute(useCase)
                return (
                  <Link
                    key={idx}
                    href={targetRoute}
                    className={styles.targetExamPill}
                    title={`Explore ${useCase} preparation guide & syllabus on ExamUdaan`}
                  >
                    <span className={`material-symbols-outlined ${styles.pillIcon}`}>check_circle</span>
                    <span>{useCase}</span>
                    <span className={`material-symbols-outlined ${styles.pillArrow}`}>arrow_forward</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Section 02: Real-World Student Case Studies (Before vs After) ── */}
        {tool.realWorldExamples && tool.realWorldExamples.length > 0 && (
          <section id="case-studies" className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <div className={styles.sectionNumber}>Section 02</div>
              <h2 className={styles.sectionTitle}>
                Real Exam Demonstrations: The Manual Way (Before) vs Smart Way with {tool.name} (After)
              </h2>
              <p className={styles.sectionSubtitle}>
                See how typing 1 simple prompt transforms messy, scattered reading into high-scoring model notes with exact laws, numbers, and committee citations.
              </p>
            </div>

            {/* ── Visual Explainer Banner for Students ── */}
            <div className={styles.howItWorksGuideBox}>
              <div className={styles.guideHeader}>
                <span className={`material-symbols-outlined ${styles.guideIcon}`}>lightbulb</span>
                <span className={styles.guideTitle}>How to Read These Demonstrations (Why Aspirants Use This):</span>
              </div>
              <p className={styles.guideText}>
                Preparing for competitive exams like UPSC, MPSC, Banking, and SSC usually requires hours of reading dense textbooks and struggling to make clean revision notes. The examples below show the exact difference between struggling the old manual way versus letting <strong>{tool.name}</strong> extract high-scoring, examiner-ready facts in seconds:
              </p>
              <div className={styles.guideStepsRow}>
                <div className={styles.guideStepItemBefore}>
                  <div className={styles.guideStepTagRed}>
                    <span className="material-symbols-outlined">cancel</span>
                    <span>The Old Way (Before AI)</span>
                  </div>
                  <div className={styles.guideStepText}>
                    An aspirant spends 2–3 hours reading scattered chapters and writes casual notes that miss official sections, numbers, and committee names—losing valuable exam marks.
                  </div>
                </div>
                <div className={styles.guideStepItemAfter}>
                  <div className={styles.guideStepTagGreen}>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>The Smart Way (After {tool.name})</span>
                  </div>
                  <div className={styles.guideStepText}>
                    The student types 1 targeted question, and {tool.name} instantly reorganizes it into exact statutory sections, percentages, court rulings, and model bullet points ready to memorize.
                  </div>
                </div>
              </div>
            </div>

            <div>
              {tool.realWorldExamples.map((ex, index) => (
                <BeforeAfterViewer key={index} example={ex} toolName={tool.name} />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 03: Hands-On Step-by-Step Masterclass ── */}
        {tool.handsOnMasterclass && tool.handsOnMasterclass.length > 0 && (
          <section id="masterclass" className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <div className={styles.sectionNumber}>Section 03</div>
              <h2 className={styles.sectionTitle}>
                How to Use {tool.name} — Step-by-Step Field Masterclass
              </h2>
              <p className={styles.sectionSubtitle}>
                Follow this hands-on routine to extract maximum study output and eliminate wasted time.
              </p>
            </div>

            <div className={styles.stepsContainer}>
              {tool.handsOnMasterclass.map(s => (
                <div key={s.step} className={styles.stepCard}>
                  <div className={styles.stepCircle}>{s.step}</div>
                  <div className={styles.stepContentArea}>
                    <h3 className={styles.stepCardTitle}>{s.title}</h3>
                    <p className={styles.stepCardDesc}>{s.desc}</p>
                    {s.proTip && (
                      <div className={styles.stepProTip}>
                        <strong>Aspirant Pro-Tip: </strong>
                        {s.proTip}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Section 04: Multi-Tool AI Power Workflows (Combinations with other tools) ── */}
        {tool.toolCombinations && tool.toolCombinations.length > 0 && (
          <section id="workflows" className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <div className={styles.sectionNumber}>Section 04</div>
              <h2 className={styles.sectionTitle}>
                Multi-Tool AI Power Workflows: Combining {tool.name} with Other AI Tools
              </h2>
              <p className={styles.sectionSubtitle}>
                Top exam rankers rarely rely on a single platform. Here is how to chain {tool.name} with complementary AI tools for 10x study velocity.
              </p>
            </div>

            <div>
              {tool.toolCombinations.map((wf, idx) => (
                <WorkflowCard key={idx} workflow={wf} />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 05: Advanced High-Yield Mega-Prompts ── */}
        {tool.strongPrompts && tool.strongPrompts.length > 0 && (
          <section id="mega-prompts" className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <div className={styles.sectionNumber}>Section 05</div>
              <h2 className={styles.sectionTitle}>
                Advanced High-Yield Mega-Prompts (With Worked Student Examples)
              </h2>
              <p className={styles.sectionSubtitle}>
                Forget basic single-line questions. These role-constrained prompts produce deep, structured, examination-grade responses.
              </p>
            </div>

            <div>
              {tool.strongPrompts.map((p, i) => (
                <PromptShowcase key={i} prompt={p} />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 06: Curated Video Tutorials & Blog Guides ── */}
        {tool.resources && (
          <section id="resources" className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <div className={styles.sectionNumber}>Section 06</div>
              <h2 className={styles.sectionTitle}>
                Curated Video Tutorials, Blogs & Learning Resources
              </h2>
              <p className={styles.sectionSubtitle}>
                Deep-dive into video masterclasses, official documentation, and exam-specific study guides.
              </p>
            </div>

            <div className={styles.resourcesGrid}>
              {/* Left: Video Tutorials */}
              <div className={styles.resourceBox}>
                <h3 className={styles.resourceBoxTitle}>
                  <span className={`material-symbols-outlined ${styles.resourceBoxIcon}`}>
                    smart_display
                  </span>
                  <span>Recommended YouTube Guides</span>
                </h3>

                {tool.resources.videoTutorials &&
                  tool.resources.videoTutorials.map((v, i) => {
                    const videoLink =
                      v.url ||
                      `https://www.youtube.com/results?search_query=${encodeURIComponent(
                        v.searchQuery || v.title
                      )}`
                    return (
                      <div key={i} className={styles.videoCard}>
                        <div className={styles.videoHeaderRow}>
                          <a
                            href={videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.videoCardTitleLink}
                          >
                            {v.title}
                          </a>
                          {v.duration && (
                            <span className={styles.videoDuration}>{v.duration}</span>
                          )}
                        </div>
                        <div className={styles.videoMeta}>
                          Channel: <strong>{v.channel}</strong>
                        </div>
                        <p className={styles.videoSummary}>{v.summary}</p>
                        <a
                          href={videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.videoBtn}
                        >
                          <span className="material-symbols-outlined">play_circle</span>
                          <span>Watch on YouTube</span>
                        </a>
                      </div>
                    )
                  })}

                {tool.resources.youtubeSearchUrl && (
                  <div className={styles.ytSearchBanner}>
                    <a
                      href={tool.resources.youtubeSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.ytSearchLink}
                    >
                      <span className="material-symbols-outlined">search</span>
                      <span>Search All {tool.name} Student Tutorials on YouTube</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Right: Blogs & Guides */}
              <div className={styles.resourceBox}>
                <h3 className={styles.resourceBoxTitle}>
                  <span className={`material-symbols-outlined ${styles.resourceBoxIcon}`}>
                    menu_book
                  </span>
                  <span>In-Depth Strategy Reads & Docs</span>
                </h3>

                {tool.resources.curatedBlogs &&
                  tool.resources.curatedBlogs.map((b, i) => (
                    <div key={i} className={styles.blogCard}>
                      <div className={styles.blogCardHeader}>
                        {b.url ? (
                          <a
                            href={b.url}
                            {...(b.url.startsWith('http')
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                            className={styles.blogCardTitleLink}
                          >
                            <span>{b.title}</span>
                            <span className={`material-symbols-outlined ${styles.linkArrowIcon}`}>
                              {b.url.startsWith('http') ? 'open_in_new' : 'arrow_forward'}
                            </span>
                          </a>
                        ) : (
                          <div className={styles.blogCardTitle}>{b.title}</div>
                        )}
                        {b.readTime && (
                          <span className={styles.blogReadTime}>{b.readTime}</span>
                        )}
                      </div>
                      <div className={styles.blogSource}>{b.source}</div>
                      <p className={styles.blogDesc}>{b.desc}</p>
                    </div>
                  ))}

                {(() => {
                  const rawOfficialDocs = tool.docsUrl || tool.resources?.officialDocs || tool.url
                  const isBroken =
                    !rawOfficialDocs ||
                    rawOfficialDocs === '#' ||
                    rawOfficialDocs.includes('antigravity.dev')
                  const officialDocsUrl = isBroken ? null : rawOfficialDocs

                  if (!officialDocsUrl || !officialDocsUrl.startsWith('http')) return null

                  return (
                    <div className={styles.ytSearchBanner}>
                      <a
                        href={officialDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.ctaBtnOutline}
                      >
                        <span className="material-symbols-outlined">language</span>
                        <span>Visit {tool.name} Official Documentation</span>
                      </a>
                    </div>
                  )
                })()}
              </div>
            </div>
          </section>
        )}

        {/* ── Section 07: Limitations, Pricing & Pro-Tips ── */}
        <section id="limitations" className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionNumber}>Section 07</div>
            <h2 className={styles.sectionTitle}>
              Honest Limitations, Pricing Quotas & Aspirant Advice
            </h2>
            <p className={styles.sectionSubtitle}>
              Know what the tool cannot do and how to avoid cognitive dependency during your preparation cycle.
            </p>
          </div>

          <div className={styles.limitsGrid}>
            {/* Limitations */}
            <div className={styles.limitBox}>
              <h3 className={styles.limitBoxTitle}>
                <span className="material-symbols-outlined">warning</span>
                <span>Limitations to Keep in Mind</span>
              </h3>
              <ul className={styles.limitList}>
                {tool.honestLimitations &&
                  tool.honestLimitations.map((lim, i) => (
                    <li key={i} className={styles.limitItem}>
                      {lim}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Pricing Breakdown */}
            {tool.pricingDetails && (
              <div className={styles.pricingBox}>
                <h3 className={styles.pricingBoxTitle}>
                  <span className="material-symbols-outlined">payments</span>
                  <span>Pricing & Student Allowance</span>
                </h3>
                <div className={styles.pricingRow}>
                  <strong>Free Tier: </strong>
                  {tool.pricingDetails.freeTier}
                </div>
                <div className={styles.pricingRow}>
                  <strong>Paid / Pro Tier: </strong>
                  {tool.pricingDetails.proTier}
                </div>
                <div className={styles.pricingRow}>
                  <strong>ExamUdaan Tip: </strong>
                  {tool.pricingDetails.studentTip}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Section 08: Frequently Asked Questions ── */}
        {tool.faqs && tool.faqs.length > 0 && (
          <section id="faqs" className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <div className={styles.sectionNumber}>Section 08</div>
              <h2 className={styles.sectionTitle}>
                Frequently Asked Questions about {tool.name}
              </h2>
              <p className={styles.sectionSubtitle}>
                Common questions asked by UPSC, MPSC, and competitive exam students regarding accuracy, ethics, and pricing.
              </p>
            </div>

            <div className={styles.faqList}>
              {tool.faqs.map((f, i) => (
                <div key={i} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>
                    <span className={styles.faqQIcon}>Q:</span>
                    <span>{f.q}</span>
                  </h3>
                  <p className={styles.faqAnswer}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Section 09: Related AI Tools & Alternatives ── */}
        {related.length > 0 && (
          <section id="related" className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <div className={styles.sectionNumber}>Section 09</div>
              <h2 className={styles.sectionTitle}>
                Alternative & Complementary AI Tools
              </h2>
              <p className={styles.sectionSubtitle}>
                Explore other top-rated AI tools in the ExamUdaan directory to complete your study tech stack.
              </p>
            </div>

            <div className={styles.relatedGrid}>
              {related.map(rel => (
                <Link
                  key={rel.slug}
                  href={`/ai-tools/${rel.slug}`}
                  className={styles.relatedCard}
                >
                  <span className={`material-symbols-outlined ${styles.relatedIcon}`}>
                    {rel.logo || 'auto_awesome'}
                  </span>
                  <div className={styles.relatedInfo}>
                    <div className={styles.relatedName}>{rel.name}</div>
                    <div className={styles.relatedCategory}>{rel.category} • {rel.badge || 'AI Tool'}</div>
                  </div>
                  <span className={`material-symbols-outlined ${styles.relatedArrow}`}>
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Bottom Back Navigation CTA ── */}
        <div className={styles.bottomCtaRow}>
          <Link href="/ai-tools" className={styles.backBtn}>
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Back to All 120+ Curated AI Tools</span>
          </Link>
        </div>

      </main>
    </div>
  )
}
