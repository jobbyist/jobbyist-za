# Programmatic SEO Implementation Progress Report

## Scope

This implementation creates a programmatic SEO system for South African category-by-city jobs landing pages using the URL pattern:

```text
/jobs/[category]/[city]
```

Examples:

```text
/jobs/software-developer/johannesburg
/jobs/accountant/cape-town
/jobs/data-analyst/pretoria
```

Category and city values are slugified and configured centrally.

## Implementation Summary

### 1. URL Structure

Implemented a React Router route for:

```tsx
<Route path="/jobs/:category/:city" element={<CountryCityJobsPage />} />
```

This route sits after the more-specific existing SEO routes such as `/jobs/category/:category`, `/jobs/cities/:city`, `/jobs/types/:type`, and `/jobs/country/:countryCode`, so it does not override them.

### 2. Category and City Config

Added shared programmatic SEO definitions in:

```text
src/config/programmatic-seo.json
src/lib/categories.ts
```

The config includes:

- Job categories such as Software Developer, Accountant, Data Analyst, Digital Marketer, Sales Representative, Customer Support, Project Manager, Human Resources, Graphic Designer, and Operations Manager.
- South African cities such as Johannesburg, Cape Town, Durban, Pretoria, Gqeberha, Bloemfontein, East London, Polokwane, Nelspruit, Kimberley, and Remote.
- City aliases, for example Johannesburg includes Joburg, JHB, Sandton, Rosebank, and Midrand.

### 3. Supabase Query Layer

Added a typed data layer in:

```text
src/lib/programmaticSeoData.ts
```

It fetches candidate jobs from Supabase using:

- `jobs.status = active`
- `jobs.country = ZA`
- city alias matching against `jobs.location`
- remote matching against `jobs.is_remote`
- category keyword matching across job title, description, job type, employment type, skills, company name, and company industry

The page data includes:

- Total matching jobs for the category-city combination
- Top 10 job listings
- Top 3 hiring companies
- Average salary, when salary data exists
- Related categories in the same city
- Related cities for the same category

### 4. React Page Component

Added:

```text
src/pages/CountryCityJobsPage.tsx
```

The component renders:

- Unique H1 in the format: `Software Developer Jobs in Johannesburg (47 open roles)`
- Unique meta title and description
- Noindex behavior for combinations with fewer than 3 active jobs
- Page insights for job count, average salary, and hiring companies
- Top 10 matching job cards
- Top 3 hiring companies
- Internal links to related categories in the same city
- Internal links to top cities for the same category
- Breadcrumb and CollectionPage JSON-LD

### 5. Sitemap Generation

Added:

```text
scripts/generate-programmatic-seo.mjs
```

The script:

- Reads `src/config/programmatic-seo.json`
- Queries Supabase for active jobs
- Generates only category-city combinations with at least 3 active jobs
- Writes `public/programmatic-seo-combos.json`
- Writes `public/sitemap-programmatic-jobs.xml`

The generated JSON powers internal linking, while the XML sitemap allows Google to crawl all valid landing pages.

### 6. Build and Deployment Configuration

Updated `package.json`:

```json
"prebuild": "node scripts/generate-programmatic-seo.mjs",
"generate:seo": "node scripts/generate-programmatic-seo.mjs"
```

Because npm automatically runs `prebuild` before `npm run build`, the programmatic SEO sitemap is regenerated during every production build.

Updated `.github/workflows/deploy.yml`:

- Keeps GitHub Pages deployment intact.
- Adds a daily scheduled rebuild at `02:15 UTC`.
- Passes Supabase secrets to the build step.

Required GitHub secrets:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

If Supabase secrets are missing, the generator safely writes empty SEO outputs instead of breaking the build.

### 7. Robots.txt

Updated `public/robots.txt` to expose the generated sitemap:

```text
Sitemap: https://za.jobbyist.africa/sitemap-programmatic-jobs.xml
```

### 8. Optional Supabase RPC

Added optional SQL helper:

```text
supabase/sql/programmatic-seo-combos.sql
```

This provides a `public.get_programmatic_job_combo(...)` function that can return total jobs, top jobs, top companies, and average salary for a category-city combination directly from Supabase.

## Thin Content Controls

A category-city page is indexable only if it has at least 3 active jobs. The generator only includes valid combinations in the sitemap, and the React page applies `noindex` if a direct URL is visited with fewer than 3 jobs.

## Build Status

Build configuration has been updated and is ready for GitHub Actions. Local build was not executed in this environment. The deployment workflow will run:

```bash
npm ci
npm run build
```

During build, `prebuild` will execute the programmatic SEO generator.

## Next Recommended Enhancements

1. Add a materialized Supabase view for category-city stats once traffic grows.
2. Add canonical redirects from legacy `/jobs/category/[category]/[city]` URLs to `/jobs/[category]/[city]` if needed.
3. Expand categories based on real search data from Search Console.
4. Add server-side or prerendered HTML for the generated pages if Google indexing quality remains limited by SPA rendering.
