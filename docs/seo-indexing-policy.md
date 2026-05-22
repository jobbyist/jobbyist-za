# Jobs Indexing Policy (ZA)

This policy defines which jobs listing URLs should be indexable and which should be excluded from indexing.

## Goals

- Keep high-intent landing pages indexable for organic discovery.
- Prevent crawl waste on low-value permutations.
- Keep canonicals and sitemap entries aligned with indexability.

## Route policy

### `/jobs` query combinations

- **Indexable**
  - `/jobs` (no query params, page 1).
- **Non-indexable (`noindex,follow`)**
  - Any filtered query, e.g. `search`, `location`, `type`, `level`, `remote`.
  - Pagination permutations, e.g. `/jobs?page=2+`.
- **Canonical**
  - All `/jobs` query permutations canonicalize to `/jobs`.

### `/jobs/categories/*`

- **Indexable**
  - Valid category slug pages (e.g. `/jobs/categories/software-development`).
- **Non-indexable (`noindex,follow`)**
  - Any additional query-string permutations.
  - Invalid slugs (handled via app routing/normalization).

### `/jobs/provinces/*`

- **Indexable**
  - Valid province landing pages (e.g. `/jobs/provinces/gauteng`).
- **Non-indexable (`noindex,follow`)**
  - Query-string permutations.
  - Low-quality pages with no meaningful inventory.

### `/jobs/cities/*`

- **Indexable**
  - Valid city landing pages (e.g. `/jobs/cities/johannesburg`).
- **Non-indexable (`noindex,follow`)**
  - Query-string permutations.
  - Low-quality pages with no meaningful inventory.

### `/jobs/combo/*`

- **Non-indexable (`noindex,follow`)** by default.
  - These combinatorial pages create large permutation space and generally low marginal SEO value.
- **Canonical**
  - Self-canonical URL is retained for consistency, but robots noindex prevents index bloat.

## Sitemap alignment

Sitemap should include:

- Core pages (`/`, `/jobs`, `/companies`, etc.).
- Curated **indexable** facet pages only:
  - `/jobs/provinces/*`
  - `/jobs/cities/*`
  - `/jobs/categories/*`

Sitemap should exclude:

- `/jobs` query permutations.
- `/jobs/combo/*` permutations.
- Other non-indexable filtered permutations.
