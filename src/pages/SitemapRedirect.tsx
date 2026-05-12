// Redirects /sitemap.xml requests to the dynamic sitemap edge function
// for clients that hit the SPA route (rare — most search engines fetch
// public/sitemap.xml directly, which already proxies via sitemap-index).
import { useEffect } from "react";

const FN_URL = "https://vkwnhhwacizjiwusbmcm.supabase.co/functions/v1/sitemap";

const SitemapRedirect = () => {
  useEffect(() => { window.location.replace(FN_URL); }, []);
  return null;
};

export default SitemapRedirect;
