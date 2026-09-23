// ============================================================
// lib/youtubeData.js — Master channel & video data for YouTube Hub
// Used by /youtube (page) and /sitemap.js (sitemap indexing)
// ============================================================

export const ALL_CHANNELS = [
  // MPSC
  { name: 'MPSC World',                channelId: 'UC-x-2VDvHZiT56oH4TnkHSA', subscribers: '3.2M', lang: 'Marathi', exam: 'mpsc',    icon: '🔶' },
  { name: 'StudyIQ Education Marathi', channelId: 'UCpGGl9ktOmtDlnS3wsDHWKQ', subscribers: '1.8M', lang: 'Marathi', exam: 'mpsc',    icon: '📚' },
  { name: 'Chalu Ghadamodi',           channelId: 'UCYFlqyqAG0qMNhSUVa_F8fg', subscribers: '900K', lang: 'Marathi', exam: 'mpsc',    icon: '📰' },
  { name: 'MH Study Hub',              channelId: 'UCxxxxMHStudyHub',           subscribers: '210K', lang: 'Marathi', exam: 'mpsc',    icon: '🏫' },
  // UPSC
  { name: 'StudyIQ IAS',               channelId: 'UCpgGGl9ktOmtDlnS3wsDHWKQ', subscribers: '15M',  lang: 'Hindi',   exam: 'upsc',   icon: '🎯' },
  { name: 'Drishti IAS',               channelId: 'UCiilwfgstNWmN6OlKfpDMRg',  subscribers: '12M',  lang: 'Hindi',   exam: 'upsc',   icon: '👁️' },
  { name: 'Insights IAS',              channelId: 'UCBzxhJIiQ5Lop-oi5fnp8Eg',  subscribers: '850K', lang: 'English', exam: 'upsc',   icon: '💡' },
  // Banking
  { name: 'Adda247',                   channelId: 'UCGQxJFLpEcMVFzfpBmEb8Aw',  subscribers: '5M',   lang: 'Hindi',   exam: 'banking', icon: '🏦' },
  { name: 'Oliveboard',                channelId: 'UCMFe5lmrXGHFU6i43H7E_kQ',  subscribers: '2.2M', lang: 'English', exam: 'banking', icon: '📊' },
  { name: 'ixamBee',                   channelId: 'UCJJlSBs8UzOYp7OHhVB6-Dg',  subscribers: '1.1M', lang: 'English', exam: 'banking', icon: '🐝' },
  // SSC
  { name: 'SSC Adda',                  channelId: 'UC3eGIcEKAqyzFihrHPq3u7Q',  subscribers: '3.1M', lang: 'Hindi',   exam: 'ssc',    icon: '📝' },
  // Railways
  { name: 'RRB NTPC Prep',             channelId: 'UCxxxxRailway',              subscribers: '2.8M', lang: 'Hindi',   exam: 'rrb',    icon: '🚂' },
  // GATE
  { name: 'GATE Wallah',               channelId: 'UCieMbJkwsrXIANOdBF_nVoA',  subscribers: '5.6M', lang: 'English', exam: 'gate',   icon: '⚙️' },
  { name: 'NPTEL',                     channelId: 'UCFxIDRMDSI_Z_6ndPQnOSDg',  subscribers: '4.2M', lang: 'English', exam: 'gate',   icon: '🎓' },
  // Teaching
  { name: 'Lets Learn',                channelId: 'UCxxxxLetsLearn',            subscribers: '1.2M', lang: 'Hindi',   exam: 'teaching', icon: '✏️' },
]

export const EXAM_FILTERS = [
  { id: 'all',      label: 'All Exams' },
  { id: 'mpsc',     label: 'MPSC' },
  { id: 'upsc',     label: 'UPSC' },
  { id: 'banking',  label: 'Banking' },
  { id: 'ssc',      label: 'SSC' },
  { id: 'rrb',      label: 'Railways' },
  { id: 'gate',     label: 'GATE' },
  { id: 'teaching', label: 'Teaching' },
]

export const LANG_FILTERS = [
  { id: 'all',     label: 'All Languages' },
  { id: 'Marathi', label: '🔶 Marathi' },
  { id: 'Hindi',   label: '🔵 Hindi' },
  { id: 'English', label: '🟢 English' },
]

// ── Curated Pre-Cooked Educational Videos ────────────────────
export const PRECOOKED_VIDEOS = [
  {
    videoId: 'pAgnJDJN4VA',
    title: 'Google NotebookLM Complete Tutorial: Convert Any PDF into Audio Podcast & Study Guide',
    channelTitle: 'ExamUdaan AI Labs',
    exam: 'ai',
    examBadge: 'AI Study Tools',
    badgeColor: '#10B981',
    lang: 'English / Hindi',
    duration: '22:15',
    thumbnail: 'https://i.ytimg.com/vi/pAgnJDJN4VA/mqdefault.jpg',
    description: 'Master how to upload government gazettes, 400-page textbooks, and notes into Google NotebookLM to generate instant audio overviews, MCQs, and flashcards.',
  },
  {
    videoId: 'Z-zNHHpX3iw',
    title: 'Anki Flashcard System for Competitive Exams: Spaced Repetition Mastery',
    channelTitle: 'Anki Pro Hub',
    exam: 'ai',
    examBadge: 'AI Study Tools',
    badgeColor: '#10B981',
    lang: 'English',
    duration: '18:40',
    thumbnail: 'https://i.ytimg.com/vi/Z-zNHHpX3iw/mqdefault.jpg',
    description: 'Learn how to remember GS facts, historical dates, and vocabulary permanently using Anki’s scientifically proven spaced repetition algorithm.',
  },
  {
    videoId: 'ScMzIvxBSi4',
    title: 'MPSC Rajyaseva & Combine 2026: Complete Strategy, Syllabus & Booklist',
    channelTitle: 'MPSC World',
    exam: 'mpsc',
    examBadge: 'MPSC',
    badgeColor: '#EA580C',
    lang: 'Marathi',
    duration: '38:20',
    thumbnail: 'https://i.ytimg.com/vi/ScMzIvxBSi4/mqdefault.jpg',
    description: 'Complete analysis of MPSC examination patterns, prelims vs mains syllabus breakdown, Maharashtra geography, and recommended Marathi booklist.',
  },
  {
    videoId: 'uS3S4UoX6-w',
    title: 'UPSC GS Paper 1 — Top 50 High-Yield Themes & Answer Writing Blueprint',
    channelTitle: 'StudyIQ IAS',
    exam: 'upsc',
    examBadge: 'UPSC',
    badgeColor: '#2563EB',
    lang: 'Hindi',
    duration: '45:10',
    thumbnail: 'https://i.ytimg.com/vi/uS3S4UoX6-w/mqdefault.jpg',
    description: 'Comprehensive analysis of modern history, art & culture, physical geography, and Indian society themes with high probability in UPSC Prelims & Mains.',
  },
  {
    videoId: 'o_XVt5rdpFY',
    title: 'Banking PO / Clerk 2026: Quantitative Aptitude Speed Math & Short Tricks Marathon',
    channelTitle: 'Adda247 Banking',
    exam: 'banking',
    examBadge: 'Banking',
    badgeColor: '#7C3AED',
    lang: 'Hindi',
    duration: '52:18',
    thumbnail: 'https://i.ytimg.com/vi/o_XVt5rdpFY/mqdefault.jpg',
    description: 'Vedic math shortcuts, approximation tricks, quadratic equation methods, and arithmetic concepts to score 30+ marks in IBPS PO/Clerk prelims.',
  },
  {
    videoId: 'VYOjWnS4cMY',
    title: 'SSC CGL 2026: Notification Breakdown, Complete Syllabus & 90-Day Roadmap',
    channelTitle: 'SSC Adda247',
    exam: 'ssc',
    examBadge: 'SSC & RRB',
    badgeColor: '#DC2626',
    lang: 'Hindi',
    duration: '34:50',
    thumbnail: 'https://i.ytimg.com/vi/VYOjWnS4cMY/mqdefault.jpg',
    description: 'Everything you need to know about SSC CGL: tier-1 exam pattern, sectional timing, computer qualification, and tier-2 merit strategy.',
  },
  {
    videoId: 'eALQAHLUdkU',
    title: 'GATE 2026 Computer Science: Complete 6-Month Preparation Roadmap from Zero',
    channelTitle: 'GATE Wallah',
    exam: 'gate',
    examBadge: 'GATE',
    badgeColor: '#0891B2',
    lang: 'English / Hindi',
    duration: '29:45',
    thumbnail: 'https://i.ytimg.com/vi/eALQAHLUdkU/mqdefault.jpg',
    description: 'Subject-wise priority order for Data Structures, Algorithms, DBMS, Operating Systems, and TOC for GATE CSE aspirants.',
  },
]
