import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jobTypes, slugify, type JobTypeFacet } from "./seoFacets";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format salary range for display.
 */
export function formatSalaryRange(min?: number | null, max?: number | null, currency: string = 'R'): string {
  if (!min && !max) return '';
  if (min && max) return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  if (min) return `From ${currency}${min.toLocaleString()}`;
  return `Up to ${currency}${max?.toLocaleString()}`;
}

export const SITE_ORIGIN = 'https://za.jobbyist.africa';

/**
 * Build a canonical absolute URL for a given path.
 * Strips trailing slashes (except root) and trailing query/hash noise.
 */
export function generateCanonicalUrl(path: string = '/'): string {
  const cleanPath = path.split('#')[0].split('?')[0];
  const normalized = cleanPath === '/' ? '/' : cleanPath.replace(/\/+$/g, '');
  return `${SITE_ORIGIN}${normalized.startsWith('/') ? '' : '/'}${normalized}`;
}

/**
 * Normalize a free-form location string for use in SEO copy.
 * "johannesburg " -> "Johannesburg", "cape-town" -> "Cape Town".
 */
export function formatLocationForSEO(location?: string | null): string {
  if (!location) return 'South Africa';
  return location
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Normalize an arbitrary job type string into one of our supported facet
 * values. Returns undefined if no reasonable match.
 */
export function normalizeJobType(input?: string | null): JobTypeFacet | undefined {
  if (!input) return undefined;
  const slug = slugify(input);
  return jobTypes.find((t) => slugify(t) === slug);
}

/** Build a stable slug for a job detail URL fragment. */
export function jobSlug(title: string, id: string): string {
  return `${slugify(title).slice(0, 60)}-${id.slice(0, 8)}`;
}
