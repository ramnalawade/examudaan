"""
mpsc_provisional_keys_scraper.py — Production MPSC First / Model Answer Keys Pipeline
ExamUdaan.in | Extract, catalog, and download MPSC First / Provisional Answer Keys (mid=10)

Source: https://mpsc.gov.in/first_answer_keys/10

Anti-ban Features:
- Jittered random delays between downloads (default 1.5s - 3.5s)
- Automatic retry with exponential backoff on network errors
- Header & User-Agent rotation
- Resumption support (auto-skips already downloaded files)
- UTF-8 console output support for Marathi descriptions

Usage:
  python mpsc_provisional_keys_scraper.py                     # Downloads top recent keys + saves full catalog
  python mpsc_provisional_keys_scraper.py --catalog-only      # Quick scan: saves all 528 records to JSON
  python mpsc_provisional_keys_scraper.py --download-all      # Downloads all first answer key PDFs
  python mpsc_provisional_keys_scraper.py --year 2026,2025
"""

import os
import sys
import time
import random
import zlib
import json
import base64
import argparse
import urllib.request
import ssl
from typing import List, Dict, Any, Optional

# Force UTF-8 stdout on Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding

MPSC_SALT = "S300cr3t!@#Key$%^&*()_+[]{}|;':,.<>?/~`"
AES_KEY   = b"1234567812345678"
AES_IV    = b"1234567812345678"
MPSC_MENU_ID = 10  # First / Provisional Answer Keys menu ID

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
]

def get_auth_token(salt: str = MPSC_SALT) -> str:
    """Generate MPSC header authorization token: |#|#{crc32(salt)}"""
    val = zlib.crc32(salt.encode('utf-8')) & 0xffffffff
    return f"|#|#{format(val, 'x')}"

def decrypt_mpsc_payload(cipher_b64: str) -> str:
    """Decrypt AES-128-CBC payload from MPSC API."""
    cipher = Cipher(algorithms.AES(AES_KEY), modes.CBC(AES_IV))
    decryptor = cipher.decryptor()
    encrypted = base64.b64decode(cipher_b64)
    padded_data = decryptor.update(encrypted) + decryptor.finalize()
    unpadder = padding.PKCS7(128).unpadder()
    data = unpadder.update(padded_data) + unpadder.finalize()
    return data.decode('utf-8')

def get_ssl_context():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx

def sanitize_filename(name: str) -> str:
    """Clean filename for Windows/Linux file systems."""
    for char in ['\\', '/', ':', '*', '?', '"', '<', '>', '|', '\t', '\n', '\r']:
        name = name.replace(char, '_')
    return name.strip(' ._')[:120]

def fetch_mpsc_first_keys(mid: int = MPSC_MENU_ID) -> List[Dict[str, Any]]:
    """Fetch and decrypt records for MPSC first answer keys menu ID 10."""
    url = f"https://mpsc.gov.in/web/api/v1/getcontentdata/{mid}"
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': get_auth_token(),
        'Referer': f'https://mpsc.gov.in/first_answer_keys/{mid}',
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=get_ssl_context(), timeout=30) as resp:
        raw = resp.read().decode('utf-8').strip('"')
        decrypted = decrypt_mpsc_payload(raw)
        data = json.loads(decrypted)
        return data.get(str(mid), {}).get('webContentList', [])

def download_mpsc_pdf(file_id: int, save_path: Optional[str] = None, max_retries: int = 3) -> Optional[bytes]:
    """Download and decode official PDF by its ID with retry backoff."""
    url = f"https://mpsc.gov.in/web/api/v1/downloadFile/english/{file_id}"
    
    for attempt in range(1, max_retries + 1):
        headers = {
            'User-Agent': random.choice(USER_AGENTS),
            'Accept': 'application/json, text/plain, */*',
            'Authorization': get_auth_token(),
            'Referer': f'https://mpsc.gov.in/first_answer_keys/{MPSC_MENU_ID}',
        }
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, context=get_ssl_context(), timeout=35) as resp:
                content = resp.read()
                if content.startswith(b'%PDF'):
                    pdf_bytes = content
                else:
                    obj = json.loads(content.decode('utf-8', errors='ignore'))
                    if 'pdfData' in obj and obj['pdfData']:
                        pdf_bytes = base64.b64decode(obj['pdfData'])
                    else:
                        return None
                    
            if save_path:
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                with open(save_path, 'wb') as f:
                    f.write(pdf_bytes)
                    
            return pdf_bytes
        except Exception as e:
            if attempt < max_retries:
                backoff = attempt * random.uniform(2.0, 4.0)
                time.sleep(backoff)
            else:
                print(f"    [Error] Failed to download {file_id} after {max_retries} attempts: {e}")
                return None
    return None

def batch_download(
    items: List[Dict[str, Any]],
    folder: str,
    limit: int = 0,
    min_delay: float = 1.5,
    max_delay: float = 3.5,
):
    """Batch download items with resumption support and jittered random delays."""
    os.makedirs(folder, exist_ok=True)
    count = 0
    total = len(items) if limit == 0 else min(limit, len(items))
    
    print(f"\nStarting batch download of {total} first answer key files into: {folder}")
    print(f"Anti-ban safety enabled: random delay between {min_delay:.1f}s and {max_delay:.1f}s per file.\n")
    
    for idx, item in enumerate(items):
        if limit > 0 and count >= limit:
            break
            
        file_id = item.get('id')
        if not file_id:
            continue
            
        year = str(item.get('yearOfAdvertisement') or item.get('publishDate', '')[:4] or 'general')
        filename = item.get('englishFileName') or item.get('webContentName') or f"{file_id}.pdf"
        clean_name = sanitize_filename(f"{file_id}_{filename}")
        if not clean_name.lower().endswith('.pdf'):
            clean_name += '.pdf'
            
        target_path = os.path.join(folder, year, clean_name)
        
        # Check if already downloaded (idempotent resume)
        if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
            print(f"[{idx+1}/{total}] Already downloaded: {year}/{clean_name} (skipped)")
            count += 1
            continue
            
        print(f"[{idx+1}/{total}] Downloading ID {file_id}: {clean_name[:55]}...", end="", flush=True)
        pdf_bytes = download_mpsc_pdf(file_id, save_path=target_path)
        if pdf_bytes:
            count += 1
            sleep_sec = random.uniform(min_delay, max_delay)
            print(f" Done ({len(pdf_bytes):,} bytes) [waiting {sleep_sec:.2f}s]")
            time.sleep(sleep_sec)
        else:
            print(" Failed!")
            time.sleep(min_delay)
            
    print(f"\nBatch download finished. Successfully processed {count} files.")

def main():
    parser = argparse.ArgumentParser(description="MPSC First / Provisional Answer Keys Pipeline")
    parser.add_argument('--catalog-only', action='store_true', help='Only fetch and update JSON catalog (no mass PDF downloads)')
    parser.add_argument('--download-all', action='store_true', help='Download all first answer key PDFs')
    parser.add_argument('--year', type=str, help='Comma-separated years to filter (e.g. 2026,2025,2024)')
    parser.add_argument('--limit', type=int, default=0, help='Max number of files to download (0 = all)')
    parser.add_argument('--min-delay', type=float, default=1.5, help='Minimum random delay in seconds (default 1.5)')
    parser.add_argument('--max-delay', type=float, default=3.5, help='Maximum random delay in seconds (default 3.5)')
    
    args = parser.parse_args()
    min_delay = max(0.5, args.min_delay)
    max_delay = max(min_delay, args.max_delay)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    web_public_dir = os.path.abspath(os.path.join(base_dir, '..', 'web', 'public', 'downloads', 'mpsc'))
    downloads_dir = web_public_dir if os.path.exists(os.path.abspath(os.path.join(base_dir, '..', 'web', 'public'))) else os.path.join(base_dir, 'downloads', 'mpsc')
    catalog_path = os.path.join(downloads_dir, 'mpsc_first_keys_catalog.json')
    web_catalog_path = os.path.abspath(os.path.join(base_dir, '..', 'web', 'src', 'lib', 'mpscFirstKeysCatalog.json'))

    print("============================================================")
    print("  MPSC Official First / Provisional Answer Keys Pipeline     ")
    print(f"  Source: https://mpsc.gov.in/first_answer_keys/{MPSC_MENU_ID}       ")
    print("  ExamUdaan.in | 100% Direct Official Sources               ")
    print("============================================================")

    # 1. Fetch First Answer Keys Records
    print(f"\n[1/2] Fetching First Answer Keys from mpsc.gov.in (mid={MPSC_MENU_ID})...")
    key_items = fetch_mpsc_first_keys(MPSC_MENU_ID)
    print(f"  -> Found {len(key_items)} First Answer Key documents in MPSC database.")

    # Save full catalog JSON
    os.makedirs(downloads_dir, exist_ok=True)
    catalog = {
        'lastUpdated': time.strftime('%Y-%m-%d %H:%M:%S'),
        'menuId': MPSC_MENU_ID,
        'sourceUrl': f'https://mpsc.gov.in/first_answer_keys/{MPSC_MENU_ID}',
        'totalFirstAnswerKeys': len(key_items),
        'firstAnswerKeys': key_items,
    }
    with open(catalog_path, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
    print(f"\n[2/2] Full first answer keys catalog saved to:\n  -> {catalog_path}")

    # Also save to web app lib directory if it exists
    if os.path.exists(os.path.dirname(web_catalog_path)):
        with open(web_catalog_path, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, ensure_ascii=False, indent=2)
        print(f"  -> Also synced to ExamUdaan Web: {web_catalog_path}")

    if args.catalog_only:
        print("\n--catalog-only flag was set. Exiting without downloading PDFs.")
        return

    # Filter by Year if requested
    if args.year:
        target_years = [y.strip() for y in args.year.split(',') if y.strip()]
        print(f"\nFiltering for years: {target_years}")
        key_items = [
            k for k in key_items 
            if str(k.get('yearOfAdvertisement') or '') in target_years or any(y in str(k.get('publishDate', '')) for y in target_years)
        ]
        print(f"  -> Filtered First Answer Keys: {len(key_items)}")

    # Handle Downloads
    keys_folder = os.path.join(downloads_dir, 'first_answer_keys')
    limit = args.limit if args.limit > 0 else (0 if args.download_all else 5)

    if args.download_all:
        batch_download(key_items, keys_folder, limit=limit, min_delay=min_delay, max_delay=max_delay)
    else:
        print(f"\n[Demo Mode] Downloading top {limit} recent First Answer Keys...")
        batch_download(key_items, keys_folder, limit=limit, min_delay=min_delay, max_delay=max_delay)
        print("\nTip: To download all First Answer Key PDFs, run:")
        print("  python mpsc_provisional_keys_scraper.py --download-all")

if __name__ == '__main__':
    main()
