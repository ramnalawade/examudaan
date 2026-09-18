import os, sys
sys.path.insert(0, '.')
from dotenv import load_dotenv
load_dotenv()
import psycopg2

conn = psycopg2.connect(
    host=os.environ['DB_HOST'],
    port=int(os.environ['DB_PORT']),
    dbname=os.environ['DB_DATABASE'],
    user=os.environ['DB_USERNAME'],
    password=os.environ['DB_PASSWORD']
)
conn.autocommit = True
cur = conn.cursor()

stmts = [
    "ALTER TABLE exam_notifications ADD COLUMN IF NOT EXISTS employment_type TEXT",
    "ALTER TABLE exam_notifications ADD COLUMN IF NOT EXISTS duration TEXT",
    "ALTER TABLE exam_notifications ADD COLUMN IF NOT EXISTS salary JSONB DEFAULT '{}'",
    "ALTER TABLE exam_notifications ADD COLUMN IF NOT EXISTS qualifications JSONB DEFAULT '{}'",
    "ALTER TABLE exam_notifications ADD COLUMN IF NOT EXISTS application_email TEXT",
    "ALTER TABLE exam_notifications ADD COLUMN IF NOT EXISTS advertisement_details JSONB DEFAULT '{}'",
    "ALTER TABLE exam_notifications ADD COLUMN IF NOT EXISTS application_details JSONB DEFAULT '{}'",
    "ALTER TABLE organizations ADD COLUMN IF NOT EXISTS department TEXT",
    "ALTER TABLE organizations ADD COLUMN IF NOT EXISTS parent_org TEXT",
    "ALTER TABLE organizations ADD COLUMN IF NOT EXISTS address TEXT",
    "ALTER TABLE organizations ADD COLUMN IF NOT EXISTS phone TEXT",
]

for stmt in stmts:
    try:
        cur.execute(stmt)
        print('OK:', stmt[:90])
    except Exception as e:
        print('ERR:', e)

# Verify
cur.execute("""SELECT column_name FROM information_schema.columns 
    WHERE table_name='exam_notifications' 
    AND column_name IN ('employment_type','duration','salary','qualifications','application_email','advertisement_details','application_details') 
    ORDER BY column_name""")
print('exam_notifications new cols:', [r[0] for r in cur.fetchall()])

cur.execute("""SELECT column_name FROM information_schema.columns 
    WHERE table_name='organizations' 
    AND column_name IN ('department','parent_org','address','phone') 
    ORDER BY column_name""")
print('organizations new cols:', [r[0] for r in cur.fetchall()])

conn.close()
print('Migration done.')
