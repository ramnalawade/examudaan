import sys, io, json
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs

with open('mahatet_sample.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
links = soup.find_all('a', href=True)

items = []
for a in links:
    href = a['href']
    text = a.get_text(strip=True)
    if 'downloadmedia' in href.lower():
        parsed = urlparse(href)
        params = parse_qs(parsed.query)
        folder = params.get('folderName', [''])[0]
        file_name = params.get('fileName', [''])[0]
        full_url = 'https://www.mahatet.in' + href
        items.append({
            'text': text,
            'fileName': file_name,
            'folder': folder,
            'url': full_url
        })

print(f"Total: {len(items)}")

with open('mahatet_items.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

print("Saved to mahatet_items.json")
