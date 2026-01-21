import { useEffect } from 'react';

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
  useEffect(() => {
    try {
      // Push the ad to the adsbygoogle array
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('Error loading AdSense:', err);
    }
  }, []);

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
