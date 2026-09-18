# ExamUdaan — Project Memory
# READ THIS FIRST — then CONTINUATION.md — then SKILL.md
# Last updated: 2026-09-05 (Session 10)

## What This Project Is
ExamUdaan.in — India government exam aggregator portal.
Free content + paid WhatsApp/Email/SMS alerts = revenue model.
Target: students preparing for UPSC, SSC, RRB, IBPS, State PSCs, etc.

## Tech Stack (LOCKED — verified Session 10)

| Layer      | Technology                                                  |
|------------|-------------------------------------------------------------|
| Frontend   | Next.js 14 (App Router) — NO Pages Router                   |
| Styling    | Vanilla CSS + CSS Modules — NO Tailwind                     |
| Database   | PostgreSQL — accessed via lib/pgdb.js (query/queryOne)      |
| Scraper    | Python + Scrapy + psycopg2-binary                           |
| AI         | Gemini API (classification + AI assistant)                  |
| Auth       | Custom JWT in lib/auth.js + OTP (Resend/MSG91/AiSensy)     |
| Payments   | Razorpay (Rs 29/49/99 plans)                               |
| Search     | Typesense                                                   |
| Deploy     | Vercel (web) + server cron (scraper via cron_6h.sh)         |

NOTE: supabase.js exists but is LEGACY — use pgdb.js for all new DB code.

## Repository Structure
examudaan/
  apps/web/          -> Next.js 14 frontend (App Router)
  apps/scraper/      -> Python Scrapy scraper (37 spiders)
  .agents/skills/    -> All agent memory files (12 skill folders)
  .github/workflows/ -> CI/CD
  GEMINI.md          -> Auto-loaded project rules (routing, DB rules, design)
  CONTINUATION.md    -> Latest session handoff + pending tasks
  MEMORY.md          -> THIS FILE — persistent project identity

## Key Design Decisions
1. Code must be SIMPLE — well commented, easy to understand
2. No Tailwind — vanilla CSS + CSS Modules only
3. Scraper is separate service from Next.js
4. DB is direct PostgreSQL (pgdb.js) — not Supabase client SDK
5. All content FREE, alerts = paid (Rs 29/49/99/month)
6. All external links: target="_blank" rel="noopener noreferrer"
7. Never use '#' as href — conditionally render links with null check

## Revenue Streams
1. Alert subscriptions (primary): Rs 29 WhatsApp / Rs 49 Email+SMS / Rs 99 All
2. Google AdSense (passive)
3. Affiliate (Unacademy, Amazon books)
4. Sponsored listings (coaching institutes)

## Government Sites Scraped (37 spiders total)
Priority: UPSC, SSC, RRB, IBPS, NTA, SBI, UP PSC, Bihar PSC
Maharashtra: MPSC, BMC, PMC, TMC, Mumbai Police, Maha Police, SRPF, Prisons
Research/Edu: ICAR x2, IISER Pune, ICT Mumbai, ACTREC, CSIR-NEERI, IIPS, AIIMS Nagpur
PSU: MECL, MOIL, Konkan Railway, PDKV Akola
Aggregators: sarkarijobfind, sarkariresult, sarkariresult.co, sarkariresult.com, jobrasta, sarkaridisha
Media: Employment News, YouTube (exam keywords)

## Project Status (as of Session 10 — 2026-09-05)
Frontend: COMPLETE — 20 pages, 10 components, full API routes
Scraper:  COMPLETE — 37 spiders, Gemini classifier, cron setup
DB:       PostgreSQL schema applied via apps/scraper/migrations/
Auth:     OTP flow complete (Email + SMS + WhatsApp)
Payments: Razorpay integrated in pricing page + API routes
Pending:  Verify build, verify DB connection, some detail pages may need review

## How to Start a New Session
1. GEMINI.md auto-loads (routing tables, DB rules, design rules)
2. Read .agents/skills/examudaan-codebase/SKILL.md (full architecture + all files)
3. Read CONTINUATION.md (current status + pending tasks)
4. Then start work — do NOT scan directories or read source files blindly
