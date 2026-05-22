/**
 * SponsoredBannerSlot
 *
 * Renders the correct sponsored unit for a given slot key:
 *  - homepage_mid / job_list_mid  →  Shopify affiliate banner
 *  - category_top / guide_top / guide_bottom / homepage_top  →  Google AdSense
 *  - resource_hub_mid  →  "Place Your Ad Here" placeholder (opens advertiser inquiry modal)
 *
 * Hidden for Pro / Premium subscribers.
 * Hidden on blocked routes (legal, auth, onboarding, sensitive flows).
 */
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { isBannerAllowedOnPath, type SlotKey } from '@/lib/sponsoredBannerConfig';
import GoogleAdsense from '@/components/GoogleAdsense';
import AdvertiserInquiryModal from '@/components/AdvertiserInquiryModal';
import { Megaphone } from 'lucide-react';

const ADSENSE_CLIENT = 'ca-pub-1237323355260727';
const ADSENSE_SLOT = '9775464302';

/* ─── Shopify Affiliate Banner ─────────────────────────────────────── */
const ShopifyAffiliateBanner = () => (
  <div className="w-full flex flex-col items-center py-2 overflow-hidden">
    <a
      href="https://shopify.pxf.io/c/5713213/3797168/13624"
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block w-full max-w-3xl mx-auto"
      aria-label="Start your business with Shopify (sponsored)"
    >
      {/* Placeholder shown until a real creative image src is supplied */}
      <div
        className="w-full rounded-lg flex items-center justify-center gap-3 px-4 py-6 sm:py-8
                    bg-gradient-to-r from-emerald-600 to-emerald-500 select-none"
      >
        <span className="text-2xl" aria-hidden="true">🛒</span>
        <div className="text-white text-center">
          <p className="font-semibold text-sm sm:text-base leading-tight">
            Start your online business with Shopify
          </p>
          <p className="text-xs text-emerald-100 mt-0.5 hidden sm:block">
            Free trial available — no credit card required
          </p>
        </div>
      </div>
    </a>

    {/* Impact / Shopify tracking pixel — zero-dimension, invisible */}
    <img
      src="https://imp.pxf.io/i/5713213/3797168/13624"
      width={0}
      height={0}
      alt=""
      aria-hidden="true"
      className="absolute opacity-0 pointer-events-none"
    />

    <p className="text-[10px] leading-none text-muted-foreground mt-1.5">Sponsored</p>
  </div>
);

/* ─── "Place Your Ad Here" Placeholder ─────────────────────────────── */
const PlaceYourAdHerePlaceholder = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full border-2 border-dashed border-border rounded-lg flex flex-col
                   items-center justify-center gap-2 py-8 px-4 text-center
                   hover:border-primary/50 hover:bg-primary/5 transition-colors group"
        aria-label="Place Your Ad Here — click to enquire about advertising"
      >
        <Megaphone className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
        <p className="font-medium text-sm text-muted-foreground group-hover:text-primary transition-colors">
          Place Your Ad Here
        </p>
        <p className="text-xs text-muted-foreground/70">
          Reach South Africa's most engaged career audience
        </p>
      </button>

      <AdvertiserInquiryModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

/* ─── Main component ────────────────────────────────────────────────── */
interface SponsoredBannerSlotProps {
  slotKey: SlotKey;
  className?: string;
}

const SponsoredBannerSlot = ({ slotKey, className = '' }: SponsoredBannerSlotProps) => {
  const { pathname } = useLocation();
  const { isPremium, loading: subLoading } = useSubscription();

  // Block on restricted routes
  if (!isBannerAllowedOnPath(pathname)) return null;

  // Hide for premium/pro users (suppress after subscription has resolved)
  if (!subLoading && isPremium()) return null;

  const wrapperClass = `w-full my-6 ${className}`.trim();

  if (slotKey === 'resource_hub_mid') {
    return (
      <div className={wrapperClass}>
        <PlaceYourAdHerePlaceholder />
      </div>
    );
  }

  if (slotKey === 'homepage_mid' || slotKey === 'job_list_mid') {
    return (
      <div className={wrapperClass}>
        <ShopifyAffiliateBanner />
      </div>
    );
  }

  // All other slots → Google AdSense
  return (
    <div className={wrapperClass}>
      <GoogleAdsense
        client={ADSENSE_CLIENT}
        slot={ADSENSE_SLOT}
        format="auto"
        responsive={true}
      />
    </div>
  );
};

export default SponsoredBannerSlot;
