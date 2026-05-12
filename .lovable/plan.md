
This is a large, multi-area change. Here's how I'll execute it, grouped by area. I'll skip Paddle entirely.

## 1. Job scrapers (Adzuna, Jooble, Remotive)

Adzuna and Jooble require API keys; Remotive is a free public JSON feed.

- New edge function `scrape-adzuna` → `https://api.adzuna.com/v1/api/jobs/za/search/{page}` (needs `ADZUNA_APP_ID` + `ADZUNA_APP_KEY`).
- New edge function `scrape-jooble` → `https://jooble.org/api/{key}` POST with `{ keywords, location: "South Africa" }` (needs `JOOBLE_API_KEY`).
- New edge function `scrape-remotive` → `https://remotive.com/api/remote-jobs` (no key, filter for SA-friendly remote roles).
- New orchestrator `scrape-all-sources` invoked by pg_cron daily; also callable from `AdminScraper` UI.
- All write into `jobs` table in the existing format (with `country='ZA'`, JobPosting-friendly fields, `posted_at`, dedupe by source URL hash).
- I'll request `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `JOOBLE_API_KEY` via the secrets tool. Remotive starts feeding immediately.

## 2. Hide applicant counts

Remove the "X applicants" UI from `MatchedJobCard`, `JobDetail`, `Jobs` listing card, and any `FeaturedJobs` chip showing it.

## 3. Programmatic SEO landing pages

- New route `/jobs/:location` (already partly exists as `LocationJobs`) and `/jobs/category/:category`, plus combined `/jobs/:location/:category`.
- Generate static unique copy per page from a template (location/category interpolation + intro paragraph + FAQ schema + JobPosting list schema).
- Update `Navbar` Locations + Categories menus to link to these routes.
- Sitemap edge function already includes them; I'll verify the location/category lists match.
- Each job detail route already exists (`/job/:id`); I'll ensure SEO meta + JobPosting JSON-LD is emitted (audit `JobDetail.tsx` and `SEOHead`).

## 4. /sitemap.xml route

Add a static `vercel.json`/Vite redirect won't work since this is SPA on Lovable. Best approach: add a small `<link rel="sitemap">` in `index.html` plus update `public/sitemap.xml` periodically AND add documentation that the live sitemap is served by the edge function URL. I'll wire `/sitemap.xml` via a redirect in `public/_redirects` (Netlify-style) and also update `public/sitemap.xml` to 302 to the edge function. Most reliable here: replace `public/sitemap.xml` with a minimal index that references the edge function URL, and add `Sitemap:` line to `public/robots.txt`. I'll also add `vite.config.ts` middleware in dev to proxy.

The simplest production-correct fix: have `public/sitemap.xml` redirect via meta refresh is not crawler-safe. Instead I'll output a static stub sitemap that references the edge function as a sitemap-index. `<sitemapindex><sitemap><loc>https://<project>.functions.supabase.co/sitemap</loc>…`. Google supports sitemap index files pointing to other sitemap URLs.

## 5. Google Jobs Indexing API audit

`src/lib/googleIndexing.ts` is currently a stub. I'll create an edge function `index-job-url` that uses a `GOOGLE_INDEXING_SERVICE_ACCOUNT` JSON secret to POST to `https://indexing.googleapis.com/v3/urlNotifications:publish`, called automatically when a new job row is inserted (via DB trigger calling the function, or invoked from the scraper after each insert). I'll wire it into the scraper orchestrator. Will request the service account JSON secret.

## 6. Multi-step onboarding (Huzzle-style + AI interview)

Replace `MultiStepSignup` with a richer flow:
1. **Basics** — first/last name, email, phone, location/address, profile picture upload.
2. **Resume** — CV upload + parsed skills preview.
3. **Pro plan** — optional Jobbyist Pro toggle (no payment yet, just stores preference).
4. **Account** — username + password (account created at end of step 1).
5. **AI Interview** — uses Lovable AI Gateway (`google/gemini-2.5-flash`) edge function `ai-interview` that asks ~5 adaptive questions (career goals, salary expectations, work style, strengths, ideal role) and stores results in `profiles.interview_summary`.
6. **Welcome** — full-screen landing matching uploaded image (Jobbyist logo on gradient, thank-you copy, "Get Started" CTA → `/jobs`).

Profile persistence: all steps write to `profiles` immediately so dashboard stays in sync.

DB migration: add `interview_summary jsonb`, `interview_completed_at timestamptz`, `pro_interest boolean`, `address text`, `username text unique` columns to `profiles`.

## 7. Core Web Vitals

- Add `<link rel="preconnect">` for Supabase + Google Fonts in `index.html`.
- Convert `<img>` to `loading="lazy" decoding="async"` on Jobs/Location/Job detail pages.
- Add unique `<title>`/`<meta description>` per location/category landing via `SEOHead`.
- Add `<link rel="canonical">` per page.

---

### Secrets I'll need from you
- `ADZUNA_APP_ID` + `ADZUNA_APP_KEY` (free at developer.adzuna.com)
- `JOOBLE_API_KEY` (free at jooble.org/api/about)
- `GOOGLE_INDEXING_SERVICE_ACCOUNT` (full JSON of a service account with Indexing API enabled; optional — without it the scrapers still publish, just no instant ping)

Remotive needs no key and starts immediately.

### Order of execution
1. DB migration (profiles columns + any scraper-source tracking)
2. Edge functions (scrapers, orchestrator, indexing, AI interview)
3. Frontend: onboarding flow, welcome page, programmatic SEO pages, navbar links, hide applicants, lazy images, preconnect, sitemap stub.
4. Cron + verification.

Confirm and (if you have them) drop the API keys in chat or via the secrets prompts I'll fire after approval. I'll proceed with Remotive immediately and stub Adzuna/Jooble until keys land.
