import { useEffect, useRef } from 'react';

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
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent duplicate initialization
    if (isInitialized.current) return;
    
    try {
      // Initialize adsbygoogle array if it doesn't exist
      window.adsbygoogle = window.adsbygoogle || [];
      // Push the ad to the adsbygoogle array
      window.adsbygoogle.push({});
      isInitialized.current = true;
    } catch (err) {
      console.error('Error loading AdSense:', err);
    }
  }, [slot, client]);

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
