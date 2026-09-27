#!/usr/bin/env python3
"""
Quick DB count check: total, by subject, by exam, by year
"""
import os, sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent.parent / "apps" / "scraper" / ".env")

DSN = (
    f"host={os.getenv('DB_HOST')} "
    f"port={os.getenv('DB_PORT','5432')} "
    f"dbname={os.getenv('DB_DATABASE')} "
    f"user={os.getenv('DB_USERNAME')} "
    f"password={os.getenv('DB_PASSWORD')} "
    f"sslmode=require"
)

conn = psycopg2.connect(DSN)
cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

# Total
cur.execute("SELECT COUNT(*) FROM pyq_questions")
total = cur.fetchone()[0]
print("=" * 55)
print(f"  TOTAL rows in pyq_questions: {total}")
print("=" * 55)

# By subject
print("\n--- BY SUBJECT ---")
cur.execute("""
    SELECT subject, COUNT(*) AS cnt
    FROM pyq_questions
    GROUP BY subject
    ORDER BY cnt DESC
""")
for r in cur.fetchall():
    print(f"  {r['subject']:<30} {r['cnt']:>5}")

# By exam
print("\n--- BY EXAM ---")
cur.execute("""
    SELECT exam, COUNT(*) AS cnt
    FROM pyq_questions
    GROUP BY exam
    ORDER BY cnt DESC
""")
for r in cur.fetchall():
    print(f"  {r['exam']:<45} {r['cnt']:>5}")

# By year
print("\n--- BY YEAR ---")
cur.execute("""
    SELECT year, COUNT(*) AS cnt
    FROM pyq_questions
    GROUP BY year
    ORDER BY year
""")
for r in cur.fetchall():
    print(f"  {r['year']}    {r['cnt']:>5}")

conn.close()
