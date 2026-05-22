/**
 * Central allowlist / blocklist for sponsored banner slots.
 *
 * Banners must NOT appear on:
 *  - Legal pages  (privacy, terms, cookies, data-rights)
 *  - Auth pages
 *  - Onboarding / profile / account flows
 *  - Dashboard / admin
 *  - Pro / payment / checkout pages
 *  - Waiting-list pages
 *  - Key landing pages: Recruitment Suite, Professional Profiles, 30-Day Remote Job Sprint
 *  - Resume-builder / job-matcher tools
 */
export const BANNER_BLOCKLIST: RegExp[] = [
  /^\/privacy/,
  /^\/terms/,
  /^\/cookies/,
  /^\/data-rights/,
  /^\/auth/,
  /^\/profile/,
  /^\/pro$/,
  /^\/builder/,
  /^\/job-matcher/,
  /^\/resume-builder/,
  /^\/professional-profiles/,
  /^\/recruitment-suite/,
  /^\/30-day-job-sprint/,
  /^\/admin/,
  /^\/waiting-list/,
  /^\/onboarding/,
];

/**
 * Returns true when sponsored banners are permitted on the given pathname.
 */
export function isBannerAllowedOnPath(pathname: string): boolean {
  return !BANNER_BLOCKLIST.some((pattern) => pattern.test(pathname));
}

/** All supported slot keys */
export type SlotKey =
  | 'homepage_top'
  | 'homepage_mid'
  | 'category_top'
  | 'job_list_mid'
  | 'guide_top'
  | 'guide_bottom'
  | 'resource_hub_mid';
