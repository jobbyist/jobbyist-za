export type CookieConsentCategory = 'strictlyNecessary' | 'analytics' | 'advertising';

export interface CookieConsentState {
  strictlyNecessary: true;
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
}

export const COOKIE_CONSENT_STORAGE_KEY = 'jobbyist:cookie-consent:v1';

export const defaultCookieConsent: CookieConsentState = {
  strictlyNecessary: true,
  analytics: false,
  advertising: false,
  updatedAt: new Date(0).toISOString(),
};

export function parseCookieConsent(raw: string | null): CookieConsentState {
  if (!raw) return defaultCookieConsent;

  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;

    return {
      strictlyNecessary: true,
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return defaultCookieConsent;
  }
}
