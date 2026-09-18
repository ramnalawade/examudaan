"""
classify_exam_notifications.py
================================
Reads unclassified exam_notifications rows from PostgreSQL,
sends them to Gemini in batches, and writes the structured
classification back.

DB driver: psycopg2-binary (same as db.py â€” works on Windows
without needing libpq separately installed).
"""

import os
import json
import time
import logging
import random
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

# Support comma-separated Gemini API keys for rotation
_raw_keys = os.environ.get("GEMINI_API_KEY", "")
GEMINI_API_KEYS: List[str] = [
    k.strip() for k in _raw_keys.split(",") if k.strip()
]

if not GEMINI_API_KEYS:
    raise RuntimeError("GEMINI_API_KEY is missing in .env")

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")

BATCH_SIZE = int(os.getenv("BATCH_SIZE", "10"))
REQUEST_DELAY = float(os.getenv("REQUEST_DELAY", "1.0"))

CLASSIFICATION_VERSION = "v1.1"

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing in .env")


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger("job-classifier")


# ============================================================
# GEMINI CLIENT â€” with key rotation on 429
# ============================================================

_key_index = 0


def get_gemini_client():
    """Returns a Gemini client using the current API key."""
    global _key_index
    key = GEMINI_API_KEYS[_key_index % len(GEMINI_API_KEYS)]
    return genai.Client(api_key=key)


def rotate_key():
    """Switch to the next API key (called on 429 / quota errors)."""
    global _key_index
    _key_index = (_key_index + 1) % len(GEMINI_API_KEYS)
    logger.warning("Rotating Gemini API key â†’ using key index %d", _key_index)


# ============================================================
# STRUCTURED OUTPUT MODEL
# ============================================================

class JobClassification(BaseModel):

    id: str = Field(
        description="Database ID of the notification"
    )

    education_levels: List[str] = Field(
        default_factory=list,
        description=(
            "Education levels required or accepted. "
            "Allowed values: "
            "10th, 12th, ITI, Diploma, Graduate, "
            "Postgraduate, PhD, MBBS, BDS, Nursing, "
            "Other"
        )
    )

    education_streams: List[str] = Field(
        default_factory=list,
        description=(
            "Education streams such as Engineering, "
            "Computer/IT, Science, Commerce, Arts, "
            "Agriculture, Medical, Pharmacy, Nursing, "
            "Law, Education, Management, "
            "Geology/Environment, Other"
        )
    )

    education_qualifications: List[str] = Field(
        default_factory=list,
        description="Specific qualifications mentioned in the notification"
    )

    job_categories: List[str] = Field(
        default_factory=list,
        description=(
            "Job categories. Examples: "
            "Police/Law Enforcement, Teaching/Academic, "
            "Research/Scientific, Engineering/Technical, "
            "Medical/Healthcare, Administration/Clerical, "
            "Agriculture, Banking/Finance, Defence, Railway, "
            "Legal, IT/Software, Mining/Geology/Environment, "
            "Management, Skilled Trade"
        )
    )

    career_streams: List[str] = Field(
        default_factory=list,
        description=(
            "Career streams such as Research, Academic, "
            "Technical, Administrative, Healthcare, "
            "Law Enforcement, Agriculture, Finance, "
            "Technology, Defence, Legal, Management"
        )
    )

    competitive_exams: List[str] = Field(
        default_factory=list,
        description=(
            "Competitive exams or recruitment exams. "
            "Examples: MPSC, UPSC, SSC, IBPS, SBI, "
            "RRB, RRC, UGC-NET, GATE, CTET, TET, "
            "NEET, JEE, DRDO, ISRO"
        )
    )

    exam_authorities: List[str] = Field(
        default_factory=list,
        description="Recruitment/exam authorities such as MPSC, UPSC, SSC"
    )

    state_normalized: Optional[str] = Field(
        default=None,
        description="Indian state or union territory"
    )

    cities_normalized: List[str] = Field(
        default_factory=list,
        description="Cities mentioned as job/exam/application locations"
    )

    government_level: Optional[str] = Field(
        default=None,
        description=(
            "One of: Central, State, Local, PSU, "
            "Autonomous, Private, Mixed, Unknown"
        )
    )

    recruitment_types: List[str] = Field(
        default_factory=list,
        description=(
            "Recruitment types: Regular, Direct Recruitment, "
            "Walk-in, Contractual, Temporary, Permanent, "
            "Deputation, Apprenticeship, Internship, "
            "Consultant, Project-based, Other"
        )
    )

    employment_type_normalized: Optional[str] = Field(
        default=None,
        description=(
            "Employment type such as Full-time, Part-time, "
            "Contract, Temporary, Permanent, Apprenticeship"
        )
    )

    selection_methods: List[str] = Field(
        default_factory=list,
        description=(
            "Selection methods such as Written Exam, "
            "Interview, Skill Test, Physical Test, "
            "Document Verification, Merit, CBT, "
            "PET, PST"
        )
    )

    experience_min_years: Optional[int] = Field(
        default=None,
        description="Minimum experience in years if explicitly known"
    )

    experience_max_years: Optional[int] = Field(
        default=None,
        description="Maximum experience in years if explicitly known"
    )

    is_mpsc: bool = False
    is_upsc: bool = False
    is_ssc: bool = False
    is_railway: bool = False
    is_banking: bool = False
    is_police: bool = False
    is_teaching: bool = False
    is_engineering: bool = False
    is_medical: bool = False
    is_research: bool = False

    is_govt: bool = False
    is_central_govt: bool = False
    is_state_govt: bool = False
    is_psu: bool = False

    title_mr: Optional[str] = Field(
        default=None,
        description="Natural, attractive Marathi title for Maharashtra candidates (e.g. MPSC राज्यसेवा भरती 2026: 450 जागांसाठी जाहिरात प्रसिद्ध)"
    )

    summary_mr: Optional[str] = Field(
        default=None,
        description="2-3 sentence overview in Marathi summarizing department, post, qualifications, and application deadline"
    )

    confidence: float = Field(
        default=0.0,
        ge=0,
        le=1
    )



class BatchClassification(BaseModel):

    jobs: List[JobClassification]


# ============================================================
# PROMPT
# ============================================================

SYSTEM_PROMPT = """
You are a professional Indian government-job classification engine.

Your job is to classify Indian job/exam notifications for a
large employment website (similar to FreeJobAlert but with richer
filters for education, career, state, city, MPSC, UPSC etc.).

IMPORTANT:

1. Do NOT invent qualifications.
2. Do NOT invent locations.
3. Do NOT assume MPSC/UPSC merely because a job is in Maharashtra.
4. Only mark MPSC true when MPSC is actually mentioned or clearly
   identifiable from the notification.
5. Only mark UPSC true when UPSC is actually mentioned or clearly
   identifiable.
6. Multiple education levels can be returned.
7. Multiple job categories can be returned.
8. Multiple career streams can be returned.
9. Multiple cities can be returned.
10. If information is unavailable, return an empty array or null.
11. Use standardized English labels.
12. Marathi/Hindi text must also be understood.
13. Do not translate the entire notification text, but DO generate title_mr and summary_mr.
14. Return ONLY the requested structured JSON.
15. Confidence must be between 0 and 1.
16. Marathi output rules (title_mr, summary_mr):
    - title_mr: Use natural Marathi terminology (भरती, निकाल, प्रवेशपत्र, उत्तरतालिका, जागा).
    - summary_mr: A clean 2-3 sentence summary in Marathi describing the recruiting board, vacancies, basic criteria, and last date.


Education rules:

10th = SSC / Matriculation
12th = HSC / Intermediate
ITI = ITI / Industrial Training
Diploma = Diploma
Graduate = Bachelor's degree
Postgraduate = Master's degree
PhD = Doctorate

Examples:

B.E / B.Tech:
Graduate + Engineering

M.E / M.Tech:
Postgraduate + Engineering

M.Sc:
Postgraduate + Science

M.Com:
Postgraduate + Commerce

MBBS:
MBBS + Medical

B.Pharm:
Graduate + Pharmacy

M.Pharm:
Postgraduate + Pharmacy

B.Ed:
Graduate + Education

M.Ed:
Postgraduate + Education

MCA:
Postgraduate + Computer/IT

MBA:
Postgraduate + Management

Government classification:

Central Government:
Government of India, Central Government departments,
UPSC, central ministries, central organizations.

State Government:
State government departments, state commissions,
state police, Maharashtra government, etc.

PSU:
Public Sector Undertaking.

Do not classify a private company as government merely because
the job is called "government recruitment".

Location:

Use the actual recruitment/exam/posting locations.

For Maharashtra:
Mumbai, Pune, Thane, Nagpur, Nashik, Aurangabad,
Chhatrapati Sambhajinagar, Kolhapur, Solapur, etc.
Normalize obvious aliases.

Job categories should describe the actual job, not just the
organization.

For example:

Police recruitment -> Police/Law Enforcement

Assistant Professor -> Teaching/Academic

Scientist -> Research/Scientific

Junior Engineer -> Engineering/Technical

Staff Nurse -> Medical/Healthcare

Clerk -> Administration/Clerical

Agriculture Officer -> Agriculture

Legal Officer -> Legal

Software Engineer -> IT/Software
"""


# ============================================================
# SAFE TEXT
# ============================================================

def clean_text(value, max_length=6000):
    """
    Convert database values into safe text for Gemini.
    """
    if value is None:
        return ""

    if isinstance(value, (dict, list)):
        value = json.dumps(value, ensure_ascii=False)

    value = str(value)

    if len(value) > max_length:
        value = value[:max_length] + "\n[TRUNCATED]"

    return value


# ============================================================
# BUILD GEMINI INPUT
# ============================================================

def build_job_context(row):

    return {
        "id": str(row["id"]),
        "title": clean_text(row.get("title"), 2000),
        "description": clean_text(row.get("description"), 8000),
        "qualifications": clean_text(row.get("qualifications"), 4000),
        "employment_type": clean_text(row.get("employment_type"), 1000),
        "selection_process": clean_text(row.get("selection_process"), 3000),
        "exam_cities": clean_text(row.get("exam_cities"), 2000),
        "age_limit": clean_text(row.get("age_limit"), 1000),
        "min_experience_years": row.get("min_experience_years"),
        "max_age_limit": row.get("max_age_limit"),
        "advertisement_details": clean_text(
            row.get("advertisement_details"), 4000
        ),
        "application_details": clean_text(
            row.get("application_details"), 3000
        ),
        "ai_extracted_data": clean_text(
            row.get("ai_extracted_data"), 6000
        ),
        "state_slug": clean_text(row.get("state_slug"), 500),
        "notification_type": clean_text(row.get("notification_type"), 500),
        "is_walk_in": row.get("is_walk_in"),
    }


# ============================================================
# GEMINI CLASSIFICATION
# ============================================================

def classify_batch(rows, max_retries=3):
    """
    Send a batch of rows to Gemini and return JobClassification list.
    Retries with key rotation on quota / rate-limit errors.
    """
    jobs = [build_job_context(row) for row in rows]

    prompt = f"""
Classify the following Indian job/exam notifications.

These records come from a real employment/job notification database
(like FreeJobAlert â€” but with richer filters: education, job,
career, state, city, MPSC, UPSC).

Return one classification object for every input record.

INPUT RECORDS:

{json.dumps(jobs, ensure_ascii=False, indent=2)}
"""

    last_error = None

    for attempt in range(max_retries):
        try:
            client = get_gemini_client()

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=[SYSTEM_PROMPT, prompt],
                config={
                    "response_mime_type": "application/json",
                    "response_json_schema":
                        BatchClassification.model_json_schema(),
                }
            )

            if not response.text:
                raise RuntimeError("Gemini returned empty response")

            result = BatchClassification.model_validate_json(response.text)
            return result.jobs

        except Exception as exc:
            last_error = exc
            err_str = str(exc).lower()

            if "429" in err_str or "quota" in err_str or "rate" in err_str:
                rotate_key()
                wait = (2 ** attempt) + random.uniform(0, 1)
                logger.warning(
                    "Rate limit hit (attempt %d/%d). Waiting %.1fs.",
                    attempt + 1, max_retries, wait
                )
                time.sleep(wait)
            else:
                raise

    raise RuntimeError(
        f"Gemini failed after {max_retries} retries: {last_error}"
    )


# ============================================================
# DATABASE UPDATE
# ============================================================

UPDATE_SQL = """
UPDATE public.exam_notifications
SET
    education_levels            = %(education_levels)s::jsonb,
    education_streams           = %(education_streams)s::jsonb,
    education_qualifications    = %(education_qualifications)s::jsonb,
    job_categories              = %(job_categories)s::jsonb,
    career_streams              = %(career_streams)s::jsonb,
    competitive_exams           = %(competitive_exams)s::jsonb,
    exam_authorities            = %(exam_authorities)s::jsonb,
    state_normalized            = %(state_normalized)s,
    cities_normalized           = %(cities_normalized)s::jsonb,
    government_level            = %(government_level)s,
    recruitment_types           = %(recruitment_types)s::jsonb,
    employment_type_normalized  = %(employment_type_normalized)s,
    selection_methods           = %(selection_methods)s::jsonb,
    experience_min_years_normalized = %(experience_min_years)s,
    experience_max_years_normalized = %(experience_max_years)s,
    is_mpsc                     = %(is_mpsc)s,
    is_upsc                     = %(is_upsc)s,
    is_ssc                      = %(is_ssc)s,
    is_railway                  = %(is_railway)s,
    is_banking                  = %(is_banking)s,
    is_police                   = %(is_police)s,
    is_teaching                 = %(is_teaching)s,
    is_engineering              = %(is_engineering)s,
    is_medical                  = %(is_medical)s,
    is_research                 = %(is_research)s,
    is_govt                     = %(is_govt)s,
    is_central_govt             = %(is_central_govt)s,
    is_state_govt               = %(is_state_govt)s,
    is_psu                      = %(is_psu)s,
    title_mr                    = COALESCE(%(title_mr)s, title_mr),
    summary_mr                  = COALESCE(%(summary_mr)s, summary_mr),
    classification_confidence   = %(confidence)s,
    classification_status       = 'completed',
    classification_error        = NULL,
    classified_by               = %(classified_by)s,
    classified_at               = NOW(),
    classification_version      = %(classification_version)s
WHERE id = %(id)s
"""


def update_job(cur, result):
    """Execute classification UPDATE for one record."""
    params = {
        "id": result.id,
        "education_levels": json.dumps(
            result.education_levels, ensure_ascii=False
        ),
        "education_streams": json.dumps(
            result.education_streams, ensure_ascii=False
        ),
        "education_qualifications": json.dumps(
            result.education_qualifications, ensure_ascii=False
        ),
        "job_categories": json.dumps(
            result.job_categories, ensure_ascii=False
        ),
        "career_streams": json.dumps(
            result.career_streams, ensure_ascii=False
        ),
        "competitive_exams": json.dumps(
            result.competitive_exams, ensure_ascii=False
        ),
        "exam_authorities": json.dumps(
            result.exam_authorities, ensure_ascii=False
        ),
        "state_normalized": result.state_normalized,
        "cities_normalized": json.dumps(
            result.cities_normalized, ensure_ascii=False
        ),
        "government_level": result.government_level,
        "recruitment_types": json.dumps(
            result.recruitment_types, ensure_ascii=False
        ),
        "employment_type_normalized": result.employment_type_normalized,
        "selection_methods": json.dumps(
            result.selection_methods, ensure_ascii=False
        ),
        "experience_min_years": result.experience_min_years,
        "experience_max_years": result.experience_max_years,
        "is_mpsc":        result.is_mpsc,
        "is_upsc":        result.is_upsc,
        "is_ssc":         result.is_ssc,
        "is_railway":     result.is_railway,
        "is_banking":     result.is_banking,
        "is_police":      result.is_police,
        "is_teaching":    result.is_teaching,
        "is_engineering": result.is_engineering,
        "is_medical":     result.is_medical,
        "is_research":    result.is_research,
        "is_govt":        result.is_govt,
        "is_central_govt": result.is_central_govt,
        "is_state_govt":  result.is_state_govt,
        "is_psu":         result.is_psu,
        "title_mr":       result.title_mr.strip() if result.title_mr else None,
        "summary_mr":     result.summary_mr.strip() if result.summary_mr else None,
        "confidence":     result.confidence,
        "classified_by":  MODEL_NAME,
        "classification_version": CLASSIFICATION_VERSION,
    }
    cur.execute(UPDATE_SQL, params)


# ============================================================
# MARK FAILED
# ============================================================

def mark_failed(cur, job_ids, error):
    sql = """
    UPDATE public.exam_notifications
    SET
        classification_status = 'failed',
        classification_error  = %s
    WHERE id = ANY(%s::bigint[])
    """
    cur.execute(
        sql,
        (str(error)[:5000], [int(i) for i in job_ids])
    )


# ============================================================
# FETCH PENDING RECORDS
# ============================================================

FETCH_SQL = """
SELECT
    id,
    organization_id,
    source_id,
    title,
    description,
    employment_type,
    qualifications,
    exam_cities,
    age_limit,
    selection_process,
    min_experience_years,
    max_age_limit,
    advertisement_details,
    application_details,
    ai_extracted_data,
    state_slug,
    is_walk_in,
    notification_type

FROM public.exam_notifications

WHERE
    deleted_at IS NULL
    AND COALESCE(is_archived, FALSE) = FALSE
    AND (
        classification_status IS NULL
        OR classification_status = 'pending'
        OR classification_status = 'failed'
    )

ORDER BY created_at ASC

LIMIT %s
"""


# ============================================================
# DB CONNECTION  (psycopg2, same driver as db.py)
# ============================================================

def get_db_connection():
    """Build psycopg2 connection from DATABASE_URL or individual vars."""
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
# MAIN
# ============================================================

def main():

    logger.info("Starting job classification")
    logger.info("Model      : %s", MODEL_NAME)
    logger.info("Batch size : %s", BATCH_SIZE)
    logger.info("API keys   : %d key(s) loaded", len(GEMINI_API_KEYS))

    total_processed = 0

    conn = get_db_connection()
    logger.info("[pgdb] Connected for classification")

    try:
        while True:

            with conn.cursor(
                cursor_factory=psycopg2.extras.DictCursor
            ) as cur:
                cur.execute(FETCH_SQL, (BATCH_SIZE,))
                rows = [dict(r) for r in cur.fetchall()]

            if not rows:
                logger.info("No more pending records.")
                break

            ids = [str(row["id"]) for row in rows]

            logger.info(
                "Processing %d records: %s", len(rows), ids
            )

            try:
                results = classify_batch(rows)

                result_by_id = {str(r.id): r for r in results}
                missing_ids = []

                with conn.cursor() as cur:
                    for job_id in ids:
                        result = result_by_id.get(job_id)
                        if not result:
                            missing_ids.append(job_id)
                            continue
                        update_job(cur, result)
                        total_processed += 1

                    if missing_ids:
                        logger.warning(
                            "Gemini did not return IDs: %s", missing_ids
                        )
                        mark_failed(
                            cur,
                            missing_ids,
                            "Gemini did not return classification"
                        )

                conn.commit()
                logger.info(
                    "Batch committed. Total so far: %d",
                    total_processed
                )

            except Exception as exc:
                logger.exception("Batch failed: %s", exc)
                conn.rollback()

                try:
                    with conn.cursor() as cur:
                        mark_failed(cur, ids, str(exc))
                    conn.commit()
                except Exception:
                    conn.rollback()

            time.sleep(REQUEST_DELAY)

    finally:
        conn.close()

    logger.info("Finished. Total processed: %d", total_processed)


if __name__ == "__main__":
    main()
