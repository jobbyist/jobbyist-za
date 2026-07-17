# Daily Job Scraper Pipeline

This document describes the automated job scraping pipeline that backfills the site with fresh job listings every day.

## Overview

The daily job scraper runs automatically at **6:00 AM SAST (4:00 AM UTC)** via GitHub Actions. It orchestrates two data sources to populate 10-20 new job listings:

1. **Adzuna API** - Primary source for South African job listings
2. **Firecrawl** - Secondary source for web scraping additional job boards

## Architecture

### Components

1. **GitHub Actions Workflow** (`.github/workflows/daily-job-scraper.yml`)
   - Scheduled trigger: Daily at 6 AM SAST
   - Manual trigger: Available via GitHub UI
   - Calls the orchestrator function

2. **Orchestrator Function** (`supabase/functions/daily-job-scraper/index.ts`)
   - Coordinates multiple scraper sources
   - Ensures target job count (10-20 jobs) is met
   - Aggregates results from all sources

3. **Adzuna Scraper** (`supabase/functions/scrape-adzuna/index.ts`)
   - Fetches jobs from Adzuna API
   - Primary data source (more reliable)
   - Processes up to 100 job listings per run

4. **Firecrawl Scraper** (`supabase/functions/scrape-firecrawl-jobs/index.ts`)
   - Scrapes job boards using Firecrawl API
   - Secondary/backup data source
   - Fills gap if Adzuna doesn't provide enough jobs

## Configuration

### Environment Variables

Add these secrets to your Supabase project (Dashboard → Project Settings → Edge Functions → Manage secrets):

```bash
# Required for Adzuna scraper
ADZUNA_APP_ID="your-adzuna-app-id"
ADZUNA_APP_KEY="your-adzuna-app-key"

# Required for Firecrawl scraper
FIRECRAWL_API_KEY="your-firecrawl-api-key"
```

### Getting API Credentials

#### Adzuna API (Free Tier)
1. Sign up at https://developer.adzuna.com/signup
2. Create an application
3. Copy your App ID and App Key

#### Firecrawl API
1. Sign up at https://firecrawl.dev
2. Navigate to API Keys section
3. Create and copy your API key

### GitHub Secrets

Ensure these secrets are configured in your GitHub repository (Settings → Secrets and variables → Actions):

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

## Usage

### Automatic Execution

The scraper runs automatically every day at 6 AM SAST. No manual intervention required.

### Manual Execution

To trigger the scraper manually:

1. **Via GitHub Actions UI:**
   - Go to GitHub → Actions → Daily Job Scraper
   - Click "Run workflow"
   - Select branch and click "Run workflow"

2. **Via Supabase Function:**
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/daily-job-scraper \
     -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
     -H "Content-Type: application/json" \
     -d '{"targetCount": 20}'
   ```

## Monitoring

- Check GitHub Actions workflow runs for execution status
- Review Supabase Edge Function logs for detailed scraper output
- Monitor the `jobs` table in your database for newly created entries

