# Testing Guide

This guide provides instructions for testing the JobPosting schema markup and 30-day auto-deletion functionality.

## Testing JobPosting Schema Markup

### 1. Manual Testing on Development/Staging

**Test FeaturedJobs Component (Homepage):**
1. Navigate to homepage: `http://localhost:5173/` or staging URL
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run: 
   ```javascript
   JSON.parse(document.querySelector('script[data-featured-jobs="true"]').textContent)
   ```
5. Verify the schema structure includes:
   - `@context: "https://schema.org/"`
   - `@type: "ItemList"`
   - Array of JobPosting items

**Test Jobs Listing Page:**
1. Navigate to: `http://localhost:5173/jobs`
2. Open DevTools Console
3. Run:
   ```javascript
   JSON.parse(document.querySelector('script[data-jobs-list="true"]').textContent)
   ```
4. Verify schema is present and valid

**Test CountryJobs Page:**
1. Navigate to: `http://localhost:5173/jobs/za`
2. Open DevTools Console
3. Run:
   ```javascript
   JSON.parse(document.querySelector('script[data-country-jobs="true"]').textContent)
   ```
4. Verify schema is present and valid

**Test JobDetail Page:**
1. Navigate to any job detail page
2. Open DevTools Console
3. Run:
   ```javascript
   JSON.parse(document.querySelector('script[data-seo="true"]').textContent)
   ```
4. Verify schema includes all required fields

### 2. Google Rich Results Test

**For Production/Staging URLs:**
1. Visit: https://search.google.com/test/rich-results
2. Enter the URL of a page with job listings
3. Click "Test URL"
4. Wait for results
5. Verify:
   - "JobPosting" is detected
   - No errors or warnings
   - All fields are properly populated

**Expected Results:**
- ✅ Valid JobPosting structured data detected
- ✅ No errors
- ✅ Preview shows job title, company, location, salary (if available)

**Common Issues:**
- ❌ "Missing required field" - Check if job has company information
- ❌ "Invalid date format" - Verify posted_at format is ISO 8601
- ❌ "No structured data found" - Check if schema script is in HTML

### 3. Schema Validation

Use schema.org validator:
1. Copy the JSON-LD from DevTools
2. Visit: https://validator.schema.org/
3. Paste the JSON-LD
4. Verify no errors

## Testing 30-Day Auto-Deletion

### 1. Database Function Testing

**Test delete_expired_jobs function:**
```sql
-- Create a test job that's 31 days old
INSERT INTO public.jobs (
  company_id,
  title,
  description,
  location,
  country,
  job_type,
  posted_at,
  status
) VALUES (
  (SELECT id FROM public.companies LIMIT 1),
  'Test Expired Job',
  'This is a test job that should be deleted',
  'Test City',
  'ZA',
  'Full-time',
  NOW() - INTERVAL '31 days',
  'active'
);

-- Run the cleanup function
SELECT public.delete_expired_jobs();

-- Verify the job was deleted
SELECT COUNT(*) FROM public.jobs WHERE title = 'Test Expired Job';
-- Should return 0
```

**Test RLS policy (hiding expired jobs):**
```sql
-- Create a test job that's 31 days old
INSERT INTO public.jobs (
  company_id,
  title,
  description,
  location,
  country,
  job_type,
  posted_at,
  expires_at,
  status
) VALUES (
  (SELECT id FROM public.companies LIMIT 1),
  'Test Hidden Job',
  'This job should be hidden by RLS',
  'Test City',
  'ZA',
  'Full-time',
  NOW() - INTERVAL '31 days',
  NOW() - INTERVAL '1 day',
  'active'
);

-- Try to query as a regular user (should not appear)
SELECT * FROM public.jobs WHERE title = 'Test Hidden Job';
-- Should return 0 rows due to RLS policy

-- Query as admin/service role (should appear)
-- Use Supabase dashboard or service role client
```

**Test expires_at trigger:**
```sql
-- Insert a new job without expires_at
INSERT INTO public.jobs (
  company_id,
  title,
  description,
  location,
  country,
  job_type,
  posted_at,
  status
) VALUES (
  (SELECT id FROM public.companies LIMIT 1),
  'Test Trigger Job',
  'Testing auto expires_at',
  'Test City',
  'ZA',
  'Full-time',
  NOW(),
  'active'
)
RETURNING expires_at;

-- Verify expires_at is set to 30 days from now
-- Should return a timestamp 30 days in the future
```

### 2. Edge Function Testing

**Local Testing (if Supabase CLI is available):**
```bash
# Start local Supabase
supabase start

# Serve the function
supabase functions serve cleanup-expired-jobs

# Test the function
curl -X POST http://localhost:54321/functions/v1/cleanup-expired-jobs \
  -H 'Authorization: Bearer YOUR_LOCAL_ANON_KEY'
```

**Production Testing:**
```bash
# Manual invocation
curl -X POST \
  'https://YOUR_PROJECT.supabase.co/functions/v1/cleanup-expired-jobs' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'

# Expected response:
# {
#   "success": true,
#   "message": "Job cleanup completed successfully",
#   "deletedCount": 0,
#   "activeJobsRemaining": 342,
#   "timestamp": "2025-12-30T08:00:00.000Z"
# }
```

### 3. GitHub Actions Workflow Testing

**Manual Workflow Trigger:**
1. Go to GitHub repository
2. Navigate to Actions tab
3. Select "Cleanup Expired Jobs" workflow
4. Click "Run workflow" dropdown
5. Select branch
6. Click "Run workflow" button
7. Wait for completion
8. Check logs for success/failure

**Verify Workflow Execution:**
```bash
# Check workflow status via GitHub CLI
gh workflow view "Cleanup Expired Jobs"
gh run list --workflow="cleanup-expired-jobs.yml"
gh run view [RUN_ID] --log
```

### 4. Integration Testing

**End-to-End Test Scenario:**
1. Create test jobs with various posted_at dates:
   - Job A: posted today (should be visible)
   - Job B: posted 29 days ago (should be visible)
   - Job C: posted 30 days ago (edge case - should be hidden)
   - Job D: posted 31 days ago (should be hidden)

2. Query jobs from frontend:
   - Verify only Job A and Job B appear in listings
   - Verify Job C and Job D do not appear

3. Run cleanup function:
   - Verify Job C and Job D are deleted
   - Verify Job A and Job B remain

4. Check schema:
   - Verify only active, non-expired jobs appear in schema
   - Verify schema is valid for all visible jobs

## Monitoring in Production

### 1. Check Cleanup Execution

**View GitHub Actions logs:**
- Navigate to: `https://github.com/YOUR_ORG/jobbyist-za/actions`
- Filter by "Cleanup Expired Jobs"
- Check daily execution logs

**View Supabase Edge Function logs:**
- Navigate to Supabase Dashboard
- Go to Edge Functions
- Select "cleanup-expired-jobs"
- View logs for execution history

### 2. Monitor Job Counts

```sql
-- Count active jobs
SELECT COUNT(*) FROM public.jobs WHERE status = 'active';

-- Count jobs by age
SELECT 
  CASE 
    WHEN posted_at >= NOW() - INTERVAL '7 days' THEN '< 7 days'
    WHEN posted_at >= NOW() - INTERVAL '14 days' THEN '7-14 days'
    WHEN posted_at >= NOW() - INTERVAL '21 days' THEN '14-21 days'
    WHEN posted_at >= NOW() - INTERVAL '28 days' THEN '21-28 days'
    ELSE '28+ days'
  END as age_range,
  COUNT(*) as count
FROM public.jobs
WHERE status = 'active'
GROUP BY age_range
ORDER BY age_range;

-- Find jobs about to expire (useful for notifications)
SELECT id, title, posted_at, expires_at
FROM public.jobs
WHERE status = 'active'
  AND expires_at BETWEEN NOW() AND NOW() + INTERVAL '3 days'
ORDER BY expires_at;
```

### 3. Schema Validation

**Periodic checks:**
1. Sample random job URLs
2. Test with Google Rich Results Test
3. Verify no errors or warnings
4. Check that schema appears in search results

## Troubleshooting

### Schema Not Appearing
1. Check browser console for JavaScript errors
2. Verify jobs have company information
3. Check if useEffect dependencies are correct
4. Clear browser cache and reload

### Jobs Not Being Deleted
1. Check GitHub Actions workflow status
2. Verify Supabase credentials in secrets
3. Check edge function logs for errors
4. Manually run cleanup function to test
5. Verify database migration was applied

### Jobs Still Visible After 30 Days
1. Check RLS policy is applied
2. Verify posted_at timestamps
3. Run manual cleanup
4. Check if user has admin role (bypasses RLS)

## Success Criteria

✅ **Schema Markup:**
- All job listing pages have valid JobPosting schema
- Google Rich Results Test shows no errors
- Jobs appear in Google Jobs search results
- Schema includes all required fields

✅ **Auto-Deletion:**
- Jobs older than 30 days are automatically hidden
- Cleanup function runs daily without errors
- Database function deletes expired jobs
- RLS policy prevents access to expired jobs
- GitHub Actions workflow executes successfully

✅ **Performance:**
- Pages load without delays
- Schema generation doesn't impact performance
- Database queries use indexes efficiently
- No memory leaks from schema generation
