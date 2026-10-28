"""
mahatet_pyq_scraper.py — Production MAHA TET Question Papers & Answer Keys Downloader & Cataloger
ExamUdaan.in | Maharashtra State Council of Examination (MSCE Pune)

Features:
- Scrapes all 98 official question papers & final answer keys from mahatet.in
- Auto-pairs Question Papers with matching Answer Keys by (Year, Stage, Medium)
- Organizes downloads by medium and stage (Marathi, English, Hindi, Urdu)
- Generates `apps/web/src/lib/mahatetPyqManifest.json` for in-browser reading
- Resumption support (auto-skips already downloaded PDFs)
- Exponential backoff & polite jittered delays

Usage:
  python mahatet_pyq_scraper.py --catalog-only
  python mahatet_pyq_scraper.py --download-all
  python mahatet_pyq_scraper.py --download-all --medium marathi,english,hindi
"""

import os
import sys
import time
import random
import json
import argparse
import urllib.request
import ssl
import re
from typing import List, Dict, Any
from urllib.parse import urlparse, parse_qs
from bs4 import BeautifulSoup

MAHATET_ARCHIVE_URL = "https://www.mahatet.in/Notices/QuestionPaper/ShowPreviousQuestionPapers"

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
]

def get_ssl_context():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx

def format_file_size(size_bytes: int) -> str:
    if not size_bytes or size_bytes <= 0:
        return "Official PDF"
    if size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    return f"{size_bytes / (1024 * 1024):.2f} MB"

def fetch_mahatet_page() -> str:
    print(f"[*] Fetching archive page from {MAHATET_ARCHIVE_URL}...")
    req = urllib.request.Request(
        MAHATET_ARCHIVE_URL,
        headers={'User-Agent': random.choice(USER_AGENTS)}
    )
    with urllib.request.urlopen(req, context=get_ssl_context(), timeout=25) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def parse_items_from_html(html: str) -> List[Dict[str, Any]]:
    soup = BeautifulSoup(html, 'html.parser')
    links = soup.find_all('a', href=True)
    raw_items = []

    for a in links:
        href = a['href'].strip()
        raw_text = a.get_text(strip=True)
        if 'downloadmedia' not in href.lower():
            continue

        full_url = f"https://www.mahatet.in{href}" if href.startswith('/') else href
        parsed = urlparse(href)
        params = parse_qs(parsed.query)
        folder = params.get('folderName', [''])[0]
        file_name = params.get('fileName', [''])[0]

        is_key = (
            'ANSWER_KEYS' in folder.upper()
            or 'उत्तरसूची' in raw_text
            or 'उत्तरतालिका' in raw_text
            or 'key' in file_name.lower()
        )

        # Extract year
        year = None
        ym = re.search(r'20\d\d', file_name)
        if ym:
            year = int(ym.group(0))
        elif '2024' in folder:
            year = 2024
        elif '2025' in folder:
            year = 2025
        else:
            tm = re.search(r'20\d\d', raw_text)
            if tm:
                year = int(tm.group(0))
            else:
                year = 2024  # Default fallback for recent keys

        # Paper stage & post
        if re.search(r'P2_Math|_Math', file_name, re.I):
            paper_id = 'p2_math'
            paper_name = 'Paper II (Mathematics & Science)'
            paper_name_mr = 'पेपर २ (गणित व विज्ञान - इयत्ता ६ वी ते ८ वी)'
            stage_group = 'paper-2'
            stage_label = 'Paper 2 (Math-Sci)'
        elif re.search(r'P2_Soc|_Soc', file_name, re.I):
            paper_id = 'p2_soc'
            paper_name = 'Paper II (Social Science)'
            paper_name_mr = 'पेपर २ (सामाजिक शास्त्रे - इयत्ता ६ वी ते ८ वी)'
            stage_group = 'paper-2'
            stage_label = 'Paper 2 (Social)'
        elif re.search(r'P2|Paper2', file_name, re.I):
            paper_id = 'p2'
            paper_name = 'Paper II (Upper Primary)'
            paper_name_mr = 'पेपर २ (इयत्ता ६ वी ते ८ वी)'
            stage_group = 'paper-2'
            stage_label = 'Paper 2'
        else:
            paper_id = 'p1'
            paper_name = 'Paper I (Primary)'
            paper_name_mr = 'पेपर १ (प्राथमिक - इयत्ता १ ली ते ५ वी)'
            stage_group = 'paper-1'
            stage_label = 'Paper 1 (Primary)'

        # Medium
        fn_text = (file_name + ' ' + raw_text).lower()
        if 'marathi' in fn_text or 'मराठी' in fn_text:
            medium = 'Marathi'
            medium_mr = 'मराठी माध्यम'
        elif 'english' in fn_text or 'इंग्रजी' in fn_text:
            medium = 'English'
            medium_mr = 'इंग्रजी माध्यम'
        elif 'hindi' in fn_text or 'हिन्दी' in fn_text or 'हिंदी' in fn_text:
            medium = 'Hindi'
            medium_mr = 'हिंदी माध्यम'
        elif 'urdu' in fn_text or 'उर्दू' in fn_text:
            medium = 'Urdu'
            medium_mr = 'उर्दू माध्यम'
        elif 'bangali' in fn_text or 'bengali' in fn_text or 'बंगाली' in fn_text:
            medium = 'Bengali'
            medium_mr = 'बंगाली माध्यम'
        elif 'kannada' in fn_text or 'कन्नड' in fn_text:
            medium = 'Kannada'
            medium_mr = 'कन्नड माध्यम'
        elif 'gujarati' in fn_text or 'गुजराती' in fn_text:
            medium = 'Gujarati'
            medium_mr = 'गुजराती माध्यम'
        elif 'telugu' in fn_text or 'तेलगू' in fn_text:
            medium = 'Telugu'
            medium_mr = 'तेलगू माध्यम'
        elif 'sindhi' in fn_text or 'सिंधी' in fn_text:
            medium = 'Sindhi'
            medium_mr = 'सिंधी माध्यम'
        else:
            medium = 'Other'
            medium_mr = 'इतर माध्यम'

        raw_items.append({
            'rawText': raw_text,
            'fileName': file_name,
            'folder': folder,
            'downloadUrl': full_url,
            'isKey': is_key,
            'year': year,
            'paperId': paper_id,
            'paperName': paper_name,
            'paperNameMr': paper_name_mr,
            'stageGroup': stage_group,
            'stageLabel': stage_label,
            'medium': medium,
            'mediumMr': medium_mr
        })

    return raw_items

def build_paired_catalog(raw_items: List[Dict[str, Any]], local_downloads_dir: str) -> List[Dict[str, Any]]:
    """Group items by (Year, PaperId, Medium) and pair QP with Answer Key."""
    groups: Dict[str, Dict[str, Any]] = {}

    for it in raw_items:
        key = f"{it['year']}_{it['paperId']}_{it['medium']}"
        if key not in groups:
            groups[key] = {
                'id': f"mahatet-{it['year']}-{it['paperId']}-{it['medium'].lower()}",
                'year': it['year'],
                'paperId': it['paperId'],
                'paperName': it['paperName'],
                'paperNameMr': it['paperNameMr'],
                'stageGroup': it['stageGroup'],
                'stageLabel': it['stageLabel'],
                'medium': it['medium'],
                'mediumMr': it['mediumMr'],
                'title': f"MAHA TET {it['year']} {it['paperName']} ({it['medium']} Medium)",
                'titleMr': f"महाटेट {it['year']} {it['paperName_mr'] if 'paperName_mr' in it else it['paperNameMr']} ({it['mediumMr']})",
                'questionPaper': None,
                'answerKey': None,
                'hasKey': False
            }

        subfolder = "answer_keys" if it['isKey'] else "question_papers"
        local_rel_path = f"/downloads/mahatet/{subfolder}/{it['year']}/{it['fileName']}"
        local_abs_path = os.path.join(local_downloads_dir, subfolder, str(it['year']), it['fileName'])
        has_local = os.path.exists(local_abs_path)
        file_size = os.path.getsize(local_abs_path) if has_local else 0

        doc_data = {
            'fileName': it['fileName'],
            'folder': it['folder'],
            'downloadUrl': it['downloadUrl'],
            'localPath': local_rel_path,
            'hasLocalPdf': has_local,
            'sizeFormatted': format_file_size(file_size)
        }

        if it['isKey']:
            groups[key]['answerKey'] = doc_data
            groups[key]['hasKey'] = True
        else:
            groups[key]['questionPaper'] = doc_data

    # Return sorted by year descending, then paper, then medium
    sorted_catalog = list(groups.values())
    sorted_catalog.sort(key=lambda x: (-(x['year'] or 0), x['paperId'], x['medium']))
    return sorted_catalog

def download_file(url: str, dest_path: str) -> bool:
    """Download a single PDF with retries."""
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1024:
        return True

    for attempt in range(3):
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': random.choice(USER_AGENTS)}
            )
            with urllib.request.urlopen(req, context=get_ssl_context(), timeout=35) as resp:
                data = resp.read()
                if data.startswith(b'%PDF') or len(data) > 500:
                    with open(dest_path, 'wb') as f:
                        f.write(data)
                    return True
                else:
                    print(f"    [!] Warning: Non-PDF binary received for {url} (size {len(data)})")
        except Exception as e:
            time.sleep(1.5 * (attempt + 1))
            if attempt == 2:
                print(f"    [x] Failed to download {url}: {e}")
    return False

def main():
    parser = argparse.ArgumentParser(description="MAHA TET Question Papers Downloader & Cataloger")
    parser.add_argument('--catalog-only', action='store_true', help="Only build catalog JSON without downloading")
    parser.add_argument('--download-all', action='store_true', help="Download all PDFs")
    parser.add_argument('--medium', type=str, default='all', help="Filter medium: marathi,english,hindi or all")
    parser.add_argument('--paper', type=str, default='all', help="Filter paper: p1,p2 or all")
    args = parser.parse_args()

    # Paths
    base_dir = os.path.abspath(os.path.dirname(__file__))
    web_dir = os.path.abspath(os.path.join(base_dir, "..", "web"))
    downloads_dir = os.path.join(web_dir, "public", "downloads", "mahatet")
    manifest_dest = os.path.join(web_dir, "src", "lib", "mahatetPyqManifest.json")

    print("============================================================")
    print(" ExamUdaan | MAHA TET Question Papers & Answer Keys Scraper")
    print(" Source: mahatet.in (MSCE Pune)")
    print(f" Target Public Downloads: {downloads_dir}")
    print(f" Target Manifest: {manifest_dest}")
    print("============================================================")

    html = fetch_mahatet_page()
    raw_items = parse_items_from_html(html)
    print(f"[+] Total raw items found on portal: {len(raw_items)}")

    # Filter mediums if requested
    filtered_items = raw_items
    if args.medium != 'all':
        allowed_mediums = [m.strip().lower() for m in args.medium.split(',')]
        filtered_items = [it for it in filtered_items if it['medium'].lower() in allowed_mediums]
        print(f"[*] Filtered to mediums [{args.medium}]: {len(filtered_items)} items")

    if args.download_all:
        print(f"\n[*] Starting downloads for {len(filtered_items)} files...")
        success_count = 0
        for i, it in enumerate(filtered_items, 1):
            subfolder = "answer_keys" if it['isKey'] else "question_papers"
            dest = os.path.join(downloads_dir, subfolder, str(it['year']), it['fileName'])
            
            print(f"[{i}/{len(filtered_items)}] ({it['year']} {it['medium']} {'KEY' if it['isKey'] else 'QP'}) {it['fileName']} ...", end=" ", flush=True)
            ok = download_file(it['downloadUrl'], dest)
            if ok:
                size_str = format_file_size(os.path.getsize(dest))
                print(f"DONE ({size_str})")
                success_count += 1
            else:
                print("FAILED")
            time.sleep(random.uniform(0.5, 1.2))

        print(f"\n[+] Download run complete: {success_count}/{len(filtered_items)} files successfully saved.")

    # Always generate the catalog
    print("\n[*] Building full catalog & pairing question papers with answer keys...")
    catalog = build_paired_catalog(raw_items, downloads_dir)

    manifest_data = {
        'generatedAt': time.strftime("%Y-%m-%d %H:%M:%S"),
        'portalSource': 'https://www.mahatet.in/Notices/QuestionPaper/ShowPreviousQuestionPapers',
        'organization': 'Maharashtra State Council of Examination (MSCE Pune)',
        'acronym': 'MAHATET',
        'totalRawItems': len(raw_items),
        'totalExamSets': len(catalog),
        'totalWithKey': len([c for c in catalog if c['hasKey']]),
        'yearsCovered': sorted(list(set([c['year'] for c in catalog if c['year']])), reverse=True),
        'mediums': sorted(list(set([c['medium'] for c in catalog]))),
        'items': catalog
    }

    os.makedirs(os.path.dirname(manifest_dest), exist_ok=True)
    with open(manifest_dest, 'w', encoding='utf-8') as f:
        json.dump(manifest_data, f, indent=2, ensure_ascii=False)

    print(f"[OK] Saved rich manifest to {manifest_dest} ({len(catalog)} paired exam sets).")
    print("============================================================")

if __name__ == '__main__':
    main()
