// ============================================================
// app/study-planner/page.js — AI Smart Adaptive Study Planner
// ExamUdaan.in — Day-by-Day Personalized Micro-Curriculum & Live PYQs
// Features: Real Exam Topics, Direct PYQs, Hourly Schedule, Streak
// ZERO INLINE STYLES POLICY COMPLIANT
// SIMPLE & INTUITIVE — ZERO CONFUSING STRIKETHROUGH
// FULLY RESPONSIVE ACROSS MOBILE, TABLET, AND DESKTOP
// ============================================================

'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  trackStudyPlannerGenerate,
  trackPlannerDayComplete,
  trackPlannerTaskClick,
} from '@/lib/analytics'
import styles from './studyPlanner.module.css'

// Comprehensive real syllabus modules for Maharashtra & National Exams
const EXAM_PRESETS = [
  {
    id: 'mpsc-combined',
    name: 'MPSC Combined Group B & C (PSI, STI, ASO)',
    shortName: 'MPSC Combined Gr B & C',
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
    shortName: 'Maharashtra Police Bharti',
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
    shortName: 'Talathi & ZP Bharti (TCS)',
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
    name: 'MPSC State Services (Rajyaseva — Civil Services)',
    shortName: 'MPSC Rajyaseva',
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
  const [routineOpen, setRoutineOpen] = useState(false)

  // Progress Tracking state
  const [completedDays, setCompletedDays] = useState({})
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`examudaan_study_progress_${selectedExamId}`)
        if (stored) {
          setCompletedDays(JSON.parse(stored))
        } else {
          setCompletedDays({})
        }
      } catch {
        setCompletedDays({})
      }
    }
  }, [selectedExamId])

  // Save to localStorage whenever completedDays change
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          `examudaan_study_progress_${selectedExamId}`,
          JSON.stringify(completedDays)
        )
      } catch (err) {
        console.error('Failed to save study planner progress to localStorage', err)
      }
    }
  }, [completedDays, selectedExamId, mounted])

  const selectedExam = useMemo(() => {
    return EXAM_PRESETS.find((e) => e.id === selectedExamId) || EXAM_PRESETS[0]
  }, [selectedExamId])

  // Track planner generation when exam or duration changes
  useEffect(() => {
    trackStudyPlannerGenerate({
      exam_name: selectedExam.name,
      plan_duration_days: durationDays,
      daily_hours: dailyHours,
    })
  }, [selectedExam.name, durationDays, dailyHours])

  // Build the day-by-day micro curriculum schedule
  const scheduleDays = useMemo(() => {
    const curriculum = selectedExam.curriculum || []
    if (curriculum.length === 0) return []

    const prioritizedList = [
      ...curriculum.filter((c) => c.subject === weakArea),
      ...curriculum.filter((c) => c.subject !== weakArea),
    ]

    const days = []
    const totalDays = Number(durationDays) || 30

    for (let day = 1; day <= totalDays; day++) {
      const topicItem = prioritizedList[(day - 1) % prioritizedList.length]
      let phase = 'Phase 1: Core Foundation & Concept Mastery'
      if (day > totalDays * 0.7) {
        phase = 'Phase 3: Full-Length Mocks & Speed Optimization'
      } else if (day > totalDays * 0.35) {
        phase = 'Phase 2: 15-Year PYQ Drilling & Weak Area Focus'
      }

      days.push({
        dayNumber: day,
        phase,
        subject: topicItem.subject,
        topic: topicItem.topic,
        book: topicItem.book,
        pyqQuery: topicItem.pyqQuery,
        morning: topicItem.theory,
        afternoon: topicItem.pyqGoal,
        evening: topicItem.revision,
      })
    }

    return days
  }, [selectedExam, weakArea, durationDays])

  // Simple Toggle Day Complete (NO STRIKETHROUGH)
  const toggleDayComplete = (dayNum) => {
    setCompletedDays((prev) => {
      const willBeDone = !prev[dayNum]
      const updated = { ...prev, [dayNum]: willBeDone }
      if (willBeDone) {
        trackPlannerDayComplete({
          plan_id: selectedExamId,
          day_number: dayNum,
          total_days: durationDays,
        })
      }
      return updated
    })
  }

  // Clear progress
  const handleReset = () => {
    if (confirm('Are you sure you want to reset completed days for this study plan?')) {
      setCompletedDays({})
    }
  }

  // Print schedule
  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print()
  }

  // Share daily goal on WhatsApp
  const shareTodayGoal = () => {
    const todayItem = scheduleDays[0] || {}
    const text = `🎯 My Exam Target: ${selectedExam.name}\n📅 Day 1 Goal: ${todayItem.topic} (${todayItem.subject})\n📖 Book: ${todayItem.book}\n⚡ Solve 15-Yr PYQs & Study Timetable on ExamUdaan:\nhttps://examudaan.in/study-planner`
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const completedCount = mounted
    ? Object.keys(completedDays).filter((k) => completedDays[k]).length
    : 0

  const completionPercentage =
    durationDays > 0 ? Math.round((completedCount / durationDays) * 100) : 0

  const currentTimetable = HOURLY_TIMETABLES[dailyHours] || HOURLY_TIMETABLES['4-5']

  return (
    <div className={styles.page}>
      {/* ── Hero Header ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              auto_schedule
            </span>
            <span>AI Smart Study Engine</span>
          </div>
          <h1 className={styles.heroTitle}>Smart Exam Study Planner</h1>
          <p className={styles.heroSubtitle}>
            No more guessing what to study each morning. Get a personalized, day-by-day micro curriculum tailored to your exam, available hours, and priority subjects — complete with direct 15-year official solved PYQs.
          </p>
        </div>
      </section>

      <main className={styles.container}>
        {/* ── Top Configurator Panel (Sleek Pills & Dropdowns) ── */}
        <section className={styles.configCard} aria-label="Planner Configuration">
          <div className={styles.configTopRow}>
            <h2 className={styles.configHeading}>
              <span className={`material-symbols-outlined ${styles.configHeadingIcon}`}>tune</span>
              <span>Customize Your Daily Study Plan</span>
            </h2>
            <span className={styles.targetCutoffBadge}>
              Target Benchmark: {selectedExam.targetCutoff}
            </span>
          </div>

          <div className={styles.configGrid}>
            {/* Target Exam Selection Pills */}
            <div className={styles.configSection}>
              <span className={styles.configLabel}>
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>school</span>
                1. Target Examination:
              </span>
              <div className={styles.pillsScrollRow}>
                {EXAM_PRESETS.map((exam) => (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => setSelectedExamId(exam.id)}
                    className={`${styles.pillBtn} ${selectedExamId === exam.id ? styles.pillBtnActive : ''}`}
                  >
                    <span>{exam.shortName || exam.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Timeline Pills */}
            <div className={styles.configSection}>
              <span className={styles.configLabel}>
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>calendar_month</span>
                2. Preparation Timeline:
              </span>
              <div className={styles.pillsScrollRow}>
                {[
                  { days: 30, label: '30 Days (Crash Plan)' },
                  { days: 60, label: '60 Days (Fast-Track)' },
                  { days: 90, label: '90 Days (Standard 3-Mo)' },
                  { days: 180, label: '180 Days (Foundation)' },
                ].map((opt) => (
                  <button
                    key={opt.days}
                    type="button"
                    onClick={() => setDurationDays(opt.days)}
                    className={`${styles.pillBtn} ${durationDays === opt.days ? styles.pillBtnActive : ''}`}
                  >
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Hours Capacity Pills */}
            <div className={styles.configSection}>
              <span className={styles.configLabel}>
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>schedule</span>
                3. Daily Study Capacity:
              </span>
              <div className={styles.pillsScrollRow}>
                {[
                  { val: '2-3', label: '2–3 Hours (Working / College)' },
                  { val: '4-5', label: '4–5 Hours (Dedicated Aspirant)' },
                  { val: '7-8+', label: '7–8+ Hours (Full-Time Mission)' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setDailyHours(opt.val)}
                    className={`${styles.pillBtn} ${dailyHours === opt.val ? styles.pillBtnActive : ''}`}
                  >
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weak Area / Priority Dropdown + Hourly Routine Toggle */}
            <div className={styles.configSection}>
              <label htmlFor="weakAreaSelect" className={styles.configLabel}>
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>priority_high</span>
                4. Priority Focus Area:
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="weakAreaSelect"
                  className={styles.selectInput}
                  value={weakArea}
                  onChange={(e) => setWeakArea(e.target.value)}
                >
                  <option value="Polity & Constitution">Polity & Constitution (कलमे, सरनामा व घटनादुरुस्त्या)</option>
                  <option value="Maharashtra History">Maharashtra History & समाजसुधारक चळवळ</option>
                  <option value="Maharashtra Geography">Maharashtra Geography & नद्या, घाट व शिखरे</option>
                  <option value="Economy & Planning">Economy, RBI धोरण व पंचवार्षिक योजना</option>
                  <option value="General Science">General Science & मानवी आरोग्य/रक्तगट</option>
                  <option value="Aptitude & Reasoning">Maths & Logical Reasoning (CSAT/TCS)</option>
                  <option value="Marathi Grammar">मराठी व्याकरण (समास, प्रयोग व वर्णविचार)</option>
                  <option value="English Language">English Language & TCS Vocabulary</option>
                </select>
                <span className={`material-symbols-outlined ${styles.selectArrow}`}>expand_more</span>
              </div>
            </div>

            {/* Collapsible Suggested Hourly Routine Accordion */}
            <div className={styles.routineToggleRow}>
              <button
                type="button"
                onClick={() => setRoutineOpen(!routineOpen)}
                className={`${styles.routineToggleBtn} ${routineOpen ? styles.routineToggleBtnActive : ''}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  {routineOpen ? 'expand_less' : 'schedule'}
                </span>
                <span>
                  {routineOpen
                    ? 'Hide Hourly Routine'
                    : `View Suggested Hourly Routine (${dailyHours} Hours/Day) ▼`}
                </span>
              </button>
              <span style={{ fontSize: 12, color: '#78716c' }}>
                💡 {scheduleDays.length} Days tailored to {selectedExam.conductingBody}
              </span>
            </div>

            {routineOpen && (
              <div className={styles.hourlyBox}>
                <div className={styles.hourlyTitle}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ea580c' }}>
                    alarm_on
                  </span>
                  <span>Recommended Daily Time Slots ({dailyHours} Hours):</span>
                </div>
                <div className={styles.hourlyGrid}>
                  {currentTimetable.map((slot, sIdx) => (
                    <div key={sIdx} className={styles.hourlyCard}>
                      <span className={styles.hourlyTime}>{slot.time}</span>
                      <strong className={styles.hourlyLabel}>{slot.label}</strong>
                      <p className={styles.hourlyDesc}>{slot.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Progress & Action Bar ──────────────────────────── */}
        <section className={styles.overviewCard}>
          <div className={styles.overviewHeader}>
            <div className={styles.overviewTitleBlock}>
              <h2 className={styles.overviewExamTitle}>{selectedExam.name}</h2>
              <div className={styles.overviewMetaRow}>
                <span>{selectedExam.conductingBody}</span>
                <span>•</span>
                <span>{durationDays} Days Plan</span>
                <span>•</span>
                <span>{dailyHours} Hours/Day</span>
              </div>
            </div>

            <div className={styles.actionBtnsRow}>
              <button
                type="button"
                onClick={shareTodayGoal}
                className={`${styles.btnActionCtrl} ${styles.btnActionWa}`}
                title="Share Today's Goal on WhatsApp"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>share</span>
                <span>Share Goal</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className={styles.btnActionCtrl}
                title="Print your study schedule"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>print</span>
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className={styles.btnActionCtrl}
                title="Reset progress"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>restart_alt</span>
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Progress Widget */}
          <div className={styles.progressWidget}>
            <div className={styles.progressInfoRow}>
              <span>
                Study Progress: {completedCount} of {durationDays} Days Done
              </span>
              <span className={styles.progressPercentText}>{completionPercentage}% Complete</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </section>

        {/* ── Schedule Days Grouped by Phase ─────────────────── */}
        {[
          'Phase 1: Core Foundation & Concept Mastery',
          'Phase 2: 15-Year PYQ Drilling & Weak Area Focus',
          'Phase 3: Full-Length Mocks & Speed Optimization',
        ].map((phaseName) => {
          const phaseDays = scheduleDays.filter((d) => d.phase === phaseName)
          if (phaseDays.length === 0) return null

          return (
            <section key={phaseName} className={styles.phaseGroup}>
              <div className={styles.phaseHeader}>
                <h3 className={styles.phaseTitle}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#ea580c' }}>
                    flag
                  </span>
                  <span>{phaseName}</span>
                </h3>
                <p className={styles.phaseSubtitle}>
                  {phaseDays.length} Days allocated • Consistent daily habits guarantee exam breakthrough
                </p>
              </div>

              <div className={styles.daysGrid}>
                {phaseDays.map((item) => {
                  const isDone = mounted && !!completedDays[item.dayNumber]

                  return (
                    <div
                      key={item.dayNumber}
                      className={`${styles.dayCard} ${isDone ? styles.dayCardCompleted : ''}`}
                    >
                      <div className={styles.dayCardHeader}>
                        <div className={styles.dayCardHeaderLeft}>
                          <div className={styles.dayMetaPills}>
                            <span className={styles.dayNumberPill}>Day {item.dayNumber}</span>
                            <span className={styles.subjectBadge}>{item.subject}</span>
                          </div>
                          {/* Topic Title — NEVER STRIKETHROUGH! Always 100% readable */}
                          <h4 className={styles.dayTopicTitle}>{item.topic}</h4>
                        </div>

                        {/* Clean Toggle Completion Button (Simple, No Strikethrough) */}
                        <button
                          type="button"
                          onClick={() => toggleDayComplete(item.dayNumber)}
                          className={`${styles.btnCompleteToggle} ${isDone ? styles.btnCompleteToggleActive : ''}`}
                          aria-label={`Mark Day ${item.dayNumber} as completed`}
                        >
                          <span className={`material-symbols-outlined ${isDone ? styles.completeIcon : styles.incompleteIcon}`}>
                            {isDone ? 'task_alt' : 'radio_button_unchecked'}
                          </span>
                          <span>{isDone ? '✓ Day Completed' : 'Mark as Done'}</span>
                        </button>
                      </div>

                      {/* 3 Micro-Slots (Morning, Afternoon, Evening) */}
                      <div className={styles.daySlotsGrid}>
                        {/* Morning Concept Slot */}
                        <div className={styles.slotBox}>
                          <div>
                            <div className={`${styles.slotHeader} ${styles.slotHeaderMorning}`}>
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                                menu_book
                              </span>
                              <span>Morning: Concept &amp; Notes</span>
                            </div>
                            <p className={styles.slotContentText}>{item.morning}</p>
                          </div>
                          <div className={styles.slotFooter}>
                            <span className={styles.slotBookText}>📖 {item.book}</span>
                            <Link
                              href={`/syllabus/${selectedExam.id}`}
                              className={styles.slotActionLink}
                              onClick={() => trackPlannerTaskClick({ plan_id: selectedExamId, task_type: 'Checklist' })}
                            >
                              <span>Checklist →</span>
                            </Link>
                          </div>
                        </div>

                        {/* Afternoon PYQ Practice Slot */}
                        <div className={styles.slotBox}>
                          <div>
                            <div className={`${styles.slotHeader} ${styles.slotHeaderAfternoon}`}>
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                                quiz
                              </span>
                              <span>Afternoon: 15-Yr PYQs</span>
                            </div>
                            <p className={styles.slotContentText}>{item.afternoon}</p>
                          </div>
                          <div className={styles.slotFooter}>
                            <span className={styles.slotBookText}>🎯 15-Year Solved Bank</span>
                            <Link
                              href={`/pyq?q=${encodeURIComponent(item.pyqQuery || item.topic)}`}
                              className={`${styles.slotActionLink} ${styles.slotActionPyq}`}
                              onClick={() => trackPlannerTaskClick({ plan_id: selectedExamId, task_type: 'PYQ_Search' })}
                            >
                              <span>Solve PYQs →</span>
                            </Link>
                          </div>
                        </div>

                        {/* Evening Revision & Quiz Slot */}
                        <div className={styles.slotBox}>
                          <div>
                            <div className={`${styles.slotHeader} ${styles.slotHeaderEvening}`}>
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                                bolt
                              </span>
                              <span>Evening: Recap &amp; Quiz</span>
                            </div>
                            <p className={styles.slotContentText}>{item.evening}</p>
                          </div>
                          <div className={styles.slotFooter}>
                            <span className={styles.slotBookText}>🔥 5-Min Daily Streak</span>
                            <Link
                              href="/daily-quiz"
                              className={`${styles.slotActionLink} ${styles.slotActionQuiz}`}
                              onClick={() => trackPlannerTaskClick({ plan_id: selectedExamId, task_type: 'Daily_Quiz' })}
                            >
                              <span>Take Quiz →</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
