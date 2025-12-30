# JobPosting Schema Markup and Auto-Deletion Implementation

This document describes the implementation of JobPosting schema markup and automatic 30-day job deletion functionality for the Jobbyist web application.

## Summary

Two key requirements have been implemented:

1. **JobPosting Schema Markup**: All job listings throughout the web application now include proper Google JobPosting structured data
2. **30-Day Auto-Deletion**: All job listings are automatically deleted from the database 30 days after being published

## 1. JobPosting Schema Markup

### Overview
JobPosting schema markup helps search engines understand job listings and display them in rich results. This implementation follows [Google's JobPosting guidelines](https://developers.google.com/search/docs/appearance/structured-data/job-posting).

### Implementation Details

#### Files Modified
- `src/components/SEOHead.tsx` - Added `generateJobListSchema()` function
- `src/components/sections/FeaturedJobs.tsx` - Added schema for homepage featured jobs
- `src/pages/Jobs.tsx` - Added schema for main jobs listing page
- `src/pages/CountryJobs.tsx` - Added schema for country-specific job listings
- `src/pages/JobDetail.tsx` - Already had proper schema (no changes needed)

#### Schema Structure
Each job listing includes:
- Job title and description
- Company information (name, logo)
- Location (city, country, remote status)
- Employment type (full-time, part-time, contract, etc.)
- Salary information (if available)
- Date posted and application deadline (if available)
- Required skills and qualifications

#### Key Features
- Jobs without company information are filtered out to ensure valid schema
- Schema is dynamically generated based on job data
- Cleanup on unmount prevents duplicate schema tags
- Each page uses unique data attributes to prevent conflicts

### Testing Schema Markup

Use Google's [Rich Results Test](https://search.google.com/test/rich-results) to verify:
1. Navigate to a job listing page
2. Copy the page URL
3. Test at: https://search.google.com/test/rich-results
4. Verify all JobPosting fields are properly detected

## 2. 30-Day Auto-Deletion System

### Overview
Jobs are automatically deleted 30 days after their `posted_at` timestamp to maintain data freshness and comply with retention requirements.

### Implementation Components

#### 1. Database Migration (`20251230074500_add_job_expiry_system.sql`)

**Functions Created:**
- `delete_expired_jobs()` - Deletes jobs older than 30 days, returns count
- `is_job_expired(timestamp)` - Checks if a job timestamp is expired
- `set_job_expiry()` - Trigger function to auto-set expires_at field

**RLS Policy Updated:**
- Updated "Active jobs are viewable by everyone" policy to exclude expired jobs
- Jobs older than 30 days are automatically hidden from listings

**Triggers Added:**
- `set_job_expiry_trigger` - Automatically sets expires_at to 30 days from posted_at

**Indexes Added:**
- `idx_jobs_posted_at_expiry` - Optimizes expiry queries on active jobs

#### 2. Edge Function (`cleanup-expired-jobs`)

**Purpose:** 
Scheduled function that calls the database cleanup function

**Location:**
`supabase/functions/cleanup-expired-jobs/`

**Features:**
- Calls `delete_expired_jobs()` database function
- Returns count of deleted and remaining jobs
- Proper error handling for missing environment variables
- CORS support for external invocation

**Response Format:**
```json
{
  "success": true,
  "message": "Job cleanup completed successfully",
  "deletedCount": 15,
  "activeJobsRemaining": 342,
  "timestamp": "2025-12-30T08:00:00.000Z"
}
```

#### 3. GitHub Actions Workflow (`cleanup-expired-jobs.yml`)

**Schedule:** Daily at 2:00 AM UTC

**Permissions:** Read-only (minimal required)

**Features:**
- Automated daily execution
- Manual trigger capability via GitHub UI
- Error handling and logging
- Proper HTTP status code checking

### Deployment Steps

1. **Apply Database Migration:**
   ```bash
   supabase db push
   ```

2. **Deploy Edge Function:**
   ```bash
   supabase functions deploy cleanup-expired-jobs
   ```

3. **Set GitHub Secrets:**
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Service role key from Supabase dashboard

4. **Verify Workflow:**
   - Navigate to GitHub Actions tab
   - Find "Cleanup Expired Jobs" workflow
   - Click "Run workflow" to test manually

### Monitoring

#### Check Expired Jobs
```sql
SELECT COUNT(*) 
FROM public.jobs 
WHERE posted_at < NOW() - INTERVAL '30 days';
```

#### View Recent Deletions
Check GitHub Actions logs or Supabase Edge Functions logs

#### Manual Cleanup
```bash
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/functions/v1/cleanup-expired-jobs' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY'
```

## Benefits

### SEO Benefits
- Improved visibility in Google Jobs search results
- Rich snippets with job information
- Better click-through rates from search
- Structured data helps search engines understand content

### Data Management Benefits
- Automatic cleanup prevents database bloat
- Ensures job listings stay fresh and relevant
- Compliance with data retention policies
- No manual intervention required

## Security

- RLS policies prevent access to expired jobs
- Edge function requires authentication
- GitHub Actions uses minimal permissions
- Environment variables stored as secrets
- Service role key never exposed in code

## Future Enhancements

Potential improvements:
- Email notifications before job expiration
- Extended expiration for premium listings
- Archive expired jobs instead of deletion
- Configurable expiration period per job type
- Analytics on job lifecycle and performance

## Troubleshooting

### Jobs Not Appearing in Search Results
- Verify schema with Google Rich Results Test
- Check that job has valid company information
- Allow time for Google to crawl and index

### Cleanup Not Running
- Check GitHub Actions workflow status
- Verify Supabase credentials in GitHub secrets
- Check edge function logs in Supabase dashboard
- Manually trigger workflow to test

### Jobs Still Visible After 30 Days
- RLS policy automatically hides them from listings
- Run cleanup function manually to delete permanently
- Check database migration was applied successfully

## Support

For issues or questions:
- Review edge function logs in Supabase dashboard
- Check GitHub Actions workflow runs
- Verify database migration status
- Test schema with Google's tools
