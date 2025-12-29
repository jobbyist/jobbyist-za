# Company Scraping with Firecrawl

This document explains how to use Firecrawl to scrape South African company data and populate the database.

## Overview

The Jobbyist platform now includes 100+ South African companies with:
- Company logos (via Clearbit Logo API)
- Company descriptions
- Website links
- Industry classifications
- Company sizes
- Dedicated company profile pages
- Claim functionality for companies

## Company Data Structure

Each company includes:
- **Name**: Official company name
- **Slug**: URL-friendly identifier
- **Description**: Brief overview of the company
- **Logo URL**: Company logo (using Clearbit Logo API as primary source)
- **Website**: Company website URL
- **Industry**: Business sector
- **Size**: Employee count range
- **Location**: Primary office location in South Africa
- **Country**: ZA (South Africa)
- **Verification Status**: Whether the company is verified
- **Claim Status**: unclaimed, pending, approved, or rejected

## Populating Companies

### Option 1: Use the Pre-configured Function

The system includes a pre-configured Supabase Edge Function with 100+ South African companies:

```bash
# Via Supabase CLI
supabase functions invoke scrape-sa-jobs --data '{"count": 100}'
```

This will create:
- 100+ verified South African companies
- Realistic job listings for each company
- Company logos from Clearbit
- Full company profiles

### Option 2: Using Firecrawl API (For Real-Time Scraping)

The `firecrawl-scrape` function can be used to scrape individual company websites:

```typescript
// Example: Scrape a company website
const response = await supabase.functions.invoke('firecrawl-scrape', {
  body: {
    url: 'https://www.takealot.com/about',
    options: {
      formats: ['markdown'],
      onlyMainContent: true
    }
  }
});
```

## Company Logo Sources

Logos are sourced from:
1. **Clearbit Logo API** (Primary): `https://logo.clearbit.com/{domain}`
2. **Fallback**: Company initial in a colored circle

Example logo URLs:
- Takealot: `https://logo.clearbit.com/takealot.com`
- Discovery: `https://logo.clearbit.com/discovery.co.za`
- Capitec: `https://logo.clearbit.com/capitecbank.co.za`

## Company Features

### 1. Dedicated Company Pages

Each company has a dedicated page at `/company/{slug}`:
- Company logo and header
- Full description
- Company information (location, size, industry)
- List of open positions
- Claim page functionality

### 2. Claim Page Functionality

Companies can claim their pages to:
- Update company information
- Manage job listings
- Verify authenticity

**Claim Process**:
1. User clicks "Claim This Page" on company profile
2. Fills out claim form with justification
3. Claim goes to "pending" status
4. Admin reviews and approves/rejects
5. Approved claimers can manage the page

### 3. Company Listings Page

Browse all companies at `/companies`:
- Search by company name
- Filter by industry
- View company cards with key info
- Click through to company profiles

## Database Schema

### Companies Table

```sql
CREATE TABLE public.companies (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    industry TEXT,
    size TEXT,
    location TEXT,
    country country_code NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    claimed_by UUID REFERENCES auth.users(id),
    claimed_at TIMESTAMP WITH TIME ZONE,
    claim_status TEXT DEFAULT 'unclaimed',
    claim_notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Admin Features

Admins can:
1. View all companies in `/admin/companies`
2. Create new companies manually
3. Verify companies
4. Review and approve claim requests
5. Delete companies
6. Run the scraper via `/admin/scraper`

## Best Practices

1. **Logo Quality**: Always provide high-quality logo URLs. Clearbit provides good fallback logos for most major companies.

2. **Descriptions**: Keep descriptions concise (1-2 sentences) and focused on what makes the company unique.

3. **Verification**: Verify companies to build trust with job seekers.

4. **Regular Updates**: Run the scraper periodically to keep company data fresh and add new companies.

5. **Claim Monitoring**: Regularly review claim requests to ensure legitimate company representatives can manage their pages.

## Example Companies Included

The system includes 100+ South African companies across various industries:

- **Technology**: Takealot, Naspers, Entelect, BBD, DVT, Microsoft SA, Google SA
- **Banking**: Capitec, Standard Bank, FNB, Nedbank, Absa, Investec
- **Telecommunications**: MTN, Vodacom, Telkom, Cell C
- **Retail**: Shoprite, Pick n Pay, Woolworths, Clicks
- **Insurance**: Discovery, Sanlam, Old Mutual, Liberty
- **Mining**: Anglo American, Sibanye-Stillwater, Sasol
- **Consulting**: Deloitte, PwC, KPMG, EY, Accenture
- **And many more across different sectors**

## Future Enhancements

Potential improvements:
1. Real-time logo scraping from company websites
2. Social media integration (LinkedIn, Twitter)
3. Company reviews and ratings
4. Employee testimonials
5. Salary data by company
6. Company culture insights
7. Automated logo uploads to company-logos storage bucket
