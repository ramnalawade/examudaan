// ============================================================
// apps/web/src/lib/aiToolEnricher.js
// ExamUdaan AI Tools — Deep Content & Enrichment Engine
// Provides 10-minute authoritative guides, hands-on masterclasses,
// real-world student exam examples (Before vs After),
// multi-tool AI power workflows (tool chaining),
// advanced mega-prompts with concrete student inputs/outputs,
// and curated YouTube/blog learning resources for every tool.
// ============================================================

import { getToolBySlug } from './aiToolsData.js'

// ── CUSTOM HANDCRAFTED DEEP DATA FOR YOMU AI ──────────────────
export const YOMU_AI_DEEP_DATA = {
  readingTime: '11 min read',
  difficulty: 'Beginner to Intermediate',
  pricingModel: 'Freemium (Free credits daily; Pro subscription available)',
  pricingDetails: {
    freeTier: 'Generous daily document editing, AI autocomplete, outline generation, and basic citation searches.',
    proTier: 'Unlimited GPT-4o / Claude 3.5 Sonnet writing assistance, advanced plagiarism checks, unlimited scholarly citation indexing, and full document export (Word/PDF/LaTeX).',
    studentTip: 'The free tier is more than adequate for 2-3 daily GS descriptive practice answers or 1 weekly full-length essay.'
  },
  bestExamUseCases: [
    'UPSC Civil Services Mains (GS 1, 2, 3, 4 & Essay Paper)',
    'MPSC Rajyaseva Descriptive Pattern (Papers 3 to 7)',
    'RBI Grade B Phase 2 (ESI & FM Descriptive Answers)',
    'State PSC (UPPSC, BPSC, WBPSC, KPSC) Mains',
    'University Dissertations, Master\'s Theses & Research Papers'
  ],
  deepDive: {
    overview: `Yomu AI is a purpose-built academic writing assistant engineered specifically to bridge the gap between unstructured research notes and publication-ready, authoritative prose. Unlike generalized conversational LLMs like ChatGPT or Claude which tend to generate verbose, generic, or conversational text, Yomu AI is constrained by an academic syntax engine. It natively integrates with global academic literature repositories (CrossRef, PubMed, arXiv, Semantic Scholar), allowing students to ground every claim with verifiable citations and committee references.`,
    coreTechnology: `Under the hood, Yomu AI pairs domain-specialized language models with a real-time semantic document editor. As you write, its 'Document-Level Context Engine' reads your entire thesis or essay structure rather than treating each prompt as an isolated query. It features a proprietary 'Academic Tone Synthesizer' that converts casual colloquial phrases into objective, balanced administrative language—the exact tone rewarding highest marks in UPSC and State PSC evaluation criteria.`,
    whyItMattersForExams: `In the modern UPSC and MPSC descriptive examination pattern, content alone is not enough—structure, balance, and administrative tone determine your rank. Aspirants often lose 2-4 marks per question due to fragmented conclusions, lack of constitutional articles/committee citations, or conversational language. Yomu AI acts as a 24/7 personal Mains evaluation coach that continuously challenges your arguments, surfaces missing perspectives (social, economic, ecological, ethical), and refines your syntax into high-scoring administrative English.`
  },
  keyCapabilities: [
    {
      icon: 'architecture',
      title: 'PEEL & PESTLE Outline Generator',
      desc: 'Instantly breaks down any complex exam question into structured sections: Point, Explanation, Evidence, and Link across Political, Economic, Social, Technological, and Environmental dimensions.'
    },
    {
      icon: 'format_quote',
      title: 'Real-Time Citation & Committee Sourcing',
      desc: 'Pulls verified government committee reports (Sarkaria, Punchhi, 15th Finance Commission, NITI Aayog) and academic studies directly into your draft with one click.'
    },
    {
      icon: 'history_edu',
      title: 'Administrative Tone Refiner',
      desc: 'Highlights conversational sentences and rewrites them in formal, neutral, policy-oriented language suited for civil services evaluators.'
    },
    {
      icon: 'fact_check',
      title: 'Plagiarism & Originality Guard',
      desc: 'Ensures your essays remain original, preventing mechanical AI patterns and helping you develop your authentic analytical voice.'
    }
  ],
  realWorldExamples: [
    {
      title: 'Case Study 1: UPSC GS-3 (15 Marks, 250 Words) — Precision Agriculture',
      examContext: 'UPSC CSE Mains Paper IV (GS-3: Indian Economy & Agriculture)',
      problemStatement: 'Evaluate the transformative potential of Artificial Intelligence and IoT in Indian agriculture, highlighting bottlenecks faced by small and marginal farmers.',
      studentRawInput: `AI and IoT can help Indian farmers in many ways. Farmers can check soil quality using sensors and know when to water crops. Drones can spray pesticides easily without wasting water. This increases yield and income. But poor farmers cannot afford costly tech. Internet is weak in villages. Also farmers do not know how to operate apps and smartphones. Government should give subsidies and help them learn tech so agriculture becomes profitable.`,
      aiTransformedOutput: `Artificial Intelligence (AI) and IoT offer a paradigm shift from input-intensive to precision-driven agriculture in India, where the sector sustains 45% of the workforce yet contributes only 18% to GVA.

1. Transformative Potential:
• Precision Farming: IoT sensors and ISRO's NDVI remote sensing optimize irrigation schedules and fertilizer application (aligned with PMKSY & Soil Health Card), reducing input costs by 15-20%.
• Predictive Pest & Disease Management: Computer vision models detect early crop blight (e.g., Pink Bollworm in Vidarbha cotton), enabling targeted pesticide deployment and minimizing ecological runoff.
• Market Integration & Yield Forecasting: AI algorithms integrated with e-NAM mitigate price volatility by forecasting harvest surpluses and connecting FPOs directly with institutional buyers.

2. Critical Bottlenecks for Small & Marginal Farmers (86% of Holdings):
• Capital Constraints & Fragmented Land: Average holding size of 1.08 ha renders individual capital expenditure on IoT unviable without collective aggregation.
• Rural Digital Divide: Intermittent 4G/5G connectivity and low digital literacy impede real-time advisory adoption (BharatNet phase implementation gap).
• Data Governance & Algorithmic Bias: Proprietary agri-data silos risk exploiting agrarian data without equitable farmer benefit sharing.

Way Forward:
Democratize precision agriculture via 'FPO-as-a-Service' models, subsidized custom hiring centers (CHCs), and open-source stacks through the Digital Agriculture Mission (AgriStack).`,
      scoreImpactAnalysis: `Score upgrade from ~4.5/15 to 9.5/15 (+5 Marks). The transformed answer introduces verified statistical anchors (86% marginal holdings, 18% GVA), specific government schemes (AgriStack, PMKSY, e-NAM), technical precision (NDVI remote sensing), and a balanced policy-grade 'Way Forward'.`
    },
    {
      title: 'Case Study 2: Mains 125-Mark Essay — Philosophical & Socio-Political Synthesis',
      examContext: 'UPSC / MPSC Paper 1 (Essay Section A)',
      problemStatement: 'Topic: "Wisdom finds its source in the recognition of limits, not in the conquest of them."',
      studentRawInput: `I want an essay structure on limits and wisdom. We should write about human greed, climate change, wars, and ancient Indian philosophy like Buddha and Gandhi. We can also add technology limits like AI regulation.`,
      aiTransformedOutput: `Thesis Statement:
True wisdom is not defined by unbounded conquest over nature, intellect, or geopolitical frontiers, but by the conscious discernment of ecological, ethical, and constitutional boundaries.

Structured Outline & Multi-Dimensional Matrix:
1. Introduction (The Icarus Paradigm vs Sthitaprajna):
   • Hook: Greek myth of Icarus juxtaposed with the Bhagavad Gita's ideal of 'Sthitaprajna' (balance through self-restraint).
   • Core Proposition: Conquering limits generates technological acceleration; recognizing limits generates civilizational longevity.

2. Ecological Dimension (Anthropocene & Planetary Boundaries):
   • Contrast the post-Industrial mindset of 'nature conquest' with Johan Rockström's 9 Planetary Boundaries.
   • Case Study: Climate degradation vs India's LiFE (Lifestyle for Environment) philosophy.

3. Political & Constitutional Dimension (Power & Restraint):
   • The danger of unbounded sovereign power vs Montesquieu's Separation of Powers and the 'Basic Structure Doctrine' (Kesavananda Bharati, 1973).
   • Wisdom in federalism: Recognizing union and state spheres under Article 246.

4. Technological Dimension (The AI Frontier):
   • Nuclear power (Oppenheimer's realization) vs Gene editing (CRISPR) and Generative AI.
   • Wisdom in ethical governance: Bletchley Park AI Safety declaration and the EU AI Act.

5. Ethical Synthesis & Conclusion (Aparigraha & Sustainable Future):
   • Gandhian concept of 'Aparigraha' (non-possession) and "Earth provides enough for every man's need, but not for every man's greed."
   • Concluding Vision: Sustainable development as the ultimate manifestation of civilizational wisdom.`,
      scoreImpactAnalysis: `Transitions a generic essay draft into an exceptional 125-mark blueprint featuring cross-disciplinary depth (Greek mythology, Constitutional doctrine, Planetary Boundaries, and Gandhian philosophy).`
    }
  ],
  handsOnMasterclass: [
    {
      step: 1,
      title: 'Initialize Document & Define Exam Grading Parameters',
      desc: 'Open Yomu AI and create a blank document. In the document header or sidebar assistant, define your target framework: "Civil Services Mains 250-word answer; Evaluation criteria: Multi-dimensional, neutral administrative tone, policy-focused with Indian data anchors."',
      proTip: 'Explicitly setting the word limit and marking scheme prevents the AI from generating verbose academic filler.'
    },
    {
      step: 2,
      title: 'Input Your Raw Question & Generate a PESTLE Matrix',
      desc: 'Paste your GS or essay question. Use Yomu\'s outline generation command to create an analytical scaffold across Political, Economic, Social, Technological, Legal, and Environmental dimensions.',
      proTip: 'Always demand at least two counter-perspectives to maintain neutrality and balance in administrative answers.'
    },
    {
      step: 3,
      title: 'Draft Section-by-Section with Real-Time Academic Copilot',
      desc: 'Write your initial thoughts for each section. When stuck on supporting arguments, use Yomu\'s autocomplete or "Expand with evidence" function to pull in relevant facts and statutory frameworks.',
      proTip: 'Use keyboard shortcut Alt + Enter to invoke inline suggestions without breaking your typing rhythm.'
    },
    {
      step: 4,
      title: 'Integrate Verifiable Citations & Committee Findings',
      desc: 'Highlight key arguments and click "Add Citation". Yomu scans scholarly databases and government publications to attach accurate academic references and committee names (e.g., Kasturirangan report, NITI Aayog Strategy for New India).',
      proTip: 'Cross-reference cited reports with your standard NCERT and standard reference texts to solidify recall.'
    },
    {
      step: 5,
      title: 'Run Administrative Tone Synthesis & Word Count Trim',
      desc: 'Select your draft and run the "Tone Refiner" set to "Formal / Policy Oriented". Yomu replaces casual adjectives (e.g., "bad problem", "huge impact") with precise administrative phraseology (e.g., "systemic bottleneck", "exponential multiplier effect").',
      proTip: 'Trim your answer to 240-250 words to match the exact page constraint of UPSC/MPSC answer booklets.'
    },
    {
      step: 6,
      title: 'Handwrite the Final Polish in 7-8 Minutes (Exam Simulation)',
      desc: 'Do not just leave the generated answer on screen! Immediately copy the perfected answer by hand onto ruled or unruled Mains practice sheets to build muscular memory and speed.',
      proTip: 'The ultimate goal of using Yomu AI is to train your internal mental model for the actual pen-and-paper exam.'
    }
  ],
  toolCombinations: [
    {
      title: 'Workflow 1: The Ultimate GS Mains Answer Writing Pipeline',
      goal: 'Gather latest real-time government statistics, draft high-scoring descriptive answers, and polish grammar to perfection.',
      tools: [
        { name: 'Perplexity AI', slug: 'perplexity', role: 'Real-Time Fact & Data Retrieval' },
        { name: 'Yomu AI', slug: 'yomu-ai', role: 'Structural Drafting & Administrative Tone' },
        { name: 'Grammarly', slug: 'grammarly', role: 'Syntax Flow & Precision Polish' }
      ],
      steps: [
        'Step 1 (Fact Mining): Prompt Perplexity AI: "What are the latest 2025-26 data points, NITI Aayog indicators, and government committee findings regarding groundwater depletion in northwest India?"',
        'Step 2 (Structural Synthesis): Copy Perplexity\'s verified data into Yomu AI. Use Yomu\'s outline generator to build a 250-word answer adhering to: Intro (Data anchor) → Causes (Subsidies/Cropping pattern) → Impact → Government Interventions (Atal Bhujal Yojana) → Way Forward.',
        'Step 3 (Refinement): Use Yomu\'s tone enhancer to ensure civil services administrative neutrality, followed by a final syntax pass in Grammarly.'
      ],
      timeSaved: 'Reduces answer research and drafting time from 45 minutes down to 8 minutes per topic.'
    },
    {
      title: 'Workflow 2: The Syllabus to Spaced-Recall Mastery Loop',
      goal: 'Synthesize monthly current affairs and government gazettes into model answers and permanent memory flashcards.',
      tools: [
        { name: 'Google NotebookLM', slug: 'notebooklm', role: 'Document Ingestion & Audio Summaries' },
        { name: 'Yomu AI', slug: 'yomu-ai', role: 'Descriptive Model Answer Writing' },
        { name: 'Anki', slug: 'anki', role: 'Spaced Repetition Memory Retention' }
      ],
      steps: [
        'Step 1 (Ingestion): Upload a 60-page Yojana or Economic Survey chapter into Google NotebookLM to extract core conceptual themes.',
        'Step 2 (Synthesis in Yomu): Move NotebookLM\'s key takeaways into Yomu AI to draft 3 model answers for expected 15-mark questions.',
        'Step 3 (Retention in Anki): Extract the core committee names, articles, and key stats from your Yomu answers into Anki flashcards for daily 10-minute spaced revision.'
      ],
      timeSaved: 'Eliminates passive rereading; guarantees 90%+ recall of high-yield exam data points on exam day.'
    },
    {
      title: 'Workflow 3: Deep Literature Review & Research Thesis Pipeline',
      goal: 'Formulate peer-reviewed academic dissertations and high-level policy papers with verified citations.',
      tools: [
        { name: 'Consensus', slug: 'consensus', role: 'Scientific Consensus & Research Verification' },
        { name: 'Yomu AI', slug: 'yomu-ai', role: 'Academic Narrative & Document Architecture' },
        { name: 'Paperpal', slug: 'paperpal', role: 'Journal Publication Standard Compliance' }
      ],
      steps: [
        'Step 1 (Scientific Verification): Search Consensus for peer-reviewed studies on policy impacts (e.g., "Direct Benefit Transfer vs Price Support in emerging economies").',
        'Step 2 (Narrative Building): Feed the extracted findings into Yomu AI to draft the literature review section with automated CrossRef citation formatting.',
        'Step 3 (Academic Standards): Run the completed chapter through Paperpal to check academic phrasing, journal tone, and citation consistency.'
      ],
      timeSaved: 'Compresses a 2-week literature review process into 3 dedicated study afternoons.'
    }
  ],
  strongPrompts: [
    {
      title: 'The Civil Services GS-2/GS-3 Answer Architect',
      purpose: 'Generate a balanced, high-scoring 250-word Mains model answer with verified data anchors, constitutional articles, and government schemes.',
      targetExam: 'UPSC CSE Mains / MPSC Rajyaseva GS 2 & 3',
      promptText: `Act as a senior UPSC/MPSC Mains Paper Evaluator and Subject Expert.

I will provide a GS Mains question: "[INSERT QUESTION HERE]".

Generate a comprehensive model answer adhering to the following strict parameters:
1. Target Word Count: Exactly 230-250 words.
2. Structure:
   - Introduction (30-35 words): Define the core concept and anchor with one recent statistic, NITI Aayog report, or national survey data.
   - Core Dimensions (130-140 words): 2 sub-headings (e.g., Opportunities/Potential vs Structural Bottlenecks). Provide 3 distinct, high-impact bullet points under each. Include relevant Constitutional Articles, Supreme Court landmark rulings, or Statutory Acts.
   - Government Initiatives & Case Studies (40 words): Cite 2-3 specific schemes (with nodal ministries) or successful state-level models (e.g., Maharashtra Jalyukt Shivar, Mission Kakatiya).
   - Way Forward & Conclusion (35-40 words): Suggest 2 actionable recommendations from landmark committees (e.g., Kelkar, Punchhi, Swaminathan, Kasturirangan) concluding with an optimistic administrative vision.
3. Tone: Balanced, objective, constitutional, and solution-driven. Avoid extreme language or partisan commentary.`,
      studentInputExample: `Question: "Critically examine the efficacy of the PM-KUSUM scheme in de-dieselizing Indian agriculture and augmenting farmer income in drought-prone regions."`,
      sampleOutputPreview: `Introduction:
Launched by MNRE, PM-KUSUM targets 34.8 GW solar capacity by 2026, advancing SDG-7 (Clean Energy) and SDG-1 (No Poverty). In arid zones like Marathwada, it decouples irrigation from erratic rural grid supply and soaring diesel expenditure.

Structural Efficacy & Opportunities:
• De-dieselization & Cost Reduction: Replacing 5-7.5 HP diesel pumps slashes farmer operational costs by up to ₹45,000 annually, cushioning against fuel inflation.
• Grid Resiliency & Feeder Solarization: Component-C enables daytime solar irrigation without requiring costly thermal transmission upgrades.
• Secondary Income Stream: Farmers can sell surplus solar power back to DISCOMs at pre-fixed feed-in tariffs, creating drought-hedged cash flows.

Persistent Bottlenecks:
• High Upfront Capital: Despite 60% subsidies (Center + State), the 40% margin money remains prohibitive for small farmers without credit guarantees.
• DISCOM Financial Stress: Chronic subsidy disbursement delays and unremunerative tariffs disincentivize DISCOM solar feeder adoption.
• Groundwater Depletion Risk: Subsidized solar electricity risks unmonitored over-extraction of fragile unconfined aquifers.

Way Forward:
Adopt the Khemka Committee roadmap: bundle PM-KUSUM with mandatory micro-irrigation (Drip/Sprinkler under PMKSY), institute IoT telemetry meters, and leverage Agri-Infrastructure Funds (AIF) for zero-interest farmer share financing.`
    },
    {
      title: 'Philosophical & Abstract Essay Multi-Dimension Deconstructor',
      purpose: 'Deconstruct abstract philosophical essay topics into 8 distinct societal and administrative dimensions with historical anecdotes.',
      targetExam: 'UPSC CSE Essay Paper / State PSC Descriptive',
      promptText: `Act as a master Essay Mentor for Civil Services Examinations.

I am writing a full-length 1,000-word essay on the philosophical topic: "[INSERT ESSAY TOPIC]".

Provide a comprehensive architectural blueprint:
1. Core Thesis Statement: A single nuanced sentence capturing the essence and paradox of the topic.
2. Opening Hook & Anecdote: Propose 2 contrasting real-world or historical opening anecdotes (one Western/Global, one Indian/Indigenous tradition).
3. The 360-Degree Analytical Dimension Matrix:
   - Historical Perspective (Rise & fall of empires / Lessons from history)
   - Socio-Cultural Perspective (Traditions vs modern alienation)
   - Political & Constitutional Perspective (Rule of law vs authoritarian overreach)
   - Economic Perspective (Inclusive growth vs unbridled capitalism)
   - Scientific & Technological Perspective (Human ingenuity vs existential risk)
   - Environmental & Ecological Perspective (Planetary stewardship vs exploitation)
   - Administrative & Ethical Perspective (Civil servant dharma and citizen duty)
4. Counter-Perspective (Antithesis): One substantive section acknowledging the opposing viewpoint to demonstrate cognitive depth.
5. Memorable Concluding Synthesis: Concluding vision tying back to the opening hook with a memorable philosophical quote (Gandhi, Tagore, Ambedkar, or Marcus Aurelius).`,
      studentInputExample: `Topic: "Courage is not the absence of fear, but the triumph over it."`,
      sampleOutputPreview: `Thesis Statement:
Courage is the moral and administrative discipline that channels existential vulnerability and institutional friction into righteous, transformative action.

Opening Anecdote Matrix:
• Option A (Indian Context): The civil disobedience of Satyagraha during the 1930 Salt March, where unarmed marchers faced lathi charges without retaliating, demonstrating moral triumph over terror.
• Option B (Global/Scientific Context): Marie Curie conducting pioneering radioactive research despite pervasive societal exclusion and lethal personal health hazards.

Core Analytical Matrix:
1. Political & Democratic Dimension: The courage of constitutional drafters like Dr. B.R. Ambedkar to enshrine universal adult franchise in a poverty-stricken, illiterate 1950 India despite widespread skepticism.
2. Administrative Dimension: Whistleblowers and civil servants upholding public interest against political intimidation (Satyendra Dubey paradigm).
3. Scientific Dimension: The courage to question established dogmas (Galileo's heliocentrism to modern climate whistleblowers).
4. Ecological Dimension: Indigenous communities (Bishnoi movement, Chipko) standing unarmed against commercial deforestation.

Antithesis (When Fear is Wise):
Prudence vs reckless bravado: In military doctrine and disaster management, acknowledging physical limits is vital to strategic preservation.

Conclusion:
Tie back to the salt march: courage as the moral architecture of human dignity, ending with Rabindranath Tagore's "Where the mind is without fear and the head is held high."`
    },
    {
      title: 'Informal Notes to Bureaucratic Grade Language Converter',
      purpose: 'Transform conversational student bullet points into sophisticated, neutral, and policy-accurate administrative prose.',
      targetExam: 'All Competitive Descriptive Exams & College Dissertations',
      promptText: `Act as an expert Civil Service Chief Editor and Administrative Style Specialist.

I will provide rough, informal student study notes on an exam topic:
"""
[PASTE YOUR ROUGH DRAFT OR NOTES HERE]
"""

Your task:
1. Rewrite these notes into 2 concise, highly formal, objective paragraphs.
2. Replace all informal or emotional phrasing with precise administrative and legal vocabulary (e.g., replace "bad government" with "governance deficit", "police do whatever they want" with "lack of institutional accountability and custodial oversight").
3. Seamlessly weave in relevant statutory acts, constitutional provisions, or standard governance metrics.
4. Provide a "Vocabulary Upgrade Table" listing the top 5 colloquial terms replaced and their administrative equivalents.`,
      studentInputExample: `Rough Notes: "Police in India have lots of problems. They work 14 hours a day and are very stressed. Political leaders use police for their own benefit and transfer honest officers when they don't listen. There is also corruption and police beat up poor people in lockups. We need to implement old committee reports and fix working conditions."`,
      sampleOutputPreview: `Administrative Revision:
The Indian police apparatus confronts acute structural and operational bottlenecks, prominently characterized by prolonged duty hours (averaging 14 hours daily), infrastructural deficits, and acute psychosocial stress, which collectively compromise institutional efficacy and public service delivery. The lack of statutory operational autonomy exposes state police organizations to partisan extraneous interference, resulting in politically motivated transfers and the erosion of merit-based career progression, thereby undermining the rule of law.

Furthermore, systemic deficiencies in investigative capabilities and accountability mechanisms have manifested in recurring instances of human rights infractions and custodial violence, severely eroding citizen trust. Addressing these systemic pathologies necessitates the time-bound, faithful implementation of the landmark Supreme Court directives in Prakash Singh v. Union of India (2006)—specifically establishing independent State Security Commissions, Police Establishment Boards, and Police Complaints Authorities—supplemented by systematic modernization of police stations and forensic infrastructure under the MPF scheme.

Vocabulary Upgrade Table:
• "Lots of problems" → "Acute structural and operational bottlenecks"
• "Very stressed" → "Psychosocial stress compromising institutional efficacy"
• "Political leaders use police" → "Exposure to partisan extraneous interference"
• "Police beat up poor people" → "Custodial violence and human rights infractions"
• "Implement old committee reports" → "Faithful implementation of landmark Supreme Court directives (Prakash Singh, 2006)"`
    }
  ],
  resources: {
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=yomu+ai+tutorial+for+academic+writing',
    officialDocs: 'https://www.yomu.ai',
    videoTutorials: [
      {
        title: 'Yomu AI Complete Tutorial — The AI Academic Writing Copilot',
        channel: 'Academic AI Reviews',
        searchQuery: 'Yomu AI tutorial academic writing',
        duration: '14 mins',
        summary: 'Walkthrough of Yomu AI\'s document editor, real-time citation finder, tone settings, and exporting options.',
        url: 'https://www.youtube.com/results?search_query=Yomu+AI+tutorial+academic+writing'
      },
      {
        title: 'How to Write A+ Essays & Mains Answers Using AI Tools',
        channel: 'Civil Services Strategy Hub',
        searchQuery: 'AI tools for UPSC mains essay answer writing',
        duration: '18 mins',
        summary: 'Practical guide on how to safely integrate AI writing assistants like Yomu AI to brainstorm, structure, and critique handwritten practice answers.',
        url: 'https://www.youtube.com/results?search_query=AI+tools+for+UPSC+mains+essay+answer+writing'
      },
      {
        title: 'Yomu AI vs Paperpal vs Notion AI: Academic Writer Comparison',
        channel: 'PhD & Research AI Lab',
        searchQuery: 'Yomu AI vs Paperpal comparison',
        duration: '12 mins',
        summary: 'Feature-by-feature benchmark of citation accuracy, hallucination rates, and academic tone calibration.',
        url: 'https://www.youtube.com/results?search_query=Yomu+AI+vs+Paperpal+comparison'
      }
    ],
    curatedBlogs: [
      {
        title: 'How to Structure 250-Word Civil Services Answers using the PEEL Framework',
        readTime: '6 min read',
        source: 'ExamUdaan Strategy Desk',
        desc: 'Master the art of high-scoring introduction, balanced analytical body paragraphs, and actionable committee-backed conclusions.',
        url: '#mega-prompts'
      },
      {
        title: 'The Science of Active Recall & AI-Powered Learning',
        readTime: '9 min read',
        source: 'Cognitive Science Journal (NCBI)',
        desc: 'Why active testing and AI-generated conceptual scaffolds improve long-term memory consolidation by over 60%.',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4968056/'
      },
      {
        title: 'Top 10 AI Tools Every MPSC & UPSC Aspirant Needs in 2026',
        readTime: '10 min read',
        source: 'ExamUdaan AI Directory',
        desc: 'A complete breakdown of our top-rated tools for PDF analysis, spaced repetition, mock interviews, and answer evaluation.',
        url: '/ai-tools'
      }
    ]
  },
  honestLimitations: [
    'Not a substitute for offline handwriting: Exams like UPSC and MPSC are 100% pen-and-paper. You must transcribe and practice handwritten answers within 7 minutes.',
    'Risk of algorithmic reliance: Never rely on AI for your core opinions; evaluators reward authentic personal synthesis over homogenized phrasing.',
    'Daily free quota: The free tier has daily usage limits on AI generations. Strategically use it for your 2 hardest practice questions each day.'
  ],
  faqs: [
    {
      q: 'Is using Yomu AI allowed for UPSC or MPSC preparation?',
      a: 'Yes, absolutely. Using AI tools as a study aid, research assistant, or structural feedback tool during your preparation phase is completely legitimate. The actual exam is conducted offline on paper without digital devices, so tools like Yomu AI serve to sharpen your analytical thinking and vocabulary before you enter the examination hall.'
    },
    {
      q: 'Will using Yomu AI cause my answers to sound robotic or get flagged by AI detectors?',
      a: 'Yomu AI is designed to elevate your personal drafts rather than generating generic essays from scratch. Because competitive exams are handwritten, AI detection software is not used in evaluation. However, human examiners can spot clichéd, repetitive phrases. To stand out, always inject specific Indian state data, committee names, and real-world ground realities as shown in our prompt templates.'
    },
    {
      q: 'Does Yomu AI support Marathi or Hindi essay writing?',
      a: 'Yomu AI works best with English academic text. While it can parse and understand Hindi or Marathi prompts, its tone refiner and citation lookups are optimized for English. For Marathi or Hindi descriptive papers, we recommend drafting the conceptual outline in Yomu and translating your model points into Marathi/Hindi during handwriting practice.'
    },
    {
      q: 'How does Yomu AI compare to ChatGPT or Claude for exam prep?',
      a: 'While ChatGPT and Claude are powerful general-purpose conversational models, they often generate verbose, repetitive, and casual paragraphs that exceed word limits. Yomu AI is built specifically for academic prose, features real citation databases, and provides an integrated document editor without chat distractions.'
    },
    {
      q: 'How much does Yomu AI cost?',
      a: 'Yomu AI provides a generous free tier that refreshes daily credits for document writing, outline creation, and citation searches. For power users writing full research dissertations or multiple daily papers, paid pro plans start at affordable monthly rates with unlimited generations.'
    }
  ]
}

export const ANTIGRAVITY_DEEP_DATA = {
  readingTime: '12 min read',
  difficulty: 'Intermediate to Advanced',
  pricingModel: 'Free (Developer & Agentic Preview)',
  pricingDetails: {
    freeTier: 'Full access to agentic code workflows, terminal execution tools, artifact management, and skills orchestration.',
    proTier: 'Extended frontier reasoning context and concurrent multi-agent task execution.',
    studentTip: 'Ideal for computer science students, engineering thesis projects, and tech exam aspirants (NIC, ISRO, DRDO, GATE CSE) building complex systems.'
  },
  bestExamUseCases: [
    'Technical Engineering & Coding Exams (ISRO Scientist, NIC Scientist, DRDO)',
    'GATE Computer Science & Information Technology Project Prep',
    'IBPS SO IT Officer & State Informatics Officer Preparation',
    'Full-Stack Software Architecture & Capstone Project Implementations',
    'Algorithmic Problem Solving & System Design Case Studies'
  ],
  deepDive: {
    overview: `Antigravity (AGY) is Google DeepMind's next-generation agentic AI software development platform and integrated environment. Unlike conventional autocomplete extensions or isolated chat windows, Antigravity functions as an autonomous pair programmer capable of multi-file refactoring, background terminal tool execution, persistent architectural memory via Skills & Rules (GEMINI.md / AGENTS.md), and parallel Git worktree delegation.`,
    coreTechnology: `Powered by frontier Google DeepMind models (including Gemini reasoning models) integrated with an autonomous execution kernel. It operates across multiple developer surfaces simultaneously—code editor, terminal shell, and headless browser subagents—while generating structured markdown Artifacts for human inspection and interactive alignment.`,
    whyItMattersForExams: `For students preparing for competitive technical examinations, campus coding rounds, and engineering capstones, Antigravity eliminates trivial boilerplate and teaches professional enterprise design patterns. It allows candidates to master full-stack system architecture, database optimization, and end-to-end testing in real time.`
  },
  keyCapabilities: [
    {
      icon: 'terminal',
      title: 'Autonomous Multi-Surface Agents',
      desc: 'Operates across editor files, terminal bash/powershell, and browser automation to run tests and verify UI implementations.'
    },
    {
      icon: 'psychology',
      title: 'Persistent Skills & Rules Memory',
      desc: 'Maintains project-specific coding guidelines, architectural constraints, and workflow playbooks across long sessions via GEMINI.md.'
    },
    {
      icon: 'call_split',
      title: 'Parallel Git Worktrees & Subagents',
      desc: 'Spawns background subagents working concurrently on isolated worktrees to investigate bugs without disturbing your active code.'
    },
    {
      icon: 'description',
      title: 'Interactive Markdown Artifacts',
      desc: 'Produces structured implementation plans, architecture diffs, and verification checklists with full markdown rendering.'
    }
  ],
  realWorldExamples: [
    {
      title: 'Scenario 1: Developing a High-Performance Full-Stack Portal for Tech Exams',
      examContext: 'ISRO / NIC Scientist-B / Campus Capstone Implementation',
      problemStatement: 'Building an enterprise-scale exam aggregator with Next.js App Router, PostgreSQL connection pooling, and strict Schema.org structured data.',
      studentRawInput: 'Build an exam notification portal with Next.js App Router, PostgreSQL pgdb pool, and strict SEO structured data for JobPosting.',
      aiTransformedOutput: `Architectural Solution:
1. Database Layer: Established pgdb.js connection pooling with parameterized SQL queries preventing SQL injection.
2. Routing & Dynamic Data: Implemented Next.js App Router dynamic routes (/jobs/[slug]) with server-side rendered JSON-LD schemas.
3. Design System Compliance: Enforced Zero Inline Styles policy using CSS Modules (*.module.css) and semantic design tokens.
4. Autonomous Verification: Executed production build checks, ensuring 0 lint errors and 100% type safety.`,
      scoreImpactAnalysis: 'Equips technical candidates with production-grade engineering practices demanded in technical viva examinations and top engineering interviews.'
    },
    {
      title: 'Scenario 2: Diagnosing Database Deadlocks & Concurrency Bottlenecks',
      examContext: 'GATE CSE / Advanced Database Systems / Enterprise IT Officer',
      problemStatement: 'Diagnosing why a high-frequency background worker locks PostgreSQL partitions during bulk data ingestion.',
      studentRawInput: 'Diagnose why my distributed scraper partition worker is locking PostgreSQL connection pools during bulk upserts.',
      aiTransformedOutput: `Diagnostic & Refactoring Blueprint:
• Root Cause: Unindexed foreign key lookups and unclosed transaction cursors causing connection pool exhaustion under load.
• Remediation: Added composite indexes on (notification_id, scraped_at), switched to bulk UPSERT with ON CONFLICT DO UPDATE, and wrapped database queries with automatic client release in try/finally blocks.
• Benchmark: Query latency dropped from 1,200ms to 42ms with zero deadlocks under simulated concurrent traffic.`,
      scoreImpactAnalysis: 'Demonstrates deep mastery of transaction isolation, query execution plans, and production database reliability.'
    }
  ],
  handsOnMasterclass: [
    {
      step: 1,
      title: 'Install & Initialize the AGY CLI',
      desc: 'Install via npm install -g @antigravity/cli or download the official IDE from antigravity.google. Run "agy init" in your project directory to scaffold workspace configurations.',
      proTip: 'Initialize in your project root to enable automatic workspace git worktree tracking.'
    },
    {
      step: 2,
      title: 'Establish GEMINI.md Architectural Rules',
      desc: 'Create a GEMINI.md file in your workspace root defining your technology stack, naming conventions, zero inline style rules, and database access patterns.',
      proTip: 'AGY automatically loads GEMINI.md in every session, guaranteeing your coding standards are never forgotten.'
    },
    {
      step: 3,
      title: 'Command Agent Mode for Multi-File Refactors',
      desc: 'Use natural language instructions to assign multi-file features. The agent analyzes dependencies, formulates a step-by-step implementation plan, and executes edits.',
      proTip: 'Review the generated Artifacts (plans and diffs) to align on architecture before committing changes.'
    },
    {
      step: 4,
      title: 'Autonomous Verification with Terminal & Subagents',
      desc: 'Allow the agent to run terminal build commands, run test suites, and launch headless browser subagents to verify live UI rendering.',
      proTip: 'Use background tasks for long-running test suites so you can continue architecting other modules.'
    }
  ],
  toolCombinations: [
    {
      title: 'Power Workflow 1: The Autonomous Full-Stack Architecture Pipeline',
      goal: 'Design, scaffold, and verify enterprise-grade web applications with zero hallucination.',
      tools: [
        { name: 'Antigravity (AGY)', slug: 'antigravity', role: 'Autonomous Agentic Pair Programmer & Orchestrator' },
        { name: 'PostgreSQL', slug: 'postgresql', role: 'Relational Database & Partitioned Store' },
        { name: 'GitHub', slug: 'github', role: 'Version Control & Worktree Branch Management' }
      ],
      steps: [
        'Step 1 (Architecture Planning): Instruct Antigravity to generate an architectural plan for your schema and API routes.',
        'Step 2 (Implementation): AGY generates the database migrations, repository access layers, and UI components across isolated files.',
        'Step 3 (Continuous Verification): AGY executes automated test suites in the background, resolving any regressions autonomously.'
      ],
      timeSaved: 'Cuts feature development and debugging time by over 70% while maintaining clean architecture.'
    },
    {
      title: 'Power Workflow 2: Technical Syllabus to Working System Pipeline',
      goal: 'Transform academic computer science textbooks into real working implementations for viva defense.',
      tools: [
        { name: 'Google NotebookLM', slug: 'notebooklm', role: 'Textbook & Research Paper Synthesizer' },
        { name: 'Antigravity (AGY)', slug: 'antigravity', role: 'Algorithmic Implementation Engine' },
        { name: 'Claude / ChatGPT', slug: 'chatgpt', role: 'Viva & Interview Mock Defense' }
      ],
      steps: [
        'Step 1 (Ingestion): Upload distributed systems research papers or gate syllabus PDFs into NotebookLM to extract core algorithms.',
        'Step 2 (Implementation): Instruct Antigravity to implement the algorithms (e.g., Raft consensus, B-Trees) with full unit test coverage.',
        'Step 3 (Defense Preparation): Quiz yourself against Claude on edge cases, time complexities, and failure modes.'
      ],
      timeSaved: 'Bridges theoretical academic knowledge with industry-grade software craftsmanship.'
    }
  ],
  strongPrompts: [
    {
      title: 'The Production Enterprise Architecture Blueprint',
      purpose: 'Generate an exhaustive multi-tier system architecture plan including database schema, caching, and API specs.',
      targetExam: 'ISRO Scientist / Technical Interviews / Enterprise Software Engineering',
      promptText: `Act as a Principal Software Architect and Systems Design Faculty Mentor.

I am architecting a new application module: "[DESCRIBE SYSTEM OR REQUIREMENT]".

Generate a comprehensive production-grade architecture blueprint:
1. High-Level Component Topology: Microservices vs Monolith trade-offs, service boundaries, and communication protocols (gRPC vs REST).
2. Database Schema Design: Normalized tables, foreign key constraints, composite indexing strategy, and partitioning considerations for PostgreSQL.
3. Resilience & Error Handling: Circuit breakers, idempotency keys, retry backoffs, and transaction rollbacks.
4. Performance & Scalability: Connection pooling configurations, in-memory caching layers (Redis), and pagination strategies.
5. Verification Checklist: Unit test matrix, integration test endpoints, and end-to-end user journey validations.`,
      studentInputExample: `Requirement: "A high-concurrency exam results query service that handles 50,000 requests/minute on result release days without crashing PostgreSQL."`,
      sampleOutputPreview: `1. Component Architecture:
• Read-Heavy Architecture: Front PostgreSQL with a Redis Read-Through Cache cluster with 15-minute TTL.
• Rate-Limiting Layer: Token-bucket rate limiting via Nginx reverse proxy (max 10 req/sec per IP).

2. Database Optimization:
• Composite Index: CREATE INDEX CONCURRENTLY idx_results_roll_exam ON exam_results (exam_id, roll_number);
• Read-Only Connection Pool: Separate read replicas from the primary write pool using PgBouncer.

3. Resilience & Degradation:
• Graceful Fallback: When database load exceeds 85%, serve stale cached snapshots with an informative warning banner.`
    }
  ],
  resources: {
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Google+Antigravity+agentic+AI+IDE+tutorial',
    officialDocs: 'https://antigravity.google/docs',
    videoTutorials: [
      {
        title: 'Google Antigravity (AGY) Full Agentic IDE Walkthrough & Setup',
        channel: 'AI Engineering & Deep Learning',
        searchQuery: 'Google Antigravity agentic AI IDE tutorial',
        duration: '16 mins',
        summary: 'Complete guide on installing the AGY CLI, initializing workspaces, and running autonomous agentic refactors.',
        url: 'https://www.youtube.com/results?search_query=Google+Antigravity+agentic+AI+IDE+tutorial'
      },
      {
        title: 'Building Production Applications Autonomously with Antigravity Agents',
        channel: 'FullStack AI Architect',
        searchQuery: 'Antigravity DeepMind agentic coding tutorial',
        duration: '22 mins',
        summary: 'Deep-dive into multi-surface agent tools, browser subagents, and concurrent Git worktree task delegation.',
        url: 'https://www.youtube.com/results?search_query=Antigravity+DeepMind+agentic+coding+tutorial'
      },
      {
        title: 'Antigravity Skills & Memory Architecture Masterclass',
        channel: 'DevOps & Agentic Systems',
        searchQuery: 'Antigravity IDE skills and rules tutorial',
        duration: '14 mins',
        summary: 'How to create persistent GEMINI.md project rules and custom domain skills so your AI never forgets your project conventions.',
        url: 'https://www.youtube.com/results?search_query=Antigravity+IDE+skills+and+rules+tutorial'
      }
    ],
    curatedBlogs: [
      {
        title: 'How to 10x Your Developer & Study Output Using Antigravity (AGY)',
        readTime: '7 min read',
        source: 'Google Antigravity Official Docs',
        desc: 'Discover proven techniques to integrate Antigravity into your technical project architecture, algorithms, and exam revision routine.',
        url: 'https://antigravity.google/docs'
      },
      {
        title: 'The Science of Active Recall & AI-Powered Learning',
        readTime: '9 min read',
        source: 'Cognitive Science Journal (NCBI)',
        desc: 'Why active testing and AI-generated conceptual scaffolds improve long-term memory consolidation by over 60%.',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4968056/'
      },
      {
        title: 'Top Complementary Developer & AI Tools to Pair with Antigravity',
        readTime: '6 min read',
        source: 'ExamUdaan AI Directory',
        desc: 'Build a cohesive AI toolstack to automate system architecture, unit testing, documentation, and technical interview prep.',
        url: '/ai-tools?category=Dev'
      }
    ]
  },
  honestLimitations: [
    'Autonomous execution requires active developer review: Always inspect generated code diffs and test outputs prior to production deployment.',
    'Terminal command safety: Ensure command execution policies are properly scoped when working in production environments.',
    'Focus on conceptual understanding: Use AGY to master system architecture rather than treating it as a black-box replacement for core CS knowledge.'
  ],
  faqs: [
    {
      q: 'Is Google Antigravity (AGY) free to use?',
      a: 'Yes, Antigravity provides access to developer and preview tiers, offering agentic coding, CLI orchestration, and tool execution capabilities without upfront fees.'
    },
    {
      q: 'Where can I access the official Antigravity documentation?',
      a: 'Official documentation, setup guides, and CLI reference are available directly at https://antigravity.google/docs.'
    },
    {
      q: 'How does Antigravity differ from Cursor or GitHub Copilot?',
      a: 'Unlike standard autocomplete plugins, Antigravity is a multi-surface autonomous agent. It can plan and execute multi-file changes, execute terminal scripts, inspect live browser DOMs, and maintain persistent long-term repository memory through custom Skills and Rules.'
    }
  ]
}

// ── DYNAMIC ENRICHMENT GENERATOR FOR ALL 124 TOOLS ─────────────
// Generates intelligent, category-specific 10-minute authoritative
// guides, step-by-step masterclasses, real-world student exam examples,
// multi-tool AI power workflows, advanced mega-prompts with student examples,
// and curated YouTube/blog resources for ANY tool.
export function enrichAiTool(tool) {
  if (!tool) return null

  // If this is Yomu AI, merge with our gold-standard handcrafted deep data
  if (tool.slug === 'yomu-ai') {
    return {
      ...tool,
      ...YOMU_AI_DEEP_DATA,
      steps: tool.steps && tool.steps.length > 0 ? tool.steps : YOMU_AI_DEEP_DATA.handsOnMasterclass,
      prompts: tool.prompts || []
    }
  }

  // If this is Antigravity (AGY), merge with dedicated DeepMind agentic deep data
  if (tool.slug === 'antigravity') {
    return {
      ...tool,
      ...ANTIGRAVITY_DEEP_DATA,
      steps: tool.steps && tool.steps.length > 0 ? tool.steps : ANTIGRAVITY_DEEP_DATA.handsOnMasterclass,
      prompts: tool.prompts || []
    }
  }

  // If the tool already has full custom deep fields, return as is
  if (tool.deepDive && tool.realWorldExamples && tool.toolCombinations) {
    return tool
  }

  // Otherwise, intelligently synthesize deep content matching the tool's category & profile
  const category = tool.category || 'Study'
  const toolName = tool.name
  const targetUsersList = tool.targetUsers && tool.targetUsers.length > 0
    ? tool.targetUsers
    : ['UPSC & MPSC Aspirants', 'Competitive Exam Students', 'College Researchers', 'Self-Learners']

  // Generate category-tailored best exam use cases
  const bestExamUseCases = generateExamUseCases(tool, category)

  // Generate deep dive technical overview
  const deepDive = {
    overview: `${toolName} is an industry-leading ${category.toLowerCase()} AI platform engineered to streamline complex cognitive tasks, accelerate study workflows, and empower students to learn at 3x to 5x speed. ${tool.whatIs || ''}`,
    coreTechnology: generateCoreTech(tool, category),
    whyItMattersForExams: `${tool.whyItMatters || ''} By converting passive reading into active, high-retention practice, ${toolName} enables competitive exam aspirants to absorb dense syllabus topics in a fraction of standard study hours.`
  }

  // Key capabilities
  const keyCapabilities = generateKeyCapabilities(tool, category)

  // Real world student examples (Before vs After)
  const realWorldExamples = generateRealWorldExamples(tool, category)

  // Step-by-step masterclass
  const handsOnMasterclass = tool.steps && tool.steps.length >= 4
    ? tool.steps.map((s, idx) => ({
        step: s.step || idx + 1,
        title: s.title,
        desc: s.desc,
        proTip: `Pro-tip for ${toolName}: Focus on iterative testing and export your outputs directly to your offline study notes.`
      }))
    : generateDefaultSteps(toolName, category)

  // Multi-Tool AI Power Workflows (Combinations with other tools)
  const toolCombinations = generateToolCombinations(tool)

  // Advanced Mega-Prompts with worked student input & output
  const strongPrompts = generateStrongPrompts(tool, category)

  // Curated Resources (YouTube, Documentation, Blogs)
  const resources = {
    youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(toolName + ' tutorial guide for students')}`,
    videoTutorials: [
      {
        title: `${toolName} Complete Beginner to Advanced Masterclass`,
        channel: 'EdTech & AI Academy',
        searchQuery: `${toolName} tutorial how to use`,
        duration: '15 mins',
        summary: `A thorough, step-by-step walkthrough covering the core interface, essential shortcuts, and productivity settings in ${toolName}.`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(toolName + ' tutorial how to use')}`
      },
      {
        title: `How Competitive Exam Aspirants Use ${toolName} for Maximum Retention`,
        channel: 'Exam Strategy Hub',
        searchQuery: `${toolName} exam preparation student guide`,
        duration: '11 mins',
        summary: `Field-tested student workflows demonstrating how to incorporate ${toolName} into daily study sessions without getting overwhelmed.`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(toolName + ' exam preparation student guide')}`
      },
      {
        title: `Top 5 Mistakes Students Make When Using ${toolName}`,
        channel: 'Study Smart AI',
        searchQuery: `${toolName} tips and tricks`,
        duration: '9 mins',
        summary: `Practical advice on avoiding hallucinations, prompt pitfalls, and time-wasting traps when using ${toolName}.`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(toolName + ' tips and tricks')}`
      }
    ],
    officialDocs: (tool.docsUrl || tool.url) && !(tool.docsUrl || tool.url).includes('antigravity.dev') ? (tool.docsUrl || tool.url) : null,
    curatedBlogs: [
      {
        title: `How to 10x Your Study Output Using ${toolName}`,
        readTime: '7 min read',
        source: 'ExamUdaan AI Research Desk',
        desc: `Discover proven techniques to integrate ${toolName} into your UPSC, MPSC, Banking, or academic revision routine.`,
        url: tool.docsUrl || (tool.url && tool.url.startsWith('http') && !tool.url.includes('antigravity.dev') ? tool.url : '#masterclass')
      },
      {
        title: `The Science of Active Recall & AI-Powered Learning`,
        readTime: '9 min read',
        source: 'Cognitive Science Journal (NCBI)',
        desc: `Why active testing and AI-generated conceptual scaffolds improve long-term memory consolidation by over 60%.`,
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4968056/'
      },
      {
        title: `Top Complementary AI Tools to Pair with ${toolName}`,
        readTime: '6 min read',
        source: 'ExamUdaan AI Directory',
        desc: `Build a cohesive AI toolstack to automate notes, flashcards, mock interviews, and descriptive answer writing.`,
        url: `/ai-tools?category=${encodeURIComponent(tool.category || 'Study')}`
      }
    ]
  }

  // Honest limitations & pricing
  const honestLimitations = [
    tool.limitations || `${toolName} is a supportive study assistant and should be paired with standard textbooks (NCERT, State Board, standard reference publications).`,
    'Always cross-verify factual dates, statutory acts, and numerical statistics with official government gazettes or yearbooks.',
    'Maintain a balance between digital AI planning and handwritten exam simulations on physical paper.'
  ]

  const pricingDetails = {
    freeTier: tool.free ? 'Generous free access tier with daily or monthly feature quotas.' : 'Free trial or limited freemium access available.',
    proTier: 'Premium plans unlock unlimited compute, faster inference models, and multi-format exports.',
    studentTip: 'Most competitive exam aspirants can achieve 90% of their study objectives using the free plan without needing a paid subscription.'
  }

  // Frequently Asked Questions
  const faqs = [
    {
      q: `Is ${toolName} free for Indian students?`,
      a: `${tool.free ? `Yes, ${toolName} offers a free tier that students can use without a credit card.` : `${toolName} offers a free trial or entry-level plan.`} You can create a free account directly on their official website.`
    },
    {
      q: `Can I use ${toolName} for UPSC, MPSC, or Banking exam preparation?`,
      a: `Yes. Aspirants routinely use ${toolName} to simplify dense syllabus topics, draft practice questions, organize study notes, and overcome revision bottlenecks. Make sure to ground your final revision in official syllabus guidelines.`
    },
    {
      q: `Which other AI tools work best when paired with ${toolName}?`,
      a: `Depending on your workflow, ${toolName} pairs exceptionally well with Google NotebookLM (for PDF document synthesis), Anki (for spaced repetition flashcards), and Perplexity AI (for real-time fact-checking).`
    },
    {
      q: `Will using ${toolName} lead to inaccurate answers or hallucinations?`,
      a: `All generative AI tools carry a slight margin for error on highly specific regional dates or niche committee names. Always treat AI outputs as an analytical scaffold, and verify primary numbers against government publications (such as Economic Survey and India Year Book).`
    },
    {
      q: `How should I balance ${toolName} with pen-and-paper writing?`,
      a: `Use ${toolName} during your research, brainstorming, and concept-clarification phase (the first 20-30 minutes). Once your outline and key concepts are clear, close the screen and practice writing your answers by hand under strict timer constraints.`
    }
  ]

  return {
    ...tool,
    readingTime: '10 min read',
    difficulty: 'Beginner to Intermediate',
    pricingModel: tool.free ? 'Free / Freemium' : 'Freemium / Paid Tier Available',
    pricingDetails,
    bestExamUseCases,
    deepDive,
    keyCapabilities,
    realWorldExamples,
    handsOnMasterclass,
    toolCombinations,
    strongPrompts,
    resources,
    honestLimitations,
    faqs
  }
}

// ── INTERNAL GENERATION HELPERS ───────────────────────────────

function generateExamUseCases(tool, category) {
  const defaults = [
    'UPSC Civil Services Examination (Prelims & Mains)',
    'MPSC Rajyaseva & Combined Group B/C Exams',
    'Banking Examinations (IBPS PO, SBI PO, RBI Grade B)',
    'SSC CGL, CHSL, and State Selection Boards',
    'College Coursework, Semester Finals & Research Theses'
  ]

  if (category === 'Dev') {
    return [
      'Technical Exams (NIC, NIELIT, ISRO Scientist)',
      'Engineering Semester Projects & Coding Rounds',
      'Data Interpretation & Quantitative Scripting',
      'Govt IT Officer Examinations (IBPS SO IT, RRB IT)'
    ]
  }

  if (category === 'Presentation' || category === 'Design') {
    return [
      'UPSC / MPSC Interview Stage (Personality Test preparation)',
      'College Seminar & Project Viva Presentations',
      'Visual Study Mind-maps & Infographic Timelines',
      'Govt Department Project Proposals & Case Studies'
    ]
  }

  return defaults
}

function generateCoreTech(tool, category) {
  const mapping = {
    Study: 'Advanced natural language comprehension coupled with semantic vector retrieval. It analyzes conceptual hierarchies and generates high-yield study aids, questions, and summaries tailored to syllabus frameworks.',
    Research: 'Retrieval-Augmented Generation (RAG) and semantic citation indexing that queries global research databases, ensuring factual claims are tied back to primary literature and gazettes.',
    Writing: 'Transformer-based autoregressive models calibrated for linguistic tone, syntactic cohesion, and argumentative structure. It assists students in transforming fragmented bullet points into coherent essays.',
    Dev: 'Deep learning code models trained on billions of lines of syntax, offering context-aware auto-completion, refactoring, and logical error debugging.',
    Presentation: 'Generative design engines combining multimodal NLP with dynamic aesthetic templates to transform plain text outlines into structured, visually engaging presentation decks.',
    Productivity: 'Workflow automation and cognitive task orchestration that minimizes friction, reduces context switching, and maintains study momentum across long preparation cycles.',
    'AI Hub': 'Cutting-edge foundational multimodal large language models delivering broad reasoning, multilingual translation, analytical problem solving, and adaptive tutoring.'
  }
  return mapping[category] || mapping.Study
}

function generateKeyCapabilities(tool, category) {
  return [
    {
      icon: 'psychology',
      title: 'Active Concept Scaffolding',
      desc: `Breaks down difficult topics into foundational principles, step-by-step logic, and exam-oriented takeaways.`
    },
    {
      icon: 'timer',
      title: 'Study Velocity Accelerator',
      desc: `Compresses hours of manual summarization, note-structuring, and revision planning into minutes.`
    },
    {
      icon: 'tune',
      title: 'Context-Aware Customization',
      desc: `Adapts its output format, complexity level, and tone according to your specific exam syllabus requirements.`
    },
    {
      icon: 'sync_alt',
      title: 'Multi-Format Export & Integration',
      desc: `Easily transfer generated insights into your preferred digital notebook, flashcard app, or printed revision binder.`
    }
  ]
}

function generateRealWorldExamples(tool, category) {
  const toolName = tool.name
  return [
    {
      title: `Example 1: Polity & Environment — Turning a 40-Page Topic into a 15-Mark Model Answer`,
      examContext: 'UPSC CSE & MPSC Rajyaseva Mains (GS-3 / Paper 4)',
      problemStatement: `How an aspirant turns 40 pages of dense textbook theory on Environmental Impact Assessment (EIA) into an exact, committee-backed 15-mark answer in 30 seconds.`,
      studentRawInput: `I have an upcoming exam covering Environmental Impact Assessment (EIA) notification and public consultations. I need a clean summary explaining why it is controversial, its history, and key Supreme Court judgments.`,
      aiTransformedOutput: `1. Conceptual Core of EIA:
• Statutory Basis: Enacted under Section 3 of the Environment (Protection) Act, 1986.
• Primary Objective: Predict environmental consequences of proposed developmental projects prior to granting clearance.

2. Critical Bottlenecks & Controversies:
• Dilution of Public Hearing: Post-facto clearances permit operational units to regularize violations ex-post.
• Reduction in Public Notice Period: Shortening compliance feedback windows limits tribal and local community participation (disproportionately affecting 5th Schedule areas).
• Strategic Project Exemptions: Broad classification of industrial zones as 'strategic' bypasses mandatory public scrutiny.

3. Landmark Judicial Interventions:
• Alembic Pharmaceuticals v. Rohit Prajapati (2020): Supreme Court ruled that ex-post facto environmental clearances are alien to environmental jurisprudence.
• Sterlite Industries Case (2013): Emphasized the Precautionary Principle and Polluter Pays Principle as non-negotiable constitutional tenets under Article 21.

Way Forward:
Empower independent regional environmental appraisal committees, mandate open-source GIS telemetry for monitoring, and ensure vernacular accessibility of EIA reports.`,
      scoreImpactAnalysis: `Eliminates 3 hours of manual reading. Replaces vague paragraphs with exact statutory acts and landmark judgments that examiners award top-bracket marks for.`
    },
    {
      title: `Example 2: Economy & Banking — Turning Confusing Theory into 5-Point Exam Facts`,
      examContext: 'Banking (IBPS PO, SBI PO, RBI Grade B) & SSC CGL',
      problemStatement: `How to quickly master complex Monetary Policy Committee (MPC) rules, inflation bands, and voting mandates without getting confused in the exam hall.`,
      studentRawInput: `Test my understanding on Monetary Policy Committee (MPC) composition, voting rules, and inflation targeting framework in India.`,
      aiTransformedOutput: `Rapid Verification Matrix:
• Statutory Mandate: Section 45ZB of the amended RBI Act, 1934.
• Composition: 6 Members (3 internal RBI officials including Governor as ex-officio Chairperson; 3 external members appointed by Central Government for a 4-year non-renewable term).
• Inflation Target: 4% Consumer Price Index (CPI) with a tolerance band of +/- 2% (2% to 6%), revised quinquennially.
• Quorum & Voting: Minimum 4 members required. Each member has one vote. In case of a tie, the RBI Governor possesses a casting vote.
• Failure Definition: Inflation breaching the tolerance band (above 6% or below 2%) for three consecutive quarters triggers a mandatory report to the Central Government explaining causes, remedies, and expected timeline.`,
      scoreImpactAnalysis: `Converts scattered textbook theory into exact numbers, sections, and criteria that directly match multiple-choice questions in Prelims & Phase-1 exams.`
    }
  ]
}

function generateDefaultSteps(toolName, category) {
  return [
    {
      step: 1,
      title: `Access ${toolName} & Setup Workspace`,
      desc: `Navigate to the official portal, sign up with your study credentials, and configure your default workspace preferences.`,
      proTip: `Bookmark your workspace and create specific folders for each exam subject (e.g., GS-1 History, GS-2 Polity, GS-3 Economy).`
    },
    {
      step: 2,
      title: `Define Your Goal & Syllabus Constraints`,
      desc: `Before submitting prompts, explicitly establish the role, target exam, word limit, and expected layout.`,
      proTip: `Never ask open-ended questions like "Tell me about inflation". Instead prompt: "Explain the transmission mechanism of repo rate on rural demand in 150 words."`
    },
    {
      step: 3,
      title: `Execute Focused Queries & Iterate`,
      desc: `Submit your inputs and review the preliminary output. Use follow-up prompts to demand additional examples, counter-arguments, or committee citations.`,
      proTip: `If the response is too broad, request a tabular matrix comparing strengths, weaknesses, and policy remedies.`
    },
    {
      step: 4,
      title: `Integrate with Offline Revision Notes`,
      desc: `Extract key takeaways, high-value keywords, and diagrams directly into your primary revision notebook or digital repository.`,
      proTip: `Review the output within 24 hours to transition newly acquired knowledge into long-term memory.`
    }
  ]
}

function generateToolCombinations(tool) {
  const toolName = tool.name
  const relatedSlugs = tool.relatedSlugs || []
  const firstPartner = relatedSlugs[0] ? getToolBySlug(relatedSlugs[0]) : null
  const secondPartner = relatedSlugs[1] ? getToolBySlug(relatedSlugs[1]) : null

  const p1Name = firstPartner?.name || 'Perplexity AI'
  const p1Slug = firstPartner?.slug || 'perplexity'
  const p2Name = secondPartner?.name || 'Anki'
  const p2Slug = secondPartner?.slug || 'anki'

  return [
    {
      title: `Power Workflow 1: The Accelerated Study-to-Retention Pipeline`,
      goal: `Harness ${toolName} alongside specialized tools to synthesize syllabus material and guarantee long-term retention.`,
      tools: [
        { name: toolName, slug: tool.slug, role: 'Primary Conceptual Engine' },
        { name: p1Name, slug: p1Slug, role: 'Research & Fact Verification' },
        { name: p2Name, slug: p2Slug, role: 'Spaced Repetition & Daily Active Recall' }
      ],
      steps: [
        `Step 1 (Exploration & Synthesis): Use ${toolName} to unpack dense concepts and generate clear, structured summaries tailored to your syllabus.`,
        `Step 2 (Verification & Deep-Dive): Cross-verify high-stakes facts, stats, and recent committee data using ${p1Name}.`,
        `Step 3 (Long-Term Retention): Export high-yield formulas, constitutional articles, and dates into ${p2Name} flashcards for daily 10-minute spaced revision.`
      ],
      timeSaved: 'Reduces revision cycles by 60% while dramatically improving factual accuracy under exam pressure.'
    },
    {
      title: `Power Workflow 2: Comprehensive Mock Test & Evaluation Loop`,
      goal: `Turn raw syllabus reading into timed simulation questions and diagnostic feedback.`,
      tools: [
        { name: toolName, slug: tool.slug, role: 'Source Material Analysis' },
        { name: 'Google NotebookLM', slug: 'notebooklm', role: 'Syllabus PDF Grounding' },
        { name: 'Claude / ChatGPT', slug: 'chatgpt', role: 'Mock Answer Grading & Rubric Evaluation' }
      ],
      steps: [
        `Step 1: Ingest primary notes or government circulars into Google NotebookLM for hallucination-free grounding.`,
        `Step 2: Use ${toolName} to formulate 10 tough analytical test questions mimicking recent exam trends.`,
        `Step 3: Write your answers under timed conditions and submit them to an AI evaluator with the official answer key for granular rubric feedback.`
      ],
      timeSaved: 'Simulates a personal 1-on-1 coaching mentorship at zero financial cost.'
    }
  ]
}

function generateStrongPrompts(tool, category) {
  const toolName = tool.name
  return [
    {
      title: 'The High-Yield Syllabus Topic Deconstructor',
      purpose: `Break down any complex syllabus topic into exam-ready concepts, key facts, and common exam traps.`,
      targetExam: 'UPSC / MPSC / Banking / SSC / State Exams',
      promptText: `Act as a senior competitive exam subject matter expert and mentor.

Topic: "[INSERT TOPIC / SUB-TOPIC HERE]"
Target Exam: "[INSERT EXAM: e.g. UPSC CSE / MPSC Group B / IBPS PO]"

Provide a comprehensive, high-yield study breakdown:
1. Conceptual Definition: Explain in simple terms (max 2 sentences) using an intuitive analogy.
2. 5 Must-Know Core Facts: High-weightage statutory provisions, dates, formulas, or constitutional articles.
3. Comparative Matrix: Contrast this concept with its most frequently confused counterpart.
4. Top 3 Examiner Traps: Common misconceptions or trick options tested in previous year question papers.
5. Model Practice Question: 1 high-standard MCQ or 1 descriptive 10-mark question with model answer and explanation.`,
      studentInputExample: `Topic: "Difference between Money Bill and Financial Bill (Category I & II) under Article 110 and Article 117"
Target Exam: "UPSC CSE Prelims & Mains"`,
      sampleOutputPreview: `1. Conceptual Definition:
Every Money Bill is a Financial Bill, but every Financial Bill is not a Money Bill—just as every square is a rectangle, but not every rectangle is a square.

2. 5 Must-Know Core Facts:
• Article 110: Only deals with matters specified in 110(1)(a)-(g) (taxes, borrowing, Consolidated Fund).
• Speaker's Certification: The Lok Sabha Speaker's decision that a bill is a Money Bill is final and non-justiciable.
• Rajya Sabha Limitations: Rajya Sabha cannot reject or amend a Money Bill; must return within 14 days.
• Prior Recommendation: Both Money Bills and Financial Bills (I) require prior recommendation of the President.
• Joint Sitting: Prohibited for Money Bills under Article 108; permitted for Financial Bills (I & II).

3. Top 3 Examiner Traps:
• Trap 1: Assuming Rajya Sabha can amend Financial Bill (II) — False; once introduced, Financial Bill (II) is treated like an ordinary bill.
• Trap 2: Believing a joint sitting can resolve a deadlock on a Money Bill — False; passage is deemed complete after 14 days.`
    },
    {
      title: 'The Multi-Perspective Administrative Case Study Solver',
      purpose: 'Generate an ethical, administrative, and legally sound solution to complex governance dilemmas.',
      targetExam: 'GS Paper IV (Ethics) & Administrative Personality Interviews',
      promptText: `Act as an experienced District Collector and Senior Ethics Faculty member.

Case Study Dilemma:
"""
[PASTE ETHICAL DILEMMA OR INTERVIEW SCENARIO HERE]
"""

Generate a structured administrative resolution:
1. Stakeholder Identification: Primary and secondary stakeholders (both institutional and vulnerable citizens).
2. Ethical & Legal Dilemmas: Core conflicts (e.g., Empathy vs Rule of Law; Duty vs Personal Safety; Short-term public order vs Long-term justice).
3. Option Appraisal: Evaluate 3 possible courses of action with merits and demerits.
4. Chosen Course of Action: Detailed step-by-step administrative intervention upholding constitutional morality.`,
      studentInputExample: `Case Study: "You are the Sub-Divisional Magistrate (SDM). An unseasonal cloudburst has flooded a river basin, stranding 300 villagers. The local MLA insists you divert rescue boats to his family estate first, threatening administrative transfer if you refuse. What do you do?"`,
      sampleOutputPreview: `1. Stakeholders:
• Stranded vulnerable villagers (elderly, infants, pregnant women) facing imminent drowning risk.
• Local MLA and private estate occupants.
• NDRF/SDRF rescue personnel and local revenue administration.
• Public faith in administrative neutrality and constitutional governance.

2. Ethical Dilemmas:
• Utilitarian triage (greatest good for greatest number) vs Yielding to political coercion.
• Duty of care towards the most vulnerable vs Risk of retaliatory career disruption.

3. Resolution & Step-by-Step Action:
• Step 1 (Objective Triage Protocol): Direct SDRF strictly according to standard disaster SOPs based on threat severity, prioritizing lives in deep inundation zones.
• Step 2 (Polite but Firm Communication): Inform the MLA calmly that rescue operations follow national disaster triage protocols recorded via GPS telemetry and live control room logs.
• Step 3 (Documentation & Transparency): Record all incoming calls and maintain a transparent public rescue manifest shared directly with the District Magistrate and State Disaster Management Authority.`
    }
  ]
}
