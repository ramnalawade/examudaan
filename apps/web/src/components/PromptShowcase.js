'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getExamUseCaseRoute } from '../lib/examRoutes'
import styles from './PromptShowcase.module.css'

export default function PromptShowcase({ prompt }) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('template') // 'template' | 'example'

  const promptText = prompt.promptText || prompt.text || ''
  const title = prompt.title || 'Exam Prompt Template'
  const purpose = prompt.purpose || ''
  const targetExam = prompt.targetExam || ''
  const studentInputExample = prompt.studentInputExample || ''
  const sampleOutputPreview = prompt.sampleOutputPreview || ''

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(promptText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
      }
    } catch (e) {
      console.error('Failed to copy prompt', e)
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleRow}>
            <span className={styles.title}>{title}</span>
            {targetExam && (
              <Link
                href={getExamUseCaseRoute(targetExam)}
                className={styles.badge}
                title={`Explore ${targetExam} syllabus on ExamUdaan`}
              >
                {targetExam}
              </Link>
            )}
          </div>
          {purpose && <div className={styles.purpose}>{purpose}</div>}
        </div>

        <div className={styles.actions}>
          <button
            onClick={handleCopy}
            type="button"
            className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`}
            aria-label="Copy prompt template"
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Mega-Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabBar}>
        <button
          type="button"
          onClick={() => setActiveTab('template')}
          className={`${styles.tab} ${activeTab === 'template' ? styles.tabActive : ''}`}
        >
          <span className={`material-symbols-outlined ${styles.icon}`}>code</span>
          <span>Mega-Prompt Template</span>
        </button>

        {(studentInputExample || sampleOutputPreview) && (
          <button
            type="button"
            onClick={() => setActiveTab('example')}
            className={`${styles.tab} ${activeTab === 'example' ? styles.tabActive : ''}`}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>visibility</span>
            <span>Student Input & Output Example</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className={styles.body}>
        {activeTab === 'template' ? (
          <div>
            <pre className={styles.codeBox}>{promptText}</pre>
            <div className={styles.proTipRow}>
              <strong>How to use:</strong> Copy this prompt, paste it into the tool, and replace any text in <code>[BRACKETS]</code> with your specific syllabus question or topic.
            </div>
          </div>
        ) : (
          <div className={styles.exampleBox}>
            {studentInputExample && (
              <div className={styles.exampleSection}>
                <div className={`${styles.exampleHeader} ${styles.inputHeader}`}>
                  <span className={`material-symbols-outlined ${styles.icon}`}>edit_note</span>
                  <span>Aspirant's Input (What the student typed)</span>
                </div>
                <div className={styles.exampleText}>{studentInputExample}</div>
              </div>
            )}

            {sampleOutputPreview && (
              <div className={styles.exampleSection}>
                <div className={`${styles.exampleHeader} ${styles.outputHeader}`}>
                  <span className={`material-symbols-outlined ${styles.icon}`}>auto_awesome</span>
                  <span>AI Generated Output (What the tool produced)</span>
                </div>
                <div className={styles.exampleText}>{sampleOutputPreview}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
