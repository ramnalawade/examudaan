# ============================================================
# spiders/thane_scrapling.py - Thane Police (Scrapling standalone)
#
# WHY Scrapling instead of Scrapy:
#   thanepolice.gov.in returns HTTP 522 (Cloudflare connection timeout)
#   to Scrapy because it detects bot traffic. Scrapling's
#   StealthyFetcher uses Camoufox (Firefox-based) with full browser
#   fingerprint spoofing to bypass Cloudflare challenges.
#
# Run:
#   .venv\Scripts\python.exe spiders\thane_scrapling.py
# ============================================================

import os, re, sys, hashlib, logging
from datetime import datetime
from dateutil import parser as date_parser
from dotenv import load_dotenv

from scrapling.fetchers import StealthyFetcher
import psycopg2, psycopg2.extras

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger("thane_scrapling")

BASE_URL  = "https://thanepolice.gov.in/recruitment"
ORG_NAME  = "Thane Police"
ORG_ACR   = "Thane Police"
STATE     = "maharashtra"
EXAM_CITY = ["Thane", "Mumbai"]

VACANCY_KW = ["vacancy","vacancies","recruitment","advertisement","walk-in","walk in",
               "interview","constable","sub-inspector","psi","asi","police","head constable",
               "naik","havaldar","clerk","officer","bharti","notification"]
RESULT_KW  = ["result","selected","merit","final list","waiting list","panel","निकाल","यादी"]
CORR_KW    = ["corrigendum","amendment","revised","correction","addendum","सुधारणा"]


def get_db_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST","localhost"), port=int(os.getenv("DB_PORT",5432)),
        dbname=os.getenv("DB_NAME"), user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"), connect_timeout=10,
    )

def is_known(conn, h):
    with conn.cursor() as c:
        c.execute("SELECT 1 FROM public.exam_notifications WHERE dedup_hash=%s LIMIT 1",(h,))
        return c.fetchone() is not None

def insert_item(conn, item):
    cols = ["title","org_name","org_acronym","source_url","notification_pdf",
            "apply_start_date","apply_end_date","advt_no","status","exam_cities",
            "application_links","state_slug","lang","is_walk_in","employment_type",
            "dedup_hash","ai_extracted_data","description","seo_metadata","classification_status"]
    ph = ", ".join(["%s"]*len(cols))
    with conn.cursor() as c:
        c.execute(f"INSERT INTO public.exam_notifications ({', '.join(cols)}) VALUES ({ph}) ON CONFLICT (dedup_hash) DO NOTHING",
                  [item.get(k) for k in cols])
    conn.commit()

def clean_title(t):
    t = re.sub(r"<[^>]+>","",t or "")
    t = re.sub(r"\s+"," ",t).strip()
    return t[:500]

def date_from_url(url):
    u = url.split("?")[0]
    m = re.search(r"(\d{2})-(\d{2})-(\d{4})",u)
    if m:
        try: return datetime.strptime(f"{m.group(3)}-{m.group(2)}-{m.group(1)}","%Y-%m-%d").strftime("%Y-%m-%d")
        except: pass
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})",u)
    if m:
        try: return datetime.strptime(m.group(0),"%Y-%m-%d").strftime("%Y-%m-%d")
        except: pass
    m = re.search(r"/(\d{4})-(\d{2})/",u)
    if m:
        try: return datetime.strptime(f"{m.group(1)}-{m.group(2)}-01","%Y-%m-%d").strftime("%Y-%m-%d")
        except: pass
    return None

def extract_advt_no(text):
    patterns = [r"(?:advt|advertisement|adv)[\s.#/-]*no[\s.:\-]*([A-Z0-9/\-]+\d{4})",
                r"([A-Z]+/[A-Z0-9]+/\d{4})"]
    for p in patterns:
        m = re.search(p,text,re.IGNORECASE)
        if m: return m.group(1).strip()
    return None

def build_item(title_raw, pdf_url, source_url=None):
    if not title_raw or len(title_raw) < 5: return None
    title = clean_title(title_raw)
    dk = pdf_url.split("?")[0]
    dh = hashlib.sha256(f"THANE_POLICE_{dk}".encode()).hexdigest()
    tl = title.lower()
    is_result = any(k in tl for k in RESULT_KW)
    is_corr   = any(k in tl for k in CORR_KW)
    is_walk   = "walk-in" in tl or "walk in" in tl
    pub_date  = date_from_url(pdf_url)
    yr = datetime.utcnow().year
    desc = " | ".join(filter(None,[
        "Type: WALK-IN" if is_walk else "",
        f"Date: {pub_date}" if pub_date else "",
        "Type: RESULT" if is_result else ("Type: CORRIGENDUM" if is_corr else "")
    ])) or f"Recruitment at Thane Police"
    return {"title":title,"org_name":ORG_NAME,"org_acronym":ORG_ACR,
            "source_url":source_url or pdf_url,"notification_pdf":pdf_url,
            "apply_start_date":pub_date,"apply_end_date":None,
            "advt_no":extract_advt_no(title),"status":"closed" if is_result else "published",
            "exam_cities":EXAM_CITY,"application_links":{"official_website":"https://thanepolice.gov.in"},
            "state_slug":STATE,"lang":"en",
            "is_walk_in":is_walk or None,"employment_type":"walkin" if is_walk else None,
            "dedup_hash":dh,"ai_extracted_data":{},"description":desc,
            "seo_metadata":{"meta_title":f"{title} | Thane Police Recruitment {yr}",
                            "meta_description":f"{title} at Thane Police, Maharashtra."},
            "classification_status":"pending"}


def extract_pdfs_from_page(page, conn, seen, source_url):
    saved = 0; skipped = 0
    for link in page.css("a"):
        href = (link.attrib.get("href","") or "").strip()
        text = " ".join(link.css("::text").getall()).strip()
        if not href: continue
        # Normalize URL
        if href.startswith("//"): href = f"https:{href}"
        elif not href.startswith("http"): href = f"https://thanepolice.gov.in{href}"

        if ".pdf" not in href.lower(): continue
        dk = href.split("?")[0]
        if dk in seen: continue
        seen.add(dk)
        dh = hashlib.sha256(f"THANE_POLICE_{dk}".encode()).hexdigest()
        if is_known(conn, dh):
            skipped += 1; continue
        item = build_item(text or href.split("/")[-1].replace(".pdf","").replace("_"," "), href, source_url)
        if not item: continue
        insert_item(conn, item)
        log.info(f"Thane SAVED: {item['title'][:70]}")
        saved += 1
    return saved, skipped


def scrape_thane():
    log.info(f"Thane Scrapling: Fetching {BASE_URL} with StealthyFetcher (Cloudflare bypass)")
    fetcher = StealthyFetcher(auto_match=True)

    # StealthyFetcher uses Camoufox (Firefox-based) with full fingerprint spoofing
    page = fetcher.fetch(
        BASE_URL,
        headless=True,
        timeout=60000,
        wait_selector="body",
        network_idle=True,
        disable_resources=["image","media","font"],
    )

    if not page:
        log.error("Thane Scrapling: No response — StealthyFetcher failed")
        return 0

    log.info(f"Thane Scrapling: Page fetched (status check via content length: {len(page.html)})")

    # Check if we got blocked (Cloudflare challenge page)
    page_text = page.text.lower()
    if "checking your browser" in page_text or "cloudflare" in page_text or len(page.html) < 2000:
        log.error("Thane Scrapling: Got Cloudflare challenge page — stealth bypass insufficient")
        log.info("Thane Scrapling: Try running with headless=False to complete the challenge manually")
        return 0

    conn = get_db_conn(); log.info("Thane Scrapling: DB connected")
    seen = set(); total_saved = 0; total_skipped = 0

    # Extract PDFs from main recruitment page
    s, sk = extract_pdfs_from_page(page, conn, seen, BASE_URL)
    total_saved += s; total_skipped += sk

    # Also follow internal recruitment detail links
    detail_urls = []
    for link in page.css("a"):
        href = (link.attrib.get("href","") or "").strip()
        text = " ".join(link.css("::text").getall()).lower()
        if not href or href.startswith("#"): continue
        if not href.startswith("http"): href = f"https://thanepolice.gov.in{href}"
        if "thanepolice.gov.in" not in href: continue
        if any(kw in (href.lower()+" "+text) for kw in VACANCY_KW):
            detail_urls.append(href)

    seen_pages = {BASE_URL}
    for durl in set(detail_urls[:10]):  # Max 10 detail pages
        if durl in seen_pages: continue
        seen_pages.add(durl)
        log.info(f"Thane Scrapling: Detail page -> {durl}")
        dp = fetcher.fetch(durl, headless=True, timeout=45000,
                           network_idle=True, disable_resources=["image","media","font"])
        if not dp: continue
        s, sk = extract_pdfs_from_page(dp, conn, seen, durl)
        total_saved += s; total_skipped += sk

    conn.close()
    log.info(f"Thane Scrapling: Done — saved={total_saved}, skipped={total_skipped}")
    return total_saved

if __name__ == "__main__":
    sys.exit(0 if scrape_thane() >= 0 else 1)
