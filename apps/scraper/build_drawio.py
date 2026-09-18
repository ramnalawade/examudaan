"""
build_drawio.py — Generates a comprehensive, professional draw.io XML diagram
for ExamUdaan.in full system architecture, scraper pipeline, DB schema, and publishing flow.
"""

import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom

def create_drawio():
    mxfile = ET.Element('mxfile', host='app.diagrams.net', version='21.0.0', type='device')
    diag = ET.SubElement(mxfile, 'diagram', id='examudaan-architecture-v1', name='ExamUdaan Architecture & Data Flow')
    model = ET.SubElement(diag, 'mxGraphModel', dx='2200', dy='1400', grid='1', gridSize='10', guides='1', tooltips='1', connect='1', arrows='1', fold='1', page='1', pageScale='1', pageWidth='2400', pageHeight='1800', background='#F8FAFC')
    root = ET.SubElement(model, 'root')

    ET.SubElement(root, 'mxCell', id='0')
    ET.SubElement(root, 'mxCell', id='1', parent='0')

    node_id = 100

    def add_cell(label, x, y, w, h, style, parent='1'):
        nonlocal node_id
        cid = str(node_id)
        node_id += 1
        cell = ET.SubElement(root, 'mxCell', id=cid, value=label, style=style, vertex='1', parent=parent)
        geo = ET.SubElement(cell, 'mxGeometry', x=str(x), y=str(y), width=str(w), height=str(h))
        geo.set('as', 'geometry')
        return cid

    def add_edge(source_id, target_id, label='', style=''):
        nonlocal node_id
        eid = str(node_id)
        node_id += 1
        edge = ET.SubElement(root, 'mxCell', id=eid, value=label, style=style, edge='1', parent='1', source=source_id, target=target_id)
        geo = ET.SubElement(edge, 'mxGeometry', relative='1')
        geo.set('as', 'geometry')
        return eid

    # Header Title Banner
    header_style = "rounded=1;whiteSpace=wrap;html=1;fillColor=#EA580C;strokeColor=#C2410C;fontColor=#FFFFFF;fontSize=22;fontStyle=1;align=center;shadow=1;"
    add_cell("ExamUdaan.in — End-to-End System Architecture & Data Pipeline", 80, 30, 2240, 60, header_style)

    # Subtitle
    sub_style = "text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=13;fontColor=#64748B;"
    add_cell("Comprehensive Architecture: 34+ Government Portals Crawl → Scrapy Engine & Deduplication → Multi-LLM Extraction (Gemini) → Marathi Translation → PostgreSQL → Next.js 14 Frontend Publishing", 80, 95, 2240, 25, sub_style)

    # -------------------------------------------------------------
    # SECTION 1: TARGET GOVERNMENT SITES (LEFT COLUMN: x=80, w=420)
    # -------------------------------------------------------------
    sec1_box = "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF7ED;strokeColor=#FDBA74;fontColor=#9A3412;fontSize=16;fontStyle=1;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;shadow=1;"
    add_cell("1. GOVERNMENT PORTALS & DATA SOURCES (Frequency: 6 Hours)", 80, 140, 430, 1580, sec1_box)

    item_src_style = "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;fontColor=#1E293B;fontSize=11;align=left;spacingLeft=10;shadow=0;"

    c1 = add_cell(
        "<b>🏛️ CENTRAL GOVERNMENT PORTALS</b><br/>"
        "• <b>SSC</b> (ssc.gov.in) — Staff Selection (CGL, CHSL, MTS)<br/>"
        "• <b>UPSC</b> (upsc.gov.in) — Civil Services, NDA, CDS, CMS<br/>"
        "• <b>RRB</b> (indianrailways.gov.in + 21 Regional Boards)<br/>"
        "• <b>IBPS</b> (ibps.in) — PO, Clerk, SO, RRB Banks<br/>"
        "• <b>SBI</b> (sbi.co.in/careers) — Probationary & Clerical<br/>"
        "• <b>NTA</b> (nta.ac.in) — National Testing Agency Exams<br/>"
        "• <b>BPSC</b> (bpsc.bih.nic.in) — State Combined Exam<br/>"
        "• <b>Employment News</b> (employmentnews.gov.in)<br/>"
        "<i>Crawl Frequency: Every 6 Hours | Data: Jobs, Results, Keys</i>",
        100, 190, 390, 150, item_src_style
    )

    c2 = add_cell(
        "<b>🏢 MAHARASHTRA STATE & MUNICIPAL</b><br/>"
        "• <b>MPSC</b> (mpsc.gov.in) — Crawl4AI Headless Browser<br/>"
        "• <b>Maharashtra Police</b> (mahapolice.gov.in)<br/>"
        "• <b>Mumbai Police</b> (mumbaipolice.gov.in)<br/>"
        "• <b>Thane Police</b> (thanepolice.gov.in)<br/>"
        "• <b>BMC</b> (mcgm.gov.in) — Brihanmumbai Municipal Corp<br/>"
        "• <b>PMC</b> (pmc.gov.in) — Pune Municipal Corporation<br/>"
        "• <b>TMC</b> (thanecity.gov.in) — Thane Municipal Corp<br/>"
        "• <b>SRPF</b> (maharashtrasrpf.gov.in) — State Reserve Police<br/>"
        "• <b>Maharashtra Prisons</b> (mahaprison.gov.in)<br/>"
        "<i>Crawl Frequency: Every 6 Hours | Language: Marathi + English</i>",
        100, 360, 390, 170, item_src_style
    )

    c3 = add_cell(
        "<b>🔬 RESEARCH INSTITUTES & AUTONOMOUS</b><br/>"
        "• <b>ACTREC</b> (actrec.gov.in) — Cancer Research<br/>"
        "• <b>AIIMS Nagpur</b> (aiimsnagpur.edu.in)<br/>"
        "• <b>CSIR-NEERI</b> (neeri.res.in) — Environmental Engg<br/>"
        "• <b>IIPS Mumbai</b> (iipsindia.ac.in) — Population Sciences<br/>"
        "• <b>IISER Pune</b> (iiserpune.ac.in) — Science Education<br/>"
        "• <b>ICT Mumbai</b> (ictmumbai.edu.in) — Chemical Tech<br/>"
        "• <b>ICAR-CIRCOT</b> (circot.icar.gov.in) — Cotton Research<br/>"
        "• <b>ICAR-NBSS&LUP</b> (nbsslup.icar.gov.in) — Soil Survey<br/>"
        "• <b>PDKV Akola</b> (pdkv.ac.in) — Agricultural University",
        100, 550, 390, 170, item_src_style
    )

    c4 = add_cell(
        "<b>🚆 PSUs, DEFENCE & MULTI-PORTAL</b><br/>"
        "• <b>Konkan Railway</b> (konkanrailway.com)<br/>"
        "• <b>MECL</b> (mecl.co.in) — Mineral Exploration Corp<br/>"
        "• <b>MOIL</b> (moil.nic.in) — Manganese Ore India Ltd<br/>"
        "• <b>Multi-Govt Aggregator</b> (multi_govt_spider.py)<br/>"
        "  - National Career Service (ncs.gov.in)<br/>"
        "  - Digital India Opportunities<br/>"
        "• <b>General Aggregator</b> (aggregator_spider.py)",
        100, 740, 390, 150, item_src_style
    )

    c5 = add_cell(
        "<b>📦 DATA TYPES EXTRACTED AT SOURCE</b><br/>"
        "1. <b>Recruitment / Bharti</b> (PDF ads, online forms, walk-ins)<br/>"
        "2. <b>Exam Results</b> (merit lists, cutoff marks, selection lists)<br/>"
        "3. <b>Admit Cards / Hall Tickets</b> (exam city, call letters)<br/>"
        "4. <b>Answer Keys</b> (provisional, final, OMR response sheets)<br/>"
        "5. <b>Syllabus & Exam Pattern</b> (curriculum, schemes)<br/>"
        "6. <b>Corrigendums</b> (date extensions, vacancy revisions)",
        100, 910, 390, 130, item_src_style
    )

    # -------------------------------------------------------------
    # SECTION 2: SCRAPY INGESTION ENGINE (COL 2: x=540, w=440)
    # -------------------------------------------------------------
    sec2_box = "rounded=1;whiteSpace=wrap;html=1;fillColor=#F0FDF4;strokeColor=#86EFAC;fontColor=#166534;fontSize=16;fontStyle=1;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;shadow=1;"
    add_cell("2. SCRAPY CRAWLER & PROCESSING PIPELINE", 540, 140, 440, 1580, sec2_box)

    engine_node = add_cell(
        "<b>⚙️ Scrapy Engine Orchestrator</b><br/>"
        "• File: <code>apps/scraper/run_scraper.py</code><br/>"
        "• Cron: <code>cron_6h.sh</code> (Runs every 6 hours IST)<br/>"
        "• Stack: Python 3.12, Scrapy 2.11, Crawl4AI, BeautifulSoup4<br/>"
        "• Concurrency & Random User-Agent Rotating Middleware",
        560, 190, 400, 90,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=#22C55E;fontColor=#14532D;fontSize=11;align=left;spacingLeft=10;"
    )

    dedup_node = add_cell(
        "<b>🛡️ Deduplication Engine (Two-Tier Protection)</b><br/>"
        "1. <b>Spider Level (<code>DuplicateStopMixin</code>)</b>:<br/>"
        "   - Checks SHA256 hash & source_url before crawl<br/>"
        "   - <b>Early Exit: 2 consecutive duplicates -> CloseSpider</b><br/>"
        "2. <b>Pipeline Level (<code>DeduplicationPipeline</code> — Pri 10)</b>:<br/>"
        "   - Preloads all known URLs & hashes from Postgres<br/>"
        "   - Drops already crawled items via <code>DropItem</code><br/>"
        "   - Stops spider if 2 duplicates reached (fail-safe)",
        560, 310, 400, 140,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF9C3;strokeColor=#EAB308;fontColor=#713F12;fontSize=11;align=left;spacingLeft=10;"
    )

    llm_node = add_cell(
        "<b>🧠 Gemini PDF Extraction Pipeline (Priority 50)</b><br/>"
        "• File: <code>GeminiExtractionPipeline</code> in <code>pipelines.py</code><br/>"
        "• Downloads official Gov notification PDF directly<br/>"
        "• Multi-LLM Router with API Key Rotation:<br/>"
        "   1. <b>Google Gemini 2.5 Flash</b> (Native PDF parsing)<br/>"
        "   2. <b>DeepSeek-V3</b> (OpenAI API compatibility fallback)<br/>"
        "   3. <b>Groq LLaMA 3.3 70B</b> (Ultra-fast text extraction)<br/>"
        "• <b>Promoted Filter Columns Extracted</b>:<br/>"
        "   - <code>total_vacancies</code>, <code>salary_min</code>, <code>salary_max</code><br/>"
        "   - <code>max_age_limit</code>, <code>min_experience_years</code><br/>"
        "   - <code>is_walk_in</code>, <code>education_levels</code>, <code>exam_cities</code>",
        560, 480, 400, 180,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#E0E7FF;strokeColor=#6366F1;fontColor=#312E81;fontSize=11;align=left;spacingLeft=10;"
    )

    translate_node = add_cell(
        "<b>🌐 Automatic Marathi Translation Pipeline</b><br/>"
        "• File: <code>translate_to_marathi.py</code> (Hooked in <code>run_scraper.py</code>)<br/>"
        "• Executes automatically right after spiders finish<br/>"
        "• <b>Batch Processing</b>: 10 items per Gemini prompt (90% quota saved)<br/>"
        "• Outputs structured Pydantic model:<br/>"
        "   - <code>title_mr</code>: Authentic Marathi headline<br/>"
        "   - <code>summary_mr</code>: 2-3 sentence Marathi job overview<br/>"
        "   - <code>qualifications_mr</code>: Translated degrees/eligibility<br/>"
        "• Automatically updates PostgreSQL in atomic batches",
        560, 690, 400, 160,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFEDD5;strokeColor=#F97316;fontColor=#7C2D12;fontSize=11;align=left;spacingLeft=10;"
    )

    postgres_pipe_node = add_cell(
        "<b>💾 PostgreSQL Persistence Pipeline (Priority 200)</b><br/>"
        "• File: <code>PostgresPipeline</code> via <code>apps/scraper/db.py</code><br/>"
        "• Direct connection via <code>psycopg2-binary</code> thread pool<br/>"
        "• Resolves/Creates Organization (<code>organizations</code> table)<br/>"
        "• Logs to <code>scrape_log</code> & archives raw HTML/JSON<br/>"
        "• Atomic upsert using <code>ON CONFLICT (slug) DO UPDATE</code><br/>"
        "• Saves individual vacancy posts into <code>posts</code> table",
        560, 880, 400, 140,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#3B82F6;fontColor=#1E3A8A;fontSize=11;align=left;spacingLeft=10;"
    )

    # -------------------------------------------------------------
    # SECTION 3: DATABASE TIER (COL 3: x=1010, w=440)
    # -------------------------------------------------------------
    sec3_box = "rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#94A3B8;fontColor=#0F172A;fontSize=16;fontStyle=1;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;shadow=1;"
    add_cell("3. POSTGRESQL DATA ARCHITECTURE (test_n_new)", 1010, 140, 440, 1580, sec3_box)

    db_main_node = add_cell(
        "<b>🗄️ Main Table: exam_notifications (1,115+ rows)</b><br/>"
        "<b>Core Identity & URLs:</b><br/>"
        "• <code>id</code> (BIGSERIAL PK), <code>slug</code> (UNIQUE: e.g. ssc-514)<br/>"
        "• <code>title</code>, <code>title_mr</code> (English + Marathi)<br/>"
        "• <code>source_url</code> (Gov page), <code>notification_pdf</code> (Official PDF)<br/>"
        "• <code>notification_type</code>: recruitment | result | admit_card | answer_key | syllabus<br/>"
        "• <code>status</code>: published | closed | draft<br/>"
        "<b>Promoted Fast-Filter Columns (Indexed):</b><br/>"
        "• <code>total_vacancies</code>, <code>salary_min</code>, <code>salary_max</code><br/>"
        "• <code>max_age_limit</code>, <code>min_experience_years</code><br/>"
        "• <code>is_walk_in</code>, <code>state_slug</code>, <code>employment_type</code><br/>"
        "<b>Rich JSONB Fields:</b><br/>"
        "• <code>application_links</code>: apply_online, official_website, pdf<br/>"
        "• <code>age_limit</code>: min, max, obc_relax, sc_st_relax<br/>"
        "• <code>application_fee</code>: general, sc_st, women, note<br/>"
        "• <code>qualifications</code>, <code>qualifications_mr</code><br/>"
        "• <code>ai_extracted_data</code>: deep classification & categories<br/>"
        "• <code>seo_metadata</code>: custom meta title & description",
        1030, 190, 400, 310,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#0284C7;fontColor=#0369A1;fontSize=11;align=left;spacingLeft=10;"
    )

    db_tables_node = add_cell(
        "<b>📑 Relational & Partitioned Tables</b><br/>"
        "• <b>organizations</b>:<br/>"
        "  - <code>id</code> (UUID PK), <code>acronym</code> (UNIQUE: MPSC, SSC)<br/>"
        "  - <code>name</code>, <code>website</code>, <code>department</code>, <code>parent_org</code><br/>"
        "• <b>posts</b> (Granular Vacancies Breakdown):<br/>"
        "  - <code>id</code>, <code>notification_id</code> (FK), <code>post_name</code><br/>"
        "  - <code>total_vacancies</code>, <code>qualification</code>, <code>pay_scale</code><br/>"
        "• <b>scrape_sources</b>:<br/>"
        "  - Source registry, base_url, is_official<br/>"
        "• <b>raw_scraped_data</b> (Audit Trail):<br/>"
        "  - Range-partitioned monthly by <code>scraped_at</code><br/>"
        "  - Stores raw HTML snapshot + parsed JSON payload<br/>"
        "• <b>scrape_log</b>:<br/>"
        "  - Execution audit: started_at, records_added, updated, errors",
        1030, 530, 400, 240,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;fontColor=#334155;fontSize=11;align=left;spacingLeft=10;"
    )

    db_access_node = add_cell(
        "<b>⚡ Database Access Layer (Frontend & Scraper)</b><br/>"
        "• <b>Next.js Backend (<code>lib/pgdb.js</code>)</b>:<br/>"
        "  - Native <code>pg</code> connection pool (1-20 connections)<br/>"
        "  - Parameterized queries: <code>query(sql, params)</code><br/>"
        "  - Single row query: <code>queryOne(sql, params)</code><br/>"
        "  - Zero ORM overhead, sub-millisecond query execution<br/>"
        "• <b>Scraper Backend (<code>apps/scraper/db.py</code>)</b>:<br/>"
        "  - <code>psycopg2-binary</code> with connection pooling<br/>"
        "  - Direct URL bypass for transactional batch bulk loading",
        1030, 800, 400, 160,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF2F2;strokeColor=#EF4444;fontColor=#991B1B;fontSize=11;align=left;spacingLeft=10;"
    )

    # -------------------------------------------------------------
    # SECTION 4: PUBLISHING & FRONTEND TIER (COL 4: x=1480, w=440)
    # -------------------------------------------------------------
    sec4_box = "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFBEB;strokeColor=#FDE68A;fontColor=#92400E;fontSize=16;fontStyle=1;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;shadow=1;"
    add_cell("4. PUBLISHING ENGINE — NEXT.JS 14 APP ROUTER", 1480, 140, 440, 1580, sec4_box)

    api_node = add_cell(
        "<b>🌐 Unified Notification API (<code>/api/notifications</code>)</b><br/>"
        "• Central endpoint serving all listing views & filters<br/>"
        "• <b>URL Type Mapping</b>:<br/>"
        "   - <code>?type=job</code> → <code>recruitment</code><br/>"
        "   - <code>?type=result</code> → <code>result</code><br/>"
        "   - <code>?type=admit-card</code> → <code>admit_card</code><br/>"
        "   - <code>?type=answer-key</code> → <code>answer_key</code><br/>"
        "   - <code>?type=syllabus</code> → <code>syllabus</code><br/>"
        "• Dynamic SQL filtering: organization, education, walk-in, state",
        1500, 190, 400, 150,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;fontColor=#78350F;fontSize=11;align=left;spacingLeft=10;"
    )

    pages_node = add_cell(
        "<b>📱 Public Web Pages & Routing Structure</b><br/>"
        "• <b>Redesigned Homepage (<code>/</code>)</b>:<br/>"
        "  - Interactive <b>AiMatcher.js</b> (live qualification/age/category filter)<br/>"
        "  - Urgent Walk-in Interviews Spotlight Carousel<br/>"
        "  - Live ticker feeds: Latest Results & Admit Cards<br/>"
        "• <b>Dedicated Section Listings (<code>ListingPage.js</code>)</b>:<br/>"
        "  - <code>/jobs</code> → Government Recruitment & Vacancies<br/>"
        "  - <code>/results</code> → Selection Lists, Cutoffs & Merit Lists<br/>"
        "  - <code>/admit-cards</code> → Hall Tickets & Call Letters<br/>"
        "  - <code>/answer-keys</code> → Official Keys & OMR Sheets<br/>"
        "• <b>Rich Detail Pages</b>:<br/>"
        "  - <code>/jobs/[slug]</code>, <code>/results/[slug]</code>, etc.<br/>"
        "  - Slug ID pattern: <code>{org}-{id}</code> (e.g. <code>mpsc-514</code>)<br/>"
        "• <b>Legal & Compliance</b>:<br/>"
        "  - <code>/about</code>, <code>/terms</code>, <code>/privacy</code> (DPDP Act), <code>/feedback</code>",
        1500, 360, 400, 240,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#F59E0B;fontColor=#B45309;fontSize=11;align=left;spacingLeft=10;"
    )

    bilingual_node = add_cell(
        "<b>🇮🇳 Reactive Bilingual System (English ↔ Marathi)</b><br/>"
        "• Global <code>LanguageContext.js</code> with Cookie & LocalStorage sync<br/>"
        "• <b>Instant Client Switching (Zero Page Reload)</b>:<br/>"
        "  - Reads <code>title_mr</code>, <code>summary_mr</code>, <code>qualifications_mr</code><br/>"
        "  - Fallback to English seamlessly if Marathi field is null<br/>"
        "  - <code>&lt;T&gt;</code> component translates static labels, tabs & filters<br/>"
        "  - <code>JobDetailTitle.js</code> updates headings & breadcrumbs",
        1500, 630, 400, 140,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFEDD5;strokeColor=#EA580C;fontColor=#9A3412;fontSize=11;align=left;spacingLeft=10;"
    )

    seo_node = add_cell(
        "<b>🚀 SEO, Mobile UX & Design System</b><br/>"
        "• <b>Design System</b>: Warm Ivory (#FFFBF5) + Deep Saffron (#EA580C)<br/>"
        "• <b>Typography</b>: Outfit (Headings) + Inter (Body)<br/>"
        "• <b>Mobile Responsive</b>: Dynamic slide-in filter drawer + Bottom Nav<br/>"
        "• <b>Automated SEO</b>: Dynamic Meta titles, schema.org JobPosting LD+JSON, OpenGraph tags, canonical tags",
        1500, 800, 400, 130,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#ECFDF5;strokeColor=#10B981;fontColor=#065F46;fontSize=11;align=left;spacingLeft=10;"
    )

    # -------------------------------------------------------------
    # SECTION 5: 3RD PARTY APIS & CLOUD SERVICES (COL 5: x=1950, w=370)
    # -------------------------------------------------------------
    sec5_box = "rounded=1;whiteSpace=wrap;html=1;fillColor=#FAF5FF;strokeColor=#D8B4FE;fontColor=#6B21A8;fontSize=16;fontStyle=1;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;shadow=1;"
    add_cell("5. THIRD-PARTY APIS & EXTERNAL SERVICES", 1950, 140, 370, 1580, sec5_box)

    api1 = add_cell(
        "<b>🤖 Google Gemini AI API</b><br/>"
        "• Model: <code>gemini-2.5-flash</code> / <code>flash-lite</code><br/>"
        "• Role 1: Native Gov PDF extraction (salary, quals, dates)<br/>"
        "• Role 2: Marathi structured translation batches<br/>"
        "• Role 3: Deep classification into job categories<br/>"
        "• Multi-key automated rotation on HTTP 429",
        1970, 190, 330, 140,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#A855F7;fontColor=#581C87;fontSize=11;align=left;spacingLeft=10;"
    )

    api2 = add_cell(
        "<b>🔀 Fallback LLM APIs</b><br/>"
        "• <b>DeepSeek API</b> (<code>deepseek-chat</code>)<br/>"
        "  - Fallback when Gemini quota exhausted<br/>"
        "• <b>Groq Cloud API</b> (<code>llama-3.3-70b-versatile</code>)<br/>"
        "  - Sub-second text extraction fallback",
        1970, 350, 330, 110,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#8B5CF6;fontColor=#4C1D95;fontSize=11;align=left;spacingLeft=10;"
    )

    api3 = add_cell(
        "<b>✉️ Brevo SMTP API (Sendinblue)</b><br/>"
        "• Endpoint: <code>https://api.brevo.com/v3/smtp/email</code><br/>"
        "• Scraper Run Summaries: Sent to admin every 6h<br/>"
        "• Alert emails on spider failures or crawler crashes<br/>"
        "• User exam alert notifications (Phase 2)",
        1970, 480, 330, 110,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#3B82F6;fontColor=#1D4ED8;fontSize=11;align=left;spacingLeft=10;"
    )

    api4 = add_cell(
        "<b>💳 Razorpay Payments API</b><br/>"
        "• Webhook & Order creation APIs<br/>"
        "• Paid Aspirant Subscription Plans:<br/>"
        "  - ₹29/mo (Basic WhatsApp alerts)<br/>"
        "  - ₹49/mo (Standard SMS + Email + PDF)<br/>"
        "  - ₹99/mo (VIP Pro personalized alerts)",
        1970, 610, 330, 120,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#059669;fontColor=#064E3B;fontSize=11;align=left;spacingLeft=10;"
    )

    api5 = add_cell(
        "<b>💬 WhatsApp & SMS Gateways (Planned)</b><br/>"
        "• <b>AiSensy / Gupshup WhatsApp Business API</b><br/>"
        "• <b>MSG91 / Fast2SMS</b> for OTP verification<br/>"
        "• Instant hall ticket & deadline push alerts",
        1970, 750, 330, 100,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#10B981;fontColor=#065F46;fontSize=11;align=left;spacingLeft=10;"
    )

    api6 = add_cell(
        "<b>☁️ Hosting & Cloud Infrastructure</b><br/>"
        "• <b>Frontend</b>: Vercel Serverless Edge (App Router)<br/>"
        "• <b>Database</b>: Managed PostgreSQL (Direct PgBouncer pool)<br/>"
        "• <b>Scraper Runner</b>: Linux VM / Task Scheduler (6-hour cron)<br/>"
        "• <b>Search</b>: Typesense / Postgres Full-Text Search",
        1970, 870, 330, 110,
        "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;fontColor=#334155;fontSize=11;align=left;spacingLeft=10;"
    )

    # -------------------------------------------------------------
    # CONNECTING EDGES (Arrows with styles)
    # -------------------------------------------------------------
    edge_style = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#F97316;"
    edge_blue = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#2563EB;"
    edge_purple = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#9333EA;"

    add_edge(c1, engine_node, "HTML/PDF crawl", edge_style)
    add_edge(c2, engine_node, "HTML/JS render", edge_style)
    add_edge(engine_node, dedup_node, "Items yielded", edge_style)
    add_edge(dedup_node, llm_node, "New items only", edge_style)
    add_edge(llm_node, api1, "PDF Prompt", edge_purple)
    add_edge(llm_node, translate_node, "Enriched item", edge_style)
    add_edge(translate_node, api1, "Batch=10 JSON", edge_purple)
    add_edge(translate_node, postgres_pipe_node, "Translated item", edge_style)
    add_edge(postgres_pipe_node, db_main_node, "Upsert (slug)", edge_blue)
    add_edge(db_main_node, db_access_node, "Query lib/pgdb.js", edge_blue)
    add_edge(db_access_node, api_node, "Clean JSON", edge_blue)
    add_edge(api_node, pages_node, "Hydration", edge_blue)
    add_edge(pages_node, bilingual_node, "Lang switch", edge_style)
    add_edge(engine_node, api3, "Crawl summary", edge_purple)

    # Write out XML
    xml_str = ET.tostring(mxfile, encoding='utf-8')
    pretty_xml = minidom.parseString(xml_str).toprettyxml(indent='  ')
    return pretty_xml

if __name__ == '__main__':
    content = create_drawio()
    with open('examudaan_architecture.drawio', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Generated examudaan_architecture.drawio successfully!')
