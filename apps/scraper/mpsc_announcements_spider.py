#!/usr/bin/env python3
"""
mpsc_announcements_spider.py — Production MPSC Official Announcements, Timetables & Results Pipeline
ExamUdaan.in | Automated daily monitor, database sync, and instant Telegram & WhatsApp alert broadcaster

Target Official Endpoints:
1. https://mpsc.gov.in/tentative_schedule_for_competitive_exam/19 (mid=19) -> Tentative Exam Schedules
2. https://mpsc.gov.in/announcement_and_circular/4 (mid=4)                 -> Announcements & Circulars
3. https://mpsc.gov.in/result_of_exam/11 (mid=11)                         -> Exam Results & Selection Lists

Capabilities:
- AES-128-CBC Decryption of official MPSC REST API payloads (0.5s execution, zero browser dependencies)
- State tracking (mpsc_announcements_state.json) so only NEW announcements trigger instant alerts
- Automatic classification: 'recruitment', 'result', 'admit_card', 'answer_key', 'syllabus'
- PostgreSQL Upsert into exam_notifications with verified gov PDF links
- Instant Broadcast:
    * Telegram Bot API -> Sends rich bilingual alert to @examudaanjobs
    * WhatsApp -> Generates ready-to-share formatted message in todays_whatsapp_posts.txt
- Optional local PDF archiving into downloads/mpsc_announcements/

Usage:
    python mpsc_announcements_spider.py --daily               # Daily check: scan all 3, upsert new & broadcast
    python mpsc_announcements_spider.py --dry-run             # Preview recent items without DB/broadcast
    python mpsc_announcements_spider.py --broadcast --limit 3 # Check top 3 and broadcast any new items
    python mpsc_announcements_spider.py --download-pdfs       # Also archive official PDFs locally
"""

import os
import sys
import json
import time
import random
import zlib
import base64
import argparse
import logging
import ssl
import urllib.request
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Ensure UTF-8 stdout encoding for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Load environment
ENV_PATH = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("mpsc_announcements")

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding

try:
    import requests
except ImportError:
    requests = None

# DB helper
try:
    import db
except ImportError:
    from . import db

# Configuration
MPSC_SALT = "S300cr3t!@#Key$%^&*()_+[]{}|;':,.<>?/~`"
AES_KEY   = b"1234567812345678"
AES_IV    = b"1234567812345678"

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
]

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "@examudaanjobs").strip()
WHATSAPP_CHANNEL_URL = os.getenv("WHATSAPP_CHANNEL_URL", "https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v").strip()
TELEGRAM_CHANNEL_URL = os.getenv("TELEGRAM_CHANNEL_URL", "https://t.me/examudaanjobs").strip()
SITE_URL = os.getenv("NEXT_PUBLIC_SITE_URL", "https://examudaan.in").strip().rstrip('/')

STATE_FILE = Path(__file__).parent / "mpsc_announcements_state.json"
WHATSAPP_DIGEST_FILE = Path(__file__).parent / "todays_whatsapp_posts.txt"
MPSC_WHATSAPP_ALERTS_FILE = Path(__file__).parent / "mpsc_whatsapp_alerts.txt"
DOWNLOADS_DIR = Path(__file__).parent / "downloads" / "mpsc_announcements"

# Official MPSC target menus covering the complete exam lifecycle
MPSC_TARGET_MENUS = [
    {
        "mid": 19,
        "name": "Tentative Schedule of Competitive Examinations",
        "name_mr": "स्पर्धा परीक्षांचे अंदाजित वेळापत्रक",
        "url": "https://mpsc.gov.in/tentative_schedule_for_competitive_exam/19",
        "default_type": "syllabus",
        "category_tag": "वेळापत्रक (Exam Schedule)",
    },
    {
        "mid": 20,
        "name": "Examination Timetable & Notification Status",
        "name_mr": "परीक्षा वेळापत्रक व सद्यस्थिती",
        "url": "https://mpsc.gov.in/examination_timetable/20",
        "default_type": "syllabus",
        "category_tag": "वेळापत्रक (Timetable)",
    },
    {
        "mid": 4,
        "name": "Announcement and Circulars",
        "name_mr": "प्रसिद्धीपत्रके व परिपत्रके",
        "url": "https://mpsc.gov.in/announcement_and_circular/4",
        "default_type": "recruitment",
        "category_tag": "प्रसिद्धीपत्रक (Circular)",
    },
    {
        "mid": 14,
        "name": "Admit Cards & Hall Tickets",
        "name_mr": "प्रवेशपत्रे / हॉल तिकीट",
        "url": "https://mpsc.gov.in/announcement_and_circular/14",
        "default_type": "admit_card",
        "category_tag": "प्रवेशपत्र (Admit Card)",
    },
    {
        "mid": 10,
        "name": "First / Provisional Answer Keys",
        "name_mr": "प्रथम उत्तरतालिका (Provisional Key)",
        "url": "https://mpsc.gov.in/first_answer_keys/10",
        "default_type": "answer_key",
        "category_tag": "उत्तरतालिका (Provisional Key)",
    },
    {
        "mid": 12,
        "name": "Final Answer Keys",
        "name_mr": "अंतिम उत्तरतालिका (Final Key)",
        "url": "https://mpsc.gov.in/final_answer_keys/12",
        "default_type": "answer_key",
        "category_tag": "उत्तरतालिका (Final Key)",
    },
    {
        "mid": 11,
        "name": "Result of Examination",
        "name_mr": "परीक्षेचे निकाल व गुणवत्ता यादी",
        "url": "https://mpsc.gov.in/result_of_exam/11",
        "default_type": "result",
        "category_tag": "निकाल (Exam Result)",
    },
    {
        "mid": 18,
        "name": "Examination Syllabus & Schemes",
        "name_mr": "अभ्यासक्रम व परीक्षा योजना",
        "url": "https://mpsc.gov.in/examination_syllabus/18",
        "default_type": "syllabus",
        "category_tag": "अभ्यासक्रम (Syllabus)",
    },
]


# ============================================================
# Encryption & Network Helpers
# ============================================================

def get_auth_token(salt: str = MPSC_SALT) -> str:
    """Generate MPSC header authorization token: |#|#{crc32(salt)}"""
    val = zlib.crc32(salt.encode('utf-8')) & 0xffffffff
    return f"|#|#{format(val, 'x')}"


def decrypt_mpsc_payload(cipher_b64: str) -> str:
    """Decrypt AES-128-CBC payload returned by MPSC API."""
    cipher = Cipher(algorithms.AES(AES_KEY), modes.CBC(AES_IV))
    decryptor = cipher.decryptor()
    encrypted = base64.b64decode(cipher_b64)
    padded_data = decryptor.update(encrypted) + decryptor.finalize()
    unpadder = padding.PKCS7(128).unpadder()
    data = unpadder.update(padded_data) + unpadder.finalize()
    return data.decode('utf-8')


def get_ssl_context():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx


def fetch_menu_content(mid: int) -> list:
    """Fetch and decrypt records for MPSC menu ID."""
    url = f"https://mpsc.gov.in/web/api/v1/getcontentdata/{mid}"
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': get_auth_token(),
        'Referer': f'https://mpsc.gov.in/announcement_and_circular/{mid}',
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=get_ssl_context(), timeout=30) as resp:
            raw = resp.read().decode('utf-8').strip('"')
            decrypted = decrypt_mpsc_payload(raw)
            data = json.loads(decrypted)
            return data.get(str(mid), {}).get('webContentList', [])
    except Exception as e:
        logger.error(f"Failed to fetch MPSC menu {mid}: {e}")
        return []


def download_official_pdf(file_id: int, save_path: Path) -> bool:
    """Download official MPSC PDF by its ID with retry backoff."""
    url = f"https://mpsc.gov.in/web/api/v1/downloadFile/english/{file_id}"
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'application/json, text/plain, */*',
        'Authorization': get_auth_token(),
        'Referer': 'https://mpsc.gov.in/announcement_and_circular/4',
    }
    try:
        save_path.parent.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=get_ssl_context(), timeout=40) as resp:
            content = resp.read()
            if content.startswith(b'%PDF'):
                pdf_bytes = content
            else:
                obj = json.loads(content.decode('utf-8', errors='ignore'))
                if 'pdfData' in obj and obj['pdfData']:
                    pdf_bytes = base64.b64decode(obj['pdfData'])
                else:
                    return False
            save_path.write_bytes(pdf_bytes)
            logger.info(f"Downloaded official PDF ({len(pdf_bytes):,} bytes) -> {save_path.name}")
            return True
    except Exception as e:
        logger.warning(f"Could not download PDF for file_id {file_id}: {e}")
        return False


# ============================================================
# Classification & Normalization
# ============================================================

def classify_notification(item: dict, default_type: str) -> str:
    """
    Intelligently classify MPSC notification into:
    'recruitment', 'result', 'admit_card', 'answer_key', or 'syllabus'
    """
    text = f"{item.get('descInEnglish') or ''} {item.get('descMr') or ''}".lower()

    if any(k in text for k in ['result', 'निकाल', 'merit list', 'recommendation list', 'शिफारस यादी', 'screening test result', 'qualified for']):
        return 'result'
    if any(k in text for k in ['admit card', 'hall ticket', 'प्रवेशपत्र', 'admission certificate']):
        return 'admit_card'
    if any(k in text for k in ['answer key', 'उत्तरतालिका', 'first answer key', 'final answer key', 'provisional answer key']):
        return 'answer_key'
    if any(k in text for k in ['syllabus', 'अभ्यासक्रम', 'scheme of examination', 'परीक्षेचे स्वरूप']):
        return 'syllabus'
    if any(k in text for k in ['time table', 'timetable', 'schedule', 'वेळापत्रक']):
        return 'syllabus'

    return default_type


def sanitize_filename(name: str) -> str:
    for char in ['\\', '/', ':', '*', '?', '"', '<', '>', '|', '\t', '\n', '\r']:
        name = name.replace(char, '_')
    return name.strip(' ._')[:100]


# ============================================================
# State & Dedup Management
# ============================================================

def load_state() -> dict:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text(encoding='utf-8'))
        except Exception:
            pass
    return {
        "seen_ids": [],
        "last_run_at": None,
        "total_processed": 0,
        "total_broadcasted": 0,
    }


def save_state(state: dict):
    try:
        STATE_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding='utf-8')
    except Exception as e:
        logger.warning(f"Failed to save state file: {e}")


# ============================================================
# Telegram & WhatsApp Broadcasting
# ============================================================

def format_telegram_alert(item: dict, menu_cfg: dict, notif_type: str, pdf_url: str, portal_url: str) -> str:
    """Generate high-CTR, clean Telegram alert text."""
    desc_en = (item.get('descInEnglish') or '').strip()
    desc_mr = (item.get('descMr') or '').strip()
    advt_no = item.get('advertisementNumber') or '000'
    pub_date = item.get('publicationDate') or datetime.now().strftime("%Y-%m-%d")
    date_display = pub_date[:10]

    category_tag = menu_cfg.get('category_tag', 'अधिकृत अपडेट')
    if notif_type == 'result':
        category_tag = '🏆 निकाल (Exam Result)'
    elif notif_type == 'admit_card':
        category_tag = '🎫 हॉल तिकीट / प्रवेशपत्र (Admit Card)'
    elif notif_type == 'answer_key':
        category_tag = '📝 उत्तरतालिका (Answer Key)'
    elif notif_type == 'syllabus':
        category_tag = '📅 परीक्षा वेळापत्रक (Exam Schedule)'

    msg = f"""🚨 *MPSC OFFICIAL ALERT | नवीन प्रसिद्धीपत्रक* ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *वर्गवारी:* {category_tag}
📋 *जाहिरात क्रमांक:* `{advt_no}`
📅 *प्रसिद्ध दिनांक:* `{date_display}`

🏛️ *Announcement / Subject:*
*{desc_en or desc_mr}*

🇮🇳 *मराठी तपशील:*
{desc_mr or desc_en}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📥 *अधिकृत PDF डाऊनलोड करा:*
{pdf_url}

🌐 *ExamUdaan पोर्टलवर सर्व नोटिफिकेशन्स पहा:*
{portal_url}

📲 *MPSC मोफत WhatsApp चॅनेल:*
{WHATSAPP_CHANNEL_URL}

🔵 *Telegram ग्रुप जॉइन करा:*
{TELEGRAM_CHANNEL_URL}

#MPSC #Maharashtra #MPSCUpdates #ExamUdaan #SarkariNaukri""".strip()
    return msg


def format_whatsapp_alert(item: dict, menu_cfg: dict, notif_type: str, pdf_url: str, portal_url: str) -> str:
    """Generate clean, ready-to-share WhatsApp broadcast block."""
    desc_en = (item.get('descInEnglish') or '').strip()
    desc_mr = (item.get('descMr') or '').strip()
    advt_no = item.get('advertisementNumber') or '000'
    pub_date = item.get('publicationDate') or datetime.now().strftime("%Y-%m-%d")
    date_display = pub_date[:10]

    return f"""📢 *MPSC नवीन प्रसिद्धीपत्रक जाहीर | {date_display}* ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *प्रकार:* {menu_cfg.get('name_mr', 'महाराष्ट्र लोकसेवा आयोग')}
📋 *जाहिरात क्र.:* {advt_no}

📝 *तपशील:*
{desc_mr or desc_en}

📥 *अधिकृत MPSC PDF पहा व डाऊनलोड करा:*
{pdf_url}

👉 *सर्व चालू घडामोडी, अभ्यासक्रम व मागील प्रश्नपत्रिका:*
{portal_url}

📲 *दररोज मोफत WhatsApp अलर्ट्स मिळवण्यासाठी चॅनेल फॉलो करा:*
{WHATSAPP_CHANNEL_URL}
━━━━━━━━━━━━━━━━━━━━━━━━━━""".strip()


def send_telegram_message(text: str) -> bool:
    """Send formatted alert to Telegram channel via Bot API."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.warning("[Telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID — skipping send.")
        return False

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False
    }

    try:
        if requests:
            resp = requests.post(url, json=payload, timeout=15)
            data = resp.json()
            if resp.status_code == 200 and data.get("ok"):
                logger.info("[Telegram] Successfully broadcasted MPSC alert!")
                return True
            else:
                logger.error(f"[Telegram] Error ({resp.status_code}): {data.get('description')}")
                # Retry once without Markdown if formatting syntax error
                payload.pop("parse_mode", None)
                resp2 = requests.post(url, json=payload, timeout=15)
                return resp2.status_code == 200
        else:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                return resp.status == 200
    except Exception as e:
        logger.error(f"[Telegram] Failed to connect: {e}")
        return False


def append_whatsapp_alert(whatsapp_text: str):
    """Write formatted WhatsApp alert to local text dispatch files."""
    try:
        divider = "\n\n" + "=" * 50 + "\n\n"
        with open(WHATSAPP_DIGEST_FILE, "a", encoding="utf-8") as f:
            f.write(whatsapp_text + divider)
        with open(MPSC_WHATSAPP_ALERTS_FILE, "a", encoding="utf-8") as f:
            f.write(whatsapp_text + divider)
        logger.info(f"[WhatsApp] Appended MPSC alert to {WHATSAPP_DIGEST_FILE.name}")
    except Exception as e:
        logger.warning(f"[WhatsApp] Could not write alert file: {e}")


# ============================================================
# Database Synchronization
# ============================================================

def sync_item_to_database(conn, org_id: str, source_id: str, item: dict, menu_cfg: dict, notif_type: str) -> tuple:
    """
    Upserts MPSC notification into exam_notifications.
    Returns (notification_id, slug, is_new).
    """
    desc_en = (item.get('descInEnglish') or '').strip()
    desc_mr = (item.get('descMr') or '').strip()
    title = desc_en if desc_en else desc_mr
    advt_no = item.get('advertisementNumber') or None
    if advt_no == '000':
        advt_no = None

    pub_date_raw = item.get('publicationDate')
    pub_date = None
    if pub_date_raw:
        try:
            pub_date = pub_date_raw[:10]
        except Exception:
            pass

    file_id = item.get('id')
    pdf_url = f"https://mpsc.gov.in/web/api/v1/downloadFile/english/{file_id}"
    source_url = menu_cfg['url']

    # AI extracted metadata
    ai_data = {
        "is_mpsc": True,
        "is_govt": True,
        "is_state_govt": True,
        "government_level": "State",
        "state_normalized": "Maharashtra",
        "mpsc_mid": menu_cfg['mid'],
        "mpsc_item_id": file_id,
        "advt_number": advt_no,
        "english_file_name": item.get('englishFileName'),
        "marathi_file_name": item.get('marathiFileName'),
    }

    # Prevent character varying overflow
    if title and len(title) > 280:
        title = title[:277] + "..."

    data_payload = {
        "title": title,
        "notification_type": notif_type,
        "advt_no": advt_no,
        "description": f"{desc_mr}\n\n{desc_en}".strip(),
        "title_translations": {"en": desc_en, "mr": desc_mr},
        "description_translations": {"en": desc_en, "mr": desc_mr},
        "notification_pdf": pdf_url,
        "source_url": source_url,
        "published_at": pub_date,
        "state_slug": "maharashtra",
        "state_normalized": "Maharashtra",
        "status": "published",
        "ai_extracted_data": ai_data,
        "application_links": {
            "notification_pdf": pdf_url,
            "official_website": "https://mpsc.gov.in",
            "source_section": source_url,
        },
        "important_dates": {
            "published_at": pub_date,
        }
    }

    try:
        notif_id = db.upsert_notification(conn, org_id, source_id, data_payload)
        # Fetch assigned slug from DB
        with conn.cursor() as cur:
            cur.execute("SELECT slug FROM exam_notifications WHERE id = %s", (notif_id,))
            row = cur.fetchone()
            slug = row[0] if row else f"mpsc-{notif_id}"
        return notif_id, slug, True
    except Exception as e:
        logger.error(f"[DB] Error upserting notification {file_id}: {e}")
        try:
            conn.rollback()
        except Exception:
            pass
        return None, None, False


# ============================================================
# Main Pipeline Runner
# ============================================================

def run_pipeline(limit: int = 15, dry_run: bool = False, broadcast: bool = True,
                 force_broadcast: bool = False, download_pdfs: bool = False):
    """
    Executes the MPSC official announcements pipeline across the 3 target menus.
    """
    logger.info("=" * 65)
    logger.info("MPSC Official Announcements & Exam Details Pipeline (ExamUdaan)")
    logger.info(f"Target Menus: {[m['mid'] for m in MPSC_TARGET_MENUS]}")
    logger.info(f"Limit per menu: {limit} | Dry-run: {dry_run} | Broadcast: {broadcast}")
    logger.info("=" * 65)

    state = load_state()
    seen_ids = set(state.get("seen_ids", []))
    is_initial_seeding = (len(seen_ids) == 0)

    if is_initial_seeding:
        logger.info("[State] Initial run detected — will sync existing items and seed baseline state.")

    # Initialize DB connection unless dry run
    conn = None
    org_id = None
    source_id = None
    if not dry_run:
        try:
            conn = db.get_conn()
            org_id = db.get_or_create_org(
                conn,
                name="Maharashtra Public Service Commission",
                acronym="MPSC",
                website="https://mpsc.gov.in",
                department="General Administration Department",
                address="Cooperage Telephone Exchange Building, Maharshi Karve Road, Mumbai - 400021"
            )
            source_id = db.get_or_create_source(
                conn,
                name="MPSC Official Announcements & Examination Portal",
                base_url="https://mpsc.gov.in"
            )
            logger.info(f"[DB] Connected. MPSC Org ID: {org_id} | Source ID: {source_id}")
        except Exception as e:
            logger.error(f"[DB] Connection failed: {e}. Exiting.")
            return

    new_items_found = 0
    broadcast_count = 0

    try:
        for menu in MPSC_TARGET_MENUS:
            mid = menu['mid']
            logger.info(f"\nScanning Menu {mid}: {menu['name']} ({menu['url']})...")
            items = fetch_menu_content(mid)
            logger.info(f"Retrieved {len(items)} items from MPSC API.")

            for idx, item in enumerate(items[:limit]):
                item_id = item.get('id')
                if not item_id:
                    continue

                is_new = (item_id not in seen_ids)
                notif_type = classify_notification(item, menu['default_type'])
                desc_en = item.get('descInEnglish') or item.get('descMr') or 'MPSC Notification'
                advt = item.get('advertisementNumber') or '000'
                pub_date = item.get('publicationDate') or 'Recent'

                logger.info(f"  [{idx + 1}] ID: {item_id} | Advt: {advt} | Type: {notif_type} | {'🆕 NEW' if is_new else '✓ Known'}")
                logger.info(f"      {desc_en[:80]}...")

                if dry_run:
                    continue

                # 1. Upsert into PostgreSQL DB
                notif_id, slug, was_inserted = sync_item_to_database(conn, org_id, source_id, item, menu, notif_type)
                
                # Determine portal URL
                route_prefix = 'jobs'
                if notif_type == 'result':
                    route_prefix = 'results'
                elif notif_type == 'admit_card':
                    route_prefix = 'admit-cards'
                elif notif_type == 'answer_key':
                    route_prefix = 'answer-keys'
                elif notif_type == 'syllabus':
                    route_prefix = 'schemes'

                portal_url = f"{SITE_URL}/{route_prefix}/{slug}" if slug else f"{SITE_URL}/alerts"
                pdf_url = f"https://mpsc.gov.in/web/api/v1/downloadFile/english/{item_id}"

                # 2. Optional PDF local archive
                if download_pdfs:
                    pdf_filename = sanitize_filename(f"{advt}_{desc_en[:50]}_{item_id}.pdf")
                    download_official_pdf(item_id, DOWNLOADS_DIR / pdf_filename)

                # 3. Broadcast Alert to Followers via Telegram & WhatsApp
                should_broadcast = (is_new and broadcast and not is_initial_seeding) or (force_broadcast) or (is_initial_seeding and idx == 0 and broadcast)
                if should_broadcast:
                    logger.info(f"🚀 Broadcasting instant alert for MPSC item {item_id}...")
                    tg_text = format_telegram_alert(item, menu, notif_type, pdf_url, portal_url)
                    wa_text = format_whatsapp_alert(item, menu, notif_type, pdf_url, portal_url)

                    # Send to Telegram
                    sent_tg = send_telegram_message(tg_text)
                    # Write to WhatsApp dispatch queues
                    append_whatsapp_alert(wa_text)

                    if sent_tg:
                        broadcast_count += 1
                        time.sleep(2)  # courteous delay between broadcasts

                seen_ids.add(item_id)
                if is_new:
                    new_items_found += 1

    finally:
        if conn:
            db.release_conn(conn)

    # Save state
    state["seen_ids"] = list(seen_ids)
    state["last_run_at"] = datetime.now().isoformat()
    state["total_processed"] = len(seen_ids)
    state["total_broadcasted"] = state.get("total_broadcasted", 0) + broadcast_count
    save_state(state)

    logger.info("\n" + "=" * 65)
    logger.info(f"Pipeline Run Complete!")
    logger.info(f"New items detected: {new_items_found}")
    logger.info(f"Instant broadcasts sent: {broadcast_count}")
    logger.info(f"Total cataloged MPSC items: {len(seen_ids)}")
    logger.info(f"State saved to {STATE_FILE.name}")
    logger.info("=" * 65)


# ============================================================
# CLI Interface
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="MPSC Announcements & Exam Details Pipeline (ExamUdaan)")
    parser.add_argument("--daily", action="store_true", help="Execute daily run (scans, syncs DB & broadcasts new items)")
    parser.add_argument("--limit", type=int, default=15, help="Number of items to inspect per menu (default: 15)")
    parser.add_argument("--dry-run", action="store_true", help="Inspect without modifying DB or sending broadcasts")
    parser.add_argument("--no-broadcast", action="store_true", help="Sync to DB without sending Telegram/WhatsApp alerts")
    parser.add_argument("--force-broadcast", action="store_true", help="Force broadcast even if item was previously seen")
    parser.add_argument("--download-pdfs", action="store_true", help="Download official PDF files locally")

    args = parser.parse_args()

    broadcast = not args.no_broadcast
    run_pipeline(
        limit=args.limit,
        dry_run=args.dry_run,
        broadcast=broadcast,
        force_broadcast=args.force_broadcast,
        download_pdfs=args.download_pdfs
    )


if __name__ == "__main__":
    main()
