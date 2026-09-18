// ============================================================
// context/LanguageContext.js — Global Language & Multilingual System
// ExamUdaan.in | Instant English <-> Marathi toggle for all pages
// Persists choice in localStorage and document.cookie
// ============================================================

'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const DICTIONARY = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.jobs': 'Jobs',
    'nav.results': 'Results',
    'nav.admit_cards': 'Admit Card',
    'nav.alerts': 'Alerts',
    'nav.alert_plans': 'Alert Plans',
    'nav.signin': 'Sign In',
    'nav.search_placeholder': 'Search jobs, exams...',
    'nav.suggest_exam': 'Suggest Exam / Feedback',
    'nav.help_faq': 'Help & FAQ',

    // TickerBar
    'ticker.live': 'LIVE UPDATES:',
    'ticker.sample': 'MPSC State Services 2026 Notification Out • Maharashtra Police Bharti 2026 Hall Tickets Available • BMC Junior Engineer Document Verification List Released',

    // Hero Section
    'hero.badge': "MAHARASHTRA'S SMARTEST SARKARI EXAM PORTAL",
    'hero.title_pre': 'Find Sarkari Jobs You Actually Qualify For — In ',
    'hero.title_hl': 'Seconds.',
    'hero.desc': 'Our advanced AI engine parses 60-page official government gazettes to extract precise age limits, educational qualifications, reservation relaxations, and walk-in interview dates.',
    'hero.pill_pdf': '100% Authentic PDF Links',
    'hero.pill_speed': '< 5 Min Alert Speed',
    'hero.pill_ads': 'Zero Clickbait Ads',
    'hero.btn_browse': 'Browse 50,000+ Vacancies',
    'hero.btn_whatsapp': 'WhatsApp Alerts (Coming Soon)',
    'hero.live_monitored': '37+ Government Recruitment Portals Monitored in Real Time',
    'hero.recent_updates': 'Recent Results, Admit Cards & Answer Keys:',
    'hero.view_all_results': 'View All Results →',
    'hero.walkin_title': 'Urgent Walk-In Interviews',
    'hero.walkin_desc': 'No written exams. Direct document verification and selection rounds.',
    'hero.view_all_walkins': 'View All Walk-ins →',
    'hero.latest_jobs_title': 'Latest Recruitment Notifications',
    'hero.latest_jobs_desc': 'Active opportunities from Maharashtra State & Central Government bodies',
    'hero.view_all_jobs': 'View All 1,200+ Jobs →',
    'hero.popular_categories': 'Popular Job Categories',
    'hero.popular_boards': 'Major Recruiting Commissions',
    'hero.why_choose_title': 'Why Serious Aspirants Choose ExamUdaan',
    'hero.feedback_title': 'Missing an Exam Notification?',
    'hero.feedback_desc': 'Tell us which department, municipality, or exam you want added. Our scrapers monitor new portals every week.',
    'hero.feedback_btn': 'Suggest an Exam / Report an Issue',

    // AiMatcher
    'matcher.title': 'AI Eligibility Matcher',
    'matcher.subtitle': 'Instant qualification & age relaxation filtering',
    'matcher.live_matches': 'LIVE MATCHES',
    'matcher.jobs': 'Jobs',
    'matcher.quick_profiles': 'Quick Aspirant Profiles:',
    'matcher.highest_education': 'Highest Education / Degree *',
    'matcher.ai_verified': 'AI Verified',
    'matcher.category': 'Category (आरक्षण)',
    'matcher.region': 'Preferred Region',
    'matcher.your_age': 'Your Age:',
    'matcher.years': 'Years',
    'matcher.find_jobs_btn': 'Find My Eligible Jobs',
    'matcher.describe_plain': 'Or describe in plain words (e.g. "B.Com in Pune, age 26 OBC")',

    // JobCard
    'card.recruitment': 'Recruitment',
    'card.result': 'Result',
    'card.answer_key': 'Answer Key',
    'card.admit_card': 'Admit Card',
    'card.syllabus': 'Syllabus',
    'card.closed': 'CLOSED',
    'card.last_day': 'LAST DAY',
    'card.walk_in': 'WALK-IN',
    'card.today': 'TODAY',
    'card.deadline': 'Deadline',
    'card.interview_date': 'Interview Date',
    'card.vacancies': 'Posts',
    'card.various_posts': 'Various Posts',
    'card.apply_online': 'Apply Online',
    'card.view_details': 'View Job Details',
    'card.official_pdf': 'Official Notification PDF',

    // Detail Page
    'detail.summary_heading': 'Exam Overview (Marathi)',
    'detail.important_dates': 'Important Dates',
    'detail.application_fee': 'Application Fee',
    'detail.selection_process': 'Selection Process',
    'detail.eligibility': 'Eligibility & Age Limit',
    'detail.vacancy_breakdown': 'Vacancy Breakdown',
    'detail.how_to_apply': 'How to Apply',
    'detail.official_links': 'Official Application & Gazette Links',
    'detail.related_jobs': 'Related Notifications',
    'detail.quick_summary': 'Quick Summary',
    'detail.similar_jobs': 'Similar Opportunities',

    // Footer
    'footer.tagline': 'Your Exam. Your Career. Your Udaan.',
    'footer.subtagline': "Maharashtra's AI-Powered Sarkari Job & Exam Alerts Aggregator",
    'footer.about': 'About Us',
    'footer.faq': 'FAQ',
    'footer.suggest': 'Suggest Exam / Feedback',
    'footer.contact': 'Contact Us',
    'footer.whatsapp_alerts': 'WhatsApp Alerts (Coming Soon)',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.disclaimer': 'Disclaimer',
    'footer.disclaimer_text': 'Disclaimer: ExamUdaan.in is an independent platform and is not affiliated with, endorsed by, or representing any government department or recruiting board. Always cross-verify notifications with official government gazettes.',
    'footer.rights': 'All rights reserved.',

    // Home Sections & Features
    'home.departments_title': 'Explore by Government Department',
    'home.departments_sub': 'Instant access to state services, municipal corporations & central commissions',
    'home.view_all_depts': 'View All (37+) →',
    'home.how_it_works_tag': 'Intelligent Pipeline',
    'home.how_it_works_title': 'How ExamUdaan Matches You with Government Jobs',
    'home.how_it_works_desc': 'Eliminating the headache of reading lengthy departmental gazettes manually.',
    'home.step1_title': '37+ Portals Scraped 24x7',
    'home.step1_desc': 'Continuous automated crawlers scan MPSC, Police, BMC, ZP, and Railway websites for freshly uploaded recruitment gazettes.',
    'home.step2_title': 'Intelligent AI PDF Extraction',
    'home.step2_desc': 'AI reads the full notification PDF to extract educational degree, age limits, caste category relaxations, syllabus, and walk-in dates.',
    'home.step3_title': 'Direct WhatsApp Alerts',
    'home.step3_desc': 'You receive instant personalized alerts with the official application link and authentic PDF attachment before deadlines close.',
    'home.wa_network_tag': 'WhatsApp Alert Network',
    'home.wa_title': 'Never Miss a Last Date. Get Alerts on Your Phone.',
    'home.wa_desc': 'Join over 25,000 Maharashtra aspirants who receive filtered, personalized WhatsApp messages for their specific qualification (10th, 12th, Graduate, ITI, Police).',
    'home.wa_btn': 'WhatsApp Alerts — Coming Soon',
    'home.wa_how_it_works': 'How it works →',
    'home.stats_active_jobs': 'Active Notifications',
    'home.stats_total_posts': 'Total Posts & Vacancies',
    'home.stats_portals': 'Govt Portals Scraped',
    'home.stats_aspirants': 'Active Alert Aspirants',
    'home.feedback_banner_title': 'Have a Suggestion or Want a Government Portal Added?',
    'home.feedback_banner_desc': 'Tell us which recruitment board, university, or zilla parishad you want us to track. We review community requests weekly!',
    'home.feedback_banner_btn': 'Open Feedback & Suggestions →',
    'home.no_jobs_found': 'No active notifications found.',
    'home.explore_all_maharashtra': 'Explore All Maharashtra Jobs & Recruitments',
    'home.walkin_urgent_badge': 'WALK-IN INTERVIEWS',
    'home.walkin_headline': 'Urgent Walk-in Recruitments (No Written Exam)',
    'home.walkin_subhead': 'Carry your CV & certificates directly to the venue on the interview date',
    'home.all_walkins_btn': 'All Walk-ins →',
    'home.latest_verified': 'Latest Verified Recruitments',
    'home.latest_verified_sub': 'Updated continuously with verified government notification PDFs',
    'home.vacancies_label': 'Vacancies:',
    'home.details_btn': 'Details →',

    // ListingPage filters
    'listing.filter_board': 'Filter by Board / Organization',
    'listing.filter_qualification': 'Educational Qualification',
    'listing.filter_state': 'State / Region',
    'listing.filter_salary': 'Minimum Salary',
  },
  mr: {
    // Navbar
    'nav.home': 'मुख्यपृष्ठ',
    'nav.jobs': 'नोकऱ्या',
    'nav.results': 'निकाल',
    'nav.admit_cards': 'प्रवेशपत्र',
    'nav.alerts': 'सूचना',
    'nav.alert_plans': 'अलर्ट प्लॅन्स',
    'nav.signin': 'लॉगिन करा',
    'nav.search_placeholder': 'नोकऱ्या, परीक्षा, विभाग शोधा...',
    'nav.suggest_exam': 'परीक्षेची शिफारस / अभिप्राय',
    'nav.help_faq': 'मदत व विचारले जाणारे प्रश्न',

    // TickerBar
    'ticker.live': 'थेट घडामोडी:',
    'ticker.sample': 'MPSC राज्यसेवा परीक्षा 2026 जाहिरात प्रसिद्ध • महाराष्ट्र पोलीस भरती प्रवेशपत्र उपलब्ध • बृहन्मुंबई महानगरपालिका कनिष्ठ अभियंता कागदपत्र पडताळणी यादी जाहीर',

    // Hero Section
    'hero.badge': 'महाराष्ट्राचे AI-संचालित सरकारी भरती पोर्टल',
    'hero.title_pre': 'तुमच्या पात्रतेनुसार योग्य सरकारी नोकऱ्या शोधा — ',
    'hero.title_hl': 'काही सेकंदात.',
    'hero.desc': 'आमचे आधुनिक AI इंजिन ६० पानांच्या अधिकृत सरकारी राजपत्रांचे विश्लेषण करून अचूक वयोमर्यादा, शैक्षणिक पात्रता, आरक्षण सवलत आणि थेट मुलाखतींची माहिती तात्काळ सादर करते.',
    'hero.pill_pdf': '१००% अधिकृत PDF लिंक्स',
    'hero.pill_speed': '< ५ मिनिटात थेट अलर्ट',
    'hero.pill_ads': 'जाहिरातमुक्त स्वच्छ अनुभव',
    'hero.btn_browse': '५०,०००+ रिक्त पदे पहा',
    'hero.btn_whatsapp': 'WhatsApp अलर्ट (लवकरच)',
    'hero.live_monitored': '३७+ अधिकृत सरकारी भरती संकेतस्थळांचे थेट संकलन',
    'hero.recent_updates': 'ताजे निकाल, प्रवेशपत्र आणि उत्तरतालिका:',
    'hero.view_all_results': 'सर्व निकाल पहा →',
    'hero.walkin_title': 'थेट मुलाखती (Walk-in Interviews)',
    'hero.walkin_desc': 'कोणतीही लेखी परीक्षा नाही. थेट कागदपत्र पडताळणी व मुलाखत फेरी.',
    'hero.view_all_walkins': 'सर्व मुलाखती पहा →',
    'hero.latest_jobs_title': 'ताज्या सरकारी नोकऱ्यांच्या जाहिराती',
    'hero.latest_jobs_desc': 'महाराष्ट्र शासन व केंद्र सरकारच्या विविध विभागांमधील चालू भरती संधी',
    'hero.view_all_jobs': 'सर्व १,२००+ नोकऱ्या पहा →',
    'hero.popular_categories': 'लोकप्रिय भरती प्रवर्ग',
    'hero.popular_boards': 'प्रमुख भरती आयोग व मंडळे',
    'hero.why_choose_title': 'स्पर्धा परीक्षा उमेदवारांची पहिली पसंती — ExamUdaan',
    'hero.feedback_title': 'कोणती भरती किंवा परीक्षा सुटली आहे?',
    'hero.feedback_desc': 'तुम्हाला कोणत्या विभागाची किंवा परीक्षेची जाहिरात हवी आहे ते आम्हाला सांगा. आमचे बॉट्स दर आठवड्याला नवीन पोर्टल्स समाविष्ट करतात.',
    'hero.feedback_btn': 'परीक्षेची शिफारस करा / त्रुटी नोंदवा',

    // AiMatcher
    'matcher.title': 'AI पात्रता मॅचर',
    'matcher.subtitle': 'शिक्षण व वयोमर्यादा सवलतीनुसार झटपट नोकरी शोध',
    'matcher.live_matches': 'चालू पदे',
    'matcher.jobs': 'जागा',
    'matcher.quick_profiles': 'उमेदवार प्रोफाइल्स:',
    'matcher.highest_education': 'सर्वोच्च शिक्षण / पदवी *',
    'matcher.ai_verified': 'AI प्रमाणित',
    'matcher.category': 'प्रवर्ग (आरक्षण)',
    'matcher.region': 'पसंतीचा विभाग / जिल्हा',
    'matcher.your_age': 'तुमचे वय:',
    'matcher.years': 'वर्षे',
    'matcher.find_jobs_btn': 'माझ्या पात्रतेनुसार नोकऱ्या शोधा',
    'matcher.describe_plain': 'किंवा तुमच्या शब्दांत सांगा (उदा. "पुण्यात बी.कॉम, वय २६ ओबीसी")',

    // JobCard
    'card.recruitment': 'भरती',
    'card.result': 'निकाल',
    'card.answer_key': 'उत्तरतालिका',
    'card.admit_card': 'प्रवेशपत्र',
    'card.syllabus': 'अभ्यासक्रम',
    'card.closed': 'अर्ज बंद',
    'card.last_day': 'शेवटचा दिवस',
    'card.walk_in': 'थेट मुलाखत',
    'card.today': 'आज शेवटचा दिवस',
    'card.deadline': 'अंतिम दिनांक',
    'card.interview_date': 'मुलाखतीचा दिनांक',
    'card.vacancies': 'पदे',
    'card.various_posts': 'विविध पदे',
    'card.apply_online': 'ऑनलाइन अर्ज करा',
    'card.view_details': 'संपूर्ण माहिती पहा',
    'card.official_pdf': 'अधिकृत जाहिरात PDF',

    // Detail Page
    'detail.summary_heading': 'परीक्षेचा सारांश (मराठी)',
    'detail.important_dates': 'महत्त्वाचे दिनांक',
    'detail.application_fee': 'अर्ज शुल्क',
    'detail.selection_process': 'निवड प्रक्रिया',
    'detail.eligibility': 'पात्रता व वयोमर्यादा',
    'detail.vacancy_breakdown': 'पदसंख्या तपशील',
    'detail.how_to_apply': 'अर्ज कसा करावा?',
    'detail.official_links': 'अधिकृत अर्ज व जाहिरात लिंक्स',
    'detail.related_jobs': 'संबंधित इतर भरती',
    'detail.quick_summary': 'संक्षिप्त माहिती',
    'detail.similar_jobs': 'संबंधित इतर संधी',

    // Footer
    'footer.tagline': 'तुमची परीक्षा. तुमचे करिअर. तुमची उड्डाण.',
    'footer.subtagline': 'महाराष्ट्राचे AI-संचालित सरकारी नोकरी व परीक्षा पोर्टल',
    'footer.about': 'आमच्याबद्दल',
    'footer.faq': 'नेहमी विचारले जाणारे प्रश्न',
    'footer.suggest': 'परीक्षेची शिफारस / अभिप्राय',
    'footer.contact': 'संपर्क साधा',
    'footer.whatsapp_alerts': 'WhatsApp अलर्ट (लवकरच)',
    'footer.terms': 'नियम व अटी',
    'footer.privacy': 'गोपनीयता धोरण',
    'footer.disclaimer': 'अस्वीकरण',
    'footer.disclaimer_text': 'अस्वीकरण: ExamUdaan.in हे एक स्वतंत्र माहिती पोर्टल असून त्याचा कोणत्याही शासकीय विभाग किंवा भरती मंडळाशी थेट संबंध नाही. उमेदवारांनी अधिकृत सरकारी राजपत्रातून माहितीची पडताळणी करावी.',
    'footer.rights': 'सर्व हक्क राखीव.',

    // ListingPage
    'listing.all': 'सर्व',
    'listing.jobs': 'नोकऱ्या',
    'listing.results': 'निकाल',
    'listing.admit_cards': 'प्रवेशपत्र',
    'listing.answer_keys': 'उत्तरतालिका',
    'listing.syllabus': 'अभ्यासक्रम',
    'listing.search_placeholder': 'जाहिराती शोधा...',
    'listing.filter_title': 'फिल्टर्स',
    'listing.clear_all': 'सर्व हटवा',
    'listing.sort_latest': 'नवीन सर्वात प्रथम',
    'listing.sort_closing': 'लवकरच संपणारे',
    'listing.sort_vacancies': 'सर्वाधिक पदे',
    'listing.filter_board': 'भरती मंडळ / आयोग',
    'listing.filter_qualification': 'शैक्षणिक पात्रता',
    'listing.filter_state': 'राज्य / विभाग',
    'listing.filter_salary': 'किमान वेतन',

    // Home Sections & Features
    'home.departments_title': 'शासकीय विभाग व आयोगानुसार नोकऱ्या शोधा',
    'home.departments_sub': 'महाराष्ट्र राज्यसेवा, महानगरपालिका आणि केंद्रीय भरती मंडळांच्या थेट संधी',
    'home.view_all_depts': 'सर्व विभाग पहा (३७+) →',
    'home.how_it_works_tag': 'बुद्धिमान AI प्रणाली',
    'home.how_it_works_title': 'ExamUdaan तुम्हाला योग्य सरकारी नोकरी कशी शोधून देते?',
    'home.how_it_works_desc': 'मोठमोठी सरकारी राजपत्रांचे मॅन्युअल वाचन करण्याचा त्रास कायमचा संपवा.',
    'home.step1_title': '३७+ अधिकृत संकेतस्थळांचे २४x७ ट्रॅकिंग',
    'home.step1_desc': 'स्वयंचलित बॉट्स MPSC, पोलीस, BMC, ZP आणि रेल्वेच्या संकेतस्थळांवरून नवीन जाहिराती क्षणात गोळा करतात.',
    'home.step2_title': 'अचूक AI PDF माहिती संकलन',
    'home.step2_desc': 'AI संपूर्ण PDF वाचून पदवी, वयोमर्यादा, आरक्षण सवलत, अभ्यासक्रम व मुलाखतीची तारीख वेगळी काढते.',
    'home.step3_title': 'थेट WhatsApp अलर्ट',
    'home.step3_desc': 'मुदत संपण्यापूर्वी थेट तुमच्या मोबाईलवर अधिकृत अर्ज लिंक आणि अस्सल PDF सोबत सूचना पाठवली जाते.',
    'home.wa_network_tag': 'WhatsApp अलर्ट नेटवर्क',
    'home.wa_title': 'शेवटची तारीख कधीही चुकवू नका. मोबाईलवर तात्काळ अलर्ट मिळवा.',
    'home.wa_desc': '२५,०००+ महाराष्ट्रातील उमेदवारांसोबत सामील व्हा, ज्यांना त्यांच्या शिक्षणानुसार (१०वी, १२वी, पदवीधर, ITI, पोलीस) थेट WhatsApp मेसेज मिळतात.',
    'home.wa_btn': 'WhatsApp अलर्ट — लवकरच सुरू',
    'home.wa_how_it_works': 'प्रणाली कशी चालते →',
    'home.stats_active_jobs': 'सक्रिय जाहिराती',
    'home.stats_total_posts': 'एकूण रिक्त पदे व जागा',
    'home.stats_portals': 'अधिकृत भरती पोर्टल्स',
    'home.stats_aspirants': 'नोंदणीकृत उमेदवार',
    'home.feedback_banner_title': 'कोणतीही भरती जोडायची आहे किंवा सूचना द्यायची आहे?',
    'home.feedback_banner_desc': 'तुम्हाला कोणत्या भरती मंडळाची किंवा जिल्हा परिषदेची जाहिरात हवी आहे ते सांगा. आम्ही दर आठवड्याला नवीन पोर्टल्स जोडतो!',
    'home.feedback_banner_btn': 'अभिप्राय नोंदवा / सूचना द्या →',
    'home.no_jobs_found': 'सध्या कोणतीही सक्रिय जाहिरात उपलब्ध नाही.',
    'home.explore_all_maharashtra': 'महाराष्ट्रातील सर्व सरकारी नोकऱ्या पहा',
    'home.walkin_urgent_badge': 'थेट मुलाखत (WALK-IN)',
    'home.walkin_headline': 'थेट मुलाखत भरती (कोणतीही लेखी परीक्षा नाही)',
    'home.walkin_subhead': 'मुलाखतीच्या दिवशी मूळ कागदपत्रे व बायोडाटा सोबत घेऊन उपस्थित रहा',
    'home.all_walkins_btn': 'सर्व थेट मुलाखती पहा →',
    'home.latest_verified': 'ताज्या पडताळणी झालेल्या सरकारी नोकऱ्या',
    'home.latest_verified_sub': 'अधिकृत जाहिरात PDF सह २४ तास अद्ययावत',
    'home.vacancies_label': 'जागा:',
    'home.details_btn': 'तपशील →',
  }
}

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key, fallback) => fallback || key,
  isMarathi: false,
})

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    try {
      // 1. Check localStorage
      const saved = localStorage.getItem('examudaan_lang')
      if (saved === 'mr' || saved === 'en') {
        setLangState(saved)
        return
      }

      // 2. Check cookie
      const match = document.cookie.match(/(?:^|; )examudaan_lang=([^;]*)/)
      if (match && (match[1] === 'mr' || match[1] === 'en')) {
        setLangState(match[1])
      }
    } catch {}
  }, [])

  const setLang = (newLang) => {
    const val = newLang === 'mr' ? 'mr' : 'en'
    setLangState(val)
    try {
      localStorage.setItem('examudaan_lang', val)
      document.cookie = `examudaan_lang=${val}; path=/; max-age=31536000; SameSite=Lax`
      window.dispatchEvent(new CustomEvent('langChange', { detail: val }))
    } catch {}
  }

  const t = (key, fallback = '') => {
    const dict = DICTIONARY[lang] || DICTIONARY.en
    return dict[key] || fallback || key
  }

  const value = {
    lang,
    setLang,
    t,
    isMarathi: lang === 'mr',
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function T({ k, fallback = '' }) {
  const { t } = useLanguage()
  return <>{t(k, fallback)}</>
}
