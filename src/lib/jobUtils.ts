// Shared helpers for job freshness + paygate logic.
// Jobs older than this are visually marked "Offer Expired".
export const JOB_EXPIRY_DAYS = 30;

export function getJobAgeDays(postedAt: string | null | undefined): number {
  if (!postedAt) return 0;
  const posted = new Date(postedAt).getTime();
  const now = Date.now();
  return Math.floor((now - posted) / (1000 * 60 * 60 * 24));
}

export function isJobExpired(postedAt: string | null | undefined): boolean {
  return getJobAgeDays(postedAt) > JOB_EXPIRY_DAYS;
}
