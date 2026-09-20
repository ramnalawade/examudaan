// ============================================================
// components/DetailActionSteps.js — Bilingual Steps for Results & Admit Cards
// Supports instant English <-> Marathi rendering via LanguageContext
// ============================================================

'use client'

import React from 'react'
import { useLanguage } from '../context/LanguageContext'

export function ResultCheckSteps({ website, title }) {
  const { isMarathi } = useLanguage()

  const stepsMr = [
    `संबंधित विभागाच्या अधिकृत संकेतस्थळाला भेट द्या: ${website || 'शासकीय पोर्टल'}.`,
    'मुख्य पृष्ठावरील निकाल / गुणवत्ता यादी (Results / Selection List / Merit List) विभागात जा.',
    `${title || 'या परीक्षे'}च्या निकाल / अंतिम गुणवत्ता यादीच्या लिंकवर क्लिक करा.`,
    'आपला रोल नंबर / नोंदणी क्रमांक (Roll Number / Reg ID) प्रविष्ट करा किंवा गुणवत्ता यादी PDF मध्ये शोधा.',
    'आपला निकाल / कट-ऑफ गुण तपासून पुढील निवड प्रक्रियेसाठी किंवा कागदपत्र पडताळणीसाठी प्रिंट किंवा PDF सेव्ह करून ठेवा.'
  ]

  const stepsEn = [
    `Visit the official website: ${website || 'the official portal'}.`,
    'Navigate to the Results / Selection List / Merit List section on the homepage.',
    `Click on the result announcement link for ${title || 'this examination'}.`,
    'Enter your Roll Number / Registration ID, or search your roll number in the published result PDF.',
    'Verify your score / qualification status and download/print the merit list for future recruitment stages.'
  ]

  const steps = isMarathi ? stepsMr : stepsEn

  return (
    <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
      {steps.map((step, i) => (
        <li key={i} style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>
          {step}
        </li>
      ))}
    </ol>
  )
}

export function AdmitCardDownloadSteps({ website, examName }) {
  const { isMarathi } = useLanguage()

  const stepsMr = [
    `अधिकृत परीक्षा पोर्टलला भेट द्या: ${website || 'अधिकृत संकेतस्थळ'}.`,
    'प्रवेशपत्र / हॉल तिकीट डाउनलोड (Download Admit Card / Hall Ticket) लिंकवर क्लिक करा.',
    'आपला अर्ज क्रमांक / नोंदणी क्रमांक आणि जन्मतारीख / पासवर्ड प्रविष्ट करून लॉग इन करा.',
    'स्क्रीनवर प्रदर्शित झालेले प्रवेशपत्र (Hall Ticket) काळजीपूर्वक तपासा आणि डाऊनलोड करा.',
    'परीक्षा केंद्रावर प्रवेश मिळवण्यासाठी हॉल तिकीटची स्पष्ट छापील प्रत (Printout) काढून ठेवा.'
  ]

  const stepsEn = [
    `Visit the official examination portal: ${website || 'the official website'}.`,
    'Click on the "Download Admit Card / Hall Ticket" notification link.',
    'Log in using your Application Number / Registration ID and Date of Birth / Password.',
    'Verify all details displayed on your admit card and click Download / Save PDF.',
    'Print a clear, readable copy of the admit card to carry to the examination centre.'
  ]

  const steps = isMarathi ? stepsMr : stepsEn

  return (
    <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
      {steps.map((step, i) => (
        <li key={i} style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>
          {step}
        </li>
      ))}
    </ol>
  )
}

export function AdmitCardDocsToCarry({ customDocs = [] }) {
  const { isMarathi } = useLanguage()

  const defaultMr = [
    'प्रवेशपत्राची (Admit Card) मूळ स्पष्ट छापील प्रत (Printout).',
    'मूळ अधिकृत फोटो ओळखपत्र (आधार कार्ड, पॅन कार्ड, मतदार ओळखपत्र किंवा ड्रायव्हिंग लायसन्स).',
    'ओळखपत्राची एक स्पष्ट झेरॉक्स प्रत.',
    'नुकतेच काढलेले २ पासपोर्ट आकाराचे रंगीत फोटो.',
    'काळा किंवा निळा बॉलपॉईंट पेन (विहित असल्यास).'
  ]

  const defaultEn = [
    'Printed copy of the Admit Card / Hall Ticket (clear printout).',
    'Original Photo ID proof (Aadhaar Card, PAN Card, Voter ID, or Driving License).',
    'One clear photocopy of the photo ID proof.',
    '2 recent passport-size colour photographs.',
    'Black or Blue ballpoint pen (if required for OMR sheets).'
  ]

  const docs = (customDocs && customDocs.length > 0)
    ? customDocs
    : (isMarathi ? defaultMr : defaultEn)

  return (
    <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, margin: 0 }}>
      {docs.map((doc, i) => (
        <li key={i} style={{ fontSize: 14, color: '#1D4ED8', lineHeight: 1.6 }}>
          {doc}
        </li>
      ))}
    </ul>
  )
}
