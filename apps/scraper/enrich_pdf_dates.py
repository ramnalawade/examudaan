"""
enrich_pdf_dates.py
====================
Enriches exam_notifications records that have a PDF URL but missing dates.

The MPPSC and many other state PSC PDFs are scanned (image-only) -- pdfplumber
returns 0 chars. This script uses Gemini vision API (inline PDF as base64)
to extract the important dates table from any PDF, including scanned ones.

Usage:
    python enrich_pdf_dates.py              # process up to 20 records
    python enrich_pdf_dates.py --id 10072   # single record
    python enrich_pdf_dates.py --dry-run    # no DB writes
    python enrich_pdf_dates.py --limit 50   # custom batch size
"""

import os, sys, re, json, time, logging, argparse, requests
import psycopg2, psycopg2.extras
from typing import Optional
from datetime import date
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

# ---- Config -----------------------------------------------------------------

_raw_keys = os.environ.get("GEMINI_API_KEY", "")
KEYS = [k.strip() for k in _raw_keys.split(",") if k.strip()]
if not KEYS:
    raise RuntimeError("GEMINI_API_KEY missing in .env")

MODEL         = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")
DATABASE_URL  = os.getenv("DATABASE_URL")
DEFAULT_LIMIT = 20
MAX_PDF_BYTES = 15 * 1024 * 1024  # 15 MB
REQUEST_DELAY = 1.5               # seconds between records

# ---- Logging ----------------------------------------------------------------

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s | %(levelname)s | %(message)s")
log = logging.getLogger("enrich-pdf-dates")

# ---- Gemini key rotation ----------------------------------------------------

_ki = 0

def get_client():
    return genai.Client(api_key=KEYS[_ki % len(KEYS)])

def rotate_key(reason=""):
    global _ki
    _ki = (_ki + 1) % len(KEYS)
    log.warning("Rotating key -> index %d  (%s)", _ki, reason)

# ---- Date utilities ---------------------------------------------------------

_ISO_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

def _is_valid_date(s):
    if not s or s == "null":
        return False
    if not _ISO_RE.match(str(s).strip()):
        return False
    try:
        parts = str(s).strip().split("-")
        date(int(parts[0]), int(parts[1]), int(parts[2]))
        return True
    except (ValueError, IndexError):
        return False

def _safe_date(s):
    return str(s).strip() if _is_valid_date(s) else None

# ---- Gemini PDF extraction --------------------------------------------------

EXTRACTION_PROMPT = """
This is an Indian government exam recruitment notification PDF.

Extract the IMPORTANT DATES / SCHEDULE table (two columns: Event | Date).

Return ONLY a valid JSON object with these keys.
Use null for any date that says "To be notified", "TBA", "TBD", or similar.
Convert all dates from DD.MM.YYYY format to YYYY-MM-DD format.

{
  "advertisement_date": "YYYY-MM-DD or null",
  "application_start_date": "YYYY-MM-DD or null",
  "application_end_date": "YYYY-MM-DD or null",
  "correction_start_date": "YYYY-MM-DD or null",
  "correction_end_date": "YYYY-MM-DD or null",
  "exam_date": "YYYY-MM-DD or null",
  "interview_date": "YYYY-MM-DD or null"
}

Return ONLY the JSON object. No markdown, no explanation, no code fences.
"""

def extract_dates_from_pdf(pdf_bytes):
    """Send PDF bytes inline to Gemini vision, return parsed dict or None."""
    global _ki
    for attempt in range(len(KEYS)):
        try:
            client = get_client()
            response = client.models.generate_content(
                model=MODEL,
                contents=[
                    types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf"),
                    EXTRACTION_PROMPT
                ]
            )
            raw = response.text.strip()
            # Strip markdown fences if present
            if "```" in raw:
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
                raw = raw.strip()
            return json.loads(raw)
        except Exception as exc:
            err = str(exc)
            if "401" in err or "UNAUTHENTICATED" in err:
                rotate_key("401 expired")
            elif "429" in err or "quota" in err.lower():
                rotate_key("rate limit")
                time.sleep(2 ** attempt)
            else:
                log.error("Gemini error: %s", err[:300])
                return None
    log.error("All Gemini keys exhausted")
    return None

# ---- PDF download -----------------------------------------------------------

_HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def download_pdf(url):
    """Download PDF URL, return bytes or None."""
    try:
        r = requests.get(url, headers=_HEADERS, timeout=30)
        r.raise_for_status()
        if len(r.content) > MAX_PDF_BYTES:
            log.warning("PDF too large (%d bytes): %s", len(r.content), url)
            return None
        return r.content
    except Exception as e:
        log.error("Download failed %s: %s", url, e)
        return None

# ---- DB helpers -------------------------------------------------------------

def get_conn():
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = False
    return conn

# Records missing dates but having a PDF URL
# Checks notification_pdf column, application_links JSONB, and source_url (MPPSC-style)
FETCH_SQL = """
SELECT en.id, en.title, en.apply_start_date, en.apply_end_date,
       en.important_dates, en.notification_pdf,
       en.application_links->>'notification_pdf' AS al_pdf,
       en.source_url
FROM public.exam_notifications en
WHERE
    en.deleted_at IS NULL
    AND COALESCE(en.is_archived, FALSE) = FALSE
    AND (en.apply_start_date IS NULL OR en.apply_end_date IS NULL)
    AND (
        (en.notification_pdf IS NOT NULL AND en.notification_pdf ILIKE '%.pdf')
        OR (en.application_links->>'notification_pdf') IS NOT NULL
        OR (en.source_url ILIKE '%.pdf')
    )
ORDER BY en.created_at DESC
LIMIT %s
"""

FETCH_BY_ID_SQL = """
SELECT en.id, en.title, en.apply_start_date, en.apply_end_date,
       en.important_dates, en.notification_pdf,
       en.application_links->>'notification_pdf' AS al_pdf,
       en.source_url
FROM public.exam_notifications en
WHERE en.id = %s
"""

UPDATE_SQL = """
UPDATE public.exam_notifications
SET
    important_dates       = %s::jsonb,
    apply_start_date      = %s::date,
    apply_end_date        = %s::date,
    deadline_source       = 'pdf_vision',
    classification_status = 'pending',
    classification_error  = NULL
WHERE id = %s
"""

# ---- Processing -------------------------------------------------------------

def resolve_pdf_url(row):
    """Return the best PDF URL for this row. Checks 3 sources."""
    # 1. Dedicated notification_pdf column
    url = row.get("notification_pdf")
    if url and url.lower().startswith("http") and ".pdf" in url.lower():
        return url
    # 2. application_links JSONB -> notification_pdf
    url = row.get("al_pdf")
    if url and url.lower().startswith("http"):
        return url
    # 3. source_url directly pointing to a PDF (e.g. MPPSC)
    url = row.get("source_url")
    if url and url.lower().startswith("http") and ".pdf" in url.lower():
        return url
    return None

def process_record(row, conn, dry_run=False):
    rid   = row["id"]
    title = (row.get("title") or "")[:70]
    pdf_url = resolve_pdf_url(row)

    if not pdf_url:
        log.info("  [%d] No PDF URL -- skip", rid)
        return "skipped"

    log.info("  [%d] %s", rid, title)
    log.info("       PDF: %s", pdf_url)

    pdf_bytes = download_pdf(pdf_url)
    if not pdf_bytes:
        return "error"

    log.info("       Downloaded: %d bytes", len(pdf_bytes))

    extracted = extract_dates_from_pdf(pdf_bytes)
    if not extracted:
        log.warning("  [%d] Extraction failed", rid)
        return "error"

    log.info("       Extracted: %s", json.dumps(extracted))

    # Build clean important_dates dict
    important_dates = {k: v for k, v in extracted.items()
                       if v and v != "null" and _is_valid_date(str(v))}

    apply_start = _safe_date(extracted.get("application_start_date"))
    apply_end   = _safe_date(extracted.get("application_end_date"))

    # Merge with existing (keep existing values where new ones are missing)
    existing = row.get("important_dates") or {}
    if isinstance(existing, str):
        try:
            existing = json.loads(existing)
        except Exception:
            existing = {}
    merged = {**important_dates}
    for k, v in existing.items():
        if k not in merged and v:
            merged[k] = v

    if not important_dates:
        log.info("  [%d] All dates TBA -- skip DB update", rid)
        return "skipped"

    log.info("  [%d] apply_start=%s  apply_end=%s", rid, apply_start, apply_end)

    if dry_run:
        log.info("  [%d] DRY RUN -- not writing to DB", rid)
        return "updated"

    with conn.cursor() as cur:
        cur.execute(UPDATE_SQL, (
            json.dumps(merged, ensure_ascii=False),
            apply_start,
            apply_end,
            rid
        ))
    conn.commit()
    log.info("  [%d] DB updated OK", rid)
    return "updated"

# ---- CLI --------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--id",      type=int, help="Single record ID")
    parser.add_argument("--limit",   type=int, default=DEFAULT_LIMIT)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    log.info("enrich_pdf_dates.py | model=%s | keys=%d | dry_run=%s",
             MODEL, len(KEYS), args.dry_run)

    conn = get_conn()
    counts = {"updated": 0, "skipped": 0, "error": 0}
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            if args.id:
                cur.execute(FETCH_BY_ID_SQL, (args.id,))
            else:
                cur.execute(FETCH_SQL, (args.limit,))
            rows = [dict(r) for r in cur.fetchall()]

        log.info("Records to process: %d", len(rows))
        for row in rows:
            result = process_record(row, conn, dry_run=args.dry_run)
            counts[result] = counts.get(result, 0) + 1
            time.sleep(REQUEST_DELAY)
    finally:
        conn.close()

    log.info("Done. updated=%d  skipped=%d  error=%d",
             counts["updated"], counts["skipped"], counts["error"])

if __name__ == "__main__":
    main()
