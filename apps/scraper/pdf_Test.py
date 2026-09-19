import pdfplumber
import requests

# Download the PDF first
url = "https://www.mppsc.mp.gov.in/uploads/advertisement/Advt_Assistant_Research_Officer_2024_Dated_28_12_2024.pdf"
response = requests.get(url)
with open("mppsc.pdf", "wb") as f:
    f.write(response.content)

# Extract text and tables
with pdfplumber.open("mppsc.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        print(f"--- Page {i+1} Text ---")
        print(page.extract_text())
        
        # To extract tables specifically:
        tables = page.extract_tables()
        for table in tables:
            print(table) # Prints row-by-row data