"""
build_executive_drawio.py — Generates an Executive Enterprise Architecture Diagram
for ExamUdaan.in matching the executive enterprise layout (AIDO reference model).
"""

import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom

def build_executive_architecture():
    mxfile = ET.Element('mxfile', host='app.diagrams.net', version='21.0.0', type='device')
    diag = ET.SubElement(mxfile, 'diagram', id='examudaan-exec-arch-v2', name='ExamUdaan Executive Architecture')
    model = ET.SubElement(diag, 'mxGraphModel', dx='2400', dy='1600', grid='1', gridSize='10', guides='1', tooltips='1', connect='1', arrows='1', fold='1', page='1', pageScale='1', pageWidth='2250', pageHeight='1250', background='#F8FAFC')
    root = ET.SubElement(model, 'root')

    ET.SubElement(root, 'mxCell', id='0')
    ET.SubElement(root, 'mxCell', id='1', parent='0')

    node_counter = 100

    def add_box(label, x, y, w, h, style):
        nonlocal node_counter
        cid = str(node_counter)
        node_counter += 1
        cell = ET.SubElement(root, 'mxCell', id=cid, value=label, style=style, vertex='1', parent='1')
        geo = ET.SubElement(cell, 'mxGeometry', x=str(x), y=str(y), width=str(w), height=str(h))
        geo.set('as', 'geometry')
        return cid

    def add_connector(src, tgt, label='', style=''):
        nonlocal node_counter
        eid = str(node_counter)
        node_counter += 1
        edge = ET.SubElement(root, 'mxCell', id=eid, value=label, style=style, edge='1', parent='1', source=src, target=tgt)
        geo = ET.SubElement(edge, 'mxGeometry', relative='1')
        geo.set('as', 'geometry')
        return eid

    # =========================================================================
    # STYLES REPOSITORY (Sleek Executive Palette)
    # =========================================================================
    st_title = "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=22;fontStyle=1;fontColor=#0F172A;"
    st_subtitle = "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=13;fontColor=#64748B;fontStyle=2;"
    
    st_group_box = "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;fontColor=#1E293B;fontSize=11;fontStyle=1;verticalAlign=top;align=left;spacingLeft=12;spacingTop=8;shadow=0;"
    st_channel_item = "rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#E2E8F0;fontColor=#0F172A;fontSize=10;align=center;shadow=0;"
    
    st_sec_card = "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#E2E8F0;fontColor=#1E293B;fontSize=10;align=center;shadow=0;"
    
    # Layer badges
    st_badge_api    = "rounded=1;whiteSpace=wrap;html=1;fillColor=#3B82F6;strokeColor=#2563EB;fontColor=#FFFFFF;fontSize=11;fontStyle=1;align=center;"
    st_badge_scrape = "rounded=1;whiteSpace=wrap;html=1;fillColor=#8B5CF6;strokeColor=#7C3AED;fontColor=#FFFFFF;fontSize=11;fontStyle=1;align=center;"
    st_badge_ai     = "rounded=1;whiteSpace=wrap;html=1;fillColor=#10B981;strokeColor=#059669;fontColor=#FFFFFF;fontSize=11;fontStyle=1;align=center;"
    st_badge_data   = "rounded=1;whiteSpace=wrap;html=1;fillColor=#F59E0B;strokeColor=#D97706;fontColor=#FFFFFF;fontSize=11;fontStyle=1;align=center;"
    st_badge_pub    = "rounded=1;whiteSpace=wrap;html=1;fillColor=#06B6D4;strokeColor=#0891B2;fontColor=#FFFFFF;fontSize=11;fontStyle=1;align=center;"
    st_badge_alert  = "rounded=1;whiteSpace=wrap;html=1;fillColor=#EC4899;strokeColor=#DB2777;fontColor=#FFFFFF;fontSize=11;fontStyle=1;align=center;"

    st_layer_body = "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#E2E8F0;fontColor=#334155;fontSize=10;align=left;spacingLeft=12;shadow=0;"
    st_layer_desc = "rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#E2E8F0;fontColor=#0F172A;fontSize=10;align=left;spacingLeft=10;shadow=0;"

    # Vendor & Framework pills
    st_vendor_box = "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;fontColor=#0F172A;fontSize=10;align=left;spacingLeft=12;shadow=0;"
    st_pill = "rounded=1;whiteSpace=wrap;html=1;fillColor=#F1F5F9;strokeColor=#CBD5E1;fontColor=#334155;fontSize=9;align=center;"

    # Infrastructure cards
    st_cloud_bg = "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;verticalAlign=top;align=left;spacingLeft=12;spacingTop=8;fontColor=#0F172A;fontSize=11;fontStyle=1;"
    st_infra_node = "rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#E2E8F0;fontColor=#0F172A;fontSize=10;align=center;"

    # Observability cards
    st_obs_card = "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;fontColor=#1E293B;fontSize=9;align=left;spacingLeft=10;verticalAlign=top;spacingTop=6;"

    # =========================================================================
    # 1. HEADER SECTION
    # =========================================================================
    add_box("EXAMUDAAN — GOVERNMENT EXAM & RECRUITMENT AGGREGATOR — EXECUTIVE ARCHITECTURE", 40, 20, 2170, 32, st_title)
    add_box("High-Availability Ingestion. Zero-Lag 2-Duplicate Guard. Dual-Language AI Engine (English & Marathi). Real-Time Aspirant Alerting.", 40, 52, 2170, 22, st_subtitle)

    # =========================================================================
    # 2. TOP BAR: USERS & CHANNELS (x=40, y=85, w=1560, h=95)
    # =========================================================================
    add_box("USERS & CHANNELS", 40, 85, 1560, 95, st_group_box)
    
    channels = [
        ("Aspirants / Students\n(All-India & State Jobs)", 60, 110, 195, 58),
        ("Mobile Job Seekers\n(Responsive Drawer & Nav)", 270, 110, 195, 58),
        ("Desktop Applicants\n(Sticky Sidebar Filters)", 480, 110, 195, 58),
        ("Admins & Editorial Ops\n(Feedback & Suggestion Desk)", 690, 110, 205, 58),
        ("Public Web Portals\n(Next.js 14 App Router)", 910, 110, 205, 58),
        ("Interactive AI Matcher\n(AiMatcher.js Eligibility)", 1130, 110, 215, 58),
        ("Paid Alert Subscribers\n(WhatsApp / SMS ₹29/49/99)", 1360, 110, 220, 58),
    ]
    for lbl, cx, cy, cw, ch in channels:
        add_box(lbl, cx, cy, cw, ch, st_channel_item)

    # =========================================================================
    # 3. LEFT COLUMN: SECURITY & COMPLIANCE LAYER (x=40, y=190, w=170, h=550)
    # =========================================================================
    add_box("SECURITY LAYER", 40, 190, 170, 550, st_group_box)
    sec_cards = [
        ("Data Encryption\n(In Transit TLS 1.3\n& At Rest AES-256)", 50, 220, 150, 75),
        ("IAM & Secrets\n(Rotated Gemini Keys\n& PostgreSQL .env)", 50, 305, 150, 75),
        ("Session & Auth\n(Custom JWT / lib/auth.js\nHttpOnly Cookies)", 50, 390, 150, 75),
        ("Anti-Ban / Throttling\n(Rotating User-Agents\n& Crawl Delay 1-3s)", 50, 475, 150, 75),
        ("DPDP Act 2023\n(Gov Non-Affiliation\n& User Data Consent)", 50, 560, 150, 75),
        ("Audit & Traceability\n(Monthly Partitioned\nRaw HTML & Logs)", 50, 645, 150, 80),
    ]
    for lbl, sx, sy, sw, sh in sec_cards:
        add_box(lbl, sx, sy, sw, sh, st_sec_card)

    # =========================================================================
    # 4. MIDDLE CORE STACK: 6 ENTERPRISE ARCHITECTURE LAYERS
    # x=225, w=1375
    # =========================================================================
    
    # --- LAYER 1: API & INGESTION ---
    ly1_y = 190
    add_box("API", 225, ly1_y, 65, 80, st_badge_api)
    add_box("<b>API & INGESTION GATEWAY</b><br/><font color='#64748B'>Scrapy Crawler Daemon, Scheduled Runner, Next.js REST API & Route Dispatcher</font>", 295, ly1_y, 410, 80, st_layer_body)
    add_box("<b>REST APIs</b>: <code>/api/notifications</code> (Universal filtered listing) | <code>/api/feedback</code> (Suggestions & Bug desk)<br/>"
            "<b>Ingestion Control</b>: <code>run_scraper.py</code> CLI | <code>cron_6h.sh</code> (6-hour cron scheduler) | Async Pipeline Dispatcher<br/>"
            "<b>Query Mapping</b>: <code>?type=job</code> → recruitment | <code>?type=result</code> → result | <code>?type=admit-card</code> → admit_card",
            710, ly1_y, 890, 80, st_layer_desc)

    # --- LAYER 2: SCRAPING & CRAWLING ENGINE ---
    ly2_y = 280
    add_box("SCRAPE", 225, ly2_y, 65, 85, st_badge_scrape)
    add_box("<b>SCRAPING & CRAWLING ENGINE</b><br/><font color='#64748B'>34+ Autonomous Portals, Dynamic JS Headless Crawler & 2-Tier Deduplication</font>", 295, ly2_y, 410, 85, st_layer_body)
    add_box("<b>Central Portals</b>: SSC, UPSC, RRB, IBPS, SBI, NTA, BPSC, Employment News (Every 6h)<br/>"
            "<b>Maharashtra & Municipal</b>: MPSC (Crawl4AI Headless Browser), MahaPolice, Mumbai/Thane Police, BMC, PMC, TMC, SRPF, Prisons<br/>"
            "<b>Research & PSUs</b>: ACTREC, AIIMS Nagpur, CSIR-NEERI, IIPS, IISER Pune, ICT, CIRCOT, NBSSLUP, Konkan Railway, MECL, MOIL<br/>"
            "<b>2-Tier Deduplication</b>: <code>DuplicateStopMixin</code> (Early CloseSpider after 2 dups) + <code>DeduplicationPipeline</code> (Priority 10)",
            710, ly2_y, 890, 85, st_layer_desc)

    # --- LAYER 3: AI / ML & INTELLIGENCE ---
    ly3_y = 375
    add_box("AI", 225, ly3_y, 65, 85, st_badge_ai)
    add_box("<b>AI / ML & INTELLIGENCE LAYER</b><br/><font color='#64748B'>Multi-LLM Native PDF Extraction, Pydantic Structured Output & Marathi Translation</font>", 295, ly3_y, 410, 85, st_layer_body)
    add_box("<b>Official PDF Analysis</b>: Google Gemini 2.5 Flash native PDF reader with multi-key rotation (DeepSeek-V3 & Groq fallbacks)<br/>"
            "<b>Promoted Fast-Filters</b>: Auto-extracts total vacancies, salary range (min/max), age limits, walk-in interview dates & venues<br/>"
            "<b>Deep Classification</b>: <code>ai_extracted_data</code> JSONB (Police, Engineering, Medical, Teaching, Central vs State Govt levels)<br/>"
            "<b>Automatic Marathi Engine</b>: <code>translate_to_marathi.py</code> (10-item batch Gemini calls: <code>title_mr</code>, <code>summary_mr</code>, <code>qualifications_mr</code>)",
            710, ly3_y, 890, 85, st_layer_desc)

    # --- LAYER 4: DATA & DATABASE LAYER ---
    ly4_y = 470
    add_box("DB", 225, ly4_y, 65, 80, st_badge_data)
    add_box("<b>DATA & STORAGE LAYER</b><br/><font color='#64748B'>Transactional PostgreSQL, JSONB Semi-Structured Payloads & Monthly Partitions</font>", 295, ly4_y, 410, 80, st_layer_body)
    add_box("<b>Primary Table</b>: <code>exam_notifications</code> (1,115+ rows, indexed slug, <code>ON CONFLICT (slug) DO UPDATE</code>)<br/>"
            "<b>Granular Vacancies</b>: <code>posts</code> (Per-post category, pay scale, qualifications, reservation JSONB)<br/>"
            "<b>Lookups & Registry</b>: <code>organizations</code> (Unique UPPER acronyms: MPSC, SSC) | <code>scrape_sources</code><br/>"
            "<b>Audit Vault</b>: <code>raw_scraped_data</code> (Range-partitioned monthly by <code>scraped_at</code>) | <code>scrape_log</code> execution history",
            710, ly4_y, 890, 80, st_layer_desc)

    # --- LAYER 5: PUBLISHING & BILINGUAL ENGINE ---
    ly5_y = 560
    add_box("PUB", 225, ly5_y, 65, 80, st_badge_pub)
    add_box("<b>PUBLISHING & BILINGUAL ENGINE</b><br/><font color='#64748B'>Next.js 14 App Router, Zero-Reload English ↔ Marathi Parity & Dynamic SEO</font>", 295, ly5_y, 410, 80, st_layer_body)
    add_box("<b>Universal UI Components</b>: <code>JobCard.js</code> (Bilingual title & tags) | <code>ListingPage.js</code> (Amazon-style sticky sidebar filters)<br/>"
            "<b>Interactive Tools</b>: <code>AiMatcher.js</code> (Instant qualification, category, age relaxation slider & live vacancy counter)<br/>"
            "<b>Reactive Language Engine</b>: <code>LanguageContext.js</code> (Cookie/localStorage sync, instant swap to Marathi, <code>&lt;T&gt;</code> dictionary)<br/>"
            "<b>Automated SEO</b>: Dynamic Meta titles, Canonical URLs, schema.org <code>JobPosting</code> JSON-LD for Google Jobs indexing",
            710, ly5_y, 890, 80, st_layer_desc)

    # --- LAYER 6: NOTIFICATION & SUBSCRIPTION SERVICES ---
    ly6_y = 650
    add_box("ALERT", 225, ly6_y, 65, 80, st_badge_alert)
    add_box("<b>NOTIFICATION & SUBSCRIPTION SERVICES</b><br/><font color='#64748B'>Paid Aspirant Multi-Channel Alerts, Razorpay Gateway & Admin Crawl Reports</font>", 295, ly6_y, 410, 80, st_layer_body)
    add_box("<b>Paid Aspirant Subscriptions</b>: ₹29/month (Basic WhatsApp), ₹49/month (SMS + Email + PDFs), ₹99/month (VIP Custom Alerts)<br/>"
            "<b>Payment Processing</b>: Razorpay Webhook & Orders API | Automated subscription activation & billing lifecycle<br/>"
            "<b>Scraper Health Reporting</b>: Brevo (Sendinblue) SMTP API dispatching 6-hour crawl summaries & spider crash alerts<br/>"
            "<b>Multi-Channel Push (Planned)</b>: AiSensy/Gupshup WhatsApp Business API + MSG91 / Fast2SMS for instant admit card alerts",
            710, ly6_y, 890, 80, st_layer_desc)

    # =========================================================================
    # 5. RIGHT COLUMN (UPPER): API & PIPELINE FRAMEWORK (x=1615, y=190, w=150, h=330)
    # =========================================================================
    add_box("PIPELINE FRAMEWORK", 1615, 190, 150, 330, st_group_box)
    framework_pills = [
        ("Standardized\nItem Schemas", 1625, 218, 130, 42),
        ("2-Duplicate\nEarly Exit Rule", 1625, 268, 130, 42),
        ("Gemini Multi-Key\nRotation Engine", 1625, 318, 130, 42),
        ("Rotating User-Agents\n& Proxy Middleware", 1625, 368, 130, 42),
        ("Idempotent DB Upsert\n(ON CONFLICT)", 1625, 418, 130, 42),
        ("Atomic Batch\nMarathi Updates", 1625, 468, 130, 42),
    ]
    for lbl, fx, fy, fw, fh in framework_pills:
        add_box(lbl, fx, fy, fw, fh, st_pill)

    # =========================================================================
    # 6. RIGHT COLUMN (UPPER): VENDOR & PARTNER INTEGRATIONS (x=1780, y=85, w=430, h=435)
    # =========================================================================
    add_box("VENDOR & PARTNER INTEGRATIONS", 1780, 85, 430, 435, st_group_box)
    vendors = [
        ("<b>Google Gemini AI API</b> — <code>gemini-2.5-flash</code> Native PDF parsing & Marathi translation", 1795, 115, 400, 48),
        ("<b>DeepSeek & Groq Cloud APIs</b> — LLM fallbacks for qualification extraction", 1795, 170, 400, 48),
        ("<b>Crawl4AI & Playwright</b> — Headless browser execution for JavaScript portal rendering", 1795, 225, 400, 48),
        ("<b>Brevo (Sendinblue) SMTP API</b> — Automated 6h scraper execution summary & error logs", 1795, 280, 400, 48),
        ("<b>Razorpay Payment Gateway</b> — Paid subscription checkout & recurring billing webhooks", 1795, 335, 400, 48),
        ("<b>AiSensy & MSG91</b> — WhatsApp Business & SMS OTP gateways for candidate notifications", 1795, 390, 400, 48),
        ("<b>34+ Official Government Portals</b> — SSC, UPSC, RRB, MPSC, BMC, PMC, State Police, etc.", 1795, 445, 400, 65),
    ]
    for lbl, vx, vy, vw, vh in vendors:
        add_box(lbl, vx, vy, vw, vh, st_vendor_box)

    # =========================================================================
    # 7. BOTTOM LEFT/CENTER: CLOUD INFRASTRUCTURE (x=40, y=755, w=1560, h=305)
    # =========================================================================
    add_box("CLOUD & DATA INFRASTRUCTURE (PRIMARY & VAULT RESILIENCE)", 40, 755, 1560, 305, st_group_box)
    
    # Primary Box
    add_box("PRIMARY PRODUCTION CLOUD (Active)", 60, 785, 760, 160, st_cloud_bg)
    primary_nodes = [
        ("Compute: Web\n(Next.js 14 App Router\nVercel / Node Edge)", 75, 815, 160, 65),
        ("Compute: Scraper\n(Python 3.12 VM\nrun_scraper.py / 6h Cron)", 245, 815, 165, 65),
        ("Primary Database\n(PostgreSQL 16 Engine\n10.0.2.160:5432 / test_n_new)", 420, 815, 180, 65),
        ("Headless Engine\n(Playwright / Chromium\nCrawl4AI for MPSC)", 610, 815, 190, 65),
        ("Connection Pools: <code>pg</code> (Next.js Web, 20 conns) + <code>psycopg2-binary</code> (Scrapy Pipeline)", 75, 890, 725, 45),
    ]
    for lbl, nx, ny, nw, nh in primary_nodes:
        add_box(lbl, nx, ny, nw, nh, st_infra_node)

    # Backup & Storage Vault Box
    add_box("STORAGE VAULT & DATA RESILIENCE (Audit & Dedup)", 840, 785, 740, 160, st_cloud_bg)
    vault_nodes = [
        ("Raw Scraped Archive\n(Monthly Partitioned\nraw_scraped_data_YYYY_MM)", 855, 815, 165, 65),
        ("Preloaded Dedup Sets\n(known_urls & known_hashes\nin Memory at Crawl Start)", 1030, 815, 175, 65),
        ("Database Backups\n(Daily Point-In-Time\npg_dump Vault)", 1215, 815, 165, 65),
        ("14-Day Scrape Logs\n(Rotating Execution Logs\nin apps/scraper/logs)", 1390, 815, 175, 65),
        ("Data Replication: Direct PostgreSQL connection bypassing PgBouncer for DDL & transactional safety", 855, 890, 710, 45),
    ]
    for lbl, vx, vy, vw, vh in vault_nodes:
        add_box(lbl, vx, vy, vw, vh, st_infra_node)

    # Bottom Automation Strip inside Infrastructure
    infra_strips = [
        ("Automated 6-Hour Cron Schedule\n(Linux cron_6h.sh / Windows Task Scheduler)", 60, 960, 360, 45),
        ("Two-Tier 2-Duplicate Early Stop\n(Closes spider in 1.2s if no new notices)", 435, 960, 360, 45),
        ("Automatic Post-Crawl Translation\n(Batches of 10 notifications per Gemini prompt)", 810, 960, 380, 45),
        ("Sub-Millisecond Indexed Query Lookup\n(Cached database queries via lib/pgdb.js)", 1205, 960, 375, 45),
    ]
    for lbl, sx, sy, sw, sh in infra_strips:
        add_box(lbl, sx, sy, sw, sh, st_sec_card)

    # =========================================================================
    # 8. BOTTOM RIGHT: OBSERVABILITY & RELIABILITY (x=1615, y=535, w=595, h=525)
    # =========================================================================
    add_box("OBSERVABILITY (SecOps | Ops | FinOps)", 1615, 535, 595, 525, st_group_box)
    
    add_box("<b>SECURITY & COMPLIANCE (SecOps)</b><br/>"
            "• <b>Anti-Scraping Throttling</b>: 1-3s download delays, domain-specific concurrency = 1<br/>"
            "• <b>Non-Affiliation Compliance</b>: Prominent disclaimer that ExamUdaan is a private portal<br/>"
            "• <b>External Link Integrity</b>: Official PDF links always point to gov domains with <code>rel='noopener'</code><br/>"
            "• <b>SQL Injection Prevention</b>: 100% parameterized queries in <code>pgdb.js</code> & <code>db.py</code>",
            1630, 565, 565, 110, st_obs_card)

    add_box("<b>OPERATIONS & RELIABILITY (Ops)</b><br/>"
            "• <b>Automated Crawl Logs</b>: Timestamps, duration, scraped count in <code>scraper_YYYYMMDD_HHMMSS.log</code><br/>"
            "• <b>Brevo Email Alerts</b>: Instant email summary to admin on spider success / failure<br/>"
            "• <b>Graceful Failures</b>: Spiders catch timeouts & 404s without crashing subsequent crawlers<br/>"
            "• <b>Next.js App Router Build</b>: All 43 static & dynamic routes validated (PASSED code 0)",
            1630, 690, 565, 115, st_obs_card)

    add_box("<b>COST & RESOURCE OPTIMIZATION (FinOps)</b><br/>"
            "• <b>2-Duplicate Early Exit</b>: Saves 90%+ server compute and network bandwidth per crawl<br/>"
            "• <b>Batch Gemini Translation</b>: 10 jobs per prompt cuts API costs & rate limits by 90%<br/>"
            "• <b>Skip Reprocessing</b>: Existing records with <code>title_mr IS NOT NULL</code> never re-prompted<br/>"
            "• <b>Pure Vanilla CSS</b>: Zero runtime JavaScript CSS overhead; minimal bundle size",
            1630, 820, 565, 115, st_obs_card)

    add_box("<b>KEY RELIABILITY METRICS</b>: 34+ Monitored Government Portals | 1,115+ Live Database Records | 1.19s Early-Exit Latency | 43 Next.js Routes | 2 Languages (EN/MR)",
            1630, 950, 565, 45, st_sec_card)

    # =========================================================================
    # 9. FOOTER BANNERS: KEY PRINCIPLES & LEGEND
    # =========================================================================
    st_principle = "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=10;fontColor=#475569;"
    add_box("<b>KEY PRINCIPLES:</b>   High Availability (99.9%)  •  Real-Time Ingestion (6h Cron)  •  Zero-Quota Waste Deduplication  •  Dual-Language Parity (English & Marathi)  •  Strict Gov Non-Affiliation  •  Mobile-First Responsive UX  •  Cost Optimized Multi-LLM Routing",
            40, 1075, 2170, 30, st_principle)

    st_legend = "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=10;fontColor=#64748B;"
    add_box("<b>LEGEND:</b>  ■ Ingestion Gateway (Blue)   ■ Scraping Engine (Purple)   ■ AI / ML Intelligence (Green)   ■ PostgreSQL Data (Amber)   ■ Publishing Web (Teal)   ■ Alerts & Subscriptions (Pink)   ■ Cloud Infrastructure (Slate)",
            40, 1105, 2170, 25, st_legend)

    # Write out XML
    xml_str = ET.tostring(mxfile, encoding='utf-8')
    pretty_xml = minidom.parseString(xml_str).toprettyxml(indent='  ')
    return pretty_xml

if __name__ == '__main__':
    content = build_executive_architecture()
    with open('examudaan_architecture.drawio', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Executive Enterprise drawio generated successfully!')
