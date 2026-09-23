// ============================================================
// dailyQuizData.js — Curated High-Yield Questions for Daily Streak Quiz
// 10 Questions Daily | 5 Maharashtra Specific + 5 National GK / Reasoning
// Features: Deterministic Date-Seeded 365-Day Rotation Engine
// ============================================================

export const MAHARASHTRA_QUIZ_POOL = [
  {
    id: 'mh_1',
    subject: 'मराठी व्याकरण',
    question: 'खालीलपैकी कोणता शब्द "अमृत" या शब्दाचा समानार्थी शब्द नाही?',
    options: ['पीयूष', 'सुधा', 'संजीवनी', 'हलाहल'],
    correct: 3,
    explanation: '"हलाहल" म्हणजे अत्यंत तीव्र विष. पीयूष, सुधा आणि संजीवनी हे अमृताचे समानार्थी शब्द आहेत.',
    examTag: 'TCS Talathi & Police Bharti 2023-24'
  },
  {
    id: 'mh_2',
    subject: 'महाराष्ट्र भूगोल',
    question: 'महाराष्ट्रातील खालीलपैकी कोणता घाट मुंबई आणि नाशिक या दोन शहरांना जोडतो?',
    options: ['कसारा घाट (थळ घाट)', 'माळशेज घाट', 'बोर घाट', 'कुंभार्ली घाट'],
    correct: 0,
    explanation: 'मुंबई-नाशिक दरम्यान कसारा (थळ) घाट आहे. मुंबई-पुणे दरम्यान बोर घाट तर ठाणे-अहमदनगर दरम्यान माळशेज घाट आहे.',
    examTag: 'MPSC Combined Group B 2022'
  },
  {
    id: 'mh_3',
    subject: 'पोलीस व ग्रामप्रशासन',
    question: 'महाराष्ट्रात "पोलीस पाटील" यांची नेमणूक खालीलपैकी कोणाद्वारे केली जाते?',
    options: ['पोलीस अधीक्षक (SP)', 'उपविभागीय अधिकारी (SDO / प्रांत)', 'तहसीलदार', 'जिल्हाधिकारी'],
    correct: 1,
    explanation: 'महाराष्ट्र ग्राम पोलीस अधिनियम १९६७ नुसार पोलीस पाटलांची नेमणूक उपविभागीय दंडाधिकारी (SDO/प्रांत अधिकारी) यांच्याद्वारे केली जाते.',
    examTag: 'Maharashtra Police Bharti 2023'
  },
  {
    id: 'mh_4',
    subject: 'चालू घडामोडी व योजना',
    question: 'महाराष्ट्र शासनाने सुरू केलेल्या "मुख्यमंत्री माझी लाडकी बहीण योजने"अंतर्गत पात्र महिलांना दरमहा किती रुपयांचे आर्थिक साहाय्य दिले जाते?',
    options: ['₹१,०००', '₹१,२५०', '₹१,५००', '₹२,१००'],
    correct: 2,
    explanation: 'लाडकी बहीण योजनेअंतर्गत २१ ते ६५ वयोगटातील पात्र महिलांच्या बँक खात्यात दरमहा ₹१,५०० थेट डीबीटीद्वारे जमा केले जातात.',
    examTag: 'Maharashtra Govt Schemes 2024-25'
  },
  {
    id: 'mh_5',
    subject: 'पर्यावरण व जैवविविधता',
    question: 'महाराष्ट्रातील पहिले रामसर पाणथळ स्थळ (Ramsar Wetland Site) म्हणून कोणते सरोवर घोषित करण्यात आले?',
    options: ['लोणार सरोवर', 'नांदूर मधमेश्वर', 'ठाणे खाडी', 'उजनी जलाशय'],
    correct: 1,
    explanation: 'नाशिक जिल्ह्यातील "नांदूर मधमेश्वर" हे २०२० मध्ये महाराष्ट्रातील पहिले रामसर स्थळ म्हणून घोषित करण्यात आले (महाराष्ट्राचे भरतपूर).',
    examTag: 'MPSC Forest & Environment'
  },
  {
    id: 'mh_6',
    subject: 'महाराष्ट्र इतिहास',
    question: '२० मार्च १९२७ रोजी डॉ. बाबासाहेब आंबेडकरांनी पाण्यासाठी कोणता ऐतिहासिक सत्याग्रह केला?',
    options: ['काळाराम मंदिर सत्याग्रह', 'महाड चवदार तळे सत्याग्रह', 'पुणे करार', 'मुळशी सत्याग्रह'],
    correct: 1,
    explanation: '२० मार्च १९२७ रोजी महाड येथील चवदार तळ्यावर डॉ. बाबासाहेब आंबेडकरांनी मानवी हक्कासाठी ऐतिहासिक सत्याग्रह केला. हा दिवस "सामाजिक सक्षमीकरण दिन" म्हणून साजरा केला जातो.',
    examTag: 'MPSC History & Samajsudharak'
  },
  {
    id: 'mh_7',
    subject: 'मराठी व्याकरण',
    question: '"त्याने पेरू खाल्ला." या वाक्यातील प्रयोग ओळखा.',
    options: ['कर्तरी प्रयोग', 'कर्मणी प्रयोग', 'भावे प्रयोग', 'संकीर्ण प्रयोग'],
    correct: 1,
    explanation: 'येथे कर्त्याला तृतीया विभक्तीचा प्रत्यय आहे व क्रियापद कर्माच्या (पेरू) लिंग-वचनानुसार बदलते, म्हणून हा कर्मणी प्रयोग आहे.',
    examTag: 'TCS Talathi Pattern 2023'
  },
  {
    id: 'mh_8',
    subject: 'महाराष्ट्र भूगोल',
    question: 'महाराष्ट्रातील सर्वोच्च शिखर "कळसूबाई" ची उंची किती मीटर आहे?',
    options: ['१,५६७ मी.', '१,६४६ मी.', '१,४३८ मी.', '१,५२४ मी.'],
    correct: 1,
    explanation: 'कळसूबाई शिखर अहमदनगर आणि नाशिक जिल्ह्यांच्या सीमेवर (अकोले तालुका) असून त्याची समुद्रसपाटीपासून उंची १,६४६ मीटर (५,४०० फूट) आहे.',
    examTag: 'Police Bharti & MPSC Geography'
  },
  {
    id: 'mh_9',
    subject: 'समाजसुधारक',
    question: 'महात्मा ज्योतिराव फुले यांनी सत्यशोधक समाजाची स्थापना कोणत्या वर्षी केली?',
    options: ['१८७३', '१८७५', '१८८५', '१८९३'],
    correct: 0,
    explanation: '२४ सप्टेंबर १८७३ रोजी पुणे येथे महात्मा ज्योतिराव फुले यांनी सत्यशोधक समाजाची स्थापना केली. "सर्वसाक्षी जगत्पती । त्याला नकोच मध्यस्ती ॥" हे सत्यशोधक समाजाचे ब्रीदवाक्य होते.',
    examTag: 'MPSC Rajyaseva & Combined'
  },
  {
    id: 'mh_10',
    subject: 'महाराष्ट्र जलसंपदा',
    question: 'महाराष्ट्राची भाग्यलक्ष्मी म्हणून ओळखल्या जाणाऱ्या कोयना धरणाच्या जलाशयाचे नाव काय आहे?',
    options: ['यशवंतसागर', 'शिवाजी सागर', 'नाथसागर', 'लक्ष्मी तलाव'],
    correct: 1,
    explanation: 'सातारा जिल्ह्यातील कोयना धरणाच्या जलाशयाचे नाव "शिवसागर" (Shivaji Sagar) आहे. नाथसागर हे जायकवाडी धरणाचे नाव आहे.',
    examTag: 'MPSC Group C 2023'
  },
  {
    id: 'mh_11',
    subject: 'मराठी व्याकरण',
    question: '"अलंकारिक शब्द" : उंटावरून शेळ्या हाकणारा म्हणजे काय?',
    options: ['खूप दयाळू माणूस', 'कोणतेही अंगमेहनत न करता नुसता सल्ला देणारा', 'शेती करणारा शेतकरी', 'पशुपालक'],
    correct: 1,
    explanation: 'उंटावरून शेळ्या हाकणे म्हणजे स्वतः प्रत्यक्ष कष्ट न करता किंवा धोक्यात न पडता लांबून रिकामे सल्ले देणारा मनुष्य.',
    examTag: 'MPSC Clerk-Typist 2023'
  },
  {
    id: 'mh_12',
    subject: 'महाराष्ट्र प्रशासन',
    question: 'महाराष्ट्र लोकसेवा हक्क अधिनियम (RTS Act) कोणत्या वर्षी लागू करण्यात आला?',
    options: ['२०१२', '२०१५', '२०१७', '२०१९'],
    correct: 1,
    explanation: 'महाराष्ट्र लोकसेवा हक्क अधिनियम २०१५ (Maharashtra Right to Public Services Act 2015) हा २८ एप्रिल २०१५ रोजी लागू करण्यात आला.',
    examTag: 'TCS Talathi GS 2023'
  },
  {
    id: 'mh_13',
    subject: 'महाराष्ट्र भूगोल',
    question: 'महाराष्ट्रात सर्वात जास्त क्षेत्र कोणत्या मृदेने (मातीने) व्यापले आहे?',
    options: ['जांभी मृदा (Laterite)', 'काळी रेगूर मृदा (Black Cotton Soil)', 'तांबडी मृदा', 'गाळाची मृदा'],
    correct: 1,
    explanation: 'दख्खनच्या पठारावरील बेसाल्ट खडकाच्या विदारणातून तयार झालेल्या काळ्या कसदार रेगूर मृदेने महाराष्ट्राचे सुमारे ७५% ते ८०% क्षेत्र व्यापले आहे.',
    examTag: 'MPSC Combined Group B 2021'
  },
  {
    id: 'mh_14',
    subject: 'मराठी व्याकरण',
    question: 'खालीलपैकी कोणता शब्द "शुद्ध" आहे?',
    options: ['आशीर्वाद', 'आशिर्वाद', 'आशिरवाद', 'आशीरवाद'],
    correct: 0,
    explanation: '"आशीर्वाद" हा शब्द शुद्ध आहे (श ला दीर्घ दुसरी वेलांटी व वा वर रफार).',
    examTag: 'Police Bharti 2024'
  },
  {
    id: 'mh_15',
    subject: 'महाराष्ट्र वने व राष्ट्रीय उद्याने',
    question: 'महाराष्ट्रातील "ताडोबा-अंधारी व्याघ्र प्रकल्प" कोणत्या जिल्ह्यात आहे?',
    options: ['नागपूर', 'चंद्रपूर', 'अमरावती', 'गडचिरोली'],
    correct: 1,
    explanation: 'ताडोबा राष्ट्रीय उद्यान आणि अंधारी अभयारण्य मिळून बनलेला ताडोबा-अंधारी व्याघ्र प्रकल्प हा चंद्रपूर जिल्ह्यात असून तो महाराष्ट्रातील सर्वात जुना राष्ट्रीय उद्यान आहे.',
    examTag: 'MPSC Forest & Police Bharti'
  }
]

export const NATIONAL_GK_QUIZ_POOL = [
  {
    id: 'nat_1',
    subject: 'भारतीय राज्यघटना',
    question: 'भारतीय संविधानातील कलम २४ अन्वये किती वर्षांखालील बालकांना धोकादायक कारखान्यांमध्ये कामावर ठेवण्यास बंदी आहे?',
    options: ['१२ वर्षे', '१४ वर्षे', '१६ वर्षे', '१८ वर्षे'],
    correct: 1,
    explanation: 'कलम २४ नुसार १४ वर्षांखालील कोणत्याही बालकास कारखाने, खाणी किंवा कोणत्याही धोक्याच्या कामात गुंतवून ठेवण्यास सक्त मनाई आहे.',
    examTag: 'MPSC Rajyaseva Prelims 2023'
  },
  {
    id: 'nat_2',
    subject: 'National History',
    question: 'सन १९०५ मध्ये पुण्यात "भारत सेवक समाज" (Servants of India Society) ची स्थापना कोणी केली?',
    options: ['लोकमान्य बाळ गंगाधर टिळक', 'गोपाळ कृष्ण गोखले', 'महात्मा ज्योतिराव फुले', 'महर्षी धोंडो केशव कर्वे'],
    correct: 1,
    explanation: '१२ जून १९०५ रोजी गोपाळ कृष्ण गोखले यांनी पुण्यात भारत सेवक समाजाची स्थापना करून मातृभूमीच्या सेवेसाठी समर्पित कार्यकर्ते घडवले.',
    examTag: 'UPSC CSE & MPSC History'
  },
  {
    id: 'nat_3',
    subject: 'General Science',
    question: 'मानवी शरीरात रक्तातील साखरेचे प्रमाण नियंत्रित ठेवणारे "इन्सुलिन" (Insulin) हे संप्रेरक कोणत्या अवयवाद्वारे स्त्रवले जाते?',
    options: ['यकृत (Liver)', 'स्वादुपिंड (Pancreas)', 'थायरॉईड (Thyroid)', 'मूत्रपिंड (Kidney)'],
    correct: 1,
    explanation: 'स्वादुपिंडातील (Pancreas) आयलेट्स ऑफ लँगरहॅन्स मधील बीटा पेशींद्वारे इन्सुलिन संप्रेरकाची निर्मिती केली जाते.',
    examTag: 'SSC CGL General Science'
  },
  {
    id: 'nat_4',
    subject: 'Indian Economy',
    question: 'रिझर्व्ह बँक ऑफ इंडिया (RBI) चे राष्ट्रीयीकरण कोणत्या वर्षी करण्यात आले?',
    options: ['१९३५', '१९४७', '१९४९', '१९५२'],
    correct: 2,
    explanation: 'RBI ची स्थापना १ एप्रिल १९३५ रोजी झाली आणि १ जानेवारी १९४९ रोजी रिझर्व्ह बँकेचे राष्ट्रीयीकरण करण्यात आले.',
    examTag: 'Banking & MPSC Economy'
  },
  {
    id: 'nat_5',
    subject: 'बुद्धिमत्ता चाचणी',
    question: 'खालील संख्या मालिकेत प्रश्नचिन्हाच्या (?) जागी कोणती संख्या येईल? : 4, 9, 25, 49, 121, ?',
    options: ['144', '169', '196', '225'],
    correct: 1,
    explanation: 'दिलेली मालिका ही सलग मूळ संख्यांचे वर्ग (Prime Numbers Squared) आहे: 2²=4, 3²=9, 5²=25, 7²=49, 11²=121, तर पुढील मूळ संख्या 13 आहे, 13² = 169.',
    examTag: 'TCS Reasoning Drill'
  },
  {
    id: 'nat_6',
    subject: 'भारतीय राज्यघटना',
    question: 'भारतीय संविधानातील कोणत्या कलमास डॉ. बाबासाहेब आंबेडकरांनी "संविधानाचा आत्मा आणि हृदय" (Heart and Soul of the Constitution) म्हटले होते?',
    options: ['कलम १४', 'कलम १९', 'कलम २१', 'कलम ३२'],
    correct: 3,
    explanation: 'कलम ३२ (घटनात्मक उपाययोजनेचा हक्क - Right to Constitutional Remedies) अंतर्गत सर्वोच्च न्यायालयाकडे ५ प्रकारचे प्राधिलेख (Writs) काढण्याचा अधिकार आहे.',
    examTag: 'UPSC & MPSC Polity'
  },
  {
    id: 'nat_7',
    subject: 'General Science',
    question: 'खालीलपैकी कोणता रक्तगट "सर्वयोग्य ग्राही" (Universal Acceptor / Recipient) मानला जातो?',
    options: ['O Negative (O-)', 'O Positive (O+)', 'AB Positive (AB+)', 'A Positive (A+)'],
    correct: 2,
    explanation: 'AB Positive रक्तगटाच्या व्यक्तीच्या रक्तामध्ये A आणि B दोन्ही प्रतिजन (Antigens) असतात आणि प्रतिपिंड नसतात, त्यामुळे तो सर्व रक्तगटांचे रक्त स्वीकारू शकतो.',
    examTag: 'Police Bharti & SSC Science'
  },
  {
    id: 'nat_8',
    subject: 'Indian Polity & Panchayati Raj',
    question: 'स्थानिक स्वराज्य संस्थांना घटनात्मक दर्जा देणारी ७३ वी घटनादुरुस्ती कोणत्या वर्षी अमलात आली?',
    options: ['१९९०', '१९९२', '१९९३', '१९९५'],
    correct: 2,
    explanation: '७३ वी घटनादुरुस्ती कायदा २४ एप्रिल १९९३ रोजी अमलात आला. यामुळे घटनेत ११ वी अनुसूची जोडण्यात आली व २४ एप्रिल हा राष्ट्रीय पंचायती राज दिन मानला जातो.',
    examTag: 'MPSC Combined Prelims 2023'
  },
  {
    id: 'nat_9',
    subject: 'National History',
    question: '१८५७ च्या स्वातंत्र्य समरामध्ये झाशी येथे ब्रिटिशांविरुद्ध कोणी नेतृत्व केले?',
    options: ['बेगम हजरत महल', 'राणी लक्ष्मीबाई', 'झलकारी बाई', 'कस्तुरबा गांधी'],
    correct: 1,
    explanation: 'झाशीच्या राणी लक्ष्मीबाई (मणिकर्णिका) यांनी सर ह्यू रोज यांच्या ब्रिटिश सैन्याविरुद्ध १८५७ च्या उठावात शौर्य गाजवले.',
    examTag: 'SSC CGL & MPSC History'
  },
  {
    id: 'nat_10',
    subject: 'Indian Economy',
    question: 'व्यापारी बँका ज्या व्याजदराने RBI कडून अल्पमुदतीचे कर्ज घेतात त्या दरास काय म्हणतात?',
    options: ['रिव्हर्स रेपो रेट (Reverse Repo Rate)', 'रेपो रेट (Repo Rate)', 'बँक रेट (Bank Rate)', 'CRR'],
    correct: 1,
    explanation: 'रेपो रेट (Repo Rate - Repurchase Agreement) म्हणजे ज्या व्याजदरावर देशाची मध्यवर्ती बँक (RBI) देशातील व्यावसायिक बँकांना तात्पुरते कर्ज देते.',
    examTag: 'RBI Grade B & IBPS PO'
  },
  {
    id: 'nat_11',
    subject: 'General Science',
    question: 'सूर्याचा प्रकाश पृथ्वीपर्यंत पोहोचण्यासाठी साधारणपणे किती वेळ लागतो?',
    options: ['५ मिनिटे २० सेकंद', '६ मिनिटे', '८ मिनिटे २० सेकंद', '१० मिनिटे'],
    correct: 2,
    explanation: 'सूर्याचे पृथ्वीपासूनचे सरासरी अंतर सुमारे १५ कोटी किमी आहे. प्रकाशाचा वेग ३ लाख किमी/सेकंद असल्याने प्रकाशाला सुमारे ५०० सेकंद म्हणजेच ८ मिनिटे २० सेकंद लागतात.',
    examTag: 'MPSC General Science'
  },
  {
    id: 'nat_12',
    subject: 'बुद्धिमत्ता चाचणी',
    question: 'जर एका सांकेतिक भाषेत CAT = 24 आणि DOG = 26 असेल, तर PIG = ?',
    options: ['32', '34', '36', '40'],
    correct: 0,
    explanation: 'अक्षरांचे वर्णक्रमानुसार स्थान: C(3)+A(1)+T(20) = 24. D(4)+O(15)+G(7) = 26. P(16)+I(9)+G(7) = 32.',
    examTag: 'TCS Reasoning Pattern'
  }
]

/**
 * Returns a deterministic 10-question set for any specific calendar date.
 * Guarantees a fresh, properly balanced test (5 Maharashtra + 5 National) each day at 00:00 IST.
 *
 * @param {Date|string} date
 * @returns {Array} 10 questions
 */
export function getDailyQuizQuestions(date = new Date()) {
  const d = (date instanceof Date) ? date : new Date(date)
  // Day of year calculation
  const startOfYear = new Date(d.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
  const seed = Math.abs(dayOfYear)

  const mhCount = MAHARASHTRA_QUIZ_POOL.length
  const natCount = NATIONAL_GK_QUIZ_POOL.length

  const selectedMh = []
  for (let i = 0; i < 5; i++) {
    const idx = (seed * 2 + i * 3) % mhCount
    selectedMh.push(MAHARASHTRA_QUIZ_POOL[idx])
  }

  const selectedNat = []
  for (let i = 0; i < 5; i++) {
    const idx = (seed * 3 + i * 2) % natCount
    selectedNat.push(NATIONAL_GK_QUIZ_POOL[idx])
  }

  return [...selectedMh, ...selectedNat]
}

// Default export for today's date
export const DAILY_QUIZ_QUESTIONS = getDailyQuizQuestions(new Date())
