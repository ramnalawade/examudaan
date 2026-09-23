// ============================================================
// app/police-calculator/page.js
// ExamUdaan.in — Maharashtra Police Bharti Composite Merit Calculator
// Calculates Physical (50) + Written (100) = 150 Marks with district cutoffs
// Fully bilingual in Marathi & English using useLanguage()
// ============================================================
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'
import styles from './policeCalculator.module.css'

// ── Official Physical Test Marking Slates (महाराष्ट्र पोलीस शिपाई नियम) ──
const MALE_SLATES = {
  run1600: [
    { label_mr: "५ मि. १० से. किंवा कमी", label_en: "5 min 10 sec or less", marks: 20 },
    { label_mr: "५ मि. ११ से. ते ५ मि. ३० से.", label_en: "5 min 11 sec to 5 min 30 sec", marks: 18 },
    { label_mr: "५ मि. ३१ से. ते ५ मि. ५० से.", label_en: "5 min 31 sec to 5 min 50 sec", marks: 15 },
    { label_mr: "५ मि. ५१ से. ते ६ मि. १० से.", label_en: "5 min 51 sec to 6 min 10 sec", marks: 12 },
    { label_mr: "६ मि. ११ से. ते ६ मि. ३० से.", label_en: "6 min 11 sec to 6 min 30 sec", marks: 10 },
    { label_mr: "६ मि. ३० से. पेक्षा जास्त", label_en: "More than 6 min 30 sec", marks: 0 },
  ],
  sprint100: [
    { label_mr: "११.५० से. किंवा कमी", label_en: "11.50 sec or less", marks: 15 },
    { label_mr: "११.५१ से. ते १२.५० से.", label_en: "11.51 sec to 12.50 sec", marks: 12 },
    { label_mr: "१२.५१ से. ते १३.५० से.", label_en: "12.51 sec to 13.50 sec", marks: 10 },
    { label_mr: "१३.५१ से. ते १४.५० से.", label_en: "13.51 sec to 14.50 sec", marks: 8 },
    { label_mr: "१४.५१ से. ते १५.५० से.", label_en: "14.51 sec to 15.50 sec", marks: 5 },
    { label_mr: "१५.५० से. पेक्षा जास्त", label_en: "More than 15.50 sec", marks: 0 },
  ],
  shotPut: [
    { label_mr: "८.५० मीटर किंवा जास्त", label_en: "8.50 meters or more", marks: 15 },
    { label_mr: "७.९० मी. ते ८.४९ मी.", label_en: "7.90m to 8.49m", marks: 12 },
    { label_mr: "७.३० मी. ते ७.८९ मी.", label_en: "7.30m to 7.89m", marks: 10 },
    { label_mr: "६.७० मी. ते ७.२९ मी.", label_en: "6.70m to 7.29m", marks: 8 },
    { label_mr: "६.१० मी. ते ६.६९ मी.", label_en: "6.10m to 6.69m", marks: 5 },
    { label_mr: "६.१० मी. पेक्षा कमी", label_en: "Less than 6.10m", marks: 0 },
  ]
}

const FEMALE_SLATES = {
  run800: [
    { label_mr: "२ मि. ५० से. किंवा कमी", label_en: "2 min 50 sec or less", marks: 20 },
    { label_mr: "२ मि. ५१ से. ते ३ मि. ०० से.", label_en: "2 min 51 sec to 3 min 00 sec", marks: 18 },
    { label_mr: "३ मि. ०१ से. ते ३ मि. १० से.", label_en: "3 min 01 sec to 3 min 10 sec", marks: 15 },
    { label_mr: "३ मि. ११ से. ते ३ मि. २० से.", label_en: "3 min 11 sec to 3 min 20 sec", marks: 12 },
    { label_mr: "३ मि. २१ से. ते ३ मि. ३० से.", label_en: "3 min 21 sec to 3 min 30 sec", marks: 10 },
    { label_mr: "३ मि. ३० से. पेक्षा जास्त", label_en: "More than 3 min 30 sec", marks: 0 },
  ],
  sprint100: [
    { label_mr: "१४.०० से. किंवा कमी", label_en: "14.00 sec or less", marks: 15 },
    { label_mr: "१४.०१ से. ते १५.०० से.", label_en: "14.01 sec to 15.00 sec", marks: 12 },
    { label_mr: "१५.०१ से. ते १६.०० से.", label_en: "15.01 sec to 16.00 sec", marks: 10 },
    { label_mr: "१६.०१ से. ते १७.०० से.", label_en: "16.01 sec to 17.00 sec", marks: 8 },
    { label_mr: "१७.०१ से. ते १८.०० से.", label_en: "17.01 sec to 18.00 sec", marks: 5 },
    { label_mr: "१८.०० से. पेक्षा जास्त", label_en: "More than 18.00 sec", marks: 0 },
  ],
  shotPut: [
    { label_mr: "६.०० मीटर किंवा जास्त", label_en: "6.00 meters or more", marks: 15 },
    { label_mr: "५.५० मी. ते ५.९९ मी.", label_en: "5.50m to 5.99m", marks: 12 },
    { label_mr: "५.०० मी. ते ५.४९ मी.", label_en: "5.00m to 5.49m", marks: 10 },
    { label_mr: "४.५० मी. ते ४.९९ मी.", label_en: "4.50m to 4.99m", marks: 8 },
    { label_mr: "४.०० मी. ते ४.४९ मी.", label_en: "4.00m to 4.49m", marks: 5 },
    { label_mr: "४.०० मी. पेक्षा कमी", label_en: "Less than 4.00m", marks: 0 },
  ]
}

// ── Historical & Projected Cutoffs by District (Total out of 150) ──
const DISTRICTS = [
  { id: "mumbai", name_mr: "बृहन्मुंबई पोलीस आयुक्तालय (Mumbai City)", name_en: "Brihanmumbai Police Commissionerate (Mumbai)", cutoffs: { open: 136, obc: 132, ews: 130, sebc: 131, sc: 124, st: 118, nt: 128 } },
  { id: "pune", name_mr: "पुणे शहर पोलीस आयुक्तालय (Pune City)", name_en: "Pune City Police Commissionerate", cutoffs: { open: 138, obc: 134, ews: 133, sebc: 133, sc: 126, st: 120, nt: 130 } },
  { id: "thane", name_mr: "ठाणे शहर पोलीस (Thane City)", name_en: "Thane City Police Commissionerate", cutoffs: { open: 134, obc: 130, ews: 128, sebc: 129, sc: 122, st: 116, nt: 126 } },
  { id: "navi_mumbai", name_mr: "नवी मुंबई पोलीस आयुक्तालय", name_en: "Navi Mumbai Police Commissionerate", cutoffs: { open: 135, obc: 131, ews: 129, sebc: 130, sc: 123, st: 117, nt: 127 } },
  { id: "nagpur", name_mr: "नागपूर शहर पोलीस (Nagpur City)", name_en: "Nagpur City Police Commissionerate", cutoffs: { open: 133, obc: 129, ews: 127, sebc: 128, sc: 121, st: 115, nt: 125 } },
  { id: "nashik", name_mr: "नाशिक शहर व ग्रामीण पोलीस", name_en: "Nashik City & Rural Police", cutoffs: { open: 134, obc: 130, ews: 128, sebc: 129, sc: 122, st: 118, nt: 126 } },
  { id: "sambhajinagar", name_mr: "छत्रपती संभाजीनगर पोलीस", name_en: "Chhatrapati Sambhajinagar Police", cutoffs: { open: 135, obc: 131, ews: 129, sebc: 130, sc: 124, st: 116, nt: 127 } },
  { id: "kolhapur", name_mr: "कोल्हापूर जिल्हा पोलीस", name_en: "Kolhapur District Police", cutoffs: { open: 139, obc: 136, ews: 134, sebc: 135, sc: 128, st: 122, nt: 132 } },
  { id: "solapur", name_mr: "सोलापूर शहर व ग्रामीण पोलीस", name_en: "Solapur City & Rural Police", cutoffs: { open: 133, obc: 129, ews: 127, sebc: 128, sc: 122, st: 116, nt: 125 } },
  { id: "amravati", name_mr: "अमरावती पोलीस आयुक्तालय", name_en: "Amravati Police Commissionerate", cutoffs: { open: 132, obc: 128, ews: 126, sebc: 127, sc: 120, st: 114, nt: 124 } },
  { id: "satara", name_mr: "सातारा व सांगली जिल्हा पोलीस", name_en: "Satara & Sangli District Police", cutoffs: { open: 137, obc: 134, ews: 132, sebc: 133, sc: 126, st: 120, nt: 130 } },
  { id: "ahmednagar", name_mr: "अहमदनगर जिल्हा पोलीस", name_en: "Ahilyanagar / Ahmednagar District Police", cutoffs: { open: 136, obc: 133, ews: 131, sebc: 132, sc: 125, st: 119, nt: 128 } },
  { id: "nanded", name_mr: "नांदेड व लातूर जिल्हा पोलीस", name_en: "Nanded & Latur District Police", cutoffs: { open: 134, obc: 130, ews: 128, sebc: 129, sc: 123, st: 117, nt: 126 } },
  { id: "kokan", name_mr: "रत्नागिरी व सिंधुदुर्ग पोलीस", name_en: "Ratnagiri & Sindhudurg Police", cutoffs: { open: 128, obc: 124, ews: 122, sebc: 123, sc: 116, st: 110, nt: 120 } }
]

export default function PoliceCalculatorPage() {
  const { isMarathi } = useLanguage()
  const [gender, setGender] = useState('male') // 'male' | 'female'
  const [runMarks, setRunMarks] = useState(18)
  const [sprintMarks, setSprintMarks] = useState(12)
  const [shotMarks, setShotMarks] = useState(12)
  const [writtenMarks, setWrittenMarks] = useState(82)
  const [districtId, setDistrictId] = useState('mumbai')
  const [category, setCategory] = useState('open')
  const [parallelQuota, setParallelQuota] = useState('general') // general | women | sports | ex | homeguard

  const activeSlates = gender === 'male' ? MALE_SLATES : FEMALE_SLATES

  // Calculate Totals
  const physicalTotal = runMarks + sprintMarks + shotMarks
  const compositeTotal = physicalTotal + writtenMarks

  // Calculate Cutoff Target
  const selectedDistrict = useMemo(() => {
    return DISTRICTS.find(d => d.id === districtId) || DISTRICTS[0]
  }, [districtId])

  const targetCutoff = useMemo(() => {
    const base = selectedDistrict.cutoffs[category] || selectedDistrict.cutoffs.open
    // Parallel quota adjustments
    if (parallelQuota === 'women') return base - 12
    if (parallelQuota === 'sports') return base - 8
    if (parallelQuota === 'ex') return base - 18
    if (parallelQuota === 'homeguard') return base - 6
    return base
  }, [selectedDistrict, category, parallelQuota])

  const diff = compositeTotal - targetCutoff
  const isSafe = diff >= 2
  const isBorder = diff >= -3 && diff < 2

  // Share text
  const shareText = isMarathi
    ? `माझा महाराष्ट्र पोलीस शिपाई २०२६ अंदाजित स्कोर:\nमैदानी: ${physicalTotal}/५०\nलेखी: ${writtenMarks}/१००\nएकूण गुण: ${compositeTotal}/१५०\nजिल्हा: ${selectedDistrict.name_mr}\nअंदाजित कट-ऑफ: ${targetCutoff} गुण (${isSafe ? '✅ सेफ झोन' : isBorder ? '⚠️ बॉर्डरलाईन' : '❌ सरावाची गरज'})\n\nतुम्हीसुद्धा तुमचा अचूक स्कोर व गुणवत्ता यादी येथे तपासा:\nhttps://examudaan.in/police-calculator`
    : `My Maharashtra Police Constable 2026 Estimated Score:\nPhysical: ${physicalTotal}/50\nWritten: ${writtenMarks}/100\nTotal Composite: ${compositeTotal}/150\nDistrict: ${selectedDistrict.name_en}\nEstimated Cutoff: ${targetCutoff} marks (${isSafe ? '✅ Safe Zone' : isBorder ? '⚠️ Borderline' : '❌ Needs Practice'})\n\nCheck your rank and score breakdown here:\nhttps://examudaan.in/police-calculator`

  return (
    <main className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>local_police</span>
              {isMarathi ? 'महाराष्ट्र पोलीस भरती २०२६ अधिकृत कॅल्क्युलेटर' : 'Maharashtra Police Bharti 2026 Official Calculator'}
            </span>
            <h1>
              {isMarathi
                ? 'पोलीस शिपाई मैदानी + लेखी मेरिट व कट-ऑफ कॅल्क्युलेटर'
                : 'Police Constable Physical + Written Merit & Cutoff Calculator'}
            </h1>
            <p>
              {isMarathi
                ? 'अधिकृत पोलीस भरती नियमावलीनुसार (GR) १६०० मी/८०० मी धावणे, १०० मी धावणे व गोळाफेकचे अचूक गुण मोजा. तुमचा लेखी परीक्षेचा गुण मिळवून १५० गुणांमधील एकूण गुणवत्ता क्रमवारी आणि जिल्हा-निहाय निवड शक्यता त्वरित तपासा.'
                : 'Calculate precise marks for 1600m/800m running, 100m sprint, and shot put according to the official Maharashtra Police rules. Combine with written exam score out of 100 to predict your composite rank and district selection odds out of 150 marks.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Calculator Grid ── */}
      <div className="container">
        <div className={styles.calcGrid}>
          {/* ── Left Column: Event Inputs ── */}
          <div className={styles.calcInputs}>
            {/* Gender Toggle */}
            <div className={styles.genderToggle}>
              <button
                className={`${styles.genderBtn} ${gender === 'male' ? styles.genderBtnActive : ''}`}
                onClick={() => { setGender('male'); setRunMarks(18); setSprintMarks(12); setShotMarks(12) }}
              >
                <span className="material-symbols-outlined">male</span>
                {isMarathi ? 'पुरुष उमेदवार (Male Candidate)' : 'Male Candidate'}
              </button>
              <button
                className={`${styles.genderBtn} ${gender === 'female' ? styles.genderBtnActive : ''}`}
                onClick={() => { setGender('female'); setRunMarks(18); setSprintMarks(12); setShotMarks(12) }}
              >
                <span className="material-symbols-outlined">female</span>
                {isMarathi ? 'महिला उमेदवार (Female Candidate)' : 'Female Candidate'}
              </button>
            </div>

            {/* Event 1: Running */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className="material-symbols-outlined">sprint</span>
                <h3 className={styles.cardTitle}>
                  {isMarathi
                    ? `१. ${gender === 'male' ? '१६०० मीटर धावणे' : '८०० मीटर धावणे'} (कमाल २० गुण)`
                    : `1. ${gender === 'male' ? '1600m Running' : '800m Running'} (Max 20 Marks)`}
                </h3>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>
                  <span>{isMarathi ? 'तुमची वेळ निवडा:' : 'Select Your Time:'}</span>
                  <span className={styles.formScoreBadge}>
                    {runMarks} / {isMarathi ? '२० गुण' : '20 Marks'}
                  </span>
                </div>
                <div className={styles.slateOptions}>
                  {(gender === 'male' ? activeSlates.run1600 : activeSlates.run800).map((s, i) => (
                    <button
                      key={i}
                      className={`${styles.slateBtn} ${runMarks === s.marks ? styles.slateBtnActive : ''}`}
                      onClick={() => setRunMarks(s.marks)}
                    >
                      <span className={styles.slateBtnTime}>{isMarathi ? s.label_mr : s.label_en}</span>
                      <span className={styles.slateBtnMarks}>{s.marks} {isMarathi ? 'गुण' : 'M'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Event 2: 100m Sprint */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className="material-symbols-outlined">timer</span>
                <h3 className={styles.cardTitle}>
                  {isMarathi ? '२. १०० मीटर धावणे (कमाल १५ गुण)' : '2. 100m Sprint (Max 15 Marks)'}
                </h3>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>
                  <span>{isMarathi ? 'तुमची वेळ निवडा:' : 'Select Your Time:'}</span>
                  <span className={styles.formScoreBadge}>
                    {sprintMarks} / {isMarathi ? '१५ गुण' : '15 Marks'}
                  </span>
                </div>
                <div className={styles.slateOptions}>
                  {activeSlates.sprint100.map((s, i) => (
                    <button
                      key={i}
                      className={`${styles.slateBtn} ${sprintMarks === s.marks ? styles.slateBtnActive : ''}`}
                      onClick={() => setSprintMarks(s.marks)}
                    >
                      <span className={styles.slateBtnTime}>{isMarathi ? s.label_mr : s.label_en}</span>
                      <span className={styles.slateBtnMarks}>{s.marks} {isMarathi ? 'गुण' : 'M'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Event 3: Shot Put */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className="material-symbols-outlined">fitness_center</span>
                <h3 className={styles.cardTitle}>
                  {isMarathi
                    ? `३. गोळाफेक (${gender === 'male' ? '७.२६ किलोग्रॅम' : '४.०० किलोग्रॅम'}) (कमाल १५ गुण)`
                    : `3. Shot Put (${gender === 'male' ? '7.26 kg' : '4.00 kg'}) (Max 15 Marks)`}
                </h3>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.formLabel}>
                  <span>{isMarathi ? 'तुमचे अंतर निवडा:' : 'Select Your Distance:'}</span>
                  <span className={styles.formScoreBadge}>
                    {shotMarks} / {isMarathi ? '१५ गुण' : '15 Marks'}
                  </span>
                </div>
                <div className={styles.slateOptions}>
                  {activeSlates.shotPut.map((s, i) => (
                    <button
                      key={i}
                      className={`${styles.slateBtn} ${shotMarks === s.marks ? styles.slateBtnActive : ''}`}
                      onClick={() => setShotMarks(s.marks)}
                    >
                      <span className={styles.slateBtnTime}>{isMarathi ? s.label_mr : s.label_en}</span>
                      <span className={styles.slateBtnMarks}>{s.marks} {isMarathi ? 'गुण' : 'M'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Written Exam & Reservation Selectors */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className="material-symbols-outlined">edit_note</span>
                <h3 className={styles.cardTitle}>
                  {isMarathi ? '४. लेखी परीक्षा व जिल्हा निवड (१०० गुण)' : '4. Written Exam & District Selection (100 Marks)'}
                </h3>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.formLabel}>
                  <span>{isMarathi ? 'लेखी परीक्षेतील अंदाजित गुण (Written Marks):' : 'Estimated Written Exam Marks:'}</span>
                  <span className={styles.formScoreBadge}>
                    {writtenMarks} / {isMarathi ? '१०० गुण' : '100 Marks'}
                  </span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="100"
                  value={writtenMarks}
                  onChange={(e) => setWrittenMarks(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)', height: '8px', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  <span>{isMarathi ? 'किमान पात्रता: ३५% (३५ गुण)' : 'Qualifying Min: 35% (35 Marks)'}</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '14px' }}>{writtenMarks} {isMarathi ? 'गुण' : 'Marks'}</span>
                  <span>{isMarathi ? 'कमाल: १०० गुण' : 'Max: 100 Marks'}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{isMarathi ? 'अर्ज केलेला जिल्हा / युनिट:' : 'Applied District / Unit:'}</label>
                  <select
                    className={styles.select}
                    value={districtId}
                    onChange={(e) => setDistrictId(e.target.value)}
                  >
                    {DISTRICTS.map(d => (
                      <option key={d.id} value={d.id}>{isMarathi ? d.name_mr : d.name_en}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{isMarathi ? 'प्रवर्ग (Category):' : 'Category:'}</label>
                  <select
                    className={styles.select}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="open">{isMarathi ? 'खुला प्रवर्ग (Open / General)' : 'Open / General'}</option>
                    <option value="obc">{isMarathi ? 'इतर मागासवर्गीय (OBC)' : 'Other Backward Classes (OBC)'}</option>
                    <option value="ews">{isMarathi ? 'आर्थिक दुर्बल घटक (EWS)' : 'Economically Weaker Section (EWS)'}</option>
                    <option value="sebc">{isMarathi ? 'सामाजिक व शैक्षणिक मागास (SEBC)' : 'SEBC (Maratha Reservation)'}</option>
                    <option value="sc">{isMarathi ? 'अनुसूचित जाती (SC)' : 'Scheduled Castes (SC)'}</option>
                    <option value="st">{isMarathi ? 'अनुसूचित जमाती (ST)' : 'Scheduled Tribes (ST)'}</option>
                    <option value="nt">{isMarathi ? 'भटक्या जमाती (VJ/NT)' : 'Vimukta Jati / Nomadic Tribes (NT)'}</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{isMarathi ? 'समांतर आरक्षण (Parallel Quota):' : 'Parallel Reservation:'}</label>
                  <select
                    className={styles.select}
                    value={parallelQuota}
                    onChange={(e) => setParallelQuota(e.target.value)}
                  >
                    <option value="general">{isMarathi ? 'सर्वसाधारण (General)' : 'General (Non-Quota)'}</option>
                    <option value="women">{isMarathi ? 'महिला आरक्षण (Women 30%)' : 'Women Reservation (30%)'}</option>
                    <option value="sports">{isMarathi ? 'खेळाडू आरक्षण (Sports 5%)' : 'Meritorious Sports Person (5%)'}</option>
                    <option value="ex">{isMarathi ? 'माजी सैनिक (Ex-Serviceman 15%)' : 'Ex-Servicemen (15%)'}</option>
                    <option value="homeguard">{isMarathi ? 'होमगार्ड (Home Guard 5%)' : 'Home Guards (5%)'}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Score Summary & Status ── */}
          <div className={styles.resultSticky}>
            <div className={styles.resultCard}>
              <div className={styles.totalRing}>
                <span className={styles.totalMaxLabel}>
                  {isMarathi ? 'एकूण एकत्रित गुण (Composite Score)' : 'Total Composite Merit Score'}
                </span>
                <div className={styles.totalBigScore}>{compositeTotal}</div>
                <span className={styles.totalMaxLabel}>
                  {isMarathi ? '१५० पैकी एकूण गुण' : 'Total Marks Out of 150'}
                </span>

                <div className={styles.scorePills}>
                  <div className={styles.scorePill}>
                    <strong>{physicalTotal}/50</strong>
                    <span>{isMarathi ? 'मैदानी चाचणी' : 'Physical Test'}</span>
                  </div>
                  <div className={styles.scorePill}>
                    <strong>{writtenMarks}/100</strong>
                    <span>{isMarathi ? 'लेखी परीक्षा' : 'Written Exam'}</span>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`${styles.statusBanner} ${isSafe ? styles.statusSafe : isBorder ? styles.statusBorder : styles.statusDanger}`}>
                <span className="material-symbols-outlined">
                  {isSafe ? 'check_circle' : isBorder ? 'warning' : 'info'}
                </span>
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>
                    {isSafe
                      ? (isMarathi ? 'सेफ झोन (Safe Zone) — निवड शक्यता दाट!' : 'Safe Zone — High Selection Probability!')
                      : isBorder
                      ? (isMarathi ? 'बॉर्डरलाईन (Borderline Zone) — चुरस!' : 'Borderline Zone — Very Competitive!')
                      : (isMarathi ? 'सुधारणा आवश्यक (Need Improvement)' : 'Practice Needed — Score Boost Required')}
                  </strong>
                  <span style={{ fontSize: '12px' }}>
                    {isMarathi
                      ? (isSafe
                          ? `अंदाजित कट-ऑफपेक्षा +${diff} गुण जास्त आहेत. अंतिम यादीत स्थान निश्चित!`
                          : isBorder
                          ? `अंदाजित कट-ऑफच्या जवळपास आहात (${diff >= 0 ? `+${diff}` : `${diff}`}). थोडी मेहनत फायदेशीर ठरेल.`
                          : `अंदाजित कट-ऑफपेक्षा ${Math.abs(diff)} गुण कमी आहेत. लेखी किंवा मैदानीमध्ये वाढ करा.`)
                      : (isSafe
                          ? `+${diff} marks above projected cutoff. Excellent chance of making the final merit list!`
                          : isBorder
                          ? `Close to projected cutoff (${diff >= 0 ? `+${diff}` : `${diff}`}). Pushing in written exam will seal selection.`
                          : `${Math.abs(diff)} marks below projected cutoff. Focus on written exam revision or sprint speed.`)}
                  </span>
                </div>
              </div>

              {/* Cutoff Analysis Details */}
              <div className={styles.cutoffDetail}>
                <div className={styles.cutoffDetailRow}>
                  <span style={{ color: '#64748b' }}>{isMarathi ? 'जिल्हा / युनिट:' : 'District / Unit:'}</span>
                  <strong>{isMarathi ? selectedDistrict.name_mr.split(' (')[0] : selectedDistrict.name_en.split(' (')[0]}</strong>
                </div>
                <div className={styles.cutoffDetailRow}>
                  <span style={{ color: '#64748b' }}>{isMarathi ? 'तुमचा प्रवर्ग:' : 'Your Category:'}</span>
                  <strong>{category.toUpperCase()} {parallelQuota !== 'general' ? `(${parallelQuota})` : ''}</strong>
                </div>
                <div className={styles.cutoffDetailRow}>
                  <span style={{ color: '#64748b' }}>{isMarathi ? 'अंदाजित कट-ऑफ (Cutoff):' : 'Projected Cutoff:'}</span>
                  <strong style={{ color: '#0284c7', fontSize: '15px' }}>{targetCutoff} {isMarathi ? 'गुण' : 'Marks'}</strong>
                </div>
                <div className={styles.cutoffDetailRow} style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '6px' }}>
                  <span style={{ color: '#64748b' }}>{isMarathi ? 'फरक (Margin):' : 'Score Margin:'}</span>
                  <strong style={{ color: diff >= 0 ? '#16a34a' : '#dc2626' }}>
                    {diff >= 0 ? `+${diff} ${isMarathi ? 'गुण पुढे' : 'Marks Ahead'}` : `${diff} ${isMarathi ? 'गुण कमी' : 'Marks Deficit'}`}
                  </strong>
                </div>
              </div>

              {/* WhatsApp Share Button */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappShareBtn}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>share</span>
                {isMarathi ? 'मित्र व ग्रुपवर स्कोर शेअर करा' : 'Share Score on WhatsApp'}
              </a>

              {/* Direct links to Practice */}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link
                  href="/mock-tests"
                  className="btn-primary"
                  style={{ textAlign: 'center', fontSize: '13px', padding: '10px' }}
                >
                  {isMarathi ? 'पोलीस १०० गुणांचे मॉक पेपर सोडवा →' : 'Practice 100-Mark Police Mock Tests →'}
                </Link>
                <Link
                  href="/syllabus"
                  className="btn-outline"
                  style={{ textAlign: 'center', fontSize: '13px', padding: '8px' }}
                >
                  {isMarathi ? 'लेखी व मैदानी अधिकृत अभ्यासक्रम' : 'View Official Syllabus & Criteria'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
