'use client'
// ============================================================
// app/ask/page.js — AI Exam Assistant (Upgraded)
// ExamUdaan | Gemini 2.0 Flash + Google Search Grounding
// Smart/Pro plan only
// ============================================================

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { apiFetch } from '../../lib/apiClient'

const SUGGESTED_QUESTIONS = [
  'SSC CGL 2025 eligibility criteria',
  'UPSC 2025 syllabus for GS Paper 1',
  'IBPS PO age limit for OBC candidates',
  'Which govt exam can 12th pass apply for?',
  'RRB NTPC cut off marks 2024',
]

function AskPageContent() {
  const searchParams = useSearchParams()
  const examSlug  = searchParams.get('exam') || null
  const examTitle = searchParams.get('title') || null

  const [messages,  setMessages]  = useState([])
  const [input,     setInput]     = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPro,     setIsPro]     = useState(true)  // assume true — server will reject if not
  const messagesEndRef = useRef(null)

  // Auto-welcome message
  useEffect(() => {
    const welcome = examTitle
      ? `Hi! I'm your ExamUdaan AI. I can see you're viewing **${examTitle}**. Ask me anything about eligibility, syllabus, cut-offs, or preparation strategy for this exam!`
      : `Hi! I'm your ExamUdaan AI Assistant. I can answer questions about any Indian government exam — eligibility, syllabus, important dates, preparation strategy, and more. What would you like to know?`

    setMessages([{ role: 'assistant', text: welcome, isWelcome: true }])
  }, [examTitle])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e, overrideText) {
    e?.preventDefault()
    const text = (overrideText || input).trim()
    if (!text || isLoading) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setIsLoading(true)

    try {
      const token = localStorage.getItem('eu_access_token') || localStorage.getItem('access_token')
      const res = await apiFetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          prompt: text,
          history: messages.slice(-6).filter(m => !m.isWelcome),
          examSlug,
        }),
      })

      const data = await res.json()

      if (res.status === 403) {
        setIsPro(false)
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: 'The AI Assistant is available for Smart and Pro plan subscribers.',
          isUpgradePrompt: true,
        }])
      } else if (res.status === 401) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: 'Please log in to use the AI Assistant.',
          isLoginPrompt: true,
        }])
      } else if (!res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Something went wrong. Please try again.' }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: data.reply,
          searchQueries: data.searchQueries || [],
          hasGrounding: data.hasGrounding || false,
        }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Network error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '820px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), #f97316)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', flexShrink: 0,
        }}>🧠</div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '2px' }}>AI Exam Assistant</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ExamUdaan AI v2.0</span>
            <span style={{ fontSize: '11px', padding: '1px 8px', borderRadius: 'var(--radius-full)', background: 'var(--accent-light)', color: 'var(--accent-text)', fontWeight: 600 }}>
              Live Grounded Search
            </span>
            {examTitle && (
              <span style={{ fontSize: '11px', padding: '1px 8px', borderRadius: 'var(--radius-full)', background: '#dcfce7', color: '#166534', fontWeight: 600 }}>
                Context: {examTitle.slice(0, 30)}...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ minHeight: '400px', maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '8px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '4px' }}>
            <div style={{
              background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
              border: m.role === 'user' ? 'none' : '1px solid var(--border)',
              color: m.role === 'user' ? 'white' : 'var(--text-body)',
              padding: '12px 16px',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              maxWidth: '85%',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
            }}>
              {m.text}
              {m.isUpgradePrompt && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <Link href="/pricing" className="btn-primary" style={{ padding: '7px 14px', fontSize: '13px' }}>
                    Upgrade Plan
                  </Link>
                </div>
              )}
              {m.isLoginPrompt && (
                <div style={{ marginTop: '12px' }}>
                  <Link href="/login" className="btn-primary" style={{ padding: '7px 14px', fontSize: '13px' }}>
                    Log In
                  </Link>
                </div>
              )}
            </div>

            {/* Grounding indicator */}
            {m.hasGrounding && m.searchQueries?.length > 0 && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '4px' }}>
                <span>🔍</span>
                <span>Searched: {m.searchQueries.slice(0, 2).join(', ')}</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'var(--accent)',
                    animation: 'pulse 1.2s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.7,
                  }} />
                ))}
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>Searching & thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions — shown only at start */}
      {messages.length <= 1 && (
        <div style={{ margin: '16px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(null, q)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-card)',
                color: 'var(--text-body)',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.target.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
        <input
          type="text"
          className="home-alertsInput"
          style={{ flex: 1, fontSize: '15px' }}
          placeholder="Ask about any govt exam eligibility, syllabus, cut-off..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
          id="ai-ask-input"
          autoFocus
        />
        <button
          type="submit"
          id="ai-ask-send"
          className="btn-primary"
          disabled={isLoading || !input.trim()}
          style={{ flexShrink: 0 }}
        >
          {isLoading ? '...' : 'Ask'}
        </button>
      </form>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
        AI answers may not always be accurate. Always verify with the official notification.
      </p>
    </div>
  )
}

export default function AskPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '40px' }}>Loading AI Assistant...</div>}>
      <AskPageContent />
    </Suspense>
  )
}
