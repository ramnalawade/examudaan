# ============================================================
# sync_ncs_jobs.py — National Career Service (NCS) Gov Jobs Sync
#
# PRIVACY & COMPLIANCE NOTICE:
# - Under India's DPDP Act 2023, recruiter personal contact details
#   (recruiterMobile, recruiterEmail) are strictly STRIPPED & DISCARDED.
# - Only public recruitment vacancy data (title, vacancies, salary,
#   eligibility, dates, official apply URL) is ingested.
# - Random delays and User-Agent rotation are enforced to prevent
#   detection and respect NIC/NCS servers.
# - Filters for ACTIVE, FRESH jobs whose application deadline has not passed.
# ============================================================

import os
import sys
import time
import json
import base64
import random
import logging
import argparse
import requests
import urllib3
urllib3.disable_warnings()

from datetime import datetime, date
from typing import List, Dict, Optional, Tuple

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend

# Import ExamUdaan DB helpers
import db
try:
    from title_cleaner import clean_title_case
except ImportError:
    from .title_cleaner import clean_title_case

# ------------------------------------------------------------
# Logging setup
# ------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("ncs_sync")

# ------------------------------------------------------------
# NCS AES-256-CBC Crypto Constants (Reverse-engineered from SPA)
# ------------------------------------------------------------
AES_KEY = b"NcsSecureKey2024NcsSecureKey2024"
AES_IV  = b"NcsInitVector123"

NCS_SEARCH_URL = "https://api.ncs.gov.in/api/v1/job-posts/search"
NCS_DETAIL_URL = "https://api.ncs.gov.in/api/jobs/detail"
NCS_STATES_URL = "https://api.ncs.gov.in/api/location/state"

# Realistic User-Agent pool to mimic human browsing
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
]


def get_headers() -> dict:
    """Generate dynamic browser headers with rotated User-Agent."""
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Content-Type": "application/octet-stream",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
        "Origin": "https://ncs.gov.in",
        "Referer": "https://ncs.gov.in/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
    }


def encrypt_payload(data: dict) -> str:
    """Encrypt JSON payload with AES-256-CBC PKCS7 padding."""
    raw_bytes = json.dumps(data).encode("utf-8")
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(raw_bytes) + padder.finalize()
    cipher = Cipher(algorithms.AES(AES_KEY), modes.CBC(AES_IV), backend=default_backend())
    encryptor = cipher.encryptor()
    return base64.b64encode(encryptor.update(padded_data) + encryptor.finalize()).decode("utf-8")


def decrypt_payload(b64_str: str) -> dict:
    """Decrypt Base64 ciphertext into JSON."""
    encrypted_bytes = base64.b64decode(b64_str)
    cipher = Cipher(algorithms.AES(AES_KEY), modes.CBC(AES_IV), backend=default_backend())
    decryptor = cipher.decryptor()
    unpadder = padding.PKCS7(128).unpadder()
    decrypted_bytes = unpadder.update(decryptor.update(encrypted_bytes) + decryptor.finalize()) + unpadder.finalize()
    return json.loads(decrypted_bytes.decode("utf-8"))


def is_deadline_active(job: dict) -> Tuple[bool, Optional[str]]:
    """
    Check if the application deadline has NOT passed.
    Returns (is_active, expiry_date_str).
    """
    exp_at = job.get("expiredAt")
    if not exp_at:
        return True, None

    try:
        # Extract YYYY-MM-DD
        date_str = str(exp_at).replace("Z", "").split("T")[0].strip()
        exp_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        today = datetime.now().date()
        return (exp_date >= today), date_str
    except Exception as e:
        logger.debug(f"Could not parse expiredAt '{exp_at}': {e}")
        return True, str(exp_at)


def fetch_all_states() -> List[Dict]:
    """Fetch list of all states from NCS location master API."""
    try:
        resp = requests.get(NCS_STATES_URL, headers=get_headers(), timeout=10, verify=False)
        if resp.status_code == 200:
            return resp.json().get("data", [])
    except Exception as e:
        logger.warning(f"Could not fetch NCS states: {e}")
    return []


def search_jobs(payload: dict, page: int = 0, size: int = 20) -> Optional[dict]:
    """Execute encrypted POST search request to NCS with realistic headers."""
    try:
        enc_body = encrypt_payload(payload)
        resp = requests.post(
            NCS_SEARCH_URL,
            headers=get_headers(),
            data=enc_body,
            params={"page": page, "size": size},
            timeout=20,
            verify=False
        )
        if resp.status_code == 200:
            return decrypt_payload(resp.text.strip())
        else:
            logger.warning(f"NCS search failed with HTTP {resp.status_code}")
    except Exception as e:
        logger.error(f"Error fetching NCS jobs (page {page}): {e}")
    return None


def sanitize_and_map_job(job: dict) -> dict:
    """
    Map NCS job attributes to ExamUdaan schema.
    
    PRIVACY SAFEGUARD:
    Explicitly ignores recruiterMobile, recruiterEmail, recruiterName.
    """
    job_id = job.get("id")
    raw_title = job.get("jobTitle") or "Government Job Vacancy"
    title = clean_title_case(raw_title)
    org_name = job.get("organizationName") or "National Career Service (Govt of India)"
    apply_url = f"https://ncs.gov.in/job-listing/applying/{job_id}"

    # Extract dates
    pub_at = job.get("publishedAt") or job.get("createdAt")
    exp_at = job.get("expiredAt")

    start_date = None
    if pub_at:
        try:
            start_date = pub_at.split("T")[0]
        except Exception:
            pass

    end_date = None
    if exp_at:
        try:
            end_date = exp_at.split("T")[0]
        except Exception:
            pass

    # Extract qualifications
    edu_list = []
    for edu in job.get("educationPreferences") or []:
        degree = edu.get("degree") or ""
        edu_type = edu.get("educationType") or ""
        spec = edu.get("specialization") or ""
        desc = " - ".join(filter(None, [edu_type, degree, spec]))
        if desc:
            edu_list.append(desc)

    # Extract locations & State
    locations = job.get("jobLocations") or []
    state_name = "All India"
    city_names = []
    for loc in locations:
        if loc.get("state") and state_name == "All India":
            state_name = loc["state"].title()
        if loc.get("city"):
            city_names.append(loc["city"].title())

    # Build ExamUdaan notification dict
    return {
        "title": title,
        "notification_type": "recruitment",
        "org_name": org_name,
        "source_url": apply_url,
        "notification_pdf": None,
        "apply_start_date": start_date,
        "apply_end_date": end_date,
        "total_vacancies": job.get("noOfVacancies") or None,
        "state_normalized": state_name,
        "state_slug": state_name.lower().replace(" ", "-"),
        "application_links": {
            "apply_online": apply_url,
            "official_website": "https://ncs.gov.in"
        },
        "salary": {
            "min": job.get("minSalary"),
            "max": job.get("maxSalary"),
            "hide": job.get("hideSalaryRange", False)
        },
        "age_limit": {
            "min": job.get("minAge"),
            "max": job.get("maxAge")
        },
        "qualifications": {
            "mandatory": edu_list,
            "desirable": job.get("requiredSkills") or []
        },
        "description": job.get("jobDescription") or "",
        "important_dates": {
            "apply_start": start_date,
            "apply_end": end_date
        },
        "ai_extracted_data": {
            "government_level": "Central" if "icar" in org_name.lower() or "ministry" in org_name.lower() else "State",
            "state_normalized": state_name,
            "cities_normalized": city_names,
            "is_govt": True,
            "source_portal": "NCS"
        }
    }


def sync_ncs_jobs(
    state_filter: Optional[str] = None,
    page_limit: int = 15,
    min_delay: float = 2.0,
    max_delay: float = 4.5,
    dry_run: bool = False
):
    """
    Main ingestion loop:
    1. Connect to ExamUdaan DB
    2. Check known URLs for deduplication
    3. Query NCS search API with randomized human-like delays
    4. Filter out expired jobs whose deadline has already passed
    5. Upsert active, sanitized jobs into DB
    """
    logger.info("=" * 65)
    logger.info("NCS (National Career Service) Active Government Jobs Sync")
    if state_filter:
        logger.info(f"Target State Filter  : {state_filter}")
    logger.info(f"Randomized Delay Range: {min_delay:.1f}s — {max_delay:.1f}s")
    logger.info(f"Deadline Check       : Active / Future Deadlines Only")
    logger.info("=" * 65)

    if dry_run:
        logger.info("[DRY RUN] Skipping database connection. Fetched jobs will only be previewed.")
        conn = None
        source_id = "dry-run-source"
        known_urls = set()
    else:
        conn = db.get_conn()
        source_id = db.get_or_create_source(conn, "NCS (National Career Service)", "https://ncs.gov.in")
        known_urls = db.get_known_urls()
        logger.info(f"Loaded {len(known_urls)} existing URLs from DB for deduplication.")

    # Search filter payload — Always sort by NEWEST
    search_payload = {
        "isGovernmentJob": True,
        "sortBy": "NEWEST"
    }
    if state_filter:
        search_payload["states"] = [state_filter]

    inserted_count = 0
    skipped_dedup = 0
    skipped_expired = 0

    try:
        for page in range(page_limit):
            logger.info(f"Fetching NCS page {page}...")
            res = search_jobs(search_payload, page=page, size=20)
            if not res or not res.get("data"):
                logger.info(f"No data returned on page {page}. Stopping sync.")
                break

            jobs = res["data"].get("content", [])
            total_elements = res["data"].get("totalElements", 0)
            logger.info(f"Page {page}: received {len(jobs)} jobs (Total on NCS: {total_elements})")

            if not jobs:
                break

            for job in jobs:
                job_id = job.get("id")
                title = (job.get("jobTitle") or "Govt Job")[:50]
                apply_url = f"https://ncs.gov.in/job-listing/applying/{job_id}"

                # 1. Deadline Check — Filter out expired jobs
                is_active, exp_date = is_deadline_active(job)
                if not is_active:
                    logger.info(f"  [-] Skipped ID {job_id} ({title}): Deadline expired on {exp_date}")
                    skipped_expired += 1
                    continue

                # 2. Deduplication Check
                if apply_url in known_urls:
                    skipped_dedup += 1
                    continue

                # 3. Sanitize and Map (Strips all recruiter PII)
                mapped_data = sanitize_and_map_job(job)

                if dry_run:
                    logger.info(f"  [DRY-RUN ACTIVE] ID {job_id}: {mapped_data['title'][:45]} | {mapped_data['org_name'][:25]} | Deadline: {mapped_data['apply_end_date']} | Vacancies: {mapped_data['total_vacancies']}")
                    inserted_count += 1
                    continue

                # 4. Insert / Update in DB
                org_id = db.get_or_create_org(
                    conn,
                    name=mapped_data["org_name"],
                    acronym="NCS",
                    website="https://ncs.gov.in"
                )

                notif_id = db.upsert_notification(conn, org_id, source_id, mapped_data)
                known_urls.add(apply_url)
                inserted_count += 1
                logger.info(f"  [+] Inserted ID {notif_id}: {mapped_data['title'][:50]} ({mapped_data['org_name'][:25]}) | Ends: {mapped_data['apply_end_date']}")

                # Small human micro-delay between individual DB operations
                time.sleep(random.uniform(0.1, 0.3))

            # Random delay between page requests to avoid bot detection
            if page < page_limit - 1:
                sleep_time = random.uniform(min_delay, max_delay)
                logger.info(f"Sleeping {sleep_time:.2f}s before fetching next page...")
                time.sleep(sleep_time)

    except Exception as e:
        logger.exception(f"Unexpected error during NCS sync: {e}")
    finally:
        if conn:
            db.release_conn(conn)

    logger.info("=" * 65)
    logger.info(f"Sync complete summary:")
    logger.info(f"  - Active Jobs Added/Updated : {inserted_count}")
    logger.info(f"  - Expired Jobs Skipped      : {skipped_expired}")
    logger.info(f"  - Already in DB (Skipped)   : {skipped_dedup}")
    logger.info("=" * 65)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sync Active Government Jobs from NCS into ExamUdaan DB")
    parser.add_argument("--state", help="Filter by specific state (e.g. 'Maharashtra', 'Delhi')", default=None)
    parser.add_argument("--pages", type=int, help="Max pages to sync (default: 15)", default=15)
    parser.add_argument("--min-delay", type=float, help="Minimum random delay in seconds (default: 2.0)", default=2.0)
    parser.add_argument("--max-delay", type=float, help="Maximum random delay in seconds (default: 4.5)", default=4.5)
    parser.add_argument("--dry-run", action="store_true", help="Preview extracted jobs without writing to DB")
    args = parser.parse_args()

    sync_ncs_jobs(
        state_filter=args.state,
        page_limit=args.pages,
        min_delay=args.min_delay,
        max_delay=args.max_delay,
        dry_run=args.dry_run
    )
