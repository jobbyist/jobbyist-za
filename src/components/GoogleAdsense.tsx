import { useEffect } from 'react';
import { useCookieConsent } from './CookieConsent';

// Extend the Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface GoogleAdsenseProps {
  slot: string;
  client: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

const GoogleAdsense = ({
  slot,
  client,
  format = 'auto',
  responsive = true,
  className = '',
}: GoogleAdsenseProps) => {
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (!consent.advertising) return;

    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    const existing = document.querySelector(`script[src="${src}"]`);
    if (!existing) {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    try {
      // Initialize adsbygoogle array if it doesn't exist
      window.adsbygoogle = window.adsbygoogle || [];
      // Push the ad to the adsbygoogle array
      // AdSense handles duplicate initialization internally
      window.adsbygoogle.push({});
    } catch (err) {
      console.error('Error loading AdSense:', err);
    }
  }, [client, consent.advertising]);

  if (!consent.advertising) return null;

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

export default GoogleAdsense;
