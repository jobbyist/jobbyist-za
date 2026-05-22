import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  COOKIE_CONSENT_STORAGE_KEY,
  defaultCookieConsent,
  parseCookieConsent,
  type CookieConsentState,
} from '@/lib/cookieConsent';

interface CookieConsentContextType {
  consent: CookieConsentState;
  hasChoice: boolean;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  saveConsent: (updates: Pick<CookieConsentState, 'analytics' | 'advertising'>) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [consent, setConsent] = useState<CookieConsentState>(defaultCookieConsent);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const localState = parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
    setConsent(localState);
    setHydrated(true);
  }, []);

  const persistConsent = useCallback(async (next: CookieConsentState) => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(next));

    if (user) {
      await (supabase as any).from('user_cookie_consents').upsert(
        {
          user_id: user.id,
          analytics: next.analytics,
          advertising: next.advertising,
          updated_at: next.updatedAt,
        },
        { onConflict: 'user_id' }
      );
    }
  }, [user]);

  const saveConsent = useCallback((updates: Pick<CookieConsentState, 'analytics' | 'advertising'>) => {
    const next: CookieConsentState = {
      strictlyNecessary: true,
      analytics: updates.analytics,
      advertising: updates.advertising,
      updatedAt: new Date().toISOString(),
    };

    setConsent(next);
    void persistConsent(next);
    setIsSettingsOpen(false);
  }, [persistConsent]);

  const hasChoice = hydrated && consent.updatedAt !== defaultCookieConsent.updatedAt;

  const value = useMemo(() => ({
    consent,
    hasChoice,
    isSettingsOpen,
    openSettings: () => setIsSettingsOpen(true),
    closeSettings: () => setIsSettingsOpen(false),
    saveConsent,
  }), [consent, hasChoice, isSettingsOpen, saveConsent]);

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      <CookieConsentBanner />
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return context;
};

const CookieConsentBanner = () => {
  const { consent, hasChoice, isSettingsOpen, closeSettings, openSettings, saveConsent } = useCookieConsent();
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [advertising, setAdvertising] = useState(consent.advertising);

  useEffect(() => {
    setAnalytics(consent.analytics);
    setAdvertising(consent.advertising);
  }, [consent]);

  const showBanner = !hasChoice || isSettingsOpen;
  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <Card className="mx-auto max-w-3xl border border-border shadow-xl">
        <CardHeader>
          <CardTitle>Cookie Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We use strictly necessary cookies to run the site, and optional analytics/advertising cookies only with your consent.
            You can update choices any time from <strong>Cookie Settings</strong>.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label className="font-medium">Strictly necessary</Label>
                <p className="text-xs text-muted-foreground">Required for authentication, security and core site functionality.</p>
              </div>
              <span className="text-xs font-semibold">Always active</span>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="analytics-consent" className="font-medium">Analytics</Label>
                <p className="text-xs text-muted-foreground">Helps us measure usage and improve product performance.</p>
              </div>
              <Switch id="analytics-consent" checked={analytics} onCheckedChange={setAnalytics} />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="advertising-consent" className="font-medium">Advertising</Label>
                <p className="text-xs text-muted-foreground">Enables advertising cookies and personalized ad measurement.</p>
              </div>
              <Switch id="advertising-consent" checked={advertising} onCheckedChange={setAdvertising} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => saveConsent({ analytics: false, advertising: false })}>Reject optional</Button>
            <Button onClick={() => saveConsent({ analytics: true, advertising: true })}>Accept all</Button>
            <Button variant="secondary" onClick={() => saveConsent({ analytics, advertising })}>Save preferences</Button>
            {hasChoice && <Button variant="ghost" onClick={closeSettings}>Close</Button>}
          </div>
          <p className="text-xs text-muted-foreground">Read full details on our <Link className="underline" to="/cookies" onClick={closeSettings}>Cookie Policy</Link>.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export const CookieSettingsLink = ({ className = '' }: { className?: string }) => {
  const { openSettings } = useCookieConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      Cookie Settings
    </button>
  );
};
