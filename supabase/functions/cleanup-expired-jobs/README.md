# Cleanup Expired Jobs Function

This edge function automatically deletes jobs that are 30 days or older from their `posted_at` timestamp, ensuring compliance with the requirement that all job listings are removed from the database 30 days after being published.

## Overview

- **Function**: `cleanup-expired-jobs`
- **Purpose**: Automatically delete expired jobs (30+ days old)
- **Execution**: Should be scheduled to run daily

## How It Works

1. Calls the database function `delete_expired_jobs()` which removes all jobs where `posted_at < NOW() - INTERVAL '30 days'`
2. Returns the count of deleted jobs and remaining active jobs
3. Logs all operations for monitoring

## Scheduling

This function should be invoked daily. You can set this up using:

### Option 1: Supabase Cron (Recommended)

Use pg_cron extension in your Supabase project:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the function to run daily at 2 AM UTC
SELECT cron.schedule(
  'cleanup-expired-jobs',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-expired-jobs',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
    )
  );
  $$
);
```

### Option 2: External Cron Service

Use a service like:
- GitHub Actions (with scheduled workflow)
- Vercel Cron
- AWS EventBridge
- Google Cloud Scheduler

Example GitHub Actions workflow (replace `YOUR_PROJECT_REF` with your Supabase project reference from the project URL):

```yaml
name: Cleanup Expired Jobs
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Call cleanup function
        run: |
          curl -X POST \
            'https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-expired-jobs' \
            -H 'Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}' \
            -H 'Content-Type: application/json'
```

## Manual Invocation

You can manually trigger the cleanup using (replace `YOUR_PROJECT_REF` with your project reference and `YOUR_SERVICE_ROLE_KEY` with your service role key from Supabase settings):

```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/cleanup-expired-jobs' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'
```

## Response Format

Success response:
```json
{
  "success": true,
  "message": "Job cleanup completed successfully",
  "deletedCount": 15,
  "activeJobsRemaining": 342,
  "timestamp": "2025-12-30T08:00:00.000Z"
}
```

Error response:
```json
{
  "success": false,
  "error": "Error message here",
  "timestamp": "2025-12-30T08:00:00.000Z"
}
```

## Database Functions

The edge function relies on the following database function:

- `public.delete_expired_jobs()` - Deletes jobs older than 30 days
- `public.is_job_expired(timestamp)` - Checks if a given timestamp is expired
- `public.set_job_expiry()` - Trigger function that sets expires_at on job creation

## Monitoring

Monitor the function execution via:
1. Supabase Dashboard > Edge Functions > Logs
2. Database query to check expired jobs:
   ```sql
   SELECT COUNT(*) 
   FROM public.jobs 
   WHERE posted_at < NOW() - INTERVAL '30 days';
   ```

## Testing

Test the function locally or in staging before enabling in production:

```bash
# Using Supabase CLI
supabase functions serve cleanup-expired-jobs

# Test the function
curl -X POST http://localhost:54321/functions/v1/cleanup-expired-jobs \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```
