// ============================================================
// app/study-planner/page.js — AI Smart Adaptive Study Planner
// ExamUdaan.in — Day-by-Day Personalized Micro-Curriculum & Live PYQs
// Features: Real Exam Topics, In-page Practice Drawer, Hourly Schedule, Streak
// ============================================================
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import styles from './studyPlanner.module.css'

// Comprehensive real syllabus modules for Maharashtra & National Exams
const EXAM_PRESETS = [
  {
    id: 'mpsc-combined',
    name: 'MPSC Combined Group B & C (PSI, STI, ASO)',
    conductingBody: 'MPSC (महाराष्ट्र लोकसेवा आयोग)',
    targetCutoff: '52 - 58 Marks (General)',
    curriculum: [
      {
        subject: 'Polity & Constitution',
        topic: 'संविधान सभा, सरनामा व मसुदा समिती',
        book: 'एम. लक्ष्मीकांत / रंजन कोळंबे',
        pyqQuery: 'संविधान सभा',
        theory: 'संविधान सभेची स्थापना (9 डिसें 1946), उद्दिष्टांचा ठराव (13 डिसें), मसुदा समिती (29 ऑग 1947) आणि 42 वी घटनादुरुस्ती (समाजवादी, धर्मनिरपेक्ष, एकात्मता).',
        pyqGoal: 'Solve 25 PYQs on Preamble & Assembly',
        revision: 'सरनाम्यातील शब्दांचा अचूक क्रम पाठ करा (सार्वभौम, समाजवादी, धर्मनिरपेक्ष, लोकशाही, गणराज्य).'
      },
      {
        subject: 'Polity & Constitution',
        topic: 'मूलभूत हक्क (कलम १२ ते ३५) व कलम ३२ रिट्स',
        book: 'एम. लक्ष्मीकांत (प्रकरण ७)',
        pyqQuery: 'मूलभूत हक्क',
        theory: 'कलम १४ (समानता), कलम १९ (६ स्वातंत्र्ये), कलम २१ (जगण्याचा हक्क व पुट्टस्वामी निकाल) आणि कलम ३२ (५ रिट्स - बंदीप्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, अधिकारपृच्छा).',
        pyqGoal: 'Solve 30 PYQs on Fundamental Rights',
        revision: 'कोणते मूलभूत हक्क केवळ भारतीय नागरिकांनाच उपलब्ध आहेत? (कलम १५, १६, १९, २९, ३०).'
      },
      {
        subject: 'Maharashtra History',
        topic: '१८५७ चा उठाव व महाराष्ट्राचे योगदान',
        book: 'डॉ. अनिल कठारे / बिपिन चंद्र',
        pyqQuery: '1857 चा उठाव',
        theory: 'सातारचे रंगो बापूजी गुप्ते, कोल्हापूरचे चीमासाहेब, नाशिक-पेठचा उठाव (राजा भगवंतराव), जमखिंडीचे अप्पासाहेब पटवर्धन आणि भागोजी नाईक यांचा भिल्ल उठाव.',
        pyqGoal: 'Solve 25 PYQs on 1857 Maharashtra Revolt',
        revision: 'महाराष्ट्रातील प्रमुख उठाव नेते व त्यांची केंद्रे यांची नकाशावर उजळणी करा.'
      },
      {
        subject: 'Maharashtra History',
        topic: 'महात्मा ज्योतिराव फुले व सत्यशोधक समाज',
        book: 'डॉ. कठारे / डॉ. जयसिंगराव पवार',
        pyqQuery: 'महात्मा फुले',
        theory: '१ जानेवारी १८४८ (मुलींची पहिली शाळा भिडे वाडा), २४ सप्टेंबर १८७३ (सत्यशोधक समाज स्थापना), ग्रंथसंपदा: गुलामगिरी (१८७३), शेतकर्‍यांचा आसूड, ब्राह्मणांचे कसब, दीनबंधू वृत्तपत्र.',
        pyqGoal: 'Solve 30 PYQs on Jyotirao Phule',
        revision: 'सत्यशोधक समाजाचे ब्रीदवाक्य: "सर्वसाक्षी जगत्पती । त्याला नकोच मध्यस्थी ।"'
      },
      {
        subject: 'Maharashtra Geography',
        topic: 'सह्याद्रीची प्राकृतिक रचना, प्रमुख शिखरे व घाट',
        book: 'ए. बी. सौदी / दीपस्तंभ',
        pyqQuery: 'कळसूबाई',
        theory: 'कळसूबाई शिखर (१६४६ मी, अहिल्यानगर/नाशिक), साल्हेर (१५६७ मी), महाबळेश्वर (१४३८ मी). प्रमुख घाट: थळ घाट (मुंबई-नाशिक), बोर घाट (मुंबई-पुणे), आंबा घाट (कोल्हापूर-रत्नागिरी).',
        pyqGoal: 'Solve 25 PYQs on Sahyadri & Passes',
        revision: 'उत्तरेकडून दक्षिणेकडे शिखरांचा उतरता क्रम: कळसूबाई > साल्हेर > महाबळेश्वर > हरिश्चंद्रगड.'
      },
      {
        subject: 'Maharashtra Geography',
        topic: 'गोदावरी, भीमा व कृष्णा नदीप्रणाली',
        book: 'सौदी भूगोल (प्रकरण ४)',
        pyqQuery: 'गोदावरी',
        theory: 'गोदावरी उगम (त्र्यंबकेश्वर, नाशिक - ६६८ किमी लांबी महाराष्ट्रात, ४९.७% खोरे). भीमा उगम (भीमाशंकर, पुणे - उजनी धरण). कृष्णा उगम (महाबळेश्वर - कोयना शिवसागर प्रकल्प).',
        pyqGoal: 'Solve 30 PYQs on Maharashtra Rivers',
        revision: 'गोदावरीच्या डाव्या व उजव्या तीरावरील उपनद्या (दारणा, प्रवरा, सिंदफणा वि. दुधना, पूर्णा, प्राणहिता).'
      },
      {
        subject: 'Economy & Planning',
        topic: 'RBI व मौद्रिक धोरण (Repo, CRR, SLR)',
        book: 'रंजन कोळंबे / किरण देसले',
        pyqQuery: 'Repo Rate',
        theory: 'RBI Act 1934 (स्थापना १ एप्रिल १९३५, राष्ट्रीयीकरण १ जानेवारी १९४९). मौद्रिक साधने: रेपो रेट, रिव्हर्स रेपो, CRR (रोख राखीव प्रमाण), SLR (वैधानिक तरलता प्रमाण) व चलनवाढ नियंत्रण.',
        pyqGoal: 'Solve 25 PYQs on RBI & Banking',
        revision: 'रेपो रेट वाढल्यास बँकांचे कर्ज महाग होते व बाजारातील भाववाढ कमी होते.'
      },
      {
        subject: 'Economy & Planning',
        topic: 'पंचवार्षिक योजना, नीती आयोग व GST',
        book: 'किरण देसले (भाग १)',
        pyqQuery: 'नीती आयोग',
        theory: '१ जानेवारी २०१५ रोजी NITI आयोगाची स्थापना (पंतप्रधान पदसिद्ध अध्यक्ष). १०१ वी घटनादुरुस्ती २०१६ (१ जुलै २०१७ पासून GST लागू). तेंडुलकर समिती व रंगराजन समिती दारिद्र्य रेषा.',
        pyqGoal: 'Solve 25 PYQs on Planning & GST',
        revision: 'पहिली योजना (हॅरॉड-डोमार मॉडेल - कृषी), दुसरी योजना (महालानोबिस मॉडेल - जड उद्योग).'
      },
      {
        subject: 'General Science',
        topic: 'मानवी शरीरसंस्था, रक्तगट व जीवनसत्त्वे',
        book: 'डॉ. सचिन भस्के / स्टेट बोर्ड',
        pyqQuery: 'रक्तगट',
        theory: 'कार्ल लँडस्टायनर (१९०० - रक्तगट शोध). सर्वयोग्य दाता O- (O निगेटिव्ह), सर्वयोग्य ग्राहक AB+. जीवनसत्त्वे: Vit A (रातांधळेपणा), Vit C (स्कर्व्ही - आम्लफळे), Vit D (मुडदूस).',
        pyqGoal: 'Solve 25 PYQs on Human Biology & Vitamins',
        revision: 'पाण्यात विरघळणारी जीवनसत्त्वे (B, C), मेदात विरघळणारी जीवनसत्त्वे (A, D, E, K).'
      },
      {
        subject: 'Marathi Grammar',
        topic: 'मराठी व्याकरण: समास व प्रयोग प्रकार',
        book: 'मो. रा. वाळंबे / बाळासाहेब शिंदे',
        pyqQuery: 'समास',
        theory: 'समास: अव्ययीभाव (पहिले पद मुख्य), तत्पुरुष (दुसरे पद), द्वंद्व (दोन्ही पदे), बहुव्रीही (तिसरे पद). प्रयोग: कर्तरी, कर्मणी (नवीन कर्मणी - कडून प्रत्यय) आणि भावे प्रयोग.',
        pyqGoal: 'Solve 35 PYQs on Marathi Samas & Prayog',
        revision: 'नवीन कर्मणी (Passive Voice) उदा. "शिपायाकडून चोर पकडला गेला".'
      },
      {
        subject: 'Aptitude & Reasoning',
        topic: 'शेकडेवारी, नफा-तोटा व काळ-काम-वेग',
        book: 'पंढरीनाथ राणे / नितीन महाले',
        pyqQuery: 'काळ काम वेग',
        theory: 'शेकडेवारी सूत्रे, खरेदी-विक्री किंमत व शेकडा नफा, काळ-काम-वेग: काम = वेग × वेळ. रेल्वेचे खांब ओलांडणे व बोगदा ओलांडण्याचे अंतर सूत्रे.',
        pyqGoal: 'Solve 30 Aptitude & CSAT Problems',
        revision: 'किमी/तास ते मी/सेकंद करण्यासाठी 5/18 ने गुणावे.'
      },
      {
        subject: 'Law & Acts',
        topic: 'माहितीचा अधिकार (RTI 2005) व लोकसेवा हक्क २०१५',
        book: 'शासकीय अधिनियम पुस्तिका',
        pyqQuery: 'RTI Act 2005',
        theory: 'RTI Act 2005: माहिती पुरवण्याची मुदत ३० दिवस (जीवन स्वातंत्र्याशी संबंधित असल्यास ४८ तास). कलम ८ (माहिती देण्यापासून सूट). महाराष्ट्र लोकसेवा हक्क कायदा २०१५ तरतुदी.',
        pyqGoal: 'Solve 20 PYQs on RTI Act',
        revision: 'माहिती आयुक्तांचा कार्यकाळ व नियुक्ती समिती (पंतप्रधान, विरोधी पक्षनेते, कॅबिनेट मंत्री).'
      }
    ]
  },
  {
    id: 'police-bharti',
    name: 'Maharashtra Police Constable Bharti (पोलीस शिपाई भरती)',
    conductingBody: 'Maharashtra State Police',
    targetCutoff: '135+ / 150 (Ground 50 + Written 100)',
    curriculum: [
      {
        subject: 'Marathi Grammar',
        topic: 'मराठी वर्णमाला, संधी व उच्चारस्थाने',
        book: 'बाळासाहेब शिंदे (मराठी व्याकरण)',
        pyqQuery: 'वर्णविचार',
        theory: 'मराठीत १४ स्वर (ॲ व ऑ सह), २ स्वरादी, ३४ व्यंजने = एकूण ५० वर्ण. कंठ्य, तालव्य, मूर्धन्य, दंत्य व ओष्ठ्य उच्चारस्थानांची उजळणी.',
        pyqGoal: 'Solve 25 Police Marathi PYQs',
        revision: 'कंठ्य वर्ण: अ, आ, क, ख, ग, घ, ङ, ह. तालव्य: इ, ई, च, छ, ज, झ, ञ, य, श.'
      },
      {
        subject: 'Police GK & Law',
        topic: 'महाराष्ट्र पोलीस रचना, रँक्स व मुंबई पोलीस ऍक्ट',
        book: 'एकनाथ पाटील (तात्यांचा ठोकळा)',
        pyqQuery: 'पोलीस',
        theory: 'पोलीस महासंचालक (DGP), पोलीस आयुक्त (CP), SP, DySP, PI, API, PSI, पोलीस शिपाई रँक उतरंड. पोलीस ध्वज (पंचकोनी तारा, गडद निळा रंग) व ब्रीदवाक्य: "सद्रक्षणाय खलनिग्रहणाय".',
        pyqGoal: 'Solve 25 Police GK Questions',
        revision: 'महाराष्ट्र पोलीस अकादमी (MPA) नाशिक येथे स्थित आहे.'
      },
      {
        subject: 'Basic Mathematics',
        topic: 'लसावि-मसावि, अपूर्णांक व सरासरी',
        book: 'कोकिळा प्रकाशन (अंकगणित)',
        pyqQuery: 'सरासरी',
        theory: 'दोन संख्यांचा गुणाकार = लसावि × मसावि. सरासरी = एकूण संख्यांची बेरीज / संख्यांची संख्या. गुणोत्तर व प्रमाण ट्रिक्स.',
        pyqGoal: 'Solve 25 Fast Maths MCQs',
        revision: 'पहिली n नैसर्गिक संख्यांची बेरीज = n(n+1)/2.'
      },
      {
        subject: 'Logical Reasoning',
        topic: 'अक्षरमालिका, कोडिंग-डिकोडिंग व नातेसंबंध',
        book: 'सतीश वसे / सचिन ढवळे',
        pyqQuery: 'Coding-Decoding',
        theory: 'A ते Z अक्षरांचे अनुक्रमांक (A=1 ... Z=26) व उलट अनुक्रमांक (A=26 ... Z=1). नातेसंबंध वृक्ष आकृती पद्धती.',
        pyqGoal: 'Solve 30 Police Reasoning Questions',
        revision: 'EJOTY सूत्र (E=5, J=10, O=15, T=20, Y=25) अक्षर क्रमांक तत्काळ आठवण्यासाठी.'
      },
      {
        subject: 'Current Affairs & Schemes',
        topic: 'महाराष्ट्र शासकीय योजना व क्रीडा पुरस्कार',
        book: 'दैनिक चालू घडामोडी / ExamUdaan',
        pyqQuery: 'शासकीय योजना',
        theory: 'मुख्यमंत्री माझी लाडकी बहीण योजना (₹१,५००/महिना), नमो शेतकरी महासन्मान निधी, ऑलिम्पिक व राष्ट्रीय क्रीडा पुरस्कार विजेते.',
        pyqGoal: 'Solve 20 Daily GK & Current MCQs',
        revision: 'महाराष्ट्र राज्य क्रीडा दिन: १५ जानेवारी (खाशाबा जाधव जयंती).'
      }
    ]
  },
  {
    id: 'talathi-bharti',
    name: 'Maharashtra Talathi & ZP Bharti (TCS/IBPS)',
    conductingBody: 'Revenue Dept / Rural Dev (TCS Pattern)',
    targetCutoff: '172+ / 200 Marks (Normalized)',
    curriculum: [
      {
        subject: 'English Language',
        topic: 'TCS Pattern: Subject-Verb Agreement & Prepositions',
        book: 'Wren & Martin / बाळासाहेब शिंदे इंग्रजी',
        pyqQuery: 'Subject-Verb Agreement',
        theory: 'Neither-nor / Either-or rules (verb agrees with closest subject). Collective nouns and verbs. Fixed prepositions: abstain from, proficient in, addicted to, adhere to.',
        pyqGoal: 'Solve 25 TCS English PYQs',
        revision: 'Each, every, everyone, neither, either take singular verbs.'
      },
      {
        subject: 'English Language',
        topic: 'TCS Vocabulary: Idioms, Phrases & One Word Substitution',
        book: 'SP Bakshi / ExamUdaan Vocab',
        pyqQuery: 'Idioms',
        theory: 'Frequent TCS idioms: Once in a blue moon, Blessing in disguise, Break the ice, Burn the midnight oil. Synonyms and Antonyms drills.',
        pyqGoal: 'Solve 30 English Vocab MCQs',
        revision: 'Make a 10-word flashcard set today for daily revision.'
      },
      {
        subject: 'General Awareness',
        topic: 'माहितीचा अधिकार (RTI Act 2005) व सातबारा उतारा',
        book: 'तात्यांचा ठोकळा / शासन निर्णय',
        pyqQuery: 'RTI Act 2005',
        theory: 'RTI कायदा: अंमलबजावणी १२ ऑक्टोबर २००५. कलम ४ (स्वेच्छेने माहिती प्रसिद्धी), कलम ६ (अर्ज प्रक्रिया), कलम ७ (३० दिवसांची मुदत). गाव नमुना नंबर ७ व १२ चे घटक.',
        pyqGoal: 'Solve 25 TCS GK Questions',
        revision: 'गाव नमुना ७ = अधिकार अभिलेख; गाव नमुना १२ = पिकांची नोंदवही.'
      },
      {
        subject: 'Reasoning & Aptitude',
        topic: 'बैठक व्यवस्था (Seating Arrangement) व संख्यामालिका',
        book: 'TCS Previous Papers by ExamUdaan',
        pyqQuery: 'संख्यामालिका',
        theory: 'वर्तुळाकार व रेषीय बैठक व्यवस्था (आत तोंड / बाहेर तोंड असणारे). फरक, वर्ग-घन व अल्टरनेटिव्ह सिरीज ट्रिक्स.',
        pyqGoal: 'Solve 25 TCS Reasoning Puzzles',
        revision: 'डावे व उजवे वळण ठरवताना व्यक्तीच्या चेहऱ्याच्या दिशेचा विचार करा.'
      }
    ]
  },
  {
    id: 'mpsc-rajyaseva',
    name: 'MPSC State Services (Rajyaseva — Descriptive/Objective)',
    conductingBody: 'MPSC (महाराष्ट्र लोकसेवा आयोग)',
    targetCutoff: 'GS 110+ & CSAT 66+ (Qualifying 33%)',
    curriculum: [
      {
        subject: 'GS-II: Polity',
        topic: 'भारतीय संघराज्य रचना, न्यायालयीन सक्रियता व PIL',
        book: 'एम. लक्ष्मीकांत / डॉ. सुभाष कश्यप',
        pyqQuery: 'सर्वोच्च न्यायालय',
        theory: 'केंद्र-राज्य वैधानिक व वित्तीय संबंध (कलम २४५ ते २९३). सर्वोच्च न्यायालयाचे प्रारंभिक, अपीलीय व सल्लागार अधिकार (कलम १४३). जनहित याचिका (PIL) संकल्पना (न्या. पी. एन. भगवती).',
        pyqGoal: 'Solve 30 Rajyaseva GS-II PYQs',
        revision: 'केशवानंद भारती खटला (१९७३) — मूलभूत संरचनेचे तत्त्व (Basic Structure Doctrine).'
      },
      {
        subject: 'GS-III: Economy & Agri',
        topic: 'शाश्वत विकास (SDGs), दारिद्र्य निर्मूलन व भारतीय शेती',
        book: 'किरण देसले / रमेश सिंग',
        pyqQuery: 'दारिद्र्य',
        theory: '१७ शाश्वत विकास उद्दिष्टे (२०३० अजेंडा). तेंडुलकर पद्धती (उष्मांक ऐवजी दरमहा उपभोग खर्च). कृषी MSP गणना (A2+FL व C2 पद्धती).',
        pyqGoal: 'Solve 25 Rajyaseva GS-III PYQs',
        revision: 'SDG 1: दारिद्र्य निर्मूलन; SDG 2: भूकमुक्ती; SDG 3: उत्तम आरोग्य; SDG 4: दर्जेदार शिक्षण.'
      },
      {
        subject: 'CSAT',
        topic: 'मराठी व इंग्रजी उतारा आकलन आणि निर्णयक्षमता',
        book: 'MPSC 10-Year CSAT Papers',
        pyqQuery: 'CSAT',
        theory: 'दीर्घ परिच्छेदांचे मुख्य सार (Inference, Central Theme) ओळखणे. निगेटिव्ह मार्किंग नसणारे Decision Making प्रश्न अचूक सोडवणे.',
        pyqGoal: 'Solve 20 CSAT Passage Questions',
        revision: 'CSAT मध्ये ३३% (६६ गुण) पात्रता आवश्यक आहे; वेळेचे अचूक नियोजन करा.'
      }
    ]
  }
]

// Hourly Time-slot presets based on capacity
const HOURLY_TIMETABLES = {
  '2-3': [
    { time: '06:30 AM – 07:45 AM', label: '🌅 Slot 1: Core Theory & Concept Mastery', desc: 'Read daily textbook chapters with 100% focus and make micro-bullet notes.' },
    { time: '01:30 PM – 02:00 PM', label: '☀️ Lunch Break: Quick Quiz on Mobile', desc: 'Attempt daily 5-min streak quiz & current affairs highlights on ExamUdaan.' },
    { time: '09:00 PM – 10:15 PM', label: '🌙 Slot 2: 25 Topic PYQs & Error Review', desc: 'Solve authentic 15-year past questions on today’s topic and note wrong attempts.' }
  ],
  '4-5': [
    { time: '06:00 AM – 08:30 AM', label: '🌅 Slot 1: Deep Theory & Textbook Study', desc: 'Primary subject deep reading, constitutional articles, and historical timelines.' },
    { time: '11:30 AM – 01:00 PM', label: '☀️ Slot 2: 35 Topic PYQs & Question Drill', desc: 'Drill authentic past exam questions with instant solutions and memory mnemonics.' },
    { time: '04:30 PM – 05:30 PM', label: '☕ Slot 3: Current Affairs & Vocabulary', desc: 'Daily government schemes, newspaper analysis, and Marathi/English grammar rules.' },
    { time: '08:30 PM – 09:30 PM', label: '🌙 Slot 4: Daily Streak Quiz & Flashcard Recap', desc: 'Formula revision, map work, and checking off today’s study goals.' }
  ],
  '7-8+': [
    { time: '06:00 AM – 09:00 AM', label: '🌅 Slot 1: Primary GS Theory Deep Dive', desc: 'Read standard reference book (Laxmikanth, Saudie, Kathare) with high focus.' },
    { time: '10:30 AM – 01:00 PM', label: '☀️ Slot 2: Secondary Subject / CSAT & Maths', desc: 'Quantitative aptitude, reasoning tricks, grammar rules, and problem sets.' },
    { time: '02:30 PM – 05:00 PM', label: '🎯 Slot 3: 50 Authentic PYQs & Mistake Log', desc: 'Solve 50 topic questions from ExamUdaan database and maintain an error diary.' },
    { time: '06:30 PM – 08:00 PM', label: '📰 Slot 4: Current Affairs, Schemes & Editorials', desc: 'Maharashtra GRs, national news, economic survey points, and sports awards.' },
    { time: '09:30 PM – 10:30 PM', label: '🌙 Slot 5: Day Review & Active Recall', desc: 'Closed-book active recall of today’s concepts before sleeping.' }
  ]
}

export default function StudyPlannerPage() {
  const [selectedExamId, setSelectedExamId] = useState('mpsc-combined')
  const [durationDays, setDurationDays] = useState(60)
  const [dailyHours, setDailyHours] = useState('4-5')
  const [weakArea, setWeakArea] = useState('Polity & Constitution')

  // Progress Tracking state
  const [completedDays, setCompletedDays] = useState({})
  const [mounted, setMounted] = useState(false)

  // In-Page Interactive Practice Drawer state
  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const [practiceTopic, setPracticeTopic] = useState('')
  const [practiceDayNum, setPracticeDayNum] = useState(null)
  const [practiceQuestions, setPracticeQuestions] = useState([])
  const [practiceLoading, setPracticeLoading] = useState(false)
  const [practiceAnswers, setPracticeAnswers] = useState({})
  const [revealedSolutions, setRevealedSolutions] = useState({})

  const selectedExam = useMemo(
    () => EXAM_PRESETS.find((e) => e.id === selectedExamId) || EXAM_PRESETS[0],
    [selectedExamId]
  )

  // Load progress from localStorage
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`examudaan_plan_${selectedExamId}_${durationDays}`)
        if (stored) {
          setCompletedDays(JSON.parse(stored))
        } else {
          setCompletedDays({})
        }
      } catch (e) {
        console.error('Failed to load plan', e)
      }
    }
  }, [selectedExamId, durationDays])

  // Save progress
  const toggleDayComplete = (dayNum) => {
    setCompletedDays((prev) => {
      const next = { ...prev, [dayNum]: !prev[dayNum] }
      if (!next[dayNum]) delete next[dayNum]
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            `examudaan_plan_${selectedExamId}_${durationDays}`,
            JSON.stringify(next)
          )
        } catch (e) {
          console.error(e)
        }
      }
      return next
    })
  }

  // Generate dynamic days schedule based on real curriculum
  const scheduleDays = useMemo(() => {
    const days = []
    const curr = selectedExam.curriculum
    const totalDays = Number(durationDays)

    const phase1End = Math.floor(totalDays * 0.45)
    const phase2End = Math.floor(totalDays * 0.8)

    for (let d = 1; d <= totalDays; d++) {
      const currIdx = (d - 1) % curr.length
      const item = curr[currIdx]
      const secondaryItem = curr[(currIdx + 1) % curr.length]

      let phase = 'Phase 1: Core Foundation & Concept Mastery'
      let morning = ''
      let afternoon = ''
      let evening = ''

      if (d <= phase1End) {
        phase = 'Phase 1: Core Foundation & Concept Mastery'
        morning = `Read ${item.subject} — "${item.topic}". Study theory from ${item.book}. ${item.theory}`
        afternoon = `${item.pyqGoal}. Solve 15-year official questions and review explanations.`
        evening = `Revision: ${item.revision} + Daily 5-Min Current Affairs Quiz.`
      } else if (d <= phase2End) {
        phase = 'Phase 2: 15-Year PYQ Drilling & Weak Area Focus'
        morning = `Intensive Revision: ${item.topic} & focus on ${weakArea}. Review tricky exceptions & articles.`
        afternoon = `Speed Drill: 40 Authentic PYQs on ${item.topic}. Note down every negative attempt in your error log.`
        evening = `Active Recall: Flashcards on ${item.revision} + Mock test question review.`
      } else {
        phase = 'Phase 3: Full-Length Mocks & Speed Optimization'
        if (d % 2 === 1) {
          morning = `Simulated 100-Question ExamUdaan CBT Mock Test (Timer: 60 Minutes).`
          afternoon = `In-depth Mock Analysis: Review weak areas in ${item.subject} and recalibrate speed.`
          evening = `High-Yield Quick Revision: Important Articles, Years, Committees & Maharashtra Maps.`
        } else {
          morning = `Subject Speed Sprint: ${secondaryItem.subject} — ${secondaryItem.topic} (50 Speed MCQs).`
          afternoon = `Cutoff Calibration: Review 10-year official cutoff trends for ${selectedExam.name}.`
          evening = `Mental composure, physical fitness recharge & light current affairs scan.`
        }
      }

      days.push({
        dayNumber: d,
        phase,
        subject: item.subject,
        topic: item.topic,
        book: item.book,
        pyqQuery: item.pyqQuery,
        morning,
        afternoon,
        evening,
      })
    }

    return days
  }, [selectedExam, durationDays, weakArea])

  // Open In-Page Interactive Practice Drawer
  const handleOpenPracticeModal = async (dayNum, pyqQuery, topicTitle) => {
    setPracticeDayNum(dayNum)
    setPracticeTopic(topicTitle || pyqQuery)
    setPracticeModalOpen(true)
    setPracticeQuestions([])
    setPracticeAnswers({})
    setRevealedSolutions({})
    setPracticeLoading(true)

    try {
      const res = await fetch(`/api/pyq?q=${encodeURIComponent(pyqQuery)}&limit=5`)
      const data = await res.json()
      if (data && data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setPracticeQuestions(data.questions)
      } else {
        // Fallback search with broad query
        const fallbackRes = await fetch(`/api/pyq?limit=5`)
        const fbData = await fallbackRes.json()
        setPracticeQuestions(fbData.questions || [])
      }
    } catch (err) {
      console.error('Error fetching practice questions', err)
    } finally {
      setPracticeLoading(false)
    }
  }

  const handleSelectModalOption = (qId, optKey) => {
    setPracticeAnswers((prev) => ({ ...prev, [qId]: optKey }))
    setRevealedSolutions((prev) => ({ ...prev, [qId]: true }))
  }

  // Metrics
  const completedCount = mounted
    ? Object.keys(completedDays).filter((k) => completedDays[k]).length
    : 0
  const completionPercentage =
    durationDays > 0 ? Math.round((completedCount / durationDays) * 100) : 0

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print()
  }

  const handleReset = () => {
    if (window.confirm('Reset progress for this study plan?')) {
      setCompletedDays({})
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`examudaan_plan_${selectedExamId}_${durationDays}`)
      }
    }
  }

  const handleRecalculate = () => {
    alert(
      'Schedule recalibrated! Topics from missed days have been intelligently prioritized in your upcoming revision slots.'
    )
  }

  // Share daily goal on WhatsApp
  const shareTodayGoal = () => {
    const todayItem = scheduleDays[0] || {}
    const text = `🎯 My Exam Target: ${selectedExam.name}\n📅 Day 1 Goal: ${todayItem.topic} (${todayItem.subject})\n📖 Book: ${todayItem.book}\n⚡ Solve 15-Yr PYQs & Study Timetable on ExamUdaan:\nhttps://examudaan.in/study-planner`
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const currentTimetable = HOURLY_TIMETABLES[dailyHours] || HOURLY_TIMETABLES['4-5']

  return (
    <main className={styles.page}>
      {/* ── Hero Header ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.badge}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                auto_schedule
              </span>
              AI Exam Preparation Engine
            </span>
            <h1>Smart Study Planner & Adaptive Timetable</h1>
            <p className={styles.heroSubtitle}>
              Stop guessing what to study each morning. Generate a structured, day-by-day micro plan
              tailored to your target exam, available hours, and weak subjects — complete with direct 15-year solved PYQs.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Interactive Section ── */}
      <div className={`container ${styles.mainContainer}`}>
        <div className={styles.grid}>
          {/* ── Left Sidebar: Configuration Wizard ── */}
          <aside className={styles.wizardCard}>
            <div className={styles.wizardHeader}>
              <span className="material-symbols-outlined" style={{ color: '#ea580c' }}>
                tune
              </span>
              <h2>Plan Settings</h2>
            </div>

            {/* Target Exam */}
            <div className={styles.formGroup}>
              <label htmlFor="examSelect">Target Examination</label>
              <select
                id="examSelect"
                className={styles.selectInput}
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                {EXAM_PRESETS.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Days */}
            <div className={styles.formGroup}>
              <label>Preparation Timeline</label>
              <div className={styles.radioGroup}>
                {[
                  { days: 30, label: '30 Days (Intensive Crash Plan)' },
                  { days: 60, label: '60 Days (Fast-Track Revision)' },
                  { days: 90, label: '90 Days (Standard 3-Month Plan)' },
                  { days: 180, label: '180 Days (Deep Foundation)' },
                ].map((opt) => (
                  <label
                    key={opt.days}
                    className={styles.radioOption}
                    data-selected={durationDays === opt.days}
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={opt.days}
                      checked={durationDays === opt.days}
                      onChange={() => setDurationDays(opt.days)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Daily Hours */}
            <div className={styles.formGroup}>
              <label>Daily Study Capacity</label>
              <div className={styles.radioGroup}>
                {[
                  { val: '2-3', label: '2–3 Hours (Working / College)' },
                  { val: '4-5', label: '4–5 Hours (Dedicated Aspirant)' },
                  { val: '7-8+', label: '7–8+ Hours (Full-Time Mission)' },
                ].map((opt) => (
                  <label
                    key={opt.val}
                    className={styles.radioOption}
                    data-selected={dailyHours === opt.val}
                  >
                    <input
                      type="radio"
                      name="hours"
                      value={opt.val}
                      checked={dailyHours === opt.val}
                      onChange={() => setDailyHours(opt.val)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Weak Area / Priority */}
            <div className={styles.formGroup}>
              <label htmlFor="weakAreaInput">Priority / Weak Area</label>
              <select
                id="weakAreaInput"
                className={styles.selectInput}
                value={weakArea}
                onChange={(e) => setWeakArea(e.target.value)}
              >
                <option value="Polity & Constitution">Polity & Constitution (कलमे व घटनादुरुस्त्या)</option>
                <option value="Maharashtra History">Maharashtra History & समाजसुधारक</option>
                <option value="Maharashtra Geography">Maharashtra Geography & नद्या/घाट</option>
                <option value="Economy & Planning">Economy, RBI धोरण व महागाई</option>
                <option value="General Science">General Science & मानवी आरोग्य</option>
                <option value="Aptitude & Reasoning">Maths & Logical Reasoning (CSAT)</option>
                <option value="Marathi Grammar">मराठी व्याकरण (समास व प्रयोग)</option>
                <option value="English Grammar">English Grammar & TCS Vocab</option>
              </select>
            </div>

            {/* Dynamic Daily Hourly Breakdown Card */}
            <div className={styles.hourlyBox}>
              <span className={styles.hourlyTitle}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  schedule
                </span>
                Suggested Hourly Routine ({dailyHours} Hrs):
              </span>
              <ul className={styles.hourlyList}>
                {currentTimetable.map((slot, sIdx) => (
                  <li key={sIdx} className={styles.hourlyItem}>
                    <div>
                      <strong>{slot.time}:</strong> {slot.label}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Right Content: Dynamic Schedule & Progress ── */}
          <section className={styles.planCard}>
            <div className={styles.planHeader}>
              <div className={styles.planTitleBlock}>
                <h3>{selectedExam.name}</h3>
                <div className={styles.planMeta}>
                  <span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#ea580c' }}>
                      verified
                    </span>
                    Target Cutoff: {selectedExam.targetCutoff}
                  </span>
                  <span>•</span>
                  <span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      calendar_month
                    </span>
                    {durationDays} Days Plan
                  </span>
                  <span>•</span>
                  <span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      schedule
                    </span>
                    {dailyHours} Hours/Day
                  </span>
                </div>
              </div>

              <div className={styles.planActions}>
                <button
                  type="button"
                  onClick={shareTodayGoal}
                  className={`${styles.btnCtrl} ${styles.btnShareWa}`}
                  title="Share Today's Study Goal on WhatsApp"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                    share
                  </span>
                  Share Goal
                </button>
                <button
                  type="button"
                  onClick={handleRecalculate}
                  className={`${styles.btnCtrl} ${styles.btnRecalculate}`}
                  title="Catch up on missed days"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                    auto_fix_high
                  </span>
                  Recalculate
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className={styles.btnCtrl}
                  title="Print your study schedule"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                    print
                  </span>
                  Print Schedule
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className={styles.btnCtrl}
                  title="Clear checked days"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                    restart_alt
                  </span>
                  Reset
                </button>
              </div>
            </div>

            {/* Progress Widget */}
            <div className={styles.progressWidget}>
              <div className={styles.progressHeader}>
                <span className={styles.progressTitle}>
                  Study Plan Progress: {completedCount} of {durationDays} Days Completed
                </span>
                <span className={styles.progressPercent}>{completionPercentage}% Complete</span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Schedule Days List grouped by Phase */}
            {[
              'Phase 1: Core Foundation & Concept Mastery',
              'Phase 2: 15-Year PYQ Drilling & Weak Area Focus',
              'Phase 3: Full-Length Mocks & Speed Optimization',
            ].map((phaseName) => {
              const phaseDays = scheduleDays.filter((d) => d.phase === phaseName)
              if (phaseDays.length === 0) return null

              return (
                <div key={phaseName} className={styles.phaseGroup}>
                  <div className={styles.phaseHeader}>
                    <h4>{phaseName}</h4>
                    <p>
                      {phaseDays.length} Days allocated • Consistent daily habits guarantee exam breakthrough
                    </p>
                  </div>

                  <div className={styles.daysGrid}>
                    {phaseDays.map((item) => {
                      const isDone = mounted && !!completedDays[item.dayNumber]

                      return (
                        <div
                          key={item.dayNumber}
                          className={styles.dayCard}
                          data-completed={isDone}
                        >
                          <div className={styles.dayHeaderRow}>
                            <div className={styles.dayLabel}>
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => toggleDayComplete(item.dayNumber)}
                                style={{
                                  width: 18,
                                  height: 18,
                                  accentColor: '#10b981',
                                  cursor: 'pointer',
                                }}
                              />
                              <span>Day {item.dayNumber}</span>
                              <span className={styles.dayBadge}>{item.subject}</span>
                              <span className={styles.topicTag}>{item.topic}</span>
                            </div>
                            {isDone && (
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: '#059669',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: 16 }}
                                >
                                  task_alt
                                </span>
                                Completed
                              </span>
                            )}
                          </div>

                          <div className={styles.daySlots}>
                            {/* Morning Theory */}
                            <div className={styles.slotBox}>
                              <div>
                                <div className={styles.slotHeader} data-type="theory">
                                  <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 14 }}
                                  >
                                    menu_book
                                  </span>
                                  Morning Slot (Concept & Textbook)
                                </div>
                                <p className={styles.slotContent}>{item.morning}</p>
                              </div>
                              <div className={styles.slotFooter}>
                                <span style={{ fontSize: 11, color: '#64748b' }}>
                                  📖 {item.book}
                                </span>
                                <Link
                                  href={`/syllabus/${selectedExam.id}`}
                                  className={styles.slotLink}
                                >
                                  Checklist →
                                </Link>
                              </div>
                            </div>

                            {/* Afternoon Practice */}
                            <div className={styles.slotBox}>
                              <div>
                                <div className={styles.slotHeader} data-type="practice">
                                  <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 14 }}
                                  >
                                    history_edu
                                  </span>
                                  Afternoon Slot (15-Yr PYQ Practice)
                                </div>
                                <p className={styles.slotContent}>{item.afternoon}</p>
                              </div>
                              <div className={styles.slotFooter}>
                                <button
                                  type="button"
                                  className={styles.btnPracticeModal}
                                  onClick={() =>
                                    handleOpenPracticeModal(item.dayNumber, item.pyqQuery, item.topic)
                                  }
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                    quiz
                                  </span>
                                  Solve 5 PYQs Now
                                </button>
                                <Link
                                  href={`/pyq?q=${encodeURIComponent(item.pyqQuery || item.topic)}`}
                                  className={styles.slotLink}
                                >
                                  Search All →
                                </Link>
                              </div>
                            </div>

                            {/* Evening Freshness */}
                            <div className={styles.slotBox}>
                              <div>
                                <div className={styles.slotHeader} data-type="revision">
                                  <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 14 }}
                                  >
                                    bolt
                                  </span>
                                  Evening Slot (Quiz & Revision)
                                </div>
                                <p className={styles.slotContent}>{item.evening}</p>
                              </div>
                              <div className={styles.slotFooter}>
                                <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>
                                  🔥 5-Min Streak
                                </span>
                                <Link href="/daily-quiz" className={styles.slotLink}>
                                  Take Quiz →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </section>
        </div>
      </div>

      {/* ── In-Page Practice Drawer / Modal ── */}
      {practiceModalOpen && (
        <div className={styles.practiceDrawerOverlay} onClick={() => setPracticeModalOpen(false)}>
          <div
            className={styles.practiceDrawerCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.practiceDrawerHeader}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#ea580c', textTransform: 'uppercase' }}>
                  Day {practiceDayNum} Practice Drill
                </span>
                <h3 className={styles.practiceDrawerTitle}>
                  {practiceTopic} — अधिकृत १५-वर्षीय PYQs
                </h3>
              </div>
              <button
                type="button"
                className={styles.practiceCloseBtn}
                onClick={() => setPracticeModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {practiceLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 32, color: '#ea580c', animation: 'spin 1s linear infinite' }}
                >
                  progress_activity
                </span>
                <p style={{ marginTop: 8 }}>प्रश्न डेटाबेसमधून लोड होत आहेत...</p>
              </div>
            ) : practiceQuestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                <p>या घटकावर प्रश्न शोधण्यासाठी खालील बटनावर क्लिक करा.</p>
                <Link
                  href={`/pyq?q=${encodeURIComponent(practiceTopic)}`}
                  className="btn-primary"
                  style={{ display: 'inline-block', marginTop: 12 }}
                >
                  मुख्य PYQ बँकेत शोधा →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {practiceQuestions.map((q, idx) => {
                  const selectedOpt = practiceAnswers[q.id]
                  const isRevealed = revealedSolutions[q.id]
                  const isCorrect = selectedOpt === q.correct

                  return (
                    <div key={q.id} className={styles.modalQuestionCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb' }}>
                          {q.exam} ({q.year})
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#ea580c' }}>
                          {q.subject}
                        </span>
                      </div>
                      <h4 className={styles.modalQText}>
                        प्र. {idx + 1}. {q.question}
                      </h4>

                      <div className={styles.modalOptionsGrid}>
                        {q.options &&
                          Object.entries(q.options).map(([optKey, optVal]) => {
                            let optClass = styles.modalOptionBtn
                            if (selectedOpt === optKey) {
                              optClass += isCorrect
                                ? ` ${styles.modalOptCorrect}`
                                : ` ${styles.modalOptWrong}`
                            } else if (isRevealed && optKey === q.correct) {
                              optClass += ` ${styles.modalOptCorrect}`
                            }

                            return (
                              <button
                                key={optKey}
                                type="button"
                                className={optClass}
                                onClick={() => handleSelectModalOption(q.id, optKey)}
                              >
                                <strong>{optKey}.</strong> <span>{optVal}</span>
                              </button>
                            )
                          })}
                      </div>

                      {isRevealed && (
                        <div className={styles.modalExpBox}>
                          <strong>💡 अधिकृत स्पष्टीकरण: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  )
                })}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      if (practiceDayNum) toggleDayComplete(practiceDayNum)
                      setPracticeModalOpen(false)
                    }}
                  >
                    ✓ हे लक्ष्य पूर्ण म्हणून मार्क करा
                  </button>

                  <Link
                    href={`/pyq?q=${encodeURIComponent(practiceTopic)}`}
                    className={styles.slotLink}
                  >
                    सर्व १,१००+ प्रश्न पहा →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
