import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE = Deno.env.get("SITEMAP_BASE_URL") || "https://za.jobbyist.africa";
const CANONICAL_FACETS = {
  locations: ["johannesburg", "cape-town", "durban", "pretoria", "remote"],
  categories: ["software-engineering", "finance", "marketing", "sales", "data-science"],
};

const toDate = (value?: string | null) => {
  if (!value) return new Date().toISOString().split("T")[0];
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString().split("T")[0] : d.toISOString().split("T")[0];
};

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

    push(`${BASE}/`, "1.0", "daily");
    push(`${BASE}/jobs`, "0.9", "daily");
    push(`${BASE}/companies`, "0.8", "weekly");
    push(`${BASE}/pro`, "0.7", "monthly");
    push(`${BASE}/about`, "0.5", "monthly");

    CANONICAL_FACETS.locations.forEach((location) => push(`${BASE}/jobs/${location}`, "0.8", "daily"));
    CANONICAL_FACETS.categories.forEach((category) => push(`${BASE}/jobs/category/${category}`, "0.8", "daily"));

    const { data: jobs } = await supabase
      .from("jobs")
      .select("id, updated_at, posted_at")
      .eq("status", "active")
      .order("posted_at", { ascending: false })
      .limit(10000);

    jobs?.forEach((job: { id: string; updated_at?: string | null; posted_at?: string | null }) => {
      push(`${BASE}/job/${job.id}`, "0.8", "weekly", toDate(job.updated_at || job.posted_at));
    });

    const { data: companies } = await supabase
      .from("companies")
      .select("slug, updated_at")
      .eq("is_active", true)
      .not("slug", "is", null)
      .limit(5000);

    companies?.forEach((company: { slug: string; updated_at?: string | null }) => {
      push(`${BASE}/company/${company.slug}`, "0.7", "weekly", toDate(company.updated_at));
    });

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
