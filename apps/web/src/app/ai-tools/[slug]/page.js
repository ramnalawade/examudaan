// ============================================================
// app/ai-tools/[slug]/page.js — Individual AI Tool Detail Page
// Renders a full how-to guide for each tool from aiToolsData.js
// ============================================================

import Link from 'next/link'
import { AI_TOOLS, getToolBySlug, getRelatedTools } from '../../../lib/aiToolsData'
import { notFound } from 'next/navigation'
import PromptBox from '../../../components/PromptBox'

export const dynamicParams = true

// Next.js static generation — pre-build all tool pages at deploy time
export async function generateStaticParams() {
  return AI_TOOLS.map(tool => ({ slug: tool.slug }))
}

// SEO metadata per tool
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const tool = getToolBySlug(resolvedParams?.slug)
  if (!tool) return { title: 'AI Tools | ExamUdaan' }
  return {
    title: `${tool.name} — How to Use for Exam Prep & Research | ExamUdaan AI Tools`,
    description: tool.tagline,
  }
}

// Category badge colors
const CAT_COLORS = {
  Study:        { bg: '#ECFDF5', color: '#065F46' },
  Research:     { bg: '#EFF6FF', color: '#1D4ED8' },
  Writing:      { bg: '#F5F3FF', color: '#5B21B6' },
  Presentation: { bg: '#FFF7ED', color: '#C2410C' },
  Design:       { bg: '#FDF4FF', color: '#7E22CE' },
  Dev:          { bg: '#F0FDF4', color: '#166534' },
  Productivity: { bg: '#FFFBEB', color: '#92400E' },
  'AI Hub':     { bg: '#F0F9FF', color: '#0369A1' },
}

export default async function AiToolDetailPage({ params }) {
  const resolvedParams = await params
  const tool = getToolBySlug(resolvedParams?.slug)
  if (!tool) notFound()

  const related = getRelatedTools(tool)
  const catColor = CAT_COLORS[tool.category] || { bg: '#F9FAFB', color: '#374151' }

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 80 }}>

      {/* ── Breadcrumb ── */}
      <div style={{ borderBottom: '1px solid var(--outline-variant)', padding: '12px 20px' }}>
        <div className="container" style={{ maxWidth: 900, margin: '0 auto', fontSize: 13, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link href="/ai-tools" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>AI Tools</Link>
          <span>›</span>
          <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>{tool.name}</span>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 900, margin: '32px auto 0', padding: '0 20px' }}>

        {/* ── Hero ── */}
        <div style={{ marginBottom: 40 }}>
          {/* Category + Badge row */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800,
              background: catColor.bg, color: catColor.color,
            }}>
              {tool.category}
            </span>
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700,
              background: 'var(--primary-fixed)', color: 'var(--primary)',
            }}>
              {tool.badge}
            </span>
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700,
              background: tool.free ? '#ECFDF5' : '#FFF7ED',
              color: tool.free ? '#065F46' : '#C2410C',
            }}>
              {tool.free ? '✓ Free tier available' : '💳 Paid tool'}
            </span>
          </div>

          {/* Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'var(--primary-fixed)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 30 }}>{tool.logo}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              {tool.name}
            </h1>
          </div>

          <p style={{ fontSize: 18, color: 'var(--secondary)', margin: '0 0 24px', lineHeight: 1.5 }}>
            {tool.tagline}
          </p>

          {/* CTA */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '12px 24px', fontSize: 15 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>open_in_new</span>
            Open {tool.name}
          </a>
        </div>

        {/* ── What is it ── */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: 'var(--on-surface)' }}>
            What is {tool.name}?
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--secondary)', margin: 0 }}>
            {tool.whatIs}
          </p>
          {tool.whyItMatters && (
            <div style={{
              marginTop: 16, padding: '14px 18px', borderRadius: 10,
              background: 'var(--primary-fixed)', borderLeft: '4px solid var(--primary)',
            }}>
              <strong style={{ fontSize: 13, color: 'var(--primary)' }}>Why it matters for exam prep:</strong>
              <p style={{ fontSize: 14, color: 'var(--on-surface)', margin: '4px 0 0', lineHeight: 1.6 }}>
                {tool.whyItMatters}
              </p>
            </div>
          )}
        </section>

        {/* ── Who should use it ── */}
        {tool.targetUsers && tool.targetUsers.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Who Should Use This?</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tool.targetUsers.map((user, i) => (
                <span
                  key={i}
                  style={{
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    padding: '6px 14px', borderRadius: 999,
                    fontSize: 13, fontWeight: 600, color: 'var(--on-surface)',
                  }}
                >
                  {user}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Step by step guide ── */}
        {tool.steps && tool.steps.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
              How to Use {tool.name} — Step by Step
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {tool.steps.map((s) => (
                <div
                  key={s.step}
                  style={{
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 12, padding: '16px 18px',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, flexShrink: 0,
                  }}>
                    {s.step}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 1-Week Learning Plan ── */}
        {tool.weeklyLearningPlan && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
              1-Week Learning Plan: {tool.name}
            </h2>
            <div style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              borderRadius: 'var(--radius-lg)', padding: 24,
            }}>
              {tool.weeklyLearningPlan.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                    paddingBottom: i < tool.weeklyLearningPlan.length - 1 ? 16 : 0,
                    marginBottom: i < tool.weeklyLearningPlan.length - 1 ? 16 : 0,
                    borderBottom: i < tool.weeklyLearningPlan.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  }}
                >
                  <span style={{
                    fontSize: 12, fontWeight: 800, color: 'var(--primary)',
                    background: 'rgba(234,88,12,0.15)', padding: '3px 10px',
                    borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    {item.day}
                  </span>
                  <span style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>{item.task}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Prompt Templates ── */}
        {tool.prompts && tool.prompts.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
              Copy-Paste Prompt Templates
            </h2>
            <p style={{ fontSize: 13, color: 'var(--secondary)', margin: '0 0 16px' }}>
              Use these prompts directly in {tool.name}. Replace text in [brackets] with your details.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tool.prompts.map((p, i) => (
                <PromptBox key={i} title={p.title} text={p.text} />
              ))}
            </div>
          </section>
        )}

        {/* ── Limitations ── */}
        {tool.limitations && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
              Limitations to Know
            </h2>
            <div style={{
              padding: '14px 18px', borderRadius: 10,
              background: '#FFF7ED', border: '1px solid #FED7AA',
              fontSize: 14, color: '#9A3412', lineHeight: 1.6,
            }}>
              {tool.limitations}
            </div>
          </section>
        )}

        {/* ── Related Tools ── */}
        {related.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
              Related Tools
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {related.map(rel => (
                <Link
                  key={rel.slug}
                  href={`/ai-tools/${rel.slug}`}
                  style={{
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 12, padding: '14px 16px',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--primary)' }}>
                    {rel.logo}
                  </span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>{rel.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>{rel.category}</div>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--secondary)', marginLeft: 'auto' }}>
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA back to tools ── */}
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <Link href="/ai-tools" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 24px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
            Back to All AI Tools
          </Link>
        </div>
      </div>
    </div>
  )
}
