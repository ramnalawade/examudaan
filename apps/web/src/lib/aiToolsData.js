// ============================================================
// lib/aiToolsData.js — Master data for all AI Tools
// ExamUdaan.in — Free directory of top AI tools for exam prep,
// research, career growth, coding, and productivity.
// ============================================================

export const AI_TOOLS = [
  {
    "slug": "notebooklm",
    "name": "Google NotebookLM",
    "tagline": "Turn any PDF into a podcast, quiz, and study guide — instantly.",
    "category": "Study",
    "badge": "🔥 Game Changer",
    "free": true,
    "url": "https://notebooklm.google.com",
    "logo": "auto_stories",
    "targetUsers": [
      "MPSC Aspirants",
      "UPSC Students",
      "Banking Exam Prep",
      "Graduate Students"
    ],
    "whatIs": "NotebookLM is Google's AI research assistant that lets you upload PDFs, government gazettes, textbooks, or any document and instantly chat with it, generate study guides, create flashcards, and produce a 2-person AI audio \"Deep Dive\" podcast summarizing the content. Unlike ChatGPT, it only answers from YOUR uploaded documents — zero hallucinations.",
    "whyItMatters": "A 400-page MPSC syllabus textbook becomes a 20-minute audio podcast you can study while commuting. A 50-page government circular becomes 10 bullet points in 30 seconds.",
    "steps": [
      {
        "step": 1,
        "title": "Upload your source",
        "desc": "Go to notebooklm.google.com → New Notebook → upload any PDF (syllabus, textbook, gazette, notes). Supports up to 50 sources per notebook."
      },
      {
        "step": 2,
        "title": "Ask questions naturally",
        "desc": "Type \"Explain Article 356 in simple terms\" or \"What are the key dates mentioned here?\" and get answers pulled directly from your document with page citations."
      },
      {
        "step": 3,
        "title": "Generate Study Guide",
        "desc": "Click \"Studio\" → \"Study Guide\" to get a formatted overview with key concepts, timeline, and important terms automatically extracted."
      },
      {
        "step": 4,
        "title": "Create Audio Overview",
        "desc": "Click \"Audio Overview\" — in 2 minutes, two AI hosts generate a 10-20 minute conversational podcast about your document. Download and listen anywhere."
      },
      {
        "step": 5,
        "title": "Build Flashcards",
        "desc": "Ask \"Create 20 MCQ questions on this chapter with answers\" and copy them to AnkiApp or print for revision."
      }
    ],
    "prompts": [
      {
        "title": "MPSC Syllabus Breakdown",
        "text": "Based on this uploaded syllabus PDF, list the top 10 most frequently asked topics with a brief explanation of each. Format as: Topic → Why Important → Key Facts to Remember."
      },
      {
        "title": "Gazette Circular Summary",
        "text": "Summarize this government circular in 5 bullet points. Each bullet should be one sentence. End with: \"Key Action Required:\" and what an applicant must do."
      },
      {
        "title": "MCQ Generator",
        "text": "Create 15 multiple-choice questions from Chapter 3 of this document. Format each as: Q: [question] (A) [option] (B) [option] (C) [option] (D) [option] Answer: [letter]"
      }
    ],
    "limitations": "Requires a Google account. Maximum 50 sources per notebook. Audio Overview is English-only (Hindi/Marathi text gets summarized in English audio). Best for English-language documents.",
    "relatedSlugs": [
      "anki",
      "perplexity",
      "elevenlabs"
    ]
  },
  {
    "slug": "anki",
    "name": "AnkiApp / Anki",
    "tagline": "Spaced repetition flashcards — the scientifically proven way to remember more.",
    "category": "Study",
    "badge": "📚 Proven Method",
    "free": true,
    "url": "https://apps.ankiweb.net",
    "logo": "style",
    "targetUsers": [
      "MPSC/UPSC Aspirants",
      "Banking Exam Prep",
      "Medical Students",
      "GATE Aspirants"
    ],
    "whatIs": "Anki is a flashcard app based on spaced repetition — a memory technique that shows you cards right before you would forget them. Used by medical students, lawyers, and competitive exam toppers worldwide. It dramatically reduces the time to memorize large volumes of information like GS facts, banking awareness, current affairs, and vocabulary.",
    "whyItMatters": "Most aspirants read notes once and forget 70% in 3 days. Anki's algorithm ensures you review exactly what you're about to forget — making 1 hour of Anki more effective than 4 hours of passive rereading.",
    "steps": [
      {
        "step": 1,
        "title": "Download Anki",
        "desc": "Download free from ankiweb.net (desktop) or AnkiApp from your phone's app store. Create a free account to sync across devices."
      },
      {
        "step": 2,
        "title": "Create a deck",
        "desc": "Click \"Create Deck\" and name it (e.g., \"MPSC Geography 2026\" or \"Banking Awareness June 2026\"). Add cards: Front = question, Back = answer."
      },
      {
        "step": 3,
        "title": "Use AI to bulk-create cards",
        "desc": "Paste your notes into Claude or ChatGPT and say \"Create 30 Anki flashcards from this text. Format: Q: [question] | A: [answer]\". Import the list into Anki using the text import feature."
      },
      {
        "step": 4,
        "title": "Review daily (15-20 min)",
        "desc": "Anki shows you only the cards due today. Rate each card: Again / Hard / Good / Easy. The algorithm schedules the next review automatically."
      },
      {
        "step": 5,
        "title": "Download shared decks",
        "desc": "Go to ankiweb.net → Browse → search \"UPSC GS\" or \"Banking Awareness\" to download pre-made decks created by toppers."
      }
    ],
    "prompts": [
      {
        "title": "Bulk Card Creator",
        "text": "Create 25 Anki-style flashcards from the following GS text. Format exactly as:\nQ: [question]\nA: [answer]\n\n[Paste your notes here]"
      },
      {
        "title": "Current Affairs Cards",
        "text": "I will paste 10 news headlines. For each, create one Anki card testing the key fact. Format: Q: [fact-based question] | A: [answer]"
      },
      {
        "title": "MCQ to Flashcard",
        "text": "Convert these MCQs into Anki flashcards. For each question, make one card with the question as the front and the correct answer + brief explanation as the back."
      }
    ],
    "limitations": "The desktop app has a steep learning curve initially. Mobile sync requires AnkiWeb account. Image occlusion and advanced features need plugins. AnkiApp (third-party) is simpler but lacks some features.",
    "relatedSlugs": [
      "notebooklm",
      "claude",
      "perplexity"
    ]
  },
  {
    "slug": "elevenlabs",
    "name": "ElevenLabs",
    "tagline": "Convert your study notes to natural AI voice — study while commuting.",
    "category": "Study",
    "badge": "🎧 Audio Study",
    "free": true,
    "url": "https://elevenlabs.io",
    "logo": "volume_up",
    "targetUsers": [
      "MPSC/UPSC Aspirants",
      "Long Commuters",
      "Marathi Medium Students"
    ],
    "whatIs": "ElevenLabs is the world's most realistic AI text-to-speech tool. Paste any text — notes, summaries, GS topics, current affairs — and get a natural-sounding audio file you can listen to while travelling, cooking, or exercising. Supports multiple languages including Hindi.",
    "whyItMatters": "Most competitive exam aspirants in Maharashtra travel 1-2 hours daily. Converting notes to audio means you can \"study\" during commute without looking at a screen. 45 minutes of audio = one GS chapter revision.",
    "steps": [
      {
        "step": 1,
        "title": "Create a free account",
        "desc": "Go to elevenlabs.io → Sign Up (free tier gives 10,000 characters/month — enough for ~5 pages of notes)."
      },
      {
        "step": 2,
        "title": "Summarize notes first",
        "desc": "Use Claude or NotebookLM to create a 500-word summary of your chapter. Dense notes make for poor audio — conversational summaries work best."
      },
      {
        "step": 3,
        "title": "Choose a voice",
        "desc": "In the Text to Speech tool, choose a clear Indian-English or Hindi voice. \"Aria\" and \"Daniel\" are popular for study content."
      },
      {
        "step": 4,
        "title": "Generate and download",
        "desc": "Paste your text → Generate → Download MP3. Save to your phone and add to your commute playlist."
      },
      {
        "step": 5,
        "title": "Create a study podcast",
        "desc": "Combine 5-7 chapter summaries into one long audio file using a free tool like Audacity for a full GS paper audio revision session."
      }
    ],
    "prompts": [
      {
        "title": "Commute-Ready Summary",
        "text": "Rewrite these notes as a clear, conversational 400-word spoken summary. Use short sentences. No bullet points or headers — it should flow naturally when read aloud.\n\n[Paste your notes]"
      },
      {
        "title": "Q&A Podcast Script",
        "text": "Create a 10-question Q&A script from this topic that could be read aloud. Format: \"Question 1: [question]. The answer is: [answer]. Let's understand why: [1-sentence explanation].\""
      },
      {
        "title": "Daily Current Affairs Audio",
        "text": "Summarize today's 5 most important news for a UPSC/MPSC aspirant in 250 words as a radio news script — clear, direct, no jargon."
      }
    ],
    "limitations": "Free tier limited to 10,000 characters/month (~5 pages). Premium plans start at $5/month. Hindi quality is good but not perfect — English summaries of Hindi content work better.",
    "relatedSlugs": [
      "notebooklm",
      "claude",
      "anki"
    ]
  },
  {
    "slug": "perplexity",
    "name": "Perplexity AI",
    "tagline": "AI search with citations — better than Google for complex questions.",
    "category": "Research",
    "badge": "✅ Free",
    "free": true,
    "url": "https://perplexity.ai",
    "logo": "travel_explore",
    "targetUsers": [
      "Research Students",
      "UPSC Aspirants",
      "Content Writers",
      "Job Aspirants"
    ],
    "whatIs": "Perplexity is an AI-powered search engine that gives you direct answers to complex questions with cited sources. Unlike Google (10 blue links) or ChatGPT (no sources), Perplexity reads current web pages and tells you the answer with numbered citations. Perfect for fact-checking, research, and understanding current affairs in depth.",
    "whyItMatters": "When you search \"What are the latest changes to MPSC exam pattern 2026?\" on Google you get 20 links to sift through. On Perplexity you get a 3-paragraph answer with 5 cited sources in 5 seconds.",
    "steps": [
      {
        "step": 1,
        "title": "Go to perplexity.ai",
        "desc": "No account needed to start. Create a free account to save searches and use Pro features."
      },
      {
        "step": 2,
        "title": "Ask complete questions",
        "desc": "Instead of searching keywords, ask full questions: \"Explain the difference between MPSC State Services and MPSC Combined exam eligibility 2026.\""
      },
      {
        "step": 3,
        "title": "Use Focus modes",
        "desc": "Click the \"Focus\" button to restrict search to: Web, Academic, YouTube, Reddit, or News. For exam prep, Academic and News modes are most useful."
      },
      {
        "step": 4,
        "title": "Follow up and drill down",
        "desc": "Perplexity remembers your conversation. Ask follow-ups: \"Now explain the syllabus for Paper 2 only\" and it builds on the previous answer."
      },
      {
        "step": 5,
        "title": "Export and save",
        "desc": "Create a free account to save your research threads. Use the Share button to get a link to any research conversation."
      }
    ],
    "prompts": [
      {
        "title": "Exam Pattern Comparison",
        "text": "Compare the MPSC 2025 and MPSC 2026 exam patterns: eligibility, number of papers, marks distribution, and key changes. Cite official sources."
      },
      {
        "title": "Current Affairs Deep Dive",
        "text": "Explain [recent news topic] in the context of UPSC/MPSC GS Paper 2. What is the constitutional/legal background? What are the implications? What questions could be asked?"
      },
      {
        "title": "Topic Research",
        "text": "Give me a comprehensive overview of [GS topic] for UPSC Prelims preparation. Cover: definition, historical context, current status, and 3 likely exam angles."
      }
    ],
    "limitations": "Free tier limits Pro searches. Real-time web data may occasionally be outdated by 1-2 hours. Academic mode requires Pro subscription. Best for English-language research.",
    "relatedSlugs": [
      "claude",
      "consensus",
      "notebooklm"
    ]
  },
  {
    "slug": "consensus",
    "name": "Consensus.app",
    "tagline": "AI search engine for academic papers — find verified research instantly.",
    "category": "Research",
    "badge": "🔬 Research",
    "free": true,
    "url": "https://consensus.app",
    "logo": "science",
    "targetUsers": [
      "UPSC Essay Writers",
      "Research Students",
      "Content Creators"
    ],
    "whatIs": "Consensus is an AI that searches 200+ million academic papers and extracts the key finding directly. When you ask \"Does spaced repetition improve exam scores?\", it shows you 8 studies with their conclusions — no need to read 40-page papers. Essential for UPSC essay writing and GS answer enrichment with data-backed arguments.",
    "whyItMatters": "UPSC Mains examiners reward data-backed answers. Consensus lets you find real statistics (e.g., \"Studies show 42% increase in retention with...\") in 30 seconds instead of 2 hours of library research.",
    "steps": [
      {
        "step": 1,
        "title": "Go to consensus.app",
        "desc": "Create a free account (5 AI-powered searches/day free, more with Pro)."
      },
      {
        "step": 2,
        "title": "Ask research questions",
        "desc": "Frame your query as a research question: \"Does financial inclusion reduce poverty in developing countries?\" not \"financial inclusion poverty\"."
      },
      {
        "step": 3,
        "title": "Read the Consensus Meter",
        "desc": "The tool shows what % of research papers agree, disagree, or are mixed on your question — great for essay writing."
      },
      {
        "step": 4,
        "title": "Click papers for abstracts",
        "desc": "Click any result to see the study abstract and key finding. Note the year and journal for citations in UPSC answers."
      },
      {
        "step": 5,
        "title": "Generate study snapshots",
        "desc": "Click \"Synthesize\" for a paragraph summary of what science says about your topic — copy directly into essay planning notes."
      }
    ],
    "prompts": [
      {
        "title": "UPSC Essay Data Point",
        "text": "Search Consensus for: \"Effect of [policy topic] on [outcome] in India\" and give me the top 3 findings with year and journal name that I can cite in a UPSC essay."
      },
      {
        "title": "GS Paper 3 Research",
        "text": "Find research on: \"Impact of [scheme/policy] on [target group] in developing countries.\" I need one statistic I can use in a 150-word UPSC answer."
      }
    ],
    "limitations": "Free tier is 5 AI searches/day. Best for English-language academic papers. Not useful for current affairs (academic papers lag by 1-2 years). Pro plan is $8.99/month.",
    "relatedSlugs": [
      "perplexity",
      "claude",
      "notebooklm"
    ]
  },
  {
    "slug": "claude",
    "name": "Claude (Anthropic)",
    "tagline": "The best AI for long documents, nuanced writing, and exam answer analysis.",
    "category": "Writing",
    "badge": "⭐ Top Pick",
    "free": true,
    "url": "https://claude.ai",
    "logo": "psychology",
    "targetUsers": [
      "UPSC Mains Aspirants",
      "MPSC Aspirants",
      "Resume Writers",
      "Essay Writers"
    ],
    "whatIs": "Claude is an AI assistant by Anthropic, widely considered the best for writing, analysis, and long-document understanding. Unlike ChatGPT (which has a 32K token limit on free tier), Claude can read and analyze 200,000 tokens (~150,000 words) — equivalent to an entire textbook. It produces more nuanced, well-structured, exam-quality writing.",
    "whyItMatters": "Feed Claude your entire Previous Year Question set for UPSC Mains and ask \"What themes appear most frequently?\" Feed it your 5-page answer draft and ask \"Grade this like an UPSC examiner, score it out of 250, and suggest 3 specific improvements.\"",
    "steps": [
      {
        "step": 1,
        "title": "Create your free account",
        "desc": "Go to claude.ai → Sign up with Google or email. Free tier gives Claude Sonnet access — excellent for most tasks."
      },
      {
        "step": 2,
        "title": "Set context upfront",
        "desc": "Start every session with context: \"I am an MPSC aspirant in Maharashtra preparing for the State Services 2026 Prelims. My weak subjects are History and Environment. Please keep all responses focused on this exam.\""
      },
      {
        "step": 3,
        "title": "Upload documents",
        "desc": "Paste or upload PDFs of question papers, your notes, or syllabus. Ask Claude to analyze patterns, create study plans, or evaluate answers."
      },
      {
        "step": 4,
        "title": "Get answer evaluated",
        "desc": "Write a UPSC/MPSC-style answer, paste it, and ask: \"Grade this answer on: relevance, structure, examples, conclusion. Score out of 10. Be harsh like an UPSC evaluator.\""
      },
      {
        "step": 5,
        "title": "Build your 30-day study plan",
        "desc": "Share your syllabus + exam date and say: \"Create a realistic day-by-day 30-day study plan. I can study 4 hours/day. Prioritize topics by weight in previous papers.\""
      }
    ],
    "prompts": [
      {
        "title": "MPSC Answer Evaluator",
        "text": "You are an MPSC examiner. Evaluate my answer below on: (1) Relevance to question (2) Structure (3) Use of examples (4) Conclusion quality. Score each out of 5. Be specific about what to improve.\n\nQuestion: [paste question]\nMy Answer: [paste answer]"
      },
      {
        "title": "30-Day Study Plan",
        "text": "Create a 30-day MPSC Prelims study plan starting from [date]. I can study 4 hours/day (8-10 AM and 7-9 PM). My weak areas: [list topics]. Strong areas: [list topics]. Exam date: [date]. Include daily topics, revision days, and 2 mock test dates."
      },
      {
        "title": "PYQ Pattern Analyzer",
        "text": "I am pasting 3 years of UPSC Prelims GS1 questions below. Analyze:\n1. Which topics appear most (top 10)\n2. Which topics appear least\n3. What new topics appeared in the most recent year\n4. My predicted 5 high-probability topics for next year\n\n[Paste questions]"
      }
    ],
    "limitations": "Free tier has usage limits (you get paused after heavy use — try again after 1 hour). Claude cannot browse the internet in real time. For internet-connected AI, use Perplexity. Claude Pro is $20/month for unlimited use.",
    "weeklyLearningPlan": [
      {
        "day": "Day 1-2",
        "task": "Set up Claude, learn the system prompt technique, practice getting structured study plans"
      },
      {
        "day": "Day 3-4",
        "task": "Use Claude to analyze 2 years of Previous Year Questions for your target exam"
      },
      {
        "day": "Day 5-6",
        "task": "Write 3 exam-style answers and get them graded by Claude. Study the feedback."
      },
      {
        "day": "Day 7",
        "task": "Build your personal 30-day study calendar using Claude. Stick to it."
      }
    ],
    "relatedSlugs": [
      "perplexity",
      "notebooklm",
      "quillbot"
    ]
  },
  {
    "slug": "quillbot",
    "name": "QuillBot",
    "tagline": "Paraphrase, summarize, and improve any text — in seconds.",
    "category": "Writing",
    "badge": "✍️ Writing Aid",
    "free": true,
    "url": "https://quillbot.com",
    "logo": "auto_fix_high",
    "targetUsers": [
      "MPSC/UPSC Aspirants",
      "Students",
      "Job Seekers",
      "Content Writers"
    ],
    "whatIs": "QuillBot is an AI writing assistant that paraphrases, summarizes, checks grammar, and rewrites text in different styles (formal, simple, creative, academic). Used by 30 million+ students and professionals to improve their writing quality and clarity.",
    "whyItMatters": "For aspirants writing MPSC Mains answers or cover letters, QuillBot can instantly improve the language quality, fix grammatical errors, and suggest more formal or academic phrasing — lifting answer quality significantly.",
    "steps": [
      {
        "step": 1,
        "title": "Go to quillbot.com",
        "desc": "Free account gives access to paraphraser (125 words at a time), grammar checker (unlimited), and summarizer (1200 words). No credit card needed."
      },
      {
        "step": 2,
        "title": "Use Paraphraser",
        "desc": "Paste your written answer → QuillBot shows rewritten version with highlighted changes. Choose mode: Standard, Fluency, Formal, Academic, Creative."
      },
      {
        "step": 3,
        "title": "Use Summarizer",
        "desc": "Paste any long article or reading → QuillBot summarizes it in key sentences or paragraph form. Great for condensing long editorials."
      },
      {
        "step": 4,
        "title": "Fix grammar",
        "desc": "Paste your essay or email into Grammar Checker for real-time corrections. Better than MS Word's basic grammar check."
      },
      {
        "step": 5,
        "title": "Install browser extension",
        "desc": "Add QuillBot to Chrome — it works inside Gmail, Google Docs, and any text field for instant suggestions."
      }
    ],
    "prompts": [
      {
        "title": "Mains Answer Polish",
        "text": "Rewrite this MPSC Mains answer in \"Formal Academic\" style. Keep all facts intact but improve sentence structure, vocabulary, and flow. Answer: [paste your draft]"
      },
      {
        "title": "Email Formalization",
        "text": "I need to email the HR manager asking about my interview result status. Rewrite this draft in a more professional, formal tone while keeping it concise: [paste draft email]"
      },
      {
        "title": "Summary of Editorial",
        "text": "Summarize this Hindu editorial in 5 key points, each in one sentence. Focus on: the author's main argument, key evidence, and policy implications for India."
      }
    ],
    "limitations": "Free paraphraser is limited to 125 words per input. Summarizer limited to 1200 words. Premium ($9.95/month) removes limits and adds plagiarism checker.",
    "relatedSlugs": [
      "claude",
      "chatgpt",
      "grammarly"
    ]
  },
  {
    "slug": "gamma",
    "name": "Gamma.app",
    "tagline": "AI-generated presentations in 60 seconds — no design skills needed.",
    "category": "Presentation",
    "badge": "🚀 AI-Generated",
    "free": true,
    "url": "https://gamma.app",
    "logo": "slideshow",
    "targetUsers": [
      "MPSC Aspirants",
      "Job Seekers",
      "Students",
      "Teachers"
    ],
    "whatIs": "Gamma is an AI tool that creates beautiful, shareable presentations, documents, and web pages from a single text prompt. Unlike PowerPoint, Gamma auto-designs layouts, chooses fonts, and adds visuals — you just describe what you need.",
    "whyItMatters": "For aspirants preparing seminar topics, essay presentations, or interview materials, Gamma creates professional-quality slides in minutes instead of hours spent on formatting.",
    "steps": [
      {
        "step": 1,
        "title": "Go to gamma.app",
        "desc": "Sign up for free using your Google account. Free plan gives 400 credits (enough for 8–10 full presentations)."
      },
      {
        "step": 2,
        "title": "Choose \"Generate\"",
        "desc": "Click \"New\" → \"Generate\". Type your topic: e.g., \"Maharashtra Water Conservation Policy — 10 slides for government interview\"."
      },
      {
        "step": 3,
        "title": "Select style",
        "desc": "Gamma shows 3 AI-generated outline options. Pick the best one and choose a theme (color palette + font)."
      },
      {
        "step": 4,
        "title": "Customize content",
        "desc": "Edit any slide: click to change text, add images from Unsplash, embed YouTube videos, or reorganize cards by drag-and-drop."
      },
      {
        "step": 5,
        "title": "Share or Export",
        "desc": "Share as a live web link, or export as PowerPoint (PPTX) or PDF for printing or email."
      }
    ],
    "prompts": [
      {
        "title": "MPSC Interview Presentation",
        "text": "Create a 10-slide presentation on \"Maharashtra's Water Crisis — Causes, Current Schemes, and My Proposed Solutions\". Include data points, policy names, and a conclusion with action steps."
      },
      {
        "title": "Banking Awareness Summary",
        "text": "Create a 8-slide visual summary of RBI Monetary Policy April 2026 for IBPS PO preparation. Include repo rate, reverse repo, CRR, SLR, and key policy decisions."
      },
      {
        "title": "Job Interview Portfolio",
        "text": "Create a 6-slide professional portfolio presentation for a Software Engineer interview. Include: About Me, Tech Stack, 2 Key Projects, Achievements, and Why This Company."
      }
    ],
    "limitations": "Free plan has credit limits (resets monthly). Export to PDF/PPTX requires paid plan. Advanced custom branding needs Pro subscription.",
    "relatedSlugs": [
      "napkin",
      "canva",
      "claude"
    ]
  },
  {
    "slug": "napkin",
    "name": "Napkin AI",
    "tagline": "Turn your text into infographics, diagrams, and visuals instantly.",
    "category": "Presentation",
    "badge": "✨ Visual Magic",
    "free": true,
    "url": "https://napkin.ai",
    "logo": "draw",
    "targetUsers": [
      "Content Writers",
      "Students",
      "Teachers",
      "Job Seekers"
    ],
    "whatIs": "Napkin AI converts written content into professional visuals — flowcharts, comparison diagrams, process flows, and infographics — automatically. Paste your text, and Napkin suggests the best visual representation.",
    "whyItMatters": "Aspirants often write brilliant essays and notes but can't visualize them. Napkin turns text explanations of concepts like \"Federalism\", \"Budget Process\", or \"Supply Chain\" into shareable infographics for revision.",
    "steps": [
      {
        "step": 1,
        "title": "Sign up at napkin.ai",
        "desc": "Free account — no credit card needed. Works directly in the browser."
      },
      {
        "step": 2,
        "title": "Paste your text",
        "desc": "Copy any explanation, essay paragraph, or bullet list and paste it into Napkin's editor."
      },
      {
        "step": 3,
        "title": "Click \"Suggest visuals\"",
        "desc": "Napkin's AI analyzes your text and suggests the most appropriate diagram type: flowchart, cycle diagram, comparison table, pyramid."
      },
      {
        "step": 4,
        "title": "Customize",
        "desc": "Change colors, icons, fonts. Add or remove elements. Adjust layout without coding."
      },
      {
        "step": 5,
        "title": "Export",
        "desc": "Download as PNG, SVG, or PDF for your notes, presentations, or social media posts."
      }
    ],
    "prompts": [
      {
        "title": "Constitutional Flow",
        "text": "Explain the process of how a Bill becomes an Act in India in 6 steps. Then visualize it as a flowchart."
      },
      {
        "title": "SWOT Analysis",
        "text": "Create a SWOT analysis of India's agricultural sector. Format as: Strengths: [4 points], Weaknesses: [4], Opportunities: [4], Threats: [4]."
      },
      {
        "title": "Timeline",
        "text": "List the 8 most important milestones of the Indian Independence Movement from 1857 to 1947 in chronological order with dates and brief descriptions."
      }
    ],
    "limitations": "Early access product — some diagram types are limited. Export quality depends on plan. Not ideal for complex technical diagrams.",
    "relatedSlugs": [
      "gamma",
      "canva",
      "claude"
    ]
  },
  {
    "slug": "canva",
    "name": "Canva AI",
    "tagline": "Design anything — posters, resumes, banners — with AI in minutes.",
    "category": "Design",
    "badge": "🎨 Design for All",
    "free": true,
    "url": "https://canva.com",
    "logo": "palette",
    "targetUsers": [
      "Job Seekers",
      "Students",
      "Teachers",
      "Freelancers"
    ],
    "whatIs": "Canva is the world's most popular design platform with built-in AI tools: Magic Write (AI text), Text to Image (AI art), Background Remover, Magic Resize, and 1000+ resume templates. Used by 170 million people in 190 countries.",
    "whyItMatters": "A professionally designed resume, admit card holder, or study infographic can significantly improve your job application impact. Canva's free plan provides everything needed.",
    "steps": [
      {
        "step": 1,
        "title": "Go to canva.com",
        "desc": "Sign up free with Google. Free plan includes 250,000+ templates, 5GB storage, and AI tools."
      },
      {
        "step": 2,
        "title": "Choose a template",
        "desc": "Search \"ATS Resume\" or \"Government Job Cover Letter\" or \"Study Infographic\". Choose a template that fits your need."
      },
      {
        "step": 3,
        "title": "Edit with your details",
        "desc": "Click on any text to edit. Replace placeholder content with your own. Drag elements to reposition."
      },
      {
        "step": 4,
        "title": "Use AI features",
        "desc": "Click \"AI Tools\" → \"Magic Write\" to auto-generate resume bullets or cover letter text. Use \"Text to Image\" for custom illustrations."
      },
      {
        "step": 5,
        "title": "Download",
        "desc": "Download as PDF (Standard or Print-quality), PNG, or share a live link. Always download resume as \"PDF\" format."
      }
    ],
    "prompts": [
      {
        "title": "Resume Bullet Points",
        "text": "Write 4 achievement-focused bullet points for a Civil Engineer with 2 years experience at Maharashtra PWD. Format: [Action verb] + [Task] + [Result/Impact] with numbers."
      },
      {
        "title": "Study Card Copy",
        "text": "Write a 5-box infographic about the key functions of RBI. Each box: [Function Title] + [2-line explanation]. Keep language simple."
      },
      {
        "title": "LinkedIn Summary",
        "text": "Write a 150-word LinkedIn About section for a MPSC aspirant who cleared Mains and is preparing for interview. Tone: confident, professional, passionate about Maharashtra governance."
      }
    ],
    "limitations": "Premium templates and assets require Canva Pro (₹499/month). Print-quality PDF export is free. Some AI features have usage limits on free plan.",
    "relatedSlugs": [
      "napkin",
      "gamma",
      "ideogram"
    ]
  },
  {
    "slug": "ideogram",
    "name": "Ideogram AI",
    "tagline": "AI image generator that actually gets text right — posters, thumbnails, and more.",
    "category": "Design",
    "badge": "🖼️ Text-in-Images",
    "free": true,
    "url": "https://ideogram.ai",
    "logo": "image",
    "targetUsers": [
      "Content Writers",
      "Teachers",
      "Students",
      "Freelancers"
    ],
    "whatIs": "Ideogram is an AI image generator that excels at generating images with readable text — solving the biggest problem with other AI art tools (like DALL-E and Midjourney which garble text). Generate study posters, event flyers, educational thumbnails, and social media graphics with accurate text overlays.",
    "whyItMatters": "Teachers creating study materials, aspirants making motivational study posters, or content creators making YouTube thumbnails can generate professional images with correct text in seconds — no Photoshop needed.",
    "steps": [
      {
        "step": 1,
        "title": "Go to ideogram.ai",
        "desc": "Free plan gives 25 slow-speed images/day. Sign up with Google."
      },
      {
        "step": 2,
        "title": "Write your prompt",
        "desc": "Describe the image in detail. Include the exact text you want: e.g., \"A motivational study poster with bold text 'MPSC 2026 — Keep Going' in saffron color on dark background, Indian flag in corner\"."
      },
      {
        "step": 3,
        "title": "Choose style",
        "desc": "Select a style: Realistic, Design, Anime, 3D, Typography. For posters and thumbnails, use \"Design\" or \"Typography\" mode."
      },
      {
        "step": 4,
        "title": "Generate",
        "desc": "Ideogram generates 4 variations. Pick the best. Click \"Remix\" to make adjustments."
      },
      {
        "step": 5,
        "title": "Download",
        "desc": "Download as PNG for free. Use in Canva, PowerPoint, or your social media."
      }
    ],
    "prompts": [
      {
        "title": "Study Poster",
        "text": "Minimalist study poster, text \"Crack MPSC 2026\" in bold saffron, dark navy background, geometric shapes, professional motivational design, typography style"
      },
      {
        "title": "YouTube Thumbnail",
        "text": "YouTube thumbnail for video \"Top 10 MPSC Tips\", bright orange and white, bold readable title text, Indian government building in background, clean professional design"
      },
      {
        "title": "Infographic Header",
        "text": "Wide banner image for educational infographic on \"Article 370\", light academic background, text \"Understanding Article 370\" in clear black bold font, book and India map icons"
      }
    ],
    "limitations": "Free plan is slow generation (wait queue). Commercial use requires paid plan. Cannot generate copyrighted characters or real people.",
    "relatedSlugs": [
      "canva",
      "napkin",
      "gamma"
    ]
  },
  {
    "slug": "midjourney",
    "name": "Midjourney",
    "tagline": "The world's most powerful AI art generator for premium visuals.",
    "category": "Design",
    "badge": "🎨 Premium",
    "free": false,
    "url": "https://midjourney.com",
    "logo": "auto_awesome",
    "targetUsers": [
      "Content Creators",
      "Educators",
      "YouTubers",
      "Designers"
    ],
    "whatIs": "Midjourney is the gold standard for AI image generation — producing photorealistic, artistic, and illustrative images of the highest quality. Used by professional designers, YouTubers, and educators worldwide for thumbnails, course covers, and visual content. Requires a paid subscription ($10/month).",
    "whyItMatters": "YouTube channel thumbnails made with Midjourney get 3-5x more clicks than generic ones. For educators and content creators building an online brand, Midjourney images immediately signal premium quality.",
    "steps": [
      {
        "step": 1,
        "title": "Subscribe and access",
        "desc": "Go to midjourney.com → Sign in with Discord → Subscribe (Basic plan: $10/month). Use the Midjourney Discord server or the web app at midjourney.com."
      },
      {
        "step": 2,
        "title": "Use the /imagine command",
        "desc": "In Discord: type /imagine and your prompt. On web: paste prompt in the search bar and press enter."
      },
      {
        "step": 3,
        "title": "Write effective prompts",
        "desc": "Best format: [subject] [setting] [style] [lighting] [camera]. Example: \"Indian student studying at desk, warm evening light, photorealistic, DSLR, shallow depth of field\""
      },
      {
        "step": 4,
        "title": "Upscale your image",
        "desc": "Click U1-U4 to upscale your favorite variation. V1-V4 creates new variations. The upscaled image is your final download."
      },
      {
        "step": 5,
        "title": "Use for YouTube/Course content",
        "desc": "Generate consistent character/style images for your YouTube thumbnails or online course cover pages for brand recognition."
      }
    ],
    "prompts": [
      {
        "title": "YouTube Thumbnail",
        "text": "Indian student celebrating success, holding certificate, bright confetti, warm golden light, expression of joy, photorealistic, professional DSLR photo, --ar 16:9 --v 6"
      },
      {
        "title": "Course Cover Art",
        "text": "Futuristic AI education concept, glowing neural network brain, Indian cityscape background, deep blue and orange color scheme, clean modern design, course cover art style, --ar 16:9 --v 6"
      }
    ],
    "limitations": "Paid only ($10-$30/month). Requires Discord account. Learning the prompt language takes a few days. Cannot generate text accurately (use Ideogram for that).",
    "relatedSlugs": [
      "ideogram",
      "canva",
      "gamma"
    ]
  },
  {
    "slug": "cursor",
    "name": "Cursor AI Editor",
    "tagline": "The AI-first code editor — write, edit, and debug code with AI built in.",
    "category": "Dev",
    "badge": "🖥️ AI Code Editor",
    "free": true,
    "url": "https://cursor.sh",
    "logo": "developer_mode",
    "targetUsers": [
      "Software Engineers",
      "CS/IT Students",
      "Tech Job Seekers",
      "Engineering Freshers",
      "Career Switchers"
    ],
    "whatIs": "Cursor is a VS Code fork with GPT-4 and Claude built directly into the editor. Press Ctrl+K to generate code, Tab to autocomplete entire functions, or Ctrl+L to open an AI chat that can read your entire codebase and answer questions about it. Trusted by developers at Stripe, Vercel, and Meta.",
    "whyItMatters": "Tech job seekers can use Cursor to build projects 3-5x faster during their notice period or job search. Cursor understands the full codebase context — it can explain why a bug exists, write tests, and refactor entire functions.",
    "steps": [
      {
        "step": 1,
        "title": "Download Cursor",
        "desc": "Free plan at cursor.sh. Includes 2,000 free autocomplete uses/month and 50 slow GPT-4 requests. Pro is $20/month for unlimited."
      },
      {
        "step": 2,
        "title": "Import your VS Code settings",
        "desc": "Cursor imports all VS Code extensions, themes, and keybindings automatically. Zero learning curve if you already use VS Code."
      },
      {
        "step": 3,
        "title": "Use Ctrl+K for inline generation",
        "desc": "Select any code, press Ctrl+K, and type a natural language instruction: \"Add error handling to this fetch function\" or \"Write a unit test for this function\"."
      },
      {
        "step": 4,
        "title": "Chat with your codebase",
        "desc": "Press Ctrl+L to open AI chat. Add files with @filename. Ask: \"Why is the auth middleware not blocking this route?\" and Cursor reads all relevant files."
      },
      {
        "step": 5,
        "title": "Use .cursorrules",
        "desc": "Create a .cursorrules file in your project root with coding conventions (e.g., \"Always use async/await, never callbacks. Use Tailwind for styling. Follow REST conventions.\"). AI follows your rules."
      }
    ],
    "prompts": [
      {
        "title": ".cursorrules template",
        "text": "Write a .cursorrules file for a Next.js 14 App Router project. Rules: TypeScript only, use server actions for DB mutations, CSS modules for styling, always write JSDoc comments, never use any type, prefer named exports."
      },
      {
        "title": "Bug Investigation Prompt",
        "text": "I have a bug where users are not being redirected after login. The auth middleware is in middleware.ts. Here are the relevant files: [attach files]. What might be causing the redirect to not fire?"
      },
      {
        "title": "Code Review",
        "text": "Review this API route for: 1) Security vulnerabilities, 2) Missing error handling, 3) Performance issues, 4) Code style inconsistencies. Suggest specific improvements with corrected code snippets."
      },
      {
        "title": "Feature Build",
        "text": "Add a [feature name] to this project. Requirements: [list 3-5 requirements]. Use the same code style and patterns already in this project. Create all necessary files."
      }
    ],
    "limitations": "Free plan has monthly limits on GPT-4 requests. Some enterprise codebases need Pro for extended context. Privacy: code is sent to AI APIs — use privacy mode for sensitive codebases.",
    "relatedSlugs": [
      "github-copilot",
      "bolt",
      "v0",
      "antigravity"
    ],
    "weeklyLearningPlan": [
      {
        "day": "Day 1",
        "task": "Download Cursor, open an existing project or clone a GitHub repo, explore the UI"
      },
      {
        "day": "Day 2-3",
        "task": "Practice Ctrl+K on individual functions. Ask it to add comments, fix bugs, improve readability"
      },
      {
        "day": "Day 4-5",
        "task": "Use Ctrl+L chat to understand a codebase you've never seen. Ask \"What does this file do?\" for every file"
      },
      {
        "day": "Day 6-7",
        "task": "Use Composer/Agent mode to build one small complete feature (e.g., \"Add a contact form with email validation\")"
      }
    ]
  },
  {
    "slug": "antigravity",
    "name": "Antigravity (AGY)",
    "tagline": "Google DeepMind's AI coding assistant — the IDE built for agentic AI development.",
    "category": "Dev",
    "badge": "🚀 Elite Tool",
    "free": true,
    "url": "https://antigravity.dev",
    "logo": "rocket_launch",
    "targetUsers": [
      "Software Engineers",
      "AI Developers",
      "Architects",
      "Senior Developers"
    ],
    "whatIs": "Antigravity (AGY) is an AI-powered IDE assistant built by Google DeepMind that goes beyond autocomplete and chat. It can plan multi-file refactors, run background tasks autonomously, maintain long-term project memory (Skills & Rules), and integrate with MCP servers for tool calling. It's designed for agentic AI workflows where the AI is a true pair programmer, not just a suggestion engine.",
    "whyItMatters": "While Cursor helps you write faster, Antigravity helps you architect better. Its Skills system lets you define custom workflows your AI assistant always remembers — e.g., \"always use our DB pattern\", \"never use Tailwind\". For complex multi-service projects, AGY's agent mode can plan and execute across 10+ files with context that persists across sessions.",
    "steps": [
      {
        "step": 1,
        "title": "Install the AGY CLI",
        "desc": "Install via: npm install -g @antigravity/cli or download the AGY IDE extension. Run \"agy init\" in your project directory to start."
      },
      {
        "step": 2,
        "title": "Create a GEMINI.md project rules file",
        "desc": "In your project root, create GEMINI.md (or AGENTS.md). This file is your AI's permanent memory — write your tech stack, coding rules, and architectural decisions here. AGY reads it at the start of every session."
      },
      {
        "step": 3,
        "title": "Create Skills for repeated workflows",
        "desc": "In .agents/skills/[skill-name]/SKILL.md, define specialized prompts for repeated tasks. Example: a \"db-agent\" skill that always writes queries using your specific pgdb.js pattern."
      },
      {
        "step": 4,
        "title": "Use Planning Mode for complex tasks",
        "desc": "For large tasks (new features, refactors), AGY first creates an implementation_plan.md for your review. You approve, then it executes. This prevents AI from going off-track."
      },
      {
        "step": 5,
        "title": "Set up MCP for tool calling",
        "desc": "Configure mcp_config.json to give AGY access to external APIs, databases, and services. The AI can then search the web, run queries, and call APIs autonomously during a task."
      }
    ],
    "prompts": [
      {
        "title": "GEMINI.md Template",
        "text": "# Project AI Rules\n\n## Tech Stack\n- Framework: [Next.js 14 / React / etc.]\n- Database: [PostgreSQL via lib/pgdb.js]\n- Styling: [Vanilla CSS — NO Tailwind]\n\n## Coding Rules\n- All DB access via `query(sql, params)` from lib/pgdb.js\n- Never use placeholder # for links\n- Keep components simple and well-commented\n\n## File Structure\n[Add your key file paths here]"
      },
      {
        "title": "Skill Definition",
        "text": "---\nname: my-feature-agent\ndescription: Instructions for building new features in this project\n---\n\n# Feature Agent\n\nWhen building a new feature:\n1. First read the existing similar component for patterns\n2. Use the existing CSS classes (never create new ones without checking global.css)\n3. Always add an API route in app/api/ with proper validation\n4. Write a brief comment at the top of each new file"
      }
    ],
    "limitations": "Antigravity is a premium tool with a steeper learning curve than Cursor. The Skills and Rules system requires setup investment upfront. Best for complex, long-running projects rather than quick one-off scripts. Requires Google account.",
    "weeklyLearningPlan": [
      {
        "day": "Day 1",
        "task": "Install AGY CLI, create GEMINI.md for an existing project, run your first agy session"
      },
      {
        "day": "Day 2-3",
        "task": "Learn Planning Mode — give AGY a medium task and review the implementation plan before executing"
      },
      {
        "day": "Day 4-5",
        "task": "Create your first Skill file for a repeated workflow in your project"
      },
      {
        "day": "Day 6-7",
        "task": "Set up one MCP integration (e.g., web search or a database tool) and see AGY use it autonomously"
      }
    ],
    "relatedSlugs": [
      "cursor",
      "github-copilot",
      "v0"
    ]
  },
  {
    "slug": "v0",
    "name": "v0.dev",
    "tagline": "Generate full React UI components from text descriptions — instantly.",
    "category": "Dev",
    "badge": "⚡ UI Generator",
    "free": true,
    "url": "https://v0.dev",
    "logo": "code",
    "targetUsers": [
      "Frontend Developers",
      "Full-Stack Devs",
      "Tech Job Seekers",
      "Startup Founders"
    ],
    "whatIs": "v0.dev is Vercel's AI-powered UI generation tool. Describe any UI component or page in plain English and it generates production-ready React + Tailwind CSS code instantly. It can create dashboards, forms, landing pages, card grids, and complex components — all editable.",
    "whyItMatters": "Tech job seekers building portfolio projects can generate professional-looking UIs in minutes. Instead of spending hours on CSS and layout, v0 handles it — letting you focus on backend logic and impressing interviewers with polished projects.",
    "steps": [
      {
        "step": 1,
        "title": "Go to v0.dev",
        "desc": "Sign in with GitHub. Free plan gives 200 credits/month (each generation ≈ 1-10 credits based on complexity)."
      },
      {
        "step": 2,
        "title": "Describe your UI",
        "desc": "Type: \"A responsive job listing card with company logo, job title, location badge, salary range, and apply button. Use a clean modern design.\""
      },
      {
        "step": 3,
        "title": "Preview and iterate",
        "desc": "v0 generates 3-4 variations. Pick the best and say \"Make it darker\" or \"Add a hover animation\" to refine."
      },
      {
        "step": 4,
        "title": "Copy the code",
        "desc": "Click \"Code\" tab to see clean React + Tailwind CSS. Copy and paste into your Next.js project."
      },
      {
        "step": 5,
        "title": "Use as reference",
        "desc": "Even if you don't use the code directly, use v0's output as a design reference and implement it in your own preferred stack."
      }
    ],
    "prompts": [
      {
        "title": "Portfolio Dashboard",
        "text": "Generate a developer portfolio dashboard page with: navigation bar with links, hero section with name and tagline, project cards grid (3 per row), skills section with progress bars, and a contact form. Dark theme. Modern clean design."
      },
      {
        "title": "Job Application Tracker",
        "text": "Create a job application tracker UI with: status columns (Applied, Interview, Offered, Rejected), drag-and-drop cards, search bar, filter by status, and add new application button."
      },
      {
        "title": "Data Table",
        "text": "Generate a responsive data table component with: sortable columns, pagination, search/filter row, row selection checkboxes, and export to CSV button. Use clean minimal design."
      }
    ],
    "limitations": "Generates React + Tailwind by default. Pure HTML/CSS output not supported natively. Free credit limit. Complex multi-page apps need significant editing after generation.",
    "relatedSlugs": [
      "bolt",
      "cursor",
      "github-copilot"
    ]
  },
  {
    "slug": "bolt",
    "name": "Bolt.new",
    "tagline": "Build full-stack web apps from a prompt — in the browser, no setup needed.",
    "category": "Dev",
    "badge": "🔥 Full Stack AI",
    "free": true,
    "url": "https://bolt.new",
    "logo": "bolt",
    "targetUsers": [
      "Developers",
      "Tech Founders",
      "Freelancers",
      "Tech Job Seekers"
    ],
    "whatIs": "Bolt.new by StackBlitz is an AI-powered full-stack development environment that runs entirely in your browser. Describe your app idea, and Bolt builds it — React frontend, Node.js backend, database, and deployment. No local setup, no npm install. Just describe and build.",
    "whyItMatters": "Tech aspirants and developers can build portfolio projects in hours instead of days. Describe \"a simple job tracker app with user auth, PostgreSQL, and REST API\" and Bolt scaffolds the entire project ready to deploy.",
    "steps": [
      {
        "step": 1,
        "title": "Go to bolt.new",
        "desc": "Free plan gives 150,000 tokens/day. No signup required for basic use — works instantly in the browser."
      },
      {
        "step": 2,
        "title": "Describe your app",
        "desc": "Type: \"Build a Next.js app for an MPSC quiz practice platform. Include: question bank, score tracker, MCQ interface, and a leaderboard. Use SQLite and Tailwind CSS.\""
      },
      {
        "step": 3,
        "title": "Watch it build",
        "desc": "Bolt generates the entire file structure, code, and starts a live preview server in the browser. No installation needed."
      },
      {
        "step": 4,
        "title": "Edit conversationally",
        "desc": "Say \"Add authentication with NextAuth\" or \"Make the dashboard mobile responsive\" and Bolt modifies the existing code."
      },
      {
        "step": 5,
        "title": "Deploy",
        "desc": "Click \"Deploy\" to push directly to Netlify or export as a ZIP to deploy anywhere."
      }
    ],
    "prompts": [
      {
        "title": "MPSC Quiz App",
        "text": "Build a React web app for MPSC exam practice. Features: MCQ question set by topic, timer for each question, score summary at end, mark-for-review, and a progress chart. Store data in localStorage. Clean saffron and white design."
      },
      {
        "title": "Portfolio API",
        "text": "Create a Node.js REST API with Express for a developer portfolio. Endpoints: GET /projects, GET /skills, POST /contact (sends email). Include a simple JSON file as data store. Add CORS and rate limiting."
      },
      {
        "title": "Job Tracker",
        "text": "Build a full-stack Next.js job application tracker. Users can add jobs with: company, role, status (Applied/Interview/Offer/Rejected), date, and notes. Use SQLite with better-sqlite3. Include filtering and statistics chart."
      }
    ],
    "limitations": "Free token limit resets daily. Complex large apps may hit context limits. Generated code quality varies — always review before production. GitHub integration requires paid plan.",
    "relatedSlugs": [
      "v0",
      "cursor",
      "github-copilot"
    ]
  },
  {
    "slug": "github-copilot",
    "name": "GitHub Copilot",
    "tagline": "AI autocomplete built into VS Code — every developer's essential tool.",
    "category": "Dev",
    "badge": "🛠️ Essential",
    "free": false,
    "url": "https://github.com/features/copilot",
    "logo": "terminal",
    "targetUsers": [
      "All Developers",
      "Engineering Students",
      "Open Source Contributors"
    ],
    "whatIs": "GitHub Copilot is the industry-standard AI coding assistant — integrated into VS Code, JetBrains, Neovim, and more. It suggests entire functions, generates tests, explains code, and fixes bugs in-editor. Used by 1.8 million developers worldwide. Available free for students via GitHub Education Pack.",
    "whyItMatters": "Copilot is what every interviewer assumes you use. Knowing how to use Copilot effectively (not just accepting suggestions blindly) is an expected skill at most tech companies in 2025-26.",
    "steps": [
      {
        "step": 1,
        "title": "Get free access",
        "desc": "Students: Go to education.github.com → Apply for GitHub Education Pack (free Copilot + many other tools). Professionals: $10/month."
      },
      {
        "step": 2,
        "title": "Install VS Code extension",
        "desc": "In VS Code → Extensions → Search \"GitHub Copilot\" → Install. Sign in with your GitHub account."
      },
      {
        "step": 3,
        "title": "Use Tab to accept suggestions",
        "desc": "Start typing any function or comment — Copilot auto-suggests the rest. Press Tab to accept, Esc to dismiss. Write a comment describing what you want and Copilot writes the code."
      },
      {
        "step": 4,
        "title": "Use Copilot Chat",
        "desc": "Open Copilot Chat panel (Ctrl+Shift+I) for conversation-style help: \"Explain this code\", \"Write a unit test for this function\", \"What's the bug here?\"."
      },
      {
        "step": 5,
        "title": "Use Agent mode for features",
        "desc": "Copilot Agent (available in VS Code 1.90+) can make multi-file changes like Cursor. Use it for: \"Add authentication to this Express app\" or \"Migrate this from JS to TypeScript\"."
      }
    ],
    "prompts": [
      {
        "title": "Comment-driven coding",
        "text": "// Function to validate Indian phone number: must be 10 digits, start with 6-9\n// Returns: { valid: boolean, formatted: string }\nfunction validateIndianPhone(phone) {"
      },
      {
        "title": "Test generation",
        "text": "Write comprehensive Jest unit tests for the following function. Cover: happy path, edge cases, invalid inputs, and error handling."
      },
      {
        "title": "Algorithm & Complexity Optimization",
        "text": "Analyze this algorithm for time and space complexity in Big-O notation. Suggest an optimized approach that reduces time complexity from O(n^2) to O(n log n) or O(n), and provide the refactored code with explanatory comments."
      }
    ],
    "limitations": "Not free (except for students). Suggestions can be wrong — always review. May suggest deprecated or insecure code patterns. For complex multi-file architecture, Cursor or Antigravity are more powerful.",
    "relatedSlugs": [
      "cursor",
      "antigravity",
      "v0",
      "bolt"
    ]
  },
  {
    "slug": "otter",
    "name": "Otter.ai",
    "tagline": "AI meeting notes — transcribes audio to searchable text in real-time.",
    "category": "Productivity",
    "badge": "🎙️ Auto-Transcribe",
    "free": true,
    "url": "https://otter.ai",
    "logo": "mic",
    "targetUsers": [
      "Students",
      "Researchers",
      "Job Seekers",
      "Coaching Center Students"
    ],
    "whatIs": "Otter.ai is an AI transcription tool that converts audio (live meetings, YouTube videos, recorded lectures, interviews) into searchable, editable text with speaker identification. Free plan gives 600 minutes of transcription per month.",
    "whyItMatters": "Coaching class students and MPSC aspirants attending YouTube live sessions can auto-transcribe entire lectures in real-time. Instead of frantically taking notes, Otter captures everything so you can focus on listening.",
    "steps": [
      {
        "step": 1,
        "title": "Install Otter.ai",
        "desc": "Download from otter.ai or install the Chrome extension. Sign up free — 600 min/month included."
      },
      {
        "step": 2,
        "title": "Import audio/video",
        "desc": "Upload an MP3/MP4 of a coaching lecture, or paste a YouTube URL. Otter transcribes it in minutes."
      },
      {
        "step": 3,
        "title": "Join live sessions",
        "desc": "During a Zoom/Google Meet class, open Otter and click \"Record\" — it joins the call and auto-transcribes in real-time."
      },
      {
        "step": 4,
        "title": "Search your notes",
        "desc": "After transcription, search any keyword (e.g., \"Article 356\") across all your saved recordings."
      },
      {
        "step": 5,
        "title": "Export for revision",
        "desc": "Export transcripts as PDF or Word. Use AI Summary to get key points from a 2-hour lecture in 10 bullets."
      }
    ],
    "prompts": [
      {
        "title": "Lecture Summary",
        "text": "I will paste a transcript of an MPSC lecture. Summarize it in: 1) Key concepts covered (bullet list), 2) Important facts/numbers mentioned, 3) 5 MCQ-style questions based on the content."
      },
      {
        "title": "Interview Notes",
        "text": "I recorded my mock MPSC interview. The transcript is below. Identify: 1) Questions I answered weakly (where I was vague), 2) My strongest answers, 3) 3 suggestions for improvement."
      },
      {
        "title": "Group Study Summary",
        "text": "Transcribe this group discussion session and identify: 1) The main arguments made by each speaker, 2) Consensus points, 3) Areas of disagreement, 4) Final summary of conclusions."
      }
    ],
    "limitations": "Free plan: 600 min/month, max 40 min per recording. Background noise reduces accuracy. Speaker identification may confuse voices in noisy environments.",
    "relatedSlugs": [
      "notebooklm",
      "elevenlabs",
      "tldv"
    ]
  },
  {
    "slug": "tldv",
    "name": "tl;dv",
    "tagline": "AI that records, summarizes, and clips your online meetings instantly.",
    "category": "Productivity",
    "badge": "⚡ Meeting AI",
    "free": true,
    "url": "https://tldv.io",
    "logo": "video_call",
    "targetUsers": [
      "Job Seekers",
      "Researchers",
      "Students",
      "Professionals"
    ],
    "whatIs": "tl;dv (Too Long; Didn't View) is an AI meeting recorder for Zoom and Google Meet that automatically creates summaries, highlights key moments, and lets you clip important segments. Free plan includes unlimited recordings.",
    "whyItMatters": "Job seekers who attend HR briefings, online coaching sessions, or informational interviews can automatically capture and summarize everything discussed — so they can focus on the conversation instead of frantic note-taking.",
    "steps": [
      {
        "step": 1,
        "title": "Install tl;dv extension",
        "desc": "Chrome extension from tldv.io. Free plan — unlimited recording. Connect your Google account."
      },
      {
        "step": 2,
        "title": "Join your meeting",
        "desc": "When you start a Zoom or Google Meet, tl;dv automatically starts recording. Attendees are notified (for transparency)."
      },
      {
        "step": 3,
        "title": "Get AI summary",
        "desc": "After the meeting, tl;dv sends you an AI-generated summary with: key decisions, action items, and notable moments."
      },
      {
        "step": 4,
        "title": "Create clips",
        "desc": "Highlight any 30-second segment and share as a clip. Useful for sharing a specific answer or important section with teammates."
      },
      {
        "step": 5,
        "title": "Search across all calls",
        "desc": "Search any word across all your recorded meetings. Find \"UPSC strategy\" mentioned in any past session instantly."
      }
    ],
    "prompts": [
      {
        "title": "Interview Debrief",
        "text": "Here is the transcript of my job interview at [company]. Identify: 1) Questions I was asked, 2) My answers (as quoted), 3) Red flags in my responses, 4) Specific improvements for next time."
      },
      {
        "title": "Meeting Action Items",
        "text": "Summarize this meeting transcript and extract: 1) All action items with owner and deadline, 2) Key decisions made, 3) Open questions that need follow-up, 4) Next meeting agenda items."
      },
      {
        "title": "Coaching Session Notes",
        "text": "Transcribe the key strategies discussed in this coaching session. Create a structured study plan based on the mentor's recommendations."
      }
    ],
    "limitations": "Free plan includes unlimited recording but limited AI features. Speaker detection works best with clear audio. Zoom integration requires host permission.",
    "relatedSlugs": [
      "otter",
      "notebooklm",
      "chatgpt"
    ]
  },
  {
    "slug": "poe",
    "name": "Poe by Quora",
    "tagline": "Access Claude, GPT-4, Gemini, and 100+ AI models in one app — for free.",
    "category": "AI Hub",
    "badge": "🧩 Multi-Model",
    "free": true,
    "url": "https://poe.com",
    "logo": "hub",
    "targetUsers": [
      "All Users",
      "Students",
      "Developers",
      "Researchers"
    ],
    "whatIs": "Poe is a platform by Quora that gives you access to multiple AI models in one place: Claude 3.5 Sonnet, GPT-4o, Gemini, Llama 3, Mistral, and 100+ others. The free plan gives daily credits usable across all models — letting you compare which AI is best for a specific task.",
    "whyItMatters": "Instead of paying for multiple AI subscriptions, Poe gives you a daily allowance to use the best model for each task — Claude for writing, GPT-4o for coding, Llama for longer context.",
    "steps": [
      {
        "step": 1,
        "title": "Download Poe",
        "desc": "Available on iOS, Android, and poe.com. Sign up free with Google. Daily message limits refresh every 24 hours."
      },
      {
        "step": 2,
        "title": "Choose your model",
        "desc": "For creative writing: Claude. For web search: GPT-4o or Gemini. For coding: GPT-4o or Llama. For long documents: Claude 200k."
      },
      {
        "step": 3,
        "title": "Create a custom bot",
        "desc": "Go to \"Create Bot\" → add a system prompt → share it. Great for creating a dedicated MPSC Tutor bot."
      },
      {
        "step": 4,
        "title": "Compare model outputs",
        "desc": "Ask the same question to Claude and GPT-4 side by side to see which gives a better answer for your use case."
      },
      {
        "step": 5,
        "title": "Use voice input",
        "desc": "On mobile, tap the microphone to ask questions verbally — useful for studying while commuting."
      }
    ],
    "prompts": [
      {
        "title": "Model Comparison Test",
        "text": "Try this prompt on Claude AND GPT-4o: \"Explain the difference between Lok Sabha and Rajya Sabha for an 8th grader in 5 bullet points.\" Compare which explanation is clearer."
      },
      {
        "title": "Document Analysis",
        "text": "I will paste a Maharashtra government circular. Identify: 1) What rule is changing, 2) Effective date, 3) Who is affected, 4) Action required by applicants. Circular: [paste text]"
      },
      {
        "title": "Custom Study Bot Prompt",
        "text": "System prompt for your MPSC bot: \"You are an expert MPSC tutor. Always give examples from Maharashtra. Keep explanations under 150 words. End each answer with one exam-style MCQ on the topic.\""
      }
    ],
    "limitations": "Free daily credits are limited (varies by model). Claude 3.5 Opus and GPT-4 Turbo use more credits. Paid plan is $19.99/month.",
    "relatedSlugs": [
      "gemini",
      "chatgpt",
      "claude"
    ]
  },
  {
    "slug": "huggingface",
    "name": "Hugging Face",
    "tagline": "The GitHub of AI — 900,000+ open-source models, free to run and explore.",
    "category": "Dev",
    "badge": "🤗 Open Source AI",
    "free": true,
    "url": "https://huggingface.co",
    "logo": "model_training",
    "targetUsers": [
      "AI/ML Researchers",
      "Developers",
      "Data Scientists",
      "GATE CS Aspirants"
    ],
    "whatIs": "Hugging Face is the world's largest platform for open-source AI models — NLP, computer vision, speech, and more. It hosts 900,000+ models including Llama 3, Mistral, BERT, Stable Diffusion, and Whisper. Run them free in \"Spaces\" (hosted apps) or download for local use.",
    "whyItMatters": "AI/ML engineers and data scientists can prototype and demo AI models for free on Hugging Face Spaces — without needing a GPU or server. This is essential for building a portfolio that stands out in AI/ML job interviews.",
    "steps": [
      {
        "step": 1,
        "title": "Create account at huggingface.co",
        "desc": "Free account. Browse 900,000+ models, 200,000+ datasets, and 300,000+ demo apps (Spaces)."
      },
      {
        "step": 2,
        "title": "Explore Spaces",
        "desc": "Go to \"Spaces\" to find interactive demos of AI models — text summarization, image generation, speech recognition, translation. Run them directly in browser, no setup."
      },
      {
        "step": 3,
        "title": "Use Inference API",
        "desc": "Free API to run models like BERT, Llama, Whisper via HTTP requests. Great for prototyping AI features in your projects."
      },
      {
        "step": 4,
        "title": "Deploy your own Space",
        "desc": "Create a Gradio or Streamlit app that uses an AI model. Hugging Face hosts it for free on the Spaces platform — perfect for a portfolio project."
      },
      {
        "step": 5,
        "title": "Fine-tune models",
        "desc": "Use the AutoTrain feature to fine-tune existing models on your own dataset — no ML expertise required. Upload CSV, select model, train."
      }
    ],
    "prompts": [
      {
        "title": "Portfolio Space Idea",
        "text": "I want to build a Hugging Face Space for my portfolio. I have a dataset of 500 Maharashtra exam question MCQs. Suggest: 1) The best model to fine-tune, 2) How to build a simple quiz app using Gradio, 3) Key features that would impress an ML interviewer."
      },
      {
        "title": "Model Selection",
        "text": "I need to build a system that classifies customer support tickets in Hindi and English. What HuggingFace models should I use? Compare 3 options for accuracy, speed, and memory requirements."
      },
      {
        "title": "Interview Prep",
        "text": "I have an ML Engineer interview. What are the 10 most important Hugging Face / Transformers library concepts I must know? Include code examples for each."
      }
    ],
    "limitations": "Free Spaces have GPU limits and may sleep after inactivity. Large model downloads require significant storage. Some proprietary models (Llama, Gemma) require accepting license terms.",
    "relatedSlugs": [
      "cursor",
      "bolt",
      "chatgpt"
    ]
  },
  {
    "slug": "elicit",
    "name": "Elicit",
    "tagline": "Analyze research papers, synthesize evidence, and extract data from 125M+ papers.",
    "category": "Research",
    "badge": "🔬 AI Literature Review",
    "free": true,
    "url": "https://elicit.com",
    "logo": "science",
    "targetUsers": [
      "UPSC Aspirants",
      "PhD Scholars",
      "Policy Researchers",
      "Essay Prep"
    ],
    "whatIs": "Elicit is an AI research assistant built specifically for academic literature reviews. It searches across 125 million peer-reviewed papers, summarizes the findings of the top relevant papers, extracts key metrics into a customizable comparison table, and cites every claim with direct excerpts.",
    "whyItMatters": "For UPSC Mains GS2, GS3, and Essay papers, citing empirical research and government policy studies makes your answers stand out from generic coaching notes. Elicit lets you find credible evidence in minutes.",
    "steps": [
      {
        "step": 1,
        "title": "Enter a research question",
        "desc": "Go to elicit.com and enter a specific question like \"What is the impact of direct benefit transfers on rural poverty in India?\""
      },
      {
        "step": 2,
        "title": "Review paper summaries",
        "desc": "Elicit displays top papers with a 1-sentence abstract summary for each and a synthesized overview answering your question."
      },
      {
        "step": 3,
        "title": "Add columns for data extraction",
        "desc": "Add columns like \"Sample Size\", \"Outcomes Measured\", and \"Main Findings\" — Elicit fills them automatically from the PDFs."
      },
      {
        "step": 4,
        "title": "Extract quotes & citations",
        "desc": "Click any cell to see the exact paragraph from the original paper verifying the claim."
      },
      {
        "step": 5,
        "title": "Export for your notes",
        "desc": "Export the synthesized table to CSV or copy key findings directly into your study notes."
      }
    ],
    "prompts": [
      {
        "title": "Policy Impact Review",
        "text": "What does academic empirical research say about the impact of digital land records on agricultural credit in developing economies?"
      },
      {
        "title": "UPSC Mains Evidence Builder",
        "text": "Find peer-reviewed studies evaluating the effectiveness of mid-day meal schemes on female literacy and school retention rates in India."
      },
      {
        "title": "Data Extraction Prompt",
        "text": "Extract: 1) methodology used, 2) primary sample location, and 3) key quantitative results from these papers."
      }
    ],
    "limitations": "Free plan provides 5,000 one-time credits. Advanced extraction and high-volume querying require a subscription. Best for scientific, economic, and policy studies.",
    "relatedSlugs": [
      "consensus",
      "perplexity",
      "semantic-scholar"
    ]
  },
  {
    "slug": "connected-papers",
    "name": "Connected Papers",
    "tagline": "Visual exploration of academic papers and citation networks in an interactive graph.",
    "category": "Research",
    "badge": "🕸️ Visual Knowledge Graph",
    "free": true,
    "url": "https://www.connectedpapers.com",
    "logo": "hub",
    "targetUsers": [
      "UPSC Optionals",
      "Higher Education",
      "M.Tech / PhD Researchers"
    ],
    "whatIs": "Connected Papers is a visual discovery tool that builds a 2D graph of academic papers related to your topic. Papers with similar concepts and citations cluster together, helping you visually discover seminal works, prior foundational research, and latest derivative papers.",
    "whyItMatters": "When studying complex subjects like Economics, Public Administration, or Sociology for civil services optionals, Connected Papers reveals the most influential foundational texts and how recent debates evolved.",
    "steps": [
      {
        "step": 1,
        "title": "Search a seminal paper or topic",
        "desc": "Enter an influential paper title or DOI (e.g. on renewable energy policy, fiscal federalism, or machine learning)."
      },
      {
        "step": 2,
        "title": "Explore the graph",
        "desc": "Nodes are papers. Node size indicates number of citations. Color intensity reflects publication year. Proximity shows topical similarity."
      },
      {
        "step": 3,
        "title": "Find Prior Works",
        "desc": "Click \"Prior Works\" to identify the foundational ancestor papers that all modern papers cite."
      },
      {
        "step": 4,
        "title": "Find Derivative Works",
        "desc": "Click \"Derivative Works\" to see recent literature reviews that synthesize the entire field."
      },
      {
        "step": 5,
        "title": "Build reading list",
        "desc": "Save key papers to your bibliography for deep reading."
      }
    ],
    "prompts": [
      {
        "title": "Literature Discovery",
        "text": "Trace the foundational academic lineage of agricultural supply chain reforms and price volatility mechanisms."
      },
      {
        "title": "Review Paper Finder",
        "text": "Identify the top 3 most comprehensive survey papers on climate resilience in semi-arid agriculture."
      }
    ],
    "limitations": "Free tier limits you to 5 graph generations per month. Requires basic understanding of citation networks.",
    "relatedSlugs": [
      "elicit",
      "consensus",
      "semantic-scholar"
    ]
  },
  {
    "slug": "scite",
    "name": "Scite.ai",
    "tagline": "Smart citations: check whether scientific claims are supported or refuted by evidence.",
    "category": "Research",
    "badge": "✅ Smart Citations",
    "free": true,
    "url": "https://scite.ai",
    "logo": "verified",
    "targetUsers": [
      "UPSC Mains Aspirants",
      "Academic Researchers",
      "Fact-Checkers"
    ],
    "whatIs": "Scite is an award-winning platform that evaluates how research papers cite each other. Instead of just counting citations, Scite analyzes citation context and classifies them into \"Supporting\", \"Contrasting\", or \"Mentioning\" evidence.",
    "whyItMatters": "Prevents you from quoting debunked studies or outdated theories in exam essays and interviews. Allows you to quote verified, consensus-backed facts.",
    "steps": [
      {
        "step": 1,
        "title": "Search a claim or study",
        "desc": "Search for any topic (e.g., universal basic income, groundwater depletion in Punjab)."
      },
      {
        "step": 2,
        "title": "Check Smart Citations (SmartCites)",
        "desc": "View how many subsequent peer-reviewed papers have supported or contrasted the findings."
      },
      {
        "step": 3,
        "title": "Read citation context",
        "desc": "See the exact sentence where other authors cite the study — whether they validated the method or found opposite results."
      },
      {
        "step": 4,
        "title": "Use Assistant",
        "desc": "Ask Scite Assistant factual questions; it answers using only verified, supported scientific literature."
      },
      {
        "step": 5,
        "title": "Cite with confidence",
        "desc": "Use verified citations in your exam answer writing."
      }
    ],
    "prompts": [
      {
        "title": "Claim Verification",
        "text": "Is there academic consensus on the long-term economic returns of government investment in early childhood nutrition programs?"
      },
      {
        "title": "Debate Balancer",
        "text": "Provide balanced empirical evidence supporting and contrasting the privatization of public sector banks in emerging economies."
      }
    ],
    "limitations": "Full search and assistant features require a paid subscription after 7-day free trial. Best for academic and scientific claims.",
    "relatedSlugs": [
      "elicit",
      "consensus",
      "perplexity"
    ]
  },
  {
    "slug": "semantic-scholar",
    "name": "Semantic Scholar",
    "tagline": "Free AI-powered scientific literature search engine by the Allen Institute for AI.",
    "category": "Research",
    "badge": "📚 100% Free AI Search",
    "free": true,
    "url": "https://www.semanticscholar.org",
    "logo": "school",
    "targetUsers": [
      "All Aspirants",
      "College Students",
      "Scholars",
      "Educators"
    ],
    "whatIs": "Semantic Scholar is a free, non-profit AI-backed research platform developed by the Allen Institute for AI. It indexes over 200 million academic papers and provides AI-generated TLDRs (one-sentence summaries), citation velocity, and influential citation tracking.",
    "whyItMatters": "100% completely free forever. You can read high-impact 1-sentence TLDRs of dense papers without wasting hours downloading paywalled articles.",
    "steps": [
      {
        "step": 1,
        "title": "Search keywords",
        "desc": "Search any academic topic, author, or conference."
      },
      {
        "step": 2,
        "title": "Read TLDR summaries",
        "desc": "Skim the 1-sentence AI-generated summary underneath each paper title."
      },
      {
        "step": 3,
        "title": "Filter by Highly Influential Citations",
        "desc": "Filter results to see only papers that meaningfully changed the trajectory of the field."
      },
      {
        "step": 4,
        "title": "Create Research Feeds",
        "desc": "Set up alerts for new research in your optional subject areas."
      },
      {
        "step": 5,
        "title": "Export BibTeX / APA",
        "desc": "Export citations cleanly for your notes and bibliography."
      }
    ],
    "prompts": [
      {
        "title": "Fast Topic Overview",
        "text": "Find the most influential papers published in the last 3 years on artificial intelligence applications in Indian agriculture."
      }
    ],
    "limitations": "Focuses strictly on published academic papers and preprints, not current daily news or general web content.",
    "relatedSlugs": [
      "elicit",
      "consensus",
      "connected-papers"
    ]
  },
  {
    "slug": "deepseek",
    "name": "DeepSeek (R1 & V3)",
    "tagline": "State-of-the-art open reasoning model — brilliant for CSAT, quantitative math, and logic.",
    "category": "Study",
    "badge": "🧠 Open Reasoning King",
    "free": true,
    "url": "https://chat.deepseek.com",
    "logo": "psychology",
    "targetUsers": [
      "CSAT Aspirants",
      "Banking Quant Prep",
      "GATE CSE",
      "Engineering Students"
    ],
    "whatIs": "DeepSeek is a frontier open-weights AI model created by DeepSeek AI. The DeepSeek-R1 model features breakthrough chain-of-thought reasoning that matches or exceeds OpenAI o1 on math, coding, and logical deduction benchmarks — completely free to use.",
    "whyItMatters": "CSAT Paper 2 and Banking Quantitative Aptitude require step-by-step mathematical reasoning. DeepSeek-R1 exposes its exact \"Thinking Process\", showing you how to dissect complex word problems, probability, and syllogisms.",
    "steps": [
      {
        "step": 1,
        "title": "Open chat.deepseek.com",
        "desc": "Sign up free. On the prompt bar, click \"DeepThink (R1)\" to turn on advanced reasoning mode."
      },
      {
        "step": 2,
        "title": "Paste challenging aptitude questions",
        "desc": "Paste past-year CSAT or IBPS math questions, seating arrangements, or data sufficiency problems."
      },
      {
        "step": 3,
        "title": "Expand \"Thought Process\"",
        "desc": "Click to view the model's internal thought chain to understand why certain steps were taken."
      },
      {
        "step": 4,
        "title": "Ask for shortcut techniques",
        "desc": "Ask \"Now show me how to solve this under 60 seconds using Vedic math or elimination tricks.\""
      },
      {
        "step": 5,
        "title": "Generate practice variants",
        "desc": "Ask DeepSeek to create 5 similar problems with changed numbers to test your mastery."
      }
    ],
    "prompts": [
      {
        "title": "CSAT Seating Arrangement Breakdown",
        "text": "Eight persons A through H are seated around a circular table facing the center... [paste problem]. Solve this step-by-step explaining every deduction clearly. Include a text diagram of the final arrangement."
      },
      {
        "title": "Banking Quant Shortcut Tutor",
        "text": "Solve this pipe-and-cistern question step-by-step: [paste problem]. After the rigorous proof, provide the 30-second formula or ratio method an aspirant should memorize."
      },
      {
        "title": "Logical Syllogism Validator",
        "text": "Evaluate whether Conclusion I and II follow from the given Statements using Venn diagrams and formal logic rules: [paste statements]."
      }
    ],
    "limitations": "High server demand during peak hours can occasionally cause slower responses. Focused heavily on reasoning and coding rather than conversational banter.",
    "relatedSlugs": [
      "notebooklm",
      "claude",
      "perplexity"
    ]
  },
  {
    "slug": "chatpdf",
    "name": "ChatPDF",
    "tagline": "Instant document chat for exam syllabus, official gazettes, and standard textbooks.",
    "category": "Study",
    "badge": "📄 Lightweight PDF Assistant",
    "free": true,
    "url": "https://www.chatpdf.com",
    "logo": "description",
    "targetUsers": [
      "State PSC Aspirants",
      "Police Bharti Candidates",
      "Students on Mobile"
    ],
    "whatIs": "ChatPDF is a lightweight, zero-setup AI tool that lets you drop in any PDF and chat with it instantly. No complicated workspace setup or notebook creation required. It provides fast summaries, key dates extraction, and answers questions with direct page references.",
    "whyItMatters": "When a new 80-page government recruitment gazette is released, drop it into ChatPDF on your phone to instantly know eligibility dates, application fees, vacancy breakdown, and physical test criteria.",
    "steps": [
      {
        "step": 1,
        "title": "Drop your PDF",
        "desc": "Go to chatpdf.com and drag-and-drop your PDF (up to 120 pages on free tier)."
      },
      {
        "step": 2,
        "title": "Instant suggested questions",
        "desc": "ChatPDF automatically suggests 3 relevant questions based on the document contents."
      },
      {
        "step": 3,
        "title": "Ask in any language",
        "desc": "Ask questions in Marathi, Hindi, or English — ChatPDF extracts the answer directly from the English/Marathi gazette."
      },
      {
        "step": 4,
        "title": "Click page citations",
        "desc": "Click the source link next to each answer to highlight the exact paragraph in the document."
      },
      {
        "step": 5,
        "title": "Export chat history",
        "desc": "Save or share the question-answer thread with study group peers."
      }
    ],
    "prompts": [
      {
        "title": "Gazette Quick Scan",
        "text": "What is the last date to apply, the application fee for reserved categories, and the minimum age requirement mentioned in this notification?"
      },
      {
        "title": "Syllabus Chapter Checklist",
        "text": "List all specific topics mentioned under General Studies Paper 1 in bullet points."
      }
    ],
    "limitations": "Free tier allows up to 2 PDFs/day (up to 120 pages each). For heavy multi-document cross-referencing, Google NotebookLM is recommended.",
    "relatedSlugs": [
      "notebooklm",
      "claude",
      "anki"
    ]
  },
  {
    "slug": "phind",
    "name": "Phind",
    "tagline": "Intelligent search engine built for developers, IT officers, and technical subjects.",
    "category": "Dev",
    "badge": "⚡ Developer Search Engine",
    "free": true,
    "url": "https://www.phind.com",
    "logo": "terminal",
    "targetUsers": [
      "IBPS IT Officer Aspirants",
      "GATE CSE",
      "NIC/CDAC Candidates",
      "Programmers"
    ],
    "whatIs": "Phind is an AI search engine customized for developers and engineers. It understands programming syntax, technical documentation, API specifications, and troubleshooting errors, providing complete working code snippets with cited sources.",
    "whyItMatters": "Aspirants preparing for technical posts like IBPS SO (IT Officer), NIC Scientist B, or PSU computer engineering examinations can quickly master SQL queries, OS concepts, and networking protocols.",
    "steps": [
      {
        "step": 1,
        "title": "Search technical question",
        "desc": "Enter any programming or system question (e.g., \"Difference between B-tree and B+ tree indexing in PostgreSQL\")."
      },
      {
        "step": 2,
        "title": "Select answer mode",
        "desc": "Choose \"Default\" for fast answers or \"Detailed\" with step-by-step code architecture."
      },
      {
        "step": 3,
        "title": "Inspect code snippets",
        "desc": "Phind writes fully syntax-highlighted code with line-by-line explanations."
      },
      {
        "step": 4,
        "title": "Follow-up on edge cases",
        "desc": "Ask about worst-case time complexity, concurrency locking, or edge-case handling."
      }
    ],
    "prompts": [
      {
        "title": "Database Indexing Interview Prep",
        "text": "Explain how clustered vs non-clustered indexes work internally in RDBMS with ASCII diagrams and time complexity."
      },
      {
        "title": "Computer Networks Protocol Breakdown",
        "text": "Explain the 3-way handshake in TCP/IP and how SYN flood attacks are mitigated, formatted for an IT Officer exam answer."
      }
    ],
    "limitations": "Optimized strictly for technical, computer science, and engineering queries. Less suited for humanities or current affairs.",
    "relatedSlugs": [
      "cursor",
      "antigravity",
      "v0"
    ]
  },
  {
    "slug": "julius",
    "name": "Julius AI",
    "tagline": "AI data analyst: solve data interpretation, graph analysis, and statistics problems.",
    "category": "Productivity",
    "badge": "📊 Data Interpretation Pro",
    "free": true,
    "url": "https://julius.ai",
    "logo": "analytics",
    "targetUsers": [
      "Banking DI Aspirants",
      "RBI Grade B",
      "Economics Scholars",
      "Data Students"
    ],
    "whatIs": "Julius AI is a conversational data analyst that connects to Excel spreadsheets, CSVs, and data tables. It automatically analyzes datasets, computes complex statistics, generates charts, and explains mathematical findings in plain language.",
    "whyItMatters": "Data Interpretation (DI) is the highest-weightage section in Banking and RBI exams. Julius teaches you how to quickly spot percentages, trends, and growth rates in complex tabular data.",
    "steps": [
      {
        "step": 1,
        "title": "Upload table or spreadsheet",
        "desc": "Upload any Excel file or paste table data (like budget allocations or economic survey tables)."
      },
      {
        "step": 2,
        "title": "Ask analytical questions",
        "desc": "Type \"Which sector had the highest compound growth rate between 2020 and 2025?\""
      },
      {
        "step": 3,
        "title": "Generate charts",
        "desc": "Ask Julius to create bar charts, scatter plots, or trendlines to visualize the numbers."
      },
      {
        "step": 4,
        "title": "Inspect Python code",
        "desc": "See the exact Python Pandas/Matplotlib code used to calculate the answer."
      }
    ],
    "prompts": [
      {
        "title": "Economic Survey Table Analysis",
        "text": "Analyze this table of state-wise tax devolution. Calculate the percentage change year-over-year and identify the top 3 gainers."
      },
      {
        "title": "Banking DI Math Practice",
        "text": "Given this production vs sales table for 5 companies, calculate the ratio of total unsold stock to total produced stock."
      }
    ],
    "limitations": "Free tier offers 15 messages/month. Advanced regression modeling and export require premium.",
    "relatedSlugs": [
      "deepseek",
      "perplexity",
      "gamma"
    ]
  },
  {
    "slug": "gemini",
    "name": "Google Gemini",
    "tagline": "Google's most capable AI — free, fast, and connected to the web.",
    "category": "AI Hub",
    "badge": "🔵 Google AI",
    "free": true,
    "url": "https://gemini.google.com",
    "logo": "auto_awesome",
    "targetUsers": [
      "All Users",
      "MPSC/UPSC Aspirants",
      "Students",
      "Job Seekers"
    ],
    "whatIs": "Gemini is Google's flagship AI assistant (successor to Bard). Available free at gemini.google.com, it can write, summarize, explain, code, analyze images, and search the web in real-time. Gemini 1.5 Flash handles up to 1 million tokens — meaning you can paste an entire textbook chapter.",
    "whyItMatters": "Unlike ChatGPT which has a knowledge cutoff, Gemini can search current government notifications, latest exam updates, and today's news — making it uniquely useful for current affairs preparation.",
    "steps": [
      {
        "step": 1,
        "title": "Go to gemini.google.com",
        "desc": "Sign in with your Google account. No installation needed. Works on mobile and desktop."
      },
      {
        "step": 2,
        "title": "Enable Workspace features",
        "desc": "Connect Gemini to Google Drive, Gmail, and Docs for enhanced context. Useful for analyzing your own study notes."
      },
      {
        "step": 3,
        "title": "Ask web-connected questions",
        "desc": "Ask \"What were the latest MPSC notifications this week?\" — Gemini will search and summarize real results."
      },
      {
        "step": 4,
        "title": "Analyze images and PDFs",
        "desc": "Upload a government circular PDF or exam notification image and ask \"Summarize the key dates and eligibility criteria.\""
      },
      {
        "step": 5,
        "title": "Try Gemini Advanced",
        "desc": "Free trial of Gemini Advanced (powered by Gemini Ultra) gives access to more powerful reasoning and longer context."
      }
    ],
    "prompts": [
      {
        "title": "Current Affairs Summary",
        "text": "Search the web and give me a structured summary of the 5 most important news items from Maharashtra government this week. Format: [Headline] | [What happened] | [Why it matters for MPSC]"
      },
      {
        "title": "Notification Explainer",
        "text": "I am attaching a government exam notification PDF. Extract: 1) Post names and vacancies, 2) Eligibility criteria, 3) Important dates, 4) Application fee, 5) Selection process. Format as a table."
      },
      {
        "title": "MCQ Generator",
        "text": "Based on the latest Union Budget 2025-26, create 10 MCQs for UPSC/MPSC GS preparation. Format each as: Q: [question] (A) [option] (B) [option] (C) [option] (D) [option] Ans: [letter with explanation]"
      }
    ],
    "limitations": "Free version has rate limits. Gemini Advanced requires Google One subscription (₹650/month). Image analysis may be less accurate for handwritten documents.",
    "relatedSlugs": [
      "claude",
      "chatgpt",
      "perplexity"
    ]
  },
  {
    "slug": "chatgpt",
    "name": "ChatGPT",
    "tagline": "The original AI assistant — writing, explaining, coding, and more.",
    "category": "AI Hub",
    "badge": "🤖 Most Popular",
    "free": true,
    "url": "https://chatgpt.com",
    "logo": "psychology",
    "targetUsers": [
      "All Users",
      "Job Seekers",
      "Students",
      "Developers"
    ],
    "whatIs": "ChatGPT by OpenAI is the world's most widely used AI assistant. GPT-4o (free plan) can handle text, images, and files. It excels at drafting, editing, explaining complex topics, writing code, and roleplaying scenarios (like mock interviews). Used by 200+ million people daily.",
    "whyItMatters": "ChatGPT is the most versatile starting point for any AI task — from drafting cover letters to explaining complex constitutional amendments in simple language for exam prep.",
    "steps": [
      {
        "step": 1,
        "title": "Go to chatgpt.com",
        "desc": "Free account gives access to GPT-4o mini and limited GPT-4o. No credit card needed."
      },
      {
        "step": 2,
        "title": "Start with context",
        "desc": "Always begin a chat with context: \"I am an MPSC aspirant preparing for 2026 prelims. Help me understand [topic].\""
      },
      {
        "step": 3,
        "title": "Use Custom Instructions",
        "desc": "Go to Settings → Personalization → Custom Instructions. Add: \"Always respond in simple English. When explaining government policy, relate it to Maharashtra context.\""
      },
      {
        "step": 4,
        "title": "Create a Study GPT",
        "desc": "Go to \"Explore GPTs\" and create your own custom GPT focused on MPSC/UPSC with your own system prompt and knowledge base."
      },
      {
        "step": 5,
        "title": "Use GPT-4o Vision",
        "desc": "Upload a photo of handwritten notes or a newspaper clipping and ask \"Transcribe this and summarize the key points.\""
      }
    ],
    "prompts": [
      {
        "title": "Socratic Study Partner",
        "text": "Act as a Socratic tutor for MPSC GS preparation. I will name a topic, and you ask me 5 probing questions to test my understanding. Don't give answers until I attempt. Topic: [federalism in India]"
      },
      {
        "title": "Essay Structuring",
        "text": "Help me structure a 1000-word MPSC Mains essay on \"Role of District Collector in Disaster Management in Maharashtra\". Give: introduction approach, 3 main arguments, evidence/examples, conclusion."
      },
      {
        "title": "Mock GD Simulation",
        "text": "Simulate a Group Discussion on \"Should reservations in India be extended to the private sector?\" Take the opposing view to whatever I say and give me 3 strong counterarguments each time."
      }
    ],
    "limitations": "Free plan has usage caps on GPT-4o (switches to GPT-4o mini when limit hit). No real-time web access on free plan. ChatGPT Plus is $20/month (≈₹1650).",
    "relatedSlugs": [
      "gemini",
      "claude",
      "perplexity"
    ]
  },
  {
    "slug": "grammarly",
    "name": "Grammarly",
    "tagline": "Real-time writing corrections, tone adjustments, and style improvements.",
    "category": "Writing",
    "badge": "✅ Trusted Writing Tool",
    "free": true,
    "url": "https://grammarly.com",
    "logo": "spellcheck",
    "targetUsers": [
      "Job Seekers",
      "UPSC/MPSC Aspirants",
      "Students",
      "Professionals"
    ],
    "whatIs": "Grammarly is the world's most popular writing assistant — used by 30+ million people daily. It checks grammar, punctuation, spelling, tone, clarity, and conciseness in real-time, wherever you write (Gmail, Docs, LinkedIn, Facebook).",
    "whyItMatters": "A single grammatical error in a cover letter or job application email can cost you an opportunity. Grammarly catches errors that spell-checkers miss — like wrong tense, incorrect prepositions, and unclear sentences.",
    "steps": [
      {
        "step": 1,
        "title": "Install Grammarly",
        "desc": "Add the Chrome browser extension from grammarly.com. Free. Works everywhere — Gmail, Docs, LinkedIn, any website's text field."
      },
      {
        "step": 2,
        "title": "Write naturally",
        "desc": "As you type in Gmail or Google Docs, Grammarly underlines issues in real-time: red (grammar), blue (style), green (tone)."
      },
      {
        "step": 3,
        "title": "Review suggestions",
        "desc": "Click any underline to see the suggestion. Accept or ignore. Grammarly shows a brief explanation of why the change improves your writing."
      },
      {
        "step": 4,
        "title": "Use tone detection",
        "desc": "Free plan shows overall tone: Professional, Friendly, Informative. Ensure your cover letter reads as \"Professional\" before sending."
      },
      {
        "step": 5,
        "title": "Try Grammarly Go (AI)",
        "desc": "Grammarly Go lets you improve entire paragraphs with AI. Paste your essay and ask \"Make this more formal\" or \"Simplify for clarity\"."
      }
    ],
    "prompts": [
      {
        "title": "Cover Letter Polish",
        "text": "Review this cover letter for: 1) Grammar and spelling errors, 2) Tone (should be formal and confident), 3) Clarity (is each sentence clear?), 4) Impact (does it make a strong impression?). Suggest improvements. [paste letter]"
      },
      {
        "title": "Email Tone Check",
        "text": "I am writing to request an interview status update. Is this email too passive? Too aggressive? Suggest a version that is professionally assertive: [paste email draft]"
      },
      {
        "title": "Answer Quality Review",
        "text": "Review this MPSC answer for: clarity, sentence structure, vocabulary appropriateness for a government exam, and logical flow. Give a score 1-10 with specific improvement areas. [paste answer]"
      }
    ],
    "limitations": "Free plan covers grammar basics. Advanced clarity, readability score, and plagiarism checker require Premium (₹1,299/month or ₹5,199/year). Some suggestions overly Americanize British English.",
    "relatedSlugs": [
      "quillbot",
      "claude",
      "chatgpt"
    ]
  },
  {
    "slug": "mathway",
    "name": "Mathway",
    "tagline": "Solve any math problem — algebra to calculus — step by step.",
    "category": "Study",
    "badge": "🔢 Math Solver",
    "free": true,
    "url": "https://mathway.com",
    "logo": "calculate",
    "targetUsers": [
      "Banking Exam Prep",
      "GATE Aspirants",
      "Engineering Students",
      "Govt Exam Math"
    ],
    "whatIs": "Mathway is the world's most powerful online math calculator. It solves problems from basic arithmetic to calculus, statistics, trigonometry, linear algebra, and chemistry — with step-by-step explanations. Just type or photograph your problem.",
    "whyItMatters": "The Quantitative Aptitude section of IBPS, SBI, SSC, and MPSC exams often trips aspirants on percentage problems, speed-distance, data interpretation, and profit-loss. Mathway shows the exact steps so you understand the method — not just the answer.",
    "steps": [
      {
        "step": 1,
        "title": "Go to mathway.com",
        "desc": "No account needed for basic solving. Download the app for photo input on mobile."
      },
      {
        "step": 2,
        "title": "Select subject",
        "desc": "Choose from: Basic Math, Pre-Algebra, Algebra, Statistics, Calculus, Chemistry. For banking exams, use \"Basic Math\" and \"Statistics\"."
      },
      {
        "step": 3,
        "title": "Type or photograph the problem",
        "desc": "Type the equation or tap the camera icon to photograph a problem from a book."
      },
      {
        "step": 4,
        "title": "See the answer",
        "desc": "Free plan shows the final answer instantly. Tap \"Tap to view steps\" (requires account) to see the step-by-step solution."
      },
      {
        "step": 5,
        "title": "Practice variations",
        "desc": "After understanding the method, modify the problem numbers and solve variations to build speed."
      }
    ],
    "prompts": [
      {
        "title": "Banking DI Practice",
        "text": "Solve this data interpretation problem step by step: A train travels 240 km at 60 kmph and returns at 40 kmph. What is the average speed for the entire journey? Show the formula and all calculation steps."
      },
      {
        "title": "Percentage Problems",
        "text": "A shopkeeper marks up an item by 40% and then gives a 25% discount. What is the net profit or loss percentage? Solve with detailed steps showing each formula."
      },
      {
        "title": "Time-Work Problems",
        "text": "A can complete work in 12 days, B in 15 days, C in 20 days. If they work together for 4 days and then C leaves, how many more days will A and B need to finish? Show all steps."
      }
    ],
    "limitations": "Free plan shows only final answers; step-by-step requires a paid subscription ($9.99/month). Photo recognition sometimes misreads handwritten math.",
    "relatedSlugs": [
      "wolfram-alpha",
      "chatgpt",
      "julius"
    ]
  },
  {
    "slug": "wolfram-alpha",
    "name": "Wolfram Alpha",
    "tagline": "The world's knowledge engine — computes answers from raw data.",
    "category": "Study",
    "badge": "🧠 Computation Engine",
    "free": true,
    "url": "https://wolframalpha.com",
    "logo": "functions",
    "targetUsers": [
      "GATE Aspirants",
      "Engineering Students",
      "Research Scholars",
      "Banking Exam Prep"
    ],
    "whatIs": "Wolfram Alpha is not a search engine — it's a computational intelligence engine that answers factual questions by computing from structured databases. It knows mathematics, physics, chemistry, history, geography, economics, and more. It can compute \"GDP of India vs China 2024\", \"integral of x² from 0 to 5\", or \"distance from Mumbai to Delhi\".",
    "whyItMatters": "For UPSC/MPSC geography, economics, and science questions, Wolfram Alpha provides computed, verifiable facts — not website summaries. It's particularly powerful for quantitative data, scientific constants, and mathematical computations.",
    "steps": [
      {
        "step": 1,
        "title": "Go to wolframalpha.com",
        "desc": "Free to use. Wolfram Alpha Pro ($5/month) gives step-by-step math solutions and downloadable results."
      },
      {
        "step": 2,
        "title": "Ask factual queries",
        "desc": "Type in plain English: \"Population of Maharashtra 2024\", \"Compare India GDP and China GDP\", \"What is the atomic mass of Carbon?\""
      },
      {
        "step": 3,
        "title": "Solve math",
        "desc": "Type any equation: \"solve x² + 5x + 6 = 0\" or \"integrate sin(x) from 0 to π\" and get instant computed results."
      },
      {
        "step": 4,
        "title": "Use for geography data",
        "desc": "Query: \"Highest rainfall district in Maharashtra\" or \"Rivers flowing through Vidarbha region\" for geography preparation."
      },
      {
        "step": 5,
        "title": "Compare datasets",
        "desc": "Ask: \"Compare literacy rate of Maharashtra, Karnataka, Tamil Nadu\" to get a computed comparison table."
      }
    ],
    "prompts": [
      {
        "title": "Economic Comparison",
        "text": "Use Wolfram Alpha to get: India's GDP (nominal) 2023, GDP per capita, economic growth rate, and compare with Maharashtra's GSDP. Then analyze what these numbers mean for MPSC economics preparation."
      },
      {
        "title": "Historical Timeline",
        "text": "Query \"History of India 1757 to 1947\" on Wolfram Alpha and list the 10 most significant events. Add context for why each matters for UPSC GS Paper 1."
      },
      {
        "title": "Scientific Data for GS",
        "text": "List the fundamental constants I need to memorize for GATE and UPSC science sections: speed of light, gravitational constant, Avogadro number, Planck constant — with exact values and SI units."
      }
    ],
    "limitations": "Free version has limited step-by-step solutions. Works best for quantitative queries; weaker at open-ended analysis. Some data may be slightly outdated.",
    "relatedSlugs": [
      "mathway",
      "julius",
      "perplexity"
    ]
  },
  // ─── 20 NEW TOOLS ADDED (Session 2026-09-22) ───────────────────────────────

  {
    "slug": "meta-ai",
    "name": "Meta AI",
    "tagline": "Free AI by Meta — available directly in WhatsApp, Instagram, and the web.",
    "category": "AI Hub",
    "badge": "💬 WhatsApp AI",
    "free": true,
    "url": "https://meta.ai",
    "logo": "chat",
    "targetUsers": [
      "All Users",
      "Rural Aspirants",
      "MPSC/UPSC Students",
      "Job Seekers"
    ],
    "whatIs": "Meta AI is a free AI assistant powered by Llama 3, accessible inside WhatsApp, Instagram, Facebook Messenger, and at meta.ai. It can answer questions, summarize content, generate images, explain concepts, and assist with studies — all without leaving WhatsApp. This makes it uniquely accessible for aspirants who primarily use mobile.",
    "whyItMatters": "Most aspirants already use WhatsApp daily. Meta AI lives inside WhatsApp — no new app to download, no sign-up. Type @Meta AI in any WhatsApp chat to get instant study help. It is 100% free with no usage caps on basic queries.",
    "steps": [
      {
        "step": 1,
        "title": "Open WhatsApp",
        "desc": "Update WhatsApp to the latest version. You'll see the Meta AI icon (blue circle) in the search bar or chat list."
      },
      {
        "step": 2,
        "title": "Start a Meta AI chat",
        "desc": "Tap the Meta AI icon to open a dedicated chat. Type any question like \"Explain Article 370 in simple Hindi\" or \"What is the MPSC exam pattern 2026?\"."
      },
      {
        "step": 3,
        "title": "Use @Meta AI in group chats",
        "desc": "In your study group WhatsApp, type @Meta AI followed by your question. Everyone in the group sees the AI answer — great for group study sessions."
      },
      {
        "step": 4,
        "title": "Generate images",
        "desc": "Type \"imagine [description]\" to generate AI images directly in WhatsApp. Useful for creating visual study aids."
      },
      {
        "step": 5,
        "title": "Use meta.ai on desktop",
        "desc": "For longer study sessions, visit meta.ai on a browser. You get a full chat interface with image generation and web search."
      }
    ],
    "prompts": [
      {
        "title": "Quick GS Explanation",
        "text": "Explain the difference between Rajya Sabha and Lok Sabha in 5 simple bullet points. Include: how members are elected, term length, special powers of each house."
      },
      {
        "title": "Current Affairs Check",
        "text": "What are the 3 most important news items from India today that are relevant for UPSC/MPSC preparation? Summarize each in 2 sentences."
      },
      {
        "title": "Maharashtra Facts",
        "text": "Give me 10 important facts about Maharashtra for MPSC preparation: districts, rivers, dams, national parks, tribes, and key industries."
      }
    ],
    "limitations": "Less powerful than Claude or GPT-4o for complex analysis. Image generation quality is average. No file upload capability on WhatsApp (only on web). English-first; Hindi quality is decent but Marathi is limited.",
    "relatedSlugs": [
      "chatgpt",
      "gemini",
      "poe"
    ]
  },
  {
    "slug": "mistral",
    "name": "Mistral Le Chat",
    "tagline": "Europe's fastest free AI model — lightning-quick answers with no rate limits.",
    "category": "AI Hub",
    "badge": "⚡ No Rate Limits",
    "free": true,
    "url": "https://chat.mistral.ai",
    "logo": "bolt",
    "targetUsers": [
      "Students",
      "Developers",
      "UPSC Aspirants",
      "Researchers"
    ],
    "whatIs": "Mistral Le Chat is the free chat interface for Mistral AI's frontier models. The Mistral Large and Mixtral models are known for being extremely fast (responses in 1-2 seconds) and having very generous free tier limits — often no daily cap. Mistral specializes in multilingual content and code, and has strong European data-privacy compliance.",
    "whyItMatters": "When ChatGPT, Claude, or Gemini hit their daily rate limits, Mistral Le Chat is your reliable fallback — fast, free, and unrestricted. It also excels at structured tasks like creating tables, comparisons, and formatted lists.",
    "steps": [
      {
        "step": 1,
        "title": "Go to chat.mistral.ai",
        "desc": "Sign up free with Google or email. Access Mistral Large 2 — a top-tier model — completely free."
      },
      {
        "step": 2,
        "title": "Choose your model",
        "desc": "Free tier offers Mistral Small (very fast) and Mistral Large (more powerful). Use Large for complex reasoning, Small for quick Q&A."
      },
      {
        "step": 3,
        "title": "Use for structured content",
        "desc": "Mistral is excellent at producing well-formatted tables, comparison charts, and organized lists — useful for creating study cheat sheets."
      },
      {
        "step": 4,
        "title": "Multi-language use",
        "desc": "Mistral handles Hindi and French particularly well. Ask questions in Hindi for concise answers on Indian polity and economics."
      },
      {
        "step": 5,
        "title": "Use as overflow AI",
        "desc": "Keep Mistral Le Chat as Tab 2 alongside your primary AI. When your main AI hits limits, switch to Mistral instantly."
      }
    ],
    "prompts": [
      {
        "title": "Comparison Table Generator",
        "text": "Create a detailed comparison table of MPSC, UPSC, SSC CGL, and IBPS PO exams. Columns: Exam Body, Posts, Eligibility, Selection Process, Salary Range, Difficulty Level."
      },
      {
        "title": "Study Cheat Sheet",
        "text": "Create a one-page cheat sheet on Indian Federalism for MPSC. Format: [Concept] → [Key Facts] → [Exam Angle]. Include 10 important constitutional articles."
      },
      {
        "title": "Hindi Explanation",
        "text": "भारत के नियंत्रक एवं महालेखापरीक्षक (CAG) की भूमिका को 5 बिंदुओं में समझाएं। UPSC परीक्षा के दृष्टिकोण से महत्वपूर्ण तथ्य भी बताएं।"
      }
    ],
    "limitations": "Mistral models are not quite at GPT-4o or Claude 3.5 level for creative writing or complex reasoning. No real-time web access in basic tier. Image generation not available.",
    "relatedSlugs": [
      "chatgpt",
      "claude",
      "poe"
    ]
  },
  {
    "slug": "grok",
    "name": "Grok by xAI",
    "tagline": "Elon Musk's AI — free with X account, real-time web search, unfiltered answers.",
    "category": "AI Hub",
    "badge": "🔍 Real-Time Search",
    "free": true,
    "url": "https://x.ai/grok",
    "logo": "travel_explore",
    "targetUsers": [
      "Current Affairs Buffs",
      "UPSC Aspirants",
      "Tech Students",
      "News Followers"
    ],
    "whatIs": "Grok is the AI assistant built by Elon Musk's xAI, available free to X (Twitter) users. Grok 3 (latest) has real-time access to everything posted on X/Twitter — making it uniquely powerful for tracking current affairs, political developments, and breaking news as they happen. It also has a \"Think\" mode for step-by-step reasoning.",
    "whyItMatters": "Current affairs is a critical section of UPSC, MPSC, and banking exams. Grok can tell you \"What is trending in Indian politics today?\" with live X posts as sources — something no other free AI can do as effectively.",
    "steps": [
      {
        "step": 1,
        "title": "Access Grok",
        "desc": "Visit x.ai/grok or open X (Twitter) app and tap the Grok icon. Free basic access with an X account. Grok 3 requires X Premium ($8/month)."
      },
      {
        "step": 2,
        "title": "Use for breaking news",
        "desc": "Ask \"What happened in Parliament today?\" or \"Latest news about MPSC 2026\" — Grok searches live X posts for real-time answers."
      },
      {
        "step": 3,
        "title": "Enable Think mode",
        "desc": "For complex reasoning problems, click the brain icon to enable \"Think\" mode — Grok shows its chain-of-thought before answering."
      },
      {
        "step": 4,
        "title": "Ask unfiltered questions",
        "desc": "Grok is less restrictive than other AIs for discussing politically sensitive current events, giving more direct answers to tough policy questions."
      },
      {
        "step": 5,
        "title": "Use DeepSearch",
        "desc": "Grok's DeepSearch mode searches both the web and X simultaneously, synthesizing multiple sources for comprehensive answers."
      }
    ],
    "prompts": [
      {
        "title": "Parliament Tracker",
        "text": "What are the top 5 bills or issues discussed in India's Parliament in the last 7 days? Format: Bill/Issue → What it proposes → Status → UPSC relevance."
      },
      {
        "title": "Current Affairs Digest",
        "text": "Give me a structured daily current affairs brief for UPSC/MPSC aspirants. Cover: International, National, Economy, Science & Tech, Maharashtra-specific. Use today's news."
      },
      {
        "title": "Breaking News Analysis",
        "text": "Analyze the recent [news event] from UPSC GS Paper 2 perspective: 1) Constitutional/Policy background, 2) What changed, 3) Key stakeholders, 4) Potential exam questions."
      }
    ],
    "limitations": "Grok 3 and DeepSearch require X Premium subscription ($8/month). Free tier uses older Grok 2 model. X/Twitter data can be noisy with misinformation — always verify facts. Not ideal for document analysis or coding tasks.",
    "relatedSlugs": [
      "perplexity",
      "gemini",
      "chatgpt"
    ]
  },
  {
    "slug": "speechify",
    "name": "Speechify",
    "tagline": "Listen to any text at 4.5x speed — the world's top audio study tool.",
    "category": "Study",
    "badge": "🎧 Speed Listening",
    "free": true,
    "url": "https://speechify.com",
    "logo": "headphones",
    "targetUsers": [
      "MPSC/UPSC Aspirants",
      "Long Commuters",
      "Dyslexic Students",
      "Reading-Heavy Exam Prep"
    ],
    "whatIs": "Speechify is the #1 text-to-speech app used by 20+ million people including students, executives, and people with dyslexia. It reads any content — PDFs, web articles, Google Docs, emails — aloud in natural AI voices at speeds up to 4.5x. Unlike ElevenLabs (which creates audio files), Speechify works as a live reader on top of any content.",
    "whyItMatters": "UPSC aspirants must read thousands of pages — Laxmikant, NCERT, The Hindu editorials, PIB reports. Speechify lets you 'read' while commuting, cooking, or exercising. At 2x speed, a 300-page book becomes a 5-hour audio session.",
    "steps": [
      {
        "step": 1,
        "title": "Install Speechify",
        "desc": "Download from speechify.com or install the Chrome extension. Free plan includes 10 hours/month of natural voices at up to 1x speed. Premium unlocks 4.5x and HD voices."
      },
      {
        "step": 2,
        "title": "Import content",
        "desc": "Paste any URL (news article, government PDF link), upload a PDF, or use the Chrome extension to read any webpage. On mobile, use the Speechify camera to photograph printed text."
      },
      {
        "step": 3,
        "title": "Choose an Indian English voice",
        "desc": "In voice settings, choose a natural Indian English voice for comfortable listening. Premium voices like \"Snoop\" or \"Gwyneth\" are extremely clear."
      },
      {
        "step": 4,
        "title": "Start at 1.5x, work up to 2.5x",
        "desc": "Begin at 1.5x speed. After 3-4 days, increase to 2x, then 2.5x. Your brain adapts within a week. At 2.5x, a 40-min editorial becomes a 16-min listen."
      },
      {
        "step": 5,
        "title": "Build your daily listening list",
        "desc": "Each morning, add the day's The Hindu editorial + 2-3 PIB articles + 1 NCERT chapter to Speechify queue. Listen during commute. That's your daily current affairs covered."
      }
    ],
    "prompts": [
      {
        "title": "Content Prep for Audio",
        "text": "Reformat this NCERT chapter into a clean, listenably structured text. Remove all figure references, replace bullet points with full sentences, and add connecting phrases so it flows naturally when read aloud. Chapter: [paste text]"
      },
      {
        "title": "The Hindu Editorial Audio",
        "text": "Summarize today's The Hindu editorial in 300 words as a conversational script — no headers, no bullets — that flows naturally as spoken audio. Include: main argument, key evidence, conclusion."
      }
    ],
    "limitations": "Free plan is 10 hours/month at 1x speed. Premium is $139/year (≈₹11,500). Camera text recognition struggles with complex tables and Hindi text. Best for English-language content.",
    "relatedSlugs": [
      "elevenlabs",
      "otter",
      "notebooklm"
    ]
  },
  {
    "slug": "notion-ai",
    "name": "Notion AI",
    "tagline": "AI-powered notes, study wiki, and knowledge base — all in one workspace.",
    "category": "Productivity",
    "badge": "📓 Smart Workspace",
    "free": true,
    "url": "https://notion.so",
    "logo": "edit_note",
    "targetUsers": [
      "UPSC Aspirants",
      "Research Students",
      "Organized Learners",
      "Job Seekers"
    ],
    "whatIs": "Notion is a powerful all-in-one workspace for notes, databases, wikis, and project management — with AI built in. Notion AI can summarize your notes, generate study plans, draft content, translate text, and answer questions based on your own saved knowledge. Think of it as your personal Wikipedia for exam prep.",
    "whyItMatters": "Most aspirants keep notes scattered across WhatsApp, notepads, and PDFs. Notion centralizes everything — your syllabus tracker, daily notes, PYQ analysis, and revision calendar — in one searchable, AI-powered workspace accessible from any device.",
    "steps": [
      {
        "step": 1,
        "title": "Sign up at notion.so",
        "desc": "Free plan includes unlimited personal pages. Notion AI costs $10/month extra — but the free plan alone is highly valuable for organization."
      },
      {
        "step": 2,
        "title": "Create a Study Dashboard",
        "desc": "Create a main page called \"MPSC 2026 Prep\". Add sub-pages: Syllabus Tracker, Daily Notes, PYQ Analysis, Books & Sources, Revision Calendar. This becomes your command center."
      },
      {
        "step": 3,
        "title": "Build a Syllabus Database",
        "desc": "Create a Table database with columns: Topic, Subject, Priority (High/Med/Low), Status (Not Started/In Progress/Done), Exam Paper. Filter by status to track progress."
      },
      {
        "step": 4,
        "title": "Use Notion AI to summarize",
        "desc": "Paste any long reading into a Notion page. Highlight the text, click AI, and select \"Summarize\" — Notion AI condenses it into key points in seconds."
      },
      {
        "step": 5,
        "title": "Use linked databases for revision",
        "desc": "Create a \"Daily Revision\" page that auto-filters topics marked as \"Done\" from the syllabus database for scheduled review — a built-in spaced repetition system."
      }
    ],
    "prompts": [
      {
        "title": "Study Dashboard Setup",
        "text": "Design the structure of a complete UPSC 2026 study dashboard in Notion. Include: 1) What databases I need, 2) What properties each database should have, 3) Relationships between them, 4) Useful views (kanban, calendar, table). Keep it practical for a solo aspirant."
      },
      {
        "title": "Topic Notes Template",
        "text": "Create a Notion page template for GS notes. Sections: Overview (200 words), Key Facts (table: Fact | Source | Exam Weight), Common MCQ angles (5 bullets), Mains angles (3 bullets), Personal Memory Hook."
      },
      {
        "title": "Weekly Review Prompt",
        "text": "I completed these topics this week: [list]. Create a spaced-repetition review schedule for the next 4 weeks, spacing each topic at 3 days, 7 days, 14 days, and 30 days."
      }
    ],
    "limitations": "Notion AI costs $10/month extra beyond the free plan. Mobile app can be slow on low-end Android phones. Offline access is limited on the free plan. Steep learning curve for beginners.",
    "relatedSlugs": [
      "notebooklm",
      "anki",
      "claude"
    ]
  },
  {
    "slug": "khanmigo",
    "name": "Khanmigo (Khan Academy AI)",
    "tagline": "Free AI tutor that explains concepts step-by-step — never just gives answers.",
    "category": "Study",
    "badge": "🎓 AI Tutor",
    "free": true,
    "url": "https://khanacademy.org/khan-labs",
    "logo": "school",
    "targetUsers": [
      "School & College Students",
      "Banking Maths Prep",
      "GATE Aspirants",
      "Foundational Learners"
    ],
    "whatIs": "Khanmigo is Khan Academy's official AI tutor powered by GPT-4. Unlike other AIs that just give answers, Khanmigo asks guiding questions to lead you to the solution yourself — following the Socratic method. It's integrated into Khan Academy's free course library covering maths, science, economics, history, and computing.",
    "whyItMatters": "Aspirants weak in foundational mathematics (percentages, ratios, algebra) for banking or CSAT can use Khan Academy's free courses with Khanmigo as a patient AI tutor that never judges — explaining each concept until you fully understand it.",
    "steps": [
      {
        "step": 1,
        "title": "Go to khanacademy.org",
        "desc": "Create a free account. Khan Academy is 100% free forever — no paid plans. Khanmigo tutoring is available via donation or limited free uses."
      },
      {
        "step": 2,
        "title": "Find your weak topic",
        "desc": "Search for your weak area: \"Percentages\", \"Ratio and Proportion\", \"Indian Constitution\", \"Microeconomics\". Khan Academy has structured courses for all these."
      },
      {
        "step": 3,
        "title": "Click \"Ask Khanmigo\"",
        "desc": "While watching a lesson or solving a practice problem, click the Khanmigo icon. Ask \"I don't understand this step\" — it will guide you with questions, not answers."
      },
      {
        "step": 4,
        "title": "Use Practice exercises",
        "desc": "After each concept, use the built-in practice problems. Khan Academy tracks mastery and only advances you when you've demonstrated understanding."
      },
      {
        "step": 5,
        "title": "Use for CSAT Math foundation",
        "desc": "Follow the Khan Academy \"Algebra 1\" and \"Statistics and Probability\" courses specifically for UPSC CSAT Paper 2 quantitative preparation."
      }
    ],
    "prompts": [
      {
        "title": "Socratic Tutor Mode",
        "text": "I'm stuck on this problem: [paste problem]. Don't give me the answer. Ask me guiding questions to help me figure it out myself. If I'm completely stuck after 3 attempts, give me a small hint."
      },
      {
        "title": "Concept Clarification",
        "text": "I learned about [concept] but I'm confused about [specific part]. Can you explain it using a real-life example from India? Then give me one practice problem to test my understanding."
      },
      {
        "title": "Weak Area Curriculum",
        "text": "I am weak in Percentages and Simple/Compound Interest for IBPS PO Quant. Create a 2-week self-study plan using free Khan Academy resources. List the exact courses, videos, and practice sets to complete each day."
      }
    ],
    "limitations": "Khanmigo is available with limited free credits; heavy use requires a Khan Academy donation. Most content is in English. Advanced UPSC-specific content is not as deep as specialized coaching materials.",
    "relatedSlugs": [
      "mathway",
      "wolfram-alpha",
      "deepseek"
    ]
  },
  {
    "slug": "photomath",
    "name": "Photomath",
    "tagline": "Point your camera at any math problem — get step-by-step solution instantly.",
    "category": "Study",
    "badge": "📷 Camera Math",
    "free": true,
    "url": "https://photomath.com",
    "logo": "photo_camera",
    "targetUsers": [
      "Banking Quant Aspirants",
      "SSC CGL Candidates",
      "Engineering Students",
      "10th-12th Students"
    ],
    "whatIs": "Photomath is a mobile app that uses your phone camera to scan any handwritten or printed math problem and instantly shows the step-by-step solution. It handles arithmetic, algebra, geometry, trigonometry, statistics, and calculus. Used by 220+ million students worldwide.",
    "whyItMatters": "Aspirants studying from printed books or handwritten notes can point their camera at any unsolved problem and instantly see the complete working — ideal for verifying your approach and understanding where you went wrong.",
    "steps": [
      {
        "step": 1,
        "title": "Download Photomath",
        "desc": "Free on Android and iOS from photomath.com. The core camera scan + solution is always free. Animated step-by-step explanations require Photomath Plus ($9.99/month)."
      },
      {
        "step": 2,
        "title": "Scan the problem",
        "desc": "Open Photomath → point camera at any math problem in your book or handwritten notes → red box appears → tap to solve."
      },
      {
        "step": 3,
        "title": "Review steps",
        "desc": "Swipe through the steps to see how the problem is solved. Each step shows the mathematical operation applied. Free tier shows steps in a collapsed form."
      },
      {
        "step": 4,
        "title": "Try multiple methods",
        "desc": "Some problems show alternative solution methods (e.g., both substitution and elimination for simultaneous equations). Compare to find the faster exam approach."
      },
      {
        "step": 5,
        "title": "Type complex problems",
        "desc": "For problems the camera misreads (complex fractions or symbols), use the built-in calculator keypad to type the expression manually."
      }
    ],
    "prompts": [
      {
        "title": "Method Comparison",
        "text": "Solve this banking exam problem using TWO different methods. Then tell me which method is faster to solve under exam time pressure and why: [paste problem]"
      },
      {
        "title": "Error Diagnosis",
        "text": "I solved this math problem but got a wrong answer. Here is my working: [paste working]. Identify where exactly I made an error and explain the correct step."
      }
    ],
    "limitations": "Camera recognition can fail on heavily handwritten or messy scripts. Step-by-step animation requires paid plan. Does not handle word problems — only mathematical equations and expressions.",
    "relatedSlugs": [
      "mathway",
      "wolfram-alpha",
      "khanmigo"
    ]
  },
  {
    "slug": "duolingo",
    "name": "Duolingo",
    "tagline": "Learn English, Hindi, or any language with AI-powered bite-size lessons.",
    "category": "Study",
    "badge": "🦉 Language AI",
    "free": true,
    "url": "https://duolingo.com",
    "logo": "translate",
    "targetUsers": [
      "English Improvement Seekers",
      "Marathi-Medium Students",
      "Banking English Prep",
      "UPSC Interview Prep"
    ],
    "whatIs": "Duolingo is the world's most popular language learning app — used by 500+ million people. It uses AI to personalize lessons, adapting to your learning pace and identifying weak areas. For competitive exam aspirants, Duolingo is particularly valuable for improving English vocabulary, grammar, reading comprehension, and speaking confidence for UPSC/MPSC interviews.",
    "whyItMatters": "Many aspirants from Marathi-medium backgrounds struggle with English in banking exams (IBPS), UPSC interview, and professional job applications. 15 minutes of Duolingo daily for 6 months builds conversational English fluency that coaching classes cannot provide.",
    "steps": [
      {
        "step": 1,
        "title": "Download Duolingo",
        "desc": "Free on iOS and Android. Choose English from Hindi/Marathi as your learning path. Set a daily goal of 15 minutes (\"Serious\" level)."
      },
      {
        "step": 2,
        "title": "Take the placement test",
        "desc": "Skip basic content by taking the placement test. Most aspirants with school English can skip 20-30 levels and start at an intermediate level."
      },
      {
        "step": 3,
        "title": "Focus on English for exams",
        "desc": "In addition to daily lessons, use Duolingo Stories (reading comprehension narratives) which directly build the skills tested in banking English sections."
      },
      {
        "step": 4,
        "title": "Use AI conversations",
        "desc": "Duolingo Max (paid) includes \"Roleplay\" — practice speaking with an AI character in real conversations. Excellent for UPSC personality test interview confidence."
      },
      {
        "step": 5,
        "title": "Maintain your streak",
        "desc": "The streak system (consecutive days of practice) is Duolingo's most powerful feature. Even 5 minutes counts. A 100-day streak represents significant English improvement."
      }
    ],
    "prompts": [
      {
        "title": "Vocabulary Builder Prompt (for ChatGPT/Claude)",
        "text": "Give me 10 advanced English words that commonly appear in The Hindu newspaper editorial and UPSC comprehension passages. For each: word, pronunciation guide, definition in simple English, example sentence in Indian context."
      },
      {
        "title": "MPSC Interview English Practice",
        "text": "Act as an MPSC interview board member. Ask me 5 questions in English about my educational background and motivation for civil services. Correct my grammar and suggest better vocabulary for each of my answers."
      },
      {
        "title": "Grammar Weak Area Drill",
        "text": "I struggle with: 1) Use of articles (a/an/the), 2) Prepositions. Give me 10 fill-in-the-blank sentences practicing these. After I answer, correct me and explain the rule."
      }
    ],
    "limitations": "Duolingo alone cannot make you fluent — supplement with real reading and speaking practice. The free plan has limited Hearts (lives) — you fail and wait or watch ads. Best for building vocabulary and grammar habits, not advanced academic writing.",
    "relatedSlugs": [
      "quillbot",
      "grammarly",
      "elevenlabs"
    ]
  },
  {
    "slug": "replit",
    "name": "Replit",
    "tagline": "AI-powered cloud IDE — code, run, and deploy apps from your browser or phone.",
    "category": "Dev",
    "badge": "☁️ Cloud Coding",
    "free": true,
    "url": "https://replit.com",
    "logo": "cloud_sync",
    "targetUsers": [
      "CS Students",
      "GATE Aspirants",
      "Beginner Coders",
      "Tech Job Seekers"
    ],
    "whatIs": "Replit is a cloud-based IDE where you can code, run, and deploy applications entirely from your browser — no installation, no local environment setup. It supports 50+ programming languages (Python, Java, C++, JavaScript, SQL, R) and includes Replit AI (powered by Claude) that writes, explains, and debugs code inline. Perfect for students without a laptop or with low-end PCs.",
    "whyItMatters": "Tech aspirants preparing for GATE, NIC Scientist, IBPS IT Officer, or software jobs can practice live coding problems and build portfolio projects from any device — even a phone or a school computer — without installing anything.",
    "steps": [
      {
        "step": 1,
        "title": "Go to replit.com",
        "desc": "Create a free account. Free plan includes unlimited public Repls (projects) and 10 AI completions/day. Hacker plan ($7/month) adds private Repls and more AI."
      },
      {
        "step": 2,
        "title": "Create a Repl",
        "desc": "Click \"+ Create Repl\" → Choose language (Python, Java, C++, etc.) → Name your project → coding environment opens in browser immediately."
      },
      {
        "step": 3,
        "title": "Use Replit AI",
        "desc": "Press Ctrl+I to open Replit AI chat. Ask it to \"Write a binary search function in C++\" or \"Explain what this code does\" — it responds with inline code and explanations."
      },
      {
        "step": 4,
        "title": "Practice DSA problems",
        "desc": "Use Replit as your practice environment. Paste LeetCode or competitive programming problems and solve them in real-time with AI assistance when stuck."
      },
      {
        "step": 5,
        "title": "Deploy your project",
        "desc": "Click \"Deploy\" to publish your web project to a live URL (replit.app domain). Share this link in job applications and portfolios as a live demo."
      }
    ],
    "prompts": [
      {
        "title": "DSA Practice Setup",
        "text": "Set up a Python Repl for GATE CS practice. Write a template that: 1) Takes input in standard competitive programming format, 2) Includes common data structures (stack, queue, graph), 3) Has a timer wrapper to measure execution time."
      },
      {
        "title": "Portfolio Project Idea",
        "text": "I am a fresher CS graduate preparing for software jobs. Suggest 3 portfolio project ideas I can build in Replit in 1 week each. Projects should: be unique, demonstrate backend logic, use a database, and be impressive to HR at an IT company. Include tech stack for each."
      },
      {
        "title": "Code Debugging",
        "text": "Debug this code: [paste code]. Identify all bugs, explain what each bug is causing, and provide the fixed version with comments explaining each fix."
      }
    ],
    "limitations": "Free plan Repls sleep after 1 hour of inactivity. Storage is limited to 500MB. No custom domains on free plan. Not suitable for large enterprise applications.",
    "relatedSlugs": [
      "cursor",
      "bolt",
      "github-copilot"
    ]
  },
  {
    "slug": "kickresume",
    "name": "Kickresume",
    "tagline": "AI resume and cover letter builder with ATS-optimized templates for Indian job markets.",
    "category": "Career",
    "badge": "📋 ATS Resume Builder",
    "free": true,
    "url": "https://kickresume.com",
    "logo": "description",
    "targetUsers": [
      "Job Seekers",
      "Freshers",
      "Govt Job Applicants",
      "Career Switchers"
    ],
    "whatIs": "Kickresume is an AI-powered resume and cover letter builder that creates professional, ATS-friendly resumes from your information. Its AI can generate resume bullets from job descriptions, rewrite your experience section for impact, and tailor your resume to specific job postings. It includes 35+ professional templates approved by top recruiters.",
    "whyItMatters": "Most Indian job seekers use outdated resume formats that fail Applicant Tracking System (ATS) filters before a human even sees them. Kickresume's ATS-optimized templates and AI writing ensure your resume passes automated screening for government PSU, IT company, and bank recruitment.",
    "steps": [
      {
        "step": 1,
        "title": "Go to kickresume.com",
        "desc": "Free plan lets you create 1 resume and 1 cover letter. Download requires a free account. Premium unlocks unlimited and removes watermark (₹830/month)."
      },
      {
        "step": 2,
        "title": "Enter your details",
        "desc": "Fill in experience, education, skills, and achievements. The wizard walks you through each section with guidance on what to include."
      },
      {
        "step": 3,
        "title": "Use AI to write bullets",
        "desc": "In the experience section, click \"AI Writer\". Paste your job title and company — AI generates strong action-verb bullet points highlighting impact. Edit to match your actual experience."
      },
      {
        "step": 4,
        "title": "Choose an ATS-safe template",
        "desc": "Select a single-column or simple two-column template. Avoid creative templates with graphics — these fail ATS parsing. \"Prague\", \"Berlin\", and \"Vienna\" are popular ATS-safe options."
      },
      {
        "step": 5,
        "title": "Tailor for each application",
        "desc": "Duplicate your resume for each major application. Change the summary and key skills to match the specific job description. This improves ATS match score significantly."
      }
    ],
    "prompts": [
      {
        "title": "Resume Bullet Point Generator",
        "text": "Generate 4 powerful resume bullet points for this role: [paste your job title and 2-3 responsibilities]. Use the STAR format: Situation, Task, Action, Result. Include numbers/metrics where possible. Make verbs strong: Designed, Implemented, Reduced, Increased."
      },
      {
        "title": "Resume Summary Writer",
        "text": "Write a 3-sentence professional summary for my resume. I am a [qualification] with [X] years of experience in [field]. My key strengths are [3 skills]. I am applying for [target role]. Make it confident, specific, and ATS-friendly."
      },
      {
        "title": "ATS Keyword Optimizer",
        "text": "Here is my resume summary: [paste summary]. Here is the job description: [paste JD]. Identify: 1) Keywords in the JD missing from my resume, 2) Suggested rewrites to include them naturally, 3) Overall ATS match score estimate (1-10)."
      }
    ],
    "limitations": "Free plan is limited to 1 resume with Kickresume watermark on download. Some premium templates require subscription. AI Writer is limited to 5 free uses. Not as powerful as Claude for truly customized writing.",
    "relatedSlugs": [
      "canva",
      "grammarly",
      "claude"
    ]
  },
  {
    "slug": "linkedin-ai",
    "name": "LinkedIn AI Tools",
    "tagline": "AI-powered job search, profile optimization, and interview prep — built into LinkedIn.",
    "category": "Career",
    "badge": "💼 Career Booster",
    "free": true,
    "url": "https://linkedin.com",
    "logo": "work",
    "targetUsers": [
      "Job Seekers",
      "Freshers",
      "Professionals",
      "Career Switchers"
    ],
    "whatIs": "LinkedIn has built AI tools directly into its platform: AI-powered profile writing suggestions, AI job application cover letter generation, Interview Prep with AI feedback, and a LinkedIn Learning AI course recommender. LinkedIn Premium also includes AI salary insights and a dedicated AI job search assistant.",
    "whyItMatters": "In 2025-26, most private sector and PSU recruitment happens via LinkedIn. A fully optimized LinkedIn profile gets 40x more profile views and 3x more job opportunities than an incomplete one. LinkedIn's built-in AI makes profile optimization accessible to everyone.",
    "steps": [
      {
        "step": 1,
        "title": "Complete your LinkedIn profile",
        "desc": "Go to linkedin.com → Profile → Edit. Reach 'All-Star' status (the highest completeness level) — LinkedIn's algorithm shows All-Star profiles 27x more in search results."
      },
      {
        "step": 2,
        "title": "Use AI to write your About section",
        "desc": "In the About section, click \"Write with AI\". Enter bullet points about your experience and goals — LinkedIn AI generates a professional About narrative. Edit for accuracy."
      },
      {
        "step": 3,
        "title": "Use AI for job descriptions",
        "desc": "When adding a job position, LinkedIn AI suggests professional bullet points based on your job title. Use these as a starting point and customize with your real achievements."
      },
      {
        "step": 4,
        "title": "Practice Interview Prep",
        "desc": "On any job listing, click \"Interview Prep\" to see likely interview questions for that role. Record your video answer — LinkedIn AI gives feedback on pace, clarity, and content."
      },
      {
        "step": 5,
        "title": "Use AI cover letter generator",
        "desc": "On Easy Apply jobs, LinkedIn now offers an AI-generated cover letter tailored to the job description and your profile. Review and personalize before submitting."
      }
    ],
    "prompts": [
      {
        "title": "LinkedIn Headline Optimizer",
        "text": "Write 5 different LinkedIn headline options for a candidate who is: [your qualification], [your experience], applying for [target role]. Each headline should be under 220 characters, keyword-rich, and highlight a unique value proposition."
      },
      {
        "title": "Connection Request Message",
        "text": "Write a personalized LinkedIn connection request message to a [HR Manager / Senior Engineer / Recruiter] at [Company Name]. I am a [role/background] interested in [specific team/role]. Keep it under 300 characters, genuine, and non-salesy."
      },
      {
        "title": "Post for Job Visibility",
        "text": "Write a LinkedIn post where I announce I am actively looking for [role] opportunities. Include: brief intro, my key skills/experience, what I am looking for, and a call-to-action. Make it engaging, not desperate. 200 words max."
      }
    ],
    "limitations": "Full AI features (AI Assistant, advanced interview prep, salary insights) require LinkedIn Premium (₹2,399/month). Basic AI writing suggestions are free. LinkedIn AI can produce generic content — always personalize before publishing.",
    "relatedSlugs": [
      "kickresume",
      "grammarly",
      "claude"
    ]
  },
  {
    "slug": "glasp",
    "name": "Glasp",
    "tagline": "AI web highlighter that saves, organizes, and generates study notes from any article.",
    "category": "Research",
    "badge": "✏️ Smart Highlighter",
    "free": true,
    "url": "https://glasp.co",
    "logo": "highlight",
    "targetUsers": [
      "UPSC Aspirants",
      "Research Students",
      "Online Learners",
      "Content Creators"
    ],
    "whatIs": "Glasp is a free Chrome extension that lets you highlight and annotate any webpage or PDF. Your highlights are automatically saved and organized into a personal knowledge library. Glasp's AI can generate a summary of everything you've highlighted on a page, create study notes from your highlights, and even produce a YouTube transcript with timestamps.",
    "whyItMatters": "Aspirants reading dozens of online articles daily (The Hindu, PRS India, PIB, Yojana) lose valuable insights because they can't save highlights efficiently. Glasp captures everything you find important across all websites in one searchable library.",
    "steps": [
      {
        "step": 1,
        "title": "Install Glasp Chrome Extension",
        "desc": "Free from glasp.co or the Chrome Web Store. Sign up with Google. No credit card required."
      },
      {
        "step": 2,
        "title": "Highlight while reading",
        "desc": "Select any text on a webpage → a color picker appears → choose a color (use yellow for facts, green for important dates, pink for policy names). Your highlight is saved instantly."
      },
      {
        "step": 3,
        "title": "Add notes to highlights",
        "desc": "Click any saved highlight → add a personal note: \"Q: Why does this matter for UPSC GS3?\" or \"Link this with Pradhan Mantri Fasal Bima Yojana\". These annotations enrich your library."
      },
      {
        "step": 4,
        "title": "Generate AI summary",
        "desc": "On any article, click the Glasp sidebar → \"AI Summary\" → get a structured summary of the page that includes all the points you highlighted, plus key facts you may have missed."
      },
      {
        "step": 5,
        "title": "Export to Notion/Obsidian",
        "desc": "Export all highlights and notes from a page to Markdown format. Import into Notion, Obsidian, or paste directly into your study notes system."
      }
    ],
    "prompts": [
      {
        "title": "Article Analysis for UPSC",
        "text": "I will paste my Glasp highlights from today's The Hindu. For each highlight: 1) Identify the core fact, 2) Connect it to a relevant UPSC syllabus topic, 3) Suggest one possible exam question from this fact. Highlights: [paste]"
      },
      {
        "title": "Weekly Highlight Synthesis",
        "text": "Here are my weekly web highlights on [topic]. Synthesize them into: 1) Key developments timeline, 2) Policy implications, 3) Government response, 4) My 3-point UPSC Mains answer framework."
      }
    ],
    "limitations": "Free plan limits to 10 AI summaries/month. Highlighting inside paywalled articles is not always possible. Mobile highlighting requires the Glasp iOS/Android app (limited compared to desktop).",
    "relatedSlugs": [
      "notebooklm",
      "perplexity",
      "notion-ai"
    ]
  },
  {
    "slug": "readwise",
    "name": "Readwise Reader",
    "tagline": "Save any article, newsletter, or PDF — then resurface highlights with AI-powered review.",
    "category": "Research",
    "badge": "📚 Read-It-Later + AI",
    "free": true,
    "url": "https://readwise.io/read",
    "logo": "bookmark_add",
    "targetUsers": [
      "UPSC Aspirants",
      "Avid Readers",
      "Newsletter Subscribers",
      "Researchers"
    ],
    "whatIs": "Readwise Reader is a premium read-it-later app that lets you save articles, Twitter threads, newsletters, PDFs, and YouTube videos in one place — then resurfaces your highlights using spaced repetition. The AI Ghostreader can summarize any saved document, generate key takeaways, and even have a conversation with the saved content.",
    "whyItMatters": "Aspirants subscribe to Yojana, Kurukshetra, government newsletters, and hundreds of The Hindu articles but never revisit them. Readwise saves everything and automatically emails you a daily review of your past highlights — turning passive reading into active revision.",
    "steps": [
      {
        "step": 1,
        "title": "Sign up at readwise.io",
        "desc": "Free 30-day trial of Readwise full features. After trial: $7.99/month. The free tier (Readwise Reader) for saving content is free with some limits."
      },
      {
        "step": 2,
        "title": "Install the browser extension",
        "desc": "Chrome extension lets you save any article to your Readwise library with one click. Supports Twitter threads, Medium, The Hindu, PRS India, and more."
      },
      {
        "step": 3,
        "title": "Highlight while reading",
        "desc": "Read inside the Readwise Reader app. Highlight key sections — they're saved permanently and synced across devices."
      },
      {
        "step": 4,
        "title": "Use Ghostreader AI",
        "desc": "Select any saved article → click Ghostreader → ask \"What are the 3 most important points for UPSC GS2?\" or \"Generate 3 MCQs from this article\"."
      },
      {
        "step": 5,
        "title": "Review daily highlights",
        "desc": "Enable the daily review email — Readwise sends you 5-10 of your past highlights every morning to reinforce memory. This is passive revision on autopilot."
      }
    ],
    "prompts": [
      {
        "title": "Article Triage",
        "text": "I saved 15 articles this week on [topic]. Quickly summarize each in 1 sentence and rate its UPSC relevance (High/Medium/Low) so I know which to read in full and which to skim. Articles: [paste titles/URLs]"
      },
      {
        "title": "Highlight Flashcard",
        "text": "Convert these 5 article highlights into Anki-style flashcards. Format: Q: [fact-based question from the highlight] | A: [answer from the highlight + page/article source]. Highlights: [paste]"
      }
    ],
    "limitations": "Full features (Ghostreader AI, unlimited sync, spaced repetition) require a paid plan ($7.99/month). Free tier is limited. Best for English-language content. Some paywalled sites can only save via the extension with a workaround.",
    "relatedSlugs": [
      "glasp",
      "notebooklm",
      "anki"
    ]
  },
  {
    "slug": "descript",
    "name": "Descript",
    "tagline": "Edit audio and video by editing text — remove filler words with one click.",
    "category": "Productivity",
    "badge": "🎬 AI Video Editor",
    "free": true,
    "url": "https://descript.com",
    "logo": "movie",
    "targetUsers": [
      "YouTube Educators",
      "Coaching Channel Creators",
      "Teachers",
      "Content Creators"
    ],
    "whatIs": "Descript is an AI-powered audio and video editing tool that works differently from traditional editors. It transcribes your recording, then lets you edit the video by simply editing the text transcript — delete a word in the text and that moment is cut from the video. One-click removal of all 'ums', 'uhs', and silences makes it a game-changer for content creators.",
    "whyItMatters": "Educators and coaching channel creators who make YouTube videos explaining MPSC topics, math solutions, or interview tips spend hours editing. Descript cuts editing time by 70% — making it viable for aspirants to run a YouTube channel alongside their studies.",
    "steps": [
      {
        "step": 1,
        "title": "Download Descript",
        "desc": "Free plan at descript.com includes 1 hour/month of transcription and basic editing. Creator plan ($24/month) is needed for full features."
      },
      {
        "step": 2,
        "title": "Import your recording",
        "desc": "Drag your video or audio file into Descript. It automatically transcribes the entire recording in minutes."
      },
      {
        "step": 3,
        "title": "Edit the transcript",
        "desc": "Read through the transcript. Select and delete any mistake, rambling section, or repeated explanation — the corresponding video section is instantly removed."
      },
      {
        "step": 4,
        "title": "Remove filler words",
        "desc": "Click \"Remove Filler Words\" → Descript highlights all 'ums', 'ahs', 'you know', and long pauses. Preview and remove them all with one click."
      },
      {
        "step": 5,
        "title": "Export and publish",
        "desc": "Export as MP4, add subtitles (auto-generated by Descript), or publish directly to YouTube from within Descript."
      }
    ],
    "prompts": [
      {
        "title": "Video Script Writer",
        "text": "Write a 5-minute YouTube video script explaining [MPSC topic] for aspirants. Format: Hook (30 sec) → Context (1 min) → 3 Key Points with examples (2.5 min) → Quick Recap (45 sec) → Call to Action (15 sec). Use conversational Hindi-English mixed tone."
      },
      {
        "title": "Lecture Outline",
        "text": "Create a structured 20-minute teaching outline on [exam topic] for a YouTube video. Include: concept explanation, common mistakes aspirants make, 2 PYQ examples, and a summary. Note timestamps for each section."
      }
    ],
    "limitations": "Free plan's 1 hour/month transcription is limiting for regular creators. The AI voice overdub (to fix audio mistakes with your cloned voice) requires paid plan. Export resolution is capped at 720p on free.",
    "relatedSlugs": [
      "otter",
      "elevenlabs",
      "loom"
    ]
  },
  {
    "slug": "loom",
    "name": "Loom AI",
    "tagline": "Record and share instant AI-summarized video messages — faster than email.",
    "category": "Productivity",
    "badge": "📹 Video Messaging",
    "free": true,
    "url": "https://loom.com",
    "logo": "videocam",
    "targetUsers": [
      "Students",
      "Job Seekers",
      "Freelancers",
      "Teachers"
    ],
    "whatIs": "Loom is a video messaging tool that records your screen + face + voice and instantly generates a shareable link. Loom AI automatically generates a summary, action items, and title for every video. Used by 25+ million people at companies like HubSpot, Atlassian, and Intercom to replace long emails and meetings.",
    "whyItMatters": "For job seekers, sending a personalized 90-second Loom video with your job application instead of a plain email gets 5x more response rates. For students, Loom makes it easy to record study explanations and share with study groups for async collaboration.",
    "steps": [
      {
        "step": 1,
        "title": "Install Loom",
        "desc": "Free at loom.com. Chrome extension or desktop app. Free plan includes unlimited videos (up to 5 minutes each). Business plan ($12.50/month) removes the 5-min limit."
      },
      {
        "step": 2,
        "title": "Record your first video",
        "desc": "Click the Loom icon → choose: Camera only, Screen only, or Screen + Camera. Click Record. Start talking. Loom records everything and generates a link when you stop."
      },
      {
        "step": 3,
        "title": "Let AI generate summary",
        "desc": "After recording, Loom AI automatically generates: a video title, 3-sentence summary, and list of action items mentioned. Saves you from having to type a description."
      },
      {
        "step": 4,
        "title": "Share your link",
        "desc": "Copy the Loom link and paste it anywhere — email, LinkedIn, WhatsApp. Recipients watch in-browser without downloading anything."
      },
      {
        "step": 5,
        "title": "Use for job applications",
        "desc": "Record a 90-second intro video: \"Hi [Name], I am applying for [Role]. Here's why I'm specifically excited about your team and what I'd bring...\" Attach the Loom link with your resume."
      }
    ],
    "prompts": [
      {
        "title": "Video Application Script",
        "text": "Write a script for a 90-second Loom video application for a [Software Engineer / Bank Officer / Government Post] role. Structure: greeting + intro, specific company mention, 2 relevant strengths with proof, what excites me about this role, call to action. Natural conversational tone."
      },
      {
        "title": "Study Explanation Format",
        "text": "Write a script for a 3-minute screen-recorded explanation of [MPSC topic] for my study group. Assume they are intermediate level. Format: quick recap of prerequisite → core concept → real example → likely exam question + approach."
      }
    ],
    "limitations": "Free videos are limited to 5 minutes each. Free plan shows Loom branding on embedded players. Video transcription is English-only. AI features (auto-title, summary) require a paid plan.",
    "relatedSlugs": [
      "descript",
      "otter",
      "tldv"
    ]
  },
  {
    "slug": "copy-ai",
    "name": "Copy.ai",
    "tagline": "AI content generator for cover letters, emails, social posts, and study summaries.",
    "category": "Writing",
    "badge": "✍️ Content Generator",
    "free": true,
    "url": "https://copy.ai",
    "logo": "content_paste",
    "targetUsers": [
      "Job Seekers",
      "Freelancers",
      "Content Creators",
      "Social Media Managers"
    ],
    "whatIs": "Copy.ai is an AI writing tool with 90+ templates for specific content types — cover letters, email replies, LinkedIn posts, product descriptions, essay outlines, YouTube descriptions, and social media captions. Unlike Claude/ChatGPT (blank canvas), Copy.ai gives you structured templates that guide you to the right output quickly.",
    "whyItMatters": "Job seekers who need a cover letter in 10 minutes, aspirants who want to write a motivational LinkedIn post about their MPSC journey, or freelancers who need client email templates — Copy.ai's structured approach produces professional content 5x faster than a blank page.",
    "steps": [
      {
        "step": 1,
        "title": "Sign up at copy.ai",
        "desc": "Free plan includes 2,000 words/month and access to all templates. No credit card needed. Pro plan ($49/month) removes word limits."
      },
      {
        "step": 2,
        "title": "Browse templates",
        "desc": "Click \"Templates\" and browse 90+ options: Cover Letter, Cold Email, LinkedIn Summary, Blog Post Outline, Product Description, etc. Choose the one matching your need."
      },
      {
        "step": 3,
        "title": "Fill in the context form",
        "desc": "Each template has a short form asking for key details: job title, your experience, tone, etc. Copy.ai generates multiple variations based on your inputs."
      },
      {
        "step": 4,
        "title": "Select and refine",
        "desc": "Copy.ai generates 3-5 variations. Pick the best, then use the editor to polish and personalize. Add specific details that only you know."
      },
      {
        "step": 5,
        "title": "Use the Chat mode",
        "desc": "For custom needs, use Copy.ai Chat — similar to ChatGPT but with a focus on professional and marketing writing. Great for iterating on a piece of content."
      }
    ],
    "prompts": [
      {
        "title": "Cover Letter Template",
        "text": "Write a professional cover letter for a [role] position at [company/organization]. My background: [2-3 sentences about experience]. Why I want this role: [1-2 sentences]. My top achievement: [1 sentence with numbers if possible]. Keep it to 3 paragraphs, formal tone."
      },
      {
        "title": "LinkedIn Announcement Post",
        "text": "Write a LinkedIn post announcing that I have cleared the [MPSC/UPSC/IBPS] [exam stage]. I want to: thank my family and mentors, share a key lesson from my journey, and encourage others who are still preparing. Authentic, humble, and inspiring. 200 words."
      },
      {
        "title": "Cold Email to Recruiter",
        "text": "Write a cold email to a recruiter at [Company]. I am a [background] looking for [role type]. Subject line should be compelling. Email should be 3 short paragraphs: introduction, value I bring, ask (15-minute call). Under 150 words."
      }
    ],
    "limitations": "Free tier is 2,000 words/month — very limited. Templates produce generic content that always needs personalization. Less nuanced than Claude for complex analytical writing. Best for structured, templated content types.",
    "relatedSlugs": [
      "claude",
      "grammarly",
      "quillbot"
    ]
  },
  {
    "slug": "hemingway",
    "name": "Hemingway Editor",
    "tagline": "Make your writing bold and clear — grades your English for readability.",
    "category": "Writing",
    "badge": "📝 Clarity Score",
    "free": true,
    "url": "https://hemingwayapp.com",
    "logo": "format_size",
    "targetUsers": [
      "UPSC Mains Aspirants",
      "Job Seekers",
      "Content Writers",
      "English Improvers"
    ],
    "whatIs": "Hemingway Editor is a minimalist writing tool that analyzes your prose and color-codes problems: yellow (sentence too long), red (very hard to read), blue (adverbs to remove), green (passive voice), purple (simpler word exists). It gives your writing a readability Grade level. The goal: Grade 9 or below for clear, punchy writing.",
    "whyItMatters": "UPSC Mains answers and cover letters lose marks when sentences are too long or convoluted. Hemingway forces you to write in a direct, active-voice style that examiners and recruiters find easy to read — directly improving your score.",
    "steps": [
      {
        "step": 1,
        "title": "Go to hemingwayapp.com",
        "desc": "100% free in the browser. No sign-up required. Paste your text and the analysis starts instantly. Desktop app is $19.99 (one-time) for offline use."
      },
      {
        "step": 2,
        "title": "Paste your answer or essay",
        "desc": "Paste your UPSC/MPSC answer draft, cover letter, or article. The tool immediately highlights problem sentences in different colors."
      },
      {
        "step": 3,
        "title": "Read the highlights",
        "desc": "Red sentences: shorten them by splitting into two. Yellow: simplify the structure. Blue adverbs: delete them or use a stronger verb. Purple: replace with a simpler word."
      },
      {
        "step": 4,
        "title": "Check the Grade level",
        "desc": "Aim for Grade 9-12 for exam answers (not too simple, not too complex). Cover letters should be Grade 7-9. Editorials typically aim for Grade 10-12."
      },
      {
        "step": 5,
        "title": "Fix and re-paste",
        "desc": "Edit your text in the Hemingway editor directly, or copy-paste back and forth with your document. Watch the grade improve as you simplify."
      }
    ],
    "prompts": [
      {
        "title": "Before/After Analysis",
        "text": "Here is my original UPSC answer paragraph: [paste paragraph]. Analyze it for: 1) Average sentence length, 2) Passive voice frequency, 3) Complex vocabulary. Then rewrite it at a Grade 10 readability level while keeping all the facts and analysis."
      },
      {
        "title": "Clarity Rewrite",
        "text": "Rewrite this cover letter paragraph to be more direct and clear. Remove all passive voice. Break sentences longer than 20 words. Replace any word with 3+ syllables with a simpler alternative where possible. [paste paragraph]"
      }
    ],
    "limitations": "No AI assistance — purely a mechanical readability analysis tool. Does not check factual accuracy or content quality. Cannot analyze Marathi or Hindi text.",
    "relatedSlugs": [
      "grammarly",
      "quillbot",
      "claude"
    ]
  },
  {
    "slug": "beautiful-ai",
    "name": "Beautiful.ai",
    "tagline": "Smart presentation builder — AI auto-formats slides as you add content.",
    "category": "Presentation",
    "badge": "🎨 Auto-Design Slides",
    "free": true,
    "url": "https://beautiful.ai",
    "logo": "auto_fix_normal",
    "targetUsers": [
      "Job Seekers",
      "Teachers",
      "Corporate Trainers",
      "Students"
    ],
    "whatIs": "Beautiful.ai is an AI-powered presentation tool where slides automatically redesign themselves as you add content. Unlike PowerPoint (where adding content breaks the layout) or Gamma (AI-generates everything), Beautiful.ai gives you smart templates that auto-balance, auto-size, and auto-align elements. Each slide type (timeline, comparison, team, process flow) is specialized and self-adjusting.",
    "whyItMatters": "For interview presentations, seminar talks, or teaching sessions, Beautiful.ai produces slides that look professionally designed — even if you have no design skills. Compared to Gamma, Beautiful.ai gives more control over each slide while still being faster than PowerPoint.",
    "steps": [
      {
        "step": 1,
        "title": "Sign up at beautiful.ai",
        "desc": "Free plan includes unlimited presentations. Download as PDF on free (PowerPoint export requires Pro at $12/month)."
      },
      {
        "step": 2,
        "title": "Browse Smart Slide types",
        "desc": "Choose from specialized slide types: Timeline, Process, Comparison (side by side), Team (with photos), List, Chart, Quote, Map. Each is pre-designed and self-adjusting."
      },
      {
        "step": 3,
        "title": "Add content — watch it auto-format",
        "desc": "Type your content into each slide. Beautiful.ai automatically adjusts text sizes, spacing, and layout as you add more items. No manual formatting needed."
      },
      {
        "step": 4,
        "title": "Use AI DesignerBot",
        "desc": "Click DesignerBot → describe your presentation: \"10-slide presentation on Maharashtra water crisis for a government officer interview.\" It generates a complete first draft."
      },
      {
        "step": 5,
        "title": "Present or share",
        "desc": "Present in full-screen directly from the browser. Share via a link or download as PDF. Add speaker notes to each slide for reference during presentation."
      }
    ],
    "prompts": [
      {
        "title": "Interview Presentation Script",
        "text": "I have a 5-minute presentation slot in my government interview on 'My Vision for Maharashtra's Digital Governance'. Create: 1) A 5-slide outline (title, problem, solution, my role, vision), 2) Key bullet points for each slide, 3) 60-second speaking notes for each slide."
      },
      {
        "title": "Process Flow Slide",
        "text": "Describe a process flow diagram for 'How a public grievance is resolved under the Chief Minister's Online Grievance Redressal System in Maharashtra'. Include: submission, verification, department routing, resolution, feedback. 6 steps with brief descriptions."
      }
    ],
    "limitations": "Free plan watermarks downloads and limits exports to PDF only. Not as AI-complete as Gamma (you build slide by slide, not generate all at once). DesignerBot quality varies — always review output.",
    "relatedSlugs": [
      "gamma",
      "canva",
      "napkin"
    ]
  },
  {
    "slug": "piktochart",
    "name": "Piktochart AI",
    "tagline": "Create infographics, reports, and posters from text — AI picks the best visual format.",
    "category": "Presentation",
    "badge": "📊 Infographic Maker",
    "free": true,
    "url": "https://piktochart.com",
    "logo": "insert_chart",
    "targetUsers": [
      "Students",
      "Teachers",
      "Policy Researchers",
      "Content Creators"
    ],
    "whatIs": "Piktochart is an AI-powered infographic and data visualization tool. Paste your text or data and Piktochart AI suggests the best visual format — comparison chart, process flow, timeline, statistical infographic, or report layout — and builds it automatically. Specialized for turning dense information into shareable visual content.",
    "whyItMatters": "For UPSC aspirants, creating visual summaries of complex topics (budget allocations, election commission procedures, environmental policy timelines) drastically improves retention and makes excellent shareable study content for study groups.",
    "steps": [
      {
        "step": 1,
        "title": "Go to piktochart.com",
        "desc": "Free plan includes 5 designs/month with Piktochart branding. Pro is $29/month for unlimited. Sign up with Google."
      },
      {
        "step": 2,
        "title": "Use AI Infographic Generator",
        "desc": "Click \"Create with AI\" → paste your topic or bullet points → Piktochart AI builds a complete infographic in 30 seconds. Choose from the generated variations."
      },
      {
        "step": 3,
        "title": "Choose a template category",
        "desc": "Browse templates by type: Infographic, Poster, Presentation, Report, Social Media. For study notes, \"Infographic\" and \"Report\" templates work best."
      },
      {
        "step": 4,
        "title": "Customize with your data",
        "desc": "Replace placeholder text with your content. Upload charts/data or type numbers — Piktochart automatically creates bar charts, pie charts, and comparison visuals."
      },
      {
        "step": 5,
        "title": "Download and share",
        "desc": "Download as PNG (free) or PDF (free). Share on WhatsApp study groups, paste into notes, or post on Instagram/LinkedIn as educational content."
      }
    ],
    "prompts": [
      {
        "title": "Budget Infographic",
        "text": "Create content for an infographic on India's Union Budget 2025-26 highlights for UPSC. Include: total budget size, top 5 expenditure sectors (with amounts), top 5 revenue sources, key new schemes, fiscal deficit %. Format as numbered facts with bold headers."
      },
      {
        "title": "Constitutional Amendment Timeline",
        "text": "List the 10 most important Constitutional Amendments in India (1st to 103rd) for UPSC GS2. Format: [Amendment No.] → [Year] → [What it changed] → [Why exam-important]. This will become an infographic."
      },
      {
        "title": "Scheme Comparison Chart",
        "text": "Create a comparison of 5 major government agriculture schemes: PM-KISAN, PMFBY, PMGSY, Kisan Credit Card, and e-NAM. Columns: Scheme, Launch Year, Objective, Beneficiary, Budget Allocation. Format for an infographic table."
      }
    ],
    "limitations": "Free plan watermarks designs and limits to 5/month. AI generator quality is good for simple topics but struggles with complex data tables. Export to editable PPTX requires Pro plan.",
    "relatedSlugs": [
      "napkin",
      "canva",
      "gamma"
    ]
  },
  {
    "slug": "runway",
    "name": "Runway ML",
    "tagline": "AI video generation and editing — create stunning videos from text or images.",
    "category": "Design",
    "badge": "🎥 AI Video Creator",
    "free": true,
    "url": "https://runwayml.com",
    "logo": "video_library",
    "targetUsers": [
      "Content Creators",
      "YouTube Educators",
      "Designers",
      "Freelancers"
    ],
    "whatIs": "Runway is the leading AI video generation and editing platform used by professional filmmakers, YouTubers, and educators. Its Gen-3 Alpha model generates high-quality video clips from text prompts or images. Other tools include background removal, motion blur, text-to-video, image-to-video, and video-to-video style transfer.",
    "whyItMatters": "YouTube creators building educational channels (MPSC explanations, geography lessons, history documentaries) can generate professional B-roll video footage from text descriptions — eliminating the need for expensive stock video subscriptions or live shoots.",
    "steps": [
      {
        "step": 1,
        "title": "Sign up at runwayml.com",
        "desc": "Free plan includes 125 credits/month (enough for 2-3 short video clips). Pro is $12/month for 625 credits. No credit card for free tier."
      },
      {
        "step": 2,
        "title": "Use Gen-3 Text to Video",
        "desc": "Click \"Text to Video\" → Gen-3 Alpha. Describe your scene in detail: \"Aerial drone shot of Maharashtra coastal line, golden hour, calm ocean, small fishing boats, cinematic\". Generate 4-second clips."
      },
      {
        "step": 3,
        "title": "Use Image to Video",
        "desc": "Upload a still image (generated by Ideogram or Midjourney) → Runway animates it into a 4-second video with camera movement and natural motion."
      },
      {
        "step": 4,
        "title": "Use background removal",
        "desc": "Upload any video clip → Runway removes the background automatically with no green screen needed. Apply a custom background or keep it transparent for overlays."
      },
      {
        "step": 5,
        "title": "Export and use in YouTube videos",
        "desc": "Download generated clips as MP4. Import into any video editor (DaVinci Resolve — free, or Descript) to assemble into your full YouTube video."
      }
    ],
    "prompts": [
      {
        "title": "Educational B-Roll Script",
        "text": "Generate 5 Runway text-to-video prompts for a YouTube video about 'Maharashtra's water scarcity problem'. Each prompt should describe a visual scene that illustrates the topic. Prompts should be detailed, cinematic, and specific about camera angle, lighting, and subject. 30-60 words each."
      },
      {
        "title": "Geography Visualization",
        "text": "Create 3 video prompt descriptions for visualizing: 1) The Deccan Plateau geography, 2) Mumbai's harbor and gateway, 3) Western Ghats forests during monsoon. Each 40 words, cinematic style, suitable for an educational YouTube channel on Maharashtra geography."
      }
    ],
    "limitations": "Free plan is very limited (125 credits/month). Video clips max 4-10 seconds per generation. Generated videos can have visual artifacts. Not suitable for generating text or faces accurately — use for B-roll and abstract visuals only.",
    "relatedSlugs": [
      "ideogram",
      "canva",
      "descript"
    ]
  },
  {
    "slug": "suno",
    "name": "Suno AI",
    "tagline": "Generate educational mnemonic songs, audio memory hooks, and study tracks.",
    "category": "Study",
    "badge": "🎵 Audio Mnemonics",
    "free": true,
    "url": "https://suno.com",
    "logo": "music_note",
    "targetUsers": [
      "MPSC Aspirants",
      "UPSC Students",
      "History & Polity Learners",
      "Auditory Learners"
    ],
    "whatIs": "Suno AI transforms text prompts, historical timelines, and constitutional articles into full-fledged catchy songs, ballads, or rhythmic tracks with realistic vocals. Aspirants use it to turn hard-to-memorize historical dates, fundamental rights, and science facts into memorable tunes.",
    "whyItMatters": "Audio mnemonics trigger episodic memory. Listening to a 2-minute rhythmically catchy song about the 12 Constitutional Schedules ensures you never forget them in exam halls.",
    "steps": [
      {
        "step": 1,
        "title": "Open Suno AI",
        "desc": "Visit suno.com and sign up for a free account (includes 50 free credits daily = 10 songs)."
      },
      {
        "step": 2,
        "title": "Select Custom Mode",
        "desc": "Click \"Create\" and toggle \"Custom\" mode on to input your own educational lyrics."
      },
      {
        "step": 3,
        "title": "Paste Study Facts",
        "desc": "Paste constitutional articles, historical chronologies, or science laws formatted in verse or rhyming couplets."
      },
      {
        "step": 4,
        "title": "Select Music Genre",
        "desc": "Choose an upbeat acoustic, rap, or classical Indian style that aids rhythmic recall."
      },
      {
        "step": 5,
        "title": "Download & Listen Daily",
        "desc": "Save the generated audio MP3 and add it to your daily commute or revision playlist."
      }
    ],
    "prompts": [
      {
        "title": "Constitutional Articles Song",
        "text": "Create an upbeat mnemonic song summarizing Fundamental Rights Articles 14 to 32 of the Indian Constitution, with the chorus highlighting Right to Constitutional Remedies Article 32."
      },
      {
        "title": "Maharashtra Social Reformers",
        "text": "Write a rhythmic acoustic ballad detailing the social reform milestones of Mahatma Jyotirao Phule, Rajarshi Shahu Maharaj, and Dr. B.R. Ambedkar with key founding dates."
      }
    ],
    "limitations": "Free tier grants 50 credits/day (non-commercial use). Generated songs are up to 2 minutes per clip but can be extended.",
    "relatedSlugs": [
      "elevenlabs",
      "notebooklm",
      "speechify"
    ]
  },
  {
    "slug": "krea",
    "name": "Krea AI",
    "tagline": "Real-time generative AI canvas, image upscaler, and visual concept generator.",
    "category": "Design",
    "badge": "🎨 Real-time Canvas",
    "free": true,
    "url": "https://www.krea.ai",
    "logo": "brush",
    "targetUsers": [
      "Content Creators",
      "Visual Learners",
      "Geography Students",
      "Presentation Designers"
    ],
    "whatIs": "Krea AI is an ultra-fast real-time generative canvas where you draw basic shapes or upload rough sketches, and the AI renders hyper-realistic graphics and diagrams instantly. It also includes an industry-leading free AI image upscaler and enhancer.",
    "whyItMatters": "Transform low-resolution textbook diagrams, historical maps, and handwritten flowcharts into crisp 4K visuals for study notes and slide decks.",
    "steps": [
      {
        "step": 1,
        "title": "Launch Real-time Canvas",
        "desc": "Navigate to krea.ai and click \"Realtime Generation\"."
      },
      {
        "step": 2,
        "title": "Draw Rough Outlines",
        "desc": "Use simple geometric shapes, colors, or pen strokes on the left panel."
      },
      {
        "step": 3,
        "title": "Add Descriptive Prompt",
        "desc": "Type prompts like \"Cross section of volcanic mountain with magma chamber, educational textbook illustration\"."
      },
      {
        "step": 4,
        "title": "Adjust AI Strength",
        "desc": "Slide the AI strength bar to balance your sketch outline with AI-rendered realism."
      },
      {
        "step": 5,
        "title": "Upscale & Export",
        "desc": "Use Krea Enhancer to upscale the diagram to 4K resolution and download for notes."
      }
    ],
    "prompts": [
      {
        "title": "Geography Plate Tectonics",
        "text": "Diagram showing convergent continental and oceanic plate boundaries with subduction trench, volcanic arc, and mantle convection currents, clear educational schematic."
      },
      {
        "title": "Historical Fort Architecture",
        "text": "Architectural schematic cross-section of a Maratha hill fort showing bastion walls, water reservoirs, and defense gates, architectural diagram."
      }
    ],
    "limitations": "Free plan has basic generation speed and daily generation limits. Higher resolution video features require paid tier.",
    "relatedSlugs": [
      "canva",
      "ideogram",
      "recraft"
    ]
  },
  {
    "slug": "recraft",
    "name": "Recraft AI",
    "tagline": "Generate free vector graphics, SVG icons, and clean infographic art for notes.",
    "category": "Design",
    "badge": "📐 Vector & SVG",
    "free": true,
    "url": "https://www.recraft.ai",
    "logo": "polyline",
    "targetUsers": [
      "UPSC Aspirants",
      "Note Makers",
      "Infographic Designers",
      "Teachers & Educators"
    ],
    "whatIs": "Recraft is a dedicated vector and raster design studio powered by AI. Unlike pixel-based generators, Recraft generates infinitely scalable SVG vector icons, 3D illustrations, and diagrams that can be recolored and edited node-by-node.",
    "whyItMatters": "Creates clean, professional vector illustrations for economy flowcharts, environmental food webs, and governance structures without pixelation or watermarks.",
    "steps": [
      {
        "step": 1,
        "title": "Create Free Account",
        "desc": "Go to recraft.ai and sign in with Google."
      },
      {
        "step": 2,
        "title": "Select Vector Style",
        "desc": "Choose \"Vector Art\", \"Icon\", or \"Line Art\" from the style picker."
      },
      {
        "step": 3,
        "title": "Enter Diagram Prompt",
        "desc": "Describe your concept: \"Wind turbine clean energy cycle icon with power grid arrows\"."
      },
      {
        "step": 4,
        "title": "Recolor & Edit Nodes",
        "desc": "Change color palette or erase/replace specific sub-elements with AI inpainting."
      },
      {
        "step": 5,
        "title": "Download Scalable SVG",
        "desc": "Export as SVG or high-res PNG to embed in Notion, Word, or presentation slides."
      }
    ],
    "prompts": [
      {
        "title": "Economic Circular Flow",
        "text": "Clean minimal vector icon representing circular economy recycling loop, green energy transitions, flat line art SVG style."
      },
      {
        "title": "Judicial Hierarchy Flowchart",
        "text": "Flat vector diagram icons for Supreme Court of India, High Court, and District Courts, clean institutional iconography."
      }
    ],
    "limitations": "Free generations are public by default. Private generations and commercial raster upscales require paid membership.",
    "relatedSlugs": [
      "canva",
      "krea",
      "napkin"
    ]
  },
  {
    "slug": "leonardo",
    "name": "Leonardo.ai",
    "tagline": "High-fidelity generative art, educational concept visuals, and architectural rendering.",
    "category": "Design",
    "badge": "✨ 150 Free Daily Tokens",
    "free": true,
    "url": "https://leonardo.ai",
    "logo": "palette",
    "targetUsers": [
      "Aspirants",
      "Educators",
      "Designers",
      "Visual Storytellers"
    ],
    "whatIs": "Leonardo.ai offers state-of-the-art fine-tuned image generation models with daily free token replenishments. It features prompt assist, background removal, motion animation, and precise control over visual styles.",
    "whyItMatters": "Aspirants and teachers can generate vivid historical battle illustrations, ancient civilization reconstructions (Indus Valley, Maurya), and geography cross-sections for immersive learning.",
    "steps": [
      {
        "step": 1,
        "title": "Log in & Collect Tokens",
        "desc": "Log into leonardo.ai; get 150 free generation tokens renewed every single day."
      },
      {
        "step": 2,
        "title": "Pick Model",
        "desc": "Select Leonardo Phoenix or Kino XL for photorealistic and educational illustrations."
      },
      {
        "step": 3,
        "title": "Craft Prompt",
        "desc": "Type your prompt with camera angle and artistic details."
      },
      {
        "step": 4,
        "title": "Enable Prompt Magic",
        "desc": "Turn on Prompt Magic for enhanced accuracy in complex cultural and historical details."
      },
      {
        "step": 5,
        "title": "Download Clean Asset",
        "desc": "Save rendered images for your blog articles, study flashcards, or YouTube banners."
      }
    ],
    "prompts": [
      {
        "title": "Ancient Indus Valley Settlement",
        "text": "Aerial historical reconstruction of Harappa city layout, Great Bath, brick houses, grid planning, bustling market, historical documentary illustration."
      },
      {
        "title": "Agro-forestry Concept",
        "text": "Diagrammatic view of multi-tier agroforestry farm with solar pumps, drip irrigation, and intercropping, bright daylight photorealistic."
      }
    ],
    "limitations": "Daily 150 fast tokens limit. Queue times may increase during peak hours on free accounts.",
    "relatedSlugs": [
      "ideogram",
      "krea",
      "midjourney"
    ]
  },
  {
    "slug": "qwen",
    "name": "Qwen 2.5 (Alibaba Cloud)",
    "tagline": "Top-ranked open-weights AI model with exceptional math, coding, and multilingual reasoning.",
    "category": "AI Hub",
    "badge": "🧠 Math & Logic Titan",
    "free": true,
    "url": "https://chat.qwenlm.ai",
    "logo": "psychology",
    "targetUsers": [
      "Engineering Students",
      "Competitive Math Aspirants",
      "Developers",
      "Multilingual Researchers"
    ],
    "whatIs": "Qwen 2.5 by Alibaba is one of the world's highest-ranking open foundation models, beating GPT-4o in mathematical reasoning, coding benchmarks, and multilingual comprehension, with fluent support for Indian languages and long context.",
    "whyItMatters": "Outstanding at solving complex CSAT quantitative aptitude questions, step-by-step algebra, and translating governance documents with high linguistic fidelity.",
    "steps": [
      {
        "step": 1,
        "title": "Access Qwen Chat",
        "desc": "Go to chat.qwenlm.ai and log in for free access to Qwen 2.5 72B."
      },
      {
        "step": 2,
        "title": "Select Thinking Mode",
        "desc": "Select Qwen 2.5-Coder for coding questions or Qwen 2.5 72B for general aptitude and essays."
      },
      {
        "step": 3,
        "title": "Paste Math/Aptitude Problem",
        "desc": "Paste speed-time-distance, permutations, or data interpretation questions."
      },
      {
        "step": 4,
        "title": "Get Step-by-Step Proof",
        "desc": "Qwen breaks down reasoning formula by formula without skipping intermediate steps."
      },
      {
        "step": 5,
        "title": "Multilingual Querying",
        "desc": "Ask questions in Marathi or Hindi and receive grammatically sound, natural explanations."
      }
    ],
    "prompts": [
      {
        "title": "CSAT Probability Solver",
        "text": "Solve this step-by-step: A bag contains 5 red, 4 green, and 3 blue marbles. 3 marbles are drawn at random. What is the probability that at least 2 are green? Show formula and calculation."
      },
      {
        "title": "Bilingual Policy Summary",
        "text": "Explain the PM-KUSUM solar scheme in Marathi and English side-by-side with subsidy slabs, eligibility, and beneficiary farmers benefits."
      }
    ],
    "limitations": "Web interface has occasional rate limits during high global server traffic.",
    "relatedSlugs": [
      "deepseek",
      "chatgpt",
      "gemini"
    ]
  },
  {
    "slug": "cohere-coral",
    "name": "Cohere Coral",
    "tagline": "Enterprise knowledge search with direct document citations and hallucination-free answers.",
    "category": "Research",
    "badge": "📚 Grounded Search",
    "free": true,
    "url": "https://cohere.com/coral",
    "logo": "find_in_page",
    "targetUsers": [
      "Research Scholars",
      "Policy Analysts",
      "UPSC Mains Candidates",
      "Law Students"
    ],
    "whatIs": "Cohere Coral is an enterprise-grade conversational AI assistant specifically optimized for retrieval-augmented generation (RAG). It ingests complex whitepapers, acts, and policy reports, answering queries with exact footnote citations.",
    "whyItMatters": "Crucial for writing UPSC/MPSC Mains answers where factual correctness, statutory provisions, and verified government report citations are required.",
    "steps": [
      {
        "step": 1,
        "title": "Open Cohere Coral",
        "desc": "Visit cohere.com/coral and sign in with a free account."
      },
      {
        "step": 2,
        "title": "Upload Official Reports",
        "desc": "Upload NITI Aayog reports, Finance Commission recommendations, or state economic surveys."
      },
      {
        "step": 3,
        "title": "Enable Web Grounding",
        "desc": "Turn on \"Web Search Grounding\" for live corroboration across online sources."
      },
      {
        "step": 4,
        "title": "Query Specific Provisions",
        "desc": "Ask: \"What are the 16th Finance Commission terms of reference regarding devolution to local bodies?\"."
      },
      {
        "step": 5,
        "title": "Inspect Footnotes",
        "desc": "Click citation numbers to verify the exact page and paragraph from which the insight was pulled."
      }
    ],
    "prompts": [
      {
        "title": "Fiscal Deficit Analysis",
        "text": "Based on the latest Union and Maharashtra budgets, what are the primary drivers of revenue deficit and capital expenditure trends? Cite exact figures."
      },
      {
        "title": "Constitutional Case Law",
        "text": "Summarize the Kesavananda Bharati basic structure doctrine with direct citations to the 13-judge bench findings and subsequent applications."
      }
    ],
    "limitations": "Free tier has daily query caps on playground. Best suited for document-grounded research rather than creative tasks.",
    "relatedSlugs": [
      "perplexity",
      "consensus",
      "scite"
    ]
  },
  {
    "slug": "blackbox-ai",
    "name": "Blackbox AI",
    "tagline": "Free AI code search, autocomplete, and code extraction from videos.",
    "category": "Dev",
    "badge": "💻 Code Search",
    "free": true,
    "url": "https://www.blackbox.ai",
    "logo": "terminal",
    "targetUsers": [
      "CS Aspirants",
      "Govt IT Officers",
      "Software Engineers",
      "Coding Beginners"
    ],
    "whatIs": "Blackbox AI is a specialized coding copilot that lets programmers search for code snippets, generate algorithms from natural language, debug errors across 20+ languages, and even copy code directly out of YouTube tutorial videos.",
    "whyItMatters": "Helps aspirants preparing for State IT Officer, NIC, and Banking IT Specialist exams master Data Structures and Algorithms with instant code explanations.",
    "steps": [
      {
        "step": 1,
        "title": "Go to Blackbox.ai",
        "desc": "Visit blackbox.ai or install the Chrome / VS Code extension."
      },
      {
        "step": 2,
        "title": "Type Coding Question",
        "desc": "Ask in plain English: \"Write Dijkstra's algorithm in Python with time complexity analysis\"."
      },
      {
        "step": 3,
        "title": "Get Annotated Code",
        "desc": "View complete code with line-by-line comments and big-O notation."
      },
      {
        "step": 4,
        "title": "Use Video Code Snipping",
        "desc": "Select video code region on YouTube tutorials to extract text as editable code."
      },
      {
        "step": 5,
        "title": "Debug Errors",
        "desc": "Paste stack traces to find root causes and fixed code snippets immediately."
      }
    ],
    "prompts": [
      {
        "title": "SQL Query Optimization",
        "text": "Write a PostgreSQL query to find the 2nd highest salary by department, and explain how to optimize it with indexes and window functions."
      },
      {
        "title": "Binary Search Tree Code",
        "text": "Implement a Binary Search Tree deletion operation in C++ with detailed edge cases (leaf node, one child, two children)."
      }
    ],
    "limitations": "Free web chat has occasional advertisements. Advanced auto-commit features require paid plan.",
    "relatedSlugs": [
      "cursor",
      "phind",
      "github-copilot"
    ]
  },
  {
    "slug": "tabnine",
    "name": "Tabnine",
    "tagline": "Privacy-centric AI code completion assistant with local context awareness.",
    "category": "Dev",
    "badge": "🔒 Privacy-First",
    "free": true,
    "url": "https://www.tabnine.com",
    "logo": "data_object",
    "targetUsers": [
      "Developers",
      "Data Science Students",
      "Govt Tech Contractors",
      "System Admins"
    ],
    "whatIs": "Tabnine provides AI code completions that run locally or in secure cloud instances, ensuring your source code never leaves your computer or trains public models. Supports VS Code, IntelliJ, and major IDEs.",
    "whyItMatters": "Ideal for students and developers working on sensitive government projects, proprietary scripts, or offline environments requiring private autocomplete.",
    "steps": [
      {
        "step": 1,
        "title": "Install Plugin",
        "desc": "Install Tabnine extension in Visual Studio Code or JetBrains IDE."
      },
      {
        "step": 2,
        "title": "Sign In Free",
        "desc": "Sign in to activate the free starter plan for whole-line code completions."
      },
      {
        "step": 3,
        "title": "Start Typing Code",
        "desc": "As you write functions, Tabnine suggests context-aware completions in real-time."
      },
      {
        "step": 4,
        "title": "Accept Suggestions",
        "desc": "Press Tab to complete lines, loops, and repetitive boilerplate patterns."
      },
      {
        "step": 5,
        "title": "Chat With Tabnine",
        "desc": "Use Tabnine Chat inside your IDE to ask questions about your local workspace."
      }
    ],
    "prompts": [
      {
        "title": "Python Web Scraper Script",
        "text": "Write a Python script using BeautifulSoup to parse exam notification titles and PDF download URLs from a public government page."
      },
      {
        "title": "FastAPI REST Endpoint",
        "text": "Generate a FastAPI async route with Pydantic validation for registering student mock test scores into PostgreSQL."
      }
    ],
    "limitations": "Free plan offers basic line completions; full repository contextual chat requires Pro tier.",
    "relatedSlugs": [
      "cursor",
      "github-copilot",
      "blackbox-ai"
    ]
  },
  {
    "slug": "you-com",
    "name": "You.com",
    "tagline": "AI search engine with dedicated Genius mode, multi-step research, and live web access.",
    "category": "Research",
    "badge": "🔍 Multi-modal Search",
    "free": true,
    "url": "https://you.com",
    "logo": "search",
    "targetUsers": [
      "Competitive Exam Candidates",
      "Journalists",
      "Fact Checkers",
      "General Aspirants"
    ],
    "whatIs": "You.com is a search assistant that combines web search with multi-step reasoning models (Genius mode). It synthesizes web findings, generates interactive Python code, renders mathematical graphs, and cross-checks sources.",
    "whyItMatters": "Delivers comprehensive 360-degree summaries of breaking news, Union Budget provisions, and Supreme Court constitutional bench verdicts with linked news sources.",
    "steps": [
      {
        "step": 1,
        "title": "Visit You.com",
        "desc": "Go to you.com and start searching without requiring a login."
      },
      {
        "step": 2,
        "title": "Pick Research Mode",
        "desc": "Switch between \"Smart\" (fast answers) and \"Genius\" (deep multi-step research)."
      },
      {
        "step": 3,
        "title": "Search News & Polity",
        "desc": "Search current events like: \"Maharashtra Maratha reservation historical timeline and court challenges\"."
      },
      {
        "step": 4,
        "title": "Explore Source Citations",
        "desc": "Hover over citations to read original newspaper reports and official press releases."
      },
      {
        "step": 5,
        "title": "Download Formatted Notes",
        "desc": "Copy the compiled timeline directly into your current affairs revision notebook."
      }
    ],
    "prompts": [
      {
        "title": "Current Affairs Timeline",
        "text": "Provide a chronological summary of all major space missions conducted by ISRO in the last 18 months, with payload objectives and launch vehicles."
      },
      {
        "title": "Economic Policy Comparison",
        "text": "Compare the Old Pension Scheme (OPS) vs Unified Pension Scheme (UPS) vs National Pension System (NPS) with employee contribution, guaranteed pension, and fiscal impact."
      }
    ],
    "limitations": "Free tier limits the number of complex Genius mode research queries per day.",
    "relatedSlugs": [
      "perplexity",
      "consensus",
      "gemini"
    ]
  },
  {
    "slug": "scispace",
    "name": "SciSpace (Typeset.io)",
    "tagline": "Your AI copilot to decode research papers, literature reviews, and academic PDFs.",
    "category": "Research",
    "badge": "🔬 Paper Copilot",
    "free": true,
    "url": "https://typeset.io",
    "logo": "science",
    "targetUsers": [
      "Postgraduate Students",
      "UPSC Science & Tech Prep",
      "PhD Scholars",
      "Professors"
    ],
    "whatIs": "SciSpace allows students to upload complex scientific papers, highlight confusing math equations or paragraphs, and get instant ELI5 (explain like I'm 5) explanations, related paper recommendations, and literature matrices.",
    "whyItMatters": "Demystifies intricate scientific studies on biotechnology, renewable energy, and climate change for Mains GS-3 answer writing.",
    "steps": [
      {
        "step": 1,
        "title": "Open SciSpace",
        "desc": "Go to typeset.io and search across 200M+ research papers or upload your own PDF."
      },
      {
        "step": 2,
        "title": "Highlight Text / Formula",
        "desc": "Click and drag over any dense paragraph, mathematical equation, or table."
      },
      {
        "step": 3,
        "title": "Click \"Explain\"",
        "desc": "The AI copilot gives a plain-English explanation of what the equation or findings mean."
      },
      {
        "step": 4,
        "title": "Generate Literature Matrix",
        "desc": "Compare 5 top papers on a topic across columns: Methodology, Sample Size, Key Results."
      },
      {
        "step": 5,
        "title": "Export Insights",
        "desc": "Export summary tables to CSV or citation format for your research bibliography."
      }
    ],
    "prompts": [
      {
        "title": "Decode Science Paper",
        "text": "Explain the mechanism of CRISPR-Cas9 gene editing described in this paper in 3 simple bullet points suitable for a civil service GS paper."
      },
      {
        "title": "Climate Change Impact",
        "text": "Summarize the IPCC 6th Assessment Report findings regarding monsoonal pattern shifts and agricultural vulnerability in South Asia."
      }
    ],
    "limitations": "Free plan has monthly PDF upload limits and daily AI copilot question quotas.",
    "relatedSlugs": [
      "consensus",
      "semantic-scholar",
      "elicit"
    ]
  },
  {
    "slug": "research-rabbit",
    "name": "Research Rabbit",
    "tagline": "Visual citation network explorer and Spotify-like discovery for academic research.",
    "category": "Research",
    "badge": "🐇 Citation Mapping",
    "free": true,
    "url": "https://www.researchrabbit.ai",
    "logo": "hub",
    "targetUsers": [
      "Academics",
      "UPSC Optionals Candidates",
      "Essay Writers",
      "Researchers"
    ],
    "whatIs": "Research Rabbit is a visual citation tool. Add a single seed paper or topic, and it generates interactive graphs showing co-citations, author networks, early foundational papers, and newly published follow-ups.",
    "whyItMatters": "Aspirants preparing literature for specialized optionals (Economics, Sociology, Agriculture) can trace seminal theories and contemporary critiques in seconds.",
    "steps": [
      {
        "step": 1,
        "title": "Sign Up Free",
        "desc": "Visit researchrabbit.ai and create a 100% free account."
      },
      {
        "step": 2,
        "title": "Add a Seed Paper",
        "desc": "Search for a landmark paper (e.g. Amartya Sen's Poverty and Famines)."
      },
      {
        "step": 3,
        "title": "Explore Graph View",
        "desc": "Click \"Similar Work\" or \"Earlier Work\" to see an interconnected network graph."
      },
      {
        "step": 4,
        "title": "Discover Follow-ups",
        "desc": "Identify which recent papers have cited this work to understand current debates."
      },
      {
        "step": 5,
        "title": "Sync with Zotero",
        "desc": "Export all discovered papers directly to reference managers for bibliography building."
      }
    ],
    "prompts": [
      {
        "title": "Land Reform Studies",
        "text": "Map the most cited academic papers analyzing the economic impact of Maharashtra's Land Ceiling and tenancy reforms."
      },
      {
        "title": "Sociology Caste Dynamics",
        "text": "Discover foundational sociological studies on mobility, Sanskritization, and subaltern assertions in Western India."
      }
    ],
    "limitations": "Primarily designed for academic discovery rather than generating direct text answers.",
    "relatedSlugs": [
      "connected-papers",
      "scispace",
      "semantic-scholar"
    ]
  },
  {
    "slug": "open-knowledge-maps",
    "name": "Open Knowledge Maps",
    "tagline": "Visual discovery engine for scientific knowledge and open-access publications.",
    "category": "Research",
    "badge": "🌐 100% Open Access",
    "free": true,
    "url": "https://openknowledgemaps.org",
    "logo": "account_tree",
    "targetUsers": [
      "Public Policy Aspirants",
      "Open Science Advocates",
      "Students",
      "Self Learners"
    ],
    "whatIs": "Open Knowledge Maps is a non-profit open-access tool that presents scientific literature as topic clusters and visual topical maps based on PubMed and BASE datasets, highlighting key open-access papers instantly.",
    "whyItMatters": "Provides an instant bird's-eye view of scientific fields like groundwater depletion, organic farming, or cyber governance without getting lost in search results.",
    "steps": [
      {
        "step": 1,
        "title": "Visit Open Knowledge Maps",
        "desc": "Go to openknowledgemaps.org (no account or payment required)."
      },
      {
        "step": 2,
        "title": "Enter Search Topic",
        "desc": "Search topics like \"Artificial Intelligence in Healthcare India\" or \"Water Crisis Maharashtra\"."
      },
      {
        "step": 3,
        "title": "Explore Topic Bubbles",
        "desc": "Click on themed visual bubbles representing sub-disciplines and research clusters."
      },
      {
        "step": 4,
        "title": "Access Open PDFs",
        "desc": "Click any paper card inside the bubble to read or download full open-access PDFs."
      },
      {
        "step": 5,
        "title": "Save Topic Map",
        "desc": "Bookmark or download the interactive map for your long-term research file."
      }
    ],
    "prompts": [
      {
        "title": "Renewable Energy Grid",
        "text": "Generate a visual overview of recent research on battery energy storage systems (BESS) and grid stability in developing economies."
      },
      {
        "title": "Malnutrition Interventions",
        "text": "Map open-access research on maternal and child malnutrition interventions in tribal districts of India."
      }
    ],
    "limitations": "Focuses strictly on open-access and scientific repository papers; does not index paywalled commercial journals.",
    "relatedSlugs": [
      "research-rabbit",
      "connected-papers",
      "consensus"
    ]
  },
  {
    "slug": "quizlet-qchat",
    "name": "Quizlet Q-Chat",
    "tagline": "AI Socratic tutor that tests, quizzes, and reinforces your knowledge on flashcard decks.",
    "category": "Study",
    "badge": "🎯 Socratic Tutor",
    "free": true,
    "url": "https://quizlet.com",
    "logo": "quiz",
    "targetUsers": [
      "MPSC Pre Candidates",
      "Police Bharti Aspirants",
      "SSC CGL Students",
      "Language Learners"
    ],
    "whatIs": "Quizlet's Q-Chat is an AI tutor built into the Quizlet flashcard ecosystem. Instead of passive card flipping, Q-Chat asks you Socratic questions, adapts to your mistakes, and provides hints until you master the concept.",
    "whyItMatters": "Tests active recall on Marathi grammar rules, English vocabulary, Indian geography capitals, and national parks through engaging conversational quizzes.",
    "steps": [
      {
        "step": 1,
        "title": "Open Flashcard Set",
        "desc": "Log in to quizlet.com and select any exam revision flashcard deck."
      },
      {
        "step": 2,
        "title": "Launch Q-Chat",
        "desc": "Click the \"Q-Chat\" icon on the study activity menu."
      },
      {
        "step": 3,
        "title": "Choose Practice Mode",
        "desc": "Select \"Quiz me\", \"Teach me\", or \"Apply my knowledge in a story\"."
      },
      {
        "step": 4,
        "title": "Answer Socratic Prompts",
        "desc": "Respond to conversational questions; if you get it wrong, Q-Chat provides clues."
      },
      {
        "step": 5,
        "title": "Review Weak Cards",
        "desc": "Q-Chat automatically flags terms you struggled with for targeted re-drilling."
      }
    ],
    "prompts": [
      {
        "title": "Marathi Grammar Drill",
        "text": "Quiz me on Marathi Sandhi (संधी) rules and types with 5 challenging examples, explaining the vowel combination in each."
      },
      {
        "title": "Polity Amendments Quiz",
        "text": "Test my knowledge on major Constitutional Amendments (42nd, 44th, 73rd, 86th, 101st) through interactive scenario questions."
      }
    ],
    "limitations": "Free Quizlet tier includes daily Q-Chat study sessions; unlimited access requires Quizlet Plus.",
    "relatedSlugs": [
      "anki",
      "khanmigo",
      "socratic"
    ]
  },
  {
    "slug": "socratic",
    "name": "Socratic by Google",
    "tagline": "Visual homework solver and fundamental concept explainer powered by Google AI.",
    "category": "Study",
    "badge": "📱 Mobile Learning",
    "free": true,
    "url": "https://socratic.org",
    "logo": "lightbulb",
    "targetUsers": [
      "School & College Students",
      "Talathi Candidates",
      "Constable Aspirants",
      "Self Learners"
    ],
    "whatIs": "Socratic by Google uses optical character recognition and voice AI to analyze textbook questions, equations, and diagrams, instantly connecting students to curated explainers, animations, and step-by-step solutions.",
    "whyItMatters": "Enables rural and Marathi-medium aspirants to photograph difficult science or math problems and receive immediate visual breakdowns for free.",
    "steps": [
      {
        "step": 1,
        "title": "Download Socratic App",
        "desc": "Download Socratic by Google on Android or iOS (100% completely free, no ads)."
      },
      {
        "step": 2,
        "title": "Snap Photo of Question",
        "desc": "Take a picture of any printed math equation, physics problem, or biology diagram."
      },
      {
        "step": 3,
        "title": "Crop & Confirm",
        "desc": "Adjust crop handles around the exact question text."
      },
      {
        "step": 4,
        "title": "View Visual Breakdown",
        "desc": "Socratic displays step-by-step mathematical solutions, visual cards, and YouTube explainers."
      },
      {
        "step": 5,
        "title": "Explore Concept Tree",
        "desc": "Scroll through foundational underlying concepts to master why the answer works."
      }
    ],
    "prompts": [
      {
        "title": "Quadratic Equation Solver",
        "text": "Solve 2x^2 + 5x - 12 = 0 by factorization method, showing intermediate split terms clearly."
      },
      {
        "title": "Physics Optics Ray Diagram",
        "text": "Explain image formation by a concave mirror when the object is placed between focus and center of curvature."
      }
    ],
    "limitations": "Primarily mobile-first app experience. Best for high school and general foundational science/math concepts.",
    "relatedSlugs": [
      "photomath",
      "mathway",
      "wolfram-alpha"
    ]
  },
  {
    "slug": "tome",
    "name": "Tome AI",
    "tagline": "Generative storytelling and presentation builder for executive briefings.",
    "category": "Presentation",
    "badge": "📊 Executive Slides",
    "free": true,
    "url": "https://tome.app",
    "logo": "slideshow",
    "targetUsers": [
      "Interview Candidates",
      "Project Presenters",
      "Educators",
      "Administrators"
    ],
    "whatIs": "Tome turns any outline, policy document, or topic prompt into a visually captivating, multi-page slide deck complete with AI-generated narrative copy, titles, and illustrative imagery.",
    "whyItMatters": "Great for preparing administrative case study decks, interview presentations, and public seminar slides in under 2 minutes.",
    "steps": [
      {
        "step": 1,
        "title": "Open Tome.app",
        "desc": "Sign in to tome.app with free starter credits."
      },
      {
        "step": 2,
        "title": "Type Prompt Command",
        "desc": "Click \"Create\" and type: \"Create a presentation on Maharashtra Smart Cities Mission milestones and challenges\"."
      },
      {
        "step": 3,
        "title": "Review Generated Outline",
        "desc": "Tome generates an 8-slide outline with titles and structure."
      },
      {
        "step": 4,
        "title": "Generate Full Deck",
        "desc": "Click generate; Tome builds slides with paragraphs, headers, and AI visuals."
      },
      {
        "step": 5,
        "title": "Customize & Present",
        "desc": "Adjust text, replace visuals with official charts, and present in full-screen mode."
      }
    ],
    "prompts": [
      {
        "title": "Administrative Reform Deck",
        "text": "Create a 6-slide presentation on \"Digital Governance in Maharashtra: Aaple Sarkar Portal impact on citizen service delivery\"."
      },
      {
        "title": "Disaster Management Plan",
        "text": "Generate an executive slide deck detailing standard operating procedures for coastal cyclone preparedness and evacuation."
      }
    ],
    "limitations": "Free plan uses starter credit allocation. Exporting to PDF requires Pro tier on newer Tome plans.",
    "relatedSlugs": [
      "gamma",
      "napkin",
      "beautiful-ai"
    ]
  },
  {
    "slug": "decktopus",
    "name": "Decktopus AI",
    "tagline": "Instant presentation generator with tailored layouts, speaker notes, and scripts.",
    "category": "Presentation",
    "badge": "🎙️ Speaker Notes",
    "free": true,
    "url": "https://www.decktopus.com",
    "logo": "co_present",
    "targetUsers": [
      "Public Speakers",
      "Mock Interviewees",
      "Coaching Faculties",
      "Students"
    ],
    "whatIs": "Decktopus AI asks for your presentation topic, audience, and objective, then automatically produces complete slides with custom layouts, talking points, and timed speaker notes for each slide.",
    "whyItMatters": "Helps aspirants and teachers structure mock interview briefings, lecture webinars, and study group sessions with professional visual hierarchy.",
    "steps": [
      {
        "step": 1,
        "title": "Start with Topic",
        "desc": "Go to decktopus.com and enter your topic title."
      },
      {
        "step": 2,
        "title": "Define Target Audience",
        "desc": "Specify audience (e.g. \"Civil service aspirants\") and target duration (e.g. \"15 minutes\")."
      },
      {
        "step": 3,
        "title": "Pick Visual Theme",
        "desc": "Choose a minimalist corporate or clean academic theme."
      },
      {
        "step": 4,
        "title": "Review Generated Slides",
        "desc": "Decktopus builds slides with bullet points, icons, and automated speaker notes."
      },
      {
        "step": 5,
        "title": "Rehearse with Notes",
        "desc": "Use speaker view to practice verbal delivery while reading AI-generated talking points."
      }
    ],
    "prompts": [
      {
        "title": "Mock Interview Case Study",
        "text": "Build an 8-slide deck presenting a comprehensive administrative strategy to tackle urban waterlogging in Mumbai."
      },
      {
        "title": "Constitution Day Lecture",
        "text": "Create a presentation on the making of the Indian Constitution, role of the Drafting Committee, and Preamble philosophy."
      }
    ],
    "limitations": "Free tier limits the number of AI-generated slide decks and export formats.",
    "relatedSlugs": [
      "gamma",
      "tome",
      "piktochart"
    ]
  },
  {
    "slug": "wordtune",
    "name": "Wordtune",
    "tagline": "AI sentence rephraser, clarity enhancer, and formal tone transformer.",
    "category": "Writing",
    "badge": "✍️ Style Rephraser",
    "free": true,
    "url": "https://www.wordtune.com",
    "logo": "edit_note",
    "targetUsers": [
      "English Paper Aspirants",
      "Essay Writers",
      "MPSC Mains Candidates",
      "Job Applicants"
    ],
    "whatIs": "Wordtune analyzes your writing and offers alternative sentence structures with options to make it more casual, formal, shorter, or expanded, while preserving the original meaning.",
    "whyItMatters": "Helps non-native English speakers elevate essays, formal administrative letters, and Mains answers to articulate, professional bureaucratic English.",
    "steps": [
      {
        "step": 1,
        "title": "Open Wordtune Editor",
        "desc": "Visit wordtune.com or install the Chrome browser extension."
      },
      {
        "step": 2,
        "title": "Paste Your Draft",
        "desc": "Paste your essay paragraph, SOP, or letter."
      },
      {
        "step": 3,
        "title": "Highlight Sentence",
        "desc": "Select any sentence that feels clunky, repetitive, or informal."
      },
      {
        "step": 4,
        "title": "Click \"Formal\" or \"Shorten\"",
        "desc": "Wordtune displays 5 alternative phrased versions with varied vocabulary."
      },
      {
        "step": 5,
        "title": "Select Best Fit",
        "desc": "Click to replace the sentence with the refined, crisp formulation."
      }
    ],
    "prompts": [
      {
        "title": "Elevate Mains Conclusion",
        "text": "Rephrase this conclusion into formal administrative diction: \"So government should do something fast to stop farmers from having debts and make schemes reach them.\""
      },
      {
        "title": "Formal Representation Tone",
        "text": "Make this letter excerpt formal and respectful: \"I am writing this because your answer key has a mistake in question number 42 and my option is right.\""
      }
    ],
    "limitations": "Free tier gives 10 daily rewrites and basic summaries. Unlimited rewrites require premium.",
    "relatedSlugs": [
      "quillbot",
      "grammarly",
      "hemingway"
    ]
  },
  {
    "slug": "rytr",
    "name": "Rytr",
    "tagline": "Fast, lightweight AI writing assistant for study notes, essays, and official emails.",
    "category": "Writing",
    "badge": "⚡ 10k Free Chars/Mo",
    "free": true,
    "url": "https://rytr.me",
    "logo": "history_edu",
    "targetUsers": [
      "Content Writers",
      "Aspirants",
      "Email Drafters",
      "Application Writers"
    ],
    "whatIs": "Rytr is an intuitive AI copywriting assistant supporting 30+ languages, 20+ tones of voice, and 40+ use-cases, from cover letters and blog posts to essay outlines and official communication.",
    "whyItMatters": "Quickly draft formal RTI requests, representations to recruiting commissions, and essay introductions with balanced administrative vocabulary.",
    "steps": [
      {
        "step": 1,
        "title": "Open Rytr App",
        "desc": "Sign up free at rytr.me (includes 10,000 characters free every month)."
      },
      {
        "step": 2,
        "title": "Select Language & Tone",
        "desc": "Choose English, Marathi, or Hindi, and set tone to \"Formal\", \"Convincing\", or \"Informative\"."
      },
      {
        "step": 3,
        "title": "Choose Use Case",
        "desc": "Select \"Blog Outline\", \"Email\", or \"Job Description\"."
      },
      {
        "step": 4,
        "title": "Provide Key Keywords",
        "desc": "Input your topic: \"RTI application seeking cutoff marks for Talathi Exam 2023\"."
      },
      {
        "step": 5,
        "title": "Click Ryte for Me",
        "desc": "Generate and edit the output in Rytr's rich-text document editor."
      }
    ],
    "prompts": [
      {
        "title": "RTI Application Draft",
        "text": "Draft a formal Right to Information (RTI) application addressed to the Public Information Officer requesting certified copies of OMR answer sheets."
      },
      {
        "title": "Essay Section Outline",
        "text": "Generate an essay outline on \"Artificial Intelligence in Indian Agriculture: Opportunities, Ethics, and Rural Challenges\"."
      }
    ],
    "limitations": "Free tier capped at 10,000 characters per month. Long-form book writing requires premium subscription.",
    "relatedSlugs": [
      "copy-ai",
      "claude",
      "quillbot"
    ]
  },
  {
    "slug": "hix-ai",
    "name": "HIX.AI",
    "tagline": "All-in-one AI writing copilot, academic summarizer, and multi-format document creator.",
    "category": "Writing",
    "badge": "🛠️ All-in-One Copilot",
    "free": true,
    "url": "https://hix.ai",
    "logo": "article",
    "targetUsers": [
      "Essayists",
      "Academic Writers",
      "Researchers",
      "Students"
    ],
    "whatIs": "HIX.AI provides 120+ specialized AI writing tools including long-form essay writers, grammar checkers, paraphrasers, and YouTube video summarizers in one unified interface.",
    "whyItMatters": "Summarize 2-hour editorial discussions from YouTube or long gazette PDFs into crisp essay points and debate arguments.",
    "steps": [
      {
        "step": 1,
        "title": "Visit HIX.AI",
        "desc": "Go to hix.ai and browse the 120+ AI writing tools available."
      },
      {
        "step": 2,
        "title": "Select Specific Tool",
        "desc": "Pick \"Essay Writer\", \"Grammar Checker\", or \"YouTube Summarizer\"."
      },
      {
        "step": 3,
        "title": "Input Prompt or URL",
        "desc": "Paste an editorial URL, video link, or raw essay draft."
      },
      {
        "step": 4,
        "title": "Generate Content",
        "desc": "Get structured thesis statements, supporting arguments, and concluding remarks."
      },
      {
        "step": 5,
        "title": "Export & Proofread",
        "desc": "Copy the proofread text directly into your notes or word processor."
      }
    ],
    "prompts": [
      {
        "title": "Editorial Debate Summary",
        "text": "Summarize the arguments for and against \"Simultaneous Elections (One Nation One Election)\" from a constitutional and federal perspective."
      },
      {
        "title": "Academic Grammar Polish",
        "text": "Proofread and polish this 250-word answer on Judicial Activism vs Judicial Overreach, fixing syntax and ensuring formal academic prose."
      }
    ],
    "limitations": "Free plan provides basic words credit per week. Advanced GPT-4o output requires premium credits.",
    "relatedSlugs": [
      "quillbot",
      "copy-ai",
      "hemingway"
    ]
  },
  {
    "slug": "fireflies",
    "name": "Fireflies.ai",
    "tagline": "Automated meeting, lecture, and discussion transcription with AI summaries.",
    "category": "Productivity",
    "badge": "🎙️ Voice Transcriber",
    "free": true,
    "url": "https://fireflies.ai",
    "logo": "graphic_eq",
    "targetUsers": [
      "Group Study Circles",
      "Online Webinar Students",
      "Coaching Batches",
      "Professionals"
    ],
    "whatIs": "Fireflies.ai connects to Google Meet, Zoom, and Teams to automatically record, transcribe, and summarize audio discussions, identifying key action items, topic timestamps, and speaker sentiments.",
    "whyItMatters": "Record online peer study circle discussions or coaching lectures and receive complete, searchable transcripts with key bullet points automatically.",
    "steps": [
      {
        "step": 1,
        "title": "Connect Fireflies",
        "desc": "Sign up at fireflies.ai with Google/Outlook account."
      },
      {
        "step": 2,
        "title": "Invite Bot to Call",
        "desc": "Add fred@fireflies.ai to your Google Meet or Zoom study group calendar invite."
      },
      {
        "step": 3,
        "title": "Hold Study Session",
        "desc": "Conduct your 1-hour peer revision session naturally as Fireflies records."
      },
      {
        "step": 4,
        "title": "Review Auto-Summary",
        "desc": "Within 5 minutes of call completion, view full transcript, bullet summary, and action items."
      },
      {
        "step": 5,
        "title": "Search Audio by Keyword",
        "desc": "Search for terms like \"Article 21\" to jump to the exact audio second it was discussed."
      }
    ],
    "prompts": [
      {
        "title": "Study Circle Summary",
        "text": "Generate an executive summary of this study call, listing all topics discussed, doubts raised, and chapters assigned for tomorrow."
      },
      {
        "title": "Action Item Extraction",
        "text": "Extract all study deadlines, mock test targets, and syllabus milestones mentioned by members during the session."
      }
    ],
    "limitations": "Free tier includes 800 minutes of storage and limited AI summary credits per month.",
    "relatedSlugs": [
      "otter",
      "tldv",
      "fathom"
    ]
  },
  {
    "slug": "fathom",
    "name": "Fathom AI",
    "tagline": "Free AI meeting recorder that highlights, transcribes, and summarizes online sessions.",
    "category": "Productivity",
    "badge": "⭐ 100% Free Recorder",
    "free": true,
    "url": "https://fathom.video",
    "logo": "videocam",
    "targetUsers": [
      "Online Coaching Students",
      "Mentors",
      "Study Groups",
      "Interviewees"
    ],
    "whatIs": "Fathom is a meeting copilot that records, transcribes, and generates instant actionable summaries for Zoom, Meet, and Teams calls with zero transcription limits on its free tier.",
    "whyItMatters": "Allows aspirants to participate in live masterclasses and mock interview debriefs without wasting time manually jotting down notes.",
    "steps": [
      {
        "step": 1,
        "title": "Install Fathom App",
        "desc": "Install Fathom on your desktop or browser from fathom.video."
      },
      {
        "step": 2,
        "title": "Start Online Class",
        "desc": "Click \"Record\" when joining your Zoom or Google Meet coaching session."
      },
      {
        "step": 3,
        "title": "Click \"Highlight\" During Lecture",
        "desc": "Press the highlight button whenever the teacher shares an important exam tip."
      },
      {
        "step": 4,
        "title": "Instant Summary Generated",
        "desc": "The moment the call ends, get a structured summary divided by topics with timestamp links."
      },
      {
        "step": 5,
        "title": "Share with Batchmates",
        "desc": "Copy a clean summary link to share with your study group or save in Google Docs."
      }
    ],
    "prompts": [
      {
        "title": "Lecture Key Takeaways",
        "text": "Summarize the teacher's key takeaways from this Indian Economy session, focusing on Inflation metrics and RBI monetary policy tools."
      },
      {
        "title": "Mock Interview Feedback Log",
        "text": "Transcribe and organize the interviewer's feedback into: Strengths, Areas for Improvement, and Recommended Books."
      }
    ],
    "limitations": "Desktop app must be running during calls. Unlimited transcription is free for personal use.",
    "relatedSlugs": [
      "fireflies",
      "tldv",
      "otter"
    ]
  },
  {
    "slug": "harpa-ai",
    "name": "HARPA AI",
    "tagline": "Hybrid AI browser automation agent, page monitor, and web summarizer.",
    "category": "Productivity",
    "badge": "🤖 Browser Automation",
    "free": true,
    "url": "https://harpa.ai",
    "logo": "smart_toy",
    "targetUsers": [
      "Alert Seekers",
      "Researchers",
      "Competitive Candidates",
      "Web Power Users"
    ],
    "whatIs": "HARPA AI is a Chrome extension that blends web automation with AI. It can track government portal pages for notification changes, summarize articles, extract tables into Excel, and write auto-replies.",
    "whyItMatters": "Track official commission websites (MPSC, SSC, Police) for new PDF uploads or merit list releases and receive instant browser notifications.",
    "steps": [
      {
        "step": 1,
        "title": "Install HARPA Extension",
        "desc": "Add HARPA AI extension to Google Chrome or Brave browser."
      },
      {
        "step": 2,
        "title": "Open Government Portal",
        "desc": "Navigate to an official exam notification page (e.g. mpsc.gov.in)."
      },
      {
        "step": 3,
        "title": "Set Page Monitor",
        "desc": "Type /monitor and select the notification table to check for updates every 30 minutes."
      },
      {
        "step": 4,
        "title": "Summarize Web Articles",
        "desc": "On any editorial, press Alt+A and type /summary to get 5 bullet point insights."
      },
      {
        "step": 5,
        "title": "Extract Tables to Sheets",
        "desc": "Use /extract to convert HTML merit list tables directly into copyable CSV format."
      }
    ],
    "prompts": [
      {
        "title": "Track Result Notification",
        "text": "Monitor this portal section for any new row containing \"Result\" or \"Merit List\", and alert me when the HTML content changes."
      },
      {
        "title": "Editorial 3-Minute Brief",
        "text": "Extract the central thesis, supporting empirical data, and policy recommendations from this 2000-word editorial."
      }
    ],
    "limitations": "Runs locally in your desktop browser; browser must remain open for periodic page monitoring tasks.",
    "relatedSlugs": [
      "monica",
      "sider",
      "notion-ai"
    ]
  },
  {
    "slug": "monica",
    "name": "Monica AI",
    "tagline": "All-in-one AI copilot sidebar for chatting with web pages, PDFs, and videos.",
    "category": "Productivity",
    "badge": "🌐 Universal Sidebar",
    "free": true,
    "url": "https://monica.im",
    "logo": "splitscreen",
    "targetUsers": [
      "Online Researchers",
      "Speed Readers",
      "Students",
      "General Aspirants"
    ],
    "whatIs": "Monica is a browser sidebar powered by leading AI models (Claude, GPT, Gemini) that allows you to chat with any open webpage, highlight foreign words for instant translation, and summarize PDFs on the fly.",
    "whyItMatters": "Read English The Hindu or Indian Express editorials with inline translations into Marathi and instant contextual definitions of legal terms.",
    "steps": [
      {
        "step": 1,
        "title": "Install Extension",
        "desc": "Install Monica from monica.im on Chrome or Edge."
      },
      {
        "step": 2,
        "title": "Hit Shortcut",
        "desc": "Press Ctrl+M (or Cmd+M on Mac) on any webpage to bring up the sidebar."
      },
      {
        "step": 3,
        "title": "Chat With Page",
        "desc": "Click \"Chat with this page\" to ask questions about the current article without copying text."
      },
      {
        "step": 4,
        "title": "Summarize YouTube Videos",
        "desc": "Open any educational lecture video and click Monica's \"Summarize Video\" button."
      },
      {
        "step": 5,
        "title": "Translate Complex Sentences",
        "desc": "Highlight difficult sentences to get nuanced bilingual translations in Marathi or Hindi."
      }
    ],
    "prompts": [
      {
        "title": "Explain Gazette Clause",
        "text": "What are the exact eligibility criteria, cutoff age dates, and application fee waivers stated on this government webpage?"
      },
      {
        "title": "Editorial Counter-Arguments",
        "text": "What counter-arguments could an opponent raise against the author's stance in this editorial column?"
      }
    ],
    "limitations": "Free tier provides daily free AI credits. Advanced Claude 3.5 Sonnet queries consume more credits.",
    "relatedSlugs": [
      "sider",
      "harpa-ai",
      "perplexity"
    ]
  },
  {
    "slug": "sider",
    "name": "Sider AI",
    "tagline": "Browser sidebar assistant integrating ChatGPT, Claude, and Gemini for instant reading.",
    "category": "Productivity",
    "badge": "📑 Multimodel Sidebar",
    "free": true,
    "url": "https://sider.ai",
    "logo": "side_navigation",
    "targetUsers": [
      "Daily Readers",
      "Editorial Analyzers",
      "College Students",
      "Job Seekers"
    ],
    "whatIs": "Sider embeds a multi-model AI sidebar directly into Chrome/Edge. It allows users to explain, summarize, translate, or rewrite text from any webpage without leaving their current tab.",
    "whyItMatters": "Analyze complex government statistical tables and press releases while reading them on PIB or RBI portals.",
    "steps": [
      {
        "step": 1,
        "title": "Add to Chrome",
        "desc": "Install Sider from the Chrome Web Store via sider.ai."
      },
      {
        "step": 2,
        "title": "Choose AI Engine",
        "desc": "Switch between ChatGPT 4o-mini, Claude 3.5 Haiku, or Gemini 1.5 in one unified sidebar."
      },
      {
        "step": 3,
        "title": "Select Text for Quick Bar",
        "desc": "Highlight any text to see instant floating buttons: Explain, Translate, Grammar, Rephrase."
      },
      {
        "step": 4,
        "title": "Chat with Uploaded PDFs",
        "desc": "Drop syllabus or PYQ PDF directly into the sidebar to query questions."
      },
      {
        "step": 5,
        "title": "Compare Responses",
        "desc": "Use multi-model compare to see how two different models answer the same analytical prompt."
      }
    ],
    "prompts": [
      {
        "title": "PIB Press Release Digest",
        "text": "Break down this PIB cabinet decision release into: 1) Scheme Name, 2) Ministry, 3) Outlay Budget, 4) Target Beneficiaries."
      },
      {
        "title": "Legal Term Clarifier",
        "text": "Define the legal term \"Certiorari\" and explain how it differs from \"Prohibition\" with real-world constitutional exam examples."
      }
    ],
    "limitations": "Free plan has 30 daily basic query credits. Heavy daily users may need to upgrade.",
    "relatedSlugs": [
      "monica",
      "harpa-ai",
      "chatgpt"
    ]
  },
  {
    "slug": "humata",
    "name": "Humata AI",
    "tagline": "Chat with complex documents, technical gazettes, and legal acts with instant citations.",
    "category": "Study",
    "badge": "📄 Document Intel",
    "free": true,
    "url": "https://www.humata.ai",
    "logo": "description",
    "targetUsers": [
      "Law Students",
      "UPSC Law Optional",
      "MPSC Aspirants",
      "Govt Policy Analysts"
    ],
    "whatIs": "Humata AI lets you upload complex PDFs (up to 60 pages free) and ask natural language questions. It quotes the exact page, highlights clauses, and writes syntheses 10x faster.",
    "whyItMatters": "Navigate dense 200-page Acts (e.g. RTI Act, Bharatiya Nyaya Sanhita, Maharashtra Land Revenue Code) and pinpoint penalties, definitions, and exceptions instantly.",
    "steps": [
      {
        "step": 1,
        "title": "Go to Humata.ai",
        "desc": "Sign in to humata.ai with a free account."
      },
      {
        "step": 2,
        "title": "Upload Government Act PDF",
        "desc": "Upload statutory acts, departmental gazettes, or court judgments."
      },
      {
        "step": 3,
        "title": "Ask Questions",
        "desc": "Type queries like: \"What are the penal provisions for non-compliance under Section 19?\"."
      },
      {
        "step": 4,
        "title": "View Direct Page Quotes",
        "desc": "Humata highlights the exact sentence on the PDF page proving the answer."
      },
      {
        "step": 5,
        "title": "Export Summaries",
        "desc": "Generate section-by-section study notes and export to your revision binder."
      }
    ],
    "prompts": [
      {
        "title": "Statutory Act Query",
        "text": "What exceptions to disclosure are provided under Section 8 of the Right to Information Act 2005? List with sub-clauses."
      },
      {
        "title": "Govt Resolution (GR) Summary",
        "text": "What is the date of implementation and which government departments are bound by this Government Resolution (GR)?"
      }
    ],
    "limitations": "Free account allows documents up to 60 pages and 60 questions per month.",
    "relatedSlugs": [
      "chatpdf",
      "notebooklm",
      "pdf-gear"
    ]
  },
  {
    "slug": "pdf-gear",
    "name": "PDFgear AI",
    "tagline": "100% free full-featured PDF editor and AI Copilot with zero page limits.",
    "category": "Study",
    "badge": "💯 100% Free / No Limits",
    "free": true,
    "url": "https://www.pdfgear.com",
    "logo": "picture_as_pdf",
    "targetUsers": [
      "All Aspirants",
      "Government Staff",
      "College Students",
      "Self Learners"
    ],
    "whatIs": "PDFgear is a completely free Windows/Mac/Web PDF editor that includes an integrated GPT-powered AI Copilot. Unlike online tools with strict 5-page limits, PDFgear chats with whole textbooks without subscriptions.",
    "whyItMatters": "A rare genuinely free, watermark-free tool for highlighting, annotating, merging, and AI-querying 500-page Laxmikanth or NCERT textbooks.",
    "steps": [
      {
        "step": 1,
        "title": "Download PDFgear",
        "desc": "Download free from pdfgear.com for Windows, Mac, or iOS."
      },
      {
        "step": 2,
        "title": "Open Any Large PDF",
        "desc": "Open complete 400-page textbooks, PYQ books, or compilations."
      },
      {
        "step": 3,
        "title": "Open Copilot Sidebar",
        "desc": "Click the \"Chat with PDF\" icon in the right sidebar."
      },
      {
        "step": 4,
        "title": "Ask Any Concept",
        "desc": "Ask: \"Summarize Chapter 14 on Center-State Relations into 5 main bullet points\"."
      },
      {
        "step": 5,
        "title": "Edit & Annotate",
        "desc": "Highlight text, add sticky notes, and compress PDF directly in the same window."
      }
    ],
    "prompts": [
      {
        "title": "Chapter Summary",
        "text": "Summarize the core themes and key conclusions of Chapter 3 in this textbook with reference page numbers."
      },
      {
        "title": "Extract MCQ Questions",
        "text": "Generate 15 challenging multiple choice questions based on the uploaded history chapter with answer keys."
      }
    ],
    "limitations": "Completely free with no paywall, but requires desktop app download for processing large multi-hundred-page files offline.",
    "relatedSlugs": [
      "chatpdf",
      "notebooklm",
      "humata"
    ]
  },
  {
    "slug": "resume-worded",
    "name": "Resume Worded",
    "tagline": "AI resume and LinkedIn scoring platform with recruiter feedback and ATS insights.",
    "category": "Career",
    "badge": "🎯 ATS Resume Score",
    "free": true,
    "url": "https://resumeworded.com",
    "logo": "badge",
    "targetUsers": [
      "Corporate Job Seekers",
      "Banking Aspirants",
      "Engineering Graduates",
      "Career Changers"
    ],
    "whatIs": "Resume Worded grades your CV against 50+ ATS metrics (action verbs, quantifiable metrics, formatting, bullet point strength) and suggests line-by-line rewrites based on top recruiter datasets.",
    "whyItMatters": "Essential for candidates applying to PSU management trainee positions, private sector backups, and IT specialist roles.",
    "steps": [
      {
        "step": 1,
        "title": "Upload Resume PDF",
        "desc": "Go to resumeworded.com and upload your current resume in PDF format."
      },
      {
        "step": 2,
        "title": "Get Instant Score (0-100)",
        "desc": "View your overall ATS compatibility score and category breakdown."
      },
      {
        "step": 3,
        "title": "Review Bullet Point Critiques",
        "desc": "Identify weak bullet points that lack metrics (e.g. \"managed project\" vs \"managed 5 engineers to deliver 15% faster\")."
      },
      {
        "step": 4,
        "title": "Apply Sample Rewrites",
        "desc": "Browse hundreds of recruiter-written bullet point formulas for your specific field."
      },
      {
        "step": 5,
        "title": "Re-upload to Verify",
        "desc": "Re-upload your updated resume to confirm your score exceeds 80+."
      }
    ],
    "prompts": [
      {
        "title": "Bullet Point Quantifier",
        "text": "Rewrite this resume line with strong action verbs and quantifiable metrics: \"Worked on state scholarship distribution portal and solved student complaints.\""
      },
      {
        "title": "PSU Application Summary",
        "text": "Draft a professional 3-sentence summary for a Mechanical Engineer applying for BHEL / IOCL Management Trainee position."
      }
    ],
    "limitations": "Free account provides comprehensive resume score and high-priority fixes; full line-by-line rewrite library requires Pro.",
    "relatedSlugs": [
      "kickresume",
      "enhancv",
      "linkedin-ai"
    ]
  },
  {
    "slug": "enhancv",
    "name": "Enhancv AI",
    "tagline": "Modern resume and CV builder with AI content suggestions and sleek layouts.",
    "category": "Career",
    "badge": "👔 Visual CV",
    "free": true,
    "url": "https://enhancv.com",
    "logo": "contact_page",
    "targetUsers": [
      "Graduates",
      "Civil Service Interviewees",
      "Career Starters",
      "Executives"
    ],
    "whatIs": "Enhancv helps candidates craft visually impressive, professional resumes with AI-assisted phrasing, skill highlights, and recruiter-approved modern templates.",
    "whyItMatters": "Create polished Detailed Application Forms (DAF) summaries, bio-data profiles for commission interviews, and corporate backup CVs.",
    "steps": [
      {
        "step": 1,
        "title": "Select Modern Template",
        "desc": "Visit enhancv.com and choose from contemporary, clean resume layouts."
      },
      {
        "step": 2,
        "title": "Input Education & Experience",
        "desc": "Fill in your academic degrees, graduation projects, and competitive exams qualified."
      },
      {
        "step": 3,
        "title": "Use AI Content Generator",
        "desc": "Click AI Suggest to automatically craft impactful job descriptions based on your role."
      },
      {
        "step": 4,
        "title": "Add Personal Character Section",
        "desc": "Add sections for \"Core Philosophy\", \"Books That Shaped Me\", or \"Proudest Achievement\"."
      },
      {
        "step": 5,
        "title": "Export ATS-Ready PDF",
        "desc": "Download a clean, machine-readable PDF for job portals and interview panels."
      }
    ],
    "prompts": [
      {
        "title": "Interview Bio-Data Summary",
        "text": "Write a compelling 60-word professional bio for an MPSC interview candidate with a Computer Engineering degree and passion for rural digital literacy."
      },
      {
        "title": "Extracurricular Achievement Phrasing",
        "text": "Phrase participation in NSS (National Service Scheme) rural village development camp as a leadership achievement on a CV."
      }
    ],
    "limitations": "Free version allows building and downloading basic resume with small Enhancv branding footer.",
    "relatedSlugs": [
      "kickresume",
      "resume-worded",
      "canva"
    ]
  },
  {
    "slug": "flowgpt",
    "name": "FlowGPT",
    "tagline": "Global prompt community and interactive AI bots for learning, coding, and exam prep.",
    "category": "AI Hub",
    "badge": "🌐 Prompt Library",
    "free": true,
    "url": "https://flowgpt.com",
    "logo": "hub",
    "targetUsers": [
      "Prompt Engineers",
      "Self Learners",
      "Aspirants",
      "Creatives"
    ],
    "whatIs": "FlowGPT is one of the world's largest open prompt-sharing platforms where millions of users test, share, and chat with specialized AI personas, from UPSC Socratic examiners to language tutors.",
    "whyItMatters": "Access hundreds of ready-to-run prompt templates specifically created for competitive exam interview practice, syllabus pacing, and essay critique.",
    "steps": [
      {
        "step": 1,
        "title": "Visit FlowGPT",
        "desc": "Navigate to flowgpt.com and explore top trending prompts for education."
      },
      {
        "step": 2,
        "title": "Search Exam Bots",
        "desc": "Search for \"UPSC\", \"MPSC\", \"History Tutor\", or \"Math Coach\"."
      },
      {
        "step": 3,
        "title": "Chat Directly in Browser",
        "desc": "Interact with community-crafted AI agents directly inside FlowGPT's chat interface."
      },
      {
        "step": 4,
        "title": "Copy Prompt Template",
        "desc": "Click \"Copy Prompt\" to use the specialized instructions inside your own ChatGPT or Claude."
      },
      {
        "step": 5,
        "title": "Save to Favorites",
        "desc": "Bookmark high-yield study prompts to your personal library for quick daily practice."
      }
    ],
    "prompts": [
      {
        "title": "Strict UPSC Interviewer Persona",
        "text": "Act as a senior UPSC board chairman. Grill me on my decision to pursue civil services after an engineering degree. Be skeptical, concise, and challenge every justification."
      },
      {
        "title": "Socratic History Debate",
        "text": "Engage me in a Socratic dialogue examining whether the 1857 revolt was a sepoy mutiny or the first war of Indian independence."
      }
    ],
    "limitations": "Community-submitted prompts vary in quality; always verify factual assertions independently.",
    "relatedSlugs": [
      "poe",
      "chatgpt",
      "claude"
    ]
  },
  {
    "slug": "claude-artifacts",
    "name": "Claude Artifacts",
    "tagline": "Interactive sandboxed UI, study flashcard apps, and dynamic charts inside AI chat.",
    "category": "Productivity",
    "badge": "⚡ Interactive Apps",
    "free": true,
    "url": "https://claude.ai",
    "logo": "developer_board",
    "targetUsers": [
      "Visual Learners",
      "Educators",
      "Developers",
      "Aspirants"
    ],
    "whatIs": "Claude Artifacts by Anthropic lets users generate interactive React components, SVG diagrams, flashcard mini-apps, and timelines in a dedicated side-by-side interactive window alongside chat.",
    "whyItMatters": "Ask Claude to \"create an interactive timeline of Indian freedom struggle\" or \"a formula calculator for simple and compound interest\" and run the app right inside your browser.",
    "steps": [
      {
        "step": 1,
        "title": "Open Claude.ai",
        "desc": "Sign in to claude.ai with free tier access."
      },
      {
        "step": 2,
        "title": "Request Interactive Artifact",
        "desc": "Ask: \"Create an interactive flashcard quiz app in React to test the Fundamental Rights of Indian Constitution\"."
      },
      {
        "step": 3,
        "title": "View Side-by-Side Window",
        "desc": "Claude displays the live, clickable application in the right Artifacts pane."
      },
      {
        "step": 4,
        "title": "Interact & Test",
        "desc": "Click through cards, submit answers, and test your knowledge directly inside the chat window."
      },
      {
        "step": 5,
        "title": "Copy Code or Remix",
        "desc": "Copy the complete React/HTML code or ask Claude to add timer and score counter features."
      }
    ],
    "prompts": [
      {
        "title": "Interactive Timeline App",
        "text": "Create an interactive React timeline of the Indian National Movement from 1885 to 1947. Clicking any event should show key leaders and historical significance."
      },
      {
        "title": "CSAT Speed Math Trainer",
        "text": "Build an interactive web app that flashes 2-digit multiplication problems with a 10-second countdown timer and score tracker."
      }
    ],
    "limitations": "Free tier has daily message limits on Claude.ai based on server demand.",
    "relatedSlugs": [
      "claude",
      "v0",
      "bolt"
    ]
  }
]

// Slug aliases map to ensure zero 404s
const SLUG_ALIASES = {
  // Anki
  ankiapp: 'anki',
  'anki-app': 'anki',

  // Google NotebookLM
  notebook_lm: 'notebooklm',
  'notebook-lm': 'notebooklm',

  // Connected Papers
  connectedpapers: 'connected-papers',
  'connected_papers': 'connected-papers',

  // Semantic Scholar
  semanticscholar: 'semantic-scholar',
  'semantic_scholar': 'semantic-scholar',

  // Julius AI
  juliusai: 'julius',
  'julius-ai': 'julius',

  // DeepSeek
  'deepseek-r1': 'deepseek',
  deepseekr1: 'deepseek',
  'deepseek-v3': 'deepseek',
  deepseekv3: 'deepseek',

  // ChatPDF
  chat_pdf: 'chatpdf',
  'chat-pdf': 'chatpdf',

  // GitHub Copilot
  copilot: 'github-copilot',
  'github_copilot': 'github-copilot',
  githubcopilot: 'github-copilot',

  // Cursor
  cursorai: 'cursor',
  'cursor-ai': 'cursor',
  'cursor-ide': 'cursor',
  cursoride: 'cursor',

  // Gamma
  'gamma-app': 'gamma',
  gammaapp: 'gamma',

  // Napkin AI
  'napkin-ai': 'napkin',
  napkinai: 'napkin',
  'napkin_ai': 'napkin',

  // Canva AI
  canvaai: 'canva',
  'canva-ai': 'canva',

  // Ideogram
  ideogramai: 'ideogram',
  'ideogram-ai': 'ideogram',

  // Google Gemini
  'google-gemini': 'gemini',
  'gemini-ai': 'gemini',
  geminiai: 'gemini',

  // ChatGPT
  gpt4: 'chatgpt',
  'gpt-4': 'chatgpt',
  'gpt-4o': 'chatgpt',
  openai: 'chatgpt',
  'chat-gpt': 'chatgpt',

  // Poe
  'poe-ai': 'poe',
  poeai: 'poe',
  quora: 'poe',
  'poe-by-quora': 'poe',

  // Otter.ai
  'otter-ai': 'otter',
  otterai: 'otter',

  // tl;dv
  'too-long-didnt-view': 'tldv',
  'tl-dv': 'tldv',

  // QuillBot
  quill_bot: 'quillbot',

  // Grammarly
  grammarlyai: 'grammarly',

  // Mathway
  'math-way': 'mathway',

  // Wolfram Alpha
  wolframalpha: 'wolfram-alpha',
  wolfram: 'wolfram-alpha',
  'wolfram_alpha': 'wolfram-alpha',

  // v0
  'v0-dev': 'v0',
  v0dev: 'v0',
  'v0_dev': 'v0',

  // Bolt.new
  'bolt-new': 'bolt',
  boltnew: 'bolt',
  'bolt_new': 'bolt',

  // Hugging Face
  'hugging-face': 'huggingface',
  hf: 'huggingface',
  'hugging_face': 'huggingface',

  // ── NEW ALIASES ─────────────────────────────────────────────────────────────

  // Meta AI
  'meta-ai': 'meta-ai',
  metaai: 'meta-ai',
  'llama-ai': 'meta-ai',
  llamaai: 'meta-ai',
  'whatsapp-ai': 'meta-ai',

  // Mistral
  'mistral-ai': 'mistral',
  mistralai: 'mistral',
  'le-chat': 'mistral',
  lechat: 'mistral',
  'mistral-large': 'mistral',

  // Grok
  'grok-ai': 'grok',
  grokai: 'grok',
  xai: 'grok',
  'x-ai': 'grok',
  'grok-3': 'grok',

  // Speechify
  'speechify-ai': 'speechify',
  speechifyai: 'speechify',

  // Notion AI
  notion: 'notion-ai',
  notionai: 'notion-ai',
  'notion_ai': 'notion-ai',

  // Khanmigo / Khan Academy
  khanacademy: 'khanmigo',
  'khan-academy': 'khanmigo',
  'khan-migo': 'khanmigo',

  // Photomath
  'photo-math': 'photomath',
  photomath: 'photomath',

  // Duolingo
  'duolingo-ai': 'duolingo',

  // Replit
  'replit-ai': 'replit',
  replitai: 'replit',

  // Kickresume
  kickresume: 'kickresume',
  'kick-resume': 'kickresume',
  'ai-resume': 'kickresume',

  // LinkedIn AI
  linkedin: 'linkedin-ai',
  'linkedin_ai': 'linkedin-ai',
  linkedinai: 'linkedin-ai',

  // Glasp
  'glasp-ai': 'glasp',
  glaspai: 'glasp',

  // Readwise
  'readwise-reader': 'readwise',
  'read-wise': 'readwise',

  // Descript
  'descript-ai': 'descript',
  descriptai: 'descript',

  // Loom
  'loom-ai': 'loom',
  loomai: 'loom',

  // Copy.ai
  copyai: 'copy-ai',
  'copy_ai': 'copy-ai',

  // Hemingway
  'hemingway-app': 'hemingway',
  hemingwayapp: 'hemingway',
  'hemingway-editor': 'hemingway',

  // Beautiful.ai
  beautifulai: 'beautiful-ai',
  'beautiful_ai': 'beautiful-ai',

  // Piktochart
  'piktochart-ai': 'piktochart',

  // Runway ML
  runwayml: 'runway',
  'runway-ml': 'runway',
  'runway-ai': 'runway',

  // Added 30 Free AI Tools Aliases
  'sunoai': 'suno',
  'suno-ai': 'suno',
  'kreaai': 'krea',
  'krea-ai': 'krea',
  'recraftai': 'recraft',
  'recraft-ai': 'recraft',
  'leonardoai': 'leonardo',
  'leonardo-ai': 'leonardo',
  'qwen-ai': 'qwen',
  'qwen2': 'qwen',
  'qwen-2-5': 'qwen',
  'qwenlm': 'qwen',
  'cohere-ai': 'cohere-coral',
  'cohere': 'cohere-coral',
  'coral': 'cohere-coral',
  'blackbox': 'blackbox-ai',
  'black-box': 'blackbox-ai',
  'tabnineai': 'tabnine',
  'tab-nine': 'tabnine',
  'you': 'you-com',
  'you-ai': 'you-com',
  'youcom': 'you-com',
  'typeset': 'scispace',
  'typeset-io': 'scispace',
  'sci-space': 'scispace',
  'researchrabbit': 'research-rabbit',
  'research-rabbit-ai': 'research-rabbit',
  'openknowledgemaps': 'open-knowledge-maps',
  'okmaps': 'open-knowledge-maps',
  'qchat': 'quizlet-qchat',
  'q-chat': 'quizlet-qchat',
  'quizlet': 'quizlet-qchat',
  'socratic-ai': 'socratic',
  'socratic-by-google': 'socratic',
  'tome-app': 'tome',
  'tomeai': 'tome',
  'tome-ai': 'tome',
  'decktopusai': 'decktopus',
  'decktopus-ai': 'decktopus',
  'word-tune': 'wordtune',
  'wordtuneai': 'wordtune',
  'rytrai': 'rytr',
  'rytr-ai': 'rytr',
  'hix': 'hix-ai',
  'hix-app': 'hix-ai',
  'firefliesai': 'fireflies',
  'fireflies-ai': 'fireflies',
  'fathomai': 'fathom',
  'fathom-ai': 'fathom',
  'harpa': 'harpa-ai',
  'harpa-extension': 'harpa-ai',
  'monicaai': 'monica',
  'monica-ai': 'monica',
  'siderai': 'sider',
  'sider-ai': 'sider',
  'humataai': 'humata',
  'humata-ai': 'humata',
  'pdfgear': 'pdf-gear',
  'pdf-gear-ai': 'pdf-gear',
  'resumeworded': 'resume-worded',
  'resume-worded-ai': 'resume-worded',
  'enhancvai': 'enhancv',
  'enhancv-ai': 'enhancv',
  'flow_gpt': 'flowgpt',
  'flow-gpt': 'flowgpt',
  'artifacts': 'claude-artifacts',
  'claude-artifact': 'claude-artifacts',
}

// Helper: get a tool by slug (with case-insensitivity and alias resolution)
export function getToolBySlug(slug) {
  if (!slug) return null
  const s = String(slug).toLowerCase().trim()
  const resolvedSlug = SLUG_ALIASES[s] || s
  return AI_TOOLS.find(t => t.slug.toLowerCase() === resolvedSlug) || null
}

// Helper: get related tools
export function getRelatedTools(tool) {
  if (!tool?.relatedSlugs) return []
  return tool.relatedSlugs
    .map(slug => getToolBySlug(slug))
    .filter(Boolean)
}

// All unique categories
export const AI_TOOL_CATEGORIES = [
  'All',
  'Study',
  'Research',
  'Writing',
  'Presentation',
  'Design',
  'Dev',
  'Productivity',
  'AI Hub',
  'Career',
]

