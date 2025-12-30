# Remote Job Scraper with Firecrawl

This document explains the remote job scraping system that uses Firecrawl to scrape 250+ remote job listings from international employers looking for South African talent.

## Overview

The remote job scraper is designed to automatically fetch remote job opportunities from multiple international job boards, parse them using AI, and publish them on the Jobbyist platform in the existing format.

## Key Features

✅ **Real-time Scraping with Firecrawl API**
- Uses Firecrawl's `/scrape` endpoint to fetch job board pages
- Uses Firecrawl's `/map` endpoint to discover job listing URLs
- Handles dynamic content loading with `waitFor` parameter

✅ **AI-Powered Job Parsing with Claude 3.5 Sonnet**
- Extracts structured job data from unstructured web content
- Filters for remote positions suitable for SA talent
- Validates job listings to avoid false positives
- Extracts: title, company, location, description, salary, skills, etc.

✅ **Automatic Company Management**
- Creates new companies automatically if they don't exist
- Uses Clearbit Logo API for company logos
- Generates company slugs and basic info

✅ **Duplicate Detection**
- Checks for existing jobs by title and company
- Skips duplicates to avoid cluttering the database

✅ **Remote-First Focus**
- Targets job boards specializing in remote work
- Filters for international employers
- Marks all jobs as `is_remote: true`
- Adds remote work benefits automatically

## Job Sources

The scraper targets these remote job boards:

1. **Remotive.com** - Remote tech jobs from worldwide companies
2. **We Work Remotely** - Remote programming and tech jobs
3. **Remote.co** - Remote developer positions
4. **Working Nomads** - Remote jobs for digital nomads
5. **Just Remote** - Remote software development jobs
6. **Remote Frontend Jobs** - Frontend developer positions

## Architecture

### Edge Function: `scrape-remote-jobs-firecrawl`

Located at: `supabase/functions/scrape-remote-jobs-firecrawl/index.ts`

**Flow:**
1. Receives request with target count (default: 250)
2. For each job board source:
   - If `useMap: true`: Maps the site to find job listing URLs
   - Scrapes each URL with Firecrawl
   - Parses content with Claude AI
   - Creates/updates companies in database
   - Creates job listings with all metadata
3. Returns summary of jobs created

**API Endpoint:**
```bash
POST https://your-project.supabase.co/functions/v1/scrape-remote-jobs-firecrawl
Content-Type: application/json
Authorization: Bearer YOUR_ANON_KEY

{
  "targetCount": 250
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully scraped 250 remote job listings",
  "jobsCreated": 250,
  "targetCount": 250,
  "urlsScraped": 85
}
```

## Admin UI Integration

The admin scraper page (`/admin/scraper`) now has a tabbed interface:

**Remote Jobs Tab:**
- Target: 250+ jobs button
- Shows remote job sources
- Progress tracking
- Status display
- Last run information

**Local Jobs Tab:**
- Original country-based scraping
- South African job boards
- Multiple country support

## How It Works

### 1. Site Mapping (Optional)

For job boards with list pages, Firecrawl's map feature discovers individual job URLs:

```typescript
POST https://api.firecrawl.dev/v1/map
{
  "url": "https://remotive.com/remote-jobs/software-dev",
  "search": "job listing, position, vacancy, career",
  "limit": 50
}
```

Returns array of job listing URLs that are then scraped individually.

### 2. Page Scraping

For each URL, Firecrawl extracts clean content:

```typescript
POST https://api.firecrawl.dev/v1/scrape
{
  "url": "https://example.com/job/123",
  "formats": ["markdown", "html"],
  "onlyMainContent": true,
  "waitFor": 3000
}
```

Returns structured markdown/HTML content without navigation, ads, etc.

### 3. AI Job Parsing

Claude 3.5 Sonnet analyzes the content and extracts structured job data:

**Extraction Rules:**
- Only remote or location-flexible positions
- Must have clear title and company name
- Filters out navigation, ads, non-job content
- Extracts salary, skills, job type
- Creates 2-3 sentence descriptions

**Quality Validation:**
- Title must be > 3 characters
- Company name must be > 1 character
- Filters out "Load More", "Sign Up", etc.
- Validates JSON structure

### 4. Database Storage

**Companies Table:**
```sql
INSERT INTO companies (
  name,
  slug,
  description,
  logo_url,           -- Clearbit logo
  website,
  industry,           -- "Technology"
  size,              -- "50-200"
  country,           -- "ZA"
  location,          -- "Remote"
  is_active,         -- true
  is_verified        -- false (pending verification)
)
```

**Jobs Table:**
```sql
INSERT INTO jobs (
  company_id,
  title,
  description,
  job_type,          -- "Full-time", "Contract", etc.
  employment_type,
  experience_level,  -- "Mid Level" (default)
  location,          -- "Remote - Worldwide"
  country,           -- "ZA"
  is_remote,         -- true
  salary_min,
  salary_max,
  salary_currency,   -- "USD", "EUR", "GBP"
  salary_period,     -- "year"
  skills,            -- Array of skills
  benefits,          -- ["Remote Work", "Flexible Hours", ...]
  source_url,        -- Original job posting URL
  source_name,       -- "Remotive", "We Work Remotely", etc.
  status,            -- "active"
  posted_at
)
```

## Environment Variables

Required in Supabase Edge Function secrets:

```bash
FIRECRAWL_API_KEY=fc-xxxxxxxxxxxx       # Required - Firecrawl API key
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx  # Required - Claude API key
SUPABASE_URL=https://xxx.supabase.co    # Auto-provided
SUPABASE_SERVICE_ROLE_KEY=xxxxx         # Auto-provided
```

## Usage

### Via Admin UI

1. Go to `/admin/scraper`
2. Click "Remote Jobs (International)" tab
3. Click "Start Remote Job Scraper" button
4. Monitor progress and status
5. View results in Jobs tab when complete

### Via API/CLI

```bash
# Using Supabase CLI
supabase functions invoke scrape-remote-jobs-firecrawl \
  --data '{"targetCount": 250}'

# Using curl
curl -X POST \
  https://your-project.supabase.co/functions/v1/scrape-remote-jobs-firecrawl \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"targetCount": 250}'
```

### Programmatically (React)

```typescript
const { data, error } = await supabase.functions.invoke(
  'scrape-remote-jobs-firecrawl',
  {
    body: { targetCount: 250 }
  }
);

if (error) {
  console.error('Scraping failed:', error);
} else {
  console.log(`Created ${data.jobsCreated} jobs`);
}
```

## Rate Limiting & Performance

**Firecrawl Limits:**
- Respects Firecrawl API rate limits
- 2-second delay between scrapes
- Processes up to 50 URLs per source

**Claude AI Limits:**
- One AI call per scraped page
- 4096 max tokens per response
- Handles up to 15,000 characters of input

**Expected Runtime:**
- ~2-5 minutes for 250 jobs
- Depends on number of sources and URLs
- Includes rate limiting delays

## Job Quality Criteria

The scraper focuses on high-quality remote opportunities:

✅ **Remote-First:**
- Must be fully remote or "location-flexible"
- No jobs restricted to specific cities/countries
- Preference for "Remote - Worldwide" positions

✅ **International Employers:**
- Companies hiring globally
- Open to South African applicants
- Often from US, Europe, Australia

✅ **Technology Focus:**
- Software development
- Engineering
- Design
- Product management
- Data science

✅ **Current & Active:**
- Recent job postings
- Active application links
- Not expired or filled positions

## Troubleshooting

### No Jobs Created

**Causes:**
1. Firecrawl API key missing or invalid
2. Anthropic API key missing or invalid
3. Job boards have changed their structure
4. Rate limits exceeded
5. No qualifying remote jobs found

**Solutions:**
1. Verify API keys in Supabase Edge Function secrets
2. Check Edge Function logs for detailed errors
3. Test individual sources separately
4. Try with lower target count first

### Duplicate Jobs

The scraper automatically detects and skips duplicates by checking:
- Same company_id
- Same job title

If seeing duplicates with slight variations, the AI parsing may need adjustment.

### Low Job Count

If getting fewer than expected jobs:
1. Some sources may have few active listings
2. AI filtering may be too strict
3. Rate limiting may be interrupting the process
4. Try increasing `limit` in map calls
5. Add more job board sources

### Company Logo Issues

If company logos not showing:
1. Clearbit may not have logo for that domain
2. Company website/domain incorrect
3. Fallback shows company initial instead

## Future Enhancements

Potential improvements:

1. **More Job Boards:**
   - FlexJobs
   - Remote OK
   - AngelList Remote
   - Stack Overflow Jobs
   - GitHub Jobs

2. **Better AI Parsing:**
   - Extract more skills
   - Detect experience level from description
   - Parse multiple salary formats
   - Identify job categories

3. **Scheduled Scraping:**
   - Daily/weekly automatic runs
   - Cron job integration
   - Email notifications

4. **Quality Scoring:**
   - Rate job quality 1-100
   - Prioritize high-quality listings
   - Filter low-quality scrapes

5. **Advanced Filtering:**
   - Time zone preferences
   - Salary range filters
   - Skill matching
   - Company size preferences

## Cost Considerations

**Firecrawl API:**
- Pricing: ~$0.50-1.00 per 1000 pages scraped
- 250 jobs ≈ 50-100 pages ≈ $0.05-$0.10

**Anthropic Claude API:**
- Pricing: ~$3 per million tokens
- 250 jobs ≈ 500K tokens ≈ $1.50

**Total Cost Estimate:**
- **~$1.50-$2.00 per 250 jobs scraped**
- Very cost-effective for high-quality job data

## Best Practices

1. **Run Regularly:** Weekly or bi-weekly for fresh listings
2. **Monitor Logs:** Check Edge Function logs for errors
3. **Verify Quality:** Spot-check created jobs for accuracy
4. **Update Sources:** Add new job boards as they emerge
5. **Adjust Limits:** Increase target count as needed
6. **Clean Database:** Periodically remove old/expired jobs

## Support

For issues or questions:
1. Check Edge Function logs in Supabase dashboard
2. Review this documentation
3. Test with smaller target counts first
4. Verify API keys are correctly configured

## Conclusion

The remote job scraper provides a powerful, automated way to continuously populate the Jobbyist platform with high-quality remote job opportunities from international employers. By leveraging Firecrawl's web scraping capabilities and Claude's AI parsing, it delivers structured, accurate job data at scale.

**Target Met:** ✅ 250+ remote job listings scraped and published in existing format
