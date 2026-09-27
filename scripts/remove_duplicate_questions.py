#!/usr/bin/env python3
"""
ExamUdaan -- Duplicate PYQ Question Remover
Finds duplicate rows in pyq_questions (same question text), keeps lowest id.

Usage:
  python scripts/remove_duplicate_questions.py           # dry run (safe, no deletes)
  python scripts/remove_duplicate_questions.py --confirm # actually delete duplicates
"""

import os
import sys
import argparse
from pathlib import Path
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

# Force UTF-8 output on Windows console (handles Marathi/Devanagari text)
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# .env lives at apps/scraper/.env (same as apps/scraper/db.py)
_env_path = Path(__file__).resolve().parent.parent / "apps" / "scraper" / ".env"
load_dotenv(dotenv_path=_env_path)

# Same connection pattern as apps/scraper/db.py
DSN = (
    f"host={os.getenv('DB_HOST')} "
    f"port={os.getenv('DB_PORT', '5432')} "
    f"dbname={os.getenv('DB_DATABASE')} "
    f"user={os.getenv('DB_USERNAME')} "
    f"password={os.getenv('DB_PASSWORD')} "
    f"sslmode=require"
)


def get_conn():
    return psycopg2.connect(DSN)


def find_duplicates(cur):
    """
    Returns groups where question text appears more than once.
    Each row: q_text, cnt, keep_id (min id), all_ids, exams, years
    """
    cur.execute("""
        SELECT
            TRIM(question)                      AS q_text,
            COUNT(*)                            AS cnt,
            MIN(id)                             AS keep_id,
            ARRAY_AGG(id ORDER BY id)           AS all_ids,
            ARRAY_AGG(exam ORDER BY id)         AS exams,
            ARRAY_AGG(year ORDER BY id)         AS years
        FROM pyq_questions
        GROUP BY TRIM(question)
        HAVING COUNT(*) > 1
        ORDER BY cnt DESC, q_text
    """)
    return cur.fetchall()


def main():
    parser = argparse.ArgumentParser(description="Remove duplicate PYQ questions")
    parser.add_argument("--confirm", action="store_true",
                        help="Actually delete duplicates (default is dry run only)")
    args = parser.parse_args()

    mode = "LIVE DELETE" if args.confirm else "DRY RUN (no changes made)"
    print("=" * 65)
    print("ExamUdaan -- PYQ Duplicate Question Remover")
    print(f"Mode: {mode}")
    print("=" * 65)

    conn = get_conn()
    conn.autocommit = False
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # -- Step 1: Find duplicates --
    print("\n[1/3] Scanning pyq_questions for duplicate question text ...")
    dups = find_duplicates(cur)

    if not dups:
        print("\nNo duplicates found. All questions are unique.")
        conn.close()
        return

    total_to_delete = sum(row["cnt"] - 1 for row in dups)
    print(f"\nFound {len(dups)} duplicate groups -> {total_to_delete} rows to delete\n")

    # -- Step 2: Print sample --
    print("[2/3] Sample duplicate groups (up to 10):")
    print("-" * 65)
    for row in dups[:10]:
        q = row["q_text"][:90].replace("\n", " ")
        keep = row["keep_id"]
        try:
            print(f"  Q : {q} ...")
        except UnicodeEncodeError:
            print(f"  Q : [Unicode/Marathi text, first id={row['all_ids'][0]}] ...")
        print(f"      Appears {row['cnt']}x | KEEP id={keep} ({row['exams'][0]}, {row['years'][0]})")
        for idx in range(1, len(row["all_ids"])):
            print(f"      DELETE id={row['all_ids'][idx]}  ({row['exams'][idx]}, {row['years'][idx]})")
        print()

    if not args.confirm:
        print("=" * 65)
        print(f"DRY RUN done. No rows deleted.")
        print(f"Run with --confirm to permanently delete {total_to_delete} rows.")
        print("=" * 65)
        conn.close()
        return

    # -- Step 3: Delete --
    print(f"[3/3] Deleting {total_to_delete} duplicate rows ...")
    cur.execute("""
        DELETE FROM pyq_questions
        WHERE id IN (
            SELECT id FROM (
                SELECT id,
                    ROW_NUMBER() OVER (
                        PARTITION BY TRIM(question)
                        ORDER BY id ASC          -- keep lowest id
                    ) AS rn
                FROM pyq_questions
            ) ranked
            WHERE rn > 1
        )
    """)
    deleted = cur.rowcount
    conn.commit()

    print(f"\nDeleted {deleted} rows.")

    # Verify
    cur.execute("SELECT COUNT(*) FROM pyq_questions")
    remaining = cur.fetchone()[0]
    print(f"Remaining rows: {remaining}")

    remaining_dups = find_duplicates(cur)
    if remaining_dups:
        print(f"WARNING: {len(remaining_dups)} duplicate groups still exist.")
    else:
        print("Table is clean - no duplicates remain.")

    print("=" * 65)
    conn.close()


if __name__ == "__main__":
    main()
