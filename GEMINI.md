# ExamUdaan — Project Rules for AI Agent
# Loaded automatically in every conversation for this workspace.
# Last updated: 2026-09-06 (Session 15)

## Project Identity
- **Name**: ExamUdaan.in — India's government exam aggregator portal
- **Model**: Free content + paid WhatsApp/Email/SMS alerts (₹29/49/99/month)
- **Stack**: Next.js 14 (App Router) + Python Scrapy + PostgreSQL (via pgdb.js, NOT Supabase client SDK)

## Critical Coding Rules

### General
- Code must be SIMPLE — well commented, easy to understand
- No Tailwind — use vanilla CSS and CSS Modules only
- Never use `#` as a URL fallback — use `null` and conditionally render links
- All external links must have target="_blank" rel="noopener noreferrer"

### Frontend (Next.js)
- App Router only — no Pages Router patterns
- DB access via `lib/pgdb.js` — exports `query(sql, params)` and `queryOne(sql, params)`
- API routes use `lib/apiResponse.js` helpers: `ok()`, `serverError()`, `unauthorized()`
- API validation via `lib/validate.js` → `withValidation(schema, handler)`
- `notification_pdf` field must link to REAL external gov URL — never local
- `notification_pdf` fallback chain: `en.notification_pdf || en.application_links?.notification_pdf || en.source_url || null`
- `ai_extracted_data` access pattern: `const ai = en.ai_extracted_data || {}` then `ai.education_levels || []` etc.
- Detail pages must surface ALL ai_extracted_data fields — education levels, selection methods, govt level, job categories

### Routing — notification_type → URL section
| DB notification_type | URL section   | Detail page path          |
|----------------------|---------------|---------------------------|
| recruitment          | /jobs         | /jobs/[slug]              |
| result               | /results      | /results/[slug]           |
| admit_card           | /admit-cards  | /admit-cards/[slug]       |
| answer_key           | /answer-keys  | /answer-keys/[slug]       |
| syllabus             | /schemes      | /schemes/[slug]           |

### API — type param → DB notification_type mapping
| URL ?type=   | DB notification_type |
|--------------|----------------------|
| job          | recruitment          |
| result       | result               |
| admit-card   | admit_card           |
| answer-key   | answer_key           |
| syllabus     | syllabus             |

### DB Slug → Detail URL
- Slugs use ID suffix pattern: {org_acronym_lower}-{id} e.g. ssc-514
- To resolve: extract trailing \d+ from slug, query by en.id, fallback to en.slug

### Scraper (Python/Scrapy)
- DB driver: psycopg2-binary via apps/scraper/db.py
- Connection: individual fields DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- Main upsert: db.upsert_notification(conn, org_id, source_id, data_dict)
- Dedup: db.get_known_urls(org_acronym) returns set of known URLs
- Raw archive: db.save_raw_scraped() — table is range-partitioned by scraped_at (monthly)
  → MUST CREATE monthly partition before inserts if missing
- Classify: classify_exam_notifications.py uses Gemini API in batches to enrich rows

### DB — Key Tables
| Table                | Purpose                                      |
|----------------------|----------------------------------------------|
| exam_notifications   | Main content table — all notification types  |
| organizations        | Org lookup (unique by acronym)               |
| scrape_sources       | Source registry                              |
| raw_scraped_data     | Archive, partitioned monthly by scraped_at   |
| posts                | Vacancy breakdown per notification           |

### exam_notifications — Key JSONB fields
- application_links: { apply_online, official_website, result_link, admit_card_link, answer_key_link, notification_pdf }
- application_fee: { general, open, sc_st, reserved, women, note }
- age_limit: { min, max, max_open, max_reserved, obc_relax, sc_st_relax }
- qualifications: { mandatory: [], desirable: [] }
- salary: { amount, period, breakdown: { base, hra_percentage } }
- seo_metadata: { meta_title, meta_description }
- ai_extracted_data (Gemini classification — always access as `const ai = en.ai_extracted_data || {}`):
  - education_levels: [] — e.g. ["Graduate", "Postgraduate"]
  - education_streams: [] — e.g. ["Engineering", "Computer/IT"]
  - education_qualifications: [] — specific quals mentioned
  - job_categories: [] — e.g. ["Police/Law Enforcement", "Engineering/Technical"]
  - career_streams: [] — e.g. ["Research", "Administrative"]
  - selection_methods: [] — e.g. ["Written Exam", "Interview", "Document Verification"]
  - recruitment_types: [] — e.g. ["Regular", "Walk-in", "Contractual"]
  - employment_type_normalized: string — e.g. "Full-time"
  - government_level: string — Central | State | Local | PSU | Autonomous
  - state_normalized: string — e.g. "Maharashtra"
  - cities_normalized: [] — exam/posting cities
  - experience_min_years: int | null
  - experience_max_years: int | null
  - is_mpsc, is_upsc, is_ssc, is_railway, is_banking, is_police, is_teaching, is_medical, is_research: bool
  - is_govt, is_central_govt, is_state_govt, is_psu: bool
  - confidence: float 0-1

## Design System (LOCKED)
- Background: warm ivory #FFFBF5
- Primary: deep saffron #EA580C
- Fonts: Outfit (headings) + Inter (body)
- CSS vars: --primary, --on-surface, --secondary, --surface-container-lowest, --outline-variant
- Common classes: container, btn-primary, btn-outline, info-pill, job-card, breadcrumb

## File Structure Quick Reference
```
apps/web/src/
  app/
    page.js                     <- redesigned homepage with AiMatcher + live feeds
    feedback/page.js            <- aspirant feedback & exam portal suggestions desk
    about/page.js, terms/page.js, privacy/page.js, contact/page.js, disclaimer/page.js, faq/page.js
    jobs/[slug]/page.js         <- recruitment detail
    results/[slug]/page.js      <- result detail
    admit-cards/[slug]/page.js  <- admit card detail
    answer-keys/[slug]/page.js  <- answer key detail
    api/feedback/route.js       <- handles suggestions, exam inclusion requests & bug reports
    api/notifications/route.js  <- main listing API — supports all filters
  components/
    AiMatcher.js                <- interactive AI eligibility matcher (live counter, age slider, relaxations)
    JobCard.js                  <- universal card (routes by notification_type)
    ListingPage.js              <- shared listing page with sidebar filters
    Footer.js                   <- complete directory footer with non-affiliation disclaimer
```

## How to Resume Work
1. This file (GEMINI.md) is auto-loaded — routing rules, DB rules, design rules already in context
2. Read `.agents/skills/examudaan-codebase/SKILL.md` — full architecture, all files, all code patterns
3. Read `CONTINUATION.md` — current status, pending tasks, last session log
4. DO NOT scan directories or read source files until you know what task you are doing
5. When done: update CONTINUATION.md with what was done + what is next
