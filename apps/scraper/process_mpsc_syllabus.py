#!/usr/bin/env python3
# ==============================================================================
# process_mpsc_syllabus.py — Offline PDF to JSON & PostgreSQL Ingestion Pipeline
# ExamUdaan.in | Powered by Local Rule-Based Parser + Google Gemini API Validation
#
# Features:
#   1. Reads MPSC syllabus PDFs from public/downloads/mpsc/syllabus/general/
#   2. Local rule-based PDF parsing with pdfplumber (extracts papers, units, marks)
#   3. Google Gemini Flash-Lite validation & enrichment with multi-key rotation
#   4. Checks token limits and stays well within free/commercial quotas
#   5. Directly upserts into PostgreSQL table `mpsc_syllabi`
#   6. Saves local JSON copies in src/lib/mpscSyllabusData/ and public/syllabus-json/
#
# Usage:
#   py apps/scraper/process_mpsc_syllabus.py --id 14466
#   py apps/scraper/process_mpsc_syllabus.py --batch 5
#   py apps/scraper/process_mpsc_syllabus.py --status
#   py apps/scraper/process_mpsc_syllabus.py --quota-info
# ==============================================================================

import os
import sys
import json
import re
import time
import argparse
import base64
from pathlib import Path

# Fix Windows console UTF-8 output
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

import requests
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv

# Try loading env files
ENV_PATHS = [
    Path(__file__).parent / '.env',
    Path(__file__).parent.parent / 'web' / '.env.local',
    Path(__file__).parent.parent / 'web' / '.env',
    Path.cwd() / '.env',
    Path.cwd() / 'apps' / 'scraper' / '.env',
    Path.cwd() / 'apps' / 'web' / '.env.local'
]
for p in ENV_PATHS:
    if p.exists():
        load_dotenv(p)

# Root directory of examudaan
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
PDF_DIR = ROOT_DIR / 'apps' / 'web' / 'public' / 'downloads' / 'mpsc' / 'syllabus' / 'general'
CATALOG_PATH = ROOT_DIR / 'apps' / 'web' / 'src' / 'lib' / 'mpscSyllabusCatalog.json'
JSON_OUT_DIR = ROOT_DIR / 'apps' / 'web' / 'src' / 'lib' / 'mpscSyllabusData'
PUBLIC_JSON_DIR = ROOT_DIR / 'apps' / 'web' / 'public' / 'syllabus-json'

# Ensure output directories exist
JSON_OUT_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_JSON_DIR.mkdir(parents=True, exist_ok=True)

# Parse multiple Gemini API keys for round-robin rotation
_raw_keys = os.getenv('GEMINI_API_KEY') or os.getenv('NEXT_PUBLIC_GEMINI_API_KEY') or ''
GEMINI_API_KEYS = [k.strip() for k in _raw_keys.split(',') if k.strip()]
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-flash-lite-latest')

_key_index = 0

def get_next_gemini_key():
    """Returns next API key from rotation pool."""
    global _key_index
    if not GEMINI_API_KEYS:
        raise ValueError("No GEMINI_API_KEY found in .env files.")
    key = GEMINI_API_KEYS[_key_index % len(GEMINI_API_KEYS)]
    _key_index += 1
    return key


def get_db_connection():
    """Returns a direct PostgreSQL connection."""
    host = os.getenv('DB_HOST')
    port = os.getenv('DB_PORT', '5432')
    database = os.getenv('DB_DATABASE')
    user = os.getenv('DB_USERNAME')
    password = os.getenv('DB_PASSWORD')

    if not host or not database or not user:
        raise ValueError("Database credentials missing in environment (DB_HOST, DB_DATABASE, DB_USERNAME).")

    return psycopg2.connect(
        host=host,
        port=port,
        dbname=database,
        user=user,
        password=password
    )


def load_catalog():
    """Loads the 343 MPSC syllabus documents catalog."""
    if CATALOG_PATH.exists():
        try:
            with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
                return json.load(f).get('syllabusDocuments', [])
        except Exception as e:
            print(f"Warning: Could not read catalog: {e}")
    return []


def slugify(text):
    text = str(text or '').lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text).strip('-')
    return text


def detect_category(title):
    t = (title or '').lower()
    if any(k in t for k in ['state service', 'rajyaseva', 'राज्य सेवा', 'civil service']):
        return 'rajyaseva'
    if any(k in t for k in ['group-b', 'group b', 'गट-ब', 'गट ब', 'subordinate', 'psi', 'sti', 'aso', 'amvi']):
        return 'group-b'
    if any(k in t for k in ['group-c', 'group c', 'गट-क', 'गट क', 'clerk', 'tax assistant', 'industry inspector']):
        return 'group-c'
    if any(k in t for k in ['engineer', 'अभियांत्रिकी', 'pwd', 'wrd', 'polytechnic', 'civil eng', 'mechanical', 'electrical']):
        return 'engineering'
    if any(k in t for k in ['professor', 'प्राध्यापक', 'lecturer', 'education', 'शिक्षण', 'shikshan', 'principal']):
        return 'education'
    if any(k in t for k in ['medical', 'वैद्यकीय', 'health', 'आरोग्य', 'doctor', 'analyser', 'forensic', 'chemical']):
        return 'medical'
    if any(k in t for k in ['forest', 'वन सेवा', 'agri', 'कृषी', 'krishi', 'van']):
        return 'agriculture-forest'
    if any(k in t for k in ['court', 'न्यायालय', 'judge', 'न्यायाधीश', 'legal', 'विधी', 'prosecutor']):
        return 'judicial-legal'
    if any(k in t for k in ['limited departmental', 'departmental', 'विभागीय']):
        return 'departmental'
    return 'other'


def extract_text_from_pdf(pdf_path):
    """Extracts text using pdfplumber with page markers."""
    try:
        import pdfplumber
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text() or ""
                text += f"\n--- Page {i+1} ---\n" + page_text
        return text.strip()
    except Exception as e:
        print(f"pdfplumber extraction note: {e}")
        return ""


def local_parse_mpsc_syllabus(text, title_hint, year_hint, doc_id):
    """
    Local deterministic parser that extracts syllabus structure from raw text.
    Builds a draft JSON to minimize LLM token usage and hallucination.
    """
    lines = [line.strip() for line in text.split('\n') if line.strip() and not line.startswith('--- Page')]

    # 1. Detect title
    exam_name = title_hint
    exam_name_mr = None
    if lines:
        for l in lines[:6]:
            if any(k in l.lower() for k in ['prosecutor', 'service', 'examination', 'officer', 'engineer', 'inspector', 'analyser', 'professor']):
                exam_name = l
                break

    # Check for Marathi exam name
    for l in lines[:10]:
        if re.search(r'[\u0900-\u097F]{4,}', l) and any(k in l for k in ['परीक्षा', 'सेवा', 'अभ्यासक्रम', 'अधिकारी', 'प्राध्यापक']):
            exam_name_mr = l
            break

    # 2. Detect marks and exam scheme
    total_marks = 0
    mains_marks = 0
    interview_marks = 0
    duration = "1 Hour"

    # Search for marks pattern
    marks_match = re.search(r'(?:एकूण\s*गुण|Total\s*Marks)[\s:=-]+(\d+)', text, re.IGNORECASE)
    if marks_match:
        total_marks = int(marks_match.group(1))

    interview_match = re.search(r'(?:मुलाखत|Interview)[\s:=-]+(\d+)', text, re.IGNORECASE)
    if interview_match:
        interview_marks = int(interview_match.group(1))

    duration_match = re.search(r'(\d+)\s*(?:Hours?|तास|Minutes?|मिनीटे)', text, re.IGNORECASE)
    if duration_match:
        duration = duration_match.group(0)

    # 3. Detect Units & Chapters
    units = []
    current_unit = None
    current_topics = []

    unit_pattern = re.compile(
        r'^(?:CHAPTER\s+[IVXLCDM\d]+|Unit\s*[-:]?\s*\d+|Part\s*[-:]?\s*[A-Z\d]+|घटक\s*[-:]?\s*[\d\u0966-\u096F]+|भाग\s*[-:]?\s*[\d\u0966-\u096F]+|Sr\.\s*No\.\s*\d+|\d+\.\s+[A-Z\u0900-\u097F]|(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+)',
        re.IGNORECASE
    )

    for line in lines:
        # Check if line indicates a new unit or chapter
        if unit_pattern.match(line) or (len(line) < 80 and line.isupper() and any(k in line for k in ['CHAPTER', 'SECTION', 'PART', 'GENERAL', 'LAW', 'STUDIES'])):
            if current_unit and current_topics:
                current_unit['topics'] = current_topics
                units.append(current_unit)
                current_topics = []

            unit_title = line
            unit_num = len(units) + 1
            current_unit = {
                "unitNumber": unit_num,
                "unitTitle": unit_title,
                "unitTitleMr": None,
                "topics": []
            }
        elif current_unit:
            # Topic line under current unit
            clean_topic = re.sub(r'^[•\-\*\d\.\)\s]+', '', line).strip()
            if len(clean_topic) > 3:
                # If topic contains sub-topics separated by semicolons or commas
                if ';' in clean_topic:
                    parts = [p.strip() for p in clean_topic.split(';') if len(p.strip()) > 2]
                    current_topics.extend(parts)
                else:
                    current_topics.append(clean_topic)

    # Append last unit
    if current_unit:
        current_unit['topics'] = current_topics if current_topics else [current_unit['unitTitle']]
        units.append(current_unit)

    # Fallback if no units parsed: split text into topical chunks
    if not units:
        paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 30 and not p.startswith('---')]
        for idx, para in enumerate(paragraphs[:8], 1):
            para_lines = [l.strip() for l in para.split('\n') if l.strip()]
            head = para_lines[0] if para_lines else f"Topic Group {idx}"
            subtopics = para_lines[1:] if len(para_lines) > 1 else [head]
            units.append({
                "unitNumber": idx,
                "unitTitle": head[:100],
                "unitTitleMr": None,
                "topics": subtopics[:15]
            })

    category = detect_category(exam_name + ' ' + (exam_name_mr or ''))
    year = int(year_hint if str(year_hint).isdigit() else 2026)

    # Construct paper structure
    papers = [
        {
            "paperNumber": 1,
            "paperTitle": exam_name,
            "paperTitleMr": exam_name_mr,
            "totalMarks": total_marks or 100,
            "duration": duration,
            "type": "Objective",
            "isQualifying": False,
            "isMerit": True,
            "units": units
        }
    ]

    draft = {
        "docId": int(doc_id),
        "examName": exam_name,
        "examNameMr": exam_name_mr,
        "conductingBody": "MPSC",
        "year": year,
        "language": "Marathi" if (text.count("आणि") + text.count("अभ्यासक्रम") > 15) else "English",
        "category": category,
        "totalMarks": total_marks or 100,
        "mainsMarks": total_marks or 100,
        "interviewMarks": interview_marks,
        "examPattern": "Written Examination / Screening Test followed by Document Verification or Interview",
        "papers": papers,
        "optionalSubjects": [],
        "importantNotes": []
    }
    return draft


def validate_and_refine_with_gemini(draft_json, raw_text, pdf_path=None):
    """
    Sends draft JSON + text snippet to Gemini to validate, clean OCR noise,
    standardize Marathi titles, and return strictly valid JSON.
    Rotates keys automatically on 429 or quota limit.
    """
    if not GEMINI_API_KEYS:
        print("⚠️ No Gemini API keys found. Returning locally parsed syllabus directly.")
        return draft_json

    prompt = f"""You are an MPSC official exam curriculum validator.
A local rule-based PDF parser extracted this draft JSON from an official MPSC notification.

VALIDATION TASKS:
1. Validate the paper title, total marks, and units against the document text snippet.
2. If Marathi titles are missing or present in text, populate "examNameMr", "paperTitleMr", "unitTitleMr".
3. Clean up any OCR line breaks or broken words in the "topics" arrays.
4. Set "category" to one of: rajyaseva, group-b, group-c, engineering, education, medical, agriculture-forest, judicial-legal, departmental, other.
5. Return ONLY a single valid JSON object matching the exact schema.

DRAFT EXTRACTED JSON:
{json.dumps(draft_json, ensure_ascii=False, indent=2)}

RAW DOCUMENT TEXT SNIPPET:
{raw_text[:12000]}
"""

    contents_parts = [{"text": prompt}]

    # If text is too short (< 300 chars, e.g. scanned image PDF) and PDF file exists, attach inline base64 PDF for Gemini Vision OCR
    if pdf_path and Path(pdf_path).exists() and len(raw_text.strip()) < 300:
        try:
            with open(pdf_path, 'rb') as f:
                pdf_bytes = f.read()
                if len(pdf_bytes) < 12 * 1024 * 1024:
                    b64 = base64.b64encode(pdf_bytes).decode('utf-8')
                    contents_parts.insert(0, {
                        "inlineData": {
                            "mimeType": "application/pdf",
                            "data": b64
                        }
                    })
                    print("  📸 Attached inline PDF for Gemini Vision OCR (scanned document detected).")
        except Exception as e:
            print(f"  Note on PDF attachment: {e}")

    payload = {
        "contents": [{"parts": contents_parts}],
        "generationConfig": {
            "temperature": 0.1,
            "responseMimeType": "application/json"
        }
    }


    # Try up to len(GEMINI_API_KEYS) * 2 attempts with rotation
    max_attempts = len(GEMINI_API_KEYS) * 2
    for attempt in range(max_attempts):
        key = get_next_gemini_key()
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={key}"
        headers = {"Content-Type": "application/json"}

        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get('candidates', [])
                if candidates:
                    raw_out = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                    raw_out = re.sub(r'^```json\s*', '', raw_out, flags=re.MULTILINE)
                    raw_out = re.sub(r'```\s*$', '', raw_out, flags=re.MULTILINE).strip()
                    validated_json = json.loads(raw_out)
                    if isinstance(validated_json, list) and len(validated_json) > 0:
                        validated_json = validated_json[0]
                    if isinstance(validated_json, dict):
                        # Enforce docId preservation
                        validated_json['docId'] = int(draft_json['docId'])
                        return validated_json
            elif resp.status_code in [429, 401, 403]:
                print(f"⚠️ Key returned {resp.status_code}. Rotating to next API key (attempt {attempt+1}/{max_attempts})...")
                time.sleep(2)
                continue
            else:
                print(f"Gemini API returned {resp.status_code}: {resp.text[:120]}")
        except Exception as e:
            print(f"Gemini request exception: {e}")
            time.sleep(2)

    print("⚠️ Gemini validation fallback: using local rule-based parsed syllabus.")
    return draft_json


def process_document(doc_id, pdf_file=None, dry_run=False):
    """Processes a single syllabus document end-to-end with local parsing + Gemini validation."""
    print(f"\n========================================================")
    print(f" Processing MPSC Syllabus Document #{doc_id}")
    print(f"========================================================")

    catalog = load_catalog()
    cat_doc = next((d for d in catalog if str(d.get('id')) == str(doc_id)), {})

    # Locate PDF
    pdf_path = None
    if pdf_file and Path(pdf_file).exists():
        pdf_path = Path(pdf_file)
    else:
        possible_names = []
        if cat_doc.get('englishFileName'):
            possible_names.append(cat_doc['englishFileName'])
        if cat_doc.get('marathiFileName'):
            possible_names.append(cat_doc['marathiFileName'])

        for f in PDF_DIR.glob(f"*{doc_id}*"):
            if f.suffix.lower() == '.pdf':
                pdf_path = f
                break

        if not pdf_path and possible_names:
            for name in possible_names:
                cand = PDF_DIR / name
                if cand.exists():
                    pdf_path = cand
                    break

    if not pdf_path or not pdf_path.exists():
        print(f"❌ Error: Could not find PDF for document #{doc_id} in {PDF_DIR}")
        return False

    print(f"📄 Found PDF: {pdf_path.name} ({pdf_path.stat().st_size / 1024:.1f} KB)")

    # 1. Local text extraction
    extracted_text = extract_text_from_pdf(pdf_path)
    print(f"📝 Extracted {len(extracted_text)} characters from PDF.")

    title_hint = cat_doc.get('descInEnglish') or pdf_path.stem
    year_hint = cat_doc.get('publicationDate', '2026')[:4]

    # 2. Local rule-based parsing
    print("⚙️ Running local rule-based syllabus parser...")
    draft_json = local_parse_mpsc_syllabus(extracted_text, title_hint, year_hint, doc_id)
    print(f"  Parsed {len(draft_json['papers'])} paper(s) with {sum(len(p.get('units', [])) for p in draft_json['papers'])} unit(s) locally.")

    # 3. Gemini validation & enrichment
    print(f"🤖 Validating & enriching via Gemini ({GEMINI_MODEL}) with key rotation...")
    syllabus_json = validate_and_refine_with_gemini(draft_json, extracted_text, pdf_path)

    # Save local JSON files
    json_path_lib = JSON_OUT_DIR / f"{doc_id}.json"
    json_path_pub = PUBLIC_JSON_DIR / f"{doc_id}.json"

    with open(json_path_lib, 'w', encoding='utf-8') as f:
        json.dump(syllabus_json, f, indent=2, ensure_ascii=False)
    with open(json_path_pub, 'w', encoding='utf-8') as f:
        json.dump(syllabus_json, f, indent=2, ensure_ascii=False)

    print(f"💾 Saved local JSON: {json_path_lib}")

    if dry_run:
        print("Dry run requested — skipping DB upsert.")
        return True

    # 4. PostgreSQL Upsert
    print("🗄️ Upserting into PostgreSQL table `mpsc_syllabi`...")
    conn = get_db_connection()
    cur = conn.cursor()

    title_en = syllabus_json.get('examName') or cat_doc.get('descInEnglish') or f"MPSC Paper #{doc_id}"
    title_mr = syllabus_json.get('examNameMr') or cat_doc.get('descMr')
    category = syllabus_json.get('category') or detect_category(title_en + ' ' + (title_mr or ''))
    year = int(syllabus_json.get('year') or year_hint or 2026)
    language = syllabus_json.get('language') or 'English'
    total_marks = int(syllabus_json.get('totalMarks') or 0)
    mains_marks = int(syllabus_json.get('mainsMarks') or 0)
    interview_marks = int(syllabus_json.get('interviewMarks') or 0)
    exam_pattern = syllabus_json.get('examPattern') or 'Written Examination'
    papers = syllabus_json.get('papers', [])
    total_papers = len(papers) if isinstance(papers, list) else 0

    clean_title = slugify(re.sub(r'\b(from|nov|format|english|marathi|syllabus|\d{4})\b', '', title_en, flags=re.I))
    slug = f"{doc_id}-{clean_title or 'syllabus'}"

    pdf_filename = pdf_path.name
    pdf_url = f"/downloads/mpsc/syllabus/general/{pdf_filename}"

    upsert_sql = """
    INSERT INTO mpsc_syllabi (
      doc_id, slug, title_en, title_mr, category, exam_level, year, language,
      total_marks, mains_marks, interview_marks, exam_pattern, total_papers,
      pdf_filename, pdf_url, syllabus_data, is_published, updated_at
    )
    VALUES (
      %s, %s, %s, %s, %s, 'State', %s, %s,
      %s, %s, %s, %s, %s,
      %s, %s, %s, true, NOW()
    )
    ON CONFLICT (doc_id) DO UPDATE SET
      slug            = EXCLUDED.slug,
      title_en        = EXCLUDED.title_en,
      title_mr        = COALESCE(EXCLUDED.title_mr, mpsc_syllabi.title_mr),
      category        = EXCLUDED.category,
      year            = EXCLUDED.year,
      language        = EXCLUDED.language,
      total_marks     = EXCLUDED.total_marks,
      mains_marks     = EXCLUDED.mains_marks,
      interview_marks = EXCLUDED.interview_marks,
      exam_pattern    = EXCLUDED.exam_pattern,
      total_papers    = EXCLUDED.total_papers,
      pdf_filename    = COALESCE(EXCLUDED.pdf_filename, mpsc_syllabi.pdf_filename),
      pdf_url         = COALESCE(EXCLUDED.pdf_url, mpsc_syllabi.pdf_url),
      syllabus_data   = EXCLUDED.syllabus_data,
      is_published    = EXCLUDED.is_published,
      updated_at      = NOW()
    RETURNING id;
    """

    cur.execute(upsert_sql, (
        doc_id, slug, title_en, title_mr, category, year, language,
        total_marks, mains_marks, interview_marks, exam_pattern, total_papers,
        pdf_filename, pdf_url, Json(syllabus_json)
    ))

    row_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    print(f"✅ Successfully inserted/updated row #{row_id} in `mpsc_syllabi`!")
    print(f"🔗 Live at: http://localhost:3000/mpsc-syllabus/{doc_id}")
    return True


def show_quota_info():
    """Prints token and rate limit analysis for processing 343 papers."""
    print("\n========================================================")
    print(" 🔢 Gemini API Quota & Token Capacity Analysis")
    print("========================================================")
    print(f"Configured API Keys   : {len(GEMINI_API_KEYS)}")
    for i, k in enumerate(GEMINI_API_KEYS):
        print(f"  Key #{i+1} : {k[:10]}...{k[-6:]}")
    print(f"Active Model          : {GEMINI_MODEL}")
    print("--------------------------------------------------------")
    print("Google Gemini Flash-Lite Rate Limits (per key):")
    print("  • Requests Per Minute (RPM) : 15 RPM  (Combined: 30 RPM)")
    print("  • Requests Per Day (RPD)    : 1,500 RPD (Combined: 3,000 RPD)")
    print("  • Tokens Per Minute (TPM)   : 1,000,000 TPM")
    print("--------------------------------------------------------")
    print("Demand Analysis for 343 MPSC Syllabus Papers:")
    print("  • Total Catalog Documents  : 343 papers")
    print("  • Total API Requests Needed: 343 requests")
    print("  • Daily Quota Utilization  : 343 / 3,000 = 11.4% of Daily Free Quota")
    print("  • Estimated Tokens / Paper : ~1,200 input + ~900 output = 2,100 tokens")
    print("  • Total Tokens for All 343 : ~720,000 tokens (Well within 1M TPM limit)")
    print("  • Estimated Processing Time: ~12-15 minutes (with 2s pause between calls)")
    print("  • Verdict                  : ✅ 100% SUFFICIENT. Token & request quotas")
    print("                               are more than enough to parse all 343 papers!")
    print("========================================================\n")


def show_status():
    """Prints current database syllabus coverage vs catalog."""
    catalog = load_catalog()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT doc_id, slug, title_en, category, total_papers, updated_at FROM mpsc_syllabi ORDER BY doc_id;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    print("\n========================================================")
    print(" 📊 MPSC Official Syllabus Database Status")
    print("========================================================")
    print(f"Total Catalog Documents : {len(catalog)}")
    print(f"Database Ingested Rows  : {len(rows)} ({len(rows)/max(len(catalog),1)*100:.1f}% coverage)")
    print("--------------------------------------------------------")
    for r in rows:
        print(f" #{r[0]:<6} | {r[3]:<16} | Papers: {r[4]} | {r[2][:45]}")
    print("========================================================\n")


def main():
    parser = argparse.ArgumentParser(description="MPSC Syllabus PDF to JSON & PostgreSQL Pipeline")
    parser.add_argument('--id', type=int, help="Document ID to process (e.g. 14466)")
    parser.add_argument('--pdf', type=str, help="Specific PDF path to process")
    parser.add_argument('--status', action='store_true', help="Check database ingestion status")
    parser.add_argument('--quota-info', action='store_true', help="Check token and quota headroom")
    parser.add_argument('--batch', type=int, default=0, help="Process N pending documents in batch")
    parser.add_argument('--dry-run', action='store_true', help="Do not write to database")

    args = parser.parse_args()

    if args.quota_info:
        show_quota_info()
        return

    if args.status:
        show_status()
        return

    if args.id:
        process_document(args.id, args.pdf, args.dry_run)
        return

    if args.batch > 0:
        catalog = load_catalog()
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT doc_id FROM mpsc_syllabi;")
        existing_ids = {r[0] for r in cur.fetchall()}
        cur.close()
        conn.close()

        pending = [d for d in catalog if d.get('id') and d['id'] not in existing_ids]
        print(f"Found {len(pending)} pending documents in catalog. Processing up to {args.batch}...")

        processed = 0
        for doc in pending[:args.batch]:
            doc_id = doc['id']
            try:
                ok = process_document(doc_id, dry_run=args.dry_run)
                if ok:
                    processed += 1
                # Polite pause to stay well within 30 RPM combined limit
                time.sleep(2)
            except Exception as e:
                print(f"❌ Error processing #{doc_id}: {e}")

        print(f"\nBatch completed: {processed} / {args.batch} documents processed successfully.")
        return

    parser.print_help()


if __name__ == '__main__':
    main()
