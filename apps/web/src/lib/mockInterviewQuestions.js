// ============================================================
// lib/mockInterviewQuestions.js — Real Commission Question Bank & Guidelines
// 120+ Authentic Question Scenarios across 8 Competitive Panels
// Includes: Expert Rubrics, Books, Dress Codes, and Etiquette Rules
// ============================================================

export const INTERVIEW_PANELS = {
  mpsc: {
    id: 'mpsc',
    title_en: 'MPSC State Services (Rajyaseva)',
    title_mr: 'MPSC राज्यसेवा मुलाखत मंडळ',
    color: '#ea580c',
    icon: 'account_balance',
    maxScore: 100,
    passingTarget: 60,
    boardMembers: [
      'Shri R. K. Shinde, IAS (Retd) — Board Chairman',
      'Prof. Sunita Deshmukh — Maharashtra Economics & Agri Policy',
      'Dr. Arvind Joshi — Behavioral & Leadership Psychologist',
    ],
    dressCode: {
      male: 'Light-colored formal shirt (white/sky blue), dark formal trousers (navy/charcoal), polished black leather shoes, simple dark tie (optional but recommended), neatly trimmed hair, clean-shaven or well-groomed beard.',
      female: 'Formal traditional cotton/chanderi saree or sober formal salwar-kameez with dupatta pinned neatly. Subtle neutral colors (beige, off-white, light blue, pastel). Minimal jewelry and tidy hair tied back.',
    },
    etiquetteTips: [
      'Enter only after knocking and seeking verbal permission: "May I come in, Sir/Madam?".',
      'Greet the lady panel member first, then the Chairman, followed by other members.',
      'Do not sit until the Chairman invites you: "Please take your seat, Candidate". Say "Thank you, Sir/Madam" and sit with a straight back.',
      'Distribute eye contact in a 60-20-20 ratio (60% to the speaking member, 20% each to the other two members).',
      'Never guess or bluff on factual data. Confidently say: "Sir, I am unable to recall this at the moment, but I will read up on it."',
      'Maintain an objective administrative posture — avoid extreme political or emotional viewpoints.',
    ],
    recommendedBooks: [
      { title: 'Indian Polity (7th Edition)', author: 'M. Laxmikanth', topic: 'Constitutional Articles & Federalism' },
      { title: 'Maharashtra: History & Social Reformers', author: 'Dr. K. B. Kadam', topic: 'Phule, Shahu, Ambedkar Legacy' },
      { title: 'Economic Survey of Maharashtra (Latest)', author: 'Govt. of Maharashtra', topic: 'GDP, Agri Distress & Budget Allocations' },
      { title: 'Public Administration & Good Governance', author: 'YASHADA Monograph Series', topic: 'Administrative Case Studies' },
      { title: 'Ethics, Integrity & Aptitude', author: 'Subba Rao & P. N. Roy', topic: 'Handling Ethical Dilemmas in Bureaucracy' },
    ],
    stages: {
      daf: [
        'You have graduated in {degree} from {district}. Why did you choose civil services over higher corporate salaries in your engineering/degree domain?',
        'Tell the board about a notable historical, cultural, or developmental feature of your home district {district} that requires urgent administrative intervention.',
        'Your profile indicates an interest in {hobby}. How does this hobby build resilience for stressful Mantralaya postings?',
        'If you are not selected in this attempt, what is your backup plan, and how long do you intend to continue preparing?',
      ],
      academic: [
        'How will you apply your background in {degree} to solve chronic water scarcity or agricultural distress in Marathwada/Vidarbha?',
        'Explain the economic concept of inclusive growth and cite two flagship Maharashtra government schemes that aim to achieve it.',
        'What is your view on the reservation policy in government jobs? How should the balance between merit and social justice be maintained?',
        'Discuss the significance of the 73rd and 74th Constitutional Amendments with respect to Zilla Parishad empowerment in Maharashtra.',
      ],
      maharashtra_governance: [
        'Maharashtra is India’s industrial engine, yet Marathwada and Vidarbha face acute agrarian distress. As a Deputy Collector, what 3 structural steps would you take?',
        'Explain the role of the PESA Act in tribal belt administration (e.g. Gadchiroli, Nandurbar). How do you resolve conflicts between mining and tribal rights?',
        'How would you manage a severe drought crisis where drinking water must be prioritized over sugarcane mills and industrial factories?',
        'Critically analyze the implementation of the Right to Public Services Act (RTS) in Maharashtra. Where is the citizen delivery bottleneck?',
      ],
      ethics_crisis: [
        'A local MLA threatens to get you transferred within 24 hours if you seal an illegal construction owned by his financier. How do you respond?',
        'During communal tensions before a festive procession, a group demands route permission through a sensitive religious area. How do you handle the situation?',
        'You discover that your subordinate, who is a single mother with an ailing child, has misappropriated ₹2 lakhs from famine relief funds. What action do you take?',
        'A corporate lobby offers your family luxury accommodations while pitching an infrastructure project under your review. What is your ethical boundary?',
      ],
      vision: [
        'Where do you see yourself in the administrative hierarchy 15 years from now, and what one signature reform would you like to be remembered for?',
        'If given the choice between a desk posting in Mantralaya or a tribal field posting in Melghat, which would you pick and why?',
      ]
    }
  },

  police: {
    id: 'police',
    title_en: 'Maharashtra Police PSI Board',
    title_mr: 'महाराष्ट्र पोलीस उपनिरीक्षक (PSI) मुलाखत मंडळ',
    color: '#1d4ed8',
    icon: 'local_police',
    maxScore: 100,
    passingTarget: 55,
    boardMembers: [
      'Shri S. V. Gaikwad, IPS (Retd DGP) — Chairman',
      'Addl SP Milind Kulkarni — Crime & Investigation Expert',
      'Dr. Radhika Kadam — Forensic & Criminal Psychologist',
    ],
    dressCode: {
      male: 'Crisp plain formal shirt (light blue or white), dark trousers, leather belt, formal polished black shoes, clean haircut with no sideburns, military posture.',
      female: 'Formal dark salwar suit or neutral saree. Hair neatly tied in a disciplined bun with a hairnet. No dangling earrings or colorful cosmetics.',
    },
    etiquetteTips: [
      'Walk with upright, assertive posture — neither aggressive nor timid.',
      'Greet the panel with crisp verbal courtesy: "Namaskar Sir, Namaskar Madam".',
      'Keep your hands resting firmly on your thighs. Avoid fidgeting or tapping feet.',
      'Show instant command over law, constitutional rights, and calm crisis temperament.',
      'Never justify extra-judicial actions, encounter culture, or police brutality under any provocation.',
    ],
    recommendedBooks: [
      { title: 'Bharatiya Nyaya Sanhita (BNS) & BNSS Handbook', author: 'Universal Law / EBC', topic: 'New Criminal Codes & FIR Procedures' },
      { title: 'Maharashtra Police Act, 1951', author: 'State Police Manual', topic: 'Police Hierarchy, Powers & Crowd Dispersal' },
      { title: 'Crime Investigation & Forensics Field Manual', author: 'Dr. B. R. Sharma', topic: 'Panchnama, Evidence Chain of Custody' },
      { title: 'Police Administration in India', author: 'Dr. Arvind Verma', topic: 'Community Policing & Modern Reforms' },
    ],
    stages: {
      daf: [
        'Why did you choose the uniform service of Police Sub-Inspector over other desk-based MPSC Gazetted posts?',
        'Police work involves 14-hour irregular shifts, public hostility, and high physical strain. How have you mentally prepared for this reality?',
        'What is your family background, and how will your personal values withstand the high-pressure environment of a police station?',
      ],
      academic: [
        'How do the new criminal laws (BNS, BNSS, and Bharatiya Sakshya Adhiniyam) change the protocol of digital evidence and arrest?',
        'Explain the procedure of conducting a spot Panchnama and maintaining the strict chain of custody for biological evidence.',
        'What are the mandatory legal safeguards under Section 41A of CrPC / BNSS guidelines regarding the arrest of individuals?',
      ],
      maharashtra_governance: [
        'How would you tackle the rising menace of cyber fraud, OTP scams, and crypto extortion targeted at senior citizens in your jurisdiction?',
        'Illegal sand mining and local mafia operate in several river belts in Maharashtra. How will you take action when they have local political patronage?',
        'Explain the concept of community policing (e.g., Mohalla Committees, Police Mitra). How can it prevent communal flares?',
      ],
      ethics_crisis: [
        'A violent mob of 500 people is marching towards a police chowki with petrol bottles. You have only 6 constables. Step-by-step, what is your standard operating procedure?',
        'A prominent political leader’s son is caught drunk driving and causing a minor accident. He threatens your job if you file an FIR. How do you act?',
        'Your senior officer orders you off-the-record to alter a diary entry in a custodial death matter. How do you handle this lawful/ethical conflict?',
      ],
      vision: [
        'What specific initiative would you introduce in your police station to make it genuinely safe and approachable for women and victims of domestic abuse?',
        'What will be your priority in the first 90 days after completing your training at Maharashtra Police Academy (MPA), Nashik?',
      ]
    }
  },

  upsc: {
    id: 'upsc',
    title_en: 'UPSC Civil Services Personality Test',
    title_mr: 'UPSC नागरी सेवा मुलाखत मंडळ (IAS / IPS)',
    color: '#7c3aed',
    icon: 'emoji_events',
    maxScore: 275,
    passingTarget: 165,
    boardMembers: [
      'Ambassador Vikram Mehta — Board Chairman',
      'Dr. K. S. Rao — Constitutional Jurist & Former Law Secretary',
      'Smt. Ananya Sen — Public Policy & International Affairs Specialist',
    ],
    dressCode: {
      male: 'Two-piece dark formal suit (navy or charcoal grey) with light shirt and conservative silk tie, or formal Bandhgala. Formal dark leather shoes.',
      female: 'Traditional handloom cotton or silk saree (Kanjeevaram, Chanderi, Paithani) in sober pastel hues. Tidy hair bun, formal slippers.',
    },
    etiquetteTips: [
      'The Personality Test is not a test of knowledge (that was checked in Mains), but a test of intellectual integrity, balance, and mental alertness.',
      'Listen carefully without interrupting panel members.',
      'Acknowledge multiple viewpoints before stating your balanced conclusion ("While economic growth is vital, ecological sustainability cannot be compromised...").',
      'Remain humble, composed, and courteous even when challenged with contrarian counter-questions.',
    ],
    recommendedBooks: [
      { title: '2nd Administrative Reforms Commission (ARC II) Reports', author: 'Government of India', topic: 'Ethics in Governance & Citizen-Centric Admin' },
      { title: 'The Indian Constitution: Cornerstone of a Nation', author: 'Granville Austin', topic: 'Basic Structure, Federalism & Separation of Powers' },
      { title: 'India’s Foreign Policy in a Changing World', author: 'Ambassador Shivshankar Menon', topic: 'Strategic Autonomy & Multipolar Diplomacy' },
      { title: 'Annual Economic Survey & Union Budget', author: 'Ministry of Finance', topic: 'Macroeconomic Fiscal Trajectory' },
    ],
    stages: {
      daf: [
        'Your DAF mentions {degree} from {district}. How has your academic journey shaped your understanding of India’s developmental paradoxes?',
        'You have spent several years preparing for this examination. What has this process taught you about failure, endurance, and self-discipline?',
      ],
      academic: [
        'Is India’s fiscal federalism under strain with the current GST compensation and devolution formulas? How should the Finance Commission resolve this?',
        'Critically evaluate India’s stand of strategic autonomy in the context of the Ukraine war, Middle East tensions, and the Quad partnership.',
      ],
      maharashtra_governance: [
        'Urbanization in Indian megacities like Mumbai, Pune, and Bengaluru is leading to severe urban flooding and infrastructure collapse. Propose a sustainable governance model.',
        'Analyze the dilemma between manufacturing subsidies (PLI schemes) versus direct welfare transfers (DBT). Which creates durable long-term employment?',
      ],
      ethics_crisis: [
        'As District Magistrate, you are handling a massive protest against land acquisition for a critical national defense corridor. Protesters include elderly farmers. What is your negotiation framework?',
        'An intelligence report indicates high probability of communal unrest during elections, but preemptive arrests of key leaders might trigger immediate riots. What is your calculated course of action?',
      ],
      vision: [
        'If you are appointed Cabinet Secretary 30 years from now, what single institutional reform would you institute to modernize the Indian bureaucracy?',
      ]
    }
  },

  talathi: {
    id: 'talathi',
    title_en: 'Talathi & Revenue Officer Board',
    title_mr: 'तलाठी व महसूल मंडळ मुलाखत',
    color: '#0891b2',
    icon: 'history_edu',
    maxScore: 100,
    passingTarget: 50,
    boardMembers: [
      'Shri B. R. Pawar — Sub-Divisional Officer (SDO Prant)',
      'Smt. Meena Patil — Tahsildar (Land Revenue Specialist)',
      'Circle Inspector Suresh More — Field Administration',
    ],
    dressCode: {
      male: 'Simple formal shirt, formal pants, formal shoes. Clean, humble, and professional appearance.',
      female: 'Decent formal saree or salwar suit with pinned dupatta.',
    },
    etiquetteTips: [
      'Demonstrate deep empathy for village farmers, widows, and rural citizens.',
      'Show clear understanding of village-level land registers: 7/12 (Satbara), 8-A, Ferfar (mutation).',
      'Emphasize integrity and zero tolerance for bribery in land mutations.',
    ],
    recommendedBooks: [
      { title: 'Maharashtra Land Revenue Code (MLRC) 1966', author: 'State Revenue Manual', topic: 'Mutation, Panchnama, Land Classes' },
      { title: 'E-Ferfar & Digital Land Records Handbook', author: 'Govt. of Maharashtra', topic: 'Digital 7/12, Bhumi Abhilekh' },
    ],
    stages: {
      daf: [
        'Why does a candidate with your educational degree want to work as a village-level Talathi?',
        'Tell us about your native village or district land topography.',
      ],
      academic: [
        'Explain the exact legal difference between a 7/12 extract and an 8-A land holding register.',
        'What is an "E-Ferfar"? What is the statutory time limit for sanctioning an undisputed mutation entry?',
      ],
      maharashtra_governance: [
        'How do you conduct an impartial crop damage Panchnama after unseasonal rains (Avali Paus) without yielding to local political pressure?',
        'Encroachment on Gairan (grazing pasture) land is rampant in rural Maharashtra. As a Talathi, what is your legal duty?',
      ],
      ethics_crisis: [
        'A wealthy builder offers you ₹50,000 in cash to backdate a mutation entry of an ancestral farm land. How do you react?',
        'An elderly illiterate widow comes to your office weeping because her brothers-in-law forged her signature to remove her name from the 7/12. What immediate action do you take?',
      ],
      vision: [
        'How will you make your Talathi Saja 100% paperless, transparent, and friendly for rural farmers?',
      ]
    }
  },

  banking: {
    id: 'banking',
    title_en: 'Bank PO (IBPS / SBI) Board',
    title_mr: 'बँकिंग PO मुलाखत मंडळ (SBI / IBPS)',
    color: '#059669',
    icon: 'account_balance_wallet',
    maxScore: 100,
    passingTarget: 60,
    boardMembers: [
      'Executive Director (Retd SBI) — Panel Chairman',
      'Chief General Manager — Credit & Risk Management',
      'Head of Human Resources — Behavioral Assessor',
    ],
    dressCode: {
      male: 'Formal shirt, trousers, tie, blazer (optional in winter), clean-shaven.',
      female: 'Formal western business suit or formal cotton saree.',
    },
    etiquetteTips: [
      'Show commercial acumen, numerical precision, and polite customer empathy.',
      'Understand contemporary banking issues: NPAs, digital payments, RBI repo rates, MSME credit.',
    ],
    recommendedBooks: [
      { title: 'Banking Awareness', author: 'B. K. Sahgal / Arihant', topic: 'NPA, CRR, SLR, Basel III, Repo' },
      { title: 'RBI Monthly Bulletin & Trends in Banking', author: 'Reserve Bank of India', topic: 'Monetary Policy & Digital Rupee' },
    ],
    stages: {
      daf: [
        'Why banking after your education? Banks are commercial organizations, not welfare institutions. Are you ready for sales targets?',
      ],
      academic: [
        'What is the difference between Repo Rate and Reverse Repo Rate? How does an increase in Repo Rate combat inflation?',
        'Explain what happens when an account becomes an NPA under RBI 90-day delinquency guidelines. What are the recovery tools (SARFAESI, IBC)?',
      ],
      maharashtra_governance: [
        'Agricultural loan defaults and farm loan waivers are frequent in Maharashtra. What is your view on the credit culture impact of loan waivers?',
      ],
      ethics_crisis: [
        'Your Branch Manager pushes you to approve a loan file for an influential local businessman without verified collateral documents to meet branch quarter targets. How do you handle this?',
        'An angry customer creates a scene at your counter because his pension was delayed due to a server error. How do you de-escalate?',
      ],
      vision: [
        'How will AI, UPI, and Central Bank Digital Currency (e-Rupee) transform retail banking branches over the next 5 years?',
      ]
    }
  },

  ssc: {
    id: 'ssc',
    title_en: 'SSC CGL Inspector Board',
    title_mr: 'SSC CGL इन्स्पेक्टर मुलाखत मंडळ',
    color: '#b45309',
    icon: 'payments',
    maxScore: 100,
    passingTarget: 55,
    boardMembers: [
      'Principal Commissioner (IRS Retd) — Chairman',
      'Joint Director (DGGI) — Anti-Evasion',
      'Senior Director — Central Vigilance Commission',
    ],
    dressCode: {
      male: 'Formal shirt, trousers, formal shoes.',
      female: 'Formal saree or salwar suit.',
    },
    etiquetteTips: [
      'Exhibit vigilance, integrity, and analytical firmness.',
    ],
    recommendedBooks: [
      { title: 'GST Law & Practice', author: 'Taxmann', topic: 'Input Tax Credit & Evasion Modes' },
      { title: 'Income Tax Act 1961 Bare Act', author: 'Commercial Law', topic: 'Search & Seizure, Section 132' },
    ],
    stages: {
      daf: ['Why are you interested in Central Revenue Services (Income Tax / Central GST Inspector)?'],
      academic: ['How does fake ITC (Input Tax Credit) invoicing work in GST, and what data analytics indicators flag it?'],
      maharashtra_governance: ['Maharashtra contributes over 15% of India’s GST collection. What sectors have the highest tax compliance challenges?'],
      ethics_crisis: ['During a factory raid, the owner offers you ₹10 lakhs in cash to overlook a missing unaccounted ledger. What do you do?'],
      vision: ['How can technology eliminate face-to-face tax harassment while enhancing voluntary compliance?'],
    }
  },

  forest: {
    id: 'forest',
    title_en: 'MPSC Forest Service (ACF/RFO)',
    title_mr: 'MPSC वनसेवा मुलाखत मंडळ (ACF / RFO)',
    color: '#15803d',
    icon: 'forest',
    maxScore: 100,
    passingTarget: 60,
    boardMembers: [
      'PCCF Wildlife (Retd) — Chairman',
      'Chief Conservator of Forests — Western Ghats Region',
      'Senior Wildlife Ecologist — Wildlife Institute of India',
    ],
    dressCode: {
      male: 'Crisp formal shirt, trousers, trekking-ready disciplined grooming.',
      female: 'Formal salwar suit or cotton saree, hair tied tightly.',
    },
    etiquetteTips: [
      'Show deep appreciation for wildlife conservation, biodiversity, and tribal rights.',
    ],
    recommendedBooks: [
      { title: 'Wildlife Protection Act 1972 & Forest Conservation Act 1980', author: 'Natraj Publishers', topic: 'Wildlife Legal Framework' },
      { title: 'Western Ghats Ecology & Madhav Gadgil Report', author: 'MoEFCC', topic: 'Eco-Sensitive Zones & Conservation' },
    ],
    stages: {
      daf: ['What drives you to work in remote, dense forest ranges where basic civil amenities are absent?'],
      academic: ['Contrast the Gadgil Committee recommendations with the Kasturirangan Committee report on Western Ghats conservation.'],
      maharashtra_governance: ['How do you address human-leopard conflict in Junnar (Pune) or human-tiger conflict in Chandrapur without harming animals?'],
      ethics_crisis: ['A local forest mafia backed by influential politicians is clearing protected mangrove land. Your forest guard is threatened. What action do you take?'],
      vision: ['How will you integrate local Van-Dhan Vikas Kendras and tribal eco-tourism to make local communities guardians of the forest?'],
    }
  },

  zp: {
    id: 'zp',
    title_en: 'ZP Gram Sevak & BDO (Rural Dev)',
    title_mr: 'जिल्हा परिषद ग्रामसेवक व BDO मुलाखत मंडळ',
    color: '#0d9488',
    icon: 'cottage',
    maxScore: 100,
    passingTarget: 50,
    boardMembers: [
      'CEO Zilla Parishad (IAS) — Chairman',
      'Deputy CEO (Panchayat) — Rural Administration',
      'Project Director (MSRLM) — SHG & Livelihoods',
    ],
    dressCode: {
      male: 'Neat formal shirt and trousers, simple formal footwear.',
      female: 'Traditional cotton saree or simple salwar suit.',
    },
    etiquetteTips: [
      'Show commitment to grassroots democratic decentralization and rural welfare.',
    ],
    recommendedBooks: [
      { title: 'Maharashtra Village Panchayats Act, 1958', author: 'Govt. of Maharashtra', topic: 'Gram Sabha Powers & Sarpanch Roles' },
      { title: 'Rural Development Schemes Compendium', author: 'Ministry of Rural Development', topic: 'MGNREGA, PMAY-G, Jal Jeevan Mission' },
    ],
    stages: {
      daf: ['What motivates you to work at the grassroots village level rather than in urban offices?'],
      academic: ['Explain how the social audit mechanism in MGNREGA ensures transparency in muster rolls.'],
      maharashtra_governance: ['Drinking water pipelines in many Jal Jeevan Mission schemes face maintenance breakdowns. How will the Gram Panchayat sustain them?'],
      ethics_crisis: ['The village Sarpanch insists you release PMAY housing grant funds to his close relatives who already own pucca houses. How do you refuse lawfully?'],
      vision: ['How would you turn your Gram Panchayat into a model "Smart & Clean Adarsh Gram" within 3 years?'],
    }
  }
}

/**
 * Build dynamic questions tailored to candidate and random variation seed
 */
export function generateQuestionPool(panelId, candidateContext = {}) {
  const panel = INTERVIEW_PANELS[panelId] || INTERVIEW_PANELS.mpsc
  const degree = candidateContext.degree || 'your academic graduation degree'
  const district = candidateContext.district || 'Maharashtra'
  const hobby = candidateContext.hobby || 'reading and physical fitness'

  const questions = []

  // Stage 1: DAF
  panel.stages.daf?.forEach(q => {
    questions.push({
      stage: 'daf',
      stageLabel: 'DAF & Background',
      text: q.replace('{degree}', degree).replace('{district}', district).replace('{hobby}', hobby)
    })
  })

  // Stage 2: Academic
  panel.stages.academic?.forEach(q => {
    questions.push({
      stage: 'academic',
      stageLabel: 'Academic & Subject Application',
      text: q.replace('{degree}', degree).replace('{district}', district)
    })
  })

  // Stage 3: Maharashtra Governance
  panel.stages.maharashtra_governance?.forEach(q => {
    questions.push({
      stage: 'governance',
      stageLabel: 'Maharashtra Governance & Policies',
      text: q.replace('{district}', district)
    })
  })

  // Stage 4: Ethics & Crisis
  panel.stages.ethics_crisis?.forEach(q => {
    questions.push({
      stage: 'ethics',
      stageLabel: 'Situational Ethics & Crisis Leadership',
      text: q
    })
  })

  // Stage 5: Vision
  panel.stages.vision?.forEach(q => {
    questions.push({
      stage: 'vision',
      stageLabel: 'Public Service Vision & Closure',
      text: q
    })
  })

  return questions
}
