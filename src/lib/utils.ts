import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format salary range for display
 * @param min - Minimum salary
 * @param max - Maximum salary
 * @param currency - Currency symbol (default: 'R')
 * @returns Formatted salary string
 */
export function formatSalaryRange(min?: number | null, max?: number | null, currency: string = 'R'): string {
  if (!min && !max) return '';
  
  if (min && max) {
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  }
  
  if (min) {
    return `From ${currency}${min.toLocaleString()}`;
  }
  
  return `Up to ${currency}${max?.toLocaleString()}`;
}
