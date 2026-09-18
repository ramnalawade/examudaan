#!/bin/bash

# Set environment
export PATH=/home/user/examudaan/.venv/bin:$PATH
export GEMINI_API_KEYS="AIzaSyKey1,AIzaSyKey2,AIzaSyKey3"
export BREVO_API_KEY="your_brevo_key"
export DATABASE_URL="postgresql://postgres:password@localhost:5432/examudaan"

cd /home/user/examudaan/apps/scraper

# Activate virtual environment
source .venv/bin/activate

# Run all spiders sequentially
echo "Starting spider run at $(date)"

# List of spiders to run
SPIDERS=(
    "icar_circot"
    "icar_nbsslup"
    "konkan_railway"
    "mecl"
    "moil"
    "mpsc"
    "mumbai_police"
    "srpf"
    "maharashtra_prisons"
    "pmc"
    "tmc"
    "thane_police"
)

for spider in "${SPIDERS[@]}"; do
    echo "Running spider: $spider"
    scrapy crawl "$spider" 2>&1 | tee -a "/var/log/examudaan/${spider}_$(date +%Y%m%d).log"
    sleep 30  # Wait between spiders to avoid overload
done

echo "Completed all spiders at $(date)"

# Run spiders every 6 hours (at 6am, 12pm, 6pm, 12am)
##0 0,6,12,18 * * * /home/user/examudaan/run_spiders.sh

# Or run daily at 2 AM
##0 2 * * * /home/user/examudaan/run_spiders.sh

# Or run every 4 hours
##0 */4 * * * /home/user/examudaan/run_spiders.sh
##chmod +x /home/user/examudaan/run_spiders.sh