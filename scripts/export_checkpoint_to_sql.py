#!/usr/bin/env python3
"""
Exports current contents of scrape_checkpoint.json into pyq_scraped_questions.sql
and pyq_scraped_questions.json at any time without interrupting the scraper.
"""
import os
import sys
import json
from datetime import datetime, timezone

def format_sql_value(val):
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"

def main():
    checkpoint_file = "scrape_checkpoint.json"
    if not os.path.exists(checkpoint_file):
        print("No checkpoint file found.")
        sys.exit(1)

    with open(checkpoint_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions = list(data.values())
    print(f"Loaded {len(questions)} questions from checkpoint.")

    with open("pyq_scraped_questions.json", "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    with open("pyq_scraped_questions.sql", "w", encoding="utf-8") as sql_file:
        sql_file.write("-- =============================================================================\n")
        sql_file.write(f"-- ExamUdaan MPSC Questions Ingestion (Checkpoint Snapshot) — {datetime.now(timezone.utc).isoformat()}\n")
        sql_file.write(f"-- Total Questions: {len(questions)}\n")
        sql_file.write("-- Compatible with: DBeaver (Alt + X), pgAdmin, and psql\n")
        sql_file.write("-- =============================================================================\n\n")
        sql_file.write("BEGIN;\n\n")

        for i in range(0, len(questions), 50):
            batch = questions[i:i + 50]
            rows = []
            for q in batch:
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

            sql_file.write("INSERT INTO pyq_questions (id, topic, subject, exam, year, question, options, correct, explanation, tags, difficulty)\nVALUES\n")
            sql_file.write(",\n".join(rows))
            sql_file.write("\nON CONFLICT (id) DO UPDATE SET\n")
            sql_file.write("  question = EXCLUDED.question,\n")
            sql_file.write("  options = EXCLUDED.options,\n")
            sql_file.write("  correct = EXCLUDED.correct,\n")
            sql_file.write("  explanation = EXCLUDED.explanation,\n")
            sql_file.write("  subject = EXCLUDED.subject,\n")
            sql_file.write("  topic = EXCLUDED.topic;\n\n")

        sql_file.write("COMMIT;\n")

    print(f"Exported {len(questions)} questions to pyq_scraped_questions.sql and pyq_scraped_questions.json.")

if __name__ == "__main__":
    main()
