// ============================================================================
// lib/careerGuideData.js — Comprehensive Stream & Career Decision Engine
// ExamUdaan.in — Deep Educational Guidance for 10th & 12th Students
// Covers: Science, Commerce, Arts/Humanities, Vocational/Diploma
// Detailed: Key Subjects, Entrance Exams, Salary Ladders, Tech Stacks, Scope,
//           Top Colleges (Maharashtra & India), Official External Links, Roadmap,
//           Live Verified Exam Dates & Cycles, Detailed Portion / Syllabus
// Total Careers: 50 Comprehensive Pathways
// ============================================================================

export const STREAMS = [
  {
    "id": "science",
    "name": "Science (11th & 12th PCM / PCB / PCMB)",
    "shortName": "Science",
    "icon": "🔬",
    "tagline": "Engineering, Medicine, Pure Science, Aviation, Software & Space Technology",
    "color": "#0284c7",
    "badgeBg": "#e0f2fe",
    "eligibility10th": "Minimum 60% in 10th Board with Strong aptitude in Mathematics and General Science.",
    "combinations": [
      {
        "code": "PCM",
        "subjects": "Physics, Chemistry, Mathematics",
        "bestFor": "Engineering, Architecture, BCA, Pilot, Defense, Pure Math"
      },
      {
        "code": "PCB",
        "subjects": "Physics, Chemistry, Biology",
        "bestFor": "MBBS, BDS, BAMS, BHMS, Pharmacy, Nursing, Biotech, Forensic"
      },
      {
        "code": "PCMB",
        "subjects": "Physics, Chemistry, Maths & Biology",
        "bestFor": "Dual eligibility for both Engineering and Medical fields"
      }
    ],
    "categories": [
      {
        "id": "sci_eng",
        "name": "Engineering & Technology",
        "icon": "💻"
      },
      {
        "id": "sci_med",
        "name": "Medical & Healthcare",
        "icon": "🩺"
      },
      {
        "id": "sci_pure",
        "name": "Pure Sciences & Research",
        "icon": "🧪"
      },
      {
        "id": "sci_cs",
        "name": "Computer Applications & IT",
        "icon": "🖥️"
      },
      {
        "id": "sci_arch_aviation",
        "name": "Architecture, Aviation & Defense",
        "icon": "✈️"
      },
      {
        "id": "sci_teach",
        "name": "Science Teaching & Academia",
        "icon": "👨‍🏫"
      }
    ]
  },
  {
    "id": "commerce",
    "name": "Commerce (11th & 12th with / without Maths)",
    "shortName": "Commerce",
    "icon": "💼",
    "tagline": "Chartered Accountancy, Banking, FinTech, Corporate Law, Management & Stock Markets",
    "color": "#059669",
    "badgeBg": "#d1fae5",
    "eligibility10th": "Minimum 50% in 10th Board. Strong interest in numbers, business, economics & data analysis.",
    "combinations": [
      {
        "code": "Commerce + Maths",
        "subjects": "Accounts, Economics, Bookkeeping, Mathematics & Stats",
        "bestFor": "CA, Actuarial Science, Investment Banking, IIM IPMAT, B.Com Hons"
      },
      {
        "code": "Commerce + SP",
        "subjects": "Accounts, Economics, Secretarial Practice (SP), Org of Commerce",
        "bestFor": "CS (Company Secretary), BBA, Corporate Law, General Banking"
      }
    ],
    "categories": [
      {
        "id": "com_prof",
        "name": "Elite Professional Certifications (CA / CS / CMA)",
        "icon": "📜"
      },
      {
        "id": "com_bank_fin",
        "name": "Banking, Finance & Stock Markets",
        "icon": "📈"
      },
      {
        "id": "com_mgmt",
        "name": "Management & Business Leadership (BBA / MBA)",
        "icon": "🏢"
      },
      {
        "id": "com_law_tax",
        "name": "Corporate Law & Taxation",
        "icon": "⚖️"
      },
      {
        "id": "com_acad",
        "name": "Academic Commerce & Teaching",
        "icon": "🎓"
      }
    ]
  },
  {
    "id": "arts",
    "name": "Arts & Humanities (11th & 12th)",
    "shortName": "Arts / Humanities",
    "icon": "🎨",
    "tagline": "Civil Services (IAS/IPS/MPSC), 5-Yr Law, Psychology, Journalism, Design & Diplomacy",
    "color": "#d97706",
    "badgeBg": "#fef3c7",
    "eligibility10th": "Open to all 10th pass students. Ideal for critical thinkers, writers, social observers & future leaders.",
    "combinations": [
      {
        "code": "Social Sciences",
        "subjects": "History, Political Science, Geography, Sociology, Economics",
        "bestFor": "UPSC Civil Services, MPSC State Services, Public Policy, Academics"
      },
      {
        "code": "Behavioral & Legal",
        "subjects": "Psychology, Logic/Philosophy, Political Science, English Lit",
        "bestFor": "5-Year BA LLB (CLAT), Clinical Psychology, Counselling"
      },
      {
        "code": "Media & Creative",
        "subjects": "Mass Comm, Literature, Fine Arts, Multimedia, Sociology",
        "bestFor": "Journalism, Fashion Design (NIFT), UI/UX (NID), Digital Media"
      }
    ],
    "categories": [
      {
        "id": "arts_civil",
        "name": "Civil Services & Public Administration",
        "icon": "🏛️"
      },
      {
        "id": "arts_law",
        "name": "Law & Judicial Services",
        "icon": "⚖️"
      },
      {
        "id": "arts_psych",
        "name": "Psychology & Mental Health",
        "icon": "🧠"
      },
      {
        "id": "arts_media",
        "name": "Media, Journalism & Communications",
        "icon": "📰"
      },
      {
        "id": "arts_design",
        "name": "Design, Fine Arts & Creative Industries",
        "icon": "🎨"
      },
      {
        "id": "arts_lang_acad",
        "name": "Languages, Teaching & Social Development",
        "icon": "🌍"
      }
    ]
  },
  {
    "id": "vocational",
    "name": "Vocational, Polytechnic & ITI Trades",
    "shortName": "Polytechnic & ITI",
    "icon": "⚙️",
    "tagline": "Practical Skill Certifications, Direct Lateral Entry B.Tech, Railway & Junior Engineer Jobs",
    "color": "#7c3aed",
    "badgeBg": "#ede9fe",
    "eligibility10th": "Class 10th pass with Science and Mathematics. Immediate industry-readiness within 2-3 years.",
    "combinations": [
      {
        "code": "Polytechnic Diploma",
        "subjects": "3-Year Technical Diploma in Mechanical, Electrical, Civil, Computer",
        "bestFor": "Direct 2nd Year B.Tech Admission / PWD Junior Engineer"
      },
      {
        "code": "ITI Certifications",
        "subjects": "1-2 Year Industrial Trades (Electrician, Fitter, Machinist, COPA)",
        "bestFor": "Railway Assistant Loco Pilot (RRB ALP), Defense Ordnance, PSU Technician"
      }
    ],
    "categories": [
      {
        "id": "voc_diploma",
        "name": "Polytechnic Engineering Diplomas & Degree Ladders",
        "icon": "🔧"
      },
      {
        "id": "voc_iti",
        "name": "ITI Industrial Trades & Railways",
        "icon": "🛠️"
      }
    ]
  }
];

export const CAREER_PATHS = [
  {
    "id": "cs-it-engineering",
    "streamId": "science",
    "categoryId": "sci_eng",
    "title": "Computer Science & IT Engineer (B.Tech / B.E.)",
    "role": "Software Architect, Full-Stack Developer, Cloud Engineer & DevOps Specialist",
    "min12thStream": "12th Science with PCM (Physics, Chemistry, Maths)",
    "keySubjectsToScore": [
      {
        "subject": "Mathematics",
        "minScore": "80%+",
        "reason": "Calculus, Discrete Maths, Linear Algebra and Probability form the bedrock of algorithms and data structures."
      },
      {
        "subject": "Physics",
        "minScore": "70%+",
        "reason": "Required for semiconductor logic, signal processing, and entrance exam percentiles."
      },
      {
        "subject": "Computer Science / IT (Optional)",
        "minScore": "80%+",
        "reason": "Gives huge advantage in C++, Python, OOPs and college entrance counseling."
      }
    ],
    "entranceExams": [
      {
        "name": "JEE Main",
        "body": "National Testing Agency (NTA)",
        "level": "All India",
        "mode": "Online CBT (Twice a year)",
        "website": "https://jeemain.nta.nic.in"
      },
      {
        "name": "JEE Advanced",
        "body": "IITs (Joint Admission Board)",
        "level": "National (For IITs)",
        "mode": "Online CBT",
        "website": "https://jeeadv.ac.in"
      },
      {
        "name": "MHT-CET (PCM)",
        "body": "State CET Cell Maharashtra",
        "level": "State (COEP, VJTI, SPIT)",
        "mode": "Online CBT (May-June)",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "BITS-HD / BITSAT",
        "body": "BITS Pilani",
        "level": "Private Elite",
        "mode": "Online CBT",
        "website": "https://www.bitsadmission.com"
      }
    ],
    "salaryLadder": {
      "entry": "₹6.5 Lakhs – ₹18 Lakhs / year",
      "mid": "₹20 Lakhs – ₹45 Lakhs / year (3–7 yrs)",
      "senior": "₹50 Lakhs – ₹1.2 Crore+ / year (8+ yrs / US Remote / Staff Engineer)",
      "highestPaying": "Product MNCs (Google, Microsoft, Amazon), FinTech (Tower Research, Graviton), Global Cloud Providers"
    },
    "scopeAndFuture": {
      "rating": "5/5 (Highest Global Demand)",
      "summary": "With generative AI, cloud computing, and cybersecurity expanding exponentially, software engineers with strong algorithmic and system design capabilities remain among the highest paid professionals worldwide.",
      "aiImpact": "Augmented: AI writes boilerplate code, but high-level system architecture, security, distributed systems, and product innovation require human engineers.",
      "growthSectors": [
        "Cloud Architecture (AWS/GCP/Azure)",
        "Autonomous Systems",
        "FinTech Low-Latency Trading",
        "Cyber Defense"
      ]
    },
    "techStackAndSkills": [
      "Languages: Python, Java, C++, TypeScript, Go, Rust",
      "Frameworks: React, Next.js, Node.js, Spring Boot, FastAPI",
      "Cloud & DevOps: Docker, Kubernetes, AWS, Terraform, CI/CD pipelines",
      "Databases: PostgreSQL, Redis, MongoDB, Apache Kafka"
    ],
    "stepByStepRoadmap": [
      "Class 10: Score 75%+ with focus on Mathematics fundamentals.",
      "Class 11–12: Choose PCM stream. Start rigorous preparation for JEE Main & MHT-CET.",
      "Entrance: Score 98%+ percentile in MHT-CET or 95%+ in JEE Main.",
      "Graduation: 4-Year B.Tech / B.E. in Computer Science / IT / AI-DS.",
      "During College: Build GitHub projects, solve 300+ LeetCode problems, complete 2 paid internships.",
      "Campus Placements: Crack product company interviews in 7th/8th semester or pursue M.S. abroad."
    ],
    "topColleges": [
      {
        "name": "COEP Technological University, Pune",
        "location": "Pune, Maharashtra",
        "type": "State Govt Autonomous"
      },
      {
        "name": "VJTI (Veermata Jijabai Technological Institute)",
        "location": "Mumbai, Maharashtra",
        "type": "State Govt Autonomous"
      },
      {
        "name": "IIT Bombay (Indian Institute of Technology)",
        "location": "Powai, Mumbai",
        "type": "Premier Institute of National Importance"
      },
      {
        "name": "SPIT (Sardar Patel Institute of Technology)",
        "location": "Andheri, Mumbai",
        "type": "Autonomous College"
      },
      {
        "name": "PICT (Pune Institute of Computer Technology)",
        "location": "Dhankawadi, Pune",
        "type": "Top Tech Specialist"
      }
    ],
    "externalWebsites": [
      {
        "title": "NTA JEE Main Official Portal",
        "url": "https://jeemain.nta.nic.in",
        "note": "Exam dates, eligibility, syllabus & admit cards"
      },
      {
        "title": "Maharashtra State CET Cell",
        "url": "https://cetcell.mahacet.org",
        "note": "Centralised Admission Process (CAP) for COEP, VJTI"
      },
      {
        "title": "JoSAA Counselling Portal",
        "url": "https://josaa.nic.in",
        "note": "Admission seat allocation for IITs, NITs, IIITs"
      },
      {
        "title": "LeetCode & GitHub",
        "url": "https://leetcode.com",
        "note": "Industry standard for technical interview preparation"
      }
    ],
    "govtExamSynergy": {
      "jobs": "ISRO Scientist/Engineer SC, DRDO Scientist B, NIC Scientist, BARC Scientific Officer, Railway Junior Engineer (IT).",
      "examUdaanLink": "/jobs?q=computer",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "JEE Main Session 1: January | Session 2: April | MHT-CET (PCM): April-May | GATE CS: Early February | Results & JoSAA / CAP: June-July.",
    "portionAndSyllabus": [
      "Mathematics (Class 11 & 12): Calculus (Differential & Integral), Coordinate Geometry, Vectors & 3D, Matrices & Determinants, Probability.",
      "Physics: Mechanics, Electrodynamics, Modern Physics, Optics, Thermodynamics.",
      "Chemistry: Physical Chemistry (Equilibrium, Electrochemistry), Organic Chemistry Mechanisms, Inorganic Coordination Compounds."
    ],
    "examPatternSummary": "JEE Main: 75 Questions, 300 Marks, 3 Hours (+4, -1). MHT-CET: 150 Questions, 200 Marks (Math 100 + Phy/Chem 100), No Negative Marking."
  },
  {
    "id": "mechanical-engineering",
    "streamId": "science",
    "categoryId": "sci_eng",
    "title": "Mechanical & Automobile Engineer (B.Tech / B.E.)",
    "role": "Product Design Engineer, EV Powertrain Specialist, Thermal & Robotics Engineer",
    "min12thStream": "12th Science with PCM (Physics, Chemistry, Maths)",
    "keySubjectsToScore": [
      {
        "subject": "Physics (Mechanics & Thermodynamics)",
        "minScore": "75%+",
        "reason": "Newtonian mechanics, fluids, heat transfer and energy conservation are 80% of mechanical engineering."
      },
      {
        "subject": "Mathematics (Calculus & Vectors)",
        "minScore": "75%+",
        "reason": "Finite Element Analysis (FEA) and Computational Fluid Dynamics (CFD) require intense calculus."
      }
    ],
    "entranceExams": [
      {
        "name": "JEE Main & Advanced",
        "body": "NTA / IITs",
        "level": "National",
        "mode": "Online CBT",
        "website": "https://jeemain.nta.nic.in"
      },
      {
        "name": "MHT-CET (PCM)",
        "body": "State CET Cell",
        "level": "Maharashtra",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "GATE (For M.Tech & PSU Jobs)",
        "body": "IITs (Post-Degree)",
        "level": "National (PSU Recruiter)",
        "website": "https://gate2026.iit.ac.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹4.5 Lakhs – ₹9 Lakhs / year",
      "mid": "₹12 Lakhs – ₹25 Lakhs / year (3–7 yrs)",
      "senior": "₹30 Lakhs – ₹65 Lakhs / year (Design Heads, EV Directors, Aerospace Leads)",
      "highestPaying": "Electric Vehicle MNCs (Tesla, Tata Motors EV, Ather), Aerospace (Boeing, Airbus, ISRO), Oil & Energy (L&T, Shell)"
    },
    "scopeAndFuture": {
      "rating": "4.5/5 (Massive resurgence via EV, Robotics & Defense Manufacturing)",
      "summary": "With Make-in-India, Electric Vehicles (EV), Drone manufacturing, and Defense indigenization, mechanical engineers skilled in mechatronics, CAD/FEA, and battery thermal management are in high demand.",
      "aiImpact": "Augmented: AI optimizes generative CAD design, but physical prototyping, CNC manufacturing, and structural stress validation require mechanical specialists.",
      "growthSectors": [
        "EV Battery & Motor Design",
        "Aerospace Structural Engineering",
        "Industrial Robotics & Automation",
        "Green Hydrogen Technologies"
      ]
    },
    "techStackAndSkills": [
      "CAD Modeling: SolidWorks, CATIA, PTC Creo, AutoCAD",
      "Simulation & FEA: ANSYS Fluent, Abaqus, HyperMesh, MATLAB Simulink",
      "Manufacturing: GD&T, 3D Printing (Additive Mfg), CNC Programming, Mechatronics"
    ],
    "stepByStepRoadmap": [
      "Class 10 & 12: Score strong marks in Physics Mechanics and Mathematics.",
      "Crack Entrance: Target COEP, VJTI, or Top NITs/IITs via MHT-CET / JEE.",
      "Graduation: 4-Year B.Tech in Mechanical Engineering.",
      "Specialization: Participate in Formula Student (BAJA SAE / SUPRA), learn ANSYS & SolidWorks.",
      "Career Choice: (A) Campus placement in Core Auto/Aerospace MNCs, (B) Crack GATE exam for IOCL/ONGC/BHEL PSU job, (C) M.Tech in Mechatronics/Robotics."
    ],
    "topColleges": [
      {
        "name": "COEP Technological University, Pune",
        "location": "Pune (Renowned Mechanical Dept)",
        "type": "State Govt"
      },
      {
        "name": "VJTI Mumbai",
        "location": "Matunga, Mumbai",
        "type": "State Govt"
      },
      {
        "name": "IIT Bombay",
        "location": "Powai, Mumbai",
        "type": "National Premier"
      },
      {
        "name": "Walchand College of Engineering",
        "location": "Sangli, Maharashtra",
        "type": "Govt Aided Autonomous"
      }
    ],
    "externalWebsites": [
      {
        "title": "SAE India (Society of Automotive Engineers)",
        "url": "https://saeindia.org",
        "note": "Collegiate competitions (BAJA, Formula Bharat)"
      },
      {
        "title": "GATE Official Committee",
        "url": "https://gate.iitk.ac.in",
        "note": "Gateway to BHEL, IOCL, ONGC, ISRO group A officer posts"
      },
      {
        "title": "DTE Maharashtra Technical Portal",
        "url": "https://dte.maharashtra.gov.in",
        "note": "Engineering admission notifications and seat matrices"
      }
    ],
    "govtExamSynergy": {
      "jobs": "UPSC Indian Engineering Services (IES), Mahatransco/MSEDCL Junior Engineer, PWD Assistant Engineer (Mech), Indian Railways Loco/Workshop JE.",
      "examUdaanLink": "/jobs?q=mechanical",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "MHT-CET (PCM): April-May | JEE Main: Jan & Apr | GATE ME: 1st/2nd weekend of February | PSU recruitments: March-July.",
    "portionAndSyllabus": [
      "Engineering Mechanics, Strength of Materials (SOM), Theory of Machines & Vibrations.",
      "Thermal & Fluid Engineering: Thermodynamics, IC Engines, Refrigeration, Fluid Mechanics & Heat Transfer.",
      "Manufacturing & Industrial: Metrology, Metal Cutting, CNC Machining, CAD/CAM, Robotics & Industry 4.0."
    ],
    "examPatternSummary": "MHT-CET: 150 Qs, 200 Marks, 3 Hours, No Negative. GATE ME: 65 Qs, 100 Marks (Aptitude 15 + Engineering Math 13 + Subject 72), 3 Hours."
  },
  {
    "id": "doctor-mbbs-md-ms",
    "streamId": "science",
    "categoryId": "sci_med",
    "title": "Doctor of Medicine (MBBS → MD / MS)",
    "role": "Physician, Surgeon, Cardiologist, Pediatrician & Hospital Consultant",
    "min12thStream": "12th Science with PCB (Physics, Chemistry, Biology & English)",
    "keySubjectsToScore": [
      {
        "subject": "Biology (Botany & Zoology)",
        "minScore": "90%+",
        "reason": "Accounts for 50% of the entire NEET-UG paper (360 out of 720 marks). Must memorize NCERT thoroughly."
      },
      {
        "subject": "Chemistry (Organic & Physical)",
        "minScore": "80%+",
        "reason": "High-yield scoring section in NEET. Crucial for biochemistry and pharmacology in medical school."
      },
      {
        "subject": "Physics",
        "minScore": "75%+",
        "reason": "The rank-determining section in NEET. Medical aspirants who score 140+ in Physics secure top govt colleges."
      }
    ],
    "entranceExams": [
      {
        "name": "NEET-UG (National Eligibility cum Entrance Test)",
        "body": "NTA",
        "level": "National (Only single exam for MBBS)",
        "mode": "Pen-and-Paper OMR",
        "website": "https://neet.nta.nic.in"
      },
      {
        "name": "NEET-PG / NExT (National Exit Test)",
        "body": "National Medical Commission (NMC)",
        "level": "Post-MBBS Licensure & MD/MS entrance",
        "mode": "Online CBT",
        "website": "https://natboard.edu.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹9 Lakhs – ₹15 Lakhs / year (Junior Resident / Medical Officer)",
      "mid": "₹22 Lakhs – ₹45 Lakhs / year (MD/MS Specialist / Senior Consultant)",
      "senior": "₹60 Lakhs – ₹2 Crore+ / year (Super-specialist Surgeon, Private Practice, Hospital Director)",
      "highestPaying": "Cardiothoracic Surgery, Neurosurgery, Radiology, Interventional Cardiology, Oncology"
    },
    "scopeAndFuture": {
      "rating": "5/5 (Recession-Proof & Eternal Nobility)",
      "summary": "Healthcare demand is permanent and rising with India’s aging demographic. Doctors possess supreme social status, financial stability, and global mobility.",
      "aiImpact": "Completely Safe & Collaborative: AI assists in diagnostic radiology and robotic surgery, but clinical empathy, patient examination, surgical judgment, and emergency ethics can never be replaced.",
      "growthSectors": [
        "Minimally Invasive Robotic Surgery",
        "Genomic Medicine",
        "Critical Care & Emergency",
        "Tele-Medicine Networks"
      ]
    },
    "techStackAndSkills": [
      "Clinical Diagnostic Reasoning & Bedside Manner",
      "Electronic Health Records (EHR) & Diagnostic Imaging (MRI/CT/USG)",
      "Surgical Precision, Suturing, Laparoscopy & Life Support Protocols (BLS/ACLS)",
      "Medical Ethics & Pharmacology Toxicology"
    ],
    "stepByStepRoadmap": [
      "Class 10: Score 80%+; develop strong interest in Human Biology.",
      "Class 11–12: PCB Stream. Dedicate 2 full years to mastering NCERT Biology, Chemistry & Physics.",
      "NEET-UG: Score 640+ out of 720 to secure a subsidized Government Medical College (GMC) seat in Maharashtra or All-India Quota.",
      "MBBS Degree: 4.5 years of rigorous academic training covering 19 subjects + 1 Year Mandatory Compulsory Rotatory Internship.",
      "NEET-PG / NExT: Appear for PG entrance to secure 3-Year MD (Medicine/Pediatrics/Radiology) or MS (General Surgery/Orthopedics).",
      "Specialist Practice: 3-Year DM / M.Ch super-specialization or establish private nursing home / hospital attachment."
    ],
    "topColleges": [
      {
        "name": "AIIMS New Delhi (All India Institute of Medical Sciences)",
        "location": "New Delhi",
        "type": "Apex Medical Institute of India"
      },
      {
        "name": "Grant Government Medical College & Sir JJ Group of Hospitals",
        "location": "Byculla, Mumbai",
        "type": "Historic Premier Govt College"
      },
      {
        "name": "BJ Government Medical College",
        "location": "Pune, Maharashtra",
        "type": "Top State Medical Institute"
      },
      {
        "name": "AFMC (Armed Forces Medical College)",
        "location": "Pune, Maharashtra",
        "type": "Defense Ministry Medical Service"
      },
      {
        "name": "GSMC & KEM Hospital (Seth GS Medical College)",
        "location": "Parel, Mumbai",
        "type": "Municipal Corporation Elite Hospital"
      }
    ],
    "externalWebsites": [
      {
        "title": "National Medical Commission (NMC)",
        "url": "https://www.nmc.org.in",
        "note": "Official doctor registration, curriculum & college recognition"
      },
      {
        "title": "NTA NEET-UG Portal",
        "url": "https://neet.nta.nic.in",
        "note": "Online application, syllabus, admit card & answer keys"
      },
      {
        "title": "Medical Counselling Committee (MCC)",
        "url": "https://mcc.nic.in",
        "note": "15% All India Quota & Deemed University counseling"
      },
      {
        "title": "DMER Maharashtra Health Sciences",
        "url": "https://www.med-edu.in",
        "note": "85% Maharashtra state quota counseling"
      }
    ],
    "govtExamSynergy": {
      "jobs": "UPSC Combined Medical Services (CMS) — Central Health Services, Maharashtra DMER Medical Officer (Class-1 Gazetted), Military Medical Cadre (Captain), Railways Assistant Divisional Medical Officer (ADMO).",
      "examUdaanLink": "/jobs?q=medical",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "NEET UG: Registration Feb-March | Exam: First Sunday of May | Results: June | MCC Central 15% & Maha CET Cell 85% Counseling: July-September.",
    "portionAndSyllabus": [
      "Biology (Botany & Zoology): Human Physiology, Genetics & Evolution, Cell Structure, Plant Physiology, Biotechnology, Ecology & Environment.",
      "Physics: Laws of Motion, Work Energy Power, Gravitation, Thermodynamics, Electromagnetism, Optics, Dual Nature of Matter.",
      "Chemistry: Chemical Bonding, Thermodynamics, Organic Reaction Mechanisms (Aldehydes, Ketones, Amines), Biomolecules, Coordination Compounds."
    ],
    "examPatternSummary": "NEET UG: 200 Qs (Attempt 180), 720 Marks (Bio 360, Chem 180, Phy 180), 3 Hours 20 Mins. Marking: +4 for correct, -1 for incorrect."
  },
  {
    "id": "bds-dentistry",
    "streamId": "science",
    "categoryId": "sci_med",
    "title": "Dentist (BDS → MDS — Dental Surgery)",
    "role": "Orthodontist, Prosthodontist, Oral & Maxillofacial Surgeon, Aesthetic Cosmetic Dentist",
    "min12thStream": "12th Science with PCB (Physics, Chemistry, Biology)",
    "keySubjectsToScore": [
      {
        "subject": "Biology",
        "minScore": "80%+",
        "reason": "Oral anatomy, histology, microbiology, and physiology are derived from core biology."
      },
      {
        "subject": "Chemistry",
        "minScore": "75%+",
        "reason": "Dental materials, metallurgy, polymers and local anesthetics require solid chemical foundation."
      }
    ],
    "entranceExams": [
      {
        "name": "NEET-UG",
        "body": "NTA",
        "level": "National",
        "mode": "Pen-and-Paper OMR",
        "website": "https://neet.nta.nic.in"
      },
      {
        "name": "NEET-MDS",
        "body": "NBE (National Board of Examinations)",
        "level": "Post-BDS Master Degree",
        "mode": "Online CBT",
        "website": "https://natboard.edu.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹4.5 Lakhs – ₹8 Lakhs / year (Associate Dentist in clinic)",
      "mid": "₹12 Lakhs – ₹25 Lakhs / year (MDS Specialist / Established Clinic)",
      "senior": "₹35 Lakhs – ₹75 Lakhs+ / year (Cosmetic Dental Studio / Oral Implantology / Chain Owner)",
      "highestPaying": "Oral & Maxillofacial Surgery, Orthodontics (Invisible aligners/braces), Dental Implantology"
    },
    "scopeAndFuture": {
      "rating": "4/5 (Booming in Cosmetic & Aesthetic Dentistry)",
      "summary": "With rising awareness of facial aesthetics, clear aligners (Invisalign), smile designing, and dental implants, private dental practice offers fantastic work-life balance (no midnight emergency duties) and immense entrepreneurship scope.",
      "aiImpact": "Safe: 3D intraoral scanning and CAD/CAM milling are adopted by dentists, increasing clinic productivity.",
      "growthSectors": [
        "Digital Smile Design",
        "Pediatric Dentistry",
        "Maxillofacial Facial Trauma Reconstructive Surgery",
        "Dental Tourism in India"
      ]
    },
    "techStackAndSkills": [
      "Intraoral 3D Scanners & Cone Beam Computed Tomography (CBCT)",
      "CAD/CAM Ceramic Crown Milling & 3D Printed Surgical Guides",
      "Rotary Endodontics (Painless Root Canal Treatments)",
      "Micro-surgical hand-eye dexterity and patient chairside comfort"
    ],
    "stepByStepRoadmap": [
      "Class 12: PCB stream with competitive NEET-UG score (typically 500-600 marks for govt dental seats).",
      "Undergraduate: 4-Year BDS academic course + 1-Year Paid Rotatory Internship.",
      "Registration: Register with State Dental Council (Maharashtra Dental Council).",
      "Clinical Training: Work 1-2 years under senior dental surgeons or clear NEET-MDS for 3-year Master of Dental Surgery.",
      "Practice: Setup independent high-tech dental clinic or join corporate chains (Apollo White Dental, Clove Dental)."
    ],
    "topColleges": [
      {
        "name": "Government Dental College & Hospital (GDCH), Mumbai",
        "location": "CSMT, Mumbai",
        "type": "Oldest & Best Dental College in Maharashtra"
      },
      {
        "name": "Government Dental College, Nagpur",
        "location": "Nagpur",
        "type": "Premier Govt Dental"
      },
      {
        "name": "Maulana Azad Institute of Dental Sciences (MAIDS)",
        "location": "New Delhi",
        "type": "Rank #1 Dental College in India (NIRF)"
      },
      {
        "name": "Dr. D. Y. Patil Dental College & Hospital",
        "location": "Pimpri, Pune",
        "type": "Top Deemed University"
      }
    ],
    "externalWebsites": [
      {
        "title": "Dental Council of India (DCI)",
        "url": "https://dciindia.gov.in",
        "note": "Apex regulatory body for BDS and MDS in India"
      },
      {
        "title": "Maharashtra Dental Council",
        "url": "https://mahadentalcouncil.org",
        "note": "State licensure and practicing certificates"
      },
      {
        "title": "NBE NEET-MDS Information",
        "url": "https://natboard.edu.in",
        "note": "Official postgraduate entrance notices"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Maharashtra Public Health Dept Dental Surgeon (Class-2), Army Dental Corps (Captain rank via direct interview), Railway Dental Officer.",
      "examUdaanLink": "/jobs?q=dental",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "NEET UG: First Sunday of May | Maharashtra CET Cell State Dental Counseling: July-August.",
    "portionAndSyllabus": [
      "Complete Class 11 & 12 NCERT Core Biology, Physics & Chemistry.",
      "Key Emphasis: Human Anatomy & Physiology, Genetics, Biomolecules, Oral Microflora basics."
    ],
    "examPatternSummary": "NEET UG: 720 Marks. Cutoff for Government Dental College (GDC Mumbai & Nagpur) typically 540–580 marks."
  },
  {
    "id": "bams-ayurveda",
    "streamId": "science",
    "categoryId": "sci_med",
    "title": "Ayurvedic Medical Doctor (BAMS → MD / MS Ayurveda)",
    "role": "Ayurvedic Physician, Panchakarma Specialist, Shalya Tantra (Ayurvedic Surgeon), Wellness Entrepreneur",
    "min12thStream": "12th Science with PCB + Sanskrit preference in 10th/12th",
    "keySubjectsToScore": [
      {
        "subject": "Biology",
        "minScore": "75%+",
        "reason": "Human anatomy, pathology and botanical herbal pharmacology are interconnected."
      },
      {
        "subject": "Sanskrit (Optional in 10th/12th)",
        "minScore": "60%+",
        "reason": "First-year BAMS syllabus includes Charaka Samhita and Sushruta Samhita in original Sanskrit shlokas."
      }
    ],
    "entranceExams": [
      {
        "name": "NEET-UG",
        "body": "NTA",
        "level": "National (Common exam with MBBS/BDS)",
        "mode": "Pen-and-Paper OMR",
        "website": "https://neet.nta.nic.in"
      },
      {
        "name": "AIAPGET (All India AYUSH Post Graduate Entrance)",
        "body": "NTA",
        "level": "Post-BAMS MD/MS Entrance",
        "mode": "Online CBT",
        "website": "https://aiapget.nta.nic.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹4.5 Lakhs – ₹8.5 Lakhs / year (Ayush Medical Officer / Junior Resident)",
      "mid": "₹12 Lakhs – ₹24 Lakhs / year (MD Ayurveda Consultant / Established Clinic)",
      "senior": "₹30 Lakhs – ₹65 Lakhs+ / year (Panchakarma Resort Owner, International Ayurvedic Consultant, Pharma Founder)",
      "highestPaying": "Shalya Tantra (Ayurvedic Anorectal Surgery — Ksharsutra), Panchakarma Detoxification, Infertility Care"
    },
    "scopeAndFuture": {
      "rating": "4.5/5 (Exploding Global Wellness & Ministry of AYUSH Support)",
      "summary": "With massive government backing via Ministry of AYUSH, national health mission integration, and global demand for natural healing, BAMS doctors hold equal prescribing rights in Maharashtra for integrated healthcare.",
      "aiImpact": "Safe: Personalized Prakriti (Vata, Pitta, Kapha) diagnosis and manual panchakarma therapies require human pulse assessment (Nadi Pariksha).",
      "growthSectors": [
        "Global Ayurvedic Tourism & Spas",
        "Ksharsutra Treatment for Piles & Fistula (99% success rate)",
        "Herbal Nutraceutical Formulations",
        "Chronic Lifestyle Disease Reversal"
      ]
    },
    "techStackAndSkills": [
      "Nadi Pariksha (Pulse Diagnosis) & Prakriti Analysis",
      "Panchakarma Therapies: Vamana, Virechana, Basti, Nasya, Raktamokshana",
      "Modern Diagnostic Correlation (Blood counts, USG, X-Ray interpretation)",
      "Ayurvedic Pharmacognosy & Dravyaguna Formulation"
    ],
    "stepByStepRoadmap": [
      "Class 12: PCB stream with qualifying marks in NEET-UG.",
      "AYUSH Counseling: Secure admission via AACCC (All India) or DMER Maharashtra AYUSH CAP rounds.",
      "Course Duration: 4.5 Years BAMS + 1-Year Mandatory Rotatory Clinical Internship.",
      "Registration: Obtain registration certificate from Maharashtra Council of Indian Medicine (MCIM).",
      "Post-Graduation: Clear AIAPGET for MD Ayurveda (Kayachikitsa, Panchakarma) or MS Ayurveda (Shalya Tantra - Surgery).",
      "Practice: Setup integrated clinic, work in Govt PHC/Civil Hospitals, or launch Ayush manufacturing brand."
    ],
    "topColleges": [
      {
        "name": "RA Podar Ayurvedic Medical College",
        "location": "Worli, Mumbai",
        "type": "Historic Premier Govt Ayurvedic College"
      },
      {
        "name": "Government Ayurved College",
        "location": "Vazirabad, Nanded",
        "type": "Top State Institute"
      },
      {
        "name": "National Institute of Ayurveda (NIA)",
        "location": "Jaipur, Rajasthan",
        "type": "Deemed to be University (National Apex)"
      },
      {
        "name": "Tilak Ayurved Mahavidyalaya",
        "location": "Rasta Peth, Pune",
        "type": "Pioneering Research Institute"
      }
    ],
    "externalWebsites": [
      {
        "title": "National Commission for Indian System of Medicine (NCISM)",
        "url": "https://ncismindia.org",
        "note": "Central regulatory body for BAMS curriculum"
      },
      {
        "title": "Ministry of AYUSH, Govt of India",
        "url": "https://ayush.gov.in",
        "note": "Policy updates, research grants, Ayush visa guidelines"
      },
      {
        "title": "AACCC AYUSH Admissions Central Counselling",
        "url": "https://aaccc.gov.in",
        "note": "All-India 15% quota counseling portal"
      }
    ],
    "govtExamSynergy": {
      "jobs": "National Health Mission (NHM) Medical Officer, Maharashtra Zilla Parishad Ayurvedic Doctor, UPSC Medical Officer (Ayurveda), ESIC Ayurvedic Dispensary Doctor.",
      "examUdaanLink": "/jobs?q=ayush",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "NEET UG: First Sunday of May | AACCC Ayush Central & Maharashtra State Ayush Counseling: August-October.",
    "portionAndSyllabus": [
      "NEET UG NCERT PCB Syllabus (Physics, Chemistry, Biology).",
      "Bonus Pre-requisite: Sanskrit at 10th or 12th level provides superior comfort with foundational Ayurvedic Samhitas (Charaka & Sushruta)."
    ],
    "examPatternSummary": "NEET UG: 720 Marks. Minimum qualifying percentile: 50th percentile (UR/EWS) / 40th percentile (OBC/SC/ST)."
  },
  {
    "id": "bhms-homeopathy",
    "streamId": "science",
    "categoryId": "sci_med",
    "title": "Homeopathic Physician (BHMS → MD Homeopathy)",
    "role": "Homeopathic Doctor, Pediatric Holistic Specialist, Allergy & Auto-Immune Consultant",
    "min12thStream": "12th Science with PCB (Physics, Chemistry, Biology)",
    "keySubjectsToScore": [
      {
        "subject": "Biology",
        "minScore": "70%+",
        "reason": "Pathology, anatomy, embryology and pharmacology form the medical foundation of BHMS."
      },
      {
        "subject": "Chemistry",
        "minScore": "70%+",
        "reason": "Understanding micro-dilutions, potentization, and biochemistry."
      }
    ],
    "entranceExams": [
      {
        "name": "NEET-UG",
        "body": "NTA",
        "level": "National (Required for all BHMS seats)",
        "mode": "Pen-and-Paper OMR",
        "website": "https://neet.nta.nic.in"
      },
      {
        "name": "AIAPGET (Homeopathy)",
        "body": "NTA",
        "level": "Post-BHMS MD Entrance",
        "mode": "Online CBT",
        "website": "https://aiapget.nta.nic.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹4 Lakhs – ₹7.5 Lakhs / year (Clinical Assistant / Homeopathic Officer)",
      "mid": "₹10 Lakhs – ₹20 Lakhs / year (Established Private Clinic)",
      "senior": "₹25 Lakhs – ₹55 Lakhs+ / year (Leading Homeopathic Consultant, Chain Clinic Founder)",
      "highestPaying": "Chronic Dermatology (Eczema/Psoriasis), Pediatric Allergy Management, Trichology"
    },
    "scopeAndFuture": {
      "rating": "4/5 (Wide Acceptance for Chronic & Auto-Immune Ailments)",
      "summary": "Homeopathy is the second most widely used system of medicine globally. Millions of patients prefer gentle homeopathic remedies for chronic skin disorders, migraines, child immunity, and stress-related ailments with no side effects.",
      "aiImpact": "Safe: Homeopathic repertorization relies on deep individualized constitutional psychological and physical case-taking.",
      "growthSectors": [
        "Pediatric Recurrent Infection Management",
        "Holistic Dermatology",
        "Homeopathic Tele-consultation & Global Shipping",
        "Stress & Lifestyle Clinic Networks"
      ]
    },
    "techStackAndSkills": [
      "Constitutional Case Taking & Symptom Totality Mapping",
      "Repertory Software: RadarOpus, Hompath Zomeo, MacRepertory",
      "Modern Clinical Pathology Evaluation (CBC, Thyroid, LFT, KFT analysis)",
      "High Patient Listening Empathy & Psychology Insight"
    ],
    "stepByStepRoadmap": [
      "Class 12: PCB stream with qualifying NEET-UG score.",
      "Counseling: Participate in State AYUSH counseling for BHMS colleges.",
      "Undergraduate: 4.5 Years of study covering anatomy, physiology, organon of medicine, materia medica, repertory + 1-Year Rotatory Internship.",
      "Licensing: Register with Central Council of Homeopathy / Maharashtra Council of Homeopathy.",
      "Higher Studies: AIAPGET for MD Homeopathy (Materia Medica, Organon, Repertory, Practice of Medicine).",
      "Clinical Practice: Setup independent clinic or work in corporate homeopathic chains (Dr. Batra's, Bakson's)."
    ],
    "topColleges": [
      {
        "name": "National Institute of Homeopathy (NIH)",
        "location": "Kolkata, West Bengal",
        "type": "Premier Apex National Institute"
      },
      {
        "name": "Dr. ML Dhawale Memorial Homoeopathic Institute",
        "location": "Palghar, Maharashtra",
        "type": "World-Renowned Clinical Research Hospital"
      },
      {
        "name": "Government Homeopathic Medical College",
        "location": "Bengaluru / Kozhikode",
        "type": "Top Govt Institute"
      },
      {
        "name": "Smt. Chandaben Mohanbhai Patel Homoeopathic Medical College",
        "location": "Vile Parle, Mumbai",
        "type": "Leading Mumbai Institute"
      }
    ],
    "externalWebsites": [
      {
        "title": "National Commission for Homeopathy (NCH)",
        "url": "https://nch.org.in",
        "note": "Statutory body regulating Homeopathic education in India"
      },
      {
        "title": "Central Council for Research in Homoeopathy (CCRH)",
        "url": "https://www.ccrhindia.nic.in",
        "note": "Govt research body, scientific clinical trials"
      },
      {
        "title": "AACCC AYUSH Counselling Portal",
        "url": "https://aaccc.gov.in",
        "note": "Central counseling registration for BHMS"
      }
    ],
    "govtExamSynergy": {
      "jobs": "UPSC Homeopathic Medical Officer (CGHS dispensaries), Maharashtra NHM Community Health Officer (CHO), ESI Hospital Homeopathic Consultant.",
      "examUdaanLink": "/jobs?q=homeopathy",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "NEET UG: May | AYUSH Central & Maharashtra State CET Cell Counseling: August-November.",
    "portionAndSyllabus": [
      "NEET UG NCERT Class 11 & 12 Physics, Chemistry, and Biology (Human Physiology, Pathology fundamentals)."
    ],
    "examPatternSummary": "NEET UG: 720 Marks. Cutoffs in Maharashtra Govt / Aided colleges range from 380 to 490 marks."
  },
  {
    "id": "pharmacy-bpharm-mpharm",
    "streamId": "science",
    "categoryId": "sci_med",
    "title": "Pharmacy Specialist (B.Pharm → M.Pharm / Pharm.D)",
    "role": "Drug Formulation Scientist, Clinical Research Associate, Regulatory Affairs Manager, Chemist Entrepreneur",
    "min12thStream": "12th Science with PCM or PCB (Either combination eligible)",
    "keySubjectsToScore": [
      {
        "subject": "Chemistry (Organic & Medicinal)",
        "minScore": "80%+",
        "reason": "Drug molecules, chemical synthesis, stereochemistry and drug delivery mechanisms are 60% of pharmacy."
      },
      {
        "subject": "Biology or Mathematics",
        "minScore": "75%+",
        "reason": "Pharmacology (effect on body) requires biology; biostatistics and pharmacokinetic modeling require maths."
      }
    ],
    "entranceExams": [
      {
        "name": "MHT-CET (PCB or PCM)",
        "body": "State CET Cell Maharashtra",
        "level": "State (ICT Mumbai, Bombay College of Pharmacy)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "GPAT (Graduate Pharmacy Aptitude Test)",
        "body": "NBEMS",
        "level": "National (For M.Pharm & AICTE stipend of ₹12,400/mo)",
        "mode": "Online CBT",
        "website": "https://natboard.edu.in"
      },
      {
        "name": "NIPER JEE",
        "body": "NIPER (National Institute of Pharmaceutical Education)",
        "level": "Premier National Master Entrance",
        "mode": "Online CBT",
        "website": "https://www.niper.gov.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹4.5 Lakhs – ₹8 Lakhs / year (QA/QC Analyst / Production Officer / Medical Rep)",
      "mid": "₹12 Lakhs – ₹22 Lakhs / year (Formulation Scientist / Clinical Research Lead)",
      "senior": "₹28 Lakhs – ₹65 Lakhs+ / year (VP Regulatory Affairs / R&D Director / Pharma Factory Head)",
      "highestPaying": "Global Regulatory Affairs (FDA/EMA filing), Clinical Trials Operations, Patent Law & Intellectual Property"
    },
    "scopeAndFuture": {
      "rating": "4.8/5 (India is the \"Pharmacy of the World\")",
      "summary": "India supplies 40% of generic formulations in the US and 20% globally. Pharmaceutical research, biopharmaceuticals, vaccines (Serum Institute Pune), and clinical research organizations (CROs) in Mumbai, Pune, and Hyderabad are booming.",
      "aiImpact": "Augmented: AI accelerates computer-aided drug discovery (CADD), but laboratory synthesis, animal testing, clinical trials, and FDA compliance require pharmacist experts.",
      "growthSectors": [
        "Biologics & Monoclonal Antibodies",
        "Vaccine Manufacturing (Pune Hub)",
        "Pharmacovigilance (Drug Safety Monitoring)",
        "Clinical Data Management"
      ]
    },
    "techStackAndSkills": [
      "Chromatography: HPLC, GC-MS, UV-Visible Spectrophotometry",
      "Formulation Science: Nanoparticles, Liposomes, Controlled-Release Tablets",
      "Regulatory Documentation: CTD/eCTD Dossiers, US FDA 21 CFR Part 11 Compliance",
      "Clinical Research Software: SAS, MedDRA Coding, Oracle Clinical"
    ],
    "stepByStepRoadmap": [
      "Class 12: PCM or PCB stream with 75%+ score.",
      "Crack Entrance: Appear for MHT-CET in Maharashtra or BITSAT (Pharmacy).",
      "Undergraduate: 4-Year B.Pharm degree (accredited by Pharmacy Council of India).",
      "Pharmacist License: Receive registered \"Pharmacist\" license with rights to run wholesale/retail pharmacy.",
      "Master Degree: Clear GPAT for monthly ₹12,400 govt stipend + join NIPER or ICT Mumbai for M.Pharm.",
      "Career Entry: Join Top Pharma MNCs (Sun Pharma, Cipla, Dr. Reddy’s, Serum Institute, Pfizer) in R&D or Regulatory Affairs."
    ],
    "topColleges": [
      {
        "name": "Institute of Chemical Technology (ICT), Mumbai",
        "location": "Matunga, Mumbai",
        "type": "World-Renowned Chemical & Pharma Apex Institute"
      },
      {
        "name": "Bombay College of Pharmacy (BCP)",
        "location": "Kalina, Mumbai",
        "type": "Top Ranked Pharmacy College"
      },
      {
        "name": "NIPER SAS Nagar / Ahmedabad / Hyderabad",
        "location": "National Institutes",
        "type": "Institute of National Importance"
      },
      {
        "name": "Poona College of Pharmacy, Bharati Vidyapeeth",
        "location": "Pune, Maharashtra",
        "type": "Premier Research Campus"
      }
    ],
    "externalWebsites": [
      {
        "title": "Pharmacy Council of India (PCI)",
        "url": "https://pci.nic.in",
        "note": "Central statutory body governing pharmacy education"
      },
      {
        "title": "State CET Cell Maharashtra (B.Pharm CAP)",
        "url": "https://cetcell.mahacet.org",
        "note": "Centralized admission rounds for all Maharashtra colleges"
      },
      {
        "title": "National Board of Examinations (GPAT)",
        "url": "https://natboard.edu.in",
        "note": "National entrance for M.Pharm with AICTE stipend"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Drug Inspector (MPSC Gazetted Class-2 / UPSC Central), Government Hospital Chief Pharmacist (DMER/Zilla Parishad), Railway Pharmacist, CDSCO Technical Officer.",
      "examUdaanLink": "/jobs?q=pharmacist",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "MHT-CET (PCB or PCM): April-May | GPAT (for M.Pharm / NIPER): May-June | DTE Centralized Admission CAP: July-August.",
    "portionAndSyllabus": [
      "MHT-CET: Class 11 & 12 Physics, Chemistry, and either Mathematics or Biology (both groups eligible!).",
      "GPAT: Pharmaceutics, Pharmacology & Toxicology, Pharmaceutical Chemistry, Pharmacognosy, Clinical Pharmacy."
    ],
    "examPatternSummary": "MHT-CET Pharmacy: 200 Marks. No Negative Marking. GPAT: 125 Questions, 500 Marks, 3 Hours (+4, -1)."
  },
  {
    "id": "pure-science-isro-researcher",
    "streamId": "science",
    "categoryId": "sci_pure",
    "title": "Space & Pure Science Researcher (ISRO / BARC / DRDO / IISc)",
    "role": "Astrophysicist, Nuclear Scientist, Quantum Physicist, Defense Scientist B",
    "min12thStream": "12th Science with PCM (Physics, Chemistry, Maths)",
    "keySubjectsToScore": [
      {
        "subject": "Physics (Modern Physics, Quantum, Electromagnetism)",
        "minScore": "85%+",
        "reason": "Core screening factor for IAT (IISER), NEST (NISER), and ISRO Scientist exam."
      },
      {
        "subject": "Mathematics (Differential Equations, Linear Algebra)",
        "minScore": "85%+",
        "reason": "Theoretical physics, orbital mechanics, and quantum simulations require advanced mathematics."
      }
    ],
    "entranceExams": [
      {
        "name": "IAT (IISER Aptitude Test)",
        "body": "IISER Consortium",
        "level": "National (For 5-Yr BS-MS Dual Degree at 7 IISERs)",
        "mode": "Online CBT",
        "website": "https://iiseradmission.in"
      },
      {
        "name": "NEST (National Entrance Screening Test)",
        "body": "NISER & UM-DAE CEBS",
        "level": "National (DAE Atomic Energy Institute)",
        "mode": "Online CBT",
        "website": "https://www.nestexam.in"
      },
      {
        "name": "JEE Advanced (For IISc Bengaluru & IIST)",
        "body": "IITs / IIST",
        "level": "National (IIST offers direct ISRO absorption)",
        "website": "https://www.iist.ac.in"
      },
      {
        "name": "CSIR UGC NET (JRF)",
        "body": "NTA / CSIR",
        "level": "Post-M.Sc (For PhD Fellowship of ₹37,000/mo)",
        "mode": "Online CBT",
        "website": "https://csirnet.nta.nic.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹9 Lakhs – ₹14 Lakhs / year (Scientist ‘SC’ at ISRO/BARC — Level 10 Pay Matrix ₹56,100 base + DA + HRA)",
      "mid": "₹18 Lakhs – ₹32 Lakhs / year (Scientist ‘SD’/‘SE’ / Associate Professor)",
      "senior": "₹38 Lakhs – ₹65 Lakhs / year (Outstanding Scientist ‘H’, Mission Director, Lab Director)",
      "highestPaying": "Defense Systems, Quantum Computing Research, Nuclear Physics, International Post-Doc (CERN, NASA, Max Planck)"
    },
    "scopeAndFuture": {
      "rating": "4.8/5 (Golden Era for India’s Space & Semiconductor Programs)",
      "summary": "With Chandrayaan, Gaganyaan human spaceflight, Aditya-L1 solar missions, the National Quantum Mission (₹6,000 Cr), and domestic semiconductor fabs, India is investing heavily in fundamental physics and space engineering.",
      "aiImpact": "Collaborative Tool: AI processes supercomputer astrophysical telescope data, but fundamental physical theories and experimental instrumentation require human genius.",
      "growthSectors": [
        "Satellite Communications & Earth Observation",
        "Quantum Cryptography",
        "Fusion Energy & Small Modular Reactors (SMRs)",
        "Advanced Defense Radar & Sonar"
      ]
    },
    "techStackAndSkills": [
      "Programming & Scientific Simulation: Python (NumPy/SciPy), MATLAB, Fortran, C++",
      "Data Analysis: ROOT (CERN framework), Astropy, Mathematica, Linux Terminal",
      "Laboratory Instrumentation: Spectrophotometers, Particle Detectors, Vacuum Chambers, Cryogenics"
    ],
    "stepByStepRoadmap": [
      "Class 12: Score 85%+ in PCM. Prepare for IAT (IISER), NEST, or JEE Advanced.",
      "Degree Choice 1 (Direct ISRO Route): Secure admission in IIST Thiruvananthapuram (B.Tech Aerospace / Avionics / Engineering Physics) — top rankers are directly recruited as ISRO Scientists!",
      "Degree Choice 2 (Pure Science Route): 5-Year Integrated BS-MS at IISc Bengaluru or IISER Pune/Kolkata/Mohali.",
      "Post-Graduation: Clear CSIR-NET JRF for PhD fellowship at TIFR Mumbai, BARC, or IUCAA Pune.",
      "Recruitment: Clear ISRO ICRB Scientist Recruitment Exam or BARC OCES/DGFS Scientific Officer Exam."
    ],
    "topColleges": [
      {
        "name": "IIST (Indian Institute of Space Science and Technology)",
        "location": "Thiruvananthapuram, Kerala",
        "type": "ISRO Dedicated University"
      },
      {
        "name": "IISc (Indian Institute of Science)",
        "location": "Bengaluru, Karnataka",
        "type": "Rank #1 University in India (NIRF)"
      },
      {
        "name": "IISER Pune (Indian Institute of Science Education and Research)",
        "location": "Pashan, Pune, Maharashtra",
        "type": "National Research Institute"
      },
      {
        "name": "TIFR (Tata Institute of Fundamental Research)",
        "location": "Colaba, Mumbai, Maharashtra",
        "type": "Apex Atomic Energy Research"
      },
      {
        "name": "IUCAA (Inter-University Centre for Astronomy and Astrophysics)",
        "location": "SPPU Campus, Pune",
        "type": "Global Astrophysics Hub"
      }
    ],
    "externalWebsites": [
      {
        "title": "ISRO Official Careers & Recruitment",
        "url": "https://www.isro.gov.in/Careers.html",
        "note": "Scientist/Engineer SC vacancies and notifications"
      },
      {
        "title": "BARC Scientific Officer Recruitment (OCES/DGFS)",
        "url": "https://barcoces.examdata.co.in",
        "note": "Nuclear scientist gateway for DAE facilities"
      },
      {
        "title": "IISER Admissions Official Portal",
        "url": "https://iiseradmission.in",
        "note": "Entrance guidelines for BS-MS research dual degrees"
      },
      {
        "title": "DRDO Scientist Recruitment (RAC)",
        "url": "https://rac.gov.in",
        "note": "Scientist B recruitment through GATE score"
      }
    ],
    "govtExamSynergy": {
      "jobs": "ISRO Scientist/Engineer ‘SC’, BARC Scientific Officer, DRDO Scientist ‘B’, Indian Met Dept (IMD) Meteorologist, Patent Office Examiner.",
      "examUdaanLink": "/jobs?q=scientist",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "IISER IAT: May-June | NEST (NISER / CEBS): June | CSIR NET (JRF): June & December | GATE: February.",
    "portionAndSyllabus": [
      "IAT / NEST: Advanced Class 11 & 12 PCMB (Biology, Chemistry, Mathematics, Physics) — high analytical reasoning required.",
      "CSIR NET / GATE: Advanced Quantum Mechanics, Organic Synthesis, Advanced Real Analysis, Molecular Biology."
    ],
    "examPatternSummary": "IAT: 60 Qs (15 in each of PCMB), 240 Marks, 3 Hours (+4, -1). CSIR NET: 200 Marks, 3 Hours."
  },
  {
    "id": "commercial-pilot-aviation",
    "streamId": "science",
    "categoryId": "sci_arch_aviation",
    "title": "Commercial Airline Pilot (CPL License)",
    "role": "First Officer, Airline Captain, Flight Operations Specialist, VIP Charter Pilot",
    "min12thStream": "12th Science with Physics and Mathematics (Mandatory DGCA Rule)",
    "keySubjectsToScore": [
      {
        "subject": "Physics",
        "minScore": "60%+",
        "reason": "Aerodynamics, altimetry, radio propagation, meteorology, and jet engine principles."
      },
      {
        "subject": "Mathematics",
        "minScore": "60%+",
        "reason": "Dead reckoning navigation, fuel burn calculation, wind vectors, and speed conversions."
      }
    ],
    "entranceExams": [
      {
        "name": "IGRUA Entrance Exam",
        "body": "Indira Gandhi Rashtriya Uran Akademi (Ministry of Civil Aviation)",
        "level": "Premier Govt Flight School",
        "website": "https://igrua.gov.in"
      },
      {
        "name": "DGCA Pilot Theoretical Exams",
        "body": "Directorate General of Civil Aviation",
        "level": "Mandatory Licensure Exams (Nav, Met, Regs, Tech)",
        "website": "https://dgca.gov.in"
      },
      {
        "name": "Airline Cadet Pilot Programs",
        "body": "IndiGo, Air India, SpiceJet Cadet Programs",
        "level": "Guaranteed Job Pathway",
        "website": "https://www.goindigo.in/careers.html"
      }
    ],
    "salaryLadder": {
      "entry": "₹18 Lakhs – ₹30 Lakhs / year (First Officer on Airbus A320 / Boeing 737: ~₹1.8L - ₹2.5L/month)",
      "mid": "₹40 Lakhs – ₹70 Lakhs / year (Senior First Officer / Transitioning Captain)",
      "senior": "₹85 Lakhs – ₹1.5 Crore+ / year (Wide-Body Airline Captain: Boeing 777 / Airbus A350)",
      "highestPaying": "International Long-Haul Airlines (Emirates, Qatar Airways, Singapore Airlines, Air India Express)"
    },
    "scopeAndFuture": {
      "rating": "4.9/5 (Unprecedented Historic Boom in Indian Aviation)",
      "summary": "Air India and IndiGo have ordered over 1,500 new aircraft—the largest in commercial aviation history. India will require over 10,000+ new commercial pilots over the next decade as 50+ new airports open under UDAN scheme.",
      "aiImpact": "Safe: Autopilot handles cruising, but emergency cockpit decisions, crosswind landings, mechanical failures, and human lives strictly require licensed human captains.",
      "growthSectors": [
        "Commercial Narrow & Wide-body Airlines",
        "Cargo Logistics (Blue Dart, Amazon Air)",
        "Corporate Business Jets (Charter)",
        "Flight Instructor (CFI)"
      ]
    },
    "techStackAndSkills": [
      "Cockpit Glass Cockpit Avionics: Fly-by-wire, FMS, TCAS, ILS Category III",
      "Aviation Meteorology, Air Regulations & Radio Telephony (RTR License)",
      "Exceptional Spatial Awareness, Quick Crisis Response & Split-Second Decision Making",
      "DGCA Class 1 Medical Fitness (Zero color blindness, healthy cardiovascular/vision)"
    ],
    "stepByStepRoadmap": [
      "Class 12: Complete 10+2 with Physics and Mathematics (minimum 50-60%).",
      "Class 1 Medical: Clear DGCA Class 2 medical exam, followed by DGCA Class 1 Medical Examination from authorized Air Force/Civil Centers.",
      "Flying School Selection: Join premier flying school (IGRUA, NFTI Gondia, Chimes Aviation, or Abroad in US/New Zealand).",
      "Flight Hours: Log 200 hours of flight training (solo, cross-country, night, instrument flying) to secure Commercial Pilot License (CPL).",
      "DGCA Exams: Pass 5 theoretical papers (Air Navigation, Aviation Meteorology, Air Regulations, Technical General, Technical Specific).",
      "Type Rating: Complete Type Rating on specific jet airliner (Airbus A320 or Boeing 737).",
      "Airline Induction: Clear airline written exam, simulator assessment & personal interview to fly as First Officer!"
    ],
    "topColleges": [
      {
        "name": "IGRUA (Indira Gandhi Rashtriya Uran Akademi)",
        "location": "Fursatganj, Amethi, UP",
        "type": "Govt Apex Flight Academy"
      },
      {
        "name": "NFTI (National Flying Training Institute — CAE)",
        "location": "Gondia, Maharashtra",
        "type": "Premier Modern Simulator & Flight Base"
      },
      {
        "name": "Bombay Flying Club",
        "location": "Juhu Aerodrome, Mumbai",
        "type": "Oldest Flying Club in India (Est. 1928)"
      },
      {
        "name": "Chimes Aviation Academy",
        "location": "Dhana, Madhya Pradesh",
        "type": "Top Private Fleet Training Base"
      }
    ],
    "externalWebsites": [
      {
        "title": "DGCA Official Portal (eGCA)",
        "url": "https://dgca.gov.in",
        "note": "Medical examiner list, computer number application & CPL rules"
      },
      {
        "title": "IGRUA Entrance Portal",
        "url": "https://igrua.gov.in",
        "note": "Entrance test dates, commercial pilot batch admissions"
      },
      {
        "title": "WPC Wireless Planning (RTR License)",
        "url": "https://wpc.dot.gov.in",
        "note": "Radio Telephony Restricted license required for cockpit communication"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Indian Air Force (IAF AFCAT / CDS Flying Branch Officer), Coast Guard Pilot (Assistant Commandant), BSF Air Wing Pilot, Air India State Service.",
      "examUdaanLink": "/jobs?q=pilot",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "IGRUA Entrance: May | DGCA CPL Theory Examinations: Conducted 4 times a year (Jan, Apr, Jul, Oct) by DGCA.",
    "portionAndSyllabus": [
      "DGCA CPL 5 Core Subjects: Air Navigation, Aviation Meteorology, Air Regulations, Technical General (Aircraft Systems & Engines), Technical Specific.",
      "RTR(A) Radio Telephony License Exam conducted by Wireless Planning & Coordination (WPC) Wing."
    ],
    "examPatternSummary": "DGCA CPL Exams: 100 Questions MCQ, 70% minimum score required to pass each subject. Class 1 Medical Fitness certificate mandatory."
  },
  {
    "id": "ca-chartered-accountant",
    "streamId": "commerce",
    "categoryId": "com_prof",
    "title": "Chartered Accountant (CA — ICAI)",
    "role": "Statutory Auditor, Forensic Auditor, Chief Financial Officer (CFO), International Tax Consultant",
    "min12thStream": "12th Commerce (Maths recommended) or Science/Arts students eligible",
    "keySubjectsToScore": [
      {
        "subject": "Accountancy & Bookkeeping",
        "minScore": "85%+",
        "reason": "Debit/credit balance sheets, accounting standards (Ind-AS), and company audits form the core foundation."
      },
      {
        "subject": "Mathematics / Statistics",
        "minScore": "75%+",
        "reason": "Time value of money, probability, and financial valuation in CA Foundation and Final."
      },
      {
        "subject": "Economics & Commercial Knowledge",
        "minScore": "80%+",
        "reason": "Micro/macro economic policy, inflation, banking systems, and regulatory business laws."
      }
    ],
    "entranceExams": [
      {
        "name": "CA Foundation (Level 1)",
        "body": "Institute of Chartered Accountants of India (ICAI)",
        "level": "National (After 12th)",
        "mode": "Pen-and-Paper (Thrice a year: Jan, May, Sept)",
        "website": "https://www.icai.org"
      },
      {
        "name": "CA Intermediate (Level 2)",
        "body": "ICAI",
        "level": "National (6 papers across 2 groups)",
        "website": "https://www.icai.org"
      },
      {
        "name": "CA Final (Level 3)",
        "body": "ICAI",
        "level": "National Apex Examination",
        "website": "https://www.icai.org"
      }
    ],
    "salaryLadder": {
      "entry": "₹9.5 Lakhs – ₹24 Lakhs / year (Fresher CA in Big 4: EY, PwC, Deloitte, KPMG or Top MNCs)",
      "mid": "₹22 Lakhs – ₹45 Lakhs / year (Audit Manager / Finance Controller)",
      "senior": "₹55 Lakhs – ₹1.5 Crore+ / year (Big 4 Partner, CFO of Listed Company, Independent Tax Firm Owner)",
      "highestPaying": "Big 4 Audit & Deals advisory, Private Equity due diligence, International transfer pricing"
    },
    "scopeAndFuture": {
      "rating": "5/5 (Highest Prestige in Commerce & Zero Reservation / Pure Merit)",
      "summary": "By law in India (Companies Act), only a qualified Chartered Accountant holding a Certificate of Practice (COP) can sign off and audit the financial statements of any company, bank, or government organization.",
      "aiImpact": "Augmented: AI software automates invoice voucher matching, but financial strategy, forensic fraud detection, tax structuring, and audit certification legally require human CA signature.",
      "growthSectors": [
        "Forensic Accounting & ED/CBI Fraud Investigation",
        "ESG & Sustainability Reporting",
        "Cross-Border M&A Tax Advisory",
        "Startup Valuation & IPO Advisory"
      ]
    },
    "techStackAndSkills": [
      "Accounting Software: SAP FICO, Oracle ERP, Tally Prime, Zoho Books",
      "Advanced Excel: Financial modeling, VBA Macros, Power BI, Tableau",
      "Statutory Frameworks: Ind AS (IFRS convergence), Companies Act 2013, GST Acts, Income Tax Act 1961"
    ],
    "stepByStepRoadmap": [
      "Class 10: Register for CA Foundation under ICAI Provisional Scheme.",
      "Class 12: Appear for 12th Board and sit for CA Foundation exam in May/June.",
      "CA Inter: Clear both groups of CA Intermediate (8 months of study).",
      "Articleship: Complete 2 Years of mandatory practical Articleship training under a practicing CA firm.",
      "CA Final: Pass both groups of CA Final examination.",
      "Membership: Receive ACA (Associate Chartered Accountant) title from ICAI and choose between corporate corporate ladder or independent audit practice!"
    ],
    "topColleges": [
      {
        "name": "Direct Regulatory Route: ICAI (No college needed, self-study / coaching)",
        "location": "New Delhi (HQ) + Centers in Mumbai, Pune, Nagpur",
        "type": "Parliamentary Statutory Body"
      },
      {
        "name": "Complementary Degree: Narsee Monjee College of Commerce & Economics",
        "location": "Vile Parle, Mumbai",
        "type": "Top CA feeder college"
      },
      {
        "name": "RA Podar College of Commerce and Economics",
        "location": "Matunga, Mumbai",
        "type": "Premier Commerce Campus"
      },
      {
        "name": "BMCC (Brihan Maharashtra College of Commerce)",
        "location": "Deccan, Pune",
        "type": "Historic Commerce Leader"
      }
    ],
    "externalWebsites": [
      {
        "title": "ICAI Official Portal",
        "url": "https://www.icai.org",
        "note": "Registration, syllabus, exam forms, digital learning hub (BoS)"
      },
      {
        "title": "Self-Service Portal (SSP) ICAI",
        "url": "https://eservices.icai.org",
        "note": "Student enrollment and articleship registration"
      },
      {
        "title": "Western India Regional Council of ICAI (WIRC)",
        "url": "https://www.wirc-icai.org",
        "note": "Maharashtra seminars, campus placement drives"
      }
    ],
    "govtExamSynergy": {
      "jobs": "CAG Indian Audit & Accounts Service (IA&AS via UPSC), SEBI Grade A (Finance Stream), RBI Grade B (Finance), Assistant Commissioner of Income Tax, State Finance Service.",
      "examUdaanLink": "/jobs?q=ca",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "CA Foundation: Jan, May/June & September (thrice yearly) | CA Inter & Final: May & November | ICAI Registration: Min 4 months before exam.",
    "portionAndSyllabus": [
      "CA Foundation: Paper 1 - Accounting (100 Marks), Paper 2 - Business Laws (100 Marks), Paper 3 - Quantitative Aptitude (Maths, Stats, Logical Reasoning - 100 Marks), Paper 4 - Business Economics (100 Marks).",
      "CA Inter (6 Papers): Advanced Accounting, Corporate and Other Laws, Taxation (Direct & Indirect GST), Cost & Management Accounting, Auditing and Ethics, Financial Management & Strategic Management."
    ],
    "examPatternSummary": "CA Foundation: 4 Papers, 400 Marks. Passing Criteria: Minimum 40% in each individual paper AND 50% aggregate overall. Objective papers have 0.25 negative marking."
  },
  {
    "id": "investment-banker-cfa",
    "streamId": "commerce",
    "categoryId": "com_bank_fin",
    "title": "Investment Banker & Equity Research Analyst (CFA / MBA Finance)",
    "role": "M&A Dealmaker, Portfolio Manager, Equity Research Associate, Hedge Fund Analyst",
    "min12thStream": "12th Commerce with Mathematics or 12th Science PCM",
    "keySubjectsToScore": [
      {
        "subject": "Mathematics / Statistics",
        "minScore": "85%+",
        "reason": "Discounted Cash Flow (DCF), Black-Scholes options pricing, and Monte Carlo risk simulations."
      },
      {
        "subject": "Economics (Macro & Micro)",
        "minScore": "80%+",
        "reason": "Interest rate cycles, central bank monetary policy, currency fx rates, and market liquidity."
      },
      {
        "subject": "Financial Accountancy",
        "minScore": "80%+",
        "reason": "Deconstructing balance sheets, cash flow statement manipulation, and EBITDA margins."
      }
    ],
    "entranceExams": [
      {
        "name": "IPMAT (IIM Indore / Rohtak)",
        "body": "IIMs",
        "level": "National (After 12th for 5-Year Integrated Management)",
        "mode": "Online CBT",
        "website": "https://www.iimidr.ac.in"
      },
      {
        "name": "CAT (Common Admission Test)",
        "body": "IIMs",
        "level": "National Post-Grad (For IIM A/B/C MBA Finance)",
        "mode": "Online CBT",
        "website": "https://iimcat.ac.in"
      },
      {
        "name": "CFA Exam (Chartered Financial Analyst Level 1, 2, 3)",
        "body": "CFA Institute (USA)",
        "level": "Global Gold Standard in Finance",
        "mode": "Computer-based (Prometric)",
        "website": "https://www.cfainstitute.org"
      }
    ],
    "salaryLadder": {
      "entry": "₹14 Lakhs – ₹32 Lakhs / year + (50–100% Performance Bonus)",
      "mid": "₹35 Lakhs – ₹80 Lakhs / year (Vice President / Associate Director)",
      "senior": "₹90 Lakhs – ₹2.5 Crore+ / year (Managing Director / Fund Manager / Partner)",
      "highestPaying": "Bulge Bracket Investment Banks (Goldman Sachs, Morgan Stanley, JP Morgan), Sovereign Wealth Funds, Top PE/VC firms"
    },
    "scopeAndFuture": {
      "rating": "4.8/5 (Highest Cash Earning Potential in White-Collar Careers)",
      "summary": "Mumbai is the financial capital of India (Dalal Street, BKC). As Indian corporate giants list IPOs, acquire foreign companies, and deploy venture capital into tech startups, finance dealmakers earn legendary compensation packages.",
      "aiImpact": "Augmented: Financial data screening is done by LLMs, but relationship-driven M&A negotiation, high-stakes board pitch decks, and investor capital allocations require elite human financiers.",
      "growthSectors": [
        "Private Credit & Distressed Assets",
        "Green Climate Finance & Renewable Bonds",
        "FinTech Venture Capital",
        "Indian Stock Market Equity Research"
      ]
    },
    "techStackAndSkills": [
      "Financial Modeling: 3-Statement Model, LBO (Leveraged Buyout), DCF, Accretion/Dilution",
      "Terminals & Data: Bloomberg Terminal, Refinitiv Eikon, FactSet, S&P Capital IQ",
      "Presentation & Pitching: PitchBook, Capital Structuring, High-Stakes Storytelling"
    ],
    "stepByStepRoadmap": [
      "Class 12: Score 85%+ with Mathematics.",
      "Undergraduate: Pursue B.Com Hons, BAF, BBA Finance from top college (St. Xavier's Mumbai, NM College, SRCC) or crack IPMAT for IIM Indore.",
      "CFA Level 1: Sit for CFA Level 1 in final year of graduation.",
      "Post-Graduation: Crack CAT (99.5%+ percentile) for IIM Ahmedabad / Bangalore / Calcutta / JBIMS Mumbai (Finance Campus).",
      "Internship: Secure summer associate internship at JP Morgan, Morgan Stanley, Citi, or Kotak Investment Banking.",
      "Placement: Join full-time investment banking division in Mumbai or international centers (Singapore/London/New York)."
    ],
    "topColleges": [
      {
        "name": "Jamnalal Bajaj Institute of Management Studies (JBIMS)",
        "location": "Churchgate, Mumbai (The \"CEO Factory\" of India)",
        "type": "State Premier MBA"
      },
      {
        "name": "IIM Ahmedabad / IIM Calcutta",
        "location": "Ahmedabad / Kolkata",
        "type": "Top Finance Schools in Asia"
      },
      {
        "name": "St. Xavier’s College",
        "location": "Fort, Mumbai",
        "type": "Premier Undergraduate Feeder"
      },
      {
        "name": "NMIMS School of Business Management",
        "location": "Juhu, Mumbai",
        "type": "Top Corporate Finance Campus"
      }
    ],
    "externalWebsites": [
      {
        "title": "CFA Institute USA Official",
        "url": "https://www.cfainstitute.org",
        "note": "Global curriculum, enrollment dates & scholarships"
      },
      {
        "title": "National Stock Exchange of India (NSE Academy)",
        "url": "https://www.nseindia.com",
        "note": "NCFM certifications and financial market modules"
      },
      {
        "title": "IIM CAT Portal",
        "url": "https://iimcat.ac.in",
        "note": "Registration for common admission test for IIMs"
      }
    ],
    "govtExamSynergy": {
      "jobs": "RBI Grade ‘B’ Officer (General/Finance), SEBI Grade ‘A’ Assistant Manager (Securities Market), EXIM Bank Officer, NABARD Grade ‘A’ Specialist.",
      "examUdaanLink": "/jobs?q=banking",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "CFA Level 1: Feb, May, Aug, Nov | NISM Certifications: Conducted daily on-demand at NSE/BSE centers | CAT: Last Sunday of Nov.",
    "portionAndSyllabus": [
      "CFA Level 1: Ethical & Professional Standards, Quantitative Methods, Economics, Financial Statement Analysis, Corporate Issuers, Equity & Fixed Income, Derivatives, Alternative Investments.",
      "Financial Modeling: Three-Statement LBO / DCF Valuation, M&A Accretion-Dilution, Python for Quantitative Finance."
    ],
    "examPatternSummary": "CFA Level 1: 180 Multiple-Choice Questions split across two 135-minute sessions. Global pass rate: ~38%–44%."
  },
  {
    "id": "upsc-civil-services-ias-ips",
    "streamId": "arts",
    "categoryId": "arts_civil",
    "title": "Civil Servant — IAS / IPS / IFS (UPSC CSE & MPSC State Services)",
    "role": "District Magistrate (Collector), Superintendent of Police (SP), Diplomat (IFS), Deputy Collector",
    "min12thStream": "Any stream in 12th (Arts / Science / Commerce) + Any Graduation Degree",
    "keySubjectsToScore": [
      {
        "subject": "Political Science & Indian Polity",
        "minScore": "80%+",
        "reason": "Constitution of India, governance, fundamental rights, and panchayati raj comprise 30% of General Studies."
      },
      {
        "subject": "History & Culture (Modern & Maharashtra)",
        "minScore": "75%+",
        "reason": "Freedom movement, social reformers (Phule, Shahu, Ambedkar), and ancient architecture."
      },
      {
        "subject": "Economy & Geography",
        "minScore": "75%+",
        "reason": "Monetary policy, budget, agricultural geography, climate patterns, and census demographics."
      }
    ],
    "entranceExams": [
      {
        "name": "UPSC Civil Services Examination (CSE)",
        "body": "Union Public Service Commission",
        "level": "National (For IAS, IPS, IFS, IRS)",
        "mode": "Prelims (MCQ) + Mains (Descriptive) + Interview",
        "website": "https://upsc.gov.in"
      },
      {
        "name": "MPSC Civil Services (Rajyaseva)",
        "body": "Maharashtra Public Service Commission",
        "level": "State (Deputy Collector, DYSP, Tehsildar)",
        "mode": "Prelims + Mains (Descriptive) + Interview",
        "website": "https://mpsc.gov.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹9 Lakhs – ₹14 Lakhs / year (Level 10 Pay Matrix: ₹56,100 basic + DA + Official Bunglow + Chauffeur + Security)",
      "mid": "₹18 Lakhs – ₹28 Lakhs / year (District Magistrate / Superintendent of Police / Joint Secretary)",
      "senior": "₹35 Lakhs – ₹45 Lakhs / year (Cabinet Secretary of India / Chief Secretary of Maharashtra — Apex Pay Scale ₹2,50,000 fixed)",
      "highestPaying": "Priceless Authority: Unmatched administrative power, statutory executive authority over millions of citizens, judicial power"
    },
    "scopeAndFuture": {
      "rating": "5/5 (Highest Status & Direct Nation-Building Impact in India)",
      "summary": "An IAS or MPSC Deputy Collector wields direct executive authority over law & order, public hospitals, disaster relief, infrastructure funding, and welfare schemes across entire districts. No corporate job matches this public impact.",
      "aiImpact": "Completely Immune: Policy formulation, political neutrality, law-and-order crisis management, riot control, and public grievance redressal are 100% human functions.",
      "growthSectors": [
        "District Administration & Smart Cities",
        "Foreign Diplomacy & Trade Delegations",
        "Law Enforcement & Counter-Terrorism (IPS)",
        "State Revenue & Land Reforms"
      ]
    },
    "techStackAndSkills": [
      "Deep Critical Thinking, Answer Writing Structure, and Speed (100+ wpm handwriting)",
      "Public Administration, Constitutional Law, Crisis Leadership & Ethics (GS Paper 4)",
      "Interpersonal Leadership: Managing public crowds, police forces, press briefings, and political neutrality"
    ],
    "stepByStepRoadmap": [
      "Class 12: Choose Arts (Humanities: History, Pol Science, Geography) or any preferred stream.",
      "Graduation: Complete a 3-year BA (Economics/Pol Science) or B.Tech/B.Com degree. Maintain 60%+ marks.",
      "Daily Foundation: Read \"The Hindu\" or \"The Indian Express\" newspaper daily; master NCERT textbooks from Class 6 to 12.",
      "Stage 1 (Prelims): Clear GS Paper 1 (Cutoff ~85-95 marks) + CSAT Paper 2 (qualifying 33%).",
      "Stage 2 (Mains): 9 descriptive papers (Essay, 4 GS papers, 2 Optional subject papers, 2 languages) total 1,750 marks.",
      "Stage 3 (Personality Test): 275-mark interview at Dholpur House (UPSC) or MPSC Mumbai office.",
      "Training: Join Lal Bahadur Shastri National Academy of Administration (LBSNAA) Mussoorie (IAS) or Sardar Vallabhbhai Patel National Police Academy (SVPNPA) Hyderabad (IPS)!"
    ],
    "topColleges": [
      {
        "name": "St. Xavier’s College",
        "location": "Mumbai",
        "type": "Elite Arts & Humanities Campus"
      },
      {
        "name": "Fergusson College",
        "location": "FC Road, Pune",
        "type": "Historic Nursery of Freedom Fighters and Civil Servants"
      },
      {
        "name": "St. Stephen’s College / Hindu College (Delhi University)",
        "location": "New Delhi",
        "type": "Top UPSC Feeder Colleges in India"
      },
      {
        "name": "Savitribai Phule Pune University (SPPU Department of Politics)",
        "location": "Ganeshkhind, Pune",
        "type": "Premier State Academic Hub"
      }
    ],
    "externalWebsites": [
      {
        "title": "UPSC Official Portal",
        "url": "https://upsc.gov.in",
        "note": "Exam calendars, notifications, syllabi, previous question papers"
      },
      {
        "title": "MPSC Official Portal",
        "url": "https://mpsc.gov.in",
        "note": "Maharashtra state civil services rules and exam schedules"
      },
      {
        "title": "PIB (Press Information Bureau)",
        "url": "https://pib.gov.in",
        "note": "Primary source of authentic government policies and initiatives"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Direct primary gateway to all Group A & B Gazetted posts in India & Maharashtra.",
      "examUdaanLink": "/jobs?board=mpsc",
      "mockTestLink": "/mock-tests/mpsc-combined-full-prelims"
    },
    "examDatesAndCycles": "UPSC CSE: Notification in Feb | Prelims: May-June | Mains (Descriptive): September | Personality Test (Interviews): Jan-April.",
    "portionAndSyllabus": [
      "Prelims GS Paper 1: Indian Polity & Governance, History of India & INM, Geography, Economic & Social Development, Environmental Ecology, General Science, National & International Current Events.",
      "Prelims CSAT Paper 2: Reading Comprehension, Interpersonal Skills, Logical Reasoning, Decision Making, Basic Numeracy (Class 10 level) — Qualifying at 33%.",
      "Mains: Essay (250 Marks), GS 1 (History/Geo/Society), GS 2 (Polity/Constitution/IR), GS 3 (Economy/Sci-Tech/Environment/Security), GS 4 (Ethics/Integrity/Aptitude), Optional Paper 1 & 2 (500 Marks)."
    ],
    "examPatternSummary": "Prelims: 2 Papers of 200 Marks each (+2/-0.66). Mains: 9 Descriptive subjective papers written over 5 days (1750 Marks) + Personality Test (275 Marks). Total Final Merit: 2025 Marks."
  },
  {
    "id": "law-clat-corporate-litigation",
    "streamId": "arts",
    "categoryId": "arts_law",
    "title": "Advocate & Corporate Lawyer (5-Year BA LLB / BBA LLB)",
    "role": "Corporate M&A Legal Advisor, Criminal Defense Advocate, High Court / Supreme Court Litigator, Judicial Magistrate",
    "min12thStream": "Any stream in 12th (Arts / Commerce / Science all eligible)",
    "keySubjectsToScore": [
      {
        "subject": "English Language & Reading Comprehension",
        "minScore": "80%+",
        "reason": "CLAT is 100% reading-comprehension based. Must read complex 450-word legal passages in 90 seconds."
      },
      {
        "subject": "Legal Reasoning & Logic",
        "minScore": "75%+",
        "reason": "Applying legal principles (Torts, Contracts, Criminal law, Constitution) to factual dispute scenarios."
      },
      {
        "subject": "Current Affairs & GK",
        "minScore": "75%+",
        "reason": "Covers 25% of CLAT and MH-CET Law marks."
      }
    ],
    "entranceExams": [
      {
        "name": "CLAT (Common Law Admission Test)",
        "body": "Consortium of National Law Universities (NLUs)",
        "level": "National (For 24 NLUs including NLSIU, NALSAR, MNLU)",
        "mode": "Pen-and-Paper OMR",
        "website": "https://consortiumofnlus.ac.in"
      },
      {
        "name": "MH-CET Law (5-Year)",
        "body": "State CET Cell Maharashtra",
        "level": "State (For GLC Mumbai & ILS Pune)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "AILET (All India Law Entrance Test)",
        "body": "NLU Delhi",
        "level": "National Elite",
        "mode": "Pen-and-Paper OMR",
        "website": "https://nationallawuniversitydelhi.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹8 Lakhs – ₹18 Lakhs / year (Associate in Tier-1 Law Firms: Shardul Amarchand, Cyril Amarchand, Khaitan & Co, Trilegal)",
      "mid": "₹24 Lakhs – ₹55 Lakhs / year (Principal Associate / In-House Legal Counsel at Tata / Reliance / Google)",
      "senior": "₹75 Lakhs – ₹2.5 Crore+ / year (Law Firm Equity Partner / Senior Advocate appearing in Bombay High Court & Supreme Court)",
      "highestPaying": "Cross-Border Mergers & Acquisitions, White-Collar Crime Defense, International Arbitration, Patent Litigation"
    },
    "scopeAndFuture": {
      "rating": "4.9/5 (Rapidly Expanding with Tech Regulation & Corporate Governance)",
      "summary": "Law is no longer confined to courtrooms. Top corporate firms, investment banks, venture capital funds, and tech MNCs require legal counsels for data privacy (DPDP Act), startup contracts, IPO prospectuses, and cross-border deals.",
      "aiImpact": "Augmented: AI reviews standard NDA agreements, but courtroom litigation argumentation, settlement negotiations, and constitutional advocacy require human legal intellect.",
      "growthSectors": [
        "Artificial Intelligence & Data Privacy Law",
        "Insolvency & Bankruptcy Code (IBC)",
        "Intellectual Property Rights (IPR & Patents)",
        "Maritime & International Shipping Law (Mumbai Hub)"
      ]
    },
    "techStackAndSkills": [
      "Legal Databases: SCC Online, Manupatra, LexisNexis, Westlaw",
      "Contract Drafting, Due Diligence Auditing & Dispute Arbitration Pleading",
      "Persuasive Oral Argumentation, Moot Court Experience & Cross-Examination"
    ],
    "stepByStepRoadmap": [
      "Class 12: Score 70%+ in any stream. Dedicate 1 year to CLAT and MH-CET Law preparation (focus on English speed and legal logic).",
      "Entrance: Secure rank under 1,500 in CLAT for National Law Universities or 99%+ in MH-CET Law for GLC Mumbai or ILS Pune.",
      "Undergraduate: 5-Year Integrated BA LLB or BBA LLB course.",
      "Internships: Complete internships each summer: Trial Court (Year 1), High Court Senior (Year 2), NGO/Commission (Year 3), Tier-1 Corporate Law Firm (Year 4 & 5).",
      "Bar Council Enrollment: Pass All India Bar Examination (AIBE) to receive \"Sanad\" (License to practice law across all Indian courts).",
      "Career Choice: (A) Join Tier-1 corporate law firm, (B) Independent litigation practice under a Senior Advocate, (C) Appear for JMFC (Judicial Magistrate First Class) exam to become a Judge!"
    ],
    "topColleges": [
      {
        "name": "NLSIU (National Law School of India University)",
        "location": "Bengaluru, Karnataka",
        "type": "Rank #1 Law Institute in India (NIRF)"
      },
      {
        "name": "Government Law College (GLC), Mumbai",
        "location": "Churchgate, Mumbai",
        "type": "Asia’s Oldest Law School (Est. 1855, Alumni: Dr. B.R. Ambedkar)"
      },
      {
        "name": "ILS Law College",
        "location": "Law College Road, Pune",
        "type": "Historic Premier Legal Campus"
      },
      {
        "name": "MNLU (Maharashtra National Law University)",
        "location": "Powai, Mumbai & Nagpur",
        "type": "National Law University"
      }
    ],
    "externalWebsites": [
      {
        "title": "Consortium of NLUs (CLAT Official)",
        "url": "https://consortiumofnlus.ac.in",
        "note": "Online registration, sample papers & seat allocation"
      },
      {
        "title": "Bar Council of India (BCI)",
        "url": "https://www.barcouncilofindia.org",
        "note": "All India Bar Examination (AIBE) and statutory legal standards"
      },
      {
        "title": "Bar Council of Maharashtra & Goa",
        "url": "https://barcouncilofmahgoa.org",
        "note": "Advocate Sanad registration and verification"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Judicial Magistrate First Class (JMFC via MPSC), Public Prosecutor / Assistant Government Pleader, SEBI Legal Officer, Indian Army Judge Advocate General (JAG Branch Officer).",
      "examUdaanLink": "/jobs?q=law",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "CLAT: First Sunday of December | AILET (NLU Delhi): Second Sunday of December | MH CET Law (5-Year): May.",
    "portionAndSyllabus": [
      "English Language & Reading Comprehension: 450-word passages on literature, philosophy, socio-legal issues.",
      "Current Affairs & General Knowledge: National and international legal, political, and constitutional developments.",
      "Legal Reasoning: Reading real legal propositions and factual scenarios to derive outcomes.",
      "Logical Reasoning: Arguments, syllogisms, premises, and conclusions.",
      "Quantitative Techniques: Class 10 basic data interpretation, graphical analysis, and arithmetic."
    ],
    "examPatternSummary": "CLAT: 120 Passage-based MCQs, 120 Marks, 2 Hours (+1, -0.25). MH CET Law: 150 Questions, 150 Marks, 2 Hours, No Negative Marking."
  },
  {
    "id": "psychology-mental-health",
    "streamId": "arts",
    "categoryId": "arts_psych",
    "title": "Clinical & Counselling Psychologist (BA / B.Sc → MA → M.Phil / Psy.D)",
    "role": "Licensed Clinical Psychologist, Neuropsychologist, Corporate Wellbeing & HR Behavioral Consultant, Child Counselor",
    "min12thStream": "Any stream in 12th (Arts, Science, or Commerce with Psychology preferred)",
    "keySubjectsToScore": [
      {
        "subject": "Psychology / Human Behavior",
        "minScore": "80%+",
        "reason": "Understanding developmental psychology, abnormal psychology, and cognition models."
      },
      {
        "subject": "Biology / Human Physiology",
        "minScore": "70%+",
        "reason": "Neurobiology, brain anatomy, neurotransmitters (dopamine/serotonin), and neuropsychological assessments."
      },
      {
        "subject": "Statistics & Research Methodology",
        "minScore": "75%+",
        "reason": "Crucial for psychometric scale construction, SPSS data analysis, and clinical trials."
      }
    ],
    "entranceExams": [
      {
        "name": "CUET-UG (For Central Universities)",
        "body": "NTA",
        "level": "National (Delhi Univ, TISS, BHU)",
        "mode": "Online CBT",
        "website": "https://cuetug.nta.nic.in"
      },
      {
        "name": "TISS-NET / CUET-PG",
        "body": "TISS / NTA",
        "level": "Master Degree Entrance",
        "mode": "Online CBT",
        "website": "https://tiss.edu"
      },
      {
        "name": "NIMHANS Entrance Exam (For M.Phil / Psy.D)",
        "body": "NIMHANS Bengaluru",
        "level": "National Apex Medical Neuroscience Institute",
        "website": "https://nimhans.ac.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹4 Lakhs – ₹7.5 Lakhs / year (School Counselor / Junior Mental Health Associate)",
      "mid": "₹10 Lakhs – ₹22 Lakhs / year (RCI Licensed Clinical Psychologist / Hospital Consultant)",
      "senior": "₹28 Lakhs – ₹60 Lakhs+ / year (Private Clinical Practice, Celebrity Consultant, Corporate Chief Wellbeing Officer)",
      "highestPaying": "Private Therapy Clinics (₹1,500 – ₹5,000 per 50-minute session), Corporate Executive Coaching, Forensic Criminal Profiling"
    },
    "scopeAndFuture": {
      "rating": "4.8/5 (Exploding Post-Pandemic Mental Health Awareness)",
      "summary": "Mental health is no longer a taboo. Schools, corporate giants (Google, TCS, Infosys), sports academies, and hospitals are aggressively hiring psychologists to combat anxiety, burnout, ADHD, and emotional trauma.",
      "aiImpact": "100% Safe: Deep empathetic therapeutic alliance, reading micro-expressions, trauma healing, and crisis intervention strictly require human emotional connection.",
      "growthSectors": [
        "Corporate Mental Wellbeing Programs",
        "Neurodevelopmental Child Therapy (Autism/ADHD)",
        "Sports Psychology & Peak Performance Coaching",
        "Online Therapy Platforms"
      ]
    },
    "techStackAndSkills": [
      "Diagnostic Manuals: DSM-5-TR, ICD-11 Classification of Mental Disorders",
      "Psychometric Testing: Rorschach Inkblot, MMPI-2, WAIS-IV IQ Battery, BDI-II",
      "Therapeutic Modalities: Cognitive Behavioral Therapy (CBT), REBT, EMDR Trauma Therapy",
      "Statistical Packages: SPSS, R, PsychoPy"
    ],
    "stepByStepRoadmap": [
      "Class 12: Any stream with 75%+ marks.",
      "Undergraduate: 3-Year BA or B.Sc in Psychology.",
      "Post-Graduation: 2-Year MA or M.Sc in Applied Psychology / Clinical Psychology (TISS Mumbai, Fergusson Pune, Christ Bangalore).",
      "RCI Clinical Licensure: Complete 2-Year M.Phil in Clinical Psychology from an RCI-recognized center (NIMHANS, CIP Ranchi) or RCI-approved Psy.D.",
      "Registration: Receive official Clinical Psychologist License from Rehabilitation Council of India (RCI).",
      "Career: Work as Senior Hospital Psychologist, open private consultation studio, or consult multinational companies."
    ],
    "topColleges": [
      {
        "name": "TISS (Tata Institute of Social Sciences)",
        "location": "Deonar, Mumbai, Maharashtra",
        "type": "Premier Applied Social Sciences & Psychology Institute"
      },
      {
        "name": "Fergusson College (Autonomous)",
        "location": "FC Road, Pune",
        "type": "Top Ranked Psychology Department in Maharashtra"
      },
      {
        "name": "NIMHANS (National Institute of Mental Health and Neurosciences)",
        "location": "Bengaluru, Karnataka",
        "type": "Institute of National Importance (Apex)"
      },
      {
        "name": "St. Xavier’s College",
        "location": "Dhobi Talao, Mumbai",
        "type": "Historic Psychology Department"
      }
    ],
    "externalWebsites": [
      {
        "title": "Rehabilitation Council of India (RCI)",
        "url": "https://rehabcouncil.nic.in",
        "note": "Statutory licensing body for clinical psychologists in India"
      },
      {
        "title": "NIMHANS Official Portal",
        "url": "https://nimhans.ac.in",
        "note": "Admissions and research programs in neuropsychiatry"
      },
      {
        "title": "TISS Admissions Portal",
        "url": "https://admissions.tiss.edu",
        "note": "MA Applied Psychology and organizational human behavior programs"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Rehabilitation Council Licensed Psychologist in District Civil Hospitals, Central Armed Police Forces (CAPF Mental Health Officer), Juvenile Justice Board Counselor.",
      "examUdaanLink": "/jobs?q=psychologist",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "CUET UG: May | CUET PG / TISS: March-April | NIMHANS Entrance (M.Phil / Psy.D): May-June.",
    "portionAndSyllabus": [
      "Class 11 & 12 Psychology: Variations in Psychological Attributes, Self & Personality, Meeting Life Challenges, Psychological Disorders, Therapeutic Approaches, Attitude & Social Cognition.",
      "Advanced: Cognitive Neuropsychology, Research Statistics (SPSS), Psychometrics, Clinical Counseling."
    ],
    "examPatternSummary": "CUET UG: 50 Questions (Attempt 40), 200 Marks, 45 Minutes (+5, -1). NIMHANS M.Phil: 100 MCQs CBT, 90 mins."
  },
  {
    "id": "journalism-media-content",
    "streamId": "arts",
    "categoryId": "arts_media",
    "title": "Journalist & Digital Media Strategist (BJMC / BMM / Mass Comm)",
    "role": "Investigative Journalist, Broadcast News Anchor, Multimedia Producer, PR Communications Lead",
    "min12thStream": "Any stream in 12th (Arts, Commerce, Science)",
    "keySubjectsToScore": [
      {
        "subject": "English / Regional Language (Marathi / Hindi)",
        "minScore": "80%+",
        "reason": "Storytelling, broadcast clarity, copywriting, and speed under real-time news deadlines."
      },
      {
        "subject": "Current Affairs & Political Knowledge",
        "minScore": "75%+",
        "reason": "Tracking state politics, national budget, social movements, and global geopolitics."
      }
    ],
    "entranceExams": [
      {
        "name": "IIMC Entrance Exam",
        "body": "Indian Institute of Mass Communication (Ministry of I&B)",
        "level": "National Apex Media Institute",
        "website": "https://iimc.gov.in"
      },
      {
        "name": "CUET-UG (Mass Communication / Journalism)",
        "body": "NTA",
        "level": "National (Central Universities)",
        "website": "https://cuetug.nta.nic.in"
      },
      {
        "name": "MUMCET / SPPU Journalism Entrance",
        "body": "Mumbai University / Pune University",
        "level": "State University Programs",
        "website": "https://mu.ac.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹4 Lakhs – ₹7.5 Lakhs / year (Sub-Editor / Video Producer / Digital Reporter)",
      "mid": "₹10 Lakhs – ₹20 Lakhs / year (Senior Special Correspondent / Prime-Time Producer)",
      "senior": "₹28 Lakhs – ₹70 Lakhs+ / year (Executive Editor, Head of Digital Content, PR Director for Tech MNC)",
      "highestPaying": "Corporate Communications for Fortune 500, International News Bureaus (BBC, Reuters), Independent YouTube Digital Media Networks"
    },
    "scopeAndFuture": {
      "rating": "4.2/5 (Transformation from Print to Digital Video & Podcasts)",
      "summary": "Traditional print is being replaced by vibrant digital journalism, podcasting, investigative documentary channels on YouTube, and multi-platform content studios in Mumbai and Pune.",
      "aiImpact": "Augmented: AI writes simple press release summaries, but on-ground investigative shoe-leather reporting, whistleblower interviews, and editorial courage require authentic journalists.",
      "growthSectors": [
        "Data Journalism & Visual Infographics",
        "Podcast Production & Audio Documentaries",
        "Fact-Checking & Misinformation Debunking",
        "Public Relations (PR) & Reputation Management"
      ]
    },
    "techStackAndSkills": [
      "Video Editing & Multimedia: Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve, Canva",
      "Live Broadcasting, Microphone Articulation, Teleprompter Reading & Camera Presence",
      "Fact-Checking Verification Tools, RTI (Right to Information) Applications, Open-Source Intelligence (OSINT)"
    ],
    "stepByStepRoadmap": [
      "Class 12: Complete 10+2 with strong language proficiency; start writing articles or a personal blog.",
      "Undergraduate: 3-Year Bachelor of Mass Media (BMM / BAMMC) or BJMC (Journalism & Mass Comm).",
      "Student Portfolio: Build a portfolio of 20+ published articles, YouTube video reports, or campus radio podcasts.",
      "Post-Graduation (Optional): 1-Year PG Diploma at premier institute (IIMC New Delhi, ACJ Chennai, SIMC Pune).",
      "Internship: Work 3-6 months at top newsroom (Times of India, Indian Express, NDTV, Loksatta, Sakal) or digital outlet.",
      "Career Path: Join national news channels, become a tech/business reporter in Mumbai, or establish an independent digital channel."
    ],
    "topColleges": [
      {
        "name": "IIMC (Indian Institute of Mass Communication)",
        "location": "New Delhi & Amravati (Maharashtra)",
        "type": "Govt Apex Media Institution"
      },
      {
        "name": "Asian College of Journalism (ACJ)",
        "location": "Chennai, Tamil Nadu",
        "type": "Top Print & Broadcast Journalism Feeder"
      },
      {
        "name": "SIMC (Symbiosis Institute of Media & Communication)",
        "location": "Lavale, Pune",
        "type": "Premier Media & PR Campus"
      },
      {
        "name": "Department of Communication & Journalism, SPPU",
        "location": "Ranade Institute, Pune",
        "type": "Historic Marathi & English Journalism Nursery"
      }
    ],
    "externalWebsites": [
      {
        "title": "Indian Institute of Mass Communication (IIMC)",
        "url": "https://iimc.gov.in",
        "note": "Admissions, PG diploma courses in English, Hindi, Marathi journalism"
      },
      {
        "title": "Press Council of India (PCI)",
        "url": "https://presscouncil.nic.in",
        "note": "Journalistic ethics guidelines and press freedom charter"
      },
      {
        "title": "Ministry of Information & Broadcasting (MIB)",
        "url": "https://mib.gov.in",
        "note": "Broadcasting policies and national film/media awards"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Indian Information Service (IIS via UPSC CSE), Maharashtra DGIPR (Directorate General of Information and Public Relations — District Information Officer), Doordarshan & All India Radio News Editor.",
      "examUdaanLink": "/jobs?q=journalism",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "IIMC Entrance (via CUET PG): March-April | ACJ Entrance: May | Xavier Institute of Communications (XIC OET): April-May.",
    "portionAndSyllabus": [
      "General Awareness, Indian Constitution & Freedom of Speech, Contemporary Geopolitical Events.",
      "Analytical & Creative Writing, Investigative Article Outlining, Headline & Lead Paragraph Formulation.",
      "Media Literacy, Fact-Checking, Podcasting, Digital Video Production & SEO Copywriting."
    ],
    "examPatternSummary": "XIC OET: 150 Marks (100 Objective + 50 Subjective Creative Essay), 90 mins. IIMC Entrance: 100 Qs via CUET PG."
  },
  {
    "id": "polytechnic-diploma-engineer",
    "streamId": "vocational",
    "categoryId": "voc_diploma",
    "title": "Polytechnic Diploma Engineer (Lateral Entry to Direct 2nd Year B.Tech)",
    "role": "Junior Engineer (JE), Technical Site Supervisor, CAD Draftsman, Plant Operations Lead",
    "min12thStream": "10th Pass (with Science & Mathematics minimum 35%) OR 12th Science / ITI",
    "keySubjectsToScore": [
      {
        "subject": "Class 10th Mathematics",
        "minScore": "65%+",
        "reason": "Calculus, geometry, and algebra dictate the state CAP merit list for government polytechnics."
      },
      {
        "subject": "Class 10th Science",
        "minScore": "65%+",
        "reason": "Physics and chemistry basics determine aptitude in electrical, civil, or mechanical branches."
      }
    ],
    "entranceExams": [
      {
        "name": "Maharashtra Polytechnic CAP Admission",
        "body": "Directorate of Technical Education (DTE Maharashtra)",
        "level": "State Level Merit (Direct based on 10th/12th Marks — No entrance exam!)",
        "mode": "Centralized CAP Rounds",
        "website": "https://poly26.dtemaharashtra.gov.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹3 Lakhs – ₹5.5 Lakhs / year (Junior Engineer / Quality Inspector)",
      "mid": "₹7 Lakhs – ₹14 Lakhs / year (After Lateral B.Tech degree or 5 years experience)",
      "senior": "₹18 Lakhs – ₹35 Lakhs+ / year (Plant Manager / PWD Sectional Engineer)",
      "highestPaying": "Public Sector Undertakings (BHEL, NTPC, ONGC), PWD/MSEDCL Junior Engineer, Top Auto Ancillaries"
    },
    "scopeAndFuture": {
      "rating": "4.6/5 (Direct Pathway to Engineering with No JEE Stress)",
      "summary": "Polytechnic Diploma is the smartest alternative to 11th/12th. In 3 years, a student becomes a certified technical specialist. Even better: diploma holders get DIRECT admission into the 2nd Year of 4-Year B.Tech (Direct Second Year — DSE), saving time and bypassing JEE/CET!",
      "aiImpact": "Safe: Hands-on field civil surveying, electrical substation repair, boiler maintenance, and CNC machinery operation require on-ground technicians.",
      "growthSectors": [
        "Infrastructure Highway Construction (PWD / MSRDC)",
        "Power Transmission & Distribution (MSEDCL / Mahatransco)",
        "Automobile Manufacturing & EV Assembly",
        "Industrial Automation & PLC/SCADA"
      ]
    },
    "techStackAndSkills": [
      "CAD Drafting: AutoCAD 2D/3D, SolidWorks, Revit, Civil Surveying Total Station",
      "Electrical Systems: Circuit design, PLC programming, Substation switchgear, Wiring schematics",
      "Industrial Quality Control: Vernier calipers, micrometers, CMM testing, Safety ISO audits"
    ],
    "stepByStepRoadmap": [
      "Class 10 Pass: Apply through DTE Maharashtra online CAP rounds for Government Polytechnic.",
      "Diploma Course: Complete 3-year Diploma in your chosen engineering branch (Mechanical, Electrical, Civil, Computer).",
      "Option A (Direct Job): Get recruited directly through campus placements as Junior Engineer or appear for PWD/MSEDCL exams.",
      "Option B (Direct 2nd Year Degree): Secure 85%+ in final year of diploma to get DIRECT 2nd Year B.Tech admission at COEP, VJTI, SPPU without appearing for JEE Main or MHT-CET!",
      "Engineering Degree: Complete 3 years of degree to graduate as a full B.Tech / B.E. engineer."
    ],
    "topColleges": [
      {
        "name": "Government Polytechnic, Pune",
        "location": "Shivajinagar, Pune",
        "type": "Top Autonomous State Polytechnic"
      },
      {
        "name": "Government Polytechnic, Mumbai",
        "location": "Bandra East, Mumbai",
        "type": "Historic Premier Technical Institute"
      },
      {
        "name": "Veermata Jijabai Technological Institute (VJTI Diploma Wing)",
        "location": "Matunga, Mumbai",
        "type": "Elite Autonomous Institution"
      },
      {
        "name": "Government Polytechnic, Nagpur / Kolhapur / Karad",
        "location": "Maharashtra Districts",
        "type": "Affordable Govt Excellence"
      }
    ],
    "externalWebsites": [
      {
        "title": "DTE Maharashtra Polytechnic Portal",
        "url": "https://poly26.dtemaharashtra.gov.in",
        "note": "Option form filling, seat allotment & cutoff lists"
      },
      {
        "title": "MSBTE (Maharashtra State Board of Technical Education)",
        "url": "https://msbte.org.in",
        "note": "Official curriculum, academic calendar & exam results"
      },
      {
        "title": "AICTE Official Portal",
        "url": "https://www.aicte-india.org",
        "note": "National technical education regulator & scholarship schemes"
      }
    ],
    "govtExamSynergy": {
      "jobs": "SSC Junior Engineer (JE — Civil/Electrical/Mechanical), Maharashtra PWD Junior Engineer, MSEDCL / Mahagenco Junior Engineer, Railway Recruitment Board (RRB JE).",
      "examUdaanLink": "/jobs?q=diploma",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "DTE Maharashtra Post-SSC Polytechnic Admission: Application starts June (post Class 10 results) | CAP Seat Allotment: July-August.",
    "portionAndSyllabus": [
      "Class 10 SSC Mathematics (Algebra, Geometry, Trigonometry, Coordinate Systems).",
      "Class 10 SSC Science & Technology (Physics Forces, Electricity, Chemical Reactions).",
      "English Communication and Basic Computer Fundamentals."
    ],
    "examPatternSummary": "Direct Centralized Admission Process (CAP) based purely on Class 10th Board Marks. No separate entrance exam needed in Maharashtra!"
  },
  {
    "id": "science-teacher-professor",
    "streamId": "science",
    "categoryId": "sci_teach",
    "title": "Science Educator & College Professor (B.Sc + B.Ed → M.Sc + CSIR NET / SET)",
    "role": "PGT Physics/Chemistry/Maths, Junior College Lecturer, Assistant Professor, NEET/JEE Star Faculty",
    "min12thStream": "12th Science with PCM or PCB",
    "keySubjectsToScore": [
      {
        "subject": "Major Science Subject (Physics, Chemistry, Maths, or Biology)",
        "minScore": "80%+",
        "reason": "Deep theoretical clarity and concept pedagogy are essential for teaching and clearing CSIR NET / SET."
      },
      {
        "subject": "Pedagogy & Educational Psychology",
        "minScore": "75%+",
        "reason": "Child developmental stages, Bloom taxonomy, and teaching methodologies in B.Ed."
      }
    ],
    "entranceExams": [
      {
        "name": "MH-CET B.Ed",
        "body": "State CET Cell Maharashtra",
        "level": "State (For Government B.Ed Colleges)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "MahaTET / CTET",
        "body": "MSCE Pune / CBSE",
        "level": "State & National (Mandatory for School Teaching Paper 1 & 2)",
        "mode": "Pen-and-Paper / CBT",
        "website": "https://mahatet.in"
      },
      {
        "name": "CSIR-UGC NET & MH-SET",
        "body": "NTA / SPPU Pune",
        "level": "National & State (Mandatory for College Assistant Professor & PhD)",
        "mode": "Online CBT",
        "website": "https://setexam.unipune.ac.in"
      }
    ],
    "salaryLadder": {
      "entry": "₹4.5 Lakhs – ₹7.5 Lakhs / year (Zilla Parishad / State Govt High School Teacher — 7th Pay Level 8)",
      "mid": "₹10 Lakhs – ₹20 Lakhs / year (Aided Senior College Assistant Professor: Academic Level 10 entry ₹57,700 base)",
      "senior": "₹22 Lakhs – ₹50 Lakhs+ / year (Associate Professor / College Principal / Top JEE-NEET Coaching Institute Faculty: ₹30L - ₹1Cr)",
      "highestPaying": "Private JEE / NEET Coaching Master Faculty (Allen, FIITJEE, Aakash, PhysicsWallah), Senior University Deans"
    },
    "scopeAndFuture": {
      "rating": "4.7/5 (Exceptional Job Security & Work-Life Balance)",
      "summary": "With NEP 2020 reforms, permanent recruitment through Pavitra Portal in Maharashtra schools, and massive competitive coaching demand, qualified STEM educators enjoy high social respect, 2-month summer vacations, and pension security.",
      "aiImpact": "Safe: Interactive mentoring, classroom discipline, experimental laboratory guidance, and student motivation require dedicated human educators.",
      "growthSectors": [
        "Competitive JEE & NEET Coaching Faculty",
        "EdTech Digital Master Teacher & Content Creator",
        "STEM Laboratory Research Mentorship",
        "University Science Chairs"
      ]
    },
    "techStackAndSkills": [
      "Digital Interactive Smart Boards, PhET Science Interactive Simulations, GeoGebra",
      "Laboratory Safety & Experiments: Chemistry Titrations, Physics Optics/Vernier, Biology Microscopes",
      "Classroom Management, High Verbal Articulation & Concept Simplification"
    ],
    "stepByStepRoadmap": [
      "Class 12: Science stream with 60%+ marks.",
      "Undergraduate: 3-Year B.Sc in Physics, Chemistry, Mathematics, or Botany/Zoology.",
      "School Teaching Route: 2-Year B.Ed (Bachelor of Education) via MH-CET B.Ed + Clear CTET / MahaTET + Apply via Pavitra Portal.",
      "College Professor Route: Complete 2-Year M.Sc with 55%+ marks + Clear CSIR-NET or MH-SET (State Eligibility Test).",
      "University Career: Complete Ph.D. to become Associate Professor and University Research Guide."
    ],
    "topColleges": [
      {
        "name": "Savitribai Phule Pune University (SPPU Science Faculty)",
        "location": "Pune, Maharashtra",
        "type": "Premier State University"
      },
      {
        "name": "Fergusson College (Autonomous)",
        "location": "Pune",
        "type": "Historic Science Nursery"
      },
      {
        "name": "St. Xavier’s College",
        "location": "Mumbai",
        "type": "Premier Autonomous Science College"
      },
      {
        "name": "Government College of Education (B.Ed)",
        "location": "Mumbai & Pune",
        "type": "Premier State Training Colleges"
      }
    ],
    "externalWebsites": [
      {
        "title": "MH-SET Official Portal (SPPU Pune)",
        "url": "https://setexam.unipune.ac.in",
        "note": "Maharashtra State Eligibility Test for Assistant Professor"
      },
      {
        "title": "CSIR-UGC NET Official",
        "url": "https://csirnet.nta.nic.in",
        "note": "National eligibility for Junior Research Fellowship and Lectureship"
      },
      {
        "title": "Maharashtra Pavitra Portal",
        "url": "https://pavitra.mahateacherrecruitment.org.in",
        "note": "Centralized teacher recruitment in Maharashtra schools"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Maharashtra Shikshak Bharti (Pavitra Portal), Kendriya Vidyalaya Sangathan (KVS PGT/TGT), Navodaya Vidyalaya (NVS), MPSC Assistant Professor (Govt Arts & Science Colleges).",
      "examUdaanLink": "/jobs?q=teacher",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "UGC NET / CSIR NET: Conducted bi-annually in June & December | MH-SET (Maharashtra): April | Maha TET / CTET: December & July.",
    "portionAndSyllabus": [
      "UGC NET Paper 1 (Common to all): Teaching Aptitude, Research Aptitude, Comprehension, Communication, Mathematical Reasoning, Data Interpretation, ICT, People & Environment, Higher Education System (50 Qs, 100 Marks).",
      "Paper 2: In-depth Post-Graduate Subject Specialization (Physics, Chemistry, Life Sciences, Mathematics, History, etc.) — 100 Qs, 200 Marks."
    ],
    "examPatternSummary": "UGC / CSIR NET: 150 Questions, 300 Marks, 3 Hours, No Negative Marking. Top 6% qualify for Assistant Professor; top 1% receive Junior Research Fellowship (JRF) with ₹37,000/month scholarship."
  },
  {
    "id": "bba-mba-business-leadership",
    "streamId": "commerce",
    "categoryId": "com_mgmt",
    "title": "Business Leader & Management Consultant (BBA / BMS → MBA)",
    "role": "Management Consultant, Brand Product Manager, Operations Director, Human Resource Leader",
    "min12thStream": "Any stream in 12th (Commerce, Science, or Arts eligible)",
    "keySubjectsToScore": [
      {
        "subject": "Quantitative Aptitude & Data Interpretation",
        "minScore": "80%+",
        "reason": "Data-driven business decisions and CAT/XAT/CET exam cutoff percentiles."
      },
      {
        "subject": "Verbal Ability & Business Communication",
        "minScore": "80%+",
        "reason": "Corporate presentations, client negotiation, and MBA case-study discussions."
      }
    ],
    "entranceExams": [
      {
        "name": "IIM IPMAT (5-Year Integrated BBA+MBA)",
        "body": "IIM Indore / Rohtak / Ranchi / Jammu / Bodh Gaya",
        "level": "National (Direct after 12th)",
        "mode": "Online CBT",
        "website": "https://www.iimidr.ac.in"
      },
      {
        "name": "CAT (Common Admission Test)",
        "body": "IIMs",
        "level": "National (For 21 IIMs, FMS Delhi, SPJIMR Mumbai)",
        "mode": "Online CBT",
        "website": "https://iimcat.ac.in"
      },
      {
        "name": "MAH MBA CET",
        "body": "State CET Cell Maharashtra",
        "level": "State (For JBIMS Mumbai, SIMSREE, PUMBA)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      }
    ],
    "salaryLadder": {
      "entry": "₹12 Lakhs – ₹32 Lakhs / year (Campus placement from Top-10 B-Schools: McKinsey, BCG, HUL, Amazon)",
      "mid": "₹30 Lakhs – ₹65 Lakhs / year (Engagement Manager / Director of Marketing)",
      "senior": "₹80 Lakhs – ₹2.5 Crore+ / year (Country Managing Director / Chief Executive Officer / Startup Co-Founder)",
      "highestPaying": "Strategy Consulting (MBB: McKinsey, Bain, BCG), Global FMCG Brand Management (Unilever, P&G), Tech Product Management"
    },
    "scopeAndFuture": {
      "rating": "4.9/5 (Universal Demand Across Every Industry)",
      "summary": "Whether in technology, healthcare, manufacturing, or finance, organizations run on leaders who understand strategy, unit economics, supply chains, and human motivation. Top MBA graduates dominate the global corporate hierarchy.",
      "aiImpact": "Augmented: AI provides data analytics, but executive strategic vision, cross-cultural team management, corporate turnaround, and venture leadership remain human-driven.",
      "growthSectors": [
        "Product Management in AI/Tech",
        "Supply Chain Logistics & Global Sourcing",
        "Healthcare & Hospital Management",
        "Venture Capital & Private Equity Portfolio Operations"
      ]
    },
    "techStackAndSkills": [
      "Business Frameworks: Porter’s Five Forces, MECE Problem Solving, BCG Matrix, Six Sigma",
      "Analytics Tools: Advanced Excel, SQL, Tableau, Power BI, Jira, Salesforce CRM",
      "Executive Leadership: Public speaking, stakeholder negotiation, and P&L accountability"
    ],
    "stepByStepRoadmap": [
      "Class 12: Score 75%+ in any stream; prepare for IPMAT or join premier undergraduate college (BBA, B.Com, BMS, or B.Tech).",
      "Undergraduate: Complete 3-year bachelor degree or 4-year engineering; lead student clubs and organize collegiate festivals.",
      "Work Experience (Recommended): Work 2-3 years at corporate company (delivers huge bonus points in IIM shortlisting).",
      "CAT / MBA Entrance: Score 99%+ in CAT (for IIMs / FMS / SPJIMR) or 99.9%+ in MAH MBA CET (for JBIMS Mumbai).",
      "MBA Degree: 2-Year rigorous case-pedagogy curriculum + 2-month summer internship.",
      "Placement: Land high-paying management consulting, marketing, or general management roles during final campus placements."
    ],
    "topColleges": [
      {
        "name": "Jamnalal Bajaj Institute of Management Studies (JBIMS)",
        "location": "Churchgate, Mumbai",
        "type": "Top ROI MBA College in India"
      },
      {
        "name": "IIM Ahmedabad & IIM Bangalore",
        "location": "National Apex",
        "type": "Top Tier-1 Global B-Schools"
      },
      {
        "name": "SPJIMR (SP Jain Institute of Management and Research)",
        "location": "Andheri, Mumbai",
        "type": "Ranked Top 5 in India"
      },
      {
        "name": "SIMSREE (Sydenham Institute of Management)",
        "location": "Churchgate, Mumbai",
        "type": "Premier Govt MBA Institute"
      }
    ],
    "externalWebsites": [
      {
        "title": "IIM CAT Official Portal",
        "url": "https://iimcat.ac.in",
        "note": "Registration, syllabus, mock tests for IIM admissions"
      },
      {
        "title": "MAH MBA CET Portal",
        "url": "https://cetcell.mahacet.org",
        "note": "Centralized admission process (CAP) for JBIMS, SIMSREE"
      },
      {
        "title": "IIM Indore IPMAT Admissions",
        "url": "https://www.iimidr.ac.in",
        "note": "5-Year integrated management dual degree after 12th"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Public Sector Undertaking (PSU) Management Trainee (HR/Marketing/Finance), State Bank of India Probationary Officer (SBI PO), RBI Grade B Officer.",
      "examUdaanLink": "/jobs?q=management",
      "mockTestLink": "/mock-tests"
    },
    "examDatesAndCycles": "IIM IPMAT: May | CAT (Common Admission Test for 21 IIMs): Last Sunday of November | MAH MBA CET: March-April | XAT: January.",
    "portionAndSyllabus": [
      "Quantitative Aptitude: Arithmetic, Algebra, Geometry, Modern Maths, Numbers.",
      "Data Interpretation & Logical Reasoning (DILR): Seating arrangements, matrix puzzles, bar charts, venn diagrams.",
      "Verbal Ability & Reading Comprehension (VARC): Long comprehension passages, para-jumbles, summary completion, sentence insertion."
    ],
    "examPatternSummary": "CAT: 66 Questions, 198 Marks, 2 Hours (+3, -1). MAH MBA CET: 200 Questions, 200 Marks, 2.5 Hours, No Negative Marking."
  },
  {
    "id": "civil-engineering",
    "streamId": "science",
    "categoryId": "sci_eng",
    "title": "Civil & Infrastructure Engineer (B.Tech / B.E.)",
    "role": "Structural Design Engineer, Metro & Highway Project Lead, Geotechnical Consultant, PWD Executive Engineer",
    "min12thStream": "12th Science with PCM (Physics, Chemistry, Maths)",
    "keySubjectsToScore": [
      {
        "subject": "Mathematics (Calculus, Trigonometry)",
        "minScore": "75%+",
        "reason": "Structural stress analysis, beam deflection, and fluid dynamics require calculus."
      },
      {
        "subject": "Physics (Mechanics, Statics)",
        "minScore": "75%+",
        "reason": "Forces in equilibrium, material strength, shear forces, and seismology."
      }
    ],
    "entranceExams": [
      {
        "name": "MHT-CET (PCM)",
        "body": "State CET Cell Maharashtra",
        "level": "State (COEP, VJTI)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "JEE Main",
        "body": "NTA",
        "level": "National (NITs, IIITs)",
        "mode": "Online CBT",
        "website": "https://jeemain.nta.nic.in"
      },
      {
        "name": "GATE (Civil Engineering - CE)",
        "body": "IITs",
        "level": "National PSU & M.Tech",
        "mode": "Online CBT",
        "website": "https://gate2026.iit.ac.in"
      }
    ],
    "examDatesAndCycles": "Registration: Dec-Feb | Exams: Apr-May (MHT-CET / JEE) | GATE: February every year | Results: June.",
    "portionAndSyllabus": [
      "Structural Engineering: Mechanics of Solids, RCC Design, Steel Structures, Earthquake Engineering.",
      "Geotechnical & Environmental: Soil Mechanics, Foundation Design, Water Treatment, Waste Management.",
      "Transportation & Surveying: Highway Geometric Design, Traffic Engineering, Total Station GIS Surveying."
    ],
    "examPatternSummary": "MHT-CET: 150 Questions, 200 Marks, 3 Hours, No Negative. GATE CE: 65 Qs, 100 Marks, 3 Hours.",
    "salaryLadder": {
      "entry": "₹4.5 Lakhs – ₹8.5 Lakhs / year",
      "mid": "₹12 Lakhs – ₹25 Lakhs / year (3–7 yrs)",
      "senior": "₹30 Lakhs – ₹70 Lakhs+ / year (Chief Structural Consultant, Infrastructure VP)",
      "highestPaying": "Global EPC Mega-Projects (L&T, Afcons, Tata Projects, Bechtel), PWD Class-1 Gazetted Engineers"
    },
    "scopeAndFuture": {
      "rating": "4.6/5 (Unprecedented Indian Infrastructure Spending)",
      "summary": "India is investing over ₹111 Lakh Crores under the National Infrastructure Pipeline (NIP) for bullet trains, metros, coastal roads, expressways, and green smart cities.",
      "aiImpact": "Safe: BIM 3D modeling and drone surveying assist engineers, but on-ground site safety, soil foundation testing, and concrete pour inspections require civil engineers.",
      "growthSectors": [
        "High-Speed Rail & Metro Systems",
        "Coastal & Maritime Port Engineering",
        "Green Building & Sustainable Construction",
        "Tunneling & Hydro-Power Dams"
      ]
    },
    "techStackAndSkills": [
      "BIM & CAD: Autodesk Revit, AutoCAD 3D, Bentley MicroStation",
      "Structural Analysis: STAAD.Pro, ETABS, SAP2000, SAFE",
      "Project Management: Primavera P6, MS Project, Total Station, GIS / QGIS"
    ],
    "stepByStepRoadmap": [
      "Class 12: PCM stream with 75%+ score.",
      "Entrance: Score 95%+ in MHT-CET or crack JEE Main.",
      "Graduation: 4-Year B.Tech in Civil Engineering.",
      "Field Experience: Site internships on high-rise or bridge construction; learn STAAD.Pro and Revit.",
      "Career: Join top infrastructure giants (L&T, Shapoorji Pallonji) or clear MPSC / IES for PWD Executive Engineer."
    ],
    "topColleges": [
      {
        "name": "COEP Technological University",
        "location": "Pune (Pioneering Civil Department)",
        "type": "State Govt Autonomous"
      },
      {
        "name": "VJTI Mumbai",
        "location": "Matunga, Mumbai",
        "type": "Premier State Engineering"
      },
      {
        "name": "IIT Bombay",
        "location": "Powai, Mumbai",
        "type": "National Apex"
      },
      {
        "name": "Walchand College of Engineering",
        "location": "Sangli",
        "type": "Govt Aided"
      }
    ],
    "externalWebsites": [
      {
        "title": "Institution of Engineers (India)",
        "url": "https://www.ieindia.org",
        "note": "Professional charter and technical conventions"
      },
      {
        "title": "Ministry of Road Transport and Highways (MoRTH)",
        "url": "https://morth.nic.in",
        "note": "National highway projects and specifications"
      },
      {
        "title": "DTE Maharashtra Engineering Admission",
        "url": "https://cetcell.mahacet.org",
        "note": "CAP round counseling for civil engineering"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Maharashtra PWD Assistant Engineer (Class-1/2 via MPSC), UPSC Indian Engineering Services (IES), Railway IRSE Officer, Municipal Corporation (BMC) Sub-Engineer.",
      "examUdaanLink": "/jobs?q=civil",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "electrical-electronics-engineering",
    "streamId": "science",
    "categoryId": "sci_eng",
    "title": "Electrical, Electronics & Semiconductor Engineer (B.Tech EE / ECE / VLSI)",
    "role": "VLSI Chip Designer, Power Grid Automation Specialist, Embedded Firmware Developer, Renewable Energy Engineer",
    "min12thStream": "12th Science with PCM (Physics, Chemistry, Maths)",
    "keySubjectsToScore": [
      {
        "subject": "Physics (Electromagnetism, Modern Physics)",
        "minScore": "80%+",
        "reason": "Semiconductor physics, Maxwell equations, AC circuits, and quantum electronics."
      },
      {
        "subject": "Mathematics (Calculus, Complex Numbers)",
        "minScore": "75%+",
        "reason": "Laplace transforms, Fourier series, signal processing, and electromagnetic wave equations."
      }
    ],
    "entranceExams": [
      {
        "name": "JEE Main & Advanced",
        "body": "NTA / IITs",
        "level": "National",
        "mode": "Online CBT",
        "website": "https://jeemain.nta.nic.in"
      },
      {
        "name": "MHT-CET (PCM)",
        "body": "State CET Cell",
        "level": "Maharashtra",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "GATE (EE / EC)",
        "body": "IITs",
        "level": "National Master/PSU",
        "mode": "Online CBT",
        "website": "https://gate2026.iit.ac.in"
      }
    ],
    "examDatesAndCycles": "Registration: Dec-Feb | Entrance: Apr-May | GATE: February | Results: June.",
    "portionAndSyllabus": [
      "Circuits & Systems: Network Theory, Control Systems, Signals & Systems, Power Systems.",
      "Electronics & VLSI: Digital Logic, Microprocessors, Analog Circuits, CMOS VLSI Design, Verilog / VHDL.",
      "Electromagnetics: Transmission Lines, Waveguides, Antennas, Semiconductor Physics."
    ],
    "examPatternSummary": "MHT-CET: 150 Qs, 200 Marks | JEE Main: 75 Qs, 300 Marks | GATE: 65 Qs, 100 Marks.",
    "salaryLadder": {
      "entry": "₹6.5 Lakhs – ₹16 Lakhs / year",
      "mid": "₹22 Lakhs – ₹45 Lakhs / year (3–7 yrs)",
      "senior": "₹55 Lakhs – ₹1.3 Crore+ / year (Principal VLSI Architect, Silicon Director)",
      "highestPaying": "Global Semiconductor Giants (NVIDIA, Intel, Qualcomm, Texas Instruments, Apple Hardware, AMD)"
    },
    "scopeAndFuture": {
      "rating": "5/5 (Historic Indian Semiconductor Mission — ₹76,000 Cr)",
      "summary": "India's semiconductor mission and mega-fabs in Gujarat and Maharashtra are creating unprecedented demand for silicon chip designers, verification engineers, and smart power grid specialists.",
      "aiImpact": "Core Enabler: AI chips (GPUs, NPUs) must be designed by VLSI engineers; you build the hardware that powers artificial intelligence.",
      "growthSectors": [
        "5nm/3nm VLSI Silicon Chip Design",
        "Electric Vehicle Powertrain & BMS",
        "Smart Power Grids & Renewable Solar/Wind",
        "IoT & Defense Radar Electronics"
      ]
    },
    "techStackAndSkills": [
      "Hardware Description Languages: Verilog, SystemVerilog, VHDL, UVM Verification",
      "EDA Tools: Synopsys, Cadence Virtuoso, Mentor Graphics, MATLAB Simulink",
      "Embedded Software: C, C++, ARM Cortex Microcontrollers, RTOS, PCB Design (Altium)"
    ],
    "stepByStepRoadmap": [
      "Class 12: Score 80%+ in PCM; focus on electromagnetism and circuits.",
      "Graduation: 4-Year B.Tech in Electronics / Electrical / ECE / VLSI.",
      "Specialization: Master Verilog, FPGA prototyping, and PCB design in college labs.",
      "Internship: Secure technical internship at semiconductor or automotive electronics firms.",
      "Placement: Join top chip companies (Qualcomm, Intel, NVIDIA) or crack GATE for Power Grid / Mahatransco / ISRO."
    ],
    "topColleges": [
      {
        "name": "IIT Bombay (Microelectronics Hub)",
        "location": "Powai, Mumbai",
        "type": "Premier National"
      },
      {
        "name": "COEP Technological University",
        "location": "Pune",
        "type": "State Autonomous"
      },
      {
        "name": "VJTI Mumbai",
        "location": "Matunga, Mumbai",
        "type": "State Autonomous"
      },
      {
        "name": "Sardar Patel Institute of Technology (SPIT)",
        "location": "Andheri, Mumbai",
        "type": "Autonomous College"
      }
    ],
    "externalWebsites": [
      {
        "title": "India Semiconductor Mission (ISM)",
        "url": "https://ism.gov.in",
        "note": "National policies, chip design subsidies, and fab updates"
      },
      {
        "title": "IEEE India Council",
        "url": "https://ieeeindiacouncil.org",
        "note": "Global electrical and electronics engineering society"
      },
      {
        "title": "GATE Official Portal",
        "url": "https://gate2026.iit.ac.in",
        "note": "PSU recruitment gateway for PowerGrid, NTPC, BHEL"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Mahatransco / MSEDCL Assistant Engineer, Power Grid Corporation (PGCIL), ISRO Scientist SC (Electronics), BARC Scientific Officer, Railway Signal & Telecom Engineer.",
      "examUdaanLink": "/jobs?q=electrical",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "barch-architecture",
    "streamId": "science",
    "categoryId": "sci_arch_aviation",
    "title": "Architect & Urban Designer (B.Arch — Council of Architecture)",
    "role": "Licensed Architect, Sustainable Building Designer, Interior Architect, Urban Town Planner",
    "min12thStream": "12th Science with Physics, Chemistry and Mathematics (Mandatory COA Norm)",
    "keySubjectsToScore": [
      {
        "subject": "Mathematics",
        "minScore": "70%+",
        "reason": "Calculations of loads, structural coordinates, scale geometry, and area floor space index (FSI/FAR)."
      },
      {
        "subject": "Aptitude & Spatial Drawing",
        "minScore": "80%+",
        "reason": "3D visualization, perspective drawing, light/shadow rendering, and architectural aesthetics."
      }
    ],
    "entranceExams": [
      {
        "name": "NATA (National Aptitude Test in Architecture)",
        "body": "Council of Architecture (COA)",
        "level": "National (Mandatory for all B.Arch in India)",
        "mode": "Online CBT + Drawing (Multiple attempts April-July)",
        "website": "https://www.nata.in"
      },
      {
        "name": "JEE Main (Paper 2A — B.Arch)",
        "body": "NTA",
        "level": "National (For IITs, NITs, SPAs)",
        "mode": "Online CBT + Drawing",
        "website": "https://jeemain.nta.nic.in"
      }
    ],
    "examDatesAndCycles": "Registration: Feb-Mar | NATA Tests: Every weekend from April to July | JEE Paper 2: Jan & Apr | Council Counselling: July-August.",
    "portionAndSyllabus": [
      "Diagrammatic & Spatial Reasoning: 3D pattern folding, orthographic projections, isometric visualization.",
      "Aesthetic Sensitivity: Color theory, visual harmony, architectural history, building materials.",
      "Mathematics & Physics: Geometric dimensions, trigonometric heights, optics, light and shadow."
    ],
    "examPatternSummary": "NATA: 200 Marks, 125 Questions (MCQ, MSQ, PCQ, Drawing), 3 Hours, No Negative Marking.",
    "salaryLadder": {
      "entry": "₹4 Lakhs – ₹7.5 Lakhs / year (Junior Architect in Design Firm)",
      "mid": "₹10 Lakhs – ₹22 Lakhs / year (Project Architect / Senior Interior Designer)",
      "senior": "₹28 Lakhs – ₹75 Lakhs+ / year (Principal Architect of Own Studio, Urban Planning Consultant)",
      "highestPaying": "High-End Luxury Residential Studios, Sustainable Green Commercial Campuses, Airport & Waterfront Design"
    },
    "scopeAndFuture": {
      "rating": "4.5/5 (Real Estate & Smart City Urbanization Boom)",
      "summary": "Only registered architects holding a Council of Architecture (COA) registration number can legally sign and submit building sanction plans to municipal corporations (BMC, PMC, MMRDA).",
      "aiImpact": "Collaborative: AI generative tools (Midjourney, DALL-E) produce early moodboards, but structural stability, building bye-laws, NBC compliance, and site execution strictly require human architects.",
      "growthSectors": [
        "Net-Zero Carbon Green Architecture",
        "Urban Transit-Oriented Developments (TOD)",
        "Heritage Conservation & Adaptive Reuse",
        "High-Tech Computational Parametric Design"
      ]
    },
    "techStackAndSkills": [
      "BIM & 3D Modeling: Autodesk Revit, ArchiCAD, Rhino 3D, Grasshopper, SketchUp",
      "Rendering & Visualization: Lumion, V-Ray, Enscape, Twinmotion, Adobe Photoshop",
      "Codes & Standards: National Building Code (NBC), Development Control Regulations (DCR), LEED Green Certification"
    ],
    "stepByStepRoadmap": [
      "Class 12: Complete 10+2 with Physics, Chemistry & Maths (minimum 50% aggregate).",
      "Entrance: Score 130+ out of 200 in NATA or 98%+ percentile in JEE Paper 2A.",
      "Undergraduate: 5-Year B.Arch academic course (including 6-month mandatory practical training in an architecture firm).",
      "COA Registration: Receive official Architect License (CA Number) from Council of Architecture, New Delhi.",
      "Practice: Join prestigious international firms (Foster + Partners, Hafeez Contractor) or open independent design studio."
    ],
    "topColleges": [
      {
        "name": "Sir J. J. College of Architecture",
        "location": "Fort, Mumbai (Asia's Oldest Architecture School)",
        "type": "Govt Premier Historic"
      },
      {
        "name": "SPA New Delhi (School of Planning and Architecture)",
        "location": "New Delhi",
        "type": "National Institute of Importance"
      },
      {
        "name": "CEPT University",
        "location": "Ahmedabad, Gujarat",
        "type": "World-Renowned Design Campus"
      },
      {
        "name": "BKPS College of Architecture",
        "location": "Sadashiv Peth, Pune",
        "type": "Premier State College"
      }
    ],
    "externalWebsites": [
      {
        "title": "Council of Architecture (COA India)",
        "url": "https://www.coa.gov.in",
        "note": "Statutory registration authority for all architects in India"
      },
      {
        "title": "NATA Official Portal",
        "url": "https://www.nata.in",
        "note": "National Aptitude Test in Architecture registration & brochures"
      },
      {
        "title": "Indian Institute of Architects (IIA)",
        "url": "https://www.indianinstituteofarchitects.com",
        "note": "National association of practicing architects"
      }
    ],
    "govtExamSynergy": {
      "jobs": "CIDCO / MMRDA Assistant Town Planner, Maharashtra Town Planning & Valuation Directorate (Class-1 via MPSC), Military Engineer Services (MES Architect), CPWD Architect.",
      "examUdaanLink": "/jobs?q=architect",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "bsc-nursing",
    "streamId": "science",
    "categoryId": "sci_med",
    "title": "Professional Nursing Specialist (B.Sc Nursing → M.Sc Nursing)",
    "role": "Critical Care ICU Nurse, Pediatric Nurse Specialist, Nursing Officer, Clinical Nurse Educator",
    "min12thStream": "12th Science with PCB (Physics, Chemistry, Biology & English)",
    "keySubjectsToScore": [
      {
        "subject": "Biology (Anatomy & Physiology)",
        "minScore": "75%+",
        "reason": "Human biology, microbiology, genetics, and organ pathology form 50% of nursing training."
      },
      {
        "subject": "English Language",
        "minScore": "75%+",
        "reason": "Mandatory for international nursing licensure (OET / IELTS) and medical documentation."
      }
    ],
    "entranceExams": [
      {
        "name": "MH-B.Sc Nursing CET",
        "body": "State CET Cell Maharashtra",
        "level": "State Level (Mandatory for all Maharashtra colleges)",
        "mode": "Online CBT (May)",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "AIIMS B.Sc Nursing Entrance",
        "body": "AIIMS New Delhi",
        "level": "National (For AIIMS Institutes across India)",
        "mode": "Online CBT",
        "website": "https://aiimsexams.ac.in"
      },
      {
        "name": "Military Nursing Service (MNS via NEET-UG)",
        "body": "Indian Army (DGMS)",
        "level": "Defense Armed Forces",
        "mode": "NEET-UG + Interview",
        "website": "https://joinindianarmy.nic.in"
      }
    ],
    "examDatesAndCycles": "Registration: Feb-Mar | CET / AIIMS Exam: May-June | Counselling: July-August.",
    "portionAndSyllabus": [
      "Physics, Chemistry, Biology: NCERT Class 11 and 12 curriculum.",
      "General Knowledge & Nursing Aptitude: Basic clinical awareness, first aid, healthcare ethics.",
      "English Proficiency: Grammar, comprehension, and medical vocabulary."
    ],
    "examPatternSummary": "MH-B.Sc Nursing CET: 100 MCQs, 100 Marks, 90 Minutes, No Negative Marking.",
    "salaryLadder": {
      "entry": "₹3.5 Lakhs – ₹7.5 Lakhs / year in India | $65,000 – $95,000 / year Abroad (US / UK NHS / Canada / Gulf)",
      "mid": "₹8 Lakhs – ₹16 Lakhs / year in India (ICU In-Charge / Nursing Supervisor)",
      "senior": "₹18 Lakhs – ₹35 Lakhs / year in India (Chief Nursing Officer - CNO, Hospital VP Nursing)",
      "highestPaying": "Global Overseas Nursing: UK NHS, US NCLEX-RN registered nurses ($80,000+), Australian AHPRA nurses"
    },
    "scopeAndFuture": {
      "rating": "5/5 (Massive Global Nursing Shortage Worldwide)",
      "summary": "Nurses are the backbone of modern hospitals. With severe healthcare worker shortages in the UK, USA, Germany, Australia, and the Gulf, Indian B.Sc Nursing graduates enjoy 100% employment rates and fastest international work visas.",
      "aiImpact": "Completely Safe: Direct patient physical monitoring, administering intravenous injections, bedside emotional care, and emergency CPR can never be automated.",
      "growthSectors": [
        "International Healthcare Migration (NCLEX-RN / OET)",
        "Cardiology & Neonatal ICU Specialty",
        "Dialysis & Oncology Chemotherapy Centers",
        "Clinical Trial Nurse Coordinators"
      ]
    },
    "techStackAndSkills": [
      "Clinical Life Support: BLS (Basic Life Support), ACLS (Advanced Cardiac Life Support)",
      "Medical Devices: Mechanical Ventilators, Infusion Pumps, Multipara Monitors, Defibrillators",
      "Sterilization, Infection Control Protocols & Electronic Health Record Documentation"
    ],
    "stepByStepRoadmap": [
      "Class 12: PCB stream with minimum 50% marks in Physics, Chemistry, Biology & English.",
      "Entrance: Appear for MH-B.Sc Nursing CET or AIIMS Nursing Entrance Exam.",
      "Undergraduate: 4-Year B.Sc Nursing degree (including intensive hospital rotatory clinical postings).",
      "State Council Registration: Register with Maharashtra Nursing Council (MNC) to receive Registered Nurse (RN) / Registered Midwife (RM) license.",
      "Career Choice A (Govt Job): Clear AIIMS NORCET exam to become Grade-B Gazetted Nursing Officer (₹75,000/month starting).",
      "Career Choice B (Global): Clear OET / IELTS and NCLEX-RN to practice in the United States, UK, or Australia."
    ],
    "topColleges": [
      {
        "name": "AIIMS New Delhi / AIIMS Nagpur",
        "location": "New Delhi / Nagpur",
        "type": "Premier Institute of National Importance"
      },
      {
        "name": "College of Nursing, Grant Govt Medical College",
        "location": "Byculla, Mumbai",
        "type": "Premier State Govt College"
      },
      {
        "name": "Armed Forces Medical College (AFMC College of Nursing)",
        "location": "Pune",
        "type": "Indian Armed Forces (Commissioned Lieutenant)"
      },
      {
        "name": "Christian Medical College (CMC)",
        "location": "Vellore, Tamil Nadu",
        "type": "World-Renowned Nursing Institute"
      }
    ],
    "externalWebsites": [
      {
        "title": "Indian Nursing Council (INC)",
        "url": "https://indiannursingcouncil.org",
        "note": "Statutory body regulating nursing standards in India"
      },
      {
        "title": "Maharashtra Nursing Council",
        "url": "https://mahanursingcouncil.org",
        "note": "State registration, renewal, and verification"
      },
      {
        "title": "AIIMS Exams Portal (NORCET)",
        "url": "https://aiimsexams.ac.in",
        "note": "Nursing Officer Recruitment Common Eligibility Test"
      }
    ],
    "govtExamSynergy": {
      "jobs": "AIIMS Nursing Officer (NORCET — Level 7 Pay Scale ₹44,900 base), Maharashtra DMER Staff Nurse, Railway Staff Nurse, Military Nursing Service (Lieutenant rank).",
      "examUdaanLink": "/jobs?q=nurse",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "bpt-physiotherapy",
    "streamId": "science",
    "categoryId": "sci_med",
    "title": "Physiotherapist & Sports Rehabilitation Specialist (BPT → MPT)",
    "role": "Sports Team Physiotherapist, Neuro-Rehab Specialist, Orthopedic Consultant, Ergonomics Advisor",
    "min12thStream": "12th Science with PCB (Physics, Chemistry, Biology)",
    "keySubjectsToScore": [
      {
        "subject": "Biology (Anatomy, Musculoskeletal)",
        "minScore": "75%+",
        "reason": "Muscle origins/insertions, joint biomechanics, spinal neurology, and motor control."
      },
      {
        "subject": "Physics (Biomechanics, Electrotherapy)",
        "minScore": "70%+",
        "reason": "Levers in human body, electro-physical modalities (Ultrasound, TENS, IFT, Lasers)."
      }
    ],
    "entranceExams": [
      {
        "name": "NEET-UG",
        "body": "NTA",
        "level": "National (Mandatory for Maharashtra BPT seats)",
        "mode": "Pen-and-Paper OMR",
        "website": "https://neet.nta.nic.in"
      }
    ],
    "examDatesAndCycles": "Registration: Feb-Mar | NEET Exam: First Sunday of May | DMER State CAP Rounds: July-August.",
    "portionAndSyllabus": [
      "NEET-UG Syllabus: Full NCERT Biology (Botany & Zoology), Chemistry, and Physics.",
      "College Curriculum: Human Anatomy, Exercise Therapy, Biomechanics, Orthopedics, Neurology, Sports Medicine."
    ],
    "examPatternSummary": "NEET-UG: 720 Marks, 180 Questions, 3 Hours 20 Minutes.",
    "salaryLadder": {
      "entry": "₹4 Lakhs – ₹7.5 Lakhs / year (Clinical Physiotherapist)",
      "mid": "₹10 Lakhs – ₹22 Lakhs / year (MPT Specialist / Sports Rehab Lead)",
      "senior": "₹25 Lakhs – ₹60 Lakhs+ / year (Celebrity / National Sports Team Physio, Private Rehab Clinic Chain Owner)",
      "highestPaying": "BCCI / IPL Franchise Team Physiotherapist, Olympic Sports Rehabilitation Centers, Corporate Ergonomics"
    },
    "scopeAndFuture": {
      "rating": "4.7/5 (Booming in Sports, Lifestyle Posture, and Post-Surgical Rehab)",
      "summary": "With sedentary desk jobs causing widespread spinal/neck issues and India's booming professional sports culture (IPL, PKL, ISL), skilled sports and musculoskeletal physiotherapists command high consultation fees (₹800–₹2,500 per session).",
      "aiImpact": "100% Safe: Hands-on manual therapy, spinal mobilization, dry needling, and kinesiology movement assessments require physical human touch.",
      "growthSectors": [
        "Sports Science & Athletic Injury Management",
        "Geriatric Fall Prevention & Stroke Rehabilitation",
        "Corporate Ergonomics & Workstation Health",
        "Pediatric Cerebral Palsy Rehab"
      ]
    },
    "techStackAndSkills": [
      "Therapeutic Equipment: Shockwave Therapy, Cryotherapy, High-Intensity Laser, Hydrotherapy",
      "Techniques: Maitland / Mulligan Joint Mobilization, Dry Needling, Kinesio Taping, Cupping",
      "Movement Analysis: EMG Muscle Activation, Gait Analysis, Force Plates"
    ],
    "stepByStepRoadmap": [
      "Class 12: PCB stream with qualifying NEET-UG score.",
      "Admission: Secure BPT seat through DMER Maharashtra State AYUSH/Allied CAP rounds.",
      "Undergraduate: 4.5 Years Bachelor of Physiotherapy (BPT) including 6-Month Compulsory Clinical Internship.",
      "Council Registration: Register with Maharashtra State Occupational Therapy & Physiotherapy Council (MSOTPTC).",
      "Master Degree: Complete 2-Year MPT (Sports, Musculoskeletal, Neuro, or Cardio-Pulmonary).",
      "Practice: Attach with top hospitals (Kokilaben, Hinduja, Jupiter), join sports franchises, or establish private clinic."
    ],
    "topColleges": [
      {
        "name": "Seth GS Medical College & KEM Hospital (Physiotherapy School)",
        "location": "Parel, Mumbai",
        "type": "Pioneering Premier Institute"
      },
      {
        "name": "Topiwala National Medical College (TNMC & Nair Hospital)",
        "location": "Mumbai Central",
        "type": "Top Municipal Govt Institute"
      },
      {
        "name": "Sancheti Institute College of Physiotherapy",
        "location": "Shivajinagar, Pune",
        "type": "India's Premier Orthopedic & Rehab Hospital"
      },
      {
        "name": "Government Medical College (GMC Physiotherapy)",
        "location": "Nagpur",
        "type": "Top State Govt Institute"
      }
    ],
    "externalWebsites": [
      {
        "title": "Maharashtra State OT/PT Council",
        "url": "https://msotptcouncil.org",
        "note": "Statutory practitioner registration in Maharashtra"
      },
      {
        "title": "Indian Association of Physiotherapists (IAP)",
        "url": "https://www.physiotherapyindia.org",
        "note": "National professional body for physiotherapists"
      },
      {
        "title": "DMER Maharashtra Health Sciences",
        "url": "https://www.med-edu.in",
        "note": "BPT seat allotment & cutoff lists"
      }
    ],
    "govtExamSynergy": {
      "jobs": "District Civil Hospital Physiotherapist (Class-2 via MPSC), Sports Authority of India (SAI) Physiotherapist, Railway Hospital Physiotherapist, Defense Military Hospitals.",
      "examUdaanLink": "/jobs?q=physiotherapy",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "veterinary-doctor-bvsc",
    "streamId": "science",
    "categoryId": "sci_pure",
    "title": "Veterinary Doctor & Animal Surgeon (B.V.Sc & A.H. — Animal Husbandry)",
    "role": "Veterinary Surgeon, Wildlife Veterinarian, Dairy & Poultry Geneticist, Companion Pet Specialist",
    "min12thStream": "12th Science with PCB (Physics, Chemistry, Biology & English)",
    "keySubjectsToScore": [
      {
        "subject": "Biology (Zoology & Physiology)",
        "minScore": "75%+",
        "reason": "Comparative mammalian anatomy, genetics, animal nutrition, and pathology."
      },
      {
        "subject": "Chemistry",
        "minScore": "70%+",
        "reason": "Veterinary pharmacology, anesthetics, and bio-toxicology."
      }
    ],
    "entranceExams": [
      {
        "name": "NEET-UG",
        "body": "NTA",
        "level": "National (Mandatory for VCI 15% quota & MAFSU Maharashtra 85% quota)",
        "mode": "Pen-and-Paper OMR",
        "website": "https://neet.nta.nic.in"
      }
    ],
    "examDatesAndCycles": "Registration: Feb-Mar | NEET Exam: May | MAFSU Online Admissions: July-August.",
    "portionAndSyllabus": [
      "NEET-UG: Physics, Chemistry, Biology (NCERT Class 11 & 12).",
      "College Curriculum: Veterinary Anatomy, Pharmacology, Surgery, Animal Reproduction (Theriogenology), Preventive Medicine."
    ],
    "examPatternSummary": "NEET-UG: 720 Marks, 180 Questions, 3 Hours 20 Mins.",
    "salaryLadder": {
      "entry": "₹5 Lakhs – ₹9 Lakhs / year (Livestock Development Officer / Pet Clinic Associate)",
      "mid": "₹12 Lakhs – ₹25 Lakhs / year (Senior Veterinary Surgeon / Established Pet Hospital)",
      "senior": "₹28 Lakhs – ₹65 Lakhs+ / year (Chain Pet Hospital Owner, International Wildlife Specialist)",
      "highestPaying": "Private Companion Pet Hospitals in Metro Cities (Mumbai, Pune, Bangalore), Multinational Veterinary Pharma (Zoetis, Boehringer)"
    },
    "scopeAndFuture": {
      "rating": "4.6/5 (Booming Pet Care Economy + Government Dairy Mission)",
      "summary": "Urban pet parenting is exploding in India, turning small-animal veterinary clinics into highly profitable enterprises. In rural Maharashtra, Livestock Development Officers (LDO) play vital roles in livestock economy.",
      "aiImpact": "Safe: Performing orthopedic bone plating on animals, emergency c-sections on cows/dogs, and compassionate animal handling require human veterinary doctors.",
      "growthSectors": [
        "High-End Canine & Feline Speciality Clinics",
        "Equine (Racehorse) Medicine & Surgery (Mahalaxmi/Pune Racecourse)",
        "Wildlife Rescue & National Park Wildlife Health",
        "Dairy & Poultry Agribusiness"
      ]
    },
    "techStackAndSkills": [
      "Animal Surgery: Gas Inhalation Anesthesia, Laparoscopy, Digital X-Ray, Sonography",
      "Animal Pathology: Blood automated analyzers, Urinalysis, Bacterial cultures",
      "Gentle Animal Restraint, Compassion, and Zoonotic Disease Prevention"
    ],
    "stepByStepRoadmap": [
      "Class 12: PCB stream with qualifying NEET-UG marks (typically 450-550 marks for govt veterinary colleges).",
      "Counseling: Apply via MAFSU (Maharashtra Animal & Fishery Sciences University) or VCI (Veterinary Council of India).",
      "Undergraduate: 5.5 Years B.V.Sc & A.H. course (including 1-Year mandatory rotatory clinical internship in cattle and pet hospitals).",
      "Registration: Register with Maharashtra State Veterinary Council (MSVC) / VCI.",
      "Career Path: (A) Clear MPSC exam for Livestock Development Officer (Class-1 Gazetted), (B) Open private small-animal hospital in Mumbai/Pune, (C) Pursue M.V.Sc in Surgery / Medicine."
    ],
    "topColleges": [
      {
        "name": "Bombay Veterinary College (BVC)",
        "location": "Parel, Mumbai (India's Oldest Veterinary College, Est. 1886)",
        "type": "Premier State Govt College"
      },
      {
        "name": "Nagpur Veterinary College (MAFSU Headquarters)",
        "location": "Seminary Hills, Nagpur",
        "type": "State Veterinary University"
      },
      {
        "name": "College of Veterinary & Animal Sciences",
        "location": "Udgir / Parbhani / Shirwal",
        "type": "Top State Campuses"
      },
      {
        "name": "IVRI (Indian Veterinary Research Institute)",
        "location": "Bareilly, Uttar Pradesh",
        "type": "National Deemed University"
      }
    ],
    "externalWebsites": [
      {
        "title": "Veterinary Council of India (VCI)",
        "url": "https://vci.dadf.gov.in",
        "note": "Central statutory body regulating veterinary practice"
      },
      {
        "title": "MAFSU Admissions Portal",
        "url": "https://mafsu.ac.in",
        "note": "Maharashtra Animal & Fishery Sciences University admissions"
      },
      {
        "title": "Department of Animal Husbandry, Govt of India",
        "url": "https://dahd.nic.in",
        "note": "National livestock schemes and epidemiological updates"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Maharashtra Livestock Development Officer (LDO Group-A via MPSC), Animal Husbandry Commissionerate Veterinary Officer, Central Zoo Authority Veterinarian, Military Remount Veterinary Corps (RVC Captain).",
      "examUdaanLink": "/jobs?q=veterinary",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "agriculture-bsc-agri",
    "streamId": "science",
    "categoryId": "sci_pure",
    "title": "Agricultural Scientist & Agribusiness Manager (B.Sc Agriculture / Agri-Biotech)",
    "role": "Agronomist, Agricultural Officer, Seed & Crop Protection Specialist, Drone Farming Consultant, Agribusiness Executive",
    "min12thStream": "12th Science with PCB or PCMB (Physics, Chemistry, Biology / Maths)",
    "keySubjectsToScore": [
      {
        "subject": "Biology (Botany, Plant Pathology)",
        "minScore": "75%+",
        "reason": "Plant genetics, soil microbiology, crop physiology, and entomology."
      },
      {
        "subject": "Chemistry (Agricultural & Soil Chemistry)",
        "minScore": "70%+",
        "reason": "Fertilizer formulations, pesticide chemistry, soil pH, and nutrient uptake."
      }
    ],
    "entranceExams": [
      {
        "name": "MHT-CET (PCB or PCM)",
        "body": "State CET Cell Maharashtra",
        "level": "State (For all 4 Agriculture Universities in Maharashtra)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "CUET-ICAR (AIEEA-UG)",
        "body": "NTA / ICAR",
        "level": "National (For Central Agricultural Universities & National Talent Scholarship)",
        "mode": "Online CBT",
        "website": "https://icar.nta.nic.in"
      }
    ],
    "examDatesAndCycles": "Registration: Feb-Mar | Exam: April-May | MCAER Maharashtra CAP Rounds: July-August.",
    "portionAndSyllabus": [
      "MHT-CET / ICAR Syllabus: Physics, Chemistry, Biology / Mathematics (Class 11 & 12).",
      "Core B.Sc Agri Topics: Agronomy, Genetics & Plant Breeding, Soil Science, Horticulture, Agricultural Economics, Plant Pathology, Entomology."
    ],
    "examPatternSummary": "MHT-CET: 150 Qs, 200 Marks | ICAR AIEEA: 150 Qs, 600 Marks (+4/-1).",
    "salaryLadder": {
      "entry": "₹4.5 Lakhs – ₹8 Lakhs / year (Agriculture Field Officer in Bank / Seed Agronomist)",
      "mid": "₹12 Lakhs – ₹24 Lakhs / year (Territory Agribusiness Manager / Fertilizer Product Lead)",
      "senior": "₹28 Lakhs – ₹65 Lakhs+ / year (VP Agribusiness MNC, AgTech Startup Founder)",
      "highestPaying": "Global Agro-Chemical MNCs (Bayer, Syngenta, UPL, Corteva), Public Sector Banking Agricultural Field Officers (AFO)"
    },
    "scopeAndFuture": {
      "rating": "4.6/5 (Technology Transformation via Precision Farming & Drones)",
      "summary": "Agriculture in Maharashtra is modernizing rapidly with sensor-based drip irrigation, agricultural drone pesticide spraying, organic export certifications, and agri-fintech platforms (Kisan Credit, e-NAM).",
      "aiImpact": "Augmented: Satellite multispectral imaging and AI soil sensors guide farmers, but on-field crop disease inspection, hybridization breeding, and farm advisory require agricultural experts.",
      "growthSectors": [
        "Precision Drone Farming & Geo-Tagging",
        "Organic Hydroponics & Vertical Farming",
        "Agri-Biotech Seed Breeding & Gene Editing",
        "Agro-Logistics & Cold Storage Supply Chains"
      ]
    },
    "techStackAndSkills": [
      "Precision AgTech: Agricultural Spraying Drones (DGCA Remote Pilot Certified), GIS Farm Mapping",
      "Soil & Crop Analytics: Soil Testing Kits, Near-Infrared (NIR) Grain Spectrophotometry",
      "Agronomic Trial Design, Farm Economics Budgeting, and Rural Farmer Advisory Communication"
    ],
    "stepByStepRoadmap": [
      "Class 12: PCB or PCMB stream with 60%+ marks (12 bonus points given in Maharashtra to students from farmer families!).",
      "Entrance: Score well in MHT-CET or CUET-ICAR.",
      "Undergraduate: 4-Year B.Sc (Hons) Agriculture from an ICAR-accredited university.",
      "Rural Agricultural Work Experience (RAWE): Complete 6-month hands-on village residency and industry attachment in 7th/8th semester.",
      "Career Choice A (Bank Exam): Clear IBPS SO (Agricultural Field Officer — AFO) for immediate Scale-1 Bank Officer job.",
      "Career Choice B (MPSC/UPSC): Clear Maharashtra Agriculture Services (MPSC) for Taluka Agriculture Officer (TAO) / Class-1 post.",
      "Career Choice C (Corporate): Join Bayer, UPL, or Mahindra Agri in seed sales and technical research."
    ],
    "topColleges": [
      {
        "name": "College of Agriculture, Pune (MPKV Rahuri)",
        "location": "Shivajinagar, Pune (Est. 1907)",
        "type": "Historic Premier Agricultural Campus"
      },
      {
        "name": "MPKV (Mahatma Phule Krishi Vidyapeeth)",
        "location": "Rahuri, Ahmednagar",
        "type": "State Agricultural University"
      },
      {
        "name": "PDKV (Dr. Panjabrao Deshmukh Krishi Vidyapeeth)",
        "location": "Akola, Maharashtra",
        "type": "State Agricultural University"
      },
      {
        "name": "IARI (Indian Agricultural Research Institute — Pusa)",
        "location": "New Delhi",
        "type": "Apex Agricultural University in India (NIRF #1)"
      }
    ],
    "externalWebsites": [
      {
        "title": "Indian Council of Agricultural Research (ICAR)",
        "url": "https://icar.org.in",
        "note": "Apex regulatory body for agricultural education & research"
      },
      {
        "title": "Maharashtra Council of Agricultural Education and Research (MCAER)",
        "url": "https://mcaer.org",
        "note": "Centralized admission body for Maharashtra agriculture universities"
      },
      {
        "title": "NABARD Official Careers",
        "url": "https://www.nabard.org",
        "note": "National Bank for Agriculture and Rural Development Grade A recruitment"
      }
    ],
    "govtExamSynergy": {
      "jobs": "IBPS Agricultural Field Officer (Scale-1 Officer in Nationalized Banks), Maharashtra Agriculture Service (MPSC Class-1/2), NABARD Grade A Officer, Food Corporation of India (FCI) Technical Manager.",
      "examUdaanLink": "/jobs?q=agriculture",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "bca-mca-software",
    "streamId": "science",
    "categoryId": "sci_cs",
    "title": "Software Developer via Computer Applications (BCA → MCA / B.Sc IT)",
    "role": "Frontend / Backend Developer, Mobile App Developer, Database Administrator, Web Systems Engineer",
    "min12thStream": "12th in Science, Commerce, or Arts (Mathematics / Statistics in 12th preferred)",
    "keySubjectsToScore": [
      {
        "subject": "Mathematics or Computer Science",
        "minScore": "70%+",
        "reason": "Logic gates, discrete structures, boolean algebra, and programming problem solving."
      },
      {
        "subject": "English Proficiency",
        "minScore": "70%+",
        "reason": "Technical documentation, code reading, and corporate communications."
      }
    ],
    "entranceExams": [
      {
        "name": "MAH-BCA / BBA-CET",
        "body": "State CET Cell Maharashtra",
        "level": "State Level (For all AICTE BCA colleges)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "MAH-MCA-CET",
        "body": "State CET Cell Maharashtra",
        "level": "State (For VJTI, SPPU, Mumbai Univ MCA)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "NIMCET",
        "body": "NITs Consortium",
        "level": "National (For MCA admission in National Institutes of Technology)",
        "mode": "Online CBT",
        "website": "https://nimcet.admissions.nic.in"
      }
    ],
    "examDatesAndCycles": "Registration: Feb-Mar | CET Exam: April-May | NIMCET: June | CAP Admission: July-August.",
    "portionAndSyllabus": [
      "Mathematics: Coordinate Geometry, Probability, Trigonometry, Vectors, Algebra.",
      "Logical & Abstract Reasoning: Coding-decoding, series, puzzles, Venn diagrams, pattern recognition.",
      "Computer Concepts: Basics of C, C++, Data representation, Operating systems, Internet basics."
    ],
    "examPatternSummary": "MAH-MCA-CET: 100 Questions, 200 Marks, 90 Minutes. NIMCET: 120 Questions, 1000 Marks (+4/-1).",
    "salaryLadder": {
      "entry": "₹4 Lakhs – ₹8 Lakhs / year (BCA fresher) | ₹7 Lakhs – ₹18 Lakhs / year (MCA from top NIT / VJTI)",
      "mid": "₹16 Lakhs – ₹35 Lakhs / year (Full-Stack Engineer / Tech Lead)",
      "senior": "₹45 Lakhs – ₹90 Lakhs+ / year (Engineering Manager, Software Architect)",
      "highestPaying": "Product Companies (Amazon, Flipkart, Atlassian), Fintech Startups, Remote Global Software Roles"
    },
    "scopeAndFuture": {
      "rating": "4.8/5 (Fastest Alternative to B.Tech Engineering)",
      "summary": "BCA + MCA is recognized by all tech MNCs as equal to B.Tech Computer Science for developer and software architect roles. It allows non-JEE students to enter mainstream software engineering with less stress.",
      "aiImpact": "Augmented: Code co-pilots speed up syntax writing, but frontend user experience, API orchestration, and business logic implementation require human software developers.",
      "growthSectors": [
        "React / Next.js Modern Full-Stack Development",
        "Mobile App Development (Flutter, React Native)",
        "Cloud Database Administration",
        "SaaS Enterprise Software"
      ]
    },
    "techStackAndSkills": [
      "Frontend: JavaScript, TypeScript, React.js, Next.js, HTML5/CSS3, Tailwind CSS",
      "Backend & APIs: Node.js, Express, Python FastAPI, Java Spring Boot, REST & GraphQL",
      "Databases: PostgreSQL, MySQL, MongoDB, Firebase, Supabase"
    ],
    "stepByStepRoadmap": [
      "Class 12: Complete 10+2 with Mathematics/Computer (minimum 50%).",
      "Undergraduate: 3-Year BCA or B.Sc Computer Science / B.Sc IT.",
      "Coding Focus: Build 5+ full-stack web and mobile applications on GitHub, learn Git/GitHub.",
      "Master Degree (High-Yield): Prepare for NIMCET (for NIT MCA) or MAH-MCA-CET (for VJTI / SPPU MCA).",
      "Campus Placement: Appear for tech company coding rounds (DSA) in final year of MCA to land top developer jobs."
    ],
    "topColleges": [
      {
        "name": "VJTI Mumbai (MCA Department)",
        "location": "Matunga, Mumbai",
        "type": "Premier State Autonomous"
      },
      {
        "name": "Savitribai Phule Pune University (Department of Computer Science - PUCSD)",
        "location": "Pune",
        "type": "Renowned MCA Department"
      },
      {
        "name": "NIT Trichy / NIT Surathkal / NIT Warangal",
        "location": "National Campuses (via NIMCET)",
        "type": "Institutes of National Importance"
      },
      {
        "name": "Symbiosis Institute of Computer Studies and Research (SICSR)",
        "location": "Atur Centre, Pune",
        "type": "Top Private Institute"
      }
    ],
    "externalWebsites": [
      {
        "title": "NIMCET Official Portal",
        "url": "https://nimcet.admissions.nic.in",
        "note": "National MCA common entrance test for NITs"
      },
      {
        "title": "State CET Cell Maharashtra (MCA)",
        "url": "https://cetcell.mahacet.org",
        "note": "Centralized admission process for Maharashtra MCA"
      },
      {
        "title": "GitHub Learning Lab",
        "url": "https://github.com",
        "note": "Host real software repositories and collaborate"
      }
    ],
    "govtExamSynergy": {
      "jobs": "National Informatics Centre (NIC Scientific Assistant), State Police Cyber Cell IT Officer, Railway Junior Engineer (IT), Public Sector Bank IT Officer (IBPS SO IT).",
      "examUdaanLink": "/jobs?q=computer",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "cybersecurity-ethical-hacking",
    "streamId": "science",
    "categoryId": "sci_cs",
    "title": "Cyber Security Analyst & Ethical Hacker (B.Tech / B.Sc Cyber Security)",
    "role": "SOC Analyst, Penetration Tester, Incident Responder, Cryptographer, Chief Information Security Officer (CISO)",
    "min12thStream": "12th Science with PCM or Computer Science",
    "keySubjectsToScore": [
      {
        "subject": "Computer Science / Information Technology",
        "minScore": "80%+",
        "reason": "Networking (TCP/IP, OSI layers), operating systems (Linux/Windows internals), and Python scripting."
      },
      {
        "subject": "Mathematics (Discrete Maths, Cryptography)",
        "minScore": "75%+",
        "reason": "Encryption algorithms (RSA, AES, Elliptic Curves) and hashing functions."
      }
    ],
    "entranceExams": [
      {
        "name": "NFSU Entrance Exam (NFAT)",
        "body": "National Forensic Sciences University",
        "level": "National Apex Forensic & Cyber Campus",
        "mode": "Online CBT",
        "website": "https://nfsu.ac.in"
      },
      {
        "name": "JEE Main / MHT-CET",
        "body": "NTA / CET Cell",
        "level": "National / State",
        "mode": "Online CBT",
        "website": "https://jeemain.nta.nic.in"
      }
    ],
    "examDatesAndCycles": "Registration: Feb-Apr | NFAT Exam: June-July | Admission: August.",
    "portionAndSyllabus": [
      "Networking & Protocols: TCP/IP, DNS, DHCP, HTTP/S, Firewalls, VPNs, Wireshark packet capture.",
      "Security Fundamentals: CIA Triad, Vulnerability Assessment, Malware Analysis, OWASP Top 10.",
      "Linux & Scripting: Bash, Linux file permissions, Python automation, Metasploit, Nmap."
    ],
    "examPatternSummary": "NFAT: 100 MCQs, 100 Marks, 90 Minutes. MHT-CET: Standard PCM engineering pattern.",
    "salaryLadder": {
      "entry": "₹6 Lakhs – ₹14 Lakhs / year (SOC Analyst Tier-1 / Junior Pentester)",
      "mid": "₹18 Lakhs – ₹38 Lakhs / year (Senior Penetration Tester / Red Team Lead)",
      "senior": "₹50 Lakhs – ₹1.2 Crore+ / year (Chief Information Security Officer - CISO, Bug Bounty Hunter)",
      "highestPaying": "Global Banks (JPMorgan, HSBC, Barclays Cyber SOC), Defense Agencies, Independent Bug Bounty Hunters (HackerOne: $50,000+ bounties)"
    },
    "scopeAndFuture": {
      "rating": "5/5 (Zero Unemployment Rate Globally)",
      "summary": "As banking, government records, and critical infrastructure move to the cloud, cyber warfare, ransomware, and data leaks make cybersecurity experts the most sought-after defense personnel in the corporate and government world.",
      "aiImpact": "Armour vs Weapon: AI is used by hackers to generate malware, which means cyber security defenders must use AI defensive tools to protect networks in real time.",
      "growthSectors": [
        "Cloud Security Architecture (AWS/Azure Security)",
        "Zero Trust Network Architecture",
        "Critical Infrastructure Protection (Power grids, Defense)",
        "IoT & Automotive Vehicle Cyber Security"
      ]
    },
    "techStackAndSkills": [
      "Tools: Wireshark, Burp Suite, Nmap, Metasploit, Kali Linux, Nessus, Splunk SIEM",
      "Certifications to Pursue: CEH (Certified Ethical Hacker), CompTIA Security+, OSCP (Offensive Security Certified Professional), CISSP",
      "Operating Systems: Deep Linux kernel administration, Windows Active Directory exploitation"
    ],
    "stepByStepRoadmap": [
      "Class 12: Complete 10+2 Science with good understanding of networking and Linux.",
      "Undergraduate: B.Tech in Cyber Security, B.Tech Computer Science, or B.Sc Forensic Science at NFSU.",
      "Practical Lab: Practice on ethical platforms (HackTheBox, TryHackMe, PortSwigger Web Security Academy).",
      "Certifications: Clear CompTIA Security+ in 2nd year and CEH / OSCP in 3rd/4th year.",
      "Career Entry: Join corporate Security Operations Centers (SOC) or work with national defense cyber agencies."
    ],
    "topColleges": [
      {
        "name": "NFSU (National Forensic Sciences University)",
        "location": "Gandhinagar / Pune / Goa",
        "type": "Institution of National Importance (Ministry of Home Affairs)"
      },
      {
        "name": "IIT Jammu / IIT Kanpur (Center for Cyber Security)",
        "location": "National",
        "type": "Premier Research Labs"
      },
      {
        "name": "COEP Technological University",
        "location": "Pune",
        "type": "Top State Engineering"
      },
      {
        "name": "MIT World Peace University",
        "location": "Kothrud, Pune",
        "type": "Specialized Cyber Security Wing"
      }
    ],
    "externalWebsites": [
      {
        "title": "CERT-In (Indian Computer Emergency Response Team)",
        "url": "https://www.cert-in.org.in",
        "note": "National agency for cybersecurity incident response"
      },
      {
        "title": "National Forensic Sciences University (NFSU)",
        "url": "https://nfsu.ac.in",
        "note": "Admissions to specialized cyber security and digital forensics programs"
      },
      {
        "title": "TryHackMe & HackTheBox",
        "url": "https://tryhackme.com",
        "note": "Industry recognized gamified hands-on cybersecurity training"
      }
    ],
    "govtExamSynergy": {
      "jobs": "National Technical Research Organisation (NTRO Cyber Scientist), CERT-In Security Analyst, Maharashtra State Cyber Police Inspector, Intelligence Bureau (IB ACIO Technical), Defense Cyber Agency.",
      "examUdaanLink": "/jobs?q=cyber",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "defense-officer-nda",
    "streamId": "science",
    "categoryId": "sci_arch_aviation",
    "title": "Commissioned Defense Officer — Army, Navy & Air Force (NDA / CDS)",
    "role": "Lieutenant (Army), Sub-Lieutenant (Navy), Flying Officer (Air Force), Defense Leader",
    "min12thStream": "12th Science with Physics and Maths (For Navy & Air Force) | Any Stream (For Army)",
    "keySubjectsToScore": [
      {
        "subject": "Mathematics (11th & 12th Algebra, Trigonometry, Calculus)",
        "minScore": "80%+",
        "reason": "Paper 1 of the NDA written examination is 100% Mathematics (300 marks, 120 questions)."
      },
      {
        "subject": "General Ability (English, Physics, Chemistry, GK, History)",
        "minScore": "75%+",
        "reason": "Paper 2 GAT covers 600 marks with English (200M) and General Science/Current Affairs (400M)."
      }
    ],
    "entranceExams": [
      {
        "name": "NDA & NA Exam (National Defence Academy)",
        "body": "UPSC (Twice a year: NDA I & NDA II)",
        "level": "National (For Class 12 appearing/passed students)",
        "mode": "Pen-and-Paper OMR",
        "website": "https://upsc.gov.in"
      },
      {
        "name": "SSB Interview (Service Selection Board)",
        "body": "Ministry of Defence",
        "level": "5-Day Psychological & Officer Potential Evaluation",
        "mode": "In-person residential board",
        "website": "https://joinindianarmy.nic.in"
      }
    ],
    "examDatesAndCycles": "NDA I: Notification Dec, Exam April | NDA II: Notification May, Exam September | SSB: July-October / Jan-April.",
    "portionAndSyllabus": [
      "Mathematics (300 Marks): Matrices, Determinants, Trigonometry, Analytical Geometry, Differential & Integral Calculus, Vector Algebra, Statistics & Probability.",
      "GAT Part A (200 Marks): English grammar, vocabulary, idioms, reading comprehension.",
      "GAT Part B (400 Marks): Physics (mechanics, electricity), Chemistry, General Science, Indian History & Freedom Movement, Geography, Current Events."
    ],
    "examPatternSummary": "Written Exam: 900 Marks (Maths 300M + GAT 600M, 5 Hours) + 5-Day SSB Interview: 900 Marks. Total 1800 Marks.",
    "salaryLadder": {
      "entry": "₹11 Lakhs – ₹18 Lakhs / year (Lieutenant / Flying Officer: Level 10 Pay Matrix ₹56,100 base + Military Service Pay ₹15,500 + Flying/High-Altitude Allowance + Free Rations, Officers Mess, Bunglow)",
      "mid": "₹22 Lakhs – ₹38 Lakhs / year (Major / Lieutenant Colonel / Wing Commander)",
      "senior": "₹45 Lakhs – ₹70 Lakhs+ / year (Brigadier / Major General / Air Vice Marshal / General - Chief of Defense Staff)",
      "highestPaying": "Fighter Pilots, Special Forces (Para SF / MARCOS / Garud), Submarine Service (High risk submarine allowances)"
    },
    "scopeAndFuture": {
      "rating": "5/5 (Supreme Honor, Gallantry & Sovereign Defense Leadership)",
      "summary": "An officer in the Indian Armed Forces commands troops, modern battle tanks, nuclear submarines, and supersonic fighter jets. Unmatched camaraderie, pension, medical care (ECHS), and life of adventure.",
      "aiImpact": "Immune: Battlefield tactical decision-making, physical combat endurance, moral leadership under enemy fire, and defense sovereignty can never be outsourced to software.",
      "growthSectors": [
        "Fifth-Generation Fighter Aviation (Rafale, Tejas)",
        "Naval Aircraft Carriers & Nuclear Submarines",
        "Special Forces Counter-Terrorism Operations",
        "Integrated Cyber & Aerospace Command"
      ]
    },
    "techStackAndSkills": [
      "15 Officer Like Qualities (OLQs): Effective Intelligence, Leadership, Courage, Stamina, Social Adaptability",
      "Weaponry & Warfare: Tactical maneuvers, Small arms marksmanship, Map reading, Navigation",
      "Peak Physical Fitness: Running 2.4 km in under 10 minutes, push-ups, chin-ups, rope climbing, obstacle course"
    ],
    "stepByStepRoadmap": [
      "Age Requirement: 16.5 to 19.5 years old.",
      "Class 12: Appear for NDA written examination in 12th standard (April or September).",
      "Written Exam: Score 360+ out of 900 marks to clear the cutoff.",
      "SSB Interview: Clear 5-day SSB interview at Bhopal, Allahabad, Bengaluru, Kapurthala, or Dehradun (Screening, Psych tests, GTO outdoor tasks, Conference).",
      "Medical Board: Pass rigorous military medical examination at Armed Forces hospitals.",
      "Academy Training: Join National Defence Academy (NDA), Khadakwasla, Pune for 3 years of joint military training (awarded B.Sc / B.A. / B.Tech from JNU) + 1 Year at IMA Dehradun / AFA Dundigal / INA Ezhimala.",
      "Commissioning: Commissioned as Lieutenant / Sub-Lieutenant / Flying Officer with presidential scroll!"
    ],
    "topColleges": [
      {
        "name": "National Defence Academy (NDA)",
        "location": "Khadakwasla, Pune, Maharashtra (The Cradle of Military Leadership)",
        "type": "Apex Tri-Services Academy"
      },
      {
        "name": "Indian Military Academy (IMA)",
        "location": "Dehradun, Uttarakhand",
        "type": "Army Officer Training"
      },
      {
        "name": "Air Force Academy (AFA)",
        "location": "Dundigal, Hyderabad",
        "type": "Air Force Pilots & Ground Duty"
      },
      {
        "name": "Indian Naval Academy (INA)",
        "location": "Ezhimala, Kerala",
        "type": "Naval Officer Training"
      }
    ],
    "externalWebsites": [
      {
        "title": "UPSC NDA Official Portal",
        "url": "https://upsc.gov.in",
        "note": "Exam notifications, admit cards, and written exam syllabi"
      },
      {
        "title": "Join Indian Army Official Portal",
        "url": "https://joinindianarmy.nic.in",
        "note": "SSB center dates, call letters, and medical fitness standards"
      },
      {
        "title": "Join Indian Air Force (Career Air Force)",
        "url": "https://careerindianairforce.cdac.in",
        "note": "Flying branch pilot selection guidelines"
      },
      {
        "title": "Join Indian Navy Portal",
        "url": "https://www.joinindiannavy.gov.in",
        "note": "Naval academy and executive officer entry"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Commissioned Officer in Indian Army, Indian Navy, Indian Air Force, Indian Coast Guard (Assistant Commandant), CAPF Assistant Commandant (BSF, CRPF, CISF via UPSC).",
      "examUdaanLink": "/jobs?q=defense",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "cs-company-secretary",
    "streamId": "commerce",
    "categoryId": "com_prof",
    "title": "Company Secretary (CS — ICSI Corporate Governance)",
    "role": "Chief Governance Officer, Board of Directors Legal Advisor, Compliance Head, NCLT Legal Representative",
    "min12thStream": "12th in Commerce, Arts, or Science (All streams eligible)",
    "keySubjectsToScore": [
      {
        "subject": "Secretarial Practice & Commercial Law",
        "minScore": "80%+",
        "reason": "Companies Act, SEBI regulations, board meeting resolutions, and statutory filings."
      },
      {
        "subject": "Economics & Business Communication",
        "minScore": "75%+",
        "reason": "Corporate drafting, annual report governance disclosures, and shareholder communication."
      }
    ],
    "entranceExams": [
      {
        "name": "CSEET (CS Executive Entrance Test)",
        "body": "Institute of Company Secretaries of India (ICSI)",
        "level": "National (Held 4 times a year: Jan, May, July, Nov)",
        "mode": "Online Remote Proctored CBT",
        "website": "https://www.icsi.edu"
      },
      {
        "name": "CS Executive (Level 2)",
        "body": "ICSI",
        "level": "National Professional Exam",
        "mode": "Pen-and-Paper (June & Dec)",
        "website": "https://www.icsi.edu"
      },
      {
        "name": "CS Professional (Level 3)",
        "body": "ICSI",
        "level": "Apex Corporate Governance Examination",
        "mode": "Pen-and-Paper (June & Dec)",
        "website": "https://www.icsi.edu"
      }
    ],
    "examDatesAndCycles": "CSEET: 4 windows (Jan, May, July, Nov) | CS Executive & Professional: Twice a year in June & December.",
    "portionAndSyllabus": [
      "Company Law & Practice: Incorporation, share capital, debentures, board meetings, director duties, CSR regulations.",
      "Securities Laws & Capital Markets: SEBI Listing Regulations (LODR), Insider Trading, Takeover Code, IPO filings.",
      "Economic & Commercial Laws: FEMA (Foreign Exchange), Competition Act, Insolvency & Bankruptcy Code (IBC), Intellectual Property."
    ],
    "examPatternSummary": "CSEET: 200 Marks, 140 Questions, 120 Minutes, No Negative Marking. Executive & Professional: 100 Marks descriptive subjective papers per subject.",
    "salaryLadder": {
      "entry": "₹7 Lakhs – ₹14 Lakhs / year (Assistant Company Secretary in Listed Enterprise)",
      "mid": "₹18 Lakhs – ₹38 Lakhs / year (Company Secretary & Head of Legal / Compliance)",
      "senior": "₹45 Lakhs – ₹1.2 Crore+ / year (VP Corporate Governance, Group General Counsel, NCLT Senior Practitioner)",
      "highestPaying": "BSE & NSE Top-100 Listed Corporations (Reliance, Tata, Infosys, HDFC Bank), Investment Banks, Top Law Firms"
    },
    "scopeAndFuture": {
      "rating": "4.8/5 (Mandatory Statutory Requirement for Listed Companies)",
      "summary": "Under Section 203 of the Companies Act 2013, every listed company and every public company with paid-up capital of ₹10 Crores or more MUST appoint a full-time qualified Company Secretary.",
      "aiImpact": "Augmented: Automated tools check filing forms, but high-stakes board minutes drafting, handling hostile takeovers, and SEBI insider trading defense require qualified human CS.",
      "growthSectors": [
        "ESG & Corporate Sustainability Governance",
        "Insolvency & Bankruptcy (Resolution Professional under IBC)",
        "SEBI Capital Market Regulations & Public IPOs",
        "Cross-Border FDI & FEMA Inbound Investments"
      ]
    },
    "techStackAndSkills": [
      "MCA21 Portal: e-filing of ROC forms (AOC-4, MGT-7, DIR-12, CHG-1)",
      "Corporate Drafting: Board resolutions, notices of AGMs, directors' reports, secretarial audit reports",
      "Statutory Mastery: Companies Act 2013, SEBI LODR Regulations, FEMA, Arbitration & Conciliation"
    ],
    "stepByStepRoadmap": [
      "Class 12: Appear for 12th Board; register online for CSEET (CS Executive Entrance Test).",
      "CSEET Exam: Clear CSEET online proctored exam (minimum 40% in each paper and 50% aggregate).",
      "CS Executive: Clear both groups of CS Executive examination (covering Company Law, Securities Law, Tax, Accounting).",
      "Practical Training: Complete 21 Months of practical corporate training in a listed company or under a practicing CS.",
      "CS Professional: Clear all groups of CS Professional examination.",
      "Membership: Receive ACS (Associate Company Secretary) credentials from ICSI and join corporate leadership!"
    ],
    "topColleges": [
      {
        "name": "ICSI (Direct Statutory Route via Self-Study & Distance Learning)",
        "location": "New Delhi (HQ) + Mumbai / Pune / Nagpur Chapters",
        "type": "Statutory Parliamentary Body"
      },
      {
        "name": "Complementary Degree: Narsee Monjee College / Podar College",
        "location": "Mumbai",
        "type": "Top Commerce Colleges"
      },
      {
        "name": "Government Law College (GLC) / ILS Pune (Dual CS + LLB)",
        "location": "Mumbai / Pune",
        "type": "Unbeatable CS + Law Synergy"
      }
    ],
    "externalWebsites": [
      {
        "title": "Institute of Company Secretaries of India (ICSI)",
        "url": "https://www.icsi.edu",
        "note": "Registration, syllabus, e-learning portal & training guidelines"
      },
      {
        "title": "Ministry of Corporate Affairs (MCA)",
        "url": "https://www.mca.gov.in",
        "note": "MCA21 portal, company filings, and circulars"
      },
      {
        "title": "SEBI Official Portal",
        "url": "https://www.sebi.gov.in",
        "note": "Securities market regulations and compliance orders"
      }
    ],
    "govtExamSynergy": {
      "jobs": "SEBI Grade A Officer (Legal / General), Serious Fraud Investigation Office (SFIO Company Law Specialist), Public Sector Undertakings (PSU Company Secretary — BHEL, ONGC, NTPC), National Company Law Tribunal (NCLT Registrar).",
      "examUdaanLink": "/jobs?q=secretary",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "cma-cost-accountant",
    "streamId": "commerce",
    "categoryId": "com_prof",
    "title": "Cost & Management Accountant (CMA — ICMAI)",
    "role": "Cost Auditor, Industrial Pricing Strategist, Plant Financial Controller, Management Decision Specialist",
    "min12thStream": "12th in Commerce, Science, or Arts",
    "keySubjectsToScore": [
      {
        "subject": "Cost Accounting & Bookkeeping",
        "minScore": "80%+",
        "reason": "Marginal costing, standard costing, variance analysis, and plant operational efficiency."
      },
      {
        "subject": "Mathematics & Business Statistics",
        "minScore": "75%+",
        "reason": "Linear programming, quantitative techniques, operational research, and probability in pricing."
      }
    ],
    "entranceExams": [
      {
        "name": "CMA Foundation",
        "body": "Institute of Cost Accountants of India (ICMAI)",
        "level": "National (Twice a year: June & Dec)",
        "mode": "Online CBT",
        "website": "https://icmai.in"
      },
      {
        "name": "CMA Intermediate & Final",
        "body": "ICMAI",
        "level": "National Professional Exams",
        "mode": "Pen-and-Paper (June & Dec)",
        "website": "https://icmai.in"
      }
    ],
    "examDatesAndCycles": "Exams held twice every year in June and December | Registration deadline: Jan 31 for June term, July 31 for Dec term.",
    "portionAndSyllabus": [
      "Cost Accounting: Cost Sheet, Material & Labor Costing, Activity-Based Costing (ABC), Standard Costing.",
      "Strategic Financial Management: Investment decisions, treasury management, foreign exchange risk.",
      "Taxation & Cost Audit: Direct and Indirect Taxes (GST), Statutory Cost Audit under Companies Act, Business Valuation."
    ],
    "examPatternSummary": "Foundation: 4 Papers, 400 Marks, 100 MCQs per paper. Intermediate & Final: Descriptive 100-mark papers per subject.",
    "salaryLadder": {
      "entry": "₹7 Lakhs – ₹14 Lakhs / year (Fresher CMA in PSU / Manufacturing MNC)",
      "mid": "₹18 Lakhs – ₹35 Lakhs / year (Plant Finance Controller / Cost Audit Manager)",
      "senior": "₹45 Lakhs – ₹1 Crore+ / year (Chief Financial Officer - CFO, Director of Operations)",
      "highestPaying": "Central Public Sector Enterprises (ONGC, Coal India, Indian Oil, SAIL), Heavy Manufacturing, Global FMCG Supply Chains"
    },
    "scopeAndFuture": {
      "rating": "4.7/5 (Crucial for Make-in-India & Manufacturing Cost Optimization)",
      "summary": "Every major manufacturing plant, refinery, power corporation, and mining company requires Cost Accountants to determine minimum viable product pricing, eliminate material wastage, and conduct statutory Cost Audits.",
      "aiImpact": "Augmented: AI tracks inventory levels, but strategic tariff negotiations, anti-dumping calculations, and plant cost restructuring require qualified CMAs.",
      "growthSectors": [
        "Supply Chain Cost Optimization",
        "Tariff & Anti-Dumping Directorate Filings",
        "Defense Manufacturing Cost Audits",
        "Healthcare Hospital Unit Costing"
      ]
    },
    "techStackAndSkills": [
      "ERP Systems: SAP CO (Controlling Module), Oracle Financials, Tally Prime",
      "Cost Audit Standards: Cost Accounting Standards (CAS 1 to 24), CRA-1/CRA-2 compliance",
      "Advanced Excel, Pivot Analysis, Break-Even Modeling, Capital Budgeting"
    ],
    "stepByStepRoadmap": [
      "Class 12: Register online for CMA Foundation under ICMAI.",
      "CMA Foundation: Clear all 4 papers in June or December.",
      "CMA Intermediate: Clear both groups of CMA Intermediate.",
      "Practical Training: Complete 15 Months of practical training in a manufacturing unit, corporate enterprise, or CMA firm.",
      "CMA Final: Clear both groups of CMA Final exam.",
      "Membership: Receive ACMA (Associate Cost and Management Accountant) credentials from ICMAI."
    ],
    "topColleges": [
      {
        "name": "ICMAI (The Institute of Cost Accountants of India)",
        "location": "Kolkata (HQ) + Mumbai / Pune Regional Centers",
        "type": "Statutory Parliamentary Body"
      },
      {
        "name": "BMCC Pune / Podar Mumbai (Complementary B.Com)",
        "location": "Maharashtra",
        "type": "Top Commerce Campuses"
      }
    ],
    "externalWebsites": [
      {
        "title": "ICMAI Official Portal",
        "url": "https://icmai.in",
        "note": "Student registration, study materials, exam dates & placement portal"
      },
      {
        "title": "Western India Regional Council of ICMAI",
        "url": "https://wirc-icmai.org",
        "note": "Maharashtra seminars, industrial training drives"
      }
    ],
    "govtExamSynergy": {
      "jobs": "PSU Executive Trainee (Finance) in ONGC, IOCL, BHEL, GAIL, Coal India; Indian Cost Accounts Service (ICoAS via UPSC); CAG Audit Officer.",
      "examUdaanLink": "/jobs?q=cma",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "actuarial-science",
    "streamId": "commerce",
    "categoryId": "com_bank_fin",
    "title": "Actuarial Scientist & Risk Modeler (FIAI — Institute of Actuaries of India)",
    "role": "Life Insurance Pricing Actuary, Pension Fund Evaluator, Catastrophe Risk Modeler, Climate Risk Analyst",
    "min12thStream": "12th in Commerce with Maths OR 12th Science with PCM",
    "keySubjectsToScore": [
      {
        "subject": "Mathematics & Statistics",
        "minScore": "90%+",
        "reason": "Probability theory, stochastic calculus, survival models, and compound interest calculations."
      },
      {
        "subject": "Economics & Financial Mathematics",
        "minScore": "80%+",
        "reason": "Inflation modeling, interest rate yield curves, and macroeconomic forecasting."
      }
    ],
    "entranceExams": [
      {
        "name": "ACET (Actuarial Common Entrance Test)",
        "body": "Institute of Actuaries of India (IAI)",
        "level": "National (Twice a year: June & Dec)",
        "mode": "Online Remote Proctored CBT",
        "website": "https://actuariesindia.org"
      }
    ],
    "examDatesAndCycles": "ACET Exam: June and December | Core Principles (CP/CS/CM papers): May and September every year.",
    "portionAndSyllabus": [
      "Mathematics (30 Marks): Algebra, Vectors, Matrices, Calculus, Integration, Finite Differences.",
      "Statistics (30 Marks): Probability distributions, Hypothesis testing, Regression, Sampling.",
      "Data Interpretation, English, and Logic (40 Marks): Reading comprehension, logical deduction."
    ],
    "examPatternSummary": "ACET: 100 Marks, 70 Questions, 3 Hours, No Negative Marking.",
    "salaryLadder": {
      "entry": "₹8 Lakhs – ₹16 Lakhs / year (Clearing 3–5 Actuarial papers)",
      "mid": "₹22 Lakhs – ₹50 Lakhs / year (Clearing 7–10 papers / Associate Actuary)",
      "senior": "₹70 Lakhs – ₹2 Crore+ / year (Fully Qualified Fellow Actuary / Chief Actuary / Partner)",
      "highestPaying": "Global Life & General Reinsurance Giants (Swiss Re, Munich Re, Zurich, Prudential, Max Life, LIC)"
    },
    "scopeAndFuture": {
      "rating": "4.9/5 (Extreme Elite Mathematical Scarcity — Fewer than 1,000 Fully Qualified Actuaries in India)",
      "summary": "Actuaries calculate the probability and financial consequences of future uncertain events: deaths, pandemics, car accidents, earthquakes, and pensions. In India, law mandates that every insurance company must have an Appointed Actuary.",
      "aiImpact": "Collaborative: AI runs machine learning models, but regulatory capital certification, statutory solvencies, and catastrophic risk assumptions legally require licensed Actuaries.",
      "growthSectors": [
        "Health & Pandemic Insurance Pricing",
        "Climate Change Catastrophe Reinsurance",
        "Autonomous Vehicle Liability Risk",
        "FinTech Micro-Insurance Products"
      ]
    },
    "techStackAndSkills": [
      "Actuarial Software: Prophet, Moses, GGY AXIS, ResQ",
      "Programming: R, Python, SAS, SQL, Advanced Excel VBA Financial Modeling",
      "Statistical Distributions: Poisson, Gamma, Markov Chains, Credibility Theory"
    ],
    "stepByStepRoadmap": [
      "Class 12: Score 90%+ in Mathematics; develop passion for statistics and probability.",
      "Clear ACET: Pass ACET to become student member of the Institute of Actuaries of India (IAI).",
      "Undergraduate: Pursue B.Sc Statistics, B.Sc Mathematics, or B.Com with Actuarial Science.",
      "Paper Progression: Clear 13 professional actuarial examinations across Core Principles (CM1, CM2, CS1, CS2, CB1, CB2), Core Practices (CP1, CP2, CP3), and Specialist tiers.",
      "Articleship/Work: Work at reinsurance MNCs in Mumbai/Gurgaon while appearing for papers.",
      "Fellowship: Qualify as Fellow of the Institute of Actuaries of India (FIAI) — reach the peak of mathematical finance earning potential!"
    ],
    "topColleges": [
      {
        "name": "Institute of Actuaries of India (IAI)",
        "location": "Navi Mumbai (Statutory Authority)",
        "type": "Statutory Professional Body"
      },
      {
        "name": "Indian Statistical Institute (ISI)",
        "location": "Kolkata / Delhi",
        "type": "World-Renowned Statistical Apex"
      },
      {
        "name": "St. Xavier's College (Statistics Dept)",
        "location": "Fort, Mumbai",
        "type": "Top Feeder Campus"
      }
    ],
    "externalWebsites": [
      {
        "title": "Institute of Actuaries of India (IAI)",
        "url": "https://actuariesindia.org",
        "note": "ACET registration, curriculum, and exam schedules"
      },
      {
        "title": "Institute and Faculty of Actuaries (IFoA UK)",
        "url": "https://actuaries.org.uk",
        "note": "UK professional body (Mutual recognition with IAI)"
      },
      {
        "title": "IRDAI (Insurance Regulatory Authority)",
        "url": "https://irdai.gov.in",
        "note": "Insurance regulatory norms and statutory actuary rules"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Life Insurance Corporation of India (LIC Actuarial Apprentice / Assistant Actuary), General Insurance Corporation of India (GIC Re Specialist Officer), IRDAI Assistant Manager (Actuarial).",
      "examUdaanLink": "/jobs?q=actuary",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "stock-market-fintech",
    "streamId": "commerce",
    "categoryId": "com_bank_fin",
    "title": "Algorithmic Stock Trader & FinTech Specialist (Quant / NISM / CFP)",
    "role": "Quantitative Trader, High-Frequency Trading (HFT) Developer, Portfolio Wealth Manager, FinTech Product Lead",
    "min12thStream": "12th Commerce with Maths OR 12th Science PCM",
    "keySubjectsToScore": [
      {
        "subject": "Mathematics & Statistics",
        "minScore": "85%+",
        "reason": "Time series analysis, volatility calculations, moving averages, and quantitative strategy backtesting."
      },
      {
        "subject": "Computer Science / Python",
        "minScore": "80%+",
        "reason": "Writing automated algorithmic bots, connecting to broker REST/WebSocket APIs, low-latency execution."
      }
    ],
    "entranceExams": [
      {
        "name": "NISM Certifications (Series VIII, XV, XXI)",
        "body": "National Institute of Securities Markets (SEBI)",
        "level": "National (Mandatory SEBI Licensure)",
        "mode": "Online CBT (Available daily)",
        "website": "https://www.nism.ac.in"
      },
      {
        "name": "CAT (For IIM / JBIMS Financial Engineering)",
        "body": "IIMs",
        "level": "National Post-Grad",
        "mode": "Online CBT",
        "website": "https://iimcat.ac.in"
      }
    ],
    "examDatesAndCycles": "NISM exams: Available year-round on any date of choice | CAT: November last Sunday | Results: January.",
    "portionAndSyllabus": [
      "Derivatives & Equity Markets: Futures, Options (Greeks: Delta, Gamma, Theta, Vega), Margin trading, Short selling.",
      "Algorithmic Strategies: Arbitrage, Momentum, Mean-Reversion, Pair Trading, Statistical Arbitrage.",
      "Quantitative Methods: Linear regression, Volatility smiles, Sharpe ratio, Maximum Drawdown analysis."
    ],
    "examPatternSummary": "NISM Series VIII (Equity Derivatives): 100 MCQs, 100 Marks, 2 Hours, 60% Passing Marks, 25% Negative.",
    "salaryLadder": {
      "entry": "₹8 Lakhs – ₹25 Lakhs / year + (Significant Trading Profit Sharing Bonus)",
      "mid": "₹30 Lakhs – ₹80 Lakhs / year (Quantitative Researcher / Portfolio Manager)",
      "senior": "₹90 Lakhs – ₹3 Crore+ / year (Head of Trading Desk, Prop Trading Partner)",
      "highestPaying": "High-Frequency Trading & Prop Desks (Tower Research, Graviton, AlphaGrep, WorldQuant, Citadel, Jane Street)"
    },
    "scopeAndFuture": {
      "rating": "4.9/5 (Over 80% of National Stock Exchange Volume is now Algorithmic)",
      "summary": "India's stock market capitalization has crossed $5 Trillion, making the NSE the world's largest derivatives exchange by volume. Skilled quants who develop automated trading algorithms in Python and C++ earn astronomical performance bonuses.",
      "aiImpact": "Core Driver: Deep learning reinforcement algorithms are deployed to forecast market sentiment and execute split-second microsecond trades.",
      "growthSectors": [
        "High-Frequency Algorithmic Trading (HFT)",
        "UPI & Digital Payment Gateway FinTech",
        "Crypto & Decentralized Asset Trading",
        "Algorithmic Wealth Advisory (Robo-Advisors)"
      ]
    },
    "techStackAndSkills": [
      "Programming: Python (Pandas, NumPy, Backtrader, Zipline), C++ (Low Latency), SQL",
      "APIs & Platforms: Zerodha Kite Connect API, Upstox API, Interactive Brokers API, MetaTrader 5",
      "Financial Analysis: Technical charts, Options Greeks, Quantitative backtesting metrics"
    ],
    "stepByStepRoadmap": [
      "Class 12: Master Mathematics, Statistics, and basic Python programming.",
      "Undergraduate: B.Com with Mathematics, B.Sc Data Science, or B.Tech Computer Science.",
      "SEBI Certifications: Clear NISM Series VIII (Equity Derivatives) and NISM Series XV (Research Analyst) during college.",
      "Strategy Building: Backtest 10+ quantitative trading strategies using Python on historical market data.",
      "Internship: Join a proprietary trading firm or brokerage in Mumbai (BKC, Lower Parel, Dalal Street).",
      "Career: Manage algorithmic trading desks, launch a registered PMS (Portfolio Management Service), or trade private capital."
    ],
    "topColleges": [
      {
        "name": "NISM (National Institute of Securities Markets)",
        "location": "Patalganga Campus, Navi Mumbai (Established by SEBI)",
        "type": "Apex Securities Market Campus"
      },
      {
        "name": "Jamnalal Bajaj Institute of Management Studies (JBIMS)",
        "location": "Churchgate, Mumbai",
        "type": "Top Finance Campus"
      },
      {
        "name": "IIT Bombay / IIT Delhi (Financial Engineering Programs)",
        "location": "National",
        "type": "Top Quant Feeder"
      }
    ],
    "externalWebsites": [
      {
        "title": "National Institute of Securities Markets (NISM)",
        "url": "https://www.nism.ac.in",
        "note": "SEBI mandated certifications, test centers & study material"
      },
      {
        "title": "National Stock Exchange of India (NSE)",
        "url": "https://www.nseindia.com",
        "note": "Live market data, derivative statistics & historical prices"
      },
      {
        "title": "Bombay Stock Exchange (BSE Institute)",
        "url": "https://www.bsebti.com",
        "note": "Capital markets and algorithmic trading diploma programs"
      }
    ],
    "govtExamSynergy": {
      "jobs": "SEBI Grade A Officer (General / Information Technology), RBI Grade B (Department of Economic and Policy Research), National Stock Exchange / BSE Surveillance Analyst.",
      "examUdaanLink": "/jobs?q=finance",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "bcom-honours-finance",
    "streamId": "commerce",
    "categoryId": "com_acad",
    "title": "Corporate Financial Analyst & B.Com (Honours) Specialist",
    "role": "Financial Planning & Analysis (FP&A) Manager, Credit Analyst, Treasury Associate, Business Valuation Specialist",
    "min12thStream": "12th Commerce with or without Mathematics",
    "keySubjectsToScore": [
      {
        "subject": "Accountancy & Financial Management",
        "minScore": "80%+",
        "reason": "Balance sheet interpretation, cash flow modeling, budgeting, and ratio analysis."
      },
      {
        "subject": "Business Studies & Commercial Law",
        "minScore": "75%+",
        "reason": "Corporate operational frameworks, working capital management, and commercial contracts."
      }
    ],
    "entranceExams": [
      {
        "name": "CUET-UG",
        "body": "NTA",
        "level": "National (For Delhi University: SRCC, Hindu, Hansraj B.Com Hons)",
        "mode": "Online CBT",
        "website": "https://cuetug.nta.nic.in"
      },
      {
        "name": "Mumbai University Merit / Autonomy Entrance",
        "body": "Autonomous Colleges (NM College, Podar, HR College)",
        "level": "State Level Merit & Entrance",
        "website": "https://mu.ac.in"
      }
    ],
    "examDatesAndCycles": "CUET-UG Exam: May | University Merit Lists: June-July | Academic Year Begins: August.",
    "portionAndSyllabus": [
      "CUET Commerce Subjects: Accountancy, Business Studies, Economics, General Test, and English.",
      "Degree Curriculum: Corporate Accounting, Business Law, Income Tax Law, Financial Markets, Management Accounting, International Business."
    ],
    "examPatternSummary": "CUET-UG: 50 Questions per subject (attempt 40), 200 Marks each, 45 Minutes per domain.",
    "salaryLadder": {
      "entry": "₹4.5 Lakhs – ₹9 Lakhs / year (Campus placement from Top Commerce Colleges into Big 4 / Consulting)",
      "mid": "₹12 Lakhs – ₹25 Lakhs / year (FP&A Lead / Senior Credit Underwriter)",
      "senior": "₹30 Lakhs – ₹70 Lakhs+ / year (Finance Director, Head of Treasury)",
      "highestPaying": "Big 4 Consulting & Advisory (Deloitte, PwC, EY, KPMG), Global Capability Centers (GCCs: Barclays, Deutsche Bank, HSBC)"
    },
    "scopeAndFuture": {
      "rating": "4.6/5 (Foundational Bedrock of All Corporate Finance Functions)",
      "summary": "A B.Com (Honours) degree from a premier institution combined with financial modeling and certification (CFA/FRM/ACCA) provides an instant launchpad into global corporate finance and multinational banks.",
      "aiImpact": "Augmented: Automated accounting handles transactional entries, but FP&A strategic forecasts, business variance commentary, and capital expenditure decisions require human financial analysts.",
      "growthSectors": [
        "Corporate FP&A (Financial Planning & Analysis)",
        "Commercial Credit Risk & Corporate Loan Underwriting",
        "Global Shared Services & Business Advisory",
        "Treasury & Liquidity Management"
      ]
    },
    "techStackAndSkills": [
      "Software: Advanced Excel (VBA, Power Query, Dynamic Dashboards), Power BI, Tableau",
      "ERP Suites: SAP S/4HANA Finance, Oracle Cloud ERP, Tally Prime",
      "Financial Reporting: Ratio Analysis, Variance Modeling, Capital Budgeting (NPV/IRR)"
    ],
    "stepByStepRoadmap": [
      "Class 12: Score 90%+ in 12th Commerce Board or 98%+ percentile in CUET-UG.",
      "Top College: Gain admission in elite commerce colleges (SRCC Delhi, NM College Mumbai, Podar Mumbai, BMCC Pune).",
      "Skill Building: Complete financial modeling certifications and advanced Excel / Power BI in 2nd year.",
      "Internships: Complete 2 corporate finance summer internships at banks or consulting firms.",
      "Placements: Secure campus placement as Financial Analyst or pursue MBA / CFA Level 1."
    ],
    "topColleges": [
      {
        "name": "SRCC (Shri Ram College of Commerce)",
        "location": "North Campus, Delhi University",
        "type": "India's #1 Commerce College"
      },
      {
        "name": "Narsee Monjee College of Commerce and Economics",
        "location": "Vile Parle, Mumbai",
        "type": "Top Maharashtra Commerce Institution"
      },
      {
        "name": "R. A. Podar College of Commerce & Economics",
        "location": "Matunga, Mumbai",
        "type": "Historic Premier Commerce Campus"
      },
      {
        "name": "BMCC (Brihan Maharashtra College of Commerce)",
        "location": "Deccan, Pune",
        "type": "Top Pune Commerce College"
      }
    ],
    "externalWebsites": [
      {
        "title": "CUET-UG Official Portal",
        "url": "https://cuetug.nta.nic.in",
        "note": "Common University Entrance Test registration for central universities"
      },
      {
        "title": "University of Mumbai Portal",
        "url": "https://mu.ac.in",
        "note": "Undergraduate centralized admission registration"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Staff Selection Commission (SSC CGL — Assistant Audit Officer / Assistant Accounts Officer Group-B Gazetted), State Bank of India Probationary Officer (SBI PO), LIC Assistant Administrative Officer.",
      "examUdaanLink": "/jobs?q=bcom",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "judiciary-magistrate-judge",
    "streamId": "arts",
    "categoryId": "arts_law",
    "title": "Civil Judge & Judicial Magistrate (JMFC — Maharashtra Judicial Services)",
    "role": "Judicial Magistrate First Class, Civil Judge Junior Division, Sessions Judge, High Court Justice",
    "min12thStream": "Any stream in 12th + 3-Year LLB or 5-Year Integrated BA LLB / BBA LLB Degree",
    "keySubjectsToScore": [
      {
        "subject": "Constitutional Law & Criminal Law (IPC/BNS, CrPC/BNSS)",
        "minScore": "80%+",
        "reason": "Core foundation of criminal trials, bail jurisprudence, and judicial trial rulings."
      },
      {
        "subject": "Civil Procedure Code (CPC) & Evidence Act",
        "minScore": "80%+",
        "reason": "Admissibility of witness testimony, decree execution, injunctions, and civil court procedure."
      }
    ],
    "entranceExams": [
      {
        "name": "JMFC Examination (Maharashtra Judicial Service)",
        "body": "MPSC & Bombay High Court",
        "level": "State Level Judicial Cadre",
        "mode": "Prelims (MCQ) + Mains (Descriptive) + Interview",
        "website": "https://mpsc.gov.in"
      }
    ],
    "examDatesAndCycles": "Prelims Exam: Typically conducted annually | Mains: 3 months after prelims | Oral Interview: Bombay High Court.",
    "portionAndSyllabus": [
      "Civil Law (Paper 1 - 100 Marks): Civil Procedure Code, Transfer of Property Act, Specific Relief Act, Indian Contract Act, Sale of Goods Act, Partnership Act.",
      "Criminal Law (Paper 2 - 100 Marks): Bharatiya Nyaya Sanhita (IPC), Bharatiya Nagarik Suraksha Sanhita (CrPC), Bharatiya Sakshya Adhiniyam (Evidence Act), Protection of Women from Domestic Violence Act, Scheduled Castes and Scheduled Tribes (POA) Act.",
      "Judgment Writing: Practical formulation of criminal charge, framing civil issues, evaluating oral evidence, and delivering reasoned final judgments."
    ],
    "examPatternSummary": "Prelims: 100 Marks (100 MCQs, 2 Hours). Mains: 2 Papers, 200 Marks (Descriptive, 3 Hours each). Interview: 50 Marks.",
    "salaryLadder": {
      "entry": "₹12 Lakhs – ₹18 Lakhs / year (Civil Judge Junior Division: Level J-1 Pay Scale ₹77,840 base + Perks + Official Court Chamber + Chauffeur Car + Official Judicial Residence)",
      "mid": "₹22 Lakhs – ₹35 Lakhs / year (Senior Civil Judge / Chief Judicial Magistrate)",
      "senior": "₹40 Lakhs – ₹55 Lakhs+ / year (District & Sessions Judge / High Court Justice)",
      "highestPaying": "Priceless Constitutional Authority: Sole statutory authority to sentence criminal convicts, grant bail, and decide multi-crore property title disputes"
    },
    "scopeAndFuture": {
      "rating": "5/5 (Highest Prestige, Absolute Independence, and Constitutional Authority)",
      "summary": "A Judicial Magistrate is the bedrock of the Indian justice system. Judges enjoy constitutional tenure, immunity from executive pressure, high social honor, and the ability to directly enforce justice for common citizens.",
      "aiImpact": "Completely Immune: Judicial discretion, evaluating demeanor of witnesses in the courtroom, balancing equity with statute, and sentencing require constitutional human consciousness.",
      "growthSectors": [
        "Special Commercial Fast-Track Courts",
        "Cyber Crime & Digital Evidence Adjudication",
        "Environmental & Green Tribunals",
        "Appellate High Court Elevation"
      ]
    },
    "techStackAndSkills": [
      "Judicial Discretion: Objective impartiality, assessing witness truthfulness, and emotional detachment",
      "Legal Judgment Writing: Clear, logical, unambiguous judicial decrees cited with Supreme Court precedents",
      "Courtroom Management: Maintaining court decorum, managing public prosecutors, defense advocates, and police witnesses"
    ],
    "stepByStepRoadmap": [
      "Class 12: Complete 10+2 in any stream (Arts / Commerce / Science).",
      "Law Degree: Complete 5-Year Integrated BA LLB or 3-Year LLB from a Bar Council recognized university with 55%+ marks.",
      "Bar Enrollment: Enroll as an Advocate with the Bar Council of Maharashtra & Goa.",
      "Fresh Law Graduate Category: In Maharashtra, fresh law graduates with 55%+ aggregate marks in all years can appear directly for the JMFC exam without prior mandatory practice years!",
      "Preparation: Clear JMFC Prelims, master descriptive legal writing and Judgment Drafting for Mains, and clear the High Court interview.",
      "Judicial Training: Join Maharashtra Judicial Academy, Uttan, Bhayandar for 1 year of rigorous practical judicial training before presiding over your court!"
    ],
    "topColleges": [
      {
        "name": "Government Law College (GLC), Mumbai",
        "location": "Churchgate, Mumbai (Produces India's Most CJIs & Judges)",
        "type": "Asia's Oldest Law School"
      },
      {
        "name": "ILS Law College, Pune",
        "location": "Law College Road, Pune",
        "type": "Historic Premier Legal Campus"
      },
      {
        "name": "MNLU (Maharashtra National Law University)",
        "location": "Mumbai & Nagpur",
        "type": "National Law University"
      }
    ],
    "externalWebsites": [
      {
        "title": "Bombay High Court Official Portal",
        "url": "https://bombayhighcourt.nic.in",
        "note": "Judicial recruitment notices, rules, and roster"
      },
      {
        "title": "MPSC Judicial Exams Desk",
        "url": "https://mpsc.gov.in",
        "note": "Civil Judge Junior Division & JMFC notifications"
      },
      {
        "title": "Maharashtra Judicial Academy",
        "url": "https://mja.gov.in",
        "note": "State academy for judicial officer training at Uttan"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Civil Judge Junior Division & Judicial Magistrate First Class (JMFC), Assistant Sessions Judge, District Judge (Higher Judicial Services).",
      "examUdaanLink": "/jobs?q=judge",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "fashion-designer-nift",
    "streamId": "arts",
    "categoryId": "arts_design",
    "title": "Fashion Designer & Apparel Stylist (B.Des via NIFT)",
    "role": "Couture Fashion Designer, Celebrity Stylist, Textile & Knitwear Specialist, Fashion Brand Director",
    "min12thStream": "12th in Arts, Commerce, or Science (Any stream eligible)",
    "keySubjectsToScore": [
      {
        "subject": "Visual Arts & Creative Drawing",
        "minScore": "80%+",
        "reason": "Creative ability, color psychology, human figure proportions, and fabric draping."
      },
      {
        "subject": "General Aptitude & Observation",
        "minScore": "75%+",
        "reason": "Trends observation, fashion history, and design problem solving."
      }
    ],
    "entranceExams": [
      {
        "name": "NIFT Entrance Exam (CAT & GAT)",
        "body": "National Institute of Fashion Technology",
        "level": "National (Apex Fashion Institute under Ministry of Textiles)",
        "mode": "Online CBT (GAT) + Paper Drawing (CAT) + Situation Test",
        "website": "https://nift.ac.in"
      },
      {
        "name": "UCEED",
        "body": "IIT Bombay",
        "level": "National (For B.Des at IIT Bombay/Delhi)",
        "mode": "Online CBT + Drawing",
        "website": "https://uceed.iitb.ac.in"
      }
    ],
    "examDatesAndCycles": "Registration: Nov-Dec | Stage 1 (CAT & GAT): February | Stage 2 (Situation Test): April | Final Results: May.",
    "portionAndSyllabus": [
      "Creative Ability Test (CAT): Intuitive drawing, color rendering, product design, perspective illustration, concept visualization.",
      "General Ability Test (GAT): English comprehension, quantitative ability, analytical reasoning, fashion and lifestyle awareness.",
      "Situation Test: Hands-on 3D model crafting using provided materials (clay, wire, thermocol, paper, cloth) within 2 hours."
    ],
    "examPatternSummary": "Stage 1: CAT (50% weightage) + GAT (30% weightage). Stage 2: Situation Test (20% weightage).",
    "salaryLadder": {
      "entry": "₹5 Lakhs – ₹10 Lakhs / year (Assistant Designer / Brand Merchandiser)",
      "mid": "₹14 Lakhs – ₹30 Lakhs / year (Senior Designer / Celebrity Stylist / Production Head)",
      "senior": "₹40 Lakhs – ₹1.5 Crore+ / year (Own Couture Fashion House, Creative Director of Global Retail Brand)",
      "highestPaying": "Luxury Fashion Houses (Sabyasachi, Manish Malhotra, Anita Dongre), Global Brands (Zara, H&M, Marks & Spencer), Bollywood Styling"
    },
    "scopeAndFuture": {
      "rating": "4.5/5 (India is a Global Apparel Manufacturing & Bollywood Fashion Capital)",
      "summary": "Mumbai is the fashion and entertainment capital of India. The explosion of D2C apparel brands, sustainable textile exports, e-commerce fast fashion, and wedding luxury couture makes fashion design a vibrant, glamorous, and lucrative career.",
      "aiImpact": "Collaborative: AI generates 2D fabric prints, but garment fit, tactile fabric drape, human silhouette tailoring, and high-fashion emotion require creative human designers.",
      "growthSectors": [
        "Sustainable & Circular Eco-Friendly Fashion",
        "Ethnic Bridal Couture & Luxury Pret",
        "Smart Wearable Textiles & 3D Printed Garments",
        "D2C E-Commerce Fashion Brands"
      ]
    },
    "techStackAndSkills": [
      "Digital Design: Adobe Illustrator, Adobe Photoshop, CLO 3D (Virtual Garment Simulation), CorelDRAW",
      "Technical Craft: Pattern making, garment draping, textile weaves, sewing machine mastery",
      "Trend Forecasting: WGSN Trend Analysis, Fashion show runway curation, Moodboarding"
    ],
    "stepByStepRoadmap": [
      "Class 12: Develop creative drawing, sketching, and material manipulation skills.",
      "Entrance: Prepare for NIFT Creative Ability Test (CAT) and General Ability Test (GAT).",
      "Undergraduate: 4-Year B.Des in Fashion Design, Textile Design, or Knitwear Design at NIFT.",
      "Industry Exposure: Participate in annual NIFT Graduation Fashion Show and complete a 4-month industry internship.",
      "Career Launch: Work under top fashion designers, join international apparel export houses, or launch your own D2C clothing brand."
    ],
    "topColleges": [
      {
        "name": "NIFT New Delhi / NIFT Mumbai",
        "location": "Hauz Khas, Delhi & Kharghar, Navi Mumbai",
        "type": "India's Premier Fashion Institution"
      },
      {
        "name": "National Institute of Design (NID)",
        "location": "Ahmedabad, Gujarat",
        "type": "Apex Design Institute"
      },
      {
        "name": "Pearl Academy",
        "location": "Mumbai & Delhi",
        "type": "Top Private Fashion College"
      }
    ],
    "externalWebsites": [
      {
        "title": "NIFT Official Portal",
        "url": "https://nift.ac.in",
        "note": "Admissions, campuses, prospectus, and fee structure"
      },
      {
        "title": "Ministry of Textiles, Govt of India",
        "url": "https://texmin.nic.in",
        "note": "Handloom schemes, textile parks, and export councils"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Ministry of Textiles Assistant Director (Handloom & Handicrafts), National Jute Board Designer, Central Silk Board Technical Officer.",
      "examUdaanLink": "/jobs?q=fashion",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "ui-ux-product-designer",
    "streamId": "arts",
    "categoryId": "arts_design",
    "title": "UI/UX Product Designer & Visual Strategist (B.Des via NID / UCEED)",
    "role": "Product Designer, User Experience (UX) Researcher, User Interface (UI) Designer, Design Systems Architect",
    "min12thStream": "12th in Arts, Commerce, or Science (All streams eligible for B.Des)",
    "keySubjectsToScore": [
      {
        "subject": "Human Psychology & Empathy",
        "minScore": "75%+",
        "reason": "Understanding user mental models, cognitive load, behavior heuristics, and accessibility."
      },
      {
        "subject": "Visual Arts & Digital Media",
        "minScore": "75%+",
        "reason": "Typography, grid systems, iconography, color contrast, and micro-animations."
      }
    ],
    "entranceExams": [
      {
        "name": "UCEED (Undergraduate Common Entrance for Design)",
        "body": "IIT Bombay",
        "level": "National (For B.Des at IIT Bombay, IIT Delhi, IIT Guwahati, IIITDM)",
        "mode": "Online CBT + Drawing",
        "website": "https://uceed.iitb.ac.in"
      },
      {
        "name": "NID DAT (Design Aptitude Test)",
        "body": "National Institute of Design",
        "level": "National (For NID Ahmedabad, Bengaluru, Kurukshetra, Vijayawada)",
        "mode": "Prelims + Mains Studio Test",
        "website": "https://admissions.nid.edu"
      }
    ],
    "examDatesAndCycles": "Registration: Oct-Nov | UCEED & NID Prelims Exam: January | NID Mains / Studio Test: April-May | Results: May.",
    "portionAndSyllabus": [
      "Part A (CBT): Visualization and spatial ability, observation and design sensitivity, environmental awareness, analytical and logical reasoning.",
      "Part B (Drawing): Perspective drawing, proportion, light and shadow, problem identification and creative user-centric solution rendering."
    ],
    "examPatternSummary": "UCEED: 300 Marks, 3 Hours (Part A: 200M computer test, Part B: 100M sketch test). NID DAT: Prelims 100M + Mains Studio Test.",
    "salaryLadder": {
      "entry": "₹8 Lakhs – ₹18 Lakhs / year (Junior Product Designer in Tech MNC / Unicorn)",
      "mid": "₹22 Lakhs – ₹45 Lakhs / year (Senior UX Designer / Lead UI Architect)",
      "senior": "₹55 Lakhs – ₹1.3 Crore+ / year (VP of Design, Chief Design Officer - CDO)",
      "highestPaying": "Top Tech Product Giants (Google, Apple, Microsoft, Uber), FinTech (CRED, Razorpay, PhonePe), SaaS Enterprises"
    },
    "scopeAndFuture": {
      "rating": "5/5 (Highest Paid Creative Career in the Tech Industry)",
      "summary": "Every mobile app, web platform, EV dashboard, medical device screen, and smart TV interface is designed by a UI/UX Product Designer. Companies know that superior user experience directly drives billions in revenue.",
      "aiImpact": "Augmented: AI produces wireframe variations, but user interview empathy, usability testing, cross-functional engineering alignment, and nuanced product strategy remain human-driven.",
      "growthSectors": [
        "FinTech & Crypto Simplified UX",
        "Automotive Digital Cockpits & EV Interfaces",
        "Healthcare Medical App Usability",
        "Spatial Computing & AR/VR Headset Interfaces"
      ]
    },
    "techStackAndSkills": [
      "Industry Tools: Figma, Adobe XD, ProtoPie, Framer, Principle, Miro, FigJam",
      "UX Methodologies: User Personas, Empathy Mapping, Wireframing, Usability Testing, Heuristic Evaluation",
      "Design Systems: Atomic Design, Material Design 3, Apple Human Interface Guidelines (HIG)"
    ],
    "stepByStepRoadmap": [
      "Class 12: Develop visual storytelling, spatial drawing, and digital software skills.",
      "Entrance: Crack UCEED (IIT Bombay) or NID DAT (National Institute of Design).",
      "Undergraduate: 4-Year B.Des in Interaction Design, Product Design, or Communication Design.",
      "Portfolio Building: Build 3-4 in-depth UX case studies on Behance and personal portfolio website (problem statement, research, wireframes, prototypes, user testing).",
      "Internships: Complete design internships at tech startups or design studios.",
      "Campus Placement: Recruited directly by tech companies (Google, Microsoft, CRED, Swiggy) as Product Designer."
    ],
    "topColleges": [
      {
        "name": "National Institute of Design (NID)",
        "location": "Ahmedabad, Gujarat (India's Apex Design School)",
        "type": "Institute of National Importance"
      },
      {
        "name": "IDC School of Design, IIT Bombay",
        "location": "Powai, Mumbai",
        "type": "Premier Tech-Design Campus"
      },
      {
        "name": "Department of Design, IIT Delhi",
        "location": "New Delhi",
        "type": "Premier National Institute"
      },
      {
        "name": "Srishti Manipal Institute of Art, Design and Technology",
        "location": "Bengaluru, Karnataka",
        "type": "Top Design Campus"
      }
    ],
    "externalWebsites": [
      {
        "title": "UCEED IIT Bombay Official",
        "url": "https://uceed.iitb.ac.in",
        "note": "Information brochure, syllabus, and online registration"
      },
      {
        "title": "NID Admissions Portal",
        "url": "https://admissions.nid.edu",
        "note": "Design Aptitude Test sample papers and schedules"
      },
      {
        "title": "Figma Community",
        "url": "https://www.figma.com/community",
        "note": "Global UI/UX design files, plugins, and design systems"
      }
    ],
    "govtExamSynergy": {
      "jobs": "National Informatics Centre (NIC Senior UX Consultant), Digital India UX Designer, UIDAI (Aadhaar UX Specialist), CDAC UI Specialist.",
      "examUdaanLink": "/jobs?q=design",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "hotel-management-culinary",
    "streamId": "arts",
    "categoryId": "arts_media",
    "title": "Hospitality & Hotel Operations Manager (B.Sc Hospitality — NCHMCT JEE)",
    "role": "General Manager (Luxury Hotel), Executive Chef, Food & Beverage Director, Revenue Manager, Airline Cabin Crew Leader",
    "min12thStream": "12th in Arts, Commerce, or Science (With English as a mandatory subject)",
    "keySubjectsToScore": [
      {
        "subject": "English Language & Communication",
        "minScore": "75%+",
        "reason": "60 questions out of 200 in NCHMCT JEE test English grammar, vocabulary, and verbal fluency."
      },
      {
        "subject": "Service Aptitude & General Awareness",
        "minScore": "70%+",
        "reason": "Hospitality business awareness, emotional intelligence, tourism geography, and etiquette."
      }
    ],
    "entranceExams": [
      {
        "name": "NCHMCT JEE",
        "body": "National Testing Agency (NTA)",
        "level": "National (For all 75+ Central and State Institutes of Hotel Management — IHMs)",
        "mode": "Online CBT (May)",
        "website": "https://nchmjee.nta.nic.in"
      }
    ],
    "examDatesAndCycles": "Registration: Feb-Mar | Exam: May second week | Results & Centralized Allotment: June-July.",
    "portionAndSyllabus": [
      "Numerical Ability & Analytical Aptitude (30 Qs): Arithmetic, percentages, time and work, ratios.",
      "Reasoning & Logical Deduction (30 Qs): Series, coding, relationships, logic puzzles.",
      "General Knowledge & Current Affairs (30 Qs): Tourism, world geography, national leaders, culinary culture.",
      "English Language (60 Qs): Comprehension, synonyms/antonyms, idioms, spot the errors.",
      "Aptitude for Service Sector (50 Qs): Situational customer scenarios, ethics, hospitality judgment."
    ],
    "examPatternSummary": "200 Questions, 800 Marks (+4 for correct, -1 for wrong), 3 Hours Duration.",
    "salaryLadder": {
      "entry": "₹4 Lakhs – ₹7.5 Lakhs / year (Management Trainee in 5-Star Hotel Chains / International Airline Cabin Crew: ₹9L - ₹15L)",
      "mid": "₹12 Lakhs – ₹25 Lakhs / year (F&B Director / Executive Chef / Front Office Head)",
      "senior": "₹35 Lakhs – ₹85 Lakhs+ / year (General Manager of 5-Star Luxury Resort, Global Cruise Operations Director)",
      "highestPaying": "Luxury International Chains (Taj, Oberoi, Marriott, Hyatt, Four Seasons), International Cruise Liners (Royal Caribbean), Middle East Luxury Airlines (Emirates, Qatar Airways)"
    },
    "scopeAndFuture": {
      "rating": "4.5/5 (Global Tourism & Indian Hospitality Expansion)",
      "summary": "India's travel and tourism sector is booming with luxury weddings, corporate conventions (MICE), luxury resorts in Goa and Rajasthan, and international airlines expanding fleets. Hotel management graduates possess universal global employability.",
      "aiImpact": "100% Safe: Warm personal hospitality, culinary fine dining creation, luxury guest concierge problem-solving, and in-flight cabin service strictly require gracious human beings.",
      "growthSectors": [
        "Luxury Destination Weddings & Event Management",
        "International Luxury Cruise Operations",
        "Gourmet Cloud Kitchens & Specialty Restobars",
        "Revenue Management & Dynamic Hotel Room Pricing"
      ]
    },
    "techStackAndSkills": [
      "Property Management Systems (PMS): Opera PMS, Amadeus, IDS Next, Micros Fidelio",
      "Culinary Arts: French cooking classical methods, pastry & bakery, HACCP food hygiene protocols",
      "Wine Sommelier, Mixology, Banquet Sales, and High Emotional Intelligence (EQ)"
    ],
    "stepByStepRoadmap": [
      "Class 12: Complete 10+2 with English (minimum 50%).",
      "Entrance: Score top rank in NCHMCT JEE to secure admission in top tier-1 IHMs (IHM Mumbai, IHM Pusa Delhi).",
      "Undergraduate: 3-Year B.Sc in Hospitality and Hotel Administration.",
      "Industrial Exposure Training: Complete 20-week mandatory operational training in all 4 core departments (Front Office, Housekeeping, Food Production, F&B Service) at a 5-star hotel.",
      "Campus Placements: Selected into elite Management Training (MT) programs of Taj (TAS), Oberoi (OCLD), or Marriott.",
      "Career Rise: Transition from Restaurant/Front Desk Manager to General Manager (GM) of luxury resorts in 10-12 years."
    ],
    "topColleges": [
      {
        "name": "Institute of Hotel Management (IHM Mumbai — Dadar Catering College)",
        "location": "Dadar, Mumbai (First Hotel School in India, Est. 1954)",
        "type": "Central Govt Apex IHM"
      },
      {
        "name": "IHM Pusa, New Delhi",
        "location": "New Delhi",
        "type": "Rank #1 Central Govt IHM"
      },
      {
        "name": "Oberoi Centre of Learning and Development (OCLD)",
        "location": "Delhi NCR",
        "type": "Elite Fully-Sponsored Luxury Corporate Academy"
      },
      {
        "name": "Welcomgroup Graduate School of Hotel Administration (WGSHA)",
        "location": "Manipal, Karnataka",
        "type": "Premier Private Hospitality Institute"
      }
    ],
    "externalWebsites": [
      {
        "title": "National Council for Hotel Management (NCHMCT)",
        "url": "https://nchm.gov.in",
        "note": "Central council guidelines, curriculum, and affiliated institutes"
      },
      {
        "title": "NTA NCHMCT JEE Portal",
        "url": "https://nchmjee.nta.nic.in",
        "note": "Online examination registration, syllabus, and admit cards"
      },
      {
        "title": "Ministry of Tourism, Govt of India",
        "url": "https://tourism.gov.in",
        "note": "Incredible India initiatives, hotel star classifications"
      }
    ],
    "govtExamSynergy": {
      "jobs": "IRCTC Catering Manager / Tourism Executive, Air India State Service, Parliament Catering Officer, State Tourism Development Corporations (MTDC Hospitality Manager).",
      "examUdaanLink": "/jobs?q=hospitality",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "foreign-language-diplomat",
    "streamId": "arts",
    "categoryId": "arts_lang_acad",
    "title": "Foreign Language Specialist & Diplomatic Interpreter (BA / MA in Languages)",
    "role": "Simultaneous Diplomatic Interpreter, Cross-Border Translator, Localization Manager, Embassy Cultural Attaché",
    "min12thStream": "Any stream in 12th (Arts, Commerce, or Science)",
    "keySubjectsToScore": [
      {
        "subject": "English Language & Grammar",
        "minScore": "80%+",
        "reason": "Advanced translation requires flawless bilingual precision between source language and target language."
      },
      {
        "subject": "World History & International Geopolitics",
        "minScore": "75%+",
        "reason": "Cultural metaphors, diplomatic protocol, idioms, and geopolitical sensitivities."
      }
    ],
    "entranceExams": [
      {
        "name": "CUET-UG (For JNU School of Language, Literature & Culture Studies)",
        "body": "NTA",
        "level": "National (For JNU, EFLU Hyderabad, BHU)",
        "mode": "Online CBT",
        "website": "https://cuetug.nta.nic.in"
      },
      {
        "name": "International Language Certifications",
        "body": "Goethe-Institut (German), JLPT (Japanese), DELF/DALF (French), HSK (Mandarin), DELE (Spanish)",
        "level": "Global CEFR Standards (A1, A2, B1, B2, C1, C2)",
        "website": "https://www.goethe.de"
      }
    ],
    "examDatesAndCycles": "CUET-UG: May | JLPT: Held twice a year (July & Dec) | Goethe / Alliance Française: Conducted every 2 months.",
    "portionAndSyllabus": [
      "JNU / CUET: General Test (Mental ability, numerical ability, general knowledge) + English Language Comprehension.",
      "International Certifications (CEFR C1/C2): Advanced reading comprehension, listening to native audio speeds, continuous essay writing, and oral spontaneous speech."
    ],
    "examPatternSummary": "CUET-UG: Computer-based test. JLPT: 180 Marks, 3 Sections (Language Knowledge, Reading, Listening).",
    "salaryLadder": {
      "entry": "₹6 Lakhs – ₹12 Lakhs / year (Bilingual Associate / IT Localization Analyst)",
      "mid": "₹16 Lakhs – ₹32 Lakhs / year (Simultaneous Conference Interpreter / Corporate Translation Lead)",
      "senior": "₹40 Lakhs – ₹90 Lakhs+ / year (Freelance Conference Interpreter: ₹25,000 – ₹60,000 per DAY for UN/Bilateral Summits)",
      "highestPaying": "Simultaneous Conference Interpreting (UN, G20, BRICS Summits), Japanese (JLPT N1/N2) in Automotive/IT, German & Mandarin Corporate M&A"
    },
    "scopeAndFuture": {
      "rating": "4.6/5 (Extreme Scarcity of C1/C2 Fluent Native Interpreters in India)",
      "summary": "Japanese, German, Mandarin, French, and Spanish experts command enormous fees because IT MNCs, Japanese bullet train projects, and multinational embassies in Mumbai and Delhi face continuous shortages of verified native speakers.",
      "aiImpact": "Collaborative: AI translates simple text, but high-stakes diplomatic summits, legal contract arbitration, and literary emotional localization require nuanced human interpreters.",
      "growthSectors": [
        "High-Stakes Bilateral Diplomatic Summits (G20, Trade Pacts)",
        "Game & Anime Entertainment Localization",
        "Multinational IT Offshore Project Coordination",
        "Patent & Legal Document Translation"
      ]
    },
    "techStackAndSkills": [
      "Simultaneous Interpretation Booth Protocols & Dual Headsets",
      "CAT Tools (Computer-Assisted Translation): SDL Trados Studio, memoQ, Smartcat, Wordfast",
      "Phonetic Ear Sensitivity, Split-Second Brain Translation Switching, and Cultural Etiquette"
    ],
    "stepByStepRoadmap": [
      "Class 12: Complete 10+2; begin learning chosen foreign language (Japanese, German, French, Spanish, or Mandarin).",
      "Degree Route: Secure admission in JNU (Jawaharlal Nehru University, New Delhi) — School of Language Studies for 3-Year BA (Hons) in Foreign Language.",
      "Global Certifications: Clear international exams (e.g., JLPT N2/N1 for Japanese, Goethe B2/C1 for German, DELF B2/C1 for French).",
      "Post-Graduation: MA in Linguistics & Translation Studies or PG Diploma in Simultaneous Interpreting.",
      "Career Launch: Work with Ministry of External Affairs, foreign embassies in Chanakyapuri (Delhi) / BKC (Mumbai), or freelance for global corporate delegations."
    ],
    "topColleges": [
      {
        "name": "JNU (Jawaharlal Nehru University — SLL&CS)",
        "location": "New Delhi (The Harvard of Languages in Asia)",
        "type": "Central Premier University"
      },
      {
        "name": "EFLU (English and Foreign Languages University)",
        "location": "Hyderabad, Telangana",
        "type": "Central Dedicated Language University"
      },
      {
        "name": "University of Mumbai (Department of French, German, Russian)",
        "location": "Kalina Campus, Mumbai",
        "type": "Historic State Department"
      },
      {
        "name": "Savitribai Phule Pune University (Department of Foreign Languages - FL)",
        "location": "Ranade Institute, Pune",
        "type": "Leading Foreign Language Hub"
      }
    ],
    "externalWebsites": [
      {
        "title": "JNU Admissions Portal",
        "url": "https://www.jnu.ac.in",
        "note": "BA (Hons) and MA in Foreign Languages admission brochures"
      },
      {
        "title": "Goethe-Institut Max Mueller Bhavan",
        "url": "https://www.goethe.de/ins/in/en/sta/mum.html",
        "note": "German language levels, courses, and examination dates"
      },
      {
        "title": "Japan Foundation New Delhi (JLPT)",
        "url": "https://www.jpf.go.jp",
        "note": "Japanese-Language Proficiency Test official schedules"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Ministry of External Affairs (MEA Diplomatic Interpreter / Translator), Cabinet Secretariat (Language Officer), Intelligence Bureau (Language Specialist), Doordarshan Foreign Language News Reader.",
      "examUdaanLink": "/jobs?q=translator",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "arts-teacher-professor",
    "streamId": "arts",
    "categoryId": "arts_lang_acad",
    "title": "Humanities Educator & College Professor (BA + B.Ed → MA + UGC NET / PhD)",
    "role": "School PGT (History / Geography / Pol Science), Junior College Lecturer, Senior College Assistant Professor",
    "min12thStream": "12th in Arts / Humanities or any stream",
    "keySubjectsToScore": [
      {
        "subject": "Humanities Major (History, Pol Science, Sociology, English)",
        "minScore": "80%+",
        "reason": "Deep subject command, historiography, political thought, and pedagogical clarity."
      },
      {
        "subject": "Teaching Aptitude & General Knowledge",
        "minScore": "75%+",
        "reason": "Teaching methods, Bloom taxonomy, educational philosophy in B.Ed & UGC NET Paper 1."
      }
    ],
    "entranceExams": [
      {
        "name": "MH-CET B.Ed",
        "body": "State CET Cell Maharashtra",
        "level": "State Level (For Government & Aided B.Ed Colleges)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "MahaTET / CTET",
        "body": "MSCE Pune / CBSE",
        "level": "Mandatory Teacher Eligibility Test",
        "mode": "Pen-and-Paper / CBT",
        "website": "https://mahatet.in"
      },
      {
        "name": "UGC NET & MH-SET",
        "body": "NTA / SPPU Pune",
        "level": "National & State (Mandatory for Assistant Professor & Junior Research Fellowship)",
        "mode": "Online CBT",
        "website": "https://ugcnet.nta.nic.in"
      }
    ],
    "examDatesAndCycles": "UGC NET: Twice a year in June and December | MH-SET: Once a year in April | B.Ed CET: March-April.",
    "portionAndSyllabus": [
      "UGC NET Paper 1 (100 Marks): Teaching Aptitude, Research Aptitude, Reading Comprehension, Communication, Mathematical Reasoning, Data Interpretation, Higher Education System.",
      "UGC NET Paper 2 (200 Marks): 100 questions covering your specific Master subject (History, Political Science, Economics, Sociology, English, Psychology)."
    ],
    "examPatternSummary": "UGC NET: 150 MCQs, 300 Marks, 3 Hours, No Negative Marking. MH-CET B.Ed: 100 MCQs, 100 Marks, 90 Minutes.",
    "salaryLadder": {
      "entry": "₹4.5 Lakhs – ₹7.5 Lakhs / year (Zilla Parishad High School Teacher / Kendriya Vidyalaya TGT: 7th Pay Level 7)",
      "mid": "₹10 Lakhs – ₹20 Lakhs / year (Aided College Assistant Professor: Academic Level 10 entry ₹57,700 base + HRA + DA)",
      "senior": "₹22 Lakhs – ₹45 Lakhs+ / year (Associate Professor / College Principal / University Head of Department)",
      "highestPaying": "Premier Central Universities (JNU, Delhi University, TISS), UPSC / MPSC Coaching Star Faculty (Drishti IAS, Chanakya Mandal: ₹25L - ₹75L+)"
    },
    "scopeAndFuture": {
      "rating": "4.7/5 (Exceptional Social Respect, Academic Freedom, and Vacations)",
      "summary": "With NEP 2020 emphasizing multidisciplinary social sciences, state teacher recruitment drives through Maharashtra Pavitra Portal, and thousands of colleges needing NET-qualified professors, academic careers offer lifelong security.",
      "aiImpact": "Safe: Mentoring young minds, encouraging critical philosophical debate, classroom ethics, and original qualitative historical research require human professors.",
      "growthSectors": [
        "Civil Services Competitive Exam Mentorship",
        "Curriculum Design & Educational Policy Research",
        "Digital Online Lecture Series & Academic Publishing",
        "University Dean & Academic Administration"
      ]
    },
    "techStackAndSkills": [
      "Pedagogy: Flipped Classroom, Socratic Debate Method, Audio-Visual Slides",
      "Research Publishing: Google Scholar, Scopus / UGC-CARE Listed Journals, APA / MLA Citation Standards",
      "Classroom Management, High Eloquence, and Bilingual Articulation (Marathi & English)"
    ],
    "stepByStepRoadmap": [
      "Class 12: Complete 10+2 Arts with strong subject mastery.",
      "Undergraduate: 3-Year BA in chosen major (History, Political Science, Economics, Literature).",
      "School Route: Complete 2-Year B.Ed via MH-CET B.Ed + Clear CTET / MahaTET + Apply through Maharashtra Pavitra Portal.",
      "College Route: Complete 2-Year Master of Arts (MA) with 55%+ marks + Crack UGC-NET or MH-SET.",
      "Higher Studies: Complete Ph.D. with UGC Junior Research Fellowship (JRF stipend of ₹37,000/month) to fast-track promotions to Associate Professor."
    ],
    "topColleges": [
      {
        "name": "Fergusson College (Autonomous)",
        "location": "Pune, Maharashtra",
        "type": "Historic Humanities Nursery"
      },
      {
        "name": "St. Xavier’s College",
        "location": "Mumbai",
        "type": "Autonomous Elite College"
      },
      {
        "name": "Tata Institute of Social Sciences (TISS)",
        "location": "Deonar, Mumbai",
        "type": "Premier Social Sciences Institute"
      },
      {
        "name": "Savitribai Phule Pune University (SPPU Arts Faculty)",
        "location": "Pune",
        "type": "Top State University"
      }
    ],
    "externalWebsites": [
      {
        "title": "UGC NET Official Portal (NTA)",
        "url": "https://ugcnet.nta.nic.in",
        "note": "National Eligibility Test application, syllabi & admit cards"
      },
      {
        "title": "MH-SET Portal (SPPU Pune)",
        "url": "https://setexam.unipune.ac.in",
        "note": "State Eligibility Test for assistant professors in Maharashtra"
      },
      {
        "title": "Maharashtra Pavitra Portal",
        "url": "https://pavitra.mahateacherrecruitment.org.in",
        "note": "Official school teacher recruitment portal"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Maharashtra Shikshak Bharti (Pavitra Portal), Kendriya Vidyalaya (KVS PGT/TGT), Navodaya Vidyalaya (NVS), MPSC Assistant Professor (Govt Arts Colleges).",
      "examUdaanLink": "/jobs?q=teacher",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "iti-industrial-trades",
    "streamId": "vocational",
    "categoryId": "voc_iti",
    "title": "Industrial Technician & Railway Loco Pilot (ITI Trades — NCVT / SCVT)",
    "role": "Railway Assistant Loco Pilot (ALP), Electrical Substation Technician, CNC Machinist, Power Grid Wireman",
    "min12thStream": "Class 10th Pass (with Science & Mathematics minimum 35%) OR 12th Pass",
    "keySubjectsToScore": [
      {
        "subject": "Class 10th Mathematics",
        "minScore": "55%+",
        "reason": "Unit conversions, workshop calculation and science (WCS), gear ratios, and trade measurements."
      },
      {
        "subject": "Class 10th Science",
        "minScore": "55%+",
        "reason": "Ohm law, circuits, thermodynamics, and physical properties of industrial metals."
      }
    ],
    "entranceExams": [
      {
        "name": "Maharashtra ITI Online Admission",
        "body": "Directorate of Vocational Education & Training (DVET Maharashtra)",
        "level": "State Level Merit (Direct on 10th Board marks — No entrance test!)",
        "mode": "Centralized Online CAP",
        "website": "https://admission.dvet.gov.in"
      },
      {
        "name": "RRB Assistant Loco Pilot (ALP)",
        "body": "Railway Recruitment Board",
        "level": "Central Govt (CBT 1 + CBT 2 + CBAT Aptitude)",
        "mode": "Online CBT",
        "website": "https://www.rrbmumbai.gov.in"
      }
    ],
    "examDatesAndCycles": "DVET ITI Admissions: June-July (immediate after 10th results) | RRB ALP: Annual national notification.",
    "portionAndSyllabus": [
      "Trade Theory (Electrician / Fitter / Wireman): National Skills Qualification Framework (NSQF Level 4/5) trade syllabus.",
      "Workshop Calculation & Science: Applied arithmetic, fractions, square roots, heat, electricity, density.",
      "Engineering Drawing: Isometric projection, orthographic views, cross-sections, tool schematics."
    ],
    "examPatternSummary": "DVET: Direct merit based on 10th marks. RRB ALP: CBT 1 (75 Qs, 60 Mins) + CBT 2 (175 Qs, 2.5 Hours, Part A technical + Part B trade test).",
    "salaryLadder": {
      "entry": "₹3 Lakhs – ₹6.5 Lakhs / year (Railway Assistant Loco Pilot: Level 2 Pay ₹19,900 base + Running Allowance of ₹4–₹5 per km = ₹40,000–₹55,000/month in-hand)",
      "mid": "₹7 Lakhs – ₹14 Lakhs / year (Senior Passenger Loco Pilot / PSU Master Technician)",
      "senior": "₹15 Lakhs – ₹28 Lakhs / year (Mail / Express Superfast Loco Pilot / Chief Electrical Foreman)",
      "highestPaying": "Indian Railways Mail / Rajdhani Loco Pilots (High running allowances), ONGC Offshore Rig Technicians, Gulf Overseas Industrial Trades"
    },
    "scopeAndFuture": {
      "rating": "4.8/5 (Fastest Government Employment Pathway After 10th)",
      "summary": "ITI is the most direct route to government and PSU employment. Indian Railways recruits tens of thousands of ITI certificate holders every year for Assistant Loco Pilot and Technician posts with exceptional job security and central government benefits.",
      "aiImpact": "100% Safe: Physically driving freight and passenger railway locomotives across varying tracks, climbing high-voltage power transmission poles, and performing underwater welding can never be automated.",
      "growthSectors": [
        "Vande Bharat & High-Speed Bullet Train Operations",
        "MSEDCL & Mahatransco High-Voltage Power Grid Maintenance",
        "Defense Ordnance Factories & Naval Shipyards (Mazagon Dock Mumbai)",
        "Electric Vehicle (EV) Factory Assembly Lines"
      ]
    },
    "techStackAndSkills": [
      "Electrician Trade: AC/DC motors, armature winding, transformers, 3-phase wiring, multimeters, megger testing",
      "Fitter / Machinist: Lathe machines, milling machines, drill presses, micrometers, vernier calipers, blueprint reading",
      "Welding: TIG, MIG, Arc welding, gas cutting, safety protocols"
    ],
    "stepByStepRoadmap": [
      "Class 10 Pass: Apply online on DVET Maharashtra portal immediately after Class 10 results (June).",
      "Select Top Trades: Choose 2-year National Trade Certificate (NTC) courses: Electrician, Fitter, Wireman, or Machinist.",
      "Apprenticeship: Complete 1-year National Apprenticeship Certificate (NAC) in Central Railway, Western Railway, Mazagon Dock, or Tata Motors.",
      "Railway ALP Recruitment: Appear for RRB Assistant Loco Pilot exam (CBT 1, CBT 2, and Computer Based Aptitude Test).",
      "Medical Category A-1: Must pass strict eye test (6/6 vision without glasses, zero color blindness).",
      "Appointment: Join Indian Railways as Assistant Loco Pilot driving locomotives across India!"
    ],
    "topColleges": [
      {
        "name": "Government Industrial Training Institute (ITI Mumbai)",
        "location": "Agripada, Mumbai (Est. 1954)",
        "type": "Premier Model ITI"
      },
      {
        "name": "Government ITI Pune (Aundh)",
        "location": "Aundh, Pune",
        "type": "Top Ranked Maharashtra ITI"
      },
      {
        "name": "Government ITI Nagpur / Nashik / Aurangabad",
        "location": "District Headquarters",
        "type": "Affordable State Excellence"
      }
    ],
    "externalWebsites": [
      {
        "title": "DVET Maharashtra ITI Admission Portal",
        "url": "https://admission.dvet.gov.in",
        "note": "Centralized admission forms, seat allotment, and trade syllabus"
      },
      {
        "title": "Railway Recruitment Board (RRB Mumbai)",
        "url": "https://www.rrbmumbai.gov.in",
        "note": "Assistant Loco Pilot and Technician recruitment notices"
      },
      {
        "title": "Apprenticeship India Portal (NAPS)",
        "url": "https://www.apprenticeshipindia.gov.in",
        "note": "Govt portal for trade apprentice registration and monthly stipends"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Railway Assistant Loco Pilot (RRB ALP), Railway Technician Grade III, Mahatransco Technician, Mazagon Dock Shipbuilders Skilled Tradesman, Indian Navy Tradesman Mate, ISRO Technician B.",
      "examUdaanLink": "/jobs?q=iti",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "merchant-navy-nautical-science",
    "streamId": "science",
    "categoryId": "sci_arch_aviation",
    "title": "Merchant Navy Officer — Nautical Science & Marine Engineering",
    "role": "Deck Cadet, Second Mate, Chief Navigating Officer, Ship Captain / Master Mariner, Marine Chief Engineer",
    "min12thStream": "12th Science with PCM (Physics, Chemistry, Maths) minimum 60% aggregate and 50%+ in English",
    "keySubjectsToScore": [
      {
        "subject": "Physics & Mathematics (Trigonometry, Mechanics)",
        "minScore": "70%+",
        "reason": "Celestial navigation, ship stability, displacement calculations, and radar plotting."
      },
      {
        "subject": "English Communication",
        "minScore": "60%+",
        "reason": "Mandatory DG Shipping requirement; global maritime operations require standard IMO marine English."
      },
      {
        "subject": "Medical Fitness & Vision",
        "minScore": "6/6 unaided",
        "reason": "Zero color blindness; strict DG Shipping medical examination mandatory for continuous discharge certificate (CDC)."
      }
    ],
    "entranceExams": [
      {
        "name": "IMU-CET (Indian Maritime University Common Entrance Test)",
        "body": "Indian Maritime University (Govt of India)",
        "level": "National (Mandatory for all DGS-approved maritime colleges)",
        "mode": "Online CBT",
        "website": "https://www.imu.edu.in"
      },
      {
        "name": "Company Sponsorship Tests (Anglo-Eastern, Synergy, Fleet, Scorpio)",
        "body": "Global Shipping Companies",
        "level": "International Merchant Fleets",
        "mode": "Online Aptitude + Psychometric + Interview",
        "website": "https://www.imu.edu.in"
      }
    ],
    "examDatesAndCycles": "IMU-CET Registration: April–May | Entrance Exam: First weekend of June | Results: Mid-June | Shipping Company Sponsorships: March–July.",
    "portionAndSyllabus": [
      "Mathematics (Class 11 & 12): Vectors, Trigonometry, Coordinate Geometry, Calculus, Probability (50 Questions).",
      "Physics: Mechanics, Waves, Electricity, Magnetism, Optics (50 Questions).",
      "Chemistry (Class 11 & 12 fundamentals — 20 Questions).",
      "English & General Aptitude: Vocabulary, Grammar, Logical Reasoning, Spatial Awareness (80 Questions)."
    ],
    "examPatternSummary": "IMU-CET: 200 Multiple Choice Questions, 200 Marks, 3 Hours. Marking: +1 for correct, -0.25 negative marking. Cutoff percentile needed for T.S. Chanakya & MERI.",
    "salaryLadder": {
      "entry": "₹12 Lakhs – ₹28 Lakhs / year ($1,500 – $3,200 / month tax-free stipend as Junior Deck/Engine Officer on international tankers)",
      "mid": "₹35 Lakhs – ₹70 Lakhs / year ($4,500 – $8,500 / month as Chief Mate or Second Engineer)",
      "senior": "₹95 Lakhs – ₹1.8 Crore+ / year ($11,000 – $16,000 / month as Ship Captain / Chief Marine Engineer on VLCC Crude Oil & LNG carriers)",
      "highestPaying": "Ultra-Large Container Ships (Maersk, MSC), LNG / LPG Gas Tankers (Chevron, Teekay), Offshore DP3 Oil Drilling Vessels"
    },
    "scopeAndFuture": {
      "rating": "4.9/5 (100% Tax-Free Income in Foreign Currency + Free Worldwide Travel)",
      "summary": "90% of global merchandise trade travels by ship. Indian seafarers are among the most respected in the world. Qualifies for NRI tax-exempt status when sailing on international waters for 183+ days a year.",
      "aiImpact": "Ultra-Safe: While automation assists automated navigation, physically berthing 400-meter container ships, navigating high-seas typhoons, pirate corridors, and emergency machinery repair requires licensed master mariners.",
      "growthSectors": [
        "Green Ammonia & Methanol Dual-Fuel Mega Ships",
        "LNG & Liquid Hydrogen Energy Carriers",
        "Offshore Wind Turbine Installation Vessels",
        "Global Port Operations & Maritime Law"
      ]
    },
    "techStackAndSkills": [
      "Navigation Systems: ECDIS (Electronic Chart Display), RADAR / ARPA, AIS, GPS, Gyrocompass, Echo Sounder",
      "Marine Machinery: Sulzer & MAN B&W 2-Stroke Marine Diesel Engines, Auxiliary Boilers, Purifiers, Oily Water Separators",
      "Safety Protocols: STCW 2010 Certifications, Solas, Marpol, Fire Fighting, Survival at Sea, Ship Security"
    ],
    "stepByStepRoadmap": [
      "Class 12 PCM: Score 70%+ in PCM and 60%+ in English; ensure 6/6 eye vision with zero color blindness.",
      "Company Sponsorship (Crucial): Clear sponsorship exam & interview of Anglo-Eastern, Synergy, Scorpio, or Fleet Management before training.",
      "IMU-CET: Clear IMU-CET with high all-India rank.",
      "Maritime Academy: Join 3-Year B.Sc Nautical Science (T.S. Chanakya / TMI Pune) OR 1-Year Diploma in Nautical Science (DNS) OR 4-Year B.Tech Marine Engineering (MERI Kolkata).",
      "Sea-Time Training: Complete 12-18 months of cadet sea-time aboard commercial merchant ships.",
      "DG Shipping COC Exam: Clear Second Mate / MEO Class IV Oral and Written exams to receive Ministry of Shipping Certificate of Competency (COC).",
      "Rise to Captain: Clear Chief Mate and Master Mariner exams to command multi-million dollar ocean vessels as Ship Captain!"
    ],
    "topColleges": [
      {
        "name": "T.S. Chanakya (Indian Maritime University Mumbai Campus)",
        "location": "Karave, Navi Mumbai",
        "type": "Apex Govt Maritime Academy (Est. 1927)"
      },
      {
        "name": "Tolani Maritime Institute (TMI Pune)",
        "location": "Induri, Talegaon Dabhade, Pune",
        "type": "Premier Private Maritime Campus in Asia"
      },
      {
        "name": "Marine Engineering & Research Institute (MERI / IMU Kolkata)",
        "location": "Kolkata, West Bengal",
        "type": "India's Best Marine Engineering College"
      },
      {
        "name": "Anglo-Eastern Maritime Academy (AEMA Karjat)",
        "location": "Karjat, Maharashtra",
        "type": "100% Placement Guaranteed Shipowner Academy"
      }
    ],
    "externalWebsites": [
      {
        "title": "Indian Maritime University (IMU)",
        "url": "https://www.imu.edu.in",
        "note": "Central university conducting IMU-CET admissions and counseling"
      },
      {
        "title": "Directorate General of Shipping (Govt of India)",
        "url": "https://www.dgshipping.gov.in",
        "note": "Approved maritime training institutes, e-Governance, and CDC verification"
      },
      {
        "title": "Tolani Maritime Institute Admissions",
        "url": "https://www.tolani.edu",
        "note": "B.Sc Nautical Science and Marine Engineering admission details"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Ministry of Ports, Shipping and Waterways Port Officer, Mumbai Port Trust Pilot, Indian Coast Guard Assistant Commandant (Technical/General Duty), Naval Dockyard Marine Engineer.",
      "examUdaanLink": "/jobs?q=marine",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "aerospace-aeronautical-engineering",
    "streamId": "science",
    "categoryId": "sci_eng",
    "title": "Aerospace & Aeronautical Engineer (B.Tech / B.E.)",
    "role": "Rocket Propulsion Specialist, Aerodynamics Flight Designer, Satellite Systems Engineer, Drone UAV Architect",
    "min12thStream": "12th Science with PCM (Physics, Chemistry, Maths)",
    "keySubjectsToScore": [
      {
        "subject": "Physics (Fluid Mechanics, Thermodynamics, Kinematics)",
        "minScore": "80%+",
        "reason": "Supersonic airflow, shock waves, rocket thrust, and orbital orbital mechanics."
      },
      {
        "subject": "Mathematics (Differential Equations, Vector Calculus)",
        "minScore": "80%+",
        "reason": "Navier-Stokes equations, flight trajectory equations, and structural finite element analysis."
      }
    ],
    "entranceExams": [
      {
        "name": "JEE Advanced",
        "body": "IITs",
        "level": "National (For IIT Bombay, IIT Madras, IIT Kanpur Aerospace)",
        "mode": "Online CBT",
        "website": "https://jeeadv.ac.in"
      },
      {
        "name": "JEE Main (IIST Admission)",
        "body": "NTA / IIST",
        "level": "National (Direct scientist absorption into ISRO)",
        "mode": "Online CBT",
        "website": "https://www.iist.ac.in"
      },
      {
        "name": "GATE Aerospace (AE)",
        "body": "IITs",
        "level": "National (DRDO Scientist 'B', ISRO, HAL, M.Tech)",
        "mode": "Online CBT",
        "website": "https://gate2026.iit.ac.in"
      }
    ],
    "examDatesAndCycles": "JEE Main: Jan & Apr | JEE Advanced: May | IIST Counseling: June-July | GATE: Early February.",
    "portionAndSyllabus": [
      "Aerodynamics: Incompressible & Compressible Flow, Shock Waves, Airfoil & Wing Theory, Wind Tunnel Testing.",
      "Flight Mechanics: Airplane Performance, Static and Dynamic Stability, Orbit Trajectories, Satellite Attitude Control.",
      "Space Propulsion: Liquid & Solid Rocket Motors, Cryogenic Engines, Gas Turbines, Compressors & Combustion Chambers.",
      "Structures: Thin-Walled Structures, Aeroelasticity, Carbon-Fiber Composite Materials, Finite Element Analysis (FEA)."
    ],
    "examPatternSummary": "JEE Advanced: Two compulsory 3-hour papers (Physics, Chemistry, Maths). GATE AE: 65 Questions, 100 Marks (Aptitude 15 + Engineering Math 13 + Aerospace 72).",
    "salaryLadder": {
      "entry": "₹7.5 Lakhs – ₹18 Lakhs / year (ISRO Scientist/Engineer 'SC': Level 10 Pay ₹56,100 base + allowances = ₹85,000/mo; Boeing/Airbus India: ₹12–₹18 LPA)",
      "mid": "₹22 Lakhs – ₹45 Lakhs / year (Senior Flight Control Lead / Satellite Payload Specialist)",
      "senior": "₹50 Lakhs – ₹1.2 Crore+ / year (Chief Aerospace Architect / Director of Space Missions / Private SpaceTech Co-Founder)",
      "highestPaying": "Global Aerospace Giants (Boeing, Airbus, Rolls-Royce Aerospace, Lockheed Martin), Private SpaceTech (Skyroot, Agnikul, Pixxel), ISRO / DRDO Apex Scientist grades"
    },
    "scopeAndFuture": {
      "rating": "4.9/5 (Historic Indian Space Economy Boom — Chandrayaan, Gaganyaan & Drone Revolution)",
      "summary": "India's space sector is opened to private commercial players, with startups like Skyroot, Agnikul, and Pixxel launching satellites. Combined with defense drone indigenization (Make in India) and Indian commercial airline fleet orders (1,200+ aircraft by Air India & IndiGo), aerospace engineers have unprecedented opportunities.",
      "aiImpact": "Core Builder: Autonomous drone swarms, AI autopilot navigation, and generative structural lightweighting require aerospace engineers who validate aerodynamics and zero-failure space propulsion.",
      "growthSectors": [
        "Reusable Satellite Launch Vehicles & Cryogenic Engines",
        "Defense Drones & Loitering Munitions (UAVs)",
        "Urban Air Mobility (Electric eVTOL Flying Taxis)",
        "Earth Observation Satellite Payloads & Hypersonic Missiles"
      ]
    },
    "techStackAndSkills": [
      "Computational Fluid Dynamics (CFD): ANSYS Fluent, OpenFOAM, Star-CCM+",
      "Structural FEA & CAD: CATIA V5, Siemens NX, ABAQUS, HyperMesh",
      "Flight Simulation & Controls: MATLAB Simulink, Python, C++, FlightGear, ROS for Drones"
    ],
    "stepByStepRoadmap": [
      "Class 12: High percentile in PCM (85%+ target); strong focus on mechanics and calculus.",
      "Entrance: Score top 1% in JEE Main & Advanced; apply for IIST Thiruvananthapuram (ISRO quota) or top IITs.",
      "Graduation: 4-Year B.Tech in Aerospace / Aeronautical Engineering.",
      "Hands-on Projects: Build sounding rockets, radio-controlled UAVs, and conduct wind-tunnel research.",
      "Career Launch: Direct campus absorption into ISRO (from IIST), clear GATE for DRDO Scientist 'B', or join commercial aviation multinationals (Airbus, Boeing India)."
    ],
    "topColleges": [
      {
        "name": "Indian Institute of Space Science and Technology (IIST)",
        "location": "Thiruvananthapuram, Kerala",
        "type": "ISRO Department of Space Apex Institute"
      },
      {
        "name": "IIT Bombay (Aerospace Engineering Department)",
        "location": "Powai, Mumbai",
        "type": "Premier IIT with Supersonic Wind Tunnels"
      },
      {
        "name": "Defence Institute of Advanced Technology (DIAT)",
        "location": "Girinagar, Pune",
        "type": "DRDO Apex Deemed Defense University"
      },
      {
        "name": "IIT Madras & IIT Kanpur Aerospace",
        "location": "National Premier",
        "type": "Pioneers in Rocketry and Flight Testing"
      }
    ],
    "externalWebsites": [
      {
        "title": "Indian Space Research Organisation (ISRO)",
        "url": "https://www.isro.gov.in",
        "note": "Central space agency mission details, ICRB scientist recruitments"
      },
      {
        "title": "IIST Admissions Portal",
        "url": "https://www.iist.ac.in",
        "note": "B.Tech Aerospace admission via JEE Advanced ranking"
      },
      {
        "title": "Defence Research and Development Organisation (DRDO)",
        "url": "https://www.drdo.gov.in",
        "note": "Aeronautical development establishment, missile tech labs"
      }
    ],
    "govtExamSynergy": {
      "jobs": "ISRO Scientist/Engineer 'SC', DRDO Scientist 'B' via RAC, Hindustan Aeronautics Limited (HAL) Management Trainee, Directorate General of Civil Aviation (DGCA) Air Safety Officer.",
      "examUdaanLink": "/jobs?q=aerospace",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "chemical-petrochemical-engineering",
    "streamId": "science",
    "categoryId": "sci_eng",
    "title": "Chemical & Petrochemical Process Engineer (B.Tech / B.E.)",
    "role": "Process Optimization Engineer, Refinery Operations Lead, Green Hydrogen Technologist, Specialty Polymer Specialist",
    "min12thStream": "12th Science with PCM (Physics, Chemistry, Maths)",
    "keySubjectsToScore": [
      {
        "subject": "Chemistry (Physical, Organic & Thermodynamics)",
        "minScore": "75%+",
        "reason": "Reaction kinetics, chemical equilibria, mass balances, and catalyst performance."
      },
      {
        "subject": "Mathematics & Physics (Calculus, Heat Transfer)",
        "minScore": "75%+",
        "reason": "Fluid dynamics, distillation column column hydraulics, and heat exchanger heat loads."
      }
    ],
    "entranceExams": [
      {
        "name": "MHT-CET (PCM)",
        "body": "State CET Cell Maharashtra",
        "level": "State (Apex Institute: ICT Mumbai / UDCT)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "JEE Main",
        "body": "NTA",
        "level": "National (NITs, IITs)",
        "mode": "Online CBT",
        "website": "https://jeemain.nta.nic.in"
      },
      {
        "name": "GATE (Chemical Engineering - CH)",
        "body": "IITs",
        "level": "National (For ONGC, IOCL, BPCL, HPCL Maharatnas)",
        "mode": "Online CBT",
        "website": "https://gate2026.iit.ac.in"
      }
    ],
    "examDatesAndCycles": "MHT-CET: April–May | JEE Main: Jan & Apr | GATE: February | Results: June.",
    "portionAndSyllabus": [
      "Process Calculations & Thermodynamics: Material & Energy Balances, PVT Behavior, Chemical Reaction Equilibria.",
      "Fluid Mechanics & Heat Transfer: Fluid Statics, Flow Meters, Heat Exchangers, Evaporators, Radiation.",
      "Mass Transfer Operations: Distillation Columns, Absorption, Liquid-Liquid Extraction, Drying, Membrane Separations.",
      "Chemical Reaction Engineering: Batch, CSTR and Plug Flow Reactors, Catalysis, Kinetics of Heterogeneous Reactions.",
      "Process Dynamics & Control: Feedback Loops, PID Controllers, PLC / DCS Automation, Plant Safety & HAZOP Analysis."
    ],
    "examPatternSummary": "MHT-CET: 150 Qs, 200 Marks, 3 Hours, No Negative Marking. GATE CH: 65 Questions, 100 Marks, 3 Hours (+1/-0.33, +2/-0.66).",
    "salaryLadder": {
      "entry": "₹6.5 Lakhs – ₹16 Lakhs / year (PSU Maharatna Engineers: ONGC, IOCL, BPCL start at ₹16–₹20 LPA CTC; Reliance Jamnagar Refinery ₹8–₹14 LPA)",
      "mid": "₹20 Lakhs – ₹42 Lakhs / year (Senior Plant Operations Manager / Lead Process Consultant)",
      "senior": "₹50 Lakhs – ₹1.2 Crore+ / year (VP of Manufacturing, Refinery Director, Chief Technical Officer)",
      "highestPaying": "Public Sector Maharatnas (ONGC, IOCL, GAIL, HPCL), Global Petrochemical & Energy Giants (Shell, ExxonMobil, Reliance, BASF, Dow Chemical)"
    },
    "scopeAndFuture": {
      "rating": "4.8/5 (Vital Core Backbone of India's Manufacturing, Energy & Green Hydrogen Transition)",
      "summary": "Chemical engineers run India's mega refineries, pharmaceutical bulk drug factories, fertilizer plants, and specialty chemical complexes. India is emerging as the world's alternative specialty chemicals manufacturing capital.",
      "aiImpact": "Low: Software can simulate reactions (Aspen Plus), but physical plant safety, HAZOP audits, distillation tower turnarounds, and toxic chemical handling require certified chemical engineers.",
      "growthSectors": [
        "Green Hydrogen Generation & Carbon Capture (CCUS)",
        "Lithium-Ion Battery Cell Chemicals & Electrolytes",
        "Specialty Agro-Chemicals & Active Pharma Ingredients (API)",
        "Bio-Plastics & Circular Polymer Recycling"
      ]
    },
    "techStackAndSkills": [
      "Process Simulation: Aspen Plus, Aspen HYSYS, DWSIM, CHEMCAD",
      "Plant Design: AutoCAD P&ID, SmartPlant, HTRI (Heat Exchanger Design)",
      "Operations & Safety: Distributed Control Systems (DCS), SCADA, HAZOP & SIL Risk Studies"
    ],
    "stepByStepRoadmap": [
      "Class 12: Score 80%+ in PCM; master thermodynamics and physical chemistry.",
      "MHT-CET / JEE: Target 99%+ in MHT-CET for ICT Mumbai (Institute of Chemical Technology, formerly UDCT — India's apex chemical institute).",
      "Graduation: 4-Year B.Tech in Chemical Engineering.",
      "Internships: Plant training at petrochemical refineries (BPCL Mumbai refinery, Reliance, Deepak Nitrite).",
      "Campus Placement / GATE: Clear GATE in top 200 ranks for direct Class-1 Executive Trainee post in ONGC or IOCL, or join global MNCs."
    ],
    "topColleges": [
      {
        "name": "Institute of Chemical Technology (ICT Mumbai — formerly UDCT)",
        "location": "Matunga, Mumbai",
        "type": "World-Renowned Apex Chemical Technology Institute"
      },
      {
        "name": "Laxminarayan Innovation Technological University (LIT Nagpur)",
        "location": "Nagpur, Maharashtra",
        "type": "Premier Historic Chemical Engineering University"
      },
      {
        "name": "IIT Bombay (Department of Chemical Engineering)",
        "location": "Powai, Mumbai",
        "type": "Global Top-50 Chemical Engineering Program"
      },
      {
        "name": "Dr. Babasaheb Ambedkar Technological University (DBATU Lonere)",
        "location": "Raigad, Maharashtra",
        "type": "State Technical University for Chemical Hubs"
      }
    ],
    "externalWebsites": [
      {
        "title": "Institute of Chemical Technology (ICT Mumbai)",
        "url": "https://www.ictmumbai.edu.in",
        "note": "Pioneer in chemical engineering education and industrial research"
      },
      {
        "title": "Indian Institute of Chemical Engineers (IIChE)",
        "url": "https://www.iiche.org.in",
        "note": "National professional body for chemical engineers"
      },
      {
        "title": "MHT-CET State CET Cell",
        "url": "https://cetcell.mahacet.org",
        "note": "Centralized admission for ICT, LIT, and engineering colleges"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Oil and Natural Gas Corporation (ONGC) AEE, Indian Oil (IOCL) Chemical Engineer, Bharat Petroleum (BPCL), Bhabha Atomic Research Centre (BARC Scientific Officer via OCES), National Fertilizers Limited (NFL).",
      "examUdaanLink": "/jobs?q=chemical",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "robotics-automation-mechatronics",
    "streamId": "science",
    "categoryId": "sci_eng",
    "title": "Robotics & Industrial Automation Engineer (B.Tech Mechatronics)",
    "role": "Robotics Perception Engineer, PLC & SCADA Automation Lead, Autonomous Cobot Developer, Drone Flight Control Engineer",
    "min12thStream": "12th Science with PCM (Physics, Chemistry, Maths)",
    "keySubjectsToScore": [
      {
        "subject": "Physics (Mechanics, Electromagnetism)",
        "minScore": "75%+",
        "reason": "Kinematics of robotic joints, torque calculations, actuator dynamics, and sensor electronics."
      },
      {
        "subject": "Mathematics (Linear Algebra, Calculus)",
        "minScore": "80%+",
        "reason": "Matrix transformations for 6-DOF robotic arms, PID control loops, and computer vision geometry."
      }
    ],
    "entranceExams": [
      {
        "name": "MHT-CET (PCM)",
        "body": "State CET Cell Maharashtra",
        "level": "State (COEP Pune, VJTI Mumbai)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "JEE Main & Advanced",
        "body": "NTA / IITs",
        "level": "National",
        "mode": "Online CBT",
        "website": "https://jeemain.nta.nic.in"
      },
      {
        "name": "GATE (Robotics / Mechanical / Electrical)",
        "body": "IITs",
        "level": "National Master & DRDO recruitment",
        "mode": "Online CBT",
        "website": "https://gate2026.iit.ac.in"
      }
    ],
    "examDatesAndCycles": "Registration: Dec–Feb | Exams: Apr–May | GATE: February | Results: June.",
    "portionAndSyllabus": [
      "Robotic Kinematics & Dynamics: Forward and Inverse Kinematics (DH Parameters), Jacobian, Trajectory Planning, Mobile Robot Navigation.",
      "Control Systems & Automation: Classical & Modern Control, State Space, PLC Programming (Ladder Logic, FBD), SCADA, Industrial IoT (IIoT).",
      "Sensors & Perception: Lidar, Ultrasonic, IMU, Depth Cameras, OpenCV Computer Vision, SLAM (Simultaneous Localization and Mapping).",
      "Embedded Systems: ARM Cortex, ROS (Robot Operating System), C++, Python, Actuators (Servo, Stepper, BLDC, Pneumatics)."
    ],
    "examPatternSummary": "MHT-CET: 150 Qs, 200 Marks. JEE Main: 75 Qs, 300 Marks. Comprehensive practical labs and design portfolios required for premier hiring.",
    "salaryLadder": {
      "entry": "₹6 Lakhs – ₹14 Lakhs / year (Campus placement at ABB, Fanuc, KUKA, Tata Motors EV, DRDO labs, GreyOrange, Addverb Robotics)",
      "mid": "₹18 Lakhs – ₹38 Lakhs / year (Autonomous Vehicle / Warehouse Automation Lead)",
      "senior": "₹45 Lakhs – ₹1.1 Crore+ / year (VP of Industrial Automation, Principal Robotics Architect, Silicon Hardware Lead)",
      "highestPaying": "Autonomous Vehicle Companies (Tesla, Waymo, Cruise), Industrial Robotics Kings (ABB, KUKA, Fanuc), Defense Autonomous Drone Contractors"
    },
    "scopeAndFuture": {
      "rating": "5/5 (The Core Engine of Industry 4.0, Smart Factories & Autonomous Logistics)",
      "summary": "Automotive assembly lines, pharmaceutical packaging, e-commerce fulfillment warehouses, and defense drones are rapidly automating. Mechatronics and robotics engineers bridge the gap between mechanical hardware, electronics, and AI software.",
      "aiImpact": "Core Builder: AI requires physical bodies to interact with the real world. Robotics engineers build and program the sensors, actuators, and mechanical frames that run AI algorithms.",
      "growthSectors": [
        "Warehouse Autonomous Mobile Robots (AMRs / AGVs)",
        "Collaborative Humanoid Cobots for Manufacturing",
        "Agricultural & Defense Surveillance Drones",
        "Surgical Medical Robots (da Vinci Systems)"
      ]
    },
    "techStackAndSkills": [
      "Robotics Frameworks: ROS 2 (Robot Operating System), Gazebo Simulation, MoveIt, Isaac Sim (NVIDIA)",
      "Programming: C++, Python, MATLAB Simulink, Linux Ubuntu RTOS",
      "Industrial Hardware: Siemens S7-1200 / Allen-Bradley PLCs, Studio 5000, SolidWorks 3D, Arduino / STM32"
    ],
    "stepByStepRoadmap": [
      "Class 12: High score in PCM (80%+); learn basic Python programming and Arduino microcontrollers.",
      "Entrance: Clear MHT-CET or JEE Main with high ranks.",
      "Graduation: 4-Year B.Tech in Mechatronics, Robotics & Automation, or Mechanical/Electrical with robotics electives.",
      "Competitions: Participate in e-Yantra (IIT Bombay Robotics Competition), Robocon India, and build autonomous rovers.",
      "Career: Join elite industrial automation companies (ABB, Siemens, Addverb) or pursue Master's/Ph.D. in Autonomous Systems."
    ],
    "topColleges": [
      {
        "name": "COEP Technological University (Mechatronics & Robotics)",
        "location": "Shivajinagar, Pune",
        "type": "Premier State Technical University with Robocon Champions"
      },
      {
        "name": "VJTI Mumbai (Robotics Lab)",
        "location": "Matunga, Mumbai",
        "type": "Pioneer in Industrial Automation & Controls"
      },
      {
        "name": "MIT World Peace University (Robotics & Automation B.Tech)",
        "location": "Kothrud, Pune",
        "type": "Advanced Robotics & AI Research Labs"
      },
      {
        "name": "IIT Delhi & IIT Madras (Robotics Specialization)",
        "location": "National Apex",
        "type": "Advanced Research in Autonomous Mobile Robots"
      }
    ],
    "externalWebsites": [
      {
        "title": "IIT Bombay e-Yantra Robotics Portal",
        "url": "https://www.e-yantra.org",
        "note": "Govt of India funded project for robotics and embedded systems education"
      },
      {
        "title": "Robotics Society of India (RSI)",
        "url": "https://www.rs-india.org",
        "note": "National academic and industrial robotics organization"
      },
      {
        "title": "COEP Tech Admissions",
        "url": "https://www.coep.org.in",
        "note": "Mechatronics engineering and advanced prototyping centers"
      }
    ],
    "govtExamSynergy": {
      "jobs": "DRDO Centre for Artificial Intelligence & Robotics (CAIR Bangalore) Scientist 'B', ISRO Inertial Systems Unit (IISU), BHEL Industrial Automation Engineer, Ordnance Factories.",
      "examUdaanLink": "/jobs?q=robotics",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "forensic-science-cyber-forensics",
    "streamId": "science",
    "categoryId": "sci_pure",
    "title": "Forensic Scientist & Cyber Crime Investigator (B.Sc / M.Sc Forensic Science)",
    "role": "Digital Cyber Forensics Analyst, Crime Scene Ballistics Investigator, Forensic DNA Serologist, Toxicologist",
    "min12thStream": "12th Science with PCM or PCB (Physics, Chemistry, Maths / Biology)",
    "keySubjectsToScore": [
      {
        "subject": "Chemistry & Biology",
        "minScore": "70%+",
        "reason": "Toxicology poisoning analysis, chemical reagent testing, DNA electrophoresis, and blood spatter serology."
      },
      {
        "subject": "Physics & Computer Fundamentals",
        "minScore": "70%+",
        "reason": "Firearm ballistics trajectory, digital hard drive hex data extraction, and mobile malware analysis."
      }
    ],
    "entranceExams": [
      {
        "name": "NFAT (National Forensic Admission Test)",
        "body": "National Forensic Sciences University (NFSU - Ministry of Home Affairs)",
        "level": "National (For B.Sc-M.Sc Integrated Forensic Science & Cyber Security)",
        "mode": "Online CBT",
        "website": "https://www.nfsu.ac.in"
      },
      {
        "name": "CUET UG / PG",
        "body": "NTA",
        "level": "National (Central Universities Forensic Science)",
        "mode": "Online CBT",
        "website": "https://cuet.nta.nic.in"
      },
      {
        "name": "Maha State Forensic Merit Process",
        "body": "Directorate of Higher Education Maharashtra",
        "level": "State (Govt Forensic Institutes in Mumbai, Nagpur, Aurangabad)",
        "mode": "Merit based on 12th Marks",
        "website": "https://ifsc.edu.in"
      }
    ],
    "examDatesAndCycles": "NFAT Registration: March–May | Entrance Exam: June–July | Maharashtra State Merit Forms: June (post 12th results).",
    "portionAndSyllabus": [
      "Physical Sciences: Forensic Physics, Crime Scene Management, Ballistics, Tool Marks, Footprint Casting.",
      "Chemical & Biological: Forensic Toxicology, Narcotics & Psychotropic Substances, Forensic Serology, DNA Fingerprinting.",
      "Digital & Cyber Forensics: Disk Imaging (EnCase/FTK), Mobile Phone Forensics (Cellebrite), Memory Analysis, Network Log Auditing.",
      "Legal Jurisprudence: Indian Penal Code (IPC / Bharatiya Nyaya Sanhita), CrPC (BNSS), Indian Evidence Act, IT Act 2000."
    ],
    "examPatternSummary": "NFAT: 100 Multiple Choice Questions, 100 Marks, 90 Minutes. Covers Physics, Chemistry, Biology, Mathematics & Aptitude.",
    "salaryLadder": {
      "entry": "₹4 Lakhs – ₹9 Lakhs / year (State Forensic Science Lab Scientific Assistant / Cyber Forensics Analyst at Big 4: Deloitte, EY, PwC)",
      "mid": "₹12 Lakhs – ₹26 Lakhs / year (Senior Forensic Toxicologist / Incident Response & Cyber Threat Hunter)",
      "senior": "₹30 Lakhs – ₹65 Lakhs+ / year (Assistant Director of Central Forensic Science Lab / Partner - Forensic Risk & Dispute Services)",
      "highestPaying": "Corporate Fraud & Financial Investigation (Big 4, Alvarez & Marsal, Kroll), International Cybersecurity Forensics (Mandiant, CrowdStrike)"
    },
    "scopeAndFuture": {
      "rating": "4.7/5 (Exponential Rise in Cyber Crimes & Mandatory Forensic Investigation Laws)",
      "summary": "With new Indian criminal laws (Bharatiya Sakshya Adhiniyam) mandating scientific forensic investigation for serious crimes, demand for forensic laboratories, toxicologists, and digital crime analysts has exploded across state police and central agencies.",
      "aiImpact": "Strong Co-Existence: AI detects digital fraud anomalies and image tampering, but physical courtroom cross-examinations, expert witness testimony, and certified forensic reports must be signed by human forensic scientists.",
      "growthSectors": [
        "Digital Cyber Crime & Mobile Phone Extraction",
        "Forensic DNA Profiling & Genetic Genealogy",
        "Financial Fraud & Crypto Asset Tracing",
        "Wildlife & Environmental Forensic Investigation"
      ]
    },
    "techStackAndSkills": [
      "Digital Forensics: EnCase, AccessData FTK Imager, Autopsy, Cellebrite UFED, Wireshark, Volatility Memory Forensics",
      "Laboratory Instrumentation: Gas Chromatography-Mass Spectrometry (GC-MS), HPLC, FTIR, PCR Thermal Cyclers",
      "Legal Expertise: Evidence Chain of Custody, Section 65B Electronic Evidence Certification, Courtroom Expert Testimony"
    ],
    "stepByStepRoadmap": [
      "Class 12: Score 70%+ in PCB or PCM stream.",
      "Entrance / Admission: Crack NFAT for National Forensic Sciences University (NFSU) OR apply to Government Institute of Forensic Science Mumbai/Nagpur.",
      "Undergraduate: Complete 3-Year B.Sc in Forensic Science or B.Tech in Cyber Security & Digital Forensics.",
      "Post-Graduation (Essential for Govt Class-1 posts): Complete 2-Year M.Sc in Forensic Science (with specialization in Questioned Documents, Cyber, or Toxicology).",
      "Recruitment: Clear MPSC / UPSC for Assistant Chemical Analyzer or Scientific Officer in State Forensic Science Laboratories (FSL Kalina, Mumbai) or join Big 4 fraud investigation."
    ],
    "topColleges": [
      {
        "name": "National Forensic Sciences University (NFSU)",
        "location": "Gandhinagar (HQ) & Pune Campus",
        "type": "Institution of National Importance (Ministry of Home Affairs)"
      },
      {
        "name": "Institute of Forensic Science (Govt of Maharashtra)",
        "location": "Fort, Mumbai (Cama Hospital Campus)",
        "type": "Premier Maharashtra State Forensic Institute"
      },
      {
        "name": "Government Institute of Forensic Science",
        "location": "Aurangabad & Nagpur",
        "type": "Affordable State Government Excellence"
      },
      {
        "name": "Amity Institute of Forensic Sciences",
        "location": "Noida / Mumbai",
        "type": "Leading Private Forensic Infrastructure"
      }
    ],
    "externalWebsites": [
      {
        "title": "National Forensic Sciences University (NFSU)",
        "url": "https://www.nfsu.ac.in",
        "note": "Apex university for criminalistics, cyber forensics, and homeland security"
      },
      {
        "title": "Directorate of Forensic Science Laboratories Maharashtra",
        "url": "https://fsl.maharashtra.gov.in",
        "note": "State FSL Kalina Mumbai recruitments and forensic divisions"
      },
      {
        "title": "Institute of Forensic Science Mumbai",
        "url": "https://ifsc.edu.in",
        "note": "B.Sc and M.Sc forensic science course admission guidelines"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Central Forensic Science Laboratory (CFSL / CBI) Scientific Officer, Maharashtra FSL Scientific Assistant / Chemical Analyzer, Police Cyber Cell Technical Consultant, National Crime Records Bureau (NCRB).",
      "examUdaanLink": "/jobs?q=forensic",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "biotechnology-genetic-engineering",
    "streamId": "science",
    "categoryId": "sci_pure",
    "title": "Biotechnology & Genetic Engineer (B.Tech / B.Sc Biotech)",
    "role": "Genomic Research Scientist, Vaccine Process Technologist, Bio-Informatics Modeler, CRISPR Gene Therapy Specialist",
    "min12thStream": "12th Science with PCB or PCMB (Physics, Chemistry, Biology & Maths)",
    "keySubjectsToScore": [
      {
        "subject": "Biology (Genetics, Molecular Biology, Biotechnology)",
        "minScore": "80%+",
        "reason": "DNA replication, gene cloning vectors, recombinant proteins, and enzyme kinetics."
      },
      {
        "subject": "Chemistry (Organic Chemistry, Biomolecules)",
        "minScore": "75%+",
        "reason": "Biochemical metabolic pathways, chromatography purification, and synthetic bio-molecules."
      }
    ],
    "entranceExams": [
      {
        "name": "MHT-CET (PCB / PCM)",
        "body": "State CET Cell Maharashtra",
        "level": "State (For B.Tech / B.Sc Biotech)",
        "mode": "Online CBT",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "GAT-B (Graduate Aptitude Test - Biotechnology)",
        "body": "Regional Centre for Biotechnology (DBT Govt of India)",
        "level": "National (For M.Sc/M.Tech DBT fellowship ₹12,000/mo)",
        "mode": "Online CBT",
        "website": "https://rcb.res.in"
      },
      {
        "name": "JEE Main / CUET UG",
        "body": "NTA",
        "level": "National (Central Universities, NITs)",
        "mode": "Online CBT",
        "website": "https://cuet.nta.nic.in"
      }
    ],
    "examDatesAndCycles": "MHT-CET: April–May | CUET UG: May | GAT-B: April | CSIR NET Life Sciences: June & December.",
    "portionAndSyllabus": [
      "Molecular Biology & Genetics: DNA Replication, Transcription, Translation, Operon Model, Mendelian Genetics, Mutation Repair.",
      "Recombinant DNA Technology: Restriction Enzymes, Plasmids, CRISPR/Cas9 Gene Editing, PCR Amplification, Gene Libraries.",
      "Bio-Process Engineering: Upstream Fermentation, Bioreactor Design, Downstream Purification (Chromatography, Ultrafiltration).",
      "Bio-Informatics & Computational Biology: Sequence Alignment (BLAST, FASTA), Protein Structural Modeling, Molecular Docking."
    ],
    "examPatternSummary": "MHT-CET: 200 Marks, 3 Hours. GAT-B: 160 Questions (Attempt 120), 240 Marks. CSIR NET Life Sciences: 200 Marks.",
    "salaryLadder": {
      "entry": "₹4.5 Lakhs – ₹9.5 Lakhs / year (Campus placement at Serum Institute of India, Biocon, Dr. Reddy's, Bharat Biotech, Syngene)",
      "mid": "₹14 Lakhs – ₹28 Lakhs / year (Biopharma Senior Scientist / Clinical Trial Manager)",
      "senior": "₹35 Lakhs – ₹80 Lakhs+ / year (R&D Director, Chief Scientific Officer, Global Biologics Regulatory Lead)",
      "highestPaying": "Global Biopharma Giants (Pfizer, Novartis, Biocon Biologics, Genentech), CRISPR Gene Editing & Genomic Therapy Startups"
    },
    "scopeAndFuture": {
      "rating": "4.8/5 (Pune & Hyderabad are the Vaccine & Biologics Capitals of the World)",
      "summary": "India produces over 60% of the world's vaccines. Serum Institute of India in Pune is the world's largest vaccine manufacturer by volume. The industry is expanding rapidly into biosimilars, mRNA vaccines, agricultural biotech, and synthetic biology.",
      "aiImpact": "Supercharged: AI models (AlphaFold by Google DeepMind) predict protein structures in seconds, enabling biotech engineers to design novel cancer drugs and synthetic enzymes faster than ever.",
      "growthSectors": [
        "mRNA & Recombinant Vaccine Manufacturing",
        "CRISPR-Cas9 Therapeutic Gene Editing",
        "Monoclonal Antibodies & Biosimilars",
        "Agricultural Crop Genetic Resilience (Climate Resistant Seeds)"
      ]
    },
    "techStackAndSkills": [
      "Laboratory Techniques: Gel Electrophoresis, HPLC, Western Blotting, Sanger Sequencing, Mass Spectrometry",
      "Bio-Informatics Software: PyMOL, AutoDock, Chimera, Bioconductor (R), Python for Genomics (Biopython)",
      "Regulatory Compliance: cGMP (Current Good Manufacturing Practice), US FDA 21 CFR, Cleanroom ISO Class 5-8"
    ],
    "stepByStepRoadmap": [
      "Class 12: High score in PCB or PCMB (75%+).",
      "Entrance: Score 90%+ in MHT-CET or CUET UG.",
      "Graduation: 4-Year B.Tech in Biotechnology OR 3-Year B.Sc Biotechnology.",
      "Research Internship: Secure 6-month lab training at National Chemical Laboratory (CSIR-NCL Pune), ACTREC, or Serum Institute.",
      "Higher Studies / Career: Crack GAT-B for funded M.Tech/M.Sc or join leading biopharma R&D facilities as Associate Scientist."
    ],
    "topColleges": [
      {
        "name": "Institute of Chemical Technology (ICT Mumbai)",
        "location": "Matunga, Mumbai",
        "type": "India's Apex Department of Bioprocess Technology"
      },
      {
        "name": "Savitribai Phule Pune University (SPPU Department of Biotechnology)",
        "location": "Ganeshkhind, Pune",
        "type": "DBT Star Status Research Department"
      },
      {
        "name": "Fergusson College (Autonomous)",
        "location": "FC Road, Pune",
        "type": "Top Ranked B.Sc Biotechnology Center"
      },
      {
        "name": "National Chemical Laboratory (CSIR-NCL)",
        "location": "Pashan, Pune",
        "type": "Premier Central Research Laboratory"
      }
    ],
    "externalWebsites": [
      {
        "title": "Department of Biotechnology (Govt of India)",
        "url": "https://dbtindia.gov.in",
        "note": "National biotech policy, research grants, GAT-B announcements"
      },
      {
        "title": "Regional Centre for Biotechnology (GAT-B Portal)",
        "url": "https://rcb.res.in",
        "note": "National testing and fellowship admissions"
      },
      {
        "title": "Serum Institute of India",
        "url": "https://www.seruminstitute.com",
        "note": "World's largest vaccine manufacturer located in Pune"
      }
    ],
    "govtExamSynergy": {
      "jobs": "CSIR-NCL / CSIR-CDRI Junior Research Fellow (JRF), Food Safety and Standards Authority of India (FSSAI) Technical Officer, Indian Council of Medical Research (ICMR) Scientist 'B', Patent Office Examiner of Patents & Designs.",
      "examUdaanLink": "/jobs?q=biotech",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "allied-health-bmlt-radiology",
    "streamId": "science",
    "categoryId": "sci_med",
    "title": "Medical Laboratory & Radiology Imaging Specialist (BMLT / B.Sc MIT)",
    "role": "Chief Laboratory Diagnostician, MRI & CT Neuro-Imaging Technologist, Cath Lab Specialist, Histopathologist",
    "min12thStream": "12th Science with PCB (Physics, Chemistry, Biology) minimum 50%",
    "keySubjectsToScore": [
      {
        "subject": "Biology & Human Anatomy",
        "minScore": "70%+",
        "reason": "Internal organ structure, cross-sectional anatomy, blood components, and pathology markers."
      },
      {
        "subject": "Physics (Radiation & Magnetism)",
        "minScore": "65%+",
        "reason": "X-ray photon generation, MRI radio-frequency pulse sequences, and radiation shielding safety."
      }
    ],
    "entranceExams": [
      {
        "name": "Maharashtra State Allied Health CET",
        "body": "State CET Cell Maharashtra / DMER",
        "level": "State (Govt Medical Colleges Paramedical)",
        "mode": "Online CBT / Merit",
        "website": "https://cetcell.mahacet.org"
      },
      {
        "name": "AIIMS Paramedical Entrance Exam",
        "body": "AIIMS New Delhi",
        "level": "National (For AIIMS B.Sc Medical Technology)",
        "mode": "Online CBT",
        "website": "https://www.aiimsexams.ac.in"
      }
    ],
    "examDatesAndCycles": "Application: April–May | AIIMS Exam: June | Maharashtra CAP Counseling: July–August.",
    "portionAndSyllabus": [
      "Clinical Biochemistry: Blood Glucose, Lipid Profiles, Liver & Kidney Function Tests, Electrolytes, Arterial Blood Gases.",
      "Hematology & Immuno-hematology: Complete Blood Count (CBC), Coagulation PT/INR, Blood Grouping & Cross-matching.",
      "Medical Microbiology & Parasitology: Culture Sensitivity, Gram Staining, ELISA Testing, RT-PCR Molecular Diagnostics.",
      "Radiology & Imaging: Radiation Physics, X-ray Radiography, CT Scan Protocols, 3-Tesla MRI Sequences, Ultrasound Doppler, Radiation Safety (AERB Guidelines)."
    ],
    "examPatternSummary": "AIIMS Paramedical: 90 Questions (Physics 30, Chemistry 30, Biology/Maths 30), 90 Minutes (+1, -0.33). State CET: 100 Qs, 100 Marks.",
    "salaryLadder": {
      "entry": "₹3.5 Lakhs – ₹7.5 Lakhs / year (Diagnostic chains: Dr. Lal PathLabs, SRL, Metropolis, Tata Memorial Hospital Mumbai; Gulf entry: ₹14–₹22 LPA)",
      "mid": "₹9 Lakhs – ₹18 Lakhs / year (Senior MRI / Cath Lab Technologist / Diagnostic Lab Supervisor)",
      "senior": "₹20 Lakhs – ₹45 Lakhs+ / year (Laboratory Operations Director / International Hospital Chief Allied Health Officer in Dubai/UK)",
      "highestPaying": "Overseas Healthcare Systems (NHS UK, UAE DHA Dubai, Saudi MOH, Australia Allied Health Council), High-End MRI/Cath Labs in Tier-1 Hospitals"
    },
    "scopeAndFuture": {
      "rating": "4.7/5 (Huge Shortage of Certified Diagnostic Technicians Across India & Middle East)",
      "summary": "Doctors make treatment decisions based on diagnostic lab and imaging reports. With the National Commission for Allied and Healthcare Professions (NCAHP) Act granting recognized professional status, certified technologists enjoy great career stability and international mobility.",
      "aiImpact": "Augmented: AI software highlights suspected fractures and tumor margins on scans, but certified technologists must physically position patients, administer intravenous contrast, and operate high-field MRI machinery.",
      "growthSectors": [
        "3T MRI & Dual-Source Cardiac CT Imaging",
        "Molecular RT-PCR & Liquid Biopsy Cancer Diagnostics",
        "Cardiac Cath Lab Interventional Assistance",
        "Private Diagnostic Chain Franchise Ownership"
      ]
    },
    "techStackAndSkills": [
      "Diagnostic Automation: Roche Cobas, Beckman Coulter, Sysmex Automated Hematology Analyzers, Bio-Rad ELISA Systems",
      "Imaging Modalities: GE Healthcare, Siemens Healthineers, Philips MRI & 128-Slice CT Scanners",
      "Hospital Systems: Picture Archiving and Communication System (PACS), DICOM Imaging Standards, Laboratory Information Systems (LIS)"
    ],
    "stepByStepRoadmap": [
      "Class 12 PCB: Secure minimum 55%+ marks in Physics, Chemistry, and Biology.",
      "Entrance: Apply for Maharashtra State Allied Health CAP or clear AIIMS Paramedical Entrance Exam.",
      "Degree Course: Complete 3 to 4-Year B.Sc in Medical Laboratory Technology (BMLT) OR B.Sc in Medical Imaging Technology (BMIT/Radiology).",
      "Clinical Internship: Mandatory 6-12 months internship in tertiary hospital (KEM Mumbai, Tata Memorial, Sassoon Pune).",
      "Registration: Register with State Allied Healthcare Council under the NCAHP Central Act.",
      "Career / Overseas: Work 2 years in NABH-accredited hospital; clear DHA (Dubai Health Authority) or Prometric exam for tax-free Gulf medical employment!"
    ],
    "topColleges": [
      {
        "name": "Tata Memorial Centre (ACTREC Kharghar Navi Mumbai)",
        "location": "Kharghar, Navi Mumbai",
        "type": "India's Apex Cancer Diagnostic Research Institute"
      },
      {
        "name": "KEM Hospital & Seth GS Medical College",
        "location": "Parel, Mumbai",
        "type": "Premier Municipal Tertiary Medical College"
      },
      {
        "name": "AIIMS Nagpur (All India Institute of Medical Sciences)",
        "location": "MIHAN, Nagpur",
        "type": "National Apex Healthcare Institute"
      },
      {
        "name": "BJ Government Medical College (Sassoon Hospital)",
        "location": "Pune Station, Pune",
        "type": "Top Ranked Maharashtra State Medical College"
      }
    ],
    "externalWebsites": [
      {
        "title": "National Commission for Allied and Healthcare Professions (NCAHP)",
        "url": "https://ncahp.gov.in",
        "note": "Govt statutory body regulating all allied health qualifications"
      },
      {
        "title": "AIIMS Exams Official Portal",
        "url": "https://www.aiimsexams.ac.in",
        "note": "B.Sc Paramedical and Radiography entrance test updates"
      },
      {
        "title": "Maharashtra CET Cell Allied Health",
        "url": "https://cetcell.mahacet.org",
        "note": "Centralized admission to B.Sc paramedical colleges"
      }
    ],
    "govtExamSynergy": {
      "jobs": "AIIMS Junior Radiographer / Medical Lab Technologist, Railway Recruitment Board (RRB) Lab Superintendent & Radiographer, ESIC Hospital Lab Technician, Directorate of Health Services (DHS Maharashtra) Lab Scientific Officer.",
      "examUdaanLink": "/jobs?q=paramedical",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "bsc-data-science-ai",
    "streamId": "science",
    "categoryId": "sci_cs",
    "title": "Data Scientist & AI Quantitative Analyst (B.Sc Data Science & AI)",
    "role": "Data Analyst, Machine Learning Model Evaluator, Business Intelligence Engineer, Predictive Modeler",
    "min12thStream": "12th Science with Mathematics or Computer Science (PCM / PCMB)",
    "keySubjectsToScore": [
      {
        "subject": "Mathematics & Statistics (Probability, Linear Algebra)",
        "minScore": "75%+",
        "reason": "Probability distributions, regression analysis, matrix eigenvalues, and loss optimization."
      },
      {
        "subject": "Computer Science / Information Technology",
        "minScore": "75%+",
        "reason": "Algorithmic thinking, SQL database queries, and Python object-oriented programming."
      }
    ],
    "entranceExams": [
      {
        "name": "CUET UG (Domain Mathematics / Computer Science)",
        "body": "NTA",
        "level": "National (Delhi University, BHU, Central Universities)",
        "mode": "Online CBT",
        "website": "https://cuet.nta.nic.in"
      },
      {
        "name": "IIT Madras BS Data Science Qualifier Exam",
        "body": "IIT Madras",
        "level": "National (Direct Entry to IIT Madras Degree after 12th)",
        "mode": "Online In-Person Exam",
        "website": "https://study.iitm.ac.in/ds/"
      },
      {
        "name": "University Merit Admissions (Mumbai / Pune University)",
        "body": "Autonomous Colleges",
        "level": "State (St. Xavier's, NMIMS, Fergusson)",
        "mode": "Merit based on 12th Marks",
        "website": "https://mu.ac.in"
      }
    ],
    "examDatesAndCycles": "IIT Madras Qualifier: Conducted 3 times a year (Jan, May, Sep) | CUET UG: May | University Applications: June.",
    "portionAndSyllabus": [
      "Foundational Mathematics: Linear Algebra, Single and Multi-variable Calculus, Optimization Techniques.",
      "Applied Statistics & Probability: Descriptive Statistics, Random Variables, Hypothesis Testing (t-test, ANOVA), Bayesian Inference.",
      "Computational Tools: Python for Data Science (NumPy, Pandas, Matplotlib, Seaborn), SQL Databases, Git Version Control.",
      "Machine Learning & Big Data: Supervised & Unsupervised Learning, Decision Trees, Scikit-Learn, Big Data Processing with Spark, Tableau / Power BI Dashboards."
    ],
    "examPatternSummary": "CUET UG: 50 Questions (Attempt 40), 200 Marks, 45 Mins (+5/-1). IIT Madras Qualifier: 4 Foundational Papers (Maths, Stats, English, Computational Thinking).",
    "salaryLadder": {
      "entry": "₹5.5 Lakhs – ₹14 Lakhs / year (Campus placement at analytics consulting: Mu Sigma, Fractal, Tiger Analytics, FinTech startups)",
      "mid": "₹18 Lakhs – ₹36 Lakhs / year (Lead Data Scientist / Machine Learning Engineer)",
      "senior": "₹45 Lakhs – ₹1.1 Crore+ / year (Head of Data Science / Chief Analytics Officer / Hedge Fund Quant)",
      "highestPaying": "Algorithmic Trading Firms (Jane Street, Tower Research, Graviton), Top Tier FinTech (CRED, Razorpay), Global Tech Centers (Google, Microsoft, Amazon India)"
    },
    "scopeAndFuture": {
      "rating": "5/5 (Fastest 3-Year Fast-Track Path into AI & Analytics Without 4-Year Engineering Fees)",
      "summary": "Organizations produce gigabytes of data daily and need analysts who can translate raw metrics into predictive forecasts and business strategy. A 3-year B.Sc in Data Science gets students into the tech job market 1 year earlier than traditional engineering.",
      "aiImpact": "Core Driver: You are the professional training, fine-tuning, and evaluating AI models. As AI expands, demand for data clean-up, feature engineering, and bias mitigation increases exponentially.",
      "growthSectors": [
        "Generative AI Fine-Tuning & Prompt Analytics",
        "FinTech Credit Risk & Fraud Detection Modeling",
        "E-Commerce Recommendation Algorithms",
        "Healthcare Predictive Diagnostics & Biomarker Modeling"
      ]
    },
    "techStackAndSkills": [
      "Languages: Python, R, SQL, Bash Scripting",
      "ML Libraries: Pandas, Scikit-Learn, PyTorch, TensorFlow, XGBoost, Hugging Face",
      "BI & Big Data: Power BI, Tableau, Snowflake, Apache Spark, PostgreSQL, Docker"
    ],
    "stepByStepRoadmap": [
      "Class 12: High score in Mathematics (75%+ target).",
      "Program Selection: Enroll in IIT Madras BS Data Science (revolutionary degree directly from IIT Madras) OR 3-Year B.Sc Data Science at top autonomous college.",
      "Portfolio Building: Solve Kaggle competitions, build end-to-end data analysis projects on GitHub.",
      "Internships: Complete 2 data analyst internships during 2nd and 3rd year.",
      "Placement: Land high-paying analyst role in investment banking, consulting, or tech startups."
    ],
    "topColleges": [
      {
        "name": "IIT Madras (BS in Data Science and Applications)",
        "location": "Chennai (Online Hybrid with IIT Campus Access)",
        "type": "Direct Degree from India's #1 NIRF Institute"
      },
      {
        "name": "St. Xavier's College (Autonomous)",
        "location": "Fort, Mumbai",
        "type": "Premier Autonomous College for Statistics & Data Science"
      },
      {
        "name": "Fergusson College (Department of Computer Science & Statistics)",
        "location": "FC Road, Pune",
        "type": "Top Ranked Maharashtra Science College"
      },
      {
        "name": "NMIMS School of Mathematical Sciences",
        "location": "Vile Parle, Mumbai",
        "type": "Leading Private Applied Data Science Institute"
      }
    ],
    "externalWebsites": [
      {
        "title": "IIT Madras BS Degree Portal",
        "url": "https://study.iitm.ac.in/ds/",
        "note": "Direct admission after 12th without JEE Advanced for all streams with 10th maths"
      },
      {
        "title": "NTA CUET Official Portal",
        "url": "https://cuet.nta.nic.in",
        "note": "Central university undergraduate admissions"
      },
      {
        "title": "Kaggle Data Science Platform",
        "url": "https://www.kaggle.com",
        "note": "World's largest data science competition and project platform"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Ministry of Statistics & Programme Implementation (MoSPI) Junior Statistical Officer (JSO via SSC CGL), Reserve Bank of India (RBI) Data Analyst Grade B, National Informatics Centre (NIC) Scientific Officer.",
      "examUdaanLink": "/jobs?q=data+analyst",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "iti-diploma-degree-lateral-pathway",
    "streamId": "vocational",
    "categoryId": "voc_diploma",
    "title": "10th → ITI → Polytechnic Diploma → B.Tech Degree (Complete Lateral Ladder)",
    "role": "Senior Plant Engineer, PWD Junior / Executive Engineer, Technical Director, Indian Railways Section Engineer (SSE)",
    "min12thStream": "Class 10th Board Pass (with Science & Mathematics minimum 35%)",
    "keySubjectsToScore": [
      {
        "subject": "Class 10 Science & Mathematics",
        "minScore": "60%+",
        "reason": "Determines first round seat allotment in top Government ITIs (Aundh Pune, Agripada Mumbai) and Polytechnic Diplomas."
      },
      {
        "subject": "Final Year ITI / Diploma Percentage",
        "minScore": "80%+",
        "reason": "Direct 2nd Year Lateral Entry (DSE) into B.Tech Engineering at COEP/VJTI is based strictly on diploma final semester marks!"
      }
    ],
    "entranceExams": [
      {
        "name": "DVET Maharashtra ITI Centralized CAP",
        "body": "Directorate of Vocational Education & Training",
        "level": "State (For Government ITIs across Maharashtra)",
        "mode": "Merit Based on 10th Marks (Zero Exam)",
        "website": "https://admission.dvet.gov.in"
      },
      {
        "name": "DTE Maharashtra Post-ITI Lateral Diploma CAP",
        "body": "Directorate of Technical Education",
        "level": "State (Direct 2nd Year of 3-Year Diploma — Saves 1 Year!)",
        "mode": "Merit Based on ITI Percentage",
        "website": "https://postiti2026.dtemaharashtra.gov.in"
      },
      {
        "name": "DTE Maharashtra Direct Second Year B.Tech (DSE CAP)",
        "body": "State CET Cell Maharashtra",
        "level": "State (Direct 2nd Year B.Tech without JEE/CET)",
        "mode": "Merit Based on Diploma Final Year Marks",
        "website": "https://dse2026.mahacet.org"
      }
    ],
    "examDatesAndCycles": "Class 10 Results: June | DVET ITI Admission: June–July | Lateral Entry Diploma: July | Direct 2nd Year B.Tech (DSE): July–August.",
    "portionAndSyllabus": [
      "Stage 1 (ITI Trade 2 Years): Workshop Practice, Trade Theory, Lathe/Milling Machining, Wiring, Blueprint Reading, Employability Skills.",
      "Stage 2 (Polytechnic Diploma Lateral Entry): Direct entry into 2nd Year of Diploma (Sem 3 & 4) — Applied Mechanics, Strength of Materials, Thermal Engineering, Fluid Power, Electrical Machines, CAD Drafting.",
      "Stage 3 (B.Tech Degree Direct Second Year - DSE): Direct entry into 2nd Year of Engineering (Sem 3 to 8) — Advanced Engineering Mathematics, Machine Design, Heat Transfer, Microcontrollers, Industrial Management."
    ],
    "examPatternSummary": "100% EXAM-FREE ADMISSION PATHWAY! Zero pressure of JEE Main or MHT-CET. Progression is based purely on continuous academic performance and hands-on semester marks!",
    "salaryLadder": {
      "entry": "₹3.5 Lakhs – ₹8.5 Lakhs / year (Exit after ITI: Railway ALP ₹4.5L; Exit after Diploma: Junior Engineer ₹6L; Exit after B.Tech: Core Engineer ₹8.5L)",
      "mid": "₹14 Lakhs – ₹28 Lakhs / year (Assistant Executive Engineer / Plant Maintenance Manager)",
      "senior": "₹35 Lakhs – ₹80 Lakhs+ / year (Chief General Manager, Factory Operations Director, PWD Chief Engineer)",
      "highestPaying": "Indian Railways (Mail/Express Superfast Loco Pilots), PSU Maharatnas (BHEL, NTPC, ONGC), Automotive Leaders (Tata Motors, Mahindra, Bajaj Auto), Global EPC Contractors"
    },
    "scopeAndFuture": {
      "rating": "5/5 (The Most Skilled, High-ROI, Zero-Debt Technical Pathway in India)",
      "summary": "This famous progressive ladder allows an economically constrained student to start earning early while progressively upgrading credentials from ITI Technician → Polytechnic Diploma Junior Engineer → Full B.Tech / B.E. Graduate Engineer. Employers highly prize these candidates because they understand actual shop-floor machinery far better than pure theoretical engineers.",
      "aiImpact": "100% Bulletproof: Physical machine commissioning, high-voltage transformer substations, precision CNC tooling, and civil building erection cannot be automated by artificial intelligence.",
      "growthSectors": [
        "High-Speed Bullet Train & Metro Rail Infrastructure",
        "MSEDCL Smart Power Grid Automation",
        "Electric Vehicle (EV) Powertrain Manufacturing",
        "Defense Naval Shipbuilding & Aerospace Machining"
      ]
    },
    "techStackAndSkills": [
      "Shopfloor Mastery: CNC Programming (G-Codes/M-Codes), TIG/MIG Welding, Precision Micrometers, 3-Phase Wiring, Armature Winding",
      "Design & Engineering: AutoCAD 2D/3D, SolidWorks, CATIA, PLC Ladder Logic, MATLAB",
      "Executive Project Delivery: Industrial Safety Standards (OSHA), Preventive Maintenance, Six Sigma Kaizen"
    ],
    "stepByStepRoadmap": [
      "Class 10 Pass: Apply on DVET Maharashtra portal immediately after Class 10 results; choose 2-Year ITI Electrician, Fitter, or Machinist.",
      "Complete ITI: Score 80%+ in All-India Trade Test (AITT) to earn NCVT National Trade Certificate.",
      "Lateral Entry into Diploma: Apply through DTE Maharashtra for Direct 2nd Year Admission to 3-Year Polytechnic Diploma (complete in just 2 years!).",
      "Excel in Polytechnic: Achieve 85%+ in final semester MSBTE diploma examinations.",
      "Direct 2nd Year B.Tech (DSE): Apply on State CET Cell DSE CAP portal; secure admission directly into 2nd year B.Tech at premier engineering colleges (COEP, VJTI, SPCE, GCOE Aurangabad) without giving JEE or CET!",
      "Graduate as B.Tech Engineer: Complete 3 years of engineering to graduate as a prestigious B.Tech / B.E. Engineer holding three prestigious credentials: ITI + Diploma + Degree!"
    ],
    "topColleges": [
      {
        "name": "Government ITI Mumbai & Government ITI Pune (Aundh)",
        "location": "Mumbai / Pune",
        "type": "Model Industrial Training Institutes"
      },
      {
        "name": "Government Polytechnic Pune / GP Mumbai",
        "location": "Shivajinagar, Pune / Bandra, Mumbai",
        "type": "Autonomous Premier Polytechnic Institutions"
      },
      {
        "name": "COEP Technological University & VJTI Mumbai",
        "location": "Pune & Mumbai",
        "type": "Apex Engineering Colleges offering 10% DSE Supernumerary Quota"
      },
      {
        "name": "Government College of Engineering (Karad / Amravati / Aurangabad)",
        "location": "Maharashtra",
        "type": "Top ROI Autonomous Govt Engineering Colleges"
      }
    ],
    "externalWebsites": [
      {
        "title": "DVET Maharashtra ITI Admission Portal",
        "url": "https://admission.dvet.gov.in",
        "note": "Centralized admission to all Government and Private ITIs"
      },
      {
        "title": "DTE Maharashtra Post-ITI / Post-SSC Diploma",
        "url": "https://www.dtemaharashtra.gov.in",
        "note": "Directorate of Technical Education diploma admission portals"
      },
      {
        "title": "State CET Cell DSE B.Tech Engineering Portal",
        "url": "https://cetcell.mahacet.org",
        "note": "Centralized CAP rounds for Direct Second Year B.Tech admissions"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Stage 1: Railway ALP & Technician Grade 3 | Stage 2: SSC JE, RRB JE, PWD Junior Engineer, MSEDCL Junior Engineer | Stage 3: MPSC Maharashtra Engineering Services (Class-1 Executive Engineer), UPSC Indian Engineering Services (IES), PSU GATE.",
      "examUdaanLink": "/jobs?q=junior+engineer",
      "mockTestLink": "/mock-tests"
    }
  },
  {
    "id": "paramedical-diplomas-10th-12th",
    "streamId": "vocational",
    "categoryId": "voc_diploma",
    "title": "Paramedical & Hospital Diagnostic Specialist (DMLT / DROT / Emergency Medical Care)",
    "role": "Emergency Medical Technician (108 Ambulance), Dialysis Unit Operator, Operation Theatre Technician, ICU Support Specialist",
    "min12thStream": "Class 10th Pass (for basic certificates) or 12th Science with PCB/PCM (for 2-Year State Paramedical Diplomas)",
    "keySubjectsToScore": [
      {
        "subject": "Class 10 or 12 Biology / Science",
        "minScore": "55%+",
        "reason": "Human anatomy, infection control, bodily fluids handling, and sterilization fundamentals."
      }
    ],
    "entranceExams": [
      {
        "name": "MSBTE Paramedical Diploma Admission",
        "body": "Maharashtra State Board of Technical Education",
        "level": "State (DMLT, X-Ray, Dialysis, OT Technician)",
        "mode": "Merit based on 10th / 12th marks",
        "website": "https://msbte.org.in"
      },
      {
        "name": "DMER Maharashtra Paramedical Merit List",
        "body": "Directorate of Medical Education and Research",
        "level": "State (Govt Medical College Hospital Units)",
        "mode": "Merit List",
        "website": "https://www.med-edu.in"
      }
    ],
    "examDatesAndCycles": "Admission Notification: June (post 10th/12th results) | CAP Form Filling: July | College Allotment: August.",
    "portionAndSyllabus": [
      "Medical Terminology & Anatomy: Skeletal, Circulatory, Respiratory, and Renal Systems.",
      "Diagnostic Procedures: Blood Collection (Phlebotomy), Routine Urine & Stool Analysis, ECG Recording, Sputum Smear Examination.",
      "Emergency & OT Procedures: Sterilization Autoclaves, Anesthesia Trolley Preparation, Surgical Instrument Care, Oxygen Delivery, CPR.",
      "Dialysis Operations: Dialyzer Priming, Vascular Access Monitoring, Heparin Administration, Waste Fluid Disposal."
    ],
    "examPatternSummary": "Direct merit-based admission based on Class 10th or 12th Science marks. No competitive entrance exam required!",
    "salaryLadder": {
      "entry": "₹2.8 Lakhs – ₹5.5 Lakhs / year (Civil hospital contract / Private nursing homes / 108 Emergency Ambulance EMT)",
      "mid": "₹6.5 Lakhs – ₹12 Lakhs / year (Senior Dialysis Technician / ICU In-charge in Corporate Hospitals: Fortis, Hinduja, Ruby Hall)",
      "senior": "₹14 Lakhs – ₹28 Lakhs+ / year (Overseas Gulf hospital technician in UAE, Qatar, Oman, Saudi Arabia)",
      "highestPaying": "Middle East Healthcare Networks (DHA Dubai, SEHA Abu Dhabi), High-Volume Private Hemodialysis Chains (NephroPlus), Specialized Cardiac ICU Units"
    },
    "scopeAndFuture": {
      "rating": "4.6/5 (Rapid 2-Year Entry into Critical Healthcare with Immediate Job Security)",
      "summary": "For students who cannot afford long 5-year MBBS or BDS courses, 2-year paramedical diplomas (DMLT, DROT, Dialysis Technology) provide the fastest route to dignified, recession-proof hospital employment right after 10th or 12th.",
      "aiImpact": "100% Safe: Physically drawing blood samples from pediatric patients, administering emergency CPR in a moving ambulance, and setting up hemodialysis catheters require tactile human care.",
      "growthSectors": [
        "Emergency Medical Services (108/102 Ambulance Fleets)",
        "Standalone Hemodialysis Centers for Kidney Patients",
        "Home Healthcare & Elderly Geriatric Support",
        "Private Diagnostic Lab Franchises in Tier 2/3 Cities"
      ]
    },
    "techStackAndSkills": [
      "Clinical Equipment: Hemodialysis Machines (Fresenius/Nipro), ECG 12-Lead Machines, Defibrillators, Autoclave Sterilizers",
      "Laboratory Skills: Venipuncture, Centrifugation, Blood Smear Staining, Microscope Handling, Rapid Antigen Test Kits",
      "Emergency Care: Basic Life Support (BLS), Cardiopulmonary Resuscitation (CPR), Patient Vital Signs Monitoring"
    ],
    "stepByStepRoadmap": [
      "Eligibility: Pass Class 10th (for certificate trades) or Class 12th Science with PCB (for 2-Year DMLT / Paramedical Diplomas).",
      "Apply: Submit online CAP application on MSBTE or DMER portal in June.",
      "Course Work: Complete 2-Year intensive diploma covering theory and hospital practical rotations.",
      "Hospital Training: Complete 6-month hands-on clinical internship in a civil or government medical college hospital.",
      "Immediate Employment: Join government health services (NHM / DHS contract) or private hospital network as certified technician.",
      "Optional Career Upgrade: Pursue B.Sc in Medical Lab Technology (BMLT) laterally while working to climb the hospital supervisory ladder!"
    ],
    "topColleges": [
      {
        "name": "Grant Government Medical College & Sir J.J. Group of Hospitals",
        "location": "Byculla, Mumbai",
        "type": "Historic Apex State Medical College"
      },
      {
        "name": "B.J. Government Medical College & Sassoon General Hospital",
        "location": "Pune Station, Pune",
        "type": "Premier Medical Training Hospital"
      },
      {
        "name": "Government Medical College (GMC Nagpur & GMC Aurangabad)",
        "location": "Vidarbha / Marathwada",
        "type": "High-Volume Regional Medical Training Hubs"
      },
      {
        "name": "MSBTE Affiliated Poly-Paramedical Institutes",
        "location": "Across Maharashtra Districts",
        "type": "Approved State Board Technical Centers"
      }
    ],
    "externalWebsites": [
      {
        "title": "Maharashtra State Board of Technical Education (MSBTE)",
        "url": "https://msbte.org.in",
        "note": "Curriculum and examination board for paramedical diplomas"
      },
      {
        "title": "Directorate of Medical Education and Research (DMER)",
        "url": "https://www.med-edu.in",
        "note": "Govt medical college paramedical admissions and notices"
      },
      {
        "title": "National Health Mission Maharashtra (NHM)",
        "url": "https://arogya.maharashtra.gov.in",
        "note": "Recruitment notices for hospital technicians and emergency staff"
      }
    ],
    "govtExamSynergy": {
      "jobs": "Directorate of Health Services (DHS Maharashtra) Laboratory Technician, National Health Mission (NHM) Dialysis Technician, Zilla Parishad Health Worker, Municipal Corporation (BMC/PMC) Hospital Technician.",
      "examUdaanLink": "/jobs?q=lab+technician",
      "mockTestLink": "/mock-tests"
    }
  }
];

export function getCareerBySlug(slug) {
  if (!slug) return null;
  return CAREER_PATHS.find(c => c.id === slug || c.id.toLowerCase() === slug.toLowerCase()) || null;
}

export function getAllCareerSlugs() {
  return CAREER_PATHS.map(c => c.id);
}
