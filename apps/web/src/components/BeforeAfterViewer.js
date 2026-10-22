'use client'

import { useState } from 'react'
import styles from './BeforeAfterViewer.module.css'

export default function BeforeAfterViewer({ example, toolName }) {
  const [activeTab, setActiveTab] = useState('simulator') // 'simulator' | 'compare'
  const [simulationStep, setSimulationStep] = useState('done') // 'thinking' | 'done'
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedOutput, setCopiedOutput] = useState(false)

  if (!example) return null

  const displayTool = toolName || 'AI'
  const promptText = example.studentRawInput || ''
  const outputText = example.aiTransformedOutput || ''

  const handleCopyPrompt = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(promptText)
        setCopiedPrompt(true)
        setTimeout(() => setCopiedPrompt(false), 2200)
      }
    } catch (e) {
      console.error('Failed to copy prompt', e)
    }
  }

  const handleCopyOutput = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(outputText)
        setCopiedOutput(true)
        setTimeout(() => setCopiedOutput(false), 2200)
      }
    } catch (e) {
      console.error('Failed to copy output', e)
    }
  }

  const handleRunSimulation = () => {
    setSimulationStep('thinking')
    setTimeout(() => {
      setSimulationStep('done')
    }, 1200)
  }

  return (
    <div className={styles.caseStudyCard}>
      {/* Header */}
      <div className={styles.caseStudyHeader}>
        {example.examContext && (
          <span className={styles.contextBadge}>{example.examContext}</span>
        )}
        <h3 className={styles.caseTitle}>{example.title}</h3>
        {example.problemStatement && (
          <p className={styles.problemStatement}>
            <strong>Exam Topic / Study Scenario: </strong> {example.problemStatement}
          </p>
        )}
      </div>

      {/* Mode Toolbar: Switch Between Interactive Simulation & Side-by-Side Comparison */}
      <div className={styles.modeToolbar}>
        <div className={styles.tabGroup} role="tablist" aria-label="Demonstration View">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'simulator'}
            onClick={() => setActiveTab('simulator')}
            className={`${styles.tabBtn} ${activeTab === 'simulator' ? styles.tabBtnActive : ''}`}
          >
            <span className={`material-symbols-outlined ${styles.tabIcon}`}>smart_toy</span>
            <span>Interactive Prompt Simulator</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'compare'}
            onClick={() => setActiveTab('compare')}
            className={`${styles.tabBtn} ${activeTab === 'compare' ? styles.tabBtnActive : ''}`}
          >
            <span className={`material-symbols-outlined ${styles.tabIcon}`}>compare_arrows</span>
            <span>Side-by-Side Comparison</span>
          </button>
        </div>

        <div className={styles.actionGroup}>
          <button
            type="button"
            onClick={handleRunSimulation}
            disabled={simulationStep === 'thinking'}
            className={styles.runSimBtn}
            title="Watch the prompt submission and AI generation live"
          >
            <span className={`material-symbols-outlined ${styles.btnIcon}`}>
              {simulationStep === 'thinking' ? 'autorenew' : 'play_circle'}
            </span>
            <span>{simulationStep === 'thinking' ? 'Generating...' : 'Replay Live Demo'}</span>
          </button>
          <button
            type="button"
            onClick={handleCopyPrompt}
            className={`${styles.copyPromptTopBtn} ${copiedPrompt ? styles.copyPromptTopBtnCopied : ''}`}
            title="Copy this prompt to paste into the AI tool"
          >
            <span className={`material-symbols-outlined ${styles.btnIcon}`}>
              {copiedPrompt ? 'check' : 'content_copy'}
            </span>
            <span>{copiedPrompt ? 'Prompt Copied!' : 'Copy This Prompt'}</span>
          </button>
        </div>
      </div>

      {/* ── View 1: Interactive Chat Simulator ── */}
      {activeTab === 'simulator' && (
        <div className={styles.chatSimulator}>
          <div className={styles.chatWindowHeader}>
            <span className={styles.liveDot}></span>
            <span>{displayTool} Live Study Session Simulation</span>
          </div>

          {/* User Message (Prompt Input) */}
          <div className={styles.chatMessageUser}>
            <div className={styles.userAvatar}>
              <span className={`material-symbols-outlined ${styles.avatarIcon}`}>person</span>
            </div>
            <div className={styles.userContentArea}>
              <div className={styles.userLabelRow}>
                <span className={styles.userRoleName}>You (Aspirant)</span>
                <span className={styles.stepTagUser}>Step 1: The Prompt You Type</span>
              </div>
              <div className={styles.userBubble}>{promptText}</div>
              <div className={styles.promptTipSubtext}>
                <span className="material-symbols-outlined">info</span>
                <span>Copy this exact prompt and paste it into {displayTool} during your revision</span>
              </div>
            </div>
          </div>

          {/* Thinking State Animation */}
          {simulationStep === 'thinking' && (
            <div className={styles.thinkingBox}>
              <span className={`material-symbols-outlined ${styles.spinIcon}`}>autorenew</span>
              <span className={styles.thinkingText}>{displayTool} is retrieving official acts & structuring model notes</span>
              <span className={styles.pulseDots}>
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          )}

          {/* AI Response Message (Transformed Model Output) */}
          {simulationStep === 'done' && (
            <div className={styles.chatMessageAi}>
              <div className={styles.aiAvatar}>
                <span className={`material-symbols-outlined ${styles.avatarIcon}`}>auto_awesome</span>
              </div>
              <div className={styles.aiContentArea}>
                <div className={styles.aiLabelRow}>
                  <span className={styles.aiRoleName}>{displayTool} Model Output</span>
                  <span className={styles.stepTagAi}>Step 2: Instant Exam-Ready Result</span>
                </div>
                <div className={styles.aiBubble}>
                  <div>{outputText}</div>
                  <div className={styles.aiBubbleActions}>
                    <button
                      type="button"
                      onClick={handleCopyOutput}
                      className={`${styles.copyAnswerBtn} ${copiedOutput ? styles.copyAnswerBtnCopied : ''}`}
                    >
                      <span className={`material-symbols-outlined ${styles.btnIcon}`}>
                        {copiedOutput ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedOutput ? 'Answer Copied!' : 'Copy Model Notes'}</span>
                    </button>
                    <div className={styles.verifiedTag}>
                      <span className={`material-symbols-outlined ${styles.verifiedIcon}`}>verified</span>
                      <span>Exam-Scoring Blueprint</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── View 2: Side-by-Side Comparison Grid ── */}
      {activeTab === 'compare' && (
        <div className={styles.comparisonGrid}>
          {/* Left: Raw Student Draft */}
          <div className={styles.beforeCol}>
            <div className={styles.colHeader}>
              <span className={`material-symbols-outlined ${styles.colIcon} ${styles.beforeHeader}`}>
                cancel
              </span>
              <div>
                <div className={styles.beforeHeader}>❌ Before (The Old Manual Way)</div>
                <div className={styles.colSub}>What a student writes manually (casual, loses exam marks)</div>
              </div>
            </div>
            <div className={styles.draftText}>{promptText}</div>
          </div>

          {/* Right: AI Transformed Output */}
          <div className={styles.afterCol}>
            <div className={styles.colHeader}>
              <span className={`material-symbols-outlined ${styles.colIcon} ${styles.afterHeader}`}>
                check_circle
              </span>
              <div>
                <div className={styles.afterHeader}>✅ After (Instant Output with {displayTool})</div>
                <div className={styles.colSub}>Official exam-scoring facts, legal sections & model points</div>
              </div>
            </div>
            <div className={styles.draftText}>{outputText}</div>
          </div>
        </div>
      )}

      {/* Score Impact Analysis */}
      {example.scoreImpactAnalysis && (
        <div className={styles.scoreBanner}>
          <span className={`material-symbols-outlined ${styles.scoreBannerIcon}`}>
            trending_up
          </span>
          <div className={styles.scoreBannerContent}>
            <strong>Why This Scores Top Marks & Saves Time: </strong>
            {example.scoreImpactAnalysis}
          </div>
        </div>
      )}
    </div>
  )
}
