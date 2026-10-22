#!/usr/bin/env python3
"""
broadcast_alerts.py — ExamUdaan Automated Alert Broadcaster
============================================================
Broadcasts a curated daily capsule to Telegram Channel (@examudaanjobs) and WhatsApp:
  1. Top 2 Latest Government Jobs (with vacancies, eligibility, last date & link)
  2. 2 Authentic CBT Mock Tests (Full blueprints & high-speed sectional drills)
  3. 1 Exam Syllabus & PYQ Guide (Comprehensive exam breakdown & download link)
  4. Interactive Telegram Quiz Poll (Question of the day with live answer & explanation)
  5. Free Aspirant Tools (Physical marks calculator & 7th pay salary calculator)

Usage:
  python broadcast_alerts.py --dry-run                    # Preview Daily Digest + Quiz Poll
  python broadcast_alerts.py --telegram                   # Broadcast Daily Digest + Quiz Poll to Telegram
  python broadcast_alerts.py --whatsapp                   # Generate WhatsApp digest and copy to clipboard
  python broadcast_alerts.py --mode single --limit 5      # Legacy mode: broadcast individual job alerts
"""

import os
import sys
import json
import time
import argparse
import logging
import requests
from pathlib import Path
from datetime import datetime, date
from dotenv import load_dotenv

# Load scraper .env
load_dotenv()

# Ensure UTF-8 stdout encoding for Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("broadcast_alerts")

# Telegram & WhatsApp configuration
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "@examudaanjobs").strip()
WHATSAPP_CHANNEL_URL = os.getenv("WHATSAPP_CHANNEL_URL", "https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v").strip()
TELEGRAM_CHANNEL_URL = os.getenv("TELEGRAM_CHANNEL_URL", "https://t.me/examudaanjobs").strip()

HISTORY_FILE = Path(__file__).parent / "broadcast_history.json"
WHATSAPP_DIGEST_FILE = Path(__file__).parent / "todays_whatsapp_posts.txt"

try:
    import db
except ImportError:
    from . import db

# ============================================================
# CURATED PORTAL RESOURCES (Rotated deterministically daily)
# ============================================================

CURATED_FULL_MOCKS = [
    {
        "title": "MPSC Combined Group B & C Prelims (100 Qs)",
        "title_mr": "MPSC संयुक्त पूर्व परीक्षा गट ब व क सराव चाचणी",
        "slug": "mpsc-combined-full-prelims",
        "desc": "100 प्रश्न • 60 मिनिटे • TCS/MPSC पॅटर्न • राज्य रँक विश्लेषण",
        "badge": "MPSC Blueprint",
    },
    {
        "title": "Maharashtra Police Bharti 2026 Full Mock",
        "title_mr": "महाराष्ट्र पोलीस शिपाई भरती परीक्षा (100 प्रश्न)",
        "slug": "maharashtra-police-written-mock",
        "desc": "100 प्रश्न • 90 मिनिटे • मराठी व्याकरण, गणित, बुद्धिमत्ता व चालू घडामोडी",
        "badge": "Police Special",
    },
    {
        "title": "Maharashtra Talathi Bharti Blueprint Mock",
        "title_mr": "महाराष्ट्र तलाठी भरती ऑथेंटिक टेस्ट (100 प्रश्न)",
        "slug": "maharashtra-talathi-tcs-mock",
        "desc": "100 प्रश्न • TCS पॅटर्न • निगेटिव्ह मार्किंग • विषयवार कटऑफ",
        "badge": "TCS Blueprint",
    },
    {
        "title": "SSC CGL Tier 1 CBT Full Mock Test",
        "title_mr": "SSC CGL Tier 1 संपूर्ण सराव चाचणी (100 प्रश्न)",
        "slug": "ssc-cgl-tier1-full",
        "desc": "100 MCQs • 60 Min • Reasoning, English, Quant & General Awareness",
        "badge": "Central Govt",
    },
]

CURATED_SECTIONAL_DRILLS = [
    {
        "title": "Marathi Vyakaran 25-Q Speed Drill",
        "title_mr": "मराठी व्याकरण 25-प्रश्न स्पीड ड्रिल",
        "slug": "marathi-vyakaran-drill-1",
        "desc": "25 प्रश्न • 20 मिनिटे • समास, प्रयोग, संधी, समानार्थी शब्द व म्हणी",
        "badge": "High Yield",
    },
    {
        "title": "Maharashtra Geography Speed Drill",
        "title_mr": "महाराष्ट्र भूगोल 20-प्रश्न हाय-स्पीड सराव",
        "slug": "mpsc-gs-maharashtra-geography",
        "desc": "20 प्रश्न • 20 मिनिटे • नद्या, पर्वत, घाट, राष्ट्रीय उद्याने व धरणे",
        "badge": "Geography",
    },
    {
        "title": "Indian Polity & Constitution Speed Drill",
        "title_mr": "भारतीय राज्यघटना व पंचायत राज ड्रिल",
        "slug": "mpsc-polity-constitution",
        "desc": "20 प्रश्न • 20 मिनिटे • महत्त्वाची कलमे, घटनादुरुस्त्या व ग्रामप्रशासन",
        "badge": "Polity",
    },
    {
        "title": "Quantitative Aptitude & Reasoning Speed Drill",
        "title_mr": "अंकगणित व बुद्धिमत्ता चाचणी स्पीड ड्रिल",
        "slug": "upsc-csat-reasoning",
        "desc": "20 प्रश्न • 20 मिनिटे • शॉर्टकट ट्रिक्स व TCS पॅटर्न गणित व लॉजिक",
        "badge": "CSAT / Maths",
    },
    {
        "title": "Maharashtra & National Current Affairs Drill",
        "title_mr": "चालू घडामोडी 2026 महाराष्ट्र स्पेशल ड्रिल",
        "slug": "mpsc-current-affairs-2026",
        "desc": "20 प्रश्न • 20 मिनिटे • राज्य व राष्ट्रीय ताज्या घडामोडी व शासकीय योजना",
        "badge": "Current Affairs",
    },
    {
        "title": "SSC CGL General Awareness Speed Drill",
        "title_mr": "सामान्य ज्ञान व इतिहास-भूगोल सराव",
        "slug": "ssc-cgl-general-awareness",
        "desc": "20 प्रश्न • 20 मिनिटे • General Science, History, Geography & GK",
        "badge": "Central SSC",
    },
]

CURATED_SYLLABUS = [
    {
        "name": "MPSC राज्य सेवा परीक्षा (Rajyaseva) 2026",
        "name_en": "MPSC State Services (Rajya Seva)",
        "slug": "mpsc-state-services",
        "desc": "पूर्व व मुख्य परीक्षा नवा वर्णनात्मक (Descriptive) पॅटर्न + मागील 5 वर्षांच्या PYQ प्रश्नपत्रिका",
    },
    {
        "name": "MPSC संयुक्त गट ब व क (Combined Group B & C)",
        "name_en": "MPSC Combined Group B & C",
        "slug": "mpsc-combined",
        "desc": "PSI, STI, ASO, दुय्यम निबंधक, कर सहाय्यक, लिपिक टंकलेखक संपूर्ण अभ्यासक्रम व विषयवार गुणविभागणी",
    },
    {
        "name": "महाराष्ट्र पोलीस शिपाई व चालक भरती",
        "name_en": "Maharashtra Police Bharti",
        "slug": "maharashtra-police",
        "desc": "लेखी परीक्षा 100 गुण पॅटर्न + 50 गुण शारीरिक चाचणी (Physical) निकष व मागील पेपर प्रश्नपत्रिका",
    },
    {
        "name": "महाराष्ट्र तलाठी भरती (TCS Pattern)",
        "name_en": "Maharashtra Talathi Bharti",
        "slug": "maharashtra-talathi",
        "desc": "मराठी, इंग्रजी, सामान्य ज्ञान, बौद्धिक चाचणी टॉपिक-वाइज ब्लू प्रिंट व कटऑफ विश्लेषण",
    },
    {
        "name": "SSC CGL (Combined Graduate Level) 2026",
        "name_en": "Staff Selection Commission CGL",
        "slug": "ssc-cgl",
        "desc": "Tier 1 & Tier 2 Detailed Syllabus, Negative Marking, Scheme of Exam & Recommended Books",
    },
    {
        "name": "महाराष्ट्र वनरक्षक भरती (Forest Guard)",
        "name_en": "Maharashtra Forest Guard",
        "slug": "maharashtra-forest",
        "desc": "वने व पर्यावरण, भूगोल, सामान्य ज्ञान व 5 किमी धावणे शारीरिक चाचणी निकष",
    },
    {
        "name": "जिल्हा परिषद भरती (ZP Recruitment)",
        "name_en": "Zilla Parishad Recruitment",
        "slug": "maharashtra-zp",
        "desc": "ग्रामसेवक, आरोग्य सेवक, कनिष्ठ प्रशासन लिपिक पदनिहाय अभ्यासक्रम व तांत्रिक घटक",
    },
    {
        "name": "IBPS PO / Clerk बँकिंग भरती",
        "name_en": "IBPS Bank PO & Clerk",
        "slug": "ibps-po",
        "desc": "Quantitative Aptitude, Reasoning Ability, English Language & Banking Awareness",
    },
    {
        "name": "RRB Railway NTPC & Group D",
        "name_en": "Railway Recruitment Board NTPC",
        "slug": "rrb-ntpc",
        "desc": "CBT 1 & CBT 2 Stage-wise Exam Pattern, General Science & Maths syllabus",
    },
    {
        "name": "सार्वजनिक आरोग्य विभाग भरती (Arogya Vibhag Group C & D)",
        "name_en": "Maharashtra Public Health Department Recruitment",
        "slug": "maharashtra-arogya-vibhag",
        "desc": "आरोग्य सेवक, परिचारिका, औषध निर्माण अधिकारी तांत्रिक व अतांत्रिक 100 प्रश्न अभ्यासक्रम",
    },
    {
        "name": "कृषी सेवक व कृषी सहाय्यक भरती (Krushi Sevak)",
        "name_en": "Maharashtra Krushi Sevak Bharti",
        "slug": "krushi-sevak",
        "desc": "कृषी पदविका व पदवी तांत्रिक घटक + सामान्य ज्ञान, मराठी, इंग्रजी परीक्षा पॅटर्न",
    },
    {
        "name": "महाराष्ट्र पोलीस चालक व SRPF शिपाई भरती",
        "name_en": "Pune Mumbai Police Driver & SRPF Bharti",
        "slug": "pune-mumbai-police-driver",
        "desc": "वाहन चालविणे चाचणी (Driving Test 50 गुण) + शारीरिक चाचणी + लेखी परीक्षा सविस्तर अभ्यासक्रम",
    },
]

# Daily interactive quiz pool for Telegram Poll (Telegram Native Quiz)
CURATED_QUIZ_POOL = [
    {
        "subject": "मराठी व्याकरण",
        "question": "खालीलपैकी कोणता शब्द 'अमृत' या शब्दाचा समानार्थी शब्द नाही?",
        "options": ["पीयूष", "सुधा", "संजीवनी", "हलाहल"],
        "correct": 3,
        "explanation": "'हलाहल' म्हणजे अत्यंत तीव्र विष. पीयूष, सुधा आणि संजीवनी हे अमृताचे समानार्थी शब्द आहेत.",
    },
    {
        "subject": "महाराष्ट्र भूगोल",
        "question": "महाराष्ट्रातील खालीलपैकी कोणता घाट मुंबई आणि नाशिक या दोन शहरांना जोडतो?",
        "options": ["कसारा घाट (थळ घाट)", "माळशेज घाट", "बोर घाट", "कुंभार्ली घाट"],
        "correct": 0,
        "explanation": "मुंबई-नाशिक दरम्यान कसारा (थळ) घाट आहे. मुंबई-पुणे दरम्यान बोर घाट तर ठाणे-अहमदनगर दरम्यान माळशेज घाट आहे.",
    },
    {
        "subject": "पोलीस व ग्रामप्रशासन",
        "question": "महाराष्ट्रात 'पोलीस पाटील' यांची नेमणूक खालीलपैकी कोणाद्वारे केली जाते?",
        "options": ["पोलीस अधीक्षक (SP)", "उपविभागीय अधिकारी (SDO / प्रांत)", "तहसीलदार", "जिल्हाधिकारी"],
        "correct": 1,
        "explanation": "महाराष्ट्र ग्राम पोलीस अधिनियम १९६७ नुसार पोलीस पाटलांची नेमणूक उपविभागीय अधिकारी (SDO/प्रांत) यांच्याद्वारे केली जाते.",
    },
    {
        "subject": "चालू घडामोडी व योजना",
        "question": "महाराष्ट्र शासनाच्या 'मुख्यमंत्री माझी लाडकी बहीण योजने'अंतर्गत पात्र महिलांना दरमहा किती रुपयांचे साहाय्य दिले जाते?",
        "options": ["₹१,०००", "₹१,२५०", "₹१,५००", "₹२,१००"],
        "correct": 2,
        "explanation": "लाडकी बहीण योजनेअंतर्गत २१ ते ६५ वयोगटातील पात्र महिलांच्या खात्यात दरमहा ₹१,५०० थेट डीबीटीद्वारे जमा केले जातात.",
    },
    {
        "subject": "पर्यावरण व जैवविविधता",
        "question": "महाराष्ट्रातील पहिले रामसर पाणथळ स्थळ (Ramsar Wetland Site) म्हणून कोणते सरोवर घोषित करण्यात आले?",
        "options": ["लोणार सरोवर", "नांदूर मधमेश्वर", "ठाणे खाडी", "उजनी जलाशय"],
        "correct": 1,
        "explanation": "नाशिक जिल्ह्यातील 'नांदूर मधमेश्वर' हे २०२० मध्ये महाराष्ट्रातील पहिले रामसर स्थळ म्हणून घोषित करण्यात आले (महाराष्ट्राचे भरतपूर).",
    },
    {
        "subject": "महाराष्ट्र इतिहास",
        "question": "२० मार्च १९२७ रोजी डॉ. बाबासाहेब आंबेडकरांनी पाण्यासाठी कोणता ऐतिहासिक सत्याग्रह केला?",
        "options": ["काळाराम मंदिर सत्याग्रह", "महाड चवदार तळे सत्याग्रह", "पुणे करार", "मुळशी सत्याग्रह"],
        "correct": 1,
        "explanation": "महाड येथील चवदार तळ्यावर डॉ. बाबासाहेब आंबेडकरांनी सत्याग्रह केला. हा दिवस 'सामाजिक सक्षमीकरण दिन' म्हणून साजरा केला जातो.",
    },
    {
        "subject": "मराठी व्याकरण",
        "question": "'त्याने पेरू खाल्ला.' या वाक्यातील प्रयोग ओळखा.",
        "options": ["कर्तरी प्रयोग", "कर्मणी प्रयोग", "भावे प्रयोग", "संकीर्ण प्रयोग"],
        "correct": 1,
        "explanation": "येथे कर्त्याला तृतीया विभक्तीचा प्रत्यय आहे व क्रियापद कर्माच्या (पेरू) लिंग-वचनानुसार बदलते, म्हणून हा कर्मणी प्रयोग आहे.",
    },
    {
        "subject": "महाराष्ट्र भूगोल",
        "question": "महाराष्ट्रातील सर्वोच्च शिखर 'कळसूबाई' ची समुद्रसपाटीपासून उंची किती मीटर आहे?",
        "options": ["१,५६७ मी.", "१,६४६ मी.", "१,४३८ मी.", "१,५२४ मी."],
        "correct": 1,
        "explanation": "कळसूबाई शिखर अहमदनगर व नाशिक जिल्ह्यांच्या सीमेवर (अकोले) असून त्याची समुद्रसपाटीपासून उंची १,६४६ मीटर (५,४०० फूट) आहे.",
    },
    {
        "subject": "समाजसुधारक",
        "question": "महात्मा ज्योतिराव फुले यांनी सत्यशोधक समाजाची स्थापना कोणत्या वर्षी केली?",
        "options": ["१८७३", "१८७५", "१८८५", "१८९३"],
        "correct": 0,
        "explanation": "२४ सप्टेंबर १८७३ रोजी पुणे येथे महात्मा ज्योतिराव फुले यांनी सत्यशोधक समाजाची स्थापना केली. ब्रीदवाक्य: 'सर्वसाक्षी जगत्पती, त्याला नकोच मध्यस्ती'.",
    },
    {
        "subject": "भारतीय राज्यघटना",
        "question": "भारतीय संविधानातील कोणत्या कलमान्वये प्रत्येक राज्यात एक उच्च न्यायालय (High Court) असावे अशी तरतूद आहे?",
        "options": ["कलम १२४", "कलम २१४", "कलम २२६", "कलम ३२४"],
        "correct": 1,
        "explanation": "कलम २१४ नुसार प्रत्येक राज्यासाठी एक उच्च न्यायालय असेल. कलम १२४ हे सर्वोच्च न्यायालयाशी संबंधित आहे, तर कलम २२६ रिट अधिकारांशी संबंधित आहे.",
    },
    {
        "subject": "महाराष्ट्र जलसंपदा",
        "question": "महाराष्ट्राची भाग्यलक्ष्मी म्हणून ओळखल्या जाणाऱ्या कोयना धरणाच्या जलाशयाचे नाव काय आहे?",
        "options": ["यशवंतसागर", "शिवाजी सागर (शिवसागर)", "नाथसागर", "लक्ष्मी तलाव"],
        "correct": 1,
        "explanation": "सातारा जिल्ह्यातील कोयना धरणाच्या जलाशयाचे नाव 'शिवसागर' (Shivaji Sagar) आहे. नाथसागर हे जायकवाडी धरणाचे नाव आहे.",
    },
    {
        "subject": "सामान्य विज्ञान",
        "question": "मानवी शरीरातील रक्तातील साखरेचे (ग्लुकोज) प्रमाण नियंत्रित करणारे 'इन्सुलिन' हे संप्रेरक कोणत्या ग्रंथीद्वारे स्त्रवले जाते?",
        "options": ["यकृत (Liver)", "स्वादुपिंड (Pancreas)", "थायरॉईड (Thyroid)", "पियुषिका (Pituitary)"],
        "correct": 1,
        "explanation": "स्वादुपिंडातील (Pancreas) आयलेट्स ऑफ लँगरहॅन्सच्या बीटा पेशींमधून इन्सुलिन हे संप्रेरक स्त्रवले जाते.",
    },
]


def load_broadcast_history():
    """Load set of already broadcasted notification IDs from JSON history file."""
    if HISTORY_FILE.exists():
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return set(data.get("broadcasted_ids", []))
        except Exception as e:
            logger.warning(f"Could not read broadcast history ({e}); starting fresh.")
    return set()


def save_broadcast_history(history_set):
    """Persist set of broadcasted notification IDs to JSON file."""
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump({
                "last_updated": datetime.now().isoformat(),
                "total_broadcasted": len(history_set),
                "broadcasted_ids": sorted(list(history_set))
            }, f, indent=2)
    except Exception as e:
        logger.error(f"Failed to save broadcast history: {e}")


def get_active_notifications(limit=10, specific_id=None):
    """
    Fetch active recruitment notifications from PostgreSQL database.
    Prioritizes upcoming deadlines and recently scraped entries.
    Falls back to realistic samples if database is unreachable (e.g. during offline testing).
    """
    try:
        conn = db.get_conn()
    except Exception as e:
        logger.warning(f"Database connection offline ({e}). Generating realistic sample notifications for testing...")
        return [
            {
                "id": 514,
                "slug": "mpsc-514",
                "title": "Civil Judge Junior Division & Judicial Magistrate First Class Examination 2026",
                "title_mr": "दिवाणी न्यायाधीश कनिष्ठ स्तर व न्यायदंडाधिकारी प्रथम वर्ग परीक्षा २०२६",
                "notification_type": "recruitment",
                "total_vacancies": 114,
                "apply_end_date": datetime(2026, 10, 25).date(),
                "source_url": "https://mpsc.gov.in",
                "notification_pdf": "https://mpsc.gov.in/downloadFile/Advt_No_08_2026.pdf",
                "application_links": {
                    "apply_online": "https://mpsconline.gov.in",
                    "notification_pdf": "https://mpsc.gov.in/downloadFile/Advt_No_08_2026.pdf"
                },
                "org_name": "Maharashtra Public Service Commission (MPSC)",
                "org_acronym": "MPSC",
                "education_qualifications": ["Degree in Law (LLB)"],
                "ai_extracted_data": {
                    "education_levels": ["Graduate", "Postgraduate"],
                    "education_qualifications": ["LLB (Law Degree)"],
                    "government_level": "State",
                }
            },
            {
                "id": 515,
                "slug": "talathi-515",
                "title": "Maharashtra Talathi Bharti Direct Recruitment Examination 2026",
                "title_mr": "महाराष्ट्र तलाठी भरती थेट सेवा भरती परीक्षा २०२६",
                "notification_type": "recruitment",
                "total_vacancies": 4644,
                "apply_end_date": datetime(2026, 10, 31).date(),
                "source_url": "https://mahabhumi.gov.in",
                "notification_pdf": "https://mahabhumi.gov.in/download/talathi_2026.pdf",
                "application_links": {
                    "apply_online": "https://ibpsonline.ibps.in/talathi2026",
                    "notification_pdf": "https://mahabhumi.gov.in/download/talathi_2026.pdf"
                },
                "org_name": "Revenue and Forest Department, Maharashtra",
                "org_acronym": "Revenue Dept",
                "education_qualifications": ["Any Graduate + MS-CIT"],
                "ai_extracted_data": {
                    "education_levels": ["Graduate"],
                    "education_qualifications": ["Any Graduate Degree", "MS-CIT"],
                    "government_level": "State",
                }
            }
        ]

    try:
        with conn.cursor() as cur:
            if specific_id:
                cur.execute("""
                    SELECT 
                        en.id, en.slug, en.title, en.title_mr, en.notification_type, en.total_vacancies,
                        en.apply_end_date, en.source_url, en.notification_pdf,
                        en.application_links, en.education_qualifications, en.education_levels,
                        en.ai_extracted_data, en.created_at,
                        o.name as org_name, o.acronym as org_acronym
                    FROM exam_notifications en
                    LEFT JOIN organizations o ON o.id = en.organization_id
                    WHERE en.id = %s
                """, (specific_id,))
            else:
                cur.execute("""
                    SELECT 
                        en.id, en.slug, en.title, en.title_mr, en.notification_type, en.total_vacancies,
                        en.apply_end_date, en.source_url, en.notification_pdf,
                        en.application_links, en.education_qualifications, en.education_levels,
                        en.ai_extracted_data, en.created_at,
                        o.name as org_name, o.acronym as org_acronym
                    FROM exam_notifications en
                    LEFT JOIN organizations o ON o.id = en.organization_id
                    WHERE (en.apply_end_date IS NULL OR en.apply_end_date >= CURRENT_DATE)
                      AND (en.notification_type = 'recruitment' OR en.is_job_notification = true)
                      AND en.title IS NOT NULL
                    ORDER BY en.id DESC
                    LIMIT %s
                """, (limit,))

            cols = [desc[0] for desc in cur.description]
            rows = cur.fetchall()
            return [dict(zip(cols, row)) for row in rows]
    finally:
        try:
            db.release_conn(conn)
        except Exception:
            pass


def extract_common_fields(row):
    """Extract and normalize all notification attributes for formatting."""
    title_en = (row.get('title') or 'Government Job Recruitment').strip()
    title_mr = (row.get('title_mr') or row.get('title') or 'शासकीय नोकरी भरती जाहिरात').strip()
    org_name = row.get('org_name') or row.get('org_acronym') or 'Government of Maharashtra / India'
    
    vacancies = row.get('total_vacancies')
    if vacancies and int(vacancies) > 0:
        vacancies_mr = f"{int(vacancies):,} जागा"
        vacancies_en = f"{int(vacancies):,} Posts"
    else:
        vacancies_mr = "पहा अधिकृत जाहिरात"
        vacancies_en = "Refer Official Gazette"

    app_end = row.get('apply_end_date')
    if app_end:
        try:
            deadline_str = app_end.strftime("%d %b %Y")
        except AttributeError:
            deadline_str = str(app_end)
    else:
        deadline_str = "लवकरच अंतिम मुदत (Check Notification)"

    # Qualifications extraction
    edu_quals = row.get('education_qualifications')
    if not edu_quals:
        ai = row.get('ai_extracted_data') or {}
        edu_quals = ai.get('education_qualifications') or row.get('education_levels') or ai.get('education_levels')

    if isinstance(edu_quals, list) and edu_quals:
        qualification = ", ".join(str(q) for q in edu_quals[:2])
    elif isinstance(edu_quals, str) and edu_quals.strip():
        qualification = edu_quals.strip("[]'\" ")
    else:
        qualification = "१०वी / १२वी / पदवीधर (Check Notification)"

    slug = row.get('slug') or f"{row.get('org_acronym', 'job').lower()}-{row.get('id')}"
    examudaan_url = f"https://examudaan.in/jobs/{slug}"

    return {
        "title_en": title_en,
        "title_mr": title_mr,
        "org_name": org_name,
        "vacancies_mr": vacancies_mr,
        "vacancies_en": vacancies_en,
        "deadline_str": deadline_str,
        "qualification": qualification,
        "examudaan_url": examudaan_url,
    }


def send_telegram_message(text):
    """
    Send formatted message to Telegram Channel via Telegram Bot API.
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment variables.")
        return False

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "disable_web_page_preview": False
    }

    try:
        resp = requests.post(url, json=payload, timeout=15)
        data = resp.json()
        if resp.status_code == 200 and data.get("ok"):
            logger.info("Successfully broadcasted message to Telegram channel!")
            return True
        else:
            logger.error(f"Telegram API error ({resp.status_code}): {data.get('description')}")
            return False
    except Exception as e:
        logger.error(f"Failed to connect to Telegram API: {e}")
        return False


def send_telegram_poll(question, options, correct_option_id, explanation=""):
    """
    Send native interactive Quiz Poll to Telegram channel via /sendPoll API.
    Aspirants can tap to answer directly inside Telegram with instant answer & explanation.
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID for poll.")
        return False

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPoll"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "question": question[:300],
        "options": options[:10],
        "type": "quiz",
        "correct_option_id": int(correct_option_id),
        "is_anonymous": True,
    }

    if explanation:
        payload["explanation"] = explanation[:200]

    try:
        resp = requests.post(url, json=payload, timeout=15)
        data = resp.json()
        if resp.status_code == 200 and data.get("ok"):
            logger.info("Successfully sent Quiz Poll to Telegram channel!")
            return True
        else:
            logger.error(f"Telegram Poll API error ({resp.status_code}): {data.get('description')}")
            return False
    except Exception as e:
        logger.error(f"Failed to connect to Telegram API for poll: {e}")
        return False


def format_daily_digest(jobs, mock_1, mock_2, syllabus_item):
    """
    Formats the complete Bilingual Daily Digest:
    - 2 Latest High-Vacancy Jobs
    - 2 Authentic CBT Mock Tests
    - 1 Syllabus & PYQ Guide
    - Aspirant Utility Tools & Community Links
    """
    today_str = datetime.now().strftime("%d %B %Y")

    # Format Job 1 & Job 2
    jobs_formatted = []
    for idx, j in enumerate(jobs[:2], 1):
        f = extract_common_fields(j)
        emoji = "1️⃣" if idx == 1 else "2️⃣"
        jobs_formatted.append(f"""{emoji} *{f['org_name']}*
💼 *पद / Post:* {f['title_mr']}
👥 *जागा / Vacancies:* {f['vacancies_mr']} ({f['vacancies_en']})
🎓 *पात्रता / Eligibility:* {f['qualification']}
⏰ *अंतिम तारीख / Last Date:* {f['deadline_str']}
👉 *सविस्तर माहिती व अर्ज लिंक:*
{f['examudaan_url']}""")

    jobs_section = "\n\n".join(jobs_formatted)

    return f"""🌅 *ExamUdaan Daily Aspirant Capsule | {today_str}* ⚡
🎯 *नोकरी जाहिराती + मोफत मॉक टेस्ट + अभ्यासक्रम डाऊनलोड*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 *TOP 2 LATEST JOBS (नवीन भरती जाहिराती)*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{jobs_section}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 *2 FREE CBT MOCK TESTS (मोफत सराव चाचण्या)*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ *Test 1: {mock_1['title_mr']}*
⏱️ {mock_1['desc']}
👉 *चाचणी सोडवा:* https://examudaan.in/mock-tests/{mock_1['slug']}

✍️ *Test 2: {mock_2['title_mr']}*
⏱️ {mock_2['desc']}
👉 *चाचणी सोडवा:* https://examudaan.in/mock-tests/{mock_2['slug']}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 *EXAM SYLLABUS & PYQ (अभ्यासक्रम व प्रश्नपत्रिका)*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 *{syllabus_item['name']}*
ℹ️ {syllabus_item['desc']}
👉 *संपूर्ण अभ्यासक्रम व PYQs पहा:*
https://examudaan.in/syllabus/{syllabus_item['slug']}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *मोफत टूल्स व चालू घडामोडी (Free Tools)*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 👮 *पोलीस भरती फिजिकल गुण कॅल्क्युलेटर:*
  https://examudaan.in/police-calculator
• 💰 *7th Pay शासकीय वेतन कॅल्क्युलेटर:*
  https://examudaan.in/salary-calculator
• ⚡ *दैनिक 5-मिनिट क्विज (Daily Streak):*
  https://examudaan.in/daily-quiz

───────────────
📲 *दररोज मोफत WhatsApp अलर्ट्स:*
{WHATSAPP_CHANNEL_URL}

🔵 *Telegram चॅनेल जॉइन करा:*
{TELEGRAM_CHANNEL_URL}

#MaharashtraJobs #MPSC #PoliceBharti #Talathi #ExamUdaan""".strip()


def broadcast_daily_digest(dry_run=False, force=False, send_poll=True):
    """
    Curated Daily Digest Broadcaster:
    - 2 Latest Jobs from DB
    - 2 Mock Tests (1 Full blueprint + 1 Speed drill rotated daily)
    - 1 Syllabus guide (rotated daily)
    - 1 Native Telegram Quiz Poll
    """
    history = load_broadcast_history()
    all_jobs = get_active_notifications(limit=10)

    # Filter for new or unbroadcasted jobs unless force is passed
    if force:
        selected_jobs = all_jobs[:2]
    else:
        unbroadcasted = [j for j in all_jobs if j.get('id') not in history]
        if len(unbroadcasted) >= 2:
            selected_jobs = unbroadcasted[:2]
        elif len(unbroadcasted) == 1:
            selected_jobs = [unbroadcasted[0], all_jobs[0] if all_jobs[0]['id'] != unbroadcasted[0]['id'] else all_jobs[1]]
        else:
            selected_jobs = all_jobs[:2]

    if not selected_jobs:
        logger.info("[DIGEST] No active jobs available to broadcast.")
        return 0, 0

    # Deterministic daily rotation using day of year
    day_idx = datetime.now().timetuple().tm_yday
    mock_1 = CURATED_FULL_MOCKS[day_idx % len(CURATED_FULL_MOCKS)]
    mock_2 = CURATED_SECTIONAL_DRILLS[(day_idx + 1) % len(CURATED_SECTIONAL_DRILLS)]
    syllabus_item = CURATED_SYLLABUS[day_idx % len(CURATED_SYLLABUS)]
    quiz_item = CURATED_QUIZ_POOL[day_idx % len(CURATED_QUIZ_POOL)]

    # Format the Digest text
    digest_text = format_daily_digest(selected_jobs, mock_1, mock_2, syllabus_item)

    # Prepare Quiz Poll payload
    poll_question = f"🧠 प्रश्नमंजुषा (Quiz of the Day) | {quiz_item['subject']}\n\n{quiz_item['question']}"
    poll_options = quiz_item['options']
    poll_correct = quiz_item['correct']
    poll_explanation = quiz_item['explanation']

    sent_count = 0
    fail_count = 0

    if dry_run:
        print("\n" + "=" * 65)
        print("📢 [PREVIEW] TELEGRAM & WHATSAPP DAILY DIGEST (BILINGUAL):")
        print("=" * 65)
        print(digest_text)
        print("\n" + "=" * 65)
        print("🎯 [PREVIEW] TELEGRAM NATIVE QUIZ POLL:")
        print("=" * 65)
        print(f"Question : {poll_question}")
        for i, opt in enumerate(poll_options):
            marker = "✅" if i == poll_correct else "🔘"
            print(f"  {marker} Option {i + 1}: {opt}")
        print(f"Explanation: {poll_explanation}")
        print("=" * 65 + "\n")
        sent_count = 1
    else:
        # 1. Send Main Digest
        ok_msg = send_telegram_message(digest_text)
        if ok_msg:
            sent_count += 1
            time.sleep(2)
        else:
            fail_count += 1

        # 2. Send Interactive Quiz Poll
        if send_poll:
            ok_poll = send_telegram_poll(poll_question, poll_options, poll_correct, poll_explanation)
            if ok_poll:
                sent_count += 1
            else:
                fail_count += 1

        # Mark jobs in history
        for j in selected_jobs:
            if j.get('id'):
                history.add(j['id'])
        save_broadcast_history(history)

    # Save to WhatsApp digest file
    try:
        with open(WHATSAPP_DIGEST_FILE, "w", encoding="utf-8") as f:
            f.write(f"# ExamUdaan Daily WhatsApp Post — {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            f.write(digest_text)
            f.write("\n\n" + ("=" * 50) + "\n\n")
            f.write(f"🧠 आजची प्रश्नमंजुषा (Question of the Day):\n{quiz_item['question']}\n\n")
            for i, opt in enumerate(poll_options, 1):
                f.write(f"{i}. {opt}\n")
            f.write(f"\nउत्तर: {poll_options[poll_correct]}\nस्पष्टीकरण: {poll_explanation}\n")
        logger.info(f"[DIGEST] Saved formatted post to {WHATSAPP_DIGEST_FILE.name}")
    except Exception as e:
        logger.warning(f"Could not write WhatsApp digest file: {e}")

    logger.info(f"[DIGEST COMPLETE] Sent: {sent_count}, Failed: {fail_count}")
    return sent_count, fail_count


def copy_to_clipboard(text):
    """Copy text to Windows clipboard using built-in clip command."""
    if sys.platform == "win32":
        try:
            import subprocess
            subprocess.run("clip", input=text.encode("utf-16"), check=True)
            return True
        except Exception as e:
            logger.warning(f"Could not copy to clipboard: {e}")
    return False


def main():
    parser = argparse.ArgumentParser(description="ExamUdaan Telegram & WhatsApp Daily Digest Broadcaster")
    parser.add_argument("--dry-run", action="store_true", help="Print formatted messages without sending")
    parser.add_argument("--telegram", action="store_true", help="Broadcast to Telegram channel")
    parser.add_argument("--whatsapp", action="store_true", help="Generate WhatsApp post, copy to clipboard")
    parser.add_argument("--force", action="store_true", help="Force broadcast even if already in history")
    parser.add_argument("--skip-poll", action="store_true", help="Skip sending the interactive Telegram Quiz Poll")
    parser.add_argument("--id", type=int, help="Broadcast a specific notification by ID (legacy)")
    parser.add_argument("--limit", type=int, default=2, help="Number of jobs to broadcast (default: 2)")
    args = parser.parse_args()

    logger.info("ExamUdaan Broadcast Alert Engine starting...")

    # WhatsApp Quick Copy Mode
    if args.whatsapp:
        day_idx = datetime.now().timetuple().tm_yday
        mock_1 = CURATED_FULL_MOCKS[day_idx % len(CURATED_FULL_MOCKS)]
        mock_2 = CURATED_SECTIONAL_DRILLS[(day_idx + 1) % len(CURATED_SECTIONAL_DRILLS)]
        syllabus_item = CURATED_SYLLABUS[day_idx % len(CURATED_SYLLABUS)]
        jobs = get_active_notifications(limit=2, specific_id=args.id)
        post_text = format_daily_digest(jobs, mock_1, mock_2, syllabus_item)

        print("\n" + "=" * 60)
        print("📲 WHATSAPP POST READY TO PUBLISH:")
        print("=" * 60)
        print(post_text)
        print("=" * 60)

        copied = copy_to_clipboard(post_text)
        if copied:
            print("\n✅ SUCCESS: Post automatically COPIED to your clipboard!")
            print("👉 Open your WhatsApp Channel and press Ctrl + V to publish.\n")
        else:
            print("\n👉 Highlight and copy the text above, then paste into your WhatsApp Channel.\n")
        return

    # Telegram / Dry Run Mode
    is_dry = args.dry_run or (not args.telegram)
    broadcast_daily_digest(dry_run=is_dry, force=args.force, send_poll=(not args.skip_poll))


if __name__ == "__main__":
    main()
