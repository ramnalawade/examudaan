const fs = require('fs');
const path = require('path');

const pyqs = [
  // ── POLITY & CONSTITUTION ──
  {
    id: 1,
    topic: "73rd Amendment Act & Panchayati Raj",
    subject: "Polity",
    exam: "MPSC Combined Prelims",
    year: 2022,
    question: "७३ व्या घटनादुरुस्ती कायदा १९९२ द्वारे भारतीय संविधानात कोणती नवीन अनुसूची जोडली गेली आणि त्यात किती विषयांचा समावेश आहे?",
    options: {
      A: "१० वी अनुसूची (२२ विषय)",
      B: "११ वी अनुसूची (२९ विषय)",
      C: "१२ वी अनुसूची (१८ विषय)",
      D: "९ वी अनुसूची (३५ विषय)"
    },
    correct: "B",
    explanation: "७३ व्या घटनादुरुस्तीने संविधानात भाग ९ आणि ११ वी अनुसूची जोडली, ज्यामध्ये पंचायतींना सोपवण्यात आलेले २९ कार्यात्मक विषय आहेत.",
    tags: ["73rd amendment", "panchayati raj", "11th schedule", "राज्यघटना", "पंचायत राज"]
  },
  {
    id: 2,
    topic: "Right to Information (RTI Act 2005)",
    subject: "Polity",
    exam: "Maharashtra Talathi (TCS Pattern)",
    year: 2023,
    question: "माहितीचा अधिकार अधिनियम २००५ नुसार जनमाहिती अधिकाऱ्याने (PIO) सर्वसाधारण माहिती अर्जदारास किती दिवसांत देणे बंधनकारक आहे?",
    options: {
      A: "१५ दिवस",
      B: "३० दिवस",
      C: "४५ दिवस",
      D: "६० दिवस"
    },
    correct: "B",
    explanation: "कलम ७(१) नुसार सामान्य माहिती ३० दिवसांत देणे अनिवार्य आहे. जर माहिती व्यक्तीच्या जीवन वा स्वातंत्र्याशी संबंधित असेल तर ती ४८ तासांत देणे आवश्यक आहे.",
    tags: ["rti act 2005", "माहितीचा अधिकार", "tcs talathi", "कलम ७"]
  },
  {
    id: 3,
    topic: "Fundamental Rights & Writs (Article 32)",
    subject: "Polity",
    exam: "MPSC Rajyaseva Prelims",
    year: 2021,
    question: "डॉ. बाबासाहेब आंबेडकरांनी भारतीय राज्यघटनेच्या कोणत्या कलमास 'घटनेचा आत्मा आणि हृदय' (Heart and Soul of the Constitution) असे संबोधले आहे?",
    options: {
      A: "कलम १४",
      B: "कलम १९",
      C: "कलम २१",
      D: "कलम ३२"
    },
    correct: "D",
    explanation: "कलम ३२ (घटनात्मक उपाययोजनांचा हक्क) सर्वोच्च न्यायालयाला नागरिकांच्या मूलभूत हक्कांचे रक्षण करण्यासाठी ५ प्रकारचे प्राधिलेख (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto) जारी करण्याचे अधिकार देते.",
    tags: ["article 32", "writ", "ambedkar", "मूलभूत हक्क", "mpsc"]
  },
  {
    id: 4,
    topic: "Governor Appointment & Powers",
    subject: "Polity",
    exam: "MPSC Combined Group B",
    year: 2023,
    question: "घटकराज्याच्या राज्यपालांची नियुक्ती संविधानाच्या कोणत्या कलमांतर्गत भारताचे राष्ट्रपती करतात?",
    options: {
      A: "कलम १५३",
      B: "कलम १५५",
      C: "कलम १६१",
      D: "कलम १६४"
    },
    correct: "B",
    explanation: "कलम १५५ नुसार राज्यपालांची नियुक्ती राष्ट्रपतींद्वारे सही व शिक्क्यानिशी केली जाते. कलम १५३ नुसार प्रत्येक राज्यासाठी एक राज्यपाल असेल.",
    tags: ["governor", "article 155", "president", "राज्यपाल", "mpsc"]
  },

  // ── MAHARASHTRA GEOGRAPHY ──
  {
    id: 5,
    topic: "Rivers & Dams of Maharashtra (Koyna & Godavari)",
    subject: "Geography",
    exam: "Maharashtra Police Bharti",
    year: 2023,
    question: "महाराष्ट्रातील सर्वात मोठे जलविद्युत केंद्र असलेले 'कोयना धरण' कोणत्या जिल्ह्यात असून त्याच्या जलाशयाचे नाव काय आहे?",
    options: {
      A: "पुणे - बाजीपासलकर सागर",
      B: "सातारा - शिवसागर",
      C: "कोल्हापूर - वसंतसागर",
      D: "अहमदनगर - आर्थर लेक"
    },
    correct: "B",
    explanation: "कोयना धरण सातारा जिल्ह्यातील पाटण तालुक्यात कोयना नदीवर असून त्याच्या जलाशयास 'शिवसागर' म्हणतात. या प्रकल्पास महाराष्ट्राची 'भाग्यलक्ष्मी' म्हटले जाते.",
    tags: ["koyna dam", "shivsagar", "satara", "धरणे", "महाराष्ट्राचा भूगोल", "police bharti"]
  },
  {
    id: 6,
    topic: "Mountain Peaks (Kalsubai & Sahyadri)",
    subject: "Geography",
    exam: "MPSC Combined Prelims",
    year: 2020,
    question: "सह्याद्री पर्वतातील महाराष्ट्रातील सर्वोच्च शिखर 'कळसूबाई' ची अचूक उंची किती मीटर आहे?",
    options: {
      A: "१,५६७ मीटर",
      B: "१,६४६ मीटर",
      C: "१,४३८ मीटर",
      D: "१,४२२ मीटर"
    },
    correct: "B",
    explanation: "कळसूबाई (अहमदनगर-नाशिक सीमा, अकोले तालुका) हे १,६४६ मीटर उंचीसह महाराष्ट्रातील सर्वात उंच पर्वतशिखर आहे.",
    tags: ["kalsubai", "sahyadri", "कळसूबाई", "सर्वोच्च शिखर", "mpsc geography"]
  },
  {
    id: 7,
    topic: "Meteorite Lakes (Lonar Crater)",
    subject: "Geography",
    exam: "TCS Talathi Bharti",
    year: 2023,
    question: "उल्कापातामुळे निर्माण झालेले आंतरराष्ट्रीय रामसर दर्जाचे खाऱ्या पाण्याचे 'लोणार सरोवर' महाराष्ट्रातील कोणत्या जिल्ह्यात आहे?",
    options: {
      A: "अकोला",
      B: "बुलढाणा",
      C: "वाशीम",
      D: "जालना"
    },
    correct: "B",
    explanation: "लोणार सरोवर बुलढाणा जिल्ह्यातील असून ते बेसॉल्ट खडकातील उल्कापातामुळे ५०,००० वर्षांपूर्वी तयार झालेले अद्वितीय सरोवर आहे.",
    tags: ["lonar lake", "buldhana", "ramsar site", "लोणार सरोवर", "tcs"]
  },

  // ── HISTORY & SOCIAL REFORMERS ──
  {
    id: 8,
    topic: "Satyashodhak Samaj & Mahatma Phule",
    subject: "History",
    exam: "MPSC Rajyaseva Prelims",
    year: 2019,
    question: "महात्मा जोतीराव फुले यांनी २४ सप्टेंबर १८७३ रोजी पुण्यात कोणत्या संस्थेची स्थापना केली आणि त्याचे मुख्य उद्दिष्ट काय होते?",
    options: {
      A: "प्रार्थना समाज — धार्मिक सुधारणा",
      B: "सत्यशोधक समाज — शूद्र व अतिशूद्र समाजाची ब्राह्मण्यशाहीच्या शोषणातून मुक्ती",
      C: "आर्य समाज — वेदांचे पुनरुज्जीवन",
      D: "मानवधर्म सभा — एकेश्वरवाद"
    },
    correct: "B",
    explanation: "महात्मा फुले यांनी २४ सप्टेंबर १८७३ रोजी सत्यशोधक समाजाची स्थापना केली. 'सर्वसाक्षी जगत्पती। त्याला नकोच मध्यस्थी।' हे या समाजाचे मुख्य ब्रीद होते.",
    tags: ["satyashodhak samaj", "mahatma phule", "पुणे", "१८७३", "mpsc history"]
  },
  {
    id: 9,
    topic: "Chhatrapati Shahu Maharaj Reforms",
    subject: "History",
    exam: "MPSC Combined Group B",
    year: 2021,
    question: "राजर्षी छत्रपती शाहू महाराजांनी कोल्हापूर संस्थानात बहुजन समाजासाठी ५०% आरक्षणाचा ऐतिहासिक जाहीरनामा कधी प्रसिद्ध केला?",
    options: {
      A: "२६ जुलै १९०२",
      B: "२५ जुलै १९१७",
      C: "१ मे १९०५",
      D: "१८ ऑक्टोबर १९०६"
    },
    correct: "A",
    explanation: "२६ जुलै १९०२ रोजी शाहू महाराजांनी कोल्हापुरात मागासवर्गीय समाजासाठी ५०% आरक्षणाचा भारतातला पहिला सरकारी वटहुकूम काढला.",
    tags: ["shahu maharaj", "reservation 1902", "kolhapur", "शाहू महाराज", "आरक्षण"]
  },
  {
    id: 10,
    topic: "Dr. B.R. Ambedkar & Mahad Satyagraha",
    subject: "History",
    exam: "Maharashtra Police Bharti",
    year: 2022,
    question: "डॉ. बाबासाहेब आंबेडकरांनी चवदार तळ्याचा ऐतिहासिक सत्याग्रह कोणत्या दिवशी केला, जो आज 'सामाजिक सबलीकरण दिन' म्हणून साजरा होतो?",
    options: {
      A: "२० मार्च १९२७",
      B: "२५ डिसेंबर १९२७",
      C: "१४ ऑक्टोबर १९५६",
      D: "२४ सप्टेंबर १९३२"
    },
    correct: "A",
    explanation: "२० मार्च १९२७ रोजी महाड येथे चवदार तळ्यावर पाण्याचा मूलभूत मानवी हक्क मिळवण्यासाठी डॉ. आंबेडकरांच्या नेतृत्वाखाली सत्याग्रह झाला.",
    tags: ["mahad satyagraha", "ambedkar", "२० मार्च १९२७", "चवदार तळे", "police bharti"]
  },
  {
    id: 11,
    topic: "1857 Revolt in Maharashtra",
    subject: "History",
    exam: "MPSC Rajyaseva Prelims",
    year: 2018,
    question: "१८५७ च्या उठावात साताऱ्याचे छत्रपती प्रतापसिंह यांच्या हक्कासाठी लंडनला जाऊन नंतर साताऱ्यात उठाव घडवणारे नेते कोण होते?",
    options: {
      A: "रंगो बापूजी गुप्ते",
      B: "भागाजी नाईक",
      C: "चीमासाहेब",
      D: "उमाजी नाईक"
    },
    correct: "A",
    explanation: "रंगो बापूजी गुप्ते यांनी लंडनमध्ये १२ वर्षे साताऱ्याच्या गादीसाठी लढा दिला व परत येऊन १८५७ च्या क्रांतीचे नियोजन केले.",
    tags: ["1857 revolt", "rango bapuji", "satara", "१८५७ चा उठाव"]
  },

  // ── ECONOMY & BANKING ──
  {
    id: 12,
    topic: "Reserve Bank of India & Monetary Policy",
    subject: "Economy",
    exam: "RBI Grade B / SSC CGL",
    year: 2023,
    question: "RBI द्वारे रेपो रेट (Repo Rate) वाढवल्यास देशातील बँकिंग व अर्थव्यवस्थेवर कोणता थेट परिणाम होतो?",
    options: {
      A: "कर्ज स्वस्त होते व बाजारात रोखता वाढते",
      B: "बँकांचे कर्ज महाग होते व बाजारातील अतिरिक्त तरलता शोषून महागाई रोखली जाते",
      C: "रुपयाचे अवमूल्यन होते",
      D: "सरकारी खर्चात वाढ होते"
    },
    correct: "B",
    explanation: "रेपो रेट वाढल्याने व्यापारी बँकांना RBI कडून मिळणारे कर्ज महाग होते, ज्यामुळे बाजारातील पैशांचा पुरवठा कमी होऊन महागाई आटोक्यात येते.",
    tags: ["repo rate", "rbi", "monetary policy", "महागाई", "अर्थव्यवस्था"]
  },
  {
    id: 13,
    topic: "Goods & Services Tax (GST)",
    subject: "Economy",
    exam: "MPSC Combined Group C",
    year: 2022,
    question: "भारतामध्ये वस्तू व सेवा कर (GST) कोणत्या घटनादुरुस्ती कायद्यान्वये १ जुलै २०१७ पासून देशभरात लागू झाला?",
    options: {
      A: "९९ वी घटनादुरुस्ती",
      B: "१०० वी घटनादुरुस्ती",
      C: "१०१ वी घटनादुरुस्ती कायदा २०१६",
      D: "१०३ वी घटनादुरुस्ती"
    },
    correct: "C",
    explanation: "१०१ व्या घटनादुरुस्ती कायदा २०१६ द्वारे १ जुलै २०१७ पासून 'एक देश, एक कर' संकल्पनेवर आधारित GST लागू झाला.",
    tags: ["gst", "101st amendment", "वस्तू व सेवा कर", "mpsc economy"]
  },
  {
    id: 14,
    topic: "Maharashtra Ladki Bahin Yojana",
    subject: "Economy",
    exam: "TCS / MPSC Expected",
    year: 2024,
    question: "महाराष्ट्र शासनाच्या 'मुख्यमंत्री माझी लाडकी बहीण योजना २०२४' अंतर्गत पात्र लाभार्थी महिलांना प्रतिमहा किती आर्थिक साहाय्य दिले जाते?",
    options: {
      A: "₹१,०००",
      B: "₹१,२५०",
      C: "₹१,५००",
      D: "₹२,०००"
    },
    correct: "C",
    explanation: "महाराष्ट्र शासनाने २१ ते ६५ वयोगटातील पात्र महिलांना दरमहा ₹१,५०० थेट डीबीटी (DBT) द्वारे बँक खात्यात जमा करण्याची योजना सुरू केली.",
    tags: ["ladki bahin yojana", "शासकीय योजना", "महाराष्ट्र", "current affairs"]
  },

  // ── SCIENCE & TECHNOLOGY ──
  {
    id: 15,
    topic: "Human Blood Groups & Universal Donor",
    subject: "Science",
    exam: "Maharashtra Police Bharti",
    year: 2021,
    question: "कोणत्या रक्तगटाच्या व्यक्तीस 'सर्वयोग्य दाता' (Universal Donor) म्हटले जाते कारण त्यांच्या लाल रक्तपेशींवर कोणतेही प्रतिजन नसतात?",
    options: {
      A: "AB धन (AB+)",
      B: "O ऋण (O-)",
      C: "A धन (A+)",
      D: "B ऋण (B-)"
    },
    correct: "B",
    explanation: "O- रक्तगटावर A, B किंवा Rh कोणताही अँटीजेन नसतो, त्यामुळे ते कोणत्याही इतर रक्तगटाच्या व्यक्तीस देता येते.",
    tags: ["blood group", "universal donor", "o negative", "रक्तगट", "विज्ञान"]
  },
  {
    id: 16,
    topic: "Space Missions (ISRO Chandrayaan & Gaganyaan)",
    subject: "Science",
    exam: "SSC CGL Tier 1",
    year: 2023,
    question: "२३ ऑगस्ट २०२३ रोजी इस्रोचे चांद्रयान-३ चंद्राच्या दक्षिण ध्रुवावर यशस्वीपणे उतरले. भारत सरकारने हा दिवस कोणता राष्ट्रीय दिवस म्हणून जाहीर केला?",
    options: {
      A: "राष्ट्रीय विज्ञान दिन",
      B: "राष्ट्रीय अंतराळ दिन (National Space Day)",
      C: "इस्रो गौरव दिन",
      D: "राष्ट्रीय तंत्रज्ञान दिन"
    },
    correct: "B",
    explanation: "पंतप्रधान नरेंद्र मोदी यांनी २३ ऑगस्ट हा दिवस 'राष्ट्रीय अंतराळ दिन' (National Space Day) म्हणून साजरा करण्याची घोषणा केली आणि लँडिंग ठिकाणास 'शिवशक्ती पॉइंट' नाव दिले.",
    tags: ["chandrayaan 3", "national space day", "isro", "चांद्रयान", "science"]
  },

  // ── MARATHI VYAKARAN (TCS & MPSC) ──
  {
    id: 17,
    topic: "Marathi Prayog (प्रयोग - कर्मकर्तरी / नवीन कर्मणी)",
    subject: "Marathi",
    exam: "TCS Talathi Bharti",
    year: 2023,
    question: "'न्यायाधीशाकडून आरोपीला दंड ठोठावण्यात आला.' या वाक्यातील प्रयोग ओळखा:",
    options: {
      A: "कर्तरी प्रयोग",
      B: "नवीन कर्मणी (कर्मकर्तरी प्रयोग)",
      C: "भावे प्रयोग",
      D: "मिश्र प्रयोग"
    },
    correct: "B",
    explanation: "इंग्रजीतील Passive Voice च्या प्रभावातून मराठीत कर्त्याला 'कडून' प्रत्यय लागून वाक्यरचना झाल्यास त्यास 'नवीन कर्मणी' किंवा 'कर्मकर्तरी प्रयोग' म्हणतात.",
    tags: ["prayog", "नवीन कर्मणी", "कर्मकर्तरी", "मराठी व्याकरण", "tcs"]
  },
  {
    id: 18,
    topic: "Marathi Samas (समास - बहुव्रीही व तत्पुरुष)",
    subject: "Marathi",
    exam: "MPSC Combined Group B",
    year: 2022,
    question: "'कमलनयन' किंवा 'लंबोदर' हे सामासिक शब्द कोणत्या समासाचे उदाहरण आहेत?",
    options: {
      A: "अव्ययीभाव समास",
      B: "तत्पुरुष समास",
      C: "बहुव्रीही समास",
      D: "द्वंद्व समास"
    },
    correct: "C",
    explanation: "ज्या समासात दोन्ही पदे प्रमुख नसून त्या दोन्ही पदांवरून तिसऱ्याच घटकाचा बोध होतो त्यास 'बहुव्रीही समास' म्हणतात (लंबोदर = ज्याचे उदर लांब आहे असा तो गणपती).",
    tags: ["samas", "बहुव्रीही समास", "मराठी व्याकरण", "mpsc marathi"]
  },
  {
    id: 19,
    topic: "Marathi Vakprachar (वाक्प्रचार व म्हणी)",
    subject: "Marathi",
    exam: "Maharashtra Police Bharti",
    year: 2023,
    question: "'पायमल्ली करणे' या वाक्प्रचाराचा अचूक अर्थ काय?",
    options: {
      A: "पायाने रस्ता चालणे",
      B: "अपमान करणे किंवा नियमांना धुडकावून लावणे",
      C: "पाय स्वच्छ धुणे",
      D: "घाईघाईने पळून जाणे"
    },
    correct: "B",
    explanation: "पायमल्ली करणे म्हणजे एखाद्या गोष्टीची अजिबात पर्वा न करता तिचे उल्लंघन करणे किंवा धुडकावून लावणे.",
    tags: ["vakprachar", "पायमल्ली करणे", "वाक्प्रचार", "police bharti"]
  },

  // ── ENGLISH & REASONING ──
  {
    id: 20,
    topic: "Subject-Verb Agreement (English)",
    subject: "English",
    exam: "SSC CGL Tier 1",
    year: 2023,
    question: "Identify the grammatically correct sentence: 'Neither of the two applicants _______ qualified for the post.'",
    options: {
      A: "were",
      B: "is",
      C: "are",
      D: "have been"
    },
    correct: "B",
    explanation: "'Neither of' takes a singular pronoun/verb. Therefore, 'Neither of the two applicants is qualified' is correct.",
    tags: ["subject verb agreement", "neither of", "english grammar", "ssc cgl"]
  },
  {
    id: 21,
    topic: "Syllogism & Logical Deduction",
    subject: "Reasoning",
    exam: "MPSC CSAT & IBPS PO",
    year: 2022,
    question: "Statements: All officers are leaders. Some leaders are innovators. Conclusions: I. Some officers are innovators. II. All innovators are leaders.",
    options: {
      A: "Only I follows",
      B: "Only II follows",
      C: "Both follow",
      D: "Neither follows"
    },
    correct: "D",
    explanation: "Since Innovators only intersects Leaders and has no direct definite overlap with Officers, and not all innovators are leaders, neither conclusion follows definitively.",
    tags: ["syllogism", "logical reasoning", "csat", "mpsc", "ibps"]
  }
];

const filePath = path.join(__dirname, '../apps/web/src/lib/pyqData.js');
const content = '// 15-Year Searchable Topic-wise PYQ Bank Data\nexport const PYQ_DATABASE = ' + JSON.stringify(pyqs, null, 2) + ';\n';
fs.writeFileSync(filePath, content, 'utf8');

console.log('PYQ Database written successfully with ' + pyqs.length + ' comprehensive questions!');
