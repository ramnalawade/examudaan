// ============================================================
// app/ai-academy/page.js — ExamUdaan AI Academy
// Practical AI Courses & Live Cohorts for Students, Aspirants & Engineers
// Mentored by a 20-Year Enterprise Software Architect & AI Veteran
// Fully bilingual in Marathi & English using useLanguage()
// ============================================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import { SITE_CONFIG } from '../../lib/constants'

export default function AiAcademyPage() {
  const { isMarathi } = useLanguage()
  const [enquirySuccess, setEnquirySuccess] = useState(false)
  const [enquiryLoading, setEnquiryLoading] = useState(false)
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    course: 'track2_jobs',
    background: 'student',
  })

  const handleEnquiry = async (e) => {
    e.preventDefault()
    if (!enquiryForm.name || !enquiryForm.phone) return
    setEnquiryLoading(true)
    try {
      await fetch('/api/academy/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryForm),
      })
    } catch {
      // Don't block success UI
    }
    setEnquiryLoading(false)
    setEnquirySuccess(true)
  }

  const COURSES = [
    {
      id: 'track1_daily',
      badge: isMarathi ? 'पायाभूत कोर्स • सर्वांसाठी' : 'FOUNDATION • FOR EVERYONE',
      title: isMarathi ? 'ट्रॅक १: दैनंदिन जीवन, अभ्यास व उत्पादकतेसाठी AI' : 'Track 1: AI for Daily Life, Study & Extreme Productivity',
      duration: isMarathi ? '२ आठवड्यांचा वीकेंड कोर्स' : '2-Week Weekend Cohort',
      desc: isMarathi
        ? 'दैनंदिन अभ्यास, ईमेल्स, सरकारी पत्रव्यवहार आणि वेळेची बचत करण्यासाठी ChatGPT व Gemini चा १००% वापर.'
        : 'Master everyday prompt engineering, PDF study summarization, official drafting, and routine automations to save 2+ hours every day.',
      features: isMarathi ? [
        'सामान्य विद्यार्थ्यांसाठी प्रॉम्ट इंजिनिअरिंग: अचूक उत्तरे मिळवण्याची कला',
        'अभ्यासासाठी AI: १०० पानांच्या पुस्तकांचे झटपट फ्लॅशकार्ड्स व MCQs मध्ये रूपांतर',
        'शासकीय अर्ज, पत्रव्यवहार व ईमेल्स काही सेकंदात तयार करणे',
        'क्लिष्ट फॉर्म्युले न वापरता AI द्वारे एक्सेल व स्प्रेडशीट ऑटोमेशन',
      ] : [
        'Prompt Engineering for non-engineers: Getting precise answers every time',
        'AI for Study: Converting 100-page books into instant flashcards & mock MCQs',
        'Drafting formal government petitions, letters, and emails in seconds',
        'Excel & Spreadsheet automation using AI without complex formulas',
      ],
      forWhom: isMarathi ? 'शालेय/कॉलेज विद्यार्थी, स्पर्धा परीक्षा उमेदवार व नोकरदार वर्ग.' : 'School/College students, exam aspirants, teachers, and professionals.',
      fee: '₹499',
      originalFee: '₹1,499',
    },
    {
      id: 'track2_jobs',
      badge: isMarathi ? 'सर्वात लोकप्रिय • उमेदवार व फ्रेशर्स' : 'HOT SELLER • ASPIRANTS & FRESHERS',
      title: isMarathi ? 'ट्रॅक २: AI-सक्षम नोकरी शोध व मुलाखत मास्टरी' : 'Track 2: AI-Powered Job Hunting & Interview Mastery',
      duration: isMarathi ? '१० दिवसांचा इंटेन्सिव्ह स्प्रिंट (वीकेंड लाईव्ह)' : '10-Day Intensive Sprint (Live Weekend Cohort)',
      desc: isMarathi
        ? 'सरकारी व कॉर्पोरेट मुलाखती क्रॅक करण्यासाठी, ATS-अनुकूल रेझ्युमे बनवण्यासाठी आणि आत्मविश्वासाने उत्तरे देण्यासाठी AI चा वापर शिका.'
        : 'Learn how to deploy modern AI tools to craft ATS-proof resumes, predict interview questions, practice live role-play, and crack competitive rounds with ease.',
      features: isMarathi ? [
        'जाहिरात व पात्रता समजून ९०%+ ATS स्कोर असणारा रेझ्युमे तयार करणे',
        'AI स्कोरिंगसह HR व तांत्रिक मुलाखतींचे प्रत्यक्ष मॉक सिम्युलेशन',
        'प्रशासकीय व परिस्थितीनिष्ठ प्रश्नांसाठी STAR पद्धतीचा सराव',
        'LinkedIn नेटवर्किंग आणि प्रभावी कोल्ड ईमेलिंग टेम्पलेट्स',
        'स्थानिक भाषेतून इंग्रजी संभाषण सुधारण्यासाठी AI टिप्स',
      ] : [
        'Reverse-engineering Job Descriptions to build 90%+ ATS Score Resumes',
        'Simulating realistic HR & Technical Interview rounds with AI scoring',
        'Mastering the STAR method for situational & administrative questions',
        'LinkedIn networking & cold outreach templates that get responses',
        'Confidence, body language & vernacular-to-English transition tips',
      ],
      forWhom: isMarathi ? 'पदवीधर, अंतिम वर्षाचे विद्यार्थी आणि स्पर्धा परीक्षा उमेदवार.' : 'Final-year college students, competitive exam aspirants, and job seekers.',
      fee: '₹799',
      originalFee: '₹2,499',
    },
    {
      id: 'track3_exam',
      badge: isMarathi ? 'स्पर्धा परीक्षा • MPSC / UPSC / बँकिंग' : 'COMPETITIVE EXAMS • MPSC / UPSC / BANKING',
      title: isMarathi ? 'ट्रॅक ३: AI-आधारित परीक्षा अभ्यास प्रणाली' : 'Track 3: AI-Powered Competitive Exam Study System',
      duration: isMarathi ? '३ आठवड्यांचा वीकेंड स्प्रिंट' : '3-Week Weekend Sprint',
      desc: isMarathi
        ? 'AI वापरून MPSC, UPSC, आणि Banking परीक्षांसाठी स्मार्ट अभ्यास: MCQ जनरेटर, PYQ विश्लेषण, आणि AI-आधारित रिव्हिजन प्लान.'
        : 'Use AI to build a smart exam preparation system: auto-generate MCQs from any chapter, analyze previous year question patterns, and build a 30-day personalized revision schedule.',
      features: isMarathi ? [
        'NotebookLM सखोल वापर: कोणत्याही १०० पानांच्या प्रकरणातून त्वरित प्रश्नसंच व फ्लॅशकार्ड्स',
        'PYQ कल विश्लेषण: मागील १० वर्षांचे पेपर Claude मध्ये टाकून महत्त्वाचे विषय शोधणे',
        '३० दिवसांचा AI रिव्हिजन प्लॅन: कमकुवत घटकांनुसार वैयक्तिक वेळापत्रक',
        'दैनिक चालू घडामोडी AI डायजेस्ट: MPSC/UPSC अभ्यासक्रमानुसार नेमके संकलन',
        'मराठी माध्यमासाठी AI वर्कफ्लो: मराठी संदर्भ ग्रंथांवर आधारित अचूक अभ्यास',
      ] : [
        'NotebookLM deep-dive: Convert any 100-page textbook chapter to flashcards & quiz sets',
        'PYQ Pattern Analyzer: Feed 10 years of papers to Claude and extract trend topics',
        '30-Day AI Study Planner: Personalized schedule based on your weak topics',
        'Daily Current Affairs AI Digest: Auto-curated for MPSC/UPSC syllabus',
        'Marathi Medium Support: AI tools workflow fully mapped to Marathi exam prep',
      ],
      forWhom: isMarathi ? 'MPSC, UPSC, तलाठी, पोलीस व बँकिंग परीक्षेची तयारी करणारे उमेदवार.' : 'MPSC, UPSC, Banking, and SSC competitive exam aspirants at any stage.',
      fee: '₹1,299',
      originalFee: '₹3,999',
    },
    {
      id: 'track4_engg',
      badge: isMarathi ? 'प्रीमियम कोहॉर्ट • इंजिनिअरिंग व टेक' : 'PREMIUM COHORT • TECH & ENGINEERING',
      title: isMarathi ? 'ट्रॅक ४: फुल-स्टॅक AI इंजिनिअरिंग व सिस्टीम आर्किटेक्चर' : 'Track 4: Full-Stack AI Engineering & Software Architecture',
      duration: isMarathi ? '६ आठवड्यांचा मास्टरक्लास (लाईव्ह प्रोजेक्ट्स)' : '6-Week Masterclass (Live Industry Projects)',
      desc: isMarathi
        ? '२० वर्षांच्या अनुभवी सॉफ्टवेअर आर्किटेक्टकडून LLMs, RAG, ऑटोमेशन एजंट्स आणि उत्पादन-स्तरीय सिस्टीम डिझाइन शिका.'
        : 'A comprehensive, engineering-grade masterclass taught by a 20-Year Enterprise Software Architect. Build production RAG systems, autonomous agents, and scalable Next.js + PostgreSQL architectures.',
      features: isMarathi ? [
        'LLMs प्रत्यक्षात कसे काम करतात: टोकन्स, एम्बेडिंग्स, टेंपरेचर व क्वांटायझेशन',
        'मोठ्या PDF राजपत्रांवर Retrieval-Augmented Generation (RAG) सिस्टीम तयार करणे',
        'AI एजंट्स, टूल कॉलिंग आणि मल्टी-एजंट ऑर्केस्ट्रेशन',
        'एंटरप्राइज आर्किटेक्चर: स्केलेबिलिटी, कॅशिंग, pgvector आणि रेट-लिमिटिंग',
        'थेट कॅपस्टोन प्रोजेक्ट: स्वतःचा AI एग्रीगेटर किंवा परीक्षा सहाय्यक बॉट तयार करा',
      ] : [
        'How LLMs actually work: Tokens, embeddings, temperature, and quantization',
        'Building Retrieval-Augmented Generation (RAG) over large PDF gazettes',
        'AI Autonomous Agents, Tool Calling & Multi-Agent orchestration',
        'Enterprise Architecture: Scalability, caching, pgvector & rate-limiting',
        'Live Capstone: Build your own AI aggregator or legal/exam AI assistant',
      ],
      forWhom: isMarathi ? 'BE, B.Tech, MCA, BCA विद्यार्थी आणि सॉफ्टवेअर इंजिनिअर्स.' : 'BE, B.Tech, MCA, BCA students, and junior/mid-level software engineers.',
      fee: '₹3,499',
      originalFee: '₹9,999',
    },
    {
      id: 'track5_educators',
      badge: isMarathi ? 'शिक्षक व कन्टेन्ट क्रिएटर्स' : 'NEW • TEACHERS & CONTENT CREATORS',
      title: isMarathi ? 'ट्रॅक ५: शिक्षकांसाठी AI — कोर्स डिझाइन व कंटेंट क्रिएशन' : 'Track 5: AI for Teachers & Content Creators',
      duration: isMarathi ? '२ आठवड्यांचा ऑनलाईन कोर्स' : '2-Week Online Course',
      desc: isMarathi
        ? 'AI वापरून ऑनलाईन कोर्स बनवा, YouTube स्क्रिप्ट लिहा, प्रश्नपत्रिका तयार करा आणि विद्यार्थ्यांसाठी AI-आधारित अभ्यास सामग्री तयार करा.'
        : 'Design full online courses, auto-generate quizzes & question banks, write YouTube scripts, and create AI-powered bilingual study materials for your students.',
      features: isMarathi ? [
        'AI कोर्स डिझाइन: ६० मिनिटांत ३० तासांच्या कोर्सची संपूर्ण रचना तयार करणे',
        'क्विझ व प्रश्नसंच जनरेटर: कोणत्याही प्रकरणावरून १०० दर्जेदार MCQs तयार करणे',
        'YouTube स्क्रिप्ट AI: संशोधन, संवाद व थंबनेल संकल्पना एकाच वर्कफ्लोमध्ये',
        'द्विभाषिक कन्टेन्ट: एकाच वेळी मराठी + इंग्रजी अभ्यास नोट्स तयार करणे',
        'मूल्यमापन व ग्रेडिंग: वर्णनात्मक उत्तरांसाठी AI-सहाय्यित तपासणी',
      ] : [
        'AI Course Design: Structure a 30-hour course in 60 minutes with ChatGPT',
        'Quiz & Question Bank Generator: Auto-create 100 MCQs from any chapter',
        'YouTube Script AI: Research, script, and thumbnail concepts in one workflow',
        'Bilingual Content: Generate Marathi + English study notes simultaneously',
        'Assessment & Grading: AI-assisted rubric creation for descriptive answers',
      ],
      forWhom: isMarathi ? 'शाळा/कॉलेजचे शिक्षक, कोचिंग क्लासेसचे प्राध्यापक आणि YouTube क्रिएटर्स.' : 'School/college teachers, coaching institute educators, and YouTube content creators.',
      fee: '₹999',
      originalFee: '₹2,999',
    },
  ]

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* ── 1. Hero Header ── */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(234, 88, 12, 0.08) 0%, var(--surface) 100%)',
        borderBottom: '1px solid var(--outline-variant)',
        padding: '48px 20px 36px',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--primary-fixed)',
            color: 'var(--on-primary-fixed)',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 16,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>school</span>
            {isMarathi ? 'ExamUdaan AI अकॅडमी' : 'ExamUdaan AI Academy'}
          </div>

          <h1 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: 'var(--on-surface)', marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            {isMarathi ? '२० वर्षांच्या अनुभवी सॉफ्टवेअर आर्किटेक्टकडून AI शिका' : 'Learn Practical AI from a 20-Year Enterprise Software Architect'}
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--secondary)', maxWidth: 780, margin: '0 auto 28px', lineHeight: 1.6 }}>
            {isMarathi
              ? 'कोणतेही निरुपयोगी मार्केटिंग नाही. नोकरी मिळवण्यासाठी, मुलाखत क्रॅक करण्यासाठी आणि तंत्रज्ञान क्षेत्रात यशस्वी होण्यासाठी थेट उपयुक्त AI कौशल्ये.'
              : 'No generic hype or social media fluff. High-impact, job-oriented cohorts designed to help students, job seekers, and developers gain an unfair career advantage.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <a
              href="#enroll"
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span className="material-symbols-outlined">event_available</span>
              {isMarathi ? 'मोफत रविवार कार्यशाळेसाठी नोंदणी करा' : 'Register for Free Sunday Workshop'}
            </a>
            <a
              href={SITE_CONFIG?.social?.whatsappChannel || 'https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#16a34a', color: '#fff', padding: '12px 24px',
                borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: 15,
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <span className="material-symbols-outlined">chat</span>
              {isMarathi ? 'WhatsApp AI VIP ग्रुप जॉइन करा' : 'Join WhatsApp AI VIP Group'}
            </a>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1150, margin: '40px auto 0', padding: '0 20px' }}>
        {/* ── 2. Mentor Credibility Card ── */}
        <div style={{
          background: 'var(--surface-container-lowest)',
          border: '1.5px solid var(--outline-variant)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          marginBottom: 48,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 28,
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 8 }}>
              ★ {isMarathi ? 'मुख्य मार्गदर्शक व संस्थापक' : 'CHIEF MENTOR & LEAD INSTRUCTOR'}
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--on-surface)', margin: '0 0 12px' }}>
              {isMarathi ? 'आमच्याकडूनच का शिकावे?' : 'Why Learn From Us?'}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
              {isMarathi
                ? 'आमच्या मुख्य मार्गदर्शकाकडे २०+ वर्षांचा प्रत्यक्ष सॉफ्टवेअर इंजिनिअरिंग, कोडिंग, एंटरप्राइज आर्किटेक्चर आणि AI सिस्टीम्स विकसित करण्याचा प्रदीर्घ अनुभव आहे. लाखो युझर्स हाताळणाऱ्या सिस्टीम्स डिझाइन केलेल्या असल्याने, अभ्यासक्रम निव्वळ सैद्धांतिक नसून १००% प्रत्यक्ष उपयोगावर आधारित आहे.'
                : 'Your instructor brings over 20 years of hands-on software engineering, coding, enterprise architecture, and AI systems development experience. Having architected platforms that serve millions of queries, the curriculum is built on real engineering rigor rather than theoretical slideshows.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'var(--surface-container-low)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>20+ Yrs</div>
                <div style={{ fontSize: 12, color: 'var(--secondary)' }}>
                  {isMarathi ? 'सॉफ्टवेअर व सिस्टीम आर्किटेक्चर' : 'Software & System Architecture'}
                </div>
              </div>
              <div style={{ background: 'var(--surface-container-low)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#16a34a' }}>100% Practical</div>
                <div style={{ fontSize: 12, color: 'var(--secondary)' }}>
                  {isMarathi ? 'थेट कोडिंग व प्रत्यक्ष प्रकल्प' : 'Hands-on coding & real case studies'}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '1px solid #FED7AA',
            borderRadius: 14,
            padding: 24,
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#9A3412', marginTop: 0 }}>
              {isMarathi ? 'ExamUdaan अकॅडमीची ३ प्रमुख आश्वासने' : 'The 3 Commitments of ExamUdaan Academy'}
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#7C2D12', fontSize: 14, lineHeight: 1.7 }}>
              <li>
                <strong>{isMarathi ? 'साधी व सोपी भाषा:' : 'Zero Jargon:'}</strong>{' '}
                {isMarathi ? 'क्लिष्ट AI संकल्पना मराठी व सोप्या इंग्रजीत स्पष्ट केल्या जातात.' : 'Complex AI concepts explained simply in bilingual English + Marathi.'}
              </li>
              <li>
                <strong>{isMarathi ? 'तात्काळ उपयोग:' : 'Immediate Job Utility:'}</strong>{' '}
                {isMarathi ? 'शिकवलेल्या गोष्टी तुम्ही पुढील २४ तासांत तुमच्या नोकरीच्या शोधात वापरू शकता.' : 'Everything taught can be implemented in your job hunt within 24 hours.'}
              </li>
              <li>
                <strong>{isMarathi ? 'कायमस्वरूपी कम्युनिटी:' : 'Lifetime Community Access:'}</strong>{' '}
                {isMarathi ? 'खाजगी टेलिग्राम व व्हॉट्सॲप ग्रुप्सद्वारे शंका निरसन व निरंतर मार्गदर्शन.' : 'Direct doubt resolution and mentorship via private Telegram/WhatsApp cohorts.'}
              </li>
            </ul>
          </div>
        </div>

        {/* ── 3. Course Catalog ── */}
        <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--on-surface)', textAlign: 'center', marginBottom: 12 }}>
          {isMarathi ? 'करिअर व इंजिनिअरिंग ट्रॅक्स' : 'Curated Career & Engineering Tracks'}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--secondary)', textAlign: 'center', maxWidth: 640, margin: '0 auto 36px' }}>
          {isMarathi
            ? 'तुमच्या शिक्षणाच्या आणि करिअरच्या उद्दिष्टांनुसार योग्य ट्रॅक निवडा.'
            : 'Select the program tailored to your current education level and career aspirations.'}
        </p>

        <div className="ai-academy-tracks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 56 }}>
          {COURSES.map(course => (
            <div
              key={course.id}
              style={{
                background: 'var(--surface-container-lowest)',
                border: '1.5px solid var(--outline-variant)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                position: 'relative',
              }}
            >
              <div style={{
                fontSize: 10,
                fontWeight: 800,
                color: 'var(--primary)',
                background: 'var(--primary-fixed)',
                padding: '3px 10px',
                borderRadius: 999,
                alignSelf: 'flex-start',
                marginBottom: 12,
              }}>
                {course.badge}
              </div>

              <h3 style={{ fontSize: 19, fontWeight: 800, color: 'var(--on-surface)', margin: '0 0 6px', lineHeight: 1.4 }}>
                {course.title}
              </h3>
              <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, marginBottom: 12 }}>
                ⏱️ {course.duration}
              </div>

              <p style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
                {course.desc}
              </p>

              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--outline-variant)', paddingTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8 }}>
                  {isMarathi ? 'प्रमुख घटक (Key Modules):' : 'Key Modules Covered:'}
                </div>
                <ul style={{ margin: '0 0 20px', paddingLeft: 18, fontSize: 12, color: 'var(--secondary)', lineHeight: 1.6 }}>
                  {course.features.map((feat, i) => <li key={i}>{feat}</li>)}
                </ul>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--on-surface)' }}>{course.fee}</span>
                    <span style={{ fontSize: 13, color: 'var(--secondary)', textDecoration: 'line-through', marginLeft: 8 }}>{course.originalFee}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 4 }}>
                    65% OFF
                  </span>
                </div>

                <a
                  href="#enroll"
                  className="btn-primary"
                  style={{ width: '100%', textAlign: 'center', padding: '10px 0', textDecoration: 'none', display: 'block', fontSize: 14 }}
                  onClick={() => setEnquiryForm({ ...enquiryForm, course: course.id })}
                >
                  {isMarathi ? 'प्रवेश घ्या / अभ्यासक्रम मागवा' : 'Enroll Now / Request Syllabus'}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ── 4. Free Resources Vault Section ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          border: '1px solid #334155',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          marginBottom: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 16,
          color: '#fff',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#FBBF24' }}>auto_stories</span>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
            {isMarathi ? 'मोफत अभ्यास साहित्य भांडार' : 'Free Learning Resources Vault'}
          </h2>
          <p style={{ fontSize: 14, color: '#94A3B8', maxWidth: 600, margin: 0, lineHeight: 1.6 }}>
            {isMarathi
              ? 'आता लगेच प्रवेश घ्यायचा नाही? हरकत नाही! आमची मोफत YouTube क्लासेस, ५४+ AI साधने आणि परीक्षेनुसार अधिकृत अभ्यासक्रम PDF तपासा.'
              : 'Not ready to enroll yet? Start with our free curated YouTube channels, 54+ AI tools directory, and official syllabus PDFs — all mapped by exam (MPSC, UPSC, Banking, GATE).'}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              href="/youtube"
              className="btn-primary"
              style={{ textDecoration: 'none', padding: '10px 22px', display: 'inline-block', fontSize: 14 }}
            >
              {isMarathi ? 'मोफत YouTube क्लासेस पहा' : 'Browse YouTube Classes'}
            </Link>
            <Link
              href="/ai-tools"
              style={{
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                padding: '10px 22px', borderRadius: 'var(--radius-md)',
                textDecoration: 'none', fontSize: 14, fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {isMarathi ? 'AI टूल्स डिरेक्टरी' : 'AI Tools Directory'}
            </Link>
          </div>
        </div>

        {/* ── 5. Free Workshop Registration Form ── */}
        <div id="enroll" style={{
          background: 'var(--surface-container-lowest)',
          border: '1.5px solid var(--primary-fixed-dim)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px',
          maxWidth: 680,
          margin: '0 auto',
          boxShadow: '0 6px 24px rgba(234, 88, 12, 0.08)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
              {isMarathi ? 'मोफत नोंदणी' : 'FREE REGISTRATION'}
            </span>
            <h3 style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 8px' }}>
              {isMarathi ? 'रविवारच्या मोफत ९०-मिनिटांच्या मास्टरक्लाससाठी नोंदणी करा' : 'Register for Next Free Sunday Masterclass (90 Mins)'}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--secondary)', margin: 0 }}>
              {isMarathi
                ? 'थेट प्रात्यक्षिक: AI द्वारे नोकऱ्या शोधणे, मुलाखतीचे प्रश्न सोडवणे व अभ्यासाच्या नोट्स ऑटोमेशन.'
                : 'Live demonstration: How to use AI to find jobs, solve interview questions & automate study notes.'}
            </p>
          </div>

          {enquirySuccess ? (
            <div style={{
              background: '#F0FDF4',
              border: '1.5px solid #BBF7D0',
              padding: 24,
              borderRadius: 12,
              textAlign: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#16A34A', display: 'block', margin: '0 auto 8px' }}>
                check_circle
              </span>
              <h4 style={{ fontSize: 18, fontWeight: 800, color: '#14532D', margin: '0 0 6px' }}>
                {isMarathi ? 'तुमची जागा निश्चित झाली!' : 'Seat Confirmed!'}
              </h4>
              <p style={{ fontSize: 14, color: '#166534', margin: '0 0 16px' }}>
                {isMarathi
                  ? 'आम्ही थेट कार्यशाळेची लिंक आणि विनामूल्य AI चीट-शीट तुमच्या फोनवर पाठवली आहे. सत्राच्या अपडेट्ससाठी व्हॉट्सॲप ग्रुप जॉइन करा.'
                  : 'We have sent the live workshop link and free AI Cheat-sheet to your phone. Join our official WhatsApp group for session updates.'}
              </p>
              <a
                href={SITE_CONFIG?.social?.whatsappChannel || 'https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#16a34a', color: '#fff', padding: '10px 20px',
                  borderRadius: 8, fontWeight: 700, textDecoration: 'none', display: 'inline-block',
                }}
              >
                {isMarathi ? 'WhatsApp ग्रुपमध्ये सामील व्हा' : 'Join WhatsApp Group Now'}
              </a>
            </div>
          ) : (
            <form onSubmit={handleEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  {isMarathi ? 'तुमचे पूर्ण नाव *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={enquiryForm.name}
                  onChange={e => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  placeholder={isMarathi ? 'उदा. राहुल पाटील' : 'e.g. Rahul Patil'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--outline-variant)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  {isMarathi ? 'WhatsApp मोबाईल क्रमांक *' : 'WhatsApp Mobile Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={enquiryForm.phone}
                  onChange={e => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--outline-variant)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  {isMarathi ? 'इच्छित कोर्स ट्रॅक' : 'Track of Interest'}
                </label>
                <select
                  value={enquiryForm.course}
                  onChange={e => setEnquiryForm({ ...enquiryForm, course: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--outline-variant)' }}
                >
                  <option value="track1_daily">{isMarathi ? 'ट्रॅक १: दैनंदिन जीवन, अभ्यास व उत्पादकता' : 'Track 1: AI for Daily Life, Study & Productivity'}</option>
                  <option value="track2_jobs">{isMarathi ? 'ट्रॅक २: AI-सक्षम नोकरी शोध व मुलाखत मास्टरी' : 'Track 2: AI-Powered Job Hunting & Interview Mastery'}</option>
                  <option value="track3_exam">{isMarathi ? 'ट्रॅक ३: स्पर्धा परीक्षा (MPSC / UPSC / Banking)' : 'Track 3: Competitive Exams, MPSC / UPSC / BANKING'}</option>
                  <option value="track4_engg">{isMarathi ? 'ट्रॅक ४: फुल-स्टॅक AI इंजिनिअरिंग व आर्किटेक्चर' : 'Track 4: Full-Stack AI Engineering & Software Architecture'}</option>
                  <option value="track5_educators">{isMarathi ? 'ट्रॅक ५: शिक्षक व कन्टेन्ट क्रिएटर्स' : 'Track 5: Teachers & Content Creators'}</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={enquiryLoading}
                className="btn-primary"
                style={{ padding: '12px 0', fontSize: 15, fontWeight: 800, marginTop: 8 }}
              >
                {enquiryLoading
                  ? (isMarathi ? 'नोंदणी होत आहे...' : 'Submitting...')
                  : (isMarathi ? 'माझी मोफत जागा निश्चित करा' : 'Reserve My Free Seat for Sunday Masterclass')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
