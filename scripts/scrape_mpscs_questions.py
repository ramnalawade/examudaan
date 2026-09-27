#!/usr/bin/env python3
"""
=============================================================================
ExamUdaan — Complete MPSC PYQ Question Scraper & Database Ingestion Tool
=============================================================================
Scrapes 8,648+ previous year questions (PYQs) and topic tests from mpscs.in
across all 38 MPSC exams (Rajyaseva, Group B, Group C, PSI, AMVI RTO, etc.)
in both Marathi and English.

Outputs:
  1. pyq_scraped_questions.json — Full structured bilingual question bank
  2. pyq_scraped_questions.sql  — Optimized multi-row PostgreSQL statements for DBeaver (Alt + X) or psql

Features:
  - Zero required pip dependencies (uses Python 3 standard library: urllib, json, re, html, concurrent.futures)
  - Multi-threaded worker pool (--workers 5 to 10) for 10x faster scraping (finishes in minutes, not hours)
  - Automatic sitemap discovery (8,648 question URLs directly from sitemaps 1-5)
  - Smart Subject Classifier: auto-refines generic 'General Studies' into Polity, History, Geography, Economy, Science, Marathi, English, Reasoning
  - Thread-safe checkpointing / resume support (can be stopped with Ctrl+C and resumed anytime)
  - Decodes HTML entities (&amp;, &#39;, &nbsp;, etc.)
  - Extracts Question text, 4 Options (A/B/C/D), Official Answer Key, Explanation, Subject, and Topic
  - DBeaver ready: multi-row INSERTs in batches of 50 rows (prevents syntax/buffer overflow)

Usage:
  python scripts/scrape_mpscs_questions.py                         # Scrape with 5 workers
  python scripts/scrape_mpscs_questions.py --workers 8             # High speed with 8 workers
  python scripts/scrape_mpscs_questions.py --limit 100             # Scrape first 100 questions
  python scripts/scrape_mpscs_questions.py --filter rajyaseva      # Scrape Rajyaseva questions only
  python scripts/scrape_mpscs_questions.py --filter group-b        # Scrape Group B questions only
=============================================================================
"""

import os
import sys
import re
import json
import time
import html
import urllib.request
import urllib.error
import argparse
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone

# Ensure UTF-8 stdout across all environments (Windows, Linux, macOS)
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_URL = "https://www.mpscs.in"

# Base Subject Mapping
SUBJECT_MAP = {
    "history": "History",
    "modern history": "History",
    "maharashtra history": "History",
    "ancient history": "History",
    "geography": "Geography",
    "maharashtra geography": "Geography",
    "physical geography": "Geography",
    "polity": "Polity",
    "indian polity": "Polity",
    "constitution": "Polity",
    "panchayati raj": "Polity",
    "economics": "Economy",
    "economy": "Economy",
    "indian economy": "Economy",
    "science": "Science",
    "general science": "Science",
    "physics": "Science",
    "chemistry": "Science",
    "biology": "Science",
    "aptitude": "Reasoning",
    "intellectual test": "Reasoning",
    "maths": "Reasoning",
    "reasoning": "Reasoning",
    "marathi": "Marathi",
    "marathi grammar": "Marathi",
    "english": "English",
    "english grammar": "English",
    "law": "Law",
    "human rights": "Law",
    "current affairs": "Current Affairs",
}

# Smart Subject Classification Keywords (Marathi & English)
# Used when source assigns generic "General Studies" or "General"
SUBJECT_KEYWORDS = {
    "Polity": [
        "कलम", "अनुच्छेद", "संसद", "संविधान", "लोकसभा", "राज्यसभा", "विधानसभा", "विधानपरिषद",
        "राष्ट्रपती", "राज्यपाल", "पंतप्रधान", "मूलभूत हक्क", "मार्गदर्शक तत्त्वे", "घटनादुरुस्ती",
        "उच्च न्यायालय", "सर्वोच्च न्यायालय", "निवडणूक आयोग", "ग्रामपंचायत", "पंचायत समिती",
        "जिल्हा परिषद", "article", "constitution", "parliament", "fundamental rights", "amendment",
        "governor", "president", "judiciary", "panchayat", "election commission", "ordinance"
    ],
    "History": [
        "१८५७", "सत्यशोधक", "ब्रिटिश", "काँग्रेस", "महात्मा गांधी", "लोकमान्य टिळक", "आंबेडकर",
        "शाहू महाराज", "ज्योतिराव फुले", "पेशवे", "मराठा साम्राज्य", "छत्रपती", "स्वतंत्रता",
        "चळवळ", "सत्याग्रह", "व्हाइसरॉय", "गव्हर्नर जनरल", "हडप्पा", "मौर्य", "revolt", "congress",
        "viceroy", "freedom movement", "satyagraha", "east india company", "nehru", "gokhale"
    ],
    "Geography": [
        "सह्याद्री", "पर्वत", "शिखर", "नदी", "गोदावरी", "कृष्णा", "तापी", "भीमा", "पठार",
        "मृदा", "हवामान", "पर्जन्य", "जिल्हा", "घाट", "अभयारण्य", "राष्ट्रीय उद्यान", "खनिज",
        "कोकण", "विदर्भ", "मराठवाडा", "river", "mountain", "monsoon", "plateau", "soil",
        "district", "wildlife sanctuary", "peninsula", "western ghats", "census"
    ],
    "Economy": [
        "जीडीपी", "दारिद्र्य", "बँकिंग", "आरबीआय", "रेपो रेट", "महागाई", "पंचवार्षिक योजना",
        "राजकोषीय", "कर", "जीएसटी", "शेती उत्पन्न", "बजेट", "नाबार्ड", "निती आयोग", "मुद्रा",
        "gdp", "inflation", "rbi", "repo rate", "five year plan", "budget", "fiscal deficit",
        "poverty", "taxation", "niti aayog", "nabard", "banking"
    ],
    "Science": [
        "पेशी", "जीवनसत्त्व", "जीवनसत्व", "अणू", "मूलद्रव्य", "प्रकाश", "ध्वनी", "ऊर्जा", "गती",
        "गुरुत्वाकर्षण", "रक्त", "हृदय", "रोग", "जीवाणू", "विषाणू", "बॅक्टेरिया", "प्रथिने",
        "रसायन", "भौतिकशास्त्र", "जीवशास्त्र", "cell", "vitamin", "atom", "gravity", "energy",
        "blood", "disease", "virus", "bacteria", "protein", "photosynthesis", "physics", "chemistry"
    ],
    "Marathi": [
        "प्रयोग", "समास", "समानार्थी", "विरुद्धार्थी", "वाक्प्रचार", "म्हणी", "विभक्ती", "संधी",
        "अलंकार", "वर्णविचार", "काळ", "वाक्यप्रकार", "शुद्धलेखन", "कर्तरी", "कर्मणी", "भावे",
        "तत्पुरुष", "द्विगु", "बहुव्रीही", "मराठी व्याकरण"
    ],
    "English": [
        "synonym", "antonym", "preposition", "conjunction", "passive voice", "indirect speech",
        "idiom", "phrase", "tense", "spelling", "adjective", "adverb", "singular", "plural",
        "one word substitution"
    ],
    "Reasoning": [
        "नातेसंबंध", "वय", "बैठक व्यवस्था", "दिशानिर्देश", "वेन आकृती", "अंकगणित", "नफा", "तोटा",
        "शेकडेवारी", "गुणोत्तर", "काळ व काम", "वेग", "अंतर", "सरासरी", "blood relation", "seating arrangement",
        "coding decoding", "series", "profit and loss", "percentage", "ratio", "time and work", "average"
    ]
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 ExamUdaanBot/2.0"
}

def clean_text(s):
    """Strip tags and unescape HTML entities"""
    if not s:
        return ""
    stripped = re.sub(r'<[^>]+>', ' ', s)
    # Normalize multiple whitespace
    cleaned = re.sub(r'\s+', ' ', stripped)
    return html.unescape(cleaned).strip()

def classify_subject(raw_subject, question_text, topic_text, options_dict):
    """Smart Subject Classifier: refines General Studies using keyword matching"""
    subj = SUBJECT_MAP.get(raw_subject.strip().lower())
    if subj and subj not in ("General Studies", "General"):
        return subj

    # Build corpus for analysis
    corpus = f"{question_text} {topic_text} " + " ".join(options_dict.values())
    corpus_lower = corpus.lower()

    scores = {}
    for candidate_subj, keywords in SUBJECT_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw.lower() in corpus_lower)
        if score > 0:
            scores[candidate_subj] = score

    if scores:
        best_match = max(scores.items(), key=lambda x: x[1])
        if best_match[1] >= 1:
            return best_match[0]

    return subj or "General Studies"

def fetch_url(url, retries=3, delay=0.2):
    """Fetch URL with retries and exponential backoff"""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=12) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if e.code == 429:
                wait_time = (attempt + 1) * 2.5
                time.sleep(wait_time)
            elif attempt == retries - 1:
                return None
        except Exception:
            if attempt == retries - 1:
                return None
            time.sleep(delay)
    return None

def parse_question_html(html_content):
    """Parse single question HTML page for text, options, answer key, and explanation"""
    if not html_content:
        return None

    data = {
        "question": None,
        "options": {},
        "correct": None,
        "explanation": None,
        "subject": "General Studies",
        "topic": "General"
    }

    # 1. Extract Question Text & Explanation from Schema.org QAPage JSON-LD
    json_ld_matches = re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>', html_content)
    for block in json_ld_matches:
        try:
            parsed = json.loads(block)
            graph = parsed.get("@graph", [parsed])
            for item in graph:
                if item.get("@type") == "QAPage":
                    main_ent = item.get("mainEntity", {})
                    data["question"] = clean_text(main_ent.get("name") or main_ent.get("text"))
                    acc_ans = main_ent.get("acceptedAnswer", {})
                    data["explanation"] = clean_text(acc_ans.get("text"))
                    break
        except Exception:
            continue

    # Fallback for Question Text if JSON-LD missing
    if not data["question"]:
        h1_match = re.search(r'<h1[^>]*>([\s\S]*?)</h1>', html_content)
        if h1_match:
            data["question"] = clean_text(h1_match.group(1))

    # 2. Extract Options A, B, C, D
    opt_pattern = re.compile(
        r'<span[^>]*class="[^"]*text-indigo-600[^"]*"[^>]*>([A-D])(?:<!-- -->)?\.</span>'
        r'\s*<span[^>]*class="[^"]*break-words[^"]*"[^>]*>([\s\S]*?)</span>',
        re.IGNORECASE
    )
    for opt_letter, opt_val in opt_pattern.findall(html_content):
        data["options"][opt_letter.upper()] = clean_text(opt_val)

    # 3. Extract Correct Answer
    ans_match = re.search(r'Correct answer:\s*(?:<!-- -->)?\s*([A-D])', html_content, re.IGNORECASE)
    if ans_match:
        data["correct"] = ans_match.group(1).upper()
    else:
        # Check Marathi label
        mr_ans_match = re.search(r'योग्य उत्तर:\s*(?:<!-- -->)?\s*([A-D])', html_content, re.IGNORECASE)
        if mr_ans_match:
            data["correct"] = mr_ans_match.group(1).upper()

    # 4. Extract Subject & Topic
    meta_match = re.search(r'belongs to the\s+([A-Za-z\s]+)\s+section under the topic\s+([\s\S]*?)\s+and is reproduced', html_content, re.IGNORECASE)
    raw_subj = "General Studies"
    if meta_match:
        raw_subj = meta_match.group(1).strip()
        data["topic"] = clean_text(meta_match.group(2))
    else:
        fallback_match = re.search(r'belongs to the\s+([A-Za-z\s]+)\s+section under the topic\s+([^.<]+)', html_content, re.IGNORECASE)
        if fallback_match:
            raw_subj = fallback_match.group(1).strip()
            data["topic"] = clean_text(fallback_match.group(2).split(' and is reproduced')[0])

    # Smart Subject Refinement
    data["subject"] = classify_subject(raw_subj, data["question"] or "", data["topic"] or "", data["options"])

    # Fallback explanation if JSON-LD didn't capture it
    if not data["explanation"]:
        exp_match = re.search(r'<h2[^>]*>Explanation</h2>\s*<p[^>]*>([\s\S]*?)</p>', html_content, re.IGNORECASE)
        if exp_match:
            data["explanation"] = clean_text(exp_match.group(1))

    # Must have question text, at least 2 options, and a valid correct answer
    if data["question"] and len(data["options"]) >= 2 and data["correct"]:
        return data

    return None

def discover_all_question_slugs():
    """Fetches all 8,648+ question slugs directly from mpscs.in sitemaps"""
    slugs_cache = "all_question_slugs.json"
    if os.path.exists(slugs_cache):
        try:
            with open(slugs_cache, "r", encoding="utf-8") as f:
                cached = json.load(f)
                if len(cached) > 5000:
                    print(f"Loaded {len(cached)} question slugs from local cache ({slugs_cache}).")
                    return cached
        except Exception:
            pass

    print("Discovering all question URLs from sitemaps 1-5 ...")
    all_slugs = []
    seen = set()

    for i in range(1, 6):
        url = f"{BASE_URL}/sitemap/{i}.xml"
        xml = fetch_url(url, delay=0.1)
        if not xml:
            continue
        found = re.findall(r'<loc>https://www.mpscs.in/questions/([^<]+)</loc>', xml)
        for s in found:
            if s not in seen:
                seen.add(s)
                all_slugs.append(s)
        print(f"  Sitemap {i}.xml: found {len(found)} question slugs (running total: {len(all_slugs)})")

    # Save cache
    with open(slugs_cache, "w", encoding="utf-8") as f:
        json.dump(all_slugs, f, indent=2)

    print(f"Total discovered question slugs: {len(all_slugs)}\n")
    return all_slugs

def infer_exam_and_year(slug):
    """Infers exam name, year, and language from slug"""
    year_match = re.search(r'20\d{2}', slug)
    year = int(year_match.group(0)) if year_match else 2024

    exam = "MPSC State Services (Rajyaseva)"
    slug_lower = slug.lower()
    if "group-b" in slug_lower or "gb" in slug_lower or "sb" in slug_lower:
        exam = "MPSC Group B Combined"
    elif "group-c" in slug_lower or "gc" in slug_lower:
        exam = "MPSC Group C Combined"
    elif "psi" in slug_lower:
        exam = "MPSC Police Sub-Inspector (PSI)"
    elif "rto" in slug_lower or "amvi" in slug_lower:
        exam = "MPSC AMVI RTO"
    elif "rajyaseva" in slug_lower or "csg" in slug_lower or "gcs" in slug_lower or "rsp" in slug_lower:
        exam = "MPSC State Services (Rajyaseva)"
    elif "topic-" in slug_lower:
        exam = "MPSC Practice Subject Test"

    is_marathi = "marathi" in slug_lower or "_mr_" in slug_lower or "-mr-" in slug_lower or slug_lower.endswith("-mr")
    return exam, year, is_marathi

def scrape_single_question(slug, delay=0.05):
    """Worker task: fetch and parse one question"""
    q_url = f"{BASE_URL}/questions/{slug}"
    q_html = fetch_url(q_url, delay=delay)
    if not q_html:
        return None

    parsed = parse_question_html(q_html)
    if not parsed:
        return None

    exam_name, exam_year, is_marathi = infer_exam_and_year(slug)

    return {
        "slug": slug,
        "exam": exam_name,
        "year": exam_year,
        "subject": parsed["subject"],
        "topic": parsed["topic"],
        "question": parsed["question"],
        "options": parsed["options"],
        "correct": parsed["correct"],
        "explanation": parsed["explanation"],
        "tags": [parsed["subject"], exam_name, str(exam_year), parsed["topic"]],
        "difficulty": "Medium",
        "is_marathi": is_marathi,
        "scraped_at": datetime.now(timezone.utc).isoformat()
    }

def format_sql_value(val):
    """Escapes strings for PostgreSQL literals"""
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"

def generate_dbeaver_sql(all_questions, output_sql_path, batch_size=50):
    """
    Generates DBeaver-compatible multi-row INSERT statements.
    Splits into manageable batches of 50 rows per INSERT statement so
    DBeaver executes smoothly with Alt + X without hitting statement size limits.
    """
    with open(output_sql_path, "w", encoding="utf-8") as sql_file:
        sql_file.write("-- =============================================================================\n")
        sql_file.write(f"-- ExamUdaan MPSC Questions Ingestion — Generated {datetime.now(timezone.utc).isoformat()}\n")
        sql_file.write(f"-- Total Questions: {len(all_questions)}\n")
        sql_file.write("-- Compatible with: DBeaver (Alt + X), pgAdmin, and psql\n")
        sql_file.write("-- =============================================================================\n\n")
        sql_file.write("BEGIN;\n\n")

        # Process in batches of 50
        for i in range(0, len(all_questions), batch_size):
            batch = all_questions[i:i + batch_size]
            row_tuples = []

            for q in batch:
                q_id = q["id"]
                topic_sql = format_sql_value(q.get("topic") or "General")
                subject_sql = format_sql_value(q.get("subject") or "General Studies")
                exam_sql = format_sql_value(q.get("exam") or "MPSC")
                year_val = q.get("year") or 2024
                question_sql = format_sql_value(q.get("question") or "")
                options_json = json.dumps(q.get("options") or {}, ensure_ascii=False).replace("'", "''")
                correct_sql = format_sql_value(q.get("correct") or "A")
                expl_sql = format_sql_value(q.get("explanation") or "")
                
                tags_arr = "{" + ",".join(['"' + t.replace('"', '').replace("'", "") + '"' for t in q.get("tags", [])]) + "}"
                tags_sql = format_sql_value(tags_arr) + "::text[]"
                difficulty_sql = format_sql_value(q.get("difficulty") or "Medium")

                row_tuples.append(
                    f"  ({q_id}, {topic_sql}, {subject_sql}, {exam_sql}, {year_val}, {question_sql}, '{options_json}'::jsonb, {correct_sql}, {expl_sql}, {tags_sql}, {difficulty_sql})"
                )

            sql_file.write("INSERT INTO pyq_questions (id, topic, subject, exam, year, question, options, correct, explanation, tags, difficulty)\nVALUES\n")
            sql_file.write(",\n".join(row_tuples))
            sql_file.write("\nON CONFLICT (id) DO UPDATE SET\n")
            sql_file.write("  question = EXCLUDED.question,\n")
            sql_file.write("  options = EXCLUDED.options,\n")
            sql_file.write("  correct = EXCLUDED.correct,\n")
            sql_file.write("  explanation = EXCLUDED.explanation,\n")
            sql_file.write("  subject = EXCLUDED.subject,\n")
            sql_file.write("  topic = EXCLUDED.topic;\n\n")

        sql_file.write("COMMIT;\n")

def main():
    parser = argparse.ArgumentParser(description="ExamUdaan MPSC High-Performance PYQ Scraper")
    parser.add_argument("--workers", type=int, default=5, help="Number of concurrent worker threads (default: 5)")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of questions to process (e.g. --limit 500)")
    parser.add_argument("--filter", type=str, default=None, help="Filter slugs containing text (e.g. --filter rajyaseva)")
    parser.add_argument("--output-json", type=str, default="pyq_scraped_questions.json", help="Output JSON path")
    parser.add_argument("--output-sql", type=str, default="pyq_scraped_questions.sql", help="Output SQL path")
    args = parser.parse_args()

    # Discover all question slugs
    all_slugs = discover_all_question_slugs()

    # Apply filter if provided
    if args.filter:
        flt = args.filter.lower()
        all_slugs = [s for s in all_slugs if flt in s.lower()]
        print(f"Filtered to {len(all_slugs)} questions matching '{args.filter}'.")

    # Apply limit if provided
    if args.limit:
        all_slugs = all_slugs[:args.limit]
        print(f"Limited run to {len(all_slugs)} questions.")

    # Load existing checkpoint
    checkpoint_file = "scrape_checkpoint.json"
    scraped_data = {}
    if os.path.exists(checkpoint_file):
        try:
            with open(checkpoint_file, "r", encoding="utf-8") as f:
                scraped_data = json.load(f)
            print(f"Loaded {len(scraped_data)} previously scraped questions from checkpoint.")
        except Exception:
            pass

    # Filter out already scraped slugs
    pending_slugs = [s for s in all_slugs if s not in scraped_data]

    print("========================================================")
    print("ExamUdaan Scraper — Multi-Threaded Engine Active")
    print(f"Total Targets     : {len(all_slugs)}")
    print(f"Already Scraped   : {len(scraped_data)}")
    print(f"Pending to Scrape : {len(pending_slugs)}")
    print(f"Worker Threads    : {args.workers}")
    print("========================================================\n")

    if not pending_slugs:
        print("All matching questions have already been scraped!")
    else:
        lock = threading.Lock()
        id_counter = 20001 + len(scraped_data)
        processed_count = 0
        start_time = time.time()

        def save_checkpoint():
            with open(checkpoint_file, "w", encoding="utf-8") as f:
                json.dump(scraped_data, f, ensure_ascii=False, indent=2)

        try:
            with ThreadPoolExecutor(max_workers=args.workers) as executor:
                # Submit futures
                future_to_slug = {executor.submit(scrape_single_question, s): s for s in pending_slugs}

                for future in as_completed(future_to_slug):
                    slug = future_to_slug[future]
                    try:
                        record = future.result()
                        if record:
                            with lock:
                                record["id"] = id_counter
                                id_counter += 1
                                scraped_data[slug] = record
                                processed_count += 1

                                if processed_count % 5 == 0 or processed_count <= 10:
                                    elapsed = time.time() - start_time
                                    qps = processed_count / elapsed if elapsed > 0 else 0
                                    percent = (len(scraped_data) / len(all_slugs)) * 100
                                    print(f"[{len(scraped_data)}/{len(all_slugs)}] {percent:5.1f}% | {record['subject'][:11]:11s} | {record['topic'][:22]:22s} -> Ans: {record['correct']} ({qps:.1f} q/s)")

                                # Save checkpoint every 50 questions
                                if processed_count % 50 == 0:
                                    save_checkpoint()
                    except Exception as exc:
                        # Individual failure does not stop the queue
                        pass

        except KeyboardInterrupt:
            print("\n\n[PAUSED] Process interrupted by user. Saving checkpoint...")
        finally:
            save_checkpoint()

    # Final Save: JSON
    all_questions = list(scraped_data.values())
    print("\nWriting outputs...")
    with open(args.output_json, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)

    # Final Save: DBeaver-compatible SQL
    generate_dbeaver_sql(all_questions, args.output_sql)

    # Subject breakdown summary
    subject_counts = {}
    for q in all_questions:
        s = q.get("subject", "Other")
        subject_counts[s] = subject_counts.get(s, 0) + 1

    print("\n========================================================")
    print("Scraping Completed / Checkpoint Saved Successfully!")
    print(f"Total Questions In Bank : {len(all_questions)}")
    print(f"JSON Output             : {args.output_json}")
    print(f"PostgreSQL SQL Output   : {args.output_sql} (DBeaver Ready)")
    print("--------------------------------------------------------")
    print("Subject Distribution:")
    for subj, cnt in sorted(subject_counts.items(), key=lambda x: -x[1]):
        print(f"  {subj:20s}: {cnt} questions")
    print("========================================================\n")

if __name__ == "__main__":
    main()
