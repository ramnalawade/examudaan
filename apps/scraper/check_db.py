"""
check_db.py — Quick diagnostic: check what data BMC jobs have
Run: python check_db.py
"""
import os, json, sys
import psycopg2

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

# Load from .env file directly
env = {}
with open('.env', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, _, v = line.partition('=')
            env[k.strip()] = v.strip()

conn = psycopg2.connect(
    host=env['DB_HOST'],
    port=int(env.get('DB_PORT', 5432)),
    dbname=env['DB_DATABASE'],
    user=env['DB_USERNAME'],
    password=env['DB_PASSWORD'],
)
cur = conn.cursor()

# Check BMC jobs
cur.execute("""
    SELECT en.id, en.title, en.slug,
           CASE WHEN en.description IS NOT NULL THEN length(en.description) ELSE 0 END as desc_len,
           en.ai_extracted_data,
           en.application_links,
           en.total_vacancies,
           o.website, o.address, o.phone
    FROM exam_notifications en
    JOIN organizations o ON o.id = en.organization_id
    WHERE o.acronym = 'BMC'
    ORDER BY en.id DESC
    LIMIT 3
""")
rows = cur.fetchall()
print(f"\n{'='*60}")
print(f"BMC Jobs in DB ({len(rows)} rows):")
print(f"{'='*60}")
for r in rows:
    print(f"\nID: {r[0]}")
    print(f"Title: {r[1][:100] if r[1] else 'NULL'}")
    print(f"Slug: {r[2]}")
    print(f"Description length: {r[3]} chars")
    print(f"ai_extracted_data: {json.dumps(r[4], ensure_ascii=False)[:500] if r[4] else 'NULL'}")
    print(f"application_links: {json.dumps(r[5], ensure_ascii=False)[:300] if r[5] else 'NULL'}")
    print(f"total_vacancies: {r[6]}")
    print(f"org_website: {r[7]}")
    print(f"org_address: {r[8]}")
    print(f"org_phone: {r[9]}")

# Summary
cur.execute("SELECT COUNT(*) FROM exam_notifications WHERE ai_extracted_data IS NOT NULL")
ai_count = cur.fetchone()[0]
cur.execute("SELECT COUNT(*) FROM exam_notifications")
total = cur.fetchone()[0]
print(f"\n{'='*60}")
print(f"Total notifications in DB: {total}")
print(f"With ai_extracted_data set: {ai_count}")
print(f"Without ai_extracted_data : {total - ai_count}")

# Show a sample WITH ai_extracted_data that is rich
cur.execute("""
    SELECT en.id, en.title, en.ai_extracted_data, en.application_links, en.description
    FROM exam_notifications en
    WHERE en.ai_extracted_data IS NOT NULL
      AND en.ai_extracted_data != '{}'::jsonb
    ORDER BY en.id DESC
    LIMIT 1
""")
sample = cur.fetchone()
if sample:
    print(f"\n{'='*60}")
    print(f"Best sample row WITH ai_extracted_data:")
    print(f"ID: {sample[0]} | Title: {sample[1][:80] if sample[1] else 'NULL'}")
    print(f"ai_extracted_data:\n{json.dumps(sample[2], indent=2, ensure_ascii=False)[:1000]}")
    print(f"application_links:\n{json.dumps(sample[3], indent=2, ensure_ascii=False) if sample[3] else 'NULL'}")
    print(f"description (first 200): {str(sample[4])[:200] if sample[4] else 'NULL'}")

# Check posts table for vacancies
cur.execute("""
    SELECT p.post_name, p.total_vacancies, p.qualification, p.pay_scale, p.job_type
    FROM posts p
    JOIN exam_notifications en ON en.id = p.notification_id
    JOIN organizations o ON o.id = en.organization_id
    WHERE o.acronym = 'BMC'
    LIMIT 5
""")
posts = cur.fetchall()
print(f"\n{'='*60}")
print(f"Posts (vacancy rows) for BMC: {len(posts)}")
for p in posts:
    print(f"  post: {p[0]} | vac: {p[1]} | qual: {p[2]} | pay: {p[3]} | type: {p[4]}")

cur.close()
conn.close()
