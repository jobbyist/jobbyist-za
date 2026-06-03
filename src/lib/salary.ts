// Salary display helpers — always show frequency next to the amount,
// or fall back to "Negotiable" when nothing reliable is available.

import { getCountryByCode, type CountryCode } from "@/lib/countries";

export type SalaryPeriod = "hour" | "day" | "week" | "month" | "year" | string | null | undefined;

const PERIOD_LABEL: Record<string, string> = {
  hour: "per hour",
  day: "per day",
  week: "per week",
  month: "monthly",
  year: "annually",
};

export function formatPeriod(period: SalaryPeriod): string {
  if (!period) return "monthly";
  return PERIOD_LABEL[period.toLowerCase()] || period;
}

interface SalaryArgs {
  min?: number | null;
  max?: number | null;
  currency?: string | null;
  period?: SalaryPeriod;
  country?: CountryCode | string | null;
}

function symbolFor(currency?: string | null, country?: string | null) {
  if (currency === "ZAR" || country === "ZA") return "R";
  if (currency === "NGN") return "₦";
  if (currency === "KES") return "KSh";
  if (currency) return currency + " ";
  const c = country ? getCountryByCode(country as CountryCode) : undefined;
  return c?.currencySymbol ? c.currencySymbol + " " : "R ";
}

function compact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

/**
 * Build a human-readable salary string with frequency suffix,
 * or "Negotiable" when no salary information is available.
 */
export function formatSalaryRange({ min, max, currency, period, country }: SalaryArgs): string {
  const hasMin = typeof min === "number" && min > 0;
  const hasMax = typeof max === "number" && max > 0;
  if (!hasMin && !hasMax) return "Negotiable";

  const sym = symbolFor(currency, country ?? null);
  const label = formatPeriod(period);

  let amount: string;
  if (hasMin && hasMax) amount = `${sym}${compact(min!)} – ${sym}${compact(max!)}`;
  else if (hasMin) amount = `From ${sym}${compact(min!)}`;
  else amount = `Up to ${sym}${compact(max!)}`;

  return `${amount} ${label}`;
}
