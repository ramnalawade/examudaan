# Deployment & Release Runbook

This document outlines the standard operating procedures for releasing new code to the ExamUdaan production environment.

## 1. Pre-Deployment Checklist
- [ ] All tests pass locally and in CI (`.github/workflows/ci.yml`).
- [ ] No `console.log` statements containing sensitive data.
- [ ] Any new environment variables are added to the production hosting provider (e.g., Vercel, Supabase).
- [ ] Database migrations are backward-compatible.

## 2. Database Migrations
Always run database migrations **before** deploying frontend code.

1. Connect to the Supabase SQL editor (or use the Supabase CLI).
2. Execute the `.sql` files located in `packages/db/migrations/` sequentially.
3. Verify the migration succeeded by checking the table schemas.

> **Warning:** Never use `DROP COLUMN` or `ALTER COLUMN TYPE` in a way that breaks the currently running (old) frontend. Always use the "Expand and Contract" pattern (add new column, deploy new code to use it, drop old column in the next release).

## 3. Frontend Deployment (Vercel)
The Next.js application (`apps/web`) should be deployed to Vercel connected to the `main` branch.

### Standard Release (Rolling)
1. Merge the feature branch into `main`.
2. GitHub Actions runs the CI pipeline.
3. If CI passes, Vercel automatically starts the build.
4. Vercel performs a seamless swap (zero-downtime) once the build succeeds.

## 4. Post-Deployment Verification
- [ ] Verify the Homepage (`/`) loads without errors.
- [ ] Verify the Admin Panel (`/admin`) is accessible and loads stats correctly.
- [ ] Run a manual Scrapy spider test to ensure it can still write to the Supabase database.

## 5. Rollback Procedure
If a critical bug is detected in production within 5 minutes of a deployment:

1. **Frontend Revert:**
   - Go to the Vercel Dashboard for ExamUdaan.
   - Navigate to the "Deployments" tab.
   - Find the previous successful deployment.
   - Click the three dots (⋮) and select **"Promote to Production"** (Instant rollback).
2. **Database Revert:**
   - If the database migration caused the issue, execute the reverse SQL commands (e.g., `DROP INDEX`, `DROP TABLE`).
3. **Investigate:**
   - After stability is restored, investigate the error logs, fix the bug in a new branch, and restart the CI pipeline.
