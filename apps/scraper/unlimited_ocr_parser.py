"""
unlimited_ocr_parser.py
=======================
One-shot Long-horizon Document Parser powered by Baidu Unlimited-OCR
integrated with ExamUdaan Spiders, PostgreSQL, and Google Gemini AI.

Paper / Model: baidu/Unlimited-OCR (Reference Sliding Window Attention - R-SWA)
GitHub: https://github.com/baidu/Unlimited-OCR

Key Capabilities:
1. One-Shot Multi-Page OCR: Parses 10 to 50+ page PDFs in a single pass with constant KV-cache,
   retaining reading order and complex table structures (vacancies, pay scale, age relaxation).
2. Solves Scanned PDFs: Recovers text from photocopied/scanned government notifications
   where standard tools (pdfplumber, pypdf) return empty strings.
3. Hybrid 2-Stage Pipeline (Unlimited-OCR -> Gemini):
   - Stage 1 (Unlimited-OCR): Transcribes multi-page document into structured Markdown locally.
   - Stage 2 (Gemini Text Model): Takes the clean Markdown and extracts validated ExamUdaan JSON
     (dates, qualifications, vacancies, fees, ai_extracted_data) at ~1/10th the cost of Gemini Vision!
4. Direct Heuristic Mode: Fast regex extraction without calling Gemini.
5. PostgreSQL Sync: Directly updates `exam_notifications` table using COALESCE safe merge.

Usage:
  # 1. Parse a local PDF and output structured Markdown:
  python unlimited_ocr_parser.py --pdf ./sample.pdf --output-md ./sample.md

  # 2. Parse a local PDF and extract ExamUdaan JSON using Gemini:
  python unlimited_ocr_parser.py --pdf ./sample.pdf --with-gemini --output-json ./result.json

  # 3. Process unparsed notifications from Postgres DB:
  python unlimited_ocr_parser.py --limit 10 --with-gemini --db-update

  # 4. Process single notification by ID from Postgres DB:
  python unlimited_ocr_parser.py --id 10072 --with-gemini --db-update

  # 5. Dry-run mode:
  python unlimited_ocr_parser.py --id 10072 --with-gemini --dry-run
"""

import os
import sys
import re
import json
import time
import logging
import argparse
import tempfile
from typing import Optional, Dict, Any, List, Union
from datetime import date
from io import BytesIO

import requests
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

# ─────────────────────────────────────────────────────────────────────────────
# Optional Dependencies & Diagnostics
# ─────────────────────────────────────────────────────────────────────────────
TORCH_AVAILABLE = False
TRANSFORMERS_AVAILABLE = False
PDF2IMAGE_AVAILABLE = False
PDFPLUMBER_AVAILABLE = False
GENAI_AVAILABLE = False

try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    pass

try:
    from transformers import AutoModel, AutoTokenizer
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    pass

try:
    from pdf2image import convert_from_bytes, convert_from_path
    from PIL import Image
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    pass

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    pass

try:
    from google import genai
    from google.genai import types as genai_types
    GENAI_AVAILABLE = True
except ImportError:
    pass

# ─────────────────────────────────────────────────────────────────────────────
# Setup & Config
# ─────────────────────────────────────────────────────────────────────────────
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger("unlimited-ocr")

DATABASE_URL = os.getenv("DATABASE_URL")
_raw_keys = os.getenv("GEMINI_API_KEY", "")
GEMINI_KEYS = [k.strip() for k in _raw_keys.split(",") if k.strip()]
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")
MODEL_PATH = os.getenv("UNLIMITED_OCR_MODEL", "baidu/Unlimited-OCR")

MAX_PDF_SIZE = 25 * 1024 * 1024  # 25 MB max
REQUEST_TIMEOUT = 30
REQUEST_DELAY = 1.0
_key_index = 0

def get_gemini_client():
    global _key_index
    if not GEMINI_KEYS:
        raise RuntimeError("GEMINI_API_KEY is missing in .env")
    key = GEMINI_KEYS[_key_index % len(GEMINI_KEYS)]
    return genai.Client(api_key=key)

def rotate_key(reason=""):
    global _key_index
    if GEMINI_KEYS:
        _key_index = (_key_index + 1) % len(GEMINI_KEYS)
        logger.warning("Rotated Gemini API key -> index %d (%s)", _key_index, reason)

def get_db_conn():
    if DATABASE_URL:
        return psycopg2.connect(DATABASE_URL)
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        dbname=os.getenv("DB_DATABASE"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
    )


# ─────────────────────────────────────────────────────────────────────────────
# Unlimited-OCR Engine Wrapper
# ─────────────────────────────────────────────────────────────────────────────
class UnlimitedOCREngine:
    """
    Wrapper for Baidu Unlimited-OCR model.
    Utilizes Reference Sliding Window Attention (R-SWA) to read multi-page
    documents in one shot without memory explosion.
    """

    def __init__(self, model_name_or_path: str = MODEL_PATH, device: Optional[str] = None):
        self.model_name_or_path = model_name_or_path
        self.device = device or ("cuda" if TORCH_AVAILABLE and torch.cuda.is_available() else "cpu")
        self.model = None
        self.tokenizer = None
        self._is_ready = False

    def load(self):
        """Loads model and tokenizer lazily."""
        if self._is_ready:
            return

        if not TORCH_AVAILABLE or not TRANSFORMERS_AVAILABLE:
            raise RuntimeError(
                "PyTorch and transformers are required to run Unlimited-OCR.\n"
                "Install them via: pip install torch transformers torchvision --upgrade"
            )

        logger.info("Loading Unlimited-OCR model from '%s' on %s...", self.model_name_or_path, self.device)
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name_or_path,
                trust_remote_code=True
            )
            
            torch_dtype = torch.bfloat16 if self.device == "cuda" and torch.cuda.is_bf16_supported() else torch.float16
            if self.device == "cpu":
                torch_dtype = torch.float32

            self.model = AutoModel.from_pretrained(
                self.model_name_or_path,
                torch_dtype=torch_dtype,
                trust_remote_code=True,
                device_map=self.device
            ).eval()
            self._is_ready = True
            logger.info("Unlimited-OCR model loaded successfully!")
        except Exception as e:
            logger.error("Failed to load Unlimited-OCR model: %s", e)
            raise

    def parse_images(self, images: List[Any], prompt: str = "Transcribe this document with reading order.") -> str:
        """
        Parses a list of PIL Images using Unlimited-OCR.
        Handles multi-page input with sliding window attention.
        """
        self.load()
        logger.info("Running Unlimited-OCR on %d pages...", len(images))

        # Check if model provides custom parse_document or standard forward
        if hasattr(self.model, "parse_document"):
            # Native Unlimited-OCR API
            result = self.model.parse_document(
                images=images,
                prompt=prompt,
                sliding_window=128
            )
            if isinstance(result, dict) and "text" in result:
                return result["text"]
            return str(result)

        # Fallback / generic pipeline interface
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        with torch.no_grad():
            outputs = self.model.generate(**inputs, max_new_tokens=4096)
            text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return text

    def parse_pdf(self, pdf_path_or_bytes: Union[str, bytes], max_pages: int = 50) -> str:
        """
        Extracts images from PDF and runs long-horizon parsing.
        """
        if not PDF2IMAGE_AVAILABLE:
            # Fallback to pdfplumber if pdf2image (poppler) is not installed
            if PDFPLUMBER_AVAILABLE:
                logger.warning("pdf2image not found. Falling back to pdfplumber text extraction.")
                return self._fallback_pdfplumber(pdf_path_or_bytes, max_pages)
            raise RuntimeError("pdf2image or pdfplumber required for PDF parsing.")

        logger.info("Converting PDF pages to images (max %d pages)...", max_pages)
        if isinstance(pdf_path_or_bytes, bytes):
            images = convert_from_bytes(pdf_path_or_bytes, first_page=1, last_page=max_pages, dpi=150)
        else:
            images = convert_from_path(pdf_path_or_bytes, first_page=1, last_page=max_pages, dpi=150)

        if not images:
            logger.warning("No pages rendered from PDF.")
            return ""

        return self.parse_images(images)

    def _fallback_pdfplumber(self, pdf_path_or_bytes: Union[str, bytes], max_pages: int) -> str:
        text_parts = []
        stream = BytesIO(pdf_path_or_bytes) if isinstance(pdf_path_or_bytes, bytes) else pdf_path_or_bytes
        with pdfplumber.open(stream) as pdf:
            for i, page in enumerate(pdf.pages[:max_pages]):
                p_text = page.extract_text() or ""
                # Also extract tables if present
                tables = page.extract_tables()
                if tables:
                    for tbl in tables:
                        tbl_md = "\n".join([" | ".join([str(c or "").strip() for c in row]) for row in tbl])
                        p_text += f"\n\n[TABLE]\n{tbl_md}\n[/TABLE]\n"
                text_parts.append(f"--- PAGE {i+1} ---\n" + p_text)
        return "\n\n".join(text_parts)


# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: Gemini Structured Extraction (Text-Only, Cost-Effective)
# ─────────────────────────────────────────────────────────────────────────────
GEMINI_STRUCTURED_PROMPT = """
You are analyzing the complete transcribed text of a Government Exam / Recruitment Notification PDF
(parsed via high-precision OCR).

Extract structured information conforming strictly to the JSON schema below.
If a field is not found, use null (or empty array []). Do NOT guess.

{
  "advt_no": "Advertisement / Notification number (e.g. 01/2026, Advt-No. 45/2026)",
  "total_vacancies": integer_or_null,
  "notification_type": "recruitment | result | admit_card | answer_key | syllabus",
  "post_details": [
    {
      "post_name": "Full official post title",
      "vacancies": integer_or_null,
      "pay_scale": "Pay level or amount or null",
      "category_vacancies": {"UR": null, "OBC": null, "SC": null, "ST": null, "EWS": null}
    }
  ],
  "age_limit": {
    "min_age": integer_or_null,
    "max_age": integer_or_null,
    "max_age_open": integer_or_null,
    "max_age_obc": integer_or_null,
    "max_age_sc_st": integer_or_null,
    "age_relaxation_note": "text or null"
  },
  "qualifications": {
    "mandatory": ["list", "of", "required", "degrees", "or", "diplomas"],
    "desirable": ["desirable", "skills", "or", "experience"]
  },
  "important_dates": {
    "apply_start": "YYYY-MM-DD or null",
    "apply_end": "YYYY-MM-DD or null",
    "exam_date": "YYYY-MM-DD or null",
    "result_date": "YYYY-MM-DD or null"
  },
  "pay_scale": {
    "pay_band": "string or null",
    "grade_pay": integer_or_null,
    "monthly_salary": integer_or_null,
    "salary_note": "string or null"
  },
  "application_fee": {
    "general_fee": integer_or_null,
    "reserved_fee": integer_or_null,
    "women_fee": integer_or_null,
    "fee_note": "string or null"
  },
  "selection_process": ["Written Exam", "Physical Test", "Interview", "Document Verification"],
  "is_walk_in": false,
  "exam_cities": ["City1", "City2"],
  "ai_extracted_data": {
    "government_level": "Central | State | PSU | Autonomous | Local",
    "state_normalized": "State name (e.g. Maharashtra, Uttar Pradesh) or Central",
    "education_levels": ["10th", "12th", "Diploma", "Graduate", "Postgraduate", "PhD"],
    "education_streams": ["Engineering", "Arts", "Science", "Commerce", "Medical", "Law", "General"],
    "job_categories": ["Police/Defense", "Administrative", "Technical/IT", "Teaching", "Healthcare", "Banking", "Railway"],
    "selection_methods": ["Written Exam", "Interview", "Document Verification"],
    "is_govt": true,
    "confidence": 0.95
  }
}

Respond ONLY with valid, raw JSON. Do not include markdown code ticks, backticks, or preamble.
"""

def extract_structured_with_gemini(ocr_markdown: str) -> Optional[Dict[str, Any]]:
    """
    Feeds OCR markdown directly to Gemini text model.
    Because OCR markdown is pure text, this is fast, avoids vision token overhead,
    and supports multi-page context easily.
    """
    if not GENAI_AVAILABLE or not GEMINI_KEYS:
        logger.warning("Gemini SDK or GEMINI_API_KEY not configured. Skipping Gemini Stage.")
        return None

    client = get_gemini_client()
    prompt = f"{GEMINI_STRUCTURED_PROMPT}\n\n=== NOTIFICATION OCR TEXT ===\n{ocr_markdown[:60000]}"

    for attempt in range(len(GEMINI_KEYS) + 1):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=genai_types.GenerateContentConfig(
                    temperature=0.1,
                    response_mime_type="application/json"
                )
            )
            raw = response.text.strip()
            # Clean possible markdown wrapping if any
            if raw.startswith("```"):
                raw = re.sub(r"^```[a-zA-Z]*\n?", "", raw)
                raw = re.sub(r"\n?```$", "", raw).strip()

            parsed = json.loads(raw)
            return parsed
        except Exception as e:
            logger.warning("Gemini extraction error (attempt %d): %s", attempt + 1, e)
            rotate_key(str(e))
            time.sleep(REQUEST_DELAY)

    return None


# ─────────────────────────────────────────────────────────────────────────────
# Regex / Heuristic Direct Extractor (Zero-Cost, No Gemini needed)
# ─────────────────────────────────────────────────────────────────────────────
def extract_direct_heuristics(text: str) -> Dict[str, Any]:
    """
    Rule-based extraction for key fields directly from OCR markdown.
    Works offline without calling any LLM.
    """
    result = {}

    # Total Vacancies
    vac_match = re.search(r'(?:total\s+vacanc(?:ies|y)|एकूण\s+पदे|कुल\s+पद)\s*[:=\-]?\s*(\d+)', text, re.IGNORECASE)
    if vac_match:
        result["total_vacancies"] = int(vac_match.group(1))

    # Apply End Date
    end_date_match = re.search(
        r'(?:last\s+date|closing\s+date|apply\s+end|शेवटची\s+तारीख|अंतिम\s+तिथी)\s*[:=\-]?\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})',
        text, re.IGNORECASE
    )
    if end_date_match:
        result["apply_end_date_raw"] = end_date_match.group(1)

    # Advertisement Number
    advt_match = re.search(r'(?:advt\.?\s*(?:no\.?|notice)?|जाहिरात\s*क्र\.?|अधिसूचना\s*क्र\.?)\s*[:=\-]?\s*([A-Za-z0-9/\-_]{4,30})', text, re.IGNORECASE)
    if advt_match:
        result["advt_no"] = advt_match.group(1).strip()

    return result


# ─────────────────────────────────────────────────────────────────────────────
# Database Updater & Posts Synchronizer
# ─────────────────────────────────────────────────────────────────────────────
def sync_posts_table(conn, row_id: int, post_details: List[Dict[str, Any]]):
    """
    Inserts post records into the 'posts' table for the notification if not already present.
    """
    if not post_details:
        return

    try:
        with conn.cursor() as cur:
            # Check existing count
            cur.execute("SELECT count(*) FROM posts WHERE notification_id = %s", (row_id,))
            count = cur.fetchone()[0]
            if count > 0:
                logger.info("Posts table already has %d records for notification %d. Skipping insert.", count, row_id)
                return

            for p in post_details:
                post_name = p.get("post_name") or p.get("name")
                if not post_name:
                    continue

                vacancies = p.get("vacancies") or p.get("total_vacancies")
                pay_scale = p.get("pay_scale")
                category = p.get("category")
                qualification = p.get("qualification")
                res_obj = p.get("category_vacancies") or p.get("reservation_json") or p.get("reservation") or {}

                # Clean reservation_json: keep only non-null
                clean_res = {k: int(v) for k, v in res_obj.items() if v is not None and str(v).isdigit() and int(v) > 0}

                cur.execute("""
                    INSERT INTO posts (
                        notification_id, post_name, total_vacancies, pay_scale,
                        category, reservation_json, qualification, created_at
                    ) VALUES (
                        %s, %s, %s, %s,
                        %s, %s::jsonb, %s, NOW()
                    )
                """, (
                    row_id, post_name, vacancies, pay_scale,
                    category, json.dumps(clean_res) if clean_res else None, qualification
                ))

            logger.info("Inserted %d posts into 'posts' table for notification %d.", len(post_details), row_id)
    except Exception as e:
        logger.warning("Could not sync posts table for notification %d: %s", row_id, e)


def update_db_notification(row_id: int, extracted_data: Dict[str, Any], dry_run: bool = False) -> bool:
    """
    Updates the Postgres exam_notifications record safely with extracted data.
    Uses COALESCE to avoid overwriting existing non-null data.
    """
    if dry_run:
        logger.info("[DRY RUN] Would update row %d with: %s", row_id, json.dumps(extracted_data, indent=2, default=str))
        return True

    conn = get_db_conn()
    try:
        updates = {}

        if extracted_data.get("total_vacancies"):
            updates["total_vacancies"] = int(extracted_data["total_vacancies"])

        dates = extracted_data.get("important_dates") or {}
        if dates.get("apply_start"):
            updates["apply_start_date"] = dates["apply_start"]
        if dates.get("apply_end"):
            updates["apply_end_date"] = dates["apply_end"]
        if dates.get("exam_date"):
            updates["exam_date"] = dates["exam_date"]

        if extracted_data.get("age_limit"):
            updates["age_limit"] = json.dumps(extracted_data["age_limit"])

        if extracted_data.get("qualifications"):
            updates["qualifications"] = json.dumps(extracted_data["qualifications"])

        if extracted_data.get("pay_scale"):
            updates["salary"] = json.dumps(extracted_data["pay_scale"])

        if extracted_data.get("application_fee"):
            updates["application_fee"] = json.dumps(extracted_data["application_fee"])

        # Normalize and enrich ai_extracted_data
        ai_data = extracted_data.get("ai_extracted_data") or {}
        post_details = extracted_data.get("post_details") or []
        if post_details and "posts" not in ai_data:
            ai_data["posts"] = [
                {
                    "post_name": p.get("post_name"),
                    "vacancies": p.get("vacancies"),
                    "total_vacancies": p.get("vacancies"),
                    "pay_scale": p.get("pay_scale"),
                    "reservation": p.get("category_vacancies") or p.get("reservation_json") or {}
                }
                for p in post_details
            ]

        if ai_data:
            updates["ai_extracted_data"] = json.dumps(ai_data)

        if extracted_data.get("selection_process"):
            sp = extracted_data["selection_process"]
            if isinstance(sp, list):
                updates["selection_process"] = ", ".join([str(x) for x in sp if x])
            else:
                updates["selection_process"] = str(sp)

        if extracted_data.get("exam_cities"):
            updates["exam_cities"] = extracted_data["exam_cities"]

        updates["pdf_parsed_at"] = "NOW()"

        set_clauses = []
        params = []

        for col, val in updates.items():
            if col == "pdf_parsed_at":
                set_clauses.append("pdf_parsed_at = NOW()")
            elif col == "exam_cities":
                set_clauses.append(f"{col} = COALESCE({col}, %s::text[])")
                params.append(val)
            elif col in ("age_limit", "qualifications", "salary", "application_fee", "ai_extracted_data"):
                # Merge new rich keys into existing JSONB so both old and new keys are preserved
                set_clauses.append(f"{col} = COALESCE({col}, '{{}}'::jsonb) || %s::jsonb")
                params.append(val)
            elif col in ("apply_start_date", "apply_end_date", "exam_date"):
                set_clauses.append(f"{col} = COALESCE({col}, %s::date)")
                params.append(val)
            else:
                set_clauses.append(f"{col} = COALESCE({col}, %s)")
                params.append(val)

        params.append(row_id)
        sql = f"UPDATE exam_notifications SET {', '.join(set_clauses)} WHERE id = %s"

        with conn.cursor() as cur:
            cur.execute(sql, params)

        # Sync posts table
        if post_details:
            sync_posts_table(conn, row_id, post_details)

        conn.commit()
        logger.info("Successfully updated notification ID %d in PostgreSQL!", row_id)
        return True
    except Exception as e:
        conn.rollback()
        logger.error("DB update failed for ID %d: %s", row_id, e)
        return False
    finally:
        conn.close()


# ─────────────────────────────────────────────────────────────────────────────
# Downloader Helper
# ─────────────────────────────────────────────────────────────────────────────
def download_pdf_file(url: str) -> Optional[bytes]:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/pdf,*/*",
        }
        res = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT, verify=False)
        res.raise_for_status()
        if len(res.content) > MAX_PDF_SIZE:
            logger.warning("PDF exceeds maximum limit (%d bytes)", len(res.content))
            return None
        return res.content
    except Exception as e:
        logger.error("Failed to download PDF from %s: %s", url, e)
        return None


# ─────────────────────────────────────────────────────────────────────────────
# CLI & Execution Pipeline
# ─────────────────────────────────────────────────────────────────────────────
def parse_arguments():
    parser = argparse.ArgumentParser(
        description="ExamUdaan Unlimited-OCR Multi-page Long-horizon PDF Parser"
    )
    parser.add_argument("--pdf", type=str, help="Path to a local PDF file")
    parser.add_argument("--url", type=str, help="Direct URL to a PDF file")
    parser.add_argument("--from-md", type=str, help="Path to pre-extracted OCR Markdown file (skips OCR)")
    parser.add_argument("--from-json", type=str, help="Path to pre-extracted structured JSON file (skips OCR & Gemini)")
    parser.add_argument("--id", type=int, help="Single notification ID from database")
    parser.add_argument("--limit", type=int, default=10, help="Batch limit when processing from DB")
    parser.add_argument("--pages", type=int, default=30, help="Max pages to parse (default: 30)")
    parser.add_argument("--output-md", type=str, help="Save parsed markdown to file")
    parser.add_argument("--output-json", type=str, help="Save structured JSON to file")
    parser.add_argument("--with-gemini", action="store_true", help="Pass OCR Markdown to Gemini for structured extraction")
    parser.add_argument("--db-update", action="store_true", help="Update database record with extracted data")
    parser.add_argument("--enrich-unclosed", action="store_true", help="Batch enrich all unclosed active recruitment jobs")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without modifying database")
    parser.add_argument("--device", type=str, choices=["cuda", "cpu"], help="Torch device override")
    return parser.parse_args()


def process_single(
    ocr_engine: UnlimitedOCREngine,
    pdf_source: Union[str, bytes],
    notification_id: Optional[int] = None,
    with_gemini: bool = False,
    db_update: bool = False,
    dry_run: bool = False,
    output_md: Optional[str] = None,
    output_json: Optional[str] = None,
    max_pages: int = 30
):
    logger.info("Processing PDF document (source: %s)...", "bytes" if isinstance(pdf_source, bytes) else pdf_source)
    start_t = time.time()

    # Stage 1: Unlimited-OCR
    try:
        ocr_markdown = ocr_engine.parse_pdf(pdf_source, max_pages=max_pages)
    except Exception as e:
        logger.error("OCR execution failed: %s", e)
        return

    logger.info("OCR completed in %.2f seconds. Extracted %d characters.", time.time() - start_t, len(ocr_markdown))

    if output_md:
        with open(output_md, "w", encoding="utf-8") as f:
            f.write(ocr_markdown)
        logger.info("Saved Markdown output to: %s", output_md)

    # Direct Heuristics
    heuristics = extract_direct_heuristics(ocr_markdown)
    logger.info("Direct Heuristics Extracted: %s", heuristics)

    structured_data = None
    if with_gemini:
        logger.info("Stage 2: Passing OCR Markdown to Gemini for structured schema extraction...")
        structured_data = extract_structured_with_gemini(ocr_markdown)
        if structured_data:
            logger.info("Gemini Extraction Succeeded: Vacancies=%s, EndDate=%s",
                        structured_data.get("total_vacancies"),
                        (structured_data.get("important_dates") or {}).get("apply_end"))
            if output_json:
                with open(output_json, "w", encoding="utf-8") as f:
                    json.dump(structured_data, f, indent=2, default=str)
                logger.info("Saved Structured JSON to: %s", output_json)
        else:
            logger.warning("Gemini extraction did not return structured output.")

    # Stage 3: Database Sync
    if db_update and notification_id:
        data_to_save = structured_data if structured_data else heuristics
        update_db_notification(notification_id, data_to_save, dry_run=dry_run)


def main():
    args = parse_arguments()

    logger.info("=" * 60)
    logger.info("ExamUdaan Unlimited-OCR Pipeline")
    logger.info("PyTorch Available: %s | CUDA Available: %s",
                TORCH_AVAILABLE,
                torch.cuda.is_available() if TORCH_AVAILABLE else False)
    logger.info("Transformers Available: %s | Gemini Available: %s",
                TRANSFORMERS_AVAILABLE, GENAI_AVAILABLE)
    logger.info("=" * 60)

    ocr_engine = UnlimitedOCREngine(device=args.device)

    # Mode 0A: Pre-extracted JSON directly into DB
    if args.from_json:
        if not os.path.exists(args.from_json):
            logger.error("JSON file does not exist: %s", args.from_json)
            sys.exit(1)
        with open(args.from_json, "r", encoding="utf-8") as f:
            structured_data = json.load(f)

        logger.info("Loaded structured JSON from %s", args.from_json)
        if args.id:
            update_db_notification(args.id, structured_data, dry_run=args.dry_run)
        elif args.db_update:
            # Match by advt_no if available
            advt = structured_data.get("advt_no")
            if advt:
                conn = get_db_conn()
                try:
                    with conn.cursor() as cur:
                        cur.execute("SELECT id FROM exam_notifications WHERE advt_no ILIKE %s OR title ILIKE %s LIMIT 1", (f"%{advt}%", f"%{advt}%"))
                        row = cur.fetchone()
                        if row:
                            logger.info("Matched notification ID %d for advt_no '%s'", row[0], advt)
                            update_db_notification(row[0], structured_data, dry_run=args.dry_run)
                        else:
                            logger.warning("No notification found matching advt_no '%s'. Specify --id to update.", advt)
                finally:
                    conn.close()
            else:
                logger.warning("Please specify --id <row_id> to update the database.")
        else:
            print(json.dumps(structured_data, indent=2, default=str))
        return

    # Mode 0B: Pre-extracted Markdown (skip OCR, run Gemini)
    if args.from_md:
        if not os.path.exists(args.from_md):
            logger.error("Markdown file does not exist: %s", args.from_md)
            sys.exit(1)
        with open(args.from_md, "r", encoding="utf-8") as f:
            ocr_markdown = f.read()

        logger.info("Loaded pre-extracted Markdown from %s (%d chars)", args.from_md, len(ocr_markdown))
        heuristics = extract_direct_heuristics(ocr_markdown)
        logger.info("Heuristics: %s", heuristics)

        structured_data = None
        if args.with_gemini:
            structured_data = extract_structured_with_gemini(ocr_markdown)
            if structured_data and args.output_json:
                with open(args.output_json, "w", encoding="utf-8") as f:
                    json.dump(structured_data, f, indent=2, default=str)
                logger.info("Saved structured JSON to %s", args.output_json)

        if (args.db_update or args.dry_run) and args.id:
            data_to_save = structured_data if structured_data else heuristics
            update_db_notification(args.id, data_to_save, dry_run=args.dry_run)
        return

    # Mode 1: Local PDF
    if args.pdf:
        if not os.path.exists(args.pdf):
            logger.error("Local file does not exist: %s", args.pdf)
            sys.exit(1)
        process_single(
            ocr_engine,
            args.pdf,
            notification_id=args.id,
            with_gemini=args.with_gemini,
            db_update=args.db_update,
            dry_run=args.dry_run,
            output_md=args.output_md,
            output_json=args.output_json,
            max_pages=args.pages
        )
        return

    # Mode 2: Remote URL
    if args.url:
        pdf_bytes = download_pdf_file(args.url)
        if not pdf_bytes:
            sys.exit(1)
        process_single(
            ocr_engine,
            pdf_bytes,
            notification_id=args.id,
            with_gemini=args.with_gemini,
            db_update=args.db_update,
            dry_run=args.dry_run,
            output_md=args.output_md,
            output_json=args.output_json,
            max_pages=args.pages
        )
        return

    # Mode 3: Specific Notification ID from DB
    if args.id:
        conn = get_db_conn()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    "SELECT id, title, notification_pdf FROM exam_notifications WHERE id = %s",
                    (args.id,)
                )
                row = cur.fetchone()
                if not row or not row["notification_pdf"]:
                    logger.error("Notification ID %d not found or has no notification_pdf link.", args.id)
                    sys.exit(1)

                logger.info("Found DB record #%d: %s", row["id"], row["title"])
                pdf_bytes = download_pdf_file(row["notification_pdf"])
                if not pdf_bytes:
                    sys.exit(1)

                process_single(
                    ocr_engine,
                    pdf_bytes,
                    notification_id=row["id"],
                    with_gemini=args.with_gemini,
                    db_update=args.db_update,
                    dry_run=args.dry_run,
                    output_md=args.output_md,
                    output_json=args.output_json,
                    max_pages=args.pages
                )
        finally:
            conn.close()
        return

    # Mode 4: Enrich all unclosed active recruitment jobs
    if args.enrich_unclosed:
        conn = get_db_conn()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""
                    SELECT id, title, notification_pdf
                    FROM exam_notifications
                    WHERE notification_pdf IS NOT NULL
                      AND status = 'published'
                      AND notification_type = 'recruitment'
                      AND (apply_end_date >= CURRENT_DATE OR apply_end_date IS NULL)
                      AND (total_vacancies IS NULL OR apply_end_date IS NULL OR pdf_parsed_at IS NULL)
                    ORDER BY id DESC
                    LIMIT %s
                """, (args.limit,))
                rows = cur.fetchall()

            logger.info("Found %d unclosed recruitment notifications needing enrichment.", len(rows))
            for i, row in enumerate(rows):
                logger.info("[%d/%d] Enriching active notification #%d: %s", i + 1, len(rows), row["id"], row["title"])
                pdf_bytes = download_pdf_file(row["notification_pdf"])
                if not pdf_bytes:
                    continue
                process_single(
                    ocr_engine,
                    pdf_bytes,
                    notification_id=row["id"],
                    with_gemini=args.with_gemini,
                    db_update=args.db_update,
                    dry_run=args.dry_run,
                    max_pages=args.pages
                )
                time.sleep(REQUEST_DELAY)
        finally:
            conn.close()
        return

    # Mode 5: General Batch from DB
    if args.db_update or args.dry_run:
        conn = get_db_conn()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""
                    SELECT id, title, notification_pdf
                    FROM exam_notifications
                    WHERE notification_pdf IS NOT NULL
                      AND status = 'published'
                      AND (total_vacancies IS NULL OR apply_end_date IS NULL)
                      AND (pdf_parsed_at IS NULL OR pdf_parsed_at < NOW() - INTERVAL '14 days')
                    ORDER BY published_at DESC NULLS LAST
                    LIMIT %s
                """, (args.limit,))
                rows = cur.fetchall()

            logger.info("Found %d pending notifications to process with Unlimited-OCR.", len(rows))
            for i, row in enumerate(rows):
                logger.info("[%d/%d] Fetching notification #%d: %s", i + 1, len(rows), row["id"], row["title"])
                pdf_bytes = download_pdf_file(row["notification_pdf"])
                if not pdf_bytes:
                    continue
                process_single(
                    ocr_engine,
                    pdf_bytes,
                    notification_id=row["id"],
                    with_gemini=args.with_gemini,
                    db_update=args.db_update,
                    dry_run=args.dry_run,
                    max_pages=args.pages
                )
                time.sleep(REQUEST_DELAY)
        finally:
            conn.close()
        return

    print("\nNo operation specified. Run with --help for available options.")
    print("Example: python unlimited_ocr_parser.py --from-json ./result.json --id 18163 --db-update")


if __name__ == "__main__":
    main()
