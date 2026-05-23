// Dynamic sitemap.xml — includes all active jobs, companies, location & SEO landing pages.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE = "https://za.jobbyist.africa";
const LOCATIONS = ["Johannesburg", "Pretoria", "Cape Town", "Durban", "Sandton", "Centurion", "Port Elizabeth", "Bloemfontein", "East London", "Stellenbosch"];
const CATEGORIES = ["software-engineering", "finance", "marketing", "sales", "design", "data-science", "customer-support", "human-resources", "operations", "healthcare"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });
  }
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const today = new Date().toISOString().split("T")[0];
    const urls: string[] = [];
    const push = (loc: string, priority = "0.7", changefreq = "weekly", lastmod = today) =>
      urls.push(`<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`);

    // Static pages
    push(`${BASE}/`, "1.0", "daily");
    push(`${BASE}/jobs`, "0.9", "daily");
    push(`${BASE}/companies`, "0.8", "weekly");
    push(`${BASE}/pro`, "0.7", "monthly");
    push(`${BASE}/about`, "0.5", "monthly");
    push(`${BASE}/resource-center`, "0.7", "weekly");
    push(`${BASE}/resume-builder`, "0.6", "monthly");
    push(`${BASE}/upskilling`, "0.6", "monthly");
    push(`${BASE}/job-matcher`, "0.7", "weekly");

    // Programmatic location landing pages
    LOCATIONS.forEach((l) => push(`${BASE}/jobs?location=${encodeURIComponent(l)}`, "0.8", "daily"));
    LOCATIONS.forEach((l) => push(`${BASE}/jobs/${l.toLowerCase().replace(/\s+/g, "-")}`, "0.8", "daily"));
    // Programmatic category landing pages
    CATEGORIES.forEach((c) => push(`${BASE}/jobs/category/${c}`, "0.8", "daily"));
    // Category × location combinations
    CATEGORIES.forEach((c) =>
      LOCATIONS.forEach((l) => push(`${BASE}/jobs/category/${c}/${l.toLowerCase().replace(/\s+/g, "-")}`, "0.7", "weekly")),
    );

    // Active jobs
    const { data: jobs } = await supabase.from("jobs").select("id, updated_at, posted_at").eq("status", "active").order("posted_at", { ascending: false }).limit(5000);
    jobs?.forEach((j: any) => push(`${BASE}/job/${j.id}`, "0.8", "weekly", new Date(j.updated_at || j.posted_at).toISOString().split("T")[0]));

    // Companies
    const { data: companies } = await supabase.from("companies").select("slug, updated_at").eq("is_active", true).limit(2000);
    companies?.forEach((c: any) => push(`${BASE}/company/${c.slug}`, "0.7", "weekly", new Date(c.updated_at).toISOString().split("T")[0]));

    // Blog posts
    const { data: posts } = await supabase.from("blog_posts").select("slug, updated_at").eq("is_published", true).limit(2000);
    posts?.forEach((p: any) => push(`${BASE}/blog/${p.slug}`, "0.6", "monthly", new Date(p.updated_at).toISOString().split("T")[0]));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response(`error: ${(e as Error).message}`, { status: 500 });
  }
});
