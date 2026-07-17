// Firecrawl job scraper — scrapes job listings using Firecrawl API
// Requires FIRECRAWL_API_KEY
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAdminOrService } from "../_shared/auth.ts";
import { indexInsertedJob } from "../_shared/google-indexing.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Target job sites to scrape
const JOB_SITES = [
  "https://www.careers24.com/jobs",
  "https://www.pnet.co.za/jobs",
  "https://www.indeed.co.za/jobs",
];

interface FirecrawlResult {
  success: boolean;
  data?: {
    markdown?: string;
    html?: string;
    metadata?: {
      title?: string;
      description?: string;
    };
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authFail = await requireAdminOrService(req);
  if (authFail) return authFail;

  try {
    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) throw new Error("Firecrawl API key not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json().catch(() => ({}));
    const targetCount = body.targetCount || 10;

    let created = 0, companies = 0, considered = 0;

    // Scrape each job site
    for (const siteUrl of JOB_SITES) {
      if (created >= targetCount) break;

      console.log(`Scraping: ${siteUrl}`);

      // Call Firecrawl API to scrape the job listing page
      const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: siteUrl,
          formats: ["markdown"],
          onlyMainContent: true,
        }),
      });

      if (!scrapeResponse.ok) {
        console.error(`Firecrawl scrape failed for ${siteUrl}: ${scrapeResponse.status}`);
        continue;
      }

      const result: FirecrawlResult = await scrapeResponse.json();
      if (!result.success || !result.data?.markdown) {
        console.error(`No data returned for ${siteUrl}`);
        continue;
      }

      // Parse markdown to extract job listings
      const markdown = result.data.markdown;
      const jobs = parseJobListings(markdown, siteUrl);
      considered += jobs.length;

      // Insert jobs into database
      for (const job of jobs) {
        if (created >= targetCount) break;

        // Check for duplicates
        const { data: dup } = await supabase
          .from("jobs").select("id").eq("external_url", job.url).maybeSingle();
        if (dup) continue;

        // Get or create company
        let companyId: string | null = null;
        const companySlug = slug(job.company);
        const { data: existing } = await supabase
          .from("companies").select("id").eq("slug", companySlug).maybeSingle();
        
        if (existing) {
          companyId = existing.id;
        } else {
          const { data: nc } = await supabase.from("companies").insert({
            name: job.company,
            slug: companySlug,
            country: "ZA",
            is_active: true,
            location: job.location || "South Africa",
            description: `${job.company} — hiring in South Africa.`,
          }).select("id").single();
          if (nc) { companyId = nc.id; companies++; }
        }

        if (!companyId) continue;

        // Insert job
        const { data: insertedJob, error } = await supabase.from("jobs").insert({
          company_id: companyId,
          title: job.title,
          description: job.description,
          location: job.location || "South Africa",
          country: "ZA",
          external_url: job.url,
          source_url: job.url,
          source_name: "Firecrawl",
          source: "firecrawl",
          status: "active",
          posted_at: new Date().toISOString(),
        }).select("id, slug").single();

        if (!error) {
          created++;
          void indexInsertedJob(insertedJob);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, source: "firecrawl", created, companies, considered }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Firecrawl scraper error:", e);
    return new Response(
      JSON.stringify({ success: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Simple parser to extract job listings from markdown (placeholder - needs refinement)
function parseJobListings(markdown: string, sourceUrl: string) {
  // This is a simplified parser - you'll need to customize based on actual site structure
  return [];
}
