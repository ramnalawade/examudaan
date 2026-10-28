// ============================================================
// lib/prepVault.js — Personal Weakness & Revision Vault
// ExamUdaan.in — Client-first LocalStorage with Leitner Spaced Repetition
// ============================================================

const STORAGE_KEY = 'examudaan_prep_vault_v1'

const DEFAULT_VAULT = {
  lastUpdated: new Date().toISOString(),
  profile: {
    targetExam: 'MPSC State Services & Combined',
    dailyGoal: 20
  },
  attempts: [],
  mistakeNotebook: [],
  bookmarkedQuestions: [],
  subjectAccuracy: {},
  topicWeaknesses: {}
}

/**
 * Safe local storage reader (SSR safe)
 */
export function getPrepVault() {
  if (typeof window === 'undefined') return DEFAULT_VAULT
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_VAULT
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_VAULT, ...parsed }
  } catch (err) {
    console.warn('[prepVault] Error reading from localStorage:', err)
    return DEFAULT_VAULT
  }
}

/**
 * Safe local storage writer
 */
export function savePrepVault(vault) {
  if (typeof window === 'undefined') return
  try {
    vault.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault))
    // Dispatch custom event for cross-component reactive updates
    window.dispatchEvent(new CustomEvent('examudaan:vault_updated', { detail: vault }))
  } catch (err) {
    console.warn('[prepVault] Error saving to localStorage:', err)
  }
}

/**
 * Record a full mock test or sectional test attempt
 */
export function recordTestAttempt({
  testSlug,
  testTitle,
  examCadre = 'MPSC',
  score,
  maxMarks,
  percentage,
  timeSpentSeconds = 0,
  questions = [], // Array of question objects with { id, question, options, correct, userAnswer, explanation, subject, topic }
}) {
  const vault = getPrepVault()
  const now = new Date()

  let correctCount = 0
  let wrongCount = 0
  let skippedCount = 0

  const subjectStats = { ...vault.subjectAccuracy }
  const topicStats = { ...vault.topicWeaknesses }
  const mistakes = [...vault.mistakeNotebook]

  questions.forEach(q => {
    const sub = q.subject || 'General Studies'
    const top = q.topic || 'General'

    // Init subject stats
    if (!subjectStats[sub]) {
      subjectStats[sub] = { attempted: 0, correct: 0, wrong: 0, accuracyPercent: 0 }
    }
    // Init topic stats
    if (!topicStats[top]) {
      topicStats[top] = { topic: top, subject: sub, attempted: 0, wrong: 0, accuracyPercent: 0 }
    }

    if (!q.userAnswer) {
      skippedCount++
      return
    }

    const isCorrect = String(q.userAnswer).trim().toUpperCase() === String(q.correct).trim().toUpperCase()

    subjectStats[sub].attempted++
    topicStats[top].attempted++

    if (isCorrect) {
      correctCount++
      subjectStats[sub].correct++
    } else {
      wrongCount++
      subjectStats[sub].wrong++
      topicStats[top].wrong++

      // Add to Mistake Notebook if not already present
      const existingIdx = mistakes.findIndex(m => String(m.id) === String(q.id))
      const mistakeItem = {
        id: q.id || `mistake_${Date.now()}_${Math.random()}`,
        questionText: q.question || q.text,
        subject: sub,
        topic: top,
        exam: q.exam || testTitle,
        year: q.year || now.getFullYear(),
        options: q.options || {},
        userAnswer: q.userAnswer,
        correctAnswer: q.correct,
        explanation: q.explanation || null,
        dateAdded: now.toISOString(),
        reviewCount: 0,
        // First Leitner spaced interval: +1 day
        nextReviewDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'unrevised'
      }

      if (existingIdx >= 0) {
        mistakes[existingIdx] = { ...mistakes[existingIdx], ...mistakeItem, reviewCount: mistakes[existingIdx].reviewCount }
      } else {
        mistakes.unshift(mistakeItem)
      }
    }

    subjectStats[sub].accuracyPercent = Math.round((subjectStats[sub].correct / subjectStats[sub].attempted) * 100)
    topicStats[top].accuracyPercent = Math.round(((topicStats[top].attempted - topicStats[top].wrong) / topicStats[top].attempted) * 100)
  })

  const totalAttempted = correctCount + wrongCount
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0

  const attemptRecord = {
    id: `att_${Date.now()}`,
    testSlug,
    testTitle,
    examCadre,
    date: now.toISOString(),
    score: parseFloat(score || 0),
    maxMarks: parseFloat(maxMarks || 0),
    percentage: parseFloat(percentage || 0),
    accuracy,
    timeSpentSeconds,
    totalQuestions: questions.length,
    correctCount,
    wrongCount,
    skippedCount
  }

  vault.attempts.unshift(attemptRecord)
  vault.mistakeNotebook = mistakes
  vault.subjectAccuracy = subjectStats
  vault.topicWeaknesses = topicStats

  savePrepVault(vault)
  return attemptRecord
}

/**
 * Record a single PYQ answer from subject drill or quiz
 */
export function recordSingleQuestionAnswer(question, userAnswer, isCorrect) {
  const vault = getPrepVault()
  const now = new Date()
  const sub = question.subject || 'General Studies'
  const top = question.topic || 'General'

  // Update subject stats
  if (!vault.subjectAccuracy[sub]) {
    vault.subjectAccuracy[sub] = { attempted: 0, correct: 0, wrong: 0, accuracyPercent: 0 }
  }
  vault.subjectAccuracy[sub].attempted++

  // Update topic stats
  if (!vault.topicWeaknesses[top]) {
    vault.topicWeaknesses[top] = { topic: top, subject: sub, attempted: 0, wrong: 0, accuracyPercent: 0 }
  }
  vault.topicWeaknesses[top].attempted++

  if (isCorrect) {
    vault.subjectAccuracy[sub].correct++
  } else {
    vault.subjectAccuracy[sub].wrong++
    vault.topicWeaknesses[top].wrong++

    // Add to Mistake Notebook
    const existingIdx = vault.mistakeNotebook.findIndex(m => String(m.id) === String(question.id))
    const mistakeItem = {
      id: question.id,
      questionText: question.question || question.text,
      subject: sub,
      topic: top,
      exam: question.exam || 'MPSC Practice Drill',
      year: question.year || now.getFullYear(),
      options: question.options || {},
      userAnswer,
      correctAnswer: question.correct,
      explanation: question.explanation || null,
      dateAdded: now.toISOString(),
      reviewCount: 0,
      nextReviewDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'unrevised'
    }

    if (existingIdx >= 0) {
      vault.mistakeNotebook[existingIdx] = { ...vault.mistakeNotebook[existingIdx], ...mistakeItem }
    } else {
      vault.mistakeNotebook.unshift(mistakeItem)
    }
  }

  vault.subjectAccuracy[sub].accuracyPercent = Math.round((vault.subjectAccuracy[sub].correct / vault.subjectAccuracy[sub].attempted) * 100)
  vault.topicWeaknesses[top].accuracyPercent = Math.round(((vault.topicWeaknesses[top].attempted - vault.topicWeaknesses[top].wrong) / vault.topicWeaknesses[top].attempted) * 100)

  savePrepVault(vault)
}

/**
 * Leitner Spaced Repetition Step
 * intervals: Step 1 (+1 day), Step 2 (+3 days), Step 3 (+7 days), Step 4 (+21 days) -> Mastered
 */
export function reviewMistakeItem(questionId, rememberSuccess) {
  const vault = getPrepVault()
  const idx = vault.mistakeNotebook.findIndex(m => String(m.id) === String(questionId))
  if (idx === -1) return

  const item = vault.mistakeNotebook[idx]
  const now = new Date()

  if (rememberSuccess) {
    item.reviewCount = (item.reviewCount || 0) + 1
    if (item.reviewCount >= 3) {
      item.status = 'mastered'
      item.nextReviewDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
    } else if (item.reviewCount === 2) {
      item.status = 'reviewing'
      item.nextReviewDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    } else {
      item.status = 'reviewing'
      item.nextReviewDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  } else {
    // Reset to unrevised and re-prompt in 24 hours
    item.reviewCount = 0
    item.status = 'unrevised'
    item.nextReviewDate = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
  }

  vault.mistakeNotebook[idx] = item
  savePrepVault(vault)
}

/**
 * Remove question from mistake notebook
 */
export function removeMistakeItem(questionId) {
  const vault = getPrepVault()
  vault.mistakeNotebook = vault.mistakeNotebook.filter(m => String(m.id) !== String(questionId))
  savePrepVault(vault)
}

/**
 * Toggle bookmark
 */
export function toggleQuestionBookmark(question) {
  const vault = getPrepVault()
  const exists = vault.bookmarkedQuestions.some(b => String(b.id) === String(question.id))

  if (exists) {
    vault.bookmarkedQuestions = vault.bookmarkedQuestions.filter(b => String(b.id) !== String(question.id))
  } else {
    vault.bookmarkedQuestions.unshift({
      id: question.id,
      questionText: question.question || question.text,
      subject: question.subject || 'General Studies',
      topic: question.topic || 'General',
      exam: question.exam || 'MPSC',
      options: question.options || {},
      correctAnswer: question.correct,
      explanation: question.explanation || null,
      dateAdded: new Date().toISOString()
    })
  }

  savePrepVault(vault)
  return !exists
}

export function isQuestionBookmarked(questionId) {
  const vault = getPrepVault()
  return vault.bookmarkedQuestions.some(b => String(b.id) === String(questionId))
}

/**
 * Generate seed starter data for demonstrating the feature if student is new
 */
export function seedSamplePreparationData() {
  const vault = getPrepVault()
  if (vault.attempts.length > 0 || vault.mistakeNotebook.length > 0) return vault

  const sampleQuestions = [
    {
      id: 'demo_1',
      question: 'महाराष्ट्रात सर्वाधिक दगडी कोळशाचे साठे कोणत्या नदीच्या खोऱ्यात आढळतात?',
      options: { A: 'तापी खोरे', B: 'वर्धा-वैनगंगा खोरे', C: 'गोदावरी खोरे', D: 'कृष्णा खोरे' },
      correct: 'B',
      userAnswer: 'C',
      explanation: 'महाराष्ट्रातील सुमारे ९०% पेक्षा जास्त दगडी कोळशाचे साठे विदर्भातील वर्धा व वैनगंगा नदीखोऱ्यात (चंद्रपूर, यवतमाळ व नागपूर जिल्हे) आढळतात.',
      subject: 'Geography',
      topic: 'महाराष्ट्र खनिज संपत्ती',
      exam: 'MPSC Group B Combined 2023'
    },
    {
      id: 'demo_2',
      question: 'भारतीय राज्यघटनेतील ७३व्या घटनादुरुस्तीनुसार पंचायतींना किती विषयांवर अधिकार प्रदान करण्यात आले आहेत?',
      options: { A: '२१ विषय', B: '२९ विषय', C: '१८ विषय', D: '३३ विषय' },
      correct: 'B',
      userAnswer: 'A',
      explanation: '७३व्या घटनादुरुस्ती कायद्यान्वये ११व्या परिशिष्टात पंचायतींसाठी २९ कार्यात्मक विषयांची नोंद करण्यात आली आहे.',
      subject: 'Polity',
      topic: 'Panchayati Raj',
      exam: 'MPSC Rajyaseva Prelims 2024'
    },
    {
      id: 'demo_3',
      question: 'महात्मा ज्योतिराव फुले यांनी सत्यशोधक समाजाची स्थापना कोणत्या वर्षी केली?',
      options: { A: '१८७३', B: '१८८५', C: '१८५७', D: '१८९०' },
      correct: 'A',
      userAnswer: 'B',
      explanation: '२४ सप्टेंबर १८७३ रोजी पुणे येथे सत्यशोधक समाजाची स्थापना झाली. "सर्वसाक्षी जगत्पती त्याला नकोच मध्यस्थी" हे याचे ब्रीदवाक्य होते.',
      subject: 'History',
      topic: 'Maharashtra Social Reformers',
      exam: 'MPSC Group C Combined 2022'
    }
  ]

  return recordTestAttempt({
    testSlug: 'mpsc-combined-full-prelims',
    testTitle: 'MPSC Combined Group B & C Prelims Full Mock 1',
    examCadre: 'Combined Group B',
    score: 36.5,
    maxMarks: 100,
    percentage: 36.5,
    timeSpentSeconds: 3420,
    questions: sampleQuestions
  })
}
