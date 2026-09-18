# ExamUdaan — Continuation Handoff
# READ THIS after GEMINI.md at the start of every new session
# Last updated: 2026-09-18 (Session 31)

---

## Session 31 — Mobile Responsiveness Fixes + Live TickerBar (COMPLETE)

### 1. Mobile Responsiveness — 6 Pages Fixed

**Root Causes Found**:
- `globals.css` had TWO conflicting `.job-detail-layout` definitions (one at ~line 1421 with `2fr 1fr`, another at ~line 1582 with `1fr 300px`). The first was removed.
- Mobile "Apply Now" sticky bar used `zIndex: 40`, which is BELOW mobile bottom nav (`z-index: 50`), making the button invisible on mobile — fixed to `zIndex: 55`.
- Sidebar sticky top was hardcoded `'80px'` in 5 pages — updated to CSS variable `calc(var(--nav-height) + var(--ticker-height) + 12px)`.
- CTA buttons didn't stack on narrow screens — added `className="detail-cta-row"` with CSS `flex-direction: column` at `≤480px`.
- Selection process arrows didn't wrap gracefully — added `className="selection-steps-row"` with CSS `rotate(90deg)` on arrows at `≤640px`.

**Files Modified**:
- `apps/web/src/styles/globals.css`:
  - Removed duplicate `.job-detail-layout` (first definition)
  - Fixed `#mobile-action-bar` → `z-index: 55, bottom: 64px` at `≤767px`
  - Added `.detail-cta-row` (flex column on mobile)
  - Added `.detail-org-icon` (64px → 44px at ≤400px)
  - Added `.selection-steps-row` + `.selection-step-arrow` (vertical on mobile)
  - Added `.info-pill` mobile overrides (`white-space: normal, max-width`)
  - Added `.data-table td` (`overflow-wrap: break-word`)
  - Added global mobile safety net (`img/table max-width:100%, overflow-wrap`)
- `apps/web/src/app/jobs/[slug]/page.js`:
  - Hero org icon div → `className="detail-org-icon"` 
  - CTA buttons container → `className="detail-cta-row"`
  - Selection steps → `className="selection-steps-row"` + `selection-step-arrow`
  - Mobile bar → `zIndex: 55` (was 40)
  - Sidebar sticky top → CSS variables
- `apps/web/src/app/results/[slug]/page.js` — sidebar sticky top fixed
- `apps/web/src/app/admit-cards/[slug]/page.js` — sidebar sticky top fixed
- `apps/web/src/app/answer-keys/[slug]/page.js` — sidebar sticky top fixed
- `apps/web/src/app/schemes/[slug]/page.js` — sidebar sticky top fixed

### 2. TickerBar — Now Shows Latest 15 Live Jobs

**File**: `apps/web/src/components/TickerBar.js`

**Before**: 6 hardcoded static strings.

**After**:
- On mount, fetches `/api/notifications?type=recruitment&limit=15&status=published`
- Displays live job titles from DB in the scrolling ticker
- Falls back to 10 static strings while loading / if DB is empty
- Animation duration scales automatically with item count (`items.length * 4` seconds)
- Handles both response shapes: `data.data.notifications` and legacy `data.notifications`

### 3. Build Verification
- `npm run build` → **exit code 0** ✅
- **53 routes** compiled successfully (53/53)
- TypeScript: PASSED

---


## Session 30 — Spider URL Filtering + Post-Processing Enrichment (COMPLETE)

### 1. Spider URL Noise Filtering (dedup_mixin.py + psu_mega_spider.py)

**Problem**: Spiders were following noise PDF links like:
  - `newindia.co.in/assets/docs/list_of_sundry_creditors/Outstanding_dues...pdf`
  - Annual reports, MSME docs, creditor lists, tenders

**Fix (apps/scraper/spiders/dedup_mixin.py)**:
- Added `CAREER_PATH_KEYWORDS` tuple — URL path segments that confirm a career page
- Added `NOISE_PDF_PATH_PATTERNS` tuple — PDF paths that are NEVER recruitment related
- Added `is_valid_career_url(url, title)` method:
  - Rule 1: Reject noise PDFs (creditor, msme, annual_report, etc.)
  - Rule 2: Accept if URL path contains career keyword
  - Rule 3: Accept if title contains recruitment keyword
  - Rule 4: Reject otherwise
- Expanded `IRRELEVANT_KEYWORDS` with creditor/finance noise terms

**Fix (apps/scraper/spiders/psu_mega_spider.py)**:
- `parse()` now calls `self.is_valid_career_url(url, title)` on every link
- Added early `DeduplicationPipeline.is_known(url)` check before HTTP request
- PDFs now only yielded if title contains exam keywords
- `parse_detail()` now extracts:
  - Apply start/end dates (regex on HTML text)
  - Application fee (by category: general, sc_st, obc, women)
  - Age limit (min/max)
  - Apply online link
  - Notification PDF link
- Added `_parse_date()` helper for Indian date formats → YYYY-MM-DD
- Added `from datetime import datetime` import

### 2. Post-Processing Enrichment Script (NEW — enrich_notifications.py)

**File**: `apps/scraper/enrich_notifications.py`

**Purpose**: Standalone (non-Scrapy) script that runs AFTER scraping to fill in
missing structured fields using Gemini.

**What it does**:
- Queries DB for recruitment rows missing apply_start_date / apply_end_date / total_vacancies
- For each row, sends description text (or fetched source page) to Gemini
- Gemini returns structured JSON: dates, vacancies, fee, age limit, qualifications, salary, posts[]
- Updates DB with COALESCE (never overwrites existing values)
- Creates posts table rows from the vacancy breakdown

**Run commands**:
```
python enrich_notifications.py                  # 50 rows
python enrich_notifications.py --limit 200      # 200 rows
python enrich_notifications.py --fetch          # fetch source URLs when description empty
python enrich_notifications.py --dry-run        # print but don't write
python enrich_notifications.py --id 1234        # specific row
```

**Integration**: Added to `cron_6h.sh` — runs automatically after every scrape cycle
with `--limit 100 --fetch`.

---


---

## HOW TO START A NEW SESSION (3 steps)

1. GEMINI.md auto-loads — routing rules, DB lib rules, design rules are already in context
2. Read .agents/skills/examudaan-codebase/SKILL.md — full architecture, all files, all patterns
3. Read THIS FILE — current status, pending tasks, last session bugs

Do NOT scan directories or read source files until you know what task you are doing.

---

## Session 29 — Scrapy 2.11+ Deprecation Warnings Resolution (COMPLETE)

### Fixed Scrapy Pipeline Deprecation Warnings in apps/scraper/pipelines.py
- **Issue**: Scrapy 2.11+ / 2.17+ deprecated requiring the `spider` parameter directly in pipeline methods:
  `DeduplicationPipeline.open_spider() requires a spider argument, this is deprecated...`
  `DeduplicationPipeline.process_item() requires a spider argument, this is deprecated...`
  `GeminiExtractionPipeline.open_spider() / process_item()`
  `PostgresPipeline.open_spider() / close_spider() / process_item()`
  `CrawlSummaryEmailPipeline.open_spider() / close_spider() / process_item()`
- **Root Cause**: Modern Scrapy inspects pipeline signatures via `argument_is_required(method, "spider")`. When methods declare mandatory `spider` without a default, Scrapy raises deprecation warnings.
- **Fix**:
  1. Implemented `@classmethod from_crawler(cls, crawler)` on all 4 pipeline classes in `apps/scraper/pipelines.py` to save `pipe.crawler = crawler`.
  2. Changed method signatures to `open_spider(self, spider=None)`, `process_item(self, item, spider=None)`, and `close_spider(self, spider=None)`.
  3. Added fallback `spider = spider or (getattr(self, 'crawler', None) and self.crawler.spider)` to maintain backward and forward compatibility.
- **Result**: Deprecation warnings dropped from 12 to **0**. Full dry-run across all 63 spiders completed with 63 OK, 0 FAIL.

---

## Session 28 — API Request Signature Verification (x-verify) (COMPLETE)

### Implemented Anti-Tamper & Anti-Scraping x-verify System (Mirrors AiTEK Architecture)
1. **Secret Key Architecture (.env & .env.local):**
   - Configured `HASH_KEY` on the server and `NEXT_PUBLIC_HASH_KEY` on the frontend client.
   - Built with secure fallback defaults to prevent server crashes.
2. **Server-Side Verification (`apps/web/src/lib/hashVerify.js`):**
   - Implemented `computePayloadHash(payload, secretKey)` using `jsSHA` (SHA-256 in HEX).
   - Implemented `GenerateHash(req, payload)` mirroring the exact user specification:
     `text = Buffer.from(JSON.stringify(payload)).toString("base64") + process.env.HASH_KEY`
     `hash = shaObj.getHash("HEX")`
     Case-insensitive comparison with incoming `x-verify` / `X-Verify` header.
     Added canonical sorted key fallback to ensure zero false-positives if key orders vary.
   - Implemented `checkHash(req, payload)`: returns HTTP 422 Unprocessable Content if signature mismatch or unauthorized call.
   - Integrated `checkHash` directly into:
     - `withValidation` (`apps/web/src/lib/validate.js`)
     - `withAuth` (`apps/web/src/lib/auth.js`)
     - Feedback API (`apps/web/src/app/api/feedback/route.js`)
     - AI Assistant API (`apps/web/src/app/api/ask/route.js`)
3. **Client-Side Signature Generator & API Client (`apps/web/src/lib/apiClient.js`):**
   - Implemented `createVerifyHash(payload)` and `getVerifyHeaders(payload)` in pure JS.
   - Implemented `apiFetch(url, options)`: automatic drop-in wrapper around `fetch` that dynamically creates the `x-verify` signature for mutating requests (POST, PUT, DELETE) and payloads.
   - Updated all client components and pages:
     - `apps/web/src/app/login/page.js` (`handleSendOtp`, `handleVerifyOtp`, `handlePasswordLogin`)
     - `apps/web/src/app/register/page.js` (`handleSendOtp`, `handleVerifyOtp`)
     - `apps/web/src/app/feedback/page.js` (`handleSubmit`)
     - `apps/web/src/app/dashboard/page.js` (`removeSavedJob`, `saveCriteria`, `deleteCriteria`, `handleLogout`, `handleProfileSave`, `handleSetPassword`, `handleChangePassword`)
     - `apps/web/src/components/SaveJobButton.js` (`handleToggle`)
     - `apps/web/src/app/ask/page.js` (`handleSend`)
     - `apps/web/src/components/Navbar.js` (`handleSignOut`)
4. **Verification & Tests:**
   - 7/7 automated verification tests passed in `scratch/test_xverify.mjs` (valid signature, tampered body detection, missing header rejection with 422, case-insensitivity, and checkHash middleware).
   - Next.js production build succeeded with 0 errors across all 53 routes in 6.2s.

---

## Session 27 — PageSpeed & Core Web Vitals Optimization (COMPLETE)

### Fixed PageSpeed Insights Performance Issues (Desktop / Mobile)
1. **Render-Blocking Requests (Estimated savings: 3,660 ms):**
   - **Root Cause**: `@import url('https://fonts.googleapis.com/css2?...')` in `globals.css` forced browsers to pause stylesheet parsing, perform external DNS lookups, and wait for Google Fonts CSS before rendering.
   - **Fix**: Replaced CSS `@import` with Next.js self-hosted `next/font/google` (`Inter` and `Mukta`) in `layout.js`. Fonts are pre-downloaded, self-hosted, and inlined at build time with zero external network blocking.
2. **Font Display (Estimated savings: 50 ms):**
   - **Root Cause**: Material Symbols font had `&display=block` which caused text/icon hiding during initial render.
   - **Fix**: Added `<link rel="preconnect">` for Google Fonts origins and changed to `display=swap`. Added zero-shift bounding box styles (`width: 1em; height: 1em; overflow: hidden;`) to `.material-symbols-outlined` to eliminate icon FOUT and layout shifts.
3. **Forced Reflow & Layout Shift (CLS):**
   - **Root Cause**: `.ticker-content` infinite animation triggered CPU layout thrashing and continuous repaints.
   - **Fix**: Added `will-change: transform; transform: translateZ(0);` and converted keyframes to hardware-accelerated `translate3d(100vw, 0, 0)`.
4. **Third-Party Script Contention (TBT / Total Blocking Time):**
   - **Fix**: Changed Microsoft Clarity in `layout.js` from `strategy="afterInteractive"` to `strategy="lazyOnload"` so session recordings execute during browser idle time instead of competing with first paint.
5. **Efficient Cache Lifetimes (Estimated savings: 102 KiB):**
   - **Fix**: Added 1-year immutable `Cache-Control: public, max-age=31536000, immutable` headers in `next.config.js` for all static assets (`svg, jpg, png, webp, avif, ico, webmanifest`).
6. **Legacy JavaScript (Estimated savings: 13 KiB):**
   - **Fix**: Added `compiler: { removeConsole }` in production and enabled Brotli/Gzip compression in `next.config.js`.

---

## Session 26 — Database Schema Sync & Migration Audit (COMPLETE)

### Fixed DB Errors & Migration Issues
1. **`SQL Error [42883]: ERROR: operator does not exist: uuid = bigint` (Line 324 pos 567 in `002_rls_and_functions.sql`):**
   - **Root Cause**: `boards.id` is `UUID` while `posts.board_id` is `BIGINT` in the active database. Direct equality `b.id = p.board_id` throws type operator error in PostgreSQL.
   - **Fix**: Replaced join condition with explicit text cast `b.id::text = p.board_id::text` in `public_jobs` view, `get_board_job_counts()`, and `search_posts()`.
2. **`SQL Error [42804]: ERROR: foreign key constraint "vacancy_details_post_id_fkey" cannot be implemented` (`001_init.sql`):**
   - **Root Cause**: `vacancy_details.post_id` was typed as `bigint` while `posts.id` was typed as `uuid`.
   - **Fix**: Fixed `post_id` to `uuid references posts(id)` in `001_init.sql`.
3. **Updated Seed Data for `boards` (80+ Recruiting Bodies & Boards):**
   - Updated `insert into boards (name, short_name, slug, website_url, category) values ...` in `001_init.sql` and `012_consolidated_schema_sync.sql` with all 80+ boards, PSCs, police boards, teaching boards, medical/research institutes, PSUs, and High Courts from latest spiders.
   - Added synchronization into `organizations` table.
4. **Master Migration Script Created (`packages/db/migrations/012_consolidated_schema_sync.sql`):**
   - Safe, idempotent, consolidated script for users to run on their database.
   - Adds all missing columns (`users`, `exam_notifications`, `organizations`, `posts`).
   - Fixes views and functions to eliminate type mismatch.
   - Safely harmonizes user foreign keys.
   - Seeds all 80+ boards.

---

## Session 25 — What Was Done

### User Auth, Profile & Dashboard (COMPLETE — build passing)

**DB Migrations:**
- `packages/db/migrations/010_users_profile_fields.sql` — adds `gender, dob, state, whatsapp, password_hash`
- `packages/db/migrations/011_user_uuid_foreign_keys.sql` — aligns `user_job_criteria.user_id` and `user_job_tracker.user_id` to accept UUID strings, adds `language` to `users`, and adds `notification_id` to `user_job_tracker`
  - **⚠ USER RUNS MIGRATIONS MANUALLY against the live DB**

**New API Routes (all compile, all in build):**
- `POST /api/auth/set-password` — sets password for first time (OTP/Google users)
- `POST /api/auth/change-password` — change existing password with bcrypt verification
- `POST /api/auth/login-password` — login with email + password instead of OTP

**Modified API Routes & Fixes:**
- `GET /api/user/profile` — queries `SELECT * FROM users WHERE id::text = $1::text` (safe from missing `language`, `gender`, etc. and UUID/int mismatch); isolated alert count query; token data fallback.
- `PUT /api/user/profile` — dynamically checks `information_schema.columns` before generating UPDATE statements; never references missing columns.
- `GET/POST/PUT/DELETE /api/user/job-criteria` — uses `user_id::text = $1::text` so comparing a UUID user ID with an integer or text column never throws `22P02 (invalid input syntax for type integer)`; gracefully returns empty list on DB warning.
- `GET/POST/DELETE /api/user/saved-jobs` — dynamically detects whether `notification_id` or `post_id` column exists in `user_job_tracker` table; uses `user_id::text = $1::text`; returns empty list safely on table error.
- `apps/web/src/app/dashboard/page.js` — immediately reads `eu_user` from `localStorage` on mount to pre-fill user state, `userName`, `userEmail`, `userPhone`, and all form inputs; includes `x-refresh-token` in `authHeaders()`; handles refreshed access token in response; displays user's real email & phone in read-only profile inputs.

**Navbar (`components/Navbar.js`):**
- Reads `eu_access_token` + `eu_user` from localStorage on mount
- When logged in: shows avatar bubble (initials or Google photo) with dropdown:
  - My Dashboard | Edit Profile | Security & Password | Upgrade Plan | Sign Out
- Sign Out: calls `POST /api/auth/logout` (revokes server session), clears localStorage, dispatches `storage` event so Navbar updates instantly
- When not logged in: shows "Sign In" button as before

**Dashboard (`app/dashboard/page.js`):**
- Sidebar now has 7 items: Overview, Saved Jobs, My Criteria, Alert Settings, Edit Profile, Security, Plan & Billing
- Supports `?s=profile` / `?s=security` URL params for deep-linking from Navbar
- **Edit Profile section:** First name, Last name, Gender (select), DOB (date), State (select with all Indian states), WhatsApp number, Language preference
- **Security section:** Shows auth provider info (OTP/Google) + has_password status. "Set Password" form if no password yet; "Change Password" form if password is set
- **Plan & Billing section:** Current plan card + upgrade CTA with plan cards (Basic/Smart/Pro) for free users + feature checklist
- handleLogout: now calls API + dispatches storage event to sync Navbar

**Login (`app/login/page.js`):**
- Added 3rd tab "Password" with email+password form
- Calls `POST /api/auth/login-password`
- Link to set password via Dashboard → Security

**Dependency:**
- `bcryptjs` installed in `apps/web` (pure JS, no build tools needed)

---

## ⚠ Action Required (User)

Run this migration SQL on your PostgreSQL database:
```
packages/db/migrations/010_users_profile_fields.sql
```

This adds: `gender`, `dob`, `state`, `whatsapp`, `password_hash` columns to the `users` table.
The migration is idempotent — safe to run multiple times.

---

## Current Project Status

Build: ✅ PASSED (Session 25 — zero errors, 53 routes, all new API routes live)
Production Domain: Enforced live https://examudaan.in everywhere (no localhost:3000)



## HOW TO START A NEW SESSION (3 steps)

1. GEMINI.md auto-loads — routing rules, DB lib rules, design rules are already in context
2. Read .agents/skills/examudaan-codebase/SKILL.md — full architecture, all files, all patterns
3. Read THIS FILE — current status, pending tasks, last session bugs

Do NOT scan directories or read source files until you know what task you are doing.

---

## Current Project Status

Build: ✅ PASSED (Session 24 — zero errors, all routes clean)
Production Domain: Enforced live https://examudaan.in everywhere (no localhost:3000)
Brand Title: Standardized to "ExamUdaan.in — Maharashtra Govt Job Alerts | MPSC, Police Bharti, BMC"
Scraper: **72 active spiders** (10 new spiders added Session 26, all stub spiders fixed)
RSS Feeds: **32 government RSS feeds** (was 15, expanded to cover insurance, energy PSU, infrastructure, medical)
DB: PostgreSQL via apps/web/src/lib/pgdb.js (query + queryOne)
Auth: Custom JWT in lib/auth.js — NOT NextAuth. OTP via Brevo. Google OAuth wired.
Users table: USES first_name + last_name (NOT name). Run migration 009 if not done yet.
Listing pages: All 5 listing pages with detail page routing
Detail pages: All 5 detail page types done
Privacy/Legal: Cookie consent, DPDP Act data deletion API + dashboard UI
SEO: JSON-LD on all 5 detail page types + canonical URLs + dynamic sitemap.xml & robots.txt
Multilingual: Full EN/MR toggle
Agent Reach: Installed in ~/.agent-reach-venv/ (RSS + Jina channels active)

## Session 26 Changes (2026-09-13) — Scraper Expansion (vs Excel)

### New Spiders Created (from Excel gap analysis)
- `uppbpb_spider.py` — UP Police Recruitment Board (https://uppbpb.gov.in) — massive user base
- `bssc_spider.py` — Bihar Staff Selection Commission (https://bssc.bihar.gov.in)
- `rsmssb_spider.py` — Rajasthan RSMSSB (https://rsmssb.rajasthan.gov.in) — marquee/What's New targeting
- `hssc_spider.py` — Haryana Staff Selection Commission (https://hssc.gov.in)
- `army_agniveer_spider.py` — Indian Army Agniveer portal
- `navy_airforce_spider.py` — Indian Navy + Air Force AFCAT (2 domains in one spider)
- `ctet_spider.py` — CTET + 6 State TETs: UPTET, REET, HTET, MAHATET, TNTET, KTET (7 portals)
- `aiims_central_spider.py` — AIIMS Exams + PGIMER + JIPMER + ESIC (4 medical portals)
- `psu_mega_spider.py` — 20+ PSUs: UIIC, NIACL, LIC, NABARD, NTPC, ONGC, IOCL, BPCL, HPCL, PGCIL, DRDO, BARC, HAL, BEL, AAI, DMRC, RITES, NIC, FCI, ESIC, EPFO
- `isro_spider.py` — Replaced 1-line stub with proper careers page spider

### Stub Spiders Fixed (now target actual recruitment URLs)
- `hppsc_spider.py` → https://hppsc.hp.gov.in/hppsc/recruitment
- `cgpsc_spider.py` → https://psc.cg.gov.in/recruitment.html
- `opsc_spider.py` → https://opsc.gov.in/notification.aspx
- `goapsc_spider.py` → https://gpsc.goa.gov.in/notifications/
- `ukpsc_spider.py` → https://psc.uk.gov.in/pages/display/55-latest-notification
- `jpsc_spider.py` → https://jpsc.gov.in/notice_board.html
- `tspsc_spider.py` → https://tspsc.gov.in/notfns-0.html
- `ppsc_spider.py` → https://ppsc.gov.in/Advertisements
- `wbpsc_spider.py` → https://wbpsc.gov.in/Notification

### RSS Expanded: 15 → 32 feeds
Added: NABARD, UIIC, NIACL, LIC, ISRO, BARC, DFCCIL, PGCIL, IOCL, AAI, RITES, FCI, ESIC, EPFO, PGIMER

### run_scraper.py Updated
- SPIDERS list expanded to 72 entries (added 10 new spiders in proper category groups)

## Session 25 Changes (2026-09-13)

### Multi-Key Gemini & State Expansion Fixes
- **GEMINI_API_KEY**: Validated all 3 comma-separated keys live against Google Gemini API with `gemini-flash-lite-latest` — all 3 keys are 100% active and working.
- **Fixed `ai_spider.py`**:
  - Replaced blocked Jina Reader proxy (`r.jina.ai` was returning Cloudflare 403) with direct government website fetching.
  - Added HTML sanitization (stripping script/style tags) before passing clean text to Gemini Flash Lite.
  - Fixed `import re` missing import bug that caused NameError.
  - Added source state metadata mapping into each ExamPost.
  - Integrated `GeminiKeyManager` to parse comma-separated keys and rotate automatically on 429 quota exhaustion.
  - Replaced deprecated `gemini-1.5-flash` endpoint with `gemini-flash-lite-latest`.
  - Added `async def start(self)` for Scrapy 2.17+ compatibility.
- **Fixed `rss_spider.py`**:
  - Added `async def start(self)` so Scrapy 2.17 dispatches all 15 feed requests properly.
- **Fixed Multi-State Ingestion (`apps/scraper/db.py`)**:
  - Fixed hardcoded fallback `state_slug = 'maharashtra'`.
  - Now dynamically derives `state_slug` and `state_normalized` from spider item data.
  - Added `state_normalized` column to `exam_notifications` INSERT and ON CONFLICT update.
  - Backfilled existing non-Maharashtra records in PostgreSQL with their correct `state_slug`.
- **Expanded Frontend & API Filters**:
  - `apps/web/src/components/ListingPage.js`: Expanded sidebar state filters to 20+ states.
  - `apps/web/src/app/api/notifications/route.js`: Enhanced `?state=` query to match both `state_slug` and `state_normalized` with state alias support (`up`, `mp`, `ap`, `tn`, `wb`, etc.).
- **Scheduler & PM2 Setup**:
  - Created root `ecosystem.config.js` running `examudaan-web` (cluster) and `examudaan-scraper-cron` (every 6 hours).
  - Synchronized `run_scraper.py` with all 53+ spiders (RSS, central, state PSCs, PSUs, and ai_spider).

### Consolidated Daily Crawl Summary Email (Replaced Per-Spider Spam)
- **Problem**: Previously, `CrawlSummaryEmailPipeline` fired on `close_spider()` for every single spider, flooding the inbox with 50+ individual emails per run.
- **Fix**:
  - Disabled `CrawlSummaryEmailPipeline` in `apps/scraper/settings.py` (`ITEM_PIPELINES`) and added an env var guard (`ENABLE_PER_SPIDER_EMAIL=false` by default). Individual spiders no longer send emails.
  - Created `apps/scraper/send_summary_email.py`: Compiles high-level metrics across all spiders (`scrape_log`, new & updated `exam_notifications`, state breakdown, type breakdown, top new jobs, and execution duration per spider) into a single, executive-grade Brevo HTML report.
  - Hooked into `apps/scraper/run_scraper.py`: Dispatches exactly **1 consolidated email** at the very end of the crawl run (after all spiders and Marathi translation finish).
  - Added CLI flag `--no-email` to run silently when desired, and `--today` flag to `send_summary_email.py` to trigger on-demand daily summaries at any time.

---

### Fix: Google OAuth column "name" does not exist error
- **Root cause**: Live DB renamed users.name → first_name + last_name (done manually before session)
- `apps/web/src/app/api/auth/google/callback/route.js`:
  - SELECT now uses `first_name, last_name` instead of `name`
  - UPDATE uses `COALESCE(NULLIF(first_name,''), $3)` pattern
  - INSERT uses `(email, first_name, last_name, google_id, ...)`
  - JWT payload + user JSON use `first_name`/`last_name`
  - Google's `profile.name` is split into first_name / last_name at callback time
- `apps/web/src/app/api/auth/verify-otp/route.js`:
  - Both RETURNING clauses updated to `first_name, last_name`
  - Response object returns `first_name`/`last_name` not `name`
- `apps/web/src/app/dashboard/page.js`:
  - `userName` now reads `first_name` first, falls back to legacy `name`
- **Migration**: `packages/db/migrations/009_users_split_name.sql` created
  - Idempotent: renames name→first_name only if column exists, adds last_name, backfills splits
  - ⚠️ RUN THIS ON LIVE DB if not already done

### National Expansion: New Spiders
- `apps/scraper/spiders/rss_spider.py` — Generic RSS/Atom spider for 15+ govt feeds
  - UPSC, SSC, NTA, IBPS, RBI, SBI, DRDO, India Post, Employment News, RRB, ONGC, NTPC, AIIMS
  - Run: `scrapy crawl rss`
- `apps/scraper/spiders/ai_spider.py` — Jina Reader + Gemini Flash for JS-heavy sites
  - Covers 13 state PSC + PSU sites (RPSC, MPPSC, GPSC, HPSC, PPSC, KPSC, TNPSC, TSPSC, NABARD, LIC, ISRO, Coal India, HAL)
  - Run: `scrapy crawl ai_spider` (needs GEMINI_API_KEY in env)
- `apps/scraper/spiders/rpsc_spider.py` — Rajasthan PSC (scrapy crawl rpsc)
- `apps/scraper/spiders/mppsc_spider.py` — Madhya Pradesh PSC (scrapy crawl mppsc)
- `apps/scraper/spiders/gpsc_spider.py` — Gujarat PSC (scrapy crawl gpsc)
- `apps/scraper/spiders/kpsc_spider.py` — Karnataka PSC (scrapy crawl kpsc)
- `apps/scraper/spiders/tnpsc_spider.py` — Tamil Nadu PSC (scrapy crawl tnpsc)
- `apps/scraper/requirements.txt`: feedparser>=6.0 added (already in .venv)
- `apps/scraper/cron_6h.sh`: Updated to 42 spiders, rss runs first, aggregator removed

### Agent Reach Installed
- Location: ~/.agent-reach-venv/
- Active: RSS feed reader, Jina Reader (any webpage), V2EX, Bilibili basic
- Check: `& "$env:USERPROFILE\.agent-reach-venv\Scripts\agent-reach.exe" doctor`

## Pending / Next Steps

- [ ] Run `009_users_split_name.sql` on live DB (if not already done by manual ALTER TABLE)
- [ ] Test Google OAuth login on live site — should work after deploy
- [ ] Deploy new build to production (new Google OAuth fix in callback/route.js)
- [ ] Run RSS spider on server: `scrapy crawl rss -o /tmp/rss_test.json`
- [ ] Add HPSC (Haryana), PPSC (Punjab), TSPSC (Telangana) spiders (next session)
- [ ] Add NABARD, LIC, ISRO direct Scrapy spiders (next session)
- [ ] Update SKILL.md with new spider list

## Session 23 Changes (2026-09-13)

### Core Fix: Localhost:3000 Elimination & Brand Title Standardization
- **Root Cause**: `apps/web/.env.local` had `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
- **apps/web/.env.local**: Changed to `https://examudaan.in`, synced JWT secrets.
- **apps/web/src/app/layout.js**: Defensively sanitized `SITE_URL`. Updated brand title.
- **Dedicated Layouts**: login, register, search, dashboard layout.js created.
- **Sanitized**: detail pages, sitemap.js, robots.js, constants.js, OAuth routes.
- **Build Verification**: `npm run build` passed; zero `localhost:3000` in generated HTML.


## Session 21 Changes (2026-09-12)

### New Files Created
- apps/web/src/app/register/page.js         — OTP-based registration page (no password)
- apps/web/src/app/auth-success/page.js     — OAuth token storage landing page
- apps/web/src/app/api/auth/google/route.js — Google OAuth initiation (redirects to Google)
- apps/web/src/app/api/auth/google/callback/route.js — Google OAuth callback (issues JWT)
- apps/web/src/app/api/user/saved-jobs/route.js     — Save/list/delete saved jobs (auth required)
- apps/web/src/app/api/user/job-criteria/route.js   — User job criteria CRUD (auth required)
- apps/web/src/components/SaveJobButton.js  — Bookmark toggle button for job cards + detail pages
- packages/db/migrations/008_user_auth_and_criteria.sql — DB migration (RAN SUCCESSFULLY)

### Modified Files
- apps/web/src/app/login/page.js            — Wired to real Brevo OTP API, Google OAuth button
- apps/web/src/app/dashboard/page.js        — Rewired with real API data (saved jobs, criteria, profile)
- apps/web/src/app/layout.js               — Fixed OG URL (was localhost:3000), added Clarity analytics
- apps/web/src/app/api/auth/send-otp/route.js — Switched from Resend to Brevo email delivery
- apps/web/src/app/api/notifications/route.js — Added govt_level filter, multi-org comma-separated support
- apps/web/src/components/ListingPage.js    — Added Government Level filter, multi-org checkbox fix
- apps/web/src/components/HomePageView.js   — Fixed walk-in date format (was showing full UTC string)
- apps/web/.env                            — Added all new env keys (Brevo, GA, Clarity, Google OAuth)

### DB Changes (Applied Successfully)
- users table: Added google_id, avatar_url, auth_provider, updated_at columns
- Created: user_job_criteria table
- Created: user_job_tracker table (if not exists)
- Created: idx_user_job_criteria_user, idx_user_job_tracker_user indexes

## Keys Still Needed from User

| Key | Where to get | Status |
|-----|------|----------|
| GOOGLE_CLIENT_ID | Google Cloud Console → Credentials → OAuth 2.0 | Pending |
| GOOGLE_CLIENT_SECRET | Same as above | Pending |
| GOOGLE_SITE_VERIFICATION | Search Console → Add Property | Pending |
| JWT_SECRET + JWT_REFRESH_SECRET | Generated and added to .env | ✅ DONE |
| NEXT_PUBLIC_GTM_ID | Set to GTM-NH9V94Q9 | ✅ DONE |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | Set to G-PG16F0L21G | ✅ DONE |
| NEXT_PUBLIC_CLARITY_ID | Set to yh913yaes0 | ✅ DONE |

## URGENT: JWT Secrets — SECURED ✅
JWT_SECRET and JWT_REFRESH_SECRET are now set with cryptographically secure 64-byte hex strings.

## Analytics Status
- GTM (GTM-NH9V94Q9): ✅ Integrated in layout.js via afterInteractive Script
- GA4 (G-PG16F0L21G): ✅ Managed through GTM dashboard (no separate gtag script needed)
- Clarity (yh913yaes0): ✅ Integrated in layout.js via afterInteractive Script
- Both GTM head script + noscript iframe in body added correctly

---

## What Exists (Verified Session 18 — 2026-09-12)

### Frontend — apps/web/src/

Pages (app/):
  ✅ page.js                   - Homepage — REDESIGNED with AiMatcher + Live Feeds (Session 15)
  ✅ layout.js                 - Root layout
  ✅ error.js                  - Error boundary
  ✅ not-found.js              - 404
  ✅ about/page.js             - About Us — mission, pillars, stats, journey (Session 14)
  ✅ terms/page.js             - Terms of Service — legal compliance, subscriptions (Session 14)
  ✅ privacy/page.js           - Privacy Policy — DPDP Act 2023, WhatsApp policy (Session 14)
  ✅ contact/page.js           - Contact Us — interactive form, helpline, map info (Session 14)
  ✅ disclaimer/page.js        - Disclaimer & Non-Affiliation Statement (Session 14)
  ✅ faq/page.js               - Frequently Asked Questions — accordion + search (Session 14)
  ✅ feedback/page.js          - Aspirant Feedback & Portal Suggestion Desk (Session 15)
  ✅ jobs/page.js              - Jobs listing — NOW uses ListingPage component (Session 12)
  ✅ jobs/[slug]/page.js       - Job detail — FULLY ENRICHED (Session 11)
  ✅ results/page.js           - Results listing — NOW uses ListingPage component (Session 12)
  ✅ results/[slug]/page.js    - Result detail — FULLY ENRICHED (Session 11)
  ✅ admit-cards/page.js       - Admit cards listing — NOW uses ListingPage component (Session 12)
  ✅ admit-cards/[slug]/page.js- Admit card detail — FULLY ENRICHED (Session 11)
  ✅ answer-keys/page.js       - Answer keys listing — NOW uses ListingPage component (Session 12)
  ✅ answer-keys/[slug]/page.js- Answer key detail — FULLY ENRICHED (Session 11)
  ✅ schemes/page.js           - Syllabus/schemes listing
  ✅ alerts/page.js            - Alert subscription UI
  ✅ calendar/page.js          - Monthly exam calendar
  ✅ dashboard/page.js         - User dashboard
  ✅ login/page.js             - OTP login
  ✅ pricing/page.js           - Pricing + Razorpay
  ✅ search/page.js            - Search results
  ✅ ask/page.js               - AI exam assistant
  ✅ admin/page.js             - Admin dashboard
  ✅ admin/scrapers/page.js    - Admin spider mgmt
  ✅ sitemap.js                - Dynamic XML sitemap
  ✅ robots.js                 - robots.txt

Components (components/):
  ✅ Navbar.js, Footer.js, FilterChips.js, JobCard.js
  ✅ SkeletonCard.js, TickerBar.js, MobileBottomNav.js
  ✅ ShareButtons.js, HindiToggle.js, SyllabusBreakdown.js
  ✅ ListingPage.js — NEW (Session 12) shared listing component with Amazon-style sidebar

API Routes (app/api/):
  ✅ /api/posts, /api/stats, /api/alerts
  ✅ /api/auth/send-otp, /api/auth/verify-otp, /api/auth/logout
  ✅ /api/user/profile
  ✅ /api/payment/create-order, /api/payment/verify
  ✅ /api/admin/stats, /api/admin/jobs, /api/admin/scrapers
  ✅ /api/notifications, /api/search, /api/ask

Lib (lib/):
  ✅ pgdb.js, auth.js, validate.js, apiResponse.js
  ✅ formatDate.js, helpers.js, supabase.js (legacy — do not use)

### Scraper — apps/scraper/

  ✅ db.py, items.py, middlewares.py, classify_exam_notifications.py, cron_6h.sh
  ✅ pipelines.py      — Session 18: 3-week date cutoff, auto status='closed',
                         default_notification_type spider attribute support
  ✅ settings.py       — Session 18: CLOSESPIDER_PAGECOUNT=10, CLOSESPIDER_ITEMCOUNT=50
  ✅ run_scraper.py    — Session 18: ThreadPoolExecutor parallel (4 at a time, --parallel flag)
  ✅ spiders/dedup_mixin.py  — Session 18: is_stale_date(), MAX_ITEM_AGE_DAYS=21, should_skip_link()
  ✅ spiders/rrb_spider.py   — Session 18: migrated to ExamNotificationItem, fixed field names
  ✅ 30 active spiders — all now have default_notification_type = 'recruitment'
  ❌ spiders/mumbai_police_spider.py — DISABLED in run_scraper.py (3+ years of stale data)

Migrations (apps/scraper/migrations/):
  ✅ 002_enrich_schema.sql   - Filter columns on exam_notifications
  ✅ 003_notification_type.sql - notification_type column + enum
  ✅ run_migration.py         - Migration runner

---

## What Session 11 Changed (detail page enrichment)

All 4 detail pages now surface ALL available DB data:

jobs/[slug]/page.js:
  - ai_extracted_data: education_levels, job_categories, career_streams,
    selection_methods (shown as step-by-step process with arrows),
    government_level badge, experience_min/max, recruitment_types
  - Full description block (up to 2000 chars, not truncated to 400)
  - Vacancy table upgraded: now shows qualification + job_type columns from posts table
  - Quick Links block: all fields from application_links rendered as link list
  - Sidebar: org address, phone, org_website (was fetched but never shown)
  - Related jobs: same-org shown first, then fills with any org
  - Bug fixed: apply_link no longer falls back to '#' — uses null + conditional render
  - Exam cities: DB column first, ai_extracted_data.cities_normalized as fallback

results/[slug]/page.js:
  - Education level tags + job category tags + selection method tags ("process was")
  - Full description block
  - Quick Links: result_link, notification_pdf, official_website, admit_card, answer_key
  - Org website, address, phone in sidebar
  - Same-org priority for related results

admit-cards/[slug]/page.js:
  - Exam cities grid shown prominently with count badge
  - Documents to carry checklist (hardcoded standard list)
  - AI classification tags (education levels, selection stages, job categories)
  - Full description block
  - Quick Links block (download link, PDF, official website, result, answer key)
  - Org info in sidebar

answer-keys/[slug]/page.js:
  - Selection stage context ("This answer key is for: Written Exam")
  - Objection window alert with red warning banner when date is set
  - Education level + job category tags
  - How to use answer key + calculate score steps
  - Full description block
  - Quick Links block
  - Org info in sidebar

---

## Session 18 — What Changed (2026-09-11)

### 1. Fixed PostgresPipeline DropItem('other') error
- Root cause: spiders with generic link titles (e.g. "Click for details") had no matching
  keyword → classify_notification_type() returned 'other' → DropItem
- Fix: Added `default_notification_type = 'recruitment'` to all spiders:
  upsc, ssc, sbi, ibps, nta, bpsc, employment_news, aggregator, rrb
- Pipeline checks getattr(spider, 'default_notification_type', None) before DropItem

### 2. mumbai_police + aggregator disabled
- `mumbai_police` — commented out in run_scraper.py (3+ years of stale data, no date filtering)
- `aggregator` — commented out in run_scraper.py; all 6 sites it scraped were **commercial
  third-party** (jobrasta.com, sarkarijobfind.com, sarkariresult.com/.co, sarkaridisha.com,
  sarkarinaukri.com). Scraping these creates copyright/ToS/privacy liability.
  `AGGREGATOR_SITES = []` in aggregator_spider.py — spider is a no-op if accidentally run.
  ExamUdaan **only scrapes official government sources**.

### 3. Universal 3-week date cutoff (pipelines.py)
- Checks apply_end_date → apply_start_date → last_source_sync (priority order)
- Items older than 21 days → DropItem("Stale item")
- apply_end_date in the past → auto sets item['status'] = 'closed'
- Unparseable date → item passes through (safe default)

### 4. DuplicateStopMixin (dedup_mixin.py)
- MAX_ITEM_AGE_DAYS = 21 class attribute (set None per spider to disable)
- is_stale_date(date_str) — call in parse() before yielding a request
- should_skip_link(title, href) — single line: irrelevance filter + dedup URL check

### 5. settings.py — page limits
- CLOSESPIDER_PAGECOUNT = 10 (was 1000)
- CLOSESPIDER_ITEMCOUNT = 50 (new)

### 6. run_scraper.py — parallel execution
- ThreadPoolExecutor(max_workers=4) replaces sequential for loop
- 30 spiders, 4 at a time → ~20–30 min total (was ~2 hours)
- Per-spider timeout: 30 min (was 2 hours)
- New CLI flag: --parallel N (default 4)

---

## Pending Tasks

### High Priority
- [ ] Rebuild production: npm run build && npm run start (old build is still running)
- [ ] Test all 4 listing pages with filters in browser — org filter, qualification, state
- [ ] Verify DB connection is working with actual PostgreSQL credentials in .env
- [ ] Check raw_scraped_data partition for 2026-09 exists

### Feature Work (next sessions)
- [ ] Add /schemes/[slug] detail page (syllabus — same pattern as jobs/[slug])
- [ ] Add JSON-LD structured data to results/admit-cards/answer-keys detail pages (jobs has it)
- [ ] Multi-org filter: /api/notifications — extend to comma-separated org list
- [ ] Add pagination number display to listing pages ("Page 2 of 8")
- [ ] Set up Typesense for /search full-text
- [ ] HindiToggle.js — wire up actual Hindi content if available

### Scraper
- [ ] Verify active spiders work against live sites after 10-page limit change
- [ ] Re-enable and fix mumbai_police spider (needs per-row date filtering at crawl time)
- [ ] Check cron_6h.sh is deployed and running on server
- [ ] Confirm classify_exam_notifications.py runs after each scrape batch
- [ ] Add is_stale_date() to more spiders at crawl time (saves HTTP requests + Gemini quota)
  Currently only upsc uses it at spider level — all others rely on pipeline cutoff

---

## Known Issues / Bugs

- supabase.js exists but must NOT be used for new code — use pgdb.js only
- MEMORY.md is stale — references old Supabase SDK — ignore it, trust SKILL.md + CONTINUATION.md
- schemes/[slug] detail page does NOT exist yet (only schemes/page.js listing exists)
- mumbai_police spider disabled — re-enable only after adding proper date row filtering
- UPSC spider still uses legacy ExamPost class (fields map OK via pipeline adapter);
  should be migrated to ExamNotificationItem in a future session for consistency

---

## Session Log

| Session | Date       | What Was Done                                               |
|---------|------------|-------------------------------------------------------------|
| 1-3     | 2026-07-xx | Architecture, DB schema, auth, payment, OTP APIs            |
| 4-6     | 2026-07-xx | All listing pages, detail pages, components                 |
| 7       | 2026-07-xx | Admin pages, scraper spiders (SSC, UPSC, RRB, IBPS, SBI)  |
| 8       | 2026-07-31 | aggregator_spider.py expanded to 6 sites, 5 bugs fixed      |
| 9       | 2026-07-31 | YouTube integration, vacancy details enrichment, AI Ask page |
| 10      | 2026-09-05 | Full skill/memory/GEMINI file refresh — no code changes     |
| 11      | 2026-09-05 | All 4 detail pages fully enriched: ai_extracted_data surfaced (education levels, selection methods, job categories, govt level, experience), full description, vacancy table upgraded, Quick Links block, org info in sidebar, '#' href bug fixed, same-org related items, build PASSED |
| 12      | 2026-09-06 | Rebuilt all 4 listing pages (jobs/results/admit-cards/answer-keys): created shared ListingPage.js component with Amazon-style sticky sidebar filters (org checkboxes, education radio, state radio, salary radio), category tabs linking all sections, search bar with clear, instant-apply filters (no Apply button), switched from /api/posts to /api/notifications (full filter support), added listing-layout CSS with responsive mobile slide-in drawer. Build: PASSED (35 routes) |
| 13      | 2026-09-06 | Detail page walk-in detection expanded (selection_process text matching), ai_extracted_data.posts[] fallback when posts table empty, walk-in dates handling (no TBA, notification date + PDF notice), Advt Ref No & Duration fields added, JobCard walk-in badge. Build: PASSED (35 routes) |
| 14      | 2026-09-06 | Designed and implemented all required informational and legal pages: /about, /terms, /privacy, /contact, /disclaimer, /faq with rich dummy data, DPDP Act 2023 compliance, government non-affiliation disclosures, interactive accordion FAQ, contact forms & updated Footer.js with complete link directory. Build: PASSED (41 routes, 0 errors) |
| 15      | 2026-09-06 | Redesigned homepage with interactive AiMatcher.js component (dynamic qualification, category, age relaxation slider, live vacancy counter, natural prompt parser), urgent walk-ins spotlight feed, live results/admit cards feed, WhatsApp mockup card, and created full Feedback & Portal Suggestion Desk (/feedback + /api/feedback) with ticket tracking and community shipped wall. Build: PASSED (42 routes, 0 errors) |
| 16      | 2026-09-07 | Comprehensive bilingual platform (English <-> Marathi) with LanguageContext, dictionary, reactive client components, listing page filters/sorting, detail pages, and translation pipeline (translate_to_marathi.py). Build: PASSED (43 routes, 0 errors) |
| 17      | 2026-09-07 | Scraper Deduplication & Automatic Translation Pipeline: Reduced consecutive duplicate threshold from 3 to 2 in DuplicateStopMixin, fixed hash checking against known DB hashes/URLs, added fail-safe duplicate tracking & early spider termination in DeduplicationPipeline, implemented get_known_hashes in db.py, added duplicate checking to rrb_spider (verified pmc spider cleanly stops in 1.19s). Integrated translate_to_marathi.py into run_scraper.py and cron_6h.sh to automatically translate newly scraped notifications in batches of 10 hands-free. |
| 19      | 2026-09-12 | Go-Live Readiness: (1) Cookie consent banner (CookieConsent.js + layout.js) with Google Analytics consent gating. (2) DPDP Act compliant account & data deletion API (/api/user/delete) + Dashboard Danger Zone with confirmation modal. (3) Category reservation breakdown in /jobs/[slug] with SC/ST/OBC/EWS/PwD chips. (4) Thin-content PDF fallback block for jobs without rich descriptions. (5) JSON-LD structured data & canonical tags added to /results/[slug], /admit-cards/[slug], /answer-keys/[slug]. (6) Created /schemes/[slug] syllabus detail page + linked from /schemes listing via /api/notifications. Build: PASSED (45 routes). |
| 20      | 2026-09-12 | Feedback DB Persistence: (1) Created `feedback` table in PostgreSQL with migration `packages/db/migrations/007_feedback_table.sql` (reference_id, category, subject, description, organization, source_url, name, contact, rating, status, metadata, timestamps). (2) Updated `apps/web/src/app/api/feedback/route.js` to insert directly into PostgreSQL `feedback` table via `lib/pgdb.js` `query()`. (3) Sanitized and escaped `DB_PASSWORD` in `.env` and `.env.local` (`\$` escaping for `@next/env` / `dotenv-expand` parser) and added `.trim()` in `lib/pgdb.js`. (4) Validated build (45 routes, 0 errors) and verified live submissions insert and retrieve cleanly from PostgreSQL table. |

---

## Design Rules (Quick Reference)

Colors: --primary #EA580C (saffron) + --surface #FFFBF5 (ivory)
Fonts: Outfit (headings) + Inter (body)
CSS: Vanilla CSS + CSS Modules only — NO Tailwind
Links: NEVER use '#' as href — use null and conditionally render
External links: ALWAYS target="_blank" rel="noopener noreferrer"
PDF fallback chain: notification_pdf || application_links.notification_pdf || source_url || null
ai_extracted_data access: const ai = en.ai_extracted_data || {}

---

## UPDATE THIS FILE every session end

Format to add to Session Log:
  | 12 | 2026-09-XX | Brief description of what was done |

Format for Pending Tasks — move done items to session log, add new items.
