"""
extract_syllabus_pdf.py -- MPSC Syllabus PDF -> Structured JSON via Gemini
Usage:
  python extract_syllabus_pdf.py --file 1181
  python extract_syllabus_pdf.py --pdf "full/path/to/file.pdf"
"""

import os, sys, json, argparse, pathlib
import pdfplumber
from dotenv import load_dotenv
from google import genai

SCRIPT_DIR = pathlib.Path(__file__).parent  # apps/scraper/
load_dotenv(SCRIPT_DIR / ".env")

_raw_keys = os.environ.get("GEMINI_API_KEY", "")
GEMINI_API_KEYS = [k.strip() for k in _raw_keys.split(",") if k.strip()]
if not GEMINI_API_KEYS:
    print("ERROR: GEMINI_API_KEY missing in .env"); sys.exit(1)

client = genai.Client(api_key=GEMINI_API_KEYS[0])
MODEL  = "gemini-flash-lite-latest"

# REPO_ROOT = examudaan/  (SCRIPT_DIR is apps/scraper/, parent is apps/, parent.parent is examudaan/)
REPO_ROOT    = SCRIPT_DIR.parent.parent
WEB_ROOT     = REPO_ROOT / "apps" / "web"
PUBLIC_OUT   = WEB_ROOT / "public" / "dev" / "syllabus-json"
LIB_OUT      = WEB_ROOT / "src" / "lib" / "mpscSyllabusData"
SYLLABUS_DIR = WEB_ROOT / "public" / "downloads" / "mpsc" / "syllabus" / "general"
PUBLIC_OUT.mkdir(parents=True, exist_ok=True)
LIB_OUT.mkdir(parents=True, exist_ok=True)

SCHEMA = '''{
  "examName": "full official name in English",
  "examNameMr": "Marathi name or null",
  "conductingBody": "MPSC",
  "year": 2020,
  "language": "English",
  "officialDocId": "1181",
  "totalMarks": 0,
  "mainsMarks": 0,
  "interviewMarks": 0,
  "examPattern": "one-line summary",
  "papers": [
    {
      "paperNumber": 1,
      "paperTitle": "string",
      "paperTitleMr": "string or null",
      "totalMarks": 250,
      "duration": "3 hours",
      "type": "Descriptive | Objective | Qualifying",
      "isQualifying": false,
      "isMerit": true,
      "units": [
        {
          "unitNumber": 1,
          "unitTitle": "string",
          "unitTitleMr": "string or null",
          "topics": ["topic1", "topic2"]
        }
      ]
    }
  ],
  "qualifyingPapers": ["Marathi", "English"],
  "optionalSubjects": [
    { "name": "History", "nameMr": "??????????", "pdfUrl": null }
  ],
  "importantNotes": ["string"],
  "sourceFile": "filename.pdf"
}'''

def extract_text(pdf_path):
    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        print(f"  Pages: {len(pdf.pages)}")
        for i, page in enumerate(pdf.pages):
            t = page.extract_text()
            if t:
                pages.append(f"--- Page {i+1} ---\n{t.strip()}")
    return "\n\n".join(pages)

def call_gemini(raw_text, pdf_filename, doc_id):
    text = raw_text[:45000]  # gemini-2.5-flash handles more tokens
    prompt = f"""You are parsing an official MPSC (Maharashtra Public Service Commission) syllabus PDF.
Extract EVERY paper, EVERY unit, EVERY topic. Do NOT truncate or summarize.
Return ONLY valid JSON (no markdown fences) matching this schema exactly:

{SCHEMA}

File: {pdf_filename}  |  Doc ID: {doc_id}

PDF TEXT:
{text}

Return ONLY the JSON object, no markdown, no explanation."""

    print(f"  Calling {MODEL}...")
    resp = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config={"temperature": 0.1, "max_output_tokens": 16384}
    )
    raw = resp.text.strip()
    if raw.startswith("`"):
        lines = raw.split("\n")
        raw = "\n".join(lines[1:-1] if lines[-1].strip() == "`" else lines[1:])
    return json.loads(raw)

def process(pdf_path, doc_id):
    print(f"\n{'='*55}")
    print(f"File: {pdf_path.name}")
    print(f"ID  : {doc_id}")
    print(f"REPO: {REPO_ROOT}")
    print(f"{'='*55}")
    print("\n[1] Extracting PDF text...")
    raw = extract_text(pdf_path)
    print(f"  Got {len(raw):,} chars")
    print("\n[2] Gemini extraction...")
    data = call_gemini(raw, pdf_path.name, doc_id)
    data["officialDocId"] = doc_id
    data["sourceFile"] = pdf_path.name
    data["pdfPublicPath"] = f"/downloads/mpsc/syllabus/general/{pdf_path.name}"
    out = f"{doc_id}.json"
    (PUBLIC_OUT / out).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    (LIB_OUT / out).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n[3] Saved:")
    print(f"  {PUBLIC_OUT / out}")
    print(f"  {LIB_OUT / out}")
    papers = data.get("papers", [])
    print(f"\nPapers: {len(papers)}")
    for p in papers:
        units = len(p.get("units", []))
        topics = sum(len(u.get("topics", [])) for u in p.get("units", []))
        print(f"  P{p.get('paperNumber','')} {p.get('paperTitle','?')} | {p.get('totalMarks','?')}M | {units}u | {topics}t")
    print(f"\nJSON : http://localhost:3000/dev/syllabus-json/{doc_id}.json")
    print(f"Page : http://localhost:3000/dev/syllabus-preview/{doc_id}")
    return data

def find_pdf(doc_id):
    for f in SYLLABUS_DIR.iterdir():
        if f.suffix.lower() == ".pdf" and (f.name.startswith(doc_id + "_") or f.name.startswith(doc_id + " ")):
            return f
    return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", "-f", type=str)
    ap.add_argument("--pdf", type=str)
    args = ap.parse_args()
    if args.pdf:
        pdf_path = pathlib.Path(args.pdf)
        doc_id = pdf_path.stem.split("_")[0].split(" ")[0]
    elif args.file:
        doc_id = args.file
        pdf_path = find_pdf(doc_id)
        if not pdf_path:
            print(f"ERROR: No PDF for ID '{doc_id}' in {SYLLABUS_DIR}"); sys.exit(1)
    else:
        ap.print_help(); sys.exit(1)
    if not pdf_path.exists():
        print(f"ERROR: Not found: {pdf_path}"); sys.exit(1)
    process(pdf_path, doc_id)

if __name__ == "__main__":
    main()
