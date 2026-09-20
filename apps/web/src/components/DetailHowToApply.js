// ============================================================
// components/DetailHowToApply.js — Bilingual Apply Steps
// Supports instant English <-> Marathi rendering via LanguageContext
// ============================================================

'use client'

import React from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function DetailHowToApply({
  website,
  advtRefNo,
  isWalkIn,
  customProcess,
  customNote,
  requiredDocs = []
}) {
  const { isMarathi } = useLanguage()

  const onlineStepsMr = [
    `अधिकृत संकेतस्थळाला भेट द्या: ${website || 'शासकीय पोर्टल'}.`,
    'भरती / रिक्त जागा (Recruitment / Vacancy / Career) विभागात जा.',
    advtRefNo
      ? `जाहिरात क्रमांक: ${advtRefNo} शोधा.`
      : 'या पदाच्या भरती / जाहिरात लिंकवर क्लिक करा.',
    'नवीन नोंदणी (Register) करा आणि वैयक्तिक, संपर्क व शैक्षणिक माहिती अचूक भरा.',
    'आवश्यक पासपोर्ट फोटो, स्वाक्षरी व विहित प्रमाणपत्रे स्कॅन करून अपलोड करा.',
    'अर्ज शुल्क नेट बँकिंग, डेबिट/क्रेडिट कार्ड किंवा UPI द्वारे भरा (लागू असल्यास).',
    'भरलेली सर्व माहिती काळजीपूर्वक तपासून अर्ज सबमिट (Submit) करा.',
    'भविष्यकालीन संदर्भासाठी भरलेल्या अर्जाची प्रिंट काढून किंवा PDF सुरक्षित सेव्ह करून ठेवा.'
  ]

  const onlineStepsEn = [
    `Visit the official website: ${website || 'the official portal'}.`,
    'Navigate to the Recruitment / Vacancy / Career section.',
    advtRefNo
      ? `Look for Advertisement Number: ${advtRefNo}.`
      : 'Find the recruitment link for this post.',
    'Register your profile and fill in personal, contact, and education details.',
    'Upload scanned copies of photo, signature, and required certificates.',
    'Pay the application fee via net banking, debit/credit card, or UPI.',
    'Review all fields carefully and submit the application form.',
    'Download and print the submitted application for future reference.'
  ]

  const walkInStepsMr = [
    customProcess || 'थेट मुलाखतीचे सविस्तर वेळापत्रक आणि ठिकाण तपासण्यासाठी अधिकृत जाहिरात PDF पहा.',
    customNote || 'उशिरा पोहोचणाऱ्या उमेदवारांचा विचार केला जाणार नाही.',
    'सर्व मूळ शैक्षणिक व ओळखीची कागदपत्रे आणि स्व-साक्षांकित (Self-attested) प्रतींचा संच सोबत ठेवा.',
    'नुकतेच काढलेले पासपोर्ट आकाराचे रंगीत फोटो सोबत आणा.',
    'ठरवून दिलेल्या वेळेपूर्वी मुलाखतीच्या ठिकाणी वेळेत पोहोचा.'
  ].filter(Boolean)

  const walkInStepsEn = [
    customProcess || 'Check the official notification PDF for the walk-in schedule and venue.',
    customNote || 'Candidates reporting late may not be considered.',
    'Carry all original documents + one set of self-attested photocopies.',
    'Bring recent passport-size photographs.',
    'Reach the venue before the scheduled time.'
  ].filter(Boolean)

  const steps = isWalkIn
    ? (isMarathi ? walkInStepsMr : walkInStepsEn)
    : (isMarathi ? onlineStepsMr : onlineStepsEn)

  return (
    <div>
      <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
        {steps.map((step, i) => (
          <li key={i} style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>
            {step}
          </li>
        ))}
      </ol>

      {requiredDocs && requiredDocs.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>
            {isMarathi ? 'आवश्यक कागदपत्रे:' : 'Required Documents:'}
          </h3>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {requiredDocs.map((doc, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.5 }}>
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
