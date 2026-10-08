// ============================================================
// app/blog/[slug]/page.js — Long-Tail Keyword Article Reader
// Features: SSG Prerendering, Schema.org JSON-LD (Article + FAQ),
// Sticky TOC, In-Article Tool Conversion, & WhatsApp Sharing
// ============================================================

import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from './blogPost.module.css'
import { getAllBlogPosts, getBlogPostBySlug, getAllBlogSlugs } from '../../../lib/blogData'

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const post = getBlogPostBySlug(resolvedParams?.slug)
  if (!post) return {}

  const canonicalUrl = `https://examudaan.in/blog/${post.slug}`

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.primaryKeyword, ...(post.secondaryKeywords || [])],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} — ExamUdaan`,
      description: post.excerpt,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: new Date().toISOString(),
      authors: [post.author?.name || 'ExamUdaan Academic Mentor'],
      tags: [post.category, post.primaryKeyword],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
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

  // ── Schema.org JSON-LD Structured Data ──
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: new Date().toISOString(), // Signals dynamic continuous freshness to Google
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
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
            <span style={{ color: 'var(--on-surface, #1E293B)', fontWeight: 600 }}>{post.category}</span>
          </nav>

          <div className={styles.metaRowTop}>
            <span className={styles.categoryBadge}>{post.category}</span>
            <span className={styles.freshnessBadge}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
              <span>Updated for 2026 Examination Cycle</span>
            </span>
          </div>

          <h1 className={styles.postTitle}>{post.title}</h1>
          <p className={styles.postExcerpt}>{post.excerpt}</p>

          <div className={styles.authorBar}>
            <div className={styles.authorLeft}>
              <div className={styles.authorAvatar}>
                <span className="material-symbols-outlined">{post.author.avatar || 'person'}</span>
              </div>
              <div>
                <div className={styles.authorName}>{post.author.name}</div>
                <div className={styles.authorRole}>{post.author.role}</div>
              </div>
            </div>

            <div className={styles.metaDetails}>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. Content Layout with Sticky Sidebar ── */}
      <div className={styles.contentLayout}>
        {/* Sticky Desktop TOC & Action Widget */}
        <aside className={styles.sidebarTOC}>
          <div className={styles.tocTitle}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>toc</span>
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
            {post.faqs && post.faqs.length > 0 && (
              <li>
                <a href="#frequently-asked-questions" className={styles.tocLink}>
                  {post.sections.length + 1}. Frequently Asked Questions
                </a>
              </li>
            )}
          </ul>

          {/* Contextual Action Widget */}
          {post.relatedTool && (
            <div className={styles.sidebarPromo}>
              <div className={styles.promoTitle}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>bolt</span>
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
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </Link>
            </div>
          )}

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
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                <span>Share on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* ── Related Reading Grid ── */}
          {relatedPosts.length > 0 && (
            <div style={{ marginTop: 60 }}>
              <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: 22, fontWeight: 800, color: 'var(--on-surface, #1E293B)', margin: '0 0 20px' }}>
                Recommended Further Reading
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                {relatedPosts.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    style={{
                      background: 'var(--surface-container-lowest, #FFFFFF)',
                      border: '1.5px solid var(--outline-variant, #E2E8F0)',
                      borderRadius: 14,
                      padding: '18px',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.15s, transform 0.15s',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary, #EA580C)', textTransform: 'uppercase' }}>
                        {rel.category}
                      </span>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface, #1E293B)', margin: '8px 0 0', lineHeight: 1.4 }}>
                        {rel.title}
                      </h4>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary, #EA580C)', marginTop: 14 }}>
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
