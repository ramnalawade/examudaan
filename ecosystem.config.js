const path = require('path')

module.exports = {
  apps: [
    // 1. Next.js Web App
    {
      name: 'examudaan-web',
      cwd: './apps/web',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_memory_restart: '800M',
      restart_delay: 5000,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },

    // 2. Scraper Cron Job (runs every 6 hours: 00:00, 06:00, 12:00, 18:00)
    {
      name: 'examudaan-scraper-cron',
      cwd: './apps/scraper',
      script: './run_scraper.py',
      interpreter: process.platform === 'win32'
        ? path.join(__dirname, 'apps', 'scraper', '.venv', 'Scripts', 'python.exe')
        : path.join(__dirname, 'apps', 'scraper', '.venv', 'bin', 'python'),
      autorestart: false,
      cron_restart: '0 0,6,12,18 * * *',
      watch: false,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './apps/scraper/logs/pm2-scraper-error.log',
      out_file: './apps/scraper/logs/pm2-scraper-out.log',
    },
  ],
}
