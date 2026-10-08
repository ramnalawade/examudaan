// ============================================================
// app/ai-tools/page.js — ExamUdaan AI Tools Directory
// 54 curated tools with category filters + detail page links
// Fully bilingual in Marathi & English using useLanguage()
// ============================================================

'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from '../../context/LanguageContext'
import { AI_TOOLS, AI_TOOL_CATEGORIES } from '../../lib/aiToolsData'
import ResumeBuilder from '../../components/ResumeBuilder'
import CoverLetterBuilder from '../../components/CoverLetterBuilder'

// ── Category translation mappings ────────────────────────────
const CATEGORY_NAMES_MR = {
  All: 'सर्व साधने',
  'MPSC / Govt Exam': 'MPSC / सरकारी परीक्षा',
  Study: 'अभ्यास व नोट्स',
  Research: 'संशोधन व शोध',
  Writing: 'लेखन व निबंध',
  Presentation: 'सादरीकरण',
  Design: 'डिझाइन व ग्राफिक्स',
  Dev: 'कोडिंग व डेव्हलपमेंट',
  Productivity: 'वेळ व्यवस्थापन',
  'AI Hub': 'AI हब मॉडेल्स',
}

// ── Interview questions by role (Bilingual) ───────────────────
const INTERVIEW_QUESTIONS = {
  mpsc: [
    {
      q_en: 'Why do you want to join the Maharashtra government services?',
      q_mr: 'तुम्हाला महाराष्ट्र शासकीय सेवेत का यायचे आहे?',
      hint_en: 'STAR method: mention a specific Maharashtra developmental issue you want to solve.',
      hint_mr: 'STAR पद्धत: महाराष्ट्रातील एका विशिष्ट सामाजिक किंवा प्रशासकीय आव्हानाचा उल्लेख करा.',
    },
    {
      q_en: 'Explain the significance of Article 244 and its relevance to Maharashtra\'s tribal areas.',
      q_mr: 'कलम २४४ चे महत्त्व आणि महाराष्ट्रातील आदिवासी/पेसा क्षेत्राशी त्याचा संबंध स्पष्ट करा.',
      hint_en: 'Connect to 5th Schedule, tribal welfare, PESA Act and local governance.',
      hint_mr: '५ वी अनुसूची, पेसा कायदा, आदिवासी विकास आणि स्थानिक स्वराज्य संस्थांशी जोडा.',
    },
    {
      q_en: 'What are the main challenges facing Maharashtra\'s agriculture sector and how would you address them?',
      q_mr: 'महाराष्ट्राच्या कृषी क्षेत्रापुढील प्रमुख आव्हाने कोणती आणि त्यावर तुम्ही काय उपाय सुचवाल?',
      hint_en: 'Cover: water scarcity, micro-irrigation, MSP, crop insurance, and farmer collectives.',
      hint_mr: 'दुष्काळ, सूक्ष्म सिंचन, हमीभाव, पीक विमा आणि शेतकरी उत्पादक कंपन्यांवर भर द्या.',
    },
    {
      q_en: 'Describe your understanding of the Maharashtra Land Revenue Code and 7/12 extract.',
      q_mr: 'महाराष्ट्र जमीन महसूल संहिता आणि ७/१२ उतारा याबद्दल तुमची समज स्पष्ट करा.',
      hint_en: 'Focus on land records digitization, mutation entries, and dispute resolution.',
      hint_mr: 'ई-फेरफार, ७/१२ चे डिजिटायझेशन आणि महसूल न्यायालयांची भूमिका सांगा.',
    },
    {
      q_en: 'How would you handle a situation where a superior pressures you to act unethically?',
      q_mr: 'वरिष्ठ अधिकाऱ्याने अनैतिक काम करण्याचा दबाव आणल्यास तुम्ही परिस्थिती कशी हाताळाल?',
      hint_en: 'Use administrative ethics: written dissent, service rules, RTI compliance, lawful conduct.',
      hint_mr: 'प्रशासकीय नैतिकता: लेखी नोंद, सेवा नियम, माहितीचा अधिकार व कायद्याचे पालन.',
    },
  ],
  banking: [
    {
      q_en: 'What is the difference between NPA, NPA provision, and write-off in banking?',
      q_mr: 'बँकिंगमध्ये NPA, NPA प्रोव्हिजन आणि राइट-ऑफ यातील फरक काय आहे?',
      hint_en: 'NPA > 90 days overdue. Provision is accounting reserve. Write-off removes from balance sheet.',
      hint_mr: '९० दिवस थकबाकी म्हणजे NPA. प्रोव्हिजन राखीव निधी असतो आणि राइट-ऑफ खात्यातून वगळणे.',
    },
    {
      q_en: 'Explain the role of RBI as a banker\'s bank and lender of last resort.',
      q_mr: 'बँकांची बँक व अंतिम ऋणदाता म्हणून RBI ची भूमिका स्पष्ट करा.',
      hint_en: 'CRR, SLR, Repo Rate, reverse repo, and liquidity adjustment facility.',
      hint_mr: 'रेपो दर, रिव्हर्स रेपो, CRR आणि तरलतेचे नियमन.',
    },
  ],
  tech: [
    {
      q_en: 'Explain the difference between REST and GraphQL APIs. When would you choose each?',
      q_mr: 'REST आणि GraphQL API मधील फरक सांगा. तुम्ही कोणता केव्हा वापराल?',
      hint_en: 'REST: standard HTTP endpoints. GraphQL: client-specified flexible queries.',
      hint_mr: 'REST सोप्या CRUD साठी उत्तम, तर GraphQL आवश्यक तेवढाच डेटा मागवण्यासाठी.',
    },
  ],
}

// ── Category styles ─────────────────────────────────────────
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

export default function AiToolsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '60px 20px', textAlign: 'center', minHeight: '60vh' }}>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: 'var(--on-surface)', marginBottom: 10 }}>
            Top AI Tools for Students &amp; Aspirants 2026
          </h1>
          <p style={{ fontSize: 14, color: 'var(--secondary)' }}>
            Loading curated AI tools directory...
          </p>
        </div>
      }
    >
      <AiToolsContent />
    </Suspense>
  )
}

function AiToolsContent() {
  const { isMarathi } = useLanguage()
  const searchParams = useSearchParams()
  const filterParam = searchParams?.get('filter') || searchParams?.get('category')

  // Directory filters
  const [activeCategory, setActiveCategory] = useState(
    filterParam === 'mpsc' ? 'MPSC / Govt Exam' : (filterParam || 'All')
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSlug, setExpandedSlug] = useState(null)

  // Legacy interactive tool tabs
  const toolParam = searchParams?.get('tool')
  const [activeTool, setActiveTool] = useState(toolParam || null)

  // Interview state
  const [interviewRole, setInterviewRole] = useState('mpsc')
  const [questionIndex, setQuestionIndex] = useState(0)

  // Filter & sort tools
  const [toolSort, setToolSort] = useState('popular')

  const filteredTools = AI_TOOLS.filter(t => {
    if (activeCategory === 'MPSC / Govt Exam') {
      const isMpsc = t.targetUsers?.some(u => /MPSC|UPSC|Banking|Exam|State PSC|Govt|CSAT/i.test(u)) ||
        ['notebooklm', 'anki', 'deepseek', 'chatpdf', 'claude', 'perplexity', 'elevenlabs', 'consensus', 'julius', 'elicit'].includes(t.slug)
      if (!isMpsc) return false
    } else if (activeCategory !== 'All' && t.category !== activeCategory) {
      return false
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const matchName = t.name.toLowerCase().includes(q)
      const matchTagline = t.tagline.toLowerCase().includes(q)
      const matchCategory = t.category.toLowerCase().includes(q)
      const matchBadge = t.badge?.toLowerCase().includes(q)
      if (!matchName && !matchTagline && !matchCategory && !matchBadge) return false
    }

    return true
  }).sort((a, b) => {
    if (toolSort === 'alpha') return a.name.localeCompare(b.name)
    if (toolSort === 'free') return (b.free ? 1 : 0) - (a.free ? 1 : 0)
    return 0 // Default order in AI_TOOLS is by curated popularity
  })

  const qs = INTERVIEW_QUESTIONS[interviewRole] || INTERVIEW_QUESTIONS.mpsc
  const currentQ = qs[questionIndex] || qs[0]

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 80 }}>

      {/* ── Page Hero ── */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(234,88,12,0.06) 0%, var(--surface) 100%)',
        borderBottom: '1px solid var(--outline-variant)',
        padding: '36px 20px 28px',
      }}>
        <div className="container" style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 16 }}>
            <Link href="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>
              {isMarathi ? 'मुख्यपृष्ठ' : 'Home'}
            </Link>
            {' › '}
            {isMarathi ? 'AI अभ्यास साधने' : 'AI Tools'}
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--primary-fixed)', color: 'var(--primary)',
            padding: '4px 14px', borderRadius: 999,
            fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 14,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>smart_toy</span>
            {isMarathi ? 'ExamUdaan AI लॅब' : 'ExamUdaan AI Labs'}
          </div>

          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            {isMarathi ? 'AI साधने डिरेक्टरी — ChatGPT च्या पलीकडे' : 'AI Tools Directory — Beyond ChatGPT'}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--secondary)', margin: '0 0 20px', maxWidth: 740, lineHeight: 1.6 }}>
            {isMarathi
              ? `स्पर्धा परीक्षा, अभ्यास, करिअर आणि मुलाखतीसाठी निवडलेली ${AI_TOOLS.length} उपयुक्त AI साधने. प्रत्येक साधनाचा सविस्तर वापर, मराठी माहिती आणि कॉपी-पेस्ट प्रॉम्प्ट्स.`
              : `${AI_TOOLS.length} curated AI tools for exam prep, job search, study, and career growth. Every tool includes a step-by-step how-to guide with ready copy-paste prompts.`}
          </p>

          {/* Built-in tools CTA row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { key: 'resume', icon: 'description', label: isMarathi ? 'रेझ्युमे बिल्डर' : 'Resume Builder' },
              { key: 'interview', icon: 'record_voice_over', label: isMarathi ? 'मॉक मुलाखत' : 'Mock Interview' },
              { key: 'gazette', icon: 'auto_stories', label: isMarathi ? 'राजपत्र विश्लेषण' : 'Gazette Explainer' },
              { key: 'coverletter', icon: 'mail', label: isMarathi ? 'कव्हर लेटर' : 'Cover Letter' },
            ].map(btn => (
              <button
                key={btn.key}
                onClick={() => setActiveTool(activeTool === btn.key ? null : btn.key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: activeTool === btn.key ? 'var(--primary)' : 'var(--surface-container-lowest)',
                  color: activeTool === btn.key ? '#fff' : 'var(--on-surface)',
                  border: `1.5px solid ${activeTool === btn.key ? 'var(--primary)' : 'var(--outline-variant)'}`,
                  padding: '9px 16px', borderRadius: 10,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.15s ease',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1400, margin: '28px auto 0', padding: '0 20px' }}>

        {/* ── Built-in tool panels ── */}
        {activeTool === 'resume' && (
          <ResumeBuilder />
        )}

        {activeTool === 'coverletter' && (
          <CoverLetterBuilder />
        )}

        {activeTool === 'interview' && (
          <div style={{
            background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)',
            borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 32,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 16px' }}>
              {isMarathi ? 'AI मॉक मुलाखत सिम्युलेटर' : 'AI Mock Interview Simulator'}
            </h2>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[
                ['mpsc', isMarathi ? 'MPSC / सरकारी' : 'MPSC / Govt'],
                ['banking', isMarathi ? 'बँकिंग' : 'Banking'],
                ['tech', isMarathi ? 'टेक / IT' : 'Tech / IT'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => { setInterviewRole(id); setQuestionIndex(0) }}
                  style={{
                    background: interviewRole === id ? 'var(--primary)' : 'var(--surface)',
                    color: interviewRole === id ? '#fff' : 'var(--on-surface)',
                    border: `1.5px solid ${interviewRole === id ? 'var(--primary)' : 'var(--outline-variant)'}`,
                    padding: '8px 16px', borderRadius: 8,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 6 }}>
                {isMarathi
                  ? `प्रश्न ${questionIndex + 1} / ${qs.length}`
                  : `Question ${questionIndex + 1} of ${qs.length}`}
              </div>
              <div style={{
                background: 'var(--primary-fixed)', border: '1px solid var(--primary)',
                borderRadius: 10, padding: '14px 18px', fontSize: 15, fontWeight: 700, color: 'var(--on-surface)',
              }}>
                {isMarathi ? (currentQ.q_mr || currentQ.q_en) : (currentQ.q_en || currentQ.q)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 8, fontStyle: 'italic' }}>
                💡 {isMarathi ? 'टिप:' : 'Hint:'} {isMarathi ? (currentQ.hint_mr || currentQ.hint_en) : (currentQ.hint_en || currentQ.hint)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                disabled={questionIndex === 0}
                onClick={() => setQuestionIndex(i => i - 1)}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--outline-variant)',
                  padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                  cursor: questionIndex === 0 ? 'not-allowed' : 'pointer', opacity: questionIndex === 0 ? 0.5 : 1,
                  fontFamily: 'inherit',
                }}
              >
                {isMarathi ? '← मागील प्रश्न' : '← Previous'}
              </button>
              <button
                disabled={questionIndex === qs.length - 1}
                onClick={() => setQuestionIndex(i => i + 1)}
                style={{
                  background: 'var(--primary)', color: '#fff', border: 'none',
                  padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                  cursor: questionIndex === qs.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: questionIndex === qs.length - 1 ? 0.5 : 1, fontFamily: 'inherit',
                }}
              >
                {isMarathi ? 'पुढील प्रश्न →' : 'Next Question →'}
              </button>
            </div>
          </div>
        )}

        {activeTool === 'gazette' && (
          <div style={{
            background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)',
            borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 32,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 12px' }}>
              {isMarathi ? 'सरकारी राजपत्र व जाहिरात विश्लेषण' : 'Gazette & Study Explainer'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--secondary)', margin: '0 0 16px' }}>
              {isMarathi
                ? 'कोणतीही सरकारी जाहिरात किंवा शासन निर्णय (GR) कॉपी करा — ५ मुद्द्यांमध्ये सारांश मिळवा. हा प्रॉम्प्ट Claude किंवा NotebookLM मध्ये वापरा:'
                : 'Paste any government notification, gazette, or editorial — get a 5-point bilingual summary. Use this prompt in Claude or NotebookLM with your pasted content:'}
            </p>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--outline-variant)',
              borderRadius: 8, padding: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
                {isMarathi
                  ? 'राजपत्र विश्लेषण प्रॉम्प्ट — Claude / NotebookLM मध्ये वापरा:'
                  : 'GAZETTE EXPLAINER PROMPT — Copy and use in Claude / NotebookLM:'}
              </div>
              <pre style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 12, lineHeight: 1.7,
                whiteSpace: 'pre-wrap', color: 'var(--on-surface)', margin: 0,
              }}>
{`You are an MPSC/UPSC preparation expert. Read the following government notification carefully.
Summarize it in exactly 5 bullet points.

Format:
• [Key fact 1 — what it is]
• [Who is eligible / who it affects]
• [Important dates and deadlines]
• [How to apply or what action to take]
• [Marathi translation of the most important point]

Document:
[PASTE YOUR NOTIFICATION TEXT HERE]`}
              </pre>
            </div>
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => navigator.clipboard?.writeText(`You are an MPSC/UPSC preparation expert. Read the following government notification carefully.\nSummarize it in exactly 5 bullet points.\n\nFormat:\n• [Key fact 1 — what it is]\n• [Who is eligible / who it affects]\n• [Important dates and deadlines]\n• [How to apply or what action to take]\n• [Marathi translation of the most important point]\n\nDocument:\n[PASTE YOUR NOTIFICATION TEXT HERE]`)}
                style={{
                  background: 'var(--primary)', color: '#fff',
                  border: 'none', padding: '10px 20px', borderRadius: 8,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {isMarathi ? 'प्रॉम्प्ट कॉपी करा' : 'Copy Prompt'}
              </button>
            </div>
          </div>
        )}

        {/* ── Tools Directory ── */}
        <div>
          {/* Search bar & Category filter */}
          <div style={{ marginBottom: 24 }}>
            {/* ── Search + Sort row (Dominant Search, Compact Sort) ── */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
              <div className="search-hero" style={{ flex: 1, minWidth: 0 }}>
                <span className="material-symbols-outlined search-icon">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isMarathi ? `${AI_TOOLS.length}+ AI साधने शोधा (उदा. NotebookLM, फ्लॅशकार्ड, गणित, कोडिंग)...` : `Search ${AI_TOOLS.length}+ AI tools (e.g., NotebookLM, flashcards, math, literature, coding)...`}
                  style={{ height: 48, fontSize: 15 }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)', display: 'flex' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                  </button>
                )}
              </div>

              <div style={{ position: 'relative', flexShrink: 0, width: 'auto' }}>
                <select
                  value={toolSort}
                  onChange={e => setToolSort(e.target.value)}
                  className="form-select"
                  style={{
                    width: 'auto',
                    minWidth: 140,
                    maxWidth: 185,
                    flexShrink: 0,
                    height: 48,
                    padding: '0 34px 0 14px',
                    fontSize: 14,
                    fontWeight: 600,
                    borderRadius: 12,
                    background: 'var(--surface-container-lowest)',
                    border: '1px solid var(--outline-variant)',
                    cursor: 'pointer',
                    color: 'var(--on-surface)',
                  }}
                  id="ai-tools-sort-select"
                  aria-label="Sort"
                >
                  <option value="popular">{isMarathi ? 'लोकप्रिय साधने' : 'Popular First'}</option>
                  <option value="alpha">{isMarathi ? 'नावानुसार (A-Z)' : 'Name A-Z'}</option>
                  <option value="free">{isMarathi ? 'मोफत साधने आधी' : 'Free Tools First'}</option>
                </select>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  pointerEvents: 'none', color: 'var(--secondary)', fontSize: 20
                }}>
                  expand_more
                </span>
              </div>
            </div>

            {/* Filter chips */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--secondary)', whiteSpace: 'nowrap' }}>
                {isMarathi ? 'प्रवर्ग निवडा:' : 'Filter by:'}
              </span>
              {['All', 'MPSC / Govt Exam', ...AI_TOOL_CATEGORIES.filter(c => c !== 'All')].map(cat => {
                const label = isMarathi ? (CATEGORY_NAMES_MR[cat] || cat) : cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      background: activeCategory === cat ? 'var(--primary)' : 'var(--surface-container-lowest)',
                      color: activeCategory === cat ? '#fff' : 'var(--on-surface)',
                      border: `1.5px solid ${activeCategory === cat ? 'var(--primary)' : 'var(--outline-variant)'}`,
                      padding: '6px 13px', borderRadius: 8,
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.15s ease',
                    }}
                  >
                    {cat === 'MPSC / Govt Exam' ? '🏛️ ' + label : label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 20, fontWeight: 600 }}>
            {isMarathi
              ? `${filteredTools.length} साधने उपलब्ध${activeCategory !== 'All' ? ` (${CATEGORY_NAMES_MR[activeCategory] || activeCategory})` : ''}`
              : `Showing ${filteredTools.length} tool${filteredTools.length !== 1 ? 's' : ''}${activeCategory !== 'All' ? ` in ${activeCategory}` : ''}`}
            {searchQuery && ` ${isMarathi ? `— "${searchQuery}" शोध निकाल` : `matching "${searchQuery}"`}`}
          </div>

          {/* Tools grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filteredTools.map(tool => {
              const cat = CAT_COLORS[tool.category] || { bg: '#F9FAFB', color: '#374151' }
              const isExpanded = expandedSlug === tool.slug

              return (
                <div
                  key={tool.slug}
                  style={{
                    background: 'var(--surface-container-lowest)',
                    border: isExpanded ? '1.5px solid var(--primary)' : '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 20,
                    display: 'flex', flexDirection: 'column', gap: 10,
                    transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
                    boxShadow: isExpanded ? '0 4px 20px rgba(234,88,12,0.1)' : 'none',
                  }}
                >
                  {/* Icon + badges row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'var(--primary-fixed)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{tool.logo}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{
                        padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 800,
                        background: cat.bg, color: cat.color,
                      }}>
                        {isMarathi ? (CATEGORY_NAMES_MR[tool.category] || tool.category) : tool.category}
                      </span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                        background: tool.free ? '#ECFDF5' : '#FFF7ED',
                        color: tool.free ? '#065F46' : '#C2410C',
                      }}>
                        {tool.free ? (isMarathi ? 'मोफत आवृत्ती' : 'Free tier') : (isMarathi ? 'सशुल्क' : 'Paid tool')}
                      </span>
                    </div>
                  </div>

                  {/* Name + tagline */}
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 4 }}>
                      {tool.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.5 }}>
                      {tool.tagline}
                    </div>
                  </div>

                  {/* Badge */}
                  <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>
                    {tool.badge}
                  </div>

                  {/* Inline Quick Steps preview */}
                  {isExpanded && (
                    <div style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--outline-variant)',
                      borderRadius: 10,
                      padding: 12,
                      marginTop: 6,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                        <span>⚡ {isMarathi ? `${tool.name} वापरण्याच्या पायऱ्या:` : `How to Use ${tool.name} (Step-by-Step):`}</span>
                        <button
                          onClick={() => setExpandedSlug(null)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--secondary)' }}
                        >
                          ✕ {isMarathi ? 'बंद करा' : 'Close'}
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {tool.steps?.map(s => (
                          <div key={s.step} style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--on-surface)' }}>
                            <strong style={{ color: 'var(--primary)' }}>{s.step}. {s.title}:</strong> {s.desc}
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--outline-variant)', textAlign: 'right' }}>
                        <Link
                          href={`/ai-tools/${tool.slug}`}
                          style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}
                        >
                          {isMarathi ? 'संपूर्ण मार्गदर्शक व कॉपी प्रॉम्प्ट्स →' : 'View Full Guide & Copy Prompts →'}
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className="ai-tool-card-actions">
                    <Link
                      href={`/ai-tools/${tool.slug}`}
                      style={{
                        flex: 1, textAlign: 'center', minWidth: 100,
                        background: 'var(--primary)', color: '#fff',
                        padding: '8px 12px', borderRadius: 8,
                        fontSize: 13, fontWeight: 700, textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>menu_book</span>
                      {isMarathi ? 'मार्गदर्शक' : 'How to Use'}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setExpandedSlug(isExpanded ? null : tool.slug)}
                      style={{
                        padding: '8px 12px', borderRadius: 8,
                        background: isExpanded ? 'var(--primary-fixed)' : 'var(--surface-container-lowest)',
                        border: '1.5px solid var(--outline-variant)',
                        fontSize: 13, fontWeight: 700,
                        color: isExpanded ? 'var(--primary)' : 'var(--on-surface)',
                        cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                        {isExpanded ? 'expand_less' : 'visibility'}
                      </span>
                      {isExpanded ? (isMarathi ? 'लपवा' : 'Hide Steps') : (isMarathi ? 'पायऱ्या' : 'Quick Steps')}
                    </button>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 12px', borderRadius: 8,
                        background: 'var(--surface-container-lowest)',
                        border: '1.5px solid var(--outline-variant)',
                        fontSize: 13, fontWeight: 700,
                        color: 'var(--on-surface)', textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                      {isMarathi ? 'वेबसाईट' : 'Open'}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Callout: AI Academy ── */}
        <div style={{
          marginTop: 48, padding: '28px 28px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: 'var(--radius-lg)', color: '#fff',
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 20,
        }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              {isMarathi ? '🎓 केवळ साधने नव्हे, तर प्रत्यक्ष AI कोडिंग व कौशल्ये शिकायची आहेत?' : '🎓 Want hands-on AI training — not just tools?'}
            </div>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
              {isMarathi
                ? 'ExamUdaan AI अकॅडमी मध्ये सामील व्हा — २० वर्षांचा अनुभव असलेल्या आंतरराष्ट्रीय सॉफ्टवेअर आर्किटेक्टकडून थेट वीकेंड प्रशिक्षण. प्रॉम्ट इंजिनिअरिंग, Cursor, NotebookLM आणि प्रत्यक्ष प्रोजेक्ट्स.'
                : 'Join the ExamUdaan AI Academy — live weekend cohorts with a 20-year software architect. Learn prompt engineering, Cursor, Antigravity, NotebookLM, and real project building — not theory. Certificates included.'}
            </p>
          </div>
          <Link href="/ai-academy" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: 14, whiteSpace: 'nowrap' }}>
            {isMarathi ? 'AI अकॅडमी पहा →' : 'View AI Academy →'}
          </Link>
        </div>
      </div>
    </div>
  )
}
