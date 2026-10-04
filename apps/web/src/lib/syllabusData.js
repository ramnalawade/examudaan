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
    ageLimit: { min: 19, max: 38, scStRelax: 5, obcRelax: 3 },
    eligibility: "Graduate in any discipline from a recognized University (Final year appearing eligible for Prelims)",
    stages: ["Prelims", "Mains (Descriptive)", "Interview"],
    officialWebsite: "https://mpsc.gov.in",
    notificationUrl: "https://mpsconline.gov.in/candidate",
    papers: [
      {
        stage: "Prelims (Screening)",
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
            questions: 100,
            duration: "2 hours",
            type: "MCQ (Qualifying — 33% / 66 marks required)",
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
        stage: "Mains (Descriptive Pattern)",
        papers: [
          { name: "Paper 1: Marathi (Descriptive)", marks: 100, duration: "3 hours", type: "Descriptive (Qualifying 25%)", topics: [{ name: "Marathi Language", subtopics: ["Essay Writing (निबंध)", "Précis Writing (सारलेखन)", "Reading Comprehension", "Translation (English to Marathi)"] }] },
          { name: "Paper 2: English (Descriptive)", marks: 100, duration: "3 hours", type: "Descriptive (Qualifying 25%)", topics: [{ name: "English Language", subtopics: ["Essay Writing", "Précis Writing", "Reading Comprehension", "Translation (Marathi to English)"] }] },
          { name: "Paper 3: Essay", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Essay Topics", subtopics: ["Philosophical & Socio-cultural topics", "Economic & Political challenges in India & Maharashtra", "Science, Technology & Ethics"] }] },
          { name: "Paper 4: General Studies I", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Indian Heritage & Culture, History & Geography", subtopics: ["Maharashtra Social Reformers", "Indian National Movement", "World Geography & Geomorphic Processes", "Society and Social Structure of Maharashtra"] }] },
          { name: "Paper 5: General Studies II", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Governance, Constitution, Polity & IR", subtopics: ["Indian Constitution & Federalism", "Executive, Judiciary & Election Commission", "Role of Civil Services in Democracy", "India's Foreign Policy & Neighborhood Relations"] }] },
          { name: "Paper 6: General Studies III", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Technology, Economic Development, Environment & Security", subtopics: ["Indian & Maharashtra Economy", "Agriculture & Food Security", "Internal Security Challenges & Cyber Warfare", "Disaster Resilience & Environment"] }] },
          { name: "Paper 7: General Studies IV", marks: 250, duration: "3 hours", type: "Descriptive (Merit)", topics: [{ name: "Ethics, Integrity & Aptitude", subtopics: ["Moral Thinkers & Philosophers", "Public Service Values & Ethics", "Attitude & Emotional Intelligence", "Case Studies on Administrative dilemmas"] }] },
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
    targetPosts: ["Police Constable (शिपाई)", "Police Driver Constable (चालक)", "SRPF Armed Police Constable", "Bandsman"],
    totalVacancies: "17,471+ (Recent Mega Recruitment)",
    applicationFee: { general: "₹450", reserved: "₹350" },
    ageLimit: { min: 18, max: 28, scStRelax: 5, obcRelax: 5 },
    eligibility: "12th Standard (HSC) passed from recognized Maharashtra State Board or equivalent.",
    stages: ["Physical Endurance Test (50 Marks)", "Written Examination (100 Marks / 90 mins)", "Document Verification & Medical"],
    officialWebsite: "https://mahapolice.gov.in/citizen/recruitment.htm",
    notificationUrl: "https://policerecruitment2024.mahait.org",
    papers: [
      {
        stage: "Physical Efficiency Test (PET - 50 Marks)",
        papers: [
          {
            name: "Physical Fitness Standards",
            marks: 50,
            duration: "On ground",
            type: "Physical Events",
            topics: [
              { name: "Male Candidates (50 Marks)", subtopics: ["1600m Running (20 Marks)", "100m Sprint (15 Marks)", "Shot Put 7.26 kg (15 Marks)", "Min Height: 165 cm, Chest: 79 cm (unexpanded) / 84 cm (expanded)"] },
              { name: "Female Candidates (50 Marks)", subtopics: ["800m Running (20 Marks)", "100m Sprint (15 Marks)", "Shot Put 4 kg (15 Marks)", "Min Height: 158 cm"] },
            ]
          }
        ]
      },
      {
        stage: "Written Examination (100 Marks)",
        papers: [
          {
            name: "Written Test (OMR / CBT)",
            marks: 100,
            questions: 100,
            duration: "90 minutes",
            type: "MCQ (Marathi Medium)",
            topics: [
              { name: "Mathematics & Arithmetic (अंकगणित)", subtopics: ["लसावि-मसावि (LCM/HCF)", "काळ, काम, वेग", "शेकडेवारी व नफा-तोटा", "दशांश अपूर्णांक", "सरळव्याज व चक्रवाढ व्याज"] },
              { name: "General Knowledge & Current Affairs (सामान्य ज्ञान)", subtopics: ["महाराष्ट्राचा इतिहास व समाजसुधारक", "जिल्हा विशेष माहिती (District GK)", "महाराष्ट्र भूगोल व नद्या", "पोलीस प्रशासन व पदरचना", "चालू घडामोडी (क्रीडा, पुरस्कार)"] },
              { name: "Mental Ability & Reasoning (बुद्धिमत्ता चाचणी)", subtopics: ["संख्या मालिका व अक्षर मालिका", "दिशाज्ञान व घड्याळ", "नातेसंबंध", "वेन आकृत्या व कूट प्रश्न"] },
              { name: "Marathi Grammar (मराठी व्याकरण)", subtopics: ["समानार्थी व विरुद्धार्थी शब्द", "लिंग, वचन व विभक्ती", "काळ व त्याचे प्रकार", "वाक्यप्रचार व म्हणी", "शुद्धलेखन नियम"] },
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
      { title: "जिल्हा विशेष सामान्य ज्ञान पुस्तिका", useFor: "District police specific general knowledge" },
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
    stages: ["MPSC Gazetted Combined Prelims", "Vanseva Mains Exam (400 Marks)", "Walking Physical Test (25 km / 16 km)", "Interview (50 Marks)"],
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
  // 9. UPSC Civil Services Examination (IAS / IPS)
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

// Helper: get exam by slug
export function getExamBySlug(slug) {
  return SYLLABUS_EXAMS.find(e => e.slug === slug) || null
}

// All exam slugs for static generation
export const ALL_EXAM_SLUGS = SYLLABUS_EXAMS.map(e => e.slug)
