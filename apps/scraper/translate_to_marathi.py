"""
translate_to_marathi.py
========================
Translates exam_notifications into clean, natural, professional Marathi.
Processes notifications in batches using Gemini API (with key rotation)
and writes directly back to PostgreSQL (exam_notifications table).

Usage:
  python translate_to_marathi.py              # process all untranslated
  python translate_to_marathi.py --limit 20   # process next 20 untranslated
  python translate_to_marathi.py --batch-size 10
"""

import os
import sys
import json
import time
import random
import logging
import argparse
from typing import List, Optional

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

from google import genai
from pydantic import BaseModel, Field


# ============================================================
# CONFIG
# ============================================================

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

_raw_keys = os.environ.get("GEMINI_API_KEY", "")
GEMINI_API_KEYS: List[str] = [
    k.strip() for k in _raw_keys.split(",") if k.strip()
]

if not GEMINI_API_KEYS:
    raise RuntimeError("GEMINI_API_KEY is missing in .env")

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")
REQUEST_DELAY = float(os.getenv("REQUEST_DELAY", "1.0"))


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger("marathi-translator")


# ============================================================
# GEMINI CLIENT — with key rotation
# ============================================================

_key_index = 0

def get_gemini_client():
    """Returns a Gemini client using the active rotated API key."""
    global _key_index
    key = GEMINI_API_KEYS[_key_index % len(GEMINI_API_KEYS)]
    return genai.Client(api_key=key)

def rotate_key():
    """Switch to the next API key on 429 / quota errors."""
    global _key_index
    _key_index = (_key_index + 1) % len(GEMINI_API_KEYS)
    logger.warning("Rotating Gemini API key -> using key index %d", _key_index)


# ============================================================
# PYDANTIC STRUCTURED OUTPUT
# ============================================================

class NotificationMarathi(BaseModel):
    id: str = Field(description="Database ID of the notification")
    title_mr: str = Field(
        description="Authentic, clear Marathi title suitable for job portal headlines (e.g. MPSC भरती 2026: 450 जागांसाठी जाहिरात प्रसिद्ध)"
    )
    summary_mr: str = Field(
        description="2-3 sentence overview in Marathi summarizing department, post, qualifications, and deadline"
    )
    qualifications_mr: List[str] = Field(
        default_factory=list,
        description="Translated key educational qualifications in Marathi (e.g. 10वी पास, पदवीधर, बी.ई/बी.टेक)"
    )

class BatchTranslation(BaseModel):
    items: List[NotificationMarathi]


# ============================================================
# SYSTEM PROMPT (EXAM TERMINOLOGY FOCUSED)
# ============================================================

SYSTEM_PROMPT = """
You are an expert translator specializing in Maharashtra government competitive exams, civil services, and recruitment portals (such as MajhiNaukri, Mahasarkar, MPSC, MahaBharti, MahaDBT).

Your task is to translate government job/exam notifications from English into authentic, high-quality, professional Marathi for aspirants.

CRITICAL MAHARASHTRA EXAM VOCABULARY:
- Recruitment / Direct Recruitment -> भरती / थेट भरती
- Notification / Advertisement -> जाहिरात / अधिसूचना
- Admit Card / Hall Ticket -> प्रवेशपत्र (Hall Ticket)
- Result / Selection List -> निकाल / निवड यादी
- Answer Key -> उत्तरतालिका
- Vacancies / Posts -> पदे / जागा
- Syllabus -> अभ्यासक्रम
- Eligibility / Qualification -> शैक्षणिक पात्रता
- Age Limit -> वयोमर्यादा
- Application Fee -> अर्ज शुल्क
- Last Date / Deadline -> अंतिम दिनांक
- Written Exam -> लेखी परीक्षा
- Physical Test -> शारीरिक चाचणी
- Document Verification -> कागदपत्र पडताळणी

RULES:
1. Title (title_mr): Must be crisp, clear, and attractive for candidates.
   Example: "SSC CGL 2026: 15,000 पदांची मेगा भरती जाहीर; येथे करा अर्ज"
   Example: "MPSC राज्यसेवा पूर्व परीक्षा 2026: 450 जागांसाठी जाहिरात प्रसिद्ध"
2. Summary (summary_mr): A clean 2-3 sentence Marathi description outlining the recruiting authority, vacancy count, key qualification, and application deadline.
3. Keep common abbreviations like MPSC, UPSC, SSC, BMC, RRB, ITI, B.E., MBBS, etc. recognizable (you may keep English acronyms or write them as एमएससी/MPSC).
4. Do NOT invent false vacancies or dates. Stick strictly to provided context.
"""


# ============================================================
# DATABASE CONNECTION & QUERIES
# ============================================================

def get_db_connection():
    """Build psycopg2 connection from DATABASE_URL or individual env vars."""
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

FETCH_SQL = """
SELECT
    id,
    title,
    description,
    notification_type,
    total_vacancies,
    apply_end_date,
    qualifications,
    exam_cities,
    state_slug
FROM public.exam_notifications
WHERE
    deleted_at IS NULL
    AND COALESCE(is_archived, FALSE) = FALSE
    AND (title_mr IS NULL OR title_mr = '')
ORDER BY created_at DESC
LIMIT %s
"""

UPDATE_SQL = """
UPDATE public.exam_notifications
SET
    title_mr          = %(title_mr)s,
    summary_mr        = %(summary_mr)s,
    qualifications_mr = %(qualifications_mr)s::jsonb
WHERE id = %(id)s
"""


# ============================================================
# TRANSLATION LOGIC
# ============================================================

def translate_batch(rows, max_retries=3):
    """Sends a batch of job rows to Gemini for Marathi translation."""
    payload = []
    for r in rows:
        qual = r.get("qualifications")
        if isinstance(qual, (dict, list)):
            qual = json.dumps(qual, ensure_ascii=False)

        desc = str(r.get("description") or "")
        if len(desc) > 2500:
            desc = desc[:2500] + "... [truncated]"

        payload.append({
            "id": str(r["id"]),
            "title": str(r.get("title") or ""),
            "notification_type": str(r.get("notification_type") or "recruitment"),
            "total_vacancies": r.get("total_vacancies"),
            "apply_end_date": str(r["apply_end_date"]) if r.get("apply_end_date") else None,
            "qualifications": qual or "",
            "description": desc,
        })

    user_prompt = f"""
Translate the following {len(payload)} Indian government exam/job notifications into Marathi.
Return a structured translation object for EVERY input record matching its ID.

INPUT RECORDS:
{json.dumps(payload, ensure_ascii=False, indent=2)}
"""

    last_err = None
    for attempt in range(max_retries):
        try:
            client = get_gemini_client()
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=[SYSTEM_PROMPT, user_prompt],
                config={
                    "response_mime_type": "application/json",
                    "response_json_schema": BatchTranslation.model_json_schema(),
                }
            )

            if not response.text:
                raise RuntimeError("Gemini returned empty response")

            result = BatchTranslation.model_validate_json(response.text)
            return result.items

        except Exception as exc:
            last_err = exc
            err_str = str(exc).lower()
            if "429" in err_str or "quota" in err_str or "rate" in err_str:
                rotate_key()
                wait = (2 ** attempt) + random.uniform(0.5, 1.5)
                logger.warning("Rate limit / quota hit (attempt %d/%d). Sleeping %.1fs", attempt + 1, max_retries, wait)
                time.sleep(wait)
            else:
                logger.error("Gemini call error on attempt %d: %s", attempt + 1, exc)
                time.sleep(1.0)

    raise RuntimeError(f"Gemini translation failed after {max_retries} attempts: {last_err}")


# ============================================================
# MAIN RUNNER
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="Translate exam_notifications into Marathi")
    parser.add_argument("--batch-size", type=int, default=10, help="Batch size for Gemini (default 10)")
    parser.add_argument("--limit", type=int, default=0, help="Max total records to process (0 = all untranslated)")
    args = parser.parse_args()

    batch_size = args.batch_size
    max_limit = args.limit

    logger.info("=== Starting Marathi Translation Pipeline ===")
    logger.info("Model       : %s", MODEL_NAME)
    logger.info("Batch Size  : %d", batch_size)
    logger.info("Max Limit   : %s", max_limit if max_limit > 0 else "All untranslated")
    logger.info("API Keys    : %d loaded", len(GEMINI_API_KEYS))

    conn = get_db_connection()
    logger.info("PostgreSQL connected successfully.")

    total_translated = 0

    try:
        while True:
            # Check if limit reached
            current_batch_limit = batch_size
            if max_limit > 0:
                remaining = max_limit - total_translated
                if remaining <= 0:
                    logger.info("Reached specified limit of %d records. Stopping.", max_limit)
                    break
                current_batch_limit = min(batch_size, remaining)

            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                cur.execute(FETCH_SQL, (current_batch_limit,))
                rows = [dict(r) for r in cur.fetchall()]

            if not rows:
                logger.info("No more untranslated records found. Everything is up to date!")
                break

            ids = [str(r["id"]) for r in rows]
            logger.info("Translating batch of %d records: %s", len(rows), ids)

            try:
                translated_items = translate_batch(rows)
                item_by_id = {str(item.id): item for item in translated_items}

                with conn.cursor() as cur:
                    for job_id in ids:
                        item = item_by_id.get(job_id)
                        if not item:
                            logger.warning("Gemini skipped ID %s", job_id)
                            continue

                        cur.execute(UPDATE_SQL, {
                            "id": int(job_id),
                            "title_mr": item.title_mr.strip() if item.title_mr else None,
                            "summary_mr": item.summary_mr.strip() if item.summary_mr else None,
                            "qualifications_mr": json.dumps(item.qualifications_mr, ensure_ascii=False),
                        })
                        total_translated += 1

                conn.commit()
                logger.info("Batch committed successfully. Total translated so far: %d", total_translated)

            except Exception as exc:
                logger.exception("Batch failed to translate: %s", exc)
                conn.rollback()

            time.sleep(REQUEST_DELAY)

    finally:
        conn.close()

    logger.info("=== Translation Completed! Total processed: %d ===", total_translated)


if __name__ == "__main__":
    main()
