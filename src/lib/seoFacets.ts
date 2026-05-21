/**
 * South Africa-focused programmatic SEO facet data and helpers.
 * Used to generate location/type/category landing pages, structured
 * data, sitemap entries, and breadcrumbs across Jobbyist ZA.
 */

/** All nine South African provinces. */
export const provinces = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
] as const;

export type Province = (typeof provinces)[number];

/** Major employment hubs grouped by province. */
export const majorCities: Record<Province, string[]> = {
  'Gauteng': ['Johannesburg', 'Pretoria', 'Sandton', 'Midrand', 'Centurion', 'Soweto', 'Roodepoort', 'Benoni', 'Boksburg', 'Kempton Park'],
  'Western Cape': ['Cape Town', 'Stellenbosch', 'Paarl', 'George', 'Worcester'],
  'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Umhlanga', 'Newcastle', 'Richards Bay'],
  'Eastern Cape': ['Gqeberha', 'East London', 'Mthatha', 'Uitenhage'],
  'Free State': ['Bloemfontein', 'Welkom', 'Bethlehem'],
  'Limpopo': ['Polokwane', 'Tzaneen', 'Mokopane'],
  'Mpumalanga': ['Mbombela', 'Witbank', 'Secunda'],
  'North West': ['Rustenburg', 'Klerksdorp', 'Mahikeng', 'Potchefstroom'],
  'Northern Cape': ['Kimberley', 'Upington', 'Kuruman'],
};

/** All major cities (flat) for quick lookup. */
export const allCities: string[] = Object.values(majorCities).flat();

/** Supported job/employment types for facet pages. */
export const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Remote',
  'Telecommute',
  'Hybrid',
  'Learnership',
  'Internship',
  'Graduate',
] as const;

export type JobTypeFacet = (typeof jobTypes)[number];

/** Common SA job categories / industries. */
export const categories = [
  'Software Development',
  'Marketing',
  'Customer Support',
  'Design & UX',
  'Sales',
  'Operations',
  'Finance',
  'Healthcare',
  'Engineering',
  'Admin',
  'Education',
  'Human Resources',
  'Legal',
  'Logistics',
  'Hospitality',
  'Retail',
  'Construction',
  'Mining',
  'Data & Analytics',
  'Project Management',
] as const;

export type Category = (typeof categories)[number];

/**
 * Convert a string to a URL-safe slug (lowercase, hyphenated, ASCII only).
 * @example slugify('Software Development') // "software-development"
 * @example slugify('KwaZulu-Natal') // "kwazulu-natal"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Reverse-lookup a province from its slug. */
export function provinceFromSlug(slug: string): Province | undefined {
  return provinces.find((p) => slugify(p) === slug);
}

/** Reverse-lookup a city from its slug. */
export function cityFromSlug(slug: string): string | undefined {
  return allCities.find((c) => slugify(c) === slug);
}

/** Reverse-lookup a job type from its slug. */
export function jobTypeFromSlug(slug: string): JobTypeFacet | undefined {
  return jobTypes.find((t) => slugify(t) === slug);
}

/** Reverse-lookup a category from its slug. */
export function categoryFromSlug(slug: string): Category | undefined {
  return categories.find((c) => slugify(c) === slug);
}

/** Find which province a city belongs to. */
export function provinceForCity(city: string): Province | undefined {
  return (Object.keys(majorCities) as Province[]).find((p) =>
    majorCities[p].some((c) => c.toLowerCase() === city.toLowerCase())
  );
}

export interface FacetParams {
  province?: string;
  city?: string;
  jobType?: string;
  category?: string;
}

/**
 * Generate an SEO-friendly title for a facet combination.
 * @example getFacetTitle({ city: 'Johannesburg', jobType: 'Remote', category: 'Software Development' })
 *   // "Remote Software Development Jobs in Johannesburg, Gauteng | Jobbyist ZA"
 */
export function getFacetTitle(params: FacetParams): string {
  const { province, city, jobType, category } = params;
  const parts: string[] = [];
  if (jobType) parts.push(jobType);
  if (category) parts.push(category);
  parts.push('Jobs');

  const locationProvince = province || (city ? provinceForCity(city) : undefined);
  if (city && locationProvince) {
    parts.push(`in ${city}, ${locationProvince}`);
  } else if (city) {
    parts.push(`in ${city}`);
  } else if (province) {
    parts.push(`in ${province}`);
  } else {
    parts.push('in South Africa');
  }
  const head = parts.join(' ');
  // Keep title under ~60 chars where possible.
  return `${head} | Jobbyist ZA`.slice(0, 65);
}

/**
 * Generate an SEO-friendly meta description (<160 chars).
 */
export function getFacetDescription(params: FacetParams, jobCount?: number): string {
  const { province, city, jobType, category } = params;
  const location = city
    ? `${city}${provinceForCity(city) ? `, ${provinceForCity(city)}` : ''}`
    : province || 'South Africa';
  const type = jobType ? `${jobType.toLowerCase()} ` : '';
  const cat = category ? `${category} ` : '';
  const count = jobCount && jobCount > 0 ? `${jobCount}+ ` : '';
  const desc = `Browse ${count}${type}${cat}jobs in ${location}. Apply directly on Jobbyist ZA with verified employers, salary insights, and daily updates.`;
  return desc.slice(0, 158);
}

/**
 * Generate a canonical URL for a facet combination.
 */
export function getFacetPath(params: FacetParams): string {
  const { province, city, jobType, category } = params;
  if (city && jobType && category) {
    return `/jobs/${slugify(city)}/${slugify(jobType)}/${slugify(category)}`;
  }
  if (city) return `/jobs/cities/${slugify(city)}`;
  if (province) return `/jobs/provinces/${slugify(province)}`;
  if (jobType) return `/jobs/types/${slugify(jobType)}`;
  if (category) return `/jobs/categories/${slugify(category)}`;
  return '/jobs';
}

/**
 * Short intro paragraph rendered on facet pages for unique content / SEO depth.
 */
export function getFacetIntro(params: FacetParams): string {
  const { province, city, jobType, category } = params;
  const loc = city || province || 'South Africa';
  const type = jobType ? jobType.toLowerCase() : '';
  const cat = category ? category : 'roles across industries';
  return `Discover the latest ${type} ${cat} in ${loc}. Jobbyist ZA aggregates listings from credible South African employers and global remote-friendly companies hiring SA talent, with salary ranges in ZAR, clear application steps, and free tools to help you land the role.`.replace(/\s+/g, ' ');
}
