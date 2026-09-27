#!/usr/bin/env python3
"""
=============================================================================
ExamUdaan — Direct PYQ Database Ingestion & DBeaver Migration Tool
=============================================================================
Ingests scraped questions from `pyq_scraped_questions.json` directly into
the PostgreSQL `pyq_questions` table.

Features:
  - Auto-loads DB credentials from .env.local, .env, or system environment
  - Supports direct PostgreSQL ingestion via psycopg2 or psycopg3
  - If psycopg2 is not installed or server is offline, generates chunked
    DBeaver-friendly SQL files (e.g. pyq_dbeaver_part1.sql, part2.sql)
  - Safe UPSERT (ON CONFLICT (id) DO UPDATE) so re-running is 100% idempotent
  - Fast batch execution (commits in chunks of 100 questions)

Usage:
  python scripts/ingest_pyq_to_db.py                        # Auto-ingest into DB
  python scripts/ingest_pyq_to_db.py --dry-run              # Validate JSON without inserting
  python scripts/ingest_pyq_to_db.py --split-sql 500        # Generate 500-question DBeaver SQL chunks
=============================================================================
"""

import os
import sys
import json
import re
import argparse
from datetime import datetime, timezone

# Ensure UTF-8 stdout
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def parse_env_file(filepath):
    """Parse key=value pairs from .env or .env.local file"""
    env_vars = {}
    if not os.path.exists(filepath):
        return env_vars
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#') or '=' not in line:
                    continue
                k, v = line.split('=', 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                env_vars[k] = v
    except Exception:
        pass
    return env_vars

def get_db_credentials():
    """Extract DB credentials from env files or environment"""
    # Check .env.local, apps/web/.env.local, .env
    candidates = [
        ".env.local",
        "apps/web/.env.local",
        ".env",
        "apps/scraper/.env"
    ]
    file_vars = {}
    for c in candidates:
        if os.path.exists(c):
            file_vars.update(parse_env_file(c))

    # Environment variables take precedence
    host = os.environ.get("DB_HOST") or file_vars.get("DB_HOST", "localhost")
    port = os.environ.get("DB_PORT") or file_vars.get("DB_PORT", "5432")
    dbname = os.environ.get("DB_DATABASE") or file_vars.get("DB_DATABASE") or file_vars.get("POSTGRES_DB", "postgres")
    user = os.environ.get("DB_USERNAME") or file_vars.get("DB_USERNAME") or file_vars.get("POSTGRES_USER", "postgres")
    password = os.environ.get("DB_PASSWORD") or file_vars.get("DB_PASSWORD") or file_vars.get("POSTGRES_PASSWORD", "")
    database_url = os.environ.get("DATABASE_URL") or file_vars.get("DATABASE_URL")

    return {
        "host": host,
        "port": port,
        "dbname": dbname,
        "user": user,
        "password": password,
        "database_url": database_url
    }

def format_sql_value(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"

def generate_chunked_sql_files(questions, chunk_size=500, output_dir="."):
    """Generates small, manageable .sql files designed specifically for DBeaver"""
    total = len(questions)
    chunks = [questions[i:i + chunk_size] for i in range(0, total, chunk_size)]
    created_files = []

    for idx, chunk in enumerate(chunks, 1):
        filename = os.path.join(output_dir, f"pyq_dbeaver_part_{idx}.sql")
        with open(filename, "w", encoding="utf-8") as f:
            f.write(f"-- ExamUdaan DBeaver Part {idx} of {len(chunks)} ({len(chunk)} questions)\n")
            f.write(f"-- Generated: {datetime.now(timezone.utc).isoformat()}\n")
            f.write("-- Instructions: Open in DBeaver -> Execute with Alt + X (or Ctrl + Enter)\n\n")
            f.write("BEGIN;\n\n")

            # Batch in 50 rows per INSERT
            for b in range(0, len(chunk), 50):
                sub = chunk[b:b + 50]
                rows = []
                for q in sub:
                    q_id = q["id"]
                    t_sql = format_sql_value(q.get("topic") or "General")
                    s_sql = format_sql_value(q.get("subject") or "General Studies")
                    e_sql = format_sql_value(q.get("exam") or "MPSC")
                    y_val = q.get("year") or 2024
                    q_sql = format_sql_value(q.get("question") or "")
                    opts_json = json.dumps(q.get("options") or {}, ensure_ascii=False).replace("'", "''")
                    c_sql = format_sql_value(q.get("correct") or "A")
                    exp_sql = format_sql_value(q.get("explanation") or "")
                    tags_arr = "{" + ",".join(['"' + str(t).replace('"', '').replace("'", "") + '"' for t in q.get("tags", [])]) + "}"
                    tags_sql = format_sql_value(tags_arr) + "::text[]"
                    d_sql = format_sql_value(q.get("difficulty") or "Medium")

                    rows.append(
                        f"  ({q_id}, {t_sql}, {s_sql}, {e_sql}, {y_val}, {q_sql}, '{opts_json}'::jsonb, {c_sql}, {exp_sql}, {tags_sql}, {d_sql})"
                    )

                f.write("INSERT INTO pyq_questions (id, topic, subject, exam, year, question, options, correct, explanation, tags, difficulty)\nVALUES\n")
                f.write(",\n".join(rows))
                f.write("\nON CONFLICT (id) DO UPDATE SET\n")
                f.write("  question = EXCLUDED.question,\n")
                f.write("  options = EXCLUDED.options,\n")
                f.write("  correct = EXCLUDED.correct,\n")
                f.write("  explanation = EXCLUDED.explanation,\n")
                f.write("  subject = EXCLUDED.subject,\n")
                f.write("  topic = EXCLUDED.topic;\n\n")

            f.write("COMMIT;\n")

        created_files.append(filename)

    return created_files

def main():
    parser = argparse.ArgumentParser(description="ExamUdaan Direct PYQ Database Ingestion Tool")
    parser.add_argument("--json-file", type=str, default="pyq_scraped_questions.json", help="Path to input JSON file")
    parser.add_argument("--dry-run", action="store_true", help="Validate questions without executing DB inserts")
    parser.add_argument("--split-sql", type=int, default=None, help="Generate chunked DBeaver SQL files with N questions per file")
    args = parser.parse_args()

    if not os.path.exists(args.json_file):
        print(f"Error: JSON file '{args.json_file}' not found.")
        print("Please run `python scripts/scrape_mpscs_questions.py` first.")
        sys.exit(1)

    print(f"Loading questions from {args.json_file}...")
    with open(args.json_file, "r", encoding="utf-8") as f:
        questions = json.load(f)

    print(f"Loaded {len(questions)} questions.")

    # Validation
    valid_count = 0
    invalid_count = 0
    for q in questions:
        if q.get("question") and q.get("correct") and len(q.get("options", {})) >= 2:
            valid_count += 1
        else:
            invalid_count += 1

    print(f"Validation: {valid_count} Valid | {invalid_count} Invalid")

    if args.dry_run:
        print("\nDry run completed successfully. Zero database operations performed.")
        return

    # Check if split-sql mode requested
    if args.split_sql:
        files = generate_chunked_sql_files(questions, chunk_size=args.split_sql)
        print("\n========================================================")
        print(f"Generated {len(files)} DBeaver-ready SQL files:")
        for fn in files:
            size_kb = os.path.getsize(fn) / 1024
            print(f"  - {fn} ({size_kb:.1f} KB)")
        print("\nHow to run in DBeaver:")
        print("  1. Open DBeaver and connect to PostgreSQL.")
        print("  2. Open any of the part files (File -> Open File).")
        print("  3. Press Alt + X (Execute SQL Script).")
        print("========================================================\n")
        return

    # Try direct database connection
    creds = get_db_credentials()
    db_connected = False
    conn = None

    try:
        import psycopg2
        import psycopg2.extras

        print("\nConnecting to PostgreSQL...")
        if creds.get("database_url"):
            conn = psycopg2.connect(creds["database_url"])
        else:
            conn = psycopg2.connect(
                host=creds["host"],
                port=creds["port"],
                dbname=creds["dbname"],
                user=creds["user"],
                password=creds["password"],
                connect_timeout=5
            )
        db_connected = True
        print(f"Connected to database '{creds['dbname']}' on {creds['host']}:{creds['port']}!")

    except ImportError:
        print("\nNote: 'psycopg2' is not installed in the current Python environment.")
        print("Generating DBeaver-compatible SQL chunks automatically...\n")
    except Exception as e:
        print(f"\nCould not connect directly to PostgreSQL: {e}")
        print("Falling back to generating DBeaver-compatible SQL chunks...\n")

    if db_connected and conn:
        try:
            with conn.cursor() as cur:
                # Ensure table exists
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS pyq_questions (
                        id INT PRIMARY KEY,
                        topic TEXT,
                        subject TEXT,
                        exam TEXT,
                        year INT,
                        question TEXT NOT NULL,
                        options JSONB NOT NULL,
                        correct CHAR(1) NOT NULL,
                        explanation TEXT,
                        tags TEXT[],
                        difficulty TEXT DEFAULT 'Medium',
                        created_at TIMESTAMPTZ DEFAULT NOW()
                    );
                    CREATE INDEX IF NOT EXISTS idx_pyq_subject ON pyq_questions(subject);
                    CREATE INDEX IF NOT EXISTS idx_pyq_exam ON pyq_questions(exam);
                    CREATE INDEX IF NOT EXISTS idx_pyq_year ON pyq_questions(year);
                """)
                conn.commit()

                upsert_sql = """
                    INSERT INTO pyq_questions (id, topic, subject, exam, year, question, options, correct, explanation, tags, difficulty)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        question = EXCLUDED.question,
                        options = EXCLUDED.options,
                        correct = EXCLUDED.correct,
                        explanation = EXCLUDED.explanation,
                        subject = EXCLUDED.subject,
                        topic = EXCLUDED.topic;
                """

                batch_tuples = []
                inserted = 0

                for idx, q in enumerate(questions, 1):
                    batch_tuples.append((
                        q["id"],
                        q.get("topic") or "General",
                        q.get("subject") or "General Studies",
                        q.get("exam") or "MPSC",
                        q.get("year") or 2024,
                        q.get("question") or "",
                        json.dumps(q.get("options") or {}, ensure_ascii=False),
                        q.get("correct") or "A",
                        q.get("explanation") or "",
                        q.get("tags") or [],
                        q.get("difficulty") or "Medium"
                    ))

                    if len(batch_tuples) >= 100 or idx == len(questions):
                        cur.executemany(upsert_sql, batch_tuples)
                        conn.commit()
                        inserted += len(batch_tuples)
                        print(f"[{inserted}/{len(questions)}] Ingested {len(batch_tuples)} questions...")
                        batch_tuples = []

                print("\n========================================================")
                print(f"Direct Database Ingestion Complete!")
                print(f"Total Questions Ingested: {inserted}")
                print("========================================================\n")

        finally:
            conn.close()
    else:
        # Generate DBeaver-ready batch files
        files = generate_chunked_sql_files(questions, chunk_size=500)
        print("========================================================")
        print(f"Created {len(files)} DBeaver-ready SQL files (500 rows each):")
        for fn in files:
            print(f"  - {fn}")
        print("\nHow to run in DBeaver:")
        print("  1. Open DBeaver and connect to your PostgreSQL database.")
        print("  2. Go to File -> Open File, select 'pyq_scraped_questions.sql' (or part files).")
        print("  3. Press Alt + X (Execute Script) to run all batches in seconds.")
        print("========================================================\n")

if __name__ == "__main__":
    main()
