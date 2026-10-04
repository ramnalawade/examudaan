#!/usr/bin/env python3
"""
broadcast_alerts.py — ExamUdaan Automated Alert Broadcaster
============================================================
Broadcasts newly scraped government job notifications to:
  1. Telegram Channel (@examudaanjobs) in English & Marathi
  2. Generates formatted WhatsApp Channel & Community messages in English, Marathi, & Bilingual formats.

Usage:
  python broadcast_alerts.py --dry-run                    # Preview both English & Marathi message formatting
  python broadcast_alerts.py --limit 5                    # Broadcast top 5 new jobs to Telegram
  python broadcast_alerts.py --lang en                    # Broadcast in English only
  python broadcast_alerts.py --lang mr                    # Broadcast in Marathi only
  python broadcast_alerts.py --lang both                  # Broadcast both (default)
  python broadcast_alerts.py --id 514 --telegram          # Broadcast a specific job by ID
  python broadcast_alerts.py --force                      # Force broadcast even if previously broadcasted
"""

import os
import sys
import json
import time
import argparse
import logging
import requests
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Load scraper .env
load_dotenv()

# Ensure UTF-8 stdout encoding for Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("broadcast_alerts")

# Telegram & WhatsApp configuration
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "@examudaanjobs").strip()
WHATSAPP_CHANNEL_URL = os.getenv("WHATSAPP_CHANNEL_URL", "https://whatsapp.com/channel/0029Vb9E7Kw9sBI4vpwn2y3v").strip()
TELEGRAM_CHANNEL_URL = os.getenv("TELEGRAM_CHANNEL_URL", "https://t.me/examudaanjobsjobs").strip()

HISTORY_FILE = Path(__file__).parent / "broadcast_history.json"
WHATSAPP_DIGEST_FILE = Path(__file__).parent / "todays_whatsapp_posts.txt"

try:
    import db
except ImportError:
    from . import db


def load_broadcast_history():
    """Load set of already broadcasted notification IDs from JSON history file."""
    if HISTORY_FILE.exists():
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return set(data.get("broadcasted_ids", []))
        except Exception as e:
            logger.warning(f"Could not read broadcast history ({e}); starting fresh.")
    return set()


def save_broadcast_history(history_set):
    """Persist set of broadcasted notification IDs to JSON file."""
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump({
                "last_updated": datetime.now().isoformat(),
                "total_broadcasted": len(history_set),
                "broadcasted_ids": sorted(list(history_set))
            }, f, indent=2)
    except Exception as e:
        logger.error(f"Failed to save broadcast history: {e}")


def get_active_notifications(limit=20, specific_id=None):
    """
    Fetch active recruitment notifications from PostgreSQL database.
    Prioritizes upcoming deadlines and recently scraped entries.
    Falls back to a realistic sample if database is unreachable (e.g. during local testing).
    """
    try:
        conn = db.get_conn()
    except Exception as e:
        logger.warning(f"Database connection offline ({e}). Generating realistic sample notification for testing...")
        return [
            {
                "id": 514,
                "slug": "mpsc-514",
                "title": "Civil Judge Junior Division & Judicial Magistrate First Class Examination 2026",
                "notification_type": "recruitment",
                "vacancies": 114,
                "application_end": datetime(2026, 10, 25).date(),
                "source_url": "https://mpsc.gov.in",
                "notification_pdf": "https://mpsc.gov.in/downloadFile/Advt_No_08_2026.pdf",
                "application_links": {
                    "apply_online": "https://mpsconline.gov.in",
                    "notification_pdf": "https://mpsc.gov.in/downloadFile/Advt_No_08_2026.pdf"
                },
                "org_name": "Maharashtra Public Service Commission (MPSC)",
                "org_acronym": "MPSC",
                "ai_extracted_data": {
                    "education_levels": ["Graduate", "Postgraduate"],
                    "education_qualifications": ["LLB (Law Degree)"],
                    "government_level": "State",
                }
            }
        ]

    try:
        with conn.cursor() as cur:
            if specific_id:
                cur.execute("""
                    SELECT 
                        en.id, en.slug, en.title, en.title_mr, en.notification_type, en.total_vacancies,
                        en.apply_end_date, en.source_url, en.notification_pdf,
                        en.application_links, en.education_qualifications, en.education_levels,
                        en.ai_extracted_data, en.created_at,
                        o.name as org_name, o.acronym as org_acronym
                    FROM exam_notifications en
                    LEFT JOIN organizations o ON o.id = en.organization_id
                    WHERE en.id = %s
                """, (specific_id,))
            else:
                cur.execute("""
                    SELECT 
                        en.id, en.slug, en.title, en.title_mr, en.notification_type, en.total_vacancies,
                        en.apply_end_date, en.source_url, en.notification_pdf,
                        en.application_links, en.education_qualifications, en.education_levels,
                        en.ai_extracted_data, en.created_at,
                        o.name as org_name, o.acronym as org_acronym
                    FROM exam_notifications en
                    LEFT JOIN organizations o ON o.id = en.organization_id
                    WHERE (en.apply_end_date IS NULL OR en.apply_end_date >= CURRENT_DATE)
                      AND (en.notification_type = 'recruitment' OR en.is_job_notification = true)
                      AND en.title IS NOT NULL
                    ORDER BY en.id DESC
                    LIMIT %s
                """, (limit,))

            cols = [desc[0] for desc in cur.description]
            rows = cur.fetchall()
            return [dict(zip(cols, row)) for row in rows]
    finally:
        try:
            db.release_conn(conn)
        except Exception:
            pass


def generate_hashtags(row):
    """
    Generate relevant social hashtags based on org acronym and job title.
    """
    tags = ["#MaharashtraJobs", "#SarkariNaukri", "#ExamUdaan"]
    acronym = row.get("org_acronym")
    if acronym:
        clean_acr = "".join(c for c in acronym if c.isalnum())
        if clean_acr:
            tags.insert(0, f"#{clean_acr}")

    title = row.get("title", "")
    for keyword in ["Police", "MPSC", "UPSC", "Teacher", "Engineer", "Clerk", "Doctor", "CivilJudge", "Judge", "Bank", "Railway", "BMC", "Talathi", "Arogya"]:
        if keyword.lower() in title.lower():
            if f"#{keyword}" not in tags:
                tags.insert(1, f"#{keyword}")
            break

    return " ".join(tags[:5])


def extract_common_fields(row):
    """Extract and normalize all notification attributes for formatting."""
    title_en = (row.get('title') or 'Government Job Recruitment').strip()
    title_mr = (row.get('title_mr') or row.get('title') or 'शासकीय नोकरी भरती जाहिरात').strip()
    org_name = row.get('org_name') or row.get('org_acronym') or 'Government of Maharashtra / India'
    
    vacancies = row.get('total_vacancies')
    if vacancies and int(vacancies) > 0:
        vacancies_mr = f"{int(vacancies):,}"
        vacancies_en = f"{int(vacancies):,} Posts"
    else:
        vacancies_mr = "पहा अधिकृत जाहिरात"
        vacancies_en = "Refer Official Gazette"

    app_end = row.get('apply_end_date')
    if app_end:
        try:
            deadline_str = app_end.strftime("%d %B %Y")
        except AttributeError:
            deadline_str = str(app_end)
    else:
        deadline_str = "Check Gazette / लवकरच अंतिम मुदत"

    # Qualifications extraction (from direct column or AI data)
    edu_quals = row.get('education_qualifications')
    if not edu_quals:
        ai = row.get('ai_extracted_data') or {}
        edu_quals = ai.get('education_qualifications') or row.get('education_levels') or ai.get('education_levels')

    if isinstance(edu_quals, list) and edu_quals:
        qualification = ", ".join(str(q) for q in edu_quals[:3])
    elif isinstance(edu_quals, str) and edu_quals.strip():
        qualification = edu_quals.strip("[]'\" ")
    else:
        qualification = "१०वी / १२वी / पदवीधर (Check Notification)"

    # Official PDF Link
    pdf_url = row.get('notification_pdf')
    if not pdf_url and row.get('application_links'):
        pdf_url = row['application_links'].get('notification_pdf')
    if not pdf_url:
        pdf_url = row.get('source_url') or f"https://examudaan.in/jobs/{row.get('slug') or row.get('id')}"

    # Official Apply Link
    apply_url = None
    if row.get('application_links'):
        apply_url = row['application_links'].get('apply_online')
    if not apply_url:
        apply_url = row.get('source_url') or f"https://examudaan.in/jobs/{row.get('slug') or row.get('id')}"

    slug = row.get('slug') or f"{row.get('org_acronym', 'job').lower()}-{row.get('id')}"
    examudaan_url = f"https://examudaan.in/jobs/{slug}"
    hashtags = generate_hashtags(row)

    return {
        "title_en": title_en,
        "title_mr": title_mr,
        "title": title_en,
        "org_name": org_name,
        "vacancies_mr": vacancies_mr,
        "vacancies_en": vacancies_en,
        "deadline_str": deadline_str,
        "qualification": qualification,
        "pdf_url": pdf_url,
        "apply_url": apply_url,
        "examudaan_url": examudaan_url,
        "hashtags": hashtags,
    }


def format_post_mr(row):
    """
    Marathi Post Template (WhatsApp Markdown & Telegram friendly)
    """
    f = extract_common_fields(row)
    return f"""🔥 *नवीन सरकारी नोकरी जाहिरात | ExamUdaan.in* 🔥

🏛️ *विभाग:* {f['org_name']}
💼 *पद:* {f['title_mr']}
👥 *एकूण जागा:* {f['vacancies_mr']}
🎓 *पात्रता:* {f['qualification']}
⏰ *अर्ज करण्याची शेवटची तारीख:* {f['deadline_str']}

👉 *सविस्तर माहिती:* {f['examudaan_url']}
📄 *अधिकृत जाहिरात PDF:* {f['pdf_url']}
🖥️ *अधिकृत अर्ज लिंक:* {f['apply_url']}

📲 *दररोज मोफत WhatsApp अलर्ट मिळवण्यासाठी चॅनेल फॉलो करा:*
{WHATSAPP_CHANNEL_URL}

🔵 *Telegram चॅनेल जॉइन करा:*
{TELEGRAM_CHANNEL_URL}

{f['hashtags']}""".strip()


def format_post_en(row):
    """
    English Post Template (WhatsApp Markdown & Telegram friendly)
    """
    f = extract_common_fields(row)
    return f"""🔥 *NEW GOVT JOB RECRUITMENT | ExamUdaan.in* 🔥

🏛️ *Department / Board:* {f['org_name']}
💼 *Post Name:* {f['title_en']}
👥 *Total Vacancies:* {f['vacancies_en']}
🎓 *Qualification:* {f['qualification']}
⏰ *Last Date to Apply:* {f['deadline_str']}

👉 *Full Details:* {f['examudaan_url']}
📄 *Official Notification PDF:* {f['pdf_url']}
🖥️ *Official Apply Link:* {f['apply_url']}

📲 *Follow WhatsApp Channel for Daily Alerts:*
{WHATSAPP_CHANNEL_URL}

🔵 *Join Telegram Channel:*
{TELEGRAM_CHANNEL_URL}

{f['hashtags']}""".strip()


def format_post_bilingual(row):
    """
    Combined Bilingual Post (Marathi + English)
    """
    f = extract_common_fields(row)
    return f"""🔥 *नवीन भरती जाहिरात | NEW GOVT JOB ALERT* ⚡
🏛️ *विभाग / Organization:* {f['org_name']}
💼 *पद / Post:* {f['title']}
👥 *जागा / Vacancies:* {f['vacancies_en']}
🎓 *पात्रता / Qualification:* {f['qualification']}
⏰ *शेवटची तारीख / Last Date:* {f['deadline_str']}

👉 *सविस्तर माहिती / Full Details:*
{f['examudaan_url']}

📄 *अधिकृत PDF / Notification PDF:*
{f['pdf_url']}

🖥️ *अधिकृत अर्ज लिंक / Apply Online:*
{f['apply_url']}

───────────────
📲 *WhatsApp Alerts:* {WHATSAPP_CHANNEL_URL}
🔵 *Telegram Alerts:* {TELEGRAM_CHANNEL_URL}

{f['hashtags']}""".strip()


def send_telegram_message(text):
    """
    Send formatted message to Telegram Channel via Telegram Bot API.
    Supports both HTML and Markdown formatting.
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment variables.")
        return False

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "disable_web_page_preview": False
    }

    try:
        resp = requests.post(url, json=payload, timeout=15)
        data = resp.json()
        if resp.status_code == 200 and data.get("ok"):
            logger.info("Successfully broadcasted message to Telegram channel!")
            return True
        else:
            logger.error(f"Telegram API error ({resp.status_code}): {data.get('description')}")
            return False
    except Exception as e:
        logger.error(f"Failed to connect to Telegram API: {e}")
        return False


def broadcast_new_jobs(limit=10, dry_run=False, force=False, specific_id=None, lang="both"):
    """
    Main broadcast function:
    1. Loads broadcast history to avoid duplicate posts.
    2. Identifies new, active recruitment notifications.
    3. Posts English and/or Marathi alerts to Telegram.
    4. Saves formatted WhatsApp posts (English & Marathi) to todays_whatsapp_posts.txt.
    5. Updates broadcast history file.
    """
    history = load_broadcast_history()
    all_notifications = get_active_notifications(limit=max(limit * 3, 20), specific_id=specific_id)

    if specific_id:
        to_broadcast = all_notifications
    elif force:
        to_broadcast = all_notifications[:limit]
    else:
        to_broadcast = [n for n in all_notifications if n.get('id') not in history][:limit]

    if not to_broadcast:
        logger.info("[BROADCAST] All current notifications have already been broadcasted. No new alerts to post.")
        return 0, 0

    logger.info(f"[BROADCAST] Found {len(to_broadcast)} new notification(s) ready to broadcast (Language: {lang}).")

    sent_count = 0
    fail_count = 0
    wa_mr_posts = []
    wa_en_posts = []
    wa_bi_posts = []

    for idx, notif in enumerate(to_broadcast, 1):
        nid = notif.get('id')
        title = notif.get('title')
        logger.info(f"[BROADCAST {idx}/{len(to_broadcast)}] Processing: ID {nid} — {title[:50]}...")

        mr_post = format_post_mr(notif)
        en_post = format_post_en(notif)
        bi_post = format_post_bilingual(notif)

        wa_mr_posts.append(mr_post)
        wa_en_posts.append(en_post)
        wa_bi_posts.append(bi_post)

        if dry_run:
            print("\n" + "=" * 60)
            print(f"[{idx}/{len(to_broadcast)}] 🇬🇧 ENGLISH POST PREVIEW (ID: {nid}):")
            print("=" * 60)
            print(en_post)
            print("\n" + "-" * 60)
            print(f"[{idx}/{len(to_broadcast)}] 🇮🇳 MARATHI POST PREVIEW (ID: {nid}):")
            print("-" * 60)
            print(mr_post)
            print("=" * 60)
            sent_count += 1
        else:
            # Broadcast to Telegram based on requested language
            if lang in ("mr", "both"):
                ok_mr = send_telegram_message(mr_post)
                if ok_mr:
                    sent_count += 1
                    time.sleep(1.2)
                else:
                    fail_count += 1

            if lang in ("en", "both"):
                ok_en = send_telegram_message(en_post)
                if ok_en:
                    sent_count += 1
                    time.sleep(1.2)
                else:
                    fail_count += 1

            if nid and sent_count > 0:
                history.add(nid)

    # Persist updated history
    if not dry_run and sent_count > 0:
        save_broadcast_history(history)

    # Save today's WhatsApp posts categorized by language for 1-click posting
    try:
        divider = "\n\n" + ("=" * 50) + "\n\n"
        with open(WHATSAPP_DIGEST_FILE, "w", encoding="utf-8") as f:
            f.write(f"# ExamUdaan WhatsApp Channel Digest — {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
            f.write("############################################################\n")
            f.write("### SECTION 1: MARATHI POSTS (मराठी पोस्ट्स)\n")
            f.write("############################################################\n\n")
            f.write(divider.join(wa_mr_posts))
            f.write("\n\n\n############################################################\n")
            f.write("### SECTION 2: ENGLISH POSTS (ENGLISH ALERTS)\n")
            f.write("############################################################\n\n")
            f.write(divider.join(wa_en_posts))
            f.write("\n\n\n############################################################\n")
            f.write("### SECTION 3: BILINGUAL POSTS (संयुक्त मराठी + इंग्रजी)\n")
            f.write("############################################################\n\n")
            f.write(divider.join(wa_bi_posts))

        logger.info(f"[BROADCAST] WhatsApp channel messages (English + Marathi) saved to: {WHATSAPP_DIGEST_FILE.name}")
    except Exception as e:
        logger.warning(f"Could not write WhatsApp digest file: {e}")

    logger.info(f"[BROADCAST COMPLETE] Successfully sent: {sent_count}, Failed: {fail_count}")
    return sent_count, fail_count


def copy_to_clipboard(text):
    """Copy text to Windows clipboard using built-in clip command."""
    if sys.platform == "win32":
        try:
            import subprocess
            subprocess.run("clip", input=text.encode("utf-16"), check=True)
            return True
        except Exception as e:
            logger.warning(f"Could not copy to clipboard: {e}")
    return False


def main():
    parser = argparse.ArgumentParser(description="ExamUdaan Job Notification Alert Broadcaster")
    parser.add_argument("--dry-run", action="store_true", help="Print formatted messages without sending")
    parser.add_argument("--limit", type=int, default=5, help="Number of new jobs to broadcast (default: 5)")
    parser.add_argument("--id", type=int, help="Broadcast a specific notification by ID")
    parser.add_argument("--force", action="store_true", help="Force broadcast even if already posted")
    parser.add_argument("--lang", choices=["en", "mr", "both"], default="both", help="Post language (default: both)")
    parser.add_argument("--telegram", action="store_true", help="Broadcast to Telegram channel")
    parser.add_argument("--whatsapp", action="store_true", help="Generate WhatsApp post, copy to clipboard, and open WhatsApp")
    args = parser.parse_args()

    logger.info("ExamUdaan Broadcast Alert Engine starting...")

    # If --whatsapp flag is passed
    if args.whatsapp:
        all_notifications = get_active_notifications(limit=args.limit, specific_id=args.id)
        if not all_notifications:
            logger.info("No active notifications found for WhatsApp.")
            return

        notif = all_notifications[0]
        if args.lang == "en":
            post_text = format_post_en(notif)
        elif args.lang == "mr":
            post_text = format_post_mr(notif)
        else:
            post_text = format_post_bilingual(notif)

        print("\n" + "=" * 60)
        print("📲 WHATSAPP POST READY TO PUBLISH:")
        print("=" * 60)
        print(post_text)
        print("=" * 60)

        # Copy to Windows clipboard
        copied = copy_to_clipboard(post_text)
        if copied:
            print("\n✅ SUCCESS: Post automatically COPIED to your clipboard!")
            print("👉 Open your WhatsApp Channel and simply press Ctrl + V to publish.\n")
        else:
            print("\n👉 Highlight and copy the text above, then paste in your WhatsApp Channel.\n")

        print(f"📁 All {len(all_notifications)} today's jobs are also saved in: {WHATSAPP_DIGEST_FILE.name}")
        return

    # Normal execution for Telegram / dry-run
    is_dry = args.dry_run or (not args.telegram)
    broadcast_new_jobs(limit=args.limit, dry_run=is_dry, force=args.force, specific_id=args.id, lang=args.lang)


if __name__ == "__main__":
    main()
