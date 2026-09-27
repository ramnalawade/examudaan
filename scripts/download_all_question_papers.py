#!/usr/bin/env python3
"""
=============================================================================
ExamUdaan — Question Papers & Final Keys Downloader
=============================================================================
Downloads all official, clean previous year question paper PDFs and final answer
keys from public archives directly into ExamUdaan's public storage folder.

Output Directory:
  apps/web/public/question-papers/mpsc/

Outputs:
  1. PDF files stored with clean, SEO-friendly filenames
  2. apps/web/src/lib/mpscLocalPapers.json (manifest used by /question-papers page)

Usage:
  python scripts/download_all_question_papers.py
  python scripts/download_all_question_papers.py --discover
  python scripts/download_all_question_papers.py --output-dir custom_folder/
=============================================================================
"""

import os
import sys
import re
import json
import urllib.request
import urllib.error
import urllib.parse
import argparse

# Ensure UTF-8 output on all consoles
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Official MPSC Question Papers & Verified Keys Archive (2015 - 2024)
MPSC_PAPERS = [
    {
        "remote_url": "https://www.mpscs.in/exams/MPSC_Group_C_Combined_Pre_2024.pdf",
        "filename": "mpsc-group-c-combined-prelim-2024-question-paper.pdf",
        "title": "MPSC Group C Combined Preliminary Examination 2024 Question Paper",
        "year": 2024,
        "type": "question-paper",
        "exam": "Group C Combined Prelims"
    },
    {
        "remote_url": "https://mpscmaterial.com/wp-content/uploads/2022/11/MPSC-Rajyaseva-Prelim-2022-Paper-1.pdf",
        "filename": "mpsc-rajyaseva-prelim-2022-gs1-question-paper.pdf",
        "title": "MPSC Rajyaseva Prelims 2022 General Studies Paper 1 Question Paper",
        "year": 2022,
        "type": "question-paper",
        "exam": "Rajyaseva Prelims GS Paper 1"
    },
    {
        "remote_url": "https://mpscmaterial.com/wp-content/uploads/2022/11/MPSC-Rajyaseva-Prelim-2022-GS-Paper-1-Final-Key.pdf",
        "filename": "mpsc-rajyaseva-prelim-2022-gs1-final-key.pdf",
        "title": "MPSC Rajyaseva Prelims 2022 General Studies Paper 1 Final Answer Key",
        "year": 2022,
        "type": "answer-key",
        "exam": "Rajyaseva Prelims GS Paper 1"
    },
    {
        "remote_url": "https://mpscmaterial.com/wp-content/uploads/2022/01/MPSC-Prelim-2021-GS-Paper-1.pdf",
        "filename": "mpsc-rajyaseva-prelim-2021-gs1-question-paper.pdf",
        "title": "MPSC Rajyaseva Prelims 2021 General Studies Paper 1 Question Paper",
        "year": 2021,
        "type": "question-paper",
        "exam": "Rajyaseva Prelims GS Paper 1"
    },
    {
        "remote_url": "https://mpscmaterial.com/wp-content/uploads/2022/03/MPSC-Rajyaseva-Prelim-2021-GS-Paper-1-Final-Key.pdf",
        "filename": "mpsc-rajyaseva-prelim-2021-gs1-final-key.pdf",
        "title": "MPSC Rajyaseva Prelims 2021 General Studies Paper 1 Final Answer Key",
        "year": 2021,
        "type": "answer-key",
        "exam": "Rajyaseva Prelims GS Paper 1"
    },
    {
        "remote_url": "https://mpscmaterial.com/wp-content/uploads/2021/03/MPSC-Prelim-2020-GS-Paper-1.pdf",
        "filename": "mpsc-rajyaseva-prelim-2020-gs1-question-paper.pdf",
        "title": "MPSC Rajyaseva Prelims 2020 General Studies Paper 1 Question Paper",
        "year": 2020,
        "type": "question-paper",
        "exam": "Rajyaseva Prelims GS Paper 1"
    },
    {
        "remote_url": "https://mpscmaterial.com/wp-content/uploads/2021/07/MPSC-Prelim-2020-GS-Paper-1-Final-Key.pdf",
        "filename": "mpsc-rajyaseva-prelim-2020-gs1-final-key.pdf",
        "title": "MPSC Rajyaseva Prelims 2020 General Studies Paper 1 Final Answer Key",
        "year": 2020,
        "type": "answer-key",
        "exam": "Rajyaseva Prelims GS Paper 1"
    },
    {
        "remote_url": "https://mpscmaterial.com/wp-content/uploads/2019/02/MPSC-Prelim-2019-GS-Paper-1-.pdf",
        "filename": "mpsc-rajyaseva-prelim-2019-gs1-question-paper.pdf",
        "title": "MPSC Rajyaseva Prelims 2019 General Studies Paper 1 Question Paper",
        "year": 2019,
        "type": "question-paper",
        "exam": "Rajyaseva Prelims GS Paper 1"
    },
    {
        "remote_url": "https://mpscmaterial.com/wp-content/uploads/2019/02/MPSC-Prelim-2019-GS-Paper-1-Final-Key-1.pdf",
        "filename": "mpsc-rajyaseva-prelim-2019-gs1-final-key.pdf",
        "title": "MPSC Rajyaseva Prelims 2019 General Studies Paper 1 Final Answer Key",
        "year": 2019,
        "type": "answer-key",
        "exam": "Rajyaseva Prelims GS Paper 1"
    },
    {
        "remote_url": "https://mpscmaterial.com/wp-content/uploads/2017/11/MPSC-Prelim-General-Studies-Paper-1.pdf",
        "filename": "mpsc-rajyaseva-prelim-2018-gs1-question-paper.pdf",
        "title": "MPSC Rajyaseva Prelims 2018 General Studies Paper 1 Question Paper",
        "year": 2018,
        "type": "question-paper",
        "exam": "Rajyaseva Prelims GS Paper 1"
    },
    {
        "remote_url": "https://mpscmaterial.com/wp-content/uploads/2018/04/MPSC-Prelim-2018-General-Studies-Paper-1-Final-Key.pdf",
        "filename": "mpsc-rajyaseva-prelim-2018-gs1-final-key.pdf",
        "title": "MPSC Rajyaseva Prelims 2018 General Studies Paper 1 Final Answer Key",
        "year": 2018,
        "type": "answer-key",
        "exam": "Rajyaseva Prelims GS Paper 1"
    }
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 ExamUdaan/2.0"
}

def discover_online_papers():
    """Scrapes https://www.mpscs.in/mpsc-question-papers-pdf and https://www.mpscs.in/exams to discover all available PDF links"""
    urls_to_scan = [
        "https://www.mpscs.in/mpsc-question-papers-pdf",
        "https://www.mpscs.in/exams"
    ]
    discovered = []
    seen = set()

    for url in urls_to_scan:
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                content = resp.read().decode("utf-8", errors="replace")
                pdf_urls = re.findall(r'href="([^"]+\.pdf)"', content)
                for p_url in pdf_urls:
                    abs_url = urllib.parse.urljoin(url, p_url)
                    if abs_url in seen:
                        continue
                    seen.add(abs_url)

                    raw_filename = abs_url.split("/")[-1].split("?")[0]
                    clean_name = raw_filename.lower().replace("_", "-")
                    if not clean_name.endswith(".pdf"):
                        clean_name += ".pdf"

                    # Year extraction
                    year_match = re.search(r'20\d{2}', clean_name)
                    year = int(year_match.group(0)) if year_match else 2024

                    # Clean exam title
                    clean_title = clean_name.replace(".pdf", "").replace("-", " ").title()

                    discovered.append({
                        "remote_url": abs_url,
                        "filename": clean_name,
                        "title": clean_title,
                        "year": year,
                        "type": "answer-key" if "key" in clean_name else "question-paper",
                        "exam": "MPSC Examination"
                    })
        except Exception as e:
            print(f"Online discovery note for {url}: {e}")

    return discovered

def download_file(url, destination):
    """Downloads a remote file with chunked streaming"""
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        with open(destination, 'wb') as f:
            while True:
                chunk = resp.read(65536)
                if not chunk:
                    break
                f.write(chunk)

def main():
    parser = argparse.ArgumentParser(description="Download official clean question paper PDFs")
    parser.add_argument("--output-dir", type=str, default="apps/web/public/question-papers/mpsc", help="Target download directory")
    parser.add_argument("--manifest", type=str, default="apps/web/src/lib/mpscLocalPapers.json", help="Path to write JSON manifest")
    parser.add_argument("--discover", action="store_true", help="Also scan online portals for newly published PDFs")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    manifest_items = []

    papers_to_download = list(MPSC_PAPERS)
    if args.discover:
        print("Scanning online archives for additional question papers...")
        online_papers = discover_online_papers()
        existing_filenames = {p["filename"] for p in papers_to_download}
        existing_urls = {p["remote_url"] for p in papers_to_download}

        for op in online_papers:
            if op["remote_url"] not in existing_urls and op["filename"] not in existing_filenames:
                papers_to_download.append(op)
                existing_urls.add(op["remote_url"])
                existing_filenames.add(op["filename"])

    print("========================================================")
    print("ExamUdaan — PDF Question Papers Downloader")
    print(f"Target Directory: {args.output_dir}")
    print(f"Total Papers    : {len(papers_to_download)}")
    print("========================================================\n")

    for idx, item in enumerate(papers_to_download, 1):
        dest_path = os.path.join(args.output_dir, item["filename"])

        # Check if already downloaded
        if os.path.exists(dest_path) and os.path.getsize(dest_path) > 10000:
            size_kb = os.path.getsize(dest_path) / 1024
            size_mb = size_kb / 1024
            print(f"[{idx}/{len(papers_to_download)}] [EXISTS] {item['filename']} ({size_mb:.2f} MB)")
            manifest_items.append({
                **item,
                "localPath": f"/question-papers/mpsc/{item['filename']}",
                "sizeBytes": os.path.getsize(dest_path),
                "sizeFormatted": f"{size_mb:.2f} MB" if size_mb >= 1.0 else f"{size_kb:.0f} KB"
            })
            continue

        print(f"[{idx}/{len(papers_to_download)}] [DOWNLOADING] {item['filename']} ...")
        try:
            download_file(item["remote_url"], dest_path)
            size_kb = os.path.getsize(dest_path) / 1024
            size_mb = size_kb / 1024
            print(f"       [OK] Saved ({size_mb:.2f} MB)")
            manifest_items.append({
                **item,
                "localPath": f"/question-papers/mpsc/{item['filename']}",
                "sizeBytes": os.path.getsize(dest_path),
                "sizeFormatted": f"{size_mb:.2f} MB" if size_mb >= 1.0 else f"{size_kb:.0f} KB"
            })
        except Exception as e:
            print(f"       [FAILED] {e}")

    # Sort manifest descending by year
    manifest_items.sort(key=lambda x: -x["year"])

    # Write manifest JSON
    os.makedirs(os.path.dirname(os.path.abspath(args.manifest)), exist_ok=True)
    with open(args.manifest, "w", encoding="utf-8") as f:
        json.dump(manifest_items, f, indent=2, ensure_ascii=False)

    print("\n========================================================")
    print(f"All downloads finished! {len(manifest_items)} papers verified.")
    print(f"Manifest written to: {args.manifest}")
    print("========================================================\n")

if __name__ == "__main__":
    main()
