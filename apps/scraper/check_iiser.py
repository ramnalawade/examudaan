"""
check_iiser_detail.py — Get the exact data for IISER job 4552 and check what fields are available
"""
import sys, json
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

env = {}
with open('.env', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, _, v = line.partition('=')
            env[k.strip()] = v.strip()

conn = psycopg2.connect(
    host=env['DB_HOST'], port=int(env.get('DB_PORT', 5432)),
    dbname=env['DB_DATABASE'], user=env['DB_USERNAME'], password=env['DB_PASSWORD'],
)
cur = conn.cursor()

# All details for ID 4552 (the bfd82e4b PDF job)
cur.execute("SELECT * FROM exam_notifications WHERE id = 4552")
cols = [d[0] for d in cur.description]
row = cur.fetchone()
if row:
    data = dict(zip(cols, row))
    print("=== FULL ROW FOR ID 4552 ===")
    for k, v in data.items():
        if v is not None and v != '' and v != {} and v != []:
            if isinstance(v, dict):
                print(f"  {k}: {json.dumps(v, ensure_ascii=False)[:300]}")
            else:
                print(f"  {k}: {str(v)[:300]}")

# Also check the other bfd PDF job (using detail_page=2301)
print("\n=== CHECKING ALL IISER JOBS WITHOUT ANY DATE ===")
cur.execute("""
    SELECT id, title, apply_start_date, apply_end_date, exam_date, is_walk_in, 
           employment_type, description, application_links
    FROM exam_notifications en
    JOIN organizations o ON o.id = en.organization_id
    WHERE o.acronym ILIKE 'IISER%'
    AND apply_start_date IS NULL AND apply_end_date IS NULL AND exam_date IS NULL
    ORDER BY id DESC
    LIMIT 10
""")
rows = cur.fetchall()
for r in rows:
    print(f"\n  ID={r[0]}")
    print(f"  Title: {str(r[1])[:80]}")
    print(f"  is_walk_in: {r[5]}, employment_type: {r[6]}")
    print(f"  description: {str(r[7])[:200] if r[7] else 'NULL'}")
    links = r[8] or {}
    print(f"  detail_page: {links.get('detail_page', 'N/A')}")
    print(f"  all_pdfs: {links.get('all_pdfs', [])[:1]}")

# Check if description has any date-like info
print("\n=== IISER JOBS WITH SOMETHING IN DESCRIPTION ===")
cur.execute("""
    SELECT id, title, LEFT(description, 400) as desc_snippet
    FROM exam_notifications en
    JOIN organizations o ON o.id = en.organization_id
    WHERE o.acronym ILIKE 'IISER%'
    AND description IS NOT NULL
    AND description != ''
    ORDER BY id DESC
    LIMIT 5
""")
for r in cur.fetchall():
    print(f"\n  ID={r[0]}: {str(r[1])[:60]}")
    print(f"  Desc: {r[2]}")

cur.close()
conn.close()
