'use client'

import { useState } from 'react'

export default function PromptBox({ title, text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (e) {
      console.error('Failed to copy', e)
    }
  }

  return (
    <div
      style={{
        background: 'var(--surface-container-lowest)',
        border: '1px solid var(--outline-variant)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '10px 16px',
          background: 'var(--primary-fixed)',
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--primary)',
          borderBottom: '1px solid var(--outline-variant)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{title}</span>
        <button
          onClick={handleCopy}
          type="button"
          style={{
            background: copied ? '#16A34A' : 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            transition: 'background 0.15s ease',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Copied!' : 'Copy Prompt'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '14px 16px',
          fontSize: 12.5,
          lineHeight: 1.6,
          color: 'var(--on-surface)',
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          background: 'transparent',
        }}
      >
        {text}
      </pre>
    </div>
  )
}
