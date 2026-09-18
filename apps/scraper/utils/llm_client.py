# ============================================================
# utils/llm_client.py — Multi-LLM PDF Extraction Router
# ============================================================
# Provider priority: Gemini → DeepSeek → Groq
# - Gemini: native PDF support (best quality)
# - DeepSeek: OpenAI-compatible API, PDF text extracted first
# - Groq: text-only LLaMA model, PDF text extracted first
#
# "Best output" selection: pick the response with most non-null fields.
# ============================================================

import io
import json
import logging
import os
import re
import base64
import time
from typing import Optional, Dict, Any, List

logger = logging.getLogger(__name__)

# ── Rich extraction prompt (expanded to capture all fields) ──────────────────
EXTRACTION_PROMPT = """You are an expert at reading Indian government job/exam notifications (PDFs).

FIRST: Determine if this document is a genuine exam/recruitment-related notification.

STEP 1 — VALIDITY CHECK (do this first):
Ask yourself: "Is this document an actual open recruitment advertisement, exam result,
admit card, answer key, or syllabus?"

INVALID documents (set is_valid_notification=false, notification_type='other', return immediately):
- User manuals, installation guides, VPN guides, technical documentation
- Transfer/posting orders, seniority lists, pay revision orders
- Wording policies, action plans, case management documents
- Court orders, court circulars, cause lists, judgment orders
- Tender notices, procurement notices, rate contracts
- Annual reports, press releases, RTI disclosures
- Any document that is NOT about candidates applying for a job or exam

VALID documents (set is_valid_notification=true, extract all fields):
- Recruitment advertisement with vacancy count and application dates
- Exam result / merit list / selection list
- Admit card / hall ticket / call letter
- Answer key / response sheet / OMR key
- Syllabus / exam pattern
- Corrigendum / correction to any of the above

STEP 2 — EXTRACTION (only if is_valid_notification=true):
Extract ALL available structured data and return ONLY valid JSON.
If a field is not found in the document, use null. Be thorough.

Return exactly this JSON schema (include all keys, null if not found):
{
  "is_valid_notification": <true or false>,
  "notification_type": "<one of: recruitment | result | answer_key | admit_card | syllabus | correction | other>",
  "total_vacancies": <integer or null>,
  "apply_start_date": "<YYYY-MM-DD or null>",
  "apply_end_date": "<YYYY-MM-DD or null>",
  "exam_date": "<YYYY-MM-DD or null>",
  "age_limit": {"min": <int or null>, "max": <int or null>, "obc_relax": <int or null>, "sc_st_relax": <int or null>},
  "application_fee": {"general": <int or null>, "sc_st": <int or null>, "women": <int or null>, "ex_serviceman": <int or null>},
  "selection_process": "<Written Test/Interview/Document Verification/etc. or null>",
  "employment_type": "<Permanent/Contract/Temporary/Deputation or null>",
  "duration": "<e.g. '6 months (extendable)' or null>",
  "salary": {
    "amount": <integer or null>,
    "currency": "INR",
    "period": "<per month/per annum or null>",
    "breakdown": {"base": <int or null>, "hra_percentage": <int or null>, "da_percentage": <int or null>}
  },
  "qualifications": {
    "mandatory": ["<qualification 1>", "<qualification 2>"],
    "desirable": ["<desirable skill 1>"]
  },
  "application_email": "<email address for applications or null>",
  "advertisement_details": {
    "reference_number": "<advt no or null>",
    "date": "<YYYY-MM-DD or null>",
    "issuing_authority": "<name or null>"
  },
  "application_details": {
    "process": "<brief description of how to apply>",
    "required_documents": ["<doc 1>", "<doc 2>"],
    "note": "<important note or null>"
  },
  "org": {
    "department": "<specific department within org or null>",
    "parent_org": "<parent organization name or null>",
    "address": "<full postal address or null>",
    "phone": "<phone number or null>"
  },
  "posts": [
    {
      "post_name": "<string>",
      "vacancies": <int or null>,
      "qualification": "<string or null>",
      "pay_scale": "<string or null>",
      "category": "<Group A/B/C/D or null>",
      "job_type": "<permanent/contractual/temporary or null>",
      "reservation": {"general": <int or null>, "obc": <int or null>, "sc": <int or null>, "st": <int or null>, "ews": <int or null>}
    }
  ]
}

Critical rules:
- is_valid_notification=false → ALL other fields can be null, return immediately
- notification_type MUST be exactly one of: recruitment, result, answer_key, admit_card, syllabus, correction, other
  - recruitment: job/vacancy/bharti/advertisement — candidates apply for a post
  - result:      final result, merit list, selection list, score card, cut off
  - answer_key:  answer key, response sheet, OMR key, model answers
  - admit_card:  admit card, hall ticket, call letter, e-admit card
  - syllabus:    syllabus, exam pattern, curriculum, study material
  - correction:  corrigendum, correction notice, amendment, erratum, revised schedule
  - other:       any document that does NOT fit recruitment/exam flow (manuals, orders, etc.)
- Dates MUST be YYYY-MM-DD format only
- For apply_end_date: look for "Last Date", "Closing Date", "Last day to apply"
- total_vacancies = sum of all post vacancies
- employment_type: look for "Contract", "Permanent", "Temporary", "Deputation"
- salary.amount = final take-home or consolidated amount (include HRA if stated)
- qualifications.mandatory = essential/required qualifications
- qualifications.desirable = preferred/added advantage qualifications
"""

# ── Scoring: how many non-null leaf values does a result have? ───────────────
def _score_result(result: Dict) -> int:
    """Count non-null fields recursively — higher = better extraction."""
    if result is None:
        return 0
    score = 0
    for v in result.values():
        if v is None:
            continue
        elif isinstance(v, dict):
            score += _score_result(v)
        elif isinstance(v, list):
            if v:
                score += len(v)
                for item in v:
                    if isinstance(item, dict):
                        score += _score_result(item)
        else:
            score += 1
    return score


def _clean_json(text: str) -> Optional[Dict]:
    """Strip markdown fences and parse JSON."""
    if not text:
        return None
    text = text.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find JSON object in text
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except Exception:
                pass
    return None


def _extract_pdf_text(pdf_bytes: bytes) -> str:
    """Extract plain text from PDF bytes using pdfplumber (or PyPDF2 fallback)."""
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            pages = []
            for page in pdf.pages[:20]:   # max 20 pages
                text = page.extract_text()
                if text:
                    pages.append(text)
                # Also extract tables as text
                tables = page.extract_tables()
                for table in tables:
                    for row in table:
                        if row:
                            pages.append(' | '.join(str(c) for c in row if c))
            return '\n'.join(pages)
    except ImportError:
        pass

    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        texts = []
        for page in reader.pages[:20]:
            texts.append(page.extract_text() or '')
        return '\n'.join(texts)
    except Exception:
        pass

    return ''


# ── Provider: Gemini ─────────────────────────────────────────────────────────
class GeminiProvider:
    NAME = 'gemini'

    MODEL_CHAIN = [
        "gemini-flash-lite-latest",
        "gemini-flash-latest",
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.5-flash",
    ]

    def __init__(self, key_manager, spider_logger=None):
        self.key_manager = key_manager
        self.log = spider_logger or logger
        self._client = None
        self._model = os.environ.get('GEMINI_MODEL', self.MODEL_CHAIN[0])
        self._key = None
        self._model_idx = 0

    def _configure(self):
        key = self.key_manager.get_current_key()
        if not key:
            self.log.warning('[Gemini] No API key available.')
            return False
        try:
            from google import genai
            self._client = genai.Client(api_key=key)
            self._key = key
            self._model = os.environ.get('GEMINI_MODEL', self.MODEL_CHAIN[0])
            self._model_idx = 0
            self.log.info(f'[Gemini] Ready. model={self._model} key=...{key[-6:]}')
            return True
        except ImportError:
            self.log.error('[Gemini] google-genai not installed.')
            return False

    def _next_model(self) -> bool:
        self._model_idx += 1
        if self._model_idx >= len(self.MODEL_CHAIN):
            return False
        self._model = self.MODEL_CHAIN[self._model_idx]
        self.log.info(f'[Gemini] Fallback to model={self._model}')
        return True

    def extract(self, pdf_bytes: bytes) -> Optional[Dict]:
        current_key = self.key_manager.get_current_key()
        if not self._client or self._key != current_key:
            if not self._configure():
                return None
        from google import genai
        from google.genai import types

        attempts = 0
        while attempts < 8:
            attempts += 1
            try:
                response = self._client.models.generate_content(
                    model=self._model,
                    contents=[
                        types.Part.from_bytes(data=pdf_bytes, mime_type='application/pdf'),
                        EXTRACTION_PROMPT,
                    ]
                )
                result = _clean_json(response.text)
                if result:
                    self.log.info(f'[Gemini] Extracted successfully (score={_score_result(result)})')
                return result

            except Exception as e:
                err = str(e)

                if any(x in err for x in ['429', 'quota', 'ResourceExhausted', 'RESOURCE_EXHAUSTED']):
                    self.log.warning(f'[Gemini] 429/quota on key ...{self._key[-6:]} — rotating key')
                    self.key_manager.mark_exhausted(self._key)
                    if not self._configure():
                        return None

                elif any(x in err for x in ['404', 'NOT_FOUND', 'not available']):
                    self.log.warning(f'[Gemini] 404: model {self._model} unavailable — trying next')
                    if not self._next_model():
                        return None

                elif '503' in err or 'Service Unavailable' in err or 'overloaded' in err.lower():
                    wait = min(5 * attempts, 30)
                    self.log.warning(f'[Gemini] 503 overloaded — waiting {wait}s')
                    time.sleep(wait)

                else:
                    self.log.error(f'[Gemini] Error: {err[:200]}')
                    return None

        return None


# ── Provider: DeepSeek (OpenAI-compatible) ───────────────────────────────────
class DeepSeekProvider:
    NAME = 'deepseek'
    API_BASE = 'https://api.deepseek.com'
    MODEL = 'deepseek-chat'

    def __init__(self, api_key: str, spider_logger=None):
        self.api_key = api_key
        self.log = spider_logger or logger
        self._client = None
        if api_key:
            self._init_client()

    def _init_client(self):
        try:
            from openai import OpenAI
            self._client = OpenAI(api_key=self.api_key, base_url=self.API_BASE)
            self.log.info(f'[DeepSeek] Ready. model={self.MODEL}')
        except ImportError:
            self.log.error('[DeepSeek] openai package not installed. Run: pip install openai')

    def extract(self, pdf_bytes: bytes) -> Optional[Dict]:
        if not self._client:
            return None

        pdf_text = _extract_pdf_text(pdf_bytes)
        if not pdf_text.strip():
            self.log.warning('[DeepSeek] Could not extract PDF text.')
            return None

        # Truncate to ~12000 chars to stay within context limits
        truncated = pdf_text[:12000]
        prompt = f"{EXTRACTION_PROMPT}\n\n--- PDF TEXT START ---\n{truncated}\n--- PDF TEXT END ---"

        try:
            response = self._client.chat.completions.create(
                model=self.MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=2000,
            )
            text = response.choices[0].message.content
            result = _clean_json(text)
            if result:
                self.log.info(f'[DeepSeek] Extracted successfully (score={_score_result(result)})')
            return result

        except Exception as e:
            err = str(e)
            if '429' in err or 'quota' in err.lower() or 'rate' in err.lower():
                self.log.warning(f'[DeepSeek] Rate limit: {err[:100]}')
            elif '402' in err or 'insufficient' in err.lower() or 'balance' in err.lower():
                self.log.warning(f'[DeepSeek] Insufficient balance: {err[:100]}')
            else:
                self.log.error(f'[DeepSeek] Error: {err[:200]}')
            return None


# ── Provider: Groq ───────────────────────────────────────────────────────────
class GroqProvider:
    NAME = 'groq'
    # Models that handle long context well
    MODEL_CHAIN = [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant',
        'mixtral-8x7b-32768',
    ]

    def __init__(self, api_key: str, spider_logger=None):
        self.api_key = api_key
        self.log = spider_logger or logger
        self._client = None
        self._model = self.MODEL_CHAIN[0]
        self._model_idx = 0
        if api_key:
            self._init_client()

    def _init_client(self):
        try:
            from groq import Groq
            self._client = Groq(api_key=self.api_key)
            self.log.info(f'[Groq] Ready. model={self._model}')
        except ImportError:
            self.log.error('[Groq] groq package not installed. Run: pip install groq')

    def _next_model(self) -> bool:
        self._model_idx += 1
        if self._model_idx >= len(self.MODEL_CHAIN):
            return False
        self._model = self.MODEL_CHAIN[self._model_idx]
        self.log.info(f'[Groq] Fallback to model={self._model}')
        return True

    def extract(self, pdf_bytes: bytes) -> Optional[Dict]:
        if not self._client:
            return None

        pdf_text = _extract_pdf_text(pdf_bytes)
        if not pdf_text.strip():
            self.log.warning('[Groq] Could not extract PDF text.')
            return None

        # Groq models have various context windows; truncate conservatively
        truncated = pdf_text[:8000]
        prompt = f"{EXTRACTION_PROMPT}\n\n--- PDF TEXT START ---\n{truncated}\n--- PDF TEXT END ---"

        attempts = 0
        while attempts < 4:
            attempts += 1
            try:
                response = self._client.chat.completions.create(
                    model=self._model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.1,
                    max_tokens=2000,
                )
                text = response.choices[0].message.content
                result = _clean_json(text)
                if result:
                    self.log.info(f'[Groq] Extracted successfully (score={_score_result(result)}) model={self._model}')
                return result

            except Exception as e:
                err = str(e)
                if '429' in err or 'rate' in err.lower() or 'exceeded' in err.lower():
                    self.log.warning(f'[Groq] Rate limit on {self._model} — trying next model')
                    if not self._next_model():
                        return None
                elif 'context' in err.lower() or 'token' in err.lower():
                    self.log.warning(f'[Groq] Context too long — trimming and retrying')
                    truncated = truncated[:len(truncated) // 2]
                    prompt = f"{EXTRACTION_PROMPT}\n\n--- PDF TEXT ---\n{truncated}\n--- END ---"
                else:
                    self.log.error(f'[Groq] Error: {err[:200]}')
                    return None

        return None


# ── LLM Router ───────────────────────────────────────────────────────────────
class LLMRouter:
    """
    Orchestrates Gemini → DeepSeek → Groq for PDF extraction.

    Strategy:
    1. Try all enabled providers in priority order
    2. Collect all successful results
    3. Return the result with the highest score (most non-null fields)

    On hard failures (no key, import error, etc.) a provider is skipped silently.
    On soft failures (rate limit, 503) the provider is retried per its own logic.
    """

    def __init__(self, key_manager=None, spider_logger=None):
        self.log = spider_logger or logger
        self.providers: List = []

        # 1. Gemini — requires google-genai + key
        if key_manager and key_manager.api_keys:
            try:
                from google import genai  # noqa: F401
                self.providers.append(GeminiProvider(key_manager, spider_logger))
                self.log.info('[LLMRouter] GeminiProvider registered.')
            except ImportError:
                self.log.warning('[LLMRouter] google-genai not installed — Gemini disabled.')
        else:
            self.log.warning('[LLMRouter] No Gemini keys — Gemini disabled.')

        """ # 2. DeepSeek
        deepseek_key = os.environ.get('DEEPSEEK_API_KEY', '').strip()
        if deepseek_key and 'ADD_YOUR' not in deepseek_key.upper():
            try:
                from openai import OpenAI  # noqa: F401
                self.providers.append(DeepSeekProvider(deepseek_key, spider_logger))
                self.log.info('[LLMRouter] DeepSeekProvider registered.')
            except ImportError:
                self.log.warning('[LLMRouter] openai package not installed — DeepSeek disabled.')
        else:
            self.log.warning('[LLMRouter] No DEEPSEEK_API_KEY — DeepSeek disabled.')

        # 3. Groq
        groq_key = os.environ.get('GROQ_API_KEY', '').strip()
        if groq_key and 'ADD_YOUR' not in groq_key.upper():
            try:
                from groq import Groq  # noqa: F401
                self.providers.append(GroqProvider(groq_key, spider_logger))
                self.log.info('[LLMRouter] GroqProvider registered.')
            except ImportError:
                self.log.warning('[LLMRouter] groq package not installed — Groq disabled.')
        else:
            self.log.warning('[LLMRouter] No GROQ_API_KEY — Groq disabled.') """

        if not self.providers:
            self.log.error('[LLMRouter] No LLM providers available! PDF extraction disabled.')

    @property
    def is_available(self) -> bool:
        return len(self.providers) > 0

    def extract(self, pdf_bytes: bytes) -> Optional[Dict]:
        """
        Try all providers, collect results, return the best one.
        Best = most non-null leaf values (highest _score_result).
        """
        results = []

        for provider in self.providers:
            try:
                self.log.info(f'[LLMRouter] Trying provider={provider.NAME}')
                result = provider.extract(pdf_bytes)
                if result:
                    score = _score_result(result)
                    self.log.info(f'[LLMRouter] provider={provider.NAME} score={score}')
                    results.append((score, provider.NAME, result))
                else:
                    self.log.warning(f'[LLMRouter] provider={provider.NAME} returned no result')
            except Exception as e:
                self.log.error(f'[LLMRouter] provider={provider.NAME} crashed: {e}')

        if not results:
            self.log.error('[LLMRouter] All providers failed.')
            return None

        # Pick best result
        results.sort(key=lambda x: x[0], reverse=True)
        best_score, best_name, best_result = results[0]
        self.log.info(f'[LLMRouter] Best result from provider={best_name} score={best_score}')
        return best_result
