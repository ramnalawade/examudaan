#!/usr/bin/env python3
"""
run_scraper.py — ExamUdaan full pipeline runner
================================================
Runs the complete scraping + enrichment + translation pipeline:

  Step 1 — Scrapy spiders        (parallel, configurable)
  Step 2 — Notification enrich   (Gemini fills dates, vacancies, fee from PDF or HTML)
  Step 3 — PDF date enrich       (Gemini vision for scanned PDFs with missing dates)
  Step 4 — Marathi translation
  Step 5 — Summary email

Usage:
    python run_scraper.py                         # run everything
    python run_scraper.py --spider mppsc          # run one spider only
    python run_scraper.py --parallel 6            # 6 spiders at a time (default: 4)
    python run_scraper.py --dry-run               # print commands, don\'t execute
    python run_scraper.py --skip-enrich           # skip notification enrichment
    python run_scraper.py --enrich-limit 100      # enrich up to 100 records (default: 50)
    python run_scraper.py --skip-pdf-enrich       # skip PDF date enrichment
    python run_scraper.py --pdf-limit 50          # enrich up to 50 PDFs (default: 30)
    python run_scraper.py --skip-translation      # skip Marathi translation
    python run_scraper.py --no-email              # skip summary email

Scheduled runs: see cron_setup.md for Linux cron and Windows Task Scheduler.
"""

import argparse
import json
import logging
import os
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime
from pathlib import Path
from typing import Optional

# ---- Third-party (only imported when PDF enrichment step runs) ----
# requests, psycopg2, google-genai — already in .venv requirements

# ---- Config ----
SCRAPER_DIR  = Path(__file__).parent.resolve()
LOG_DIR      = SCRAPER_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)

# How many spiders to run simultaneously.
# Keep at 4 by default — each spider opens DB connections + may call Gemini API.
# Raise to 6-8 on a server with more RAM.
DEFAULT_PARALLEL = 4

# Ordered list of spiders to run
# Names must match `scrapy list` output exactly
SPIDERS = [
    # --- RSS Feeds (fastest — polls 35+ official feeds) ---
    "rss",

    # --- Central Government (high-value) ---
    "ssc",
    "upsc",
    "rrb",
    "ibps",
    "sbi",
    "nta",
    "employment_news",

    # --- Defense / Armed Forces ---
    "army_agniveer",        # Indian Army Agniveer
    "navy_airforce",        # Indian Navy + Air Force (AFCAT)

    # --- Teaching / Education ---
    "ctet",                 # CTET + State TETs (7 portals)

    # --- Health / Medical ----
    "aiims_central",        # AIIMS Exams + PGIMER + JIPMER + ESIC

    # --- PSU Mega (20+ Insurance, Energy, Infrastructure, Autonomous) ---
    "psu_mega",             # UIIC, NIACL, LIC, NTPC, ONGC, IOCL, PGCIL, DRDO, BARC, HAL, BEL, AAI, DMRC, FCI, ESIC etc.

    # --- Central PSUs (individual spiders) ---
    "nabard",
    "isro",
    "ongc",

    # --- State PSCs — All Major States ---
    "bpsc",            # Bihar
    "bssc",            # Bihar SSC
    "rpsc",            # Rajasthan
    "rsmssb",          # Rajasthan SSB
    "gpsc",            # Gujarat
    "ppsc",            # Punjab
    "tnpsc",           # Tamil Nadu
    "hpsc",            # Haryana PSC
    "hssc",            # Haryana SSC
    "tspsc",           # Telangana
    "appsc",           # Andhra Pradesh
    "opsc",            # Odisha
    "wbpsc",           # West Bengal
    "jpsc",            # Jharkhand
    "cgpsc",           # Chhattisgarh
    "ukpsc",           # Uttarakhand
    "hppsc",           # Himachal Pradesh
    "kpsc",            # Karnataka
    "keralapsc",       # Kerala
    "goapsc",          # Goa
    "mppsc",           # Madhya Pradesh
    "upsssc",          # Uttar Pradesh SSC
    "uppbpb",          # UP Police Recruitment Board
    "jkssb",           # J&K Services Selection Board (new)

    # --- High Courts (13 state high courts) ---
    "high_courts",

    # --- Maharashtra State & Police ---
    "mpsc_crawl4ai",
    "mahapolice",
    "srpf",
    "maharashtra_prisons",

    # --- Maharashtra Municipal Corporations ---
    "bmc",
    "pmc",
    "tmc",
    "thane_police",

    # --- Research / Science Institutes ---
    "icar_circot",
    "icar_nbsslup",
    "csir_neeri",
    "actrec",
    "aiims_nagpur",
    "iips_mumbai",
    "iiser_pune",
    "ict_mumbai",

    # --- Infrastructure / PSU ---
    "konkan_railway",
    "mecl",
    "moil",
    "pdkv_akola",

    # --- Central Armed Forces & Police ---
    "central_armed_forces",   # India Post GDS, Coast Guard, CRPF, BSF, CISF, SSB, ITBP, Assam Rifles, Delhi Police

    # --- Financial Regulators & Development Banks ---
    "financial_regulators",   # RBI, SEBI, NHB, NABARD, SIDBI, EXIM Bank, FCI, IRDAI, PFRDA, NPCI

    # --- National Health Mission (20 states) ---
    "nhm",                    # ANM, Staff Nurse, CHO, Lab Tech — 20 state NHM portals

    # --- Central PSU (Energy / Steel / Oil / Defence / Infrastructure) ---
    "central_psu",            # NTPC, BHEL, SAIL, GAIL, HAL, BEL, DRDO, BARC, AAI, HPCL, BPCL, IOCL, NLC, NMDC...

    # --- Maharashtra Municipal Corporations (beyond BMC/PMC/TMC) ---
    "maha_municipalities",    # Nashik, Nagpur, Aurangabad, Solapur, Kolhapur, NMMC, PCMC, KDMC...

    # --- State Education & Teacher Recruitment ---
    "state_education",        # KVS, NVS, DSSSB, REET, HTET, TN TRB, Maha Pariksha Parishad, UP BEB...

    # --- Central Ministries & Constitutional Bodies ---
    "central_ministries",     # Supreme Court, Lok Sabha, CAG, ECI, CBIC, Income Tax, DGHS, Prasar Bharati...

    # --- Multi-site & AI Assisted ---
    "multi_govt_jobs",
    "ai_spider",
]

# Python executable — use venv python if present
_VENV_PYTHON = SCRAPER_DIR / ".venv" / "Scripts" / "python.exe"   # Windows
if not _VENV_PYTHON.exists():
    _VENV_PYTHON = SCRAPER_DIR / ".venv" / "bin" / "python"       # Linux/macOS
PYTHON_EXE = str(_VENV_PYTHON) if _VENV_PYTHON.exists() else sys.executable


def setup_logging(run_ts: str):
    """Configure file + console logging for this run."""
    log_file = LOG_DIR / f"scraper_{run_ts}.log"
    import io
    # Force UTF-8 on stdout so emoji/unicode chars don't crash on Windows cp1252
    stdout_handler = logging.StreamHandler(io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace'))
    stdout_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    file_handler = logging.FileHandler(log_file, encoding="utf-8")
    file_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    logging.basicConfig(
        level=logging.INFO,
        handlers=[file_handler, stdout_handler],
    )
    return logging.getLogger("run_scraper"), log_file


def run_spider(spider_name: str, logger: logging.Logger, dry_run: bool = False) -> tuple[str, bool, str]:
    """
    Run a single Scrapy spider in a subprocess.
    Returns (spider_name, success_bool, duration_str).
    Safe to call from multiple threads simultaneously.
    """
    cmd = [
        PYTHON_EXE, "-m", "scrapy", "crawl", spider_name,
        "-s", "LOG_LEVEL=INFO",
    ]

    logger.info(f"[>] Starting spider: {spider_name}")

    if dry_run:
        logger.info(f"   [DRY RUN] Would run: {' '.join(cmd)}")
        return spider_name, True, "0s"

    start = datetime.now()
    try:
        result = subprocess.run(
            cmd,
            cwd=str(SCRAPER_DIR),
            capture_output=False,   # output goes to this process's stdout
            timeout=1800,           # 30-minute safety timeout per spider (was 2h)
                                    # With 10-page limit each spider should finish in <5 min
        )
        elapsed = datetime.now() - start
        duration_str = str(elapsed).split('.')[0]
        if result.returncode == 0:
            logger.info(f"[OK] Spider '{spider_name}' finished in {duration_str}")
            return spider_name, True, duration_str
        else:
            logger.error(f"[FAIL] Spider '{spider_name}' exited with code {result.returncode} after {duration_str}")
            return spider_name, False, duration_str
    except subprocess.TimeoutExpired:
        logger.error(f"[TIMEOUT] Spider '{spider_name}' timed out after 30 minutes!")
        return spider_name, False, "30m (timeout)"
    except Exception as exc:
        logger.error(f"[ERROR] Spider '{spider_name}' crashed: {exc}")
        return spider_name, False, "crashed"


def run_all_parallel(spiders: list, logger: logging.Logger, max_parallel: int, dry_run: bool) -> dict:
    """
    Run all spiders in parallel using a thread pool.
    At most max_parallel spiders run simultaneously.

    Each spider is an independent subprocess — threads just wait for them.
    DB connections and Gemini keys are per-process so there's no shared state conflict.
    """
    results = {}
    total = len(spiders)

    logger.info(f"Running {total} spiders with max_parallel={max_parallel}")
    logger.info(f"Estimated time: ~{max(1, total // max_parallel) * 5}–{max(1, total // max_parallel) * 10} minutes")

    with ThreadPoolExecutor(max_workers=max_parallel) as executor:
        # Submit all spiders to the pool
        future_to_spider = {
            executor.submit(run_spider, name, logger, dry_run): name
            for name in spiders
        }

        # Collect results as they complete
        for future in as_completed(future_to_spider):
            spider_name, success, duration_str = future.result()
            results[spider_name] = {
                "status": "OK" if success else "FAIL",
                "duration": duration_str,
            }
            done = len(results)
            logger.info(f"[{done}/{total}] '{spider_name}' → {'OK' if success else 'FAIL'} ({duration_str})")

    return results


# ============================================================
# STEP 2 — NOTIFICATION ENRICHMENT  (enrich_notifications.py)
# ============================================================

def run_enrich_notifications(
    logger: logging.Logger,
    dry_run: bool = False,
    limit: int = 50,
):
    """
    Step 2: Run enrich_notifications.py to fill in missing structured fields
    (apply dates, vacancies, fee, age limit, qualifications, salary) for newly
    scraped records.

    Handles both:
      - Records with an HTML description (uses Gemini text extraction)
      - Records where source_url is a PDF (uses Gemini vision — works for scanned PDFs)

    Runs as a subprocess so it gets its own process + Gemini key context.
    """
    enrich_script = SCRAPER_DIR / "enrich_notifications.py"
    if not enrich_script.exists():
        logger.warning("[ENRICH] %s not found — skipping enrichment.", enrich_script)
        return

    cmd = [
        PYTHON_EXE, str(enrich_script),
        "--limit", str(limit),
    ]

    logger.info("=" * 60)
    logger.info("[ENRICH] Step 2: Notification enrichment (dates, vacancies, fee, PDF vision)")
    logger.info("[ENRICH] Limit: %d records", limit)

    if dry_run:
        logger.info("[ENRICH] DRY RUN — would run: %s", ' '.join(cmd))
        return

    start = datetime.now()
    try:
        result = subprocess.run(
            cmd,
            cwd=str(SCRAPER_DIR),
            timeout=3600,   # 60-minute safety timeout (PDF vision is slower)
        )
        elapsed = datetime.now() - start
        if result.returncode == 0:
            logger.info("[ENRICH] Finished in %s", str(elapsed).split('.')[0])
        else:
            logger.warning(
                "[ENRICH] Exited with code %d after %s",
                result.returncode, str(elapsed).split('.')[0]
            )
    except subprocess.TimeoutExpired:
        logger.error("[ENRICH] Timed out after 60 minutes!")
    except Exception as exc:
        logger.error("[ENRICH] Failed: %s", exc)


# ============================================================
# STEP 3 — PDF DATE ENRICHMENT  (Gemini vision)
# ============================================================
# Many state PSC PDFs (MPPSC, etc.) are scanned images — pdfplumber
# returns 0 chars. We send them inline to Gemini vision to extract
# the important dates table. Runs after all spiders finish.

# --- Gemini helpers (lazy-loaded so no import error if google-genai not installed) ---

_GEMINI_KEYS: list = []
_GEMINI_KEY_INDEX: int = 0
_GEMINI_MODEL: str = ""
_DATABASE_URL: str = ""

def _init_gemini_config():
    """Load Gemini config from env. Called once before enrichment step."""
    global _GEMINI_KEYS, _GEMINI_MODEL, _DATABASE_URL
    from dotenv import load_dotenv
    load_dotenv()
    raw = os.environ.get("GEMINI_API_KEY", "")
    _GEMINI_KEYS = [k.strip() for k in raw.split(",") if k.strip()]
    _GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")
    _DATABASE_URL = os.getenv("DATABASE_URL", "")

def _gemini_client():
    """Return Gemini client using current key."""
    from google import genai
    return genai.Client(api_key=_GEMINI_KEYS[_GEMINI_KEY_INDEX % len(_GEMINI_KEYS)])

def _rotate_gemini_key(logger, reason=""):
    global _GEMINI_KEY_INDEX
    _GEMINI_KEY_INDEX = (_GEMINI_KEY_INDEX + 1) % max(len(_GEMINI_KEYS), 1)
    logger.warning("[PDF-ENRICH] Gemini key rotated -> index %d (%s)", _GEMINI_KEY_INDEX, reason)

# --- Date validation ---

_ISO_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

def _is_valid_iso_date(s) -> bool:
    if not s or str(s) == "null":
        return False
    if not _ISO_DATE_RE.match(str(s).strip()):
        return False
    try:
        parts = str(s).strip().split("-")
        date(int(parts[0]), int(parts[1]), int(parts[2]))
        return True
    except (ValueError, IndexError):
        return False

def _safe_iso_date(s) -> Optional[str]:
    return str(s).strip() if _is_valid_iso_date(s) else None

# --- Gemini prompt ---

_PDF_EXTRACTION_PROMPT = """
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

_MAX_PDF_BYTES = 15 * 1024 * 1024  # 15 MB Gemini inline limit
_PDF_HEADERS   = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def _download_pdf(url: str, logger) -> Optional[bytes]:
    """Download a PDF URL, return bytes or None."""
    import requests
    try:
        r = requests.get(url, headers=_PDF_HEADERS, timeout=30)
        r.raise_for_status()
        if len(r.content) > _MAX_PDF_BYTES:
            logger.warning("[PDF-ENRICH] PDF too large (%d bytes): %s", len(r.content), url)
            return None
        return r.content
    except Exception as e:
        logger.error("[PDF-ENRICH] Download failed %s: %s", url, e)
        return None

def _extract_dates_via_gemini(pdf_bytes: bytes, logger) -> Optional[dict]:
    """Send PDF inline to Gemini vision, return parsed dates dict or None."""
    from google.genai import types
    for attempt in range(len(_GEMINI_KEYS)):
        try:
            client = _gemini_client()
            response = client.models.generate_content(
                model=_GEMINI_MODEL,
                contents=[
                    types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf"),
                    _PDF_EXTRACTION_PROMPT
                ]
            )
            raw = response.text.strip()
            # Strip markdown code fences if the model adds them
            if "```" in raw:
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
                raw = raw.strip()
            return json.loads(raw)
        except Exception as exc:
            err = str(exc)
            if "401" in err or "UNAUTHENTICATED" in err:
                _rotate_gemini_key(logger, "401 expired")
            elif "429" in err or "quota" in err.lower():
                _rotate_gemini_key(logger, "rate limit")
                time.sleep(2 ** attempt)
            else:
                logger.error("[PDF-ENRICH] Gemini error: %s", err[:300])
                return None
    logger.error("[PDF-ENRICH] All Gemini keys exhausted")
    return None

def _resolve_pdf_url(row: dict) -> Optional[str]:
    """Get the best PDF URL from a DB row. Checks 3 sources."""
    # 1. Dedicated notification_pdf column
    url = row.get("notification_pdf")
    if url and url.lower().startswith("http") and ".pdf" in url.lower():
        return url
    # 2. application_links JSONB -> notification_pdf key
    url = row.get("al_pdf")
    if url and url.lower().startswith("http"):
        return url
    # 3. source_url directly pointing to a PDF (MPPSC and similar scrapers)
    url = row.get("source_url")
    if url and url.lower().startswith("http") and ".pdf" in url.lower():
        return url
    return None

# DB SQL for PDF enrichment
_PDF_FETCH_SQL = """
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

_PDF_UPDATE_SQL = """
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


def run_pdf_enrichment(logger: logging.Logger, dry_run: bool = False, limit: int = 30):
    """
    Step 2: For records with a PDF URL but missing apply_start_date / apply_end_date,
    download the PDF and use Gemini vision to extract the important dates.

    Works for both text-layer PDFs and fully scanned (image-only) PDFs.
    Results are written back to important_dates + apply_start_date + apply_end_date.
    classification_status is reset to 'pending' so the classifier re-runs.
    """
    logger.info("=" * 60)
    logger.info("[PDF-ENRICH] Step 3: PDF date enrichment via Gemini vision")

    if dry_run:
        logger.info("[PDF-ENRICH] DRY RUN — skipping.")
        return

    try:
        _init_gemini_config()
    except Exception as e:
        logger.warning("[PDF-ENRICH] Config init failed (%s) — skipping step.", e)
        return

    if not _GEMINI_KEYS:
        logger.warning("[PDF-ENRICH] No GEMINI_API_KEY configured — skipping step.")
        return
    if not _DATABASE_URL:
        logger.warning("[PDF-ENRICH] No DATABASE_URL configured — skipping step.")
        return

    logger.info("[PDF-ENRICH] Model: %s | Keys: %d | Limit: %d",
                _GEMINI_MODEL, len(_GEMINI_KEYS), limit)

    try:
        import psycopg2, psycopg2.extras
    except ImportError:
        logger.warning("[PDF-ENRICH] psycopg2 not installed — skipping step.")
        return

    conn = psycopg2.connect(_DATABASE_URL)
    conn.autocommit = False
    counts = {"updated": 0, "skipped": 0, "error": 0}

    try:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute(_PDF_FETCH_SQL, (limit,))
            rows = [dict(r) for r in cur.fetchall()]

        logger.info("[PDF-ENRICH] Records to process: %d", len(rows))

        for row in rows:
            rid   = row["id"]
            title = (row.get("title") or "")[:70]
            pdf_url = _resolve_pdf_url(row)

            if not pdf_url:
                logger.info("[PDF-ENRICH] [%d] No PDF URL — skip", rid)
                counts["skipped"] += 1
                continue

            logger.info("[PDF-ENRICH] [%d] %s", rid, title)
            logger.info("[PDF-ENRICH]      PDF: %s", pdf_url)

            # Download PDF
            pdf_bytes = _download_pdf(pdf_url, logger)
            if not pdf_bytes:
                counts["error"] += 1
                continue

            logger.info("[PDF-ENRICH]      Downloaded: %d bytes", len(pdf_bytes))

            # Extract dates via Gemini vision
            extracted = _extract_dates_via_gemini(pdf_bytes, logger)
            if not extracted:
                logger.warning("[PDF-ENRICH] [%d] Extraction failed", rid)
                counts["error"] += 1
                continue

            logger.info("[PDF-ENRICH]      Extracted: %s", json.dumps(extracted))

            # Keep only valid ISO dates
            important_dates = {
                k: v for k, v in extracted.items()
                if v and v != "null" and _is_valid_iso_date(str(v))
            }
            apply_start = _safe_iso_date(extracted.get("application_start_date"))
            apply_end   = _safe_iso_date(extracted.get("application_end_date"))

            # Merge with existing important_dates (don't overwrite existing good data)
            existing = row.get("important_dates") or {}
            if isinstance(existing, str):
                try:
                    existing = json.loads(existing)
                except Exception:
                    existing = {}
            merged = dict(important_dates)
            for k, v in existing.items():
                if k not in merged and v:
                    merged[k] = v

            if not important_dates:
                logger.info("[PDF-ENRICH] [%d] All dates TBA — skip DB update", rid)
                counts["skipped"] += 1
                continue

            logger.info("[PDF-ENRICH] [%d] apply_start=%s  apply_end=%s",
                        rid, apply_start, apply_end)

            # Write to DB
            with conn.cursor() as cur:
                cur.execute(_PDF_UPDATE_SQL, (
                    json.dumps(merged, ensure_ascii=False),
                    apply_start,
                    apply_end,
                    rid
                ))
            conn.commit()
            logger.info("[PDF-ENRICH] [%d] DB updated", rid)
            counts["updated"] += 1

            time.sleep(1.5)  # pace Gemini API calls

    except Exception as exc:
        logger.exception("[PDF-ENRICH] Unexpected error: %s", exc)
    finally:
        conn.close()

    logger.info("[PDF-ENRICH] Done. updated=%d  skipped=%d  error=%d",
                counts["updated"], counts["skipped"], counts["error"])


# ============================================================
# STEP 3 — MARATHI TRANSLATION
# ============================================================

def run_marathi_translation(logger: logging.Logger, dry_run: bool = False):
    """
    Run the Gemini Marathi translator on any untranslated exam notifications.
    Runs AFTER all spiders complete (not in parallel — uses Gemini API).
    """
    translate_script = SCRAPER_DIR / "translate_to_marathi.py"
    if not translate_script.exists():
        logger.warning(f"[TRANSLATE] {translate_script} not found — skipping translation.")
        return

    cmd = [
        PYTHON_EXE, str(translate_script),
        "--batch-size", "10",
    ]

    logger.info("=" * 60)
    logger.info("[TRANSLATE] Starting automatic Marathi translation on untranslated records...")

    if dry_run:
        logger.info("   [DRY RUN] Skipping translation execution.")
        return

    start = datetime.now()
    try:
        result = subprocess.run(
            cmd,
            cwd=str(SCRAPER_DIR),
            timeout=1800,  # 30-minute safety timeout
        )
        elapsed = datetime.now() - start
        if result.returncode == 0:
            logger.info(f"[OK] Marathi translation finished in {elapsed}")
        else:
            logger.warning(f"[WARN] Marathi translation exited with code {result.returncode} after {elapsed}")
    except subprocess.TimeoutExpired:
        logger.error("[TIMEOUT] Marathi translation timed out after 30 minutes!")
    except Exception as exc:
        logger.error(f"[ERROR] Marathi translation step failed: {exc}")


def main():
    parser = argparse.ArgumentParser(description="ExamUdaan full pipeline runner")
    parser.add_argument("--spider",           help="Run only this spider (name)")
    parser.add_argument("--dry-run",          action="store_true", help="Print commands without running")
    parser.add_argument("--skip-translation", action="store_true", help="Skip automatic Marathi translation")
    parser.add_argument("--skip-enrich",      action="store_true", help="Skip notification enrichment step")
    parser.add_argument("--skip-pdf-enrich",  action="store_true", help="Skip PDF date enrichment step")
    parser.add_argument("--no-email",         action="store_true", help="Skip sending consolidated Brevo summary email")
    parser.add_argument("--enrich-limit",     type=int, default=50,
                        help="Max records to enrich per run (default: 50)")
    parser.add_argument("--pdf-limit",        type=int, default=30,
                        help="Max records to PDF-enrich per run (default: 30)")
    parser.add_argument(
        "--parallel", type=int, default=DEFAULT_PARALLEL,
        help=f"Max spiders to run simultaneously (default: {DEFAULT_PARALLEL})"
    )
    args = parser.parse_args()

    run_start_dt = datetime.now()
    run_ts = run_start_dt.strftime("%Y%m%d_%H%M%S")
    logger, log_file = setup_logging(run_ts)

    spiders_to_run = [args.spider] if args.spider else SPIDERS

    logger.info("=" * 60)
    logger.info(f"[START] ExamUdaan Scraper Run -- {run_start_dt.strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info(f"   Python     : {PYTHON_EXE}")
    logger.info(f"   Log file   : {log_file}")
    logger.info(f"   Spiders    : {len(spiders_to_run)} total")
    logger.info(f"   Parallel   : {args.parallel} at a time")
    logger.info(f"   Page limit : 10 pages + 50 items per spider (settings.py)")
    logger.info(f"   Enrich     : {'skip' if args.skip_enrich else f'up to {args.enrich_limit} records'}")
    logger.info(f"   PDF enrich : {'skip' if args.skip_pdf_enrich else f'up to {args.pdf_limit} records'}")
    logger.info("=" * 60)

    # Run all spiders in parallel
    if len(spiders_to_run) == 1:
        # Single spider — no need for ThreadPoolExecutor overhead
        name, success, duration_str = run_spider(spiders_to_run[0], logger, dry_run=args.dry_run)
        results = {name: {"status": "OK" if success else "FAIL", "duration": duration_str}}
    else:
        results = run_all_parallel(spiders_to_run, logger, args.parallel, args.dry_run)

    # Print summary
    logger.info("=" * 60)
    logger.info("Run Summary:")
    ok_count   = sum(1 for s in results.values() if (s == "OK" or (isinstance(s, dict) and s.get("status") == "OK")))
    fail_count = len(results) - ok_count
    for spider_name, info in results.items():
        st = info.get("status") if isinstance(info, dict) else info
        dur = info.get("duration") if isinstance(info, dict) else ""
        dur_info = f" ({dur})" if dur else ""
        logger.info(f"   [{st}]  {spider_name}{dur_info}")
    logger.info(f"   Total: {ok_count} OK, {fail_count} FAIL out of {len(results)}")
    logger.info("=" * 60)

    # Step 2 — Notification enrichment (fill dates, vacancies, fee from description or PDF)
    if not args.skip_enrich:
        run_enrich_notifications(logger, dry_run=args.dry_run, limit=args.enrich_limit)
    else:
        logger.info("[ENRICH] Skipped per --skip-enrich flag.")

    # Step 3 — PDF date enrichment (Gemini vision for scanned PDFs missing dates)
    if not args.skip_pdf_enrich:
        run_pdf_enrichment(logger, dry_run=args.dry_run, limit=args.pdf_limit)
    else:
        logger.info("[PDF-ENRICH] Skipped per --skip-pdf-enrich flag.")

    # Step 4 — Marathi translation
    if not args.skip_translation:
        run_marathi_translation(logger, dry_run=args.dry_run)
    else:
        logger.info("[TRANSLATE] Skipped per --skip-translation flag.")

    # Send ONE consolidated summary email for all crawled websites
    if not args.no_email and not args.dry_run:
        try:
            from send_summary_email import send_consolidated_summary_email
            logger.info("=" * 60)
            logger.info("[EMAIL] Sending single consolidated daily/run summary report via Brevo...")
            email_ok = send_consolidated_summary_email(run_start_time=run_start_dt, spider_results=results)
            if email_ok:
                logger.info("[EMAIL] Consolidated email summary delivered successfully.")
            else:
                logger.warning("[EMAIL] Consolidated email delivery failed or was skipped.")
        except Exception as e:
            logger.error(f"[EMAIL] Failed to send consolidated summary email: {e}")
    elif args.no_email:
        logger.info("[EMAIL] Skipped per --no-email flag.")

    # Exit non-zero if any spider failed
    all_ok = all(
        (s == "OK" or (isinstance(s, dict) and s.get("status") == "OK"))
        for s in results.values()
    )
    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()


