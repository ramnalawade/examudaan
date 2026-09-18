#!/bin/bash
# ============================================================
# cron_6h.sh — ExamUdaan Spider Runner (Every 6 Hours)
# Runs ALL spiders sequentially with logging + email summary
#
# Setup (run once):
#   chmod +x /path/to/examudaan/apps/scraper/cron_6h.sh
#   mkdir -p /var/log/examudaan
#
# Add to crontab (crontab -e):
#   0 */6 * * * /path/to/examudaan/apps/scraper/cron_6h.sh >> /var/log/examudaan/cron.log 2>&1
#
# Or run at specific hours (6am, 12pm, 6pm, 12am IST):
#   30 0,6,12,18 * * * /path/to/examudaan/apps/scraper/cron_6h.sh >> /var/log/examudaan/cron.log 2>&1
# ============================================================

set -euo pipefail

# ---- Config ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
LOG_DIR="/var/log/examudaan"
DATE_TAG=$(date +%Y%m%d_%H%M%S)
SUMMARY_LOG="$LOG_DIR/summary_${DATE_TAG}.log"
VENV="$SCRIPT_DIR/.venv"
SLEEP_BETWEEN=20   # seconds to wait between spiders (avoid rate limits)

# ---- Load environment variables from .env ----
if [[ -f "$ENV_FILE" ]]; then
    # Export all non-comment, non-empty lines
    set -o allexport
    # shellcheck source=/dev/null
    source "$ENV_FILE"
    set +o allexport
else
    echo "[WARN] .env file not found at $ENV_FILE — using shell environment"
fi

# ---- Ensure log dir exists ----
mkdir -p "$LOG_DIR"

# ---- Activate virtualenv ----
if [[ -f "$VENV/bin/activate" ]]; then
    # shellcheck source=/dev/null
    source "$VENV/bin/activate"
    echo "[INFO] Virtualenv activated: $VENV"
elif [[ -f "$VENV/Scripts/activate" ]]; then
    # Windows Git Bash / WSL path
    # shellcheck source=/dev/null
    source "$VENV/Scripts/activate"
    echo "[INFO] Virtualenv activated (Windows): $VENV"
else
    echo "[WARN] No virtualenv found at $VENV — using system Python"
fi

# ---- Change to scraper dir ----
cd "$SCRIPT_DIR"

# ---- All spiders (57 total as of 2026-09) ----
SPIDERS=(
    # --- RSS Feeds (fastest — runs first, covers 15+ central bodies) ---
    "rss"

    # --- Central Bodies ---
    "ssc"
    "upsc"
    "rrb"
    "ibps"
    "sbi"
    "nta"
    "employment_news"

    # --- Central PSUs (NEW) ---
    "nabard"
    "lic"
    "isro"
    "ongc"

    # --- State PSCs — Original ---
    "uppsc"
    "bpsc"
    "rpsc"
    "mppsc"
    "gpsc"
    "kpsc"
    "tnpsc"

    # --- State PSCs — New batch (12 states) ---
    "hpsc"             # Haryana
    "ppsc"             # Punjab
    "tspsc"            # Telangana
    "appsc"            # Andhra Pradesh
    "opsc"             # Odisha
    "wbpsc"            # West Bengal
    "jpsc"             # Jharkhand
    "cgpsc"            # Chhattisgarh
    "ukpsc"            # Uttarakhand
    "hppsc"            # Himachal Pradesh
    "keralapsc"        # Kerala
    "goapsc"           # Goa

    # --- Maharashtra State / Municipal ---
    "mpsc"
    "mahapolice"
    "bmc"
    "pmc"
    "tmc"
    "thane_police"
    "mumbai_police"
    "srpf"
    "maharashtra_prisons"

    # --- Research / Science Institutes ---
    "icar_circot"
    "icar_nbsslup"
    "csirneeri"
    "actrec"
    "aimmsnagpur"
    "iipsmumbai"
    "iiser_pune"
    "ict_mumbai"

    # --- Infrastructure / PSU ---
    "konkan_railway"
    "mecl"
    "moil"
    "pdkv_akola"

    # --- Multi-site ---
    "multi_govt_jobs"

    # --- AI Spider (JS-heavy via Jina + Gemini — needs GEMINI_API_KEY) ---
    "ai_spider"

    # --- Content ---
    "youtube_spider"
)

# ---- Tracking counters ----
TOTAL=${#SPIDERS[@]}
SUCCESS=0
FAILED=0
FAILED_SPIDERS=()

echo "============================================================" | tee -a "$SUMMARY_LOG"
echo "ExamUdaan Spider Run — $(date '+%Y-%m-%d %H:%M:%S %Z')"      | tee -a "$SUMMARY_LOG"
echo "Total spiders: $TOTAL"                                         | tee -a "$SUMMARY_LOG"
echo "Log dir: $LOG_DIR"                                             | tee -a "$SUMMARY_LOG"
echo "============================================================" | tee -a "$SUMMARY_LOG"

# ---- Run each spider ----
for spider in "${SPIDERS[@]}"; do
    SPIDER_LOG="$LOG_DIR/${spider}_${DATE_TAG}.log"
    echo ""                                                          | tee -a "$SUMMARY_LOG"
    echo ">>> [$spider] Starting at $(date '+%H:%M:%S')"            | tee -a "$SUMMARY_LOG"

    START_TS=$(date +%s)

    if scrapy crawl "$spider" \
        --set LOG_LEVEL=INFO \
        --set CLOSESPIDER_TIMEOUT=300 \
        --set DOWNLOAD_TIMEOUT=30 \
        > "$SPIDER_LOG" 2>&1; then

        END_TS=$(date +%s)
        ELAPSED=$((END_TS - START_TS))
        echo "    [OK] ${spider} completed in ${ELAPSED}s"          | tee -a "$SUMMARY_LOG"
        SUCCESS=$((SUCCESS + 1))
    else
        END_TS=$(date +%s)
        ELAPSED=$((END_TS - START_TS))
        echo "    [FAIL] ${spider} failed in ${ELAPSED}s — see $SPIDER_LOG" | tee -a "$SUMMARY_LOG"
        FAILED=$((FAILED + 1))
        FAILED_SPIDERS+=("$spider")
    fi

    # Sleep between spiders to avoid overloading servers
    if [[ "$spider" != "${SPIDERS[-1]}" ]]; then
        sleep "$SLEEP_BETWEEN"
    fi
done

# ---- Final summary ----
echo ""                                                              | tee -a "$SUMMARY_LOG"
echo "============================================================" | tee -a "$SUMMARY_LOG"
echo "Run complete — $(date '+%Y-%m-%d %H:%M:%S %Z')"              | tee -a "$SUMMARY_LOG"
echo "  Success: $SUCCESS / $TOTAL"                                  | tee -a "$SUMMARY_LOG"
echo "  Failed:  $FAILED / $TOTAL"                                   | tee -a "$SUMMARY_LOG"
if [[ ${#FAILED_SPIDERS[@]} -gt 0 ]]; then
    echo "  Failed spiders: ${FAILED_SPIDERS[*]}"                   | tee -a "$SUMMARY_LOG"
fi
echo "============================================================" | tee -a "$SUMMARY_LOG"

# ---- Automatic Marathi translation for newly scraped records ----
echo "[INFO] Running automatic Marathi translation on untranslated records..." | tee -a "$SUMMARY_LOG"
python translate_to_marathi.py --batch-size 10 >> "$SUMMARY_LOG" 2>&1 || true
echo "[INFO] Marathi translation step completed"                         | tee -a "$SUMMARY_LOG"

# ---- Post-process enrichment: fill missing dates/vacancies/fees ----
# Reads newly scraped rows that are missing apply_start_date / apply_end_date /
# total_vacancies and uses Gemini to extract those fields from description text.
# --limit 100 — enrich up to 100 rows per run (adjust to taste)
# --fetch      — also fetch source URL page when description is empty
# || true      — don't abort the cron job if enrichment fails
echo "[INFO] Running notification enrichment (dates, vacancies, fees)..." | tee -a "$SUMMARY_LOG"
python enrich_notifications.py --limit 100 --fetch >> "$SUMMARY_LOG" 2>&1 || true
echo "[INFO] Enrichment step completed"                                    | tee -a "$SUMMARY_LOG"

# ---- Send email summary via Brevo ----
# Only sends if BREVO_API_KEY is set in .env
if [[ -n "${BREVO_API_KEY:-}" && -n "${BREVO_RECIPIENT_EMAIL:-}" ]]; then
    SUMMARY_CONTENT=$(cat "$SUMMARY_LOG")
    SUBJECT="ExamUdaan Crawl — $SUCCESS/$TOTAL OK @ $(date '+%d %b %Y %H:%M')"
    if [[ $FAILED -gt 0 ]]; then
        SUBJECT="[ALERT] ExamUdaan Crawl — $FAILED FAILED @ $(date '+%d %b %Y %H:%M')"
    fi

    curl -s -o /dev/null -w "%{http_code}" \
        --request POST \
        --url https://api.brevo.com/v3/smtp/email \
        --header "accept: application/json" \
        --header "api-key: ${BREVO_API_KEY}" \
        --header "content-type: application/json" \
        --data "{
            \"sender\":{\"name\":\"${BREVO_SENDER_NAME:-ExamUdaan Scraper}\",\"email\":\"${BREVO_SENDER_EMAIL:-no-reply@examudaan.in}\"},
            \"to\":[{\"email\":\"${BREVO_RECIPIENT_EMAIL}\"}],
            \"subject\":\"${SUBJECT}\",
            \"htmlContent\":\"<pre>${SUMMARY_CONTENT}</pre>\"
        }" \
        >> "$SUMMARY_LOG" 2>&1 || true

    echo "[INFO] Email summary sent to ${BREVO_RECIPIENT_EMAIL}"    >> "$SUMMARY_LOG"
else
    echo "[INFO] BREVO_API_KEY not set — skipping email summary"    >> "$SUMMARY_LOG"
fi

# ---- Cleanup logs older than 14 days ----
find "$LOG_DIR" -name "*.log" -mtime +14 -delete 2>/dev/null || true
echo "[INFO] Cleaned up logs older than 14 days"

# Exit with non-zero if any spiders failed
[[ $FAILED -eq 0 ]] && exit 0 || exit 1
