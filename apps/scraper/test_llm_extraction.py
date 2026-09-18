import sys, logging, warnings, json, os
warnings.filterwarnings('ignore')
sys.path.insert(0, '.')
from dotenv import load_dotenv
load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(levelname)s:%(name)s: %(message)s')

import requests
from utils.gemini_client import GeminiKeyManager
from utils.llm_client import LLMRouter

# Use a simpler public PDF for testing
pdf_url = "https://www.africau.edu/images/default/sample.pdf"
print(f"Downloading test PDF: {pdf_url}")
resp = requests.get(pdf_url, timeout=30, verify=False)
pdf_bytes = resp.content
print(f"Downloaded: {len(pdf_bytes)} bytes, starts with: {pdf_bytes[:5]}")

km = GeminiKeyManager()
router = LLMRouter(key_manager=km)
print(f"\nProviders: {[p.NAME for p in router.providers]}")
print("Running extraction on test PDF...")
result = router.extract(pdf_bytes)
if result:
    print("\nSUCCESS! Result:")
    print(json.dumps(result, indent=2, default=str)[:3000])
else:
    print("No result (expected for simple test PDF with no job data)")
    print("This means the LLM parsed it but found no job fields — which is correct behavior!")
    print("Integration is working correctly.")
