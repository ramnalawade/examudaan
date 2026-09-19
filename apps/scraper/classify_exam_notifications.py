"""
classify_exam_notifications.py
================================
Layers:
  1. Rule engine      -> notification_type hint (last-match-wins)
  2. Date scanner     -> reads important_dates JSON + application_details
                         + ai_extracted_data + free-text regex
  3. Gemini           -> final structured classification
  4. Post-processing  -> TBA rejection, date snap-back, rule snap-back

Uses existing columns where possible:
  apply_start_date, apply_end_date, exam_date,
  notification_type, is_walk_in, important_dates,
  cancellation_ref, cancellation_or_corrigendum_ref, ...
"""

import os
import re
import json
import time
import logging
import random
from datetime import date
from typing import Any, Dict, List, Optional, Tuple

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
GEMINI_API_KEYS: List[str] = [k.strip() for k in _raw_keys.split(",") if k.strip()]
if not GEMINI_API_KEYS:
    raise RuntimeError("GEMINI_API_KEY is missing in .env")

MODEL_NAME    = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")
BATCH_SIZE    = int(os.getenv("BATCH_SIZE", "10"))
REQUEST_DELAY = float(os.getenv("REQUEST_DELAY", "1.0"))

REJECT_TBA_ONLY_RECRUITMENTS = os.getenv(
    "REJECT_TBA_ONLY_RECRUITMENTS", "true"
).lower() in ("1", "true", "yes")

CLASSIFICATION_VERSION = "v2.0"   # bumped: schema-aligned
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
# GEMINI CLIENT — key rotation
# ============================================================

_key_index = 0

def get_gemini_client():
    global _key_index
    return genai.Client(api_key=GEMINI_API_KEYS[_key_index % len(GEMINI_API_KEYS)])

def rotate_key():
    global _key_index
    _key_index = (_key_index + 1) % len(GEMINI_API_KEYS)
    logger.warning("Rotating Gemini API key → index %d", _key_index)


# ============================================================
# NOTIFICATION-TYPE RULES  (unchanged, last-match-wins)
# ============================================================

_NOTIFICATION_TYPE_RULES: List[Tuple[str, List[str]]] = [
    ('recruitment', [
        'recruitment', 'vacancy', 'vacancies', 'bharti',
        'advertisement', 'advt', 'hiring',
        'walk-in', 'walk in', 'walkin', 'naukri',
        'open position', 'open post', 'career opportunity',
        'job notification', 'job opening', 'job advertisement',
        'direct recruitment', 'lateral recruitment',
        'fresh recruitment', 'new recruitment',
        'applications invited', 'application invited',
        'apply online', 'apply now',
    ]),
    ('syllabus', ['syllabus', 'exam pattern', 'curriculum', 'study plan', 'paper pattern']),
    ('admit_card', [
        'admit card', 'hall ticket', 'call letter', 'e-admit', 'e admit',
        'pravesh patra', 'interview letter', 'interview schedule',
    ]),
    ('answer_key', [
        'answer key', 'answerkey', 'answer sheet', 'response sheet',
        'provisional key', 'final key', 'model answer', ' omr ',
    ]),
    ('result', [
        'result', 'merit list', 'score card', 'scorecard', 'final result',
        'provisional result', 'selected candidate', 'selection list',
        'wait list', 'waitlist', 'cut off', 'cutoff',
    ]),
    ('correction', [
        'corrigendum', 'correction', 'amendment', 'erratum',
        'modification', 'revised', 'addendum', 'rectification',
    ]),
]

_WALK_IN_KEYWORDS = ['walk-in', 'walk in', 'walkin', 'walk–in']


def detect_notification_type(title=None, description=None, extra_text=None) -> str:
    haystack = " ".join((t or "").lower() for t in (title, description, extra_text))
    if not haystack.strip():
        return "other"
    matched = None
    for type_name, keywords in _NOTIFICATION_TYPE_RULES:
        if any(kw in haystack for kw in keywords):
            matched = type_name          # last wins
    return matched or "other"


def is_walk_in_title(title: Optional[str]) -> bool:
    t = (title or "").lower()
    return any(kw in t for kw in _WALK_IN_KEYWORDS)


# ============================================================
# DATE EXTRACTION
# ============================================================

_TBA_STANDALONE = {
    'tba', 'tbd', 't.b.a', 't.b.d', 'na', 'n/a', 'null', 'none',
    '-', '--', '—', 'nil', 'pending',
}
_TBA_PHRASES = [
    'to be announced', 'to be advised', 'to be decided',
    'not announced', 'not yet announced', 'announced soon',
    'coming soon', 'will be announced', 'will be notified',
    'will be updated', 'yet to be announced', 'yet to announce',
    'date not available', 'date yet to',
    'जाहीर होणार', 'नंतर जाहीर', 'लवकरच जाहीर', 'तारीख जाहीर',
    'घोषित होगा', 'बाद में', 'शीघ्र', 'तारीख बाद',
]

def _looks_like_tba(value: Any) -> bool:
    if value is None:
        return True
    s = str(value).strip().lower()
    if not s:
        return True
    s_clean = s.strip(' .,;:-—–')
    if s_clean in _TBA_STANDALONE:
        return True
    return any(p in s for p in _TBA_PHRASES)


_MONTHS: Dict[str, int] = {
    'jan': 1, 'january': 1, 'जानेवारी': 1, 'जनवरी': 1,
    'feb': 2, 'february': 2, 'फेब्रुवारी': 2, 'फ़रवरी': 2, 'फरवरी': 2,
    'mar': 3, 'march': 3, 'मार्च': 3,
    'apr': 4, 'april': 4, 'एप्रिल': 4, 'अप्रैल': 4,
    'may': 5, 'मे': 5, 'मई': 5,
    'jun': 6, 'june': 6, 'जून': 6,
    'jul': 7, 'july': 7, 'जुलै': 7, 'जुलाई': 7,
    'aug': 8, 'august': 8, 'ऑगस्ट': 8, 'अगस्त': 8,
    'sep': 9, 'sept': 9, 'september': 9, 'सप्टेंबर': 9, 'सितंबर': 9,
    'oct': 10, 'october': 10, 'ऑक्टोबर': 10, 'अक्टूबर': 10,
    'nov': 11, 'november': 11, 'नोव्हेंबर': 11, 'नवंबर': 11,
    'dec': 12, 'december': 12, 'डिसेंबर': 12, 'दिसंबर': 12,
}

_ISO_RE     = re.compile(r'\b(\d{4})-(\d{1,2})-(\d{1,2})\b')
_NUMERIC_RE = re.compile(r'\b(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})\b')
_NAMED_RE   = re.compile(r'\b(\d{1,2})\s+([A-Za-z\u0900-\u097F]{3,15})\.?\s+(\d{2,4})\b', re.UNICODE)

def _norm_year(y): return y + 2000 if y < 100 else y

def _try_iso_date(s: Any) -> Optional[date]:
    if s is None:
        return None
    text = str(s)
    if _looks_like_tba(text):
        return None
    m = _ISO_RE.search(text)
    if m:
        try:
            y, mo, d = (int(x) for x in m.groups())
            return date(y, mo, d)
        except (ValueError, OverflowError):
            pass
    m = _NUMERIC_RE.search(text)
    if m:
        a, b, c = (int(x) for x in m.groups())
        if a > 12 and b <= 12:   d, mo = a, b
        elif b > 12 and a <= 12: d, mo = b, a
        else:                    d, mo = a, b      # Indian DD/MM default
        try: return date(_norm_year(c), mo, d)
        except (ValueError, OverflowError): pass
    m = _NAMED_RE.search(text)
    if m:
        d_s, mon_s, y_s = m.groups()
        mon = _MONTHS.get(mon_s.lower().rstrip('.'))
        if mon:
            try: return date(_norm_year(int(y_s)), mon, int(d_s))
            except (ValueError, OverflowError): pass
    return None


# -- JSON deep-walk (important_dates is the big one) --

_JSON_DEADLINE_KEYS = {
    'last_date', 'last_date_to_apply', 'application_deadline',
    'deadline', 'closing_date', 'application_end_date', 'apply_by',
    'apply_before', 'last_date_of_application', 'application_last_date',
    'due_date', 'lastdate', 'end_date', 'application_end', 'closingdate',
    'last date', 'last date to apply', 'application last date',
    'apply_end_date', 'apply_end', 'last_date_apply',
}
_JSON_START_KEYS = {
    'start_date', 'application_start_date', 'apply_start_date',
    'registration_start', 'online_application_start', 'from_date',
    'startdate', 'opening_date', 'application_start', 'start date',
    'apply_start',
}
_JSON_EXAM_KEYS = {
    'exam_date', 'exam_dt', 'test_date', 'written_exam_date',
    'examdate', 'exam_on', 'exam date',
}

def _deep_walk_json(obj: Any) -> Dict[str, str]:
    found: Dict[str, str] = {}
    def walk(node):
        if isinstance(node, dict):
            for k, v in node.items():
                kl = str(k).strip().lower()
                if isinstance(v, (str, int, float)) and v is not None:
                    found.setdefault(kl, str(v))
                else:
                    walk(v)
        elif isinstance(node, list):
            for item in node:
                walk(item)
    walk(obj)
    return found

def _parse_json_blob(raw: Any) -> Optional[Any]:
    if raw is None:
        return None
    if isinstance(raw, (dict, list)):
        return raw
    s = str(raw).strip()
    if not (s.startswith('{') or s.startswith('[')):
        return None
    try: return json.loads(s)
    except Exception: return None


# -- Keyword proximity --

_DEADLINE_KEYWORDS = [
    'last date to apply', 'last date', 'last day to apply', 'last day',
    'application deadline', 'application last date', 'application end',
    'closing date', 'closing on', 'apply by', 'apply before',
    'due date', 'submission deadline', 'deadline',
    'शेवटची तारीख', 'अंतिम तारीख', 'अर्ज करण्याची शेवटची तारीख', 'मुदत',
    'आवेदन की अंतिम तारीख', 'अंतिम तिथि',
]
_START_KEYWORDS = [
    'application start', 'apply from', 'registration start',
    'online application start', 'start date', 'from date',
    'starting from', 'commencement', 'opens on',
    'प्रारंभ', 'सुरू',
]
_EXAM_KEYWORDS = [
    'exam date', 'exam on', 'written exam on', 'test date',
    'exam conducted on', 'examination date',
    'परीक्षा तारीख', 'परीक्षा',
]

def _find_date_near_keywords(text: str, keywords: List[str], window: int = 80) -> Optional[date]:
    if not text:
        return None
    lower = text.lower()
    for kw in keywords:
        idx = 0
        while True:
            pos = lower.find(kw, idx)
            if pos == -1:
                break
            snippet = text[max(0, pos - 30): pos + len(kw) + window]
            d = _try_iso_date(snippet)
            if d:
                return d
            idx = pos + len(kw)
    return None


# -- Main date-hint extractor (now reads important_dates) --

def extract_date_hints(row: Dict[str, Any]) -> Dict[str, Optional[str]]:
    out = {
        'apply_start_date': None,
        'apply_end_date':   None,
        'exam_date':        None,
        'deadline_source':  None,
    }

    # Layer 1a — existing DATE columns (highest priority if already filled)
    for src_col, dst in (
        ('apply_start_date', 'apply_start_date'),
        ('apply_end_date',   'apply_end_date'),
        ('exam_date',        'exam_date'),
    ):
        d = _try_iso_date(row.get(src_col))
        if d:
            out[dst] = d.isoformat()
            if dst == 'apply_end_date':
                out['deadline_source'] = 'db_column'

    # Layer 1b — JSON blobs (important_dates is the goldmine)
    for field in (
        'important_dates',       # <<< NEW
        'application_details',
        'ai_extracted_data',
        'advertisement_details',
    ):
        blob = _parse_json_blob(row.get(field))
        if not blob:
            continue
        flat = _deep_walk_json(blob)
        for k, v in flat.items():
            if _looks_like_tba(v):
                continue
            d = _try_iso_date(v)
            if not d:
                continue
            iso = d.isoformat()
            if k in _JSON_DEADLINE_KEYS and not out['apply_end_date']:
                out['apply_end_date'] = iso
                out['deadline_source'] = 'json'
            elif k in _JSON_START_KEYS and not out['apply_start_date']:
                out['apply_start_date'] = iso
            elif k in _JSON_EXAM_KEYS and not out['exam_date']:
                out['exam_date'] = iso

    # Layer 2 — free-text proximity
    haystack = "\n".join(
        str(row.get(f) or '')
        for f in ('title', 'description', 'important_dates',
                  'advertisement_details', 'application_details')
    )
    if not out['apply_end_date']:
        d = _find_date_near_keywords(haystack, _DEADLINE_KEYWORDS)
        if d:
            out['apply_end_date'] = d.isoformat()
            out['deadline_source'] = out['deadline_source'] or 'regex'
    if not out['apply_start_date']:
        d = _find_date_near_keywords(haystack, _START_KEYWORDS)
        if d:
            out['apply_start_date'] = d.isoformat()
    if not out['exam_date']:
        d = _find_date_near_keywords(haystack, _EXAM_KEYWORDS)
        if d:
            out['exam_date'] = d.isoformat()

    return out


def count_tba_markers(row: Dict[str, Any]) -> int:
    text = " ".join(
        str(row.get(f) or '')
        for f in ('important_dates', 'application_details',
                  'advertisement_details', 'description')
    )
    lower = text.lower()
    n = sum(lower.count(p) for p in _TBA_PHRASES)
    for s in _TBA_STANDALONE:
        if not s.strip(' .,;:-—–'):
            continue
        n += len(re.findall(rf'(?<![\w]){re.escape(s)}(?![\w])', lower))
    return n


# ============================================================
# OUTPUT MODEL  (aligned to existing DB columns)
# ============================================================

class JobClassification(BaseModel):

    id: str

    # --- new fields ---
    notification_category: str = Field(
        default="Other",
        description="One of: Recruitment, Walk-in, Jobs, Other."
    )
    is_job_notification: bool = Field(
        default=False,
        description="True only for recruitment / walk_in / job types."
    )
    rejection_reason: Optional[str] = None

    # --- reuses notification_type column ---
    notification_type: str = Field(
        default="other",
        description=(
            "One of: recruitment, walk_in, job, syllabus, admit_card, "
            "answer_key, result, correction, other."
        )
    )

    # --- reuses apply_start_date / apply_end_date / exam_date columns ---
    apply_start_date: Optional[str] = Field(default=None, description="ISO YYYY-MM-DD")
    apply_end_date:   Optional[str] = Field(default=None, description="ISO YYYY-MM-DD")
    exam_date:        Optional[str] = Field(default=None, description="ISO YYYY-MM-DD")
    dates_are_tba:    bool = False

    # --- existing columns, unchanged ---
    education_levels: List[str] = Field(default_factory=list)
    education_streams: List[str] = Field(default_factory=list)
    education_qualifications: List[str] = Field(default_factory=list)
    job_categories: List[str] = Field(default_factory=list)
    career_streams: List[str] = Field(default_factory=list)
    competitive_exams: List[str] = Field(default_factory=list)
    exam_authorities: List[str] = Field(default_factory=list)
    state_normalized: Optional[str] = None
    cities_normalized: List[str] = Field(default_factory=list)
    government_level: Optional[str] = None
    recruitment_types: List[str] = Field(default_factory=list)
    employment_type_normalized: Optional[str] = None
    selection_methods: List[str] = Field(default_factory=list)
    experience_min_years: Optional[int] = None
    experience_max_years: Optional[int] = None

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

    title_mr: Optional[str] = None
    summary_mr: Optional[str] = None
    confidence: float = Field(default=0.0, ge=0, le=1)


class BatchClassification(BaseModel):
    jobs: List[JobClassification]


# ============================================================
# PROMPT
# ============================================================

SYSTEM_PROMPT = """
You are a professional Indian government-job classification engine.

═══════════════════════════════════════════════════════════
RULE-BASED HINTS (AUTHORITATIVE)
═══════════════════════════════════════════════════════════

Each record carries:
  • rule_notification_type  – keyword engine output (last-match-wins)
  • date_hints              – deterministic date scanner output
                              (apply_start_date / apply_end_date /
                               exam_date / deadline_source)

Treat rule_notification_type as the notification_type unless the
description clearly contradicts it. Treat date_hints as high-confidence
starting points — override only on clear contradiction.

═══════════════════════════════════════════════════════════
STEP 1 — notification_type
═══════════════════════════════════════════════════════════
recruitment | walk_in | job | syllabus | admit_card |
answer_key | result | correction | other

═══════════════════════════════════════════════════════════
STEP 2 — notification_category
═══════════════════════════════════════════════════════════
recruitment → Recruitment
walk_in     → Walk-in
job         → Jobs
anything else → Other

═══════════════════════════════════════════════════════════
STEP 3 — DATES  (ISO 8601 ONLY)
═══════════════════════════════════════════════════════════

Return:
    apply_start_date   (window opens)
    apply_end_date     (last date to apply)
    exam_date          (exam/interview date)

RULES:
1. Format ALWAYS YYYY-MM-DD.
2. If date_hints supplies a value, use it verbatim unless clearly wrong.
3. Understand DD/MM/YYYY, DD-MMM-YYYY, and Marathi/Hindi months
   (जानेवारी…डिसेंबर, जनवरी…दिसंबर).
4. Handle "extended to …" — LATER date wins.
5. "01/03/2026 to 31/03/2026" → start=first, end=second.

TBA (VERY IMPORTANT):
If a date is described as TBA / TBD / N/A / NA / null / "-" / "Pending" /
"to be announced" / "will be notified" / "announced soon" / "coming soon" /
"जाहीर होणार" / "नंतर जाहीर" / "घोषित होगा" / "बाद में" →
  • set that date field to null
  • set dates_are_tba = true
NEVER echo TBA-style strings inside a date field.

═══════════════════════════════════════════════════════════
STEP 4 — is_job_notification
═══════════════════════════════════════════════════════════

Start:
    is_job_notification = notification_type in
        {recruitment, walk_in, job}

Override:
    If notification_type in {recruitment, walk_in}
       AND apply_start_date, apply_end_date, exam_date are ALL null
       AND dates_are_tba = true
    → is_job_notification = false
    → notification_category = "Other"
    → rejection_reason = "Only TBA dates — no actionable deadline"

When is_job_notification = false:
    rejection_reason = short reason
    title_mr = summary_mr = null
    all lists = [], all Optionals = null, all bools = false
    confidence ≤ 0.3

═══════════════════════════════════════════════════════════
NEGATIVE EXAMPLE — MUST BE Other
═══════════════════════════════════════════════════════════
{
  "note": "No charges shall be levied on the policyholder for porting-in or porting-out.",
  "process": "A policyholder desirous of porting his/her policy shall apply ...",
  "required_documents": []
}
→ is_job_notification=false, notification_type='other',
  rejection_reason='Insurance policy porting guidelines — not a job'.

═══════════════════════════════════════════════════════════
GENERAL RULES
═══════════════════════════════════════════════════════════
• Never invent qualifications, locations, or dates.
• MPSC/UPSC only when actually mentioned.
• Understand Marathi/Hindi text.
• Fill title_mr and summary_mr ONLY when is_job_notification = true.
• Return ONLY the requested JSON.

EDUCATION
10th=SSC; 12th=HSC; ITI; Diploma; Graduate; Postgraduate; PhD.
B.E/B.Tech→Graduate+Engineering; M.E/M.Tech→PG+Engineering;
M.Sc→PG+Science; M.Com→PG+Commerce; MBBS→MBBS+Medical;
B.Pharm→Graduate+Pharmacy; M.Pharm→PG+Pharmacy;
B.Ed→Graduate+Education; M.Ed→PG+Education;
MCA→PG+Computer/IT; MBA→PG+Management.

GOVERNMENT LEVEL
Central / State / PSU / Local / Autonomous / Private / Mixed / Unknown.
"""


# ============================================================
# HELPERS
# ============================================================

def clean_text(value, max_length=6000) -> str:
    if value is None:
        return ""
    if isinstance(value, (dict, list)):
        value = json.dumps(value, ensure_ascii=False)
    value = str(value)
    if len(value) > max_length:
        value = value[:max_length] + "\n[TRUNCATED]"
    return value


def build_job_context(row: Dict[str, Any]) -> Dict[str, Any]:
    title = row.get("title")
    description = row.get("description")

    rule_type = detect_notification_type(
        title, description, row.get("notification_type")
    )
    if rule_type == "recruitment" and is_walk_in_title(title):
        rule_type = "walk_in"

    # if DB already has is_walk_in = TRUE, prefer walk_in
    if row.get("is_walk_in") and rule_type in ("recruitment", "walk_in"):
        rule_type = "walk_in"

    # if cancellation ref exists, treat as correction
    if row.get("cancellation_ref") or row.get("cancellation_or_corrigendum_ref"):
        if rule_type in ("recruitment", "other"):
            rule_type = "correction"

    date_hints = extract_date_hints(row)

    return {
        "id": str(row["id"]),
        "rule_notification_type": rule_type,
        "date_hints": date_hints,
        "title": clean_text(title, 2000),
        "description": clean_text(description, 8000),
        "important_dates": clean_text(row.get("important_dates"), 3000),
        "qualifications": clean_text(row.get("qualifications"), 4000),
        "employment_type": clean_text(row.get("employment_type"), 1000),
        "selection_process": clean_text(row.get("selection_process"), 3000),
        "exam_cities": clean_text(row.get("exam_cities"), 2000),
        "age_limit": clean_text(row.get("age_limit"), 1000),
        "min_experience_years": row.get("min_experience_years"),
        "max_age_limit": row.get("max_age_limit"),
        "advertisement_details": clean_text(row.get("advertisement_details"), 4000),
        "application_details": clean_text(row.get("application_details"), 3000),
        "ai_extracted_data": clean_text(row.get("ai_extracted_data"), 6000),
        "state_slug": clean_text(row.get("state_slug"), 500),
        "is_walk_in": row.get("is_walk_in"),
        "total_vacancies": row.get("total_vacancies"),
        "advt_no": clean_text(row.get("advt_no"), 200),
    }


# ============================================================
# GEMINI CALL
# ============================================================

def classify_batch(rows, max_retries=3):
    jobs = [build_job_context(row) for row in rows]

    prompt = f"""
Classify the following Indian job/exam notifications.

Use rule_notification_type as authoritative notification_type.
Use date_hints (apply_start_date / apply_end_date / exam_date) as
high-confidence starting points.

Return ISO 8601 dates. If a date is TBA/TBD/"announced soon"/Marathi-
Hindi equivalent → return null and set dates_are_tba = true.

Return one object for every input record.

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
            return BatchClassification.model_validate_json(response.text).jobs
        except Exception as exc:
            last_error = exc
            err_str = str(exc).lower()
            if "429" in err_str or "quota" in err_str or "rate" in err_str:
                rotate_key()
                wait = (2 ** attempt) + random.uniform(0, 1)
                logger.warning(
                    "Rate limit hit (%d/%d). Waiting %.1fs.",
                    attempt + 1, max_retries, wait
                )
                time.sleep(wait)
            else:
                raise

    raise RuntimeError(f"Gemini failed after {max_retries} retries: {last_error}")


# ============================================================
# DB UPDATE  (only existing + 3 new columns)
# ============================================================

UPDATE_SQL = """
UPDATE public.exam_notifications
SET
    -- new columns
    notification_category       = %(notification_category)s,
    is_job_notification         = %(is_job_notification)s,
    rejection_reason            = %(rejection_reason)s,
    rule_notification_type      = %(rule_notification_type)s,
    deadline_source             = %(deadline_source)s,
    dates_are_tba               = %(dates_are_tba)s,

    -- reuse existing columns
    notification_type           = %(notification_type)s,
    apply_start_date            = %(apply_start_date)s::date,
    apply_end_date              = %(apply_end_date)s::date,
    exam_date                   = %(exam_date)s::date,
    is_walk_in                  = %(is_walk_in)s,

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

    is_mpsc = %(is_mpsc)s, is_upsc = %(is_upsc)s,
    is_ssc  = %(is_ssc)s,  is_railway = %(is_railway)s,
    is_banking = %(is_banking)s, is_police = %(is_police)s,
    is_teaching = %(is_teaching)s, is_engineering = %(is_engineering)s,
    is_medical = %(is_medical)s, is_research = %(is_research)s,
    is_govt = %(is_govt)s, is_central_govt = %(is_central_govt)s,
    is_state_govt = %(is_state_govt)s, is_psu = %(is_psu)s,

    title_mr    = COALESCE(%(title_mr)s, title_mr),
    summary_mr  = COALESCE(%(summary_mr)s, summary_mr),

    classification_confidence = %(confidence)s,
    classification_status     = 'completed',
    classification_error      = NULL,
    classified_by             = %(classified_by)s,
    classified_at             = NOW(),
    classification_version    = %(classification_version)s
WHERE id = %(id)s
"""


def _safe_date_str(val: Any) -> Optional[str]:
    if not val:
        return None
    if _looks_like_tba(val):
        return None
    d = _try_iso_date(val)
    return d.isoformat() if d else None


def update_job(cur, result: JobClassification, rule_type: str, deadline_source):
    params = {
        "id": result.id,

        # new
        "notification_category": result.notification_category,
        "is_job_notification": result.is_job_notification,
        "rejection_reason": result.rejection_reason,
        "rule_notification_type": rule_type,
        "deadline_source": deadline_source,
        "dates_are_tba": result.dates_are_tba,

        # existing
        "notification_type": result.notification_type,
        "apply_start_date": _safe_date_str(result.apply_start_date),
        "apply_end_date":   _safe_date_str(result.apply_end_date),
        "exam_date":        _safe_date_str(result.exam_date),
        "is_walk_in": result.notification_type == "walk_in",

        "education_levels": json.dumps(result.education_levels, ensure_ascii=False),
        "education_streams": json.dumps(result.education_streams, ensure_ascii=False),
        "education_qualifications": json.dumps(result.education_qualifications, ensure_ascii=False),
        "job_categories": json.dumps(result.job_categories, ensure_ascii=False),
        "career_streams": json.dumps(result.career_streams, ensure_ascii=False),
        "competitive_exams": json.dumps(result.competitive_exams, ensure_ascii=False),
        "exam_authorities": json.dumps(result.exam_authorities, ensure_ascii=False),
        "state_normalized": result.state_normalized,
        "cities_normalized": json.dumps(result.cities_normalized, ensure_ascii=False),
        "government_level": result.government_level,
        "recruitment_types": json.dumps(result.recruitment_types, ensure_ascii=False),
        "employment_type_normalized": result.employment_type_normalized,
        "selection_methods": json.dumps(result.selection_methods, ensure_ascii=False),
        "experience_min_years": result.experience_min_years,
        "experience_max_years": result.experience_max_years,

        "is_mpsc": result.is_mpsc, "is_upsc": result.is_upsc,
        "is_ssc": result.is_ssc, "is_railway": result.is_railway,
        "is_banking": result.is_banking, "is_police": result.is_police,
        "is_teaching": result.is_teaching, "is_engineering": result.is_engineering,
        "is_medical": result.is_medical, "is_research": result.is_research,
        "is_govt": result.is_govt, "is_central_govt": result.is_central_govt,
        "is_state_govt": result.is_state_govt, "is_psu": result.is_psu,

        "title_mr":   result.title_mr.strip() if result.title_mr else None,
        "summary_mr": result.summary_mr.strip() if result.summary_mr else None,
        "confidence": result.confidence,
        "classified_by": MODEL_NAME,
        "classification_version": CLASSIFICATION_VERSION,
    }
    cur.execute(UPDATE_SQL, params)


def mark_failed(cur, job_ids, error):
    cur.execute(
        """
        UPDATE public.exam_notifications
        SET classification_status = 'failed',
            classification_error  = %s
        WHERE id = ANY(%s::bigint[])
        """,
        (str(error)[:5000], [int(i) for i in job_ids])
    )


# ============================================================
# FETCH  (now includes important_dates + cancellation refs)
# ============================================================

FETCH_SQL = """
SELECT
    id, title, description, important_dates,
    apply_start_date, apply_end_date, exam_date,
    qualifications, employment_type, selection_process,
    exam_cities, age_limit, min_experience_years, max_age_limit,
    advertisement_details, application_details, ai_extracted_data,
    state_slug, is_walk_in, notification_type,
    cancellation_ref, cancellation_or_corrigendum_ref,
    total_vacancies, advt_no
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


def get_db_connection():
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
    logger.info("Starting job classification (v%s)", CLASSIFICATION_VERSION)
    logger.info("Model      : %s", MODEL_NAME)
    logger.info("Batch size : %s", BATCH_SIZE)
    logger.info("API keys   : %d", len(GEMINI_API_KEYS))
    logger.info("Reject TBA-only recruitments: %s", REJECT_TBA_ONLY_RECRUITMENTS)

    total_processed = 0
    total_rejected_tba = 0
    conn = get_db_connection()

    try:
        while True:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                cur.execute(FETCH_SQL, (BATCH_SIZE,))
                rows = [dict(r) for r in cur.fetchall()]

            if not rows:
                logger.info("No more pending records.")
                break

            ids = [str(r["id"]) for r in rows]

            row_hints = {}
            for row in rows:
                rt = detect_notification_type(
                    row.get("title"), row.get("description"),
                    row.get("notification_type"),
                )
                if rt == "recruitment" and is_walk_in_title(row.get("title")):
                    rt = "walk_in"
                if row.get("is_walk_in") and rt in ("recruitment", "walk_in"):
                    rt = "walk_in"
                if (row.get("cancellation_ref")
                        or row.get("cancellation_or_corrigendum_ref")) \
                        and rt in ("recruitment", "other"):
                    rt = "correction"

                row_hints[str(row["id"])] = {
                    "rule_type": rt,
                    "date_hints": extract_date_hints(row),
                    "tba_count": count_tba_markers(row),
                }

            logger.info("Processing %d records", len(rows))

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

                        hint = row_hints[job_id]
                        rule_type = hint["rule_type"]
                        date_hints = hint["date_hints"]

                        # 1) snap-back rule types
                        if rule_type in (
                            "syllabus", "admit_card", "answer_key",
                            "result", "correction",
                        ):
                            result.notification_type = rule_type
                            result.notification_category = "Other"
                            result.is_job_notification = False
                            if not result.rejection_reason:
                                result.rejection_reason = (
                                    f"{rule_type.replace('_', ' ').title()} "
                                    f"notice — not a fresh job posting"
                                )
                        elif rule_type == "walk_in":
                            result.notification_type = "walk_in"
                            result.notification_category = "Walk-in"
                            result.is_job_notification = True
                        elif rule_type == "recruitment":
                            if result.notification_category not in (
                                "Recruitment", "Walk-in", "Jobs"
                            ):
                                result.notification_category = "Recruitment"
                            result.is_job_notification = True

                        # 2) strip TBA from dates
                        result.apply_start_date = _safe_date_str(result.apply_start_date)
                        result.apply_end_date   = _safe_date_str(result.apply_end_date)
                        result.exam_date        = _safe_date_str(result.exam_date)

                        # 3) snap-back dates from deterministic hints
                        if not result.apply_start_date and date_hints["apply_start_date"]:
                            result.apply_start_date = date_hints["apply_start_date"]
                        if not result.apply_end_date and date_hints["apply_end_date"]:
                            result.apply_end_date = date_hints["apply_end_date"]
                        if not result.exam_date and date_hints["exam_date"]:
                            result.exam_date = date_hints["exam_date"]

                        # 4) deadline_source audit
                        if date_hints["deadline_source"] and (
                            result.apply_end_date == date_hints["apply_end_date"]
                        ):
                            deadline_source = date_hints["deadline_source"]
                        elif result.apply_end_date:
                            deadline_source = "gemini"
                        else:
                            deadline_source = None

                        # 5) TBA-only rejection
                        all_null = not any([
                            result.apply_start_date,
                            result.apply_end_date,
                            result.exam_date,
                        ])
                        if (REJECT_TBA_ONLY_RECRUITMENTS
                                and result.is_job_notification
                                and rule_type in ("recruitment", "walk_in")
                                and all_null
                                and (result.dates_are_tba or hint["tba_count"] >= 1)):
                            result.is_job_notification = False
                            result.notification_category = "Other"
                            result.dates_are_tba = True
                            result.rejection_reason = (
                                "Only TBA dates — no actionable deadline, "
                                "treated as not-a-job"
                            )
                            total_rejected_tba += 1

                        update_job(cur, result, rule_type, deadline_source)
                        total_processed += 1

                    if missing_ids:
                        logger.warning("Gemini did not return IDs: %s", missing_ids)
                        mark_failed(cur, missing_ids,
                                    "Gemini did not return classification")

                conn.commit()
                logger.info(
                    "Batch committed. Total: %d (TBA-rejected: %d)",
                    total_processed, total_rejected_tba
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

    logger.info("Finished. Total: %d (TBA-rejected: %d)",
                total_processed, total_rejected_tba)


if __name__ == "__main__":
    main()