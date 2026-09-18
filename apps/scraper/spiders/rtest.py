from google import genai
from google.genai import types
import requests
import json
import tempfile
from pathlib import Path
import time
import urllib3
import ssl
import warnings

# Disable SSL warnings for old government servers
warnings.filterwarnings('ignore', message='Unverified HTTPS request')
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Your API key
API_KEY = ""  # Replace with your actual key


# Your working model
MODEL = "gemini-3.1-flash-lite-preview"

# PDF URL
PDF_URL = "https://upsssc.gov.in/ViewPdf.aspx?9/9aa8mvUjMP442KKBRGmRogliXNUMr1JBTtyoDtp54="

# Custom SSL context for legacy servers
class CustomHttpAdapter(requests.adapters.HTTPAdapter):
    """Transport adapter that allows unsafe legacy renegotiation"""
    
    def init_poolmanager(self, connections, maxsize, block=False):
        ctx = ssl.create_default_context()
        # Allow legacy renegotiation
        ctx.options |= ssl.OP_LEGACY_SERVER_CONNECT
        # Don't verify certificates (government sites often have issues)
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        self.poolmanager = urllib3.PoolManager(
            num_pools=connections,
            maxsize=maxsize,
            block=block,
            ssl_context=ctx
        )

def create_session():
    """Create a requests session that can handle legacy SSL"""
    session = requests.Session()
    adapter = CustomHttpAdapter()
    session.mount('https://', adapter)
    session.verify = False
    return session

def download_pdf(url, retries=3):
    """Download PDF with retry logic and SSL workaround"""
    
    session = create_session()
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/pdf, */*;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Referer': 'https://upsssc.gov.in/',
    }
    
    for attempt in range(retries):
        try:
            print(f"   Attempt {attempt + 1}/{retries}...")
            response = session.get(
                url,
                headers=headers,
                timeout=30,
                allow_redirects=True
            )
            return response
            
        except requests.exceptions.SSLError as e:
            print(f"   SSL Error: {str(e)[:100]}")
            if attempt < retries - 1:
                time.sleep(2)
                continue
            raise
        except Exception as e:
            print(f"   Error: {str(e)[:100]}")
            if attempt < retries - 1:
                time.sleep(2)
                continue
            raise

def download_and_parse_pdf():
    """Download PDF and parse with Gemini"""
    
    print("="*60)
    print("🧪 Direct PDF Test (SSL Fixed)")
    print("="*60)
    
    # Step 1: Download PDF
    print(f"\n1️⃣ Downloading PDF...")
    print(f"   URL: {PDF_URL[:80]}...")
    
    try:
        response = download_pdf(PDF_URL)
        print(f"   Status: {response.status_code}")
        print(f"   Size: {len(response.content)} bytes")
        print(f"   Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        
        if response.status_code != 200:
            print(f"   ❌ Failed to download (Status: {response.status_code})")
            return
        
        # Check if it's a PDF
        first_bytes = response.content[:50]
        if response.content.startswith(b'%PDF'):
            print(f"   ✅ Valid PDF detected!")
        else:
            print(f"   ⚠️ Content starts with: {first_bytes}")
            
            # Save content for debugging
            with open('debug_content.bin', 'wb') as f:
                f.write(response.content)
            print(f"   💾 Saved to debug_content.bin for inspection")
            
            # Check if it's HTML (error page)
            if b'<html' in response.content[:200].lower():
                print(f"   ⚠️ Got HTML instead of PDF (possibly redirect/error page)")
                print(f"   HTML preview: {response.content[:200]}")
                return
            
            # Try anyway - some servers misreport content type
            print(f"   ⚠️ Not standard PDF header, trying anyway...")
        
    except Exception as e:
        print(f"   ❌ Download error: {str(e)[:200]}")
        return
    
    # Step 2: Save PDF
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        tmp.write(response.content)
        tmp_path = tmp.name
    
    print(f"\n2️⃣ Saved to: {tmp_path}")
    
    # Step 3: Initialize Gemini
    print(f"\n3️⃣ Initializing Gemini...")
    client = genai.Client(api_key=API_KEY)
    print(f"   Model: {MODEL}")
    
    try:
        # Step 4: Upload PDF
        print(f"\n4️⃣ Uploading to Gemini...")
        pdf_file = client.files.upload(file=tmp_path)
        print(f"   File: {pdf_file.name}")
        print(f"   State: {pdf_file.state}")
        
        # Step 5: Wait for processing
        print(f"\n5️⃣ Processing...")
        retries = 0
        while pdf_file.state == "PROCESSING" and retries < 30:
            time.sleep(1)
            pdf_file = client.files.get(name=pdf_file.name)
            retries += 1
            if retries % 5 == 0:
                print(f"   Still processing... ({retries}s)")
        
        if pdf_file.state != "ACTIVE":
            print(f"   ❌ State: {pdf_file.state}")
            Path(tmp_path).unlink()
            return
        
        print(f"   ✅ Ready!")
        
        # Step 6: Parse
        print(f"\n6️⃣ Parsing with Gemini...")
        
        prompt = """
        Extract ALL job details from this Indian government notification PDF.
        Return ONLY valid JSON (no markdown, no explanations):
        
        {
            "organization": "",
            "department": "",
            "notification_number": null,
            "advt_number": null,
            "post_name": "",
            "total_vacancies": 0,
            "category_breakdown": {
                "general": null,
                "obc": null,
                "sc": null,
                "st": null,
                "ews": null
            },
            "pay_scale": null,
            "important_dates": {
                "notification_date": null,
                "application_start": null,
                "application_end": null,
                "fee_last_date": null,
                "exam_date": null
            },
            "application_fee": {
                "general": null,
                "obc": null,
                "sc_st": null,
                "pwd": null
            },
            "age_limit": {
                "min_years": null,
                "max_years": null,
                "age_relaxation": null
            },
            "eligibility": {
                "education": [],
                "experience": null
            },
            "selection_process": [],
            "how_to_apply": null,
            "language": null
        }
        """
        
        start_time = time.time()
        
        result = client.models.generate_content(
            model=MODEL,
            contents=[prompt, pdf_file],
            config=types.GenerateContentConfig(
                temperature=0.1,
                max_output_tokens=4096,
            )
        )
        
        elapsed = time.time() - start_time
        print(f"   ✅ Parsed in {elapsed:.1f}s")
        
        # Step 7: Process response
        print(f"\n7️⃣ Processing response...")
        
        text = result.text.strip()
        
        # Clean markdown
        for prefix in ['```json\n', '```json', '```\n', '```']:
            if text.startswith(prefix):
                text = text[len(prefix):]
        for suffix in ['\n```', '```']:
            if text.endswith(suffix):
                text = text[:-len(suffix)]
        text = text.strip()
        
        try:
            data = json.loads(text)
            print(f"   ✅ Valid JSON!")
            
            # Print summary
            print(f"\n{'='*60}")
            print(f"📋 PARSED RESULT")
            print(f"{'='*60}")
            
            fields = [
                ('Organization', 'organization'),
                ('Department', 'department'),
                ('Notification No', 'notification_number'),
                ('Post Name', 'post_name'),
                ('Total Vacancies', 'total_vacancies'),
                ('Pay Scale', 'pay_scale'),
            ]
            
            for label, key in fields:
                value = data.get(key)
                if value:
                    print(f"📌 {label}: {value}")
            
            # Dates
            dates = data.get('important_dates', {})
            if any(dates.values()):
                print(f"\n📅 Important Dates:")
                for k, v in dates.items():
                    if v:
                        print(f"   {k}: {v}")
            
            # Fees
            fees = data.get('application_fee', {})
            if any(fees.values()):
                print(f"\n💰 Fees:")
                for k, v in fees.items():
                    if v:
                        print(f"   {k}: {v}")
            
            # Age
            age = data.get('age_limit', {})
            if any(age.values()):
                print(f"\n🎂 Age Limit:")
                print(f"   Min: {age.get('min_years')}, Max: {age.get('max_years')}")
            
            # Category breakdown
            cats = data.get('category_breakdown', {})
            if any(cats.values()):
                print(f"\n📊 Category Breakdown:")
                for k, v in cats.items():
                    if v:
                        print(f"   {k}: {v}")
            
            # Save full JSON
            output_file = 'parsed_result.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"\n💾 Full JSON saved to: {output_file}")
            
        except json.JSONDecodeError as e:
            print(f"   ❌ JSON error: {e}")
            with open('raw_response.txt', 'w', encoding='utf-8') as f:
                f.write(text)
            print(f"   💾 Raw saved to: raw_response.txt")
        
    except Exception as e:
        print(f"\n   ❌ Gemini error: {str(e)[:300]}")
    
    finally:
        Path(tmp_path).unlink(missing_ok=True)
        print(f"\n🧹 Cleaned up")

if __name__ == "__main__":
    download_and_parse_pdf()