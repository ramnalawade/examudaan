# ExamUdaan — Architecture Document
# Agent: Architecture Agent | Status: DONE ✅

## Overview
ExamUdaan is a monorepo with two main apps:
1. `apps/web`     → Next.js 14 frontend
2. `apps/scraper` → Python Scrapy data collector

---

## Folder Structure

```
examudaan/
│
├── apps/
│   │
│   ├── web/                          ← Next.js 14 Frontend
│   │   ├── src/
│   │   │   ├── app/                  ← App Router pages
│   │   │   │   ├── layout.js         ← Root layout (navbar, footer)
│   │   │   │   ├── page.js           ← Homepage /
│   │   │   │   ├── jobs/
│   │   │   │   │   ├── page.js       ← /jobs listing
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.js   ← /jobs/ssc-cgl-2024
│   │   │   │   ├── results/
│   │   │   │   │   └── page.js       ← /results
│   │   │   │   ├── admit-cards/
│   │   │   │   │   └── page.js       ← /admit-cards
│   │   │   │   └── api/
│   │   │   │       ├── posts/
│   │   │   │       │   └── route.js  ← GET /api/posts (list + filter)
│   │   │   │       └── alerts/
│   │   │   │           └── route.js  ← POST /api/alerts (subscribe)
│   │   │   │
│   │   │   ├── components/           ← Reusable UI components
│   │   │   │   ├── Navbar.js
│   │   │   │   ├── Ticker.js         ← Live updates scrolling bar
│   │   │   │   ├── JobCard.js
│   │   │   │   ├── FilterChips.js
│   │   │   │   ├── SearchBar.js
│   │   │   │   ├── StatsRow.js
│   │   │   │   ├── KeyDetails.js     ← 6-box stat row on detail page
│   │   │   │   ├── VacancyTable.js
│   │   │   │   ├── ImportantDates.js ← Timeline component
│   │   │   │   ├── Sidebar.js        ← Right sidebar on detail page
│   │   │   │   └── Footer.js
│   │   │   │
│   │   │   ├── styles/               ← CSS files (no Tailwind)
│   │   │   │   ├── globals.css       ← CSS variables + resets
│   │   │   │   ├── navbar.module.css
│   │   │   │   ├── card.module.css
│   │   │   │   ├── filter.module.css
│   │   │   │   └── detail.module.css
│   │   │   │
│   │   │   └── lib/                  ← Utility functions
│   │   │       ├── supabase.js       ← Supabase client setup
│   │   │       ├── getPosts.js       ← Fetch posts from DB
│   │   │       └── formatDate.js     ← Date formatting helpers
│   │   │
│   │   ├── public/
│   │   │   └── fonts/
│   │   ├── next.config.js
│   │   └── package.json
│   │
│   └── scraper/                      ← Python Scrapy
│       ├── scrapy.cfg
│       ├── requirements.txt
│       ├── settings.py               ← Scrapy global settings
│       ├── pipelines.py              ← Save to Supabase
│       ├── middlewares.py            ← Rate limiting, user-agent
│       ├── items.py                  ← Data shape definition
│       ├── spiders/
│       │   ├── upsc_spider.py        ← UPSC scraper
│       │   ├── ssc_spider.py         ← SSC scraper
│       │   ├── rrb_spider.py         ← Railways scraper
│       │   └── ibps_spider.py        ← Banking scraper
│       └── utils/
│           ├── dedup.py              ← Hash-based deduplication
│           └── notify.py            ← Trigger alerts on new items
│
├── packages/
│   └── db/
│       └── migrations/
│           └── 001_init.sql          ← Full DB schema
│
├── .agents/
│   └── skills/
│       ├── designer-agent/SKILL.md   ← Design memory (LOCKED)
│       ├── dba-agent/SKILL.md
│       └── scraper-agent/SKILL.md
│
├── .github/
│   └── workflows/
│       ├── scraper.yml               ← Runs every 30 min
│       └── deploy.yml                ← Auto-deploy on push
│
├── MEMORY.md                         ← Project memory (READ FIRST)
└── task.md                           ← Agent task tracker
```

---

## API Routes

### GET /api/posts
```
Query params:
  type=job|result|admit-card|answer-key
  board=upsc|ssc|rrb|ibps|nta|state-psc
  state=up|bihar|rajasthan|mp|...
  qualification=10th|12th|graduate|pg
  sort=latest|closing-soon|most-vacancies
  page=1
  limit=12

Response: { posts: [...], total: 1247, page: 1, pages: 104 }
```

### GET /api/posts/[slug]
```
Returns single post with full details
Response: { post: { ...all fields } }
```

### POST /api/alerts
```
Body: { email, phone, whatsapp, plan, filters }
Response: { success: true, subscription_id: "..." }
```

---

## Data Flow

```
Government Website
      ↓
  Scrapy Spider (every 30 min via GitHub Actions)
      ↓
  pipelines.py → dedup.py (check if already exists)
      ↓ (if new)
  Supabase PostgreSQL (insert post)
      ↓
  notify.py → Trigger alert for subscribers
      ↓
  Resend (email) + AiSensy (WhatsApp) + MSG91 (SMS)

Frontend:
  User visits examudaan.in
      ↓
  Next.js fetches from Supabase directly (server components)
      ↓
  Page renders with ISR (revalidates every 5 min)
```

---

## Key Decisions

1. **Server Components** — pages fetch data on server, no client-side API calls for content
2. **ISR (revalidate: 300)** — pages auto-refresh every 5 minutes
3. **CSS Modules** — one .module.css per component, no global styles except variables
4. **No ORM** — direct Supabase JS client, keeps queries simple and readable
5. **Scrapy over requests** — built-in throttling, pipelines, middleware support
6. **GitHub Actions** — free cron, no extra server needed for scheduler
