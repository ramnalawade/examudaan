const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, 'careerGuideData.js');

const fileHeader = `// ============================================================================
// lib/careerGuideData.js — Comprehensive Stream & Career Decision Engine
// ExamUdaan.in — Deep Educational Guidance for 10th & 12th Students
// Covers: Science, Commerce, Arts/Humanities, Vocational/Diploma
// Detailed: Key Subjects, Entrance Exams, Live Dates, Syllabus Portions,
//           Salary Ladders, Tech Stacks, Scope, Top Colleges, Official Links
// ============================================================================

export const STREAMS = [
  {
    id: 'science',
    name: 'Science (11th & 12th PCM / PCB / PCMB)',
    shortName: 'Science',
    icon: '🔬',
    tagline: 'Engineering, Medicine, Pure Science, Aviation, Software & Space Technology',
    color: '#0284c7',
    badgeBg: '#e0f2fe',
    eligibility10th: 'Minimum 60% in 10th Board with Strong aptitude in Mathematics and General Science.',
    combinations: [
      { code: 'PCM', subjects: 'Physics, Chemistry, Mathematics', bestFor: 'Engineering, Architecture, BCA, Pilot, Defense, Pure Math' },
      { code: 'PCB', subjects: 'Physics, Chemistry, Biology', bestFor: 'MBBS, BDS, BAMS, BHMS, Pharmacy, Nursing, Biotech, Forensic, Agriculture' },
      { code: 'PCMB', subjects: 'Physics, Chemistry, Maths & Biology', bestFor: 'Dual eligibility for both Engineering and Medical fields' },
    ],
    categories: [
      { id: 'sci_eng', name: 'Engineering & Technology', icon: '💻' },
      { id: 'sci_med', name: 'Medical & Healthcare', icon: '🩺' },
      { id: 'sci_pure', name: 'Pure Sciences, Research & Agriculture', icon: '🧪' },
      { id: 'sci_cs', name: 'Computer Applications & IT', icon: '🖥️' },
      { id: 'sci_arch_aviation', name: 'Architecture, Aviation & Defense', icon: '✈️' },
      { id: 'sci_teach', name: 'Science Teaching & Academia', icon: '👨‍🏫' },
    ]
  },
  {
    id: 'commerce',
    name: 'Commerce (11th & 12th with / without Maths)',
    shortName: 'Commerce',
    icon: '💼',
    tagline: 'Chartered Accountancy, Banking, FinTech, Corporate Law, Management & Stock Markets',
    color: '#059669',
    badgeBg: '#d1fae5',
    eligibility10th: 'Minimum 50% in 10th Board. Strong interest in numbers, business, economics & data analysis.',
    combinations: [
      { code: 'Commerce + Maths', subjects: 'Accounts, Economics, Bookkeeping, Mathematics & Stats', bestFor: 'CA, Actuarial Science, Investment Banking, IIM IPMAT, B.Com Hons' },
      { code: 'Commerce + SP', subjects: 'Accounts, Economics, Secretarial Practice (SP), Org of Commerce', bestFor: 'CS (Company Secretary), BBA, Corporate Law, General Banking' },
    ],
    categories: [
      { id: 'com_prof', name: 'Elite Professional Certifications (CA / CS / CMA)', icon: '📜' },
      { id: 'com_bank_fin', name: 'Banking, Finance & Stock Markets', icon: '📈' },
      { id: 'com_mgmt', name: 'Management & Business Leadership (BBA / MBA)', icon: '🏢' },
      { id: 'com_law_tax', name: 'Corporate Law & Taxation', icon: '⚖️' },
      { id: 'com_acad', name: 'Academic Commerce & Teaching', icon: '🎓' },
    ]
  },
  {
    id: 'arts',
    name: 'Arts & Humanities (11th & 12th)',
    shortName: 'Arts / Humanities',
    icon: '🎨',
    tagline: 'Civil Services (IAS/IPS/MPSC), 5-Yr Law, Psychology, Journalism, Design & Diplomacy',
    color: '#d97706',
    badgeBg: '#fef3c7',
    eligibility10th: 'Open to all 10th pass students. Ideal for critical thinkers, writers, social observers & future leaders.',
    combinations: [
      { code: 'Social Sciences', subjects: 'History, Political Science, Geography, Sociology, Economics', bestFor: 'UPSC Civil Services, MPSC State Services, Public Policy, Academics' },
      { code: 'Behavioral & Legal', subjects: 'Psychology, Logic/Philosophy, Political Science, English Lit', bestFor: '5-Year BA LLB (CLAT), Clinical Psychology, Counselling, Judiciary' },
      { code: 'Media & Creative', subjects: 'Mass Comm, Literature, Fine Arts, Multimedia, Sociology', bestFor: 'Journalism, Fashion Design (NIFT), UI/UX (NID), Digital Media, Hospitality' },
    ],
    categories: [
      { id: 'arts_civil', name: 'Civil Services & Public Administration', icon: '🏛️' },
      { id: 'arts_law', name: 'Law & Judicial Services', icon: '⚖️' },
      { id: 'arts_psych', name: 'Psychology & Mental Health', icon: '🧠' },
      { id: 'arts_media', name: 'Media, Journalism & Communications', icon: '📰' },
      { id: 'arts_design', name: 'Design, Fine Arts & Creative Industries', icon: '🎨' },
      { id: 'arts_lang_acad', name: 'Languages, Teaching & Social Development', icon: '🌍' },
    ]
  },
  {
    id: 'vocational',
    name: 'Vocational, Polytechnic & ITI Trades',
    shortName: 'Polytechnic & ITI',
    icon: '⚙️',
    tagline: 'Practical Skill Certifications, Direct Lateral Entry B.Tech, Railway & Junior Engineer Jobs',
    color: '#7c3aed',
    badgeBg: '#ede9fe',
    eligibility10th: 'Class 10th pass with Science and Mathematics. Immediate industry-readiness within 2-3 years.',
    combinations: [
      { code: 'Polytechnic Diploma', subjects: '3-Year Technical Diploma in Mechanical, Electrical, Civil, Computer', bestFor: 'Direct 2nd Year B.Tech Admission / PWD Junior Engineer' },
      { code: 'ITI Certifications', subjects: '1-2 Year Industrial Trades (Electrician, Fitter, Machinist, COPA)', bestFor: 'Railway Assistant Loco Pilot (RRB ALP), Defense Ordnance, PSU Technician' },
    ],
    categories: [
      { id: 'voc_diploma', name: 'Polytechnic Engineering Diplomas', icon: '🔧' },
      { id: 'voc_iti', name: 'ITI Industrial Trades & Railways', icon: '🛠️' },
    ]
  }
];
`;

console.log('Building career data builder...');
