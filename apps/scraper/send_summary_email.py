#!/usr/bin/env python3
"""
send_summary_email.py — ExamUdaan Consolidated Crawl Summary Email
==================================================================
Sends ONE comprehensive, executive-level summary email via Brevo at the end
of the crawl run (or end of day), summarizing:
- All websites / agencies crawled
- Total new notifications ingested and updated
- Breakdown by state / region
- List of newly discovered government exams & jobs
- Execution status & duration per spider

Usage:
    # Standalone for today's summary:
    python send_summary_email.py --today

    # Or called programmatically from run_scraper.py:
    from send_summary_email import send_consolidated_summary_email
    send_consolidated_summary_email(run_start_time, spider_results)
"""

import argparse
import logging
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests
from dotenv import load_dotenv

# Ensure apps/scraper is in path and env is loaded
SCRAPER_DIR = Path(__file__).parent.resolve()
load_dotenv(SCRAPER_DIR / ".env")

import db as pg_db

logger = logging.getLogger("summary_email")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")


BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def get_crawl_metrics(since_time: datetime):
    """
    Query PostgreSQL for all scrape logs and exam_notifications since since_time.
    """
    conn = None
    try:
        conn = pg_db.get_conn()
        cur = conn.cursor()

        # 1. Scrape logs per source
        cur.execute("""
            SELECT 
                s.name AS source_name,
                COALESCE(SUM(sl.records_added), 0) AS total_added,
                COALESCE(SUM(sl.records_updated), 0) AS total_updated,
                COALESCE(SUM(array_length(sl.errors, 1)), 0) AS error_count,
                MIN(sl.started_at) AS first_start,
                MAX(sl.finished_at) AS last_finish
            FROM scrape_log sl
            JOIN scrape_sources s ON s.id = sl.source_id
            WHERE sl.started_at >= %s
            GROUP BY s.name
            ORDER BY total_added DESC, s.name ASC
        """, (since_time,))
        scrape_rows = cur.fetchall()

        # 2. Overall counts in exam_notifications
        cur.execute("""
            SELECT 
                COUNT(*) FILTER (WHERE created_at >= %s) AS total_new,
                COUNT(*) FILTER (WHERE updated_at >= %s AND (created_at < %s OR created_at IS NULL)) AS total_updated,
                COUNT(DISTINCT organization_id) FILTER (WHERE created_at >= %s OR updated_at >= %s) AS total_orgs
            FROM exam_notifications
        """, (since_time, since_time, since_time, since_time, since_time))
        overview_row = cur.fetchone()
        total_new = overview_row[0] or 0
        total_updated = overview_row[1] or 0
        total_orgs = overview_row[2] or 0

        # 3. State breakdown of new items
        cur.execute("""
            SELECT COALESCE(state_slug, 'all-india') AS state, COUNT(*) AS count
            FROM exam_notifications
            WHERE created_at >= %s
            GROUP BY state_slug
            ORDER BY count DESC
            LIMIT 12
        """, (since_time,))
        state_breakdown = cur.fetchall()

        # 4. Type breakdown of new items
        cur.execute("""
            SELECT COALESCE(notification_type, 'recruitment') AS ntype, COUNT(*) AS count
            FROM exam_notifications
            WHERE created_at >= %s
            GROUP BY notification_type
            ORDER BY count DESC
        """, (since_time,))
        type_breakdown = cur.fetchall()

        # 5. Top 15 newly added notifications
        cur.execute("""
            SELECT 
                en.title,
                COALESCE(o.acronym, o.name, 'Govt') AS org,
                COALESCE(en.state_slug, 'all-india') AS state,
                COALESCE(en.notification_type, 'recruitment') AS ntype,
                COALESCE(en.notification_pdf, en.source_url, '') AS link,
                en.slug,
                en.created_at
            FROM exam_notifications en
            LEFT JOIN organizations o ON o.id = en.organization_id
            WHERE en.created_at >= %s
            ORDER BY en.created_at DESC
            LIMIT 15
        """, (since_time,))
        latest_notifications = cur.fetchall()

        return {
            "scrape_rows": scrape_rows,
            "total_new": total_new,
            "total_updated": total_updated,
            "total_orgs": total_orgs,
            "state_breakdown": state_breakdown,
            "type_breakdown": type_breakdown,
            "latest_notifications": latest_notifications,
        }
    except Exception as e:
        logger.error(f"Failed to query crawl metrics: {e}")
        return None
    finally:
        if conn:
            pg_db.release_conn(conn)


def build_consolidated_email_html(metrics: dict, spider_results: dict, start_time: datetime, end_time: datetime) -> str:
    """
    Constructs a responsive, executive HTML email summarizing the complete crawl.
    """
    duration = end_time - start_time
    duration_str = str(duration).split(".")[0]

    scrape_rows = metrics.get("scrape_rows", [])
    total_new = metrics.get("total_new", 0)
    total_updated = metrics.get("total_updated", 0)
    state_breakdown = metrics.get("state_breakdown", [])
    type_breakdown = metrics.get("type_breakdown", [])
    latest_notifications = metrics.get("latest_notifications", [])

    # Spiders stats
    spiders_run = len(spider_results) if spider_results else len(scrape_rows)
    ok_spiders = sum(1 for s in spider_results.values() if (s == "OK" or (isinstance(s, dict) and s.get("status") == "OK"))) if spider_results else spiders_run
    fail_spiders = spiders_run - ok_spiders

    overall_status = "✅ Complete & Healthy" if fail_spiders == 0 else f"⚠️ {fail_spiders} Spider(s) Warning"
    status_bg = "#10b981" if fail_spiders == 0 else "#f59e0b"

    # Map database source stats by name
    db_source_map = {}
    for r in scrape_rows:
        src_name, added, updated, err_count, first_s, last_f = r
        db_source_map[src_name.lower()] = {
            "added": added,
            "updated": updated,
            "errors": err_count,
        }

    # Build Website Crawl Table rows
    table_rows = ""
    # Use union of spider_results and db_source_map
    all_names = set(spider_results.keys()) if spider_results else set(db_source_map.keys())
    all_names.update(db_source_map.keys())

    for name in sorted(all_names):
        # Spider execution info
        res = spider_results.get(name) if spider_results else None
        if isinstance(res, dict):
            spider_st = res.get("status", "OK")
            spider_dur = res.get("duration", "-")
        elif isinstance(res, str):
            spider_st = res
            spider_dur = "-"
        else:
            spider_st = "OK"
            spider_dur = "-"

        db_stat = db_source_map.get(name.lower(), {"added": 0, "updated": 0, "errors": 0})
        added = db_stat["added"]
        updated = db_stat["updated"]

        if spider_st == "FAIL" or db_stat["errors"] > 0:
            badge = "<span style='background:#fee2e2;color:#b91c1c;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:bold'>FAIL</span>"
        elif added > 0:
            badge = f"<span style='background:#dcfce7;color:#15803d;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:bold'>+{added} NEW</span>"
        else:
            badge = "<span style='background:#f1f5f9;color:#475569;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:bold'>OK</span>"

        dur_text = f"{spider_dur}" if spider_dur != "-" else ""

        table_rows += f"""
        <tr style='border-bottom:1px solid #f1f5f9'>
            <td style='padding:10px 14px;font-weight:600;color:#1e293b'>{name.upper()}</td>
            <td style='padding:10px 14px;text-align:center'>{badge}</td>
            <td style='padding:10px 14px;text-align:center;font-weight:bold;color:#15803d'>{added}</td>
            <td style='padding:10px 14px;text-align:center;color:#64748b'>{updated}</td>
            <td style='padding:10px 14px;text-align:right;color:#64748b;font-size:12px'>{dur_text}</td>
        </tr>
        """

    if not table_rows:
        table_rows = "<tr><td colspan='5' style='padding:16px;text-align:center;color:#94a3b8'>No spiders recorded</td></tr>"

    # State pills / rows
    state_html = ""
    for st, count in state_breakdown:
        formatted_st = st.replace("-", " ").title()
        state_html += f"""
        <div style='display:inline-block;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:6px 12px;margin:4px 6px 4px 0;font-size:13px'>
            <strong style='color:#0f172a'>{formatted_st}:</strong> <span style='color:#ea580c;font-weight:bold'>{count}</span>
        </div>
        """
    if not state_html:
        state_html = "<span style='color:#94a3b8;font-size:13px'>None recorded in this window</span>"

    # Type pills
    type_html = ""
    for tp, count in type_breakdown:
        formatted_tp = tp.replace("_", " ").title()
        type_html += f"""
        <div style='display:inline-block;background:#eff6ff;border:1px solid #dbeafe;border-radius:6px;padding:6px 12px;margin:4px 6px 4px 0;font-size:13px'>
            <strong style='color:#1e40af'>{formatted_tp}:</strong> <span style='color:#2563eb;font-weight:bold'>{count}</span>
        </div>
        """
    if not type_html:
        type_html = "<span style='color:#94a3b8;font-size:13px'>None recorded in this window</span>"

    # Latest Notifications list
    notifications_html = ""
    site_base = os.getenv("NEXT_PUBLIC_SITE_URL", "https://examudaan.in")
    for row in latest_notifications:
        title, org, state, ntype, ext_link, slug, created_at = row
        detail_url = f"{site_base}/jobs/{slug}" if slug else (ext_link or site_base)
        state_label = state.replace("-", " ").title()
        notifications_html += f"""
        <div style='padding:12px 14px;border-bottom:1px solid #f1f5f9'>
            <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:4px'>
                <span style='background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold'>{org}</span>
                <span style='color:#64748b;font-size:12px'>{state_label} &bull; {ntype.replace('_', ' ').title()}</span>
            </div>
            <a href='{detail_url}' target='_blank' style='font-size:14px;font-weight:600;color:#1d4ed8;text-decoration:none;line-height:1.4'>{title}</a>
        </div>
        """
    if not notifications_html:
        notifications_html = "<div style='padding:16px;text-align:center;color:#94a3b8'>No new jobs detected in this crawl run. Existing active listings remain synchronized.</div>"

    return f"""
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>ExamUdaan Crawl Summary Report</title>
</head>
<body style='margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1e293b'>
  <div style='max-width:720px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);border:1px solid #e2e8f0'>
    
    <!-- Top Header -->
    <div style='background:linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #ea580c 100%);padding:28px 32px;color:#ffffff'>
      <div style='font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:700;color:#fdba74;margin-bottom:6px'>EXAMUDAAN RECRUITMENT AGGREGATOR</div>
      <h1 style='margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px'>📊 Daily Crawl & Ingestion Summary</h1>
      <p style='margin:8px 0 0;font-size:14px;color:#e2e8f0;opacity:0.9'>
        Run Completed: <strong>{end_time.strftime('%d %b %Y, %I:%M %p IST')}</strong> &nbsp;&bull;&nbsp; Duration: <strong>{duration_str}</strong>
      </p>
    </div>

    <!-- Status Ribbon -->
    <div style='background:{status_bg};color:#ffffff;padding:10px 32px;font-size:14px;font-weight:700;display:flex;align-items:center'>
      <span>{overall_status}</span>
    </div>

    <!-- KPI Metric Cards -->
    <div style='display:table;width:100%;table-layout:fixed;border-bottom:1px solid #e2e8f0;background:#fafafa'>
      <div style='display:table-cell;padding:20px;text-align:center;border-right:1px solid #e2e8f0'>
        <div style='font-size:30px;font-weight:800;color:#ea580c'>{total_new}</div>
        <div style='font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;margin-top:4px'>New Jobs Added</div>
      </div>
      <div style='display:table-cell;padding:20px;text-align:center;border-right:1px solid #e2e8f0'>
        <div style='font-size:30px;font-weight:800;color:#2563eb'>{spiders_run}</div>
        <div style='font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;margin-top:4px'>Websites Crawled</div>
      </div>
      <div style='display:table-cell;padding:20px;text-align:center;border-right:1px solid #e2e8f0'>
        <div style='font-size:30px;font-weight:800;color:#059669'>{ok_spiders}</div>
        <div style='font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;margin-top:4px'>Success / OK</div>
      </div>
      <div style='display:table-cell;padding:20px;text-align:center'>
        <div style='font-size:30px;font-weight:800;color:#475569'>{total_updated}</div>
        <div style='font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;margin-top:4px'>Updated / Checked</div>
      </div>
    </div>

    <!-- Section: Newly Ingested Notifications -->
    <div style='padding:24px 32px;border-bottom:1px solid #e2e8f0'>
      <h2 style='margin:0 0 16px;font-size:16px;color:#0f172a;font-weight:700;display:flex;align-items:center'>
        ⚡ Newly Ingested Notifications ({total_new})
      </h2>
      <div style='border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;background:#ffffff'>
        {notifications_html}
      </div>
    </div>

    <!-- Section: Breakdown by State & Notification Type -->
    <div style='padding:24px 32px;border-bottom:1px solid #e2e8f0'>
      <h2 style='margin:0 0 12px;font-size:16px;color:#0f172a;font-weight:700'>🗺️ Breakdown by State / Region</h2>
      <div style='margin-bottom:16px'>
        {state_html}
      </div>
      <h2 style='margin:16px 0 12px;font-size:16px;color:#0f172a;font-weight:700'>📑 Breakdown by Notification Type</h2>
      <div>
        {type_html}
      </div>
    </div>

    <!-- Section: Crawled Websites & Spider Table -->
    <div style='padding:24px 32px'>
      <h2 style='margin:0 0 16px;font-size:16px;color:#0f172a;font-weight:700'>🌐 Crawled Websites & Portals Status</h2>
      <div style='border:1px solid #e2e8f0;border-radius:8px;overflow:hidden'>
        <table style='width:100%;border-collapse:collapse;font-size:13px;text-align:left'>
          <thead>
            <tr style='background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:12px;text-transform:uppercase'>
              <th style='padding:10px 14px'>Website / Portal</th>
              <th style='padding:10px 14px;text-align:center'>Status</th>
              <th style='padding:10px 14px;text-align:center'>Added</th>
              <th style='padding:10px 14px;text-align:center'>Updated</th>
              <th style='padding:10px 14px;text-align:right'>Duration</th>
            </tr>
          </thead>
          <tbody>
            {table_rows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style='background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;font-size:12px;color:#94a3b8'>
      <p style='margin:0 0 4px'>ExamUdaan.in &bull; Automated Daily Crawl Dispatcher</p>
      <p style='margin:0'>Sent automatically to {os.getenv("BREVO_RECIPIENT_EMAIL", "ramnalawade1986@gmail.com")}</p>
    </div>

  </div>
</body>
</html>
    """


def send_consolidated_summary_email(run_start_time: datetime, spider_results: dict = None) -> bool:
    """
    Sends ONE consolidated summary email via Brevo transactional email API.
    """
    api_key = os.getenv("BREVO_API_KEY", "")
    sender_email = os.getenv("BREVO_SENDER_EMAIL", "virajnalawade2010@gmail.com")
    sender_name = os.getenv("BREVO_SENDER_NAME", "Exam Udaan Scraper")
    recipient_email = os.getenv("BREVO_RECIPIENT_EMAIL", "ramnalawade1986@gmail.com")

    if not api_key:
        logger.warning("[BREVO] BREVO_API_KEY not configured — skipping summary email.")
        return False

    end_time = datetime.now()
    logger.info(f"[BREVO] Preparing consolidated crawl report since {run_start_time.strftime('%Y-%m-%d %H:%M:%S')}...")

    metrics = get_crawl_metrics(run_start_time)
    if not metrics:
        metrics = {
            "scrape_rows": [],
            "total_new": 0,
            "total_updated": 0,
            "total_orgs": 0,
            "state_breakdown": [],
            "type_breakdown": [],
            "latest_notifications": [],
        }

    total_new = metrics.get("total_new", 0)
    spiders_count = len(spider_results) if spider_results else len(metrics.get("scrape_rows", []))

    subject = f"[ExamUdaan] Daily Crawl Summary | {end_time.strftime('%d %b %Y')} | {total_new} New Jobs Ingested ({spiders_count} Sites Crawled)"

    html_content = build_consolidated_email_html(
        metrics=metrics,
        spider_results=spider_results or {},
        start_time=run_start_time,
        end_time=end_time,
    )

    payload = {
        "sender": {"name": sender_name, "email": sender_email},
        "to": [{"email": recipient_email}],
        "subject": subject,
        "htmlContent": html_content,
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": api_key,
    }

    try:
        resp = requests.post(BREVO_API_URL, json=payload, headers=headers, timeout=20)
        if resp.status_code in (200, 201):
            msg_id = resp.json().get("messageId", "ok")
            logger.info(f"[BREVO] ✅ Consolidated Crawl Report sent to {recipient_email} (messageId={msg_id})")
            return True
        else:
            logger.error(f"[BREVO] ❌ Failed to send email — API HTTP {resp.status_code}: {resp.text}")
            return False
    except Exception as e:
        logger.error(f"[BREVO] ❌ Exception while sending email: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Send consolidated ExamUdaan crawl summary email")
    parser.add_argument("--today", action="store_true", help="Send summary for all crawls today")
    parser.add_argument("--hours", type=int, default=24, help="Summary window in hours (default: 24)")
    args = parser.parse_args()

    if args.today:
        start_time = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        start_time = datetime.now() - timedelta(hours=args.hours)

    logger.info(f"Generating summary report since: {start_time}")
    success = send_consolidated_summary_email(run_start_time=start_time, spider_results={})
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
