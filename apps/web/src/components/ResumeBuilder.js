// ============================================================
// components/ResumeBuilder.js — Professional ATS Resume Builder & PDF Viewer
// Features:
// - 4 Standard ATS Templates (Modern Executive, Classic Sarkari/PSU, Minimalist ATS, Two-Column Elite)
// - 5 Curated Color Schemas (Saffron, Executive Navy, Emerald, Slate Charcoal, Burgundy)
// - 5 Indian Career Presets (Tech & AI, Govt PSU/GATE, Banking/Admin, State Admin/Talathi, Research/Faculty)
// - Real-time A4 PDF Canvas with zoom, print-to-PDF, and copy plain text
// - Interactive Form Editor with field customization
// ============================================================

'use client'

import React, { useState, useRef, useEffect } from 'react'

// ── 5 Curated Color Palettes ─────────────────────────────────
export const RESUME_COLOR_SCHEMES = {
  saffron: {
    id: 'saffron',
    name: 'ExamUdaan Saffron',
    primary: '#EA580C',
    dark: '#9A3412',
    light: '#FFF7ED',
    border: '#FDBA74',
    textOnPrimary: '#FFFFFF',
    accentDot: '#EA580C',
  },
  navy: {
    id: 'navy',
    name: 'Executive Navy',
    primary: '#1E3A8A',
    dark: '#172554',
    light: '#EFF6FF',
    border: '#93C5FD',
    textOnPrimary: '#FFFFFF',
    accentDot: '#1E3A8A',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    primary: '#065F46',
    dark: '#022C22',
    light: '#ECFDF5',
    border: '#6EE7B7',
    textOnPrimary: '#FFFFFF',
    accentDot: '#065F46',
  },
  charcoal: {
    id: 'charcoal',
    name: 'Slate Charcoal',
    primary: '#1E293B',
    dark: '#0F172A',
    light: '#F8FAFC',
    border: '#CBD5E1',
    textOnPrimary: '#FFFFFF',
    accentDot: '#1E293B',
  },
  burgundy: {
    id: 'burgundy',
    name: 'Burgundy Wine',
    primary: '#831843',
    dark: '#500724',
    light: '#FDF2F8',
    border: '#F472B6',
    textOnPrimary: '#FFFFFF',
    accentDot: '#831843',
  },
}

// ── 5 Indian Job Presets ────────────────────────────────────
export const RESUME_ROLE_PRESETS = {
  tech: {
    id: 'tech',
    roleName: 'Tech & AI Software Engineer',
    badge: 'Full-Stack / AI / Cloud',
    data: {
      name: 'Aditya Deshmukh',
      targetPost: 'Full-Stack Software Engineer / AI & Cloud Systems',
      email: 'aditya.dev@example.com',
      phone: '+91 98230 12345',
      location: 'Pune, Maharashtra',
      links: 'GitHub: github.com/adityadev • LinkedIn: linkedin.com/in/adityadev • Portfolio: adityadev.me',
      categoryInfo: 'Notice Period: Immediate • Location Preference: Pune / Mumbai / Remote',
      summary: 'Results-driven Full-Stack Developer with 2+ years of hands-on experience designing high-throughput web applications and AI data pipelines. Proven expertise in React, Next.js, Python, and PostgreSQL, scaling APIs to handle 50,000+ daily active requests with 99.9% uptime.',
      experience: [
        {
          role: 'Software Engineer Intern',
          organization: 'Enterprise Cloud Labs, Pune',
          period: 'Jun 2023 – Dec 2023',
          bullets: [
            'Architected low-latency REST APIs in FastAPI & PostgreSQL, cutting database query response latency by 38%.',
            'Automated web data extraction pipelines using Scrapy & Celery, handling 400,000+ records weekly with automatic deduplication.',
            'Integrated OpenAI & Gemini LLM APIs for automated classification of structured notifications, boosting parsing accuracy to 96.5%.',
          ],
        },
        {
          role: 'Full-Stack Project Lead (Academic & Open Source)',
          organization: 'ExamUdaan Open Source Initiative',
          period: 'Jan 2024 – Present',
          bullets: [
            'Engineered responsive Next.js 14 App Router portal serving 15,000+ monthly aspirants across Maharashtra with zero downtime.',
            'Implemented instant search index with PostgreSQL full-text search, decreasing search filter round-trip to under 45ms.',
          ],
        },
      ],
      education: [
        {
          degree: 'B.Tech in Computer Engineering',
          institution: 'Savitribai Phule Pune University (SPPU)',
          year: '2024',
          score: 'CGPA: 8.85 / 10 (First Class with Distinction)',
        },
        {
          degree: 'Higher Secondary Certificate (HSC — Science)',
          institution: 'Maharashtra State Board',
          year: '2020',
          score: '89.40%',
        },
      ],
      skills: [
        { category: 'Programming Languages', items: 'JavaScript (ES6+), TypeScript, Python, SQL, C++' },
        { category: 'Frontend & Frameworks', items: 'React, Next.js 14, HTML5, CSS3/Modules, Tailwind, Redux' },
        { category: 'Backend & Databases', items: 'Node.js, Express, FastAPI, PostgreSQL, Redis, RESTful APIs' },
        { category: 'Cloud & DevOps', items: 'Docker, Git/GitHub, AWS (S3, EC2), Vercel, Linux/Bash' },
      ],
      certifications: [
        'AWS Certified Cloud Practitioner (CLF-C02)',
        'Google Cloud Certified — Generative AI Leader',
        'PostgreSQL Database Administration & Indexing — Coursera',
      ],
    },
  },
  sarkari: {
    id: 'sarkari',
    roleName: 'Government PSU & Engineering Trainee',
    badge: 'GATE / PWD / PSU Executive',
    data: {
      name: 'Prathamesh Kulkarni',
      targetPost: 'Assistant Engineer (Civil/Structural) / PSU Graduate Executive Trainee',
      email: 'prathamesh.engg@example.com',
      phone: '+91 94220 98765',
      location: 'Chhatrapati Sambhaji Nagar, Maharashtra',
      links: 'GATE 2024 Score: 685 (AIR 1,240, 92.4 Percentile) • Category: Open / EWS • D.O.B: 12/04/2001',
      categoryInfo: 'Domicile: Maharashtra • Valid Non-Creamy Layer / EWS Certificate Available • Ready to serve anywhere in India',
      summary: 'Disciplined and technically sound Civil Engineering Graduate qualified in GATE 2024 with 92.4 percentile. Comprehensive understanding of Maharashtra PWD specifications, IS Codes (IS 456, IS 800, IS 1893), quantity estimation, quality inspection, and MahaTenders e-procurement workflows.',
      experience: [
        {
          role: 'Graduate Apprentice Trainee Engineer',
          organization: 'Maharashtra Water Resources Dept (WRD), Godavari Basin',
          period: 'Jul 2023 – Jun 2024',
          bullets: [
            'Conducted structural site audits and quality testing for RCC canal lining along a 24-kilometer distributary network.',
            'Prepared Bar Bending Schedules (BBS) and Measurement Book (MB) recordings for ₹4.2 Crore minor irrigation civil tender.',
            'Verified soil compaction and concrete cube compressive strength test reports adhering to IS 516 standards.',
          ],
        },
        {
          role: 'Site Supervision Intern',
          organization: 'Smart City Infrastructure Project, Aurangabad',
          period: 'Dec 2022 – May 2023',
          bullets: [
            'Supervised construction of storm-water drainage channels and utility duct laying across a 5.8 km arterial stretch.',
            'Prepared daily site progress reports (DPR) and resolved contractor grade elevation discrepancies with Total Station survey data.',
          ],
        },
      ],
      education: [
        {
          degree: 'B.E. in Civil Engineering',
          institution: 'Government College of Engineering (GECA)',
          year: '2023',
          score: '74.80% (First Class with Distinction)',
        },
        {
          degree: 'HSC (Class XII — Science / PCM)',
          institution: 'Maharashtra State Board',
          year: '2019',
          score: '84.60%',
        },
      ],
      skills: [
        { category: 'Structural & CAD Software', items: 'AutoCAD 2D/3D, STAAD.Pro, MS Project, Civil 3D' },
        { category: 'Surveying & Testing', items: 'Total Station Survey, Auto Level, Concrete Cube Testing, Soil Compaction' },
        { category: 'Public Sector Knowledge', items: 'PWD Standard Specifications, CPWD DSR, MahaTenders, Measurement Books' },
        { category: 'Languages Known', items: 'Marathi (Native Mother Tongue), English (Fluent), Hindi (Proficient)' },
      ],
      certifications: [
        'GATE 2024 Qualified (Civil Engineering — Score: 685)',
        'Government Certified Civil CAD Professional (AutoDesk)',
        'MS-CIT (Maharashtra State Certificate in IT — 96% Marks)',
        'GCC-TBC Marathi 30 WPM & English 40 WPM Government Typing Certificate',
      ],
    },
  },
  banking: {
    id: 'banking',
    roleName: 'Banking PO / Clerk / SSC CGL',
    badge: 'IBPS / SBI / SSC / Finance',
    data: {
      name: 'Snehal Patil',
      targetPost: 'Probationary Officer (PO) / Junior Associate (Clerk) / SSC CGL Inspector',
      email: 'snehal.patil@example.com',
      phone: '+91 97654 32109',
      location: 'Kolhapur, Maharashtra',
      links: 'Category: OBC (Non-Creamy Layer) • D.O.B: 15/08/2002 • Domicile: Maharashtra',
      categoryInfo: 'IBPS PO Prelims 2024 Cleared • High-Speed Bilingual Typing • Zero Pending Disciplinary Inquiries',
      summary: 'Meticulous Commerce graduate with distinction, combining comprehensive grasp of general accounting principles, banking laws, KYC compliance, and branch operations. Demonstrates outstanding quantitative aptitude, bilingual document drafting, and customer relationship capabilities.',
      experience: [
        {
          role: 'Accounts & Operations Intern',
          organization: 'Kolhapur District Central Co-operative Bank Ltd.',
          period: 'Nov 2023 – Apr 2024',
          bullets: [
            'Handled customer KYC verification, document scanning, and digital savings account onboarding for 800+ rural patrons.',
            'Assisted Head Cashier in day-end cash reconciliation, voucher batching, and vault balancing with zero discrepancy across 5-month audit.',
            'Drafted official correspondence, interest subsidy schedules, and loan recovery reminders in both Marathi and English.',
          ],
        },
        {
          role: 'Audit Assistant (Seasonal)',
          organization: 'M. S. Joshi & Associates (Chartered Accountants)',
          period: 'Jul 2023 – Oct 2023',
          bullets: [
            'Performed bank reconciliation statements (BRS) and GST 3B input tax credit reconciliations for 42 regional trading firms.',
            'Examined cash vouchers, purchase bills, and fixed asset registers during concurrent audit assignments.',
          ],
        },
      ],
      education: [
        {
          degree: 'Bachelor of Commerce (B.Com — Banking & Finance)',
          institution: 'Shivaji University, Kolhapur',
          year: '2024',
          score: '69.50% (First Class)',
        },
        {
          degree: 'HSC (Class XII — Commerce)',
          institution: 'Maharashtra State Board',
          year: '2021',
          score: '81.20%',
        },
      ],
      skills: [
        { category: 'Accounting & Banking Software', items: 'Tally Prime with GST, Core Banking Solutions (CBS Basics), MS Excel' },
        { category: 'Office Productivity', items: 'Advanced Excel (VLOOKUP, Pivot Tables), Word, PowerPoint' },
        { category: 'Typing Speeds', items: 'English 40 WPM (GCC-TBC Certified), Marathi 30 WPM (GCC-TBC Certified)' },
        { category: 'Banking Domains', items: 'Priority Sector Lending (PSL), Retail Deposits, KYC/AML Norms, Negotiable Instruments' },
      ],
      certifications: [
        'GCC-TBC English Typewriting 40 WPM (Govt Commercial Certificate)',
        'GCC-TBC Marathi Typewriting 30 WPM (Govt Commercial Certificate)',
        'Tally Prime Certified Financial Professional (A+ Grade)',
        'MS-CIT Certified (94% Marks, Directorate of Vocational Education & Training)',
      ],
    },
  },
  admin: {
    id: 'admin',
    roleName: 'Administrative Officer / Talathi / ZP',
    badge: 'MPSC / Revenue / ZP / Municipal',
    data: {
      name: 'Sachin Shinde',
      targetPost: 'Talathi / Revenue Assistant / Zilla Parishad Senior Assistant / MPSC Group C',
      email: 'sachin.shinde@example.com',
      phone: '+91 96041 87654',
      location: 'Nashik, Maharashtra',
      links: 'Category: SEBC / General • D.O.B: 24/09/1999 • Domicile: Maharashtra',
      categoryInfo: 'Trained on MahaBHULEKH & E-Chawdi • Fluent in Marathi Official Drafting (Shashan Vyavahar)',
      summary: 'Public administration aspirant with Bachelor of Arts in Public Administration and Economics. Thoroughly conversant with Maharashtra Land Revenue Code 1966, 7/12 extract mutation procedures, Right to Information (RTI) Act 2005, and government office e-Governance portals.',
      experience: [
        {
          role: 'E-Governance Data Operator & Citizen Service Lead',
          organization: 'Aaple Sarkar Seva Kendra (Citizen Service Center), Nashik',
          period: 'Aug 2023 – Present',
          bullets: [
            'Processed over 3,200 citizen applications for Caste, Domicile, Income certificates, and Non-Creamy Layer renewals with 99.2% approval rate.',
            'Handled citizen queries regarding land mutation entries, digital 7/12, and 8-A records on the MahaBHULEKH portal.',
            'Liaised weekly with Tahsildar office staff to expedite pending public grievance cases under the Maharashtra Right to Public Services Act.',
          ],
        },
      ],
      education: [
        {
          degree: 'B.A. in Public Administration & Economics',
          institution: 'KTHM College, SPPU Pune',
          year: '2023',
          score: '67.80% (First Class)',
        },
        {
          degree: 'HSC (Arts)',
          institution: 'Maharashtra State Board',
          year: '2020',
          score: '78.50%',
        },
      ],
      skills: [
        { category: 'Govt Portals & Systems', items: 'Aaple Sarkar Portal, MahaBHULEKH (7/12), E-Chawdi, MahaTenders' },
        { category: 'Administrative Skills', items: 'Marathi Official Letter Drafting (Tipani/Nivad), RTI Processing, Public Records' },
        { category: 'IT & Typing', items: 'MS-CIT, English 30 WPM, Marathi 30 WPM, MS Word & Excel' },
      ],
      certifications: [
        'Maharashtra Public Service Commission (MPSC) Group C Prelims Qualified',
        'MS-CIT Certified (Score: 92%)',
        'GCC-TBC Typing: Marathi 30 WPM & English 30 WPM',
      ],
    },
  },
  research: {
    id: 'research',
    roleName: 'Research Scholar / Faculty / Medical',
    badge: 'UGC-NET / CSIR / Teaching / ICMR',
    data: {
      name: 'Dr. Ananya Joshi',
      targetPost: 'Assistant Professor / Junior Research Fellow (JRF) / Scientific Officer',
      email: 'ananya.joshi@example.com',
      phone: '+91 98900 11223',
      location: 'Mumbai, Maharashtra',
      links: 'UGC-NET JRF Qualified (Top 1% Percentile) • ORCID: 0000-0002-1234-5678 • Google Scholar Profile',
      categoryInfo: 'Specialization: Biotechnology / Molecular Microbiology • 4 Peer-Reviewed Scopus Indexed Publications',
      summary: 'Dedicated Academician and Researcher with Ph.D. in Life Sciences. Recipient of CSIR-UGC Junior Research Fellowship. 3+ years of university laboratory teaching and post-graduate mentoring experience, with expertise in RT-PCR, HPLC, microbial bioinformatics, and statistical data modeling.',
      experience: [
        {
          role: 'UGC Senior Research Fellow & Guest Lecturer',
          organization: 'Department of Biotechnology, Mumbai University',
          period: 'Jan 2022 – Present',
          bullets: [
            'Instructed M.Sc Biotechnology lab courses in Bioprocess Technology, Molecular Biology, and Immunology for batches of 35 students.',
            'Authored 4 peer-reviewed research papers in international journals with cumulative impact factor of 14.2.',
            'Secured ₹5 Lakh university competitive student research seed grant for microbial remediation of industrial textile effluents.',
          ],
        },
      ],
      education: [
        {
          degree: 'Ph.D. in Life Sciences / Biotechnology',
          institution: 'University of Mumbai',
          year: '2024',
          score: 'Awarded with Highest Honors',
        },
        {
          degree: 'M.Sc in Biotechnology',
          institution: 'Savitribai Phule Pune University',
          year: '2020',
          score: 'CGPA: 8.92 / 10 (Gold Medalist)',
        },
      ],
      skills: [
        { category: 'Research Methodologies', items: 'Spectrophotometry, HPLC, RT-PCR, Gel Electrophoresis, Cell Culture' },
        { category: 'Bioinformatics & Data', items: 'NCBI BLAST, R Programming, GraphPad Prism, Python for Data Science' },
        { category: 'Pedagogy & Accreditation', items: 'Curriculum Design, NAAC Documentation, Online LMS (Moodle, Google Classroom)' },
      ],
      certifications: [
        'UGC-NET with Junior Research Fellowship (JRF) Qualified (AIR 48)',
        'Maharashtra State Eligibility Test (MH-SET) Qualified for Assistant Professorship',
        'Good Laboratory Practice (GLP) Certified Auditor',
      ],
    },
  },
}

// ── 4 Layout Templates ───────────────────────────────────────
export const RESUME_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern Executive',
    badge: 'Contemporary Clean',
    icon: 'badge',
    desc: 'Two-tone header with bold accent lines, pill skills, and metric-focused layout. Ideal for Tech, PSUs, and Corporate.',
  },
  {
    id: 'sarkari',
    name: 'Classic Sarkari / PSU',
    badge: 'Govt & UPSC Approved',
    icon: 'account_balance',
    desc: 'Formal centered layout with qualification matrix table, D.O.B / Category details, and official declaration sign-off.',
  },
  {
    id: 'minimal',
    name: 'Minimalist ATS High-Score',
    badge: '99% ATS Parse Rate',
    icon: 'fact_check',
    desc: 'Strict single-column layout optimized for algorithmic parsers (Workday, Taleo, Greenhouse, Govt Portals).',
  },
  {
    id: 'sidebar',
    name: 'Two-Column Elite',
    badge: 'Executive Sidebar',
    icon: 'view_column',
    desc: 'Left colored sidebar for competencies, contact, and education; right canvas for executive summary and career history.',
  },
]

export default function ResumeBuilder() {
  // State
  const [selectedRole, setSelectedRole] = useState('tech')
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [colorSchemeKey, setColorSchemeKey] = useState('saffron')
  const [zoomLevel, setZoomLevel] = useState(100) // 80, 100, 120
  const [activeTab, setActiveTab] = useState('preview') // 'preview' | 'edit' | 'split'
  const [copied, setCopied] = useState(false)

  // Current resume data loaded from preset or user modifications
  const [resumeData, setResumeData] = useState(RESUME_ROLE_PRESETS.tech.data)

  // ── Save / Load state (for logged-in users) ──
  const [saveStatus, setSaveStatus]     = useState(null)   // null | 'saving' | 'saved' | 'error'
  const [savedResumes, setSavedResumes] = useState([])     // list of saved versions
  const [showSavedPanel, setShowSavedPanel] = useState(false)
  const [currentVersionId, setCurrentVersionId] = useState(null) // ID of currently loaded version
  const [versionName, setVersionName]   = useState('My Resume')
  const [authToken, setAuthToken]       = useState(null)   // JWT from localStorage

  // Read auth token on mount (client-side only)
  useEffect(() => {
    try {
      const token = localStorage.getItem('eu_access_token')
      setAuthToken(token || null)
      if (token) loadSavedResumes(token)
    } catch { setAuthToken(null) }
  }, [])

  // Fetch user's saved resumes from API
  const loadSavedResumes = async (token) => {
    try {
      const res = await fetch('/api/resume', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSavedResumes(data.resumes || [])
      }
    } catch { /* silently fail */ }
  }

  // Save current resume to the DB
  const handleSave = async () => {
    if (!authToken) return
    setSaveStatus('saving')
    try {
      const body = {
        id: currentVersionId || undefined,
        name: versionName,
        template: selectedTemplate,
        color: colorSchemeKey,
        data: resumeData,
      }
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      })
      const result = await res.json()
      if (res.ok) {
        setSaveStatus('saved')
        setCurrentVersionId(result.resume?.id || currentVersionId)
        await loadSavedResumes(authToken)
        setTimeout(() => setSaveStatus(null), 2000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus(null), 3000)
      }
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }

  // Load a saved version into the editor
  const handleLoadVersion = (v) => {
    setResumeData(v.data)
    setSelectedTemplate(v.template || 'modern')
    setColorSchemeKey(v.color || 'saffron')
    setVersionName(v.name)
    setCurrentVersionId(v.id)
    setShowSavedPanel(false)
  }

  // Delete a saved version
  const handleDeleteVersion = async (id) => {
    if (!authToken || !confirm('Delete this resume version?')) return
    try {
      await fetch(`/api/resume?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      })
      await loadSavedResumes(authToken)
      if (currentVersionId === id) setCurrentVersionId(null)
    } catch { /* silently fail */ }
  }

  const printRef = useRef(null)
  const currentScheme = RESUME_COLOR_SCHEMES[colorSchemeKey] || RESUME_COLOR_SCHEMES.saffron


  // Switch role preset
  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId)
    if (RESUME_ROLE_PRESETS[roleId]) {
      setResumeData(JSON.parse(JSON.stringify(RESUME_ROLE_PRESETS[roleId].data)))
    }
  }

  // Handle native A4 print to PDF — popup window approach
  // Opens only the resume content in a new window and prints it.
  // This prevents the browser from printing the full page (which causes 8 pages).
  const handlePrint = () => {
    const printTarget = document.getElementById('resume-print-sheet')
    if (!printTarget) { window.print(); return }

    // Collect all page stylesheets to include in print window
    const styles = Array.from(document.styleSheets)
      .map(ss => {
        try {
          return Array.from(ss.cssRules || []).map(r => r.cssText).join('\n')
        } catch { return '' }
      })
      .join('\n')

    // Open new popup window
    const pw = window.open('', '_blank', 'width=850,height=1100')
    if (!pw) {
      // Fallback if popup is blocked
      window.print()
      return
    }

    pw.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${resumeData.name || 'Resume'} — ExamUdaan</title>
  <style>
    /* Reset */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #fff; }
    @page { size: A4 portrait; margin: 0; }
    @media print {
      html, body { width: 210mm; min-height: 297mm; }
    }
    /* Include page styles */
    ${styles}
    /* Force colors */
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  </style>
</head>
<body>
  ${printTarget.outerHTML}
</body>
</html>`)
    pw.document.close()
    pw.focus()
    // Small delay to ensure styles load before print dialog
    setTimeout(() => {
      pw.print()
      pw.close()
    }, 400)
  }

  // Build ATS plain text version for fast copying
  const generatePlainText = () => {
    let text = `${resumeData.name.toUpperCase()}\n`
    text += `${resumeData.targetPost}\n`
    text += `${resumeData.email} | ${resumeData.phone} | ${resumeData.location}\n`
    if (resumeData.links) text += `${resumeData.links}\n`
    if (resumeData.categoryInfo) text += `${resumeData.categoryInfo}\n`
    text += `\n${'='.repeat(50)}\nCAREER OBJECTIVE / PROFESSIONAL SUMMARY\n${'='.repeat(50)}\n`
    text += `${resumeData.summary}\n`

    text += `\n${'='.repeat(50)}\nWORK EXPERIENCE & APPRENTICESHIPS\n${'='.repeat(50)}\n`
    resumeData.experience?.forEach((exp) => {
      text += `\n${exp.role} — ${exp.organization} (${exp.period})\n`
      exp.bullets?.forEach((b) => {
        text += `• ${b}\n`
      })
    })

    text += `\n${'='.repeat(50)}\nEDUCATION & QUALIFICATIONS\n${'='.repeat(50)}\n`
    resumeData.education?.forEach((edu) => {
      text += `• ${edu.degree} — ${edu.institution} (${edu.year}) — ${edu.score}\n`
    })

    text += `\n${'='.repeat(50)}\nKEY SKILLS & COMPETENCIES\n${'='.repeat(50)}\n`
    resumeData.skills?.forEach((sk) => {
      text += `• ${sk.category}: ${sk.items}\n`
    })

    text += `\n${'='.repeat(50)}\nCERTIFICATIONS & ACCREDITATIONS\n${'='.repeat(50)}\n`
    resumeData.certifications?.forEach((c) => {
      text += `• ${c}\n`
    })

    return text
  }

  const handleCopyText = () => {
    const text = generatePlainText()
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <div style={{ width: '100%' }}>
      {/* ── Print Stylesheet ── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #resume-print-sheet, #resume-print-sheet * {
            visibility: visible !important;
          }
          #resume-print-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px 24px !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      {/* ── Main Container Box ── */}
      <div
        style={{
          background: 'var(--surface-container-lowest)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          marginBottom: 32,
        }}
      >
        {/* ── Header Banner ── */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--outline-variant)',
            background: 'linear-gradient(135deg, rgba(234,88,12,0.05) 0%, var(--surface) 100%)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 22, color: currentScheme.primary }}
              >
                picture_as_pdf
              </span>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                Professional ATS Resume Builder & PDF Studio
              </h2>
              <span
                style={{
                  background: currentScheme.light,
                  color: currentScheme.dark,
                  border: `1px solid ${currentScheme.border}`,
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                A4 Standard • 99% ATS Compliant
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--secondary)', margin: 0 }}>
              Crafted for Central & Maharashtra Government, PSU, Banking, and Private Tech applications. Select standard templates, custom color palettes, and download crisp A4 PDFs instantly.
            </p>
          </div>

          {/* Action Bar (Top Right) */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--surface)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 8,
                padding: 2,
              }}
            >
              {[
                { id: 'preview', label: 'PDF View', icon: 'visibility' },
                { id: 'edit', label: 'Edit Info', icon: 'edit_note' },
                { id: 'split', label: 'Side-by-Side', icon: 'splitscreen' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    background: activeTab === tab.id ? currentScheme.primary : 'transparent',
                    color: activeTab === tab.id ? '#fff' : 'var(--on-surface)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Copy Clean Text */}
            <button
              onClick={handleCopyText}
              title="Copy plain ATS text for form copy-pasting"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--surface)',
                color: 'var(--on-surface)',
                border: '1px solid var(--outline-variant)',
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: currentScheme.primary }}>
                {copied ? 'check_circle' : 'content_copy'}
              </span>
              {copied ? 'Copied ATS Text!' : 'Copy Text'}
            </button>

            {/* Download / Print PDF */}
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: currentScheme.primary,
                color: '#fff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                print
              </span>
              Download PDF / Print
            </button>

            {/* Save Resume — shown only when logged in */}
            {authToken ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: saveStatus === 'saved' ? '#16a34a' : saveStatus === 'error' ? '#dc2626' : 'var(--surface)',
                    color: saveStatus === 'saved' || saveStatus === 'error' ? '#fff' : 'var(--on-surface)',
                    border: '1px solid var(--outline-variant)',
                    padding: '7px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    {saveStatus === 'saved' ? 'check_circle' : saveStatus === 'error' ? 'error' : 'cloud_upload'}
                  </span>
                  {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save'}
                </button>
                <button
                  onClick={() => setShowSavedPanel(p => !p)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: showSavedPanel ? 'var(--primary-fixed)' : 'var(--surface)',
                    color: showSavedPanel ? 'var(--primary)' : 'var(--on-surface)',
                    border: '1px solid var(--outline-variant)',
                    padding: '7px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>folder_open</span>
                  My Resumes {savedResumes.length > 0 ? `(${savedResumes.length})` : ''}
                </button>
              </>
            ) : (
              <a
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'var(--surface)',
                  color: 'var(--secondary)',
                  border: '1px solid var(--outline-variant)',
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontFamily: 'inherit',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
                Login to Save
              </a>
            )}
          </div>
        </div>

        {/* ── Saved Resumes Panel ── */}
        {showSavedPanel && authToken && (
          <div style={{
            padding: '16px 24px',
            background: 'var(--primary-fixed)',
            borderBottom: '1px solid var(--outline-variant)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)' }}>
                📁 My Saved Resumes (max 10)
              </div>
              {/* Version name input for saving */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  value={versionName}
                  onChange={e => setVersionName(e.target.value)}
                  placeholder="Version name…"
                  maxLength={80}
                  style={{
                    padding: '5px 10px', borderRadius: 6,
                    border: '1px solid var(--outline-variant)',
                    fontSize: 12, fontFamily: 'inherit',
                    background: 'var(--surface-container-lowest)',
                    color: 'var(--on-surface)',
                    width: 180,
                  }}
                />
                <button
                  onClick={handleSave}
                  style={{
                    background: 'var(--primary)', color: '#fff', border: 'none',
                    padding: '5px 14px', borderRadius: 6,
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {currentVersionId ? 'Update' : 'Save New'}
                </button>
              </div>
            </div>

            {savedResumes.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--secondary)', fontStyle: 'italic' }}>
                No saved resumes yet. Fill in your details and click Save above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {savedResumes.map(v => (
                  <div key={v.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: v.id === currentVersionId ? 'var(--primary-fixed-dim)' : 'var(--surface-container-lowest)',
                    border: `1px solid ${v.id === currentVersionId ? 'var(--primary)' : 'var(--outline-variant)'}`,
                    borderRadius: 8, padding: '8px 12px',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)', flexShrink: 0 }}>description</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v.name}
                        {v.id === currentVersionId && <span style={{ fontSize: 10, background: 'var(--primary)', color: '#fff', borderRadius: 4, padding: '1px 6px', marginLeft: 6 }}>Current</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--secondary)' }}>
                        Template: {v.template} · Saved: {new Date(v.updated_at).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleLoadVersion(v)}
                      style={{
                        background: 'var(--primary)', color: '#fff', border: 'none',
                        padding: '5px 12px', borderRadius: 6,
                        fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteVersion(v.id)}
                      style={{
                        background: 'none', color: '#dc2626', border: '1px solid #fecaca',
                        padding: '5px 10px', borderRadius: 6,
                        fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {/* ── Controls Bar: Role Presets + Templates + Color Scheme ── */}
        <div
          style={{
            padding: '14px 24px',
            borderBottom: '1px solid var(--outline-variant)',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Row 1: Role Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Sample Role:
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.values(RESUME_ROLE_PRESETS).map((preset) => {
                const isSelected = selectedRole === preset.id
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleRoleChange(preset.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: isSelected ? currentScheme.light : 'var(--surface-container-lowest)',
                      color: isSelected ? currentScheme.dark : 'var(--on-surface)',
                      border: `1.5px solid ${isSelected ? currentScheme.primary : 'var(--outline-variant)'}`,
                      padding: '5px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{preset.roleName}</span>
                    <span
                      style={{
                        fontSize: 10,
                        background: isSelected ? currentScheme.primary : 'var(--surface)',
                        color: isSelected ? '#fff' : 'var(--secondary)',
                        padding: '1px 6px',
                        borderRadius: 10,
                      }}
                    >
                      {preset.badge}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Row 2: Standard Templates + Color Scheme Picker */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
              paddingTop: 4,
            }}
          >
            {/* Templates */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Template:
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {RESUME_TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplate === tpl.id
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      title={tpl.desc}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: isSelected ? 'var(--on-surface)' : 'var(--surface-container-lowest)',
                        color: isSelected ? 'var(--surface)' : 'var(--on-surface)',
                        border: `1.5px solid ${isSelected ? 'var(--on-surface)' : 'var(--outline-variant)'}`,
                        padding: '6px 14px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                        {tpl.icon}
                      </span>
                      {tpl.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Color Scheme Picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Color Theme:
              </span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {Object.values(RESUME_COLOR_SCHEMES).map((scheme) => {
                  const isSelected = colorSchemeKey === scheme.id
                  return (
                    <button
                      key={scheme.id}
                      onClick={() => setColorSchemeKey(scheme.id)}
                      title={scheme.name}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: scheme.primary,
                        border: isSelected ? '3px solid #fff' : '2px solid transparent',
                        outline: isSelected ? `2px solid ${scheme.primary}` : 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'transform 0.15s ease',
                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content Area: Editor & PDF Viewer ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              activeTab === 'split' ? '420px 1fr' : activeTab === 'edit' ? '1fr' : '1fr',
            minHeight: 700,
            background: 'var(--surface)',
          }}
        >
          {/* ── Form Editor Panel (Shown in 'edit' or 'split' mode) ── */}
          {(activeTab === 'edit' || activeTab === 'split') && (
            <div
              style={{
                padding: 24,
                borderRight: activeTab === 'split' ? '1px solid var(--outline-variant)' : 'none',
                background: 'var(--surface-container-lowest)',
                overflowY: 'auto',
                maxHeight: activeTab === 'split' ? 950 : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 18,
                  paddingBottom: 10,
                  borderBottom: '1px solid var(--outline-variant)',
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
                  ✏️ Edit Candidate Information
                </h3>
                <button
                  onClick={() => handleRoleChange(selectedRole)}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: currentScheme.primary,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Reset to Role Defaults
                </button>
              </div>

              {/* Personal Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>
                  Personal Information
                </span>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name</label>
                  <input
                    type="text"
                    value={resumeData.name || ''}
                    onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--outline-variant)',
                      fontSize: 13,
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Target Post / Designation</label>
                  <input
                    type="text"
                    value={resumeData.targetPost || ''}
                    onChange={(e) => setResumeData({ ...resumeData, targetPost: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--outline-variant)',
                      fontSize: 13,
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
                    <input
                      type="text"
                      value={resumeData.email || ''}
                      onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--outline-variant)',
                        fontSize: 13,
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label>
                    <input
                      type="text"
                      value={resumeData.phone || ''}
                      onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--outline-variant)',
                        fontSize: 13,
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Location / City, State</label>
                  <input
                    type="text"
                    value={resumeData.location || ''}
                    onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--outline-variant)',
                      fontSize: 13,
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Links / Profiles (GitHub, LinkedIn, GATE)</label>
                  <input
                    type="text"
                    value={resumeData.links || ''}
                    onChange={(e) => setResumeData({ ...resumeData, links: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--outline-variant)',
                      fontSize: 13,
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Category / Domicile / Additional Info</label>
                  <input
                    type="text"
                    value={resumeData.categoryInfo || ''}
                    onChange={(e) => setResumeData({ ...resumeData, categoryInfo: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--outline-variant)',
                      fontSize: 13,
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              {/* Summary */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Career Objective / Professional Summary
                </label>
                <textarea
                  rows={4}
                  value={resumeData.summary || ''}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--outline-variant)',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Work Experience */}
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                  Work Experience & Apprenticeships
                </span>
                {resumeData.experience?.map((exp, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 12,
                      background: 'var(--surface)',
                      borderRadius: 8,
                      border: '1px solid var(--outline-variant)',
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 6 }}>
                      <input
                        placeholder="Job Title"
                        value={exp.role || ''}
                        onChange={(e) => {
                          const updated = [...resumeData.experience]
                          updated[idx].role = e.target.value
                          setResumeData({ ...resumeData, experience: updated })
                        }}
                        style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid var(--outline-variant)', fontSize: 12 }}
                      />
                      <input
                        placeholder="Organization / Dept"
                        value={exp.organization || ''}
                        onChange={(e) => {
                          const updated = [...resumeData.experience]
                          updated[idx].organization = e.target.value
                          setResumeData({ ...resumeData, experience: updated })
                        }}
                        style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid var(--outline-variant)', fontSize: 12 }}
                      />
                    </div>
                    <input
                      placeholder="Period (e.g. Jun 2023 – Dec 2023)"
                      value={exp.period || ''}
                      onChange={(e) => {
                        const updated = [...resumeData.experience]
                        updated[idx].period = e.target.value
                        setResumeData({ ...resumeData, experience: updated })
                      }}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--outline-variant)', fontSize: 12, marginBottom: 6 }}
                    />
                    <textarea
                      placeholder="Bullet points (one per line)"
                      rows={3}
                      value={exp.bullets?.join('\n') || ''}
                      onChange={(e) => {
                        const updated = [...resumeData.experience]
                        updated[idx].bullets = e.target.value.split('\n')
                        setResumeData({ ...resumeData, experience: updated })
                      }}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--outline-variant)', fontSize: 12, lineHeight: 1.4 }}
                    />
                  </div>
                ))}
              </div>

              {/* Education */}
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                  Education & Qualifications
                </span>
                {resumeData.education?.map((edu, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 10,
                      background: 'var(--surface)',
                      borderRadius: 8,
                      border: '1px solid var(--outline-variant)',
                      marginBottom: 8,
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                    }}
                  >
                    <input
                      placeholder="Degree / Course"
                      value={edu.degree || ''}
                      onChange={(e) => {
                        const updated = [...resumeData.education]
                        updated[idx].degree = e.target.value
                        setResumeData({ ...resumeData, education: updated })
                      }}
                      style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid var(--outline-variant)', fontSize: 12 }}
                    />
                    <input
                      placeholder="Institution / Board"
                      value={edu.institution || ''}
                      onChange={(e) => {
                        const updated = [...resumeData.education]
                        updated[idx].institution = e.target.value
                        setResumeData({ ...resumeData, education: updated })
                      }}
                      style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid var(--outline-variant)', fontSize: 12 }}
                    />
                    <input
                      placeholder="Year"
                      value={edu.year || ''}
                      onChange={(e) => {
                        const updated = [...resumeData.education]
                        updated[idx].year = e.target.value
                        setResumeData({ ...resumeData, education: updated })
                      }}
                      style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid var(--outline-variant)', fontSize: 12 }}
                    />
                    <input
                      placeholder="Score / Grade / Division"
                      value={edu.score || ''}
                      onChange={(e) => {
                        const updated = [...resumeData.education]
                        updated[idx].score = e.target.value
                        setResumeData({ ...resumeData, education: updated })
                      }}
                      style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid var(--outline-variant)', fontSize: 12 }}
                    />
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Certifications (One per line)
                </label>
                <textarea
                  rows={3}
                  value={resumeData.certifications?.join('\n') || ''}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      certifications: e.target.value.split('\n').filter((x) => x.trim()),
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--outline-variant)',
                    fontSize: 13,
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                onClick={() => setActiveTab('preview')}
                style={{
                  width: '100%',
                  background: currentScheme.primary,
                  color: '#fff',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Done Editing — View PDF
              </button>
            </div>
          )}

          {/* ── PDF Viewer Stage Canvas ── */}
          {(activeTab === 'preview' || activeTab === 'split') && (
            <div
              style={{
                background: '#EAE8E4', // Neutral dark viewer backdrop like Acrobat/Overleaf
                padding: '28px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflowX: 'auto',
              }}
            >
              {/* PDF Canvas Toolbar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: 794,
                  marginBottom: 14,
                  padding: '6px 14px',
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'var(--secondary)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: currentScheme.primary }}>
                    description
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                    {resumeData.name ? `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf'}
                  </span>
                  <span>• Page 1 of 1</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Zoom buttons */}
                  <span style={{ fontSize: 11, fontWeight: 700 }}>Zoom:</span>
                  {[
                    { label: '80%', val: 80 },
                    { label: '100%', val: 100 },
                  ].map((z) => (
                    <button
                      key={z.val}
                      onClick={() => setZoomLevel(z.val)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        border: '1px solid var(--outline-variant)',
                        background: zoomLevel === z.val ? currentScheme.primary : '#fff',
                        color: zoomLevel === z.val ? '#fff' : 'var(--on-surface)',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {z.label}
                    </button>
                  ))}
                  <span
                    style={{
                      background: '#ECFDF5',
                      color: '#065F46',
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    ★ 99% ATS Score
                  </span>
                </div>
              </div>

              {/* ── A4 Page Container ── */}
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div
                  id="resume-print-sheet"
                  ref={printRef}
                  style={{
                    width: 794, // Standard A4 at 96 DPI
                    minHeight: 1123, // Standard A4 ratio
                    background: '#FFFFFF',
                    color: '#1B1C1B',
                    boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.15), 0 8px 12px -6px rgba(0, 0, 0, 0.08)',
                    borderRadius: 3,
                    boxSizing: 'border-box',
                    position: 'relative',
                    fontFamily:
                      selectedTemplate === 'sarkari'
                        ? 'Georgia, Cambria, "Times New Roman", serif'
                        : 'var(--font-inter, Inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {/* Template Renderer */}
                  {selectedTemplate === 'modern' && (
                    <ModernExecutiveTemplate data={resumeData} scheme={currentScheme} />
                  )}
                  {selectedTemplate === 'sarkari' && (
                    <ClassicSarkariTemplate data={resumeData} scheme={currentScheme} />
                  )}
                  {selectedTemplate === 'minimal' && (
                    <MinimalistAtsTemplate data={resumeData} scheme={currentScheme} />
                  )}
                  {selectedTemplate === 'sidebar' && (
                    <TwoColumnSidebarTemplate data={resumeData} scheme={currentScheme} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// TEMPLATE 1: Modern Executive (Clean, High-Impact Accent)
// ============================================================
function ModernExecutiveTemplate({ data, scheme }) {
  return (
    <div style={{ padding: '36px 42px', fontSize: 13, lineHeight: 1.55 }}>
      {/* Top Accent Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: scheme.primary,
        }}
      />

      {/* Header */}
      <div style={{ borderBottom: `2px solid ${scheme.light}`, paddingBottom: 16, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: scheme.dark, letterSpacing: '-0.02em' }}>
              {data.name}
            </h1>
            <div style={{ fontSize: 14, fontWeight: 700, color: scheme.primary, marginTop: 3 }}>
              {data.targetPost}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11.5, color: '#4B5563', lineHeight: 1.6 }}>
            <div>{data.email} • {data.phone}</div>
            <div>{data.location}</div>
          </div>
        </div>

        {/* Links Ribbon */}
        {data.links && (
          <div style={{ marginTop: 10, fontSize: 11, color: '#4B5563', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span>🔗 {data.links}</span>
          </div>
        )}
        {data.categoryInfo && (
          <div style={{ marginTop: 4, fontSize: 11, color: scheme.dark, background: scheme.light, padding: '2px 8px', borderRadius: 4, display: 'inline-block' }}>
            ℹ️ {data.categoryInfo}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <section style={{ marginBottom: 18 }}>
          <SectionTitle title="PROFESSIONAL SUMMARY" scheme={scheme} />
          <p style={{ margin: '6px 0 0', color: '#374151', fontSize: 12.5, textAlign: 'justify' }}>
            {data.summary}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <section style={{ marginBottom: 18 }}>
          <SectionTitle title="PROFESSIONAL EXPERIENCE & APPRENTICESHIPS" scheme={scheme} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                    {exp.role} <span style={{ fontWeight: 500, color: scheme.primary }}>— {exp.organization}</span>
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B7280' }}>
                    {exp.period}
                  </span>
                </div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 18, color: '#374151', fontSize: 12 }}>
                  {exp.bullets?.map((b, bi) => (
                    <li key={bi} style={{ marginBottom: 3 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Skills */}
      {data.skills && data.skills.length > 0 && (
        <section style={{ marginBottom: 18 }}>
          <SectionTitle title="TECHNICAL & CORE COMPETENCIES" scheme={scheme} />
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {data.skills.map((sk, i) => (
              <div key={i} style={{ fontSize: 12, display: 'flex', gap: 8 }}>
                <span style={{ fontWeight: 700, color: '#111827', minWidth: 160 }}>
                  {sk.category}:
                </span>
                <span style={{ color: '#374151' }}>{sk.items}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section style={{ marginBottom: 18 }}>
          <SectionTitle title="EDUCATION & QUALIFICATIONS" scheme={scheme} />
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>
                  {edu.degree} <span style={{ fontWeight: 400, color: '#4B5563' }}>— {edu.institution}</span>
                </span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#374151' }}>
                  {edu.score} • {edu.year}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <SectionTitle title="CERTIFICATIONS & AWARDS" scheme={scheme} />
          <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: '#374151', fontSize: 12 }}>
            {data.certifications.map((c, i) => (
              <li key={i} style={{ marginBottom: 3 }}>
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

// ============================================================
// TEMPLATE 2: Classic Sarkari / PSU Standard (UPSC / Govt)
// ============================================================
function ClassicSarkariTemplate({ data, scheme }) {
  return (
    <div style={{ padding: '36px 42px', fontSize: 12.5, lineHeight: 1.5 }}>
      {/* Formal Centered Header */}
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${scheme.primary}`, paddingBottom: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          CURRICULUM VITAE / BIODATA
        </h1>
        <div style={{ fontSize: 17, fontWeight: 700, color: scheme.dark, margin: '2px 0 4px' }}>
          {data.name}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, fontStyle: 'italic', color: '#374151', marginBottom: 6 }}>
          Post Applied For: {data.targetPost}
        </div>
        <div style={{ fontSize: 11.5, color: '#4B5563' }}>
          Email: {data.email} | Mobile: {data.phone} | Permanent Address: {data.location}
        </div>
        {data.links && (
          <div style={{ fontSize: 11, color: '#4B5563', marginTop: 3 }}>
            {data.links}
          </div>
        )}
      </div>

      {/* Candidate Profile / Reservation Details Box */}
      {data.categoryInfo && (
        <div
          style={{
            border: `1px solid ${scheme.border}`,
            background: scheme.light,
            padding: '6px 12px',
            borderRadius: 4,
            fontSize: 11.5,
            marginBottom: 14,
            fontWeight: 600,
            color: scheme.dark,
          }}
        >
          📌 Official Reservation / Eligibility Details: {data.categoryInfo}
        </div>
      )}

      {/* Objective */}
      {data.summary && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 800, borderBottom: '1px solid #9CA3AF', paddingBottom: 2, marginBottom: 4, textTransform: 'uppercase' }}>
            1. CAREER OBJECTIVE & STATEMENT OF SUITABILITY
          </div>
          <p style={{ margin: 0, textAlign: 'justify', fontSize: 12, color: '#1F2937' }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Education Matrix Table (Standard Govt / UPSC Format) */}
      {data.education && data.education.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 800, borderBottom: '1px solid #9CA3AF', paddingBottom: 2, marginBottom: 6, textTransform: 'uppercase' }}>
            2. EDUCATIONAL QUALIFICATIONS (CHRONOLOGICAL)
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 11.5,
              marginTop: 4,
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ background: scheme.light, color: scheme.dark }}>
                <th style={{ border: '1px solid #CBD5E1', padding: '5px 8px' }}>Examination / Degree</th>
                <th style={{ border: '1px solid #CBD5E1', padding: '5px 8px' }}>Board / University</th>
                <th style={{ border: '1px solid #CBD5E1', padding: '5px 8px' }}>Year of Passing</th>
                <th style={{ border: '1px solid #CBD5E1', padding: '5px 8px' }}>Marks / CGPA / Class</th>
              </tr>
            </thead>
            <tbody>
              {data.education.map((edu, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #CBD5E1', padding: '4px 8px', fontWeight: 600 }}>{edu.degree}</td>
                  <td style={{ border: '1px solid #CBD5E1', padding: '4px 8px' }}>{edu.institution}</td>
                  <td style={{ border: '1px solid #CBD5E1', padding: '4px 8px', textAlign: 'center' }}>{edu.year}</td>
                  <td style={{ border: '1px solid #CBD5E1', padding: '4px 8px' }}>{edu.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Experience & Practical Training */}
      {data.experience && data.experience.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 800, borderBottom: '1px solid #9CA3AF', paddingBottom: 2, marginBottom: 6, textTransform: 'uppercase' }}>
            3. WORK EXPERIENCE, APPRENTICESHIP & FIELD TRAINING
          </div>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 12 }}>
                <span>• {exp.role}, {exp.organization}</span>
                <span>{exp.period}</span>
              </div>
              <ul style={{ margin: '2px 0 0', paddingLeft: 22, fontSize: 11.5, color: '#374151' }}>
                {exp.bullets?.map((b, bi) => (
                  <li key={bi} style={{ marginBottom: 2 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 800, borderBottom: '1px solid #9CA3AF', paddingBottom: 2, marginBottom: 4, textTransform: 'uppercase' }}>
            4. TECHNICAL SKILLS & PROFICIENCIES
          </div>
          <div style={{ fontSize: 11.5, lineHeight: 1.6 }}>
            {data.skills.map((sk, i) => (
              <div key={i}>
                <strong>{sk.category}:</strong> {sk.items}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, borderBottom: '1px solid #9CA3AF', paddingBottom: 2, marginBottom: 4, textTransform: 'uppercase' }}>
            5. CERTIFICATIONS, TYPING SPEEDS & GOVT ACCREDITATIONS
          </div>
          <ul style={{ margin: '2px 0 0', paddingLeft: 20, fontSize: 11.5, color: '#374151' }}>
            {data.certifications.map((c, i) => (
              <li key={i} style={{ marginBottom: 2 }}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Formal Declaration (Essential for Indian Govt Applications) */}
      <div style={{ borderTop: '1px solid #9CA3AF', paddingTop: 8, marginTop: 16, fontSize: 10.5, color: '#4B5563' }}>
        <p style={{ margin: '0 0 16px', fontStyle: 'italic' }}>
          <strong>Declaration:</strong> I hereby declare that all particulars stated above are true, complete, and correct to the best of my knowledge and belief. In the event of any information being found false or ineligible, my candidature may be cancelled.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontWeight: 600 }}>
          <div>
            <div>Date: _______________</div>
            <div>Place: {data.location?.split(',')[0] || 'Maharashtra'}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #000', width: 140, paddingTop: 4 }}>
              Signature of Candidate
            </div>
            <div style={{ fontSize: 10 }}>({data.name})</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// TEMPLATE 3: Minimalist ATS High-Score (Workday / Silicon Standard)
// ============================================================
function MinimalistAtsTemplate({ data, scheme }) {
  return (
    <div style={{ padding: '36px 42px', fontSize: 12.5, lineHeight: 1.5, color: '#111827' }}>
      {/* Header */}
      <div style={{ textAlign: 'left', borderBottom: `2px solid ${scheme.primary}`, paddingBottom: 10, marginBottom: 14 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
          {data.name}
        </h1>
        <div style={{ fontSize: 13, fontWeight: 700, color: scheme.primary, margin: '2px 0 4px' }}>
          {data.targetPost}
        </div>
        <div style={{ fontSize: 11.5, color: '#4B5563' }}>
          {data.email} | {data.phone} | {data.location}
          {data.links && ` | ${data.links}`}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', paddingBottom: 2, marginBottom: 4 }}>
            PROFESSIONAL SUMMARY
          </div>
          <p style={{ margin: 0, fontSize: 12, textAlign: 'justify', color: '#374151' }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', paddingBottom: 2, marginBottom: 6 }}>
            EXPERIENCE
          </div>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700 }}>
                <span>{exp.role} — <span style={{ fontWeight: 500 }}>{exp.organization}</span></span>
                <span style={{ fontSize: 11.5, color: '#6B7280' }}>{exp.period}</span>
              </div>
              <ul style={{ margin: '3px 0 0', paddingLeft: 18, fontSize: 11.5, color: '#374151' }}>
                {exp.bullets?.map((b, bi) => (
                  <li key={bi} style={{ marginBottom: 2 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', paddingBottom: 2, marginBottom: 6 }}>
            EDUCATION
          </div>
          {data.education.map((edu, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>
                <strong>{edu.degree}</strong>, {edu.institution}
              </span>
              <span style={{ color: '#4B5563' }}>
                {edu.score} | {edu.year}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', paddingBottom: 2, marginBottom: 4 }}>
            TECHNICAL SKILLS
          </div>
          {data.skills.map((sk, i) => (
            <div key={i} style={{ fontSize: 11.5, marginBottom: 3 }}>
              <strong>{sk.category}:</strong> {sk.items}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', paddingBottom: 2, marginBottom: 4 }}>
            CERTIFICATIONS & HONORS
          </div>
          <ul style={{ margin: '3px 0 0', paddingLeft: 18, fontSize: 11.5, color: '#374151' }}>
            {data.certifications.map((c, i) => (
              <li key={i} style={{ marginBottom: 2 }}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================================
// TEMPLATE 4: Two-Column Elite (Sidebar Layout)
// ============================================================
function TwoColumnSidebarTemplate({ data, scheme }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', minHeight: 1123, fontSize: 12 }}>
      {/* Left Sidebar */}
      <div
        style={{
          background: scheme.light,
          borderRight: `1px solid ${scheme.border}`,
          padding: '36px 20px',
          color: '#1F2937',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {/* Contact Info */}
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1.5px solid ${scheme.border}`, paddingBottom: 3, marginBottom: 8 }}>
            CONTACT
          </div>
          <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 6, color: '#374151' }}>
            <div>✉️ {data.email}</div>
            <div>📞 {data.phone}</div>
            <div>📍 {data.location}</div>
          </div>
        </div>

        {/* Links & Category */}
        {(data.links || data.categoryInfo) && (
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1.5px solid ${scheme.border}`, paddingBottom: 3, marginBottom: 8 }}>
              CREDENTIALS
            </div>
            <div style={{ fontSize: 10.5, lineHeight: 1.5, color: '#374151' }}>
              {data.links && <div style={{ marginBottom: 6 }}>{data.links}</div>}
              {data.categoryInfo && <div style={{ fontWeight: 600 }}>{data.categoryInfo}</div>}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1.5px solid ${scheme.border}`, paddingBottom: 3, marginBottom: 8 }}>
              KEY SKILLS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
              {data.skills.map((sk, i) => (
                <div key={i}>
                  <div style={{ fontWeight: 700, color: scheme.dark, marginBottom: 2 }}>{sk.category}</div>
                  <div style={{ color: '#4B5563', fontSize: 10.5 }}>{sk.items}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education (in sidebar) */}
        {data.education && data.education.length > 0 && (
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1.5px solid ${scheme.border}`, paddingBottom: 3, marginBottom: 8 }}>
              EDUCATION
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div style={{ fontWeight: 700, color: '#111827' }}>{edu.degree}</div>
                  <div style={{ color: '#4B5563', fontSize: 10.5 }}>{edu.institution}</div>
                  <div style={{ color: scheme.primary, fontWeight: 600, fontSize: 10.5 }}>
                    {edu.score} • {edu.year}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1.5px solid ${scheme.border}`, paddingBottom: 3, marginBottom: 8 }}>
              CERTIFICATIONS
            </div>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10.5, color: '#374151' }}>
              {data.certifications.map((c, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Canvas */}
      <div style={{ padding: '36px 32px', color: '#111827' }}>
        {/* Name & Target Post */}
        <div style={{ marginBottom: 18, borderBottom: `2px solid ${scheme.primary}`, paddingBottom: 10 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: scheme.dark }}>
            {data.name}
          </h1>
          <div style={{ fontSize: 14, fontWeight: 700, color: scheme.primary, marginTop: 2 }}>
            {data.targetPost}
          </div>
        </div>

        {/* Executive Summary */}
        {data.summary && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              ABOUT / SUMMARY
            </div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: '#374151', textAlign: 'justify' }}>
              {data.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: scheme.dark, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              WORK EXPERIENCE & APPRENTICESHIPS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>
                      {exp.role}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                      {exp.period}
                    </div>
                  </div>
                  <div style={{ fontSize: 11.5, color: scheme.primary, fontWeight: 600, marginBottom: 4 }}>
                    {exp.organization}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: '#374151', lineHeight: 1.5 }}>
                    {exp.bullets?.map((b, bi) => (
                      <li key={bi} style={{ marginBottom: 3 }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Reusable Section Title Component ─────────────────────────
function SectionTitle({ title, scheme }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: `1.5px solid ${scheme.border}`,
        paddingBottom: 4,
        marginBottom: 6,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: scheme.primary,
          display: 'inline-block',
        }}
      />
      <h3
        style={{
          fontSize: 12,
          fontWeight: 800,
          margin: 0,
          color: scheme.dark,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h3>
    </div>
  )
}
