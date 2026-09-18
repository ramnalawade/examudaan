#!/usr/bin/env python3
"""
run_scraper.py — ExamUdaan Scrapy runner for cron / Task Scheduler
=================================================================
Runs all configured spiders in PARALLEL for speed.

Previously ran spiders sequentially (took ~2 hours).
Now runs MAX_PARALLEL spiders at a time — target: ~20-30 minutes total.

Usage:
    python run_scraper.py                        # run all spiders (parallel)
    python run_scraper.py --spider rrb           # run one spider
    python run_scraper.py --parallel 6           # run 6 at a time (default: 4)
    python run_scraper.py --dry-run              # print commands, don't execute

Scheduled runs: see cron_setup.md for Linux cron and Windows Task Scheduler setup.
"""

import argparse
import logging
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path

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
    parser = argparse.ArgumentParser(description="ExamUdaan Scrapy runner — parallel edition")
    parser.add_argument("--spider", help="Run only this spider (name)")
    parser.add_argument("--dry-run", action="store_true", help="Print commands without running")
    parser.add_argument("--skip-translation", action="store_true", help="Skip automatic Marathi translation")
    parser.add_argument("--no-email", action="store_true", help="Skip sending consolidated Brevo summary email")
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

    # Automatically run Marathi translation after all spiders complete
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


