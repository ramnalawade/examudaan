---
name: examudaan-codebase
description: >-
  Full architecture reference for the ExamUdaan.in codebase.
  Covers DB schema, scraper pipeline, frontend pages, API routes,
  notification type routing, JSONB field structure, and all 37 spiders.
  Activate when working on any ExamUdaan feature to avoid re-reading files.
  Last synced: 2026-09-05 (Session 10).
---

# ExamUdaan Codebase Architecture

> READ THIS at the start of every session instead of scanning files.
> If something seems stale, verify with list_dir/view_file then update this file.

---

## Stack (LOCKED)

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Frontend   | Next.js 14 App Router — NO Pages Router                 |
| Styling    | Vanilla CSS + CSS Modules — NO Tailwind                 |
| Database   | PostgreSQL via lib/pgdb.js (NOT Supabase client SDK)    |
| Scraper    | Python + Scrapy + BeautifulSoup4 + psycopg2-binary      |
| AI/Classify| Gemini API (key rotation, batch=10)                     |
| Auth       | Custom JWT (lib/auth.js) + OTP via Resend/MSG91/AiSensy |
| Payments   | Razorpay                                                |
| Search     | Typesense                                               |
| Deploy     | Vercel (web) + cron_6h.sh (scraper on server/Railway)   |

---

## Data Flow (End to End)

```
Government Website
      |
  Scrapy Spider (apps/scraper/spiders/*.py)
      |
  Scrapy Pipelines (pipelines.py)
      |-- DeduplicationPipeline  -> skip URL if already in DB
      |-- RawArchivePipeline     -> save to raw_scraped_data (monthly partition)
      |-- NotificationPipeline   -> upsert into exam_notifications
      |
  classify_exam_notifications.py
      |-- reads rows WHERE ai_extracted_data IS NULL
      |-- Gemini API in batches of 10
      |-- writes back: notification_type, vacancies, salary, age, qualifications
      |
  Next.js Frontend (apps/web/)
      |-- /api/posts?type=&board= -> filtered query on exam_notifications
      |-- Detail pages fetch by slug (id-suffix pattern: ssc-514)
```

---

## Directory Map

```
examudaan/
  apps/
    web/                        <- Next.js 14
      src/
        app/                    <- App Router pages
        components/             <- Shared UI components
        lib/                    <- DB, auth, API helpers
        styles/                 <- globals.css (design system, ~970 lines)
    scraper/                    <- Python Scrapy
      spiders/                  <- 37 spiders
      db.py                     <- psycopg2 helper
      pipelines.py              <- Scrapy pipelines
      classify_exam_notifications.py
      run_scraper.py            <- entry point
      items.py                  <- Scrapy Item definitions
      settings.py               <- Scrapy settings
      migrations/               <- scraper-side SQL patches
  .agents/skills/               <- All agent memory/skill files
  .github/workflows/            <- CI/CD (scraper cron)
  GEMINI.md                     <- Project rules (auto-loaded every session)
  CONTINUATION.md               <- Latest session handoff — read after GEMINI.md
  MEMORY.md                     <- Persistent project memory
```

---

## Database Schema

### Primary Table: exam_notifications

Core columns:
- id: BIGSERIAL PRIMARY KEY
- organization_id: UUID -> organizations.id
- source_id: UUID -> scrape_sources.id
- title: TEXT NOT NULL
- slug: TEXT — pattern: {org_acronym_lower}-{id} e.g. ssc-514
- notification_type: TEXT — recruitment|result|admit_card|answer_key|syllabus|other
- status: TEXT — published|draft|closed|archived
- advt_no, description: TEXT
- apply_start_date, apply_end_date, exam_date: DATE
- published_at: TIMESTAMPTZ
- source_url: TEXT — original scraped URL
- notification_pdf: TEXT — external gov PDF — NEVER local path
- total_vacancies, salary_min, salary_max: INTEGER (INR/month)
- max_age_limit, min_experience_years: INTEGER
- is_walk_in: BOOLEAN
- employment_type: TEXT

JSONB columns:
  application_links: { apply_online, official_website, result_link, admit_card_link, answer_key_link, notification_pdf }
  application_fee: { general, open, sc_st, reserved, women, note }
  age_limit: { min, max, max_open, max_reserved, obc_relax, sc_st_relax }
  qualifications: { mandatory: [], desirable: [] }
  salary: { amount, period, breakdown: { base, hra_percentage } }
  seo_metadata: { meta_title, meta_description }
  ai_extracted_data: { category, keywords, difficulty_level, ... } <- flexible Gemini output
  exam_cities: TEXT[] array (not JSONB)

### Supporting Tables

organizations:
  id UUID PK, name TEXT, acronym TEXT UNIQUE (always UPPERCASE), website TEXT
  department TEXT, parent_org TEXT, address TEXT, phone TEXT

scrape_sources:
  id UUID PK, name TEXT, base_url TEXT, is_official BOOLEAN

raw_scraped_data (PARTITIONED monthly by scraped_at):
  id UUID, source_id UUID, url TEXT, parsed_data JSONB, dedup_hash TEXT, scraped_at TIMESTAMPTZ
  !! MUST CREATE monthly partition before first insert:
     CREATE TABLE IF NOT EXISTS raw_scraped_data_2026_09
       PARTITION OF raw_scraped_data
       FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');

posts (vacancy breakdown per notification):
  id UUID, notification_id BIGINT -> exam_notifications.id
  post_name TEXT, total_vacancies INTEGER, qualification TEXT
  pay_scale TEXT, category TEXT, job_type TEXT, syllabus_url TEXT

---

## Routing Rules

notification_type -> URL section -> detail page:
  recruitment  -> /jobs         -> /jobs/[slug]
  result       -> /results      -> /results/[slug]
  admit_card   -> /admit-cards  -> /admit-cards/[slug]
  answer_key   -> /answer-keys  -> /answer-keys/[slug]
  syllabus     -> /schemes      -> /schemes/[slug]

API ?type= param -> DB notification_type:
  job        -> recruitment
  result     -> result
  admit-card -> admit_card
  answer-key -> answer_key
  syllabus   -> syllabus

Slug resolution:
  Extract trailing \d+ from slug -> query by en.id first
  Fallback: query by full en.slug column

---

## Frontend File Map

Pages (apps/web/src/app/):
  page.js                    - Homepage: hero, search, categories, filters, alerts CTA
  layout.js                  - Root layout: Google Fonts, Navbar, Footer, MobileBottomNav
  error.js                   - Error boundary
  not-found.js               - 404 page
  jobs/page.js               - Jobs listing: filters, sort, pagination, sidebar
  jobs/[slug]/page.js        - Job detail: SSR, JSON-LD, share, apply sidebar, YouTube
  results/page.js            - Results: board filter, pagination
  admit-cards/page.js        - Admit cards: board filter, pagination
  answer-keys/page.js        - Answer keys: board + year filter
  schemes/page.js            - Syllabus/schemes listing
  alerts/page.js             - Alerts: multi-board, multi-type, channel selection
  calendar/page.js           - Monthly grid, color-coded event dots
  dashboard/page.js          - Plan banner, stats, alert management, settings
  login/page.js              - 2-step OTP (email/phone/WhatsApp), 6-digit entry
  pricing/page.js            - 3-tier plans Rs 29/49/99, Razorpay checkout, FAQ
  search/page.js             - Full-text search results
  ask/page.js                - AI exam assistant chat (Smart/Pro plan only)
  admin/page.js              - Admin: stats dashboard, scraper logs
  admin/scrapers/page.js     - Admin: spider management UI
  sitemap.js                 - Dynamic XML sitemap
  robots.js                  - SEO robots.txt

Components (apps/web/src/components/):
  Navbar.js           - Logo, nav links, search pill, CTA, hamburger menu
  Footer.js           - 4-column grid, social links, hidden on mobile
  FilterChips.js      - Horizontal scroll chips, active state, optional counts
  JobCard.js          - Universal card — routes by notification_type
  SkeletonCard.js     - Loading skeleton with shimmer animation
  TickerBar.js        - Live scrolling ticker from API
  MobileBottomNav.js  - 5-tab bottom nav (icon + label)
  ShareButtons.js     - Social share buttons for detail pages
  HindiToggle.js      - Language toggle (Hindi/English)
  SyllabusBreakdown.js- Syllabus/scheme detail breakdown

API Routes (apps/web/src/app/api/):
  GET  /api/posts              - List/filter by type, board, page, q
  GET  /api/stats              - Public stats (totals per type)
  GET  /api/alerts             - List user subscriptions
  POST /api/alerts             - Subscribe to alerts
  POST /api/auth/send-otp      - Send OTP via Email/SMS/WhatsApp
  POST /api/auth/verify-otp    - Verify OTP, return JWT tokens
  POST /api/auth/logout        - Revoke refresh token
  GET  /api/user/profile       - Authenticated user profile
  POST /api/payment/create-order - Create Razorpay order
  POST /api/payment/verify     - Verify payment, upgrade plan
  GET  /api/admin/stats        - Admin dashboard metrics
  GET  /api/admin/jobs         - Admin job listing
  GET  /api/admin/scrapers     - Admin scraper management
  POST /api/admin/scrapers     - Trigger scraper run
  GET  /api/notifications      - Notification listing (alt endpoint)
  GET  /api/search             - Search endpoint
  POST /api/ask                - AI exam assistant (Smart/Pro plans only)

Lib (apps/web/src/lib/):
  pgdb.js        - query(sql,params) + queryOne(sql,params) — graceful degradation, never throws
  auth.js        - JWT generation, verification, withAuth middleware
  validate.js    - Input validation + withValidation(schema, handler)
  apiResponse.js - ok(), serverError(), unauthorized() helpers
  formatDate.js  - Date formatting, daysLeft, getStatus utilities
  helpers.js     - maskEmail, maskPhone, formatNumber
  supabase.js    - Legacy Supabase client (prefer pgdb.js for all new code)

---

## Code Patterns

DB query:
  import { query, queryOne } from '@/lib/pgdb'
  // query() returns [] on no-DB/error — never throws
  const rows = await query('SELECT * FROM exam_notifications WHERE id = $1', [id])
  const row  = await queryOne('SELECT * FROM exam_notifications WHERE slug = $1', [slug])

API route pattern:
  import { withValidation } from '@/lib/validate'
  import { ok, serverError } from '@/lib/apiResponse'
  export const GET = withValidation(schema, async (req, validatedData) => {
    return ok({ posts: [], total: 0 })
  })

PDF link (NEVER use '#'):
  const pdfLink = en.notification_pdf
                || en.application_links?.notification_pdf
                || en.source_url
                || null
  {pdfLink && <a href={pdfLink} target="_blank" rel="noopener noreferrer">Official PDF</a>}

JobCard routing:
  const TYPE_ROUTE = {
    result: 'results', admit_card: 'admit-cards',
    answer_key: 'answer-keys', syllabus: 'schemes', recruitment: 'jobs',
  }
  // detailUrl = `/${TYPE_ROUTE[notification_type]}/${slug || id}`

Detail page CTA links:
  jobs/[slug]        - Apply Online       -> application_links.apply_online
  results/[slug]     - Check Result       -> application_links.result_link OR notification_pdf
  admit-cards/[slug] - Download Hall Ticket -> application_links.admit_card_link OR notification_pdf
  answer-keys/[slug] - Download Answer Key  -> application_links.answer_key_link OR notification_pdf

---

## Scraper File Map

Core files (apps/scraper/):
  db.py                          - psycopg2 DB helper
  pipelines.py                   - Dedup + RawArchive + Notification + Alert pipelines
  items.py                       - Scrapy Item field definitions
  settings.py                    - Scrapy config: pipelines, autothrottle, UA rotation, proxies
  middlewares.py                 - RandomUserAgentMiddleware + RandomHeadersMiddleware
  classify_exam_notifications.py - Gemini batch classifier for unclassified rows
  run_scraper.py                 - Entry point (all spiders or --spider NAME)
  fetch_proxies.py               - Fetches fresh proxy list from ProxyScrape
  cron_6h.sh                     - Cron shell script (runs every 6h on server)

DB helper functions (db.py):
  Env vars: DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
  db.get_or_create_org(conn, name, acronym, website)       -> UUID
  db.get_or_create_source(conn, name, base_url)            -> UUID
  db.get_known_urls(org_acronym)                           -> set of known URLs
  db.save_raw_scraped(conn, source_id, url, data)          -> bool
  db.upsert_notification(conn, org_id, source_id, data_dict) -> int (id)
  db.make_slug(text)                                       -> str
  db.make_content_hash(*fields)                            -> str (MD5)
  db.make_dedup_hash(source_id, url)                       -> str (SHA256)

All 37 Spiders (apps/scraper/spiders/):
  aggregator_spider.py         - 6 aggregator sites (sarkarijobfind, sarkariresult, etc.)
  multi_govt_spider.py         - Multi-site government portal scraper
  ssc_spider.py                - ssc.gov.in
  upsc_spider.py               - upsc.gov.in
  rrb_spider.py                - rrbcdg.gov.in (Railways)
  ibps_spider.py               - ibps.in (Banking)
  sbi_spider.py                - sbi.co.in/careers
  nta_spider.py                - nta.ac.in
  uppsc_spider.py              - uppsc.up.nic.in (UP PSC)
  bpsc_spider.py               - bpsc.bih.nic.in (Bihar PSC)
  mpsc_spider.py               - Maharashtra PSC
  bmc_spider.py                - BMC Mumbai
  pmc_spider.py                - Pune Municipal Corporation
  tmc_spider.py                - Thane Municipal Corporation
  mumbai_police_spider.py      - Mumbai Police
  mahapolice_spider.py         - Maharashtra Police
  thanepolice_spider.py        - Thane Police
  maharashtra_prisons_spider.py- Maharashtra Prisons Dept
  srpf_spider.py               - SRPF Maharashtra
  employment_news_spider.py    - Employment News scraper
  icar_circot_spider.py        - ICAR-CIRCOT
  icar_nbsslup_spider.py       - ICAR-NBSSLUP
  iiser_pune_spider.py         - IISER Pune
  ict_mumbai_spider.py         - ICT Mumbai
  actrec_spider.py             - ACTREC (cancer research)
  csirneeri_spider.py          - CSIR-NEERI
  iipsmumbai_spider.py         - IIPS Mumbai
  aimmsnagpur_spider.py        - AIIMS Nagpur
  mecl_spider.py               - MECL (Mineral Exploration)
  moil_spider.py               - MOIL Ltd
  konkan_railway_spider.py     - Konkan Railway
  pdkv_akola_spider.py         - PDKV Akola (Agriculture University)
  thane_scrapling.py           - Thane district misc
  youtube_spider.py            - YouTube exam video links (YouTube Data API v3)
  dedup_mixin.py               - Shared deduplication mixin (not a spider)
  test.py / rtest.py           - Test/scratch spiders

Scraper Migrations (apps/scraper/migrations/):
  002_enrich_schema.sql        - Adds filter columns to exam_notifications
  003_notification_type.sql    - notification_type column + routing enum
  run_migration.py             - Applies migration files against DB

---

## Design System (LOCKED)

CSS variables (in globals.css):
  --primary: #EA580C           (Deep saffron)
  --surface: #FFFBF5           (Warm ivory background)
  --on-surface: #1C1917        (Dark text)
  --secondary: #FB923C         (Lighter saffron)
  --surface-container-lowest: #FFFFFF
  --outline-variant: #E5E0D8

Fonts (loaded via Google Fonts in layout.js):
  Outfit - headings
  Inter  - body text

Common CSS classes: container, btn-primary, btn-outline, info-pill, job-card, breadcrumb

Responsive breakpoints:
  1024px - Tablet landscape: grid collapse, hero single col
  900px  - Alert/calendar sidebar collapse
  768px  - Mobile: bottom nav visible, footer hidden
  640px  - Small mobile: single column grids
  480px  - Very small: logo text hidden
  400px  - Tiny phone: compact cards

---

## Environment Variables

Web (apps/web/.env.local):
  DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
  NEXTAUTH_SECRET, NEXTAUTH_URL
  RESEND_API_KEY          (email OTP)
  MSG91_AUTH_KEY          (SMS OTP)
  AISENSY_API_KEY         (WhatsApp)
  RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
  TYPESENSE_API_KEY, TYPESENSE_HOST

Scraper (apps/scraper/.env):
  DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
  GEMINI_API_KEY          (comma-separated for key rotation)
  GEMINI_MODEL            (default: gemini-flash-lite-latest)
  BATCH_SIZE              (default: 10)
  REQUEST_DELAY           (default: 1.0 seconds)
  YOUTUBE_API_KEY         (for youtube_spider.py)

---

## Common Gotchas

1. raw_scraped_data partitions — CREATE monthly partition BEFORE first insert each month
2. Slug IDs — pages accept both ssc-514 AND 514 (id-only)
3. notification_type — DB uses underscore (admit_card), URL uses hyphen (admit-cards)
4. pgdb.js graceful degradation — returns []/null when DB not configured, NEVER throws
5. PDF links — NEVER '#' fallback; always check null before rendering button
6. CSS colors — use CSS vars (--primary etc.), NOT hardcoded hex values
7. Org acronym — always UPPERCASE in DB (stored with .upper())
8. Connection pool — Scraper: ThreadedConnectionPool(1, 4); Web: pg Pool max:5
9. External links — always target="_blank" rel="noopener noreferrer"
10. No '#' URLs — use null and conditionally render links
11. supabase.js — legacy file; prefer pgdb.js for all new DB access
12. No Tailwind — vanilla CSS + CSS Modules only
13. No Pages Router — App Router only

---

## How to Run

Frontend (from apps/web/):
  npm run dev     - development with hot reload (port 3000)
  npm run start   - production (uses built files)
  npm run build   - build only when explicitly needed

Scraper (from apps/scraper/):
  python run_scraper.py                       - run all spiders
  python run_scraper.py --spider bmc          - run single spider
  python classify_exam_notifications.py       - classify unclassified rows
  python migrations/run_migration.py migrations/002_enrich_schema.sql

---

## Session Startup Checklist (do this every new session)

1. GEMINI.md is auto-loaded (routing tables, DB lib rules, design rules)
2. Read CONTINUATION.md for last-session status + pending tasks
3. Read this SKILL.md for full architecture (you are reading it now)
4. Check if there are pending tasks in CONTINUATION.md before starting new work
5. Update CONTINUATION.md at end of every session with what was done + what is next
