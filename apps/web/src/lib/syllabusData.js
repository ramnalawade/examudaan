// ============================================================
// lib/syllabusData.js — Comprehensive Syllabus & PYQ Data
// ExamUdaan.in — 17 Top State & National Exams
// Features: Full Syllabus, Exam Pattern, Books, & 5+ Years Q&A
// Direct official URLs for Question Papers and Answer Keys
// ============================================================

export const SYLLABUS_EXAMS = [
  // ────────────────────────────────────────────────────────────
  // 1. MPSC State Services (Rajya Seva)
  // ────────────────────────────────────────────────────────────
  {
    slug: "mpsc-state-services",
    name: "MPSC राज्य सेवा परीक्षा (Rajyaseva)",
    nameEn: "MPSC State Services (Rajya Seva)",
    shortName: "MPSC Rajya Seva",
    conductingBody: "Maharashtra Public Service Commission (MPSC)",
    logo: "account_balance",
    color: "#EA580C",
    examLevel: "State",
    targetPosts: ["Deputy Collector", "DSP", "Tehsildar", "Naib Tehsildar", "Section Officer", "BDO"],
    totalVacancies: "~312 (2026 cycle)",
    applicationFee: { general: "₹524", reserved: "₹324" },
    ageLimit: { min: 19, max: 38, scStRelax: 5, obcRelax: 3, pwdRelax: 10, maxReserved: 43 },
    eligibility: "Graduate in any discipline from a recognized University (Final year appearing eligible for Prelims). Marathi language proficiency (Reading, Writing, Speaking) required. Maharashtra domicile required for reservation.",
    stages: ["Prelims (400 Marks)", "Mains Descriptive (9 Papers — 1,750 Marks)", "Interview / Personality Test (275 Marks)"],
    officialWebsite: "https://mpsc.gov.in",
    notificationUrl: "https://mpsconline.gov.in/candidate",
    revisedPatternNotes: {
      totalPapers: 9,
      mainsMarks: 1750,
      interviewMarks: 275,
      grandTotalMarks: 2025,
      qualifyingPapers: "Paper 1 (Marathi — 300 Marks) & Paper 2 (English — 300 Marks) require 25% minimum qualifying marks; not counted in merit.",
      meritPapers: "7 compulsory descriptive papers (Essay + GS 1 to 4 + 2 Optional papers) of 250 marks each (Total 1,750 marks).",
      patternType: "Descriptive UPSC-aligned pattern with Maharashtra-specific emphasis."
    },
    optionalSubjects: [
      { name: "Agriculture", nameMr: "कृषी" },
      { name: "Animal Husbandry & Veterinary Science", nameMr: "पशुपालन आणि पशुवैद्यकीय विज्ञान" },
      { name: "Anthropology", nameMr: "मानववंशशास्त्र" },
      { name: "Botany", nameMr: "वनस्पतिशास्त्र" },
      { name: "Chemistry", nameMr: "रसायनशास्त्र" },
      { name: "Civil Engineering", nameMr: "सिव्हिल अभियांत्रिकी" },
      { name: "Commerce & Accountancy", nameMr: "वाणिज्य आणि लेखा" },
      { name: "Economics", nameMr: "अर्थशास्त्र" },
      { name: "Electrical Engineering", nameMr: "इलेक्ट्रिकल अभियांत्रिकी" },
      { name: "Geography", nameMr: "भूगोल" },
      { name: "Geology", nameMr: "भूविज्ञान" },
      { name: "History", nameMr: "इतिहास" },
      { name: "Law", nameMr: "कायदा" },
      { name: "Management", nameMr: "व्यवस्थापन" },
      { name: "Marathi Literature", nameMr: "मराठी साहित्य" },
      { name: "Mathematics", nameMr: "गणित" },
      { name: "Mechanical Engineering", nameMr: "यांत्रिक अभियांत्रिकी" },
      { name: "Medical Science", nameMr: "वैद्यकीय विज्ञान" },
      { name: "Philosophy", nameMr: "तत्त्वज्ञान" },
      { name: "Physics", nameMr: "भौतिकशास्त्र" },
      { name: "Political Science & International Relations", nameMr: "राज्यशास्त्र आणि आंतरराष्ट्रीय संबंध" },
      { name: "Psychology", nameMr: "मानसशास्त्र" },
      { name: "Public Administration", nameMr: "सार्वजनिक प्रशासन" },
      { name: "Sociology", nameMr: "समाजशास्त्र" },
      { name: "Statistics", nameMr: "सांख्यिकी" },
      { name: "Zoology", nameMr: "प्राणीशास्त्र" }
    ],
    interviewDetails: {
      marks: 275,
      duration: "20–30 minutes",
      panel: "3–5 members (including civil services domain experts & psychologists)",
      purpose: "Assess personality, intellectual integrity, administrative aptitude, social awareness, and communication skills.",
      focusAreas: [
        "Administrative and social awareness regarding Maharashtra & Indian public systems",
        "Social challenges, welfare initiatives and policy resolution in Maharashtra",
        "Current events across State, National and International landscapes",
        "Logical reasoning, critical analysis, ethical clarity and crisis problem-solving",
        "Balanced, objective perspective under situational pressure"
      ]
    },
    papers: [
      {
        stage: "Prelims (Screening — 400 Marks)",
        papers: [
          {
            name: "GS Paper I",
            marks: 200,
            questions: 100,
            duration: "2 hours",
            type: "MCQ (Negative Marking 1/4th)",
            topics: [
              { name: "History of Maharashtra & India", subtopics: ["Ancient & Medieval India", "Modern Indian History (1857-1947)", "Maharashtra Renaissance & Social Reformers", "Freedom Movement in Maharashtra"] },
              { name: "Maharashtra & India Geography", subtopics: ["Physical & Economic Geography", "Rivers, Dams & Drainage Systems of Maharashtra", "Forests, Agriculture & Soil", "Demographics & Urbanization"] },
              { name: "Indian Polity & Governance", subtopics: ["Constitution of India", "Panchayati Raj & 73rd/74th Amendments", "State Legislature & Governor", "Judiciary & High Court", "Public Policy & Rights Issues"] },
              { name: "Economic & Social Development", subtopics: ["Sustainable Development & Poverty", "Maharashtra State Budget & Economic Survey", "Banking, Inflation & RBI", "Social Sector Initiatives & Welfare Programs"] },
              { name: "General Science & Environment", subtopics: ["Physics, Chemistry & Biology basics", "Ecology & Biodiversity of Western Ghats", "Climate Change & Pollution", "Disaster Management"] },
              { name: "Current Events", subtopics: ["Maharashtra State Affairs", "National Political & Economic Events", "International Treaties & Summits", "Sports, Awards & Scientific Milestones"] },
            ]
          },
          {
            name: "CSAT Paper II",
            marks: 200,
            questions: 80,
            duration: "2 hours",
            type: "MCQ (Qualifying — 33% / 66 marks required, Negative Marking 1/4th)",
            topics: [
              { name: "Comprehension", subtopics: ["Marathi Reading Comprehension", "English Reading Comprehension passages"] },
              { name: "Interpersonal Skills & Communication", subtopics: ["Communication dynamics", "Situational context reasoning"] },
              { name: "Logical Reasoning & Analytical Ability", subtopics: ["Syllogisms", "Statement & Assumptions", "Blood Relations", "Coding-Decoding", "Direction Sense"] },
              { name: "Decision Making & Problem Solving", subtopics: ["Administrative ethics scenarios", "Crisis response evaluation"] },
              { name: "Basic Numeracy & Data Interpretation", subtopics: ["Numbers, Ratios & Percentages", "Time, Speed & Work", "Charts, Graphs & Tables (Class X level)"] },
            ]
          }
        ]
      },
      {
        stage: "Mains (Descriptive Pattern — 9 Papers, 1,750 Marks)",
        papers: [
          { name: "Paper 1: Marathi (Descriptive)", marks: 300, duration: "3 hours", type: "Descriptive (Qualifying — 25% required)", topics: [{ name: "Marathi Language (Qualifying)", subtopics: ["Essay Writing (निबंध)", "Précis Writing (सारलेखन)", "Reading Comprehension (आकलन)", "Translation English to Marathi (भाषांतर)"] }] },
          { name: "Paper 2: English (Descriptive)", marks: 300, duration: "3 hours", type: "Descriptive (Qualifying — 25% required)", topics: [{ name: "English Language (Qualifying)", subtopics: ["Essay Writing", "Précis Writing", "Reading Comprehension", "Translation Marathi to English"] }] },
          { name: "Paper 3: Essay (निबंध)", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Essay Writing in Marathi or English", subtopics: ["Philosophical & Socio-cultural topics", "Economic & Political challenges in India & Maharashtra", "Science, Technology & Ethics", "Sustainable Growth & Social Justice"] }] },
          { name: "Paper 4: General Studies I", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Indian Heritage & Culture, History & Geography", subtopics: ["Indian National Movement & 1857 Revolt", "Maharashtra Social Reformers & Renaissance", "World & Physical Geography", "Geomorphic Processes & Climate Systems", "Society and Social Structure of Maharashtra"] }] },
          { name: "Paper 5: General Studies II", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Governance, Constitution, Polity & IR", subtopics: ["Indian Constitution & Federal Framework", "Executive, State Legislature & Governor", "Judiciary, Judicial Activism & Tribunals", "Role of Civil Services in Democracy", "India's Foreign Policy & Neighborhood Relations"] }] },
          { name: "Paper 6: General Studies III", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Technology, Economic Development, Environment & Security", subtopics: ["Indian & Maharashtra Economy & Budget", "Agriculture, PDS & Food Processing", "Science, Tech & IT Innovations", "Western Ghats Biodiversity & Disaster Resilience", "Internal Security Challenges & Cyber Warfare"] }] },
          { name: "Paper 7: General Studies IV", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Ethics, Integrity & Aptitude", subtopics: ["Moral Thinkers, Philosophers & Reformers", "Public Service Values, Ethics & Probity", "Emotional Intelligence & Administrative Attitude", "Case Studies on Administrative Ethics & Dilemmas"] }] },
          { name: "Paper 8: Optional Subject Paper 1 (ऐच्छिक विषय पेपर १)", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Optional Discipline — Section A (Foundational)", subtopics: ["Core Theoretical Principles & Frameworks", "Methodological Approaches & Historical Evolution", "Fundamental Paradigms & Disciplinary Concepts"] }] },
          { name: "Paper 9: Optional Subject Paper 2 (ऐच्छिक विषय पेपर २)", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Optional Discipline — Section B (Applied)", subtopics: ["Specialized Field Application & Analysis", "Indian & Maharashtra Contemporary Case Studies", "Policy Formulation, Critical Evaluation & Innovations"] }] },
        ]
      }
    ],
    officialPdfs: [
      {
        id: 13629,
        year: 2026,
        label: "2026 Rajyaseva Gazetted Prelims Paper 1 (GS)",
        title: "Advt. No. 132/2025 Maharashtra Civil Services Gazetted Combined Preliminary Examination 2026 — Paper No. 1 General Studies",
        size: "1.82 MB",
        url: "/downloads/mpsc/question_papers/2025/13629_PAPER_1.pdf",
        badge: "LATEST 2026",
        isAnswerKey: false,
        pairId: 13801
      },
      {
        id: 13801,
        year: 2026,
        label: "2026 Rajyaseva Prelims Paper 1 Final Key",
        title: "Advt. No. 132/2025 Maharashtra Civil Services Gazetted Prelims 2026 — Paper No. 1 Final Answer Key",
        size: "468 KB",
        url: "/downloads/mpsc/answer_keys/2025/13801_Final Answerkey of Maharashtra Civil Services Gazetted Paper I.pdf",
        badge: "FINAL KEY",
        isAnswerKey: true,
        pairId: 13629
      },
      {
        id: 13628,
        year: 2026,
        label: "2026 Rajyaseva Gazetted Prelims Paper 2 (CSAT)",
        title: "Advt. No. 132/2025 Maharashtra Civil Services Gazetted Combined Preliminary Examination 2026 — Paper No. 2 CSAT",
        size: "2.14 MB",
        url: "/downloads/mpsc/question_papers/2025/13628_PAPER_2.pdf",
        badge: "CSAT 2026",
        isAnswerKey: false,
        pairId: 13802
      },
      {
        id: 13802,
        year: 2026,
        label: "2026 Rajyaseva Prelims Paper 2 Final Key",
        title: "Advt. No. 132/2025 Maharashtra Civil Services Gazetted Prelims 2026 — Paper No. 2 CSAT Final Answer Key",
        size: "455 KB",
        url: "/downloads/mpsc/answer_keys/2025/13802_Final Answerkey of Maharashtra Civil Services Gazetted Paper II.pdf",
        badge: "FINAL KEY",
        isAnswerKey: true,
        pairId: 13628
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "Prelims GS Paper I & CSAT", label: "MPSC 2024 Prelims Question Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2023, exam: "Prelims GS Paper I & CSAT", label: "MPSC 2023 Prelims Question Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2022, exam: "Prelims GS Paper I & CSAT", label: "MPSC 2022 Prelims Question Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2021, exam: "Prelims GS Paper I & CSAT", label: "MPSC 2021 Prelims Question Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2020, exam: "Prelims GS Paper I & CSAT", label: "MPSC 2020 Prelims Question Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2019, exam: "Prelims & Mains GS", label: "MPSC 2019 Question Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
    ],
    books: [
      { title: "भारतीय राज्यघटना आणि राजकारण — एम. लक्ष्मीकांत (मराठी अनुवाद)", useFor: "Polity & Constitution (Prelims + Mains GS-II)" },
      { title: "महाराष्ट्राचा इतिहास — प्रा. कठारे / रा. बा. पाटील", useFor: "Maharashtra History & Social Reformers" },
      { title: "महाराष्ट्राचा भूगोल — ए. बी. सौदी (K'Sagar Publications)", useFor: "Maharashtra Geography & Agriculture" },
      { title: "भारतीय अर्थव्यवस्था — रंजन कोळंबे / देसले", useFor: "Economy & Budget (Prelims + Mains GS-III)" },
      { title: "सुगम मराठी व्याकरण व लेखन — मो. रा. वाळंबे", useFor: "Paper 1 Marathi Descriptive & Grammar" },
    ],
    youtubeQuery: "MPSC Rajyaseva syllabus preparation strategy and previous year questions",
    relatedExams: ["mpsc-combined", "upsc-cse", "mpsc-psi-sti", "mpsc-vanseva"],
  },

  // ────────────────────────────────────────────────────────────
  // 2. MPSC Combined Group B & C
  // ────────────────────────────────────────────────────────────
  {
    slug: "mpsc-combined",
    name: "MPSC दुय्यम सेवा संयुक्त परीक्षा (Group B & C)",
    nameEn: "MPSC Combined Examination (Group B & C)",
    shortName: "MPSC Combined",
    conductingBody: "Maharashtra Public Service Commission (MPSC)",
    logo: "assignment",
    color: "#0284C7",
    examLevel: "State",
    targetPosts: ["Police Sub-Inspector (PSI)", "State Tax Inspector (STI)", "Assistant Section Officer (ASO)", "Sub-Registrar", "Clerk-Typist", "Tax Assistant"],
    totalVacancies: "~8,000+ (Combined Cadres)",
    applicationFee: { general: "₹394", reserved: "₹294" },
    ageLimit: { min: 19, max: 38, scStRelax: 5, obcRelax: 3 },
    eligibility: "Any Bachelor's Degree. For Clerk-Typist: Marathi Typing 30 wpm / English 40 wpm certificate required.",
    stages: ["Combined Prelims (100 Marks)", "Group B/C Mains Exam (400 Marks)", "Physical Test (PSI only)"],
    officialWebsite: "https://mpsc.gov.in",
    notificationUrl: "https://mpsconline.gov.in/candidate",
    papers: [
      {
        stage: "Prelims (Common Screening)",
        papers: [
          {
            name: "General Studies & Aptitude (Combined)",
            marks: 100,
            questions: 100,
            duration: "1 hour (60 minutes)",
            type: "MCQ (1/4th negative marking)",
            topics: [
              { name: "General Science", subtopics: ["Physics, Chemistry, Zoology, Botany, Hygiene & Health"] },
              { name: "Current Affairs", subtopics: ["Global, National and Maharashtra specific recent developments"] },
              { name: "History of Modern India & Maharashtra", subtopics: ["1857 revolt, social reformers (Phule, Ambedkar, Shahu Maharaj), freedom fighters"] },
              { name: "Geography", subtopics: ["Earth, Maharashtra physical divisions, climate, crops, minerals, population"] },
              { name: "Indian Polity & Panchayati Raj", subtopics: ["Constitution, Parliament, High Court, Zilla Parishad, Gram Panchayat administration"] },
              { name: "Economy of India & Maharashtra", subtopics: ["National income, agriculture, industries, 5-year plans, banking, poverty & unemployment"] },
              { name: "Mental Ability & Arithmetic", subtopics: ["Series, Analogy, Coding, Ratio, Profit-Loss, Simple Interest, Average"] },
            ]
          }
        ]
      },
      {
        stage: "Mains Examination",
        papers: [
          {
            name: "Paper 1: Marathi & English Language",
            marks: 200,
            questions: 100,
            duration: "1 hour",
            type: "MCQ (50 Marathi + 50 English questions)",
            topics: [
              { name: "Marathi Grammar (मराठी व्याकरण)", subtopics: ["समानार्थी/विरुद्धार्थी शब्द, वाक्यरचना, म्हणी व वाक्प्रचार, समास, प्रयोग, उतारा आकलन"] },
              { name: "English Grammar", subtopics: ["Vocabulary, Idioms & Phrases, Spotting Errors, Sentence Improvement, Comprehension Passages"] },
            ]
          },
          {
            name: "Paper 2: General Knowledge & Aptitude",
            marks: 200,
            questions: 100,
            duration: "1 hour",
            type: "MCQ",
            topics: [
              { name: "General Knowledge & Law", subtopics: ["Right to Information (RTI 2005), Maharashtra Public Services Act 2015, Computer/IT basics"] },
              { name: "Post Specific Topics", subtopics: ["ASO: Central/State Polity & Secretariat Rules | STI: Sales Tax, GST, Direct Taxes | PSI: IPC, CrPC, Bombay Police Act basics"] },
            ]
          }
        ]
      }
    ],
    officialPdfs: [
      {
        id: 13763,
        year: 2026,
        label: "2026 Group B Combined Prelims (Latest)",
        title: "Advt. No. 011/2026 MPSC Group-B Services Combined Preliminary Examination 2026 — Question Paper",
        size: "975 KB",
        url: "/downloads/mpsc/question_papers/2026/13763_011-2026 Group-B Pre 2026 - Question Paper.pdf",
        badge: "LATEST 2026",
        isAnswerKey: false
      },
      {
        id: 13768,
        year: 2026,
        label: "2026 Group B First Answer Key",
        title: "Advt. No. 011/2026 MPSC Group-B Services Combined Prelims 2026 — Official First Answer Key",
        size: "480 KB",
        url: "/downloads/mpsc/answer_keys/2026/13768_011-2026 Group-B Pre 2026 - First Answer Key.pdf",
        badge: "ANSWER KEY",
        isAnswerKey: true
      },
      {
        id: 12496,
        year: 2025,
        label: "2025 Group B Combined Prelims",
        title: "MPSC Group-B Services Combined Preliminary Examination 2025 — Official Question Paper",
        size: "1.34 MB",
        url: "/downloads/mpsc/question_papers/2025/12496_GROUP-B SERVICES COMBINED PRE EXAMINATION - 2025.pdf",
        isAnswerKey: false
      },
      {
        id: 12540,
        year: 2025,
        label: "2025 Group B First Answer Key",
        title: "MPSC Group-B Combined Preliminary Examination 2025 — Official First Answer Key",
        size: "520 KB",
        url: "/downloads/mpsc/answer_keys/2025/12540_First Answer Key of Maharashtra Group B (Non Gazzeted) Services Combined Preliminary Examination 2025.pdf",
        isAnswerKey: true
      },
      {
        id: 10063,
        year: 2024,
        label: "2024 Group B Combined Prelims",
        title: "MPSC Non-Gazetted Group B Combined Preliminary Exam 2024 — Official Question Paper",
        size: "982 KB",
        url: "/downloads/mpsc/question_papers/2024/10063_GROUP_B_PRE_2024.pdf",
        isAnswerKey: false
      },
      {
        id: 10214,
        year: 2024,
        label: "2024 Group B Final Answer Key",
        title: "MPSC Group B Non-Gazetted Combined Prelims 2024 — Final Official Answer Key",
        size: "444 KB",
        url: "/downloads/mpsc/answer_keys/2024/10214_maharashtra  gr-b non-gazzetted combined pre exam 2024 final key 4225 pdf.pdf",
        isAnswerKey: true
      },
      {
        id: 10893,
        year: 2024,
        label: "2024 Group C Combined Prelims",
        title: "MPSC Group C Combined Preliminary Examination 2024 — Official Question Paper",
        size: "1.24 MB",
        url: "/downloads/mpsc/question_papers/2024/10893_GROUP_C_PRE_2024.pdf",
        isAnswerKey: false
      },
      {
        id: 11232,
        year: 2024,
        label: "2024 Group C Final Answer Key",
        title: "MPSC Group C Combined Preliminary Examination 2024 — Final Official Answer Key",
        size: "452 KB",
        url: "/downloads/mpsc/answer_keys/2024/11232_Maharashtra Group C  pre exam 2024 Final Answer key.pdf",
        isAnswerKey: true
      }
    ],
    pyqLinks: [
      {
        year: 2026,
        exam: "Combined Prelims Group B",
        label: "MPSC Combined Prelims 2026 Question Paper & First Key",
        paperUrl: "/downloads/mpsc/question_papers/2026/13763_011-2026 Group-B Pre 2026 - Question Paper.pdf",
        answerKeyUrl: "/downloads/mpsc/answer_keys/2026/13768_011-2026 Group-B Pre 2026 - First Answer Key.pdf",
        url: "/downloads/mpsc/question_papers/2026/13763_011-2026 Group-B Pre 2026 - Question Paper.pdf"
      },
      {
        year: 2025,
        exam: "Combined Prelims Group B",
        label: "MPSC Combined Prelims 2025 Question Paper & Key",
        paperUrl: "/downloads/mpsc/question_papers/2025/12496_GROUP-B SERVICES COMBINED PRE EXAMINATION - 2025.pdf",
        answerKeyUrl: "/downloads/mpsc/answer_keys/2025/12540_First Answer Key of Maharashtra Group B (Non Gazzeted) Services Combined Preliminary Examination 2025.pdf",
        url: "/downloads/mpsc/question_papers/2025/12496_GROUP-B SERVICES COMBINED PRE EXAMINATION - 2025.pdf"
      },
      {
        year: 2024,
        exam: "Combined Prelims Group B",
        label: "MPSC Combined Prelims 2024 Question Paper & Final Key",
        paperUrl: "/downloads/mpsc/question_papers/2024/10063_GROUP_B_PRE_2024.pdf",
        answerKeyUrl: "/downloads/mpsc/answer_keys/2024/10214_maharashtra  gr-b non-gazzetted combined pre exam 2024 final key 4225 pdf.pdf",
        url: "/downloads/mpsc/question_papers/2024/10063_GROUP_B_PRE_2024.pdf"
      },
      {
        year: 2024,
        exam: "Combined Prelims Group C",
        label: "MPSC Group C Prelims 2024 Question Paper & Final Key",
        paperUrl: "/downloads/mpsc/question_papers/2024/10893_GROUP_C_PRE_2024.pdf",
        answerKeyUrl: "/downloads/mpsc/answer_keys/2024/11232_Maharashtra Group C  pre exam 2024 Final Answer key.pdf",
        url: "/downloads/mpsc/question_papers/2024/10893_GROUP_C_PRE_2024.pdf"
      },
      {
        year: 2023,
        exam: "Group B & C Prelims",
        label: "MPSC Combined 2023 Prelims Paper & Key",
        paperUrl: "https://mpsc.gov.in/prev_que_papers/9",
        answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10",
        url: "https://mpsc.gov.in/prev_que_papers/9"
      }
    ],
    books: [
      { title: "मराठी व्याकरण — मो. रा. वाळंबे", useFor: "Mains Paper 1 Marathi (50 marks)" },
      { title: "English Grammar & Composition — Pal & Suri / Wren & Martin", useFor: "Mains Paper 1 English (50 marks)" },
      { title: "तात्यांचा ठोकळा (Eknath Patil Tatya Thokla)", useFor: "Prelims GS All Subjects Revision" },
      { title: "सामान्य विज्ञान — डॉ. सचिन भस्के", useFor: "General Science for Combined Prelims" },
      { title: "बुद्धिमत्ता चाचणी — सचिन ढवळे / अनिल अंकलगी", useFor: "Reasoning & Quantitative Aptitude" },
    ],
    youtubeQuery: "MPSC combined group b c syllabus previous year paper analysis",
    relatedExams: ["mpsc-state-services", "mpsc-psi-sti", "maharashtra-police", "maharashtra-talathi"],
  },

  // ────────────────────────────────────────────────────────────
  // 3. MPSC PSI / STI / ASO Direct
  // ────────────────────────────────────────────────────────────
  {
    slug: "mpsc-psi-sti",
    name: "MPSC PSI / STI / ASO विशेष परीक्षा",
    nameEn: "MPSC PSI / STI / ASO Special Cadre",
    shortName: "MPSC PSI/STI/ASO",
    conductingBody: "Maharashtra Public Service Commission (MPSC)",
    logo: "local_police",
    color: "#059669",
    examLevel: "State",
    targetPosts: ["Police Sub-Inspector (PSI)", "State Tax Inspector (STI)", "Assistant Section Officer (ASO)"],
    totalVacancies: "~1,200 (Combined Annual)",
    applicationFee: { general: "₹394", reserved: "₹294" },
    ageLimit: { min: 19, max: 31, scStRelax: 5, obcRelax: 3 },
    eligibility: "Graduate in any faculty. Physical standards: Male height ≥ 165 cm, chest 79-84 cm; Female height ≥ 157 cm.",
    stages: ["Combined Prelims", "Mains (Paper 1 Language + Paper 2 Core)", "Physical Test (70 min marks)", "Interview"],
    officialWebsite: "https://mpsc.gov.in",
    notificationUrl: "https://mpsconline.gov.in/candidate",
    papers: [
      {
        stage: "Mains Special Papers",
        papers: [
          {
            name: "PSI Paper 2: Legal & Police Administration",
            marks: 200,
            questions: 100,
            duration: "1 hour",
            type: "MCQ",
            topics: [
              { name: "Criminal Law Basics", subtopics: ["Indian Penal Code / Bharatiya Nyaya Sanhita essentials", "CrPC / BNSS arrest & bail procedures", "Indian Evidence Act / BSA basics"] },
              { name: "Maharashtra Police Act", subtopics: ["Powers of Police Officers, duties, offenses and punishments"] },
              { name: "Human Rights & Cyber Crime", subtopics: ["Protection of Human Rights Act 1993", "Atrocities Act (SC/ST Act 1989)", "IT Act 2000 basic offenses"] },
            ]
          },
          {
            name: "STI Paper 2: Fiscal & Taxation Policy",
            marks: 200,
            questions: 100,
            duration: "1 hour",
            type: "MCQ",
            topics: [
              { name: "Goods & Services Tax (GST)", subtopics: ["CGST, SGST, IGST framework", "Input Tax Credit mechanism", "Composition levy & GST council"] },
              { name: "Public Finance & Banking", subtopics: ["State fiscal deficit, FRBM Act, Budget estimates, Stamp Duty & Registration Act"] },
              { name: "Economic Reforms", subtopics: ["1991 LPG reforms, WTO agreements, Industrial policy of Maharashtra"] },
            ]
          }
        ]
      }
    ],
    officialPdfs: [
      {
        id: "mpsc-psi-2026-pre-qp",
        year: 2026,
        label: "2026 गट-ब संयुक्त पूर्व परीक्षा पेपर",
        title: "महाराष्ट्र दुय्यम सेवा अराजपत्रित गट-ब (PSI/STI/ASO) संयुक्त पूर्व परीक्षा २०२६ अधिकृत प्रश्नपत्रिका",
        size: "1.78 MB",
        url: "/downloads/mpsc/question_papers/2026/13763_011-2026 Group-B Pre 2026 - Question Paper.pdf",
        badge: "LATEST 2026",
        isAnswerKey: false,
        pairId: "mpsc-psi-2026-pre-ak"
      },
      {
        id: "mpsc-psi-2026-pre-ak",
        year: 2026,
        label: "2026 गट-ब पूर्व अंतिम उत्तरतालिका",
        title: "महाराष्ट्र दुय्यम सेवा अराजपत्रित गट-ब संयुक्त पूर्व परीक्षा २०२६ — अधिकृत अंतिम उत्तरतालिका (Final Answer Key)",
        size: "445 KB",
        url: "/downloads/mpsc/answer_keys/2026/13877_011-2026 Gr-B Pre 2026 - Final Answer Key.pdf",
        badge: "FINAL KEY",
        isAnswerKey: true,
        pairId: "mpsc-psi-2026-pre-qp"
      },
      {
        id: "mpsc-psi-2025-mains-p1-qp",
        year: 2025,
        label: "2025 गट-ब मुख्य पेपर १ (भाषा)",
        title: "महाराष्ट्र गट-ब मुख्य परीक्षा २०२५ — पेपर क्रमांक १ भाषा (मराठी व इंग्रजी) अधिकृत प्रश्नपत्रिका",
        size: "1.95 MB",
        url: "/downloads/mpsc/question_papers/2026/13548_GROUP B MAIN 2025_PAPER_1.pdf",
        badge: "2025 MAINS",
        isAnswerKey: false,
        pairId: "mpsc-psi-2025-mains-p1-ak"
      },
      {
        id: "mpsc-psi-2025-mains-p1-ak",
        year: 2025,
        label: "2025 गट-ब मुख्य पेपर १ उत्तरतालिका",
        title: "महाराष्ट्र गट-ब मुख्य परीक्षा २०२५ — पेपर क्रमांक १ अंतिम उत्तरतालिका",
        size: "460 KB",
        url: "/downloads/mpsc/answer_keys/2026/13799_Final Answer key of Maharashtra Group B Non Gazetted Main Exam 2025 Paper 1 (1).pdf",
        badge: "FINAL KEY",
        isAnswerKey: true,
        pairId: "mpsc-psi-2025-mains-p1-qp"
      },
      {
        id: "mpsc-psi-2025-mains-p2-qp",
        year: 2025,
        label: "2025 गट-ब मुख्य पेपर २ (सामान्य अध्ययन)",
        title: "महाराष्ट्र गट-ब मुख्य परीक्षा २०२५ — पेपर क्रमांक २ सामान्य अध्ययन व बुद्धिमत्ता चाचणी अधिकृत प्रश्नपत्रिका",
        size: "2.10 MB",
        url: "/downloads/mpsc/question_papers/2026/13547_GROUP B MAIN 2025_PAPER_2.pdf",
        badge: "2025 MAINS",
        isAnswerKey: false,
        pairId: "mpsc-psi-2025-mains-p2-ak"
      },
      {
        id: "mpsc-psi-2025-mains-p2-ak",
        year: 2025,
        label: "2025 गट-ब मुख्य पेपर २ उत्तरतालिका",
        title: "महाराष्ट्र गट-ब मुख्य परीक्षा २०२५ — पेपर क्रमांक २ अंतिम उत्तरतालिका",
        size: "450 KB",
        url: "/downloads/mpsc/answer_keys/2026/13800_Final Answer key of Maharashtra Group B Non Gazetted Main Exam 2025 Paper 2 (1).pdf",
        badge: "FINAL KEY",
        isAnswerKey: true,
        pairId: "mpsc-psi-2025-mains-p2-qp"
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "PSI/STI Mains Paper II", label: "MPSC PSI/STI 2024 Mains Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2023, exam: "PSI/STI Mains Paper II", label: "MPSC PSI/STI 2023 Mains Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2022, exam: "PSI/STI Mains Paper II", label: "MPSC PSI/STI 2022 Mains Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2021, exam: "PSI/STI Mains Paper II", label: "MPSC PSI/STI 2021 Mains Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2020, exam: "PSI/STI Mains Paper II", label: "MPSC PSI/STI 2020 Mains Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
    ],
    books: [
      { title: "कायद्याचे ज्ञान (Law for PSI) — विठ्ठल पुंगळे / Unique Academy", useFor: "PSI Paper 2 Major Acts & Minor Acts" },
      { title: "अर्थव्यवस्था व करप्रणाली — देसले भाग १ व २", useFor: "STI Paper 2 GST and Taxation" },
      { title: "भारतीय राज्यघटना — एम. लक्ष्मीकांत", useFor: "ASO Paper 2 Polity and Secretariat" },
    ],
    youtubeQuery: "MPSC PSI law syllabus physical test previous questions",
    relatedExams: ["mpsc-combined", "maharashtra-police", "mpsc-state-services"],
  },

  // ────────────────────────────────────────────────────────────
  // 4. Maharashtra Police Bharti
  // ────────────────────────────────────────────────────────────
  {
    slug: "maharashtra-police",
    name: "महाराष्ट्र पोलीस भरती (Police Bharti)",
    nameEn: "Maharashtra Police Bharti (Constable / Driver / SRPF)",
    shortName: "MH Police Bharti",
    conductingBody: "Maharashtra State Police Department (ADGP Training & Special Units)",
    logo: "shield",
    color: "#DC2626",
    examLevel: "State",
    targetPosts: ["Police Constable (पोलीस शिपाई)", "Police Driver Constable (चालक)", "SRPF Armed Police Constable", "Bandsman"],
    totalVacancies: "17,471+ (Annual State Cycles)",
    applicationFee: { general: "₹450", reserved: "₹350" },
    ageLimit: { min: 18, max: 28, scStRelax: 5, obcRelax: 5 },
    eligibility: "12th Standard (HSC) passed from recognized Maharashtra State Board or equivalent. Driver post requires valid Driving License (LMV/TR).",
    stages: ["Physical Efficiency Test (PET - 50 Marks)", "Written Examination (100 Marks / 90 mins)", "Driver Skill Test (50 Marks - Driver Only)", "Document Verification & Medical"],
    officialWebsite: "https://mahapolice.gov.in/citizen/recruitment.htm",
    notificationUrl: "https://policerecruitment2024.mahait.org",
    papers: [
      {
        stage: "Stage 1: Physical Efficiency Test (PET - 50 Marks)",
        papers: [
          {
            name: "पुरुष उमेदवार शारीरिक चाचणी (Male Candidates - 50 Marks)",
            marks: 50,
            duration: "On ground events",
            type: "Physical Events (Qualifying: 50% / 25 Marks to enter Written Test)",
            topics: [
              {
                name: "१६०० मीटर धावणे (1600m Running - 20 Marks)",
                subtopics: [
                  "५ मिनिटे १० सेकंद किंवा त्यापेक्षा कमी: २० पैकी २० गुण (Full Marks)",
                  "५ मि. १० से. ते ५ मि. ३० सेकंद: १८ गुण",
                  "५ मि. ३० से. ते ५ मि. ५० सेकंद: १५ गुण",
                  "५ मि. ५० से. ते ६ मि. १० सेकंद: १० गुण",
                  "६ मि. १० से. पेक्षा जास्त वेळ: ० गुण (Disqualified from event)"
                ]
              },
              {
                name: "१०० मीटर धावणे (100m Sprint - 15 Marks)",
                subtopics: [
                  "११.५० सेकंद किंवा त्यापेक्षा कमी: १५ पैकी १५ गुण",
                  "११.५० ते १२.५० सेकंद: १२ गुण",
                  "१२.५० ते १३.५० सेकंद: १० गुण",
                  "१३.५० ते १४.५० सेकंद: ८ गुण",
                  "१४.५० सेकंदांपेक्षा जास्त: ० गुण"
                ]
              },
              {
                name: "गोळाफेक (Shot Put 7.260 kg - 15 Marks)",
                subtopics: [
                  "८.५० मीटर किंवा त्यापेक्षा जास्त लांब: १५ पैकी १५ गुण",
                  "७.९० ते ८.५० मीटर: १२ गुण",
                  "७.३० ते ७.९० मीटर: १० गुण",
                  "६.७० ते ७.३० मीटर: ८ गुण",
                  "३.१० मीटरपेक्षा कमी: ० गुण"
                ]
              },
              {
                name: "शारीरिक पात्रता निकष (Physical Eligibility Standards)",
                subtopics: [
                  "किमान उंची: १६५ सेमी (पुरुष उमेदवार)",
                  "छाती: न फुगवता किमान ७९ सेमी आणि फुगवून किमान ५ सेमी जास्त (किमान ८४ सेमी)"
                ]
              }
            ]
          },
          {
            name: "महिला उमेदवार शारीरिक चाचणी (Female Candidates - 50 Marks)",
            marks: 50,
            duration: "On ground events",
            type: "Physical Events (Qualifying: 50% / 25 Marks to enter Written Test)",
            topics: [
              {
                name: "८०० मीटर धावणे (800m Running - 20 Marks)",
                subtopics: [
                  "२ मिनिटे ५० सेकंद किंवा त्यापेक्षा कमी: २० पैकी २० गुण",
                  "२ मि. ५० से. ते ३ मि. ०० सेकंद: १८ गुण",
                  "३ मि. ०० से. ते ३ मि. १० सेकंद: १५ गुण",
                  "३ मि. १० से. ते ३ मि. २० सेकंद: १० गुण",
                  "३ मि. २० सेकंदांपेक्षा जास्त: ० गुण"
                ]
              },
              {
                name: "१०० मीटर धावणे (100m Sprint - 15 Marks)",
                subtopics: [
                  "१४.०० सेकंद किंवा त्यापेक्षा कमी: १५ पैकी १५ गुण",
                  "१४.०० ते १५.०० सेकंद: १२ गुण",
                  "१५.०० ते १६.०० सेकंद: १० गुण",
                  "१६.०० ते १७.०० सेकंद: ८ गुण",
                  "१७.०० सेकंदांपेक्षा जास्त: ० गुण"
                ]
              },
              {
                name: "गोळाफेक (Shot Put 4.0 kg - 15 Marks)",
                subtopics: [
                  "६.०० मीटर किंवा त्यापेक्षा जास्त: १५ पैकी १५ गुण",
                  "५.५० ते ६.०० मीटर: १२ गुण",
                  "५.०० ते ५.५० मीटर: १० गुण",
                  "४.५० ते ५.०० मीटर: ८ गुण",
                  "४.०० मीटरपेक्षा कमी: ० गुण"
                ]
              },
              {
                name: "शारीरिक पात्रता निकष (Female Physical Standards)",
                subtopics: [
                  "किमान उंची: १५८ सेमी (महिला उमेदवार)"
                ]
              }
            ]
          }
        ]
      },
      {
        stage: "Stage 2: Written Examination (100 Marks / 90 Mins)",
        papers: [
          {
            name: "पोलीस भरती लेखी परीक्षा (Written Test — 100 Qs / 100 Marks)",
            marks: 100,
            questions: 100,
            duration: "90 minutes (1.5 hours)",
            type: "Objective MCQ (OMR / CBT) — Negative Marking: None",
            topics: [
              {
                name: "१. अंकगणित (Mathematics & Arithmetic — 25 Marks / 25 Qs)",
                subtopics: [
                  "संख्याज्ञान, संख्यांचे प्रकार, दर्शनी व स्थानिक किंमत",
                  "लसावि व मसावि (LCM & HCF) व शाब्दिक उदाहरणे",
                  "दशांश अपूर्णांक, व्यवहारी अपूर्णांक व आवर्ती दशांश",
                  "शेकडेवारी (Percentage) व व्यवहारातील उपयोग",
                  "नफा, तोटा, सूट व कमिशन (Profit, Loss & Discount)",
                  "सरळव्याज व चक्रवाढ व्याज (Simple & Compound Interest)",
                  "गुणोत्तर व प्रमाण (Ratio & Proportion) व भागीदारी",
                  "सरासरी (Average) व वयावर आधारित गणिते (Age Problems)",
                  "काळ, काम आणि वेग (Time, Work & Wages) व नळ-टाकी",
                  "अंतर, वेग व आगगाडीवरील उदाहरणे (Speed, Distance & Trains)"
                ]
              },
              {
                name: "२. बुद्धिमत्ता चाचणी (Mental Ability & Reasoning — 25 Marks / 25 Qs)",
                subtopics: [
                  "संख्यामालिका व अक्षरमालिका (Number & Alphabet Series)",
                  "वेन आकृत्या व बहुपर्यायी आकृत्या संबंध (Venn Diagrams)",
                  "दिशाज्ञान चाचणी व अंतर मोजणे (Direction & Distance Test)",
                  "नातेसंबंध व कौटुंबिक रचना (Blood Relations)",
                  "घड्याळ व कॅलेंडर (Clocks & Calendar Problems)",
                  "सांकेतिक भाषा व कोडिंग-डिकोडिंग (Coding-Decoding)",
                  "विसंगत घटक ओळखणे (Odd One Out — शब्द, संख्या, आकृत्या)",
                  "बैठक व्यवस्था व क्रमवारी (Seating Arrangement & Ranking)",
                  "तार्किक विचार व विधाने-अनुमान (Logical Deductions & Syllogism)",
                  "आकृत्यांची संख्या मोजणे व जल/आरसा प्रतिमा (Mirror & Water Images)"
                ]
              },
              {
                name: "३. मराठी व्याकरण (Marathi Grammar — 25 Marks / 25 Qs)",
                subtopics: [
                  "मराठी वर्णमाला, स्वर, स्वरादी, व्यंजने व उच्चारस्थाने",
                  "संधी व संधींचे प्रकार (स्वरसंधी, व्यंजनसंधी, विसर्गसंधी)",
                  "शब्दांच्या जाती: नाम, सर्वनाम, विशेषण व क्रियापद",
                  "लिंग विचार, वचन विचार व विभक्ती आणि कारकार्थ",
                  "काळ व काळांचे प्रकार (वर्तमानकाळ, भूतकाळ, भविष्यकाळ)",
                  "प्रयोग विचार: कर्तरी, कर्मणी व भावे प्रयोग ओळखणे",
                  "समास व प्रकार: अव्ययीभाव, तत्पुरुष, द्वंद्व, बहुव्रीही",
                  "समानार्थी शब्द, विरुद्धार्थी शब्द व शब्दसमूहाबद्दल एक शब्द",
                  "मराठी म्हणी व वाक्प्रचार (अर्थ, वाक्यात उपयोग व अर्थछटा)",
                  "शुद्धलेखनाचे नियम, विरामचिन्हे व अलंकार ओळखणे"
                ]
              },
              {
                name: "४. सामान्य ज्ञान व चालू घडामोडी (General Knowledge & Current Affairs — 25 Marks / 25 Qs)",
                subtopics: [
                  "महाराष्ट्राचा इतिहास: छ. शिवाजी महाराज, पेशवेकाळ व १८५७ चा उठाव",
                  "महाराष्ट्रातील समाजसुधारक: म. फुले, डॉ. बाबासाहेब आंबेडकर, शाहू महाराज, लोकमान्य टिळक, महर्षी कर्वे",
                  "महाराष्ट्राचा भूगोल: ३६ जिल्हे, प्रशासकीय विभाग, सह्याद्री पर्वत, घाट व नद्या (गोदावरी, भीमा, कृष्णा)",
                  "महाराष्ट्र जिल्हानिहाय विशेष माहिती: किल्ले, अभयारण्ये, पिके, उद्योग व स्थानिक पोलीस आयुक्तालय",
                  "भारतीय राज्यघटना व शासन: मूलभूत हक्क, मार्गदर्शक तत्त्वे, राष्ट्रपती, राज्यपाल व विधानसभा",
                  "महाराष्ट्र पोलीस प्रशासन रचना: DGP कार्यालय, पोलीस आयुक्त (CP), SP, ACP, PI, PSI पदानुक्रम",
                  "पोलीस शिपाई अधिकार, कर्तव्ये व मुंबई पोलीस कायदा तरतुदी",
                  "सामान्य विज्ञान व आरोग्यशास्त्र: भौतिक, रसायन, जीवशास्त्र, मानवी शरीर, रोग व लसीकरण",
                  "पर्यावरण व प्रदूषण: महाराष्ट्र राष्ट्रीय उद्याने (ताडोबा, पेंच, संजय गांधी) व व्याघ्र प्रकल्प",
                  "चालू घडामोडी २०२४–२०२६: महाराष्ट्र राज्य योजना, क्रीडा स्पर्धा, पुरस्कार, नियुक्त्या व देश-विदेश"
                ]
              }
            ]
          }
        ]
      },
      {
        stage: "Stage 3: पोलीस चालक कौशल्य चाचणी (Driver Skill Test — 50 Marks)",
        papers: [
          {
            name: "पोलीस चालक चाचणी (फक्त चालक पदासाठी)",
            marks: 50,
            duration: "Practical driving track",
            type: "Practical Driving (Qualifying — Min 50% Marks Required)",
            topics: [
              {
                name: "हलके मोटार वाहन ड्रायव्हिंग चाचणी (LMV Driving Test — 25 Marks)",
                subtopics: ["Light Motor Vehicle (LMV) ट्रॅक ड्रायव्हिंग, 'H' व '8' आकाराचा ट्रॅक, रिव्हर्स पार्किंग व चढण नियंत्रण"]
              },
              {
                name: "जीप / अवजड वाहन ड्रayव्हिंग चाचणी (Heavy/Jeep Test — 25 Marks)",
                subtopics: ["Jeep प्रकारातील वाहन चालवणे, ट्रॅफिक सिग्नल नियम, रस्ता सुरक्षा नियम व प्राथमिक यांत्रिक दोष निवारण"]
              }
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "Written Examination", label: "Maharashtra Police Bharti 2024 Paper & Answer Key", paperUrl: "https://mahapolice.gov.in/citizen/recruitment.htm", answerKeyUrl: "https://mahapolice.gov.in/citizen/recruitment.htm", url: "https://mahapolice.gov.in" },
      { year: 2023, exam: "Written Examination", label: "Maharashtra Police Bharti 2023 Paper & Answer Key", paperUrl: "https://mahapolice.gov.in/citizen/recruitment.htm", answerKeyUrl: "https://mahapolice.gov.in/citizen/recruitment.htm", url: "https://mahapolice.gov.in" },
      { year: 2022, exam: "Written Examination", label: "Maharashtra Police Bharti 2022 Paper & Answer Key", paperUrl: "https://mahapolice.gov.in/citizen/recruitment.htm", answerKeyUrl: "https://mahapolice.gov.in/citizen/recruitment.htm", url: "https://mahapolice.gov.in" },
      { year: 2021, exam: "Written Examination (Nagpur/Mumbai)", label: "Maharashtra Police Bharti 2021 Paper & Answer Key", paperUrl: "https://mahapolice.gov.in/citizen/recruitment.htm", answerKeyUrl: "https://mahapolice.gov.in/citizen/recruitment.htm", url: "https://mahapolice.gov.in" },
      { year: 2019, exam: "Written Examination", label: "Maharashtra Police Bharti 2019 Paper & Answer Key", paperUrl: "https://mahapolice.gov.in/citizen/recruitment.htm", answerKeyUrl: "https://mahapolice.gov.in/citizen/recruitment.htm", url: "https://mahapolice.gov.in" },
    ],
    books: [
      { title: "पोलीस भरती संपूर्ण मार्गदर्शक — नोबल पब्लिकेशन / युनिक अकॅडमी", useFor: "Full written test syllabus coverage" },
      { title: "मराठी व्याकरण — मो. रा. वाळंबे", useFor: "25 Marks Marathi Grammar section" },
      { title: "स्मार्ट पोलीस भरती अंकगणित व बुद्धिमत्ता — पंढरीनाथ राणे", useFor: "50 Marks Maths and Reasoning section" },
      { title: "जिल्हा विशेष सामान्य ज्ञान पुस्तिका — तात्यांचा ठोकळा", useFor: "District police specific general knowledge" },
    ],
    youtubeQuery: "Maharashtra police bharti written test question paper and ground test preparation",
    relatedExams: ["mpsc-combined", "mpsc-psi-sti", "maharashtra-forest"],
  },

  // ────────────────────────────────────────────────────────────
  // 5. Maharashtra Talathi Bharti
  // ────────────────────────────────────────────────────────────
  {
    slug: "maharashtra-talathi",
    name: "महाराष्ट्र तलाठी भरती (Talathi Bharti)",
    nameEn: "Maharashtra Talathi Bharti (Revenue Department)",
    shortName: "MH Talathi Bharti",
    conductingBody: "Revenue & Forest Department, Maharashtra (Land Records / Mahabhumi)",
    logo: "history_edu",
    color: "#7C3AED",
    examLevel: "State",
    targetPosts: ["Talathi (तलाठी - गट क महसूल विभाग)"],
    totalVacancies: "4,644+ (Annual State Cycles)",
    applicationFee: { general: "₹1000", reserved: "₹900" },
    ageLimit: { min: 19, max: 38, scStRelax: 5, obcRelax: 3 },
    eligibility: "Any Degree from recognized University. MSCIT or Computer certification + Marathi language proficiency required.",
    stages: ["Computer Based Test (CBT - TCS Pattern / 200 Marks)", "Document Verification"],
    officialWebsite: "https://mahabhumi.gov.in/mahabhumihome",
    notificationUrl: "https://mahabhumilink.maharashtra.gov.in",
    papers: [
      {
        stage: "Single Online CBT Examination",
        papers: [
          {
            name: "Talathi CBT Written Test (TCS Pattern)",
            marks: 200,
            questions: 100,
            duration: "2 hours (120 minutes)",
            type: "CBT MCQ (No negative marking)",
            topics: [
              { name: "Marathi Language (मराठी भाषा - 25 Qs / 50 Marks)", subtopics: ["समानार्थी व विरुद्धार्थी शब्द", "काळ व काळांचे प्रकार", "प्रयोग व समास", "मराठी साहित्य व लेखक", "वाक्य रूपांतर व वाक्प्रचार"] },
              { name: "English Language (25 Qs / 50 Marks)", subtopics: ["Vocabulary, Synonyms & Antonyms", "Tenses & Subject-Verb Agreement", "Active & Passive Voice", "Direct & Indirect Speech", "Idioms, Phrases & Reading Passage"] },
              { name: "General Knowledge (सामान्य ज्ञान - 25 Qs / 50 Marks)", subtopics: ["इतिहास (१८५७ चा उठाव व समाजसुधारक)", "महाराष्ट्र भूगोल व जिल्हानिहाय माहिती", "भारतीय राज्यघटना व पंचायत राज", "पर्यावरण व चालू घडामोडी", "माहिती अधिकार कायदा २००५"] },
              { name: "Intellectual Test & Maths (बौद्धिक चाचणी - 25 Qs / 50 Marks)", subtopics: ["अक्षर व संख्या मालिका", "दिशा, घड्याळ व कॅलेंडर", "बॉडमास (BODMAS), सरासरी व नफा-तोटा", "गुणोत्तर व प्रमाण", "कोडिंग-डिकोडिंग व नातेसंबंध"] },
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2023, exam: "CBT Exam (All Shifts TCS)", label: "Talathi Bharti 2023 CBT Papers & Answer Key", paperUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action", answerKeyUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action", url: "https://mahabhumi.gov.in" },
      { year: 2022, exam: "District Written Papers", label: "Talathi Bharti 2022 Paper & Answer Key", paperUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action", answerKeyUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action", url: "https://mahabhumi.gov.in" },
      { year: 2019, exam: "Mahapariksha Online Test", label: "Talathi Bharti 2019 Question Paper & Key", paperUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action", answerKeyUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action", url: "https://mahabhumi.gov.in" },
      { year: 2016, exam: "Offline District Exams", label: "Talathi Bharti 2016 Question Paper & Key", paperUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action", answerKeyUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action", url: "https://mahabhumi.gov.in" },
      { year: 2015, exam: "Offline District Exams", label: "Talathi Bharti 2015 Question Paper & Key", paperUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action", answerKeyUrl: "https://mahabhumi.gov.in/mahabhumihome/citizenPortal.action", url: "https://mahabhumi.gov.in" },
    ],
    books: [
      { title: "तलाठी भरती संपूर्ण प्रश्नपत्रिका संच — स्मार्ट स्टडी पब्लिकेशन (TCS पॅटर्न)", useFor: "Latest TCS pattern questions and shiftwise papers" },
      { title: "सुगम मराठी व्याकरण — मो. रा. वाळंबे", useFor: "Marathi 50 marks full preparation" },
      { title: "Essential English Grammar — Raymond Murphy / Balasaheb Shinde", useFor: "English language grammar and comprehension" },
      { title: "तात्यांचा ठोकळा (सामान्य ज्ञान)", useFor: "Complete Maharashtra GK and Constitution" },
    ],
    youtubeQuery: "Maharashtra talathi bharti TCS pattern syllabus question paper analysis",
    relatedExams: ["maharashtra-zp", "mpsc-combined", "maharashtra-forest"],
  },

  // ────────────────────────────────────────────────────────────
  // 6. Maharashtra Zilla Parishad (ZP) Bharti
  // ────────────────────────────────────────────────────────────
  {
    slug: "maharashtra-zp",
    name: "महाराष्ट्र जिल्हा परिषद भरती (ZP Bharti)",
    nameEn: "Maharashtra Zilla Parishad Bharti (Arogya / Gramsevak / JE)",
    shortName: "MH ZP Bharti",
    conductingBody: "Rural Development & Panchayati Raj Dept, Maharashtra (conducted via IBPS)",
    logo: "apartment",
    color: "#2563EB",
    examLevel: "State",
    targetPosts: ["Gram Sevak (ग्रामसेवक)", "Arogya Sevak (आरोग्य सेवक)", "Junior Engineer (Civil)", "Extension Officer (विस्तार अधिकारी)", "Lab Technician"],
    totalVacancies: "19,460+ (34 Zilla Parishads)",
    applicationFee: { general: "₹1000", reserved: "₹900" },
    ageLimit: { min: 18, max: 38, scStRelax: 5, obcRelax: 3 },
    eligibility: "12th with 60% / Diploma for Gramsevak; D.Pharm / B.Sc for Arogya Sevak; BE/Diploma Civil for JE.",
    stages: ["Online CBT (IBPS Pattern / 200 Marks)", "Document Verification"],
    officialWebsite: "https://rdd.maharashtra.gov.in/en/recruitment",
    notificationUrl: "https://rdd.maharashtra.gov.in/en/recruitment",
    papers: [
      {
        stage: "Online CBT Examination (IBPS Pattern)",
        papers: [
          {
            name: "Non-Technical Common Section",
            marks: 120,
            questions: 60,
            duration: "Part of 120 min composite time",
            type: "CBT MCQ",
            topics: [
              { name: "Marathi Language (15 Qs / 30 Marks)", subtopics: ["मराठी व्याकरण, समानार्थी/विरुद्धार्थी शब्द, वाक्यरचना, उतारा आकलन"] },
              { name: "English Language (15 Qs / 30 Marks)", subtopics: ["Grammar, Vocabulary, Sentence Rearrangement, Reading Comprehension"] },
              { name: "General Knowledge (15 Qs / 30 Marks)", subtopics: ["जिल्हा परिषद प्रशासन, ७३ वी घटनादुरुस्ती, समाजसुधारक, चालू घडामोडी"] },
              { name: "Reasoning & Aptitude (15 Qs / 30 Marks)", subtopics: ["Number Series, Syllogisms, Coding-Decoding, Seating Arrangements, Data Interpretation"] },
            ]
          },
          {
            name: "Technical / Post-Specific Subject",
            marks: 80,
            questions: 40,
            duration: "Part of 120 min composite time",
            type: "CBT MCQ (Core Subject)",
            topics: [
              { name: "Gram Sevak Agriculture & Rural Dev", subtopics: ["कृषी शास्त्र, पिके व सिंचन, पंचायत राज व्यवस्था, ग्रामीण विकास योजना (PMAY, MGNREGA)"] },
              { name: "Arogya Sevak Biology & Health Science", subtopics: ["मानवी शरीरशास्त्र, रोग व लस, पोषण, राष्ट्रीय आरोग्य अभियान (NHM), प्राथमिक आरोग्य केंद्र कार्यप्रणाली"] },
              { name: "Junior Engineer Civil", subtopics: ["Building Materials, Concrete Technology, Surveying, Structural Analysis, Fluid Mechanics"] },
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2023, exam: "ZP Bharti Online CBT (IBPS)", label: "ZP Bharti 2023 Shift Papers & Answer Key", paperUrl: "https://rdd.maharashtra.gov.in/en/recruitment", answerKeyUrl: "https://rdd.maharashtra.gov.in/en/recruitment", url: "https://rdd.maharashtra.gov.in" },
      { year: 2020, exam: "ZP Mega Bharti Screening", label: "ZP Bharti 2020 Question Paper & Key", paperUrl: "https://rdd.maharashtra.gov.in/en/recruitment", answerKeyUrl: "https://rdd.maharashtra.gov.in/en/recruitment", url: "https://rdd.maharashtra.gov.in" },
      { year: 2019, exam: "Mahapariksha ZP Exam", label: "ZP Bharti 2019 Question Paper & Key", paperUrl: "https://rdd.maharashtra.gov.in/en/recruitment", answerKeyUrl: "https://rdd.maharashtra.gov.in/en/recruitment", url: "https://rdd.maharashtra.gov.in" },
      { year: 2016, exam: "District ZP Offline Test", label: "ZP Bharti 2016 Question Paper & Key", paperUrl: "https://rdd.maharashtra.gov.in/en/recruitment", answerKeyUrl: "https://rdd.maharashtra.gov.in/en/recruitment", url: "https://rdd.maharashtra.gov.in" },
      { year: 2015, exam: "District ZP Offline Test", label: "ZP Bharti 2015 Question Paper & Key", paperUrl: "https://rdd.maharashtra.gov.in/en/recruitment", answerKeyUrl: "https://rdd.maharashtra.gov.in/en/recruitment", url: "https://rdd.maharashtra.gov.in" },
    ],
    books: [
      { title: "जिल्हा परिषद भरती संपूर्ण मार्गदर्शक (IBPS Pattern) — के'सागर / स्मार्ट स्टडी", useFor: "Complete non-technical 120 marks" },
      { title: "कृषी घटक मार्गदर्शक (ग्रामसेवक विशेष) — डॉ. आनंद शेटे", useFor: "Technical Agriculture for Gramsevak" },
      { title: "आरोग्य सेवक तांत्रिक ज्ञान — सचिन भस्के", useFor: "Technical Health Science 80 marks" },
    ],
    youtubeQuery: "Maharashtra zilla parishad ZP bharti IBPS pattern syllabus questions",
    relatedExams: ["maharashtra-talathi", "maharashtra-police", "mpsc-combined"],
  },

  // ────────────────────────────────────────────────────────────
  // 7. Maharashtra Forest Guard (Vanrakshak)
  // ────────────────────────────────────────────────────────────
  {
    slug: "maharashtra-forest",
    name: "महाराष्ट्र वनरक्षक भरती (Forest Guard)",
    nameEn: "Maharashtra Vanrakshak (Forest Guard Bharti)",
    shortName: "MH Forest Guard",
    conductingBody: "Maharashtra Forest Department (Mahaforest)",
    logo: "forest",
    color: "#15803D",
    examLevel: "State",
    targetPosts: ["Vanrakshak (वनरक्षक - Forest Guard)", "Surveyor", "Accountant"],
    totalVacancies: "2,417+ (Statewide Forest Circles)",
    applicationFee: { general: "₹1000", reserved: "₹900" },
    ageLimit: { min: 18, max: 27, scStRelax: 5, obcRelax: 3 },
    eligibility: "12th Standard Passed (HSC) with at least one subject among Science, Maths, Geography, or Economics.",
    stages: ["Online CBT (120 Marks / TCS Pattern)", "Physical Walking Test (80 Marks - 5 km / 3 km)", "Document Verification"],
    officialWebsite: "https://mahaforest.gov.in/recruitment.php",
    notificationUrl: "https://mahaforest.gov.in/recruitment.php",
    papers: [
      {
        stage: "Online CBT Examination (120 Marks)",
        papers: [
          {
            name: "Written Test (TCS Pattern)",
            marks: 120,
            questions: 60,
            duration: "2 hours",
            type: "CBT MCQ (2 marks per question)",
            topics: [
              { name: "Marathi Grammar (15 Qs / 30 Marks)", subtopics: ["मराठी व्याकरण, शब्दसंग्रह, प्रयोग, समास, म्हणी व वाक्प्रचार"] },
              { name: "English Grammar (15 Qs / 30 Marks)", subtopics: ["Tenses, Prepositions, Spotting errors, Synonyms & Antonyms"] },
              { name: "General Knowledge & Forest Ecology (15 Qs / 30 Marks)", subtopics: ["पर्यावरण व जैवविविधता, वने व वन्यजीव संरक्षण कायदा १९७२, राष्ट्रीय उद्याने व अभयारण्ये, महाराष्ट्राचे भूगोल"] },
              { name: "Reasoning & Mental Ability (15 Qs / 30 Marks)", subtopics: ["संख्या मालिका, दिशा व अंतर, घड्याळ, तर्कसंगत विचार, नातेसंबंध"] },
            ]
          }
        ]
      },
      {
        stage: "Physical Efficiency Test (80 Marks)",
        papers: [
          {
            name: "Running / Walking Endurance Test",
            marks: 80,
            duration: "Timed Ground Event",
            type: "Physical Endurance",
            topics: [
              { name: "Male Candidates (5 km Run)", subtopics: ["Under 17 min: 80 Marks | 17-18 min: 70 Marks | 18-19 min: 60 Marks | Staggered down to 30 min"] },
              { name: "Female Candidates (3 km Run)", subtopics: ["Under 12 min: 80 Marks | 12-13 min: 70 Marks | 13-14 min: 60 Marks | Staggered down to 25 min"] },
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2023, exam: "Vanrakshak CBT (TCS Shifts)", label: "Maharashtra Forest Guard 2023 Papers & Answer Key", paperUrl: "https://mahaforest.gov.in/recruitment.php", answerKeyUrl: "https://mahaforest.gov.in/recruitment.php", url: "https://mahaforest.gov.in" },
      { year: 2022, exam: "Forest Circles Written Test", label: "Maharashtra Forest Guard 2022 Paper & Key", paperUrl: "https://mahaforest.gov.in/recruitment.php", answerKeyUrl: "https://mahaforest.gov.in/recruitment.php", url: "https://mahaforest.gov.in" },
      { year: 2019, exam: "Mahaforest Online Exam", label: "Maharashtra Forest Guard 2019 Paper & Key", paperUrl: "https://mahaforest.gov.in/recruitment.php", answerKeyUrl: "https://mahaforest.gov.in/recruitment.php", url: "https://mahaforest.gov.in" },
      { year: 2016, exam: "Forest Department Written Test", label: "Maharashtra Forest Guard 2016 Paper & Key", paperUrl: "https://mahaforest.gov.in/recruitment.php", answerKeyUrl: "https://mahaforest.gov.in/recruitment.php", url: "https://mahaforest.gov.in" },
      { year: 2014, exam: "Offline Circle Recruitment", label: "Maharashtra Forest Guard 2014 Paper & Key", paperUrl: "https://mahaforest.gov.in/recruitment.php", answerKeyUrl: "https://mahaforest.gov.in/recruitment.php", url: "https://mahaforest.gov.in" },
    ],
    books: [
      { title: "वनरक्षक भरती संपूर्ण मार्गदर्शक (पर्यावरण व वने विशेष) — नोबल पब्लिकेशन", useFor: "Complete 120 marks written preparation" },
      { title: "पर्यावरण व जैवविविधता — तुषार घोरपडे", useFor: "Forest, Wildlife Acts & National Parks" },
    ],
    youtubeQuery: "Maharashtra vanrakshak forest guard bharti syllabus physical test",
    relatedExams: ["maharashtra-police", "maharashtra-talathi", "mpsc-vanseva"],
  },

  // ────────────────────────────────────────────────────────────
  // 8. MPSC Maharashtra Forest Services (Vanseva)
  // ────────────────────────────────────────────────────────────
  {
    slug: "mpsc-vanseva",
    name: "MPSC महाराष्ट्र वनसेवा परीक्षा (Forest Services)",
    nameEn: "MPSC Maharashtra Forest Services (ACF / RFO)",
    shortName: "MPSC Vanseva",
    conductingBody: "Maharashtra Public Service Commission (MPSC)",
    logo: "nature_people",
    color: "#047857",
    examLevel: "State",
    targetPosts: ["Assistant Conservator of Forests (ACF - Group A)", "Range Forest Officer (RFO - Group B)"],
    totalVacancies: "~120 (Periodic Cadre)",
    applicationFee: { general: "₹524", reserved: "₹324" },
    ageLimit: { min: 19, max: 38, scStRelax: 5, obcRelax: 3 },
    eligibility: "Bachelor's Degree in Science (Botany, Chemistry, Forestry, Geology, Mathematics, Physics, Statistics, Zoology) or Engineering or Agriculture.",
    stages: ["Gazetted Prelims", "Vanseva Mains (400M)", "Walking Test (25km/16km)", "Interview (50M)"],
    officialWebsite: "https://mpsc.gov.in",
    notificationUrl: "https://mpsconline.gov.in/candidate",
    papers: [
      {
        stage: "Mains Examination (400 Marks)",
        papers: [
          {
            name: "Paper 1: General Studies & Forestry",
            marks: 200,
            questions: 100,
            duration: "2 hours",
            type: "MCQ",
            topics: [
              { name: "Forestry & Environment", subtopics: ["Silviculture, Forest Management, Mensuration, Wildlife Ecology, Agroforestry, Forest Protection"] },
              { name: "Botany & Zoology basics", subtopics: ["Plant taxonomy, economic botany, Indian fauna, Western Ghats ecology"] },
            ]
          },
          {
            name: "Paper 2: General Science & Agriculture",
            marks: 200,
            questions: 100,
            duration: "2 hours",
            type: "MCQ",
            topics: [
              { name: "General Science & Maths", subtopics: ["Physics, Chemistry, Engineering Mechanics, Calculus & Vector analysis"] },
              { name: "Agriculture & Soil Science", subtopics: ["Soil fertility, watershed management, soil erosion and conservation in Maharashtra"] },
            ]
          }
        ]
      }
    ],
    officialPdfs: [
      {
        id: "mpsc-vanseva-2024-p1-qp",
        year: 2024,
        label: "2024 वनसेवा मुख्य वनशास्त्र पेपर",
        title: "महाराष्ट्र वनसेवा मुख्य परीक्षा २०२४ — वनशास्त्र (Forestry) अधिकृत प्रश्नपत्रिका",
        size: "1.92 MB",
        url: "/downloads/mpsc/question_papers/2026/13489_FORESTRY.pdf",
        badge: "2024 MAINS",
        isAnswerKey: false
      },
      {
        id: "mpsc-vanseva-2024-p2-qp",
        year: 2024,
        label: "2024 वनसेवा कृषी (Agriculture) पेपर",
        title: "महाराष्ट्र वनसेवा मुख्य परीक्षा २०२४ — कृषी शास्त्र (Agriculture) अधिकृत प्रश्नपत्रिका",
        size: "2.05 MB",
        url: "/downloads/mpsc/question_papers/2026/13497_AGRICULTURE.pdf",
        badge: "2024 MAINS",
        isAnswerKey: false
      },
      {
        id: "mpsc-vanseva-2023-pre-qp",
        year: 2023,
        label: "2023 वनसेवा पूर्व परीक्षा पेपर",
        title: "महाराष्ट्र नागरी सेवा राजपत्रित संयुक्त पूर्व परीक्षा २०२३ — वनसेवा घटक पेपर १",
        size: "1.80 MB",
        url: "/downloads/mpsc/question_papers/2025/12078_012-2025 PRE 2025 P1.pdf",
        badge: "PRELIMS",
        isAnswerKey: false,
        pairId: "mpsc-vanseva-2023-pre-ak"
      },
      {
        id: "mpsc-vanseva-2023-pre-ak",
        year: 2023,
        label: "2023 वनसेवा पूर्व उत्तरतालिका",
        title: "महाराष्ट्र नागरी सेवा राजपत्रित संयुक्त पूर्व परीक्षा २०२३ — पेपर १ प्रथम उत्तरतालिका",
        size: "410 KB",
        url: "/downloads/mpsc/answer_keys/2025/12098_Maharashtra Civil Services Gazetted Combined Pre Exam 2025 Paper I First Anwer key Advt 012-2025.pdf",
        badge: "FINAL KEY",
        isAnswerKey: true,
        pairId: "mpsc-vanseva-2023-pre-qp"
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "Vanseva Mains Paper I & II", label: "MPSC Vanseva 2024 Mains Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2023, exam: "Vanseva Mains Paper I & II", label: "MPSC Vanseva 2023 Mains Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2022, exam: "Vanseva Mains Paper I & II", label: "MPSC Vanseva 2022 Mains Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2021, exam: "Vanseva Mains Paper I & II", label: "MPSC Vanseva 2021 Mains Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
      { year: 2019, exam: "Vanseva Mains Paper I & II", label: "MPSC Vanseva 2019 Mains Paper & Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
    ],
    books: [
      { title: "Forestry at a Glance — K.T. Parthiban", useFor: "Silviculture, Agroforestry & Forest Mensuration" },
      { title: "Indian Forestry — S. Prabhu", useFor: "Paper 1 Forestry and Forest Protection Acts" },
    ],
    youtubeQuery: "MPSC forest service vanseva syllabus preparation strategy",
    relatedExams: ["mpsc-state-services", "maharashtra-forest", "upsc-cse"],
  },

  // ────────────────────────────────────────────────────────────
  // 9. MPSC Group C Combined (लिपिक-टंकलेखक / कर सहाय्यक / दुय्यम निरीक्षक)
  // ────────────────────────────────────────────────────────────
  {
    slug: "mpsc-group-c",
    name: "MPSC गट-क सेवा संयुक्त परीक्षा (Group C)",
    nameEn: "MPSC Group C Services Combined Exam (Clerk / Tax Asst / Excise SI)",
    shortName: "MPSC Group C",
    conductingBody: "Maharashtra Public Service Commission (MPSC)",
    logo: "badge",
    color: "#0284C7",
    examLevel: "State",
    targetPosts: [
      "लिपिक-टंकलेखक (Clerk-Typist)",
      "कर सहाय्यक (Tax Assistant)",
      "दुय्यम निरीक्षक (Sub-Inspector State Excise)",
      "तांत्रिक सहाय्यक (Technical Assistant)",
      "उद्योग निरीक्षक (Industry Inspector)"
    ],
    totalVacancies: "7,500+ (Annual Group C Vacancies)",
    applicationFee: { general: "₹394", reserved: "₹294" },
    ageLimit: { min: 19, max: 38, scStRelax: 5, obcRelax: 3, maxReserved: 43 },
    eligibility: "मान्यताप्राप्त विद्यापीठाची पदवी (Any Graduate). लिपिक-टंकलेखक पदासाठी मराठी टंकलेखन ३० श.प्र.मि. किंवा इंग्रजी ४० श.प्र.मि. GCC-TBC प्रमाणपत्र आवश्यक.",
    stages: [
      "संयुक्त पूर्व परीक्षा (Prelims - 100 प्रश्न / 100 गुण)",
      "मुख्य परीक्षा (Mains - 200 गुण / 2 पेपर्स)",
      "टंकलेखन कौशल्य चाचणी (Typing Skill Test - Qualifying)"
    ],
    officialWebsite: "https://mpsc.gov.in",
    notificationUrl: "https://mpsconline.gov.in/candidate",
    papers: [
      {
        stage: "संयुक्त पूर्व परीक्षा (Prelims — 100 प्रश्न / 100 गुण / 1 तास / 1/4 नकारात्मक गुण)",
        papers: [
          {
            name: "सामान्य क्षमता चाचणी (General Ability Test)",
            marks: 100,
            questions: 100,
            duration: "1 तास (60 मिनिटे)",
            type: "MCQ (1 गुण प्रति प्रश्न, -0.25 नकारात्मक गुण)",
            topics: [
              {
                name: "इतिहास (महाराष्ट्राचा विशेष संदर्भ)",
                subtopics: [
                  "१८५७ चा उठाव व महाराष्ट्रातील पडसाद (सातारा, कोल्हापूर, पेठ, जमखंडी)",
                  "महाराष्ट्रातील समाजसुधारक (महात्मा फुले, डॉ. बाबासाहेब आंबेडकर, शाहू महाराज, विठ्ठल रामजी शिंदे, धोंडो केशव कर्वे)",
                  "भारतीय राष्ट्रीय चळवळ व वृत्तपत्रांची भूमिका (दर्पण, प्रभाकर, केसरी, मराठा, सुधारक)",
                  "महाराष्ट्रातील सामाजिक व धार्मिक सुधारणा चळवळी (सत्यशोधक समाज, प्रार्थना समाज)"
                ]
              },
              {
                name: "भूगोल (महाराष्ट्र व भारत)",
                subtopics: [
                  "महाराष्ट्राची प्राकृतिक रचना (कोकण किनारपट्टी, सह्याद्री पर्वत, दख्खनचे पठार)",
                  "महाराष्ट्राची नदीप्रणाली (गोदावरी, भीमा, कृष्णा, तापी व कोकणातील नद्या)",
                  "हवामान व पर्जन्यमान (मान्सून, आवर्त व अवर्षण प्रवण क्षेत्रे)",
                  "मृदा व प्रमुख पिके (काळी कापसाची मृदा, जांभी मृदा, ज्वारी, कापूस, ऊस)",
                  "खनिज संपत्ती व प्रमुख उद्योग (बॉक्साईट, लोहखनिज, मँगेनीज, वस्त्रोद्योग, साखर कारखाने)"
                ]
              },
              {
                name: "भारतीय राज्यघटना व स्थानिक स्वराज्य संस्था",
                subtopics: [
                  "राज्यघटनेची निर्मिती, प्रस्तावना व ठळक वैशिष्ट्ये",
                  "मूलभूत हक्क (Articles 12-35), मूलभूत कर्तव्ये व मार्गदर्शक तत्त्वे",
                  "महाराष्ट्र राज्य शासन रचना (राज्यपाल, मुख्यमंत्री, मंत्रिमंडळ, विधानसभा व विधानपरिषद)",
                  "पंचायत राज व स्थानिक स्वराज्य संस्था (७३ वी व ७४ वी घटनादुरुस्ती, ग्रामपंचायत, पंचायत समिती, जिल्हा परिषद, नगरपालिका, महापालिका)"
                ]
              },
              {
                name: "भारतीय अर्थव्यवस्था",
                subtopics: [
                  "राष्ट्रीय उत्पन्न व आर्थिक विकास संकल्पना",
                  "शेती, ग्रामीण विकास व शासकीय अनुदाने",
                  "बँकिंग प्रणाली, रिझर्व्ह बँक (RBI) व चलनविषयक धोरण",
                  "दारिद्र्य, बेरोजगारी व शासकीय कल्याणकारी योजना",
                  "राजकोषीय धोरण, कर रचना व जीएसटी (GST)"
                ]
              },
              {
                name: "सामान्य विज्ञान (General Science)",
                subtopics: [
                  "भौतिकशास्त्र (Physics: गती, बल, प्रकाश, ध्वनी, ऊर्जा, विद्युत)",
                  "रसायनशास्त्र (Chemistry: मूलद्रव्ये, आम्ल-आम्लारी, धातू-अधातू, दैनंदिन रसायनशास्त्र)",
                  "वनस्पतीशास्त्र व प्राणीशास्त्र (Botany & Zoology: वर्गीकरण, पोषण, श्वसन, उत्सर्जन)",
                  "आरोग्यशास्त्र व रोग (मानवी पोषण, जीवनसत्त्वे, संसर्गजन्य व असंसर्गजन्य आजार)"
                ]
              },
              {
                name: "चालू घडामोडी (Current Affairs)",
                subtopics: [
                  "महाराष्ट्र व राष्ट्रीय पातळीवरील महत्त्वाच्या राजकीय व प्रशासकीय घडामोडी",
                  "शासकीय योजना, पुरस्कार व सन्मान (पद्म पुरस्कार, भारतरत्न, साहित्य अकादमी)",
                  "क्रीडा स्पर्धा (ऑलिम्पिक, आशियाई क्रीडा, क्रिकेट विश्वचषक, राष्ट्रीय खेळ)",
                  "विज्ञान, तंत्रज्ञान, पर्यावरण व संरक्षण घडामोडी"
                ]
              },
              {
                name: "अंकगणित व बुद्धिमत्ता चाचणी (CSAT)",
                subtopics: [
                  "अंकगणित: संख्या पद्धती, लसावि-मसावि, सरासरी, गुणोत्तर-प्रमाण, शेकडेवारी, नफा-तोटा, काम-काळ-वेग, सरळव्याज-चक्रवाढव्याज",
                  "बुद्धिमत्ता: संख्या व अक्षर मालिका, नातेसंबंध, सांकेतिक भाषा (Coding-Decoding), दिशा व अंतर, घड्याळ व दिनदर्शिका, वेन आकृत्या, तर्कसंगत निष्कर्ष"
                ]
              }
            ]
          }
        ]
      },
      {
        stage: "मुख्य परीक्षा (Mains — 200 गुण / 2 पेपर्स / नकारात्मक गुण १/४)",
        papers: [
          {
            name: "पेपर १: भाषा पेपर (मराठी व इंग्रजी — 100 प्रश्न / 100 गुण / 1 तास)",
            marks: 100,
            questions: 100,
            duration: "1 तास",
            type: "MCQ",
            topics: [
              {
                name: "मराठी व्याकरण व शब्दसंग्रह (50 प्रश्न / 50 गुण)",
                subtopics: [
                  "वर्णविचार, स्वर व व्यंजनांचे प्रकार, उच्चारस्थाने",
                  "संधी व संधीचे प्रकार (स्वर, व्यंजन, विसर्ग संधी)",
                  "शब्दांच्या जाती (नाम, सर्वनाम, विशेषण, क्रियापद व अव्यये)",
                  "काळ व काळांचे प्रकार, क्रियापदांचे अर्थ",
                  "प्रयोग (कर्तरी, कर्मणी, भावे प्रयोग व त्यांचे उपप्रकार)",
                  "समास (अव्ययीभाव, तत्पुरुष, द्वंद्व, बहुव्रीहि)",
                  "शब्दसिद्धी (तत्सम, तद्भव, देशी व परभाषीय शब्द)",
                  "वाक्प्रचार, म्हणी व त्यांचे अर्थ, समानार्थी व विरुद्धार्थी शब्द",
                  "उतारा आकलन (Comprehension Passage)"
                ]
              },
              {
                name: "इंग्रजी व्याकरण व भाषा (English Language — 50 प्रश्न / 50 गुण)",
                subtopics: [
                  "Parts of Speech & Sentence Structure",
                  "Tenses, Subject-Verb Agreement, Sequence of Tenses",
                  "Active & Passive Voice, Direct & Indirect Speech",
                  "Punctuation, Articles & Prepositions",
                  "Vocabulary: Synonyms, Antonyms, One-word Substitutions",
                  "Idioms, Phrases & Common Grammatical Errors",
                  "Reading Comprehension Passage"
                ]
              }
            ]
          },
          {
            name: "पेपर २: सामान्य अध्ययन व बुद्धिमत्ता चाचणी (100 प्रश्न / 100 गुण / 1 तास)",
            marks: 100,
            questions: 100,
            duration: "1 तास",
            type: "MCQ",
            topics: [
              {
                name: "माहितीचा अधिकार व लोकसेवा हक्क",
                subtopics: [
                  "माहितीचा अधिकार अधिनियम २००५ (RTI Act 2005): उद्दिष्टे, माहिती मागवण्याची पद्धत, अपीलीय अधिकारी",
                  "महाराष्ट्र लोकसेवा हक्क अधिनियम २०१५ (RTS Act 2015): नागरिकांचे हक्क, वेळेत सेवा, दंडात्मक तरतुदी"
                ]
              },
              {
                name: "संगणक व माहिती तंत्रज्ञान (Computer & IT)",
                subtopics: [
                  "संगणकाची मूलभूत रचना, हार्डवेअर व सॉफ्टवेअर",
                  "इंटरनेट, ईमेल, सोशल मीडिया व शासकीय ई-गव्हर्नन्स पोर्टल्स",
                  "माहिती तंत्रज्ञान कायदा २००० (IT Act 2000) व सायबर सुरक्षितता"
                ]
              },
              {
                name: "पदविशिष्ट ज्ञान व कर्तव्ये (Post Specific Topics)",
                subtopics: [
                  "लिपिक-टंकलेखक: कार्यालयीन कार्यपद्धती, नोंदवह्या, शासकीय पत्रव्यवहार स्वरूप",
                  "कर सहाय्यक: Book Keeping & Accountancy, GST मूलभूत संकल्पना, प्रत्यक्ष व अप्रत्यक्ष कर",
                  "दुय्यम निरीक्षक राज्य उत्पादन शुल्क: महाराष्ट्र दारूबंदी कायदा १९४९ व उत्पादन शुल्क नियमावली"
                ]
              }
            ]
          }
        ]
      }
    ],
    officialPdfs: [
      {
        id: 14404,
        year: 2026,
        label: "2026 बेलीफ व लिपिक गट-क पेपर १",
        title: "Advt. No. 015/2026 Bailiff cum Clerk Group-C Competitive Exam 2026 — Paper No. 1 Question Paper",
        size: "752.62 KB",
        url: "/api/mpsc-pdf/14404",
        badge: "LATEST 2026",
        isAnswerKey: false
      },
      {
        id: 14403,
        year: 2026,
        label: "2026 बेलीफ व लिपिक गट-क पेपर २",
        title: "Advt. No. 015/2026 Bailiff cum Clerk Group-C Competitive Exam 2026 — Paper No. 2 Question Paper",
        size: "1.42 MB",
        url: "/api/mpsc-pdf/14403",
        badge: "LATEST 2026",
        isAnswerKey: false
      },
      {
        id: 10893,
        year: 2024,
        label: "2024 गट-क संयुक्त पूर्व परीक्षा प्रश्नपत्रिका",
        title: "MPSC Group C Services Combined Preliminary Exam 2024 — Official Question Paper",
        size: "1.24 MB",
        url: "/api/mpsc-pdf/10893",
        badge: "2024 PRELIMS",
        isAnswerKey: false
      },
      {
        id: 11232,
        year: 2024,
        label: "2024 गट-क संयुक्त पूर्व परीक्षा उत्तरतालिका",
        title: "MPSC Group C Services Combined Preliminary Exam 2024 — Official Final Answer Key",
        size: "452 KB",
        url: "/api/mpsc-pdf/11232",
        badge: "FINAL KEY",
        isAnswerKey: true
      }
    ],
    officialPdfs: [],
    // Commented out until spider crawls verified official PDFs
    // pyqLinks: [
    //   { year: 2026, exam: "Bailiff & Clerk Group C", label: "2026 Bailiff & Clerk Paper 1 & 2 Question Papers", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
    //   { year: 2024, exam: "Group C Combined Prelims", label: "MPSC Group C 2024 Pre Paper & Final Answer Key", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" },
    //   { year: 2023, exam: "Group C Combined Prelims & Mains", label: "MPSC Group C 2023 Question Papers & Keys", paperUrl: "https://mpsc.gov.in/prev_que_papers/9", answerKeyUrl: "https://mpsc.gov.in/final_answer_keys/10", url: "https://mpsc.gov.in/prev_que_papers/9" }
    // ],
    pyqLinks: [],
    books: [
      { title: "सुगम मराठी व्याकरण व लेखन — मो. रा. वाळंबे", useFor: "Paper 1 Marathi 50 Marks (Grammar, Vocabulary & Comprehension)" },
      { title: "संपूर्ण इंग्रजी व्याकरण — बाळासाहेब शिंदे", useFor: "Paper 1 English 50 Marks (Grammar, Idioms & Error Spotting)" },
      { title: "तात्यांचा ठोकळा (महाराष्ट्र सामान्य ज्ञान) — एकनाथ पाटील", useFor: "Prelims GS (History, Geography, Polity, Science)" },
      { title: "अंकगणित व बुद्धिमत्ता चाचणी — सचिन ढवळे / पंढरीनाथ राणे", useFor: "CSAT 15-20 Questions Speed Drills" }
    ],
    youtubeQuery: "MPSC group c clerk typist tax assistant prelims mains syllabus preparation",
    relatedExams: ["mpsc-combined", "mpsc-state-services", "maharashtra-talathi"]
  },

  // ────────────────────────────────────────────────────────────
  // 10. Maharashtra Nagar Parishad (DMA — नगर परिषद भरती)
  // ────────────────────────────────────────────────────────────
  {
    slug: "maharashtra-nagar-parishad",
    name: "महाराष्ट्र नगर परिषद भरती (DMA — Municipal Council)",
    nameEn: "Maharashtra Nagar Parishad Bharti (Municipal Council Services — DMA)",
    shortName: "MH Nagar Parishad",
    conductingBody: "Directorate of Municipal Administration (DMA) / नगर विकास विभाग (TCS Pattern)",
    logo: "location_city",
    color: "#7C3AED",
    examLevel: "State",
    targetPosts: [
      "मुख्याधिकारी गट-क (Chief Officer Group C)",
      "लेखापाल व लेखापरीक्षक (Accountant & Auditor)",
      "स्थापत्य अभियंता (Civil Engineer)",
      "विद्युत व संगणक अभियंता (Electrical & Computer Engineer)",
      "कर व प्रशासकीय अधिकारी (Tax & Admin Officer)",
      "स्वच्छता निरीक्षक (Sanitation Inspector)"
    ],
    totalVacancies: "1,782+ (State Cadre Cycles)",
    applicationFee: { general: "₹1000", reserved: "₹900" },
    ageLimit: { min: 21, max: 38, scStRelax: 5, obcRelax: 3 },
    eligibility: "पदवीधर (Chief Officer / Tax Officer); B.Com पदवी (Accountant); संबंधित शाखेतील B.E. / B.Tech किंवा पदविका (Engineers).",
    stages: [
      "ऑनलाइन CBT परीक्षा (TCS Pattern — 200 गुण / 2 पेपर्स)",
      "कागदपत्र पडताळणी (Document Verification)"
    ],
    officialWebsite: "https://mahadma.maharashtra.gov.in",
    notificationUrl: "https://mahadma.maharashtra.gov.in",
    papers: [
      {
        stage: "ऑनलाइन CBT परीक्षा (TCS Pattern — 200 गुण / 100 प्रश्न / 120 मिनिटे)",
        papers: [
          {
            name: "पेपर १: सामान्य विषय घटक (100 गुण / 60 प्रश्न / 70 मिनिटे)",
            marks: 100,
            questions: 60,
            duration: "70 मिनिटे",
            type: "CBT MCQ",
            topics: [
              { name: "मराठी भाषा (15 प्रश्न / 25 गुण)", subtopics: ["मराठी व्याकरण, शब्दसंग्रह, प्रयोग, समास, समानार्थी/विरुद्धार्थी शब्द, उतारा आकलन"] },
              { name: "इंग्रजी भाषा (15 प्रश्न / 25 गुण)", subtopics: ["English Grammar, Vocabulary, Tenses, Error Correction, Comprehension"] },
              { name: "सामान्य ज्ञान (15 प्रश्न / 25 गुण)", subtopics: ["महाराष्ट्राचा इतिहास व भूगोल, भारतीय राज्यघटना, ७४ वी नागरी घटनादुरुस्ती, चालू घडामोडी"] },
              { name: "बौद्धिक चाचणी (15 प्रश्न / 25 गुण)", subtopics: ["तर्कसंगत विचार, मालिका, कोडी, दिशा व अंतर, अंकगणितीय क्षमता"] }
            ]
          },
          {
            name: "पेपर २: पदनिहाय तांत्रिक व विशेष विषय (100 गुण / 40 प्रश्न / 50 मिनिटे)",
            marks: 100,
            questions: 40,
            duration: "50 मिनिटे",
            type: "CBT MCQ (Core Technical)",
            topics: [
              { name: "लेखापाल व लेखापरीक्षक (Accountancy & Audit)", subtopics: ["Financial Accounting, Cost Accounting, Auditing Principles, Income Tax & GST, Companies Act"] },
              { name: "स्थापत्य अभियांत्रिकी (Civil Engineering)", subtopics: ["Building Construction, Concrete Technology, Surveying, Environmental & Waste Management, Municipal Water Supply"] },
              { name: "कर व प्रशासकीय सेवा (Tax & Municipal Admin)", subtopics: ["महाराष्ट्र नगरपरिषदा, नगरपंचायती व औद्योगिक नगरी अधिनियम १९६५, मालमत्ता कर आकारणी, नागरी स्थानिक स्वराज्य संस्था प्रशासन"] }
            ]
          }
        ]
      }
    ],
    officialPdfs: [],
    // Commented out until spider crawls verified official PDFs
    // pyqLinks: [
    //   { year: 2023, exam: "Nagar Parishad CBT Exam (TCS)", label: "Nagar Parishad 2023 Shiftwise Papers & Final Answer Keys", paperUrl: "https://mahadma.maharashtra.gov.in", answerKeyUrl: "https://mahadma.maharashtra.gov.in", url: "https://mahadma.maharashtra.gov.in" }
    // ],
    pyqLinks: [],
    books: [
      { title: "नगर परिषद भरती संपूर्ण मार्गदर्शक (TCS पॅटर्न) — विद्याभारती पब्लिकेशन", useFor: "Paper 1 General + Municipal Act special guide" },
      { title: "महाराष्ट्र नगरपरिषदा अधिनियम १९६५ — अधिकृत शासकीय प्रत", useFor: "Municipal acts and taxation questions" },
      { title: "सुगम मराठी व्याकरण — मो. रा. वाळंबे", useFor: "Marathi Grammar 25 marks" }
    ],
    youtubeQuery: "Maharashtra nagar parishad bharti TCS pattern syllabus preparation",
    relatedExams: ["mpsc-group-c", "maharashtra-talathi", "maharashtra-zp"]
  },

  // ────────────────────────────────────────────────────────────
  // 11. Maharashtra Arogya Vibhag (सार्वजनिक आरोग्य विभाग गट-क व गट-ड)
  // ────────────────────────────────────────────────────────────
  {
    slug: "maharashtra-arogya-vibhag",
    name: "सार्वजनिक आरोग्य विभाग भरती (Arogya Vibhag Group C & D)",
    nameEn: "Maharashtra Public Health Department Recruitment (Arogya Vibhag Group C & D)",
    shortName: "MH Arogya Vibhag",
    conductingBody: "Commissionerate of Health Services / DMER Maharashtra (TCS Pattern)",
    logo: "local_hospital",
    color: "#059669",
    examLevel: "State",
    targetPosts: [
      "अधिपरिचारिका (Staff Nurse)",
      "औषध निर्माण अधिकारी (Pharmacist)",
      "प्रयोगशाळा वैज्ञानिक अधिकारी (Lab Technician)",
      "नेत्र चिकित्सा अधिकारी (Ophthalmic Officer)",
      "कनिष्ठ लिपिक (Junior Clerk)",
      "कक्ष सेवक / शिपाई (Group D Peon/Attendant)"
    ],
    totalVacancies: "10,949+ (Across 36 Maharashtra Districts)",
    applicationFee: { general: "₹1000", reserved: "₹900" },
    ageLimit: { min: 18, max: 38, scStRelax: 5, obcRelax: 3 },
    eligibility: "GNM किंवा B.Sc Nursing (Staff Nurse); D.Pharm किंवा B.Pharm (Pharmacist); B.Sc DMLT (Lab Tech); १० वी/१२ वी (गट-ड).",
    stages: [
      "ऑनलाइन संगणक परीक्षा (TCS CBT — 100 प्रश्न / 200 गुण / 120 मिनिटे)",
      "गुणवत्ता यादी व कागदपत्र पडताळणी"
    ],
    officialWebsite: "https://arogya.maharashtra.gov.in",
    notificationUrl: "https://arogya.maharashtra.gov.in",
    papers: [
      {
        stage: "ऑनलाइन संगणक परीक्षा (CBT — 100 प्रश्न / 200 गुण / 2 गुण प्रति प्रश्न / नकारात्मक गुण नाहीत)",
        papers: [
          {
            name: "आरोग्य विभाग संयुक्त परीक्षा (Composite CBT Paper)",
            marks: 200,
            questions: 100,
            duration: "2 तास (120 मिनिटे)",
            type: "CBT MCQ",
            topics: [
              { name: "मराठी व्याकरण (15 प्रश्न / 30 गुण)", subtopics: ["शब्दांच्या जाती, लिंग, वचन, विभक्ती, समास, प्रयोग, समानार्थी व विरुद्धार्थी शब्द, म्हणी व वाक्प्रचार"] },
              { name: "इंग्रजी भाषा (15 प्रश्न / 30 गुण)", subtopics: ["Tenses, Prepositions, Conjunctions, Active/Passive Voice, Vocabulary, Error Detection"] },
              { name: "सामान्य ज्ञान (15 प्रश्न / 30 गुण)", subtopics: ["महाराष्ट्राचा भूगोल, इतिहास, आरोग्य क्षेत्रातील शासकीय योजना (आयुष्मान भारत, महात्मा फुले जन आरोग्य योजना), राष्ट्रीय आरोग्य अभियान (NHM)"] },
              { name: "बौद्धिक चाचणी (15 प्रश्न / 30 गुण)", subtopics: ["संख्या मालिका, सांकेतिक भाषा, नातेसंबंध, तर्कसंगत विचार, वेन आकृती"] },
              { name: "तांत्रिक व पदनिहाय विषय (40 प्रश्न / 80 गुण)", subtopics: [
                "Staff Nurse: Anatomy & Physiology, Fundamentals of Nursing, Pharmacology, Community Health, Midwifery & Obstetrical Nursing",
                "Pharmacist: Pharmaceutics, Pharmacology, Pharmacognosy, Pharmaceutical Jurisprudence, Hospital Pharmacy",
                "Lab Technician: Clinical Biochemistry, Microbiology, Hematology, Pathology & Blood Banking"
              ]}
            ]
          }
        ]
      }
    ],
    officialPdfs: [],
    // Commented out until spider crawls verified official PDFs
    // pyqLinks: [
    //   { year: 2023, exam: "Arogya Vibhag Group C & D (TCS)", label: "Arogya Vibhag 2023 CBT Shiftwise Question Papers & Answer Keys", paperUrl: "https://arogya.maharashtra.gov.in", answerKeyUrl: "https://arogya.maharashtra.gov.in", url: "https://arogya.maharashtra.gov.in" }
    // ],
    pyqLinks: [],
    books: [
      { title: "आरोग्य विभाग भरती तांत्रिक प्रश्नसंच (Staff Nurse / Pharmacist) — टार्गेट पब्लिकेशन", useFor: "Technical section 80 marks preparation" },
      { title: "तात्यांचा ठोकळा (आरोग्य विशेष आवृत्ती)", useFor: "General Knowledge & Health Schemes" },
      { title: "सुगम मराठी व्याकरण — मो. रा. वाळंबे", useFor: "Marathi Grammar 30 marks" }
    ],
    youtubeQuery: "Maharashtra arogya vibhag bharti syllabus staff nurse pharmacist preparation",
    relatedExams: ["maharashtra-zp", "maharashtra-police", "mpsc-group-c"]
  },

  // ────────────────────────────────────────────────────────────
  // 12. MahaVitaran / MahaTransco AE & JE (महावितरण व महापारेषण)
  // ────────────────────────────────────────────────────────────
  {
    slug: "mahadiscom-ae-je",
    name: "महावितरण / महापारेषण भरती (MahaVitaran & MahaTransco AE & JE)",
    nameEn: "Maharashtra State Electricity Distribution & Transmission (MSEDCL / MSETCL AE & JE)",
    shortName: "MahaDiscom AE & JE",
    conductingBody: "Maharashtra State Electricity Distribution Co. Ltd. (conducted via IBPS)",
    logo: "bolt",
    color: "#D97706",
    examLevel: "State",
    targetPosts: [
      "Assistant Engineer (Electrical / Civil / Telecom)",
      "Junior Engineer (Electrical / Civil)",
      "Junior Assistant (Accounts)",
      "Vidyut Sahayak (विद्युत सहाय्यक — ITI Wireman/Electrician)"
    ],
    totalVacancies: "5,347+ (Engineers & Technicians)",
    applicationFee: { general: "₹500 + GST", reserved: "₹250 + GST" },
    ageLimit: { min: 18, max: 38, scStRelax: 5, obcRelax: 3 },
    eligibility: "B.E. / B.Tech / Diploma in Electrical / Civil / IT Engineering. Vidyut Sahayak पदासाठी ITI Electrician / Wireman प्रमाणपत्र आवश्यक.",
    stages: [
      "ऑनलाइन CBT परीक्षा (IBPS Pattern — 130 प्रश्न / 150 गुण / 120 मिनिटे)",
      "कागदपत्र पडताळणी"
    ],
    officialWebsite: "https://mahadiscom.in",
    notificationUrl: "https://mahadiscom.in/career",
    papers: [
      {
        stage: "ऑनलाइन CBT परीक्षा (IBPS Pattern — 130 प्रश्न / 150 गुण / 1/4 नकारात्मक गुण)",
        papers: [
          {
            name: "अभियांत्रिकी व क्षमता चाचणी (Engineering & Aptitude Composite Test)",
            marks: 150,
            questions: 130,
            duration: "2 तास (120 मिनिटे)",
            type: "CBT MCQ",
            topics: [
              {
                name: "Core Technical Discipline (50 प्रश्न / 110 गुण — सर्वाधिक वेटेज)",
                subtopics: [
                  "Electrical: Electrical Machines, Power Systems, Transmission & Distribution, Control Systems, Power Electronics, Circuit Theory, Electrical Measurements",
                  "Civil: Structural Engineering, Concrete Technology, Soil Mechanics, Fluid Mechanics, Surveying",
                  "IT/Telecom: Computer Networks, Database Management Systems, Data Structures, Operating Systems, Telecommunication Principles"
                ]
              },
              {
                name: "Reasoning Ability (40 प्रश्न / 20 गुण)",
                subtopics: [
                  "Puzzles & Seating Arrangement (IBPS Pattern)",
                  "Syllogisms, Inequalities, Input-Output, Data Sufficiency",
                  "Coding-Decoding, Direction Sense & Blood Relations"
                ]
              },
              {
                name: "Quantitative Aptitude (20 प्रश्न / 10 गुण)",
                subtopics: [
                  "Data Interpretation (Bar Graphs, Pie Charts, Caselets)",
                  "Number Series, Quadratic Equations, Simplification",
                  "Arithmetic Word Problems: Time & Work, Speed & Distance, Profit & Loss"
                ]
              },
              {
                name: "मराठी भाषा (20 प्रश्न / 10 गुण)",
                subtopics: [
                  "मराठी व्याकरण, शब्दसंग्रह, वाक्यरचना, उतारा वाचन व आकलन"
                ]
              }
            ]
          }
        ]
      }
    ],
    officialPdfs: [],
    pyqLinks: [
      { year: 2024, exam: "MahaDiscom AE & JE (IBPS)", label: "MahaDiscom 2024 Exam Pattern & Model Question Papers", paperUrl: "https://mahadiscom.in", answerKeyUrl: "https://mahadiscom.in", url: "https://mahadiscom.in" }
    ],
    books: [
      { title: "Electrical Engineering Objective Type — J.B. Gupta / R.K. Rajput", useFor: "Core Technical 110 Marks" },
      { title: "Quantitative Aptitude for Competitive Exams — R.S. Aggarwal", useFor: "Aptitude section" },
      { title: "A Modern Approach to Verbal & Non-Verbal Reasoning — R.S. Aggarwal", useFor: "IBPS pattern reasoning" }
    ],
    youtubeQuery: "MahaDiscom AE JE syllabus electrical engineering preparation IBPS pattern",
    relatedExams: ["mpsc-state-services", "rrb-ntpc", "ssc-cgl"]
  },

  // ────────────────────────────────────────────────────────────
  // 13. Maharashtra Krushi Sevak (कृषी सेवक व कृषी सहाय्यक)
  // ────────────────────────────────────────────────────────────
  {
    slug: "krushi-sevak",
    name: "कृषी सेवक / कृषी सहाय्यक भरती (Krushi Sevak Bharti)",
    nameEn: "Maharashtra Agriculture Department Krushi Sevak & Assistant Recruitment",
    shortName: "MH Krushi Sevak",
    conductingBody: "कृषी आयुक्तालय, महाराष्ट्र राज्य, पुणे (conducted via IBPS)",
    logo: "agriculture",
    color: "#16A34A",
    examLevel: "State",
    targetPosts: [
      "कृषी सेवक (Krushi Sevak)",
      "कृषी सहाय्यक (Agriculture Assistant)"
    ],
    totalVacancies: "2,109+ (Periodic State Recruitment)",
    applicationFee: { general: "₹1000", reserved: "₹900" },
    ageLimit: { min: 19, max: 38, scStRelax: 5, obcRelax: 3 },
    eligibility: "कृषी पदविका (Diploma in Agriculture) किंवा बी.एस्सी. कृषी (B.Sc Agriculture) / बी.टेक कृषी अभियांत्रिकी.",
    stages: [
      "ऑनलाइन CBT परीक्षा (IBPS Pattern — 140 प्रश्न / 200 गुण / 120 मिनिटे)",
      "कागदपत्र पडताळणी व जिल्हा वाटप"
    ],
    officialWebsite: "https://krishi.maharashtra.gov.in",
    notificationUrl: "https://krishi.maharashtra.gov.in",
    papers: [
      {
        stage: "ऑनलाइन CBT परीक्षा (IBPS Pattern — 140 प्रश्न / 200 गुण / नकारात्मक गुण नाहीत)",
        papers: [
          {
            name: "कृषी व सामान्य क्षमता संयुक्त चाचणी (Composite CBT Paper)",
            marks: 200,
            questions: 140,
            duration: "2 तास (120 मिनिटे)",
            type: "CBT MCQ",
            topics: [
              {
                name: "कृषी घटक तांत्रिक ज्ञान (Agriculture Core — 60 प्रश्न / 120 गुण / 60% वेटेज)",
                subtopics: [
                  "कृषी मूलतत्त्वे व हवामानशास्त्र (Agronomy & Agricultural Meteorology: पिके, बियाणे, खते)",
                  "मृदा विज्ञान व जलसंधारण (Soil Science & Water Conservation: मृदा प्रकार, सिंचन पद्धती, सूक्ष्म सिंचन)",
                  "उद्यानविद्या (Horticulture: फळबाग लागवड, भाजीपाला उत्पादन, हरितगृह तंत्रज्ञान)",
                  "पिक संरक्षण (Plant Protection: कीटकशास्त्र, वनस्पती रोगशास्त्र, एकात्मिक कीड नियंत्रण)",
                  "पशुसंवर्धन व दुग्धशास्त्र (Animal Husbandry & Dairying: गायी, म्हशी, शेळी-मेंढी पालन, कुक्कुटपालन)",
                  "कृषी विस्तार व अर्थशास्त्र (Agricultural Extension & Economics: शासकीय कृषी योजना, बाजार समित्या, शेतकरी गट)"
                ]
              },
              {
                name: "मराठी भाषा (20 प्रश्न / 20 गुण)",
                subtopics: [
                  "मराठी व्याकरण, शब्दसंग्रह, म्हणी, वाक्प्रचार, उतारा आकलन"
                ]
              },
              {
                name: "इंग्रजी भाषा (20 प्रश्न / 20 गुण)",
                subtopics: [
                  "Grammar, Tenses, Vocabulary, Sentence Correction, Comprehension"
                ]
              },
              {
                name: "सामान्य ज्ञान (20 प्रश्न / 20 गुण)",
                subtopics: [
                  "महाराष्ट्राचा भूगोल, इतिहास, चालू घडामोडी, कृषी क्षेत्रातील शासकीय योजना"
                ]
              },
              {
                name: "बौद्धिक चाचणी (20 प्रश्न / 20 गुण)",
                subtopics: [
                  "तर्कसंगत विचार, संख्या मालिका, कोडी, दिशा व अंतर, नातेसंबंध"
                ]
              }
            ]
          }
        ]
      }
    ],
    officialPdfs: [],
    pyqLinks: [
      { year: 2024, exam: "Krushi Sevak CBT (IBPS)", label: "Krushi Sevak 2024 Question Papers & Model Answer Keys", paperUrl: "https://krishi.maharashtra.gov.in", answerKeyUrl: "https://krishi.maharashtra.gov.in", url: "https://krishi.maharashtra.gov.in" }
    ],
    books: [
      { title: "कृषी घटक संपूर्ण मार्गदर्शक (कृषी पदविका आधारित) — आनंद कोकरे / ज्ञानदीप", useFor: "Core Agriculture 120 Marks" },
      { title: "कृषी विज्ञान व तंत्रज्ञान — डॉ. बाळकृष्ण कदम", useFor: "Horticulture, Agronomy & Soil Science" },
      { title: "सुगम मराठी व्याकरण — मो. रा. वाळंबे", useFor: "Marathi Grammar" }
    ],
    youtubeQuery: "Maharashtra krushi sevak bharti syllabus agriculture preparation IBPS",
    relatedExams: ["maharashtra-zp", "mpsc-vanseva", "maharashtra-talathi"]
  },

  // ────────────────────────────────────────────────────────────
  // 14. Maharashtra Police Driver & SRPF (पोलीस चालक व SRPF शिपाई)
  // ────────────────────────────────────────────────────────────
  {
    slug: "pune-mumbai-police-driver",
    name: "महाराष्ट्र पोलीस चालक व SRPF शिपाई भरती",
    nameEn: "Maharashtra Police Driver & SRPF Armed Police Constable Recruitment",
    shortName: "MH Police Driver & SRPF",
    conductingBody: "पोलीस महासंचालक कार्यालय, महाराष्ट्र राज्य",
    logo: "local_police",
    color: "#B91C1C",
    examLevel: "State",
    targetPosts: [
      "पोलीस शिपाई चालक (Police Constable Driver)",
      "SRPF सशस्त्र पोलीस शिपाई (Armed Police Constable)"
    ],
    totalVacancies: "4,200+ (State Driver & SRPF Cadres)",
    applicationFee: { general: "₹450", reserved: "₹350" },
    ageLimit: { min: 19, max: 28, scStRelax: 5, obcRelax: 5 },
    eligibility: "१२ वी उत्तीर्ण (12th Passed) + वैध हलके मोटार वाहन (LMV) चालवण्याचा परवाना (Driving License TR / Non-TR).",
    stages: [
      "शारीरिक चाचणी (Physical Efficiency Test - 50 गुण)",
      "चालन कौशल्य चाचणी (Driving Skill Test - 50 गुण - अहर्ताकारी / Qualifying)",
      "लेखी परीक्षा (Written CBT/OMR Exam - 100 प्रश्न / 100 गुण / 90 मिनिटे)"
    ],
    officialWebsite: "https://mahapolice.gov.in",
    notificationUrl: "https://policerecruitment2024.mahait.org",
    papers: [
      {
        stage: "चालन कौशल्य चाचणी (Driving Skill Test — 50 गुण — किमान ५०% गुण आवश्यक)",
        papers: [
          {
            name: "ड्रायव्हिंग प्रात्यक्षिक चाचणी (Practical Driving Ground Test)",
            marks: 50,
            duration: "Ground Event",
            type: "Practical Skill Evaluation",
            topics: [
              { name: "हलके मोटार वाहन चालवणे (Light Motor Vehicle Driving — 25 गुण)", subtopics: ["H-Track रिव्हर्स चालवणे, 8-Track चालवणे, ग्रेडिएंट/उतार ड्रायव्हिंग, पॅरलल पार्किंग"] },
              { name: "जड मोटार वाहन चालवणे व वाहतूक नियम (Heavy Vehicle & Rules — 25 गुण)", subtopics: ["वाहतूक चिन्हे व संकेत, मोटार वाहन कायदा कलम ज्ञान, वाहनाचे मूलभूत तांत्रिक ज्ञान (इंजिन ऑईल, बॅटरी, टायर प्रेशर)"] }
            ]
          }
        ]
      },
      {
        stage: "लेखी परीक्षा (Written Test — 100 प्रश्न / 100 गुण / 90 मिनिटे / नकारात्मक गुण नाहीत)",
        papers: [
          {
            name: "पोलीस चालक लेखी परीक्षा (Written Examination)",
            marks: 100,
            questions: 100,
            duration: "90 मिनिटे",
            type: "OMR / CBT MCQ",
            topics: [
              { name: "अंकगणित (20 प्रश्न / 20 गुण)", subtopics: ["संख्या, लसावि-मसावि, सरासरी, नफा-तोटा, शेकडेवारी, काम-काळ-वेग"] },
              { name: "बुद्धिमत्ता चाचणी (20 प्रश्न / 20 गुण)", subtopics: ["अक्षर व संख्या मालिका, सांकेतिक भाषा, दिशा व अंतर, नातेसंबंध"] },
              { name: "मराठी व्याकरण (20 प्रश्न / 20 गुण)", subtopics: ["शब्दांच्या जाती, लिंग, वचन, प्रयोग, समास, समानार्थी व विरुद्धार्थी शब्द"] },
              { name: "सामान्य ज्ञान व चालू घडामोडी (20 प्रश्न / 20 गुण)", subtopics: ["महाराष्ट्राचा इतिहास, भूगोल, पोलीस प्रशासन रचना, चालू घडामोडी"] },
              { name: "मोटार वाहन कायदा व वाहतूक नियम (20 प्रश्न / 20 गुण — चालक विशेष)", subtopics: ["मोटार वाहन कायदा १९८८ (MVA 1988) व महत्त्वाचे दंड, रस्ते वाहतूक चिन्हे व अर्थ, अपघात नियंत्रण व प्राथमिक उपचार, वाहनांची देखभाल"] }
            ]
          }
        ]
      }
    ],
    officialPdfs: [],
    pyqLinks: [
      { year: 2024, exam: "Maharashtra Police Driver Written Exam", label: "Police Driver 2024 Question Papers & Answer Keys", paperUrl: "https://mahapolice.gov.in", answerKeyUrl: "https://mahapolice.gov.in", url: "https://mahapolice.gov.in" },
      { year: 2023, exam: "Maharashtra Police Driver Written Exam", label: "Police Driver 2023 Question Papers & Answer Keys", paperUrl: "https://mahapolice.gov.in", answerKeyUrl: "https://mahapolice.gov.in", url: "https://mahapolice.gov.in" }
    ],
    books: [
      { title: "पोलीस चालक भरती विशेष मार्गदर्शक (वाहतूक नियम व मोटार कायदा) — नोबल पब्लिकेशन", useFor: "Driver specific 20 marks MVA & Traffic signs" },
      { title: "पोलीस भरती संपूर्ण मार्गदर्शक — सह्याद्री करिअर अकॅडमी", useFor: "Math, Reasoning, Marathi, GK" },
      { title: "सुगम मराठी व्याकरण — मो. रा. वाळंबे", useFor: "Marathi Grammar" }
    ],
    youtubeQuery: "Maharashtra police driver bharti syllabus driving test traffic rules",
    relatedExams: ["maharashtra-police", "maharashtra-talathi", "maharashtra-zp"]
  },

  // ────────────────────────────────────────────────────────────
  // 15. UPSC Civil Services Examination (IAS / IPS)
  // ────────────────────────────────────────────────────────────
  {
    slug: "upsc-cse",
    name: "UPSC नागरी सेवा परीक्षा (IAS / IPS)",
    nameEn: "UPSC Civil Services Examination",
    shortName: "UPSC CSE",
    conductingBody: "Union Public Service Commission (UPSC)",
    logo: "military_tech",
    color: "#6366F1",
    examLevel: "Central",
    targetPosts: ["Indian Administrative Service (IAS)", "Indian Police Service (IPS)", "Indian Foreign Service (IFS)", "Indian Revenue Service (IRS)"],
    totalVacancies: "~1,056 (Annual All-India Cycle)",
    applicationFee: { general: "₹100", reserved: "Free (SC/ST/PwBD/Female)" },
    ageLimit: { min: 21, max: 32, scStRelax: 5, obcRelax: 3 },
    eligibility: "Bachelor's Degree in any discipline from a recognized University.",
    stages: ["Civil Services Preliminary Exam", "Civil Services Main Examination (9 Papers)", "Personality Test (Interview - 275 Marks)"],
    officialWebsite: "https://upsc.gov.in",
    notificationUrl: "https://upsc.gov.in/examinations/active-examinations",
    papers: [
      {
        stage: "Prelims (Objective Type)",
        papers: [
          {
            name: "General Studies Paper I",
            marks: 200,
            questions: 100,
            duration: "2 hours",
            type: "MCQ (1/3rd Negative Marking)",
            topics: [
              { name: "Current Events of National & International Importance", subtopics: ["Government schemes, bilateral agreements, defense, science discoveries"] },
              { name: "History of India & Indian National Movement", subtopics: ["Ancient India (Indus Valley, Vedic, Maurya, Gupta)", "Medieval India (Bhakti-Sufi, Delhi Sultanate, Mughals)", "Modern India & Freedom Struggle"] },
              { name: "Indian & World Geography", subtopics: ["Geomorphology, Climatology, Oceanography, Resources, Mapping, Human Geography"] },
              { name: "Indian Polity & Governance", subtopics: ["Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues"] },
              { name: "Economic & Social Development", subtopics: ["Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives"] },
              { name: "General Issues on Ecology, Bio-diversity & Climate Change", subtopics: ["IUCN species, Ramsar sites, National Parks, UNFCCC, Carbon markets"] },
              { name: "General Science", subtopics: ["Space tech, Biotech, Nanotech, Defense developments, AI & Quantum computing"] },
            ]
          },
          {
            name: "General Studies Paper II (CSAT)",
            marks: 200,
            questions: 80,
            duration: "2 hours",
            type: "MCQ (Qualifying — 33% / 66 marks needed)",
            topics: [
              { name: "Comprehension & Interpersonal Skills", subtopics: ["Critical thinking passages, Inference based analytical reading"] },
              { name: "Logical Reasoning & Analytical Ability", subtopics: ["Puzzles, Seating, Syllogisms, Assumptions, Data Sufficiency"] },
              { name: "Basic Numeracy & Data Interpretation", subtopics: ["Class X level Numbers, Permutations, Probability, Graphs and Tables"] },
            ]
          }
        ]
      },
      {
        stage: "Mains (Descriptive 1750 Marks)",
        papers: [
          { name: "Paper A: Indian Language (e.g. Marathi / Hindi)", marks: 300, duration: "3 hours", type: "Qualifying (25%)", topics: [{ name: "Language Proficiency", subtopics: ["Essay, Reading Comprehension, Précis, Translation"] }] },
          { name: "Paper B: English Language", marks: 300, duration: "3 hours", type: "Qualifying (25%)", topics: [{ name: "English Proficiency", subtopics: ["Essay, Reading Comprehension, Précis, Grammar"] }] },
          { name: "Paper I: Essay", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Two Essays", subtopics: ["Philosophical topics, Socio-economic policy reflections"] }] },
          { name: "Paper II: General Studies I", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Indian Heritage & Culture, History & Geography", subtopics: ["Art forms, literature, modern history, world history, physical geography"] }] },
          { name: "Paper III: General Studies II", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Governance, Constitution, Polity & IR", subtopics: ["Constitutional mechanisms, Statutory bodies, Welfare policies, Global geopolitics"] }] },
          { name: "Paper IV: General Studies III", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Economy, Science & Tech, Environment, Security", subtopics: ["Inclusive growth, Agriculture, Space, Western Ghats ecology, Border management"] }] },
          { name: "Paper V: General Studies IV", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Ethics, Integrity & Aptitude", subtopics: ["Moral psychology, Public service values, Foundational ethics, Case studies"] }] },
          { name: "Paper VI: Optional Subject Paper 1", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Optional Discipline", subtopics: ["Candidate chosen discipline (e.g., PSIR, Geography, History, Marathi Literature)"] }] },
          { name: "Paper VII: Optional Subject Paper 2", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Optional Discipline Advanced", subtopics: ["Advanced applications and problem solving"] }] },
        ]
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "Civil Services Prelims GS 1 & CSAT", label: "UPSC CSE 2024 Prelims Question Paper & Official Key", paperUrl: "https://upsc.gov.in/examinations/previous-question-papers", answerKeyUrl: "https://upsc.gov.in/examinations/answer-keys", url: "https://upsc.gov.in/examinations/previous-question-papers" },
      { year: 2023, exam: "Civil Services Prelims GS 1 & CSAT", label: "UPSC CSE 2023 Prelims Question Paper & Official Key", paperUrl: "https://upsc.gov.in/examinations/previous-question-papers", answerKeyUrl: "https://upsc.gov.in/examinations/answer-keys", url: "https://upsc.gov.in/examinations/previous-question-papers" },
      { year: 2022, exam: "Civil Services Prelims GS 1 & CSAT", label: "UPSC CSE 2022 Prelims Question Paper & Official Key", paperUrl: "https://upsc.gov.in/examinations/previous-question-papers", answerKeyUrl: "https://upsc.gov.in/examinations/answer-keys", url: "https://upsc.gov.in/examinations/previous-question-papers" },
      { year: 2021, exam: "Civil Services Prelims GS 1 & CSAT", label: "UPSC CSE 2021 Prelims Question Paper & Official Key", paperUrl: "https://upsc.gov.in/examinations/previous-question-papers", answerKeyUrl: "https://upsc.gov.in/examinations/answer-keys", url: "https://upsc.gov.in/examinations/previous-question-papers" },
      { year: 2020, exam: "Civil Services Prelims GS 1 & CSAT", label: "UPSC CSE 2020 Prelims Question Paper & Official Key", paperUrl: "https://upsc.gov.in/examinations/previous-question-papers", answerKeyUrl: "https://upsc.gov.in/examinations/answer-keys", url: "https://upsc.gov.in/examinations/previous-question-papers" },
      { year: 2019, exam: "Civil Services Prelims GS 1 & CSAT", label: "UPSC CSE 2019 Prelims Question Paper & Official Key", paperUrl: "https://upsc.gov.in/examinations/previous-question-papers", answerKeyUrl: "https://upsc.gov.in/examinations/answer-keys", url: "https://upsc.gov.in/examinations/previous-question-papers" },
    ],
    books: [
      { title: "Indian Polity — M. Laxmikanth", useFor: "Polity & Constitution (Prelims + GS-II)" },
      { title: "India's Ancient Past — R.S. Sharma & Spectrum Modern India", useFor: "Ancient & Modern Indian History" },
      { title: "Certificate Physical and Human Geography — G.C. Leong", useFor: "Geography basics and world climates" },
      { title: "Indian Economy — Nitin Singhania / Ramesh Singh", useFor: "Economy, Macro indicators and Budget" },
      { title: "Lexicon for Ethics, Integrity & Aptitude", useFor: "GS-IV Ethics and case studies" },
    ],
    youtubeQuery: "UPSC CSE syllabus analysis booklist and previous year questions",
    relatedExams: ["mpsc-state-services", "rbi-grade-b", "ssc-cgl"],
  },

  // ────────────────────────────────────────────────────────────
  // 10. SSC Combined Graduate Level (SSC CGL)
  // ────────────────────────────────────────────────────────────
  {
    slug: "ssc-cgl",
    name: "कर्मचारी निवड आयोग CGL (SSC CGL)",
    nameEn: "SSC Combined Graduate Level (CGL)",
    shortName: "SSC CGL",
    conductingBody: "Staff Selection Commission (SSC, Govt of India)",
    logo: "business_center",
    color: "#0891B2",
    examLevel: "Central",
    targetPosts: ["Assistant Audit Officer (AAO)", "Income Tax Inspector (ITI)", "Central Excise Inspector", "Enforcement Officer", "CBI Sub-Inspector", "Divisional Accountant"],
    totalVacancies: "~17,727 (Mega Annual Recruitment)",
    applicationFee: { general: "₹100", reserved: "Free (SC/ST/Women/ESM)" },
    ageLimit: { min: 18, max: 32, scStRelax: 5, obcRelax: 3 },
    eligibility: "Bachelor's Degree in any discipline from a recognized University.",
    stages: ["Tier I Examination (CBT Qualifying)", "Tier II Examination (CBT Merit + DEST Computer Test)", "Document Verification"],
    officialWebsite: "https://ssc.gov.in",
    notificationUrl: "https://ssc.gov.in/candidate-portal/notice",
    papers: [
      {
        stage: "Tier I (Computer Based Test - 200 Marks)",
        papers: [
          {
            name: "Tier I Common Screening",
            marks: 200,
            questions: 100,
            duration: "60 minutes (1 hour)",
            type: "MCQ (0.50 negative marks)",
            topics: [
              { name: "General Intelligence & Reasoning (25 Qs / 50 Marks)", subtopics: ["Analogies, Venn diagrams, Syllogisms, Folding/Cutting, Blood relations, Matrix"] },
              { name: "General Awareness (25 Qs / 50 Marks)", subtopics: ["Indian History, Culture, Geography, Polity, Science, Current affairs"] },
              { name: "Quantitative Aptitude (25 Qs / 50 Marks)", subtopics: ["Arithmetic, Algebra, Geometry, Mensuration, Trigonometry, Data Interpretation"] },
              { name: "English Comprehension (25 Qs / 50 Marks)", subtopics: ["Spotting error, Synonyms, Antonyms, Idioms, One-word substitution, Cloze test"] },
            ]
          }
        ]
      },
      {
        stage: "Tier II (Merit Examination - 390 Marks)",
        papers: [
          {
            name: "Paper I: Mathematical Abilities & Reasoning",
            marks: 180,
            questions: 60,
            duration: "1 hour",
            type: "MCQ (3 marks each, 1 mark negative)",
            topics: [
              { name: "Mathematical Abilities (30 Qs / 90 Marks)", subtopics: ["Number Systems, Percentages, Ratio, Profit/Loss, Time & Distance, Trigonometry, Statistics & Probability"] },
              { name: "Reasoning & General Intelligence (30 Qs / 90 Marks)", subtopics: ["Critical reasoning, Coding, Statement-Assumption, Puzzle arrangements"] },
            ]
          },
          {
            name: "Paper II: English Language & General Awareness",
            marks: 210,
            questions: 70,
            duration: "1 hour",
            type: "MCQ (3 marks each, 1 mark negative)",
            topics: [
              { name: "English Language & Comprehension (45 Qs / 135 Marks)", subtopics: ["Active/Passive, Direct/Indirect, Reading Comprehension, Error detection, Sentence rearrangement"] },
              { name: "General Awareness (25 Qs / 75 Marks)", subtopics: ["Static GK, Economy, Science, Current National & International affairs"] },
            ]
          },
          {
            name: "Computer Knowledge Test (Qualifying)",
            marks: 60,
            questions: 20,
            duration: "15 minutes",
            type: "MCQ (Qualifying)",
            topics: [
              { name: "Computer Basics", subtopics: ["CPU, RAM/ROM, Windows OS, MS Word/Excel/PowerPoint, Internet, Cyber security & Viruses"] },
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "Tier I & Tier II All Shifts", label: "SSC CGL 2024 Question Papers & Answer Keys", paperUrl: "https://ssc.gov.in/candidate-portal/previous-year-question-paper", answerKeyUrl: "https://ssc.gov.in/candidate-portal/answer-keys", url: "https://ssc.gov.in/candidate-portal/previous-year-question-paper" },
      { year: 2023, exam: "Tier I & Tier II All Shifts", label: "SSC CGL 2023 Question Papers & Answer Keys", paperUrl: "https://ssc.gov.in/candidate-portal/previous-year-question-paper", answerKeyUrl: "https://ssc.gov.in/candidate-portal/answer-keys", url: "https://ssc.gov.in/candidate-portal/previous-year-question-paper" },
      { year: 2022, exam: "Tier I & Tier II All Shifts", label: "SSC CGL 2022 Question Papers & Answer Keys", paperUrl: "https://ssc.gov.in/candidate-portal/previous-year-question-paper", answerKeyUrl: "https://ssc.gov.in/candidate-portal/answer-keys", url: "https://ssc.gov.in/candidate-portal/previous-year-question-paper" },
      { year: 2021, exam: "Tier I & Tier II All Shifts", label: "SSC CGL 2021 Question Papers & Answer Keys", paperUrl: "https://ssc.gov.in/candidate-portal/previous-year-question-paper", answerKeyUrl: "https://ssc.gov.in/candidate-portal/answer-keys", url: "https://ssc.gov.in/candidate-portal/previous-year-question-paper" },
      { year: 2020, exam: "Tier I & Tier II All Shifts", label: "SSC CGL 2020 Question Papers & Answer Keys", paperUrl: "https://ssc.gov.in/candidate-portal/previous-year-question-paper", answerKeyUrl: "https://ssc.gov.in/candidate-portal/answer-keys", url: "https://ssc.gov.in/candidate-portal/previous-year-question-paper" },
    ],
    books: [
      { title: "Quantitative Aptitude for Competitive Examinations — R.S. Aggarwal", useFor: "Quant (Tier I + Tier II)" },
      { title: "Kiran SSC CGL Chapterwise Solved Papers", useFor: "Previous years questions practice" },
      { title: "English for General Competitions — Neetu Singh (Plinth to Paramount)", useFor: "English grammar and vocabulary" },
      { title: "Lucent's General Knowledge", useFor: "Static GK and science facts" },
    ],
    youtubeQuery: "SSC CGL syllabus tier 1 tier 2 math english previous question papers",
    relatedExams: ["ssc-chsl", "rrb-ntpc", "ibps-po", "upsc-cse"],
  },

  // ────────────────────────────────────────────────────────────
  // 11. SSC CHSL (10+2)
  // ────────────────────────────────────────────────────────────
  {
    slug: "ssc-chsl",
    name: "कर्मचारी निवड आयोग CHSL (10+2)",
    nameEn: "SSC Combined Higher Secondary Level (CHSL)",
    shortName: "SSC CHSL",
    conductingBody: "Staff Selection Commission (SSC)",
    logo: "school",
    color: "#0284C7",
    examLevel: "Central",
    targetPosts: ["Lower Division Clerk (LDC)", "Junior Secretariat Assistant (JSA)", "Data Entry Operator (DEO)"],
    totalVacancies: "~3,712 (Annual Recruitment)",
    applicationFee: { general: "₹100", reserved: "Free" },
    ageLimit: { min: 18, max: 27, scStRelax: 5, obcRelax: 3 },
    eligibility: "12th Standard or equivalent from a recognized Board.",
    stages: ["Tier I (Online CBT)", "Tier II (CBT + Typing / Skill Test)", "Document Verification"],
    officialWebsite: "https://ssc.gov.in",
    notificationUrl: "https://ssc.gov.in/candidate-portal/notice",
    papers: [
      {
        stage: "Tier I Examination (200 Marks)",
        papers: [
          {
            name: "Tier I CBT",
            marks: 200,
            questions: 100,
            duration: "60 minutes",
            type: "MCQ (0.50 negative marking)",
            topics: [
              { name: "English Language (Basic Knowledge - 25 Qs / 50 Marks)", subtopics: ["Spotting errors, fill in blanks, synonyms, antonyms, spellings, idioms, cloze test"] },
              { name: "General Intelligence (25 Qs / 50 Marks)", subtopics: ["Semantic analogy, symbolic operations, space orientation, semantic classification, Venn diagrams"] },
              { name: "Quantitative Aptitude (Basic Arithmetic - 25 Qs / 50 Marks)", subtopics: ["Number systems, decimals, fractions, percentages, ratio, profit & loss, algebra, geometry, mensuration"] },
              { name: "General Awareness (25 Qs / 50 Marks)", subtopics: ["Current events, scientific research, history, culture, geography, economics, general policy"] },
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "Tier I & Tier II All Shifts", label: "SSC CHSL 2024 Question Papers & Answer Keys", paperUrl: "https://ssc.gov.in/candidate-portal/previous-year-question-paper", answerKeyUrl: "https://ssc.gov.in/candidate-portal/answer-keys", url: "https://ssc.gov.in/candidate-portal/previous-year-question-paper" },
      { year: 2023, exam: "Tier I & Tier II All Shifts", label: "SSC CHSL 2023 Question Papers & Answer Keys", paperUrl: "https://ssc.gov.in/candidate-portal/previous-year-question-paper", answerKeyUrl: "https://ssc.gov.in/candidate-portal/answer-keys", url: "https://ssc.gov.in/candidate-portal/previous-year-question-paper" },
      { year: 2022, exam: "Tier I & Tier II All Shifts", label: "SSC CHSL 2022 Question Papers & Answer Keys", paperUrl: "https://ssc.gov.in/candidate-portal/previous-year-question-paper", answerKeyUrl: "https://ssc.gov.in/candidate-portal/answer-keys", url: "https://ssc.gov.in/candidate-portal/previous-year-question-paper" },
      { year: 2021, exam: "Tier I All Shifts", label: "SSC CHSL 2021 Question Papers & Answer Keys", paperUrl: "https://ssc.gov.in/candidate-portal/previous-year-question-paper", answerKeyUrl: "https://ssc.gov.in/candidate-portal/answer-keys", url: "https://ssc.gov.in/candidate-portal/previous-year-question-paper" },
      { year: 2020, exam: "Tier I All Shifts", label: "SSC CHSL 2020 Question Papers & Answer Keys", paperUrl: "https://ssc.gov.in/candidate-portal/previous-year-question-paper", answerKeyUrl: "https://ssc.gov.in/candidate-portal/answer-keys", url: "https://ssc.gov.in/candidate-portal/previous-year-question-paper" },
    ],
    books: [
      { title: "Kiran's SSC CHSL (10+2) Practice Work Book", useFor: "Full syllabus mock tests and PYQs" },
      { title: "Lucent's General Knowledge", useFor: "General Awareness" },
    ],
    youtubeQuery: "SSC CHSL syllabus tier 1 tier 2 math reasoning preparation",
    relatedExams: ["ssc-cgl", "rrb-ntpc", "maharashtra-police"],
  },

  // ────────────────────────────────────────────────────────────
  // 12. Railway RRB NTPC
  // ────────────────────────────────────────────────────────────
  {
    slug: "rrb-ntpc",
    name: "रेल्वे भरती बोर्ड NTPC (RRB NTPC)",
    nameEn: "Railway Recruitment Board NTPC (Non-Technical)",
    shortName: "RRB NTPC",
    conductingBody: "Railway Recruitment Control Board (RRB / Ministry of Railways)",
    logo: "train",
    color: "#B45309",
    examLevel: "Central",
    targetPosts: ["Station Master (SM)", "Goods Guard", "Senior Commercial Clerk", "Junior Accounts Assistant", "Traffic Assistant"],
    totalVacancies: "~11,558 (Graduate & Undergraduate Posts)",
    applicationFee: { general: "₹500 (₹400 refunded after CBT-1)", reserved: "₹250 (full refunded)" },
    ageLimit: { min: 18, max: 36, scStRelax: 5, obcRelax: 3 },
    eligibility: "12th Standard for Level 2 & 3; Bachelor's Degree for Level 4, 5, 6 posts.",
    stages: ["1st Stage CBT (Screening - 100 Marks)", "2nd Stage CBT (Merit - 120 Marks)", "CBAT (Aptitude Test for SM) / Typing Skill Test", "Document Verification & Medical"],
    officialWebsite: "https://www.rrbcdg.gov.in/notice_boards.php",
    notificationUrl: "https://www.rrbapply.gov.in",
    papers: [
      {
        stage: "1st Stage Computer Based Test (CBT-1)",
        papers: [
          {
            name: "CBT-1 Common Screening",
            marks: 100,
            questions: 100,
            duration: "90 minutes",
            type: "MCQ (1/3rd Negative Marking)",
            topics: [
              { name: "General Awareness (40 Qs / 40 Marks)", subtopics: ["Current events, Indian railways facts, games and sports, art & culture of India, Indian literature, monuments & places of India, general science (Class X CBSE)"] },
              { name: "Mathematics (30 Qs / 30 Marks)", subtopics: ["Number system, decimals, fractions, LCM/HCF, ratio & proportions, percentage, mensuration, time & work, time & distance, simple & compound interest, algebra"] },
              { name: "General Intelligence & Reasoning (30 Qs / 30 Marks)", subtopics: ["Analogies, completion of number & alphabetical series, coding & decoding, mathematical operations, relationships, syllogism, Venn diagrams, puzzle"] },
            ]
          }
        ]
      },
      {
        stage: "2nd Stage Computer Based Test (CBT-2)",
        papers: [
          {
            name: "CBT-2 (Level Wise Merit)",
            marks: 120,
            questions: 120,
            duration: "90 minutes",
            type: "MCQ (1/3rd Negative Marking)",
            topics: [
              { name: "General Awareness (50 Qs / 50 Marks)", subtopics: ["Advanced national & international affairs, Indian economy, modern history, world organizations, environment"] },
              { name: "Mathematics (35 Qs / 35 Marks)", subtopics: ["Advanced trigonometry, statistics, geometry, arithmetic calculations"] },
              { name: "General Intelligence & Reasoning (35 Qs / 35 Marks)", subtopics: ["Complex seating arrangements, conditional logic, statement arguments"] },
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "CBT-1 & CBT-2 All Shifts", label: "RRB NTPC 2024 Question Papers & Keys", paperUrl: "https://www.rrbcdg.gov.in/notice_boards.php", answerKeyUrl: "https://www.rrbcdg.gov.in/notice_boards.php", url: "https://rrbcdg.gov.in" },
      { year: 2022, exam: "CBT-2 Level 2, 3, 5, 6 All Shifts", label: "RRB NTPC 2022 CBT-2 Papers & Keys", paperUrl: "https://www.rrbcdg.gov.in/notice_boards.php", answerKeyUrl: "https://www.rrbcdg.gov.in/notice_boards.php", url: "https://rrbcdg.gov.in" },
      { year: 2021, exam: "CBT-1 Phase 1-7 All Shifts", label: "RRB NTPC 2021 CBT-1 Papers & Keys", paperUrl: "https://www.rrbcdg.gov.in/notice_boards.php", answerKeyUrl: "https://www.rrbcdg.gov.in/notice_boards.php", url: "https://rrbcdg.gov.in" },
      { year: 2019, exam: "CBT Exam Question Papers", label: "RRB NTPC 2019 Question Paper & Keys", paperUrl: "https://www.rrbcdg.gov.in/notice_boards.php", answerKeyUrl: "https://www.rrbcdg.gov.in/notice_boards.php", url: "https://rrbcdg.gov.in" },
      { year: 2016, exam: "CBT-1 & CBT-2 Shifts", label: "RRB NTPC 2016 Question Paper & Keys", paperUrl: "https://www.rrbcdg.gov.in/notice_boards.php", answerKeyUrl: "https://www.rrbcdg.gov.in/notice_boards.php", url: "https://rrbcdg.gov.in" },
    ],
    books: [
      { title: "RRB NTPC Non-Technical Guide — Arihant / Kiran Publication", useFor: "Complete CBT-1 and CBT-2 syllabus" },
      { title: "Fast Track Objective Arithmetic — Rajesh Verma", useFor: "Mathematics speed practice" },
      { title: "General Science for Indian Railways — Lucent / Speedy Railway Science", useFor: "Physics, Chemistry and Biology questions" },
    ],
    youtubeQuery: "RRB NTPC syllabus cbt 1 cbt 2 math reasoning general awareness",
    relatedExams: ["rrb-group-d", "ssc-cgl", "ssc-chsl"],
  },

  // ────────────────────────────────────────────────────────────
  // 13. Railway RRB Group D (Level 1)
  // ────────────────────────────────────────────────────────────
  {
    slug: "rrb-group-d",
    name: "रेल्वे ग्रुप डी भरती (RRB Group D)",
    nameEn: "Railway Recruitment Cell (RRC / RRB Group D Level-1)",
    shortName: "RRB Group D",
    conductingBody: "Railway Recruitment Cells (RRC / Ministry of Railways)",
    logo: "directions_subway",
    color: "#D97706",
    examLevel: "Central",
    targetPosts: ["Track Maintainer Grade IV", "Pointsman", "Assistant Pointsman", "Hospital Attendant", "Workshop Helper"],
    totalVacancies: "~1,03,769+ (Mega National Drive)",
    applicationFee: { general: "₹500 (₹400 refunded after CBT)", reserved: "₹250 (refunded)" },
    ageLimit: { min: 18, max: 33, scStRelax: 5, obcRelax: 3 },
    eligibility: "10th pass (Matriculation) from recognized Board OR ITI from NCVT/SCVT.",
    stages: ["Computer Based Test (CBT - 100 Marks)", "Physical Efficiency Test (PET - Weight lifting & running)", "Document Verification & Medical"],
    officialWebsite: "https://www.rrbcdg.gov.in/notice_boards.php",
    notificationUrl: "https://www.rrbapply.gov.in",
    papers: [
      {
        stage: "Computer Based Test (CBT - 100 Marks)",
        papers: [
          {
            name: "Single Online CBT",
            marks: 100,
            questions: 100,
            duration: "90 minutes",
            type: "MCQ (1/3rd Negative Marking)",
            topics: [
              { name: "General Science (25 Qs / 25 Marks)", subtopics: ["Class 10th CBSE level Physics, Chemistry & Life Sciences"] },
              { name: "Mathematics (25 Qs / 25 Marks)", subtopics: ["Number system, BODMAS, Decimals, Fractions, LCM/HCF, Ratio, Percentages, Mensuration, Time & Work"] },
              { name: "General Intelligence & Reasoning (30 Qs / 30 Marks)", subtopics: ["Analogies, Alphabetical and Number Series, Coding and Decoding, Mathematical operations, Relationships, Syllogism"] },
              { name: "General Awareness & Current Affairs (20 Qs / 20 Marks)", subtopics: ["Science & Technology, Sports, Culture, Personalities, Economics, Politics"] },
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "CBT Shift Question Papers", label: "RRB Group D 2024 Question Papers & Answer Keys", paperUrl: "https://www.rrbcdg.gov.in/notice_boards.php", answerKeyUrl: "https://www.rrbcdg.gov.in/notice_boards.php", url: "https://rrbcdg.gov.in" },
      { year: 2022, exam: "CBT Phase 1-5 All Shifts", label: "RRB Group D 2022 Question Papers & Answer Keys", paperUrl: "https://www.rrbcdg.gov.in/notice_boards.php", answerKeyUrl: "https://www.rrbcdg.gov.in/notice_boards.php", url: "https://rrbcdg.gov.in" },
      { year: 2019, exam: "CBT Question Papers", label: "RRB Group D 2019 Question Papers & Answer Keys", paperUrl: "https://www.rrbcdg.gov.in/notice_boards.php", answerKeyUrl: "https://www.rrbcdg.gov.in/notice_boards.php", url: "https://rrbcdg.gov.in" },
      { year: 2018, exam: "CBT All Shifts", label: "RRB Group D 2018 Question Papers & Answer Keys", paperUrl: "https://www.rrbcdg.gov.in/notice_boards.php", answerKeyUrl: "https://www.rrbcdg.gov.in/notice_boards.php", url: "https://rrbcdg.gov.in" },
      { year: 2014, exam: "Offline Written Test", label: "RRB Group D 2014 Question Paper & Keys", paperUrl: "https://www.rrbcdg.gov.in/notice_boards.php", answerKeyUrl: "https://www.rrbcdg.gov.in/notice_boards.php", url: "https://rrbcdg.gov.in" },
    ],
    books: [
      { title: "Speedy Railway Samanya Vigyan (General Science)", useFor: "25 Marks General Science preparation" },
      { title: "Railway Group D All Shifts Solved Papers — Youth Competition Times", useFor: "Authentic previous shift questions" },
    ],
    youtubeQuery: "RRB group d syllabus question paper science math previous years",
    relatedExams: ["rrb-ntpc", "maharashtra-police"],
  },

  // ────────────────────────────────────────────────────────────
  // 14. IBPS Probationary Officer (PO)
  // ────────────────────────────────────────────────────────────
  {
    slug: "ibps-po",
    name: "IBPS प्रोबेशनरी ऑफिसर (IBPS PO)",
    nameEn: "IBPS Probationary Officer / Management Trainee (PO/MT)",
    shortName: "IBPS PO",
    conductingBody: "Institute of Banking Personnel Selection (IBPS)",
    logo: "account_balance_wallet",
    color: "#0284C7",
    examLevel: "Central",
    targetPosts: ["Probationary Officer (PO)", "Management Trainee (MT) across 11 Public Sector Banks"],
    totalVacancies: "~4,455 (Annual Banking Cycle)",
    applicationFee: { general: "₹850", reserved: "₹175" },
    ageLimit: { min: 20, max: 30, scStRelax: 5, obcRelax: 3 },
    eligibility: "A Degree (Graduation) in any discipline from a recognized University.",
    stages: ["Preliminary Examination (100 Marks)", "Main Examination (200 + 25 Descriptive Marks)", "Common Interview (100 Marks)"],
    officialWebsite: "https://www.ibps.in/crp-po-mt/",
    notificationUrl: "https://ibpsonline.ibps.in",
    papers: [
      {
        stage: "Preliminary Examination (100 Marks)",
        papers: [
          {
            name: "Prelims Online CBT",
            marks: 100,
            questions: 100,
            duration: "60 minutes (20 min sectional timing)",
            type: "MCQ (0.25 Negative Marking)",
            topics: [
              { name: "English Language (30 Qs / 30 Marks / 20 mins)", subtopics: ["Reading Comprehension, Cloze Test, Para Jumbles, Error Spotting, Sentence Improvement"] },
              { name: "Quantitative Aptitude (35 Qs / 35 Marks / 20 mins)", subtopics: ["Data Interpretation (Bar/Pie/Caselet), Quadratic Equations, Number Series, Simplification, Arithmetic Word Problems"] },
              { name: "Reasoning Ability (35 Qs / 35 Marks / 20 mins)", subtopics: ["Puzzles (Floor, Box, Scheduling), Seating Arrangements (Linear, Circular), Syllogisms, Inequalities, Blood Relations"] },
            ]
          }
        ]
      },
      {
        stage: "Main Examination (225 Marks)",
        papers: [
          {
            name: "Mains Objective Test (200 Marks / 3 hours)",
            marks: 200,
            questions: 155,
            duration: "180 minutes",
            type: "MCQ (Sectional Timing)",
            topics: [
              { name: "Reasoning & Computer Aptitude (45 Qs / 60 Marks / 60 mins)", subtopics: ["High level puzzles, Critical reasoning, Input-output, Coding-decoding, Computer networks/memory"] },
              { name: "General, Economy & Banking Awareness (40 Qs / 40 Marks / 35 mins)", subtopics: ["RBI monetary policy, Banking terms, Current affairs last 6 months, Financial schemes"] },
              { name: "English Language (35 Qs / 40 Marks / 40 mins)", subtopics: ["Advanced RC, Vocabulary, Column matching, Sentence connectors"] },
              { name: "Data Analysis & Interpretation (35 Qs / 60 Marks / 45 mins)", subtopics: ["Complex DIs, Probability, Permutation, Missing DI, Radar & Caselet graphs"] },
            ]
          },
          {
            name: "Descriptive English Test (25 Marks / 30 mins)",
            marks: 25,
            questions: 2,
            duration: "30 minutes",
            type: "Descriptive Typing on Computer",
            topics: [
              { name: "Essay & Letter Writing", subtopics: ["Formal/Informal Letter writing (150 words)", "Essay on socio-economic / banking topic (250 words)"] },
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "Prelims & Mains Papers", label: "IBPS PO 2024 Online Question Papers & Keys", paperUrl: "https://www.ibps.in/crp-po-mt/", answerKeyUrl: "https://www.ibps.in/crp-po-mt/", url: "https://ibps.in" },
      { year: 2023, exam: "Prelims & Mains Papers", label: "IBPS PO 2023 Online Question Papers & Keys", paperUrl: "https://www.ibps.in/crp-po-mt/", answerKeyUrl: "https://www.ibps.in/crp-po-mt/", url: "https://ibps.in" },
      { year: 2022, exam: "Prelims & Mains Papers", label: "IBPS PO 2022 Online Question Papers & Keys", paperUrl: "https://www.ibps.in/crp-po-mt/", answerKeyUrl: "https://www.ibps.in/crp-po-mt/", url: "https://ibps.in" },
      { year: 2021, exam: "Prelims & Mains Papers", label: "IBPS PO 2021 Online Question Papers & Keys", paperUrl: "https://www.ibps.in/crp-po-mt/", answerKeyUrl: "https://www.ibps.in/crp-po-mt/", url: "https://ibps.in" },
      { year: 2020, exam: "Prelims & Mains Papers", label: "IBPS PO 2020 Online Question Papers & Keys", paperUrl: "https://www.ibps.in/crp-po-mt/", answerKeyUrl: "https://www.ibps.in/crp-po-mt/", url: "https://ibps.in" },
    ],
    books: [
      { title: "Quantitative Aptitude for Banking Examinations — Sarvesh K. Verma", useFor: "Arithmetic and advanced Data Interpretation" },
      { title: "A Modern Approach to Verbal & Non-Verbal Reasoning — R.S. Aggarwal", useFor: "Puzzles and seating arrangements" },
      { title: "Banking Awareness — Arihant Experts", useFor: "Mains General and Financial Awareness" },
    ],
    youtubeQuery: "IBPS PO syllabus exam pattern previous year memory based papers",
    relatedExams: ["sbi-po", "ibps-clerk", "rbi-grade-b"],
  },

  // ────────────────────────────────────────────────────────────
  // 15. IBPS Clerk
  // ────────────────────────────────────────────────────────────
  {
    slug: "ibps-clerk",
    name: "IBPS लिपिक भरती (IBPS Clerk)",
    nameEn: "IBPS Clerical Cadre Examination",
    shortName: "IBPS Clerk",
    conductingBody: "Institute of Banking Personnel Selection (IBPS)",
    logo: "credit_card",
    color: "#0369A1",
    examLevel: "Central",
    targetPosts: ["Clerk / Customer Service Associate across Public Sector Banks in Maharashtra & India"],
    totalVacancies: "~6,128 (Annual Banking Drive)",
    applicationFee: { general: "₹850", reserved: "₹175" },
    ageLimit: { min: 20, max: 28, scStRelax: 5, obcRelax: 3 },
    eligibility: "Degree (Graduation) in any discipline. Proficiency in Official Language of State (Marathi for Maharashtra).",
    stages: ["Preliminary Examination (100 Marks)", "Main Examination (200 Marks)", "NO Interview (Final merit based on Mains)"],
    officialWebsite: "https://www.ibps.in/crp-clerical/",
    notificationUrl: "https://ibpsonline.ibps.in",
    papers: [
      {
        stage: "Preliminary Examination (100 Marks)",
        papers: [
          {
            name: "Prelims CBT (100 Marks / 60 mins)",
            marks: 100,
            questions: 100,
            duration: "60 minutes",
            type: "MCQ (Sectional Timing 20 min each)",
            topics: [
              { name: "English Language (30 Qs / 30 Marks)", subtopics: ["Reading comprehension, error detection, cloze test, fillers"] },
              { name: "Numerical Ability (35 Qs / 35 Marks)", subtopics: ["Simplification, approximation, missing series, arithmetic, basic DI"] },
              { name: "Reasoning Ability (35 Qs / 35 Marks)", subtopics: ["Puzzles, box arrangements, syllogisms, inequalities, alphanumeric series"] },
            ]
          }
        ]
      },
      {
        stage: "Main Examination (200 Marks)",
        papers: [
          {
            name: "Mains Online CBT (200 Marks / 160 mins)",
            marks: 200,
            questions: 190,
            duration: "160 minutes",
            type: "MCQ (Sectional Timing)",
            topics: [
              { name: "General/ Financial Awareness (50 Qs / 50 Marks / 35 mins)", subtopics: ["Current events, banking headquarters, monetary policy, schemes"] },
              { name: "General English (40 Qs / 40 Marks / 35 mins)", subtopics: ["Comprehension passages, idioms, sentence rearrangement"] },
              { name: "Reasoning Ability & Computer Aptitude (50 Qs / 60 Marks / 45 mins)", subtopics: ["Seating logic, coding, flowchart logic, computer hardware basics"] },
              { name: "Quantitative Aptitude (50 Qs / 50 Marks / 45 mins)", subtopics: ["Tabular DI, Bar Graph, Partnership, Profit-Loss, Time & Work"] },
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "Prelims & Mains Shifts", label: "IBPS Clerk 2024 Question Papers & Keys", paperUrl: "https://www.ibps.in/crp-clerical/", answerKeyUrl: "https://www.ibps.in/crp-clerical/", url: "https://www.ibps.in/crp-clerical/" },
      { year: 2023, exam: "Prelims & Mains Shifts", label: "IBPS Clerk 2023 Question Papers & Keys", paperUrl: "https://www.ibps.in/crp-clerical/", answerKeyUrl: "https://www.ibps.in/crp-clerical/", url: "https://www.ibps.in/crp-clerical/" },
      { year: 2022, exam: "Prelims & Mains Shifts", label: "IBPS Clerk 2022 Question Papers & Keys", paperUrl: "https://www.ibps.in/crp-clerical/", answerKeyUrl: "https://www.ibps.in/crp-clerical/", url: "https://www.ibps.in/crp-clerical/" },
      { year: 2021, exam: "Prelims & Mains Shifts", label: "IBPS Clerk 2021 Question Papers & Keys", paperUrl: "https://www.ibps.in/crp-clerical/", answerKeyUrl: "https://www.ibps.in/crp-clerical/", url: "https://www.ibps.in/crp-clerical/" },
      { year: 2020, exam: "Prelims & Mains Shifts", label: "IBPS Clerk 2020 Question Papers & Keys", paperUrl: "https://www.ibps.in/crp-clerical/", answerKeyUrl: "https://www.ibps.in/crp-clerical/", url: "https://www.ibps.in/crp-clerical/" },
    ],
    books: [
      { title: "Kiran's IBPS Clerk Prelims & Mains Solved Papers", useFor: "Previous year papers with detailed solutions" },
      { title: "Magical Book on Quicker Maths — M. Tyra", useFor: "Speed calculation and simplification" },
    ],
    youtubeQuery: "IBPS Clerk syllabus prelims mains paper cut off analysis",
    relatedExams: ["ibps-po", "sbi-po", "maharashtra-talathi"],
  },

  // ────────────────────────────────────────────────────────────
  // 16. State Bank of India PO (SBI PO)
  // ────────────────────────────────────────────────────────────
  {
    slug: "sbi-po",
    name: "SBI प्रोबेशनरी ऑफिसर (SBI PO)",
    nameEn: "State Bank of India Probationary Officer (SBI PO)",
    shortName: "SBI PO",
    conductingBody: "State Bank of India (Central Recruitment & Promotion Dept)",
    logo: "domain",
    color: "#1E40AF",
    examLevel: "Central",
    targetPosts: ["Probationary Officer (Scale I) at SBI branches pan-India"],
    totalVacancies: "~2,000 (Premier Banking Cadre)",
    applicationFee: { general: "₹750", reserved: "Free (SC/ST/PwBD)" },
    ageLimit: { min: 21, max: 30, scStRelax: 5, obcRelax: 3 },
    eligibility: "Graduation in any discipline from a recognized University (Final year/semester eligible on provisional basis).",
    stages: ["Phase-I: Preliminary Examination (100 Marks)", "Phase-II: Main Examination (200 + 50 Marks)", "Phase-III: Psychometric Test, Group Discussion (20 Marks) & Interview (30 Marks)"],
    officialWebsite: "https://sbi.co.in/web/careers/current-openings",
    notificationUrl: "https://sbi.co.in/web/careers/current-openings",
    papers: [
      {
        stage: "Phase-I Preliminary Examination",
        papers: [
          {
            name: "Prelims Online Test (100 Marks / 60 mins)",
            marks: 100,
            questions: 100,
            duration: "60 minutes",
            type: "MCQ (Sectional timing 20 min each)",
            topics: [
              { name: "English Language (30 Qs / 30 Marks)", subtopics: ["RC passages, cloze test, para jumbles, error identification"] },
              { name: "Quantitative Aptitude (35 Qs / 35 Marks)", subtopics: ["Data Interpretation, Number series, Quadratic equations, Arithmetic word problems"] },
              { name: "Reasoning Ability (35 Qs / 35 Marks)", subtopics: ["Complex seating arrangements, puzzles, syllogisms, coded inequalities"] },
            ]
          }
        ]
      },
      {
        stage: "Phase-II Main Examination (250 Marks)",
        papers: [
          {
            name: "Mains Objective Test (200 Marks / 3 hours)",
            marks: 200,
            questions: 155,
            duration: "180 minutes",
            type: "MCQ",
            topics: [
              { name: "Reasoning & Computer Aptitude (40 Qs / 50 Marks / 50 mins)", subtopics: ["High level logical puzzles, machine input, coded relations"] },
              { name: "Data Analysis & Interpretation (30 Qs / 50 Marks / 45 mins)", subtopics: ["Probability, Permutation DI, Caselet and radar chart analysis"] },
              { name: "General/Economy/Banking Awareness (50 Qs / 60 Marks / 45 mins)", subtopics: ["Banking awareness, RBI regulations, current economic affairs, digital banking"] },
              { name: "English Language (35 Qs / 40 Marks / 40 mins)", subtopics: ["Critical vocabulary, passage comprehension, advanced grammar"] },
            ]
          },
          {
            name: "Descriptive Test (50 Marks / 30 mins)",
            marks: 50,
            questions: 2,
            duration: "30 minutes",
            type: "Descriptive Typing on Computer",
            topics: [
              { name: "Letter & Essay Writing", subtopics: ["Formal/Banking letter writing (150 words)", "Analytical Essay on banking/macro-economic issue (250 words)"] },
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "Prelims & Mains Memory Papers", label: "SBI PO 2024 Question Papers & Solutions", paperUrl: "https://sbi.co.in/web/careers/current-openings", answerKeyUrl: "https://sbi.co.in/web/careers/current-openings", url: "https://bank.sbi/careers" },
      { year: 2023, exam: "Prelims & Mains Memory Papers", label: "SBI PO 2023 Question Papers & Solutions", paperUrl: "https://sbi.co.in/web/careers/current-openings", answerKeyUrl: "https://sbi.co.in/web/careers/current-openings", url: "https://bank.sbi/careers" },
      { year: 2022, exam: "Prelims & Mains Memory Papers", label: "SBI PO 2022 Question Papers & Solutions", paperUrl: "https://sbi.co.in/web/careers/current-openings", answerKeyUrl: "https://sbi.co.in/web/careers/current-openings", url: "https://bank.sbi/careers" },
      { year: 2021, exam: "Prelims & Mains Memory Papers", label: "SBI PO 2021 Question Papers & Solutions", paperUrl: "https://sbi.co.in/web/careers/current-openings", answerKeyUrl: "https://sbi.co.in/web/careers/current-openings", url: "https://bank.sbi/careers" },
      { year: 2020, exam: "Prelims & Mains Memory Papers", label: "SBI PO 2020 Question Papers & Solutions", paperUrl: "https://sbi.co.in/web/careers/current-openings", answerKeyUrl: "https://sbi.co.in/web/careers/current-openings", url: "https://bank.sbi/careers" },
    ],
    books: [
      { title: "SBI PO Phase I & II Solved Papers — Disha Experts", useFor: "Last 10 years memory based authentic papers" },
      { title: "High Level Puzzles for Banking Exams — Oliveboard / Adda247", useFor: "Mains 50 marks Reasoning section" },
    ],
    youtubeQuery: "SBI PO syllabus mains descriptive test interview preparation",
    relatedExams: ["ibps-po", "rbi-grade-b", "ibps-clerk"],
  },

  // ────────────────────────────────────────────────────────────
  // 17. RBI Grade B Officer
  // ────────────────────────────────────────────────────────────
  {
    slug: "rbi-grade-b",
    name: "रिझर्व्ह बँक ऑफ इंडिया ग्रेड बी (RBI Grade B)",
    nameEn: "RBI Grade B Officer (Direct Recruit — General)",
    shortName: "RBI Grade B",
    conductingBody: "Reserve Bank of India Services Board (RBISB)",
    logo: "monetization_on",
    color: "#0F766E",
    examLevel: "Central",
    targetPosts: ["Grade 'B' (DR) — General Cadre Officer at Reserve Bank of India"],
    totalVacancies: "~222 (Elite Central Banking Post)",
    applicationFee: { general: "₹850", reserved: "₹100" },
    ageLimit: { min: 21, max: 30, scStRelax: 5, obcRelax: 3 },
    eligibility: "Minimum 60% marks in Graduation (50% for SC/ST/PwBD) or 55% in Post-Graduation.",
    stages: ["Phase-I Online Examination (Objective - 200 Marks)", "Phase-II Online Examination (Objective + Descriptive - 300 Marks)", "Interview (75 Marks)"],
    officialWebsite: "https://www.rbi.org.in",
    notificationUrl: "https://opportunities.rbi.org.in/scripts/vacancies.aspx",
    papers: [
      {
        stage: "Phase-I Online Examination (200 Marks)",
        papers: [
          {
            name: "Phase-I Composite Paper",
            marks: 200,
            questions: 200,
            duration: "120 minutes",
            type: "MCQ (Sectional Timing)",
            topics: [
              { name: "General Awareness (80 Qs / 80 Marks / 25 mins)", subtopics: ["Banking, financial & economic news, Union Budget, Economic Survey, RBI circulars, international financial summits"] },
              { name: "Reasoning Ability (60 Qs / 60 Marks / 45 mins)", subtopics: ["High level puzzles, critical reasoning, input-output, data sufficiency"] },
              { name: "English Language (30 Qs / 30 Marks / 25 mins)", subtopics: ["Reading comprehension, vocabulary, cloze test, sentence corrections"] },
              { name: "Quantitative Aptitude (30 Qs / 30 Marks / 25 mins)", subtopics: ["Data interpretation, series, arithmetic applications, quadratic analysis"] },
            ]
          }
        ]
      },
      {
        stage: "Phase-II Online Examination (300 Marks)",
        papers: [
          {
            name: "Paper-I: Economic and Social Issues (ESI)",
            marks: 100,
            duration: "120 minutes",
            type: "50% Objective (30 mins) + 50% Descriptive (90 mins)",
            topics: [
              { name: "Growth and Development", subtopics: ["Measurement of growth, Poverty alleviation & Employment generation in India, Sustainable development"] },
              { name: "Indian Economy", subtopics: ["Monetary and Fiscal policy, Balance of Payments, Foreign trade policy, Industrial and Labour policy"] },
              { name: "Social Structure in India", subtopics: ["Multiculturalism, Demographic trends, Urbanization and Migration, Gender issues"] },
            ]
          },
          {
            name: "Paper-II: English (Writing Skills)",
            marks: 100,
            duration: "90 minutes",
            type: "Descriptive (Typed on keyboard)",
            topics: [
              { name: "Writing Skills", subtopics: ["Essay writing (300 words on contemporary economic/social topic)", "Précis writing", "Reading comprehension questions"] },
            ]
          },
          {
            name: "Paper-III: Finance and Management (F&M)",
            marks: 100,
            duration: "120 minutes",
            type: "50% Objective (30 mins) + 50% Descriptive (90 mins)",
            topics: [
              { name: "Financial System", subtopics: ["Structure and functions of financial institutions, Functions of RBI, Banking System in India, Financial Markets (Forex, Money, Bond, Equity)"] },
              { name: "General Topics in Finance", subtopics: ["Risk Management in Banking, Derivatives, Corporate Governance, Public Private Partnership, FinTech"] },
              { name: "Management", subtopics: ["Fundamentals of Management & Organizational Behaviour, Leadership styles, Motivation, Communication channels, Corporate ethics"] },
            ]
          }
        ]
      }
    ],
    pyqLinks: [
      { year: 2024, exam: "Phase I & Phase II Papers", label: "RBI Grade B 2024 Question Papers & Solutions", paperUrl: "https://opportunities.rbi.org.in/scripts/results.aspx", answerKeyUrl: "https://opportunities.rbi.org.in/scripts/results.aspx", url: "https://opportunities.rbi.org.in/scripts/results.aspx" },
      { year: 2023, exam: "Phase I & Phase II Papers", label: "RBI Grade B 2023 Question Papers & Solutions", paperUrl: "https://opportunities.rbi.org.in/scripts/results.aspx", answerKeyUrl: "https://opportunities.rbi.org.in/scripts/results.aspx", url: "https://opportunities.rbi.org.in/scripts/results.aspx" },
      { year: 2022, exam: "Phase I & Phase II Papers", label: "RBI Grade B 2022 Question Papers & Solutions", paperUrl: "https://opportunities.rbi.org.in/scripts/results.aspx", answerKeyUrl: "https://opportunities.rbi.org.in/scripts/results.aspx", url: "https://opportunities.rbi.org.in/scripts/results.aspx" },
      { year: 2021, exam: "Phase I & Phase II Papers", label: "RBI Grade B 2021 Question Papers & Solutions", paperUrl: "https://opportunities.rbi.org.in/scripts/results.aspx", answerKeyUrl: "https://opportunities.rbi.org.in/scripts/results.aspx", url: "https://opportunities.rbi.org.in/scripts/results.aspx" },
      { year: 2020, exam: "Phase I & Phase II Papers", label: "RBI Grade B 2020 Question Papers & Solutions", paperUrl: "https://opportunities.rbi.org.in/scripts/results.aspx", answerKeyUrl: "https://opportunities.rbi.org.in/scripts/results.aspx", url: "https://opportunities.rbi.org.in/scripts/results.aspx" },
    ],
    books: [
      { title: "Indian Economy — Uma Kapila / Ramesh Singh", useFor: "Paper I Economic & Social Issues (ESI)" },
      { title: "Financial Management — Prasanna Chandra", useFor: "Paper III Finance portion" },
      { title: "Organizational Behaviour — Stephen Robbins", useFor: "Paper III Management section" },
      { title: "RBI Annual Report & Bulletin (Official PDF downloads)", useFor: "Direct questions in Phase I GA and Phase II F&M" },
    ],
    youtubeQuery: "RBI Grade B syllabus phase 1 phase 2 preparation previous papers",
    relatedExams: ["upsc-cse", "sbi-po", "ibps-po"],
  },
]

// Helper: get exam by slug with verified downloadable officialPdfs only
export function getExamBySlug(slug) {
  const exam = SYLLABUS_EXAMS.find(e => e.slug === slug)
  if (!exam) return null

  // Only keep papers that actually exist in local /downloads/ or /question-papers/
  const verifiedPdfs = (exam.officialPdfs || []).filter(p =>
    p.url && (p.url.startsWith('/downloads/') || p.url.startsWith('/question-papers/mpsc/') || p.url.startsWith('/api/mpsc-pdf/'))
  )

  return {
    ...exam,
    officialPdfs: verifiedPdfs
  }
}

// Helper: get matching mock test for a syllabus exam
export function getMockTestForExam(slug) {
  const map = {
    'mpsc-combined': { slug: 'mpsc-combined-full-prelims', label: 'MPSC संयुक्त पूर्व 100-Q Mock' },
    'mpsc-psi-sti': { slug: 'mpsc-combined-full-prelims', label: 'MPSC गट-ब पूर्व 100-Q Mock' },
    'mpsc-state-services': { slug: 'mpsc-combined-full-prelims', label: 'MPSC GS Speed Mock' },
    'mpsc-group-c': { slug: 'mpsc-combined-full-prelims', label: 'MPSC गट-क CSAT & GS Mock' },
    'maharashtra-police': { slug: 'maharashtra-police-written-mock', label: 'पोलीस शिपाई 100-Q Full Mock' },
    'pune-mumbai-police-driver': { slug: 'maharashtra-police-written-mock', label: 'पोलीस चालक 100-Q Mock' },
    'maharashtra-talathi': { slug: 'maharashtra-talathi-tcs-mock', label: 'तलाठी भरती TCS 100-Q Mock' },
    'maharashtra-zp': { slug: 'maharashtra-talathi-tcs-mock', label: 'ZP भरती IBPS Mock Drill' },
    'maharashtra-nagar-parishad': { slug: 'maharashtra-talathi-tcs-mock', label: 'नगर परिषद TCS Mock Drill' },
    'ssc-cgl': { slug: 'ssc-cgl-general-awareness', label: 'SSC CGL General Awareness Mock' },
    'ssc-chsl': { slug: 'ssc-cgl-general-awareness', label: 'SSC General Awareness Drill' },
  }
  return map[slug] || null
}

// Helper: get matching syllabus for a mock test
export function getSyllabusForMockTest(test) {
  if (!test) return null
  const slug = (test.slug || '').toLowerCase()
  const examType = (test.examType || '').toLowerCase()
  const title = (test.title || '').toLowerCase()

  if (slug.includes('police') || examType.includes('police') || title.includes('police') || title.includes('पोलीस')) {
    return { slug: 'maharashtra-police', name: 'महाराष्ट्र पोलीस शिपाई भरती', path: '/syllabus/maharashtra-police' }
  }
  if (slug.includes('talathi') || examType.includes('talathi') || title.includes('talathi') || title.includes('तलाठी')) {
    return { slug: 'maharashtra-talathi', name: 'महाराष्ट्र तलाठी भरती (TCS)', path: '/syllabus/maharashtra-talathi' }
  }
  if (slug.includes('group-c') || title.includes('गट-क') || title.includes('गट क')) {
    return { slug: 'mpsc-group-c', name: 'MPSC गट-क संयुक्त परीक्षा', path: '/syllabus/mpsc-group-c' }
  }
  if (slug.includes('combined') || examType.includes('combined') || title.includes('संयुक्त')) {
    return { slug: 'mpsc-combined', name: 'MPSC संयुक्त पूर्व परीक्षा (गट-ब व क)', path: '/syllabus/mpsc-combined' }
  }
  if (slug.includes('mpsc') || examType.includes('mpsc') || title.includes('mpsc') || title.includes('राज्यसेवा')) {
    return { slug: 'mpsc-state-services', name: 'MPSC राज्यसेवा (नागरी सेवा)', path: '/syllabus/mpsc-state-services' }
  }
  if (slug.includes('ssc') || examType.includes('ssc') || title.includes('ssc')) {
    return { slug: 'ssc-cgl', name: 'SSC CGL / CHSL Examination', path: '/syllabus/ssc-cgl' }
  }
  return { slug: 'mpsc-combined', name: 'MPSC संयुक्त परीक्षा', path: '/syllabus/mpsc-combined' }
}

// Helper: match syllabus for a job notification
export function getSyllabusForJob(job) {
  if (!job) return null
  const text = `${job.title || ''} ${job.org_name || ''} ${job.org_acronym || ''}`.toLowerCase()

  if (text.includes('police driver') || text.includes('पोलीस चालक') || text.includes('srpf')) {
    return { slug: 'pune-mumbai-police-driver', name: 'महाराष्ट्र पोलीस चालक व SRPF शिपाई', path: '/syllabus/pune-mumbai-police-driver' }
  }
  if (text.includes('police') || text.includes('पोलीस') || text.includes('शिपाई')) {
    return { slug: 'maharashtra-police', name: 'महाराष्ट्र पोलीस शिपाई भरती', path: '/syllabus/maharashtra-police' }
  }
  if (text.includes('nagar parishad') || text.includes('नगर परिषद') || text.includes('mahadma') || text.includes('dma')) {
    return { slug: 'maharashtra-nagar-parishad', name: 'महाराष्ट्र नगर परिषद भरती (DMA)', path: '/syllabus/maharashtra-nagar-parishad' }
  }
  if (text.includes('arogya') || text.includes('आरोग्य') || text.includes('nurse') || text.includes('pharmacist') || text.includes('परिचारिका')) {
    return { slug: 'maharashtra-arogya-vibhag', name: 'सार्वजनिक आरोग्य विभाग भरती', path: '/syllabus/maharashtra-arogya-vibhag' }
  }
  if (text.includes('mahadiscom') || text.includes('महावितरण') || text.includes('महापारेषण') || text.includes('mahatransco')) {
    return { slug: 'mahadiscom-ae-je', name: 'महावितरण व महापारेषण AE & JE', path: '/syllabus/mahadiscom-ae-je' }
  }
  if (text.includes('krushi') || text.includes('कृषी सेवक') || text.includes('कृषी सहाय्यक')) {
    return { slug: 'krushi-sevak', name: 'कृषी सेवक व कृषी सहाय्यक भरती', path: '/syllabus/krushi-sevak' }
  }
  if (text.includes('talathi') || text.includes('तलाठी')) {
    return { slug: 'maharashtra-talathi', name: 'महाराष्ट्र तलाठी भरती', path: '/syllabus/maharashtra-talathi' }
  }
  if (text.includes('zp') || text.includes('जिल्हा परिषद') || text.includes('zilla parishad')) {
    return { slug: 'maharashtra-zp', name: 'महाराष्ट्र जिल्हा परिषद भरती', path: '/syllabus/maharashtra-zp' }
  }
  if (text.includes('गट क') || text.includes('गट-क') || text.includes('group c') || text.includes('clerk') || text.includes('लिपिक')) {
    return { slug: 'mpsc-group-c', name: 'MPSC गट-क संयुक्त परीक्षा', path: '/syllabus/mpsc-group-c' }
  }
  if (text.includes('psi') || text.includes('sti') || text.includes('aso') || text.includes('गट ब') || text.includes('गट-ब') || text.includes('संयुक्त')) {
    return { slug: 'mpsc-combined', name: 'MPSC संयुक्त पूर्व परीक्षा (गट-ब व क)', path: '/syllabus/mpsc-combined' }
  }
  if (text.includes('rajyaseva') || text.includes('राज्यसेवा') || text.includes('mpsc') || text.includes('civil services')) {
    return { slug: 'mpsc-state-services', name: 'MPSC राज्यसेवा (नागरी सेवा)', path: '/syllabus/mpsc-state-services' }
  }
  if (text.includes('ssc') || text.includes('cgl') || text.includes('chsl') || text.includes('mts')) {
    return { slug: 'ssc-cgl', name: 'SSC परीक्षा अभ्यासक्रम व पॅटर्न', path: '/syllabus/ssc-cgl' }
  }
  if (text.includes('upsc') || text.includes('ias') || text.includes('ips')) {
    return { slug: 'upsc-cse', name: 'UPSC Civil Services Examination', path: '/syllabus/upsc-cse' }
  }
  return null
}

// All exam slugs for static generation
export const ALL_EXAM_SLUGS = SYLLABUS_EXAMS.map(e => e.slug)


