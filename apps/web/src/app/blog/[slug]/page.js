// ============================================================
// app/blog/[slug]/page.js — Long-Tail Keyword Article Reader
// Features: SSG Prerendering, Schema.org JSON-LD (Article + FAQ),
// Sticky TOC, In-Article Tool Conversion, & WhatsApp Sharing
// ============================================================

import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from './blogPost.module.css'
import { getAllBlogPosts, getBlogPostBySlug, getAllBlogSlugs } from '../../../lib/blogData'
import BlogEngagementHub from '../../../components/BlogEngagementHub'
import { fitDescription } from '../../../lib/seoMetadata'

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const post = getBlogPostBySlug(resolvedParams?.slug)
  if (!post) return {}

  const canonicalUrl = `https://examudaan.in/blog/${post.slug}`

  // Title: max 60 chars, drop brand if needed
  let title = `${post.title} | ExamUdaan`
  if (title.length > 60) {
    title = post.title
  }
  if (title.length > 60) {
    title = post.title.slice(0, 57).trim() + '...'
  }

  const description = fitDescription(post.excerpt || post.title, 'Read full guide on ExamUdaan.')

  return {
    title: { absolute: title },
    description,
    keywords: [post.primaryKeyword, ...(post.secondaryKeywords || [])],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: new Date().toISOString(),
      authors: [post.author?.name || 'ExamUdaan Blog'],
      tags: [post.category, post.primaryKeyword],
      siteName: 'ExamUdaan',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export const revalidate = 86400

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params
  const post = getBlogPostBySlug(resolvedParams?.slug)
  if (!post) notFound()

  const allPosts = getAllBlogPosts()
  const relatedPosts = allPosts.filter(p => p.slug !== post.slug && (p.category === post.category || p.featured)).slice(0, 3)

  const quickFacts = post.quickFacts || getQuickFactsForPost(post)

  // ── Schema.org JSON-LD Structured Data ──
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: new Date().toISOString(), // Signals dynamic continuous freshness to Google
    author: {
      '@type': 'Organization',
      name: post.author?.name || 'ExamUdaan Blog',
      url: 'https://examudaan.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ExamUdaan',
      url: 'https://examudaan.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://examudaan.in/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://examudaan.in/blog/${post.slug}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://examudaan.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://examudaan.in/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://examudaan.in/blog/${post.slug}`,
      },
    ],
  }

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  } : null

  return (
    <article className={styles.pageWrapper}>
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ── 1. Article Header ── */}
      <header className={styles.articleHeader}>
        <div className={styles.headerContainer}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/blog">Blog & Study Guides</Link>
            <span>›</span>
            <span className={styles.breadcrumbCurrent}>{post.category}</span>
          </nav>

          <div className={styles.metaRowTop}>
            <span className={styles.categoryBadge}>{post.category}</span>
            <span className={styles.freshnessBadge}>
              <span className="material-symbols-outlined">verified</span>
              <span>Updated for 2026 Examination Cycle</span>
            </span>
          </div>

          <h1 className={styles.postTitle}>{post.title}</h1>
          <p className={styles.postExcerpt}>{post.excerpt}</p>

          <div className={styles.authorBar}>
            <div className={styles.authorLeft}>
              <div className={styles.authorAvatar}>
                <span className="material-symbols-outlined">{post.author?.avatar || 'edit_note'}</span>
              </div>
              <div>
                <div className={styles.authorName}>{post.author?.name || 'ExamUdaan Blog'}</div>
                <div className={styles.authorRole}>{post.author?.role || 'Internal Blog Editor'}</div>
              </div>
            </div>

            <div className={styles.metaDetails}>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {/* ── Executive Quick Facts Matrix Bar ── */}
          {quickFacts && (
            <div className={styles.quickFactsBar}>
              <div className={styles.quickFactsTitleRow}>
                <h3 className={styles.quickFactsHeading}>
                  <span className={`material-symbols-outlined ${styles.quickFactsHeadingIcon}`}>speed</span>
                  <span>Executive Quick Facts &amp; Salary Matrix</span>
                </h3>
              </div>
              <div className={styles.quickFactsGrid}>
                {quickFacts.payScale && (
                  <div className={styles.quickFactCard}>
                    <span className={styles.quickFactLabel}>7th Pay Level</span>
                    <span className={styles.quickFactValue}>{quickFacts.payScale}</span>
                  </div>
                )}
                {quickFacts.inHandSalary && (
                  <div className={styles.quickFactCard}>
                    <span className={styles.quickFactLabel}>Est. In-Hand Pay</span>
                    <span className={styles.quickFactValue}>{quickFacts.inHandSalary}</span>
                  </div>
                )}
                {quickFacts.examStage && (
                  <div className={styles.quickFactCard}>
                    <span className={styles.quickFactLabel}>Exam Format</span>
                    <span className={styles.quickFactValue}>{quickFacts.examStage}</span>
                  </div>
                )}
                {quickFacts.negativeMarking && (
                  <div className={styles.quickFactCard}>
                    <span className={styles.quickFactLabel}>Negative Marking</span>
                    <span className={styles.quickFactValue}>{quickFacts.negativeMarking}</span>
                  </div>
                )}
                {quickFacts.ageLimit && (
                  <div className={styles.quickFactCard}>
                    <span className={styles.quickFactLabel}>Age Criteria</span>
                    <span className={styles.quickFactValue}>{quickFacts.ageLimit}</span>
                  </div>
                )}
                {quickFacts.qualification && (
                  <div className={styles.quickFactCard}>
                    <span className={styles.quickFactLabel}>Min. Qualification</span>
                    <span className={styles.quickFactValue}>{quickFacts.qualification}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── 2. Content Layout with Sticky Sidebar ── */}
      <div className={styles.contentLayout}>
        {/* Sticky Desktop TOC & Action Widget */}
        <aside className={styles.sidebarTOC}>
          <div className={styles.tocTitle}>
            <span className={`material-symbols-outlined ${styles.tocIcon}`}>toc</span>
            <span>Table of Contents</span>
          </div>
          <ul className={styles.tocList}>
            {post.sections.map((sec, idx) => (
              <li key={sec.id}>
                <a href={`#${sec.id}`} className={styles.tocLink}>
                  {idx + 1}. {sec.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#interactive-prep-hub" className={styles.tocLink}>
                {post.sections.length + 1}. Practice Hub & 10-Min Study Sprint
              </a>
            </li>
            {post.faqs && post.faqs.length > 0 && (
              <li>
                <a href="#frequently-asked-questions" className={styles.tocLink}>
                  {post.sections.length + 2}. Frequently Asked Questions
                </a>
              </li>
            )}
          </ul>

          {/* Contextual Action Widget */}
          {post.relatedTool && (
            <div className={styles.sidebarPromo}>
              <div className={styles.promoTitle}>
                <span className={`material-symbols-outlined ${styles.promoIcon}`}>bolt</span>
                <span>Active Simulator</span>
              </div>
              <p className={styles.promoText}>{post.relatedTool.title}</p>
              <Link href={post.relatedTool.link} className={styles.promoBtn}>
                Launch CBT Test →
              </Link>
            </div>
          )}
        </aside>

        {/* Main Content Body */}
        <main className={styles.articleBody}>
          {post.sections.map(section => (
            <section key={section.id} id={section.id} className={styles.articleSection}>
              <h2 className={styles.sectionHeading}>{section.title}</h2>
              <div
                className={styles.prose}
                dangerouslySetInnerHTML={{ __html: renderMarkdownSimple(section.content) }}
              />
            </section>
          ))}

          {/* In-Content Conversion Tool Banner */}
          {post.relatedTool && (
            <div className={styles.inContentToolCard}>
              <div className={styles.toolCardLeft}>
                <span className={styles.toolBadge}>{post.relatedTool.badge}</span>
                <h3 className={styles.toolCardTitle}>Apply What You Learned in This Guide</h3>
                <p className={styles.toolCardDesc}>{post.relatedTool.title}</p>
              </div>
              <Link href={post.relatedTool.link} className={styles.toolActionBtn}>
                <span>Practice Now</span>
                <span className={`material-symbols-outlined ${styles.btnArrowIcon}`}>arrow_forward</span>
              </Link>
            </div>
          )}

          {/* ── Contextual Practice Hub & 10-Minute Study Sprint ── */}
          <div id="interactive-prep-hub">
            <BlogEngagementHub
              postSlug={post.slug}
              category={post.category}
              primaryKeyword={post.primaryKeyword}
              relatedResources={post.relatedResources}
            />
          </div>

          {/* FAQ Section */}
          {post.faqs && post.faqs.length > 0 && (
            <section id="frequently-asked-questions" className={styles.faqSection}>
              <h2 className={styles.faqHeading}>Frequently Asked Questions (FAQ)</h2>
              <div className={styles.faqList}>
                {post.faqs.map((faq, i) => (
                  <div key={i} className={styles.faqItem}>
                    <h3 className={styles.faqQ}>
                      <span className={`material-symbols-outlined ${styles.faqQIcon}`}>help</span>
                      <span>{faq.q}</span>
                    </h3>
                    <p className={styles.faqA}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Social Share & WhatsApp Action ── */}
          <div className={styles.shareBar}>
            <div className={styles.shareTitle}>
              Found this guide helpful? Share with your study group:
            </div>
            <div className={styles.shareButtons}>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `📚 *${post.title}*\n\nRead this complete preparation blueprint on ExamUdaan: https://examudaan.in/blog/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappShareBtn}
              >
                <span className={`material-symbols-outlined ${styles.whatsappIcon}`}>chat</span>
                <span>Share on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* ── Related Reading Grid ── */}
          {relatedPosts.length > 0 && (
            <div className={styles.furtherReadingWrapper}>
              <h3 className={styles.furtherReadingTitle}>
                Recommended Further Reading
              </h3>
              <div className={styles.relatedGrid}>
                {relatedPosts.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className={styles.relatedCard}
                  >
                    <div>
                      <span className={styles.relatedCategory}>
                        {rel.category}
                      </span>
                      <h4 className={styles.relatedTitle}>
                        {rel.title}
                      </h4>
                    </div>
                    <span className={styles.relatedLink}>
                      Read Guide →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </article>
  )
}

// ── Smart Quick Facts Fallback Generator ──
function getQuickFactsForPost(post) {
  const kw = (post.primaryKeyword || '').toLowerCase()
  const title = (post.title || '').toLowerCase()

  if (kw.includes('police') || title.includes('police')) {
    return {
      payScale: 'Level S-6 (₹21,700 – ₹69,100) / S-14 (PSI)',
      inHandSalary: '₹34,000 – ₹38,000 / month (₹58,000 for PSI)',
      examStage: 'Physical Test (50 Marks) + Written (100 Marks)',
      negativeMarking: 'Zero Negative Marking (Constable) / -0.25 (PSI)',
      ageLimit: '18 to 28 Yrs (Open) / Up to 33 Yrs (Reserved)',
      qualification: '12th Pass (HSC) / Degree for PSI',
    }
  }

  if (kw.includes('talathi') || title.includes('talathi') || kw.includes('clerk') || kw.includes('tcs')) {
    return {
      payScale: 'Level S-8 (₹25,500 – ₹81,100) / S-6 (Clerk)',
      inHandSalary: '₹38,000 – ₹42,000 / month',
      examStage: 'Single CBT Exam (100 Questions | 200 Marks)',
      negativeMarking: '0 Negative Penalty (Normalized Score)',
      ageLimit: '18 to 38 Yrs (Open) / Up to 43 Yrs (OBC/SC/ST)',
      qualification: 'Graduate in any discipline + MS-CIT',
    }
  }

  if (title.includes('class 1') || title.includes('deputy collector') || title.includes('tehsildar')) {
    return {
      payScale: 'Level S-20 (₹56,100 – ₹1,77,500)',
      inHandSalary: '₹88,000 – ₹1,08,000 / month',
      examStage: 'Prelims (400M) + Mains (1750M) + Interview (275M)',
      negativeMarking: '-0.25 (1/4th Penalty in Prelims)',
      ageLimit: '19 to 38 Yrs (Open) / Up to 43 Yrs (OBC/SC/ST)',
      qualification: 'Bachelor’s Degree in any faculty',
    }
  }

  // Default MPSC State Services / Combined
  return {
    payScale: 'Level S-14 (₹38,600 – ₹1,22,800) to S-20',
    inHandSalary: '₹58,000 – ₹95,000 / month',
    examStage: 'Prelims (100 Qs / 60 Min) + Mains Examination',
    negativeMarking: '-0.25 (1/4th Penalty in Prelims)',
    ageLimit: '19 to 38 Yrs (Open) / Up to 43 Yrs (OBC/SC/ST)',
    qualification: 'Bachelor’s Degree in any discipline',
  }
}

// ---- Lightweight Markdown to HTML Renderer ----
function renderMarkdownSimple(md = '') {
  let html = md

  // Convert tables
  const tableRegex = /\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g
  html = html.replace(tableRegex, (match, headerRow, bodyRows) => {
    const headers = headerRow.split('|').filter(h => h.trim()).map(h => `<th>${h.trim()}</th>`).join('')
    const rows = bodyRows.trim().split('\n').map(row => {
      const cols = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('')
      return `<tr>${cols}</tr>`
    }).join('')
    return `<div class="${styles.tableContainer}"><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`
  })

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Unordered lists
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  // Paragraphs
  const blocks = html.split(/\n{2,}/)
  html = blocks.map(b => {
    if (b.startsWith('<h') || b.startsWith('<ul') || b.startsWith('<div')) return b
    return `<p>${b.replace(/\n/g, '<br/>')}</p>`
  }).join('')

  return html
}
