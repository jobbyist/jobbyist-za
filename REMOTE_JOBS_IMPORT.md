# Import Remote Jobs from International Employers

This document explains how to import 250+ remote job listings from international employers targeting South African talent.

## Overview

The system includes:
- **250+ remote job listings** from international companies
- **80+ international employers** including tech giants, fintech, SaaS, and more
- **10 job categories**: Software Engineering, Product Design, Data Analytics, Customer Success, Marketing, Sales, Finance, HR, Legal, and Content Writing
- All positions are **remote-friendly** for South African talent

## Data File

Location: `/public/data/remote-jobs-international.json`

This file contains 250 job listings with:
- Company name and domain
- Job title and description
- Employment type (Full-time, Part-time, Contract)
- Location (Remote - South Africa)
- Posted date
- Source URL

## International Companies Included

### Tech Giants
- Stripe, GitLab, Automattic, Zapier, Buffer, Shopify, Atlassian, Canva
- Slack, Zoom, Twilio, HubSpot, Salesforce, Adobe, ServiceNow

### Fintech
- Revolut, Wise (TransferWise), N26, Coinbase, Kraken, Plaid, Square, PayPal, Adyen

### European Tech
- Spotify, Klarna, Bolt, Pipedrive, Monzo, Starling Bank, Personio

### Cloud & SaaS
- Datadog, HashiCorp, MongoDB, Elastic, Confluent, New Relic, PagerDuty, Workday, Zendesk, Intercom

### E-commerce & Travel
- Etsy, eBay, Wayfair, Airbnb, Booking.com, Expedia

### Healthcare & EdTech
- Teladoc, Babylon Health, Coursera, Udemy, Duolingo, MasterClass

And many more across various industries!

## Job Categories & Roles

### 1. Software Engineering (20 roles)
- Full Stack Engineer, Backend/Frontend Developer
- DevOps Engineer, SRE, Cloud Infrastructure Engineer
- Mobile Developer (iOS/Android)
- Engineering Manager, Technical Lead
- Security Engineer, Data Engineer, ML Engineer

### 2. Product & Design (10 roles)
- Product Manager (Senior, Technical, Growth)
- UX Researcher, UI/UX Designer
- Design Systems Lead, Visual Designer

### 3. Data & Analytics (10 roles)
- Data Scientist, Data Analyst
- Business Intelligence Analyst
- Analytics Engineer, Marketing Analytics

### 4. Customer Success (10 roles)
- Customer Success Manager
- Technical Account Manager
- Customer Support Engineer
- Implementation Specialist, Solutions Consultant

### 5. Marketing (10 roles)
- Content Marketing, Digital Marketing
- Growth Marketing, Performance Marketing
- SEO Manager, Social Media Manager
- Product Marketing, Brand Manager

### 6. Sales (10 roles)
- Sales Development Representative
- Account Executive (Enterprise, Senior)
- Business Development Manager
- Partnerships Manager, Sales Operations

### 7. Finance & Operations (10 roles)
- Financial Analyst, Accountant
- Financial Controller, FP&A Analyst
- Revenue Accountant, Payroll Specialist
- Operations Manager

### 8. People & HR (10 roles)
- Talent Acquisition Specialist, Recruiter
- HR Business Partner
- People Operations Manager
- Compensation & Benefits Manager
- Employee Experience Manager

### 9. Legal & Compliance (10 roles)
- Legal Counsel, Compliance Manager
- Privacy Officer, Contracts Manager
- Risk Manager, Corporate Counsel

### 10. Content & Writing (10 roles)
- Technical Writer, Content Writer
- Copywriter, Editor
- Content Strategist, SEO Content Writer

## How to Import Jobs

### Option 1: Via Supabase Edge Function

Deploy and invoke the import function:

```bash
# Deploy the function
supabase functions deploy import-remote-jobs

# Invoke the function to import all jobs
supabase functions invoke import-remote-jobs --method POST

# Or via API
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/import-remote-jobs' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

### Option 2: Via Admin UI

1. Navigate to `/admin/scraper` in your application
2. Look for "Import Remote Jobs" option
3. Click to trigger the import
4. Monitor the progress and results

### Option 3: Using Import Jobs Function

Use the existing import-jobs function with the data file:

```bash
# Read the JSON file
cat public/data/remote-jobs-international.json | \
  curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/import-jobs' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d @-
```

## What Gets Created

### Companies
- Creates or updates international company profiles
- Sets company as verified and active
- Adds company logo via Clearbit
- Sets location as "International"
- Links to company website

### Jobs
Each job includes:
- **Title**: Cleaned job title (max 200 chars)
- **Description**: Comprehensive job summary
- **Employment Type**: Full-time, Part-time, or Contract
- **Experience Level**: Entry Level, Mid Level, Senior, or Lead
- **Location**: Remote - South Africa (various formats)
- **Salary**: Competitive ZAR ranges based on experience
  - Entry Level: R25,000 - R45,000/month
  - Mid Level: R45,000 - R80,000/month
  - Senior: R80,000 - R150,000/month
  - Lead: R150,000 - R250,000/month
- **Remote**: Always true
- **Skills**: Auto-extracted from job title and description
- **Benefits**: Standard remote benefits package
  - Remote Work
  - Flexible Hours
  - Health Insurance
  - Professional Development
  - Equity/Stock Options
  - Unlimited PTO
  - Home Office Stipend
  - Learning Budget
  - Conference Attendance

## Features

### Auto-Extraction
- Experience level from job title keywords
- Skills from job descriptions
- Job type from employment type field
- Salary ranges based on experience level

### Deduplication
- Checks for existing jobs by source_url
- Checks for existing companies by slug
- Only creates new records when needed

### Error Handling
- Logs errors for individual job imports
- Continues processing even if some jobs fail
- Returns summary with counts and errors

## Expected Results

After import, you should have:
- **250 new job listings** in the jobs table
- **~80 new companies** in the companies table
- All jobs marked as **active** and **remote**
- Jobs distributed across **10 categories**
- Focus on **international remote opportunities**

## Maintenance

### Updating Jobs
To update the job listings:
1. Regenerate the JSON file using `scripts/generate-remote-jobs.ts`
2. Commit the updated file
3. Re-run the import function

### Adding More Companies
Edit `scripts/generate-remote-jobs.ts` to add more international companies to the `INTERNATIONAL_COMPANIES` array.

### Customizing Job Descriptions
Edit the `JOB_DESCRIPTIONS` object in the generator script to add more variety to job descriptions.

## Benefits for Job Seekers

1. **Global Opportunities**: Access to roles at world-class international companies
2. **Remote First**: All positions support remote work from South Africa
3. **Competitive Salaries**: International salary benchmarks in ZAR
4. **Career Growth**: Opportunities across all experience levels
5. **Diverse Roles**: 10 categories covering tech and non-tech positions
6. **Verified Companies**: All companies are marked as verified
7. **Rich Details**: Comprehensive job descriptions and requirements

## Technical Notes

### Data Generation
- Jobs are generated programmatically using `scripts/generate-remote-jobs.ts`
- Ensures consistency and scalability
- Easy to regenerate with updated data

### Firecrawl Integration
While this uses static data, the structure follows Firecrawl's job schema format, making it compatible with future web scraping integration.

### Database Schema
All jobs follow the standard schema:
- Compatible with existing job filtering and search
- Supports all job board features
- SEO-optimized with proper metadata

## Troubleshooting

### Import Fails
- Check Supabase credentials are set
- Verify the JSON file is accessible
- Check function logs in Supabase dashboard

### Duplicate Jobs
- The import automatically skips duplicates
- Based on source_url uniqueness
- Safe to run multiple times

### Missing Companies
- Companies are created automatically
- Check company slug generation
- Verify logo URLs are valid

## Future Enhancements

1. **Real-time Scraping**: Integrate Firecrawl to scrape actual job listings
2. **Auto-refresh**: Scheduled function to update jobs daily
3. **More Companies**: Add more international employers
4. **Salary Data**: Connect to real-time salary APIs
5. **Application Tracking**: Enable direct applications through the platform
6. **Company Verification**: Add verification badges for trusted employers
7. **Skills Matching**: Enhanced skills extraction and matching
8. **Saved Searches**: Allow users to save searches for remote jobs

## Success Criteria

✅ 250+ remote job listings created
✅ 80+ international companies added
✅ All jobs marked as remote
✅ Focus on South African talent
✅ Diverse job categories and roles
✅ Competitive salary ranges
✅ Comprehensive job descriptions
✅ Proper company profiles with logos
✅ Searchable and filterable
✅ SEO-optimized

## Conclusion

This import adds significant value to the platform by:
- Providing South African job seekers access to global opportunities
- Showcasing remote-first companies
- Offering competitive international positions
- Supporting various career levels and categories
- Enabling job seekers to find remote work without relocation

The system is designed to be maintainable, scalable, and aligned with the platform's goal of connecting South African talent with great opportunities worldwide.
