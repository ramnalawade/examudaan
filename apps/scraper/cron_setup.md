# Cron / Task Scheduler Setup — ExamUdaan Scraper

Run `run_scraper.py` **twice daily** (06:00 and 18:00) to keep exam notifications fresh.

---

## Linux — crontab

### 1. Find your Python path

```bash
# If using venv (recommended):
source /path/to/examudaan/apps/scraper/.venv/bin/activate
which python   # e.g. /home/ubuntu/examudaan/apps/scraper/.venv/bin/python
```

### 2. Open crontab editor

```bash
crontab -e
```

### 3. Add these two lines

```cron
# ExamUdaan Scraper — runs at 06:00 AM and 06:00 PM daily (IST = UTC+5:30, so UTC 00:30 and 12:30)
30 0 * * * /home/ubuntu/examudaan/apps/scraper/.venv/bin/python /home/ubuntu/examudaan/apps/scraper/run_scraper.py >> /home/ubuntu/examudaan/apps/scraper/logs/cron.log 2>&1
30 12 * * * /home/ubuntu/examudaan/apps/scraper/.venv/bin/python /home/ubuntu/examudaan/apps/scraper/run_scraper.py >> /home/ubuntu/examudaan/apps/scraper/logs/cron.log 2>&1
```

> Note: Cron runs in UTC. 06:00 IST = 00:30 UTC, 18:00 IST = 12:30 UTC.

### 4. (Optional) Log rotation

Create `/etc/logrotate.d/examudaan-scraper`:

```
/home/ubuntu/examudaan/apps/scraper/logs/*.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
}
```

---

## Windows — Task Scheduler

### PowerShell (run as Administrator)

```powershell
$pythonPath  = "C:\Users\ramna\.gemini\antigravity-ide\scratch\examudaan\apps\scraper\.venv\Scripts\python.exe"
$scriptPath  = "C:\Users\ramna\.gemini\antigravity-ide\scratch\examudaan\apps\scraper\run_scraper.py"
$logPath     = "C:\Users\ramna\.gemini\antigravity-ide\scratch\examudaan\apps\scraper\logs\task.log"
$workDir     = "C:\Users\ramna\.gemini\antigravity-ide\scratch\examudaan\apps\scraper"

# Morning run: 6:00 AM
$actionMorning  = New-ScheduledTaskAction -Execute $pythonPath -Argument "$scriptPath >> $logPath 2>&1" -WorkingDirectory $workDir
$triggerMorning = New-ScheduledTaskTrigger -Daily -At "06:00AM"
Register-ScheduledTask -TaskName "ExamUdaan-Scraper-Morning" -Action $actionMorning -Trigger $triggerMorning -RunLevel Highest -Force

# Evening run: 6:00 PM
$actionEvening  = New-ScheduledTaskAction -Execute $pythonPath -Argument "$scriptPath >> $logPath 2>&1" -WorkingDirectory $workDir
$triggerEvening = New-ScheduledTaskTrigger -Daily -At "06:00PM"
Register-ScheduledTask -TaskName "ExamUdaan-Scraper-Evening" -Action $actionEvening -Trigger $triggerEvening -RunLevel Highest -Force

Write-Host "Tasks registered successfully!"
```

---

## Test the runner manually

```bash
# Linux / macOS
python run_scraper.py --dry-run          # preview commands without running
python run_scraper.py                    # run all configured spiders
python run_scraper.py --spider multi_govt_jobs  # run one spider

# Windows PowerShell
python run_scraper.py --dry-run
python run_scraper.py
```

---

## Log files

Logs are saved to `apps/scraper/logs/`:
- `scraper_YYYYMMDD_HHMMSS.log` — timestamped per-run log
- `cron.log` / `task.log` — aggregated cron/task output

---

## What happens each run

1. `run_scraper.py` launches each spider in sequence
2. Spiders crawl new pages; pages where the last 3 consecutive pages are all duplicates are skipped automatically
3. New PDFs are parsed via Gemini (key rotation + rate limiting built-in)
4. Results are saved to PostgreSQL
5. At end of crawl, Brevo sends a summary email to ramnalawade1986@gmail.com
