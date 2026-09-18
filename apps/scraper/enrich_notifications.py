"""
enrich_notifications.py
========================
Post-processing enrichment script for ExamUdaan.

PURPOSE:
    Fills in missing structured fields (dates, vacancies, fee, age limit,
    qualifications, salary) for exam_notifications rows that were scraped
    but not fully extracted by the spider or Gemini pipeline.

HOW IT WORKS:
    1. Query DB for rows missing key fields (apply_start_date / apply_end_date /
       total_vacancies) — these are "thin" rows that need enrichment.
    2. For each row, build context from the description field.
       If description is empty, optionally fetch the source_url page (see --fetch).
    3. Send context to Gemini with a structured extraction prompt.
    4. Update the DB with extracted values (only fills missing fields — no overwrite).
    5. Create posts table rows from the Gemini-returned vacancy breakdown.

RUN:
    python enrich_notifications.py                    # enrich 50 rows
    python enrich_notifications.py --limit 200        # enrich 200 rows
    python enrich_notifications.py --fetch            # also fetch live source URLs
    python enrich_notifications.py --dry-run          # print without writing to DB
    python enrich_notifications.py --id 1234          # enrich a specific row by ID

REQUIRES:
    .env with DATABASE_URL or DB_HOST/PORT/DATABASE/USERNAME/PASSWORD
    GEMINI_API_KEY (comma-separated for rotation)
"""

import os
import re
import sys
import json
import time
import random
import logging
import argparse
import textwrap
from typing import Optional, List

import psycopg2
import psycopg2.extras
import requests
import urllib3
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from google import genai

# Suppress InsecureRequestWarning for government sites with broken SSL certs
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

load_dotenv()

# ============================================================
# CONFIG
# ============================================================

DATABASE_URL  = os.getenv("DATABASE_URL")
_raw_keys     = os.getenv("GEMINI_API_KEY", "")
GEMINI_KEYS   = [k.strip() for k in _raw_keys.split(",") if k.strip()]
MODEL_NAME    = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")
REQUEST_DELAY = float(os.getenv("REQUEST_DELAY", "1.0"))

if not GEMINI_KEYS:
    raise RuntimeError("GEMINI_API_KEY is missing in .env")

if not DATABASE_URL and not os.getenv("DB_HOST"):
    raise RuntimeError("DATABASE_URL or DB_HOST is missing in .env")

# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("enrich")

# ============================================================
# GEMINI CLIENT WITH KEY ROTATION
# ============================================================

_key_idx = 0


def get_client():
    """Return a Gemini client using the current API key."""
    global _key_idx
    key = GEMINI_KEYS[_key_idx % len(GEMINI_KEYS)]
    return genai.Client(api_key=key)


def rotate_key():
    """Rotate to the next Gemini API key (called on rate-limit errors)."""
    global _key_idx
    _key_idx = (_key_idx + 1) % len(GEMINI_KEYS)
    logger.warning("Rotated Gemini key -> index %d", _key_idx)


# ============================================================
# PYDANTIC MODELS — Structured output schema for Gemini
# ============================================================

class PostDetail(BaseModel):
    """One post / vacancy category within a notification."""
    post_name:    str            = Field(description="Name of the post/position")
    vacancies:    Optional[int]  = Field(default=None, description="Number of vacancies for this post")
    qualification: Optional[str] = Field(default=None, description="Required qualification")
    pay_scale:    Optional[str]  = Field(default=None, description="Pay scale / salary band")
    category:     Optional[str]  = Field(default=None, description="Group A/B/C/D or Officer/Clerk etc.")


class AgeLimit(BaseModel):
    min:         Optional[int] = Field(default=None, description="Minimum age in years")
    max:         Optional[int] = Field(default=None, description="Maximum age in years")
    obc_relax:   Optional[int] = Field(default=None, description="OBC age relaxation in years")
    sc_st_relax: Optional[int] = Field(default=None, description="SC/ST age relaxation in years")


class ApplicationFee(BaseModel):
    general: Optional[int] = Field(default=None, description="Fee for General/OBC/EWS in INR")
    sc_st:   Optional[int] = Field(default=None, description="Fee for SC/ST in INR")
    obc:     Optional[int] = Field(default=None, description="Fee for OBC in INR")
    women:   Optional[int] = Field(default=None, description="Fee for Women in INR")
    note:    Optional[str] = Field(default=None, description="Fee note e.g. No fee for PWD candidates")


class SalaryInfo(BaseModel):
    amount: Optional[int] = Field(default=None, description="Monthly pay in INR (integer)")
    note:   Optional[str] = Field(default=None, description="Pay scale text e.g. Level-7 or Rs 44900-142400")


class Qualifications(BaseModel):
    """
    Typed qualifications model — avoids additionalProperties in JSON schema
    which the Gemini API rejects when using Optional[dict].
    """
    mandatory: List[str] = Field(
        default_factory=list,
        description="Mandatory qualifications e.g. Graduate, B.E./B.Tech in Civil Engineering"
    )
    desirable: List[str] = Field(
        default_factory=list,
        description="Desirable/preferred qualifications (optional, can be empty)"
    )


class EnrichmentResult(BaseModel):
    """Structured extraction result for one notification row."""
    apply_start_date:  Optional[str]           = Field(default=None,
        description="Application start date in YYYY-MM-DD format")
    apply_end_date:    Optional[str]           = Field(default=None,
        description="Application last date in YYYY-MM-DD format")
    exam_date:         Optional[str]           = Field(default=None,
        description="Exam date in YYYY-MM-DD format or null if not announced")
    total_vacancies:   Optional[int]           = Field(default=None,
        description="Total number of posts/vacancies as an integer")
    selection_process: List[str]               = Field(default_factory=list,
        description="Selection steps e.g. Written Exam, Interview, Document Verification")
    age_limit:         Optional[AgeLimit]      = Field(default=None)
    application_fee:   Optional[ApplicationFee] = Field(default=None)
    qualifications:    Optional[Qualifications] = Field(default=None,
        description="Mandatory and desirable qualifications")
    salary:            Optional[SalaryInfo]    = Field(default=None)
    posts:             List[PostDetail]        = Field(default_factory=list,
        description="Breakdown of individual posts with vacancies")
    notification_pdf:  Optional[str]           = Field(default=None,
        description="Full https:// URL of official notification PDF or null")
    apply_online_url:  Optional[str]           = Field(default=None,
        description="Full https:// URL of online application portal or null")
    advt_no:           Optional[str]           = Field(default=None,
        description="Advertisement / notification number")


# ============================================================
# DB CONNECTION
# ============================================================

def get_conn():
    """Connect to PostgreSQL using DATABASE_URL or individual env vars."""
    if DATABASE_URL:
        conn = psycopg2.connect(DATABASE_URL)
    else:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT", "5432")),
            dbname=os.getenv("DB_DATABASE"),
            user=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
        )
    conn.autocommit = False
    return conn


# ============================================================
# FETCH ROWS NEEDING ENRICHMENT
# ============================================================

# Rows that are recruitment type AND missing at least one key field.
# Also skip non-recruitment content types that got mis-classified.
FETCH_SQL = """
SELECT
    id,
    title,
    description,
    source_url,
    notification_pdf,
    apply_start_date,
    apply_end_date,
    exam_date,
    total_vacancies,
    application_fee,
    age_limit,
    qualifications,
    selection_process,
    salary,
    advt_no,
    notification_type
FROM public.exam_notifications
WHERE
    deleted_at IS NULL
    AND COALESCE(is_archived, FALSE) = FALSE
    AND notification_type = 'recruitment'
    AND (
        apply_start_date IS NULL
        OR apply_end_date IS NULL
        OR total_vacancies IS NULL
    )
    -- Skip rows with very short titles (navigation links, not real notifications)
    AND LENGTH(COALESCE(title, '')) > 20
ORDER BY created_at DESC
LIMIT %s
"""

FETCH_BY_ID_SQL = """
SELECT
    id, title, description, source_url, notification_pdf,
    apply_start_date, apply_end_date, exam_date,
    total_vacancies, application_fee, age_limit, qualifications,
    selection_process, salary, advt_no, notification_type
FROM public.exam_notifications
WHERE id = %s
"""


def fetch_rows(conn, limit: int, specific_id: Optional[int] = None) -> list:
    """Fetch rows that need enrichment."""
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        if specific_id is not None:
            cur.execute(FETCH_BY_ID_SQL, (specific_id,))
        else:
            cur.execute(FETCH_SQL, (limit,))
        return [dict(r) for r in cur.fetchall()]


# ============================================================
# PRE-FILTER — skip rows that are clearly not enrichable
# ============================================================

# Title patterns that indicate a navigation page / list page / non-recruitment row.
# These are never real job notifications with application dates and vacancies.
_SKIP_TITLE_PATTERNS = (
    # Exam/question paper pages
    'question paper', 'previous paper', 'sample paper', 'model paper',
    'old paper', 'paper pattern',
    # Exam/result navigation pages
    'recent examination', 'examination link', 'exam link',
    'result list', 'result notification',
    # Interview schedules (not recruitment ads)
    'interview schedule', 'interview list', 'interview call',
    # Press / media
    'press release', 'press note', 'annual report',
    # Procurement
    'tender', 'e-tender', 'rate contract', 'quotation',
    # Admin circulars
    'circular', 'office order', 'office memorandum',
    'minutes of meeting', 'rti ', '/rti', 'seniority list',
    'transfer order', 'posting order', 'empanelment',
    # Financial / creditor
    'holiday list', 'leave list', 'pay revision',
    # IT / technical docs (not job postings)
    'vpn', 'site preparation', 'configuration', 'cis 3.0',
    'instruction manual', 'user manual', 'installation guide',
    'technical guide', 'software guide', 'network setup',
    'procedure to configure', 'click here to download',
    # Court / legal docs
    'case management', 'court order', 'judgment', 'order sheet',
    # Generic page titles
    'home page', 'index page', 'sitemap', 'contact us',
    'about us', 'faq', 'grievance', 'feedback form',
)


def is_enrichable(row: dict) -> bool:
    """
    Return True only if this row looks like a real recruitment notification
    that can benefit from Gemini enrichment.

    Filters out:
    - Navigation/listing pages ("Recent Examinations", "Question Papers")
    - Non-recruitment content mis-classified as recruitment
    - Rows with no usable content at all
    """
    title = (row.get("title") or "").lower()

    # Skip if title matches noise patterns
    for pat in _SKIP_TITLE_PATTERNS:
        if pat in title:
            return False

    # Must have some content to extract from (title alone is too little
    # unless we can fetch the source page)
    has_desc = bool(row.get("description") and len(str(row["description"])) > 50)
    has_source = bool(row.get("source_url"))
    if not has_desc and not has_source:
        return False

    return True


# ============================================================
# FETCH SOURCE PAGE TEXT (for --fetch mode)
# ============================================================

def fetch_page_text(url: str, max_chars: int = 8000) -> str:
    """
    Fetch the source URL and extract visible text.
    Used when description is empty and --fetch flag is set.
    Returns empty string on any network or parse error.
    """
    if not url:
        return ""
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        }
        resp = requests.get(url, headers=headers, timeout=15, verify=False)
        resp.raise_for_status()

        # Strip all HTML tags to get plain text
        text = re.sub(r"<[^>]+>", " ", resp.text)
        text = re.sub(r"\s+", " ", text).strip()
        return text[:max_chars]
    except Exception as exc:
        logger.debug("Failed to fetch %s: %s", url, exc)
        return ""


# ============================================================
# BUILD GEMINI PROMPT
# ============================================================

SYSTEM_PROMPT = textwrap.dedent("""
    You are a structured data extraction engine for Indian government job notifications.

    Extract specific fields from the text below and return ONLY valid JSON
    matching the response schema provided.

    Rules:
    1. Do NOT invent data — only return values explicitly mentioned in the text.
    2. If a field is not present, return null or an empty list.
    3. Dates MUST be in YYYY-MM-DD format.
       If only month/year known, use the 1st: 2026-09-01.
    4. Fee amounts must be plain integers in INR (e.g. 500 not "Rs. 500").
    5. total_vacancies must be a plain integer.
    6. posts[] should have one entry per distinct post/category mentioned.
    7. notification_pdf and apply_online_url must be full https:// URLs or null.
    8. selection_process is an ordered list e.g. ["Written Exam", "Interview"].
""").strip()


def build_prompt(row: dict, page_text: str = "") -> str:
    """Assemble the extraction prompt from available row data and page content."""
    parts = []

    if row.get("title"):
        parts.append(f"TITLE: {row['title']}")

    if row.get("advt_no"):
        parts.append(f"ADVT NO: {row['advt_no']}")

    if row.get("description"):
        desc = str(row["description"])[:6000]
        parts.append(f"DESCRIPTION:\n{desc}")

    if page_text:
        parts.append(f"PAGE CONTENT (fetched from source URL):\n{page_text[:4000]}")

    if row.get("source_url"):
        parts.append(f"SOURCE URL: {row['source_url']}")

    if row.get("notification_pdf"):
        parts.append(f"EXISTING PDF URL: {row['notification_pdf']}")

    content = "\n\n".join(parts)
    return (
        "Extract structured data from this Indian government job notification:\n\n"
        + content
    )


# ============================================================
# GEMINI SCHEMA HELPER
# ============================================================

def _resolve_refs(schema: dict, defs: dict = None) -> dict:
    """
    Recursively inline all $ref references in a Pydantic JSON schema.

    Why this is needed:
      Pydantic generates Optional[SomeModel] as:
        {"anyOf": [{"$ref": "#/$defs/SomeModel"}, {"type": "null"}]}
      The Gemini API does not support $ref / $defs — it requires a fully
      inlined schema. If we strip $defs without inlining $refs first,
      Gemini returns: 'reference to undefined schema at properties.X.anyOf.0'

    Also strips: 'title', 'additionalProperties' (not supported by Gemini).
    """
    if defs is None:
        # Capture definitions from the top-level schema
        defs = schema.get('$defs', {})

    if not isinstance(schema, dict):
        return schema

    # Inline $ref — replace the reference with the actual definition
    if '$ref' in schema:
        ref_name = schema['$ref'].split('/')[-1]  # e.g. '#/$defs/AgeLimit' -> 'AgeLimit'
        if ref_name in defs:
            return _resolve_refs(dict(defs[ref_name]), defs)
        return schema  # unknown ref — leave as-is

    result = {}
    for key, value in schema.items():
        # Strip keys the Gemini API refuses
        if key in ('$defs', 'title', 'additionalProperties'):
            continue
        if isinstance(value, dict):
            result[key] = _resolve_refs(value, defs)
        elif isinstance(value, list):
            result[key] = [
                _resolve_refs(item, defs) if isinstance(item, dict) else item
                for item in value
            ]
        else:
            result[key] = value
    return result


def _get_response_schema() -> dict:
    """Return a fully-inlined, Gemini-safe JSON schema for EnrichmentResult."""
    raw = EnrichmentResult.model_json_schema()
    return _resolve_refs(raw)


# ============================================================
# GEMINI EXTRACTION
# ============================================================

def extract_fields(
    row: dict, page_text: str = "", max_retries: int = 3
) -> Optional[EnrichmentResult]:
    """
    Send the notification to Gemini and return an EnrichmentResult.
    Returns None on failure after all retries.
    """
    prompt   = build_prompt(row, page_text)
    last_err = None
    # Build the schema once per call (cached is fine — it's tiny)
    response_schema = _get_response_schema()

    for attempt in range(max_retries):
        try:
            client   = get_client()
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=[SYSTEM_PROMPT, prompt],
                config={
                    "response_mime_type":  "application/json",
                    "response_json_schema": response_schema,
                },
            )
            if not response.text:
                raise RuntimeError("Gemini returned empty response")

            result = EnrichmentResult.model_validate_json(response.text)
            return result

        except Exception as exc:
            last_err = exc
            err_str  = str(exc).lower()
            if "429" in err_str or "quota" in err_str or "rate" in err_str:
                rotate_key()
                wait = (2 ** attempt) + random.uniform(0, 1)
                logger.warning(
                    "Rate limit hit (attempt %d/%d). Waiting %.1fs.", attempt + 1, max_retries, wait
                )
                time.sleep(wait)
            else:
                logger.warning("Gemini error (attempt %d/%d): %s", attempt + 1, max_retries, exc)
                time.sleep(1)

    logger.error("Gemini failed after %d retries: %s", max_retries, last_err)
    return None


# ============================================================
# DB UPDATE — only fill NULL / empty fields (no overwrite)
# ============================================================

UPDATE_SQL = """
UPDATE public.exam_notifications
SET
    apply_start_date  = COALESCE(apply_start_date,  %(apply_start_date)s::date),
    apply_end_date    = COALESCE(apply_end_date,    %(apply_end_date)s::date),
    exam_date         = COALESCE(exam_date,         %(exam_date)s::date),
    total_vacancies   = COALESCE(total_vacancies,   %(total_vacancies)s),
    selection_process = COALESCE(NULLIF(selection_process, ''), %(selection_process)s),
    age_limit         = COALESCE(age_limit,         %(age_limit)s::jsonb),
    application_fee   = COALESCE(application_fee,   %(application_fee)s::jsonb),
    qualifications    = COALESCE(qualifications,    %(qualifications)s::jsonb),
    salary            = COALESCE(salary,            %(salary)s::jsonb),
    advt_no           = COALESCE(NULLIF(advt_no, ''), %(advt_no)s),
    notification_pdf  = COALESCE(notification_pdf,  %(notification_pdf)s),
    application_links = COALESCE(application_links, '{}'::jsonb)
                        || CASE
                             WHEN %(apply_online_url)s IS NOT NULL
                             THEN jsonb_build_object('apply_online', %(apply_online_url)s)
                             ELSE '{}'::jsonb
                           END
WHERE id = %(id)s
"""

# Upsert posts — ON CONFLICT on (notification_id, post_name) to avoid duplicates
UPSERT_POST_SQL = """
INSERT INTO public.posts
    (notification_id, post_name, total_vacancies, qualification, pay_scale, category)
VALUES
    (%(notification_id)s, %(post_name)s, %(vacancies)s, %(qualification)s, %(pay_scale)s, %(category)s)
ON CONFLICT (notification_id, post_name)
DO UPDATE SET
    total_vacancies = EXCLUDED.total_vacancies,
    qualification   = COALESCE(EXCLUDED.qualification, posts.qualification),
    pay_scale       = COALESCE(EXCLUDED.pay_scale,     posts.pay_scale)
"""


def update_row(
    cur,
    row_id: int,
    result: EnrichmentResult,
    dry_run: bool = False,
):
    """Write extracted values to DB (COALESCE ensures existing values are never overwritten)."""

    # Build params — convert Pydantic sub-models to JSON strings for JSONB columns
    params = {
        "id":               row_id,
        "apply_start_date": result.apply_start_date,
        "apply_end_date":   result.apply_end_date,
        "exam_date":        result.exam_date,
        "total_vacancies":  result.total_vacancies,
        "selection_process": ", ".join(result.selection_process) if result.selection_process else None,
        "age_limit":        json.dumps(result.age_limit.model_dump())        if result.age_limit        else None,
        "application_fee":  json.dumps(result.application_fee.model_dump())  if result.application_fee  else None,
        "qualifications":   json.dumps(result.qualifications.model_dump())   if result.qualifications   else None,
        "salary":           json.dumps(result.salary.model_dump())           if result.salary            else None,
        "advt_no":          result.advt_no,
        "notification_pdf": result.notification_pdf,
        "apply_online_url": result.apply_online_url,
    }

    if dry_run:
        logger.info(
            "[DRY RUN] id=%d | start=%s | end=%s | vacancies=%s | posts=%d",
            row_id,
            result.apply_start_date,
            result.apply_end_date,
            result.total_vacancies,
            len(result.posts),
        )
        return

    # Main notification row update
    cur.execute(UPDATE_SQL, params)

    # Insert/update posts breakdown rows
    for post in result.posts:
        if not post.post_name:
            continue
        try:
            cur.execute(UPSERT_POST_SQL, {
                "notification_id": row_id,
                "post_name":       post.post_name,
                "vacancies":       post.vacancies,
                "qualification":   post.qualification,
                "pay_scale":       post.pay_scale,
                "category":        post.category,
            })
        except Exception as post_err:
            # Non-fatal — log and continue (might be a schema constraint issue)
            logger.warning(
                "Could not insert post '%s' for id=%d: %s",
                post.post_name, row_id, post_err
            )


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description="Enrich exam_notifications rows with Gemini-extracted structured data"
    )
    parser.add_argument(
        "--limit", type=int, default=50,
        help="Maximum rows to process in one run (default: 50)"
    )
    parser.add_argument(
        "--id", type=int, default=None,
        help="Enrich a specific notification row by its DB ID"
    )
    parser.add_argument(
        "--fetch", action="store_true",
        help="Fetch the source URL page when description is empty (slower but better results)"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Extract and print results but do NOT write to the database"
    )
    args = parser.parse_args()

    logger.info("=== ExamUdaan Notification Enricher ===")
    logger.info(
        "Model: %s | Keys: %d | Limit: %d | Fetch: %s | Dry-run: %s",
        MODEL_NAME, len(GEMINI_KEYS), args.limit, args.fetch, args.dry_run
    )

    conn = get_conn()
    logger.info("DB connected.")

    rows = fetch_rows(conn, limit=args.limit, specific_id=args.id)
    logger.info("Found %d rows to enrich.", len(rows))

    if not rows:
        logger.info("Nothing to enrich. Exiting.")
        conn.close()
        return

    processed = 0
    skipped   = 0

    for row in rows:
        row_id = row["id"]
        title  = (row.get("title") or "")[:80]
        logger.info("--- [%d] %s", row_id, title)

        # Pre-filter: skip navigation/noise rows before spending Gemini quota
        if not is_enrichable(row):
            logger.info("  SKIP (not enrichable — noise/nav page): %s", title[:60])
            skipped += 1
            continue

        # Optionally fetch source page when description is empty
        page_text = ""
        if args.fetch and not row.get("description"):
            source_url = row.get("source_url", "")
            if source_url:
                logger.info("  Fetching source page: %s", source_url)
                page_text = fetch_page_text(source_url)
                if page_text:
                    logger.info("  Got %d chars from source page.", len(page_text))

        # Skip if still no usable content after optional fetch
        if not row.get("description") and not page_text:
            logger.warning("  No content to extract from — skipping id=%d", row_id)
            skipped += 1
            continue

        # Call Gemini for structured extraction
        result = extract_fields(row, page_text=page_text)
        if not result:
            logger.warning("  Gemini extraction failed for id=%d", row_id)
            skipped += 1
            continue

        # Log extraction summary
        logger.info(
            "  -> start=%s | end=%s | vacancies=%s | posts=%d | fee=%s | pdf=%s",
            result.apply_start_date,
            result.apply_end_date,
            result.total_vacancies,
            len(result.posts),
            bool(result.application_fee),
            bool(result.notification_pdf),
        )

        # Write to DB (or dry-run log)
        try:
            with conn.cursor() as cur:
                update_row(cur, row_id, result, dry_run=args.dry_run)
            if not args.dry_run:
                conn.commit()
                logger.info("  OK Updated id=%d", row_id)
            processed += 1
        except Exception as db_err:
            logger.error("  DB update failed for id=%d: %s", row_id, db_err)
            conn.rollback()
            skipped += 1

        # Delay between API calls to stay within rate limits
        time.sleep(REQUEST_DELAY)

    conn.close()
    logger.info(
        "=== Done. Processed=%d | Skipped=%d | Total=%d ===",
        processed, skipped, len(rows)
    )


if __name__ == "__main__":
    main()
