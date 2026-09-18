# ==============================================================================
# fetch_proxies.py — Fetch free proxies from ProxyScrape and save to proxies.txt
# Run this before starting a crawl session:
#   python fetch_proxies.py
# This is called automatically by the GitHub Actions workflow before each scrape.
# ==============================================================================

import requests
import time

PROXY_SOURCES = [
    # ProxyScrape — free, no login, HTTP proxies
    "https://api.proxyscrape.com/v3/free-proxy-list/get?request=getproxies&protocol=http&timeout=5000&country=all&ssl=all&anonymity=all&simplified=true",
    # ProxyList.to — another free source
    "https://www.proxy-list.download/api/v1/get?type=https",
]

OUTPUT_FILE = "proxies.txt"

def fetch_proxies():
    all_proxies = set()

    for url in PROXY_SOURCES:
        try:
            print(f"Fetching proxies from: {url}")
            r = requests.get(url, timeout=15)
            if r.status_code == 200:
                lines = r.text.strip().splitlines()
                for line in lines:
                    line = line.strip()
                    if line and ':' in line:
                        # Ensure proper format: http://ip:port
                        if not line.startswith('http'):
                            line = f"http://{line}"
                        all_proxies.add(line)
                print(f"  Got {len(lines)} proxies")
        except Exception as e:
            print(f"  Error fetching from {url}: {e}")
        time.sleep(1)

    with open(OUTPUT_FILE, 'w') as f:
        for proxy in sorted(all_proxies):
            f.write(proxy + "\n")

    print(f"\nDone! Saved {len(all_proxies)} proxies to {OUTPUT_FILE}")

if __name__ == "__main__":
    fetch_proxies()
