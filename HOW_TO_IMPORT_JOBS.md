# How to Import Remote Jobs

This guide explains how to import the 250+ remote job listings into your Jobbyist platform.

## Quick Start

### Option 1: Via Admin UI (Recommended)

1. Log in to your admin account
2. Navigate to `/admin/scraper`
3. Click on "Import Remote Jobs" button
4. Wait for the import to complete
5. Verify jobs in `/admin/jobs`

### Option 2: Via API/Command Line

If you have Supabase CLI installed:

```bash
# Invoke the import function
supabase functions invoke import-remote-jobs --method POST
```

Or via curl:

```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/import-remote-jobs' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

### Option 3: Using Import Jobs Function

You can also use the existing import-jobs function:

```bash
# Load the JSON and send to import-jobs endpoint
cat public/data/remote-jobs-international.json | \
  curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/import-jobs' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d @-
```

## What Gets Imported

- **250 job listings** from international companies
- **~73 unique companies** (will be created if they don't exist)
- All jobs are marked as **remote** and available for South African talent
- Jobs include:
  - Title, description, requirements
  - Salary ranges (in ZAR)
  - Skills and benefits
  - Company information with logos
  - Source URLs

## Job Categories

The import includes jobs across 10 categories:

1. **Software Engineering** (33 jobs)
   - Full Stack, Backend, Frontend, DevOps, SRE, Mobile, etc.

2. **Product & Design** (7 jobs)
   - Product Managers, UX/UI Designers, Researchers

3. **Data & Analytics** (27 jobs)
   - Data Scientists, Analysts, BI Specialists

4. **Customer Success** (2 jobs)
   - CSMs, Technical Account Managers, Support Engineers

5. **Marketing** (varies)
   - Content, Digital, Growth, Performance Marketing

6. **Sales** (15 jobs)
   - SDRs, Account Executives, Business Development

7. **Finance & Operations** (varies)
   - Financial Analysts, Accountants, Operations Managers

8. **People & HR** (6 jobs)
   - Recruiters, HR Business Partners, People Ops

9. **Legal & Compliance** (3 jobs)
   - Legal Counsel, Compliance Managers, Privacy Officers

10. **Content & Writing** (13 jobs)
    - Technical Writers, Content Strategists, Copywriters

## Featured Companies

Some of the international companies included:

- **Tech Giants**: Stripe, GitLab, Shopify, Atlassian, Canva
- **Fintech**: Revolut, Wise, Coinbase, Plaid, Square
- **SaaS**: Slack, Zoom, HubSpot, Salesforce, Zendesk
- **E-commerce**: Etsy, eBay, Wayfair
- **Travel**: Airbnb, Booking.com, Expedia
- **EdTech**: Coursera, Udemy, Duolingo
- And many more!

## Verification

After import, you can verify the results:

1. **Check job count**:
   ```sql
   SELECT COUNT(*) FROM jobs WHERE is_remote = true;
   ```

2. **View imported companies**:
   ```sql
   SELECT name, website, logo_url FROM companies 
   WHERE location = 'International' 
   ORDER BY name;
   ```

3. **Sample imported jobs**:
   ```sql
   SELECT title, location, salary_min, salary_max 
   FROM jobs 
   WHERE is_remote = true 
   LIMIT 10;
   ```

## Troubleshooting

### Import Failed

**Issue**: Function returns an error

**Solutions**:
- Check Supabase credentials are configured
- Verify the JSON file is accessible
- Check function logs in Supabase dashboard
- Ensure database has proper permissions

### Duplicate Jobs

**Issue**: Some jobs already exist

**Solution**: 
- The import automatically skips duplicates based on `source_url`
- Safe to run multiple times without creating duplicates

### Missing Logos

**Issue**: Company logos not displaying

**Solution**:
- Logos use Clearbit API: `https://logo.clearbit.com/{domain}`
- Some companies may not have logos in Clearbit
- Fallback to company initial will be used

### Import is Slow

**Issue**: Import takes a long time

**Solution**:
- This is normal - processing 250 jobs + 73 companies takes time
- Expected duration: 2-5 minutes
- Monitor progress in function logs

## Re-importing

To refresh the jobs:

1. Delete old imports (optional):
   ```sql
   DELETE FROM jobs WHERE source_name = 'remote-jobs';
   ```

2. Re-run the import function

3. Or update the JSON file and re-import

## Next Steps

After importing:

1. **Review jobs** in the admin panel
2. **Feature top jobs** on the homepage
3. **Enable filters** for remote jobs
4. **Promote** the remote jobs section to users
5. **Track** application metrics

## Support

For issues or questions:
- Check `REMOTE_JOBS_IMPORT.md` for detailed documentation
- Review function logs in Supabase dashboard
- Check the GitHub repository for updates

## Data Maintenance

### Updating Job Data

To add more jobs or update existing ones:

1. Edit `scripts/generate-remote-jobs.ts`
2. Run: `npm run generate-jobs`
3. Commit the updated JSON file
4. Re-run the import

### Adding Companies

To add more international companies:

1. Edit the `INTERNATIONAL_COMPANIES` array in the generator script
2. Regenerate the JSON
3. Re-import

## Success Criteria

After successful import, you should see:
- ✅ 250 new job listings in the database
- ✅ ~73 new company profiles
- ✅ All jobs marked as remote and active
- ✅ Jobs appear in search and filters
- ✅ Company logos display correctly
- ✅ Jobs are accessible via public pages

## Performance

Expected metrics:
- **Import time**: 2-5 minutes
- **Storage**: ~5MB for JSON data
- **Database records**: 250 jobs + 73 companies
- **API calls**: Minimal (uses static data file)

Enjoy connecting South African talent with global opportunities! 🌍
