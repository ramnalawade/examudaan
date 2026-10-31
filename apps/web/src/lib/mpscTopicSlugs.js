// ============================================================
// lib/mpscTopicSlugs.js — MPSC High-Frequency Concept Slugs
// ExamUdaan.in — Verified Stable Slugs for all 40 recurring topics
// ============================================================

import analyticsData from './mpscAnalyticsData.json'

export const TOPIC_SLUG_PAIRS = [
  { topic: 'GK 2025-26 Marathon', slug: 'gk-2025-26-marathon' },
  { topic: 'महाराष्ट्र खनिज संपत्ती', slug: 'maharashtra-mineral-resources' },
  { topic: 'Maharashtra Social Reformers', slug: 'maharashtra-social-reformers' },
  { topic: 'प्राणिशास्त्र', slug: 'zoology-pranishastra' },
  { topic: 'वनस्पतीशास्त्र', slug: 'botany-vanaspatishastra' },
  { topic: 'वृत्तपत्र — संस्थापक व संपादक', slug: 'newspapers-founders-editors' },
  { topic: 'State Government', slug: 'state-government' },
  { topic: 'Law', slug: 'law-legislation' },
  { topic: 'Government Schemes & Yojanas', slug: 'government-schemes-yojanas' },
  { topic: 'Five Year Plans', slug: 'five-year-plans' },
  { topic: 'Constitutional Framework & Preamble', slug: 'constitutional-framework-preamble' },
  { topic: 'Science & Technology (IT/Space)', slug: 'science-technology-it-space' },
  { topic: 'Botany (Plant Biology)', slug: 'botany-plant-biology' },
  { topic: 'Panchayati Raj', slug: 'panchayati-raj' },
  { topic: 'Industry, Trade & Reforms', slug: 'industry-trade-reforms' },
  { topic: 'Marathi Grammar', slug: 'marathi-grammar' },
  { topic: 'International Affairs & Summits', slug: 'international-affairs-summits' },
  { topic: 'महत्त्वाच्या योजना (PYQ)', slug: 'important-yojanas-pyq' },
  { topic: 'पेशी', slug: 'cell-biology-peshi' },
  { topic: 'Public Health', slug: 'public-health' },
  { topic: 'Awards & Honours', slug: 'awards-honours' },
  { topic: 'Indian Economy', slug: 'indian-economy' },
  { topic: 'Public Finance & Budget', slug: 'public-finance-budget' },
  { topic: 'Maharashtra Physical Geography', slug: 'maharashtra-physical-geography' },
  { topic: 'Zoology (Animal Biology)', slug: 'zoology-animal-biology' },
  { topic: 'Persons in News & Books', slug: 'persons-in-news-books' },
  { topic: 'पोषण', slug: 'nutrition-poshan' },
  { topic: 'प्रकाश', slug: 'light-optics-prakash' },
  { topic: 'Magnetism and Electromagnetic Spectrum', slug: 'magnetism-electromagnetic-spectrum' },
  { topic: 'गुरुत्वाकर्षण, गती व गतीचे प्रकार', slug: 'gravitation-motion-physics' },
  { topic: 'बल, कार्य, ऊर्जा, शक्ती आणि ध्वनी', slug: 'force-work-energy-sound' },
  { topic: 'चुंबकत्व व विद्युत चुंबकीय पट्टा', slug: 'magnetism-electromagnetic-waves' },
  { topic: 'विद्युत धारा', slug: 'electric-current-electricity' },
  { topic: 'पंचसृष्टी वर्गीकरण, प्राणी वर्गीकरण, वनस्पती वर्गीकरण', slug: 'five-kingdom-classification' },
  { topic: 'Poverty & Unemployment', slug: 'poverty-unemployment' },
  { topic: 'Electricity', slug: 'electricity-physics' },
  { topic: 'Light', slug: 'light-physics' },
  { topic: 'English Grammar', slug: 'english-grammar' },
  { topic: 'आरोग्यशास्त्र', slug: 'health-hygiene-arogyashastra' },
  { topic: 'India Defence Exercises', slug: 'india-defence-exercises' }
]

const TOPIC_TO_SLUG_MAP = new Map(TOPIC_SLUG_PAIRS.map(p => [p.topic, p.slug]))
const SLUG_TO_TOPIC_MAP = new Map(TOPIC_SLUG_PAIRS.map(p => [p.slug, p.topic]))

export function getTopicSlug(topic) {
  if (!topic) return ''
  if (TOPIC_TO_SLUG_MAP.has(topic)) {
    return TOPIC_TO_SLUG_MAP.get(topic)
  }
  // Fallback slugify
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function getTopicItemFromSlug(slug) {
  if (!slug) return null
  const topicName = SLUG_TO_TOPIC_MAP.get(slug)
  const hitlist = analyticsData.hitlist || []

  if (topicName) {
    const match = hitlist.find(h => h.topic === topicName)
    if (match) return { ...match, slug }
  }

  // Fallback lookup by slugifying topic names
  const match = hitlist.find(h => getTopicSlug(h.topic) === slug)
  if (match) {
    return { ...match, slug }
  }

  return null
}

export function getAllTopicSlugs() {
  return TOPIC_SLUG_PAIRS.map(p => p.slug)
}

