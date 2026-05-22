// Redirects /sitemap.xml requests to the dynamic sitemap edge function
// for clients that hit the SPA route (rare — most search engines fetch
// public/sitemap.xml directly, which already proxies via sitemap-index).
import { useEffect } from "react";
import { SEOHead } from '@/components/SEOHead';

const FN_URL = "https://vkwnhhwacizjiwusbmcm.supabase.co/functions/v1/sitemap";

const SitemapRedirect = () => {
  useEffect(() => { window.location.replace(FN_URL); }, []);
  return <SEOHead title="Sitemap Redirect | Jobbyist" description="Redirecting to sitemap." canonicalUrl="https://za.jobbyist.africa/sitemap.xml" noindex={true} />;
};

export default SitemapRedirect;
