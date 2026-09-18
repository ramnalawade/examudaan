# ============================================================
# db.py — Direct PostgreSQL connection helper
# Uses psycopg2-binary (replaces supabase Python client).
# Handles connection pooling, upserts, org/source lookups.
# ============================================================

import os,sys
import json
import hashlib
import logging
import psycopg2
import psycopg2.extras
from psycopg2.pool import ThreadedConnectionPool
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# ---- Connection DSN ----
# Prefers DIRECT_URL (bypasses PgBouncer for DDL/pgvector), falls back to parts
#DIRECT_URL = os.getenv("DIRECT_URL", "")
#if not DIRECT_URL:
DIRECT_URL = (
    f"host={os.getenv('DB_HOST')} "
    f"port={os.getenv('DB_PORT')} "
    f"dbname={os.getenv('DB_DATABASE')} "
    f"user={os.getenv('DB_USERNAME')} "
    f"password={os.getenv('DB_PASSWORD')} "
)
#print("========DIRECT_URL=======",DIRECT_URL)
# Thread-safe connection pool (1–4 connections)
_pool = None


def get_pool():
    global _pool
    if _pool is None:
        _pool = ThreadedConnectionPool(1, 4, DIRECT_URL)
    return _pool


def get_conn():
    """Get a connection from the pool."""
    return get_pool().getconn()


def release_conn(conn):
    """Return a connection to the pool."""
    get_pool().putconn(conn)


def close_pool():
    """Close all connections — call at spider close."""
    global _pool
    if _pool:
        _pool.closeall()
        _pool = None


# ============================================================
# Helpers
# ============================================================

def make_slug(text, max_len=280):
    """Convert any string to a URL-safe slug."""
    import re
    try:
        from unidecode import unidecode
        text = unidecode(text)
    except ImportError:
        pass
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text.strip())
    text = re.sub(r'-+', '-', text)
    return text[:max_len]


def make_dedup_hash(source_id: str, url: str) -> str:
    """Hash for raw_scraped_data.dedup_hash (source_id + url)."""
    content = f"{source_id}::{url}"
    return hashlib.sha256(content.encode()).hexdigest()


def make_content_hash(*fields) -> str:
    """Hash of content fields for change detection."""
    content = json.dumps(fields, sort_keys=True, default=str)
    return hashlib.md5(content.encode()).hexdigest()


def get_known_urls(org_acronym: str = None) -> set:
    """
    Load already-crawled source_url + notification_pdf values from
    exam_notifications into a set of strings.

    This is used by DeduplicationPipeline to skip items whose URL
    is already in the database — avoiding duplicate Gemini calls.

    Args:
        org_acronym: Optional filter (e.g. 'BMC') — load only that org's
                     URLs to keep the set small for large DBs.
    Returns:
        set of URL strings (empty set on any DB error)
    """
    conn = None
    try:
        conn = get_conn()
        cur  = conn.cursor()

        if org_acronym:
            cur.execute("""
                SELECT en.source_url, en.notification_pdf
                FROM exam_notifications en
                JOIN organizations o ON o.id = en.organization_id
                WHERE UPPER(o.acronym) = UPPER(%s)
                  AND (en.source_url IS NOT NULL OR en.notification_pdf IS NOT NULL)
            """, (org_acronym,))
        else:
            cur.execute("""
                SELECT source_url, notification_pdf
                FROM exam_notifications
                WHERE source_url IS NOT NULL OR notification_pdf IS NOT NULL
            """)

        known = set()
        for row in cur.fetchall():
            src_url, pdf_url = row
            if src_url:
                known.add(src_url.strip())
            if pdf_url:
                known.add(pdf_url.strip())
        return known

    except Exception as e:
        logger.warning(f"get_known_urls: DB query failed — {e}. Dedup disabled for this run.")
        return set()
    finally:
        if conn:
            release_conn(conn)


def get_known_hashes(org_acronym: str = None) -> set:
    """
    Load already-crawled dedup_hash values from exam_notifications into a set.
    """
    conn = None
    try:
        conn = get_conn()
        cur  = conn.cursor()

        if org_acronym:
            cur.execute("""
                SELECT en.dedup_hash
                FROM exam_notifications en
                JOIN organizations o ON o.id = en.organization_id
                WHERE UPPER(o.acronym) = UPPER(%s)
                  AND en.dedup_hash IS NOT NULL
            """, (org_acronym,))
        else:
            cur.execute("""
                SELECT dedup_hash
                FROM exam_notifications
                WHERE dedup_hash IS NOT NULL
            """)

        known = {row[0].strip() for row in cur.fetchall() if row[0]}
        return known

    except Exception as e:
        logger.warning(f"get_known_hashes: DB query failed — {e}.")
        return set()
    finally:
        if conn:
            release_conn(conn)




# ============================================================
# Organization lookup / upsert
# ============================================================

def get_or_create_org(conn, name: str, acronym: str, website: str = None,
                      department: str = None, parent_org: str = None,
                      address: str = None, phone: str = None) -> str:
    """
    Returns UUID of org. Creates if not exists.
    Uses acronym as unique key. Updates enrichment fields if provided.
    """
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        org_id = None

        # Try by acronym first
        if acronym:
            cur.execute("SELECT id FROM organizations WHERE acronym = %s", (acronym.upper(),))
            row = cur.fetchone()
            if row:
                org_id = str(row['id'])

        # Try by exact name
        if not org_id:
            cur.execute("SELECT id FROM organizations WHERE name = %s", (name,))
            row = cur.fetchone()
            if row:
                org_id = str(row['id'])

        if org_id:
            # Update enrichment fields if we have new data
            updates = []
            params = []
            for col, val in [('department', department), ('parent_org', parent_org),
                             ('address', address), ('phone', phone), ('website', website)]:
                if val:
                    updates.append(f"{col} = COALESCE({col}, %s)")
                    params.append(val)
            if updates:
                params.append(org_id)
                cur.execute(
                    f"UPDATE organizations SET {', '.join(updates)} WHERE id = %s",
                    params
                )
                conn.commit()
            return org_id

        # Create new org
        cur.execute(
            """
            INSERT INTO organizations (name, acronym, website, department, parent_org, address, phone)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (name, acronym.upper() if acronym else None, website,
             department, parent_org, address, phone)
        )
        row = cur.fetchone()
        conn.commit()
        logger.info(f"[DB] Created org: {name} ({acronym})")
        return str(row['id'])


# ============================================================
# Scrape Source lookup / upsert
# ============================================================

def get_or_create_source(conn, name: str, base_url: str) -> str:
    """Returns UUID of scrape_source. Creates if not exists."""
    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("SELECT id FROM scrape_sources WHERE name = %s", (name,))
        row = cur.fetchone()
        if row:
            return str(row['id'])

        cur.execute(
            """
            INSERT INTO scrape_sources (name, base_url, is_official)
            VALUES (%s, %s, TRUE)
            RETURNING id
            """,
            (name, base_url)
        )
        row = cur.fetchone()
        conn.commit()
        logger.info(f"[DB] Created source: {name}")
        return str(row['id'])


# ============================================================
# Raw scraped data archiver
# ============================================================

def save_raw_scraped(conn, source_id: str, url: str, parsed_data: dict,
                     raw_html: str = None) -> bool:
    """
    Save to raw_scraped_data for audit trail.
    Returns True if inserted, False if duplicate.
    """
    dedup_hash = make_dedup_hash(source_id, url)
    with conn.cursor() as cur:
        # Check for existing record to avoid unique constraint issues on partitioned table
        cur.execute(
            "SELECT id FROM raw_scraped_data WHERE source_id = %s AND dedup_hash = %s LIMIT 1",
            (source_id, dedup_hash)
        )
        if cur.fetchone():
            return False

        cur.execute(
            """
            INSERT INTO raw_scraped_data (source_id, url, raw_html_url, parsed_data, dedup_hash, status)
            VALUES (%s, %s, %s, %s, %s, 'success')
            RETURNING id
            """,
            (source_id, url, raw_html, json.dumps(parsed_data), dedup_hash)
        )
        result = cur.fetchone()
        conn.commit()
        return result is not None  # True = inserted, False = duplicate


# ============================================================
# Exam Notification upsert
# ============================================================

def upsert_notification(conn, org_id: str, source_id: str, data: dict) -> int:
    """
    Insert or update an exam_notification.
    Returns the notification id (BIGINT).

    Supports the flexible multi-state, multi-language schema with:
    - Core fields: title, dates, links, org, etc.
    - Multi-state/lang: state_slug, lang, title_translations, description_translations
    - AI extraction: ai_extracted_data (JSONB) + promoted first-class filters
    - Filtering columns: salary_min/max, max_age_limit, is_walk_in, employment_type, etc.
    - Verification: last_source_sync, last_verified_at, is_archived
    """
    slug = make_slug(data.get('title', ''))

    # Build important_dates JSONB from flat date fields if not provided
    important_dates = data.get('important_dates') or {}
    if data.get('apply_start_date') and not important_dates.get('apply_start'):
        important_dates['apply_start'] = str(data['apply_start_date'])
    if data.get('apply_end_date') and not important_dates.get('apply_end'):
        important_dates['apply_end'] = str(data['apply_end_date'])
    if data.get('exam_date') and not important_dates.get('exam_date'):
        important_dates['exam_date'] = str(data['exam_date'])

    # Normalize state_slug and state_normalized from data
    raw_state = data.get('state_slug')
    if not raw_state and data.get('state'):
        s = data['state']
        raw_state = (s[0] if isinstance(s, list) and s else str(s))

    if raw_state:
        state_slug = str(raw_state).lower().strip().replace(' ', '-')
        state_normalized = data.get('state_normalized') or str(raw_state).strip().title()
    else:
        state_slug = 'all-india'
        state_normalized = 'All India'
    lang = data.get('lang') or 'en'

    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(
            """
            INSERT INTO exam_notifications (
                -- Core identity
                organization_id, source_id, advt_no, title, slug, description,
                -- Dates
                notification_pdf, important_dates,
                apply_start_date, apply_end_date, exam_date,
                -- Fees & limits
                application_fee, age_limit, selection_process,
                -- Meta
                status, published_at, source_url,
                application_links, exam_cities, seo_metadata,
                -- Rich job details
                employment_type, duration, salary, qualifications,
                application_email, advertisement_details, application_details,
                -- NEW: Multi-state / Multi-language
                state_slug, state_normalized, lang, title_translations, description_translations,
                -- NEW: AI extracted data (big flexible JSONB)
                ai_extracted_data,
                -- NEW: First-class filter columns (promoted from ai_extracted_data)
                is_walk_in, min_experience_years, max_age_limit,
                salary_min, salary_max, gender_preference,
                -- NEW: Vacancies
                total_vacancies,
                -- NEW: Category FK
                category_id,
                -- NEW: Verification & tracking
                last_source_sync, last_verified_at,
                cancellation_or_corrigendum_ref, is_archived,
                -- NEW: Notification type
                notification_type
            )
            VALUES (
                -- Core identity
                %s, %s, %s, %s, %s, %s,
                -- Dates
                %s, %s,
                %s, %s, %s,
                -- Fees & limits
                %s, %s, %s,
                -- Meta
                %s, NOW(), %s,
                %s, %s, %s,
                -- Rich job details
                %s, %s, %s, %s,
                %s, %s, %s,
                -- NEW: Multi-state / Multi-language
                %s, %s, %s, %s, %s,
                -- NEW: AI extracted data
                %s,
                -- NEW: First-class filter columns
                %s, %s, %s,
                %s, %s, %s,
                -- NEW: Vacancies
                %s,
                -- NEW: Category FK
                %s,
                -- NEW: Verification & tracking
                %s, %s,
                %s, %s,
                -- NEW: Notification type
                %s
            )
            ON CONFLICT (slug) DO UPDATE SET
                -- Core fields (always update)
                advt_no              = EXCLUDED.advt_no,
                description          = EXCLUDED.description,
                notification_pdf     = EXCLUDED.notification_pdf,
                important_dates      = EXCLUDED.important_dates,
                apply_start_date     = EXCLUDED.apply_start_date,
                apply_end_date       = EXCLUDED.apply_end_date,
                exam_date            = EXCLUDED.exam_date,
                application_fee      = EXCLUDED.application_fee,
                age_limit            = EXCLUDED.age_limit,
                selection_process    = EXCLUDED.selection_process,
                status               = EXCLUDED.status,
                application_links    = EXCLUDED.application_links,
                exam_cities          = EXCLUDED.exam_cities,
                seo_metadata         = EXCLUDED.seo_metadata,
                source_url           = EXCLUDED.source_url,
                
                -- Rich job details (prefer new over old, but don't overwrite with empty)
                employment_type      = COALESCE(EXCLUDED.employment_type, exam_notifications.employment_type),
                duration             = COALESCE(EXCLUDED.duration, exam_notifications.duration),
                salary               = CASE 
                    WHEN EXCLUDED.salary::text != '{}' AND EXCLUDED.salary IS NOT NULL 
                    THEN EXCLUDED.salary 
                    ELSE exam_notifications.salary 
                END,
                qualifications       = CASE 
                    WHEN EXCLUDED.qualifications::text != '{}' AND EXCLUDED.qualifications IS NOT NULL 
                    THEN EXCLUDED.qualifications 
                    ELSE exam_notifications.qualifications 
                END,
                application_email    = COALESCE(EXCLUDED.application_email, exam_notifications.application_email),
                advertisement_details= CASE 
                    WHEN EXCLUDED.advertisement_details::text != '{}' AND EXCLUDED.advertisement_details IS NOT NULL 
                    THEN EXCLUDED.advertisement_details 
                    ELSE exam_notifications.advertisement_details 
                END,
                application_details  = CASE 
                    WHEN EXCLUDED.application_details::text != '{}' AND EXCLUDED.application_details IS NOT NULL 
                    THEN EXCLUDED.application_details 
                    ELSE exam_notifications.application_details 
                END,
                
                -- NEW: Multi-state / Multi-language (always update)
                state_slug           = EXCLUDED.state_slug,
                state_normalized     = EXCLUDED.state_normalized,
                lang                 = EXCLUDED.lang,
                title_translations   = CASE 
                    WHEN EXCLUDED.title_translations::text != '{}' AND EXCLUDED.title_translations IS NOT NULL 
                    THEN EXCLUDED.title_translations 
                    ELSE exam_notifications.title_translations 
                END,
                description_translations = CASE 
                    WHEN EXCLUDED.description_translations::text != '{}' AND EXCLUDED.description_translations IS NOT NULL 
                    THEN EXCLUDED.description_translations 
                    ELSE exam_notifications.description_translations 
                END,
                
                -- NEW: AI extracted data (deep merge would be ideal, but simple overwrite is safer)
                ai_extracted_data    = CASE 
                    WHEN EXCLUDED.ai_extracted_data::text != '{}' AND EXCLUDED.ai_extracted_data IS NOT NULL 
                    THEN EXCLUDED.ai_extracted_data 
                    ELSE exam_notifications.ai_extracted_data 
                END,
                
                -- NEW: First-class filter columns (prefer new over old)
                is_walk_in           = COALESCE(EXCLUDED.is_walk_in, exam_notifications.is_walk_in),
                min_experience_years = COALESCE(EXCLUDED.min_experience_years, exam_notifications.min_experience_years),
                max_age_limit        = COALESCE(EXCLUDED.max_age_limit, exam_notifications.max_age_limit),
                salary_min           = COALESCE(EXCLUDED.salary_min, exam_notifications.salary_min),
                salary_max           = COALESCE(EXCLUDED.salary_max, exam_notifications.salary_max),
                gender_preference    = COALESCE(EXCLUDED.gender_preference, exam_notifications.gender_preference),
                
                -- NEW: Vacancies (prefer new over old)
                total_vacancies      = COALESCE(EXCLUDED.total_vacancies, exam_notifications.total_vacancies),
                
                -- NEW: Category FK (prefer new over old)
                category_id          = COALESCE(EXCLUDED.category_id, exam_notifications.category_id),
                
                -- NEW: Verification & tracking
                last_source_sync     = EXCLUDED.last_source_sync,  -- Always update (current crawl)
                -- last_verified_at is NOT updated here (human/editor confirmation only)
                cancellation_or_corrigendum_ref = COALESCE(
                    EXCLUDED.cancellation_or_corrigendum_ref, 
                    exam_notifications.cancellation_or_corrigendum_ref
                ),
                is_archived          = COALESCE(EXCLUDED.is_archived, exam_notifications.is_archived),
                
                -- NEW: Notification type (always update — re-classification may improve it)
                notification_type    = EXCLUDED.notification_type,
                
                updated_at           = NOW()
            RETURNING id
            """,
            (
                # Core identity
                org_id, source_id,
                data.get('advt_no'),
                data.get('title'),
                slug,
                data.get('description'),
                # Dates
                data.get('notification_pdf'),
                json.dumps(important_dates),
                data.get('apply_start_date') or None,
                data.get('apply_end_date') or None,
                data.get('exam_date') or None,
                # Fees & limits
                json.dumps(data.get('application_fee') or {}),
                json.dumps(data.get('age_limit') or {}),
                data.get('selection_process'),
                # Meta
                data.get('status', 'published'),
                data.get('source_url'),
                json.dumps(data.get('application_links') or {}),
                data.get('exam_cities') or [],
                json.dumps(data.get('seo_metadata') or {}),
                # Rich job details
                data.get('employment_type'),
                data.get('duration'),
                json.dumps(data.get('salary') or {}),
                json.dumps(data.get('qualifications') or {}),
                data.get('application_email'),
                json.dumps(data.get('advertisement_details') or {}),
                json.dumps(data.get('application_details') or {}),
                # NEW: Multi-state / Multi-language
                state_slug,
                state_normalized,
                lang,
                json.dumps(data.get('title_translations') or {}),
                json.dumps(data.get('description_translations') or {}),
                # NEW: AI extracted data
                json.dumps(data.get('ai_extracted_data') or {}),
                # NEW: First-class filter columns
                data.get('is_walk_in'),
                data.get('min_experience_years'),
                data.get('max_age_limit'),
                data.get('salary_min'),
                data.get('salary_max'),
                data.get('gender_preference'),
                # NEW: Vacancies
                data.get('total_vacancies'),
                # NEW: Category FK
                data.get('category_id'),
                # NEW: Verification & tracking
                data.get('last_source_sync'),
                data.get('last_verified_at'),
                data.get('cancellation_or_corrigendum_ref'),
                data.get('is_archived', False),
                # NEW: Notification type
                data.get('notification_type', 'recruitment'),
            )
        )
        row = cur.fetchone()
        conn.commit()
        notification_id = row['id']
        logger.info(f"[DB] Upserted notification id={notification_id}: {data.get('title', '')[:60]}")
        return notification_id


# ============================================================
# Posts (vacancies) upsert
# ============================================================

def upsert_post(conn, notification_id: int, data: dict) -> int:
    """
    Insert or update a post within a notification.
    Returns post id (BIGINT).

    data keys: post_name, post_code, total_vacancies, category,
               pay_scale, reservation_json, qualification, experience,
               custom_attributes, job_type, tags, slug
    """
    slug = data.get('slug') or make_slug(
        f"{data.get('post_name', '')} {notification_id}"
    )

    with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute(
            """
            INSERT INTO posts (
                notification_id, post_name, post_code,
                total_vacancies, category, pay_scale,
                reservation_json, qualification, experience,
                custom_attributes, job_type, tags, slug
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (slug) DO UPDATE SET
                total_vacancies  = EXCLUDED.total_vacancies,
                category         = EXCLUDED.category,
                pay_scale        = EXCLUDED.pay_scale,
                reservation_json = EXCLUDED.reservation_json,
                qualification    = EXCLUDED.qualification,
                experience       = EXCLUDED.experience,
                custom_attributes= EXCLUDED.custom_attributes,
                job_type         = EXCLUDED.job_type,
                tags             = EXCLUDED.tags
            RETURNING id
            """,
            (
                notification_id,
                data.get('post_name', 'Various Posts'),
                data.get('post_code'),
                data.get('total_vacancies'),
                data.get('category'),
                data.get('pay_scale'),
                json.dumps(data.get('reservation_json') or {}),
                data.get('qualification'),
                data.get('experience'),
                json.dumps(data.get('custom_attributes') or {}),
                data.get('job_type', 'permanent'),
                data.get('tags') or [],
                slug,
            )
        )
        row = cur.fetchone()
        conn.commit()
        post_id = row['id']
        logger.info(f"[DB] Upserted post id={post_id}: {data.get('post_name', '')}")
        return post_id


# ============================================================
# Post Locations
# ============================================================

def upsert_post_locations(conn, post_id: int, locations: list):
    """
    Insert post location entries.
    locations = [{"city_name": "Mumbai", "vacancies": 500}, ...]
    """
    if not locations:
        return

    with conn.cursor() as cur:
        # Clear old locations for this post
        cur.execute("DELETE FROM post_locations WHERE post_id = %s", (post_id,))

        for loc in locations:
            cur.execute(
                """
                INSERT INTO post_locations (post_id, city_name, vacancies)
                VALUES (%s, %s, %s)
                """,
                (post_id, loc.get('city_name'), loc.get('vacancies', 0))
            )
        conn.commit()
        logger.info(f"[DB] Saved {len(locations)} locations for post {post_id}")


# ============================================================
# Scrape Log
# ============================================================

def start_scrape_log(conn, source_id: str) -> int:
    """Insert a scrape_log row and return its id."""
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO scrape_log (source_id, started_at)
            VALUES (%s, NOW())
            RETURNING id
            """,
            (source_id,)
        )
        row = cur.fetchone()
        conn.commit()
        return row[0]


def finish_scrape_log(conn, log_id: int, added: int, updated: int, errors: list):
    """Update the scrape_log row when spider finishes."""
    with conn.cursor() as cur:
        cur.execute(
            """
            UPDATE scrape_log
            SET finished_at = NOW(),
                records_added = %s,
                records_updated = %s,
                errors = %s
            WHERE id = %s
            """,
            (added, updated, errors or [], log_id)
        )
        conn.commit()
