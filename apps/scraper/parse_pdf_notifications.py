"""
parse_pdf_notifications.py
===========================
Gemini Vision-based PDF Parser for ExamUdaan Notifications

Fetches government notification PDFs and uses Gemini Vision API
to extract structured data (vacancies, dates, age limits, qualifications,
pay scale) from PDF page screenshots.

This significantly improves data quality for notifications where
the HTML page was incomplete or the data lives inside a PDF table.

HOW IT WORKS:
1. Queries DB for rows where notification_pdf IS NOT NULL
   AND key fields (total_vacancies, apply_end_date, etc.) are still NULL
2. Downloads PDF (max 5MB)
3. Converts first 2 pages to PNG images using pdf2image (poppler)
4. Sends image + structured prompt to Gemini Vision API
5. Extracts structured JSON with all key notification fields
6. Updates the DB record with extracted data

REQUIREMENTS:
    pip install pdf2image Pillow requests psycopg2-binary python-dotenv google-generativeai
    poppler must be installed: 
        Linux: apt-get install poppler-utils
        Windows: download from https://github.com/oschwartz10612/poppler-windows

RUN:
    python parse_pdf_notifications.py               -- process 50 PDFs
    python parse_pdf_notifications.py --limit 100   -- process 100 PDFs
    python parse_pdf_notifications.py --id 514      -- process single notification by ID
    python parse_pdf_notifications.py --dry-run     -- show what would be processed, don't update DB
"""

import os
import re
import json
import time
import logging
import argparse
import tempfile
import hashlib
from io import BytesIO
from typing import Optional, Dict, Any, List

import requests
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

# Try to import pdf2image (optional — falls back to text-only Gemini)
try:
    from pdf2image import convert_from_bytes
    from PIL import Image
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False
    print("[WARN] pdf2image/Pillow not installed. Using text extraction only.")

# Try to import google.genai SDK
try:
    from google import genai
    from google.genai import types as genai_types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    print("[WARN] google-generativeai not installed.")

load_dotenv()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger("pdf-parser")


# ── Config ─────────────────────────────────────────────────────
DATABASE_URL  = os.getenv("DATABASE_URL")
_raw_keys     = os.getenv("GEMINI_API_KEY", "")
GEMINI_KEYS   = [k.strip() for k in _raw_keys.split(",") if k.strip()]
MODEL_NAME    = os.getenv("GEMINI_PDF_MODEL", "gemini-2.0-flash-lite")
MAX_PDF_SIZE  = 5 * 1024 * 1024   # 5 MB
MAX_PAGES     = 3                  # Convert max 3 pages to images
REQUEST_TIMEOUT = 15               # seconds for PDF download
REQUEST_DELAY   = 1.5             # delay between Gemini calls
_key_index = 0


def get_api_key():
    global _key_index
    if not GEMINI_KEYS:
        return None
    return GEMINI_KEYS[_key_index % len(GEMINI_KEYS)]

def rotate_key():
    global _key_index
    _key_index = (_key_index + 1) % len(GEMINI_KEYS)
    logger.warning("Rotated Gemini API key → index %d", _key_index)


# ── Gemini Vision Prompt ───────────────────────────────────────
VISION_PROMPT = """
You are analyzing a Government of India or Maharashtra government official job/exam notification PDF.
The images show the first few pages of this notification.

Extract the following fields as JSON. Be precise — use exactly what the document states.
If a field is not found, use null. Never guess or invent data.

{
  "advt_no": "Advertisement number (e.g. 01/2026)",
  "total_vacancies": integer_or_null,
  "post_details": [
    {"post_name": "...", "vacancies": integer_or_null, "category": "UR/OBC/SC/ST or null"}
  ],
  "age_limit": {
    "min_age": integer_or_null,
    "max_age": integer_or_null,
    "max_age_open": integer_or_null,
    "max_age_obc": integer_or_null,
    "max_age_sc_st": integer_or_null,
    "age_relaxation_note": "string or null"
  },
  "qualifications": ["list", "of", "required", "qualifications"],
  "important_dates": {
    "apply_start": "YYYY-MM-DD or null",
    "apply_end": "YYYY-MM-DD or null",
    "exam_date": "YYYY-MM-DD or null",
    "interview_date": "YYYY-MM-DD or null",
    "result_date": "YYYY-MM-DD or null"
  },
  "pay_scale": {
    "pay_band": "pay band string or null",
    "grade_pay": integer_or_null,
    "monthly_salary": integer_or_null,
    "salary_note": "string or null"
  },
  "application_fee": {
    "general_fee": integer_or_null,
    "sc_st_fee": integer_or_null,
    "women_fee": integer_or_null,
    "pwd_fee": integer_or_null
  },
  "selection_process": ["Written Exam", "Interview", etc.],
  "is_walk_in": boolean,
  "exam_cities": ["city1", "city2"],
  "notification_type": "recruitment|result|admit_card|answer_key|syllabus"
}

Return ONLY the JSON object. No markdown code blocks, no explanations.
"""


# ── DB connection ───────────────────────────────────────────────
def get_conn():
    if DATABASE_URL:
        return psycopg2.connect(DATABASE_URL)
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        dbname=os.getenv("DB_DATABASE"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
    )


# ── Fetch rows that need PDF parsing ───────────────────────────
def get_rows_to_parse(limit: int, specific_id: Optional[int] = None) -> List[Dict]:
    """
    Get notifications where:
    - notification_pdf IS NOT NULL (has a PDF link)
    - (total_vacancies IS NULL OR apply_end_date IS NULL)  — key data missing
    - pdf_parsed_at IS NULL  — not yet parsed
    - status = 'published'
    """
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            if specific_id:
                cur.execute("""
                    SELECT id, title, notification_pdf, source_url,
                           total_vacancies, apply_end_date, apply_start_date,
                           exam_date, qualifications, age_limit
                    FROM exam_notifications
                    WHERE id = %s AND notification_pdf IS NOT NULL
                """, (specific_id,))
            else:
                cur.execute("""
                    SELECT id, title, notification_pdf, source_url,
                           total_vacancies, apply_end_date, apply_start_date,
                           exam_date, qualifications, age_limit
                    FROM exam_notifications
                    WHERE notification_pdf IS NOT NULL
                      AND status = 'published'
                      AND (total_vacancies IS NULL OR apply_end_date IS NULL)
                      AND (pdf_parsed_at IS NULL OR pdf_parsed_at < NOW() - INTERVAL '7 days')
                    ORDER BY published_at DESC NULLS LAST
                    LIMIT %s
                """, (limit,))
            return [dict(row) for row in cur.fetchall()]
    finally:
        conn.close()


# ── Download PDF ───────────────────────────────────────────────
def download_pdf(url: str) -> Optional[bytes]:
    """Download PDF, respecting size limit. Returns bytes or None."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; ExamUdaanBot/1.0; PDF-parser)",
            "Accept": "application/pdf,*/*",
        }
        resp = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT,
                           stream=True)
        resp.raise_for_status()

        # Check size
        content_length = resp.headers.get("Content-Length")
        if content_length and int(content_length) > MAX_PDF_SIZE:
            logger.warning("PDF too large (%s bytes): %s", content_length, url)
            return None

        # Stream with size cap
        chunks = []
        total = 0
        for chunk in resp.iter_content(chunk_size=65536):
            total += len(chunk)
            if total > MAX_PDF_SIZE:
                logger.warning("PDF exceeded %dMB limit: %s", MAX_PDF_SIZE // 1024 // 1024, url)
                return None
            chunks.append(chunk)

        return b"".join(chunks)

    except Exception as e:
        logger.warning("PDF download failed (%s): %s", type(e).__name__, url)
        return None


# ── Convert PDF to images ──────────────────────────────────────
def pdf_to_images(pdf_bytes: bytes) -> List[bytes]:
    """
    Convert first MAX_PAGES pages of PDF to PNG image bytes.
    Returns list of PNG bytes (empty list if pdf2image not available).
    """
    if not PDF2IMAGE_AVAILABLE:
        return []

    try:
        images = convert_from_bytes(
            pdf_bytes,
            first_page=1,
            last_page=MAX_PAGES,
            dpi=120,              # Lower DPI to reduce image size but keep readable
            fmt="png",
        )
        result = []
        for img in images:
            # Resize if too wide (keep aspect ratio)
            if img.width > 1400:
                ratio = 1400 / img.width
                img = img.resize(
                    (1400, int(img.height * ratio)),
                    Image.LANCZOS
                )
            buf = BytesIO()
            img.save(buf, format="PNG", optimize=True)
            result.append(buf.getvalue())
        return result

    except Exception as e:
        logger.warning("pdf2image conversion failed: %s", e)
        return []


# ── Call Gemini Vision ─────────────────────────────────────────
def call_gemini_vision(images: List[bytes], title: str, max_retries: int = 3) -> Optional[Dict]:
    """
    Send PDF page images + title to Gemini Vision for structured extraction.
    Returns parsed dict or None.
    """
    api_key = get_api_key()
    if not api_key:
        logger.warning("No Gemini API key available")
        return None

    if not GENAI_AVAILABLE:
        logger.warning("google-generativeai not installed")
        return None

    # Build prompt with title context
    prompt_with_context = f"""
Notification Title: {title}

{VISION_PROMPT}
"""

    for attempt in range(max_retries):
        try:
            client = genai.Client(api_key=api_key)

            # Build content parts: images + text prompt
            parts = []
            for img_bytes in images:
                parts.append(
                    genai_types.Part.from_bytes(
                        data=img_bytes,
                        mime_type="image/png"
                    )
                )
            parts.append(genai_types.Part.from_text(text=prompt_with_context))

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=[genai_types.Content(parts=parts, role="user")],
                config=genai_types.GenerateContentConfig(
                    response_mime_type="application/json",
                )
            )

            if not response.text:
                raise ValueError("Empty Gemini response")

            # Parse JSON
            result = json.loads(response.text)
            return result

        except Exception as exc:
            err = str(exc).lower()
            if "429" in err or "quota" in err or "rate" in err:
                rotate_key()
                wait = 2 ** attempt + 1
                logger.warning("Rate limited. Rotating key, waiting %ds.", wait)
                time.sleep(wait)
            elif attempt < max_retries - 1:
                logger.warning("Gemini call failed (attempt %d): %s", attempt + 1, exc)
                time.sleep(2)
            else:
                logger.error("Gemini failed after %d retries: %s", max_retries, exc)

    return None


# ── Parse date string to ISO ───────────────────────────────────
def _safe_date(val: Any) -> Optional[str]:
    """Convert various date formats to YYYY-MM-DD string."""
    if not val or str(val).strip().lower() in ("null", "none", "tba", "tbd", ""):
        return None
    s = str(val).strip()
    # Already ISO
    m = re.match(r"^(\d{4})-(\d{1,2})-(\d{1,2})$", s)
    if m:
        return f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"
    # DD/MM/YYYY
    m = re.match(r"^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$", s)
    if m:
        return f"{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
    return None


# ── Update DB with extracted data ─────────────────────────────
def update_notification(conn, row_id: int, data: Dict) -> bool:
    """
    Update exam_notifications row with Gemini-extracted PDF data.
    Only updates fields that are currently NULL (safe merge — never overwrites).
    """
    updates = {}

    # Vacancies — only update if currently null
    if data.get("total_vacancies") and isinstance(data["total_vacancies"], int):
        updates["total_vacancies"] = data["total_vacancies"]

    # Dates
    dates = data.get("important_dates") or {}
    apply_start = _safe_date(dates.get("apply_start"))
    apply_end   = _safe_date(dates.get("apply_end"))
    exam_date   = _safe_date(dates.get("exam_date") or dates.get("interview_date"))

    if apply_start: updates["apply_start_date"] = apply_start
    if apply_end:   updates["apply_end_date"]   = apply_end
    if exam_date:   updates["exam_date"]         = exam_date

    # Advt number
    if data.get("advt_no"):
        updates["advt_no"] = str(data["advt_no"])[:100]

    # Age limit JSONB
    age = data.get("age_limit")
    if age and isinstance(age, dict):
        age_clean = {k: v for k, v in age.items() if v is not None}
        if age_clean:
            updates["age_limit"] = json.dumps(age_clean)

    # Qualifications JSONB
    quals = data.get("qualifications")
    if quals and isinstance(quals, list) and len(quals) > 0:
        updates["qualifications"] = json.dumps({"mandatory": quals})

    # Pay scale — store in salary JSONB
    pay = data.get("pay_scale")
    if pay and isinstance(pay, dict):
        pay_clean = {k: v for k, v in pay.items() if v is not None}
        if pay_clean:
            updates["salary"] = json.dumps(pay_clean)
        if pay.get("monthly_salary"):
            updates["salary_min"] = int(pay["monthly_salary"])

    # Application fee JSONB
    fee = data.get("application_fee")
    if fee and isinstance(fee, dict):
        fee_clean = {k: v for k, v in fee.items() if v is not None}
        if fee_clean:
            updates["application_fee"] = json.dumps(fee_clean)

    # Walk-in flag
    if data.get("is_walk_in") is True:
        updates["is_walk_in"] = True

    # Selection process
    sel = data.get("selection_process")
    if sel and isinstance(sel, list):
        updates["selection_process"] = json.dumps(sel)

    # Exam cities
    cities = data.get("exam_cities")
    if cities and isinstance(cities, list):
        updates["exam_cities"] = cities  # TEXT[] column

    # Mark as parsed
    updates["pdf_parsed_at"] = "NOW()"

    if not updates:
        logger.info("No new data extracted for ID %d", row_id)
        return False

    # Build SQL — only update NULL columns (safe merge)
    set_clauses = []
    params = []

    for col, val in updates.items():
        if col == "pdf_parsed_at":
            set_clauses.append(f"{col} = NOW()")
        elif col == "exam_cities":
            # Array column
            set_clauses.append(f"{col} = COALESCE({col}, %s::text[])")
            params.append(val)
        elif col in ("age_limit", "qualifications", "salary", "application_fee", "selection_process"):
            # JSONB — only update if currently null
            set_clauses.append(f"{col} = COALESCE({col}, %s::jsonb)")
            params.append(val)
        elif col in ("apply_start_date", "apply_end_date", "exam_date"):
            # Date columns
            set_clauses.append(f"{col} = COALESCE({col}, %s::date)")
            params.append(val)
        elif col == "is_walk_in":
            # Boolean — only set to TRUE, never overwrite TRUE with FALSE
            set_clauses.append(f"{col} = COALESCE(NULLIF({col}, FALSE), %s)")
            params.append(val)
        else:
            # Text/int — only update if currently null
            set_clauses.append(f"{col} = COALESCE({col}, %s)")
            params.append(val)

    params.append(row_id)
    sql = f"UPDATE exam_notifications SET {', '.join(set_clauses)} WHERE id = %s"

    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        logger.error("DB update failed for ID %d: %s", row_id, e)
        return False


# ── Main loop ──────────────────────────────────────────────────
def main(limit: int, specific_id: Optional[int], dry_run: bool):
    logger.info("=== ExamUdaan PDF Parser — Gemini Vision ===")
    logger.info("Mode: %s | Limit: %d | pdf2image: %s | Gemini: %s",
                "DRY-RUN" if dry_run else "LIVE",
                limit,
                "✅" if PDF2IMAGE_AVAILABLE else "❌",
                "✅" if GENAI_AVAILABLE and GEMINI_KEYS else "❌")

    rows = get_rows_to_parse(limit, specific_id)
    logger.info("Found %d notifications to parse", len(rows))

    if not rows:
        logger.info("Nothing to parse. All notifications have complete data.")
        return

    if dry_run:
        for row in rows:
            print(f"  [DRY] ID={row['id']} | {row['title'][:80]}")
            print(f"        PDF: {row['notification_pdf']}")
        return

    conn = get_conn()
    success_count = 0
    fail_count = 0

    try:
        for i, row in enumerate(rows):
            row_id = row["id"]
            title  = row["title"] or ""
            pdf_url = row["notification_pdf"]

            logger.info("[%d/%d] Processing ID=%d: %s", i + 1, len(rows), row_id, title[:60])

            # Step 1: Download PDF
            pdf_bytes = download_pdf(pdf_url)
            if not pdf_bytes:
                logger.warning("  → Skipping (download failed): %s", pdf_url)
                fail_count += 1
                continue

            logger.info("  → Downloaded %d bytes", len(pdf_bytes))

            # Step 2: Convert to images
            images = pdf_to_images(pdf_bytes)
            if images:
                logger.info("  → Converted to %d page images", len(images))
            else:
                logger.info("  → No images (pdf2image unavailable) — text-only mode")

            # Step 3: Call Gemini Vision
            extracted = call_gemini_vision(images, title)

            if not extracted:
                logger.warning("  → Gemini extraction failed for ID=%d", row_id)
                fail_count += 1
                time.sleep(REQUEST_DELAY)
                continue

            logger.info("  → Extracted: vacancies=%s, apply_end=%s, is_walk_in=%s",
                       extracted.get("total_vacancies"),
                       extracted.get("important_dates", {}).get("apply_end"),
                       extracted.get("is_walk_in"))

            # Step 4: Update DB
            updated = update_notification(conn, row_id, extracted)
            if updated:
                success_count += 1
                logger.info("  → DB updated ✅")
            else:
                logger.info("  → No new data to update")
                fail_count += 1

            time.sleep(REQUEST_DELAY)

    finally:
        conn.close()

    logger.info("=== Done: %d updated, %d failed ===", success_count, fail_count)


# ── CLI ────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ExamUdaan Gemini Vision PDF Parser")
    parser.add_argument("--limit", type=int, default=50,
                        help="Number of PDFs to process (default: 50)")
    parser.add_argument("--id", type=int, default=None,
                        help="Process only this specific notification ID")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show what would be processed without making changes")
    args = parser.parse_args()

    main(limit=args.limit, specific_id=args.id, dry_run=args.dry_run)
